import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `<pointList>` and `<vectorList>` as list components (Doenet/DoenetML#2162):
 * one component holding its points or vectors, which a parent reads, and the
 * viewer draws, as one child per entry, and whose entries are dragged one by
 * one.
 */
describe("Point and vector lists as list components @group4", async () => {
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
     * What the graph `name` draws, in order: for each child its renderer
     * index, type, id and coordinates (a point's `numericalXs`, a vector's
     * `numericalEndpoints`).
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
                return {
                    componentIdx: child.componentIdx,
                    componentType: child.componentType,
                    id: child.id,
                    coords:
                        stateValues.numericalXs ??
                        stateValues.numericalEndpoints ??
                        stateValues.numericalVertices,
                };
            });
    }

    async function coordsDrawnIn(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
    ) {
        return (await drawnIn(core, resolvePathToNodeIdx, name)).map(
            (child: any) => child.coords,
        );
    }

    async function dragEntry({
        core,
        resolvePathToNodeIdx,
        graph,
        index,
        args,
        actionName = "movePoint",
    }: {
        core: any;
        resolvePathToNodeIdx: any;
        graph: string;
        index: number;
        args: Record<string, any>;
        actionName?: string;
    }) {
        const drawn = await drawnIn(core, resolvePathToNodeIdx, graph);
        await core.requestAction({
            componentIdx: drawn[index].componentIdx,
            actionName,
            args,
        });
    }

    it("each kind of parent reads the points", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl">(1,2) (3,4) (5,6)</pointList>
    <p name="ppl">$pl</p>
    <math name="mpl">$pl</math>
    <pointList name="pl2">$pl (7,8)</pointList>
    <p name="ppl2">$pl2</p>
    <p name="pentry">$pl[2] $pl[2].x $pl[3].y</p>
    <p name="pprops">$pl.x; $pl.xs; $pl.numPoints; $pl2.numPoints</p>
    <p name="pcoords">$pl[1].coords</p>
    <pointList name="same">(1,2) (3,4) (5,6)</pointList>
    <pointList name="shorter">(1,2) (3,4)</pointList>
    <boolean name="b">$pl = $same</boolean>
    <boolean name="b2">$pl = $shorter</boolean>
    <pointList name="plmax" maxNumber="2">(1,2) (3,4) (5,6)</pointList>
    <p name="pmax">$plmax</p>
    <p name="pdims">$pl[1].numDimensions</p>
    <graph name="g">
      <repeat for="$pl" valueName="v" name="r">
        <point>($v.x+10, $v.y)</point>
      </repeat>
    </graph>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "ppl",
                "mpl",
                "ppl2",
                "pentry",
                "pprops",
                "pcoords",
                "pmax",
                "pdims",
            ]),
        ).eqls({
            ppl: "(1, 2), (3, 4), (5, 6)",
            mpl: "(1, 2), (3, 4), (5, 6)",
            ppl2: "(1, 2), (3, 4), (5, 6), (7, 8)",
            pentry: "(3, 4) 3 6",
            pprops: "1, 3, 5; 1, 2, 3, 4, 5, 6; 3; 4",
            pcoords: "(1, 2)",
            pmax: "(1, 2), (3, 4)",
            pdims: "2",
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);

        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [11, 2],
            [13, 4],
            [15, 6],
        ]);
    });

    it("the points are drawn in a graph and dragged one by one", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4) (5,6)</pointList>
    </graph>
    <graph name="g2">$pl</graph>
    <graph name="g3"><pointList name="pl3" extend="$pl" /></graph>
    <graph name="g4">$pl[2]</graph>
    <p name="ppl">$pl</p>
    <p name="ppl3">$pl3</p>
    <p name="px">$pl[2].x</p>
    `,
        });

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((child: any) => child.componentType)).eqls([
            "point",
            "point",
            "point",
        ]);
        expect(drawn.map((child: any) => child.id)).eqls([
            "pl:1",
            "pl:2",
            "pl:3",
        ]);

        const names = ["ppl", "ppl3", "px"];

        async function check(points: number[][]) {
            const text = points.map(([x, y]) => `(${x}, ${y})`).join(", ");
            expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
                ppl: text,
                ppl3: text,
                px: String(points[1][0]),
            });
            for (const graph of ["g", "g2", "g3"]) {
                expect(
                    await coordsDrawnIn(core, resolvePathToNodeIdx, graph),
                ).eqls(points);
            }
            expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g4")).eqls([
                points[1],
            ]);
        }

        await check([
            [1, 2],
            [3, 4],
            [5, 6],
        ]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            args: { x: -1, y: -2 },
        });
        await check([
            [-1, -2],
            [3, 4],
            [5, 6],
        ]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g2",
            index: 2,
            args: { x: -5, y: -6 },
        });
        await check([
            [-1, -2],
            [3, 4],
            [-5, -6],
        ]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g3",
            index: 1,
            args: { x: 7, y: 8 },
        });
        await check([
            [-1, -2],
            [7, 8],
            [-5, -6],
        ]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g4",
            index: 0,
            args: { x: 9, y: 0 },
        });
        await check([
            [-1, -2],
            [9, 0],
            [-5, -6],
        ]);
    });

    it("authored points and references among the entries are dragged where they come from", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="P">(9,10)</point>
    <graph name="g">
      <pointList name="pl"><point name="A">(1,2)</point>(3,4) $P</pointList>
    </graph>
    <p name="ppl">$pl</p>
    <p name="pA">$A</p>
    <p name="pP">$P</p>
    `,
        });

        const names = ["ppl", "pA", "pP"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ppl: "(1, 2), (3, 4), (9, 10)",
            pA: "(1, 2)",
            pP: "(9, 10)",
        });

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            args: { x: -1, y: -2 },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            args: { x: -3, y: -4 },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 2,
            args: { x: -9, y: -10 },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ppl: "(-1, -2), (-3, -4), (-9, -10)",
            pA: "(-1, -2)",
            pP: "(-9, -10)",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [-1, -2],
            [-3, -4],
            [-9, -10],
        ]);
    });

    it("a fixed list refuses a drag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl" fixed>(1,2) (3,4)</pointList>
    </graph>
    <p name="ppl">$pl</p>
    `,
        });

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            args: { x: 7, y: 8 },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl"])).eqls({
            ppl: "(1, 2), (3, 4)",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [1, 2],
            [3, 4],
        ]);
    });

    it("a dragged point is kept through a reload", async () => {
        const doenetML = `
    <graph name="g">
      <pointList name="pl"><point name="A">(1,2)</point>(3,4) (5,6)</pointList>
    </graph>
    <p name="ppl">$pl</p>
    <mathInput name="mi" bindValueTo="$pl[3]" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            args: { x: -1, y: -2 },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            args: { x: -3, y: -4 },
        });
        await updateMathInputValue({
            latex: "(7,8)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        const written = { ppl: "(-1, -2), (-3, -4), (7, 8)" };
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl"])).eqls(
            written,
        );

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, [
                "ppl",
            ]),
        ).eqls(written);
        expect(
            await coordsDrawnIn(
                reloaded.core,
                reloaded.resolvePathToNodeIdx,
                "g",
            ),
        ).eqls([
            [-1, -2],
            [-3, -4],
            [7, 8],
        ]);
    });

    it("a point list in two and three dimensions", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl">(1,2,3) (4,5,6)</pointList>
    <pointList name="mixed">(1,2) (3,4,5)</pointList>
    <p name="ppl">$pl</p>
    <p name="pz">$pl[2].z $pl.z</p>
    <p name="pdims">$pl.numDimensions</p>
    <p name="pmixed2">$mixed[2]</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "ppl",
                "pz",
                "pdims",
                "pmixed2",
            ]),
        ).eqls({
            ppl: "(1, 2, 3), (4, 5, 6)",
            pz: "6 3, 6",
            pdims: "3, 3",
            pmixed2: "(3, 4, 5)",
        });
    });

    it("polygon vertices and constrainTo targets given as a point list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) (3,4) (5,6)</pointList>
      <polygon name="pg" vertices="$pl" />
      <polygon name="pg2" vertices="(0,0) (1,0) (0,1)" />
      <point name="Q">(3.2,4.1)<constrainTo>$pl</constrainTo></point>
    </graph>
    <p name="ppl">$pl</p>
    <p name="ppg">$pg.vertices</p>
    <p name="ppg2">$pg2.vertices</p>
    <p name="pQ">$Q</p>
    `,
        });

        const names = ["ppl", "ppg", "ppg2", "pQ"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ppl: "(1, 2), (3, 4), (5, 6)",
            ppg: "(1, 2), (3, 4), (5, 6)",
            ppg2: "(0, 0), (1, 0), (0, 1)",
            pQ: "(3, 4)",
        });

        // drag a vertex of each polygon
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pg"),
            actionName: "movePolygon",
            args: { pointCoords: { 1: [7, 8] } },
        });
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("pg2"),
            actionName: "movePolygon",
            args: { pointCoords: { 2: [0, 2] } },
        });
        // move the constrained point near the moved vertex
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("Q"),
            actionName: "movePoint",
            args: { x: 6.8, y: 8.3 },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ppl: "(1, 2), (7, 8), (5, 6)",
            ppg: "(1, 2), (7, 8), (5, 6)",
            ppg2: "(0, 0), (1, 0), (0, 2)",
            pQ: "(7, 8)",
        });
    });

    it("the vectors are drawn in a graph and dragged one by one", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList name="vl">(1,2) (3,4)</vectorList>
    </graph>
    <graph name="g2">$vl</graph>
    <p name="pvl">$vl</p>
    <p name="pheads">$vl.head</p>
    <p name="ptails">$vl.tail</p>
    <p name="pentry">$vl[2] $vl[2].x $vl[1].head</p>
    `,
        });

        const names = ["pvl", "pheads", "ptails", "pentry"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pvl: "(1, 2), (3, 4)",
            pheads: "(1, 2), (3, 4)",
            ptails: "(0, 0), (0, 0)",
            pentry: "(3, 4) 3 (1, 2)",
        });
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((child: any) => [child.componentType, child.id])).eqls(
            [
                ["vector", "vl:1"],
                ["vector", "vl:2"],
            ],
        );
        expect(drawn.map((child: any) => child.coords)).eqls([
            [
                [0, 0],
                [1, 2],
            ],
            [
                [0, 0],
                [3, 4],
            ],
        ]);

        // the head of the first
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            actionName: "moveVector",
            args: { headcoords: [7, 7] },
        });
        // the whole of the second, from another graph
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g2",
            index: 1,
            actionName: "moveVector",
            args: { tailcoords: [1, 1], headcoords: [3, 2] },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pvl: "(7, 7), (2, 1)",
            pheads: "(7, 7), (3, 2)",
            ptails: "(0, 0), (1, 1)",
            pentry: "(2, 1) 2 (7, 7)",
        });
        for (const graph of ["g", "g2"]) {
            expect(await coordsDrawnIn(core, resolvePathToNodeIdx, graph)).eqls(
                [
                    [
                        [0, 0],
                        [7, 7],
                    ],
                    [
                        [1, 1],
                        [3, 2],
                    ],
                ],
            );
        }
    });
});
