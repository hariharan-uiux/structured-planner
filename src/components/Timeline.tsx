import React, { useEffect, useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { AllDaySection } from './AllDaySection';
import {
  findFreeGaps,
  formatHour,
  getCurrentTimeDecimal,
} from '../utils/time';
import { Plus, Clock, Sparkles } from 'lucide-react';

interface TimelineProps {
  tasks: Task[];
  allDayTasks: Task[];
  currentDate: string;
  onToggleComplete: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onMoveToInbox: (task: Task) => void;
  onScheduleTask: (task: Task) => void;
  onQuickAddAtTime: (startHour: number, durationMinutes: number) => void;
  use24Hour?: boolean;
}

export const Timeline: React.FC<TimelineProps> = ({
  tasks,
  allDayTasks,
  currentDate,
  onToggleComplete,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onMoveToInbox,
  onScheduleTask,
  onQuickAddAtTime,
  use24Hour = false,
}) => {
  const [currentTimeDecimal, setCurrentTimeDecimal] = useState<number>(getCurrentTimeDecimal());

  // Update current time indicator every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeDecimal(getCurrentTimeDecimal());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter tasks for scheduled time
  const scheduledTasks = tasks
    .filter((t) => !t.isInInbox && !t.isAllDay && t.startTime !== null)
    .sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0));

  // Calculate day completion progress
  const totalItems = allDayTasks.length + scheduledTasks.length;
  const completedItems =
    allDayTasks.filter((t) => t.completedAt).length +
    scheduledTasks.filter((t) => t.completedAt).length;
  const completionPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Check if today is selected
  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = currentDate === todayStr;

  // Gaps between tasks
  const gaps = findFreeGaps(
    scheduledTasks.map((t) => ({ startTime: t.startTime ?? 8, duration: t.duration })),
    8,
    22
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Day Progress Meter */}
      {totalItems > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-[#F8F8F8] dark:bg-[#242424] border border-black/[0.06] dark:border-white/[0.06]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-[#141414] dark:text-white flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#F88E87]" />
              Day Progress
            </span>
            <span className="text-[#858585]">
              {completedItems} of {totalItems} completed ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.1] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#F88E87] transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Pinned All-Day Goals */}
      <AllDaySection
        tasks={allDayTasks}
        onToggleComplete={onToggleComplete}
        onToggleSubtask={onToggleSubtask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onDuplicateTask={onDuplicateTask}
        onMoveToInbox={onMoveToInbox}
        onScheduleTask={onScheduleTask}
      />

      {/* Main Timeline Section */}
      <div className="relative">
        {scheduledTasks.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-black/10 dark:border-white/10 p-8 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="size-14 mx-auto rounded-full bg-[#F88E87]/15 text-[#F88E87] flex items-center justify-center mb-4">
              <Clock size={28} />
            </div>
            <h3 className="text-base font-bold text-[#141414] dark:text-white mb-1">
              No tasks scheduled for this day
            </h3>
            <p className="text-xs text-[#858585] max-w-xs mx-auto mb-6">
              Plan your day visual style. Add appointments, work blocks, and routines into your timeline.
            </p>
            <button
              onClick={() => onQuickAddAtTime(9, 30)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F88E87] hover:bg-[#e87a73] text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Schedule First Task</span>
            </button>
          </div>
        ) : (
          <div className="relative pl-12 sm:pl-16">
            {/* Continuous Vertical Timeline Spine */}
            <div className="absolute left-5 sm:left-7 top-4 bottom-4 w-[2px] bg-black/[0.08] dark:bg-white/[0.1] rounded-full" />

            {/* Current Time Indicator line (if today) */}
            {isToday && (
              <div
                className="relative my-4 flex items-center z-20 group"
                title={`Current time: ${formatHour(currentTimeDecimal, use24Hour)}`}
              >
                <div className="absolute -left-12 sm:-left-16 flex items-center gap-1 text-[10px] font-bold text-[#F88E87]">
                  <span className="size-2 rounded-full bg-[#F88E87] animate-ping" />
                  <span className="size-2 rounded-full bg-[#F88E87] -ml-3" />
                  <span>{formatHour(currentTimeDecimal, use24Hour)}</span>
                </div>
                <div className="w-full h-0.5 bg-[#F88E87]/60 rounded-full shadow-[0_0_8px_rgba(248,142,135,0.6)]" />
              </div>
            )}

            {/* Render Timeline Elements with Free Gap Indicators */}
            <div className="space-y-4">
              {scheduledTasks.map((task, idx) => {
                const prevTask = idx > 0 ? scheduledTasks[idx - 1] : null;
                const prevEnd = prevTask
                  ? (prevTask.startTime ?? 0) + prevTask.duration / 60
                  : null;
                const currentStart = task.startTime ?? 0;
                const gapMinutes =
                  prevEnd !== null ? Math.round((currentStart - prevEnd) * 60) : 0;

                return (
                  <React.Fragment key={task.id}>
                    {/* Free Gap Indicator */}
                    {prevEnd !== null && gapMinutes >= 15 && (
                      <div className="relative py-2 flex items-center">
                        {/* Time marker on spine */}
                        <div className="absolute -left-12 sm:-left-16 text-[10px] font-semibold text-[#858585]/70 tabular-nums">
                          {formatHour(prevEnd, use24Hour)}
                        </div>

                        {/* Gap Pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-dashed border-black/10 dark:border-white/10 text-[11px] text-[#858585]">
                          <span>{gapMinutes}m free time</span>
                          <button
                            type="button"
                            onClick={() => onQuickAddAtTime(prevEnd, Math.min(gapMinutes, 60))}
                            className="size-5 rounded-full hover:bg-[#F88E87] hover:text-white flex items-center justify-center transition text-[#858585]"
                            title="Add task in this gap"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Task Item */}
                    <div className="relative group">
                      {/* Left time label on spine */}
                      <div className="absolute -left-12 sm:-left-16 top-4 text-xs font-semibold text-[#858585] tabular-nums">
                        {formatHour(task.startTime ?? 0, use24Hour)}
                      </div>

                      {/* Small anchor dot on spine */}
                      <div className="absolute -left-[31px] sm:-left-[39px] top-5 size-2.5 rounded-full border-2 border-white dark:border-[#1C1C1E] bg-[#F88E87]" />

                      {/* Task Card */}
                      <TaskCard
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onToggleSubtask={onToggleSubtask}
                        onEditTask={onEditTask}
                        onDeleteTask={onDeleteTask}
                        onDuplicateTask={onDuplicateTask}
                        onMoveToInbox={onMoveToInbox}
                        onScheduleTask={onScheduleTask}
                        use24Hour={use24Hour}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
