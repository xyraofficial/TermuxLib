
import React, { useState, useEffect } from 'react';

const LOG_MESSAGES = [
  "INITIALIZING SYSTEM...",
  "CONNECTING TO REPOSITORY...",
  "FETCHING TERMUX-PACKAGES...",
  "SCANNING PIP LIBRARIES...",
  "VERIFYING CHECKSUMS...",
  "SYNCHRONIZING LOCAL CACHE...",
  "READY."
];

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 80);

    const logTimer = setInterval(() => {
      setCurrentLog((prev) => (prev < LOG_MESSAGES.length - 1 ? prev + 1 : prev));
    }, 400);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center transition-all duration-1000 ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      <div className="w-full max-w-xs px-6">
        {/* Logo / Title in Preloader */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-pulse">
          <div className="w-10 h-10 bg-emerald-500 rounded flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            T
          </div>
          <div className="text-left">
            <h1 className="text-white font-black tracking-tighter text-2xl leading-none">TERMUX<span className="text-emerald-500">LIB</span></h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Synchronization</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-1">
            <div className="space-y-1">
              <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                {LOG_MESSAGES[currentLog]}
              </p>
            </div>
            <span className="text-xs text-zinc-400 font-mono">{progress}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800 p-[2px]">
            <div 
              className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-1 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className={`h-1 bg-emerald-500/50 rounded-full ${i < (progress/4) ? 'opacity-100' : 'opacity-0'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[9px] text-zinc-600 font-mono uppercase tracking-[0.3em]">
          Secure Terminal Connection Established
        </p>
      </div>
    </div>
  );
};

export default Preloader;
