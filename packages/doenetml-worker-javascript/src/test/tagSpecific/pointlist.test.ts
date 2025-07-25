import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("PointList tag tests", async () => {
    async function test_pointList({
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
                stateVariables[cIdx].stateValues.points.map((x) =>
                    x.map((y) => y.tree),
                ),
            ).eqls(maths);
        }
    }

    it("pointList and rounding, from strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><pointList name="ml1" displayDigits="4">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>
    <p name="p2"><pointList name="ml2" displayDigits="4" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>
    <p name="p3"><pointList name="ml3" displayDecimals="3">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>
    <p name="p4"><pointList name="ml4" displayDecimals="3" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>
    <p name="p5"><pointList name="ml5" displayDecimals="4" displayDigits="3" displaySmallAsZero="false">(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>
    <p name="p6"><pointList name="ml6" displayDecimals="4" displayDigits="3" displaySmallAsZero="false" padZeros>(2345.1535268, 3.52343) (0.5, 0.00000000000052523) (0.000000000000000000006, 0)</pointList></p>

    <section name="sec1">
    <p name="p1a"><pointList name="ml1a" extend="$ml1" /></p>
    <p name="p2a"><pointList name="ml2a" extend="$ml2" /></p>
    <p name="p3a"><pointList name="ml3a" extend="$ml3" /></p>
    <p name="p4a"><pointList name="ml4a" extend="$ml4" /></p>
    <p name="p5a"><pointList name="ml5a" extend="$ml5" /></p>
    <p name="p6a"><pointList name="ml6a" extend="$ml6" /></p>

    <p name="p1b"><pointList name="ml1b" copy="$ml1" /></p>
    <p name="p2b"><pointList name="ml2b" copy="$ml2" /></p>
    <p name="p3b"><pointList name="ml3b" copy="$ml3" /></p>
    <p name="p4b"><pointList name="ml4b" copy="$ml4" /></p>
    <p name="p5b"><pointList name="ml5b" copy="$ml5" /></p>
    <p name="p6b"><pointList name="ml6b" copy="$ml6" /></p>
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
                await test_pointList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml1${post}`,
                    maths: vals,
                    pName: `${pre}p1${post}`,
                    text: text1,
                });
                await test_pointList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml2${post}`,
                    maths: vals,
                    pName: `${pre}p2${post}`,
                    text: text2,
                });
                await test_pointList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml3${post}`,
                    maths: vals,
                    pName: `${pre}p3${post}`,
                    text: text3,
                });
                await test_pointList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml4${post}`,
                    maths: vals,
                    pName: `${pre}p4${post}`,
                    text: text4,
                });
                await test_pointList({
                    resolvePathToNodeIdx,
                    core,
                    name: `${pre}ml5${post}`,
                    maths: vals,
                    pName: `${pre}p5${post}`,
                    text: text5,
                });
                await test_pointList({
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
});
