import clsx from 'clsx';
import ServerToolCard from './ServerToolCard';

export default function ConfigurationStep({ formData, handleChange }) {
  
  const handleSetupTypeChange = (type) => {
    handleChange({
        target: {
            name: 'setupType',
            value: type
        }
    });
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">settings</span>
            Server Configuration
        </h3>
        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
            <div className="flex flex-wrap gap-4 mb-6">
                 {/* App Type Selector embedded here as it's configuration */}
                <div className="w-full md:w-auto">
                    <label className="text-xs uppercase font-semibold text-slate-400 mb-2 block">App Type</label>
                    <div className="relative">
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange}
                            className="w-full md:w-48 appearance-none bg-background-dark border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8"
                        >
                            <option value="nodejs">Node.js</option>
                            <option value="php">PHP / Laravel</option>
                            <option value="laravel-react">Laravel + React</option>
                            <option value="static">Static Site</option>
                            <option value="python">Python</option>
                        </select>
                         <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                          <span className="material-symbols-outlined text-[18px]">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-auto">
                     <label className="text-xs uppercase font-semibold text-slate-400 mb-2 block">Deploy Path</label>
                     <input 
                        type="text" 
                        name="deployPath"
                        value={formData.deployPath}
                        onChange={handleChange}
                        className="bg-background-dark border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 font-mono"
                        placeholder="/var/www/html"
                    />
                </div>
            </div>

            <div className="flex p-1 bg-background-dark rounded-lg border border-border-dark mb-6 w-full md:w-fit">
                <button 
                    type="button" 
                    onClick={() => handleSetupTypeChange('full')}
                    className={clsx(
                        "flex-1 md:flex-none px-6 py-2 rounded text-sm font-medium transition-all",
                        formData.setupType === 'full' 
                            ? "bg-primary text-black shadow-sm" 
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    Full Server Setup
                </button>
                <button 
                    type="button" 
                    onClick={() => handleSetupTypeChange('app')}
                    className={clsx(
                        "flex-1 md:flex-none px-6 py-2 rounded text-sm font-medium transition-all",
                        formData.setupType === 'app' 
                            ? "bg-primary text-black shadow-sm" 
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    App Only
                </button>
            </div>

            {formData.setupType === 'full' && (
                <div className="animate-fade-in">
                    <label className="text-xs uppercase font-semibold text-slate-400 mb-3 block">Select Server Tools</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <ServerToolCard 
                            icon="dns" 
                            color="text-emerald-400" 
                            label="Nginx" 
                            name="installNginx"
                            checked={formData.installNginx}
                            onChange={handleChange}
                        />
                        <ServerToolCard 
                            icon="layers" 
                            color="text-blue-400" 
                            label="Docker" 
                            name="installDocker"
                            checked={formData.installDocker}
                            onChange={handleChange}
                        />
                        <ServerToolCard 
                            icon="lock" 
                            color="text-amber-400" 
                            label="Certbot SSL" 
                            name="installCertbot"
                            checked={formData.installCertbot}
                            onChange={handleChange}
                        />
                        <ServerToolCard 
                            icon="speed" 
                            color="text-red-400" 
                            label="Redis Cache" 
                            name="installRedis"
                            checked={formData.installRedis}
                            onChange={handleChange}
                        />
                        <ServerToolCard 
                            icon="database" 
                            color="text-purple-400" 
                            label="PostgreSQL" 
                            name="installPostgres"
                            checked={formData.installPostgres}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
