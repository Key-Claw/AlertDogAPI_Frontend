// 1. Variantes visuales del boton reutilizable
const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-300',
  secondary: 'bg-white text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50 focus-visible:ring-brand-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300',
};

// 2. Componente base para acciones en formularios y tablas
export default function Button({ type = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variants[variant] || variants.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}