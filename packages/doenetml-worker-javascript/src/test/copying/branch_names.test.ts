import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Names inside a `<conditionalContent>` or a one-pick `<select>` (D13, D22,
 * COMP-11, #2450). A name in a case, the `<else>`, or an option of a select
 * that picks one is visible outside it, as a `<group>`'s is: `$x` finds the
 * `x` of the active branch, as `$cc.x` does. It resolves only if every
 * branch declares it, with the same tag, so that what a reference names
 * never changes type with the active branch; otherwise it names nothing,
 * with a warning at the reference (`doenet-w0183`, `doenet-w0184`), or an
 * error on a tag (REF-0, D36).
 */
async function setUp(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: `<booleanInput name="b"/>${doenetML}`,
    });
    async function text() {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    }
    async function toggle(value: boolean) {
        await updateBooleanInputValue({
            boolean: value,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
    }
    const diagnostics = getDiagnosticsByType(core);
    return { core, text, toggle, diagnostics };
}

function codes(records: { code?: string }[]) {
    return records.map((record) => record.code);
}

const sameTypeCases = `<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><math name="x">2</math></else>
</conditionalContent>`;

describe("Names in the branches of a conditionalContent or a one-pick select @group3", async () => {
    it("finds the active case's name from outside, as $cc.x does", async () => {
        const { text, toggle, diagnostics } = await setUp(
            `${sameTypeCases}<p name="p">[$x][$cc.x][<math>$x+1</math>]</p>`,
        );
        expect(await text()).eq("[2][2][2 + 1]");
        await toggle(true);
        expect(await text()).eq("[1][1][1 + 1]");
        await toggle(false);
        expect(await text()).eq("[2][2][2 + 1]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("finds a property or a name after the name", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent>
    <case condition="$b"><point name="P">(1,2)</point></case>
    <else><point name="P">(3,4)</point></else>
</conditionalContent>
<p name="p">[$P.x][$P.y]</p>`);
        expect(await text()).eq("[3][4]");
        await toggle(true);
        expect(await text()).eq("[1][2]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("finds a branch's own name from inside it", async () => {
        const { text, toggle } = await setUp(`
<conditionalContent>
    <case condition="$b"><math name="x">1</math><p name="p">[$x]</p></case>
    <else><math name="x">2</math><p name="p">[$x]</p></else>
</conditionalContent>`);
        expect(await text()).eq("[2]");
        await toggle(true);
        expect(await text()).eq("[1]");
    });

    it("names nothing while no case is active, with no else", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
</conditionalContent>
<p name="p">[$x][$cc.x]</p>`);
        expect(await text()).eq("[][]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
        await toggle(true);
        expect(await text()).eq("[1][1]");
        await toggle(false);
        expect(await text()).eq("[][]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("is ambiguous with the same name beside the conditionalContent", async () => {
        const { text, diagnostics } = await setUp(
            `<math name="x">9</math>${sameTypeCases}<p name="p">[$x][$cc.x]</p>`,
        );
        expect(await text()).eq("[][2]");
        expect(codes(diagnostics.warnings)).eqls(["doenet-w0105"]);
        expect(diagnostics.warnings[0].message).contain("`$x`");
    });

    it("names nothing, with a warning, for a name of different types", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><text name="x">t</text></else>
</conditionalContent>
<p name="p">[$x][$cc.x]</p>`);
        expect(await text()).eq("[][]");
        await toggle(true);
        expect(await text()).eq("[][]");
        expect(codes(diagnostics.warnings)).eqls([
            "doenet-w0184",
            "doenet-w0184",
        ]);
        expect(diagnostics.errors).eqls([]);
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
            "`$cc.x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
        ]);
    });

    it("names nothing, with a warning, for a name a branch lacks", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><math name="y">2</math></else>
</conditionalContent>
<p name="p">[$x][$cc.x]</p>`);
        expect(await text()).eq("[][]");
        await toggle(true);
        expect(await text()).eq("[][]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
            "`$cc.x` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
        ]);
    });

    it("names the case that lacks the name, and an unnamed container by its tag", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent>
    <case condition="$b"><math name="x">1</math></case>
    <case condition="true"><math name="y">1</math></case>
    <else><math name="x">2</math></else>
</conditionalContent>
<p name="p">[$x]</p>`);
        expect(await text()).eq("[]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: case 2 of the `<conditionalContent>` has no `x`. Give it one, or use a name every case has.",
        ]);
    });

    it("on a tag, a mix of types is an error, unchanged", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><text name="x">t</text></else>
</conditionalContent>
<p name="p"><math extend="$cc.x"/><math extend="$x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls([
            "doenet-e0066",
            "doenet-e0066",
        ]);
        expect(diagnostics.warnings).eqls([]);
    });

    it("on a tag, a name a branch lacks is an error", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><math name="y">2</math></else>
</conditionalContent>
<p name="p"><math extend="$cc.x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls(["doenet-w0183"]);
        expect(diagnostics.errors[0].message).eq(
            "`$cc.x` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
        );
    });

    it("on a tag, a name that can be absent, with no else, is an error", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
</conditionalContent>
<p name="p"><math extend="$cc.x"/><math extend="$x"/></p>`);
        expect(await text()).eq("");
        await toggle(true);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls([
            "doenet-e0064",
            "doenet-e0064",
        ]);
        expect(diagnostics.errors[0].message).contain("Add an `<else>`");
    });

    it("on a tag, a name every case has with one type is made", async () => {
        const { text, toggle, diagnostics } = await setUp(
            `${sameTypeCases}<p name="p"><math extend="$x"/>, <number extend="$cc.x"/></p>`,
        );
        expect(await text()).eq("2, 2");
        await toggle(true);
        expect(await text()).eq("1, 1");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("finds a name in a nested conditionalContent that satisfies the rule", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b">
        <conditionalContent>
            <case condition="$b"><math name="x">1</math></case>
            <else><math name="x">2</math></else>
        </conditionalContent>
    </case>
    <else><math name="x">3</math></else>
</conditionalContent>
<p name="p">[$x][$cc.x]</p>`);
        expect(await text()).eq("[3][3]");
        await toggle(true);
        expect(await text()).eq("[1][1]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("reports a nested conditionalContent that does not satisfy the rule", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b">
        <conditionalContent name="inner">
            <case condition="$b"><math name="x">1</math></case>
            <else><text name="x">t</text></else>
        </conditionalContent>
    </case>
    <else><math name="x">3</math></else>
</conditionalContent>
<p name="p">[$x]</p>`);
        expect(await text()).eq("[]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: `x` is a `<math>` in one case of `inner` and a `<text>` in another. Use the same type, or different names.",
        ]);
    });

    it("a one-pick select works the same way", async () => {
        for (const numToSelect of ["", `numToSelect="1"`]) {
            const { text, diagnostics } = await setUp(`
<select name="s" ${numToSelect}>
    <option><math name="x">1</math></option>
    <option><math name="x">1</math></option>
</select>
<p name="p">[$x][$s.x]</p>`);
            expect(await text(), numToSelect).eq("[1][1]");
            expect(
                [...diagnostics.warnings, ...diagnostics.errors],
                numToSelect,
            ).eqls([]);
        }

        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
    <option><text name="x">t</text></option>
</select>
<p name="p">[$x][$s.x]</p>`);
        expect(await text()).eq("[][]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: `x` is a `<math>` in one option of `s` and a `<text>` in another. Use the same type, or different names.",
            "`$s.x` names nothing: `x` is a `<math>` in one option of `s` and a `<text>` in another. Use the same type, or different names.",
        ]);
    });

    it("a multi-pick select keeps its names private", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s" numToSelect="2">
    <option><math name="x">1</math></option>
    <option><math name="x">1</math></option>
</select>
<p name="p">[$x][$s[1].x][$s[2].x]</p>`);
        expect(await text()).eq("[][1][1]");
        expect(codes(diagnostics.warnings)).eqls(["doenet-w0104"]);
    });

    it("a name after an index into a select's picks names nothing when an option lacks it", async () => {
        for (const numToSelect of ["", `numToSelect="2"`]) {
            const { text, diagnostics } = await setUp(`
<select name="s" ${numToSelect}>
    <option><math name="x">1</math></option>
    <option><math name="y">2</math></option>
</select>
<p name="p">[$s[1].x]</p>`);
            expect(await text(), numToSelect).eq("[]");
            expect(
                diagnostics.warnings.map((w) => w.message),
                numToSelect,
            ).eqls([
                "`$s[1].x` names nothing: option 2 of `s` has no `x`. Give it one, or use a name every option has.",
            ]);
            expect(diagnostics.errors, numToSelect).eqls([]);
        }
    });

    it("a name after an index into a select's picks names nothing when options declare different types", async () => {
        for (const numToSelect of ["", `numToSelect="2"`]) {
            const { text, diagnostics } = await setUp(`
<select name="s" ${numToSelect}>
    <option><math name="x">1</math></option>
    <option><text name="x">t</text></option>
</select>
<select name="s2" extend="$s"/>
<p name="p">[$s[1].x][$s2[1].x]</p>`);
            expect(await text(), numToSelect).eq("[][]");
            expect(
                diagnostics.warnings.map((w) => w.message),
                numToSelect,
            ).eqls([
                "`$s[1].x` names nothing: `x` is a `<math>` in one option of `s` and a `<text>` in another. Use the same type, or different names.",
                "`$s2[1].x` names nothing: `x` is a `<math>` in one option of `s` and a `<text>` in another. Use the same type, or different names.",
            ]);
        }
    });

    it("a name after an index into a select's picks, every option with one type, is found", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s" numToSelect="2">
    <option><math name="x">1</math></option>
    <option><group><math name="x">1</math></group></option>
</select>
<p name="p">[$s[1].x][$s[2].x]<math extend="$s[2].x"/></p>`);
        expect(await text()).eq("[1][1]1");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("on a tag, a name after an index into a select's picks is an error when an option lacks it or types differ", async () => {
        const missing = await setUp(`
<select name="s" numToSelect="2">
    <option><math name="x">1</math></option>
    <option><math name="y">2</math></option>
</select>
<p name="p"><math extend="$s[1].x"/></p>`);
        expect(await missing.text()).eq("");
        expect(codes(missing.diagnostics.errors)).eqls(["doenet-w0183"]);
        expect(missing.diagnostics.warnings).eqls([]);

        const mixed = await setUp(`
<select name="s" numToSelect="2">
    <option><math name="x">1</math></option>
    <option><text name="x">t</text></option>
</select>
<p name="p"><math extend="$s[1].x"/></p>`);
        expect(await mixed.text()).eq("");
        expect(codes(mixed.diagnostics.errors)).eqls(["doenet-e0066"]);
        expect(mixed.diagnostics.warnings).eqls([]);
    });

    it("a property of the container is not a name", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math>1</math></case>
    <else><math>2</math></else>
</conditionalContent>
<p name="p">[$cc.value][$cc.notThere]</p>`);
        expect(await text()).eq("[2][]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "No referent found for reference: `$cc.notThere`",
        ]);
    });
});
