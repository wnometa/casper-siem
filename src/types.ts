export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Category = 'auth' | 'firewall' | 'network' | 'endpoint';
export type ConnectionMode = 'demo' | 'live';
export type HealthStatus = 'green' | 'yellow' | 'red' | 'unreachable' | 'demo';

export interface SiemEvent {
  id: string;
  '@timestamp': string;
  severity: Severity;
  category: Category;
  eventType: string;
  sourceIp: string;
  targetHost: string;
  user?: string;
  message: string;
  raw: Record<string, unknown>;
}

export interface ClusterHealth {
  cluster_name: string;
  status: string;
  number_of_nodes: number;
  active_shards?: number;
}

export interface EsIndexInfo {
  index: string;
  docs: number;
  health: string;
}
