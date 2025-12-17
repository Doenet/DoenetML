import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Pretzel tag tests", async () => {
    it("basic pretzel, with answer or givenAnswer", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
            <statement name="s1"><p>What is 1+1?</p></statement>
            <answer name="a1"><p>2</p></answer>
        </problem>
        <problem>
            <statement name="s2"><p>What is 1+2?</p></statement>
            <givenAnswer name="a2"><p>3</p></givenAnswer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
            <answer name="a3"><p>4</p></answer>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4"><p>5</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s1")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+1?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a1")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s2")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+2?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a2")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("3");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s3")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+3?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a3")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("4");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+4?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("5");

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                await updateTextInputValue({
                    text: `${offset + i}`,
                    componentIdx: input.componentIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: pretzel.componentIdx,
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                // when i==4, then all answer correspond, so it should be correct
                expect(
                    stateVariables[pretzel.componentIdx].stateValues
                        .creditAchieved,
                ).eq(i === 4 ? 1 : 0);
            }
        }
    });

    it("pretzel with missing statements and answers", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <pretzel name="p">
        <problem>
        </problem>
        <problem>
            <answer name="a2"><p>3</p></answer>
        </problem>
        <problem>
            <statement name="s3"><p>What is 1+3?</p></statement>
        </problem>
        <problem>
            <statement name="s4"><p>What is 1+4?</p></statement>
            <answer name="a4"><p>5</p></answer>
        </problem>
    </pretzel>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid pretzel as a problem is missing a <statement> or an <answer>",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(15);
        expect(errorWarnings.warnings[0].position.end.column).eq(15);

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a2")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("3");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s3")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+3?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("s4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("What is 1+4?");
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("a4")]
                    .activeChildren[0].componentIdx
            ].stateValues.text,
        ).eq("5");

        const pretzel = stateVariables[await resolvePathToNodeIdx("p")];
        const problemOrder = pretzel.stateValues.problemOrder;

        // make sure pretzel is still correct even if add an offset to the numbers
        for (const offset of [0, 1, 11]) {
            for (let i = 1; i <= 4; i++) {
                const idx = problemOrder.indexOf(i);
                const input = pretzel.activeChildren[idx * 3 + 1];

                await updateTextInputValue({
                    text: `${offset + i}`,
                    componentIdx: input.componentIdx,
                    core,
                });

                await submitAnswer({
                    componentIdx: pretzel.componentIdx,
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                // when i==4, then all answer correspond, so it should be correct
                expect(
                    stateVariables[pretzel.componentIdx].stateValues
                        .creditAchieved,
                ).eq(i === 4 ? 1 : 0);
            }
        }
    });
});
