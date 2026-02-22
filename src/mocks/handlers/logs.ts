import { http, HttpResponse, delay } from 'msw';
import { mockSecurityLogs, mockTrafficLogs, mockSystemEvents } from '../data/logs';

export const logsHandlers = [
  http.get('/api/logs/security', async () => {
    await delay(400);
    return HttpResponse.json({ data: mockSecurityLogs, status: 'ok', total: mockSecurityLogs.length });
  }),

  http.get('/api/logs/traffic', async () => {
    await delay(400);
    return HttpResponse.json({ data: mockTrafficLogs, status: 'ok', total: mockTrafficLogs.length });
  }),

  http.get('/api/logs/events', async () => {
    await delay(350);
    return HttpResponse.json({ data: mockSystemEvents, status: 'ok', total: mockSystemEvents.length });
  }),
];
