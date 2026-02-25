/**
 * Types for the Quantum Spark gateway JSON-RPC API.
 *
 * Request format
 * ──────────────
 * POST /platform.cgi?mvc=true&token={token}&currentPage={page}&op={op}
 * Headers: Content-Type: application/json, X-Requested-With: XMLHttpRequest
 *          Cookie: cpa=admin; UTM1Login={session_token}  (injected by Vite proxy)
 * Body:
 *   {
 *     "action": "fwRuleView",
 *     "method": "read",
 *     "data": [{ "dataRequestType": "config", "page": 1, "limit": 2000 }],
 *     "type": "rpc",
 *     "tid": 1
 *   }
 *
 * Response envelope
 * ─────────────────
 * {
 *   "type": "rpc",
 *   "tid": 1,
 *   "result": {
 *     "totalCount": 12,
 *     "success": true,
 *     "messages": { "fullMessages": [] },
 *     "data": [ ...typed objects... ]
 *   }
 * }
 *
 * Convention: the gateway uses `[]` (empty array) to represent "unset" scalar
 * fields, so many fields are typed as `T | []`.
 */

/** A network object (host, network, zone, group) that appears in source/dest lists. */
export interface GatewayNetworkObject {
  __pk: string;
  __id: string;
  __tblName: string;
  name: string;
  displayName: string;
  type: string;
  _icon: string;
  not_owned: boolean | [];
  interfaces: unknown[];
  ipAddresses: unknown[];
  modified: string | [];
  comments: string | [];
  show: boolean | [];
}

/** A service or application that appears in the appsAndServices list. */
export interface GatewayService {
  __pk: string;
  __id: string;
  __tblName: string;
  name: string;
  /** Numeric application ID — present for app entries, [] for service groups. */
  appId: number | [];
  type: string;
  ipProtocol: number | [];
  systemUUID: string | [];
  not_owned: boolean | [];
  modified: string | [];
  /** Human-readable description of the service/app. [] when absent. */
  description: string | [];
  /** Comma-separated classification tags (e.g. "High Bandwidth,VoIP"). [] when absent. */
  tags: string | [];
  comments: string | [];
}

/** An inline action layer embedded in a rule with `action: "ACTION.LAYER"`. */
export interface GatewayActionLayer {
  id: number;
  name: string;
  key: string;
  ruleBaseType: string;
  rules: unknown[];
  ips: boolean;
  appi: boolean;
  ab: boolean;
  av: boolean;
  zp: boolean;
  ssl: boolean;
  nat: boolean;
  idx: number;
  modified: string | [];
  sections: unknown[];
}

/**
 * A firewall rule as returned by the gateway.
 * Covers both `fwRule` and `fwGeneratedRule` table entries.
 *
 * Action values: ACTION.ACCEPT | ACTION.BLOCK | ACTION.REJECT | ACTION.LAYER
 * Log values:    LOG_LEVEL.LOG | LOG_LEVEL.NONE | LOG_LEVEL.ALERT
 * Zone values:   ZONE.NONE | ZONE.INTERNAL_INCOMING | ZONE.OUTGOING
 * Origin values: RULE_ORIGIN.SMP_PRE | RULE_ORIGIN.MANUAL | RULE_ORIGIN.SMP_POST
 *                | RULE_ORIGIN.GENERATED | RULE_ORIGIN.IOT
 */
export interface GatewayFwRule {
  __pk: string;
  __id: string;
  __tblName: 'fwRule' | 'fwGeneratedRule';
  name: string;
  action: string;
  disabled: boolean;
  log: string;
  zone: string;
  origin: string;
  isGenerated: boolean | [];
  sectionIdx: number;
  idx: number | [];
  ownerKey: string;
  actionLayerKey: string | [];
  comment: string | [];
  modified: string | [];
  encrypted: boolean;
  lockBySMP: boolean;
  srcNegate: boolean;
  dstNegate: boolean;
  srvcNegate: boolean;
  appNegate: boolean;
  appAndSrvcNegate: boolean;
  isTimeConfigured: boolean;
  isUploadLimit: boolean;
  isDownloadLimit: boolean;
  maxUploadLimit: number | [];
  maxDownloadLimit: number | [];
  policyType: string | [];
  ownerType: string | [];
  /** Network objects for the source column. Empty array means "Any". */
  sources: GatewayNetworkObject[];
  /** Network objects for the destination column. Empty array means "Any". */
  destinations: GatewayNetworkObject[];
  /** Services / applications. Empty array means "Any". */
  appsAndServices: GatewayService[];
  /** Inline layer object when action is ACTION.LAYER, otherwise []. */
  actionLayer: GatewayActionLayer | [];
  active: boolean | [];
  not_owned: boolean;
  timeObject: unknown[];
  srcZone: unknown[];
  dstZone: unknown[];
  srcUpdatableObject: unknown[];
  dstUpdatableObject: unknown[];
  moreInfo: string | [];
}

/** Top-level JSON-RPC response wrapper returned by platform.cgi. */
export interface GatewayRpcResponse<T> {
  type: 'rpc';
  tid: number;
  result: {
    totalCount: number;
    success: boolean;
    messages: {
      fullMessages: string[] | Record<string, Array<{ type: string; code: string; text: string }>>;
    };
    data: T[];
  };
}

/** JSON-RPC request body sent to platform.cgi. */
export interface GatewayRpcRequest {
  action: string;
  method: string;
  data: unknown[];
  type: 'rpc';
  tid: number;
}
