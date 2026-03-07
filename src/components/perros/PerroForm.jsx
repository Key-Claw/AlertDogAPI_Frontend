// 1. Formulario de perros (alta/edicion)
import React from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

// 2. Estado inicial para creacion
const emptyForm = {
  nombre: '',
  raza: '',
  genero: '0',
  fecha_de_nacimiento: '',
  id_usuario: '',
};

// 3. Adaptar datos existentes a estado de formulario
function toFormState(initialData) {
  if (!initialData) return emptyForm;

  return {
    nombre: initialData.nombre ?? '',
    raza: initialData.raza ?? '',
    genero: String(initialData.genero ?? 0),
    fecha_de_nacimiento: initialData.fecha_de_nacimiento?.slice(0, 10) ?? '',
    id_usuario: String(initialData.id_usuario ?? ''),
  };
}

export default function PerroForm({ initialData, usuarios = [], onSubmit, onCancel, submitting }) {
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
        <Input name="nombre" label="Nombre" value={formState.nombre} onChange={handleChange} required />
        <Input name="raza" label="Raza" value={formState.raza} onChange={handleChange} required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          name="genero"
          label="Genero"
          value={formState.genero}
          onChange={handleChange}
          options={[
            { value: '1', label: 'Macho' },
            { value: '0', label: 'Hembra' },
          ]}
        />
        <Input
          name="fecha_de_nacimiento"
          label="Fecha de nacimiento"
          type="date"
          value={formState.fecha_de_nacimiento}
          onChange={handleChange}
        />
      </div>

      <Select
        name="id_usuario"
        label="Usuario responsable"
        value={formState.id_usuario}
        onChange={handleChange}
        required
        options={[
          { value: '', label: 'Selecciona un usuario' },
          ...usuarios.map((usuario) => ({
            value: String(usuario.id),
            label: `${usuario.nombre} ${usuario.apellido}`,
          })),
        ]}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData ? 'Actualizar perro' : 'Crear perro'}
        </Button>
      </div>
    </form>
  );
}