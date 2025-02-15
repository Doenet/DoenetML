import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    moveLineSegment,
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import Core from "../../Core";
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
    let core = await createTestCore({
        doenetML:
            `
  <graph>
    <lineSegment name="l" ` +
            lineProperties +
            `>
    ` +
            lineChildren +
            `
    </lineSegment>
    $l.endpoints{assignNames="P1 P2"}
  </graph>

   ` +
            additionalComponents +
            `
  <graph name="g2" newNamespace>
    $(../l{name="l"})
    $l.endpoints{assignNames="P1 P2"}
  </graph>
  
  $g2{name="g3"}
  `,
    });

    return core;
}

async function runPointBasedTests({
    core,
    points,
    definingPointNames = [],
    label,
}: {
    core: Core;
    points: number[][];
    definingPointNames?: string[];
    label?: string;
}) {
    let names = [
        ["/l", "/P1", "/P2"],
        ["/g2/l", "/g2/P1", "/g2/P2"],
        ["/g3/l", "/g3/P1", "/g3/P2"],
    ];

    await checkAllLineValues({
        names,
        points,
        definingPointNames,
        label,
        core,
    });

    let point1Names = names.map((v) => v[1]);
    if (definingPointNames.length > 0) {
        point1Names.push(definingPointNames[0]);
    }

    let point2Names = names.map((v) => v[2]);
    if (definingPointNames.length > 1) {
        point2Names.push(definingPointNames[1]);
    }

    for (let ind = 0; ind < 7; ind++) {
        // move point 1
        let P1Name = point1Names[ind % point1Names.length];
        let dx = 4 * ind - 3 - points[0][0];
        let dy = 10 - 3 * ind - points[0][1];
        points[0][0] += dx;
        points[0][1] += dy;
        await movePoint({
            name: P1Name,
            x: points[0][0],
            y: points[0][1],
            core,
        });
        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            core,
        });

        // move point2
        let P2Name = point2Names[ind % point2Names.length];
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
            name: P2Name,
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            core,
        });
    }

    // move line segment
    for (let [ind, nameObj] of names.entries()) {
        let lName = nameObj[0];

        points[0] = [ind ** 2, 16 - Math.sqrt(ind)];
        points[1] = [Math.log(ind + 1) - 1, 2 ** ind - 3];
        await moveLineSegment({
            name: lName,
            point1coords: points[0],
            point2coords: points[1],
            core,
        });

        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            core,
        });
    }
}

async function checkAllLineValues({
    names,
    points,
    definingPointNames = [],
    label,
    core,
}: {
    names: string[][];
    points: number[][];
    definingPointNames?: string[];
    label?: string;
    core: Core;
}) {
    let slope = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0]);

    for (let nameObj of names) {
        await checkLineValues({
            name: nameObj[0],
            P1Name: nameObj[1],
            P2Name: nameObj[2],
            points,
            slope,
            label,
            core,
        });
    }

    const stateVariables = await returnAllStateVariables(core);
    for (let [ind, pointName] of definingPointNames.entries()) {
        expect(
            stateVariables[pointName].stateValues.xs.map((v) => v.tree),
        ).eqls(points[ind]);
    }
}

async function checkLineValues({
    name,
    P1Name,
    P2Name,
    points,
    label,
    slope,
    core,
}: {
    name: string;
    P1Name: string;
    P2Name: string;
    points: number[][];
    slope: number;
    label?: string;
    core: Core;
}) {
    const stateVariables = await returnAllStateVariables(core);

    let linePoints = stateVariables[name].stateValues.endpoints;
    let P1xs = stateVariables[P1Name].stateValues.xs;
    let P2xs = stateVariables[P2Name].stateValues.xs;
    let lineSlope = stateVariables[name].stateValues.slope;

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
        expect(stateVariables[name].stateValues.label).eq(label);
    }
}

describe("LineSegment tag tests", async () => {
    it("lineSegment with no arguments", async () => {
        let core = await setupScene({});

        let points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, points });
    });

    it("lineSegment with empty endpoints", async () => {
        let core = await setupScene({ lineProperties: `endpoints=""` });

        let points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, points });
    });

    it("string endpoints, label child", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="(1,2) (4,7)"`,
            lineChildren: `<label>l</label>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "l" });
    });

    it("endpoints from strings and maths, labelIsName", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="($m1,$m2) (4,7)" labelIsName`,
            additionalComponents: `<math name="m1">1</math><math name="m2">2</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "l" });
    });

    it("endpoints are maths, label child", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="$m1 $m2"`,
            lineChildren: `<label>m</label>`,
            additionalComponents: `<math name="m1">(1,2)</math><math name="m2">(4,7)</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "m" });
    });

    it("two endpoints", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="$dp1 $dp2"`,
            additionalComponents: `<point name="dp1">(1,2)</point><point name="dp2">(4,7)</point>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("one endpoint", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="$dp1"`,
            additionalComponents: `<point name="dp1">(1,2)</point>`,
        });

        let points = [
            [1, 2],
            [0, 0],
        ];

        let definingPointNames = ["/dp1"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("one endpoint - the origin", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="$dp1"`,
            additionalComponents: `<point name="dp1">(0,0)</point>`,
        });

        let points = [
            [0, 0],
            [0, 0],
        ];
        let definingPointNames = ["/dp1"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("multiple layers of copied points", async () => {
        let core = await setupScene({
            lineProperties: `endpoints="$p1c $p2c"`,
            additionalComponents: `
    <point name="dp1">(2,1)</point>
    <point name="dp2">(-2,-5)</point>
    $dp1{name="p1a"}
    $dp2{name="p2a"}
    $p1a{name="p1b"}
    $p2a{name="p2b"}
    $p1b{name="p1c"}
    $p2b{name="p2c"}
            `,
        });

        let points = [
            [2, 1],
            [-2, -5],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("new line segment from copied endpoints of line segment", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph>
        <point name="dp1">(1,2)</point>
        <point name="dp2">(4,7)</point>
        <lineSegment name="l" endpoints="$dp1 $dp2" />
        $l.endpoints{assignNames="P1 P2"}
      </graph>
      <graph name="g2" newNamespace>
        <lineSegment name="l" endpoints="$(../l.endpoints)" />
        $l.endpoints{assignNames="P1 P2"}
      </graph>
      
      $g2{name="g3"}
      `,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("initially non-numeric point", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="x" prefill="q"/>
  <graph>
    <lineSegment name="l" endpoints="($x,2) (-2,3)" />
  </graph>
  `,
        });

        // check initial values
        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls(["q", 2]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([-2, 3]);

        // change point to be numeric
        await updateMathInputValue({ latex: "5", name: "/x", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([5, 2]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([-2, 3]);
    });

    it("handle bad endpoints", async () => {
        let core = await createTestCore({
            doenetML: `
  <text name="t">a</text>
  <graph>
    <line name="l1" through="A" />
  </graph>
  `,
        });

        // page loads
        const stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/t"].stateValues.value).eq("a");
    });

    it("extracting endpoint coordinates of symmetric line segment", async () => {
        let core = await createTestCore({
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
            const stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/l"].stateValues.endpoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls([x, y]);
            expect(
                stateVariables["/l"].stateValues.endpoints[1].map(
                    (v) => v.tree,
                ),
            ).eqls([y, x]);
            expect(stateVariables["/x1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/x2"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/y1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/y2"].stateValues.xs[1].tree).eq(x);
        }

        let x = 1;
        let y = 2;
        await check_items(x, y);

        // move x point 1
        x = 3;
        await movePoint({ name: "/x1", x, core });
        await check_items(x, y);

        // move x point 2
        y = 4;
        await movePoint({ name: "/x2", x: y, core });
        await check_items(x, y);

        // move y point 1
        y = -6;
        await movePoint({ name: "/y1", y, core });
        await check_items(x, y);

        // move y point 2
        x = -8;
        await movePoint({ name: "/y2", y: x, core });
        await check_items(x, y);
    });

    it("three line segments with mutual references", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <lineSegment name="l1" endpoints="$(l2.endpoint2{ createComponentOfType='point'}) (1,0)" />
    <lineSegment name="l2" endpoints="$(l3.endpoint2{ createComponentOfType='point'}) (3,2)" />
    <lineSegment name="l3" endpoints="$(l1.endpoint2{ createComponentOfType='point'}) (-1,4)" />
    $l1.endpoint1{assignNames="p11"}
    $l1.endpoint2{assignNames="p12"}
    $l2.endpoint1{assignNames="p21"}
    $l2.endpoint2{assignNames="p22"}
    $l3.endpoint1{assignNames="p31"}
    $l3.endpoint2{assignNames="p32"}
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
            let stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/l1"].stateValues.endpoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/l1"].stateValues.endpoints[1].map(
                    (v) => v.tree,
                ),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l2"].stateValues.endpoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls([x3, y3]);
            expect(
                stateVariables["/l2"].stateValues.endpoints[1].map(
                    (v) => v.tree,
                ),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/l3"].stateValues.endpoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l3"].stateValues.endpoints[1].map(
                    (v) => v.tree,
                ),
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
        await movePoint({ name: "/p11", x: x2, y: y2, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 1
        x1 = -1;
        y1 = -4;
        await movePoint({ name: "/p12", x: x1, y: y1, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 2
        x3 = 9;
        y3 = -8;
        await movePoint({ name: "/p21", x: x3, y: y3, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 2
        x2 = 3;
        y2 = 2;
        await movePoint({ name: "/p22", x: x2, y: y2, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 3
        x1 = -5;
        y1 = 8;
        await movePoint({ name: "/p31", x: x1, y: y1, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 3
        x3 = 0;
        y3 = -5;
        await movePoint({ name: "/p32", x: x3, y: y3, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });
    });

    it("line segment with one endpoint, copy and overwrite the point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <lineSegment endpoints="(-5,9)" name="l" />
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    $(../g1/l{name="l" endpoints="(4,-2)"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  $g2{name="g5"}
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
            let stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x11,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y11,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x2,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y2,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x12,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y12,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x2,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y2,
                    1e-12,
                );
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
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line segment with one endpoint, copy and overwrite the point, swap line", async () => {
        let core = await createTestCore({
            doenetML: `
  <booleanInput name="b" />
  <graph name="g1" newNamespace>
    <conditionalContent assignNames="(l)">
      <case condition="$(../b)" >
        <lineSegment endpoints="(1,2)" />
      </case>
      <else>
        <lineSegment endpoints="(-5,9)" />
      </else>
    </conditionalContent>
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    $(../g1/l{name="l" endpoints="(4,-2)"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.endpoint1{assignNames="A"}
    $l.endpoint2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

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
            const stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.endpoints[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x11,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y11,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x2,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y2,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.endpoints[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x12,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y12,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x2,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y2,
                    1e-12,
                );
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
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        await updateBooleanInputValue({ boolean: true, name: "/b", core });
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
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLineSegment({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLineSegment({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLineSegment({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLineSegment({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLineSegment({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line segment with fixed endpoint", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point name="p" hide fixed>(-5,9)</point>
    <lineSegment name="l" endpoints="$p" />
    $l.endpoint1{assignNames="P1"}
    $l.endpoint2{assignNames="P2"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{name="l"})
    $l.endpoint1{assignNames="P1"}
    $l.endpoint2{assignNames="P2"}  
  </graph>

  $g2{name="g3"}

  `,
        });

        let points = [
            [-5, 9],
            [0, 0],
        ];

        let names = [
            ["/g1/l", "/g1/P1", "/g1/P2"],
            ["/g2/l", "/g2/P1", "/g2/P2"],
            ["/g3/l", "/g3/P1", "/g3/P2"],
        ];

        await checkAllLineValues({ names, points, core });

        // can't move point 1
        await movePoint({ name: "/g1/P1", x: 7, y: -3, core });
        await checkAllLineValues({ names, points, core });

        // move point P2
        points[1] = [-1, -4];
        await movePoint({
            name: "/g1/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // try to move line segment
        await moveLineSegment({
            name: "/g1/l",
            point1coords: [points[0][0] + 5, points[0][1] + 9],
            point2coords: [points[1][0] + 5, points[1][1] + 9],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // can't move point g2/P1
        await movePoint({ name: "/g2/P1", x: -1, y: 0, core });
        await checkAllLineValues({ names, points, core });

        // move point g2/P2
        points[1] = [6, -6];
        await movePoint({
            name: "/g2/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });

        // move line segment 2
        await moveLineSegment({
            name: "/g2/l",
            point1coords: [points[0][0] - 3, points[0][1] + 7],
            point2coords: [points[1][0] - 3, points[1][1] + 7],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // can't move point g3/P1
        await movePoint({ name: "/g3/P1", x: -3, y: 7, core });
        await checkAllLineValues({ names, points, core });

        // move point B3
        points[1] = [-8, -4];
        await movePoint({
            name: "/g3/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // move line segment 3
        await moveLineSegment({
            name: "/g3/l",
            point1coords: [points[0][0] - 8, points[0][1] - 2],
            point2coords: [points[1][0] - 8, points[1][1] - 2],
            core,
        });
        await checkAllLineValues({ names, points, core });
    });

    it("constrain to line segment", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(3,4)</point>
  <lineSegment name="l" endpoints="$P1 $P2" />

  <point name="P3" x="-5" y="2">
    <constraints>
      <constrainTo>$l</constrainTo>
    </constraints>
  </point>
  </graph>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([3, 4]);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(1);
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(2);

        // move line segment to 45 degrees
        await moveLineSegment({
            name: "/l",
            point1coords: [-4, 4],
            point2coords: [4, -4],
            core,
        });
        stateVariables = await returnAllStateVariables(core);

        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([-4, 4]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
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

        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );

        // move point
        xorig = 10;
        yorig = 1;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );

        // move point
        xorig = 9;
        yorig = 7;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );

        // move point
        xorig = -9;
        yorig = 7;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );
    });

    it("attract to linesegment", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P1">(1,2)</point>
  <point name="P2">(3,4)</point>
  <lineSegment name="l" endpoints="$P1 $P2" />

  <point name="P3" x="-5" y="2">
    <constraints>
      <attractTo>$l</attractTo>
    </constraints>
  </point>
  </graph>
  `,
        });

        // check initial values

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([3, 4]);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(-5);
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(2);

        // move line segment to 45 degrees
        await moveLineSegment({
            name: "/l",
            point1coords: [-4, 4],
            point2coords: [4, -4],
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.endpoints[0].map((v) => v.tree),
        ).eqls([-4, 4]);
        expect(
            stateVariables["/l"].stateValues.endpoints[1].map((v) => v.tree),
        ).eqls([4, -4]);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(-5);
        expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(2);

        // move point
        let xorig = 3.3;
        let yorig = -3.6;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        let temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        let p5x = temp;
        let p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );

        // move point
        xorig = 4.3;
        yorig = -4.6;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            4.3,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            -4.6,
            1e-12,
        );

        // move point
        xorig = -2.4;
        yorig = 2.8;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );

        // move point
        xorig = -4.2;
        yorig = 4.3;

        await movePoint({ name: "/P3", x: xorig, y: yorig, core });

        temp = (xorig - yorig) / 2;
        if (temp > 4) {
            temp = 4;
        } else if (temp < -4) {
            temp = -4;
        }
        p5x = temp;
        p5y = -temp;

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/P3"].stateValues.xs[0].tree).closeTo(
            p5x,
            1e-12,
        );
        expect(stateVariables["/P3"].stateValues.xs[1].tree).closeTo(
            p5y,
            1e-12,
        );
    });

    it("point constrained to line segment, different scales from graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph xMin="-110" xMax="110" yMin="-0.11" yMax="0.11">
    <lineSegment endpoints="(-1,-0.05) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints>
        <constrainTo relativeToGraphScales>$l</constrainTo>
      </constraints>
    </point>
  </graph>
  `,
        });

        // point on line segment, close to origin

        let stateVariables = await returnAllStateVariables(core);
        let x = stateVariables["/P"].stateValues.xs[0].tree;
        let y = stateVariables["/P"].stateValues.xs[1].tree;

        expect(y).greaterThan(0);
        expect(y).lessThan(0.01);

        expect(x).closeTo(20 * y, 1e-10);

        // move point
        await movePoint({ name: "/P", x: -100, y: 0.05, core });

        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);

        // move point past endpoint
        await movePoint({ name: "/P", x: -100, y: 0.1, core });

        stateVariables = await returnAllStateVariables(core);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(y).eq(0.05);
        expect(x).closeTo(20 * y, 1e-10);
    });

    it("copy propIndex of endpoints, array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <lineSegment name="l" endpoints="(2,-3) (3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><copy source="l.endpoints[$n]" assignNames="P1 P2" /></p>
    <p><copy source="l.endpoint2[$n]" assignNames="x" /></p>
    <p><copy source="l.endpoints[2][$n]" assignNames="xa" /></p>

    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;

        async function check_items(n: number) {
            const stateVariables = await returnAllStateVariables(core);

            if (n === 1) {
                expect(
                    stateVariables["/P1"].stateValues.xs.map((v) => v.tree),
                ).eqls([t1x, t1y]);
                expect(stateVariables["/x"].stateValues.value.tree).eq(t2x);
                expect(stateVariables["/xa"].stateValues.value.tree).eq(t2x);
            } else if (n === 2) {
                expect(
                    stateVariables["/P1"].stateValues.xs.map((v) => v.tree),
                ).eqls([t2x, t2y]);
                expect(stateVariables["/x"].stateValues.value.tree).eq(t2y);
                expect(stateVariables["/xa"].stateValues.value.tree).eq(t2y);
            } else {
                expect(stateVariables["/P1"]).eq(undefined);
                expect(stateVariables["/x"]).eq(undefined);
                expect(stateVariables["/xa"]).eq(undefined);
            }
            expect(stateVariables["/P2"]).eq(undefined);
        }

        await check_items(NaN);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items(1);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(2);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items(3);
    });

    it("label positioning", async () => {
        let core = await createTestCore({
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
            const stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/l"].stateValues.label).eq(label);
            expect(stateVariables["/l"].stateValues.labelPosition).eq(
                position.toLowerCase(),
            );
            expect(stateVariables["/labelPos"].stateValues.selectedValues).eqls(
                [position],
            );
        }

        await check_items("line", "upperRight");

        await updateTextInputValue({ text: "l", name: "/label", core });
        await check_items("l", "upperRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [2],
            core,
        });
        await check_items("l", "upperLeft");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [3],
            core,
        });
        await check_items("l", "lowerRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [4],
            core,
        });
        await check_items("l", "lowerLeft");
    });

    it("line segment based on two endpoints, one constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P" labelIsName>(3,5)
    <constraints><constrainToGrid dx="2" dy="3" /></constraints>
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
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x1);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y1);
            expect(stateVariables["/Q"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/Q"].stateValues.xs[1].tree).eq(y2);
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
            name: "/l",
            point1coords: [x1Desired, y1Desired],
            point2coords: [x2Desired, y2Desired],
            core,
        });

        await check_items(x1, y1, x2, y2);
    });

    it("lineSegment length", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.length.tree).eq(len);

        t1x = 7;
        t1y = 3;
        len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
        await movePoint({ name: "/A", x: t1x, y: t1y, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.length.tree).eq(len);

        await updateMathInputValue({ latex: "10", name: "/milength", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.length.tree).eq(10);

        // ignore requested negative length
        await updateMathInputValue({ latex: "-3", name: "/milength", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.length.tree).eq(10);

        t1y = 5.5;
        t2x = -9;
        t2y = 5;
        len = Math.sqrt((t1y - t2y) ** 2 + (t1x - t2x) ** 2);
        await movePoint({ name: "/B", x: t2x, y: t2y, core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/l"].stateValues.length.tree).eq(len);
    });

    it("lineSegment symbolic length", async () => {
        let core = await createTestCore({
            doenetML: `
    <lineSegment name="l" endpoints="(x,y) (u,v)" />
    `,
        });

        const stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/l"].stateValues.length.equals(
                me.fromText("sqrt((x-u)^2+(y-v)^2)"),
            ),
        ).eq(true);
    });

    it("draggable, endpoints draggable", async () => {
        let core = await createTestCore({
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
            const stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/p"].stateValues.endpoints[0].map(
                    (v) => v.tree,
                ),
            ).eqls(point1);
            expect(
                stateVariables["/p"].stateValues.endpoints[1].map(
                    (v) => v.tree,
                ),
            ).eqls(point2);
            expect(stateVariables["/p"].stateValues.draggable).eq(draggable);
            expect(stateVariables["/p"].stateValues.endpointsDraggable).eq(
                endpointsDraggable,
            );
        }

        let point1 = [1, 3];
        let point2 = [5, 7];
        let draggable = false;
        let endpointsDraggable = false;

        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move single endpoint
        await moveLineSegment({ name: "/p", point1coords: [4, 7], core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        await moveLineSegment({ name: "/p", point2coords: [4, 7], core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move both endpoints
        await moveLineSegment({
            name: "/p",
            point1coords: [4, 7],
            point2coords: [8, 10],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // only endpoints draggable
        endpointsDraggable = true;
        await updateBooleanInputValue({
            boolean: endpointsDraggable,
            name: "/endpointsDraggable",
            core,
        });

        // can move first endpoint
        point1 = [4, 7];
        await moveLineSegment({ name: "/p", point1coords: point1, core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move second endpoint
        point2 = [-5, -1];
        await moveLineSegment({ name: "/p", point2coords: point2, core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move both endpoints
        await moveLineSegment({
            name: "/p",
            point1coords: [3, 8],
            point2coords: [8, 10],
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // endpoints and line segment draggable
        draggable = true;
        await updateBooleanInputValue({
            boolean: draggable,
            name: "/draggable",
            core,
        });

        // can move first endpoint
        point1 = [-3, 2];
        await moveLineSegment({ name: "/p", point1coords: point1, core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move second endpoint
        point2 = [-9, 0];
        await moveLineSegment({ name: "/p", point2coords: point2, core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move both endpoints
        point1 = [3, 8];
        point2 = [8, 10];
        await moveLineSegment({
            name: "/p",
            point1coords: point1,
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // line segment but not endpoints draggable
        endpointsDraggable = false;
        await updateBooleanInputValue({
            boolean: endpointsDraggable,
            name: "/endpointsDraggable",
            core,
        });

        // cannot move first endpoint
        await moveLineSegment({ name: "/p", point1coords: [9, 3], core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // cannot move second endpoint
        await moveLineSegment({ name: "/p", point2coords: [9, 3], core });
        await check_items({ point1, point2, draggable, endpointsDraggable });

        // can move both endpoints
        point1 = [-4, 1];
        point2 = [9, -4];
        await moveLineSegment({
            name: "/p",
            point1coords: point1,
            point2coords: point2,
            core,
        });
        await check_items({ point1, point2, draggable, endpointsDraggable });
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
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
            const core = await createTestCore({ doenetML, theme });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/ADescription"].stateValues.text).eq(
                `Line segment A is thick ${AColor}.`,
            );
            expect(stateVariables["/BDescription"].stateValues.text).eq(
                `B is a ${BShade} red line segment.`,
            );
            expect(stateVariables["/CDescription"].stateValues.text).eq(
                `C is a thin ${CColor} line segment.`,
            );
        }

        await test_items("light");
        await test_items("dark");
    });
});
