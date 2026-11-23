import type { SiemEvent } from '@/types';

export interface RawEventSpec {
  '@timestamp': string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'auth' | 'firewall' | 'network' | 'endpoint';
  event: { type: string; action: string };
  source: { ip: string; port?: number };
  destination: { ip?: string; host: string; port?: number };
  user?: string;
  message: string;
  agent?: { name: string };
  [key: string]: unknown;
}

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

const SPECS: RawEventSpec[] = [
  { '@timestamp': minutesAgo(2), severity: 'critical', category: 'auth', event: { type: 'ssh_bruteforce', action: 'failed_login' }, source: { ip: '185.220.101.45', port: 52144 }, destination: { ip: '10.0.4.12', host: 'edge-gw-01.corp.local', port: 22 }, user: 'root', message: 'SSH brute-force: 42 failed root logins in 3 minutes', 'auth': { failures: 42, method: 'password' }, 'rule': { id: '5710', name: 'sshd: brute force attempt' } },
  { '@timestamp': minutesAgo(4), severity: 'high', category: 'firewall', event: { type: 'firewall_block', action: 'drop' }, source: { ip: '45.155.205.233', port: 38912 }, destination: { ip: '10.0.4.12', host: 'edge-gw-01.corp.local', port: 3389 }, message: 'Firewall DROP: inbound RDP probe from known scanner range', 'firewall': { action: 'drop', rule: 'deny-rdp-ext' }, 'rule': { id: '4100', name: 'fw: rdp exposure' } },
  { '@timestamp': minutesAgo(6), severity: 'critical', category: 'auth', event: { type: 'privilege_escalation', action: 'sudo' }, source: { ip: '10.0.7.51', port: 4432 }, destination: { ip: '10.0.7.9', host: 'app-01.corp.local' }, user: 'svc_deploy', message: 'Privilege escalation: svc_deploy granted sudo ALL outside change window', 'auth': { sudo_command: '/bin/bash' }, 'rule': { id: '5402', name: 'sudo: unauthorized elevation' } },
  { '@timestamp': minutesAgo(9), severity: 'high', category: 'network', event: { type: 'dns_beacon', action: 'query' }, source: { ip: '10.0.7.88', port: 53110 }, destination: { host: 'update-cdn-7291.ru' }, message: 'Malware DNS beacon: 240 lookups to algorithmic domain update-cdn-7291.ru', 'dns': { query: 'update-cdn-7291.ru', query_type: 'A', count: 240 }, 'rule': { id: '8801', name: 'dns: dga beaconing' } },
  { '@timestamp': minutesAgo(11), severity: 'medium', category: 'auth', event: { type: 'anomalous_login', action: 'success' }, source: { ip: '103.42.8.19', port: 51022 }, destination: { host: 'vpn-gw.corp.local', port: 443 }, user: 'j.wilson', message: 'Anomalous login: j.wilson VPN sign-in from new country (SG) at 03:11 local', 'auth': { mfa: 'push', geo: 'SG' }, 'rule': { id: '3001', name: 'vpn: geo anomaly' } },
  { '@timestamp': minutesAgo(14), severity: 'high', category: 'endpoint', event: { type: 'malware_detected', action: 'quarantine' }, source: { ip: '10.0.7.33', port: 0 }, destination: { host: 'ws-finance-04.corp.local' }, user: 'a.kline', message: 'Malware detected: Trojan.Win32.Emotet in invoice_2026.pdf.exe quarantined', 'endpoint': { process: 'invoice_2026.pdf.exe', hash: '9f2a7c4e1b8d3f60a5c2e9d4b7f1a3c8', verdict: 'malicious' }, 'rule': { id: '9902', name: 'edr: trojan family' } },
  { '@timestamp': minutesAgo(17), severity: 'low', category: 'network', event: { type: 'port_scan', action: 'probe' }, source: { ip: '192.168.44.120', port: 49881 }, destination: { ip: '10.0.7.0/24', host: 'app-01.corp.local' }, message: 'Port sweep: 96 sequential ports probed from internal workstation', 'network': { ports_probed: 96, protocol: 'tcp' }, 'rule': { id: '2005', name: 'ids: horizontal scan' } },
  { '@timestamp': minutesAgo(21), severity: 'critical', category: 'auth', event: { type: 'bruteforce', action: 'failed_login' }, source: { ip: '91.240.118.172', port: 60234 }, destination: { host: 'mail-01.corp.local', port: 993 }, user: 'postmaster', message: 'IMAP brute-force: 87 failed postmaster attempts from TOR exit node', 'auth': { failures: 87, method: 'password' }, 'rule': { id: '5720', name: 'imap: credential stuffing' } },
  { '@timestamp': minutesAgo(26), severity: 'medium', category: 'firewall', event: { type: 'firewall_allow', action: 'accept' }, source: { ip: '10.0.7.77', port: 51000 }, destination: { ip: '185.60.216.35', host: 'file-share-external.net', port: 443 }, message: 'Policy watch: workstation uploading to uncategorized file-share domain', 'firewall': { action: 'accept', bytes_sent: 48_311_296 }, 'rule': { id: '4501', name: 'fw: data egress watch' } },
  { '@timestamp': minutesAgo(33), severity: 'high', category: 'network', event: { type: 'c2_callback', action: 'connection' }, source: { ip: '10.0.7.33', port: 52210 }, destination: { ip: '45.133.1.35', host: 'cdn-metrics.top', port: 8443 }, message: 'C2 callback: periodic TLS connection to cdn-metrics.top:8443 (jitter pattern)', 'network': { interval_s: 62, protocol: 'tls' }, 'rule': { id: '8820', name: 'ids: c2 beacon timing' } },
  { '@timestamp': minutesAgo(41), severity: 'low', category: 'auth', event: { type: 'logon', action: 'success' }, source: { ip: '10.0.7.20', port: 49712 }, destination: { host: 'dc-01.corp.local', port: 389 }, user: 'm.reyes', message: 'Successful interactive logon to dc-01 outside business hours', 'auth': { type: 'interactive' }, 'rule': { id: '3005', name: 'auth: after-hours logon' } },
  { '@timestamp': minutesAgo(48), severity: 'high', category: 'endpoint', event: { type: 'privilege_escalation', action: 'token_manipulation' }, source: { ip: '10.0.7.33', port: 0 }, destination: { host: 'ws-finance-04.corp.local' }, user: 'a.kline', message: 'UAC bypass attempt via token manipulation (fodhelper.exe)', 'endpoint': { process: 'fodhelper.exe', parent: 'winword.exe' }, 'rule': { id: '9104', name: 'edr: uac bypass' } },
  { '@timestamp': minutesAgo(56), severity: 'medium', category: 'network', event: { type: 'dns_tunneling', action: 'query' }, source: { ip: '10.0.7.94', port: 54321 }, destination: { host: 't.exfil-tunnel.xyz' }, message: 'DNS tunneling: high-entropy subdomain exfil pattern detected (3.1KB payload)', 'dns': { query: 't.exfil-tunnel.xyz', payload_bytes: 3172 }, 'rule': { id: '8810', name: 'dns: tunneling entropy' } },
  { '@timestamp': minutesAgo(64), severity: 'low', category: 'firewall', event: { type: 'firewall_block', action: 'drop' }, source: { ip: '23.129.64.217', port: 44112 }, destination: { ip: '10.0.4.12', host: 'edge-gw-01.corp.local', port: 23 }, message: 'Firewall DROP: telnet scan attempt from Tor exit node', 'firewall': { action: 'drop', rule: 'deny-telnet' }, 'rule': { id: '4102', name: 'fw: legacy port scan' } },
  { '@timestamp': minutesAgo(72), severity: 'critical', category: 'endpoint', event: { type: 'ransomware_behavior', action: 'file_encrypt' }, source: { ip: '10.0.7.61', port: 0 }, destination: { host: 'fs-share-01.corp.local' }, user: 'backup_svc', message: 'Ransomware behavior: mass file rename/encrypt (LockBit signature, 1,204 files/2min)', 'endpoint': { process: 'svhost64.exe', files_affected: 1204, family: 'lockbit' }, 'rule': { id: '9950', name: 'edr: ransomware canary' } },
  { '@timestamp': minutesAgo(88), severity: 'medium', category: 'auth', event: { type: 'anomalous_login', action: 'success' }, source: { ip: '10.0.7.51', port: 40122 }, destination: { host: 'db-01.corp.local', port: 5432 }, user: 'svc_deploy', message: 'Anomalous service login: svc_deploy interactive session on db-01', 'auth': { type: 'interactive' }, 'rule': { id: '3010', name: 'auth: service account logon' } },
  { '@timestamp': minutesAgo(95), severity: 'low', category: 'endpoint', event: { type: 'usb_attached', action: 'device_connect' }, source: { ip: '10.0.7.20', port: 0 }, destination: { host: 'ws-eng-11.corp.local' }, user: 'd.chen', message: 'USB storage attached: SanDisk Ultra 64GB on engineering workstation', 'endpoint': { device: 'SanDisk Ultra', serial: '4C531001230729' }, 'rule': { id: '7001', name: 'edr: removable media' } },
  { '@timestamp': minutesAgo(110), severity: 'high', category: 'network', event: { type: 'dns_beacon', action: 'query' }, source: { ip: '10.0.7.94', port: 55102 }, destination: { host: 'api-telemetry-4421.info' }, message: 'DNS beacon: fixed 60s lookup interval to api-telemetry-4421.info (168 queries)', 'dns': { query: 'api-telemetry-4421.info', count: 168, interval_s: 60 }, 'rule': { id: '8802', name: 'dns: periodic beacon' } },
  { '@timestamp': minutesAgo(124), severity: 'medium', category: 'firewall', event: { type: 'firewall_block', action: 'reject' }, source: { ip: '10.0.7.88', port: 52890 }, destination: { ip: '103.75.190.10', host: 'paste-bin-raw.cc', port: 443 }, message: 'Firewall REJECT: blocked access to categorized malware repository', 'firewall': { action: 'reject', rule: 'deny-web-threats' }, 'rule': { id: '4505', name: 'fw: threat feed block' } },
  { '@timestamp': minutesAgo(141), severity: 'low', category: 'auth', event: { type: 'logon', action: 'failure' }, source: { ip: '10.0.7.15', port: 49320 }, destination: { host: 'file-01.corp.local', port: 445 }, user: 'svc_print', message: 'Expired credential: svc_print logon failure after password rotation', 'auth': { failures: 1, reason: 'password_expired' }, 'rule': { id: '3008', name: 'auth: stale credential' } },
];

export function buildDemoEvents(): SiemEvent[] {
  return SPECS.map((spec, i) => ({
    id: `demo-${i + 1}`,
    '@timestamp': spec['@timestamp'],
    severity: spec.severity,
    category: spec.category,
    eventType: spec.event.type,
    sourceIp: spec.source.ip,
    targetHost: spec.destination.host,
    user: spec.user,
    message: spec.message,
    raw: spec as unknown as Record<string, unknown>,
  }));
}

export function buildSeedDocs(): RawEventSpec[] {
  return SPECS.slice(0, 15).map((spec, i) => ({
    ...spec,
    '@timestamp': new Date(Date.now() - (i + 1) * 3 * 60_000).toISOString(),
  }));
}
