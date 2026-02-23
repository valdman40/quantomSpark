import type { VpnTunnel, RemoteAccessSettings, RemoteAccessUser, EncryptionAlgorithm, HashAlgorithm, DhGroup } from '../../types/vpn';

// ─── Tunnels (30 rows) ────────────────────────────────────────────────────────
const IKE_VERSIONS  = ['IKEv2', 'IKEv1'] as const;
const ENCRYPTIONS: EncryptionAlgorithm[] = ['AES-256', 'AES-128', '3DES'];
const HASHES: HashAlgorithm[]            = ['SHA256', 'SHA384', 'SHA1', 'MD5'];
const DH_GROUPS: DhGroup[]               = ['Group14', 'Group20', 'Group2', 'Group5', 'Group19'];
const CITIES        = ['London', 'Frankfurt', 'Paris', 'Tokyo', 'New York', 'Sydney', 'Singapore', 'Amsterdam', 'Toronto', 'Dubai'];
const STATUSES: VpnTunnel['status'][] = ['connected', 'connected', 'connected', 'disconnected', 'error'];

export let mockTunnels: VpnTunnel[] = [
  {
    id: 'vpn-1', name: 'HQ-Branch-Office',
    peerIp: '198.51.100.10', peerName: 'Branch Office - London',
    status: 'connected', ikeVersion: 'IKEv2',
    phase1Encryption: 'AES-256', phase1Hash: 'SHA256', phase1DhGroup: 'Group14', phase1Lifetime: 86400,
    phase2Encryption: 'AES-256', phase2Hash: 'SHA256', phase2Lifetime: 3600,
    localSubnets: ['192.168.1.0/24'], remoteSubnets: ['10.10.0.0/24'],
    lastConnected: '2026-02-22T08:00:00Z', bytesSent: 1_258_291, bytesReceived: 4_194_304,
    comment: 'Primary S2S tunnel to London branch',
  },
  {
    id: 'vpn-2', name: 'HQ-DataCenter',
    peerIp: '198.51.100.50', peerName: 'Data Center - Frankfurt',
    status: 'connected', ikeVersion: 'IKEv2',
    phase1Encryption: 'AES-256', phase1Hash: 'SHA384', phase1DhGroup: 'Group20', phase1Lifetime: 86400,
    phase2Encryption: 'AES-256', phase2Hash: 'SHA384', phase2Lifetime: 3600,
    localSubnets: ['192.168.1.0/24', '172.16.10.0/24'], remoteSubnets: ['10.20.0.0/16'],
    lastConnected: '2026-02-22T06:15:00Z', bytesSent: 52_428_800, bytesReceived: 104_857_600,
    comment: 'High-bandwidth link to Frankfurt DC',
  },
  {
    id: 'vpn-3', name: 'HQ-RemoteSite-Paris',
    peerIp: '198.51.100.75', peerName: 'Remote Site - Paris',
    status: 'disconnected', ikeVersion: 'IKEv1',
    phase1Encryption: 'AES-128', phase1Hash: 'SHA1', phase1DhGroup: 'Group2', phase1Lifetime: 28800,
    phase2Encryption: 'AES-128', phase2Hash: 'SHA1', phase2Lifetime: 3600,
    localSubnets: ['192.168.1.0/24'], remoteSubnets: ['10.30.0.0/24'],
    bytesSent: 0, bytesReceived: 0,
    comment: 'Backup tunnel - Paris office',
  },
  ...Array.from({ length: 27 }, (_, i): VpnTunnel => {
    const n      = i + 4;
    const city   = CITIES[n % CITIES.length];
    const status = STATUSES[n % STATUSES.length];
    const enc    = ENCRYPTIONS[n % ENCRYPTIONS.length];
    const hash   = HASHES[n % HASHES.length];
    const dhgrp  = DH_GROUPS[n % DH_GROUPS.length];
    const ike    = IKE_VERSIONS[n % 2];
    const peer1  = `198.51.${(n % 100) + 10}.${(n * 7) % 254 + 1}`;
    const remNet = `10.${(n % 200) + 40}.0.0`;
    const connected = status !== 'disconnected';
    return {
      id: `vpn-${n}`,
      name: `HQ-Site-${city.replace(' ', '-')}-${n}`,
      peerIp: peer1,
      peerName: `Remote Office - ${city}`,
      status,
      ikeVersion: ike,
      phase1Encryption: enc,
      phase1Hash: hash,
      phase1DhGroup: dhgrp,
      phase1Lifetime: n % 2 === 0 ? 86400 : 28800,
      phase2Encryption: enc,
      phase2Hash: hash,
      phase2Lifetime: 3600,
      localSubnets: ['192.168.1.0/24'],
      remoteSubnets: [`${remNet}/24`],
      ...(connected ? {
        lastConnected: new Date(Date.UTC(2026, 1, 22) - n * 3_600_000).toISOString(),
        bytesSent:     n * 1_024_000,
        bytesReceived: n * 4_096_000,
      } : {
        bytesSent: 0,
        bytesReceived: 0,
      }),
      comment: `Auto-generated tunnel to ${city}`,
    };
  }),
];

// ─── Remote Access Settings ───────────────────────────────────────────────────
export const mockRemoteAccess: RemoteAccessSettings = {
  enabled: true,
  officeModeEnabled: true,
  officeModeNetwork: '10.8.0.0/24',
  authMethod: 'username-password',
  maxConcurrentConnections: 50,
  sessionTimeout: 480,
  bladeEnabled: true,
};

// ─── Remote Users (25 rows) ───────────────────────────────────────────────────
const USERNAMES = [
  'jsmith', 'adavis', 'mlee', 'bwilson', 'cjones', 'ttaylor', 'lmartinez',
  'pthomas', 'rharris', 'kwhite', 'sclark', 'dlewis', 'arobinson', 'jwalk',
  'nscott', 'eyoung', 'fkumar', 'gchen', 'hpatel', 'irosen',
  'jnguyen', 'kmiller', 'lperez', 'mbrooks', 'ngray',
];

export let mockRemoteUsers: RemoteAccessUser[] = [
  { id: 'ru-1', username: 'jsmith', clientIp: '203.0.113.201', assignedIp: '10.8.0.2',  connectedSince: '2026-02-22T09:00:00Z', bytesSent: 102400,  bytesReceived: 512000  },
  { id: 'ru-2', username: 'adavis', clientIp: '198.51.100.33', assignedIp: '10.8.0.3',  connectedSince: '2026-02-22T08:30:00Z', bytesSent: 51200,   bytesReceived: 204800  },
  { id: 'ru-3', username: 'mlee',   clientIp: '203.0.113.155', assignedIp: '10.8.0.4',  connectedSince: '2026-02-22T10:15:00Z', bytesSent: 20480,   bytesReceived: 81920   },
  ...Array.from({ length: 22 }, (_, i): RemoteAccessUser => {
    const n        = i + 4;
    const username = USERNAMES[n % USERNAMES.length];
    const clientOct1 = n % 2 === 0 ? '203.0.113' : '198.51.100';
    const clientOct2 = (n * 13) % 200 + 10;
    const assignedOct = n + 4;
    const hoursAgo = n % 12;
    return {
      id: `ru-${n}`,
      username: `${username}${n}`,
      clientIp: `${clientOct1}.${clientOct2}`,
      assignedIp: `10.8.0.${assignedOct}`,
      connectedSince: new Date(Date.UTC(2026, 1, 22, 10, 0) - hoursAgo * 3_600_000).toISOString(),
      bytesSent:     (n % 20 + 1) * 10240,
      bytesReceived: (n % 20 + 1) * 51200,
    };
  }),
];
