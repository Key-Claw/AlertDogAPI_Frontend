// 1. Pagina de gestion de perros con relacion a usuarios
import { useMemo, useState } from 'react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import usePerros from '../hooks/usePerros.js';
import useUsuarios from '../hooks/useUsuarios.js';
import PerroForm from '../components/perros/PerroForm.jsx';
import PerrosTable from '../components/perros/PerrosTable.jsx';
import { getHttpErrorMessage } from '../utils/httpErrors.js';

export default function PerrosPage() {
  // 2. Estado de dominio y estado local de UI
  const { perros, loading, createPerro, updatePerro, removePerro } = usePerros();
  const { usuarios, loading: usuariosLoading } = useUsuarios();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerro, setEditingPerro] = useState(null);

  // 3. Mapa para resolver nombre de usuario por id
  const usuariosMap = useMemo(() => {
    return usuarios.reduce((acc, usuario) => {
      acc[usuario.id] = `${usuario.nombre} ${usuario.apellido}`;
      return acc;
    }, {});
  }, [usuarios]);

  // 4. Datos preparados para tabla
  const tableRows = useMemo(() => {
    return perros.map((perro) => ({
      ...perro,
      usuario: usuariosMap[perro.id_usuario] || 'Sin usuario',
    }));
  }, [perros, usuariosMap]);

  const openCreate = () => {
    setEditingPerro(null);
    setModalOpen(true);
  };

  const openEdit = (perro) => {
    setEditingPerro(perro);
    setModalOpen(true);
  };

  // 5. Guardar (crear o editar) perro
  const handleSubmit = async (formState) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formState,
        genero: Number(formState.genero),
        id_usuario: Number(formState.id_usuario),
      };

      if (!payload.fecha_de_nacimiento) {
        delete payload.fecha_de_nacimiento;
      }

      if (editingPerro) {
        await updatePerro(editingPerro.id, payload);
      } else {
        await createPerro(payload);
      }

      setModalOpen(false);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Eliminar perro con confirmacion
  const handleDelete = async (id) => {
    if (!window.confirm('Seguro que deseas eliminar este perro?')) return;
    setError('');
    try {
      await removePerro(id);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    }
  };

  // 7. Render de la pagina
  const pageLoading = loading || usuariosLoading;

  return (
    <section className="space-y-4">
      <div className="card flex items-center justify-between p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Gestion de perros</h2>
          <p className="text-sm text-slate-500">Registra perros de alerta y su responsable.</p>
        </div>
        <Button onClick={openCreate}>Nuevo perro</Button>
      </div>

      <ErrorBanner message={error} />
      {pageLoading ? <Loader /> : null}

      {!pageLoading && tableRows.length === 0 ? (
        <EmptyState title="No hay perros" description="Crea el primer perro para comenzar." />
      ) : null}

      {!pageLoading && tableRows.length > 0 ? (
        <PerrosTable rows={tableRows} onEdit={openEdit} onDelete={handleDelete} />
      ) : null}

      <Modal open={modalOpen} title={editingPerro ? 'Editar perro' : 'Crear perro'}>
        <PerroForm
          initialData={editingPerro}
          usuarios={usuarios}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}