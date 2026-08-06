import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  Globe, 
  Building2, 
  BrainCircuit, 
  Zap, 
  ShieldCheck, 
  Star,
  Users,
  Search,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';

export default function LandingPage({ onGoToLogin }) {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* 1. Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-blue-500/25">
              <img src="/logo_gordinho.png" alt="Xoxonho Logo" className="w-full h-full object-contain rounded-2xl bg-slate-900" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-1.5">
                Extrator Xoxonho <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">B2B SP</span>
              </span>
              <span className="text-[11px] text-slate-400 block">Buffallos Tecnologia</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#recursos" className="hover:text-blue-400 transition-colors">Recursos</a>
            <a href="#como-funciona" className="hover:text-blue-400 transition-colors">Como Funciona</a>
            <a href="#plano" className="hover:text-blue-400 transition-colors">Plano & Preço</a>
            <a href="#inteligencia" className="hover:text-blue-400 transition-colors">Inteligência SP</a>
          </div>

          <button
            onClick={onGoToLogin}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Entrar no Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-36 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Base Receita Federal SP Atualizada</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.1]">
              Sua Máquina de <span className="gradient-text">Leads B2B com WhatsApp</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">
              Chega de comprar listas desatualizadas ou perder tempo buscando manualmente. O <strong>Extrator Xoxonho</strong> disponibiliza mais de <strong>8 milhões de empresas de São Paulo</strong> com WhatsApp validado (`wa.me`), filtro por Cidade e CNAE pronto para prospecção imediata.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onGoToLogin}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all transform hover:scale-105"
              >
                <span>Acessar Plataforma Agora</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#plano"
                className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-base flex items-center justify-center gap-2 transition-all text-center"
              >
                Ver Plano por R$ 59/mês
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> +8,11 Milhões de CNPJs SP
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Link WhatsApp Direto (`wa.me`)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exportação CSV & Google Sheets
              </span>
            </div>
          </div>

          {/* Mascote Box Hero */}
          <div className="lg:col-span-5">
            <div className="glass-card p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative text-center group hover:border-blue-500/50 transition-all">
              <div className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 p-1 shadow-2xl shadow-blue-500/30 transform group-hover:scale-105 transition-all">
                <img src="/logo_gordinho.png" alt="Xoxonho Mascote" className="w-full h-full object-contain rounded-3xl bg-slate-900" />
              </div>
              <h2 className="text-2xl font-bold text-slate-100">Mascote Xoxonho</h2>
              <div className="text-xs font-semibold text-blue-400 mt-0.5">CEO Mascot & Inteligência B2B</div>
              <p className="text-xs text-slate-300 mt-4 leading-relaxed italic bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                "Estou comandando os robôs de mineração. Esqueça prospecção manual, deixe o trabalho pesado com o gordinho legal!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bar de Estatísticas */}
      <section className="py-10 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-400">8,11M+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Empresas Ativas em SP</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">59,5K+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">WhatsApps Validados (`wa.me`)</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">645</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Cidades Mapeadas em SP</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Dados Oficiais da Receita</div>
          </div>
        </div>
      </section>

      {/* 4. Recursos / Features */}
      <section id="recursos" className="py-24 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">
            O que o nosso produto entrega com total transparência?
          </h2>
          <p className="text-sm text-slate-400">
            Ferramentas sólidas desenvolvidas para acelerar o pipeline de prospecção do seu time comercial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Filtro por Cidade & CNAE</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Varredura cirúrgica por setor de atividade econômica e cidade. Filtre razão social, nome fantasia, capital social e porte.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Disparo com Mensagem Customizada</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Números de WhatsApp validados com gerador de mensagem personalizada. Clique e abra a conversa com o texto pronto no WhatsApp Web!
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Presença Digital & Websites</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filtro dedicado para identificar empresas com site oficial ativo e e-mail corporativo para abordagens de Cold Mail.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Inteligência de Mercado SP</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Painel de dados com série histórica de 39 anos de aberturas de empresas em SP e ranking do Top 10 setores.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PLANO ÚNICO DE R$ 59/MÊS */}
      <section id="plano" className="py-24 px-6 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sem Pegadinhas • Plano Único e Completo</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Acesso Total por Apenas <span className="gradient-text">R$ 59 / mês</span>
            </h2>
            <p className="text-sm text-slate-400">
              Sem limites escondidos ou taxas extras. Assinatura mensal sem fidelidade. Cancele quando quiser.
            </p>
          </div>

          <div className="glass-card p-10 rounded-3xl border border-blue-500/40 shadow-2xl shadow-blue-500/10 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-2xl font-bold text-slate-100">Plano Pro Extrator Xoxonho</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tudo o que seu time de vendas precisa para prospectar ativamente no estado de São Paulo com dados oficiais e contato direto.
                </p>

                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Acesso Ilimitado à Base de <strong>8.110.152 Empresas de SP</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp Linker (`wa.me`) com Disparo Mensagem Personalizada</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Filtro de 5 Campos (Cidade, CNAE, Website, WhatsApp, Porte)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Filtro por Capital Social Mínimo & Bairro</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exportação para <strong>CSV (Excel)</strong> e <strong>Google Sheets</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Salvamento de Pesquisas em <strong>Minhas Listas</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Suporte Prioritário Buffallos Tecnologia</span>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-5 text-center bg-slate-900/80 p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Valor do Investimento</div>
                <div>
                  <span className="text-5xl font-extrabold text-slate-100">R$ 59</span>
                  <span className="text-xs text-slate-400 font-medium"> / mês</span>
                </div>
                <p className="text-[11px] text-slate-400">Pagamento via PIX, Cartão de Crédito ou Boleto pelo Asaas.</p>

                <button
                  onClick={onOpenCheckout || onGoToLogin}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105"
                >
                  Assinar por R$ 59/mês
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo_gordinho.png" alt="Xoxonho Logo" className="w-8 h-8 rounded-lg bg-slate-900" />
            <span className="font-bold text-slate-200">Extrator Xoxonho B2B SP — Buffallos Tecnologia</span>
          </div>
          <div>
            &copy; 2026 Extrator Xoxonho. Todos os direitos reservados. Desenvolvido por CTO Kiones Peregrino.
          </div>
        </div>
      </footer>
    </div>
  );
}
