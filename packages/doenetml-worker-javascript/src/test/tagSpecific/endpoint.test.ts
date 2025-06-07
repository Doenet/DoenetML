import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Endpoint tag tests", async () => {
    it("endpoint change open", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
    <graph name="g">
      <endpoint name="A" open switchAble>(4,0)</endpoint>
      <endpoint name="B">(7,0)</endpoint>
      <lineSegment endpoints="$A $B" />
      <endpoint name="C" open="$b1" styleNumber="2">(-9,0)</endpoint>
      <endpoint name="D" open="$b2" styleNumber="2" switchable>(-3,0)</endpoint>
      <lineSegment endpoints="$C $D" styleNumber="2" />
    </graph>
  
    <booleanInput name="b1" />
    <booleanInput name="b2" />

    <graph extend="$g" name="g2" />
    `,
        });

        async function check_items(
            AOpen: boolean,
            BOpen: boolean,
            COpen: boolean,
            DOpen: boolean,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[resolveComponentName("g.A")].stateValues.open,
            ).eq(AOpen);
            expect(
                stateVariables[resolveComponentName("g.B")].stateValues.open,
            ).eq(BOpen);
            expect(
                stateVariables[resolveComponentName("g.C")].stateValues.open,
            ).eq(COpen);
            expect(
                stateVariables[resolveComponentName("g.D")].stateValues.open,
            ).eq(DOpen);

            expect(
                stateVariables[resolveComponentName("g2.A")].stateValues.open,
            ).eq(AOpen);
            expect(
                stateVariables[resolveComponentName("g2.B")].stateValues.open,
            ).eq(BOpen);
            expect(
                stateVariables[resolveComponentName("g2.C")].stateValues.open,
            ).eq(COpen);
            expect(
                stateVariables[resolveComponentName("g2.D")].stateValues.open,
            ).eq(DOpen);
        }

        // check positions
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("g.A")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([4, 0]);
        expect(
            stateVariables[resolveComponentName("g.B")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([7, 0]);
        expect(
            stateVariables[resolveComponentName("g.C")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([-9, 0]);
        expect(
            stateVariables[resolveComponentName("g.D")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([-3, 0]);
        expect(
            stateVariables[resolveComponentName("g2.A")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([4, 0]);
        expect(
            stateVariables[resolveComponentName("g2.B")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([7, 0]);
        expect(
            stateVariables[resolveComponentName("g2.C")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([-9, 0]);
        expect(
            stateVariables[resolveComponentName("g2.D")].stateValues.xs.map(
                (v) => v.tree,
            ),
        ).eqls([-3, 0]);

        let AOpen = true;
        let BOpen = false;
        let COpen = false;
        let DOpen = false;

        await check_items(AOpen, BOpen, COpen, DOpen);

        // switch C via boolean input
        COpen = true;
        await updateBooleanInputValue({
            boolean: COpen,
            componentIdx: resolveComponentName("b1"),
            core,
        });
        await check_items(AOpen, BOpen, COpen, DOpen);

        // switch D via boolean input
        DOpen = true;
        await updateBooleanInputValue({
            boolean: DOpen,
            componentIdx: resolveComponentName("b2"),
            core,
        });
        await check_items(AOpen, BOpen, COpen, DOpen);

        // switch A via first action
        await core.requestAction({
            actionName: "switchPoint",
            componentIdx: resolveComponentName("g.A"),
            args: {},
        });
        AOpen = false;
        await check_items(AOpen, BOpen, COpen, DOpen);

        // switch A via second action
        await core.requestAction({
            actionName: "switchPoint",
            componentIdx: resolveComponentName("g2.A"),
            args: {},
        });
        AOpen = true;
        await check_items(AOpen, BOpen, COpen, DOpen);

        // cannot switch B via action
        await core.requestAction({
            actionName: "switchPoint",
            componentIdx: resolveComponentName("g.B"),
            args: {},
        });
        await check_items(AOpen, BOpen, COpen, DOpen);

        // cannot switch C via second action
        await core.requestAction({
            actionName: "switchPoint",
            componentIdx: resolveComponentName("g2.C"),
            args: {},
        });
        await check_items(AOpen, BOpen, COpen, DOpen);

        // switch D via second action
        await core.requestAction({
            actionName: "switchPoint",
            componentIdx: resolveComponentName("g2.D"),
            args: {},
        });
        DOpen = false;
        await check_items(AOpen, BOpen, COpen, DOpen);
    });
});
