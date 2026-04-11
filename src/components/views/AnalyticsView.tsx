import { useMemo } from 'react';
import type { HabitTrackerData } from '../../types/habit.ts';
import {
  getTrackerOverview,
  getGroupStats,
  getTopPerformers,
  getStreakLeaders,
  getNeedsAttention,
  getDailyCompletionTrend,
  getWeekdayPerformance,
} from '../../lib/stats.ts';
import { HabitIcon } from '../../lib/icons.tsx';
import { HabitChart } from '../shared/HabitChart.tsx';

interface AnalyticsViewProps {
  data: HabitTrackerData;
  onSelectHabit: (habitId: string) => void;
}

export function AnalyticsView({ data, onSelectHabit }: AnalyticsViewProps) {
  const overview = useMemo(() => getTrackerOverview(data), [data]);
  const groupStats = useMemo(() => getGroupStats(data), [data]);
  const topPerformers = useMemo(() => getTopPerformers(data), [data]);
  const streakLeaders = useMemo(() => getStreakLeaders(data), [data]);
  const needsAttention = useMemo(() => getNeedsAttention(data), [data]);
  const trendData = useMemo(() => getDailyCompletionTrend(data), [data]);
  const weekdayStats = useMemo(() => getWeekdayPerformance(data), [data]);

  const maxWeekday = Math.max(...weekdayStats.map(w => w.avgCompletion), 1);

  if (data.habits.filter(h => !h.archived).length === 0) {
    return (
      <div className="ht-analytics">
        <div className="ht-analytics-empty">
          No active habits yet. Create some habits to see analytics.
        </div>
      </div>
    );
  }

  return (
    <div className="ht-analytics">
      {/* Summary Cards */}
      <div className="ht-analytics-summary">
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value accent">{overview.overallCompletion}%</div>
          <div className="ht-analytics-card-label">Overall</div>
        </div>
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value">{overview.activeCount}</div>
          <div className="ht-analytics-card-label">Active</div>
        </div>
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value">{overview.archivedCount}</div>
          <div className="ht-analytics-card-label">Archived</div>
        </div>
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value">{overview.totalDaysTracked}</div>
          <div className="ht-analytics-card-label">Days Tracked</div>
        </div>
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value">{overview.bestStreak}</div>
          <div className="ht-analytics-card-label">Best Streak</div>
        </div>
        <div className="ht-analytics-card">
          <div className="ht-analytics-card-value">{overview.todayDone}/{overview.todayTotal}</div>
          <div className="ht-analytics-card-label">Today</div>
        </div>
      </div>

      {/* Panels Grid */}
      <div className="ht-analytics-grid">
        {/* Completion Trend */}
        {trendData.length > 0 && (
          <div className="ht-analytics-panel" style={{ gridColumn: '1 / -1' }}>
            <div className="ht-analytics-panel-title">Completion Trend (90 days)</div>
            <HabitChart data={trendData} color="#6366f1" label="Completion" />
          </div>
        )}

        {/* Group Performance */}
        {groupStats.length > 0 && (
          <div className="ht-analytics-panel">
            <div className="ht-analytics-panel-title">Group Performance</div>
            {groupStats.map(gs => (
              <div key={gs.group.id} className="ht-analytics-row">
                <div className="ht-analytics-color-dot" style={{ background: gs.group.color }} />
                <div className="ht-analytics-row-name">{gs.group.name}</div>
                <div className="ht-analytics-bar">
                  <div
                    className="ht-analytics-bar-fill"
                    style={{ width: `${gs.avgCompletion}%`, background: gs.group.color }}
                  />
                </div>
                <div className="ht-analytics-row-value">{gs.avgCompletion}%</div>
              </div>
            ))}
          </div>
        )}

        {/* Top Performers */}
        {topPerformers.length > 0 && (
          <div className="ht-analytics-panel">
            <div className="ht-analytics-panel-title">Top Performers</div>
            {topPerformers.map(r => (
              <div
                key={r.habit.id}
                className="ht-analytics-row clickable"
                onClick={() => onSelectHabit(r.habit.id)}
              >
                <HabitIcon name={r.habit.icon} size={14} color={r.habit.color} />
                <div className="ht-analytics-row-name">{r.habit.name}</div>
                <div className="ht-analytics-bar" style={{ width: 60 }}>
                  <div
                    className="ht-analytics-bar-fill"
                    style={{ width: `${r.value}%`, background: r.habit.color }}
                  />
                </div>
                <div className="ht-analytics-row-value">{r.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Streak Leaders */}
        {streakLeaders.length > 0 && (
          <div className="ht-analytics-panel">
            <div className="ht-analytics-panel-title">Streak Leaders</div>
            {streakLeaders.map(r => (
              <div
                key={r.habit.id}
                className="ht-analytics-row clickable"
                onClick={() => onSelectHabit(r.habit.id)}
              >
                <HabitIcon name={r.habit.icon} size={14} color={r.habit.color} />
                <div className="ht-analytics-row-name">{r.habit.name}</div>
                <div className="ht-analytics-row-value">{r.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Needs Attention */}
        {needsAttention.length > 0 && (
          <div className="ht-analytics-panel">
            <div className="ht-analytics-panel-title">Needs Attention</div>
            {needsAttention.map(r => (
              <div
                key={r.habit.id}
                className="ht-analytics-row clickable"
                onClick={() => onSelectHabit(r.habit.id)}
              >
                <HabitIcon name={r.habit.icon} size={14} color={r.habit.color} />
                <div className="ht-analytics-row-name">{r.habit.name}</div>
                <div className="ht-analytics-row-value danger">{r.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Weekday Heatmap */}
        <div className="ht-analytics-panel">
          <div className="ht-analytics-panel-title">Day of Week Performance</div>
          <div className="ht-weekday-heatmap">
            {weekdayStats.map(w => (
              <div
                key={w.dayIndex}
                className="ht-weekday-cell"
                style={{
                  background: `rgba(99, 102, 241, ${(w.avgCompletion / maxWeekday) * 0.25})`,
                }}
              >
                <div className="ht-weekday-label">{w.day}</div>
                <div className="ht-weekday-value">{w.avgCompletion}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
