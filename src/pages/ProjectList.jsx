import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectService } from '../services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import Card from '../components/Card';

export default function ProjectList() {
  const [filter, setFilter] = useState('all'); // all, active, failed, deploying
  const [search, setSearch] = useState('');

  const { data: projects = [], isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(res => res.data),
    staleTime: 60 * 1000
  });

  useEffect(() => {
    if (isError) {
      console.error('Failed to load projects:', error);
      toast.error('Failed to load projects');
    }
  }, [isError, error]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.host.toLowerCase().includes(search.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'active') return p.lastDeploymentStatus === 'success';
    if (filter === 'failed') return p.lastDeploymentStatus === 'failed';
    // Add more filters as needed
    return true;
  });

  const stats = {
      total: projects.length,
      deploying: 0, // In a real app we'd track this via socket or status
      failed: projects.filter(p => p.lastDeploymentStatus === 'failed').length
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="card glow-effect bg-surface-dark group relative flex flex-col justify-between overflow-hidden transition-all">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                    Total Projects
                </h3>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">Active</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">{stats.total}</span>
                <span className="text-sm text-slate-500">repositories</span>
            </div>
            <div className="relative mt-4 h-16 w-full overflow-hidden">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <path d="M0 35 Q 10 30 20 32 T 40 25 T 60 28 T 80 15 T 100 20 L 100 40 L 0 40 Z" fill="url(#gradient-primary)" opacity="0.2"></path>
                    <path d="M0 35 Q 10 30 20 32 T 40 25 T 60 28 T 80 15 T 100 20" fill="none" stroke="#00e6cb" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    <defs>
                        <linearGradient id="gradient-primary" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:'#00e6cb', stopOpacity:0.5}}></stop>
                            <stop offset="100%" style={{stopColor:'#00e6cb', stopOpacity:0}}></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <div className="card glow-effect bg-surface-dark group relative flex flex-col justify-between overflow-hidden transition-all">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    Deploying Now
                </h3>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary animate-pulse">Live</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">0</span>
                <span className="text-sm text-slate-500">pipelines</span>
            </div>
             <div className="relative mt-4 h-16 w-full overflow-hidden">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                    <path d="M0 20 Q 25 22 50 18 T 100 22 L 100 40 L 0 40 Z" fill="url(#gradient-purple)" opacity="0.2"></path>
                    <path d="M0 20 Q 25 22 50 18 T 100 22" fill="none" stroke="#a78bfa" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                    <defs>
                        <linearGradient id="gradient-purple" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:'#a78bfa', stopOpacity:0.5}}></stop>
                            <stop offset="100%" style={{stopColor:'#a78bfa', stopOpacity:0}}></stop>
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        <div className="card glow-effect bg-surface-dark group relative flex flex-col justify-between overflow-hidden transition-all">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-medium text-slate-400">
                    <span className="material-symbols-outlined text-[18px]">bug_report</span>
                    Failed Deploys
                </h3>
                <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-500">Last 24h</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tracking-tight">{stats.failed}</span>
                <span className="text-sm text-slate-500">needs attention</span>
            </div>
             <div className="mt-4 flex h-16 w-full items-end justify-between gap-1">
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[20%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[40%] w-full rounded-sm bg-rose-500"></div>
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[15%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[20%] w-full rounded-sm bg-slate-700/50"></div>
                <div className="h-[10%] w-full rounded-sm bg-slate-700/50"></div>
            </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                <span className="text-primary font-mono">//</span> PROJECT CATALOG
            </h2>
            <div className="flex gap-2">
                 <div className="relative hidden lg:block mr-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                    </span>
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="block w-64 rounded-lg border border-border-dark bg-surface-dark py-1.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" 
                        placeholder="Search projects..." 
                    />
                </div>
                <button 
                  onClick={() => setFilter(filter === 'all' ? 'active' : 'all')}
                  className={clsx(
                    "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    filter === 'active' 
                      ? "border-primary bg-primary/10 text-primary" 
                      : "border-border-dark bg-surface-dark text-slate-300 hover:border-slate-500 hover:text-white"
                  )}
                >
                    <span className="material-symbols-outlined text-[16px]">filter_list</span>
                    {filter === 'all' ? 'Filter' : 'Active Only'}
                </button>
                <Link to="/projects/new" className="hidden md:flex items-center justify-center rounded-lg bg-primary p-2 text-background-dark transition-transform hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                </Link>
            </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
             <div className="col-span-full py-12 text-center text-slate-500">
                 Loading projects...
             </div>
          ) : filteredProjects.length === 0 ? (
             <div className="col-span-full py-12 text-center border-2 border-dashed border-border-dark rounded-xl">
                 <p className="text-slate-400 mb-2">No projects found.</p>
                 <Link to="/projects/new" className="text-primary hover:underline">Create your first project</Link>
             </div>
          ) : (
             filteredProjects.map((project) => (
                <Card key={project.id}>
                    
                    {/* Status Stripe / Loading Line */}
                    {project.status === 'deploying' && (
                        <div className="absolute top-0 right-0 h-[2px] w-full overflow-hidden bg-surface-dark">
                            <div className="h-full w-1/3 bg-primary animate-[loading_1s_infinite_linear]"></div>
                        </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            <div className={clsx(
                                "flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-border-dark",
                                project.type === 'nodejs' ? "bg-slate-800 text-green-400" :
                                project.type === 'php' ? "bg-slate-800 text-purple-400" :
                                "bg-slate-800 text-slate-400"
                            )}>
                                <span className="material-symbols-outlined">
                                    {project.type === 'nodejs' ? 'javascript' : 'layers'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white tracking-tight">{project.name}</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="material-symbols-outlined text-[14px]">call_split</span>
                                    {project.branch}
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                         <div className={clsx(
                                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
                                project.lastDeploymentStatus === 'success' 
                                    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                : project.lastDeploymentStatus === 'failed'
                                    ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                                : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        )}>
                            {project.lastDeploymentStatus === 'success' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>}
                            {project.lastDeploymentStatus === 'failed' && <span className="material-symbols-outlined text-[14px]">error</span>}
                            {project.lastDeploymentStatus === 'success' ? 'Healthy' : 
                             project.lastDeploymentStatus === 'failed' ? 'Failed' : 'Ready'}
                        </div>
                    </div>

                    <div className="my-6 space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Host</span>
                            <span className="text-white font-medium">{project.host}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500">Last Deploy</span>
                            <span className="text-white font-mono">
                                {project.lastDeployedAt ? new Date(project.lastDeployedAt).toLocaleTimeString() : 'Never'}
                            </span>
                        </div>
                         {/* Mini status bar */}
                        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                             <div className={clsx(
                                 "h-full w-full",
                                 project.lastDeploymentStatus === 'success' ? "bg-emerald-500" :
                                 project.lastDeploymentStatus === 'failed' ? "bg-rose-500" : "bg-slate-600"
                             )}></div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex flex-1 items-center justify-center gap-2 rounded border border-border-dark py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[16px]">terminal</span> Logs
                        </button>
                        <Link to={`/projects/${project.id}`} className="flex flex-1 items-center justify-center gap-2 rounded bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-black transition-colors">
                            Manage
                        </Link>
                    </div>
                </Card>
             ))
          )}
        </div>
      </div>
    </div>
  );
}