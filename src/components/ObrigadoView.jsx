import React from 'react';
import { SignUp, SignIn, useUser } from '@clerk/clerk-react';
import { CheckCircle, ShieldCheck, Mail, Sparkles, ArrowRight, Lock, Key } from 'lucide-react';

export default function ObrigadoView({ onGoToApp }) {
  const { isSignedIn, user } = useUser() || {};

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-blue-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full glass-card p-8 lg:p-10 rounded-3xl border border-emerald-500/40 shadow-2xl relative z-10 text-center space-y-6">
        
        {/* Badge de Sucesso */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/30 p-0.5 mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pagamento Confirmado no Asaas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Parabéns! Sua Assinatura Pro R$ 59/mês está Ativa!
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Seu pagamento foi confirmado pelo Gateway Asaas. Você já tem acesso total e irrestrito à base de mais de <strong>8,11 milhões de empresas de SP</strong>!
          </p>
        </div>

        {/* Alerta de E-mail de Boas Vindas */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-center gap-3 text-xs text-slate-300 text-left max-w-md mx-auto">
          <Mail className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <strong className="text-slate-100 block">E-mail de Boas-Vindas Enviado!</strong>
            Enviamos uma cópia do recibo e os detalhes da sua assinatura para o seu e-mail cadastrado.
          </div>
        </div>

        {/* Bloco de Criação de Senha do Clerk */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <h2 className="text-lg font-bold text-slate-200">
            {isSignedIn ? 'Você já está conectado!' : 'Crie sua Senha de Acesso no Clerk'}
          </h2>

          {!isSignedIn ? (
            <div className="w-full flex justify-center py-2">
              <SignUp 
                appearance={{
                  elements: {
                    card: 'bg-transparent shadow-none p-0',
                    headerTitle: 'hidden',
                    headerSubtitle: 'hidden',
                    socialButtonsBlockButton: 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800',
                    formButtonPrimary: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold',
                    footerActionLink: 'text-emerald-400 hover:text-emerald-300'
                  }
                }}
                routing="hash"
              />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
              Sua conta está associada ao e-mail: <strong>{user?.primaryEmailAddress?.emailAddress}</strong>
            </div>
          )}

          <button
            onClick={onGoToApp}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <span>ENTRAR NO PAINEL COMERCIAL AGORA</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
