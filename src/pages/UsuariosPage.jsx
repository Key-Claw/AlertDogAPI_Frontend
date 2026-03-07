// 1. Pagina de gestion de usuarios con formulario modal
import { useState } from 'react';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorBanner from '../components/common/ErrorBanner.jsx';
import Loader from '../components/common/Loader.jsx';
import Modal from '../components/common/Modal.jsx';
import useUsuarios from '../hooks/useUsuarios.js';
import UsuariosTable from '../components/usuarios/UsuariosTable.jsx';
import UsuarioForm from '../components/usuarios/UsuarioForm.jsx';
import { getHttpErrorMessage } from '../utils/httpErrors.js';

export default function UsuariosPage() {
  // 2. Estado de dominio y estado local de UI
  const { usuarios, loading, createUsuario, updateUsuario, removeUsuario } = useUsuarios();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  // 3. Abrir modal en modo creacion
  const openCreate = () => {
    setEditingUsuario(null);
    setModalOpen(true);
  };

  // 4. Abrir modal en modo edicion
  const openEdit = (usuario) => {
    setEditingUsuario(usuario);
    setModalOpen(true);
  };

  // 5. Guardar (crear o editar) usuario
  const handleSubmit = async (formState) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...formState,
        rol: Number(formState.rol),
      };

      if (editingUsuario) {
        if (!payload.password) {
          delete payload.password;
        }
        await updateUsuario(editingUsuario.id, payload);
      } else {
        await createUsuario(payload);
      }

      setModalOpen(false);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  // 6. Eliminar usuario con confirmacion
  const handleDelete = async (id) => {
    if (!window.confirm('Seguro que deseas eliminar este usuario?')) return;
    setError('');
    try {
      await removeUsuario(id);
    } catch (err) {
      setError(getHttpErrorMessage(err));
    }
  };

  // 7. Render de la pagina
  return (
    <section className="space-y-4">
      <div className="card flex items-center justify-between p-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Gestion de usuarios</h2>
          <p className="text-sm text-slate-500">Administra perfiles, roles y contacto.</p>
        </div>
        <Button onClick={openCreate}>Nuevo usuario</Button>
      </div>

      <ErrorBanner message={error} />
      {loading ? <Loader /> : null}

      {!loading && usuarios.length === 0 ? (
        <EmptyState title="No hay usuarios" description="Crea el primer usuario para comenzar." />
      ) : null}

      {!loading && usuarios.length > 0 ? (
        <UsuariosTable rows={usuarios} onEdit={openEdit} onDelete={handleDelete} />
      ) : null}

      <Modal open={modalOpen} title={editingUsuario ? 'Editar usuario' : 'Crear usuario'}>
        <UsuarioForm
          initialData={editingUsuario}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </section>
  );
}