import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PlusIcon, CubeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Layout({ children }) {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'New Project', href: '/projects/new', icon: PlusIcon },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-surface border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <CubeIcon className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            AutoDeploy
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-textMuted hover:bg-white/5 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 text-xs text-textMuted text-center border-t border-white/5">
          v1.0.0 • Local Dashboard
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-background/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-white">
            {location.pathname === '/' ? 'Dashboard' : 
             location.pathname === '/projects/new' ? 'Add New Project' : 'Project Details'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-success"></div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
