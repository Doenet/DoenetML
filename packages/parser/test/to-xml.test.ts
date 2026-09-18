import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { lezerToDastV6 } from "../src/lezer-to-dast/lezer-to-dast-v6";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import { filterPositionInfo } from "../src/dast-to-xml/utils";
import util from "util";
import { DastRoot } from "../src/types";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("parser", () => {
    let source: string;
    let dast: DastRoot;
    let xml: string;

    it("can print basic doenet to xml", () => {
        source = `abc`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("abc");

        source = `<p>abc</p>`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<p>abc</p>");

        source = `<foo />`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<foo />");
    });

    it("can print macros", () => {
        source = `$foo.bar`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$foo.bar");
    });

    it("can print function macros", () => {
        source = `$$foo(x)`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$$foo(x)");
    });

    it("keeps parens on a macro whose following text would be absorbed into it", () => {
        // `$x` printed directly before `_0` would re-parse as a macro named `x_0`,
        // so the macro has to be printed in its `$(...)` form instead.
        for (const src of [`$(x)_0`, `$(x)y`, `$(x1)1`, `$(foo.bar)_1`]) {
            dast = lezerToDast(src);
            xml = toXml(dast);
            expect(xml).toEqual(src);
        }

        // A function macro with no arguments needs the same treatment.
        dast = lezerToDast(`$$(f)_0`);
        expect(toXml(dast)).toEqual("$$(f)_0");

        // The v0.6 serializer needs the same treatment, since `toXml` accepts a v0.6 tree.
        expect(toXml(lezerToDastV6(`$(x)_0`) as any)).toEqual(`$(x)_0`);
        // ...including in a function macro's arguments, an index, and a macro attribute,
        // which the v0.6 serializer renders itself rather than through `nodesToXml`.
        expect(toXml(lezerToDastV6(`$$f($(x)_0)`) as any)).toEqual(
            `$$f($(x)_0)`,
        );
        expect(toXml(lezerToDastV6(`$a[$(x)_0]`) as any)).toEqual(`$a[$(x)_0]`);
        // The macro-attribute path renders through `arrayToString`, which nothing else
        // reaches.
        expect(toXml(lezerToDastV6(`$a{b="$(x)_0"}`) as any)).toEqual(
            `$a{b="$(x)_0"}`,
        );

        // ...and drops them again when nothing would run on, as the v0.7 one does.
        expect(toXml(lezerToDastV6(`$(x) 0`) as any)).toEqual(`$x 0`);

        // ...but a macro that is not followed by a name character stays unwrapped.
        for (const src of [`$x 0`, `$x-0`, `<p>$x</p>`, `$x!`, `$x$y`]) {
            dast = lezerToDast(src);
            expect(toXml(dast)).toEqual(src);
        }
    });

    it("does not add parens to a macro that already ends in a delimiter", () => {
        // These all parse as a macro followed by separate text even without parens,
        // because `]`, `}` and the closing paren of a function macro's arguments end the
        // macro on their own. Printing must not gratuitously wrap them.
        for (const src of [`$a[$b]c`, `$f{a="1"}_0`, `$$f(1)_0`]) {
            dast = lezerToDast(src);
            expect(toXml(dast)).toEqual(src);
        }
    });

    it("looks past a sibling that prints nothing", () => {
        // An error node prints as the empty string, so the text after it still lands
        // directly against the macro.
        const tree = {
            type: "root",
            children: [
                {
                    type: "macro",
                    path: [{ type: "pathPart", name: "x", index: [] }],
                    attributes: {},
                    accessedProp: null,
                },
                { type: "error", message: "oops" },
                { type: "text", value: "_0" },
            ],
        } as unknown as DastRoot;
        expect(toXml(tree)).toEqual("$(x)_0");
    });
});

describe("a reference keeps its parens whenever dropping them would change the document", () => {
    // `$(…)` closes a reference's path. `$(x)[1]` is a reference followed by the
    // literal text `[1]`; `$x[1]` is a reference *with an index*, which resolves to
    // something else entirely. Printing used to turn the first into the second.
    it("keeps them before an index, a property or a brace block", () => {
        for (const src of [
            `$(x)[1]`,
            `$(x).y`,
            `$(x){z}`,
            `$(x)[<n />]`,
            `$a[$(x)[<n />]]`,
            `$$(f)[1]`,
            // An index does not close a path — `$a[1][2]` is one reference — so a
            // reference that already ends in `]` needs them too.
            `$(a[1])[2]`,
            `$(a[1]).y`,
        ]) {
            expect(toXml(lezerToDast(src))).toEqual(src);
        }
        expect(toXml(lezerToDastV6(`$(x).y`) as any)).toEqual(`$(x).y`);
        expect(toXml(lezerToDastV6(`$(x)[1]`) as any)).toEqual(`$(x)[1]`);
    });

    it("drops them when what follows could not be part of the path", () => {
        // A path part's name has to start with a letter or an underscore, and a
        // reference is closed by its own parens, its brace block or its argument
        // list — so none of these needs wrapping to stay two things.
        for (const [src, printed] of [
            [`$(x).5`, `$x.5`],
            // A brace block whose value was written without quotes is not a brace
            // block — `$x{fixed=$b}` parses as a reference and three siblings — so
            // there is nothing for parentheses to protect. `parseMacroTail` is what
            // tells the two apart; a hand-rolled test on the leading `{` could not.
            [`$(x){fixed=$b}`, `$x{fixed=$b}`],
            [`$(x) [1]`, `$x [1]`],
            [`$(x)`, `$x`],
            [`$(a.b[1].c)`, `$a.b[1].c`],
            [`$$(f)(y)`, `$$f(y)`],
        ]) {
            expect(toXml(lezerToDast(src))).toEqual(printed);
            // ...and what comes back means what went in. Re-printing the
            // printed form is not enough to say so: a `$x.5` that had become a
            // property access would print back as `$x.5` too. The trees are
            // what has to agree.
            expect(
                filterPositionInfo(lezerToDast(printed).children),
                `${src} -> ${printed}`,
            ).toEqual(filterPositionInfo(lezerToDast(src).children));
        }
    });
});
