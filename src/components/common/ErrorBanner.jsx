// 1. Banner de error reutilizable para feedback al usuario
export default function ErrorBanner({ message }) {
  // 2. No mostrar nada cuando no exista mensaje de error
  if (!message) return null;

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      {message}
    </div>
  );
}