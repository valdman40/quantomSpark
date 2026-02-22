import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { removeNotification } from '../../app/uiSlice';

export function NotificationList() {
  const notifications = useAppSelector(s => s.ui.notifications);
  const dispatch = useAppDispatch();

  return (
    <div className="notif-list">
      {notifications.map(n => (
        <NotificationItem
          key={n.id}
          id={n.id}
          type={n.type}
          message={n.message}
          onDismiss={() => dispatch(removeNotification(n.id))}
        />
      ))}
    </div>
  );
}

function NotificationItem({
  id, type, message, onDismiss,
}: { id: string; type: string; message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className={`notif notif-${type}`}>
      <NotifIcon type={type} />
      <span style={{ flex: 1 }}>{message}</span>
      <span className="notif-close" onClick={onDismiss}>✕</span>
    </div>
  );
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'success') return <span style={{ color: 'var(--green)' }}>✔</span>;
  if (type === 'error')   return <span style={{ color: 'var(--red)' }}>✖</span>;
  if (type === 'warning') return <span style={{ color: 'var(--yellow)' }}>⚠</span>;
  return <span style={{ color: 'var(--blue)' }}>ℹ</span>;
}
