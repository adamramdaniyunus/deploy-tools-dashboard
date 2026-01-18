import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import { ServerIcon, PlayIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

// Socket connection
const socket = io("http://localhost:3001");

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Log Viewer State
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const logsEndRef = useRef(null);

  useEffect(() => {
    loadProjects();
    
    // Global listener for status updates
    // In a real app, you'd listen to specific channels here too
    
    return () => {
      socket.off();
    };
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, showLogs]);

  const loadProjects = async () => {
    try {
      const { data } = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async (project) => {
    setActiveProjectId(project.id);
    setLogs([]);
    setShowLogs(true);
    
    const toastId = toast.loading(`Starting deployment for ${project.name}...`);

    // Listen to specific channel for this project
    const channel = `logs:${project.id}`;
    socket.off(channel); // clear previous listeners
    socket.on(channel, (data) => {
      setLogs(prev => [...prev, data]);
    });
    
    // Listen for completion
    socket.on(`status:${project.id}`, (data) => {
         if (data.status === 'success') {
             toast.success(`Deployment successful!`, { id: toastId });
             loadProjects(); // Refresh status
         } else {
             toast.error(`Deployment failed!`, { id: toastId });
         }
    });

    try {
        await projectService.deploy(project.id);
    } catch (e) {
        toast.error('Deploy request failed: ' + e.message, { id: toastId });
        setShowLogs(false);
    }
  };

  const closeLogs = () => {
    setShowLogs(false);
    setActiveProjectId(null);
  };

  if (loading) {
    return <div className="text-center text-textMuted mt-20">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <div className="text-center py-20 card border-dashed border-white/10 bg-transparent">
            <ServerIcon className="w-16 h-16 text-textMuted/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
            <p className="text-textMuted mb-6">Start by adding your first project deployment configuration.</p>
            <Link to="/projects/new" className="btn btn-primary inline-flex">
                Create Project
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card group relative overflow-hidden">
               {/* Status Indicator Stripe */}
               <div className={`absolute top-0 left-0 w-1 h-full ${
                   project.lastDeploymentStatus === 'success' ? 'bg-success' : 
                   project.lastDeploymentStatus === 'failed' ? 'bg-danger' : 'bg-textMuted'
               }`}></div>

              <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-textMuted flex items-center gap-1 mt-1 font-mono text-xs">
                    {project.host}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-white/5 text-textMuted uppercase border border-white/5">
                  {project.type}
                </span>
              </div>

              <div className="space-y-3 mb-6 pl-2">
                <div className="flex justify-between text-sm">
                    <span className="text-textMuted">Branch</span>
                    <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded text-xs">{project.branch}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-textMuted">Last Deploy</span>
                    <span className={`font-medium ${
                        project.lastDeploymentStatus === 'success' ? 'text-success' : 
                        project.lastDeploymentStatus === 'failed' ? 'text-danger' : 'text-textMuted'
                    }`}>
                        {project.lastDeployedAt ? new Date(project.lastDeployedAt).toLocaleDateString() : 'Never'}
                    </span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto pl-2">
                <button 
                    onClick={() => handleDeploy(project)}
                    className="flex-1 btn btn-primary text-sm shadow-none"
                >
                  <PlayIcon className="w-4 h-4" /> Deploy
                </button>
                <Link 
                    to={`/projects/${project.id}/edit`}
                    className="btn btn-secondary px-3"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Viewer Modal */}
      {showLogs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[80vh]">
                  <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-white/5">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-sm font-mono text-white">Deployment Logs</span>
                      </div>
                      <button onClick={closeLogs} className="text-textMuted hover:text-white">
                          <XMarkIcon className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-[#1e1e1e] text-gray-300 space-y-1">
                      {logs.length === 0 && (
                          <div className="text-textMuted italic animate-pulse">Waiting for logs...</div>
                      )}
                      {logs.map((log, index) => (
                          <div key={index} className="break-all border-l-2 border-transparent hover:border-white/10 pl-2">
                              <span className="text-gray-500 text-xs mr-3 select-none">
                                  {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                              <span>{log.message}</span>
                          </div>
                      ))}
                      <div ref={logsEndRef} />
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
