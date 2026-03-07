// 1. Input reutilizable con etiqueta opcional
export default function Input({ label, className = '', ...props }) {
  return (
    <label className="grid gap-1.5">
      {label ? <span className="text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        className={[
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm',
          'outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100',
          className,
        ].join(' ')}
        {...props}
      />
    </label>
  );
}