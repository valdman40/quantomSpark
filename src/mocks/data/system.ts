import type { Administrator, SoftwareVersion, HaSettings } from '../../types/system';

// ─── Admins (20 rows) ─────────────────────────────────────────────────────────
const PERMISSIONS: Administrator['permission'][] = ['super-user', 'network-admin', 'monitor', 'read-only'];
const STATUSES: Administrator['status'][] = ['active', 'active', 'active', 'locked', 'disabled'];
const FIRST_NAMES = ['alice', 'bob', 'carol', 'dave', 'eve', 'frank', 'grace', 'hank', 'iris', 'jack', 'karen', 'liam', 'mia', 'noah', 'olivia'];

export let mockAdmins: Administrator[] = [
  { id: 'adm-1', username: 'admin',    email: 'admin@corp.local',    permission: 'super-user',    status: 'active',   lastLogin: '2026-02-22T08:30:00Z', loginAttempts: 0, createdAt: '2023-01-01T00:00:00Z' },
  { id: 'adm-2', username: 'netadmin', email: 'netadmin@corp.local', permission: 'network-admin', status: 'active',   lastLogin: '2026-02-21T17:00:00Z', loginAttempts: 0, createdAt: '2023-06-15T00:00:00Z' },
  { id: 'adm-3', username: 'monitor',  email: 'monitor@corp.local',  permission: 'monitor',       status: 'active',   lastLogin: '2026-02-20T10:00:00Z', loginAttempts: 0, createdAt: '2023-09-01T00:00:00Z' },
  { id: 'adm-4', username: 'readonly', email: 'readonly@corp.local', permission: 'read-only',     status: 'active',   lastLogin: '2026-02-18T09:00:00Z', loginAttempts: 0, createdAt: '2023-11-01T00:00:00Z' },
  { id: 'adm-5', username: 'oldadmin', email: 'old@corp.local',      permission: 'super-user',    status: 'locked',   lastLogin: '2025-12-01T00:00:00Z', loginAttempts: 5, createdAt: '2022-01-01T00:00:00Z' },
  ...Array.from({ length: 15 }, (_, i): Administrator => {
    const n      = i + 6;
    const fname  = FIRST_NAMES[n % FIRST_NAMES.length];
    const perm   = PERMISSIONS[n % PERMISSIONS.length];
    const status = STATUSES[n % STATUSES.length];
    const daysAgo = n * 3;
    const lastLogin = status !== 'disabled'
      ? new Date(Date.UTC(2026, 1, 22) - daysAgo * 86_400_000).toISOString()
      : undefined;
    return {
      id: `adm-${n}`,
      username: `${fname}${n}`,
      email: `${fname}${n}@corp.local`,
      permission: perm,
      status,
      ...(lastLogin ? { lastLogin } : {}),
      loginAttempts: status === 'locked' ? (n % 5) + 3 : 0,
      createdAt: new Date(Date.UTC(2023, (n % 12), 1)).toISOString(),
    };
  }),
];

// ─── Software Version ─────────────────────────────────────────────────────────
export const mockVersion: SoftwareVersion = {
  current: 'R81.20',
  build: 'Build 631',
  releaseDate: '2023-11-15',
  updateAvailable: true,
  latestVersion: 'R81.20.10',
  latestBuild: 'Build 640',
  releaseNotes: 'Security fixes and performance improvements for IPS engine and VPN stability.',
};

// ─── HA Settings ──────────────────────────────────────────────────────────────
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
      lastSync: '2026-02-22T10:20:00Z',
      syncStatus: 'synchronized',
    },
    {
      id: 'ha-2',
      name: 'QS-1500W-Secondary',
      role: 'secondary',
      state: 'standby',
      ip: '192.168.1.2',
      lastSync: '2026-02-22T10:20:00Z',
      syncStatus: 'synchronized',
    },
  ],
};
