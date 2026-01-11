
import { Prize, Wish, Rant, Participant } from './types';

export const INITIAL_PRIZES: Prize[] = [
  { id: 'p-1', name: '一等奖', count: 1, color: '#facc15', type: 'standard' },
  { id: 'p-2', name: '二等奖', count: 3, color: '#94a3b8', type: 'standard' },
  { id: 'p-3', name: '三等奖', count: 10, color: '#b45309', type: 'standard' },
  { id: 'p-wish', name: '愿望池', count: 10, color: '#06b6d4', type: 'wish' },
  { id: 'p-rant', name: '吐槽池', count: 10, color: '#f43f5e', type: 'rant' },
];

export const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: 'u-1', name: '张小凡' },
  { id: 'u-2', name: '碧瑶' },
  { id: 'u-3', name: '陆雪琪' },
  { id: 'u-4', name: '林惊羽' },
  { id: 'u-5', name: '田灵儿' },
  { id: 'u-6', name: '曾书书' },
  { id: 'u-7', name: '李洵' },
  { id: 'u-8', name: '齐昊' },
  { id: 'u-9', name: '周一仙' },
  { id: 'u-10', name: '小环' },
];

export const DEFAULT_WISHES: Wish[] = [
  { id: 'dw-1', text: '全家旅行一次', color: '#60a5fa' },
  { id: 'dw-2', text: '带薪休假一周', color: '#34d399' },
  { id: 'dw-3', text: '最新款旗舰手机', color: '#f87171' },
  { id: 'dw-4', text: '双人电影套票', color: '#fbbf24' },
  { id: 'dw-5', text: '人体工学椅一把', color: '#a78bfa' },
  { id: 'dw-6', text: '高端降噪耳机', color: '#2dd4bf' },
  { id: 'dw-7', text: '健身房年卡', color: '#fb7185' },
  { id: 'dw-8', text: '五星级酒店自助餐', color: '#818cf8' },
  { id: 'dw-9', text: '周末温泉双人游', color: '#4ade80' },
  { id: 'dw-10', text: '清空购物车(1000元内)', color: '#f472b6' },
];

export const DEFAULT_RANTS: Rant[] = [
  { id: 'dr-1', text: '下午茶可以多点水果吗', timestamp: Date.now() },
  { id: 'dr-2', text: '工位椅子建议升级', timestamp: Date.now() },
  { id: 'dr-3', text: '周报能不能短一点', timestamp: Date.now() },
  { id: 'dr-4', text: '希望公司能提供无限咖啡', timestamp: Date.now() },
  { id: 'dr-5', text: '办公室空调冬天太干了', timestamp: Date.now() },
  { id: 'dr-6', text: '想念楼下的那家麻辣烫', timestamp: Date.now() },
  { id: 'dr-7', text: '建议增加团建活动频率', timestamp: Date.now() },
  { id: 'dr-8', text: '会议室太难订了', timestamp: Date.now() },
  { id: 'dr-9', text: '内网访问速度可以再快点', timestamp: Date.now() },
  { id: 'dr-10', text: '希望能有更多的零食种类', timestamp: Date.now() },
];

export const STORAGE_KEY = 'NEONSPHERE_DRAW_DATA_V5';

export const DEFAULT_APP_NAME = 'NEONSPHERE';
export const DEFAULT_SUB_NAME = '2025 ANNUAL GALA';
