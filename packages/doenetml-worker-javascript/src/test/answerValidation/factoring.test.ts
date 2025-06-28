import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function createDoenetML(
    factoredString: string,
    partialFactoredString?: string,
) {
    function createAward({
        partial = false,
        mode = "D",
    }: { partial?: boolean; mode?: "D" | "RD" | "MM" | "SD" } = {}) {
        let modeString = "";
        if (mode === "RD") {
            modeString = "restrictDivision ";
        } else if (mode === "MM") {
            modeString = "monomialFactorMustMatch";
        } else if (mode === "SD") {
            modeString = "allowOnlySignDifferences";
        }

        return `
    <award ${partial ? `credit="0.5"` : ""}>
      <when>
        <hasSameFactoring ${modeString}>$resp${partial ? "$partialFactor" : "$poly"}</hasSameFactoring>
      </when>
    </award>
        `;
    }

    return `
    <setup>
      <math name="poly">${factoredString}</math>
      <math name="polyExpandSimplify" simplify expand>$poly</math>
      ${
          partialFactoredString
              ? `<math name="partialFactor">${partialFactoredString}</math>`
              : ""
      }
    </setup>

    <p>Question: Factor the polynomial $polyExpandSimplify.</p>
    
    <p>Answer <mathInput name="resp" /></p>
    
    <p>Default setting: <answer name="checkD">
      ${createAward()}
      ${partialFactoredString ? createAward({ partial: true }) : ""}
    </answer></p>
    <p>Restrict division: <answer name="checkRD">
      ${createAward({ mode: "RD" })}
      ${partialFactoredString ? createAward({ mode: "RD", partial: true }) : ""}
    </answer></p>
    <p>Monomial factor must match: <answer name="checkMM">
      ${createAward({ mode: "MM" })}
      ${partialFactoredString ? createAward({ mode: "MM", partial: true }) : ""}
    </answer></p>
    <p>Allow only sign differences in factors: <answer name="checkSD">
      ${createAward({ mode: "SD" })}
      ${partialFactoredString ? createAward({ mode: "SD", partial: true }) : ""}
    </answer></p>
    <p>Normal equality:
      <answer name="checkE"><award><when>$resp=$poly</when></award></answer>
    </p>
      `;
}

const answers = ["D", "RD", "MM", "SD", "E"];

async function run_tests({
    factoredString,
    partialFactoredString,
    responseCredits,
}: {
    factoredString: string;
    partialFactoredString?: string;
    responseCredits: Record<
        string,
        {
            D: number;
            RD: number;
            MM: number;
            SD: number;
            E: number;
        }
    >;
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: createDoenetML(factoredString, partialFactoredString),
    });

    //console.log({
    //    doenetML: createDoenetML(factoredString, partialFactoredString),
    //});

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
        creditAchieved: {
            D: number;
            RD: number;
            MM: number;
            SD: number;
            E: number;
        };
    }) {
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("resp"),
            core,
        });
        for (let ans of answers) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`check${ans}`),
                core,
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (let ans of answers) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`check${ans}`)]
                    .stateValues.creditAchieved,
            ).eq(creditAchieved[ans], `${ans} credit for response ${response}`);
        }
    }
}

describe("factor polynomial tests", async () => {
    it("factor x^2-1", async () => {
        let factoredString = "(x-1)(x+1)";

        let responseCredits = {
            "x^2-1": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(2x^2-2)/2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x-1)(x+1)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(1-x)(x+1)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "-(1-x)(x+1)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(1-x)(-1-x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "-(1-x)(-1-x)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "-(x-1)(-1-x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x^2-1)x/x": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x^2-1)5/5": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "((x-1)(x+1))": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(2x-2)(x+1)/2": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "(2x-2)(x+1)(1/2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "1/2(2x-2)(x+1)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "0.5(2x-2)(x+1)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "0.25(2x-2)(2x+2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "\\sqrt{x^2-1}^2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "\\sqrt{2x^2-2}\\sqrt{(x^2-1)/2}": {
                D: 0,
                RD: 0,
                MM: 0,
                SD: 0,
                E: 1,
            },
            "\\sqrt{4x^2-4}\\sqrt{x^2-1}/2": {
                D: 0,
                RD: 0,
                MM: 0,
                SD: 0,
                E: 1,
            },
            "(x^2-1)(\\cos^2 x+\\sin^2 x)": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x-1)(x+1)(\\cos^2 x+\\sin^2 x)/(\\cos^2 x+\\sin^2 x)": {
                D: 0,
                RD: 0,
                MM: 0,
                SD: 0,
                E: 1,
            },
            "(x/3-1/3)(3x+3)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor 4x^2-4", async () => {
        let factoredString = "4(x-1)(x+1)";

        let responseCredits = {
            "4x^2-4": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(1-x)(x+1)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "4(1-x)(-1-x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "-4(1-x)(1+x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(1-x)(1+x)(-4)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "4(2x-2)(1/2+x/2)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "2(1-x)(1+x)(-2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(2x-2)(x+1)2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "2(x-1)(2x+2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(3x-3)(8x+8)/6": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "(3x-3)(8x+8)(1/6)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(6x-6)(8x+8)(1/6)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "0.5(6x-6)(4x+4)(1/3)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor (6z-4)(5z+10)", async () => {
        let factoredString = "(6z-4)(5z+10)";

        let responseCredits = {
            "30z^2+40z-40": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(6z-4)(5z+10)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "-(4-6z)(5z+10)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(30z-20)(z+2)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "-(2-3z)(10z+20)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "5(6z-4)(z+2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "5(4-6z)(z+2)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "5(2-3z)(z+2)(-2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "15(2-3z)(z+2)(-2)(1/3)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "15(2-3z)(z+2)(-2)/3": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "15(2-3z)3(z+2)(-2)/9": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "15(2-3z)3(z+2)(-2)(1/9)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor (6z-4)(z+2)5", async () => {
        let factoredString = "(6z-4)(z+2)5";

        let responseCredits = {
            "30z^2+40z-40": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(6z-4)(5z+10)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "5(6z-4)(z+2)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "5(3z-2)(2z+4)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "5(4-6z)(z+2)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "5(2-3z)(z+2)(-2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "15(2-3z)(z+2)(-2)(1/3)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "15(2-3z)(z+2)(-2)/3": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "15(2-3z)3(z+2)(-2)/9": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "15(2-3z)3(z+2)(-2)(1/9)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor (2x+4)^2", async () => {
        let factoredString = "(2x+4)^2";

        let responseCredits = {
            "4x^2+16x+16": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(x^2+4x+4)": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(x+2)(x+2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "4(x+2)^2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(2x+4)^2": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(2(x+2))^2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+4+x)^2": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(4x+8)(x+2)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "4\\sqrt{x^2+4x+4}^2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "\\sqrt{4x^2+16x+16}^2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor 2^2(x+2)^2", async () => {
        let factoredString = "2^2(x+2)^2";

        let responseCredits = {
            "4x^2+16x+16": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(x^2+4x+4)": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(x+2)(x+2)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "4(x+2)^2": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(2x+4)^2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(2(x+2))^2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+4+x)^2": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(4x+8)(x+2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "4\\sqrt{x^2+4x+4}^2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "\\sqrt{4x^2+16x+16}^2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "4(2x+4)(x/2+1)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor (x-1/2)(x+1)", async () => {
        let factoredString = "(x-1/2)(x+1)";

        let responseCredits = {
            "x^2+x/2-1/2": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x+1)(x-1/2)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x+1)(2x-1)/2": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x+1)(2x-1)(1/2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "-(x+1)(1-2x)(1/2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+1)(1-2x)(1/2)": { D: 0, RD: 0, MM: 0, SD: 0, E: 0 },
            "(x+1)(-1)(1-2x)(1/2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+1)(1-2x)(-\\frac{1}{2})": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+1)(1-2x)(\\frac{-1}{2})": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "(x+1)(1-2x)(\\frac{1}{-2})": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "-(x+1)(2x-1)(-\\frac{1}{2})": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
            "-(x+1)(1/2-x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x+1)(1)(x-1/2)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x+1)(-1)(1/2-x)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x/2+1/2)(2x-1)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "(x/2+1/2)(-1)(1-2x)": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            responseCredits,
        });
    });

    it("factor (x-1)(x+1)^2", async () => {
        let factoredString = "(x-1)(x+1)^2";
        let partialFactoredString = "(x+1)(x^2-1)";

        let responseCredits = {
            "x^3+x^2-x-1": { D: 0, RD: 0, MM: 0, SD: 0, E: 1 },
            "(x-1)(x+1)^2": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x+1)(x-1)(x+1)": { D: 1, RD: 1, MM: 1, SD: 1, E: 1 },
            "(x^2-1)(x+1)": { D: 0.5, RD: 0.5, MM: 0.5, SD: 0.5, E: 1 },
            "(1/4*x-1/4)(2x+2)^2": { D: 1, RD: 1, MM: 1, SD: 0, E: 1 },
            "(x-1)(x^2+2x+1)": { D: 0.5, RD: 0.5, MM: 0.5, SD: 0, E: 1 },
            "2(x+1)(x-1)(x+1)/2": { D: 1, RD: 0, MM: 0, SD: 0, E: 1 },
            "2(x+1)(x-1)(x+1)(1/2)": { D: 1, RD: 1, MM: 0, SD: 0, E: 1 },
        };

        await run_tests({
            factoredString,
            partialFactoredString,
            responseCredits,
        });
    });
});
