import { useState } from 'react';
import { ChevronUp, ChevronDown, Info } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

interface CertSection { key: string; value: string; }

const CA_CERT: CertSection[] = [
  { key: 'Certificate:',      value: 'O=00:1C:7F:24:C5:BB..mxrazt' },
  { key: 'Not valid before:', value: 'Saturday, February 14th, 2026 12:39:54 PM' },
  { key: 'Not valid after:',  value: 'Friday, January 1st, 2038 03:14:07 AM' },
  { key: 'Fingerprint:',      value: 'YAW OF APE LID PAP SAM DIE RAIN SAND LOON OILY BAY' },
];

const VPN_CERT: CertSection[] = [
  { key: 'Certificate:',       value: 'CN=00:1C:7F:24:C5:BB VPN Certificate,O=00:1C:7F:24:C5:BB..mxrazt' },
  { key: 'Not valid before:',  value: 'Saturday, February 14th, 2026 12:40:03 PM' },
  { key: 'Not valid after:',   value: 'Friday, February 14th, 2031 12:40:03 PM' },
  { key: 'Fingerprint:',       value: 'DAVY NULL HACK NAY DAY ARK BABE HOSE HERD GOSH LAD TONE' },
  { key: 'CRL distribution:',  value: 'http://my.firewall:18264/ICA_CRL1.crl' },
];

export function InternalCertificate() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState({ ca: true, vpn: true });
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));
  const toggle = (k: 'ca' | 'vpn') => setOpen(p => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Internal Certificate</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Display the appliance Internal CA certificate and Internal VPN certificate
        </p>
      </div>

      {/* Action toolbar */}
      <div className="cert-toolbar" style={{ marginBottom: 20 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Reinitializing certificates…')}>Reinitialize Certificates</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Replacing Internal CA…')}>Replace Internal CA</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Exporting Internal CA Certificate…')}>Export Internal CA Certificate</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Sign a request…')}>Sign a Request</button>
      </div>

      {/* Internal CA Certificate */}
      <div className="sysop-section" style={{ maxWidth: 760 }}>
        <div className="sysop-section-hdr" onClick={() => toggle('ca')}>
          <span>Internal CA Certificate</span>
          {open.ca ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {open.ca && (
          <div className="sysop-section-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Info size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>The internal CA certificate is the certification which authenticates the internal CA to sign on the internal certificates</span>
            </div>
            {CA_CERT.map(row => (
              <div key={row.key} className="cert-info-row">
                <span className="cert-info-key">{row.key}</span>
                <span className="cert-info-val">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal VPN Certificate */}
      <div className="sysop-section" style={{ maxWidth: 760 }}>
        <div className="sysop-section-hdr" onClick={() => toggle('vpn')}>
          <span>Internal VPN Certificate</span>
          {open.vpn ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        {open.vpn && (
          <div className="sysop-section-body">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Info size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>The internal VPN certificate is the certificate used for this appliance to authenticate itself on VPN based certificate configurations</span>
            </div>
            {VPN_CERT.map(row => (
              <div key={row.key} className="cert-info-row">
                <span className="cert-info-key">{row.key}</span>
                <span className="cert-info-val">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
