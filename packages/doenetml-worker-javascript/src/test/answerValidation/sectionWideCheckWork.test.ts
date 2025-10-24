import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("section-wide check work attribute tests", async () => {
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
});
