import { Task, Settings, ColorKey } from '../types';

const TASKS_STORAGE_KEY = 'structured_web_tasks';
const SETTINGS_STORAGE_KEY = 'structured_web_settings';

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  palette: 'day',
  isSmartTaskIconsEnabled: true,
  isEnergyMonitorEnabled: true,
  isSoundEffectEnabled: true,
  firstWeekday: 1, // Monday
  wakeUpTime: 7.5,
  bedTime: 23,
};

export function getTodayDateString(offsetDays: number = 0): string {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateInitialTasks(): Task[] {
  const today = getTodayDateString(0);

  return [
    // All-day tasks
    {
      id: 'task-allday-1',
      title: 'Drink 2.5L Water',
      symbol: 'glass-water',
      color: 'night',
      day: today,
      startTime: null,
      duration: 0,
      isAllDay: true,
      isInInbox: false,
      completedAt: null,
      note: 'Stay energized throughout the design sprints.',
      subtasks: [
        { id: 'sub-1', title: 'Morning 500ml', completed: true },
        { id: 'sub-2', title: 'Midday 1L', completed: false },
        { id: 'sub-3', title: 'Evening 1L', completed: false },
      ],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-allday-2',
      title: 'Review Sprint Deliverables',
      symbol: 'briefcase',
      color: 'twilight',
      day: today,
      startTime: null,
      duration: 0,
      isAllDay: true,
      isInInbox: false,
      completedAt: null,
      note: 'Cross-check roadmap requirements before deployment.',
      subtasks: [],
      energyLevel: 'neutral',
      createdAt: new Date().toISOString(),
    },

    // Scheduled timeline tasks
    {
      id: 'task-1',
      title: 'Rise & Morning Routine',
      symbol: 'sun',
      color: 'dawn',
      day: today,
      startTime: 7.5, // 07:30
      duration: 30,
      isAllDay: false,
      isInInbox: false,
      completedAt: new Date(Date.now() - 3600000 * 3).toISOString(), // Completed earlier
      note: 'Light sunlight exposure, hydration, and mindful breathing.',
      subtasks: [
        { id: 'st-1-1', title: 'Open blinds for sunlight', completed: true },
        { id: 'st-1-2', title: '5-minute full body stretch', completed: true },
      ],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Brew Fresh Pour-Over Coffee',
      symbol: 'coffee',
      color: 'day',
      day: today,
      startTime: 8.0, // 08:00
      duration: 30,
      isAllDay: false,
      isInInbox: false,
      completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      note: 'Ethiopian single origin roast with whole milk.',
      subtasks: [],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'Deep Work: Reverse Engineering Web App',
      symbol: 'code',
      color: 'midnight',
      day: today,
      startTime: 9.0, // 09:00
      duration: 90,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Implement pixel-perfect Structured timeline, Smart Task Icons, and Web Audio.',
      subtasks: [
        { id: 'st-3-1', title: 'Decompile bundle structures', completed: true },
        { id: 'st-3-2', title: 'Extract 9-color Structured palette', completed: true },
        { id: 'st-3-3', title: 'Craft interactive timeline view', completed: false },
        { id: 'st-3-4', title: 'Hook Web Audio feedback', completed: false },
      ],
      energyLevel: 'drain',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-4',
      title: 'Design Team Standup & Sync',
      symbol: 'video',
      color: 'forest',
      day: today,
      startTime: 11.0, // 11:00
      duration: 30,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Demo progress, unblock pipeline dependencies, and review tokens.',
      subtasks: [],
      energyLevel: 'drain',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-5',
      title: 'Healthy Lunch & Neighborhood Walk',
      symbol: 'footprints',
      color: 'nature',
      day: today,
      startTime: 12.0, // 12:00
      duration: 60,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Get fresh air outside to reset mental fatigue.',
      subtasks: [],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-6',
      title: 'Figma UI Architecture & Tokens',
      symbol: 'palette',
      color: 'day',
      day: today,
      startTime: 13.5, // 13:30
      duration: 90,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Update variables and spacing scales across design system components.',
      subtasks: [
        { id: 'st-6-1', title: 'Review squircle border-radii', completed: false },
        { id: 'st-6-2', title: 'Audit light/dark elevation tokens', completed: false },
      ],
      energyLevel: 'neutral',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-7',
      title: 'Fitness & Kettlebell Workout',
      symbol: 'dumbbell',
      color: 'sunshine',
      day: today,
      startTime: 16.0, // 16:00
      duration: 60,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Upper body hypertrophy and 15 mins zone 2 cardio.',
      subtasks: [
        { id: 'st-7-1', title: 'Dynamic warmup', completed: false },
        { id: 'st-7-2', title: 'Clean and press sets', completed: false },
        { id: 'st-7-3', title: 'Cool down & foam roll', completed: false },
      ],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-8',
      title: 'Evening Wind-Down & Reading',
      symbol: 'book',
      color: 'twilight',
      day: today,
      startTime: 20.5, // 20:30
      duration: 45,
      isAllDay: false,
      isInInbox: false,
      completedAt: null,
      note: 'Read 25 pages of cognitive design architecture.',
      subtasks: [],
      energyLevel: 'recharge',
      createdAt: new Date().toISOString(),
    },

    // Inbox tasks (unassigned / pool)
    {
      id: 'task-inbox-1',
      title: 'Book Flights to San Francisco',
      symbol: 'plane',
      color: 'twilight',
      day: null,
      startTime: null,
      duration: 45,
      isAllDay: false,
      isInInbox: true,
      completedAt: null,
      note: 'Compare morning direct flights for Next.js Conf.',
      subtasks: [],
      energyLevel: 'drain',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-inbox-2',
      title: 'Order Nordic Desk Mat & Cable Clips',
      symbol: 'shopping-cart',
      color: 'sunshine',
      day: null,
      startTime: null,
      duration: 20,
      isAllDay: false,
      isInInbox: true,
      completedAt: null,
      note: 'Clean up minimal workstation setup.',
      subtasks: [],
      energyLevel: 'neutral',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task-inbox-3',
      title: 'Call Accountant regarding VAT return',
      symbol: 'phone',
      color: 'dawn',
      day: null,
      startTime: null,
      duration: 15,
      isAllDay: false,
      isInInbox: true,
      completedAt: null,
      note: 'Check quarterly filing receipts.',
      subtasks: [],
      energyLevel: 'drain',
      createdAt: new Date().toISOString(),
    },
  ];
}

export function getStoredTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!data) {
      const initial = generateInitialTasks();
      saveStoredTasks(initial);
      return initial;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return generateInitialTasks();
  }
}

export function saveStoredTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

export function getStoredSettings(): Settings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}
