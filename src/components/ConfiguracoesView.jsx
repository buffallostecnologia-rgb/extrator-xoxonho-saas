import React, { useState, useEffect } from 'react';
import { Settings, BrainCircuit, KeyRound, ExternalLink, Save, CheckCircle2 } from 'lucide-react';

export default function ConfiguracoesView() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas no localStorage
    const savedConfig = localStorage.getItem('xoxonho_ai_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setAiEnabled(parsed.enabled || false);
        setApiKey(parsed.apiKey || '');
      } catch (e) {
        console.error("Erro ao carregar configurações de IA");
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('xoxonho_ai_config', JSON.stringify({
      enabled: aiEnabled,
      apiKey: apiKey
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferências</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Configurações da Conta
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie integrações, limites da sua assinatura e chaves de segurança.
          </p>
        </div>
      </div>

      {/* Bloco de Inteligência Artificial */}
      <div className="glass-card rounded-2xl border border-indigo-500/30 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
        
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                <BrainCircuit className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Ativar Inteligência Artificial (Gemini)
                  {aiEnabled && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      ATIVADA
                    </span>
                  )}
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
                  Conecte a sua própria chave do Google AI Studio para liberar recursos avançados de análise 
                  no painel, escrever mensagens automáticas super persuasivas e analisar concorrentes, 
                  <strong> sem custos adicionais de plataforma</strong>.
                </p>
              </div>
            </div>

            {/* Toggle Switch Customizado */}
            <button 
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${aiEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
              role="switch"
              aria-checked={aiEnabled}
            >
              <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${aiEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${aiEnabled ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-6">
              
              {/* Input da Chave */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  Sua Chave de API (API Key)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Cole sua chave AIzaSy..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-sm"
                  />
                  <button 
                    onClick={handleSave}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all shrink-0 shadow-lg shadow-indigo-500/25"
                  >
                    {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{saved ? 'Salvo!' : 'Salvar Chave'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  🔒 Sua chave fica salva apenas neste navegador e nunca é enviada para os nossos servidores.
                </p>
              </div>

              {/* Tutorial Step by Step */}
              <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                <h4 className="text-xs font-bold text-indigo-300 mb-3">Como gerar sua chave gratuitamente:</h4>
                <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside">
                  <li>Clique no botão azul abaixo para abrir o <strong>Google AI Studio</strong>.</li>
                  <li>Faça login com sua conta do Google comum.</li>
                  <li>Clique no botão azul grande <strong>"Create API key"</strong> no site deles.</li>
                  <li>Copie o código gigante gerado e cole no campo acima.</li>
                </ol>
                <a 
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold border border-slate-700 transition-all text-xs"
                >
                  Pegar Chave API no Google
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
