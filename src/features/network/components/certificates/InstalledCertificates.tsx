import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAppDispatch } from '../../../../app/hooks';
import { addNotification } from '../../../../app/uiSlice';

const CERTS = [
  { name: 'Default VPN and Cluster certificate', expiration: 'Fri Feb 14 12:40:03 2031', status: 'Verified' },
  { name: 'Default Web Portal Certificate',      expiration: 'Thu Feb 14 12:39:45 2036', status: 'Verified' },
];

export function InstalledCertificates() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState('');
  const fire = (msg: string) => dispatch(addNotification({ type: 'info', message: msg }));

  const filtered = CERTS.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>Installed Certificates</h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Create and manage appliance certificates
        </p>
      </div>

      <div className="cert-toolbar">
        <button className="btn btn-secondary btn-sm" onClick={() => fire('New signing request…')}>New Signing Request</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Show certificate details…')}>Details…</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Delete certificate…')}>Delete</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Export certificate…')}>Export</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Upload signed certificate…')}>Upload Signed Certificate</button>
        <button className="btn btn-secondary btn-sm" onClick={() => fire('Upload P12 certificate…')}>Upload P12 Certificate</button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            className="form-control"
            style={{ width: 160, height: 28, fontSize: '0.78rem' }}
            placeholder="Type to filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <Search size={14} color="var(--text-muted)" />
        </div>
      </div>

      <table className="data-table" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Installed Certificate</th>
            <th>Expiration</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(cert => (
            <tr key={cert.name}>
              <td style={{ color: 'var(--brand)', cursor: 'pointer' }}
                onClick={() => fire(`Certificate details: ${cert.name}`)}>
                {cert.name}
              </td>
              <td>{cert.expiration}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--green)', flexShrink: 0 }} />
                  {cert.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
