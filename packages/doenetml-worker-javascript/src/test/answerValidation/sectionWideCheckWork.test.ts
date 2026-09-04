import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("section-wide check work attribute tests @group2", async () => {
    // Note: see sectioning.test.ts and problem.test.ts for additional section-wide check work tests

    async function test_section_wide_check_work(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        section2Name = "p2",
    ) {
        let stateVariables = await core.returnAllStateVariables(false, true);

        const inputs = [];

        for (let i = 0; i < 4; i++) {
            inputs.push(
                stateVariables[await resolvePathToNodeIdx(`a${i + 1}`)]
                    .stateValues.inputChildren[0].componentIdx,
            );
            await updateMathInputValue({
                latex: `${i + 1}`,
                componentIdx: inputs[i],
                core,
            });
        }

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .creditAchieved,
        ).eq(1 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .creditAchieved,
        ).eq(0);

        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx(section2Name),
            actionName: "submitAllAnswers",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(section2Name)].stateValues
                .numSubmissions,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .creditAchieved,
        ).eq(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a3")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a4")].stateValues
                .creditAchieved,
        ).eq(1);
    }

    it("paragraph with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <p name="p1">1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></p>
    <p name="p2" sectionWideCheckWork>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></p>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "p2");
    });

    it("li with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <ol>
        <li name="li1">1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></li>
        <li name="li2" sectionWideCheckWork>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></li>
    </ol>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "li2");
    });

    it("ol with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <ol name="ol1">
        <li>1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></li>
    </ol>
    <ol name="ol2" sectionWideCheckWork>
        <li>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></li>
    </ol>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "ol2");
    });

    it("ul with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <ul name="ul1">
        <li>1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></li>
    </ul>
    <ul name="ul2" sectionWideCheckWork>
        <li>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></li>
    </ul>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "ul2");
    });

    it("span with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <span name="span1">1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></span>
    <span name="span2" sectionWideCheckWork>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></span>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "span2");
    });

    it("div with section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <div name="div1">1: <answer name="a1">1</answer>, 2: <answer name="a2">2</answer></div>
    <div name="div2" sectionWideCheckWork>3: <answer name="a3">3</answer>, 4: <answer name="a4">4</answer></div>
  </document>
  `,
        });

        await test_section_wide_check_work(core, resolvePathToNodeIdx, "div2");
    });

    it("section-wide maxNumAttempts decrements and disables answers when exhausted", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="sec" sectionWideCheckWork maxNumAttempts="2">
      <answer name="a1">1</answer>
      <answer name="a2">2</answer>
    </section>
  </document>
  `,
        });

        // Fill in (or change) both answers' responses. Changing a response is
        // what re-enables a section-wide submission in the UI, so each realistic
        // submission below is preceded by a response change.
        async function fillInAnswers(latex1: string, latex2: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const inputs = [
                [await resolvePathToNodeIdx("a1"), latex1],
                [await resolvePathToNodeIdx("a2"), latex2],
            ] as const;
            for (const [answerIdx, latex] of inputs) {
                const inputIdx =
                    stateVariables[answerIdx].stateValues.inputChildren[0]
                        .componentIdx;
                await updateMathInputValue({
                    latex,
                    componentIdx: inputIdx,
                    core,
                });
            }
        }

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues
                .numAttemptsLeft,
        ).eq(2);
        // The answers report the section's remaining attempts.
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .numAttemptsLeft,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .disabled,
        ).eq(false);

        // First section-wide submission
        await fillInAnswers("1", "2");
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("sec"),
            actionName: "submitAllAnswers",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues
                .numAttemptsLeft,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .numAttemptsLeft,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .disabled,
        ).eq(false);

        // Change the responses, then submit again, exhausting attempts.
        // (Changing a response is required to re-enable the submit button.)
        await fillInAnswers("3", "4");
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("sec"),
            actionName: "submitAllAnswers",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues
                .numAttemptsLeft,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .numAttemptsLeft,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .disabled,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues
                .disabled,
        ).eq(true);

        // Directly invoke the action again to confirm the worker-level guard
        // never decrements past zero. This cannot happen through the UI — once
        // attempts are exhausted the section-wide button (and the answers) are
        // disabled — so no response change is performed here.
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("sec"),
            actionName: "submitAllAnswers",
            args: {},
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues
                .numAttemptsLeft,
        ).eq(0);
    });

    it("answer maxNumAttempts is ignored inside section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="sec" sectionWideCheckWork>
      <answer name="a1" maxNumAttempts="1">x</answer>
    </section>
  </document>
  `,
        });

        async function fillInAnswer(latex: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const inputIdx =
                stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                    .inputChildren[0].componentIdx;
            await updateMathInputValue({ latex, componentIdx: inputIdx, core });
        }

        // The answer's own maxNumAttempts is ignored: its remaining attempts are
        // unlimited even though maxNumAttempts="1".
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(Infinity);

        // Submit via the section more times than the answer's maxNumAttempts.
        await fillInAnswer("y");
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("sec"),
            actionName: "submitAllAnswers",
            args: {},
        });
        await fillInAnswer("z");
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("sec"),
            actionName: "submitAllAnswers",
            args: {},
        });

        // The answer is still not disabled by its own (ignored) maxNumAttempts.
        stateVariables = await core.returnAllStateVariables(false, true);
        // Both submissions actually went through (numSubmissions would be stuck
        // at 1 if the answer's maxNumAttempts="1" had disabled it after the
        // first submission).
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numSubmissions,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(Infinity);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .disabled,
        ).eq(false);
    });

    it("numAttemptsLeft propagates from the outer section through nested section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="outer" sectionWideCheckWork maxNumAttempts="2">
      <section name="inner" sectionWideCheckWork maxNumAttempts="5">
        <answer name="a1">x</answer>
      </section>
    </section>
  </document>
  `,
        });

        async function fillInAnswer(latex: string) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const inputIdx =
                stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                    .inputChildren[0].componentIdx;
            await updateMathInputValue({ latex, componentIdx: inputIdx, core });
        }

        // The inner section's and answer's remaining attempts all reflect the
        // outer (controlling) section, ignoring the inner maxNumAttempts="5".
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("outer")].stateValues
                .numAttemptsLeft,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("inner")].stateValues
                .numAttemptsLeft,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(2);

        // One submission via the outer section decrements all three.
        await fillInAnswer("y");
        await core.requestAction({
            componentIdx: await resolvePathToNodeIdx("outer"),
            actionName: "submitAllAnswers",
            args: {},
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("outer")].stateValues
                .numAttemptsLeft,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("inner")].stateValues
                .numAttemptsLeft,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("a1")].stateValues
                .numAttemptsLeft,
        ).eq(1);
    });

    it("warning when an answer sets maxNumAttempts inside section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="sec" sectionWideCheckWork>
      <section>
        <answer name="a1" maxNumAttempts="3">1</answer>
      </section>
    </section>
  </document>
  `,
        });

        // Force evaluation of the answer's numAttemptsLeft (which emits the warning)
        await core.returnAllStateVariables(false, true);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        const warning = diagnosticsByType.warnings.find((w: any) =>
            w.message.includes(
                "Setting `maxNumAttempts` on an `<answer>` inside a container with `sectionWideCheckWork`",
            ),
        );
        expect(warning).toBeDefined();
        // The warning targets just the `maxNumAttempts` attribute, not the
        // whole `<answer>`.
        expect(warning.position.end.offset - warning.position.start.offset).eq(
            'maxNumAttempts="3"'.length,
        );
    });

    it("warning when a nested section-wide check work sets maxNumAttempts inside another section-wide check work", async () => {
        let { core } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="outer" sectionWideCheckWork>
      <section name="inner" sectionWideCheckWork maxNumAttempts="3">
        <answer name="a1">1</answer>
      </section>
    </section>
  </document>
  `,
        });

        // Force evaluation of the inner section's numAttemptsLeft (which emits
        // the warning)
        await core.returnAllStateVariables(false, true);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        const warning = diagnosticsByType.warnings.find((w: any) =>
            w.message.includes(
                "Setting `maxNumAttempts` on a container with `sectionWideCheckWork` that is inside another container with `sectionWideCheckWork`",
            ),
        );
        expect(warning).toBeDefined();
        // The warning targets just the `maxNumAttempts` attribute, not the
        // whole (multi-line) `<section>`.
        expect(warning.position.start.line).eq(warning.position.end.line);
        expect(warning.position.end.offset - warning.position.start.offset).eq(
            'maxNumAttempts="3"'.length,
        );
    });

    it("no nested section-wide check work warning for a top-level section-wide check work with maxNumAttempts", async () => {
        let { core } = await createTestCore({
            doenetML: `
  <document name="d">
    <section name="sec" sectionWideCheckWork maxNumAttempts="3">
      <answer name="a1">1</answer>
    </section>
  </document>
  `,
        });

        await core.returnAllStateVariables(false, true);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.warnings.some((w: any) =>
                w.message.includes(
                    "that is inside another container with `sectionWideCheckWork`",
                ),
            ),
        ).eq(false);
    });

    it("documentWideCheckWork is deprecated but still enables section-wide check work", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d" documentWideCheckWork>
    <answer name="a1">1</answer>
    <answer name="a2">2</answer>
  </document>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .sectionWideCheckWork,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .createSubmitAllButton,
        ).eq(true);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(
            diagnosticsByType.warnings.some((w: any) =>
                w.message.includes(
                    "Attribute `documentWideCheckWork` on `<document>` is deprecated",
                ),
            ),
        ).eq(true);
    });

    // A container that is worth no points is credited in full — that is how a
    // reader gets credit for a document holding no answers, and how a
    // `<cascade>` step with nothing to answer stops blocking the next one. When
    // the container does hold answers and they all carry `weight="0"`, the
    // scoring rule still says "worth nothing, so nothing lost", but the button
    // is being asked something else: are these answers right? That question is
    // answered by `creditAchievedForCheckWork`, which is `null` — meaning "the
    // score is the answer here too" — everywhere else.

    /**
     * Type `responses` into the math inputs of the answers named `a1`, `a2`, …
     * in order, then submit those answers. Returns the componentIdx of each
     * input, so a test can also check the color the section gives it.
     */
    async function submit_answers(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        responses: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        const inputIndices: number[] = [];
        for (const [ind, latex] of responses.entries()) {
            const componentIdx =
                stateVariables[await resolvePathToNodeIdx(`a${ind + 1}`)]
                    .stateValues.inputChildren[0].componentIdx;
            inputIndices.push(componentIdx);
            await updateMathInputValue({ latex, componentIdx, core });
        }
        for (let ind = 0; ind < responses.length; ind++) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`a${ind + 1}`),
                core,
            });
        }

        return inputIndices;
    }

    it("check work reports the answers when every weight is zero", async () => {
        const doenetML = `
  <p name="p" sectionWideCheckWork>
    1: <answer name="a1" weight="0">1</answer>,
    2: <answer name="a2" weight="0">2</answer>
  </p>
  `;

        for (const [responses, creditForCheckWork] of [
            [["3", "4"], 0],
            [["1", "4"], 0.5],
            [["1", "2"], 1],
        ] as [string[], number][]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const inputIndices = await submit_answers(
                core,
                resolvePathToNodeIdx,
                responses,
            );

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const p = stateVariables[await resolvePathToNodeIdx("p")];

            expect(p.stateValues.creditAchievedForCheckWork).eq(
                creditForCheckWork,
            );
            // The score is untouched: nothing in the paragraph carries weight,
            // so there is still nothing to lose.
            expect(p.stateValues.creditAchieved).eq(1);
            // The inputs are colored by what the button says, not by the score,
            // so a red button never sits beside green borders.
            for (const inputIdx of inputIndices) {
                expect(stateVariables[inputIdx].stateValues.creditAchieved).eq(
                    creditForCheckWork,
                );
            }
        }
    });

    it("a zero-weight answer beside a weighted one still counts for nothing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="p" sectionWideCheckWork>
    1: <answer name="a1">1</answer>,
    2: <answer name="a2" weight="0">2</answer>
  </p>
  `,
        });

        await submit_answers(core, resolvePathToNodeIdx, ["1", "999"]);

        const stateVariables = await core.returnAllStateVariables(false, true);
        const p = stateVariables[await resolvePathToNodeIdx("p")];

        // One answer carries weight, so the ordinary weighted rule applies and
        // the wrong zero-weight answer contributes nothing to either value.
        expect(p.stateValues.creditAchieved).eq(1);
        expect(p.stateValues.creditAchievedForCheckWork).eq(null);
    });

    it("check work credit is null when the score already answers the question", async () => {
        // `null` is not an absence of information, it is the whole point: the
        // core builds no aggregating dependencies in these cases, so submitting
        // an answer has no second credit chain to walk. A change that starts
        // returning a number here has quietly added that cost back.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pWeighted" sectionWideCheckWork>
    1: <answer name="a1">1</answer>,
    2: <answer name="a2">2</answer>
  </p>
  <p name="pEmpty" sectionWideCheckWork>no answers here</p>
  <section name="secOrdinary" aggregateScores>
    <answer name="a3" weight="0">3</answer>
  </section>
  `,
        });

        await submit_answers(core, resolvePathToNodeIdx, ["1", "999"]);

        const stateVariables = await core.returnAllStateVariables(false, true);

        // Normal weights: the weighted mean is the score.
        expect(
            stateVariables[await resolvePathToNodeIdx("pWeighted")].stateValues
                .creditAchievedForCheckWork,
        ).eq(null);
        // Nothing to check, so the "credit for opening it" rule stands and the
        // button reports the score, as it always has.
        expect(
            stateVariables[await resolvePathToNodeIdx("pEmpty")].stateValues
                .creditAchievedForCheckWork,
        ).eq(null);
        expect(
            stateVariables[await resolvePathToNodeIdx("pEmpty")].stateValues
                .creditAchieved,
        ).eq(1);
        // No section-wide check work at all, even with a zero-weight answer:
        // there is no button to report to.
        expect(
            stateVariables[await resolvePathToNodeIdx("secOrdinary")]
                .stateValues.creditAchievedForCheckWork,
        ).eq(null);
    });

    it("a zero-weight section passes its check work credit up", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <document name="d" sectionWideCheckWork>
    <problem name="prob">
      1: <answer name="a1" weight="0">1</answer>,
      2: <answer name="a2" weight="0">2</answer>
    </problem>
  </document>
  `,
        });

        await submit_answers(core, resolvePathToNodeIdx, ["1", "999"]);

        const stateVariables = await core.returnAllStateVariables(false, true);

        // The problem carries the default weight 1, so the document's weighted
        // mean is the problem's credit — which, by the scoring rule, is a full
        // 1. The button has to look past that to the answers themselves.
        expect(
            stateVariables[await resolvePathToNodeIdx("prob")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("prob")].stateValues
                .creditAchievedForCheckWork,
        ).eq(0.5);
        expect(
            stateVariables[await resolvePathToNodeIdx("d")].stateValues
                .creditAchievedForCheckWork,
        ).eq(0.5);
    });
});
