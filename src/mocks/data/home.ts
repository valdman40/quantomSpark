import type {
  SystemOverviewData,
  SecurityDashboardData,
  SystemNotification,
  ConnectedAsset,
  BladeCategory,
  AlertItem,
  NotificationCategory,
} from '../../types/home';

// ─── System Overview ──────────────────────────────────────────────────────────
export const mockSystemOverview: SystemOverviewData = {
  systemStats: {
    cpuPercent: 18,
    memoryPercent: 43,
    diskPercent: 27,
    uptimeSeconds: 1_296_000,
    firmwareVersion: 'R81.20.10',
    modelName: 'New Spark 1500W',
    serialNumber: 'QS-2024-A8B3C1',
    managementIp: '192.168.1.1',
  },
  interfaces: [
    { name: 'eth0', ipAddress: '203.0.113.5', status: 'up',   type: 'external', speedMbps: 1000 },
    { name: 'eth1', ipAddress: '192.168.1.1', status: 'up',   type: 'internal', speedMbps: 1000 },
    { name: 'eth2', ipAddress: '172.16.10.1', status: 'up',   type: 'dmz',      speedMbps: 1000 },
    { name: 'eth3', ipAddress: 'N/A',         status: 'down', type: 'internal', speedMbps: 0    },
    { name: 'vpn0', ipAddress: '10.8.0.1',    status: 'up',   type: 'vpn',      speedMbps: 0    },
  ],
  blades: [
    { name: 'Firewall',          status: 'on'     },
    { name: 'IPS',               status: 'on'     },
    { name: 'Anti-Virus',        status: 'on'     },
    { name: 'URL Filtering',     status: 'on'     },
    { name: 'Anti-Bot',          status: 'on'     },
    { name: 'Anti-Spam',         status: 'bypass' },
    { name: 'App Control',       status: 'off'    },
  ],
  connections: {
    activeConnections: 1_482,
    httpsConnections:  894,
    httpConnections:   215,
    otherConnections:  373,
  },
  hardware: {
    cpuCores:      4,
    totalRamGb:    8,
    totalStorageGb: 32,
  },
};

// ─── Security Dashboard ───────────────────────────────────────────────────────
export const mockSecurityDashboard: SecurityDashboardData = {
  threatStats: {
    blockedThreats:      1_247,
    ipsEvents:           83,
    avEvents:            12,
    urlFilteringEvents:  421,
    antiSpamEvents:      56,
    lastUpdated: new Date().toISOString(),
  },
  recentAlerts: [
    { id: 'a1', timestamp: '2026-02-22T10:23:14Z', blade: 'IPS',             action: 'Drop',   sourceIp: '198.51.100.42', destinationIp: '192.168.1.20', service: 'HTTP',  ruleName: 'IPS Default Block'   },
    { id: 'a2', timestamp: '2026-02-22T10:21:05Z', blade: 'Anti-Virus',      action: 'Drop',   sourceIp: '198.51.100.88', destinationIp: '192.168.1.15', service: 'SMTP',  ruleName: 'AV Mail Scan'        },
    { id: 'a3', timestamp: '2026-02-22T10:18:33Z', blade: 'URL Filtering',   action: 'Drop',   sourceIp: '192.168.1.30', destinationIp: '203.0.113.99',  service: 'HTTPS', ruleName: 'Block Social Media'  },
    { id: 'a4', timestamp: '2026-02-22T10:15:11Z', blade: 'Firewall',        action: 'Accept', sourceIp: '192.168.1.10', destinationIp: '8.8.8.8',       service: 'DNS',   ruleName: 'Allow DNS'           },
    { id: 'a5', timestamp: '2026-02-22T10:12:58Z', blade: 'App Control',     action: 'Drop',   sourceIp: '192.168.1.45', destinationIp: '203.0.113.77',  service: 'HTTPS', ruleName: 'Block P2P'           },
  ],
  bladeHealth: [
    { name: 'Firewall',      status: 'on',     eventsLast24h: 5_821, version: 'R81.20.10' },
    { name: 'IPS',           status: 'on',     eventsLast24h: 83,    version: 'R81.20.10' },
    { name: 'Anti-Virus',    status: 'on',     eventsLast24h: 12,    version: 'R81.20.10' },
    { name: 'URL Filtering', status: 'on',     eventsLast24h: 421,   version: 'R81.20.10' },
    { name: 'Anti-Bot',      status: 'on',     eventsLast24h: 7,     version: 'R81.20.10' },
    { name: 'Anti-Spam',     status: 'bypass', eventsLast24h: 56,    version: 'R81.20.10' },
    { name: 'App Control',   status: 'off',    eventsLast24h: 0,     version: 'R81.20.10' },
  ],
  policyStatus: {
    lastInstalled: '2026-02-21T14:32:00Z',
    installedBy:   'admin',
    rulesCount:    47,
    status:        'ok',
  },
  topBlockedCategories: [
    { name: 'Social Media',   count: 214, color: '#3b82f6' },
    { name: 'Peer-to-Peer',   count: 187, color: '#c8102e' },
    { name: 'Streaming',      count: 143, color: '#8b5cf6' },
    { name: 'Gambling',       count:  89, color: '#f59e0b' },
    { name: 'Malware Sites',  count:  62, color: '#ef4444' },
    { name: 'Adult Content',  count:  41, color: '#06b6d4' },
  ],
};

// ─── Alert items (System Overview banner) ─────────────────────────────────────
export const mockAlertItems: AlertItem[] = [
  { id: 'al1', message: 'Configure administrator email address and phone number', actionLabel: 'Administrators', actionPath: '/device/administrators' },
  { id: 'al2', message: 'Connect to Roy Point cloud services to get improved security', actionLabel: 'Cloud Services', actionPath: '/home/cloud-services' },
  { id: 'al3', message: 'Backup your configuration', actionLabel: 'System Operations', actionPath: '/device/system-operations' },
  { id: 'al4', message: 'Enable automatic updates for latest security features', actionLabel: 'System Operations', actionPath: '/device/system-operations' },
  { id: 'al5', message: 'Set the correct date and time', actionLabel: 'Date and Time', actionPath: '/device/date-time' },
];

// ─── Blade categories (Security Dashboard) ────────────────────────────────────
export let mockBladeCategories: BladeCategory[] = [
  {
    id: 'access-policy', name: 'Access Policy',
    blades: [
      { id: 'firewall',   name: 'Firewall',                    iconType: 'firewall',   enabled: true,  license: 'trial' },
      { id: 'appctrl',    name: 'Applications & URL Filtering', iconType: 'app-filter', enabled: false },
      { id: 'user-aware', name: 'User Awareness',              iconType: 'user-aware', enabled: false },
      { id: 'qos',        name: 'QoS',                         iconType: 'qos',        enabled: false },
      { id: 'sdwan',      name: 'SD-WAN',                      iconType: 'sdwan',      enabled: false },
    ],
  },
  {
    id: 'threat-prevention', name: 'Threat Prevention',
    blades: [
      { id: 'ips',      name: 'Intrusion Prevention (IPS)', iconType: 'ips',      enabled: false },
      { id: 'av',       name: 'Anti-Virus',                 iconType: 'antivirus', enabled: false },
      { id: 'antibot',  name: 'Anti-Bot & DNS Security',    iconType: 'antibot',  enabled: false },
      { id: 'emulation',name: 'Threat Emulation',           iconType: 'emulation',enabled: false },
      { id: 'antispam', name: 'Anti-Spam',                  iconType: 'antispam', enabled: false },
      { id: 'phishing', name: 'Zero Phishing',              iconType: 'phishing', enabled: false },
      { id: 'iot',      name: 'IoT',                        iconType: 'iot',      enabled: false },
    ],
  },
  {
    id: 'vpn', name: 'VPN',
    blades: [
      { id: 'vpn-ra',  name: 'Remote Access',    iconType: 'vpn-remote', enabled: false },
      { id: 'vpn-s2s', name: 'Site to Site VPN', iconType: 'vpn-s2s',   enabled: false },
    ],
  },
];

// ─── Assets (150 rows) ────────────────────────────────────────────────────────
const ASSET_TYPES: ConnectedAsset['type'][] = ['PC', 'mobile', 'IoT', 'server', 'printer', 'unknown'];
const VENDORS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'Cisco', 'Raspberry Pi Foundation', 'Google', 'Ubiquiti', 'Synology'];
const OS_BY_TYPE: Record<ConnectedAsset['type'], string[]> = {
  PC:      ['Windows 11', 'Windows 10', 'Ubuntu 24.04', 'macOS 15'],
  mobile:  ['iOS 18', 'Android 14', 'Android 13'],
  IoT:     ['Raspberry Pi OS', 'FreeRTOS', 'Embedded Linux'],
  server:  ['Ubuntu Server 24.04', 'RHEL 9', 'Windows Server 2022', 'Debian 12'],
  printer: [],
  unknown: [],
};

export let mockAssets: ConnectedAsset[] = [
  { id: 'as1',  ipAddress: '192.168.1.10', macAddress: '00:1A:2B:3C:4D:5E', hostname: 'DESKTOP-ALICE',    type: 'PC',      firstSeen: '2025-11-01T08:00:00Z', lastSeen: '2026-02-22T10:25:00Z', status: 'online',  vendor: 'Dell',    os: 'Windows 11',          openPorts: [445, 135]       },
  { id: 'as2',  ipAddress: '192.168.1.11', macAddress: '00:1A:2B:3C:4D:5F', hostname: 'DESKTOP-BOB',      type: 'PC',      firstSeen: '2025-11-01T08:00:00Z', lastSeen: '2026-02-22T10:24:00Z', status: 'online',  vendor: 'Lenovo',  os: 'Windows 10',          openPorts: [445]            },
  { id: 'as3',  ipAddress: '192.168.1.20', macAddress: 'A4:C3:F0:12:34:56', hostname: 'macbook-charlie',   type: 'PC',      firstSeen: '2025-12-05T09:15:00Z', lastSeen: '2026-02-22T09:00:00Z', status: 'online',  vendor: 'Apple',   os: 'macOS 15 Sequoia',    openPorts: [22, 3000]       },
  { id: 'as4',  ipAddress: '192.168.1.30', macAddress: 'B8:27:EB:AA:BB:CC', hostname: 'rpi-sensor-01',     type: 'IoT',     firstSeen: '2026-01-10T12:00:00Z', lastSeen: '2026-02-22T10:20:00Z', status: 'online',  vendor: 'Raspberry Pi Foundation', os: 'Raspberry Pi OS', openPorts: [22, 80] },
  { id: 'as5',  ipAddress: '192.168.1.31', macAddress: 'B8:27:EB:DD:EE:FF', hostname: 'rpi-camera-02',     type: 'IoT',     firstSeen: '2026-01-10T12:00:00Z', lastSeen: '2026-02-21T18:00:00Z', status: 'offline', vendor: 'Raspberry Pi Foundation', os: 'Raspberry Pi OS', openPorts: [22, 554] },
  { id: 'as6',  ipAddress: '192.168.1.40', macAddress: '50:D7:53:11:22:33', hostname: 'pixel-7-dave',      type: 'mobile',  firstSeen: '2026-02-10T07:30:00Z', lastSeen: '2026-02-22T08:45:00Z', status: 'online',  vendor: 'Google',  os: 'Android 14'                   },
  { id: 'as7',  ipAddress: '192.168.1.41', macAddress: '3C:22:FB:AA:BB:CC', hostname: 'iphone-eve',        type: 'mobile',  firstSeen: '2026-02-15T08:00:00Z', lastSeen: '2026-02-22T10:10:00Z', status: 'online',  vendor: 'Apple',   os: 'iOS 18'                        },
  { id: 'as8',  ipAddress: '192.168.1.50', macAddress: '00:0C:29:88:99:AA', hostname: 'srv-files-01',      type: 'server',  firstSeen: '2025-10-01T06:00:00Z', lastSeen: '2026-02-22T10:26:00Z', status: 'online',  vendor: 'HP',      os: 'Ubuntu Server 24.04', openPorts: [22, 80, 443, 445] },
  { id: 'as9',  ipAddress: '192.168.1.51', macAddress: '00:0C:29:CC:DD:EE', hostname: 'srv-db-01',         type: 'server',  firstSeen: '2025-10-01T06:00:00Z', lastSeen: '2026-02-22T10:26:00Z', status: 'online',  vendor: 'Dell',    os: 'RHEL 9',              openPorts: [22, 5432]         },
  { id: 'as10', ipAddress: '192.168.1.60', macAddress: '08:00:20:AA:BB:CC', hostname: 'printer-mfp-1',     type: 'printer', firstSeen: '2025-11-20T10:00:00Z', lastSeen: '2026-02-22T07:00:00Z', status: 'online',  vendor: 'HP',                                  openPorts: [9100, 80]       },
  { id: 'as11', ipAddress: '192.168.1.99', macAddress: 'DE:AD:BE:EF:00:11', hostname: 'unknown-device',    type: 'unknown', firstSeen: '2026-02-22T03:14:00Z', lastSeen: '2026-02-22T03:15:00Z', status: 'offline'                                                              },
  ...Array.from({ length: 139 }, (_, i): ConnectedAsset => {
    const n    = i + 12;
    const type = ASSET_TYPES[n % ASSET_TYPES.length];
    const vendor = VENDORS[n % VENDORS.length];
    const osList = OS_BY_TYPE[type];
    const os = osList.length ? osList[n % osList.length] : undefined;
    const subnet = n % 3 === 0 ? '192.168.2' : n % 3 === 1 ? '10.0.1' : '10.10.0';
    const octet  = (n % 230) + 10;
    const hi = Math.floor(n / 256).toString(16).padStart(2, '0').toUpperCase();
    const lo = (n % 256).toString(16).padStart(2, '0').toUpperCase();
    const hour = n % 24;
    const day  = (n % 22) + 1;
    const month = (n % 12) + 1;
    return {
      id: `as${n}`,
      ipAddress: `${subnet}.${octet}`,
      macAddress: `02:AA:BB:CC:${hi}:${lo}`,
      hostname: `${type.toLowerCase()}-${String(n).padStart(3, '0')}`,
      type,
      firstSeen: `2025-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T08:00:00Z`,
      lastSeen:  `2026-02-${String(Math.min(day, 22)).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`,
      status: n % 6 === 0 ? 'offline' : 'online',
      vendor,
      ...(os ? { os } : {}),
      ...(type === 'server' ? { openPorts: [22, 80, 443] } : {}),
    };
  }),
];

// ─── Notifications (100 rows) ─────────────────────────────────────────────────
const NOTIF_CATEGORIES: NotificationCategory[] = ['Update', 'Security', 'System', 'License', 'VPN', 'HA', 'Network'];
const NOTIF_MESSAGES: Record<NotificationCategory, string[]> = {
  Update:   ['Firmware update available.', 'IPS signatures updated.', 'Anti-virus database refreshed.', 'Software update check completed.'],
  Security: ['Brute-force attack detected and blocked.', 'IPS signature update failed.', 'Suspicious login attempt from unknown IP.', 'Certificate validation failed.'],
  System:   ['Scheduled backup completed.', 'High CPU utilization (over 85%).', 'Disk usage exceeded 80%.', 'System restarted after update.'],
  License:  ['License expires in 30 days.', 'License expires in 14 days.', 'License has been renewed.', 'Trial license active.'],
  VPN:      ['VPN tunnel established.', 'VPN tunnel disconnected.', 'Remote access user connected.', 'Remote access session expired.'],
  HA:       ['Cluster sync completed.', 'HA failover event detected.', 'Primary member recovered.', 'Secondary member unreachable.'],
  Network:  ['Interface link speed changed.', 'DHCP lease pool near capacity.', 'BGP peer connection established.', 'DNS resolution failure.'],
};
const NOTIF_SEVERITIES: SystemNotification['severity'][] = ['info', 'warning', 'error'];

export let mockNotifications: SystemNotification[] = [
  { id: 'n1',  timestamp: '2026-02-22T09:45:00Z', severity: 'warning', category: 'Update',   message: 'Firmware update R81.20.15 is available.',                      read: false },
  { id: 'n2',  timestamp: '2026-02-22T08:12:00Z', severity: 'error',   category: 'Security', message: 'IPS signature update failed — retrying.',                      read: false },
  { id: 'n3',  timestamp: '2026-02-22T07:00:00Z', severity: 'info',    category: 'System',   message: 'Scheduled backup completed successfully.',                      read: true  },
  { id: 'n4',  timestamp: '2026-02-21T23:50:00Z', severity: 'warning', category: 'License',  message: 'Anti-Spam blade license expires in 14 days.',                  read: false },
  { id: 'n5',  timestamp: '2026-02-21T18:30:00Z', severity: 'info',    category: 'VPN',      message: 'Remote Access VPN: 3 users connected.',                        read: true  },
  { id: 'n6',  timestamp: '2026-02-21T16:00:00Z', severity: 'error',   category: 'HA',       message: 'Cluster member sync failure detected.',                        read: false },
  { id: 'n7',  timestamp: '2026-02-21T12:15:00Z', severity: 'info',    category: 'Network',  message: 'Interface eth3 link speed changed to 100 Mbps.',               read: true  },
  { id: 'n8',  timestamp: '2026-02-21T10:00:00Z', severity: 'warning', category: 'System',   message: 'Disk usage exceeded 80% threshold on /var/log.',               read: false },
  { id: 'n9',  timestamp: '2026-02-20T22:00:00Z', severity: 'info',    category: 'Update',   message: 'IPS signatures updated to build 1234.',                        read: true  },
  { id: 'n10', timestamp: '2026-02-20T15:30:00Z', severity: 'error',   category: 'Security', message: 'Brute-force attack detected from 198.51.100.42. IP blocked.',  read: false },
  ...Array.from({ length: 90 }, (_, i): SystemNotification => {
    const n        = i + 11;
    const cat      = NOTIF_CATEGORIES[n % NOTIF_CATEGORIES.length];
    const msgs     = NOTIF_MESSAGES[cat];
    const msg      = msgs[n % msgs.length];
    const severity = NOTIF_SEVERITIES[n % NOTIF_SEVERITIES.length];
    const daysAgo  = Math.floor(n / 4) + 1;
    const hour     = n % 24;
    const minute   = (n * 7) % 60;
    const date     = new Date(Date.UTC(2026, 1, 22 - (daysAgo % 30), hour, minute));
    return {
      id: `n${n}`,
      timestamp: date.toISOString(),
      severity,
      category: cat,
      message: msg,
      read: n % 3 !== 0,
    };
  }),
];
