import clsx from 'clsx';

export default function LogLine({ log }) {
  const message = log.message;
  let type = 'INFO';
  let colorClass = 'text-blue-400';
  let messageClass = 'text-slate-300';

  if (message.includes('Error') || message.includes('failed') || message.includes('❌')) {
    type = 'ERROR';
    colorClass = 'text-rose-400';
    messageClass = 'text-rose-300';
  } else if (message.includes('WARN') || message.includes('warning')) {
    type = 'WARN';
    colorClass = 'text-amber-400';
    messageClass = 'text-amber-300';
  } else if (message.includes('Success') || message.includes('completed') || message.includes('Connected') || message.includes('FINISH')) {
    type = 'SUCCESS';
    colorClass = 'text-emerald-400';
    messageClass = 'text-emerald-300';
  } else if (message.startsWith('>')) {
      type = 'CMD';
      colorClass = 'text-purple-400';
      messageClass = 'text-slate-300';
  }

  return (
    <div className="flex gap-4 border-l-2 border-transparent hover:bg-white/[0.02] group">
        <span className="text-slate-600 select-none w-24 shrink-0 text-right font-mono opacity-50 group-hover:opacity-100 transition-opacity">
            [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
        </span>
        <span className={`${colorClass} font-bold w-16 shrink-0 font-mono`}>{type}</span>
        <span className={`${messageClass} break-all whitespace-pre-wrap font-mono`}>{message}</span>
    </div>
  );
}
