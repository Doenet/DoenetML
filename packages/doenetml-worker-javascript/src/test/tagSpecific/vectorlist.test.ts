import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";
import { updateBooleanInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("VectorList tag tests", async () => {
    async function test_vectorList({
        core,
        name,
        pName,
        text,
        maths,
        resolvePathToNodeIdx,
    }: {
        core: PublicDoenetMLCore;
        name?: string;
        pName?: string;
        text?: string;
        maths?: any[];
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);

        if (text !== undefined && pName !== undefined) {
            const cIdx = await resolvePathToNodeIdx(pName);
            expect(stateVariables[cIdx].stateValues.text).eq(text);
        }

        if (maths !== undefined && name !== undefined) {
            const cIdx = await resolvePathToNodeIdx(name);
            expect(
                stateVariables[cIdx].stateValues.vectors.map((x) =>
                    x.map((y) => y.tree),
                ),
            ).eqls(maths);
        }
    }

    it("vectorList and rounding, from strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><vectorList name="ml1" displayDigits="4">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>
    <p name="p2"><vectorList name="ml2" displayDigits="4" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>
    <p name="p3"><vectorList name="ml3" displayDecimals="3">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>
    <p name="p4"><vectorList name="ml4" displayDecimals="3" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>
    <p name="p5"><vectorList name="ml5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>
    <p name="p6"><vectorList name="ml6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</vectorList></p>

    <section name="sec1">
    <p name="p1a"><vectorList name="ml1a" extend="$ml1" /></p>
    <p name="p2a"><vectorList name="ml2a" extend="$ml2" /></p>
    <p name="p3a"><vectorList name="ml3a" extend="$ml3" /></p>
    <p name="p4a"><vectorList name="ml4a" extend="$ml4" /></p>
    <p name="p5a"><vectorList name="ml5a" extend="$ml5" /></p>
    <p name="p6a"><vectorList name="ml6a" extend="$ml6" /></p>

    <p name="p1b"><vectorList name="ml1b" copy="$ml1" /></p>
    <p name="p2b"><vectorList name="ml2b" copy="$ml2" /></p>
    <p name="p3b"><vectorList name="ml3b" copy="$ml3" /></p>
    <p name="p4b"><vectorList name="ml4b" copy="$ml4" /></p>
    <p name="p5b"><vectorList name="ml5b" copy="$ml5" /></p>
    <p name="p6b"><vectorList name="ml6b" copy="$ml6" /></p>
    </section>

    <section name="sec2" extend="$sec1" />
    <section name="sec3" copy="$sec1" />

    `,
        });

        let vals = [
            [2345.1535268, 3.52343],
            [0.5, 0.00000000000052523],
            [0.000000000000000000006, 0],
        ];
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
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml1${post}`,
                    maths: vals,
                    pName: `${pre}p1${post}`,
                    text: text1,
                });
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml2${post}`,
                    maths: vals,
                    pName: `${pre}p2${post}`,
                    text: text2,
                });
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml3${post}`,
                    maths: vals,
                    pName: `${pre}p3${post}`,
                    text: text3,
                });
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml4${post}`,
                    maths: vals,
                    pName: `${pre}p4${post}`,
                    text: text4,
                });
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml5${post}`,
                    maths: vals,
                    pName: `${pre}p5${post}`,
                    text: text5,
                });
                await test_vectorList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml6${post}`,
                    maths: vals,
                    pName: `${pre}p6${post}`,
                    text: text6,
                });
            }
        }
    });

    it("compare unordered vector lists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        
            <booleanInput name="unordered">true</booleanInput>
        
            <boolean name="b1">
                <vectorList name="nl1" unordered="$unordered">(1,-4) (-8,3) (0,0)</vectorList>
                =
                <vectorList name="nl2">(0,0) (1,-4) (-8, 3)</vectorList>
            </boolean>
            <boolean name="b2">$nl1 = $nl2</boolean>
            <boolean name="b3"><vectorList extend="$nl1" name="nl1a" /> = <vectorList extend="$nl2" /></boolean>
            <boolean name="b4"><vectorList copy="$nl1" name="nl1b" /> = <vectorList copy="$nl2" /></boolean>
        
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
