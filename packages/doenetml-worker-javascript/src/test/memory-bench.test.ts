import { describe, expect, it } from "vitest";
import { createTestCore } from "./utils/test-core";
import fs from "node:fs";

// Memory benchmark for the memory-reduction workstream
// (https://github.com/Doenet/DoenetML/issues/1441).
// Creates a core with the Venn-diagram profiling document and reports
// heap usage. Run with:
//   MEMBENCH_RESULT=/tmp/membench.json NODE_OPTIONS=--expose-gc \
//       npx vitest run src/test/memory-bench.test.ts
// Set MEMBENCH_HEAP_SNAPSHOT=<path> to also write a V8 heap snapshot
// for offline analysis. The second case below reads the matching
// MEMBENCH_REPEAT_* variables.
//
// It only runs when one of those four variables is set. This file carries no
// `@groupN` tag, so it would otherwise land in the `test:group4` catch-all
// (`-t '^(?!.*@(?:group1|group2|group3))'`) and spend minutes measuring
// something no assertion depends on.

const doenetML = fs.readFileSync(
    new URL("./memory-bench-doc.xml", import.meta.url),
    "utf8",
);

// A copy/shadow-heavy document in the spirit of the @doenet/memory-benchmark
// harness's `repeat-S` scenario (the document-scaling metric of
// https://github.com/Doenet/DoenetML/issues/1441). Every iteration's
// components are reference shadows, so this exercises the shadow-definition
// path rather than the class-definition path. The document is *not* the
// harness's — it uses different expressions and a `<point>` where that one
// uses a second `<number>` — so the heap figures here are comparable across
// runs of this file, not against `measure.mjs`.
const repeatDoenetML = `
<repeatForSequence from="1" to="150" valueName="i" name="rep">
  <p>Point <number extend="$i" name="n" />:
    <point name="P">($i, 2$i)</point>
    <math name="m" simplify>$P.x + $n</math>
    <boolean name="b">$m > 3</boolean>
  </p>
</repeatForSequence>
`;

const MEMBENCH_ENABLED = Boolean(
    process.env.MEMBENCH_RESULT ||
    process.env.MEMBENCH_HEAP_SNAPSHOT ||
    process.env.MEMBENCH_REPEAT_RESULT ||
    process.env.MEMBENCH_REPEAT_HEAP_SNAPSHOT,
);

/** Building a core for either of these documents takes minutes, not seconds. */
const BENCH_TIMEOUT_MS = 240000;

describe.runIf(MEMBENCH_ENABLED)("memory benchmark", () => {
    it(
        "loads the Venn diagram document and reports heap",
        () =>
            measure({
                doenetML,
                resultVar: "MEMBENCH_RESULT",
                snapshotVar: "MEMBENCH_HEAP_SNAPSHOT",
            }),
        BENCH_TIMEOUT_MS,
    );

    it(
        "loads a repeat/shadow-heavy document and reports heap",
        () =>
            measure({
                doenetML: repeatDoenetML,
                resultVar: "MEMBENCH_REPEAT_RESULT",
                snapshotVar: "MEMBENCH_REPEAT_HEAP_SNAPSHOT",
            }),
        BENCH_TIMEOUT_MS,
    );
});

/**
 * Build a core for `doenetML` and report what it cost.
 *
 * The two cases differ only in the document and in which pair of environment
 * variables names their output, so the measurement itself lives here once.
 *
 * `gc()` is only present under `--expose-gc`; without it the heap delta still
 * means something, just noisily, so the calls are conditional rather than
 * required. It runs twice after building the core because V8's first collection
 * can leave objects that only the second one reaches.
 *
 * The `expect` is deliberately weak. This is an instrument: its output is the
 * JSON it writes, and the assertion exists only so a document that silently
 * stopped building cannot be reported as a very small heap.
 */
async function measure({
    doenetML,
    resultVar,
    snapshotVar,
}: {
    doenetML: string;
    resultVar: string;
    snapshotVar: string;
}) {
    const gc = (globalThis as any).gc;
    gc?.();
    const before = process.memoryUsage().heapUsed;

    const { core } = await createTestCore({ doenetML });

    gc?.();
    gc?.();
    const after = process.memoryUsage().heapUsed;

    // Component and state-variable counts, for context on the heap figure.
    const components = (core as any).core._components;
    let numComponents = 0;
    let numStateVariables = 0;
    for (const idx in components) {
        const comp = components[idx];
        if (!comp?.state) {
            continue;
        }
        numComponents++;
        numStateVariables += Object.keys(comp.state).length;
    }

    const resultPath = process.env[resultVar];
    if (resultPath) {
        fs.writeFileSync(
            resultPath,
            JSON.stringify({
                heapUsedMB: ((after - before) / 1048576).toFixed(1),
                gcAvailable: Boolean(gc),
                numComponents,
                numStateVariables,
            }),
        );
    }

    expect(numComponents).toBeGreaterThan(100);

    const snapshotPath = process.env[snapshotVar];
    if (snapshotPath) {
        const v8 = await import("node:v8");
        v8.writeHeapSnapshot(snapshotPath);
    }
}
