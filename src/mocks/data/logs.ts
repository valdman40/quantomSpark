import type { SecurityLogEntry, TrafficLogEntry, SystemEvent } from '../../types/logs';

export const mockSecurityLogs: SecurityLogEntry[] = [
  { id: 'sl-01', timestamp: '2024-01-15T10:23:14Z', blade: 'IPS',                 action: 'Drop',   severity: 'high',   sourceIp: '198.51.100.42', sourcePort: 49201, destinationIp: '192.168.1.20', destinationPort: 80,   service: 'HTTP',  ruleName: 'IPS Default Block',     description: 'SQL Injection attempt detected' },
  { id: 'sl-02', timestamp: '2024-01-15T10:21:05Z', blade: 'Anti-Virus',          action: 'Drop',   severity: 'critical', sourceIp: '198.51.100.88', sourcePort: 25, destinationIp: '192.168.1.15', destinationPort: 25,   service: 'SMTP', ruleName: 'AV Mail Scan',           description: 'Trojan.GenericKD detected in attachment' },
  { id: 'sl-03', timestamp: '2024-01-15T10:18:33Z', blade: 'URL Filtering',       action: 'Drop',   severity: 'medium', sourceIp: '192.168.1.30', destinationIp: '203.0.113.99',   destinationPort: 443,  service: 'HTTPS', ruleName: 'Block Social Media',    description: 'Social networking category blocked' },
  { id: 'sl-04', timestamp: '2024-01-15T10:15:11Z', blade: 'Firewall',            action: 'Accept', severity: 'info',   sourceIp: '192.168.1.10', destinationIp: '8.8.8.8',        destinationPort: 53,   service: 'DNS',   ruleName: 'Allow DNS' },
  { id: 'sl-05', timestamp: '2024-01-15T10:12:58Z', blade: 'Application Control', action: 'Drop',   severity: 'medium', sourceIp: '192.168.1.45', destinationIp: '203.0.113.77',   destinationPort: 6881, service: 'HTTP',  ruleName: 'Block P2P',             description: 'BitTorrent DHT blocked' },
  { id: 'sl-06', timestamp: '2024-01-15T10:10:02Z', blade: 'Anti-Bot',            action: 'Block',  severity: 'high',   sourceIp: '192.168.1.88', destinationIp: '198.51.100.200', destinationPort: 8080, service: 'HTTP',  ruleName: 'Anti-Bot Prevention',   description: 'C&C communication blocked' },
  { id: 'sl-07', timestamp: '2024-01-15T10:07:44Z', blade: 'IPS',                 action: 'Detect', severity: 'low',    sourceIp: '192.168.1.52', destinationIp: '203.0.113.60',   destinationPort: 443,  service: 'HTTPS', ruleName: 'IPS Detect Mode',       description: 'Port scanning activity detected' },
  { id: 'sl-08', timestamp: '2024-01-15T10:05:19Z', blade: 'Firewall',            action: 'Drop',   severity: 'info',   sourceIp: '203.0.113.100', destinationIp: '192.168.1.1',  destinationPort: 22,   service: 'SSH',   ruleName: 'Stealth Rule',          description: 'Firewall management access blocked' },
];

export const mockTrafficLogs: TrafficLogEntry[] = [
  { id: 'tl-01', timestamp: '2024-01-15T10:22:00Z', sourceIp: '192.168.1.10', sourcePort: 52301, destinationIp: '142.250.180.78', destinationPort: 443,  protocol: 'TCP', service: 'HTTPS',    action: 'Accept', bytesSent: 8192,   bytesReceived: 204800,  packets: 150, duration: 45,  application: 'Google' },
  { id: 'tl-02', timestamp: '2024-01-15T10:21:30Z', sourceIp: '192.168.1.25', sourcePort: 49801, destinationIp: '52.96.0.100',    destinationPort: 443,  protocol: 'TCP', service: 'HTTPS',    action: 'Accept', bytesSent: 4096,   bytesReceived: 81920,   packets: 65,  duration: 30,  application: 'Microsoft 365' },
  { id: 'tl-03', timestamp: '2024-01-15T10:20:45Z', sourceIp: '192.168.1.8',  sourcePort: 51200, destinationIp: '8.8.8.8',        destinationPort: 53,   protocol: 'UDP', service: 'DNS',      action: 'Accept', bytesSent: 128,    bytesReceived: 256,     packets: 2,   duration: 0   },
  { id: 'tl-04', timestamp: '2024-01-15T10:20:01Z', sourceIp: '192.168.1.33', sourcePort: 50100, destinationIp: '172.16.10.10',   destinationPort: 80,   protocol: 'TCP', service: 'HTTP',     action: 'Accept', bytesSent: 1024,   bytesReceived: 51200,   packets: 40,  duration: 12  },
  { id: 'tl-05', timestamp: '2024-01-15T10:19:00Z', sourceIp: '192.168.1.50', sourcePort: 48900, destinationIp: '185.199.108.153',destinationPort: 443,  protocol: 'TCP', service: 'HTTPS',    action: 'Accept', bytesSent: 16384,  bytesReceived: 1048576, packets: 810, duration: 120, application: 'GitHub' },
];

export const mockSystemEvents: SystemEvent[] = [
  { id: 'se-1', timestamp: '2024-01-15T10:00:00Z', severity: 'info',     component: 'Update Service',  message: 'Threat prevention databases updated successfully',          details: 'IPS: r81.20.240115, AV: 2024.01.15' },
  { id: 'se-2', timestamp: '2024-01-15T08:30:00Z', severity: 'info',     component: 'VPN',             message: 'Site-to-site VPN tunnel established',                       details: 'Peer: 198.51.100.10 (HQ-Branch-Office)' },
  { id: 'se-3', timestamp: '2024-01-15T06:00:00Z', severity: 'info',     component: 'Policy',          message: 'Security policy installed successfully',                    details: '7 rules installed in 2.3s' },
  { id: 'se-4', timestamp: '2024-01-14T23:55:00Z', severity: 'medium',   component: 'HA',              message: 'HA sync completed with warnings',                           details: 'Secondary member sync delay: 4s' },
  { id: 'se-5', timestamp: '2024-01-14T22:15:00Z', severity: 'info',     component: 'VPN',             message: 'Remote access user connected',                             details: 'User: jsmith from 203.0.113.201' },
  { id: 'se-6', timestamp: '2024-01-14T20:00:00Z', severity: 'critical', component: 'System',          message: 'High CPU utilization detected (92%)',                       details: 'Duration: 3 minutes. Process: fwk' },
  { id: 'se-7', timestamp: '2024-01-14T18:30:00Z', severity: 'info',     component: 'Administrator',   message: 'Administrator login: admin@192.168.1.10',                   details: 'Session duration: 47 minutes' },
  { id: 'se-8', timestamp: '2024-01-14T15:00:00Z', severity: 'medium',   component: 'Certificate',     message: 'Internal CA certificate expires in 30 days',               details: 'Certificate CN: QS-1500W-Internal-CA' },
];
