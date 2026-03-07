export default function Input(props) {
  return (
    <input
      style={{
        width: '100%',
        padding: '0.55rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #cfd6dc',
      }}
      {...props}
    />
  );
}