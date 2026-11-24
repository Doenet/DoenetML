import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Which value a tag may be made from (REF-5): a text is never read as a
 * boolean (D68), a component becomes only what it stands in as (D69), an
 * angle is a math both ways (D66 decision 17), a value that doesn't convert
 * is missing with an info, and an input made from a value suggests the
 * input holding it (D65 decision 6). Each is decided when the document
 * loads, so the diagnostics are the same after a reload (DIAG-6, DIAG-7).
 */
async function load(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    /** Every diagnostic, as `code: message`, errors first. */
    function diagnostics() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => `${d.code}: ${d.message}`,
        );
    }

    /** The codes of every diagnostic, errors first. */
    function codes() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => d.code,
        );
    }

    /** The type of the component `name` names, `_error` for an error. */
    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    /** The state value `variable` of the component `name` names. */
    async function stateValue(name: string, variable: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues[
            variable
        ];
    }

    async function text(name: string) {
        return await stateValue(name, "text");
    }

    async function setText(name: string, text: string) {
        await updateTextInputValue({
            text,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    /** Save the document's state and load it again from what was saved. */
    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    return {
        diagnostics,
        codes,
        typeOf,
        stateValue,
        text,
        setText,
        setMath,
        reload,
    };
}

describe("A text is never read as a boolean (D68, #2659) @group4", () => {
    const fromText: [string, string, string][] = [
        ["a text", `<text name="t">true</text>`, "text"],
        ["a label", `<label name="t">true</label>`, "label"],
        ["a textInput", `<textInput name="t" prefill="true"/>`, "textInput"],
        [
            "a choiceInput of texts",
            `<choiceInput name="t" preselectChoice="1"><choice>true</choice><choice>false</choice></choiceInput>`,
            "text",
        ],
    ];
    for (const [what, source, sourceType] of fromText) {
        it(`<boolean extend> of ${what} is e0065, suggesting a comparison`, async () => {
            const d = await load(`${source}<boolean name="b" extend="$t"/>`);
            const expected = [
                `doenet-e0065: A \`<boolean>\` can't be made from \`$t\`, which gives a \`<${sourceType}>\`: a text is not true or false. To test it, write a comparison such as \`<boolean>$t = true</boolean>\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.typeOf("b")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    it("<boolean copy> of a text is e0065 too", async () => {
        const d = await load(
            `<text name="t">true</text><boolean name="b" copy="$t"/>`,
        );
        expect(d.codes()).eqls(["doenet-e0065"]);
    });

    const blanks: [string, string, string][] = [
        [
            "a <boolean>'s content",
            `<text name="t">true</text><boolean name="b">$t</boolean>`,
            "`$t` is a text, not true or false, so it is a blank here. To test it, write a comparison such as `$t = true`.",
        ],
        [
            "a text written in a <boolean>",
            `<boolean name="b"><text>true</text></boolean>`,
            "This `<text>` is a text, not true or false, so it is a blank here. To test it, write a comparison, such as one with `= true`.",
        ],
        [
            "logic in a <boolean>",
            `<text name="t">true</text><boolean name="b">$t and true</boolean>`,
            "`$t` is a text, not true or false, so it is a blank here. To test it, write a comparison such as `$t = true`.",
        ],
        [
            "a textInput in a <boolean>",
            `<textInput name="t" prefill="true"/><boolean name="b">$t</boolean>`,
            "`$t` is a text, not true or false, so it is a blank here. To test it, write a comparison such as `$t = true`.",
        ],
        [
            "a label in a <boolean>",
            `<label name="t">true</label><boolean name="b">$t</boolean>`,
            "`$t` is a text, not true or false, so it is a blank here. To test it, write a comparison such as `$t = true`.",
        ],
    ];
    for (const [what, doenetML, message] of blanks) {
        it(`${what} is a blank with w0203`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([`doenet-w0203: ${message}`]);
            expect(await d.stateValue("b", "valueMissing")).eq(true);
            await d.reload();
            expect(d.diagnostics()).eqls([`doenet-w0203: ${message}`]);
        });
    }

    it("a text in a boolean attribute is a blank with w0203, so it doesn't hide", async () => {
        const d = await load(
            `<text name="t">true</text><p name="p" hide="$t">hi</p>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-w0203: `$t` is a text, not true or false, so it is a blank here. To test it, write a comparison such as `$t = true`.",
        ]);
        expect(await d.stateValue("p", "hidden")).eq(false);
    });

    it("a text in a <when> is a blank with w0203, and gives no credit", async () => {
        const d = await load(
            `<text name="t">true</text><answer name="a"><booleanInput/><award><when>$t</when></award></answer>`,
        );
        expect(d.codes()).eqls(["doenet-w0203"]);
        expect(await d.stateValue("a", "creditAchieved")).eq(0);
    });

    for (const [what, input] of [
        ["bindValueTo", `<booleanInput name="bi" bindValueTo="$t"/>`],
        ["a reference inside it", `<booleanInput name="bi">$t</booleanInput>`],
    ]) {
        it(`a <booleanInput> bound to a text by ${what} is bound to a blank, suggesting a <textInput>`, async () => {
            const d = await load(`<text name="t">true</text>${input}`);
            const expected = [
                "doenet-w0203: A `<booleanInput>` can't edit `$t`, which is a text, not true or false, so it is bound to a blank. To edit it, write `<textInput>$t</textInput>`.",
            ];
            expect(d.diagnostics()).eqls(expected);
            expect(await d.stateValue("bi", "value")).eq(false);
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    it("a <booleanList> of a textList is a blank with w0203", async () => {
        const d = await load(
            `<textList name="tl">true false</textList><booleanList name="bl">$tl</booleanList>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-w0203: `$tl` holds texts, not values that are true or false, so it is a blank here. To test one, write a comparison such as `$tl[1] = true`.",
        ]);
    });

    it("a comparison decides a boolean from a text, and the keywords stay", async () => {
        const d = await load(`
<text name="t">true</text>
<boolean name="b1">$t = true</boolean>
<boolean name="b2">not ($t = true)</boolean>
<boolean name="b3">true</boolean>
<boolean name="b4">false or true</boolean>
<p name="p" hide="true">hidden</p>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.stateValue("b1", "value")).eq(true);
        expect(await d.stateValue("b2", "value")).eq(false);
        expect(await d.stateValue("b3", "value")).eq(true);
        expect(await d.stateValue("b4", "value")).eq(true);
        expect(await d.stateValue("p", "hidden")).eq(true);
    });

    it("a boolean still shows as the word in a text", async () => {
        const d = await load(`
<boolean name="b">true</boolean>
<text name="t1">$b</text>
<text name="t2" extend="$b"/>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("t1")).eq("true");
        expect(await d.text("t2")).eq("true");
    });
});

describe("A component becomes only what it stands in as (D69, #2659) @group4", () => {
    const line = `<line name="l" through="(0,0) (1,1)"/>`;

    const allowed: [string, string, string][] = [
        [
            "<math> of a line",
            `${line}<math name="x" extend="$l"/>`,
            "0 = -x + y",
        ],
        [
            "<text> of an ion",
            `<ion name="i" symbol="Na"/><text name="x" extend="$i"/>`,
            "Sodium",
        ],
        [
            "<math> of an <m>",
            `<m name="e">x^2</m><math name="x" extend="$e"/>`,
            "x²",
        ],
        [
            "<text> of an <m>",
            `<m name="e">x^2</m><text name="x" extend="$e"/>`,
            "x²",
        ],
        [
            "<text> of a label",
            `<label name="lb">hi</label><text name="x" extend="$lb"/>`,
            "hi",
        ],
        [
            "<math> of a function",
            `<function name="f">x^2</function><math name="x" extend="$f"/>`,
            "x²",
        ],
        [
            "<number> of an angle",
            `<angle name="a" radians="1"/><number name="x" extend="$a"/>`,
            "1",
        ],
        [
            "<text> of an angle",
            `<angle name="a" radians="1"/><text name="x" extend="$a"/>`,
            "1",
        ],
        [
            "<number> of a mathInput",
            `<mathInput name="mi" prefill="2"/><number name="x" extend="$mi"/>`,
            "2",
        ],
    ];
    for (const [what, doenetML, expected] of allowed) {
        it(`${what} is allowed`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([]);
            expect(await d.text("x")).eq(expected);
        });
    }

    it("<point extend> of a mathInput holding a tuple is allowed (#2484)", async () => {
        const d = await load(
            `<mathInput name="mi" prefill="(1,2)"/><point name="P" extend="$mi"/>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect((await d.stateValue("P", "xs")).map((x: any) => x.tree)).eqls([
            1, 2,
        ]);
    });

    const errors: [string, string, string][] = [
        [
            "<number> of a line",
            `${line}<number name="x" extend="$l"/>`,
            "A `<number>` can't be made from `$l`, which gives a `<line>`: a `<line>` is read only as a `<math>`, not as anything that could be made from one. To use its slope, write `<number>$l.slope</number>`.",
        ],
        [
            "<text> of a line",
            `${line}<text name="x" extend="$l"/>`,
            "A `<text>` can't be made from `$l`, which gives a `<line>`: a `<line>` is read only as a `<math>`, not as anything that could be made from one. To use its equation, write `<text>$l.equation</text>`.",
        ],
        [
            "<text> of a function",
            `<function name="f">x^2</function><text name="x" extend="$f"/>`,
            "A `<text>` can't be made from `$f`, which gives a `<function>`: a `<function>` is read only as one of `<curve>`, `<math>`, not as anything that could be made from them. To use its formula, write `<text>$f.formula</text>`.",
        ],
        [
            "<number> of an ion",
            `<ion name="i" symbol="Na"/><number name="x" extend="$i"/>`,
            "A `<number>` can't be made from `$i`, which gives a `<ion>`: a `<ion>` is read only as one of `<math>`, `<text>`, not as anything that could be made from them. To use its charge, write `<number>$i.charge</number>`.",
        ],
        [
            "<boolean> of an ion",
            `<ion name="i" symbol="Na"/><boolean name="x" extend="$i"/>`,
            "A `<boolean>` can't be made from `$i`, which gives a `<ion>`: a `<ion>` is read only as one of `<math>`, `<text>`, not as anything that could be made from them. To show it as it is, write `$i`.",
        ],
        [
            "<number> of a label",
            `<label name="lb">2</label><number name="x" extend="$lb"/>`,
            "A `<number>` can't be made from `$lb`, which gives a `<label>`: a `<label>` is read only as a `<text>`, not as anything that could be made from one. To use its text, write `<number>$lb.text</number>`.",
        ],
        [
            "<math> of a label",
            `<label name="lb">x</label><math name="x" extend="$lb"/>`,
            "A `<math>` can't be made from `$lb`, which gives a `<label>`: a `<label>` is read only as a `<text>`, not as anything that could be made from one. To use its text, write `<math>$lb.text</math>`.",
        ],
        [
            "<number> of an <me>",
            `<me name="e">2</me><number name="x" extend="$e"/>`,
            "A `<number>` can't be made from `$e`, which gives a `<me>`: a `<me>` is read only as one of `<math>`, `<text>`, not as anything that could be made from them. To use its math, write `<number>$e.math</number>`.",
        ],
        [
            "<label> of a math",
            `<math name="m">x</math><label name="x" extend="$m"/>`,
            "A `<label>` can't be made from `$m`, which gives a `<math>`. To show it in a `<label>`, write `<label>$m</label>`.",
        ],
    ];
    for (const [what, doenetML, message] of errors) {
        it(`${what} is e0065, naming what to write`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([`doenet-e0065: ${message}`]);
            expect(await d.typeOf("x")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls([`doenet-e0065: ${message}`]);
        });
    }

    it("each suggested form works", async () => {
        const d = await load(`
${line}
<function name="f">x^2</function>
<ion name="i" symbol="Na"/>
<label name="lb">2</label>
<number name="n1">$l.slope</number>
<text name="t1">$l.equation</text>
<text name="t2">$f.formula</text>
<number name="n2">$i.charge</number>
<number name="n3">$lb.text</number>
<label name="lb2">$n1</label>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("n1")).eq("1");
        expect(await d.text("t1")).eq("0 = -x + y");
        expect(await d.text("t2")).eq("x²");
        expect(await d.text("n2")).eq("1");
        expect(await d.text("n3")).eq("2");
        expect(await d.text("lb2")).eq("1");
    });

    const inContent: [string, string, string][] = [
        [
            "a line in a <number>",
            `${line}<number name="x">$l</number>`,
            "`$l` is a `<line>`, which is read only as a `<math>`, which a `<number>` doesn't take, so it is a blank here. To use its slope, write `$l.slope`.",
        ],
        [
            "a line in a <text>",
            `${line}<text name="x">$l</text>`,
            "`$l` is a `<line>`, which is read only as a `<math>`, which a `<text>` doesn't take, so it is a blank here. To use its equation, write `$l.equation`.",
        ],
        [
            "a line written as a tag in a <number>",
            `<number name="x"><line through="(0,0) (1,1)"/></number>`,
            "This `<line>` is read only as a `<math>`, which a `<number>` doesn't take, so it is a blank here. To use its slope, give it a name and write that name followed by `.slope`.",
        ],
        [
            "a line in a <boolean>",
            `${line}<boolean name="x">$l</boolean>`,
            "`$l` is a `<line>`, which is read only as a `<math>`, which a `<boolean>` doesn't take, so it is a blank here. To show it, write it outside the `<boolean>`.",
        ],
        [
            "a function in a <number>",
            `<function name="f">x^2</function><number name="x">$f</number>`,
            "`$f` is a `<function>`, which is read only as one of `<curve>`, `<math>`, none of which a `<number>` takes, so it is a blank here. To show it, write it outside the `<number>`.",
        ],
        [
            "an ion in a <number>",
            `<ion name="i" symbol="Na"/><number name="x">$i</number>`,
            "`$i` is a `<ion>`, which is read only as one of `<math>`, `<text>`, none of which a `<number>` takes, so it is a blank here. To use its charge, write `$i.charge`.",
        ],
        [
            "a label in a <math>",
            `<label name="lb">x</label><math name="x">$lb</math>`,
            "`$lb` is a `<label>`, which is read only as a `<text>`, which a `<math>` doesn't take, so it is a blank here. To use its text, write `$lb.text`.",
        ],
    ];
    for (const [what, doenetML, message] of inContent) {
        it(`${what} is a blank with w0203, naming the property`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([`doenet-w0203: ${message}`]);
            expect(
                (await d.stateValue("x", "valueMissing")) === true ||
                    (await d.text("x")) === "＿",
            ).eq(true);
            await d.reload();
            expect(d.diagnostics()).eqls([`doenet-w0203: ${message}`]);
        });
    }

    it("what a value tag takes as it stands in stays", async () => {
        const d = await load(`
${line}
<ion name="i" symbol="Na"/>
<m name="e">x</m>
<label name="lb">hi</label>
<angle name="a" radians="1"/>
<point name="P">(1,2)</point>
<math name="m1">$l</math>
<math name="m2">$i</math>
<text name="t1">$i</text>
<math name="m3">$e</math>
<text name="t2">$e</text>
<text name="t3">$lb</text>
<number name="n1">$a</number>
<text name="t4">$P</text>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("m1")).eq("0 = -x + y");
        expect(await d.text("t1")).eq("Sodium");
        expect(await d.text("m3")).eq("x");
        expect(await d.text("t2")).eq("x");
        expect(await d.text("t3")).eq("hi");
        expect(await d.text("n1")).eq("1");
        expect(await d.text("t4")).eq("(1, 2)");
    });
});

describe("An angle is a math, both ways (D66 decision 17, #478) @group4", () => {
    it("<angle extend> of a math, a number and a text", async () => {
        const d = await load(`
<math name="m">pi/2</math>
<number name="n">1</number>
<text name="t">2</text>
<angle name="a1" extend="$m"/>
<angle name="a2" extend="$n"/>
<angle name="a3" extend="$t"/>
<number name="d1" extend="$a1.degrees"/>
<math name="r2" extend="$a2.radians"/>
<math name="r3" extend="$a3.radians"/>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("d1")).eq("90");
        expect(await d.text("r2")).eq("1");
        expect(await d.text("r3")).eq("2");
    });

    it("an angle made from a math follows it", async () => {
        const d = await load(`
<mathInput name="mi" prefill="1"/>
<angle name="a" extend="$mi"/>
<math name="r" extend="$a.radians"/>
`);
        expect(await d.text("r")).eq("1");
        await d.setMath("mi", "2");
        expect(await d.text("r")).eq("2");
    });
});

describe("A value that doesn't convert is missing, with an info (REF-5, #2659) @group4", () => {
    it("<number extend> of a text that isn't a number", async () => {
        const d = await load(`
<textInput name="ti" prefill="hello"/>
<number name="n" extend="$ti"/>
<p name="p">$n</p>
`);
        expect(d.diagnostics()).eqls([
            "doenet-i0053: A `<number>` can't be made from `$ti` while its value, “hello”, isn't a number, so it is missing until it is.",
        ]);
        expect(await d.stateValue("n", "valueMissing")).eq(true);
        expect(await d.text("p")).eq("＿");
        await d.reload();
        expect(d.codes()).eqls(["doenet-i0053"]);

        await d.setText("ti", "7");
        expect(d.codes()).eqls([]);
        expect(await d.text("n")).eq("7");
    });

    it("<number extend> of a text that is a number has no info", async () => {
        const d = await load(
            `<text name="t">3</text><number name="n" extend="$t"/>`,
        );
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("n")).eq("3");
    });
});

describe("A list tag made from a list of a type it can't be made from is an error at load (REF-5, #2649) @group4", () => {
    for (const [what, doenetML, written, sourceType] of [
        [
            "<booleanList> of a mathList",
            `<mathList name="s">1 2</mathList><booleanList name="x" extend="$s"/>`,
            "booleanList",
            "mathList",
        ],
        [
            "<mathList> of a booleanList",
            `<booleanList name="s">true</booleanList><mathList name="x" extend="$s"/>`,
            "mathList",
            "booleanList",
        ],
        [
            "<booleanList> of a textList",
            `<textList name="s">true</textList><booleanList name="x" copy="$s"/>`,
            "booleanList",
            "textList",
        ],
    ]) {
        it(what, async () => {
            const d = await load(doenetML);
            const expected = [
                `doenet-e0065: A \`<${written}>\` can't be made from \`$s\`, which gives a \`<${sourceType}>\`. To show it as it is, write \`$s\`.`,
            ];
            expect(d.diagnostics()).eqls(expected);
            await d.reload();
            expect(d.diagnostics()).eqls(expected);
        });
    }

    it("list pairs that convert stay allowed", async () => {
        const d = await load(`
<mathList name="ml">1 2</mathList>
<textList name="tl">a b</textList>
<numberList name="x1" extend="$ml"/>
<textList name="x2" extend="$ml"/>
<mathList name="x3" extend="$tl"/>
`);
        expect(d.diagnostics()).eqls([]);
    });
});

describe("An input made from a value suggests the input holding it (D65 decision 6) @group4", () => {
    it("<mathInput extend> of a math", async () => {
        const d = await load(
            `<math name="m">x</math><mathInput name="x" extend="$m"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0062: A `<mathInput>` can't be made from `$m`, a `<math>`: an input isn't the same thing as its value. To edit `$m`, write `<mathInput>$m</mathInput>`. To start from its value, write `<mathInput prefill=\"$m\"/>`.",
        ]);
    });

    it("<choiceInput extend> of a text keeps bindValueTo", async () => {
        const d = await load(
            `<text name="t">a</text><choiceInput name="x" extend="$t"/>`,
        );
        expect(d.diagnostics()).eqls([
            "doenet-e0062: A `<choiceInput>` can't be made from `$t`, a `<text>`: an input isn't the same thing as its value. To edit `$t`, write `<choiceInput bindValueTo=\"$t\"/>`.",
        ]);
    });

    it("the suggested form edits the value", async () => {
        const d = await load(
            `<math name="m">x</math><mathInput name="mi">$m</mathInput>`,
        );
        expect(d.diagnostics()).eqls([]);
        await d.setMath("mi", "y");
        expect(await d.text("m")).eq("y");
    });
});
