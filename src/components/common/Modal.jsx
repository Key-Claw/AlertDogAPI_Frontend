export default function Modal({ open, title, children }) {
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.35)', display: 'grid', placeItems: 'center' }}>
      <div style={{ minWidth: 320, padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--color-surface)' }}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}