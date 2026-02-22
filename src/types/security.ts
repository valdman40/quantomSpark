export type RuleAction = 'Accept' | 'Drop' | 'Reject' | 'Encrypt';
export type TrackOption = 'None' | 'Log' | 'Alert' | 'Mail';

export interface FirewallRule {
  id: string;
  number: number;
  name: string;
  source: string[];
  destination: string[];
  service: string[];
  action: RuleAction;
  track: TrackOption;
  enabled: boolean;
  comment?: string;
  installedOn: string[];
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
