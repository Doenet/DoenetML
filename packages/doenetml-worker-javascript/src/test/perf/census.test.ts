import { describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { censusOfCore, censusSummary } from "./census";
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
    },
);
