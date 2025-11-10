// src/config/env.ts
import "dotenv/config";

function required(name: string): string {
  const val = process.env[name];
  if (!val) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`⚠️ Missing env: ${name} (using placeholder)`);
      return `__MISSING_${name}__`;
    }
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return val;
}


export const ENV = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  BREVO_API_KEY: required("BREVO_API_KEY"),
  CLOUDFLARE_API_TOKEN: required("CLOUDFLARE_API_TOKEN"),
  CLOUDFLARE_ZONE_ID: required("CLOUDFLARE_ZONE_ID"),
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
};

export const APP = {
  NAME: "MamamScript",
  VERSION: "1.0.0",
  TIMEOUT_MS: 10_000,
};
