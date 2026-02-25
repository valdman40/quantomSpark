/**
 * HTTP client for the Quantum Spark gateway JSON-RPC API.
 *
 * All requests are proxied through Vite's dev server (/gateway → https://{ip}:4434)
 * so the browser never hits the gateway directly — this solves both CORS and the
 * self-signed-certificate problem. The Vite proxy also injects the Cookie header
 * (which browsers forbid setting from JavaScript).
 *
 * See vite.config.ts for proxy configuration and .env.example for required vars.
 */

import { GATEWAY_TOKEN } from '../../config';
import type {
  GatewayFwRule,
  GatewayRpcRequest,
  GatewayRpcResponse,
} from '../../types/gateway';

// Monotonically increasing transaction ID, per JSON-RPC spec.
let _tid = 0;

/**
 * Core RPC call — POSTs to /gateway/platform.cgi with the JSON-RPC envelope.
 *
 * @param op          The `op` query parameter (e.g. "fwRuleView.read")
 * @param currentPage The `currentPage` query param (e.g. "app.FWAllRulebase")
 * @param action      The `action` field in the RPC body (e.g. "fwRuleView")
 * @param method      The `method` field (typically "read", "create", "update", "delete")
 * @param data        The `data` array payload
 */
async function rpcCall<T>(
  op: string,
  currentPage: string,
  action: string,
  method: string,
  data: unknown[],
): Promise<GatewayRpcResponse<T>> {
  const tid = ++_tid;

  const qs = new URLSearchParams({
    mvc: 'true',
    token: GATEWAY_TOKEN,
    currentPage,
    op,
  });

  const body: GatewayRpcRequest = { action, method, data, type: 'rpc', tid };

  const res = await fetch(`/gateway/platform.cgi?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Gateway responded with ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();

  // Some Ext JS / JSON-RPC backends wrap the response in an array even for
  // single requests: [{type:"rpc", result:{...}}] — unwrap if needed.
  const json = (Array.isArray(raw) ? raw[0] : raw) as GatewayRpcResponse<T>;

  console.log('[gateway] response envelope:', {
    isArray: Array.isArray(raw),
    type: json?.type,
    success: json?.result?.success,
    totalCount: json?.result?.totalCount,
    dataLength: Array.isArray(json?.result?.data) ? json.result.data.length : json?.result?.data,
  });

  if (!json.result?.success) {
    const fullMessages = json.result?.messages?.fullMessages;
    let errorText: string;
    if (Array.isArray(fullMessages)) {
      errorText = fullMessages.join('; ') || 'unknown error';
    } else if (fullMessages && typeof fullMessages === 'object') {
      errorText = Object.entries(fullMessages)
        .map(([field, errs]) =>
          `${field}: ${(errs as Array<{ text: string }>).map(e => e.text).join(', ')}`)
        .join('; ');
    } else {
      errorText = 'unknown error';
    }
    throw new Error(`Gateway error: ${errorText}`);
  }

  return json;
}

// ─── Endpoint-specific methods ────────────────────────────────────────────────

export const gatewayClient = {
  /**
   * Fetches all firewall rules from the Access Policy rulebase.
   * Equivalent to: Security > Access Policy > Policy in the gateway web UI.
   */
  fetchFirewallRules(): Promise<GatewayRpcResponse<GatewayFwRule>> {
    return rpcCall<GatewayFwRule>(
      'fwRuleView.read',
      'app.FWAllRulebase',
      'fwRuleView',
      'read',
      [{ dataRequestType: 'config', page: 1, limit: 2000 }],
    );
  },

  /**
   * Returns a new GatewayFwRule with gateway-provided default values.
   * Call this before opening the "Add Rule" form to pre-populate fields.
   */
  newInstance(): Promise<GatewayRpcResponse<GatewayFwRule>> {
    return rpcCall<GatewayFwRule>(
      'fwRule.newInstance',
      'app.FWAllRulebase',
      'fwRule',
      'newInstance',
      [],
    );
  },

  /**
   * Creates a new firewall rule on the gateway.
   * @param data Full GatewayFwRule object (newInstance defaults + form values applied)
   */
  createRule(data: Record<string, unknown>): Promise<GatewayRpcResponse<GatewayFwRule>> {
    return rpcCall<GatewayFwRule>(
      'fwRule.create',
      'app.FWAllRulebase',
      'fwRule',
      'create',
      [data],
    );
  },

  /**
   * Updates an existing firewall rule on the gateway.
   * @param data Full GatewayFwRule object with updated fields
   */
  updateRule(data: Record<string, unknown>): Promise<GatewayRpcResponse<GatewayFwRule>> {
    return rpcCall<GatewayFwRule>(
      'fwRule.update',
      'app.FWAllRulebase',
      'fwRule',
      'update',
      [data],
    );
  },

  /**
   * Deletes a firewall rule on the gateway.
   * @param tblName The source table (from GatewayFwRule.__tblName, e.g. 'fwRule')
   * @param nativeId The row's __id on that table
   */
  destroyRule(tblName: string, nativeId: string): Promise<GatewayRpcResponse<GatewayFwRule>> {
    return rpcCall<GatewayFwRule>(
      `${tblName}.destroy`,
      'app.FWAllRulebase',
      tblName,
      'destroy',
      [{ id: nativeId }],
    );
  },
};
