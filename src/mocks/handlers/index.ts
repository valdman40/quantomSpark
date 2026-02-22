import { dashboardHandlers } from './dashboard';
import { networkHandlers }   from './network';
import { securityHandlers }  from './security';
import { vpnHandlers }       from './vpn';
import { logsHandlers }      from './logs';
import { systemHandlers }    from './system';

export const handlers = [
  ...dashboardHandlers,
  ...networkHandlers,
  ...securityHandlers,
  ...vpnHandlers,
  ...logsHandlers,
  ...systemHandlers,
];
