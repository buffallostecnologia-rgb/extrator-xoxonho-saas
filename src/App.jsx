import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LoginModal from './components/LoginModal';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import DataBaseView from './components/DataBaseView';
import MinhasListasView from './components/MinhasListasView';
import InteligenciaView from './components/InteligenciaView';

export default function App() {
  // Controle de View Principal ('landing', 'login', 'app')
  const [viewMode, setViewMode] = useState('landing');

  // Estado de Autenticação (localStorage)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cnpj_sp_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Aba Ativa do App ('dashboard', 'database', 'minhas_listas', 'inteligencia')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Filtros iniciais transmitidos do Dashboard -> DataBase
  const [databaseFilters, setDatabaseFilters] = useState({});

  // Listas Salvas do Vendedor (localStorage)
  const [savedLists, setSavedLists] = useState(() => {
    const saved = localStorage.getItem('cnpj_sp_minhas_listas');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva a sessão do usuário
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cnpj_sp_user', JSON.stringify(userData));
    setViewMode('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cnpj_sp_user');
    setViewMode('landing');
  };

  // Ao clicar em um card no Dashboard, aplica o filtro e navega para o DataBase
  const handleSelectFilterFromDashboard = (filters) => {
    setDatabaseFilters(filters);
    setActiveTab('database');
  };

  // Salvar uma nova lista de prospecção
  const handleSaveList = (newList) => {
    const updated = [newList, ...savedLists];
    setSavedLists(updated);
    localStorage.setItem('cnpj_sp_minhas_listas', JSON.stringify(updated));
  };

  // Excluir uma lista
  const handleDeleteList = (listId) => {
    const updated = savedLists.filter(l => l.id !== listId);
    setSavedLists(updated);
    localStorage.setItem('cnpj_sp_minhas_listas', JSON.stringify(updated));
  };

  // Se o usuário clicar em "Acessar Plataforma" na Landing Page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onGoToLogin={() => setViewMode(user ? 'app' : 'login')}
        onSelectPlan={() => setViewMode(user ? 'app' : 'login')}
      />
    );
  }

  // Se for pra tela de login
  if (viewMode === 'login' && !user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar de Navegação */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onGoToLanding={() => setViewMode('landing')}
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
    </div>
  );
}
