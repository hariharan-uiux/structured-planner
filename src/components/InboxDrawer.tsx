import React, { useState } from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus, Inbox as InboxIcon, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface InboxDrawerProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onMoveToInbox: (task: Task) => void;
  onScheduleTask: (task: Task) => void;
  onQuickAddInbox: (title: string) => void;
}

export const InboxDrawer: React.FC<InboxDrawerProps> = ({
  tasks,
  onToggleComplete,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onMoveToInbox,
  onScheduleTask,
  onQuickAddInbox,
}) => {
  const [quickTitle, setQuickTitle] = useState('');

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    sound.playCreate();
    onQuickAddInbox(quickTitle.trim());
    setQuickTitle('');
  };

  const activeInboxTasks = tasks.filter((t) => t.isInInbox && !t.completedAt);
  const completedInboxTasks = tasks.filter((t) => t.isInInbox && t.completedAt);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Inbox Header Banner */}
      <div className="mb-6 p-5 rounded-3xl bg-[#F88E87]/10 dark:bg-[#F88E87]/15 border border-[#F88E87]/20 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-[#141414] dark:text-white flex items-center gap-2">
            <InboxIcon size={18} className="text-[#F88E87]" />
            <span>Unscheduled Tasks</span>
          </h2>
          <p className="text-xs text-[#858585] mt-0.5">
            Collect to-dos and thoughts here, then schedule them into your daily timeline when ready.
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-white dark:bg-[#242424] text-xs font-bold text-[#F88E87] shadow-sm">
          {activeInboxTasks.length} pending
        </div>
      </div>

      {/* Quick Add Bar */}
      <form onSubmit={handleQuickAdd} className="mb-6">
        <div className="flex items-center gap-2 p-1.5 pl-4 rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#242424] shadow-sm focus-within:border-[#F88E87] transition">
          <input
            type="text"
            placeholder="Quick add to inbox... (e.g. Call dentist, Order groceries)"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#141414] dark:text-white placeholder-[#858585] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-[#F88E87] hover:bg-[#e87a73] disabled:opacity-40 disabled:hover:bg-[#F88E87] text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Active Backlog List */}
      {activeInboxTasks.length === 0 && completedInboxTasks.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-black/10 dark:border-white/10 p-8">
          <div className="size-12 mx-auto rounded-full bg-black/5 dark:bg-white/5 text-[#858585] flex items-center justify-center mb-3">
            <InboxIcon size={24} />
          </div>
          <h3 className="text-sm font-bold text-[#141414] dark:text-white mb-1">
            Your inbox is completely clear!
          </h3>
          <p className="text-xs text-[#858585]">
            Use the input above to jot down unassigned tasks.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeInboxTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onToggleSubtask={onToggleSubtask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onDuplicateTask={onDuplicateTask}
              onMoveToInbox={onMoveToInbox}
              onScheduleTask={onScheduleTask}
            />
          ))}

          {/* Completed Inbox Items */}
          {completedInboxTasks.length > 0 && (
            <div className="mt-8 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
              <div className="text-xs font-semibold text-[#858585] mb-3">
                Completed ({completedInboxTasks.length})
              </div>
              <div className="space-y-2">
                {completedInboxTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onToggleSubtask={onToggleSubtask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDuplicateTask={onDuplicateTask}
                    onMoveToInbox={onMoveToInbox}
                    onScheduleTask={onScheduleTask}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
