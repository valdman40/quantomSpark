import { useRoutes } from '../../hooks/useRoutes';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Badge } from '../../../../components/common/Badge';
import { DataTable, type Column } from '../../../../components/common/DataTable';
import type { StaticRoute } from '../../../../types/network';

export function RoutingTable() {
  const { data: routes = [], isLoading } = useRoutes();

  const columns: Column<StaticRoute>[] = [
    { key: 'destination', header: 'Destination', render: r => <span className="mono">{r.destination}</span> },
    { key: 'mask',        header: 'Mask',        render: r => <span className="mono">{r.mask}</span>        },
    { key: 'gateway',     header: 'Gateway',     render: r => <span className="mono">{r.gateway || '—'}</span> },
    { key: 'interface',   header: 'Interface'   },
    { key: 'metric',      header: 'Metric'      },
    {
      key: 'type', header: 'Type',
      render: r => (
        <Badge variant={r.type === 'connected' ? 'success' : r.type === 'static' ? 'info' : 'neutral'}>
          {r.type}
        </Badge>
      ),
    },
    { key: 'comment', header: 'Comment', render: r => <span className="text-muted">{r.comment ?? '—'}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Routing Table"
        subtitle="Static routes and connected networks"
      />
      <div className="card">
        <DataTable columns={columns} data={routes} rowKey="id" loading={isLoading} />
      </div>
    </div>
  );
}
