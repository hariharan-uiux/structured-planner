export function formatHour(hourDecimal: number, use24Hour: boolean = false): string {
  const hours = Math.floor(hourDecimal);
  const minutes = Math.round((hourDecimal - hours) * 60);

  if (use24Hour) {
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const mm = String(minutes).padStart(2, '0');
  return `${displayHours}:${mm} ${period}`;
}

export function formatTimeRange(
  startTime: number,
  durationMinutes: number,
  use24Hour: boolean = false
): string {
  const endTime = startTime + durationMinutes / 60;
  return `${formatHour(startTime, use24Hour)} – ${formatHour(endTime, use24Hour)}`;
}

export function formatDuration(durationMinutes: number): string {
  if (durationMinutes < 60) {
    return `${durationMinutes}m`;
  }
  const hours = Math.floor(durationMinutes / 60);
  const remainingMinutes = durationMinutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function getCurrentTimeDecimal(): number {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

export interface FreeGap {
  startTime: number;
  durationMinutes: number;
  label: string;
}

// Find empty intervals between scheduled tasks
export function findFreeGaps(
  tasks: Array<{ startTime: number; duration: number }>,
  dayStartHour: number = 8,
  dayEndHour: number = 22
): FreeGap[] {
  const sorted = [...tasks].sort((a, b) => a.startTime - b.startTime);
  const gaps: FreeGap[] = [];

  let cursor = dayStartHour;

  for (const t of sorted) {
    if (t.startTime > cursor + 0.15) {
      // Gap must be at least 10 minutes
      const gapMins = Math.round((t.startTime - cursor) * 60);
      if (gapMins >= 10) {
        gaps.push({
          startTime: cursor,
          durationMinutes: gapMins,
          label: `${formatDuration(gapMins)} free`,
        });
      }
    }
    const taskEnd = t.startTime + t.duration / 60;
    cursor = Math.max(cursor, taskEnd);
  }

  if (cursor < dayEndHour - 0.25) {
    const gapMins = Math.round((dayEndHour - cursor) * 60);
    if (gapMins >= 15) {
      gaps.push({
        startTime: cursor,
        durationMinutes: gapMins,
        label: `${formatDuration(gapMins)} free`,
      });
    }
  }

  return gaps;
}

// Reverse-engineered Structured next available slot algorithm
export function findNextAvailableSlot(
  existingTasks: Array<{ startTime: number | null; duration: number }>,
  newDurationMinutes: number = 30,
  preferredStartHour: number = 9
): number {
  const validTasks = existingTasks
    .filter((t): t is { startTime: number; duration: number } => t.startTime !== null)
    .sort((a, b) => a.startTime - b.startTime);

  let candidate = preferredStartHour;
  const newDurationHours = Math.max(1, newDurationMinutes) / 60;

  for (const task of validTasks) {
    const taskEnd = task.startTime + Math.max(1, task.duration) / 60;
    if (candidate + newDurationHours <= task.startTime) {
      return Math.round(candidate * 4) / 4; // round to nearest 15 mins
    }
    candidate = Math.max(candidate, taskEnd);
  }

  return Math.min(Math.round(candidate * 4) / 4, 23);
}
