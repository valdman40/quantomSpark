import { useState } from 'react';
import { Download } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

type Period = 'monthly' | 'weekly' | 'daily' | 'hourly';

export function Reports() {
  const [period, setPeriod] = useState<Period>('hourly');
  const dispatch = useAppDispatch();

  return (
    <div>
      {/* Period tabs + download button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div className="report-period-tabs">
          {(['monthly', 'weekly', 'daily', 'hourly'] as Period[]).map(p => (
            <span
              key={p}
              className={`report-period-tab${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </span>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm">
          <Download size={14} />
        </button>
      </div>

      {/* Report subtitle */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
        Hourly report:{' '}
        <strong>February 22nd, 2026 09:34am</strong>
        {' / '}
        <strong>February 22nd, 2026 10:34am</strong>
        {'  '}
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--blue)' }}
          onClick={() => dispatch(addNotification({ type: 'info', message: 'Generating report…' }))}
        >
          Generate
        </button>
      </p>

      {/* Report preview card */}
      <div className="report-preview">
        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 8, paddingBottom: 10, borderBottom: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>Appliance</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>Report</div>
            </div>
            <span style={{ fontSize: '1.4rem' }}>🔥</span>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CHECK POINT</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>Quantum</div>
            </div>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: 'var(--brand)' }}>✓</span> CHECK POINT
          </div>
        </div>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
          Hourly report |{' '}
          <strong>February 22nd</strong>, 2026 09:34am /{' '}
          <strong>February 22nd</strong>, 2026 10:34am
        </p>

        {/* Blade status row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10,
          marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--border)',
        }}>
          {[
            'Anti-Bot & DNS Security',
            'Anti-Virus',
            'IPS',
            'Threat Emulation',
          ].map(name => (
            <div key={name} style={{ fontSize: '0.72rem', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
              <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>is inactive</div>
            </div>
          ))}
        </div>

        {/* Top Bandwidth + donut */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--border)',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>Top Bandwidth Consuming</div>
            {[
              'N/A | Top category — Application control is inactive',
              'N/A | Top site — Application control is inactive',
              'N/A | Top user — Application control is inactive',
            ].map(item => (
              <div key={item} style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 5 }}>
                {item}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8 }}>
              Bandwidth Usage by Applications
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="mon-donut" style={{ width: 80, height: 80, border: '10px solid #e2e8f0' }}>
                Application control<br />is inactive
              </div>
            </div>
          </div>
        </div>

        {/* Infected + High Risk */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginBottom: 14, paddingBottom: 14, borderBottom: '1px dashed var(--border)',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>Infected Devices</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Anti-Bot &amp; DNS Security is inactive
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>High Risk Applications</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Application control is inactive
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span>Name: <strong>Gateway-ID-569EFED1</strong></span>
          <span>|</span>
          <span>Version: <strong>R82.00.15</strong></span>
          <span>|</span>
          <span>MAC: <strong>00:50:56:9E:FE:D1</strong></span>
        </div>
      </div>
    </div>
  );
}
