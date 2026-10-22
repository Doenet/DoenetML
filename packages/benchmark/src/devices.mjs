// The load layer's devices (browser/load.spec.ts): what a page is loaded
// on, as a CPU class, a network and a screen. Chromium's CPU throttling
// slows the page's threads by a factor of the machine the suite runs on,
// so the same factor is a different phone on a different machine. A CPU
// class therefore names a speed, not a factor: how long a fixed JavaScript
// workload (`WORKLOAD`) takes on that class. At the start of a run the
// workload is timed on the host, unthrottled, and each class's factor is
// its time over the host's (`calibrate`). See METHOD.md, The load layer.

/**
 * The networks, after the DevTools and Lighthouse presets. `latency` is
 * added to every request (ms); throughputs are bytes per second. CDP's
 * emulation shapes each request, not packets: no TCP slow start, no loss,
 * so a real network of the same figures is slower than this.
 */
export const NETWORKS = {
    none: null,
    "4g": { latency: 60, download: 9e6 / 8, upload: 1.5e6 / 8 },
    "slow-4g": { latency: 150, download: 1.6e6 / 8, upload: 750e3 / 8 },
    "3g": { latency: 400, download: 400e3 / 8, upload: 400e3 / 8 },
};

/**
 * The CPU classes: the workload's time on each, in ms. `null` is the host
 * as it is. The phones' times are provisional: four and six times the
 * reference machine's (the `claude-cloud` machine of `results/runs/`,
 * where the workload takes 80 ms), the factors the trace layer used
 * before there were classes. Measure the workload on real phones (Chrome
 * remote debugging, `chrome://inspect`, running `WORKLOAD` in the
 * console) to replace them.
 */
const REFERENCE_WORKLOAD_MS = 80;
export const CPUS = {
    host: null,
    "mid-phone": 4 * REFERENCE_WORKLOAD_MS,
    "slow-phone": 6 * REFERENCE_WORKLOAD_MS,
};

/**
 * The devices: a CPU class, the network it is loaded over unless the run
 * names one (`BENCH_LOAD_NETWORKS`), and the screen as Playwright's
 * context options take it. The phones' screens are a current mid-range
 * Android phone's and a small one's.
 */
export const DEVICES = {
    desktop: {
        cpu: "host",
        network: "none",
        screen: {
            viewport: { width: 1000, height: 800 },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
        },
    },
    "mid-phone": {
        cpu: "mid-phone",
        network: "4g",
        screen: {
            viewport: { width: 412, height: 915 },
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
        },
    },
    "slow-phone": {
        cpu: "slow-phone",
        network: "slow-4g",
        screen: {
            viewport: { width: 360, height: 800 },
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
        },
    },
};

/**
 * The calibration workload, run in the page: allocation, a sort, a map and
 * string building, the kinds of work a page's scripts do. Returns a value
 * so nothing is optimized away. Its source is sent to the page as text, so
 * it must stay self-contained.
 */
export function WORKLOAD() {
    let h = 0;
    const a = [];
    for (let i = 0; i < 200000; i++) {
        const o = { i, s: "k" + (i % 997), v: (i * 2654435761) % 1000003 };
        a.push(o);
        h = (h + o.v * 31 + o.s.length) | 0;
    }
    a.sort((x, y) => x.v - y.v);
    const m = new Map();
    for (const o of a) m.set(o.s, (m.get(o.s) ?? 0) + o.v);
    let str = "";
    for (let i = 0; i < 20000; i++) str += String.fromCharCode(97 + (i % 26));
    return h + m.size + str.split("a").length;
}

/** Repetitions of the workload; the fastest is the host's time, as the
 * one least disturbed by garbage collection and other processes. */
const REPEATS = 15;

/** The workload's time on `page` (unthrottled), in ms. */
export async function workloadMs(page) {
    return page.evaluate(
        `(() => {
            const W = ${WORKLOAD};
            W();
            let best = Infinity;
            for (let i = 0; i < ${REPEATS}; i++) {
                const t = performance.now();
                W();
                best = Math.min(best, performance.now() - t);
            }
            return best;
        })()`,
    );
}

/**
 * Time the workload on the host and give each CPU class its throttling
 * factor: its time over the host's, at least 1 (a class faster than the
 * host runs at the host's speed, and says so in `slower_than_host`).
 */
export async function calibrate(browser) {
    const page = await browser.newPage();
    try {
        await page.goto("about:blank");
        const hostMs = await workloadMs(page);
        const rates = Object.fromEntries(
            Object.entries(CPUS).map(([name, ms]) => {
                const rate = ms === null ? 1 : ms / hostMs;
                return [
                    name,
                    {
                        workload_ms: ms ?? hostMs,
                        rate: Math.max(1, rate),
                        slower_than_host: rate >= 1,
                    },
                ];
            }),
        );
        return { host_workload_ms: hostMs, cpus: rates };
    } finally {
        await page.close();
    }
}

/** A comma-separated list from the environment, or the default. */
export function listEnv(name, d) {
    return (process.env[name] ?? d)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
