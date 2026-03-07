// 1. Sidebar de navegacion para escritorio
import { NavLink } from 'react-router-dom';
import { APP_SUBTITLE, NAV_LINKS } from '../../utils/constants.js';
import logo from '../../assets/images/logo.svg';

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-white/50 bg-white/70 p-6 backdrop-blur lg:flex">
      <div className="mb-8">
        <img src={logo} alt="Dulces Detectores" className="mb-3 h-16 w-auto" />
        <p className="text-xs uppercase tracking-[0.2em] text-brand-700">{APP_SUBTITLE}</p>
      </div>
      {/* 2. Mapa de enlaces principales de la aplicacion */}
      <nav className="grid gap-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-700 text-white shadow-soft'
                  : 'bg-white/70 text-slate-700 hover:bg-brand-100 hover:text-brand-800',
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}