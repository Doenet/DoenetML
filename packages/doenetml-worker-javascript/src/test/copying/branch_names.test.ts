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
    return { core, text, toggle, diagnostics, resolvePathToNodeIdx };
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

    it("on a group tag, a mix of types is an error, as the group would change type with the case", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><text name="x">t</text></else>
</conditionalContent>
<p name="p">[<group extend="$x"/>][<group extend="$cc.x"/>][<group copy="$x"/>]</p>`);
        expect(await text()).eq("[][][]");
        await toggle(true);
        expect(await text()).eq("[][][]");
        expect(diagnostics.warnings).eqls([]);
        expect(codes(diagnostics.errors)).eqls([
            "doenet-w0184",
            "doenet-w0184",
            "doenet-w0184",
        ]);
        expect(diagnostics.errors.map((e) => e.message)).eqls([
            "`$x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
            "`$cc.x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
            "`$x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
        ]);

        const select = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
    <option><text name="x">t</text></option>
</select>
<p name="p">[<group extend="$x"/>][<group extend="$s.x"/>]</p>`);
        expect(await select.text()).eq("[][]");
        expect(codes(select.diagnostics.errors)).eqls([
            "doenet-w0184",
            "doenet-w0184",
        ]);
        expect(select.diagnostics.warnings).eqls([]);
    });

    it("on a group tag, a name a branch lacks is an error", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><math name="y">2</math></else>
</conditionalContent>
<p name="p">[<group extend="$x"/>][<group extend="$cc.x"/>]</p>`);
        expect(await text()).eq("[][]");
        expect(codes(diagnostics.errors)).eqls([
            "doenet-w0183",
            "doenet-w0183",
        ]);
        expect(diagnostics.warnings).eqls([]);
    });

    it("on a group tag or a list tag, a name every case has with one type is made", async () => {
        const { text, toggle, diagnostics } = await setUp(
            `${sameTypeCases}<p name="p">[<group extend="$x"/>][<group extend="$cc.x"/>][<mathList extend="$x"/>]</p>`,
        );
        expect(await text()).eq("[2][2][2]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
        await toggle(true);
        expect(await text()).eq("[1][1][1]");
    });

    it("on a list tag, a mix of types is an error, unchanged", async () => {
        const { text, diagnostics } = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><text name="x">t</text></else>
</conditionalContent>
<p name="p">[<mathList extend="$x"/>]</p>`);
        expect(await text()).eq("[]");
        expect(codes(diagnostics.errors)).eqls(["doenet-e0066"]);
        expect(diagnostics.warnings).eqls([]);
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

    it("finds the name again after a branch holding a nested conditionalContent is left", async () => {
        const { core, text, toggle, diagnostics, resolvePathToNodeIdx } =
            await setUp(`
<booleanInput name="b2"/>
<conditionalContent name="cc">
    <case condition="$b">
        <conditionalContent>
            <case condition="$b2"><math name="x">1</math></case>
            <else><math name="x">2</math></else>
        </conditionalContent>
    </case>
    <else><math name="x">3</math></else>
</conditionalContent>
<p name="p">[$x][$cc.x]</p>`);
        expect(await text()).eq("[3][3]");
        await toggle(true);
        expect(await text()).eq("[2][2]");
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b2"),
            core,
        });
        expect(await text()).eq("[1][1]");
        await toggle(false);
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

    it("a name after an index into a conditionalContent is held to the every-case rule", async () => {
        const mixed = `<conditionalContent name="cc">
    <case condition="$b"><math name="x">1</math></case>
    <else><text name="x">t</text></else>
</conditionalContent>`;
        const bare = await setUp(`${mixed}<p name="p">[$cc[1].x]</p>`);
        expect(await bare.text()).eq("[]");
        expect(bare.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$cc[1].x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
        ]);

        const onTag = await setUp(
            `${mixed}<p name="p"><math extend="$cc[1].x"/></p>`,
        );
        expect(codes(onTag.diagnostics.errors)).eqls(["doenet-e0066"]);

        const same = await setUp(
            `${sameTypeCases}<p name="p">[$cc[1].x]<math extend="$cc[1].x"/></p>`,
        );
        expect(await same.text()).eq("[2]2");
        await same.toggle(true);
        expect(await same.text()).eq("[1]1");
        expect([...same.diagnostics.warnings, ...same.diagnostics.errors]).eqls(
            [],
        );
    });

    it("a name after a name in the branches is held to the every-branch rule", async () => {
        const branches = (caseX: string, elseX: string) => `
<conditionalContent name="cc">
    <case condition="$b"><group name="h">${caseX}</group></case>
    <else><group name="h">${elseX}</group></else>
</conditionalContent>`;

        const mixed = await setUp(
            `${branches(`<math name="x">1</math>`, `<text name="x">t</text>`)}<p name="p">[$h.x][$cc.h.x]</p>`,
        );
        expect(await mixed.text()).eq("[][]");
        await mixed.toggle(true);
        expect(await mixed.text()).eq("[][]");
        expect(mixed.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$h.x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
            "`$cc.h.x` names nothing: `x` is a `<math>` in one case of `cc` and a `<text>` in another. Use the same type, or different names.",
        ]);

        const missing = await setUp(
            `${branches(`<math name="x">1</math>`, `<math name="y">2</math>`)}<p name="p">[$h.x]<math extend="$h.x"/></p>`,
        );
        expect(await missing.text()).eq("[]");
        expect(missing.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$h.x` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
        ]);
        expect(codes(missing.diagnostics.errors)).eqls(["doenet-w0183"]);

        // A name in a select in every case, of different types in its options
        const nested = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><select name="t"><option><math name="x">1</math></option><option><text name="x">a</text></option></select></case>
    <else><select name="t"><option><math name="x">1</math></option><option><math name="x">2</math></option></select></else>
</conditionalContent>
<p name="p">[$t.x]</p>`);
        expect(await nested.text()).eq("[]");
        expect(nested.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$t.x` names nothing: `x` is a `<math>` in one option of `t` and a `<text>` in another. Use the same type, or different names.",
        ]);

        const same = await setUp(
            `${branches(`<math name="x">1</math>`, `<math name="x">2</math>`)}<p name="p">[$h.x][$h.x.value]<math extend="$h.x"/></p>`,
        );
        expect(await same.text()).eq("[2][2]2");
        await same.toggle(true);
        expect(await same.text()).eq("[1][1]1");
        expect([...same.diagnostics.warnings, ...same.diagnostics.errors]).eqls(
            [],
        );
    });

    it("a name after a name is held to the rule through a nested conditionalContent", async () => {
        // Every branch's `P` is a point, so `x` is its property, though a
        // component of the document is named `x`
        const property = await setUp(`
<math name="x">9</math>
<conditionalContent name="cc">
    <case condition="$b"><point name="P">(1,2)</point></case>
    <else><conditionalContent>
        <case condition="true"><point name="P">(5,6)</point></case>
        <else><point name="P">(3,4)</point></else>
    </conditionalContent></else>
</conditionalContent>
<p name="p">[$P.x]</p>`);
        expect(await property.text()).eq("[5]");
        await property.toggle(true);
        expect(await property.text()).eq("[1]");
        expect([
            ...property.diagnostics.warnings,
            ...property.diagnostics.errors,
        ]).eqls([]);

        // The `h` of each branch of the nested one has no `x`
        const missing = await setUp(`
<conditionalContent name="cc">
    <case condition="$b"><group name="h"><math name="x">1</math></group></case>
    <else><conditionalContent>
        <case condition="true"><group name="h"><math name="y">1</math></group></case>
        <else><group name="h"><math name="y">2</math></group></else>
    </conditionalContent></else>
</conditionalContent>
<p name="p">[$h.x]</p>`);
        expect(await missing.text()).eq("[]");
        expect(missing.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$h.x` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
        ]);
    });

    it("a property after a name in the branches is not a name, even one the document has", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<math name="value">7</math>
<conditionalContent name="cc">
    <case condition="$b"><math name="h">1</math></case>
    <else><math name="h">2</math></else>
</conditionalContent>
<p name="p">[$h.value]</p>`);
        expect(await text()).eq("[2]");
        await toggle(true);
        expect(await text()).eq("[1]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
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

    it("a branch lacking a name nearer the start is reported, though another lacks one after it", async () => {
        // The case's `h.x` lacks `y`, but the else's `h` lacks `x` itself
        const { text, toggle, diagnostics } = await setUp(`
<math name="y">5</math>
<conditionalContent name="cc">
    <case condition="$b"><group name="h"><group name="x"><math name="z">1</math></group></group></case>
    <else><group name="h"><math name="w">3</math></group></else>
</conditionalContent>
<p name="p">[$h.x.y]</p>`);
        expect(await text()).eq("[]");
        await toggle(true);
        expect(await text()).eq("[]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$h.x.y` names nothing: the `<else>` of `cc` has no `x`. Give it one, or use a name every case has.",
        ]);
    });

    it("a copy in a branch is not evidence that a name after it is a name", async () => {
        const { text, toggle, diagnostics } = await setUp(`
<math name="m">7</math>
<text name="value">v</text>
<conditionalContent name="cc">
    <case condition="$b"><math name="h" extend="$m"/></case>
    <else><math name="h">2</math></else>
</conditionalContent>
<p name="p">[$h.value]</p>`);
        expect(await text()).eq("[2]");
        await toggle(true);
        expect(await text()).eq("[7]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("a copy of a select is held to the rule with the options it adds", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
</select>
<select name="t" copy="$s"><option><text name="x">t</text></option></select>
<p name="p">[$t[1].x][$t.x]</p>`);
        expect(await text()).eq("[][]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$t[1].x` names nothing: `x` is a `<math>` in one option of `t` and a `<text>` in another. Use the same type, or different names.",
            "`$t.x` names nothing: `x` is a `<math>` in one option of `t` and a `<text>` in another. Use the same type, or different names.",
        ]);
    });

    it("on a tag, a private name in a repeat in a branch does not count", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math><repeat for="1 2" valueName="v"><text name="x">a</text></repeat></option>
    <option><math name="x">1</math></option>
</select>
<p name="p"><math extend="$s[1].x"/><math extend="$x"/></p>`);
        expect(await text()).eq("11");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
    });

    it("a property after a name in the branches warns when the type lacks it", async () => {
        const { text, toggle, diagnostics } = await setUp(
            `${sameTypeCases}<p name="p">[$x.nonexistent][$cc.x.nonexistent]</p>`,
        );
        expect(await text()).eq("[][]");
        await toggle(true);
        expect(await text()).eq("[][]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "No referent found for reference: `$x.nonexistent`",
            "No referent found for reference: `$cc.x.nonexistent`",
        ]);

        // and after an index into a select's picks
        const indexed = await setUp(`
<select name="s" numToSelect="2">
    <option><math name="x">1</math></option>
    <option><math name="x">2</math></option>
</select>
<p name="p">[$s[1].x.nonexistent]</p>`);
        expect(await indexed.text()).eq("[]");
        expect(indexed.diagnostics.warnings.map((w) => w.message)).eqls([
            "No referent found for reference: `$s[1].x.nonexistent`",
        ]);
    });

    it("on a tag, a name a nested case without an else holds can be absent, whatever follows it", async () => {
        // `x` is also a name of the document, so `$P.x` is followed as a
        // name into each `P`, which lacks it
        const { text, diagnostics } = await setUp(`
<math name="x">5</math>
<conditionalContent>
    <case condition="$b"><conditionalContent>
        <case condition="$b"><point name="P">(1,2)</point></case>
    </conditionalContent></case>
    <else><point name="P">(3,4)</point></else>
</conditionalContent>
<p name="p"><number extend="$P.x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls(["doenet-e0064"]);
    });

    it("on a tag, a select copied in each case is held to the rule in each", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
    <option><text name="x">t</text></option>
</select>
<conditionalContent>
    <case condition="$b"><select name="t" copy="$s"/></case>
    <else><select name="t" copy="$s"/></else>
</conditionalContent>
<p name="p"><math extend="$t.x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls(["doenet-e0066"]);
    });

    it("a name after an index into a select in each case is held to the rule", async () => {
        const doenetML = (reference: string) => `
<conditionalContent>
    <case condition="$b"><select name="h">
        <option><math name="x">1</math></option>
        <option><text name="x">t</text></option>
    </select></case>
    <else><select name="h">
        <option><math name="x">2</math></option>
        <option><text name="x">u</text></option>
    </select></else>
</conditionalContent>
<p name="p">${reference}</p>`;
        const bare = await setUp(doenetML("[$h[1].x]"));
        expect(await bare.text()).eq("[]");
        expect(bare.diagnostics.warnings.map((w) => w.message)).eqls([
            "`$h[1].x` names nothing: `x` is a `<math>` in one option of `h` and a `<text>` in another. Use the same type, or different names.",
        ]);
        const onTag = await setUp(doenetML(`<math extend="$h[1].x"/>`));
        expect(await onTag.text()).eq("");
        expect(codes(onTag.diagnostics.errors)).eqls(["doenet-e0066"]);
    });

    it("on a tag, an index past what a select picks is an error before the name after it", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
    <option><math name="x">2</math></option>
</select>
<p name="p"><math extend="$s[2].x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls(["doenet-w0181"]);
    });

    it("on a tag, an index past what a select picks is an error before an option lacking the name", async () => {
        const { text, diagnostics } = await setUp(`
<select name="s">
    <option><math name="x">1</math></option>
    <option><math name="y">2</math></option>
</select>
<p name="p"><math extend="$s[2].x"/></p>`);
        expect(await text()).eq("");
        expect(codes(diagnostics.errors)).eqls(["doenet-w0181"]);
    });

    it("on a tag, an index between names past what each select picks is an error", async () => {
        const doenetML = (numToSelect: string) => `
<conditionalContent>
    <case condition="$b"><select name="h"${numToSelect}>
        <option><math name="x">1</math></option>
        <option><math name="x">3</math></option>
    </select></case>
    <else><select name="h"${numToSelect}>
        <option><math name="x">2</math></option>
        <option><math name="x">4</math></option>
    </select></else>
</conditionalContent>
<p name="p"><math extend="$h[2].x"/></p>`;
        const past = await setUp(doenetML(""));
        expect(await past.text()).eq("");
        expect(codes(past.diagnostics.errors)).eqls(["doenet-w0181"]);

        // past each though they pick different numbers
        const pastBoth = await setUp(
            doenetML("")
                .replace(
                    `<else><select name="h">`,
                    `<else><select name="h" numToSelect="2">`,
                )
                .replace(`$h[2].x`, `$h[3].x`),
        );
        expect(await pastBoth.text()).eq("");
        expect(pastBoth.diagnostics.errors.map((e) => e.message)).eqls([
            "`$h[3].x`: the `<select>` made only 2 picks.",
        ]);

        const within = await setUp(doenetML(` numToSelect="2"`));
        expect(["2", "4"]).toContain(await within.text());
        expect([
            ...within.diagnostics.warnings,
            ...within.diagnostics.errors,
        ]).eqls([]);
    });

    it("a property after a name of different types in the branches names nothing, though a component has its name", async () => {
        const doenetML = (reference: string, elseTag = "text") => `
<text name="value">v</text>
<conditionalContent>
    <case condition="$b"><math name="x">1</math></case>
    <else><${elseTag} name="x">2</${elseTag}></else>
</conditionalContent>
<p name="p">${reference}</p>`;
        const message =
            "`$x.value` names nothing: `x` is a `<math>` in one case of the `<conditionalContent>` and a `<text>` in another. Use the same type, or different names.";
        const bare = await setUp(doenetML("[$x.value]"));
        expect(await bare.text()).eq("[]");
        expect(bare.diagnostics.warnings.map((w) => w.message)).eqls([message]);

        const onTag = await setUp(doenetML(`<text extend="$x.value"/>`));
        expect(await onTag.text()).eq("");
        expect(onTag.diagnostics.errors.map((w) => w.message)).eqls([message]);

        // and when no component has its name
        const unnamed = (reference: string) =>
            doenetML(reference).replace(`<text name="value">v</text>`, "");
        const bareUnnamed = await setUp(unnamed("[$x.value]"));
        expect(await bareUnnamed.text()).eq("[]");
        expect(bareUnnamed.diagnostics.warnings.map((w) => w.message)).eqls([
            message,
        ]);
        const onTagUnnamed = await setUp(unnamed(`<text extend="$x.value"/>`));
        expect(await onTagUnnamed.text()).eq("");
        expect(onTagUnnamed.diagnostics.errors.map((w) => w.message)).eqls([
            message,
        ]);

        const same = await setUp(doenetML("[$x.value]", "math"));
        expect(await same.text()).eq("[2]");
        expect([...same.diagnostics.warnings, ...same.diagnostics.errors]).eqls(
            [],
        );
    });

    it("a property after a name that is an integer in one case and a number in another is a number, on a number tag", async () => {
        // On a `<number>` tag, an `<integer>` counts as a `<number>`
        // (#2447), as for `<number extend="$x"/>`, and the `value` of
        // either is a number. A bare reference, or another tag, is held to
        // the same tag.
        const doenetML = (reference: string, named = "") => `${named}
<conditionalContent name="cc">
    <case condition="$b"><integer name="x">1</integer></case>
    <else><number name="x">2.5</number></else>
</conditionalContent>
<p name="p">${reference}</p>`;
        const tags = `<number extend="$x"/>|<number extend="$x.value"/>|<number extend="$cc.x.value"/>`;
        for (const named of ["", `<text name="value">v</text>`]) {
            const { text, toggle, diagnostics } = await setUp(
                doenetML(tags, named),
            );
            expect(await text()).eq("2.5|2.5|2.5");
            await toggle(true);
            expect(await text()).eq("1|1|1");
            await toggle(false);
            expect(await text()).eq("2.5|2.5|2.5");
            expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);
        }

        const message =
            "`$x.value` names nothing: `x` is a `<integer>` in one case of `cc` and a `<number>` in another. Use the same type, or different names.";
        const bare = await setUp(doenetML("[$x.value]"));
        expect(await bare.text()).eq("[]");
        expect(bare.diagnostics.warnings.map((w) => w.message)).eqls([message]);
        for (const tag of ["math", "integer"]) {
            const onTag = await setUp(doenetML(`<${tag} extend="$x.value"/>`));
            expect(await onTag.text()).eq("");
            expect(onTag.diagnostics.errors.map((e) => e.message)).eqls([
                message,
            ]);
        }

        // with no else, it can be absent (D36)
        const noElse = await setUp(
            doenetML(`<number extend="$x.value"/>`).replace(
                `<else><number name="x">2.5</number></else>`,
                `<case condition="true"><number name="x">2.5</number></case>`,
            ),
        );
        expect(codes(noElse.diagnostics.errors)).eqls(["doenet-e0064"]);
    });

    it("a name after a tag made from a container, not a composite, is its property", async () => {
        // `m` is a math, so `$m.value` is its value, though a component
        // is named `value`, not a name in the branches of `s`
        const doenetML = (tag: string) => `
<text name="value">v</text>
<select name="s">
    <option><math>2</math></option>
    <option><math>2</math></option>
</select>
<${tag} name="m" extend="$s"/>
<p name="p">[$m.value]</p>`;
        const { text, diagnostics } = await setUp(doenetML("math"));
        expect(await text()).eq("[2]");
        expect([...diagnostics.warnings, ...diagnostics.errors]).eqls([]);

        // a group holds what it copies, so the name is in the branches
        const group = await setUp(doenetML("group"));
        expect(await group.text()).eq("[]");
        expect(codes(group.diagnostics.warnings)).eqls(["doenet-w0183"]);
    });

    it("a select picks one for its names only when numToSelect is written as 1", async () => {
        // `01` picks one, but its names are private, as the resolver
        // reads it: the else has no visible `x`
        const { text, diagnostics } = await setUp(`
<conditionalContent>
    <case condition="$b"><math name="x">1</math></case>
    <else><select numToSelect="01"><option><math name="x">2</math></option></select></else>
</conditionalContent>
<p name="p">[$x]</p>`);
        expect(await text()).eq("[]");
        expect(diagnostics.warnings.map((w) => w.message)).eqls([
            "`$x` names nothing: the `<else>` of the `<conditionalContent>` has no `x`. Give it one, or use a name every case has.",
        ]);
    });
});
