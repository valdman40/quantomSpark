import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setActiveTab } from './logsSlice';
import { useSecurityLogs, useTrafficLogs, useSystemEvents } from './hooks/useLogs';
import { PageHeader } from '../../components/common/PageHeader';
import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { DataTable, type Column } from '../../components/common/DataTable';
import { LogFilters } from './components/LogFilters';
import type { SecurityLogEntry, TrafficLogEntry, SystemEvent } from '../../types/logs';

function actionVariant(a: string) {
  if (a === 'Accept') return 'success' as const;
  if (a === 'Drop' || a === 'Block' || a === 'Reject') return 'error' as const;
  if (a === 'Detect') return 'warning' as const;
  return 'neutral' as const;
}
function severityVariant(s: string) {
  if (s === 'critical') return 'error' as const;
  if (s === 'high')     return 'error' as const;
  if (s === 'medium')   return 'warning' as const;
  if (s === 'info')     return 'neutral' as const;
  return 'info' as const;
}
function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

interface LogsProps {
  /** Pre-select a tab when the component mounts (driven by route). */
  defaultTab?: 'security' | 'traffic' | 'events';
}

export function Logs({ defaultTab }: LogsProps = {}) {
  const dispatch = useAppDispatch();
  const { activeTab, filters } = useAppSelector(s => s.logs);

  // Sync the active tab whenever the route-driven defaultTab changes
  useEffect(() => {
    if (defaultTab) dispatch(setActiveTab(defaultTab));
  }, [defaultTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const { data: secLogs = [], isLoading: loadSec } = useSecurityLogs(filters);
  const { data: trafLogs = [], isLoading: loadTraf } = useTrafficLogs(filters);
  const { data: events = [], isLoading: loadEvents } = useSystemEvents(filters);

  const secCols: Column<SecurityLogEntry>[] = [
    { key: 'timestamp',  header: 'Time',    render: r => <span className="mono text-sm">{new Date(r.timestamp).toLocaleTimeString()}</span> },
    { key: 'blade',      header: 'Blade'   },
    { key: 'action',     header: 'Action',  render: r => <Badge variant={actionVariant(r.action)}>{r.action}</Badge> },
    { key: 'severity',   header: 'Sev',     render: r => <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge> },
    { key: 'sourceIp',   header: 'Source',  render: r => <span className="mono text-sm">{r.sourceIp}{r.sourcePort ? `:${r.sourcePort}` : ''}</span> },
    { key: 'destinationIp', header: 'Dest', render: r => <span className="mono text-sm">{r.destinationIp}{r.destinationPort ? `:${r.destinationPort}` : ''}</span> },
    { key: 'service',    header: 'Service' },
    { key: 'ruleName',   header: 'Rule',    render: r => <span className="text-muted text-sm truncate" style={{ maxWidth: 140, display: 'block' }}>{r.ruleName}</span> },
    { key: 'description',header: 'Info',   render: r => <span className="text-muted text-sm">{r.description ?? '—'}</span> },
  ];

  const trafCols: Column<TrafficLogEntry>[] = [
    { key: 'timestamp',  header: 'Time',     render: r => <span className="mono text-sm">{new Date(r.timestamp).toLocaleTimeString()}</span> },
    { key: 'sourceIp',   header: 'Source',   render: r => <span className="mono text-sm">{r.sourceIp}:{r.sourcePort}</span> },
    { key: 'destinationIp', header: 'Dest',  render: r => <span className="mono text-sm">{r.destinationIp}:{r.destinationPort}</span> },
    { key: 'protocol',   header: 'Proto'    },
    { key: 'service',    header: 'Service'  },
    { key: 'action',     header: 'Action',   render: r => <Badge variant={actionVariant(r.action)}>{r.action}</Badge> },
    { key: 'bytesSent',  header: 'Bytes ↑',  render: r => <span className="text-sm">{fmtBytes(r.bytesSent)}</span>    },
    { key: 'bytesReceived', header: 'Bytes ↓', render: r => <span className="text-sm">{fmtBytes(r.bytesReceived)}</span> },
    { key: 'application', header: 'App',    render: r => <span className="text-muted text-sm">{r.application ?? '—'}</span> },
  ];

  const eventCols: Column<SystemEvent>[] = [
    { key: 'timestamp', header: 'Time',      render: r => <span className="mono text-sm">{new Date(r.timestamp).toLocaleString()}</span> },
    { key: 'severity',  header: 'Severity',  render: r => <Badge variant={severityVariant(r.severity)}>{r.severity}</Badge> },
    { key: 'component', header: 'Component', render: r => <span style={{ fontWeight: 500 }}>{r.component}</span> },
    { key: 'message',   header: 'Message'   },
    { key: 'details',   header: 'Details',   render: r => <span className="text-muted text-sm">{r.details ?? '—'}</span> },
  ];

  return (
    <div>
      <PageHeader title="Logs & Monitoring" subtitle="Security, traffic, and system event logs" />

      <div className="tabs">
        {(['security', 'traffic', 'events'] as const).map(tab => (
          <div
            key={tab}
            className={`tab-item${activeTab === tab ? ' active' : ''}`}
            onClick={() => dispatch(setActiveTab(tab))}
          >
            {tab === 'security' ? 'Security Logs' : tab === 'traffic' ? 'Traffic Logs' : 'System Events'}
          </div>
        ))}
      </div>

      <LogFilters />

      <Card noPadding>
        {activeTab === 'security' && (
          <DataTable columns={secCols} data={secLogs} rowKey="id" loading={loadSec} />
        )}
        {activeTab === 'traffic' && (
          <DataTable columns={trafCols} data={trafLogs} rowKey="id" loading={loadTraf} />
        )}
        {activeTab === 'events' && (
          <DataTable columns={eventCols} data={events} rowKey="id" loading={loadEvents} />
        )}
      </Card>
    </div>
  );
}
