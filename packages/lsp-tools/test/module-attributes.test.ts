/**
 * Unit tests for the pure helpers in `auto-completer/module-attributes.ts`
 * (issue #1154 out-of-scope extension).
 *
 * The resolver-dependent helpers (`resolveCopyExtendReference`,
 * `getEffectiveModuleAttributeNames`) are exercised by the WASM-backed
 * cross-layer suite in `module-instance-attributes.test.ts`; this file
 * stays pure-DAST so it runs without the Rust core.
 */
import { describe, expect, it } from "vitest";
import type { DastElement } from "@doenet/parser";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import {
    RESERVED_MODULE_ATTRIBUTE_NAMES,
    getModuleDeclaredAttributeNames,
    mergeDeclaredIntoSchemaAttributes,
} from "../src/auto-completer/module-attributes";
import type { SchemaAttribute } from "../src/auto-completer";

/** Parse `source` and return the first top-level element whose name (case-
 *  insensitive) matches `name`. */
function elementNamed(source: string, name: string): DastElement {
    const sourceObj = new DoenetSourceObject(source);
    const target = name.toLowerCase();
    const top = sourceObj.dast.children.find(
        (c): c is DastElement =>
            c.type === "element" && c.name.toLowerCase() === target,
    );
    if (!top) throw new Error(`No <${name}> in source: ${source}`);
    return top;
}

describe("RESERVED_MODULE_ATTRIBUTE_NAMES", () => {
    // Pin the snapshot against the schema's canonical <module> attribute
    // list.  The schema generator runs the real `Module.createAttributesObject()`
    // at build time, so any new module-level attribute introduced in the
    // runtime will fail this test loudly and force a matching update to the
    // reserved set (otherwise the LSP would synthesize a phantom
    // "Author-declared" completion entry for a name the runtime ignores).
    it("matches the schema's canonical <module> attribute names (lowercased)", () => {
        const schemaModule = (
            doenetSchema as unknown as {
                elements: Array<{
                    name: string;
                    attributes: Array<{ name: string }>;
                }>;
            }
        ).elements.find((e) => e.name === "module");
        if (!schemaModule) throw new Error("<module> not in schema");

        const fromSchema = new Set(
            schemaModule.attributes.map((a) => a.name.toLowerCase()),
        );
        const fromConstant = new Set(RESERVED_MODULE_ATTRIBUTE_NAMES);

        // `name` is included in the schema and also explicitly pushed onto
        // `existingModuleAttrNames` at ModuleAttributes.js:114 — both
        // sources agree, so the union and intersection are identical.
        expect([...fromConstant].sort()).toEqual([...fromSchema].sort());
    });

    it("is stored lowercase (case-insensitive lookup contract)", () => {
        for (const name of RESERVED_MODULE_ATTRIBUTE_NAMES) {
            expect(name).toBe(name.toLowerCase());
        }
    });
});

describe("getModuleDeclaredAttributeNames", () => {
    it("returns empty set for a non-<module> element", () => {
        const el = elementNamed(
            `<group name="g"><text name="t"/></group>`,
            "group",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set());
    });

    it("returns empty set when <module> has no <moduleAttributes>", () => {
        const el = elementNamed(
            `<module name="m"><text name="t"/></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set());
    });

    it("returns empty set when <moduleAttributes> has no qualifying children", () => {
        const el = elementNamed(
            `<module name="m"><moduleAttributes></moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set());
    });

    it("collects named children's names, lowercased", () => {
        const el = elementNamed(
            `<module name="m"><moduleAttributes>
                <point name="Center">(0,0)</point>
                <number name="color">2</number>
                <number name="RADIUS">4</number>
            </moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(
            new Set(["center", "color", "radius"]),
        );
    });

    it("skips nameless children", () => {
        const el = elementNamed(
            `<module name="m"><moduleAttributes>
                <point name="center">(0,0)</point>
                <number>noname</number>
            </moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(
            new Set(["center"]),
        );
    });

    it("skips reserved names (would collide with <module>'s own attrs)", () => {
        // The runtime silently rejects these at ModuleAttributes.js:151-159
        // because they collide with attributes the <module> class already
        // declares.  Synthesizing a "declared" entry for them would mislead
        // the completion dropdown.
        const el = elementNamed(
            `<module name="m"><moduleAttributes>
                <text name="hide">x</text>
                <text name="COPY">x</text>
                <text name="Name">x</text>
                <text name="kept">x</text>
            </moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set(["kept"]));
    });

    it("case-insensitive on the <moduleAttributes> wrapper name", () => {
        const el = elementNamed(
            `<module name="m"><MODULEATTRIBUTES>
                <text name="kept">x</text>
            </MODULEATTRIBUTES></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set(["kept"]));
    });

    it("case-insensitive on the <module> wrapper name", () => {
        const el = elementNamed(
            `<MODULE name="m"><moduleAttributes>
                <text name="kept">x</text>
            </moduleAttributes></MODULE>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set(["kept"]));
    });

    it("considers only the FIRST <moduleAttributes> child (matches runtime walk)", () => {
        // Runtime iterates children in source order; the second
        // <moduleAttributes> wouldn't be discovered by the runtime's single
        // sourceCompositeIdentity path.  The LSP mirrors that.
        const el = elementNamed(
            `<module name="m">
                <moduleAttributes><text name="first">x</text></moduleAttributes>
                <moduleAttributes><text name="second">x</text></moduleAttributes>
            </module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(new Set(["first"]));
    });

    it("ignores DEEPLY nested named elements (only direct children count)", () => {
        // ModuleAttributes.js:122 iterates direct children only.
        const el = elementNamed(
            `<module name="m"><moduleAttributes>
                <group><text name="nested">x</text></group>
                <text name="direct">x</text>
            </moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(
            new Set(["direct"]),
        );
    });

    it("ignores name attributes that aren't primitive text", () => {
        // ModuleAttributes.js:123 reads `child.attributes.name?.primitive?.value`
        // — a dynamic name like `name="$dyn"` is not primitive and is treated
        // as nameless.  Helps both LSP and runtime agree the entry is invalid.
        const el = elementNamed(
            `<module name="m"><moduleAttributes>
                <text name="$dyn">x</text>
                <text name="static">x</text>
            </moduleAttributes></module>`,
            "module",
        );
        expect(getModuleDeclaredAttributeNames(el)).toEqual(
            new Set(["static"]),
        );
    });
});

describe("mergeDeclaredIntoSchemaAttributes", () => {
    const canonical: SchemaAttribute[] = [
        { name: "name", description: "ref name" },
        { name: "copy", description: "ref attr" },
        { name: "hide", values: ["true", "false"] },
    ];

    it("is identity when declared is empty", () => {
        expect(mergeDeclaredIntoSchemaAttributes(canonical, new Set())).toBe(
            canonical,
        );
    });

    it("appends synthesized entries with the placeholder description", () => {
        const result = mergeDeclaredIntoSchemaAttributes(
            canonical,
            new Set(["center", "color"]),
        );
        expect(result.length).toBe(canonical.length + 2);
        const synth = result.slice(canonical.length);
        expect(synth.map((a) => a.name)).toEqual(["center", "color"]);
        for (const a of synth) {
            expect(a.description).toBe("Author-declared module attribute");
            expect(a.values).toBeUndefined();
            expect(a.autocompleteValues).toBeUndefined();
        }
    });

    it("does not duplicate names already in canonical (case-insensitive)", () => {
        // `hide` is canonical lowercase; declared lowercase `hide` mustn't
        // double-add (the union-semantics in `isAllowedAttribute` already
        // accepts canonical names; a synthesized duplicate would render
        // twice in the completion dropdown).
        const result = mergeDeclaredIntoSchemaAttributes(
            canonical,
            new Set(["hide", "color"]),
        );
        const names = result.map((a) => a.name);
        expect(names.filter((n) => n.toLowerCase() === "hide").length).toBe(1);
        expect(names).toContain("color");
    });

    it("returns a fresh array (does not mutate canonical)", () => {
        const before = canonical.slice();
        mergeDeclaredIntoSchemaAttributes(canonical, new Set(["x"]));
        expect(canonical).toEqual(before);
    });
});
