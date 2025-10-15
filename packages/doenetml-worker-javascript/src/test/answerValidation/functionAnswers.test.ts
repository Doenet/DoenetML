import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("function answer validation tests", async () => {
    it("simple function of input", async () => {
        let responseCredits = {
            "": 0,
            "7": 1,
            "0": 1,
            "-14": 1,
            "33": 1,
            "-102351": 1,
            "9.5": 0,
            "x^2": 0,
            "-253.3": 0,
            "23.6": 0,
            "11.9": Math.cos(2 * Math.PI * 0.1),
            "73.15": Math.cos(2 * Math.PI * 0.15),
            "-103.8": Math.cos(2 * Math.PI * 0.2),
            "-0.05": Math.cos(2 * Math.PI * 0.05),
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
            <function name="f">cos(2*pi*x)</function>
            
            <p>Enter a number close to an integer:
            <answer disableAfterCorrect="false" name="ans">
              <mathInput name="x" />
              <award credit="$$f($x)">
                <when>true</when>
              </award>
            </answer>
            </p>`,
        });

        for (let response in responseCredits) {
            await updateMathInputValue({
                latex: response,
                componentIdx: await resolvePathToNodeIdx("x"),
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
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).closeTo(responseCredits[response], 1e-12);
        }
    });

    it("function with parameters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>Offset: <mathInput name="offset" prefill="0"/></p>
  <p>Period: <mathInput name="period" prefill="1"/></p>
  <p>Magnitude <mathInput name="magnitude" prefill="1"/></p>
  <function name="f">$magnitude cos(2*pi*(x-$offset)/$period)</function>
  <p>Enter a number:
  <answer disableAfterCorrect="false" name="ans">
    <mathInput name="x" />
    <award credit="$$f($x)">
      <when>true</when>
    </award>
  </answer>
  </p>
    `,
        });

        let offsets = [Math.E];
        let periods = [2, Math.PI / 2];
        let magnitudes = [0.5, 2];

        let partialCredit = (o, p, m, x) =>
            Math.max(0, Math.min(1, m * Math.cos((2 * Math.PI * (x - o)) / p)));

        let numberResponses = [Math.E, 0, 2 / 3, -Math.PI / 2, -252351.9];

        for (let offset of offsets) {
            await updateMathInputValue({
                latex: `${offset}`,
                componentIdx: await resolvePathToNodeIdx("offset"),
                core,
            });
            for (let period of periods) {
                await updateMathInputValue({
                    latex: `${period}`,
                    componentIdx: await resolvePathToNodeIdx("period"),
                    core,
                });
                for (let magnitude of magnitudes) {
                    await updateMathInputValue({
                        latex: `${magnitude}`,
                        componentIdx: await resolvePathToNodeIdx("magnitude"),
                        core,
                    });

                    let maximals = [
                        offset,
                        offset + 2 * period,
                        offset - 7 * period,
                    ];
                    let minimals = [
                        offset + 1.5 * period,
                        offset + 5.5 * period,
                        offset - 7.5 * period,
                    ];

                    for (let response of [
                        ...maximals,
                        ...minimals,
                        ...numberResponses,
                    ]) {
                        await updateMathInputValue({
                            latex: `${response}`,
                            componentIdx: await resolvePathToNodeIdx("x"),
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
                        expect(
                            stateVariables[await resolvePathToNodeIdx("ans")]
                                .stateValues.creditAchieved,
                        ).closeTo(
                            partialCredit(offset, period, magnitude, response),
                            1e-12,
                        );
                    }
                }
            }
        }
    });
});
