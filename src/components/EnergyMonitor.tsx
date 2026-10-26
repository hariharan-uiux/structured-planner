import React from 'react';
import { Task } from '../types';
import {
  Zap,
  BatteryCharging,
  BatteryMedium,
  BatteryWarning,
  Sparkles,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { formatDuration } from '../utils/time';

interface EnergyMonitorProps {
  tasks: Task[];
  currentDate: string;
}

export const EnergyMonitor: React.FC<EnergyMonitorProps> = ({ tasks, currentDate }) => {
  const dayTasks = tasks.filter((t) => t.day === currentDate && !t.isInInbox);

  let rechargeMinutes = 0;
  let neutralMinutes = 0;
  let drainMinutes = 0;

  dayTasks.forEach((t) => {
    const dur = t.duration || 30;
    if (t.energyLevel === 'recharge') rechargeMinutes += dur;
    else if (t.energyLevel === 'drain') drainMinutes += dur;
    else neutralMinutes += dur;
  });

  const totalMinutes = rechargeMinutes + neutralMinutes + drainMinutes;
  const rechargePercent = totalMinutes > 0 ? Math.round((rechargeMinutes / totalMinutes) * 100) : 33;
  const neutralPercent = totalMinutes > 0 ? Math.round((neutralMinutes / totalMinutes) * 100) : 34;
  const drainPercent = totalMinutes > 0 ? Math.round((drainMinutes / totalMinutes) * 100) : 33;

  // Energy Balance Score (-100 to +100)
  const netEnergyScore =
    totalMinutes > 0
      ? Math.round(((rechargeMinutes - drainMinutes) / totalMinutes) * 100)
      : 0;

  const getAdvice = () => {
    if (netEnergyScore > 20) {
      return {
        title: 'Energizing & Restorative Day',
        desc: 'You have ample restorative and recovery blocks. Great day for creative ideation.',
        color: '#2F9E66',
      };
    } else if (netEnergyScore < -20) {
      return {
        title: 'High Energy Demand Day',
        desc: 'You have intense focus blocks scheduled. Consider adding a 15-minute walk or coffee break.',
        color: '#F27C49',
      };
    } else {
      return {
        title: 'Well-Balanced Flow',
        desc: 'Good equilibrium between demanding tasks and rejuvenating routines.',
        color: '#EAAA00',
      };
    }
  };

  const advice = getAdvice();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#242424] border border-black/10 dark:border-white/10 shadow-apple">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-2xl bg-[#F88E87]/20 text-[#F88E87] flex items-center justify-center">
              <Zap size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#141414] dark:text-white">
                Energy Balance
              </h2>
              <p className="text-xs text-[#858585]">
                Optimize mental clarity and prevent burnout.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className="text-2xl font-black tabular-nums"
              style={{ color: advice.color }}
            >
              {netEnergyScore > 0 ? `+${netEnergyScore}` : netEnergyScore}%
            </span>
            <div className="text-[10px] font-semibold text-[#858585] uppercase tracking-wider">
              Net Balance
            </div>
          </div>
        </div>

        {/* Visual Energy Distribution Segmented Bar */}
        <div className="space-y-2">
          <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-black/5 dark:bg-white/5 p-0.5 gap-1">
            <div
              className="h-full rounded-full bg-[#2F9E66] transition-all duration-500"
              style={{ width: `${rechargePercent}%` }}
              title={`Recharge: ${formatDuration(rechargeMinutes)}`}
            />
            <div
              className="h-full rounded-full bg-[#EAAA00] transition-all duration-500"
              style={{ width: `${neutralPercent}%` }}
              title={`Neutral: ${formatDuration(neutralMinutes)}`}
            />
            <div
              className="h-full rounded-full bg-[#F27C49] transition-all duration-500"
              style={{ width: `${drainPercent}%` }}
              title={`Drain: ${formatDuration(drainMinutes)}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 text-[#2F9E66] font-semibold">
              <BatteryCharging size={14} />
              <span>Recharge {formatDuration(rechargeMinutes)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#EAAA00] font-semibold">
              <BatteryMedium size={14} />
              <span>Neutral {formatDuration(neutralMinutes)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F27C49] font-semibold">
              <BatteryWarning size={14} />
              <span>Drain {formatDuration(drainMinutes)}</span>
            </div>
          </div>
        </div>

        {/* Advice Box */}
        <div
          className="mt-5 p-4 rounded-2xl border"
          style={{
            borderColor: `${advice.color}30`,
            backgroundColor: `${advice.color}10`,
          }}
        >
          <div className="flex items-center gap-2 mb-1" style={{ color: advice.color }}>
            <Sparkles size={15} />
            <span className="text-xs font-bold">{advice.title}</span>
          </div>
          <p className="text-xs text-[#141414]/80 dark:text-white/80">
            {advice.desc}
          </p>
        </div>
      </div>

      {/* Task Energy Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recharging Tasks */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#242424] border border-black/10 dark:border-white/10 shadow-apple">
          <div className="flex items-center gap-2 mb-3 text-[#2F9E66] font-bold text-sm">
            <BatteryCharging size={18} />
            <span>Recharging Activities</span>
          </div>
          <div className="space-y-2">
            {dayTasks.filter((t) => t.energyLevel === 'recharge').length === 0 ? (
              <p className="text-xs text-[#858585] py-2">
                No recharging activities scheduled yet.
              </p>
            ) : (
              dayTasks
                .filter((t) => t.energyLevel === 'recharge')
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] text-xs font-medium"
                  >
                    <span className="text-[#141414] dark:text-white truncate">
                      {t.title}
                    </span>
                    <span className="text-[#858585] shrink-0">
                      {formatDuration(t.duration)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* High Demand Tasks */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#242424] border border-black/10 dark:border-white/10 shadow-apple">
          <div className="flex items-center gap-2 mb-3 text-[#F27C49] font-bold text-sm">
            <BatteryWarning size={18} />
            <span>High-Demand Tasks</span>
          </div>
          <div className="space-y-2">
            {dayTasks.filter((t) => t.energyLevel === 'drain').length === 0 ? (
              <p className="text-xs text-[#858585] py-2">
                No draining tasks scheduled for today.
              </p>
            ) : (
              dayTasks
                .filter((t) => t.energyLevel === 'drain')
                .map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] text-xs font-medium"
                  >
                    <span className="text-[#141414] dark:text-white truncate">
                      {t.title}
                    </span>
                    <span className="text-[#858585] shrink-0">
                      {formatDuration(t.duration)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
