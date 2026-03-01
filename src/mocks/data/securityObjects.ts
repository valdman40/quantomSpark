import type { NetworkItem, ServiceItem } from '../../types/security';

// ─── Network Objects ───────────────────────────────────────────────────────────
export let mockNetworkObjects: NetworkItem[] = [
  // Hosts
  { name: 'DMZ-WebServer',  type: 'Host', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP',  description: 'Primary web server in DMZ — 172.16.10.10' },
  { name: 'Roypoint-GW',    type: 'Host', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP',  description: 'Quantum Spark gateway management interface' },
  { name: 'Mail-Server',    type: 'Host', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP',  description: 'Corporate mail server — 172.16.10.20' },
  { name: 'Dev-PC',         type: 'Host', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP',  description: 'Developer workstation — 10.0.1.42' },
  { name: 'Backup-Host',    type: 'Host', iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP',  description: 'Offsite backup server — 10.0.1.50' },

  // Networks
  { name: 'LAN',            type: 'Network', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'Internal LAN — 10.0.0.0/8' },
  { name: 'DMZ',            type: 'Network', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'Demilitarized zone — 172.16.10.0/24' },
  { name: 'WAN',            type: 'Network', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'WAN interface network' },
  { name: 'Guest-Wifi',     type: 'Network', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'Guest wireless network — 192.168.50.0/24' },
  { name: 'Internet',       type: 'Zone',    iconKey: 'NETWORKOBJECT_BASIC_TYPE.ZONE',    description: 'External internet zone' },

  // Groups
  {
    name: 'LAN-Users', type: 'Network object group', iconKey: 'networkObjectsGroup',
    description: 'Managed user endpoints on LAN',
    members: [
      { name: 'Mgmt-PC',          iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
      { name: 'Dev-Workstation',  iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
    ],
  },
  {
    name: 'DMZ-Servers', type: 'Network object group', iconKey: 'networkObjectsGroup',
    description: 'All servers hosted in the DMZ',
    members: [
      { name: 'Web-01',   iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
      { name: 'Mail-01',  iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
      { name: 'DB-01',    iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
    ],
  },
  {
    name: 'Remote-Admins', type: 'Network object group', iconKey: 'networkObjectsGroup',
    description: 'Administrators connecting via VPN',
    members: [
      { name: 'Admin-Home',    iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
      { name: 'Admin-Mobile',  iconKey: 'NETWORKOBJECT_BASIC_TYPE.SINGLE_IP' },
    ],
  },

  // VPN
  { name: 'VPN_RA_Community', type: 'VPN Community', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'Remote access VPN user pool' },
  { name: 'Site-to-Site-NY',  type: 'VPN Community', iconKey: 'NETWORKOBJECT_BASIC_TYPE.NETWORK', description: 'IPSec tunnel to New York office' },

  // Zones
  { name: 'Internal', type: 'Zone', iconKey: 'NETWORKOBJECT_BASIC_TYPE.ZONE', description: 'Trusted internal security zone' },
  { name: 'External', type: 'Zone', iconKey: 'NETWORKOBJECT_BASIC_TYPE.ZONE', description: 'Untrusted external security zone' },
];

// ─── Services (standard — no appId) ──────────────────────────────────────────
export let mockPickerServices: ServiceItem[] = [
  { name: 'HTTP',       description: 'Hypertext Transfer Protocol — TCP port 80.',          tags: ['Web', 'TCP', 'Port 80', 'Unencrypted'] },
  { name: 'HTTPS',      description: 'HTTP Secure — TLS-encrypted web traffic, TCP 443.',   tags: ['Web', 'TCP', 'Port 443', 'Encrypted'] },
  { name: 'DNS',        description: 'Domain Name System — UDP/TCP port 53.',               tags: ['Infrastructure', 'UDP', 'TCP', 'Port 53'] },
  { name: 'SSH',        description: 'Secure Shell — encrypted remote access, TCP 22.',     tags: ['Management', 'TCP', 'Port 22', 'Encrypted'] },
  { name: 'FTP',        description: 'File Transfer Protocol — TCP ports 20/21.',           tags: ['File Transfer', 'TCP', 'Unencrypted'] },
  { name: 'SFTP',       description: 'SSH File Transfer Protocol — encrypted FTP over SSH.', tags: ['File Transfer', 'TCP', 'Encrypted'] },
  { name: 'SMTP',       description: 'Simple Mail Transfer Protocol — TCP port 25.',        tags: ['Email', 'TCP', 'Port 25'] },
  { name: 'IMAP',       description: 'Internet Message Access Protocol — TCP port 143.',    tags: ['Email', 'TCP', 'Port 143'] },
  { name: 'POP3',       description: 'Post Office Protocol v3 — TCP port 110.',             tags: ['Email', 'TCP', 'Port 110'] },
  { name: 'RDP',        description: 'Remote Desktop Protocol — TCP port 3389.',            tags: ['Management', 'TCP', 'Port 3389', 'High Risk'] },
  { name: 'SMB',        description: 'Server Message Block — file sharing, TCP 445.',       tags: ['File Sharing', 'TCP', 'Port 445', 'High Risk'] },
  { name: 'SNMP',       description: 'Simple Network Management Protocol — UDP 161/162.',   tags: ['Management', 'UDP', 'Port 161'] },
  { name: 'NTP',        description: 'Network Time Protocol — UDP port 123.',               tags: ['Infrastructure', 'UDP', 'Port 123'] },
  { name: 'LDAP',       description: 'Lightweight Directory Access Protocol — TCP 389.',    tags: ['Directory', 'TCP', 'Port 389'] },
  { name: 'MySQL',      description: 'MySQL database — TCP port 3306.',                     tags: ['Database', 'TCP', 'Port 3306'] },
  { name: 'PostgreSQL', description: 'PostgreSQL database — TCP port 5432.',                tags: ['Database', 'TCP', 'Port 5432'] },
  { name: 'Telnet',     description: 'Unencrypted remote terminal — TCP port 23.',          tags: ['Management', 'TCP', 'Port 23', 'Unencrypted', 'High Risk'] },
  { name: 'ISAKMP',     description: 'IKE key exchange for IPSec VPN — UDP port 500.',      tags: ['VPN', 'UDP', 'Port 500'] },
  { name: 'BitTorrent', description: 'Peer-to-peer file sharing — high bandwidth risk.',    tags: ['P2P', 'High Bandwidth', 'Medium Risk'] },
  { name: 'eDonkey',    description: 'eDonkey2000 P2P network — copyright risk.',           tags: ['P2P', 'High Bandwidth', 'High Risk'] },

  // ── Applications (with appId — drives the Applications tab) ─────────────
  // Social Media
  { name: 'Facebook',              appId: 101, description: 'Facebook social network — web and mobile.',           tags: ['Social Media', 'High Bandwidth'] },
  { name: 'Instagram',             appId: 102, description: 'Instagram photo and video sharing.',                  tags: ['Social Media', 'High Bandwidth'] },
  { name: 'Twitter / X',           appId: 103, description: 'Twitter / X microblogging platform.',                tags: ['Social Media'] },
  { name: 'LinkedIn',              appId: 104, description: 'Professional social network.',                        tags: ['Social Media', 'Productivity'] },
  { name: 'TikTok',                appId: 105, description: 'Short-form video social platform.',                   tags: ['Social Media', 'High Bandwidth', 'Medium Risk'] },
  { name: 'Snapchat',              appId: 106, description: 'Ephemeral messaging and stories.',                    tags: ['Social Media', 'Messaging'] },
  { name: 'Pinterest',             appId: 107, description: 'Visual discovery and bookmarking.',                   tags: ['Social Media'] },
  { name: 'Reddit',                appId: 108, description: 'Community-driven news and discussion.',               tags: ['Social Media', 'News'] },
  { name: 'Tumblr',                appId: 109, description: 'Blogging and social media platform.',                 tags: ['Social Media'] },
  { name: 'Discord',               appId: 110, description: 'Voice, video and text chat for communities.',         tags: ['Social Media', 'Messaging', 'Gaming', 'High Bandwidth'] },

  // Streaming
  { name: 'YouTube',               appId: 111, description: 'Google video streaming platform.',                    tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Netflix',               appId: 112, description: 'On-demand video streaming service.',                  tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Spotify',               appId: 113, description: 'Music and podcast streaming.',                        tags: ['Streaming', 'Audio'] },
  { name: 'Twitch',                appId: 114, description: 'Live game and creative streaming.',                   tags: ['Streaming', 'Gaming', 'High Bandwidth'] },
  { name: 'Hulu',                  appId: 115, description: 'Subscription video on demand.',                       tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Disney+',               appId: 116, description: 'Disney streaming service.',                           tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Amazon Prime Video',    appId: 117, description: 'Amazon on-demand video streaming.',                   tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Apple Music',           appId: 118, description: 'Apple music streaming service.',                      tags: ['Streaming', 'Audio'] },
  { name: 'Pandora',               appId: 119, description: 'Internet radio and music streaming.',                 tags: ['Streaming', 'Audio'] },
  { name: 'SoundCloud',            appId: 120, description: 'Audio distribution and streaming.',                   tags: ['Streaming', 'Audio'] },
  { name: 'Vimeo',                 appId: 121, description: 'Professional video hosting and streaming.',           tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Dailymotion',           appId: 122, description: 'Video sharing and streaming platform.',               tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Crunchyroll',           appId: 123, description: 'Anime and manga streaming service.',                  tags: ['Streaming', 'High Bandwidth'] },
  { name: 'Peacock',               appId: 124, description: 'NBCUniversal streaming service.',                     tags: ['Streaming', 'High Bandwidth'] },
  { name: 'HBO Max',               appId: 125, description: 'Warner Bros. Discovery streaming.',                   tags: ['Streaming', 'High Bandwidth'] },
  { name: 'YouTube Music',         appId: 126, description: 'Google music streaming service.',                     tags: ['Streaming', 'Audio'] },
  { name: 'Deezer',                appId: 127, description: 'Music streaming and podcast platform.',               tags: ['Streaming', 'Audio'] },
  { name: 'iHeartRadio',           appId: 128, description: 'Internet radio and music streaming.',                 tags: ['Streaming', 'Audio'] },

  // Messaging & Collaboration
  { name: 'WhatsApp',              appId: 131, description: 'End-to-end encrypted messaging and calls.',           tags: ['Messaging', 'Encrypted'] },
  { name: 'Telegram',              appId: 132, description: 'Cloud-based instant messaging.',                      tags: ['Messaging'] },
  { name: 'Signal',                appId: 133, description: 'Privacy-focused encrypted messenger.',                tags: ['Messaging', 'Encrypted'] },
  { name: 'Viber',                 appId: 134, description: 'VoIP messaging and calling.',                         tags: ['Messaging', 'VoIP'] },
  { name: 'WeChat',                appId: 135, description: 'Chinese multi-purpose messaging platform.',           tags: ['Messaging', 'Medium Risk'] },
  { name: 'Line',                  appId: 136, description: 'Messaging and VoIP app — popular in Asia.',           tags: ['Messaging', 'VoIP'] },
  { name: 'Skype',                 appId: 137, description: 'Microsoft VoIP and video calling.',                   tags: ['Messaging', 'VoIP', 'Video'] },
  { name: 'Zoom',                  appId: 138, description: 'Video conferencing and webinars.',                    tags: ['Messaging', 'Video', 'High Bandwidth'] },
  { name: 'Microsoft Teams',       appId: 139, description: 'Microsoft collaboration and meetings.',               tags: ['Messaging', 'Productivity', 'Video'] },
  { name: 'Slack',                 appId: 140, description: 'Workplace messaging and channels.',                   tags: ['Messaging', 'Productivity'] },
  { name: 'Google Meet',           appId: 141, description: 'Google video conferencing.',                          tags: ['Messaging', 'Video', 'High Bandwidth'] },
  { name: 'Webex',                 appId: 142, description: 'Cisco video conferencing platform.',                  tags: ['Messaging', 'Video'] },

  // Cloud Storage
  { name: 'Dropbox',               appId: 151, description: 'Cloud file storage and sharing.',                     tags: ['Cloud Storage', 'File Transfer'] },
  { name: 'Google Drive',          appId: 152, description: 'Google cloud file storage.',                          tags: ['Cloud Storage', 'File Transfer'] },
  { name: 'OneDrive',              appId: 153, description: 'Microsoft cloud file storage.',                       tags: ['Cloud Storage', 'File Transfer'] },
  { name: 'Box',                   appId: 154, description: 'Enterprise cloud content management.',                tags: ['Cloud Storage', 'File Transfer'] },
  { name: 'iCloud',                appId: 155, description: 'Apple cloud storage and sync.',                       tags: ['Cloud Storage', 'File Transfer'] },
  { name: 'Mega',                  appId: 156, description: 'Encrypted cloud storage platform.',                   tags: ['Cloud Storage', 'File Transfer', 'Encrypted'] },
  { name: 'WeTransfer',            appId: 157, description: 'Large file transfer service.',                        tags: ['File Transfer', 'High Bandwidth'] },
  { name: 'SendAnywhere',          appId: 158, description: 'Cross-platform direct file transfer.',                tags: ['File Transfer'] },

  // Productivity & SaaS
  { name: 'Google Workspace',      appId: 161, description: 'Google productivity suite (Docs, Sheets, Slides).', tags: ['Productivity', 'SaaS'] },
  { name: 'Microsoft 365',         appId: 162, description: 'Microsoft cloud productivity suite.',                 tags: ['Productivity', 'SaaS'] },
  { name: 'Salesforce',            appId: 163, description: 'CRM and enterprise cloud platform.',                  tags: ['Productivity', 'SaaS'] },
  { name: 'Jira',                  appId: 164, description: 'Atlassian project and issue tracking.',               tags: ['Productivity', 'SaaS'] },
  { name: 'Confluence',            appId: 165, description: 'Atlassian team wiki and collaboration.',              tags: ['Productivity', 'SaaS'] },
  { name: 'Notion',                appId: 166, description: 'All-in-one workspace and wiki.',                      tags: ['Productivity', 'SaaS'] },
  { name: 'Trello',                appId: 167, description: 'Kanban-style project management.',                    tags: ['Productivity', 'SaaS'] },
  { name: 'Asana',                 appId: 168, description: 'Work management and project tracking.',               tags: ['Productivity', 'SaaS'] },
  { name: 'Monday.com',            appId: 169, description: 'Work OS and team collaboration.',                     tags: ['Productivity', 'SaaS'] },
  { name: 'HubSpot',               appId: 170, description: 'CRM, marketing, and sales platform.',                 tags: ['Productivity', 'SaaS'] },
  { name: 'Zendesk',               appId: 171, description: 'Customer support and ticketing.',                     tags: ['Productivity', 'SaaS'] },
  { name: 'ServiceNow',            appId: 172, description: 'IT service management platform.',                     tags: ['Productivity', 'SaaS'] },

  // Developer & DevOps
  { name: 'GitHub',                appId: 181, description: 'Git repository hosting and collaboration.',           tags: ['Developer', 'SaaS'] },
  { name: 'GitLab',                appId: 182, description: 'DevOps platform with CI/CD.',                        tags: ['Developer', 'SaaS'] },
  { name: 'Bitbucket',             appId: 183, description: 'Atlassian Git repository hosting.',                   tags: ['Developer', 'SaaS'] },
  { name: 'npm Registry',          appId: 184, description: 'Node.js package registry.',                           tags: ['Developer'] },
  { name: 'Docker Hub',            appId: 185, description: 'Container image registry.',                           tags: ['Developer'] },
  { name: 'AWS Console',           appId: 186, description: 'Amazon Web Services management console.',             tags: ['Developer', 'Cloud', 'SaaS'] },
  { name: 'Azure Portal',          appId: 187, description: 'Microsoft Azure cloud management.',                   tags: ['Developer', 'Cloud', 'SaaS'] },
  { name: 'Google Cloud Console',  appId: 188, description: 'Google Cloud Platform management.',                   tags: ['Developer', 'Cloud', 'SaaS'] },
  { name: 'Cloudflare',            appId: 189, description: 'Cloudflare CDN and security services.',               tags: ['Developer', 'Infrastructure'] },

  // Gaming
  { name: 'Steam',                 appId: 191, description: 'Valve game distribution platform.',                   tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Epic Games Store',      appId: 192, description: 'Epic Games digital game store.',                      tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Battle.net',            appId: 193, description: 'Blizzard Entertainment gaming platform.',             tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Xbox Live',             appId: 194, description: 'Microsoft online gaming service.',                    tags: ['Gaming', 'High Bandwidth'] },
  { name: 'PlayStation Network',   appId: 195, description: 'Sony PlayStation online services.',                   tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Roblox',                appId: 196, description: 'Online game platform and creation system.',           tags: ['Gaming', 'High Bandwidth'] },
  { name: 'League of Legends',     appId: 197, description: 'Riot Games multiplayer online battle arena.',         tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Fortnite',              appId: 198, description: 'Epic Games battle royale.',                           tags: ['Gaming', 'High Bandwidth'] },
  { name: 'World of Warcraft',     appId: 199, description: 'Blizzard massively multiplayer online RPG.',          tags: ['Gaming', 'High Bandwidth'] },
  { name: 'Minecraft',             appId: 200, description: 'Sandbox building and survival game.',                 tags: ['Gaming'] },

  // P2P / Anonymizers / High Risk
  { name: 'uTorrent',              appId: 211, description: 'BitTorrent client for P2P file sharing.',             tags: ['P2P', 'High Bandwidth', 'High Risk'] },
  { name: 'Kazaa',                 appId: 212, description: 'Legacy P2P file sharing network.',                    tags: ['P2P', 'High Risk'] },
  { name: 'Gnutella',              appId: 213, description: 'Decentralized P2P file sharing protocol.',            tags: ['P2P', 'High Risk'] },
  { name: 'Tor Browser',           appId: 214, description: 'Anonymizing browser using Tor network.',              tags: ['Anonymizer', 'High Risk', 'Encrypted'] },
  { name: 'Tor Network',           appId: 215, description: 'Onion routing anonymization network.',                tags: ['Anonymizer', 'High Risk'] },
  { name: 'I2P',                   appId: 216, description: 'Anonymous peer-to-peer network.',                     tags: ['Anonymizer', 'High Risk'] },
  { name: 'NordVPN',               appId: 217, description: 'Commercial VPN service — may bypass policy.',         tags: ['VPN', 'Anonymizer', 'Medium Risk'] },
  { name: 'ExpressVPN',            appId: 218, description: 'Commercial VPN — may bypass firewall.',               tags: ['VPN', 'Anonymizer', 'Medium Risk'] },
  { name: 'Ultrasurf',             appId: 219, description: 'Censorship-bypass proxy tool.',                       tags: ['Anonymizer', 'High Risk'] },
  { name: 'Hotspot Shield',        appId: 220, description: 'VPN and proxy service.',                              tags: ['VPN', 'Anonymizer', 'Medium Risk'] },
  { name: 'Psiphon',               appId: 221, description: 'Censorship-circumvention VPN/proxy.',                 tags: ['Anonymizer', 'High Risk'] },

  // Email & Webmail
  { name: 'Gmail',                 appId: 231, description: 'Google webmail service.',                             tags: ['Email', 'SaaS'] },
  { name: 'Outlook Web',           appId: 232, description: 'Microsoft Outlook web access.',                       tags: ['Email', 'SaaS'] },
  { name: 'Yahoo Mail',            appId: 233, description: 'Yahoo webmail service.',                              tags: ['Email'] },
  { name: 'ProtonMail',            appId: 234, description: 'End-to-end encrypted email service.',                 tags: ['Email', 'Encrypted'] },

  // Shopping & Finance
  { name: 'Amazon Shopping',       appId: 241, description: 'Amazon e-commerce platform.',                         tags: ['Shopping'] },
  { name: 'eBay',                  appId: 242, description: 'Online auction and shopping.',                        tags: ['Shopping'] },
  { name: 'AliExpress',            appId: 243, description: 'Alibaba international online retail.',                tags: ['Shopping'] },
  { name: 'PayPal',                appId: 244, description: 'Online payment processing.',                          tags: ['Finance'] },
  { name: 'Coinbase',              appId: 245, description: 'Cryptocurrency exchange platform.',                   tags: ['Finance', 'Medium Risk'] },
  { name: 'Binance',               appId: 246, description: 'Cryptocurrency exchange — high volume.',              tags: ['Finance', 'Medium Risk'] },

  // AI & Emerging
  { name: 'OpenAI / ChatGPT',      appId: 251, description: 'OpenAI API and ChatGPT web interface.',              tags: ['AI', 'SaaS'] },
  { name: 'Midjourney',            appId: 252, description: 'AI image generation service.',                        tags: ['AI', 'SaaS'] },
  { name: 'Hugging Face',          appId: 253, description: 'AI model hub and inference platform.',                tags: ['AI', 'Developer', 'SaaS'] },
  { name: 'Google Bard / Gemini',  appId: 254, description: 'Google AI assistant.',                               tags: ['AI', 'SaaS'] },
  { name: 'Copilot (Microsoft)',    appId: 255, description: 'Microsoft AI assistant and code completion.',         tags: ['AI', 'Productivity'] },
];
