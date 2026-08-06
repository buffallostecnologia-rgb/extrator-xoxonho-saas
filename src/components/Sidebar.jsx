import React from 'react';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { LayoutDashboard, Database, FolderHeart, BrainCircuit, LogOut, UserCheck, Sparkles, Home } from 'lucide-react';

function SafeClerkUser() {
  try {
    const { user: clerkUser, isSignedIn } = useUser() || {};
    if (isSignedIn && clerkUser) {
      return (
        <div className="flex items-center gap-3 w-full">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium">Assinante Pro R$59</p>
          </div>
        </div>
      );
    }
  } catch (e) {}
  return null;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, onGoToLanding }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      desc: 'Indicadores & Visão Geral'
    },
    {
      id: 'database',
      label: 'DataBase',
      icon: Database,
      desc: 'Filtro Comercial & Busca'
    },
    {
      id: 'minhas_listas',
      label: 'Minhas Listas',
      icon: FolderHeart,
      desc: 'Listas de Prospecção Salvas'
    },
    {
      id: 'inteligencia',
      label: 'Inteligência',
      icon: BrainCircuit,
      desc: 'Panorama & Dados SP'
    }
  ];

  const handleUserLogout = () => {
    try {
      const { signOut } = useClerk();
      if (signOut) signOut();
    } catch(e) {}
    onLogout();
  };

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 backdrop-blur-xl z-30">
      <div>
        {/* Brand Header com Logo do Mascote Xoxonho */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/25">
            <img src="/logo_gordinho.png" alt="Mascote Xoxonho" className="w-full h-full object-contain rounded-xl bg-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-extrabold text-slate-100 text-sm tracking-tight truncate">Extrator Xoxonho</h1>
            <p className="text-[10px] text-blue-400 font-semibold truncate">Inteligência B2B SP</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="leading-none">{item.label}</div>
                  <div className={`text-[10px] mt-1 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info & Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onGoToLanding}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all border border-slate-800"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Ver Página de Vendas</span>
        </button>

        {/* User Card */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3">
          <SafeClerkUser />
          {user && (
            <>
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleUserLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da Conta</span>
        </button>
      </div>
    </aside>
  );
}
