import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { Sparkles } from 'lucide-react';

interface AllDaySectionProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
  onMoveToInbox: (task: Task) => void;
  onScheduleTask: (task: Task) => void;
}

export const AllDaySection: React.FC<AllDaySectionProps> = ({
  tasks,
  onToggleComplete,
  onToggleSubtask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
  onMoveToInbox,
  onScheduleTask,
}) => {
  if (tasks.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <Sparkles size={14} className="text-[#F88E87]" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#858585]">
          All-Day Goals ({tasks.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {tasks.map((task) => (
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
    </section>
  );
};
