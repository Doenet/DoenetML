import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Split tag tests", async () => {
    async function test_sort({
        core,
        resolvePathToNodeIdx,
        sorted_result,
        pName = "pList",
        replacements_all_of_type,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        sorted_result: string[];
        pName?: string;
        replacements_all_of_type?: string;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        const pText = sorted_result.join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx(pName)].stateValues.text,
        ).eq(pText);

        if (replacements_all_of_type) {
            let replacementTypes = stateVariables[
                await resolvePathToNodeIdx(pName)
            ].activeChildren.map(
                (child) => stateVariables[child.componentIdx].componentType,
            );

            expect(replacementTypes).eqls(
                Array(sorted_result.length).fill(replacements_all_of_type),
            );
        }
    }

    it("split strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <split name="default">abc,def ghi</split>
        <split name="letter" splitBy="letter">abc,def ghi</split>
        <split name="word" splitBy="word">abc,def ghi</split>
        <split name="comma" splitBy="comma">abc,def ghi</split>
  `,
        });

        const letters = ["a", "b", "c", ",", "d", "e", "f", " ", "g", "h", "i"];
        const words = ["abc,def", "ghi"];
        const commas = ["abc", "def ghi"];

        const stateVariables = await core.returnAllStateVariables(false, true);

        for (const [i, s] of letters.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`default[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
            expect(
                stateVariables[await resolvePathToNodeIdx(`letter[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
        }
        for (const [i, s] of words.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`word[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
        }
        for (const [i, s] of commas.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`comma[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
        }
    });

    it("split dynamic string", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            
            <textInput name="ti">hello</textInput>

            <split name="s">$ti</split>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let letters = ["h", "e", "l", "l", "o"];

        for (const [i, s] of letters.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
        }

        await updateTextInputValue({
            text: "bye",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        letters = ["b", "y", "e"];

        for (const [i, s] of letters.entries()) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s[${i + 1}]`)]
                    .stateValues.value,
            ).eq(s);
        }
    });
});
