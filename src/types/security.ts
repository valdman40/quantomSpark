export type RuleAction = 'Accept' | 'Drop' | 'Reject' | 'Encrypt';
export type TrackOption = 'None' | 'Log' | 'Alert' | 'Mail';

/** A single network object inside a group tooltip (non-recursive). */
export interface NetworkMember {
  name: string;
  /** Raw `_icon` or `type` string — mapped to a lucide icon in the UI. */
  iconKey?: string;
}

/** A source or destination network object in a firewall rule. */
export interface NetworkItem {
  name: string;
  /** Raw `_icon` / `__tblName` from the gateway — mapped to a lucide icon in the UI. */
  iconKey?: string;
  /** Human-readable type label (e.g. "Network object group", "Host"). */
  type?: string;
  /** From the gateway `comments` field. */
  description?: string;
  /** Populated for group objects — the member network objects. */
  members?: NetworkMember[];
}

/** A service or application entry in the Service column. */
export interface ServiceItem {
  name: string;
  /** Present when the gateway returns an appId — used to load the CP app icon. */
  appId?: number;
  /** Human-readable description of the service / application. */
  description?: string;
  /** Classification tags (e.g. "High Bandwidth", "VoIP"). */
  tags?: string[];
}

export interface FirewallRule {
  id: string;
  number: number;
  name: string;
  source: NetworkItem[];
  destination: NetworkItem[];
  service: ServiceItem[];
  action: RuleAction;
  track: TrackOption;
  enabled: boolean;
  comment?: string;
  installedOn: string[];
  /** ZONE.OUTGOING | ZONE.INTERNAL_INCOMING | ZONE.NONE — drives section headers */
  zone?: string;
  /** RULE_ORIGIN.MANUAL | RULE_ORIGIN.GENERATED | RULE_ORIGIN.SMP_PRE | … */
  origin?: string;
  /** Fractional ordering index within the section (zone + origin). */
  idx?: number;
  /** Gateway source table name (e.g. 'fwRule', 'fwGeneratedRule') — needed for destroy. */
  tblName?: string;
  /** Gateway native row ID (__id) — used as the key for destroy/update on the source table. */
  nativeId?: string;
}

export interface NatRule {
  id: string;
  number: number;
  name: string;
  originalSource: string;
  originalDestination: string;
  originalService: string;
  translatedSource: string;
  translatedDestination: string;
  translatedService: string;
  type: 'hide' | 'static' | 'manual';
  enabled: boolean;
  comment?: string;
}

export interface PolicyInstallStatus {
  status: 'idle' | 'installing' | 'success' | 'error';
  progress?: number;
  message?: string;
}
