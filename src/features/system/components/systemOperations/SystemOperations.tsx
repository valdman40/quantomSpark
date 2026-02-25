import { useState } from 'react';
import { ChevronUp, ChevronDown, AlertTriangle, MinusCircle } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

type SectionKey = 'firmware' | 'appliance' | 'backup' | 'ipv6';

export function SystemOperations() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<Record<SectionKey, boolean>>({
    firmware: true,
    appliance: true,
    backup: true,
    ipv6: true,
  });

  const toggle = (key: SectionKey) =>
    setOpen(prev => ({ ...prev, [key]: !prev[key] }));

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  const SectionHeader = ({ label, sectionKey }: { label: string; sectionKey: SectionKey }) => (
    <div className="sysop-section-hdr" onClick={() => toggle(sectionKey)}>
      <span>{label}</span>
      {open[sectionKey] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>System Operations</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Manage your firmware version and backup your appliance
        </p>
      </div>

      {/* ── Firmware Management ── */}
      <div className="sysop-section">
        <SectionHeader label="Firmware Management" sectionKey="firmware" />
        {open.firmware && (
          <div className="sysop-section-body">
            <div className="sysop-firmware-row">
              <span className="sysop-firmware-ver">
                The current firmware version is R82.00.00 (998000661)
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => fire('Manual firmware upgrade initiated…')}
              >
                Manual Upgrade
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => fire('Reverting to previous firmware image…')}
              >
                Revert to Previous Image
              </button>
            </div>
            <div className="sysop-status-row">
              <AlertTriangle size={13} color="var(--warning, #f59e0b)" />
              <span>Connection to Roy Point Firmware Upgrade Service failed</span>
              <span>|</span>
              <a href="#" onClick={e => { e.preventDefault(); fire('Retrying firmware service connection…'); }}>
                Try again
              </a>
            </div>
            <div className="sysop-status-row">
              <MinusCircle size={13} color="var(--text-muted)" />
              <span>Automatic upgrade is disabled</span>
              <a href="#" onClick={e => { e.preventDefault(); fire('Opening upgrade schedule settings…'); }}>
                change
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ── Appliance ── */}
      <div className="sysop-section">
        <SectionHeader label="Appliance" sectionKey="appliance" />
        {open.appliance && (
          <div className="sysop-section-body">
            {/* Reboot */}
            <div className="sysop-action-row">
              <div className="sysop-action-info">
                <div className="sysop-action-title">Reboot</div>
                <div className="sysop-action-desc">Reboot the appliance now or schedule for later</div>
                <div className="sysop-action-note">
                  <MinusCircle size={12} />
                  Schedule reboot is disabled
                  <a href="#" onClick={e => { e.preventDefault(); fire('Opening reboot schedule settings…'); }}>
                    Change
                  </a>
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ flexShrink: 0 }}
                onClick={() => fire('Rebooting appliance…')}
              >
                Reboot
              </button>
            </div>

            {/* Restore Default Settings */}
            <div className="sysop-action-row">
              <div className="sysop-action-info">
                <div className="sysop-action-title">Restore Default Settings</div>
                <div className="sysop-action-desc">
                  Restore factory default settings but keep the current firmware version
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ flexShrink: 0 }}
                onClick={() => fire('Restoring default settings…')}
              >
                Restore
              </button>
            </div>

            {/* Revert to factory defaults */}
            <div className="sysop-action-row">
              <div className="sysop-action-info">
                <div className="sysop-action-title">Revert to factory defaults</div>
                <div className="sysop-action-desc">
                  Revert to the factory default image and settings. The factory firmware version
                  is R82.00.00 (998000293)
                </div>
              </div>
              <button
                className="btn btn-secondary"
                style={{ flexShrink: 0 }}
                onClick={() => fire('Reverting to factory defaults…')}
              >
                Revert
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Backup and Restore ── */}
      <div className="sysop-section">
        <SectionHeader label="Backup and Restore System Settings" sectionKey="backup" />
        {open.backup && (
          <div className="sysop-section-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div className="sysop-status-row" style={{ flex: 1, margin: 0 }}>
                <MinusCircle size={13} color="var(--text-muted)" />
                <span>
                  Periodic backup is <strong>OFF</strong>
                  {' '}
                  <a href="#" onClick={e => { e.preventDefault(); fire('Opening backup schedule settings…'); }}>
                    settings
                  </a>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => fire('Creating backup file…')}
                >
                  Create Backup File
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => fire('Restoring from backup…')}
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── IPv6 Settings ── */}
      <div className="sysop-section">
        <SectionHeader label="IPv6 Settings" sectionKey="ipv6" />
        {open.ipv6 && (
          <div className="sysop-section-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="sysop-firmware-ver">
                IPv6 security is enforced | IPv6 networking is enabled
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => fire('Opening IPv6 Enforcement Settings…')}
              >
                IPv6 Enforcement Settings…
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
