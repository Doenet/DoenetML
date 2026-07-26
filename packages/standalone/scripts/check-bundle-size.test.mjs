import { describe, expect, it } from "vitest";
import {
    WASM_CORE_SCRIPT,
    countBigBlobs,
    findProblems,
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

    it("lists an unbudgeted chunk without failing on it", () => {
        const scripts = healthyBuild();
        scripts.set("dist/coordinator.js", script(11_000));
        const { report, problems } = findProblems(BUDGETS, scripts);
        expect(problems).toEqual([]);
        expect(report.join("\n")).toContain("dist/coordinator.js");
        expect(report.join("\n")).toContain("no budget");
    });
});
