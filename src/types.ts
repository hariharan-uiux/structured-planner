export type ColorKey =
  | 'day'
  | 'dawn'
  | 'sunshine'
  | 'nature'
  | 'forest'
  | 'night'
  | 'twilight'
  | 'midnight'
  | 'classic';

export type EnergyLevel = 'recharge' | 'neutral' | 'drain';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  symbol: string;
  color: ColorKey;
  day: string | null; // "YYYY-MM-DD" or null if in inbox
  startTime: number | null; // Hours from 0 to 24 (e.g., 9.5 for 09:30)
  duration: number; // in minutes (e.g., 30, 45, 60)
  isAllDay: boolean;
  isInInbox: boolean;
  completedAt: string | null; // ISO string when completed
  note?: string;
  subtasks: Subtask[];
  energyLevel: EnergyLevel;
  orderIndex?: number;
  createdAt: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  palette: ColorKey;
  isSmartTaskIconsEnabled: boolean;
  isEnergyMonitorEnabled: boolean;
  isSoundEffectEnabled: boolean;
  firstWeekday: number; // 0 for Sun, 1 for Mon
  wakeUpTime: number; // default hour e.g. 8
  bedTime: number; // default hour e.g. 23
}
