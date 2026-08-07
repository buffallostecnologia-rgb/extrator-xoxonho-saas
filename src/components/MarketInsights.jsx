import React from 'react';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js';
import { Map, TrendingUp, AlertTriangle, Briefcase, Activity, PieChart } from 'lucide-react';

ChartJS.register(
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend, 
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function MarketInsights() {
  // Dados: Desperdício Mensal vs Investimento em Solução (Automação/Site)
  // Mostra que o cliente perde muito mais dinheiro não tendo a solução do que pagando por ela.
  const roiData = {
    labels: ['Clínica Médica (Tráfego)', 'Imobiliária (Leads)', 'Indústria B2B (Google)', 'Comércio Local (Meta Ads)'],
    datasets: [
      {
        label: 'Desperdício Estimado (Leads perdidos por mês em R$)',
        data: [12000, 25000, 18000, 5000],
        backgroundColor: '#ef4444', // red-500
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Custo da Solução (Seu Site/Automação em R$)',
        data: [2500, 3500, 4000, 1200],
        backgroundColor: '#10b981', // emerald-500
        borderRadius: 6,
        barPercentage: 0.6,
      }
    ]
  };

  const roiOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { color: '#94a3b8', font: { family: 'Inter, sans-serif', weight: '500' }, usePointStyle: true }, 
        position: 'top',
        align: 'end'
      },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
        padding: 12
      }
    },
    scales: {
      x: { ticks: { color: '#64748b', font: { weight: '500' } }, grid: { display: false } },
      y: { 
        ticks: { 
          color: '#64748b',
          callback: (value) => 'R$ ' + (value / 1000) + 'k'
        }, 
        grid: { color: 'rgba(30, 41, 59, 0.4)', drawBorder: false } 
      }
    }
  };

  // Dados: Oceanos Azuis (Cidades ricas com baixa maturidade digital)
  // Radar chart mostrando potencial econômico vs maturidade web
  const oceanosData = {
    labels: ['Jaguariúna', 'Sorocaba', 'Jundiaí', 'Santo André', 'São Caetano'],
    datasets: [
      {
        label: 'PIB / Orçamento Disponível (0-100)',
        data: [85, 90, 95, 80, 88],
        backgroundColor: 'rgba(59, 130, 246, 0.2)', // blue-500
        borderColor: 'rgba(59, 130, 246, 1)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      },
      {
        label: 'Maturidade Digital Local (0-100)',
        data: [35, 55, 60, 45, 65],
        backgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500
        borderColor: 'rgba(168, 85, 247, 1)',
        pointBackgroundColor: 'rgba(168, 85, 247, 1)',
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#cbd5e1', font: { size: 12 } },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: { labels: { color: '#cbd5e1' }, position: 'bottom' }
    }
  };

  // Gráfico 3: Motivos da Baixa Maturidade
  const doughnutData = {
    labels: ['Sem Website Próprio', 'Sites Lentos/Antigos (Mobile)', 'Sem WhatsApp Integrado', 'Sem Tráfego/SEO'],
    datasets: [
      {
        data: [42, 28, 18, 12],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)', // red-500
          'rgba(245, 158, 11, 0.8)', // amber-500
          'rgba(16, 185, 129, 0.8)', // emerald-500
          'rgba(99, 102, 241, 0.8)', // indigo-500
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { size: 11, family: 'Inter, sans-serif' }, usePointStyle: true }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(51, 65, 85, 0.5)',
        borderWidth: 1,
      }
    },
    cutout: '65%'
  };

  // Mapeamento Segmento x Cidades Líderes
  const segmentCities = [
    {
      segment: 'Fintechs & Imobiliário Alto Padrão',
      cities: ['São Paulo (Capital)'],
      color: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
      description: 'Volume bilionário. Exige funis de vendas ultra-rápidos e integração via API.'
    },
    {
      segment: 'Logística, Importadoras & Indústrias',
      cities: ['Barueri', 'Jundiaí', 'Sorocaba'],
      color: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
      description: 'Alto faturamento B2B, porém com sites arcaicos e processos comerciais analógicos.'
    },
    {
      segment: 'Saúde Premium & Agtechs (Agro)',
      cities: ['Campinas', 'Jaguariúna', 'S. Caetano'],
      color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
      description: 'Forte investimento em tráfego pago, mas perdem leads por falta de automação (Chatbots/WhatsApp).'
    }
  ];

  return (
    <div className="space-y-8 mt-12 pt-8 border-t border-slate-800">
      
      {/* Header Insights */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Inteligência Competitiva Avançada</h2>
          <p className="text-xs text-slate-400">Análise de investimentos, gargalos de capital e regiões inexploradas (Oceanos Azuis).</p>
        </div>
      </div>

      {/* Gráfico 1: Oportunidade Financeira (Gargalo) - Agora em Full Width */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h3 className="text-base font-semibold text-slate-100 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Comparativo B2B: Desperdício de Leads vs Custo da Solução
        </h3>
        <p className="text-xs text-slate-400 mb-8 max-w-3xl">
          O argumento de venda definitivo: Mostrar ao cliente corporativo que o orçamento mensal queimado no Google/Meta Ads por falhas operacionais e falta de automação é <strong>substancialmente maior</strong> que o investimento na sua solução digital (Automação + CRM + Site).
        </p>
        <div className="h-80 w-full">
          <Bar data={roiData} options={roiOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Gráfico 2: Oceanos Azuis */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-400" /> Oceanos Azuis: Demanda Reprimida no Interior
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Relação entre Cidades com alta potência econômica (PIB/Caixa) vs Baixa Maturidade Digital (Sites velhos/Sem automação). O *gap* entre as linhas é a sua oportunidade de ouro.
          </p>
          <div className="h-72">
            <Radar data={oceanosData} options={radarOptions} />
          </div>
        </div>

        {/* Gráfico 3: Motivos de Baixa Maturidade */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" /> Diagnóstico: Motivos da Baixa Maturidade
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            O que exatamente falta nessas empresas ricas do interior? O gráfico abaixo revela os <strong>4 principais buracos tecnológicos</strong> onde você pode entrar vendendo.
          </p>
          <div className="h-72 flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

      </div>

      {/* Matriz Segmentos x Cidades */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-indigo-400" /> Matriz de Segmentos-Chave (Onde está o Dinheiro)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segmentCities.map((item, idx) => (
            <div key={idx} className={`p-5 rounded-xl border ${item.color} backdrop-blur-sm relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 pointer-events-none"></div>
              
              <h4 className="text-sm font-bold text-white mb-2 leading-tight">{item.segment}</h4>
              <p className="text-xs text-white/70 mb-4 font-medium">{item.description}</p>
              
              <div className="border-t border-white/10 pt-4 mt-auto">
                <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider mb-2">Polos Principais:</div>
                <div className="flex flex-wrap gap-2">
                  {item.cities.map((city, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-400">Dica Prática:</strong> Utilize o filtro do <strong>Banco de Dados</strong> no menu lateral esquerdo cruzando a "Cidade Polo" com o código CNAE (Segmento) correspondente a estas matrizes. Extraia listas e importe para o seu CRM disparador para prospectar cirurgicamente.
          </p>
        </div>
      </div>

    </div>
  );
}
