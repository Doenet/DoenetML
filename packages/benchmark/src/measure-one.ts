// Measure one fixture in one core, as JSON lines on stdout.
//
// Runs from packages/doenetml-worker-javascript, whose test utilities give
// every core the same interface (DOENET_TEST_CORE selects it), prebundled
// by `scripts/bundle-driver.mjs`. `src/run.mjs` spawns this once per (core,
// fixture), so each memory figure is a fresh process, and allows 15 s
// between two lines: every stage and every tick reports as it ends, so a
// timeout bounds one stage or one tick and keeps what came before it.
//
// Lines: `{"progress": stage}` as a stage starts; `{"part": {...}}` with a
// stage's fields as it ends; `{"sample": ms}` per timed tick; `{"done":
// true}` last. A failure is `{"part": {"status", "message"}}`.
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { createTestCore } from "../../doenetml-worker-javascript/src/test/utils/test-core";
import { writeSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { fixtureText, loadFixture } from "./fixtures.mjs";

const core = process.env.DOENET_TEST_CORE || "javascript";
const fixtureName = process.argv[2];

/** Ticks before the samples, and samples; fewer when a tick is slow. */
const WARMUP = 3;
const SAMPLES = 20;
const SLOW_TICK_MS = 1000;
const SLOW_WARMUP = 1;
const SLOW_SAMPLES = 3;

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
const part = (fields: Record<string, unknown>) => emit({ part: fields });
const gc = () => (globalThis as any).gc?.();
const now = () => performance.now();

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
 * The value of a named component as a number, whatever form the core gives
 * it in: a number, a math-expressions object, a string or a boolean. A
 * string says why there is none: the name did not resolve, or the value is
 * not a number.
 */
async function readValue(api: any, name: string): Promise<number | string> {
    // First: the JS core expands a repeat's iterations when its state is
    // asked for, and a path into them resolves only after.
    const sv = await api.core.returnAllStateVariables(false, true);
    let idx: number;
    try {
        idx = await api.resolvePathToNodeIdx(name);
    } catch (e: any) {
        return `${name} did not resolve: ${String(e?.message ?? e).slice(0, 120)}`;
    }
    if (idx === -1) return `${name} did not resolve`;
    const c = sv[idx];
    const v = c?.stateValues?.value;
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "boolean") return v ? 1 : 0;
    if (typeof v === "string" && v.trim() !== "" && !isNaN(Number(v)))
        return Number(v);
    if (v && typeof v.evaluate_to_constant === "function") {
        const x = Number(v.evaluate_to_constant());
        if (!Number.isNaN(x)) return x;
    }
    return `${name} (${c?.componentType ?? "no component"}) has no numeric value: ${JSON.stringify(v)?.slice(0, 80)}`;
}

/**
 * The primary action, alternating between its steps: warm-up ticks, then
 * timed samples, each reported as it ends. A first tick slower than
 * `SLOW_TICK_MS` cuts both short.
 */
async function timeTicks(api: any, steps: Step[]) {
    let k = 0;
    const tick = async () => {
        const t = now();
        await runStep(api, steps[k++ % steps.length]);
        return now() - t;
    };
    const first = await tick();
    const slow = first > SLOW_TICK_MS;
    const warmup = slow ? SLOW_WARMUP : WARMUP;
    const samples = slow ? SLOW_SAMPLES : SAMPLES;
    const warmups = [first];
    while (warmups.length < warmup) warmups.push(await tick());
    part({ warmup_ms: warmups });
    for (let i = 0; i < samples; i++) emit({ sample: await tick() });
}

/** The check: one more step, then the values it must leave. */
async function check(
    api: any,
    c: { step: Step; values: Record<string, number> },
) {
    await runStep(api, c.step);
    const values: Record<string, number | string> = {};
    let ok = true;
    for (const [name, want] of Object.entries(c.values)) {
        const got = await readValue(api, name);
        values[name] = got;
        if (
            typeof got !== "number" ||
            !(Math.abs(got - want) <= 1e-9 * Math.max(1, Math.abs(want)))
        )
            ok = false;
    }
    return { ok, values, expected: c.values };
}

async function main() {
    const manifest = loadFixture(fixtureName);
    progress("generate");
    const text = fixtureText(manifest);
    part({ text_bytes: text.length });

    progress("parse");
    let t = now();
    normalizeDocumentDast(lezerToDast(text), true);
    part({ parse_ms: now() - t });

    progress("load");
    gc();
    const heapBefore = process.memoryUsage().heapUsed;
    t = now();
    // allowSaveState makes the JS core build its persistence payload.
    const api = await createTestCore({
        doenetML: text,
        flags: { allowSaveState: true },
    });
    const load_ms = now() - t;
    gc();
    part({
        load_ms,
        heap_bytes: process.memoryUsage().heapUsed - heapBefore,
        wasm_bytes: await wasmBytes(api),
    });

    progress("tick");
    await timeTicks(api, manifest.steps);

    if (manifest.check) {
        progress("check");
        part({ check: await check(api, manifest.check) });
    }

    progress("state");
    try {
        part(await savedState(api));
    } catch (e: any) {
        // A core without saved state (the Rust core) still has its timings.
        part({ state_bytes: null });
    }

    // Last: on a large document this costs more than the measurements.
    progress("errors");
    try {
        const sv = await api.core.returnAllStateVariables(false, true);
        part({
            error_components: Object.values(sv).filter(
                (c: any) => c.componentType === "_error",
            ).length,
        });
    } catch {
        part({ error_components: null });
    }
    emit({ done: true });
}

// The JS core leaves timers running, so exit explicitly once the lines are out.
main()
    .catch((e) => {
        const name = e?.constructor?.name ?? "";
        part({
            status: /Gap$/.test(name) ? "unsupported" : "error",
            message: String(e?.message ?? e).slice(0, 500),
        });
    })
    .finally(() => setTimeout(() => process.exit(0), 50));
