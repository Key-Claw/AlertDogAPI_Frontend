// 1. Dashboard con metricas de usuarios, perros y citas
import { useEffect, useState } from 'react';
import { citasApi } from '../api/citasApi.js';
import { perrosApi } from '../api/perrosApi.js';
import { usuariosApi } from '../api/usuariosApi.js';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import Loader from '../components/common/Loader.jsx';
import { getHttpErrorMessage } from '../utils/httpErrors.js';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ usuarios: 0, perros: 0, citas: 0 });

  // 2. Carga inicial de estadisticas del panel
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [usuarios, perros, citas] = await Promise.all([
          usuariosApi.getAll(),
          perrosApi.getAll(),
          citasApi.getAll(),
        ]);

        setStats({ usuarios: usuarios.length, perros: perros.length, citas: citas.length });
      } catch (err) {
        setError(getHttpErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // 3. Definir tarjetas visuales de resumen
  const cards = [
    { label: 'Usuarios activos', value: stats.usuarios, color: 'from-brand-700 to-brand-500' },
    { label: 'Perros registrados', value: stats.perros, color: 'from-sky-600 to-cyan-500' },
    { label: 'Citas programadas', value: stats.citas, color: 'from-emerald-600 to-lime-500' },
  ];

  // 4. Render del dashboard
  return (
    <section className="space-y-6">
      <div className="card p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-700">Vision general</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-800">Panel de operacion AlertDog</h2>
        <p className="mt-2 text-sm text-slate-600">
          Gestiona usuarios, perros de alerta y citas desde una misma consola.
        </p>
      </div>

      <ErrorBanner message={error} />
      {loading ? <Loader /> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className={`rounded-2xl bg-gradient-to-br ${card.color} p-5 text-white shadow-soft`}>
            <p className="text-sm/5 text-white/85">{card.label}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}