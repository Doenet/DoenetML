import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    moveLineSegment,
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function setupScene({
    lineProperties = "",
    lineChildren = "",
    additionalComponents = "",
}: {
    lineProperties?: string;
    lineChildren?: string;
    additionalComponents?: string;
}) {
    let { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML:
            `
  <graph name="g">
    <lineSegment name="l" ` +
            lineProperties +
            `>
    ` +
            lineChildren +
            `
    </lineSegment>
    <pointList extend="$l.endpoints" name="Ps" />
  </graph>

   ` +
            additionalComponents +
            `
  <graph name="g2">
    <lineSegment extend="$g.l" name="l" />
    <pointList extend="$l.endpoints" name="Ps" />
  </graph>
  
  <graph extend="$g2" name="g3" />
  `,
    });

    return { core, resolvePathToNodeIdx };
}

async function runPointBasedTests({
    core,
    resolvePathToNodeIdx,
    points,
    definingPointNames = [],
    label,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    points: number[][];
    definingPointNames?: string[];
    label?: string;
}) {
    let componentIndices = [
        [
            await resolvePathToNodeIdx("g.l"),
            await resolvePathToNodeIdx("g.Ps[1]"),
            await resolvePathToNodeIdx("g.Ps[2]"),
        ],
        [
            await resolvePathToNodeIdx("g2.l"),
            await resolvePathToNodeIdx("g2.Ps[1]"),
            await resolvePathToNodeIdx("g2.Ps[2]"),
        ],
        [
            await resolvePathToNodeIdx("g3.l"),
            await resolvePathToNodeIdx("g3.Ps[1]"),
            await resolvePathToNodeIdx("g3.Ps[2]"),
        ],
    ];

    const definingPointIndices: number[] = [];
    for (const name of definingPointNames) {
        definingPointIndices.push(await resolvePathToNodeIdx(name));
    }

    await checkAllLineValues({
        componentIndices,
        points,
        definingPointIndices,
        label,
        core,
    });

    let point1Indices = componentIndices.map((v) => v[1]);
    if (definingPointNames.length > 0) {
        point1Indices.push(definingPointIndices[0]);
    }

    let point2Indices = componentIndices.map((v) => v[2]);
    if (definingPointNames.length > 1) {
        point2Indices.push(definingPointIndices[1]);
    }

    for (let ind = 0; ind < 7; ind++) {
        // move point 1
        let P1CIdx = point1Indices[ind % point1Indices.length];
        let dx = 4 * ind - 3 - points[0][0];
        let dy = 10 - 3 * ind - points[0][1];
        points[0][0] += dx;
        points[0][1] += dy;
        await movePoint({
            componentIdx: P1CIdx,
            x: points[0][0],
            y: points[0][1],
            core,
        });
        await checkAllLineValues({
            componentIndices,
            points,
            definingPointIndices,
            core,
        });

        // move point2
        let P2CIdx = point2Indices[ind % point2Indices.length];
        if (ind === 0) {
            // slope is Infinity
            points[1] = [points[0][0], points[0][1] + 5];
        } else if (ind === 1) {
            // slope is -Infinity
            points[1] = [points[0][0], points[0][1] - 6];
        } else if (ind === 2) {
            // points on top of each other
            points[1] = [...points[0]];
        } else {
            points[1] = [-5 * ind - 2, 3 + 4 * ind];
        }
        await movePoint({
            componentIdx: P2CIdx,
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({
            componentIndices,
            points,
            definingPointIndices,
            core,
        });
    }

    // move line segment
    for (let [ind, indexObj] of componentIndices.entries()) {
        let lCIdx = indexObj[0];

        points[0] = [ind ** 2, 16 - Math.sqrt(ind)];
        points[1] = [Math.log(ind + 1) - 1, 2 ** ind - 3];
        await moveLineSegment({
            componentIdx: lCIdx,
            point1coords: points[0],
            point2coords: points[1],
            core,
        });

        await checkAllLineValues({
            componentIndices,
            points,
            definingPointIndices,
            core,
        });
    }
}

async function checkAllLineValues({
    componentIndices,
    points,
    definingPointIndices = [],
    label,
    core,
}: {
    componentIndices: number[][];
    points: number[][];
    definingPointIndices?: number[];
    label?: string;
    core: PublicDoenetMLCore;
}) {
    let slope = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0]);

    for (let indexObj of componentIndices) {
        await checkLineValues({
            cIdx: indexObj[0],
            P1CIdx: indexObj[1],
            P2CIdx: indexObj[2],
            points,
            slope,
            label,
            core,
        });
    }

    const stateVariables = await core.returnAllStateVariables(false, true);
    for (let [ind, pointIdx] of definingPointIndices.entries()) {
        expect(stateVariables[pointIdx].stateValues.xs.map((v) => v.tree)).eqls(
            points[ind],
        );
    }
}

async function checkLineValues({
    cIdx,
    P1CIdx,
    P2CIdx,
    points,
    label,
    slope,
    core,
}: {
    cIdx: number;
    P1CIdx: number;
    P2CIdx: number;
    points: number[][];
    slope: number;
    label?: string;
    core: PublicDoenetMLCore;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);

    let linePoints = stateVariables[cIdx].stateValues.endpoints;
    let P1xs = stateVariables[P1CIdx].stateValues.xs;
    let P2xs = stateVariables[P2CIdx].stateValues.xs;
    let lineSlope = stateVariables[cIdx].stateValues.slope;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            expect(linePoints[i][j].evaluate_to_constant()).closeTo(
                points[i][j],
                1e-12,
            );
        }
        expect(P1xs[i].evaluate_to_constant()).closeTo(points[0][i], 1e-12);
        expect(P2xs[i].evaluate_to_constant()).closeTo(points[1][i], 1e-12);
    }
    if (Number.isFinite(slope)) {
        expect(lineSlope).closeTo(slope, 1e-12);
    } else {
        expect(lineSlope).eqls(slope);
    }

    if (label) {
        expect(stateVariables[cIdx].stateValues.label).eq(label);
    }
}

describe("LineSegment tag tests", async () => {
    it("lineSegment with no arguments", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({});

        const points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, resolvePathToNodeIdx, points });
    });

    it("lineSegment with empty endpoints", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints=""`,
        });

        let points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, resolvePathToNodeIdx, points });
    });

    it("string endpoints, label child", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="(1,2) (4,7)"`,
            lineChildren: `<label>l</label>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            label: "l",
        });
    });

    it("endpoints from strings and maths, labelIsName", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="($m1,$m2) (4,7)" labelIsName`,
            additionalComponents: `<math name="m1">1</math><math name="m2">2</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            label: "l",
        });
    });

    it("endpoints are maths, label child", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$m1 $m2"`,
            lineChildren: `<label>m</label>`,
            additionalComponents: `<math name="m1">(1,2)</math><math name="m2">(4,7)</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            label: "m",
        });
    });

    it("two endpoints", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$dp1 $dp2"`,
            additionalComponents: `<point name="dp1">(1,2)</point><point name="dp2">(4,7)</point>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["dp1", "dp2"];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            definingPointNames,
        });
    });

    it("one endpoint", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$dp1"`,
            additionalComponents: `<point name="dp1">(1,2)</point>`,
        });

        let points = [
            [1, 2],
            [0, 0],
        ];

        let definingPointNames = ["dp1"];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            definingPointNames,
        });
    });

    it("one endpoint - the origin", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$dp1"`,
            additionalComponents: `<point name="dp1">(0,0)</point>`,
        });

        let points = [
            [0, 0],
            [0, 0],
        ];
        let definingPointNames = ["dp1"];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            definingPointNames,
        });
    });

    it("multiple layers of copied points", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$p1c $p2c"`,
            additionalComponents: `
    <point name="dp1">(2,1)</point>
    <point name="dp2">(-2,-5)</point>
    <point extend="$dp1" name="p1a" />
    <point extend="$dp2" name="p2a" />
    <point extend="$p1a" name="p1b" />
    <point extend="$p2a" name="p2b" />
    <point extend="$p1b" name="p1c" />
    <point extend="$p2b" name="p2c" />
            `,
        });

        let points = [
            [2, 1],
            [-2, -5],
        ];
        let definingPointNames = ["dp1", "dp2"];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            definingPointNames,
        });
    });

    it("new line segment from copied endpoints of line segment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <graph name="g">
        <point name="dp1">(1,2)</point>
        <point name="dp2">(4,7)</point>
        <lineSegment name="l" endpoints="$dp1 $dp2" />
        <pointList extend="$l.endpoints" name="Ps" />
      </graph>
      <graph name="g2">
        <lineSegment name="l" endpoints="$g.l.endpoints" />
        <pointList extend="$l.endpoints" name="Ps" />
      </graph>
      
      <graph extend="$g2" name="g3" />
      `,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["dp1", "dp2"];

        await runPointBasedTests({
            core,
            resolvePathToNodeIdx,
            points,
            definingPointNames,
        });
    });

    it("initially non-numeric point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="x" prefill="q"/>
  <graph>
    <lineSegment name="l" endpoints="($x,2) (-2,3)" />
  </graph>
  `,
        });

        // check initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls(["q", 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([-2, 3]);

        // change point to be numeric
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([5, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([-2, 3]);
    });

    it("handle bad endpoints", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <text name="t">a</text>
  <graph>
    <line name="l1" through="A" />
  </graph>
  `,
        });

        // page loads
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.value,
        ).eq("a");
    });

    it("extracting endpoint coordinates of symmetric line segment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math name="threeFixed" fixed>3</math>

  <graph>
    <lineSegment name="l" endpoints="(1,2) ($l.endpoints[1][2],$l.endpoints[1][1]) "/>
    <point name="x1" x="$l.endpoints[1][1]" y="$threeFixed" />
    <point name="x2">
      ($l.endpoint2.x, <math fixed>4</math>)
    </point>
    <point name="y1" y="$l.endpoint1[2]" x="$threeFixed" />
    <point name="y2">
      (<math fixed>4</math>, $l.endpoints[2].y)
    </point>
  </graph>
  
  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l")
                ].stateValues.endpoints[0].map((v) => v.tree),
            ).eqls([x, y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l")
                ].stateValues.endpoints[1].map((v) => v.tree),
            ).eqls([y, x]);
            expect(
                stateVariables[await resolvePathToNodeIdx("x1")].stateValues
                    .xs[0].tree,
            ).eq(x);
            expect(
                stateVariables[await resolvePathToNodeIdx("x2")].stateValues
                    .xs[0].tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("y1")].stateValues
                    .xs[1].tree,
            ).eq(y);
            expect(
                stateVariables[await resolvePathToNodeIdx("y2")].stateValues
                    .xs[1].tree,
            ).eq(x);
        }

        let x = 1;
        let y = 2;
        await check_items(x, y);

        // move x point 1
        x = 3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("x1"),
            x,
            core,
        });
        await check_items(x, y);

        // move x point 2
        y = 4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("x2"),
            x: y,
            core,
        });
        await check_items(x, y);

        // move y point 1
        y = -6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("y1"),
            y,
            core,
        });
        await check_items(x, y);

        // move y point 2
        x = -8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("y2"),
            y: x,
            core,
        });
        await check_items(x, y);
    });

    // TODO: restore test when restore functionality. See issue #479.
    it.skip("three line segments with mutual references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
    <lineSegment name="l1" endpoints="$p22 (1,0)" />
    <lineSegment name="l2" endpoints="$p32 (3,2)" />
    <lineSegment name="l3" endpoints="$p12 (-1,4)" />
    <point name="p11" extend="$l1.endpoint1" />
    <point name="p12" extend="$l1.endpoint2" />
    <point name="p21" extend="$l2.endpoint1" />
    <point name="p22" extend="$l2.endpoint2" />
    <point name="p31" extend="$l3.endpoint1" />
    <point name="p32" extend="$l3.endpoint2" />
</graph>
  `,
        });

        async function check_items({
            x1,
            x2,
            x3,
            y1,
            y2,
            y3,
        }: {
            x1: number;
            x2: number;
            x3: number;
            y1: number;
            y2: number;
            y3: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l1")
                ].stateValues.endpoints[0].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l1")
                ].stateValues.endpoints[1].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l2")
                ].stateValues.endpoints[0].map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l2")
                ].stateValues.endpoints[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l3")
                ].stateValues.endpoints[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("l3")
                ].stateValues.endpoints[1].map((v) => v.tree),
            ).eqls([x3, y3]);
        }

        let x1 = 1,
            y1 = 0;
        let x2 = 3,
            y2 = 2;
        let x3 = -1,
            y3 = 4;
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 1
        x2 = 7;
        y2 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p11"),
            x: x2,
            y: y2,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 1
        x1 = -1;
        y1 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p12"),
            x: x1,
            y: y1,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 2
        x3 = 9;
        y3 = -8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p21"),
            x: x3,
            y: y3,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 2
        x2 = 3;
        y2 = 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p22"),
            x: x2,
            y: y2,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 3
        x1 = -5;
        y1 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p31"),
            x: x1,
            y: y1,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 3
        x3 = 0;
        y3 = -5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("p32"),
            x: x3,
            y: y3,
            core,
        });
        await check_items({ x1, x2, x3, y1, y2, y3 });
    });

    it("line segment with one endpoint, copy and overwrite the point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <lineSegment endpoints="(-5,9)" name="l" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />
  </graph>

  <graph name="g2">
    <lineSegment extend="$g1.l" name="l" endpoints="(4,-2)" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph name="g3">
    <lineSegment extend="$g2.l" name="l" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph name="g4">
    <lineSegment extend="$g3.l" name="l" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph extend="$g2" name="g5" />
  `,
        });

        async function checkLines({
            x11,
            y11,
            x12,
            y12,
            x2,
            y2,
        }: {
            x11: number;
            y11: number;
            x12: number;
            y12: number;
            x2: number;
            y2: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.l")
                ].stateValues.endpoints[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.l")
                ].stateValues.endpoints[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.l")
                ].stateValues.endpoints[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.l")
                ].stateValues.endpoints[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.A")].stateValues
                    .xs[0].tree,
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.A")].stateValues
                    .xs[1].tree,
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.B")].stateValues
                    .xs[0].tree,
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.B")].stateValues
                    .xs[1].tree,
            ).closeTo(y2, 1e-12);

            for (let g of ["g2", "g3", "g4", "g5"]) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.A`)]
                        .stateValues.xs[0].tree,
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.A`)]
                        .stateValues.xs[1].tree,
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.B`)]
                        .stateValues.xs[0].tree,
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.B`)]
                        .stateValues.xs[1].tree,
                ).closeTo(y2, 1e-12);
            }
        }

        let x11 = -5,
            y11 = 9;
        let x12 = 4,
            y12 = -2;
        let x2 = 0,
            y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.A"),
            x: x11,
            y: y11,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g1.l"),
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g2.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g3.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g4.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g5.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line segment with one endpoint, copy and overwrite the point, swap line", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <booleanInput name="b" />
  <graph name="g1">
    <conditionalContent name="cc">
      <case condition="$b" >
        <lineSegment name="l" endpoints="(1,2)" />
      </case>
      <else>
        <lineSegment name="l" endpoints="(-5,9)" />
      </else>
    </conditionalContent>
    <point extend="$cc.l.endpoint1" name="A" />
    <point extend="$cc.l.endpoint2" name="B" />
  </graph>

  <graph name="g2">
    <lineSegment extend="$g1.cc.l" name="l" endpoints="(4,-2)" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph name="g3">
    <lineSegment extend="$g2.l" name="l" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph name="g4">
    <lineSegment extend="$g3.l" name="l" />
    <point extend="$l.endpoint1" name="A" />
    <point extend="$l.endpoint2" name="B" />  
  </graph>

  <graph extend="$g2" name="g5" />

  `,
        });

        async function checkLines({
            x11,
            y11,
            x12,
            y12,
            x2,
            y2,
        }: {
            x11: number;
            y11: number;
            x12: number;
            y12: number;
            x2: number;
            y2: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.cc.l")
                ].stateValues.endpoints[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.cc.l")
                ].stateValues.endpoints[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.cc.l")
                ].stateValues.endpoints[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("g1.cc.l")
                ].stateValues.endpoints[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.A")].stateValues
                    .xs[0].tree,
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.A")].stateValues
                    .xs[1].tree,
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.B")].stateValues
                    .xs[0].tree,
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("g1.B")].stateValues
                    .xs[1].tree,
            ).closeTo(y2, 1e-12);

            for (let g of ["g2", "g3", "g4", "g5"]) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`${g}.l`)
                    ].stateValues.endpoints[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.A`)]
                        .stateValues.xs[0].tree,
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.A`)]
                        .stateValues.xs[1].tree,
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.B`)]
                        .stateValues.xs[0].tree,
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`${g}.B`)]
                        .stateValues.xs[1].tree,
                ).closeTo(y2, 1e-12);
            }
        }

        let x11 = -5,
            y11 = 9;
        let x12 = 4,
            y12 = -2;
        let x2 = 0,
            y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.A"),
            x: x11,
            y: y11,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g1.cc.l"),
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g2.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g3.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g4.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g5.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });
        x11 = 1;
        y11 = 2;
        x12 = 4;
        y12 = -2;
        x2 = 0;
        y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.A"),
            x: x11,
            y: y11,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g1.cc.l"),
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g2.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g3.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g4.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.A"),
            x: x12,
            y: y12,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g5.B"),
            x: x2,
            y: y2,
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g5.l"),
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line segment with fixed endpoint", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g1">
    <point name="p" hide fixed>(-5,9)</point>
    <lineSegment name="l" endpoints="$p" />
    <point extend="$l.endpoint1" name="P1" />
    <point extend="$l.endpoint2" name="P2" />
  </graph>

  <graph name="g2">
    <lineSegment extend="$g1.l" name="l" />
    <point extend="$l.endpoint1" name="P1" />
    <point extend="$l.endpoint2" name="P2" />  
  </graph>

  <graph extend="$g2" name="g3" />

  `,
        });

        let points = [
            [-5, 9],
            [0, 0],
        ];

        let componentIndices = [
            [
                await resolvePathToNodeIdx("g1.l"),
                await resolvePathToNodeIdx("g1.P1"),
                await resolvePathToNodeIdx("g1.P2"),
            ],
            [
                await resolvePathToNodeIdx("g2.l"),
                await resolvePathToNodeIdx("g2.P1"),
                await resolvePathToNodeIdx("g2.P2"),
            ],
            [
                await resolvePathToNodeIdx("g3.l"),
                await resolvePathToNodeIdx("g3.P1"),
                await resolvePathToNodeIdx("g3.P2"),
            ],
        ];

        await checkAllLineValues({ componentIndices, points, core });

        // can't move point 1
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.P1"),
            x: 7,
            y: -3,
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // move point P2
        points[1] = [-1, -4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g1.P2"),
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // try to move line segment
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g1.l"),
            point1coords: [points[0][0] + 5, points[0][1] + 9],
            point2coords: [points[1][0] + 5, points[1][1] + 9],
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // can't move point g2/P1
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.P1"),
            x: -1,
            y: 0,
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // move point g2/P2
        points[1] = [6, -6];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.P2"),
            x: points[1][0],
            y: points[1][1],
            core,
        });

        // move line segment 2
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g2.l"),
            point1coords: [points[0][0] - 3, points[0][1] + 7],
            point2coords: [points[1][0] - 3, points[1][1] + 7],
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // can't move point g3/P1
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.P1"),
            x: -3,
            y: 7,
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // move point B3
        points[1] = [-8, -4];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.P2"),
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });

        // move line segment 3
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("g3.l"),
            point1coords: [points[0][0] - 8, points[0][1] - 2],
            point2coords: [points[1][0] - 8, points[1][1] - 2],
            core,
        });
        await checkAllLineValues({ componentIndices, points, core });
    });

    it("constrain to line segment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(3,4)</point>
  <lineSegment name="l" endpoints="$P1 $P2" />

  <point name="P3" x="-5" y="2">
      <constrainTo>$l</constrainTo>
  </point>
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // move line segment to 45 degrees
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [-4, 4],
            point2coords: [4, -4],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([-4, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([4, -4]);

        let xorig = -5;
        let yorig = 2;
        let temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        let p5x = temp;
        let p5y = -temp;

        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);

        // move point
        xorig = 10;
        yorig = 1;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);

        // move point
        xorig = 9;
        yorig = 7;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);

        // move point
        xorig = -9;
        yorig = 7;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);
    });

    it("attract to linesegment", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(3,4)</point>
  <lineSegment name="l" endpoints="$P1 $P2" />

  <point name="P3" x="-5" y="2">
      <attractTo>$l</attractTo>
  </point>
  </graph>
  `,
        });

        // check initial values

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).eq(-5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // move line segment to 45 degrees
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [-4, 4],
            point2coords: [4, -4],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([-4, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([4, -4]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).eq(-5);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).eq(2);

        // move point
        let xorig = 3.3;
        let yorig = -3.6;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        let temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        let p5x = temp;
        let p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);

        // move point
        xorig = 4.3;
        yorig = -4.6;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(4.3, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(-4.6, 1e-12);

        // move point
        xorig = -2.4;
        yorig = 2.8;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);

        // move point
        xorig = -4.2;
        yorig = 4.3;

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: xorig,
            y: yorig,
            core,
        });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[0]
                .tree,
        ).closeTo(p5x, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3")].stateValues.xs[1]
                .tree,
        ).closeTo(p5y, 1e-12);
    });

    it("point constrained to line segment, different scales from graph", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph xMin="-110" xMax="110" yMin="-0.11" yMax="0.11">
    <lineSegment endpoints="(-1,-0.05) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
        <constrainTo relativeToGraphScales>$l</constrainTo>
    </point>
  </graph>
  `,
        });

        // point on line segment, close to origin

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        let y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;

        expect(y).greaterThan(0);
        expect(y).lessThan(0.01);

        expect(x).closeTo(20 * y, 1e-10);

        // move point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -100,
            y: 0.05,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);

        // move point past endpoint
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -100,
            y: 0.1,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        x =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[0]
                .tree;
        y =
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs[1]
                .tree;
        expect(y).eq(0.05);
        expect(x).closeTo(20 * y, 1e-10);
    });

    it("copy propIndex of endpoints, array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <lineSegment name="l" endpoints="(2,-3) (3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><pointList extend="$l.endpoints[$n]" name="Ps" /></p>
    <p><math extend="$l.endpoint2[$n]" name="x" /></p>
    <p><math extend="$l.endpoints[2][$n]" name="xa" /></p>


    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;

        async function check_items(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (n === 1) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("Ps[1]")
                    ].stateValues.xs.map((v) => v.tree),
                ).eqls([t1x, t1y]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("x")].stateValues
                        .value.tree,
                ).eq(t2x);
                expect(
                    stateVariables[await resolvePathToNodeIdx("xa")].stateValues
                        .value.tree,
                ).eq(t2x);
            } else if (n === 2) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("Ps[1]")
                    ].stateValues.xs.map((v) => v.tree),
                ).eqls([t2x, t2y]);
                expect(
                    stateVariables[await resolvePathToNodeIdx("x")].stateValues
                        .value.tree,
                ).eq(t2y);
                expect(
                    stateVariables[await resolvePathToNodeIdx("xa")].stateValues
                        .value.tree,
                ).eq(t2y);
            } else {
                expect(stateVariables[await resolvePathToNodeIdx("Ps[1]")]).eq(
                    undefined,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("x")].stateValues
                        .value.tree,
                ).eq("\uff3f");
                expect(
                    stateVariables[await resolvePathToNodeIdx("xa")].stateValues
                        .value.tree,
                ).eq("\uff3f");
            }
            expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
                undefined,
            );
        }

        await check_items(NaN);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(1);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(2);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items(3);
    });

    it("label positioning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <lineSegment endpoints="(1,2) (3,4)" labelPosition="$labelPos" name="l">
        <label>$label</label>
      </lineSegment>
    </graph>

    <p>label: <textInput name="label" prefill="line" /></p>
    <p>position:
    <choiceInput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceInput>
    </p>
    `,
        });

        async function check_items(label: string, position: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("l")].stateValues
                    .label,
            ).eq(label);
            expect(
                stateVariables[await resolvePathToNodeIdx("l")].stateValues
                    .labelPosition,
            ).eq(position.toLowerCase());
            expect(
                stateVariables[await resolvePathToNodeIdx("labelPos")]
                    .stateValues.selectedValues,
            ).eqls([position]);
        }

        await check_items("line", "upperRight");

        await updateTextInputValue({
            text: "l",
            componentIdx: await resolvePathToNodeIdx("label"),
            core,
        });
        await check_items("l", "upperRight");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("labelPos"),
            selectedIndices: [2],
            core,
        });
        await check_items("l", "upperLeft");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("labelPos"),
            selectedIndices: [3],
            core,
        });
        await check_items("l", "lowerRight");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("labelPos"),
            selectedIndices: [4],
            core,
        });
        await check_items("l", "lowerLeft");
    });

    it("line segment based on two endpoints, one constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
  <point name="P" labelIsName>(3,5)
    <constrainToGrid dx="2" dy="3" />
    </point>
  <point name="Q" labelIsName>(-4,-1)</point>
  <lineSegment name="l" endpoints="$P $Q" />
  </graph>
    `,
        });

        async function check_items(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[0].tree,
            ).eq(x1);
            expect(
                stateVariables[await resolvePathToNodeIdx("P")].stateValues
                    .xs[1].tree,
            ).eq(y1);
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .xs[0].tree,
            ).eq(x2);
            expect(
                stateVariables[await resolvePathToNodeIdx("Q")].stateValues
                    .xs[1].tree,
            ).eq(y2);
        }
        let x1 = 4,
            y1 = 6;
        let x2 = -4,
            y2 = -1;

        await check_items(x1, y1, x2, y2);

        // move line down 4 and right 0.5 actually moves it down 3 and right none
        let dx = 0.5,
            dy = -4;

        let x1Desired = x1 + dx;
        let y1Desired = y1 + dy;
        let x2Desired = x2 + dx;
        let y2Desired = y2 + dy;

        dx = 0;
        dy = -3;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [x1Desired, y1Desired],
            point2coords: [x2Desired, y2Desired],
            core,
        });

        await check_items(x1, y1, x2, y2);
    });

    it("lineSegment length", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <point name="A">(3,4)</point>
      <point name="B">(7,-2)</point>
      <lineSegment name="l" endpoints="$A $B" />
    </graph>
    <mathInput name="milength" bindValueTo="$l.length" />
    `,
        });

        let t1x = 3,
            t1y = 4;
        let t2x = 7,
            t2y = -2;
        let len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.length
                .tree,
        ).eq(len);

        t1x = 7;
        t1y = 3;
        len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: t1x,
            y: t1y,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.length
                .tree,
        ).eq(len);

        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("milength"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.length
                .tree,
        ).eq(10);

        // ignore requested negative length
        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("milength"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.length
                .tree,
        ).eq(10);

        t1y = 5.5;
        t2x = -9;
        t2y = 5;
        len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: t2x,
            y: t2y,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("l")].stateValues.length
                .tree,
        ).eq(len);
    });

    it("lineSegment symbolic length", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <lineSegment name="l" endpoints="(x,y) (u,v)" />
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("l")
            ].stateValues.length.equals(me.fromText("sqrt((x-u)^2+(y-v)^2)")),
        ).eq(true);
    });

    it("draggable, endpoints draggable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <lineSegment endpoints="(1,3) (5,7)" name="p" draggable="$draggable" endpointsDraggable="$endpointsDraggable" />
  </graph>
  <p>draggable: <booleanInput name="draggable" /></p>
  <p>endpoints draggable: <booleanInput name="endpointsDraggable" /></p>
  `,
        });

        async function check_items({
            point1,
            point2,
            draggable,
            endpointsDraggable,
        }: {
            point1: number[];
            point2: number[];
            draggable: boolean;
            endpointsDraggable: boolean;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p")
                ].stateValues.endpoints[0].map((v) => v.tree),
            ).eqls(point1);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p")
                ].stateValues.endpoints[1].map((v) => v.tree),
            ).eqls(point2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .draggable,
            ).eq(draggable);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .endpointsDraggable,
            ).eq(endpointsDraggable);
        }

        let point1 = [1, 3];
        let point2 = [5, 7];
        let draggable = false;
        let endpointsDraggable = false;

        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move single endpoint
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: [4, 7],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point2coords: [4, 7],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move both endpoints
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: [4, 7],
            point2coords: [8, 10],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // only endpoints draggable
        endpointsDraggable = true;
        await updateBooleanInputValue({
            boolean: endpointsDraggable,
            componentIdx: await resolvePathToNodeIdx("endpointsDraggable"),
            core,
        });

        // can move first endpoint
        point1 = [4, 7];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: point1,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move second endpoint
        point2 = [-5, -1];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move both endpoints
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: [3, 8],
            point2coords: [8, 10],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // endpoints and line segment draggable
        draggable = true;
        await updateBooleanInputValue({
            boolean: draggable,
            componentIdx: await resolvePathToNodeIdx("draggable"),
            core,
        });

        // can move first endpoint
        point1 = [-3, 2];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: point1,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move second endpoint
        point2 = [-9, 0];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move both endpoints
        point1 = [3, 8];
        point2 = [8, 10];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: point1,
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // line segment but not endpoints draggable
        endpointsDraggable = false;
        await updateBooleanInputValue({
            boolean: endpointsDraggable,
            componentIdx: await resolvePathToNodeIdx("endpointsDraggable"),
            core,
        });

        // cannot move first endpoint
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: [9, 3],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move second endpoint
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point2coords: [9, 3],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move both endpoints
        point1 = [-4, 1];
        point2 = [9, -4];
        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("p"),
            point1coords: point1,
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
    </setup>
    <graph>
      <lineSegment name="A" styleNumber="1" labelIsName endpoints="(0,0) (1,2)" />
      <lineSegment name="B" styleNumber="2" labelIsName endpoints="(2,2) (3,4)" />
      <lineSegment name="C" styleNumber="5" labelIsName endpoints="(4,4) (5,6)" />
    </graph>
    <p name="ADescription">Line segment A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                theme,
            });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("ADescription")]
                    .stateValues.text,
            ).eq(`Line segment A is thick ${AColor}.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BDescription")]
                    .stateValues.text,
            ).eq(`B is a ${BShade} red line segment.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CDescription")]
                    .stateValues.text,
            ).eq(`C is a thin ${CColor} line segment.`);
        }

        await test_items("light");
        await test_items("dark");
    });
});
