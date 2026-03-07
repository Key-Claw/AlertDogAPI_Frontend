// 1. Layout principal con sidebar + navbar + contenedor de vistas
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import bgPattern from '../../assets/images/bg-pattern.svg';

export default function AppLayout() {
  return (
    // 2. Fondo visual de marca con patron reutilizable
    <div
      className="relative min-h-screen lg:flex"
      style={{ backgroundImage: `url(${bgPattern})`, backgroundSize: '220px 220px' }}
    >
      {/* 3. Capa de degradado para mejorar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-brand-50/70" />
      <Sidebar />
      <div className="relative flex-1">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}