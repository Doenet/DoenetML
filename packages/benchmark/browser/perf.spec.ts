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
//   BENCH_MACHINE=<id> BENCH_CORES=javascript,rust,cells BENCH_FIXTURES=depth npm run browser
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
    cells: "http://localhost:4173/?blank=1",
};
const adapters: Record<string, string> = Object.fromEntries(
    ["rust", "cells"].map((core) => [
        core,
        readFileSync(
            resolve(packageRoot, `browser/${core}-adapter.js`),
            "utf8",
        ),
    ]),
);
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
    const q = (p: number) =>
        s[Math.min(s.length - 1, Math.floor(p * s.length))];
    return s.length
        ? {
              n: s.length,
              p50_ms: q(0.5),
              p90_ms: q(0.9),
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
 * Drag with real pointer events. In the page, a frame poller records when
 * the point's screen position changes; each move's latency is the first
 * such frame after the move. Chromium coalesces moves while the main
 * thread is busy, so slow documents yield fewer samples than moves.
 */
async function drag(page: Page, target: string, [cx, cy]: [number, number]) {
    await page.evaluate((name) => {
        const b = (window as any).__bench;
        const w = window as any;
        w.__moves = [] as number[];
        w.__frames = [] as number[];
        let last = JSON.stringify(b.position());
        const poll = () => {
            const now = JSON.stringify(b.position());
            if (now !== last) {
                w.__frames.push(performance.now());
                last = now;
            }
            if (!w.__stopPoll) requestAnimationFrame(poll);
        };
        document.addEventListener(
            "pointermove",
            () => w.__moves.push(performance.now()),
            true,
        );
        requestAnimationFrame(poll);
    }, target);
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
        const moves: number[] = w.__moves,
            frames: number[] = w.__frames;
        // Each frame in which the point moved answers every move since the
        // previous such frame; the lag the user saw is measured from the
        // oldest of them, since until this frame the display was that stale.
        const latencies: number[] = [];
        let j = 0;
        for (const f of frames) {
            let oldest = -1;
            while (j < moves.length && moves[j] < f) {
                if (oldest < 0) oldest = moves[j];
                j++;
            }
            if (oldest >= 0) latencies.push(f - oldest);
        }
        return { moves: moves.length, frames: frames.length, latencies };
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
                stage = "tick";
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
                    stage = "tick";
                    if (core === "cells")
                        await page.evaluate(() =>
                            (window as any).__bench.clearSamples(),
                        );
                    const d = await deadline(
                        drag(page, first.target, at),
                        STAGE_MS,
                    );
                    record.drag = {
                        moves: d.moves,
                        frames: d.frames,
                        latency: quantiles(d.latencies),
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
                          ? `, drag ${record.drag.latency.p50_ms?.toFixed(1)} ms (${record.drag.frames} frames / ${record.drag.moves} moves)`
                          : "") +
                      (record.steps
                          ? `, ${record.steps.map((s: any) => `${s.label} ${s.frame.p50_ms?.toFixed(1)} ms`).join(", ")}`
                          : "")
                    : `${record.status} at ${record.stage}${record.message ? `: ${record.message}` : ""}`;
            console.log(`${m.name.padEnd(20)} ${core.padEnd(10)} ${brief}`);
        });
    }
}
