
import React, { useState } from 'react';
import { X, Sparkles, Send } from 'lucide-react';

interface WishModalProps {
  onClose: () => void;
  onSubmit: (wish: string) => void;
}

const WishModal: React.FC<WishModalProps> = ({ onClose, onSubmit }) => {
  const [wish, setWish] = useState('');

  const handleHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (wish.trim()) {
      onSubmit(wish.trim());
      setWish('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="glass w-full max-w-lg rounded-[2.5rem] border border-cyan-500/30 overflow-hidden shadow-[0_0_80px_rgba(34,211,238,0.2)]">
        <div className="p-8 space-y-8 relative">
          <div className="absolute top-4 right-4">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
               <X size={24} />
             </button>
          </div>

          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-cyan-500/20 rounded-3xl mb-4">
              <Sparkles className="text-cyan-400 w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-3xl font-black font-orbitron text-white">许下你的愿望</h2>
            <p className="text-cyan-400/60 text-sm font-medium tracking-widest uppercase">Make Your Wish Come True</p>
          </div>

          <form onSubmit={handleHandleSubmit} className="space-y-6">
            <div className="relative group">
              <textarea
                autoFocus
                className="w-full h-32 bg-black/40 border-2 border-white/5 rounded-3xl p-6 text-xl font-bold focus:border-cyan-500 focus:outline-none transition-all placeholder:text-gray-700 resize-none"
                placeholder="例如：我想要一台最新的游戏机..."
                value={wish}
                onChange={(e) => setWish(e.target.value)}
              />
              <div className="absolute inset-0 rounded-3xl pointer-events-none group-focus-within:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all" />
            </div>

            <button
              type="submit"
              disabled={!wish.trim()}
              className="w-full group relative flex items-center justify-center gap-3 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-3xl font-black tracking-[0.2em] uppercase transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
            >
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>提交愿望并加入奖池</span>
            </button>
          </form>
          
          <p className="text-center text-[10px] text-gray-500 uppercase font-black tracking-widest">
            您的愿望将自动被记录并作为新奖项添加到抽奖系统中
          </p>
        </div>
      </div>
    </div>
  );
};

export default WishModal;
