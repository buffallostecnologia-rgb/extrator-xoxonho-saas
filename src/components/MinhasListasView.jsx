import React from 'react';
import { 
  FolderHeart, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Calendar, 
  Building2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function MinhasListasView({ savedLists, onDeleteList }) {
  // Download de uma lista salva em CSV
  const handleDownloadSavedCSV = (list) => {
    if (!list.items || list.items.length === 0) return;
    const headers = [
      'CNPJ', 'Razão Social', 'Nome Fantasia', 'Cidade', 'Bairro', 
      'Telefone', 'WhatsApp', 'Link WhatsApp', 'Site', 'E-mail', 'Segmento', 'Porte'
    ];
    const rows = list.items.map(d => [
      `"${d.cnpj}"`, `"${d.razao_social}"`, `"${d.nome_fantasia}"`, `"${d.cidade}"`, `"${d.bairro}"`,
      `"${d.telefone}"`, `"${d.whatsapp}"`, `"${d.msg_whatsapp}"`, `"${d.site}"`, `"${d.email}"`,
      `"${d.segmento}"`, `"${d.porte}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${list.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  // Exportar para o Google Sheets
  const handleExportGoogleSheets = (list) => {
    alert(`Lista "${list.name}" pronta para sincronização com o Google Sheets (${list.count} empresas).`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl glass-card border border-purple-500/20 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestor de Prospecção Pessoal</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Minhas Listas de Prospecção Salvas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie suas listas de empresas salvas para não repetir pesquisas e acelerar o disparo comercial.
          </p>
        </div>
      </div>

      {/* Grid de Listas Salvas */}
      {savedLists.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <FolderHeart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-200">Nenhuma lista salva ainda</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Vá até a aba <strong className="text-blue-400">DataBase</strong>, monte seu filtro de empresas e clique em <strong>"Salvar em Minhas Listas"</strong>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLists.map((list) => (
            <div
              key={list.id}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-bold text-slate-100 text-base leading-snug line-clamp-2">{list.name}</h3>
                  <button
                    onClick={() => onDeleteList(list.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
                    title="Excluir Lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                    <span><strong className="text-slate-200">{list.count.toLocaleString()}</strong> empresas salvas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                    <span>Criada em: {list.date}</span>
                  </div>
                </div>

                {/* Badges de Filtro Usados */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {list.filters?.cidade && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-300 text-[10px] font-semibold">
                      📍 {list.filters.cidade}
                    </span>
                  )}
                  {list.filters?.comWhatsapp && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold">
                      💬 WhatsApp
                    </span>
                  )}
                  {list.filters?.comSite && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold">
                      🌐 Com Site
                    </span>
                  )}
                </div>
              </div>

              {/* Ações da Lista */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSavedCSV(list)}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Baixar CSV</span>
                </button>

                <button
                  onClick={() => handleExportGoogleSheets(list)}
                  className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="Compartlhar com Google Sheets"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
