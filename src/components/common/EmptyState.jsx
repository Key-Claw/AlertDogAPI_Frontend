// 1. Estado vacio reutilizable cuando no hay registros
export default function EmptyState({ title = 'Sin datos', description = 'No hay informacion para mostrar.' }) {
  return (
    <div className="card p-6 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}