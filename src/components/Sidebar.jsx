import React, { useState, useEffect } from 'react';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { LayoutDashboard, Database, FolderHeart, BrainCircuit, LogOut, UserCheck, Sparkles, Home, Settings, KeyRound, Save, CheckCircle2, ExternalLink, Bot } from 'lucide-react';

// Página customizada para injetar dentro do modal da Clerk
function AISettingsPage() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('xoxonho_ai_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setAiEnabled(parsed.enabled || false);
        setApiKey(parsed.apiKey || '');
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('xoxonho_ai_config', JSON.stringify({ enabled: aiEnabled, apiKey }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Inteligência Artificial (Google Gemini)</h2>
        <p className="text-sm text-slate-500">Conecte sua própria chave de API para habilitar os robôs inteligentes dentro do seu painel B2B.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">Ativar Robô de IA</label>
          <button 
            onClick={() => setAiEnabled(!aiEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${aiEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {aiEnabled && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-slate-500" />
                Sua API Key do Google
              </label>
              <div className="flex flex-col gap-3">
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-mono"
                />
                <button 
                  onClick={handleSave}
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  <span>{saved ? 'Chave Salva Localmente!' : 'Salvar Chave'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-2">Como gerar sua chave gratuitamente:</h4>
              <ol className="text-xs text-slate-500 space-y-1.5 list-decimal list-inside mb-4">
                <li>Acesse o <strong>Google AI Studio</strong>.</li>
                <li>Faça login com sua conta do Google.</li>
                <li>Clique em <strong>"Create API key"</strong>.</li>
                <li>Copie o código gerado e cole acima.</li>
              </ol>
              <a 
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
              >
                Abrir Google AI Studio
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SafeClerkUser() {
  try {
    const { user: clerkUser, isSignedIn } = useUser() || {};
    const clerk = useClerk();

    if (isSignedIn && clerkUser) {
      return (
        <div className="flex items-center gap-3 w-full">
          {/* Avatar com o UserProfile customizado */}
          <UserButton afterSignOutUrl="/">
            <UserButton.UserProfilePage
              label="Configurar IA"
              url="ai-settings"
              labelIcon={<BrainCircuit className="w-4 h-4" />}
            >
              <AISettingsPage />
            </UserButton.UserProfilePage>
          </UserButton>
          
          {/* Textos da Conta transformados em botão clicável */}
          <div 
            onClick={() => clerk.openUserProfile()}
            className="flex-1 min-w-0 cursor-pointer group"
            title="Abrir Configurações da Conta"
          >
            <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
              {clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress}
            </p>
            <p className="text-[10px] text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
              Assinante Pro R$59
            </p>
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
    },
    {
      id: 'consultor',
      label: 'Consultor',
      icon: Bot,
      desc: 'Chat de Vendas com IA'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      desc: 'Conta & Integrações de IA'
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
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 backdrop-blur-xl z-30">
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
          onClick={() => setActiveTab('configuracoes')}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all border border-indigo-500/20 shadow-sm shadow-indigo-500/10"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Configurar CHAVE API (IA)</span>
        </button>

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
