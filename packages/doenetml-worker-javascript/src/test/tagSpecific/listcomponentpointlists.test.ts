import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";

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

    it("a list with fixLocation refuses a move of its entries", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl" fixLocation>(1,2) (3,4) (5,0)</pointList>
      <vectorList name="vl" fixLocation>(1,2)</vectorList>
      <polygon name="poly" vertices="$pl" />
    </graph>
    <p name="ppl">$pl</p>
    <p name="pvl">$vl; $vl.tail</p>
    `,
        });

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            args: { x: 7, y: 8 },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 3,
            actionName: "moveVector",
            args: { headcoords: [7, 8] },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 3,
            actionName: "moveVector",
            args: { tailcoords: [1, 1] },
        });
        // as a polygon whose vertices are points with fixLocation
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("poly"),
            actionName: "movePolygon",
            args: { pointCoords: { 0: [11, 12], 1: [13, 14], 2: [15, 10] } },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl", "pvl"])).eqls({
            ppl: "(1, 2), (3, 4), (5, 0)",
            pvl: "(1, 2); (0, 0)",
        });
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

    it("an entry from text is drawn with no component; an authored point with its label and style", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">(1,2) <point name="A" styleNumber="2"><label>A</label>(3,4)</point> (5,6)</pointList>
    </graph>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(drawn.map((child: any) => child.id)).eqls([
            "pl:1",
            "pl:2",
            "pl:3",
        ]);
        const states = drawn.map(
            (child: any) => rendererState[child.componentIdx].stateValues,
        );
        expect(states.map((state: any) => state.labelForGraph)).eqls([
            "",
            "A",
            "",
        ]);
        const stateVariables = await core.returnAllStateVariables(false, true);
        const A = stateVariables[await resolvePathToNodeIdx("A")];
        expect(states[1].selectedStyle).eqls(A.stateValues.selectedStyle);
        expect(states[0].selectedStyle.markerColorWord).not.eq(
            A.stateValues.selectedStyle.markerColorWord,
        );

        // the authored point is the only point component
        const types = Object.values(stateVariables).map(
            (c: any) => c.componentType,
        );
        expect(types.filter((t) => t === "point")).toHaveLength(1);
    });

    it("points share the largest number of dimensions, with 0 for a missing coordinate", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="P">(7,8)</point>
    <pointList name="pl">(1,2) (3,4,5) $P</pointList>
    <p name="ppl">$pl</p>
    <p name="pz">$pl.z</p>
    <p name="pdims">$pl.numDimensions</p>
    <p name="p1">$pl[1]</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "ppl",
                "pz",
                "pdims",
                "p1",
            ]),
        ).eqls({
            ppl: "(1, 2, 0), (3, 4, 5), (7, 8, 0)",
            pz: "0, 5, 0",
            pdims: "3, 3, 3",
            p1: "(1, 2, 0)",
        });
    });

    it("a constraint among the children constrains every entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl">
        <constrainToGrid dx="2" />
        (1.2,3.7) <point name="A">(4.6,2.1)</point>
      </pointList>
    </graph>
    <p name="ppl">$pl</p>
    <p name="pA">$A</p>
    <p name="pcount">$pl.numPoints</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, ["ppl", "pA", "pcount"]),
        ).eqls({
            // the list's entries are constrained; the authored point keeps
            // its own coordinates until the list writes its entry
            ppl: "(2, 4), (4, 2)",
            pA: "(4.6, 2.1)",
            pcount: "2",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [2, 4],
            [4, 2],
        ]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            args: { x: -3.2, y: 1.4 },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            args: { x: 6.9, y: -0.6 },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl", "pA"])).eqls({
            ppl: "(-4, 1), (6, -1)",
            pA: "(6, -1)",
        });
    });

    it("an authored point that is not draggable, or hidden, is drawn so", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><point draggable="false">(1,2)</point> <point hide>(3,4)</point> (5,6)</pointList>
    </graph>
    <graph name="g2">$pl</graph>
    <p name="ppl">$pl</p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        // a reference to the list is not hidden by an entry's own `hide`,
        // as it is not by the list's
        const drawnByReference = await drawnIn(
            core,
            resolvePathToNodeIdx,
            "g2",
        );
        expect(
            drawnByReference.map(
                (child: any) =>
                    rendererState[child.componentIdx].stateValues.hidden,
            ),
        ).eqls([false, false, false]);
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(
            drawn.map(
                (child: any) =>
                    rendererState[child.componentIdx].stateValues.draggable,
            ),
        ).eqls([false, true, true]);
        expect(
            drawn.map(
                (child: any) =>
                    rendererState[child.componentIdx].stateValues.hidden,
            ),
        ).eqls([false, true, false]);

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            args: { x: -1, y: -2 },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl"])).eqls({
            ppl: "(1, 2), (3, 4), (5, 6)",
        });
    });

    it("an entry read by itself takes its authored point's or vector's label, fixed and draggable", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl"><point><label>P</label>(5,6)</point> <point fixed>(1,2)</point> <point draggable="false">(3,4)</point> (7,8)</pointList>
    <vectorList name="vl"><vector headDraggable="false"><label>u</label>(1,2)</vector> <vector tailDraggable="false">(3,4)</vector> (5,6)</vectorList>
    <graph name="g">$pl[1] $pl[2] $pl[3] $pl[4] <point extend="$pl[1]" /></graph>
    <graph name="gv">$vl[1] $vl[2] $vl[3]</graph>
    <p name="ppl">$pl</p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const drawnState = async (graph: string, names: string[]) =>
            (await drawnIn(core, resolvePathToNodeIdx, graph)).map(
                (child: any) =>
                    Object.fromEntries(
                        names.map((name) => [
                            name,
                            rendererState[child.componentIdx].stateValues[name],
                        ]),
                    ),
            );
        expect(await drawnState("g", ["label", "fixed", "draggable"])).eqls([
            { label: "P", fixed: false, draggable: true },
            { label: "", fixed: true, draggable: true },
            { label: "", fixed: false, draggable: false },
            { label: "", fixed: false, draggable: true },
            { label: "P", fixed: false, draggable: true },
        ]);
        expect(
            await drawnState("gv", [
                "label",
                "draggable",
                "headDraggable",
                "tailDraggable",
            ]),
        ).eqls([
            {
                label: "u",
                draggable: true,
                headDraggable: false,
                tailDraggable: true,
            },
            {
                label: "",
                draggable: true,
                headDraggable: true,
                tailDraggable: false,
            },
            {
                label: "",
                draggable: true,
                headDraggable: true,
                tailDraggable: true,
            },
        ]);

        // the fixed and undraggable entries stay; the others move
        for (const [index, x] of [
            [0, -1],
            [1, -2],
            [2, -3],
            [3, -4],
        ]) {
            await dragEntry({
                core,
                resolvePathToNodeIdx,
                graph: "g",
                index,
                args: { x, y: 0 },
            });
        }
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl"])).eqls({
            ppl: "(-1, 0), (1, 2), (3, 4), (-4, 0)",
        });
    });

    it("an entry of a fixed list read by itself is fixed", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl" fixed><point draggable="false">(1,2)</point> (3,4)</pointList>
    <vectorList name="vl" fixed>(1,2)</vectorList>
    <graph>
      <point name="P1" extend="$pl[1]" />
      <point name="P2" extend="$pl[2]" />
      <vector name="V1" extend="$vl[1]" />
    </graph>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (const name of ["P1", "P2", "V1"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .fixed,
                name,
            ).eq(true);
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("P1")].stateValues
                .draggable,
        ).eq(false);
    });

    it("a vector made from an entry with draggable given has its head and tail follow it, unless its source sets them", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vl">(1,2) <vector headDraggable="false">(3,4)</vector></vectorList>
    <graph>
      <vector name="V1" extend="$vl[1]" draggable="false" />
      <vector name="V2" extend="$vl[2]" />
      <vector name="V3" extend="$vl[2]" draggable="false" tailDraggable="true" />
    </graph>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const drag = async (name: string) => {
            const { draggable, headDraggable, tailDraggable } =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return { draggable, headDraggable, tailDraggable };
        };
        expect(await drag("V1")).eqls({
            draggable: false,
            headDraggable: false,
            tailDraggable: false,
        });
        expect(await drag("V2")).eqls({
            draggable: true,
            headDraggable: false,
            tailDraggable: true,
        });
        expect(await drag("V3")).eqls({
            draggable: false,
            headDraggable: false,
            tailDraggable: true,
        });
    });

    it("a copy of a vector made from an entry keeps its source's draggable head and tail", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vl"><vector headDraggable="false">(1,2)</vector> <vector draggable="false" headDraggable>(3,4)</vector></vectorList>
    <graph>
      <vector name="E1" extend="$vl[1]" />
      <vector name="C1" extend="$E1" />
      <vector name="E2" extend="$vl[2]" />
      <vector name="C2" extend="$E2" />
    </graph>
    <p name="p">$vl</p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const drag = async (name: string) => {
            const { draggable, headDraggable, tailDraggable } =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return { draggable, headDraggable, tailDraggable };
        };
        for (const name of ["E1", "C1"]) {
            expect(await drag(name), name).eqls({
                draggable: true,
                headDraggable: false,
                tailDraggable: true,
            });
        }
        for (const name of ["E2", "C2"]) {
            expect(await drag(name), name).eqls({
                draggable: false,
                headDraggable: true,
                tailDraggable: false,
            });
        }

        // a head drag through the copy is refused, as at the source
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("C1"),
            actionName: "moveVector",
            args: { headcoords: [7, 7] },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["p"])).eqls({
            p: "(1, 2), (3, 4)",
        });
    });

    it("a copy of a point made from an entry is labeled as that point is", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl"><point><label>A</label>(1,2)</point> <point><label>B</label>(3,4)</point></pointList>
    <graph>
      <point name="X" extend="$pl[2]" />
      <point name="X2" extend="$pl[2]" labelIsName />
      <point name="X3" extend="$pl[1]"><label>own</label></point>
    </graph>
    <graph>
      <point name="Y" extend="$X" />
      <point name="Y2" extend="$X2" />
      <point name="Y3" extend="$X3" />
    </graph>
    <textInput name="ti" bindValueTo="$X.label" />
    `,
        });

        async function labels() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: Record<string, string> = {};
            for (const name of ["X", "X2", "X3", "Y", "Y2", "Y3"]) {
                result[name] =
                    stateVariables[
                        await resolvePathToNodeIdx(name)
                    ].stateValues.label;
            }
            return result;
        }

        expect(await labels()).eqls({
            X: "B",
            X2: "X2",
            X3: "own",
            Y: "B",
            Y2: "X2",
            Y3: "own",
        });

        await updateTextInputValue({
            text: "new",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        expect(await labels()).eqls({
            X: "new",
            X2: "X2",
            X3: "own",
            Y: "new",
            Y2: "X2",
            Y3: "own",
        });
    });

    it("a copy= of an entry is at the entry's value with its source's label, and is independent of the list", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="gl"><pointList name="pl"><point><label>\\(x^2\\)</label>(1,2)</point> <point><label>P</label>(5,6)</point> (3,4)</pointList></graph>
    <vectorList name="vl"><vector tail="(1,1)" headDraggable="false"><label>u</label>(2,3)</vector> (3,4)</vectorList>
    <graph>
      <point name="A" copy="$pl[1]" />
      <point name="B" copy="$pl[2]" />
      <point name="C" copy="$pl[3]" />
      <vector name="U" copy="$vl[1]" />
      <vector name="W" copy="$vl[2]" />
    </graph>
    <p name="ppl">$pl</p>
    <p name="pvl">$vl</p>
    <p name="pcopies">$A $B $C | $U.tail $U.head | $W.tail $W.head</p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const labelsAndDrags = async (name: string) => {
            const { label, labelHasLatex, headDraggable, tailDraggable } =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return { label, labelHasLatex, headDraggable, tailDraggable };
        };
        expect(await labelsAndDrags("A")).eqls({
            label: "\\(x^2\\)",
            labelHasLatex: true,
            headDraggable: undefined,
            tailDraggable: undefined,
        });
        expect((await labelsAndDrags("B")).label).eq("P");
        expect((await labelsAndDrags("C")).label).eq("");
        expect(await labelsAndDrags("U")).eqls({
            label: "u",
            labelHasLatex: false,
            headDraggable: false,
            tailDraggable: true,
        });
        expect(await labelsAndDrags("W")).eqls({
            label: "",
            labelHasLatex: false,
            headDraggable: true,
            tailDraggable: true,
        });

        const before = {
            ppl: "(1, 2), (5, 6), (3, 4)",
            pvl: "(2, 3), (3, 4)",
        };
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "ppl",
                "pvl",
                "pcopies",
            ]),
        ).eqls({
            ...before,
            pcopies: "(1, 2) (5, 6) (3, 4) | (1, 1) (3, 4) | (0, 0) (3, 4)",
        });

        // a copy moves without the list, and the list without the copy
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("A"),
            actionName: "movePoint",
            args: { x: -1, y: -2 },
        });
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("W"),
            actionName: "moveVector",
            args: { tailcoords: [1, 0], headcoords: [2, 0] },
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "ppl",
                "pvl",
                "pcopies",
            ]),
        ).eqls({
            ...before,
            pcopies: "(-1, -2) (5, 6) (3, 4) | (1, 1) (3, 4) | (1, 0) (2, 0)",
        });

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "gl",
            index: 1,
            args: { x: 7, y: 7 },
        });
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["ppl", "pcopies"]),
        ).eqls({
            ppl: "(1, 2), (7, 7), (3, 4)",
            pcopies: "(-1, -2) (5, 6) (3, 4) | (1, 1) (3, 4) | (1, 0) (2, 0)",
        });
    });

    it("a moved copy= of an entry is restored where it was moved", async () => {
        const doenetML = `
    <pointList name="pl"><point><label>P</label>(1,2)</point> (3,4)</pointList>
    <vectorList name="vl"><vector tail="(1,1)"><label>u</label>(2,3)</vector></vectorList>
    <graph>
      <point name="A" copy="$pl[1]" />
      <vector name="U" copy="$vl[1]" />
    </graph>
    <p name="pcopies">$A $A.label | $U.tail $U.head $U.label</p>
    `;
        const first = await createTestCore({ doenetML });
        await first.core.requestAction({
            componentIdx: await first.resolvePathToNodeIdx("A"),
            actionName: "movePoint",
            args: { x: -3, y: -4 },
        });
        await first.core.requestAction({
            componentIdx: await first.resolvePathToNodeIdx("U"),
            actionName: "moveVector",
            args: { tailcoords: [4, 5], headcoords: [6, 6] },
        });
        const moved = { pcopies: "(-3, -4) P | (4, 5) (6, 6) u" };
        expect(
            await textsOf(first.core, first.resolvePathToNodeIdx, ["pcopies"]),
        ).eqls(moved);

        await first.core.saveImmediately();
        const second = await createTestCore({
            doenetML,
            initialState: first.scoreState.state as string,
        });
        expect(
            await textsOf(second.core, second.resolvePathToNodeIdx, [
                "pcopies",
            ]),
        ).eqls(moved);
    });

    it("a click on an entry from an authored point is a click on the point", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><point name="A">(1,2)</point> (3,4)</pointList>
    </graph>
    <number name="n">0</number>
    <updateValue target="$n" newValue="$n+1" triggerWhenObjectsClicked="$A" />
    `,
        });

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        for (const child of drawn) {
            await core.requestAction({
                componentIdx: child.componentIdx,
                actionName: "pointClicked",
                args: { componentIdx: child.componentIdx },
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n")].stateValues.value,
        ).eq(1);
    });

    it("a vector in three dimensions dragged in a graph keeps its third coordinates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList name="vl">(1,2,3) (4,5,6)</vectorList>
    </graph>
    <p name="pvl">$vl; $vl.tail; $vl.head</p>
    `,
        });

        // the tail of the first: its head stays
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            actionName: "moveVector",
            args: { tailcoords: [1, 1] },
        });
        // the head of the second: its tail stays
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "moveVector",
            args: { headcoords: [7, 8] },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pvl"])).eqls({
            pvl: "(0, 1, 3), (7, 8, 6); (1, 1, 0), (0, 0, 0); (1, 2, 3), (7, 8, 6)",
        });

        // the whole of the first
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            actionName: "moveVector",
            args: { tailcoords: [2, 2], headcoords: [2, 3] },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["pvl"])).eqls({
            pvl: "(0, 1, 3), (7, 8, 6); (2, 2, 0), (0, 0, 0); (2, 3, 3), (7, 8, 6)",
        });
    });

    it("an authored vector keeps its tail, and is dragged as itself", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList name="vl">(1,2) <vector name="v" tail="(1,1)" head="(4,5)" /></vectorList>
    </graph>
    <p name="pvl">$vl</p>
    <p name="ptails">$vl.tail</p>
    <p name="pv">$v.tail $v.head</p>
    `,
        });

        const names = ["pvl", "ptails", "pv"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pvl: "(1, 2), (3, 4)",
            ptails: "(0, 0), (1, 1)",
            pv: "(1, 1) (4, 5)",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [
                [0, 0],
                [1, 2],
            ],
            [
                [1, 1],
                [4, 5],
            ],
        ]);

        // the tail of each
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 0,
            actionName: "moveVector",
            args: { tailcoords: [-1, -1] },
        });
        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "moveVector",
            args: { tailcoords: [2, 3] },
        });
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            pvl: "(2, 3), (2, 2)",
            ptails: "(-1, -1), (2, 3)",
            pv: "(2, 3) (4, 5)",
        });
    });

    it("a dragged vector keeps its tail through a reload", async () => {
        const doenetML = `
    <graph name="g">
      <vectorList name="vl">(1,2) (3,4)</vectorList>
    </graph>
    <p name="pvl">$vl</p>
    <p name="ptails">$vl.tail</p>
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );

        await dragEntry({
            core,
            resolvePathToNodeIdx,
            graph: "g",
            index: 1,
            actionName: "moveVector",
            args: { tailcoords: [1, 1], headcoords: [5, 3] },
        });
        const written = { pvl: "(1, 2), (4, 2)", ptails: "(0, 0), (1, 1)" };
        expect(
            await textsOf(core, resolvePathToNodeIdx, ["pvl", "ptails"]),
        ).eqls(written);

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, [
                "pvl",
                "ptails",
            ]),
        ).eqls(written);
    });

    it("a copy of a vector entry has its tail, and a drag of the copy moves the entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vector name="v" tail="(2,1)" head="(3,3)" />
    <graph name="g">
      <vectorList name="vl">(1,2) <vector tail="(1,1)" head="(3,3)" /> $v</vectorList>
    </graph>
    <graph name="g2">
      <vector name="w1" extend="$vl[1]" />
      <vector name="w2" extend="$vl[2]" />
      $vl[3]
    </graph>
    <p name="ptails">$vl.tail</p>
    <p name="pheads">$vl.head</p>
    <p name="pv">$v.tail $v.head</p>
    `,
        });

        const names = ["ptails", "pheads", "pv"];
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ptails: "(0, 0), (1, 1), (2, 1)",
            pheads: "(1, 2), (3, 3), (3, 3)",
            pv: "(2, 1) (3, 3)",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g2")).eqls([
            [
                [0, 0],
                [1, 2],
            ],
            [
                [1, 1],
                [3, 3],
            ],
            [
                [2, 1],
                [3, 3],
            ],
        ]);

        // move each copy as a whole
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g2");
        for (const [ind, child] of drawn.entries()) {
            await core.requestAction({
                componentIdx: child.componentIdx,
                actionName: "moveVector",
                args: {
                    tailcoords: [ind, -1],
                    headcoords: [ind + 1, -2],
                },
            });
        }
        expect(await textsOf(core, resolvePathToNodeIdx, names)).eqls({
            ptails: "(0, -1), (1, -1), (2, -1)",
            pheads: "(1, -2), (2, -2), (3, -2)",
            pv: "(2, -1) (3, -2)",
        });
        expect(await coordsDrawnIn(core, resolvePathToNodeIdx, "g")).eqls([
            [
                [0, -1],
                [1, -2],
            ],
            [
                [1, -1],
                [2, -2],
            ],
            [
                [2, -1],
                [3, -2],
            ],
        ]);
    });

    it("a constraint among the children reads the graph the list is in", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g" xMin="-10" xMax="10" yMin="-10" yMax="10">
      <pointList name="pl">
        <constrainToGraph />
        (20,3) (1,2)
      </pointList>
      <point name="P">(20,3)<constrainToGraph /></point>
    </graph>
    <graph name="g2" xMin="0" xMax="100" yMin="0" yMax="1">
      <pointList name="pl2">
        <attractTo threshold="0.05" relativeToGraphScales><point>(50, 0.5)</point></attractTo>
        (53, 0.5) (50, 0.6)
      </pointList>
      <point name="Q1">(53, 0.5)<attractTo threshold="0.05" relativeToGraphScales><point>(50, 0.5)</point></attractTo></point>
      <point name="Q2">(50, 0.6)<attractTo threshold="0.05" relativeToGraphScales><point>(50, 0.5)</point></attractTo></point>
    </graph>
    <p name="ppl">$pl</p>
    <p name="pP">$P</p>
    <p name="ppl2">$pl2</p>
    <p name="pQ">$Q1, $Q2</p>
    `,
        });

        // as a point with the same constraint, the first is moved inside
        // the graph
        const { pP } = await textsOf(core, resolvePathToNodeIdx, ["pP"]);
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl"])).eqls({
            ppl: `${pP.split(")")[0]}), (1, 2)`,
        });
        expect(pP).not.eq("(20, 3)");

        // relative to the graph's scales, as for points: 3 of 100 in x is
        // near, 0.1 of 1 in y is not
        const { pQ } = await textsOf(core, resolvePathToNodeIdx, ["pQ"]);
        expect(pQ).eq("(50, 0.5), (50, 0.6)");
        expect(await textsOf(core, resolvePathToNodeIdx, ["ppl2"])).eqls({
            ppl2: pQ,
        });
    });

    it("points and vectors of lists sort and are found by a coordinate, as points and vectors are", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pointList name="pl">(3,1) (1,2) (2,0)</pointList>
    <vectorList name="vl">
      <vector tail="(5,6)" head="(7,9)"/>
      <vector tail="(1,1)" head="(2,0)"/>
      <vector tail="(3,0)" head="(3,5)"/>
    </vectorList>
    <p name="byX"><sort>$pl</sort></p>
    <p name="byY"><sort sortByComponent="2">$pl</sort></p>
    <p name="byProp"><sort sortByProp="y">$pl</sort></p>
    <p name="mixed"><sort>$pl (0,5) <point>(2.5, 1)</point></sort></p>
    <p name="indices"><sortIndices>$pl</sortIndices></p>
    <p name="vByDisplacement"><sort>$vl</sort></p>
    <p name="vByTail"><sort sortVectorsBy="tail">$vl</sort></p>
    <p name="vByTailY"><sort sortVectorsBy="tail" sortByComponent="2">$vl</sort></p>
    <p name="index"><indexOf target="2">$pl</indexOf></p>
    <p name="searched"><searchSorted target="2"><sort>$pl</sort></searchSorted></p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "byX",
                "byY",
                "byProp",
                "mixed",
                "indices",
                "vByDisplacement",
                "vByTail",
                "vByTailY",
                "index",
                "searched",
            ]),
        ).eqls({
            byX: "(1, 2), (2, 0), (3, 1)",
            byY: "(2, 0), (3, 1), (1, 2)",
            byProp: "(2, 0), (3, 1), (1, 2)",
            mixed: "(1, 2), (2, 0), (2.5, 1), (3, 1)",
            indices: "2, 3, 1",
            vByDisplacement: "(0, 5), (1, -1), (2, 3)",
            vByTail: "(1, -1), (0, 5), (2, 3)",
            vByTailY: "(0, 5), (1, -1), (2, 3)",
            index: "3",
            searched: "2",
        });
    });

    it("an entry of a vector list has a vector's displacement, magnitude, and head and tail coordinates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vl">(3,4) <vector tail="(1,1)" head="(4,5)"/> (a,b)</vectorList>
    <p name="displacement">$vl[2].displacement</p>
    <p name="displacements">$vl.displacement</p>
    <p name="magnitudes">$vl.magnitude</p>
    <p name="heads">$vl[2].headX1 $vl[2].head[2] $vl.headX1</p>
    <p name="tails">$vl[2].tailX1 $vl[2].tail[2] $vl.tailX2</p>
    <p name="past">$vl[2].headX3</p>
    <mathInput name="mi" bindValueTo="$vl[1].displacement"/>
    <p name="list">$vl</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "displacement",
                "displacements",
                "magnitudes",
                "heads",
                "tails",
                "past",
            ]),
        ).eqls({
            displacement: "(3, 4)",
            displacements: "(3, 4), (3, 4), (a, b)",
            magnitudes: "5, 5, sqrt(a² + b²)",
            heads: "4 5 3, 4, a",
            tails: "1 1 0, 1, 0",
            past: "＿",
        });

        // a displacement written through the entry is the entry's
        await updateMathInputValue({
            latex: "(7,8)",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await textsOf(core, resolvePathToNodeIdx, ["list"])).eqls({
            list: "(7, 8), (3, 4), (a, b)",
        });
    });

    it("a coordinate of an entry's head or tail, and its magnitude, are written as a vector's", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vl">(3,4) <vector name="v" tail="(1,1)" head="(4,5)"/> (1,2,3)</vectorList>
    <mathInput name="headX1" bindValueTo="$vl[1].headX1"/>
    <mathInput name="tail2" bindValueTo="$vl[1].tail[2]"/>
    <mathInput name="magnitude" bindValueTo="$vl[1].magnitude"/>
    <mathInput name="vHeadX2" bindValueTo="$vl[2].headX2"/>
    <mathInput name="vTailX1" bindValueTo="$vl[2].tailX1"/>
    <mathInput name="vTail" bindValueTo="$vl[2].tail"/>
    <p name="first">$vl[1].tail $vl[1].head</p>
    <p name="second">$vl[2].tail $vl[2].head; $v.tail $v.head</p>
    `,
        });

        async function write(name: string, latex: string) {
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
            return textsOf(core, resolvePathToNodeIdx, ["first", "second"]);
        }

        // a coordinate of the head keeps the tail; one of the tail keeps the
        // displacement; the magnitude scales the displacement
        expect(await write("headX1", "9")).eqls({
            first: "(0, 0, 0) (9, 4, 0)",
            second: "(1, 1, 0) (4, 5, 0); (1, 1) (4, 5)",
        });
        expect(await write("tail2", "7")).eqls({
            first: "(0, 7, 0) (9, 11, 0)",
            second: "(1, 1, 0) (4, 5, 0); (1, 1) (4, 5)",
        });
        expect(await write("magnitude", "10")).eqls({
            first: "(0, 7, 0) (9.14, 11.06, 0)",
            second: "(1, 1, 0) (4, 5, 0); (1, 1) (4, 5)",
        });

        // an authored vector in two dimensions, among entries in three, is
        // written in its own two
        expect(await write("vHeadX2", "8")).eqls({
            first: "(0, 7, 0) (9.14, 11.06, 0)",
            second: "(1, 1, 0) (4, 8, 0); (1, 1) (4, 8)",
        });
        expect(await write("vTailX1", "2")).eqls({
            first: "(0, 7, 0) (9.14, 11.06, 0)",
            second: "(2, 1, 0) (5, 8, 0); (2, 1) (5, 8)",
        });
        expect(await write("vTail", "(3,3)")).eqls({
            first: "(0, 7, 0) (9.14, 11.06, 0)",
            second: "(3, 3, 0) (6, 10, 0); (3, 3) (6, 10)",
        });
    });

    it("an entry from a list among the children, or of a copy of the list, is written as a vector", async () => {
        async function writeTo(
            doenetML: string,
            bindValueTo: string,
            latex: string,
        ) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `${doenetML}
    <mathInput name="mi" bindValueTo="${bindValueTo}"/>
    <p name="p">$vl; $vl.tail; $vl.head</p>
    <p name="q">$w; $w.tail; $w.head</p>
    `,
            });
            await updateMathInputValue({
                latex,
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            return textsOf(core, resolvePathToNodeIdx, ["p", "q"]);
        }

        const vl = `<vectorList name="vl">(1,2) <vector tail="(1,1)" head="(4,5)"/></vectorList>`;

        // a list among the children is written its entries' displacements
        for (const doenetML of [
            `${vl}<vectorList name="w">$vl (5,6)</vectorList>`,
            `<vectorList name="w">${vl} (5,6)</vectorList>`,
        ]) {
            expect(await writeTo(doenetML, "$w[1]", "(7,8)")).eqls({
                p: "(7, 8), (3, 4); (0, 0), (1, 1); (7, 8), (4, 5)",
                q: "(7, 8), (3, 4), (5, 6); (0, 0), (1, 1), (0, 0); (7, 8), (4, 5), (5, 6)",
            });
            expect(await writeTo(doenetML, "$w[2].head", "(7,8)")).eqls({
                p: "(1, 2), (6, 7); (0, 0), (1, 1); (1, 2), (7, 8)",
                q: "(1, 2), (6, 7), (5, 6); (0, 0), (1, 1), (0, 0); (1, 2), (7, 8), (5, 6)",
            });
        }

        // a copy of the list is written, not the list
        const copy = `${vl}<vectorList name="w" copy="$vl"/>`;
        const unchanged = "(1, 2), (3, 4); (0, 0), (1, 1); (1, 2), (4, 5)";
        expect(await writeTo(copy, "$w[1].headX1", "9")).eqls({
            p: unchanged,
            q: "(9, 2), (3, 4); (0, 0), (1, 1); (9, 2), (4, 5)",
        });
        expect(await writeTo(copy, "$w[2].magnitude", "10")).eqls({
            p: unchanged,
            q: "(1, 2), (6, 8); (0, 0), (1, 1); (1, 2), (7, 9)",
        });

        // a coordinate of the head of a copy of an authored vector's entry
        // keeps the other coordinates
        expect(
            await writeTo(
                `${vl}<vector name="v" extend="$vl[2]"/><vectorList name="w"/>`,
                "$v.headX1",
                "8",
            ),
        ).eqls({
            p: "(1, 2), (7, 4); (0, 0), (1, 1); (1, 2), (8, 5)",
            q: "; ; ",
        });
    });

    it("an entry describes its style and whether a constraint was used, as a point or vector does", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
        <pointList name="pl">(1,2) <point styleNumber="3">(3,4)</point> <point>(1.2,3.7)<constrainToGrid/></point></pointList>
        <pointList name="pc">(1.2,2.7) (8,4)<constrainToGrid/></pointList>
        <vectorList name="vl" styleNumber="2">(1,2) <vector styleNumber="3" head="(3,4)"/></vectorList>
    </graph>
    <p name="pStyle">$pl.styleDescription; $pl[2].styleDescriptionWithNoun; $pl[2].textColor</p>
    <p name="vStyle">$vl.styleDescription; $vl[1].styleDescriptionWithNoun</p>
    <p name="constraints">$pl.constraintUsed; $pc.constraintUsed</p>
    <p name="coords">$pl[2].coords[1]; $pl.coords[1]</p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pStyle",
                "vStyle",
                "constraints",
                "coords",
            ]),
        ).eqls({
            // an authored point or vector's entry is described in its style
            pStyle: "blue, orange, blue; orange triangle; orange",
            vStyle: "red, orange; red vector",
            constraints: "false, false, true; true, true",
            // an index into coordinates, which are not an array, is ignored
            coords: "(3, 4); (1, 2), (3, 4), (1, 4)",
        });

        // a vector's label is at its center
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        const labelPositions = (
            await drawnIn(core, resolvePathToNodeIdx, "g")
        ).map(
            (child: any) =>
                rendererState[child.componentIdx].stateValues.labelPosition,
        );
        expect(labelPositions).eqls([
            "upperright",
            "upperright",
            "upperright",
            "upperright",
            "upperright",
            "center",
            "center",
        ]);
    });

    it("PreFigure output, graph controls and a legend find each entry, as they find points and vectors", async () => {
        // the same graphs, with the items as a list and as components
        function doenetML(asList: boolean) {
            const points = (name: string) =>
                asList
                    ? `<pointList name="${name}" styleNumber="2">(1,2) (3,4)</pointList>`
                    : `<point styleNumber="2">(1,2)</point><point styleNumber="2">(3,4)</point>`;
            const vectors = asList
                ? `<vectorList>(1,2) (3,4)</vectorList>`
                : `<vector>(1,2)</vector><vector>(3,4)</vector>`;
            return `
    <graph name="gp" renderer="prefigure">${points("plp")}${vectors}</graph>
    <graph name="gc" addControls>${points("pl")}</graph>
    <graph name="gl">${points("pll")}<legend name="legend"><label>A</label></legend></graph>
    <p name="ppl">$pl</p>
    `;
        }
        const withList = await createTestCore({ doenetML: doenetML(true) });
        const withComponents = await createTestCore({
            doenetML: doenetML(false),
        });

        async function stateOf(testCore: any) {
            const stateVariables = await testCore.core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await testCore.resolvePathToNodeIdx(name)]
                    .stateValues;
            const xml: string = (await sv("gp")).prefigureXML;
            return {
                numPointElements: xml.match(/<point\b/g)?.length ?? 0,
                numVectorElements: xml.match(/<vector\b/g)?.length ?? 0,
                controls: (await sv("gc")).graphicalDescendantsForControls.map(
                    (control: any) => [
                        control.controlType,
                        control.x,
                        control.y,
                    ],
                ),
                legend: (await sv("legend")).legendElements.map(
                    (element: any) => [
                        element.swatchType,
                        element.markerColor,
                        element.label.value,
                    ],
                ),
            };
        }

        const expected = await stateOf(withComponents);
        expect(expected.numPointElements).eq(2);
        expect(expected.numVectorElements).eq(2);
        expect(expected.controls).toHaveLength(2);
        expect(await stateOf(withList)).eqls(expected);

        // a control moves its entry
        const stateVariables = await withList.core.returnAllStateVariables(
            false,
            true,
        );
        const control =
            stateVariables[await withList.resolvePathToNodeIdx("gc")]
                .stateValues.graphicalDescendantsForControls[1];
        await withList.core.requestAction({
            componentIdx: control.componentIdx,
            actionName: "movePoint",
            args: { x: 7, y: 8 },
        });
        expect(
            await textsOf(withList.core, withList.resolvePathToNodeIdx, [
                "ppl",
            ]),
        ).eqls({ ppl: "(1, 2), (7, 8)" });
    });

    it("an authored point or vector, or a nested list, is drawn and given a control once, as its entry", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="gp" renderer="prefigure">
      <point name="A">(0,0)</point>
      <pointList><point><label>B</label>(1,2)</point> (3,4) $A <pointList>(5,6) (7,8)</pointList></pointList>
      <vectorList><vector head="(1,2)"/> (3,4)</vectorList>
    </graph>
    <graph name="gc" addControls>
      <pointList><point>(1,2)</point> (3,4) <pointList>(5,6) (7,8)</pointList></pointList>
    </graph>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;

        // A, and the five entries of the list
        const xml: string = (await sv("gp")).prefigureXML;
        expect(
            xml
                .match(/<point\b[^>]*p="[^"]*"/g)
                ?.map((p) => p.match(/p="([^"]*)"/)![1]),
        ).eqls(["(0,0)", "(1,2)", "(3,4)", "(0,0)", "(5,6)", "(7,8)"]);
        expect(xml.match(/<vector\b/g)).toHaveLength(2);
        expect(
            (await sv("gc")).graphicalDescendantsForControls.map(
                (control: any) => [control.x, control.y],
            ),
        ).eqls([
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
        ]);
    });

    it("an answer's responses from a point or vector list are points and vectors", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <pointList name="pl">(1,2) (3,4)</pointList>
      <vectorList name="vl">(5,6)</vectorList>
    </graph>
    <answer name="a"><award referencesAreResponses="$pl $vl"><when>$pl = (1,2), (3,4) and $vl = (5,6)</when></award></answer>
    <p name="pr">$a.currentResponses</p>
    <graph name="g">$a.currentResponses</graph>
    `,
        });
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("a"),
            actionName: "submitAnswer",
            args: {},
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        expect((await sv("a")).submittedResponsesComponentType).eqls([
            "point",
            "point",
            "vector",
        ]);
        expect((await sv("pr")).text).eq("(1, 2), (3, 4), (5, 6)");
        expect(
            core.core.rendererInstructionBuilder.rendererState[
                await resolvePathToNodeIdx("g")
            ].childrenInstructions.map((child: any) => child.componentType),
        ).eqls(["point", "point", "vector"]);
    });

    it("an entry is drawn again when its tail, or its child's label or style, changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList name="vl">(1,2)</vectorList>
      <pointList name="pl"><point styleNumber="$n" layer="$n">(3,4)<label>$t</label></point></pointList>
    </graph>
    <mathInput name="tail" bindValueTo="$vl[1].tail" />
    <mathInput name="n" prefill="1" />
    <textInput name="t" prefill="A" />
    `,
        });

        async function drawnEntries() {
            const rendererState =
                core.core!.rendererInstructionBuilder.rendererState;
            return (await drawnIn(core, resolvePathToNodeIdx, "g")).map(
                (child: any) => {
                    const stateValues =
                        rendererState[child.componentIdx].stateValues;
                    return {
                        coords: child.coords,
                        label: stateValues.label,
                        layer: stateValues.layer,
                        markerStyle: stateValues.selectedStyle.markerStyle,
                    };
                },
            );
        }
        expect(await drawnEntries()).eqls([
            {
                coords: [
                    [0, 0],
                    [1, 2],
                ],
                label: "",
                layer: 0,
                markerStyle: "circle",
            },
            { coords: [3, 4], label: "A", layer: 1, markerStyle: "circle" },
        ]);

        // none of these changes the value of an entry
        await updateMathInputValue({
            latex: "(2,2)",
            componentIdx: await resolvePathToNodeIdx("tail"),
            core,
        });
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await updateTextInputValue({
            text: "B",
            componentIdx: await resolvePathToNodeIdx("t"),
            core,
        });
        expect(await drawnEntries()).eqls([
            {
                coords: [
                    [2, 2],
                    [3, 4],
                ],
                label: "",
                layer: 0,
                markerStyle: "circle",
            },
            { coords: [3, 4], label: "B", layer: 3, markerStyle: "triangle" },
        ]);
    });

    it("an authored endpoint is drawn open and switched as itself", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <pointList name="pl"><endpoint name="E" open switchable>(1,2)</endpoint> (3,4)</pointList>
    </graph>
    <p name="pE">$E.open</p>
    <number name="n">0</number>
    <updateValue name="uv" target="$n" newValue="$n+1" triggerWith="$pl" />
    <p name="pn">$n</p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        async function drawnOpen() {
            const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
            return drawn.map((child: any) => {
                const { open, switchable } =
                    rendererState[child.componentIdx].stateValues;
                return [open, switchable];
            });
        }

        // an entry that is not an endpoint has no `open`, so its renderer
        // follows its marker style
        expect(await drawnOpen()).eqls([
            [true, true],
            [undefined, false],
        ]);

        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        for (const child of drawn) {
            await core.requestAction({
                componentIdx: child.componentIdx,
                actionName: "switchPoint",
                args: {},
            });
        }
        // a switch is not an action chained to the list
        expect(await textsOf(core, resolvePathToNodeIdx, ["pE", "pn"])).eqls({
            pE: "false",
            pn: "0",
        });
        expect(await drawnOpen()).eqls([
            [false, true],
            [undefined, false],
        ]);
    });

    it("an authored vector in three dimensions is dragged in a graph as it is on its own", async () => {
        // A drag in a graph gives two coordinates. The entry is the
        // vector's own drag, so it keeps a symbolic coordinate as the vector
        // does on its own (and, given by its displacement, has the third
        // coordinate of its head made NaN as the vector does on its own).
        for (const vector of [
            `<vector name="v">(1,2,pi)</vector>`,
            `<vector name="v" tail="(0,0,a)" head="(1,2,pi)" />`,
            `<vector name="v" head="(1,2,pi)" displacement="(1,1,a)" />`,
            `<vector name="v" tail="(0,0,a)" displacement="(1,2,pi)" />`,
        ]) {
            for (const args of [
                { headcoords: [5, 6] },
                { tailcoords: [1, 1] },
                { tailcoords: [2, 2], headcoords: [4, 4] },
            ]) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <graph name="g"><vectorList>${vector}</vectorList></graph>
    <graph name="g2">${vector.replace(`name="v"`, `name="w"`)}</graph>
    <p name="pv">$v.tail $v.head</p>
    <p name="pw">$w.tail $w.head</p>
    `,
                });
                for (const graph of ["g", "g2"]) {
                    await dragEntry({
                        core,
                        resolvePathToNodeIdx,
                        graph,
                        index: 0,
                        actionName: "moveVector",
                        args,
                    });
                }
                const { pv, pw } = await textsOf(core, resolvePathToNodeIdx, [
                    "pv",
                    "pw",
                ]);
                expect(pv, `${vector} ${JSON.stringify(args)}`).eq(pw);
            }
        }
    });

    it("a list of vectors in one dimension as the target of a constraint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <vectorList name="vl">(1) (2)</vectorList>
    <graph><point name="P">(3,4)<constrainTo>$vl</constrainTo></point></graph>
    <p name="pP">$P</p>
    `,
        });
        // a vector in one dimension gives no nearest point, as on its own
        expect(await textsOf(core, resolvePathToNodeIdx, ["pP"])).eqls({
            pP: "(3, 4)",
        });
    });

    it("an authored entry of a list with fixLocation takes the list's fixLocation", async () => {
        // A drag of an entry from an authored point or vector is the
        // child's own; the child is fixLocation as its list is.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <vectorList fixLocation><vector name="v" tail="(1,1)" head="(2,3)" /></vectorList>
      <pointList fixLocation><point name="P">(1,2)</point></pointList>
    </graph>
    <p name="pv">$v.tail $v.head</p>
    <p name="pP">$P</p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        const drawn = await drawnIn(core, resolvePathToNodeIdx, "g");
        expect(
            drawn.map(
                (child: any) =>
                    rendererState[child.componentIdx].stateValues.fixLocation,
            ),
        ).eqls([true, true]);

        for (const [index, actionName, args] of [
            [0, "moveVector", { headcoords: [7, 7] }],
            [0, "moveVector", { tailcoords: [0, 0], headcoords: [5, 5] }],
            [1, "movePoint", { x: 9, y: 9 }],
        ] as const) {
            await dragEntry({
                core,
                resolvePathToNodeIdx,
                graph: "g",
                index,
                actionName,
                args,
            });
        }
        expect(await textsOf(core, resolvePathToNodeIdx, ["pv", "pP"])).eqls({
            pv: "(1, 1) (2, 3)",
            pP: "(1, 2)",
        });
    });
});
