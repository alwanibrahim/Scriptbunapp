import { runN8nLoop } from "../utils/loop-n8n";
import {randomSubdomain} from '../utils/randomSubdomain'
import {ask} from '../utils/ask'
import {createRecord} from '../utils/createRecordCF'

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID!;


if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
  console.error("❌ Harap isi CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ZONE_ID di .env");
  process.exit(1);
}

async function main() {
  console.log("🌩️  Cloudflare Record Creator\n");

  const mode = await ask("Mode (1 = satuan, 2 = massal): ");
  const ip = await ask("Masukkan IP tujuan: ");
  const proxiedInput = await ask("Proxied? (y/n): ");
  const proxied = proxiedInput.toLowerCase() === "y";

  switch (mode) {
    case "1": {
      const name = await ask("Masukkan subdomain (tanpa domain utama): ");
      await createRecord({ name, ip, proxied });
      break;
    }

    case "2": {
      const jumlahStr = await ask("Berapa banyak record random? ");
      const jumlah = parseInt(jumlahStr);
      const prefix = (await ask("Prefix (default: unix): ")) || "unix";
      for (let i = 0; i < jumlah; i++) {
        const name = randomSubdomain(prefix);
        await createRecord({ name, ip, proxied });
      }
      break;
    }

    default:
      console.log("⚠️  Mode tidak dikenal.");
      process.exit(1);
  }

  console.log("\n✅ Semua record selesai dibuat.\n");

  const pilihan = await ask("Pilih app: (1 = n8n, 2 = custom, 0 = keluar): ");
  switch (pilihan) {
    case "1":
      await runN8nLoop();
      break;
    case "2":
      console.log("🧩 Mode custom belum diimplementasi.");
      process.exit(0);
      break;
    default:
      console.log("🚪 Keluar tanpa deploy.");
      process.exit(0);
  }
}

main();
