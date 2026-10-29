// Browser end to end: each fixture in each core's viewer under headless
// Chromium. Load is text to first render; a drag is 60 real pointer moves
// with the latency of each measured as the time to the first animation
// frame in which the dragged point had moved on screen; other steps go
// through the core with the time to the next frame and the next paint.
// One record per (core, fixture) in the run's `browser.json` (the run the
// Node layer of the same day, machine and commit started, or a new one).
// The load has 120 s and the action 15 s, as in the Node layer; finding
// the dragged point on screen, which is not timed, has 120 s. This layer
// answers the budgets (METHOD.md), not the comparison between cores.
//
//   BENCH_MACHINE=<id> BENCH_CORES=javascript,rust,cells,cells-prototype BENCH_FIXTURES=depth npm run browser
//
// `cells` is the cells core in its own viewer (packages/cells-viewer);
// `cells-prototype` is the cells core behind the prototype's renderers,
// through its bridge in the worker (ADR 0020 in packages/cells-core).
import { test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fixtureText, listFixtures, packageRoot } from "../src/fixtures.mjs";
import { appendRecord, openRun } from "../src/results.mjs";

const CORES = (process.env.BENCH_CORES ?? "javascript,cells").split(",");
const only = process.env.BENCH_FIXTURES?.split(",");
const FIXTURES = listFixtures().filter(
    (m: any) => !only || only.includes(m.name) || only.includes(m.shape),
);
/** The longest the load and the action may take, as in the Node layer. */
const LOAD_MS = 120_000;
const STAGE_MS = 15_000;
/**
 * Finding the dragged point on screen is the harness's work, not the
 * core's, and the JS page reads every state variable for it, so it has the
 * 120 s of the Node layer's untimed stages.
 */
const LOCATE_MS = 120_000;
const DRAG_STEPS = 60;
const ROUNDS = 10;
const PAGE: Record<string, string> = {
    javascript: "http://localhost:4174/js.html",
    rust: "http://localhost:4175/rust/",
    "cells-prototype": "http://localhost:4175/rust/?core=cells",
    cells: "http://localhost:4173/?blank=1",
};
/** Each core's adapter; the prototype's page has one for both its cores. */
const adapters: Record<string, string> = Object.fromEntries(
    [
        ["rust", "rust"],
        ["cells-prototype", "rust"],
        ["cells", "cells"],
    ].map(([core, adapter]) => [
        core,
        readFileSync(
            resolve(packageRoot, `browser/${adapter}-adapter.js`),
            "utf8",
        ),
    ]),
);
/** The cores whose adapters split each tick (`breakdown`): the cells core
 * in its viewer and behind the prototype's renderers (ADR 0020). */
const BREAKDOWN = new Set(["cells", "cells-prototype"]);
const BREAKDOWN_PARTS = [
    "core",
    "bridge",
    "hop",
    "react",
    "redraw",
    "total",
] as const;

/** The quantiles of each part of the ticks since the last clear. */
async function breakdown(page: Page) {
    const samples: Record<string, number>[] = await page.evaluate(() =>
        (window as any).__bench.breakdown(),
    );
    return Object.fromEntries(
        BREAKDOWN_PARTS.map((part) => [
            part,
            quantiles(samples.map((s) => s[part])),
        ]),
    );
}

const machine = process.env.BENCH_MACHINE;
if (!machine) throw new Error("name the machine: BENCH_MACHINE=<id>");
const run = openRun({
    machine,
    cores: CORES,
    layer: "browser",
    fixtures: FIXTURES.map((m: any) => m.name),
    load_timeout_ms: LOAD_MS,
    step_timeout_ms: STAGE_MS,
    session: process.env.BENCH_SESSION,
});
const out = run.records;

function quantiles(xs: number[]) {
    const s = xs.filter(Number.isFinite).sort((a, b) => a - b);
    function q(p: number) {
        return s[Math.min(s.length - 1, Math.floor(p * s.length))];
    }
    return s.length
        ? {
              n: s.length,
              p50_ms: q(0.5),
              p90_ms: q(0.9),
              p95_ms: q(0.95),
              max_ms: s[s.length - 1],
          }
        : { n: 0 };
}

/** Reject after the budget; the stage reached is reported. */
function deadline<T>(p: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        p,
        new Promise<T>((_, no) =>
            setTimeout(() => no(new Error("timeout")), ms),
        ),
    ]);
}

/**
 * Drag with real pointer events. In the page, a frame poller records every
 * animation frame, and when the point's screen position changes; each
 * move's latency is the first such frame after the move. With `watch`, a
 * point the drag moves besides the dragged one (`follow`), it times that
 * point's frames the same way. Chromium coalesces moves while the main
 * thread is busy, so slow documents yield fewer samples than moves.
 */
async function drag(
    page: Page,
    target: string,
    [cx, cy]: [number, number],
    watch?: string,
) {
    await page.evaluate(
        ({ target, watch }) => {
            const b = (window as any).__bench;
            const w = window as any;
            w.__moves = [] as number[];
            w.__ticks = [] as number[];
            const names = watch ? [target, watch] : [target];
            w.__frames = names.map(() => [] as number[]);
            const last = names.map((n) => JSON.stringify(b.position(n)));
            const poll = (t: number) => {
                w.__ticks.push(t);
                names.forEach((n, i) => {
                    const now = JSON.stringify(b.position(n));
                    if (now !== last[i]) {
                        w.__frames[i].push(performance.now());
                        last[i] = now;
                    }
                });
                if (!w.__stopPoll) requestAnimationFrame(poll);
            };
            document.addEventListener(
                "pointermove",
                () => w.__moves.push(performance.now()),
                true,
            );
            requestAnimationFrame(poll);
        },
        { target, watch },
    );
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    // Paced like a 60 Hz mouse, so a slow core is measured against real
    // input timing rather than a burst.
    for (let i = 1; i <= DRAG_STEPS; i++) {
        const a = (i / DRAG_STEPS) * Math.PI * 2;
        await page.mouse.move(
            cx + 120 * Math.sin(a),
            cy + 120 * Math.sin(2 * a),
        );
        await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(150);
    return page.evaluate(() => {
        const w = window as any;
        w.__stopPoll = true;
        const moves: number[] = w.__moves;
        // Each frame in which a point moved answers every move since the
        // previous such frame; the lag the user saw is measured from the
        // oldest of them, since until this frame the display was that stale.
        function latencies(frames: number[]) {
            const out: number[] = [];
            let j = 0;
            for (const f of frames) {
                let oldest = -1;
                while (j < moves.length && moves[j] < f) {
                    if (oldest < 0) oldest = moves[j];
                    j++;
                }
                if (oldest >= 0) out.push(f - oldest);
            }
            return out;
        }
        // The frames the page drew from the first move to the last: how
        // smooth the drag looked, whatever the points did.
        const first = moves[0],
            end = moves[moves.length - 1];
        const ticks = (w.__ticks as number[]).filter(
            (t) => t >= first && t <= end,
        );
        const [frames, watched] = w.__frames as number[][];
        return {
            moves: moves.length,
            frames: frames.length,
            latencies: latencies(frames),
            span_ms: end - first,
            ticks: ticks.length,
            gaps: ticks.slice(1).map((t, i) => t - ticks[i]),
            watch: watched && {
                frames: watched.length,
                latencies: latencies(watched),
            },
        };
    });
}

/** Steps through the core, timed to the next frame and the next paint. */
async function actRounds(page: Page, steps: any[], rounds: number) {
    return page.evaluate(
        async ({ steps, rounds }) => {
            const b = (window as any).__bench;
            const out: Record<string, { frame: number[]; paint: number[] }> =
                {};
            for (let r = 0; r < rounds; r++) {
                for (const s of steps) {
                    const label = `${s.action} ${s.target}`;
                    out[label] ??= { frame: [], paint: [] };
                    const t = performance.now();
                    await b.act(s);
                    const f = await b.nextFrame();
                    await b.nextPaint();
                    out[label].frame.push(f - t);
                    out[label].paint.push(performance.now() - t);
                }
            }
            return out;
        },
        { steps, rounds },
    );
}

for (const m of FIXTURES) {
    for (const core of CORES) {
        test(`${m.name} [${core}]`, async ({ page }) => {
            test.setTimeout(LOAD_MS + LOCATE_MS + 3 * STAGE_MS + 60_000);
            const record: any = { core, fixture: m.name, status: "ok" };
            let stage = "page";
            page.on("pageerror", (e) => {
                record.page_error ??= String(e.message).slice(0, 300);
            });
            try {
                await deadline(page.goto(PAGE[core]), STAGE_MS);
                if (adapters[core]) await page.evaluate(adapters[core]);
                stage = "load";
                const first = m.steps[0];
                // What "rendered" means for this fixture: its drag target's
                // board, or the element of its first step's target (name
                // paths become ids with `[i]` as `:i`). A target drawn in a
                // graph (`"in_graph": true`) has no element of its own in the
                // JS viewer, which waits for the board instead (`inGraph`).
                const waitFor =
                    first.action === "movePoint"
                        ? { board: true }
                        : {
                              id: first.target.replace(/\[(\d+)\]/g, ":$1"),
                              inGraph: m.in_graph === true,
                          };
                record.load_ms = await deadline(
                    page.evaluate(
                        ({ text, waitFor }) =>
                            (window as any).__bench.load(text, waitFor),
                        { text: fixtureText(m), waitFor },
                    ),
                    LOAD_MS,
                );
                if (core === "cells-prototype")
                    record.load_breakdown = await page.evaluate(() =>
                        (window as any).__bench.loadBreakdown(),
                    );
                stage = "tick";
                if (BREAKDOWN.has(core))
                    await page.evaluate(() =>
                        (window as any).__bench.clearSamples(),
                    );
                if (first.action === "movePoint") {
                    stage = "locate";
                    const at = await deadline(
                        page.evaluate(
                            async ({ n, start }) =>
                                (window as any).__bench.locate(n, start),
                            { n: first.target, start: m.start },
                        ),
                        LOCATE_MS,
                    );
                    if (!at) throw new Error(`cannot locate ${first.target}`);
                    if (m.watch) {
                        const w = await deadline(
                            page.evaluate(
                                async ({ name, start }) =>
                                    (window as any).__bench.locate(name, start),
                                m.watch,
                            ),
                            LOCATE_MS,
                        );
                        if (!w)
                            throw new Error(`cannot locate ${m.watch.name}`);
                    }
                    stage = "tick";
                    if (BREAKDOWN.has(core))
                        await page.evaluate(() =>
                            (window as any).__bench.clearSamples(),
                        );
                    const d = await deadline(
                        drag(page, first.target, at, m.watch?.name),
                        STAGE_MS,
                    );
                    record.drag = {
                        moves: d.moves,
                        frames: d.frames,
                        latency: quantiles(d.latencies),
                        fps: (d.ticks / d.span_ms) * 1000,
                        frame_gap: quantiles(d.gaps),
                    };
                    if (d.watch)
                        record.drag.watch = {
                            name: m.watch.name,
                            frames: d.watch.frames,
                            per_s: (d.watch.frames / d.span_ms) * 1000,
                            latency: quantiles(d.watch.latencies),
                        };
                    if (core === "cells") {
                        const samples: any[] = await page.evaluate(() =>
                            (window as any).__bench.samples(),
                        );
                        record.drag.cells = {
                            core: quantiles(samples.map((s) => s.core)),
                            commit: quantiles(samples.map((s) => s.commit)),
                            paint: quantiles(samples.map((s) => s.paint)),
                        };
                    }
                } else {
                    const r = await deadline(
                        actRounds(page, m.steps, ROUNDS),
                        STAGE_MS,
                    );
                    record.steps = Object.entries(r).map(([label, v]) => ({
                        label,
                        frame: quantiles(v.frame),
                        paint: quantiles(v.paint),
                    }));
                }
                if (BREAKDOWN.has(core))
                    record.breakdown = await breakdown(page);
            } catch (e: any) {
                record.status =
                    e.message === "timeout"
                        ? "timeout"
                        : /unsupported|did not resolve|cannot locate/.test(
                                e.message,
                            )
                          ? "unsupported"
                          : "error";
                record.stage = stage;
                if (record.status !== "timeout")
                    record.message = String(e.message).slice(0, 500);
            }
            appendRecord(out, record);
            const brief =
                record.status === "ok"
                    ? `load ${record.load_ms.toFixed(0)} ms` +
                      (record.drag
                          ? `, drag ${record.drag.latency.p50_ms?.toFixed(1)} ms (${record.drag.frames} frames / ${record.drag.moves} moves), ${record.drag.fps.toFixed(0)} fps` +
                            (record.drag.watch
                                ? `, ${record.drag.watch.name} ${record.drag.watch.latency.p50_ms?.toFixed(1)} ms (${record.drag.watch.per_s.toFixed(1)}/s)`
                                : "")
                          : "") +
                      (record.steps
                          ? `, ${record.steps.map((s: any) => `${s.label} ${s.frame.p50_ms?.toFixed(1)} ms`).join(", ")}`
                          : "")
                    : `${record.status} at ${record.stage}${record.message ? `: ${record.message}` : ""}`;
            console.log(`${m.name.padEnd(20)} ${core.padEnd(10)} ${brief}`);
        });
    }
}
