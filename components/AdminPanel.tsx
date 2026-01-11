
import React from 'react';
import { AppState } from '../types';
import { X, Trash2, Download, RefreshCw } from 'lucide-react';

export default function AdminPanel({ state, onUpdate, onClose }: { state: AppState, onUpdate: any, onClose: any }) {
  const handleImport = (txt: string) => {
    const ps = txt.split('\n').filter(l => l.trim()).map(l => {
      const parts = l.split(/\s+/);
      return { id: Math.random().toString(36).substr(2, 9), name: parts[0], department: parts[1] || '默认部门', isWon: false, isRigged: l.includes('*') };
    });
    if (ps.length) onUpdate((s: any) => ({ ...s, participants: [...s.participants, ...ps] }));
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-sm z-[120] glass border-l border-white/10 flex flex-col animate-in slide-in-from-right">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
        <h2 className="text-lg font-black font-orbitron tracking-tight">ADMIN</h2>
        <button onClick={onClose}><X size={20}/></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        <section className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">导入人员 (姓名 部门)</label>
            <span className="text-[9px] text-gray-500 font-bold">总计: {state.participants.length}</span>
          </div>
          <textarea className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-[10px] font-mono outline-none focus:border-cyan-500 transition-all" placeholder="张三 技术部&#10;李四* 销售部 (带*必中)" onBlur={e => { handleImport(e.target.value); e.target.value = ''; }} />
          <button onClick={() => onUpdate((s: any) => ({ ...s, participants: [] }))} className="text-[9px] text-red-500 font-black uppercase tracking-widest hover:underline">清空所有人员名单</button>
        </section>

        <section className="space-y-4">
          <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">奖项配置</label>
          <div className="space-y-2">
            {state.prizes.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 glass rounded-xl border-white/5 text-[11px] font-bold">
                <span>{p.name}</span>
                <div className="flex items-center gap-3">
                  <input type="number" className="w-8 bg-transparent text-center focus:text-cyan-400 outline-none" value={p.count} onChange={e => onUpdate((s: any) => ({ ...s, prizes: s.prizes.map((x: any) => x.id === p.id ? { ...x, count: parseInt(e.target.value) || 1 } : x) }))} />
                  <button onClick={() => onUpdate((s: any) => ({ ...s, prizes: s.prizes.filter((x: any) => x.id !== p.id) }))}><Trash2 size={12} className="text-red-500/60 hover:text-red-500" /></button>
                </div>
              </div>
            ))}
            <button onClick={() => onUpdate((s: any) => ({ ...s, prizes: [...s.prizes, { id: Date.now().toString(), name: '新奖项', count: 1, color: '#3b82f6', type: 'standard' }] }))} className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] opacity-40 hover:opacity-100 transition-all">+ 新增奖项</button>
          </div>
        </section>

        <section className="space-y-3">
          <label className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">系统定制</label>
          <input className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] outline-none mb-2" value={state.appName} onChange={e => onUpdate((s: any) => ({ ...s, appName: e.target.value }))} placeholder="系统主标题" />
          <input className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-[11px] outline-none" value={state.appSubName} onChange={e => onUpdate((s: any) => ({ ...s, appSubName: e.target.value }))} placeholder="系统副标题" />
        </section>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5 space-y-2">
        <button onClick={() => {
          const csv = "\ufeff奖项,姓名\n" + state.winners.map(w => `${w.prizeName},${w.name}`).join('\n');
          const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = '中奖名单.csv'; a.click();
        }} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all">导出结果 (CSV)</button>
        <button onClick={() => window.confirm("确定清除所有数据重新开始？") && (localStorage.clear(), window.location.reload())} className="w-full py-2 text-[9px] text-gray-600 hover:text-red-400 transition-colors uppercase font-bold">重置系统</button>
      </div>
    </div>
  );
}
