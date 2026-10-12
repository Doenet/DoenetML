// Engine R through @doenet/math in Node: the wasm boundary the current core
// pays (Plan 5, "Per operation"). Same corpus and method as
// examples/ops_bench.rs: inputs parsed untimed, the median of many reps.
//
//   node crates/cells-sym-mer/bench/ops-node.mjs [out.json]
//
// DOENET_MATH overrides the path to @doenet/math's dist/index.js.

import { readFileSync, writeFileSync } from "node:fs";

const mathPath = process.env.DOENET_MATH ?? "/home/charles/doenet/ml/packages/math/dist/index.js";
const { default: me } = await import(mathPath);
const corpus = JSON.parse(readFileSync(new URL("./corpus.json", import.meta.url)));

const BUDGET_NS = 40_000_000n;
const MAX_REPS = 5000;

function time(setup, op) {
    const samples = [];
    const start = process.hrtime.bigint();
    while (samples.length < 20 || (process.hrtime.bigint() - start < BUDGET_NS && samples.length < MAX_REPS)) {
        const s = setup();
        const t = process.hrtime.bigint();
        op(s);
        samples.push(Number(process.hrtime.bigint() - t));
    }
    samples.sort((a, b) => a - b);
    return samples[samples.length >> 1];
}

const xs = Array.from({ length: 200 }, (_, i) => 0.1 + (4 * i) / 199);
const ops = {};
const put = (op, item, ns) => ((ops[op] ??= {})[item] = ns);
let sink;

for (const s of corpus.parse) put("parse", s, time(() => null, () => (sink = me.fromText(s))));
for (const s of corpus.simplify) put("simplify", s, time(() => me.fromText(s), (e) => (sink = e.simplify())));
for (const s of corpus.expand) put("expand", s, time(() => me.fromText(s), (e) => (sink = e.expand())));
for (const s of corpus.derivative) put("derivative", s, time(() => me.fromText(s), (e) => (sink = e.derivative("x"))));
for (const [a, b] of corpus.equals)
    put("equals", `${a} = ${b}`, time(() => [me.fromText(a), me.fromText(b)], ([x, y]) => (sink = x.equals(y))));
for (const [a, b] of corpus.equals_syntax)
    put("equals_syntax", `${a} = ${b}`, time(() => [me.fromText(a), me.fromText(b)], ([x, y]) => (sink = x.equalsViaSyntax(y))));
for (const s of corpus.evaluate) put("evaluate", s, time(() => me.fromText(s), (e) => (sink = e.evaluate({ x: 1.3 }))));
// The current core samples a <function> through a compiled f().
for (const s of corpus.sample200)
    put("sample200", s, time(() => me.fromText(s), (e) => {
        const f = e.f();
        sink = xs.map((x) => f({ x }));
    }));

const out = process.argv[2] ?? "results/raw/plan5-ops-node.json";
writeFileSync(out, JSON.stringify({ "R (node)": ops }, null, 2));
const geomean = (m) => Math.exp(Object.values(m).reduce((s, v) => s + Math.log(v), 0) / Object.values(m).length);
for (const [op, m] of Object.entries(ops)) console.log(op.padEnd(16), geomean(m).toFixed(0).padStart(12));
console.error(`wrote ${out} (${sink === undefined ? "" : "ok"})`);
