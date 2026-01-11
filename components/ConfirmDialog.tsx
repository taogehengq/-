
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "确认执行", 
  cancelText = "取消",
  type = 'danger'
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass w-full max-w-sm rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-8 space-y-6 text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2 ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black tracking-tight text-white">{title}</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">{message}</p>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button 
              onClick={onConfirm}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 ${type === 'danger' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'}`}
            >
              {confirmText}
            </button>
            <button 
              onClick={onCancel}
              className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
