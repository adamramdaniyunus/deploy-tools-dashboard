import clsx from 'clsx';

export default function ServerToolCard({ icon, color, label, name, checked, onChange }) {
  // Styles based on checked state
  const containerClasses = clsx(
    "cursor-pointer relative flex flex-col gap-2 p-4 rounded-lg border transition-all group/check",
    checked 
      ? "border-primary bg-primary/5 shadow-[0_0_10px_rgba(0,230,203,0.05)]" 
      : "border-border-dark bg-background-dark/50 hover:border-primary/50 hover:bg-primary/5"
  );

  return (
    <label className={containerClasses}>
        <div className="flex justify-between items-start">
            <span className={clsx("material-symbols-outlined", color)}>{icon}</span>
            <input 
                type="checkbox" 
                name={name}
                checked={checked}
                onChange={onChange}
                className="rounded border-slate-600 bg-surface-dark text-primary focus:ring-0 focus:ring-offset-0" 
            />
        </div>
        <span className="font-medium text-sm text-white">{label}</span>
    </label>
  );
}
