import type { SecurityLogEntry, TrafficLogEntry, SystemEvent, LogBlade } from '../../types/logs';

const BLADES: LogBlade[] = ['IPS', 'Anti-Virus', 'URL Filtering', 'Firewall', 'Application Control', 'Anti-Bot', 'VPN'];
const SEC_ACTIONS = ['Drop', 'Accept', 'Block', 'Detect'] as const;
const SEVERITIES  = ['info', 'low', 'medium', 'high', 'critical'] as const;
const SERVICES    = ['HTTP', 'HTTPS', 'DNS', 'SMTP', 'SSH', 'FTP', 'RDP', 'SMB'];
const RULES = [
  'IPS Default Block', 'AV Mail Scan', 'Block Social Media', 'Allow DNS',
  'Block P2P', 'Anti-Bot Prevention', 'IPS Detect Mode', 'Stealth Rule',
  'Allow LAN to Internet', 'Block Malware Sites', 'Allow VPN', 'Cleanup Rule',
];
const DESCRIPTIONS = [
  'SQL Injection attempt detected',
  'Trojan.GenericKD detected in attachment',
  'Social networking category blocked',
  'Allowed by policy',
  'BitTorrent DHT blocked',
  'C&C communication blocked',
  'Port scanning activity detected',
  'Firewall management access blocked',
  'Cross-site scripting attempt',
  'Ransomware signature matched',
  'Botnet DNS query intercepted',
  'Phishing URL blocked',
];

function srcIp(i: number) {
  return i % 4 === 0
    ? `198.51.100.${(i % 200) + 1}`
    : `192.168.${(i % 3) + 1}.${(i % 220) + 10}`;
}
function dstIp(i: number) {
  return i % 3 === 0
    ? `203.0.113.${(i % 200) + 1}`
    : `192.168.${(i % 2) + 1}.${(i % 200) + 10}`;
}
function tsAgo(minutesBack: number) {
  return new Date(Date.UTC(2026, 1, 22, 10, 0, 0) - minutesBack * 60_000).toISOString();
}

// ─── Security Logs (200 rows) ──────────────────────────────────────────────────
export const mockSecurityLogs: SecurityLogEntry[] = [
  { id: 'sl-01', timestamp: tsAgo(7),  blade: 'IPS',                 action: 'Drop',   severity: 'high',     sourceIp: '198.51.100.42', sourcePort: 49201, destinationIp: '192.168.1.20', destinationPort: 80,   service: 'HTTP',  ruleName: 'IPS Default Block',   description: 'SQL Injection attempt detected' },
  { id: 'sl-02', timestamp: tsAgo(9),  blade: 'Anti-Virus',          action: 'Drop',   severity: 'critical', sourceIp: '198.51.100.88', sourcePort: 25,    destinationIp: '192.168.1.15', destinationPort: 25,   service: 'SMTP',  ruleName: 'AV Mail Scan',        description: 'Trojan.GenericKD detected in attachment' },
  { id: 'sl-03', timestamp: tsAgo(11), blade: 'URL Filtering',       action: 'Drop',   severity: 'medium',   sourceIp: '192.168.1.30',  destinationIp: '203.0.113.99',   destinationPort: 443,  service: 'HTTPS', ruleName: 'Block Social Media',  description: 'Social networking category blocked' },
  { id: 'sl-04', timestamp: tsAgo(15), blade: 'Firewall',            action: 'Accept', severity: 'info',     sourceIp: '192.168.1.10',  destinationIp: '8.8.8.8',        destinationPort: 53,   service: 'DNS',   ruleName: 'Allow DNS' },
  { id: 'sl-05', timestamp: tsAgo(17), blade: 'Application Control', action: 'Drop',   severity: 'medium',   sourceIp: '192.168.1.45',  destinationIp: '203.0.113.77',   destinationPort: 6881, service: 'HTTP',  ruleName: 'Block P2P',           description: 'BitTorrent DHT blocked' },
  { id: 'sl-06', timestamp: tsAgo(20), blade: 'Anti-Bot',            action: 'Block',  severity: 'high',     sourceIp: '192.168.1.88',  destinationIp: '198.51.100.200', destinationPort: 8080, service: 'HTTP',  ruleName: 'Anti-Bot Prevention', description: 'C&C communication blocked' },
  { id: 'sl-07', timestamp: tsAgo(22), blade: 'IPS',                 action: 'Detect', severity: 'low',      sourceIp: '192.168.1.52',  destinationIp: '203.0.113.60',   destinationPort: 443,  service: 'HTTPS', ruleName: 'IPS Detect Mode',     description: 'Port scanning activity detected' },
  { id: 'sl-08', timestamp: tsAgo(25), blade: 'Firewall',            action: 'Drop',   severity: 'info',     sourceIp: '203.0.113.100', destinationIp: '192.168.1.1',    destinationPort: 22,   service: 'SSH',   ruleName: 'Stealth Rule',        description: 'Firewall management access blocked' },
  ...Array.from({ length: 192 }, (_, i): SecurityLogEntry => {
    const n       = i + 9;
    const blade   = BLADES[n % BLADES.length];
    const action  = SEC_ACTIONS[n % SEC_ACTIONS.length];
    const sev     = SEVERITIES[n % SEVERITIES.length];
    const service = SERVICES[n % SERVICES.length];
    const rule    = RULES[n % RULES.length];
    const desc    = DESCRIPTIONS[n % DESCRIPTIONS.length];
    const dport   = [80, 443, 53, 25, 22, 21, 3389, 445][n % 8];
    return {
      id: `sl-${String(n).padStart(2, '0')}`,
      timestamp: tsAgo(n * 2 + 30),
      blade,
      action,
      severity: sev,
      sourceIp: srcIp(n),
      sourcePort: 40000 + (n % 20000),
      destinationIp: dstIp(n),
      destinationPort: dport,
      service,
      ruleName: rule,
      ...(n % 3 !== 0 ? { description: desc } : {}),
    };
  }),
];

// ─── Traffic Logs (200 rows) ──────────────────────────────────────────────────
const APPLICATIONS = ['Google', 'Microsoft 365', 'YouTube', 'GitHub', 'Zoom', 'Slack', 'Dropbox', 'Netflix', 'AWS', 'Azure'];
const PROTOCOLS    = ['TCP', 'UDP'] as const;
const TRF_ACTIONS  = ['Accept', 'Drop'] as const;

export const mockTrafficLogs: TrafficLogEntry[] = [
  { id: 'tl-01', timestamp: tsAgo(8),  sourceIp: '192.168.1.10', sourcePort: 52301, destinationIp: '142.250.180.78',  destinationPort: 443,  protocol: 'TCP', service: 'HTTPS', action: 'Accept', bytesSent: 8192,   bytesReceived: 204800,   packets: 150, duration: 45,  application: 'Google' },
  { id: 'tl-02', timestamp: tsAgo(10), sourceIp: '192.168.1.25', sourcePort: 49801, destinationIp: '52.96.0.100',     destinationPort: 443,  protocol: 'TCP', service: 'HTTPS', action: 'Accept', bytesSent: 4096,   bytesReceived: 81920,    packets: 65,  duration: 30,  application: 'Microsoft 365' },
  { id: 'tl-03', timestamp: tsAgo(12), sourceIp: '192.168.1.8',  sourcePort: 51200, destinationIp: '8.8.8.8',         destinationPort: 53,   protocol: 'UDP', service: 'DNS',   action: 'Accept', bytesSent: 128,    bytesReceived: 256,      packets: 2,   duration: 0   },
  { id: 'tl-04', timestamp: tsAgo(14), sourceIp: '192.168.1.33', sourcePort: 50100, destinationIp: '172.16.10.10',    destinationPort: 80,   protocol: 'TCP', service: 'HTTP',  action: 'Accept', bytesSent: 1024,   bytesReceived: 51200,    packets: 40,  duration: 12  },
  { id: 'tl-05', timestamp: tsAgo(16), sourceIp: '192.168.1.50', sourcePort: 48900, destinationIp: '185.199.108.153', destinationPort: 443,  protocol: 'TCP', service: 'HTTPS', action: 'Accept', bytesSent: 16384,  bytesReceived: 1048576,  packets: 810, duration: 120, application: 'GitHub' },
  ...Array.from({ length: 195 }, (_, i): TrafficLogEntry => {
    const n      = i + 6;
    const proto  = PROTOCOLS[n % 2];
    const action = TRF_ACTIONS[n % 5 === 0 ? 1 : 0];
    const dport  = [443, 80, 53, 25, 22, 8080][n % 6];
    const svc    = dport === 443 ? 'HTTPS' : dport === 80 ? 'HTTP' : dport === 53 ? 'DNS' : dport === 25 ? 'SMTP' : dport === 22 ? 'SSH' : 'HTTP';
    const app    = APPLICATIONS[n % APPLICATIONS.length];
    const bytes  = (n % 100 + 1) * 1024;
    return {
      id: `tl-${String(n).padStart(2, '0')}`,
      timestamp: tsAgo(n * 3 + 20),
      sourceIp: `192.168.${(n % 3) + 1}.${(n % 220) + 10}`,
      sourcePort: 40000 + (n % 20000),
      destinationIp: `${n % 2 === 0 ? '142.250' : '52.96'}.${n % 256}.${(n * 7) % 256}`,
      destinationPort: dport,
      protocol: proto,
      service: svc,
      action,
      bytesSent: bytes,
      bytesReceived: bytes * (n % 8 + 2),
      packets: Math.floor(bytes / 1400) + 1,
      duration: n % 3 === 0 ? 0 : (n % 120) + 1,
      ...(svc === 'HTTPS' || svc === 'HTTP' ? { application: app } : {}),
    };
  }),
];

// ─── System Events (100 rows) ─────────────────────────────────────────────────
const COMPONENTS = ['Update Service', 'VPN', 'Policy', 'HA', 'System', 'Administrator', 'Certificate', 'Firewall', 'IPS', 'Network'];
const EVENT_SEVS  = ['info', 'medium', 'critical'] as const;
const EVENT_MSGS: Record<string, string[]> = {
  'Update Service': ['Threat prevention databases updated.', 'Software update check completed.', 'Auto-update scheduled.', 'Signature package downloaded.'],
  VPN:             ['Site-to-site VPN tunnel established.', 'VPN tunnel disconnected.', 'Remote access user connected.', 'IKE negotiation completed.'],
  Policy:          ['Security policy installed.', 'Policy push initiated.', 'Rule reorder applied.', 'Policy rollback completed.'],
  HA:              ['HA sync completed.', 'Failover event detected.', 'Primary member recovered.', 'Secondary member unreachable.'],
  System:          ['High CPU utilization detected.', 'Scheduled backup completed.', 'System restarted after update.', 'Disk cleanup completed.'],
  Administrator:   ['Administrator login.', 'Configuration change saved.', 'Admin session expired.', 'Password changed.'],
  Certificate:     ['Certificate expires in 30 days.', 'New certificate installed.', 'Certificate revoked.', 'Certificate renewed.'],
  Firewall:        ['Rule added.', 'Rule disabled.', 'Stealth rule triggered.', 'Cleanup rule matched.'],
  IPS:             ['High-confidence block.', 'New signature matched.', 'IPS profile updated.', 'False positive detected.'],
  Network:         ['Interface link changed.', 'DHCP pool near capacity.', 'BGP peer established.', 'DNS failure.'],
};

export const mockSystemEvents: SystemEvent[] = [
  { id: 'se-1', timestamp: tsAgo(60),  severity: 'info',     component: 'Update Service', message: 'Threat prevention databases updated successfully',  details: 'IPS: r81.20.240115, AV: 2024.01.15' },
  { id: 'se-2', timestamp: tsAgo(90),  severity: 'info',     component: 'VPN',            message: 'Site-to-site VPN tunnel established',               details: 'Peer: 198.51.100.10 (HQ-Branch-Office)' },
  { id: 'se-3', timestamp: tsAgo(240), severity: 'info',     component: 'Policy',         message: 'Security policy installed successfully',             details: '7 rules installed in 2.3s' },
  { id: 'se-4', timestamp: tsAgo(360), severity: 'medium',   component: 'HA',             message: 'HA sync completed with warnings',                   details: 'Secondary member sync delay: 4s' },
  { id: 'se-5', timestamp: tsAgo(480), severity: 'info',     component: 'VPN',            message: 'Remote access user connected',                     details: 'User: jsmith from 203.0.113.201' },
  { id: 'se-6', timestamp: tsAgo(600), severity: 'critical', component: 'System',         message: 'High CPU utilization detected (92%)',               details: 'Duration: 3 minutes. Process: fwk' },
  { id: 'se-7', timestamp: tsAgo(690), severity: 'info',     component: 'Administrator',  message: 'Administrator login: admin@192.168.1.10',           details: 'Session duration: 47 minutes' },
  { id: 'se-8', timestamp: tsAgo(780), severity: 'medium',   component: 'Certificate',    message: 'Internal CA certificate expires in 30 days',        details: 'Certificate CN: QS-1500W-Internal-CA' },
  ...Array.from({ length: 92 }, (_, i): SystemEvent => {
    const n    = i + 9;
    const comp = COMPONENTS[n % COMPONENTS.length];
    const msgs = EVENT_MSGS[comp];
    const msg  = msgs[n % msgs.length];
    const sev  = EVENT_SEVS[n % EVENT_SEVS.length];
    return {
      id: `se-${n}`,
      timestamp: tsAgo(n * 30 + 900),
      severity: sev,
      component: comp,
      message: msg,
      ...(n % 2 === 0 ? { details: `Auto-generated event ${n}` } : {}),
    };
  }),
];
