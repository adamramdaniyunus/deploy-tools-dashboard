export default function CredentialsStep({ formData, handleChange }) {
  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                Credentials & SSH Access
            </h3>
            <span className="text-[10px] font-mono text-primary px-2 py-0.5 bg-primary/10 rounded border border-primary/20">REQUIRED</span>
        </div>
        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-slate-400">Host IP Address</label>
                    <div className="relative glow-focus rounded-lg transition-all duration-300">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">dns</span>
                        <input 
                            name="host"
                            value={formData.host}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600" 
                            placeholder="e.g., 192.168.1.100" 
                            type="text"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase font-semibold text-slate-400">Username</label>
                    <div className="relative glow-focus rounded-lg transition-all duration-300">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-[20px]">person</span>
                        <input 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600" 
                            type="text" 
                            placeholder="root"
                        />
                    </div>
                </div>
            </div>
            
            <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center">
                    <label className="text-xs uppercase font-semibold text-slate-400">SSH Password / Private Key</label>
                </div>
                
                <div className="relative glow-focus rounded-lg transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-slate-500 text-[20px]">key</span>
                    <textarea 
                        name="privateKey"
                        value={formData.privateKey || ''}
                        onChange={handleChange}
                        className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono text-slate-300 focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-600 resize-none custom-scrollbar" 
                        placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----&#10;&#10;OR Enter your Password here" 
                        rows="5"
                    ></textarea>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    Key/Password is encrypted with AES-256 before storage.
                </p>
            </div>
            <div className="flex justify-end">
                <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-xs font-bold uppercase tracking-wide">
                    <span className="material-symbols-outlined text-[18px]">network_check</span>
                    Test Connection
                </button>
            </div>
        </div>
    </div>
  );
}
