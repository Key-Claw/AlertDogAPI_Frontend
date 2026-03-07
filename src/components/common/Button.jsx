export default function Button({ type = 'button', children, ...props }) {
  return (
    <button
      type={type}
      style={{
        border: 'none',
        borderRadius: 'var(--radius-md)',
        padding: '0.55rem 0.9rem',
        background: 'var(--color-accent)',
        cursor: 'pointer',
      }}
      {...props}
    >
      {children}
    </button>
  );
}