// 1. Formulario de usuarios (alta/edicion)
import React from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

// 2. Estado inicial para creacion
const emptyForm = {
  rol: '0',
  nombre: '',
  apellido: '',
  password: '',
  email: '',
  telefono: '',
};

// 3. Adaptar datos existentes a estado de formulario
function toFormState(initialData) {
  if (!initialData) return emptyForm;

  return {
    rol: String(initialData.rol ?? 0),
    nombre: initialData.nombre ?? '',
    apellido: initialData.apellido ?? '',
    password: '',
    email: initialData.email ?? '',
    telefono: initialData.telefono ?? '',
  };
}

export default function UsuarioForm({ initialData, onSubmit, onCancel, submitting }) {
  // 4. Estado local del formulario
  const [formState, setFormState] = React.useState(() => toFormState(initialData));

  // 5. Sincronizar al cambiar item en edicion
  React.useEffect(() => {
    setFormState(toFormState(initialData));
  }, [initialData]);

  // 6. Actualizar campos controlados
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // 7. Enviar al callback externo
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="rol"
          label="Rol"
          value={formState.rol}
          onChange={handleChange}
          options={[
            { value: '0', label: 'Usuario' },
            { value: '1', label: 'Admin' },
          ]}
        />
        <Input name="telefono" label="Telefono" value={formState.telefono} onChange={handleChange} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="nombre" label="Nombre" value={formState.nombre} onChange={handleChange} required />
        <Input name="apellido" label="Apellido" value={formState.apellido} onChange={handleChange} required />
      </div>

      <Input name="email" label="Email" type="email" value={formState.email} onChange={handleChange} required />
      <Input
        name="password"
        label={initialData ? 'Password (opcional para editar)' : 'Password'}
        type="password"
        value={formState.password}
        onChange={handleChange}
        required={!initialData}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData ? 'Actualizar usuario' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
}