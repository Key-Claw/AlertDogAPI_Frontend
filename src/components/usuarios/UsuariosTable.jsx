import Table from '../common/Table.jsx';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
];

export default function UsuariosTable({ rows }) {
  return <Table columns={columns} rows={rows} />;
}