import React, { useState } from 'react';
import { Sparkles, X, Send, Bus, Bot } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  originCityName?: string;
  destCityName?: string;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  originCityName = 'نواكشوط',
  destCityName = 'نواذيبو'
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `مرحباً بك! أنا مساعدك الذكي في منصة سفر موريتانيا (Safar MR). يسعدني إرشادك لأفضل أوقات السفر، المسافات والنصائح لرحلتك القادمة بين ${originCityName} و ${destCityName}. كيف يمكنني مساعدتك اليوم؟`
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt;
    setPrompt('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/travel-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          origin: originCityName,
          destination: destCityName
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'أهلاً بك! ينصح دائماً بحجز رحلتك مبكراً والوصول لمحطة الانطلاق قبل الموعد بـ 30 دقيقة.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end font-sans">
      <div className="w-full max-w-md bg-slate-900 border-r border-slate-800 h-full flex flex-col justify-between shadow-2xl text-right">
        
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">مساعد السفر الذكي (Safar AI)</h3>
              <p className="text-[10px] text-slate-400">استشارات رحلات موريتانيا الذكية</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto text-xs">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-bold mr-auto rounded-tl-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/80 ml-auto rounded-tr-none'
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl w-fit text-slate-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>جاري كتابة الرد الموريتاني المناسب...</span>
            </div>
          )}
        </div>

        {/* Chat Form */}
        <form onSubmit={handleSend} className="p-4 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="اسأل المساعد عن المسافات أو أفضل الساعات..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </div>
  );
};
