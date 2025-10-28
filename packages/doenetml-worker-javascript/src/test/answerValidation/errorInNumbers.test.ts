import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function run_single_response_tests({
    doenetML,
    responseCredits,
}: {
    doenetML: string;
    responseCredits: Record<string, number>;
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const mathInputIdx =
        stateVariables[await resolvePathToNodeIdx("ans")].stateValues
            .inputChildren[0].componentIdx;

    for (let response in responseCredits) {
        await submit_check({
            response,
            creditAchieved: responseCredits[response],
            core,
            mathInputIdx,
        });
    }

    async function submit_check({
        core,
        response,
        creditAchieved,
        mathInputIdx,
    }: {
        core: PublicDoenetMLCore;
        response: string;
        creditAchieved: number;
        mathInputIdx: number;
    }) {
        await updateMathInputValue({
            latex: response,
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(creditAchieved, `For response ${response}`);
    }
}

async function run_two_response_tests({
    doenetML,
    responseCredits,
}: {
    doenetML: string;
    responseCredits: Record<string, number>;
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

    for (let response in responseCredits) {
        await submit_check({
            response,
            creditAchieved: responseCredits[response],
            core,
        });
    }

    async function submit_check({
        core,
        response,
        creditAchieved,
    }: {
        core: PublicDoenetMLCore;
        response: string;
        creditAchieved: number;
    }) {
        let [response1, response2] = response.split(",");
        await updateMathInputValue({
            latex: response1,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMathInputValue({
            latex: response2,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(creditAchieved, `For response ${response}`);
    }
}

describe("Allow error in numbers validation tests", async () => {
    it("expression with single number", async () => {
        const doenetML = `
    <answer name="ans">
      <award allowedErrorInNumbers="0.00001" name="aw">
        log(32x+c)
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.0001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.001" />
    </answer>
    `;

        let responseCredits = {
            "\\log(32x+c)": 1,
            "\\log(32.04x+c)": 0,
            "\\log(32.01x+c)": 0.6,
            "\\log(32.001x+c)": 0.8,
            "\\log(32.0001x+c)": 1,
            "\\log(31.9999x+c)": 1,
            "\\log(31.999x+c)": 0.8,
            "\\log(31.99x+c)": 0.6,
            "\\log(31.9x+c)": 0,
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("expression with single number, absolute error", async () => {
        let doenetML = `
    <answer name="ans">
      <award allowedErrorInNumbers="0.00001" allowedErrorIsAbsolute name="aw">
        log(32x+c)
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.0001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.001" />
    </answer>
    `;

        let responseCredits = {
            "\\log(32x+c)": 1,
            "\\log(32.002x+c)": 0,
            "\\log(32.0005x+c)": 0.6,
            "\\log(32.00005x+c)": 0.8,
            "\\log(32.000005x+c)": 1,
            "\\log(31.999995x+c)": 1,
            "\\log(31.99995x+c)": 0.8,
            "\\log(31.9995x+c)": 0.6,
            "\\log(31.995x+c)": 0,
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("don't ignore exponents", async () => {
        let doenetML1 = `
    <answer name="ans">
      <award allowedErrorInNumbers="0.0001">
        10x^2-4
      </award>
    </answer>`;

        let doenetML2 = `
    <answer name="ans">
      <award allowedErrorInNumbers="0.0001" includeErrorInNumberExponents>
        10x^2-4
      </award>
    </answer>
    `;

        let responseCredits1 = {
            "10x^2-4": 1,
            "10.002x^{2.0004}-4.0008": 0, // too large an error
            "10.002x^{2.0002}-4.0008": 0, // too large an error if don't allow exponent error
            "10.001x^{2.00005}-4.0004": 1, // shrink to allowable error in both cases
        };

        let responseCredits2 = {
            "10x^2-4": 1,
            "10.002x^{2.0004}-4.0008": 0, // too large an error
            "10.002x^{2.0002}-4.0008": 1, // too large an error if don't allow exponent error
            "10.001x^{2.00005}-4.0004": 1, // shrink to allowable error in both cases
        };

        await run_single_response_tests({
            doenetML: doenetML1,
            responseCredits: responseCredits1,
        });
        await run_single_response_tests({
            doenetML: doenetML2,
            responseCredits: responseCredits2,
        });
    });

    it("symbolic, expression with single number", async () => {
        const doenetML = `
    <answer name="ans">
      <award symbolicEquality allowedErrorInNumbers="0.00001" name="aw">
        log(32x+c)
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.0001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.001" />
    </answer>
    `;

        let responseCredits = {
            "\\log(32x+c)": 1,
            "\\log(32.04x+c)": 0,
            "\\log(32.01x+c)": 0.6,
            "\\log(32.001x+c)": 0.8,
            "\\log(32.0001x+c)": 1,
            "\\log(31.9999x+c)": 1,
            "\\log(31.999x+c)": 0.8,
            "\\log(31.99x+c)": 0.6,
            "\\log(31.9x+c)": 0,
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, expression with single number, absolute error", async () => {
        let doenetML = `
    <answer name="ans">
      <award symbolicEquality allowedErrorInNumbers="0.00001" allowedErrorIsAbsolute name="aw">
        log(32x+c)
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.0001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.001" />
    </answer>
    `;

        let responseCredits = {
            "\\log(32x+c)": 1,
            "\\log(32.002x+c)": 0,
            "\\log(32.0005x+c)": 0.6,
            "\\log(32.00005x+c)": 0.8,
            "\\log(32.000005x+c)": 1,
            "\\log(31.999995x+c)": 1,
            "\\log(31.99995x+c)": 0.8,
            "\\log(31.9995x+c)": 0.6,
            "\\log(31.995x+c)": 0,
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    // Note: removed numeric version of the "complicated expression" tests
    // as they randomly failed depending on samples used for numerical equality
    it("symbolic, complicated expression with three numbers", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality simplifyOnCompare>
      <award allowedErrorInNumbers="0.0000001" name="aw">
        10000 exp(7x^2/(0.00003-sqrt(y)))
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.000001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.00001" />
    </answer>
    `;

        let responseCredits = {
            "10000 \\exp(7x^2/(0.00003-\\sqrt{y}))": 1, // exact answer
            "9999 \\exp(7x^2/(0.00003-\\sqrt{y}))": 0, // too large an error in first number
            "10000 \\exp(7.0001x^2/(0.00003-\\sqrt{y}))": 0, // too large an error in second number
            "10000 \\exp(7x^2/(0.0000300005-\\sqrt{y}))": 0, // too large an error in third number
            "9999.91 \\exp(7.00005x^2/(0.0000300002-\\sqrt{y}))": 0.6, // partial credit error in each
            "9999.991 \\exp(7.000005x^2/(0.00003000002-\\sqrt{y}))": 0.8, // higher partial credit error in each
            "9999.9991 \\exp(7.0000005x^2/(0.000030000002-\\sqrt{y}))": 1, // acceptable error for full credit
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, complicated expression with three numbers, absolute error", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality allowedErrorIsAbsolute simplifyOnCompare>
      <award allowedErrorInNumbers="0.0000001" name="aw">
        10000 exp(7x^2/(0.00003-sqrt(y)))
      </award>
      <award extend="$aw" credit="0.8" allowedErrorInNumbers="0.000001" />
      <award extend="$aw" credit="0.6" allowedErrorInNumbers="0.00001" />
    </answer>
    `;

        let responseCredits = {
            "10000 \\exp(7x^2/(0.00003-\\sqrt{y}))": 1, // exact answer
            "9999.9999 \\exp(7x^2/(0.00003-\\sqrt{y}))": 0, // too large an error in first number
            "10000 \\exp(7.00002x^2/(0.00003-\\sqrt{y}))": 0, // too large an error in second number
            "10000 \\exp(7x^2/(0.00005-\\sqrt{y}))": 0, // too large an error in third number
            "9999.999991 \\exp(7.000005x^2/(0.000032-\\sqrt{y}))": 0.6, // partial credit error in each
            "9999.9999991 \\exp(7.0000005x^2/(0.0000302-\\sqrt{y}))": 0.8, // higher partial credit error in each
            "9999.99999991 \\exp(7.00000005x^2/(0.00003002-\\sqrt{y}))": 1, // acceptable error for full credit
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, don't ignore exponents", async () => {
        let doenetML1 = `
    <answer name="ans">
      <award symbolicEquality allowedErrorInNumbers="0.0001">
        10x^2-4
      </award>
    </answer>`;

        let doenetML2 = `
    <answer name="ans">
      <award symbolicEquality allowedErrorInNumbers="0.0001" includeErrorInNumberExponents>
        10x^2-4
      </award>
    </answer>
    `;

        let responseCredits1 = {
            "10x^2-4": 1, // exact answer
            "10x^{2.0004}-4": 0, // too large an error in exponent
            "10x^{2.0001}-4": 0, // small error in exponent
            "10.0002x^2-4.00008": 1, // error in numbers not in exponents
        };

        let responseCredits2 = {
            "10x^2-4": 1, // exact answer
            "10x^{2.0004}-4": 0, // too large an error in exponent
            "10x^{2.0001}-4": 1, // small error in exponent
            "10.0002x^2-4.00008": 1, // error in numbers not in exponents
        };

        await run_single_response_tests({
            doenetML: doenetML1,
            responseCredits: responseCredits1,
        });
        await run_single_response_tests({
            doenetML: doenetML2,
            responseCredits: responseCredits2,
        });
    });

    it("symbolic, no simplification", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality allowedErrorInNumbers="0.001">
        2.15234262pi+e*25.602348230
    </answer>
    `;

        let responseCredits = {
            "2.15234262\\pi+e 25.602348230": 1, // exact answer
            "\\pi 2.15234262+e*25.602348230": 0, // Reordering not allowed
            "e 25.602348230 + 2.15234262\\pi": 0,
            ".35618172248981": 0, // Numeric evaluation not allowed
            "2.16\\pi+e 25.602348230": 0, // Round too much
            "2.15234262\\pi+2.73 25.602348230": 0,
            "2.152 3.142+2.718 25.6": 1, // acceptable rounding
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, evaluate numbers, preserve order", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality allowedErrorInNumbers="0.001" simplifyOnCompare="numbersPreserveOrder">
        sin(2pi+1x+4x+pi+6)
    </answer>
    `;

        let responseCredits = {
            "\\sin(2\\pi+1x+4x+\\pi+6)": 1, // exact answer
            "\\sin(2\\pi+\\pi+1x+4x+6)": 0, // Reordering not allowed
            "\\sin(2\\pi+5x+\\pi+6)": 0, // Combining terms not allowed
            "\\sin(6.28318+x+4x+9.14159)": 1, // Numeric evaluation OK
            "\\sin(6.28318+x+4x+9.13)": 0, // Round too much
            "\\sin(6.27+x+4x+9.14159)": 0, // Round too much
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, evaluate numbers", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality allowedErrorInNumbers="0.001" simplifyOnCompare="numbers">
        sin(2pi+1x+4x+pi+6)
    </answer>
    `;

        let responseCredits = {
            "\\sin(2\\pi+1x+4x+\\pi+6)": 1, // exact answer
            "\\sin(2\\pi+\\pi+1x+x*4+6)": 1, // Reordering allowed
            "\\sin(2\\pi+5x+\\pi+6)": 0, // Combining terms not allowed
            "\\sin(6.28318+x+4x+9.14159)": 1, // Numeric evaluation OK
            "\\sin(x+15.42478+4x)": 1,
            "\\sin(x+15.4+4x)": 0, // Round too much
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("symbolic, full simplification", async () => {
        let doenetML = `
    <answer name="ans" symbolicEquality allowedErrorInNumbers="0.001" simplifyOnCompare>
        sin(2pi+1x+4x+pi+6)
    </answer>
    `;

        let responseCredits = {
            "\\sin(2\\pi+1x+4x+\\pi+6)": 1, // exact answer
            "\\sin(2\\pi+\\pi+1x+x*4+6)": 1, // Reordering allowed
            "\\sin(2\\pi+5x+\\pi+6)": 1, // Combining terms allowed
            "\\sin(6.28318+x+4x+9.14159)": 1, // Numeric evaluation OK
            "\\sin(x+15.42478+4x)": 1,
            "\\sin(x+15.4+4x)": 0, // Round too much
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("expression with vector, matchPartial", async () => {
        let doenetML = `
    <answer name="ans" allowedErrorInNumbers="0.001" matchPartial>
       (log(32x+c), 42)
    </answer>
    `;

        let responseCredits = {
            "(\\log(32x+c), 42)": 1, // exact answer
            "(\\log(32.04x+c), 42)": 0.5, // too large an error in first component
            "(\\log(32.04x+c), 42.3)": 0, // too large an error in both components
            "(\\log(32.01x+c), 42.3)": 0.5, // shrink error in first component
            "(\\log(32.01x+c), 42.03)": 1, // shrink error in second component
            "(42, \\log(32x+c))": 0.5, // order matters, so just one component matches
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("expression with vector, matchPartial, unordered", async () => {
        let doenetML = `
    <answer name="ans" allowedErrorInNumbers="0.001" matchPartial>
       <math unordered>(log(32x+c), 42)</math>
    </answer>
    `;

        let responseCredits = {
            "(42, \\log(32x+c))": 1, // exact answer
            "(42, \\log(32.04x+c))": 0.5, // too large an error in first component
            "(42.3, \\log(32.04x+c))": 0, // too large an error in both components
            "(42.3, \\log(32.01x+c))": 0.5, // shrink error in first component
            "(42.03, \\log(32.01x+c))": 1, // shrink error in second component
            "(\\log(32x+c), 42)": 1, // order doesn't matter
        };

        await run_single_response_tests({ doenetML, responseCredits });
    });

    it("expression with math lists, matchPartial", async () => {
        let doenetML = `
    <answer name="ans" matchPartial allowedErrorInNumbers="0.001">
      <mathInput name="mi1" />
      <mathInput name="mi2" />
      <award>
        <when><mathList>$mi1 $mi2</mathList> = <mathList>log(32x+c) 42</mathList></when>
      </award>
    </answer>
    `;

        let responseCredits = {
            "\\log(32x+c),42": 1, // exact answer
            "\\log(32.04x+c),42": 0.5, // too large an error in first component
            "\\log(32.04x+c),42.3": 0, // too large an error in both components
            "\\log(32.01x+c),42.3": 0.5, // shrink error in first component
            "\\log(32.01x+c),42.03": 1, // shrink error in second component
            "42,\\log(32x+c),": 0.5, // order matters, so just one component matches
        };

        await run_two_response_tests({ doenetML, responseCredits });
    });

    it("expression with math lists, matchPartial, unordered", async () => {
        let doenetML = `
    <answer name="ans" matchPartial allowedErrorInNumbers="0.001">
      <mathInput name="mi1" />
      <mathInput name="mi2" />
      <award>
        <when><mathList>$mi1 $mi2</mathList> = <mathList unordered>log(32x+c) 42</mathList></when>
      </award>
    </answer>
    `;

        let responseCredits = {
            "42,\\log(32x+c)": 1, // exact answer
            "42,\\log(32.04x+c)": 0.5, // too large an error in first component
            "42.3,\\log(32.04x+c)": 0, // too large an error in both components
            "42.3,\\log(32.01x+c)": 0.5, // shrink error in first component
            "42.03,\\log(32.01x+c)": 1, // shrink error in second component
            "\\log(32x+c),42": 1, // order doesn't matter
        };

        await run_two_response_tests({ doenetML, responseCredits });
    });
});
