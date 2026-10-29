// What the layers read from the environment. Every `BENCH_*` variable is
// listed in README.md beside the layer that reads it; the machine's id
// (`BENCH_MACHINE`) is checked by `openRun` in `results.mjs`.

/**
 * The comma-separated list in `name`, or `fallback` when it is unset.
 * @param {string} name
 * @param {string} fallback
 * @returns {string[]}
 */
export function listEnv(name, fallback) {
    return (process.env[name] ?? fallback)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
