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
      className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-[#161214] border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between animate-slideLeft"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0c0a0b]">
        <div>
          <h3 className="text-sm font-bold text-[#faf7f5]">Chat Interno da Equipe</h3>
          <span className="text-[10px] text-[#a39b94]">Canais de Auditoria & Negociação</span>
        </div>
        <button
          onClick={toggleChat}
          aria-label="Fechar chat"
          className="p-2 rounded-lg text-[#a39b94] hover:text-[#faf7f5] hover:bg-[#221c1f] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e11d48]"
        >
          ✕
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
