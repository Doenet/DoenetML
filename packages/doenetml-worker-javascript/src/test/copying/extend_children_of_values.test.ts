import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A value or an object is what it holds, so children written inside an
 * `extend` of one are an error at load; a container presents what it holds,
 * so its `extend` may be given children, which are added, and a `<title>`
 * replaces its title (D71, REF-7, #2668). On any tag a `<label>`,
 * `<shortDescription>` or `<description>` may be written. A `copy` makes a
 * new component, which may be given anything.
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

    return { diagnostics, typeOf, stateValue, text, reload };
}

/** The error for children inside an extend of a value. */
function valueError(tag: string, source: string, form: string) {
    return `doenet-e0057: Children written inside an \`extend\` of a \`<${tag}>\` would change what it holds, but an extend is the same \`<${tag}>\` as \`${source}\`. To make a new \`<${tag}>\` from \`${source}\` and more, write \`${form}\`.`;
}

/** The error for children inside an extend of an object. */
function objectError(tag: string, source: string, form: string) {
    return `doenet-e0057: Children written inside an \`extend\` of a \`<${tag}>\` would change what it is, but an extend is the same \`<${tag}>\` as \`${source}\`. To make a new \`<${tag}>\` starting from \`${source}\`, use \`copy\`: \`${form}\`.`;
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
});

describe("What an extend of a value or an object may be given (D71, #2668) @group4", () => {
    it("a label, a shortDescription or a description, on any tag", async () => {
        const d = await load(`
<point name="P">(1,2)</point>
<point name="P2" extend="$P"><label>Q</label></point>
<mathInput name="mi"/>
<mathInput name="mi2" extend="$mi"><label>L</label><shortDescription>S</shortDescription></mathInput>
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
});
