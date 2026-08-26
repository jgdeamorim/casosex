import React, { useState, useRef } from 'react';
import { useRenderContext } from '../../context/RenderContext';
import type { ChatMessage } from '../../types';
import { useFocusTrap } from '../../lib/useFocusTrap';
import { triggerHapticFeedback } from '../../lib/pwa-helpers';

export function TeamChatDrawer(): React.ReactElement | null {
  const { isChatOpen, toggleChat, userSession } = useRenderContext();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const [activeChannel, setActiveChannel] = useState<'#geral-volupia' | '#homologacao-glaucia' | '#negociacao-bruno'>('#geral-volupia');

  useFocusTrap(drawerRef, isChatOpen, toggleChat);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', channel: '#geral-volupia', author: 'Jeferson (Founder)', time: '10:14', text: 'Pessoal, atualizamos a lista para 307 fornecedores mapeados nos Polos SP e RJ!' },
    { id: '2', channel: '#homologacao-glaucia', author: 'Gláucia (Ops)', time: '10:22', text: 'Estou revisando a licença Anvisa e laudo técnico da fábrica Intt em Diadema.' },
    { id: '3', channel: '#negociacao-bruno', author: 'Bruno (Comercial)', time: '10:30', text: 'Consegui a liberação de faturamento em 30/60 dias no boleto faturado!' }
  ]);

  const [inputText, setInputText] = useState<string>('');

  if (!isChatOpen) return null;

  const handleSendMessage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!inputText.trim()) return;
    triggerHapticFeedback(8);

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      channel: activeChannel,
      author: `${userSession.name} (${userSession.role.toUpperCase()})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim(),
      isMe: true
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
  };

  const channelMessages = messages.filter((m) => m.channel === activeChannel);

  return (
    <div
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Chat interno da equipe"
      className="fixed inset-x-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-30 bg-[#0c0a0b]/95 backdrop-blur-2xl animate-in slide-in-from-bottom duration-200 flex flex-col border-t border-b border-stone-800 shadow-2xl"
    >
      {/* Header do Chat WhatsApp B2B com Status Online */}
      <div className="p-3.5 border-b border-stone-800 flex items-center justify-between bg-[#161214]/90 backdrop-blur-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-500/20 shrink-0 font-black">
            💬
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-stone-100">
                Interchat Team B2B
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-stone-400 truncate">
              Canais Diretos de Negociação & Auditoria Volúpia
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerHapticFeedback(6);
            toggleChat();
          }}
          aria-label="Fechar chat da equipe"
          className="w-9 h-9 rounded-full bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0 min-h-[44px] min-w-[44px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Channel Switcher */}
      <div className="flex border-b border-stone-800/80 bg-[#120e10] text-[11px] font-bold shrink-0">
        {(['#geral-volupia', '#homologacao-glaucia', '#negociacao-bruno'] as const).map((ch) => {
          const isSelected = activeChannel === ch;
          const displayTitle = ch === '#geral-volupia' ? '# Geral' : ch === '#homologacao-glaucia' ? '# Auditoria' : '# Negociação';
          return (
            <button
              key={ch}
              onClick={() => {
                triggerHapticFeedback(4);
                setActiveChannel(ch);
              }}
              className={`flex-1 py-2.5 px-2 text-center transition-all whitespace-nowrap min-h-[44px] flex items-center justify-center font-extrabold ${
                isSelected
                  ? 'text-emerald-400 border-b-2 border-emerald-500 bg-stone-900/60'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {displayTitle}
            </button>
          );
        })}
      </div>

      {/* Listagem de Mensagens em Balões Estilo WhatsApp */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#0c0a0b]/60">
        {channelMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3.5 rounded-2xl max-w-[85%] shadow-md transition-all ${
              msg.isMe
                ? 'ml-auto bg-emerald-600/20 border border-emerald-500/40 text-stone-100 rounded-br-none'
                : 'bg-stone-900/90 border border-stone-800 text-stone-200 rounded-bl-none'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1 font-bold">
              <span className={msg.isMe ? 'text-emerald-400' : 'text-rose-400'}>{msg.author}</span>
              <span className="text-stone-500">{msg.time}</span>
            </div>
            <p className="leading-relaxed text-xs">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input Form do WhatsApp B2B */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-800 bg-[#161214] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Enviar mensagem em ${activeChannel}...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 min-h-[48px]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold flex items-center justify-center transition-all shadow-md shadow-emerald-500/20 shrink-0 min-h-[48px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
}

