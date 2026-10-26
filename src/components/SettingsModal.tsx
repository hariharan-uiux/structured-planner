import React from 'react';
import { Settings, ColorKey } from '../types';
import { STRUCTURED_COLORS, COLOR_KEYS } from '../utils/colors';
import { sound } from '../utils/audio';
import {
  X,
  Moon,
  Sun,
  Laptop,
  Volume2,
  Sparkles,
  Zap,
  RotateCcw,
  Trash2,
  Info,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onResetDemo: () => void;
  onClearAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDemo,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md max-h-[90vh] flex flex-col rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <h2 className="text-base font-bold text-[#141414] dark:text-white">
            Structured Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Theme Mode */}
          <div>
            <label className="block font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Appearance Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition ${
                  settings.theme === 'light'
                    ? 'border-[#F88E87] bg-[#F88E87]/10 text-[#F88E87] font-bold'
                    : 'border-black/10 dark:border-white/10 text-[#858585]'
                }`}
              >
                <Sun size={18} />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition ${
                  settings.theme === 'dark'
                    ? 'border-[#F88E87] bg-[#F88E87]/10 text-[#F88E87] font-bold'
                    : 'border-black/10 dark:border-white/10 text-[#858585]'
                }`}
              >
                <Moon size={18} />
                <span>Dark</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateSettings({ theme: 'system' })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition ${
                  settings.theme === 'system'
                    ? 'border-[#F88E87] bg-[#F88E87]/10 text-[#F88E87] font-bold'
                    : 'border-black/10 dark:border-white/10 text-[#858585]'
                }`}
              >
                <Laptop size={18} />
                <span>System</span>
              </button>
            </div>
          </div>

          {/* Signature Accent Color */}
          <div>
            <label className="block font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Default App Palette
            </label>
            <div className="grid grid-cols-9 gap-2">
              {COLOR_KEYS.map((key) => {
                const c = STRUCTURED_COLORS[key];
                const isSelected = settings.palette === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onUpdateSettings({ palette: key })}
                    className="aspect-square rounded-full flex items-center justify-center transition hover:scale-110"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {isSelected && (
                      <Check size={14} className="text-white drop-shadow-sm" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Features Toggles */}
          <div>
            <label className="block font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Smart Features
            </label>
            <div className="space-y-2">
              {/* Smart Task Icons */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-[#F88E87]" />
                  <div>
                    <div className="font-semibold text-[#141414] dark:text-white">
                      Smart Task Icons
                    </div>
                    <div className="text-[11px] text-[#858585]">
                      Automatically recommends icons based on task titles
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isSmartTaskIconsEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ isSmartTaskIconsEnabled: e.target.checked })
                  }
                  className="size-4 accent-[#F88E87] rounded cursor-pointer"
                />
              </div>

              {/* Energy Monitor */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <Zap size={16} className="text-[#EAAA00]" />
                  <div>
                    <div className="font-semibold text-[#141414] dark:text-white">
                      Energy Monitor
                    </div>
                    <div className="text-[11px] text-[#858585]">
                      Visualizes recharge vs drain fatigue balance
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.isEnergyMonitorEnabled}
                  onChange={(e) =>
                    onUpdateSettings({ isEnergyMonitorEnabled: e.target.checked })
                  }
                  className="size-4 accent-[#F88E87] rounded cursor-pointer"
                />
              </div>

              {/* Audio feedback */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-2.5">
                  <Volume2 size={16} className="text-[#2F9E66]" />
                  <div>
                    <div className="font-semibold text-[#141414] dark:text-white">
                      Acoustic Haptics
                    </div>
                    <div className="text-[11px] text-[#858585]">
                      Crisp Web Audio chimes when checking off tasks
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => sound.playComplete()}
                    className="text-[10px] text-[#F88E87] font-semibold hover:underline"
                  >
                    Test
                  </button>
                  <input
                    type="checkbox"
                    checked={settings.isSoundEffectEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      sound.enabled = enabled;
                      onUpdateSettings({ isSoundEffectEnabled: enabled });
                    }}
                    className="size-4 accent-[#F88E87] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Controls */}
          <div>
            <label className="block font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Data Management
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset to standard Structured demo schedule?')) {
                    onResetDemo();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-[#858585] font-semibold transition"
              >
                <RotateCcw size={14} />
                <span>Reset Demo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all tasks from local storage?')) {
                    onClearAll();
                    onClose();
                  }
                }}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold transition"
              >
                <Trash2 size={14} />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* About */}
          <div className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-start gap-2.5 text-[#858585]">
            <Info size={16} className="shrink-0 mt-0.5 text-[#F88E87]" />
            <div className="text-[11px] leading-relaxed">
              Structured Web reconstruction based on reverse-engineered architecture of{' '}
              <a
                href="https://structured.app"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[#141414] dark:hover:text-white"
              >
                structured.app
              </a>
              . Runs 100% local-first in your browser with zero latency.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#F8F8F8]/50 dark:bg-[#242424]/50 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#F88E87] text-white font-semibold shadow-sm hover:bg-[#e87a73] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
