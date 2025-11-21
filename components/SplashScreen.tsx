
import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100] animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
        <div className="w-24 h-24 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-10 mb-8 animate-bounce">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
        Ecclesia<span className="text-emerald-400">Pro</span>
      </h1>
      <p className="text-slate-400 text-sm mb-12 tracking-wide uppercase font-semibold">Church Management System</p>

      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
        <span className="text-emerald-500/80 text-xs font-medium animate-pulse">Initializing Secure Environment...</span>
      </div>
    </div>
  );
};
