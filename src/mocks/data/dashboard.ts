import type { DashboardData } from '../../types/dashboard';

export const mockDashboard: DashboardData = {
  systemStats: {
    cpuPercent: 18,
    memoryPercent: 43,
    diskPercent: 27,
    uptimeSeconds: 1_296_000, // 15 days
    firmwareVersion: 'R81.20.10',
    modelName: 'Quantum Spark 1500W',
    serialNumber: 'QS-2024-A8B3C1',
    managementIp: '192.168.1.1',
  },
  threatStats: {
    blockedThreats: 1_247,
    ipsEvents: 83,
    avEvents: 12,
    urlFilteringEvents: 421,
    antiSpamEvents: 56,
    lastUpdated: new Date().toISOString(),
  },
  interfaces: [
    { name: 'eth0', ipAddress: '203.0.113.5', status: 'up',   type: 'external', speedMbps: 1000 },
    { name: 'eth1', ipAddress: '192.168.1.1', status: 'up',   type: 'internal', speedMbps: 1000 },
    { name: 'eth2', ipAddress: '172.16.10.1', status: 'up',   type: 'dmz',      speedMbps: 1000 },
    { name: 'eth3', ipAddress: 'N/A',         status: 'down', type: 'internal', speedMbps: 0    },
    { name: 'vpn0', ipAddress: '10.8.0.1',    status: 'up',   type: 'vpn',      speedMbps: 0    },
  ],
  recentAlerts: [
    { id: 'a1', timestamp: '2024-01-15T10:23:14Z', blade: 'IPS',              action: 'Drop',   sourceIp: '198.51.100.42', destinationIp: '192.168.1.20', service: 'HTTP',   ruleName: 'IPS Default Block' },
    { id: 'a2', timestamp: '2024-01-15T10:21:05Z', blade: 'Anti-Virus',       action: 'Drop',   sourceIp: '198.51.100.88', destinationIp: '192.168.1.15', service: 'SMTP',   ruleName: 'AV Mail Scan'      },
    { id: 'a3', timestamp: '2024-01-15T10:18:33Z', blade: 'URL Filtering',    action: 'Drop',   sourceIp: '192.168.1.30', destinationIp: '203.0.113.99',  service: 'HTTPS',  ruleName: 'Block Social Media' },
    { id: 'a4', timestamp: '2024-01-15T10:15:11Z', blade: 'Firewall',         action: 'Accept', sourceIp: '192.168.1.10', destinationIp: '8.8.8.8',       service: 'DNS',    ruleName: 'Allow DNS'          },
    { id: 'a5', timestamp: '2024-01-15T10:12:58Z', blade: 'Application Control', action: 'Drop', sourceIp: '192.168.1.45', destinationIp: '203.0.113.77', service: 'HTTPS',  ruleName: 'Block P2P'          },
  ],
};
