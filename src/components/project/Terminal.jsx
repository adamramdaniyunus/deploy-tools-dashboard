import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import LogLine from './LogLine';

export default function Terminal({ logs, isDeploying }) {
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="flex-1 bg-terminal-bg relative flex flex-col overflow-hidden">
        <div className="absolute top-0 right-0 p-4 pointer-events-none z-10">
            <span className="inline-flex items-center rounded bg-surface-dark/80 backdrop-blur px-2 py-1 text-xs font-mono text-slate-400 border border-border-dark">
                <span className={clsx("h-2 w-2 rounded-full mr-2", isDeploying ? "bg-emerald-500 animate-pulse" : "bg-slate-500")}></span>
                {isDeploying ? 'Live Tail' : 'Disconnected'}
            </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-6 custom-scrollbar">
            <div className="flex flex-col gap-0.5">
                {logs.length === 0 && !isDeploying && (
                     <div className="text-slate-500 italic p-4">Ready to deploy. Click 'Redeploy' to start.</div>
                )}
                
                {logs.map((log, index) => (
                     <LogLine key={index} log={log} />
                ))}
                
                {isDeploying && (
                     <div className="flex gap-4 mt-2">
                        <span className="text-slate-600 select-none w-24 shrink-0 text-right"></span>
                        <span className="w-2.5 h-5 bg-slate-500 animate-pulse block"></span>
                    </div>
                )}
                <div ref={logsEndRef} />
            </div>
        </div>
    </div>
  );
}
