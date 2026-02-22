import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell }          from '../components/layout/AppShell';
import { ALL_LEAVES }        from './navConfig';
import { PlaceholderPage }   from '../pages/PlaceholderPage';

// ── Implemented components ───────────────────────────────────────
import { Dashboard }          from '../features/dashboard/Dashboard';
import { RuleTable }          from '../features/security/components/firewall/RuleTable';
import { NatTable }           from '../features/security/components/nat/NatTable';
import { TunnelList }         from '../features/vpn/components/siteToSite/TunnelList';
import { RemoteAccessPanel }  from '../features/vpn/components/remoteAccess/RemoteAccessPanel';
import { Logs }               from '../features/logs/Logs';
import { AdminList }          from '../features/system/components/admins/AdminList';
import { UpdatesPanel }       from '../features/system/components/updates/UpdatesPanel';
import { HaStatus }           from '../features/system/components/ha/HaStatus';
import { InterfaceList }      from '../features/network/components/interfaces/InterfaceList';
import { DnsSettings }        from '../features/network/components/dns/DnsSettings';
import { RoutingTable }       from '../features/network/components/routing/RoutingTable';

/**
 * Maps an exact nav-config path to its real React component.
 * Any path not listed here falls back to <PlaceholderPage />.
 */
const COMPONENT_MAP: Record<string, React.ReactElement> = {
  // Home
  '/home/security-dashboard':       <Dashboard />,

  // Device
  '/device/internet':               <InterfaceList />,
  '/device/dns':                    <DnsSettings />,
  '/device/routing-table':          <RoutingTable />,
  '/device/administrators':         <AdminList />,
  '/device/system-operations':      <UpdatesPanel />,
  '/device/high-availability':      <HaStatus />,

  // Access Policy
  '/access-policy/policy':          <RuleTable />,
  '/access-policy/nat':             <NatTable />,

  // VPN
  '/vpn/site-to-site':              <TunnelList />,
  '/vpn/remote-access':             <RemoteAccessPanel />,

  // Logs & Monitoring — same Logs component, different default tab
  '/logs/security':                 <Logs defaultTab="security" />,
  '/logs/system':                   <Logs defaultTab="events"   />,
  '/logs/audit':                    <Logs defaultTab="security" />,
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
      // Default: land on the Security Dashboard
      { index: true, element: <Navigate to="/home/security-dashboard" replace /> },
      ...leafRoutes,
    ],
  },
]);
