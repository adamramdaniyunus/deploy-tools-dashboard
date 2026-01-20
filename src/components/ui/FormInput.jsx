export default function FormInput({ id, type = 'text', label, placeholder, ...props }) {
  return (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 tracking-wider" htmlFor={id}>
            {label}
        </label>
        <input 
            id={id}
            type={type}
            placeholder={placeholder}
            className="w-full bg-surface border-border-dark rounded-lg text-white text-sm focus:ring-primary focus:border-primary placeholder:text-slate-600 p-2.5"
            {...props}
        />
    </div>
  );
}
