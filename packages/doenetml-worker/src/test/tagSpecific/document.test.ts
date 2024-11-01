import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Document tag tests", async () => {
    it("get 1 for document credit with nothing", async () => {
        let core = await createTestCore({
            doenetML: `
  $_document1.creditAchieved{assignNames="docCa"}

  `,
        });

        const stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/docCa"].stateValues.value).eq(0.5);

        let mathInputName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            componentName: mathInputName,
            core,
        });
        await core.requestAction({
            componentName: "/ans",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/docCa"].stateValues.value).eq(0);

        let mathInputName =
            stateVariables["/ans"].stateValues.inputChildren[0].componentName;

        await updateMathInputValue({
            latex: "x",
            componentName: mathInputName,
            core,
        });
        await core.requestAction({
            componentName: "/ans",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
    });

    it(`item credit achieved, don't skip weight 0`, async () => {
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/docCa"].stateValues.value).eq(0);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
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
            componentName: mathInputXName,
            core,
        });
        await core.requestAction({
            componentName: "/x",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/x"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1 / 3);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
        ).eqls([1, 0, 0, 0, 0]);

        await updateMathInputValue({
            latex: "a",
            componentName: mathInputAName,
            core,
        });
        await core.requestAction({
            componentName: "/a",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/a"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1 / 3);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
        ).eqls([1, 1, 0, 0, 0]);

        await updateMathInputValue({
            latex: "y",
            componentName: mathInputYName,
            core,
        });
        await core.requestAction({
            componentName: "/y",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/y"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(2 / 3);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
        ).eqls([1, 1, 1, 0, 0]);

        await updateMathInputValue({
            latex: "b",
            componentName: mathInputBName,
            core,
        });
        await core.requestAction({
            componentName: "/b",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/b"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(2 / 3);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
        ).eqls([1, 1, 1, 1, 0]);

        await updateMathInputValue({
            latex: "z",
            componentName: mathInputZName,
            core,
        });
        await core.requestAction({
            componentName: "/z",
            actionName: "submitAnswer",
            args: {},
            event: null,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/z"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/docCa"].stateValues.value).eq(1);
        expect(
            stateVariables["/_document1"].stateValues.itemCreditAchieved,
        ).eqls([1, 1, 1, 1, 1]);
    });

    it("explicit document tag, ignore outer blank strings", async () => {
        let core = await createTestCore({
            doenetML: `

  <document>a</document>



  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        expect(Object.keys(stateVariables).length).eq(1);

        expect(stateVariables["/_document1"].activeChildren).eqls(["a"]);
    });
});
