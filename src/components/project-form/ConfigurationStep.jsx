import { useState, useEffect } from 'react';
import clsx from 'clsx';
import ServerToolCard from './ServerToolCard';
import { toolsService, projectTypesService } from '../../services/api';
import toast from 'react-hot-toast';

export default function ConfigurationStep({ formData, handleChange }) {
  const [tools, setTools] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toolsRes, typesRes] = await Promise.all([
        toolsService.getAll(),
        projectTypesService.getAll()
      ]);
      
      setTools(toolsRes.data.data || []);
      setProjectTypes(typesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch configuration data:', error);
      toast.error('Failed to load configuration options');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupTypeChange = (type) => {
    handleChange({
        target: {
            name: 'setupType',
            value: type
        }
    });
  };

  const handleToolToggle = (toolName) => {
    const currentTools = formData.tools || [];
    const newTools = currentTools.includes(toolName)
      ? currentTools.filter(t => t !== toolName)
      : [...currentTools, toolName];
    
    handleChange({
      target: {
        name: 'tools',
        value: newTools
      }
    });
  };

  // Icon mapping for tools
  const toolIcons = {
    'nginx': { icon: 'dns', color: 'text-emerald-400' },
    'docker': { icon: 'layers', color: 'text-blue-400' },
    'nodejs': { icon: 'code', color: 'text-green-400' },
    'php': { icon: 'code', color: 'text-purple-400' },
    'mysql': { icon: 'database', color: 'text-orange-400' },
    'composer': { icon: 'package', color: 'text-amber-400' },
    'git': { icon: 'source', color: 'text-red-400' },
    'pm2': { icon: 'settings', color: 'text-cyan-400' },
    'firewall': { icon: 'shield', color: 'text-blue-500' },
    'ufw': { icon: 'security', color: 'text-indigo-400' },
    'static': { icon: 'description', color: 'text-gray-400' },
  };

  return (
    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">settings</span>
            Server Configuration
        </h3>
        <div className="bg-surface-dark p-6 rounded-xl border border-border-dark shadow-sm">
            <div className="flex flex-wrap gap-4 mb-6">
                 {/* App Type Selector */}
                <div className="w-full md:w-auto">
                    <label className="text-xs uppercase font-semibold text-slate-400 mb-2 block">App Type</label>
                    <div className="relative">
                        <select 
                            name="type" 
                            value={formData.type} 
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full md:w-48 appearance-none bg-background-dark border border-border-dark text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 pr-8 disabled:opacity-50"
                        >
                            {loading ? (
                              <option>Loading...</option>
                            ) : projectTypes.length > 0 ? (
                              projectTypes.map(type => (
                                <option key={type.id} value={type.name}>
                                  {type.name.charAt(0).toUpperCase() + type.name.slice(1).replace('-', ' + ')}
                                </option>
                              ))
                            ) : (
                              <>
                                <option value="nodejs">Node.js</option>
                                <option value="php">PHP / Laravel</option>
                                <option value="laravel-react">Laravel + React</option>
                                <option value="static">Static Site</option>
                              </>
                            )}
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
                    {loading ? (
                      <div className="text-center py-8 text-slate-400">
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        <p className="mt-2 text-sm">Loading tools...</p>
                      </div>
                    ) : tools.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {tools.map(tool => {
                          const iconData = toolIcons[tool.name] || { icon: 'extension', color: 'text-gray-400' };
                          return (
                            <ServerToolCard 
                              key={tool.id}
                              icon={iconData.icon}
                              color={iconData.color}
                              label={tool.name.charAt(0).toUpperCase() + tool.name.slice(1)}
                              name={tool.name}
                              checked={(formData.tools || []).includes(tool.name)}
                              onChange={() => handleToolToggle(tool.name)}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <span className="material-symbols-outlined text-4xl">inbox</span>
                        <p className="mt-2 text-sm">No tools available</p>
                      </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}
