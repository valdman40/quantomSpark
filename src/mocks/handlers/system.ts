import { http, HttpResponse, delay } from 'msw';
import { mockAdmins, mockVersion, mockHa } from '../data/system';
import type { Administrator } from '../../types/system';

let admins = [...mockAdmins];

export const systemHandlers = [
  http.get('/api/system/admins', async () => {
    await delay(300);
    return HttpResponse.json({ data: admins, status: 'ok' });
  }),

  http.post('/api/system/admins', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Partial<Administrator>;
    const newAdmin: Administrator = {
      id: `adm-${Date.now()}`,
      username: body.username ?? '',
      email: body.email ?? '',
      permission: body.permission ?? 'read-only',
      status: 'active',
      loginAttempts: 0,
      createdAt: new Date().toISOString(),
    };
    admins = [...admins, newAdmin];
    return HttpResponse.json({ data: newAdmin, status: 'ok' }, { status: 201 });
  }),

  http.delete('/api/system/admins/:id', async ({ params }) => {
    await delay(300);
    admins = admins.filter(a => a.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),

  http.get('/api/system/version', async () => {
    await delay(200);
    return HttpResponse.json({ data: mockVersion, status: 'ok' });
  }),

  http.post('/api/system/check-update', async () => {
    await delay(2000); // simulate network check
    return HttpResponse.json({ data: mockVersion, status: 'ok' });
  }),

  http.post('/api/system/install-update', async () => {
    await delay(3000); // simulate download + install
    return HttpResponse.json({ data: { success: true, version: mockVersion.latestVersion }, status: 'ok' });
  }),

  http.get('/api/system/ha', async () => {
    await delay(250);
    return HttpResponse.json({ data: mockHa, status: 'ok' });
  }),
];
