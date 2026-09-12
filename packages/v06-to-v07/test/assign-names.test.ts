import { describe, expect, it } from "vitest";
import { toXml } from "@doenet/parser";
import { VFile } from "vfile";
import {
    breakStringInPiecesBySpacesOrParens,
    firstLeafName,
} from "../src/assign-names/break-into-pieces";
import {
    RenameRegistry,
    makeIndexedPathPart,
} from "../src/assign-names/rename-registry";
import { registerAssignNames } from "../src/assign-names/register-assign-names";
import { reparseAttribute } from "../src/reparse-attribute";

/**
 * The path `name` registers to, printed the way it would appear in a document.
 */
function renameFor(registry: RenameRegistry, name: string): string | undefined {
    const target = registry.get(name);
    return target ? toXml(target.replacement) : undefined;
}

function register(assignNamesValue: string, compositeName = "s") {
    const registry = new RenameRegistry();
    const file = new VFile();
    const ok = registerAssignNames({
        assignNamesValue,
        compositeName,
        registry,
        origin: { elementName: "select" },
        file,
    });
    return { registry, file, ok };
}

describe("breakStringInPiecesBySpacesOrParens", () => {
    it("splits on whitespace", () => {
        expect(breakStringInPiecesBySpacesOrParens("a b")).toEqual({
            success: true,
            pieces: ["a", "b"],
        });
        expect(breakStringInPiecesBySpacesOrParens("  a  ")).toEqual({
            success: true,
            pieces: ["a"],
        });
    });

    it("nests on parentheses", () => {
        expect(breakStringInPiecesBySpacesOrParens("(a b) (c d)")).toEqual({
            success: true,
            pieces: [
                ["a", "b"],
                ["c", "d"],
            ],
        });
        expect(breakStringInPiecesBySpacesOrParens("a (b (c d))")).toEqual({
            success: true,
            pieces: ["a", ["b", ["c", "d"]]],
        });
        expect(breakStringInPiecesBySpacesOrParens("((x)) ((y))")).toEqual({
            success: true,
            pieces: [[["x"]], [["y"]]],
        });
    });

    it("fails on unbalanced parentheses rather than falling back to spaces", () => {
        expect(breakStringInPiecesBySpacesOrParens("(a")).toEqual({
            success: false,
        });
        expect(breakStringInPiecesBySpacesOrParens("a)")).toEqual({
            success: false,
        });
    });

    it("drops empty groups", () => {
        expect(breakStringInPiecesBySpacesOrParens("()")).toEqual({
            success: true,
            pieces: [],
        });
    });

    it("finds the first leaf name", () => {
        expect(firstLeafName(["a", "b"])).toEqual("a");
        expect(firstLeafName([["a", "b"], ["c"]])).toEqual("a");
        expect(firstLeafName([[["x"]]])).toEqual("x");
        expect(firstLeafName([])).toBeUndefined();
    });
});

describe("registerAssignNames", () => {
    it("maps a flat list onto successive indices", () => {
        const { registry } = register("a b c");
        expect(renameFor(registry, "a")).toEqual("s[1]");
        expect(renameFor(registry, "b")).toEqual("s[2]");
        expect(renameFor(registry, "c")).toEqual("s[3]");
    });

    it("maps a nested group one index deeper", () => {
        const { registry } = register("(a b) (c d)");
        expect(renameFor(registry, "a")).toEqual("s[1][1]");
        expect(renameFor(registry, "b")).toEqual("s[1][2]");
        expect(renameFor(registry, "c")).toEqual("s[2][1]");
        expect(renameFor(registry, "d")).toEqual("s[2][2]");
    });

    it("handles doubly nested groups", () => {
        const { registry } = register("((n1)) ((n2))");
        expect(renameFor(registry, "n1")).toEqual("s[1][1][1]");
        expect(renameFor(registry, "n2")).toEqual("s[2][1][1]");
    });

    it("reports unbalanced parentheses and registers nothing", () => {
        const { registry, file, ok } = register("(a b");
        expect(ok).toBe(false);
        expect(registry.size).toEqual(0);
        expect(file.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/unbalanced-parens",
        ]);
    });

    it("skips names that are not valid v0.7 identifiers", () => {
        const { registry, file } = register("a-b ok");
        expect(renameFor(registry, "a-b")).toBeUndefined();
        expect(renameFor(registry, "ok")).toEqual("s[2]");
        expect(file.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/invalid-name",
        ]);
    });

    it("keeps the first registration when a name is assigned twice", () => {
        const registry = new RenameRegistry();
        const file = new VFile();
        for (const compositeName of ["first", "second"]) {
            registerAssignNames({
                assignNamesValue: "a",
                compositeName,
                registry,
                origin: { elementName: "select" },
                file,
            });
        }
        expect(renameFor(registry, "a")).toEqual("first[1]");
        expect(file.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/duplicate-name",
        ]);
    });

    it("warns when an assigned name shadows an existing component name", () => {
        const registry = new RenameRegistry(new Set(["a"]));
        const file = new VFile();
        registerAssignNames({
            assignNamesValue: "a",
            compositeName: "s",
            registry,
            origin: { elementName: "select" },
            file,
        });
        expect(file.messages.map((m) => m.ruleId)).toEqual([
            "assign-names/shadows-existing-name",
        ]);
    });

    it("tracks which registered names were never referenced", () => {
        const { registry } = register("a b");
        registry.get("a");
        expect(registry.unused()).toEqual(["b"]);
    });
});

describe("makeIndexedPathPart", () => {
    it("round-trips through the parser", () => {
        const part = makeIndexedPathPart("s", [1, 2]);
        expect(toXml([part])).toEqual("s[1][2]");
        // ...and the printed form parses back to the same path
        const reparsed = reparseAttribute("$s[1][2]")[0];
        expect(reparsed.type).toEqual("macro");
        if (reparsed.type === "macro") {
            expect(toXml(reparsed.path)).toEqual("s[1][2]");
        }
    });
});
