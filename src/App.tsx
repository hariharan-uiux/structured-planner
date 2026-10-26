import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Task, Settings } from './types';
import {
  getStoredTasks,
  saveStoredTasks,
  getStoredSettings,
  saveStoredSettings,
  getTodayDateString,
  generateInitialTasks,
} from './utils/storage';
import { findNextAvailableSlot } from './utils/time';
import { sound } from './utils/audio';
import { Header } from './components/Header';
import { Timeline } from './components/Timeline';
import { InboxDrawer } from './components/InboxDrawer';
import { EnergyMonitor } from './components/EnergyMonitor';
import { TaskModal } from './components/TaskModal';
import { SettingsModal } from './components/SettingsModal';
import { Plus } from 'lucide-react';

export function App() {
  const [tasks, setTasks] = useState<Task[]>(() => getStoredTasks());
  const [settings, setSettings] = useState<Settings>(() => getStoredSettings());
  const [currentDate, setCurrentDate] = useState<string>(() => getTodayDateString(0));
  const [activeView, setActiveView] = useState<'timeline' | 'inbox' | 'energy'>('timeline');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalStartTime, setModalStartTime] = useState<number>(9);
  const [modalDuration, setModalDuration] = useState<number>(30);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync tasks to local storage
  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  // Sync settings to local storage & sound instance
  useEffect(() => {
    saveStoredSettings(settings);
    sound.enabled = settings.isSoundEffectEnabled;
  }, [settings]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }, [settings.theme]);

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const handleToggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  // Filter tasks for current day
  const dayTimelineTasks = tasks.filter(
    (t) => t.day === currentDate && !t.isInInbox && !t.isAllDay
  );
  const dayAllDayTasks = tasks.filter(
    (t) => t.day === currentDate && !t.isInInbox && t.isAllDay
  );
  const inboxTasks = tasks.filter((t) => t.isInInbox);

  // Toggle complete
  const handleToggleComplete = (targetTask: Task) => {
    const isNowCompleted = !targetTask.completedAt;
    const updated = tasks.map((t) => {
      if (t.id === targetTask.id) {
        return {
          ...t,
          completedAt: isNowCompleted ? new Date().toISOString() : null,
        };
      }
      return t;
    });

    setTasks(updated);

    // If all tasks for the day are finished, celebrate with confetti!
    if (isNowCompleted && targetTask.day === currentDate) {
      const remaining = updated.filter(
        (t) => t.day === currentDate && !t.isInInbox && !t.completedAt
      );
      if (remaining.length === 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F88E87', '#FF9E74', '#EAAA00', '#91BF6C', '#6185A8'],
        });
      }
    }
  };

  // Toggle subtask
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return t;
      })
    );
  };

  // Save (Create or Update)
  const handleSaveTask = (savedTask: Task) => {
    const exists = tasks.some((t) => t.id === savedTask.id);
    if (exists) {
      setTasks(tasks.map((t) => (t.id === savedTask.id ? savedTask : t)));
    } else {
      setTasks([savedTask, ...tasks]);
    }
  };

  // Delete
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    sound.playClick();
  };

  // Duplicate
  const handleDuplicateTask = (task: Task) => {
    const dupStartTime =
      task.startTime !== null
        ? findNextAvailableSlot(dayTimelineTasks, task.duration, task.startTime + 0.5)
        : null;

    const duplicate: Task = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      startTime: dupStartTime,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    setTasks([duplicate, ...tasks]);
    sound.playCreate();
  };

  // Move to Inbox
  const handleMoveToInbox = (task: Task) => {
    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              isInInbox: true,
              day: null,
              startTime: null,
              isAllDay: false,
            }
          : t
      )
    );
    sound.playClick();
  };

  // Schedule task from inbox to today
  const handleScheduleTask = (task: Task) => {
    const nextSlot = findNextAvailableSlot(dayTimelineTasks, task.duration || 30, 9);
    setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? {
              ...t,
              isInInbox: false,
              day: currentDate,
              startTime: nextSlot,
              isAllDay: false,
            }
          : t
      )
    );
    sound.playCreate();
  };

  // Quick add to inbox
  const handleQuickAddInbox = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      symbol: 'sparkles',
      color: settings.palette,
      day: null,
      startTime: null,
      duration: 30,
      isAllDay: false,
      isInInbox: true,
      completedAt: null,
      subtasks: [],
      energyLevel: 'neutral',
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  // Quick add at specified time
  const handleQuickAddAtTime = (startHour: number, durationMinutes: number) => {
    setEditingTask(null);
    setModalStartTime(startHour);
    setModalDuration(durationMinutes);
    setIsTaskModalOpen(true);
  };

  // Open modal for brand new task
  const handleOpenNewTaskModal = () => {
    setEditingTask(null);
    const nextSlot = findNextAvailableSlot(dayTimelineTasks, 30, 9);
    setModalStartTime(nextSlot);
    setModalDuration(30);
    setIsTaskModalOpen(true);
  };

  // Edit task
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Reset to demo schedule
  const handleResetDemo = () => {
    const demo = generateInitialTasks();
    setTasks(demo);
    saveStoredTasks(demo);
    sound.playCreate();
  };

  // Clear all
  const handleClearAll = () => {
    setTasks([]);
    saveStoredTasks([]);
    sound.playClick();
  };

  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-[#1C1C1E] text-[#141414] dark:text-white transition-colors duration-200">
      {/* Top Header */}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        activeView={activeView}
        onViewChange={setActiveView}
        inboxCount={inboxTasks.filter((t) => !t.completedAt).length}
        onOpenNewTaskModal={handleOpenNewTaskModal}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main View Body */}
      <main className="flex-1 pb-24">
        {activeView === 'timeline' && (
          <Timeline
            tasks={dayTimelineTasks}
            allDayTasks={dayAllDayTasks}
            currentDate={currentDate}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDuplicateTask={handleDuplicateTask}
            onMoveToInbox={handleMoveToInbox}
            onScheduleTask={handleScheduleTask}
            onQuickAddAtTime={handleQuickAddAtTime}
          />
        )}

        {activeView === 'inbox' && (
          <InboxDrawer
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onToggleSubtask={handleToggleSubtask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDuplicateTask={handleDuplicateTask}
            onMoveToInbox={handleMoveToInbox}
            onScheduleTask={handleScheduleTask}
            onQuickAddInbox={handleQuickAddInbox}
          />
        )}

        {activeView === 'energy' && (
          <EnergyMonitor tasks={tasks} currentDate={currentDate} />
        )}
      </main>

      {/* Floating Add Button for Mobile / Quick Action */}
      <div className="fixed right-6 bottom-6 z-40 sm:hidden">
        <button
          onClick={handleOpenNewTaskModal}
          aria-label="Add new task"
          className="size-14 rounded-full bg-[#F88E87] hover:bg-[#e87a73] active:scale-95 text-white flex items-center justify-center shadow-2xl transition"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialTask={editingTask}
        defaultDate={currentDate}
        defaultStartTime={modalStartTime}
        defaultDuration={modalDuration}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onResetDemo={handleResetDemo}
        onClearAll={handleClearAll}
      />
    </div>
  );
}

export default App;
