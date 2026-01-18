import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/api';
import clsx from 'clsx';
import toast from 'react-hot-toast'; 
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    type: 'nodejs',
    host: '',
    username: '',
    password: '',
    deployPath: '/var/www/',
    repoUrl: '',
    branch: 'main',
    gitToken: '',
    // Node
    buildCmd: 'npm install && npm run build',
    startCmd: 'npm start',
    // Laravel
    frontendBuildCmd: 'npm run build',
    composerInstall: true,
    laravelOptimize: true,
    runMigrations: false,
    
    port: 3000,
    domain: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    const toastId = toast.loading('Loading project details...');
    try {
      const { data } = await projectService.getById(id);
      setFormData(prev => ({ ...prev, ...data }));
      toast.dismiss(toastId);
    } catch (error) {
      toast.error('Failed to load project details', { id: toastId });
      console.error('Failed to load project', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditMode ? 'Updating project...' : 'Creating project...');
    
    try {
      if (isEditMode) {
        await projectService.update(id, formData);
        toast.success('Project updated successfully!', { id: toastId });
      } else {
        await projectService.create(formData);
        toast.success('Project created successfully!', { id: toastId });
      }
      setTimeout(() => navigate('/'), 1000); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to save project: ' + (error.response?.data?.error || error.message), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const isLaravel = formData.type === 'laravel-react' || formData.type === 'php';
  const isNode = formData.type === 'nodejs';

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8 flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/5 transition-colors">
          <ArrowLeftIcon className="w-6 h-6 text-textMuted" />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            {isEditMode ? 'Edit Project' : 'New Project'}
          </h1>
          <p className="text-textMuted text-sm">Configure your deployment settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Info */}
        <section className="card">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Project Name</label>
              <input 
                type="text" name="name" required
                value={formData.name} onChange={handleChange}
                className="input-field" placeholder="My Awesome App"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Application Type</label>
              <div className="relative">
                <select 
                  name="type" 
                  value={formData.type} onChange={handleChange}
                  className="input-field appearance-none cursor-pointer"
                >
                  <option value="nodejs">Node.js</option>
                  <option value="php">PHP / Laravel</option>
                  <option value="laravel-react">Laravel + React</option>
                  <option value="static">Static Site</option>
                  <option value="python">Python</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-textMuted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Server Config */}
        <section className="card">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
            Server Connection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Host IP</label>
              <input 
                type="text" name="host" required
                value={formData.host} onChange={handleChange}
                className="input-field font-mono" placeholder="192.168.1.100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">SSH Port</label>
              <input 
                type="number" name="port"
                value={formData.port} onChange={handleChange}
                className="input-field font-mono" placeholder="22"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">SSH Username</label>
              <input 
                type="text" name="username" required
                value={formData.username} onChange={handleChange}
                className="input-field font-mono" placeholder="root"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">SSH Password</label>
              <input 
                type="password" name="password" required
                value={formData.password} onChange={handleChange}
                className="input-field font-mono" placeholder="••••••••"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-textMuted mb-2">Deploy Path</label>
              <input 
                type="text" name="deployPath" required
                value={formData.deployPath} onChange={handleChange}
                className="input-field font-mono" placeholder="/var/www/html/my-app"
              />
            </div>
          </div>
        </section>

        {/* Git Config */}
        <section className="card">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-amber-500 rounded-full"></span>
            Git Repository
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-textMuted mb-2">Repository URL</label>
              <input 
                type="url" name="repoUrl" required
                value={formData.repoUrl} onChange={handleChange}
                className="input-field" placeholder="https://github.com/username/repo.git"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Branch</label>
              <input 
                type="text" name="branch"
                value={formData.branch} onChange={handleChange}
                className="input-field" placeholder="main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">Git Token (Optional)</label>
              <input 
                type="password" name="gitToken"
                value={formData.gitToken} onChange={handleChange}
                className="input-field" placeholder="ghp_..."
              />
            </div>
          </div>
        </section>

        {/* Build & Run Config */}
        <section className="card">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Build & Run Configuration
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conditional Node Config */}
            {isNode && (
                <>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-textMuted mb-2">Build Command</label>
                    <input 
                        type="text" name="buildCmd"
                        value={formData.buildCmd} onChange={handleChange}
                        className="input-field font-mono text-sm" placeholder="npm run build"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-textMuted mb-2">Start Command</label>
                    <input 
                        type="text" name="startCmd"
                        value={formData.startCmd} onChange={handleChange}
                        className="input-field font-mono text-sm" placeholder="npm start"
                    />
                </div>
                </>
            )}

            {/* Conditional Laravel Config */}
            {isLaravel && (
                <>
                    {formData.type === 'laravel-react' && (
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-textMuted mb-2">Frontend Build Command</label>
                            <input 
                                type="text" name="frontendBuildCmd"
                                value={formData.frontendBuildCmd} onChange={handleChange}
                                className="input-field font-mono text-sm" placeholder="npm run build"
                            />
                        </div>
                    )}
                    
                    <div className="md:col-span-2 space-y-4 pt-2">
                        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition">
                            <input 
                                type="checkbox" name="composerInstall"
                                checked={formData.composerInstall} onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary/50 bg-[#1e1e1e]" 
                            />
                            <div>
                                <span className="block font-medium text-white">Run Composer Install</span>
                                <span className="text-xs text-textMuted">Installs PHP dependencies</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition">
                            <input 
                                type="checkbox" name="laravelOptimize"
                                checked={formData.laravelOptimize} onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary/50 bg-[#1e1e1e]" 
                            />
                            <div>
                                <span className="block font-medium text-white">Optimize Laravel</span>
                                <span className="text-xs text-textMuted">Executes config:cache, route:cache, and view:cache</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/5 cursor-pointer hover:bg-white/10 transition">
                            <input 
                                type="checkbox" name="runMigrations"
                                checked={formData.runMigrations} onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary/50 bg-[#1e1e1e]" 
                            />
                            <div>
                                <span className="block font-medium text-white">Run Database Migrations</span>
                                <span className="text-xs text-textMuted font-medium text-orange-400">Warning: Changes database schema</span>
                            </div>
                        </label>
                    </div>
                </>
            )}

            <div className="md:col-span-2 mt-4 pt-4 border-t border-white/5">
              <label className="block text-sm font-medium text-textMuted mb-2">Domain (Optional)</label>
              <input 
                type="text" name="domain"
                value={formData.domain} onChange={handleChange}
                className="input-field" placeholder="app.example.com"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn btn-secondary px-6"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className={clsx("btn btn-primary min-w-[140px]", loading && "opacity-75 cursor-not-allowed")}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
          </button>
        </div>

      </form>
    </div>
  );
}
