import React from 'react';
import { LayoutDashboard, Database, FolderHeart, BrainCircuit } from 'lucide-react';

export default function BottomMobileNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'database', label: 'Dados', icon: Database },
    { id: 'minhas_listas', label: 'Listas', icon: FolderHeart },
    { id: 'inteligencia', label: 'BI', icon: BrainCircuit }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px] transition-all"
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/30' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
