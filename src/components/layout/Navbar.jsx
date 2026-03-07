// 1. Navbar superior con marca, fecha y navegacion movil
import { APP_NAME, APP_SUBTITLE } from '../../utils/constants.js';
import { NAV_LINKS } from '../../utils/constants.js';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  // 2. Fecha en formato legible para el panel
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-brand-700">{APP_SUBTITLE}</p>
          <h1 className="text-lg font-semibold text-slate-800">{APP_NAME} Control Center</h1>
        </div>
        <p className="text-sm text-slate-500 capitalize">{today}</p>
      </div>
      {/* 3. Navegacion compacta para pantallas pequenas */}
      <nav className="mt-3 flex gap-2 overflow-auto pb-1 lg:hidden">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap',
                isActive ? 'bg-brand-700 text-white' : 'bg-brand-50 text-brand-700',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}