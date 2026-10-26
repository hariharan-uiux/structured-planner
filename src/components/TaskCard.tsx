import React, { useState } from 'react';
import { Task } from '../types';
import { STRUCTURED_COLORS } from '../utils/colors';
import { formatHour, formatDuration } from '../utils/time';
import { TaskIcon } from './TaskIcon';
import {
  Check,
  MoreHorizontal,
  Trash2,
  Copy,
  Inbox,
  Calendar,
  ChevronDown,
  ChevronUp,
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onMoveToInbox: (task: Task) => void;
  onScheduleTask: (task: Task) => void;
  use24Hour?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onMoveToInbox,
  onScheduleTask,
  use24Hour = false,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const colorDef = STRUCTURED_COLORS[task.color] || STRUCTURED_COLORS.day;
  const isCompleted = Boolean(task.completedAt);

  const completedSubtasksCount = task.subtasks.filter((st) => st.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      sound.playComplete();
    } else {
      sound.playClick();
    }
    onToggleComplete(task);
  };

  const handleSubtaskToggle = (e: React.MouseEvent, subtaskId: string) => {
    e.stopPropagation();
    sound.playSubtaskCheck();
    onToggleSubtask(task.id, subtaskId);
  };

  // Energy indicator
  const renderEnergyBadge = () => {
    if (task.energyLevel === 'recharge') {
      return (
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(145, 191, 108, 0.18)', color: '#2F9E66' }}
          title="Recharging energy"
        >
          <BatteryCharging size={11} />
          <span>Recharge</span>
        </span>
      );
    }
    if (task.energyLevel === 'drain') {
      return (
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(255, 158, 116, 0.18)', color: '#F27C49' }}
          title="Draining energy"
        >
          <BatteryWarning size={11} />
          <span>Drain</span>
        </span>
      );
    }
    return null;
  };

  return (
    <div
      onClick={() => onEditTask(task)}
      className={`group relative flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer select-none ${
        isCompleted
          ? 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.05] dark:border-white/[0.06] opacity-75'
          : 'bg-white dark:bg-[#242424] border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.14] dark:hover:border-white/[0.18] shadow-apple hover:shadow-apple-hover'
      }`}
    >
      {/* Icon Bubble */}
      <div
        className="size-11 sm:size-12 shrink-0 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
        style={{
          backgroundColor: colorDef.iconBgLight,
          color: colorDef.hex,
        }}
      >
        <TaskIcon symbol={task.symbol} size={22} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center justify-between gap-2">
          {/* Title */}
          <h2
            className={`text-sm sm:text-base font-semibold leading-snug truncate transition ${
              isCompleted
                ? 'line-through text-[#858585] dark:text-[#858585]'
                : 'text-[#141414] dark:text-white'
            }`}
          >
            {task.title}
          </h2>

          {/* Top right badges: Energy & Subtask toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            {renderEnergyBadge()}

            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtasks(!showSubtasks);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#858585] hover:text-[#141414] dark:hover:text-white transition"
              >
                <span>
                  {completedSubtasksCount}/{totalSubtasks}
                </span>
                {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>

        {/* Time or Status info */}
        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#858585]">
          {!task.isInInbox && task.startTime !== null ? (
            <span className="font-medium text-[#141414]/70 dark:text-white/70">
              {formatHour(task.startTime, use24Hour)} • {formatDuration(task.duration)}
            </span>
          ) : task.isAllDay ? (
            <span className="font-medium text-[#858585]">All-day goal</span>
          ) : (
            <span className="font-medium text-[#858585]">In Inbox • {formatDuration(task.duration)}</span>
          )}

          {task.note && (
            <span className="truncate max-w-[200px] sm:max-w-[320px] text-[11px] text-[#858585]/90">
              • {task.note}
            </span>
          )}
        </div>

        {/* Subtasks checklist accordion */}
        {showSubtasks && totalSubtasks > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 pt-2.5 border-t border-black/[0.06] dark:border-white/[0.08] space-y-1.5"
          >
            {task.subtasks.map((st) => (
              <div
                key={st.id}
                onClick={(e) => handleSubtaskToggle(e, st.id)}
                className="flex items-center gap-2.5 py-1 px-1.5 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition text-xs group/sub"
              >
                <div
                  className={`size-4 rounded-md border flex items-center justify-center transition ${
                    st.completed
                      ? 'bg-[#F88E87] border-[#F88E87] text-white'
                      : 'border-[#858585]/40 hover:border-[#F88E87]'
                  }`}
                >
                  {st.completed && <Check size={11} strokeWidth={3} />}
                </div>
                <span
                  className={`flex-1 ${
                    st.completed
                      ? 'line-through text-[#858585]'
                      : 'text-[#141414] dark:text-white'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completion Toggle Button */}
      <div className="flex items-center gap-1 shrink-0 self-center">
        <button
          type="button"
          onClick={handleCheckboxClick}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
          className={`size-7 sm:size-8 rounded-full border-2 flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-[#F88E87] border-[#F88E87] text-white shadow-sm scale-95'
              : 'border-[#858585]/30 hover:border-[#F88E87] hover:scale-105 bg-white dark:bg-[#1C1C1E]'
          }`}
        >
          {isCompleted && <Check size={15} strokeWidth={2.8} />}
        </button>

        {/* More actions button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            aria-label="More actions"
            className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 text-[#858585] transition"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-8 z-50 w-44 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#2C2C2E] shadow-popover p-1 text-xs"
            >
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDuplicateTask(task);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#141414] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <Copy size={13} />
                <span>Duplicate Task</span>
              </button>

              {task.isInInbox ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onScheduleTask(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#141414] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  <Calendar size={13} />
                  <span>Schedule to Today</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onMoveToInbox(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[#141414] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  <Inbox size={13} />
                  <span>Move to Inbox</span>
                </button>
              )}

              <div className="h-px bg-black/[0.06] dark:bg-white/[0.08] my-1" />

              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDeleteTask(task.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
              >
                <Trash2 size={13} />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
