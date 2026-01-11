
import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, Play, Square, Settings, Sparkles, MessageSquareOff, ChevronRight, X } from 'lucide-react';
import { loadState, saveState } from './services/storageService';
import { AppState, Prize, Participant, Wish, Rant } from './types';
import WishModal from './components/WishModal';
import RantModal from './components/RantModal';
import Confetti from './components/Confetti';
import AdminPanel from './components/AdminPanel';
import TagSphere from './components/TagSphere';
import { WishEffect, VolcanoEffect } from './components/SpecialEffects';

export default function App() {
  const [state, setState] = useState<AppState>(loadState());
  const [drawing, setDrawing] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [isZooming, setIsZooming] = useState(false); 
  const [isSwitching, setIsSwitching] = useState(false); // 奖池切换状态
  const [currentName, setCurrentName] = useState('READY');
  const [winner, setWinner] = useState<any>(null);
  
  const [modals, setModals] = useState({ wish: false, rant: false, admin: false, win: false });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentPrize = useMemo(() => {
    return state.prizes.find(p => p.id === state.currentPrizeId) || state.prizes[0];
  }, [state.prizes, state.currentPrizeId]);

  const prizeWinnerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    state.winners.forEach(w => {
      counts[w.prizeId] = (counts[w.prizeId] || 0) + 1;
    });
    return counts;
  }, [state.winners]);

  const isCurrentPrizeFull = (prizeWinnerCounts[currentPrize.id] || 0) >= currentPrize.count;

  const drawingPool = useMemo(() => {
    if (currentPrize.type === 'wish') return state.wishes.filter(w => !w.isWon).map(w => ({ id: w.id, text: w.text }));
    if (currentPrize.type === 'rant') return state.rants.filter(r => !r.isWon).map(r => ({ id: r.id, text: r.text }));
    return state.participants.filter(p => !p.isWon).map(p => ({ id: p.id, text: p.name }));
  }, [state, currentPrize]);

  useEffect(() => {
    let timer: number;
    if (drawing || stopping) {
      timer = window.setInterval(() => {
        if (!drawingPool.length) {
          setDrawing(false);
          setStopping(false);
          return setCurrentName('池子已空');
        }
        const randomIndex = Math.floor(Math.random() * drawingPool.length);
        setCurrentName(drawingPool[randomIndex].text);
      }, stopping ? 80 : 40);
    }
    return () => clearInterval(timer);
  }, [drawing, stopping, drawingPool]);

  const handleToggleDraw = () => {
    if (isCurrentPrizeFull && !drawing) {
      alert(`该奖项 [${currentPrize.name}] 已抽完！`);
      return;
    }
    if (!drawingPool.length && !drawing) return alert("当前奖池已抽完或为空！");

    if (drawing) {
      setDrawing(false);
      setStopping(true);
      setTimeout(() => {
        setStopping(false);
        const rigged = state.participants.find(p => p.isRigged && !p.isWon && currentPrize.type === 'standard');
        const luckyItem = rigged ? { id: rigged.id, text: rigged.name } : drawingPool.find(i => i.text === currentName) || drawingPool[0];
        
        setCurrentName(luckyItem.text);
        setWinner(luckyItem);

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
      }, 250);
    } else {
      setWinner(null);
      setDrawing(true);
    }
  };

  const handleConfirmWin = () => {
    setModals(m => ({ ...m, win: false }));
    setCurrentName('READY');
    setIsZooming(true);
    setTimeout(() => setIsZooming(false), 1000);
  };

  const handleSwitchPrize = (id: string) => {
    if(drawing || stopping) return;
    setIsSwitching(true);
    setState(s => ({ ...s, currentPrizeId: id }));
    setCurrentName('READY');
    setTimeout(() => setIsSwitching(false), 600);
  };

  return (
    <div className={`relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden text-white transition-all duration-500 ${isSwitching ? 'brightness-150 scale-105' : ''}`}>
      {/* 炫彩背景 */}
      <div className="bg-colorful" />
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      
      {/* 特殊场景特效 */}
      {currentPrize.type === 'wish' && <WishEffect />}
      {currentPrize.type === 'rant' && <VolcanoEffect />}
      
      {/* 3D 球体 */}
      <TagSphere 
        items={drawingPool.map(i => ({ id: i.id, text: i.text, color: currentPrize.color }))} 
        isDrawing={drawing} 
        isStopping={stopping}
        isZoomedIn={isZooming || modals.win || isSwitching}
      />
      
      {/* 顶部标题栏 */}
      <div className="absolute top-10 left-10 flex items-center gap-4 z-20">
        <div className="glass p-3 rounded-2xl border-cyan-500/30">
          <Trophy className="text-cyan-400" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black font-orbitron neon-text leading-tight">{state.appName}</h1>
          <p className="text-[10px] tracking-[0.4em] text-cyan-500/50 uppercase">{state.appSubName}</p>
        </div>
      </div>

      {/* 右上角功能区 */}
      <div className="absolute top-10 right-10 flex gap-3 z-20">
        <button onClick={() => setModals(m => ({...m, wish: true}))} title="许愿" className="glass w-12 h-12 rounded-xl flex items-center justify-center text-yellow-400 hover:scale-110 transition-all border-yellow-500/20"><Sparkles size={20}/></button>
        <button onClick={() => setModals(m => ({...m, rant: true}))} title="吐槽" className="glass w-12 h-12 rounded-xl flex items-center justify-center text-pink-400 hover:scale-110 transition-all border-pink-500/20"><MessageSquareOff size={20}/></button>
        <button onClick={() => setModals(m => ({...m, admin: true}))} title="设置" className="glass w-12 h-12 rounded-xl flex items-center justify-center text-cyan-400 hover:scale-110 transition-all border-cyan-500/20"><Settings size={20}/></button>
      </div>

      {/* 奖项切换器 */}
      <div className="absolute top-32 flex gap-2 glass p-1.5 rounded-full z-20 max-w-[90vw] overflow-x-auto no-scrollbar shadow-2xl">
        {state.prizes.map(p => {
          const winCount = prizeWinnerCounts[p.id] || 0;
          return (
            <button 
              key={p.id}
              onClick={() => handleSwitchPrize(p.id)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${state.currentPrizeId === p.id ? 'bg-cyan-600 text-white shadow-lg scale-105' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}
            >
              <span>{p.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[8px] ${state.currentPrizeId === p.id ? 'bg-white/20' : 'bg-black/20 text-gray-400'}`}>
                {winCount}/{p.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 主抽奖区 */}
      <div className="absolute bottom-24 z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom duration-700">
        <div className={`glass rounded-[3rem] p-10 w-[30rem] text-center border-white/5 shadow-2xl relative overflow-hidden transition-all duration-500 ${drawing ? 'opacity-100 scale-100 shadow-[0_0_50px_rgba(255,255,255,0.05)]' : 'opacity-40 scale-95'}`}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
          
          <div className="flex justify-between items-center mb-4 px-4">
             <div className="text-[10px] font-black tracking-[0.4em] text-cyan-500/30 uppercase">
                {currentPrize.name}
             </div>
             <div className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                POOL: {drawingPool.length}
             </div>
          </div>
          
          <div className="h-20 flex items-center justify-center">
            <h2 className={`text-3xl font-black transition-all duration-75 tracking-tight ${drawing ? 'scale-110 blur-[1px] text-white' : 'scale-100 text-white/80'}`}>
              {currentName}
            </h2>
          </div>

          <button 
            onClick={handleToggleDraw}
            disabled={stopping || isSwitching || (isCurrentPrizeFull && !drawing)}
            className={`mt-6 w-full py-4 rounded-[1.5rem] font-black text-base uppercase tracking-[0.3em] transition-all transform active:scale-95 flex items-center justify-center gap-4 ${isCurrentPrizeFull && !drawing ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : drawing ? 'bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'bg-cyan-600/80 shadow-[0_0_30px_rgba(8,145,178,0.2)] hover:bg-cyan-600 hover:scale-105'}`}
          >
            {isCurrentPrizeFull && !drawing ? <Trophy size={18} className="opacity-40" /> : drawing ? <Square fill="currentColor" size={18}/> : <Play fill="currentColor" size={18}/>}
            {isCurrentPrizeFull && !drawing ? 'Completed' : drawing ? 'Stop' : 'Draw'}
          </button>
        </div>
      </div>

      {/* 底部吐槽跑马灯 */}
      <div className="absolute bottom-0 w-full h-12 bg-black/10 backdrop-blur-md border-t border-white/5 flex items-center overflow-hidden z-20">
        <div className="flex whitespace-nowrap animate-marquee">
          {state.rants.length > 0 ? (
            state.rants.concat(state.rants).map((r, i) => (
              <span key={i} className="mx-12 text-[11px] font-bold text-pink-400/50 tracking-widest flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500/20" />
                匿名吐槽: {r.text}
              </span>
            ))
          ) : (
            <span className="mx-12 text-[11px] font-bold text-gray-500/20 uppercase tracking-widest">
              等待第一条匿名吐槽...
            </span>
          )}
        </div>
      </div>

      {/* 弹窗组件 */}
      {modals.wish && <WishModal onClose={() => setModals(m=>({...m, wish: false}))} onSubmit={(txt) => {
        setState(s => ({ ...s, wishes: [...s.wishes, { id: Date.now().toString(), text: txt, color: '#06b6d4', isWon: false }] }));
        setModals(m=>({...m, wish: false}));
      }} />}
      
      {modals.rant && <RantModal onClose={() => setModals(m=>({...m, rant: false}))} onSubmit={(txt) => {
        setState(s => ({ ...s, rants: [...s.rants, { id: Date.now().toString(), text: txt, timestamp: Date.now(), isWon: false }] }));
        setModals(m=>({...m, rant: false}));
      }} />}
      
      {modals.admin && <AdminPanel state={state} onUpdate={setState} onClose={() => setModals(m=>({...m, admin: false}))} />}

      {/* 中奖揭晓 */}
      {modals.win && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-3xl animate-in fade-in duration-300 p-6">
          <Confetti />
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
             <p className="text-cyan-400 font-black tracking-[0.5em] text-xs uppercase opacity-80">Congratulations</p>
             <h3 className="text-2xl font-bold opacity-50">恭喜获得 {currentPrize.name}</h3>
             <h2 className="text-[10rem] font-black italic neon-text leading-none animate-bounce">{winner?.text}</h2>
             <button 
              onClick={handleConfirmWin} 
              className="px-16 py-4 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-cyan-400 transition-all hover:scale-110 active:scale-95 shadow-2xl"
             >
               Confirm & Return
             </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
      `}</style>
    </div>
  );
}
