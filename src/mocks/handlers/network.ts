import { http, HttpResponse, delay } from 'msw';
import { mockInterfaces, mockRoutes, mockDns } from '../data/network';
import type { NetworkInterface, StaticRoute, DnsSettings } from '../../types/network';

// In-memory mutable copies for full CRUD simulation
let interfaces = [...mockInterfaces];
let routes = [...mockRoutes];
let dnsSettings = { ...mockDns };

export const networkHandlers = [
  // Interfaces
  http.get('/api/network/interfaces', async () => {
    await delay(250);
    return HttpResponse.json({ data: interfaces, status: 'ok' });
  }),

  http.post('/api/network/interfaces', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Partial<NetworkInterface>;
    const newIf: NetworkInterface = {
      id: `if-${Date.now()}`,
      name: body.name ?? 'eth-new',
      type: body.type ?? 'ethernet',
      ipAddress: body.ipAddress ?? '',
      subnetMask: body.subnetMask ?? '255.255.255.0',
      status: 'down',
      speedMbps: 0,
      macAddress: '00:00:00:00:00:00',
      mtu: body.mtu ?? 1500,
      zone: body.zone ?? 'none',
      dhcp: body.dhcp ?? false,
      comment: body.comment,
    };
    interfaces = [...interfaces, newIf];
    return HttpResponse.json({ data: newIf, status: 'ok' }, { status: 201 });
  }),

  http.put('/api/network/interfaces/:id', async ({ params, request }) => {
    await delay(400);
    const body = await request.json() as Partial<NetworkInterface>;
    interfaces = interfaces.map(i => i.id === params['id'] ? { ...i, ...body } : i);
    const updated = interfaces.find(i => i.id === params['id']);
    return HttpResponse.json({ data: updated, status: 'ok' });
  }),

  http.delete('/api/network/interfaces/:id', async ({ params }) => {
    await delay(300);
    interfaces = interfaces.filter(i => i.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),

  // Routes
  http.get('/api/network/routes', async () => {
    await delay(250);
    return HttpResponse.json({ data: routes, status: 'ok' });
  }),

  http.post('/api/network/routes', async ({ request }) => {
    await delay(350);
    const body = await request.json() as Partial<StaticRoute>;
    const newRoute: StaticRoute = { id: `r-${Date.now()}`, type: 'static', metric: 10, ...body } as StaticRoute;
    routes = [...routes, newRoute];
    return HttpResponse.json({ data: newRoute, status: 'ok' }, { status: 201 });
  }),

  http.delete('/api/network/routes/:id', async ({ params }) => {
    await delay(300);
    routes = routes.filter(r => r.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),

  // DNS
  http.get('/api/network/dns', async () => {
    await delay(200);
    return HttpResponse.json({ data: dnsSettings, status: 'ok' });
  }),

  http.put('/api/network/dns', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Partial<DnsSettings>;
    dnsSettings = { ...dnsSettings, ...body };
    return HttpResponse.json({ data: dnsSettings, status: 'ok' });
  }),
];
