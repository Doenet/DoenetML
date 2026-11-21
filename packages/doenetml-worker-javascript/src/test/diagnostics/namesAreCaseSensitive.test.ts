import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Tag, attribute and property names are matched exactly, as written
 * (NAME-0, D51, #2605). A name in another case is an unknown name, with the
 * name it differs from only in case suggested:
 *
 * - a tag is `doenet-e0002`, written with `copy` or `extend` as without;
 * - a property names nothing (`doenet-w0104`);
 * - an attribute is applied for one release under the component's spelling,
 *   with a warning (`doenet-w0197`), as D51's migration allows: the docs had
 *   taught `<graph xmin>` and the rest, so authors have written them widely.
 *   The attributes read before the core (`name`, `extend`, `copy`,
 *   `copyWithState`, a repeat's `valueName` and `indexName`) are
 *   `doenet-e0004` already.
 *
 * A keyword in an attribute's value stays case-insensitive.
 */
async function load(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    async function text(name: string) {
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues
            .text;
    }
    const { errors, warnings } = getDiagnosticsByType(core);
    const types = Object.values(stateVariables).map(
        (sv: any) => sv.componentType,
    );
    return { text, errors, warnings, types };
}

describe("Names are case-sensitive (D51) @group4", async () => {
    it("a tag in another case is an error, alone or with copy or extend", async () => {
        const cases = [
            {
                doenetML: `<MATH name="a">y</MATH><p name="p">$a</p>`,
                written: "MATH",
                suggestion: "math",
            },
            {
                doenetML: `<math name="m">x</math><MATH name="a" extend="$m"/><p name="p">$a</p>`,
                written: "MATH",
                suggestion: "math",
            },
            {
                doenetML: `<label name="l">hi</label><Label name="a" copy="$l"/><p name="p">$a</p>`,
                written: "Label",
                suggestion: "label",
            },
            {
                doenetML: `<math name="m">x</math><MATH name="a" copyWithState="$m"/><p name="p">$a</p>`,
                written: "MATH",
                suggestion: "math",
            },
        ];
        for (const { doenetML, written, suggestion } of cases) {
            const { text, errors, warnings } = await load(doenetML);
            // the reference to it reports nothing more (DIAG-4)
            expect(errors, doenetML).toHaveLength(1);
            expect(warnings, doenetML).toHaveLength(0);
            expect(errors[0].code).eq("doenet-e0002");
            expect(errors[0].message).eq(
                `Invalid component type: \`<${written}>\`. Did you mean \`<${suggestion}>\`?`,
            );
            expect(await text("p")).eq("＿");
        }
    });

    it("an unknown tag with extend is the same error as written alone", async () => {
        const { errors, warnings } = await load(
            `<math name="m">x</math><foo name="a" extend="$m"/><p name="p">$a</p>`,
        );
        expect(errors).toHaveLength(1);
        expect(warnings).toHaveLength(0);
        expect(errors[0].code).eq("doenet-e0002");
        expect(errors[0].message).eq("Invalid component type: `<foo>`");
    });

    it("an award or label copied in another case in an answer is an error, not award content (#2580 item 3)", async () => {
        {
            const { errors, types } = await load(`
<award name="aw"><math>x</math></award>
<answer name="ans"><mathInput/><Award copy="$aw"/></answer>
<p name="p">hi</p>`);
            expect(errors.map((e) => e.code)).toEqual(["doenet-e0002"]);
            expect(errors[0].message).eq(
                "Invalid component type: `<Award>`. Did you mean `<award>`?",
            );
            // no award wrapped around it, and no second input
            expect(types.filter((t) => t === "award")).toHaveLength(1);
            expect(types.filter((t) => t === "mathInput")).toHaveLength(1);
        }
        {
            const { errors, types } = await load(`
<label name="l">hi</label>
<answer name="ans"><Label copy="$l"/><award><math>x</math></award></answer>
<p name="p">hi</p>`);
            expect(errors.map((e) => e.code)).toEqual(["doenet-e0002"]);
            expect(errors[0].message).eq(
                "Invalid component type: `<Label>`. Did you mean `<label>`?",
            );
            // read as neither the answer's label nor award content: the
            // answer has the one award and one input written
            expect(types.filter((t) => t === "award")).toHaveLength(1);
            expect(types.filter((t) => t === "mathInput")).toHaveLength(1);
        }
    });

    it("an attribute in another case is applied, with a warning, for now", async () => {
        const cases = [
            {
                doenetML: `<math name="a" SIMPLIFY="full">x+x</math><p name="p">$a</p>`,
                text: "2 x",
                written: "SIMPLIFY",
                suggestion: "simplify",
                componentType: "math",
            },
            {
                doenetML: `<graph name="g" xmin="-3"/><p name="p">$g.xMin</p>`,
                text: "-3",
                written: "xmin",
                suggestion: "xMin",
                componentType: "graph",
            },
            {
                doenetML: `<mathInput name="mi" Prefill="3"/><p name="p">$mi</p>`,
                text: "3",
                written: "Prefill",
                suggestion: "prefill",
                componentType: "mathInput",
            },
            {
                doenetML: `<p name="p"><select NumToSelect="2" withReplacement><option><text>a</text></option></select></p>`,
                text: "a, a",
                written: "NumToSelect",
                suggestion: "numToSelect",
                componentType: "select",
            },
            {
                doenetML: `<p name="p"><text Hide>a</text>b</p>`,
                text: "b",
                written: "Hide",
                suggestion: "hide",
                componentType: "text",
            },
            {
                // on an extend, as on the tag written whole
                doenetML: `<math name="m">x+x</math><math name="a" extend="$m" Simplify="full"/><p name="p">$a</p>`,
                text: "2 x",
                written: "Simplify",
                suggestion: "simplify",
                componentType: "math",
            },
            {
                // a repeat's `for` is read by the core, so it is applied
                doenetML: `<p name="p"><repeat For="1 2" valueName="v">$v</repeat></p>`,
                text: "1, 2",
                written: "For",
                suggestion: "for",
                componentType: "repeat",
            },
        ];
        for (const c of cases) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(errors, c.doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                c.doenetML,
            ).toEqual(["doenet-w0197"]);
            expect(warnings[0].message).eq(
                `Attribute names are case-sensitive: write \`${c.suggestion}\`, not \`${c.written}\`, on a \`<${c.componentType}>\`. It is applied for now, but will be an error in a later release.`,
            );
            expect(await text("p"), c.doenetML).eq(c.text);
        }
    });

    it("the warning is marked at the attribute", async () => {
        const doenetML = `<math name="a" SIMPLIFY="full">x+x</math>`;
        const { warnings } = await load(doenetML);
        expect(warnings[0].position?.start.offset).eq(
            doenetML.indexOf("SIMPLIFY"),
        );
    });

    it("an attribute read before the core, in another case, is an unknown attribute", async () => {
        const cases = [
            {
                doenetML: `<math name="m">x</math><math name="a" COPY="$m"/><p name="p">$a</p>`,
                written: "COPY",
                suggestion: "copy",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" Extend="$m"/><p name="p">$a</p>`,
                written: "Extend",
                suggestion: "extend",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" CopyWithState="$m"/><p name="p">$a</p>`,
                written: "CopyWithState",
                suggestion: "copyWithState",
                componentType: "math",
            },
        ];
        for (const c of cases) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(
                errors.map((e) => e.code),
                c.doenetML,
            ).toEqual(["doenet-e0004"]);
            expect(errors[0].message).eq(
                `Invalid attribute "${c.written}" for a component of type \`<${c.componentType}>\`. Did you mean "${c.suggestion}"?`,
            );
            expect(warnings, c.doenetML).toHaveLength(0);
            expect(await text("p"), c.doenetML).eq("＿");
        }
    });

    it("`Name` is an unknown attribute, and names nothing", async () => {
        const { text, errors, warnings } = await load(
            `<text Name="t">hi</text><p name="p">$t</p>`,
        );
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0004"]);
        expect(errors[0].message).eq(
            'Invalid attribute "Name" for a component of type `<text>`. Did you mean "name"?',
        );
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0104"]);
        expect(await text("p")).eq("＿");
    });

    it("a repeat's `ValueName` and `IndexName` are unknown attributes", async () => {
        const { errors } = await load(
            `<p name="p"><repeat for="1 2" ValueName="v" IndexName="i">$v $i</repeat></p>`,
        );
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0004"]);
        expect(errors[0].message).eq(
            'Invalid attribute "ValueName" for a component of type `<repeat>`. Did you mean "valueName"?',
        );
    });

    it("`Name` on an extend is ignored, with the suggestion", async () => {
        const { text, errors, warnings } = await load(
            `<math name="m">x</math><math extend="$m" Name="a"/><p name="p">$m</p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0187"]);
        expect(warnings[0].message).eq(
            "The `Name` attribute is ignored: a `<math>` has no such attribute. Did you mean `name`?",
        );
        expect(await text("p")).eq("x");
    });

    it("`Name` on the document is reported and ignored", async () => {
        const { text, errors } = await load(
            `<document Name="d"><p name="p">hi</p></document>`,
        );
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0004"]);
        expect(errors[0].message).eq(
            'Invalid attribute "Name" for a component of type `<document>`. Did you mean "name"?',
        );
        expect(await text("p")).eq("hi");
    });

    it("an attribute written twice, in two cases, is an unknown attribute the second time", async () => {
        const { errors, warnings } = await load(
            `<graph name="g" xMin="1" xmin="-3"/><p name="p">$g.xMin</p>`,
        );
        expect(warnings).toHaveLength(0);
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0004"]);
        expect(errors[0].message).eq(
            'Invalid attribute "xmin" for a component of type `<graph>`. Did you mean "xMin"?',
        );
    });

    it("a property in another case names nothing, with the suggestion", async () => {
        const cases = [
            {
                doenetML: `<point name="P">(1,2)</point><p name="p">$P.X</p>`,
                reference: "$P.X",
                suggestion: "$P.x",
            },
            {
                doenetML: `<point name="P">(1,2)</point><math name="a" extend="$P.X"/><p name="p">$a</p>`,
                reference: "$P.X",
                suggestion: "$P.x",
            },
            // A collection's own property and an item's, after a
            // collection (#2569 item 5)
            {
                doenetML: `<p name="p"><repeat name="r" for="1 2" valueName="v">$v</repeat> $r.numitems</p>`,
                reference: "$r.numitems",
                suggestion: "$r.numItems",
                text: "1, 2 ＿",
            },
            {
                doenetML: `<group name="g"><repeat for="1 2" valueName="v">$v</repeat></group><p name="p">$g.numitems</p>`,
                // through a group of one holding the repeat
                reference: "$g.numitems",
                suggestion: undefined,
            },
            {
                doenetML: `<group name="g"><repeat for="1 2" valueName="v"><math>$v</math></repeat></group><p name="p">$g.Fixed</p>`,
                reference: "$g.Fixed",
                suggestion: "$g.fixed",
            },
        ];
        for (const c of cases) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(errors, c.doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                c.doenetML,
            ).toEqual(["doenet-w0104"]);
            expect(warnings[0].message, c.doenetML).toContain(
                `No referent found for reference: \`${c.reference}\``,
            );
            if (c.suggestion) {
                expect(warnings[0].message, c.doenetML).toContain(
                    `Did you mean \`${c.suggestion}\`?`,
                );
            }
            expect(await text("p"), c.doenetML).eq(c.text ?? "＿");
        }
    });

    it("a property in its own case still works", async () => {
        const { text, errors, warnings } = await load(
            `<point name="P">(1,2)</point><group name="g"><repeat name="r" for="1 2" valueName="v">$v</repeat></group><p name="p">$P.x $r.numItems</p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(await text("p")).eq("1 2");
    });

    it("a keyword in an attribute's value stays case-insensitive", async () => {
        const { text, errors, warnings } = await load(`
<math name="a" simplify="FULL">x+x</math>
<boolean name="b" hide="True">true</boolean>
<boolean name="c">TRUE</boolean>
<p name="p">$a $b.hidden $c</p>`);
        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(await text("p")).eq("2 x true true");
    });
});
