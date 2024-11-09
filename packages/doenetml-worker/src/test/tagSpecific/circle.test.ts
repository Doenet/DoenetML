import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
} from "../utils/actions";
import Core from "../../Core";
import { X } from "vitest/dist/chunks/reporters.WnPwkmgA.js";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

async function moveCircle({
    name,
    cx,
    cy,
    core,
}: {
    name: string;
    cx: number;
    cy: number;
    core: Core;
}) {
    await core.requestAction({
        event: null,
        actionName: "moveCircle",
        componentName: name,
        args: { center: [cx, cy] },
    });
}

function check_circle1_approx({cx,cy,r,stateVariables, checkCopiedGraphs = true}: {
    cx: number;
    cy: number;
    r: number;
    stateVariables: any;
    checkCopiedGraphs?: boolean;
}) {
    expect(stateVariables["/circle1"].stateValues.center[0].tree).closeTo(
        cx,
        1e-12,
    );
    expect(stateVariables["/circle1"].stateValues.center[1].tree).closeTo(
        cy,
        1e-12,
    );
    expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
        r,
        1e-12,
    );

    expect(
        stateVariables["/centerCopy"].stateValues.xs[0].tree,
    ).closeTo(cx, 1e-12);
    expect(stateVariables["/centerCopy"].stateValues.xs[1].tree).closeTo(
        cy,
        1e-12,
    );
    expect(stateVariables["/radiusNumber"].stateValues.value.tree).closeTo(
        r,
        1e-12,
    );

    if(checkCopiedGraphs) {
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.radius.tree,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.radius.tree,
        ).closeTo(r, 1e-12);
    }
}


describe("Circle tag tests", async () => {
    async function test_circle_defined_by_center_and_radius({
        core,
        definingCenter,
        definingRadius,
        initialCx = 0,
        initialCy = 0,
        initialRadius = 1,
    }: {
        core: Core;
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

            const stateVariables = await returnAllStateVariables(core);
            // center and radius of original circle
            expect(
                stateVariables["/circle1"].stateValues.center.map(
                    (v) => v.tree,
                ),
            ).eqls([cx, cy]);
            expect(stateVariables["/circle1"].stateValues.numericalCenter).eqls(
                [cx, cy],
            );
            expect(stateVariables["/circle1"].stateValues.radius.tree).eq(
                actualRadius,
            );
            expect(stateVariables["/circle1"].stateValues.numericalRadius).eq(
                actualRadius,
            );

            // center and radius of circle2
            expect(
                stateVariables["/graph3/circle"].stateValues.center.map(
                    (v) => v.tree,
                ),
            ).eqls([cx, cy]);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(stateVariables["/graph3/circle"].stateValues.radius.tree).eq(
                actualRadius,
            );
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalRadius,
            ).eq(actualRadius);

            // center and radius of circle3
            expect(
                stateVariables["/graph4/circle"].stateValues.center.map(
                    (v) => v.tree,
                ),
            ).eqls([cx, cy]);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalCenter,
            ).eqls([cx, cy]);
            expect(stateVariables["/graph4/circle"].stateValues.radius.tree).eq(
                actualRadius,
            );
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalRadius,
            ).eq(actualRadius);

            // optional defining center
            if (definingCenter) {
                expect(
                    stateVariables[definingCenter].stateValues.xs.map(
                        (v) => v.tree,
                    ),
                ).eqls([cx, cy]);
            }

            // optional defining radius point
            if (definingRadius) {
                expect(
                    stateVariables[definingRadius].stateValues.value.tree,
                ).eq(radius);
            }

            // radius control point
            expect(stateVariables["/radiusControl"].stateValues.value.tree).eq(
                actualRadius,
            );

            // copied center
            expect(
                stateVariables["/centerCopy"].stateValues.xs.map((v) => v.tree),
            ).eqls([cx, cy]);

            // radius number not in graph
            expect(stateVariables["/radiusNumber"].stateValues.value.tree).eq(
                actualRadius,
            );
        }

        let cx = initialCx;
        let cy = initialCy;
        let radius = initialRadius;
        await check_items({ cx, cy, radius });

        // move circle
        cx = 2;
        cy = 3;
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_items({ cx, cy, radius });

        // attempt to set radius negative, but becomes zero
        radius = 0;
        await updateMathInputValue({
            componentName: "/radiusControl",
            latex: "-4",
            core,
        });
        await check_items({ cx, cy, radius });

        // change radius
        radius = 5;
        await updateMathInputValue({
            componentName: "/radiusControl",
            latex: radius.toString(),
            core,
        });
        await check_items({ cx, cy, radius });

        if (definingCenter) {
            // change center via defining point
            cx = 11;
            cy = -14;
            await movePoint({ name: definingCenter, x: cx, y: cy, core });
            await check_items({ cx, cy, radius });
        }

        if (definingRadius) {
            // set defining radius to negative, actual radius becomes zero
            radius = -3;
            await updateMathInputValue({
                componentName: definingRadius,
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });

            // change radius with defining point
            radius = 7;
            await updateMathInputValue({
                componentName: definingRadius,
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });
        }

        // change center
        cx = -6;
        cy = -2;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_items({ cx, cy, radius });

        // move circle2
        cx = -7;
        cy = 9;
        await moveCircle({ name: "/graph3/circle", cx, cy, core });
        await check_items({ cx, cy, radius });

        // move circle3
        cx = 6;
        cy = -8;
        await moveCircle({ name: "/graph4/circle", cx, cy, core });
        await check_items({ cx, cy, radius });
    }

    it("circle with no parameters gives unit circle", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <circle name="circle1"/>
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_center_and_radius({ core });
    });

    it("circle with center", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <point name="center">(-1,3)</point>
        <circle name="circle1" center="$center" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            initialCx: -1,
            initialCy: 3,
            definingCenter: "/center",
        });
    });

    it("circle with radius", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="2"/>
    <graph>
        <circle name="circle1" radius="$definingRadius" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
    </graph>  
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            initialCx: 0,
            initialCy: 0,
            initialRadius: 2,
            definingRadius: "/definingRadius",
        });
    });

    it("circle with radius and center", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="3"/>
    <graph>
        <point name="center">(-3,5)</point>
        <circle name="circle1" radius="$definingRadius" center="$center" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_center_and_radius({
            core,
            initialCx: -3,
            initialCy: 5,
            initialRadius: 3,
            definingRadius: "/definingRadius",
            definingCenter: "/center",
        });
    });

    async function test_circle_defined_by_radius_and_through_point({
        core,
        definingRadius,
        definingThroughPoint,
        initialCx = 0,
        initialCy = 0,
        initialRadius = 1,
    }: {
        core: Core;
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

            const stateVariables = await returnAllStateVariables(core);
            // center and radius of original circle
            expect(
                stateVariables["/circle1"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/circle1"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
                actualRadius,
                1e-12,
            );

            // center and radius of circle2
            expect(
                stateVariables["/graph3/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.radius.tree,
            ).closeTo(actualRadius, 1e-12);

            // center and radius of circle3
            expect(
                stateVariables["/graph4/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.radius.tree,
            ).closeTo(actualRadius, 1e-12);

            // defining through point
            expect(
                stateVariables[definingThroughPoint].stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables[definingThroughPoint].stateValues.xs[1].tree,
            ).closeTo(cy + actualRadius, 1e-12);

            // optional defining radius point
            if (definingRadius) {
                expect(
                    stateVariables[definingRadius].stateValues.value.tree,
                ).closeTo(radius, 1e-12);
            }

            // radius control point
            expect(
                stateVariables["/radiusControl"].stateValues.value.tree,
            ).closeTo(actualRadius, 1e-12);

            // copied center
            expect(
                stateVariables["/centerCopy"].stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/centerCopy"].stateValues.xs[1].tree,
            ).closeTo(cy, 1e-12);

            // radius number not in graph
            expect(
                stateVariables["/radiusNumber"].stateValues.value.tree,
            ).closeTo(actualRadius, 1e-12);
        }

        let cx = initialCx;
        let cy = initialCy;
        let radius = initialRadius;
        await check_items({ cx, cy, radius });

        // move circle
        cx = 2;
        cy = 3;
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_items({ cx, cy, radius });

        // attempt to set radius negative, but becomes zero
        cy += radius;
        radius = 0;
        await updateMathInputValue({
            componentName: "/radiusControl",
            latex: "-4",
            core,
        });
        await check_items({ cx, cy, radius });

        // change radius
        radius = 5;
        cy -= 5;
        await updateMathInputValue({
            componentName: "/radiusControl",
            latex: radius.toString(),
            core,
        });
        await check_items({ cx, cy, radius });

        // change defining through point
        cx = 11;
        cy = -14;
        await movePoint({
            name: definingThroughPoint,
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
                componentName: definingRadius,
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });

            // change radius with defining point
            radius = 7;
            cy -= 7;
            await updateMathInputValue({
                componentName: definingRadius,
                latex: radius.toString(),
                core,
            });
            await check_items({ cx, cy, radius });
        }

        // change center
        cx = -6;
        cy = -2;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_items({ cx, cy, radius });

        // move circle2
        cx = -7;
        cy = 9;
        await moveCircle({ name: "/graph3/circle", cx, cy, core });
        await check_items({ cx, cy, radius });

        // move circle3
        cx = 6;
        cy = -8;
        await moveCircle({ name: "/graph4/circle", cx, cy, core });
        await check_items({ cx, cy, radius });
    }

    it("circle through point", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <graph>
        <point name="definingThroughPoint">(2,-3)</point>
        <circle name="circle1" through="$definingThroughPoint" />
    </graph>
    <graph>
    $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
      $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_radius_and_through_point({
            core,
            initialCx: 2,
            initialCy: -3 - 1,
            initialRadius: 1,
            definingThroughPoint: "/definingThroughPoint",
        });
    });

    it("circle with radius and one through point", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput name="radiusControl">$circle1.radius</mathInput>
    <mathInput name="definingRadius" prefill="13"/>
    <graph>
        <point name="definingThroughPoint">(2,-3)</point>
        <circle name="circle1" through="$definingThroughPoint" radius="$definingRadius"/>
    </graph>
    <graph>
    $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
      $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        await test_circle_defined_by_radius_and_through_point({
            core,
            initialCx: 2,
            initialCy: -3 - 13,
            initialRadius: 13,
            definingThroughPoint: "/definingThroughPoint",
            definingRadius: "/definingRadius",
        });
    });

    it("circle through two points", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)</point>
        <circle name="circle1" through="$point1 $point2"/>
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point3" x="$(circle1.radius)" y="0" />
    </graph>
    <graph name="graph3" newNamespace>
      $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
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
        }: {
            cx: number;
            cy: number;
            r: number;
            t1x: number;
            t1y: number;
            t2x: number;
            t2y: number;
            core: Core;
        }) {
            let stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables["/circle1"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/circle1"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/circle1"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/circle1"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
                r,
                1e-12,
            );
            expect(
                stateVariables["/circle1"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                await stateVariables["/graph3/circle"].stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
                t1x,
                1e-12,
            );
            expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
                t1y,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
                t2x,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
                t2y,
                1e-12,
            );

            expect(
                stateVariables["/centerCopy"].stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/centerCopy"].stateValues.xs[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/radiusNumber"].stateValues.value.tree,
            ).closeTo(r, 1e-12);
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
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move circle
        t1x = -2;
        t1y = 0;
        t2x = -1;
        t2y = 7;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move first through point
        t1x = 4;
        t1y = -1;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move second through point on top of first
        t2x = t1x;
        t2y = t1y;
        r = 0;
        cx = t2x;
        cy = t2y;
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move second through point again
        t2x = 8;
        t2y = -3;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move center
        t1x += 2;
        t1y += -3;
        t2x += 2;
        t2y += -3;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move radius to half size
        t1x = 8 + (4 + 2 - 8) / 2;
        t1y = -5 + (-1 - 3 + 5) / 2;
        t2x = 8 + (8 + 2 - 8) / 2;
        t2y = -5 + (-3 - 3 + 5) / 2;
        [cx, cy, r] = calculateCenterAndRadius({ t1x, t1y, t2x, t2y });
        await movePoint({ name: "/point3", x: r, y: 0, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

        // move circle2
        let dx = 3;
        let dy = -2;
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        await moveCircle({ name: "/graph3/circle", cx, cy, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });

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
        await moveCircle({ name: "/graph4/circle", cx, cy, core });
        await check_items({ cx, cy, r, t1x, t1y, t2x, t2y, core });
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
        core: Core;
    }) {
        function expectCloseTo(val: any, desiredVal: any) {
            if (Number.isNaN(desiredVal)) {
                expect(Number.isFinite(val)).false;
            } else {
                expect(val).closeTo(desiredVal, 1e-12);
            }
        }

        let stateVariables = await returnAllStateVariables(core);
        expectCloseTo(
            stateVariables["/circle1"].stateValues.center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables["/circle1"].stateValues.center[1].tree,
            cy,
        );

        expectCloseTo(stateVariables["/circle1"].stateValues.radius.tree, r);
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.center[1].tree,
            cy,
        );
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
            cx,
        );
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
            cy,
        );
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.radius.tree,
            r,
        );
        expectCloseTo(
            stateVariables["/graph3/circle"].stateValues.numericalRadius,
            r,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.center[0].tree,
            cx,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.center[1].tree,
            cy,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
            cx,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
            cy,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.radius.tree,
            r,
        );
        expectCloseTo(
            stateVariables["/graph4/circle"].stateValues.numericalRadius,
            r,
        );
        expectCloseTo(stateVariables["/centerCopy"].stateValues.xs[0].tree, cx);
        expectCloseTo(stateVariables["/centerCopy"].stateValues.xs[1].tree, cy);
        expectCloseTo(
            stateVariables["/radiusNumber"].stateValues.value.tree,
            r,
        );

        expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
            t1x,
            1e-12,
        );
        expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
            t1y,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
            t2x,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
            t2y,
            1e-12,
        );
        expect(stateVariables["/point3"].stateValues.xs[0].tree).closeTo(
            t3x,
            1e-12,
        );
        expect(stateVariables["/point3"].stateValues.xs[1].tree).closeTo(
            t3y,
            1e-12,
        );
    }

    async function getCircle1CenterAndRadiusFromStateVar({ core }) {
        let stateVariables = await returnAllStateVariables(core);
        // calculate center and radius from circle itself
        let cx: number =
            stateVariables["/circle1"].stateValues.numericalCenter[0];
        let cy: number =
            stateVariables["/circle1"].stateValues.numericalCenter[1];
        let r: number = stateVariables["/circle1"].stateValues.numericalRadius;
        return [cx, cy, r];
    }

    it("circle through three points", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)</point>
        <point name="point3">(-3,4)</point>
        <circle name="circle1" through="$point1 $point2 $point3" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    $circle1.diameter{assignNames="diam" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let t3x = -3;
        let t3y = 4;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        await moveCircle({ name: "/circle1", cx, cy, core });
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
        });

        // move first point to be in straight line
        t1x = -3;
        t1y = 8;
        cx = NaN;
        cy = NaN;
        r = NaN;
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
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
        });

        // move second point
        t2x = -4;
        t2y = -2;
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        });

        // move third point
        t3x = 5;
        t3y = 3;
        await movePoint({ name: "/point3", x: t3x, y: t3y, core });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        });

        // move points to be identical, should be a circle of radius zero
        t1x = 5;
        t1y = 3;
        t2x = 5;
        t2y = 3;
        cx = t1x;
        cy = t1y;
        r = 0;
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
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
        });

        // points 1 and 3 are identical, two points should be diameter
        t2x = 2;
        t2y = -7;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
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
        });

        // points 2 and 3 are identical, two points should be diameter
        t3x = 2;
        t3y = -7;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({ name: "/point3", x: t3x, y: t3y, core });
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
        });

        // points 1 and 2 are identical, two points should be diameter
        t1x = 4;
        t1y = 9;
        t2x = 4;
        t2y = 9;
        cx = (t1x + t3x) / 2;
        cy = (t1y + t3y) / 2;
        r = Math.sqrt(Math.pow(t2x - cx, 2) + Math.pow(t2y - cy, 2));
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
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
        });

        // move points apart again
        t2x = 2;
        t2y = -7;
        t3x = 0;
        t3y = -8;
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
        await movePoint({ name: "/point3", x: t3x, y: t3y, core });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        });

        // move center by reffed point
        (dx = 2), (dy = -3);
        cx += dx;
        cy += dy;
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
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
        });

        // half radius around center
        r = r / 2;
        t1x = cx + (t1x - cx) / 2;
        t1y = cy + (t1y - cy) / 2;
        t2x = cx + (t2x - cx) / 2;
        t2y = cy + (t2y - cy) / 2;
        t3x = cx + (t3x - cx) / 2;
        t3y = cy + (t3y - cy) / 2;
        await movePoint({ name: "/point4", x: r, y: 0, core });
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
        await moveCircle({ name: "/graph3/circle", cx, cy, core });
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
        await moveCircle({ name: "/graph4/circle", cx, cy, core });
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
        });
    });

    it("circle with radius and through two points", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="pX">$point3.x</math>
    <graph>
        <point name="point3">(2,0)</point>
        <point name="point1">(3,4)</point>
        <point name="point2">(5,6)</point>
        <circle name="circle1" radius="$pX" through="$point1 $point2" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    $circle1.diameter{assignNames="diam" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        let t1x = 3;
        let t1y = 4;
        let t2x = 5;
        let t2y = 6;
        let r = 2;
        let [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        await moveCircle({ name: "/circle1", cx, cy, core });
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
        });

        // move through point too far away
        t1x = 0;
        t1y = -1;
        cx = NaN;
        cy = NaN;
        // TODO: should the radius still be 2 here?
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
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
        });

        // increase radius by moving definition point
        r = 6;
        await movePoint({ name: "/point3", x: r, y: 0, core });
        [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        });

        // decrease radius by moving copied point
        r = 2;
        cx = NaN;
        cy = NaN;
        await movePoint({ name: "/point4", x: r, y: 0, core });
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
        });

        r = 6;
        await movePoint({ name: "/point4", x: r, y: 0, core });
        [cx, cy] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        });

        r = 6 / 9;
        cx = NaN;
        cy = NaN;
        await movePoint({ name: "/point4", x: r, y: 0, core });
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
        });

        // move through points on top of each other
        t1x = 5;
        t1y = -4;
        t2x = 5;
        t2y = -4;
        r = 2.0 / 3.0;
        cx = t1x;
        cy = t1y - r;
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
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
        });

        // move through points apart, but close enough
        t1x = -2;
        t1y = 7;
        t2x = -2.5;
        t2y = 6.6;
        await movePoint({ name: "/point1", x: t1x, y: t1y, core });
        await movePoint({ name: "/point2", x: t2x, y: t2y, core });
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({ core });
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
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
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
        await moveCircle({ name: "/graph3/circle", cx, cy, core });
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
        await moveCircle({ name: "/graph4/circle", cx, cy, core });
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
        });
    });

    //
    // Self-Referential Circle
    //
    async function check_circle1({
        cx,
        cy,
        r,
        diameter,
        core,
    }: {
        cx: number;
        cy: number;
        r: number;
        diameter?: number;
        core: Core;
    }) {
        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/circle1"].stateValues.center.map((v) => v.tree),
        ).eqls([cx, cy]);
        expect(stateVariables["/circle1"].stateValues.radius.tree).eq(r);

        if (diameter) {
            expect(stateVariables["/circle1"].stateValues.diameter.tree).eq(
                diameter,
            );
        } else {
            expect(stateVariables["/circle1"].stateValues.diameter.tree).eq(
                2 * r,
            );
        }

        expect(
            stateVariables["/centerCopy"].stateValues.xs.map((v) => v.tree),
        ).eqls([cx, cy]);
    }

    async function test_circle_radius_and_center_interdependent({
        core,
        initialCx,
        initialCyAndRadius,
        centerDependsOnRadius,
    }: {
        core: Core;
        initialCx: number;
        initialCyAndRadius: number;
        centerDependsOnRadius: boolean;
    }) {
        let cx = initialCx;
        let cy = initialCyAndRadius;
        await check_circle1({ cx, cy, r: cy, core });

        // move circle
        cx = -3;
        cy = 5;
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_circle1({ cx, cy, r: cy, core });

        // move center point
        cx = 8;
        cy = 7;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_circle1({ cx, cy, r: cy, core });

        if (centerDependsOnRadius) {
            // attempt move circle below x-axis, both center y and radius are zero
            cx = 3;
            cy = 0;
            await moveCircle({ name: "/circle1", cx, cy: -2, core });
            await check_circle1({ cx, cy, r: cy, core });
        } else {
            // radius depends on center
            // move circle below x-axis, center y is negative, radius is zero
            cx = 3;
            cy = -2;
            await moveCircle({ name: "/circle1", cx, cy, core });
            await check_circle1({ cx, cy, r: 0, core });
        }

        // move circle back up with center point
        cx = 1;
        cy = 4;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_circle1({ cx, cy, r: cy, core });
    }

    it("circle where radius depends on center", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.center.y" center="(1,2)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
    `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            initialCx: 1,
            initialCyAndRadius: 2,
            centerDependsOnRadius: false,
        });
    });

    // Will un-skip this once all other circle tests are passing and we change dependencies of center
    // to not depend on radius when there are no through points
    it.skip("circle where radius depends on unspecified center", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.center.y" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
    `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            initialCx: 0,
            initialCyAndRadius: 0,
            centerDependsOnRadius: false,
        });
    });

    it("circle where center depends on radius", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" center="(1, $circle1.radius)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            initialCx: 1,
            initialCyAndRadius: 2,
            centerDependsOnRadius: true,
        });
    });

    it("circle where center depends on unspecified radius", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" center="(1, $circle1.radius)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>    
  `,
        });

        await test_circle_radius_and_center_interdependent({
            core,
            initialCx: 1,
            initialCyAndRadius: 1,
            centerDependsOnRadius: true,
        });
    });

    async function test_circle_radius_and_single_through_point_interdependent({
        initialRadius,
        core,
        throughPointDependsOnRadius,
    }: {
        initialRadius: number;
        core: Core;
        throughPointDependsOnRadius: boolean;
    }) {
        let cx = 1;
        let cy = initialRadius;
        await check_circle1({ cx, cy, r: cy, core });

        // move circle
        let desiredCy = 5;
        cx = -3;
        cy = (desiredCy + cy) / 2;
        // given previous radius is 2, would move through point to 5+2,
        // so that center of circle would be (5+2)/2
        await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });

        // move center point
        cx = 8;
        desiredCy = 7;
        cy = (desiredCy + cy) / 2;
        await movePoint({ name: "/centerCopy", x: cx, y: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });

        // move circle below x-axis, radius becomes 0
        cx = 4;
        desiredCy = -6;
        if (throughPointDependsOnRadius) {
            cy = 0;
            await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
            await check_circle1({ cx, cy, r: cy, core });
        } else {
            // Through point is allowed to become negative even though radius cannot
            cy = desiredCy + cy; // through point is on top of center because radius is 0
            await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
            await check_circle1({ cx, cy, r: 0, core }); //
        }

        // move circle back up with center point
        desiredCy = 4;
        cx = 1;
        if (throughPointDependsOnRadius) {
            cy = (desiredCy + cy) / 2;
        } else {
            cy = (desiredCy + 0) / 2; // previous radius was 0 but cy is not 0
        }
        await movePoint({ name: "/centerCopy", x: cx, y: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });
    }

    it("circle where single through point depends on radius", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" through="(1,2$circle1.radius)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 2,
            core,
            throughPointDependsOnRadius: true,
        });
    });

    it("circle where single through point depends on unspecified radius", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="(1,2 $circle1.radius)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 1,
            core,
            throughPointDependsOnRadius: true,
        });
    });

    it("circle where radius depends on single through point", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="$circle1.throughPoint1.y/2" through="(1,4)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        await test_circle_radius_and_single_through_point_interdependent({
            initialRadius: 2,
            core,
            throughPointDependsOnRadius: false,
        });
    });

    async function test_circle_center_and_through_point_interdependent({
        core,
    }: {
        core: Core;
    }) {
        let cx = 1;
        let cy = 2;
        await check_circle1({ cx, cy, r: 2, core });

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
        await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });

        // move center point
        desiredCy = 7;
        cy = 7; // since moving center itself
        cx = 8;
        await movePoint({ name: "/centerCopy", x: cx, y: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });

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
        await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
        await check_circle1({ cx, cy, r: -1 * cy, core });

        // move circle back up with center point
        desiredCy = 4;
        cy = 4; // since moving point itself
        cx = 1;
        await movePoint({ name: "/centerCopy", x: cx, y: desiredCy, core });
        await check_circle1({ cx, cy, r: cy, core });
    }

    it("circle where center depends on through point", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="(1,4)" center="($circle1.throughPointX1_1, $circle1.throughPointX1_2/2)"/>
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        await test_circle_center_and_through_point_interdependent({ core });
    });

    it("circle where through point depends on center", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="($circle1.centerX1,$(circle1.centerX2)2)" center="(1,2)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>

  `,
        });

        await test_circle_center_and_through_point_interdependent({ core });
    });

    // Note: this test isn't complete yet. Need to rework "test_circle_center_and_through_point_interdependent" function
    // to accept different starting center
    it.skip("circle where through point depends on unspecified center", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" through="($circle1.centerX1,$(circle1.centerX2)2)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>

  `,
        });
        //TODO: Need to rework this function to accept different starting center
        await test_circle_center_and_through_point_interdependent({ core });
    });

    it("circle where center depends on diameter", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" radius="2" center="(1,$circle1.diameter)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        let cx = 1;
        let cy = 4;
        await check_circle1({ cx, cy, r: 2, diameter: 4, core });

        // move circle
        cx = -3;
        cy = 6;
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_circle1({ cx, cy, r: 3, diameter: 6, core });

        // move center point
        cx = 8;
        cy = 4;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_circle1({ cx, cy, r: 2, diameter: 4, core });

        // move circle below x-axis
        cx = 3;
        let desiredCy = -2;
        cy = 0;
        await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
        await check_circle1({ cx, cy, r: 0, diameter: 0, core });

        // move circle back up with center point
        cx = 1;
        cy = 8;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_circle1({ cx, cy, r: 4, diameter: 8, core });
    });

    it("circle where one center component depends on other center component", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="circle1" center="(1, $circle1.centerX1+1)" />
        $circle1.center{assignNames="centerCopy"}
    </graph>
  `,
        });

        let cx = 1;
        let cy = 2;
        await check_circle1({ cx, cy, r: 1, core });

        // move circle
        cx = -3;
        let desiredCy = 5;
        cy = -2;
        await moveCircle({ name: "/circle1", cx, cy: desiredCy, core });
        await check_circle1({ cx, cy, r: 1, core });

        // move center point
        cx = 8;
        desiredCy = 7;
        cy = 9;
        await movePoint({ name: "/centerCopy", x: cx, y: desiredCy, core });
        await check_circle1({ cx, cy, r: 1, core });
    });

    // ====== Circle And Constraints ========
    async function getPoint3CenterBasedOnStateVars({ core }) {
        let stateVariables = await returnAllStateVariables(core);
        let px = stateVariables["/point3"].stateValues.xs[0].tree;
        let py = stateVariables["/point3"].stateValues.xs[1].tree;
        return [px, py];
    }

    async function check_circle_and_constrained_point({
        cx,
        cy,
        px,
        py,
        r,
        core,
        includesInterior,
    }: {
        cx: number;
        cy: number;
        px: number;
        py: number;
        r: number;
        core: Core;
        includesInterior?: boolean;
    }) {
        let dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        if (includesInterior) {
            expect(dist).lessThanOrEqual(r);
        } else {
            expect(dist).closeTo(r, 1e-12);
        }

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/graph2/point3"].stateValues.xs[0].tree).eq(px);
        expect(stateVariables["/graph2/point3"].stateValues.xs[1].tree).eq(py);

        expect(stateVariables["/circle1"].stateValues.center[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/circle1"].stateValues.center[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(
            stateVariables["/circle1"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/circle1"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
            r,
            1e-12,
        );
        expect(stateVariables["/circle1"].stateValues.numericalRadius).closeTo(
            r,
            1e-12,
        );
        expect(
            stateVariables["/graph2/circle1"].stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph2/circle1"].stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph2/circle1"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph2/circle1"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph2/circle1"].stateValues.radius.tree,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph2/circle1"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);
        expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
            r,
            1e-12,
        );
        expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
            0,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(stateVariables["/centerCopy"].stateValues.xs[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/centerCopy"].stateValues.xs[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value.tree).closeTo(
            r,
            1e-12,
        );
    }

    it("point constrained to circle", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="pX">$point1.x</math>
    <point name="point1">(3,0)</point>
    <point name="point2">(-1,7)</point>
    <graph name="graph1">
      <circle name="circle1" radius="$pX" center="$point2" />
      <point name="point3" x="-4" y="-6">
        <constraints>
          <constrainTo>$circle1</constrainTo>
        </constraints>
      </point>
    </graph>
    <graph>
      $circle1.center{assignNames="centerCopy"}
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    $graph1{name="graph2" newNamespace}
    `,
        });

        let cx = -1;
        let cy = 7;
        let r = 3;
        let [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });

        // move circle
        cx = 5;
        cy = -2;
        r = 3;
        await movePoint({ name: "/point2", x: cx, y: cy, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });

        // shrink circle
        cx = 5;
        cy = -2;
        r = 1;
        await movePoint({ name: "/point1", x: r, y: 0, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });

        // move point
        cx = 5;
        cy = -2;
        r = 1;
        await movePoint({ name: "/point3", x: -9, y: 8, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });

        // move circle shadow
        cx = -3;
        cy = 7;
        r = 1;
        await moveCircle({ name: "/graph2/circle1", cx, cy, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });

        // move point shadow
        cx = -3;
        cy = 7;
        r = 1;
        await movePoint({ name: "/graph2/point3", x: 11, y: -21, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({ cx, cy, px, py, r, core });
    });

    it("point constrained to interior of circle", async () => {
        let core = await createTestCore({
            doenetML: `
    <math hide name="pX">$point1.x</math>
    <point name="point1">(3,0)</point>
    <point name="point2">(-1,7)</point>
    <graph name="graph1">
      <circle name="circle1" radius="$pX" center="$point2" filled />
      <point name="point3" x="-4" y="-6">
        <constraints>
          <constrainToInterior>$circle1</constrainToInterior>
        </constraints>
      </point>
      </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point x="$(circle1.radius)" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    $graph1{name="graph2" newNamespace}
    `,
        });

        // point should start on edge of circle
        let cx = -1;
        let cy = 7;
        let r = 3;
        let [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: false,
        });

        // move circle so original point is in middle
        (cx = -5), (cy = -7);
        await movePoint({ name: "/point2", x: cx, y: cy, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: true,
        });

        // move circle away from original point location
        cx = 5;
        cy = -2;
        await movePoint({ name: "/point2", x: cx, y: cy, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: true,
        });

        // shrink circle
        r = 1;
        await movePoint({ name: "/point1", x: r, y: 0, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: true,
        });

        // move point into circle
        px = 5.3;
        py = -2.5;
        await movePoint({ name: "/point3", x: px, y: py, core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: true,
        });

        // attempt to move point out of circle, point should end up on edge of circle
        await movePoint({ name: "/point3", x: -9, y: 8, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: false,
        });

        // move circle shadow
        (cx = -3), (cy = 7);
        await moveCircle({ name: "/graph2/circle1", cx, cy, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: false,
        });

        // attempt to move point shadow out of circle
        await movePoint({ name: "/graph2/point3", x: -9, y: 8, core });
        [px, py] = await getPoint3CenterBasedOnStateVars({ core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: false,
        });

        // move point shadow into circle
        px = -2.8;
        py = 7.7;
        await movePoint({ name: "/graph2/point3", x: px, y: py, core });
        await check_circle_and_constrained_point({
            cx,
            cy,
            px,
            py,
            r,
            core,
            includesInterior: true,
        });
    });

    function nearestSnap(desiredX, desiredY) {
        let x = Math.round(desiredX / 3) * 3;
        let y = Math.round(desiredY / 2) * 2;
        return [x, y];
    }

    async function check_circle_attr_constrained({ cx, cy, r, tx, ty, core }) {
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/circle1"].stateValues.center[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/circle1"].stateValues.center[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(
            stateVariables["/circle1"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/circle1"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
            r,
            1e-12,
        );
        expect(stateVariables["/circle1"].stateValues.numericalRadius).closeTo(
            r,
            1e-12,
        );
        expect(
            stateVariables["/graph3/circle"].stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.radius.tree,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph3/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);

        expect(
            stateVariables["/graph4/circle"].stateValues.center[0].tree,
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.center[1].tree,
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
        ).closeTo(cx, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
        ).closeTo(cy, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.radius.tree,
        ).closeTo(r, 1e-12);
        expect(
            stateVariables["/graph4/circle"].stateValues.numericalRadius,
        ).closeTo(r, 1e-12);

        expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
            tx,
            1e-12,
        );
        expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
            ty,
            1e-12,
        );
        expect(stateVariables["/centerCopy"].stateValues.xs[0].tree).closeTo(
            cx,
            1e-12,
        );
        expect(stateVariables["/centerCopy"].stateValues.xs[1].tree).closeTo(
            cy,
            1e-12,
        );
        expect(stateVariables["/radiusNumber"].stateValues.value.tree).closeTo(
            r,
            1e-12,
        );
    }

    it("circle with center and through point, center constrained", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,4)
        <constraints>
            <constrainToGrid dx="3" dy="2" />
        </constraints>
        </point>
        <point name="point2">(5,6)</point>
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point3" x="$circle1.radius" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        let cx = 3;
        let cy = 4;
        let tx = 5;
        let ty = 6;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/circle1",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move defining center
        desiredCx = -5;
        desiredCy = 5;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/point1", x: desiredCx, y: desiredCy, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move reffed center
        desiredCx = 1;
        desiredCy = -1;
        [cx, cy] = nearestSnap(desiredCx, desiredCy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({
            name: "/centerCopy",
            x: desiredCx,
            y: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move through point
        tx = -4;
        ty = 3;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/point2", x: tx, y: ty, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // change reffed radius
        r = r / 4;
        tx = cx + (tx - cx) / 4;
        ty = cy + (ty - cy) / 4;
        await movePoint({ name: "/point3", x: r, y: 0, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/graph3/circle",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/graph4/circle",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });
    });

    it("circle with center and through point, through point constrained", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(3,4)
        </point>
        <point name="point2">(5,7)
        <constraints>
            <constrainToGrid dx="3" dy="2" />
        </constraints>
        </point name="point2">
        <circle name="circle1" center="$point1" through="$point2" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point3" x="$(circle1.radius)" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
      $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });

        let cx = 3;
        let cy = 4;
        let tx = 6;
        let ty = 8;
        let r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/circle1",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move defining center
        cx = -5;
        cy = 5;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/point1", x: cx, y: cy, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move reffed center
        cx = 1;
        cy = -1;
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // move through point
        let desiredTx = -4;
        let desiredTy = 3;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/point2", x: desiredTx, y: desiredTy, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

        // change reffed radius
        let desiredR = r / 4;
        desiredTx = cx + (tx - cx) / 4;
        desiredTy = cy + (ty - cy) / 4;
        [tx, ty] = nearestSnap(desiredTx, desiredTy);
        r = Math.sqrt(Math.pow(tx - cx, 2) + Math.pow(ty - cy, 2));
        await movePoint({ name: "/point3", x: desiredR, y: 0, core });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/graph3/circle",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });

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
            name: "/graph4/circle",
            cx: desiredCx,
            cy: desiredCy,
            core,
        });
        await check_circle_attr_constrained({ cx, cy, r, tx, ty, core });
    });

    it("circle through two points, one point constrained", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)
        <constraints>
            <constrainToGrid dx="3" dy="2" />
        </constraints>
        </point>
        <point name="point2">(3,4)</point>
        <circle name="circle1" through="$point1 $point2"/>
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point3" x="$circle1.radius" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `,
        });
        async function check_items({cx,cy,r, t1x, t1y, t2x, t2y}) {
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/circle1"].stateValues.center[0].tree).closeTo(
                cx,
                1e-12,
            );
            expect(stateVariables["/circle1"].stateValues.center[1].tree).closeTo(
                cy,
                1e-12,
            );
            expect(
                stateVariables["/circle1"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/circle1"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
                r,
                1e-12,
            );
            expect(
                stateVariables["/circle1"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph3/circle"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.center[0].tree,
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.center[1].tree,
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
            ).closeTo(cx, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
            ).closeTo(cy, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.radius.tree,
            ).closeTo(r, 1e-12);
            expect(
                stateVariables["/graph4/circle"].stateValues.numericalRadius,
            ).closeTo(r, 1e-12);
            expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
                t1x,
                1e-12,
            );
            expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
                t1y,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
                t2x,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
                t2y,
                1e-12,
            );
            expect(
                stateVariables["/centerCopy"].stateValues.xs[0].tree,
            ).closeTo(cx, 1e-12);
            expect(stateVariables["/centerCopy"].stateValues.xs[1].tree).closeTo(
                cy,
                1e-12,
            );
            expect(stateVariables["/radiusNumber"].stateValues.value.tree).closeTo(
                r,
                1e-12,
            );
        }

        let t1x = 3;
        let t1y = -2;
        let t2x = 3;
        let t2y = 4;
        let r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        let cx = (t1x + t2x) / 2;
        let cy = (t1y + t2y) / 2;
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

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
        await moveCircle({name: "/circle1", cx: desiredCx, cy: desiredCy, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

        // move first through point
        desiredT1x = 4;
        desiredT1y = -1;
        [t1x, t1y] = nearestSnap(desiredT1x, desiredT1y);
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({name: "/point1", x: desiredT1x, y: desiredT1y, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

        // move second through point
        t2x = 8;
        t2y = -3;
        r = Math.hypot(t1x - t2x, t1y - t2y) / 2;
        cx = (t1x + t2x) / 2;
        cy = (t1y + t2y) / 2;
        await movePoint({name: "/point2", x: t2x, y: t2y, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

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
        await movePoint({name: "/centerCopy", x: desiredCx, y: desiredCy, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

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
        await movePoint({name: "/point3", x: desiredR, y: 0, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

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
        await moveCircle({name: "/circle1", cx: desiredCx, cy: desiredCy, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

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
        await moveCircle({name: "/graph4/circle", cx: desiredCx, cy: desiredCy, core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y});

    });

    it.only("circle through three points, one point constrained", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <point name="point1">(2,-3)</point>
        <point name="point2">(3,4)
            <constraints>
                <constrainToGrid dx="3" dy="2" />
            </constraints>
        </point>
        <point name="point3">(-3,4)</point>
        <circle name= "circle1" through="$point1 $point2 $point3" />
    </graph>
    <graph>
        $circle1.center{assignNames="centerCopy"}
        <point name="point4" x="$(circle1.radius)" y="0" />
    </graph>
    $circle1.radius{assignNames="radiusNumber" displayDigits="8"}
    $circle1.diameter{assignNames="diam" displayDigits="8"}
    <graph name="graph3" newNamespace>
        $(../circle1{name="circle"})
    </graph>
    $graph3{name="graph4"}
    `, });

        async function check_items({cx,cy,r,t1x,t1y,t2x,t2y,t3x,t3y}) {
            let stateVariables = await returnAllStateVariables(core);
            check_circle1_approx({cx,cy,r,stateVariables});
            // expect(stateVariables["/circle1"].stateValues.center[0].tree).closeTo(
            //     cx,
            //     1e-12,
            // );
            // expect(stateVariables["/circle1"].stateValues.center[1].tree).closeTo(
            //     cy,
            //     1e-12,
            // );
            // expect(stateVariables["/circle1"].stateValues.radius.tree).closeTo(
            //     r,
            //     1e-12,
            // );

            // expect(
            //     stateVariables["/graph3/circle"].stateValues.numericalCenter[0],
            // ).closeTo(cx, 1e-12);
            // expect(
            //     stateVariables["/graph3/circle"].stateValues.numericalCenter[1],
            // ).closeTo(cy, 1e-12);
            // expect(
            //     stateVariables["/graph3/circle"].stateValues.numericalRadius,
            // ).closeTo(r, 1e-12);
            // expect(
            //     stateVariables["/graph3/circle"].stateValues.center[0].tree,
            // ).closeTo(cx, 1e-12);
            // expect(
            //     stateVariables["/graph3/circle"].stateValues.center[1].tree,
            // ).closeTo(cy, 1e-12);
            // expect(
            //     stateVariables["/graph3/circle"].stateValues.radius.tree,
            // ).closeTo(r, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.numericalCenter[0],
            // ).closeTo(cx, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.numericalCenter[1],
            // ).closeTo(cy, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.numericalRadius,
            // ).closeTo(r, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.center[0].tree,
            // ).closeTo(cx, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.center[1].tree,
            // ).closeTo(cy, 1e-12);
            // expect(
            //     stateVariables["/graph4/circle"].stateValues.radius.tree,
            // ).closeTo(r, 1e-12);

            expect(stateVariables["/point1"].stateValues.xs[0].tree).closeTo(
                t1x,
                1e-12,
            );
            expect(stateVariables["/point1"].stateValues.xs[1].tree).closeTo(
                t1y,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[0].tree).closeTo(
                t2x,
                1e-12,
            );
            expect(stateVariables["/point2"].stateValues.xs[1].tree).closeTo(
                t2y,
                1e-12,
            );
            expect(stateVariables["/point3"].stateValues.xs[0].tree).closeTo(
                t3x,
                1e-12,
            );
            expect(stateVariables["/point3"].stateValues.xs[1].tree).closeTo(
                t3y,
                1e-12,
            );
            // expect(
            //     stateVariables["/centerCopy"].stateValues.xs[0].tree,
            // ).closeTo(cx, 1e-12);
            // expect(stateVariables["/centerCopy"].stateValues.xs[1].tree).closeTo(
            //     cy,
            //     1e-12,
            // );
            // expect(stateVariables["/radiusNumber"].stateValues.value.tree).closeTo(
            //     r,
            //     1e-12,
            // );
            expect(stateVariables["/diam"].stateValues.value.tree).closeTo(
                2 * r,
                1e-12,
            );
        }

        let t1x = 2;
        let t1y = -3;
        let t2x = 3;
        let t2y = 4;
        let t3x = -3;
        let t3y = 4;
        let [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({core});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y,t3x,t3y});

        // move circle up and to the right
        [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({core});
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
        await moveCircle({name: "/circle1", cx: desiredCx, cy: desiredCy, core});
        console.log({name: "/circle1", cx: desiredCx, cy: desiredCy});
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y,t3x,t3y});

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
        await moveCircle({name: "/graph3/circle", cx: desiredCx, cy: desiredCy, core});
        console.log({name: "/graph3/circle", cx: desiredCx, cy: desiredCy});

        await check_items({cx,cy,r,t1x,t1y,t2x,t2y,t3x,t3y});

        // move circle3
        // [cx, cy, r] = await getCircle1CenterAndRadiusFromStateVar({core});
        desiredDx = 7;
        desiredDy = -3;
        desiredCx = cx + desiredDx;
        desiredCy = cy + desiredDy;
        // console.log({cy, desiredCy});
        [dx, dy] = nearestSnap(desiredDx, desiredDy);
        // console.log({dx,dy});
        cx += dx;
        cy += dy;
        // console.log({cy});
        t1x += dx;
        t1y += dy;
        t2x += dx;
        t2y += dy;
        t3x += dx;
        t3y += dy;
        await moveCircle({name: "/circle1", cx: desiredCx, cy: desiredCy, core});
        console.log({name: "/circle1", cx: desiredCx, cy: desiredCy});
        let stateVariables = await returnAllStateVariables(core);
        console.log(stateVariables["/circle1"].stateValues.center.map(v => v.tree));
;
        await check_items({cx,cy,r,t1x,t1y,t2x,t2y,t3x,t3y});

    });

    it("essential center can combine coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
        <graph>
            <circle name="circle1"/>
            <point name="point1">
            ($circle1.center.y,
            $circle1.center.x)
            </point>
            $circle1.center{assignNames="centerCopy"}
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
            core: Core;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/circle1"].stateValues.numericalRadius).eq(
                1,
            );
            expect(stateVariables["/circle1"].stateValues.numericalCenter).eqls(
                [cx, cy],
            );
            expect(stateVariables["/centerCopy"].stateValues.coords.tree).eqls([
                "vector",
                cx,
                cy,
            ]);
            // flipped coordinates for point
            expect(stateVariables["/point1"].stateValues.coords.tree).eqls([
                "vector",
                cy,
                cx,
            ]);
        }

        // circle center coords, will be flipped for point
        let cx = 0;
        let cy = 0;

        // move circle
        cx = -7;
        cy = 2;
        await moveCircle({ name: "/circle1", cx, cy, core });
        await check_items({ cx, cy, core });

        // move flipped point (cy is point1's x coordinate)
        cy = -3;
        cx = -5;
        await movePoint({ name: "/point1", x: cy, y: cx, core });
        await check_items({ cx, cy, core });

        // move center point
        cx = 1;
        cy = -4;
        await movePoint({ name: "/centerCopy", x: cx, y: cy, core });
        await check_items({ cx, cy, core });
    });

    it("handle initially undefined center", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Center: <mathinput name="c" /></p>
    <graph>
        <circle center="$c" name="circ" />
    </graph>
    <graph>
        $circ{name="circ2"}
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
            core: Core;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/circ"].stateValues.numericalCenter).eqls([
                cx,
                cy,
            ]);
            expect(stateVariables["/circ"].stateValues.numericalRadius).eq(1);
            expect(stateVariables["/circ2"].stateValues.numericalCenter).eqls([
                cx,
                cy,
            ]);
            expect(stateVariables["/circ2"].stateValues.numericalRadius).eq(1);
        }

        let cx = NaN;
        let cy = NaN;
        await check_items({ cx, cy, core });

        // enter point for center
        cx = 2;
        cy = 1;
        await updateMathInputValue({
            componentName: "/c",
            latex: `(${cx},${cy})`,
            core,
        });
        await check_items({ cx, cy, core });

        // move circle
        cx = -7;
        cy = 1;
        await moveCircle({ name: "/circ", cx, cy, core });
        await check_items({ cx, cy, core });

        // change point for center
        cx = -7;
        cy = -4;
        await updateMathInputValue({
            componentName: "/c",
            latex: `(${cx}, ${cy})`,
            core,
        });
        await check_items({ cx, cy, core });

        // move circle2
        cx = 6;
        cy = 9;
        await moveCircle({ name: "/circ2", cx, cy, core });
        await check_items({ cx, cy, core });

        // center undefined again
        cx = NaN;
        cy = NaN;
        await updateMathInputValue({
            componentName: "/c",
            latex: "",
            core,
        });
        await check_items({ cx, cy, core });

        // enter new point for center
        cx = 5;
        cy = 4;
        await updateMathInputValue({
            componentName: "/c",
            latex: `(${cx}, ${cy})`,
            core,
        });
        await check_items({ cx, cy, core });
    });

    it("overwrite attributes on copy", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <circle name="c" />
  </graph>

  <p>Change radius: <mathinput name="rc" bindValueTo="$(c.radius)" /></p>
  <p>Change center: <mathinput name="cc" bindValueTo="$(c.center)" /></p>

  <graph>
    <point name="P">(3,4)</point>
    $c{center="$P" name="c1"}
  </graph>

  <p>Change radius: <mathinput name="rc1" bindValueTo="$(c1.radius)" /></p>
  <p>Change center: <mathinput name="cc1" bindValueTo="$(c1.center)" /></p>

  <graph>
    <point name="Q">(7,7)</point>
    $c1{through="$Q" name="c2"}
  </graph>

  <p>Change radius: <mathinput name="rc2" bindValueTo="$(c2.radius)" /></p>
  <p>Change center: <mathinput name="cc2" bindValueTo="$(c2.center)" /></p>

  <graph>
    $c{radius="$src3" name = "c3"}
  </graph>

  <p>Set radius: <mathinput name="src3" prefill="3" /></p>
  <p>Change radius: <mathinput name="rc3" bindValueTo="$(c3.radius)" /></p>
  <p>Change center: <mathinput name="cc3" bindValueTo="$(c3.center)" /></p>

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
            core: Core;
        }) {
            let stateVariables = await returnAllStateVariables(core);

            expect(stateVariables["/c"].stateValues.radius.tree).eqls(c.r);
            expect(
                stateVariables["/c"].stateValues.center.map((v) => v.tree),
            ).eqls([c.x, c.y]);
            expect(stateVariables["/c1"].stateValues.radius.tree).eqls(c1.r);
            expect(
                stateVariables["/c1"].stateValues.center.map((v) => v.tree),
            ).eqls([c1.x, c1.y]);
            expect(stateVariables["/c2"].stateValues.radius.tree).eqls(c2.r);
            expect(
                stateVariables["/c2"].stateValues.center.map((v) => v.tree),
            ).eqls([c2.x, c2.y]);
            expect(stateVariables["/c3"].stateValues.radius.tree).eqls(c3.r);
            expect(
                stateVariables["/c3"].stateValues.center.map((v) => v.tree),
            ).eqls([c3.x, c3.y]);

            expect(stateVariables["/P"].stateValues.xs.map((v) => v.tree)).eqls(
                [p.x, p.y],
            );
            expect(stateVariables["/Q"].stateValues.xs.map((v) => v.tree)).eqls(
                [q.x, q.y],
            );
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
        await moveCircle({ name: "/c", cx: -1, cy: 2, core });
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
            componentName: "/rc",
            latex: `1+x`,
            core,
        });
        await updateMathInputValue({
            componentName: "/cc",
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
            componentName: "/rc1",
            latex: `2`,
            core,
        });
        await updateMathInputValue({
            componentName: "/cc3",
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
        await movePoint({ name: "/P", x: -5, y: 2, core });
        await updateMathInputValue({
            componentName: "/rc1",
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
        await movePoint({ name: "/Q", x: 3, y: 8, core });
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
            componentName: "/rc2",
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
            componentName: "/cc2",
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
            componentName: "/src3",
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
        await moveCircle({ name: "/c3", cx: 3, cy: 8, core });
        await updateMathInputValue({
            componentName: "/rc3",
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
        let core = await createTestCore({
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

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(8);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot calculate radius of circle with specified center through more than 1 point",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(8);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(8);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(57);

        expect(errorWarnings.warnings[1].message).contain(
            "Haven't implemented <circle> through 2 points in case where the points don't have numerical values",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(42);

        expect(errorWarnings.warnings[2].message).contain(
            "Cannot calculate circle through more than 3 points",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(54);

        expect(errorWarnings.warnings[3].message).contain(
            "Cannot calculate circle with specified radius, center and through points",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(62);

        expect(errorWarnings.warnings[4].message).contain(
            "Cannot calculate circle with specified center through more than 1 point",
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(57);

        expect(errorWarnings.warnings[5].message).contain(
            "Cannot calculate circle: given that the distance between the two points is 8, the specified radius 1 is too small",
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(54);

        expect(errorWarnings.warnings[6].message).contain(
            "Cannot create circle through more than two points with a specified radius",
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(7);
        expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(60);

        expect(errorWarnings.warnings[7].message).contain(
            "Cannot create circle through more than one point with specified radius when don't have numerical values",
        );
        expect(errorWarnings.warnings[7].level).eq(1);
        expect(errorWarnings.warnings[7].doenetMLrange.lineBegin).eq(9);
        expect(errorWarnings.warnings[7].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[7].doenetMLrange.lineEnd).eq(9);
        expect(errorWarnings.warnings[7].doenetMLrange.charEnd).eq(53);
    });

    it("handle bad center/through", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <circle name="circle1" center="A" through="B" />
    </graph>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/circle1"]).not.eq(undefined);
    });

    it("area and circumference", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
        <circle name="c" center="(1,4)" />
    </graph>
    <p>Area: <math copySource="c.area" name="area" /></p>
    <p>Area as number: <number copySource="c.area" name="area2" /></p>
    <p>Circumference: <math copySource="c.circumference" name="circumference" /></p>
    <p>Circumference as number: <number copySource="c.circumference" name="circumference2" /></p>
    <p>Change radius: <mathinput name="r">$c.radius</mathinput></p>
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
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/area"].stateValues.value.tree).eqls(area);
            expect(stateVariables["/area2"].stateValues.value).eqls(area2);
            expect(
                stateVariables["/circumference"].stateValues.value.tree,
            ).eqls(circ);
            expect(stateVariables["/circumference2"].stateValues.value).eqls(
                circ2,
            );
        }

        await check_items({
            area: "pi",
            area2: Math.PI,
            circ: ["*", 2, "pi"],
            circ2: 2 * Math.PI,
        });

        // change radius
        await updateMathInputValue({
            componentName: "/r",
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
            componentName: "/r",
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
            componentName: "/r",
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
        let core = await createTestCore({
            doenetML: `
    <circle center="(12.3456789, 0.123456789)" radius="1234.56789" name="c1" />
    <p>
      <number copySource="c1.radius" name="c1r" />
      <number copySource="c1.diameter" name="c1d" />
      <coords copySource="c1.center" name="c1c" />
    </p>
    <circle copySource="c1" displayDigits="4" displayDecimals="1" name="c1a" />
    <p>
      <number copySource="c1a.radius" name="c1ar" />
      <number copySource="c1a.diameter" name="c1ad" />
      <coords copySource="c1a.center" name="c1ac" />
    </p>
    <circle through="(1234.56789, 0.123456789)" name="c2" />
    <p name="pc2tp"><point copySource="c2.throughPoint1" name="c2tp" /></p>
    <circle copySource="c2" displayDigits="4" displayDecimals="1" name="c2a" />
    <p name="pc2atp"><point copySource="c2a.throughPoint1" name="c2atp" /></p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/c1r"].stateValues.text).eqls("1234.57");
        expect(stateVariables["/c1d"].stateValues.text).eqls("2469.14");
        expect(stateVariables["/c1c"].stateValues.text).eqls(
            "( 12.35, 0.123 )",
        );

        expect(stateVariables["/c1ar"].stateValues.text).eqls("1234.6");
        expect(stateVariables["/c1ad"].stateValues.text).eqls("2469.1");
        expect(stateVariables["/c1ac"].stateValues.text).eqls(
            "( 12.35, 0.1235 )",
        );

        expect(stateVariables["/pc2tp"].stateValues.text).eqls(
            "( 1234.57, 0.123 )",
        );
        expect(stateVariables["/pc2atp"].stateValues.text).eqls(
            "( 1234.6, 0.1235 )",
        );
    });
});
