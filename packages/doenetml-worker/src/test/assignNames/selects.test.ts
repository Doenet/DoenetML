import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { numberToLetters } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("selects assign name tests", async () => {
    it("assignNamesSkip in selects", async () => {
        let core = await createTestCore({
            doenetML: `
  <setup>
    <text name="h">hop</text>
  </setup>

  <select name="select1" numToSelect="6" assignNames="(a) (b) (c) (d) (e) (f)">
    <option>
      <text>hi</text>
    </option>
    <option>
      <select assignNamesSkip="2">
        <option><text>orange</text></option>
        <option><text>red</text></option>
      </select>
    </option>
    <option>
      $h
    </option>
    <option>
      <selectFromSequence assignNamesSkip="1" type="letters" from="a" to="z" />
    </option>
    <option>
      <select assignNamesSkip="1" type="text">once upon a time</select>
    </option>
    <option>
      <selectRandomNumbers assignNamesSkip="1" />
    </option>
  </select>
  `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let selectedIndices =
            stateVariables["/select1"].stateValues.selectedIndices;

        let cNames = ["/a", "/b", "/c", "/d", "/e", "/f"];

        for (let [j, index] of selectedIndices.entries()) {
            let comp = stateVariables[cNames[j]];
            let cType = index === 6 ? "number" : "text";

            let optionReplacement =
                stateVariables[
                    stateVariables[
                        stateVariables["/select1"].replacements![j]
                            .componentName
                    ].replacements![1].componentName
                ];

            expect(comp.componentType).eq(cType);

            if (index === 1) {
                expect(comp.stateValues.value).eq("hi");
            } else if (index === 2) {
                let color =
                    optionReplacement.stateValues.selectedIndices[0] === 1
                        ? "orange"
                        : "red";
                expect(comp.stateValues.value).eq(color);
            } else if (index === 3) {
                expect(comp.stateValues.value).eq("hop");
            } else if (index === 4) {
                let letter = numberToLetters(
                    optionReplacement.stateValues.selectedIndices[0],
                    true,
                );
                expect(comp.stateValues.value).eq(letter);
            } else if (index === 5) {
                let word = ["once", "upon", "a", "time"][
                    optionReplacement.stateValues.selectedIndices[0] - 1
                ];
                expect(comp.stateValues.value).eq(word);
            } else if (index === 6) {
                expect(comp.stateValues.value).lte(1).gte(0);
            }
        }
    });
});
