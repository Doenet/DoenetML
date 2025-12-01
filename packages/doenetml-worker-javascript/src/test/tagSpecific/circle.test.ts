import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    moveCircle,
    movePoint,
    movePolygon,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function check_circle1_and_copies_approx({
    cx,
    cy,
    r,
    stateVariables,
    resolvePathToNodeIdx,
    checkCopiedGraphs = true,
}: {
    cx: number;
    cy: number;
    r: number;
    stateVariables: any;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    checkCopiedGraphs?: boolean;
}) {
    const circle1 =
        stateVariables[await resolvePathToNodeIdx("circle1")].stateValues;
    expect(circle1.center[0].tree).closeTo(cx, 1e-12);
    expect(circle1.center[1].tree).closeTo(cy, 1e-12);
    expect(circle1.radius.tree).closeTo(r, 1e-12);
    expect(circle1.numericalCenter[0]).closeTo(cx, 1e-12);
    expect(circle1.numericalCenter[1]).closeTo(cy, 1e-12);
    expect(circle1.numericalRadius).closeTo(r, 1e-12);
    const centerCopy =
        stateVariables[await resolvePathToNodeIdx("centerCopy")].stateValues;
    expect(centerCopy.xs[0].tree).closeTo(cx, 1e-12);
    expect(centerCopy.xs[1].tree).closeTo(cy, 1e-12);
    const radiusNumber =
        stateVariables[await resolvePathToNodeIdx("radiusNumber")].stateValues;
    expect(radiusNumber.value.tree).closeTo(r, 1e-12);

    if (checkCopiedGraphs) {
        const graph3circle =
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues;
        expect(graph3circle.center[0].tree).closeTo(cx, 1e-12);
        expect(graph3circle.center[1].tree).closeTo(cy, 1e-12);
        expect(graph3circle.radius.tree).closeTo(r, 1e-12);
        expect(graph3circle.numericalCenter[0]).closeTo(cx, 1e-12);
        expect(graph3circle.numericalCenter[1]).closeTo(cy, 1e-12);
        expect(graph3circle.numericalRadius).closeTo(r, 1e-12);
        const graph4circle =
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues;
        expect(graph4circle.center[0].tree).closeTo(cx, 1e-12);
        expect(graph4circle.center[1].tree).closeTo(cy, 1e-12);
        expect(graph4circle.radius.tree).closeTo(r, 1e-12);
        expect(graph4circle.numericalCenter[0]).closeTo(cx, 1e-12);
        expect(graph4circle.numericalCenter[1]).closeTo(cy, 1e-12);
        expect(graph4circle.numericalRadius).closeTo(r, 1e-12);
    }
}
function check_point_approx({
    componentIdx,
    x,
    y,
    stateVariables,
}: {
    componentIdx: number;
    x: number;
    y: number;
    stateVariables: any;
}) {
    expect(stateVariables[componentIdx].stateValues.xs[0].tree).closeTo(
        x,
        1e-12,
    );
    expect(stateVariables[componentIdx].stateValues.xs[1].tree).closeTo(
        y,
        1e-12,
    );
}

describe("Circle tag tests", async () => {
    async function test_circle_defined_by_center_and_radius({
        core,
        resolvePathToNodeIdx,
        definingCenter,
        definingRadius,
        initialCx = 0,
        initialCy = 0,
        initialRadius = 1,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        definingCenter?: string;
        definingRadius?: string;
        initialCx?: number;
        initialCy?: number;
        initialRadius?: number;
    }) {
        async function check_items({
            cx,
            cy,
            radius,
        }: {
            cx: number;
            cy: number;
            radius: number;
        }) {
            const actualRadius = Math.max(0, radius);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            // center and radius of original circle
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("circle1")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.radius.tree,
            ).eq(actualRadius);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalRadius,
            ).eq(actualRadius);

            // center and radius of circle2
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("graph3.circle")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.radius.tree,
            ).eq(actualRadius);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.numericalRadius,
            ).eq(actualRadius);

            // center and radius of circle3
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("graph4.circle")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.radius.tree,
            ).eq(actualRadius);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.numericalRadius,
            ).eq(actualRadius);

            // optional defining center
            if (definingCenter) {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(definingCenter)
                    ].stateValues.xs.map((v) => v.tree),
                ).eqls([cx, cy]);
            }

            // optional defining radius point
            if (definingRadius) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(definingRadius)]
                        .stateValues.value.tree,
                ).eq(radius);
            }

            // radius control point
            expect(
                stateVariables[await resolvePathToNodeIdx("radiusControl")]
                    .stateValues.value.tree,
            ).eq(actualRadius);

            // copied center
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("centerCopy")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([cx, cy]);

            // radius number not in graph
            expect(
                stateVariables[await resolvePathToNodeIdx("radiusNumber")]
                    .stateValues.value.tree,
            ).eq(actualRadius);
        }

        let cx = initialCx;
        let cy = initialCy;
        let radius = initialRadius;
        await check_items({ cx, cy, radius });

        // move circle
        cx = 2;
        cy = 3;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // attempt to set radius negative, but becomes zero
        radius = 0;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("radiusControl"),
            latex: "-4",
            core,
        });
        await check_items({ cx, cy, radius });

        // change radius
        radius = 5;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("radiusControl"),
            latex: radius.toString(),
            core,
        });
        await check_items({ cx, cy, radius });

        if (definingCenter) {
            // change center via defining point
            cx = 11;
            cy = -14;
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(definingCenter),
                x: cx,
                y: cy,
                core,
            });
            await check_items({ cx, cy, radius });
        }

        if (definingRadius) {
            // set defining radius to negative, actual radius becomes zero
            radius = -3;
            await updateMathInputValue({
                componentIdx: await resolvePathToNodeIdx(definingRadius),
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });

            // change radius with defining point
            radius = 7;
            await updateMathInputValue({
                componentIdx: await resolvePathToNodeIdx(definingRadius),
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });
        }

        // change center
        cx = -6;
        cy = -2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // move circle2
        cx = -7;
        cy = 9;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // move circle3
        cx = 6;
        cy = -8;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });
    }

    it("circle with no parameters gives unit circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <circle name="circle1"/>
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle with center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <point name="center">(-1,3)</point>
        <circle name="circle1" center="$center" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            resolvePathToNodeIdx,
            initialCx: -1,
            initialCy: 3,
            definingCenter: "center",
        });
    });

    it("circle with radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="2"/>
    <graph>
        <circle name="circle1" radius="$definingRadius" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
    </graph>  
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            resolvePathToNodeIdx,
            initialCx: 0,
            initialCy: 0,
            initialRadius: 2,
            definingRadius: "definingRadius",
        });
    });

    it("circle with radius and center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="3"/>
    <graph>
        <point name="center">(-3,5)</point>
        <circle name="circle1" radius="$definingRadius" center="$center" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            resolvePathToNodeIdx,
            initialCx: -3,
            initialCy: 5,
            initialRadius: 3,
            definingRadius: "definingRadius",
            definingCenter: "center",
        });
    });

    async function test_circle_defined_by_radius_and_through_point({
        core,
        resolvePathToNodeIdx,
        definingRadius,
        definingThroughPoint,
        initialCx = 0,
        initialCy = 0,
        initialRadius = 1,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        definingRadius?: string;
        definingThroughPoint: string;
        initialCx?: number;
        initialCy?: number;
        initialRadius?: number;
    }) {
        async function check_items({
            cx,
            cy,
            radius,
        }: {
            cx: number;
            cy: number;
            radius: number;
        }) {
            const actualRadius = Math.max(0, radius);

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r: actualRadius,
                stateVariables,
                resolvePathToNodeIdx,
            });
            // defining through point
            expect(
                stateVariables[await resolvePathToNodeIdx(definingThroughPoint)]
                    .stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx(definingThroughPoint)]
                    .stateValues.xs[1].tree,
            ).closeTo(cy + actualRadius, 1e-12);
            // optional defining radius point
            if (definingRadius) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(definingRadius)]
                        .stateValues.value.tree,
                ).closeTo(radius, 1e-12);
            }
            // radius control point
            expect(
                stateVariables[await resolvePathToNodeIdx("radiusControl")]
                    .stateValues.value.tree,
            ).closeTo(actualRadius, 1e-12);
        }

        let cx = initialCx;
        let cy = initialCy;
        let radius = initialRadius;
        await check_items({ cx, cy, radius });

        // move circle
        cx = 2;
        cy = 3;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // attempt to set radius negative, but becomes zero
        cy += radius;
        radius = 0;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("radiusControl"),
            latex: "-4",
            core,
        });
        await check_items({ cx, cy, radius });

        // change radius
        radius = 5;
        cy -= 5;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("radiusControl"),
            latex: radius.toString(),
            core,
        });
        await check_items({ cx, cy, radius });

        // change defining through point
        cx = 11;
        cy = -14;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(definingThroughPoint),
            x: cx,
            y: cy + radius,
            core,
        });
        await check_items({ cx, cy, radius });

        if (definingRadius) {
            // set defining radius to negative, actual radius becomes zero
            cy += radius;
            radius = -3;
            await updateMathInputValue({
                componentIdx: await resolvePathToNodeIdx(definingRadius),
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });

            // change radius with defining point
            radius = 7;
            cy -= 7;
            await updateMathInputValue({
                componentIdx: await resolvePathToNodeIdx(definingRadius),
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });
        }

        // change center
        cx = -6;
        cy = -2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // move circle2
        cx = -7;
        cy = 9;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });

        // move circle3
        cx = 6;
        cy = -8;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, radius });
    }

    it("circle with center and through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,4)</point>
        <point name="point2">(5,6)</point>
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3" x="$circle1.radius" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let cx = 3;
        let cy = 4;
        let tx = 5;
        let ty = 6;
        let r = Math.hypot(tx - cx, ty - cy);

        const test_items = async function () {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point1"),
                x: cx,
                y: cy,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point2"),
                x: tx,
                y: ty,
                stateVariables,
            });
        };
        await test_items();

        // move circle
        let dx = -2;
        let dy = -6;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await test_items();

        // move defining center
        cx = -5;
        cy = 5;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: cx,
            y: cy,
            core,
        });
        await test_items();

        // move reffed center
        cx = 1;
        cy = -1;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await test_items();

        // move through point
        tx = -4;
        ty = 3;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: tx,
            y: ty,
            core,
        });
        await test_items();

        // change reffed radius
        r = r / 4;
        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: r,
            y: 0,
            core,
        });
        await test_items();

        // move circle2
        dx = 4;
        dy = -1;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await test_items();

        // move circle3
        dx = -5;
        dy = 4;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await test_items();
    });

    it("circle through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <point name="definingThroughPoint">(2,-3)</point>
        <circle name="circle1" through="$definingThroughPoint" />
    </graph>
    <graph>
    <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
      <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_radius_and_through_point({
            core,
            resolvePathToNodeIdx,
            initialCx: 2,
            initialCy: -3 - 1,
            initialRadius: 1,
            definingThroughPoint: "definingThroughPoint",
        });
    });

    it("circle with radius and one through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="13"/>
    <graph>
        <point name="definingThroughPoint">(2,-3)</point>
        <circle name="circle1" through="$definingThroughPoint" radius="$definingRadius"/>
    </graph>
    <graph>
    <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
      <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        await test_circle_defined_by_radius_and_through_point({
            core,
            resolvePathToNodeIdx,
            initialCx: 2,
            initialCy: -3 - 13,
            initialRadius: 13,
            definingThroughPoint: "definingThroughPoint",
            definingRadius: "definingRadius",
        });
    });

    it("circle through two points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)</point>
        <circle name="circle1" through="$point1 $point2"/>
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3" x="$(circle1.radius)" y="0" />
    </graph>
    <graph name="graph3">
      <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        async function check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        }: {
            cx: number;
            cy: number;
            r: number;
            t1x: number;
            t1y: number;
            t2x: number;
            t2y: number;
            core: PublicDoenetMLCore;
            resolvePathToNodeIdx: ResolvePathToNodeIdx;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
        }

        function calculateCenterAndRadius({
            t1x,
            t1y,
            t2x,
            t2y,
        }: {
            t1x: number;
            t1y: number;
            t2x: number;
            t2y: number;
        }) {
            let r =
                Math.sqrt(Math.pow(t1x - t2x, 2) + Math.pow(t1y - t2y, 2)) / 2;
            let cx = (t1x + t2x) / 2;
            let cy = (t1y + t2y) / 2;
            return [cx, cy, r];
        }

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        t1x = -2;
        t1y = 0;
        t2x = -1;
        t2y = 7;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move first through point
        t1x = 4;
        t1y = -1;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move second through point on top of first
        t2x = t1x;
        t2y = t1y;
        r = 0;
        cx = t2x;
        cy = t2y;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move second through point again
        t2x = 8;
        t2y = -3;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move center
        t1x += 2;
        t1y += -3;
        t2x += 2;
        t2y += -3;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move radius to half size
        t1x = 8 + (4 + 2 - 8) / 2;
        t1y = -5 + (-1 - 3 + 5) / 2;
        t2x = 8 + (8 + 2 - 8) / 2;
        t2y = -5 + (-3 - 3 + 5) / 2;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: r,
            y: 0,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle2
        let dx = 3;
        let dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle3
        t1x = 8 + (4 + 2 - 8) / 2;
        t1y = -5 + (-1 - 3 + 5) / 2;
        t2x = 8 + (8 + 2 - 8) / 2;
        t2y = -5 + (-3 - 3 + 5) / 2;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        dx = -3;
        dy = 5;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            core,
            resolvePathToNodeIdx,
        });
    });

    async function check_circle_and_three_points({
        cx,
        cy,
        r,
        t1x,
        t1y,
        t2x,
        t2y,
        t3x,
        t3y,
        core,
        resolvePathToNodeIdx,
    }: {
        cx: number;
        cy: number;
        r: number;
        t1x: number;
        t1y: number;
        t2x: number;
        t2y: number;
        t3x: number;
        t3y: number;
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        function expectCloseTo(val: any, desiredVal: any) {
            if (Number.isNaN(desiredVal)) {
                expect(Number.isFinite(val)).false;
            } else {
                expect(val).closeTo(desiredVal, 1e-12);
            }
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .center[1].tree,
            cy,
        );

        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .radius.tree,
            r,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.center[1].tree,
            cy,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.numericalCenter[0],
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.numericalCenter[1],
            cy,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.radius.tree,
            r,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                .stateValues.numericalRadius,
            r,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.center[1].tree,
            cy,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.numericalCenter[0],
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.numericalCenter[1],
            cy,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.radius.tree,
            r,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                .stateValues.numericalRadius,
            r,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("centerCopy")].stateValues
                .xs[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("centerCopy")].stateValues
                .xs[1].tree,
            cy,
        );
        expectCloseTo(
            stateVariables[await resolvePathToNodeIdx("radiusNumber")]
                .stateValues.value.tree,
            r,
        );

        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            stateVariables,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            stateVariables,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: t3x,
            y: t3y,
            stateVariables,
        });
    }

    async function getCircle1CenterAndRadiusFromStateVar({
        core,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        // calculate center and radius from circle itself
        let cx: number =
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .numericalCenter[0];
        let cy: number =
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .numericalCenter[1];
        let r: number =
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .numericalRadius;

        return [cx, cy, r];
    }

    it("circle through three points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)</point>
        <point name="point3">(-3,4)</point>
        <circle name="circle1" through="$point1 $point2 $point3" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <math extend="$circle1.diameter" name="diam" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let t3x = -3;
        let t3y = 4;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle up and to the right
        let dx = 3;
        let dy = 4;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move first point to be in straight line
        t1x = -3;
        t1y = 8;
        cx = NaN;
        cy = NaN;
        r = NaN;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move second point
        t2x = -4;
        t2y = -2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move third point
        t3x = 5;
        t3y = 3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: t3x,
            y: t3y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move points to be identical, should be a circle of radius zero
        t1x = 5;
        t1y = 3;
        t2x = 5;
        t2y = 3;
        cx = t1x;
        cy = t1y;
        r = 0;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // points 1 and 3 are identical, two points should be diameter
        t2x = 2;
        t2y = -7;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // points 2 and 3 are identical, two points should be diameter
        t3x = 2;
        t3y = -7;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: t3x,
            y: t3y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // points 1 and 2 are identical, two points should be diameter
        t1x = 4;
        t1y = 9;
        t2x = 4;
        t2y = 9;
        cx = (t1x + t3x) / 2;
        cy = (t1y + t3y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move points apart again
        t2x = 2;
        t2y = -7;
        t3x = 0;
        t3y = -8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: t3x,
            y: t3y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move center by reffed point
        ((dx = 2), (dy = -3));
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // half radius around center
        r = r / 2;
        t1x = cx + (t1x - cx) / 2;
        t1y = cy + (t1y - cy) / 2;
        t2x = cx + (t2x - cx) / 2;
        t2y = cy + (t2y - cy) / 2;
        t3x = cx + (t3x - cx) / 2;
        t3y = cy + (t3y - cy) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point4"),
            x: r,
            y: 0,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle2
        dx = -5;
        dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });

        // move circle3
        dx = 7;
        dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle with radius and through two points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math hide name="pX">$point3.x</math>
    <graph>
        <point name="point3">(2,0)</point>
        <point name="point1">(3,4)</point>
        <point name="point2">(5,6)</point>
        <circle name="circle1" radius="$pX" through="$point1 $point2" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <math extend="$circle1.diameter" name="diam" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let t1x = 3;
        let t1y = 4;
        let t2x = 5;
        let t2y = 6;
        let r = 2;
        let [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        let dx = -1;
        let dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move through point too far away
        t1x = 0;
        t1y = -1;
        cx = NaN;
        cy = NaN;
        // TODO: should the radius still be 2 here?
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // increase radius by moving definition point
        r = 6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: r,
            y: 0,
            core,
        });
        [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // decrease radius by moving copied point
        r = 2;
        cx = NaN;
        cy = NaN;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point4"),
            x: r,
            y: 0,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        r = 6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point4"),
            x: r,
            y: 0,
            core,
        });
        [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        r = 6 / 9;
        cx = NaN;
        cy = NaN;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point4"),
            x: r,
            y: 0,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move through points on top of each other
        t1x = 5;
        t1y = -4;
        t2x = 5;
        t2y = -4;
        r = 2.0 / 3.0;
        cx = t1x;
        cy = t1y - r;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move through points apart, but close enough
        t1x = -2;
        t1y = 7;
        t2x = -2.5;
        t2y = 6.6;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: t1x,
            y: t1y,
            core,
        });
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move reffed center
        dx = 6;
        dy = -7;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move circle2
        dx = 3;
        dy = -1;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move circle3
        dx = -5;
        dy = 3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx,
            cy,
            core,
        });
        await check_circle_and_three_points({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x: r,
            t3y: 0,
            core,
            resolvePathToNodeIdx,
        });
    });

    // ======== Self-Referential Circle =========
    async function check_circle1_exact({
        cx,
        cy,
        r,
        diameter,
        core,
        resolvePathToNodeIdx,
    }: {
        cx: number;
        cy: number;
        r: number;
        diameter?: number;
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("circle1")
            ].stateValues.center.map((v) => v.tree),
        ).eqls([cx, cy]);
        expect(
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .radius.tree,
        ).eq(r);

        if (diameter) {
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.diameter.tree,
            ).eq(diameter);
        } else {
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.diameter.tree,
            ).eq(2 * r);
        }

        expect(
            stateVariables[
                await resolvePathToNodeIdx("centerCopy")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([cx, cy]);
    }

    async function test_circle_radius_and_center_interdependent({
        core,
        resolvePathToNodeIdx,
        initialCx,
        initialCyAndRadius,
        centerDependsOnRadius,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialCx: number;
        initialCyAndRadius: number;
        centerDependsOnRadius: boolean;
    }) {
        let cx = initialCx;
        let cy = initialCyAndRadius;
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        cx = -3;
        cy = 5;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move center point
        cx = 8;
        cy = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        if (centerDependsOnRadius) {
            // attempt move circle below x-axis, both center y and radius are zero
            cx = 3;
            cy = 0;
            await moveCircle({
                componentIdx: await resolvePathToNodeIdx("circle1"),
                cx,
                cy: -2,
                core,
            });
            await check_circle1_exact({
                cx,
                cy,
                r: cy,
                core,
                resolvePathToNodeIdx,
            });
        } else {
            // radius depends on center
            // move circle below x-axis, center y is negative, radius is zero
            cx = 3;
            cy = -2;
            await moveCircle({
                componentIdx: await resolvePathToNodeIdx("circle1"),
                cx,
                cy,
                core,
            });
            await check_circle1_exact({
                cx,
                cy,
                r: 0,
                core,
                resolvePathToNodeIdx,
            });
        }

        // move circle back up with center point
        cx = 1;
        cy = 4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });
    }

    it("circle where radius depends on center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.center.y" center="(1,2)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            resolvePathToNodeIdx,
            initialCx: 1,
            initialCyAndRadius: 2,
            centerDependsOnRadius: false,
        });
    });

    it("circle where radius depends on unspecified center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.center.y" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            resolvePathToNodeIdx,
            initialCx: 0,
            initialCyAndRadius: 0,
            centerDependsOnRadius: false,
        });
    });

    it("circle where center depends on radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" center="(1, $circle1.radius)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            resolvePathToNodeIdx,
            initialCx: 1,
            initialCyAndRadius: 2,
            centerDependsOnRadius: true,
        });
    });

    it("circle where center depends on unspecified radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" center="(1, $circle1.radius)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>    
  `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            resolvePathToNodeIdx,
            initialCx: 1,
            initialCyAndRadius: 1,
            centerDependsOnRadius: true,
        });
    });

    async function test_circle_radius_and_single_through_point_interdependent({
        initialRadius,
        core,
        resolvePathToNodeIdx,
        throughPointDependsOnRadius,
    }: {
        initialRadius: number;
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        throughPointDependsOnRadius: boolean;
    }) {
        let cx = 1;
        let cy = initialRadius;
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        let desiredCy = 5;
        cx = -3;
        cy = (desiredCy + cy) / 2;
        // given previous radius is 2, would move through point to 5+2,
        // so that center of circle would be (5+2)/2
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move center point
        cx = 8;
        desiredCy = 7;
        cy = (desiredCy + cy) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move circle below x-axis, radius becomes 0
        cx = 4;
        desiredCy = -6;
        if (throughPointDependsOnRadius) {
            cy = 0;
            await moveCircle({
                componentIdx: await resolvePathToNodeIdx("circle1"),
                cx,
                cy: desiredCy,
                core,
            });
            await check_circle1_exact({
                cx,
                cy,
                r: cy,
                core,
                resolvePathToNodeIdx,
            });
        } else {
            // Through point is allowed to become negative even though radius cannot
            cy = desiredCy + cy; // through point is on top of center because radius is 0
            await moveCircle({
                componentIdx: await resolvePathToNodeIdx("circle1"),
                cx,
                cy: desiredCy,
                core,
            });
            await check_circle1_exact({
                cx,
                cy,
                r: 0,
                core,
                resolvePathToNodeIdx,
            }); //
        }

        // move circle back up with center point
        desiredCy = 4;
        cx = 1;
        if (throughPointDependsOnRadius) {
            cy = (desiredCy + cy) / 2;
        } else {
            cy = (desiredCy + 0) / 2; // previous radius was 0 but cy is not 0
        }
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });
    }

    it("circle where single through point depends on radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" through="(1,2$circle1.radius)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 2,
            core,
            resolvePathToNodeIdx,
            throughPointDependsOnRadius: true,
        });
    });

    it("circle where single through point depends on unspecified radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="(1,2 $circle1.radius)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 1,
            core,
            resolvePathToNodeIdx,
            throughPointDependsOnRadius: true,
        });
    });

    it("circle where radius depends on single through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.throughPoint1.y/2" through="(1,4)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 2,
            core,
            resolvePathToNodeIdx,
            throughPointDependsOnRadius: false,
        });
    });

    async function test_circle_center_and_through_point_interdependent({
        core,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        let cx = 1;
        let cy = 2;
        await check_circle1_exact({ cx, cy, r: 2, core, resolvePathToNodeIdx });

        // move circle
        let desiredCy = 5;
        cy = 11 / 4;
        cx = -3;
        // Note: the following isn't the desired behavior, but it is a result of the situation
        // appearing to be that of a constrained center and a free through point when moving the circle.
        // (The through point ends up where requested but the center got altered.)
        // Since we care about that situation (see test "circle with center and through point, center constrained")
        // but don't care as much about this contrived situation,
        // we live with this more complicated behavior in the case where we have this strange relationship
        // between the through point and the center.
        // The attempt to move the through point a second time to preserve the radius yield this result:
        // Given previous radius is 2, would move through point to (-3, 5+2),
        // so that center of circle would initially be (-3,(5+2)/2).
        // Since center changed from given value but through point didn't,
        // it will attempt to move through point back to radius 2 above center,
        // i.e., to (-3, (5+2)/2+2)) = (-3, 11/2)
        // which will make the center be (-3, 11/4)
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move center point
        desiredCy = 7;
        cy = 7; // since moving center itself
        cx = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });

        // move circle below x-axis
        desiredCy = -31;
        cy = -5 / 2;
        cx = 4;
        // Note: Given previous radius is 7, would move through point to (4, -24),
        // so that center of circle would initially be (4,-12).
        // Since center changed from given value but through point didn't,
        // it will attempt to move through point back to radius 7 above center,
        // i.e., to (4, -5)
        // which will make the center be (4, -5/2)
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: -1 * cy,
            core,
            resolvePathToNodeIdx,
        });

        // move circle back up with center point
        desiredCy = 4;
        cy = 4; // since moving point itself
        cx = 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: cy,
            core,
            resolvePathToNodeIdx,
        });
    }

    it("circle where center depends on through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="(1,4)" center="($circle1.throughPointX1_1, $circle1.throughPointX1_2/2)"/>
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        await test_circle_center_and_through_point_interdependent({
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle where through point depends on center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="($circle1.centerX1,$(circle1.centerX2)2)" center="(1,2)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>

  `,
        });

        await test_circle_center_and_through_point_interdependent({
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle where through point 2 depends on through point 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="TP1">(1,2)</point>
        <point extend="$circle1.throughPoint2" name="TP2" />
        <circle name="circle1" through="$TP1 ($circle1.throughPointX1_1 + 1,3)"/>
        <point extend="$circle1.center" name="centerCopy" />
  </graph>
  <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />

  `,
        });

        let t1x = 1;
        let t1y = 2;
        let t2x = 2;
        let t2y = 3;
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;

        async function test_items() {
            let r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
                checkCopiedGraphs: false,
            });
            let circle1Through =
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalThroughPoints;
            expect(circle1Through[0][0]).closeTo(t1x, 1e-12);
            expect(circle1Through[0][1]).closeTo(t1y, 1e-12);
            expect(circle1Through[1][0]).closeTo(t2x, 1e-12);
            expect(circle1Through[1][1]).closeTo(t2y, 1e-12);
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
        }
        await test_items();

        // move circle
        let dx = 2;
        let dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await test_items();

        // move center point
        dx = -1;
        dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await test_items();

        // move first through point
        t1x = 6;
        t1y = 3;
        t2x = t1x + 1;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP1"),
            x: t1x,
            y: t1y,
            core,
        });
        await test_items();

        // move second through point
        t2x = -7;
        t2y = -9;
        t1x = t2x - 1;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        await test_items();
    });

    it("circle where radius depends on two through points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math hide name="r">
        abs($circle1.throughPoint1.x - $circle1.throughPoint2.x)
    </math> 
    <graph>
        <point name="TP1">(1,2)</point>
        <point name="TP2">(3,4)</point>
        <circle name="circle1" radius="$r" through="$TP1 $TP2" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />

  `,
        });

        let t1x = 1;
        let t1y = 2;
        let t2x = 3;
        let t2y = 4;
        let [cx, cy, _] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });

        const check_through_points = async function (stateVariables) {
            let r = Math.abs(t1x - t2x);
            let circle1 =
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues;
            expect(circle1.numericalThroughPoints[0][0]).closeTo(t1x, 1e-12);
            expect(circle1.numericalThroughPoints[0][1]).closeTo(t1y, 1e-12);
            expect(circle1.numericalThroughPoints[1][0]).closeTo(t2x, 1e-12);
            expect(circle1.numericalThroughPoints[1][1]).closeTo(t2y, 1e-12);
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
        };
        let stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);

        // move circle
        let dx = 2;
        let dy = -3;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        cx += dx;
        cy += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);
        await check_circle1_and_copies_approx({
            cx,
            cy,
            r: Math.abs(t1x - t2x),
            stateVariables,
            resolvePathToNodeIdx,
            checkCopiedGraphs: false,
        });

        // move center point
        dx = -5;
        dy = -2;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        cx += dx;
        cy += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);
        await check_circle1_and_copies_approx({
            cx,
            cy,
            r: Math.abs(t1x - t2x),
            stateVariables,
            resolvePathToNodeIdx,
            checkCopiedGraphs: false,
        });

        // move first through point
        t1x = 6;
        t1y = 3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP1"),
            x: t1x,
            y: t1y,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);

        // move second through point so x difference between through points is too small for radius
        t2x = 5;
        t2y = -3;
        cx = NaN;
        cy = NaN;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);
        let svCenter =
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .numericalCenter;
        expect(Number.isFinite(svCenter[0])).false;
        expect(Number.isFinite(svCenter[1])).false;

        // move second through point close enough to circle
        t2y = 1.5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        await check_through_points(stateVariables);
        svCenter =
            stateVariables[await resolvePathToNodeIdx("circle1")].stateValues
                .numericalCenter;
        expect(Number.isFinite(svCenter[0])).true;
        expect(Number.isFinite(svCenter[1])).true;
    });

    it("circle with dependencies among radius and two through points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="TP1">(1,2)</point>
        <point extend="$circle1.throughPoint2" name="TP2" />
        <circle name="circle1"
            radius="$circle1.throughPoint1.x"
            through="$TP1 ($circle1.radius+1,3)"
        />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>

  `,
        });

        let t1x = 1;
        let t1y = 2;
        let t2x = 2;
        let t2y = 3;
        let r = t1x;
        let finiteCenter = true;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let circle1 =
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues;
            expect(circle1.radius.tree).closeTo(r, 1e-12);
            expect(circle1.numericalThroughPoints[0][0]).closeTo(t1x, 1e-12);
            expect(circle1.numericalThroughPoints[0][1]).closeTo(t1y, 1e-12);
            expect(circle1.numericalThroughPoints[1][0]).closeTo(t2x, 1e-12);
            expect(circle1.numericalThroughPoints[1][1]).closeTo(t2y, 1e-12);
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
            expect(Number.isFinite(circle1.numericalCenter[0])).eqls(
                finiteCenter,
            );
            expect(Number.isFinite(circle1.numericalCenter[1])).eqls(
                finiteCenter,
            );
        }
        await check_items();

        // move circle
        let dx = 2;
        let dy = -3;
        let [cx, cy, _] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        r = t1x;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items();

        // move center point
        dx = -1;
        dy = -2;
        [cx, cy, _] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        r = t1x;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items();

        // move first through point
        t1x = 6;
        t1y = 3;
        r = t1x;
        t2x = 1 + t1x;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP1"),
            x: t1x,
            y: t1y,
            core,
        });
        await check_items();

        // move second through point down, too far away from first through point
        t2y = -9;
        finiteCenter = false;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_items();

        // move second through point to the right, close enough
        t2x = 8;
        t1x = t2x - 1;
        r = t1x;
        finiteCenter = true;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_items();
    });

    it("circle with dependencies among three through points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="TP2">(1,2)</point>
        <point extend="$circle1.throughPoint3" name="TP3" />
        <circle name="circle1" through="($circle1.throughPointX2_1+1,3) $TP2 ($circle1.throughPointX1_1+1,5)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <point extend="$circle1.throughPoint1" name="TP1" />
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
  `,
        });

        let t1x = 2;
        let t1y = 3;
        let t2x = 1;
        let t2y = 2;
        let t3x = 3;
        let t3y = 5;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
                checkCopiedGraphs: false,
            });
            let circle1 =
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues;
            expect(circle1.numericalThroughPoints[0][0]).closeTo(t1x, 1e-12);
            expect(circle1.numericalThroughPoints[0][1]).closeTo(t1y, 1e-12);
            expect(circle1.numericalThroughPoints[1][0]).closeTo(t2x, 1e-12);
            expect(circle1.numericalThroughPoints[1][1]).closeTo(t2y, 1e-12);
            expect(circle1.numericalThroughPoints[2][0]).closeTo(t3x, 1e-12);
            expect(circle1.numericalThroughPoints[2][1]).closeTo(t3y, 1e-12);
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("TP3"),
                x: t3x,
                y: t3y,
                stateVariables,
            });
        }
        await check_items();

        // move circle
        let dx = 2;
        let dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items();

        // move center point
        dx = -1;
        dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items();

        // move first through point
        t1x = 6;
        t1y = 3;
        t3x = t1x + 1;
        t2x = t1x - 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP1"),
            x: t1x,
            y: t1y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_items();

        // move second through point
        t2x = -7;
        t2y = -9;
        t1x = t2x + 1;
        t3x = t1x + 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP2"),
            x: t2x,
            y: t2y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_items();

        // move third through point
        t3x = 1;
        t3y = -2;
        t1x = t3x - 1;
        t2x = t1x - 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("TP3"),
            x: t3x,
            y: t3y,
            core,
        });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_items();
    });

    it("circle where center depends on diameter", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" center="(1,$circle1.diameter)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        let cx = 1;
        let cy = 4;
        await check_circle1_exact({
            cx,
            cy,
            r: 2,
            diameter: 4,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        cx = -3;
        cy = 6;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: 3,
            diameter: 6,
            core,
            resolvePathToNodeIdx,
        });

        // move center point
        cx = 8;
        cy = 4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: 2,
            diameter: 4,
            core,
            resolvePathToNodeIdx,
        });

        // move circle below x-axis
        cx = 3;
        let desiredCy = -2;
        cy = 0;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy: desiredCy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: 0,
            diameter: 0,
            core,
            resolvePathToNodeIdx,
        });

        // move circle back up with center point
        cx = 1;
        cy = 8;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle1_exact({
            cx,
            cy,
            r: 4,
            diameter: 8,
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle where one center component depends on other center component", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" center="(1, $circle1.centerX1+1)" />
        <point extend="$circle1.center" name="centerCopy" />
    </graph>
  `,
        });

        let cx = 1;
        let cy = 2;
        await check_circle1_exact({ cx, cy, r: 1, core, resolvePathToNodeIdx });

        // move circle
        cx = -3;
        let desiredCy = 5;
        cy = -2;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy: desiredCy,
            core,
        });
        await check_circle1_exact({ cx, cy, r: 1, core, resolvePathToNodeIdx });

        // move center point
        cx = 8;
        desiredCy = 7;
        cy = 9;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: desiredCy,
            core,
        });
        await check_circle1_exact({ cx, cy, r: 1, core, resolvePathToNodeIdx });
    });

    // ====== Circle And Constraints ========
    async function getPoint3CenterBasedOnStateVars({
        core,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        let px =
            stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                .xs[0].tree;
        let py =
            stateVariables[await resolvePathToNodeIdx("point3")].stateValues
                .xs[1].tree;
        return [px, py];
    }

    async function check_circle_and_constrained_point({
        cx,
        cy,
        px,
        py,
        r,
        core,
        resolvePathToNodeIdx,
        includesInterior,
    }: {
        cx: number;
        cy: number;
        px: number;
        py: number;
        r: number;
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        includesInterior?: boolean;
    }) {
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        if (includesInterior) {
            expect(dist).lessThanOrEqual(r);
        } else {
            expect(dist).closeTo(r, 1e-12);
        }
        let stateVariables = await core.returnAllStateVariables(false, true);
        await check_circle1_and_copies_approx({
            cx,
            cy,
            r,
            stateVariables,
            resolvePathToNodeIdx,
            checkCopiedGraphs: false,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: r,
            y: 0,
            stateVariables,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: cx,
            y: cy,
            stateVariables,
        });

        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.point3")]
                .stateValues.xs[0].tree,
        ).eq(px);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.point3")]
                .stateValues.xs[1].tree,
        ).eq(py);

        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.radius.tree,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("graph2.circle1")]
                .stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
    }

    it("point constrained to circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math hide name="pX">$point1.x</math>
    <point name="point1">(3,0)</point>
    <point name="point2">(-1,7)</point>
    <graph name="graph1">
      <circle name="circle1" radius="$pX" center="$point2" />
      <point name="point3" x="-4" y="-6">
        <constrainTo>$circle1</constrainTo>
      </point>
    </graph>
    <graph>
      <point extend="$circle1.center" name="centerCopy" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph extend="$graph1" name="graph2" />
    `,
        });

        let cx = -1;
        let cy = 7;
        let r = 3;
        let [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        cx = 5;
        cy = -2;
        r = 3;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: cx,
            y: cy,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });

        // shrink circle
        cx = 5;
        cy = -2;
        r = 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: r,
            y: 0,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });

        // move point
        cx = 5;
        cy = -2;
        r = 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: -9,
            y: 8,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });

        // move circle shadow
        cx = -3;
        cy = 7;
        r = 1;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph2.circle1"),
            cx,
            cy,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });

        // move point shadow
        cx = -3;
        cy = 7;
        r = 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("graph2.point3"),
            x: 11,
            y: -21,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
        });
    });

    it("point constrained to interior of circle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math hide name="pX">$point1.x</math>
    <point name="point1">(3,0)</point>
    <point name="point2">(-1,7)</point>
    <graph name="graph1">
      <circle name="circle1" radius="$pX" center="$point2" filled />
      <point name="point3" x="-4" y="-6">
        <constrainToInterior>$circle1</constrainToInterior>
      </point>
      </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point x="$(circle1.radius)" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph extend="$graph1" name="graph2" />
    `,
        });

        // point should start on edge of circle
        let cx = -1;
        let cy = 7;
        let r = 3;
        let [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: false,
        });

        // move circle so original point is in middle
        ((cx = -5), (cy = -7));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: cx,
            y: cy,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: true,
        });

        // move circle away from original point location
        cx = 5;
        cy = -2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: cx,
            y: cy,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: true,
        });

        // shrink circle
        r = 1;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: r,
            y: 0,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: true,
        });

        // move point into circle
        px = 5.3;
        py = -2.5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: px,
            y: py,
            core,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: true,
        });

        // attempt to move point out of circle, point should end up on edge of circle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: -9,
            y: 8,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: false,
        });

        // move circle shadow
        ((cx = -3), (cy = 7));
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph2.circle1"),
            cx,
            cy,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: false,
        });

        // attempt to move point shadow out of circle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("graph2.point3"),
            x: -9,
            y: 8,
            core,
        });
        [px, py] = await getPoint3CenterBasedOnStateVars({
            core,
            resolvePathToNodeIdx,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: false,
        });

        // move point shadow into circle
        px = -2.8;
        py = 7.7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("graph2.point3"),
            x: px,
            y: py,
            core,
        });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            resolvePathToNodeIdx,
            includesInterior: true,
        });
    });

    function nearestSnap(desiredX, desiredY) {
        let x = Math.round(desiredX / 3) * 3;
        let y = Math.round(desiredY / 2) * 2;
        return [x, y];
    }

    async function check_circle_attr_constrained({
        cx,
        cy,
        r,
        tx,
        ty,
        core,
        resolvePathToNodeIdx,
    }) {
        let stateVariables = await core.returnAllStateVariables(false, true);
        await check_circle1_and_copies_approx({
            cx,
            cy,
            r,
            stateVariables,
            resolvePathToNodeIdx,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: cx,
            y: cy,
            stateVariables,
        });
        check_point_approx({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: tx,
            y: ty,
            stateVariables,
        });
    }

    it("circle with center and through point, center constrained", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,4)
          <constrainToGrid dx="3" dy="2" />
        </point>
        <point name="point2">(5,6)</point>
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3" x="$circle1.radius" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let cx = 3;
        let cy = 4;
        let tx = 5;
        let ty = 6;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));

        let dx = -2;
        let dy = -6;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        let desiredCx = cx;
        let desiredCy = cy;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        tx += cx - desiredCx;
        ty += cy - desiredCy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move defining center
        desiredCx = -5;
        desiredCy = 5;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: desiredCx,
            y: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move reffed center
        desiredCx = 1;
        desiredCy = -1;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: desiredCx,
            y: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move through point
        tx = -4;
        ty = 3;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: tx,
            y: ty,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // change reffed radius
        r = r / 4;
        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: r,
            y: 0,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle2
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        dx = 4;
        dy = -1;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        desiredCx = cx;
        desiredCy = cy;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        tx += cx - desiredCx;
        ty += cy - desiredCy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle3
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        dx = -5;
        dy = 4;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        desiredCx = cx;
        desiredCy = cy;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        tx += cx - desiredCx;
        ty += cy - desiredCy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle with center and through point, through point constrained", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,4)
        </point>
        <point name="point2">(5,7)
          <constrainToGrid dx="3" dy="2" />
        </point>
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3" x="$(circle1.radius)" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
      <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let cx = 3;
        let cy = 4;
        let tx = 6;
        let ty = 8;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle
        let dx = -2;
        let dy = -6;
        let desiredCx = cx + dx;
        let desiredCy = cy + dy;
        tx += dx;
        ty += dy;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        tx += cx - desiredCx;
        ty += cy - desiredCy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move defining center
        cx = -5;
        cy = 5;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move reffed center
        cx = 1;
        cy = -1;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move through point
        let desiredTx = -4;
        let desiredTy = 3;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: desiredTx,
            y: desiredTy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // change reffed radius
        let desiredR = r / 4;
        desiredTx = cx + (tx - cx) / 4;
        desiredTy = cy + (ty - cy) / 4;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: desiredR,
            y: 0,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle2
        dx = 4;
        dy = -1;
        desiredCx = cx + dx;
        desiredCy = cy + dy;
        desiredTx = tx + dx;
        desiredTy = ty + dy;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        cx = desiredCx + tx - desiredTx;
        cy = desiredCy + ty - desiredTy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });

        // move circle3
        dx = -5;
        dy = 4;
        desiredCx = cx + dx;
        desiredCy = cy + dy;
        desiredTx = tx + dx;
        desiredTy = ty + dy;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        cx = desiredCx + tx - desiredTx;
        cy = desiredCy + ty - desiredTy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({
            cx,
            cy,
            r,
            tx,
            ty,
            core,
            resolvePathToNodeIdx,
        });
    });

    it("circle through two points, one point constrained", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)
            <constrainToGrid dx="3" dy="2" />
        </point>
        <point name="point2">(3,4)</point>
        <circle name="circle1" through="$point1 $point2"/>
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3" x="$circle1.radius" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });
        async function check_items({ cx, cy, r, t1x, t1y, t2x, t2y }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph3.circle")]
                    .stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("graph4.circle")]
                    .stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point1")].stateValues
                    .xs[0].tree,
            ).closeTo(t1x, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point1")].stateValues
                    .xs[1].tree,
            ).closeTo(t1y, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point2")].stateValues
                    .xs[0].tree,
            ).closeTo(t2x, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("point2")].stateValues
                    .xs[1].tree,
            ).closeTo(t2y, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("centerCopy")]
                    .stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("centerCopy")]
                    .stateValues.xs[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("radiusNumber")]
                    .stateValues.value.tree,
            ).closeTo(r, 1e-12);
        }

        let t1x = 3;
        let t1y = -2;
        let t2x = 3;
        let t2y = 4;
        let r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move circle
        let dx = -2;
        let dy = -7;
        let desiredT1x = t1x + dx;
        let desiredT1y = t1y + dy;
        t2x += dx;
        t2y += dy;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        t2x += t1x - desiredT1x;
        t2y += t1y - desiredT1y;
        let desiredCx = (t1x + t2x) / 2;
        let desiredCy = (t1y + t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move first through point
        desiredT1x = 4;
        desiredT1y = -1;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: desiredT1x,
            y: desiredT1y,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move second through point
        t2x = 8;
        t2y = -3;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: t2x,
            y: t2y,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move center
        dx = 2;
        dy = -3;
        desiredCx = cx + dx;
        desiredCy = cy + dy;
        desiredT1x = t1x + dx;
        desiredT1y = t1y + dy;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        t2x += dx;
        t2y += dy;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: desiredCx,
            y: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move radius to half size
        let desiredR = r / 2;
        desiredCx = (t1x + t2x) / 2;
        desiredCy = (t1y + t2y) / 2;
        desiredT1x = desiredCx + (t1x - desiredCx) / 2;
        desiredT1y = desiredCy + (t1y - desiredCy) / 2;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        t2x = desiredCx + (t2x - desiredCx) / 2;
        t2y = desiredCy + (t2y - desiredCy) / 2;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: desiredR,
            y: 0,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move circle2
        dx = -8;
        dy = 5;
        desiredT1x = t1x + dx;
        desiredT1y = t1y + dy;
        t2x += dx;
        t2y += dy;
        desiredCx = (desiredT1x + t2x) / 2;
        desiredCy = (desiredT1y + t2y) / 2;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        t2x += t1x - desiredT1x;
        t2y += t1y - desiredT1y;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });

        // move circle3
        dx = -3;
        dy = 3;
        desiredT1x = t1x + dx;
        desiredT1y = t1y + dy;
        t2x += dx;
        t2y += dy;
        desiredCx = (desiredT1x + t2x) / 2;
        desiredCy = (desiredT1y + t2y) / 2;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        t2x += t1x - desiredT1x;
        t2y += t1y - desiredT1y;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y });
    });

    it("circle through three points, one point constrained", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)
                <constrainToGrid dx="3" dy="2" />
        </point>
        <point name="point3">(-3,4)</point>
        <circle name= "circle1" through="$point1 $point2 $point3" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
    <math extend="$circle1.diameter" name="diam" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        async function check_items({
            cx,
            cy,
            r,
            t1x,
            t1y,
            t2x,
            t2y,
            t3x,
            t3y,
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point3"),
                x: t3x,
                y: t3y,
                stateVariables,
            });
            expect(
                stateVariables[await resolvePathToNodeIdx("diam")].stateValues
                    .value.tree,
            ).closeTo(2 * r, 1e-12);
        }

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let t3x = -3;
        let t3y = 4;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, t3x, t3y });

        // move circle up and to the right
        let desiredDx = 5;
        let desiredDy = 3;
        let desiredCx = cx + desiredDx;
        let desiredCy = cy + desiredDy;
        let [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, t3x, t3y });

        // move circle2
        desiredDx = -5;
        desiredDy = -2.2;
        desiredCx = cx + desiredDx;
        desiredCy = cy + desiredDy;
        [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, t3x, t3y });

        // move circle3
        desiredDx = 7;
        desiredDy = -2.99999999999;
        desiredCx = cx + desiredDx;
        desiredCy = cy + desiredDy;
        [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, t3x, t3y });
    });

    it("circle through three points, two points constrained", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)
                <constrainToGrid dx="3" dy="2" />
        </point>
        <point name="point3">(-3,4)
                <constrainToGrid dx="3" dy="2" />
        </point>
        <circle name="circle1" through="$point1 $point2 $point3" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point x="$circle1.radius" y="0" />
    </graph>
        <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />
        <math extend="$circle1.diameter" name="diam" displayDigits="8" />
    <graph name="graph3">
        <circle extend="$circle1" name="circle" />
    </graph>
    <graph extend="$graph3" name="graph4" />
    `,
        });

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let t3x = -3;
        let t3y = 4;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({
            core,
            resolvePathToNodeIdx,
        });

        const test_items = async function () {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point1"),
                x: t1x,
                y: t1y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point2"),
                x: t2x,
                y: t2y,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point3"),
                x: t3x,
                y: t3y,
                stateVariables,
            });
            expect(
                stateVariables[await resolvePathToNodeIdx("diam")].stateValues
                    .value.tree,
            ).closeTo(2 * r, 1e-12);
        };
        await test_items();

        // move circle up and to the right
        let desiredDx = 5;
        let desiredDy = 3;
        let desiredCx = cx + desiredDx;
        let desiredCy = cy + desiredDy;
        let [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await test_items();

        // move circle2
        desiredDx = -4.9;
        desiredDy = -2.2;
        desiredCx = cx + desiredDx;
        desiredCy = cy + desiredDy;
        [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph3.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await test_items();

        // move circle3
        desiredDx = 7.1;
        desiredDy = -2.9;
        desiredCx = cx + desiredDx;
        desiredCy = cy + desiredDy;
        [dx, dy] = nearestSnap(desiredDx, desiredDy);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("graph4.circle"),
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await test_items();
    });

    it.todo(
        "circle through three points, two points constrained on different snap grids",
    );

    it("triangle inscribed in circle, copy center coordinates separately and radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number hide name="fixedZero" fixed>0</number>
    <graph>
        <triangle layer="1" name="t" vertices="(1,2) (3,5) (-5,2)" />
        <circle name="c" through="$t.vertex1 $t.vertex2 $t.vertex3" />  
        <point name="x">
            ($c.center.x,
            $fixedZero)
        </point>  
        <point name="y">
            ($fixedZero,
            $c.center.y)
        </point>
        <point name="r">
            ($c.radius, 5)
        </point>
    </graph>
    `,
        });

        let t1x = 1;
        let t1y = 2;
        let t2x = 3;
        let t2y = 5;
        let t3x = -5;
        let t3y = 2;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let cx =
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .numericalCenter[0];
            let cy =
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .numericalCenter[1];
            let r =
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .numericalRadius;
            expect(Math.hypot(t1x - cx, t1y - cy)).closeTo(r, 1e-12);
            expect(Math.hypot(t2x - cx, t2y - cy)).closeTo(r, 1e-12);
            expect(Math.hypot(t3x - cx, t3y - cy)).closeTo(r, 1e-12);
            let vertices =
                stateVariables[await resolvePathToNodeIdx("t")].stateValues
                    .vertices;
            expect(vertices[0][0].tree).closeTo(t1x, 1e-12);
            expect(vertices[0][1].tree).closeTo(t1y, 1e-12);
            expect(vertices[1][0].tree).closeTo(t2x, 1e-12);
            expect(vertices[1][1].tree).closeTo(t2y, 1e-12);
            expect(vertices[2][0].tree).closeTo(t3x, 1e-12);
            expect(vertices[2][1].tree).closeTo(t3y, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("x")].stateValues
                    .xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("y")].stateValues
                    .xs[1].tree,
            ).closeTo(cy, 1e-12);
        }
        await check_items();

        // move triangle points
        t1x = -3;
        t1y = 1;
        t2x = 4;
        t2y = 0;
        t3x = -1;
        t3y = 7;
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("t"),
            core,
            pointCoords: [
                [t1x, t1y],
                [t2x, t2y],
                [t3x, t3y],
            ],
        });
        await check_items();

        // move circle via center
        let stateVariables = await core.returnAllStateVariables(false, true);
        let cx =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .numericalCenter[0];
        let cy =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .numericalCenter[1];
        let r =
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .numericalRadius;
        let dx = 2;
        let dy = -3;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("c"),
            cx,
            cy,
            core,
        });
        await check_items();

        // move circle center x
        dx = -5;
        cx += dx;
        t1x += dx;
        t2x += dx;
        t3x += dx;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("x"),
            x: cx,
            y: 0,
            core,
        });
        await check_items();

        // move circle center y
        dy = 6;
        cy += dy;
        t1y += dy;
        t2y += dy;
        t3y += dy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("y"),
            x: 0,
            y: cy,
            core,
        });
        await check_items();

        // shrink radius
        let radiusFactor = 0.4;
        r = r * radiusFactor;
        t1x = cx + (t1x - cx) * radiusFactor;
        t1y = cy + (t1y - cy) * radiusFactor;
        t2x = cx + (t2x - cx) * radiusFactor;
        t2y = cy + (t2y - cy) * radiusFactor;
        t3x = cx + (t3x - cx) * radiusFactor;
        t3y = cy + (t3y - cy) * radiusFactor;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r"),
            x: r,
            y: 0,
            core,
        });
        await check_items();

        // shrink radius to zero
        let prevT = [t1x, t1y, t2x, t2y, t3x, t3y]; // store prev values for later
        let prevR = r;

        let desiredR = -3;
        r = 0;
        t1x = cx;
        t1y = cy;
        t2x = cx;
        t2y = cy;
        t3x = cx;
        t3y = cy;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r"),
            x: desiredR,
            y: 0,
            core,
        });
        await check_items();

        // increase radius to 6
        r = 6;
        radiusFactor = r / prevR;
        [t1x, t1y, t2x, t2y, t3x, t3y] = prevT; // unpack prev values
        t1x = cx + (t1x - cx) * radiusFactor;
        t1y = cy + (t1y - cy) * radiusFactor;
        t2x = cx + (t2x - cx) * radiusFactor;
        t2y = cy + (t2y - cy) * radiusFactor;
        t3x = cx + (t3x - cx) * radiusFactor;
        t3y = cy + (t3y - cy) * radiusFactor;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("r"),
            x: r,
            y: 0,
            core,
        });
        await check_items();
    });

    it("copy propIndex of throughPoints, dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="(2,-3) (3,4) (-3,4)" />
    </graph> 
    <p><mathInput name="n" /></p>
    <p><point extend="$circle1.throughPoints[$n]" name="P" /></p>
    <p><math extend="$circle1.throughPoint2[$n]" name="x" /></p>
    `,
        });

        const t1x = 2;
        const t1y = -3;
        const t2x = 3;
        const t2y = 4;
        const t3x = -3;
        const t3y = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "1",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([t1x, t1y]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(t2x);

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([t2x, t2y]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eqls(t2y);

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "3",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([t3x, t3y]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("\uff3f");

        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("n"),
            latex: "4",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues.value
                .tree,
        ).eq("\uff3f");
    });

    it("all updatable with copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,0)</point>
        <point name="point2">(-1,7)</point>
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        <point extend="$circle1.center" name="centerCopy" />
        <point name="point3">
            ($centerCopy.y,
            $circle1.radius)
        </point>
        <circle extend="$circle1" name="circle2" />
    </graph>
    <math extend="$circle1.radius" name="radiusNumber" displayDigits="8" />

    `,
        });

        let cx = 3;
        let cy = 0;
        let tx = -1;
        let ty = 7;
        let r = Math.hypot(tx - cx, ty - cy);

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            await check_circle1_and_copies_approx({
                cx,
                cy,
                r,
                stateVariables,
                resolvePathToNodeIdx,
                checkCopiedGraphs: false,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point1"),
                x: cx,
                y: cy,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point2"),
                x: tx,
                y: ty,
                stateVariables,
            });
            check_point_approx({
                componentIdx: await resolvePathToNodeIdx("point3"),
                x: cy,
                y: r,
                stateVariables,
            });
            let circle2 =
                stateVariables[await resolvePathToNodeIdx("circle2")]
                    .stateValues;
            expect(circle2.center[0].tree).closeTo(cx, 1e-12);
            expect(circle2.center[1].tree).closeTo(cy, 1e-12);
            expect(circle2.numericalCenter[0]).closeTo(cx, 1e-12);
            expect(circle2.numericalCenter[1]).closeTo(cy, 1e-12);
            expect(circle2.radius.tree).closeTo(r, 1e-12);
            expect(circle2.numericalRadius).closeTo(r, 1e-12);
        }
        await check_items();

        // move circle 1
        let dx = -5;
        let dy = 4;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items();

        // move circle 2
        dx = 3;
        dy = -2;
        cx += dx;
        cy += dy;
        tx += dx;
        ty += dy;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle2"),
            cx,
            cy,
            core,
        });
        await check_items();

        // move copied center
        dx = -5;
        dy = -5;
        cx += dx;
        cy += dy;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items();

        // move defining center
        cx = -3;
        cy = 1;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: cx,
            y: cy,
            core,
        });
        await check_items();

        // move through point
        tx = 0;
        ty = 4;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point2"),
            x: tx,
            y: ty,
            core,
        });
        await check_items();

        // This test captures the actual behavior with this strange construction
        // Question: is this the desired behavior?
        // Not sure how to improve behavior in a way that wouldn't depend
        // on the order of which is updated first:
        // the x or y coordinate of the point moved

        // move point of refs (point 3)
        let desiredR = 2;
        let theta = Math.atan2(ty - cy, tx - cx);
        tx = cx + desiredR * Math.cos(theta);
        ty = cy + desiredR * Math.sin(theta);

        cy = -3;
        r = Math.hypot(tx - cx, ty - cy);
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: cy,
            y: desiredR,
            core,
        });
        await check_items();

        // move point 3 again
        // since center doesn't move, we get desired radius
        theta = Math.atan2(ty - cy, tx - cx);
        tx = cx + desiredR * Math.cos(theta);
        ty = cy + desiredR * Math.sin(theta);
        r = desiredR;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point3"),
            x: cy,
            y: desiredR,
            core,
        });
        await check_items();
    });

    it("essential center can combine coordinates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <graph>
            <circle name="circle1"/>
            <point name="point1">
            ($circle1.center.y,
            $circle1.center.x)
            </point>
            <point extend="$circle1.center" name="centerCopy" />
        </graph>
        `,
        });

        async function check_items({
            cx,
            cy,
            core,
        }: {
            cx: number;
            cy: number;
            core: PublicDoenetMLCore;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalRadius,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("circle1")]
                    .stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("centerCopy")]
                    .stateValues.coords.tree,
            ).eqls(["vector", cx, cy]);
            // flipped coordinates for point
            expect(
                stateVariables[await resolvePathToNodeIdx("point1")].stateValues
                    .coords.tree,
            ).eqls(["vector", cy, cx]);
        }

        // circle center coords, will be flipped for point
        let cx = 0;
        let cy = 0;

        // move circle
        cx = -7;
        cy = 2;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circle1"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, core });

        // move flipped point (cy is point1's x coordinate)
        cy = -3;
        cx = -5;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("point1"),
            x: cy,
            y: cx,
            core,
        });
        await check_items({ cx, cy, core });

        // move center point
        cx = 1;
        cy = -4;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("centerCopy"),
            x: cx,
            y: cy,
            core,
        });
        await check_items({ cx, cy, core });
    });

    it("handle initially undefined center", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Center: <mathInput name="c" /></p>
    <graph>
        <circle center="$c" name="circ" />
    </graph>
    <graph>
        <circle extend="$circ" name="circ2" />
    </graph>
  `,
        });

        async function check_items({
            cx,
            cy,
            core,
        }: {
            cx: number;
            cy: number;
            core: PublicDoenetMLCore;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("circ")].stateValues
                    .numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("circ")].stateValues
                    .numericalRadius,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("circ2")].stateValues
                    .numericalCenter,
            ).eqls([cx, cy]);
            expect(
                stateVariables[await resolvePathToNodeIdx("circ2")].stateValues
                    .numericalRadius,
            ).eq(1);
        }

        let cx = NaN;
        let cy = NaN;
        await check_items({ cx, cy, core });

        // enter point for center
        cx = 2;
        cy = 1;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("c"),
            latex: `(${cx},${cy})`,
            core,
        });
        await check_items({ cx, cy, core });

        // move circle
        cx = -7;
        cy = 1;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circ"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, core });

        // change point for center
        cx = -7;
        cy = -4;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("c"),
            latex: `(${cx}, ${cy})`,
            core,
        });
        await check_items({ cx, cy, core });

        // move circle2
        cx = 6;
        cy = 9;
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("circ2"),
            cx,
            cy,
            core,
        });
        await check_items({ cx, cy, core });

        // center undefined again
        cx = NaN;
        cy = NaN;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("c"),
            latex: "",
            core,
        });
        await check_items({ cx, cy, core });

        // enter new point for center
        cx = 5;
        cy = 4;
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("c"),
            latex: `(${cx}, ${cy})`,
            core,
        });
        await check_items({ cx, cy, core });
    });

    it("overwrite attributes on copy", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <circle name="c" />
  </graph>

  <p>Change radius: <mathInput name="rc" bindValueTo="$(c.radius)" /></p>
  <p>Change center: <mathInput name="cc" bindValueTo="$(c.center)" /></p>

  <graph>
    <point name="P">(3,4)</point>
    <circle extend="$c" center="$P" name="c1" />
  </graph>

  <p>Change radius: <mathInput name="rc1" bindValueTo="$(c1.radius)" /></p>
  <p>Change center: <mathInput name="cc1" bindValueTo="$(c1.center)" /></p>

  <graph>
    <point name="Q">(7,7)</point>
    <circle extend="$c1" through="$Q" name="c2" />
  </graph>

  <p>Change radius: <mathInput name="rc2" bindValueTo="$(c2.radius)" /></p>
  <p>Change center: <mathInput name="cc2" bindValueTo="$(c2.center)" /></p>

  <graph>
    <circle extend="$c" radius="$src3" name = "c3" />
  </graph>

  <p>Set radius: <mathInput name="src3" prefill="3" /></p>
  <p>Change radius: <mathInput name="rc3" bindValueTo="$(c3.radius)" /></p>
  <p>Change center: <mathInput name="cc3" bindValueTo="$(c3.center)" /></p>

  `,
        });

        async function check_items({
            c,
            c1,
            c2,
            c3,
            p,
            q,
            core,
        }: {
            c: {
                x: number | string | (number | string)[];
                y: number | string | (number | string)[];
                r: number | string | (number | string)[];
            };
            c1: {
                x: number | string | (number | string)[];
                y: number | string | (number | string)[];
                r: number | string | (number | string)[];
            };
            c2: {
                x: number | string | (number | string)[];
                y: number | string | (number | string)[];
                r: number | string | (number | string)[];
            };
            c3: {
                x: number | string | (number | string)[];
                y: number | string | (number | string)[];
                r: number | string | (number | string)[];
            };
            p: { x: number; y: number };
            q: { x: number; y: number };
            core: PublicDoenetMLCore;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .radius.tree,
            ).eqls(c.r);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([c.x, c.y]);
            expect(
                stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                    .radius.tree,
            ).eqls(c1.r);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c1")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([c1.x, c1.y]);
            expect(
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .radius.tree,
            ).eqls(c2.r);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c2")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([c2.x, c2.y]);
            expect(
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .radius.tree,
            ).eqls(c3.r);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c3")
                ].stateValues.center.map((v) => v.tree),
            ).eqls([c3.x, c3.y]);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("P")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([p.x, p.y]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("Q")
                ].stateValues.xs.map((v) => v.tree),
            ).eqls([q.x, q.y]);
        }

        await check_items({
            core,
            c: { x: 0, y: 0, r: 1 },
            c1: { x: 3, y: 4, r: 1 },
            c2: { x: 3, y: 4, r: 5 },
            c3: { x: 0, y: 0, r: 3 },
            p: { x: 3, y: 4 },
            q: { x: 7, y: 7 },
        });

        // move original circle
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("c"),
            cx: -1,
            cy: 2,
            core,
        });
        await check_items({
            core,
            c: { x: -1, y: 2, r: 1 },
            c1: { x: 3, y: 4, r: 1 },
            c2: { x: 3, y: 4, r: 5 },
            c3: { x: -1, y: 2, r: 3 },
            p: { x: 3, y: 4 },
            q: { x: 7, y: 7 },
        });

        // enter non-numeric radius and center for origin circle
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("rc"),
            latex: `1+x`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("cc"),
            latex: `(-1,y)`,
            core,
        });
        await check_items({
            core,
            c: { x: -1, y: "y", r: ["+", 1, "x"] },
            c1: { x: 3, y: 4, r: ["+", 1, "x"] },
            c2: { x: 3, y: 4, r: 5 },
            c3: { x: -1, y: "y", r: 3 },
            p: { x: 3, y: 4 },
            q: { x: 7, y: 7 },
        });

        // set radius and center for origin circle back to number using other components
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("rc1"),
            latex: `2`,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("cc3"),
            latex: `(4,5)`,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 2 },
            c1: { x: 3, y: 4, r: 2 },
            c2: { x: 3, y: 4, r: 5 },
            c3: { x: 4, y: 5, r: 3 },
            p: { x: 3, y: 4 },
            q: { x: 7, y: 7 },
        });

        // move point P and set radius of second circle
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P"),
            x: -5,
            y: 2,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("rc1"),
            latex: `4`,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 4 },
            c1: { x: -5, y: 2, r: 4 },
            c2: { x: -5, y: 2, r: 13 },
            c3: { x: 4, y: 5, r: 3 },
            p: { x: -5, y: 2 },
            q: { x: 7, y: 7 },
        });

        // move point Q
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("Q"),
            x: 3,
            y: 8,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 4 },
            c1: { x: -5, y: 2, r: 4 },
            c2: { x: -5, y: 2, r: 10 },
            c3: { x: 4, y: 5, r: 3 },
            p: { x: -5, y: 2 },
            q: { x: 3, y: 8 },
        });

        // set radius of third circle
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("rc2"),
            latex: `5`,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 4 },
            c1: { x: -5, y: 2, r: 4 },
            c2: { x: -5, y: 2, r: 5 },
            c3: { x: 4, y: 5, r: 3 },
            p: { x: -5, y: 2 },
            q: { x: -1, y: 5 },
        });

        // set center of third circle
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("cc2"),
            latex: `(5,-3)`,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 4 },
            c1: { x: 5, y: -3, r: 4 },
            c2: { x: 5, y: -3, r: 10 },
            c3: { x: 4, y: 5, r: 3 },
            p: { x: 5, y: -3 },
            q: { x: -1, y: 5 },
        });

        // set radius of fourth circle
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("src3"),
            latex: `9`,
            core,
        });
        await check_items({
            core,
            c: { x: 4, y: 5, r: 4 },
            c1: { x: 5, y: -3, r: 4 },
            c2: { x: 5, y: -3, r: 10 },
            c3: { x: 4, y: 5, r: 9 },
            p: { x: 5, y: -3 },
            q: { x: -1, y: 5 },
        });

        // move and change radius of fourth circle
        await moveCircle({
            componentIdx: await resolvePathToNodeIdx("c3"),
            cx: 3,
            cy: 8,
            core,
        });
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("rc3"),
            latex: `9`,
            core,
        });
        await check_items({
            core,
            c: { x: 3, y: 8, r: 4 },
            c1: { x: 5, y: -3, r: 4 },
            c2: { x: 5, y: -3, r: 10 },
            c3: { x: 3, y: 8, r: 9 },
            p: { x: 5, y: -3 },
            q: { x: -1, y: 5 },
        });
    });

    it("circle warnings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<circle name="c1" through="(a,b) (c,d)" />
<circle name="c2" through="(1,2) (3,4) (5,6) (7,8)" />
<circle name="c3" center="(1,2)" radius="1" through="(3,4)" />
<circle name="c4" center="(1,2)" through="(1,2) (3,4)" />
<circle name="c5" radius="1" through="(-4,0) (4,0)" />
<circle name="c6" radius="1" through="(-4,0) (3,4) (4,0)" />
<circle name="c7" center="(a,b)" through="(c,d) (e,f)" />
<circle name="c8" through="(a,b) (c,d)" radius="1" />

$c7.radius
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(8);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot calculate radius of circle with specified center through more than 1 point",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(8);
        expect(errorWarnings.warnings[0].position.start.column).eq(1);
        expect(errorWarnings.warnings[0].position.end.line).eq(8);
        expect(errorWarnings.warnings[0].position.end.column).eq(58);

        expect(errorWarnings.warnings[1].message).contain(
            "Haven't implemented <circle> through 2 points in case where the points don't have numerical values",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.start.line).eq(2);
        expect(errorWarnings.warnings[1].position.start.column).eq(1);
        expect(errorWarnings.warnings[1].position.end.line).eq(2);
        expect(errorWarnings.warnings[1].position.end.column).eq(43);

        expect(errorWarnings.warnings[2].message).contain(
            "Cannot calculate circle through more than 3 points",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].position.start.line).eq(3);
        expect(errorWarnings.warnings[2].position.start.column).eq(1);
        expect(errorWarnings.warnings[2].position.end.line).eq(3);
        expect(errorWarnings.warnings[2].position.end.column).eq(55);

        expect(errorWarnings.warnings[3].message).contain(
            "Cannot calculate circle with specified radius, center and through points",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].position.start.line).eq(4);
        expect(errorWarnings.warnings[3].position.start.column).eq(1);
        expect(errorWarnings.warnings[3].position.end.line).eq(4);
        expect(errorWarnings.warnings[3].position.end.column).eq(63);

        expect(errorWarnings.warnings[4].message).contain(
            "Cannot calculate circle with specified center through more than 1 point",
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].position.start.line).eq(5);
        expect(errorWarnings.warnings[4].position.start.column).eq(1);
        expect(errorWarnings.warnings[4].position.end.line).eq(5);
        expect(errorWarnings.warnings[4].position.end.column).eq(58);

        expect(errorWarnings.warnings[5].message).contain(
            "Cannot calculate circle: given that the distance between the two points is 8, the specified radius 1 is too small",
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].position.start.line).eq(6);
        expect(errorWarnings.warnings[5].position.start.column).eq(1);
        expect(errorWarnings.warnings[5].position.end.line).eq(6);
        expect(errorWarnings.warnings[5].position.end.column).eq(55);

        expect(errorWarnings.warnings[6].message).contain(
            "Cannot create circle through more than two points with a specified radius",
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].position.start.line).eq(7);
        expect(errorWarnings.warnings[6].position.start.column).eq(1);
        expect(errorWarnings.warnings[6].position.end.line).eq(7);
        expect(errorWarnings.warnings[6].position.end.column).eq(61);

        expect(errorWarnings.warnings[7].message).contain(
            "Cannot create circle through more than one point with specified radius when don't have numerical values",
        );
        expect(errorWarnings.warnings[7].level).eq(1);
        expect(errorWarnings.warnings[7].position.start.line).eq(9);
        expect(errorWarnings.warnings[7].position.start.column).eq(1);
        expect(errorWarnings.warnings[7].position.end.line).eq(9);
        expect(errorWarnings.warnings[7].position.end.column).eq(54);
    });

    it("handle bad center/through", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <circle name="circle1" center="A" through="B" />
    </graph>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("circle1")]).not.eq(
            undefined,
        );
    });

    it("area and circumference", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
        <circle name="c" center="(1,4)" />
    </graph>
    <p>Area: <math extend="$c.area" name="area" /></p>
    <p>Area as number: <number extend="$c.area" name="area2" /></p>
    <p>Circumference: <math extend="$c.circumference" name="circumference" /></p>
    <p>Circumference as number: <number extend="$c.circumference" name="circumference2" /></p>
    <p>Change radius: <mathInput name="r">$c.radius</mathInput></p>
    `,
        });

        async function check_items({
            area,
            area2,
            circ,
            circ2,
        }: {
            area: any;
            area2: number;
            circ: any;
            circ2: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("area")].stateValues
                    .value.tree,
            ).eqls(area);
            expect(
                stateVariables[await resolvePathToNodeIdx("area2")].stateValues
                    .value,
            ).eqls(area2);
            expect(
                stateVariables[await resolvePathToNodeIdx("circumference")]
                    .stateValues.value.tree,
            ).eqls(circ);
            expect(
                stateVariables[await resolvePathToNodeIdx("circumference2")]
                    .stateValues.value,
            ).eqls(circ2);
        }

        await check_items({
            area: "pi",
            area2: Math.PI,
            circ: ["*", 2, "pi"],
            circ2: 2 * Math.PI,
        });

        // change radius
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("r"),
            latex: `3`,
            core,
        });
        await check_items({
            area: ["*", 9, "pi"],
            area2: 9 * Math.PI,
            circ: ["*", 6, "pi"],
            circ2: 6 * Math.PI,
        });

        // change to symbolic radius
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("r"),
            latex: `a`,
            core,
        });
        await check_items({
            area: ["*", "pi", ["^", "a", 2]],
            area2: NaN,
            circ: ["*", 2, "a", "pi"],
            circ2: NaN,
        });

        // back to numeric radius
        await updateMathInputValue({
            componentIdx: await resolvePathToNodeIdx("r"),
            latex: `5`,
            core,
        });
        await check_items({
            area: ["*", 25, "pi"],
            area2: 25 * Math.PI,
            circ: ["*", 10, "pi"],
            circ2: 10 * Math.PI,
        });
    });

    it("circle with rounding", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <circle center="(12.3456789, 0.123456789)" radius="1234.56789" name="c1" />
    <p>
      <number extend="$c1.radius" name="c1r" />
      <number extend="$c1.diameter" name="c1d" />
      <coords extend="$c1.center" name="c1c" />
    </p>
    <circle extend="$c1" displayDigits="4" displayDecimals="1" name="c1a" />
    <p>
      <number extend="$c1a.radius" name="c1ar" />
      <number extend="$c1a.diameter" name="c1ad" />
      <coords extend="$c1a.center" name="c1ac" />
    </p>
    <circle through="(1234.56789, 0.123456789)" name="c2" />
    <p name="pc2tp"><point extend="$c2.throughPoint1" name="c2tp" /></p>
    <circle extend="$c2" displayDigits="4" displayDecimals="1" name="c2a" />
    <p name="pc2atp"><point extend="$c2a.throughPoint1" name="c2atp" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c1r")].stateValues.text,
        ).eqls("1234.57");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1d")].stateValues.text,
        ).eqls("2469.14");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1c")].stateValues.text,
        ).eqls("( 12.35, 0.123 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("c1ar")].stateValues.text,
        ).eqls("1234.6");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1ad")].stateValues.text,
        ).eqls("2469.1");
        expect(
            stateVariables[await resolvePathToNodeIdx("c1ac")].stateValues.text,
        ).eqls("( 12.35, 0.1235 )");

        expect(
            stateVariables[await resolvePathToNodeIdx("pc2tp")].stateValues
                .text,
        ).eqls("( 1234.57, 0.123 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pc2atp")].stateValues
                .text,
        ).eqls("( 1234.6, 0.1235 )");
    });

    it("circle style descriptions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
        <styleDefinition stylenumber="1" lineColor="blue" fillColor="blue" lineWidth="2" lineStyle="solid" />
        <styleDefinition stylenumber="2" lineColor="red" fillColor="green" lineWidth="2" lineStyle="solid" />

        <styleDefinition stylenumber="3" lineColor="blue" fillColor="blue" lineWidth="5" lineStyle="solid" />
        <styleDefinition stylenumber="4" lineColor="red" fillColor="green" lineWidth="1" lineStyle="dotted" />
    </setup>

    <graph>
      <circle center="(-8,0)" name="c1" />
      <circle center="(-8,4)" name="c2" filled />
      <circle center="(-4,0)" name="c3" stylenumber="2" />
      <circle center="(-4,4)" name="c4" stylenumber="2" filled />

      <circle center="(0,0)" name="c5" stylenumber="3"/>
      <circle center="(0,4)" name="c6" stylenumber="3" filled />
      <circle center="(4,0)" name="c7" stylenumber="4" />
      <circle center="(4,4)" name="c8" stylenumber="4" filled />

    </graph>

    <p>
        First circle is <text extend="$c1.styleDescription" name="st1" />.
        It is a <text extend="$c1.styleDescriptionWithNoun" name="stn1" />. 
        Its border is <text extend="$c1.borderStyleDescription" name="bst1" />.
        Its fill is <text extend="$c1.fillStyleDescription" name="fst1" />.
    </p>
    <p>
        Second circle is <text extend="$c2.styleDescription" name="st2" />.
        It is a <text extend="$c2.styleDescriptionWithNoun" name="stn2" />. 
        Its border is <text extend="$c2.borderStyleDescription" name="bst2" />.
        Its fill is <text extend="$c2.fillStyleDescription" name="fst2" />.
    </p>
    <p>
        Third circle is <text extend="$c3.styleDescription" name="st3" />.
        It is a <text extend="$c3.styleDescriptionWithNoun" name="stn3" />. 
        Its border is <text extend="$c3.borderStyleDescription" name="bst3" />.
        Its fill is <text extend="$c3.fillStyleDescription" name="fst3" />.
    </p>
    <p>
        Fourth circle is <text extend="$c4.styleDescription" name="st4" />.
        It is a <text extend="$c4.styleDescriptionWithNoun" name="stn4" />. 
        Its border is <text extend="$c4.borderStyleDescription" name="bst4" />.
        Its fill is <text extend="$c4.fillStyleDescription" name="fst4" />.
    </p>

    <p>
        Fifth circle is <text extend="$c5.styleDescription" name="st5" />.
        It is a <text extend="$c5.styleDescriptionWithNoun" name="stn5" />. 
        Its border is <text extend="$c5.borderStyleDescription" name="bst5" />.
        Its fill is <text extend="$c5.fillStyleDescription" name="fst5" />.
    </p>
    <p>
        Sixth circle is <text extend="$c6.styleDescription" name="st6" />.
        It is a <text extend="$c6.styleDescriptionWithNoun" name="stn6" />. 
        Its border is <text extend="$c6.borderStyleDescription" name="bst6" />.
        Its fill is <text extend="$c6.fillStyleDescription" name="fst6" />.
    </p>
    <p>
        Seventh circle is <text extend="$c7.styleDescription" name="st7" />.
        It is a <text extend="$c7.styleDescriptionWithNoun" name="stn7" />. 
        Its border is <text extend="$c7.borderStyleDescription" name="bst7" />.
        Its fill is <text extend="$c7.fillStyleDescription" name="fst7" />.
    </p>
    <p>
        Eighth circle is <text extend="$c8.styleDescription" name="st8" />.
        It is a <text extend="$c8.styleDescriptionWithNoun" name="stn8" />. 
        Its border is <text extend="$c8.borderStyleDescription" name="bst8" />.
        Its fill is <text extend="$c8.fillStyleDescription" name="fst8" />.
    </p>


    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("st1")].stateValues.value,
        ).toContain("blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn1")].stateValues
                .value,
        ).toContain("blue circle");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst1")].stateValues
                .value,
        ).toContain("blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst1")].stateValues
                .value,
        ).toContain("unfilled");

        expect(
            stateVariables[await resolvePathToNodeIdx("st2")].stateValues.value,
        ).toContain("filled blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn2")].stateValues
                .value,
        ).toContain("filled blue circle");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst2")].stateValues
                .value,
        ).toContain("blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst2")].stateValues
                .value,
        ).toContain("blue");

        expect(
            stateVariables[await resolvePathToNodeIdx("st3")].stateValues.value,
        ).toContain("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn3")].stateValues
                .value,
        ).toContain("red circle");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst3")].stateValues
                .value,
        ).toContain("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst3")].stateValues
                .value,
        ).toContain("unfilled");

        expect(
            stateVariables[await resolvePathToNodeIdx("st4")].stateValues.value,
        ).toContain("filled green with red border");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn4")].stateValues
                .value,
        ).toContain("filled green circle with a red border");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst4")].stateValues
                .value,
        ).toContain("red");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst4")].stateValues
                .value,
        ).toContain("green");

        expect(
            stateVariables[await resolvePathToNodeIdx("st5")].stateValues.value,
        ).toContain("thick blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn5")].stateValues
                .value,
        ).toContain("thick blue circle");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst5")].stateValues
                .value,
        ).toContain("thick blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst5")].stateValues
                .value,
        ).toContain("unfilled");

        expect(
            stateVariables[await resolvePathToNodeIdx("st6")].stateValues.value,
        ).toContain("filled blue with thick border");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn6")].stateValues
                .value,
        ).toContain("filled blue circle with a thick border");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst6")].stateValues
                .value,
        ).toContain("thick blue");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst6")].stateValues
                .value,
        ).toContain("blue");

        expect(
            stateVariables[await resolvePathToNodeIdx("st7")].stateValues.value,
        ).toContain("thin dotted red");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn7")].stateValues
                .value,
        ).toContain("thin dotted red circle");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst7")].stateValues
                .value,
        ).toContain("thin dotted red");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst7")].stateValues
                .value,
        ).toContain("unfilled");

        expect(
            stateVariables[await resolvePathToNodeIdx("st8")].stateValues.value,
        ).toContain("filled green with thin dotted red border");
        expect(
            stateVariables[await resolvePathToNodeIdx("stn8")].stateValues
                .value,
        ).toContain("filled green circle with a thin dotted red border");
        expect(
            stateVariables[await resolvePathToNodeIdx("bst8")].stateValues
                .value,
        ).toContain("thin dotted red");
        expect(
            stateVariables[await resolvePathToNodeIdx("fst8")].stateValues
                .value,
        ).toContain("green");
    });

    it("hideOffGraphIndicator", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <circle name="P1" center="(12,3)" />
      <circle name="Q1" hideOffGraphIndicator center="(-2,14)" />
      <circle name="R1" hideOffGraphIndicator="false" center="(6,-14)" />
    </graph>

    <boolean extend="$P1.hideOffGraphIndicator" name="P1h" />
    <boolean extend="$Q1.hideOffGraphIndicator" name="Q1h" />
    <boolean extend="$R1.hideOffGraphIndicator" name="R1h" />

    <graph hideOffGraphIndicators>
      <circle name="P2" extend="$P1" />
      <circle name="Q2" extend="$Q1" />
      <circle name="R2" extend="$R1" />
    </graph>

    <boolean extend="$P2.hideOffGraphIndicator" name="P2h" />
    <boolean extend="$Q2.hideOffGraphIndicator" name="Q2h" />
    <boolean extend="$R2.hideOffGraphIndicator" name="R2h" />

    <graph hideOffGraphIndicators="false" >
      <circle name="P3" extend="$P1" />
      <circle name="Q3" extend="$Q1" />
      <circle name="R3" extend="$R1" />
    </graph>

    <boolean extend="$P3.hideOffGraphIndicator" name="P3h" />
    <boolean extend="$Q3.hideOffGraphIndicator" name="Q3h" />
    <boolean extend="$R3.hideOffGraphIndicator" name="R3h" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P1h")].stateValues.value,
        ).eqls(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q1h")].stateValues.value,
        ).eqls(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("R1h")].stateValues.value,
        ).eqls(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("P2h")].stateValues.value,
        ).eqls(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q2h")].stateValues.value,
        ).eqls(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("R2h")].stateValues.value,
        ).eqls(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("P3h")].stateValues.value,
        ).eqls(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q3h")].stateValues.value,
        ).eqls(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("R3h")].stateValues.value,
        ).eqls(false);
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" fillColor="brown" fillColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" fillColor="#540907" fillColorWord="dark red" fillColorDarkMode="#f0c6c5" fillColorWordDarkMode="light red" />
    </setup>
    <graph>
      <circle name="A" styleNumber="1" labelIsName center="(0,0)" filled />
      <circle name="B" styleNumber="2" labelIsName center="(2,2)" filled />
      <circle name="C" styleNumber="5" labelIsName center="(4,4)" filled />
    </graph>
    <p name="ADescription">Circle A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    <p name="ABorderDescription">A has a $A.borderStyleDescription border.</p>
    <p name="BBorderDescription">B has a $B.borderStyleDescription border.</p>
    <p name="CBorderDescription">C has a $C.borderStyleDescription border.</p>
    <p name="AFillDescription">A has a $A.fillStyleDescription fill.</p>
    <p name="BFillDescription">B has a $B.fillStyleDescription fill.</p>
    <p name="CFillDescription">C has a $C.fillStyleDescription fill.</p>
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
            ).eq(`Circle A is filled ${AColor} with thick border.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BDescription")]
                    .stateValues.text,
            ).eq(`B is a filled ${BShade} red circle.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CDescription")]
                    .stateValues.text,
            ).eq(`C is a filled ${CColor} circle with a thin border.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("ABorderDescription")]
                    .stateValues.text,
            ).eq(`A has a thick ${AColor} border.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BBorderDescription")]
                    .stateValues.text,
            ).eq(`B has a ${BShade} red border.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CBorderDescription")]
                    .stateValues.text,
            ).eq(`C has a thin ${CColor} border.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("AFillDescription")]
                    .stateValues.text,
            ).eq(`A has a ${AColor} fill.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("BFillDescription")]
                    .stateValues.text,
            ).eq(`B has a ${BShade} red fill.`);
            expect(
                stateVariables[await resolvePathToNodeIdx("CFillDescription")]
                    .stateValues.text,
            ).eq(`C has a ${CColor} fill.`);
        }

        await test_items("light");
        await test_items("dark");
    });
});
