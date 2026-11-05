/**
 * Timed document load for the performance work (Doenet/DoenetML#2126).
 *
 * Wraps `createTestCore` to report the wall-clock load time, the per-phase
 * timings the core records on its initial build (`core.loadPhaseTimings`,
 * Doenet/DoenetML#2026), and the call counts and times of the Rust
 * resolver's methods across the WASM boundary (the wrapper pattern from
 * Doenet/DoenetML#2124).
 */
import { PublicDoenetMLCore as PublicDoenetMLCoreRust } from "lib-doenetml-worker";
import { createTestCore } from "../utils/test-core";

export type CallTimings = Record<
    string,
    { calls: number; totalMs: number; maxMs: number }
>;

export type LoadMeasurement = {
    core: Awaited<ReturnType<typeof createTestCore>>;
    /** Wall-clock milliseconds of `createTestCore`, parsing included. */
    loadMs: number;
    /** `core.loadPhaseTimings`: milliseconds per phase of the initial build. */
    phases: Record<string, number>;
    /** Per resolver method, over the whole load. */
    resolver: CallTimings;
};

/** The resolver methods the JavaScript core calls while loading. */
const RESOLVER_METHODS = [
    "set_source",
    "return_normalized_dast_root",
    "add_nodes_to_resolver",
    "replace_index_resolutions_in_resolver",
    "delete_nodes_from_resolver",
    "resolve_path",
    "update_root_names",
];

type CreateTestCoreOptions = Parameters<typeof createTestCore>[0];

/**
 * Load `doenetML` through `createTestCore` and measure it. The resolver
 * wrappers are installed on the WASM class's prototype for the duration of
 * the call and removed afterwards, so measurements do not nest.
 */
export async function measureLoad(
    doenetML: string,
    options: Omit<CreateTestCoreOptions, "doenetML"> = {},
): Promise<LoadMeasurement> {
    const resolver: CallTimings = {};
    const proto: any = PublicDoenetMLCoreRust.prototype;
    const originals: Record<string, any> = {};
    for (const name of RESOLVER_METHODS) {
        if (typeof proto[name] !== "function") {
            continue;
        }
        originals[name] = proto[name];
        proto[name] = function (this: any, ...args: any[]) {
            const t0 = performance.now();
            try {
                return originals[name].apply(this, args);
            } finally {
                const ms = performance.now() - t0;
                const entry = (resolver[name] ??= {
                    calls: 0,
                    totalMs: 0,
                    maxMs: 0,
                });
                entry.calls++;
                entry.totalMs += ms;
                if (ms > entry.maxMs) {
                    entry.maxMs = ms;
                }
            }
        };
    }

    const t0 = performance.now();
    try {
        const core = await createTestCore({ doenetML, ...options });
        const loadMs = performance.now() - t0;
        const inner: any = core.core.core;
        const phases: Record<string, number> = {
            ...(inner?.loadPhaseTimings ?? {}),
        };
        return { core, loadMs, phases, resolver };
    } finally {
        for (const name of Object.keys(originals)) {
            proto[name] = originals[name];
        }
    }
}
