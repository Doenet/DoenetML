// The Node driver: one comparison run. Every (core, fixture) is measured
// in its own process (`src/measure-one.ts`), with 120 s for the load and
// 15 s for each tick and each stage after; the records go to `results/runs/<id>/node.json` beside the
// run's manifest. See METHOD.md.
//
//   node src/run.mjs --machine=<id> [--cores=javascript,rust,cells]
//                    [--fixtures=depth,breadth-1000,homework]
//
// `--out=<file>` appends the records to that file instead, outside any
// run: a scratch measurement, such as `scripts/perf-diff.sh` makes.
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { listFixtures, repoRoot } from "./fixtures.mjs";
import { openRun, appendRecord } from "./results.mjs";
import { ensureBundle } from "../scripts/bundle-driver.mjs";

/** The longest the stages up to the load may take, together. */
export const LOAD_TIMEOUT_MS = 120_000;
/** The longest a tick, or a stage after the ticks, may take. */
export const STEP_TIMEOUT_MS = 15_000;
const LOAD_STAGES = new Set(["start", "generate", "parse", "load"]);
/**
 * Stages after the ticks, which are not timed: the value check (one more
 * tick, then reading the state), the saved state, the error count. They
 * have the load's limit, since reading a large document's state is slow,
 * and a timeout there costs only their fields.
 */
const LATE_STAGES = new Set(["check", "state", "errors"]);

const args = Object.fromEntries(
    process.argv.slice(2).map((a) => {
        const [k, v = "true"] = a.replace(/^--/, "").split("=");
        return [k, v];
    }),
);
const machine = args.machine ?? process.env.BENCH_MACHINE;
if (!args.out && (!machine || !/^[a-z0-9][a-z0-9-]*$/.test(machine))) {
    console.error(
        "name the machine: --machine=<id> (or BENCH_MACHINE), lowercase letters, digits and dashes",
    );
    process.exit(1);
}
const cores = (args.cores ?? "javascript,rust,cells").split(",");
// A fixture filter names fixtures (`depth-1000`) or whole shapes (`depth`).
const only = args.fixtures ? args.fixtures.split(",") : null;
const fixtures = listFixtures().filter(
    (m) => !only || only.includes(m.name) || only.includes(m.shape),
);
const jsWorker = resolve(repoRoot, "packages/doenetml-worker-javascript");
const bundle = await ensureBundle();
const run = args.out
    ? { dir: null, records: resolve(args.out) }
    : openRun({
          machine,
          cores,
          fixtures: fixtures.map((m) => m.name),
          load_timeout_ms: LOAD_TIMEOUT_MS,
          step_timeout_ms: STEP_TIMEOUT_MS,
      });

/**
 * Measure `fixture` in `core`. The process reports each stage and tick as
 * it ends; a gap between two lines longer than the stage allows
 * (`LOAD_TIMEOUT_MS` up to the load, `STEP_TIMEOUT_MS` from the first
 * tick) kills it, and the record keeps what was reported, with the stage
 * it timed out in.
 */
function measure(core, fixture) {
    return new Promise((done) => {
        // `--stack-size` (the parser recurses once per sibling) is not
        // allowed in NODE_OPTIONS.
        const nodeFlags = [
            "--expose-gc",
            "--max-old-space-size=8192",
            "--stack-size=65500",
        ];
        const child = spawn(process.execPath, [...nodeFlags, bundle, fixture], {
            cwd: jsWorker,
            env: { ...process.env, DOENET_TEST_CORE: core },
            stdio: ["ignore", "pipe", "pipe"],
        });
        const record = { core, fixture, status: "ok" };
        const samples = [];
        let buf = "",
            stderr = "",
            stage = "start",
            finished = false,
            timer;
        const arm = () => {
            clearTimeout(timer);
            timer = setTimeout(
                () => {
                    if (LATE_STAGES.has(stage)) record.late_timeout = stage;
                    else {
                        record.status = "timeout";
                        record.stage = stage;
                    }
                    finished = LATE_STAGES.has(stage);
                    child.kill("SIGKILL");
                },
                LOAD_STAGES.has(stage) || LATE_STAGES.has(stage)
                    ? LOAD_TIMEOUT_MS
                    : STEP_TIMEOUT_MS,
            );
        };
        arm();
        child.stdout.on("data", (d) => {
            buf += d;
            for (const line of buf.split("\n").slice(0, -1)) {
                if (!line.startsWith("{")) continue;
                let j;
                try {
                    j = JSON.parse(line);
                } catch {
                    continue;
                }
                if (j.progress) stage = j.progress;
                else if (j.part) Object.assign(record, j.part);
                else if ("sample" in j) samples.push(j.sample);
                else if (j.done) finished = true;
                arm();
            }
            buf = buf.slice(buf.lastIndexOf("\n") + 1);
        });
        child.stderr.on("data", (d) => {
            stderr += d;
        });
        child.on("close", (code, signal) => {
            clearTimeout(timer);
            if (samples.length) record.samples_ms = samples;
            if (record.status === "ok" && !finished) {
                record.status = "error";
                record.stage = stage;
                record.message = (
                    stderr.trim().split("\n").slice(-3).join(" | ") ||
                    (signal ? `killed by ${signal}` : `exit ${code}`)
                ).slice(0, 500);
            }
            if (record.status !== "ok" && !record.stage) record.stage = stage;
            done(record);
        });
    });
}

const median = (xs) => [...xs].sort((a, b) => a - b)[xs.length >> 1];

function brief(r) {
    const ms = (x) => (x < 10 ? x.toFixed(2) : x.toFixed(0));
    const parts = [];
    if (r.load_ms != null) parts.push(`load ${ms(r.load_ms)} ms`);
    if (r.samples_ms) parts.push(`tick ${ms(median(r.samples_ms))} ms`);
    if (r.check && !r.check.ok) parts.push("CHECK FAILED");
    if (r.status !== "ok")
        parts.push(
            `${r.status} at ${r.stage}${r.message ? `: ${r.message.slice(0, 100)}` : ""}`,
        );
    return parts.join(", ");
}

// The floor first, for every core, then every fixture across the cores in
// turn, so a slow stretch of the machine falls on all of them.
for (const name of ["floor", ...fixtures.map((m) => m.name)]) {
    for (const core of cores) {
        const t = Date.now();
        const r = await measure(core, name);
        r.wall_ms = Date.now() - t;
        appendRecord(run.records, r);
        console.log(`${name.padEnd(18)} ${core.padEnd(10)} ${brief(r)}`);
    }
}
console.log(`wrote ${run.dir ?? run.records}`);
