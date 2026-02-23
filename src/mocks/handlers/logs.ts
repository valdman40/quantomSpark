import { http, HttpResponse, delay } from 'msw';
import { mockSecurityLogs, mockTrafficLogs, mockSystemEvents } from '../data/logs';

export const logsHandlers = [
  http.get('/api/logs/security', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockSecurityLogs.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockSecurityLogs.length, page, pageSize, hasMore: start + pageSize < mockSecurityLogs.length, nextPage: page + 1, status: 'ok' });
  }),

  http.get('/api/logs/traffic', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockTrafficLogs.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockTrafficLogs.length, page, pageSize, hasMore: start + pageSize < mockTrafficLogs.length, nextPage: page + 1, status: 'ok' });
  }),

  http.get('/api/logs/events', async ({ request }) => {
    await delay(350);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = mockSystemEvents.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: mockSystemEvents.length, page, pageSize, hasMore: start + pageSize < mockSystemEvents.length, nextPage: page + 1, status: 'ok' });
  }),
];
