import { useForm } from 'react-hook-form';
import { Info } from 'lucide-react';
import { useAppDispatch } from '../../../app/hooks';
import { addNotification } from '../../../app/uiSlice';

interface PingForm { host: string; }
interface DnsForm  { host: string; }

const TOOLS: { label: string; desc: string }[] = [
  { label: 'Monitor System Resources',    desc: 'Display CPU usage, memory usage and processes'                },
  { label: 'Show Routing Table',          desc: 'Display the routing table of the gateway'                     },
  { label: 'Show Router Configuration',   desc: 'Show router configuration for specific protocol/settings'     },
  { label: 'Run Command',                 desc: 'Run a specific Clish/Expert Mode command'                     },
  { label: 'Test Cloud Services Ports',   desc: 'Verify that the appliance could connect to Cloud Services'    },
  { label: 'Tcpdump Tool',                desc: 'Packet capture'                                               },
  { label: 'Firewall Monitor Tool',       desc: 'Shows the state of the packet'                                },
  { label: 'Firewall Ctl Tool',           desc: 'Shows debugs for packets that are dropped by the Firewall'    },
  { label: 'VPN Debug Tool',              desc: 'Start/stop VPN debugging'                                     },
  { label: 'DHCP Tools',                  desc: 'Display DHCP logs and leases'                                 },
  { label: 'Generate CPInfo File',        desc: ''                                                             },
];

export function Tools() {
  const dispatch = useAppDispatch();
  const pingForm = useForm<PingForm>();
  const dnsForm  = useForm<DnsForm>();

  const fire = (msg: string) =>
    dispatch(addNotification({ type: 'info', message: msg }));

  const onPing      = (data: PingForm) => fire(`Pinging ${data.host || 'host'}…`);
  const onTraceroute = () => {
    const host = pingForm.getValues('host');
    fire(`Tracerouting ${host || 'host'}…`);
  };
  const onDns = (data: DnsForm) => fire(`DNS lookup for ${data.host || 'host'}…`);

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Tool button list */}
      <div style={{ marginBottom: 28 }}>
        {TOOLS.map(tool => (
          <div key={tool.label} className="tool-row">
            <button
              className="btn btn-secondary"
              style={{ minWidth: 220, color: 'var(--blue)', borderColor: 'var(--blue)' }}
              onClick={() => fire(`${tool.label} — running…`)}
            >
              {tool.label}
            </button>
            {tool.desc && <span className="tool-desc">{tool.desc}</span>}
          </div>
        ))}
      </div>

      {/* Ping / Traceroute */}
      <div className="tool-form-section">
        <h4>Ping or Trace an IP Address</h4>
        <form onSubmit={pingForm.handleSubmit(onPing)}>
          <div className="tool-form-row">
            <label>Host name or IP address:</label>
            <input
              className="form-control"
              style={{ width: 180 }}
              placeholder="8.8.8.8"
              {...pingForm.register('host')}
            />
            <button
              type="submit"
              className="btn btn-secondary"
              style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
            >
              Ping
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
              onClick={onTraceroute}
            >
              Traceroute
            </button>
          </div>
        </form>
      </div>

      {/* DNS Lookup */}
      <div className="tool-form-section">
        <h4>Perform a DNS Lookup</h4>
        <form onSubmit={dnsForm.handleSubmit(onDns)}>
          <div className="tool-form-row">
            <label>Host name or IP address:</label>
            <input
              className="form-control"
              style={{ width: 180 }}
              placeholder="example.com"
              {...dnsForm.register('host')}
            />
            <button
              type="submit"
              className="btn btn-secondary"
              style={{ color: 'var(--blue)', borderColor: 'var(--blue)' }}
            >
              Lookup
            </button>
          </div>
        </form>
      </div>

      {/* USB-C driver download */}
      <div style={{ marginTop: 20, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <a href="#" style={{ color: 'var(--blue)' }}>Download</a>
        <span style={{ color: 'var(--text-secondary)' }}>Windows driver for a USB-C console socket</span>
        <Info size={13} color="var(--blue)" />
      </div>
    </div>
  );
}
