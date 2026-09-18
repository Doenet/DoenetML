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

    it("leaves a path holding an element bare, having nowhere to put parens", () => {
        // `$(…)` is read by the string macro parser, which never sees an
        // element — that is why `gobblePropIndices` exists — so a path with an
        // element in an index has no parenthesized spelling at all. Wrapping
        // one does not protect it, it destroys it: `$(a[<n />])[` comes back as
        // four nodes with no reference among them. Bare is both what was
        // written and what parses back.
        for (const src of [
            `$a[<n />][`,
            `$a[<n />][2`,
            `$$f[<n />][`,
            `$a[<n />].y[<m />][`,
        ]) {
            expect(toXml(lezerToDast(src))).toEqual(src);
            expect(
                filterPositionInfo(lezerToDast(toXml(lezerToDast(src))))
                    .children,
                src,
            ).toEqual(filterPositionInfo(lezerToDast(src)).children);
        }
    });

    it("finds an element in a nested call's arguments, not only in an index", () => {
        // `$a[$$f(<n />)]` keeps the element in the nested function's `input`
        // rather than in any index, and prints it inside the outer reference
        // just the same — so the outer reference has no parenthesized spelling
        // either. Walking only indices lost it: `$(a[$$f(<n />)])[` is not a
        // reference at all.
        for (const src of [
            `$a[$$f(<n />)][`,
            `$a[$$f($$g(<n />))][`,
            `$a[$b[<n />]][`,
        ]) {
            expect(toXml(lezerToDast(src)), src).toEqual(src);
        }
        // ...and a nested call with no element still takes its parentheses.
        expect(toXml(lezerToDast(`$a[$$f(1)][`))).toEqual(`$(a[$$f(1)])[`);
    });

    it("uses v0.6 name rules when printing a v0.6 tree", () => {
        // `parseMacroTail` speaks v0.7, whose `SimpleIdent` takes neither a
        // leading digit nor a hyphen. v0.6's `ScopedIdent` takes both, so
        // `$(x).3-b` is a closed reference and the text `.3-b` there, while a
        // bare `$x.3-b` re-parses as a prop access — and asking only the v0.7
        // grammar dropped the parentheses and changed the tree in silence.
        for (const src of [`$(x).3-b`, `$(x).5`, `$(x).b-c`, `$(x).y`]) {
            expect(toXml(lezerToDastV6(src) as any), src).toEqual(src);
        }
        // The same v0.7 document keeps v0.7 rules: `.5` cannot start a path
        // part there, so it needs no parentheses.
        expect(toXml(lezerToDast(`$(x).5`))).toEqual(`$x.5`);
    });

    it("leaves a path bare when escaping makes the parens unreadable", () => {
        // In XML mode a `<` inside an index is escaped, and lezer gives the
        // entity its own node — so the text inside `$( … )` stops being one
        // string for the macro parser and the parenthesized form is not a
        // reference at all. Both spellings lose the index here, an entity
        // between brackets never being gobbled into one; only the parenthesized
        // spelling would also lose the reference.
        for (const [src, printed] of [
            [`$(a[x < y])[2]`, `$a[x &lt; y][2]`],
            [`$(a[x < y]).z`, `$a[x &lt; y].z`],
            [`$(a[x <= y])[2]`, `$a[x &lt;= y][2]`],
        ]) {
            expect(toXml(lezerToDast(src)), src).toEqual(printed);
            // The reference itself survives, which is the point of declining.
            expect(JSON.stringify(lezerToDast(printed)), src).toContain(
                `"type":"macro"`,
            );
        }
    });

    it("keeps them around a raw `<` that only DoenetML syntax can print", () => {
        // `doenetSyntax` un-escapes `&lt;` before whitespace or `=`, so the same
        // text index comes out holding a raw `<` and no element anywhere. That
        // form *is* readable inside parens, so it must keep them — a rule that
        // looked for `<` in the printed string dropped them here and silently
        // turned `[2]` into a second index. This is the mode the language
        // server formats in by default.
        for (const src of [
            `$(a[x < y])[2]`,
            `$(a[x < y]).z`,
            `$$(f[x < y])[2]`,
        ]) {
            const printed = toXml(lezerToDast(src), { doenetSyntax: true });
            expect(printed, src).toEqual(src);
            expect(
                filterPositionInfo(lezerToDast(printed)).children,
                src,
            ).toEqual(filterPositionInfo(lezerToDast(src)).children);
        }
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
