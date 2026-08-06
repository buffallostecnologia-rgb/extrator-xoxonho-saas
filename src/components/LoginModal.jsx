import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { ShieldCheck, X, UserCheck, Sparkles, User, Key, ArrowRight } from 'lucide-react';

function SafeClerkAuth({ authMode, onLogin }) {
  try {
    const { isSignedIn, user } = useUser() || {};

    React.useEffect(() => {
      if (isSignedIn && user) {
        onLogin({
          name: user.fullName || user.primaryEmailAddress?.emailAddress.split('@')[0] || 'Cliente Pro',
          email: user.primaryEmailAddress?.emailAddress || 'cliente@saas.com',
          role: 'Assinante Pro R$59',
          clerkId: user.id
        });
      }
    }, [isSignedIn, user, onLogin]);

    return authMode === 'signIn' ? (
      <SignIn 
        appearance={{
          elements: {
            card: 'bg-transparent shadow-none p-0',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800',
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold',
            footerActionLink: 'text-blue-400 hover:text-blue-300'
          }
        }}
        routing="hash"
      />
    ) : (
      <SignUp 
        appearance={{
          elements: {
            card: 'bg-transparent shadow-none p-0',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            socialButtonsBlockButton: 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800',
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold',
            footerActionLink: 'text-blue-400 hover:text-blue-300'
          }
        }}
        routing="hash"
      />
    );
  } catch (e) {
    return null;
  }
}

export default function LoginModal({ onLogin, onClose }) {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn' | 'signUp'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: username.split('@')[0].toUpperCase(),
      email: username.includes('@') ? username : `${username}@comercial.com`,
      role: 'Consultor Comercial'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md my-8 glass-card rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden flex flex-col items-center">
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center pt-8 px-6 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 p-0.5">
            <img src="/logo_gordinho.png" alt="Xoxonho Logo" className="w-full h-full object-contain rounded-2xl bg-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center justify-center gap-2">
            <span>Portal Comercial</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Acesso exclusivo Extrator Xoxonho SP</p>
        </div>

        {/* Clerk Auth Component Wrapper */}
        <div className="w-full p-6 flex justify-center">
          <SafeClerkAuth authMode={authMode} onLogin={onLogin} />
        </div>

        {/* Fallback Form Manual */}
        <form onSubmit={handleManualSubmit} className="w-full px-6 space-y-3 pt-2 border-t border-slate-800/60">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">E-mail / Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vendedor@empresa.com.br"
              className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <span>Entrar com E-mail</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="w-full pb-6 px-8 text-center pt-3">
          <button
            onClick={() => onLogin({ name: 'Consultor VIP', email: 'vip@xoxonho.com.br', role: 'Acesso Direto' })}
            className="text-xs text-slate-400 hover:text-blue-400 underline transition-colors"
          >
            ⚡ Acessar em Modo de Demonstração Rápida
          </button>
        </div>

      </div>
    </div>
  );
}
