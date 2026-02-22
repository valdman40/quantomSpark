export type InterfaceType = 'ethernet' | 'vlan' | 'bond' | 'bridge' | 'loopback';
export type InterfaceStatus = 'up' | 'down' | 'disabled';

export interface NetworkInterface {
  id: string;
  name: string;
  type: InterfaceType;
  ipAddress: string;
  subnetMask: string;
  gateway?: string;
  status: InterfaceStatus;
  speedMbps: number;
  macAddress: string;
  mtu: number;
  comment?: string;
  zone: 'external' | 'internal' | 'dmz' | 'sync' | 'none';
  dhcp: boolean;
}

export type RouteType = 'static' | 'connected' | 'dynamic';

export interface StaticRoute {
  id: string;
  destination: string;
  mask: string;
  gateway: string;
  interface: string;
  metric: number;
  type: RouteType;
  comment?: string;
}

export interface DnsSettings {
  primaryDns: string;
  secondaryDns: string;
  tertiaryDns?: string;
  domainSuffix: string;
  localDomains: string[];
  enableCache: boolean;
}
