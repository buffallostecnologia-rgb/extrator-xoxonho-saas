import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Sparkles, Building2, Phone, Globe, MessageCircle, MoreVertical } from 'lucide-react';

const COLUMNS = {
  prospectar: { id: 'prospectar', title: '🎯 Prospectar', color: 'border-slate-700' },
  contato: { id: 'contato', title: '💬 Em Contato', color: 'border-blue-500/50' },
  reuniao: { id: 'reuniao', title: '🤝 Reunião/Negociação', color: 'border-purple-500/50' },
  fechado: { id: 'fechado', title: '🏆 Fechado', color: 'border-emerald-500/50' },
  perdido: { id: 'perdido', title: '❌ Perdido', color: 'border-rose-500/50' }
};

export default function CRMKanbanView({ list, onBack }) {
  const [boardData, setBoardData] = useState(() => {
    // Tenta carregar do localStorage baseado no ID da lista
    if (list?.id) {
      const saved = localStorage.getItem(`crm_kanban_${list.id}`);
      if (saved) return JSON.parse(saved);
    }
    
    // Inicialização Padrão
    const initialData = {
      prospectar: list?.items || [],
      contato: [],
      reuniao: [],
      fechado: [],
      perdido: []
    };
    return initialData;
  });

  // Persiste no localStorage sempre que boardData mudar
  useEffect(() => {
    if (list?.id) {
      localStorage.setItem(`crm_kanban_${list.id}`, JSON.stringify(boardData));
    }
  }, [boardData, list]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCol = [...boardData[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...boardData[destination.droppableId]];
    
    const [movedItem] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedItem);

    setBoardData(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    }));
  };

  const handleWhatsApp = (whatsappNumber, razaoSocial) => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá, pessoal da ${razaoSocial}! Tudo bem?`);
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  if (!list) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Nenhuma lista selecionada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fadeIn">
      {/* Header do Kanban */}
      <div className="p-4 rounded-2xl glass-card border border-purple-500/20 mb-6 flex items-center justify-between shrink-0">
        <div>
          <button 
            onClick={onBack}
            className="text-xs text-blue-400 hover:text-blue-300 mb-1 font-semibold flex items-center gap-1 transition-all"
          >
            ← Voltar para Minhas Listas
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              Funil de Vendas
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
              {list.name}
            </span>
          </div>
        </div>
        <div className="hidden md:flex px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Arraste os cards para gerenciar</span>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full min-w-max px-1">
            {Object.values(COLUMNS).map((col) => (
              <div key={col.id} className={`w-80 flex flex-col glass-panel rounded-2xl border-t-4 ${col.color} border-x border-b border-x-slate-800/80 border-b-slate-800/80 bg-slate-900/50`}>
                {/* Column Header */}
                <div className="p-4 border-b border-slate-800/50 flex items-center justify-between shrink-0">
                  <h3 className="font-bold text-slate-200 text-sm">{col.title}</h3>
                  <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {boardData[col.id].length}
                  </span>
                </div>

                {/* Column Content / Droppable Area */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-3 overflow-y-auto custom-scrollbar transition-colors ${
                        snapshot.isDraggingOver ? 'bg-slate-800/20' : ''
                      }`}
                    >
                      {boardData[col.id].map((item, index) => (
                        <Draggable key={item.cnpj} draggableId={item.cnpj} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`mb-3 p-3 rounded-xl bg-slate-800 border ${
                                snapshot.isDragging ? 'border-purple-500 shadow-xl shadow-purple-500/20 rotate-1' : 'border-slate-700 hover:border-slate-600'
                              } transition-all`}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex justify-between items-start mb-2 gap-2">
                                <h4 className="font-bold text-slate-200 text-xs leading-snug line-clamp-2">
                                  {item.nome_fantasia || item.razao_social}
                                </h4>
                                <button className="text-slate-500 hover:text-slate-300">
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <p className="text-[10px] text-slate-400 mb-3 truncate">
                                {item.segmento || 'Segmento não informado'}
                              </p>

                              <div className="flex flex-col gap-1.5 mt-auto">
                                {item.whatsapp ? (
                                  <button 
                                    onClick={() => handleWhatsApp(item.whatsapp, item.nome_fantasia || item.razao_social)}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold transition-all"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    WhatsApp
                                  </button>
                                ) : (
                                  <div className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800/50 text-slate-500 text-[10px] font-semibold border border-slate-700/50 cursor-not-allowed">
                                    <Phone className="w-3 h-3" />
                                    Sem Whats
                                  </div>
                                )}
                                
                                {item.site && (
                                  <a 
                                    href={item.site.startsWith('http') ? item.site : `https://${item.site}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[10px] font-bold transition-all"
                                  >
                                    <Globe className="w-3 h-3" />
                                    Visitar Site
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
