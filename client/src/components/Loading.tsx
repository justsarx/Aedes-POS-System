import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-900/50 backdrop-blur-sm z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin relative z-10" />
      </div>
      <p className="mt-4 text-slate-400 font-medium animate-pulse">Loading Aedes Engine...</p>
    </div>
  );
};
