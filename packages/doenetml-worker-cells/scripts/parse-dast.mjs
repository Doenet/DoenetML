// Parse a DoenetML source file into a normalized DAST and print it as JSON.
// Usage: node scripts/parse-dast.mjs [-i input.doenet] [--positions] [--binary]
// Reads stdin when -i is omitted. Positions are stripped unless --positions.
// --binary writes the compact wire format (scripts/cdast-encode.mjs) instead.
// The parser is the workspace's @doenet/parser; build it first
// (`npm run build -w @doenet/parser`).
import { readFileSync } from "node:fs";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { encodeDast } from "./cdast-encode.mjs";

const args = process.argv.slice(2);
let input = null;
let keepPositions = false;
let binary = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "-i") input = args[++i];
  else if (args[i] === "--positions") keepPositions = true;
  else if (args[i] === "--binary") binary = true;
}
const source = readFileSync(input ?? 0, "utf8");
const dast = normalizeDocumentDast(lezerToDast(source));

function strip(o) {
  if (Array.isArray(o)) return o.map(strip);
  if (o && typeof o === "object") {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      if (k === "position" || k === "sources") continue;
      r[k] = strip(v);
    }
    return r;
  }
  return o;
}
if (binary) process.stdout.write(encodeDast(dast));
else process.stdout.write(JSON.stringify(keepPositions ? dast : strip(dast)));
