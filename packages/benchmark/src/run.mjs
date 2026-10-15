// The Node driver: every (core, fixture) in its own process with a 60 s
// budget, results appended as JSON lines to results/raw/node-<date>.jsonl.
//
//   node src/run.mjs [--cores javascript,rust,cells] [--fixtures a,b] [--out file]
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { listFixtures, packageRoot, repoRoot } from "./fixtures.mjs";
import { ensureBundle } from "../scripts/bundle-driver.mjs";

const TIMEOUT_MS = 60_000;
const args = Object.fromEntries(
    process.argv.slice(2).map((a) => { const [k, v = "true"] = a.replace(/^--/, "").split("="); return [k, v]; }),
);
const cores = (args.cores ?? "javascript,rust,cells").split(",");
const only = args.fixtures ? args.fixtures.split(",") : null;
const fixtures = listFixtures().filter((m) => !only || only.includes(m.name));
// Local date, so an evening run does not land on tomorrow's file.
const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
const out = resolve(packageRoot, args.out ?? `results/raw/node-${date}.jsonl`);
mkdirSync(resolve(out, ".."), { recursive: true });
const commit = execSync("git rev-parse --short HEAD", { cwd: repoRoot, encoding: "utf8" }).trim();
const jsWorker = resolve(repoRoot, "packages/doenetml-worker-javascript");
// One prebundled driver per sweep (scripts/bundle-driver.mjs).
const bundle = await ensureBundle();

function measure(core, fixture) {
    return new Promise((done) => {
        // Node flags go on the command line: `--stack-size` (the parser recurses
        // once per sibling) is not allowed in NODE_OPTIONS.
        const nodeFlags = ["--expose-gc", "--max-old-space-size=8192", "--stack-size=65500"];
        const child = spawn(process.execPath, [...nodeFlags, bundle, fixture], {
            cwd: jsWorker,
            env: { ...process.env, DOENET_TEST_CORE: core },
            stdio: ["ignore", "pipe", "pipe"],
        });
        let buf = "", stderr = "", stage = "start", result = null;
        child.stdout.on("data", (d) => {
            buf += d;
            for (const line of buf.split("\n").slice(0, -1)) {
                const s = line.trim().replace(/^\x1b\[\d+m'|'\x1b\[\d+m$/g, "");
                if (!s.startsWith("{")) continue;
                try {
                    const j = JSON.parse(s);
                    if (j.progress) stage = j.progress;
                    else {
                        result = j;
                        if (j.error_components !== "unchecked") setTimeout(() => child.kill("SIGKILL"), 2000).unref();
                    }
                } catch { /* not ours */ }
            }
            buf = buf.slice(buf.lastIndexOf("\n") + 1);
        });
        child.stderr.on("data", (d) => { stderr += d; });
        const timer = setTimeout(() => child.kill("SIGKILL"), TIMEOUT_MS);
        child.on("close", (code, signal) => {
            clearTimeout(timer);
            if (signal === "SIGKILL" && result?.error_components === "unchecked") result.timed_out_at = stage;
            else if (signal === "SIGKILL" && !result) result = { core, fixture, status: "timeout", stage, timeout_ms: TIMEOUT_MS };
            else if (!result) result = { core, fixture, status: "error", stage, message: (stderr.trim().split("\n").slice(-3).join(" | ") || `exit ${code}`).slice(0, 500) };
            done(result);
        });
    });
}

for (const m of fixtures) {
    for (const core of cores) {
        const t = Date.now();
        const r = { date, commit, ...(await measure(core, m.name)), wall_ms: 0 };
        r.wall_ms = Date.now() - t;
        appendFileSync(out, JSON.stringify(r) + "\n");
        const brief = r.status === "ok"
            ? `load ${r.load_ms.toFixed(1)} ms, ${r.steps.map((s) => `${s.label} ${s.p50_ms.toFixed(2)} ms`).join(", ")}${r.structural ? `, structural ${r.structural[0].p50_ms.toFixed(1)} ms` : ""}`
            : `${r.status}${r.stage ? ` at ${r.stage}` : ""}${r.message ? `: ${r.message.slice(0, 120)}` : ""}`;
        console.log(`${m.name.padEnd(20)} ${core.padEnd(10)} ${brief}`);
    }
}
console.log(`wrote ${out}`);
