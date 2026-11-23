import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The diagnostics of `codes` the document reported, as `[line, message]`.
 */
function diagnosticsOf(core: any, codes: string[]) {
    return core
        .core!.diagnostics.filter((d: any) => codes.includes(d.code))
        .map((d: any) => [d.position?.start?.line, d.message])
        .sort((a: any, b: any) => a[0] - b[0]);
}

/** `doenet-w0202` for a boolean read as a number (`booleanAsNumber`). */
function booleanAsNumber(source: string) {
    return `\`${source}\` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write \`<number convertBoolean>${source}</number>\`.`;
}

/**
 * `doenet-w0202` for a boolean read as a number in an attribute, where no
 * tag can be written.
 */
function booleanAsNumberInAttribute(source: string) {
    return `\`${source}\` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write \`<number convertBoolean>${source}</number>\` outside this attribute, give it a name, and refer to it here.`;
}

/** `doenet-w0202` for a list of booleans read as numbers. */
function booleanListAsNumbers(source: string) {
    return `\`${source}\` holds values that are true or false, not numbers, so it is a blank here. To count one as 1 or 0, write it inside a \`<number convertBoolean>\`, such as \`<number convertBoolean>${source}[1]</number>\`.`;
}

/** `doenet-w0202` for a list of numbers read as booleans. */
function numberListAsBooleans(source: string) {
    return `\`${source}\` holds numbers, not values that are true or false, so it is a blank here. To test one, write a comparison such as \`${source}[1] != 0\`.`;
}

/** `doenet-w0202` for a number read as a boolean (`numberAsBoolean`). */
function numberAsBoolean(source: string) {
    return `\`${source}\` is a number, not true or false, so it is a blank here. To test it, write a comparison such as \`${source} != 0\`.`;
}

/** `doenet-w0202` for a literal number read as a boolean. */
function literalAsBoolean(source: string) {
    return `\`${source}\` is a number, not true or false, so it is a blank here. Write \`true\` or \`false\`, or, to test a number, a comparison such as \`$n != 0\`.`;
}

// Booleans and numbers are kept apart unless the author asks (D47 decisions
// 3 and 4, #2582): `<number convertBoolean>` is the one place a boolean is
// read as 1 or 0, and a comparison is how a number decides a boolean. Each
// other mix is a blank in its place (VAL-5), with a warning decided at load
// (DIAG-2), and a type change between them is a REF-5 error. Ordering a text
// against a number is warned of too (D58).
describe("Booleans and numbers kept apart @group2", () => {
    it("a boolean where a number or a math is wanted is a blank, with a warning that suggests convertBoolean", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <boolean name="f">false</boolean>
    <booleanList name="bl">true false</booleanList>
    <math name="m1">$b+1</math>
    <number name="n1">$b</number>
    <number name="n2">$b+1</number>
    <integer name="i1">$b+5</integer>
    <point name="P">($b, 2)</point>
    <mathList name="ml">$b 3</mathList>
    <numberList name="nl">$f 3</numberList>
    <sum name="s">$b 2</sum>
    <math name="mbl">$bl</math>
    <isInteger name="ii">$b</isInteger>
    <point name="Q" x="$b" y="3"/>
    <p name="pr"><repeat name="r" for="$bl" valueName="v"><math>$v+1</math></repeat></p>
    <text name="t">$b</text>
    <p name="p">$b</p>
    <number name="nc" convertBoolean>$b</number>
    <number name="nce" convertBoolean>$b and not $f</number>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        expect((await sv("m1")).value.tree).eqls(["+", "＿", 1]);
        expect((await sv("n1")).valueMissing).eq(true);
        expect((await sv("n2")).valueMissing).eq(true);
        expect((await sv("i1")).valueMissing).eq(true);
        expect((await sv("P")).xs.map((x: any) => x.tree)).eqls(["＿", 2]);
        expect((await sv("ml")).maths.map((x: any) => x.tree)).eqls(["＿", 3]);
        expect((await sv("s")).value.tree).eqls(["+", "＿", 2]);
        expect((await sv("mbl")).value.tree).eq("＿");
        expect((await sv("Q")).xs.map((x: any) => x.tree)).eqls(["＿", 3]);
        // (a blank in a repeat's template of maths is dropped, as
        // `$nothing` is there: #2596)
        // where a text is wanted, it is still the word
        expect((await sv("t")).value).eq("true");
        expect((await sv("p")).text).eq("true");
        // `convertBoolean` asks for 1 or 0, of a boolean or a boolean
        // expression
        expect((await sv("nc")).value).eq(1);
        expect((await sv("nce")).value).eq(1);

        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [5, booleanAsNumber("$b")],
            [6, booleanAsNumber("$b")],
            [7, booleanAsNumber("$b")],
            [8, booleanAsNumber("$b")],
            [9, booleanAsNumber("$b")],
            [10, booleanAsNumber("$b")],
            [11, booleanAsNumber("$f")],
            [12, booleanAsNumber("$b")],
            [13, booleanListAsNumbers("$bl")],
            [14, booleanAsNumber("$b")],
            [15, booleanAsNumberInAttribute("$b")],
            [16, booleanAsNumber("$v")],
        ]);
        // and no boolean is dropped as an invalid child
        expect(diagnosticsOf(core, ["doenet-w0106", "doenet-w0107"])).eqls([]);
    });

    it("a number or a math where a boolean is wanted is a blank, with a warning that suggests a comparison", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">2</number>
    <math name="m">x</math>
    <boolean name="b">true</boolean>
    <boolean name="b1">$n</boolean>
    <boolean name="b2">$m</boolean>
    <boolean name="b3">2</boolean>
    <text name="t1" hide="$n">hi</text>
    <text name="t2" hide="1">hi</text>
    <boolean name="b4">$b and $n</boolean>
    <booleanList name="bl">$n true</booleanList>
    <p name="pbl">$bl</p>
    <and name="a">$n $b</and>
    <boolean name="c1">$n > 0</boolean>
    <boolean name="c2">$n = 2</boolean>
    <boolean name="c3">$b = true</boolean>
    <boolean name="c4"><text>true</text> = true</boolean>
    <text name="t3" hide="true">hi</text>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        for (const name of ["b1", "b2", "b3", "b4"]) {
            expect((await sv(name)).value, name).eq(false);
        }
        expect((await sv("t1")).hidden).eq(false);
        expect((await sv("t2")).hidden).eq(false);
        expect((await sv("pbl")).text).eq("＿, true");
        expect((await sv("a")).value).eq(false);
        // a comparison decides a boolean from a number
        expect((await sv("c1")).value).eq(true);
        expect((await sv("c2")).value).eq(true);
        expect((await sv("c3")).value).eq(true);
        expect((await sv("c4")).value).eq(true);
        expect((await sv("t3")).hidden).eq(true);

        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [5, numberAsBoolean("$n")],
            [6, numberAsBoolean("$m")],
            [7, literalAsBoolean("2")],
            [8, numberAsBoolean("$n")],
            [9, literalAsBoolean("1")],
            [10, numberAsBoolean("$n")],
            [11, numberAsBoolean("$n")],
            [13, numberAsBoolean("$n")],
        ]);
    });

    it("a boolean compared with a number is a blank, with a warning, so never equal", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <boolean name="c1">$b = 1</boolean>
    <boolean name="c2">$b = true</boolean>
    <boolean name="c3"><number convertBoolean>$b</number> = 1</boolean>
    <text name="t1" hide="$b = 1">hi</text>
    <number name="nb" convertBoolean>$b</number>
    <text name="t2" hide="$nb = 1">hi</text>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        // the boolean is a blank, which never equals anything (VAL-5)
        expect((await sv("c1")).value).eq(false);
        expect((await sv("t1")).hidden).eq(false);
        // what the warnings suggest works, in content and, through a named
        // number, in an attribute
        expect((await sv("c2")).value).eq(true);
        expect((await sv("c3")).value).eq(true);
        expect((await sv("t2")).hidden).eq(true);
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [
                3,
                "`$b` is true or false, not a number, so comparing it with a number is a blank. To compare it with true or false, write `$b = true`. To count it as 1 or 0, write `<number convertBoolean>$b</number>`.",
            ],
            [
                6,
                "`$b` is true or false, not a number, so comparing it with a number is a blank. To compare it with true or false, write `$b = true`. To count it as 1 or 0, write `<number convertBoolean>$b</number>` outside this attribute, give it a name, and refer to it here.",
            ],
        ]);
    });

    it("what is written on an extend or a copy is checked as on the tag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">2</number>
    <p name="p">hello</p>
    <p name="p1" extend="$p" hide="$n"/>
    <p name="p2" extend="$p" hide="1"/>
    <p name="p3" extend="$p" hide="$b = 1"/>
    <point name="P">(1, 2)</point>
    <point name="Q" copy="$P" x="$b"/>
    <math name="Qx" extend="$Q.x"/>
    <p name="p4" extend="$p" hide="$n > 1"/>
    <point name="R" extend="$P" x="$n + 1"/>
    <math name="Rx" extend="$R.x"/>
    <boolean name="c"/>
    <boolean name="c1" extend="$c">$n</boolean>
    <boolean name="c2" extend="$c">$n > 1</boolean>
    <number name="ne"/>
    <number name="nce" convertBoolean/>
    <number name="e1" extend="$nce">$b</number>
    <number name="e2" copy="$nce">$b</number>
    <number name="e3" extend="$ne" convertBoolean>$b</number>
    <number name="e4" extend="$nce" convertBoolean="false">$b</number>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        // blanks, as on the tag: never hidden, a blank coordinate
        expect((await sv("p1")).hidden).eq(false);
        expect((await sv("p2")).hidden).eq(false);
        expect((await sv("p3")).hidden).eq(false);
        expect((await sv("Qx")).value.tree).eq("\uff3f");
        // no mix, no warning
        expect((await sv("p4")).hidden).eq(true);
        expect((await sv("Rx")).value.tree).eq(3);
        expect((await sv("c1")).value).eq(false);
        expect((await sv("c2")).value).eq(true);
        // `convertBoolean` taken from what is copied, or written on it
        expect((await sv("e1")).value).eq(1);
        expect((await sv("e2")).value).eq(1);
        expect((await sv("e3")).value).eq(1);
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [5, numberAsBoolean("$n")],
            [6, literalAsBoolean("1")],
            [
                7,
                "`$b` is true or false, not a number, so comparing it with a number is a blank. To compare it with true or false, write `$b = true`. To count it as 1 or 0, write `<number convertBoolean>$b</number>` outside this attribute, give it a name, and refer to it here.",
            ],
            [9, booleanAsNumberInAttribute("$b")],
            [15, numberAsBoolean("$n")],
            [22, booleanAsNumber("$b")],
        ]);
    });

    it("an input bound to a value of the other type is bound to a blank, with a warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">2</number>
    <mathInput name="mi" bindValueTo="$b"><label>mi</label></mathInput>
    <booleanInput name="bi" bindValueTo="$n"><label>bi</label></booleanInput>
    `,
        });

        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [
                4,
                'A `<mathInput>` can\'t edit `$b`, which is true or false, not a number, so it is bound to a blank. To edit it, write `<booleanInput bindValueTo="$b"/>`.',
            ],
            [
                5,
                'A `<booleanInput>` can\'t edit `$n`, which is a number, not true or false, so it is bound to a blank. To edit it, write `<mathInput bindValueTo="$n"/>`.',
            ],
        ]);

        // neither writes to what it would have been bound to
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(2);
    });

    it("a type change between a boolean and a number or a math is an error", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">2</number>
    <math name="m">x</math>
    <booleanInput name="bi"><label>bi</label></booleanInput>
    <math name="m1" extend="$b"/>
    <number name="n1" copy="$b"/>
    <boolean name="b1" extend="$n"/>
    <boolean name="b2" copy="$m"/>
    <math name="m2" extend="$bi"/>
    <text name="t1" extend="$b"/>
    <boolean name="b3" extend="$t1"/>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["m1", "n1", "b1", "b2", "m2"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq("_error");
        }
        // a boolean and a text still convert
        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues.value,
        ).eq("true");
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);

        const toNumber = (tag: string, source: string, sourceType: string) =>
            `A \`<${tag}>\` can't be made from \`${source}\`, which gives a \`<${sourceType}>\`: true or false is not a number. To count it as 1 or 0, write \`<number convertBoolean>${source}</number>\`.`;
        const toBoolean = (source: string, sourceType: string) =>
            `A \`<boolean>\` can't be made from \`${source}\`, which gives a \`<${sourceType}>\`: a number is not true or false. To test it, write a comparison such as \`<boolean>${source} != 0</boolean>\`.`;
        expect(diagnosticsOf(core, ["doenet-e0065"])).eqls([
            [6, toNumber("math", "$b", "boolean")],
            [7, toNumber("number", "$b", "boolean")],
            [8, toBoolean("$n", "number")],
            [9, toBoolean("$m", "math")],
            [10, toNumber("math", "$bi", "booleanInput")],
        ]);
    });

    it("a boolean in a random choice's parameter is not analysable, unless through convertBoolean", async () => {
        const { core } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <selectFromSequence name="s1" from="0" to="$b+2"/>
    <number name="nb" convertBoolean>$b</number>
    <selectFromSequence name="s2" from="0" to="$nb+2"/>
    `,
        });
        const errors = diagnosticsOf(core, ["doenet-e0074"]);
        expect(errors.map(([line]: any) => line)).eqls([3]);
        expect(errors[0][1]).toContain("reads `$b`");
    });

    it("the warnings are decided at load, in content not shown", async () => {
        const { core } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">2</number>
    <conditionalContent>
        <case condition="false"><math>$b + 1</math><boolean>$n</boolean></case>
    </conditionalContent>
    `,
        });
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [5, booleanAsNumber("$b")],
            [5, numberAsBoolean("$n")],
        ]);
    });

    // `<number convertBoolean>$bl</number>` of several booleans is no
    // number, so the warning for a list suggests an entry
    it("for a list, the warning suggests an entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanList name="bl">true false</booleanList>
    <mathList name="ml">1 0</mathList>
    <mathList name="m1">$bl</mathList>
    <boolean name="b1">$ml</boolean>
    <number name="n1" convertBoolean>$bl[1]</number>
    <boolean name="b2">$ml[1] != 0</boolean>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const value = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.value;
        // what each suggests works
        expect(await value("n1")).eq(1);
        expect(await value("b2")).eq(true);
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [4, booleanListAsNumbers("$bl")],
            [5, numberListAsBooleans("$ml")],
        ]);
    });

    // a component written in place is named by its tag, and an expression
    // as written
    it("the warning names a component written in place by its tag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="n">3</number>
    <math name="m1"><boolean>true</boolean> + 1</math>
    <boolean name="c1"><boolean>true</boolean> = 1</boolean>
    <boolean name="d1"><math>3</math></boolean>
    <boolean name="d2">$n + 1</boolean>
    <math name="m1f"><number convertBoolean><boolean>true</boolean></number> + 1</math>
    <boolean name="c1f"><number convertBoolean><boolean>true</boolean></number> = 1</boolean>
    <boolean name="d1f"><math>3</math> != 0</boolean>
    <boolean name="d2f">$n + 1 != 0</boolean>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        expect((await sv("m1")).value.tree).eqls(["+", "＿", 1]);
        for (const name of ["c1", "d1", "d2"]) {
            expect((await sv(name)).value, name).eq(false);
        }
        // what each suggests works
        expect((await sv("m1f")).value.tree).eqls(["+", 1, 1]);
        for (const name of ["c1f", "d1f", "d2f"]) {
            expect((await sv(name)).value, name).eq(true);
        }
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [
                3,
                "This `<boolean>` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write it inside a `<number convertBoolean>`.",
            ],
            [
                4,
                "This `<boolean>` is true or false, not a number, so comparing it with a number is a blank. Compare it with `true` or `false` instead, or, to count it as 1 or 0, write it inside a `<number convertBoolean>`.",
            ],
            [
                5,
                "This `<math>` is a number, not true or false, so it is a blank here. To test it, write a comparison, such as one with `!= 0`.",
            ],
            [6, numberAsBoolean("$n + 1")],
        ]);
    });

    it("composites nested by reference are read once", async () => {
        // Each case and else names the next composite, so listing the
        // items of every path would read the innermost group 2^24 times.
        const depth = 24;
        let doenetML = `<booleanInput name="bi"/>\n<group name="g${depth}"><math>x</math></group>\n`;
        for (let k = depth - 1; k >= 0; k--) {
            doenetML += `<conditionalContent name="g${k}"><case condition="$bi">$g${k + 1}</case><else>$g${k + 1}</else></conditionalContent>\n`;
        }
        doenetML += `<boolean name="b">$g0</boolean>\n<math name="m">$g0 + 1</math>`;
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        expect((await sv("b")).value).eq(false);
        expect((await sv("m")).value.tree).eqls(["+", "x", 1]);
        expect(diagnosticsOf(core, ["doenet-w0202"])).eqls([
            [depth + 3, numberAsBoolean("$g0")],
        ]);
    }, 15000);

    // D58: a text ordered against a number is never true. Nothing is
    // converted, and `=` is unchanged.
    it("ordering a text against a number is warned of at load", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s"><title>A</title>
    <text name="t">abc</text>
    <boolean name="c1">$s.sectionNumber > 2</boolean>
    <boolean name="c2">$t > 2</boolean>
    <boolean name="c3">$s.sectionNumber = 1</boolean>
    <boolean name="c4">1 &lt; $t &lt;= 3</boolean>
    <boolean name="c5">$s.ownNumber > 0</boolean>
    </section>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const value = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.value;
        expect(await value("c1")).eq(false);
        expect(await value("c2")).eq(false);
        expect(await value("c3")).eq(true);
        expect(await value("c5")).eq(true);

        expect(diagnosticsOf(core, ["doenet-w0203", "doenet-w0202"])).eqls([
            [
                4,
                "`$s.sectionNumber` is a text, so ordering it against a number with `>` is never true. To compare the section's own position as a number, write `$s.ownNumber`.",
            ],
            [
                5,
                "`$t` is a text, so ordering it against a number with `>` is never true.",
            ],
            [
                7,
                "`$t` is a text, so ordering it against a number with `<` is never true.",
            ],
            [
                7,
                "`$t` is a text, so ordering it against a number with `<=` is never true.",
            ],
        ]);
    });
});
