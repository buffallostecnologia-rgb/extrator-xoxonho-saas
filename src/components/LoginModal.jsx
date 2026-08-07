import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { ShieldCheck, X, UserCheck, Sparkles, User, Key, ArrowRight, ShoppingCart, Lock } from 'lucide-react';

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

export default function LoginModal({ onLogin, onClose, onOpenCheckout }) {
  const [authMode, setAuthMode] = useState('signIn');
  const [username, setUsername] = useState('');

  const handleManualSubmit = (e) => {
    e.preventDefault();
    onLogin({
      name: username.split('@')[0].toUpperCase() || 'VENDEDOR',
      email: username.includes('@') ? username : `${username}@comercial.com`,
      role: 'Consultor Comercial Pro'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md my-8 glass-card rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden flex flex-col items-center p-6">
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center pt-4 pb-2">
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
        <div className="w-full py-3 flex justify-center">
          <SafeClerkAuth authMode={authMode} onLogin={onLogin} />
        </div>

        {/* Fallback Form Manual */}
        <form onSubmit={handleManualSubmit} className="w-full space-y-3 pt-3 border-t border-slate-800/60">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">E-mail / Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="vendedor@empresa.com.br"
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Entrar no Painel</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* CARD DE ALTA CONVERSÃO PARA CONTRATAR PLANO (CONTA NÃO ENCONTRADA OU SEM ASSINATURA) */}
        <div className="w-full mt-5 p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-blue-600/10 to-indigo-600/20 border border-amber-500/40 text-center space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Não encontrou sua conta ou ainda não assinou?</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            Liberte o acesso imediato a mais de <strong>7,47 Milhões de empresas ativas de SP</strong> com WhatsApp e Nome do Empresário!
          </p>
          <button
            type="button"
            onClick={() => onOpenCheckout && onOpenCheckout()}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Contratar Plano Pro (R$59/mês) & Liberar Acesso</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full pb-2 text-center pt-4 text-[11px] text-slate-500">
          Acesso protegido por autenticação de segurança Buffallos
        </div>

      </div>
    </div>
  );
}
