type CalculatorFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
  step?: string;
  helperText?: string;
  options?: Array<{ label: string; value: string }>;
};

export function CalculatorField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  step,
  helperText,
  options,
}: CalculatorFieldProps) {
  return (
    <label className="block space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {options ? (
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 lg:px-3 lg:py-2.5"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 lg:px-3 lg:py-2.5"
        />
      )}
      {helperText ? <p className="text-xs font-normal text-slate-500">{helperText}</p> : null}
    </label>
  );
}
