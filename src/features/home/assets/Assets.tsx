import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useAssets } from './hooks/useAssets';
import { toggleExpanded } from './assetsSlice';
import { AssetFilters } from './components/AssetFilters';
import { AssetRowDetail } from './components/AssetRowDetail';
import { PageHeader } from '../../../components/common/PageHeader';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import { queryClient } from '../../../app/queryClient';
import { queryKeys } from '../../../services/queryKeys';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import type { AssetType } from '../../../types/home';

const typeBadgeVariant: Record<AssetType, 'info' | 'success' | 'warning' | 'neutral' | 'error'> = {
  PC:      'info',
  mobile:  'success',
  IoT:     'warning',
  server:  'neutral',
  printer: 'neutral',
  unknown: 'error',
};

const COL_COUNT = 7;

export function Assets() {
  const dispatch   = useAppDispatch();
  const filter     = useAppSelector(s => s.homeAssets.typeFilter);
  const expandedId = useAppSelector(s => s.homeAssets.expandedId);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useAssets();

  const allAssets = data?.pages.flatMap(p => p.data) ?? [];
  const assets = filter === 'all' ? allAssets : allAssets.filter(a => a.type === filter);

  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  if (isLoading) {
    return <div className="loading-box"><span className="spinner" /><span>Loading assets…</span></div>;
  }
  if (error) {
    return <div className="empty">Failed to load assets.</div>;
  }

  return (
    <div>
      <PageHeader
        title="Assets"
        subtitle="Connected devices on the network"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: queryKeys.home.assets() })}
          >
            ↻ Refresh
          </Button>
        }
      />

      <AssetFilters />

      <div className="card">
        <div className="card-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 16 }} />
              <th>IP Address</th>
              <th>Hostname</th>
              <th>MAC</th>
              <th>Type</th>
              <th>Last Seen</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 && (
              <tr>
                <td colSpan={COL_COUNT} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                  No assets found
                </td>
              </tr>
            )}
            {assets.map(a => {
              const expanded = expandedId === a.id;
              return (
                <>
                  <tr
                    key={a.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => dispatch(toggleExpanded(a.id))}
                  >
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: a.status === 'online' ? 'var(--green)' : 'var(--text-muted)',
                        }}
                      />
                    </td>
                    <td className="mono">{a.ipAddress}</td>
                    <td>{a.hostname}</td>
                    <td className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {a.macAddress}
                    </td>
                    <td>
                      <Badge variant={typeBadgeVariant[a.type]}>{a.type}</Badge>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      {new Date(a.lastSeen).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {expanded ? '▲' : '▼'}
                    </td>
                  </tr>
                  {expanded && <AssetRowDetail key={`${a.id}-detail`} asset={a} colSpan={COL_COUNT} />}
                </>
              );
            })}
          </tbody>
        </table>
        <div ref={sentinelRef} className="load-more-sentinel">
          {isFetchingNextPage && <span className="spinner" />}
        </div>
        </div>
      </div>
    </div>
  );
}
