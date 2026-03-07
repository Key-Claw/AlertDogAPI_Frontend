// 1. Pagina de gestion de citas vinculadas a perros
import { useMemo, useState } from 'react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import CitaForm from '../components/citas/CitaForm.jsx';
import CitasTable from '../components/citas/CitasTable.jsx';
import useCitas from '../hooks/useCitas.js';
import usePerros from '../hooks/usePerros.js';
import { getHttpErrorMessage } from '../utils/httpErrors.js';

export default function CitasPage() {
  // 2. Estado de dominio y estado local de UI
  const { citas, loading, createCita, updateCita, removeCita } = useCitas();
  const { perros, loading: perrosLoading } = usePerros();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCita, setEditingCita] = useState(null);

  // 3. Mapa para resolver nombre de perro por id
  const perrosMap = useMemo(() => {
    return perros.reduce((acc, perro) => {
      acc[perro.id] = perro.nombre;
      return acc;
    }, {});
  }, [perros]);

  // 4. Datos preparados para tabla
  const tableRows = useMemo(() => {
    return citas.map((cita) => ({
      ...cita,
      perro: perrosMap[cita.id_perro] || `Perro #${cita.id_perro}`,
    }));
  }, [citas, perrosMap]);

  const openCreate = () => {
    setEditingCita(null);
    setModalOpen(true);
  };

  const openEdit = (cita) => {
    setEditingCita(cita);
    setModalOpen(true);
  };

  // 5. Guardar (crear o editar) cita
  const handleSubmit = async (formState) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formState,
        id_perro: Number(formState.id_perro),
      };

      if (editingCita) {
        await updateCita(editingCita.id, payload);
      } else {
        await createCita(payload);
      }

      setModalOpen(false);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Eliminar cita con confirmacion
  const handleDelete = async (id) => {
    if (!window.confirm('Seguro que deseas eliminar esta cita?')) return;
    setError('');
    try {
      await removeCita(id);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    }
  };

  // 7. Render de la pagina
  const pageLoading = loading || perrosLoading;

  return (
    <section className="space-y-4">
      <div className="card flex items-center justify-between p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Gestion de citas</h2>
          <p className="text-sm text-slate-500">Planifica atenciones por fecha y hora.</p>
        </div>
        <Button onClick={openCreate}>Nueva cita</Button>
      </div>

      <ErrorBanner message={error} />
      {pageLoading ? <Loader /> : null}

      {!pageLoading && tableRows.length === 0 ? (
        <EmptyState title="No hay citas" description="Programa la primera cita para comenzar." />
      ) : null}

      {!pageLoading && tableRows.length > 0 ? (
        <CitasTable rows={tableRows} onEdit={openEdit} onDelete={handleDelete} />
      ) : null}

      <Modal open={modalOpen} title={editingCita ? 'Editar cita' : 'Crear cita'}>
        <CitaForm
          initialData={editingCita}
          perros={perros}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}