import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
    WASM_CORE_SCRIPT,
    countBigBlobs,
    findProblems,
    loadBudgets,
} from "./check-bundle-size.mjs";

const STANDALONE = "dist/doenet-standalone.js";

/** Budgets in the shape `loadBudgets` returns: `[relativePath, budget]` pairs. */
const BUDGETS = [
    [STANDALONE, { maxBytes: 1000 }],
    [WASM_CORE_SCRIPT, { maxBytes: 1000 }],
];

/** One emitted script. `blobs` is the count of inlined wasm copies it holds. */
function script(size, blobs = 0) {
    return { size, wasmUris: blobs, bigBlobs: blobs };
}

/** A healthy build: the core inlined once, in the worker, both within budget. */
function healthyBuild() {
    return new Map([
        [STANDALONE, script(500)],
        [WASM_CORE_SCRIPT, script(900, 1)],
    ]);
}

function problemsFor(scripts, budgets = BUDGETS) {
    return findProblems(budgets, scripts).problems;
}

describe("countBigBlobs", () => {
    it("ignores base64 runs below the threshold", () => {
        expect(countBigBlobs("a".repeat(999_999))).toBe(0);
    });

    it("counts a run that reaches the threshold, including at end of input", () => {
        expect(countBigBlobs("a".repeat(1_000_000))).toBe(1);
        expect(countBigBlobs(`"${"a".repeat(1_000_000)}"`)).toBe(1);
    });

    it("counts each run separately, since a quote breaks the run", () => {
        const blob = "a".repeat(1_000_000);
        expect(countBigBlobs(`"${blob}","${blob}"`)).toBe(2);
    });

    it("does not treat non-base64 characters as part of a run", () => {
        expect(countBigBlobs("-".repeat(2_000_000))).toBe(0);
    });
});

describe("findProblems", () => {
    it("accepts a healthy build", () => {
        expect(problemsFor(healthyBuild())).toEqual([]);
    });

    it("reports a bundle over its budget", () => {
        const scripts = healthyBuild();
        scripts.set(STANDALONE, script(1001));
        expect(problemsFor(scripts)).toEqual([
            expect.stringContaining("over its"),
        ]);
    });

    it("tells you to build when a budgeted file is missing, without blaming the core", () => {
        const problems = problemsFor(new Map());
        expect(problems).toHaveLength(2);
        for (const problem of problems) {
            expect(problem).toContain("does not exist");
        }
    });

    it("rejects a second copy of the core in the standalone bundle", () => {
        const scripts = healthyBuild();
        scripts.set(STANDALONE, script(500, 1));
        expect(problemsFor(scripts)).toEqual([
            expect.stringContaining("should carry no inlined binary"),
        ]);
    });

    it("rejects a copy of the core in an unbudgeted chunk", () => {
        const scripts = healthyBuild();
        scripts.set("dist/chunk-abc123.js", script(500, 1));
        expect(problemsFor(scripts)).toEqual([
            expect.stringContaining("dist/chunk-abc123.js"),
        ]);
    });

    it("rejects the core moving out of the worker, not just being duplicated", () => {
        const scripts = healthyBuild();
        scripts.set(STANDALONE, script(500, 1));
        scripts.set(WASM_CORE_SCRIPT, script(900, 0));
        expect(problemsFor(scripts)).toEqual(
            expect.arrayContaining([
                expect.stringContaining(
                    "should carry the Rust core exactly once",
                ),
                expect.stringContaining("should carry no inlined binary"),
            ]),
        );
    });

    it("rejects the core no longer being inlined at all", () => {
        const scripts = healthyBuild();
        scripts.set(WASM_CORE_SCRIPT, script(900, 0));
        expect(problemsFor(scripts)).toEqual([
            expect.stringContaining("should carry the Rust core exactly once"),
        ]);
    });

    it("rejects the core-carrying script disappearing from a build that ran", () => {
        const scripts = new Map([[STANDALONE, script(500)]]);
        const problems = problemsFor(scripts, [
            [STANDALONE, { maxBytes: 1000 }],
        ]);
        expect(problems).toEqual([
            expect.stringContaining("nothing carries the Rust core"),
        ]);
    });

    // The scenario a version bump could produce: the build ran, but the core
    // landed under a name nobody budgeted. Saying "build the package" here
    // would send the reader after a build they already have.
    it("blames a moved core on the move, not on a missing build", () => {
        const scripts = new Map([
            [STANDALONE, script(500)],
            ["dist/doenetml-worker/index.mjs", script(900, 1)],
        ]);
        const problems = problemsFor(scripts);
        expect(problems).toEqual(
            expect.arrayContaining([
                expect.stringContaining("nothing carries the Rust core"),
                expect.stringContaining("dist/doenetml-worker/index.mjs"),
            ]),
        );
        for (const problem of problems) {
            expect(problem).not.toContain("build the package");
        }
    });

    // Unlike every other case here, the two counts disagree — which is the
    // only way to tell the `wasmUris || bigBlobs` check from an `&&`.
    it("rejects a large inlined blob that is not wasm", () => {
        const scripts = healthyBuild();
        scripts.set(STANDALONE, { size: 500, wasmUris: 0, bigBlobs: 1 });
        expect(problemsFor(scripts)).toEqual([
            expect.stringContaining("should carry no inlined binary"),
        ]);
    });

    it("lists an unbudgeted chunk without failing on it", () => {
        const scripts = healthyBuild();
        scripts.set("dist/coordinator.js", script(11_000));
        const { report, problems } = findProblems(BUDGETS, scripts);
        expect(problems).toEqual([]);
        expect(report.join("\n")).toContain("dist/coordinator.js");
        expect(report.join("\n")).toContain("no budget");
    });
});

describe("loadBudgets", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "bundle-budgets-"));
    afterAll(() => fs.rmSync(tmpDir, { recursive: true, force: true }));

    /** Write `contents` to a throwaway budgets file and load it. */
    function load(contents, name) {
        const file = path.join(tmpDir, `${name}.json`);
        fs.writeFileSync(file, contents);
        return () => loadBudgets(file);
    }

    it("rejects a budgets file that is absent or not JSON", () => {
        expect(() => loadBudgets(path.join(tmpDir, "absent.json"))).toThrow(
            /Could not read/,
        );
        expect(load("{ not json", "malformed")).toThrow(/Could not read/);
    });

    it("rejects a budgets file with no usable `files` object", () => {
        expect(load('{"files": []}', "array")).toThrow(/"files" object/);
        expect(load("{}", "absent-files")).toThrow(/"files" object/);
        expect(load('{"files": {}}', "empty")).toThrow(/lists no files/);
    });

    // The branch that matters most: `size > undefined` is `false`, so without
    // this the entry would report as within a `NaN MiB` budget and pass.
    it("rejects an entry whose `maxBytes` could not act as a ceiling", () => {
        expect(load('{"files":{"a.js":{"maxBytse":1}}}', "typo")).toThrow(
            /needs a positive numeric "maxBytes"; got undefined/,
        );
        expect(load('{"files":{"a.js":{"maxBytes":"1"}}}', "string")).toThrow(
            /needs a positive numeric "maxBytes"/,
        );
        expect(load('{"files":{"a.js":{"maxBytes":0}}}', "zero")).toThrow(
            /needs a positive numeric "maxBytes"/,
        );
    });
});

describe("the committed bundle-budgets.json", () => {
    // Everything above runs against synthetic budgets. This is the one check
    // of the real file, and of the one way its contents can drift out of step
    // with the script: `WASM_CORE_SCRIPT` and the budget keys are two records
    // of the same path. Move the worker output and update only one of them and
    // the placement check still passes while the largest bundle in the package
    // quietly loses its ceiling — the exact silence this script exists to end.
    it("puts a ceiling on the script that carries the core", () => {
        const budgets = loadBudgets();
        expect(budgets.map(([relative]) => relative)).toContain(
            WASM_CORE_SCRIPT,
        );
    });
});
