import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("equilibriumLine Tag Tests", async () => {
    it("equilibriumLine change stable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
      <equilibriumLine name="A" switchAble>y=4</equilibriumLine>
      <equilibriumLine name="B" stable="false">y=7</equilibriumLine>
      <equilibriumLine name="C" stable="$b1" styleNumber="2">y=-9</equilibriumLine>
      <equilibriumLine name="D" stable="$b2" styleNumber="2" switchable>y=-3</equilibriumLine>
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

        const equationA = ["=", "y", 4];
        const equationB = ["=", "y", 7];
        const equationC = ["=", "y", -9];
        const equationD = ["=", "y", -3];
        let svs = await core.returnAllStateVariables(false, true);
        expect(
            svs[await resolvePathToNodeIdx("g.A")].stateValues.equation.tree,
        ).eqls(equationA);
        expect(
            svs[await resolvePathToNodeIdx("g.B")].stateValues.equation.tree,
        ).eqls(equationB);
        expect(
            svs[await resolvePathToNodeIdx("g.C")].stateValues.equation.tree,
        ).eqls(equationC);
        expect(
            svs[await resolvePathToNodeIdx("g.D")].stateValues.equation.tree,
        ).eqls(equationD);
        expect(
            svs[await resolvePathToNodeIdx("g2.A")].stateValues.equation.tree,
        ).eqls(equationA);
        expect(
            svs[await resolvePathToNodeIdx("g2.B")].stateValues.equation.tree,
        ).eqls(equationB);
        expect(
            svs[await resolvePathToNodeIdx("g2.C")].stateValues.equation.tree,
        ).eqls(equationC);
        expect(
            svs[await resolvePathToNodeIdx("g2.D")].stateValues.equation.tree,
        ).eqls(equationD);

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
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g.B"),
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.C"),
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("g2.D"),
            actionName: "switchLine",
            args: {},
        });
    });
});
