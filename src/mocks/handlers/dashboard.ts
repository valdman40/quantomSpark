import { http, HttpResponse, delay } from 'msw';
import { mockDashboard } from '../data/dashboard';

export const dashboardHandlers = [
  http.get('/api/dashboard/summary', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockDashboard, status: 'ok' });
  }),
];
