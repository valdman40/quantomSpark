import { Link } from 'react-router-dom';
import { Globe, Info, FileText, MessageCircle } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

const PHONE_TABLE = [
  ['Americas',        '+1 (972) 444 6600 / +1 (888) 361 5030 / +1 (613) 271-7950'],
  ['EMEA',            '+972 3 611 5100'],
  ['Australia',       '1 800 805 793'],
  ['China',           '+86 1084181958'],
  ['Japan EBS',       '+81 5068623812'],
  ['Japan CES',       '+81 5068623813'],
  ['New Zealand',     '0800 443 601'],
  ['UK',              '0808 101 7399'],
  ['Other Countries', '+972 3 611 5100'],
];

export function Support() {
  const dispatch = useAppDispatch();

  return (
    <div style={{ maxWidth: 720 }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
        Whether you have an urgent problem or a simple question, we're here to help you by Web or phone.
      </p>

      <section style={{ marginBottom: 28 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Contact Technical Support</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.82rem' }}>
              <a href="#" style={{ color: 'var(--blue)' }}>Local guide</a>
              {' '}is the appliance's help files repository.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
            <a href="#" style={{ color: 'var(--blue)', fontSize: '0.82rem' }}>Firmware releases</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <FileText size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.82rem' }}>
              <a href="#" style={{ color: 'var(--blue)' }}>Service Request Tool</a>
              {' '}is your online resource for submitting, updating and tracking service requests.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <MessageCircle size={14} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontSize: '0.82rem' }}>
              <a href="#" style={{ color: 'var(--blue)' }}>Live Chat</a>
              {' '}provides online support for quick questions about Roy Point products and services.
            </span>
          </div>

          <div style={{ marginLeft: 22, marginTop: 4 }}>
            <p style={{ fontSize: '0.82rem', marginBottom: 8 }}>
              Our Worldwide Technical Assistance Centers are available to assist you 24×7 (select option #4):
            </p>
            <table style={{ fontSize: '0.82rem', borderSpacing: 0, marginLeft: 16 }}>
              <tbody>
                {PHONE_TABLE.map(([region, phone]) => (
                  <tr key={region}>
                    <td style={{ fontWeight: 600, paddingRight: 14, paddingBottom: 3, whiteSpace: 'nowrap' }}>{region}:</td>
                    <td style={{ color: 'var(--text-secondary)', paddingBottom: 3 }}>{phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <Globe size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
            <a href="#" style={{ color: 'var(--blue)', fontSize: '0.82rem' }}>Official support site</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem' }}>
              <a href="#" style={{ color: 'var(--blue)' }}>Download</a>{' '}a local manual in PDF format
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem' }}>
              <a href="#" style={{ color: 'var(--blue)' }}>Download</a>
              {'  Windows driver for a USB-C console socket  '}
              <Info size={12} color="var(--blue)" style={{ verticalAlign: 'middle' }} />
            </span>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 600, marginBottom: 12 }}>Product Information for Support</h3>
        <table style={{ fontSize: '0.82rem', borderSpacing: 0 }}>
          <tbody>
            {[
              ['Appliance',            'New Spark (Gateway-ID-569EFED1)'],
              ['Security Management',  'Locally managed'],
              ['Version (firmware)',   'R82.00.15 (998001836)'],
              ['MAC address',          '00:50:56:9E:FE:D1'],
            ].map(([label, value]) => (
              <tr key={label}>
                <td style={{ color: 'var(--text-secondary)', paddingRight: 24, paddingBottom: 6, whiteSpace: 'nowrap', minWidth: 200, verticalAlign: 'top' }}>
                  {label}:
                </td>
                <td style={{ paddingBottom: 6 }}>{value}</td>
              </tr>
            ))}
            <tr>
              <td style={{ color: 'var(--text-secondary)', paddingBottom: 6, verticalAlign: 'top' }}>More:</td>
              <td style={{ paddingBottom: 6 }}>
                <Link to="/home/license"           style={{ color: 'var(--blue)' }}>License</Link>
                {' | '}
                <Link to="/home/security-dashboard" style={{ color: 'var(--blue)' }}>Security Dashboard</Link>
                {' | '}
                <Link to="/home/system"            style={{ color: 'var(--blue)' }}>System</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <button
        className="btn btn-secondary"
        style={{ minWidth: 220 }}
        onClick={() => dispatch(addNotification({ type: 'info', message: 'Generating CPInfo file…' }))}
      >
        Generate CPInfo File
      </button>
    </div>
  );
}
