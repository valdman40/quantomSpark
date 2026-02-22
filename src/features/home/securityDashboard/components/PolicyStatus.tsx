import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import type { PolicyInstallStatus } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';

interface Props { policy: PolicyInstallStatus }

const statusVariant: Record<PolicyInstallStatus['status'], 'success' | 'warning' | 'error'> = {
  ok:      'success',
  pending: 'warning',
  failed:  'error',
};

export function PolicyStatus({ policy }: Props) {
  const dispatch   = useAppDispatch();
  const installing = useAppSelector(s => s.securityDashboard.installing);

  return (
    <Card title="Policy Status">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.78rem', marginBottom: 16 }}>
        <InfoRow label="Status"       value={<Badge variant={statusVariant[policy.status]}>{policy.status.toUpperCase()}</Badge>} />
        <InfoRow label="Rules Count"  value={`${policy.rulesCount} rules`} />
        <InfoRow label="Installed By" value={policy.installedBy} />
        <InfoRow label="Last Install" value={new Date(policy.lastInstalled).toLocaleString()} />
      </div>

      <Button
        variant="primary"
        size="sm"
        disabled={installing}
        onClick={() => dispatch({ type: 'securityDashboard/installPolicy' })}
      >
        {installing ? 'Installing…' : 'Install Policy'}
      </Button>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
      <div style={{ fontWeight: 600, fontSize: '0.8rem', marginTop: 2 }}>{value}</div>
    </div>
  );
}
