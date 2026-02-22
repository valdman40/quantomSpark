import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useNotifications } from './hooks/useNotifications';
import { NotificationFilters } from './components/NotificationFilters';
import { PageHeader } from '../../../components/common/PageHeader';
import { Button } from '../../../components/common/Button';
import { Badge } from '../../../components/common/Badge';
import type { NotificationSeverity } from '../../../types/home';

function severityVariant(s: NotificationSeverity): 'info' | 'warning' | 'error' {
  return s;
}

export function Notifications() {
  const dispatch   = useAppDispatch();
  const clearing   = useAppSelector(s => s.homeNotifications.clearing);
  const filter     = useAppSelector(s => s.homeNotifications.severityFilter);
  const { data: all, isLoading, error } = useNotifications();

  const notifications = all
    ? (filter === 'all' ? all : all.filter(n => n.severity === filter))
    : [];

  const unreadCount = all ? all.filter(n => !n.read).length : 0;

  if (isLoading) {
    return <div className="loading-box"><span className="spinner" /><span>Loading notifications…</span></div>;
  }
  if (error) {
    return <div className="empty">Failed to load notifications.</div>;
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        actions={
          <Button
            variant="danger"
            size="sm"
            disabled={clearing || unreadCount === 0}
            onClick={() => dispatch({ type: 'homeNotifications/clearAll' })}
          >
            {clearing ? 'Clearing…' : 'Clear All'}
          </Button>
        }
      />

      <NotificationFilters />

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Severity</th>
              <th>Category</th>
              <th>Message</th>
              <th style={{ width: 32 }} />
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
                  No notifications
                </td>
              </tr>
            )}
            {notifications.map(n => (
              <tr key={n.id} style={{ opacity: n.read ? 0.6 : 1 }}>
                <td className="mono" style={{ whiteSpace: 'nowrap' }}>
                  {new Date(n.timestamp).toLocaleString()}
                </td>
                <td>
                  <Badge variant={severityVariant(n.severity)}>
                    {n.severity.toUpperCase()}
                  </Badge>
                </td>
                <td>{n.category}</td>
                <td>{n.message}</td>
                <td>
                  {!n.read && (
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--brand)' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
