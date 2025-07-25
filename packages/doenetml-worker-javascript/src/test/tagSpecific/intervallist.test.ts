import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("IntervalList tag tests", async () => {
    async function test_intervalList({
        core,
        pName,
        text,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        pName?: string;
        text?: string;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        if (text !== undefined && pName !== undefined) {
            const cIdx = await resolvePathToNodeIdx(pName);
            expect(stateVariables[cIdx].stateValues.text).eq(text);
        }
    }

    it("intervalList and rounding, from strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><intervalList name="ml1" displayDigits="4">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>
    <p name="p2"><intervalList name="ml2" displayDigits="4" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>
    <p name="p3"><intervalList name="ml3" displayDecimals="3">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>
    <p name="p4"><intervalList name="ml4" displayDecimals="3" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>
    <p name="p5"><intervalList name="ml5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>
    <p name="p6"><intervalList name="ml6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</intervalList></p>

    <section name="sec1">
    <p name="p1a"><intervalList name="ml1a" extend="$ml1" /></p>
    <p name="p2a"><intervalList name="ml2a" extend="$ml2" /></p>
    <p name="p3a"><intervalList name="ml3a" extend="$ml3" /></p>
    <p name="p4a"><intervalList name="ml4a" extend="$ml4" /></p>
    <p name="p5a"><intervalList name="ml5a" extend="$ml5" /></p>
    <p name="p6a"><intervalList name="ml6a" extend="$ml6" /></p>

    <p name="p1b"><intervalList name="ml1b" copy="$ml1" /></p>
    <p name="p2b"><intervalList name="ml2b" copy="$ml2" /></p>
    <p name="p3b"><intervalList name="ml3b" copy="$ml3" /></p>
    <p name="p4b"><intervalList name="ml4b" copy="$ml4" /></p>
    <p name="p5b"><intervalList name="ml5b" copy="$ml5" /></p>
    <p name="p6b"><intervalList name="ml6b" copy="$ml6" /></p>
    </section>

    <section name="sec2" extend="$sec1" />
    <section name="sec3" copy="$sec1" />

    `,
        });

        let text1 = "( 2345, 3.523 ), ( 0.5, 5.252 * 10⁻¹³ ), ( 0, 0 )";
        let text2 =
            "( 2345, 3.523 ), ( 0.5000, 5.252 * 10⁻¹³ ), ( 0.000, 0.000 )";
        let text3 = "( 2345.154, 3.523 ), ( 0.5, 0 ), ( 0, 0 )";
        let text4 = "( 2345.154, 3.523 ), ( 0.500, 0.000 ), ( 0.000, 0.000 )";
        let text5 =
            "( 2345.1535, 3.5234 ), ( 0.5, 5.25 * 10⁻¹³ ), ( 6 * 10⁻²¹, 0 )";
        let text6 =
            "( 2345.1535, 3.5234 ), ( 0.5000, 5.25 * 10⁻¹³ ), ( 6.00 * 10⁻²¹, 0.0000 )";

        for (const post of ["", "a", "b"]) {
            const preOptions = post === "" ? [""] : ["", "sec2.", "sec3."];
            for (const pre of preOptions) {
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p1${post}`,
                    text: text1,
                });
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p2${post}`,
                    text: text2,
                });
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p3${post}`,
                    text: text3,
                });
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p4${post}`,
                    text: text4,
                });
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p5${post}`,
                    text: text5,
                });
                await test_intervalList({
                    resolvePathToNodeIdx,
                    core,
                    pName: `${pre}p6${post}`,
                    text: text6,
                });
            }
        }
    });

    it("compare unordered interval lists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        
            <booleanInput name="unordered">true</booleanInput>
        
            <boolean name="b1">
                <intervalList name="nl1" unordered="$unordered">(1,-4) (-8,3) (0,0)</intervalList>
                =
                <intervalList name="nl2">(0,0) (1,-4) (-8, 3)</intervalList>
            </boolean>
            <boolean name="b2">$nl1 = $nl2</boolean>
            <boolean name="b3"><intervalList extend="$nl1" name="nl1a" /> = <intervalList extend="$nl2" /></boolean>
            <boolean name="b4"><intervalList copy="$nl1" name="nl1b" /> = <intervalList copy="$nl2" /></boolean>
        
            <p name="pUnordered">$nl1.unordered, $nl1a.unordered, $nl1b.unordered</p>
        
            `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("true, true, true");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("unordered"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        // all but copied list become ordered
        expect(
            stateVariables[await resolvePathToNodeIdx("b1")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b3")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("b4")].stateValues.value,
        ).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pUnordered")].stateValues
                .text,
        ).eq("false, false, true");
    });
});
