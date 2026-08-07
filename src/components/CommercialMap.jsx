import React from 'react';
import { Target, Lightbulb, Zap, TrendingUp, Search, PhoneCall, CheckCircle, Stethoscope, ShoppingCart, Building, Factory } from 'lucide-react';
import MarketInsights from './MarketInsights';

export default function CommercialMap() {
  const eliteSegments = [
    {
      id: 'saude',
      title: 'Saúde & Estética Avançada',
      icon: Stethoscope,
      color: 'from-pink-500 to-rose-600',
      gargalo: 'Acham que precisam de "mais seguidores" ou postagens.',
      solucao: 'Tráfego Pago + Automação de Triagem 24/7 ligada a um CRM (Não perder leads caros).'
    },
    {
      id: 'varejo',
      title: 'Varejo & Franquias',
      icon: ShoppingCart,
      color: 'from-orange-500 to-amber-600',
      gargalo: 'Focam apenas no E-commerce tradicional sem re-engajamento.',
      solucao: 'Plataforma Integrada de Vendas + CRM de Retenção e Fidelidade.'
    },
    {
      id: 'imobiliario',
      title: 'Mercado Imobiliário / Construção',
      icon: Building,
      color: 'from-blue-500 to-cyan-600',
      gargalo: 'Um site institucional poluído com 500 imóveis misturados.',
      solucao: 'Landing Pages Únicas de Alta Conversão + Funil CRM rápido p/ corretores.'
    },
    {
      id: 'industria',
      title: 'Indústria B2B & Energia Solar',
      icon: Factory,
      color: 'from-emerald-500 to-teal-600',
      gargalo: 'Acreditam que "ninguém compra produto B2B complexo pela internet".',
      solucao: 'Automação Outbound, LinkedIn Ads e Sistema de Orçamentos Automatizado.'
    }
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Busca no Painel',
      desc: 'Pesquise diretamente no banco de dados do painel por segmento e cidade para extrair listas segmentadas.',
      icon: Search,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      step: '2',
      title: 'Identificação de Gargalo',
      desc: 'Encontrar negócios SEM site, com sites que não abrem no celular ou sem HTTPS (Gatilho de contato).',
      icon: Target,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      step: '3',
      title: 'O "Gancho da Velocidade"',
      desc: 'Ligar alertando sobre a perda de clientes no celular e oferecer estrutura de vendas pronta em 5 dias úteis.',
      icon: PhoneCall,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      step: '4',
      title: 'Fechamento e Escala',
      desc: 'Sinal 50% / Entrega 50%. Feche Manutenção Recorrente (R$ 99/mês). Ofereça Upsell em 3 meses.',
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    }
  ];

  return (
    <div className="mt-12 space-y-8 animate-fadeIn">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Inteligência Comercial & Prospecção</h2>
          <p className="text-xs text-slate-400">Mapas estratégicos baseados em oportunidades reais de mercado B2B.</p>
        </div>
      </div>

      {/* Segmentos de Elite */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" /> Venda o Gargalo Operacional nos Segmentos de Elite
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {eliteSegments.map((segment) => {
            const Icon = segment.icon;
            return (
              <div key={segment.id} className="glass-card rounded-2xl p-5 border border-slate-800/60 flex flex-col relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-700/20 to-transparent rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-4 z-10">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-tr ${segment.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 leading-tight">{segment.title}</h4>
                </div>
                
                <div className="flex-1 space-y-4 z-10">
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-rose-400 uppercase mb-1">O que eles pedem:</div>
                    <p className="text-xs text-slate-300">"{segment.gargalo}"</p>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
                    <div className="text-[10px] font-semibold text-emerald-400 uppercase mb-1">Onde está o Lucro Real:</div>
                    <p className="text-xs text-slate-300 font-medium">"{segment.solucao}"</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Workflow de Abordagem */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Plano de Ataque Prático (Prospecção Fria)
          </h3>
          <div className="relative">
            {/* Linha conectora */}
            <div className="absolute left-[23px] top-4 bottom-8 w-px bg-slate-800"></div>
            
            <div className="space-y-6">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative flex gap-4 z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${step.color} shadow-lg flex-shrink-0 bg-slate-900/50 backdrop-blur-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-sm font-bold text-slate-200">Passo {step.step}: {step.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Escada de Crescimento */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Escada de Crescimento do Cliente
            </h3>
            <p className="text-xs text-slate-400 mb-6">Trilha de evolução dos serviços prestados (LTV longo). Nunca entregue o site e suma.</p>
          </div>
          
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <div className="p-4 rounded-xl border border-slate-700 bg-slate-800/30 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-600 group-hover:bg-blue-500 transition-colors"></div>
              <div className="text-xs font-bold text-slate-500 uppercase w-16">Fase 1</div>
              <div>
                <h5 className="text-sm font-bold text-slate-200">Sites Rápidos & LPs Institucionais</h5>
                <p className="text-xs text-slate-400 mt-0.5">Foco no ganho de caixa rápido e portfólio (1 a 3 meses).</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-900/10 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 group-hover:bg-indigo-500 transition-colors"></div>
              <div className="text-xs font-bold text-blue-400/70 uppercase w-16">Fase 2</div>
              <div>
                <h5 className="text-sm font-bold text-blue-100">Injeção de Tráfego Pago</h5>
                <p className="text-xs text-blue-200/60 mt-0.5">Plugar Google Ads para o site recém entregue (3 a 6 meses).</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-600/10 flex items-center gap-4 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 group-hover:bg-purple-500 transition-colors"></div>
              <div className="text-xs font-bold text-indigo-400 uppercase w-16">Fase 3</div>
              <div>
                <h5 className="text-sm font-bold text-indigo-100">Automação de Vendas & CRM Integrado</h5>
                <p className="text-xs text-indigo-200/70 mt-0.5">Aumentar conversão dos leads caros em vendas (Longo Prazo).</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Renderiza os gráficos avançados e oceanos azuis */}
      <MarketInsights />
    </div>
  );
}
