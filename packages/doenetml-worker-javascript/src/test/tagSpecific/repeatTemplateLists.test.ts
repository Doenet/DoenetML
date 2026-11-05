import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * What a repeat whose template is one value does, read only through what an
 * author sees: the text of references, and what a graph draws. These pin the
 * behaviour that F6 (Doenet/DoenetML#2163) must keep when such a repeat
 * becomes a list component, so they read nothing that depends on whether the
 * iterations are components or entries.
 */
describe("Repeat templates that are one value @group3", async () => {
    async function textsOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const name of names) {
            texts[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return texts;
    }

    /**
     * The points the graph `name` draws, in order, found through any
     * composites or groups between the graph and the point: for each its
     * renderer index and coordinates.
     */
    async function pointsDrawnIn(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
    ) {
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        const points: { componentIdx: number; coords: number[] }[] = [];
        function visit(instructions: any[]) {
            for (const child of instructions) {
                if (typeof child !== "object" || !child) {
                    continue;
                }
                const state = rendererState[child.componentIdx];
                if (child.componentType === "point") {
                    if (!state.stateValues.hidden) {
                        points.push({
                            componentIdx: child.componentIdx,
                            coords: state.stateValues.numericalXs,
                        });
                    }
                } else if (state?.childrenInstructions) {
                    visit(state.childrenInstructions);
                }
            }
        }
        visit(
            rendererState[await resolvePathToNodeIdx(name)]
                .childrenInstructions,
        );
        return points;
    }

    async function dragPoint({
        core,
        resolvePathToNodeIdx,
        graph,
        index,
        x,
        y,
    }: {
        core: any;
        resolvePathToNodeIdx: any;
        graph: string;
        index: number;
        x: number;
        y: number;
    }) {
        const drawn = await pointsDrawnIn(core, resolvePathToNodeIdx, graph);
        await core.requestAction({
            componentIdx: drawn[index].componentIdx,
            actionName: "movePoint",
            args: { x, y },
        });
    }

    it("each type of template, and references to it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="l">10 20 30</numberList>
    <number name="c">2</number>
    <repeatForSequence from="1" to="3" indexName="i" name="rn">
      <number name="n">$c $l[$i] + $i</number>
    </repeatForSequence>
    <repeatForSequence from="1" to="3" valueName="v" name="rm">
      <math simplify name="m">$v x^2 + $c</math>
    </repeatForSequence>
    <repeatForSequence type="letters" from="a" to="c" valueName="v" indexName="i" name="rt">
      <text name="t">$v$i</text>
    </repeatForSequence>
    <repeatForSequence from="1" to="3" valueName="v" name="rb">
      <boolean name="b">$v > $c</boolean>
    </repeatForSequence>
    <repeatForSequence from="1" to="3" indexName="i" name="rp">
      <point name="P">($i, $l[$i]/10)</point>
    </repeatForSequence>

    <p name="pn">$rn</p>
    <p name="pm">$rm</p>
    <p name="pt">$rt</p>
    <p name="pb">$rb</p>
    <p name="pp">$rp</p>
    <p name="pnamed">$rn[2].n $rm[2].m $rt[2].t $rb[2].b $rp[2].P</p>
    <p name="pindexed">$rn[2] $rm[2] $rt[2] $rb[2] $rp[2]</p>
    <p name="pprop">$rp[2].P.x $rp[3].y</p>
    <p name="pacross">$rp.x</p>
    <p name="nacross"><sum>$rp.y</sum></p>
    <repeatForSequence from="1" to="3" indexName="j" name="rref">
      <math name="m">$rm[$j] + $rp[$j].P.y</math>
    </repeatForSequence>
    <p name="pref">$rref</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pn",
                "pm",
                "pt",
                "pb",
                "pp",
                "pnamed",
                "pindexed",
                "pprop",
                "pacross",
                "nacross",
                "pref",
            ]),
        ).eqls({
            pn: "21, 42, 63",
            pm: "x² + 2, 2 x² + 2, 3 x² + 2",
            pt: "a1, b2, c3",
            pb: "false, false, true",
            pp: "(1, 1), (2, 2), (3, 3)",
            pnamed: "42 2 x² + 2 b2 false (2, 2)",
            pindexed: "42 2 x² + 2 b2 false (2, 2)",
            pprop: "2 3",
            pacross: "1, 2, 3",
            nacross: "6",
            pref: "x² + 2 + 1, 2 x² + 2 + 2, 3 x² + 2 + 3",
        });
    });

    it("a point with a nested number and constraints, as in the dot plots", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="values">1.2 3.9 4.1</numberList>
    <numberList name="heights">1 1 2</numberList>
    <number name="dx">1</number>
    <graph name="g" xMin="0" xMax="10" yMin="0" yMax="5">
      <repeatForSequence from="1" to="3" indexName="i" name="Ps">
        <point name="P" labelPosition="top">
          ($values[$i], <number fixed>0.5 $heights[$i]</number>)
          <constrainToGraph /> <constrainToGrid dx="$dx" dy="0.5" />
        </point>
      </repeatForSequence>
    </graph>
    <p name="pxs">$Ps.x</p>
    `,
        });

        expect(
            (await pointsDrawnIn(core, resolvePathToNodeIdx, "g")).map(
                (p) => p.coords,
            ),
        ).eqls([
            [1, 0.5],
            [4, 0.5],
            [4, 1],
        ]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["pxs"])).eqls({
            pxs: "1, 4, 4",
        });
    });

    it("a drag writes through the template: an entry of a list, a fixed index and a literal", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="ns">1 2 3</numberList>
    <graph name="g">
      <repeatForSequence from="1" to="3" indexName="i" name="Ps">
        <point>($ns[$i], 1)</point>
      </repeatForSequence>
    </graph>
    <graph name="g2">
      <repeatForSequence from="1" to="3" indexName="i" name="Qs">
        <point>($i, $ns[$i])</point>
      </repeatForSequence>
    </graph>
    <p name="pns">$ns</p>
    <p name="pPs">$Ps</p>
    <p name="pQs">$Qs</p>
    `,
        });

        // x is entry 2 of ns, y the literal 1 of that iteration alone
        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            x: 5,
            y: 7,
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pns", "pPs", "pQs"]),
        ).eqls({
            pns: "1, 5, 3",
            pPs: "(1, 1), (5, 7), (3, 1)",
            pQs: "(1, 1), (2, 5), (3, 3)",
        });

        // x is the index, which is fixed: the drag moves y only
        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g2",
            index: 2,
            x: 9,
            y: 8,
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pns", "pPs", "pQs"]),
        ).eqls({
            pns: "1, 5, 8",
            pPs: "(1, 1), (5, 7), (8, 1)",
            pQs: "(1, 1), (2, 5), (3, 8)",
        });
    });

    it("a drag that writes a value outside the template moves every entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="c">1</number>
    <graph name="g">
      <repeatForSequence from="1" to="3" indexName="i" name="Ps">
        <point>($i, $c)</point>
      </repeatForSequence>
    </graph>
    <p name="pc">$c</p>
    <p name="pPs">$Ps</p>
    `,
        });

        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            x: 2,
            y: 3,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pc", "pPs"])).eqls({
            pc: "3",
            pPs: "(1, 3), (2, 3), (3, 3)",
        });
    });

    it("random components after the repeat draw the same values whatever its template", async () => {
        function doenetML(template: string) {
            return `
    <selectRandomNumbers name="before" numToSelect="3" from="1" to="1000" />
    <repeatForSequence from="1" to="4" indexName="i" name="r">
      ${template}
    </repeatForSequence>
    <selectRandomNumbers name="after" numToSelect="3" from="1" to="1000" />
    <p name="pbefore">$before</p>
    <p name="pafter">$after</p>
    `;
        }
        for (const requestedVariantIndex of [1, 2, 3]) {
            const texts = [];
            for (const template of [
                `<number>$i^2</number>`,
                `<point>($i, 2$i)</point>`,
                `<p>$i</p>`,
            ]) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: doenetML(template),
                    requestedVariantIndex,
                });
                texts.push(
                    await textsOf(core, resolvePathToNodeIdx, [
                        "pbefore",
                        "pafter",
                    ]),
                );
            }
            expect(texts[0]).eqls(texts[2]);
            expect(texts[1]).eqls(texts[2]);
        }
    });

    it("drags are kept through a reload", async () => {
        const doenetML = `
    <numberList name="ns">1 2 3</numberList>
    <graph name="g">
      <repeatForSequence from="1" to="3" indexName="i" name="Ps">
        <point>($ns[$i], 1)</point>
      </repeatForSequence>
    </graph>
    <p name="pns">$ns</p>
    <p name="pPs">$Ps</p>
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            x: -1,
            y: -2,
        });
        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            x: 6,
            y: 4,
        });
        const written = {
            pns: "-1, 2, 6",
            pPs: "(-1, -2), (2, 1), (6, 4)",
        };
        expect(await textsOf(core, resolvePathToNodeIdx, ["pns", "pPs"])).eqls(
            written,
        );

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, [
                "pns",
                "pPs",
            ]),
        ).eqls(written);
    });

    it("a repeat that shrinks and grows again keeps what was dragged", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="3" />
    <graph name="g">
      <repeatForSequence from="1" to="$n" indexName="i" name="Ps">
        <point>($i, 1)</point>
      </repeatForSequence>
    </graph>
    <p name="pPs">$Ps</p>
    <p name="pys">$Ps.y</p>
    `,
        });

        await dragPoint({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            x: 3,
            y: 5,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pPs"])).eqls({
            pPs: "(1, 1), (2, 1), (3, 5)",
        });

        const n = await resolvePathToNodeIdx("n");
        await updateMathInputValue({ latex: "2", componentIdx: n, core });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pPs", "pys"])).eqls({
            pPs: "(1, 1), (2, 1)",
            pys: "1, 1",
        });
        expect(
            await pointsDrawnIn(core, resolvePathToNodeIdx, "g"),
        ).toHaveLength(2);

        await updateMathInputValue({ latex: "4", componentIdx: n, core });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pPs", "pys"])).eqls({
            pPs: "(1, 1), (2, 1), (3, 5), (4, 1)",
            pys: "1, 1, 5, 1",
        });
    });
});
