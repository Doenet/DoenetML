import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function createDoenetML(polyString: string) {
    return `
    <setup>
    <math name="poly">${polyString}</math>
    <math name="polyExpandSimplify" simplify expand>$poly</math>
    <math name="respSimplify" simplify>$resp</math>
    <math name="respExpandSimplify" simplify expand>$resp</math>
    <extractMathOperator name="originalOperator">$respSimplify</extractMathOperator>
    <text name="minus">-</text>
    <text name="mult">*</text>
    <text name="div">/</text>
    <text name="pow">^</text>
    <text name="add">+</text>
    <conditionalContent name="cc1">
      <case condition="$originalOperator=$minus">
        <extractMath type="operand" operandNumber="1" name="respNoMinus">$respSimplify</extractMath>
        <extractMathOperator name="postMinusOperator">$respNoMinus</extractMathOperator>
      </case>
      <else>
        <math name="respNoMinus" extend="$respSimplify" />
        <text name="postMinusOperator" extend="$originalOperator" />
        </else>
    </conditionalContent>
    <conditionalContent name="cc2">
      <case condition="$cc1.postMinusOperator=$div">
        <extractMath type="operand" operandNumber="1" name="numerator">$cc1.respNoMinus</extractMath>
        <extractMath type="operand" operandNumber="2" name="denominator">$cc1.respNoMinus</extractMath>
        <extractMathOperator name="numeratorOperator">$numerator</extractMathOperator>
      </case>
      <else>
        <math name="numerator" extend="$cc1.respNoMinus" />
        <math name="denominator">1</math>
        <text name="numeratorOperator" extend="$cc1.postMinusOperator" />
      </else>
    </conditionalContent>
    <extractMath type="operand" operandNumber="1" name="numeratorOperand1">$cc2.numerator</extractMath>
    <extractMath type="numOperands" name="numeratorNumOperands">$cc2.numerator</extractMath>
    <conditionalContent name="cc3">
      <case condition="$cc2.numeratorOperator=$mult and isnumber($numeratorOperand1) and $numeratorNumOperands = 2" >
        <extractMath type="operand" operandNumber="2" name="innerPiece">$cc2.numerator</extractMath>
        <extractMathOperator name="innerOperator">$innerPiece</extractMathOperator>
      </case>
      <else>
        <math name="innerPiece" extend="$cc2.numerator" />
        <text name="innerOperator" extend="$cc2.numeratorOperator" />
      </else>
    </conditionalContent>
  </setup>

  <p>Question: Factor the polynomial $polyExpandSimplify.</p>
  
  <p>Answer <mathInput name="resp" /></p>

  <answer disableAfterCorrect="false" name="check" symbolicEquality>
    <award>
      <when>
        $respExpandSimplify = $polyExpandSimplify
        and
        (
          (
            $cc3.innerOperator = $pow 
            and
            <extractMathOperator><extractMath type="operand" operandNumber="1">$cc3.innerPiece</extractMath></extractMathOperator> = $add
          )
          or
          $cc3.innerOperator = $mult
          and
          <isNumber>$cc2.denominator</isNumber>
          and
          (
            <extractMath type="numOperands">$cc3.innerPiece</extractMath> = 3
            or 
            not <isNumber><extractMath type="operand" operandNumber="1">$cc3.innerPiece</extractMath></isNumber>
          )
        )
      </when>
    </award>
  </answer>`;
}

const answers = ["D", "RD", "MM", "SD", "E"];

async function run_tests({
    polyString,
    responseCredits,
}: {
    polyString: string;
    responseCredits: { response: string; credit: number }[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: createDoenetML(polyString),
    });

    for (let responseObj of responseCredits) {
        await submit_check({
            response: responseObj.response,
            creditAchieved: responseObj.credit,
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
        await updateMathInputValue({
            latex: response,
            componentIdx: await resolvePathToNodeIdx("resp"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx(`check`),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(`check`)].stateValues
                .creditAchieved,
        ).eq(creditAchieved, `credit for response ${response}`);
    }
}

// Note: even through have a better factoring test,
// we are keeping these tests, as they probe how well
// we can handle components that change type
// (due to the multiple conditionalContents that are copied)

describe("factor polynomial tests, old algorithm", async () => {
    it("factor x^2-1", async () => {
        let polyString = "x^2-1";

        let responseCredits = [
            { response: "x^2-1", credit: 0 },
            { response: "(2x^2-2)/2", credit: 0 },
            { response: "(x-1)(x+1)", credit: 1 },
            { response: "(1-x)(x+1)", credit: 0 },
            { response: "-(1-x)(x+1)", credit: 1 },
            // swap minus signs a few times to verify bug from changing component types is fixed
            { response: "(1-x)(x+1)", credit: 0 },
            { response: "-(1-x)(x+1)", credit: 1 },
            { response: "(1-x)(x+1)", credit: 0 },
            { response: "-(1-x)(x+1)", credit: 1 },
            { response: "(1-x)(x+1)", credit: 0 },
            { response: "-(1-x)(x+1)", credit: 1 },
            { response: "(1-x)(-1-x)", credit: 1 },
            { response: "-(1-x)(-1-x)", credit: 0 },
            { response: "-(x-1)(-1-x)", credit: 1 },
            { response: "(x^2-1)x/x", credit: 0 },
            { response: "(x^2-1)5/5", credit: 0 },
            { response: "((x-1)(x+1))", credit: 1 },
            { response: "(2x-2)(x+1)/2", credit: 1 },
            { response: "1/2(2x-2)(x+1)", credit: 1 },
            { response: "0.5(2x-2)(x+1)", credit: 1 },
            { response: "0.25(2x-2)(2x+2)", credit: 1 },
            { response: "\\sqrt{x^2-1}^2", credit: 0 },
            { response: "\\sqrt{2x^2-2}\\sqrt{(x^2-1)/2}", credit: 0 },
            { response: "\\sqrt{4x^2-4}\\sqrt{x^2-1}/4", credit: 0 },
        ];

        await run_tests({ polyString, responseCredits });
    });

    it("factor 4x^2-4", async () => {
        let polyString = "4x^2-4";

        let responseCredits = [
            { response: "4x^2-4", credit: 0 },
            { response: "4(x-1)(x+1)", credit: 1 },
            { response: "4(1-x)(x+1)", credit: 0 },
            { response: "4(1-x)(-1-x)", credit: 1 },
            { response: "-4(1-x)(1+x)", credit: 1 },
            { response: "(1-x)(1+x)(-4)", credit: 1 },
            { response: "2(1-x)(1+x)(-2)", credit: 1 },
            { response: "(2x-2)(x+1)2", credit: 1 },
            { response: "2(x-1)(2x+2)", credit: 1 },
            { response: "(3x-3)(8x+8)/6", credit: 1 },
            { response: "(6x-6)(8x+8)/6", credit: 0 },
            { response: "0.5(6x-6)(4x+4)/3", credit: 1 },
        ];

        await run_tests({ polyString, responseCredits });
    });

    it("factor (6z-4)(5z+10)", async () => {
        let polyString = "(6z-4)(5z+10)";

        let responseCredits = [
            { response: "30z^2+40z-40", credit: 0 },
            { response: "(6z-4)(5z+10)", credit: 1 },
            { response: "5(6z-4)(z+2)", credit: 1 },
            { response: "5(4-6z)(z+2)", credit: 0 },
            { response: "5(2-3z)(z+2)(-2)", credit: 1 },
            { response: "15(2-3z)(z+2)(-2)/3", credit: 1 },
            { response: "15(2-3z)3(z+2)(-2)/9", credit: 1 },
        ];

        await run_tests({ polyString, responseCredits });
    });

    it("factor (3q+2r)(6s+8t)", async () => {
        let polyString = "(3q+2r)(6s+8t)";

        let responseCredits = [
            { response: "18qs+24qt+12rs+16rt", credit: 0 },
            { response: "(3q+2r)(6s+8t)", credit: 1 },
            { response: "3q(6s+8t) + 2r(6s+8t)", credit: 0 },
            { response: "(6s+8t)(3q+2r)", credit: 1 },
            { response: "(8t+6s)(3q+2r)", credit: 1 },
            { response: "(8t+6s)(2r+3q)", credit: 1 },
            { response: "(8t+6s)(2r+q+q+q)", credit: 1 },
            { response: "(4t+3s)2(2r+3q)", credit: 1 },
        ];

        await run_tests({ polyString, responseCredits });
    });

    it("factor (2x+4)^2", async () => {
        let polyString = "(2x+4)^2";

        let responseCredits = [
            { response: "4x^2+16x+16", credit: 0 },
            { response: "4(x^2+4x+4)", credit: 0 },
            { response: "4(x+2)(x+2)", credit: 1 },
            { response: "4(x+2)^2", credit: 1 },
            { response: "(2x+4)^2", credit: 1 },
            { response: "(2(x+2))^2", credit: 1 },
            { response: "(x+4+x)^2", credit: 1 },
            { response: "(4x+8)(x+2)", credit: 1 },
            { response: "4\\sqrt{x^2+4x+4}^2", credit: 0 },
            { response: "\\sqrt{4x^2+16x+16}^2", credit: 0 },
        ];

        await run_tests({ polyString, responseCredits });
    });
});
