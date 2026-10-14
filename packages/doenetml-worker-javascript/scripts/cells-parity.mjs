// How far the cells core (experiments/cells-prototype, `DOENET_TEST_CORE=cells`)
// is from passing this package's test suite, from Vitest's JSON output.
//
//   DOENET_TEST_CORE=cells npx vitest run --exclude '**/*-bench.test.ts' \
//       --reporter=json --outputFile=out/cells-test-results.json
//   node scripts/cells-parity.mjs out/cells-test-results.json > CELLS_CORE_PARITY.md
//
// Or `npm run parity:cells`, which does both. Each failing test is
// classified by the first thing it ran into: the adapter
// (`src/test/utils/test-core-cells.ts`) throws `CellsCoreGap` naming the
// missing tag, prop, action or API, so a failure list reads as a gap list.
// Assertion failures are the cases where the document loads and runs but a
// value differs from the JavaScript core's.
import fs from "node:fs";
import path from "node:path";

const file = process.argv[2] ?? "out/cells-test-results.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));

function classify(message) {
    const first = message.split("\n")[0];
    let m;
    if ((m = first.match(/load: Error: unsupported tag <(\w+)>/)))
        return { kind: "unsupported tag", key: `<${m[1]}>` };
    if ((m = first.match(/load: Error: unsupported: (.*)$/)))
        return { kind: "unsupported construct", key: m[1].trim() };
    if ((m = first.match(/load: Error: prop '(\w+)' of <(\w+)> expects/)))
        return { kind: "reference shape", key: `<${m[2]}> ${m[1]}` };
    if ((m = first.match(/load: Error: index in '[^']*' is not a constant/)))
        return { kind: "unsupported construct", key: "computed index in a reference" };
    if ((m = first.match(/load: Error: '(.*)' is not supported in a math cell/)))
        return { kind: "unsupported construct", key: "math text beyond a tree (relation, tuple, multi-argument function)" };
    if ((m = first.match(/load: Error: (.*)$/)))
        return { kind: "load error", key: m[1].trim().slice(0, 100) };
    if ((m = first.match(/\[cells core gap\] (?:prop|state variable) `(\w+)\.(\w+)`/)))
        return { kind: "missing prop", key: `${m[1]}.${m[2]}` };
    if ((m = first.match(/\[cells core gap\] `(\w+)` of `(\w+)`/)))
        return { kind: "missing component field", key: `${m[2]}.${m[1]}` };
    if ((m = first.match(/\[cells core gap\] action `(\w+)\.(\w+)`/)))
        return { kind: "missing action", key: `${m[1]}.${m[2]}` };
    if ((m = first.match(/\[cells core gap\] action `(\w+)` on an unresolved component/)))
        return { kind: "missing action", key: `${m[1]} (unresolved component)` };
    if ((m = first.match(/\[cells core gap\] core API `([\w.]+)`/)))
        return { kind: "missing core API", key: m[1] };
    if ((m = first.match(/\[cells core gap\] JavaScript core internals `([\w.]+)`/)))
        return { kind: "test reads core internals", key: m[1] };
    if ((m = first.match(/\[cells core gap\] createTestCore option `(\w+)`/)))
        return { kind: "unsupported test option", key: m[1] };
    if ((m = first.match(/\[cells core gap\] `(initializeCounters|externalDoenetMLs)`/)))
        return { kind: "unsupported test option", key: m[1] };
    if ((m = first.match(/\[cells core gap\] 3D (\w+)/)))
        return { kind: "unsupported construct", key: `3D ${m[1]}` };
    if (/\[cells core gap\] enumerating/.test(first))
        return { kind: "test enumerates everything", key: first.replace("[cells core gap] ", "") };
    if (/\[stale snapshot read\]/.test(first))
        return { kind: "stale snapshot read", key: "" };
    if (/^AssertionError/.test(first)) return { kind: "wrong value", key: "" };
    if (/timed out/i.test(first)) return { kind: "timeout", key: "" };
    return { kind: "other error", key: first.slice(0, 120) };
}

const files = [];
const byKind = new Map();
const byKey = new Map();
let passed = 0, failed = 0, skipped = 0;
for (const f of data.testResults) {
    const name = path.relative(path.resolve("src/test"), f.name).replace(/\\/g, "/");
    let fp = 0, ff = 0, fs_ = 0;
    for (const t of f.assertionResults) {
        if (t.status === "passed") { passed++; fp++; continue; }
        if (t.status !== "failed") { skipped++; fs_++; continue; }
        failed++; ff++;
        const c = classify(t.failureMessages[0] ?? "");
        byKind.set(c.kind, (byKind.get(c.kind) ?? 0) + 1);
        if (c.key) {
            const e = byKey.get(`${c.kind}\u0000${c.key}`) ?? { kind: c.kind, key: c.key, n: 0, tests: [] };
            e.n++;
            if (e.tests.length < 3) e.tests.push(`${name}: ${t.title}`);
            byKey.set(`${c.kind}\u0000${c.key}`, e);
        }
    }
    files.push({ name, fp, ff, fs_ });
}
files.sort((a, b) => b.ff - a.ff || a.name.localeCompare(b.name));
const total = passed + failed + skipped;
const pct = (n) => `${((100 * n) / Math.max(1, passed + failed)).toFixed(1)}%`;

const out = [];
out.push(`# Cells core parity`);
out.push(``);
out.push(`The JavaScript worker's test suite run on the cells core`);
out.push(`(\`DOENET_TEST_CORE=cells\`, adapter \`src/test/utils/test-core-cells.ts\`),`);
out.push(`generated by \`scripts/cells-parity.mjs\` on ${new Date(data.startTime).toISOString().slice(0, 10)}.`);
out.push(``);
out.push(`| passed | failed | skipped | files |`);
out.push(`|---|---|---|---|`);
out.push(`| ${passed} (${pct(passed)}) | ${failed} (${pct(failed)}) | ${skipped} | ${files.length} |`);
out.push(``);
out.push(`## Failures by what the test ran into first`);
out.push(``);
out.push(`| kind | tests |`);
out.push(`|---|---|`);
for (const [k, n] of [...byKind].sort((a, b) => b[1] - a[1])) out.push(`| ${k} | ${n} |`);
out.push(``);
out.push(`"Wrong value" is a document that loads and runs on the cells core but`);
out.push(`gives a value the JavaScript core does not. Everything else is a gap`);
out.push(`the adapter or the core named before the test could check anything.`);
out.push(``);
out.push(`## Gaps, by the number of tests behind each`);
out.push(``);
out.push(`| kind | what | tests | examples |`);
out.push(`|---|---|---|---|`);
for (const e of [...byKey.values()].sort((a, b) => b.n - a.n || a.key.localeCompare(b.key)))
    out.push(`| ${e.kind} | \`${e.key.replace(/\|/g, "\\|")}\` | ${e.n} | ${e.tests.map((t) => t.replace(/\|/g, "\\|")).join("; ")} |`);
out.push(``);
out.push(`## Files`);
out.push(``);
out.push(`| file | passed | failed | skipped |`);
out.push(`|---|---|---|---|`);
for (const f of files) out.push(`| ${f.name} | ${f.fp} | ${f.ff} | ${f.fs_} |`);
out.push(``);
process.stdout.write(out.join("\n"));
