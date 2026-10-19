// Render every run's pages from its records alone, and the index of runs.
// Nothing on a page is written by hand. See METHOD.md for what the numbers
// mean.
//
//   node scripts/render.mjs
//
// Per run, in its directory: `comparison.md` (the cores pairwise on the
// synthetic shapes: tick, then load, then memory), `coverage.md` (what each
// core can run, every fixture), and `budgets.md` (the browser layer and the
// bundle against the product budgets) when the run has those layers.
// `results/README.md` lists the runs, newest first, grouped by machine.
import { writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { SIZES, packageRoot, shapes } from "../src/fixtures.mjs";
import { listRuns, runsDir } from "../src/results.mjs";

const TIMEOUT_MS = 15_000;
const CORE_NAME = { javascript: "JS", rust: "Rust", cells: "cells" };
const coreName = (c) => CORE_NAME[c] ?? c;

const median = (xs) => {
    const s = [...xs].sort((a, b) => a - b);
    return s.length % 2
        ? s[s.length >> 1]
        : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const quantile = (xs, p) => {
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
};
const ms = (x) =>
    x >= 1000
        ? `${(x / 1000).toFixed(x >= 10_000 ? 0 : 1)} s`
        : x >= 10
          ? `${x.toFixed(0)} ms`
          : x >= 0.1
            ? `${x.toFixed(2)} ms`
            : `${(x * 1000).toFixed(0)} µs`;
const mb = (b) => `${(b / 2 ** 20).toFixed(b >= 10 * 2 ** 20 ? 0 : 1)} MB`;
const cellText = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
const table = (head, rows) =>
    [
        `| ${head.join(" | ")} |`,
        `|${head.map(() => "---").join("|")}|`,
        ...rows.map((r) => `| ${r.map(cellText).join(" | ")} |`),
    ].join("\n");

/**
 * What a record says about one measure (`tick` or `load`): a value, a bound
 * (the core timed out on it), values that fail the check, or a gap.
 */
function outcome(r, measure, floor) {
    if (!r) return { kind: "none" };
    // Values that fail the check make every measure of the record moot.
    if (r.check && !r.check.ok)
        return { kind: "mismatch", why: mismatch(r.check) };
    const failed = r.status === "unsupported" || r.status === "error";
    if (measure === "load") {
        // A load stands even when the core failed later, at the action.
        if (r.load_ms != null) return { kind: "value", value: r.load_ms };
        if (r.status === "timeout") return { kind: "bound" };
        return { kind: "gap", why: `${r.status}: ${r.message ?? r.stage}` };
    }
    if (failed) return { kind: "gap", why: `${r.status}: ${r.message ?? ""}` };
    // A timeout before or during the ticks: no tick finished in time.
    if (
        r.status === "timeout" &&
        ["start", "generate", "parse", "load", "tick"].includes(r.stage)
    )
        return { kind: "bound" };
    if (!r.samples_ms?.length)
        return { kind: "gap", why: `${r.status} at ${r.stage}` };
    const raw = median(r.samples_ms);
    const f = floor ?? 0;
    return {
        kind: "value",
        value: Math.max(raw - f, 0),
        raw,
        floor: f,
        floored: f > 0 && raw < 2 * f,
    };
}

function mismatch(check) {
    return Object.entries(check.values)
        .filter(([k, v]) => v !== check.expected[k])
        .map(([k, v]) =>
            typeof v === "number"
                ? `${k} = ${v}, expected ${check.expected[k]}`
                : v == null
                  ? `${k} is not a number, expected ${check.expected[k]}`
                  : v,
        )
        .join("; ");
}

/** One table cell comparing cores `a` and `b` on one measure. */
function pairCell(a, b, oa, ob) {
    const show = (c, o) =>
        o.kind === "value"
            ? o.floored
                ? `${coreName(c)} < ${ms(o.floor)} (floor)`
                : `${coreName(c)} ${ms(o.value)}`
            : o.kind === "bound"
              ? `${coreName(c)} > ${ms(TIMEOUT_MS)}`
              : null;
    for (const [c, o] of [
        [a, oa],
        [b, ob],
    ]) {
        if (o.kind === "none") return "";
        if (o.kind === "mismatch")
            return `not comparable<br><sub>${coreName(c)}: ${o.why}</sub>`;
        if (o.kind === "gap")
            return `—<br><sub>${coreName(c)} ${o.why.split(":")[0]}</sub>`;
    }
    const sub = `<br><sub>${show(a, oa)} · ${show(b, ob)}</sub>`;
    if (oa.kind === "bound" && ob.kind === "bound")
        return `both > ${ms(TIMEOUT_MS)}`;
    if (oa.kind === "bound" || ob.kind === "bound") {
        const [fast, fo] = oa.kind === "value" ? [a, oa] : [b, ob];
        const n = TIMEOUT_MS / Math.max(fo.value, 1e-3);
        return `**${coreName(fast)} ≥ ${ratio(n)}** †${sub}`;
    }
    const [fast, slow] =
        oa.value <= ob.value
            ? [
                  [a, oa],
                  [b, ob],
              ]
            : [
                  [b, ob],
                  [a, oa],
              ];
    // A tick within twice its floor is the floor plus less than a floor:
    // its own time is below what the adapter lets us see, so the ratio is a
    // bound from the floor, and two such ticks cannot be told apart.
    if (fast[1].floored && slow[1].floored) return `both at the floor ‡${sub}`;
    if (fast[1].floored) {
        const r = slow[1].value / fast[1].floor;
        if (r < 1.2) return `**≈ equal** ‡${sub}`;
        return `**${coreName(fast[0])} > ${ratio(r)}** ‡${sub}`;
    }
    const r = slow[1].value / Math.max(fast[1].value, 1e-3);
    if (r < 1.2) return `**≈ equal**${sub}`;
    return `**${coreName(fast[0])} ${ratio(r)}**${sub}`;
}
const ratio = (r) =>
    `${r >= 10 ? Math.round(r).toLocaleString("en-US") : r.toFixed(1)}×`;

function comparison(run) {
    const { manifest } = run;
    const records = run.layers.node ?? [];
    // The shapes this run measured, in the generator's order.
    const measured = Object.keys(shapes).filter((s) =>
        records.some((r) => r.fixture.startsWith(`${s}-`)),
    );
    const cores = manifest.layers.node.cores;
    const by = new Map(records.map((r) => [`${r.core}/${r.fixture}`, r]));
    const floor = Object.fromEntries(
        cores.map((c) => {
            const r = by.get(`${c}/floor`);
            return [c, r?.samples_ms?.length ? median(r.samples_ms) : null];
        }),
    );
    const sizes = [
        ...new Set(
            records.map((r) => /-(\d+)$/.exec(r.fixture)?.[1]).filter(Boolean),
        ),
    ]
        .map(Number)
        .filter((n) =>
            records.some((r) =>
                measured.some((s) => r.fixture === `${s}-${n}`),
            ),
        )
        .sort((x, y) => x - y);
    const pairs = [];
    for (let i = 0; i < cores.length; i++)
        for (let j = i + 1; j < cores.length; j++)
            pairs.push([cores[i], cores[j]]);
    const size = (n) => n.toLocaleString("en-US");
    const out = [
        `# Comparison: ${manifest.id}`,
        "",
        header(manifest),
        "",
        "Each cell compares two cores on one shape at one size: the bold line says which is faster and by how much; the line under it gives each core's time. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).",
        "",
        `- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.`,
        `- **> ${ms(TIMEOUT_MS)}**: the core did not finish one tick (or the load) in ${ms(TIMEOUT_MS)}. † marks a ratio that is then a lower bound, its slow side unchecked.`,
        `- **not comparable**: a core finished, but its values after the check step are wrong. **—**: a core cannot run the shape (see [coverage](coverage.md)).`,
        "",
        `Adapter floor (the drag on a document of one free point): ${cores
            .map(
                (c) =>
                    `${coreName(c)} ${floor[c] == null ? "not measured" : ms(floor[c])}`,
            )
            .join(", ")}.`,
        "",
    ];
    for (const [measure, title] of [
        ["tick", "Tick"],
        ["load", "Load"],
    ]) {
        out.push(`## ${title}`, "");
        for (const [a, b] of pairs) {
            out.push(`### ${coreName(a)} and ${coreName(b)}`, "");
            const rows = measured.map((s) => [
                s,
                ...sizes.map((n) =>
                    pairCell(
                        a,
                        b,
                        outcome(by.get(`${a}/${s}-${n}`), measure, floor[a]),
                        outcome(by.get(`${b}/${s}-${n}`), measure, floor[b]),
                    ),
                ),
            ]);
            out.push(table(["Shape", ...sizes.map(size)], rows), "");
        }
    }
    out.push(
        "## Memory",
        "",
        "After the load: the growth of the JS heap, and the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.",
        "",
    );
    const memRows = [];
    for (const s of measured)
        for (const c of cores)
            memRows.push([
                `${s}, ${coreName(c)}`,
                ...sizes.map((n) => {
                    const r = by.get(`${c}/${s}-${n}`);
                    if (!r || r.heap_bytes == null) return "";
                    return `heap +${mb(Math.max(r.heap_bytes, 0))}<br><sub>wasm ${mb(r.wasm_bytes ?? 0)}</sub>`;
                }),
            ]);
    out.push(table(["Shape, core", ...sizes.map(size)], memRows), "");
    out.push(
        "<details><summary>Every measurement</summary>",
        "",
        table(
            [
                "Fixture",
                "Core",
                "Status",
                "Load",
                "Tick (median, p90, n)",
                "Floored",
                "Heap",
                "Wasm",
                "Check",
            ],
            records.map((r) => {
                const t = r.samples_ms;
                return [
                    r.fixture,
                    coreName(r.core),
                    r.status === "ok" ? "ok" : `${r.status} at ${r.stage}`,
                    r.load_ms != null ? ms(r.load_ms) : "",
                    t?.length
                        ? `${ms(median(t))}, ${ms(quantile(t, 0.9))}, ${t.length}`
                        : "",
                    t?.length && floor[r.core]
                        ? median(t) < 2 * floor[r.core]
                            ? "yes"
                            : ""
                        : "",
                    r.heap_bytes != null ? mb(Math.max(r.heap_bytes, 0)) : "",
                    r.wasm_bytes != null ? mb(r.wasm_bytes) : "",
                    !r.check ? "" : r.check.ok ? "ok" : mismatch(r.check),
                ];
            }),
        ),
        "",
        "</details>",
        "",
    );
    return out.join("\n");
}

function coverage(run) {
    const { manifest } = run;
    const records = run.layers.node ?? [];
    const cores = manifest.layers.node.cores;
    const by = new Map(records.map((r) => [`${r.core}/${r.fixture}`, r]));
    const fixtures = [...new Set(records.map((r) => r.fixture))].filter(
        (f) => f !== "floor",
    );
    const cell = (r) => {
        if (!r) return "";
        if (r.status === "timeout") return `timeout at ${r.stage}`;
        if (r.status !== "ok")
            return `${r.status} at ${r.stage}: ${r.message ?? ""}`;
        if (!r.check) return "✓ (no value check)";
        return r.check.ok ? "✓" : `✗ ${mismatch(r.check)}`;
    };
    return [
        `# Coverage: ${manifest.id}`,
        "",
        header(manifest),
        "",
        "What each core can run: every fixture of the run, synthetic and real. ✓ means it loaded, ticked and left the values the fixture expects; a real document has no value check. ✗ gives the values that were wrong. A timeout is " +
            `${ms(TIMEOUT_MS)} on one stage (a load, a tick).`,
        "",
        table(
            ["Fixture", ...cores.map(coreName)],
            fixtures.map((f) => [
                f,
                ...cores.map((c) => cell(by.get(`${c}/${f}`))),
            ]),
        ),
        "",
    ].join("\n");
}

/** The product budgets (METHOD.md): goals, not gates. */
const BUDGETS = {
    tick: 16,
    structural: 50,
    load: 100,
    state: 2048,
    bundle: 1e6,
};

function budgets(run) {
    const { manifest } = run;
    const out = [
        `# Budgets: ${manifest.id}`,
        "",
        header(manifest),
        "",
        "Each core in a real page with its own viewer, against the product budgets in [METHOD.md](../../../METHOD.md). These numbers include each viewer, which differ in maturity, so they are not a comparison between cores.",
        "",
    ];
    const pass = (v, b) => (v <= b ? "✓" : "✗");
    const browser = run.layers.browser ?? [];
    if (browser.length) {
        const cores = manifest.layers.browser.cores;
        const by = new Map(browser.map((r) => [`${r.core}/${r.fixture}`, r]));
        const fixtures = [...new Set(browser.map((r) => r.fixture))];
        out.push(
            `## Frame latency of a drag`,
            "",
            `Median time from a pointer move to the frame that shows the point moved: ${BUDGETS.tick} ms per frame, ${BUDGETS.structural} ms for a rebuild. Under it: p90 and how many of the moves got a frame.`,
            "",
        );
        const lat = (r, budget) => {
            if (!r) return "";
            if (r.status !== "ok") return `${r.status} at ${r.stage}`;
            const l = r.drag?.latency;
            if (!l?.n) return "no frames";
            return `${pass(l.p50_ms, budget)} ${ms(l.p50_ms)}<br><sub>p90 ${ms(l.p90_ms)} · ${r.drag.frames}/${r.drag.moves} frames</sub>`;
        };
        out.push(
            table(
                ["Fixture", ...cores.map(coreName)],
                fixtures
                    .filter((f) =>
                        browser.some((r) => r.fixture === f && r.drag),
                    )
                    .map((f) => [
                        f,
                        ...cores.map((c) =>
                            lat(
                                by.get(`${c}/${f}`),
                                f.startsWith("rebuild-")
                                    ? BUDGETS.structural
                                    : BUDGETS.tick,
                            ),
                        ),
                    ]),
            ),
            "",
            `## Load`,
            "",
            `Text to first render. The budget, ${BUDGETS.load} ms, is for \`homework\`; the other loads are for reference.`,
            "",
            table(
                ["Fixture", ...cores.map(coreName)],
                fixtures.map((f) => [
                    f,
                    ...cores.map((c) => {
                        const r = by.get(`${c}/${f}`);
                        if (!r) return "";
                        if (r.load_ms == null)
                            return `${r.status} at ${r.stage}`;
                        return f === "homework"
                            ? `${pass(r.load_ms, BUDGETS.load)} ${ms(r.load_ms)}`
                            : ms(r.load_ms);
                    }),
                ]),
            ),
            "",
        );
    }
    const node = run.layers.node ?? [];
    const state = node.filter(
        (r) => r.fixture === "homework" && r.state_bytes != null,
    );
    if (state.length)
        out.push(
            `## State storage`,
            "",
            `The \`homework\` session's saved state after its script, raw: ${BUDGETS.state / 1024} KB. Under it: gzipped.`,
            "",
            table(
                ["Core", "State"],
                state.map((r) => [
                    coreName(r.core),
                    `${pass(r.state_bytes, BUDGETS.state)} ${(r.state_bytes / 1024).toFixed(1)} KB<br><sub>gzip ${((r.state_gzip_bytes ?? 0) / 1024).toFixed(1)} KB</sub>`,
                ]),
            ),
            "",
        );
    const bundle = run.layers.bundle ?? [];
    if (bundle.length)
        out.push(
            `## Bundle`,
            "",
            `Everything a page fetches to render a document, brotli: ${BUDGETS.bundle / 1e6} MB. Under it: raw.`,
            "",
            table(
                ["Set", "Size"],
                bundle.map((r) => [
                    r.set,
                    `${pass(r.brotli_bytes, BUDGETS.bundle)} ${(r.brotli_bytes / 1e6).toFixed(2)} MB<br><sub>raw ${(r.raw_bytes / 1e6).toFixed(2)} MB</sub>`,
                ]),
            ),
            "",
        );
    out.push(
        "Memory per viewer (budget 20 MB) is measured by `packages/memory-benchmark`, not in a run.",
        "",
    );
    return out.join("\n");
}

function header(m) {
    const h = m.hardware;
    const builds = Object.entries(m.builds)
        .map(([c, b]) => `${coreName(c)}: ${b}`)
        .join("; ");
    return [
        `Machine **${m.machine}** (${h.cpu}, ${h.cores} cores, ${mb(h.memory_bytes)}, ${h.os}, Node ${h.node}); commit \`${m.commit}\`${m.dirty ? " with uncommitted changes" : ""}; ${m.date}.`,
        "",
        `Builds: ${builds || "none recorded"}.`,
    ].join("\n");
}

const runs = listRuns();
for (const run of runs) {
    const pages = [];
    if (run.layers.node?.length) {
        writeFileSync(resolve(run.dir, "comparison.md"), comparison(run));
        writeFileSync(resolve(run.dir, "coverage.md"), coverage(run));
        pages.push("comparison", "coverage");
    }
    if (run.layers.browser?.length || run.layers.bundle?.length) {
        writeFileSync(resolve(run.dir, "budgets.md"), budgets(run));
        pages.push("budgets");
    }
    run.pages = pages;
}

// The index: runs grouped by machine, each machine's newest run first.
const machines = new Map();
for (const run of runs) {
    const m = run.manifest.machine;
    if (!machines.has(m)) machines.set(m, []);
    machines.get(m).push(run);
}
const index = [
    "# Benchmark runs",
    "",
    "Generated by `scripts/render.mjs`; do not edit. Every page is built from one run alone: one machine, one commit, every core in one sweep. How runs are made and what the numbers mean: [METHOD.md](../METHOD.md).",
    "",
];
if (!runs.length) index.push("No runs yet.", "");
for (const [machine, list] of machines) {
    const h = list[0].manifest.hardware;
    index.push(
        `## ${machine}`,
        "",
        `${h.cpu}, ${h.cores} cores, ${mb(h.memory_bytes)}, ${h.os}.`,
        "",
    );
    index.push(
        table(
            ["Run", "Commit", "Cores", "Pages"],
            list.map((r) => [
                r.manifest.id,
                `\`${r.manifest.commit}\`${r.manifest.dirty ? " (dirty)" : ""}`,
                (
                    r.manifest.layers.node?.cores ??
                    r.manifest.layers.browser?.cores ??
                    []
                )
                    .map(coreName)
                    .join(", "),
                r.pages
                    .map(
                        (p) =>
                            `[${p}](${relative(resolve(packageRoot, "results"), resolve(r.dir, `${p}.md`))})`,
                    )
                    .join(" · "),
            ]),
        ),
        "",
    );
}
writeFileSync(resolve(runsDir, "../README.md"), index.join("\n"));
console.log(`rendered ${runs.length} run(s)`);
