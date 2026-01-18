import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";
import { useHeader } from '../context/HeaderContext';
import ProjectHeader from '../components/project/ProjectHeader';
import HistorySidebar from '../components/project/HistorySidebar';
import Terminal from '../components/project/Terminal';

// Socket connection
const socket = io(import.meta.env.VITE_API_URL);

export default function ProjectDetail() {
  const { id } = useParams();
  const { setHeader } = useHeader();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Fake history for UI demo, in real app this would come from API
  const [history] = useState([
      { id: '1', hash: '8a2f9c', message: 'Fix: production API endpoint cors issue', time: '2m ago', status: 'success', duration: '45s' },
      { id: '2', hash: '7b1e4d', message: 'Feat: add new payment gateway', time: '1h ago', status: 'failed', duration: '12s' },
      { id: '3', hash: '5c9a2f', message: 'Chore: update dependencies', time: '4h ago', status: 'success', duration: '52s' },
  ]);

  useEffect(() => {
    loadProject();
    
    // Connect to project specific log channel
    const channel = `logs:${id}`;
    socket.on(channel, (data) => {
      setLogs(prev => [...prev, data]);
    });

    socket.on(`status:${id}`, (data) => {
        if (data.status === 'success') {
            toast.success('Deployment completed successfully!');
            setIsDeploying(false);
            loadProject(); // Refresh status
        } else if (data.status === 'failed') {
            toast.error('Deployment failed!');
            setIsDeploying(false);
            loadProject();
        }
    });

    return () => {
      socket.off(channel);
      socket.off(`status:${id}`);
    };
  }, [id]);

  useEffect(() => {
    if (project) {
        setHeader(
            <ProjectHeader 
                project={project} 
                isDeploying={isDeploying} 
                onDeploy={handleDeploy} 
            />
        );
    }
  }, [project, isDeploying, setHeader]);

  const loadProject = async () => {
    try {
      const { data } = await projectService.getById(id);
      setProject(data);
    } catch (error) {
      console.error('Failed to load project:', error);
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!project) return;
    
    setIsDeploying(true);
    setLogs([]); // Clear previous logs on new deploy
    const toastId = toast.loading(`Starting deployment...`);

    try {
        await projectService.deploy(project.id);
        toast.success('Deployment started', { id: toastId });
    } catch (e) {
        toast.error('Deploy request failed: ' + e.message, { id: toastId });
        setIsDeploying(false);
    }
  };

  if (loading) {
     return <div className="text-center text-slate-500 mt-20">Loading...</div>;
  }

  if (!project) {
      return <div className="text-center text-slate-500 mt-20">Project not found</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden h-full"> 
        <HistorySidebar history={history} />
        
        <Terminal 
          logs={logs} 
          isDeploying={isDeploying} 
        />
    </div>
  );
}