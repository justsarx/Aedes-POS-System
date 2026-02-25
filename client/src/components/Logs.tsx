import React from 'react';
import { useStore } from '../store/useStore';
import { ScrollText, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const Logs: React.FC = () => {
  const { logs } = useStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 h-full"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
          <Terminal size={24} className="text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-100">System Logs</h2>
          <p className="text-slate-400 text-sm">Real-time database triggers and procedure execution logs</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 flex-1 overflow-hidden flex flex-col font-mono text-sm shadow-inner">
        <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center gap-2 text-slate-400">
          <ScrollText size={16} />
          <span>Console Output</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic text-center mt-10">No logs generated yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={`
                  ${log.type === 'TRIGGER' ? 'text-yellow-400' : 
                    log.type === 'PROCEDURE' ? 'text-blue-400' : 'text-green-400'}
                  font-bold shrink-0 w-24
                `}>
                  {log.type}
                </span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
