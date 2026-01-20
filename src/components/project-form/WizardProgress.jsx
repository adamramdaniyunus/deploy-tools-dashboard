import clsx from 'clsx';

export default function WizardProgress({ steps }) {
  return (
    <div className="mb-12 sticky top-0 z-30 bg-background-dark/95 backdrop-blur -mx-6 px-6 border-b border-white/5 md:relative md:top-auto md:bg-transparent md:border-none md:p-0 md:mx-0">
        <div className="flex items-center w-full max-w-3xl mx-auto">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                const isCompleted = step.valid;
                const isActive = !isCompleted && (index === 0 || steps[index - 1].valid); 
                
                return (
                    <div key={step.label} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center relative z-10 group min-w-[40px]">
                            <div className={clsx(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ring-4 ring-background-dark",
                                isCompleted 
                                    ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                                    : isActive 
                                        ? "bg-primary text-black shadow-[0_0_15px_rgba(0,230,203,0.4)]"
                                        : "bg-surface-dark border border-border-dark text-slate-600"
                            )}>
                                {isCompleted ? <span className="material-symbols-outlined text-[20px]">check</span> : (index + 1)}
                            </div>
                            <span className={clsx(
                                "absolute -bottom-8 text-[10px] font-bold whitespace-nowrap tracking-wide transition-colors hidden md:block",
                                isCompleted ? "text-emerald-500" : isActive ? "text-primary" : "text-slate-600"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        
                        {!isLast && (
                            <div className={clsx(
                                "flex-1 h-px mx-4 transition-colors duration-500",
                                isCompleted ? "bg-emerald-500" : "bg-border-dark"
                            )}></div>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );
}
