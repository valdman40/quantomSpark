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

import type { GatewayFwRule, GatewayNetworkObject, GatewayService } from '../../../types/gateway';
import type { FirewallRule, RuleAction, TrackOption } from '../../../types/security';

// ─── Action mapping ────────────────────────────────────────────────────────────

const ACTION_MAP: Record<string, RuleAction> = {
  'ACTION.ACCEPT': 'Accept',
  'ACTION.BLOCK':  'Drop',
  'ACTION.DROP':   'Drop',
  'ACTION.REJECT': 'Reject',
  'ACTION.ENCRYPT':'Encrypt',
  'ACTION.LAYER':  'Accept',  // inline layer → treat top-level rule as Accept
};

function mapAction(raw: string): RuleAction {
  return ACTION_MAP[raw] ?? 'Drop';
}

// ─── Track / log mapping ──────────────────────────────────────────────────────

const TRACK_MAP: Record<string, TrackOption> = {
  'LOG_LEVEL.LOG':   'Log',
  'LOG_LEVEL.NONE':  'None',
  'LOG_LEVEL.ALERT': 'Alert',
  'LOG_LEVEL.MAIL':  'Mail',
};

function mapTrack(raw: string): TrackOption {
  return TRACK_MAP[raw] ?? 'None';
}

// ─── Name extraction helpers ──────────────────────────────────────────────────

function extractNetworkNames(arr: GatewayNetworkObject[] | unknown): string[] {
  if (!Array.isArray(arr) || arr.length === 0) return ['Any'];
  return (arr as GatewayNetworkObject[]).map(
    o => o.displayName || o.name || 'Unknown'
  );
}

function extractServiceNames(arr: GatewayService[] | unknown): string[] {
  if (!Array.isArray(arr) || arr.length === 0) return ['Any'];
  return (arr as GatewayService[]).map(o => o.name || 'Unknown');
}

function extractComment(val: string | []): string | undefined {
  if (!val || (Array.isArray(val) && val.length === 0)) return undefined;
  return String(val);
}

// ─── Sorting ──────────────────────────────────────────────────────────────────

/**
 * Sort gateway rules to match the visual order shown in the gateway web UI:
 *  1. sectionIdx ascending (top-level sections first)
 *  2. idx ascending within a section (handles fractional idx like 0.125, 0.25)
 *  3. Rules with no idx (empty array) sort after those with a numeric idx.
 */
function getRuleOrder(rule: GatewayFwRule): number {
  const section = rule.sectionIdx ?? 0;
  const idx = Array.isArray(rule.idx) ? Infinity : (rule.idx as number);
  // Combine into a sortable float: section * large-offset + fractional-idx
  return section * 1_000_000 + idx;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function normalizeFirewallRules(rawRules: GatewayFwRule[]): FirewallRule[] {
  return [...rawRules]
    .sort((a, b) => getRuleOrder(a) - getRuleOrder(b))
    .map((raw, index) => ({
      id:          raw.__pk,
      number:      index + 1,
      name:        raw.name,
      source:      extractNetworkNames(raw.sources),
      destination: extractNetworkNames(raw.destinations),
      service:     extractServiceNames(raw.appsAndServices),
      action:      mapAction(raw.action),
      track:       mapTrack(raw.log),
      enabled:     !raw.disabled,
      comment:     extractComment(raw.comment),
      installedOn: ['All'],
    }));
}
