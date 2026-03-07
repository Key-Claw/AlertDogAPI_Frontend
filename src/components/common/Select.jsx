// 1. Select reutilizable con opciones dinamicas
export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <label className="grid gap-1.5">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <select
        className={[
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm',
          'outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
          className,
        ].join(' ')}
        {...props}
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