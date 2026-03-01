import type { ReactNode } from 'react';
import { ArrowLeftRight, Globe, Layers, Lock, Network, Server, ShieldCheck } from 'lucide-react';
import { createElement } from 'react';

/** Maps a gateway `_icon` / `__tblName` / `type` string to a lucide icon (size 14). */
export function networkIcon(iconKey?: string): ReactNode {
  if (!iconKey) return createElement(Globe, { size: 14 });
  if (iconKey === 'networkObjectsGroup')                                  return createElement(Layers, { size: 14 });
  if (iconKey.includes('SINGLE_IP'))                                      return createElement(Server, { size: 14 });
  if (iconKey.includes('NETWORK') || iconKey.includes('SUBNET'))          return createElement(Network, { size: 14 });
  if (iconKey.includes('RANGE'))                                          return createElement(ArrowLeftRight, { size: 14 });
  if (iconKey.includes('DOMAIN') || iconKey.includes('FQDN'))            return createElement(Globe, { size: 14 });
  if (iconKey.includes('ZONE'))                                           return createElement(ShieldCheck, { size: 14 });
  return createElement(Globe, { size: 14 });
}

/** Maps a service name to a lucide icon — used as fallback when no appId CDN icon is available. */
export function serviceIcon(name: string): ReactNode {
  const n = name.toLowerCase();
  if (n.includes('http') || n.includes('web'))                        return createElement(Globe, { size: 14 });
  if (n.includes('dns'))                                              return createElement(Server, { size: 14 });
  if (n.includes('ssh') || n.includes('sftp') || n.includes('tls'))  return createElement(Lock, { size: 14 });
  if (n.includes('ftp'))                                              return createElement(ArrowLeftRight, { size: 14 });
  if (n.includes('rdp') || n.includes('smb') || n.includes('smtp'))  return createElement(Network, { size: 14 });
  if (n.includes('torrent') || n.includes('donkey'))                 return createElement(ArrowLeftRight, { size: 14 });
  if (n.includes('vpn') || n.includes('ike') || n.includes('esp'))   return createElement(ShieldCheck, { size: 14 });
  return createElement(Network, { size: 14 });
}
