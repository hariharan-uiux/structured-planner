import React from 'react';
import {
  Coffee,
  Sun,
  Moon,
  Sparkles,
  Utensils,
  GlassWater,
  ShoppingCart,
  Laptop,
  Code,
  Briefcase,
  Video,
  Phone,
  Mail,
  Pencil,
  Palette,
  Book,
  Dumbbell,
  Flame,
  Heart,
  Footprints,
  Bike,
  Apple,
  Music,
  Gamepad2,
  Tv,
  Car,
  Plane,
  Gift,
  CheckCircle2,
  Circle,
  Clock,
  Check,
  Calendar,
  Layers,
  LucideIcon,
} from 'lucide-react';

interface TaskIconProps {
  symbol: string;
  className?: string;
  size?: number;
}

const ICON_MAP: Record<string, LucideIcon> = {
  coffee: Coffee,
  sun: Sun,
  moon: Moon,
  sparkles: Sparkles,
  utensils: Utensils,
  'glass-water': GlassWater,
  'shopping-cart': ShoppingCart,
  laptop: Laptop,
  code: Code,
  briefcase: Briefcase,
  video: Video,
  phone: Phone,
  mail: Mail,
  pencil: Pencil,
  palette: Palette,
  book: Book,
  dumbbell: Dumbbell,
  flame: Flame,
  heart: Heart,
  footprints: Footprints,
  bike: Bike,
  apple: Apple,
  music: Music,
  'gamepad-2': Gamepad2,
  tv: Tv,
  car: Car,
  plane: Plane,
  gift: Gift,
  calendar: Calendar,
  layers: Layers,
  clock: Clock,
  check: Check,
  'check-circle': CheckCircle2,
  circle: Circle,
};

export const TaskIcon: React.FC<TaskIconProps> = ({ symbol, className = '', size = 20 }) => {
  const IconComponent = ICON_MAP[symbol.toLowerCase()] || CheckCircle2;
  return <IconComponent size={size} className={className} />;
};
