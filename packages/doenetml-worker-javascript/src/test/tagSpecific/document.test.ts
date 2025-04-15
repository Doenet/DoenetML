import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Document tag tests", async () => {
    it("get 1 for document credit with nothing", async () => {
        let core = await createTestCore({
            doenetML: `
  $_document1.creditAchieved{assignNames="docCa"}

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
    });

    it("document credit when have problem with nothing", async () => {
        let core = await createTestCore({
            doenetML: `
  $_document1.creditAchieved{assignNames="docCa"}
  <p><answer name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/docCa"].stateValues.value).eq(0.5);

        let mathInputName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            name: mathInputName,
            core,
        });
        await submitAnswer({ name: "/ans", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
    });

    it("get document credit even when have composites as a siblings", async () => {
        let core = await createTestCore({
            doenetML: `
  $_document1.creditAchieved{assignNames="docCa"}
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
        expect(stateVariables["/docCa"].stateValues.value).eq(0);

        let mathInputName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            name: mathInputName,
            core,
        });
        await submitAnswer({ name: "/ans", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
    });

    it(`component credit achieved, don't skip weight 0`, async () => {
        let core = await createTestCore({
            doenetML: `
  $_document1.creditAchieved{assignNames="docCa"}
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
        expect(stateVariables["/docCa"].stateValues.value).eq(0);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([0, 0, 0, 0, 0]);

        let mathInputXName =
            stateVariables["/x"].stateValues.inputChildren[0].componentName;
        let mathInputYName =
            stateVariables["/y"].stateValues.inputChildren[0].componentName;
        let mathInputZName =
            stateVariables["/z"].stateValues.inputChildren[0].componentName;
        let mathInputAName =
            stateVariables["/a"].stateValues.inputChildren[0].componentName;
        let mathInputBName =
            stateVariables["/b"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            name: mathInputXName,
            core,
        });
        await submitAnswer({ name: "/x", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/x"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1 / 3);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([1, 0, 0, 0, 0]);

        await updateMathInputValue({
            latex: "a",
            name: mathInputAName,
            core,
        });
        await submitAnswer({ name: "/a", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/a"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1 / 3);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([1, 1, 0, 0, 0]);

        await updateMathInputValue({
            latex: "y",
            name: mathInputYName,
            core,
        });
        await submitAnswer({ name: "/y", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/y"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(2 / 3);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([1, 1, 1, 0, 0]);

        await updateMathInputValue({
            latex: "b",
            name: mathInputBName,
            core,
        });
        await submitAnswer({ name: "/b", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/b"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(2 / 3);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 0]);

        await updateMathInputValue({
            latex: "z",
            name: mathInputZName,
            core,
        });
        await submitAnswer({ name: "/z", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/z"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
        expect(
            stateVariables["/_document1"].stateValues.componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 1]);
    });

    it("explicit document tag, ignore outer blank strings", async () => {
        let core = await createTestCore({
            doenetML: `

  <document>a</document>



  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(Object.keys(stateVariables).length).eq(1);

        expect(stateVariables["/_document1"].activeChildren).eqls(["a"]);
    });
});
