import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
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
  UserCheck,
  Loader2,
  RefreshCw
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

  // Paginação Flutuante (10, 25, 50, 100 por página)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Estados de Dados da API Serverless
  const [dbData, setDbData] = useState([]);
  const [dbTotal, setDbTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSaveListModal, setShowSaveListModal] = useState(false);
  const [listNameInput, setListNameInput] = useState('');

  // Busca dados dinâmicos do CockroachDB via Serverless Function
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (cidade) params.append('cidade', cidade);
    if (cnae) params.append('cnae', cnae);
    if (comWebsite) params.append('comWebsite', 'true');
    if (comWhatsapp) params.append('comWhatsapp', 'true');
    if (porte) params.append('porte', porte);
    if (bairro) params.append('bairro', bairro);
    if (minCapital) params.append('minCapital', minCapital);
    params.append('page', currentPage.toString());
    params.append('limit', itemsPerPage.toString());

    fetch(`/.netlify/functions/get-empresas?${params.toString()}`)
      .then(res => res.json())
      .then(resData => {
        if (!isMounted) return;
        if (typeof resData.total !== 'undefined' && Array.isArray(resData.data)) {
          setDbData(resData.data);
          setDbTotal(resData.total);
        } else {
          fetchStaticDataset(isMounted);
        }
      })
      .catch(err => {
        if (isMounted) {
          fetchStaticDataset(isMounted);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [cidade, cnae, comWebsite, comWhatsapp, porte, bairro, minCapital, currentPage, itemsPerPage]);

  const fetchStaticDataset = (isMounted) => {
    fetch('/empresas_sp.json')
      .then(r => r.json())
      .then(items => {
        if (!isMounted) return;
        if (Array.isArray(items) && items.length > 0) {
          let filtered = items;
          if (cidade) filtered = filtered.filter(x => x && x.cidade && x.cidade.toString().toLowerCase().includes(cidade.toLowerCase()));
          if (cnae) filtered = filtered.filter(x => x && ((x.segmento && x.segmento.toString().toLowerCase().includes(cnae.toLowerCase())) || (x.cnae && x.cnae.toString().includes(cnae))));
          if (comWebsite) filtered = filtered.filter(x => x && x.site && x.site.toString().trim() !== '');
          if (comWhatsapp) filtered = filtered.filter(x => x && x.whatsapp && x.whatsapp.toString().trim() !== '');
          if (bairro) filtered = filtered.filter(x => x && x.bairro && x.bairro.toString().toLowerCase().includes(bairro.toLowerCase()));
          
          setDbTotal(filtered.length);
          const start = (currentPage - 1) * itemsPerPage;
          setDbData(filtered.slice(start, start + itemsPerPage));
        } else {
          setDbData(getFallbackData());
          setDbTotal(getFallbackData().length);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDbData(getFallbackData());
          setDbTotal(getFallbackData().length);
        }
      });
  };

  const getFallbackData = () => [
    { cnpj: '51.892.930/0001-45', razao_social: 'RIO CLARO TECNOLOGIA LTDA', nome_fantasia: 'RC TECH', proprietario: 'Marcos Vinicius Soares', cidade: 'Rio Claro', bairro: 'Centro', telefone: '(19) 3524-9000', whatsapp: '(19) 99904-2745', site: 'www.rctech.com.br', email: 'contato@rctech.com.br', cnae: '6201501', segmento: 'Desenvolvimento de software sob encomenda', porte: 'MEI / ME', capital_social: 50000 },
    { cnpj: '48.102.441/0001-90', razao_social: 'PIRACICABA METALURGICA EIRELI', nome_fantasia: 'PIRA METAL', proprietario: 'Carlos Eduardo Oliveira', cidade: 'Piracicaba', bairro: 'Vila Rezende', telefone: '(19) 3412-8080', whatsapp: '(19) 98115-4420', site: 'www.pirametal.com.br', email: 'vendas@pirametal.com.br', cnae: '2539001', segmento: 'Serviços de usinagem e caldeiraria', porte: 'EPP', capital_social: 150000 },
    { cnpj: '50.311.229/0001-12', razao_social: 'LIMEIRA COMERCIO DE VESTUARIO ME', nome_fantasia: 'LIMEIRA MODAS', proprietario: 'Ana Paula Ferreira', cidade: 'Limeira', bairro: 'Centro', telefone: '(19) 3451-2233', whatsapp: '(19) 99778-1100', site: 'www.limeiramodas.com.br', email: 'atendimento@limeiramodas.com.br', cnae: '4781400', segmento: 'Comércio de vestuário e acessórios', porte: 'MEI / ME', capital_social: 20000 },
    { cnpj: '42.990.118/0001-88', razao_social: 'RIO CLARO RESTAURANTE LTDA', nome_fantasia: 'GASTRO RC', proprietario: 'Roberto Camargo', cidade: 'Rio Claro', bairro: 'Cidade Claret', telefone: '(19) 3533-4455', whatsapp: '(19) 99611-3322', site: 'www.gastrorc.com.br', email: 'contato@gastrorc.com.br', cnae: '5611201', segmento: 'Restaurantes e similares', porte: 'MEI / ME', capital_social: 80000 },
    { cnpj: '39.812.554/0001-33', razao_social: 'CAMPINAS LOGISTICA SA', nome_fantasia: 'CAMP LOG', proprietario: 'Fernando Henrique Silva', cidade: 'Campinas', bairro: 'Distrito Industrial', telefone: '(19) 3788-0000', whatsapp: '(19) 99123-8899', site: 'www.camplog.com.br', email: 'operacional@camplog.com.br', cnae: '4930202', segmento: 'Transporte rodoviário de carga', porte: 'Demais', capital_social: 500000 }
  ];

  const totalPages = Math.ceil((dbTotal || 1) / itemsPerPage);

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

  const handleSaveCurrentList = (e) => {
    e.preventDefault();
    if (!listNameInput.trim()) return;

    onSaveList({
      id: Date.now().toString(),
      name: listNameInput.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      count: dbData.length,
      filters: { cidade, cnae, comWebsite, comWhatsapp, porte, bairro, minCapital },
      items: dbData
    });

    confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    setShowSaveListModal(false);
    setListNameInput('');
  };

  const clearFilters = () => {
    setCidade('');
    setCnae('');
    setComWebsite(false);
    setComWhatsapp(false);
    setPorte('');
    setMinCapital('');
    setBairro('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Filtro de Inteligência Comercial B2B SP</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Temos disponíveis listas do estado de São Paulo</h1>
          <p className="text-xs text-slate-400 mt-1">
            Empresas ativas enriquecidas com <strong>Nome do Empresário</strong>, WhatsApp e Mensagem Persuasiva Pronta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowMsgModal(true)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Template WhatsApp</span>
          </button>

          <button
            onClick={clearFilters}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpar Filtros</span>
          </button>
        </div>
      </div>

      {/* Painel de Filtros de 5 Campos */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-3">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          <span>Filtro Comercial de Prospecção</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* 1. Cidade */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase mb-1 block">1. Cidade</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ex: Rio Claro, Limeira..."
                value={cidade}
                onChange={(e) => { setCidade(e.target.value); setCurrentPage(1); }}
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
              onChange={(e) => { setCnae(e.target.value); setCurrentPage(1); }}
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
                onChange={(e) => { setComWebsite(e.target.checked); setCurrentPage(1); }}
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
                onChange={(e) => { setComWhatsapp(e.target.checked); setCurrentPage(1); }}
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
              onChange={(e) => { setPorte(e.target.value); setCurrentPage(1); }}
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
              onChange={(e) => { setBairro(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="number"
              placeholder="Capital Social Mínimo (ex: 50000)"
              value={minCapital}
              onChange={(e) => { setMinCapital(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Ações da Tabela */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs text-slate-300 flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
          <span>
            Encontradas <strong className="text-blue-400 text-sm font-extrabold">{dbTotal.toLocaleString()}</strong> empresas em SP. 
            <span className="text-slate-400 ml-1">(Página {currentPage} de {totalPages || 1})</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Seletor de Tamanho de Página */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Mostrar por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value={10}>10 por página (Mais rápido)</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>

          <button
            onClick={() => setShowSaveListModal(true)}
            disabled={dbData.length === 0}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Salvar em Minhas Listas</span>
          </button>
        </div>
      </div>

      {/* Tabela de Empresas com Nome do Proprietário */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-20">
            <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-700 text-slate-200 text-xs shadow-xl">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
              <span>Carregando empresas...</span>
            </div>
          </div>
        )}

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

            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {dbData.length > 0 ? (
                dbData.map((item, idx) => {
                  const cleanVal = (v) => {
                    if (!v) return '';
                    const s = String(v).trim();
                    if (!s || s.toLowerCase() === 'nan' || s.toLowerCase() === 'null' || s.toLowerCase() === 'none') return '';
                    return s;
                  };

                  const cleanRazao = cleanVal(item.razao_social) || cleanVal(item.nome_fantasia) || 'Empresa em SP';
                  const cleanProp = cleanVal(item.proprietario) || 'Sócio Responsável';
                  const cleanSite = cleanVal(item.site);
                  const waLink = getCustomWaLink(item);

                  return (
                    <tr key={item.cnpj || idx} className="hover:bg-slate-800/40 transition-colors group">
                      
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-[11px] text-slate-400">{item.cnpj}</div>
                        <div className="font-extrabold text-slate-100 text-xs mt-0.5 group-hover:text-blue-400 transition-colors truncate max-w-[200px]" title={cleanRazao}>
                          {cleanRazao}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold text-xs">
                          <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span>{cleanProp}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200">{item.cidade}</div>
                        <div className="text-[10px] text-slate-400">{cleanVal(item.bairro) || 'Centro'}</div>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-medium text-slate-300 truncate" title={cleanVal(item.segmento)}>
                          {cleanVal(item.segmento) || 'Atividade Comercial'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">CNAE: {item.cnae}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.whatsapp ? (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 font-bold text-xs shadow-sm transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Disparar WhatsApp</span>
                            <ExternalLink className="w-3 h-3 text-emerald-400 opacity-60" />
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Sem WhatsApp</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {cleanSite ? (
                          <a
                            href={cleanSite.startsWith('http') ? cleanSite : `https://${cleanSite}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium text-xs truncate max-w-[150px]"
                          >
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{cleanSite}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Sem site</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300">
                          {item.porte || 'MEI / ME'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    Nenhuma empresa encontrada com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginador */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || loading}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Página <strong>{currentPage}</strong> de <strong>{totalPages || 1}</strong>
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Exibir:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs focus:outline-none focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage >= totalPages || loading}
            className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal de Template do WhatsApp */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg p-6 glass-card rounded-2xl border border-slate-700 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Template de Mensagem Persuasiva B2B</span>
              </h3>
              <button onClick={() => setShowMsgModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Personalize a mensagem automática. Use as variáveis: <code className="text-emerald-400">{'{proprietario}'}</code>, <code className="text-emerald-400">{'{empresa}'}</code>, <code className="text-emerald-400">{'{site}'}</code>, <code className="text-emerald-400">{'{cidade}'}</code>.
            </p>

            <textarea
              rows="6"
              value={customMsgTemplate}
              onChange={(e) => setCustomMsgTemplate(e.target.value)}
              className="w-full p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCustomMsgTemplate(DEFAULT_TEMPLATE)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
              >
                Restaurar Padrão
              </button>
              <button
                onClick={() => setShowMsgModal(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
              >
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Salvar em Minhas Listas */}
      {showSaveListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 glass-card rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-purple-400" />
                <span>Salvar Pesquisa em Minhas Listas</span>
              </h3>
              <button onClick={() => setShowSaveListModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCurrentList} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nome da Lista de Prospecção</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Confecções Limeira - Março 2026"
                  value={listNameInput}
                  onChange={(e) => setListNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <div>Total de Empresas: <strong className="text-purple-300">{dbData.length}</strong></div>
                <div>Cidade: <strong>{cidade || 'Todas'}</strong></div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveListModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                >
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
