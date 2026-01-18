import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function ProjectHeader({ project, isDeploying, onDeploy }) {
  return (
    <header className="flex h-auto flex-col gap-4 border-b border-border-dark bg-surface-dark px-6 py-4 shrink-0">
        <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/projects" className="hover:text-white cursor-pointer transition-colors">Projects</Link>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="hover:text-white cursor-pointer transition-colors">{project.name}</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-primary">Console</span>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-dark border border-border-dark">
                    <span className="material-symbols-outlined text-2xl text-slate-400">
                        {project.type === 'nodejs' ? 'javascript' : 'api'}
                    </span>
                </div>
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-white">{project.name}</h2>
                        <span className={clsx(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            project.lastDeploymentStatus === 'success' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" :
                            project.lastDeploymentStatus === 'failed' ? "border-rose-500/20 bg-rose-500/10 text-rose-400" :
                            "border-slate-500/20 bg-slate-500/10 text-slate-400"
                        )}>
                            <span className="material-symbols-outlined text-[14px]">
                                {project.lastDeploymentStatus === 'success' ? 'check_circle' : 
                                 project.lastDeploymentStatus === 'failed' ? 'error' : 'timelapse'}
                            </span>
                            {project.lastDeploymentStatus === 'success' ? 'Success' : 
                             project.lastDeploymentStatus === 'failed' ? 'Failed' : 'Ready'}
                        </span>
                    </div>
                    <div className="mt-1 flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5 font-mono text-xs">
                            <span className="text-slate-500">Host:</span> {project.host}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-600"></span>
                        <span className="flex items-center gap-1.5 font-mono text-xs">
                             <span className="text-slate-500">Branch:</span> {project.branch}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={onDeploy}
                    disabled={isDeploying}
                    className={clsx(
                        "flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold transition-transform active:scale-95 shadow-lg",
                        isDeploying 
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-primary text-background-dark hover:scale-105 shadow-primary/20"
                    )}
                >
                    {isDeploying ? 'Deploying...' : 'Redeploy'}
                </button>
            </div>
        </div>
      </header>
  );
}
