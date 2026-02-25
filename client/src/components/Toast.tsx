import React from 'react';
import { useToastStore } from '../store/toastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            layout
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md min-w-[300px]
              ${t.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
              ${t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
              ${t.type === 'info' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : ''}
              ${t.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : ''}
            `}
          >
            <div className="shrink-0">
              {t.type === 'success' && <CheckCircle size={20} />}
              {t.type === 'error' && <AlertCircle size={20} />}
              {t.type === 'info' && <Info size={20} />}
              {t.type === 'warning' && <AlertTriangle size={20} />}
            </div>
            <p className="flex-1 text-sm font-medium text-slate-200">{t.message}</p>
            <button 
              onClick={() => removeToast(t.id)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
