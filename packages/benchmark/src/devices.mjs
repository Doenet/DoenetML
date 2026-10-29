// The load layer's devices (browser/load.spec.ts): what a page is loaded
// on, as a CPU class, a network and a screen. Chromium's CPU throttling
// slows the page's threads by a factor of the machine the suite runs on,
// so the same factor is a different phone on a different machine. A CPU
// class therefore names a speed, not a factor: how long a fixed JavaScript
// workload (`WORKLOAD`) takes on that class. At the start of a run each
// class's factor is found by timing the workload throttled until it takes
// the class's time (`calibrate`). See METHOD.md, The load layer.

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

/**
 * How the workload is timed. The machines the suite runs on are shared,
 * and their speed moves by several percent from one moment to the next,
 * so one timing is not the host's speed: the workload runs `ROUNDS`
 * times, each in a new page, `REPEATS` times in each, and the host's time
 * is the median of the rounds' fastest repetitions (the fastest being the
 * one least disturbed by garbage collection and other processes).
 */
const ROUNDS = 9;
const REPEATS = 9;
/** Rounds of each throttled timing while a class's factor is searched. */
const SEARCH_ROUNDS = 5;
/** The factor is searched until the class's time is this close... */
const TOLERANCE = 0.05;
/** ...or for this many steps. */
const MAX_STEPS = 5;

/** The workload's fastest repetition in a new page throttled by `rate`. */
async function fastestMs(browser, rate, repeats) {
    const page = await browser.newPage();
    try {
        await page.goto("about:blank");
        if (rate > 1) {
            const cdp = await page.context().newCDPSession(page);
            await cdp.send("Emulation.setCPUThrottlingRate", { rate });
        }
        return await page.evaluate(
            `(() => {
                const W = ${WORKLOAD};
                W();
                let best = Infinity;
                for (let i = 0; i < ${repeats}; i++) {
                    const t = performance.now();
                    W();
                    best = Math.min(best, performance.now() - t);
                }
                return best;
            })()`,
        );
    } finally {
        await page.close();
    }
}

/**
 * The workload's time throttled by `rate` (1: the host as it is): the
 * median of `rounds` rounds' fastest repetitions, and every round's, to
 * show how much the machine moved while it was timed.
 */
export async function workloadMs(
    browser,
    rate = 1,
    rounds = ROUNDS,
    repeats = REPEATS,
) {
    const times = [];
    for (let r = 0; r < rounds; r++)
        times.push(await fastestMs(browser, rate, repeats));
    return { ms: median(times), rounds: times };
}

/**
 * The factor at which the workload takes `targetMs`. Throttling does not
 * slow every kind of work by its factor: plain arithmetic, about so, but
 * the workload's allocation (as a page's scripts allocate) by up to half
 * as much again, so the host's time times the factor is not the
 * throttled time. The search starts there and corrects the factor by the
 * ratio of target to measured time until they agree within TOLERANCE.
 * Each throttled timing is noisy (throttling slices the thread's time), so
 * the factor kept is not the last step's but the one a fit through every
 * step gives (time as a power of the factor, least squares on the logs).
 */
async function searchRate(browser, targetMs, hostMs) {
    let rate = Math.max(1, targetMs / hostMs);
    const steps = [];
    for (let i = 0; i < MAX_STEPS; i++) {
        const { ms } = await workloadMs(browser, rate, SEARCH_ROUNDS, 5);
        steps.push({ rate, ms });
        if (Math.abs(ms / targetMs - 1) <= TOLERANCE) break;
        const next = Math.max(1, (rate * targetMs) / ms);
        if (next === rate) break;
        rate = next;
    }
    const fitted = fitRate(steps, targetMs);
    return { rate: fitted ?? steps.at(-1).rate, steps };
}

/** The factor at which a power law through `steps` reaches `targetMs`, or
 * null when the steps do not determine one. */
function fitRate(steps, targetMs) {
    if (steps.length < 2) return null;
    const xs = steps.map((s) => Math.log(s.rate));
    const ys = steps.map((s) => Math.log(s.ms));
    const mx = xs.reduce((a, b) => a + b) / xs.length;
    const my = ys.reduce((a, b) => a + b) / ys.length;
    let sxy = 0;
    let sxx = 0;
    for (let i = 0; i < xs.length; i++) {
        sxy += (xs[i] - mx) * (ys[i] - my);
        sxx += (xs[i] - mx) ** 2;
    }
    if (sxx === 0 || sxy <= 0) return null;
    const k = sxy / sxx;
    return Math.max(1, Math.exp(mx + (Math.log(targetMs) - my) / k));
}

/**
 * Time the workload on the host and find each CPU class's throttling
 * factor: the one at which the workload takes the class's time
 * (`workload_ms`), with the search's `steps`. The factor is then checked:
 * `achieved_ms` is the workload's time at it, timed afresh. A class
 * faster than the host runs at the host's speed, and says so in
 * `slower_than_host`.
 */
export async function calibrate(browser) {
    const host = await workloadMs(browser);
    const cpus = {};
    for (const [name, ms] of Object.entries(CPUS)) {
        if (ms === null || ms <= host.ms) {
            cpus[name] = {
                workload_ms: ms ?? host.ms,
                rate: 1,
                slower_than_host: ms === null,
                achieved_ms: host.ms,
                steps: [],
            };
            continue;
        }
        const { rate, steps } = await searchRate(browser, ms, host.ms);
        cpus[name] = {
            workload_ms: ms,
            rate,
            slower_than_host: true,
            achieved_ms: (await workloadMs(browser, rate, SEARCH_ROUNDS, 5)).ms,
            steps,
        };
    }
    return { host_workload_ms: host.ms, host_rounds_ms: host.rounds, cpus };
}

/** The host's time again, after a run: whether the machine's speed moved
 * while it ran, and so how far off the factors may have been by its end. */
export async function recheck(browser) {
    const host = await workloadMs(browser);
    return { host_workload_ms: host.ms, host_rounds_ms: host.rounds };
}
