import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { AedesEngine } from './components/AedesEngine';
import { Logs } from './components/Logs';
import { SplashScreen } from './components/SplashScreen';
import { Calendar } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { ToastContainer } from './components/Toast';

type Tab = 'pos' | 'inventory' | 'aedes' | 'logs';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('activeTab');
    return (saved as Tab) || 'pos';
  });
  const [simulatedDate, setSimulatedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>
      <ToastContainer />

      <div className="flex h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header */}
          <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10">
            <h2 className="text-xl font-semibold capitalize">{activeTab === 'aedes' ? 'Aedes Engine' : activeTab}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-md border border-slate-700">
                <Calendar size={14} className="text-slate-400" />
                <input 
                  type="date" 
                  value={simulatedDate} 
                  onChange={(e) => setSimulatedDate(e.target.value)}
                  className="bg-transparent border-none text-sm focus:outline-none text-slate-300"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <span className="font-bold text-xs text-slate-300">S</span>
              </div>
            </div>
          </header>

          {/* Tab Content */}
          <main className="flex-1 overflow-hidden p-6 relative">
            <AnimatePresence mode="wait">
              {activeTab === 'pos' && <POS key="pos" />}
              {activeTab === 'inventory' && <Inventory key="inventory" />}
              {activeTab === 'aedes' && <AedesEngine key="aedes" />}
              {activeTab === 'logs' && <Logs key="logs" />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
