
import React, { useState } from 'react';
import { AppState, Prize } from '../types';
import { X, Trash2, RotateCcw, Trash, Download, FileSpreadsheet, Settings, AlertCircle } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

export default function AdminPanel({ state, onUpdate, onClose }: { state: AppState, onUpdate: any, onClose: any }) {
  const [confirmState, setConfirmState] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
    type?: 'danger' | 'warning';
  }>({
    show: false,
    title: '',
    message: '',
    action: () => {}
  });

  const triggerConfirm = (title: string, message: string, action: () => void, type: 'danger' | 'warning' = 'danger') => {
    setConfirmState({ show: true, title, message, action, type });
  };
  
  const handleImport = (txt: string) => {
    const ps = txt.split('\n').filter(l => l.trim()).map(l => {
      const parts = l.split(/\s+/);
      const isRigged = l.includes('*');
      return { 
        id: Math.random().toString(36).substr(2, 9), 
        name: parts[0].replace('*', ''), 
        department: parts[1] || '默认部门', 
        isWon: false, 
        isRigged 
      };
    });
    if (ps.length) onUpdate((s: any) => ({ ...s, participants: [...s.participants, ...ps] }));
  };

  const resetPrizeWinners = (prizeId: string, prizeName: string) => {
    triggerConfirm(
      "重置奖项",
      `确定重置 [${prizeName}] 的中奖记录吗？该奖项的中奖人员将重新回到抽奖池。`,
      () => {
        onUpdate((s: AppState) => {
          const winnersToClear = s.winners.filter(w => w.prizeId === prizeId).map(w => w.name);
          return {
            ...s,
            winners: s.winners.filter(w => w.prizeId !== prizeId),
            participants: s.participants.map(p => winnersToClear.includes(p.name) ? { ...p, isWon: false } : p),
            wishes: s.wishes.map(w => winnersToClear.includes(w.text) ? { ...w, isWon: false } : w),
            rants: s.rants.map(r => winnersToClear.includes(r.text) ? { ...r, isWon: false } : r),
          };
        });
        setConfirmState(prev => ({ ...prev, show: false }));
      },
      'warning'
    );
  };

  const resetAllWinners = () => {
    triggerConfirm(
      "全量重置中奖结果",
      "此操作将清除目前所有已产生的中奖记录，所有人（包括愿望和吐槽）将恢复为待抽取状态。此操作不可撤销！",
      () => {
        onUpdate((s: AppState) => ({
          ...s,
          winners: [],
          participants: s.participants.map(p => ({ ...p, isWon: false })),
          wishes: s.wishes.map(w => ({ ...w, isWon: false })),
          rants: s.rants.map(r => ({ ...r, isWon: false })),
        }));
        setConfirmState(prev => ({ ...prev, show: false }));
      }
    );
  };

  const updatePrize = (id: string, updates: Partial<Prize>) => {
    onUpdate((s: AppState) => ({
      ...s,
      prizes: s.prizes.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  return (
    <>
      <div className="fixed inset-y-0 right-0 w-full max-w-sm z-[120] glass border-l border-white/10 flex flex-col animate-in slide-in-from-right shadow-2xl">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
               <Settings className="text-cyan-400" size={18} />
             </div>
             <h2 className="text-lg font-black font-orbitron tracking-tight">后台配置</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* 人员导入 */}
          <section className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                <FileSpreadsheet size={12} /> 人员导入 (姓名 部门)
              </label>
              <span className="text-[9px] text-gray-500 font-bold uppercase">Total: {state.participants.length}</span>
            </div>
            <textarea 
              className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] font-medium outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-700" 
              placeholder="张三 技术部&#10;李四* 销售部 (加*号必中)" 
              onBlur={e => { handleImport(e.target.value); e.target.value = ''; }} 
            />
            <button 
              onClick={() => triggerConfirm("清空名单", "确定清空所有参与抽奖的人员名单吗？", () => {
                onUpdate((s: any) => ({ ...s, participants: [] }));
                setConfirmState(prev => ({ ...prev, show: false }));
              })} 
              className="text-[9px] text-red-500/60 font-black uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              清空所有人员名单
            </button>
          </section>

          {/* 奖项配置 */}
          <section className="space-y-4">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">奖项配置与重置</label>
            <div className="space-y-3">
              {state.prizes.map(p => (
                <div key={p.id} className="p-4 glass rounded-2xl border-white/5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <input 
                      type="text" 
                      className="flex-1 bg-transparent border-b border-transparent focus:border-cyan-500/50 outline-none text-[12px] font-bold py-1" 
                      value={p.name} 
                      onChange={e => updatePrize(p.id, { name: e.target.value })} 
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        className="w-10 bg-black/20 text-center rounded-lg text-xs py-1 outline-none text-cyan-400 font-bold" 
                        value={p.count} 
                        onChange={e => updatePrize(p.id, { count: parseInt(e.target.value) || 1 })} 
                      />
                      <span className="text-[9px] text-gray-500 font-bold">位</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => resetPrizeWinners(p.id, p.name)} 
                      className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                      <RotateCcw size={10} /> 重置记录
                    </button>
                    <button 
                      onClick={() => triggerConfirm("删除奖项", `确定删除奖项 [${p.name}] 吗？`, () => {
                        onUpdate((s: any) => ({ ...s, prizes: s.prizes.filter((x: any) => x.id !== p.id) }));
                        setConfirmState(prev => ({ ...prev, show: false }));
                      })}
                      className="p-2 rounded-xl hover:bg-red-500/10 text-red-500/40 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={() => onUpdate((s: any) => ({ ...s, prizes: [...s.prizes, { id: Date.now().toString(), name: '新奖项', count: 1, color: '#3b82f6', type: 'standard' }] }))} className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-bold opacity-40 hover:opacity-100 hover:bg-white/5 transition-all">+ 新增奖项</button>
            </div>
          </section>

          {/* 系统外观 */}
          <section className="space-y-3">
            <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">外观定制</label>
            <div className="space-y-2">
              <input className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-medium outline-none focus:border-yellow-500/30 transition-all" value={state.appName} onChange={e => onUpdate((s: any) => ({ ...s, appName: e.target.value }))} placeholder="系统主标题" />
              <input className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] font-medium outline-none focus:border-yellow-500/30 transition-all" value={state.appSubName} onChange={e => onUpdate((s: any) => ({ ...s, appSubName: e.target.value }))} placeholder="系统副标题" />
            </div>
          </section>
        </div>

        {/* 底部按钮区 */}
        <div className="p-6 bg-black/40 backdrop-blur-lg border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
             <button onClick={resetAllWinners} className="py-4 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">重置中奖结果</button>
             <button onClick={() => {
                const csv = "\ufeff奖项,姓名\n" + state.winners.map(w => `${w.prizeName},${w.name}`).join('\n');
                const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = '中奖名单.csv'; a.click();
              }} className="py-4 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-400 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">导出结果 (CSV)</button>
          </div>
          <button 
            onClick={() => triggerConfirm(
              "全系统初始化", 
              "此操作将清除所有导入人员、配置奖项、许愿记录和中奖记录，恢复到出厂设置！此操作绝对不可逆，请三思！", 
              () => { localStorage.clear(); window.location.reload(); }
            )} 
            className="w-full py-3 text-[9px] text-gray-600 hover:text-red-500 transition-colors uppercase font-black tracking-[0.2em] border border-white/5 rounded-xl"
          >
            全系统初始化 (彻底清空)
          </button>
        </div>
      </div>

      {/* 二次确认弹窗 */}
      {confirmState.show && (
        <ConfirmDialog 
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={confirmState.action}
          onCancel={() => setConfirmState(prev => ({ ...prev, show: false }))}
          type={confirmState.type}
        />
      )}
    </>
  );
}
