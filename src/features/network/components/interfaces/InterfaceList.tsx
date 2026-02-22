import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { openAddInterface, openEditInterface } from '../../networkSlice';
import { useInterfaces } from '../../hooks/useInterfaces';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { Modal } from '../../../../components/common/Modal';
import { DataTable, type Column } from '../../../../components/common/DataTable';
import { InterfaceForm } from './InterfaceForm';
import type { NetworkInterface } from '../../../../types/network';

export function InterfaceList() {
  const dispatch = useAppDispatch();
  const { interfaceModalOpen, selectedInterfaceId } = useAppSelector(s => s.network);
  const { data: interfaces = [], isLoading } = useInterfaces();

  const selected = interfaces.find(i => i.id === selectedInterfaceId);

  const columns: Column<NetworkInterface>[] = [
    {
      key: 'name', header: 'Name',
      render: row => <span style={{ fontWeight: 600 }}>{row.name}</span>,
    },
    { key: 'type', header: 'Type', render: row => <span style={{ textTransform: 'capitalize' }}>{row.type}</span> },
    {
      key: 'ipAddress', header: 'IP Address',
      render: row => <span className="mono">{row.ipAddress || '—'}</span>,
    },
    { key: 'subnetMask', header: 'Mask', render: row => <span className="mono">{row.subnetMask || '—'}</span> },
    { key: 'zone', header: 'Zone', render: row => <span style={{ textTransform: 'capitalize' }}>{row.zone}</span> },
    {
      key: 'status', header: 'Status',
      render: row => (
        <Badge variant={row.status === 'up' ? 'success' : 'error'} dot>
          {row.status.toUpperCase()}
        </Badge>
      ),
    },
    { key: 'mtu', header: 'MTU' },
    {
      key: 'actions', header: 'Actions',
      render: row => (
        <div className="actions">
          <Button size="sm" variant="ghost" onClick={() => dispatch(openEditInterface(row.id))}>Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => dispatch({ type: 'network/deleteInterface', payload: row.id })}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Network Interfaces"
        subtitle="Configure physical and virtual network interfaces"
        actions={
          <Button variant="primary" onClick={() => dispatch(openAddInterface())}>
            + Add Interface
          </Button>
        }
      />

      <div className="card">
        <DataTable columns={columns} data={interfaces} rowKey="id" loading={isLoading} />
      </div>

      <Modal
        open={interfaceModalOpen}
        title={selected ? `Edit Interface — ${selected.name}` : 'Add Interface'}
        onClose={() => dispatch({ type: 'network/closeInterfaceModal' })}
      >
        <InterfaceForm initial={selected} />
      </Modal>
    </div>
  );
}
