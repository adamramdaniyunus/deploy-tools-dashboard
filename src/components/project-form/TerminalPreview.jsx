export default function TerminalPreview() {
  return (
    <div className="xl:col-span-5 sticky top-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Live Terminal Preview</h3>
            <div className="flex items-center gap-2 bg-background-dark/50 px-3 py-1 rounded-full border border-border-dark">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-wider">CONNECTED: 22ms</span>
            </div>
        </div>
        <div className="bg-[#0c0c0e] rounded-xl border border-border-dark font-mono text-xs md:text-sm text-slate-300 shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#151518]">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">root@vps-01: ~</div>
                <span className="material-symbols-outlined text-slate-600 text-[14px]">terminal</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-2 opacity-90">
                <div className="text-slate-500 mb-4">// System initialized at 14:02:22 UTC</div>
                <div className="flex gap-2">
                    <span className="text-primary font-bold">➜</span>
                    <span className="text-white">ssh root@192.168.1.100 -i ~/.ssh/id_rsa</span>
                </div>
                <p className="text-slate-400">Connecting to remote host...</p>
                <p className="text-emerald-500">✓ Handshake successful (RSA-4096)</p>
                <p className="text-slate-300 mt-2">Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-slate-400 my-2 text-[11px] md:text-xs">
                    <p>System load: <span className="text-white">0.08</span></p>
                    <p>Processes: <span class="text-white">104</span></p>
                    <p>Usage of /: <span class="text-white">12.4% of 24.0GB</span></p>
                    <p>Memory: <span class="text-white">14% used</span></p>
                </div>
                <p className="text-emerald-500">✓ Write access verified.</p>
                <div className="flex gap-2 mt-4">
                    <span className="text-primary font-bold">➜</span>
                    <span className="text-white">sudo apt-get update</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                    Get:1 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]<br/>
                    Get:2 http://archive.ubuntu.com/ubuntu jammy InRelease [270 kB]<br/>
                    Get:3 http://archive.ubuntu.com/ubuntu jammy-updates InRelease [119 kB]<br/>
                    Fetched 499 kB in 1s (432 kB/s)
                </div>
                <p class="text-emerald-500">✓ Package list updated.</p>
                <div className="flex gap-2 mt-4">
                    <span className="text-primary font-bold">➜</span>
                    <span className="text-white">docker --version</span>
                </div>
                <p className="text-slate-300">Docker version 24.0.5, build ced0996</p>
                <div className="flex gap-2 mt-4 opacity-50">
                    <span className="text-primary font-bold">➜</span>
                    <span className="text-white">checking nginx configuration...</span>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center">
                        <span className="text-primary mr-2 font-bold">root@vps-01:~#</span>
                        <span className="text-slate-400">waiting for input...</span>
                        <span className="w-2 h-4 bg-primary blink-cursor ml-1"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
