import { $ } from "bun";
import { ask } from "../../utils/ask";
import fs from "fs/promises";
import path from "path";
const username = process.env.USER || 'unknown'
const home = process.env.HOME || `/home/${username}`
export async function setupN8n({ port = 5678 }: { port?: number }) {
  console.log(`🚀 Setup n8n app (port ${port})\n`);

  const baseDir = path.resolve(`${home}/projects/n8n-massal`);
  await fs.mkdir(baseDir, { recursive: true }); // pastikan ada folder projects/

  const domain = await ask("Masukkan domain (contoh: n8n.personal.vaultsy.online): ");
  const storageType = (await ask("Gunakan bind (b) atau volume (v)? (default: b): ")).toLowerCase() || "b";

  // === lokasi data instance ===
  const instanceDir = path.join(baseDir, `n8n_${port}`);
  await fs.mkdir(instanceDir, { recursive: true });

  let volumeConfig = "";
  if (storageType === "v") {
    volumeConfig = "      - n8n_data:/home/node/.n8n";
  } else {
    // bind mount ke folder lokal agar bisa lihat datanya langsung
    const bindDir = path.join(instanceDir, "data");
    await fs.mkdir(bindDir, { recursive: true });
    volumeConfig = `      - ${bindDir}:/home/node/.n8n`;
  }

  // === isi docker-compose ===
  const dockerCompose = `
services:
  n8n_${port}:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "${port}:5678"
    environment:
      - N8N_HOST=${domain}
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=https://${domain}/
      - N8N_SECURE_COOKIE=false
      - GENERIC_TIMEZONE=Asia/Jakarta
    volumes:
${volumeConfig}

volumes:
  n8n_data:
`;

  // === tulis file di projects/n8n_<port>/docke r-compose.yml ===
  const filename = path.join(instanceDir, "docker-compose.yml");
  await Bun.write(filename, dockerCompose);
  console.log(`📦 File dibuat di: ${filename}`);

  // === tanya untuk jalankan ===
  const confirm = await ask("Jalankan docker compose up -d? (y/n): ");
  if (confirm.toLowerCase() === "y") {
    await $`docker compose -f ${filename} up -d`;
    console.log(`✅ n8n berjalan di https://${domain} (port ${port})`);
  } else {
    console.log("⏩ Deploy dilewati.");
  }
}
