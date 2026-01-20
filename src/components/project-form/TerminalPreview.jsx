import LogLine from '../project/LogLine';

export default function TerminalPreview({ logs = [], isConnected, isDeploying = false }) {
  const getStatusLabel = () => {
    if (isDeploying) return 'DEPLOYING';
    if (isConnected) return 'CONNECTED';
    return 'DISCONNECTED';
  };

  const getStatusColor = () => {
    if (isDeploying) return 'text-amber-500 bg-amber-400';
    if (isConnected) return 'text-emerald-500 bg-emerald-500';
    return 'text-rose-500 bg-rose-500';
  };

  return (
    <div className="xl:col-span-5 sticky top-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              {isDeploying ? 'Deployment Logs' : 'Live Terminal Preview'}
            </h3>
            <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-1 rounded-full border border-border-dark">
                <span className="flex h-2 w-2 relative">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getStatusColor().split(' ')[1]}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${getStatusColor().split(' ')[1]}`}></span>
                </span>
                <span className={`text-[10px] font-mono font-bold tracking-wider ${getStatusColor().split(' ')[0]}`}>
                    {getStatusLabel()}
                </span>
            </div>
        </div>
        <div className="bg-[#0c0c0e] rounded-xl border border-border-dark font-mono text-xs md:text-sm text-slate-300 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#151518]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {isDeploying ? 'deployment@server' : 'root@vps-01'}: ~
                </div>
                <span className="material-symbols-outlined text-slate-600 text-[14px]">terminal</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2 opacity-90">
                <div className="text-slate-500 mb-4">
                  // System initialized at {new Date().toLocaleTimeString()}
                </div>
                
                {logs.length === 0 && !isDeploying && (
                     <div className="flex items-center">
                        <span className="text-primary mr-2 font-bold">➜</span>
                        <span className="text-slate-400">Ready for connection test...</span>
                        <span className="w-2 h-4 bg-primary blink-cursor ml-1"></span>
                    </div>
                )}

                {logs.length === 0 && isDeploying && (
                     <div className="flex items-center">
                        <span className="text-amber-400 mr-2 font-bold">➜</span>
                        <span className="text-slate-400">Initializing deployment...</span>
                        <span className="w-2 h-4 bg-amber-400 blink-cursor ml-1"></span>
                    </div>
                )}

                {logs.map((log, i) => (
                    <LogLine key={i} log={log} />
                ))}
                

            </div>
        </div>
    </div>
  );
}
