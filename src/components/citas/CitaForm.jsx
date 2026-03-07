// 1. Formulario de citas (alta/edicion)
import React from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import Select from '../common/Select.jsx';

// 2. Estado inicial para creacion
const emptyForm = {
  fecha: '',
  hora: '',
  id_perro: '',
};

// 3. Adaptar datos existentes a estado de formulario
function toFormState(initialData) {
  if (!initialData) return emptyForm;

  return {
    fecha: initialData.fecha?.slice(0, 10) ?? '',
    hora: initialData.hora?.slice(0, 5) ?? '',
    id_perro: String(initialData.id_perro ?? ''),
  };
}

export default function CitaForm({ initialData, perros = [], onSubmit, onCancel, submitting }) {
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
        <Input name="fecha" label="Fecha" type="date" value={formState.fecha} onChange={handleChange} required />
        <Input name="hora" label="Hora" type="time" value={formState.hora} onChange={handleChange} required />
      </div>

      <Select
        name="id_perro"
        label="Perro"
        value={formState.id_perro}
        onChange={handleChange}
        required
        options={[
          { value: '', label: 'Selecciona un perro' },
          ...perros.map((perro) => ({
            value: String(perro.id),
            label: `${perro.nombre} (${perro.raza})`,
          })),
        ]}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initialData ? 'Actualizar cita' : 'Crear cita'}
        </Button>
      </div>
    </form>
  );
}