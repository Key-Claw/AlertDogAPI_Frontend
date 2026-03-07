export default function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: '#ffe8e8', color: '#7d1b1b' }}>
      {message}
    </div>
  );
}