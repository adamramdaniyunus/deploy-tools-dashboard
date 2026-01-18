export default function RepositoryStep({ formData, handleChange, onSave, onDeploy, loading }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">code_blocks</span>
            Repository Details
        </h3>
        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-xs uppercase font-semibold text-slate-400">Repository URL</label>
                    <div className="relative glow-focus rounded-lg transition-all duration-300">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">code</span>
                        <input 
                            name="repoUrl"
                            value={formData.repoUrl}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600" 
                            placeholder="https://github.com/username/project.git" 
                            type="text"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-slate-400">Branch</label>
                    <div className="relative glow-focus rounded-lg transition-all duration-300">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">call_split</span>
                        <input 
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600" 
                            type="text" 
                            placeholder="main"
                        />
                    </div>
                </div>
                 <div className="md:col-span-3 space-y-2">
                    <label className="text-xs uppercase font-semibold text-slate-400">Project Name</label>
                    <div className="relative glow-focus rounded-lg transition-all duration-300">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">label</span>
                        <input 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600" 
                            placeholder="My Awesome Project" 
                            type="text"
                        />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border-dark mt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button 
                type="button" 
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
                Save Draft
            </button>
            <button 
                type="button"
                onClick={onDeploy}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary-dark text-black text-sm font-bold shadow-[0_0_20px_rgba(0,230,203,0.3)] hover:shadow-[0_0_30px_rgba(0,230,203,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                {loading ? 'Deploying...' : 'Deploy Project'}
            </button>
        </div>
    </div>
  );
}
