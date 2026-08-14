import { describe, expect, it } from "vitest";
import { createTestCore } from "./utils/test-core";
import fs from "node:fs";

// Memory benchmark for MEMORY_REDUCTION_LOG.md.
// Creates a core with the Venn-diagram profiling document and reports
// heap usage. Run with:
//   MEMBENCH_RESULT=/tmp/membench.json NODE_OPTIONS=--expose-gc \
//       npx vitest run src/test/memory-bench.test.ts
// Set MEMBENCH_HEAP_SNAPSHOT=<path> to also write a V8 heap snapshot
// for offline analysis.
//
// It only runs when one of those variables is set. This file carries no
// `@groupN` tag, so it would otherwise land in the `test:group4` catch-all
// (`-t '^(?!.*@(?:group1|group2|group3))'`) and spend minutes measuring
// something no assertion depends on.

const doenetML = fs.readFileSync(
    new URL("./memory-bench-doc.xml", import.meta.url),
    "utf8",
);

// A copy/shadow-heavy document matching the `repeat-S` scenario of the
// @doenet/memory-benchmark harness (the document-scaling metric of
// https://github.com/Doenet/DoenetML/issues/1441). Every iteration's
// components are reference shadows, so this exercises the shadow-definition
// path rather than the class-definition path.
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
    process.env.MEMBENCH_RESULT || process.env.MEMBENCH_HEAP_SNAPSHOT,
);

describe.runIf(MEMBENCH_ENABLED)("memory benchmark", () => {
    it("loads the Venn diagram document and reports heap", async () => {
        const gc = (globalThis as any).gc;
        if (gc) {
            gc();
        }
        const before = process.memoryUsage().heapUsed;

        const { core } = await createTestCore({ doenetML });

        if (gc) {
            gc();
            gc();
        }
        const after = process.memoryUsage().heapUsed;

        // count components and state variables for context
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

        const result = JSON.stringify({
            heapUsedMB: ((after - before) / 1048576).toFixed(1),
            gcAvailable: Boolean(gc),
            numComponents,
            numStateVariables,
        });
        if (process.env.MEMBENCH_RESULT) {
            fs.writeFileSync(process.env.MEMBENCH_RESULT, result);
        }

        expect(numComponents).toBeGreaterThan(100);

        if (process.env.MEMBENCH_HEAP_SNAPSHOT) {
            const v8 = await import("node:v8");
            v8.writeHeapSnapshot(process.env.MEMBENCH_HEAP_SNAPSHOT);
        }
    }, 240000);

    it("loads a repeat/shadow-heavy document and reports heap", async () => {
        const gc = (globalThis as any).gc;
        if (gc) {
            gc();
        }
        const before = process.memoryUsage().heapUsed;

        const { core } = await createTestCore({ doenetML: repeatDoenetML });

        if (gc) {
            gc();
            gc();
        }
        const after = process.memoryUsage().heapUsed;

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

        const result = JSON.stringify({
            heapUsedMB: ((after - before) / 1048576).toFixed(1),
            gcAvailable: Boolean(gc),
            numComponents,
            numStateVariables,
        });
        if (process.env.MEMBENCH_REPEAT_RESULT) {
            fs.writeFileSync(process.env.MEMBENCH_REPEAT_RESULT, result);
        }

        expect(numComponents).toBeGreaterThan(100);

        if (process.env.MEMBENCH_REPEAT_HEAP_SNAPSHOT) {
            const v8 = await import("node:v8");
            v8.writeHeapSnapshot(process.env.MEMBENCH_REPEAT_HEAP_SNAPSHOT);
        }
    }, 240000);
});
