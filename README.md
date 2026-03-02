# Super Habit Tracker

A powerful habit tracking editor plugin for [Standard Notes](https://standardnotes.com). Track daily habits across an entire year with heatmap calendars, timeline views, streaks, and detailed statistics — all stored securely inside your encrypted notes.

## Features

- **5 Views** — Year Calendar (heatmap), Year Timeline (horizontal scroll), Month, Week, and Day
- **Boolean & Counter Tracking** — Mark habits done/skipped or track numeric values with targets
- **Flexible Scheduling** — Daily, specific days of the week, or custom frequency
- **Habit Groups** — Organize habits into color-coded groups with drag-and-drop reordering
- **Streaks & Statistics** — Current streak, best streak, completion rate, monthly bar charts
- **Calendar Week Numbers** — ISO week numbers displayed in all calendar views
- **Export** — CSV, Markdown, Excel (.xlsx), PDF, and screenshot (PNG) export
- **Keyboard Shortcuts** — Navigate views (1-5), cycle habits (arrows), add habits (N), and more
- **Theme-Aware** — Adapts to Standard Notes light/dark themes via CSS variables
- **Fully Responsive** — Optimized for desktop, tablet, and mobile with a slide-in sidebar drawer
- **Zero Dependencies on External Services** — All data lives in your Standard Notes note

## Install in Standard Notes

1. Open Standard Notes
2. Go to **Preferences > General > Advanced Settings**
3. Scroll to **Install Custom Plugin**
4. Paste this URL:
   ```
   https://beshoysabri.github.io/sn-super-habit-tracker/ext.json
   ```
5. Click **Install**
6. Create a new note and select **Super Habit Tracker** as the editor

## Development

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
git clone https://github.com/beshoysabri/sn-super-habit-tracker.git
cd sn-super-habit-tracker
npm install
npm run dev
```

Open `http://localhost:5173` to view the app standalone (uses a dark fallback theme outside Standard Notes).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

### Tech Stack

- **React 19** + **TypeScript 5.9**
- **Vite 7** — bundler and dev server
- **Standard Notes Editor API** — iframe communication via `postMessage`
- No UI framework — custom CSS with CSS variables for SN theme integration

### Project Structure

```
src/
  components/
    Header.tsx              # Top bar: view toggle, year display, add button
    HabitTracker.tsx         # Main orchestrator: state, CRUD, navigation
    HabitSidebar.tsx         # Sidebar with habit list, groups, drag-and-drop
    HabitModal.tsx           # Add/edit habit form
    GroupModal.tsx           # Add/edit group form
    HabitDetail.tsx          # Habit stats panel (streaks, charts)
    YearSetup.tsx            # Initial year picker on first launch
    views/
      YearView.tsx           # 12-month heatmap grid
      YearTimelineView.tsx   # Horizontal scrolling timeline (all habits x all days)
      MonthView.tsx          # Single month calendar
      WeekView.tsx           # 7-day grid with all habits
      DayView.tsx            # Single day checklist
    shared/
      Modal.tsx, ConfirmDialog.tsx, ExportMenu.tsx, ...
  lib/
    sn-api.ts               # Standard Notes iframe bridge
    calendar.ts             # Date utilities, week numbers
    stats.ts                # Streak and completion calculations
    export-*.ts             # CSV, Markdown, XLSX, PDF exporters
    icons.tsx               # Lucide icon set
    colors.ts               # Hex-to-rgba utility
  types/
    habit.ts                # TypeScript interfaces (Habit, HabitGroup, HabitEntry, etc.)
  styles.css                # All styles (single file, ~2200 lines)
```

## Deployment

Pushes to `master` trigger a GitHub Actions workflow that builds and deploys to the `gh-pages` branch. The plugin URL auto-updates for all Standard Notes users who installed it.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`-`5` | Switch view (Year, Timeline, Month, Week, Day) |
| `N` | New habit |
| `Arrow Up/Down` | Select previous/next habit |
| `Arrow Left/Right` | Navigate month/week/day |
| `Enter` | Open habit detail |
| `Escape` | Close panel/modal |
| `?` | Toggle shortcuts help |

## License

MIT
