// Measure one fixture in one core and print the result as a JSON line.
//
// Runs under vite-node from packages/doenetml-worker-javascript, whose test
// utilities give every core the same interface (DOENET_TEST_CORE selects
// it). `src/run.mjs` spawns this once per (core, fixture) with a 60 s
// budget, so a slow document cannot stall the sweep and each memory figure
// is a fresh process. Progress lines (`{"progress": ...}`) precede the
// result so a timeout can say how far it got.
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { createTestCore } from "../../doenetml-worker-javascript/src/test/utils/test-core";
import { writeSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fixtureText, loadFixture } from "./fixtures.mjs";

const core = process.env.DOENET_TEST_CORE || "javascript";
const fixtureName = process.argv[2];
const budgetMs = Number(process.env.BENCH_STEP_BUDGET_MS ?? 20_000);
const maxRounds = Number(process.env.BENCH_ROUNDS ?? 20);

type Step = {
    action: string;
    target: string;
    x?: number;
    y?: number;
    value?: string;
    /** "text" for a text input; a math input otherwise. */
    kind?: "text" | "math";
};

/** The core could not name the manifest's target: a gap in that core, like the adapters' own. */
class TargetGap extends Error {}

// Synchronous writes: stdout to a pipe is asynchronous in Node, and a long
// synchronous stretch of core work after a console.log would hold the line
// back until the budget killed the process.
const emit = (o: unknown) => writeSync(1, JSON.stringify(o) + "\n");
const progress = (stage: string) => emit({ progress: stage });
const gc = () => (globalThis as any).gc?.();
const now = () => performance.now();

function quantiles(xs: number[]) {
    const s = [...xs].sort((a, b) => a - b);
    const q = (p: number) =>
        s[Math.min(s.length - 1, Math.floor(p * s.length))];
    return {
        n: s.length,
        p50_ms: q(0.5),
        p90_ms: q(0.9),
        max_ms: s[s.length - 1],
    };
}

/**
 * Wasm linear memory. The Rust and cells adapters report their own module's;
 * the JS core has none of its own but its worker holds the Rust binding for
 * DAST normalization, whose memory counts against it too. A second init on an
 * initialized wasm-bindgen module returns its exports.
 */
async function wasmBytes(api: any): Promise<number> {
    if (typeof api.wasmMemoryBytes === "function") return api.wasmMemoryBytes();
    try {
        const mod: any = await import("lib-doenetml-worker");
        const wasm = await mod.default();
        return wasm?.memory?.buffer?.byteLength ?? 0;
    } catch {
        return 0;
    }
}

/**
 * The session's saved state after the steps: raw and gzipped bytes. The cells
 * core serializes its changed essential cells; the JS core reports the
 * `coreState` string of its persistence payload, and the whole payload a
 * host actually stores (with `coreInfo`) as `state_envelope_bytes`.
 */
async function savedState(api: any) {
    const bytes = (s: string) => ({
        state_bytes: Buffer.byteLength(s),
        state_gzip_bytes: gzipSync(s).length,
    });
    if (typeof api.saveState === "function") return bytes(api.saveState());
    if (typeof api.core.saveImmediately !== "function") return {};
    await api.core.saveImmediately();
    const coreState: string = api.scoreState?.state ?? "";
    const envelope = api.lastStateReport?.payload;
    return {
        ...bytes(coreState),
        state_envelope_bytes: envelope
            ? Buffer.byteLength(JSON.stringify(envelope))
            : null,
    };
}

async function runStep(api: any, s: Step) {
    const componentIdx = await api.resolvePathToNodeIdx(s.target);
    if (componentIdx === -1)
        throw new TargetGap(`target ${s.target} did not resolve`);
    const act = (actionName: string, args: any) =>
        api.core.requestAction({ componentIdx, actionName, args });
    if (core === "rust") return runRustStep(api, s, componentIdx, act);
    switch (s.action) {
        case "movePoint":
            return act("movePoint", { x: s.x, y: s.y });
        case "updateValue":
            // A text input takes its text through updateImmediateValue; a math
            // input takes what was typed through updateRawValue.
            if (s.kind === "text")
                await act("updateImmediateValue", { text: s.value });
            else await act("updateRawValue", { rawRendererValue: s.value });
            return act("updateValue", {});
        case "submitAnswer":
            return act("submitAnswer", {});
        case "triggerActions":
            return act("triggerActions", {});
        default:
            throw new Error(`unknown action ${s.action}`);
    }
}

/**
 * The Rust core has its own action names and arguments (its test adapter
 * forwards whatever it is given): a point's `move` takes `{x, y}`, a
 * textInput's `updateImmediateValue` takes `{text}` and `updateValue`
 * nothing. It has no mathInput, so typing into one is a gap there.
 */
async function runRustStep(
    api: any,
    s: Step,
    componentIdx: number,
    act: (name: string, args: any) => Promise<unknown>,
) {
    const type = api.rustCore?.get_component_type?.(componentIdx);
    switch (s.action) {
        case "movePoint":
            return act("move", { x: s.x, y: s.y });
        case "updateValue":
            if (type !== "textInput")
                throw new TargetGap(
                    `typing into a ${type ?? "component"} (the Rust core has no mathInput)`,
                );
            await act("updateImmediateValue", { text: s.value });
            return act("updateValue", {});
        default:
            throw new TargetGap(`action ${s.action} in the Rust core`);
    }
}

/**
 * The value of a named component as a number, whatever form the core
 * gives it in: a number, a math-expressions object, a string or a boolean.
 * NaN when the name does not resolve or the value is not a number.
 */
async function readValue(api: any, name: string): Promise<number> {
    let idx: number;
    try {
        idx = await api.resolvePathToNodeIdx(name);
    } catch {
        return NaN;
    }
    if (idx === -1) return NaN;
    const sv = await api.core.returnAllStateVariables(false, true);
    const v = sv[idx]?.stateValues?.value;
    if (typeof v === "number") return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    if (typeof v === "string") return v.trim() === "" ? NaN : Number(v);
    if (v && typeof v.evaluate_to_constant === "function")
        return Number(v.evaluate_to_constant());
    return NaN;
}

/** Cycle through the steps, timing each, until the rounds or the budget run out. */
async function timeSteps(api: any, steps: Step[], rounds: number) {
    const samples = new Map<string, number[]>();
    const start = now();
    for (let r = 0; r < rounds && now() - start < budgetMs; r++) {
        for (const s of steps) {
            const t = now();
            if (process.env.BENCH_DEBUG)
                console.error(`round ${r} ${s.action} ${s.target}`);
            await runStep(api, s);
            const label = `${s.action} ${s.target}`;
            (samples.get(label) ?? samples.set(label, []).get(label)!).push(
                now() - t,
            );
        }
    }
    return [...samples].map(([label, xs]) => ({ label, ...quantiles(xs) }));
}

async function main() {
    const manifest = loadFixture(fixtureName);
    const text = fixtureText(manifest);
    const record: any = {
        core,
        fixture: fixtureName,
        status: "ok",
        text_bytes: text.length,
    };

    progress("parse");
    let t = now();
    normalizeDocumentDast(lezerToDast(text), true);
    record.parse_ms = now() - t;

    progress("load");
    gc();
    const heapBefore = process.memoryUsage().heapUsed;
    t = now();
    // allowSaveState makes the JS core build its persistence payload.
    const api = await createTestCore({
        doenetML: text,
        flags: { allowSaveState: true },
    });
    record.load_ms = now() - t;
    gc();
    record.heap_bytes = process.memoryUsage().heapUsed - heapBefore;
    record.wasm_bytes = await wasmBytes(api);

    progress("steps");
    record.steps = await timeSteps(api, manifest.steps, maxRounds);
    if (manifest.structural) {
        progress("structural");
        record.structural = await timeSteps(
            api,
            manifest.structural,
            Math.min(maxRounds, 10),
        );
    }

    if (process.env.BENCH_PROBE) {
        const values: Record<string, number> = {};
        for (const name of process.env.BENCH_PROBE.split(","))
            values[name] = await readValue(api, name);
        record.probe = values;
    }

    progress("state");
    try {
        Object.assign(record, await savedState(api));
    } catch (e: any) {
        // A core without saved state (the Rust core) still has its timings.
        record.state_bytes = null;
        record.state_note = String(e?.message ?? e).slice(0, 200);
    }

    // Last: on a slow document this check costs more than the measurements,
    // so the record goes out first and again with the count if time allows.
    emit({ ...record, error_components: "unchecked" });
    progress("errors");
    try {
        const sv = await api.core.returnAllStateVariables(false, true);
        record.error_components = Object.values(sv).filter(
            (c: any) => c.componentType === "_error",
        ).length;
    } catch {
        record.error_components = null;
    }
    emit(record);
}

// The JS core leaves timers running, so exit explicitly once the line is out.
main()
    .catch((e) => {
        const name = e?.constructor?.name ?? "";
        const status = /Gap$/.test(name) ? "unsupported" : "error";
        emit({
            core,
            fixture: fixtureName,
            status,
            message: String(e?.message ?? e).slice(0, 500),
        });
    })
    .finally(() => setTimeout(() => process.exit(0), 50));
