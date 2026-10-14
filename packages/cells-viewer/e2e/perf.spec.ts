// End-to-end measurement: load each fixture in headless Chromium, read the
// startup stage timings, then drag the target point and sample per-tick core
// time, React commit latency and frame latency. Writes results/raw/e2e-*.json.
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const SPECS = (
    process.env.CELLS_E2E_FIXTURES ??
    "points-1000,points-10000,chain-1000,chain-100000,fanout-1000,fanout-10000,grid-1000x10,repeat-1000,hidden-1000,circles3-1000"
).split(",");
const EVALUATORS = (process.env.CELLS_E2E_EVALS ?? "dirty-closure,full").split(
    ",",
);
const FORMATS = (process.env.CELLS_E2E_FORMATS ?? "cdast").split(",");
const STEPS = 120;

function dragTarget(spec: string): string {
    const shape = spec.split("-")[0];
    if (
        shape === "chain" ||
        shape === "intchain" ||
        shape === "aliases" ||
        shape.startsWith("slider")
    )
        return "p";
    if (shape === "repeat") return "q";
    if (shape === "recur") return "p";
    if (shape === "circles3") return "k0";
    return "p0";
}

/** Fixtures whose `n` input drives a repeat: changing it rebuilds the document. */
function hasRepeat(spec: string): boolean {
    const shape = spec.split("-")[0];
    return shape === "repeat" || shape === "recur";
}
const REBUILD_STEPS = 20;

async function waitReady(page: Page) {
    await page.waitForFunction(() => window.__cells?.ready === true, null, {
        timeout: 120_000,
    });
}

function stats(xs: number[]) {
    const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
    if (s.length === 0)
        return { n: 0, mean: NaN, p50: NaN, p90: NaN, max: NaN };
    const q = (p: number) =>
        s[Math.min(s.length - 1, Math.floor(p * s.length))];
    return {
        n: s.length,
        mean: s.reduce((a, b) => a + b, 0) / s.length,
        p50: q(0.5),
        p90: q(0.9),
        max: s[s.length - 1],
    };
}

const results: any[] = [];

test.afterAll(() => {
    const dir = resolve(here, "../../../results/raw");
    mkdirSync(dir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const file = resolve(dir, `e2e-${stamp}.json`);
    // Merge with the same day's earlier runs so partial sweeps accumulate.
    let merged = results;
    if (existsSync(file)) {
        const prev = JSON.parse(readFileSync(file, "utf8")).results as any[];
        const key = (r: any) => `${r.spec}|${r.fmt ?? "json"}|${r.evaluator}`;
        const fresh = new Set(results.map(key));
        merged = [...prev.filter((r) => !fresh.has(key(r))), ...results];
    }
    writeFileSync(
        file,
        JSON.stringify({ date: stamp, steps: STEPS, results: merged }, null, 1),
    );
});

for (const spec of SPECS) {
    for (const fmt of FORMATS) {
        for (const evaluator of EVALUATORS) {
            const label = `${spec} [${fmt}] [${evaluator}]`;
            test(label, async ({ page }) => {
                page.on("console", (m) => {
                    if (m.type() === "error" || m.type() === "warning")
                        console.log(`[browser ${m.type()}] ${m.text()}`);
                });
                page.on("pageerror", (e) =>
                    console.log(`[pageerror] ${e.message}`),
                );
                await page.goto(`/?doc=${spec}&eval=${evaluator}&fmt=${fmt}`);
                await waitReady(page);
                const load = await page.evaluate(() => {
                    const s = window.__cells!.store!;
                    return {
                        timings: window.__cells!.timings,
                        nCells: s.comps.nCells,
                        nComponents: s.comps.length,
                    };
                });

                // A JSXGraph board has no DOM element per component to find, so the
                // page reports where to press (the first component with the name).
                const at = await page.evaluate(
                    (name) => window.__cells!.locate(name),
                    dragTarget(spec),
                );
                expect(at).not.toBeNull();
                const [cx, cy] = at!;
                await page.evaluate(() => {
                    window.__cells!.store!.samples.length = 0;
                });
                await page.mouse.move(cx, cy);
                await page.mouse.down();
                for (let i = 1; i <= STEPS; i++) {
                    const a = (i / STEPS) * Math.PI * 2;
                    await page.mouse.move(
                        cx + 120 * Math.sin(a),
                        cy + 120 * Math.sin(2 * a),
                    );
                }
                await page.mouse.up();
                // Let the last frame callback land.
                await page.waitForTimeout(100);
                const samples = await page.evaluate(
                    () => window.__cells!.store!.samples,
                );
                // Chromium coalesces pointermove events when the main thread is busy,
                // so slow documents yield fewer samples than moves.
                expect(samples.length).toBeGreaterThan(10);

                const r: any = {
                    spec,
                    fmt,
                    evaluator,
                    ...load,
                    tick: {
                        core: stats(samples.map((s: any) => s.core)),
                        roundTrip: stats(samples.map((s: any) => s.roundTrip)),
                        commit: stats(samples.map((s: any) => s.commit)),
                        frame: stats(samples.map((s: any) => s.frame)),
                        paint: stats(samples.map((s: any) => s.paint)),
                        changed: stats(samples.map((s: any) => s.changed)),
                    },
                };

                if (spec.startsWith("hidden-")) {
                    // Toggle the booleanInput every N points' `hide` is bound to.
                    const toggles = await page.evaluate(async (steps) => {
                        const s = window.__cells!.store!;
                        const cell = s.comps.cell(
                            s.comps.byName("b")!,
                            "value",
                        );
                        s.samples.length = 0;
                        for (let i = 0; i < steps; i++) {
                            s.request([[cell, i % 2 === 0 ? 1 : 0]]);
                            await new Promise((ok) => setTimeout(ok, 0));
                            await new Promise((ok) =>
                                requestAnimationFrame(() =>
                                    requestAnimationFrame(ok),
                                ),
                            );
                        }
                        await new Promise((ok) => setTimeout(ok, 50));
                        return s.samples;
                    }, REBUILD_STEPS);
                    r.toggle = {
                        core: stats(toggles.map((s: any) => s.core)),
                        commit: stats(toggles.map((s: any) => s.commit)),
                        frame: stats(toggles.map((s: any) => s.frame)),
                        paint: stats(toggles.map((s: any) => s.paint)),
                        changed: stats(toggles.map((s: any) => s.changed)),
                    };
                }

                if (spec.startsWith("wording-")) {
                    // Plan 6: flip every reactive choice by alternating `n` between 1
                    // and -1; the shown case must switch in the DOM.
                    const shown = () => page.locator(".doc").innerText();
                    expect(await shown()).toContain("Positive: ");
                    expect(await shown()).not.toContain("Negative: ");
                    const flips = await page.evaluate(async (steps) => {
                        const s = window.__cells!.store!;
                        const cell = s.comps.cell(
                            s.comps.byName("n")!,
                            "value",
                        );
                        s.samples.length = 0;
                        for (let i = 0; i < steps; i++) {
                            s.request([[cell, i % 2 === 0 ? -1 : 1]]);
                            await new Promise((ok) => setTimeout(ok, 0));
                            await new Promise((ok) =>
                                requestAnimationFrame(() =>
                                    requestAnimationFrame(ok),
                                ),
                            );
                        }
                        s.request([[cell, -1]]);
                        await new Promise((ok) => setTimeout(ok, 50));
                        return s.samples;
                    }, REBUILD_STEPS);
                    expect(await shown()).toContain("Negative: ");
                    expect(await shown()).not.toContain("Positive: ");
                    r.flip = {
                        core: stats(flips.map((s: any) => s.core)),
                        commit: stats(flips.map((s: any) => s.commit)),
                        frame: stats(flips.map((s: any) => s.frame)),
                        paint: stats(flips.map((s: any) => s.paint)),
                        changed: stats(flips.map((s: any) => s.changed)),
                    };
                }

                if (hasRepeat(spec)) {
                    // Structural ticks: alternate the repeat's length between N and N-1
                    // so every request rebuilds the document.
                    const rebuildSamples = await page.evaluate(
                        async (steps) => {
                            const s = window.__cells!.store!;
                            const n = s.comps.byName("n")!;
                            const base = s.get(s.comps.cell(n, "value"));
                            s.samples.length = 0;
                            for (let i = 0; i < steps; i++) {
                                const cell = s.comps.cell(
                                    s.comps.byName("n")!,
                                    "value",
                                );
                                s.request([
                                    [cell, i % 2 === 0 ? base - 1 : base],
                                ]);
                                // Wait for the frame to land.
                                await new Promise((ok) => setTimeout(ok, 0));
                                await new Promise((ok) =>
                                    requestAnimationFrame(() =>
                                        requestAnimationFrame(ok),
                                    ),
                                );
                            }
                            await new Promise((ok) => setTimeout(ok, 50));
                            return s.samples;
                        },
                        REBUILD_STEPS,
                    );
                    expect(rebuildSamples.every((s: any) => s.rebuilt)).toBe(
                        true,
                    );
                    // A JSXGraph element must still redraw after rebuilds re-bound its
                    // cells (even to the same indices): move the target, see it move.
                    const moved = await page.evaluate(async (name) => {
                        const s = window.__cells!.store!;
                        const c = s.comps.byName(name)!;
                        const before = window.__cells!.locate(name);
                        s.request([
                            [
                                s.comps.cell(c, "x"),
                                s.get(s.comps.cell(c, "x")) + 2,
                            ],
                            [
                                s.comps.cell(c, "y"),
                                s.get(s.comps.cell(c, "y")) + 1,
                            ],
                        ]);
                        await new Promise((ok) =>
                            requestAnimationFrame(() => ok(null)),
                        );
                        const after = window.__cells!.locate(name);
                        return before && after
                            ? Math.hypot(
                                  after[0] - before[0],
                                  after[1] - before[1],
                              )
                            : 0;
                    }, dragTarget(spec));
                    expect(moved).toBeGreaterThan(10);
                    r.rebuild = {
                        core: stats(rebuildSamples.map((s: any) => s.core)),
                        roundTrip: stats(
                            rebuildSamples.map((s: any) => s.roundTrip),
                        ),
                        commit: stats(rebuildSamples.map((s: any) => s.commit)),
                        frame: stats(rebuildSamples.map((s: any) => s.frame)),
                        paint: stats(rebuildSamples.map((s: any) => s.paint)),
                    };
                }
                results.push(r);
                const fl = r.flip
                    ? ` flip core p50=${r.flip.core.p50.toFixed(2)}ms commit p50=${r.flip.commit.p50.toFixed(1)}ms frame p50=${r.flip.frame.p50.toFixed(1)}ms`
                    : "";
                const rb = r.rebuild
                    ? ` rebuild core p50=${r.rebuild.core.p50.toFixed(2)}ms commit p50=${r.rebuild.commit.p50.toFixed(1)}ms frame p50=${r.rebuild.frame.p50.toFixed(1)}ms paint p50=${r.rebuild.paint.p50.toFixed(1)}ms`
                    : r.toggle
                      ? ` toggle core p50=${r.toggle.core.p50.toFixed(2)}ms commit p50=${r.toggle.commit.p50.toFixed(1)}ms frame p50=${r.toggle.frame.p50.toFixed(1)}ms paint p50=${r.toggle.paint.p50.toFixed(1)}ms changed=${r.toggle.changed.p50}`
                      : "";
                console.log(
                    `${label} cells=${load.nCells} core p50=${r.tick.core.p50.toFixed(3)}ms rt p50=${r.tick.roundTrip.p50.toFixed(2)}ms commit p50=${r.tick.commit.p50.toFixed(2)}ms frame p50=${r.tick.frame.p50.toFixed(2)}ms p90=${r.tick.frame.p90.toFixed(2)}ms paint p50=${r.tick.paint.p50.toFixed(2)}ms p90=${r.tick.paint.p90.toFixed(2)}ms first render=${load.timings?.firstRender?.toFixed(1)}ms${rb}${fl}`,
                );
            });
        }
    }
}
