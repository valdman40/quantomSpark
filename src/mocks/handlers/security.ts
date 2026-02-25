import { http, HttpResponse, delay } from 'msw';
import { mockFirewallRules, mockNatRules } from '../data/security';
import type { FirewallRule, NatRule } from '../../types/security';

let rules = [...mockFirewallRules];
let natRules = [...mockNatRules];

export const securityHandlers = [
  // Firewall rules
  http.get('/api/security/rules', async () => {
    await delay(300);
    return HttpResponse.json({ data: rules, status: 'ok' });
  }),

  http.post('/api/security/rules', async ({ request }) => {
    await delay(500);
    const body = await request.json() as Partial<FirewallRule>;
    const newRule: FirewallRule = {
      id: `fr-${Date.now()}`,
      number: rules.length + 1,
      name: body.name ?? 'New Rule',
      source: body.source ?? ['Any'],
      destination: body.destination ?? ['Any'],
      service: body.service ?? [{ name: 'Any' }],
      action: body.action ?? 'Drop',
      track: body.track ?? 'Log',
      enabled: body.enabled ?? true,
      installedOn: body.installedOn ?? ['All'],
      comment: body.comment,
    };
    rules = [...rules, newRule];
    return HttpResponse.json({ data: newRule, status: 'ok' }, { status: 201 });
  }),

  http.put('/api/security/rules/:id', async ({ params, request }) => {
    await delay(500);
    const body = await request.json() as Partial<FirewallRule>;
    rules = rules.map(r => r.id === params['id'] ? { ...r, ...body } : r);
    const updated = rules.find(r => r.id === params['id']);
    return HttpResponse.json({ data: updated, status: 'ok' });
  }),

  http.delete('/api/security/rules/:id', async ({ params }) => {
    await delay(400);
    rules = rules.filter(r => r.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),

  // Reorder rules — receives an ordered array of rule IDs, rebuilds `number` fields
  http.patch('/api/security/rules/reorder', async ({ request }) => {
    await delay(200);
    const { ruleIds } = await request.json() as { ruleIds: string[] };
    // Rebuild `rules` in the supplied order, updating `number` to match position
    const reordered: FirewallRule[] = [];
    ruleIds.forEach((id, idx) => {
      const rule = rules.find(r => r.id === id);
      if (rule) reordered.push({ ...rule, number: idx + 1 });
    });
    // Keep any rules not present in the payload at the end (safety net)
    rules.filter(r => !ruleIds.includes(r.id)).forEach((r, idx) => {
      reordered.push({ ...r, number: reordered.length + idx + 1 });
    });
    rules = reordered;
    return HttpResponse.json({ data: rules, status: 'ok' });
  }),

  // Policy install — simulates a ~1.5s install process
  http.post('/api/security/install-policy', async () => {
    await delay(1500);
    return HttpResponse.json({ data: { success: true, rulesInstalled: rules.length, duration: 1.5 }, status: 'ok' });
  }),

  // NAT rules (paginated)
  http.get('/api/security/nat', async ({ request }) => {
    await delay(250);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const start = (page - 1) * pageSize;
    const slice = natRules.slice(start, start + pageSize);
    return HttpResponse.json({ data: slice, total: natRules.length, page, pageSize, hasMore: start + pageSize < natRules.length, nextPage: page + 1, status: 'ok' });
  }),

  http.post('/api/security/nat', async ({ request }) => {
    await delay(400);
    const body = await request.json() as Partial<NatRule>;
    const newNat: NatRule = { id: `nat-${Date.now()}`, number: natRules.length + 1, ...body } as NatRule;
    natRules = [...natRules, newNat];
    return HttpResponse.json({ data: newNat, status: 'ok' }, { status: 201 });
  }),

  http.delete('/api/security/nat/:id', async ({ params }) => {
    await delay(300);
    natRules = natRules.filter(r => r.id !== params['id']);
    return HttpResponse.json({ data: null, status: 'ok' });
  }),
];
