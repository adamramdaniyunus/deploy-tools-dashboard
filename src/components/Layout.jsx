import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useHeader } from '../context/HeaderContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { header } = useHeader();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    // { name: 'Projects', href: '/projects', icon: 'folder_open' },
    { name: 'Nodes', href: '/nodes', icon: 'dns' },
    { name: 'Activity Logs', href: '/activity', icon: 'article' },
    { name: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-background-dark text-white font-display overflow-hidden">
      {/* Side Navigation */}
      <aside className="flex w-20 flex-col items-center border-r border-border-dark bg-surface-dark py-6 lg:w-64 lg:items-stretch lg:px-4 z-20">
        <div className="mb-8 flex items-center justify-center lg:justify-start lg:gap-3 lg:px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-black">
            <span className="material-symbols-outlined text-xl font-bold">terminal</span>
          </div>
          <h1 className="hidden text-xl font-bold tracking-tight text-white lg:block">AUTO_DEPLOY</h1>
        </div>
        
        <nav className="flex flex-1 flex-col gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                  isActive 
                    ? 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <span className={clsx("material-symbols-outlined", isActive && "fill-1")}>{item.icon}</span>
                <span className="hidden font-medium lg:block">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border-dark pt-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-white/5 cursor-pointer">
            <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-700 ring-2 ring-border-dark">
              <img 
                alt="Profile avatar" 
                className="h-full w-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeJCEgUwk4OtCkBxiURHL_LBHaejREOtp93rD5LTJg6-moBXJPOMs_8BD7AWwx_aQHIJQbdlyUr3QAvzuj86402FFAyiZwM3c5wBuiDSD-vyY4U358Ah9t3yy_d3pNpSZvxnoTcOSszHdmBAEk44RNpLJ8yuKCrbTZbyZNyYRZuG22EqDtF7XfJ7YpxWkFivU1u2ZkxpYJsCCBu0Qsb2U2wAVy2bsPRwkbIDoN3Ns8ObVyevOhgi3fR3KNnrpsHyBwf7kMeyYkOfpO"
              />
            </div>
            <div className="hidden flex-col lg:flex">
              <p className="text-sm font-medium text-white">Alex Chen</p>
              <p className="text-xs text-slate-400">DevOps Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-hidden bg-background-dark custom-scrollbar relative">
        {/* Dynamic Header */}
        {header ? header : (
             <header className="flex h-16 w-full items-center justify-between border-b border-border-dark bg-background-dark/50 px-6 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">// {
                        location.pathname === '/' ? 'System Overview' : 
                        navigation.find(i => location.pathname.startsWith(i.href))?.name || 'Dashboard'
                    }</h2>
                    <div className="hidden h-1.5 w-1.5 rounded-full bg-primary animate-pulse md:block"></div>
                    <span className="hidden text-xs font-mono text-primary md:block">LIVE FEED</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-lg border border-border-dark bg-surface-dark px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        Last 24h
                    </button>
                    <Link to="/projects/new" className="flex items-center justify-center rounded-lg bg-primary p-2 text-background-dark transition-transform hover:scale-105 active:scale-95">
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    </Link>
                </div>
            </header>
        )}

        {/* Scrollable Area */}
        <div className="flex-1 overflow-hidden flex flex-col h-full relative"> 
            <div className="flex-1 overflow-y-auto mt-16"> 
                {children}
            </div>
        </div>
      </main>
    </div>
  );
}
