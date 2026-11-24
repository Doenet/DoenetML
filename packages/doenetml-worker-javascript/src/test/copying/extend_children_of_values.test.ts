import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A value or an object is what it holds, so children written inside an
 * `extend` of one are an error at load; a container presents what it holds,
 * so its `extend` may be given children, which are added, and a `<title>`
 * replaces its title (D71, REF-7, #2668). A `<label>`, `<shortDescription>`
 * or `<description>` may be written where the tag takes one (a `<point>`'s
 * `<label>`, an input's); on a tag that takes none (a `<number>`, a
 * `<text>`) it is an error as any other child is (user decision on D71
 * decision 5). A `copy` makes a new component, which may be given anything.
 */
async function load(doenetML: string) {
    let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
    });

    function diagnostics() {
        const all = getDiagnosticsByType(core);
        return [...all.errors, ...all.warnings, ...all.infos].map(
            (d: any) => `${d.code}: ${d.message}`,
        );
    }

    async function typeOf(name: string) {
        return (core as any).core._components[await resolvePathToNodeIdx(name)]
            ?.componentType;
    }

    async function stateValue(name: string, variable: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues[
            variable
        ];
    }

    async function text(name: string) {
        return await stateValue(name, "text");
    }

    async function reload() {
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
    }

    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
    }

    return { diagnostics, typeOf, stateValue, text, reload, setBoolean };
}

/** The error for children inside an extend of a value. */
function valueError(tag: string, source: string, form: string) {
    return `doenet-e0057: Children written inside an \`extend\` of a \`<${tag}>\` would change what it holds, but an extend is the same \`<${tag}>\` as \`${source}\`. To make a new \`<${tag}>\` from \`${source}\` and more, write \`${form}\`.`;
}

/** The error for children inside an extend of an object. */
function objectError(tag: string, source: string, form: string) {
    return `doenet-e0057: Children written inside an \`extend\` of a \`<${tag}>\` would change what it is, but an extend is the same \`<${tag}>\` as \`${source}\`. To make a new \`<${tag}>\` starting from \`${source}\`, use \`copy\`: \`${form}\`.`;
}

/**
 * The error for a `<label>`, `<shortDescription>` or `<description>`
 * (`children`, as listed) inside an extend of a tag that takes none.
 */
function presentationError(tag: string, source: string, children: string) {
    return `doenet-e0057: A \`<${tag}>\` takes no ${children}, and an \`extend\` of \`${source}\` is the same \`<${tag}>\`, so it can't be given one. To show \`${source}\` again, remove the ${children}.`;
}

describe("Children inside an extend of a value or an object are an error at load (D71, #2668) @group4", () => {
    const cases: [string, string, string][] = [
        [
            "a math",
            `<math name="s">x</math><math name="x" extend="$s">+1</math>`,
            valueError("math", "$s", "<math>$s+1</math>"),
        ],
        [
            "a text",
            `<text name="s">hi</text><text name="x" extend="$s"> there</text>`,
            valueError("text", "$s", "<text>$s there</text>"),
        ],
        [
            "a number, whose 5 made 25",
            `<number name="s">2</number><number name="x" extend="$s">5</number>`,
            valueError("number", "$s", "<number>$s 5</number>"),
        ],
        [
            "a boolean, whose children are joined to it by a logical operator",
            `<boolean name="s">true</boolean><boolean name="x" extend="$s">false</boolean>`,
            "doenet-e0057: Children written inside an `extend` of a `<boolean>` would change what it holds, but an extend is the same `<boolean>` as `$s`. To make a new `<boolean>` from `$s` and more, write a `<boolean>` joining them with `and` or `or`, such as `<boolean>$s and false</boolean>`.",
        ],
        [
            "a <not>, whose children are one logical expression as a <boolean>'s",
            `<not name="s">true</not><not name="x" extend="$s">false</not>`,
            "doenet-e0057: Children written inside an `extend` of a `<not>` would change what it holds, but an extend is the same `<not>` as `$s`. To make a new `<not>` from `$s` and more, write a `<not>` joining them with `and` or `or`, such as `<not>$s and false</not>`.",
        ],
        [
            "an <and>, whose children are operands",
            `<boolean name="s">true</boolean><and name="x" extend="$s">true</and>`,
            valueError("and", "$s", "<and>$s true</and>"),
        ],
        [
            "a number given a label, which the new tag would read as content",
            `<number name="s">2</number><number name="x" extend="$s"><label>L</label>5</number>`,
            valueError("number", "$s", "<number>$s 5</number>"),
        ],
        [
            "a text given a label, which the new tag would read as content",
            `<text name="s">hi</text><text name="x" extend="$s"><label>L</label> there</text>`,
            valueError("text", "$s", "<text>$s there</text>"),
        ],
        [
            "a point given a label, which copy keeps",
            `<point name="s">(1,2)</point><point name="x" extend="$s"><label>L</label>(3,4)</point>`,
            objectError(
                "point",
                "$s",
                '<point copy="$s"><label>L</label>(3,4)</point>',
            ),
        ],
        [
            "a math made from a number",
            `<number name="s">2</number><math name="x" extend="$s">+1</math>`,
            valueError("math", "$s", "<math>$s+1</math>"),
        ],
        [
            "an <m>, which counts as a value",
            `<m name="s">x</m><m name="x" extend="$s">+1</m>`,
            valueError("m", "$s", "<m>$s+1</m>"),
        ],
        [
            "a mathInput, whose children say what it is bound to",
            `<mathInput name="s"/><mathInput name="x" extend="$s">x</mathInput>`,
            objectError(
                "mathInput",
                "$s",
                '<mathInput copy="$s">x</mathInput>',
            ),
        ],
        [
            "a point",
            `<point name="s">(1,2)</point><point name="x" extend="$s">(3,4)</point>`,
            objectError("point", "$s", '<point copy="$s">(3,4)</point>'),
        ],
        [
            "a function",
            `<function name="s">x^2</function><function name="x" extend="$s">x^3</function>`,
            objectError("function", "$s", '<function copy="$s">x^3</function>'),
        ],
    ];
    for (const [what, doenetML, message] of cases) {
        it(what, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([message]);
            expect(await d.typeOf("x")).eq("_error");
            await d.reload();
            expect(d.diagnostics()).eqls([message]);
        });
    }

    // Made from a property or a list's entry, not a component: the error
    // is in its place all the same (DIAG-5), and a reference to it is
    // missing.
    for (const [what, doenetML, message] of [
        [
            "a property",
            `<line name="l" through="(0,0) (1,2)"/><number name="x" extend="$l.slope">5</number><math name="y">$x</math>`,
            valueError("number", "$l.slope", "<number>$l.slope 5</number>"),
        ],
        [
            "an entry of a mathList",
            `<mathList name="l">a b</mathList><math name="x" extend="$l[1]">+1</math><math name="y">$x</math>`,
            valueError("math", "$l[1]", "<math>$l[1]+1</math>"),
        ],
        [
            "a vertex",
            `<polygon name="l" vertices="(1,2) (3,4) (5,6)"/><point name="x" extend="$l.vertices[1]">(3,4)</point><math name="y">$x</math>`,
            objectError(
                "point",
                "$l.vertices[1]",
                '<point copy="$l.vertices[1]">(3,4)</point>',
            ),
        ],
    ]) {
        it(`made from ${what}`, async () => {
            const d = await load(doenetML);
            expect(d.diagnostics()).eqls([message]);
            expect(await d.typeOf("x")).eq("_error");
            expect(await d.text("y")).eq("＿");
            await d.reload();
            expect(d.diagnostics()).eqls([message]);
            expect(await d.typeOf("x")).eq("_error");
        });
    }

    it("made from a property, in a case made true later", async () => {
        const d = await load(`
<booleanInput name="b"/>
<line name="l" through="(0,0) (1,2)"/>
<conditionalContent><case condition="$b"><number name="x" extend="$l.slope">5</number></case></conditionalContent>
`);
        const expected = [
            valueError("number", "$l.slope", "<number>$l.slope 5</number>"),
        ];
        expect(d.diagnostics()).eqls(expected);
        await d.setBoolean("b", true);
        expect(d.diagnostics()).eqls(expected);
        expect(await d.typeOf("x")).eq("_error");
    });

    it("a mathList", async () => {
        const d = await load(
            `<mathList name="s">1 2</mathList><mathList name="x" extend="$s">3</mathList>`,
        );
        const expected = [
            valueError("mathList", "$s", "<mathList>$s 3</mathList>"),
        ];
        expect(d.diagnostics()).eqls(expected);
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("in a case not yet true, at load", async () => {
        const d = await load(`
<booleanInput name="b"/>
<math name="s">x</math>
<conditionalContent><case condition="$b"><math name="x" extend="$s">+1</math></case></conditionalContent>
`);
        expect(d.diagnostics()).eqls([
            valueError("math", "$s", "<math>$s+1</math>"),
        ]);
    });

    it("each suggested form works", async () => {
        const d = await load(`
<math name="m">x</math>
<text name="t">hi</text>
<m name="e">x</m>
<point name="P">(1,2)</point>
<math name="m2">$m+1</math>
<text name="t2">$t there</text>
<m name="e2">$e+1</m>
<point name="P2" copy="$P">(3,4)</point>
<number name="n">2</number>
<boolean name="b">true</boolean>
<number name="n2">$n 5</number>
<boolean name="b2">$b and false</boolean>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("n2")).eq("10");
        expect(await d.stateValue("b2", "value")).eq(false);
        expect(await d.text("m2")).eq("x + 1");
        expect(await d.text("t2")).eq("hi there");
        expect(await d.stateValue("e2", "latex")).eq("x +1");
        expect((await d.stateValue("P2", "xs")).map((x: any) => x.tree)).eqls([
            3, 4,
        ]);
    });
    it("a label, a shortDescription or a description on a tag that takes none (user decision on D71 decision 5)", async () => {
        const d = await load(`
<number name="n">2</number>
<text name="t">hi</text>
<math name="m">x</math>
<m name="e">x</m>
<mathList name="ml">a b</mathList>
<boolean name="b">true</boolean>
<point name="P">(1,2)</point>
<number name="x1" extend="$n"><label>L</label></number>
<text name="x2" extend="$t"> <label>L</label> </text>
<math name="x3" extend="$m"><shortDescription>S</shortDescription></math>
<m name="x4" extend="$e"><label>L</label></m>
<mathList name="x5" extend="$ml"><label>L</label></mathList>
<boolean name="x6" extend="$b"><label>L</label></boolean>
<point name="x7" extend="$P"><shortDescription>S</shortDescription></point>
<number name="x8" extend="$n"><label>L</label><description>D</description></number>
<p name="p">$x1</p>
`);
        const expected = [
            presentationError("number", "$n", "`<label>`"),
            presentationError("text", "$t", "`<label>`"),
            presentationError("math", "$m", "`<shortDescription>`"),
            presentationError("m", "$e", "`<label>`"),
            presentationError("mathList", "$ml", "`<label>`"),
            presentationError("boolean", "$b", "`<label>`"),
            presentationError("point", "$P", "`<shortDescription>`"),
            `doenet-e0057: A \`<number>\` takes none of \`<label>\`, \`<description>\`, and an \`extend\` of \`$n\` is the same \`<number>\`, so it can't be given them. To show \`$n\` again, remove them.`,
        ];
        expect(d.diagnostics()).eqls(expected);
        for (const name of ["x1", "x2", "x3", "x4", "x6", "x7", "x8"]) {
            expect(await d.typeOf(name)).eq("_error");
        }
        expect(await d.text("p")).eq("＿");
        await d.reload();
        expect(d.diagnostics()).eqls(expected);
    });

    it("beside other children, the form suggested leaves out what the tag doesn't take", async () => {
        const d = await load(`
<point name="P">(1,2)</point>
<point name="P2" extend="$P"><shortDescription>S</shortDescription>(3,4)</point>
<point name="P3" extend="$P"><label>L</label>(3,4)</point>
`);
        expect(d.diagnostics()).eqls([
            objectError("point", "$P", `<point copy="$P">(3,4)</point>`),
            objectError(
                "point",
                "$P",
                `<point copy="$P"><label>L</label>(3,4)</point>`,
            ),
        ]);
    });

    it("a label on a tag that takes none, in a case that isn't true, at load", async () => {
        const d = await load(`
<booleanInput name="bi"/>
<number name="n">2</number>
<conditionalContent>
  <case condition="$bi"><number name="x" extend="$n"><label>L</label></number></case>
</conditionalContent>
`);
        expect(d.diagnostics()).eqls([
            presentationError("number", "$n", "`<label>`"),
        ]);
        await d.setBoolean("bi", true);
        expect(await d.typeOf("x")).eq("_error");
    });
});

describe("What an extend of a value or an object may be given (D71, #2668) @group4", () => {
    it("a label, a shortDescription or a description, where the tag takes one", async () => {
        const d = await load(`
<point name="P">(1,2)</point>
<point name="P2" extend="$P"><label>Q</label></point>
<mathInput name="mi"/>
<mathInput name="mi2" extend="$mi"><label>L</label><shortDescription>S</shortDescription></mathInput>
<angle name="A">pi/2</angle>
<angle name="A2" extend="$A"><label>An angle</label></angle>
<textInput name="ti"/>
<textInput name="ti2" extend="$ti"><description>D</description></textInput>
<graph name="g"/>
<graph name="g2" extend="$g"><shortDescription>S</shortDescription></graph>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.stateValue("P2", "label")).eq("Q");
        expect(await d.stateValue("mi2", "label")).eq("L");
    });

    it("a bare, named or appearance-only extend", async () => {
        const d = await load(`
<math name="m">x</math>
<math name="m2" extend="$m" displayDigits="2"/>
<point name="P">(1,2)</point>
<point name="P2" extend="$P" styleNumber="2"/>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("m2")).eq("x");
    });
});

describe("A copy with children stays allowed (D71, #2668) @group4", () => {
    it("of a value and of an object", async () => {
        const d = await load(`
<math name="m">x</math>
<math name="m2" copy="$m">+1</math>
<number name="n">2</number>
<number name="n2" copy="$n">5</number>
<point name="P">(1,2)</point>
<point name="P2" copy="$P">(3,4)</point>
<text name="t">hi</text>
<text name="t2" copy="$t"> there</text>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("m2")).eq("x + 1");
        expect(await d.text("n2")).eq("25");
        expect((await d.stateValue("P2", "xs")).map((x: any) => x.tree)).eqls([
            3, 4,
        ]);
        expect(await d.text("t2")).eq("hi there");
    });
});

describe("A container's extend may present more (D71, #2668) @group4", () => {
    it("a section, given a title and a paragraph", async () => {
        const d = await load(`
<section name="s"><title>Old</title><p>a</p></section>
<section name="s2" extend="$s"><title>New</title><p name="added">b</p></section>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.stateValue("s2", "title")).eq("New");
        expect(await d.stateValue("s", "title")).eq("Old");
        expect(await d.text("s2.added")).eq("b");
    });

    it("a paragraph, a graph and a group", async () => {
        const d = await load(`
<p name="p">a</p>
<p name="p2" extend="$p">b</p>
<graph name="g"><point>(1,2)</point></graph>
<graph name="g2" extend="$g"><point name="Q">(3,4)</point></graph>
<group name="gr"><math>1</math></group>
<group name="gr2" extend="$gr"><math>2</math></group>
<p name="pg">$gr2</p>
`);
        expect(d.diagnostics()).eqls([]);
        expect(await d.text("p2")).eq("ab");
        expect(await d.text("pg")).eq("12");
        expect(await d.typeOf("g2.Q")).eq("point");
    });

    it("its children are judged as a type mix, as the container's own are", async () => {
        // An extend of a value is `e0057` and its children are not also a
        // type mix; a container's extend is no error, so they are.
        const warning =
            "doenet-w0203: `$b` is true or false, not a number, so it is a blank here. To count it as 1 or 0, write `<number convertBoolean>$b</number>`.";
        const d = await load(`
<boolean name="b">true</boolean>
<chart name="c" type="line"><series>1 2</series></chart>
<chart name="c2" extend="$c">$b</chart>
`);
        expect(d.diagnostics().filter((m) => m.includes("w0203"))).eqls([
            warning,
        ]);
        expect(d.diagnostics().filter((m) => m.includes("w0107"))).eqls([]);
        await d.reload();
        expect(d.diagnostics().filter((m) => m.includes("w0203"))).eqls([
            warning,
        ]);
    });
});
