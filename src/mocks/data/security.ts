import type { FirewallRule, NatRule, NetworkItem } from '../../types/security';

// ─── Network object lookup (simulates normalized gateway objects) ──────────────
const NET: Record<string, NetworkItem> = {
  Any:              { name: 'Any' },
  LAN:              { name: 'LAN',              type: 'Network',              iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK' },
  Internet:         { name: 'Internet',          type: 'Zone',                 iconKey: 'NETWORKOBJECT_BASIC_TYPE.ZONE' },
  DMZ:              { name: 'DMZ',               type: 'Network',              iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK' },
  'DMZ-WebServer':  { name: 'DMZ-WebServer',     type: 'Host',                 iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
  'Roypoint-GW':  { name: 'Roypoint-GW',     type: 'Host',                 iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
  VPN_RA_Community: { name: 'VPN_RA_Community',  type: 'VPN Community',        iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK' },
  'LAN-Users':      { name: 'LAN-Users',         type: 'Network object group', iconKey: 'networkObjectsGroup',
                      members: [{ name: 'Mgmt-PC', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' }, { name: 'Dev-Workstation', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' }] },
  'DMZ-Servers':    { name: 'DMZ-Servers',       type: 'Network object group', iconKey: 'networkObjectsGroup',
                      members: [{ name: 'Web-01', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' }, { name: 'Mail-01', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' }, { name: 'DB-01', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' }] },
  WAN:              { name: 'WAN',               type: 'Network',              iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK' },
};

function net(name: string): NetworkItem {
  return NET[name] ?? { name };
}

// ─── Firewall Rules (60 rows, full list for DnD) ───────────────────────────────
const FW_ACTIONS  = ['Accept', 'Drop', 'Encrypt', 'Reject'] as const;
const FW_TRACKS   = ['Log', 'None', 'Alert'] as const;
const SOURCES     = ['LAN', 'Internet', 'DMZ', 'VPN_RA_Community', 'Any', 'LAN-Users', 'DMZ-Servers', 'WAN'];
const DESTS       = ['Internet', 'LAN', 'DMZ-WebServer', 'Roypoint-GW', 'Any', 'LAN-Users', 'WAN', 'DMZ-Servers'];
const SERVICES_FW = ['Any', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'RDP', 'SMTP', 'FTP', 'BitTorrent,eDonkey', 'SMB'];

export let mockFirewallRules: FirewallRule[] = [
  { id: 'fr-1', number: 1, name: 'Allow LAN to Internet',   source: [net('LAN')],              destination: [net('Internet')],     service: [{ name: 'Any' }],                             action: 'Accept',  track: 'Log',   enabled: true,  installedOn: ['All'], comment: 'Outbound internet access' },
  { id: 'fr-2', number: 2, name: 'Allow DNS',               source: [net('LAN')],              destination: [net('Any')],          service: [{ name: 'DNS', description: 'Domain Name System — translates hostnames to IP addresses. Operates on UDP/TCP port 53.', tags: ['Infrastructure', 'UDP', 'TCP', 'Port 53'] }], action: 'Accept', track: 'None', enabled: true, installedOn: ['All'] },
  { id: 'fr-3', number: 3, name: 'Block P2P',               source: [net('LAN')],              destination: [net('Any')],          service: [{ name: 'BitTorrent', description: 'BitTorrent is a peer-to-peer file sharing protocol. Can consume high bandwidth and bypass standard port filtering.', tags: ['High Bandwidth', 'P2P', 'File Sharing', 'Medium Risk'] }, { name: 'eDonkey', description: 'eDonkey2000 is a decentralized peer-to-peer file sharing network. Associated with copyright-infringing downloads.', tags: ['High Bandwidth', 'P2P', 'File Sharing', 'High Risk'] }], action: 'Drop', track: 'Log', enabled: true, installedOn: ['All'], comment: 'Block peer-to-peer applications' },
  { id: 'fr-4', number: 4, name: 'Allow DMZ Web',           source: [net('Internet')],         destination: [net('DMZ-WebServer')], service: [{ name: 'HTTP', description: 'Hypertext Transfer Protocol — unencrypted web traffic. Operates on TCP port 80.', tags: ['Web', 'TCP', 'Port 80', 'Unencrypted'] }, { name: 'HTTPS', description: 'HTTP Secure — encrypted web traffic using TLS/SSL. Operates on TCP port 443.', tags: ['Web', 'TCP', 'Port 443', 'Encrypted', 'SSL/TLS'] }], action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'], comment: 'Inbound web traffic to DMZ' },
  { id: 'fr-5', number: 5, name: 'Allow VPN Remote Access', source: [net('VPN_RA_Community')], destination: [net('LAN')],          service: [{ name: 'Any' }],                             action: 'Encrypt', track: 'Log',   enabled: true,  installedOn: ['All'] },
  { id: 'fr-6', number: 6, name: 'Stealth Rule',            source: [net('Any')],              destination: [net('Roypoint-GW')],service: [{ name: 'Any' }],                             action: 'Drop',    track: 'Alert', enabled: true,  installedOn: ['All'], comment: 'Protect the gateway itself' },
  { id: 'fr-7', number: 7, name: 'Cleanup Rule',            source: [net('Any')],              destination: [net('Any')],          service: [{ name: 'Any' }],                             action: 'Drop',    track: 'Log',   enabled: true,  installedOn: ['All'], comment: 'Drop everything else' },
  ...Array.from({ length: 53 }, (_, i): FirewallRule => {
    const n      = i + 8;
    const src    = SOURCES[n % SOURCES.length];
    const dst    = DESTS[n % DESTS.length];
    const svc    = SERVICES_FW[n % SERVICES_FW.length];
    const action = FW_ACTIONS[n % FW_ACTIONS.length];
    const track  = FW_TRACKS[n % FW_TRACKS.length];
    return {
      id: `fr-${n}`,
      number: n,
      name: `Rule ${n} — ${src} to ${dst}`,
      source:      [net(src)],
      destination: [net(dst)],
      service: [{ name: svc }],
      action,
      track,
      enabled: n % 7 !== 0,
      installedOn: ['All'],
      comment: `Auto-generated rule ${n}`,
    };
  }),
];

// ─── NAT Rules (40 rows) ──────────────────────────────────────────────────────
const NAT_TYPES = ['hide', 'static'] as const;

export let mockNatRules: NatRule[] = [
  {
    id: 'nat-1', number: 1,
    name: 'Hide LAN',
    originalSource: 'LAN', originalDestination: 'Any', originalService: 'Any',
    translatedSource: 'eth0', translatedDestination: 'Original', translatedService: 'Original',
    type: 'hide', enabled: true, comment: 'Masquerade LAN behind WAN IP',
  },
  {
    id: 'nat-2', number: 2,
    name: 'DMZ Web Server',
    originalSource: 'Any', originalDestination: '203.0.113.5', originalService: 'HTTP',
    translatedSource: 'Original', translatedDestination: '172.16.10.10', translatedService: 'Original',
    type: 'static', enabled: true, comment: 'Static NAT for web server',
  },
  ...Array.from({ length: 38 }, (_, i): NatRule => {
    const n    = i + 3;
    const type = NAT_TYPES[n % 2];
    const origSrc  = n % 3 === 0 ? 'Any' : n % 3 === 1 ? 'LAN' : 'DMZ';
    const origDst  = `203.0.113.${(n % 200) + 5}`;
    const transDst = `172.16.${(n % 10)}.${(n % 200) + 10}`;
    return {
      id: `nat-${n}`,
      number: n,
      name: `NAT Rule ${n} — ${type}`,
      originalSource: origSrc,
      originalDestination: type === 'static' ? origDst : 'Any',
      originalService: ['Any', 'HTTP', 'HTTPS', 'SMTP', 'DNS'][n % 5],
      translatedSource: type === 'hide' ? 'eth0' : 'Original',
      translatedDestination: type === 'static' ? transDst : 'Original',
      translatedService: 'Original',
      type,
      enabled: n % 8 !== 0,
      comment: `Auto-generated NAT rule ${n}`,
    };
  }),
];
