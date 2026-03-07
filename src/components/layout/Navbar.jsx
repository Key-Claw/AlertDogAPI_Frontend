import { APP_NAME } from '../../utils/constants.js';

export default function Navbar() {
  return (
    <header style={{ background: 'var(--color-surface)', padding: '1rem', boxShadow: 'var(--shadow-sm)' }}>
      <strong>{APP_NAME}</strong>
    </header>
  );
}