import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Equilibriumline Tag Tests", async () => {
    it("equilibriumline change stable", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace>
      <equilibriumline name="A" switchAble>y=4</equilibriumline>
      <equilibriumline name="B" stable="false">y=7</equilibriumline>
      <equilibriumline name="C" stable="$(../b1)" styleNumber="2">y=-9</equilibriumline>
      <equilibriumline name="D" stable="$(../b2)" styleNumber="2" switchable>y=-3</equilibriumline>
    </graph>
  
    <booleaninput name="b1" />
    <booleaninput name="b2" />

    <p><aslist>
    $(g/A.stable{assignNames="gAs"})
    $(g/B.stable{assignNames="gBs"})
    $(g/C.stable{assignNames="gCs"})
    $(g/D.stable{assignNames="gDs"})
    </aslist>
    </p>

    $g{name="g2"}

    <p><aslist>
    $(g2/A.stable{assignNames="g2As"})
    $(g2/B.stable{assignNames="g2Bs"})
    $(g2/C.stable{assignNames="g2Cs"})
    $(g2/D.stable{assignNames="g2Ds"})
    </aslist>
    </p>
    </p>`,
        });

        const equationA = ["=", "y", 4];
        const equationB = ["=", "y", 7];
        const equationC = ["=", "y", -9];
        const equationD = ["=", "y", -3];
        let svs = await core.returnAllStateVariables(true);
        expect(svs["/g/A"].stateValues.equation.tree).eqls(equationA);
        expect(svs["/g/B"].stateValues.equation.tree).eqls(equationB);
        expect(svs["/g/C"].stateValues.equation.tree).eqls(equationC);
        expect(svs["/g/D"].stateValues.equation.tree).eqls(equationD);
        expect(svs["/g2/A"].stateValues.equation.tree).eqls(equationA);
        expect(svs["/g2/B"].stateValues.equation.tree).eqls(equationB);
        expect(svs["/g2/C"].stateValues.equation.tree).eqls(equationC);
        expect(svs["/g2/D"].stateValues.equation.tree).eqls(equationD);

        let As = true;
        let Cs = false;
        let Ds = false;

        async function check_stable() {
            let stateVariables = await core.returnAllStateVariables(true);
            expect(stateVariables["/gAs"].stateValues.value).eqls(As);
            expect(stateVariables["/gBs"].stateValues.value).eqls(false);
            expect(stateVariables["/gCs"].stateValues.value).eqls(Cs);
            expect(stateVariables["/gDs"].stateValues.value).eqls(Ds);
            expect(stateVariables["/g2As"].stateValues.value).eqls(As);
            expect(stateVariables["/g2Bs"].stateValues.value).eqls(false);
            expect(stateVariables["/g2Cs"].stateValues.value).eqls(Cs);
            expect(stateVariables["/g2Ds"].stateValues.value).eqls(Ds);
            expect(stateVariables["/g/A"].stateValues.stable).eq(As);
            expect(stateVariables["/g/B"].stateValues.stable).eq(false);
            expect(stateVariables["/g/C"].stateValues.stable).eq(Cs);
            expect(stateVariables["/g/D"].stateValues.stable).eq(Ds);
            expect(stateVariables["/g2/A"].stateValues.stable).eq(As);
            expect(stateVariables["/g2/B"].stateValues.stable).eq(false);
            expect(stateVariables["/g2/C"].stateValues.stable).eq(Cs);
            expect(stateVariables["/g2/D"].stateValues.stable).eq(Ds);
        }

        await check_stable();

        // switch C via boolean input
        Cs = !Cs;
        await updateBooleanInputValue({ name: "/b1", boolean: Cs, core });
        await check_stable();

        // switch D via boolean input
        Ds = !Ds;
        await updateBooleanInputValue({ name: "/b2", boolean: Ds, core });
        await check_stable();

        // switch A via first action
        As = !As;
        await core.requestAction({
            componentName: "/g/A",
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentName: "/g2/A",
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentName: "/g/B",
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentName: "/g2/C",
            actionName: "switchLine",
            args: {},
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentName: "/g2/D",
            actionName: "switchLine",
            args: {},
        });
    });
});
