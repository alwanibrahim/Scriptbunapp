import { $ } from "bun";

async function safeRun(command: string[]) {
  try {
    await $`${command}`;
  } catch {
    // Abaikan error kecil biar lanjut
  }
}

async function main() {
  console.log("🚀 Memulai instalasi Docker & Docker Compose di Ubuntu...\n");

  // 1. Hapus versi lama
  console.log("🧩 Menghapus versi Docker lama (jika ada)...");
  await safeRun(["sudo", "apt", "remove", "-y", "docker", "docker-engine", "docker.io", "containerd", "runc"]);

  // 2. Update & install dependensi
  console.log("\n🔧 Mengupdate dan memasang dependensi...");
  await $`sudo apt update -y`;
  await $`sudo apt install -y ca-certificates curl gnupg lsb-release`;

  // 3. Tambahkan GPG key
  console.log("\n🔑 Menambahkan GPG key Docker...");
  await $`sudo mkdir -p /etc/apt/keyrings`;
  await $`bash -c "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor | sudo tee /etc/apt/keyrings/docker.gpg > /dev/null"`;

  // 4. Tambahkan repository resmi Docker
  console.log("\n📦 Menambahkan repository Docker...");
  await $`bash -c "echo 'deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable' | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null"`;

  // 5. Update & install paket utama
  console.log("\n⬇️ Menginstal Docker Engine dan Compose...");
  await $`sudo apt update -y`;
  await $`sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`;

  // 6. Enable & start service Docker
  console.log("\n⚙️ Mengaktifkan service Docker...");
  await $`sudo systemctl enable docker`;
  await $`sudo systemctl start docker`;

  // 7. Tambahkan user ke grup docker
  console.log("\n👤 Menambahkan user ke grup docker...");
  const user = process.env.USER ?? "root";
  await $`sudo usermod -aG docker ${user}`;

  // 8. Cek versi
  console.log("\n✅ Instalasi selesai! Mengecek versi:");
  await $`docker --version`;
  await $`docker compose version`;

  console.log("\n💡 Logout lalu login ulang agar grup 'docker' aktif tanpa sudo.");
  console.log("Tes: docker run hello-world\n");
}

main().catch((err) => {
  console.error("\n❌ Terjadi error:", err.message);
  process.exit(1);
});
