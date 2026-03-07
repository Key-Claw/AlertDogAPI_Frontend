// 1. Modal generico para formularios de alta/edicion
export default function Modal({ open, title, children }) {
  // 2. No renderizar si el modal esta cerrado
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/60 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">{title}</h3>
        {children}
      </div>
    </div>
  );
}