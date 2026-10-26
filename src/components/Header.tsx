import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Inbox,
  CalendarDays,
  Zap,
} from 'lucide-react';
import { Settings } from '../types';

interface HeaderProps {
  currentDate: string; // "YYYY-MM-DD"
  onDateChange: (newDate: string) => void;
  activeView: 'timeline' | 'inbox' | 'energy';
  onViewChange: (view: 'timeline' | 'inbox' | 'energy') => void;
  inboxCount: number;
  onOpenNewTaskModal: () => void;
  onOpenSettingsModal: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  activeView,
  onViewChange,
  inboxCount,
  onOpenNewTaskModal,
  onOpenSettingsModal,
  isDark,
  onToggleTheme,
}) => {
  // Format current date nicely e.g. "Today, Oct 26" or "Tue, Oct 27"
  const parseDate = new Date(currentDate + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday = parseDate.getTime() === today.getTime();

  const formattedDate = parseDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handlePrevDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleGoToday = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-2xl bg-[#F88E87] flex items-center justify-center shadow-sm text-white font-bold text-lg select-none">
            <span className="scale-110">✦</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-bold text-[#141414] dark:text-white leading-tight tracking-tight">
              Structured
            </h1>
            <p className="text-[11px] font-medium text-[#858585]">Visual Day Planner</p>
          </div>
        </div>

        {/* Center: Date Navigation (if on timeline view) or View Heading */}
        {activeView === 'timeline' ? (
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handlePrevDay}
              aria-label="Previous day"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={handleGoToday}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-sm font-semibold transition text-[#141414] dark:text-white"
            >
              <span>{isToday ? `Today, ${formattedDate.split(', ')[1]}` : formattedDate}</span>
              {isToday && (
                <span className="size-2 rounded-full bg-[#F88E87] inline-block animate-pulse" />
              )}
            </button>

            <button
              onClick={handleNextDay}
              aria-label="Next day"
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ) : (
          <div className="text-sm font-semibold text-[#141414] dark:text-white">
            {activeView === 'inbox' ? 'Unscheduled Inbox' : 'Daily Energy Monitor'}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* View Segmented Switcher */}
          <div className="hidden md:flex items-center bg-[#F2F2F5] dark:bg-[#2C2C2E] p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => onViewChange('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                activeView === 'timeline'
                  ? 'bg-white dark:bg-[#1C1C1E] text-[#141414] dark:text-white shadow-sm'
                  : 'text-[#858585] hover:text-[#141414] dark:hover:text-white'
              }`}
            >
              <CalendarDays size={13} />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => onViewChange('inbox')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition relative ${
                activeView === 'inbox'
                  ? 'bg-white dark:bg-[#1C1C1E] text-[#141414] dark:text-white shadow-sm'
                  : 'text-[#858585] hover:text-[#141414] dark:hover:text-white'
              }`}
            >
              <Inbox size={13} />
              <span>Inbox</span>
              {inboxCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-[#F88E87] text-white">
                  {inboxCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('energy')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition ${
                activeView === 'energy'
                  ? 'bg-white dark:bg-[#1C1C1E] text-[#141414] dark:text-white shadow-sm'
                  : 'text-[#858585] hover:text-[#141414] dark:hover:text-white'
              }`}
            >
              <Zap size={13} />
              <span>Energy</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettingsModal}
            aria-label="Settings"
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white transition"
          >
            <SettingsIcon size={18} />
          </button>

          {/* New Task Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#F88E87] hover:bg-[#e87a73] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab bar at sub-header if on small screen */}
      <div className="flex md:hidden border-t border-black/[0.04] dark:border-white/[0.04] px-4 py-1.5 justify-around bg-[#F8F8F8]/60 dark:bg-[#242424]/60">
        <button
          onClick={() => onViewChange('timeline')}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
            activeView === 'timeline'
              ? 'bg-[#F88E87] text-white'
              : 'text-[#858585] dark:text-white/70'
          }`}
        >
          <CalendarDays size={13} />
          <span>Timeline</span>
        </button>
        <button
          onClick={() => onViewChange('inbox')}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full relative ${
            activeView === 'inbox'
              ? 'bg-[#F88E87] text-white'
              : 'text-[#858585] dark:text-white/70'
          }`}
        >
          <Inbox size={13} />
          <span>Inbox ({inboxCount})</span>
        </button>
        <button
          onClick={() => onViewChange('energy')}
          className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${
            activeView === 'energy'
              ? 'bg-[#F88E87] text-white'
              : 'text-[#858585] dark:text-white/70'
          }`}
        >
          <Zap size={13} />
          <span>Energy</span>
        </button>
      </div>
    </header>
  );
};
