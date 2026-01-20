import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";
import { useHeader } from '../context/HeaderContext';
import CredentialsStep from '../components/project-form/CredentialsStep';
import ConfigurationStep from '../components/project-form/ConfigurationStep';
import RepositoryStep from '../components/project-form/RepositoryStep';
import TerminalPreview from '../components/project-form/TerminalPreview';

// Socket connection
const socket = io(import.meta.env.VITE_API_URL);

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setHeader } = useHeader();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: 'nodejs',
    host: '',
    username: 'root',
    password: '',
    privateKey: '', // Added for new design
    deployPath: '/var/www/html',
    repoUrl: '',
    branch: 'main',
    gitToken: '',
    // Node
    buildCmd: 'npm install && npm run build',
    startCmd: 'npm start',
    // Laravel
    frontendBuildCmd: 'npm run build',
    composerInstall: true,
    laravelOptimize: true,
    runMigrations: false,
    
    port: 22,
    domain: '',

    // Server Setup
    setupType: 'full', // 'full' | 'app'
    tools: [], // Array of selected tools
    installNginx: true,
    installDocker: true,
    installCertbot: false,
    installRedis: false,
    installPostgres: true,
  });

  const [loading, setLoading] = useState(false);
  const [testLogs, setTestLogs] = useState([]);
  const [deployLogs, setDeployLogs] = useState([]);
  const [testingConnection, setTestingConnection] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProjectId, setDeploymentProjectId] = useState(null);

  useEffect(() => {
    // Socket listener for test logs
    socket.on('log:test', (data) => {
        setTestLogs(prev => [...prev, data]);
    });

    // Socket listener for deployment logs
    socket.on('logs', (data) => {
        setDeployLogs(prev => [...prev, data]);
    });

    return () => {
        socket.off('log:test');
        socket.off('logs');
    };
  }, []);

  useEffect(() => {
    if (isEditMode) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
      setHeader(
        <header className="flex h-16 w-full items-center justify-between border-b border-border-dark bg-background-dark/80 px-6 backdrop-blur-md sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight text-white">// {isEditMode ? 'Edit Project' : 'New Project'}</h2>
                <div className="hidden h-px w-8 bg-border-dark md:block"></div>
                <span className="hidden text-xs font-mono text-slate-500 md:block">MODE: WIZARD_SETUP</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                    disabled={isDeploying}
                >
                    {isDeploying ? 'Deploying...' : 'Cancel Setup'}
                </button>
            </div>
        </header>
      );
  }, [isEditMode, navigate, setHeader, isDeploying]);

  const loadProject = async () => {
    const toastId = toast.loading('Loading project details...');
    try {
      const { data } = await projectService.getById(id);
      setFormData(prev => ({ ...prev, ...data }));
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Failed to load project details', { id: toastId });
      console.error('Failed to load project', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleTestConnection = async () => {
    if (!formData.host || !formData.username) {
        toast.error('Please provide Host and Username');
        return;
    }

    setTestingConnection(true);
    setTestLogs([]); // Clear logs
    const toastId = toast.loading('Testing connection...');
    
    try {
        await projectService.testConnection({ 
            ...formData, 
            socketId: socket.id 
        });
        setIsConnected(true);
        toast.success('Connection verified successfully!', { id: toastId });
    } catch (error) {
        console.error(error);
        toast.error('Connection failed: ' + (error.response?.data?.error || error.message), { id: toastId });
        setIsConnected(false);
    } finally {
        setTestingConnection(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setDeployLogs([]); // Clear deployment logs
    const toastId = toast.loading(isEditMode ? 'Updating project...' : 'Creating project and starting deployment...');
    
    try {
      let projectId = id;
      
      // Construct complete payload
      const payload = {
        ...formData
      };

      if (isEditMode) {
        await projectService.update(id, payload);
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        // Create project
        const response = await projectService.create(payload);
        projectId = response.data.id;
        setDeploymentProjectId(projectId);
        toast.success('Project created! Starting deployment...', { id: toastId });
        
        // Start deployment immediately
        setIsDeploying(true);
        setIsConnected(true); // Show as connected during deployment
        
        // Listen to deployment logs for this specific project
        const logChannel = `logs:${projectId}`;
        socket.on(logChannel, (data) => {
          setDeployLogs(prev => [...prev, data]);
        });
        
        // Trigger deployment
        await projectService.deploy(projectId);
        
        // Listen for deployment status
        socket.on(`status:${projectId}`, (data) => {
          if (data.status === 'success') {
            toast.success('Deployment completed successfully!');
            setIsDeploying(false);
            setTimeout(() => navigate('/projects'), 2000);
          } else if (data.status === 'failed') {
            toast.error('Deployment failed!');
            setIsDeploying(false);
          }
        });
      }
      
      if (isEditMode) {
        setTimeout(() => navigate('/projects'), 1000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project: ' + (error.response?.data?.error || error.message), { id: toastId });
      setIsDeploying(false);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = () => {
      const step1Valid = !!(formData.host && formData.username && (formData.password || formData.privateKey));
      const step2Valid = !!(formData.type && formData.deployPath);
      const step3Valid = !!(formData.repoUrl && formData.branch);

      return [
          { label: 'CREDENTIALS', valid: step1Valid },
          { label: 'CONFIGURATION', valid: step2Valid },
          { label: 'REPOSITORY', valid: step3Valid }
      ];
  };

  const steps = getStepStatus();

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="mx-auto w-full max-w-[1600px] p-6 pb-20">
                
                {/* <WizardProgress steps={steps} /> */}

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Form Section */}
                    <div className="xl:col-span-7 flex flex-col gap-8">
                        
                        <CredentialsStep 
                            formData={formData} 
                            handleChange={handleChange} 
                            onTestConnection={handleTestConnection}
                            testing={testingConnection}
                        />

                        <ConfigurationStep 
                            formData={formData} 
                            handleChange={handleChange} 
                        />

                        <RepositoryStep 
                            formData={formData} 
                            handleChange={handleChange} 
                            onDeploy={handleSubmit}
                            loading={loading}
                        />

                    </div>

                    {/* Preview Section */}
                    <TerminalPreview 
                      logs={isDeploying ? deployLogs : testLogs} 
                      isConnected={isConnected}
                      isDeploying={isDeploying}
                    />
                    
                </div>
            </div>
        </div>
    </div>
  );
}
