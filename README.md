# Habit Tracker

A powerful, full-featured habit tracking editor for [Standard Notes](https://standardnotes.com). Track daily habits with heatmap calendars, timeline views, streaks, analytics, and detailed statistics -- all stored securely inside your encrypted notes.

Six distinct views. Boolean and counter tracking. Streaks, analytics, and export. Zero external dependencies. Your data never leaves Standard Notes.

## Install

Open Standard Notes, navigate to **Preferences > General > Advanced Settings > Install Custom Plugin**, and paste:

```
https://beshoysabri.github.io/sn-habit-tracker/ext.json
```

Then create a new note and select **Habit Tracker** as the editor.

---

## Features

### Views

| View | Description |
|------|-------------|
| **Year** | 12-month heatmap calendar with color-coded completion intensity |
| **Year Timeline** | Horizontal scrolling grid of all habits across all days |
| **Month** | Single month calendar with daily habit status |
| **Week** | 7-day grid displaying all habits at a glance |
| **Day** | Single day checklist for focused daily review |
| **Analytics** | Dashboard with metrics, charts, and performance insights |

### Tracking

- **Boolean tracking** -- Mark habits as done, skipped, or missed
- **Counter tracking** -- Track numeric values with configurable targets and units
- **Flexible frequency** -- Daily, specific days of the week, or custom schedules
- **Start dates** -- Define when each habit begins for accurate completion calculations
- **Entry notes** -- Attach notes to individual entries for context and reflection
- **Timestamps** -- Automatic timestamps on every entry

### Organization

- **Habit groups** -- Organize habits into color-coded groups
- **Drag-and-drop reorder** -- Arrange habits and groups in any order
- **50+ icons** -- Choose from a curated icon set for each habit
- **Custom colors** -- Assign colors to habits and groups
- **Archive and unarchive** -- Keep completed or paused habits out of the way without deleting them
- **Name and description** -- Add context to every habit

### Analytics Dashboard

- **Overall completion rate** -- Percentage across all active habits
- **Active and archived counts** -- At-a-glance habit inventory
- **Total days tracked** -- Lifetime tracking duration
- **Best streak** -- Longest consecutive completion across all habits
- **Today's progress** -- Real-time daily completion status
- **Completion trend chart** -- 90-day line graph showing trajectory over time
- **Group performance bars** -- Visual comparison across habit groups
- **Top performers** -- Ranking of highest-completion habits
- **Streak leaders** -- Habits with the longest active streaks
- **Needs attention** -- Habits below 50% completion flagged for review
- **Day of week heatmap** -- Performance patterns by weekday

### Export

| Format | Description |
|--------|-------------|
| **CSV** | Comma-separated values for spreadsheets and data analysis |
| **Markdown** | Formatted text for notes and documentation |
| **Excel (.xlsx)** | Native Excel workbook with structured data |
| **PDF** | Printable document via jsPDF |
| **PNG** | Screenshot capture of the current view |

### Additional

- **Theme-aware** -- Adapts to Standard Notes light and dark themes via CSS variables
- **Fully responsive** -- Optimized for desktop, tablet, and mobile with a slide-in sidebar drawer
- **Calendar week numbers** -- ISO week numbers displayed in all calendar views
- **Zero external services** -- All data lives entirely within your Standard Notes note

---

## Tech Stack

| Technology | Role |
|------------|------|
| React 19 | UI framework |
| TypeScript 5.9 | Type safety |
| Vite 7 | Bundler and dev server |
| Recharts | Data visualization and charts |
| jsPDF | PDF export generation |
| xlsx | Excel workbook export |
| uuid | Unique identifier generation |
| Standard Notes Editor API | iframe communication via `postMessage` |

No UI framework. Custom CSS with CSS variables for native Standard Notes theme integration.

---

## Installation

### From Standard Notes (recommended)

1. Open Standard Notes
2. Go to **Preferences > General > Advanced Settings**
3. Scroll to **Install Custom Plugin**
4. Paste the install URL:
   ```
   https://beshoysabri.github.io/sn-habit-tracker/ext.json
   ```
5. Click **Install**
6. Create a new note and select **Habit Tracker** as the editor

### From Source

```bash
git clone https://github.com/beshoysabri/sn-habit-tracker.git
cd sn-habit-tracker
npm install
npm run build
```

The production build outputs to `dist/`. Point a Standard Notes custom plugin configuration at the built `index.html`.

---

## Development

### Prerequisites

- Node.js 22+
- npm

### Setup

```bash
git clone https://github.com/beshoysabri/sn-habit-tracker.git
cd sn-habit-tracker
npm install
npm run dev
```

Open `http://localhost:5173` to view the app standalone. A dark fallback theme is applied automatically when running outside Standard Notes.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Type-check and produce a production build to `dist/` |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Preview the production build locally |

### Local Development with Standard Notes

During development, the app runs standalone at `localhost:5173` with a mock theme. To test inside Standard Notes, run `npm run build`, serve the `dist/` directory, and point a custom plugin URL at your local server.

---

## Deployment

Pushes to `master` trigger a GitHub Actions workflow that builds the project and deploys to the `gh-pages` branch. The plugin URL auto-updates for all Standard Notes users who have installed it.

---

## Project Structure

```
src/
  App.tsx                       # Root component
  main.tsx                      # Entry point
  styles.css                    # All styles (single file, CSS variables)
  components/
    Header.tsx                  # Top bar: view toggle, year display, add button
    HabitTracker.tsx            # Main orchestrator: state, CRUD, navigation
    HabitSidebar.tsx            # Sidebar with habit list, groups, drag-and-drop
    HabitModal.tsx              # Add/edit habit form
    GroupModal.tsx              # Add/edit group form
    HabitDetail.tsx             # Habit stats panel (streaks, charts)
    YearSetup.tsx               # Initial year picker on first launch
    views/
      YearView.tsx              # 12-month heatmap grid
      YearTimelineView.tsx      # Horizontal scrolling timeline
      MonthView.tsx             # Single month calendar
      WeekView.tsx              # 7-day grid with all habits
      DayView.tsx               # Single day checklist
      AnalyticsView.tsx         # Analytics dashboard with metrics and charts
    shared/
      Modal.tsx                 # Reusable modal component
      ConfirmDialog.tsx         # Confirmation dialog
      ExportMenu.tsx            # Export format selector
      HabitChart.tsx            # Recharts line/bar chart wrapper
      IconPicker.tsx            # Icon selection grid
      ColorPicker.tsx           # Color selection palette
      StatsCard.tsx             # Metric display card
      ShortcutsHelp.tsx         # Keyboard shortcuts overlay
      Linkify.tsx               # Auto-link URLs in text
  lib/
    sn-api.ts                   # Standard Notes iframe bridge
    calendar.ts                 # Date utilities, week numbers
    stats.ts                    # Streak, completion, and analytics calculations
    data.ts                     # Data persistence and serialization
    colors.ts                   # Color palette and utilities
    icons.tsx                   # SVG icon set (50+ icons)
    export-csv.ts               # CSV exporter
    export-md.ts                # Markdown exporter
    export-xlsx.ts              # Excel workbook exporter
    export-pdf.ts               # PDF document exporter
  types/
    habit.ts                    # TypeScript interfaces (Habit, HabitGroup, HabitEntry)
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1` | Switch to Year view |
| `2` | Switch to Year Timeline view |
| `3` | Switch to Month view |
| `4` | Switch to Week view |
| `5` | Switch to Day view |
| `6` | Switch to Analytics view |
| `N` | Create new habit |
| `Up / Down` | Select previous / next habit |
| `Left / Right` | Navigate to previous / next time period |
| `Enter` | Open habit detail panel |
| `Escape` | Close active panel or modal |
| `?` | Toggle keyboard shortcuts help |

---

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a pull request

---

## License

[MIT](LICENSE)
