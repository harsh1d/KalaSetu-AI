import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  HelpCircle, 
  ShieldCheck, 
  Palette, 
  RefreshCw,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KalaMitraCopilot: React.FC = () => {
  const { role, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: role === 'artisan' 
        ? 'Namaste! I am Kala-Mitra, your Craft & Catalog Copilot. Would you like help recording your craft voice, calculating a fair price, or checking what crafts are trending?'
        : 'Namaste! Welcome to KalaSetu. I am Kala-Mitra, your Heritage Craft AI. Ask me anything about authentic GI crafts, artisan backgrounds, or fair pricing breakdowns!',
      time: 'Just now'
    }
  ]);

  const [suggestedChips, setSuggestedChips] = useState<string[]>(
    role === 'artisan'
      ? ['How does voice cataloging work?', 'Calculate fair price for my craft', 'What designs are trending?']
      : ['Explain GI Certification', 'How does fair trade pricing work?', 'Show Madhubani paintings']
  );

  const handleSend = async (userText?: string) => {
    const query = userText || inputMessage;
    if (!query.trim() || loading) return;

    const newMsg = { sender: 'user' as const, text: query, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, role })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        if (data.suggestedActions && data.suggestedActions.length > 0) {
          setSuggestedChips(data.suggestedActions);
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'KalaSetu AI is operating in smart local mode. Authentic GI crafts empower traditional artisans by guaranteeing 70%+ direct revenue and zero exploitative middleman commission.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-artisan-600 via-artisan-500 to-amber-600 text-white shadow-xl shadow-artisan-600/30 hover:scale-105 transition-all duration-300"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse-slow" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
          </div>
          <span className="font-semibold text-xs tracking-wide">Kala-Mitra AI Copilot</span>
          <span className="bg-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
            {role}
          </span>
        </button>
      )}

      {isOpen && (
        <div className={`w-96 max-w-[92vw] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[520px]'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-artisan-600 to-amber-600 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">Kala-Mitra Copilot</h4>
                <p className="text-[10px] text-white/80 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  SIH26090 AI Artisan Intelligence
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="p-1 hover:bg-white/20 rounded-md text-white/90"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/20 rounded-md text-white/90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50 dark:bg-slate-950/40 text-xs">
                {messages.map((m, idx) => (
                  <div 
                    key={idx} 
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-2.5 ${
                        m.sender === 'user'
                          ? 'bg-artisan-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-xs shadow-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] p-2 bg-white dark:bg-slate-800 rounded-xl w-fit">
                    <RefreshCw className="w-3 h-3 animate-spin text-artisan-500" />
                    <span>Kala-Mitra is thinking...</span>
                  </div>
                )}
              </div>

              {/* Suggested Chips */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-1.5 overflow-x-auto text-[11px]">
                {suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(chip)}
                    className="shrink-0 px-2 py-1 rounded-full bg-artisan-50 dark:bg-artisan-950/50 text-artisan-700 dark:text-artisan-300 border border-artisan-200 dark:border-artisan-800 hover:bg-artisan-100 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={role === 'artisan' ? 'Ask about cataloging, pricing...' : 'Ask about GI crafts, heritage...'}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-hidden focus:ring-1 focus:ring-artisan-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!inputMessage.trim() || loading}
                  className="p-2 rounded-xl bg-artisan-600 text-white disabled:opacity-40 hover:bg-artisan-700 transition-colors shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
