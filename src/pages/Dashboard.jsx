import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";
import clsx from 'clsx';

// Socket connection
const socket = io(import.meta.env.VITE_API_URL);

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const logsEndRef = useRef(null);

  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    loadProjects();

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
    setIsDeploying(true);

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
    } finally {
      setIsDeploying(false);
    }
  };

  const closeLogs = () => {
    setShowLogs(false);
    setActiveProjectId(null);
  };

  if (loading) {
    return <div className="text-center text-slate-400">Loading system status...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header managed by Layout default */}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* CPU Card */}
            <div className="glow-effect group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-dark bg-surface-dark p-5 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">memory</span>
                  CPU Load
                </h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">+2.1%</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">45%</span>
                <span className="text-sm text-slate-500">usage</span>
              </div>
              {/* Chart Area */}
              <div className="relative mt-4 h-32 w-full overflow-hidden">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0 35 Q 10 30 20 32 T 40 25 T 60 28 T 80 15 T 100 20 L 100 40 L 0 40 Z" fill="url(#gradient-primary)" opacity="0.2"></path>
                  <path d="M0 35 Q 10 30 20 32 T 40 25 T 60 28 T 80 15 T 100 20" fill="none" stroke="#00e6cb" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <defs>
                    <linearGradient id="gradient-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00e6cb', stopOpacity: 0.5 }}></stop>
                      <stop offset="100%" style={{ stopColor: '#00e6cb', stopOpacity: 0 }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Memory Card */}
            <div className="glow-effect group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-dark bg-surface-dark p-5 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">sd_card</span>
                  Memory Usage
                </h3>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">Stable</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">12<span className="text-2xl text-slate-500">GB</span></span>
                <span className="text-sm text-slate-500">/ 16GB</span>
              </div>
              {/* Chart Area */}
              <div className="relative mt-4 h-32 w-full overflow-hidden">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0 20 Q 25 22 50 18 T 100 22 L 100 40 L 0 40 Z" fill="url(#gradient-purple)" opacity="0.2"></path>
                  <path d="M0 20 Q 25 22 50 18 T 100 22" fill="none" stroke="#a78bfa" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                  <defs>
                    <linearGradient id="gradient-purple" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#a78bfa', stopOpacity: 0.5 }}></stop>
                      <stop offset="100%" style={{ stopColor: '#a78bfa', stopOpacity: 0 }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Disk I/O Card */}
            <div className="glow-effect group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border-dark bg-surface-dark p-5 transition-all">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                  <span className="material-symbols-outlined text-[18px]">hard_drive</span>
                  Disk I/O
                </h3>
                <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-500">High Load</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">450</span>
                <span className="text-sm text-slate-500">MB/s</span>
              </div>
              {/* Bar Chart Simulation */}
              <div className="mt-4 flex h-32 w-full items-end justify-between gap-1">
                <div className="h-[40%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[60%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[30%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[80%] w-full rounded-sm bg-rose-500"></div>
                <div className="h-[50%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[70%] w-full rounded-sm bg-rose-500"></div>
                <div className="h-[45%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[55%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[35%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[90%] w-full rounded-sm bg-rose-500"></div>
              </div>
            </div>
          </div>

          {/* Deployments Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-primary font-mono">//</span> ACTIVE DEPLOYMENTS
              </h2>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors" title="Filter list">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
                <button
                  className="p-2 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors"
                  title="Refresh status"
                  onClick={loadProjects}
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>

            {/* Data Grid */}
            <div className="overflow-hidden rounded-xl border border-border-dark bg-surface-dark shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                  <thead className="bg-black/20 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold tracking-wider">Project Name</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Environment</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                      <th className="px-6 py-4 font-semibold tracking-wider">Last Updated</th>
                      <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-dark">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                          No projects configured.
                          <Link to="/projects/new" className="text-primary hover:underline ml-1">Create one?</Link>
                        </td>
                      </tr>
                    ) : (
                      projects.map(project => (
                        <tr key={project.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-4 text-white">
                            <div className="flex flex-col">
                              <span className="font-medium">{project.name}</span>
                              <span className="font-mono text-xs text-slate-500">{project.type} • {project.branch}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={clsx(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                              "border-blue-500/20 bg-blue-500/10 text-blue-400"
                            )}>
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                              Production
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={clsx(
                              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                              project.lastDeploymentStatus === 'success'
                                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : project.lastDeploymentStatus === 'failed'
                                  ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                                  : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                            )}>
                              <span className="material-symbols-outlined text-[14px]">
                                {project.lastDeploymentStatus === 'success' ? 'check_circle' :
                                  project.lastDeploymentStatus === 'failed' ? 'error' : 'timelapse'}
                              </span>
                              {project.lastDeploymentStatus === 'success' ? 'Success' :
                                project.lastDeploymentStatus === 'failed' ? 'Failed' : 'Ready'}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs">
                            {project.lastDeployedAt ? new Date(project.lastDeployedAt).toLocaleTimeString() : 'Never'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="flex items-center justify-center rounded border border-border-dark p-1.5 text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
                                title="View Logs"
                                onClick={() => { setActiveProjectId(project.id); setShowLogs(true); }}
                              >
                                <span className="material-symbols-outlined text-[18px]">terminal</span>
                              </button>
                              <Link
                                to={`/projects/${project.id}/edit`}
                                className="flex items-center justify-center rounded border border-border-dark p-1.5 text-slate-400 hover:border-slate-500 hover:text-white transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                              </Link>
                              <button
                                className="flex items-center justify-center rounded bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-black transition-colors"
                                onClick={() => handleDeploy(project)}
                                disabled={isDeploying}
                              >
                                Redeploy
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination / Footer */}
              <div className="flex items-center justify-between border-t border-border-dark bg-black/20 px-6 py-3">
                <span className="text-xs text-slate-500">Showing {projects.length} deployments</span>
                <div className="flex gap-1">
                  <button className="flex h-7 w-7 items-center justify-center rounded border border-border-dark text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="flex h-7 w-7 items-center justify-center rounded border border-border-dark text-slate-400 hover:bg-white/5 hover:text-white" disabled>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Log Viewer Modal */}
          {showLogs && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-4xl bg-surface-dark rounded-xl shadow-2xl overflow-hidden border border-border-dark flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-border-dark">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm font-mono text-white">Live Deployment Logs</span>
                  </div>
                  <button onClick={closeLogs} className="text-slate-400 hover:text-white">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4 font-mono text-sm bg-[#131315] text-slate-300 space-y-1 custom-scrollbar">
                  {logs.length === 0 && (
                    <div className="text-slate-500 italic animate-pulse">Waiting for connection...</div>
                  )}
                  {logs.map((log, index) => (
                    <div key={index} className="break-all border-l-2 border-transparent hover:border-white/10 pl-2">
                      <span className="text-slate-600 text-xs mr-3 select-none">
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
      </div>
    </div>
  );
}
