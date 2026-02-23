/**
 * Application feature flags and gateway configuration.
 * All values come from environment variables — set them in .env.local (not committed).
 * See .env.example for the full list and instructions.
 */

/** When true, the firewall rules hook calls the real gateway instead of MSW mock data. */
export const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true';

/**
 * URL token included in every platform.cgi request as ?token=...
 * This is the same token visible in the gateway web UI's address bar.
 */
export const GATEWAY_TOKEN = (import.meta.env.VITE_GATEWAY_TOKEN as string | undefined) ?? '';
