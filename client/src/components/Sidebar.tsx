import React from 'react';
import { ShoppingCart, Package, Activity, Database, Zap } from 'lucide-react';

interface SidebarProps {
  activeTab: 'pos' | 'inventory' | 'aedes' | 'logs';
  setActiveTab: (tab: 'pos' | 'inventory' | 'aedes' | 'logs') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'pos', icon: ShoppingCart, label: 'POS Terminal' },
    { id: 'inventory', icon: Package, label: 'Inventory' },
    { id: 'aedes', icon: Activity, label: 'Aedes Engine' },
    { id: 'logs', icon: Database, label: 'Oracle Logs' },
  ] as const;

  return (
    <div className="w-20 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      <div className="p-4 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-800 h-16">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Zap size={20} className="text-white" />
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight text-white">
          Aedes<span className="text-blue-500">Core</span>
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === item.id 
              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/50' 
              : 'hover:bg-slate-900 text-slate-400'
            }`}
          >
            <item.icon size={20} />
            <span className="hidden lg:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center lg:text-left">
        <span className="hidden lg:inline">Connected to: </span>
        <span className="text-green-500 font-mono">Oracle 21c XE</span>
      </div>
    </div>
  );
};
