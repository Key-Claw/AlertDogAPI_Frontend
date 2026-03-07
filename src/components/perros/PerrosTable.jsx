import Table from '../common/Table.jsx';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'raza', label: 'Raza' },
];

export default function PerrosTable({ rows }) {
  return <Table columns={columns} rows={rows} />;
}