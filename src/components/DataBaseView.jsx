import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FolderPlus, 
  ExternalLink, 
  MessageSquare, 
  Globe, 
  Building2, 
  Check, 
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Info,
  SlidersHorizontal,
  DollarSign,
  MapPin,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DataBaseView({ initialFilters, onSaveList, companiesData = [] }) {
  // Filtros de Busca
  const [cidade, setCidade] = useState(initialFilters?.cidade || '');
  const [cnae, setCnae] = useState(initialFilters?.cnae || '');
  const [comWebsite, setComWebsite] = useState(initialFilters?.comWebsite || false);
  const [comWhatsapp, setComWhatsapp] = useState(initialFilters?.comWhatsapp || false);
  const [porte, setPorte] = useState(initialFilters?.porte || '');
  const [minCapital, setMinCapital] = useState('');
  const [bairro, setBairro] = useState('');

  // TEMPLATE OFICIAL DE MENSAGEM WHATSAPP DE ALTA CONVERSÃO B2B
  const DEFAULT_TEMPLATE = `Olá, neste número consigo falar com o {proprietario}?

Acabei de analisar o site da {empresa} e posso ajudar vocês a resolver o problema que identifiquei.

Confirma se o site da empresa é esse mesmo {site}?

Posso fornecer o diagnóstico de forma gratuita.`;

  const [customMsgTemplate, setCustomMsgTemplate] = useState(DEFAULT_TEMPLATE);
  const [showMsgModal, setShowMsgModal] = useState(false);

  // Paginação (500 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 500;

  // Modais de Exportação e Salvamento
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [showSaveListModal, setShowSaveListModal] = useState(false);
  const [listNameInput, setListNameInput] = useState('');

  // Dataset com dados enriquecidos (com Nome do Proprietário/Empresário)
  const dataset = useMemo(() => {
    if (companiesData && companiesData.length > 0) return companiesData;
    
    // Dataset demonstrativo com Nome do Proprietário e links perfeitos
    return [
      { cnpj: '51.892.930/0001-45', razao_social: 'RIO CLARO TECNOLOGIA LTDA', nome_fantasia: 'RC TECH', proprietario: 'Marcos Vinicius Soares', cidade: 'Rio Claro', bairro: 'Centro', telefone: '(19) 3524-9000', whatsapp: '(19) 99904-2745', site: 'www.rctech.com.br', email: 'contato@rctech.com.br', cnae: '6201501', segmento: 'Desenvolvimento de software sob encomenda', porte: 'MEI / ME', capital_social: 50000 },
      { cnpj: '48.102.441/0001-90', razao_social: 'PIRACICABA METALURGICA EIRELI', nome_fantasia: 'PIRA METAL', proprietario: 'Carlos Eduardo Oliveira', cidade: 'Piracicaba', bairro: 'Vila Rezende', telefone: '(19) 3412-8080', whatsapp: '(19) 98115-4420', site: 'www.pirametal.com.br', email: 'vendas@pirametal.com.br', cnae: '2539001', segmento: 'Serviços de usinagem e caldeiraria', porte: 'EPP', capital_social: 150000 },
      { cnpj: '50.311.229/0001-12', razao_social: 'LIMEIRA COMERCIO DE VESTUARIO ME', nome_fantasia: 'LIMEIRA MODAS', proprietario: 'Ana Paula Ferreira', cidade: 'Limeira', bairro: 'Centro', telefone: '(19) 3451-2233', whatsapp: '(19) 99778-1100', site: 'www.limeiramodas.com.br', email: 'atendimento@limeiramodas.com.br', cnae: '4781400', segmento: 'Comércio de vestuário e acessórios', porte: 'MEI / ME', capital_social: 20000 },
      { cnpj: '42.990.118/0001-88', razao_social: 'RIO CLARO RESTAURANTE LTDA', nome_fantasia: 'GASTRO RC', proprietario: 'Roberto Camargo', cidade: 'Rio Claro', bairro: 'Cidade Claret', telefone: '(19) 3533-4455', whatsapp: '(19) 99611-3322', site: 'www.gastrorc.com.br', email: 'contato@gastrorc.com.br', cnae: '5611201', segmento: 'Restaurantes e similares', porte: 'MEI / ME', capital_social: 80000 },
      { cnpj: '39.812.554/0001-33', razao_social: 'CAMPINAS LOGISTICA SA', nome_fantasia: 'CAMP LOG', proprietario: 'Fernando Henrique Silva', cidade: 'Campinas', bairro: 'Distrito Industrial', telefone: '(19) 3788-0000', whatsapp: '(19) 99123-8899', site: 'www.camplog.com.br', email: 'operacional@camplog.com.br', cnae: '4930202', segmento: 'Transporte rodoviário de carga', porte: 'Demais', capital_social: 500000 }
    ];
  }, [companiesData]);

  // Aplicação dos Filtros
  const filteredData = useMemo(() => {
    return dataset.filter(item => {
      if (cidade && !item.cidade.toLowerCase().includes(cidade.toLowerCase())) return false;
      if (bairro && !item.bairro.toLowerCase().includes(bairro.toLowerCase())) return false;
      if (cnae && !item.segmento.toLowerCase().includes(cnae.toLowerCase()) && !item.cnae.includes(cnae)) return false;
      if (comWebsite && (!item.site || item.site.trim() === '')) return false;
      if (comWhatsapp && (!item.whatsapp || item.whatsapp.trim() === '')) return false;
      if (porte && item.porte !== porte) return false;
      if (minCapital && item.capital_social < Number(minCapital)) return false;
      return true;
    });
  }, [dataset, cidade, bairro, cnae, comWebsite, comWhatsapp, porte, minCapital]);

  // Dados da Página Atual
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Gera Link Dinâmico de WhatsApp com a Mensagem Persuasiva Curiosa
  const getCustomWaLink = (item) => {
    if (!item.whatsapp) return '#';
    const cleanPhone = item.whatsapp.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    
    const propName = item.proprietario || 'responsável';
    const compName = item.nome_fantasia || item.razao_social;
    const siteUrl = item.site || 'da sua empresa';

    const text = customMsgTemplate
      .replace(/{proprietario}/g, propName)
      .replace(/{empresa}/g, compName)
      .replace(/{site}/g, siteUrl)
      .replace(/{cidade}/g, item.cidade);

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
  };

  // Download do CSV
  const handleDownloadCSV = () => {
    if (filteredData.length === 0) return;
    const headers = [
      'CNPJ', 'Razão Social', 'Nome Fantasia', 'Nome do Proprietario', 'Cidade', 'Bairro', 
      'Telefone', 'WhatsApp', 'Link WhatsApp Persuasivo', 'Site', 'E-mail', 'Segmento', 'Porte', 'Capital Social'
    ];
    const rows = filteredData.map(d => [
      `"${d.cnpj}"`, `"${d.razao_social}"`, `"${d.nome_fantasia}"`, `"${d.proprietario || ''}"`, `"${d.cidade}"`, `"${d.bairro}"`,
      `"${d.telefone}"`, `"${d.whatsapp}"`, `"${getCustomWaLink(d)}"`, `"${d.site}"`, `"${d.email}"`,
      `"${d.segmento}"`, `"${d.porte}"`, `"${d.capital_social}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prospeccao_${cidade ? cidade.toLowerCase().replace(/\s+/g, '_') : 'sp'}_${filteredData.length}_empresas.csv`;
    link.click();

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  // Salvar em Minhas Listas
  const handleConfirmSaveList = () => {
    if (!listNameInput.trim()) return;
    onSaveList({
      id: Date.now().toString(),
      name: listNameInput.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      count: filteredData.length,
      filters: { cidade, bairro, cnae, comWebsite, comWhatsapp, porte, minCapital },
      items: filteredData
    });
    setListNameInput('');
    setShowSaveListModal(false);
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header DataBase */}
      <div className="p-6 rounded-2xl glass-card border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Filtro Comercial com Nome do Proprietário</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Temos disponíveis listas do estado de São Paulo
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Empresas ativas enriquecidas com <strong>Nome do Empresário</strong>, WhatsApp e Mensagem Persuasiva Pronta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMsgModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Template WhatsApp</span>
          </button>

          <button
            onClick={() => {
              setCidade(''); setCnae(''); setComWebsite(false); setComWhatsapp(false); setPorte(''); setMinCapital(''); setBairro('');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Formulário Comercial de Filtros */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Filtro Comercial de Prospecção</span>
          </h2>
          <span className="text-[11px] text-slate-400">Exibindo <strong>500</strong> por página</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* 1. Cidade */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">1. Cidade</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Rio Claro, Limeira..."
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* 2. CNAE / Segmento */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">2. CNAE / Segmento</label>
            <select
              value={cnae}
              onChange={(e) => setCnae(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="">Todos os Segmentos</option>
              <option value="vestuario">Vestuário e Modas</option>
              <option value="restaurante">Restaurantes & Gastronomia</option>
              <option value="usinagem">Usinagem & Metalúrgica</option>
              <option value="computador">Desenvolvimento de Software</option>
              <option value="transporte">Transporte & Logística</option>
              <option value="obras">Construção Civil & Obras</option>
            </select>
          </div>

          {/* 3. Checkbox Com Website */}
          <div className="flex items-end">
            <label className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700 cursor-pointer hover:border-cyan-500/50 transition-all">
              <input
                type="checkbox"
                checked={comWebsite}
                onChange={(e) => setComWebsite(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Com Website</span>
            </label>
          </div>

          {/* 4. Checkbox Com WhatsApp */}
          <div className="flex items-end">
            <label className="w-full flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700 cursor-pointer hover:border-emerald-500/50 transition-all">
              <input
                type="checkbox"
                checked={comWhatsapp}
                onChange={(e) => setComWhatsapp(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
              />
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-200">Com WhatsApp</span>
            </label>
          </div>

          {/* 5. Categoria / Porte */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">5. Categoria / Porte</label>
            <select
              value={porte}
              onChange={(e) => setPorte(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="">Todas as Categorias</option>
              <option value="MEI / ME">MEI / Microempresa (ME)</option>
              <option value="EPP">Pequena Empresa (EPP)</option>
              <option value="Demais">Média / Grande Empresa</option>
            </select>
          </div>
        </div>

        {/* Filtros Secundários (Bairro & Capital Social) */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
            <input
              type="text"
              placeholder="Filtrar por Bairro (ex: Centro, Vila Rezende...)"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="number"
              placeholder="Capital Social Mínimo (ex: 50000)"
              value={minCapital}
              onChange={(e) => setMinCapital(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Ações da Tabela */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs text-slate-300">
          Encontradas <strong className="text-blue-400 text-sm font-extrabold">{filteredData.length.toLocaleString()}</strong> empresas em SP. 
          <span className="text-slate-400 ml-1">(Página {currentPage} de {totalPages})</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSaveListModal(true)}
            disabled={filteredData.length === 0}
            className="py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4 text-purple-400" />
            <span>Salvar em Minhas Listas</span>
          </button>

          <button
            onClick={() => setShowSheetsModal(true)}
            disabled={filteredData.length === 0}
            className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Compartilhar Sheets</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            disabled={filteredData.length === 0}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Baixar CSV ({filteredData.length.toLocaleString()})</span>
          </button>
        </div>
      </div>

      {/* Tabela de Empresas com Nome do Proprietário */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">CNPJ / Empresa</th>
                <th className="py-3.5 px-4">Nome do Proprietário</th>
                <th className="py-3.5 px-4">Cidade / Bairro</th>
                <th className="py-3.5 px-4">Segmento (CNAE)</th>
                <th className="py-3.5 px-4">Contato / Disparo WhatsApp</th>
                <th className="py-3.5 px-4">Website</th>
                <th className="py-3.5 px-4">Porte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-400 text-[11px]">{item.cnpj}</div>
                      <div className="font-bold text-slate-100 text-xs">{item.nome_fantasia || item.razao_social}</div>
                    </td>

                    {/* Coluna Nome do Proprietário */}
                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 text-purple-300 font-bold bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{item.proprietario || 'Sócio Responsável'}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-semibold">{item.cidade}</div>
                      <div className="text-slate-400 text-[11px]">{item.bairro}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-300 truncate" title={item.segmento}>{item.segmento}</div>
                      <div className="text-slate-500 font-mono text-[10px]">CNAE: {item.cnae}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {item.whatsapp ? (
                        <a
                          href={getCustomWaLink(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all shadow-md shadow-emerald-600/10"
                          title="Abrir WhatsApp com Mensagem Persuasiva Pronta"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Disparar WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-500">{item.telefone || '-'}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.site ? (
                        <a
                          href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-cyan-400 hover:underline"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>{item.site}</span>
                        </a>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold">
                        {item.porte}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <span className="text-xs text-slate-400">Página <strong>{currentPage}</strong> de {totalPages}</span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <span>Próxima</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MODAL 1: Template de Mensagem WhatsApp Persuasiva */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Template de Mensagem Persuasiva B2B</span>
              </h3>
              <button onClick={() => setShowMsgModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Esta é a mensagem de alta conversão gerada automaticamente com o <strong>Nome do Proprietário</strong> e o <strong>Website da Empresa</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Script de Vendas WhatsApp:</label>
              <textarea
                rows="8"
                value={customMsgTemplate}
                onChange={(e) => setCustomMsgTemplate(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono leading-relaxed focus:outline-none focus:border-emerald-500"
              />
              <div className="text-[10px] text-slate-400 flex flex-wrap gap-2">
                <span>Variáveis:</span>
                <code className="text-emerald-400">{'{proprietario}'}</code>
                <code className="text-emerald-400">{'{empresa}'}</code>
                <code className="text-emerald-400">{'{site}'}</code>
                <code className="text-emerald-400">{'{cidade}'}</code>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCustomMsgTemplate(DEFAULT_TEMPLATE)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Restaurar Padrão
              </button>
              <button
                onClick={() => setShowMsgModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
              >
                Salvar Script Persuasivo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Compartilhar no Google Sheets */}
      {showSheetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card p-6 rounded-2xl border border-slate-700 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>Exportar para Google Sheets</span>
              </h3>
              <button onClick={() => setShowSheetsModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Sua lista de <strong className="text-slate-200">{filteredData.length} empresas</strong> (com nome dos sócios e links wa.me) está pronta.
            </p>

            <button
              onClick={() => {
                handleDownloadCSV();
                setShowSheetsModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Baixar CSV Otimizado com Nome dos Proprietários</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Salvar em Minhas Listas */}
      {showSaveListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="glass-card p-6 rounded-2xl border border-purple-500/30 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-400" />
                <span>Salvar em Minhas Listas</span>
              </h3>
              <button onClick={() => setShowSaveListModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-300 uppercase">Nome da Lista:</label>
              <input
                type="text"
                placeholder="Ex: Restaurantes com WhatsApp em Rio Claro..."
                value={listNameInput}
                onChange={(e) => setListNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleConfirmSaveList}
              disabled={!listNameInput.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              Salvar Lista de Prospecção
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
