import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';
import { useHeader } from '../context/HeaderContext';
import WizardProgress from '../components/project-form/WizardProgress';
import CredentialsStep from '../components/project-form/CredentialsStep';
import ConfigurationStep from '../components/project-form/ConfigurationStep';
import RepositoryStep from '../components/project-form/RepositoryStep';
import TerminalPreview from '../components/project-form/TerminalPreview';

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
    installNginx: true,
    installDocker: true,
    installCertbot: false,
    installRedis: false,
    installPostgres: true,
  });

  const [loading, setLoading] = useState(false);

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
                >
                    Cancel Setup
                </button>
            </div>
        </header>
      );
  }, [isEditMode, navigate, setHeader]);

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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditMode ? 'Updating project...' : 'Initiailzing deployment...');
    
    try {
      if (isEditMode) {
        await projectService.update(id, formData);
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        await projectService.create(formData);
        toast.success('Project created & deployed successfully!', { id: toastId });
      }
      setTimeout(() => navigate('/projects'), 1000); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project: ' + (error.response?.data?.error || error.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="mx-auto w-full">
                
                <WizardProgress />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    {/* Form Section */}
                    <div className="xl:col-span-7 flex flex-col gap-8">
                        
                        <CredentialsStep 
                            formData={formData} 
                            handleChange={handleChange} 
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
                    <TerminalPreview />
                    
                </div>
            </div>
        </div>
    </div>
  );
}
