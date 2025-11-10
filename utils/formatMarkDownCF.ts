import type {CloudflareDnsRecord} from '../types/clodeflare'
export function formatMarkdown(record: CloudflareDnsRecord): string {
  return `### ${record.name} (${record.type})
- ID: ${record.id}
- IP: ${record.content}
- TTL: ${record.ttl}
- Proxied: ${record.proxied ? "✅ Yes" : "❌ No"}
- Created: ${record.created_on}
- Modified: ${record.modified_on}

`;
}
