import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { withListEntriesAsComponents } from "../utils/list-entries";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    movePoint,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * D37: a missing value is a blank, and a tag whose source is missing is
 * missing (Doenet/DoenetML#2456).
 *
 * - A reference to one thing (a name, an index, a property, an iteration or
 *   a pick) gives that thing, or a missing value, which never equals
 *   anything.
 * - Missing shows as `＿` inline and is not drawn in a graph.
 * - A tag whose source is missing is itself missing, whatever it adds, and
 *   comes back, with its own children, when the source is there again.
 * - The bare form and the tag report the same warnings and errors, at the
 *   same level: only a type is a load-time error. Only the tag has the info
 *   that its index names nothing now (`doenet-i0054`).
 */

/**
 * The text of `p`, and the diagnostics, of `doenetML`, with the core it
 * made.
 */
async function shownAndReported(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const text =
        stateVariables[await resolvePathToNodeIdx("p")].stateValues.text;
    const { warnings, errors, infos } = getDiagnosticsByType(core);
    return { text, warnings, errors, infos, core, resolvePathToNodeIdx };
}

/** The renderer type of each component child the renderer of `componentIdx` draws. */
function rendererTypesOf(core: any, componentIdx: number) {
    const rendererState = core.core.rendererInstructionBuilder.rendererState;
    return rendererState[componentIdx].childrenInstructions
        .filter((child: any) => child?.componentIdx !== undefined)
        .map((child: any) => child.rendererType);
}

describe("Missing values and missing tags (D37) @group2", () => {
    it("shows a tag whose source is missing as a blank, whatever it adds", async () => {
        for (const tag of [
            `<math extend="$nothing"/>`,
            `<math extend="$nothing">+1</math>`,
            `<text extend="$nothing">hi</text>`,
            `<mathInput extend="$nothing"/>`,
            `<number extend="$nothing"/>`,
            `<boolean extend="$nothing"/>`,
            `<point extend="$nothing"/>`,
            `<group extend="$nothing">hi</group>`,
            `<math copy="$nothing"/>`,
        ]) {
            const {
                text,
                warnings,
                errors,
                infos,
                core,
                resolvePathToNodeIdx,
            } = await shownAndReported(`<p name="p">[${tag}]</p>`);
            expect(text, tag).eq("[＿]");
            expect([...errors, ...infos], tag).eqls([]);
            expect(
                warnings.map((w) => w.code),
                tag,
            ).eqls(["doenet-w0104"]);
            expect(warnings[0].args, tag).eqls({ reference: "$nothing" });
            expect(
                rendererTypesOf(core, await resolvePathToNodeIdx("p")),
                tag,
            ).eqls(["_blank"]);
        }
    });

    it("gives the bare form the same blank and the same warning", async () => {
        const bare = await shownAndReported(`<p name="p">[$nothing]</p>`);
        const tag = await shownAndReported(
            `<p name="p">[<math extend="$nothing"/>]</p>`,
        );
        expect(bare.text).eq("[＿]");
        expect(bare.text).eq(tag.text);
        expect(bare.warnings.map((w) => [w.code, w.args])).eqls(
            tag.warnings.map((w) => [w.code, w.args]),
        );
        expect([...bare.errors, ...tag.errors]).eqls([]);
    });

    it("shows a missing paragraph as a blank, without its children", async () => {
        const { core, resolvePathToNodeIdx, warnings, errors } =
            await shownAndReported(
                `<section name="sec"><p name="p2" extend="$nothing">note</p></section><p name="p">x</p>`,
            );
        expect(errors).eqls([]);
        expect(warnings.map((w) => w.code)).eqls(["doenet-w0104"]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        const p2 = stateVariables[await resolvePathToNodeIdx("p2")];
        expect(p2.componentType).eq("p");
        expect(p2.stateValues.valueMissing).eq(true);
        expect(
            rendererTypesOf(core, await resolvePathToNodeIdx("sec")),
        ).toContain("_blank");
    });

    it("is not `<T/>`: `<T/>` keeps its value, a missing tag reads as missing", async () => {
        const { text } = await shownAndReported(`
    <text name="t"/><number name="n"/><boolean name="b"/><point name="P"/>
    <text name="mt" extend="$nothing"/><number name="mn" extend="$nothing"/>
    <p name="p">[$t][$n][$b][$P][$mt][$mn][$mn.value][<number extend="$mn"/>]</p>
    `);
        expect(text).eq("[][NaN][false][(0, 0)][＿][＿][＿][＿]");
    });

    it("hides a hidden missing tag, and draws nothing of a missing point in a graph", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <p name="p">[<math extend="$nothing" hide/>]</p>
    <graph name="g"><point name="Q" extend="$nothing"/><point name="R">(1,2)</point></graph>
    `);
        expect(text).eq("[]");
        const stateVariables = await core.returnAllStateVariables(false, true);
        const Q = stateVariables[await resolvePathToNodeIdx("Q")];
        expect(Q.componentType).eq("point");
        expect(Q.stateValues.valueMissing).eq(true);
        // the blank renderer draws nothing in a graph
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("g"))).eqls([
            "_blank",
            "point",
        ]);
    });

    it("reports a property the type doesn't have as a warning, bare or tag", async () => {
        const { text, warnings, errors } = await shownAndReported(
            `<number name="n">3</number><p name="p">[$n.nonexistent][<number extend="$n.nonexistent"/>]</p>`,
        );
        expect(text).eq("[＿][＿]");
        expect(errors).eqls([]);
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0104",
            "doenet-w0104",
        ]);
    });

    it("reports a literal index past the picks as a warning, bare or tag", async () => {
        const { text, warnings, errors } = await shownAndReported(
            `<select name="s"><option><math name="x">1</math></option></select><p name="p">[$s[2]][<math extend="$s[2]"/>][<math extend="$s[2].x"/>]</p>`,
        );
        expect(text).eq("[＿][＿][＿]");
        expect(errors).eqls([]);
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0181",
            "doenet-w0181",
            "doenet-w0181",
        ]);
    });

    it("makes a tag of a conditionalContent with no else missing, with an info, while no case is active", async () => {
        const { text, errors, infos, core, resolvePathToNodeIdx } =
            await shownAndReported(`
    <booleanInput name="b" />
    <conditionalContent name="cc"><case condition="$b"><math name="x">1</math></case></conditionalContent>
    <p name="p">[<math extend="$cc"/>][$cc.x][<math extend="$cc.x"/>]</p>
    `);
        expect(errors).eqls([]);
        expect(text).eq("[＿][＿][＿]");
        expect(infos.map((i) => i.code)).eqls(["doenet-i0055"]);
        expect(infos[0].args).eqls({
            componentType: "math",
            source: "$cc",
        });

        async function current() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return {
                text: stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text,
                infos: getDiagnosticsByType(core).infos.map((i) => i.code),
            };
        }

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await current()).eqls({ text: "[1][1][1]", infos: [] });

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        expect(await current()).eqls({
            text: "[＿][＿][＿]",
            infos: ["doenet-i0055"],
        });
    });

    it("makes a tag whose index names nothing missing, and remakes it with its children", async () => {
        const { text, infos, core, resolvePathToNodeIdx } =
            await shownAndReported(`
    <mathInput name="i" prefill="5" />
    <repeatForSequence name="r" length="2" valueName="v"><p>$v</p></repeatForSequence>
    <mathList name="l">1 2</mathList>
    <section name="sec"><p name="pr" extend="$r[$i]">note</p></section>
    <p name="p">[$l[$i]][<math extend="$l[$i]"/>]</p>
    `);
        expect(text).eq("[＿][＿]");
        // one for each tag; the bare reference reports nothing past the end
        expect(infos.map((i) => i.code)).eqls(["doenet-i0054", "doenet-i0054"]);
        expect(infos[0].message).contain("is missing until it does");

        async function shownParagraph() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sec = stateVariables[await resolvePathToNodeIdx("sec")];
            const replacement =
                stateVariables[sec.activeChildren[0].componentIdx];
            return {
                missing: Boolean(replacement.stateValues.valueMissing),
                text: replacement.stateValues.text,
            };
        }
        expect((await shownParagraph()).missing).eq(true);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[2][2]");
        expect(await shownParagraph()).eqls({ missing: false, text: "2note" });
        expect(getDiagnosticsByType(core).infos).eqls([]);

        // past the end again, at run time
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        const stateVariables2 = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables2[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[＿][＿]");
        expect((await shownParagraph()).missing).eq(true);
        expect(getDiagnosticsByType(core).infos.map((i) => i.code)).eqls([
            "doenet-i0054",
            "doenet-i0054",
        ]);
    });

    it("makes a tag whose value doesn't convert missing", async () => {
        const { text, infos } = await shownAndReported(
            `<math name="m">x</math><p name="p">[<point extend="$m"/>]</p>`,
        );
        expect(text).eq("[＿]");
        expect(infos.map((i) => i.code)).eqls(["doenet-i0053"]);
        expect(infos[0].message).contain("so it is missing until it is");
    });

    it("treats a missing operand as a blank, and a missing value as never equal", async () => {
        const { text } = await shownAndReported(`
    <mathList name="l">1 2</mathList>
    <numberList name="nl">1 2</numberList>
    <booleanList name="bl">true</booleanList>
    <math name="m" extend="$nothing"/>
    <p name="p">[<sum>$l[5] 3</sum>][<sum>$nl[5] 3</sum>][<sum>$m 3</sum>][<boolean>$l[5] = $l[5]</boolean>][<boolean>$m = $m</boolean>][<and>$bl[3] true</and>][<or>$bl[3] true</or>]</p>
    `);
        expect(text).eq("[＿ + 3][＿ + 3][＿ + 3][false][false][false][true]");
    });

    it("treats a bare reference with no referent as a blank operand, as the tag", async () => {
        const { text, warnings } = await shownAndReported(`
    <number name="n">2</number>
    <p name="p">[<sum>$nothing 3</sum>][<sum><math extend="$nothing"/> 3</sum>][<sum>$n.nonexistent 3</sum>][<count>$nothing 3</count>][<and>$nothing true</and>][<or>$nothing true</or>]</p>
    `);
        expect(text).eq("[＿ + 3][＿ + 3][＿ + 3][2][false][true]");
        expect(warnings.map((w) => w.code)).eqls(Array(6).fill("doenet-w0104"));
    });

    it("gives the members of an array property, possibly none, and a blank for one entry", async () => {
        const { text } = await shownAndReported(`
    <function name="f" domain="[0,2]">(x+1)(x-2)(x-4)</function>
    <p name="p">[$f.minima][$f.minimumValues][$f.minimumLocations][$f.minimumValue1]</p>
    `);
        expect(text).eq("[][][][＿]");
    });

    it("reads a missing value in a text as a blank", async () => {
        const { text } = await shownAndReported(`
    <textList name="tl">a b</textList>
    <p name="p">[<text>$nothing</text>][<text>x $tl[5] y</text>][<text>x <text extend="$nothing"/></text>][<text/>]</p>
    `);
        expect(text).eq("[＿][x ＿ y][x ＿][]");
    });

    it("keeps an unlinked copy made while missing missing after a reload", async () => {
        const doenetML = `
    <mathInput name="i" prefill="5" />
    <repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence>
    <p name="p">[<math copy="$r[$i]"/>]</p>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        expect(await text()).eq("[＿]");
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        // a copy is unlinked, so it is not made again
        expect(await text()).eq("[＿]");

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await text()).eq("[＿]");
        expect(getDiagnosticsByType(core).infos.map((i: any) => i.code)).eqls([
            "doenet-i0054",
        ]);
    });

    it("keeps a tag made from a property of a missing component missing", async () => {
        const { text, errors } = await shownAndReported(`
    <number name="n" extend="$nothing"/>
    <p name="p">[<number extend="$n.value"/>][<number copy="$n.value"/>][$n.value]</p>
    `);
        expect(errors).eqls([]);
        expect(text).eq("[＿][＿][＿]");
    });

    it("reads a missing child of a label as a blank, as a text does", async () => {
        // A `<label>` makes its text with converters of its own; a missing
        // child is the plain blank there too, not `<T/>`'s value, on its own,
        // on a point and on an input.
        const { core, resolvePathToNodeIdx } = await shownAndReported(`
    <number name="nm" extend="$nothing"/>
    <label name="l1">A <number extend="$nothing"/> B</label>
    <label name="l2">A $nm B</label>
    <label name="l3">A <boolean extend="$nothing"/> B</label>
    <label name="l4">A <text extend="$nothing"/> B</label>
    <label name="l5">A <point extend="$nothing"/> B</label>
    <label name="l6">A <math extend="$nothing"/> B</label>
    <graph><point name="P"><label>A <number extend="$nothing"/> B</label></point></graph>
    <mathInput name="mi"><label>A <boolean extend="$nothing"/> B</label></mathInput>
    <p name="p">x</p>
    `);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["l1", "l2", "l3", "l4", "l5", "l6"]) {
            const label = stateVariables[await resolvePathToNodeIdx(name)];
            expect(label.stateValues.text, name).eq("A ＿ B");
            expect(label.stateValues.value, name).eq("A ＿ B");
            expect(label.stateValues.hasLatex, name).eq(false);
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.label,
        ).eq("A ＿ B");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi")].stateValues.label,
        ).eq("A ＿ B");
    });

    it("reads a missing child of a text as a blank, hidden or not", async () => {
        // A `<text>` reads its children's values and ignores their `hide`,
        // as a `<math>` does, so a missing child is a blank in it either way.
        const { text } = await shownAndReported(
            `<p name="p">[<text>x <text extend="$nothing" hide/></text>][<text>x <text extend="$nothing"/></text>][<text>x <text hide>y</text></text>]</p>`,
        );
        expect(text).eq("[x ＿][x ＿][x y]");
    });

    it("shows a missing list tag as one blank", async () => {
        const { text, warnings } = await shownAndReported(
            `<p name="p">[<numberList extend="$nothing"/>][<mathList name="ml" extend="$nothing"/>$ml]</p>`,
        );
        expect(text).eq("[＿][＿＿]");
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0104",
            "doenet-w0104",
        ]);
    });

    it("shows a choice input's selected value once a choice is made, and a blank before", async () => {
        // The tag is linked to the entry, so a write reaches it, and it is
        // missing only while the entry holds no value (#2487).
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
    <p name="p">[<text extend="$ci.selectedValue"/>][$ci.selectedValue]</p>
    `);
        expect(text).eq("[＿][＿]");
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("p"))).eqls([
            "_blank",
            "_blank",
        ]);
        await updateSelectedIndices({
            selectedIndices: [2],
            componentIdx: await resolvePathToNodeIdx("ci"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[b][b]");
        expect(
            rendererTypesOf(core, await resolvePathToNodeIdx("p")),
        ).not.toContain("_blank");
    });

    it("still reports a later branch holding several components after an empty one", async () => {
        for (const branches of [
            `<case condition="$b"></case><else><math>1</math><math>2</math></else>`,
            `<case condition="$b"><math>1</math><math>2</math></case><else></else>`,
        ]) {
            const { errors } = await shownAndReported(`
    <boolean name="b">true</boolean>
    <conditionalContent name="cc">${branches}</conditionalContent>
    <p name="p"><math extend="$cc"/></p>
    `);
            expect(
                errors.map((e) => [e.code, e.args?.reason]),
                branches,
            ).eqls([["doenet-e0064", "count"]]);
        }
    });

    it("gives a missing source's missing value to a math, a fixed reference and a tag", async () => {
        const { text, errors, core, resolvePathToNodeIdx } =
            await shownAndReported(`
    <number name="n" extend="$nothing"/>
    <group name="g" extend="$nothing"/>
    <repeatForSequence name="r" length="1"><number name="m" extend="$nothing"/><text>t</text></repeatForSequence>
    <p name="src" extend="$nothing"/>
    <p name="p">[<math>$n + 1</math>][<math extend="$g"/>][$r[1].m.value]</p>
    <section name="sec"><p name="target" extend="$src"><text name="child">note</text></p></section>
    `);
        expect(errors).eqls([]);
        expect(text).eq("[＿ + 1][＿][＿]");
        const stateVariables = await core.returnAllStateVariables(false, true);
        const target = stateVariables[await resolvePathToNodeIdx("target")];
        expect(target.stateValues.valueMissing).eq(true);
        expect(target.activeChildren).eqls([]);
    });

    it("shows an index that names nothing the same, bare or as a tag", async () => {
        // `$x` is `<X extend="$x"/>` (rule 5): both show a blank while an
        // index names nothing, and a name of different types in the branches
        // is the same error (only type is an error). The tag says so with the
        // info `doenet-i0054` while the index names nothing now, or the
        // warning that says why it never does; the bare reference reports
        // only those warnings (its info is left for the new core, #2281).
        const before = `<mathInput name="mi" prefill="7"/><number name="i">$mi</number><mathList name="l">1 2 3</mathList><number name="n">5</number><repeatForSequence name="r" length="2"><math name="m">x</math></repeatForSequence><group name="g"><math>a</math><math>b</math></group><select name="s" numToSelect="1"><option><math name="q">q</math></option></select><booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math name="x">1</math></case><else><text name="x">t</text></else></conditionalContent>`;
        const pairs: [string, string, string, string[]][] = [
            ["$l[$i]", "math", "＿", ["I doenet-i0054"]],
            ["$l[5]", "math", "＿", ["I doenet-i0054"]],
            ["$l[0]", "math", "＿", ["W doenet-w0104"]],
            ["$r[$i].m", "math", "＿", ["I doenet-i0054"]],
            ["$r[3].m", "math", "＿", ["I doenet-i0054"]],
            // an index after a group holding two components names nothing
            // (D27)
            ["$g[2]", "math", "＿", ["W doenet-w0188"]],
            ["$s[$i]", "math", "＿", ["I doenet-i0054"]],
            ["$s[3]", "math", "＿", ["W doenet-w0181"]],
            ["$n[1]", "number", "＿", ["W doenet-w0100"]],
            ["$x", "math", "", ["E"]],
            ["$cc.x", "math", "", ["E"]],
        ];
        for (const [reference, tag, shown, reportedOnTag] of pairs) {
            const reported = async (written: string) => {
                const { text, warnings, errors, infos } =
                    await shownAndReported(
                        `${before}<p name="p">[${written}]</p>`,
                    );
                expect(text, written).eq(`[${shown}]`);
                return [
                    ...errors.map(() => "E"),
                    ...warnings.map((w) => `W ${w.code}`),
                    ...infos.map((i) => `I ${i.code}`),
                ];
            };
            const onTag = await reported(`<${tag} extend="${reference}"/>`);
            expect(onTag, reference).eqls(reportedOnTag);
            const bare = await reported(reference);
            expect(
                bare.filter((d) => d === "E"),
                reference,
            ).eqls(onTag.filter((d) => d === "E"));
            expect(
                bare.filter((d) => d.startsWith("I")),
                reference,
            ).eqls([]);
        }

        // once the index names something, nothing is reported
        const { core, resolvePathToNodeIdx } = await shownAndReported(
            `${before}<p name="p">[$l[$i]][<math extend="$l[$i]"/>]</p>`,
        );
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[2][2]");
        expect(getDiagnosticsByType(core).infos).eqls([]);
    });

    it("reads a property that holds no value, as `maxNumber` of a collect with no limit, as missing", async () => {
        // `maxNumber` is `null` for no limit, which is no value (#2416), in
        // each form a `<collect>` takes: a list form (`y`), a composite
        // (`w`), and with a limit (`z`).
        const { text, warnings, errors, infos, core, resolvePathToNodeIdx } =
            await shownAndReported(`
    <p name="src"><text>a</text><text>b</text></p>
    <collect name="y" componentType="text" from="$src"/>
    <collect name="z" componentType="text" from="$src" maxNumber="1"/>
    <collect name="w" componentType="p" from="$src"/>
    <p name="p">[$y.maxNumber][$z.maxNumber][$w.maxNumber]</p>
    <p name="pn"><number name="n1" extend="$y.maxNumber"/><number name="n2" extend="$w.maxNumber"/><number name="n3" extend="$z.maxNumber"/></p>
    <math name="m1">$y.maxNumber</math>
    <math name="m2">$y.maxNumber + 1</math>
    <boolean name="b1">$y.maxNumber = 3</boolean>
    <boolean name="b2">$z.maxNumber = 1</boolean>
    `);
        expect(text).eq("[＿][1][＿]");
        expect([...errors, ...warnings, ...infos]).eqls([]);

        const stateVariables = await core.returnAllStateVariables(false, true);
        const stateValues = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        for (const name of ["n1", "n2"]) {
            expect((await stateValues(name)).valueMissing, name).eq(true);
        }
        expect((await stateValues("n3")).value).eq(1);
        expect((await stateValues("n3")).valueMissing).eq(false);
        expect((await stateValues("m1")).text).eq("＿");
        expect((await stateValues("m2")).text).eq("＿ + 1");
        expect((await stateValues("b1")).value).eq(false);
        expect((await stateValues("b2")).value).eq(true);

        // a missing number is drawn as a blank
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("pn"))).eqls([
            "_blank",
            "_blank",
            "number",
        ]);
    });
});

/**
 * D40 (Doenet/DoenetML#2461, #2487): a component whose value is made from
 * its children is missing while its content is only missing children, a
 * property that holds no value is missing as a tag, and a reference to one
 * thing that makes nothing is a blank in a `<text>` as in a `<p>`.
 */
describe("Missing content and missing values (D40) @group2", () => {
    it("makes a number, boolean or function whose content is only a missing reference missing", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <p name="p"><number name="n1">$nothing</number><integer name="n2">$nothing</integer><number name="n3"><math extend="$nothing"/></number><boolean name="b1">$nothing</boolean><when name="b2">$nothing</when><function name="f1">$nothing</function><function name="f2"><math extend="$nothing"/></function></p>
    `);
        expect(text).eq("＿＿＿＿＿＿＿");
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["n1", "n2", "n3", "b1", "b2", "f1", "f2"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .valueMissing,
                name,
            ).eq(true);
        }
        // all but the `<when>`, which is not drawn
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("p"))).eqls(
            Array(6).fill("_blank"),
        );
    });

    it("keeps a component whose content holds more than a missing reference, or none, as it was", async () => {
        // The blank takes part in an expression (D37). A `NaN` made from a
        // blank (`<number>$nothing + 1</number>`) is #2460.
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <number name="nm" extend="$nothing"/>
    <p name="p">[<number name="n1">$nothing + 1</number>][<boolean name="b1">$nothing = 1</boolean>][<boolean name="b2">$nm = $nm</boolean>][<function name="f1">$nothing + 1</function>][<number name="n2">3</number>][<number name="n3"/>][<boolean name="b3"/>][<and name="a1">$nothing</and>][<math name="m1">$nothing</math>][<text name="t1">$nothing</text>][<math name="m2">$nothing + 1</math>][<text name="t2">x $nothing y</text>]</p>
    `);
        expect(text).eq(
            "[NaN][false][false][＿ + 1][3][NaN][false][false][＿][＿][＿ + 1][x ＿ y]",
        );
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of [
            "n1",
            "b1",
            "b2",
            "f1",
            "n2",
            "n3",
            "b3",
            "a1",
            "m1",
            "t1",
            "m2",
            "t2",
        ]) {
            expect(
                Boolean(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .valueMissing,
                ),
                name,
            ).eq(false);
        }
    });

    it("makes a shape whose content is only a missing reference missing, not drawn in a graph", async () => {
        const { core, resolvePathToNodeIdx } = await shownAndReported(`
    <graph name="g"><circle name="c">$nothing</circle><polygon name="pg">$nothing</polygon><curve name="cv">$nothing</curve><circle name="c2"/></graph>
    <p name="p">x</p>
    `);
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["c", "pg", "cv"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .valueMissing,
                name,
            ).eq(true);
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                .valueMissing,
        ).eq(false);
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("g"))).eqls([
            "_blank",
            "_blank",
            "_blank",
            "circle",
        ]);
    });

    it("reads a reference to a number whose content is missing as missing, never equal", async () => {
        const { text } = await shownAndReported(`
    <number name="n">$nothing</number>
    <boolean name="bb">$nothing</boolean>
    <p name="p">[$n][$n.value][<boolean>$n = $n</boolean>][<boolean>$bb = $bb</boolean>][<math>$n + 1</math>]</p>
    `);
        expect(text).eq("[＿][＿][false][false][＿ + 1]");
    });

    it("makes a number whose content is missing from it again once the reference names something", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <mathInput name="i" prefill="5" />
    <mathList name="l">1 2</mathList>
    <p name="p"><number name="n">$l[$i]</number></p>
    `);
        expect(text).eq("＿");
        // drawn as a blank now, so the viewer is told to load the renderer
        // it is drawn with once it is not
        expect(core.core!.rendererTypesInDocument).toContain("number");

        async function current() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return {
                text: stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text,
                missing:
                    stateVariables[await resolvePathToNodeIdx("n")].stateValues
                        .valueMissing,
                drawn: rendererTypesOf(core, await resolvePathToNodeIdx("p")),
            };
        }
        expect(await current()).eqls({
            text: "＿",
            missing: true,
            drawn: ["_blank"],
        });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await current()).eqls({
            text: "2",
            missing: false,
            drawn: ["number"],
        });

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await current()).eqls({
            text: "＿",
            missing: true,
            drawn: ["_blank"],
        });
    });

    it("makes a tag or a property of a number whose content is missing missing while it is", async () => {
        // A tag of it (`b`), a tag of a property of it (`a`), a tag of
        // another type made around it (`c`, `d`), and the math a math reads
        // of it (its adapter, in `m`) are missing while it is, and come back
        // with it. An unlinked copy made while it is missing stays missing.
        const { core, resolvePathToNodeIdx } = await shownAndReported(`
    <mathInput name="i" prefill="5"/>
    <mathList name="l">1 2</mathList>
    <number name="n">$l[$i]</number>
    <p name="p">[<number name="a" extend="$n.value"/>][<number name="b" extend="$n"/>][<math name="c" extend="$n"/>][<text name="d" extend="$n"/>][<math name="m"><number extend="$n"/></math>][<number name="e" copy="$n.value"/>]</p>
    `);
        async function current() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const missing: Record<string, boolean> = {};
            for (const name of ["a", "b", "c", "d", "e"]) {
                missing[name] = Boolean(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .valueMissing,
                );
            }
            return {
                text: stateVariables[await resolvePathToNodeIdx("p")]
                    .stateValues.text,
                missing,
                drawn: rendererTypesOf(core, await resolvePathToNodeIdx("p")),
            };
        }
        expect(await current()).eqls({
            text: "[＿][＿][＿][＿][＿][＿]",
            missing: { a: true, b: true, c: true, d: true, e: true },
            drawn: Array(6)
                .fill("_blank")
                .map((t, i) => (i === 4 ? "math" : t)),
        });

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await current()).eqls({
            text: "[2][2][2][2][2][＿]",
            missing: { a: false, b: false, c: false, d: false, e: true },
            drawn: ["number", "number", "math", "text", "math", "_blank"],
        });
    });

    it("keeps an unlinked copy of a number whose content is missing as it was made, after a reload too", async () => {
        // Made while `n` is missing, a copy is missing for good; made while
        // it is not, a copy of its value keeps the value it was made with.
        const doenetML = `
    <mathInput name="i" prefill="5"/>
    <mathInput name="j" prefill="1"/>
    <mathList name="l">1 2</mathList>
    <number name="n">$l[$i]</number>
    <number name="n2">$l[$j]</number>
    <p name="p">[<number copy="$n"/>][<number copy="$n.value"/>][<math copy="$n"/>][<number copy="$n2.value"/>]</p>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function text() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        expect(await text()).eq("[＿][＿][＿][1]");
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("j"),
            core,
        });
        expect(await text()).eq("[＿][＿][＿][1]");

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        expect(await text()).eq("[＿][＿][＿][1]");
    });

    it("gives no credit for an award whose condition is missing", async () => {
        const { core, resolvePathToNodeIdx } = await shownAndReported(`
    <answer name="a1"><award>$nothing</award></answer>
    <answer name="a2"><award><when>$nothing</when></award></answer>
    <p name="p">x</p>
    `);
        for (const name of ["a1", "a2"]) {
            const componentIdx = await resolvePathToNodeIdx(name);
            await submitAnswer({ componentIdx, core });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[componentIdx].stateValues.creditAchieved,
                name,
            ).eq(0);
        }
    });

    it("makes a tag of a property entry that holds no value missing", async () => {
        const { text, errors, warnings, core, resolvePathToNodeIdx } =
            await shownAndReported(`
    <point name="P">(1,2)</point>
    <function name="f">x</function>
    <p name="p">[<number name="n1" extend="$P.z"/>][<number name="n2" extend="$P.x3"/>][<math name="n3" extend="$P.z"/>][<number name="n4" extend="$f.minimumValue1"/>][<number name="n5" copy="$P.z"/>][$P.z][<math name="m" extend="$P.x"/>]</p>
    `);
        expect([...errors, ...warnings]).eqls([]);
        expect(text).eq("[＿][＿][＿][＿][＿][＿][1]");
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["n1", "n2", "n3", "n4", "n5"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .valueMissing,
                name,
            ).eq(true);
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .valueMissing,
        ).eq(undefined);
    });

    it("keeps a tag of an array that holds no entries, which is a list, not missing", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <function name="f">x</function>
    <function name="g">(x-1)^2</function>
    <p name="p">[<text name="t1">$f.minima</text>][<text name="t2">$f.minimumValues</text>][$f.minima][<pointList name="pl1" extend="$f.minima"/>][<pointList name="pl2" extend="$g.minima"/>][<numberList name="nl" extend="$g.minimumValues"/>]</p>
    `);
        // A tag of an array holds its entries, possibly none.
        expect(text).eq("[][][][][(1, 0)][0]");
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues.value,
        ).eq("");
        for (const name of ["pl1", "pl2", "nl"]) {
            expect(
                Boolean(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .valueMissing,
                ),
                name,
            ).eq(false);
        }
    });

    it("makes a tag of an answer's submitted response missing before a submission", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <answer name="ans"><mathInput name="mi"/><award>x</award></answer>
    <p name="p">[<math name="m" extend="$ans.submittedResponse"/>][<boolean>$m = $m</boolean>]</p>
    `);
        expect(text).eq("[＿][false]");
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues
                .valueMissing,
        ).eq(true);
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("p"))).eqls([
            "_blank",
            "boolean",
        ]);

        await updateMathInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[y][true]");
        expect(rendererTypesOf(core, await resolvePathToNodeIdx("p"))).eqls([
            "math",
            "boolean",
        ]);
    });

    it("shows a reference to one thing that makes nothing through a composite as a blank in a text, a p and a math", async () => {
        const doenetML = `
    <p name="src"><text>a</text></p>
    <collect name="c" componentType="text" from="$src"/>
    <function name="f">x</function>
    <repeatForSequence name="r" length="2" valueName="v"><math>$v</math></repeatForSequence>
    <group name="terms"><text>a</text></group>
    `;
        for (const reference of [
            "$c.maxNumber",
            "$f.minimumValue1",
            "$r[3]",
            "$terms.maths",
        ]) {
            const { text, core, resolvePathToNodeIdx } = await shownAndReported(
                `${doenetML}
    <p name="p">[<text name="t1">${reference}</text>][<text name="t2">x ${reference} y</text>][${reference}][<math name="m">${reference}</math>][<boolean name="b">${reference} = ${reference}</boolean>]</p>`,
            );
            expect(text, reference).eq("[＿][x ＿ y][＿][＿][false]");
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const stateValues = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await stateValues("t1")).value, reference).eq("＿");
            expect((await stateValues("t2")).value, reference).eq("x ＿ y");
            expect((await stateValues("m")).text, reference).eq("＿");
            expect((await stateValues("b")).value, reference).eq(false);
        }
    });
});

describe("A missing entry of a list is a blank entry (D40) @group2", () => {
    /** The `text` of each of `names`. */
    async function texts(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const result: Record<string, string> = {};
        for (const name of names) {
            result[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return result;
    }

    it("shows a reference that names nothing as a blank entry, in every list", async () => {
        const { text, warnings } = await shownAndReported(`
    <mathList name="l">1 2 3</mathList>
    <numberList name="nl">1 2 3</numberList>
    <textList name="tl">a b</textList>
    <repeatForSequence name="r" length="2" valueName="v"><number>10$v</number></repeatForSequence>
    <p name="p">[<mathList>$l[5] 2</mathList>][<numberList>$nl[5] 2</numberList>][<textList>$tl[5] x</textList>][<mathList>$nothing 2</mathList>][<numberList>0 $r.x 9</numberList>][<mathList><math extend="$nothing"/> 2</mathList>][<numberList><number>$nothing</number> 2</numberList>]</p>
    `);
        expect(text).eq("[＿, 2][＿, 2][＿, x][＿, 2][0, ＿, 9][＿, 2][＿, 2]");
        expect(warnings.map((w) => w.code)).eqls([
            "doenet-w0104",
            "doenet-w0104",
            "doenet-w0104",
            "doenet-w0104",
        ]);
    });

    it("makes a blank entry of a list of points missing, not drawn, and a shape made from it missing", async () => {
        // A missing point is not `<point/>`'s (0, 0) (VAL-5): it shows `＿`
        // inline and is not drawn, and a shape whose points include it is
        // missing (D40), until the reference names a point again.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pts">(1,2) (3,4)</pointList>
    <mathInput name="i" prefill="3"/>
    <point name="M" extend="$nothing"/>
    <graph name="g">
      <pointList name="q">$pts[$i] (5,6)</pointList>
      <angle name="A" through="(1,0) (0,0) $pts[$i]" />
      <polygon name="poly" vertices="(1,0) (0,0) $pts[$i]" />
      <polygon name="poly2" vertices="(1,0) (0,0) $M" />
      <polygon name="poly3" vertices="$q" />
      <lineSegment name="ls" endpoints="(1,0) $pts[$i]" />
      <circle name="c" through="(1,0) $pts[$i] (0,1)" />
      <line name="l" through="(1,0) $pts[$i]" />
    </graph>
    <p name="p">[$q][$q[1]][$q[1].x][<point extend="$q[1]"/>]</p>
    `,
        });
        const shapes = ["A", "poly", "ls", "c", "l", "poly3"];
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("q")).entriesMissing).eqls([missing, false]);
            for (const name of shapes) {
                expect((await sv(name)).valueMissing, name).eq(missing);
            }
            expect((await sv("poly2")).valueMissing).eq(true);
            const rendererState =
                core.core!.rendererInstructionBuilder.rendererState;
            const drawn = rendererState[
                await resolvePathToNodeIdx("g")
            ].childrenInstructions.map((child: any) => child.rendererType);
            const blank = missing ? "_blank" : undefined;
            expect(drawn).eqls([
                blank ?? "point",
                "point",
                blank ?? "angle",
                blank ?? "polygon",
                "_blank",
                blank ?? "polygon",
                blank ?? "lineSegment",
                blank ?? "circle",
                blank ?? "line",
            ]);
        }
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[＿, (5, 6)][＿][＿][＿]");
        await check(true);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[(3, 4), (5, 6)][(3, 4)][3][(3, 4)]");
        await check(false);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check(true);
    });

    it("gives a blank point entry no action, and moves the entry after it, through a `<collect>` too", async () => {
        // A blank point can't be dragged (VAL-5); the entries after it keep
        // their places, so a drag of one moves that point, and only it.
        const { core, resolvePathToNodeIdx } = withListEntriesAsComponents(
            await createTestCore({
                doenetML: `
    <pointList name="pts">(1,2) (3,4)</pointList>
    <mathInput name="i" prefill="3"/>
    <graph name="g">
      <pointList name="pl">(1,2) $pts[$i] (5,6) <point name="Q">(7,8)</point></pointList>
    </graph>
    <graph name="g2"><collect name="c" from="$pl" componentType="point"/></graph>
    <p name="p">[$pl][$Q][$pts]</p>
    `,
            }),
        );
        async function shown() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .text;
        }
        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        for (const graph of ["g", "g2"]) {
            expect(
                rendererState[
                    await resolvePathToNodeIdx(graph)
                ].childrenInstructions.map(
                    (child: any) => Object.keys(child.actions).length > 0,
                ),
                graph,
            ).eqls([true, false, true, true]);
        }
        expect(await shown()).eq(
            "[(1, 2), ＿, (5, 6), (7, 8)][(7, 8)][(1, 2), (3, 4)]",
        );

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("pl[3]"),
            x: -1,
            y: -2,
            core,
        });
        expect(await shown()).eq(
            "[(1, 2), ＿, (-1, -2), (7, 8)][(7, 8)][(1, 2), (3, 4)]",
        );
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("c[4]"),
            x: -3,
            y: -4,
            core,
        });
        expect(await shown()).eq(
            "[(1, 2), ＿, (-1, -2), (-3, -4)][(-3, -4)][(1, 2), (3, 4)]",
        );
        // a move sent to the blank is not taken
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("pl[2]"),
            x: 9,
            y: 9,
            core,
        });
        expect(await shown()).eq(
            "[(1, 2), ＿, (-1, -2), (-3, -4)][(-3, -4)][(1, 2), (3, 4)]",
        );

        // once the entry names a point, it is dragged as the others
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(
            rendererState[
                await resolvePathToNodeIdx("g")
            ].childrenInstructions.map(
                (child: any) => Object.keys(child.actions).length > 0,
            ),
        ).eqls([true, true, true, true]);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("pl[2]"),
            x: 9,
            y: 9,
            core,
        });
        expect(await shown()).eq(
            "[(1, 2), (9, 9), (-1, -2), (-3, -4)][(-3, -4)][(1, 2), (9, 9)]",
        );
    });

    it("makes a blank entry of a list of vectors missing and not drawn", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vs">(1,2) (3,4)</vectorList>
    <mathInput name="i" prefill="3"/>
    <graph name="g">
      <vectorList name="vl">(1,2) $vs[$i]</vectorList>
      <vector name="v" extend="$vl[2]"/>
    </graph>
    <p name="p">[$vl][$vl[2]][$v]</p>
    `,
        });
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("vl")).entriesMissing).eqls([false, missing]);
            expect((await sv("v")).valueMissing).eq(missing);
            expect((await sv("p")).text).eq(
                missing
                    ? "[(1, 2), ＿][＿][＿]"
                    : "[(1, 2), (3, 4)][(3, 4)][(3, 4)]",
            );
            const blank = missing ? "_blank" : undefined;
            expect(rendererTypesOf(core, await resolvePathToNodeIdx("g"))).eqls(
                ["vector", blank ?? "vector", blank ?? "vector"],
            );
        }
        await check(true);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check(false);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check(true);
    });

    it("makes a function through, or a best-fit line of, a missing point missing, not made through the origin", async () => {
        // A blank point among a function's `through` or a best-fit line's
        // `data` is missing, as it is among a shape's points (D40, VAL-5),
        // rather than a point at (0, 0) it is made through.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pts">(1,2) (3,4)</pointList>
    <mathInput name="i" prefill="3"/>
    <function name="f" through="(0,1) $pts[$i] (5,1)"/>
    <graph name="g">
      <curve name="c">$f</curve>
      <bestFitLine name="b" data="(0,1) $pts[$i] (5,7)"/>
    </graph>
    <derivative name="d">$f</derivative>
    `,
        });
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            for (const name of ["f", "c", "b"]) {
                expect((await sv(name)).valueMissing, name).eq(missing);
            }
            const blank = missing ? "_blank" : undefined;
            expect(rendererTypesOf(core, await resolvePathToNodeIdx("g"))).eqls(
                [blank ?? "curve", blank ?? "line"],
            );
            return (await sv("b")).slope.evaluate_to_constant();
        }
        await check(true);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        // the line fit to (0, 1), (3, 4), (5, 7)
        expect(await check(false)).closeTo(45 / 38, 1e-12);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check(true);
    });

    it("holds no blank entry in a list tag that removes empty entries", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <numberList name="nl">1 2 3</numberList>
    <pointList name="pts">(1,2) (3,4)</pointList>
    <point name="P">(5,6)</point>
    <mathInput name="i" prefill="5"/>
    <p name="p">[<numberList name="a" extend="$nl[$i]" removeEmptyArrayEntries/>][<pointList name="b" extend="$pts[$i]" removeEmptyArrayEntries/>][<mathList name="c" extend="$P.xs[$i]" removeEmptyArrayEntries/>][<numberList name="d" extend="$nl[$i]"/>]</p>
    `);
        // an index that names nothing is a blank entry (D40), except where
        // the tag asks to remove empty entries
        expect(text).eq("[][][][＿]");
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[2][(3, 4)][6][2]");
    });

    it("shows a list tag over an index that names nothing as one blank entry", async () => {
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <mathList name="l">1 2 3</mathList>
    <numberList name="nl">1 2 3</numberList>
    <mathInput name="i" prefill="5"/>
    <p name="p">[<numberList name="a" extend="$nl[$i]"/>][<mathList name="b" extend="$l[5]"/>]</p>
    `);
        expect(text).eq("[＿][＿]");
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["a", "b"]) {
            const sv = stateVariables[await resolvePathToNodeIdx(name)];
            expect(sv.stateValues.entriesMissing, name).eqls([true]);
        }
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect((await texts(core, resolvePathToNodeIdx, ["p"])).p).eq(
            "[2][＿]",
        );
    });

    it("is missing, as is what reads it, until the reference names something again", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="nl">1 2 3</numberList>
    <textList name="tl">a b</textList>
    <mathInput name="i" prefill="5"/>
    <p name="p1"><numberList name="a">$nl[$i] 2</numberList> $a.numValues</p>
    <p name="p2"><textList name="b">$tl[$i] x</textList></p>
    <p name="p3"><number name="n1">$a[1]</number> <math name="m1" extend="$a[1]"/> [$a[1]] <number name="n2" extend="$a[1]"/></p>
    <p name="p4"><numberList name="c" extend="$a"/> <numberList name="d" copy="$a"/></p>
    <p name="p5"><boolean name="eq">$a = $a</boolean></p>
    <mathInput name="w" bindValueTo="$a[1]"/>
    `,
        });
        const names = ["p1", "p2", "p3", "p4", "p5"];
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            for (const name of ["a", "b", "c", "d"]) {
                expect((await sv(name)).entriesMissing, name).eqls([
                    missing,
                    false,
                ]);
            }
            for (const name of ["n1", "m1", "n2"]) {
                expect((await sv(name)).valueMissing, name).eq(missing);
            }
        }

        expect(await texts(core, resolvePathToNodeIdx, names)).eqls({
            p1: "＿, 2 2",
            p2: "＿, x",
            p3: "＿ ＿ [＿] ＿",
            p4: "＿, 2 ＿, 2",
            p5: "false",
        });
        await check(true);

        // a blank entry has no source to take a write
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("w"),
            core,
        });
        expect((await texts(core, resolvePathToNodeIdx, ["p1"])).p1).eq(
            "＿, 2 2",
        );

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await texts(core, resolvePathToNodeIdx, names)).eqls({
            p1: "2, 2 2",
            p2: "b, x",
            p3: "2 2 [2] 2",
            p4: "2, 2 2, 2",
            p5: "true",
        });
        await check(false);

        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect((await texts(core, resolvePathToNodeIdx, ["p3"])).p3).eq(
            "＿ ＿ [＿] ＿",
        );
        await check(true);
    });

    it("makes a reference to a blank entry through a path resolved at run time missing", async () => {
        // `$r[1].a[1]` is a reference a copy makes once it has resolved the
        // path, which is missing while the entry is blank, as `$a[1]` is.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="i" prefill="5"/>
    <numberList name="l">1 2</numberList>
    <repeat for="1" name="r">
      <numberList name="a">$l[$i] 2</numberList>
      <textList name="t">$l[$i] x</textList>
    </repeat>
    <p name="p1">[$r[1].a[1]] [$r[1].t[1]] $r[1].a</p>
    <p name="p2"><number name="n">$r[1].a[1]</number> <number name="n2" extend="$r[1].a[1]"/></p>
    <p name="p3"><boolean name="eq">$r[1].a[1] = $r[1].a[1]</boolean></p>
    `,
        });
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["n", "n2"]) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .valueMissing,
                    name,
                ).eq(missing);
            }
        }
        const names = ["p1", "p2", "p3"];

        expect(await texts(core, resolvePathToNodeIdx, names)).eqls({
            p1: "[＿] [＿] ＿, 2",
            p2: "＿ ＿",
            p3: "false",
        });
        await check(true);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await texts(core, resolvePathToNodeIdx, names)).eqls({
            p1: "[1] [1] 1, 2",
            p2: "1 1",
            p3: "true",
        });
        await check(false);

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await texts(core, resolvePathToNodeIdx, names)).eqls({
            p1: "[＿] [＿] ＿, 2",
            p2: "＿ ＿",
            p3: "false",
        });
        await check(true);
    });

    it("keeps a blank entry of a list a `<collect>` collects missing", async () => {
        // A `<collect>` of a list with a blank entry has that blank entry:
        // a blank point is not drawn, a shape made from it is missing, and a
        // reference to it is missing (D40, VAL-5), until it names a point.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pts">(1,2) (3,4)</pointList>
    <mathInput name="i" prefill="3"/>
    <graph name="g">
      <pointList name="pl">(0,0) (1,0) $pts[$i]</pointList>
      <collect name="c" from="$pl" componentType="point"/>
      <polygon name="poly" vertices="$c"/>
      <point name="P" extend="$c[3]"/>
    </graph>
    <mathList name="ml">$pts[$i] 2</mathList>
    <collect name="cm" from="$ml" componentType="math"/>
    <p name="p">[$c][$c[3]][<math name="m" extend="$cm[1]"/>]</p>
    `,
        });
        async function check(missing: boolean) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("c")).entriesMissing).eqls([
                false,
                false,
                missing,
            ]);
            expect((await sv("cm")).entriesMissing).eqls([missing, false]);
            for (const name of ["poly", "P", "m"]) {
                expect((await sv(name)).valueMissing, name).eq(missing);
            }
            const blank = missing ? "_blank" : undefined;
            expect(rendererTypesOf(core, await resolvePathToNodeIdx("g"))).eqls(
                [
                    "point",
                    "point",
                    blank ?? "point",
                    "point",
                    "point",
                    blank ?? "point",
                    blank ?? "polygon",
                    blank ?? "point",
                ],
            );
            return (await sv("p")).text;
        }
        expect(await check(true)).eq("[(0, 0), (1, 0), ＿][＿][＿]");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        expect(await check(false)).eq(
            "[(0, 0), (1, 0), (3, 4)][(3, 4)][(3, 4)]",
        );

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("i"),
            core,
        });
        await check(true);
    });
});
