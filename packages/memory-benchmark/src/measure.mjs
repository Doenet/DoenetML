/**
 * Memory benchmark for embedded DoenetML.
 *
 * Serves the built `@doenet/standalone` bundle locally, loads it in headless
 * Chromium under several embedding scenarios, and reports memory per scenario:
 *
 *   - blank      baseline browser with no DoenetML
 *   - direct-N   N viewers sharing one realm (renderDoenetViewerToContainer)
 *   - iframe-N   N viewers in one iframe each (as @doenet/doenetml-iframe
 *                and PreTeXt embed them)
 *
 * Primary metric (Linux only): PSS summed over the whole browser process
 * tree, read from /proc/<pid>/smaps_rollup. PSS divides shared pages among
 * the processes sharing them, so the total is not inflated by shared
 * memory the way summed RSS would be. On other platforms only the
 * renderer-reported JS heap is available.
 *
 * The baseline numbers in https://github.com/Doenet/DoenetML/issues/1441
 * were produced with this harness.
 *
 * Document-scaling scenarios (`repeat-N`) render one viewer with a generated
 * document containing N `<repeatForSequence>` iterations (~5 components plus
 * strings each), so worker-side costs that grow with component count show up.
 *
 * Usage:
 *   npm run benchmark -w @doenet/memory-benchmark
 *   node src/measure.mjs [--counts 1,4] [--sizes 25,250]
 *                        [--doenetml path/to/doc.doenetml]
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { execSync } from "node:child_process";
import { chromium } from "playwright";

const HERE = import.meta.dirname;
const STANDALONE_DIST = path.resolve(HERE, "../../standalone/dist");
const PAGES = path.resolve(HERE, "../pages");

const DEFAULT_DOENETML = `
<p>What is <m>1+1</m>? <answer name="ans"><mathInput/>2</answer></p>
<graph size="small"><point name="P">(1,2)</point></graph>
<p>Point coords: $P.coords</p>
<section><title>More</title>
  <p><mathInput name="mi" /> squared is <math simplify>$mi^2</math></p>
</section>`;

// Settle times: MathJax typesetting and worker allocation continue after the
// cores report initialized, and we want post-GC steady state, not the peak.
const SETTLE_MS = 10_000;
const POST_GC_MS = 3_000;

/**
 * Generate a document with n repeatForSequence iterations. Each iteration
 * contributes a <p>, a <math>, two <number>s, and a <boolean> (plus strings),
 * so component count scales at roughly 5n. This exercises the document-scaling
 * worker costs tracked in DoenetML issues #1428-#1431.
 */
function makeRepeatDoc(n) {
    return `
<p>Document with ${n} repeat iterations.</p>
<repeatForSequence name="rep" from="1" to="${n}" valueName="i">
  <p>Item <number>$i</number>:
    <math simplify name="m">$i x + $i^2</math>,
    value <number name="v">$i^2 + $i</number>,
    even: <boolean name="e">mod($v,2) = 0</boolean>
  </p>
</repeatForSequence>`;
}

function parseArgs() {
    const args = process.argv.slice(2);
    const opts = {
        counts: [1, 4],
        sizes: [25, 250],
        doenetML: DEFAULT_DOENETML,
    };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--counts") {
            opts.counts = args[++i].split(",").filter(Boolean).map(Number);
        } else if (args[i] === "--sizes") {
            opts.sizes = args[++i].split(",").filter(Boolean).map(Number);
        } else if (args[i] === "--doenetml") {
            opts.doenetML = fs.readFileSync(args[++i], "utf8");
        } else {
            console.error(`Unknown argument: ${args[i]}`);
            process.exit(1);
        }
    }
    return opts;
}

/** Serve the standalone dist and the scenario pages on an ephemeral port. */
function startServer(docs) {
    const MIME = {
        ".js": "text/javascript",
        ".css": "text/css",
        ".html": "text/html",
        ".map": "application/json",
        ".json": "application/json",
        ".wasm": "application/wasm",
    };
    const server = http.createServer((req, res) => {
        const url = new URL(req.url, "http://localhost");
        if (url.pathname === "/doenetml-source") {
            // Scenario pages fetch their document source from here; ?doc=
            // selects among the default and generated repeat documents.
            const doc = url.searchParams.get("doc") ?? "default";
            if (!(doc in docs)) {
                res.writeHead(404);
                res.end("unknown doc: " + doc);
                return;
            }
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(docs[doc]);
            return;
        }
        const root = url.pathname.startsWith("/standalone/")
            ? STANDALONE_DIST
            : PAGES;
        const rel = url.pathname.replace(/^\/(standalone\/)?/, "");
        const filePath = path.join(root, rel);
        if (
            !filePath.startsWith(root) ||
            !fs.existsSync(filePath) ||
            fs.statSync(filePath).isDirectory()
        ) {
            res.writeHead(404);
            res.end("not found: " + url.pathname);
            return;
        }
        res.writeHead(200, {
            "content-type":
                MIME[path.extname(filePath)] ?? "application/octet-stream",
            "cache-control": "no-store",
        });
        fs.createReadStream(filePath).pipe(res);
    });
    return new Promise((resolve) => {
        server.listen(0, "127.0.0.1", () => {
            resolve({ server, port: server.address().port });
        });
    });
}

/** All pids in the process tree rooted at the given pids. */
function descendants(rootPids) {
    const out = execSync("ps -eo pid=,ppid=").toString().trim().split("\n");
    const children = new Map();
    for (const line of out) {
        const [pid, ppid] = line.trim().split(/\s+/).map(Number);
        if (!children.has(ppid)) children.set(ppid, []);
        children.get(ppid).push(pid);
    }
    const seen = new Set(rootPids);
    const queue = [...rootPids];
    while (queue.length) {
        const p = queue.shift();
        for (const c of children.get(p) ?? []) {
            if (!seen.has(c)) {
                seen.add(c);
                queue.push(c);
            }
        }
    }
    return [...seen];
}

/** Find browser processes by the unique user-data-dir in their cmdline. */
function findPidsByMarker(marker) {
    const pids = [];
    for (const entry of fs.readdirSync("/proc")) {
        if (!/^\d+$/.test(entry)) continue;
        try {
            const cmdline = fs.readFileSync(`/proc/${entry}/cmdline`, "utf8");
            if (cmdline.includes(marker)) pids.push(Number(entry));
        } catch {
            // process exited between listing and reading
        }
    }
    return pids;
}

function pssByProcessType(pids) {
    const byType = {};
    let total = 0;
    for (const pid of pids) {
        try {
            const rollup = fs.readFileSync(`/proc/${pid}/smaps_rollup`, "utf8");
            const mb =
                parseInt(rollup.match(/^Pss:\s+(\d+) kB/m)?.[1] ?? "0", 10) /
                1024;
            let type = "browser";
            try {
                const cmdline = fs
                    .readFileSync(`/proc/${pid}/cmdline`, "utf8")
                    .replaceAll("\0", " ");
                // e.g. --type=renderer or --type=gpu-process (note the hyphen)
                const m = cmdline.match(/--type=([\w-]+)/);
                if (m) type = m[1];
            } catch {
                // cmdline unreadable; leave type as "browser"
            }
            byType[type] = (byType[type] ?? 0) + mb;
            total += mb;
        } catch {
            // process exited or not readable
        }
    }
    for (const k of Object.keys(byType)) byType[k] = Math.round(byType[k]);
    return { totalPssMB: Math.round(total), byType };
}

async function runScenario({ name, url, expectInitialized }, idx) {
    const userDataDir = path.join(
        os.tmpdir(),
        `doenet-membench-${process.pid}-${idx}`,
    );
    fs.rmSync(userDataDir, { recursive: true, force: true });
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    try {
        const page = context.pages()[0] ?? (await context.newPage());
        await page.goto(url, { waitUntil: "load", timeout: 60_000 });
        // Each scenario page sets window.__done once its viewers are created
        // and counts cores reporting ready via initializedCallback.
        await page.waitForFunction(() => window.__done === true, null, {
            timeout: 120_000,
        });
        await page.waitForFunction(
            (expected) => window.__initializedCount >= expected,
            expectInitialized ?? 0,
            { timeout: 300_000 },
        );
        await page.waitForTimeout(SETTLE_MS);

        // Force a GC in the main realm so we measure retained, not garbage.
        const client = await context.newCDPSession(page);
        try {
            await client.send("HeapProfiler.enable");
            await client.send("HeapProfiler.collectGarbage");
        } catch {
            // GC is best-effort; ignore if the CDP domain is unavailable
        }
        await page.waitForTimeout(POST_GC_MS);

        const result = {
            name,
            workers: page.workers().length,
            frames: page.frames().length,
            mainRealmJsHeapMB: await page.evaluate(() =>
                performance.memory
                    ? Math.round(performance.memory.usedJSHeapSize / 1048576)
                    : -1,
            ),
        };
        if (process.platform === "linux") {
            const pids = descendants(findPidsByMarker(userDataDir));
            Object.assign(result, pssByProcessType(pids));
        }
        return result;
    } finally {
        await context.close();
        fs.rmSync(userDataDir, { recursive: true, force: true });
    }
}

const opts = parseArgs();

if (!fs.existsSync(path.join(STANDALONE_DIST, "doenet-standalone.js"))) {
    console.error(
        `Built standalone bundle not found at ${STANDALONE_DIST}.\n` +
            "Run: npm run build -w @doenet/standalone",
    );
    process.exit(1);
}
if (process.platform !== "linux") {
    console.warn(
        "Not on Linux: /proc-based PSS is unavailable, reporting only " +
            "the main realm's JS heap. Worker/iframe memory will NOT be " +
            "included — run on Linux for the full numbers.",
    );
}

const docs = { default: opts.doenetML };
for (const size of opts.sizes) {
    docs[`repeat-${size}`] = makeRepeatDoc(size);
}

const { server, port } = await startServer(docs);
const base = `http://127.0.0.1:${port}`;
const scenarios = [
    { name: "blank", url: `${base}/blank.html`, expectInitialized: 0 },
    ...opts.counts.flatMap((n) => [
        {
            name: `direct-${n}`,
            url: `${base}/direct.html?n=${n}`,
            expectInitialized: n,
        },
        {
            name: `iframe-${n}`,
            url: `${base}/iframes.html?n=${n}`,
            expectInitialized: n,
        },
    ]),
    // Document-scaling: one viewer, generated large document.
    ...opts.sizes.map((size) => ({
        name: `repeat-${size}`,
        url: `${base}/direct.html?n=1&doc=repeat-${size}`,
        expectInitialized: 1,
    })),
];

const results = [];
for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i];
    process.stderr.write(`Running ${s.name} ...\n`);
    try {
        results.push(await runScenario(s, i));
    } catch (e) {
        results.push({ name: s.name, error: String(e).slice(0, 300) });
    }
}
server.close();

console.log(JSON.stringify(results, null, 2));

// Human-readable summary with per-instance marginal costs.
const byName = Object.fromEntries(results.map((r) => [r.name, r]));
console.error("\nscenario     totalPSS(MB)  jsHeap(MB)  workers  frames");
for (const r of results) {
    console.error(
        `${r.name.padEnd(12)} ${String(r.totalPssMB ?? "-").padStart(10)}  ${String(
            r.mainRealmJsHeapMB ?? "-",
        ).padStart(10)}  ${String(r.workers ?? "-").padStart(7)}  ${String(
            r.frames ?? "-",
        ).padStart(6)}`,
    );
}
const [lo, hi] = opts.counts;
if (hi > lo) {
    for (const kind of ["direct", "iframe"]) {
        const a = byName[`${kind}-${lo}`];
        const b = byName[`${kind}-${hi}`];
        if (a?.totalPssMB != null && b?.totalPssMB != null) {
            const marginal = Math.round(
                (b.totalPssMB - a.totalPssMB) / (hi - lo),
            );
            console.error(
                `marginal cost per additional ${kind} instance: ~${marginal} MB`,
            );
        }
    }
}
const small = byName["direct-1"];
for (const size of opts.sizes) {
    const big = byName[`repeat-${size}`];
    if (small?.totalPssMB != null && big?.totalPssMB != null) {
        console.error(
            `document-scaling cost of repeat-${size} (~${5 * size} components) ` +
                `over the small document: ~${big.totalPssMB - small.totalPssMB} MB`,
        );
    }
}
