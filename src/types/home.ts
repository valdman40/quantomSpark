// ─── Shared (replacing dashboard.ts) ─────────────────────────────────────────
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

export interface InterfaceSummary {
  name: string;
  ipAddress: string;
  status: 'up' | 'down';
  type: 'external' | 'internal' | 'dmz' | 'vpn';
  speedMbps: number;
}

export interface ThreatStats {
  blockedThreats: number;
  ipsEvents: number;
  avEvents: number;
  urlFilteringEvents: number;
  antiSpamEvents: number;
  lastUpdated: string;
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

// ─── System Overview (/home/system) ──────────────────────────────────────────
export type BladeStatus = 'on' | 'off' | 'bypass';

export interface BladeState {
  name: string;
  status: BladeStatus;
}

export interface ConnectionStats {
  activeConnections: number;
  httpsConnections: number;
  httpConnections: number;
  otherConnections: number;
}

export interface HardwareInfo {
  cpuCores: number;
  totalRamGb: number;
  totalStorageGb: number;
}

export interface SystemOverviewData {
  systemStats: SystemStats;
  interfaces: InterfaceSummary[];
  blades: BladeState[];
  connections: ConnectionStats;
  hardware: HardwareInfo;
}

// ─── Security Dashboard (/home/security-dashboard) ───────────────────────────
export interface BladeHealthEntry {
  name: string;
  status: BladeStatus;
  eventsLast24h: number;
  version?: string;
}

export interface PolicyInstallStatus {
  lastInstalled: string;
  installedBy: string;
  rulesCount: number;
  status: 'ok' | 'pending' | 'failed';
}

export interface BlockedCategory {
  name: string;
  count: number;
  color: string;
}

export interface SecurityDashboardData {
  threatStats: ThreatStats;
  recentAlerts: RecentAlert[];
  bladeHealth: BladeHealthEntry[];
  policyStatus: PolicyInstallStatus;
  topBlockedCategories: BlockedCategory[];
}

// ─── Notifications (/home/notifications) ─────────────────────────────────────
export type NotificationSeverity = 'info' | 'warning' | 'error';
export type NotificationCategory = 'System' | 'Security' | 'VPN' | 'Update' | 'License' | 'HA' | 'Network';

export interface SystemNotification {
  id: string;
  timestamp: string;
  severity: NotificationSeverity;
  category: NotificationCategory;
  message: string;
  read: boolean;
}

// ─── Blade controls (for Security Dashboard) ─────────────────────────────────
export interface BladeControl {
  id: string;
  name: string;
  iconType: string;
  enabled: boolean;
  license?: 'trial' | 'expired';
}

export interface BladeCategory {
  id: string;
  name: string;
  blades: BladeControl[];
}

// ─── Alert banner items (for System Overview) ─────────────────────────────────
export interface AlertItem {
  id: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

// ─── Assets (/home/assets) ───────────────────────────────────────────────────
export type AssetType = 'PC' | 'mobile' | 'IoT' | 'unknown' | 'server' | 'printer';
export type AssetStatus = 'online' | 'offline';

export interface ConnectedAsset {
  id: string;
  ipAddress: string;
  macAddress: string;
  hostname: string;
  type: AssetType;
  firstSeen: string;
  lastSeen: string;
  status: AssetStatus;
  vendor?: string;
  os?: string;
  openPorts?: number[];
}
