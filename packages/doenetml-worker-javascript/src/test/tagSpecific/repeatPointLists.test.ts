import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { setRepeatListsEnabled } from "../../utils/dast/repeatLists";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A repeat whose template is one `<point>` is a list of points
 * (`_repeatPointList`, Doenet/DoenetML#2163). Each document here is checked
 * against itself with the repeat left a composite (`setRepeatListsEnabled`):
 * what an author sees, and what a graph draws, must be the same.
 */
describe("Repeats whose template is one point @group4", () => {
    afterEach(() => setRepeatListsEnabled(true));

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

    /**
     * Load `doenetML` with and without repeat lists; check that the repeat
     * `repeatName` is a list of points only with them (or never, for one
     * that must stay a composite), then, after `act`, that the `text` of each
     * of `names` and the points each of `graphs` draws are the same.
     */
    async function compare({
        doenetML,
        names = [],
        graphs = [],
        repeatName = "r",
        becomesList = true,
        act,
    }: {
        doenetML: string;
        names?: string[];
        graphs?: string[];
        repeatName?: string;
        becomesList?: boolean;
        act?: (core: any, resolvePathToNodeIdx: any) => Promise<void>;
    }) {
        const results: any[] = [];
        for (const asList of [true, false]) {
            setRepeatListsEnabled(asList);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setRepeatListsEnabled(true);
            const type =
                core.core!._components[await resolvePathToNodeIdx(repeatName)]
                    .componentType;
            expect(type === "_repeatPointList", doenetML).toBe(
                asList && becomesList,
            );
            if (act) {
                await act(core, resolvePathToNodeIdx);
            }
            const result: any = await textsOf(
                core,
                resolvePathToNodeIdx,
                names,
            );
            for (const graph of graphs) {
                // `-0` and `0` are drawn the same
                result[graph] = (
                    await pointsDrawnIn(core, resolvePathToNodeIdx, graph)
                ).map((p) => p.coords.map((x: number) => (x === 0 ? 0 : x)));
            }
            results.push(result);
        }
        expect(results[0]).toEqual(results[1]);
        return results[0];
    }

    it("points of the index, a value and an entry of a list", async () => {
        const result = await compare({
            doenetML: `
<numberList name="l">10 20 30</numberList>
<number name="c">2</number>
<graph name="g"><repeatForSequence name="r" from="1" to="3" indexName="i"><point name="P">($i, $l[$i]/10 + $c)</point></repeatForSequence></graph>
<p name="p">$r</p>
<p name="p2">$r[2] $r[2].P $r[3].P.x $r.x</p>
<p name="p3"><sum>$r.y</sum></p>
`,
            names: ["p", "p2", "p3"],
            graphs: ["g"],
        });
        expect(result.p).toBe("(1, 3), (2, 4), (3, 5)");
        expect(result.g).toEqual([
            [1, 3],
            [2, 4],
            [3, 5],
        ]);
    });

    it("the dot plot's point: a nested fixed number and constraints", async () => {
        const result = await compare({
            doenetML: `
<numberList name="values">1.2 3.9 4.1</numberList>
<numberList name="heights">1 1 2</numberList>
<number name="dx">1</number>
<graph name="g" xMin="0" xMax="10" yMin="0" yMax="5">
  <repeatForSequence from="1" to="3" indexName="i" name="r">
    <point name="P" labelPosition="top">
      ($values[$i], <number fixed>0.5 $heights[$i]</number>)
      <constrainToGraph /> <constrainToGrid dx="$dx" dy="0.5" />
    </point>
  </repeatForSequence>
</graph>
<p name="pv">$values</p>
`,
            names: ["pv"],
            graphs: ["g"],
            act: async (core, resolvePathToNodeIdx) => {
                await dragPoint({
                    core,
                    resolvePathToNodeIdx,
                    graph: "g",
                    index: 1,
                    x: 6.2,
                    y: 3.3,
                });
            },
        });
        expect(result.pv).toBe("1.2, 6, 4.1");
        expect(result.g).toEqual([
            [1, 0.5],
            [6, 0.5],
            [4, 1],
        ]);
    });

    it("drags through a list entry, the index, a literal and a value outside", async () => {
        await compare({
            doenetML: `
<numberList name="ns">1 2 3</numberList>
<number name="c">5</number>
<graph name="g">
  <repeatForSequence from="1" to="3" indexName="i" name="r"><point>($ns[$i], 1)</point></repeatForSequence>
</graph>
<graph name="g2">
  <repeatForSequence from="1" to="3" indexName="i" name="r2"><point>($i, $c)</point></repeatForSequence>
</graph>
<p name="pns">$ns</p>
<p name="pc">$c</p>
`,
            names: ["pns", "pc"],
            graphs: ["g", "g2"],
            act: async (core, resolvePathToNodeIdx) => {
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
                    graph: "g2",
                    index: 1,
                    x: 7,
                    y: 8,
                });
            },
        });
    });

    it("a dragged literal is kept while the repeat is shorter", async () => {
        await compare({
            doenetML: `
<mathInput name="n" prefill="3" />
<graph name="g">
  <repeatForSequence from="1" to="$n" indexName="i" name="r"><point>($i, 1)</point></repeatForSequence>
</graph>
`,
            graphs: ["g"],
            act: async (core, resolvePathToNodeIdx) => {
                await dragPoint({
                    core,
                    resolvePathToNodeIdx,
                    graph: "g",
                    index: 2,
                    x: 3,
                    y: 4,
                });
                const n = await resolvePathToNodeIdx("n");
                await updateMathInputValue({
                    latex: "1",
                    componentIdx: n,
                    core,
                });
                await updateMathInputValue({
                    latex: "4",
                    componentIdx: n,
                    core,
                });
            },
        });
    });

    it("the template's attributes are the list's", async () => {
        const doenetML = `
<graph name="g">
  <repeatForSequence from="1" to="2" valueName="k" name="r">
    <point styleNumber="2" markerStyle="square" markerSize="4" showCoordsWhenDragging="false" labelPosition="left" draggable="false" layer="2">(cos($k), sin($k))</point>
  </repeatForSequence>
</graph>
`;
        const results: any[] = [];
        for (const asList of [true, false]) {
            setRepeatListsEnabled(asList);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setRepeatListsEnabled(true);
            const rendererState =
                core.core!.rendererInstructionBuilder.rendererState;
            const drawn = await pointsDrawnIn(core, resolvePathToNodeIdx, "g");
            results.push(
                drawn.map((p) => {
                    const sv = rendererState[p.componentIdx].stateValues;
                    return {
                        coords: p.coords,
                        markerStyle: sv.selectedStyle.markerStyle,
                        markerSize: sv.selectedStyle.markerSize,
                        lineColor: sv.selectedStyle.markerColor,
                        showCoordsWhenDragging: sv.showCoordsWhenDragging,
                        labelPosition: sv.labelPosition,
                        draggable: sv.draggable,
                        layer: sv.layer,
                    };
                }),
            );
        }
        expect(results[0]).toEqual(results[1]);
        expect(results[0][0]).toMatchObject({
            markerStyle: "square",
            markerSize: 4,
            showCoordsWhenDragging: false,
            labelPosition: "left",
            draggable: false,
            layer: 2,
        });
    });

    it("constrained to the points of the list", async () => {
        await compare({
            doenetML: `
<setup>
  <repeatForSequence name="r" from="1" to="4" valueName="k"><point>(cos($k pi/2), sin($k pi/2))</point></repeatForSequence>
</setup>
<graph name="g">
  $r
  <point name="P"><constrainTo>$r</constrainTo>(0.9, 0.2)</point>
</graph>
<p name="pP">$P</p>
`,
            names: ["pP"],
            graphs: ["g"],
        });
    });

    it("a coordinate the points do not have is nothing", async () => {
        const result = await compare({
            doenetML: `
<graph name="g"><repeatForSequence from="1" to="3" indexName="i" name="r"><point name="P">($i)</point></repeatForSequence></graph>
<graph name="g2"><repeatForSequence from="1" to="3" indexName="i" name="r2"><point name="Q">($i, 2)</point></repeatForSequence></graph>
<p name="px">$r.x</p>
<p name="py">$r.y</p><p name="py2">$r[2].P.y</p><p name="sy"><sum>$r.y</sum></p>
<p name="pz">$r2.z</p><p name="pz2">$r2[2].Q.z</p>
`,
            names: ["px", "py", "py2", "sy", "pz", "pz2"],
            graphs: ["g", "g2"],
        });
        expect(result).toMatchObject({
            px: "1, 2, 3",
            py: "",
            py2: "",
            pz: "",
            pz2: "",
        });
    });

    it("stays a composite where an entry cannot stand in for an iteration", async () => {
        for (const doenetML of [
            // a label
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><point>($v, 0)<label>$v</label></point></repeatForSequence></graph>`,
            // an attribute that reads the index
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><point styleNumber="$v">($v, 0)</point></repeatForSequence></graph>`,
            // a constraint that reads the index
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><point>($v, 0)<constrainToGrid dx="$v"/></point></repeatForSequence></graph>`,
            // coordinates as attributes
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><point x="$v" y="0" /></repeatForSequence></graph>`,
            // a sampler
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><point>($v, <selectFromSequence from="1" to="5"/>)</point></repeatForSequence></graph>`,
        ]) {
            await compare({ doenetML, becomesList: false });
        }
    });
});
