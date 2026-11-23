import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
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

/** `doenet-w0203` for a boolean read as a number (`booleanAsNumber`). */
function booleanAsNumber(source: string) {
    return `\`${source}\` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write \`<number convertBoolean>${source}</number>\`.`;
}

/**
 * `doenet-w0203` for a boolean read as a number in an attribute, where no
 * tag can be written.
 */
function booleanAsNumberInAttribute(source: string) {
    return `\`${source}\` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write \`<number convertBoolean>${source}</number>\` outside this attribute, give it a name, and refer to it here.`;
}

/** `doenet-w0203` for a list of booleans read as numbers. */
function booleanListAsNumbers(source: string) {
    return `\`${source}\` holds values that are true or false, not numbers, so it is a blank here. To count one as 1 or 0, write it inside a \`<number convertBoolean>\`, such as \`<number convertBoolean>${source}[1]</number>\`.`;
}

/** `doenet-w0203` for a list of numbers read as booleans. */
function numberListAsBooleans(source: string) {
    return `\`${source}\` holds numbers, not values that are true or false, so it is a blank here. To test one, write a comparison such as \`${source}[1] != 0\`.`;
}

/** `doenet-w0203` for a number read as a boolean (`numberAsBoolean`). */
function numberAsBoolean(source: string) {
    return `\`${source}\` is a number, not true or false, so it is a blank here. To test it, write a comparison such as \`${source} != 0\`.`;
}

/** `doenet-w0203` for a literal number read as a boolean. */
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
        // a blank in a repeat's template of maths takes part, as `$nothing`
        // does there (#2656)
        expect((await sv("pr")).text).eq("＿ + 1, ＿ + 1");
        // where a text is wanted, it is still the word
        expect((await sv("t")).value).eq("true");
        expect((await sv("p")).text).eq("true");
        // `convertBoolean` asks for 1 or 0, of a boolean or a boolean
        // expression
        expect((await sv("nc")).value).eq(1);
        expect((await sv("nce")).value).eq(1);

        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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

        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
    <boolean name="f">false</boolean>
    <number name="e5" extend="$nce">$f</number>
    <number name="e6" extend="$nce" convertBoolean="yes">$b</number>
    <number name="e7" extend="$ne" convertBoolean="TRUE">$f</number>
    <number name="e8" copy="$nce" convertBoolean="">$b</number>
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
        // false is 0 (a blank would be 1)
        expect((await sv("e5")).value).eq(0);
        expect((await sv("e7")).value).eq(0);
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
            [5, numberAsBoolean("$n")],
            [6, literalAsBoolean("1")],
            [
                7,
                "`$b` is true or false, not a number, so comparing it with a number is a blank. To compare it with true or false, write `$b = true`. To count it as 1 or 0, write `<number convertBoolean>$b</number>` outside this attribute, give it a name, and refer to it here.",
            ],
            [9, booleanAsNumberInAttribute("$b")],
            [15, numberAsBoolean("$n")],
            [22, booleanAsNumber("$b")],
            // read as written on the tag: only the word `true`, or no value
            [25, booleanAsNumber("$b")],
            [27, booleanAsNumber("$b")],
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

        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
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

        expect(diagnosticsOf(core, ["doenet-w0204", "doenet-w0203"])).eqls([
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
    // A mix in logic is a blank, and logic made from a blank is missing, not
    // false: a missing value never equals anything (VAL-5), so an answer
    // can't credit the response "false" for it (#2656).
    it("logic holding a mix is missing, not false", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">2</number>
    <boolean name="c1">$b = 1</boolean>
    <boolean name="c2">$n + 0</boolean>
    <boolean name="c3">$b = 1 or true</boolean>
    <boolean name="c4">not ($b = 1)</boolean>
    <boolean name="r1">$c1</boolean>
    <boolean name="r2" extend="$c1"/>
    <boolean name="r3" copy="$c1"/>
    <p name="p">$c1</p>
    <text name="t" hide="not ($b = 1)">hi</text>
    <boolean name="c5">$nothing = 1</boolean>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        for (const name of ["c1", "c2", "c3", "c4", "r1", "r2", "r3"]) {
            expect((await sv(name)).valueMissing, name).eq(true);
        }
        expect((await sv("p")).text).eq("＿");
        expect((await sv("t")).hidden).eq(false);
        // a comparison with a missing operand is missing too (VAL-5)
        expect((await sv("c5")).valueMissing).eq(true);
    });

    // A missing value never equals anything (VAL-5), so a comparison with
    // one is neither true nor false: it is missing, `!=` included. An input
    // left blank is a value, which it compares (#2656).
    it("a comparison with a missing operand is missing, not one with a blank input", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi"><label>mi</label></mathInput>
    <boolean name="c1">$nothing = 1</boolean>
    <boolean name="c2">$nothing != 1</boolean>
    <boolean name="c3">$nothing + 1 > 2</boolean>
    <boolean name="c4">($nothing = 1) or true</boolean>
    <boolean name="c5">$mi != x</boolean>
    <boolean name="c6">$mi = x</boolean>
    <answer name="a1"><award><when>$nothing != 1</when></award></answer>
    <answer name="a2"><mathInput name="mi2"><label>mi2</label></mathInput><award><when>$mi2 != 5</when></award></answer>
    <number name="n1" convertBoolean>$mi != x</number>
    <number name="n2" convertBoolean>$nothing != x</number>
    <answer name="a3"><mathInput name="mi3"><label>mi3</label></mathInput><award credit="$mi3 != 5"><when>true</when></award></answer>
    <answer name="a4"><choiceInput name="ci"><label>ci</label><choice>a</choice><choice>b</choice></choiceInput><award><when>$ci.selectedIndex != 1</when></award></answer>
    `,
        });
        for (const name of ["a1", "a2", "a3", "a4"]) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        for (const name of ["c1", "c2", "c3", "c4"]) {
            expect((await sv(name)).valueMissing, name).eq(true);
        }
        expect((await sv("c5")).value).eq(true);
        expect((await sv("c5")).valueMissing).eq(false);
        expect((await sv("c6")).value).eq(false);
        expect((await sv("c6")).valueMissing).eq(false);
        expect((await sv("a1")).creditAchieved).eq(0);
        expect((await sv("a2")).creditAchieved).eq(1);
        // the same in a `<number convertBoolean>`, and so in a `credit`
        expect((await sv("n1")).value).eq(1);
        expect((await sv("n2")).valueMissing).eq(true);
        expect((await sv("a3")).creditAchieved).eq(1);
        // a value with nothing to read yet is missing as well: no choice
        expect((await sv("a4")).creditAchieved).eq(0);
    });

    // In a `<number convertBoolean>`, also a `credit`, every boolean counts
    // as 1 or 0 (D67 decision 1), compared with a number too, which works
    // but is hard to read: `doenet-w0208` suggests the plainer form (#2656).
    it("convertBoolean, credit included, compares a boolean with a number as 1 or 0, with a warning", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <boolean name="f">false</boolean>
    <number name="n">2</number>
    <number name="n1" convertBoolean>$b = 1</number>
    <number name="n2" convertBoolean>$f = 1</number>
    <number name="n3" convertBoolean>$n = true</number>
    <number name="n4" convertBoolean>($b = 1) and true</number>
    <number name="n5" convertBoolean>$b + 1 = 2</number>
    <number name="n6" convertBoolean>$b = true</number>
    <number name="n7" convertBoolean>$nothing = 1</number>
    <answer name="a1"><award credit="$b = 1"><when>true</when></award></answer>
    <answer name="a2"><award credit="$n != true"><when>true</when></award></answer>
    <answer name="a3"><award credit="$f = 1"><when>true</when></award></answer>
    <number name="n8" convertBoolean>$n != true</number>
    <number name="n9" convertBoolean>$b = 0</number>
    <number name="n10" convertBoolean>$b > 0</number>
    <number name="n11" convertBoolean>($n > 1) = 1</number>
    `,
        });
        for (const name of ["a1", "a2", "a3"]) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        const values: Record<string, any> = {};
        for (const name of [
            "n1",
            "n2",
            "n3",
            "n4",
            "n5",
            "n6",
            "n7",
            "n8",
            "n9",
            "n10",
            "n11",
        ]) {
            const stateValues = await sv(name);
            values[name] = stateValues.valueMissing ? "＿" : stateValues.value;
        }
        expect(values).eqls({
            n1: 1,
            n2: 0,
            n3: 0,
            n4: 1,
            n5: 1,
            n6: 1,
            n7: "＿",
            n8: 1,
            n9: 0,
            n10: 1,
            n11: 1,
        });
        expect((await sv("a1")).creditAchieved).eq(1);
        expect((await sv("a2")).creditAchieved).eq(1);
        expect((await sv("a3")).creditAchieved).eq(0);

        const booleanMessage = (source: string) =>
            `Here \`${source}\` counts as 1 when true and 0 when false, so comparing it with a number works, but is hard to read. To test it, write \`${source}\` or \`${source} = true\`.`;
        const literalMessage = (rewritten: string) =>
            `Here \`true\` counts as 1, so this compares \`$n\` with 1. To say so, write \`${rewritten}\`, or, to test a number, a comparison such as \`$n != 0\`.`;
        // the form suggested means the same as the comparison written
        expect(diagnosticsOf(core, ["doenet-w0208"])).eqls([
            [5, booleanMessage("$b")],
            [6, booleanMessage("$f")],
            [7, literalMessage("$n = 1")],
            [8, booleanMessage("$b")],
            [12, booleanMessage("$b")],
            [13, literalMessage("$n != 1")],
            [14, booleanMessage("$f")],
            [15, literalMessage("$n != 1")],
            [
                16,
                "Here `$b` counts as 1 when true and 0 when false, so comparing it with a number works, but is hard to read. To test that it is false, write `not $b` or `$b = false`.",
            ],
            [
                17,
                "Here `$b` counts as 1 when true and 0 when false, so comparing it with a number works, but is hard to read. To test it, compare it with `true` or `false` instead, such as `$b = true`.",
            ],
            // logic compared with a number, too
            [18, booleanMessage("($n > 1)")],
        ]);
        // none is a mix
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([]);
    });

    // D70: any logic with a missing operand is missing, and a missing
    // boolean is false wherever it is read as a condition, through one shared
    // rule (`valueFalseWhileMissing`), with no tag or attribute of its own.
    it("a missing boolean is false wherever it is read as a condition", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi"><label>mi</label></mathInput>
    <text name="t1" hide="$nothing != 1">t1</text>
    <text name="t2" hide="not ($nothing = 1)">t2</text>
    <text name="t3" hide="$mi != x">t3</text>
    <conditionalContent><case condition="$nothing != 1"><text name="ca">A</text></case><else><text name="cb">B</text></else></conditionalContent>
    <isNumber name="i1">$nothing</isNumber>
    <isInteger name="i2">$nothing</isInteger>
    <isBetween name="i3" limits="(0,2)">$nothing</isBetween>
    <hasSameFactoring name="h1">$nothing (x+1)</hasSameFactoring>
    <matchesPattern name="m1" pattern="()^2">$nothing</matchesPattern>
    <or name="o1">$nothing true</or>
    <not name="nt">$nothing</not>
    <boolean name="b1">$nothing != 1</boolean>
    <answer name="a1"><award><when>not $i1</when></award></answer>
    `,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a1"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)]?.stateValues;

        // a missing `hide` hides nothing; a blank input is a value, compared
        expect((await sv("t1")).hidden).eq(false);
        expect((await sv("t2")).hidden).eq(false);
        expect((await sv("t3")).hidden).eq(true);
        // a missing `condition` is not met: the `<else>` is shown
        expect(await sv("ca")).eq(undefined);
        expect((await sv("cb")).value).eq("B");
        for (const name of ["i1", "i2", "i3", "h1", "m1", "o1", "nt", "b1"]) {
            const stateValues = await sv(name);
            expect(stateValues.valueMissing, name).eq(true);
            expect(stateValues.value, name).eq(false);
        }
        expect((await sv("a1")).creditAchieved).eq(0);
    });

    // D67 decision 1 (#2656 item 2)
    it("convertBoolean counts every boolean in its expression", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name="bi" prefill="true"><label>b</label></booleanInput>
    <boolean name="b">$bi</boolean>
    <number name="n">2</number>
    <number name="n1" convertBoolean>$b + 1</number>
    <number name="n2" convertBoolean>($n > 1) + $b</number>
    <number name="n3" convertBoolean>2$b</number>
    <number name="n4" convertBoolean>$b and not $b</number>
    <number name="n5" convertBoolean>$b</number>
    <number name="n6" convertBoolean>$nothing</number>
    <number name="n7" convertBoolean>$nothing + $b</number>
    <number name="n8" convertBoolean>($b and true) + 1</number>
    <number name="n9" convertBoolean>(1 < 2) + 1</number>
    <number name="n10" convertBoolean>false + 2</number>
    <number name="n11" convertBoolean>$b + t r u e</number>
    <number name="n12" convertBoolean>$b + True</number>
    <p name="p">$n6 $n7</p>
    `,
        });
        const values = async () => {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: Record<string, any> = {};
            for (const name of [
                "n1",
                "n2",
                "n3",
                "n4",
                "n5",
                "n6",
                "n7",
                "n8",
                "n9",
                "n10",
                "n11",
                "n12",
            ]) {
                const stateValues =
                    stateVariables[await resolvePathToNodeIdx(name)]
                        .stateValues;
                result[name] = stateValues.valueMissing
                    ? "＿"
                    : stateValues.value;
            }
            result.p =
                stateVariables[
                    await resolvePathToNodeIdx("p")
                ].stateValues.text;
            return result;
        };

        expect(await values()).eqls({
            n1: 2,
            n2: 2,
            n3: 2,
            n4: 0,
            n5: 1,
            n6: "＿",
            n7: "＿",
            n8: 2,
            n9: 2,
            n10: 2,
            // letters written apart are a product of unknowns, not the word
            n11: NaN,
            n12: 2,
            p: "＿ ＿",
        });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi"),
            core,
        });
        expect(await values()).eqls({
            n1: 1,
            n2: 1,
            n3: 0,
            n4: 0,
            n5: 0,
            n6: "＿",
            n7: "＿",
            n8: 1,
            n9: 2,
            n10: 2,
            n11: NaN,
            n12: 1,
            p: "＿ ＿",
        });

        // the author asked for the conversion, so none is a mix
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([]);
    });

    it("a number compared with true or false, and a boolean in arithmetic compared, are mixes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <boolean name="b">true</boolean>
    <number name="n">1</number>
    <boolean name="c1">$n = true</boolean>
    <boolean name="c2">1 = true</boolean>
    <boolean name="c3">$b + 1 = 2</boolean>
    <boolean name="c4">$b = not ($b = 1)</boolean>
    <boolean name="c5">$b = true</boolean>
    <boolean name="c6"><number>1</number> = false</boolean>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        for (const name of ["c1", "c2", "c3", "c4", "c6"]) {
            expect((await sv(name)).valueMissing, name).eq(true);
        }
        expect((await sv("c5")).value).eq(true);
        expect((await sv("c5")).valueMissing).eq(false);

        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
            [
                4,
                "`$n` is a number, not true or false, so comparing it with `true` is a blank. To test it, write a comparison such as `$n != 0`.",
            ],
            [
                5,
                "`1` is a number, not true or false, so comparing it with `true` is a blank. Write `true` or `false` instead.",
            ],
            [6, booleanAsNumber("$b")],
            [
                7,
                "`$b` is true or false, not a number, so comparing it with a number is a blank. To compare it with true or false, write `$b = true`. To count it as 1 or 0, write `<number convertBoolean>$b</number>`.",
            ],
            [
                9,
                "This `<number>` is a number, not true or false, so comparing it with `false` is a blank. To test it, write a comparison, such as one with `!= 0`.",
            ],
        ]);
    });

    // A mix is a blank in its place only (VAL-5): a tag written there is
    // still a component of its own, which a reference elsewhere reads
    // (#2656 item 5).
    it("a tag written where a mix is keeps its value elsewhere", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m1"><boolean name="q">true</boolean> + 1</math>
    <boolean name="q2">$q</boolean>
    <boolean name="c1"><number name="z">2</number> = true</boolean>
    <number name="z2">$z</number>
    <boolean name="c2"><math name="w">x</math> = x and 3</boolean>
    <math name="w2">$w</math>
    <p name="p"><math><boolean name="h">true</boolean></math></p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        expect((await sv("m1")).value.tree).eqls(["+", "＿", 1]);
        expect((await sv("q")).value).eq(true);
        expect((await sv("q2")).value).eq(true);
        expect((await sv("q2")).valueMissing).eq(false);
        expect((await sv("c1")).valueMissing).eq(true);
        expect((await sv("z2")).value).eq(2);
        expect((await sv("c2")).valueMissing).eq(true);
        expect((await sv("w2")).value.tree).eq("x");
        // kept, it shows nothing where the mix was
        expect((await sv("p")).text).eq("＿");

        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
            [
                2,
                "This `<boolean>` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write it inside a `<number convertBoolean>`.",
            ],
            [
                4,
                "This `<number>` is a number, not true or false, so comparing it with `true` is a blank. To test it, write a comparison, such as one with `!= 0`.",
            ],
            [6, literalAsBoolean("3")],
            [
                8,
                "This `<boolean>` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write it inside a `<number convertBoolean>`.",
            ],
        ]);
        expect(diagnosticsOf(core, ["doenet-w0106", "doenet-w0107"])).eqls([]);
    });

    // #2656 item 4
    it("a group holding a boolean beside other values in a math is judged at load", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m1"><group><boolean name="g">true</boolean><math>x</math></group></math>
    <boolean name="g2">$g</boolean>
    <math name="m2"><group><group><boolean>false</boolean> <math>y</math></group></group> + 1</math>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        expect((await sv("m1")).value.tree).eqls(["*", "＿", "x"]);
        expect((await sv("g2")).value).eq(true);
        expect((await sv("m2")).value.tree).eqls(["+", ["*", "＿", "y"], 1]);
        const tagMessage =
            "This `<boolean>` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write it inside a `<number convertBoolean>`.";
        expect(diagnosticsOf(core, ["doenet-w0203"])).eqls([
            [2, tagMessage],
            [4, tagMessage],
        ]);
        // no longer dropped at run time
        expect(diagnosticsOf(core, ["doenet-w0106", "doenet-w0107"])).eqls([]);
    });

    // #2656 item 6: REF-5 makes a boolean only from a text; a label stands
    // in as its text only where a text is wanted (D26)
    it("a boolean can't be made from a label", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <label name="l1">true</label>
    <boolean name="b1" extend="$l1"/>
    <boolean name="b2" copy="$l1"/>
    <text name="t1" extend="$l1"/>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)]?.stateValues;

        // a label is still made a text
        expect((await sv("t1")).value).eq("true");
        expect(diagnosticsOf(core, ["doenet-e0065"])).eqls([
            [
                3,
                "A `<boolean>` can't be made from `$l1`, which gives a `<label>`. To show it as it is, write `$l1`.",
            ],
            [
                4,
                "A `<boolean>` can't be made from `$l1`, which gives a `<label>`. To show it as it is, write `$l1`.",
            ],
        ]);
    });
});
