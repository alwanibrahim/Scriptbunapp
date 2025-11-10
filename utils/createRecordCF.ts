import {formatMarkdown} from '../utils/formatMarkDownCF'
import type { CloudflareApiResponse, CloudflareDnsRecord } from "../types/clodeflare";
import fs from 'fs/promises'
import {ENV} from '../config/env'


const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";
const OUTPUT_FILE = "cloudflare-records.md";



export async function createRecord({
  name,
  ip,
  proxied = false,
}: {
  name: string;
  ip: string;
  proxied?: boolean;
}) {
  const data = {
    type: "A",
    name,
    content: ip,
    ttl: 3600,
    proxied,
  };

  try {
    const res: any = await fetch(
      `${CLOUDFLARE_API}/zones/${ENV.CLOUDFLARE_ZONE_ID}/dns_records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENV.CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    const result: CloudflareApiResponse<CloudflareDnsRecord> = await res.json();

    if (result.success) {
      const record = result.result; 
      console.log(
        `✅ Record dibuat: ${record.name} → ${record.content} (${record.proxied ? "proxied" : "direct"})`
      );
      console.log(`🆔 ID: ${record.id}`);

      // Simpan ke .md
      const logEntry = formatMarkdown(record);
      await fs.appendFile(OUTPUT_FILE, logEntry, "utf8");
      console.log(`📝 Tersimpan ke ${OUTPUT_FILE}`);
    } else {
      console.error("❌ Gagal:", result.errors);
    }
  } catch (err: any) {
    console.error("❌ Error:", err.message || err);
  }
}