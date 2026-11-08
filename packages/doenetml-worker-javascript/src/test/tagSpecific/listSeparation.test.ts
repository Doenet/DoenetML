import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The one rule for separating the entries of a list written as text
 * (Doenet/DoenetML#2492): commas if the text has a comma outside brackets,
 * spaces otherwise; balanced brackets keep their contents together, any
 * closer closing any opener; brackets that don't balance are ignored, with a
 * warning; every comma separates two entries.
 */
describe("Separating the entries of a list @group4", async () => {
    async function textsOf(doenetML: string, names: string[]) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const name of names) {
            texts[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return { texts, core, stateVariables, resolvePathToNodeIdx };
    }

    it("math lists separate by commas if there is one, spaces otherwise", async () => {
        const { texts } = await textsOf(
            `
    <p name="spaces"><mathList>x y z</mathList></p>
    <p name="spacesInExpression"><mathList>x + 1 y</mathList></p>
    <p name="commas"><mathList>x + 1, y</mathList></p>
    <p name="commasNoSpace"><mathList>a,b</mathList></p>
    <p name="commaSpaced"><mathList>a , b</mathList></p>
    <p name="product"><mathList>x y, z</mathList></p>
    <p name="function"><mathList>f(x, y) z</mathList></p>
    <p name="functionComma"><mathList>f(x, y), z</mathList></p>
    <p name="trailing"><mathList>a,</mathList></p>
    <p name="repeated"><mathList>a,,b</mathList></p>
    `,
            [
                "spaces",
                "spacesInExpression",
                "commas",
                "commasNoSpace",
                "commaSpaced",
                "product",
                "function",
                "functionComma",
                "trailing",
                "repeated",
            ],
        );
        expect(texts.spaces).eq("x, y, z");
        expect(texts.spacesInExpression).eq("x, +, 1, y");
        expect(texts.commas).eq("x + 1, y");
        expect(texts.commasNoSpace).eq("a, b");
        expect(texts.commaSpaced).eq("a, b");
        expect(texts.product).eq("x y, z");
        expect(texts.function).eq("f(x, y), z");
        expect(texts.functionComma).eq("f(x, y), z");
        expect(texts.trailing).eq("a, ＿");
        expect(texts.repeated).eq("a, ＿, b");
    });

    it("number, text and boolean lists follow the same rule", async () => {
        const { texts, stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <p name="numbers"><numberList name="nl">1 + 1, 3</numberList></p>
    <p name="numbersNoSpace"><numberList>1,2</numberList></p>
    <p name="numbersSpaces"><numberList>1 2 3</numberList></p>
    <p name="texts"><textList name="tl">hello world, goodbye</textList></p>
    <p name="textsSpaces"><textList>a b c</textList></p>
    <p name="textsBrackets"><textList name="tl2">f(a, b) g</textList></p>
    <p name="booleans"><booleanList>true, false</booleanList></p>
    `,
            [
                "numbers",
                "numbersNoSpace",
                "numbersSpaces",
                "texts",
                "textsSpaces",
                "textsBrackets",
                "booleans",
            ],
        );
        expect(texts.numbers).eq("2, 3");
        expect(texts.numbersNoSpace).eq("1, 2");
        expect(texts.numbersSpaces).eq("1, 2, 3");
        expect(texts.texts).eq("hello world, goodbye");
        expect(
            stateVariables[await resolvePathToNodeIdx("tl")].stateValues.texts,
        ).eqls(["hello world", "goodbye"]);
        expect(texts.textsSpaces).eq("a, b, c");
        expect(
            stateVariables[await resolvePathToNodeIdx("tl2")].stateValues.texts,
        ).eqls(["f(a, b)", "g"]);
        expect(texts.booleans).eq("true, false");
    });

    it("lists of points, vectors, intervals and tuples take either separator", async () => {
        const { texts } = await textsOf(
            `
    <p name="points"><pointList>(1, 2), (3, 4)</pointList></p>
    <p name="pointsSpaces"><pointList>(1, 2) (3, 4)</pointList></p>
    <p name="vectors"><vectorList>(1, 2), (3, 4)</vectorList></p>
    <p name="intervals"><intervalList>(1, 2], [3, 4)</intervalList></p>
    <p name="intervalsSpaces"><intervalList>(1, 2] [3, 4)</intervalList></p>
    <p name="tuples"><tupleList>(1, 2), (3, 4)</tupleList></p>
    `,
            [
                "points",
                "pointsSpaces",
                "vectors",
                "intervals",
                "intervalsSpaces",
                "tuples",
            ],
        );
        expect(texts.points).eq("(1, 2), (3, 4)");
        expect(texts.pointsSpaces).eq("(1, 2), (3, 4)");
        expect(texts.vectors).eq("(1, 2), (3, 4)");
        expect(texts.intervals).eq("(1, 2], [3, 4)");
        expect(texts.intervalsSpaces).eq("(1, 2], [3, 4)");
        expect(texts.tuples).eq("(1, 2), (3, 4)");
    });

    it("a reference is part of the entry it is written in, and its commas don't choose commas", async () => {
        const { texts } = await textsOf(
            `
    <math name="a">3</math>
    <mathList name="l">1, 2</mathList>
    <p name="mixed"><mathList>2$a + 1, y</mathList></p>
    <p name="refList"><mathList>$l z</mathList></p>
    `,
            ["mixed", "refList"],
        );
        expect(texts.mixed).eq("2 * 3 + 1, y");
        expect(texts.refList).eq("1, 2, z");
    });

    it("list attributes follow the rule", async () => {
        const { stateVariables, resolvePathToNodeIdx, texts } = await textsOf(
            `
    <p name="r1"><repeat for="1, 2, 3" valueName="v">[$v]</repeat></p>
    <p name="r2"><repeat for="1 2 3" valueName="v">[$v]</repeat></p>
    <p name="r3"><repeat for="x + 1, y" valueName="v">[$v]</repeat></p>
    <polygon name="pg" vertices="(0,0), (1,0), (0,1)"/>
    <function name="f" variables="x, y">x y</function>
    `,
            ["r1", "r2", "r3"],
        );
        expect(texts.r1).eq("[1], [2], [3]");
        expect(texts.r2).eq("[1], [2], [3]");
        expect(texts.r3).eq("[x + 1], [y]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pg")].stateValues
                .numVertices,
        ).eq(3);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("f")
            ].stateValues.variables.map((v) => v.tree),
        ).eqls(["x", "y"]);
    });

    it("select options follow the rule", async () => {
        const { stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <select name="s1" numToSelect="3">x + 1, y, z</select>
    <select name="s2" numToSelect="2" type="text">hello world, goodbye</select>
    `,
            [],
        );
        const s1 = stateVariables[await resolvePathToNodeIdx("s1")].stateValues;
        expect(s1.nOptions).eq(3);
        const s2 = stateVariables[await resolvePathToNodeIdx("s2")].stateValues;
        expect(s2.nOptions).eq(2);
    });

    it("operators follow the rule, each reference an operand of its own", async () => {
        const { texts, stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <number name="a">3</number>
    <number name="b">4</number>
    <sum name="s1" simplify>1 + 1, 3</sum>
    <sum name="s2">1 2 3</sum>
    <sum name="s3">$a$b, 1</sum>
    <max name="m" simplify>1 + 5, 3</max>
    <boolean name="t" extend="$and1"/>
    <and name="and1">1 < 2, 3 > 2</and>
    <p name="sorted"><sort>3 + 1, 2, 10</sort></p>
    `,
            ["sorted"],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("s1")].stateValues.value
                .tree,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("s2")].stateValues.value
                .tree,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("s3")].stateValues.value
                .tree,
        ).eq(8);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq(6);
        expect(
            stateVariables[await resolvePathToNodeIdx("and1")].stateValues
                .value,
        ).eq(true);
        expect(texts.sorted).eq("2, 4, 10");
    });

    it("a copy that gives a sort a type reads its text as the sort does", async () => {
        // The copy reads the sort's text again with its own `type`, so its
        // entries are the sort's: `b a` is one entry, with a comma.
        const { texts } = await textsOf(
            `
    <number name="x">5</number>
    <p name="p1"><sort name="s" type="text">b a, c</sort></p>
    <p name="p2"><sort copy="$s" type="text" /></p>
    <p name="p3"><sort name="m">3 + 1, 2, 10</sort></p>
    <p name="p4"><sort copy="$m" type="text" /></p>
    <p name="p5"><sort name="r">10 $x (1 + 2) 3</sort></p>
    <p name="p6"><sort copy="$r" type="text" /></p>
    `,
            ["p1", "p2", "p3", "p4", "p5", "p6"],
        );
        expect(texts.p1).eq("b a, c");
        expect(texts.p2).eq("b a, c");
        expect(texts.p3).eq("2, 4, 10");
        expect(texts.p4).eq("10, 2, 3 + 1");
        expect(texts.p5).eq("3, 3, 5, 10");
        expect(texts.p6).eq("(1 + 2), 10, 3, 5");
    });

    it("sizes and grids take either separator", async () => {
        const { stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <sideBySide name="sbs" widths="30%, 70%"><p>a</p><p>b</p></sideBySide>
    <graph name="g" grid="1, 2"><shortDescription>A grid</shortDescription></graph>
    `,
            [],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("sbs")].stateValues
                .widths,
        ).eqls([30, 70]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.grid,
        ).eqls([1, 2]);
    });

    it("brackets that don't balance are ignored, with a warning", async () => {
        const { stateVariables, resolvePathToNodeIdx, core } = await textsOf(
            `
    <textList name="tl">a) apple, b) banana</textList>
    <mathList name="ml">f(a, b</mathList>
    <p><sum>1 2)</sum> <and>true (false</and></p>
    <graph><curve through="(0,0) (1,1) (2,0)"><bezierControls>(1, 1) (2, 2</bezierControls></curve></graph>
    `,
            [],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("tl")].stateValues.texts,
        ).eqls(["a) apple", "b) banana"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("ml")].stateValues
                .numComponents,
        ).eq(2);

        const warnings = getDiagnosticsByType(core).warnings.filter(
            (w) => w.code === "doenet-w0188",
        );
        // each names the component whose text it is, not that component's
        // parent
        expect(warnings.length).eq(5);
        expect(warnings[0].message).contains("<textList>");
        expect(warnings[1].message).contains("<mathList>");
        expect(warnings[2].message).contains("<sum>");
        expect(warnings[3].message).contains("<and>");
        expect(warnings[4].message).contains("<bezierControls>");
    });

    it("brackets that don't balance in a select or a repeat are reported", async () => {
        const { core, stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <select name="s" numToSelect="2" type="text">a) b, c</select>
    <p name="r"><repeat for="(1, 2" valueName="v" type="text">[$v]</repeat></p>
    `,
            ["r"],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("s")].stateValues
                .nOptions,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("r")].stateValues.text,
        ).eq("[(1], [2]");
        const warnings = getDiagnosticsByType(core).warnings.filter(
            (w) => w.code === "doenet-w0188",
        );
        expect(warnings.length).eq(2);
    });

    it("a copy of a list splits its text as the list does", async () => {
        // With a comma, `hello world` is one entry, which the list keeps as
        // text on its own beside the `<text>` child, so how it was split has
        // to go with it into each copy.
        const { stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <p name="p1"><textList name="t"><text>x</text>, hello world</textList></p>
    <textList name="t2" copy="$t" />
    <textList name="t3" extend="$t" />
    <p name="p2" extend="$p1" />
    <p name="p3" copy="$p2" />
    `,
            [],
        );
        for (const name of ["t", "t2", "t3", "p2.t", "p3.t"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .texts,
                name,
            ).eqls(["x", "hello world"]);
        }
    });

    it("text a composite child gives is split by the rule on its own", async () => {
        // The list's own text is split as its sugar split it; text from a
        // `<conditionalContent>` or `<repeat>` its sugar never saw.
        const { texts } = await textsOf(
            `
    <p name="commasThenSpaces"><numberList>1, 2 <conditionalContent condition="true">3 4</conditionalContent></numberList></p>
    <p name="spacesThenCommas"><mathList>1 2 <conditionalContent condition="true">x, y</conditionalContent></mathList></p>
    <p name="repeat"><textList>a, b <repeat for="1" valueName="v">c d</repeat></textList></p>
    `,
            ["commasThenSpaces", "spacesThenCommas", "repeat"],
        );
        expect(texts.commasThenSpaces).eq("1, 2, 3, 4");
        expect(texts.spacesThenCommas).eq("1, 2, x, y");
        expect(texts.repeat).eq("a, b, c, d");
    });

    it("a character outside the basic plane doesn't stop text being one group in brackets", async () => {
        const { stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <intervalList name="il">(1, 2) [😀, 4]</intervalList>
    `,
            [],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("il")].stateValues
                .numComponents,
        ).eq(2);
    });

    it("removeStrings separates by spaces alone, since a comma is often one", async () => {
        const { stateVariables, resolvePathToNodeIdx } = await textsOf(
            `
    <mathInput name="mi" removeStrings=", $" />
    `,
            [],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues
                .removeStrings,
        ).eqls([",", "$"]);
    });
});
