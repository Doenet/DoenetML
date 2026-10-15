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
};

/** The core could not name the manifest's target: a gap in that core, like the adapters' own. */
class TargetGap extends Error {}

const progress = (stage: string) =>
    console.log(JSON.stringify({ progress: stage }));
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

async function runStep(api: any, s: Step) {
    const componentIdx = await api.resolvePathToNodeIdx(s.target);
    if (componentIdx === -1)
        throw new Error(`target ${s.target} did not resolve`);
    const act = (actionName: string, args: any) =>
        api.core.requestAction({ componentIdx, actionName, args });
    switch (s.action) {
        case "movePoint":
            return act("movePoint", { x: s.x, y: s.y });
        case "updateValue":
            await act("updateRawValue", { rawRendererValue: s.value });
            return act("updateValue", {});
        case "submitAnswer":
            return act("submitAnswer", {});
        case "triggerActions":
            return act("triggerActions", {});
        default:
            throw new Error(`unknown action ${s.action}`);
    }
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
    const api = await createTestCore({ doenetML: text });
    record.load_ms = now() - t;
    gc();
    record.heap_bytes = process.memoryUsage().heapUsed - heapBefore;
    record.wasm_bytes = await wasmBytes(api);

    progress("errors");
    try {
        const sv = await api.core.returnAllStateVariables(false, true);
        record.error_components = Object.values(sv).filter(
            (c: any) => c.componentType === "_error",
        ).length;
    } catch {
        record.error_components = null;
    }

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
    console.log(JSON.stringify(record));
}

// The JS core leaves timers running, so exit explicitly once the line is out.
main()
    .catch((e) => {
        const name = e?.constructor?.name ?? "";
        const status = /Gap$/.test(name) ? "unsupported" : "error";
        console.log(
            JSON.stringify({
                core,
                fixture: fixtureName,
                status,
                message: String(e?.message ?? e).slice(0, 500),
            }),
        );
    })
    .finally(() => setTimeout(() => process.exit(0), 50));
