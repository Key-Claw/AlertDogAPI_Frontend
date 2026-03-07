// 1. Tabla de perros con acciones CRUD
import Table from '../common/Table.jsx';
import Button from '../common/Button.jsx';

// 2. Definicion de columnas base
const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'raza', label: 'Raza' },
  { key: 'genero', label: 'Genero', render: (row) => (String(row.genero) === '1' ? 'Macho' : 'Hembra') },
  {
    key: 'fecha_de_nacimiento',
    label: 'Nacimiento',
    render: (row) => row.fecha_de_nacimiento?.slice(0, 10) || '-',
  },
  { key: 'usuario', label: 'Responsable' },
];

export default function PerrosTable({ rows, onEdit, onDelete }) {
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