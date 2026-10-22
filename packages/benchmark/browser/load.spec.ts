// The load layer: how long a student waits for a document on a given
// device, from navigation to reading it and to using it. Each scenario
// loads `homework` in a page of the cells viewer's build, served as a
// deployed host would serve it, compressed (`browser/serve.mjs`, port
// 4177), on a device (`src/devices.mjs`): a CPU class, calibrated on this
// machine, a network and a screen. Visits are `cold` (a new browser
// profile) and `warm` (the same profile again, files in the HTTP cache).
//
// A visit records what the browser reports about painting (first paint,
// largest paint, layout shift, long tasks), the page's own `cells:`
// steps, and the files fetched with their bytes on the wire. Records go
// to the run's `load.json`; `npm run render` turns them into `load.md`.
// See METHOD.md, The load layer.
//
//   BENCH_MACHINE=<id> npm run load
import { test, type Browser, type Page } from "@playwright/test";
import { DEVICES, NETWORKS, calibrate, listEnv } from "../src/devices.mjs";
import { appendRecord, openRun, readRecords } from "../src/results.mjs";
import { homeworkFixture } from "../src/trace-fixtures.mjs";

type DeviceName = keyof typeof DEVICES;

const RUNS = Number(process.env.BENCH_LOAD_RUNS ?? 5);
const DEVICE_NAMES: DeviceName[] = listEnv(
    "BENCH_LOAD_DEVICES",
    "desktop,mid-phone,slow-phone",
);
/** Unset: each device on its own network. Set: every device on each. */
const NETWORK_NAMES: string[] | null = process.env.BENCH_LOAD_NETWORKS
    ? listEnv("BENCH_LOAD_NETWORKS", "")
    : null;
const PAGE_NAMES: string[] = listEnv("BENCH_LOAD_PAGES", "viewer");
const ORIGIN = "http://localhost:4177";
/** The longest one visit may take before it counts as failed. */
const LOAD_MS = 120_000;
/** A long task's time beyond this blocks input (as total blocking time
 * counts it). */
const LONG_TASK_MS = 50;

for (const d of DEVICE_NAMES)
    if (!(d in DEVICES)) throw new Error(`no device ${d}`);
for (const n of NETWORK_NAMES ?? [])
    if (!(n in NETWORKS)) throw new Error(`no network ${n}`);

/**
 * The pages. `path` is where the document is loaded from its URL.
 * `visible` is the moment the document can be read: the client-rendered
 * pages show nothing of it before their first render (their first paint
 * is the page's toolbar), so it is the `render` step's end.
 */
const PAGES: Record<
    string,
    { path: (url: string) => string; visible: "first_render" | "first_paint" }
> = {
    viewer: {
        path: (url) => `/?src=${url}&editor=0`,
        visible: "first_render",
    },
    editor: { path: (url) => `/?src=${url}`, visible: "first_render" },
};
for (const p of PAGE_NAMES) if (!(p in PAGES)) throw new Error(`no page ${p}`);

const machine = process.env.BENCH_MACHINE;
if (!machine) throw new Error("name the machine: BENCH_MACHINE=<id>");

const SCENARIOS = PAGE_NAMES.flatMap((page) =>
    DEVICE_NAMES.flatMap((device) =>
        (NETWORK_NAMES ?? [DEVICES[device].network]).map((network) => ({
            page,
            device,
            network,
        })),
    ),
);
const run = openRun({
    machine,
    cores: ["cells"],
    layer: "load",
    // Playwright loads this spec again in a worker it starts after a test
    // times out; the session keeps the records already written.
    session: process.env.BENCH_SESSION,
    runs: RUNS,
    scenarios: SCENARIOS,
    load_timeout_ms: LOAD_MS,
});

type Visit = "cold" | "warm";
const VISITS: Visit[] = ["cold", "warm"];

/**
 * What the page reports about painting, from before its first script:
 * first contentful paint, the latest largest-contentful-paint candidate,
 * layout shifts not caused by input, and long tasks.
 */
function observePaint() {
    const w = window as any;
    const load = (w.__load = {
        firstPaint: null as number | null,
        largestPaint: null as number | null,
        layoutShift: 0,
        longTasks: [] as [number, number][],
    });
    const observe = (type: string, fn: (e: any) => void) => {
        try {
            new PerformanceObserver((list) =>
                list.getEntries().forEach(fn),
            ).observe({ type, buffered: true });
        } catch {
            // An entry type this browser does not report stays null.
        }
    };
    observe("paint", (e) => {
        if (e.name === "first-contentful-paint") load.firstPaint = e.startTime;
    });
    observe("largest-contentful-paint", (e) => {
        load.largestPaint = e.renderTime || e.loadTime || e.startTime;
    });
    observe("layout-shift", (e) => {
        if (!e.hadRecentInput) load.layoutShift += e.value;
    });
    observe("longtask", (e) => load.longTasks.push([e.startTime, e.duration]));
}

/** Read one visit's measurements from the page. */
async function collect(page: Page, visible: "first_render" | "first_paint") {
    const m = await page.evaluate(() => {
        const r = (x: number) => Math.round(x * 100) / 100;
        const measures = performance
            .getEntriesByType("measure")
            .filter((m) => m.name.startsWith("cells:"));
        const end = (name: string) => {
            const m = measures.filter((m) => m.name === `cells:${name}`).pop();
            return m ? r(m.startTime + m.duration) : null;
        };
        const load = (window as any).__load;
        return {
            first_paint_ms:
                load.firstPaint === null ? null : r(load.firstPaint),
            largest_paint_ms:
                load.largestPaint === null ? null : r(load.largestPaint),
            first_render_ms: end("render"),
            interactive_ms: end("interactive") ?? end("render"),
            layout_shift: Math.round(load.layoutShift * 1e4) / 1e4,
            long_tasks: load.longTasks as [number, number][],
            // The top-level steps, for where the time went; the trace
            // layer has every step.
            steps: measures
                .filter((m) => !m.name.slice("cells:".length).includes("/"))
                .map((m) => ({
                    name: m.name.slice("cells:".length),
                    start: r(m.startTime),
                    duration: r(m.duration),
                })),
            // The page itself (the navigation entry), then every file.
            resources: (
                [
                    ...performance.getEntriesByType("navigation"),
                    ...performance.getEntriesByType("resource"),
                ] as PerformanceResourceTiming[]
            ).map((e) => ({
                name: new URL(e.name).pathname,
                start: r(e.startTime),
                end: r(e.responseEnd),
                transfer_bytes: e.transferSize,
                body_bytes: e.encodedBodySize,
            })),
        };
    });
    const visible_ms =
        visible === "first_paint" ? m.first_paint_ms : m.first_render_ms;
    // Total blocking time from the document's being visible until it can
    // be used: each long task's time beyond LONG_TASK_MS, within that span.
    let blocking_ms = 0;
    if (visible_ms !== null && m.interactive_ms !== null)
        for (const [start, duration] of m.long_tasks) {
            const from = Math.max(start + LONG_TASK_MS, visible_ms);
            const to = Math.min(start + duration, m.interactive_ms);
            if (to > from) blocking_ms += to - from;
        }
    const { long_tasks, ...rest } = m;
    return {
        ...rest,
        visible_ms,
        blocking_ms: Math.round(blocking_ms * 100) / 100,
        long_task_count: long_tasks.length,
        transfer_bytes: m.resources.reduce((s, x) => s + x.transfer_bytes, 0),
    };
}

/** Open a page in `context` throttled as `rate` and `network` say. */
async function devicePage(
    context: import("@playwright/test").BrowserContext,
    rate: number,
    network: string,
) {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate });
    const n = NETWORKS[network as keyof typeof NETWORKS];
    if (n) {
        await cdp.send("Network.enable");
        await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: n.latency,
            downloadThroughput: n.download,
            uploadThroughput: n.upload,
        });
    }
    return page;
}

/** Navigate and wait until the document is in use (or failed). */
async function load(page: Page, path: string) {
    await page.goto(`${ORIGIN}${path}`, { timeout: LOAD_MS });
    await page.waitForFunction(
        () => {
            if (document.querySelector(".viewer-error"))
                throw new Error(
                    document.querySelector(".viewer-error")!.textContent!,
                );
            return (window as any).__cells?.ready === true;
        },
        null,
        { timeout: LOAD_MS, polling: 10 },
    );
    // The render step ends after the first frame, and a largest-paint
    // candidate is reported after its frame; let both be recorded.
    await page.evaluate(
        () =>
            new Promise((ok) =>
                requestAnimationFrame(() => setTimeout(ok, 100)),
            ),
    );
}

/** The CPU calibration, once per session: kept as the records' first, so
 * a worker Playwright restarts after a timeout reuses it instead of timing
 * the workload again under different conditions. */
async function calibration(browser: Browser) {
    const done = readRecords(run.records).find(
        (r: any) => r.kind === "calibration",
    );
    if (done) return done;
    const record = { kind: "calibration", ...(await calibrate(browser)) };
    appendRecord(run.records, record);
    return record;
}

test.describe.configure({ mode: "serial" });

const fixture = homeworkFixture(1);

test("warm the server", async ({ browser }) => {
    // The server compresses each file the first time it is asked for it;
    // ask before anything is measured.
    test.setTimeout(LOAD_MS * PAGE_NAMES.length);
    const context = await browser.newContext();
    try {
        for (const p of PAGE_NAMES) {
            const page = await context.newPage();
            page.on("pageerror", (e) => console.warn(String(e)));
            await load(page, PAGES[p].path(fixture.url));
            await page.close();
        }
    } finally {
        await context.close();
    }
});

for (const s of SCENARIOS) {
    test(`${s.page} ${s.device} ${s.network}`, async ({ browser }) => {
        test.setTimeout(LOAD_MS * VISITS.length * RUNS + 60_000);
        const cal = await calibration(browser);
        const device = DEVICES[s.device];
        const rate: number = cal.cpus[device.cpu].rate;
        const page = PAGES[s.page];
        const runs: Record<Visit, any[]> = { cold: [], warm: [] };
        // A new profile per repetition, so `cold` is cold every time.
        for (let r = 0; r < RUNS; r++) {
            const context = await browser.newContext(device.screen);
            await context.addInitScript(observePaint);
            try {
                for (const v of VISITS) {
                    const p = await devicePage(context, rate, s.network);
                    await load(p, page.path(fixture.url));
                    runs[v].push(await collect(p, page.visible));
                    await p.close();
                }
            } finally {
                await context.close();
            }
        }
        for (const v of VISITS)
            appendRecord(run.records, {
                page: s.page,
                device: s.device,
                cpu: device.cpu,
                cpu_rate: rate,
                network: s.network,
                fixture: fixture.name,
                visit: v,
                runs: runs[v],
            });
        const median = (xs: number[]) =>
            [...xs].sort((a, b) => a - b)[xs.length >> 1];
        console.log(
            `${s.page} ${s.device} ${s.network} (cpu x${rate.toFixed(2)}): ` +
                VISITS.map(
                    (v) =>
                        `${v} visible ${median(runs[v].map((m) => m.visible_ms)).toFixed(0)} ms, interactive ${median(runs[v].map((m) => m.interactive_ms)).toFixed(0)} ms`,
                ).join("; "),
        );
    });
}
