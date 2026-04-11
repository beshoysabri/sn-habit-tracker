import { useMemo, useState } from 'react';
import type { HabitTrackerData } from '../../types/habit.ts';
import {
  toDateStr,
  fromDateStr,
  isScheduledDay,
  getMonthName,
  getDayOfWeekName,
  getSundayWeekNumber,
} from '../../lib/calendar.ts';
import { hexToRgba } from '../../lib/colors.ts';
import { HabitIcon } from '../../lib/icons.tsx';

interface DayViewProps {
  data: HabitTrackerData;
  date: string; // YYYY-MM-DD
  onDateChange: (dateStr: string) => void;
  onToggleEntry: (habitId: string, dateStr: string) => void;
  onCounterIncrement: (habitId: string, dateStr: string) => void;
  onCounterDecrement: (habitId: string, dateStr: string) => void;
  onUpdateNote: (habitId: string, dateStr: string, note: string) => void;
}

const NoteIcon = ({ hasNote }: { hasNote: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="1" width="12" height="14" rx="2"/>
    {hasNote ? (
      <>
        <line x1="5" y1="5" x2="11" y2="5"/>
        <line x1="5" y1="8" x2="11" y2="8"/>
        <line x1="5" y1="11" x2="9" y2="11"/>
      </>
    ) : (
      <line x1="8" y1="5" x2="8" y2="11"/>
    )}
    {!hasNote && <line x1="5" y1="8" x2="11" y2="8"/>}
  </svg>
);

export function DayView({ data, date, onDateChange, onToggleEntry, onCounterIncrement, onCounterDecrement, onUpdateNote }: DayViewProps) {
  const d = fromDateStr(date);
  const dayOfWeek = d.getDay();
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const habits = useMemo(
    () => data.habits
      .filter(h => !h.archived && isScheduledDay(h.frequency, dayOfWeek) && date >= h.startDate)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    [data.habits, dayOfWeek, date]
  );

  const prevDay = () => {
    const prev = fromDateStr(date);
    prev.setDate(prev.getDate() - 1);
    onDateChange(toDateStr(prev));
  };

  const nextDay = () => {
    const next = fromDateStr(date);
    next.setDate(next.getDate() + 1);
    onDateChange(toDateStr(next));
  };

  const doneCount = habits.filter(h => {
    const entry = h.entries[date];
    if (h.trackingType === 'boolean') return entry?.status === 'done';
    return (entry?.value ?? 0) > 0;
  }).length;

  return (
    <div className="day-view">
      <div className="day-view-header">
        <div>
          <div className="day-view-title">
            {getDayOfWeekName(dayOfWeek)}, {getMonthName(d.getMonth())} {d.getDate()}
          </div>
          <div className="day-view-subtitle">
            {doneCount}/{habits.length} habits done &middot; CW {getSundayWeekNumber(d)}
          </div>
        </div>
        <div className="month-nav">
          <button className="month-nav-btn" onClick={prevDay}>←</button>
          <button className="month-nav-btn" onClick={nextDay}>→</button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="day-empty">No habits scheduled for this day.</div>
      ) : (
        <div className="day-habit-list">
          {habits.map(habit => {
            const entry = habit.entries[date];
            const hasNote = !!entry?.note;
            const isNoteExpanded = expandedNote === habit.id;

            if (habit.trackingType === 'boolean') {
              const status = entry?.status;
              let btnClass = '';
              let btnContent = '';
              let btnStyle = {};

              if (status === 'done') {
                btnClass = 'done';
                btnContent = '✚';
                btnStyle = { background: hexToRgba(habit.color, 0.7) };
              } else if (status === 'skipped') {
                btnClass = 'skipped';
                btnContent = '→';
              }

              return (
                <div key={habit.id} className="day-habit-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div className="day-habit-info" style={{ flex: 1 }}>
                      <div className="day-habit-name">
                        <HabitIcon name={habit.icon} size={16} />
                        {habit.name}
                      </div>
                      <div className="day-habit-freq">
                        {habit.frequency.type === 'daily' ? 'Every day' :
                          `${habit.frequency.daysOfWeek?.length ?? 0} days/week`}
                      </div>
                    </div>
                    <button
                      className={`day-note-btn ${hasNote ? 'has-note' : ''}`}
                      onClick={() => setExpandedNote(isNoteExpanded ? null : habit.id)}
                      title={hasNote ? 'View note' : 'Add note'}
                    >
                      <NoteIcon hasNote={hasNote} />
                    </button>
                    <button
                      className={`day-toggle-btn ${btnClass}`}
                      style={btnStyle}
                      onClick={() => onToggleEntry(habit.id, date)}
                    >
                      {btnContent}
                    </button>
                  </div>
                  {isNoteExpanded && (
                    <textarea
                      className="day-note-area"
                      placeholder="Add a note..."
                      defaultValue={entry?.note ?? ''}
                      onBlur={(e) => onUpdateNote(habit.id, date, e.target.value)}
                      autoFocus
                      rows={2}
                    />
                  )}
                  {!isNoteExpanded && hasNote && (
                    <div className="day-note-preview" onClick={() => setExpandedNote(habit.id)}>
                      {entry?.note}
                    </div>
                  )}
                </div>
              );
            } else {
              const val = entry?.value ?? 0;
              return (
                <div key={habit.id} className="day-habit-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <div className="day-habit-info" style={{ flex: 1 }}>
                      <div className="day-habit-name">
                        <HabitIcon name={habit.icon} size={16} />
                        {habit.name}
                      </div>
                      <div className="day-habit-freq">
                        Target: {habit.counterTarget ?? 1} {habit.counterUnit || 'times'}
                      </div>
                    </div>
                    <button
                      className={`day-note-btn ${hasNote ? 'has-note' : ''}`}
                      onClick={() => setExpandedNote(isNoteExpanded ? null : habit.id)}
                      title={hasNote ? 'View note' : 'Add note'}
                    >
                      <NoteIcon hasNote={hasNote} />
                    </button>
                    <div className="day-counter-controls">
                      <button
                        className="day-counter-btn"
                        onClick={() => onCounterDecrement(habit.id, date)}
                        disabled={val <= 0}
                      >
                        −
                      </button>
                      <div>
                        <div className="day-counter-value" style={val >= (habit.counterTarget ?? 1) ? { color: habit.color } : {}}>
                          {val}
                        </div>
                        {habit.counterTarget && (
                          <div className="day-counter-target">/ {habit.counterTarget}</div>
                        )}
                      </div>
                      <button
                        className="day-counter-btn"
                        onClick={() => onCounterIncrement(habit.id, date)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {isNoteExpanded && (
                    <textarea
                      className="day-note-area"
                      placeholder="Add a note..."
                      defaultValue={entry?.note ?? ''}
                      onBlur={(e) => onUpdateNote(habit.id, date, e.target.value)}
                      autoFocus
                      rows={2}
                    />
                  )}
                  {!isNoteExpanded && hasNote && (
                    <div className="day-note-preview" onClick={() => setExpandedNote(habit.id)}>
                      {entry?.note}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
