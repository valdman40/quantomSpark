import { useNatRules } from '../../hooks/useFirewallRules';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Badge } from '../../../../components/common/Badge';
import { DataTable, type Column } from '../../../../components/common/DataTable';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import type { NatRule } from '../../../../types/security';

export function NatTable() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNatRules();
  const natRules = data?.pages.flatMap(p => p.data) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const columns: Column<NatRule>[] = [
    { key: 'number',              header: '#',           render: r => <span className="rule-num">{r.number}</span> },
    { key: 'name',                header: 'Name',        render: r => <span style={{ fontWeight: 500 }}>{r.name}</span> },
    { key: 'originalSource',      header: 'Orig Source', render: r => <span className="mono">{r.originalSource}</span> },
    { key: 'originalDestination', header: 'Orig Dest',   render: r => <span className="mono">{r.originalDestination}</span> },
    { key: 'originalService',     header: 'Orig Service' },
    { key: 'translatedSource',    header: 'Trans Source',render: r => <span className="mono">{r.translatedSource}</span> },
    { key: 'translatedDestination',header:'Trans Dest',  render: r => <span className="mono">{r.translatedDestination}</span> },
    {
      key: 'type', header: 'Type',
      render: r => <Badge variant="info">{r.type}</Badge>,
    },
    {
      key: 'enabled', header: 'Status',
      render: r => <Badge variant={r.enabled ? 'success' : 'neutral'}>{r.enabled ? 'Enabled' : 'Disabled'}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader title="NAT Rules" subtitle="Network address translation rules" />
      <div className="card">
        <div className="card-table-scroll">
          <DataTable columns={columns} data={natRules} rowKey="id" loading={isLoading} />
          <div ref={sentinelRef} className="load-more-sentinel">
            {isFetchingNextPage && <span className="spinner" />}
          </div>
        </div>
      </div>
    </div>
  );
}
