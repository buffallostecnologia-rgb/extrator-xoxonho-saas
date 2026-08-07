import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import DataBaseView from './components/DataBaseView';
import MinhasListasView from './components/MinhasListasView';
import InteligenciaView from './components/InteligenciaView';
import CheckoutModal from './components/CheckoutModal';
import ObrigadoView from './components/ObrigadoView';
import BottomMobileNav from './components/BottomMobileNav';

export default function App() {
  // Controle de Rota / View Baseado em URL (Path / Hash)
  const getInitialRoute = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (hash.includes('obrigado') || path.includes('obrigado')) return 'obrigado';
    if (hash.includes('app') || path.includes('app')) return 'app';
    if (hash.includes('login') || path.includes('login')) return 'login';
    if (hash.includes('checkout') || path.includes('checkout')) return 'checkout';
    return 'landing';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(() => currentRoute === 'checkout');

  // Estado de Autenticação (localStorage / Clerk)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cnpj_sp_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Aba Ativa dentro do App ('dashboard', 'database', 'minhas_listas', 'inteligencia')
  const [activeTab, setActiveTab] = useState('dashboard');
  const [databaseFilters, setDatabaseFilters] = useState({});

  // Listas Salvas do Vendedor (localStorage)
  const [savedLists, setSavedLists] = useState(() => {
    const saved = localStorage.getItem('cnpj_sp_minhas_listas');
    return saved ? JSON.parse(saved) : [];
  });

  // Sincroniza Rota com a URL (Hash)
  const navigateTo = (route) => {
    setCurrentRoute(route);
    if (route === 'landing') window.location.hash = 'vendas';
    else if (route === 'checkout') {
      window.location.hash = 'checkout';
      setIsCheckoutOpen(true);
    }
    else if (route === 'obrigado') window.location.hash = 'obrigado';
    else if (route === 'login') window.location.hash = 'login';
    else if (route === 'app') window.location.hash = 'app';
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cnpj_sp_user', JSON.stringify(userData));
    navigateTo('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cnpj_sp_user');
    navigateTo('landing');
  };

  const handleSelectFilterFromDashboard = (filters) => {
    setDatabaseFilters(filters);
    setActiveTab('database');
  };

  const handleSaveList = (newList) => {
    const updated = [newList, ...savedLists];
    setSavedLists(updated);
    localStorage.setItem('cnpj_sp_minhas_listas', JSON.stringify(updated));
  };

  const handleDeleteList = (listId) => {
    const updated = savedLists.filter(l => l.id !== listId);
    setSavedLists(updated);
    localStorage.setItem('cnpj_sp_minhas_listas', JSON.stringify(updated));
  };

  // 1. ROTA DE OBRIGADO (Pós-Checkout)
  if (currentRoute === 'obrigado') {
    return <ObrigadoView onGoToApp={() => navigateTo('app')} />;
  }

  // 2. ROTA DE VENDAS / LANDING PAGE
  if (currentRoute === 'landing') {
    return (
      <>
        <LandingPage
          onGoToLogin={() => navigateTo(user ? 'app' : 'login')}
          onSelectPlan={() => setIsCheckoutOpen(true)}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      </>
    );
  }

  // 3. ROTA DE LOGIN
  if (currentRoute === 'login' && !user) {
    return (
      <>
        <LoginModal 
          onLogin={handleLogin} 
          onClose={() => navigateTo('landing')} 
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
        />
      </>
    );
  }

  // 4. ROTA DO APP INTERNO
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar de Navegação */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onGoToLanding={() => navigateTo('landing')}
      />

      {/* Viewport Principal */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardView onSelectFilter={handleSelectFilterFromDashboard} />
        )}

        {activeTab === 'database' && (
          <DataBaseView
            initialFilters={databaseFilters}
            onSaveList={handleSaveList}
          />
        )}

        {activeTab === 'minhas_listas' && (
          <MinhasListasView
            savedLists={savedLists}
            onDeleteList={handleDeleteList}
          />
        )}

        {activeTab === 'inteligencia' && (
          <InteligenciaView />
        )}
      </main>

      {/* Menu Mobile Bottom (PWA) */}
      {user && (
        <BottomMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </div>
  );
}
