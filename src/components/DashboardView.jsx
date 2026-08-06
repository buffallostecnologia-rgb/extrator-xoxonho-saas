import React from 'react';
import { 
  Building2, 
  MessageSquare, 
  Globe, 
  Store, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  MapPin,
  Sparkles,
  PieChart as PieIcon
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardView({ onSelectFilter }) {
  // Dados Consolidados de SP e Cidades
  const metrics = [
    {
      id: 'todas',
      title: 'Empresas Ativas SP',
      value: '8.110.152',
      badge: '100% Atualizado',
      color: 'from-blue-600 to-indigo-600',
      icon: Building2,
      desc: 'Base oficial de SP com dados cadastrais',
      filter: {}
    },
    {
      id: 'whatsapp',
      title: 'Com WhatsApp Ativo',
      value: '59.517',
      badge: 'Pronto p/ Disparo',
      color: 'from-emerald-600 to-teal-600',
      icon: MessageSquare,
      desc: 'Validados no formato wa.me',
      filter: { comWhatsapp: true }
    },
    {
      id: 'site',
      title: 'Com Website / Domínio',
      value: '42.180',
      badge: 'Alta Qualidade',
      color: 'from-cyan-600 to-blue-600',
      icon: Globe,
      desc: 'Presença digital identificada',
      filter: { comSite: true }
    },
    {
      id: 'mei',
      title: 'Empresas MEI / ME',
      value: '5.420.000',
      badge: '66.8% do Total',
      color: 'from-purple-600 to-pink-600',
      icon: Store,
      desc: 'Micro e pequenas empresas',
      filter: { categoria: 'MEI' }
    }
  ];

  // Configuração Gráfico de Cobertura Digital
  const doughnutData = {
    labels: ['Com WhatsApp Validado', 'Telefone Fixo / Sem WA'],
    datasets: [
      {
        data: [59517, 90981],
        backgroundColor: ['#10b981', '#334155'],
        borderColor: ['#059669', '#1e293b'],
        borderWidth: 2
      }
    ]
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { size: 12 } }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  // Configuração Gráfico por Cidades
  const barData = {
    labels: ['São Paulo', 'Campinas', 'Piracicaba', 'Barueri', 'Limeira', 'Rio Claro'],
    datasets: [
      {
        label: 'Empresas Ativas',
        data: [2634277, 219889, 67818, 77172, 53007, 29673],
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-card relative overflow-hidden border border-blue-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inteligência de Vendas B2B</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Visão Geral de Prospecção — <span className="gradient-text">Estado de São Paulo</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Acesse indicadores em tempo real para direcionar a abordagem do seu time comercial. Clique em qualquer card abaixo para abrir a lista filtrada no <strong className="text-slate-200">DataBase</strong>.
          </p>
        </div>
      </div>

      {/* Cards de Métricas Inteligentes (Clicáveis) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectFilter(card.filter)}
              className="group cursor-pointer glass-card p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</h3>
              <div className="text-2xl font-bold text-slate-100 mt-1 tracking-tight">{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.desc}</p>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 group-hover:text-blue-300 font-medium">
                <span>Abrir no DataBase</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Seção de Gráficos e Destaques Regionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico 1: Cobertura de WhatsApp */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Cobertura WhatsApp</span>
              </h3>
              <span className="text-xs font-medium text-emerald-400">Validação Ativa</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Proporção de empresas com número de celular ativo no formato wa.me.
            </p>
          </div>
          <div className="h-48 relative">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => onSelectFilter({ comWhatsapp: true })}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5"
            >
              <span>Filtrar apenas empresas com WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Gráfico 2: Volume por Cidades-Chave */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Volume de Empresas por Cidades-Chave</span>
              </h3>
              <span className="text-xs font-medium text-blue-400">Dados da Receita</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Distribuição do número de empresas ativas prontas para consulta.
            </p>
          </div>
          <div className="h-56">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
