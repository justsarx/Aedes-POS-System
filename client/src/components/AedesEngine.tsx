import React, { useEffect, useState } from 'react';
import { Play, TrendingUp, AlertTriangle, Clock, BrainCircuit } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Loading } from './Loading';

export const AedesEngine: React.FC = () => {
  const { products, runEngine, fetchProducts, isLoading, trainAI } = useStore();
  const [now] = useState(() => Date.now());

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading && products.length === 0) {
    return <Loading />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6 h-full"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <BrainCircuit className="text-purple-500" />
            Aedes Engine Dashboard
          </h2>
          <p className="text-slate-400">Real-time dynamic pricing control center</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => trainAI()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <TrendingUp size={20} /> Train AI Model
          </button>
          <button 
            onClick={() => runEngine()}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Play size={20} /> Run Pricing Cycle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Expiry Risk</h3>
              <p className="text-sm text-slate-400">Products nearing expiry</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {products.filter(p => {
              if (!p.EXPIRY_DATE) return false;
              const days = Math.ceil((new Date(p.EXPIRY_DATE).getTime() - now) / (1000 * 3600 * 24));
              return days <= 7 && days > 0;
            }).length}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Scarcity Alert</h3>
              <p className="text-sm text-slate-400">Low stock items</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {products.filter(p => (p.STOCK || 0) < 10 && (p.STOCK || 0) > 0).length}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">High Demand</h3>
              <p className="text-sm text-slate-400">Trending products</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {products.filter(p => (p.TREND_SCORE || 0) > 80).length}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="font-bold text-lg text-slate-100 mb-4">Live Pricing Adjustments</h3>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
            {products.map(p => {
              const basePrice = p.BASE_PRICE || 0;
              const currentPrice = p.CURRENT_PRICE || 0;
              const priceDiff = currentPrice - basePrice;
              const percentDiff = basePrice > 0 ? (priceDiff / basePrice) * 100 : 0;
              const isTrending = (p.TREND_SCORE || 0) > 80;
              const isScarce = (p.STOCK || 0) < 10;
              const isExpiring = p.EXPIRY_DATE && new Date(p.EXPIRY_DATE) < new Date(now + 7 * 24 * 60 * 60 * 1000);

              return (
                <motion.div 
                  key={p.ID}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-slate-900/50 px-2 py-1 rounded text-xs font-mono text-slate-400">
                      {p.SKU || 'N/A'}
                    </div>
                    {priceDiff !== 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        priceDiff > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {priceDiff > 0 ? '+' : ''}{percentDiff.toFixed(1)}%
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-100 truncate mb-1" title={p.NAME}>{p.NAME || 'Unknown'}</h4>
                  
                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Current Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">₹{currentPrice.toFixed(2)}</span>
                        {basePrice !== currentPrice && (
                          <span className="text-xs text-slate-500 line-through">₹{basePrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-700/50">
                    {isTrending && (
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded flex items-center gap-1">
                        Trending <TrendingUp size={12} />
                      </span>
                    )}
                    {isScarce && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded flex items-center gap-1">
                        Scarce <AlertTriangle size={12} />
                      </span>
                    )}
                    {isExpiring && (
                      <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded flex items-center gap-1">
                        Expiring <Clock size={12} />
                      </span>
                    )}
                    {!isTrending && !isScarce && !isExpiring && (
                      <span className="text-xs text-slate-500 italic">Stable</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
