import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Document tag tests", async () => {
    it("get 1 for document credit with nothing", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1);
    });

    it("document credit when have problem with nothing", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p><answer name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(0.5);

        let mathInputIdx =
            stateVariables[resolveComponentName("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("ans"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1);
    });

    it("get document credit even when have composites as a siblings", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <setup>
    <math name="m1">x</math>
  </setup>
  <group>
    <math name="m2">$m1</math>
  </group>
  <p><answer name="ans"><award>$m2</award></answer></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(0);

        let mathInputIdx =
            stateVariables[resolveComponentName("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("ans"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1);
    });

    it(`component credit achieved, don't skip weight 0`, async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p>x: <answer name="x">x</answer></p>
  <p>a: <answer name="a" weight="0">a</answer></p>
  <problem>
    <p>y: <answer name="y">y</answer></p>
  </problem>
  <problem weight="0">
    <p>b: <answer name="b">b</answer></p>
  </problem>
  <problem>
    <p>z: <answer name="z">z</answer></p>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(0);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([0, 0, 0, 0, 0]);

        let mathInputXIdx =
            stateVariables[resolveComponentName("x")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputYIdx =
            stateVariables[resolveComponentName("y")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputZIdx =
            stateVariables[resolveComponentName("z")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputAIdx =
            stateVariables[resolveComponentName("a")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputBIdx =
            stateVariables[resolveComponentName("b")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputXIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("x"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("x")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1 / 3);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 0, 0, 0, 0]);

        await updateMathInputValue({
            latex: "a",
            componentIdx: mathInputAIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("a"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("a")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1 / 3);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 0, 0, 0]);

        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputYIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("y"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("y")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(2 / 3);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 0, 0]);

        await updateMathInputValue({
            latex: "b",
            componentIdx: mathInputBIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("b"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("b")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(2 / 3);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 0]);

        await updateMathInputValue({
            latex: "z",
            componentIdx: mathInputZIdx,
            core,
        });
        await submitAnswer({ componentIdx: resolveComponentName("z"), core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("z")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("docCa")].stateValues.value,
        ).eq(1);
        expect(
            stateVariables[resolveComponentName("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 1]);
    });

    it("explicit document tag, ignore outer blank strings", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `

  <document>a</document>



  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(Object.keys(stateVariables).length).eq(1);

        expect(
            stateVariables[resolveComponentName("_document1")].activeChildren,
        ).eqls(["a"]);
    });
});
