import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("equilibriumCurve Tag Tests", async () => {
    it("equilibriumCurve change stable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <equilibriumCurve name="A" switchAble through="(1,2) (3,4) (2,6)"/>
      <equilibriumCurve name="B" stable="false" through="(3,2) (5,4) (4,6)" />
      <equilibriumCurve name="C" stable="$b1" styleNumber="2" through="(-3,2) (-5,4) (-4,6)" />
      <equilibriumCurve name="D" stable="$b2" styleNumber="2" switchable through="(-1,2) (-3,4) (-2,6)" />
    </graph>
  
    <booleanInput name="b1" />
    <booleanInput name="b2" />

    <p><asList>
    <boolean extend="$g.A.stable" name="gAs" />
    <boolean extend="$g.B.stable" name="gBs" />
    <boolean extend="$g.C.stable" name="gCs" />
    <boolean extend="$g.D.stable" name="gDs" />
    </asList>
    </p>

    <graph extend="$g" name="g2" />

    <p><asList>
    <boolean extend="$g2.A.stable" name="g2As" />
    <boolean extend="$g2.B.stable" name="g2Bs" />
    <boolean extend="$g2.C.stable" name="g2Cs" />
    <boolean extend="$g2.D.stable" name="g2Ds" />
    </asList>
    </p>`,
        });

        const throughA = [
            [1, 2],
            [3, 4],
            [2, 6],
        ];
        const throughB = [
            [3, 2],
            [5, 4],
            [4, 6],
        ];
        const throughC = [
            [-3, 2],
            [-5, 4],
            [-4, 6],
        ];
        const throughD = [
            [-1, 2],
            [-3, 4],
            [-2, 6],
        ];
        let svs = await core.returnAllStateVariables(false, true);
        expect(
            svs[await resolvePathToNodeIdx("g.A")].stateValues
                .numericalThroughPoints,
        ).eqls(throughA);
        expect(
            svs[await resolvePathToNodeIdx("g.B")].stateValues
                .numericalThroughPoints,
        ).eqls(throughB);
        expect(
            svs[await resolvePathToNodeIdx("g.C")].stateValues
                .numericalThroughPoints,
        ).eqls(throughC);
        expect(
            svs[await resolvePathToNodeIdx("g.D")].stateValues
                .numericalThroughPoints,
        ).eqls(throughD);
        expect(
            svs[await resolvePathToNodeIdx("g2.A")].stateValues
                .numericalThroughPoints,
        ).eqls(throughA);
        expect(
            svs[await resolvePathToNodeIdx("g2.B")].stateValues
                .numericalThroughPoints,
        ).eqls(throughB);
        expect(
            svs[await resolvePathToNodeIdx("g2.C")].stateValues
                .numericalThroughPoints,
        ).eqls(throughC);
        expect(
            svs[await resolvePathToNodeIdx("g2.D")].stateValues
                .numericalThroughPoints,
        ).eqls(throughD);

        let As = true;
        let Cs = false;
        let Ds = false;

        async function check_stable() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("gAs")].stateValues
                    .value,
            ).eqls(As);
            expect(
                stateVariables[await resolvePathToNodeIdx("gBs")].stateValues
                    .value,
            ).eqls(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("gCs")].stateValues
                    .value,
            ).eqls(Cs);
            expect(
                stateVariables[await resolvePathToNodeIdx("gDs")].stateValues
                    .value,
            ).eqls(Ds);

            expect(
                stateVariables[await resolvePathToNodeIdx("g2As")].stateValues
                    .value,
            ).eqls(As);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2Bs")].stateValues
                    .value,
            ).eqls(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2Cs")].stateValues
                    .value,
            ).eqls(Cs);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2Ds")].stateValues
                    .value,
            ).eqls(Ds);

            expect(
                stateVariables[await resolvePathToNodeIdx("g.A")].stateValues
                    .stable,
            ).eq(As);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.B")].stateValues
                    .stable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.C")].stateValues
                    .stable,
            ).eq(Cs);
            expect(
                stateVariables[await resolvePathToNodeIdx("g.D")].stateValues
                    .stable,
            ).eq(Ds);

            expect(
                stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues
                    .stable,
            ).eq(As);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.B")].stateValues
                    .stable,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.C")].stateValues
                    .stable,
            ).eq(Cs);
            expect(
                stateVariables[await resolvePathToNodeIdx("g2.D")].stateValues
                    .stable,
            ).eq(Ds);
        }

        await check_stable();

        // switch C via boolean input
        Cs = !Cs;
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("b1"),
            boolean: Cs,
            core,
        });
        await check_stable();

        // switch D via boolean input
        Ds = !Ds;
        await updateBooleanInputValue({
            componentIdx: await resolvePathToNodeIdx("b2"),
            boolean: Ds,
            core,
        });
        await check_stable();

        // switch A via first action
        As = !As;
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g.A"),
            actionName: "switchCurve",
            args: {},
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            actionName: "switchCurve",
            args: {},
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g.B"),
            actionName: "switchCurve",
            args: {},
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.C"),
            actionName: "switchCurve",
            args: {},
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.D"),
            actionName: "switchCurve",
            args: {},
        });
    });
});
