/**
 * Single source of truth for the navigation tree.
 * Mirrors the product JSON structure exactly, with an added `path` field
 * on every leaf that React Router uses as the actual URL.
 *
 * Sidebar and router both derive from this — add a new page in one place.
 */

export interface NavLeaf {
  label: string;
  /** Original `to` identifier from the product nav JSON */
  to: string;
  /** Actual React Router URL path */
  path: string;
}

export interface NavGroup {
  label: string;
  items: NavLeaf[];
}

export interface NavSection {
  label: string;
  /** Maps to the product icon name (used for SVG lookup) */
  icon: string;
  groups: NavGroup[];
}

export const NAV_CONFIG: NavSection[] = [
  {
    label: 'Home',
    icon: 'home',
    groups: [
      {
        label: 'Overview',
        items: [
          { label: 'System',              to: 'app.Overview',   path: '/home/system'              },
          { label: 'Security Dashboard',  to: 'app.Dashboard',  path: '/home/security-dashboard'  },
          { label: 'Security Management', to: 'app.MgmtServer', path: '/home/security-management' },
          { label: 'Cloud Services',      to: 'app.CloudMgmt',  path: '/home/cloud-services'      },
          { label: 'License',             to: 'app.License',    path: '/home/license'             },
          { label: 'Site Map',            to: 'app.Sitemap',    path: '/home/site-map'            },
        ],
      },
      {
        label: 'Monitoring',
        items: [
          { label: 'Notifications',        to: 'app.NotificationsLogHome', path: '/home/notifications'       },
          { label: 'Assets',               to: 'app.ActiveDevicesRD',      path: '/home/assets'              },
          { label: 'Monitoring',           to: 'app.MonitoringHome',       path: '/home/monitoring'          },
          { label: 'Extended Monitoring',  to: 'app.CloudMonitoringHome',  path: '/home/extended-monitoring' },
          { label: 'Reports',              to: 'app.ReportsHome',          path: '/home/reports'             },
        ],
      },
      {
        label: 'Troubleshooting',
        items: [
          { label: 'Dr. Spark', to: 'app.DrSpark',              path: '/home/dr-spark' },
          { label: 'Tools',     to: 'app.DiagnosticsToolsHome', path: '/home/tools'    },
          { label: 'Support',   to: 'app.Support',              path: '/home/support'  },
        ],
      },
    ],
  },

  {
    label: 'Device',
    icon: 'gateway-device',
    groups: [
      {
        label: 'Network',
        items: [
          { label: 'Internet',      to: 'app.InternetConnection', path: '/device/internet'      },
          { label: 'Wireless',      to: 'app.NetworkWireless',    path: '/device/wireless'      },
          { label: 'Local Network', to: 'app.LocalNetwork',       path: '/device/local-network' },
          { label: 'Hotspot',       to: 'app.HotspotOverview',    path: '/device/hotspot'       },
          { label: 'MAC Filtering', to: 'app.MACFiltering',       path: '/device/mac-filtering' },
          { label: 'DNS',           to: 'app.DNS',                path: '/device/dns'           },
          { label: 'Proxy',         to: 'app.Proxy',              path: '/device/proxy'         },
        ],
      },
      {
        label: 'System',
        items: [
          { label: 'System Operations',      to: 'app.SystemOperations',   path: '/device/system-operations' },
          { label: 'Administrators',         to: 'app.Administrators',     path: '/device/administrators'    },
          { label: 'Administrator Access',   to: 'app.AdminAccess',        path: '/device/admin-access'      },
          { label: 'Device Details',         to: 'app.Name',               path: '/device/device-details'    },
          { label: 'Date and Time',          to: 'app.DateAndTime',        path: '/device/date-time'         },
          { label: 'DDNS and Device Access', to: 'app.DDNS',               path: '/device/ddns'              },
          { label: 'Tools',                  to: 'app.DiagnosticsToolsRD', path: '/device/tools'             },
        ],
      },
      {
        label: 'Advanced Routing',
        items: [
          { label: 'BGP',                   to: 'app.Bgp',                 path: '/device/bgp'                     },
          { label: 'PIM',                   to: 'app.PIM',                 path: '/device/pim'                     },
          { label: 'OSPF',                  to: 'app.OSPF',                path: '/device/ospf'                    },
          { label: 'Route Map',             to: 'app.Routemap',            path: '/device/route-map'               },
          { label: 'Inbound Route Filters', to: 'app.InboundRouteFilters', path: '/device/inbound-route-filters'   },
          { label: 'Route Redistribution',  to: 'app.RouteRedistribution', path: '/device/route-redistribution'    },
          { label: 'Routing Options',       to: 'app.page.RoutingOptions', path: '/device/routing-options'         },
          { label: 'Routing Table',         to: 'app.RouteRuleBase',       path: '/device/routing-table'           },
        ],
      },
      {
        label: 'Certificates',
        items: [
          { label: 'Installed Certificates', to: 'app.InternalCertificatesRD', path: '/device/installed-certificates' },
          { label: 'Internal Certificate',   to: 'app.InternalCertificateRD',  path: '/device/internal-certificate'   },
        ],
      },
      {
        label: 'Advanced',
        items: [
          { label: 'High Availability', to: 'app.HighAvailability', path: '/device/high-availability' },
          { label: 'Advanced Settings', to: 'app.AdvancedSettings', path: '/device/advanced-settings' },
        ],
      },
    ],
  },

  {
    label: 'Access Policy',
    icon: 'firewall',
    groups: [
      {
        label: 'Firewall',
        items: [
          { label: 'Blade Control', to: 'app.FWOverview',          path: '/access-policy/firewall-overview' },
          { label: 'Policy',        to: 'app.FWAllRulebase',       path: '/access-policy/policy'            },
          { label: 'Servers',       to: 'app.Servers',             path: '/access-policy/servers'           },
          { label: 'NAT',           to: 'app.Nat',                 path: '/access-policy/nat'               },
          { label: 'SD-WAN',        to: 'app.SdWan',               path: '/access-policy/sd-wan'            },
          { label: 'VoIP',          to: 'app.Voip',                path: '/access-policy/voip'              },
          { label: 'Fast Accel',    to: 'app.SmartAccel',          path: '/access-policy/fast-accel'        },
          { label: 'IoT',           to: 'app.IotProtectionPolicy', path: '/access-policy/iot'               },
        ],
      },
      {
        label: 'User Awareness',
        items: [
          { label: 'Blade Control', to: 'app.IdaActivationRD', path: '/access-policy/user-awareness' },
        ],
      },
      {
        label: 'QoS',
        items: [
          { label: 'Blade Control', to: 'app.QoSOverview', path: '/access-policy/qos-overview' },
          { label: 'Policy',        to: 'app.QoSRulebase', path: '/access-policy/qos-policy'   },
        ],
      },
      {
        label: 'SSL Inspection',
        items: [
          { label: 'Policy',     to: 'app.SslInspectionPolicy',    path: '/access-policy/ssl-policy'     },
          { label: 'Exceptions', to: 'app.SslInspectionExceptions', path: '/access-policy/ssl-exceptions' },
          { label: 'Advanced',   to: 'app.SslInspectionTrustedCa', path: '/access-policy/ssl-advanced'   },
        ],
      },
    ],
  },

  {
    label: 'Threat Prevention',
    icon: 'threat-prevention',
    groups: [
      {
        label: 'Threat Prevention',
        items: [
          { label: 'Blade Control',    to: 'app.ThreatPreventionActivation', path: '/threat-prevention/blade-control'   },
          { label: 'Exceptions',       to: 'app.TpExceptions',               path: '/threat-prevention/exceptions'      },
          { label: 'Infected Devices', to: 'app.InfectedHosts',              path: '/threat-prevention/infected-devices' },
        ],
      },
      {
        label: 'Protections',
        items: [
          { label: 'IPS Protections', to: 'app.IpsProtectionList', path: '/threat-prevention/ips-protections' },
          { label: 'Engine Settings', to: 'app.TPEngineSettings',  path: '/threat-prevention/engine-settings' },
        ],
      },
      {
        label: 'Anti-Spam',
        items: [
          { label: 'Blade Control', to: 'app.AntiSpamPolicy',     path: '/threat-prevention/anti-spam'            },
          { label: 'Exceptions',    to: 'app.AntiSpamExceptions', path: '/threat-prevention/anti-spam-exceptions' },
        ],
      },
    ],
  },

  {
    label: 'VPN',
    icon: 'site-to-site-vpn',
    groups: [
      {
        label: 'Remote Access',
        items: [
          { label: 'Blade Control',          to: 'app.VPNRemoteAccess',              path: '/vpn/remote-access'              },
          { label: 'Remote Access Users',    to: 'app.VPNRemoteAccessUsers',         path: '/vpn/remote-access-users'        },
          { label: 'Connected Remote Users', to: 'app.ConnectedRemoteUsers',         path: '/vpn/connected-users'            },
          { label: 'Authentication Servers', to: 'app.UsersAuthServersRemoteAccess', path: '/vpn/ra-auth-servers'            },
          { label: 'Advanced',               to: 'app.VPNRemoteAccessAdvanced',      path: '/vpn/remote-access-advanced'     },
        ],
      },
      {
        label: 'Site to Site',
        items: [
          { label: 'Blade Control', to: 'app.VPNSite2Site',         path: '/vpn/site-to-site'          },
          { label: 'VPN Sites',     to: 'app.VPNSites',             path: '/vpn/vpn-sites'             },
          { label: 'Community',     to: 'app.VPNCommunity',         path: '/vpn/community'             },
          { label: 'VPN Tunnels',   to: 'app.VPNTunnelsRD',        path: '/vpn/tunnels'               },
          { label: 'Advanced',      to: 'app.VPNSite2SiteAdvanced', path: '/vpn/site-to-site-advanced' },
        ],
      },
      {
        label: 'Certificates',
        items: [
          { label: 'Trusted CAs',            to: 'app.TrustedCAs',           path: '/vpn/trusted-cas'             },
          { label: 'Installed Certificates', to: 'app.InternalCertificates', path: '/vpn/installed-certificates'  },
          { label: 'Internal Certificate',   to: 'app.InternalCertificate',  path: '/vpn/internal-certificate'    },
        ],
      },
    ],
  },

  {
    label: 'Users and Objects',
    icon: 'asset-management',
    groups: [
      {
        label: 'Users Management',
        items: [
          { label: 'User Awareness',         to: 'app.IdaActivation',    path: '/users/user-awareness'   },
          { label: 'Users',                  to: 'app.UsersView',        path: '/users/users'            },
          { label: 'Administrators',         to: 'app.AdministratorsRD', path: '/users/administrators'   },
          { label: 'Authentication Servers', to: 'app.UsersAuthServers', path: '/users/auth-servers'     },
        ],
      },
      {
        label: 'Network Resources',
        items: [
          { label: 'Servers',               to: 'app.ObjectsAndUsers.Servers', path: '/users/servers'          },
          { label: 'Applications and URLs', to: 'app.Appi',                    path: '/users/applications'     },
          { label: 'Services',              to: 'app.Services',                path: '/users/services'         },
          { label: 'Service Groups',        to: 'app.ServicesGroups',          path: '/users/service-groups'   },
          { label: 'Network Objects',       to: 'app.NetworkObjects',          path: '/users/network-objects'  },
          { label: 'URL Lists',             to: 'app.UrlfExceptionsUrls',      path: '/users/url-lists'        },
        ],
      },
    ],
  },

  {
    label: 'Logs and Monitoring',
    icon: 'logs',
    groups: [
      {
        label: 'Logs',
        items: [
          { label: 'Security Logs',        to: 'app.SecurityLogs',      path: '/logs/security'     },
          { label: 'System Logs',          to: 'app.Syslogs',           path: '/logs/system'       },
          { label: 'Audit Logs',           to: 'app.AuditLogs',         path: '/logs/audit'        },
          { label: 'External Log Servers', to: 'app.LogsLoggingServer', path: '/logs/log-servers'  },
          { label: 'Notifications',        to: 'app.NotificationsLog',  path: '/logs/notifications'},
        ],
      },
      {
        label: 'Status',
        items: [
          { label: 'Assets',                  to: 'app.ActiveDevices',           path: '/logs/assets'              },
          { label: 'Wireless Active Devices', to: 'app.WirelessHostsMonitoring', path: '/logs/wireless-devices'    },
          { label: 'Paired Mobile Devices',   to: 'app.MobileDevices',           path: '/logs/mobile-devices'      },
          { label: 'Infected Devices',        to: 'app.InfectedHostsLogs',       path: '/logs/infected-devices'    },
          { label: 'VPN Tunnels',             to: 'app.VPNTunnels',              path: '/logs/vpn-tunnels'         },
          { label: 'Connections',             to: 'app.ActiveConnections',       path: '/logs/connections'         },
          { label: 'Access Points',           to: 'app.AccessPointsMonitoring',  path: '/logs/access-points'       },
          { label: 'Monitoring',              to: 'app.Monitoring',              path: '/logs/monitoring'          },
          { label: 'Extended Monitoring',     to: 'app.CloudMonitoring',         path: '/logs/extended-monitoring' },
          { label: 'Reports',                 to: 'app.Reports',                 path: '/logs/reports'             },
          { label: 'Dr. Spark',              to: 'app.page.DrSpark',            path: '/logs/dr-spark'            },
        ],
      },
      {
        label: 'Diagnostics',
        items: [
          { label: 'Tools',          to: 'app.DiagnosticsTools', path: '/logs/tools'          },
          { label: 'SNMP',           to: 'app.Snmp',             path: '/logs/snmp'           },
          { label: 'OpenTelemetry',  to: 'app.OpenTelemetry',    path: '/logs/open-telemetry' },
        ],
      },
    ],
  },

  {
    label: 'Demo',
    icon: 'test',
    groups: [
      {
        label: 'Icon Examples',
        items: [
          { label: 'Icons',             to: 'demo.icons.icons',            path: '/demo/icons'          },
          { label: 'Brands & Services', to: 'demo.icons.brandsAndServices', path: '/demo/brands-services'},
          { label: 'Logos',             to: 'demo.icons.logos',            path: '/demo/logos'          },
          { label: 'Status Icons',      to: 'demo.icons.statusIcons',      path: '/demo/status-icons'   },
          { label: 'Flags',             to: 'demo.icons.flags',            path: '/demo/flags'          },
        ],
      },
    ],
  },
];

/** Flat list of all leaves — useful for the router to iterate */
export const ALL_LEAVES = NAV_CONFIG.flatMap(section =>
  section.groups.flatMap(group =>
    group.items.map(item => ({ ...item, sectionLabel: section.label }))
  )
);

/** First leaf path per top-level section (used for default redirects) */
export const SECTION_DEFAULTS = Object.fromEntries(
  NAV_CONFIG.map(s => [s.label, s.groups[0].items[0].path])
);
