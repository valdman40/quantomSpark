import { http, passthrough } from 'msw';
import { homeHandlers }     from './home';
import { networkHandlers }  from './network';
import { securityHandlers } from './security';
import { vpnHandlers }      from './vpn';
import { logsHandlers }     from './logs';
import { systemHandlers }   from './system';

export const handlers = [
  // Pass /gateway/* requests straight to the Vite proxy without any SW involvement.
  // Without this, Chrome DevTools shows the request twice: once as an SW intercept
  // and once as the forwarded network request, even with onUnhandledRequest: 'bypass'.
  http.all('/gateway/*', () => passthrough()),

  ...homeHandlers,
  ...networkHandlers,
  ...securityHandlers,
  ...vpnHandlers,
  ...logsHandlers,
  ...systemHandlers,
];
