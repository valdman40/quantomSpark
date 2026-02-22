import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell }          from '../components/layout/AppShell';
import { ALL_LEAVES }        from './navConfig';
import { PlaceholderPage }   from '../pages/PlaceholderPage';

// ── Implemented components ───────────────────────────────────────
import { SystemOverview }        from '../features/home/system/SystemOverview';
import { SecurityDashboard }     from '../features/home/securityDashboard/SecurityDashboard';
import { Notifications }         from '../features/home/notifications/Notifications';
import { Assets }                from '../features/home/assets/Assets';
import { SecurityManagement }    from '../features/home/securityManagement/SecurityManagement';
import { CloudServices }         from '../features/home/cloudServices/CloudServices';
import { License }               from '../features/home/license/License';
import { SiteMap }               from '../features/home/siteMap/SiteMap';
import { Monitoring }            from '../features/home/monitoring/Monitoring';
import { ExtendedMonitoring }    from '../features/home/extendedMonitoring/ExtendedMonitoring';
import { Reports }               from '../features/home/reports/Reports';
import { DrSpark }               from '../features/home/drSpark/DrSpark';
import { Tools }                 from '../features/home/tools/Tools';
import { Support }               from '../features/home/support/Support';
import { RuleTable }         from '../features/security/components/firewall/RuleTable';
import { NatTable }          from '../features/security/components/nat/NatTable';
import { TunnelList }        from '../features/vpn/components/siteToSite/TunnelList';
import { RemoteAccessPanel } from '../features/vpn/components/remoteAccess/RemoteAccessPanel';
import { Logs }              from '../features/logs/Logs';
import { AdminList }         from '../features/system/components/admins/AdminList';
import { UpdatesPanel }      from '../features/system/components/updates/UpdatesPanel';
import { HaStatus }          from '../features/system/components/ha/HaStatus';
import { InterfaceList }     from '../features/network/components/interfaces/InterfaceList';
import { DnsSettings }       from '../features/network/components/dns/DnsSettings';
import { RoutingTable }      from '../features/network/components/routing/RoutingTable';

/**
 * Maps an exact nav-config path to its real React component.
 * Any path not listed here falls back to <PlaceholderPage />.
 */
const COMPONENT_MAP: Record<string, React.ReactElement> = {
  // Home
  '/home/system':               <SystemOverview />,
  '/home/security-dashboard':   <SecurityDashboard />,
  '/home/notifications':        <Notifications />,
  '/home/assets':               <Assets />,
  '/home/security-management':  <SecurityManagement />,
  '/home/cloud-services':       <CloudServices />,
  '/home/license':              <License />,
  '/home/site-map':             <SiteMap />,
  '/home/monitoring':           <Monitoring />,
  '/home/extended-monitoring':  <ExtendedMonitoring />,
  '/home/reports':              <Reports />,
  '/home/dr-spark':             <DrSpark />,
  '/home/tools':                <Tools />,
  '/home/support':              <Support />,

  // Device
  '/device/internet':          <InterfaceList />,
  '/device/dns':               <DnsSettings />,
  '/device/routing-table':     <RoutingTable />,
  '/device/administrators':    <AdminList />,
  '/device/system-operations': <UpdatesPanel />,
  '/device/high-availability': <HaStatus />,

  // Access Policy
  '/access-policy/policy': <RuleTable />,
  '/access-policy/nat':    <NatTable />,

  // VPN
  '/vpn/site-to-site':  <TunnelList />,
  '/vpn/remote-access': <RemoteAccessPanel />,

  // Logs & Monitoring — same Logs component, different default tab
  '/logs/security': <Logs defaultTab="security" />,
  '/logs/system':   <Logs defaultTab="events"   />,
  '/logs/audit':    <Logs defaultTab="security" />,
};

/** One route object per NAV_CONFIG leaf; unmapped paths render a stub. */
const leafRoutes = ALL_LEAVES.map(leaf => ({
  // Strip the leading '/' — routes are children of the root '/' path
  path: leaf.path.slice(1),
  element: COMPONENT_MAP[leaf.path] ?? <PlaceholderPage />,
}));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Default: land on System Overview
      { index: true, element: <Navigate to="/home/system" replace /> },
      ...leafRoutes,
    ],
  },
]);
