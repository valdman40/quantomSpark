import { http, HttpResponse, delay } from 'msw';
import { mockSystemOverview, mockSecurityDashboard, mockNotifications, mockAssets, mockBladeCategories } from '../data/home';
import type { SystemNotification } from '../../types/home';

export const homeHandlers = [
  // System Overview
  http.get('/api/home/system-overview', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockSystemOverview, status: 'ok' });
  }),

  // Security Dashboard
  http.get('/api/home/security-dashboard-data', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockSecurityDashboard, status: 'ok' });
  }),

  // Notifications list (paginated)
  http.get('/api/home/notifications', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockNotifications.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockNotifications.length, page, pageSize, hasMore: start + pageSize < mockNotifications.length, nextPage: page + 1, status: 'ok' });
  }),

  // Mark single notification read
  http.patch('/api/home/notifications/:id', async ({ params }) => {
    await delay(100);
    const n = mockNotifications.find(x => x.id === params.id);
    if (n) n.read = true;
    return HttpResponse.json({ data: n, status: 'ok' });
  }),

  // Clear all notifications
  http.post('/api/home/notifications/clear', async () => {
    await delay(400);
    mockNotifications.forEach((n: SystemNotification) => { n.read = true; });
    return HttpResponse.json({ status: 'ok' });
  }),

  // Assets (paginated)
  http.get('/api/home/assets', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockAssets.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockAssets.length, page, pageSize, hasMore: start + pageSize < mockAssets.length, nextPage: page + 1, status: 'ok' });
  }),

  // Blade categories
  http.get('/api/home/blade-categories', async () => {
    await delay(200);
    return HttpResponse.json({ data: mockBladeCategories, status: 'ok' });
  }),

  // Toggle blade
  http.post('/api/home/blade-categories/toggle/:id', async ({ params }) => {
    await delay(150);
    for (const cat of mockBladeCategories) {
      const blade = cat.blades.find(b => b.id === params.id);
      if (blade) { blade.enabled = !blade.enabled; break; }
    }
    return HttpResponse.json({ data: mockBladeCategories, status: 'ok' });
  }),
];
