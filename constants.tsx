
import { Prize, Wish, Rant, Participant } from './types';

export const INITIAL_PRIZES: Prize[] = [
  { id: 'p-1', name: '一等奖', count: 1, color: '#facc15', type: 'standard' },
  { id: 'p-2', name: '二等奖', count: 3, color: '#94a3b8', type: 'standard' },
  { id: 'p-3', name: '三等奖', count: 10, color: '#b45309', type: 'standard' },
  { id: 'p-wish', name: '愿望池', count: 99, color: '#06b6d4', type: 'wish' },
  { id: 'p-rant', name: '吐槽池', count: 99, color: '#f43f5e', type: 'rant' },
];

export const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: 'u-1', name: '张小凡' },
  { id: 'u-2', name: '碧瑶' },
  { id: 'u-3', name: '陆雪琪' },
  { id: 'u-4', name: '林惊羽' },
  { id: 'u-5', name: '田灵儿' },
  { id: 'u-6', name: '曾书书' },
  { id: 'u-7', name: '风回峰' },
  { id: 'u-8', name: '齐昊' },
];

export const DEFAULT_WISHES: Wish[] = [
  { id: 'dw-1', text: '全家旅行一次', color: '#60a5fa' },
  { id: 'dw-2', text: '带薪休假一周', color: '#34d399' },
  { id: 'dw-3', text: '最新款旗舰手机', color: '#f87171' },
];

export const DEFAULT_RANTS: Rant[] = [
  { id: 'dr-1', text: '下午茶可以多点水果吗', timestamp: Date.now() },
  { id: 'dr-2', text: '工位椅子建议升级', timestamp: Date.now() },
];

export const STORAGE_KEY = 'NEONSPHERE_DRAW_DATA_V4';

export const DEFAULT_APP_NAME = 'NEONSPHERE';
export const DEFAULT_SUB_NAME = '2025 ANNUAL GALA';
