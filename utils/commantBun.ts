import {$} from 'bun'
export async function safeExec(command: string) {
  try {
    await $`bash -c "${command}"`;
  } catch {
    // diamkan error biar gak ganggu startup
  }
}