export default function Select({ options = [], ...props }) {
  return (
    <select
      style={{
        width: '100%',
        padding: '0.55rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid #cfd6dc',
      }}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}