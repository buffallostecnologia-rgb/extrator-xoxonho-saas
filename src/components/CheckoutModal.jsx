import React, { useState } from 'react';
import { X, CreditCard, QrCode, ShieldCheck, ArrowRight, Loader2, Sparkles, Check } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          cpfCnpj,
          mobilePhone: phone
        })
      });

      const resData = await response.json();

      if (!response.ok || resData.error) {
        throw new Error(resData.error || 'Falha ao gerar cobrança no Asaas.');
      }

      if (resData.invoiceUrl) {
        // Redireciona para o Checkout Oficial do Asaas (PIX, Cartão, Boleto)
        window.location.href = resData.invoiceUrl;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-lg glass-card rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden my-8 p-6 lg:p-8">
        
        {/* Glow Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assinatura Pro sem fidelidade</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Checkout Extrator Xoxonho</h2>
          <p className="text-sm text-slate-400 mt-1">
            Assinatura Única por <strong className="text-emerald-400 font-bold">R$ 59 / mês</strong> (PIX, Cartão ou Boleto)
          </p>
        </div>

        {/* Features Checklist */}
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Acesso ilimitado a <strong>8,11 milhões de empresas de SP</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Extração automática do <strong>Nome do Proprietário/Empresário</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Disparos persuasivos de curiosidade no WhatsApp Web</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Nome Completo / Razão Social
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Carlos Eduardo Oliveira"
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              E-mail para Receber o Acesso
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@empresa.com.br"
              className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                CPF ou CNPJ
              </label>
              <input
                type="text"
                required
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Celular / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(19) 99863-2184"
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 mt-2 bg-gradient-to-r from-emerald-500 via-teal-600 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gerando Cobrança no Asaas...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>PAGAR R$ 59/MÊS E LIBERAR ACESSO</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-center gap-4 text-slate-500 text-xs pt-4 border-t border-slate-800/80">
          <span className="flex items-center gap-1"><QrCode className="w-3.5 h-3.5 text-emerald-400" /> PIX Instantâneo</span>
          <span className="flex items-center gap-1"><CreditCard className="w-3.5 h-3.5 text-blue-400" /> Cartão de Crédito</span>
          <span>🔒 Asaas Gateway Seguro</span>
        </div>

      </div>
    </div>
  );
}
