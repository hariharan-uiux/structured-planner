import { ColorKey } from '../types';

export interface SmartSuggestion {
  symbol: string;
  color: ColorKey;
  suggestedDuration?: number;
}

interface KeywordRule {
  keywords: string[];
  symbol: string;
  color: ColorKey;
  duration?: number;
}

const SMART_RULES: KeywordRule[] = [
  // Morning / Routine
  {
    keywords: ['coffee', 'espresso', 'cappuccino', 'latte', 'tea', 'cafe', 'brew'],
    symbol: 'coffee',
    color: 'day',
    duration: 20,
  },
  {
    keywords: ['wake up', 'rise', 'morning', 'alarm', 'get up', 'stretch'],
    symbol: 'sun',
    color: 'dawn',
    duration: 15,
  },
  {
    keywords: ['shower', 'bath', 'wash', 'grooming', 'shave', 'skincare', 'brush teeth'],
    symbol: 'sparkles',
    color: 'night',
    duration: 25,
  },
  {
    keywords: ['breakfast', 'cereal', 'toast', 'oatmeal', 'pancake', 'smoothie'],
    symbol: 'utensils',
    color: 'sunshine',
    duration: 30,
  },

  // Work & Productivity
  {
    keywords: ['code', 'coding', 'program', 'developer', 'react', 'frontend', 'backend', 'bug', 'github', 'commit', 'pr review'],
    symbol: 'code',
    color: 'midnight',
    duration: 90,
  },
  {
    keywords: ['work', 'deep work', 'focus', 'task', 'project', 'sprint', 'deliverable'],
    symbol: 'laptop',
    color: 'twilight',
    duration: 60,
  },
  {
    keywords: ['meeting', 'sync', 'standup', 'call', 'zoom', 'google meet', 'catch up', 'interview'],
    symbol: 'video',
    color: 'forest',
    duration: 30,
  },
  {
    keywords: ['email', 'inbox', 'slack', 'message', 'reply', 'correspondence'],
    symbol: 'mail',
    color: 'night',
    duration: 30,
  },
  {
    keywords: ['design', 'figma', 'ui', 'ux', 'wireframe', 'prototype', 'sketch'],
    symbol: 'palette',
    color: 'day',
    duration: 60,
  },
  {
    keywords: ['write', 'article', 'essay', 'documentation', 'blog', 'notes'],
    symbol: 'pencil',
    color: 'twilight',
    duration: 45,
  },

  // Health, Fitness & Wellness
  {
    keywords: ['gym', 'workout', 'weights', 'lifting', 'exercise', 'training', 'fitness', 'crossfit'],
    symbol: 'dumbbell',
    color: 'sunshine',
    duration: 60,
  },
  {
    keywords: ['run', 'jog', 'running', 'sprint', 'treadmill', 'marathon'],
    symbol: 'flame',
    color: 'dawn',
    duration: 40,
  },
  {
    keywords: ['yoga', 'meditate', 'meditation', 'mindfulness', 'breath', 'pilates'],
    symbol: 'heart',
    color: 'nature',
    duration: 30,
  },
  {
    keywords: ['walk', 'stroll', 'fresh air', 'hike', 'hiking', 'nature walk'],
    symbol: 'footprints',
    color: 'nature',
    duration: 45,
  },
  {
    keywords: ['bike', 'cycling', 'bicycle', 'ride'],
    symbol: 'bike',
    color: 'forest',
    duration: 45,
  },

  // Food & Social
  {
    keywords: ['lunch', 'meal', 'lunch break'],
    symbol: 'utensils',
    color: 'sunshine',
    duration: 45,
  },
  {
    keywords: ['dinner', 'cooking', 'cook', 'supper', 'restaurant', 'dine'],
    symbol: 'utensils',
    color: 'dawn',
    duration: 60,
  },
  {
    keywords: ['groceries', 'supermarket', 'market', 'shopping', 'buy groceries', 'errands'],
    symbol: 'shopping-cart',
    color: 'sunshine',
    duration: 45,
  },
  {
    keywords: ['drink', 'beer', 'wine', 'cocktail', 'party', 'hangout', 'friends'],
    symbol: 'glass-water',
    color: 'twilight',
    duration: 90,
  },
  {
    keywords: ['call mom', 'call dad', 'family', 'parents'],
    symbol: 'phone',
    color: 'day',
    duration: 20,
  },

  // Learning & Leisure
  {
    keywords: ['read', 'book', 'reading', 'novel', 'chapter', 'study', 'course', 'learn'],
    symbol: 'book',
    color: 'twilight',
    duration: 45,
  },
  {
    keywords: ['game', 'gaming', 'playstation', 'steam', 'xbox', 'nintendo'],
    symbol: 'gamepad-2',
    color: 'midnight',
    duration: 60,
  },
  {
    keywords: ['movie', 'netflix', 'film', 'cinema', 'watch show', 'tv', 'series'],
    symbol: 'tv',
    color: 'night',
    duration: 90,
  },
  {
    keywords: ['music', 'piano', 'guitar', 'listen to music', 'practice instrument'],
    symbol: 'music',
    color: 'dawn',
    duration: 30,
  },

  // Evening / Rest
  {
    keywords: ['sleep', 'bed', 'rest', 'nap', 'bedtime', 'wind down', 'goodnight'],
    symbol: 'moon',
    color: 'midnight',
    duration: 480,
  },
  {
    keywords: ['clean', 'laundry', 'vacuum', 'dishes', 'tidy', 'chores', 'trash'],
    symbol: 'sparkles',
    color: 'night',
    duration: 30,
  },
];

export function getSmartSuggestion(title: string): SmartSuggestion | null {
  if (!title || title.trim().length === 0) return null;

  const lower = title.toLowerCase();

  for (const rule of SMART_RULES) {
    for (const kw of rule.keywords) {
      // Check word boundary or substring
      if (lower.includes(kw)) {
        return {
          symbol: rule.symbol,
          color: rule.color,
          suggestedDuration: rule.duration,
        };
      }
    }
  }

  return null;
}

// Available curated icons for the icon picker
export const AVAILABLE_SYMBOLS = [
  // Routine & Daily
  { id: 'coffee', label: 'Coffee', category: 'Daily' },
  { id: 'sun', label: 'Morning / Sun', category: 'Daily' },
  { id: 'moon', label: 'Night / Sleep', category: 'Daily' },
  { id: 'sparkles', label: 'Clean / Fresh', category: 'Daily' },
  { id: 'utensils', label: 'Food / Meals', category: 'Daily' },
  { id: 'glass-water', label: 'Hydration / Drinks', category: 'Daily' },
  { id: 'shopping-cart', label: 'Shopping', category: 'Daily' },

  // Work & Productivity
  { id: 'laptop', label: 'Work / Laptop', category: 'Work' },
  { id: 'code', label: 'Coding / Tech', category: 'Work' },
  { id: 'briefcase', label: 'Business', category: 'Work' },
  { id: 'video', label: 'Video Call', category: 'Work' },
  { id: 'phone', label: 'Phone Call', category: 'Work' },
  { id: 'mail', label: 'Email', category: 'Work' },
  { id: 'pencil', label: 'Writing', category: 'Work' },
  { id: 'palette', label: 'Design', category: 'Work' },
  { id: 'book', label: 'Reading / Study', category: 'Work' },

  // Wellness & Health
  { id: 'dumbbell', label: 'Gym / Fitness', category: 'Wellness' },
  { id: 'flame', label: 'Intense Workout', category: 'Wellness' },
  { id: 'heart', label: 'Self-Care / Health', category: 'Wellness' },
  { id: 'footprints', label: 'Walking', category: 'Wellness' },
  { id: 'bike', label: 'Cycling', category: 'Wellness' },
  { id: 'apple', label: 'Healthy Nutrition', category: 'Wellness' },

  // Leisure & Life
  { id: 'music', label: 'Music', category: 'Leisure' },
  { id: 'gamepad-2', label: 'Gaming', category: 'Leisure' },
  { id: 'tv', label: 'Movies / TV', category: 'Leisure' },
  { id: 'car', label: 'Commute / Travel', category: 'Leisure' },
  { id: 'plane', label: 'Flight / Vacation', category: 'Leisure' },
  { id: 'gift', label: 'Celebration', category: 'Leisure' },
];
