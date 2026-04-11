import { useMemo, useState, useRef, useCallback } from 'react';
import type { Habit, HabitTrackerData, HabitGroup } from '../types/habit.ts';
import { getCompletionRate } from '../lib/stats.ts';
import { getGroupedHabits } from '../lib/data.ts';
import { HabitIcon } from '../lib/icons.tsx';
import { hexToRgba } from '../lib/colors.ts';

interface HabitSidebarProps {
  data: HabitTrackerData;
  selectedHabitId: string | null;
  onSelectHabit: (id: string | null) => void;
  onAddHabit: () => void;
  onAddGroup: () => void;
  onEditGroup: (group: HabitGroup) => void;
  onReorderGroups: (orderedGroupIds: string[]) => void;
}

export function HabitSidebar({
  data,
  selectedHabitId,
  onSelectHabit,
  onAddHabit,
  onAddGroup,
  onEditGroup,
  onReorderGroups,
}: HabitSidebarProps) {
  const activeHabits = useMemo(
    () => data.habits.filter(h => !h.archived).sort((a, b) => a.sortOrder - b.sortOrder),
    [data.habits]
  );

  const grouped = useMemo(
    () => getGroupedHabits(activeHabits, data.groups),
    [activeHabits, data.groups]
  );

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dragGroupId, setDragGroupId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});

  const toggleCollapse = (groupId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const sortedGroups = useMemo(
    () => [...(data.groups ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [data.groups]
  );

  const handleDragStart = useCallback((e: React.DragEvent, groupId: string) => {
    setDragGroupId(groupId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', groupId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '';
    }
    setDragGroupId(null);
    setDropTargetId(null);
    dragCounter.current = {};
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    dragCounter.current[targetId] = (dragCounter.current[targetId] ?? 0) + 1;
    if (dragGroupId && targetId !== dragGroupId) {
      setDropTargetId(targetId);
    }
  }, [dragGroupId]);

  const handleDragLeave = useCallback((_e: React.DragEvent, targetId: string) => {
    dragCounter.current[targetId] = (dragCounter.current[targetId] ?? 0) - 1;
    if (dragCounter.current[targetId] <= 0) {
      dragCounter.current[targetId] = 0;
      if (dropTargetId === targetId) {
        setDropTargetId(null);
      }
    }
  }, [dropTargetId]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragGroupId || dragGroupId === targetId) {
      setDragGroupId(null);
      setDropTargetId(null);
      dragCounter.current = {};
      return;
    }

    const currentOrder = sortedGroups.map(g => g.id);
    const fromIdx = currentOrder.indexOf(dragGroupId);
    const toIdx = currentOrder.indexOf(targetId);

    if (fromIdx < 0 || toIdx < 0) return;

    const newOrder = currentOrder.filter(id => id !== dragGroupId);
    const insertIdx = newOrder.indexOf(targetId);
    newOrder.splice(insertIdx, 0, dragGroupId);

    onReorderGroups(newOrder);
    setDragGroupId(null);
    setDropTargetId(null);
    dragCounter.current = {};
  }, [dragGroupId, sortedGroups, onReorderGroups]);

  return (
    <div className="ht-sidebar">
      <div className="ht-sidebar-header">
        <span className="ht-sidebar-title">My Habits</span>
        <span className="ht-sidebar-count">{activeHabits.length} active</span>
      </div>
      <div className="ht-sidebar-list">
        {activeHabits.length === 0 ? (
          <div className="ht-sidebar-empty">
            No habits yet.<br />Click + Add Habit below.
          </div>
        ) : (
          <>
            <SidebarItem
              label="All Habits"
              isSelected={selectedHabitId === null}
              onClick={() => onSelectHabit(null)}
            />
            {grouped.map(({ group, habits }) => (
              <div key={group?.id ?? 'ungrouped'}>
                {group && (
                  <div
                    className={`ht-sidebar-group-header ${dragGroupId === group.id ? 'dragging' : ''} ${dropTargetId === group.id ? 'drop-target' : ''}`}
                    style={{ background: hexToRgba(group.color, 0.08) }}
                    draggable
                    onClick={() => toggleCollapse(group.id)}
                    onDragStart={(e) => handleDragStart(e, group.id)}
                    onDragEnd={handleDragEnd}
                    onDragEnter={(e) => handleDragEnter(e, group.id)}
                    onDragLeave={(e) => handleDragLeave(e, group.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, group.id)}
                  >
                    <span className="ht-sidebar-drag-handle" title="Drag to reorder">&#x2807;</span>
                    <span className="ht-sidebar-section-dot" style={{ background: group.color }} />
                    <span className="ht-sidebar-group-name">{group.name}</span>
                    <span
                      className="ht-sidebar-group-count"
                      style={{ background: hexToRgba(group.color, 0.15), color: group.color }}
                    >
                      {habits.length}
                    </span>
                    <button
                      className="ht-sidebar-group-edit"
                      onClick={(e) => { e.stopPropagation(); onEditGroup(group); }}
                      title="Edit life area"
                    >
                      &#x22EF;
                    </button>
                    <span className={`ht-sidebar-group-arrow ${collapsed.has(group.id) ? 'collapsed' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                )}
                {group === null && grouped.length > 1 && (
                  <div className="ht-sidebar-group-header" onClick={() => toggleCollapse('__ungrouped')}>
                    <span className="ht-sidebar-group-name" style={{ opacity: 0.6 }}>Ungrouped</span>
                    <span className={`ht-sidebar-group-arrow ${collapsed.has('__ungrouped') ? 'collapsed' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                )}
                {!(group && collapsed.has(group.id)) && !(group === null && collapsed.has('__ungrouped')) &&
                  habits.map(habit => (
                    <HabitSidebarItem
                      key={habit.id}
                      habit={habit}
                      year={data.year}
                      isSelected={selectedHabitId === habit.id}
                      onClick={() => onSelectHabit(habit.id)}
                    />
                  ))
                }
              </div>
            ))}
          </>
        )}
      </div>
      <div className="ht-sidebar-footer">
        <button className="ht-sidebar-footer-btn" onClick={onAddHabit}>+ Add Habit</button>
        <button className="ht-sidebar-footer-btn" onClick={onAddGroup}>+ Life Area</button>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`ht-sidebar-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="ht-sidebar-icon"><HabitIcon name="inbox" size={14} /></span>
      <span className="ht-sidebar-name">{label}</span>
    </div>
  );
}

function HabitSidebarItem({
  habit,
  year,
  isSelected,
  onClick,
}: {
  habit: Habit;
  year: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pct = useMemo(() => getCompletionRate(habit, year), [habit, year]);

  return (
    <div
      className={`ht-sidebar-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="ht-sidebar-icon"><HabitIcon name={habit.icon} size={14} color={habit.color} /></span>
      <span className="ht-sidebar-name">{habit.name}</span>
      <span className="ht-sidebar-pct">{pct}%</span>
    </div>
  );
}
