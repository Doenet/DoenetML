// Runs: one directory per run, `results/runs/<id>/`, committed.
// `manifest.json` says where and on what the run was measured; each layer
// writes its records beside it (`node.json`, `browser.json`, `bundle.json`,
// `trace.json`), one JSON array each, appended as measurements end so an
// interrupted run keeps what it measured. The id is
// `<date>-<machine>-<commit>`, with `-dirty` for uncommitted changes.
import { execSync } from "node:child_process";
import {
    existsSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    writeFileSync,
} from "node:fs";
import os from "node:os";
import { resolve } from "node:path";
import { packageRoot, repoRoot } from "./fixtures.mjs";

export const runsDir = resolve(packageRoot, "results/runs");

/** The records in a results file, or none if it does not exist. */
export function readRecords(file) {
    return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : [];
}

/**
 * Append one record to a results file, creating it if needed, one record
 * per line: indented, the records would be mostly whitespace, and every
 * run is committed.
 */
export function appendRecord(file, record) {
    const records = readRecords(file);
    records.push(record);
    writeFileSync(
        file,
        `[\n${records.map((r) => JSON.stringify(r)).join(",\n")}\n]\n`,
    );
}

/** Today's date in local time, so an evening run does not land on tomorrow. */
export function localDate() {
    return new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 10);
}

function git(cmd) {
    return execSync(`git ${cmd}`, { cwd: repoRoot, encoding: "utf8" }).trim();
}

/** What a run was measured on, beyond the id the runner gave the machine. */
function hardware() {
    const cpus = os.cpus();
    return {
        cpu: cpus[0]?.model.trim() ?? "unknown",
        cores: cpus.length,
        memory_bytes: os.totalmem(),
        os: `${os.type()} ${os.release()} ${os.arch()}`,
        node: process.version,
    };
}

/**
 * How each core was built for the run. The defaults are the builds METHOD.md
 * asks for; a runner who built otherwise says so in `BENCH_BUILD_<CORE>`.
 */
function builds(cores) {
    const defaults = {
        javascript: "source, bundled by scripts/bundle-driver.mjs",
        rust: "wasm-pack --release, without logging features",
        cells: "wasm-pack --release (npm run build -w packages/cells-core)",
    };
    return Object.fromEntries(
        cores.map((c) => [
            c,
            process.env[`BENCH_BUILD_${c.toUpperCase()}`] ??
                defaults[c] ??
                "unrecorded",
        ]),
    );
}

/**
 * Start a run's layer `layer` (`node`, `browser`, `bundle`, `trace`): the
 * run's directory and manifest, created on its first layer, and an empty
 * records file. A layer
 * run again the same day at the same commit replaces its records. A caller
 * that opens the same layer more than once in one invocation (Playwright
 * loads the spec again in each worker it starts, and starts a new one after
 * a test times out) passes the same `session` each time, and keeps the
 * records already written.
 */
export function openRun({ machine, cores, layer = "node", session, ...rest }) {
    const commit = git("rev-parse --short HEAD");
    // Changes to the results themselves do not make the measured code dirty.
    const dirty = git("status --porcelain -- . ':!packages/benchmark/results'")
        .split("\n")
        .some((l) => l.trim());
    const date = localDate();
    const id = `${date}-${machine}-${commit}${dirty ? "-dirty" : ""}`;
    const dir = resolve(runsDir, id);
    mkdirSync(dir, { recursive: true });
    const manifestPath = resolve(dir, "manifest.json");
    const manifest = existsSync(manifestPath)
        ? JSON.parse(readFileSync(manifestPath, "utf8"))
        : {
              id,
              date,
              machine,
              commit,
              dirty,
              hardware: hardware(),
              builds: builds(cores),
              layers: {},
          };
    const records = resolve(dir, `${layer}.json`);
    const resumed =
        session !== undefined &&
        manifest.layers[layer]?.session === session &&
        existsSync(records);
    if (!resumed) {
        manifest.layers[layer] = {
            cores,
            ...rest,
            ...(session !== undefined && { session }),
            started: new Date().toISOString(),
        };
        writeFileSync(manifestPath, JSON.stringify(manifest, null, 4) + "\n");
        writeFileSync(records, "[]\n");
    }
    return { id, dir, records, manifest };
}

/** Every run, newest first: its manifest and the records of each layer. */
export function listRuns() {
    if (!existsSync(runsDir)) return [];
    return readdirSync(runsDir)
        .filter((d) => existsSync(resolve(runsDir, d, "manifest.json")))
        .map((d) => {
            const dir = resolve(runsDir, d);
            const manifest = JSON.parse(
                readFileSync(resolve(dir, "manifest.json"), "utf8"),
            );
            const layers = Object.fromEntries(
                Object.keys(manifest.layers).map((l) => [
                    l,
                    readRecords(resolve(dir, `${l}.json`)),
                ]),
            );
            return { dir, manifest, layers };
        })
        .sort(
            (a, b) =>
                b.manifest.date.localeCompare(a.manifest.date) ||
                lastStarted(b.manifest).localeCompare(
                    lastStarted(a.manifest),
                ) ||
                b.manifest.id.localeCompare(a.manifest.id),
        );
}

/**
 * When a run's latest layer started (ISO), or "" if none says: orders runs
 * made on one day, whose ids differ only by commit hash, which says nothing
 * of which came last.
 */
function lastStarted(manifest) {
    return Object.values(manifest.layers)
        .map((l) => l.started ?? "")
        .reduce((x, y) => (y > x ? y : x), "");
}
