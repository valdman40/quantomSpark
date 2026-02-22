import type { RecentAlert } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';
import { Badge } from '../../../../components/common/Badge';

interface Props { alerts: RecentAlert[] }

function actionVariant(action: string) {
  if (action === 'Accept' || action === 'Encrypt') return 'success' as const;
  if (action === 'Drop'   || action === 'Reject')  return 'error'   as const;
  return 'neutral' as const;
}

export function RecentAlerts({ alerts }: Props) {
  return (
    <Card title="Recent Security Events" noPadding>
      <table className="data-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Blade</th>
            <th>Action</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Service</th>
            <th>Rule</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td className="mono">{new Date(a.timestamp).toLocaleTimeString()}</td>
              <td>{a.blade}</td>
              <td><Badge variant={actionVariant(a.action)}>{a.action}</Badge></td>
              <td className="mono">{a.sourceIp}</td>
              <td className="mono">{a.destinationIp}</td>
              <td>{a.service}</td>
              <td className="truncate" style={{ maxWidth: 160 }}>{a.ruleName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
