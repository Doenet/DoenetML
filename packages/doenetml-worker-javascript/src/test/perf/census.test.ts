import { describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { censusOfCore, censusSummary, listComponents } from "./census";
import { MICRO_DOCUMENTS } from "./fixtures";

// The regression gate of the performance harness (Doenet/DoenetML#2126).
//
// Each micro-document's census is held in `__snapshots__/census.test.ts.snap`.
// Component counts are deterministic for a given build, so a change here is a
// change to what the core creates for a reference, an attribute or a repeat
// iteration. When that is intended, update the snapshot deliberately:
//
//   npm run test -w @doenet/doenetml-worker-javascript -- --run src/test/perf/census.test.ts -u
//
// and paste the before/after rows in the PR. When it is not intended, the diff
// says which construct silently started (or stopped) creating components.
//
// A change to a base class or to dependency setup looks different: it moves
// `stateVariables` or `dependencies` in all twelve entries at once while
// `components` and `byType` stay put. That is the expected shape of such a
// change, and the same update applies.
//
// The census reads the JavaScript core's internals, so it does not run on the
// Rust core.

describe.skipIf(process.env.DOENET_TEST_CORE === "rust")(
    "component census of the micro-documents",
    () => {
        for (const { name, doenetML } of MICRO_DOCUMENTS) {
            it(name, async () => {
                const { core } = await createTestCore({ doenetML });
                const summary = censusSummary(censusOfCore(core));
                expect(summary.components).toBeGreaterThan(0);
                expect(summary).toMatchSnapshot();
            });
        }

        // `listComponents` is the by-eye view the README offers for a small
        // document; nothing else calls it. One line per live component, in
        // index order, carrying the same facts the census totals.
        it("listComponents agrees with the census, line by line", async () => {
            const { doenetML } = MICRO_DOCUMENTS.find(
                (d) => d.name === "math displayDigits=$n",
            )!;
            const { core } = await createTestCore({ doenetML });
            const census = censusOfCore(core);
            const lines = listComponents(core);
            expect(lines).toHaveLength(census.components);
            expect(lines[0]).toMatch(/^#0 document parent=- sv=\d+ deps=\d+$/);
            for (const line of lines) {
                expect(line).toMatch(
                    /^#\d+ \w+ parent=(-|#\d+) sv=\d+ deps=\d+( shadows=#\d+(\.\w+)?)?( attrComps=\[[^\]]+\])?$/,
                );
            }
            expect(lines.filter((l) => l.includes(" shadows=#"))).toHaveLength(
                census.shadows,
            );
            const owned = lines.flatMap(
                (l) => /attrComps=\[([^\]]+)\]/.exec(l)?.[1].split(",") ?? [],
            );
            expect(owned).toHaveLength(census.attributeComponents);
            const stateVariables = lines.reduce(
                (sum, l) => sum + Number(/ sv=(\d+)/.exec(l)![1]),
                0,
            );
            expect(stateVariables).toBe(census.stateVariables);
            const dependencies = lines.reduce(
                (sum, l) => sum + Number(/ deps=(\d+)/.exec(l)![1]),
                0,
            );
            expect(dependencies).toBe(census.dependencies);
        });
    },
);
