// Parse a DoenetML source file into a normalized DAST and print it as JSON.
// Usage: node scripts/parse-dast.mjs [-i input.doenet] [--positions] [--binary]
//        node scripts/parse-dast.mjs --serve
// Reads stdin when -i is omitted. Positions are stripped unless --positions.
// --binary writes the compact wire format (scripts/cdast-encode.mjs) instead.
// --serve parses many sources in one process, for the Rust tests
// (`testing::test_utils`), which would otherwise pay node's start for each:
// each request on stdin is a line `<json|binary> <byte length>` and the
// source's bytes; each reply on stdout is a line `<ok|error> <byte length>`
// and the DAST (or the error's message). It exits when stdin closes.
// The parser is the workspace's own `@doenet/parser`, which must be built.
import { readFileSync } from "node:fs";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { encodeDast } from "./cdast-encode.mjs";

const args = process.argv.slice(2);
let input = null;
let keepPositions = false;
let binary = false;
let serve = false;
for (let i = 0; i < args.length; i++) {
    if (args[i] === "-i") input = args[++i];
    else if (args[i] === "--positions") keepPositions = true;
    else if (args[i] === "--binary") binary = true;
    else if (args[i] === "--serve") serve = true;
}

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
/** The DAST of `source`: JSON text, or the wire format's bytes. */
function parse(source, binary, keepPositions) {
    const dast = normalizeDocumentDast(lezerToDast(source));
    if (binary) return encodeDast(dast);
    return JSON.stringify(keepPositions ? dast : strip(dast));
}

if (serve) {
    let pending = Buffer.alloc(0);
    process.stdin.on("data", (chunk) => {
        pending = Buffer.concat([pending, chunk]);
        for (;;) {
            const newline = pending.indexOf(10);
            if (newline < 0) return;
            const [format, length] = pending
                .subarray(0, newline)
                .toString("utf8")
                .split(" ");
            const end = newline + 1 + Number(length);
            if (pending.length < end) return;
            const source = pending.subarray(newline + 1, end).toString("utf8");
            pending = pending.subarray(end);
            let status = "ok";
            let out;
            try {
                out = parse(source, format === "binary", false);
            } catch (e) {
                status = "error";
                out = String(e?.stack ?? e);
            }
            const bytes = typeof out === "string" ? Buffer.from(out) : out;
            process.stdout.write(`${status} ${bytes.length}\n`);
            process.stdout.write(bytes);
        }
    });
} else {
    process.stdout.write(
        parse(readFileSync(input ?? 0, "utf8"), binary, keepPositions),
    );
}
