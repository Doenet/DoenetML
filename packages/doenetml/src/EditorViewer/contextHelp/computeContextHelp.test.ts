import { describe, expect, it } from "vitest";
import { AutoCompleter } from "@doenet/lsp-tools";
import { doenetSchema } from "@doenet/static-assets/schema";
import {
    buildSchemaElementsByName,
    computeContextHelp,
} from "./computeContextHelp";
import type { HelpContent } from "./types";

// Use the real, generated schema rather than hand-rolled fixtures so that
// alias resolution and other cross-element behaviors are exercised against
// the same data the editor consumes at runtime.
const SCHEMA_MAP = buildSchemaElementsByName(
    doenetSchema.elements,
    doenetSchema.aliasedElements,
);

function helpAt(source: string, offset: number): HelpContent {
    return computeContextHelp(new AutoCompleter(source), offset, SCHEMA_MAP);
}

describe("computeContextHelp — element help", () => {
    it("returns element help when cursor is mid-tag-name", () => {
        const source = `<math>x</math>`;
        // Offset 3 lands between 'a' and 't' inside the opening tag name.
        const help = helpAt(source, 3);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
            docsSlug: "math",
        });
        if (help.kind === "element") {
            expect(help.summary).toBeTruthy();
        }
    });

    it("returns element help when cursor is on closing tag name", () => {
        const source = `<math>x</math>`;
        // Offset right after `</`, inside "math".
        const offset = source.indexOf("</math") + 3;
        expect(helpAt(source, offset).kind).toBe("element");
    });

    it("returns none for an unknown component", () => {
        const source = `<unknownThing/>`;
        const offset = source.indexOf("unknownThing") + 3;
        expect(helpAt(source, offset).kind).toBe("none");
    });

    it("returns none for cursor in body content", () => {
        const source = `<math>x</math>`;
        // Offset 6 is between `>` and `x`.
        expect(helpAt(source, 6).kind).toBe("none");
    });
});

describe("computeContextHelp — attribute help", () => {
    it("returns attribute help with description and defaultValue", () => {
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "point",
            attributeName: "draggable",
            defaultValue: true,
        });
        if (help.kind === "attribute") {
            expect(help.description).toBeTruthy();
        }
    });

    it("returns attribute help when cursor is inside the attribute value", () => {
        const source = `<math simplify="full"/>`;
        // Cursor between 'f' and 'u' of "full".
        const offset = source.indexOf('"full') + 2;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            attributeName: "simplify",
        });
    });

    it("prefers autocompleteValues over values for boolean-aliased enums", () => {
        // `simplify` is a string enum that also accepts "true"/"false" via
        // valueForTrue / valueForFalse. The help should surface the enum
        // values only — not the boolean aliases that are merged into `values`.
        const source = `<math simplify="full"/>`;
        const offset = source.indexOf("simplify") + 3;
        const help = helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.allowedValues).toBeDefined();
        expect(help.allowedValues).toContain("none");
        expect(help.allowedValues).not.toContain("true");
        expect(help.allowedValues).not.toContain("false");
    });
});

describe("computeContextHelp — property reference (refMember)", () => {
    it("returns property help when cursor is at end of $ref.property", () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if (help.kind === "property") {
            expect(help.propertyName.toLowerCase()).toBe("displaydecimals");
            expect(help.description).toBeTruthy();
        }
    });

    it("returns property help when cursor is in the middle of the property name", () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor inside "display|Decimals".
        const offset = source.indexOf("displayDecimals") + 7;
        expect(helpAt(source, offset).kind).toBe("property");
    });

    it("returns property help when cursor is at the start of the property name", () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor right after the dot, before any character of the property.
        const offset = source.indexOf(".displayDecimals") + 1;
        expect(helpAt(source, offset).kind).toBe("property");
    });

    it("returns none for unknown property names", () => {
        const source = `<math name="m">x</math>\n$m.notARealProperty`;
        expect(helpAt(source, source.length).kind).toBe("none");
    });

    it("returns none when the referent name doesn't match any element", () => {
        const source = `<math>x</math>\n$nonexistent.coords`;
        expect(helpAt(source, source.length).kind).toBe("none");
    });
});

describe("computeContextHelp — childAliases (sugar redirection)", () => {
    it("redirects <row> inside <matrix> to matrixRow help", () => {
        const source = `<matrix>\n  <row>1 2 3</row>\n</matrix>`;
        const offset = source.indexOf("<row>") + 2;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            // The author wrote <row>, so display "row" — but the docs link
            // and summary come from matrixRow.
            elementName: "row",
            docsSlug: "row_matrix",
        });
        if (help.kind === "element") {
            expect(help.summary).toMatch(/matrix/i);
        }
    });

    it("redirects <column> inside <matrix> to matrixColumn help", () => {
        const source = `<matrix>\n  <column>1 2 3</column>\n</matrix>`;
        const offset = source.indexOf("<column>") + 2;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "column",
            // matrixColumn points its slug at the matrix docs page.
            docsSlug: "matrix",
        });
    });

    it("uses tabular row help when <row> is NOT inside <matrix>", () => {
        const source = `<tabular>\n  <row>cell</row>\n</tabular>`;
        const offset = source.indexOf("<row>") + 2;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "row",
            docsSlug: "row_table",
        });
    });

    it("routes attribute lookup through the alias target", () => {
        // matrixRow extends MathList, so it has `functionSymbols`. Tabular
        // <row> does not. If alias redirection is wired into the attribute
        // path, this attribute resolves to non-none.
        const source = `<matrix>\n  <row functionSymbols="f">x</row>\n</matrix>`;
        const offset = source.indexOf("functionSymbols") + 3;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            attributeName: "functionSymbols",
        });
    });
});

describe("computeContextHelp — docsSlug propagation", () => {
    it("emits the default componentName-based slug when no override is set", () => {
        const source = `<math>x</math>`;
        const help = helpAt(source, 3);
        if (help.kind === "element") {
            expect(help.docsSlug).toBe("math");
        } else {
            expect.fail(`expected element help, got ${help.kind}`);
        }
    });

    it("emits the override slug for components with explicit docsSlug", () => {
        const source = `<answer>$x</answer>`;
        const help = helpAt(source, 3);
        if (help.kind === "element") {
            expect(help.docsSlug).toBe("answer1");
        } else {
            expect.fail(`expected element help, got ${help.kind}`);
        }
    });

    it("emits null docsSlug for components without a real /reference page", () => {
        // <codeEditor> is on the undocumented allow-list (no .mdx file), so
        // the schema generator clamps docsSlug to null and the help UI
        // suppresses the link.
        const source = `<codeEditor/>`;
        const offset = source.indexOf("codeEditor") + 3;
        const help = helpAt(source, offset);
        if (help.kind === "element") {
            expect(help.docsSlug).toBeNull();
        } else {
            expect.fail(`expected element help, got ${help.kind}`);
        }
    });
});
