import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-xl rounded-2xl border border-white/70 bg-white/90 p-8 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.25em] text-brand-700">Error de ruta</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-600">La pagina que buscas no existe o fue movida.</p>
      <Link to="/" className="mt-5 inline-flex rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white">
        Volver al inicio
      </Link>
    </section>
  );
}