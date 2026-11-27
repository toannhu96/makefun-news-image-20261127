import { closeSync, copyFileSync, existsSync, mkdirSync, openSync, readSync, statSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) fail("MAKEFUN_OUTPUT_DIR is not set");

// import.meta.dirname exists in Bun and Node >= 20.11; fall back to parsing import.meta.url.
const scriptDir =
  import.meta.dirname ?? dirname(decodeURIComponent(new URL(import.meta.url).pathname));
const source = join(scriptDir, "entry.png");
if (!existsSync(source)) fail(`source file not found: ${source}`);

mkdirSync(outputDir, { recursive: true });
const destination = join(outputDir, "entry.png");
copyFileSync(source, destination);

// Verify the copied output: exists, non-empty, <= 1 MiB, and starts with the PNG signature.
// Any failure here (including unexpected I/O errors) removes the copied file before exiting.
// Errors are thrown rather than calling fail() directly, because process.exit() would skip the catch.
const MAX_BYTES = 1048576;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
let size: number;
try {
  if (!existsSync(destination)) throw new Error(`output file missing after copy: ${destination}`);
  size = statSync(destination).size;
  if (size === 0) throw new Error(`output file is empty: ${destination}`);
  if (size > MAX_BYTES) throw new Error(`output file too large: ${size} bytes > ${MAX_BYTES} bytes: ${destination}`);
  const header = Buffer.alloc(8);
  const fd = openSync(destination, "r");
  try { readSync(fd, header, 0, 8, 0); } finally { closeSync(fd); }
  if (!header.equals(PNG_SIGNATURE)) throw new Error(`output file is not a PNG (bad signature ${header.toString("hex")}): ${destination}`);
} catch (err) {
  try { unlinkSync(destination); } catch { /* ignore cleanup errors */ }
  fail(err instanceof Error ? err.message : String(err));
}

console.log(`copied ${source} -> ${destination} (${size} bytes)`);
