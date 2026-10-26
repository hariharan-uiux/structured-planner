import React, { useState, useEffect } from 'react';
import { Task, ColorKey, EnergyLevel, Subtask } from '../types';
import { STRUCTURED_COLORS, COLOR_KEYS } from '../utils/colors';
import { AVAILABLE_SYMBOLS, getSmartSuggestion } from '../utils/smartIcons';
import { formatHour, formatDuration } from '../utils/time';
import { TaskIcon } from './TaskIcon';
import { sound } from '../utils/audio';
import {
  X,
  Sparkles,
  Clock,
  Calendar,
  Inbox,
  Check,
  Plus,
  Trash2,
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  ListTodo,
  FileText,
} from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  initialTask?: Task | null;
  defaultDate: string;
  defaultStartTime?: number;
  defaultDuration?: number;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialTask,
  defaultDate,
  defaultStartTime = 9,
  defaultDuration = 30,
}) => {
  const [title, setTitle] = useState('');
  const [symbol, setSymbol] = useState('coffee');
  const [color, setColor] = useState<ColorKey>('day');
  const [day, setDay] = useState(defaultDate);
  const [startTime, setStartTime] = useState<number>(defaultStartTime);
  const [duration, setDuration] = useState<number>(defaultDuration);
  const [isAllDay, setIsAllDay] = useState(false);
  const [isInInbox, setIsInInbox] = useState(false);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('neutral');
  const [note, setNote] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  // Auto smart suggestion chip
  const smartSuggestion = getSmartSuggestion(title);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSymbol(initialTask.symbol);
      setColor(initialTask.color);
      setDay(initialTask.day || defaultDate);
      setStartTime(initialTask.startTime ?? defaultStartTime);
      setDuration(initialTask.duration || defaultDuration);
      setIsAllDay(initialTask.isAllDay);
      setIsInInbox(initialTask.isInInbox);
      setEnergyLevel(initialTask.energyLevel);
      setNote(initialTask.note || '');
      setSubtasks(initialTask.subtasks || []);
    } else {
      // Reset for new task
      setTitle('');
      setSymbol('coffee');
      setColor('day');
      setDay(defaultDate);
      setStartTime(defaultStartTime);
      setDuration(defaultDuration);
      setIsAllDay(false);
      setIsInInbox(false);
      setEnergyLevel('neutral');
      setNote('');
      setSubtasks([]);
    }
  }, [initialTask, isOpen, defaultDate, defaultStartTime, defaultDuration]);

  if (!isOpen) return null;

  const handleApplySmartSuggestion = () => {
    if (!smartSuggestion) return;
    setSymbol(smartSuggestion.symbol);
    setColor(smartSuggestion.color);
    if (smartSuggestion.suggestedDuration) {
      setDuration(smartSuggestion.suggestedDuration);
    }
    sound.playCreate();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSt: Subtask = {
      id: `st-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSt]);
    setNewSubtaskTitle('');
    sound.playSubtaskCheck();
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskToSave: Task = {
      id: initialTask?.id || `task-${Date.now()}`,
      title: title.trim(),
      symbol,
      color,
      day: isInInbox ? null : day,
      startTime: isInInbox || isAllDay ? null : startTime,
      duration: isAllDay ? 0 : duration,
      isAllDay,
      isInInbox,
      completedAt: initialTask?.completedAt || null,
      note: note.trim() || undefined,
      subtasks,
      energyLevel,
      createdAt: initialTask?.createdAt || new Date().toISOString(),
    };

    sound.playCreate();
    onSave(taskToSave);
    onClose();
  };

  const currentColorDef = STRUCTURED_COLORS[color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="size-11 rounded-2xl flex items-center justify-center transition hover:scale-105 active:scale-95 shadow-sm"
              style={{
                backgroundColor: currentColorDef.iconBgLight,
                color: currentColorDef.hex,
              }}
              title="Change icon"
            >
              <TaskIcon symbol={symbol} size={22} />
            </button>
            <div>
              <h2 className="text-base font-bold text-[#141414] dark:text-white">
                {initialTask ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-xs text-[#858585]">
                {isInInbox ? 'Backlog item' : isAllDay ? 'All-day goal' : 'Timeline event'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Task Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Morning Coffee, Team Sync, Gym"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-base font-semibold text-[#141414] dark:text-white placeholder-[#858585] focus:outline-none focus:border-[#F88E87] transition"
            />

            {/* Smart Task Icon Suggestion Chip */}
            {smartSuggestion && (
              <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-[#F88E87]/10 border border-[#F88E87]/20 text-xs">
                <div className="flex items-center gap-2 text-[#141414] dark:text-white font-medium">
                  <Sparkles size={14} className="text-[#F88E87]" />
                  <span>Smart Match:</span>
                  <div
                    className="size-6 rounded-md flex items-center justify-center"
                    style={{
                      backgroundColor: STRUCTURED_COLORS[smartSuggestion.color].iconBgLight,
                      color: STRUCTURED_COLORS[smartSuggestion.color].hex,
                    }}
                  >
                    <TaskIcon symbol={smartSuggestion.symbol} size={13} />
                  </div>
                  <span className="capitalize">{smartSuggestion.symbol}</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplySmartSuggestion}
                  className="px-2.5 py-1 rounded-full bg-[#F88E87] text-white text-[11px] font-semibold hover:bg-[#e87a73] transition"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Icon Picker Popover */}
          {showIconPicker && (
            <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F8F8F8] dark:bg-[#242424] space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#858585]">
                <span>Choose Icon</span>
                <button
                  type="button"
                  onClick={() => setShowIconPicker(false)}
                  className="text-xs hover:text-[#141414] dark:hover:text-white"
                >
                  Done
                </button>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-40 overflow-y-auto pr-1">
                {AVAILABLE_SYMBOLS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSymbol(s.id);
                      sound.playClick();
                    }}
                    className={`size-10 rounded-xl flex items-center justify-center transition ${
                      symbol === s.id
                        ? 'bg-[#F88E87] text-white shadow-sm scale-105'
                        : 'bg-white dark:bg-[#1C1C1E] text-[#858585] hover:text-[#141414] dark:hover:text-white hover:bg-black/5'
                    }`}
                    title={s.label}
                  >
                    <TaskIcon symbol={s.id} size={18} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Palette (Structured 9 Colors) */}
          <div>
            <label className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-9 gap-2">
              {COLOR_KEYS.map((key) => {
                const c = STRUCTURED_COLORS[key];
                const isSelected = color === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setColor(key);
                      sound.playClick();
                    }}
                    className="relative aspect-square rounded-full transition transform hover:scale-110 active:scale-95 flex items-center justify-center"
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

          {/* Scheduling Toggles: All-Day & Inbox */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAllDay(!isAllDay);
                if (!isAllDay) setIsInInbox(false);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition ${
                isAllDay
                  ? 'border-[#F88E87] bg-[#F88E87]/10 text-[#F88E87]'
                  : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-[#858585]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>All-Day Goal</span>
              </div>
              <div
                className={`size-4 rounded-full border flex items-center justify-center ${
                  isAllDay ? 'bg-[#F88E87] border-[#F88E87] text-white' : 'border-gray-400'
                }`}
              >
                {isAllDay && <Check size={10} strokeWidth={3} />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsInInbox(!isInInbox);
                if (!isInInbox) setIsAllDay(false);
              }}
              className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition ${
                isInInbox
                  ? 'border-[#F88E87] bg-[#F88E87]/10 text-[#F88E87]'
                  : 'border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-[#858585]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox size={14} />
                <span>Inbox Pool</span>
              </div>
              <div
                className={`size-4 rounded-full border flex items-center justify-center ${
                  isInInbox ? 'bg-[#F88E87] border-[#F88E87] text-white' : 'border-gray-400'
                }`}
              >
                {isInInbox && <Check size={10} strokeWidth={3} />}
              </div>
            </button>
          </div>

          {/* Time & Duration Selectors (if not all day and not inbox) */}
          {!isAllDay && !isInInbox && (
            <div className="space-y-4 p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/10 dark:border-white/10">
              {/* Start Time Slider / Picker */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#858585] uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} />
                    Start Time
                  </span>
                  <span className="font-bold text-sm text-[#141414] dark:text-white tabular-nums">
                    {formatHour(startTime)}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="23.75"
                  step="0.25" // 15 minute steps
                  value={startTime}
                  onChange={(e) => setStartTime(parseFloat(e.target.value))}
                  className="w-full accent-[#F88E87] cursor-pointer"
                />
              </div>

              {/* Duration Presets */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#858585] uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="font-bold text-sm text-[#141414] dark:text-white">
                    {formatDuration(duration)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[15, 30, 45, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDuration(mins)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        duration === mins
                          ? 'bg-[#F88E87] text-white shadow-sm'
                          : 'bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white'
                      }`}
                    >
                      {formatDuration(mins)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Energy Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-2">
              Energy Demand
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEnergyLevel('recharge')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition ${
                  energyLevel === 'recharge'
                    ? 'border-[#2F9E66] bg-[#2F9E66]/15 text-[#2F9E66]'
                    : 'border-black/10 dark:border-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white'
                }`}
              >
                <BatteryCharging size={14} />
                <span>Recharge</span>
              </button>

              <button
                type="button"
                onClick={() => setEnergyLevel('neutral')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition ${
                  energyLevel === 'neutral'
                    ? 'border-[#EAAA00] bg-[#EAAA00]/15 text-[#EAAA00]'
                    : 'border-black/10 dark:border-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white'
                }`}
              >
                <BatteryMedium size={14} />
                <span>Neutral</span>
              </button>

              <button
                type="button"
                onClick={() => setEnergyLevel('drain')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border text-xs font-semibold transition ${
                  energyLevel === 'drain'
                    ? 'border-[#F27C49] bg-[#F27C49]/15 text-[#F27C49]'
                    : 'border-black/10 dark:border-white/10 text-[#858585] hover:text-[#141414] dark:hover:text-white'
                }`}
              >
                <BatteryWarning size={14} />
                <span>Drain</span>
              </button>
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#858585] uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo size={13} />
                Subtasks ({subtasks.length})
              </label>
            </div>

            {/* Subtask items */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 text-xs"
                  >
                    <span className="text-[#141414] dark:text-white truncate">
                      {st.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="p-1 rounded-md text-[#858585] hover:text-red-500 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add subtask step..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-xs text-[#141414] dark:text-white placeholder-[#858585] focus:outline-none focus:border-[#F88E87]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#F88E87] hover:text-white text-xs font-semibold text-[#858585] transition"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={13} />
              Notes & Links
            </label>
            <textarea
              rows={2}
              placeholder="Add optional notes, agenda items, or links..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-xs text-[#141414] dark:text-white placeholder-[#858585] focus:outline-none focus:border-[#F88E87] transition resize-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.08] bg-[#F8F8F8]/50 dark:bg-[#242424]/50">
          {initialTask && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(initialTask.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#858585] hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-5 py-2 rounded-full bg-[#F88E87] hover:bg-[#e87a73] disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
