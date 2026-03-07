export default function formatDate(inputDate) {
  if (!inputDate) return '';

  const date = new Date(inputDate);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}