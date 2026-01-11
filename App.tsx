
import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Play, Square, Settings, Sparkles, MessageSquareOff, ChevronRight, X } from 'lucide-react';
import { loadState, saveState } from './services/storageService';
import { AppState, Prize, Participant, Wish, Rant } from './types';
import WishModal from './components/WishModal';
import RantModal from './components/RantModal';
import Confetti from './components/Confetti';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // 1. 初始化完整状态
  const [state, setState] = useState<AppState>(loadState());
  const [drawing, setDrawing] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [currentName, setCurrentName] = useState('READY');
  const [winner, setWinner] = useState<any>(null);
  
  // UI 控制状态
  const [modals, setModals] = useState({ wish: false, rant: false, admin: false, win: false });

  // 2. 自动保存状态
  useEffect(() => {
    saveState(state);
  }, [state]);

  // 3. 计算当前抽奖池
  const currentPrize = useMemo(() => {
    return state.prizes.find(p => p.id === state.currentPrizeId) || state.prizes[0];
  }, [state.prizes, state.currentPrizeId]);

  const drawingPool = useMemo(() => {
    if (currentPrize.type === 'wish') return state.wishes.filter(w => !w.isWon).map(w => ({ id: w.id, text: w.text }));
    if (currentPrize.type === 'rant') return state.rants.filter(r => !r.isWon).map(r => ({ id: r.id, text: r.text }));
    return state.participants.filter(p => !p.isWon).map(p => ({ id: p.id, text: p.name }));
  }, [state, currentPrize]);

  // 4. 抽奖滚动逻辑
  useEffect(() => {
    let timer: number;
    if (drawing || stopping) {
      timer = window.setInterval(() => {
        if (!drawingPool.length) return setCurrentName('池子已空');
        const randomIndex = Math.floor(Math.random() * drawingPool.length);
        setCurrentName(drawingPool[randomIndex].text);
      }, stopping ? 150 : 50);
    }
    return () => clearInterval(timer);
  }, [drawing, stopping, drawingPool]);

  // 5. 抽奖核心动作
  const handleToggleDraw = () => {
    if (!drawingPool.length && !drawing) return alert("当前奖池已抽完或为空！");

    if (drawing) {
      setDrawing(false);
      setStopping(true);
      
      // 模拟一点延迟停顿感
      setTimeout(() => {
        setStopping(false);
        // 查找必中逻辑
        const rigged = state.participants.find(p => p.isRigged && !p.isWon && currentPrize.type === 'standard');
        const luckyItem = rigged ? { id: rigged.id, text: rigged.name } : drawingPool.find(i => i.text === currentName) || drawingPool[0];
        
        setCurrentName(luckyItem.text);
        setWinner(luckyItem);

        // 更新状态：标记已中奖
        setState(s => ({
          ...s,
          participants: s.participants.map(p => p.id === luckyItem.id ? { ...p, isWon: true } : p),
          wishes: s.wishes.map(w => w.id === luckyItem.id ? { ...w, isWon: true } : w),
          rants: s.rants.map(r => r.id === luckyItem.id ? { ...r, isWon: true } : r),
          winners: [...s.winners, {
            id: Date.now().toString(),
            type: currentPrize.type,
            prizeId: currentPrize.id,
            prizeName: currentPrize.name,
            name: luckyItem.text,
            timestamp: Date.now()
          }]
        }));
        
        setModals(m => ({ ...m, win: true }));
      }, 1000);
    } else {
      setWinner(null);
      setDrawing(true);
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-[#020617] text-white">
      <div className="bg-glow" />
      
      {/* 顶部标题栏 */}
      <div className="absolute top-10 left-10 flex items-center gap-4 z-20">
        <div className="glass p-3 rounded-2xl border-cyan-500/30">
          <Trophy className="text-cyan-400" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black font-orbitron neon-text">{state.appName}</h1>
          <p className="text-[10px] tracking-[0.4em] text-cyan-500/50 uppercase">{state.appSubName}</p>
        </div>
      </div>

      {/* 右上角功能区 */}
      <div className="absolute top-10 right-10 flex gap-3 z-20">
        <button onClick={() => setModals(m => ({...m, wish: true}))} className="glass w-12 h-12 rounded-xl flex items-center justify-center text-yellow-400 hover:scale-110 transition-all border-yellow-500/20"><Sparkles size={20}/></button>
        <button onClick={() => setModals(m => ({...m, rant: true}))} className="glass w-12 h-12 rounded-xl flex items-center justify-center text-pink-400 hover:scale-110 transition-all border-pink-500/20"><MessageSquareOff size={20}/></button>
        <button onClick={() => setModals(m => ({...m, admin: true}))} className="glass w-12 h-12 rounded-xl flex items-center justify-center text-cyan-400 hover:scale-110 transition-all border-cyan-500/20"><Settings size={20}/></button>
      </div>

      {/* 奖项切换器 */}
      <div className="absolute top-32 flex gap-2 glass p-1.5 rounded-full z-20 max-w-[90vw] overflow-x-auto no-scrollbar">
        {state.prizes.map(p => (
          <button 
            key={p.id}
            onClick={() => setState(s => ({ ...s, currentPrizeId: p.id }))}
            className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${state.currentPrizeId === p.id ? 'bg-cyan-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 主抽奖区 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="glass rounded-[4rem] p-16 w-[32rem] text-center border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div className="text-[10px] font-black tracking-[0.5em] text-cyan-500/60 uppercase mb-8">
            Now Drawing: {currentPrize.name}
          </div>
          
          <div className="h-40 flex items-center justify-center">
            <h2 className={`text-7xl font-black transition-all duration-75 ${drawing ? 'scale-110 blur-[1px]' : 'scale-100'}`}>
              {currentName}
            </h2>
          </div>

          <button 
            onClick={handleToggleDraw}
            disabled={stopping}
            className={`mt-12 w-full py-6 rounded-[2rem] font-black text-xl uppercase tracking-[0.3em] transition-all transform active:scale-95 flex items-center justify-center gap-4 ${drawing ? 'bg-red-600 shadow-[0_0_40px_rgba(220,38,38,0.3)]' : 'bg-cyan-600 shadow-[0_0_40px_rgba(8,145,178,0.3)] hover:scale-105'} disabled:opacity-50`}
          >
            {drawing ? <Square fill="currentColor" size={24}/> : <Play fill="currentColor" size={24}/>}
            {drawing ? 'Stop' : 'Draw'}
          </button>
        </div>
      </div>

      {/* 底部吐槽跑马灯 */}
      <div className="absolute bottom-0 w-full h-12 bg-black/40 backdrop-blur-md border-t border-white/5 flex items-center overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-marquee">
          {state.rants.length > 0 ? (
            state.rants.concat(state.rants).map((r, i) => (
              <span key={i} className="mx-12 text-[11px] font-bold text-pink-400/70 tracking-widest flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500/40" />
                匿名吐槽: {r.text}
              </span>
            ))
          ) : (
            <span className="mx-12 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              等待第一条匿名吐槽... 点击右上角图标开始
            </span>
          )}
        </div>
      </div>

      {/* 弹窗组件 */}
      {modals.wish && <WishModal onClose={() => setModals(m=>({...m, wish: false}))} onSubmit={(txt) => {
        setState(s => ({ ...s, wishes: [...s.wishes, { id: Date.now().toString(), text: txt, color: '#06b6d4' }] }));
        setModals(m=>({...m, wish: false}));
      }} />}
      
      {modals.rant && <RantModal onClose={() => setModals(m=>({...m, rant: false}))} onSubmit={(txt) => {
        setState(s => ({ ...s, rants: [...s.rants, { id: Date.now().toString(), text: txt, timestamp: Date.now() }] }));
        setModals(m=>({...m, rant: false}));
      }} />}
      
      {modals.admin && <AdminPanel state={state} onUpdate={setState} onClose={() => setModals(m=>({...m, admin: false}))} />}

      {/* 中奖揭晓 */}
      {modals.win && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500 p-6">
          <Confetti />
          <div className="text-center space-y-8 animate-in zoom-in duration-300">
             <p className="text-cyan-400 font-black tracking-[0.5em] text-sm uppercase">Congratulations</p>
             <h3 className="text-4xl font-bold opacity-60">恭喜获得 {currentPrize.name}</h3>
             <h2 className="text-[10rem] font-black italic neon-text leading-none">{winner?.text}</h2>
             <button onClick={() => setModals(m=>({...m, win: false}))} className="px-16 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-cyan-400 transition-colors">Continue</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
