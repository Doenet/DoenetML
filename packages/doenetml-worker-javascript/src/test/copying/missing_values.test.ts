import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
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

    it("shows a choice input's selected value once a choice is made", async () => {
        // The tag is linked to the entry, so a write reaches it; it is not
        // missing before a choice (a known gap), so that a copy of an award's
        // feedback stays hidden while the award has none.
        const { text, core, resolvePathToNodeIdx } = await shownAndReported(`
    <choiceInput name="ci"><choice>a</choice><choice>b</choice></choiceInput>
    <p name="p">[<text extend="$ci.selectedValue"/>][$ci.selectedValue]</p>
    `);
        expect(text).eq("[][＿]");
        await updateSelectedIndices({
            selectedIndices: [2],
            componentIdx: await resolvePathToNodeIdx("ci"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[b][b]");
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
        const before = `<mathInput name="mi" prefill="7"/><number name="i">$mi</number><mathList name="l">1 2 3</mathList><number name="n">5</number><repeatForSequence name="r" length="2"><math name="m">x</math></repeatForSequence><group name="g"><math>a</math></group><select name="s" numToSelect="1"><option><math name="q">q</math></option></select><booleanInput name="b"/><conditionalContent name="cc"><case condition="$b"><math name="x">1</math></case><else><text name="x">t</text></else></conditionalContent>`;
        const pairs: [string, string, string, string[]][] = [
            ["$l[$i]", "math", "＿", ["I doenet-i0054"]],
            ["$l[5]", "math", "＿", ["I doenet-i0054"]],
            ["$l[0]", "math", "＿", ["W doenet-w0104"]],
            ["$r[$i].m", "math", "＿", ["I doenet-i0054"]],
            ["$r[3].m", "math", "＿", ["I doenet-i0054"]],
            ["$g[2]", "math", "＿", ["I doenet-i0054"]],
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
});
