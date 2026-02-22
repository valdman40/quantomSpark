/**
 * Centralised React Query key factory.
 * Keeps cache invalidation deterministic — sagas call these same keys.
 */
import type { LogFilters } from '../types/logs';

export const queryKeys = {
  dashboard: {
    all: () => ['dashboard'] as const,
    summary: () => ['dashboard', 'summary'] as const,
  },

  network: {
    all: () => ['network'] as const,
    interfaces: () => ['network', 'interfaces'] as const,
    interface: (id: string) => ['network', 'interfaces', id] as const,
    routes: () => ['network', 'routes'] as const,
    dns: () => ['network', 'dns'] as const,
  },

  security: {
    all: () => ['security'] as const,
    rules: () => ['security', 'rules'] as const,
    nat: () => ['security', 'nat'] as const,
  },

  vpn: {
    all: () => ['vpn'] as const,
    tunnels: () => ['vpn', 'tunnels'] as const,
    tunnel: (id: string) => ['vpn', 'tunnels', id] as const,
    remoteAccess: () => ['vpn', 'remote-access'] as const,
    remoteUsers: () => ['vpn', 'remote-access', 'users'] as const,
  },

  logs: {
    all: () => ['logs'] as const,
    security: (filters: Partial<LogFilters>) => ['logs', 'security', filters] as const,
    traffic: (filters: Partial<LogFilters>) => ['logs', 'traffic', filters] as const,
    events: (filters: Partial<LogFilters>) => ['logs', 'events', filters] as const,
  },

  system: {
    all: () => ['system'] as const,
    admins: () => ['system', 'admins'] as const,
    version: () => ['system', 'version'] as const,
    ha: () => ['system', 'ha'] as const,
  },
} as const;
