import { http, HttpResponse, delay } from 'msw';
import { mockTunnels, mockRemoteAccess, mockRemoteUsers } from '../data/vpn';
import type { VpnTunnel } from '../../types/vpn';

let tunnels = [...mockTunnels];

export const vpnHandlers = [
  http.get('/api/vpn/tunnels', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = tunnels.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: tunnels.length, page, pageSize, hasMore: start + pageSize < tunnels.length, nextPage: page + 1, status: 'ok' });
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

  http.get('/api/vpn/remote-access/users', async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockRemoteUsers.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockRemoteUsers.length, page, pageSize, hasMore: start + pageSize < mockRemoteUsers.length, nextPage: page + 1, status: 'ok' });
  }),
];
