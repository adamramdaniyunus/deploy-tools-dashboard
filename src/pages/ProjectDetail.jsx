import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const { setHeader } = useHeader();
  
  const [logs, setLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected); 

  const { data: project, isLoading: projectLoading, isError: projectError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id).then(res => res.data),
    enabled: !!id
  });

  const { data: history = [] } = useQuery({
    queryKey: ['project-history', id],
    queryFn: () => projectService.getHistory(id).then(res => res.data),
    enabled: !!id
  });

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (socket.connected) {
        setIsConnected(true);
    }

    // Trigger terminal check only once when mounting and id valid
    if (id) {
       checkTerminal();
    }
    
    // Connect to project specific log channel
    const channel = `logs:${id}`;
    socket.on(channel, (data) => {
      setLogs(prev => [...prev, data]);
    });

    socket.on(`status:${id}`, (data) => {
        if (data.status === 'success') {
            toast.success('Deployment completed successfully!');
            setIsDeploying(false);
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['project', id] });
            queryClient.invalidateQueries({ queryKey: ['project-history', id] });
        } else if (data.status === 'failed') {
            toast.error('Deployment failed!');
            setIsDeploying(false);
            queryClient.invalidateQueries({ queryKey: ['project', id] });
            queryClient.invalidateQueries({ queryKey: ['project-history', id] });
        }
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(channel);
      socket.off(`status:${id}`);
    };
  }, [id, queryClient]);

  // Header update
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

  // --- Actions ---
  const checkTerminal = async () => {
      try {
          setLogs([]);
          await projectService.getSystemInfo(id);
      } catch (error) {
          console.error('Failed to check terminal:', error);
      }
  };

  const handleDeploy = async () => {
    if (!project) return;
    
    setIsDeploying(true);
    setLogs([]); 
    const toastId = toast.loading(`Starting deployment...`);

    try {
        await projectService.deploy(project.id);
        toast.success('Deployment started', { id: toastId });
    } catch (e) {
        toast.error('Deploy request failed: ' + e.message, { id: toastId });
        setIsDeploying(false);
    }
  };

  const handleCommand = async (cmd) => {
      if (!project) return;
      try {
          await projectService.executeCommand(project.id, cmd);
      } catch (error) {
          console.error("Command failed", error);
          toast.error("Failed to send command");
      }
  };

  if (projectLoading) {
     return <div className="text-center text-slate-500 mt-20">Loading...</div>;
  }

  if (projectError || !project) {
      return <div className="text-center text-slate-500 mt-20">Project not found</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden h-full"> 
        <HistorySidebar history={history} />
        
        <Terminal 
          logs={logs} 
          isDeploying={isDeploying} 
          isConnected={isConnected}
          onCommand={handleCommand}
        />
    </div>
  );
}