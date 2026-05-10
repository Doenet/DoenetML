import { describe, expect, it } from "vitest";
import { AutoCompleter } from "@doenet/lsp-tools";
import { computeContextHelp } from "./computeContextHelp";
import type { HelpContent } from "./types";

// Default `new AutoCompleter(source)` already binds the bundled doenetSchema
// + aliasedElements, so alias resolution and other cross-element behaviours
// are exercised against the same data the editor consumes at runtime.
function helpAt(source: string, offset: number): HelpContent {
    return computeContextHelp(new AutoCompleter(source), offset);
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

    it("resolves elements case-insensitively and displays the canonical name", () => {
        const source = `<MaTh>x</MaTh>`;
        const help = helpAt(source, 3);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
            docsSlug: "math",
        });
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

    it("resolves attributes case-insensitively and displays the canonical name", () => {
        const source = `<point DrAgGaBlE="true"/>`;
        const offset = source.indexOf("DrAgGaBlE") + 3;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "point",
            attributeName: "draggable",
        });
    });

    it("preserves an explicit null defaultValue", () => {
        // <slider initialValue> declares `defaultValue: null` to mean
        // "no initial value". The help pipeline must surface the null
        // through to the panel (which then chooses to hide the Default
        // row entirely rather than render a misleading value).
        const source = `<slider initialValue="3"/>`;
        const offset = source.indexOf("initialValue") + 3;
        const help = helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.defaultValue).toBeNull();
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

    it("returns an unsupportedRefChain placeholder for multi-part chains under the JS fallback", () => {
        // Without a Rust resolver adapter, the JS fallback can only
        // resolve `$ref.prop`. For longer chains it would otherwise
        // look up the cursor identifier as a property of the root,
        // producing wrong help — so we surface a placeholder instead.
        // Tracked in #1086.
        const source = `<math name="m">x</math>\n$m.foo.displayDecimals`;
        expect(helpAt(source, source.length).kind).toBe("unsupportedRefChain");
    });
});

describe("computeContextHelp — bare ref ($name)", () => {
    it("returns refName help when cursor is on a bare $name", () => {
        const source = `<math name="m">x</math>\n$m`;
        const help = helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            // For bare refs the displayed chain is just the ref name itself.
            displayPath: "m",
            targetElementName: "math",
            docsSlug: "math",
        });
        if (help.kind === "refName") {
            // <math> starts at offset 0 — line 1.
            expect(help.line).toBe(1);
            expect(help.summary).toBeTruthy();
        }
    });

    it("returns refName help when cursor is mid-identifier on $myName", () => {
        const source = `<math name="myName">x</math>\n$myName`;
        // Cursor between 'y' and 'N' inside "myName" of the ref.
        const offset = source.length - 4;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "myName",
            targetElementName: "math",
        });
    });

    it("returns refName help when cursor sits on the name segment of $name.descendant", () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor right after the 'm', before the '.'.
        const offset = source.indexOf("$m") + 2;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            targetElementName: "math",
        });
    });

    it("returns none for a $name that doesn't resolve", () => {
        const source = `<math>x</math>\n$nonexistent`;
        expect(helpAt(source, source.length).kind).toBe("none");
    });

    it("uses the alias target's summary and docsSlug for $name inside <matrix>", () => {
        // <row name="r"> inside <matrix> sugars to matrixRow. The bare-ref
        // help should follow the same alias redirection as element/attribute/
        // property help so the docs link lands on the matrixRow page.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r`;
        const help = helpAt(source, source.length);
        if (help.kind !== "refName") {
            expect.fail(`expected refName help, got ${help.kind}`);
            return;
        }
        expect(help.refName).toBe("r");
        expect(help.targetElementName).toBe("row");
        expect(help.docsSlug).toBe("row_matrix");
        expect(help.summary).toMatch(/matrix/i);
    });

    it("reports the line where the referent is defined", () => {
        const source = `<p>intro</p>\n<p>more</p>\n<math name="m">x</math>\n$m`;
        const help = helpAt(source, source.length);
        if (help.kind !== "refName") {
            expect.fail(`expected refName help, got ${help.kind}`);
            return;
        }
        // <math> sits on line 3 in the authored source.
        expect(help.line).toBe(3);
    });
});

describe("computeContextHelp — refMember resolving to a named descendant", () => {
    it("returns refName help when $sec.bi resolves to a named child element", () => {
        const source = `<section name="sec"><booleanInput name="bi"/></section>\n$sec.bi`;
        const help = helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "bi",
            displayPath: "sec.bi",
            targetElementName: "booleanInput",
            docsSlug: "booleanInput",
        });
        if (help.kind === "refName") {
            expect(help.summary).toBeTruthy();
        }
    });

    it("returns refName help with cursor mid-segment in $sec.bi.fixed (cursor on bi)", () => {
        // The chain has three parts but the cursor sits on the middle
        // segment, so the question is "what is $sec.bi?" — a 2-part chain.
        // The booleanInput descendant of section answers it; the trailing
        // ".fixed" is irrelevant to help at this cursor position.
        const source = `<section name="sec"><booleanInput name="bi"/></section>\n$sec.bi.fixed`;
        // Cursor right after the second 'i' in 'bi', before the '.'.
        const offset = source.indexOf(".bi.fixed") + 3;
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "bi",
            displayPath: "sec.bi",
            targetElementName: "booleanInput",
        });
    });

    it("falls through to property help when no named descendant matches", () => {
        // `displayDecimals` is a math property; <math> has no descendants
        // named "displayDecimals", so the existing property branch handles
        // it and we get property help, not refName help.
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = helpAt(source, source.length);
        expect(help.kind).toBe("property");
    });

    it("prefers a named descendant over a same-named property (descendants shadow properties)", () => {
        // Construct a case where the property name is shadowed by a child
        // element with the same name. <section> has a `hidden` property
        // (inherited from base components); a child element named "hidden"
        // shadows the property under runtime ref-resolution rules.
        const source = `<section name="sec"><booleanInput name="hidden"/></section>\n$sec.hidden`;
        const help = helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "hidden",
            targetElementName: "booleanInput",
        });
    });
});

describe("computeContextHelp — hyphenated names in $(...) macros", () => {
    it("resolves a hyphenated bare ref name with cursor mid-identifier", () => {
        // The rightward identifier scan must use the macro char class
        // (`[A-Za-z0-9_-]`) when the cursor sits inside `$(...)`, so a cursor
        // between the `o` of "foo" and the `-` of "-bar" still captures the
        // full "foo-bar" rather than truncating at `-`. The displayed path
        // wraps the hyphenated segment in parens so the sentence reads
        // `$(foo-bar) references <math> ...`.
        const source = `<math name="foo-bar">x</math>\n$(foo-bar)`;
        const offset = source.indexOf("foo-bar)") + 3; // between 'foo' and '-bar'
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "foo-bar",
            displayPath: "(foo-bar)",
            targetElementName: "math",
        });
    });

    it("resolves a hyphenated descendant name in $(base).(my-p) with cursor mid-identifier", () => {
        // `$(base).(my-p)` should resolve to the descendant `<p name="my-p"/>`,
        // not truncate at the hyphen and fall through to property lookup.
        // Only the hyphenated segment is wrapped in parens.
        const source = `<section name="base"><p name="my-p"/></section>\n$(base).(my-p)`;
        const offset = source.indexOf("my-p)") + 2; // between 'my' and '-p'
        const help = helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "my-p",
            displayPath: "base.(my-p)",
            targetElementName: "p",
        });
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

    it("routes $ref.property lookup through the alias target", () => {
        // `maxNumber` lives on matrixRow (math-list semantics), not on the
        // canonical tabular `row` entry. Without alias-aware property
        // resolution, $r.maxNumber inside <matrix> would surface no help —
        // disagreeing with the autocomplete dropdown, which IS alias-aware.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r.maxNumber`;
        const help = helpAt(source, source.length);
        if (help.kind !== "property") {
            expect.fail(`expected property help, got ${help.kind}`);
            return;
        }
        expect(help.elementName).toBe("row"); // authored name preserved
        expect(help.propertyName.toLowerCase()).toBe("maxnumber");
        expect(help.description).toBeTruthy();
        // docsSlug follows the alias redirect, like helpForElement /
        // helpForAttribute do — so the link points at the matrixRow page.
        expect(help.docsSlug).toBe("row_matrix");
    });

    it("returns none for a $ref.property whose name only exists on the canonical entry when alias is in scope", () => {
        // `rowNum` is a tabular-row property. Inside <matrix>, the `<row>`
        // is sugared to matrixRow, which has no `rowNum`. Returning none
        // (rather than the misleading tabular description) keeps the panel
        // honest about what's in scope.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r.rowNum`;
        expect(helpAt(source, source.length).kind).toBe("none");
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

    it("attribute help carries the owning element's docsSlug", () => {
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.docsSlug).toBe("point");
    });

    it("attribute help on alias-redirected child uses the alias target's slug", () => {
        // `<row>` inside `<matrix>` is sugared to `<matrixRow>`. Help text
        // and the docs link must follow the alias so the link goes to the
        // matrixRow page, not the unrelated tabular row page.
        const source = `<matrix>\n  <row functionSymbols="f">x</row>\n</matrix>`;
        const offset = source.indexOf("functionSymbols") + 3;
        const help = helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.docsSlug).toBe("row_matrix");
    });

    it("property help carries the resolved container's docsSlug", () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = helpAt(source, source.length);
        if (help.kind !== "property") {
            expect.fail(`expected property help, got ${help.kind}`);
            return;
        }
        expect(help.docsSlug).toBe("math");
    });
});
