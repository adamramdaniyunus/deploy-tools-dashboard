import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="font-display min-h-screen bg-background-dark flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 glass-card p-12 rounded-2xl border border-white/5 bg-surface-dark/50 backdrop-blur-xl max-w-lg w-full shadow-2xl">
            <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-2xl bg-surface-dark border border-border-dark flex items-center justify-center shadow-lg group">
                    <span className="material-symbols-outlined text-[40px] text-slate-500 group-hover:text-primary transition-colors">travel_explore</span>
                </div>
            </div>
            
            <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-600 mb-2">404</h1>
            <h2 className="text-xl font-bold text-white mb-4">Page Not Found</h2>
            <p className="text-slate-400 mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 rounded-lg border border-border-dark bg-transparent text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-all"
                >
                    Go Back
                </button>
                <button 
                    onClick={() => navigate('/')}
                    className="px-6 py-3 rounded-lg bg-primary text-black hover:bg-primary-dark font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
        
        <div className="mt-8 text-xs text-slate-600 font-mono">
            ERROR_CODE: PAGE_NOT_FOUND_EXCEPTION
        </div>
    </div>
  );
}
