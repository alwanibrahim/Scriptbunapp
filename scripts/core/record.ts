import { $ } from "bun";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

if (!TOKEN || !ZONE_ID) {
  console.error("❌ ENV belum lengkap. Tambahkan CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ZONE_ID di file .env");
  process.exit(1);
}

// Prompt kecil (input CLI)
async function ask(question: string): Promise<string> {
  process.stdout.write(question);
  return new Promise((resolve) => {
    process.stdin.once("data", (data) => resolve(data.toString().trim()));
  });
}

async function createRecord({
  type,
  name,
  content,
  ttl = 3600,
  proxied = false,
}: {
  type: "A" | "AAAA" | "CNAME" | "TXT";
  name: string;
  content: string;
  ttl?: number;
  proxied?: boolean;
}) {
  console.log(`\n🚀 Membuat record [${type}] ${name} → ${content}`);

  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      name,
      content,
      ttl,
      proxied,
    }),
  });

  const data: any = await response.json();

  if (!response.ok) {
    console.error("\n❌ Gagal membuat record:", data.errors || data);
    process.exit(1);
  }

  console.log("\n✅ Record berhasil dibuat!");
  console.log(JSON.stringify(data.result, null, 2));
}

async function main() {
  console.log("🌩️  Cloudflare Record Creator\n");

  const type = (await ask("➡️  Jenis record (A, AAAA, CNAME, TXT): ")).toUpperCase();
  const name = await ask("➡️  Nama domain (misal: sub.mamam.store): ");
  const content = await ask("➡️  Isi record (misal: 192.168.1.10 atau target.domain.com): ");
  const proxiedAns = (await ask("➡️  Gunakan proxy Cloudflare? (y/n): ")).toLowerCase();
  const proxied = proxiedAns === "y" || proxiedAns === "yes";

  await createRecord({ type: type as any, name, content, proxied });

  process.exit(0);
}

main();
