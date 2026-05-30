import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';
import { sendChat } from '../api';
import { ka } from '../i18n/ka';

export default function ChatPanel() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: ka.chatGreeting },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    const history = messages.filter((m) => m.role === 'user' || m.role === 'assistant').slice(-8);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { reply } = await sendChat(msg, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: ka.chatError }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside className="glass rounded-2xl flex flex-col h-full min-h-[480px] shadow-card border border-slate-700/50">
      <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-400" />
        <h2 className="font-display font-semibold text-lg">{ka.chatTitle}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                m.role === 'user' ? 'bg-brand-600' : 'bg-slate-700'
              }`}
            >
              {m.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4 text-brand-300" />
              )}
            </div>
            <div
              className={`rounded-xl px-3 py-2 text-sm max-w-[90%] ${
                m.role === 'user'
                  ? 'bg-brand-600/30 text-slate-100'
                  : 'bg-slate-800/80 text-slate-300'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            {ka.chatThinking}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-700/50 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {ka.chatSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSend(s)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={ka.chatPlaceholder}
            className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 p-2.5 text-white transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  );
}
