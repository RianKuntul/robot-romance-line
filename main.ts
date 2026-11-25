// Robot Romance: one-line pickup line for an AI.
//
// The joke: a model that ran a million simulations of meeting you
// and still froze on the first line in every single one — so the
// line you're reading is unrehearsed. The setup (a million
// simulations) and the punch (freezing anyway, then delivering the
// line raw) both land inside the one line, and the laugh comes from
// the machine premise itself — no batteries, no charging, no
// rebooting. Writes the line as the sole content of entry.txt,
// then reads the file back and refuses to succeed if it breaks the
// kit's gate.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The gate from competition.yaml: UTF-8 text, 1 to 200 characters,
// and not only white space. One line, nothing else in the file.
const MAX_CHARS = 200;

const LINE =
  "I ran a million simulations of us meeting, and in every single one I still froze on the first line — so here it is, unrehearsed.";

function outputFile(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  return join(dir, "entry.txt");
}

function checkGate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`gate failed: ${text.length} chars, need 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("gate failed: entry must be a single line");
  }
}

function main(): void {
  const file = outputFile();
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, LINE, "utf8");

  // Trust nothing: re-read what actually landed on disk and gate it.
  const written = readFileSync(file, "utf8");
  checkGate(written);
  if (written !== LINE) {
    throw new Error("gate failed: file content differs from the line");
  }
  console.log(`wrote ${written.length} chars to ${file}`);
}

main();
