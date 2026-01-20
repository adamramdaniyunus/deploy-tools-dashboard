export default function AuthMarketingSide() {
  return (
    <div className="p-10 lg:p-16 bg-slate-card flex flex-col justify-between border-r border-border-dark">
        <div>
            <div className="flex items-center gap-3 mb-12">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-primary text-black">
                    <span className="material-symbols-outlined text-2xl font-bold">terminal</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">AUTO_DEPLOY</h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Ship your code <br/><span className="text-primary">faster than ever.</span></h2>
            <p className="text-slate-400 text-lg mb-10 max-w-sm">Connect your stack and automate your entire infrastructure with one-click deployments.</p>
            <div className="space-y-8">
                    <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary">sync_alt</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Automatic Repo Sync</h3>
                        <p className="text-sm text-slate-500">We automatically detect new commits and trigger builds instantly across all regions.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Fast Setup</h3>
                        <p className="text-sm text-slate-500">Proprietary build-engine optimized for Node, Go, and Python. Zero config required.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary">monitoring</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">Live Logs & Metrics</h3>
                        <p className="text-sm text-slate-500">Real-time streaming logs and server health metrics integrated into your dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border-dark flex items-center gap-4 text-xs text-slate-500 font-medium tracking-wide uppercase">
            <span>Trusted by teams at</span>
            <div className="flex gap-4 grayscale opacity-50">
                <div className="h-4 w-16 bg-slate-700 rounded-sm"></div>
                <div className="h-4 w-20 bg-slate-700 rounded-sm"></div>
                <div className="h-4 w-12 bg-slate-700 rounded-sm"></div>
            </div>
        </div>
    </div>
  );
}
