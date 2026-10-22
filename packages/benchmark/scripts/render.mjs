// Render every run's pages from its records alone, and the index of runs.
// Nothing on a page is written by hand. See METHOD.md for what the numbers
// mean.
//
//   node scripts/render.mjs
//
// Per run, in its directory: `comparison.md` (every core against the JS
// core on the synthetic shapes: tick, then load, then memory), `coverage.md` (what each
// core can run, every fixture), and `budgets.md` (the browser layer and the
// bundle against the product budgets) when the run has those layers, and
// `trace.md` with its `trace-*.svg` figures (the steps of a load, in order;
// `render-trace.mjs`) when it has a trace layer, and `load.md` (the load on
// each device; `render-load.mjs`) when it has a load layer.
// `results/README.md` lists the runs, newest first, grouped by machine.
import { writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import { packageRoot, shapes } from "../src/fixtures.mjs";
import { listRuns, runsDir } from "../src/results.mjs";
import { loadPage } from "./render-load.mjs";
import { tracePage } from "./render-trace.mjs";

/** The limits a run's layer was measured under; a run before they were recorded had 15 s for everything. */
function limits(layer) {
    return {
        load: layer?.load_timeout_ms ?? 15_000,
        tick: layer?.step_timeout_ms ?? 15_000,
    };
}
const CORE_NAME = { javascript: "JS", rust: "Rust", cells: "cells" };
function coreName(c) {
    return CORE_NAME[c] ?? c;
}

function median(xs) {
    const s = [...xs].sort((a, b) => a - b);
    return s.length % 2
        ? s[s.length >> 1]
        : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
}
function quantile(xs, p) {
    const s = [...xs].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(p * s.length))];
}
function ms(x) {
    return x >= 1000
        ? `${(x / 1000).toFixed(x >= 10_000 ? 0 : 1)} s`
        : x >= 10
          ? `${x.toFixed(0)} ms`
          : x >= 0.1
            ? `${x.toFixed(2)} ms`
            : `${(x * 1000).toFixed(0)} µs`;
}
function mb(b) {
    return `${(b / 2 ** 20).toFixed(b >= 10 * 2 ** 20 ? 0 : 1)} MB`;
}
function cellText(s) {
    return String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
}
function table(head, rows) {
    return [
        `| ${head.join(" | ")} |`,
        `|${head.map(() => "---").join("|")}|`,
        ...rows.map((r) => `| ${r.map(cellText).join(" | ")} |`),
    ].join("\n");
}

/**
 * What a record says about one measure (`tick` or `load`): a value, a bound
 * (the core timed out on it), values that fail the check, or a gap.
 */
function outcome(r, measure, floor, limit) {
    if (!r) return { kind: "none" };
    if (r.status === "skipped")
        return { kind: "gap", why: `skipped: ${r.reason}` };
    // Values that fail the check make every measure of the record moot.
    if (r.check && !r.check.ok)
        return { kind: "mismatch", why: mismatch(r.check) };
    const failed = r.status === "unsupported" || r.status === "error";
    if (measure === "load") {
        // A load stands even when the core failed later, at the action.
        if (r.load_ms != null) return { kind: "value", value: r.load_ms };
        if (r.status === "timeout") return { kind: "bound", limit: limit.load };
        return { kind: "gap", why: `${r.status}: ${r.message ?? r.stage}` };
    }
    if (failed) return { kind: "gap", why: `${r.status}: ${r.message ?? ""}` };
    // A load that timed out leaves the tick unmeasured, not slow; a
    // timeout during the ticks means one tick took more than the limit.
    if (r.status === "timeout" && r.stage !== "tick" && !r.samples_ms?.length)
        return { kind: "gap", why: `load > ${ms(limit.load)}` };
    if (r.status === "timeout" && r.stage === "tick")
        return { kind: "bound", limit: limit.tick };
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
        // A synthetic shape always has a check; one that did not finish
        // leaves the value unchecked.
        unchecked: !r.check && /-\d+$/.test(r.fixture),
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

/** A core's own time, or why there is none, for a table cell. */
function own(o) {
    if (o.kind === "value")
        return (
            (o.floored ? `< ${ms(o.floor)} (floor)` : ms(o.value)) +
            (o.unchecked ? " (unchecked)" : "")
        );
    if (o.kind === "bound") return `> ${ms(o.limit)}`;
    if (o.kind === "mismatch") return "not comparable";
    if (o.kind === "gap") return `—`;
    return "";
}

/** Why a cell has no number, in a line under it. */
function why(o) {
    if (o.kind === "mismatch") return `<br><sub>${o.why}</sub>`;
    if (o.kind === "gap") return `<br><sub>${o.why}</sub>`;
    return "";
}

/**
 * The reference core's cell: its own time, in bold. The ratios of the
 * other cores are taken against it.
 */
function refCell(o) {
    if (o.kind === "value" || o.kind === "bound") {
        const mark = o.floored ? " ‡" : "";
        return `**${own(o)}**${mark}${o.unchecked ? " †" : ""}`;
    }
    return `${own(o)}${why(o)}`;
}

/**
 * Another core's cell: how many times faster (or slower) than the
 * reference core, in bold, with its own time under it; or its own time
 * alone when the reference has none to compare with.
 */
function vsCell(o, ref) {
    if (o.kind === "none") return "";
    if (o.kind === "mismatch" || o.kind === "gap") return `${own(o)}${why(o)}`;
    const sub = `<br><sub>${own(o)}</sub>`;
    const dagger = o.unchecked || ref.unchecked ? " †" : "";
    if (ref.kind !== "value" && ref.kind !== "bound") return `**${own(o)}**`;
    if (o.kind === "bound" && ref.kind === "bound")
        return `both > ${ms(o.limit)}`;
    if (ref.kind === "bound") {
        // The reference did not finish: this core is at least that much faster.
        return `**≥ ${ratio(ref.limit / Math.max(o.value, 1e-3))} faster** †${sub}`;
    }
    if (o.kind === "bound") {
        return `**≥ ${ratio(o.limit / Math.max(ref.value, 1e-3))} slower** †${sub}`;
    }
    // A tick within twice its floor is the floor plus less than a floor: its
    // own time is below what the adapter lets us see, so the ratio is a bound
    // taken from the floor, and two such ticks cannot be told apart.
    if (o.floored && ref.floored) return `both at the floor ‡${dagger}${sub}`;
    if (o.floored) {
        const r = ref.value / o.floor;
        if (r < 1.2) return `**≈ equal** ‡${dagger}${sub}`;
        return `**> ${ratio(r)} faster** ‡${dagger}${sub}`;
    }
    if (ref.floored) {
        const r = o.value / ref.floor;
        if (r < 1.2) return `**≈ equal** ‡${dagger}${sub}`;
        return `**> ${ratio(r)} slower** ‡${dagger}${sub}`;
    }
    const r = ref.value / Math.max(o.value, 1e-3);
    if (r >= 1 / 1.2 && r < 1.2) return `**≈ equal**${dagger}${sub}`;
    return r >= 1
        ? `**${ratio(r)} faster**${dagger}${sub}`
        : `**${ratio(1 / r)} slower**${dagger}${sub}`;
}
function ratio(r) {
    return `${r >= 10 ? Math.round(r).toLocaleString("en-US") : r.toFixed(1)}×`;
}

function comparison(run) {
    const { manifest } = run;
    const records = run.layers.node ?? [];
    // The shapes this run measured, in the generator's order.
    const measured = Object.keys(shapes).filter((s) =>
        records.some((r) => r.fixture.startsWith(`${s}-`)),
    );
    const cores = manifest.layers.node.cores;
    const limit = limits(manifest.layers.node);
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
    // Ratios are against the JS core, the core in use today; without it,
    // against the run's first core.
    const ref = cores.includes("javascript") ? "javascript" : cores[0];
    const others = cores.filter((c) => c !== ref);
    const order = [ref, ...others];
    const size = (n) => n.toLocaleString("en-US");
    const out = [
        `# Comparison: ${manifest.id}`,
        "",
        header(manifest),
        "",
        `Every core side by side, one row per shape and size. The ${coreName(ref)} column gives its time; every other column gives how many times faster or slower that core is than ${coreName(ref)}, with its own time under it. The shapes and what they exercise are in [METHOD.md](../../../METHOD.md).`,
        "",
        `- **Tick** is the median time of the shape's primary action, less the core's adapter floor (below). ‡: a tick within twice its floor, so its own time is below what the adapter lets us see; the ratio is then a bound ("> N×") taken from that floor.`,
        `- **> ${ms(limit.tick)}**: the core did not finish one tick in ${ms(limit.tick)}, or **> ${ms(limit.load)}** its load in ${ms(limit.load)}; a ratio against it is a bound ("≥ N×"). †: a value that was not checked, because its core did not finish or its check ran out of time. A core whose load did not finish has no tick.`,
        `- **not comparable**: the core finished, but its values after the check step are wrong. **—**: the core cannot run the shape, or was not tried at that size after failing a smaller one (see [coverage](coverage.md)).`,
        "",
        `Adapter floor (the drag on a document of one free point): ${cores
            .map(
                (c) =>
                    `${coreName(c)} ${floor[c] == null ? "not measured" : ms(floor[c])}`,
            )
            .join(", ")}.`,
        "",
    ];
    const head = ["Shape", "Size", ...order.map(coreName)];
    for (const [measure, title] of [
        ["tick", "Tick"],
        ["load", "Load"],
    ]) {
        out.push(`## ${title}`, "");
        const rows = [];
        for (const s of measured)
            for (const n of sizes) {
                const at = (c) =>
                    outcome(by.get(`${c}/${s}-${n}`), measure, floor[c], limit);
                const o = at(ref);
                rows.push([
                    s,
                    size(n),
                    refCell(o),
                    ...others.map((c) => vsCell(at(c), o)),
                ]);
            }
        out.push(table(head, rows), "");
    }
    out.push(
        "## Memory",
        "",
        "After the load: the growth of the JS heap and, under it, the size of the core's wasm linear memory (which never shrinks). Two kinds of memory, so no ratio.",
        "",
    );
    const memRows = [];
    for (const s of measured)
        for (const n of sizes)
            memRows.push([
                s,
                size(n),
                ...order.map((c) => {
                    const r = by.get(`${c}/${s}-${n}`);
                    if (!r || r.heap_bytes == null) return "";
                    return `heap +${mb(Math.max(r.heap_bytes, 0))}<br><sub>wasm ${mb(r.wasm_bytes ?? 0)}</sub>`;
                }),
            ]);
    out.push(table(head, memRows), "");
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
                    r.status === "ok"
                        ? "ok"
                        : r.status === "skipped"
                          ? `skipped: ${r.reason}`
                          : `${r.status} at ${r.stage}`,
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
        if (r.status === "skipped") return `skipped: ${r.reason}`;
        if (r.status === "timeout") return `timeout at ${r.stage}`;
        if (r.status !== "ok")
            return `${r.status} at ${r.stage}: ${r.message ?? ""}`;
        if (!r.check)
            return /-\d+$/.test(r.fixture)
                ? `✓ unchecked (the check ran out of time)`
                : "✓ (no value check)";
        return r.check.ok ? "✓" : `✗ ${mismatch(r.check)}`;
    };
    return [
        `# Coverage: ${manifest.id}`,
        "",
        header(manifest),
        "",
        "What each core can run: every fixture of the run, synthetic and real. ✓ means it loaded, ticked and left the values the fixture expects; a real document has no value check. ✗ gives the values that were wrong. A timeout is " +
            `${ms(limits(manifest.layers.node).load)} for the load, ${ms(limits(manifest.layers.node).tick)} for a tick.`,
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
            `Median time from a pointer move to the frame that shows the point moved: ${BUDGETS.tick} ms per frame, ${BUDGETS.structural} ms for a rebuild. Under it: p90 and how many of the moves got a frame. †: the Node layer did not check this core's values on the shape (it was skipped there, or did not finish), so the time is of work that was not checked.`,
            "",
        );
        // The browser has no value check: a core whose values were wrong
        // in the same run's Node layer did not do the work being timed, and
        // one the Node layer did not check is marked unchecked.
        const nodeBy = new Map(
            (run.layers.node ?? []).map((r) => [`${r.core}/${r.fixture}`, r]),
        );
        const lat = (r, budget) => {
            if (!r) return "";
            if (r.status !== "ok") return `${r.status} at ${r.stage}`;
            const n = nodeBy.get(`${r.core}/${r.fixture}`);
            if (n?.check && !n.check.ok)
                return `not comparable<br><sub>wrong values in the Node layer</sub>`;
            const l = r.drag?.latency;
            if (!l?.n) return "no frames";
            const unchecked = !n?.check && /-\d+$/.test(r.fixture) ? " †" : "";
            return `${pass(l.p50_ms, budget)} ${ms(l.p50_ms)}${unchecked}<br><sub>p90 ${ms(l.p90_ms)} · ${r.drag.frames}/${r.drag.moves} frames</sub>`;
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
    if (run.layers.trace?.length) {
        writeFileSync(resolve(run.dir, "trace.md"), tracePage(run, header));
        pages.push("trace");
    }
    if (run.layers.load?.length) {
        writeFileSync(resolve(run.dir, "load.md"), loadPage(run, header));
        pages.push("load");
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
                    r.manifest.layers.trace?.cores ??
                    r.manifest.layers.load?.cores ??
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
