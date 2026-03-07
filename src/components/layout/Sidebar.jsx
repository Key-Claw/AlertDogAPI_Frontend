import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../utils/constants.js';

const links = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD },
  { label: 'Usuarios', to: ROUTES.USUARIOS },
  { label: 'Perros', to: ROUTES.PERROS },
  { label: 'Citas', to: ROUTES.CITAS },
];

export default function Sidebar() {
  return (
    <aside style={{ width: 240, padding: '1rem', background: 'var(--color-primary)', color: '#fff' }}>
      <nav style={{ display: 'grid', gap: '0.75rem' }}>
        {links.map((link) => (
          <NavLink key={link.to} to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}