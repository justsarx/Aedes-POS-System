import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              boxShadow: ["0 0 0px rgba(168, 85, 247, 0)", "0 0 50px rgba(168, 85, 247, 0.5)", "0 0 0px rgba(168, 85, 247, 0)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-6 bg-slate-900 rounded-2xl border border-slate-800 mb-6"
          >
            <BrainCircuit size={80} className="text-purple-500" />
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
        >
          AedesCore
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-slate-500 mt-2 font-mono text-sm"
        >
          Initializing Aedes Core...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
