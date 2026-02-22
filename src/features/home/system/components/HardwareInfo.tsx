import type { HardwareInfo as HardwareInfoType } from '../../../../types/home';
import { Card } from '../../../../components/common/Card';

interface Props { hardware: HardwareInfoType }

export function HardwareInfo({ hardware }: Props) {
  const rows = [
    { label: 'CPU Cores',      value: `${hardware.cpuCores} cores` },
    { label: 'Total RAM',      value: `${hardware.totalRamGb} GB` },
    { label: 'Total Storage',  value: `${hardware.totalStorageGb} GB` },
  ];

  return (
    <Card title="Hardware">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{r.label}</span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
