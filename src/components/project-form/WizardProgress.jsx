import clsx from 'clsx';

export default function WizardProgress() {
  return (
    <div className="mb-12 mt-4">
        <div className="flex items-center w-full max-w-3xl mx-auto">
            <div className="flex flex-col items-center relative z-10 group">
                <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold shadow-[0_0_15px_rgba(0,230,203,0.4)] ring-4 ring-background-dark transition-all duration-300 group-hover:scale-110">1</div>
                <span className="absolute -bottom-8 text-xs font-bold text-primary whitespace-nowrap tracking-wide">CREDENTIALS</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-border-dark mx-4"></div>
            <div className="flex flex-col items-center relative z-10 group">
                <div className="w-10 h-10 rounded-full bg-surface-dark border border-border-dark text-slate-400 flex items-center justify-center font-bold ring-4 ring-background-dark transition-all duration-300 group-hover:border-primary/50 group-hover:text-white">2</div>
                <span className="absolute -bottom-8 text-xs font-medium text-slate-500 whitespace-nowrap tracking-wide group-hover:text-slate-300 transition-colors">CONFIGURATION</span>
            </div>
            <div className="flex-1 h-px bg-border-dark mx-4"></div>
            <div className="flex flex-col items-center relative z-10 group">
                <div className="w-10 h-10 rounded-full bg-surface-dark border border-border-dark text-slate-600 flex items-center justify-center font-bold ring-4 ring-background-dark transition-all duration-300 group-hover:border-primary/30 group-hover:text-slate-400">3</div>
                <span className="absolute -bottom-8 text-xs font-medium text-slate-600 whitespace-nowrap tracking-wide group-hover:text-slate-500 transition-colors">REPOSITORY</span>
            </div>
        </div>
    </div>
  );
}
