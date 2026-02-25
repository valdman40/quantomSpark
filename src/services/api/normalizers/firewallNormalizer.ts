/**
 * Maps the verbose Quantum Spark gateway fwRule objects to the lean
 * FirewallRule type used by the rest of the UI.
 *
 * Gateway quirks handled here:
 *  - "Empty" scalar fields arrive as [] (empty array) rather than null/undefined.
 *  - sources / destinations / appsAndServices are arrays of network objects;
 *    an empty array means "Any".
 *  - action uses enum strings like "ACTION.ACCEPT"; we map them to our RuleAction.
 *  - log uses enum strings like "LOG_LEVEL.LOG"; we map them to our TrackOption.
 *  - idx can be a non-integer (e.g. 0.125) or [] when unset; sectionIdx is always set.
 *  - ACTION.LAYER rules contain an inline sub-layer; we collapse them to "Accept".
 */

import type {
  GatewayFwRule,
  GatewayNetworkObject,
  GatewayService,
} from '../../../types/gateway';
import type {
  FirewallRule,
  RuleAction,
  ServiceItem,
  TrackOption,
} from '../../../types/security';

// ─── Action mapping ────────────────────────────────────────────────────────────

const ACTION_MAP: Record<string, RuleAction> = {
  'ACTION.ACCEPT': 'Accept',
  'ACTION.BLOCK': 'Drop',
  'ACTION.DROP': 'Drop',
  'ACTION.REJECT': 'Reject',
  'ACTION.ENCRYPT': 'Encrypt',
  'ACTION.LAYER': 'Accept', // inline layer → treat top-level rule as Accept
};

function mapAction(raw: string): RuleAction {
  return ACTION_MAP[raw] ?? 'Drop';
}

// ─── Track / log mapping ──────────────────────────────────────────────────────

const TRACK_MAP: Record<string, TrackOption> = {
  'LOG_LEVEL.LOG': 'Log',
  'LOG_LEVEL.NONE': 'None',
  'LOG_LEVEL.ALERT': 'Alert',
  'LOG_LEVEL.MAIL': 'Mail',
};

function mapTrack(raw: string): TrackOption {
  return TRACK_MAP[raw] ?? 'None';
}

// ─── Name extraction helpers ──────────────────────────────────────────────────

function extractNetworkNames(arr: GatewayNetworkObject[] | unknown): string[] {
  if (!Array.isArray(arr) || arr.length === 0) return ['Any'];
  return (arr as GatewayNetworkObject[]).map(
    (o) => o.displayName || o.name || 'Unknown'
  );
}

function extractServices(arr: GatewayService[] | unknown): ServiceItem[] {
  if (!Array.isArray(arr) || arr.length === 0) return [{ name: 'Any' }];
  return (arr as GatewayService[]).map((o) => ({
    name:        o.name || 'Unknown',
    appId:       typeof o.appId === 'number' ? o.appId : undefined,
    description: typeof o.description === 'string' && o.description ? o.description : undefined,
    tags:        typeof o.tags === 'string' && o.tags
                   ? o.tags.split(',').map(t => t.trim()).filter(Boolean)
                   : undefined,
  }));
}

function extractComment(val: string | []): string | undefined {
  if (!val || (Array.isArray(val) && val.length === 0)) return undefined;
  return String(val);
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

/**
 * Sort priority for the zone field.
 * Gateway UI shows outgoing rules first, then incoming, then everything else.
 */
const ZONE_ORDER: Record<string, number> = {
  'ZONE.OUTGOING': 0,
  'ZONE.INTERNAL_INCOMING': 1,
};

/**
 * Sort priority for the origin field.
 * Matches the gateway rulebase section ordering (derived from the UI source):
 *   SMP_PRE → MANUAL → SMP_POST → GENERATED → IOT → (unknown)
 */
const ORIGIN_ORDER: Record<string, number> = {
  'RULE_ORIGIN.SMP_PRE': 1,
  'RULE_ORIGIN.MANUAL': 2,
  'RULE_ORIGIN.SMP_POST': 3,
  'RULE_ORIGIN.GENERATED': 4,
  'RULE_ORIGIN.IOT': 5,
};

/**
 * Three-level comparator matching the gateway web UI rule order:
 *  1. Zone     — OUTGOING before INTERNAL_INCOMING before others
 *  2. Origin   — SMP_PRE → MANUAL → SMP_POST → GENERATED → IOT
 *  3. idx      — ascending; rules with no idx ([] empty array) sort last
 */
function compareRules(a: GatewayFwRule, b: GatewayFwRule): number {
  const zoneDiff = (ZONE_ORDER[a.zone] ?? 99) - (ZONE_ORDER[b.zone] ?? 99);
  if (zoneDiff !== 0) return zoneDiff;

  const originDiff =
    (ORIGIN_ORDER[a.origin] ?? 99) - (ORIGIN_ORDER[b.origin] ?? 99);
  if (originDiff !== 0) return originDiff;

  const aIdx = Array.isArray(a.idx) ? Infinity : (a.idx as number);
  const bIdx = Array.isArray(b.idx) ? Infinity : (b.idx as number);
  return aIdx - bIdx;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Insert a newly created rule into an existing normalized array, re-sort by the
 * same zone → origin → idx order, then renumber all rules.
 * Use after a successful gateway `fwRule.create` to update the RQ cache in-place.
 */
export function insertRule(
  existing: FirewallRule[],
  newRule: FirewallRule
): FirewallRule[] {
  const merged = [...existing, newRule];
  merged.sort((a, b) => {
    const zoneDiff =
      (ZONE_ORDER[a.zone ?? ''] ?? 99) - (ZONE_ORDER[b.zone ?? ''] ?? 99);
    if (zoneDiff !== 0) return zoneDiff;
    const originDiff =
      (ORIGIN_ORDER[a.origin ?? ''] ?? 99) -
      (ORIGIN_ORDER[b.origin ?? ''] ?? 99);
    if (originDiff !== 0) return originDiff;
    return (a.idx ?? Infinity) - (b.idx ?? Infinity);
  });
  return merged.map((r, i) => ({ ...r, number: i + 1 }));
}

/**
 * Replace an existing rule (matched by id) with updated data, then renumber.
 * Use after a successful gateway `fwRule.update` to update the RQ cache in-place.
 */
export function replaceRule(
  existing: FirewallRule[],
  updatedRule: FirewallRule
): FirewallRule[] {
  return existing
    .map((r) => (r.id === updatedRule.id ? updatedRule : r))
    .map((r, i) => ({ ...r, number: i + 1 }));
}

export function normalizeFirewallRules(
  rawRules: GatewayFwRule[]
): FirewallRule[] {
  return [...rawRules].sort(compareRules).map((raw, index) => ({
    id: raw.__pk,
    number: index + 1,
    name: raw.name,
    source: extractNetworkNames(raw.sources),
    destination: extractNetworkNames(raw.destinations),
    service: extractServices(raw.appsAndServices),
    action: mapAction(raw.action),
    track: mapTrack(raw.log),
    enabled: raw.disabled !== true, // gateway may return [] for "unset"; treat as enabled
    comment: extractComment(raw.comment),
    installedOn: ['All'],
    zone: raw.zone,
    origin: raw.origin,
    idx: Array.isArray(raw.idx) ? undefined : (raw.idx as number),
    tblName: raw.__tblName,
    nativeId: raw.__id,
  }));
}
