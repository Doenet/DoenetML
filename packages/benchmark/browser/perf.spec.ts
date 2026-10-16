// Browser end to end: each fixture in each core's viewer under headless
// Chromium. Load is text to first render; a drag is 60 real pointer moves
// with the latency of each measured as the time to the first animation
// frame in which the dragged point had moved on screen; other steps go
// through the core with the time to the next frame and the next paint.
// One record per (core, fixture) in results/raw/browser-<date>.json.
//
//   BENCH_CORES=javascript,rust,cells BENCH_FIXTURES=chain-100 npm run browser
import { test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import {
    fixtureText,
    listFixtures,
    packageRoot,
    repoRoot,
} from "../src/fixtures.mjs";
import { appendRecord, localDate } from "../src/results.mjs";

const CORES = (process.env.BENCH_CORES ?? "javascript,cells").split(",");
const only = process.env.BENCH_FIXTURES?.split(",");
const FIXTURES = listFixtures().filter(
    (m: any) => !only || only.includes(m.name),
);
const BUDGET_MS = 60_000;
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
const date = localDate();
const out = resolve(packageRoot, `results/raw/browser-${date}.json`);
const commit = execSync("git rev-parse --short HEAD", {
    cwd: repoRoot,
    encoding: "utf8",
}).trim();

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
            test.setTimeout(BUDGET_MS + 60_000);
            const record: any = {
                date,
                commit,
                core,
                fixture: m.name,
                status: "ok",
            };
            let stage = "page";
            page.on("pageerror", (e) => {
                record.page_error ??= String(e.message).slice(0, 300);
            });
            try {
                await deadline(
                    (async () => {
                        await page.goto(PAGE[core]);
                        if (adapters[core]) await page.evaluate(adapters[core]);
                        stage = "load";
                        const first = m.steps[0];
                        // What "rendered" means for this fixture: its drag target's
                        // board, or the element of its first step's target (name
                        // paths become ids with `[i]` as `:i`).
                        const waitFor =
                            first.action === "movePoint"
                                ? { board: true }
                                : {
                                      id: first.target.replace(
                                          /\[(\d+)\]/g,
                                          ":$1",
                                      ),
                                  };
                        record.load_ms = await page.evaluate(
                            ({ text, waitFor }) =>
                                (window as any).__bench.load(text, waitFor),
                            { text: fixtureText(m), waitFor },
                        );
                        stage = "steps";
                        if (first.action === "movePoint") {
                            const at = await page.evaluate(
                                async (n) => (window as any).__bench.locate(n),
                                first.target,
                            );
                            if (!at)
                                throw new Error(
                                    `cannot locate ${first.target}`,
                                );
                            if (core === "cells")
                                await page.evaluate(() =>
                                    (window as any).__bench.clearSamples(),
                                );
                            const d = await drag(page, first.target, at);
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
                                    commit: quantiles(
                                        samples.map((s) => s.commit),
                                    ),
                                    paint: quantiles(
                                        samples.map((s) => s.paint),
                                    ),
                                };
                            }
                        } else {
                            const r = await actRounds(page, m.steps, ROUNDS);
                            record.steps = Object.entries(r).map(
                                ([label, v]) => ({
                                    label,
                                    frame: quantiles(v.frame),
                                    paint: quantiles(v.paint),
                                }),
                            );
                        }
                        if (m.structural) {
                            stage = "structural";
                            const r = await actRounds(
                                page,
                                m.structural,
                                Math.min(ROUNDS, 5),
                            );
                            record.structural = Object.entries(r).map(
                                ([label, v]) => ({
                                    label,
                                    frame: quantiles(v.frame),
                                    paint: quantiles(v.paint),
                                }),
                            );
                        }
                    })(),
                    BUDGET_MS,
                );
            } catch (e: any) {
                if (e.message === "timeout" && record.load_ms !== undefined) {
                    // The measurements taken before the budget ran out stand.
                    record.timed_out_at = stage;
                } else {
                    record.status =
                        e.message === "timeout"
                            ? "timeout"
                            : /unsupported|did not resolve|cannot locate/.test(
                                    e.message,
                                )
                              ? "unsupported"
                              : "error";
                    record.stage = stage;
                    record.message = String(e.message).slice(0, 500);
                }
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
                          : "") +
                      (record.structural
                          ? `, structural ${record.structural[0].frame.p50_ms?.toFixed(1)} ms`
                          : "") +
                      (record.timed_out_at
                          ? ` (> 60 s at ${record.timed_out_at})`
                          : "")
                    : `${record.status} at ${record.stage}: ${record.message}`;
            console.log(`${m.name.padEnd(20)} ${core.padEnd(10)} ${brief}`);
        });
    }
}
