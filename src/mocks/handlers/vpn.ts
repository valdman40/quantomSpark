import { http, HttpResponse, delay } from 'msw';
import { mockTunnels, mockRemoteAccess, mockRemoteUsers } from '../data/vpn';
import type { VpnTunnel } from '../../types/vpn';

let tunnels = [...mockTunnels];

export const vpnHandlers = [
  http.get('/api/vpn/tunnels', async () => {
    await delay(300);
    return HttpResponse.json({ data: tunnels, status: 'ok' });
  }),

  http.post('/api/vpn/tunnels', async ({ request }) => {
    await delay(600);
    const body = await request.json() as Partial<VpnTunnel>;
    const newTunnel: VpnTunnel = {
      id: `vpn-${Date.now()}`,
      status: 'disconnected',
      bytesSent: 0,
      bytesReceived: 0,
      ...body,
    } as VpnTunnel;
    tunnels = [...tunnels, newTunnel];
    return HttpResponse.json({ data: newTunnel, status: 'ok' }, { status: 201 });
  }),

  http.delete('/api/vpn/tunnels/:id', async ({ params }) => {
    await delay(300);
    tunnels = tunnels.filter(t => t.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),

  // Connect / disconnect
  http.post('/api/vpn/tunnels/:id/connect', async ({ params }) => {
    await delay(1200);
    tunnels = tunnels.map(t =>
      t.id === params['id'] ? { ...t, status: 'connected', lastConnected: new Date().toISOString() } : t
    );
    return HttpResponse.json({ data: { status: 'connected' }, status: 'ok' });
  }),

  http.post('/api/vpn/tunnels/:id/disconnect', async ({ params }) => {
    await delay(800);
    tunnels = tunnels.map(t =>
      t.id === params['id'] ? { ...t, status: 'disconnected' } : t
    );
    return HttpResponse.json({ data: { status: 'disconnected' }, status: 'ok' });
  }),

  // Remote access
  http.get('/api/vpn/remote-access', async () => {
    await delay(200);
    return HttpResponse.json({ data: mockRemoteAccess, status: 'ok' });
  }),

  http.get('/api/vpn/remote-access/users', async () => {
    await delay(250);
    return HttpResponse.json({ data: mockRemoteUsers, status: 'ok' });
  }),
];
