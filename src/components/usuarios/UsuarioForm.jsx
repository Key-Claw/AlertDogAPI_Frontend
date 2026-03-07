import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

export default function UsuarioForm({ onSubmit }) {
  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
      <Input name="nombre" placeholder="Nombre" />
      <Input name="email" placeholder="Email" />
      <Button type="submit">Guardar usuario</Button>
    </form>
  );
}