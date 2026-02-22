export type LogBlade =
  | 'Firewall'
  | 'IPS'
  | 'Anti-Virus'
  | 'URL Filtering'
  | 'Anti-Bot'
  | 'Application Control'
  | 'VPN';

export type LogAction = 'Accept' | 'Drop' | 'Reject' | 'Encrypt' | 'Block' | 'Detect';
export type LogSeverity = 'low' | 'medium' | 'high' | 'critical' | 'info';

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  blade: LogBlade;
  action: LogAction;
  severity: LogSeverity;
  sourceIp: string;
  sourcePort?: number;
  destinationIp: string;
  destinationPort?: number;
  service: string;
  ruleName: string;
  ruleNumber?: number;
  description?: string;
  productFamily?: string;
}

export interface TrafficLogEntry {
  id: string;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: string;
  service: string;
  action: LogAction;
  bytesSent: number;
  bytesReceived: number;
  packets: number;
  duration: number;
  application?: string;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  component: string;
  message: string;
  details?: string;
}

export interface LogFilters {
  timeRange: '1h' | '6h' | '24h' | '7d' | '30d';
  blade?: LogBlade;
  action?: LogAction;
  severity?: LogSeverity;
  searchText: string;
  sourceIp?: string;
  destinationIp?: string;
}
