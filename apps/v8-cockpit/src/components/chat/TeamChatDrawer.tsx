import React, { useState, useRef } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { ChatMessage } from '../../types';
import { useFocusTrap } from '../../lib/useFocusTrap';

export function TeamChatDrawer(): React.ReactElement | null {
  const { isChatOpen, toggleChat, userSession } = useRenderContext();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [activeChannel, setActiveChannel] = useState<'#geral-volupia' | '#homologacao-glaucia' | '#negociacao-bruno'>('#geral-volupia');

  useFocusTrap(drawerRef, isChatOpen, toggleChat);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', channel: '#geral-volupia', author: 'Jeferson (Founder)', time: '10:14', text: 'Pessoal, atualizamos a lista para 307 fornecedores mapeados!' },
    { id: '2', channel: '#homologacao-glaucia', author: 'Gláucia (Ops)', time: '10:22', text: 'Estou revisando a licença Anvisa da fábrica Intt Lingerie em Diadema.' },
    { id: '3', channel: '#negociacao-bruno', author: 'Bruno (Comercial)', time: '10:30', text: 'Consegui a tabela faturada 30/60 dias com a Hot Flowers!' }
  ]);

  const [inputText, setInputText] = useState<string>('');

  if (!isChatOpen) return null;

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      channel: activeChannel,
      author: `${userSession.name} (${userSession.role.toUpperCase()})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      isMe: true
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
  };

  const channelMessages = messages.filter(m => m.channel === activeChannel);

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chat interno da equipe"
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-30 bg-[#0c0a0b]/95 backdrop-blur-xl animate-in slide-in-from-bottom duration-200 flex flex-col border-t border-b border-stone-800"
    >
      {/* Header com Botão X Moderno */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-[#161214]">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-stone-200">Interchat Team B2B</h3>
          <span className="text-[10px] text-stone-400">Canais de Auditoria & Negociação</span>
        </div>
        <button
          type="button"
          onClick={toggleChat}
          aria-label="Fechar chat da equipe"
          className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0 min-h-[44px] min-w-[44px]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Channel Switcher */}
      <div className="flex border-b border-white/10 bg-[#0c0a0b] text-[11px] font-bold">
        {(['#geral-volupia', '#homologacao-glaucia', '#negociacao-bruno'] as const).map(ch => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`flex-1 py-2 px-1 text-center transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48] ${
              activeChannel === ch
                ? 'text-[#e11d48] border-b-2 border-[#e11d48] bg-[#221c1f]'
                : 'text-[#a39b94] hover:text-[#faf7f5]'
            }`}
          >
            {ch.split('-')[0]}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {channelMessages.map(msg => (
          <div
            key={msg.id}
            className={`p-3 rounded-xl max-w-[85%] ${
              msg.isMe
                ? 'ml-auto bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#faf7f5]'
                : 'bg-[#0c0a0b] border border-white/10 text-[#faf7f5]'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-[#a39b94] mb-1 font-bold">
              <span>{msg.author}</span>
              <span>{msg.time}</span>
            </div>
            <p className="leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#0c0a0b] flex gap-2">
        <input
          type="text"
          placeholder={`Mensagem em ${activeChannel}...`}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 rounded-xl bg-[#161214] border border-white/10 text-xs text-[#faf7f5] placeholder-[#a39b94] focus:border-[#e11d48] focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-[#e11d48] text-white font-bold text-xs hover:bg-[#e11d48]/90 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
