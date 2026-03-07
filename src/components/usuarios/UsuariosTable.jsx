// 1. Tabla de usuarios con acciones CRUD
import Table from '../common/Table.jsx';
import Button from '../common/Button.jsx';

// 2. Definicion de columnas base
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'rol', label: 'Rol', render: (row) => (String(row.rol) === '1' ? 'Admin' : 'Usuario') },
  { key: 'nombre', label: 'Nombre' },
  { key: 'apellido', label: 'Apellido' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Telefono' },
];

export default function UsuariosTable({ rows, onEdit, onDelete }) {
  // 3. Extender columnas con bloque de acciones
  const columnsWithActions = [
    ...columns,
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" className="px-3 py-1.5" onClick={() => onEdit(row)}>
            Editar
          </Button>
          <Button variant="danger" className="px-3 py-1.5" onClick={() => onDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return <Table columns={columnsWithActions} rows={rows} />;
}