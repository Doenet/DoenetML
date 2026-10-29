// The trace layer: what the cells viewer does, step by step and in order,
// to get from DoenetML text to the first render, and what the browser does
// underneath. Each scenario loads `homework` (or `homework-x<n>`, the same
// page repeated) by navigation, as a student would, from the viewer's
// build served as a host would serve it (`browser/serve.mjs`, cached port):
//
// - visits `cold` (a new browser profile: nothing cached), `warm` (the same
//   profile again: files cached, the browser's compiled code not yet) and
//   `hot` (a third time: the compiled-code caches filled too);
// - `edit`: the hot page given a changed document, as the editor's Refresh
//   does;
// - the editor page and the viewer alone (`?editor=0`, the same bundle);
// - CPU slowed down by Chromium's throttling, to stand in for a slow device;
// - documents of several sizes, to tell fixed costs from work that grows.
//
// Every scenario runs `BENCH_TRACE_RUNS` times untraced, for the steps'
// times (the page's `cells:` measures, `src/trace.ts` in the viewer, with
// the core's spans under `core/new Core`), and once more under a Chrome
// performance trace, for the main thread's work by kind
// (`src/chrome-trace.mjs`); tracing slows the page, so the traced run's
// times are kept apart. The traced runs' full Chrome traces are written to
// `results/traces/<run>/` (ignored by git), to open in DevTools. Records go
// to the run's `trace.json`; `npm run render` turns them into `trace.md`.
// See METHOD.md.
//
//   BENCH_MACHINE=<id> npm run trace
import {
    test,
    type Browser,
    type BrowserContext,
    type Page,
} from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { CATEGORIES, mainThreadWork } from "../src/chrome-trace.mjs";
import { listEnv } from "../src/env.mjs";
import { homeworkFixture, packageRoot } from "../src/fixtures.mjs";
import { appendRecord, openRun } from "../src/results.mjs";
import { median } from "../src/stats.mjs";

const RUNS = Number(process.env.BENCH_TRACE_RUNS ?? 5);
const CPUS = listEnv("BENCH_TRACE_CPU", "1,4").map(Number);
const SIZES = listEnv("BENCH_TRACE_SIZES", "1,4,16").map(Number);
const PAGES = listEnv("BENCH_TRACE_PAGES", "editor,viewer");
const ORIGIN = "http://localhost:4176";
/** The longest one visit may take before it counts as failed. */
const LOAD_MS = 120_000;

/** The scenarios: every page at every CPU rate on `homework`; the size
 * sweep on the editor page only, where documents are written. */
const SCENARIOS = PAGES.flatMap((page) =>
    CPUS.flatMap((cpu) =>
        (page === "editor" ? SIZES : [1]).map((size) => ({ page, cpu, size })),
    ),
);
const run = openRun({
    machine: process.env.BENCH_MACHINE,
    cores: ["cells"],
    layer: "trace",
    // Playwright loads this spec again in a worker it starts after a test
    // times out; the session keeps the records already written.
    session: process.env.BENCH_SESSION,
    runs: RUNS,
    scenarios: SCENARIOS,
    load_timeout_ms: LOAD_MS,
});

type Visit = "cold" | "warm" | "hot" | "edit";
const VISITS: Visit[] = ["cold", "warm", "hot", "edit"];

/** What one visit measured, from the page. */
type Measured = {
    /** Page time the visit started: 0 for a navigation, the call for an edit. */
    since: number;
    total_ms: number;
    spans: { name: string; start: number; duration: number; counts: any }[];
    resources: {
        name: string;
        start: number;
        end: number;
        transfer_bytes: number;
        body_bytes: number;
    }[];
};

/** Read the `cells:` measures from `since` on, and the files fetched. */
async function collect(page: Page, since: number): Promise<Measured> {
    return page.evaluate((since) => {
        // Hundredths of a millisecond: finer than any clock here resolves.
        const r = (x: number) => Math.round(x * 100) / 100;
        const spans = performance
            .getEntriesByType("measure")
            .filter((m) => m.name.startsWith("cells:") && m.startTime >= since)
            .map((m) => ({
                name: m.name.slice("cells:".length),
                start: r(m.startTime),
                duration: r(m.duration),
                counts: (m as PerformanceMeasure).detail?.counts ?? {},
            }));
        const render = spans.filter((s) => s.name === "render").pop();
        const resources = (
            performance.getEntriesByType(
                "resource",
            ) as PerformanceResourceTiming[]
        )
            .filter((r) => r.startTime >= since)
            .map((r) => ({
                name: new URL(r.name).pathname,
                start: Math.round(r.startTime * 100) / 100,
                end: Math.round(r.responseEnd * 100) / 100,
                transfer_bytes: r.transferSize,
                body_bytes: r.encodedBodySize,
            }));
        return {
            since,
            total_ms: render ? render.start + render.duration - since : NaN,
            spans,
            resources,
        };
    }, since);
}

/**
 * One visit in `context`: navigate (or, for `edit`, give the open page a
 * changed document) and wait for the first render. With `traced`, under a
 * Chrome trace whose main-thread work is returned too.
 */
async function visit(
    browser: Browser,
    context: BrowserContext,
    state: { page?: Page },
    v: Visit,
    s: { page: string; cpu: number },
    fixture: { url: string; text: string },
    traced: boolean,
    traceName: string,
) {
    let page = state.page;
    if (v !== "edit") {
        await page?.close();
        page = state.page = await context.newPage();
        const cdp = await context.newCDPSession(page);
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: s.cpu });
    }
    if (traced) await browser.startTracing(page, { categories: CATEGORIES });
    let since = 0;
    if (v === "edit") {
        // A changed document, as a Refresh in the editor loads it: the
        // same page with one more paragraph.
        const text = fixture.text.replace(
            "<problem",
            "<p>Edited.</p>\n\n<problem",
        );
        since = await page!.evaluate(async (text) => {
            const start = performance.now();
            await (window as any).__cells.loadSource(text);
            return start;
        }, text);
    } else {
        const editor = s.page === "editor" ? "" : "&editor=0";
        await page!.goto(`${ORIGIN}/?src=${fixture.url}${editor}`);
    }
    await page!.waitForFunction(
        () => {
            const c = (window as any).__cells;
            if (document.querySelector(".viewer-error"))
                throw new Error(
                    document.querySelector(".viewer-error")!.textContent!,
                );
            return c?.ready === true;
        },
        null,
        { timeout: LOAD_MS, polling: 10 },
    );
    // The render step ends after the first frame; let it be recorded.
    await page!.evaluate(
        () =>
            new Promise((ok) =>
                requestAnimationFrame(() => setTimeout(ok, 50)),
            ),
    );
    const measured = await collect(page!, since);
    let main = null;
    if (traced) {
        const raw = await browser.stopTracing();
        // Kept for a person to open in DevTools (Performance, Load
        // profile), out of the committed results: they are large.
        const dir = resolve(packageRoot, "results/traces", run.id);
        mkdirSync(dir, { recursive: true });
        writeFileSync(resolve(dir, `${traceName}.json.gz`), gzipSync(raw));
        const trace = JSON.parse(raw.toString());
        const first = measured.spans[0];
        main = first
            ? mainThreadWork(trace, since, since + measured.total_ms, first)
            : null;
    }
    return { ...measured, main };
}

test.describe.configure({ mode: "serial" });

for (const s of SCENARIOS) {
    const fixture = homeworkFixture(s.size);
    test(`${s.page} ${fixture.name} cpu x${s.cpu}`, async ({ browser }) => {
        test.setTimeout(LOAD_MS * 4 * (RUNS + 1));
        const runs: Record<Visit, any[]> = {
            cold: [],
            warm: [],
            hot: [],
            edit: [],
        };
        const traced: Record<Visit, any> = {
            cold: null,
            warm: null,
            hot: null,
            edit: null,
        };
        // A new profile per repetition, so `cold` is cold every time; the
        // last repetition is the traced one.
        for (let r = 0; r <= RUNS; r++) {
            const isTraced = r === RUNS;
            const context = await browser.newContext();
            const state: { page?: Page } = {};
            try {
                for (const v of VISITS) {
                    const m = await visit(
                        browser,
                        context,
                        state,
                        v,
                        s,
                        fixture,
                        isTraced,
                        `${s.page}-${fixture.name}-cpu${s.cpu}-${v}`,
                    );
                    if (isTraced) traced[v] = m;
                    else runs[v].push(m);
                }
            } finally {
                await context.close();
            }
        }
        for (const v of VISITS)
            appendRecord(run.records, {
                page: s.page,
                cpu: s.cpu,
                size: s.size,
                fixture: fixture.name,
                visit: v,
                runs: runs[v],
                traced: traced[v],
            });
        console.log(
            `${s.page} ${fixture.name} cpu x${s.cpu}: ` +
                VISITS.map(
                    (v) =>
                        `${v} ${median(runs[v].map((m) => m.total_ms)).toFixed(0)} ms`,
                ).join(", "),
        );
    });
}
