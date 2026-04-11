import { useState, type ReactNode } from 'react';
import type { ViewType } from '../types/habit.ts';
import type { HabitTrackerData } from '../types/habit.ts';
import { ExportMenu } from './shared/ExportMenu.tsx';

interface HeaderProps {
  data: HabitTrackerData;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onAddHabit: () => void;
  onToggleSidebar: () => void;
  onShowShortcuts: () => void;
  onUpdateTitle: (title: string, subtitle: string) => void;
}

const VIEW_ICONS: { key: ViewType; label: string; short: string; icon: ReactNode }[] = [
  {
    key: 'year', label: 'Year Calendar', short: 'Year',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>,
  },
  {
    key: 'timeline', label: 'Year Timeline', short: 'Timeline',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="1" y1="3" x2="15" y2="3"/><line x1="1" y1="8" x2="12" y2="8"/><line x1="1" y1="13" x2="10" y2="13"/></svg>,
  },
  {
    key: 'month', label: 'Month', short: 'Month',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="2" width="14" height="13" rx="2"/><line x1="1" y1="6" x2="15" y2="6"/><line x1="5" y1="2" x2="5" y2="6"/><line x1="11" y1="2" x2="11" y2="6"/></svg>,
  },
  {
    key: 'week', label: 'Week', short: 'Week',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="1" y1="2" x2="1" y2="14"/><line x1="3.5" y1="2" x2="3.5" y2="14"/><line x1="6" y1="2" x2="6" y2="14"/><line x1="8.5" y1="2" x2="8.5" y2="14"/><line x1="11" y1="2" x2="11" y2="14"/><line x1="13.5" y1="2" x2="13.5" y2="14"/><line x1="15" y1="2" x2="15" y2="14" strokeWidth="1.5" opacity="0.5"/></svg>,
  },
  {
    key: 'day', label: 'Day', short: 'Day',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="1" width="8" height="14" rx="2"/></svg>,
  },
  {
    key: 'analytics', label: 'Analytics', short: 'Stats',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="1,12 5,6 9,9 15,2"/><polyline points="11,2 15,2 15,6"/></svg>,
  },
];

export function Header({ data, view, onViewChange, onAddHabit, onToggleSidebar, onShowShortcuts, onUpdateTitle }: HeaderProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [subtitleDraft, setSubtitleDraft] = useState('');

  const handleStartEdit = () => {
    setTitleDraft(data.title || '');
    setSubtitleDraft(data.subtitle || '');
    setEditingTitle(true);
  };

  const handleSaveTitle = () => {
    onUpdateTitle(titleDraft.trim(), subtitleDraft.trim());
    setEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveTitle();
    if (e.key === 'Escape') setEditingTitle(false);
  };

  return (
    <div className="ht-header">
      <div className="ht-header-left">
        <button className="ht-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="2" y1="4" x2="16" y2="4"/>
            <line x1="2" y1="9" x2="16" y2="9"/>
            <line x1="2" y1="14" x2="16" y2="14"/>
          </svg>
        </button>
        {editingTitle ? (
          <div className="ht-title-edit">
            <input
              className="ht-title-input"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Page title"
              autoFocus
            />
            <input
              className="ht-subtitle-input"
              value={subtitleDraft}
              onChange={(e) => setSubtitleDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Subtitle (optional)"
            />
            <button className="ht-title-save-btn" onClick={handleSaveTitle}>Save</button>
          </div>
        ) : (
          <div className="ht-title-display" onDoubleClick={handleStartEdit} title="Double-click to edit">
            <span className="ht-title-text">{data.title || data.year}</span>
            {data.subtitle && <span className="ht-subtitle-text">{data.subtitle}</span>}
          </div>
        )}
      </div>
      <div className="ht-view-toggle">
        {VIEW_ICONS.map(v => (
          <button
            key={v.key}
            className={`ht-view-btn ${view === v.key ? 'active' : ''}`}
            onClick={() => onViewChange(v.key)}
            title={v.label}
          >
            <span className="ht-view-btn-icon">{v.icon}</span>
            <span className="ht-view-btn-label">
              <span className="view-label-full">{v.label}</span>
              <span className="view-label-short">{v.short}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="ht-header-right">
        <button className="ht-add-btn" onClick={onAddHabit}>
          + Add Habit
        </button>
        <ExportMenu data={data} />
        <button
          className="ht-shortcuts-btn"
          onClick={onShowShortcuts}
          title="Keyboard shortcuts"
        >
          ?
        </button>
      </div>
    </div>
  );
}
