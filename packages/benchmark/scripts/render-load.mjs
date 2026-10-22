// The load layer's page, `load.md`, from a run's `load.json` alone
// (browser/load.spec.ts). Called by render.mjs for every run with a load
// layer.
import { CPUS, DEVICES, NETWORKS } from "../src/devices.mjs";

/** The load budget: the document readable within this long on the
 * slow phone, cold. */
export const VISIBLE_BUDGET_MS = 300;
const BUDGET_DEVICE = "slow-phone";
/** A change in the host's speed beyond this, between the calibration and
 * the recheck after the run, is flagged on the page. */
const DRIFT_LIMIT = 0.1;

const VISITS = ["cold", "warm"];
const VISIT_TEXT = {
    cold: "a first visit: a new browser profile, nothing cached",
    warm: "a second visit: the same profile, the files in the HTTP cache",
};

function median(xs) {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    if (!s.length) return NaN;
    return s.length % 2
        ? s[s.length >> 1]
        : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
}
function ms(x) {
    return !Number.isFinite(x)
        ? "—"
        : x >= 1000
          ? `${(x / 1000).toFixed(2)} s`
          : x >= 10
            ? `${x.toFixed(0)} ms`
            : `${x.toFixed(1)} ms`;
}
function kb(b) {
    return !Number.isFinite(b)
        ? "—"
        : b >= 1e6
          ? `${(b / 1e6).toFixed(2)} MB`
          : `${(b / 1e3).toFixed(0)} KB`;
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

/** The median of `key` over a record's runs, with the fastest and slowest
 * under it. */
function spread(record, key, fmt = ms) {
    const xs = record.runs.map((r) => r[key]).filter(Number.isFinite);
    if (!xs.length) return "—";
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    return `**${fmt(median(xs))}** <sub>${fmt(lo)}–${fmt(hi)}</sub>`;
}

function networkText(name) {
    const n = NETWORKS[name];
    return n
        ? `${name} (${n.latency} ms, ${(n.download * 8) / 1e6} Mbps down, ${(n.upload * 8) / 1e6} Mbps up)`
        : `${name} (not slowed)`;
}

function scenarioName(r) {
    return `${r.page}, ${r.device}, ${r.network}`;
}

export function loadPage(run, header) {
    const all = run.layers.load ?? [];
    const calibration = all.find((r) => r.kind === "calibration");
    const recheck = all.find((r) => r.kind === "recheck");
    const records = all.filter((r) => r.kind === undefined);
    const nRuns = run.manifest.layers.load?.runs;
    const out = [];

    out.push(
        `# Load on devices: ${run.manifest.id}`,
        "",
        header(run.manifest),
        "",
        "How long a student waits for `homework` on each device: from navigation until the document can be read, and until it can be used. Each scenario loads a page of the cells viewer's build, served as a deployed host serves it, compressed, on a device: a CPU class calibrated on this machine, a network, and a phone's or desktop's screen. " +
            `Times are medians of ${nRuns ?? "the"} runs, with the fastest and slowest under each. What every column means is under [Measurements](#measurements). How the layer works: [METHOD.md](../../../METHOD.md#the-load-layer).`,
        "",
    );

    // The devices, as calibrated.
    if (calibration) {
        const rounds = calibration.host_rounds_ms ?? [];
        const drift = recheck
            ? recheck.host_workload_ms / calibration.host_workload_ms - 1
            : null;
        out.push(
            "## Devices",
            "",
            `The calibration workload took **${ms(calibration.host_workload_ms)}** on this machine, unthrottled${rounds.length ? ` (the median of ${rounds.length} rounds' fastest repetitions, which ranged ${ms(Math.min(...rounds))}–${ms(Math.max(...rounds))})` : ""}. A CPU class is the workload's time on that class. Its factor is the throttling at which the workload takes that time, found by timing it throttled and fitting the timings; Achieved is the workload's time at that factor, timed again, a check that carries the noise of one throttled timing.`,
            "",
            table(
                [
                    "Device",
                    "CPU class",
                    "Workload",
                    "Factor",
                    "Achieved",
                    "Network",
                    "Screen",
                ],
                Object.entries(DEVICES).map(([name, d]) => {
                    const c = calibration.cpus[d.cpu];
                    const s = d.screen;
                    return [
                        name,
                        d.cpu,
                        c ? ms(c.workload_ms) : "—",
                        c
                            ? `×${c.rate.toFixed(2)}${c.slower_than_host ? "" : " (the class is faster than this machine: run at its speed)"}`
                            : "—",
                        c?.achieved_ms !== undefined ? ms(c.achieved_ms) : "—",
                        networkText(d.network),
                        `${s.viewport.width}×${s.viewport.height} at ${s.deviceScaleFactor}×${s.isMobile ? ", mobile, touch" : ""}`,
                    ];
                }),
            ),
            "",
        );
        if (drift !== null)
            out.push(
                `After the run the workload took ${ms(recheck.host_workload_ms)} on this machine, ${drift >= 0 ? "+" : ""}${(drift * 100).toFixed(1)}% against the calibration${Math.abs(drift) > DRIFT_LIMIT ? `: **the machine's speed moved by more than ${DRIFT_LIMIT * 100}% during the run**, so by its end the devices ran up to that much off their times, and the run is not one to compare with another` : ", within the run's tolerance"}.`,
                "",
            );
        if (CPUS["mid-phone"] && CPUS["slow-phone"])
            out.push(
                "The phones' workload times are provisional until measured on real phones (`src/devices.mjs`).",
                "",
            );
    }

    // The budget.
    const budgetRows = records.filter(
        (r) =>
            r.device === BUDGET_DEVICE &&
            r.network === DEVICES[BUDGET_DEVICE].network &&
            r.visit === "cold",
    );
    if (budgetRows.length) {
        out.push(
            "## Budget",
            "",
            `The document readable within ${VISIBLE_BUDGET_MS} ms of navigation on the ${BUDGET_DEVICE}, on its own network, on a first visit.`,
            "",
            table(
                ["Page", "Readable", "Usable"],
                budgetRows.map((r) => {
                    const v = median(r.runs.map((x) => x.visible_ms));
                    return [
                        r.page,
                        `${v <= VISIBLE_BUDGET_MS ? "✓" : "✗"} ${spread(r, "visible_ms")}`,
                        spread(r, "interactive_ms"),
                    ];
                }),
            ),
            "",
        );
    }

    // Every scenario.
    for (const visit of VISITS) {
        const rows = records.filter((r) => r.visit === visit);
        if (!rows.length) continue;
        out.push(
            `## Every scenario, ${visit}`,
            "",
            `${VISIT_TEXT[visit][0].toUpperCase()}${VISIT_TEXT[visit].slice(1)}.`,
            "",
            table(
                [
                    "Page, device, network",
                    "First paint",
                    "Readable",
                    "Usable",
                    "Largest paint",
                    "Blocking",
                    "Layout shift",
                    "Transferred",
                ],
                rows.map((r) => [
                    `${scenarioName(r)} <sub>CPU ×${r.cpu_rate.toFixed(2)}</sub>`,
                    spread(r, "first_paint_ms"),
                    spread(r, "visible_ms"),
                    spread(r, "interactive_ms"),
                    spread(r, "largest_paint_ms"),
                    // Readable and usable at the same moment leave no span
                    // to block (the client-rendered pages).
                    r.runs.every((x) => x.visible_ms === x.interactive_ms)
                        ? "—"
                        : spread(r, "blocking_ms"),
                    spread(r, "layout_shift", (x) => x.toFixed(3)),
                    spread(r, "transfer_bytes", kb),
                ]),
            ),
            "",
        );
    }

    // Where the time went: the page's top-level steps, cold.
    const cold = records.filter((r) => r.visit === "cold");
    if (cold.length) {
        const names = [];
        for (const r of cold)
            for (const run of r.runs)
                for (const s of run.steps)
                    if (!names.includes(s.name)) names.push(s.name);
        out.push(
            "## Where the time went, cold",
            "",
            "The page's top-level steps (`cells:` measures), each the median of its runs: when it ended, from navigation, and in brackets how long it took. The trace layer breaks each one down.",
            "",
            table(
                ["Step", ...cold.map(scenarioName)],
                names.map((name) => [
                    `\`${name}\``,
                    ...cold.map((r) => {
                        const steps = r.runs
                            .map((x) => x.steps.find((s) => s.name === name))
                            .filter(Boolean);
                        if (!steps.length) return "—";
                        const end = median(
                            steps.map((s) => s.start + s.duration),
                        );
                        const dur = median(steps.map((s) => s.duration));
                        return `${ms(end)} <sub>(${ms(dur)})</sub>`;
                    }),
                ]),
            ),
            "",
        );

        // The files, cold: what crossed the network, and when it arrived.
        out.push(
            "## Files, cold",
            "",
            "Every file fetched, by the scenario it was fetched in: bytes on the wire (compressed) and when its last byte arrived, from navigation, each the median of its runs.",
            "",
        );
        for (const r of cold) {
            const byName = new Map();
            for (const run of r.runs)
                for (const f of run.resources) {
                    const name = f.name.replace(/-[\w-]{8}\./, "-[hash].");
                    if (!byName.has(name)) byName.set(name, []);
                    byName.get(name).push(f);
                }
            const files = [...byName.entries()]
                .map(([name, fs]) => ({
                    name,
                    bytes: median(fs.map((f) => f.transfer_bytes)),
                    end: median(fs.map((f) => f.end)),
                }))
                .sort((a, b) => a.end - b.end);
            out.push(
                `### ${scenarioName(r)}`,
                "",
                table(
                    ["File", "Transferred", "Arrived"],
                    files.map((f) => [`\`${f.name}\``, kb(f.bytes), ms(f.end)]),
                ),
                "",
            );
        }
    }

    out.push(
        "## Measurements",
        "",
        table(
            ["Column", "What it is"],
            [
                [
                    "First paint",
                    "The browser's first contentful paint. On the client-rendered pages this is the page's toolbar, not the document; on the `prerendered` page it is the document.",
                ],
                [
                    "Readable",
                    "When the document can be read. For the client-rendered pages (`viewer`, `editor`), the end of the `render` step: React has committed the document and the boards have drawn. For the `prerendered` page, its first paint, which is the document.",
                ],
                [
                    "Usable",
                    "When the document responds to input: the end of the `interactive` step where a page records one, else of the `render` step.",
                ],
                [
                    "Largest paint",
                    "The browser's largest contentful paint: when the largest text block or image so far was painted.",
                ],
                [
                    "Blocking",
                    "Total blocking time from readable to usable: each long task's time beyond 50 ms, the time the page could not respond to input. A dash where the page is usable the moment it is readable.",
                ],
                [
                    "Layout shift",
                    "The sum of the layout shifts not caused by input, until usable.",
                ],
                [
                    "Transferred",
                    "Bytes on the wire of every file fetched until usable, compressed as served; 0 for a file from the cache.",
                ],
            ],
        ),
        "",
    );
    return out.join("\n");
}
