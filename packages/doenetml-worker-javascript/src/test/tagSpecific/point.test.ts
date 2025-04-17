import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    clickPoint,
    focusPoint,
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";
import { superSubscriptsToUnicode } from "../../utils/math";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Point tag tests", async () => {
    async function test_points_copy_y(
        core: PublicDoenetMLCore,
        labels: string[] = ["", ""],
    ) {
        async function check_items({
            x1,
            y1,
            x2,
            labels = ["", ""],
        }: {
            x1: number;
            y1: number;
            x2: number;
            labels?: string[];
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/P1"].stateValues.xs.map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(stateVariables["/P1"].stateValues.coords.tree).eqls([
                "vector",
                x1,
                y1,
            ]);
            expect(stateVariables["/P1"].stateValues.label).eq(labels[0]);
            expect(
                stateVariables["/P2"].stateValues.xs.map((v) => v.tree),
            ).eqls([x2, y1]);
            expect(stateVariables["/P2"].stateValues.coords.tree).eqls([
                "vector",
                x2,
                y1,
            ]);
            expect(stateVariables["/P2"].stateValues.label).eq(labels[1]);
        }

        let x1 = 5,
            y1 = 6,
            x2 = 1;
        await check_items({ x1, y1, x2, labels });

        // move point P1 to (-1,-7)
        x1 = -1;
        y1 = -7;
        await movePoint({ name: "/P1", x: x1, y: y1, core });
        await check_items({ x1, y1, x2, labels });

        // move point P2 to (9,8)
        x2 = 9;
        y1 = 8;
        await movePoint({ name: "/P2", x: x2, y: y1, core });
        await check_items({ x1, y1, x2, labels });
    }

    it("point sugar a copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1">(5,6)</point>
      <point name="P2">(1, $P1.y)</point>
    </graph>
    `,
        });

        await test_points_copy_y(core);
    });

    it("point sugar a copy, with labels", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1">(5,6)<label>P</label></point>
      <point name="P2"><label>Q</label>(1, $P1.y)</point>
    </graph>
    `,
        });

        let labels = ["P", "Q"];
        await test_points_copy_y(core, labels);
    });

    it("coords use a copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1">(5,6)</point>
      <point name="P2" coords="(1, $P1.y)" />
    </graph>
    `,
        });

        await test_points_copy_y(core);
    });

    it("coords use a copy with label", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1"><label>P</label>(5,6)</point>
      <point name="P2" coords="(1, $P1.y)" ><label>Q</label></point>
    </graph>
    `,
        });

        let labels = ["P", "Q"];
        await test_points_copy_y(core, labels);
    });

    it("label uses a copy", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1"><label>P</label>(5,6)</point>
    <point name="P2">
      (1,3)
      <label>$P1.label'</label>
    </point>
  </graph>
    `,
        });

        // Labels are P and P'
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            5, 6,
        ]);
        expect(stateVariables["/P1"].stateValues.label).eq("P");
        expect(stateVariables["/P2"].stateValues.xs.map((v) => v.tree)).eqls([
            1, 3,
        ]);
        expect(stateVariables["/P2"].stateValues.label).eq(`P'`);
    });

    async function test_point_from_math_input_copied(core: PublicDoenetMLCore) {
        async function check_values(xs: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let P of ["/P", "/Q"]) {
                if (xs.length === 0) {
                    expect(
                        stateVariables[P].stateValues.xs.map((v) => v.tree),
                    ).eqls(["\uff3f"]);
                    expect(stateVariables[P].stateValues.coords.tree).eqls(
                        "\uff3f",
                    );
                } else {
                    expect(
                        stateVariables[P].stateValues.xs.map((v) => v.tree),
                    ).eqls(xs);
                    if (xs.length > 1) {
                        expect(stateVariables[P].stateValues.coords.tree).eqls([
                            "vector",
                            ...xs,
                        ]);
                    } else {
                        expect(stateVariables[P].stateValues.coords.tree).eqls(
                            xs[0],
                        );
                    }
                }
            }
        }

        let xs: number[] = [];
        await check_values(xs);

        // create 2D point
        xs = [-1, -7];
        await updateMathInputValue({
            latex: `(${xs.join(",")})`,
            name: "/coords",
            core,
        });
        await check_values(xs);

        // move point P to (3,5)
        xs = [3, 5];
        await movePoint({ name: "/P", x: xs[0], y: xs[1], core });
        await check_values(xs);

        // move point Q to (9,1)
        xs = [9, 1];
        await movePoint({ name: "/Q", x: xs[0], y: xs[1], core });
        await check_values(xs);

        // make point undefined again
        xs = [];
        await updateMathInputValue({ latex: ``, name: "/coords", core });
        await check_values(xs);

        // create 1D point
        xs = [-3];
        await updateMathInputValue({
            latex: `(${xs.join(",")})`,
            name: "/coords",
            core,
        });
        await check_values(xs);

        // create 3D point
        xs = [6, 5, 4];
        await updateMathInputValue({
            latex: `(${xs.join(",")})`,
            name: "/coords",
            core,
        });
        await check_values(xs);

        // create 2D point from altvector
        xs = [5, -2];
        await updateMathInputValue({
            latex: `\\langle${xs.join(",")}\\rangle`,
            name: "/coords",
            core,
        });
        await check_values(xs);

        // move point P to (7,8)
        xs = [7, 8];
        await movePoint({ name: "/P", x: 7, y: 8, core });
        await check_values(xs);
    }

    it("point sugar from single copied math, from mathInput, copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="coords" />
    <graph>
      <point name="P">$coords</point>
    </graph>
    <graph>
      $P{name="Q"}
    </graph>
    `,
        });

        await test_point_from_math_input_copied(core);
    });

    it("point sugar from single math, from mathInput, copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="coords" />
    <graph>
      <point name="P"><math>$coords</math></point>
    </graph>
    <graph>
      $P{name="Q"}
    </graph>
    `,
        });

        await test_point_from_math_input_copied(core);
    });

    it("point from vector, from mathInput, copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="coords" />
    <graph>
      <point name="P"><vector><math>$coords</math></vector></point>
    </graph>
    <graph>
      $P{name="Q"}
    </graph>
    `,
        });

        await test_point_from_math_input_copied(core);
    });

    it("point from copied vector with single sugared math, from mathInput, copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="coords" />
    <vector name="v"><math>$coords</math></vector>
    <graph>
      <point name="P">$v</point>
    </graph>
    <graph>
      $P{name="Q"}
    </graph>
    `,
        });

        await test_point_from_math_input_copied(core);
    });

    async function test_invertible(core: PublicDoenetMLCore, x_fixed = false) {
        async function check_items(x, y) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).closeTo(
                x,
                1e-12,
            );
            expect(stateVariables["/P"].stateValues.xs[1].tree).closeTo(
                y,
                1e-12,
            );
            expect(
                stateVariables["/m1"].stateValues.value.evaluate_to_constant(),
            ).closeTo(x / 1.5, 1e-12);
            expect(stateVariables["/m2"].stateValues.value.tree).closeTo(
                3,
                1e-12,
            );
            expect(stateVariables["/y"].stateValues.value.tree).closeTo(
                y,
                1e-12,
            );
        }

        await check_items(3, 1);

        // try to move point
        await movePoint({ name: "/P", x: 7, y: -5, core });
        if (x_fixed) {
            // x didn't change
            await check_items(3, -5);
        } else {
            // x did change
            await check_items(7, -5);
        }
    }

    it("test invertible due to modifyIndirectly", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">
        (0.5<math name="m1">2</math><math name="m2" modifyIndirectly="false">3</math>, <math name="y">1</math>)
    </point>
  </graph>
  `,
        });

        await test_invertible(core);
    });

    it("test invertible due to fixed", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">
        (0.5<math name="m1">2</math><math name="m2" fixed>3</math>, <math name="y">1</math>)
    </point>
  </graph>
  `,
        });

        await test_invertible(core);
    });

    it("test not invertible due to two non-fixed maths", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">
        (0.5<math name="m1">2</math><math name="m2">3</math>, <math name="y">1</math>)
    </point>
  </graph>
  `,
        });

        await test_invertible(core, true);
    });

    async function test_2d_from_3d(core) {
        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).closeTo(
                x,
                1e-12,
            );
            expect(stateVariables["/P"].stateValues.xs[1].tree).closeTo(
                y,
                1e-12,
            );
            expect(stateVariables["/source"].stateValues.xs[0].tree).eq("a");
            expect(stateVariables["/source"].stateValues.xs[1].tree).closeTo(
                x,
                1e-12,
            );
            expect(stateVariables["/source"].stateValues.xs[2].tree).closeTo(
                y,
                1e-12,
            );
        }

        // points are where they should be
        await check_items(2, 3);

        // move point P
        await movePoint({ name: "/P", x: -4, y: -7, core });
        await check_items(-4, -7);
    }

    it("define 2D point from 3D point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">
    ($source.y,$source.z)
  </point>
  </graph>

  <point name="source">
    (a,2,3)
  </point>
  `,
        });

        await test_2d_from_3d(core);
    });

    it("define 2D point from 3D point, copying xj", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P">
    ($source.x2,$source.x3)
  </point>
  </graph>

  <point name="source">
    (a,2,3)
  </point>
  `,
        });

        await test_2d_from_3d(core);
    });

    it("define 2D point from 3D point, separate coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P" x="$(source.y)" y = "$(source.z)" />
  </graph>

  <point name="source">
    (a,2,3)
  </point>
  `,
        });

        await test_2d_from_3d(core);
    });

    it("define 2D point from double-copied 3D point, separate coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P" x="$(source3.y)" y = "$(source3.z)" />
  </graph>


  $source{name="source2"}
  <math name="a">a</math>
  <point name="source" x="$a" y="2" z="3" />
  $source2{name="source3"}
  `,
        });

        await test_2d_from_3d(core);
    });

    it("point on graph that is copied in two ways", async () => {
        let core = await createTestCore({
            doenetML: `
<graph name="g1" newNamespace>
    <point name="P">(1,2)</point>
</graph>
$g1{name="g2"}
<graph>
    $(/g1/P{name="P3"})
</graph>
  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/g1/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([x, y]);
            expect(
                stateVariables["/g2/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([x, y]);
            expect(
                stateVariables["/P3"].stateValues.xs.map((v) => v.tree),
            ).eqls([x, y]);
        }

        let x = 1,
            y = 2;
        await check_items(x, y);

        // move point 1 to (4,6)
        x = 4;
        y = 6;
        await movePoint({ name: "/g1/P", x, y, core });
        await check_items(x, y);

        // move point 2 to (-3,-7)
        x = -3;
        y = -7;
        await movePoint({ name: "/g2/P", x, y, core });
        await check_items(x, y);

        // move point 3 to (9,-2)
        x = 9;
        y = -2;
        await movePoint({ name: "/P3", x, y, core });
        await check_items(x, y);
    });

    it("point draggable but constrained to x = y^2/10", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">
        ($y^2/10, <math name="y">1</math>)
    </point>
  </graph>
  `,
        });

        async function check_items(y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eqls(
                me.fromText(`(${y})^2/10`).simplify().tree,
            );
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
        }

        await check_items(1);

        // move point to (-9,6)
        await movePoint({ name: "/P", x: -9, y: 6, core });
        await check_items(6);

        // move point to (9,-3)
        await movePoint({ name: "/P", x: 9, y: -3, core });
        await check_items(-3);
    });

    it("point draggable but constrained to y = sin(x)", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">
        (<math name="x">1</math>, sin($x))
    </point>
  </graph>
  `,
        });

        async function check_items(x) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eqls([
                "apply",
                "sin",
                x,
            ]);
        }

        await check_items(1);

        // move point1 to (-9,6)
        await movePoint({ name: "/P", x: -9, y: 6, core });
        await check_items(-9);

        // move point1 to (9,-3)
        await movePoint({ name: "/P", x: 9, y: -3, core });
        await check_items(9);
    });

    it("point reflected across line", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1">(1,2)</point>
    <point name="P2">($P1.y, $P1.x)</point>
    <line draggable="false">x=y</line>
  </graph>
  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(x);
        }

        await check_items(1, 2);

        // move point1 to (-9,6)
        await movePoint({ name: "/P1", x: -9, y: 6, core });
        await check_items(-9, 6);

        // move point2 to (0,-3)
        await movePoint({ name: "/P2", x: 0, y: -3, core });
        await check_items(-3, 0);
    });

    it("point not draggable", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P" draggable="false">(1,2)</point>
  </graph>
  `,
        });

        let P = (await core.returnAllStateVariables(false, true))["/P"]
            .stateValues;
        expect(P.xs.map((v) => v.tree)).eqls([1, 2]);

        // attempt to move point to (-9,6), but doesn't change
        await movePoint({ name: "/P", x: -9, y: 6, core });

        P = (await core.returnAllStateVariables(false, true))["/P"].stateValues;
        expect(P.xs.map((v) => v.tree)).eqls([1, 2]);
    });

    it("point on line", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">($d,3-$d)</point>
  </graph>
  <math name="d">5</math>
  `,
        });

        let P = (await core.returnAllStateVariables(false, true))["/P"]
            .stateValues;
        expect(P.xs.map((v) => v.tree)).eqls([5, -2]);

        // move point to (8,8)
        await movePoint({ name: "/P", x: 8, y: 8, core });
        P = (await core.returnAllStateVariables(false, true))["/P"].stateValues;
        expect(P.xs.map((v) => v.tree)).eqls([8, -5]);
    });

    it("points draggable even with complicated dependence", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">($P2.y,$a)</point>
    <point name="P2">(5,3)</point>
</graph>

<math name="a">$P2.x+1</math>
  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(x + 1);
        }

        await check_items(5, 3);

        // move point 2 to (-4,-8)
        await movePoint({ name: "/P2", x: -4, y: -8, core });
        await check_items(-4, -8);

        // move point 1 to (-9,10)
        await movePoint({ name: "/P1", x: -9, y: 10, core });
        await check_items(9, -9);
    });

    // The behavior of this test varies widely depending on update order
    // If we change the update order, then have to switch x and y
    // to get reasonable behavior.
    // Not a very robust test, but it at least will alert if we've
    // changed the order. (It's not clear which order is best, so not
    // necessarily bad if this test starts failing.)
    it("points related through intermediate math", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
  <point name="P1">($P2.y,$a)</point>
  <point name="P2">(3-$d, $d)</point>
</graph>

<math name="a" simplify>$b+1</math>,
<math name="b" simplify>$P2.x$c</math>,
<math name="c" simplify fixed>$P2.y$d*0.01</math>,
<math name="d" simplify>5</math>
  `,
        });

        async function check_items(d) {
            const P2 = [3 - d, d];
            const c = P2[1] * d * 0.01;
            const b = P2[0] * c;
            const a = b + 1;
            const P1 = [P2[1], a];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/P1"].stateValues.xs[0].tree).closeTo(
                P1[0],
                1e-12,
            );
            expect(stateVariables["/P1"].stateValues.xs[1].tree).closeTo(
                P1[1],
                1e-12,
            );
            expect(stateVariables["/P2"].stateValues.xs[0].tree).closeTo(
                P2[0],
                1e-12,
            );
            expect(stateVariables["/P2"].stateValues.xs[1].tree).closeTo(
                P2[1],
                1e-12,
            );
            expect(stateVariables["/d"].stateValues.value.tree).closeTo(
                d,
                1e-12,
            );
            expect(stateVariables["/c"].stateValues.value.tree).closeTo(
                c,
                1e-12,
            );
            expect(stateVariables["/b"].stateValues.value.tree).closeTo(
                b,
                1e-12,
            );
            expect(stateVariables["/a"].stateValues.value.tree).closeTo(
                a,
                1e-12,
            );
        }

        await check_items(5);

        // move point 2 along constrained line
        let d = -6;
        let P2 = [3 - d, d];

        await movePoint({ name: "/P2", x: P2[0], y: P2[1], core });
        await check_items(d);

        // move point 1 along constrained curve
        d = 7;
        P2 = [3 - d, d];
        let c = P2[1] * d * 0.01;
        let b = P2[0] * c;
        let a = b + 1;
        let P1 = [P2[1], a];

        await movePoint({ name: "/P1", x: P1[0], y: P1[1], core });
        await check_items(d);

        // move point2 to upper right
        await movePoint({ name: "/P2", x: 9, y: 9, core });
        d = -6;
        await check_items(d);

        // move point1 to upper left
        await movePoint({ name: "/P1", x: 4, y: -6, core });
        d = 4;
        await check_items(d);
    });

    it("no dependence on update order", async () => {
        let doenetML1 = `
<graph>
    <point name="P1">($P2.y, 3)</point>
    <point name="P2">($a,$a)</point>
</graph>

<number name="a">2</number>
  `;

        let doenetML2 = `
<graph>
    <point name="P1">($P2.x, 3)</point>
    <point name="P2">($a,$a)</point>
</graph>

<number name="a">3</number>
  `;

        let core = await createTestCore({ doenetML: doenetML1 });

        async function check_items(a, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const P1 = stateVariables["/P1"].stateValues;
            const P2 = stateVariables["/P2"].stateValues;
            expect(P1.xs[0].tree).closeTo(a, 1e-12);
            expect(P1.xs[1].tree).closeTo(y, 1e-12);
            expect(P2.xs[0].tree).closeTo(a, 1e-12);
            expect(P2.xs[1].tree).closeTo(a, 1e-12);
            expect(stateVariables["/a"].stateValues.value).closeTo(a, 1e-12);
        }

        await check_items(2, 3);

        // point 2 is moveable, based on x component
        await movePoint({ name: "/P2", x: -3, y: -7, core });
        await check_items(-3, 3);

        // test zero as had a bug affect case when zero
        await movePoint({ name: "/P2", x: 0, y: 5, core });
        await check_items(0, 3);

        // point1 is free to move
        await movePoint({ name: "/P1", x: 9, y: -6, core });
        await check_items(9, -6);

        // move to zero to make sure are testing the bug that occurred at zero
        await movePoint({ name: "/P1", x: 0, y: 0, core });
        await check_items(0, 0);

        // Test other order
        core = await createTestCore({ doenetML: doenetML2 });

        await check_items(3, 3);

        // point 2 is moveable, based on x component
        await movePoint({ name: "/P2", x: -3, y: -7, core });
        await check_items(-3, 3);

        // test zero as had a bug affect case when zero
        await movePoint({ name: "/P2", x: 0, y: 5, core });
        await check_items(0, 3);

        // point1 is free to move
        await movePoint({ name: "/P1", x: 9, y: -6, core });
        await check_items(9, -6);

        // move to zero to make sure are testing the bug that occured at zero
        await movePoint({ name: "/P1", x: 0, y: 0, core });
        await check_items(0, 0);
    });

    async function test_constrained_to_grid(
        core: PublicDoenetMLCore,
        dx = 1,
        dy = 1,
    ) {
        async function check_items(x, y) {
            const x2 = Math.round(x / dx) * dx;
            const y2 = Math.round(y / dy) * dy;
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y2);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(true);
        }

        await check_items(1, 2);

        // move point to (1.2,3.6)
        await movePoint({ name: "/P", x: 1.2, y: 3.6, core });
        await check_items(1.2, 3.6);

        // move point to (-9.8,-7.4)
        await movePoint({ name: "/P", x: -9.8, y: -7.4, core });
        await check_items(-9.8, -7.4);

        // test bug with number in scientific notation
        // move point to (-1.3E-14,2.5E-12)
        await movePoint({ name: "/P", x: -1.3e-14, y: 2.5e-12, core });
        await check_items(-1.3e-14, 2.5e-12);
    }

    it("point constrained to grid, default parameters", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P" x="1" y="2">
        <constraints>
            <constrainToGrid/>
        </constraints>
    </point>
</graph>
  `,
        });

        await test_constrained_to_grid(core);
    });

    it("point constrained to grid, default parameters, with sugared coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P">
        (1,2)
        <constraints>
            <constrainToGrid/>
        </constraints>
    </point>
</graph>
  `,
        });

        await test_constrained_to_grid(core);
    });

    it("point constrained to grid, default parameters, copied from outside", async () => {
        let core = await createTestCore({
            doenetML: `


<constraints name="toGrid">
    <constrainToGrid/>
</constraints>

<graph>
    <point name="P" x="1" y="2">
        <constraints copySource="toGrid" />
    </point>
</graph>
  `,
        });

        await test_constrained_to_grid(core);
    });

    it("point constrained to grid, non-integer grid", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P" x="1" y="2">
        <constraints>
            <constrainToGrid dx="1.04" dy="1.04"/>
        </constraints>
    </point>
</graph>
  `,
        });

        await test_constrained_to_grid(core, 1.04, 1.04);
    });

    it("point constrained to grid, default parameters, 3D", async () => {
        let core = await createTestCore({
            doenetML: `
  <point name="P" x="1" y="2" z="3">
    <constraints>
      <constrainToGrid/>
    </constraints>
  </point>
  `,
        });

        async function check_items(x, y, z) {
            const x2 = Math.round(x);
            const y2 = Math.round(y);
            const z2 = Math.round(z);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y2);
            expect(stateVariables["/P"].stateValues.xs[2].tree).eq(z2);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(true);
        }

        await check_items(1, 2, 3);

        await movePoint({ name: "/P", x: 1.2, y: 3.6, z: 5.4, core });
        await check_items(1.2, 3.6, 5.4);

        await movePoint({ name: "/P", x: -9.8, y: -7.4, z: -4.6, core });
        await check_items(-9.8, -7.4, -4.6);

        // test bug with number in scientific notation
        await movePoint({
            name: "/P",
            x: -1.3e-14,
            y: 2.5e-12,
            z: 7.1e-121,
            core,
        });
        await check_items(-1.3e-14, 2.5e-12, 7.1e-121);
    });

    it("point constrained to two contradictory grids", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>

  <point name="P" xs="1 3.1">
    <constraints>
      <constrainToGrid dx="2" dy="2"/>
      <constrainToGrid dx="2" dy="2" xoffset="1" yoffset="1" />
    </constraints>
  </point>

  </graph>

  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(true);
        }

        // second constraint wins, but first constraint affects result
        await check_items(3, 5);

        // Unexpected results when moving since constraints applied twice

        // Note: the behavior isn't necessarily desired, but it is a consequence
        // of applying the constraints in the inverse direction, and then
        // again in the normal direction.
        // If one can find a way to avoid this strange behavior, we can change this test

        await movePoint({ name: "/P", x: 3, y: 2.9, core });
        await check_items(7, 5);
    });

    it("point constrained to grid and line", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <line name="PhaseLine" equation="y=0" fixed styleNumber="3"/>
    <point name="P" x="-1.5" y="7.9">
      <constraints>
        <constrainToGrid/>
        <constrainTo>$PhaseLine</constrainTo>
      </constraints>
    </point>
  </graph>

  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(true);
        }

        await check_items(-1, 0);

        // move point
        await movePoint({ name: "/P", x: 8.5, y: -6.2, core });
        await check_items(9, 0);
    });

    async function test_constrained_to_graph(
        core: PublicDoenetMLCore,
        buffer: number,
    ) {
        const buffer1 = 2 * 10 * buffer;
        const buffer2 = 2 * 20 * buffer;

        async function check_items(xs1: number[], xs2?: number[]) {
            if (xs2 === undefined) {
                xs2 = xs1;
            }
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/A"].stateValues.xs.map((v) => v.tree)).eqls(
                xs1,
            );
            expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
            expect(stateVariables["/B"].stateValues.xs.map((v) => v.tree)).eqls(
                xs2,
            );
            expect(stateVariables["/B"].stateValues.constraintUsed).eq(true);
        }

        await check_items([1, 2]);

        // move point A to (105,3)
        await movePoint({ name: "/A", x: 105, y: 3, core });
        await check_items([10 - buffer1, 3]);

        // move point A to (-30,11)
        await movePoint({ name: "/A", x: -30, y: 11, core });
        await check_items([-10 + buffer1, 10 - buffer1]);

        // move point A to (-3,1)
        await movePoint({ name: "/A", x: -3, y: 1, core });
        await check_items([-3, 1]);

        // move point B to (-17,18)
        await movePoint({ name: "/B", x: -17, y: 18, core });
        await check_items([-10 + buffer1, 10 - buffer1], [-17, 18]);

        // move point B to (56,-91)
        await movePoint({ name: "/B", x: 56, y: -91, core });
        await check_items(
            [10 - buffer1, -10 + buffer1],
            [20 - buffer2, -20 + buffer2],
        );
    }

    it("point constrained to graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point x="1" y="2" name="A">
      <constraints>
        <constrainToGraph/>
      </constraints>
    </point>
    <point x="3" y="4" name="C">
      <constraints>
        <constrainToGraph buffer="0.025" />
      </constraints>
    </point>
  </graph>

  <graph xMin="-20" xMax="20" yMin="-20" yMax="20" >
    $A{name="B"}
    $C{name="D"}
  </graph>

  `,
        });

        await test_constrained_to_graph(core, 0.01);
    });

    it("point constrained to graph 2", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point x="1" y="2" name="A">
      <constraints>
        <constrainToGraph buffer="0.025" />
      </constraints>
    </point>
  </graph>

  <graph xMin="-20" xMax="20" yMin="-20" yMax="20" >
    $A{name="B"}
  </graph>

  `,
        });

        await test_constrained_to_graph(core, 0.025);
    });

    it("three points with one constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="original">(1,2)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1" >
      <constraints>
        <constrainToGrid/>
      </constraints>
    </point>
    <point name="follower">
        ($constrained.x+1,
          $constrained.y+1)
    </point>
  </graph>
  `,
        });

        async function check_items(x, y) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/original"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/original"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/original"].stateValues.constraintUsed).eq(
                false,
            );
            expect(stateVariables["/constrained"].stateValues.xs[0].tree).eq(
                Math.round(x + 1),
            );
            expect(stateVariables["/constrained"].stateValues.xs[1].tree).eq(
                Math.round(y + 1),
            );
            expect(
                stateVariables["/constrained"].stateValues.constraintUsed,
            ).eq(true);
            expect(stateVariables["/follower"].stateValues.xs[0].tree).eq(
                Math.round(x + 2),
            );
            expect(stateVariables["/follower"].stateValues.xs[1].tree).eq(
                Math.round(y + 2),
            );
            expect(stateVariables["/follower"].stateValues.constraintUsed).eq(
                false,
            );
        }

        await check_items(1, 2);

        // move point1 to (1.2,3.6)
        await movePoint({ name: "/original", x: 1.2, y: 3.6, core });
        await check_items(1.2, 3.6);

        // move point2 to (-3.4,6.7)
        await movePoint({ name: "/constrained", x: -3.4, y: 6.7, core });
        await check_items(-4, 6);

        // move point3 to (5.3, -2.2)
        await movePoint({ name: "/follower", x: 5.3, y: -2.2, core });
        await check_items(3, -4);
    });

    it("points constrained to grid with dynamic parameters", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="dx"/>
  <mathInput name="dy"/>
  <mathInput name="xoffset"/>
  <mathInput name="yoffset"/>

  <graph>
    <point name="original">(1.2,3.6)</point>
    <point name="constrained" x="$(original.x)+1" y="$(original.y)+1">
      <constraints>
        <constrainToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" />
      </constraints>
    </point>
    <point name="follower">
        ($constrained.x+1,
          $constrained.y+1)
    </point>
  </graph>
  `,
        });

        async function check_items({
            x,
            y,
            dx,
            dy,
            xoffset,
            yoffset,
        }: {
            x: number;
            y: number;
            dx?: number;
            dy?: number;
            xoffset?: number;
            yoffset?: number;
        }) {
            let x2 = x + 1;
            let y2 = y + 1;

            if (
                dx !== undefined &&
                dy !== undefined &&
                xoffset !== undefined &&
                yoffset !== undefined
            ) {
                x2 = Math.round((x2 - xoffset) / dx) * dx + xoffset;
                y2 = Math.round((y2 - yoffset) / dy) * dy + yoffset;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/original"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/original"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/original"].stateValues.constraintUsed).eq(
                false,
            );
            expect(stateVariables["/constrained"].stateValues.xs[0].tree).eq(
                x2,
            );
            expect(stateVariables["/constrained"].stateValues.xs[1].tree).eq(
                y2,
            );
            expect(
                stateVariables["/constrained"].stateValues.constraintUsed,
            ).eq(dx !== undefined);
            expect(stateVariables["/follower"].stateValues.xs[0].tree).eq(
                x2 + 1,
            );
            expect(stateVariables["/follower"].stateValues.xs[1].tree).eq(
                y2 + 1,
            );
            expect(stateVariables["/follower"].stateValues.constraintUsed).eq(
                false,
            );
        }

        // no constraints with blanks
        await check_items({ x: 1.2, y: 3.6 });

        // constrain x and y to integers
        let dx = 1;
        let dy = 1;
        let xoffset = 0;
        let yoffset = 0;

        await updateMathInputValue({ name: "/dx", latex: dx.toString(), core });
        await updateMathInputValue({ name: "/dy", latex: dy.toString(), core });
        await updateMathInputValue({
            name: "/xoffset",
            latex: xoffset.toString(),
            core,
        });
        await updateMathInputValue({
            name: "/yoffset",
            latex: yoffset.toString(),
            core,
        });
        await check_items({ x: 1.2, y: 3.6, dx, dy, xoffset, yoffset });

        // move point2 to (5.3, -2.2)
        await movePoint({ name: "/constrained", x: 5.3, y: -2.2, core });
        await check_items({ x: 4, y: -3, dx, dy, xoffset, yoffset });

        // change constraints
        dx = 3;
        dy = 0.5;
        xoffset = 1;
        yoffset = 0.1;

        await updateMathInputValue({ name: "/dx", latex: dx.toString(), core });
        await updateMathInputValue({ name: "/dy", latex: dy.toString(), core });
        await updateMathInputValue({
            name: "/xoffset",
            latex: xoffset.toString(),
            core,
        });
        await updateMathInputValue({
            name: "/yoffset",
            latex: yoffset.toString(),
            core,
        });
        await check_items({ x: 4, y: -3, dx, dy, xoffset, yoffset });

        // move point to (-2.2, -8.6)
        await movePoint({ name: "/constrained", x: -0.6, y: -8.6, core });
        let x = Math.round((-0.6 - xoffset) / dx) * dx + xoffset - 1;
        let y = Math.round((-8.6 - yoffset) / dy) * dy + yoffset - 1;
        await check_items({ x, y, dx, dy, xoffset, yoffset });
    });

    async function test_attract_to_grid(core: PublicDoenetMLCore) {
        async function check_items(
            x: number,
            y: number,
            constraintUsed: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(
                constraintUsed,
            );
        }

        await check_items(-7, 9, true);

        // move point to (1.1,3.6)
        await movePoint({ name: "/P", x: 1.1, y: 3.6, core });
        await check_items(1.1, 3.6, false);

        // move point to (1.1,3.9)
        await movePoint({ name: "/P", x: 1.1, y: 3.9, core });
        await check_items(1, 4, true);

        // test bug with number in scientific notation
        // move point to (-1.3E-14,2.5E-12)
        await movePoint({ name: "/P", x: -1.3e-14, y: 2.5e-12, core });
        await check_items(0, 0, true);
    }

    it("point attracted to grid, default parameters", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P" xs="-7.1 8.9">
        <constraints>
            <attractToGrid/>
        </constraints>
    </point>
</graph>
  `,
        });

        await test_attract_to_grid(core);
    });

    it("point attracted to grid, default parameters, copied from outside", async () => {
        let core = await createTestCore({
            doenetML: `

<constraints name="toGrid">
    <attractToGrid/>
</constraints>

<graph>
    <point name="P" xs="-7.1 8.9">
        <constraints copySource="toGrid" />
    </point>
</graph>
  `,
        });

        await test_attract_to_grid(core);
    });

    it("point attracted to grid, default parameters, 3D", async () => {
        let core = await createTestCore({
            doenetML: `

<graph>
    <point name="P" xs="-7.1 8.9 2.1">
        <constraints>
            <attractToGrid/>
        </constraints>
    </point>
</graph>
  `,
        });

        async function check_items(
            x: number,
            y: number,
            z: number,
            constraintUsed: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.xs[2].tree).eq(z);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(
                constraintUsed,
            );
        }

        await check_items(-7, 9, 2, true);

        // move point to (1.1,3.9,5.4)
        await movePoint({ name: "/P", x: 1.1, y: 3.9, z: 5.4, core });
        await check_items(1.1, 3.9, 5.4, false);

        // move point to (1.1,3.9, 5.9)
        await movePoint({ name: "/P", x: 1.1, y: 3.9, z: 5.9, core });
        await check_items(1, 4, 6, true);

        // test bug with number in scientific notation
        // move point to (-1.3E-14,2.5E-12,-2.3E-19)
        await movePoint({
            name: "/P",
            x: -1.3e-14,
            y: 2.5e-12,
            z: -2.3e-19,
            core,
        });
        await check_items(0, 0, 0, true);
    });

    it("point attracted to grid, including grid lines", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P" xs="3.1 -3.4">
        <constraints>
            <attractToGrid includeGridLines/>
        </constraints>
    </point>
</graph>
  `,
        });

        async function check_items(
            x: number,
            y: number,
            constraintUsed: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(
                constraintUsed,
            );
        }

        await check_items(3, -3.4, true);

        // move point to (1.3,3.9)
        await movePoint({ name: "/P", x: 1.3, y: 3.9, core });
        await check_items(1.3, 4, true);

        // move point to (1.1,3.9)
        await movePoint({ name: "/P", x: 1.1, y: 3.9, core });
        await check_items(1, 4, true);

        // move point to (1.3,3.7)
        await movePoint({ name: "/P", x: 1.3, y: 3.7, core });
        await check_items(1.3, 3.7, false);
    });

    it("point attracted to grid with dynamic parameters", async () => {
        let core = await createTestCore({
            doenetML: `
<mathInput name="dx"/>
<mathInput name="dy"/>
<mathInput name="xoffset"/>
<mathInput name="yoffset"/>
<mathInput name="xThreshold"/>
<mathInput name="yThreshold"/>

<graph>
    <point name="P" xs="-7.1 8.9">
        <constraints>
            <attractToGrid dx="$dx" dy="$dy" xoffset="$xoffset" yoffset="$yoffset" xThreshold="$xThreshold" yThreshold="$yThreshold" />
        </constraints>
    </point>
</graph>

  `,
        });

        async function check_items(
            x: number,
            y: number,
            constraintUsed: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(
                constraintUsed,
            );
        }

        // no constraints with blanks
        await check_items(-7.1, 8.9, false);

        // constrain x and y to integers
        await updateMathInputValue({ name: "/dx", latex: "1", core });
        await updateMathInputValue({ name: "/dy", latex: "1", core });
        await updateMathInputValue({ name: "/xoffset", latex: "0", core });
        await updateMathInputValue({ name: "/yoffset", latex: "0", core });
        await updateMathInputValue({ name: "/xThreshold", latex: "0.2", core });
        await updateMathInputValue({ name: "/yThreshold", latex: "0.2", core });
        await check_items(-7, 9, true);

        // change constraints
        await updateMathInputValue({ name: "/dx", latex: "3", core });
        await updateMathInputValue({ name: "/dy", latex: "0.5", core });
        await updateMathInputValue({ name: "/xoffset", latex: "1", core });
        await updateMathInputValue({ name: "/yoffset", latex: "0.1", core });
        await check_items(-7.1, 8.9, false);

        await updateMathInputValue({ name: "/xThreshold", latex: "1.0", core });
        await updateMathInputValue({ name: "/yThreshold", latex: "0.3", core });
        await check_items(-8, 9.1, true);
    });

    it("point attracted to grid, dynamic including grid lines", async () => {
        let core = await createTestCore({
            doenetML: `
<p>include grid lines: <booleanInput name="includeGridLines" /></p>

<graph grid="3 3" xMin="-8.5" xMax="8.5" yMin="-8.5" yMax="8.5">
    <point name="P" xs="-3.5 6.6">
        <constraints>
            <attractToGrid dx="3" dy="3" xThreshold="1" yThreshold="1" includeGridLines="$includeGridLines" />
        </constraints>
    </point>
</graph>
  `,
        });

        async function check_items(
            x: number,
            y: number,
            constraintUsed: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P"].stateValues.constraintUsed).eq(
                constraintUsed,
            );
        }

        await check_items(-3, 6, true);

        // move point to (-8.5,-7.1)
        await movePoint({ name: "/P", x: -8.5, y: -7.1, core });
        await check_items(-8.5, -7.1, false);

        // move point to (-8.5,-6.4)
        await movePoint({ name: "/P", x: -8.5, y: -6.4, core });
        await check_items(-9, -6, true);

        // move point to (-3.2,7.5)
        await movePoint({ name: "/P", x: -3.2, y: 7.5, core });
        await check_items(-3.2, 7.5, false);

        // start attracting to grid lines
        await updateBooleanInputValue({
            boolean: true,
            name: "/includeGridLines",
            core,
        });
        await check_items(-3, 7.5, true);

        // move point to (-8.5,-7.1)
        await movePoint({ name: "/P", x: -8.5, y: -7.1, core });
        await check_items(-9, -7.1, true);

        // move point to (-8.5,-6.4)
        await movePoint({ name: "/P", x: -8.5, y: -6.4, core });
        await check_items(-9, -6, true);

        // move point to (-4.2,7.5)
        await movePoint({ name: "/P", x: -4.2, y: 7.5, core });
        await check_items(-4.2, 7.5, false);
    });

    it("point constrained to line", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">(0,2)</point>
    <point name="P2">(2,0)</point>
    <line name="l" through="$P1 $P2"/>
    <point name="A" xs="-1 -5">
        <constraints>
            <constrainTo>$l</constrainTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // point is on line
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move point
        await movePoint({ name: "/A", x: 9, y: -3, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // change line
        await movePoint({ name: "/P1", x: 3, y: 1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move point
        await movePoint({ name: "/A", x: 9, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).eq(2);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point attracted to line", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">(0,2)</point>
    <point name="P2">(2,0)</point>
    <line name="l" through="$P1 $P2"/>
    <point name="A" xs="-1 -5">
        <constraints>
            <attractTo>$l</attractTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // point is not on line
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).eq(-1);
        expect(stateVariables["/A"].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move point near line
        await movePoint({ name: "/A", x: 9.1, y: -6.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(2, 1e-14);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // change line, point not on line
        await movePoint({ name: "/P1", x: 3, y: 1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(2, 1e-14);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move point
        await movePoint({ name: "/A", x: -5.1, y: -6.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(2, 1e-14);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point constrained to lines and points", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1" hide>y = x + 7</line>
    <line name="l2" hide>y = x - 3</line>
    <map name="map">
        <template newNamespace>
            <point hide>($n,$n+2)</point>
        </template>
        <sources alias="n"><sequence from="-10" to="10"/></sources>
    </map>

    <point name="P1" xs="3 2">
        <constraints>
            <constrainTo>$l1 $l2 $map</constrainTo>
        </constraints>
    </point>
</graph>

  `,
        });

        // point is on line
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P1"].stateValues.xs[1].tree -
                stateVariables["/P1"].stateValues.xs[0].tree,
        ).eq(-3);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);

        // move point to lower right
        await movePoint({ name: "/P1", x: 9, y: -5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P1"].stateValues.xs[1].tree -
                stateVariables["/P1"].stateValues.xs[0].tree,
        ).eq(-3);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);

        // move point near points
        await movePoint({ name: "/P1", x: 3.5, y: 5.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(3);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(5);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);

        // move point to upper left
        await movePoint({ name: "/P1", x: -9, y: 8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P1"].stateValues.xs[1].tree -
                stateVariables["/P1"].stateValues.xs[0].tree,
        ).eq(7);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);
    });

    it("point attracted to lines and points", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1" hide>y = x + 7</line>
    <line name="l2" hide>y = x - 3</line>
    <map name="map">
        <template newNamespace>
            <point hide>($n,$n+2)</point>
        </template>
        <sources alias="n"><sequence from="-10" to="10"/></sources>
    </map>

    <point name="P1" xs="3 2">
        <constraints>
            <attractTo threshold="1">$l1 $l2 $map</attractTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // point is in original location

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(3);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(2);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(false);

        // point is on line
        await movePoint({ name: "/P1", x: 3.1, y: 0.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P1"].stateValues.xs[1].tree -
                stateVariables["/P1"].stateValues.xs[0].tree,
        ).eq(-3);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);

        // move point to lower right
        await movePoint({ name: "/P1", x: 9, y: -5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(9);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(-5);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(false);

        // move point near points
        await movePoint({ name: "/P1", x: 3.1, y: 5.1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(3);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(5);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);

        // move point to upper left
        await movePoint({ name: "/P1", x: -9, y: 8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(-9);
        expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(8);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(false);

        // move point near upper line
        await movePoint({ name: "/P1", x: -8.8, y: -2.3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/P1"].stateValues.xs[1].tree -
                stateVariables["/P1"].stateValues.xs[0].tree,
        ).eq(7);
        expect(stateVariables["/P1"].stateValues.constraintUsed).eq(true);
    });

    it("point constrained to union of lines and grid", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1">x+y=0</line>
    <line name="l2">x=y</line>
    <line name="l3">x=2y+8</line>
    <line name="l4">x=-2y-8</line>
    <point name="A" xs="7 3">
        <constraints>
            <constraintUnion>
                <constrainTo>$l1</constrainTo>
                <constrainTo>$l2$l3</constrainTo>
                <constrainTo>$l4</constrainTo>
                <constrainToGrid dx="2" dy="2"/>
            </constraintUnion>
        </constraints>
    </point>
</graph>
  `,
        });

        // point on grid
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(4, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x+y=0
        await movePoint({ name: "/A", x: -7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=y
        await movePoint({ name: "/A", x: 7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=2y+8
        await movePoint({ name: "/A", x: 3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=-2y-8
        await movePoint({ name: "/A", x: -3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point attracted to union of lines and grid", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1">x+y=0</line>
    <line name="l2">x=y</line>
    <line name="l3">x=2y+8</line>
    <line name="l4">x=-2y-8</line>
    <point name="A" xs="7 3">
        <constraints>
            <attractToConstraint>
                <constraintUnion>
                    <constrainTo>$l1</constrainTo>
                    <constrainTo>$l2$l3</constrainTo>
                    <constrainTo>$l4</constrainTo>
                    <constrainToGrid dx="2" dy="2"/>
                </constraintUnion>
            </attractToConstraint>
        </constraints>
    </point>
</graph>
  `,
        });

        // point in original location
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(7, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(3, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move point near grid
        await movePoint({ name: "/A", x: 0.2, y: -1.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-2, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move not close enough to line x+y=0
        await movePoint({ name: "/A", x: -7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            -7.1,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(8.2, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move close enough to line x+y=0
        await movePoint({ name: "/A", x: -7.5, y: 7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move not close enough to line x=y
        await movePoint({ name: "/A", x: 7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(7.1, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(8.2, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move close enough to line x=y
        await movePoint({ name: "/A", x: 7.5, y: 7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=2y+8
        await movePoint({ name: "/A", x: 3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=-2y-8
        await movePoint({ name: "/A", x: -3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point attracted to union of lines and intersections", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1">x+y=0</line>
    <line name="l2">x=y</line>
    <line name="l3">x=2y+8</line>
    <line name="l4">x=-2y-8</line>
    <point name="A" xs="7 3">
        <constraints>
            <attractTo>$l1 $l2 $l3 $l4</attractTo>
            <attractTo>
                <intersection>$l1$l2</intersection>
                <intersection>$l1$l3</intersection>
                <intersection>$l1$l4</intersection>
                <intersection>$l2$l3</intersection>
                <intersection>$l2$l4</intersection>
                <intersection>$l3$l4</intersection>
            </attractTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // point in original location
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(7, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(3, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move not close enough to line x+y=0
        await movePoint({ name: "/A", x: -7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            -7.1,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(8.2, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move close enough to line x+y=0
        await movePoint({ name: "/A", x: -7.5, y: 7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move not close enough to line x=y
        await movePoint({ name: "/A", x: 7.1, y: 8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(7.1, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(8.2, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(false);

        // move close enough to line x=y
        await movePoint({ name: "/A", x: 7.5, y: 7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=2y+8
        await movePoint({ name: "/A", x: 3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=-2y-8
        await movePoint({ name: "/A", x: -3.5, y: -2.5, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=y
        await movePoint({ name: "/A", x: -0.2, y: 0.1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=2y+8
        await movePoint({ name: "/A", x: 2.6, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=-2y-8
        await movePoint({ name: "/A", x: 7.9, y: -8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=y and x=2y+8
        await movePoint({ name: "/A", x: -8.1, y: -7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=-2y-8
        await movePoint({ name: "/A", x: -2.5, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=2y+8 and x=-2y-8
        await movePoint({ name: "/A", x: 0.2, y: -3.9, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-4, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point constrained to union of lines and attracted to intersections", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1">x+y=0</line>
    <line name="l2">x=y</line>
    <line name="l3">x=2y+8</line>
    <line name="l4">x=-2y-8</line>
    <point name="A" xs="7 3">
        <constraints>
            <constrainTo>$l1 $l2 $l3 $l4</constrainTo>
            <attractTo>
                <intersection>$l1$l2</intersection>
                <intersection>$l1$l3</intersection>
                <intersection>$l1$l4</intersection>
                <intersection>$l2$l3</intersection>
                <intersection>$l2$l4</intersection>
                <intersection>$l3$l4</intersection>
            </attractTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // on x=y
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // attract to line x+y=0
        await movePoint({ name: "/A", x: -7.1, y: 10, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=2y+8
        await movePoint({ name: "/A", x: 10, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=-2y-8
        await movePoint({ name: "/A", x: -10, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=y
        await movePoint({ name: "/A", x: -0.2, y: 0.1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=2y+8
        await movePoint({ name: "/A", x: 2.6, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=-2y-8
        await movePoint({ name: "/A", x: 7.9, y: -8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=y and x=2y+8
        await movePoint({ name: "/A", x: -8.1, y: -7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=y and x=-2y-8
        await movePoint({ name: "/A", x: -2.5, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=2y+8 and x=-2y-8
        await movePoint({ name: "/A", x: 0.2, y: -3.9, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-4, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    it("point constrained to union of lines and attracted to intersections", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1">x+y=0</line>
    <line name="l2">x=y</line>
    <line name="l3">x=2y+8</line>
    <line name="l4">x=-2y-8</line>
    <point name="A" xs="7 3">
        <constraints>
            <constrainTo>$l1 $l2 $l3 $l4</constrainTo>
            <attractTo>
                <intersection>$l1$l2</intersection>
                <intersection>$l1$l3</intersection>
                <intersection>$l1$l4</intersection>
                <intersection>$l2$l3</intersection>
                <intersection>$l2$l4</intersection>
                <intersection>$l3$l4</intersection>
            </attractTo>
        </constraints>
    </point>
</graph>
  `,
        });

        // on x=y
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // attract to line x+y=0
        await movePoint({ name: "/A", x: -7.1, y: 10, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=2y+8
        await movePoint({ name: "/A", x: 10, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree -
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near line x=-2y-8
        await movePoint({ name: "/A", x: -10, y: -3, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables["/A"].stateValues.xs[0].tree +
                2 * stateVariables["/A"].stateValues.xs[1].tree,
        ).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=y
        await movePoint({ name: "/A", x: -0.2, y: 0.1, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=2y+8
        await movePoint({ name: "/A", x: 2.6, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x+y=0 and x=-2y-8
        await movePoint({ name: "/A", x: 7.9, y: -8.2, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=y and x=2y+8
        await movePoint({ name: "/A", x: -8.1, y: -7.8, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-8, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=y and x=-2y-8
        await movePoint({ name: "/A", x: -2.5, y: -2.7, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(
            -8 / 3,
            1e-12,
        );
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);

        // move near intersection of x=2y+8 and x=-2y-8
        await movePoint({ name: "/A", x: 0.2, y: -3.9, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/A"].stateValues.xs[0].tree).closeTo(0, 1e-12);
        expect(stateVariables["/A"].stateValues.xs[1].tree).closeTo(-4, 1e-12);
        expect(stateVariables["/A"].stateValues.constraintUsed).eq(true);
    });

    // gap not so relevant any more with new sugar, but test still works
    it("sugar coords with defining gap", async () => {
        let core = await createTestCore({
            doenetML: `
  <mathInput name="n"/>

  <graph>
    <point name="P">(<math>5</math><sequence name="seq" from="2" to="$n" /><math>1</math>,4 )</point>
  </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x1 =
            core.core!.components!["/P"].attributes.xs.component
                .activeChildren[0];
        let math1 = x1.definingChildren[0];
        let math1Name = math1.componentIdx;
        let math2 = x1.definingChildren[2];
        let math2Name = math2.componentIdx;

        expect(x1.definingChildren.map((x) => x.componentIdx)).eqls([
            math1Name,
            "/seq",
            math2Name,
        ]);
        expect(x1.activeChildren.map((x) => x.componentIdx)).eqls([
            math1Name,
            math2Name,
        ]);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(5);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(4);

        await updateMathInputValue({ latex: "2", name: "/n", core });

        let math3 = core.core!.components!["/seq"].replacements[0].adapterUsed;
        let math3Name = math3.componentIdx;
        expect(x1.definingChildren.map((x) => x.componentIdx)).eqls([
            math1Name,
            "/seq",
            math2Name,
        ]);
        expect(x1.activeChildren.map((x) => x.componentIdx)).eqls([
            math1Name,
            math3Name,
            math2Name,
        ]);
        expect(stateVariables["/P"].stateValues.xs[0].tree).eq(10);
        expect(stateVariables["/P"].stateValues.xs[1].tree).eq(4);
    });

    async function test_reciprocal_points(core: PublicDoenetMLCore) {
        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);

            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(x);
        }

        let x = 1,
            y = 2;
        await check_items(x, y);

        // move point 1
        x = -4;
        y = 9;
        await movePoint({ name: "/P1", x, y, core });
        await check_items(x, y);

        // move point 2
        x = 5;
        y = -7;
        await movePoint({ name: "/P2", x: y, y: x, core });
        await check_items(x, y);
    }

    it("copying via x1 and x2", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1">(1,2)</point>
    <point name="P2">($P1.x2, $P1.x1)</point>
  </graph>
    `,
        });

        await test_reciprocal_points(core);
    });

    it("updating via point children", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="p1"><point name="p2">(1,2)</point></point>
</graph>

<graph>
    <point name="p3">$p1{name="p4"}</point>
</graph>

<graph>
    <point name="p5">$p2{name="p6"}</point>
</graph>

<graph>
    <point name="p7">$p4{name="p8"}</point>
</graph>
  `,
        });

        let points = ["/p1", "/p2", "/p3", "/p4", "/p5", "/p6", "/p7", "/p8"];
        let xs = [-10, 6, -4, 2, -9, -5, -2, 4];
        let ys = [8, 3, -3, -2, -6, 5, -9, 0];

        // initial positions

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x = 1;
        let y = 2;
        for (let point of points) {
            expect(stateVariables[point].stateValues.xs[0].tree).eq(x);
            expect(stateVariables[point].stateValues.xs[1].tree).eq(y);
        }

        // move each point in turn
        for (let i = 0; i < 8; i++) {
            let x = xs[i];
            let y = ys[i];

            await movePoint({ name: points[i], x, y, core });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let point of points) {
                expect(stateVariables[point].stateValues.xs[0].tree).eq(x);
                expect(stateVariables[point].stateValues.xs[1].tree).eq(y);
            }
        }
    });

    it("combining different components through copies", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1">(1,2)</point>
    $P1{name="pa"}
    $P1{name="pb"}
    <point name="P2" x = "$pa.y" y="$pb.x" />
  </graph>
  `,
        });

        await test_reciprocal_points(core);
    });

    it("copy prop of copies", async () => {
        let core = await createTestCore({
            doenetML: `
    $p1a.y{assignNames="p1ay"}

    <graph>
      $p1{name="p1a"}
    </graph>
    
    <graph>
      <point name="p1" x="3" y="7" />
    </graph>

  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/p1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1"].stateValues.xs[1].tree).eq(y);

            expect(stateVariables["/p1a"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1a"].stateValues.xs[1].tree).eq(y);

            expect(stateVariables["/p1ay"].stateValues.value.tree).eq(y);
        }

        // initial values
        let x = 3;
        let y = 7;
        await check_items(x, y);

        // move point 1
        x = -3;
        y = 5;
        await movePoint({ name: "/p1", x, y, core });
        await check_items(x, y);

        // move point 2
        x = 7;
        y = 9;
        await movePoint({ name: "/p1a", x, y, core });
        await check_items(x, y);
    });

    it("nested copies", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    $p1a{name="p1b"}
  </graph>
  
  <graph>
    $p1{name="p1a"}
  </graph>
  
  <graph>
    <point name="p1" x="3" y="7"/>
  </graph>
  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/p1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1"].stateValues.xs[1].tree).eq(y);

            expect(stateVariables["/p1a"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1a"].stateValues.xs[1].tree).eq(y);

            expect(stateVariables["/p1b"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/p1b"].stateValues.xs[1].tree).eq(y);
        }

        // initial values
        let x = 3;
        let y = 7;
        await check_items(x, y);

        // move point 1
        x = -3;
        y = 5;
        await movePoint({ name: "/p1", x, y, core });
        await check_items(x, y);

        // move point 2
        x = 7;
        y = 9;
        await movePoint({ name: "/p1a", x, y, core });
        await check_items(x, y);

        // move point 3
        x = -4;
        y = 0;
        await movePoint({ name: "/p1b", x, y, core });
        await check_items(x, y);
    });

    it("points depending on each other", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1" x="$(P2.y)" y="2" />
    <point name="P2" x="$(P1.y)" y="1" />
</graph>

`,
        });

        await test_reciprocal_points(core);
    });

    it("points depending on each other 2", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">($P2.y, 2)</point>
    <point name="P2">($P1.y, 1)</point>
</graph>
  `,
        });

        await test_reciprocal_points(core);
    });

    it("points depending on each other through intermediaries", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1" x="$(P2a.y)" y="2" />
    <point name="P2" x="$(P1a.y)" y="1" />
</graph>
  
<graph>
    <point copySource="P1" name="P1a" />
    <point copySource="P2" name="P2a" />
</graph>

  `,
        });

        await test_reciprocal_points(core);
    });

    it("points depending on each other through intermediaries 2", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">($P2a.y, 2)</point>
    <point name="P2">($P1a.y, 1)</point>
</graph>
  
<graph>
    <point name="P1a" copySource="P1" />
    <point name="P2a" copySource="P2" />
</graph>


  `,
        });

        await test_reciprocal_points(core);
    });

    it("points depending on each other, one using coords", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1" coords="($(P2.y), 2)" />
    <point name="P2" x="$(P1.y)" y="1" />
</graph>


  `,
        });

        await test_reciprocal_points(core);
    });

    it("points depending on themselves", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <point name="P1">(3, 2$P1.x+1)</point>
    <point name="P2">(2$P2.y+1, 3)</point>
</graph>
  `,
        });

        async function check_items(x1: number, y2: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const y1 = 2 * x1 + 1;
            const x2 = 2 * y2 + 1;

            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x1);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y1);

            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(y2);
        }

        // initial values
        await check_items(3, 3);

        // move points
        let x1 = -3;
        let y1try = 5;

        let x2 = 9;
        let y2try = -7;

        let y2 = (x2 - 1) / 2;

        await movePoint({ name: "/P1", x: x1, y: y1try, core });
        await movePoint({ name: "/P2", x: x2, y: y2try, core });

        await check_items(x1, y2);
    });

    it("points depending original graph axis limit", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="graph1">
    <point name="P1" x="3" y="$graph1.yMax{fixed='true'}" />
    <point name="P2">
      ($graph1.xMin{fixed="true"},5)
    </point>
  </graph>

  `,
        });

        async function check_items(x1: number, y2: number) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x1);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(10);

            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(-10);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(y2);
        }

        // initial values
        await check_items(3, 5);

        // move points
        let x1 = 1;
        let y1 = 5;
        let x2 = 8;
        let y2 = -3;

        await movePoint({ name: "/P1", x: x1, y: y1, core });
        await movePoint({ name: "/P2", x: x2, y: y2, core });
        await check_items(x1, y2);
    });

    async function test_label_points_other_coords(
        core: PublicDoenetMLCore,
        math_in_labels?: boolean,
    ) {
        async function check_items(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
        ) {
            let x1round = me.fromAst(x1).round_numbers_to_precision(3);
            let y1round = me.fromAst(y1).round_numbers_to_precision(3);
            let x2round = me.fromAst(x2).round_numbers_to_precision(3);
            let y2round = me.fromAst(y2).round_numbers_to_precision(3);

            let label1: string, label2: string;

            if (math_in_labels) {
                label1 = `\\(${x1round}\\), \\(${x2round}\\)`;
                label2 = `\\(${y1round}\\), \\(${y2round}\\)`;
            } else {
                label1 = `${x1round}, ${x2round}`;
                label2 = `${y1round}, ${y2round}`;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x1);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y1);

            expect(stateVariables["/P2"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/P2"].stateValues.xs[1].tree).eq(y2);

            expect(stateVariables["/P1"].stateValues.label).eq(label1);
            expect(stateVariables["/P2"].stateValues.label).eq(label2);
        }

        // initial values
        let x1 = 1;
        let y1 = 2;
        let x2 = 3;
        let y2 = 4;

        await check_items(x1, y1, x2, y2);

        // move points
        x1 = 1;
        y1 = 5;
        x2 = 8;
        y2 = -3;

        await movePoint({ name: "/P1", x: x1, y: y1, core });
        await movePoint({ name: "/P2", x: x2, y: y2, core });
        await check_items(x1, y1, x2, y2);

        // move points to fractional coordinates
        x1 = 3.12552502;
        y1 = -3.4815436398;
        x2 = 0.36193540738;
        y2 = 7.813395519475;

        await movePoint({ name: "/P1", x: x1, y: y1, core });
        await movePoint({ name: "/P2", x: x2, y: y2, core });
        await check_items(x1, y1, x2, y2);
    }

    it("label points by combining coordinates with other point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1">
      <label><text>$P1.x, $P2.x</text></label>
      (1,2)
    </point>
    <point name="P2">
      (3,4)
      <label><text>$P1.y, $P2.y</text></label>
    </point>
  </graph>

  <p>Label 1: $P1.label</p>
  <p>Label 2: $P2.label</p>
  `,
        });

        await test_label_points_other_coords(core);
    });

    it("label points by combining coordinates with other point 2", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <point name="P1">
      <label>$P1.x, $P2.x</label>
      (1,2)
    </point>
    <point name="P2">
      (3,4)
      <label>$P1.y, $P2.y</label>
    </point>
  </graph>

  <p>Label 1: $P1.label</p>
  <p>Label 2: $P2.label</p>
  `,
        });

        await test_label_points_other_coords(core, true);
    });

    it("update point with constraints", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="fixed0" fixed>0</math>
    <graph>
      <point name="P1" x="-4" y="1">
        <constraints>
          <attractTo><point>(1,-7)</point></attractTo>
        </constraints>
      </point>
      <point name="P3" x="$(P1.x)" y="$fixed0" />
      <point name="P4" y="$(P1.y)" x="$fixed0" />
    </graph>

  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/P3"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/P3"].stateValues.xs[1].tree).eq(0);
            expect(stateVariables["/P4"].stateValues.xs[0].tree).eq(0);
            expect(stateVariables["/P4"].stateValues.xs[1].tree).eq(y);
        }

        let x = -4;
        let y = 1;
        await check_items(x, y);

        // move first point
        x = 3;
        y = -2;

        await movePoint({ name: "/P1", x, y, core });
        await check_items(x, y);

        // move x-axis point
        x = 9;
        y = -2;

        await movePoint({ name: "/P3", x, y: -3, core });
        await check_items(x, y);

        // move y-axis point
        x = 9;
        y = -7.1;
        await movePoint({ name: "/P4", x: -10, y: y, core });
        await check_items(x, y);

        // move near attractor
        x = 1;
        y = -7;
        await movePoint({ name: "/P3", x: 0.9, y: 6, core });
        await check_items(x, y);

        // move again near attractor to make sure doesn't change
        await movePoint({ name: "/P3", x: 1.1, y: 7, core });
        await check_items(x, y);
    });

    it("change point dimensions", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Specify point coordinates: <mathInput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p>The point: <point name="point1" coords="$originalCoords"/></p>
    <p>The point copied: $point1{name="point2"}</p>
    <p>The point copied again: <point name="point3" copySource="point2"/></p>
    </section>

    <section><title>From point 1</title>
    <p>Number of dimensions: <number name="numDimensions1" copySource="point1.numDimensions" /></p>
    <p name="p1x">x-coordinate: $point1.x1</p>
    <p name="p1y">y-coordinate: $point1.x2</p>
    <p name="p1z">z-coordinate: $point1.x3</p>
    <p name="p1all">All individual coordinates: $point1.xs</p>
    <p>Coordinates: <coords copySource="point1.coords" name="coords1" /></p>
    </section>

    <section><title>From point 2</title>
    <p>Number of dimensions: <number name="numDimensions2" copySource="point2.numDimensions" /></p>
    <p name="p2x">x-coordinate: $point2.x1</p>
    <p name="p2y">y-coordinate: $point2.x2</p>
    <p name="p2z">z-coordinate: $point2.x3</p>
    <p name="p2all">All individual coordinates: $point2.xs</p>
    <p>Coordinates: <coords copySource="point2.coords" name="coords2" /></p>
    </section>

    <section><title>From point 3</title>
    <p>Number of dimensions: <number name="numDimensions3" copySource="point3.numDimensions" /></p>
    <p name="p3x">x-coordinate: $point3.x1</p>
    <p name="p3y">y-coordinate: $point3.x2</p>
    <p name="p3z">z-coordinate: $point3.x3</p>
    <p name="p3all">All individual coordinates: $point3.xs</p>
    <p>Coordinates: <coords copySource="point3.coords" name="coords3" /></p>
    </section>

    <section><title>For point 1</title>
    <p>Change coords: <mathInput name="coords1b" bindValueTo="$(point1.coords)" /></p>
    <p>Change x-coordinate: <mathInput name="point1x1b" bindValueTo="$(point1.x1)" /></p>
    <p>Change y-coordinate: <mathInput name="point1x2b" bindValueTo="$(point1.x2)" /></p>
    <p>Change z-coordinate: <mathInput name="point1x3b" bindValueTo="$(point1.x3)" /></p>    
    </section>

    <section><title>For point 2</title>
    <p>Change coords: <mathInput name="coords2b" bindValueTo="$(point2.coords)" /></p>
    <p>Change x-coordinate: <mathInput name="point2x1b" bindValueTo="$(point2.x1)" /></p>
    <p>Change y-coordinate: <mathInput name="point2x2b" bindValueTo="$(point2.x2)" /></p>
    <p>Change z-coordinate: <mathInput name="point2x3b" bindValueTo="$(point2.x3)" /></p>    
    </section>

    <section><title>For point 3</title>
    <p>Change coords: <mathInput name="coords3b" bindValueTo="$(point3.coords)" /></p>
    <p>Change x-coordinate: <mathInput name="point3x1b" bindValueTo="$(point3.x1)" /></p>
    <p>Change y-coordinate: <mathInput name="point3x2b" bindValueTo="$(point3.x2)" /></p>
    <p>Change z-coordinate: <mathInput name="point3x3b" bindValueTo="$(point3.x3)" /></p>    
    </section>

    <section><title>collecting</title>
    <p name="pAllX">x-coordinates: <collect componentTypes="point" prop="x1" target="thePoints"/></p>
    <p name="pAllY">y-coordinates: <collect componentTypes="point" prop="x2" target="thePoints"/></p>
    <p name="pAllZ">z-coordinates: <collect componentTypes="point" prop="x3" target="thePoints"/></p>
    <p name="pAllAll">All individual coordinates: <collect componentTypes="point" prop="xs" target="thePoints"/></p>
    <p>Coordinates: <collect assignNames="coordsAll1 coordsAll2 coordsAll3" componentTypes="point" prop="coords" target="thePoints"/></p>
    </section>

    <section><title>Extracting from point 3</title>
    <p name="p3ex">x-coordinate: <extract prop="x1">$point3</extract></p>
    <p name="p3ey">y-coordinate: <extract prop="x2">$point3</extract></p>
    <p name="p3ez">z-coordinate: <extract prop="x3">$point3</extract></p>
    <p name="p3eall">All individual coordinates: <extract prop="xs">$point3</extract></p>
    <p>Coordinates: <extract assignNames="coords3e" prop="coords">$point3</extract></p>
    </section>
 
  `,
        });

        async function check_items(xs: any[]) {
            let nDim = xs.length;

            let xString = xs.map((v) =>
                superSubscriptsToUnicode(me.fromAst(v).toString()),
            );
            let coordsString = xString.join(", ");
            if (nDim > 1) {
                coordsString = `( ${coordsString} )`;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 1; i <= 3; i++) {
                let point = stateVariables[`/point${i}`].stateValues;
                expect(point.numDimensions).eq(nDim);
                expect(point.xs.map((v) => v.tree)).eqls(xs);

                expect(point.x1.tree).eqls(xs[0]);
                if (nDim > 1) {
                    expect(point.x2.tree).eqls(xs[1]);
                } else {
                    expect(point.x2).eq(undefined);
                }
                if (nDim > 2) {
                    expect(point.x3.tree).eqls(xs[2]);
                } else {
                    expect(point.x3).eq(undefined);
                }

                expect(
                    stateVariables[`/numDimensions${i}`].stateValues.value,
                ).eq(nDim);

                expect(stateVariables[`/coordsAll${i}`].stateValues.text).eq(
                    coordsString,
                );
            }

            for (let i of ["1", "2", "3", "3e"]) {
                expect(stateVariables[`/p${i}x`].stateValues.text).eq(
                    `x-coordinate: ${xString[0]}`,
                );
                if (nDim > 1) {
                    expect(stateVariables[`/p${i}y`].stateValues.text).eq(
                        `y-coordinate: ${xString[1]}`,
                    );
                } else {
                    expect(stateVariables[`/p${i}y`].stateValues.text).eq(
                        `y-coordinate: `,
                    );
                }
                if (nDim > 2) {
                    expect(stateVariables[`/p${i}z`].stateValues.text).eq(
                        `z-coordinate: ${xString[2]}`,
                    );
                } else {
                    expect(stateVariables[`/p${i}z`].stateValues.text).eq(
                        `z-coordinate: `,
                    );
                }

                expect(stateVariables[`/p${i}all`].stateValues.text).eq(
                    `All individual coordinates: ${xString.join(", ")}`,
                );

                expect(stateVariables[`/coords${i}`].stateValues.text).eq(
                    coordsString,
                );
            }

            expect(stateVariables[`/pAllX`].stateValues.text).eq(
                `x-coordinates: ${Array(3).fill(xString[0]).join(", ")}`,
            );
            if (nDim > 1) {
                expect(stateVariables[`/pAllY`].stateValues.text).eq(
                    `y-coordinates: ${Array(3).fill(xString[1]).join(", ")}`,
                );
            } else {
                expect(stateVariables[`/pAllY`].stateValues.text).eq(
                    `y-coordinates: `,
                );
            }
            if (nDim > 2) {
                expect(stateVariables[`/pAllZ`].stateValues.text).eq(
                    `z-coordinates: ${Array(3).fill(xString[2]).join(", ")}`,
                );
            } else {
                expect(stateVariables[`/pAllZ`].stateValues.text).eq(
                    `z-coordinates: `,
                );
            }

            expect(stateVariables[`/pAllAll`].stateValues.text).eq(
                `All individual coordinates: ${Array(3).fill(xString.join(", ")).join(", ")}`,
            );
        }

        await check_items(["＿"]);

        // Create 2D point
        await updateMathInputValue({
            name: "/originalCoords",
            latex: "(a,b)",
            core,
        });

        await check_items(["a", "b"]);

        // Back to 1D point
        await updateMathInputValue({
            name: "/originalCoords",
            latex: "q",
            core,
        });

        await check_items(["q"]);

        // Create 3D point
        await updateMathInputValue({
            name: "/originalCoords",
            latex: "\\langle 2x,u/v,w^2\\rangle ",
            core,
        });

        await check_items([
            ["*", 2, "x"],
            ["/", "u", "v"],
            ["^", "w", 2],
        ]);

        // change the coordinates from point 1 coords
        await updateMathInputValue({
            name: "/coords1b",
            latex: "(7,8,9)",
            core,
        });

        await check_items([7, 8, 9]);

        // change the coordinates from point 2 coords
        await updateMathInputValue({
            name: "/coords2b",
            latex: "\\langle i,j,k\\rangle ",
            core,
        });

        await check_items(["i", "j", "k"]);

        // change the coordinates from point 3 coords
        await updateMathInputValue({
            name: "/coords3b",
            latex: "(l,m,n)",
            core,
        });

        await check_items(["l", "m", "n"]);

        // change the coordinates from point 1 individual components
        await updateMathInputValue({ name: "/point1x1b", latex: "r", core });
        await updateMathInputValue({ name: "/point1x2b", latex: "s", core });
        await updateMathInputValue({ name: "/point1x3b", latex: "t", core });

        await check_items(["r", "s", "t"]);

        // change the coordinates from point 2 individual components
        await updateMathInputValue({ name: "/point2x1b", latex: "f", core });
        await updateMathInputValue({ name: "/point2x2b", latex: "g", core });
        await updateMathInputValue({ name: "/point2x3b", latex: "h", core });

        await check_items(["f", "g", "h"]);

        // change the coordinates from point 3 individual components
        await updateMathInputValue({ name: "/point3x1b", latex: "x", core });
        await updateMathInputValue({ name: "/point3x2b", latex: "y", core });
        await updateMathInputValue({ name: "/point3x3b", latex: "z", core });

        await check_items(["x", "y", "z"]);

        // can't decrease dimension from inverse direction 1
        await updateMathInputValue({
            name: "/coords1b",
            latex: "(u,v)",
            core,
        });

        await check_items(["u", "v", "z"]);

        // can't decrease dimension from inverse direction 2
        await updateMathInputValue({
            name: "/coords2b",
            latex: "(s,t)",
            core,
        });

        await check_items(["s", "t", "z"]);

        // can't decrease dimension from inverse direction 3
        await updateMathInputValue({
            name: "/coords3b",
            latex: "(q,r)",
            core,
        });

        await check_items(["q", "r", "z"]);

        // Back to 2D point
        await updateMathInputValue({
            name: "/originalCoords",
            latex: "(p,q)",
            core,
        });

        await check_items(["p", "q"]);

        // can't increase dimension from inverse direction 1
        await updateMathInputValue({
            name: "/coords1b",
            latex: "(a,b,c)",
            core,
        });

        await check_items(["a", "b"]);

        // can't increase dimension from inverse direction 2
        await updateMathInputValue({
            name: "/coords2b",
            latex: "(d,e,f)",
            core,
        });

        await check_items(["d", "e"]);

        // can't increase dimension from inverse direction 3
        await updateMathInputValue({
            name: "/coords3b",
            latex: "(g,h,i)",
            core,
        });

        await check_items(["g", "h"]);
    });

    // have this abbreviated test, at it was triggering an error
    // that wasn't caught with full test
    it("change point dimensions, abbreviated", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Specify point coordinates: <mathInput name="originalCoords" /></p>

    <section name="thePoints"><title>The points</title>
    <p>The point: <point name="point1" coords="$originalCoords"/></p>
    <p>The point copied: $point1{name="point2"}</p>
    <p>The point copied again: <point name="point3" copySource="point2"/></p>
    </section>

  `,
        });

        async function check_items(xs: any[]) {
            let nDim = xs.length;

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let i = 1; i <= 3; i++) {
                let point = stateVariables[`/point${i}`].stateValues;
                expect(point.numDimensions).eq(nDim);
                expect(point.xs.map((v) => v.tree)).eqls(xs);
            }
        }

        await check_items(["＿"]);

        // Create 2D point 2
        await updateMathInputValue({
            latex: "(a,b)",
            name: "/originalCoords",
            core,
        });
        await check_items(["a", "b"]);

        // Back to 1D point
        await updateMathInputValue({
            latex: "q",
            name: "/originalCoords",
            core,
        });
        await check_items(["q"]);

        // Create 3D point
        await updateMathInputValue({
            latex: "(2x,u/v,w^2)",
            name: "/originalCoords",
            core,
        });
        await check_items([
            ["*", 2, "x"],
            ["/", "u", "v"],
            ["^", "w", 2],
        ]);

        // Back to 2D point 2
        await updateMathInputValue({
            latex: "(p,q)",
            name: "/originalCoords",
            core,
        });
        await check_items(["p", "q"]);
    });

    it("label positioning", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="P" labelPosition="$labelPos">
        <label>$label</label>
        (1,2)
      </point>
    </graph>

    <p>label: <textInput name="label" prefill="A" /></p>
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
            expect(stateVariables["/P"].stateValues.label).eq(label);
            expect(stateVariables["/P"].stateValues.labelPosition).eq(
                position.toLowerCase(),
            );
            expect(stateVariables["/labelPos"].stateValues.selectedValues).eqls(
                [position],
            );
        }

        await check_items("A", "upperRight");

        await updateTextInputValue({ text: "B", name: "/label", core });
        await check_items("B", "upperRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [2],
            core,
        });
        await check_items("B", "upperLeft");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [3],
            core,
        });
        await check_items("B", "lowerRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [4],
            core,
        });
        await check_items("B", "lowerLeft");
    });

    async function test_copy_overwrite_coordinates(core) {
        async function check({
            Ax,
            Ay,
            Bx,
            By,
            Cy,
            A1x,
            B1y,
            A2z,
            C3z,
            n,
            Al,
            Bl,
            Cl,
        }: {
            Ax: number;
            Ay: number;
            Bx: number;
            By: number;
            Cy: number;
            A1x: number;
            B1y: number;
            A2z: number;
            C3z: number;
            n: number;
            Al: string;
            Bl: string;
            Cl: string;
        }) {
            let Cx = 2 * n + 1;
            let C1x = 2 * n - 1;
            let C2y = 2 * n - 2;

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/A"].stateValues.xs.map((v) => v.tree)).eqls(
                [Ax, Ay],
            );
            expect(stateVariables["/B"].stateValues.xs.map((v) => v.tree)).eqls(
                [Bx, By],
            );
            expect(stateVariables["/C"].stateValues.xs.map((v) => v.tree)).eqls(
                [Cx, Cy],
            );
            expect(
                stateVariables["/A1"].stateValues.xs.map((v) => v.tree),
            ).eqls([A1x, Ay]);
            expect(
                stateVariables["/B1"].stateValues.xs.map((v) => v.tree),
            ).eqls([Bx, B1y]);
            expect(
                stateVariables["/C1"].stateValues.xs.map((v) => v.tree),
            ).eqls([C1x, Cy]);
            expect(
                stateVariables["/C2"].stateValues.xs.map((v) => v.tree),
            ).eqls([Cx, C2y]);
            expect(
                stateVariables["/A2"].stateValues.xs.map((v) => v.tree),
            ).eqls([Ax, Ay, A2z]);
            expect(
                stateVariables["/C3"].stateValues.xs.map((v) => v.tree),
            ).eqls([Cx, C2y, C3z]);

            expect(stateVariables["/n"].stateValues.value).eq(n);

            expect(stateVariables["/A"].stateValues.label).eq(Al);
            expect(stateVariables["/A1"].stateValues.label).eq(Al);
            expect(stateVariables["/B"].stateValues.label).eq(Bl);
            expect(stateVariables["/B1"].stateValues.label).eq(Bl);
            expect(stateVariables["/C"].stateValues.label).eq(Cl);
            expect(stateVariables["/C1"].stateValues.label).eq(Cl);
            expect(stateVariables["/C2"].stateValues.label).eq(Cl);
        }

        // initial values
        let Ax = 1;
        let Ay = 2;
        let Bx = 3;
        let By = 4;
        let Cy = 1;
        let A1x = -1;
        let B1y = -2;
        let A2z = 4;
        let C3z = 1;
        let n = 1;
        let Al = "A";
        let Bl = "B";
        let Cl = "C";

        await check({ Ax, Ay, Bx, By, Cy, A1x, B1y, A2z, C3z, n, Al, Bl, Cl });

        // move original points
        Ax = -2;
        Ay = -7;
        Bx = 5;
        By = 9;
        n = -2;
        Cy = -8;

        await movePoint({ name: "/A", x: Ax, y: Ay, core });
        await movePoint({ name: "/B", x: Bx + 0.1, y: By - 0.1, core });
        await movePoint({ name: "/C", x: 2 * n + 1, y: Cy, core });
        await check({ Ax, Ay, Bx, By, Cy, A1x, B1y, A2z, C3z, n, Al, Bl, Cl });

        // move copied points
        A1x = 8;
        Ay = -5;
        Bx = -6;
        B1y = 6;
        n = -3;
        Cy = 4;
        await movePoint({ name: "/A1", x: A1x, y: Ay, core });
        await movePoint({ name: "/B1", x: Bx + 0.4, y: B1y + 0.3, core });
        await movePoint({ name: "/C1", x: 2 * n - 1, y: Cy, core });
        await check({ Ax, Ay, Bx, By, Cy, A1x, B1y, A2z, C3z, n, Al, Bl, Cl });

        // move copied 3D points
        Ax = 0;
        Ay = -1;
        A2z = -2;
        n = 2;
        C3z = 8;
        await movePoint({ name: "/A2", x: Ax, y: Ay, z: A2z, core });
        // Note: for current update order, C3y is changed before C3x,
        // so the value for C3y (20) ends up being ignored.
        // If we change update order, C3y might end up superseding C3x
        await movePoint({ name: "/C3", x: 2 * n + 1, y: 20, z: C3z, core });
        await check({ Ax, Ay, Bx, By, Cy, A1x, B1y, A2z, C3z, n, Al, Bl, Cl });
    }

    it("copy and overwrite coordinates, initial individual components", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A" labelIsName x="1" y="2" />
      <point name="B" labelIsName x="3" y="4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName x="2$n+1" y="1" />
    </graph>

    <graph name="g1">
      $A{name="A1" x="-1"}
      $B{name="B1" y="-2"}
      $C{name="C1" x="2$n-1"}
      $C{name="C2" y="2$n-2"}
    </graph>

    $A{name="A2" z="4"}
    $C2{name="C3" z="1"}

    <number name="n">1</number>

    `,
        });

        await test_copy_overwrite_coordinates(core);
    });

    it("copy and overwrite coordinates, initial xs", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A" labelIsName xs="1 2" />
      <point name="B" labelIsName xs="3 4">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName xs="2$n+1 1" />
    </graph>

    <graph name="g1">
      $A{name="A1" x="-1"}
      $B{name="B1" y="-2"}
      $C{name="C1" x="2$n-1"}
      $C{name="C2" y="2$n-2"}
    </graph>

    $A{name="A2" z="4"}
    $C2{name="C3" z="1"}

    <number name="n">1</number>

    `,
        });

        await test_copy_overwrite_coordinates(core);
    });

    it("copy and overwrite coordinates, initial coords", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A" labelIsName coords="(1,2)" />
      <point name="B" labelIsName coords="(3,4)">
        <constraints><constrainToGrid /></constraints>
      </point>
      <point name="C" labelIsName coords="(2$n+1,1)" />
    </graph>

    <graph name="g1">
      $A{name="A1" x="-1"}
      $B{name="B1" y="-2"}
      $C{name="C1" x="2$n-1"}
      $C{name="C2" y="2$n-2"}
    </graph>

    $A{name="A2" z="4"}
    $C2{name="C3" z="1"}

    <number name="n">1</number>

    `,
        });

        await test_copy_overwrite_coordinates(core);
    });

    it("copy and overwrite each coordinate in sequence, initial sugar", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g1" newNamespace>
      <point name="P">(3,2)</point>
    </graph>
    
    <graph name="g2" newNamespace>
      $(../g1/P{x="-1" name="P"})
    </graph>
    
    $(g2{name="g3"})
    
    <graph name="g4" newNamespace>
      $(../g3/P{y="-5" name="P"})
    </graph>
    `,
        });

        async function check_items({
            P1x,
            P1y,
            P2x,
            P4y,
        }: {
            P1x: number;
            P1y: number;
            P2x: number;
            P4y: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/g1/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([P1x, P1y]);
            expect(
                stateVariables["/g2/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([P2x, P1y]);
            expect(
                stateVariables["/g3/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([P2x, P1y]);
            expect(
                stateVariables["/g4/P"].stateValues.xs.map((v) => v.tree),
            ).eqls([P2x, P4y]);
        }

        // initial values
        let P1x = 3;
        let P1y = 2;
        let P2x = -1;
        let P4y = -5;
        await check_items({ P1x, P1y, P2x, P4y });

        // move first point
        P1x = -2;
        P1y = -7;
        await movePoint({ name: "/g1/P", x: P1x, y: P1y, core });
        await check_items({ P1x, P1y, P2x, P4y });

        // move second point
        P2x = 8;
        P1y = -6;
        await movePoint({ name: "/g2/P", x: P2x, y: P1y, core });
        await check_items({ P1x, P1y, P2x, P4y });

        // move third point
        P2x = 1;
        P1y = 0;
        await movePoint({ name: "/g3/P", x: 1, y: 0, core });
        await check_items({ P1x, P1y, P2x, P4y });

        // move fourth point
        P2x = 3;
        P4y = 4;
        await movePoint({ name: "/g4/P", x: P2x, y: P4y, core });
        await check_items({ P1x, P1y, P2x, P4y });
    });

    it("1D point with 2D constraint does not crash", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1" xs="1">
        <constraints>
          <constrainTo><function>x^2</function></constrainTo>
        </constraints>
      </point>
      <point name="P2" xs="2">
        <constraints>
          <constrainTo>
            <curve><function>x^2</function><function>x^3</function></curve>
          </constrainTo>
        </constraints>
      </point>
      <point name="P3" xs="3">
        <constraints>
          <constrainTo><circle/></constrainTo>
        </constraints>
      </point>
      <point name="P4" xs="4">
        <constraints>
          <constrainTo><line>y=2x</line></constrainTo>
        </constraints>
      </point>
      <point name="P5" xs="5">
        <constraints>
          <constrainTo><polygon vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point name="P6" xs="6">
        <constraints>
          <constrainTo><polyline vertices="(1,2) (3,4) (5,-6)" /></constrainTo>
        </constraints>
      </point>
      <point name="P7" xs="7">
        <constraints>
          <constrainTo><parabola/></constrainTo>
        </constraints>
      </point>
    </graph>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P1"].stateValues.xs.map((v) => v.tree)).eqls([
            1,
        ]);
        expect(stateVariables["/P2"].stateValues.xs.map((v) => v.tree)).eqls([
            2,
        ]);
        expect(stateVariables["/P3"].stateValues.xs.map((v) => v.tree)).eqls([
            3,
        ]);
        expect(stateVariables["/P4"].stateValues.xs.map((v) => v.tree)).eqls([
            4,
        ]);
        expect(stateVariables["/P5"].stateValues.xs.map((v) => v.tree)).eqls([
            5,
        ]);
        expect(stateVariables["/P6"].stateValues.xs.map((v) => v.tree)).eqls([
            6,
        ]);
        expect(stateVariables["/P7"].stateValues.xs.map((v) => v.tree)).eqls([
            7,
        ]);
    });

    it("display digits propagates", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pP"><point displayDigits="2" name="P">(32.252609, 0.0672854, 5)</point></p>
    <p name="pQ"><point displayDecimals="2" name="Q" x="32.252609" y="0.0672854" z="5" /></p>
    <p name="pR"><point padZeros name="R" x="32.252609" y="0.0672854" z="5" /></p>

    $P.coords{assignNames="Pcoords"}
    $Q.coords{assignNames="Qcoords"}
    $R.coords{assignNames="Rcoords"}

    $P.coords{assignNames="PcoordsDec4" displayDecimals="4"}
    $Q.coords{assignNames="QcoordsDig4" displayDigits="4"}
    $R.coords{assignNames="RcoordsDig2" displayDigits="2"}

    $P.coords{assignNames="PcoordsPad" padZeros}
    $Q.coords{assignNames="QcoordsPad" padZeros}
    $R.coords{assignNames="RcoordsNoPad" padZeros="false"}

    $P.xs{assignNames="Px1 Px2 Px3"}
    $Q.x1{assignNames="Qx1"}
    $Q.y{assignNames="Qx2"}
    $R.z{assignNames="Rx3"}

    <math name="Pmath">$P</math>
    <math name="Qmath">$Q</math>
    <math name="Rmath">$R</math>

    <math name="PmathDec4" displayDecimals="4">$P</math>
    <math name="QmathDig4" displayDigits="4">$Q</math>
    <math name="RmathDig2" displayDigits="2">$R</math>

    <number name="Px1number">$P.x</number>
    <number name="Px2number">$P.y</number>

    <number name="Px1numberDec4" displayDecimals="4">$P.x</number>
    <number name="Px2numberDig4" displayDigits="4">$P.y</number>


    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pP"].stateValues.text).eq("( 32, 0.067, 5 )");
        expect(stateVariables["/pQ"].stateValues.text).eq("( 32.25, 0.07, 5 )");
        expect(stateVariables["/pR"].stateValues.text).eq(
            "( 32.25, 0.0673, 5.00 )",
        );
        expect(stateVariables["/Pcoords"].stateValues.text).eq(
            "( 32, 0.067, 5 )",
        );
        expect(stateVariables["/Qcoords"].stateValues.text).eq(
            "( 32.25, 0.07, 5 )",
        );
        expect(stateVariables["/Rcoords"].stateValues.text).eq(
            "( 32.25, 0.0673, 5.00 )",
        );
        expect(stateVariables["/PcoordsDec4"].stateValues.text).eq(
            "( 32.2526, 0.0673, 5 )",
        );
        expect(stateVariables["/QcoordsDig4"].stateValues.text).eq(
            "( 32.25, 0.06729, 5 )",
        );
        expect(stateVariables["/RcoordsDig2"].stateValues.text).eq(
            "( 32, 0.067, 5.0 )",
        );
        expect(stateVariables["/PcoordsPad"].stateValues.text).eq(
            "( 32, 0.067, 5.0 )",
        );
        expect(stateVariables["/QcoordsPad"].stateValues.text).eq(
            "( 32.25, 0.07, 5.00 )",
        );
        expect(stateVariables["/RcoordsNoPad"].stateValues.text).eq(
            "( 32.25, 0.0673, 5 )",
        );
        expect(stateVariables["/Px1"].stateValues.text).eq("32");
        expect(stateVariables["/Px2"].stateValues.text).eq("0.067");
        expect(stateVariables["/Px3"].stateValues.text).eq("5");
        expect(stateVariables["/Qx1"].stateValues.text).eq("32.25");
        expect(stateVariables["/Qx2"].stateValues.text).eq("0.07");
        expect(stateVariables["/Rx3"].stateValues.text).eq("5.00");
        expect(stateVariables["/Pmath"].stateValues.text).eq(
            "( 32, 0.067, 5 )",
        );
        expect(stateVariables["/Qmath"].stateValues.text).eq(
            "( 32.25, 0.07, 5 )",
        );
        expect(stateVariables["/Rmath"].stateValues.text).eq(
            "( 32.25, 0.0673, 5.00 )",
        );
        expect(stateVariables["/PmathDec4"].stateValues.text).eq(
            "( 32.2526, 0.0673, 5 )",
        );
        expect(stateVariables["/QmathDig4"].stateValues.text).eq(
            "( 32.25, 0.06729, 5 )",
        );
        expect(stateVariables["/RmathDig2"].stateValues.text).eq(
            "( 32, 0.067, 5.0 )",
        );
        expect(stateVariables["/Px1number"].stateValues.text).eq("32");
        expect(stateVariables["/Px2number"].stateValues.text).eq("0.067");
        expect(stateVariables["/Px1numberDec4"].stateValues.text).eq("32.2526");
        expect(stateVariables["/Px2numberDig4"].stateValues.text).eq("0.06729");
    });

    it("rounding, copy and override", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="pp1"><point name="p1" displayDigits="10">(34.245023482352345, 245.23823402358234234)</point></p>
    <p name="pp1Dig4"><point name="p1Dig4" copySource="p1" displayDigits="4" /></p>
    <p name="pp1Dec6"><point name="p1Dec6" copySource="p1" displayDecimals="5" /></p>
    <p name="pp1Dig4a"><point name="p1Dig4a" copySource="p1Dec6" displayDigits="4" /></p>
    <p name="pp1Dec6a"><point name="p1Dec6a" copySource="p1Dig4" displayDecimals="5" /></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/pp1"].stateValues.text).eq(
            "( 34.24502348, 245.238234 )",
        );

        expect(stateVariables["/pp1Dig4"].stateValues.text).eq(
            "( 34.25, 245.2 )",
        );
        expect(stateVariables["/pp1Dig4a"].stateValues.text).eq(
            "( 34.25, 245.2 )",
        );

        expect(stateVariables["/pp1Dec6"].stateValues.text).eq(
            "( 34.24502, 245.23823 )",
        );
        expect(stateVariables["/pp1Dec6a"].stateValues.text).eq(
            "( 34.24502, 245.23823 )",
        );
    });

    it("warnings from attractTo and constrainTo", async () => {
        let core = await createTestCore({
            doenetML: `
<graph name="g">
  <legend name="lg"><label>point</label></legend>
  <point>
    <constraints>
      <attractTo>$lg</attractTo>
    </constraints>
  </point>
</graph>

<graph copySource="g">
  <point>(3,4)
    <constraints>
      <constrainTo>$lg</constrainTo>
    </constraints>
  </point>
</graph>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(3);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot attract to a <legend> as it doesn't have a nearestPoint state variable",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(32);

        expect(errorWarnings.warnings[1].message).contain(
            "Cannot attract to a <legend> as it doesn't have a nearestPoint state variable",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(32);

        expect(errorWarnings.warnings[2].message).contain(
            "Cannot constrain to a <legend> as it doesn't have a nearestPoint state variable",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(14);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(14);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(36);
    });

    it("copy point with no arguments, specify individual coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <point name="A" labelIsName />
      <point copySource="A" name="B" labelIsName x="1" />
      <point copySource="A" name="C" labelIsName y="1" />
      <point copySource="B" name="D" labelIsName y="2" />
    </graph>

    <graph copySource="g" name="g2" newNamespace />
    `,
        });

        async function check_items({
            Ax,
            Ay,
            Bx,
            Cy,
            Dy,
        }: {
            Ax: number;
            Ay: number;
            Bx: number;
            Cy: number;
            Dy: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/A"].stateValues.xs.map((v) => v.tree)).eqls(
                [Ax, Ay],
            );
            expect(stateVariables["/B"].stateValues.xs.map((v) => v.tree)).eqls(
                [Bx, Ay],
            );
            expect(stateVariables["/C"].stateValues.xs.map((v) => v.tree)).eqls(
                [Ax, Cy],
            );
            expect(stateVariables["/D"].stateValues.xs.map((v) => v.tree)).eqls(
                [Bx, Dy],
            );
        }

        let Ax = 0,
            Ay = 0,
            Bx = 1,
            Cy = 1,
            Dy = 2;

        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Ax = 3;
        Ay = 4;
        await movePoint({ name: "/A", x: Ax, y: Ay, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Bx = 5;
        Ay = 6;
        await movePoint({ name: "/B", x: Bx, y: Ay, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Ax = 7;
        Cy = 8;
        await movePoint({ name: "/C", x: Ax, y: Cy, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Bx = 9;
        Dy = 10;

        await movePoint({ name: "/D", x: Bx, y: Dy, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Bx = -1;
        Dy = -2;
        await movePoint({ name: "/g2/D", x: Bx, y: Dy, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Ax = -3;
        Cy = -4;
        await movePoint({ name: "/g2/C", x: Ax, y: Cy, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Bx = -5;
        Ay = -6;
        await movePoint({ name: "/g2/B", x: Bx, y: Ay, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });

        Ax = -7;
        Ay = -8;
        await movePoint({ name: "/g2/A", x: Ax, y: Ay, core });
        await check_items({ Ax, Ay, Bx, Cy, Dy });
    });

    it("1D point from string, xs, coords, not x", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="oneDa">1</point>
    <point name="oneDb" xs="1"/>
    <point name="oneDc" coords="1"/>
    <point name="twoD" x="1" />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/oneDa"].stateValues.numDimensions).eq(1);
        expect(stateVariables["/oneDb"].stateValues.numDimensions).eq(1);
        expect(stateVariables["/oneDc"].stateValues.numDimensions).eq(1);
        expect(stateVariables["/twoD"].stateValues.numDimensions).eq(2);

        expect(stateVariables["/oneDa"].stateValues.xs.map((v) => v.tree)).eqls(
            [1],
        );
        expect(stateVariables["/oneDb"].stateValues.xs.map((v) => v.tree)).eqls(
            [1],
        );
        expect(stateVariables["/oneDc"].stateValues.xs.map((v) => v.tree)).eqls(
            [1],
        );
        expect(stateVariables["/twoD"].stateValues.xs.map((v) => v.tree)).eqls([
            1, 0,
        ]);
    });

    it("points from vector operations", async () => {
        let core = await createTestCore({
            doenetML: `
    <math name="m" fixed>(6,3)</math>
    <graph>
      <point name="P">(3,4) + 2(1,-1)</point>
      <point name="Q">2$m - 3$P</point>
    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls([
            5, 2,
        ]);
        expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls([
            -3, 0,
        ]);

        await movePoint({ name: "/P", x: 1, y: 4, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls([
            1, 4,
        ]);
        expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls([
            9, -6,
        ]);

        await movePoint({ name: "/Q", x: -9, y: 9, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls([
            7, -1,
        ]);
        expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls([
            -9, 9,
        ]);
    });

    it("handle invalid layer", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P" layer="$l">(3,4)</point>
    </graph>
    <mathInput name="l" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.layer).eq(0);

        await updateMathInputValue({ latex: "1", name: "/l", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.layer).eq(1);
    });

    it("color point text via style", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><point name="no_style">(0,0)</point> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><point name="fixed_style" styleNumber="2">(1,1)</point> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><point name="variable_style" styleNumber="$sn">(2,2)</point> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        await updateMathInputValue({ latex: "2", name: "/sn", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        await updateMathInputValue({ latex: "3", name: "/sn", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "red with a blue background",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq("red");
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "blue",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");
    });

    it("fix location versus fixed", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P" />
    </graph>

    <mathInput name="miP" bindValueTo="$P" />

    <p>Fix location: <booleanInput name="fl" bindValueTo="$P.fixLocation" /></p>
    <p>Fixed: <booleanInput name="fx" bindValueTo="$P.fixed" /></p>
    <p>Draggable: <booleanInput name="dg" bindValueTo="$P.draggable" />></p>
    <p>nClicks: <number name="nClicks">0</number><updateValue triggerWhenObjectsClicked="P" target="nClicks" newValue="$nClicks+1" /></p>
    <p>nFocused: <number name="nFocused">0</number><updateValue triggerWhenObjectsFocused="P" target="nFocused" newValue="$nFocused+1" /></p>

    `,
        });

        async function check_items({
            nClicks,
            nFocused,
            fixLocation,
            fixed,
            draggable,
            x,
            y,
        }: {
            nClicks: number;
            nFocused: number;
            fixLocation: boolean;
            fixed: boolean;
            draggable: boolean;
            x: number;
            y: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls(
                [x, y],
            );
            expect(stateVariables["/nClicks"].stateValues.value).eq(nClicks);
            expect(stateVariables["/nFocused"].stateValues.value).eq(nFocused);

            expect(stateVariables["/P"].stateValues.fixLocation).eqls(
                fixLocation,
            );
            expect(stateVariables["/P"].stateValues.fixed).eqls(fixed);
            expect(stateVariables["/P"].stateValues.draggable).eqls(draggable);
        }

        let params = {
            nClicks: 0,
            nFocused: 0,
            fixLocation: false,
            fixed: false,
            draggable: true,
            x: 0,
            y: 0,
        };

        await check_items(params);

        // move point by dragging
        params.x = 3;
        params.y = 5;
        await movePoint({ name: "/P", x: params.x, y: params.y, core });
        await check_items(params);

        // focus point
        params.nFocused++;
        await focusPoint({ name: "/P", core });
        await check_items(params);

        params.nClicks++;
        await clickPoint({ name: "/P", core });
        await check_items(params);

        // Make not draggable
        params.draggable = false;
        await updateBooleanInputValue({
            boolean: params.draggable,
            name: "/dg",
            core,
        });

        // can't move point by dragging
        await movePoint({ name: "/P", x: 9, y: 0, core });
        await check_items(params);

        // can move entering coordinates
        params.x = 8;
        params.y = 7;
        await updateMathInputValue({
            name: "/miP",
            latex: `(${params.x},${params.y})`,
            core,
        });
        await check_items(params);

        // focus point
        params.nFocused++;
        await focusPoint({ name: "/P", core });
        await check_items(params);

        // click point
        params.nClicks++;
        await clickPoint({ name: "/P", core });
        await check_items(params);

        // fix location
        params.fixLocation = true;
        updateBooleanInputValue({
            boolean: params.fixLocation,
            name: "/fl",
            core,
        });

        // can still change draggable
        params.draggable = true;
        await updateBooleanInputValue({
            boolean: params.draggable,
            name: "/dg",
            core,
        });
        await check_items(params);

        // still can't move point by dragging
        await movePoint({ name: "/P", x: -4, y: 10, core });
        await check_items(params);

        // can't move entering coordinates
        await updateMathInputValue({
            name: "/miP",
            latex: "(-5,-9)",
            core,
        });
        await check_items(params);

        // focus point
        params.nFocused++;
        await focusPoint({ name: "/P", core });
        await check_items(params);

        // click point
        params.nClicks++;
        await clickPoint({ name: "/P", core });
        await check_items(params);

        // fix point
        params.fixed = true;
        await updateBooleanInputValue({
            boolean: params.fixed,
            name: "/fx",
            core,
        });

        // cannot change draggable or fix location

        await updateBooleanInputValue({
            boolean: !params.fixLocation,
            name: "/fl",
            core,
        });

        await updateBooleanInputValue({
            boolean: !params.draggable,
            name: "/dg",
            core,
        });

        await check_items(params);

        // trying to focus point or click point does not increment counters
        await focusPoint({ name: "/P", core });
        await clickPoint({ name: "/P", core });

        await check_items(params);

        // can still change fixed
        params.fixed = false;
        await updateBooleanInputValue({
            boolean: params.fixed,
            name: "/fx",
            core,
        });
        await check_items(params);
    });

    it("fix location or fixed is communicated so know math from point can't be changed", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P" fixLocation="$fl" fixed="$fx" draggable="$dg">(3,4)</point>
      <point name="Q">(5,6)</point>
      <point name="M">($P+$Q)/2</point>
    </graph>

    <p>Fix location: <booleanInput name="fl"/></p>
    <p>Fixed: <booleanInput name="fx" /></p>
    <p>Draggable: <booleanInput name="dg" prefill="true" /></p>
    <p>Midpoint: <math name="Ma" copySource="M" /></p>
    `,
        });

        async function check_items(
            P: number[],
            Q: number[],
            fixLocation: boolean,
            fixed: boolean,
            draggable: boolean,
        ) {
            let M = P.map((v, i) => (v + Q[i]) / 2);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls(
                P,
            );
            expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls(
                Q,
            );
            expect(stateVariables["/M"].stateValues.xs.map((v) => v.tree)).eqls(
                M,
            );

            expect(stateVariables["/P"].stateValues.fixLocation).eq(
                fixLocation,
            );
            expect(stateVariables["/P"].stateValues.fixed).eq(fixed);
            expect(stateVariables["/P"].stateValues.draggable).eq(draggable);
        }

        let P = [3, 4];
        let Q = [5, 6];
        let fixLocation = false;
        let fixed = false;
        let draggable = true;

        await check_items(P, Q, fixLocation, fixed, draggable);

        // cannot move midpoint point by dragging
        await movePoint({ name: "/M", x: 5, y: 6, core });
        await check_items(P, Q, fixLocation, fixed, draggable);

        // fix location of P
        fixLocation = true;
        await updateBooleanInputValue({
            boolean: fixLocation,
            name: "/fl",
            core,
        });

        // now can move midpoint point by dragging
        await movePoint({ name: "/M", x: 5, y: 6, core });
        Q = [7, 8];
        await check_items(P, Q, fixLocation, fixed, draggable);

        // unfix location of P and make not draggable
        fixLocation = false;
        await updateBooleanInputValue({
            boolean: fixLocation,
            name: "/fl",
            core,
        });
        draggable = false;
        await updateBooleanInputValue({
            boolean: draggable,
            name: "/dg",
            core,
        });

        // cannot move midpoint point by dragging again
        await movePoint({ name: "/M", x: -1, y: -2, core });
        await check_items(P, Q, fixLocation, fixed, draggable);

        // fix P and make draggable
        fixed = true;
        await updateBooleanInputValue({ boolean: fixed, name: "/fx", core });
        draggable = true;
        await updateBooleanInputValue({
            boolean: draggable,
            name: "/dg",
            core,
        });

        // now can move midpoint point by dragging again
        await movePoint({ name: "/M", x: 4, y: 3, core });
        Q = [5, 2];
        await check_items(P, Q, fixLocation, fixed, draggable);
    });

    it("hideOffGraphIndicator", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P1">(12,3)</point>
      <point name="Q1" hideOffGraphIndicator>(-2,14)</point>
      <point name="R1" hideOffGraphIndicator="false">(6,-14)</point>
    </graph>

    <graph hideOffGraphIndicators>
      <point name="P2" copySource="P1" />
      <point name="Q2" copySource="Q1" />
      <point name="R2" copySource="R1" />
    </graph>

    <graph hideOffGraphIndicators="false" >
      <point name="P3" copySource="P1" />
      <point name="Q3" copySource="Q1" />
      <point name="R3" copySource="R1" />
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P1"].stateValues.hideOffGraphIndicator).eq(
            false,
        );
        expect(stateVariables["/Q1"].stateValues.hideOffGraphIndicator).eq(
            true,
        );
        expect(stateVariables["/R1"].stateValues.hideOffGraphIndicator).eq(
            false,
        );

        expect(stateVariables["/P2"].stateValues.hideOffGraphIndicator).eq(
            true,
        );
        expect(stateVariables["/Q2"].stateValues.hideOffGraphIndicator).eq(
            true,
        );
        expect(stateVariables["/R2"].stateValues.hideOffGraphIndicator).eq(
            false,
        );

        expect(stateVariables["/P3"].stateValues.hideOffGraphIndicator).eq(
            false,
        );
        expect(stateVariables["/Q3"].stateValues.hideOffGraphIndicator).eq(
            true,
        );
        expect(stateVariables["/R3"].stateValues.hideOffGraphIndicator).eq(
            false,
        );
    });

    it("point can handle matrix-vector multiplication", async () => {
        let core = await createTestCore({
            doenetML: `
    <matrix name="A">
      <row>3 -1</row>
      <row>1 2</row>
    </matrix>
    <graph>
      <point name="P">(1,2)</point>
      <point name="Q">$A$P</point>
    </graph>
    `,
        });

        async function check_items(Px: number, Py: number) {
            let Qx = 3 * Px - Py;
            let Qy = Px + 2 * Py;

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls(
                [Px, Py],
            );
            expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls(
                [Qx, Qy],
            );
        }

        let Px = 1,
            Py = 2;
        await check_items(Px, Py);

        Px = 4;
        Py = -3;
        await movePoint({ name: "/P", x: Px, y: Py, core });
        await check_items(Px, Py);
    });

    it("point with matrix for coords correctly gives NaN numerical xs", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="P"><matrix>
        <row>0 -1</row>
        <row>1 0</row>
      </matrix></point>
    </graph>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P"].stateValues.numericalXs).eqls([NaN]);
    });

    it("handle complex point values in graph", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <point name="C1">(sqrt(-1), 1)</point>
      <point name="C2">(1, sqrt(-1))</point>
    </graph>

    <p><mathInput name="mi1">$C1</mathInput>
    <mathInput name="mi2">$C2</mathInput></p>

    `,
        });

        async function check_items(x1, y1, x2, y2) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/C1"].stateValues.xs[0].tree).eqls(x1);
            expect(stateVariables["/C1"].stateValues.xs[1].tree).eqls(y1);
            expect(stateVariables["/C2"].stateValues.xs[0].tree).eqls(x2);
            expect(stateVariables["/C2"].stateValues.xs[1].tree).eqls(y2);
        }

        let x1 = me.fromText("sqrt(-1)").tree;
        let y1 = 1;
        let x2 = 1;
        let y2 = x1;

        await check_items(x1, y1, x2, y2);

        await updateMathInputValue({
            name: "/mi1",
            latex: "(\\sqrt{-1}, 2)",
            core,
        });

        await updateMathInputValue({
            name: "/mi2",
            latex: "(2, \\sqrt{-1})",
            core,
        });

        y1 = 2;
        x2 = 2;
        await check_items(x1, y1, x2, y2);

        await updateMathInputValue({ name: "/mi1", latex: "(-1,2)", core });

        await updateMathInputValue({ name: "/mi2", latex: "(2,-1)", core });
        x1 = -1;
        y2 = -1;
        await check_items(x1, y1, x2, y2);
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" markerColor="brown" markerColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" markerColor="#540907" markerColorWord="dark red" markerColorDarkMode="#f0c6c5" markerColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <point name="A" styleNumber="1" labelIsName>(1,2)</point>
      <point name="B" styleNumber="2" labelIsName>(3,4)</point>
      <point name="C" styleNumber="5" labelIsName>(5,6)</point>
    </graph>
    <p name="ADescription">Point A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const core = await createTestCore({ doenetML, theme });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/ADescription"].stateValues.text).eq(
                `Point A is ${AColor}.`,
            );
            expect(stateVariables["/BDescription"].stateValues.text).eq(
                `B is a ${BShade} red square.`,
            );
            expect(stateVariables["/CDescription"].stateValues.text).eq(
                `C is a ${CColor} point.`,
            );
        }

        await test_items("light");
        await test_items("dark");
    });
});
