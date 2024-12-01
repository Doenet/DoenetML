import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Equilibriumcurve Tag Tests", async () => {
    it("equilibriumcurve change stable", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace>
      <equilibriumcurve name="A" switchAble through="(1,2) (3,4) (2,6)"/>
      <equilibriumcurve name="B" stable="false" through="(3,2) (5,4) (4,6)" />
      <equilibriumcurve name="C" stable="$(../b1)" styleNumber="2" through="(-3,2) (-5,4) (-4,6)" />
      <equilibriumcurve name="D" stable="$(../b2)" styleNumber="2" switchable through="(-1,2) (-3,4) (-2,6)" />
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
        let svs = await returnAllStateVariables(core);
        expect(svs["/g/A"].stateValues.numericalThroughPoints).eqls(throughA);
        expect(svs["/g/B"].stateValues.numericalThroughPoints).eqls(throughB);
        expect(svs["/g/C"].stateValues.numericalThroughPoints).eqls(throughC);
        expect(svs["/g/D"].stateValues.numericalThroughPoints).eqls(throughD);
        expect(svs["/g2/A"].stateValues.numericalThroughPoints).eqls(throughA);
        expect(svs["/g2/B"].stateValues.numericalThroughPoints).eqls(throughB);
        expect(svs["/g2/C"].stateValues.numericalThroughPoints).eqls(throughC);
        expect(svs["/g2/D"].stateValues.numericalThroughPoints).eqls(throughD);

        let As = true;
        let Cs = false;
        let Ds = false;

        async function check_stable() {
            let stateVariables = await returnAllStateVariables(core);
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
        await updateBooleanInputValue({name: "/b1", boolean: Cs, core});
        await check_stable();

        // switch D via boolean input
        Ds = !Ds;
        await updateBooleanInputValue({name: "/b2", boolean: Ds, core});
        await check_stable();

        // switch A via first action
        As = !As;
        await core.requestAction({
            componentName: "/g/A",
            actionName: "switchCurve",
            args: {},
            event: null,
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentName: "/g2/A",
            actionName: "switchCurve",
            args: {},
            event: null,
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentName: "/g/B",
            actionName: "switchCurve",
            args: {},
            event: null,
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentName: "/g2/C",
            actionName: "switchCurve",
            args: {},
            event: null,
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentName: "/g2/D",
            actionName: "switchCurve",
            args: {},
            event: null,
        });
    });
});
