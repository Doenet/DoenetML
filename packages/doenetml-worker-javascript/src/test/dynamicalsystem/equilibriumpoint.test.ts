import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("equilibriumPoint Tag Tests", async () => {
    it("equilibriumPoint change stable", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g" newNamespace>
      <equilibriumPoint name="A" switchAble>(4,0)</equilibriumPoint>
      <equilibriumPoint name="B" stable="false">(7,0)</equilibriumPoint>
      <equilibriumPoint name="C" stable="$b1" styleNumber="2">(-9,0)</equilibriumPoint>
      <equilibriumPoint name="D" stable="$b2" styleNumber="2" switchable>(-3,0)</equilibriumPoint>
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
    </p>
    `,
        });

        const pointA = [4, 0];
        const pointB = [7, 0];
        const pointC = [-9, 0];
        const pointD = [-3, 0];
        let svs = await core.returnAllStateVariables(false, true);
        expect(
            svs[resolveComponentName("g.A")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointA);
        expect(
            svs[resolveComponentName("g.B")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointB);
        expect(
            svs[resolveComponentName("g.C")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointC);
        expect(
            svs[resolveComponentName("g.D")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointD);
        expect(
            svs[resolveComponentName("g2.A")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointA);
        expect(
            svs[resolveComponentName("g2.B")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointB);
        expect(
            svs[resolveComponentName("g2.C")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointC);
        expect(
            svs[resolveComponentName("g2.D")].stateValues.xs.map((v) => v.tree),
        ).eqls(pointD);

        let As = true;
        let Cs = false;
        let Ds = false;

        async function check_stable() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[resolveComponentName("gAs")].stateValues.value,
            ).eqls(As);
            expect(
                stateVariables[resolveComponentName("gBs")].stateValues.value,
            ).eqls(false);
            expect(
                stateVariables[resolveComponentName("gCs")].stateValues.value,
            ).eqls(Cs);
            expect(
                stateVariables[resolveComponentName("gDs")].stateValues.value,
            ).eqls(Ds);
            expect(
                stateVariables[resolveComponentName("g2As")].stateValues.value,
            ).eqls(As);
            expect(
                stateVariables[resolveComponentName("g2Bs")].stateValues.value,
            ).eqls(false);
            expect(
                stateVariables[resolveComponentName("g2Cs")].stateValues.value,
            ).eqls(Cs);
            expect(
                stateVariables[resolveComponentName("g2Ds")].stateValues.value,
            ).eqls(Ds);
            expect(
                stateVariables[resolveComponentName("g.A")].stateValues.stable,
            ).eq(As);
            expect(
                stateVariables[resolveComponentName("g.B")].stateValues.stable,
            ).eq(false);
            expect(
                stateVariables[resolveComponentName("g.C")].stateValues.stable,
            ).eq(Cs);
            expect(
                stateVariables[resolveComponentName("g.D")].stateValues.stable,
            ).eq(Ds);
            expect(
                stateVariables[resolveComponentName("g2.A")].stateValues.stable,
            ).eq(As);
            expect(
                stateVariables[resolveComponentName("g2.B")].stateValues.stable,
            ).eq(false);
            expect(
                stateVariables[resolveComponentName("g2.C")].stateValues.stable,
            ).eq(Cs);
            expect(
                stateVariables[resolveComponentName("g2.D")].stateValues.stable,
            ).eq(Ds);
        }

        await check_stable();

        // switch C via boolean input
        Cs = !Cs;
        await updateBooleanInputValue({
            componentIdx: resolveComponentName("b1"),
            boolean: Cs,
            core,
        });
        await check_stable();

        // switch D via boolean input
        Ds = !Ds;
        await updateBooleanInputValue({
            componentIdx: resolveComponentName("b2"),
            boolean: Ds,
            core,
        });
        await check_stable();

        // switch A via first action
        As = !As;
        await core.requestAction({
            componentIdx: resolveComponentName("g.A"),
            actionName: "switchPoint",
            args: {},
        });
        await check_stable();

        // switch A via second action
        As = !As;
        await core.requestAction({
            componentIdx: resolveComponentName("g2.A"),
            actionName: "switchPoint",
            args: {},
        });
        await check_stable();

        // cannot switch B via action
        await core.requestAction({
            componentIdx: resolveComponentName("g.B"),
            actionName: "switchPoint",
            args: {},
        });
        await check_stable();

        // cannot switch C via second action
        await core.requestAction({
            componentIdx: resolveComponentName("g2.C"),
            actionName: "switchPoint",
            args: {},
        });
        await check_stable();

        // switch D via second action
        Ds = !Ds;
        await core.requestAction({
            componentIdx: resolveComponentName("g2.D"),
            actionName: "switchPoint",
            args: {},
        });
    });
});
