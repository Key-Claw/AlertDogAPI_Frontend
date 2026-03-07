export default function EmptyState({ title = 'Sin datos', description = 'No hay informacion para mostrar.' }) {
  return (
    <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}