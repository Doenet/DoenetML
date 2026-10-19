// The trace layer's page, `trace.md`, and its waterfall figures
// (`trace-*.svg`), from a run's `trace.json` alone (browser/trace.spec.ts).
// Called by render.mjs for every run with a trace layer.
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { KINDS } from "../src/chrome-trace.mjs";
import { CORE_STEPS, KIND_TEXT, STEPS, explain } from "../src/steps.mjs";

const VISITS = ["cold", "warm", "hot", "edit"];
const VISIT_TEXT = {
    cold: "a first visit: a new browser profile, nothing cached",
    warm: "a second visit: the files in the HTTP cache; Chromium caches compiled code for the larger scripts during this visit",
    hot: "a third visit: the first that could use that compiled code (whether it did shows in script compile, under The main thread by kind of work)",
    edit: "the open page given a changed document, as the editor's Refresh does",
};

const median = (xs) => {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return NaN;
    return s.length % 2
        ? s[s.length >> 1]
        : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const ms = (x) =>
    !Number.isFinite(x)
        ? "—"
        : x >= 1000
          ? `${(x / 1000).toFixed(2)} s`
          : x >= 10
            ? `${x.toFixed(0)} ms`
            : x >= 1
              ? `${x.toFixed(1)} ms`
              : `${x.toFixed(2)} ms`;
const cellText = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
const table = (head, rows) =>
    [
        `| ${head.join(" | ")} |`,
        `|${head.map(() => "---").join("|")}|`,
        ...rows.map((r) => `| ${r.map(cellText).join(" | ")} |`),
    ].join("\n");
const esc = (s) =>
    String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
const countsText = (c) =>
    Object.entries(c ?? {})
        .map(([k, v]) => `${v.toLocaleString("en-US")} ${k.replace(/_/g, " ")}`)
        .join(", ");
const depth = (name) => name.split("/").length - 1;
const leaf = (name) => name.split("/").pop();

/**
 * The steps of one scenario's runs, each step the median of its runs:
 * start (from the visit's start), duration, and the first run's counts. A
 * step that runs more than once in a visit (a board per graph, a build
 * pass) is told apart by its occurrence.
 */
function medianSteps(runs) {
    const byKey = new Map();
    for (const run of runs) {
        const seen = new Map();
        for (const s of run.spans) {
            const k = seen.get(s.name) ?? 0;
            seen.set(s.name, k + 1);
            const key = `${s.name}#${k}`;
            if (!byKey.has(key))
                byKey.set(key, {
                    name: s.name,
                    k,
                    starts: [],
                    durations: [],
                    counts: s.counts,
                });
            const e = byKey.get(key);
            e.starts.push(s.start - (run.since ?? 0));
            e.durations.push(s.duration);
        }
    }
    return [...byKey.values()]
        .map((e) => ({
            name: e.name,
            k: e.k,
            n: e.durations.length,
            start: median(e.starts),
            duration: median(e.durations),
            counts: e.counts,
        }))
        .sort((a, b) => a.start - b.start || depth(a.name) - depth(b.name));
}

/** One run's steps, from the visit's start, in the order they started. */
function runSteps(run) {
    return run.spans
        .map((s) => ({ ...s, start: s.start - (run.since ?? 0) }))
        .sort((a, b) => a.start - b.start || depth(a.name) - depth(b.name));
}

const STEP_COLORS = {
    boot: "#8c8c8c",
    app: "#9b6bd3",
    editor: "#9b6bd3",
    fetch: "#2a9d8f",
    parse: "#3a7bd5",
    core: "#e07b24",
    render: "#3fa34d",
};
const KIND_COLORS = {
    html: "#b0b0b0",
    "script compile": "#d9a400",
    "script run": "#f2cf5b",
    "wasm compile": "#e8743b",
    gc: "#c94c4c",
    "style & layout": "#8a63d2",
    paint: "#3fa34d",
    other: "#9fb3c8",
};

/**
 * A waterfall of one traced run: the files fetched, the main thread's work
 * by kind, then every step, indented by nesting, on one time axis.
 */
function waterfall(record) {
    const t = record.traced;
    const since = t.since ?? 0;
    const steps = runSteps(t);
    const end = t.total_ms;
    const files = (t.resources ?? []).map((r) => ({
        ...r,
        start: r.start - since,
        end: r.end - since,
    }));
    const lane = (t.main?.lane ?? []).map(([s, e, k]) => [
        s - since,
        e - since,
        k,
    ]);
    const W = 1000,
        LEFT = 250,
        RIGHT = 64,
        ROW = 16,
        TOP = 28;
    const span = Math.max(end, ...files.map((f) => f.end), 1);
    const x = (v) => LEFT + (Math.max(0, v) / span) * (W - LEFT - RIGHT);
    const rows = [];
    let y = TOP;
    // Files.
    rows.push(`<text x="4" y="${y + 11}" class="h">files</text>`);
    y += ROW;
    for (const f of files) {
        const name = f.name.split("/").pop();
        rows.push(
            `<text x="12" y="${y + 11}">${esc(name.length > 34 ? name.slice(0, 16) + "…" + name.slice(-16) : name)}</text>`,
            `<rect x="${x(f.start)}" y="${y + 3}" width="${Math.max(1, x(f.end) - x(f.start))}" height="${ROW - 6}" fill="#6c8ebf"><title>${esc(f.name)}: ${ms(f.end - f.start)}, ${f.transfer_bytes ? (f.transfer_bytes / 1e6).toFixed(2) + " MB over the network" : "from cache"}</title></rect>`,
        );
        y += ROW;
    }
    // The main thread.
    y += 4;
    rows.push(
        `<text x="4" y="${y + 11}" class="h">main thread</text>`,
        `<rect x="${LEFT}" y="${y + 2}" width="${W - LEFT - RIGHT}" height="${ROW - 4}" fill="none" stroke="#ccc"/>`,
    );
    for (const [s, e, k] of lane)
        rows.push(
            `<rect x="${x(s)}" y="${y + 2}" width="${Math.max(0.5, x(e) - x(s))}" height="${ROW - 4}" fill="${KIND_COLORS[k] ?? "#999"}"><title>${esc(k)}: ${ms(e - s)}</title></rect>`,
        );
    y += ROW + 6;
    rows.push(`<text x="4" y="${y + 11}" class="h">steps</text>`);
    y += ROW;
    for (const s of steps) {
        const d = depth(s.name);
        const color = STEP_COLORS[s.name.split("/")[0]] ?? "#777";
        const label = leaf(s.name);
        rows.push(
            `<text x="${8 + d * 10}" y="${y + 11}">${esc(label)}</text>`,
            `<rect x="${x(s.start)}" y="${y + 3}" width="${Math.max(1, x(s.start + s.duration) - x(s.start))}" height="${ROW - 6}" fill="${color}" opacity="${1 - Math.min(d, 4) * 0.12}"><title>${esc(s.name)}: ${ms(s.duration)} from ${ms(s.start)}${Object.keys(s.counts ?? {}).length ? "; " + esc(countsText(s.counts)) : ""}</title></rect>`,
            `<text x="${Math.min(x(s.start + s.duration) + 3, W - 60)}" y="${y + 11}" class="d">${ms(s.duration)}</text>`,
        );
        y += ROW;
    }
    // Axis.
    const step =
        [10, 20, 50, 100, 200, 500, 1000, 2000].find((v) => span / v <= 12) ??
        5000;
    const ticks = [];
    for (let v = 0; v <= span; v += step)
        ticks.push(
            `<line x1="${x(v)}" x2="${x(v)}" y1="${TOP - 4}" y2="${y}" stroke="#e4e4e4"/>`,
            `<text x="${x(v)}" y="${TOP - 8}" class="t">${v} ms</text>`,
        );
    // Legend of kinds.
    y += 10;
    let lx = 4;
    const legend = [];
    for (const k of KINDS) {
        legend.push(
            `<rect x="${lx}" y="${y}" width="10" height="10" fill="${KIND_COLORS[k]}"/>`,
            `<text x="${lx + 14}" y="${y + 9}">${esc(k)}</text>`,
        );
        lx += 24 + k.length * 6.2;
    }
    y += 20;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${y}" viewBox="0 0 ${W} ${y}" font-family="Helvetica, Arial, sans-serif" font-size="11">
<style>text{fill:#222}.h{font-weight:bold}.t{fill:#777;text-anchor:middle;font-size:10px}.d{fill:#555;font-size:10px}</style>
<rect width="${W}" height="${y}" fill="#fff"/>
${ticks.join("\n")}
${rows.join("\n")}
${legend.join("\n")}
</svg>
`;
}

/** The record for a scenario, if the run has it. */
function find(records, { page, cpu, size, visit }) {
    return records.find(
        (r) =>
            r.page === page &&
            r.cpu === cpu &&
            r.size === size &&
            r.visit === visit,
    );
}
const total = (r) => (r ? median(r.runs.map((m) => m.total_ms)) : NaN);
const range = (r) => {
    const xs = (r?.runs ?? []).map((m) => m.total_ms).filter(Number.isFinite);
    return xs.length > 1
        ? ` <sub>${ms(Math.min(...xs))}–${ms(Math.max(...xs))}</sub>`
        : "";
};
/** The median duration of step `name` (summed over its occurrences). */
function stepTime(r, name) {
    if (!r) return NaN;
    return median(
        r.runs.map((m) =>
            m.spans
                .filter((s) => s.name === name)
                .reduce((a, s) => a + s.duration, 0),
        ),
    );
}
const svgName = (r) =>
    `trace-${r.page}-${r.fixture}-cpu${r.cpu}-${r.visit}.svg`;

export function tracePage(run, header) {
    const records = run.layers.trace ?? [];
    const out = [];
    const pages = [...new Set(records.map((r) => r.page))];
    const cpus = [...new Set(records.map((r) => r.cpu))].sort((a, b) => a - b);
    const sizes = [...new Set(records.map((r) => r.size))].sort(
        (a, b) => a - b,
    );
    const nRuns = run.manifest.layers.trace?.runs;
    const base = {
        page: pages.includes("editor") ? "editor" : pages[0],
        cpu: cpus[0],
        size: 1,
    };

    // Figures: every traced visit of `homework`.
    for (const r of records)
        if (r.size === 1 && r.traced)
            writeFileSync(resolve(run.dir, svgName(r)), waterfall(r));

    out.push(
        `# Load trace: ${run.manifest.id}`,
        "",
        header(run.manifest),
        "",
        "What the cells viewer does to get from DoenetML text to the first render, step by step, in the order it does it, and what the browser does underneath. Each scenario loads the page by navigation from the viewer's build, served as a host would serve it, and ends at the first render (the `render` step's end). " +
            `Step times are medians of ${nRuns ?? "the"} runs. The figures are of one more run made under a Chrome performance trace, which slows the page somewhat, so their times run a little above the tables'. ` +
            "A step's name is its path: `parse/lezerToDast` is part of `parse`. What every step does, and where its code is, is under [Steps](#steps). How the layer works: [METHOD.md](../../../METHOD.md#the-trace-layer).",
        "",
    );

    // At a glance.
    out.push(
        "## First render",
        "",
        "Navigation (or, for `edit`, the Refresh) to the first render, median; under it the fastest and slowest run.",
        "",
    );
    const glanceRows = [];
    for (const page of pages)
        for (const visit of VISITS)
            glanceRows.push([
                `${page} page, ${visit}`,
                ...cpus.map((cpu) => {
                    const r = find(records, { page, cpu, size: 1, visit });
                    return r ? `**${ms(total(r))}**${range(r)}` : "—";
                }),
            ]);
    out.push(
        table(
            ["Scenario (homework)", ...cpus.map((c) => `CPU ×${c}`)],
            glanceRows,
        ),
        "",
    );
    out.push(...VISITS.map((v) => `- **${v}**: ${VISIT_TEXT[v]}.`), "");

    // The main waterfall and its table.
    for (const visit of VISITS) {
        const r = find(records, { ...base, visit });
        if (!r) continue;
        out.push(
            `## ${base.page} page, ${visit}, CPU ×${base.cpu}`,
            "",
            `${VISIT_TEXT[visit][0].toUpperCase() + VISIT_TEXT[visit].slice(1)}. First render **${ms(total(r))}**.`,
            "",
        );
        if (r.traced)
            out.push(
                `![The steps of the traced run on one time axis](${svgName(r)})`,
                "",
                `The traced run: first render ${ms(r.traced.total_ms)}. Top: the files the page fetched (from the cache when the tooltip says so). Middle: what the main thread did, by kind. Bottom: the steps. Hover a bar for its numbers.`,
                "",
            );
        const steps = medianSteps(r.runs);
        out.push(
            table(
                ["Step", "Starts at", "Takes", "Work"],
                steps.map((s) => [
                    `${"&nbsp;&nbsp;".repeat(depth(s.name))}${s.k ? `${leaf(s.name)} (${s.k + 1})` : leaf(s.name)}`,
                    ms(s.start),
                    ms(s.duration),
                    countsText(s.counts),
                ]),
            ),
            "",
        );
        if (r.traced?.main) {
            const m = r.traced.main;
            const busy = m.busy_ms + m.idle_ms;
            out.push(
                "The main thread in the traced run, by kind of work (other threads' work is not counted; see below):",
                "",
                table(
                    ["Kind", "Time", "Share", "What it is"],
                    [
                        ...KINDS.filter((k) => m.totals[k] > 0).map((k) => [
                            k,
                            ms(m.totals[k]),
                            `${((m.totals[k] / busy) * 100).toFixed(0)}%`,
                            KIND_TEXT[k],
                        ]),
                        [
                            "idle",
                            ms(m.idle_ms),
                            `${((m.idle_ms / busy) * 100).toFixed(0)}%`,
                            "waiting: for the network, a timer or the next frame",
                        ],
                    ],
                ),
                "",
            );
        }
    }

    // Cold, warm, hot, edit side by side.
    const topSteps = (rs) => {
        const names = new Set();
        for (const r of rs)
            for (const m of r?.runs ?? [])
                for (const s of m.spans)
                    if (depth(s.name) <= 1) names.add(s.name);
        const order = medianSteps(rs.find(Boolean)?.runs ?? []).map(
            (s) => s.name,
        );
        return [...names].sort(
            (a, b) =>
                (order.indexOf(a) + 1 || 1e9) - (order.indexOf(b) + 1 || 1e9),
        );
    };
    const compare = (title, text, cols) => {
        const rs = cols.map((c) => c.record);
        if (rs.filter(Boolean).length < 2) return;
        out.push(`## ${title}`, "", text, "");
        out.push(
            table(
                ["Step", ...cols.map((c) => c.label)],
                [
                    ...topSteps(rs).map((name) => [
                        `${"&nbsp;&nbsp;".repeat(depth(name))}${leaf(name)}`,
                        ...rs.map((r) => ms(stepTime(r, name))),
                    ]),
                    [
                        "**first render**",
                        ...rs.map((r) => `**${ms(total(r))}**`),
                    ],
                ],
            ),
            "",
        );
    };
    compare(
        `Visits compared: ${base.page} page, CPU ×${base.cpu}`,
        "The same document on each visit. A step that shrinks from cold to hot was paying for something the browser caches (files, compiled code); one that does not is work done on every load. A step can also take longer only because the main thread was busy with something else when it was due: compare the main-thread lanes in the figures above.",
        VISITS.map((visit) => ({
            label: visit,
            record: find(records, { ...base, visit }),
        })),
    );
    if (pages.length > 1)
        compare(
            `The editor page and the viewer alone, cold, CPU ×${base.cpu}`,
            "Both load the same bundle; the viewer alone (`?editor=0`) does not mount the editor. The difference is what mounting the editor costs a load.",
            pages.map((page) => ({
                label: page,
                record: find(records, { ...base, page, visit: "cold" }),
            })),
        );
    if (cpus.length > 1)
        compare(
            `A slower device: ${base.page} page, cold`,
            "Chromium's CPU throttling slows the page's threads by the factor named, standing in for a slower device. The network is not slowed.",
            cpus.map((cpu) => ({
                label: `CPU ×${cpu}`,
                record: find(records, { ...base, cpu, visit: "cold" }),
            })),
        );

    // The size sweep, with the core's own steps.
    if (sizes.length > 1) {
        for (const visit of ["cold", "edit"]) {
            const cols = sizes.map((size) => ({
                size,
                record: find(records, { ...base, size, visit }),
            }));
            const rs = cols.map((c) => c.record);
            if (rs.filter(Boolean).length < 2) continue;
            const names = new Set();
            for (const r of rs)
                for (const m of r?.runs ?? [])
                    for (const s of m.spans)
                        if (
                            depth(s.name) <= 1 ||
                            s.name.startsWith("core/new Core/load/")
                        )
                            if (depth(s.name) <= 4) names.add(s.name);
            const order = medianSteps(rs[rs.length - 1]?.runs ?? []).map(
                (s) => s.name,
            );
            const sorted = [...names].sort(
                (a, b) =>
                    (order.indexOf(a) + 1 || 1e9) -
                    (order.indexOf(b) + 1 || 1e9),
            );
            const first = rs[0],
                last = rs[rs.length - 1];
            const ratio = sizes[sizes.length - 1] / sizes[0];
            out.push(
                `## The document's size: ${base.page} page, ${visit}, CPU ×${base.cpu}`,
                "",
                `\`homework-x<n>\` is the homework page repeated in n sections. The last column is how much the step grew from ×${sizes[0]} to ×${sizes[sizes.length - 1]}: near 1 is a fixed cost of the page, near ${ratio} is work proportional to the document.`,
                "",
                table(
                    ["Step", ...sizes.map((n) => `×${n}`), "growth"],
                    [
                        ...sorted.map((name) => {
                            const a = stepTime(first, name),
                                b = stepTime(last, name);
                            return [
                                `${"&nbsp;&nbsp;".repeat(depth(name))}${leaf(name)}`,
                                ...rs.map((r) => ms(stepTime(r, name))),
                                a > 0 && b > 0 ? `${(b / a).toFixed(1)}×` : "—",
                            ];
                        }),
                        [
                            "**first render**",
                            ...rs.map((r) => `**${ms(total(r))}**`),
                            `${(total(last) / total(first)).toFixed(1)}×`,
                        ],
                    ],
                ),
                "",
                "Work done at each size, from the core's counts:",
                "",
                table(
                    [
                        "Size",
                        "Source",
                        "DAST nodes",
                        "Components",
                        "Cells",
                        "Instructions",
                    ],
                    cols.map(({ size, record }) => {
                        const s = (name) =>
                            record?.runs[0]?.spans.find((x) => x.name === name)
                                ?.counts ?? {};
                        const emit =
                            record?.runs[0]?.spans
                                .filter((x) => x.name.endsWith("/emit"))
                                .pop()?.counts ?? {};
                        return [
                            `×${size}`,
                            `${(s("parse").chars ?? NaN).toLocaleString("en-US")} chars`,
                            (
                                s("core/new Core/load/deserialize")
                                    .dast_nodes ?? NaN
                            ).toLocaleString("en-US"),
                            (emit.components ?? NaN).toLocaleString("en-US"),
                            (emit.cells ?? NaN).toLocaleString("en-US"),
                            (emit.instructions ?? NaN).toLocaleString("en-US"),
                        ];
                    }),
                ),
                "",
            );
        }
    }

    // Browser work by kind, every traced scenario of homework.
    const tracedRows = records.filter((r) => r.size === 1 && r.traced?.main);
    if (tracedRows.length) {
        out.push(
            "## The main thread by kind of work",
            "",
            "Every traced run of `homework`, from its start to its first render. Each millisecond is given to the innermost trace event covering it (`src/chrome-trace.mjs`). Only the main thread: work on other threads (a script compiled while it streams in, wasm optimized in the background, the editor's language server in its worker) is not here, and shows as idle when the main thread waits on it.",
            "",
            table(
                ["Scenario", ...KINDS, "idle", "first render (traced)"],
                tracedRows.map((r) => [
                    `${r.page}, ${r.visit}, CPU ×${r.cpu}`,
                    ...KINDS.map((k) => ms(r.traced.main.totals[k])),
                    ms(r.traced.main.idle_ms),
                    ms(r.traced.total_ms),
                ]),
            ),
            "",
        );
    }

    // The glossary.
    const seen = new Set(
        records.flatMap((r) =>
            r.runs.flatMap((m) => m.spans.map((s) => s.name)),
        ),
    );
    const missing = [...seen].filter((n) => !explain(n));
    out.push(
        "## Steps",
        "",
        "In the order a load runs them. Indented steps are part of the step above. The stages of a build (expand, resolve, loop check, emit) run inside whichever step builds: the compile's check, or a later build pass.",
        "",
        table(
            ["Step", "What it does", "Where"],
            [
                ...Object.entries(STEPS).map(([name, [what, where]]) => [
                    `${"&nbsp;&nbsp;".repeat(depth(name))}\`${leaf(name)}\``,
                    what,
                    `\`${where}\``,
                ]),
                ...Object.entries(CORE_STEPS).map(([name, [what, where]]) => [
                    `(a build's) \`${name}\``,
                    what,
                    `\`${where}\``,
                ]),
            ],
        ),
        "",
    );
    if (missing.length)
        out.push(
            `Steps recorded without a glossary entry (add them to \`src/steps.mjs\`): ${missing.map((n) => `\`${n}\``).join(", ")}.`,
            "",
        );
    return out.join("\n");
}
