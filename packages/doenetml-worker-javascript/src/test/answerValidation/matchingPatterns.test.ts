import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("matching patterns answer tests", async () => {
    it("enter any quadratic", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <math name="pattern1">()$var^2+()$var+()</math>
      <math name="pattern2">()$var^2+()</math>
    </setup>

    <p><mathInput name="var" /></p>
    <p>Enter a quadratic expression in the variable <math name="var2" extend="$var" />:
    <answer name="ans">
      <mathInput name="resp" />
      <award><when>
        <matchesPattern name="excludeX1" pattern="$pattern1" excludeMatches="$var" allowImplicitIdentities>
          $resp
        </matchesPattern>
        or
        <matchesPattern name="excludeX2" pattern="$pattern2" excludeMatches="$var" allowImplicitIdentities>
          $resp
        </matchesPattern>
      </when></award>
      <considerAsResponses>
        <conditionalContent>
          <case condition="$excludeX1">$excludeX1.patternMatches[1] $excludeX1.patternMatches[2] $excludeX1.patternMatch3</case>
          <case condition="$excludeX2">$excludeX2.patternMatches[1] <math>0</math> $excludeX2.patternMatch2</case>
        </conditionalContent>
      </considerAsResponses>
    </answer>
    </p>

    <p name="p_sub">Submitted answer: <mathList extend="$ans.submittedResponse" name="sub" /></p>
    <p name="p_quad">Quadratic coeff: <mathList extend="$ans.submittedResponse2" name="quad" /></p>
    <p name="p_lin">Linear coeff: <mathList extend="$ans.submittedResponse3" name="lin" /></p>
    <p name="p_const">Constant term: <mathList extend="$ans.submittedResponse4" name="const" /></p>
    

    `,
        });

        let desiredResults = {
            x: {
                "": {
                    correct: false,
                    response: "\uff3f",
                },
                "x^2": {
                    correct: true,
                    response: ["^", "x", 2],
                    matches: [1, 0, 0],
                },
                "x^2+1": {
                    correct: true,
                    response: ["+", ["^", "x", 2], 1],
                    matches: [1, 0, 1],
                },
                "x^2+x": {
                    correct: true,
                    response: ["+", ["^", "x", 2], "x"],
                    matches: [1, 1, 0],
                },
                "x^2+x+x": {
                    correct: false,
                    response: ["+", ["^", "x", 2], "x", "x"],
                },
                "x^2+c": {
                    correct: true,
                    response: ["+", ["^", "x", 2], "c"],
                    matches: [1, 0, "c"],
                },
                "xx^2+c": {
                    correct: false,
                    response: ["+", ["*", "x", ["^", "x", 2]], "c"],
                },
                "x^2+x+c+d": {
                    correct: true,
                    response: ["+", ["^", "x", 2], "x", "c", "d"],
                    matches: [1, 1, ["+", "c", "d"]],
                },
                "ax^2+bx+c": {
                    correct: true,
                    response: [
                        "+",
                        ["*", "a", ["^", "x", 2]],
                        ["*", "b", "x"],
                        "c",
                    ],
                    matches: ["a", "b", "c"],
                },
                "ay^2+by+c": {
                    correct: false,
                    response: [
                        "+",
                        ["*", "a", ["^", "y", 2]],
                        ["*", "b", "y"],
                        "c",
                    ],
                },
                "\\sqrt{2}x^2+5/8x+e^y": {
                    correct: true,
                    response: [
                        "+",
                        ["*", ["apply", "sqrt", 2], ["^", "x", 2]],
                        ["*", ["/", 5, 8], "x"],
                        ["^", "e", "y"],
                    ],
                    matches: [
                        ["apply", "sqrt", 2],
                        ["/", 5, 8],
                        ["^", "e", "y"],
                    ],
                },
            },
            y: {
                "ay^2+by+c": {
                    correct: true,
                    response: [
                        "+",
                        ["*", "a", ["^", "y", 2]],
                        ["*", "b", "y"],
                        "c",
                    ],
                    matches: ["a", "b", "c"],
                },
                "\\pi y^2x^2+e^xy+x+x": {
                    correct: true,
                    response: [
                        "+",
                        ["*", "pi", ["^", "y", 2], ["^", "x", 2]],
                        ["*", ["^", "e", "x"], "y"],
                        "x",
                        "x",
                    ],
                    matches: [
                        ["*", "pi", ["^", "x", 2]],
                        ["^", "e", "x"],
                        ["+", "x", "x"],
                    ],
                },
                "4y^2-9y-2": {
                    correct: true,
                    response: [
                        "+",
                        ["*", 4, ["^", "y", 2]],
                        ["-", ["*", 9, "y"]],
                        -2,
                    ],
                    matches: [4, ["-", 9], -2],
                },
                "4y^2+3x+5": {
                    correct: true,
                    response: ["+", ["*", 4, ["^", "y", 2]], ["*", 3, "x"], 5],
                    matches: [4, 0, ["+", ["*", 3, "x"], 5]],
                },
            },
        };

        for (let varName in desiredResults) {
            await updateMathInputValue({
                latex: varName,
                componentIdx: await resolvePathToNodeIdx("var"),
                core,
            });

            let resultsForVar = desiredResults[varName];
            for (let expr in resultsForVar) {
                await updateMathInputValue({
                    latex: expr,
                    componentIdx: await resolvePathToNodeIdx("resp"),
                    core,
                });
                await submitAnswer({
                    componentIdx: await resolvePathToNodeIdx("ans"),
                    core,
                });
                let stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                let res = resultsForVar[expr];

                if (res.correct) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(1);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("sub[1]")]
                            .stateValues.value.tree,
                    ).eqls(res.response);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("quad[1]")]
                            .stateValues.value.tree,
                    ).eqls(res.matches[0]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("lin[1]")]
                            .stateValues.value.tree,
                    ).eqls(res.matches[1]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("const[1]")]
                            .stateValues.value.tree,
                    ).eqls(res.matches[2]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse1.tree,
                    ).eqls(res.response);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse2.tree,
                    ).eqls(res.matches[0]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse3.tree,
                    ).eqls(res.matches[1]);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse4.tree,
                    ).eqls(res.matches[2]);
                } else {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.creditAchieved,
                    ).eq(0);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("sub[1]")]
                            .stateValues.value.tree,
                    ).eqls(res.response);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("quad[1]")],
                    ).be.undefined;
                    expect(stateVariables[await resolvePathToNodeIdx("lin[1]")])
                        .be.undefined;
                    expect(
                        stateVariables[await resolvePathToNodeIdx("const[1]")],
                    ).be.undefined;
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse1.tree,
                    ).eqls(res.response);
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse2,
                    ).be.undefined;
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse3,
                    ).be.undefined;
                    expect(
                        stateVariables[await resolvePathToNodeIdx("ans")]
                            .stateValues.submittedResponse4,
                    ).be.undefined;
                }
            }
        }
    });
});
