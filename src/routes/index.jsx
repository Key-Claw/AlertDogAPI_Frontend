// 1. Definicion de rutas principales de la app
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout.jsx';
import CitasPage from '../pages/CitasPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import PerrosPage from '../pages/PerrosPage.jsx';
import UsuariosPage from '../pages/UsuariosPage.jsx';
import { ROUTES } from '../utils/constants.js';

export default function AppRoutes() {
  return (
    // 2. Rutas protegidas por layout + fallback 404
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.USUARIOS} element={<UsuariosPage />} />
        <Route path={ROUTES.PERROS} element={<PerrosPage />} />
        <Route path={ROUTES.CITAS} element={<CitasPage />} />
      </Route>
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}