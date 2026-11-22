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
 *   The parser renames it before anything reads it, so this holds for every
 *   attribute the schema lists, and for `name`, `extend`, `copy` and
 *   `copyWithState` on every tag; the core renames any other the schema
 *   hides, or of a tag it hides.
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

    it("every attribute in another case is applied, including those read before the core", async () => {
        const cases = [
            {
                doenetML: `<math name="m">x</math><math name="a" COPY="$m"/><p name="p">$a</p>`,
                text: "x",
                written: "COPY",
                suggestion: "copy",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" Extend="$m"/><p name="p">$a</p>`,
                text: "x",
                written: "Extend",
                suggestion: "extend",
                componentType: "math",
            },
            {
                doenetML: `<math name="m">x</math><math name="a" CopyWithState="$m"/><p name="p">$a</p>`,
                text: "x",
                written: "CopyWithState",
                suggestion: "copyWithState",
                componentType: "math",
            },
            {
                doenetML: `<text Name="t">hi</text><p name="p">$t</p>`,
                text: "hi",
                written: "Name",
                suggestion: "name",
                componentType: "text",
            },
            {
                doenetML: `<math name="m">x</math><math extend="$m" Name="a"/><p name="p">$a</p>`,
                text: "x",
                written: "Name",
                suggestion: "name",
                componentType: "math",
            },
            {
                doenetML: `<p name="p"><repeat for="1 2" ValueName="v">$v</repeat></p>`,
                text: "1, 2",
                written: "ValueName",
                suggestion: "valueName",
                componentType: "repeat",
            },
            {
                doenetML: `<p name="p"><repeat for="a b" valueName="v" IndexName="i">$v$i</repeat></p>`,
                text: "a1, b2",
                written: "IndexName",
                suggestion: "indexName",
                componentType: "repeat",
            },
            {
                doenetML: `<p name="p"><conditionalContent Condition="true">yes</conditionalContent></p>`,
                text: "yes",
                written: "Condition",
                suggestion: "condition",
                componentType: "conditionalContent",
            },
            // A module's own attributes, which it takes besides those its
            // definition declares
            {
                doenetML: `<module name="mod"><moduleAttributes><math name="a">1</math></moduleAttributes><math name="q">$a</math></module><module Copy="$mod" a="5" name="m2"/><p name="p">$m2.q</p>`,
                text: "5",
                written: "Copy",
                suggestion: "copy",
                componentType: "module",
            },
            {
                doenetML: `<module name="mod"><moduleAttributes><math name="a">1</math></moduleAttributes><math name="q">$a</math></module><module copy="$mod" a="5" Name="m2"/><p name="p">$m2.q</p>`,
                text: "5",
                written: "Name",
                suggestion: "name",
                componentType: "module",
            },
            {
                doenetML: `<module name="mod"><moduleAttributes><math name="a">1</math></moduleAttributes><math name="q">$a</math></module><p name="p"><module copy="$mod" a="5" Hide/>b</p>`,
                text: "b",
                written: "Hide",
                suggestion: "hide",
                componentType: "module",
            },
        ];
        for (const c of cases) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(errors, c.doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                c.doenetML,
            ).toEqual(["doenet-w0197"]);
            expect(warnings[0].message, c.doenetML).eq(
                `Attribute names are case-sensitive: write \`${c.suggestion}\`, not \`${c.written}\`, on a \`<${c.componentType}>\`. It is applied for now, but will be an error in a later release.`,
            );
            expect(await text("p"), c.doenetML).eq(c.text);
        }
    });

    it("an attribute in another case on the document is applied too", async () => {
        const { text, errors, warnings } = await load(
            `<document Name="d"><p name="p">hi</p></document>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0197"]);
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

    it("an attribute the schema hides, or of a tag it hides, in another case is applied too", async () => {
        // The parser corrects only what the schema lists; the core corrects
        // the rest, with the same warning, and not twice.
        function message(written: string, suggestion: string, tag: string) {
            return `Attribute names are case-sensitive: write \`${suggestion}\`, not \`${written}\`, on a \`<${tag}>\`. It is applied for now, but will be an error in a later release.`;
        }
        {
            // `xMin` and `xMax` of a `<subsetOfRealsInput>` are not in the
            // schema
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<subsetOfRealsInput name="s" xmin="-3" XMAX="7"/><graph Xmin="-5"/>`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const s =
                stateVariables[await resolvePathToNodeIdx("s")].stateValues;
            expect(s.xMin).eq(-3);
            expect(s.xMax).eq(7);
            const { errors, warnings } = getDiagnosticsByType(core);
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message).sort()).toEqual(
                [
                    message("xmin", "xMin", "subsetOfRealsInput"),
                    message("XMAX", "xMax", "subsetOfRealsInput"),
                    message("Xmin", "xMin", "graph"),
                ].sort(),
            );
            expect(warnings.map((w) => w.code)).toEqual([
                "doenet-w0197",
                "doenet-w0197",
                "doenet-w0197",
            ]);
        }
        {
            // `<h>` is not in the schema
            const { text, errors, warnings } = await load(
                `<p name="p"><h Hide>hi</h>there</p>`,
            );
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message)).toEqual([
                message("Hide", "hide", "h"),
            ]);
            expect(await text("p")).eq("there");
        }
        {
            // written twice, in two cases
            const { errors, warnings } = await load(
                `<subsetOfRealsInput xMin="1" xmin="-3"/>`,
            );
            expect(warnings).toHaveLength(0);
            expect(errors.map((e) => e.code)).toEqual(["doenet-e0004"]);
            expect(errors[0].message).eq(
                'Invalid attribute "xmin" for a component of type `<subsetOfRealsInput>`. Did you mean "xMin"?',
            );
        }
    });

    it("name, extend, copy and copyWithState in another case are applied on a tag the schema hides too", async () => {
        // The parser corrects these four on any tag, as the resolver reads
        // them before the core could.
        function message(written: string, suggestion: string, tag: string) {
            return `Attribute names are case-sensitive: write \`${suggestion}\`, not \`${written}\`, on a \`<${tag}>\`. It is applied for now, but will be an error in a later release.`;
        }
        {
            const { text, errors, warnings } = await load(
                `<p name="p"><h name="x">hi</h><h Copy="$x"/><h Extend="$x" Hide/><h CopyWithState="$x"/></p>`,
            );
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message).sort()).toEqual(
                [
                    message("Copy", "copy", "h"),
                    message("Extend", "extend", "h"),
                    message("Hide", "hide", "h"),
                    message("CopyWithState", "copyWithState", "h"),
                ].sort(),
            );
            expect(await text("p")).eq("hihihi");
        }
        {
            const { text, errors, warnings } = await load(
                `<h Name="t">hi</h><p name="p">$t</p>`,
            );
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message)).toEqual([
                message("Name", "name", "h"),
            ]);
            expect(await text("p")).eq("hi");
        }
        {
            // a tag that is no component type: the error only, as nothing
            // is applied
            const { errors, warnings } = await load(
                `<math name="m">1</math><foo Extend="$m"/><foo Name="f"/>`,
            );
            expect(warnings).toHaveLength(0);
            expect(errors.map((e) => e.code)).toEqual([
                "doenet-e0002",
                "doenet-e0002",
            ]);
        }
        {
            // a `<division>` is its type, so is a component type, and the
            // warning is kept
            const { text, errors, warnings } = await load(
                `<division type="section" Name="s"><title>T</title></division><p name="p">$s.title</p>`,
            );
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message)).toEqual([
                message("Name", "name", "section"),
            ]);
            expect(await text("p")).eq("T");
        }
        {
            // written twice, in two cases: the second is an attribute the
            // copy doesn't have
            const { errors, warnings } = await load(
                `<p name="p"><h name="x">hi</h><h copy="$x" Copy="$x"/></p>`,
            );
            expect(errors).toHaveLength(0);
            expect(warnings.map((w) => w.message)).toEqual([
                "The `Copy` attribute is ignored: a `<h>` has no such attribute. Did you mean `copy`?",
            ]);
        }
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

    it("a module attribute is matched exactly, one in another case applied with a warning, for now", async () => {
        const definition = `<module name="mod"><moduleAttributes><math name="a">1</math></moduleAttributes><math name="q">$a</math></module>`;

        let { text, errors, warnings } = await load(
            `${definition}<module copy="$mod" a="5" name="m2"/><p name="p">$m2.q</p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(await text("p")).eq("5");

        // #2627 item 2: `A` set `a` silently
        ({ text, errors, warnings } = await load(
            `${definition}<module copy="$mod" A="5" name="m2"/><p name="p">$m2.q</p>`,
        ));
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0197"]);
        expect(warnings[0].message).eq(
            "Attribute names are case-sensitive: write `a`, not `A`, on a `<module>`. It is applied for now, but will be an error in a later release.",
        );
        expect(await text("p")).eq("5");

        // Each sets the one of its own name when both are declared.
        ({ text, errors, warnings } = await load(
            `<module name="mod"><moduleAttributes><math name="a">1</math><math name="A">2</math></moduleAttributes><math name="q">$a</math><math name="r">$A</math></module><module copy="$mod" A="5" name="m2"/><p name="p">$m2.q $m2.r</p>`,
        ));
        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(await text("p")).eq("1 5");

        // An extend can't be given one in another case either, as it can't
        // be given the one it is applied under (`doenet-e0060`).
        ({ errors, warnings } = await load(
            `${definition}<module extend="$mod" A="5" name="m2"/>`,
        ));
        expect(errors.map((e) => [e.code, e.message])).toEqual([
            [
                "doenet-e0060",
                "A `<module>` makes its content from its attributes. An `extend` shows the same content as `$mod`, so it can't change `A`. To make the module with a different `A`, use `copy`.",
            ],
        ]);
    });

    it("an array entry or its alias in another case suggests the index form (NAME-2)", async () => {
        const cases = [
            {
                doenetML: `<point name="P">(1,2)</point><p name="p">$P.X1</p>`,
                reference: "$P.X1",
                suggestion: "$P.xs[1]",
            },
            {
                doenetML: `<polygon name="poly" vertices="(1,2) (3,4) (5,6)"/><p name="p">$poly.Vertex2</p>`,
                reference: "$poly.Vertex2",
                suggestion: "$poly.vertices[2]",
            },
            {
                doenetML: `<polygon name="poly" vertices="(1,2) (3,4) (5,6)"/><p name="p">$poly.VertexX2_1</p>`,
                reference: "$poly.VertexX2_1",
                suggestion: "$poly.vertices[2][1]",
            },
            {
                // as quickly for an entry far along
                doenetML: `<polygon name="poly" vertices="(1,2) (3,4) (5,6)"/><p name="p">$poly.VERTEX100000</p>`,
                reference: "$poly.VERTEX100000",
                suggestion: "$poly.vertices[100000]",
            },
        ];
        for (const c of cases) {
            const { text, errors, warnings } = await load(c.doenetML);
            expect(errors, c.doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                c.doenetML,
            ).toEqual(["doenet-w0104"]);
            expect(warnings[0].message, c.doenetML).eq(
                `No referent found for reference: \`${c.reference}\`. Did you mean \`${c.suggestion}\`?`,
            );
            expect(await text("p"), c.doenetML).eq("＿");
        }

        // and each suggestion names what the entry did
        const { text, errors, warnings } = await load(
            `<point name="P">(1,2)</point><polygon name="poly" vertices="(1,2) (3,4) (5,6)"/><p name="p">$P.xs[1], $P.x1; $poly.vertices[2], $poly.vertex2; $poly.vertices[2][1], $poly.vertexX2_1</p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings).toHaveLength(0);
        expect(await text("p")).eq("1, 1; (3, 4), (3, 4); 3, 3");
    });

    it("an action's target property in another case suggests the property (w0044)", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<number name="n">1</number><updateValue name="uv" target="$n.Value" newValue="2"/><point name="P">(1,2)</point><updateValue name="uv2" target="$P.X1" newValue="3"/>`,
        });
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("uv"),
            actionName: "updateValue",
            args: {},
        });
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("uv2"),
            actionName: "updateValue",
            args: {},
        });
        let { errors, warnings } = getDiagnosticsByType(core);
        expect(errors).toHaveLength(0);
        const messages = warnings
            .filter((w) => w.code === "doenet-w0044")
            .map((w) => w.message);
        expect(messages).toContain(
            'Invalid target for `<updateValue>`: cannot find a state variable named "Value" on a `<number>`. Did you mean "value"?',
        );
        expect(messages).toContain(
            'Invalid target for `<updateValue>`: cannot find a state variable named "X1" on a `<point>`. Did you mean "xs[1]"?',
        );

        // and an `<animateFromSequence>`'s, reported when it loads
        ({ warnings } = await load(
            `<number name="n">1</number><animateFromSequence target="$n.Value" from="1" to="3"/>`,
        ));
        expect(warnings.map((w) => [w.code, w.message])).toEqual([
            [
                "doenet-w0044",
                'Invalid target for `<animateFromSequence>`: cannot find a state variable named "Value" on a `<number>`. Did you mean "value"?',
            ],
        ]);
    });

    it("a sortByProp naming no property is a warning at load (#2627 item 5)", async () => {
        const doenetML = `<p name="p"><sort sortByProp="height"><point>(3,1)</point><point>(1,2)</point></sort></p>`;
        const { text, errors, warnings } = await load(doenetML);
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0198"]);
        expect(warnings[0].message).eq(
            '`sortByProp="height"` names no property of a `<point>`, so the `<sort>` can\'t compare its items by it.',
        );
        // left in the order written, as before
        expect(await text("p")).eq("(3, 1), (1, 2)");

        // one each item has, as written, is not reported
        const second = await load(
            `<p name="p"><sort sortByProp="y"><point>(3,2)</point><point>(1,1)</point></sort></p><p name="q"><sort sortByProp="x2"><point>(3,2)</point><point>(1,1)</point></sort></p>`,
        );
        expect(second.errors).toHaveLength(0);
        expect(second.warnings).toHaveLength(0);
        expect(await second.text("p")).eq("(1, 1), (3, 2)");
        expect(await second.text("q")).eq("(1, 1), (3, 2)");
    });

    it("a sortByProp in another case is applied, with a warning, for now (D62)", async () => {
        const cases = [
            { sortByProp: "X", suggestion: "x", text: "(1, 2), (3, 1)" },
            { sortByProp: "X2", suggestion: "x2", text: "(3, 1), (1, 2)" },
            { sortByProp: "Y", suggestion: "y", text: "(3, 1), (1, 2)" },
        ];
        for (const { sortByProp, suggestion, text: shown } of cases) {
            const doenetML = `<p name="p"><sort sortByProp="${sortByProp}"><point>(3,1)</point><point>(1,2)</point></sort></p>`;
            const { text, errors, warnings } = await load(doenetML);
            expect(errors, doenetML).toHaveLength(0);
            expect(
                warnings.map((w) => w.code),
                doenetML,
            ).toEqual(["doenet-w0197"]);
            expect(warnings[0].message, doenetML).eq(
                `Names are case-sensitive: write \`sortByProp="${suggestion}"\`, not \`sortByProp="${sortByProp}"\`, on a \`<sort>\`. It is applied for now, but will be an error in a later release.`,
            );
            expect(warnings[0].position?.start.offset).eq(
                doenetML.indexOf("sortByProp"),
            );
            expect(await text("p"), doenetML).eq(shown);
        }

        // on text pieces too (`value` of each text)
        const pieces = await load(
            `<p name="p"><sort sortByProp="Value">c a b</sort></p>`,
        );
        expect(pieces.warnings.map((w) => w.code)).toEqual(["doenet-w0197"]);
        expect(await pieces.text("p")).eq("a, b, c");
    });

    it("a sortByProp in another case is not applied on items not of one type, an error", async () => {
        const { errors, warnings } = await load(
            `<p name="p"><sort sortByProp="X"><point>(3,1)</point><point>(1,2)</point><text>a</text></sort></p>`,
        );
        // a point and a text are of two types, an error that says so first
        expect(warnings.map((w) => w.code)).not.toContain("doenet-w0197");
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0076"]);
    });

    it("a sortByProp of bare text pieces naming no property is a warning at load (#2627 item 13)", async () => {
        const { text, errors, warnings } = await load(
            `<p name="p"><sort sortByProp="x">3 1 2</sort></p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0198"]);
        expect(warnings[0].message).eq(
            '`sortByProp="x"` names no property of a `<number>`, so the `<sort>` can\'t compare its items by it.',
        );
        expect(await text("p")).eq("3, 1, 2");

        // one the pieces have is not reported
        const second = await load(
            `<p name="p"><sort sortByProp="value">c a b</sort></p>`,
        );
        expect(second.warnings).toHaveLength(0);
        expect(await second.text("p")).eq("a, b, c");
    });

    it("a sortByProp written as a reference is an error at the attribute (#2627 item 13)", async () => {
        const doenetML = `<text name="t">x</text><p name="p"><sort sortByProp="$t"><point>(3,1)</point><point>(1,2)</point></sort></p>`;
        const { text, errors, warnings } = await load(doenetML);
        expect(warnings).toHaveLength(0);
        expect(errors.map((e) => e.code)).toEqual(["doenet-e0090"]);
        expect(errors[0].message).eq(
            "The attribute `sortByProp` can't be written with a reference: it is read when the document loads, before references are. Write its value as text.",
        );
        expect(errors[0].position?.start.offset).eq(
            doenetML.indexOf("sortByProp"),
        );
        expect(await text("p")).eq("");
    });

    it("a tag named in a value is matched exactly, one in another case applied with a warning, for now (D62)", async () => {
        const doenetML = `<group name="g"><point>(1,2)</point><point>(3,4)</point><text>a</text></group><p name="p"><collect name="c" componentType="Point" from="$g"/></p><p name="q">$c.numItems</p>`;
        const { text, errors, warnings } = await load(doenetML);
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0197"]);
        expect(warnings[0].message).eq(
            'Names are case-sensitive: write `componentType="point"`, not `componentType="Point"`, on a `<collect>`. It is applied for now, but will be an error in a later release.',
        );
        expect(warnings[0].position?.start.offset).eq(
            doenetML.indexOf("componentType"),
        );
        expect(await text("p")).eq("(1, 2), (3, 4)");
        expect(await text("q")).eq("2");

        // in its own case, no warning
        const exact = await load(
            `<group name="g"><point>(1,2)</point></group><p name="p"><collect componentType="point" from="$g"/></p>`,
        );
        expect(exact.warnings).toHaveLength(0);
        expect(await exact.text("p")).eq("(1, 2)");

        // a keyword in a value stays case-insensitive, a name doesn't
        const named = await load(
            `<text name="ty">Point</text><group name="g"><point>(1,2)</point></group><p name="p"><collect componentType="$ty" from="$g"/></p>`,
        );
        // from a value, not written as text, it is matched exactly
        expect(named.warnings.map((w) => w.code)).toEqual(["doenet-w0073"]);
        expect(named.warnings[0].message).eq(
            'Cannot collect components of type `<Point>` as it is an invalid component type. Did you mean `componentType="point"`?',
        );
        expect(await named.text("p")).eq("");
    });

    it("an attribute written twice in the same case is a warning at the second; the first is used (D62)", async () => {
        const doenetML = `<math name="m" simplify="full" simplify="none">x+x</math><p name="p">$m</p>`;
        const { text, errors, warnings } = await load(doenetML);
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual(["doenet-w0201"]);
        expect(warnings[0].message).eq(
            "The attribute `simplify` is written more than once on this `<math>`. The first is used, and this one is ignored.",
        );
        expect(warnings[0].position?.start.offset).eq(
            doenetML.indexOf('simplify="none"'),
        );
        expect(await text("p")).eq("2 x");
    });

    it("a sortByProp of a sortIndices is checked too", async () => {
        const { text, errors, warnings } = await load(
            `<p name="p"><sortIndices sortByProp="Y"><point>(3,2)</point><point>(1,1)</point></sortIndices></p><p name="q"><sortIndices sortByProp="height"><point>(3,2)</point><point>(1,1)</point></sortIndices></p>`,
        );
        expect(errors).toHaveLength(0);
        expect(warnings.map((w) => w.code)).toEqual([
            "doenet-w0197",
            "doenet-w0198",
        ]);
        expect(await text("p")).eq("2, 1");
    });
});
