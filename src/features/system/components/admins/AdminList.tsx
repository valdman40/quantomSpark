import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { openAddAdmin, closeAdminModal } from '../../systemSlice';
import { useAdmins } from '../../hooks/useSystem';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { Modal } from '../../../../components/common/Modal';
import { DataTable, type Column } from '../../../../components/common/DataTable';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import type { Administrator } from '../../../../types/system';

function statusVariant(s: string) {
  if (s === 'active') return 'success' as const;
  if (s === 'locked') return 'error' as const;
  return 'neutral' as const;
}
function permVariant(p: string) {
  if (p === 'super-user') return 'error' as const;
  if (p === 'network-admin') return 'warning' as const;
  return 'info' as const;
}

interface FormData { username: string; email: string; password: string; permission: Administrator['permission'] }

export function AdminList() {
  const dispatch = useAppDispatch();
  const { adminModalOpen, saving } = useAppSelector(s => s.system);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdmins();

  const admins = data?.pages.flatMap(p => p.data) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: { permission: 'read-only' },
  });
  const onSubmit = (data: FormData) => dispatch({ type: 'system/saveAdmin', payload: data });

  const columns: Column<Administrator>[] = [
    { key: 'username',   header: 'Username',   render: r => <span style={{ fontWeight: 600 }}>{r.username}</span> },
    { key: 'email',      header: 'Email'       },
    { key: 'permission', header: 'Permission', render: r => <Badge variant={permVariant(r.permission)}>{r.permission}</Badge> },
    { key: 'status',     header: 'Status',     render: r => <Badge variant={statusVariant(r.status)} dot>{r.status}</Badge> },
    { key: 'lastLogin',  header: 'Last Login', render: r => <span className="text-muted text-sm">{r.lastLogin ? new Date(r.lastLogin).toLocaleString() : '—'}</span> },
    {
      key: 'actions', header: 'Actions',
      render: r => (
        <Button size="sm" variant="ghost"
          onClick={() => dispatch({ type: 'system/deleteAdmin', payload: r.id })}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Administrators"
        subtitle="Manage gateway administrator accounts and permissions"
        actions={<Button variant="primary" onClick={() => dispatch(openAddAdmin())}>+ Add Admin</Button>}
      />

      <div className="card">
        <div className="card-table-scroll">
          <DataTable columns={columns} data={admins} rowKey="id" loading={isLoading} />
          <div ref={sentinelRef} className="load-more-sentinel">
            {isFetchingNextPage && <span className="spinner" />}
          </div>
        </div>
      </div>

      <Modal open={adminModalOpen} title="Add Administrator" size="sm" onClose={() => dispatch(closeAdminModal())}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-control" {...register('username', { required: 'Required' })} placeholder="johndoe" />
            {errors.username && <span className="form-error">{errors.username.message}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" {...register('email')} placeholder="john@corp.local" />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-control" type="password" {...register('password', { required: 'Required' })} />
          </div>
          <div className="form-group">
            <label className="form-label">Permission Level</label>
            <select className="form-control" {...register('permission')}>
              <option value="super-user">Super User (full access)</option>
              <option value="network-admin">Network Admin</option>
              <option value="read-only">Read Only</option>
              <option value="monitor">Monitor</option>
            </select>
          </div>
          <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border)', marginTop: 4 }}>
            <Button variant="ghost" type="button" onClick={() => dispatch(closeAdminModal())}>Cancel</Button>
            <Button variant="primary" type="submit" loading={saving}>Create Admin</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
