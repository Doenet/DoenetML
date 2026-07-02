import { describe, expect, it } from "vitest";
import { calcStartEndIdx } from "../../utils/resolver";

// Lightweight stand-in for the runtime ComponentInstance shape that
// `calcStartEndIdx` reads. Only the fields actually exercised are populated;
// `as any` widens to the helper's `ComponentInstance` argument type without
// pulling in the full surface.
type ReplOpts = {
    componentType?: string;
    componentIdx: number;
    isExpanded?: boolean;
    replacements?: any[];
    replacementsToWithhold?: number;
    isInactiveCompositeReplacement?: boolean;
};

function repl(opts: ReplOpts): any {
    return {
        componentType: opts.componentType ?? "p",
        componentIdx: opts.componentIdx,
        isExpanded: opts.isExpanded ?? false,
        replacements: opts.replacements,
        replacementsToWithhold: opts.replacementsToWithhold,
        stateValues: {
            isInactiveCompositeReplacement:
                opts.isInactiveCompositeReplacement ?? false,
        },
    };
}

function copy(opts: ReplOpts): any {
    return repl({ ...opts, componentType: "_copy" });
}

describe("calcStartEndIdx utility", () => {
    it("returns no match when copy is absent", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                repl({ componentIdx: 1 }),
                repl({ componentIdx: 2 }),
            ],
            copyComponentIdx: 99,
        });
        expect(result.startIdx).toBeUndefined();
        expect(result.endIdx).toBeUndefined();
        expect(result.flattenedReplacements).toHaveLength(2);
    });

    it("locates an unexpanded copy at the top level", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                repl({ componentIdx: 1 }),
                copy({ componentIdx: 42 }),
                repl({ componentIdx: 3 }),
            ],
            copyComponentIdx: 42,
        });
        expect(result.startIdx).toBe(1);
        expect(result.endIdx).toBe(2);
        expect(result.flattenedReplacements).toHaveLength(3);
    });

    it("locates an expanded copy and substitutes its replacements", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                repl({ componentIdx: 1 }),
                copy({
                    componentIdx: 42,
                    isExpanded: true,
                    replacements: [
                        repl({ componentIdx: 10 }),
                        repl({ componentIdx: 11 }),
                        repl({ componentIdx: 12 }),
                    ],
                }),
                repl({ componentIdx: 3 }),
            ],
            copyComponentIdx: 42,
        });
        // expanded copy is replaced by its 3 replacements; match spans them
        expect(result.startIdx).toBe(1);
        expect(result.endIdx).toBe(4);
        expect(
            result.flattenedReplacements.map((r: any) => r.componentIdx),
        ).toEqual([1, 10, 11, 12, 3]);
    });

    it("honours updateStart/updateEnd when matching at an expanded copy", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                copy({
                    componentIdx: 42,
                    isExpanded: true,
                    replacements: [
                        repl({ componentIdx: 10 }),
                        repl({ componentIdx: 11 }),
                        repl({ componentIdx: 12 }),
                    ],
                }),
            ],
            copyComponentIdx: 42,
            updateStart: 1,
            updateEnd: 2,
        });
        // updateStart/updateEnd override the expansion-spanning indices
        expect(result.startIdx).toBe(1);
        expect(result.endIdx).toBe(2);
    });

    it("respects replacementsToWithhold when expanding", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                copy({
                    componentIdx: 42,
                    isExpanded: true,
                    replacements: [
                        repl({ componentIdx: 10 }),
                        repl({ componentIdx: 11 }),
                        repl({ componentIdx: 12 }),
                    ],
                    replacementsToWithhold: 2,
                }),
            ],
            copyComponentIdx: 42,
        });
        // only the first replacement of the expansion is included
        expect(result.flattenedReplacements).toHaveLength(1);
        expect(result.startIdx).toBe(0);
        expect(result.endIdx).toBe(1);
    });

    it("skips inactive composite replacements", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                repl({
                    componentIdx: 1,
                    isInactiveCompositeReplacement: true,
                }),
                copy({ componentIdx: 42 }),
            ],
            copyComponentIdx: 42,
        });
        // inactive replacement is dropped; copy moves up to position 0
        expect(result.flattenedReplacements).toHaveLength(1);
        expect(result.startIdx).toBe(0);
        expect(result.endIdx).toBe(1);
    });

    it("skips blank-string replacements but keeps non-blank strings", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                "   ",
                repl({ componentIdx: 1 }),
                "hello",
                copy({ componentIdx: 42 }),
            ],
            copyComponentIdx: 42,
        });
        // blank string filtered, "hello" kept, copy at index 2
        expect(result.flattenedReplacements).toEqual([
            expect.objectContaining({ componentIdx: 1 }),
            "hello",
            expect.objectContaining({ componentIdx: 42 }),
        ]);
        expect(result.startIdx).toBe(2);
        expect(result.endIdx).toBe(3);
    });

    it("finds a copy nested inside an expanded copy", async () => {
        const result = await calcStartEndIdx({
            replacements: [
                repl({ componentIdx: 1 }),
                copy({
                    componentIdx: 7,
                    isExpanded: true,
                    replacements: [
                        repl({ componentIdx: 20 }),
                        copy({ componentIdx: 42 }),
                        repl({ componentIdx: 22 }),
                    ],
                }),
            ],
            copyComponentIdx: 42,
        });
        // recursion's match is propagated; index is within the recursive
        // (inner) flattened result, mirroring the legacy closure behaviour.
        expect(result.startIdx).toBe(1);
        expect(result.endIdx).toBe(2);
    });

    it("parent-level match overrides a recursive match (legacy semantics)", async () => {
        // Both the outer copy (componentIdx 42) and an inner copy of the
        // same componentIdx exist; the parent-level match must win.
        const result = await calcStartEndIdx({
            replacements: [
                copy({
                    componentIdx: 42,
                    isExpanded: true,
                    replacements: [
                        repl({ componentIdx: 10 }),
                        copy({ componentIdx: 42 }),
                    ],
                }),
            ],
            copyComponentIdx: 42,
        });
        // Parent-level (current iteration) match wins: spans the whole
        // expanded slice [0, 2). The inner recursive match (which would
        // have been startIdx 1) is overwritten.
        expect(result.startIdx).toBe(0);
        expect(result.endIdx).toBe(2);
    });
});
