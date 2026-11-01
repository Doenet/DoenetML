import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The style of an entry of a list (D29's container model, CTX-5, #2374).
 * A list's `styleNumber` fills in for an entry whose source sets none; it
 * never overrides a style the source sets. This holds for every list: a
 * `<collect>` (a composite or a list form), a `<sort>` or `<shuffle>`, and
 * an authored list (`<mathList>`, `<pointList>`, …), for the entry as it is
 * drawn, as `$l[k]` and as a component made from it
 * (`<point extend="$l[k]"/>`).
 */
describe("The style of an entry of a list @group4", async () => {
    async function styleNumbersOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const result: Record<string, number> = {};
        for (const name of names) {
            result[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.styleNumber;
        }
        return result;
    }

    /**
     * The text, or latex, and text color of each child the viewer draws for
     * `name`.
     */
    async function drawnIn(core: any, resolvePathToNodeIdx: any, name: string) {
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        return rendererState[
            await resolvePathToNodeIdx(name)
        ].childrenInstructions
            .filter((child: any) => typeof child === "object" && child)
            .map((child: any) => {
                const stateValues =
                    rendererState[child.componentIdx].stateValues;
                return [
                    stateValues.latex ?? stateValues.text,
                    stateValues.selectedStyle?.textColor,
                ];
            });
    }

    const styleDefinitions = `
    <setup>
      <styleDefinition styleNumber="2" textColor="red" />
      <styleDefinition styleNumber="3" textColor="green" />
      <styleDefinition styleNumber="4" textColor="blue" />
    </setup>`;

    it("the entries of a collect of points, and of a pointList, as in #2374", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="A" styleNumber="3">(1,2)</point>
      <point name="B">(3,4)</point>
    </graph>
    <collect name="c" from="$_graph1" componentType="point" styleNumber="2"/>
    <collect name="d" from="$_graph1" componentType="point"/>
    <pointList name="pl" styleNumber="2">
      <point styleNumber="3">(1,2)</point><point>(3,4)</point>
    </pointList>
    <pointList name="pl0">
      <point styleNumber="3">(1,2)</point><point>(3,4)</point>
    </pointList>
    <graph>
      <point name="c1" extend="$c[1]"/>
      <point name="c2" extend="$c[2]"/>
      <point name="d1" extend="$d[1]"/>
      <point name="d2" extend="$d[2]"/>
      <point name="p1" extend="$pl[1]"/>
      <point name="p2" extend="$pl[2]"/>
      <point name="q1" extend="$pl0[1]"/>
      <point name="q2" extend="$pl0[2]"/>
    </graph>
    <graph styleNumber="4">
      <point name="q2b" extend="$pl0[2]"/>
    </graph>
    `,
        });

        expect(
            await styleNumbersOf(core, resolvePathToNodeIdx, [
                "c[1]",
                "c[2]",
                "c1",
                "c2",
                "d1",
                "d2",
                "p1",
                "p2",
                "q1",
                "q2",
                "q2b",
                "pl",
            ]),
        ).eqls({
            // the source sets 3, the list 2
            "c[1]": 3,
            c1: 3,
            // the source sets none, the list 2
            "c[2]": 2,
            c2: 2,
            // the source sets 3, the list none
            d1: 3,
            // neither sets one
            d2: 1,
            // an authored entry sets 3, the list 2
            p1: 3,
            // an authored entry sets none, the list 2
            p2: 2,
            q1: 3,
            q2: 1,
            // neither sets one: the style is where the component is
            q2b: 4,
            // the list's own
            pl: 2,
        });
    });

    it("a collect of points takes the style of what it collects from a reference, an extend or a list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="A" styleNumber="3">(1,2)</point>
    <point name="B">(1,2)</point>
    <graph name="g">
      $A $B <point extend="$A" />
      <pointList><point styleNumber="3">(1,2)</point><point>(3,4)</point></pointList>
      <pointList styleNumber="4"><point styleNumber="3">(1,2)</point><point>(3,4)</point></pointList>
    </graph>
    <collect from="$g" componentType="point" styleNumber="2" name="c"/>
    <graph>
      <point extend="$c[5]" name="e5"/>
      <point extend="$c[7]" name="e7"/>
    </graph>
    `,
        });

        expect(
            await styleNumbersOf(core, resolvePathToNodeIdx, [
                "c[1]",
                "c[2]",
                "c[3]",
                "c[4]",
                "c[5]",
                "c[6]",
                "c[7]",
                "e5",
                "e7",
            ]),
        ).eqls({
            "c[1]": 3,
            "c[2]": 2,
            "c[3]": 3,
            "c[4]": 3,
            "c[5]": 2,
            "c[6]": 3,
            // the entry's list sets 4
            "c[7]": 4,
            e5: 2,
            e7: 4,
        });
    });

    it("a collect of points fills in the style of a point that has one only from where it sits", async () => {
        // A copy made elsewhere would not have a style its source takes
        // from its graph, group or intersection, so the collect's applies,
        // as an extend of a group's does.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl"><point>(1,2)</point></pointList>
    <graph styleNumber="4" name="g">
      <point name="B">(3,4)</point>
      <group><point name="gp">(1,1)</point></group>
      <point name="X" extend="$pl[1]"/>
      <line name="l1" through="(0,0) (1,1)"/><line name="l2" through="(0,1) (1,0)"/>
      <intersection styleNumber="3" name="i">$l1 $l2</intersection>
      <point name="A" styleNumber="5">(5,6)</point>
    </graph>
    <graph><collect from="$g" componentType="point" styleNumber="2" name="c"/></graph>
    <graph styleNumber="6"><collect from="$g" componentType="point" styleNumber="2" name="d"/></graph>
    `,
        });

        expect(
            await styleNumbersOf(core, resolvePathToNodeIdx, [
                "B",
                "gp",
                "X",
                "i[1]",
                "A",
                "c[1]",
                "c[2]",
                "c[3]",
                "c[4]",
                "c[5]",
                "d[1]",
                "d[5]",
            ]),
        ).eqls({
            B: 4,
            gp: 4,
            X: 4,
            "i[1]": 3,
            A: 5,
            "c[1]": 2,
            "c[2]": 2,
            "c[3]": 2,
            "c[4]": 2,
            "c[5]": 5,
            "d[1]": 2,
            "d[5]": 5,
        });
    });

    it("a sort or shuffle with a styleNumber fills in the style of each entry that sets none", async () => {
        // A `<sort>` or `<shuffle>` with a `styleNumber` is a composite, whose
        // replacements take its style where their source sets none. That
        // holds for the entries of a list it sorts or shuffles too.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl"><point styleNumber="3">(1,2)</point><point>(3,4)</point></pointList>
    <graph styleNumber="4">
      <sort name="s" sortVectorsBy="x" styleNumber="2"><point styleNumber="3">(5,2)</point><point>(3,4)</point></sort>
      <sort name="sl" sortVectorsBy="x" styleNumber="2">$pl</sort>
      <shuffle name="h" styleNumber="2"><point styleNumber="3">(5,2)</point><point>(3,4)</point></shuffle>
      <shuffle name="hl" styleNumber="2">$pl</shuffle>
    </graph>
    <graph>
      <point extend="$sl[1]" name="e1"/>
      <point extend="$sl[2]" name="e2"/>
    </graph>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["s", "sl", "h", "hl"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].componentType,
                name,
            ).eq(name[0] === "s" ? "sort" : "shuffle");
        }

        // The style of each entry, keyed by its x-coordinate, so that the
        // order a shuffle picks does not matter.
        async function styleByX(name: string) {
            const result: Record<number, number> = {};
            for (const ind of [1, 2]) {
                const stateValues =
                    stateVariables[
                        await resolvePathToNodeIdx(`${name}[${ind}]`)
                    ].stateValues;
                result[stateValues.xs[0].tree] = stateValues.styleNumber;
            }
            return result;
        }

        expect(await styleByX("s")).eqls({ 3: 2, 5: 3 });
        expect(await styleByX("h")).eqls({ 3: 2, 5: 3 });
        expect(await styleByX("sl")).eqls({ 1: 3, 3: 2 });
        expect(await styleByX("hl")).eqls({ 1: 3, 3: 2 });
        expect(
            await styleNumbersOf(core, resolvePathToNodeIdx, ["e1", "e2"]),
        ).eqls({ e1: 3, e2: 2 });
    });

    it("a list form takes a style it has from where it sits only for an entry whose source sets none", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `${styleDefinitions}
    <section name="s">
      <number styleNumber="3">4</number>
      <number>1</number>
    </section>
    <p name="pc" styleNumber="2"><collect componentType="number" from="$s" name="c"/></p>
    <p name="pcs"><collect componentType="number" from="$s" name="cs" styleNumber="2"/></p>
    <p name="ps" styleNumber="2"><sort name="srt"><number styleNumber="3">2</number><number>1</number></sort></p>
    <p name="pss"><sort styleNumber="2"><number styleNumber="3">2</number><number>1</number></sort></p>
    <p name="psh" styleNumber="2"><shuffle name="sh"><number styleNumber="3">2</number></shuffle></p>
    <p name="pref">$c[1] $c[2] $srt[1] $srt[2]</p>
    <p name="pext"><number extend="$c[1]" name="e1"/><number extend="$c[2]" name="e2"/></p>
    <p name="pprop">$c[1].styleNumber $c[2].styleNumber $c.styleNumber</p>
    <collect componentType="number" from="$s" name="d"/>
    <p name="pd" styleNumber="4"><number extend="$d[1]"/><number extend="$d[2]"/></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        // these are list forms, whose style comes from their `<p>`
        for (const [name, componentType] of [
            ["c", "_collectList"],
            ["srt", "_sortList"],
            ["sh", "_shuffleList"],
        ]) {
            const component = stateVariables[await resolvePathToNodeIdx(name)];
            expect(component.componentType, name).eq(componentType);
            expect(component.stateValues.styleNumber, name).eq(2);
        }

        const green4 = ["4", "green"];
        const red1 = ["1", "red"];
        expect(await drawnIn(core, resolvePathToNodeIdx, "pc")).eqls([
            green4,
            red1,
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pcs")).eqls([
            green4,
            red1,
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "ps")).eqls([
            red1,
            ["2", "green"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pss")).eqls([
            red1,
            ["2", "green"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "psh")).eqls([
            ["2", "green"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pref")).eqls([
            green4,
            red1,
            red1,
            ["2", "green"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pext")).eqls([
            green4,
            red1,
        ]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pprop")].stateValues
                .text,
        ).eq("3 2 3, 2");
        // an entry neither the list nor its source sets a style for takes
        // the style of where the component made from it is
        expect(await drawnIn(core, resolvePathToNodeIdx, "pd")).eqls([
            green4,
            ["1", "blue"],
        ]);
    });

    it("an authored list draws each entry in its own style, or the list's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `${styleDefinitions}
    <p name="pml"><mathList styleNumber="2" name="ml"><math styleNumber="3">x</math> y</mathList></p>
    <p name="pml0"><mathList name="ml0"><math styleNumber="3">x</math> y</mathList></p>
    <p name="pnl"><numberList styleNumber="$n" name="nl"><number styleNumber="3">5</number><number>6</number></numberList></p>
    <p name="pref">$ml[1] $ml[2] $nl[1] $nl[2]</p>
    <p name="pext"><math extend="$ml[1]" name="e1"/><math extend="$ml[2]" name="e2"/><math extend="$ml0[2]" name="e3"/></p>
    <p name="pprop">$ml[1].styleNumber $ml[2].styleNumber $ml.styleNumber</p>
    <mathInput name="n" prefill="2" />
    `,
        });

        expect(await drawnIn(core, resolvePathToNodeIdx, "pml")).eqls([
            ["x", "green"],
            ["y", "red"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pml0")).eqls([
            ["x", "green"],
            ["y", "black"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pnl")).eqls([
            ["5", "green"],
            ["6", "red"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pref")).eqls([
            ["x", "green"],
            ["y", "red"],
            ["5", "green"],
            ["6", "red"],
        ]);
        expect(await drawnIn(core, resolvePathToNodeIdx, "pext")).eqls([
            ["x", "green"],
            ["y", "red"],
            ["y", "black"],
        ]);
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pprop")].stateValues
                .text,
        ).eq("3 2 2");

        // the list's style follows a change, and still fills in only
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(await drawnIn(core, resolvePathToNodeIdx, "pnl")).eqls([
            ["5", "green"],
            ["6", "blue"],
        ]);
    });
});
