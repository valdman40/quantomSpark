import type { FirewallRule, NatRule } from '../../types/security';

export const mockFirewallRules: FirewallRule[] = [
  {
    id: 'fr-1', number: 1,
    name: 'Allow LAN to Internet',
    source: ['LAN'], destination: ['Internet'], service: ['Any'],
    action: 'Accept', track: 'Log', enabled: true,
    installedOn: ['All'], comment: 'Outbound internet access',
  },
  {
    id: 'fr-2', number: 2,
    name: 'Allow DNS',
    source: ['LAN'], destination: ['Any'], service: ['DNS'],
    action: 'Accept', track: 'None', enabled: true,
    installedOn: ['All'],
  },
  {
    id: 'fr-3', number: 3,
    name: 'Block P2P',
    source: ['LAN'], destination: ['Any'], service: ['BitTorrent', 'eDonkey'],
    action: 'Drop', track: 'Log', enabled: true,
    installedOn: ['All'], comment: 'Block peer-to-peer applications',
  },
  {
    id: 'fr-4', number: 4,
    name: 'Allow DMZ Web',
    source: ['Internet'], destination: ['DMZ-WebServer'], service: ['HTTP', 'HTTPS'],
    action: 'Accept', track: 'Log', enabled: true,
    installedOn: ['All'], comment: 'Inbound web traffic to DMZ',
  },
  {
    id: 'fr-5', number: 5,
    name: 'Allow VPN Remote Access',
    source: ['VPN_RA_Community'], destination: ['LAN'], service: ['Any'],
    action: 'Encrypt', track: 'Log', enabled: true,
    installedOn: ['All'],
  },
  {
    id: 'fr-6', number: 6,
    name: 'Stealth Rule',
    source: ['Any'], destination: ['Checkpoint-GW'], service: ['Any'],
    action: 'Drop', track: 'Alert', enabled: true,
    installedOn: ['All'], comment: 'Protect the gateway itself',
  },
  {
    id: 'fr-7', number: 7,
    name: 'Cleanup Rule',
    source: ['Any'], destination: ['Any'], service: ['Any'],
    action: 'Drop', track: 'Log', enabled: true,
    installedOn: ['All'], comment: 'Drop everything else',
  },
];

export const mockNatRules: NatRule[] = [
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
];
