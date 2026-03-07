// 1. Tabla generica con soporte para render personalizado por columna
export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
          {/* 2. Header dinamico basado en definicion de columnas */}
          {columns.map((column) => (
            <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
              {column.label}
            </th>
          ))}
          </tr>
        </thead>
        <tbody>
          {/* 3. Body dinamico con fallback a valor directo por key */}
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}