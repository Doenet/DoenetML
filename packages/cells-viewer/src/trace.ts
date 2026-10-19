// The load trace on the page's side: each step from DoenetML text to the
// first render is a User Timing measure named `cells:<step>`, where a step
// nested in another is named by its path (`parse/lezerToDast`). They show
// in the Performance panel of the browser's developer tools, and
// `packages/benchmark` (its trace layer, `browser/trace.spec.ts`) reads
// them back with the core's own spans (`Core.load_trace_json`), which
// `measureCoreSpans` places under the step that called the core.
// `detail.counts` carries the work a step did, so its time can be read
// against its size. The steps are explained in the benchmark's glossary,
// `src/steps.mjs`; a step renamed here is renamed there.

export const TRACE_PREFIX = "cells:";

export type Counts = Record<string, number>;

/** Record step `name` from `start` (a `performance.now()`) until now. */
export function measure(name: string, start: number, counts?: Counts) {
    measureBetween(name, start, performance.now(), counts);
}

export function measureBetween(
    name: string,
    start: number,
    end: number,
    counts?: Counts,
) {
    try {
        performance.measure(TRACE_PREFIX + name, {
            start,
            end,
            detail: { counts: counts ?? {} },
        });
    } catch {
        // A page without User Timing (or one that cleared it) loads anyway.
    }
}

/** Run `f` as step `name`. */
export function step<T>(name: string, f: () => T, counts?: Counts): T {
    const start = performance.now();
    const out = f();
    measure(name, start, counts);
    return out;
}

/** Run `f` as step `name`, until its promise settles. */
export async function stepAsync<T>(
    name: string,
    f: () => Promise<T>,
    counts?: Counts,
): Promise<T> {
    const start = performance.now();
    try {
        return await f();
    } finally {
        measure(name, start, counts);
    }
}

type CoreSpan = {
    name: string;
    depth: number;
    start_ms: number;
    duration_ms: number;
    counts: Counts;
};

/**
 * Put the core's spans under step `parent`, which called the core at
 * `origin`. The core's clock starts inside the call, after its bytes are
 * copied into wasm memory, so its spans sit up to that copy late.
 */
export function measureCoreSpans(parent: string, origin: number, json: string) {
    let spans: CoreSpan[];
    try {
        spans = JSON.parse(json);
    } catch {
        return;
    }
    const path: string[] = [];
    for (const s of spans) {
        path.length = s.depth;
        path.push(s.name);
        const start = origin + s.start_ms;
        measureBetween(
            `${parent}/${path.join("/")}`,
            start,
            start + s.duration_ms,
            s.counts,
        );
    }
}
