import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

export default function PerroForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <Input name="nombre" placeholder="Nombre del perro" />
      <Input name="raza" placeholder="Raza" />
      <Button type="submit">Guardar perro</Button>
    </form>
  );
}