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

// ─── Firewall Rules ────────────────────────────────────────────────────────────
// Ordered: zone first, then origin within each zone.
// Two zones × five origins so every section header is exercised.

const O = 'ZONE.OUTGOING';
const I = 'ZONE.INTERNAL_INCOMING';
const PRE  = 'RULE_ORIGIN.SMP_PRE';
const MAN  = 'RULE_ORIGIN.MANUAL';
const POST = 'RULE_ORIGIN.SMP_POST';
const GEN  = 'RULE_ORIGIN.GENERATED';
const IOT  = 'RULE_ORIGIN.IOT';

export let mockFirewallRules: FirewallRule[] = [

  // ── ZONE.OUTGOING / SMP Pre-Policy Rules ───────────────────────────────────
  {
    id: 'fr-1', number: 1, zone: O, origin: PRE, sectionIdx: 1, idx: 1,
    name: 'SMP Pre — Block Known Bad IPs',
    source: [net('Internet')], destination: [net('Any')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'Injected by SMP before local policy',
  },
  {
    id: 'fr-2', number: 2, zone: O, origin: PRE, sectionIdx: 1, idx: 2,
    name: 'SMP Pre — Allow Management Heartbeat',
    source: [net('WAN')], destination: [net('Roypoint-GW')],
    service: [{ name: 'HTTPS', description: 'SMP management channel', tags: ['Management', 'TCP', 'Port 443'] }],
    action: 'Accept', track: 'None', enabled: true, installedOn: ['All'],
    comment: 'SMP controller reachability',
  },

  // ── ZONE.OUTGOING / Policy Rules (Manual) ──────────────────────────────────
  {
    id: 'fr-3', number: 3, zone: O, origin: MAN, sectionIdx: 2, idx: 1,
    name: 'Allow LAN to Internet',
    source: [net('LAN')], destination: [net('Internet')],
    service: [{ name: 'Any' }],
    action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'General outbound internet access',
  },
  {
    id: 'fr-4', number: 4, zone: O, origin: MAN, sectionIdx: 2, idx: 2,
    name: 'Allow DNS Outbound',
    source: [net('LAN')], destination: [net('Any')],
    service: [{ name: 'DNS', description: 'Domain Name System — UDP/TCP port 53.', tags: ['Infrastructure', 'UDP', 'TCP', 'Port 53'] }],
    action: 'Accept', track: 'None', enabled: true, installedOn: ['All'],
  },
  {
    id: 'fr-5', number: 5, zone: O, origin: MAN, sectionIdx: 2, idx: 3,
    name: 'Allow SMTP Outbound',
    source: [net('DMZ-Servers')], destination: [net('Internet')],
    service: [{ name: 'SMTP', description: 'Simple Mail Transfer Protocol — TCP port 25.', tags: ['Email', 'TCP', 'Port 25'] }],
    action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Mail relay from DMZ mail server',
  },
  {
    id: 'fr-6', number: 6, zone: O, origin: MAN, sectionIdx: 2, idx: 4,
    name: 'Block P2P Applications',
    source: [net('LAN')], destination: [net('Any')],
    service: [
      { name: 'BitTorrent', description: 'Peer-to-peer file sharing — high bandwidth risk.', tags: ['P2P', 'High Bandwidth', 'Medium Risk'] },
      { name: 'eDonkey',    description: 'eDonkey2000 P2P network — copyright risk.',        tags: ['P2P', 'High Bandwidth', 'High Risk'] },
    ],
    action: 'Drop', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Block peer-to-peer applications',
  },
  {
    id: 'fr-7', number: 7, zone: O, origin: MAN, sectionIdx: 2, idx: 5,
    name: 'Block Social Media',
    source: [net('LAN')], destination: [net('Internet')],
    service: [{ name: 'HTTP' }, { name: 'HTTPS' }],
    action: 'Drop', track: 'Log', enabled: false, installedOn: ['All'],
    comment: 'Disabled — policy under review',
  },

  // ── ZONE.OUTGOING / SMP Post-Policy Rules ──────────────────────────────────
  {
    id: 'fr-8', number: 8, zone: O, origin: POST, sectionIdx: 3, idx: 1,
    name: 'SMP Post — Log Remaining Outbound',
    source: [net('Any')], destination: [net('Internet')],
    service: [{ name: 'Any' }],
    action: 'Accept', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'SMP audit: log all unmatched outbound',
  },
  {
    id: 'fr-9', number: 9, zone: O, origin: POST, sectionIdx: 3, idx: 2,
    name: 'SMP Post — Outbound Cleanup Drop',
    source: [net('Any')], destination: [net('Any')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Implicit deny — end of outgoing policy',
  },

  // ── ZONE.INTERNAL_INCOMING / SMP Pre-Policy Rules ──────────────────────────
  {
    id: 'fr-10', number: 10, zone: I, origin: PRE, sectionIdx: 1, idx: 1,
    name: 'SMP Pre — Allow Check Point Updates',
    source: [net('Internet')], destination: [net('Roypoint-GW')],
    service: [{ name: 'HTTPS', description: 'Check Point update servers.', tags: ['Management', 'Updates'] }],
    action: 'Accept', track: 'None', enabled: true, installedOn: ['All'],
    comment: 'Required for blade signature updates',
  },
  {
    id: 'fr-11', number: 11, zone: I, origin: PRE, sectionIdx: 1, idx: 2,
    name: 'SMP Pre — Block RFC1918 Spoofing',
    source: [net('Internet')], destination: [net('LAN')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'Anti-spoofing — RFC 1918 from WAN',
  },

  // ── ZONE.INTERNAL_INCOMING / Policy Rules (Manual) ─────────────────────────
  {
    id: 'fr-12', number: 12, zone: I, origin: MAN, sectionIdx: 2, idx: 1,
    name: 'Allow DMZ Web Inbound',
    source: [net('Internet')], destination: [net('DMZ-WebServer')],
    service: [
      { name: 'HTTP',  description: 'HTTP — TCP port 80.',  tags: ['Web', 'TCP', 'Port 80', 'Unencrypted'] },
      { name: 'HTTPS', description: 'HTTPS — TCP port 443.', tags: ['Web', 'TCP', 'Port 443', 'Encrypted'] },
    ],
    action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Public web server access',
  },
  {
    id: 'fr-13', number: 13, zone: I, origin: MAN, sectionIdx: 2, idx: 2,
    name: 'Allow VPN Remote Access',
    source: [net('VPN_RA_Community')], destination: [net('LAN')],
    service: [{ name: 'Any' }],
    action: 'Encrypt', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Remote employees via VPN',
  },
  {
    id: 'fr-14', number: 14, zone: I, origin: MAN, sectionIdx: 2, idx: 3,
    name: 'Allow SSH from Mgmt Network',
    source: [net('LAN-Users')], destination: [net('DMZ-Servers')],
    service: [{ name: 'SSH', description: 'Secure Shell — encrypted remote access, TCP port 22.', tags: ['Management', 'TCP', 'Port 22', 'Encrypted'] }],
    action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Admins only — monitored',
  },
  {
    id: 'fr-15', number: 15, zone: I, origin: MAN, sectionIdx: 2, idx: 4,
    name: 'Block SMB from WAN',
    source: [net('WAN')], destination: [net('LAN')],
    service: [{ name: 'SMB', description: 'Server Message Block — file sharing, TCP port 445.', tags: ['File Sharing', 'TCP', 'Port 445', 'High Risk'] }],
    action: 'Drop', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'Prevent ransomware lateral movement',
  },
  {
    id: 'fr-16', number: 16, zone: I, origin: MAN, sectionIdx: 2, idx: 5,
    name: 'Stealth Rule',
    source: [net('Any')], destination: [net('Roypoint-GW')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'Protect the gateway from direct access',
  },

  // ── ZONE.INTERNAL_INCOMING / Auto Generated Rules ──────────────────────────
  {
    id: 'fr-17', number: 17, zone: I, origin: GEN, sectionIdx: 3, idx: 1,
    name: 'Auto: LAN NAT Masquerade',
    source: [net('LAN')], destination: [net('Internet')],
    service: [{ name: 'Any' }],
    action: 'Accept', track: 'None', enabled: true, installedOn: ['All'],
    comment: 'Auto-generated by NAT policy',
  },
  {
    id: 'fr-18', number: 18, zone: I, origin: GEN, sectionIdx: 3, idx: 2,
    name: 'Auto: VPN Route Permit',
    source: [net('VPN_RA_Community')], destination: [net('DMZ')],
    service: [{ name: 'Any' }],
    action: 'Encrypt', track: 'None', enabled: true, installedOn: ['All'],
    comment: 'Auto-generated by VPN community',
  },
  {
    id: 'fr-19', number: 19, zone: I, origin: GEN, sectionIdx: 3, idx: 3,
    name: 'Auto: DHCP Relay',
    source: [net('LAN')], destination: [net('Roypoint-GW')],
    service: [{ name: 'DNS' }],
    action: 'Accept', track: 'None', enabled: true, installedOn: ['All'],
    comment: 'Auto-generated by DHCP blade',
  },

  // ── ZONE.INTERNAL_INCOMING / IoT Rules ─────────────────────────────────────
  {
    id: 'fr-20', number: 20, zone: I, origin: IOT, sectionIdx: 4, idx: 1,
    name: 'IoT — Isolate Device Segment',
    source: [net('LAN')], destination: [net('DMZ')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'IoT devices cannot reach corporate LAN',
  },
  {
    id: 'fr-21', number: 21, zone: I, origin: IOT, sectionIdx: 4, idx: 2,
    name: 'IoT — Allow Camera Telemetry',
    source: [net('DMZ')], destination: [net('Internet')],
    service: [{ name: 'HTTPS', description: 'Camera cloud upload endpoint.', tags: ['IoT', 'Camera', 'Encrypted'] }],
    action: 'Accept', track: 'Log', enabled: true, installedOn: ['All'],
    comment: 'Security cameras → cloud NVR',
  },
  {
    id: 'fr-22', number: 22, zone: I, origin: IOT, sectionIdx: 4, idx: 3,
    name: 'IoT — Block Inter-Device Traffic',
    source: [net('DMZ')], destination: [net('DMZ')],
    service: [{ name: 'Any' }],
    action: 'Drop', track: 'Alert', enabled: true, installedOn: ['All'],
    comment: 'Prevent IoT lateral movement',
  },
  {
    id: 'fr-23', number: 23, zone: I, origin: IOT, sectionIdx: 4, idx: 4,
    name: 'IoT — Smart Sensor Reporting',
    source: [net('DMZ')], destination: [net('DMZ-Servers')],
    service: [{ name: 'HTTP' }],
    action: 'Accept', track: 'None', enabled: false, installedOn: ['All'],
    comment: 'Disabled — sensor protocol migration pending',
  },
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
