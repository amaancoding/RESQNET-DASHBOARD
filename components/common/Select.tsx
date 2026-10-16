interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <label className="block min-w-[140px]">
      <span className="mb-1 block text-[11px] font-semibold tracking-wide text-muted uppercase">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-line bg-navy-950 px-3 py-2 text-sm text-ink outline-none focus:border-cyan/40 focus:ring-1 focus:ring-cyan/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
