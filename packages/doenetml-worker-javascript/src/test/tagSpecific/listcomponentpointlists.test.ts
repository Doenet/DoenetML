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
});
