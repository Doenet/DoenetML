import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateBooleanInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Equilibriumpoint Tag Tests", async () => {
    it("equilibriumpoint change stable", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace>
      <equilibriumpoint name="A" switchAble>(4,0)</equilibriumpoint>
      <equilibriumpoint name="B" stable="false">(7,0)</equilibriumpoint>
      <equilibriumpoint name="C" stable="$(../b1)" styleNumber="2">(-9,0)</equilibriumpoint>
      <equilibriumpoint name="D" stable="$(../b2)" styleNumber="2" switchable>(-3,0)</equilibriumpoint>
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
    `,
        });

        const pointA = [4, 0];
        const pointB = [7, 0];
        const pointC = [-9, 0];
        const pointD = [-3, 0];
        let svs = await returnAllStateVariables(core);
        expect(svs["/g/A"].stateValues.xs.map((v) => v.tree)).eqls(pointA);
        expect(svs["/g/B"].stateValues.xs.map((v) => v.tree)).eqls(pointB);
        expect(svs["/g/C"].stateValues.xs.map((v) => v.tree)).eqls(pointC);
        expect(svs["/g/D"].stateValues.xs.map((v) => v.tree)).eqls(pointD);
        expect(svs["/g2/A"].stateValues.xs.map((v) => v.tree)).eqls(pointA);
        expect(svs["/g2/B"].stateValues.xs.map((v) => v.tree)).eqls(pointB);
        expect(svs["/g2/C"].stateValues.xs.map((v) => v.tree)).eqls(pointC);
        expect(svs["/g2/D"].stateValues.xs.map((v) => v.tree)).eqls(pointD);

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
            actionName: "switchPoint",
            args: {},
            event: null,
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentName: "/g2/A",
            actionName: "switchPoint",
            args: {},
            event: null,
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentName: "/g/B",
            actionName: "switchPoint",
            args: {},
            event: null,
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentName: "/g2/C",
            actionName: "switchPoint",
            args: {},
            event: null,
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentName: "/g2/D",
            actionName: "switchPoint",
            args: {},
            event: null,
        });
    });
});
