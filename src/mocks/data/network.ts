import type { NetworkInterface, StaticRoute, DnsSettings } from '../../types/network';

// ─── Interfaces (30 rows) ──────────────────────────────────────────────────────
const IF_ZONES = ['external', 'internal', 'dmz', 'sync', 'none'] as const;
const IF_TYPES: NetworkInterface['type'][] = ['ethernet', 'ethernet', 'ethernet', 'vlan', 'bond', 'loopback'];

export let mockInterfaces: NetworkInterface[] = [
  {
    id: 'if-1', name: 'eth0', type: 'ethernet',
    ipAddress: '203.0.113.5', subnetMask: '255.255.255.0', gateway: '203.0.113.1',
    status: 'up', speedMbps: 1000, macAddress: '00:1A:4B:C8:10:01', mtu: 1500,
    zone: 'external', dhcp: false, comment: 'WAN / ISP uplink',
  },
  {
    id: 'if-2', name: 'eth1', type: 'ethernet',
    ipAddress: '192.168.1.1', subnetMask: '255.255.255.0',
    status: 'up', speedMbps: 1000, macAddress: '00:1A:4B:C8:10:02', mtu: 1500,
    zone: 'internal', dhcp: false, comment: 'LAN',
  },
  {
    id: 'if-3', name: 'eth2', type: 'ethernet',
    ipAddress: '172.16.10.1', subnetMask: '255.255.255.0',
    status: 'up', speedMbps: 1000, macAddress: '00:1A:4B:C8:10:03', mtu: 1500,
    zone: 'dmz', dhcp: false, comment: 'DMZ segment',
  },
  {
    id: 'if-4', name: 'eth3', type: 'ethernet',
    ipAddress: '', subnetMask: '',
    status: 'down', speedMbps: 0, macAddress: '00:1A:4B:C8:10:04', mtu: 1500,
    zone: 'none', dhcp: false, comment: 'Unused',
  },
  ...Array.from({ length: 26 }, (_, i): NetworkInterface => {
    const n    = i + 5;
    const zone = IF_ZONES[n % IF_ZONES.length];
    const type = IF_TYPES[n % IF_TYPES.length];
    const name = type === 'vlan'     ? `eth0.${n * 10}`
               : type === 'bond'     ? `bond${n % 4}`
               : type === 'loopback' ? `lo${n % 3}`
               : `eth${n}`;
    const subnet = zone === 'internal' ? '192.168' : zone === 'dmz' ? '172.16' : zone === 'external' ? '203.0.113' : '10.0';
    const octet3 = n % 5;
    const ipPrefix = subnet === '203.0.113' ? `203.0.113.${n + 10}` : `${subnet}.${octet3}.${n + 1}`;
    const up = n % 5 !== 0;
    const hi = Math.floor(n / 256).toString(16).padStart(2, '0').toUpperCase();
    const lo = (n % 256).toString(16).padStart(2, '0').toUpperCase();
    return {
      id: `if-${n}`,
      name,
      type,
      ipAddress: up ? ipPrefix : '',
      subnetMask: up ? '255.255.255.0' : '',
      ...(zone === 'external' && up ? { gateway: '203.0.113.1' } : {}),
      status: up ? 'up' : 'down',
      speedMbps: up ? [100, 1000, 10000][n % 3] : 0,
      macAddress: `00:1A:4B:C8:${hi}:${lo}`,
      mtu: type === 'loopback' ? 65536 : 1500,
      zone,
      dhcp: zone === 'internal' && n % 4 === 0,
      comment: `Auto-generated interface ${n}`,
    };
  }),
];

// ─── Routes (60 rows) ─────────────────────────────────────────────────────────
const ROUTE_TYPES: StaticRoute['type'][] = ['static', 'connected', 'dynamic', 'static'];

export let mockRoutes: StaticRoute[] = [
  { id: 'r-1', destination: '0.0.0.0',    mask: '0.0.0.0',       gateway: '203.0.113.1',  interface: 'eth0', metric: 1,  type: 'static',    comment: 'Default route'  },
  { id: 'r-2', destination: '10.0.0.0',   mask: '255.0.0.0',     gateway: '192.168.1.254', interface: 'eth1', metric: 10, type: 'static',   comment: 'Private ranges' },
  { id: 'r-3', destination: '192.168.1.0', mask: '255.255.255.0', gateway: '0.0.0.0',      interface: 'eth1', metric: 1,  type: 'connected', comment: 'LAN subnet'     },
  { id: 'r-4', destination: '172.16.10.0', mask: '255.255.255.0', gateway: '0.0.0.0',      interface: 'eth2', metric: 1,  type: 'connected', comment: 'DMZ subnet'     },
  ...Array.from({ length: 56 }, (_, i): StaticRoute => {
    const n    = i + 5;
    const type = ROUTE_TYPES[n % ROUTE_TYPES.length];
    const oct1 = [10, 172, 192][n % 3];
    const oct2 = oct1 === 10 ? (n % 50) + 1 : oct1 === 172 ? (n % 16) + 16 : 168;
    const oct3 = n % 255;
    const dest = `${oct1}.${oct2}.${oct3}.0`;
    const mask = n % 4 === 0 ? '255.255.0.0' : n % 4 === 1 ? '255.255.255.0' : n % 4 === 2 ? '255.255.255.128' : '255.0.0.0';
    const gw   = type === 'connected' ? '0.0.0.0' : `192.168.1.${(n % 250) + 1}`;
    const iface = `eth${n % 4}`;
    return {
      id: `r-${n}`,
      destination: dest,
      mask,
      gateway: gw,
      interface: iface,
      metric: (n % 20) + 1,
      type,
      comment: `${type} route to ${dest}`,
    };
  }),
];

// ─── DNS ──────────────────────────────────────────────────────────────────────
export const mockDns: DnsSettings = {
  primaryDns: '8.8.8.8',
  secondaryDns: '8.8.4.4',
  tertiaryDns: '1.1.1.1',
  domainSuffix: 'corp.local',
  localDomains: ['corp.local', 'internal.corp'],
  enableCache: true,
};
