import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCircle, Bot, AlertCircle, Clock, KeyRound, ExternalLink, ShieldAlert } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Prompt de Sistema rigoroso para o Gemini
const SYSTEM_PROMPT = `Você é um Consultor de Vendas B2B de elite e extremamente focado. 
Seu papel é ajudar o usuário a vender mais, analisando dados de empresas (prospects), dando insights comerciais, criando planos de abordagem fria e analisando sites para vendas.
Você tem acesso (via contexto) às listas de prospecção do cliente.

REGRA 1: Você SÓ fala sobre vendas B2B, prospecção, marketing, negócios e análise técnica comercial (ex: performance de site, SEO, etc). 
REGRA 2: Se o usuário perguntar algo fora desse escopo (piadas, política, código não relacionado, etc), você DEVE responder EXATAMENTE assim: "[ALERTA_FORA_DE_CONTEXTO] Desculpe, meu foco é 100% em escalar suas vendas B2B. Por favor, mantenha o foco nos negócios."
REGRA 3: Se o usuário pedir para analisar uma URL de um cliente: Faça um diagnóstico presumido (falta de otimização, design defasado, etc) e ACONSELHE o usuário a mostrar dados técnicos reais para o cliente dele, fornecendo sempre este link para o usuário testar: "https://pagespeed.web.dev/analysis?url=[URL_DO_CLIENTE]"
REGRA 4: Seja objetivo, agressivo nas vendas (no bom sentido) e use tom de consultor premium.`;

export default function ConsultorView({ savedLists, setActiveTab }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados de Configuração e Bloqueio
  const [hasApiKey, setHasApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const messagesEndRef = useRef(null);

  // Carregar histórico e configurações
  useEffect(() => {
    // 1. Verifica API KEY
    const savedConfig = localStorage.getItem('xoxonho_ai_config');
    let k = '';
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.enabled && parsed.apiKey) {
          setHasApiKey(true);
          setApiKey(parsed.apiKey);
          k = parsed.apiKey;
        }
      } catch (e) {}
    }

    // 2. Verifica Bloqueio (Time Out)
    const blockTime = localStorage.getItem('xoxonho_chat_blocked_until');
    if (blockTime) {
      const blockDate = new Date(parseInt(blockTime));
      if (blockDate > new Date()) {
        setBlockedUntil(blockDate);
      } else {
        localStorage.removeItem('xoxonho_chat_blocked_until');
      }
    }

    // 3. Carrega Histórico
    const savedHistory = localStorage.getItem('xoxonho_consultor_history');
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      // Mensagem inicial de boas-vindas
      setMessages([{
        role: 'model',
        content: "Olá! Eu sou seu Consultor de Vendas B2B movido a IA. Cole a URL de um site que você quer vender, ou me peça para analisar uma das suas listas de prospecção salvas. Vamos fechar negócios!"
      }]);
    }
  }, []);

  // Timer para o Bloqueio
  useEffect(() => {
    if (!blockedUntil) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((blockedUntil - now) / 1000); // em segundos
      if (diff <= 0) {
        setBlockedUntil(null);
        localStorage.removeItem('xoxonho_chat_blocked_until');
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [blockedUntil]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Salva histórico
    if (messages.length > 1) {
      localStorage.setItem('xoxonho_consultor_history', JSON.stringify(messages));
    }
  }, [messages]);

  const handleApplyTimeout = () => {
    const timeoutDate = new Date(new Date().getTime() + 30 * 60 * 1000); // + 30 minutos
    setBlockedUntil(timeoutDate);
    localStorage.setItem('xoxonho_chat_blocked_until', timeoutDate.getTime().toString());
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading || blockedUntil || !hasApiKey) return;

    const userText = inputMessage;
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Injeta o contexto de listas salvas do usuário na chamada
      const listasInfo = savedLists?.length > 0 
        ? `O usuário tem as seguintes listas de prospectos salvas no sistema: ${savedLists.map(l => l.name).join(', ')}.` 
        : 'O usuário ainda não salvou nenhuma lista de prospecção.';

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: "INSTRUÇÕES DE SISTEMA (NÃO RESPONDA A ISSO DIRETAMENTE, APENAS OBEDEÇA NAS PRÓXIMAS INTERAÇÕES): " + SYSTEM_PROMPT + " " + listasInfo }] },
          { role: "model", parts: [{ text: "Entendido. Sou o Consultor de Vendas B2B implacável e seguirei estritamente as regras, bloqueando o usuário caso ele saia do foco comercial." }] },
          // Converte o histórico atual (ignorando a msg de boas vindas se for só uma)
          ...newMessages.slice(1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          }))
        ]
      });

      const result = await chat.sendMessage(userText);
      const responseText = result.response.text();

      // Checa gatilho de anti-abuso
      if (responseText.includes("[ALERTA_FORA_DE_CONTEXTO]")) {
        const cleanResponse = responseText.replace("[ALERTA_FORA_DE_CONTEXTO]", "").trim();
        
        // Verifica quantas vezes ele já alertou (aqui vamos simplificar: o primeiro alerta avisa, o segundo bloqueia)
        const pastWarnings = newMessages.filter(m => m.content.includes("foco é 100% em escalar")).length;
        
        if (pastWarnings >= 1) {
          // Bloqueia
          setMessages(prev => [...prev, { role: 'model', content: "⚠️ Você ignorou o alerta e continuou fora de contexto. Para evitar consumo indevido de tokens de IA, o chat foi **BLOQUEADO POR 30 MINUTOS**." }]);
          handleApplyTimeout();
        } else {
          setMessages(prev => [...prev, { role: 'model', content: "⚠️ " + cleanResponse + "\n*(Próximo aviso resultará em silêncio de 30 minutos)*" }]);
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', content: "❌ Ocorreu um erro ao conectar com o Google Gemini. Verifique se sua Chave API é válida." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // TELA DE BLOQUEIO POR FALTA DE API KEY
  if (!hasApiKey) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-fadeIn items-center justify-center">
        <div className="max-w-md w-full glass-card border border-indigo-500/30 rounded-3xl p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 mb-2">Configure sua Chave</h2>
            <p className="text-sm text-slate-400">
              Para acessar o Consultor de Vendas IA, você precisa ativar a Inteligência Artificial e inserir sua própria chave de API nas configurações. É gratuito!
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('configuracoes')}
            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Ir para Configurações
          </button>
        </div>
      </div>
    );
  }

  // TELA DO CHAT
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="p-4 rounded-t-2xl glass-card border-x border-t border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              Consultor de Vendas
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                Powered by Gemini
              </span>
            </h1>
            <p className="text-xs text-slate-400">Seu copiloto estratégico para prospecção B2B</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{role: 'model', content: "Histórico limpo. Como posso ajudar nas vendas hoje?"}])}
          className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          Limpar Chat
        </button>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/50 border-x border-slate-800 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              }`}>
                {msg.role === 'user' ? <UserCircle className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm shadow-md' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm'
              }`}>
                {/* Renderização de parágrafos simples e links */}
                {msg.content.split('\n').map((line, i) => {
                  // Converte markdown simples (negrito)
                  let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                  // Identifica o aviso de erro/timeout
                  if (line.includes('⚠️')) {
                    return <p key={i} className="text-rose-400 font-semibold mb-2" dangerouslySetInnerHTML={{__html: formattedLine}} />;
                  }
                  // Identifica links
                  if (line.includes('http')) {
                    const urlRegex = /(https?:\/\/[^\s]+)/g;
                    formattedLine = formattedLine.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 font-bold hover:underline inline-flex items-center gap-1">${url}</a>`);
                  }
                  
                  return <p key={i} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{__html: formattedLine}} />;
                })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 rounded-b-2xl glass-card border-x border-b border-slate-800 bg-slate-900/80">
        {blockedUntil ? (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-rose-400 font-bold mb-1">Consultor Suspenso Temporariamente</p>
            <p className="text-sm text-slate-400 mb-3">Múltiplas tentativas de uso fora do contexto comercial (B2B). O acesso retornará em breve para economizar seus tokens de IA.</p>
            <div className="flex items-center gap-2 text-2xl font-mono text-rose-300 font-extrabold bg-slate-950 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-rose-500" />
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="relative">
            <textarea 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ex: Monte um script de venda para a lista 'Clínicas de SP' focando em tráfego pago..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-14 py-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none min-h-[60px] max-h-32 custom-scrollbar"
              rows="2"
            />
            <button 
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white transition-all shadow-md shadow-indigo-600/20 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
