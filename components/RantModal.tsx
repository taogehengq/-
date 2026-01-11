
import React, { useState } from 'react';
import { X, MessageSquareOff, Send } from 'lucide-react';

interface RantModalProps {
  onClose: () => void;
  onSubmit: (rant: string) => void;
}

const RantModal: React.FC<RantModalProps> = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');

  const handleHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass w-full max-w-lg rounded-[2.5rem] border border-pink-500/30 overflow-hidden shadow-[0_0_80px_rgba(219,39,119,0.2)]">
        <div className="p-8 space-y-8 relative">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
               <X size={24} />
             </button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-pink-500/20 rounded-3xl mb-4">
              <MessageSquareOff className="text-pink-400 w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black font-orbitron text-white">吐槽树洞</h2>
            <p className="text-pink-400/60 text-sm font-medium tracking-widest uppercase">Vent Your Secret Thoughts</p>
          </div>

          <form onSubmit={handleHandleSubmit} className="space-y-6">
            <div className="relative group">
              <textarea
                autoFocus
                className="w-full h-32 bg-black/40 border-2 border-white/5 rounded-3xl p-6 text-xl font-bold focus:border-pink-500 focus:outline-none transition-all placeholder:text-gray-700 resize-none"
                placeholder="匿名吐槽：比如，老板明年能不能少开点会..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="absolute inset-0 rounded-3xl pointer-events-none group-focus-within:shadow-[0_0_30px_rgba(219,39,119,0.2)] transition-all" />
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="w-full group relative flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-pink-600 to-rose-700 rounded-3xl font-black tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>扔进树洞</span>
            </button>
          </form>
          
          <p className="text-center text-[10px] text-gray-500 uppercase font-black tracking-widest">
            您的吐槽将保持匿名，并在屏幕底部动态滚动展示。
          </p>
        </div>
      </div>
    </div>
  );
};

export default RantModal;
