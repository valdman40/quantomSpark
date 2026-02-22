export type AdminPermission = 'super-user' | 'read-only' | 'network-admin' | 'monitor';
export type AdminStatus = 'active' | 'locked' | 'disabled';

export interface Administrator {
  id: string;
  username: string;
  email: string;
  permission: AdminPermission;
  status: AdminStatus;
  lastLogin?: string;
  loginAttempts: number;
  createdAt: string;
}

export interface SoftwareVersion {
  current: string;
  build: string;
  releaseDate: string;
  updateAvailable: boolean;
  latestVersion?: string;
  latestBuild?: string;
  releaseNotes?: string;
}

export type HaRole = 'primary' | 'secondary' | 'standalone';
export type HaState = 'active' | 'standby' | 'down' | 'initializing';

export interface HaMember {
  id: string;
  name: string;
  role: HaRole;
  state: HaState;
  ip: string;
  lastSync?: string;
  syncStatus: 'synchronized' | 'synchronizing' | 'not-synchronized';
}

export interface HaSettings {
  enabled: boolean;
  mode: 'high-availability' | 'load-sharing';
  members: HaMember[];
  syncInterface: string;
  useSharedSecret: boolean;
  trackingMethod: 'virtual-ip' | 'carp';
}

export interface UpdateStatus {
  checking: boolean;
  downloading: boolean;
  installing: boolean;
  progress?: number;
  error?: string;
}
