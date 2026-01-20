import clsx from 'clsx';
import AuthMarketingSide from './AuthMarketingSide';

export default function AuthLayout({ children, showSidebar = true }) {
  return (
    <div className="font-display antialiased min-h-screen flex items-center justify-center p-6 bg-background-dark text-slate-300">
      <div className={clsx(
          "w-full gap-0 overflow-hidden rounded-2xl border border-border-dark bg-surface-dark shadow-2xl glow-subtle transition-all duration-300",
          showSidebar ? "max-w-5xl grid grid-cols-1 lg:grid-cols-2" : "max-w-md"
      )}>
        {showSidebar && <AuthMarketingSide />}
        <div className="p-10 lg:p-16 flex flex-col justify-center bg-background-dark h-full">
            {children}
        </div>
      </div>
    </div>
  );
}
