import { useState, useEffect, useRef } from 'react';
import type { HabitTrackerData } from '../../types/habit.ts';
import { exportCSV } from '../../lib/export-csv.ts';
import { exportMarkdown } from '../../lib/export-md.ts';
import { exportXlsx } from '../../lib/export-xlsx.ts';
import { exportPdf } from '../../lib/export-pdf.ts';

interface ExportMenuProps {
  data: HabitTrackerData;
}

const CsvIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="1" width="12" height="14" rx="2"/><line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="9" y2="11"/>
  </svg>
);
const MdIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="1" y="3" width="14" height="10" rx="2"/><polyline points="4,9 6,7 8,9"/><line x1="10" y1="7" x2="10" y2="9"/><line x1="12" y1="7" x2="12" y2="9"/>
  </svg>
);
const XlsxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="1" width="12" height="14" rx="2"/><line x1="2" y1="5" x2="14" y2="5"/><line x1="2" y1="9" x2="14" y2="9"/><line x1="7" y1="5" x2="7" y2="15"/>
  </svg>
);
const PdfIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M10 1H4a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5L10 1z"/><polyline points="10,1 10,5 14,5"/>
  </svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="2" x2="8" y2="10"/><polyline points="4,7 8,11 12,7"/><line x1="2" y1="14" x2="14" y2="14"/>
  </svg>
);

export function ExportMenu({ data }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="export-menu" ref={ref}>
      <button
        className="ht-icon-btn"
        onClick={() => setOpen(!open)}
        title="Export"
      >
        <DownloadIcon />
      </button>
      {open && (
        <div className="export-dropdown">
          <button onClick={() => { exportCSV(data); setOpen(false); }}>
            <CsvIcon /> CSV
          </button>
          <button onClick={() => { exportMarkdown(data); setOpen(false); }}>
            <MdIcon /> Markdown
          </button>
          <button onClick={() => { exportXlsx(data); setOpen(false); }}>
            <XlsxIcon /> Excel
          </button>
          <button onClick={() => { exportPdf(data); setOpen(false); }}>
            <PdfIcon /> PDF
          </button>
        </div>
      )}
    </div>
  );
}
