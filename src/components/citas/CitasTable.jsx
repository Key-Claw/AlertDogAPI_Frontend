// 1. Tabla de citas con acciones CRUD
import Table from '../common/Table.jsx';
import Button from '../common/Button.jsx';

// 2. Definicion de columnas base
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fecha', label: 'Fecha', render: (row) => row.fecha?.slice(0, 10) || '-' },
  { key: 'hora', label: 'Hora', render: (row) => row.hora?.slice(0, 5) || '-' },
  { key: 'perro', label: 'Perro' },
];

export default function CitasTable({ rows, onEdit, onDelete }) {
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