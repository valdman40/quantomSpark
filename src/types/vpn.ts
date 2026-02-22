export type TunnelStatus = 'connected' | 'disconnected' | 'connecting' | 'error';
export type IkeVersion = 'IKEv1' | 'IKEv2';
export type EncryptionAlgorithm = 'AES-128' | 'AES-256' | '3DES';
export type HashAlgorithm = 'SHA1' | 'SHA256' | 'SHA384' | 'MD5';
export type DhGroup = 'Group1' | 'Group2' | 'Group5' | 'Group14' | 'Group19' | 'Group20';

export interface VpnTunnel {
  id: string;
  name: string;
  peerIp: string;
  peerName?: string;
  status: TunnelStatus;
  ikeVersion: IkeVersion;
  phase1Encryption: EncryptionAlgorithm;
  phase1Hash: HashAlgorithm;
  phase1DhGroup: DhGroup;
  phase1Lifetime: number;
  phase2Encryption: EncryptionAlgorithm;
  phase2Hash: HashAlgorithm;
  phase2Lifetime: number;
  localSubnets: string[];
  remoteSubnets: string[];
  preSharedKey?: string;
  comment?: string;
  lastConnected?: string;
  bytesSent: number;
  bytesReceived: number;
}

export interface RemoteAccessSettings {
  enabled: boolean;
  officeModeEnabled: boolean;
  officeModeNetwork: string;
  authMethod: 'certificate' | 'username-password' | 'multi-factor';
  maxConcurrentConnections: number;
  sessionTimeout: number;
  bladeEnabled: boolean;
}

export interface RemoteAccessUser {
  id: string;
  username: string;
  clientIp: string;
  assignedIp: string;
  connectedSince: string;
  bytesSent: number;
  bytesReceived: number;
}
