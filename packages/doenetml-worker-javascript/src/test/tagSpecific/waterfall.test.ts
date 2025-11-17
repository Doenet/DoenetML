import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Waterfall tag tests", async () => {
    it("basic waterfall", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<waterfall name="w">
  <title>My waterfall</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</waterfall>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        async function check_values(numCompleted: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .title,
            ).eq("My waterfall");
            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .numCompleted,
            ).eq(numCompleted);
            expect(
                stateVariables[await resolvePathToNodeIdx("pNumCompleted")]
                    .stateValues.text,
            ).eq(`numCompleted: ${numCompleted}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hideChildren,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hideChildren,
            ).eq(numCompleted < 2);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.creditAchieved < 1
                    ? "var(--mainGray)"
                    : "var(--lightGreen)",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section3.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 2);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx =
            stateVariables[answer11Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx =
            stateVariables[answer12Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx =
            stateVariables[answer2Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx =
            stateVariables[answer3Idx].stateValues.inputChildren[0]
                .componentIdx;

        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput3Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer3Idx, core });
        await check_values(3);

        await updateMathInputValue({
            latex: "11",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(3);
    });

    it("hideFutureSections", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<waterfall name="w" hideFutureSections>
  <title>My waterfall</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</waterfall>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        async function check_values(numCompleted: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .title,
            ).eq("My waterfall");
            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .numCompleted,
            ).eq(numCompleted);
            expect(
                stateVariables[await resolvePathToNodeIdx("pNumCompleted")]
                    .stateValues.text,
            ).eq(`numCompleted: ${numCompleted}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hidden,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hidden,
            ).eq(numCompleted < 2);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 2);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx =
            stateVariables[answer11Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx =
            stateVariables[answer12Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx =
            stateVariables[answer2Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx =
            stateVariables[answer3Idx].stateValues.inputChildren[0]
                .componentIdx;

        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput3Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer3Idx, core });
        await check_values(3);

        await updateMathInputValue({
            latex: "11",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(3);
    });

    it("waterfall in waterfall", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<waterfall name="w1">
  <title>My waterfall</title>

  <section boxed name="section1">
    <title>First part</title>

    <waterfall name="w2">
      <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
      <div>
        <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
        <p name="p3">What is 2+2? <answer name="ans">4</answer></p>
      </div>
    </waterfall>
  </section>

  <section boxed name="section2">
    <title>Second part</title>
    
    <waterfall name="w3">
      <p name="p1">What is 3+4? <answer name="ans">7</answer></p>
      <p name="p2">What is 3-4? <answer name="ans">-1</answer></p>
    </waterfall>
  </section>

</waterfall>

  `,
        });

        async function check_values(
            numCompleted1: number,
            numCompleted2: number,
            numCompleted3: number,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("w1")].stateValues
                    .title,
            ).eq("My waterfall");
            expect(
                stateVariables[await resolvePathToNodeIdx("w1")].stateValues
                    .numCompleted,
            ).eq(numCompleted1);

            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .title,
            ).eq("");
            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .numCompleted,
            ).eq(numCompleted2);

            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .title,
            ).eq("");
            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .hidden,
            ).eq(numCompleted1 < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .numCompleted,
            ).eq(numCompleted3);

            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p2")]
                    .stateValues.hidden,
            ).eq(numCompleted2 < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p3")]
                    .stateValues.hidden,
            ).eq(numCompleted2 < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hideChildren,
            ).eq(numCompleted1 < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p1")]
                    .stateValues.hidden,
            ).eq(numCompleted1 < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p2")]
                    .stateValues.hidden,
            ).eq(numCompleted1 < 1 || numCompleted3 < 1);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx =
            stateVariables[answer11Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx =
            stateVariables[answer12Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer13Idx = await resolvePathToNodeIdx("section1.p3.ans");
        const mathInput13Idx =
            stateVariables[answer13Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer21Idx = await resolvePathToNodeIdx("section2.p1.ans");
        const mathInput21Idx =
            stateVariables[answer21Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer22Idx = await resolvePathToNodeIdx("section2.p2.ans");
        const mathInput22Idx =
            stateVariables[answer22Idx].stateValues.inputChildren[0]
                .componentIdx;

        await check_values(0, 0, 0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0, 1, 0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0, 1, 0);

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(1, 2, 0);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0, 0, 0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(1, 2, 0);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput21Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer21Idx, core });
        await check_values(1, 2, 1);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0, 1, 1);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(1, 2, 1);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput22Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer22Idx, core });
        await check_values(2, 2, 2);

        await updateMathInputValue({
            latex: "11",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(0, 1, 2);

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(2, 2, 2);
    });

    it("waterfall in waterfall, reveal all", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<waterfall name="w1" revealAll>
  <title>My waterfall</title>

  <section boxed name="section1">
    <title>First part</title>

    <waterfall name="w2">
      <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
      <div>
        <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
        <p name="p3">What is 2+2? <answer name="ans">4</answer></p>
      </div>
    </waterfall>
  </section>

  <section boxed name="section2">
    <title>Second part</title>
    
    <waterfall name="w3">
      <p name="p1">What is 3+4? <answer name="ans">7</answer></p>
      <p name="p2">What is 3-4? <answer name="ans">-1</answer></p>
    </waterfall>
  </section>

</waterfall>

  `,
        });

        async function check_values(
            numCompleted1: number,
            numCompleted2: number,
            numCompleted3: number,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("w1")].stateValues
                    .title,
            ).eq("My waterfall");
            expect(
                stateVariables[await resolvePathToNodeIdx("w1")].stateValues
                    .numCompleted,
            ).eq(numCompleted1);

            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .title,
            ).eq("");
            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("w2")].stateValues
                    .numCompleted,
            ).eq(numCompleted2);

            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .title,
            ).eq("");
            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("w3")].stateValues
                    .numCompleted,
            ).eq(numCompleted3);

            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p3")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p2")]
                    .stateValues.hidden,
            ).eq(false);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx =
            stateVariables[answer11Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx =
            stateVariables[answer12Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer13Idx = await resolvePathToNodeIdx("section1.p3.ans");
        const mathInput13Idx =
            stateVariables[answer13Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer21Idx = await resolvePathToNodeIdx("section2.p1.ans");
        const mathInput21Idx =
            stateVariables[answer21Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer22Idx = await resolvePathToNodeIdx("section2.p2.ans");
        const mathInput22Idx =
            stateVariables[answer22Idx].stateValues.inputChildren[0]
                .componentIdx;

        await check_values(0, 0, 0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0, 1, 0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0, 1, 0);

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(1, 2, 0);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0, 0, 0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(1, 2, 0);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput21Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer21Idx, core });
        await check_values(1, 2, 1);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0, 1, 1);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(1, 2, 1);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput22Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer22Idx, core });
        await check_values(2, 2, 2);

        await updateMathInputValue({
            latex: "11",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(0, 1, 2);

        await updateMathInputValue({
            latex: "4",
            componentIdx: mathInput13Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer13Idx, core });
        await check_values(2, 2, 2);
    });

    it("change waterfall colors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<waterfall name="w" inProgressColor="yellow" completedColor="blue">
  <title>My waterfall</title>

  <section boxed name="section1">
    <title>First part</title>

    <p name="p1">What is 1+1? <answer name="ans">2</answer></p>
    <p name="p2">What is 1-1? <answer name="ans">0</answer></p>
  </section>


  <section boxed name="section2">
    <title>Second part</title>

    <p name="p">What is 3+4? <answer name="ans">7</answer></p>
  </section>

  <section boxed name="section3">
    <title>Third part</title>

    <p name="p">What is 3-4? <answer name="ans">-1</answer></p>
  </section>

</waterfall>

<p name="pNumCompleted">numCompleted: $w.numCompleted</p>

  `,
        });

        async function check_values(numCompleted: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .title,
            ).eq("My waterfall");
            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .numCompleted,
            ).eq(numCompleted);
            expect(
                stateVariables[await resolvePathToNodeIdx("pNumCompleted")]
                    .stateValues.text,
            ).eq(`numCompleted: ${numCompleted}`);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.hideChildren,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section1")]
                    .stateValues.creditAchieved < 1
                    ? "yellow"
                    : "blue",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p1")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section1.p2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.hideChildren,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section2")]
                    .stateValues.creditAchieved < 1
                    ? "yellow"
                    : "blue",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section2.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hidden,
            ).eq(false);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.hideChildren,
            ).eq(numCompleted < 2);
            expect(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.titleColor,
            ).eq(
                stateVariables[await resolvePathToNodeIdx("section3")]
                    .stateValues.creditAchieved < 1
                    ? "yellow"
                    : "blue",
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("section3.p")]
                    .stateValues.hidden,
            ).eq(numCompleted < 2);
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        const answer11Idx = await resolvePathToNodeIdx("section1.p1.ans");
        const mathInput11Idx =
            stateVariables[answer11Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer12Idx = await resolvePathToNodeIdx("section1.p2.ans");
        const mathInput12Idx =
            stateVariables[answer12Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer2Idx = await resolvePathToNodeIdx("section2.p.ans");
        const mathInput2Idx =
            stateVariables[answer2Idx].stateValues.inputChildren[0]
                .componentIdx;
        const answer3Idx = await resolvePathToNodeIdx("section3.p.ans");
        const mathInput3Idx =
            stateVariables[answer3Idx].stateValues.inputChildren[0]
                .componentIdx;

        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "3",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "2",
            componentIdx: mathInput11Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer11Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(0);

        await updateMathInputValue({
            latex: "0",
            componentIdx: mathInput12Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer12Idx, core });
        await check_values(2);

        await updateMathInputValue({
            latex: "-1",
            componentIdx: mathInput3Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer3Idx, core });
        await check_values(3);

        await updateMathInputValue({
            latex: "11",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(1);

        await updateMathInputValue({
            latex: "7",
            componentIdx: mathInput2Idx,
            core,
        });
        await submitAnswer({ componentIdx: answer2Idx, core });
        await check_values(3);
    });
});
