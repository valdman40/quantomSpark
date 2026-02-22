import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

type Mode = 'local' | 'central';

export function SecurityManagement() {
  const [mode, setMode] = useState<Mode>('central');
  const dispatch = useAppDispatch();

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Local / Central toggle */}
      <div className="mgmt-mode-toggle">
        <button
          className={`mgmt-mode-btn${mode === 'local' ? ' active' : ''}`}
          onClick={() => setMode('local')}
        >
          <span
            style={{
              width: 14, height: 14, borderRadius: '50%',
              border: `2px solid ${mode === 'local' ? '#fff' : 'var(--text-muted)'}`,
              display: 'inline-block', flexShrink: 0,
            }}
          />
          Local
        </button>
        <button
          className={`mgmt-mode-btn${mode === 'central' ? ' active' : ''}`}
          onClick={() => setMode('central')}
        >
          <span
            style={{
              width: 14, height: 14, borderRadius: '50%',
              border: `2px solid ${mode === 'central' ? '#fff' : 'var(--text-muted)'}`,
              background: mode === 'central' ? '#fff' : 'transparent',
              display: 'inline-block', flexShrink: 0,
            }}
          />
          Central
        </button>
      </div>

      {mode === 'central' ? (
        <div>
          <h2 style={{ fontWeight: 600, marginBottom: 4 }}>Central Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 24 }}>
            Manage appliance using the Management Server
          </p>

          {/* Topology illustration */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32, paddingBottom: 12 }}>
            {/* Gateway */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 44,
                background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
                border: '2px solid #f9a8d4', borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
              }}>🔥</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>Gateway</div>
            </div>
            {/* Connector line */}
            <div style={{ width: 32, height: 2, background: 'var(--border)' }} />
            {/* Globe */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                border: '2px solid var(--blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', background: '#eff6ff',
              }}>🌐</div>
            </div>
            {/* Connector line with red X */}
            <div style={{ position: 'relative', width: 48, flexShrink: 0 }}>
              <div style={{ height: 2, background: 'var(--border)', width: '100%' }} />
              <span style={{
                position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
                color: 'var(--red)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1,
              }}>✕</span>
            </div>
            {/* Server */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 48, background: '#e2e8f0',
                border: '2px solid var(--border)', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>🗄️</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 4 }}>Server</div>
            </div>
          </div>

          {/* 3 Status sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Security Management Server */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Security Management Server</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <span className="dot" style={{ background: '#94a3b8', marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem' }}>
                  <strong>Not initialized:</strong> Set up the connection to the Security Management Server
                </span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--blue)', marginLeft: 16 }}
                onClick={() => fire('Opening Security Management Server setup…')}
              >
                Setup
              </button>
            </div>

            {/* Security Policy */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Security Policy</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                <span className="dot dot-green" style={{ marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem' }}>
                  <strong>Policy Name:</strong> local
                </span>
              </div>
              <div style={{ marginLeft: 16, fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Security Policy date: Feb 19, 2026 10:35:45
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--blue)', marginLeft: 16 }}
                onClick={() => fire('Fetching policy…')}
              >
                Fetch Policy
              </button>
            </div>

            {/* Internet */}
            <div>
              <h4 style={{ fontWeight: 600, marginBottom: 8 }}>Internet</h4>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                <span className="dot dot-green" style={{ marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem' }}>
                  <strong>Connected:</strong> Appliance is connected to the Internet
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 16, alignItems: 'center' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--blue)' }}
                  onClick={() => fire('Testing connection status…')}
                >
                  Test Connection Status
                </button>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--blue)' }}
                  onClick={() => fire('Opening internet settings…')}
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 style={{ fontWeight: 600, marginBottom: 4 }}>Local Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            The appliance is managed locally. All configuration changes are made directly on this appliance.
          </p>
        </div>
      )}

      {/* Save / Cancel footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 40 }}>
        <button className="btn btn-secondary">Cancel</button>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(addNotification({ type: 'success', message: 'Security management settings saved.' }))}
        >
          Save
        </button>
      </div>
    </div>
  );
}
