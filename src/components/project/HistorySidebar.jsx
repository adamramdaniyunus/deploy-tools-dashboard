import clsx from 'clsx';

export default function HistorySidebar({ history }) {
  return (
    <aside className="hidden lg:flex w-80 border-r border-border-dark bg-surface-dark/30 flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-border-dark flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">History</h3>
            <button className="text-slate-500 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col">
                {/* Fake history items for UI - ideally map from real data */}
                {history.map((item, idx) => (
                    <button key={idx} className="flex items-start gap-3 p-4 border-l-2 border-transparent hover:bg-white/[0.02] text-left transition-colors group">
                        <div className={clsx(
                            "mt-0.5 h-2 w-2 rounded-full transition-all group-hover:ring-4",
                            item.status === 'success' ? "bg-emerald-500 group-hover:ring-emerald-500/10" : "bg-rose-500 group-hover:ring-rose-500/10"
                        )}></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 font-mono">#{item.hash}</span>
                                <span className="text-xs text-slate-500">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate group-hover:text-slate-400">{item.message}</p>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                                <span className={clsx(
                                    "bg-surface-dark border border-border-dark px-1.5 py-0.5 rounded",
                                    item.status === 'success' ? "text-emerald-400" : "text-rose-400"
                                )}>
                                    {item.status === 'success' ? 'Success' : 'Failed'}
                                </span>
                                <span>{item.duration}</span>
                            </div>
                        </div>
                    </button>
                ))}
                <div className="p-4 text-center text-xs text-slate-600 italic">
                    Real history data coming soon...
                </div>
            </div>
        </div>
    </aside>
  );
}
