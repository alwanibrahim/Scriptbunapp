#!/usr/bin/env bun

import { $ } from "bun";
import { join } from "path";

// command: process.argv[2]
// args: process.argv.slice(3)

const command = process.argv[2];
const args = process.argv.slice(3);

// path file command
const cmdFile = join(import.meta.dir, "commands", `${command}.ts`);

try {
  const mod = await import(cmdFile);
  await mod.default(args);
} catch (err) {
  console.error(`Command "${command}" tidak ditemukan.`);
  process.exit(1);
}
