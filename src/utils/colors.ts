import { ColorKey } from '../types';

export interface ColorDefinition {
  key: ColorKey;
  name: string;
  hex: string;
  lightBg: string; // Soft pastel background tint
  darkBg: string; // Dark mode background tint
  iconBgLight: string;
  iconBgDark: string;
  borderLight: string;
  borderDark: string;
}

export const STRUCTURED_COLORS: Record<ColorKey, ColorDefinition> = {
  day: {
    key: 'day',
    name: 'Day (Coral)',
    hex: '#F88E87',
    lightBg: 'rgba(248, 142, 135, 0.12)',
    darkBg: 'rgba(248, 142, 135, 0.20)',
    iconBgLight: 'rgba(248, 142, 135, 0.22)',
    iconBgDark: 'rgba(248, 142, 135, 0.32)',
    borderLight: 'rgba(248, 142, 135, 0.40)',
    borderDark: 'rgba(248, 142, 135, 0.45)',
  },
  dawn: {
    key: 'dawn',
    name: 'Dawn (Peach)',
    hex: '#FF9E74',
    lightBg: 'rgba(255, 158, 116, 0.12)',
    darkBg: 'rgba(255, 158, 116, 0.20)',
    iconBgLight: 'rgba(255, 158, 116, 0.22)',
    iconBgDark: 'rgba(255, 158, 116, 0.32)',
    borderLight: 'rgba(255, 158, 116, 0.40)',
    borderDark: 'rgba(255, 158, 116, 0.45)',
  },
  sunshine: {
    key: 'sunshine',
    name: 'Sunshine (Amber)',
    hex: '#EAAA00',
    lightBg: 'rgba(234, 170, 0, 0.12)',
    darkBg: 'rgba(234, 170, 0, 0.20)',
    iconBgLight: 'rgba(234, 170, 0, 0.22)',
    iconBgDark: 'rgba(234, 170, 0, 0.32)',
    borderLight: 'rgba(234, 170, 0, 0.40)',
    borderDark: 'rgba(234, 170, 0, 0.45)',
  },
  nature: {
    key: 'nature',
    name: 'Nature (Green)',
    hex: '#91BF6C',
    lightBg: 'rgba(145, 191, 108, 0.12)',
    darkBg: 'rgba(145, 191, 108, 0.20)',
    iconBgLight: 'rgba(145, 191, 108, 0.22)',
    iconBgDark: 'rgba(145, 191, 108, 0.32)',
    borderLight: 'rgba(145, 191, 108, 0.40)',
    borderDark: 'rgba(145, 191, 108, 0.45)',
  },
  forest: {
    key: 'forest',
    name: 'Forest (Emerald)',
    hex: '#228564',
    lightBg: 'rgba(34, 133, 100, 0.12)',
    darkBg: 'rgba(34, 133, 100, 0.20)',
    iconBgLight: 'rgba(34, 133, 100, 0.22)',
    iconBgDark: 'rgba(34, 133, 100, 0.32)',
    borderLight: 'rgba(34, 133, 100, 0.40)',
    borderDark: 'rgba(34, 133, 100, 0.45)',
  },
  night: {
    key: 'night',
    name: 'Night (Blue)',
    hex: '#6185A8',
    lightBg: 'rgba(97, 133, 168, 0.12)',
    darkBg: 'rgba(97, 133, 168, 0.20)',
    iconBgLight: 'rgba(97, 133, 168, 0.22)',
    iconBgDark: 'rgba(97, 133, 168, 0.32)',
    borderLight: 'rgba(97, 133, 168, 0.40)',
    borderDark: 'rgba(97, 133, 168, 0.45)',
  },
  twilight: {
    key: 'twilight',
    name: 'Twilight (Plum)',
    hex: '#974767',
    lightBg: 'rgba(151, 71, 103, 0.12)',
    darkBg: 'rgba(151, 71, 103, 0.20)',
    iconBgLight: 'rgba(151, 71, 103, 0.22)',
    iconBgDark: 'rgba(151, 71, 103, 0.32)',
    borderLight: 'rgba(151, 71, 103, 0.40)',
    borderDark: 'rgba(151, 71, 103, 0.45)',
  },
  midnight: {
    key: 'midnight',
    name: 'Midnight (Navy)',
    hex: '#2C5073',
    lightBg: 'rgba(44, 80, 115, 0.12)',
    darkBg: 'rgba(44, 80, 115, 0.20)',
    iconBgLight: 'rgba(44, 80, 115, 0.22)',
    iconBgDark: 'rgba(44, 80, 115, 0.32)',
    borderLight: 'rgba(44, 80, 115, 0.40)',
    borderDark: 'rgba(44, 80, 115, 0.45)',
  },
  classic: {
    key: 'classic',
    name: 'Classic (Monochrome)',
    hex: '#4A4A4A',
    lightBg: 'rgba(0, 0, 0, 0.06)',
    darkBg: 'rgba(255, 255, 255, 0.10)',
    iconBgLight: 'rgba(0, 0, 0, 0.10)',
    iconBgDark: 'rgba(255, 255, 255, 0.18)',
    borderLight: 'rgba(0, 0, 0, 0.15)',
    borderDark: 'rgba(255, 255, 255, 0.20)',
  },
};

export const COLOR_KEYS: ColorKey[] = [
  'day',
  'dawn',
  'sunshine',
  'nature',
  'forest',
  'night',
  'twilight',
  'midnight',
  'classic',
];
