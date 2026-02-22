import { homeHandlers }     from './home';
import { networkHandlers }  from './network';
import { securityHandlers } from './security';
import { vpnHandlers }      from './vpn';
import { logsHandlers }     from './logs';
import { systemHandlers }   from './system';

export const handlers = [
  ...homeHandlers,
  ...networkHandlers,
  ...securityHandlers,
  ...vpnHandlers,
  ...logsHandlers,
  ...systemHandlers,
];
