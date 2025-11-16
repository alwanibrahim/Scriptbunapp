#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Lokasi file script ini
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// aliases.json akan disimpan di folder yang sama dengan alias.ts
const STORE_DIR = __dirname;
const STORE = path.join(STORE_DIR, "aliases.json");

// --- Utils ---
function load() {
  if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
  }

  if (!existsSync(STORE)) {
    writeFileSync(STORE, "{}");
  }

  return JSON.parse(readFileSync(STORE, "utf8"));
}

function save(data: any) {
  writeFileSync(STORE, JSON.stringify(data, null, 2));
}

function showMenu() {
  console.log(`
===== BUN ALIAS MENU =====

  buns list                    → Lihat semua alias
  buns add <key> <command>     → Tambah alias baru
  buns delete <key>            → Hapus alias
  buns run <key> [args..]      → Jalankan alias
  buns menu                    → Lihat menu ini
`);
}

// --- CLI ---
const args = process.argv.slice(2);
const action = args[0];
const aliases = load();

switch (action) {
  case "menu": {
    showMenu();
    break;
  }

  case "list": {
    console.log("===== DAFTAR ALIAS =====");
    const entries = Object.entries(aliases);

    if (entries.length === 0) {
      console.log(" (belum ada alias)");
      break;
    }

    for (const [k, v] of entries) {
      console.log(` ${k} → ${v}`);
    }
    break;
  }

  case "add": {
    const key = args[1];
    const cmd = args.slice(2).join(" ");

    if (!key || !cmd) {
      console.log("Format salah: buns add <key> <command>");
      process.exit(1);
    }

    aliases[key] = cmd;
    save(aliases);

    console.log(`Alias '${key}' ditambahkan → ${cmd}`);
    break;
  }

  case "delete": {
    const key = args[1];

    if (!key) {
      console.log("Format salah: buns delete <key>");
      process.exit(1);
    }

    if (!aliases[key]) {
      console.log(`Alias '${key}' tidak ditemukan.`);
      process.exit(1);
    }

    delete aliases[key];
    save(aliases);

    console.log(`Alias '${key}' sudah dihapus.`);
    break;
  }

  case "run": {
  const key = args[1];
  const extra = args.slice(2).join(" ");

  if (!key) {
    console.log("Format salah: buns run <key> [args..]");
    process.exit(1);
  }

  if (!aliases[key]) {
    console.log(`Alias '${key}' tidak ada.`);
    process.exit(1);
  }

  const execute = `${aliases[key]} ${extra}`.trim();

  // --- FIX PALING PENTING ---
  const parts = execute.split(" ").filter(Boolean);

  console.log("Menjalankan:", execute);

  await $`${parts}`;
  break;
}


  default: {
    showMenu();
    break;
  }
}
