import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function run_tests({
    doenetML,
    responseCredits,
}: {
    doenetML: string;
    responseCredits: {
        responses: Record<string, string>;
        credits: Record<string, number>;
    }[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

    for (let responseObj of responseCredits) {
        await submit_check(responseObj);
    }

    async function submit_check({
        responses,
        credits,
    }: {
        responses: Record<string, string>;
        credits: Record<string, number>;
    }) {
        for (let name in responses) {
            await updateMathInputValue({
                latex: `${responses[name]}`,
                componentIdx: await resolvePathToNodeIdx(name),
                core,
            });
        }
        for (let code in credits) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`ans${code}`),
                core,
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (let code in credits) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`ans${code}`)]
                    .stateValues.creditAchieved,
            ).eq(
                credits[code],
                `${code} credit for response ${JSON.stringify(responses)}`,
            );
        }
    }
}

describe("Symbolic equality tests", async () => {
    it("symbolic equality match with no simplification", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p><math name="m1">1+3</math>: 
        <answer name="ansS1">
            <award symbolicEquality="true"><when>$resp=$m1</when></award>
        </answer>
    </p>
    
    <p><math name="m2">3+1</math>: 
        <answer name="ansS2">
            <award symbolicEquality="true"><when>$resp=$m2</when></award>
        </answer>
    </p>

    <p>Numeric versions</p>
    <p><answer name="ansN1">
        <award><when>$resp=$m1</when></award>
    </answer></p>
    <p><answer name="ansN2">
        <award><when>$resp=$m2</when></award>
    </answer></p>
    `;
        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S1: 0, S2: 0, N1: 0, N2: 0 } },
                {
                    responses: { resp: "4" },
                    credits: { S1: 0, S2: 0, N1: 1, N2: 1 },
                },
                {
                    responses: { resp: "3+1" },
                    credits: { S1: 0, S2: 1, N1: 1, N2: 1 },
                },
                {
                    responses: { resp: "1+3" },
                    credits: { S1: 1, S2: 0, N1: 1, N2: 1 },
                },
                {
                    responses: { resp: "1+1+1+1" },
                    credits: { S1: 0, S2: 0, N1: 1, N2: 1 },
                },
            ],
        });
    });

    it("symbolic equality match with no simplification 2", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p><math name="m">1x-0y+-3s</math>: 
        <answer name="ansS">
            <award symbolicEquality="true"><when>$resp=$m</when></award>
        </answer>
    </p>
    
    <p>Numeric version</p>
    <p><answer name="ansN">
        <award><when>$resp=$m</when></award>
    </answer></p>
    `;
        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: { resp: "1x-0y+-3s" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x-0y-3s" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x-0y+(-3s)" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x+0y-3s" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x-3s" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "x-0y-3s" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "-0y+1x-3s" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    });

    it("symbolic equality match with no simplification, handle negatives", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p><math name="m1">z-<number>5</number>x-<number>3</number></math>: 
        <answer name="ansS1">
            <award symbolicEquality><when>$resp=$m1</when></award>
        </answer>
    </p>
    <p><math name="m2">z-<math>5</math>x-<math>3</math></math>: 
        <answer name="ansS2">
            <award symbolicEquality><when>$resp=$m2</when></award>
        </answer>
    </p>
    <p><math name="m3">z+<number>-5</number>x+<number>-3</number></math>: 
        <answer name="ansS3">
            <award symbolicEquality><when>$resp=$m3</when></award>
        </answer>
    </p>
    <p><math name="m4">z+<math>-5</math>x+<math>-3</math></math>: 
        <answer name="ansS4">
            <award symbolicEquality><when>$resp=$m4</when></award>
        </answer>
    </p>
    <p><math name="m5">z-<math>5x</math>-3</math>: 
        <answer name="ansS5">
            <award symbolicEquality><when>$resp=$m5</when></award>
        </answer>
    </p>
    <p><math name="m6">z+<math>-5x</math>-3</math>: 
        <answer name="ansS6">
            <award symbolicEquality><when>$resp=$m6</when></award>
        </answer>
    </p>

    <p>Numeric versions</p>
    <p><answer name="ansN1">
        <award><when>$resp=$m1</when></award>
    </answer></p>
    <p><answer name="ansN2">
        <award><when>$resp=$m2</when></award>
    </answer></p>
    <p><answer name="ansN3">
        <award><when>$resp=$m3</when></award>
    </answer></p>
    <p><answer name="ansN4">
        <award><when>$resp=$m4</when></award>
    </answer></p>
    <p><answer name="ansN5">
        <award><when>$resp=$m5</when></award>
    </answer></p>
    <p><answer name="ansN6">
        <award><when>$resp=$m6</when></award>
    </answer></p>
    `;
        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: {},
                    credits: {
                        S1: 0,
                        S2: 0,
                        S3: 0,
                        S4: 0,
                        S5: 0,
                        S6: 0,
                        N1: 0,
                        N2: 0,
                        N3: 0,
                        N4: 0,
                        N5: 0,
                        N6: 0,
                    },
                },
                {
                    responses: { resp: "z-5x-3" },
                    credits: {
                        S1: 1,
                        S2: 1,
                        S3: 1,
                        S4: 1,
                        S5: 1,
                        S6: 1,
                        N1: 1,
                        N2: 1,
                        N3: 1,
                        N4: 1,
                        N5: 1,
                        N6: 1,
                    },
                },
                {
                    responses: { resp: "z+-5x+-3" },
                    credits: {
                        S1: 1,
                        S2: 1,
                        S3: 1,
                        S4: 1,
                        S5: 1,
                        S6: 1,
                        N1: 1,
                        N2: 1,
                        N3: 1,
                        N4: 1,
                        N5: 1,
                        N6: 1,
                    },
                },
                {
                    responses: { resp: "z-(5x)+-(3)" },
                    credits: {
                        S1: 1,
                        S2: 1,
                        S3: 1,
                        S4: 1,
                        S5: 1,
                        S6: 1,
                        N1: 1,
                        N2: 1,
                        N3: 1,
                        N4: 1,
                        N5: 1,
                        N6: 1,
                    },
                },
                {
                    responses: { resp: "z-1(5x)-3" },
                    credits: {
                        S1: 0,
                        S2: 0,
                        S3: 0,
                        S4: 0,
                        S5: 0,
                        S6: 0,
                        N1: 1,
                        N2: 1,
                        N3: 1,
                        N4: 1,
                        N5: 1,
                        N6: 1,
                    },
                },
            ],
        });
    });

    async function test_simplify_numbers_preserve_order(doenetML: string) {
        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: { resp: "1x^2+2-0x^2+3+x^2+3x^2+7+4" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "x^2+5+x^2+3x^2+11" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x^2+2-0x^2+3+x^2+3x^2+4+7" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x^2+2-0x^2+3+3x^2+x^2+7+4" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "1x^2+2-0x^2+3+4x^2+7+4" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "1x^2-0x^2+x^2+3x^2+16" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "5x^2+16" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    }

    it("symbolic equality match with simplifying numbers, preserving order", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer name="ansS">
      <award symbolicEquality="true" simplifyOnCompare="numbersPreserveOrder"><when>$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await test_simplify_numbers_preserve_order(doenetML);
    });

    it("symbolic equality match with simplifying numbers, preserving order, attributes on answer", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer name="ansS" symbolicEquality="true" simplifyOnCompare="numbersPreserveOrder">
      <award><when>$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await test_simplify_numbers_preserve_order(doenetML);
    });

    it("symbolic equality match with simplifying numbers, preserving order, attributes on when", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer name="ansS">
      <award><when symbolicEquality="true" simplifyOnCompare="numbersPreserveOrder">$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await test_simplify_numbers_preserve_order(doenetML);
    });

    it("symbolic equality match with simplifying numbers", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">1x^2+2-0x^2+3+x^2+3x^2+7+4</math>: 
    <answer name="ansS">
      <award symbolicEquality simplifyOnCompare="numbers"><when>$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: { resp: "1x^2+2-0x^2+3+x^2+3x^2+7+4" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "x^2-0x^2+x^2+3x^2+16" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "7+1x^2-0x^2+3+3x^2+4+2+x^2" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "1x^2+2-0x^2+3+4x^2+7+4" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "5x^2+16" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    });

    it("symbolic equality match with full simplification", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">6x^2 -3x +8x-4 + (2x-3)(4-x)</math>: 
    <answer name="ansS">
      <award symbolicEquality simplifyOnCompare><when>$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: { resp: "6x^2 -3x +8x -4 + (2x-3)(4-x)" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "6x^2 +5x -4 + (2x-3)(4-x)" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "-4 + 6x^2 + (4-x)(-3+2x) + 5x" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "6x^2 +5x -4 -2x^2+11x-12" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "4x^2 +16x -16" },
                    credits: { S: 0, N: 1 },
                },
                {
                    responses: { resp: "(3x+4)(2x -1) + (2x-3)(4-x)" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    });

    it("symbolic equality match with expand and full simplification", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    <math name="m">(2x-3)(4-x) + sin(x)^2+cos(x)^2</math>: 
    <answer name="ansS">
      <award symbolicEquality simplifyOnCompare expandOnCompare><when>$resp=$m</when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p><answer name="ansN">
      <award><when>$resp=$m</when></award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: {
                        resp: "(2x-3)(4-x) + \\sin(x)^2+\\cos(x)^2",
                    },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: {
                        resp: "-2x^2+11x-12 + \\sin(x)^2+\\cos(x)^2",
                    },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "(2x-3)(4-x) + 1" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    });

    it("symbolic equality with simplification can match simplified negative", async () => {
        const doenetML = `
    <p>Response: <mathInput name="resp" /></p>

    <p>
    What is <math name="expr">-3-4</math>?
    <answer name="ansS">
      <award symbolicEquality><when>$resp=<math extend="$expr" simplify /></when></award>
    </answer>
    </p>
    
    <p>Numeric versions</p>
    <p>What is $expr? 
    <answer name="ansN">
      <award><when>$resp=<math extend="$expr" simplify /></when></award>
    </answer></p>
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { S: 0, N: 0 } },
                {
                    responses: { resp: "-7" },
                    credits: { S: 1, N: 1 },
                },
                {
                    responses: { resp: "-3-4" },
                    credits: { S: 0, N: 1 },
                },
            ],
        });
    });

    it("symbolic equality with simplification, exponentials", async () => {
        const doenetML = `

    <math name='eAns'>-5 *e^(-t)</math>
    <math name='expAns'>-5 *exp(-t)</math>
    <p>Response: <mathInput name="resp" /></p>

    <answer symbolicEquality simplifyOnCompare name="ansE">
        <award><when>$resp=$eAns</when></award>
    </answer>
    <answer symbolicEquality simplifyOnCompare name="ansEXP">
        <award><when>$resp=$expAns</when></award>
    </answer>
    <answer symbolicEquality simplifyOnCompare name="ansES">
        <award><when>$resp=$(eAns{simplify})</when></award>
    </answer>
    <answer symbolicEquality simplifyOnCompare name="ansEXPS">
        <award><when>$resp=$(expAns{simplify})</when></award>
    </answer>
 
    `;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: {}, credits: { E: 0, EXP: 0, ES: 0, EXPS: 0 } },
                {
                    responses: { resp: "-5e^{-t}" },
                    credits: { E: 1, EXP: 1, ES: 1, EXPS: 1 },
                },
                {
                    responses: { resp: "-5\\exp(-t)" },
                    credits: { E: 1, EXP: 1, ES: 1, EXPS: 1 },
                },
                {
                    responses: { resp: "-5/e^t" },
                    credits: { E: 1, EXP: 1, ES: 1, EXPS: 1 },
                },
                {
                    responses: { resp: "-5/\\exp(t)" },
                    credits: { E: 1, EXP: 1, ES: 1, EXPS: 1 },
                },
            ],
        });
    });
});
