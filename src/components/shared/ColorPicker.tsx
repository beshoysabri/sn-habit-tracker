import { useRef } from 'react';
import { HABIT_COLORS } from '../../lib/colors.ts';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const normalizedValue = value?.toLowerCase() ?? '';
  const isPreset = HABIT_COLORS.some(c => c.hex.toLowerCase() === normalizedValue);

  return (
    <div className="color-picker">
      <div
        className="color-preview"
        style={{ background: value || '#888' }}
        title={HABIT_COLORS.find(c => c.hex.toLowerCase() === normalizedValue)?.name ?? 'Custom'}
      />
      {HABIT_COLORS.map(c => (
        <button
          key={c.hex}
          type="button"
          className={`color-swatch ${normalizedValue === c.hex.toLowerCase() ? 'selected' : ''}`}
          style={{ background: c.hex }}
          onClick={() => onChange(c.hex)}
          title={c.name}
        />
      ))}
      <button
        type="button"
        className={`color-swatch custom-color ${!isPreset && value ? 'selected' : ''}`}
        onClick={() => inputRef.current?.click()}
        title="Custom color"
        style={!isPreset && value ? { background: value } : undefined}
      >
        {(isPreset || !value) && <span style={{ fontSize: 14, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))', fontWeight: 700 }}>+</span>}
      </button>
      <input
        ref={inputRef}
        type="color"
        className="hidden-color-input"
        value={value || '#32769B'}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
