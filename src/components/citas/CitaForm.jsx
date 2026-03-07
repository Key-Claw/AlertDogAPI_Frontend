import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

export default function CitaForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <Input name="fecha" placeholder="Fecha" type="date" />
      <Input name="motivo" placeholder="Motivo" />
      <Button type="submit">Guardar cita</Button>
    </form>
  );
}