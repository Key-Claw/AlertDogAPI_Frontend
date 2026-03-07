export default function Table({ columns = [], rows = [] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)' }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} style={{ textAlign: 'left', borderBottom: '1px solid #dbe2e8', padding: '0.75rem' }}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id ?? index}>
            {columns.map((column) => (
              <td key={column.key} style={{ padding: '0.75rem', borderBottom: '1px solid #eef2f5' }}>
                {row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}