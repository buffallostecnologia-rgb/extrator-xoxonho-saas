import React, { useState } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { ShieldCheck, X, UserCheck, Sparkles } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }) {
  const [authMode, setAuthMode] = useState('signIn'); // 'signIn' | 'signUp'
  const { isSignedIn, user } = useUser();

  // Se o Clerk já autenticou o usuário, notifica a aplicação pai
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-md my-8 glass-card rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden flex flex-col items-center">
        
        {/* Botão de Fechar se fornecido */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header com Mascot Branding */}
        <div className="text-center pt-8 px-6 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-3 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 p-0.5">
            <img src="/logo_gordinho.png" alt="Xoxonho Logo" className="w-full h-full object-contain rounded-2xl bg-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center justify-center gap-2">
            <span>Autenticação Clerk</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Acesso seguro ao Extrator Xoxonho SP</p>
        </div>

        {/* Tab Toggle: Entrar vs Criar Conta */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 mb-4 my-2">
          <button
            onClick={() => setAuthMode('signIn')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              authMode === 'signIn'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fazer Login
          </button>
          <button
            onClick={() => setAuthMode('signUp')}
            className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
              authMode === 'signUp'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Componentes Oficiais do Clerk */}
        <div className="w-full p-6 flex justify-center">
          {authMode === 'signIn' ? (
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
          )}
        </div>

        {/* Modo Demo de Fallback */}
        <div className="w-full pb-6 px-8 text-center border-t border-slate-800/60 pt-4 mt-2">
          <button
            onClick={() => onLogin({ name: 'Consultor Demo', email: 'demo@xoxonho.com.br', role: 'Acesso Rápido' })}
            className="text-xs text-slate-400 hover:text-blue-400 underline transition-colors"
          >
            ⚡ Acessar em Modo de Demonstração Rápida
          </button>
        </div>

      </div>
    </div>
  );
}
