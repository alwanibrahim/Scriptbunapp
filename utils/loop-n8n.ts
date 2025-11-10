import { setupN8n } from "../projects/apps/n8n";
import { ask } from "./ask";

export async function runN8nLoop() {
  console.log("🔁 Multi-instance n8n setup\n");

  const totalStr = await ask("Berapa kali jalankan setup n8n? ");
  const total = parseInt(totalStr);
  if (isNaN(total) || total <= 0) {
    console.log("⚠️  Angka tidak valid.");
    process.exit(1);
  }

  for (let i = 1; i <= total; i++) {
    console.log(`\n🧩 Instance ke-${i}`);
    const portStr = await ask(`Port untuk n8n instance ${i} (misal 5678, 5679, ...): `);
    const port = parseInt(portStr);

    if (isNaN(port)) {
      console.log("⚠️  Port tidak valid, lewati instance ini.");
      continue;
    }

    await setupN8n({ port });
  }

  console.log("\n✅ Semua instance selesai dijalankan.");
}
