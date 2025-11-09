import { $ } from "bun";
import path from "path";
import fs from "fs";

const CONTAINER_NAME = "redis";
const REDIS_PORT = "6379";
const santai = '/home/alwan/projects/scripts'

// 🧱 Semua volume container disimpan di folder lokal project
const BASE_VOLUME_DIR = path.resolve(santai, "volumes");
const DATA_DIR = path.join(BASE_VOLUME_DIR, CONTAINER_NAME);

async function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    await $`mkdir -p ${dir}`;
  }
}

async function run(cmd: string[]) {
  try {
    await $`${cmd}`;
  } catch (err) {
    console.error(`❌ Gagal: ${cmd.join(" ")}`);
    console.error(err);
    process.exit(1);
  }
}

async function safeRun(cmd: string[]) {
  try {
    await $`${cmd}`;
  } catch {}
}

async function up() {
  console.log("🚀 Menjalankan Redis container tanpa password...");

  await ensureDir(DATA_DIR);
  await safeRun(["docker", "stop", CONTAINER_NAME]);
  await safeRun(["docker", "rm", CONTAINER_NAME]);

  await run([
    "docker",
    "run",
    "-d",
    "--name",
    CONTAINER_NAME,
    "-p",
    `${REDIS_PORT}:6379`,
    "-v",
    `${DATA_DIR}:/data`,
    "redis:latest",
    "redis-server",
    "--appendonly",
    "yes",
  ]);

  console.log(`✅ Redis berjalan di port ${REDIS_PORT}`);
  console.log(`💾 Data disimpan di: ${DATA_DIR}\n`);
  console.log("Tes koneksi:");
  console.log(`  docker exec -it ${CONTAINER_NAME} redis-cli`);
}

async function down() {
  console.log("🛑 Menghentikan Redis...");
  await safeRun(["docker", "stop", CONTAINER_NAME]);
  await safeRun(["docker", "rm", CONTAINER_NAME]);
  console.log("✅ Redis dihentikan & container dihapus.");
}

async function restart() {
  console.log("♻️  Restart Redis...");
  await down();
  await up();
}

async function status() {
  console.log("📊 Status Redis container:");
  await safeRun(["docker", "ps", "--filter", `name=${CONTAINER_NAME}`]);
  console.log("\nLog terbaru:");
  await safeRun(["docker", "logs", "--tail", "10", CONTAINER_NAME]);
}

async function main() {
  const action = process.argv[2];

  switch (action) {
    case "up":
      await up();
      break;
    case "down":
      await down();
      break;
    case "restart":
      await restart();
      break;
    case "status":
      await status();
      break;
    default:
      console.log(`
📦 Redis Manager (tanpa password)
Gunakan perintah:

  bun run redis.ts up        → Jalankan Redis
  bun run redis.ts down      → Hentikan & hapus container
  bun run redis.ts restart   → Restart container
  bun run redis.ts status    → Cek status & log
`);
  }
}

main();
