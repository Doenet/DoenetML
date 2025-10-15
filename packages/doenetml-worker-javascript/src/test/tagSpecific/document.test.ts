import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Document tag tests", async () => {
    it("get 1 for document credit with nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it("document credit when have problem with nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p><answer disableAfterCorrect="false" name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0.5);

        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it("get document credit even when have composites as a siblings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <setup>
    <math name="m1">x</math>
  </setup>
  <group>
    <math name="m2">$m1</math>
  </group>
  <p><answer disableAfterCorrect="false" name="ans"><award>$m2</award></answer></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0);

        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it(`component credit achieved, don't skip weight 0`, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p>x: <answer disableAfterCorrect="false" name="x">x</answer></p>
  <p>a: <answer disableAfterCorrect="false" name="a" weight="0">a</answer></p>
  <problem>
    <p>y: <answer disableAfterCorrect="false" name="y">y</answer></p>
  </problem>
  <problem weight="0">
    <p>b: <answer disableAfterCorrect="false" name="b">b</answer></p>
  </problem>
  <problem>
    <p>z: <answer disableAfterCorrect="false" name="z">z</answer></p>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([0, 0, 0, 0, 0]);

        let mathInputXIdx =
            stateVariables[await resolvePathToNodeIdx("x")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputYIdx =
            stateVariables[await resolvePathToNodeIdx("y")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputZIdx =
            stateVariables[await resolvePathToNodeIdx("z")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputAIdx =
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputBIdx =
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputXIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 0, 0, 0, 0]);

        await updateMathInputValue({
            latex: "a",
            componentIdx: mathInputAIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 0, 0, 0]);

        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputYIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("y"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 0, 0]);

        await updateMathInputValue({
            latex: "b",
            componentIdx: mathInputBIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 0]);

        await updateMathInputValue({
            latex: "z",
            componentIdx: mathInputZIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("z"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("z")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 1]);
    });

    it("explicit document tag, ignore outer blank strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

  <document>a</document>



  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(Object.keys(stateVariables).length).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .activeChildren,
        ).eqls(["a"]);
    });
});
