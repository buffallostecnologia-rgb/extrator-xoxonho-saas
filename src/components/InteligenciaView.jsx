import React from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  MapPin, 
  Building2, 
  CheckCircle, 
  Phone, 
  Mail, 
  Zap,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function InteligenciaView() {
  // Dados do Gráfico da Série Histórica (39 anos)
  const historyData = {
    labels: ['1988', '1992', '1996', '2000', '2004', '2008', '2012', '2016', '2020', '2024', '2025'],
    datasets: [
      {
        label: 'Aberturas de Empresas',
        data: [450000, 620000, 980000, 1400000, 1950000, 2800000, 3400000, 3900000, 4200000, 4980000, 5189293],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Baixas de Empresas',
        data: [210000, 310000, 480000, 720000, 1100000, 2900000, 1800000, 2400000, 2100000, 2650000, 2875353],
        borderColor: '#f43f5e',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };

  const historyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: '#1e293b' } }
    }
  };

  const topSectores = [
    { cnae: '4781400', desc: 'Comércio varejista de artigos do vestuário e acessórios', ativas: '1.0M', simples: '87.5%', mei: '63.8%', email: '89.3%' },
    { cnae: '9602501', desc: 'Cabeleireiros, manicure e pedicure', ativas: '930K', simples: '91.8%', mei: '86.5%', email: '91.0%' },
    { cnae: '7319002', desc: 'Promoção de vendas', ativas: '821K', simples: '93.1%', mei: '77.9%', email: '98.4%' },
    { cnae: '8219999', desc: 'Preparação de documentos e apoio administrativo', ativas: '665K', simples: '94.5%', mei: '75.8%', email: '98.5%' },
    { cnae: '4399103', desc: 'Obras de alvenaria', ativas: '609K', simples: '91.3%', mei: '84.6%', email: '90.0%' },
    { cnae: '4930201', desc: 'Transporte rodoviário de carga municipal', ativas: '494K', simples: '90.5%', mei: '82.6%', email: '96.6%' },
    { cnae: '5611203', desc: 'Lanchonetes, casas de chá e sucos', ativas: '466K', simples: '85.3%', mei: '57.8%', email: '89.5%' },
    { cnae: '4930202', desc: 'Transporte rodoviário de carga intermunicipal', ativas: '461K', simples: '77.8%', mei: '53.7%', email: '93.2%' },
    { cnae: '4712100', desc: 'Minimercados, mercearias e armazéns', ativas: '443K', simples: '83.3%', mei: '46.6%', email: '81.2%' },
    { cnae: '5611201', desc: 'Restaurantes e similares', ativas: '399K', simples: '80.4%', mei: '45.2%', email: '91.9%' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Inteligência */}
      <div className="p-8 rounded-3xl glass-card relative overflow-hidden border border-purple-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Inteligência de Mercado CNPJ</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            Panorama Empresarial do <span className="gradient-text">Estado de São Paulo</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            39 anos de dados públicos da Receita Federal analisados. Indicadores estratégicos de densidade empresarial, perfil tributário, séries históricas e maturidade digital.
          </p>
        </div>
      </div>

      {/* PANORAMA MACRO — CARDS */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Panorama Macro em Números (SP & Brasil)</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Estabelecimentos</span>
            <div className="text-xl font-extrabold text-slate-100 mt-1">20,9M</div>
            <span className="text-[10px] text-blue-400 font-semibold">SP Lidera no BR</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Empresas Únicas</span>
            <div className="text-xl font-extrabold text-blue-400 mt-1">8,11M</div>
            <span className="text-[10px] text-slate-400">CNPJs Raiz SP</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Ativas em SP</span>
            <div className="text-xl font-extrabold text-emerald-400 mt-1">38,4%</div>
            <span className="text-[10px] text-emerald-400 font-semibold">Saúde Operacional</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Idade Mediana</span>
            <div className="text-xl font-extrabold text-purple-400 mt-1">4 Anos</div>
            <span className="text-[10px] text-slate-400">Fundadas após 2018</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Com E-mail</span>
            <div className="text-xl font-extrabold text-cyan-400 mt-1">92,0%</div>
            <span className="text-[10px] text-cyan-400 font-semibold">Contatos Válidos</span>
          </div>

          <div className="p-4 rounded-xl glass-card border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Com Telefone</span>
            <div className="text-xl font-extrabold text-teal-400 mt-1">97,2%</div>
            <span className="text-[10px] text-teal-400 font-semibold">Cobertura Direta</span>
          </div>
        </div>
      </div>

      {/* SÉRIE HISTÓRICA 39 ANOS */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Série Histórica: Aberturas vs Baixas (1988–2025)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evolução anual do ritmo de criação de empresas e momentos de aceleração do mercado.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Recorde 2025: 5,2M Aberturas
          </span>
        </div>

        <div className="h-64">
          <Line data={historyData} options={historyOptions} />
        </div>
      </div>

      {/* INTELIGÊNCIA SETORIAL — TOP 10 CNAEs */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Inteligência Setorial: Top 10 CNAEs em São Paulo</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Setores com maior volume de empresas ativas, perfil tributário (Simples / MEI) e cobertura de contato.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">CNAE</th>
                <th className="py-3 px-4">Descrição do Setor</th>
                <th className="py-3 px-4">Ativas em SP</th>
                <th className="py-3 px-4">% Simples</th>
                <th className="py-3 px-4">% MEI</th>
                <th className="py-3 px-4">% E-mail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {topSectores.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-blue-400 font-bold">{row.cnae}</td>
                  <td className="py-3 px-4 text-slate-200">{row.desc}</td>
                  <td className="py-3 px-4 text-slate-100 font-extrabold">{row.ativas}</td>
                  <td className="py-3 px-4 text-emerald-400">{row.simples}</td>
                  <td className="py-3 px-4 text-purple-400">{row.mei}</td>
                  <td className="py-3 px-4 text-cyan-400">{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
