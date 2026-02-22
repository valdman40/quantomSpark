/** Single source of truth for every API path.
 *  Import from here — never hardcode paths in components or hooks. */
export const ENDPOINTS = {
  // Home
  home: {
    systemOverview:     '/home/system-overview',
    securityDashboard:  '/home/security-dashboard-data',
    notifications:      '/home/notifications',
    notification:       (id: string) => `/home/notifications/${id}`,
    notificationsClear: '/home/notifications/clear',
    assets:             '/home/assets',
    bladeCategories:    '/home/blade-categories',
    toggleBlade:        (id: string) => `/home/blade-categories/toggle/${id}`,
  },

  // Network
  network: {
    interfaces: '/network/interfaces',
    interface: (id: string) => `/network/interfaces/${id}`,
    routes: '/network/routes',
    route: (id: string) => `/network/routes/${id}`,
    dns: '/network/dns',
  },

  // Security
  security: {
    rules: '/security/rules',
    rule: (id: string) => `/security/rules/${id}`,
    nat: '/security/nat',
    natRule: (id: string) => `/security/nat/${id}`,
    installPolicy: '/security/install-policy',
    reorderRules:  '/security/rules/reorder',
  },

  // VPN
  vpn: {
    tunnels: '/vpn/tunnels',
    tunnel: (id: string) => `/vpn/tunnels/${id}`,
    tunnelConnect: (id: string) => `/vpn/tunnels/${id}/connect`,
    tunnelDisconnect: (id: string) => `/vpn/tunnels/${id}/disconnect`,
    remoteAccess: '/vpn/remote-access',
    remoteUsers: '/vpn/remote-access/users',
  },

  // Logs
  logs: {
    security: '/logs/security',
    traffic: '/logs/traffic',
    events: '/logs/events',
  },

  // System
  system: {
    admins: '/system/admins',
    admin: (id: string) => `/system/admins/${id}`,
    version: '/system/version',
    checkUpdate: '/system/check-update',
    installUpdate: '/system/install-update',
    ha: '/system/ha',
    haSettings: '/system/ha/settings',
  },
} as const;
