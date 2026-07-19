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

describe("LineSegment tag tests @group1", async () => {
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

    it("midpointOffset without midpoint preserves legacy one-endpoint behavior", async () => {
        const { core, resolvePathToNodeIdx } = await setupScene({
            lineProperties: `endpoints="$dp1" midpointOffset="1"`,
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
    <lineSegment name="l1" endpoints="A" />
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

// ---------------------------------------------------------------------------
// Helper: compute direction unit vector from slope.
// Matches LineSegment.js for finite slopes and ±Infinity, which are the cases these tests use.
// ---------------------------------------------------------------------------
function dirFromSlope(slope: number): [number, number] {
    if (slope === Infinity) return [0, 1];
    if (slope === -Infinity) return [0, -1];
    const theta = Math.atan(slope);
    return [Math.cos(theta), Math.sin(theta)];
}

function ep2FromEp1SlopeLength(
    ep1: number[],
    slope: number,
    L: number,
): number[] {
    const [dx, dy] = dirFromSlope(slope);
    return [ep1[0] + L * dx, ep1[1] + L * dy];
}

function lengthFromEndpoints(ep1: number[], ep2: number[]): number {
    const dx = ep2[0] - ep1[0];
    const dy = ep2[1] - ep1[1];
    return Math.hypot(dx, dy);
}

describe("LineSegment slope/length/midpoint/midpointOffset attribute tests @group5", async () => {
    // -----------------------------------------------------------------------
    // Case D: no endpoints, slope only
    // -----------------------------------------------------------------------
    it("slope only — basic geometry, drag endpoints, drag segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" slope="2" />
</graph>
<number name="slope">$l.slope</number>
<math name="midpoint">$l.midpoint</math>
<math name="len">$l.length</math>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");

        // Initial: ep1=(0,0), L=1 (essentialSignedLength default), slope=2
        let ep1 = [0, 0];
        let ep2 = ep2FromEp1SlopeLength(ep1, 2, 1);

        async function checkState(ep1: number[], ep2: number[]) {
            const sv = await core.returnAllStateVariables(false, true);
            const seg = sv[lIdx].stateValues;
            expect(seg.endpoints[0][0].evaluate_to_constant()).closeTo(
                ep1[0],
                1e-10,
            );
            expect(seg.endpoints[0][1].evaluate_to_constant()).closeTo(
                ep1[1],
                1e-10,
            );
            expect(seg.endpoints[1][0].evaluate_to_constant()).closeTo(
                ep2[0],
                1e-10,
            );
            expect(seg.endpoints[1][1].evaluate_to_constant()).closeTo(
                ep2[1],
                1e-10,
            );
            const expectedSlope = (ep2[1] - ep1[1]) / (ep2[0] - ep1[0]);
            if (Number.isFinite(expectedSlope)) {
                expect(seg.slope).closeTo(expectedSlope, 1e-10);
            } else {
                expect(seg.slope).eqls(expectedSlope);
            }
            const expectedLen = lengthFromEndpoints(ep1, ep2);
            expect(seg.length.evaluate_to_constant()).closeTo(
                expectedLen,
                1e-10,
            );
        }

        await checkState(ep1, ep2);

        // Drag ep1 via action — ep2 should stay fixed
        let newEp1 = [3, 1];
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: newEp1,
            core,
        });
        ep1 = newEp1;
        // ep2 unchanged (action keeps ep2 fixed)
        await checkState(ep1, ep2);

        // Drag ep2 via action — ep1 should stay fixed
        let newEp2 = [5, 4];
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: newEp2,
            core,
        });
        ep2 = newEp2;
        await checkState(ep1, ep2);

        // Drag whole segment
        let newEp1b = [-1, 2];
        let newEp2b = [2, -1];
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: newEp1b,
            point2coords: newEp2b,
            core,
        });
        await checkState(newEp1b, newEp2b);
    });

    // -----------------------------------------------------------------------
    // Case D: slope only — slope attribute propagates back when ep2 is dragged
    // -----------------------------------------------------------------------
    it("slope only — drag ep2 updates referenced slope number", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">2</number>
<graph name="g">
  <lineSegment name="l" slope="$m" />
</graph>
<number name="slopeOut">$l.slope</number>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mIdx = await resolvePathToNodeIdx("m");

        // Initial: ep1=(0,0), essentialSignedLength default=1, slope=2 → $m=2
        let sv = await core.returnAllStateVariables(false, true);
        let ep2Init = ep2FromEp1SlopeLength([0, 0], 2, 1);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(ep2Init[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(ep2Init[1], 1e-10);
        expect(sv[mIdx].stateValues.value).closeTo(2, 1e-10);

        // Drag ep2 to a new position; slope attr should update, so $m updates
        // ep1=(0,0), drag ep2 to (0,3) → vertical, slope=Infinity
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [0, 3],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(sv[mIdx].stateValues.value).eqls(Infinity);

        // Drag ep2 to (-2,0) → slope = 0/(−2) = 0, L is negative (going left)
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [-2, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 still at (0,0); ep2 at (-2,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(-2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        // slope of line is 0 (horizontal)
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case D: length only
    // -----------------------------------------------------------------------
    it("length only — basic geometry and drag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="L">3</number>
<graph name="g">
  <lineSegment name="l" length="$L" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const LIdx = await resolvePathToNodeIdx("L");

        // Initial: ep1=(0,0), slope essential default=0, length=3
        // ep2 = (3, 0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);

        // Drag ep2 — length attr should update, ep1 stays
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [0, 4],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        // length attr ($L) should now be ~4 (vertical going up, signed attr updated)
        expect(sv[LIdx].stateValues.value).closeTo(4, 1e-10);

        // ep1 should be unchanged
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);

        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [0, -4],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 still at (0,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(-4, 1e-10);
        expect(sv[LIdx].stateValues.value).closeTo(4, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case D: slope + length both specified
    // -----------------------------------------------------------------------
    it("slope and length both specified — basic geometry and drag", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">1</number>
<number name="L">2</number>
<graph name="g">
  <lineSegment name="l" slope="$m" length="$L" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mIdx = await resolvePathToNodeIdx("m");
        const LIdx = await resolvePathToNodeIdx("L");

        // slope=1, L=2: dir=(cos45°,sin45°)=1/√2 each, ep2=(√2, √2)
        const [dx, dy] = dirFromSlope(1);
        const expectedEp2 = [2 * dx, 2 * dy];

        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(expectedEp2[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(expectedEp2[1], 1e-10);

        // Drag ep2 to (3,0) — slope becomes 0, length becomes 3
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [3, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
        expect(sv[LIdx].stateValues.value).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);

        // Drag ep1 to (1,0) — ep2 stays at (3,0), slope/length update
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [1, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
        expect(sv[LIdx].stateValues.value).closeTo(2, 1e-10);
    });

    it("slope and length both specified keep public length Euclidean", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">0</number>
<number name="L">3</number>
<graph name="g">
  <lineSegment name="l" slope="$m" length="$L" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const LIdx = await resolvePathToNodeIdx("L");

        // Initial: ep1=(0,0), slope=0, length=3 → ep2=(3,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([3, 0]);
        expect(sv[LIdx].stateValues.value).closeTo(3, 1e-10);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            3,
            1e-10,
        );

        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [-2, 0],
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        expect(sv[LIdx].stateValues.value).closeTo(-2, 1e-10);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
    });

    it("vertical drag canonicalizes signed length onto the slope sign", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">Infinity</number>
<number name="L">-3</number>
<graph name="g">
  <lineSegment name="l" slope="$m" length="$L" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mIdx = await resolvePathToNodeIdx("m");
        const LIdx = await resolvePathToNodeIdx("L");

        // Initial: slope attr=Infinity (points up), length attr=-3 (flips it
        // down) → ep1=(0,0), ep2=(0,-3)
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[mIdx].stateValues.value).eqls(Infinity);
        expect(sv[LIdx].stateValues.value).closeTo(-3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, -3]);

        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [0, 1],
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        expect(sv[mIdx].stateValues.value).eqls(-Infinity);
        expect(sv[LIdx].stateValues.value).closeTo(4, 1e-10);
        // Vertical segment: both endpoints keep x=0
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(-3, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case D: dragging a referenced endpoint translates the whole segment
    // -----------------------------------------------------------------------
    it("slope only — drag referenced endpoint1 translates whole segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" slope="1" length="2" />
  <point extend="$l.endpoint1" name="p1" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const p1Idx = await resolvePathToNodeIdx("p1");

        // Initial ep1=(0,0), ep2 = 2*(cos45,sin45)
        const [dx0, dy0] = dirFromSlope(1);
        const initEp2 = [2 * dx0, 2 * dy0];

        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(initEp2[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(initEp2[1], 1e-10);
        expect(
            sv[p1Idx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([0, 0]);

        // Move p1 (referenced endpoint) — whole segment should translate
        await movePoint({ componentIdx: p1Idx, x: 3, y: 1, core });

        sv = await core.returnAllStateVariables(false, true);
        const delta = [3 - 0, 1 - 0];
        // ep1 should be at (3,1)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        // ep2 should have translated by the same delta
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(initEp2[0] + delta[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(initEp2[1] + delta[1], 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case B: 1 endpoint + slope
    // -----------------------------------------------------------------------
    it("one endpoint and slope", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="dp1">(2,3)</point>
<number name="m">0</number>
<graph name="g">
  <lineSegment name="l" endpoints="$dp1" slope="$m" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const dp1Idx = await resolvePathToNodeIdx("dp1");
        const mIdx = await resolvePathToNodeIdx("m");

        // ep1=(2,3), slope=0, default signedLength=1 → ep2=(3,3)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);

        // Drag ep2 via action — ep1 stays, slope attr ($m) updates
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [2, 6],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 unchanged
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        // ep2 at (2,6) → vertical → slope=Infinity
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(6, 1e-10);
        expect(sv[mIdx].stateValues.value).eqls(Infinity);

        // Drag ep1 via action — ep2 stays, dp1 updates
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [0, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 now (0,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        // ep2 still at (2,6)
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(6, 1e-10);
        // dp1 moves to (0,0)
        expect(sv[dp1Idx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        expect(sv[dp1Idx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
    });

    // -----------------------------------------------------------------------
    // Case B: dragging a referenced endpoint1 translates whole segment
    // -----------------------------------------------------------------------
    it("one endpoint and slope — drag referenced endpoint1 translates whole segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(1,2)" slope="1" length="3" />
  <point extend="$l.endpoint1" name="p1" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const p1Idx = await resolvePathToNodeIdx("p1");

        const [dx, dy] = dirFromSlope(1);
        const initEp1 = [1, 2];
        const initEp2 = [1 + 3 * dx, 2 + 3 * dy];

        // Initial: ep1=(1,2), ep2=(1+3cos45, 2+3sin45); p1 mirrors ep1
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls(initEp1);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(initEp2[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(initEp2[1], 1e-10);
        expect(
            sv[p1Idx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls(initEp1);

        // Move p1 (referenced endpoint) — whole segment translates
        await movePoint({ componentIdx: p1Idx, x: 4, y: 0, core });
        const delta = [4 - initEp1[0], 0 - initEp1[1]];

        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(initEp2[0] + delta[0], 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(initEp2[1] + delta[1], 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case A: 1 endpoint + 1 midpoint → the midpoint point is the segment's
    // midpoint (with default midpointOffset=0), so ep2 = 2*midpoint - ep1.
    // -----------------------------------------------------------------------
    it("one endpoint and midpoint — midpoint is the segment's midpoint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="dp1">(1,2)</point>
<point name="T">(4,6)</point>
<graph name="g">
  <lineSegment name="l" endpoints="$dp1" midpoint="$T" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const dp1Idx = await resolvePathToNodeIdx("dp1");
        const TIdx = await resolvePathToNodeIdx("T");

        // ep1=(1,2), midpoint=(4,6) → ep2 = 2*(4,6) - (1,2) = (7,10)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(10, 1e-10);
        // midpoint property equals the input midpoint point here (midpointOffset=0)
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            6,
            1e-10,
        );

        // Drag ep2 via action — ep1 stays fixed, midpoint tracks the new midpoint
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [7, 1],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        // midpoint = ((1,2)+(7,1))/2 = (4, 1.5)
        expect(sv[TIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        expect(sv[TIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            1.5,
            1e-10,
        );

        // Drag ep1 via action — ep2 stays fixed, dp1 and midpoint update
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [-1, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 now (-1,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(sv[dp1Idx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            -1,
            1e-10,
        );
        expect(sv[dp1Idx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        // midpoint = ((-1,0)+(7,1))/2 = (3, 0.5)
        expect(sv[TIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            3,
            1e-10,
        );
        expect(sv[TIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            0.5,
            1e-10,
        );
    });

    it("one endpoint and midpoint keeps length Euclidean (length attr ignored)", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="L" prefill="5" />
<point name="dp1">(1,2)</point>
<point name="T">(4,6)</point>
<graph name="g">
  <lineSegment name="l" endpoints="$dp1" midpoint="$T" length="$L" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const LIdx = await resolvePathToNodeIdx("L");

        // ep1=(1,2), ep2=2*(4,6)-(1,2)=(7,10); Euclidean length = |(6,8)| = 10.
        // The length attr (5) is ignored.
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            10,
            1e-10,
        );

        await updateMathInputValue({
            componentIdx: LIdx,
            latex: "100",
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            10,
            1e-10,
        );
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(10, 1e-10);
    });

    it("one endpoint and midpoint respects midpointOffset (Case A)", async () => {
        // With ep1=(1,2) and midpoint M=(2,3):
        //   midpointOffset=0 (default): M is the midpoint → ep2 = 2M - ep1 = (3,4)
        //   midpointOffset=1: M is the second endpoint → ep2 = M = (2,3)
        //   midpointOffset=-1: M coincides with ep1 → ep2 undefined
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="mid" endpoints="(1,2)" midpoint="(2,3)" />
  <lineSegment name="asEp2" endpoints="(1,2)" midpoint="(2,3)" midpointOffset="1" />
  <lineSegment name="undef" endpoints="(1,2)" midpoint="(2,3)" midpointOffset="-1" />
</graph>
`,
        });

        const sv = await core.returnAllStateVariables(false, true);

        // Default midpointOffset=0: endpoints (1,2) and (3,4), midpoint (2,3)
        const midIdx = await resolvePathToNodeIdx("mid");
        expect(
            sv[midIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 2]);
        expect(
            sv[midIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([3, 4]);
        expect(
            sv[midIdx].stateValues.midpoint.map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, 3]);

        // midpointOffset=1: midpoint acts as the second endpoint (old behavior)
        const asEp2Idx = await resolvePathToNodeIdx("asEp2");
        expect(
            sv[asEp2Idx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 2]);
        expect(
            sv[asEp2Idx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, 3]);

        // midpointOffset=-1: midpoint pins ep1, so ep2 is undefined (NaN)
        const undefIdx = await resolvePathToNodeIdx("undef");
        expect(
            sv[undefIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 2]);
        expect(
            Number.isNaN(
                sv[undefIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
            ),
        ).eq(true);
        expect(
            Number.isNaN(
                sv[undefIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
            ),
        ).eq(true);
    });

    it("one endpoint and midpoint, midpointOffset=-1 — referenced ep1 is still draggable", async () => {
        // Regression: with midpointOffset=-1 (Case A, tT=0) the specified
        // midpoint sits on ep1 and ep2 is undefined. The inverse used to bail
        // with success:false for every drag, freezing the (perfectly defined)
        // first endpoint. Dragging ep1 alone has a well-defined inverse: just
        // move ep1, leaving ep2 undefined and the specified midpoint untouched.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="ls" endpoints="(-3,1)" midpoint="(5,3)" midpointOffset="$off" />
  <point extend="$ls.endpoint1" name="p1" />
</graph>
<mathInput name="off" prefill="-1" />
`,
        });

        const lsIdx = await resolvePathToNodeIdx("ls");
        const p1Idx = await resolvePathToNodeIdx("p1");
        const offIdx = await resolvePathToNodeIdx("off");

        // Initial: ep1=(-3,1), ep2 undefined.
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lsIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-3, 1]);
        expect(
            Number.isNaN(
                sv[lsIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
            ),
        ).eq(true);
        expect(
            Number.isNaN(
                sv[lsIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
            ),
        ).eq(true);
        expect(
            sv[p1Idx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([-3, 1]);

        // Drag the referenced first endpoint to (2,-4).
        await movePoint({ componentIdx: p1Idx, x: 2, y: -4, core });

        sv = await core.returnAllStateVariables(false, true);
        // ep1 moved; ep2 remains undefined.
        expect(
            sv[lsIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, -4]);
        expect(
            Number.isNaN(
                sv[lsIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
            ),
        ).eq(true);
        expect(
            Number.isNaN(
                sv[lsIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
            ),
        ).eq(true);
        expect(
            sv[p1Idx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([2, -4]);

        // The specified midpoint was left untouched at (5,3): flipping
        // midpointOffset to 0 makes M the true midpoint, so
        // ep2 = 2M - ep1 = 2*(5,3) - (2,-4) = (8,10).
        await updateMathInputValue({
            latex: "0",
            componentIdx: offIdx,
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        // ep1 unchanged at (2,-4); ep2 now defined
        expect(
            sv[lsIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, -4]);
        expect(
            sv[lsIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([8, 10]);
    });

    // -----------------------------------------------------------------------
    // Case C: 0 endpoints + 1 midpoint, slope, length, midpointOffset=0 (midpoint)
    // -----------------------------------------------------------------------
    it("midpoint with slope/length — segment centered on midpoint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,3)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="0" length="4" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const TIdx = await resolvePathToNodeIdx("T");

        // slope=0 (horizontal), L=4, po=0 (default=midpoint)
        // ep1 = T - 2*(1,0) = (0,3), ep2 = T + 2*(1,0) = (4,3)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);

        // Drag ep2 via action — T moves, slope/length update; ep1 stays
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [4, 7],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        // T moved to new t=0.5 position: midpoint of [(0,3),(4,7)] = (2,5)
        expect(sv[TIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[TIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            5,
            1e-10,
        );
    });

    it("midpoint alone uses default slope/length and updates them when dragging ep2", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,3)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" />
</graph>
<number name="m">$l.slope</number>
<math name="L">$l.length</math>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const TIdx = await resolvePathToNodeIdx("T");
        const mIdx = await resolvePathToNodeIdx("m");
        const LIdx = await resolvePathToNodeIdx("L");

        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1.5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2.5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
        expect(sv[LIdx].stateValues.value.evaluate_to_constant()).closeTo(
            1,
            1e-10,
        );

        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [2.5, 4],
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1.5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2.5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(sv[TIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[TIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            3.5,
            1e-10,
        );
        expect(sv[mIdx].stateValues.value).closeTo(1, 1e-10);
        expect(sv[LIdx].stateValues.value.evaluate_to_constant()).closeTo(
            Math.sqrt(2),
            1e-10,
        );
    });

    // -----------------------------------------------------------------------
    // Case C: midpointOffset = -1 (midpoint is ep1)
    // -----------------------------------------------------------------------
    it("midpoint with midpointOffset=-1 — midpoint is ep1", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" midpoint="(1,2)" slope="0" length="3" midpointOffset="-1" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");

        // po=-1: ep1=T=(1,2), ep2=T+3*(1,0)=(4,2)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case C: midpointOffset = 1 (midpoint is ep2)
    // -----------------------------------------------------------------------
    it("midpoint with midpointOffset=1 — midpoint is ep2", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" midpoint="(4,2)" slope="0" length="3" midpointOffset="1" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");

        // po=1: ep2=T=(4,2), ep1=T-3*(1,0)=(1,2)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
    });

    it("midpoint clamps midpointOffset to [-1,1]", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l1" midpoint="(1,2)" slope="0" length="3" midpointOffset="-2" />
  <lineSegment name="l2" midpoint="(4,2)" slope="0" length="3" midpointOffset="2" />
</graph>
`,
        });

        const l1Idx = await resolvePathToNodeIdx("l1");
        const l2Idx = await resolvePathToNodeIdx("l2");

        const sv = await core.returnAllStateVariables(false, true);

        expect(
            sv[l1Idx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[l1Idx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[l1Idx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[l1Idx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);

        expect(
            sv[l2Idx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[l2Idx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[l2Idx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[l2Idx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case C: dragging referenced endpoint translates whole segment
    // -----------------------------------------------------------------------
    it("midpoint — drag referenced endpoint translates whole segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,0)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="0" length="4" />
  <point extend="$l.endpoint1" name="p1" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const p1Idx = await resolvePathToNodeIdx("p1");
        const TIdx = await resolvePathToNodeIdx("T");

        // Initial: po=0, slope=0, L=4, T=(2,0)
        // ep1=(0,0), ep2=(4,0), T=(2,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);

        // Drag p1 (referenced ep1) to (2,0) — whole segment translates by (2,0)
        await movePoint({ componentIdx: p1Idx, x: 2, y: 0, core });

        sv = await core.returnAllStateVariables(false, true);
        // ep1 at (2,0), ep2 at (6,0), T at (4,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(6, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(sv[TIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        expect(sv[TIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
    });

    it("midpoint — drag referenced endpoint2 updates midpoint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">0</number>
<number name="L">4</number>
<point name="T">(0,0)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="$m" length="$L" />
  <point extend="$l.endpoint2" name="p2" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mIdx = await resolvePathToNodeIdx("m");
        const lNumberIdx = await resolvePathToNodeIdx("L");
        const p2Idx = await resolvePathToNodeIdx("p2");
        const tIdx = await resolvePathToNodeIdx("T");

        // Initial: T=(0,0), slope=0, length=4 → ep1=(-2,0), ep2=(2,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-2, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([2, 0]);
        expect(
            sv[p2Idx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([2, 0]);
        expect(
            sv[tIdx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([0, 0]);
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
        expect(sv[lNumberIdx].stateValues.value).closeTo(4, 1e-10);

        await movePoint({ componentIdx: p2Idx, x: 0, y: 2, core });

        sv = await core.returnAllStateVariables(false, true);

        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(sv[tIdx].stateValues.xs[0].evaluate_to_constant()).closeTo(
            -1,
            1e-10,
        );
        expect(sv[tIdx].stateValues.xs[1].evaluate_to_constant()).closeTo(
            1,
            1e-10,
        );
        expect(sv[mIdx].stateValues.value).closeTo(1, 1e-10);
        expect(sv[lNumberIdx].stateValues.value).closeTo(
            2 * Math.sqrt(2),
            1e-10,
        );
    });

    // -----------------------------------------------------------------------
    // Case C: midpoint — drag midpoint directly moves whole segment
    // -----------------------------------------------------------------------
    it("midpoint — drag midpoint moves whole segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,0)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="0" length="4" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const TIdx = await resolvePathToNodeIdx("T");

        // Initial: T=(2,0), slope=0, length=4 → ep1=(0,0), ep2=(4,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 0]);
        expect(
            sv[TIdx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([2, 0]);

        await movePoint({ componentIdx: TIdx, x: 5, y: 3, core });

        sv = await core.returnAllStateVariables(false, true);
        // T moves to (5,3); ep1=T-(1+0)/2*4*(1,0)=(5-2,3)=(3,3), ep2=(7,3)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Case C: slope attr updates when dragging endpoint via action (full 360°)
    // -----------------------------------------------------------------------
    it("midpoint — full 360° rotation by dragging ep2", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">0</number>
<graph name="g">
  <lineSegment name="l" midpoint="(0,0)" slope="$m" length="4" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mIdx = await resolvePathToNodeIdx("m");

        // slope=0, po=0, L=4: ep1=(-2,0), ep2=(2,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);

        // Drag ep2 to (0,2) — slope should go to Infinity (pointing up)
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [0, 2],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 stays at (-2,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);

        // Drag ep2 to (-2, -2) — ep2 is now to the left and below ep1(-2,0)...
        // This means ep2 is "left" of the horizontal: slope = -2/(-2 - -2) → vertical
        // Actually let's drag ep2 to (-3, 0) — ep2 is to the left, slope=0, L negative
        await moveLineSegment({
            componentIdx: lIdx,
            point2coords: [-3, 0],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        // ep1 stays at (-2,0)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(-3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(sv[mIdx].stateValues.value).closeTo(0, 1e-10);
    });

    // -----------------------------------------------------------------------
    // midpoint state variable
    // -----------------------------------------------------------------------
    it("midpoint property is the actual midpoint, differing from the midpoint attribute when midpointOffset is nonzero", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <point name="P">(0,0)</point>
  <lineSegment name="l" midpoint="$P" slope="0" length="4" midpointOffset="0.5" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const sv = await core.returnAllStateVariables(false, true);

        // po=0.5, L=4, horizontal: the input point P=(0,0) sits 3/4 of the way
        // along the segment, giving endpoints (-3,0) and (1,0).
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-3, 0]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([1, 0]);
        // The midpoint property is the actual midpoint (-1,0), not the input
        // point (0,0) given by the midpoint attribute.
        expect(
            sv[lIdx].stateValues.midpoint.map((v) => v.evaluate_to_constant()),
        ).eqls([-1, 0]);
    });

    it("midpoint state variable and inverse", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(1,2) (5,4)" />
</graph>
<math name="cx">$l.midpoint.x</math>
<math name="cy">$l.midpoint.y</math>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const cxIdx = await resolvePathToNodeIdx("cx");
        const cyIdx = await resolvePathToNodeIdx("cy");

        // midpoint of (1,2)-(5,4) = (3,3)
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[cxIdx].stateValues.value.evaluate_to_constant()).closeTo(
            3,
            1e-10,
        );
        expect(sv[cyIdx].stateValues.value.evaluate_to_constant()).closeTo(
            3,
            1e-10,
        );

        // The midpoint state variable is derived from endpoints — just verify
        // it updates when the segment moves
        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [0, 0],
            point2coords: [4, 2],
            core,
        });
        sv = await core.returnAllStateVariables(false, true);
        expect(sv[cxIdx].stateValues.value.evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[cyIdx].stateValues.value.evaluate_to_constant()).closeTo(
            1,
            1e-10,
        );
    });

    it("dragging a point referenced from the midpoint property translates the segment in every direction", async () => {
        // Regression: a point bound to $l.midpoint receives its coordinates
        // through separate math components, so the midpoint state-variable
        // inverse is invoked once per dimension. It must translate only the
        // supplied dimension; recomputing the other from the stale current
        // midpoint used to revert it, freezing vertical drags (Case A).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(1,2)" midpoint="(2,3)" />
  <point name="mp">$l.midpoint</point>
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const mpIdx = await resolvePathToNodeIdx("mp");

        async function checkSegment(ep1: number[], ep2: number[]) {
            const sv = await core.returnAllStateVariables(false, true);
            const eps = sv[lIdx].stateValues.endpoints;
            expect(eps[0][0].evaluate_to_constant()).closeTo(ep1[0], 1e-10);
            expect(eps[0][1].evaluate_to_constant()).closeTo(ep1[1], 1e-10);
            expect(eps[1][0].evaluate_to_constant()).closeTo(ep2[0], 1e-10);
            expect(eps[1][1].evaluate_to_constant()).closeTo(ep2[1], 1e-10);
            const mid = sv[lIdx].stateValues.midpoint;
            expect(mid[0].evaluate_to_constant()).closeTo(
                (ep1[0] + ep2[0]) / 2,
                1e-10,
            );
            expect(mid[1].evaluate_to_constant()).closeTo(
                (ep1[1] + ep2[1]) / 2,
                1e-10,
            );
        }

        // endpoints (1,2),(3,4); midpoint (2,3)
        await checkSegment([1, 2], [3, 4]);

        // Drag the midpoint horizontally: (2,3) -> (5,3)
        await movePoint({ componentIdx: mpIdx, x: 5, y: 3, core });
        await checkSegment([4, 2], [6, 4]);

        // Drag vertically: (5,3) -> (5,7) (used to be frozen)
        await movePoint({ componentIdx: mpIdx, x: 5, y: 7, core });
        await checkSegment([4, 6], [6, 8]);

        // Drag diagonally: (5,7) -> (0,0)
        await movePoint({ componentIdx: mpIdx, x: 0, y: 0, core });
        await checkSegment([-1, -1], [1, 1]);
    });

    it("midpoint state variable stays symbolic and supports inverse updates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="a" prefill="q" />
<graph name="g">
  <lineSegment name="l" endpoints="($a,0) (2,0)" />
</graph>
<math name="cx">$l.midpoint.x</math>
<mathInput name="mi">$l.midpoint.x</mathInput>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const cxIdx = await resolvePathToNodeIdx("cx");
        const miIdx = await resolvePathToNodeIdx("mi");

        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[cxIdx].stateValues.value.tree).not.eq("\uff3f");

        await updateMathInputValue({ latex: "5", componentIdx: miIdx, core });

        sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.midpoint[0].simplify().tree).eq(5);
        expect(sv[lIdx].stateValues.midpoint[1].simplify().tree).eq(0);
    });

    // -----------------------------------------------------------------------
    // slope inverse
    // -----------------------------------------------------------------------
    it("slope, midpoint, and length state variables return correct initial values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(0,0) (4,0)" />
</graph>
<number name="s">$l.slope</number>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const sIdx = await resolvePathToNodeIdx("s");

        // slope=0, midpoint=(2,0), length=4 — verify initial state
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[sIdx].stateValues.value).closeTo(0, 1e-10);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
    });

    // -----------------------------------------------------------------------
    // slope inverse via mathInput — keeps midpoint and length, rotates direction
    // -----------------------------------------------------------------------
    it("slope inverse via mathInput — rotates segment around midpoint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(0,0) (4,0)" />
</graph>
<mathInput name="mi">$l.slope</mathInput>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const miIdx = await resolvePathToNodeIdx("mi");

        // Initial: midpoint=(2,0), length=4, slope=0
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.slope).closeTo(0, 1e-10);
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );

        // Set slope to 1 via mathInput — should rotate around midpoint (2,0), keep length 4
        await updateMathInputValue({ latex: "1", componentIdx: miIdx, core });
        sv = await core.returnAllStateVariables(false, true);

        const expectedSlope = 1;
        expect(sv[lIdx].stateValues.slope).closeTo(expectedSlope, 1e-10);
        // Center should stay at (2,0)
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        // Length should stay at 4
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        // Verify endpoints are symmetric around midpoint
        const theta = Math.atan(1);
        const [dx, dy] = [Math.cos(theta), Math.sin(theta)];
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(2 - 2 * dx, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0 - 2 * dy, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(2 + 2 * dx, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0 + 2 * dy, 1e-10);
    });

    // -----------------------------------------------------------------------
    // length inverse via mathInput — keeps midpoint and direction, changes length
    // -----------------------------------------------------------------------
    it("length inverse via mathInput — scales segment around midpoint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(0,0) (4,0)" />
</graph>
<mathInput name="mi">$l.length</mathInput>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const miIdx = await resolvePathToNodeIdx("mi");

        // Initial: midpoint=(2,0), length=4, slope=0
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );

        // Set length to 6 — midpoint stays at (2,0), direction unchanged, ep1=(-1,0), ep2=(5,0)
        await updateMathInputValue({ latex: "6", componentIdx: miIdx, core });
        sv = await core.returnAllStateVariables(false, true);

        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            6,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(-1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
    });

    // -----------------------------------------------------------------------
    // midpoint inverse via mathInput — translates segment
    // -----------------------------------------------------------------------
    it("midpoint inverse via mathInput — translates segment", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" endpoints="(0,0) (4,0)" />
</graph>
<mathInput name="mi">$l.midpoint.x</mathInput>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const miIdx = await resolvePathToNodeIdx("mi");

        // Initial: midpoint=(2,0), ep1=(0,0), ep2=(4,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            2,
            1e-10,
        );

        // Set midpoint x to 5 → translate by 3: ep1=(3,0), ep2=(7,0)
        await updateMathInputValue({ latex: "5", componentIdx: miIdx, core });
        sv = await core.returnAllStateVariables(false, true);

        expect(sv[lIdx].stateValues.midpoint[0].evaluate_to_constant()).closeTo(
            5,
            1e-10,
        );
        expect(sv[lIdx].stateValues.midpoint[1].evaluate_to_constant()).closeTo(
            0,
            1e-10,
        );
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        // Length and slope unchanged
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        expect(sv[lIdx].stateValues.slope).closeTo(0, 1e-10);
    });

    // -----------------------------------------------------------------------
    // slope inverse works with basedOnSlopeOrMidpoint (Case D)
    // -----------------------------------------------------------------------
    it("slope inverse via mathInput — works when slope attr present", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<number name="m">0</number>
<graph name="g">
  <lineSegment name="l" slope="$m" length="4" />
</graph>
<mathInput name="mi">$l.slope</mathInput>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const miIdx = await resolvePathToNodeIdx("mi");
        const mIdx = await resolvePathToNodeIdx("m");

        // Initial: slope=0, length=4, ep1=(0,0), ep2=(4,0)
        let sv = await core.returnAllStateVariables(false, true);
        expect(sv[lIdx].stateValues.slope).closeTo(0, 1e-10);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );

        // Change slope to 1 via mathInput
        await updateMathInputValue({ latex: "1", componentIdx: miIdx, core });
        sv = await core.returnAllStateVariables(false, true);

        // Slope should update to 1; midpoint and length preserved
        expect(sv[lIdx].stateValues.slope).closeTo(1, 1e-10);
        expect(sv[lIdx].stateValues.length.evaluate_to_constant()).closeTo(
            4,
            1e-10,
        );
        const theta = Math.atan(1);
        const [dx, dy] = [Math.cos(theta), Math.sin(theta)];
        const cx = sv[lIdx].stateValues.midpoint[0].evaluate_to_constant();
        const cy = sv[lIdx].stateValues.midpoint[1].evaluate_to_constant();
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(cx - 2 * dx, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(cy - 2 * dy, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(cx + 2 * dx, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(cy + 2 * dy, 1e-10);
    });

    // -----------------------------------------------------------------------
    // Backward compatibility: no new attrs → same default (1,0)-(0,0)
    // -----------------------------------------------------------------------
    it("no new attrs — preserves old default (1,0)-(0,0)", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <lineSegment name="l" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(0, 1e-10);
    });

    it("3D slope parameterization uses the x-y plane and preserves higher coordinates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P">(1,2,3)</point>
<point name="T">(2,3,4)</point>
<graph name="g">
  <lineSegment name="caseB" endpoints="$P" slope="1" length="2" />
  <lineSegment name="caseC" midpoint="$T" slope="1" length="2" />
</graph>
`,
        });

        const caseBIdx = await resolvePathToNodeIdx("caseB");
        const caseCIdx = await resolvePathToNodeIdx("caseC");
        const sv = await core.returnAllStateVariables(false, true);
        const planarDelta = Math.sqrt(2);

        expect(sv[caseBIdx].stateValues.numDimensions).eq(3);
        expect(sv[caseBIdx].stateValues.basedOnSlopeOrMidpoint).eq(true);
        expect(sv[caseBIdx].stateValues.slope).eqls(NaN);
        expect(
            sv[caseBIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(1 + planarDelta, 1e-10);
        expect(
            sv[caseBIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(2 + planarDelta, 1e-10);
        expect(
            sv[caseBIdx].stateValues.endpoints[1][2].evaluate_to_constant(),
        ).closeTo(3, 1e-10);

        expect(sv[caseCIdx].stateValues.numDimensions).eq(3);
        expect(sv[caseCIdx].stateValues.basedOnSlopeOrMidpoint).eq(true);
        expect(sv[caseCIdx].stateValues.slope).eqls(NaN);
        expect(
            sv[caseCIdx].stateValues.endpoints[0][2].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
        expect(
            sv[caseCIdx].stateValues.endpoints[1][2].evaluate_to_constant(),
        ).closeTo(4, 1e-10);
    });

    it("moving the midpoint in 3D updates the segment in every dimension", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,3,4)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="0" length="4" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const tIdx = await resolvePathToNodeIdx("T");

        // Initial: T=(2,3,4), slope=0, length=4 → ep1=(0,3,4), ep2=(4,3,4)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 3, 4]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 3, 4]);
        expect(sv[tIdx].stateValues.xs.map((v) => v.tree)).eqls([2, 3, 4]);

        await movePoint({
            componentIdx: tIdx,
            x: 3,
            y: 5,
            z: 6,
            core,
        });

        sv = await core.returnAllStateVariables(false, true);

        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][2].evaluate_to_constant(),
        ).closeTo(6, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(5, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][2].evaluate_to_constant(),
        ).closeTo(6, 1e-10);
        expect(sv[tIdx].stateValues.xs.map((v) => v.tree)).eqls([3, 5, 6]);
    });

    it("moveLineSegment action in 3D updates every coordinate", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="T">(2,3,4)</point>
<graph name="g">
  <lineSegment name="l" midpoint="$T" slope="0" length="4" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const tIdx = await resolvePathToNodeIdx("T");

        // Initial: T=(2,3,4), slope=0, length=4 → ep1=(0,3,4), ep2=(4,3,4)
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 3, 4]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 3, 4]);
        expect(
            sv[tIdx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([2, 3, 4]);

        await moveLineSegment({
            componentIdx: lIdx,
            point1coords: [0, 1, 7],
            point2coords: [4, 1, 7],
            core,
        });

        sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[lIdx].stateValues.endpoints[0].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([0, 1, 7]);
        expect(
            sv[lIdx].stateValues.endpoints[1].map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 1, 7]);
        expect(
            sv[tIdx].stateValues.xs.map((v) => v.evaluate_to_constant()),
        ).eqls([2, 1, 7]);
    });

    it("moveLineSegment action in 3D preserves compensation after a constraint", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph name="g">
  <point name="P">(4,6,10)<constrainToGrid dx="2" dy="3" dz="5" /></point>
  <point name="Q">(-4,-1,1)</point>
  <lineSegment name="l" endpoints="$P $Q" />
</graph>
`,
        });

        // Initial: P snaps to grid at (4,6,10), Q=(-4,-1,1); endpoints follow
        let sv = await core.returnAllStateVariables(false, true);
        expect(
            sv[await resolvePathToNodeIdx("P")].stateValues.xs.map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 6, 10]);
        expect(
            sv[await resolvePathToNodeIdx("Q")].stateValues.xs.map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-4, -1, 1]);
        expect(
            sv[await resolvePathToNodeIdx("l")].stateValues.endpoints[0].map(
                (v) => v.evaluate_to_constant(),
            ),
        ).eqls([4, 6, 10]);
        expect(
            sv[await resolvePathToNodeIdx("l")].stateValues.endpoints[1].map(
                (v) => v.evaluate_to_constant(),
            ),
        ).eqls([-4, -1, 1]);

        await moveLineSegment({
            componentIdx: await resolvePathToNodeIdx("l"),
            point1coords: [4.5, 2, 14],
            point2coords: [-3.5, -5, 5],
            core,
        });

        sv = await core.returnAllStateVariables(false, true);

        expect(
            sv[await resolvePathToNodeIdx("P")].stateValues.xs.map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([4, 3, 15]);
        expect(
            sv[await resolvePathToNodeIdx("Q")].stateValues.xs.map((v) =>
                v.evaluate_to_constant(),
            ),
        ).eqls([-4, -4, 6]);
        expect(
            sv[await resolvePathToNodeIdx("l")].stateValues.endpoints[0].map(
                (v) => v.evaluate_to_constant(),
            ),
        ).eqls([4, 3, 15]);
        expect(
            sv[await resolvePathToNodeIdx("l")].stateValues.endpoints[1].map(
                (v) => v.evaluate_to_constant(),
            ),
        ).eqls([-4, -4, 6]);
    });

    it("Case A (1 endpoint + 1 midpoint) works in 3D", async () => {
        // The midpoint parameterization is dimension-agnostic:
        // ep2 = 2*midpoint - ep1 in every coordinate (default midpointOffset=0).
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<point name="P">(1,2,3)</point>
<point name="T">(4,5,6)</point>
<graph name="g">
  <lineSegment name="l" endpoints="$P" midpoint="$T" />
</graph>
`,
        });

        const lIdx = await resolvePathToNodeIdx("l");
        const sv = await core.returnAllStateVariables(false, true);

        expect(sv[lIdx].stateValues.numDimensions).eq(3);
        expect(sv[lIdx].stateValues.basedOnSlopeOrMidpoint).eq(true);
        // ep1 = P = (1,2,3), ep2 = 2*(4,5,6) - (1,2,3) = (7,8,9)
        expect(
            sv[lIdx].stateValues.endpoints[0][0].evaluate_to_constant(),
        ).closeTo(1, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][1].evaluate_to_constant(),
        ).closeTo(2, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[0][2].evaluate_to_constant(),
        ).closeTo(3, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][0].evaluate_to_constant(),
        ).closeTo(7, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][1].evaluate_to_constant(),
        ).closeTo(8, 1e-10);
        expect(
            sv[lIdx].stateValues.endpoints[1][2].evaluate_to_constant(),
        ).closeTo(9, 1e-10);
        // midpoint property = (4,5,6)
        expect(sv[lIdx].stateValues.midpoint[2].evaluate_to_constant()).closeTo(
            6,
            1e-10,
        );
    });
});

describe("LineSegment info diagnostics @group5", async () => {
    // -----------------------------------------------------------------------
    // midpointOffset without midpoint → info diagnostic
    // -----------------------------------------------------------------------
    it("midpointOffset without midpoint emits info diagnostic", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" midpointOffset="1" />
</graph>
`,
        });

        const { getDiagnosticsByType } = await import("../utils/diagnostics");
        const d = getDiagnosticsByType(core);
        expect(d.errors.length).eq(0);
        expect(d.infos.length).eq(1);
        expect(d.infos[0].message).contain("midpointOffset");
        expect(d.infos[0].message).contain("without a midpoint");
    });

    // -----------------------------------------------------------------------
    // slope/length/midpoint/midpointOffset ignored when two endpoints given
    // -----------------------------------------------------------------------
    it("slope and length ignored when two endpoints specified — emits info diagnostic", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
</graph>
`,
        });

        const { getDiagnosticsByType } = await import("../utils/diagnostics");
        const d = getDiagnosticsByType(core);
        expect(d.errors.length).eq(0);
        expect(d.infos.length).eq(1);
        expect(d.infos[0].message).contain("slope");
        expect(d.infos[0].message).contain("length");
        expect(d.infos[0].message).contain("two endpoints");
    });

    // -----------------------------------------------------------------------
    // slope/length ignored when endpoint + midpoint given (Case A). Note that
    // midpointOffset is NOT ignored — it sets where the midpoint sits.
    // -----------------------------------------------------------------------
    it("slope and length ignored when one endpoint and midpoint given — emits info diagnostic", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2)" midpoint="(4,5)" slope="2" length="3" midpointOffset="0.5" />
</graph>
`,
        });

        const { getDiagnosticsByType } = await import("../utils/diagnostics");
        const d = getDiagnosticsByType(core);
        expect(d.errors.length).eq(0);
        expect(d.infos.length).eq(1);
        expect(d.infos[0].message).contain("slope");
        expect(d.infos[0].message).contain("length");
        expect(d.infos[0].message).contain("endpoint and a midpoint");
        // midpointOffset is used in Case A, so it must not be reported as ignored
        expect(d.infos[0].message).not.contain("midpointOffset");
    });

    // -----------------------------------------------------------------------
    // No diagnostic when slope/midpoint used correctly
    // -----------------------------------------------------------------------
    it("no info diagnostic when slope and midpoint used without endpoints", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" midpoint="(2,0)" slope="0" length="4" />
</graph>
`,
        });

        const { getDiagnosticsByType } = await import("../utils/diagnostics");
        const d = getDiagnosticsByType(core);
        expect(d.errors.length).eq(0);
        expect(d.infos.length).eq(0);
    });
});
