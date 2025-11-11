import {safeExec} from './commantBun'

const proses = ["blueman-tray"]
const services = ["ModemManager.service", "colord.service", "cups-browsed.service", "packagekit.service"]

async function main() {
  console.log("Menonaktifkan semua hal yang tidak sangat lah penting awokawok");
  for (const santai of proses) {
   
    await safeExec(`pkill ${santai}`)
    console.log(`yang sudah di matikan ${santai}`);
    
  }
  for (const santai of services) {
   
    await safeExec(`sudo systemctl stop ${santai}`)
        console.log(`yang sudah di matikan ${santai}`);

  }
  console.log(`sudah di matikan semua santai..`);
  
}

await main()