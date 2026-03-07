import Table from '../common/Table.jsx';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'motivo', label: 'Motivo' },
];

export default function CitasTable({ rows }) {
  return <Table columns={columns} rows={rows} />;
}