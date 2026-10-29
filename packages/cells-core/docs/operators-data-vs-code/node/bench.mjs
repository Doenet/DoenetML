// Operators as data and as code in the browser's engines, on a program
// `opbench --dump` wrote: what a JS core or a wasm core with a JIT step
// could do. Every evaluator is full recompute with early cutoff's
// comparison and the list of changed cells, as `full` in the Rust harness.
//
//   node bench.mjs prog.json [reps]
//
// - js-switch: operators as data in JS: a switch over an opcode array.
// - js-closures: a closure per instruction, as the JavaScript core's
//   state-variable functions, without their dependency lookup.
// - js-codegen: the program as JS source (new Function), chunked.
// - wasm-codegen: the program as a wasm module, chunked; V8 compiles it
//   with Liftoff, then TurboFan.

import { readFileSync } from "node:fs";

const file = process.argv[2];
const reps = Number(process.argv[3] ?? 41);
const chunk = Number(process.env.CHUNK ?? 1024);
const P = JSON.parse(readFileSync(file, "utf8"));

const dv = new DataView(new ArrayBuffer(8));
const f = (hex) => {
    dv.setBigUint64(0, BigInt("0x" + hex));
    return dv.getFloat64(0);
};
const cells0 = Float64Array.from(P.cells, f);
const n = P.instrs.length;
const KINDS = [
    "offset",
    "add",
    "sub",
    "scale",
    "neg",
    "min",
    "max",
    "mul",
    "div",
    "clamp",
    "round",
    "floor",
    "nanto",
];
const kind = Int32Array.from(P.instrs, (r) => KINDS.indexOf(r[0]));
const out = Int32Array.from(P.instrs, (r) => r[1]);
const ia = Int32Array.from(P.instrs, (r) => r[2]);
const ib = Int32Array.from(P.instrs, (r) => r[3]);
const k1 = Float64Array.from(P.instrs, (r) => f(r[4]));
const k2 = Float64Array.from(P.instrs, (r) => f(r[5]));

const nanMin = (a, b) => (a !== a || b !== b ? NaN : rustMin(a, b));
const nanMax = (a, b) => (a !== a || b !== b ? NaN : rustMax(a, b));
// Rust's f64::min/max without NaNs on x86: b unless a is strictly less
// (greater); the harness checks bits against Rust.
const rustMin = (a, b) => (a < b ? a : b);
const rustMax = (a, b) => (a > b ? a : b);
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
const differs = (a, b) => a !== b && !(a !== a && b !== b);

function jsSwitch(c, ch) {
    let m = 1;
    for (let i = 0; i < n; i++) {
        const a = c[ia[i]];
        let v;
        switch (kind[i]) {
            case 0:
                v = a + k1[i];
                break;
            case 1:
                v = a + c[ib[i]];
                break;
            case 2:
                v = a - c[ib[i]];
                break;
            case 3:
                v = a * k1[i];
                break;
            case 4:
                v = -a;
                break;
            case 5:
                v = nanMin(a, c[ib[i]]);
                break;
            case 6:
                v = nanMax(a, c[ib[i]]);
                break;
            case 7:
                v = a * c[ib[i]];
                break;
            case 8:
                v = a / c[ib[i]];
                break;
            case 9:
                v = clamp(a, k1[i], k2[i]);
                break;
            case 10:
                v = Math.floor(a + 0.5);
                break;
            case 11:
                v = Math.floor(a);
                break;
            default:
                v = a !== a ? k1[i] : a;
        }
        const o = out[i];
        if (differs(v, c[o])) {
            c[o] = v;
            ch[m++] = o;
        }
    }
    return m;
}

const closures = [];
for (let i = 0; i < n; i++) {
    const a = ia[i],
        b = ib[i],
        k = k1[i],
        kk = k2[i];
    closures.push(
        [
            (c) => c[a] + k,
            (c) => c[a] + c[b],
            (c) => c[a] - c[b],
            (c) => c[a] * k,
            (c) => -c[a],
            (c) => nanMin(c[a], c[b]),
            (c) => nanMax(c[a], c[b]),
            (c) => c[a] * c[b],
            (c) => c[a] / c[b],
            (c) => clamp(c[a], k, kk),
            (c) => Math.floor(c[a] + 0.5),
            (c) => Math.floor(c[a]),
            (c) => (c[a] !== c[a] ? k : c[a]),
        ][kind[i]],
    );
}
function jsClosures(c, ch) {
    let m = 1;
    for (let i = 0; i < n; i++) {
        const v = closures[i](c);
        const o = out[i];
        if (differs(v, c[o])) {
            c[o] = v;
            ch[m++] = o;
        }
    }
    return m;
}

// The program as JS source.
const lit = (x) => (Object.is(x, -0) ? "-0" : String(x));
function jsExpr(i) {
    const a = `c[${ia[i]}]`,
        b = `c[${ib[i]}]`;
    switch (kind[i]) {
        case 0:
            return `${a} + ${lit(k1[i])}`;
        case 1:
            return `${a} + ${b}`;
        case 2:
            return `${a} - ${b}`;
        case 3:
            return `${a} * ${lit(k1[i])}`;
        case 4:
            return `-${a}`;
        case 5:
            return `nanMin(${a}, ${b})`;
        case 6:
            return `nanMax(${a}, ${b})`;
        case 7:
            return `${a} * ${b}`;
        case 8:
            return `${a} / ${b}`;
        case 9:
            return `clamp(${a}, ${lit(k1[i])}, ${lit(k2[i])})`;
        case 10:
            return `Math.floor(${a} + 0.5)`;
        case 11:
            return `Math.floor(${a})`;
        default:
            return `(${a} !== ${a} ? ${lit(k1[i])} : ${a})`;
    }
}
let t0 = performance.now();
const jsChunks = [];
for (let s = 0; s < n; s += chunk) {
    let src = "let v;\n";
    for (let i = s; i < Math.min(n, s + chunk); i++) {
        const o = out[i];
        src += `v = ${jsExpr(i)}; if (v !== c[${o}] && !(v !== v && c[${o}] !== c[${o}])) { c[${o}] = v; ch[m++] = ${o}; }\n`;
    }
    src += "return m;";
    // The helpers are bound by a factory, so each chunk is a plain closure.
    jsChunks.push(
        new Function(
            "nanMin",
            "nanMax",
            "clamp",
            `return function (c, ch, m) {${src}}`,
        )(nanMin, nanMax, clamp),
    );
}
const jsGenMs = performance.now() - t0;
function jsCodegen(c, ch) {
    let m = 1;
    for (const g of jsChunks) m = g(c, ch, m);
    return m;
}
if (process.env.FORCE_OPT) {
    // Optimize every chunk now (node --allow-natives-syntax), after ticks
    // that change the cells, so every comparison has type feedback: the
    // steady state, apart from when V8's heuristics would get there.
    const c = Float64Array.from(cells0),
        ch = new Uint32Array(cells0.length + 1);
    const prep = new Function("g", "%PrepareFunctionForOptimization(g);");
    const opt = new Function("g", "%OptimizeFunctionOnNextCall(g);");
    for (const g of jsChunks) prep(g);
    for (let r = 0; r < 4; r++) {
        c[P.seed] = 2 + (r % 2);
        jsCodegen(c, ch);
    }
    for (const g of jsChunks) opt(g);
    jsCodegen(c, ch);
}

// The program as a wasm module: memory holds the cells from 0 and the
// changed list from `chBase`; chunk j is function j, (m: i32) -> i32.
function leb(v) {
    const r = [];
    do {
        let b = v & 0x7f;
        v >>>= 7;
        if (v) b |= 0x80;
        r.push(b);
    } while (v);
    return r;
}
function sleb(v) {
    const r = [];
    for (;;) {
        const b = v & 0x7f;
        v >>= 7;
        if ((v === 0 && !(b & 0x40)) || (v === -1 && b & 0x40)) {
            r.push(b);
            return r;
        }
        r.push(b | 0x80);
    }
}
const f64c = (x) => {
    const b = new Uint8Array(new Float64Array([x]).buffer);
    return [0x44, ...b];
};
const vec = (items) => [...leb(items.length), ...items.flat()];
const section = (id, bytes) => [id, ...leb(bytes.length), ...bytes];
const chBase = cells0.length * 8;
const pages = Math.ceil((chBase + 4 * (cells0.length + 1)) / 65536);
t0 = performance.now();
const bodies = [];
// Locals: 0 is the param m (i32), 1 is v (f64), 2 is o (f64, also a
// temporary before it holds the old value).
for (let s = 0; s < n; s += chunk) {
    const code = [...leb(1), ...leb(2), 0x7c];
    const ld = (cell) => [0x41, 0, 0x2b, 3, ...leb(cell * 8)];
    for (let i = s; i < Math.min(n, s + chunk); i++) {
        const a = ld(ia[i]),
            b = ld(ib[i]);
        let e;
        switch (kind[i]) {
            case 0:
                e = [...a, ...f64c(k1[i]), 0xa0];
                break;
            case 1:
                e = [...a, ...b, 0xa0];
                break;
            case 2:
                e = [...a, ...b, 0xa1];
                break;
            case 3:
                e = [...a, ...f64c(k1[i]), 0xa2];
                break;
            case 4:
                e = [...a, 0x9a];
                break;
            // pick = select(a, b, a < b); then select(NaN, pick, a or b NaN).
            case 5:
            case 6: {
                const cmp = kind[i] === 5 ? 0x63 : 0x64;
                e = [
                    ...a,
                    ...b,
                    ...a,
                    ...b,
                    cmp,
                    0x1b,
                    0x21,
                    2,
                    ...f64c(NaN),
                    0x20,
                    2,
                    ...a,
                    ...a,
                    0x62,
                    ...b,
                    ...b,
                    0x62,
                    0x72,
                    0x1b,
                ];
                break;
            }
            case 7:
                e = [...a, ...b, 0xa2];
                break;
            case 8:
                e = [...a, ...b, 0xa3];
                break;
            case 9: // t = select(lo, x, x < lo); select(hi, t, t > hi).
                e = [
                    ...f64c(k1[i]),
                    ...a,
                    ...a,
                    ...f64c(k1[i]),
                    0x63,
                    0x1b,
                    0x21,
                    2,
                    ...f64c(k2[i]),
                    0x20,
                    2,
                    0x20,
                    2,
                    ...f64c(k2[i]),
                    0x64,
                    0x1b,
                ];
                break;
            case 10:
                e = [...a, ...f64c(0.5), 0xa0, 0x9c];
                break;
            case 11:
                e = [...a, 0x9c];
                break;
            // select(k, a, a != a)
            default:
                e = [...f64c(k1[i]), ...a, ...a, ...a, 0x62, 0x1b];
        }
        const o = out[i];
        code.push(
            ...e,
            0x21,
            1, // v = e
            ...ld(o),
            0x21,
            2, // o = c[out]
            // v != o && !(v != v && o != o)
            0x20,
            1,
            0x20,
            2,
            0x62,
            0x20,
            1,
            0x20,
            1,
            0x62,
            0x20,
            2,
            0x20,
            2,
            0x62,
            0x71,
            0x45,
            0x71,
            0x04,
            0x40,
            0x41,
            0,
            0x20,
            1,
            0x39,
            3,
            ...leb(o * 8), // c[out] = v
            0x20,
            0,
            0x41,
            2,
            0x74,
            ...[0x41, ...sleb(o)],
            0x36,
            2,
            ...leb(chBase), // ch[m] = out
            0x20,
            0,
            0x41,
            1,
            0x6a,
            0x21,
            0, // m += 1
            0x0b,
        );
    }
    code.push(0x20, 0, 0x0b);
    bodies.push(code);
}
const nf = bodies.length;
const wasmBytes = new Uint8Array([
    0x00,
    0x61,
    0x73,
    0x6d,
    1,
    0,
    0,
    0,
    ...section(1, vec([[0x60, 1, 0x7f, 1, 0x7f]])),
    ...section(3, vec(Array.from({ length: nf }, () => [0]))),
    ...section(5, vec([[0x00, ...leb(pages)]])),
    ...section(
        7,
        vec([
            [...vec([..."mem"].map((ch) => ch.charCodeAt(0))), 0x02, 0],
            ...Array.from({ length: nf }, (_, j) => [
                ...vec([...`f${j}`].map((ch) => ch.charCodeAt(0))),
                0x00,
                ...leb(j),
            ]),
        ]),
    ),
    ...section(10, vec(bodies.map((b) => [...leb(b.length), ...b]))),
]);
const wasmGenMs = performance.now() - t0;
t0 = performance.now();
const inst = new WebAssembly.Instance(new WebAssembly.Module(wasmBytes), {});
const wasmCompileMs = performance.now() - t0;
const wasmFns = Array.from({ length: nf }, (_, j) => inst.exports[`f${j}`]);
const mem = inst.exports.mem;
const wc = new Float64Array(mem.buffer, 0, cells0.length);
wc.set(cells0);
const wch = new Uint32Array(mem.buffer, chBase, cells0.length + 1);
function wasmCodegen(c, ch) {
    let m = 1;
    for (const g of wasmFns) m = g(m);
    return m;
}

// Each evaluator on its own cells; the wasm one on its memory.
const evs = [
    [
        "js-switch",
        jsSwitch,
        Float64Array.from(cells0),
        new Uint32Array(cells0.length + 1),
    ],
    [
        "js-closures",
        jsClosures,
        Float64Array.from(cells0),
        new Uint32Array(cells0.length + 1),
    ],
    [
        "js-codegen",
        jsCodegen,
        Float64Array.from(cells0),
        new Uint32Array(cells0.length + 1),
    ],
    ["wasm-codegen", wasmCodegen, wc, wch],
];
const times = evs.map(() => []);
const first = evs.map(() => 0);
const changed = evs.map(() => 0);
let x = 2;
for (let r = 0; r < reps + 3; r++) {
    evs.forEach(([, run, c, ch], k) => {
        c[P.seed] = x;
        ch[0] = P.seed;
        const t = process.hrtime.bigint();
        const m = run(c, ch);
        const dt = Number(process.hrtime.bigint() - t) / 1e3;
        if (r === 0) first[k] = dt;
        if (r >= 3) times[k].push(dt);
        changed[k] = m - 1;
    });
    x = x === 2 ? 3 : 2;
}
for (let k = 1; k < evs.length; k++) {
    const a = evs[0][2],
        b = evs[k][2];
    for (let i = 0; i < a.length; i++) {
        if (!Object.is(a[i], b[i]) && differs(a[i], b[i])) {
            throw new Error(
                `${P.name}: ${evs[0][0]} and ${evs[k][0]} disagree at ${i}: ${a[i]} ${b[i]}`,
            );
        }
    }
}
console.error(
    `${P.name}: js source ${jsGenMs.toFixed(1)} ms; wasm ${wasmBytes.length} bytes, generated ${wasmGenMs.toFixed(1)} ms, compiled ${wasmCompileMs.toFixed(1)} ms`,
);
evs.forEach(([name], k) => {
    times[k].sort((a, b) => a - b);
    const med = times[k][times[k].length >> 1];
    console.log(
        `| ${P.name} | ${name}/full | ${med.toFixed(1)} | ${((med * 1e3) / n).toFixed(2)} | ${changed[k]} | first ${first[k].toFixed(0)} µs |`,
    );
});
