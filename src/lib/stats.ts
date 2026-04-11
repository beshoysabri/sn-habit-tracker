import type { Habit, HabitTrackerData, HabitGroup } from '../types/habit.ts';
import { toDateStr, isScheduledDay, getDayOfWeekName } from './calendar.ts';

export function getCompletionRate(habit: Habit, year: number): number {
  const today = new Date();
  const todayStr = toDateStr(today);

  let scheduled = 0;
  let done = 0;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    if (ds > todayStr) break;
    if (ds < habit.startDate) continue;

    if (isScheduledDay(habit.frequency, d.getDay())) {
      scheduled++;
      const entry = habit.entries[ds];
      if (entry) {
        if (habit.trackingType === 'boolean' && entry.status === 'done') {
          done++;
        } else if (habit.trackingType === 'counter' && entry.value !== undefined && entry.value > 0) {
          if (habit.counterTarget && habit.counterTarget > 0) {
            done += Math.min(entry.value / habit.counterTarget, 1);
          } else {
            done++;
          }
        }
      }
    }
  }

  return scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
}

export function getCompletionRateForPeriod(
  habit: Habit,
  startDate: string,
  endDate: string,
): number {
  let scheduled = 0;
  let done = 0;

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(endDate + 'T00:00:00');

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    if (ds < habit.startDate) continue;

    if (isScheduledDay(habit.frequency, d.getDay())) {
      scheduled++;
      const entry = habit.entries[ds];
      if (entry) {
        if (habit.trackingType === 'boolean' && entry.status === 'done') {
          done++;
        } else if (habit.trackingType === 'counter' && entry.value !== undefined && entry.value > 0) {
          if (habit.counterTarget && habit.counterTarget > 0) {
            done += Math.min(entry.value / habit.counterTarget, 1);
          } else {
            done++;
          }
        }
      }
    }
  }

  return scheduled === 0 ? 0 : Math.round((done / scheduled) * 100);
}

export function getCurrentStreak(habit: Habit): number {
  const today = new Date();
  let streak = 0;
  const d = new Date(today);

  // Check today first; if not done, start from yesterday
  const todayDs = toDateStr(d);
  const todayEntry = habit.entries[todayDs];
  const todayScheduled = isScheduledDay(habit.frequency, d.getDay());

  if (todayScheduled) {
    const isDone = habit.trackingType === 'boolean'
      ? todayEntry?.status === 'done'
      : (todayEntry?.value ?? 0) > 0;
    if (isDone) {
      streak = 1;
    } else {
      // Today not done yet — start counting from yesterday
      d.setDate(d.getDate() - 1);
    }
  } else {
    d.setDate(d.getDate() - 1);
  }

  if (streak === 0) {
    // Start fresh from d (yesterday or earlier)
  }

  // Walk backwards
  for (let i = 0; i < 366; i++) {
    const ds = toDateStr(d);
    if (ds < habit.startDate) break;

    if (isScheduledDay(habit.frequency, d.getDay())) {
      const entry = habit.entries[ds];
      const isDone = habit.trackingType === 'boolean'
        ? entry?.status === 'done'
        : (entry?.value ?? 0) > 0;

      if (isDone) {
        streak++;
      } else {
        break;
      }
    }

    d.setDate(d.getDate() - 1);
  }

  return streak;
}

export function getBestStreak(habit: Habit, year: number): number {
  let bestStreak = 0;
  let currentStreak = 0;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  const today = toDateStr(new Date());

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    if (ds > today) break;
    if (ds < habit.startDate) continue;

    if (isScheduledDay(habit.frequency, d.getDay())) {
      const entry = habit.entries[ds];
      const isDone = habit.trackingType === 'boolean'
        ? entry?.status === 'done'
        : (entry?.value ?? 0) > 0;

      if (isDone) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
  }

  return bestStreak;
}

export function getMonthlyCompletionRates(habit: Habit, year: number): number[] {
  const rates: number[] = [];
  const today = toDateStr(new Date());

  for (let m = 0; m < 12; m++) {
    let scheduled = 0;
    let done = 0;
    const daysInMonth = new Date(year, m + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, m, day);
      const ds = toDateStr(d);
      if (ds > today) break;
      if (ds < habit.startDate) continue;

      if (isScheduledDay(habit.frequency, d.getDay())) {
        scheduled++;
        const entry = habit.entries[ds];
        if (entry) {
          if (habit.trackingType === 'boolean' && entry.status === 'done') {
            done++;
          } else if (habit.trackingType === 'counter' && (entry.value ?? 0) > 0) {
            if (habit.counterTarget && habit.counterTarget > 0) {
              done += Math.min(entry.value! / habit.counterTarget, 1);
            } else {
              done++;
            }
          }
        }
      }
    }

    rates.push(scheduled === 0 ? 0 : Math.round((done / scheduled) * 100));
  }

  return rates;
}

export function getTotalDone(habit: Habit, year: number): number {
  let done = 0;
  const today = toDateStr(new Date());

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    if (ds > today) break;
    if (ds < habit.startDate) continue;

    const entry = habit.entries[ds];
    if (entry) {
      if (habit.trackingType === 'boolean' && entry.status === 'done') {
        done++;
      } else if (habit.trackingType === 'counter' && (entry.value ?? 0) > 0) {
        done++;
      }
    }
  }

  return done;
}

// ======= Analytics Dashboard Functions =======

export interface TrackerOverview {
  overallCompletion: number;
  activeCount: number;
  archivedCount: number;
  totalDaysTracked: number;
  bestStreak: number;
  todayDone: number;
  todayTotal: number;
}

export function getTrackerOverview(data: HabitTrackerData): TrackerOverview {
  const activeHabits = data.habits.filter(h => !h.archived);
  const today = toDateStr(new Date());
  const d = new Date();

  // Overall completion
  const rates = activeHabits.map(h => getCompletionRate(h, data.year));
  const overallCompletion = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

  // Best streak across all habits
  const bestStreak = activeHabits.reduce((max, h) => Math.max(max, getBestStreak(h, data.year)), 0);

  // Total days tracked (days since earliest habit start)
  const earliestStart = activeHabits.reduce((earliest, h) => {
    return h.startDate < earliest ? h.startDate : earliest;
  }, today);
  const startDate = new Date(earliestStart + 'T00:00:00');
  const totalDaysTracked = Math.max(0, Math.floor((new Date().getTime() - startDate.getTime()) / 86400000) + 1);

  // Today's progress
  const todayScheduled = activeHabits.filter(h => {
    if (today < h.startDate) return false;
    return isScheduledDay(h.frequency, d.getDay());
  });
  const todayDone = todayScheduled.filter(h => {
    const entry = h.entries[today];
    if (h.trackingType === 'boolean') return entry?.status === 'done';
    return (entry?.value ?? 0) > 0;
  }).length;

  return {
    overallCompletion,
    activeCount: activeHabits.length,
    archivedCount: data.habits.filter(h => h.archived).length,
    totalDaysTracked,
    bestStreak,
    todayDone,
    todayTotal: todayScheduled.length,
  };
}

export interface GroupStat {
  group: HabitGroup;
  avgCompletion: number;
  habitCount: number;
}

export function getGroupStats(data: HabitTrackerData): GroupStat[] {
  const groups = data.groups ?? [];
  const activeHabits = data.habits.filter(h => !h.archived);

  return groups.map(group => {
    const groupHabits = activeHabits.filter(h => h.groupId === group.id);
    const rates = groupHabits.map(h => getCompletionRate(h, data.year));
    const avgCompletion = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;
    return { group, avgCompletion, habitCount: groupHabits.length };
  })
  .filter(g => g.habitCount > 0)
  .sort((a, b) => b.avgCompletion - a.avgCompletion);
}

export interface HabitRank {
  habit: Habit;
  value: number;
  label: string;
}

export function getTopPerformers(data: HabitTrackerData, limit = 5): HabitRank[] {
  return data.habits
    .filter(h => !h.archived)
    .map(h => ({
      habit: h,
      value: getCompletionRate(h, data.year),
      label: `${getCompletionRate(h, data.year)}%`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getStreakLeaders(data: HabitTrackerData, limit = 5): HabitRank[] {
  return data.habits
    .filter(h => !h.archived)
    .map(h => {
      const streak = getCurrentStreak(h);
      return {
        habit: h,
        value: streak,
        label: `${streak} day${streak !== 1 ? 's' : ''}`,
      };
    })
    .filter(r => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getNeedsAttention(data: HabitTrackerData, limit = 5): HabitRank[] {
  return data.habits
    .filter(h => !h.archived)
    .map(h => ({
      habit: h,
      value: getCompletionRate(h, data.year),
      label: `${getCompletionRate(h, data.year)}%`,
    }))
    .filter(r => r.value < 50)
    .sort((a, b) => a.value - b.value)
    .slice(0, limit);
}

export interface DailyTrendPoint {
  date: string;
  value: number;
}

export function getDailyCompletionTrend(data: HabitTrackerData, days = 90): DailyTrendPoint[] {
  const activeHabits = data.habits.filter(h => !h.archived);
  if (activeHabits.length === 0) return [];

  const today = new Date();
  const points: DailyTrendPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = toDateStr(d);

    const scheduled = activeHabits.filter(h => {
      if (ds < h.startDate) return false;
      return isScheduledDay(h.frequency, d.getDay());
    });

    if (scheduled.length === 0) continue;

    const done = scheduled.filter(h => {
      const entry = h.entries[ds];
      if (h.trackingType === 'boolean') return entry?.status === 'done';
      return (entry?.value ?? 0) > 0;
    }).length;

    points.push({ date: ds, value: Math.round((done / scheduled.length) * 100) });
  }

  return points;
}

export interface WeekdayStat {
  day: string;
  dayIndex: number;
  avgCompletion: number;
}

export function getWeekdayPerformance(data: HabitTrackerData): WeekdayStat[] {
  const activeHabits = data.habits.filter(h => !h.archived);
  const today = toDateStr(new Date());
  const dayStats: { scheduled: number; done: number }[] = Array.from({ length: 7 }, () => ({ scheduled: 0, done: 0 }));

  const start = new Date(data.year, 0, 1);
  const end = new Date(data.year, 11, 31);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const ds = toDateStr(d);
    if (ds > today) break;
    const dow = d.getDay();

    for (const h of activeHabits) {
      if (ds < h.startDate) continue;
      if (!isScheduledDay(h.frequency, dow)) continue;

      dayStats[dow].scheduled++;
      const entry = h.entries[ds];
      if (entry) {
        if (h.trackingType === 'boolean' && entry.status === 'done') {
          dayStats[dow].done++;
        } else if (h.trackingType === 'counter' && (entry.value ?? 0) > 0) {
          dayStats[dow].done++;
        }
      }
    }
  }

  return dayStats.map((stat, i) => ({
    day: getDayOfWeekName(i),
    dayIndex: i,
    avgCompletion: stat.scheduled === 0 ? 0 : Math.round((stat.done / stat.scheduled) * 100),
  }));
}
