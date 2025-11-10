// === tipe dasar response dari Cloudflare ===
export interface CloudflareDnsRecord {
  id: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  settings: Record<string, unknown>;
  meta: Record<string, unknown>;
  comment: string | null;
  tags: string[];
  created_on: string;
  modified_on: string;
}

// === response wrapper dari API ===
export interface CloudflareApiResponse<T = any> {
  result: T;
  success: boolean;
  errors: { code?: number; message?: string }[];
  messages: string[];
}
