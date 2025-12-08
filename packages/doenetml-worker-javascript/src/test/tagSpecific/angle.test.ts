import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Angle tag tests", async () => {
    it("angle determined by three points, 45-45-90 triangle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math extend="$angle1.angle" name="angle2" />
  <p>Angle again: <angle extend="$angle1" name="angle3" /></p>

  <mathInput name="mi1" prefill="2"/>
  <mathInput name="mi2" prefill="2"/>

  <graph>
    <point name="P1" x="$mi1" y="$mi2" />
    <point name="P2">(2,4)</point>
    <point name="P3">(4,2)</point>
    <angle name="angle1" through="$P1 $P2 $P3" chooseReflexAngle="allowed" />
  </graph>
  `,
        });

        async function check_items(angle: number, ps: number[][]) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                    .radians.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("angle2")].stateValues
                    .value.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("angle3")].stateValues
                    .radians.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("angle1")
                ].stateValues.points.map((v) => v.map((x) => x.tree)),
            ).eqls(ps);
        }

        let ps = [
            [2, 2],
            [2, 4],
            [4, 2],
        ];

        await check_items(Math.PI / 4, ps);

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        ps[0] = [4, 4];
        await check_items((7 * Math.PI) / 4, ps);

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        ps[0] = [0, 2];
        await check_items(Math.PI / 2, ps);

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        ps[0] = [4, 6];
        await check_items((3 * Math.PI) / 2, ps);
    });

    it("angle determined by two lines", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <math extend="$angle1.angle" name="angle2" />
  <p>Angle again: <angle extend="$angle1" name="angle3" /></p>

  <mathInput name="mi1" prefill="2"/>
  <mathInput name="mi2" prefill="2"/>
  <mathInput name="theta1" prefill="-2"/>
  <mathInput name="theta2" prefill="2"/>


  <graph>
  <point name="P1" x="$mi1" y="$mi2" />
  <point name="P2" x="$mi1 + cos($theta1)" y="$mi2 + sin($theta1)" />
  <point name="P3" x="$mi1 + cos($theta2)" y="$mi2 + sin($theta2)" />
  <line name="l1" through="$P1 $P2" />
  <line name="l2" through="$P1 $P3" />

  <angle name="angle1" radius="2" betweenLines="$l1 $l2" chooseReflexAngle="allowed" />
  </graph>
  `,
        });

        async function check_items(angle: number) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                    .radians.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("angle2")].stateValues
                    .value.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("angle3")].stateValues
                    .radians.tree,
            ).closeTo(angle, 1e-12);
        }

        let theta1 = -2;
        let theta2 = 2;

        await check_items(theta2 - theta1);

        theta1 = 4;
        theta2 = 6;
        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: theta1.toString(),
            componentIdx: await resolvePathToNodeIdx("theta1"),
            core,
        });
        await updateMathInputValue({
            latex: theta2.toString(),
            componentIdx: await resolvePathToNodeIdx("theta2"),
            core,
        });
        await check_items(theta2 - theta1);

        theta1 = 3;
        theta2 = 3;
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: theta1.toString(),
            componentIdx: await resolvePathToNodeIdx("theta1"),
            core,
        });
        await updateMathInputValue({
            latex: theta2.toString(),
            componentIdx: await resolvePathToNodeIdx("theta2"),
            core,
        });
        await check_items(theta2 - theta1);

        theta1 = Math.PI / 4;
        theta2 = (5 * Math.PI) / 4;
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "-1",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMathInputValue({
            latex: "\\pi/4",
            componentIdx: await resolvePathToNodeIdx("theta1"),
            core,
        });
        await updateMathInputValue({
            latex: "5\\pi/4",
            componentIdx: await resolvePathToNodeIdx("theta2"),
            core,
        });
        await check_items(theta2 - theta1);
    });

    it("angle warning when determined by three lines", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph description="A graph with warnings">
    <line name="l1" />
    <line name="l2" through="(1,2) (3,4)" />
    <line name="l3" through="(-1,2) (-3,4)" />

    <angle betweenLines="$l1 $l2 $l3" />
  </graph>
  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot define an angle between 3 lines",
        );
        expect(errorWarnings.warnings[0].level).eq(2);
        expect(errorWarnings.warnings[0].position.start.line).eq(7);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(7);
        expect(errorWarnings.warnings[0].position.end.column).eq(41);
    });

    it("parallel and undefined lines", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="mi1" prefill="3"/>
  <mathInput name="mi2" prefill="4"/>
  <math extend="$angle1.angle" name="angle2" />
  <p>Angle again: <angle extend="$angle1" name="angle3" /></p>

  <graph>
  <line name="l1" through="(1,2) ($mi1, $mi2)" />
  <line name="l2" through="(6,2) (8,4)" />

  <angle name="angle1" betweenLines="$l1 $l2" />
  </graph>
  `,
        });

        async function check_items(angle: number | string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (typeof angle === "number") {
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).closeTo(angle, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle2")]
                        .stateValues.value.tree,
                ).closeTo(angle, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle3")]
                        .stateValues.radians.tree,
                ).closeTo(angle, 1e-12);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).eq(angle);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle2")]
                        .stateValues.value.tree,
                ).eq(angle);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle3")]
                        .stateValues.radians.tree,
                ).eq(angle);
            }
        }

        await check_items("＿");

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(Math.PI / 2);

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items("＿");
    });

    it("changing radius", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="mi1" />
  <graph>
    <point name="P1">(5,0)</point>
    <point name="P2">(0,0)</point>
    <point name="P3" x="7cos(1)" y="7sin(1)" />
    <angle name="angle1" radius="$mi1" through="$P1 $P2 $P3" />
  </graph>
  <math extend="$angle1.radius" name="radius2" />
  `,
        });

        async function check_items(angle: number, radius: number | string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                    .radians.tree,
            ).closeTo(angle, 1e-12);
            expect(
                stateVariables[await resolvePathToNodeIdx("radius2")]
                    .stateValues.value.tree,
            ).eq(radius);
        }

        await check_items(1, "\uff3f");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(1, 1);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(1, 2);

        await updateMathInputValue({
            latex: "-3",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(1, -3);

        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(1, "x");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(1, 4);
    });

    it("systematically vary angle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <mathInput name="theta" />
  <graph>
    <point name="P1">(5,0)</point>
    <point name="P2">(0,0)</point>
    <point name="P3" x="8cos($theta)" y="8sin($theta)" />
    <angle name="angle1" through="$P1 $P2 $P3" chooseReflexAngle="allowed" />
  </graph>
  <p><math extend="$angle1.angle" name="alpha" /></p>
  <p><math extend="$angle1.degrees" name="alphadeg" /></p>
  <p>Angle again: <angle extend="$angle1" name="angle2" /></p>
  `,
        });

        async function check_items(angle: number | string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (typeof angle === "number") {
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).closeTo(angle, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle2")]
                        .stateValues.radians.tree,
                ).closeTo(angle, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx("alpha")]
                        .stateValues.value.tree,
                ).closeTo(angle, 1e-12);
                expect(
                    stateVariables[await resolvePathToNodeIdx("alphadeg")]
                        .stateValues.value.tree,
                ).closeTo((180 * angle) / Math.PI, 1e-12);
            } else {
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).eq(angle);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle2")]
                        .stateValues.radians.tree,
                ).eq(angle);
                expect(
                    stateVariables[await resolvePathToNodeIdx("alpha")]
                        .stateValues.value.tree,
                ).eq(angle);
                expect(
                    stateVariables[await resolvePathToNodeIdx("alphadeg")]
                        .stateValues.value.tree,
                ).eq(angle);
            }
        }

        await check_items("\uff3f");

        let angles = [
            { latex: "\\pi/4", number: Math.PI / 4 },
            { latex: "1", number: 1 },
            { latex: "\\pi/3", number: Math.PI / 3 },
            { latex: "2\\pi/3", number: (2 * Math.PI) / 3 },
            { latex: "\\pi", number: Math.PI },
            { latex: "4", number: 4 },
            { latex: "3\\pi/2", number: (3 * Math.PI) / 2 },
            { latex: "11\\pi/6", number: (11 * Math.PI) / 6 },
            { latex: "2\\pi", number: 2 * Math.PI },
            { latex: "2\\pi+0.00001", number: 0.00001 },
        ];

        for (let a of angles) {
            await updateMathInputValue({
                latex: a.latex,
                componentIdx: await resolvePathToNodeIdx("theta"),
                core,
            });
            await check_items(a.number);
        }
    });

    async function check_rightangle(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        numerical: boolean = false,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .radians.tree,
        ).eqls(numerical ? Math.PI / 2 : ["/", "pi", 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .degrees.tree,
        ).eq(90);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[0].map((x) => x.tree),
        ).eqls([1, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[1].map((x) => x.tree),
        ).eqls([0, 0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .points[2][0].tree,
        ).closeTo(0, 1e-14);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .points[2][1].tree,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eq(numerical ? Math.PI : "pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eq(numerical ? Math.PI : "pi");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eq(180);
    }

    it("angle from number sugar", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="angle1">pi/2</angle>
  <math name="m1" simplify>2$angle1</math>
  <math name="m2" simplify>2$angle1.angle</math>
  <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });
        await check_rightangle(core, resolvePathToNodeIdx);
    });

    it("angle from radians number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="angle1" radians="pi/2" />
  <math name="m1" simplify>2$angle1</math>
  <math name="m2" simplify>2$angle1.angle</math>
  <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });

        await check_rightangle(core, resolvePathToNodeIdx);
    });

    it("angle from degrees number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="angle1" degrees="90" />
  <math name="m1" simplify>2$angle1</math>
  <math name="m2" simplify>2$angle1.angle</math>
  <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });

        await check_rightangle(core, resolvePathToNodeIdx);
    });

    it("angle from sugar with macro and string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="angle1">$pi/2</angle>
  <math name="m1" simplify>2$angle1</math>
  <math name="m2" simplify>2$angle1.angle</math>
  <math name="m3" simplify>2$angle1.degrees</math>
  <math name="pi">pi</math>
  `,
        });

        await check_rightangle(core, resolvePathToNodeIdx);
    });

    it("empty angle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<angle name="angle1" />
<math name="m1" simplify>2$angle1</math>
<math name="m2" simplify>2$angle1.angle</math>
<math name="m3" simplify>2$angle1.degrees</math>
`,
        });

        await check_rightangle(core, resolvePathToNodeIdx, true);
    });

    async function check_alphaangle(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .radians.tree,
        ).eq("alpha");
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .degrees.tree,
        ).eqls(["/", ["*", 180, "alpha"], "pi"]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[0].map((x) => x.tree),
        ).eqls([1, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[1].map((x) => x.tree),
        ).eqls([0, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[2].map((x) => x.tree),
        ).eqls(["\uff3f", "\uff3f"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["*", 2, "alpha"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["*", 2, "alpha"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["/", ["*", 360, "alpha"], "pi"]);
    }

    it("angle from variable sugar", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <angle name="angle1" >alpha</angle>
    <math name="m1" simplify>2$angle1</math>
    <math name="m2" simplify>2$angle1.angle</math>
    <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });

        await check_alphaangle(core, resolvePathToNodeIdx);
    });

    it("angle from variable radians", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <angle name="angle1" radians="alpha" />
    <math name="m1" simplify>2$angle1</math>
    <math name="m2" simplify>2$angle1.angle</math>
    <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });

        await check_alphaangle(core, resolvePathToNodeIdx);
    });

    it("angle from variable degrees", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <angle name="angle1" degrees="alpha" />
    <math name="m1" simplify>2$angle1</math>
    <math name="m2" simplify>2$angle1.angle</math>
    <math name="m3" simplify>2$angle1.degrees</math>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .radians.tree,
        ).eqls(["/", ["*", "alpha", "pi"], 180]);
        expect(
            stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                .degrees.tree,
        ).eqls("alpha");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[0].map((x) => x.tree),
        ).eqls([1, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[1].map((x) => x.tree),
        ).eqls([0, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("angle1")
            ].stateValues.points[2].map((x) => x.tree),
        ).eqls(["\uff3f", "\uff3f"]);
        // TODO: once can simplify fractions, these should be: ["/", ["*", "alpha", "pi"], 90]
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.value
                .tree,
        ).eqls(["/", ["*", 2, "alpha", "pi"], 180]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.value
                .tree,
        ).eqls(["/", ["*", 2, "alpha", "pi"], 180]);
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.value
                .tree,
        ).eqls(["*", 2, "alpha"]);
    });

    it("choose reflex angle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>choose reflex angle: <textInput name="ra"  /></p>
  <text extend="$alpha1.chooseReflexAngle" name="ra2" />
  <graph>
    <point name="A">(-6,5)</point>
    <point name="B">(0,0)</point>
    <point name="C">(4,2)</point>
    <angle name="alpha1" through="$A $B $C" chooseReflexAngle="$ra" />
  </graph>
  `,
        });

        function angleFromPs(ps: number[][], reflex?: number) {
            let angle =
                Math.atan2(ps[2][1] - ps[1][1], ps[2][0] - ps[1][0]) -
                Math.atan2(ps[0][1] - ps[1][1], ps[0][0] - ps[1][0]);
            if (angle < 0) {
                angle += 2 * Math.PI;
            }
            if (angle > Math.PI) {
                if (reflex === -1) {
                    angle = 2 * Math.PI - angle;
                }
            } else if (reflex === 1) {
                angle = 2 * Math.PI - angle;
            }
            return angle;
        }

        // not sure how to test this
        // but at least make sure we don't throw any errors.

        let points = [
            [-6, 5],
            [0, 0],
            [4, 2],
        ];

        // should now be > pi if no modifications

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("never");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points, -1));

        await updateTextInputValue({
            text: "allowed",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("allowed");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));

        await updateTextInputValue({
            text: "always",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("always");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 1,
            y: -3,
            core,
        });

        points[0] = [1, -3];
        // should now be < pi if no modifications

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("always");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points, 1));

        await updateTextInputValue({
            text: "never",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("never");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));

        await updateTextInputValue({
            text: "allowed",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("allowed");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("C"),
            x: -1,
            y: -5,
            core,
        });

        points[2] = [-1, -5];
        // should now be > pi if no modifications

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("allowed");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));

        await updateTextInputValue({
            text: "never",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("never");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points, -1));

        await updateTextInputValue({
            text: "always",
            componentIdx: await resolvePathToNodeIdx("ra"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ra2")].stateValues.value,
        ).eq("always");
        expect(
            stateVariables[await resolvePathToNodeIdx("alpha1")].stateValues
                .radians.tree,
        ).eq(angleFromPs(points));
    });

    async function test_angle_through_points({
        core,
        resolvePathToNodeIdx,
        initialRadians,
        radiansName,
        degreesName,
        numPoints,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialRadians: number | string | (number | string)[];
        radiansName?: string;
        degreesName?: string;
        numPoints: number;
    }) {
        async function check_items(
            radians:
                | number
                | string
                | (number | string)[]
                | (number | string | (number | string)[])[],
            x1: number,
            y1: number,
            x2: number,
            y2: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let radiansNumber: number;
            if (typeof radians === "number") {
                radiansNumber = radians;
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).closeTo(radians, 1e-14);
            } else {
                radiansNumber = me.fromAst(radians).evaluate_to_constant();
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).eqls(radians);
            }
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("angle1")
                ].stateValues.points[0].map((x) => x.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("angle1")
                ].stateValues.points[1].map((x) => x.tree),
            ).eqls([x2, y2]);

            if (Number.isFinite(radiansNumber)) {
                let theta = Math.atan2(y1 - y2, x1 - x2) + radiansNumber;
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.points[2][0].tree,
                ).closeTo(x2 + Math.cos(theta), 1e-14);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.points[2][1].tree,
                ).closeTo(y2 + Math.sin(theta), 1e-14);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("angle1")
                    ].stateValues.points[2].map((x) => x.tree),
                ).eqls(["\uff3f", "\uff3f"]);
            }
        }

        let x1 = 3,
            y1 = 5,
            x2 = 0,
            y2 = 0;

        if (numPoints == 2) {
            x2 = 6;
            y2 = 1;
        }

        let radians = initialRadians;
        await check_items(radians, x1, y1, x2, y2);

        // move points
        x1 = 1;
        y1 = 7;
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: x1,
            y: y1,
            core,
        });
        if (numPoints === 2) {
            x2 = -3;
            y2 = -2;
            await movePoint({
                componentIdx: await resolvePathToNodeIdx("B"),
                x: x2,
                y: y2,
                core,
            });
        }
        await check_items(radians, x1, y1, x2, y2);

        if (radiansName) {
            // change desired radians
            await updateMathInputValue({
                latex: "2\\pi/5",
                componentIdx: await resolvePathToNodeIdx(radiansName),
                core,
            });
            await check_items(["/", ["*", 2, "pi"], 5], x1, y1, x2, y2);

            // change desired radians to variable
            await updateMathInputValue({
                latex: "\\theta",
                componentIdx: await resolvePathToNodeIdx(radiansName),
                core,
            });
            await check_items("theta", x1, y1, x2, y2);
        }

        if (degreesName) {
            // change desired degrees
            await updateMathInputValue({
                latex: "180",
                componentIdx: await resolvePathToNodeIdx(degreesName),
                core,
            });
            await check_items("pi", x1, y1, x2, y2);

            // change desired degrees to variable
            await updateMathInputValue({
                latex: "\\theta",
                componentIdx: await resolvePathToNodeIdx(degreesName),
                core,
            });
            await check_items(["/", ["*", "pi", "theta"], 180], x1, y1, x2, y2);
        }
    }

    it("angle through 1 point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="A">(3,5)</point>
    <angle name="angle1" through="$A" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: Math.PI / 2,
            numPoints: 1,
        });
    });

    it("angle through 1 point, specify radians", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Desired radians: <mathInput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <angle name="angle1" through="$A" radians="$desiredRadians" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 3],
            radiansName: "desiredRadians",
            numPoints: 1,
        });
    });

    it("angle through 1 point, specify degrees", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Desired degrees: <mathInput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <angle name="angle1" through="$A" degrees="$desiredDegrees" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 2],
            degreesName: "desiredDegrees",
            numPoints: 1,
        });
    });

    it("angle through 2 points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    <angle name="angle1" through="$A $B" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: Math.PI / 2,
            numPoints: 2,
        });
    });

    it("angle through 2 points, specify radians", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Desired radians: <mathInput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    <angle name="angle1" through="$A $B" radians="$desiredRadians" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 3],
            radiansName: "desiredRadians",
            numPoints: 2,
        });
    });

    it("angle through 2 points, specify degrees", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Desired radians: <mathInput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <point name="A">(3,5)</point>
    <point name="B">(6,1)</point>
    <angle name="angle1" through="$A $B" degrees="$desiredDegrees" />
  </graph>
  `,
        });

        await test_angle_through_points({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 2],
            degreesName: "desiredDegrees",
            numPoints: 2,
        });
    });

    async function test_angle_with_one_line({
        core,
        resolvePathToNodeIdx,
        initialRadians,
        radiansName,
        degreesName,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialRadians: number | string | (number | string)[];
        radiansName?: string;
        degreesName?: string;
    }) {
        async function check_items(
            radians:
                | number
                | string
                | (number | string)[]
                | (number | string | (number | string)[])[],
            point: number[],
            slope: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let radiansNumber: number;
            if (typeof radians === "number") {
                radiansNumber = radians;
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).closeTo(radians, 1e-14);
            } else {
                radiansNumber = me.fromAst(radians).evaluate_to_constant();
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.radians.tree,
                ).eqls(radians);
            }
            let mag = Math.sqrt(1 + slope ** 2);
            let d = [1 / mag, slope / mag];
            expect(
                stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                    .points[0][0].tree,
            ).closeTo(point[0] + d[0], 1e-14);
            expect(
                stateVariables[await resolvePathToNodeIdx("angle1")].stateValues
                    .points[0][1].tree,
            ).closeTo(point[1] + d[1], 1e-14);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("angle1")
                ].stateValues.points[1].map((x) => x.tree),
            ).eqls(point);

            if (Number.isFinite(radiansNumber)) {
                let theta = Math.atan2(slope, 1) + radiansNumber;
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.points[2][0].tree,
                ).closeTo(point[0] + Math.cos(theta), 1e-14);
                expect(
                    stateVariables[await resolvePathToNodeIdx("angle1")]
                        .stateValues.points[2][1].tree,
                ).closeTo(point[1] + Math.sin(theta), 1e-14);
            } else {
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx("angle1")
                    ].stateValues.points[2].map((x) => x.tree),
                ).eqls(["\uff3f", "\uff3f"]);
            }
        }

        // y = 2x + 1
        let pointNearestOrigin = [-2 / 5, 1 / 5];
        let lineSlope = 2;

        let radians = initialRadians;
        await check_items(radians, pointNearestOrigin, lineSlope);

        // change line
        await updateMathInputValue({
            latex: "y=-1/2x+3",
            componentIdx: await resolvePathToNodeIdx("equation"),
            core,
        });
        pointNearestOrigin = [6 / 5, 12 / 5];
        lineSlope = -1 / 2;
        await check_items(radians, pointNearestOrigin, lineSlope);

        if (radiansName) {
            // change desired radians
            await updateMathInputValue({
                latex: "2\\pi/5",
                componentIdx: await resolvePathToNodeIdx(radiansName),
                core,
            });
            await check_items(
                ["/", ["*", 2, "pi"], 5],
                pointNearestOrigin,
                lineSlope,
            );

            // change desired radians to variable
            await updateMathInputValue({
                latex: "\\theta",
                componentIdx: await resolvePathToNodeIdx(radiansName),
                core,
            });
            await check_items("theta", pointNearestOrigin, lineSlope);
        }

        if (degreesName) {
            // change desired degrees
            await updateMathInputValue({
                latex: "180",
                componentIdx: await resolvePathToNodeIdx(degreesName),
                core,
            });
            await check_items("pi", pointNearestOrigin, lineSlope);

            // change desired degrees to variable
            await updateMathInputValue({
                latex: "\\theta",
                componentIdx: await resolvePathToNodeIdx(degreesName),
                core,
            });
            await check_items(
                ["/", ["*", "pi", "theta"], 180],
                pointNearestOrigin,
                lineSlope,
            );
        }
    }

    it("angle with one line", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Equation of line: <mathInput name="equation" prefill="y=2x+1" /></p>
  <graph>
    <line name="l">$equation</line>
    <angle name="angle1" betweenLines="$l"/>
  </graph>
  `,
        });

        await test_angle_with_one_line({
            core,
            resolvePathToNodeIdx,
            initialRadians: Math.PI / 2,
        });
    });

    it("angle with one line, specify radians", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Equation of line: <mathInput name="equation" prefill="y=2x+1" /></p>
  <p>Desired radians: <mathInput name="desiredRadians" prefill="pi/3" /></p>
  <graph>
    <line name="l">$equation</line>
    <angle name="angle1" betweenLines="$l" radians="$desiredRadians" />
  </graph>
  `,
        });

        await test_angle_with_one_line({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 3],
            radiansName: "desiredRadians",
        });
    });

    it("angle with one line, specify degrees", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Equation of line: <mathInput name="equation" prefill="y=2x+1" /></p>
  <p>Desired degrees: <mathInput name="desiredDegrees" prefill="90" /></p>
  <graph>
    <line name="l">$equation</line>
    <angle name="angle1" betweenLines="$l" degrees="$desiredDegrees" />
  </graph>
  `,
        });

        await test_angle_with_one_line({
            core,
            resolvePathToNodeIdx,
            initialRadians: ["/", "pi", 2],
            degreesName: "desiredDegrees",
        });
    });

    it("angle with label", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <angle name="a">
      <label><m>\\alpha^2</m></label>
    </angle>
    <angle name="b" through="(5,7)">
      <label>This is <math>m/2</math></label>
    </angle>
  </graph>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues.label,
        ).eq("\\(\\alpha^2\\)");
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues.label,
        ).eq("This is \\(\\frac{m}{2}\\)");
    });

    it("display digits and decimals, overwrite in copies", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="a">1.39372582305929123842034823</angle>
  <angle name="aDig5a" displayDigits="5" extend="$a" />
  <angle name="aDec6a" displayDecimals="6" extend="$a" />
  <angle name="aDig5b" displayDigits="5" extend="$aDec6a" />
  <angle name="aDec6b" displayDecimals="6" extend="$aDig5a" />
  <angle name="aDig5c" displayDigits="5" extend="$aDec6b" />
  <angle name="aDec6c" displayDecimals="6" extend="$aDig5b" />

  <angle name="aDig5d" displayDigits="5">1.39372582305929123842034823</angle>
  <angle name="aDec6d" displayDecimals="6">1.39372582305929123842034823</angle>
  <angle name="aDig5e" displayDigits="5" extend="$aDec6d" />
  <angle name="aDec6e" displayDecimals="6" extend="$aDig5d" />
  <angle name="aDig5f" displayDigits="5" extend="$aDec6e" />
  <angle name="aDec6f" displayDecimals="6" extend="$aDig5e" />

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .latexForRenderer,
        ).eq("1.39");

        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5a")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6a")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5b")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6b")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5c")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6c")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5d")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6d")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5e")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6e")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDig5f")].stateValues
                .latexForRenderer,
        ).eq("1.3937");
        expect(
            stateVariables[await resolvePathToNodeIdx("aDec6f")].stateValues
                .latexForRenderer,
        ).eq("1.393726");
    });

    it("emphasize right angle", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <angle name="a1" through="(-5,0) (0,0) (0,-5)" />
    <angle name="a2" through="(5,0) (0,0) (0,-5)" emphasizeRightAngle="false" />
    <angle name="a3" through="(5,0) (0,0) (0,5)" emphasizeRightAngle="$bi3" />
  </graph>

  <p>Emphasize right angle 1: <booleanInput name="bi1" bindValueTo="$a1.emphasizeRightAngle" /></p>
  <p>Emphasize right angle 2: <booleanInput name="bi2" bindValueTo="$a2.emphasizeRightAngle" /></p>
  <p>Emphasize right angle 3: <booleanInput name="bi3" /></p>

  <p name="emphasize">Emphasize right angle: $a1.emphasizeRightAngle, $a2.emphasizeRightAngle, $a3.emphasizeRightAngle</p>
  
  `,
        });

        // TODO: How to check renderer itself?

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("emphasize")].stateValues
                .text,
        ).eq("Emphasize right angle: true, false, false");
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .emphasizeRightAngle,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .emphasizeRightAngle,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .emphasizeRightAngle,
        ).eq(false);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("bi1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi2"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("bi3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("emphasize")].stateValues
                .text,
        ).eq("Emphasize right angle: false, true, true");
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .emphasizeRightAngle,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .emphasizeRightAngle,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .emphasizeRightAngle,
        ).eq(true);
    });

    it("handle angle with bad through point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <angle name="bad" through="(0,1) (0,0), (1,5)" />

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("bad")].stateValues
                .radians.tree,
        ).eq("\uff3f");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid point in through of <angle>",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(3);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.column).eq(52);
    });
});
