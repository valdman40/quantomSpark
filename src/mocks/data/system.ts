import type { Administrator, SoftwareVersion, HaSettings } from '../../types/system';

export const mockAdmins: Administrator[] = [
  { id: 'adm-1', username: 'admin',      email: 'admin@corp.local',      permission: 'super-user',     status: 'active',   lastLogin: '2024-01-15T08:30:00Z', loginAttempts: 0, createdAt: '2023-01-01T00:00:00Z' },
  { id: 'adm-2', username: 'netadmin',   email: 'netadmin@corp.local',   permission: 'network-admin',  status: 'active',   lastLogin: '2024-01-14T17:00:00Z', loginAttempts: 0, createdAt: '2023-06-15T00:00:00Z' },
  { id: 'adm-3', username: 'monitor',    email: 'monitor@corp.local',    permission: 'monitor',        status: 'active',   lastLogin: '2024-01-13T10:00:00Z', loginAttempts: 0, createdAt: '2023-09-01T00:00:00Z' },
  { id: 'adm-4', username: 'readonly',   email: 'readonly@corp.local',   permission: 'read-only',      status: 'active',   lastLogin: '2024-01-10T09:00:00Z', loginAttempts: 0, createdAt: '2023-11-01T00:00:00Z' },
  { id: 'adm-5', username: 'oldadmin',   email: 'old@corp.local',        permission: 'super-user',     status: 'locked',   lastLogin: '2023-12-01T00:00:00Z', loginAttempts: 5, createdAt: '2022-01-01T00:00:00Z' },
];

export const mockVersion: SoftwareVersion = {
  current: 'R81.20',
  build: 'Build 631',
  releaseDate: '2023-11-15',
  updateAvailable: true,
  latestVersion: 'R81.20.10',
  latestBuild: 'Build 640',
  releaseNotes: 'Security fixes and performance improvements for IPS engine and VPN stability.',
};

export const mockHa: HaSettings = {
  enabled: true,
  mode: 'high-availability',
  syncInterface: 'eth3',
  useSharedSecret: true,
  trackingMethod: 'carp',
  members: [
    {
      id: 'ha-1',
      name: 'QS-1500W-Primary',
      role: 'primary',
      state: 'active',
      ip: '192.168.1.1',
      lastSync: '2024-01-15T10:20:00Z',
      syncStatus: 'synchronized',
    },
    {
      id: 'ha-2',
      name: 'QS-1500W-Secondary',
      role: 'secondary',
      state: 'standby',
      ip: '192.168.1.2',
      lastSync: '2024-01-15T10:20:00Z',
      syncStatus: 'synchronized',
    },
  ],
};
