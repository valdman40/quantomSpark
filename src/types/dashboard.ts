export interface SystemStats {
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  uptimeSeconds: number;
  firmwareVersion: string;
  modelName: string;
  serialNumber: string;
  managementIp: string;
}

export interface ThreatStats {
  blockedThreats: number;
  ipsEvents: number;
  avEvents: number;
  urlFilteringEvents: number;
  antiSpamEvents: number;
  lastUpdated: string;
}

export interface InterfaceSummary {
  name: string;
  ipAddress: string;
  status: 'up' | 'down';
  type: 'external' | 'internal' | 'dmz' | 'vpn';
  speedMbps: number;
}

export interface RecentAlert {
  id: string;
  timestamp: string;
  blade: string;
  action: 'Accept' | 'Drop' | 'Reject' | 'Encrypt';
  sourceIp: string;
  destinationIp: string;
  service: string;
  ruleName: string;
}

export interface DashboardData {
  systemStats: SystemStats;
  threatStats: ThreatStats;
  interfaces: InterfaceSummary[];
  recentAlerts: RecentAlert[];
}
