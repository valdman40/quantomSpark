import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { openAddTunnel } from '../../vpnSlice';
import { useVpnTunnels } from '../../hooks/useVpn';
import { PageHeader } from '../../../../components/common/PageHeader';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import { Modal } from '../../../../components/common/Modal';
import { TunnelForm } from './TunnelForm';
import { useInfiniteScroll } from '../../../../hooks/useInfiniteScroll';
import type { VpnTunnel } from '../../../../types/vpn';

function statusVariant(s: string) {
  if (s === 'connected')    return 'success' as const;
  if (s === 'disconnected') return 'neutral' as const;
  if (s === 'connecting')   return 'warning' as const;
  return 'error' as const;
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

export function TunnelList() {
  const dispatch = useAppDispatch();
  const { tunnelModalOpen, connectingTunnelId } = useAppSelector(s => s.vpn);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useVpnTunnels();

  const tunnels = data?.pages.flatMap(p => p.data) ?? [];
  const sentinelRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <div>
      <PageHeader
        title="Site-to-Site VPN"
        subtitle="IPsec VPN tunnels"
        actions={<Button variant="primary" onClick={() => dispatch(openAddTunnel())}>+ Add VPN Tunnel</Button>}
      />

      {isLoading ? (
        <div className="loading-box"><span className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="card-table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Peer IP</th>
                  <th>Peer Name</th>
                  <th>Status</th>
                  <th>IKE</th>
                  <th>Encryption</th>
                  <th>Bytes ↑ / ↓</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tunnels.map((t: VpnTunnel) => {
                  const isConnecting = connectingTunnelId === t.id;
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 600 }}>{t.name}</td>
                      <td className="mono">{t.peerIp}</td>
                      <td className="text-muted">{t.peerName ?? '—'}</td>
                      <td>
                        <Badge variant={statusVariant(t.status)} dot>
                          {t.status}
                        </Badge>
                      </td>
                      <td><span className="text-sm">{t.ikeVersion}</span></td>
                      <td><span className="text-sm">{t.phase1Encryption}</span></td>
                      <td className="mono text-sm">
                        {fmtBytes(t.bytesSent)} / {fmtBytes(t.bytesReceived)}
                      </td>
                      <td>
                        <div className="actions">
                          {t.status === 'connected' ? (
                            <Button size="sm" variant="secondary" loading={isConnecting}
                              onClick={() => dispatch({ type: 'vpn/disconnectTunnel', payload: t.id })}>
                              Disconnect
                            </Button>
                          ) : (
                            <Button size="sm" variant="primary" loading={isConnecting}
                              onClick={() => dispatch({ type: 'vpn/connectTunnel', payload: t.id })}>
                              Connect
                            </Button>
                          )}
                          <Button size="sm" variant="ghost"
                            onClick={() => dispatch({ type: 'vpn/deleteTunnel', payload: t.id })}>
                            Del
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div ref={sentinelRef} className="load-more-sentinel">
              {isFetchingNextPage && <span className="spinner" />}
            </div>
          </div>
        </div>
      )}

      <Modal open={tunnelModalOpen} title="Add VPN Tunnel" size="lg"
        onClose={() => dispatch({ type: 'vpn/closeTunnelModal' })}>
        <TunnelForm />
      </Modal>
    </div>
  );
}
