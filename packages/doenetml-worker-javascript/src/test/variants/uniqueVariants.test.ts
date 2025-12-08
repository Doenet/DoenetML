import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { numberToLetters } from "@doenet/utils";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Unique variant tests", async () => {
    it("single select", async () => {
        let values = ["u", "v", "w", "x", "y", "z"];
        let doenetML = `
        <select name="x">u v w x y z</select>
      `;

        // get all values before they repeat in next variants
        const sampledValues: string[] = [];
        for (let ind = 1; ind <= 18; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1][1]")]
                    .stateValues.value.tree,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);
        }

        // first six are in a random order
        expect(sampledValues.slice(0, 6).sort()).eqls(values);
        // then that order is repeated
        expect(sampledValues.slice(6, 12)).eqls(sampledValues.slice(0, 6));
        expect(sampledValues.slice(12, 18)).eqls(sampledValues.slice(0, 6));
    });

    it("single selectFromSequence", async () => {
        let doenetML = `
        <selectFromSequence name="x" length="5" />
      `;

        // get all values before they repeat in next variants
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 15; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e"]);
        }

        // first five are in a random order
        expect(sampledValues.slice(0, 5).sort()).eqls([1, 2, 3, 4, 5]);
        // then that order is repeated
        expect(sampledValues.slice(5, 10)).eqls(sampledValues.slice(0, 5));
        expect(sampledValues.slice(10, 15)).eqls(sampledValues.slice(0, 5));
    });

    it("selectFromSequence with excludes", async () => {
        let doenetML = `
        <selectFromSequence name="x" type="letters" from="c" to="m" step="2" exclude="g k" />
      `;
        let letters = ["c", "e", "i", "m"];

        // get all values before they repeat in next variants
        const sampledValues: string[] = [];
        for (let ind = 1; ind <= 12; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            );
        }

        // first four are in a random order
        expect(sampledValues.slice(0, 4).sort()).eqls(letters);
        // then that order is repeated
        expect(sampledValues.slice(4, 8)).eqls(sampledValues.slice(0, 4));
        expect(sampledValues.slice(8, 12)).eqls(sampledValues.slice(0, 4));
    });

    it("select and selectFromSequence combination", async () => {
        let valuesW = ["m", "n"];
        let valuesX = ["x", "y", "z"];
        let valuesY = [2, 3, 4];
        let valuesZ = [3, 7];

        let values: string[] = [];
        for (let w of valuesW) {
            for (let x of valuesX) {
                for (let y of valuesY) {
                    for (let z of valuesZ) {
                        values.push([w, x, y, z].join(","));
                    }
                }
            }
        }
        let valuesFound: string[] = [];

        let numVariants =
            valuesW.length * valuesX.length * valuesY.length * valuesZ.length;

        let wsFound: string[] = [],
            xsFound: string[] = [],
            ysFound: number[] = [],
            zsFound: number[] = [];

        let doenetML = `
      <asList>
        <selectFromSequence type="letters" name="w" from="m" to="n" />
        <select name="x">x y z</select>
        <selectFromSequence name="y" from="2" to="4" />
        <select name="z">3 7</select>
      </asList>
      `;

        // get all values in variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newW =
                stateVariables[await resolvePathToNodeIdx("w[1]")].stateValues
                    .value;
            let newX =
                stateVariables[await resolvePathToNodeIdx("x[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("y[1]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("z[1][1]")]
                    .stateValues.value.tree;
            let newValue = [newW, newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            wsFound.push(newW);
            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // all individual options selected in first variants
        expect([...new Set(wsFound.slice(0, 10))].sort()).eqls(valuesW);
        expect([...new Set(xsFound.slice(0, 10))].sort()).eqls(valuesX);
        expect([...new Set(ysFound.slice(0, 10))].sort()).eqls(valuesY);
        expect([...new Set(zsFound.slice(0, 10))].sort()).eqls(valuesZ);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 15; ind += 3) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newW =
                stateVariables[await resolvePathToNodeIdx("w[1]")].stateValues
                    .value;
            let newX =
                stateVariables[await resolvePathToNodeIdx("x[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("y[1]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("z[1][1]")]
                    .stateValues.value.tree;
            let newValue = [newW, newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("select multiple", async () => {
        let valuesSingle = ["w", "x", "y", "z"];
        let valuesFound: string[] = [];
        let values: string[] = [];
        for (let x of valuesSingle) {
            for (let y of valuesSingle) {
                if (y == x) {
                    continue;
                }
                for (let z of valuesSingle) {
                    if (z === x || z === y) {
                        continue;
                    }
                    values.push([x, y, z].join(","));
                }
            }
        }

        let numVariants = values.length;

        let xsFound: string[] = [],
            ysFound: string[] = [],
            zsFound: string[] = [];

        let doenetML = `
        <select name="xs" numToSelect="3">w x y z</select>
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1]")]
                    .stateValues.value.tree;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // all individual options selected in first variants
        expect([...new Set(xsFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(ysFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(zsFound.slice(0, 10))].sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1]")]
                    .stateValues.value.tree;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("select multiple with replacement", async () => {
        let valuesSingle = ["x", "y", "z"];
        let valuesFound: string[] = [];
        let values: string[] = [];
        for (let x of valuesSingle) {
            for (let y of valuesSingle) {
                for (let z of valuesSingle) {
                    values.push([x, y, z].join(","));
                }
            }
        }

        let numVariants = values.length;
        let xsFound: string[] = [],
            ysFound: string[] = [],
            zsFound: string[] = [];

        let doenetML = `
        <select name="xs" numToSelect="3" withReplacement>x y z</select>
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1]")]
                    .stateValues.value.tree;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // all individual options selected in first variants
        expect([...new Set(xsFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(ysFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(zsFound.slice(0, 10))].sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1]")]
                    .stateValues.value.tree;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("select multiple from sequence", async () => {
        let valuesSingle = ["w", "x", "y", "z"];
        let valuesFound: string[] = [];
        let values: string[] = [];
        for (let x of valuesSingle) {
            for (let y of valuesSingle) {
                if (y == x) {
                    continue;
                }
                for (let z of valuesSingle) {
                    if (z === x || z === y) {
                        continue;
                    }
                    values.push([x, y, z].join(","));
                }
            }
        }

        let numVariants = values.length;
        let xsFound: string[] = [],
            ysFound: string[] = [],
            zsFound: string[] = [];

        let doenetML = `
        <selectFromSequence type="letters" name="xs" numToSelect="3" from="w" to="z" />
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // all individual options selected in first variants
        expect([...new Set(xsFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(ysFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(zsFound.slice(0, 10))].sort()).eqls(valuesSingle);

        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newValue = [newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("select multiple from sequence with replacement", async () => {
        let valuesSingle = ["x", "y", "z"];
        let valuesFound: string[] = [];
        let values: string[] = [];
        for (let x of valuesSingle) {
            for (let y of valuesSingle) {
                for (let z of valuesSingle) {
                    values.push([x, y, z].join(","));
                }
            }
        }

        let numVariants = values.length;
        let xsFound: string[] = [],
            ysFound: string[] = [],
            zsFound: string[] = [];

        let doenetML = `
        <selectFromSequence type="letters" name="xs" numToSelect="3" withReplacement from="x" to="z" />
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // all individual options selected in first variants
        expect([...new Set(xsFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(ysFound.slice(0, 10))].sort()).eqls(valuesSingle);
        expect([...new Set(zsFound.slice(0, 10))].sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newValue = [newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("limit variants", async () => {
        let valuesSingle = ["u", "v", "w", "x", "y", "z"];
        let valuesFound: string[] = [];
        let values: string[] = [];
        for (let w of valuesSingle) {
            for (let x of valuesSingle) {
                for (let y of valuesSingle) {
                    for (let z of valuesSingle) {
                        values.push([w, x, y, z].join(","));
                    }
                }
            }
        }

        let numVariants = 10;
        let wsFound: string[] = [],
            xsFound: string[] = [],
            ysFound: string[] = [],
            zsFound: string[] = [];

        let doenetML = `
        <variantControl numVariants="10" />
        <selectFromSequence type="letters" name="xs" numToSelect="4" withReplacement from="u" to="z" />
      `;

        // get unique values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newW =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[4]")].stateValues
                    .value;
            let newValue = [newW, newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            wsFound.push(newW);
            xsFound.push(newX);
            ysFound.push(newY);
            zsFound.push(newZ);
        }

        // most individual options selected in first variants
        expect([...new Set(wsFound)].length).greaterThan(4);
        expect([...new Set(xsFound)].length).greaterThan(4);
        expect([...new Set(ysFound)].length).greaterThan(4);
        expect([...new Set(zsFound)].length).greaterThan(4);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= 2 * numVariants + 3; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            // to wait for page to load

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newW =
                stateVariables[await resolvePathToNodeIdx("xs[1]")].stateValues
                    .value;
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[2]")].stateValues
                    .value;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[3]")].stateValues
                    .value;
            let newZ =
                stateVariables[await resolvePathToNodeIdx("xs[4]")].stateValues
                    .value;
            let newValue = [newW, newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of selectFromSequence", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <select name="x">
        <option>
          <selectFromSequence from="1" to="2" />
        </option>
        <option>
          <selectFromSequence from="101" to="103" />
        </option>
        <option>
          <selectFromSequence from="201" to="204" />
        </option>
      </select>
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newValue =
                stateVariables[await resolvePathToNodeIdx("x[1][1][1]")]
                    .stateValues.value;
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newValue =
                stateVariables[await resolvePathToNodeIdx("x[1][1][1]")]
                    .stateValues.value;
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of selects", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <select name="x">
        <option>
          <select>1 2</select>
        </option>
        <option>
          <select>101 102 103</select>
        </option>
        <option>
          <select>201 202 203 204</select>
        </option>
      </select>
      `;
        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newValue =
                stateVariables[await resolvePathToNodeIdx("x[1][1][1][1]")]
                    .stateValues.value.tree;
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newValue =
                stateVariables[await resolvePathToNodeIdx("x[1][1][1][1]")]
                    .stateValues.value.tree;
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of paragraphs of selects/selectFromSequence", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <select name="x">
        <option>
          <p><select name="n">1 2</select></p>
        </option>
        <option>
         <p><selectFromSequence name="n" from="101" to="103"/></p>
        </option>
        <option>
          <p><select name="n">201 202 203 204</select></p>
        </option>
      </select>
      `;
        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let mathOrNumberComponent =
                stateVariables[await resolvePathToNodeIdx("x.n[1]")];
            if (mathOrNumberComponent.componentType === "group") {
                mathOrNumberComponent =
                    stateVariables[await resolvePathToNodeIdx("x.n[1][1]")];
            }

            let newValue = mathOrNumberComponent.stateValues.value;
            if (newValue.tree !== undefined) {
                newValue = newValue.tree;
            }
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let mathOrNumberComponent =
                stateVariables[await resolvePathToNodeIdx("x.n[1]")];
            if (mathOrNumberComponent.componentType === "group") {
                mathOrNumberComponent =
                    stateVariables[await resolvePathToNodeIdx("x.n[1][1]")];
            }

            let newValue = mathOrNumberComponent.stateValues.value;
            if (newValue.tree !== undefined) {
                newValue = newValue.tree;
            }
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of selects, select multiple", async () => {
        let valuesFound: string[] = [];
        let valuesSingle = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let values: string[] = [];
        for (let x of valuesSingle) {
            for (let y of valuesSingle) {
                if (Math.abs(y - x) > 5) {
                    values.push([x, y].join(","));
                }
            }
        }
        let numVariants = values.length;

        let doenetML = `
      <asList>
        <select name="xs" numToSelect="2">
          <option>
            <select>1 2</select>
          </option>
          <option>
            <select>101 102 103</select>
          </option>
          <option>
            <select>201 202 203 204</select>
          </option>
        </select>
      </asList>
      `;

        // get unique values in first variants
        for (let ind = 1; ind <= 20; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1][1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1][1][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 20; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let newX =
                stateVariables[await resolvePathToNodeIdx("xs[1][1][1][1]")]
                    .stateValues.value.tree;
            let newY =
                stateVariables[await resolvePathToNodeIdx("xs[2][1][1][1]")]
                    .stateValues.value.tree;
            let newValue = [newX, newY].join(",");
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("deeper nesting of selects/selectFromSequence", async () => {
        let doenetML = `
    <variantControl numVariants="24" />
    <select name="s">
      <option>
        <p name="p">Favorite color:
          <select>
            <option>
              <select type="text">red orange yellow magenta maroon fuchsia scarlet</select>
            </option>
            <option>
              <select type="text">green chartreuse turquoise</select>
            </option>
            <option>
              <select type="text">white black</select>
            </option>
          </select>
        </p>
      </option>
      <option>
        <p name="p">Selected number:
          <select>
            <option><selectFromSequence from="1000" to="1010" /></option>
            <option><selectFromSequence from="-1000" to="-995" /></option>
          </select>
        </p>
      </option>
      <option>
        <p name="p">Chosen letter: <selectFromSequence type="letters" from="a" to="o" /></p>
      </option>
      <option>
        <p name="p">Variable:
          <select>u v w x y z</select>
        </p>
      </option>
    </select>
    `;

        let valuesFound: string[] = [];

        let colorsA = [
            "red",
            "orange",
            "yellow",
            "magenta",
            "maroon",
            "fuchsia",
            "scarlet",
        ];
        let colorsB = ["green", "chartreuse", "turquoise"];
        let colorsC = ["white", "black"];
        let allColors = [...colorsA, ...colorsB, ...colorsC];

        let letters = [...Array(15)].map((_, i) =>
            String.fromCharCode("a".charCodeAt(0) + i),
        );

        let variables = ["u", "v", "w", "x", "y", "z"];

        let categories = [
            "Favorite color:",
            "Selected number:",
            "Chosen letter:",
            "Variable:",
        ];

        let numVariants = 24;

        let colorsFound: string[] = [];
        let numbersFound: number[] = [];
        let lettersFound: string[] = [];
        let variablesFound: string[] = [];
        let categoriesFound: string[] = [];

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let category =
                stateVariables[
                    await resolvePathToNodeIdx("s.p")
                ].activeChildren[0].trim();
            expect(categories.includes(category)).eq(true);

            let component =
                stateVariables[
                    stateVariables[
                        await resolvePathToNodeIdx("s.p")
                    ].activeChildren.filter((x) => x.componentIdx)[0]
                        .componentIdx
                ];
            let newValue = component.stateValues.value;
            if (category === categories[0]) {
                expect(allColors.includes(newValue)).eq(true);
                expect(colorsFound.includes(newValue)).eq(false);
                colorsFound.push(newValue);
            } else if (category === categories[1]) {
                let validNum =
                    Number.isInteger(newValue) &&
                    ((newValue >= 1000 && newValue <= 1010) ||
                        (newValue >= -1000 && newValue <= -995));
                expect(validNum).eq(true);
                expect(numbersFound.includes(newValue)).eq(false);
                numbersFound.push(newValue);
            } else if (category === categories[2]) {
                expect(letters.includes(newValue)).eq(true);
                expect(lettersFound.includes(newValue)).eq(false);
                lettersFound.push(newValue);
            } else {
                newValue = newValue.tree;
                expect(variables.includes(newValue)).eq(true);
                expect(variablesFound.includes(newValue)).eq(false);
                variablesFound.push(newValue);
            }

            let combinedValue = [category, newValue].join(",");

            expect(valuesFound.includes(combinedValue)).eq(false);
            valuesFound.push(combinedValue);

            categoriesFound.push(category);
        }

        expect([...new Set(categoriesFound)].sort()).eqls([
            "Chosen letter:",
            "Favorite color:",
            "Selected number:",
            "Variable:",
        ]);

        let colorsFoundSet = new Set(colorsFound);
        expect(colorsFoundSet.size).gte(3);

        expect(numbersFound.length).gte(5);

        expect(lettersFound.length).gte(5);
        expect(variablesFound.length).gte(2);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let category =
                stateVariables[
                    await resolvePathToNodeIdx("s.p")
                ].activeChildren[0].trim();
            let component =
                stateVariables[
                    stateVariables[
                        await resolvePathToNodeIdx("s.p")
                    ].activeChildren.filter((x) => x.componentIdx)[0]
                        .componentIdx
                ];
            let newValue = component.stateValues.value;
            if (newValue.tree !== undefined) {
                newValue = newValue.tree;
            }
            let combinedValue = [category, newValue].join(",");
            expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("select problems of selects/selectFromSequence", async () => {
        let doenetML = `
    <variantControl numVariants="6"/>
    <select name="s">
      <option>
        <problem name="problem"><title>Favorite color</title>
          <select name="s2">
            <option>
              <p name="p">I like 
                <select type="text" name="color">red orange yellow magenta maroon fuchsia scarlet</select>
              </p>
            </option>
            <option>
              <p name="p">You like
                <select type="text" name="color">green chartreuse turquoise</select>
              </p>
            </option>
          </select>
          <p>Enter the color $s2.p.color: <answer name="ans" type="text">$s2.p.color</answer></p>
        </problem>
      </option>
      <option>
        <problem name="problem"><title>Selected word</title>
          <select name="s2">
            <option><p name="p">Verb: <select type="text" name="word">run walk jump skip</select></p></option>
            <option><p name="p">Adjective: <select type="text" name="word">soft scary large empty residual limitless</select></p></option>
          </select>
          <p>Enter the word $s2.p.p.word: <answer name="ans" type="text">$s2.p.word</answer></p>
        </problem>
      </option>
      <option>
        <problem name="problem"><title>Chosen letter</title>
          <p>Letter
            <selectFromSequence  name="l" type="letters" from="a" to="j" />
          </p>
          <p>Enter the letter $l: <answer name="ans" type="text">$l</answer></p>
        </problem>
      </option>
    </select>
    `;

        let valuesFound: string[] = [];

        let colorsA = [
            "red",
            "orange",
            "yellow",
            "magenta",
            "maroon",
            "fuchsia",
            "scarlet",
        ];
        let colorsB = ["green", "chartreuse", "turquoise"];
        let allColors = [...colorsA, ...colorsB];

        let wordsA = ["run", "walk", "jump", "skip"];
        let wordsB = [
            "soft",
            "scary",
            "large",
            "empty",
            "residual",
            "limitless",
        ];
        let allWords = [...wordsA, ...wordsB];

        let letters = [...Array(10)].map((_, i) =>
            String.fromCharCode("a".charCodeAt(0) + i),
        );

        let categories = ["Favorite color", "Selected word", "Chosen letter"];

        let numVariants = 6;

        let categoriesFound: string[] = [];
        let colorsFound: string[] = [];
        let wordsFound: string[] = [];
        let lettersFound: string[] = [];

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let textinputIdx =
                stateVariables[await resolvePathToNodeIdx(`s.problem.ans`)]
                    .stateValues.inputChildren[0].componentIdx;
            let category =
                stateVariables[await resolvePathToNodeIdx("s.problem")]
                    .stateValues.title;
            expect(categories.includes(category)).eq(true);

            let component =
                stateVariables[
                    stateVariables[
                        stateVariables[
                            await resolvePathToNodeIdx("s.problem")
                        ].activeChildren.filter((x) => x.componentIdx)[1]
                            .componentIdx
                    ].activeChildren[1].componentIdx
                ];
            let newValue = component.stateValues.value;
            if (category === categories[0]) {
                expect(allColors.includes(newValue)).eq(true);
                expect(colorsFound.includes(newValue)).eq(false);
                colorsFound.push(newValue);
            } else if (category === categories[1]) {
                expect(allWords.includes(newValue)).eq(true);
                expect(wordsFound.includes(newValue)).eq(false);
                wordsFound.push(newValue);
            } else if (category === categories[2]) {
                expect(letters.includes(newValue)).eq(true);
                expect(lettersFound.includes(newValue)).eq(false);
                lettersFound.push(newValue);
            }

            let combinedValue = [category, newValue].join(",");

            expect(valuesFound.includes(combinedValue)).eq(false);
            valuesFound.push(combinedValue);

            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            categoriesFound.push(category);

            await updateTextInputValue({
                text: `${newValue}`,
                componentIdx: textinputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`s.problem.ans`),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.submittedResponses,
            ).eqls([newValue]);
            expect(stateVariables[textinputIdx].stateValues.value).eq(newValue);

            await updateTextInputValue({
                text: `${newValue}X`,
                componentIdx: textinputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`s.problem.ans`),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.creditAchieved,
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.submittedResponses,
            ).eqls([newValue + "X"]);
            expect(stateVariables[textinputIdx].stateValues.value).eq(
                newValue + "X",
            );

            await updateTextInputValue({
                text: `${newValue}`,
                componentIdx: textinputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`s.problem.ans`),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("s.problem.ans")]
                    .stateValues.submittedResponses,
            ).eqls([newValue]);
            expect(stateVariables[textinputIdx].stateValues.value).eq(newValue);
        }

        let colorsFoundSet = new Set(colorsFound);
        expect(colorsFoundSet.size).gte(1);

        let wordsFoundSet = new Set(wordsFound);
        expect(wordsFoundSet.size).gte(1);

        let lettersFoundSet = new Set(lettersFound);
        expect(lettersFoundSet.size).gte(1);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 6; ind += 2) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let category =
                stateVariables[await resolvePathToNodeIdx("s.problem")]
                    .stateValues.title;
            let component =
                stateVariables[
                    stateVariables[
                        stateVariables[
                            await resolvePathToNodeIdx("s.problem")
                        ].activeChildren.filter((x) => x.componentIdx)[1]
                            .componentIdx
                    ].activeChildren[1].componentIdx
                ];
            let newValue = component.stateValues.value;
            let combinedValue = [category, newValue].join(",");
            expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("can get unique with repeat without variants", async () => {
        let doenetML = `
    <selectFromSequence name="x" length="3" />
    <setup><sequence name="seq" type="letters" length="$n" /></setup>
    <repeat for="$seq" name="r" valueName="v">
        <p name="p">letter: $v</p>
    </repeat>
    <p>N: <mathInput name="n" prefill="1" /></p>
    `;

        // get all values before they repeat in next variants
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(stateVariables[await resolvePathToNodeIdx("r[2].p")]).be
                .undefined;

            await updateMathInputValue({
                latex: "3",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                    .text,
            ).eq("letter: b");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[3].p")].stateValues
                    .text,
            ).eq("letter: c");

            expect(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            ).eq(sampledValues[ind - 1]);
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[1].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("a");
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[2].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("b");
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[3].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("c");
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c"]);

            await updateMathInputValue({
                latex: "4",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                    .text,
            ).eq("letter: b");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[3].p")].stateValues
                    .text,
            ).eq("letter: c");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[4].p")].stateValues
                    .text,
            ).eq("letter: d");
        }
        // first three are in a random order
        expect(sampledValues.slice(0, 3).sort()).eqls([1, 2, 3]);
        // then that order is repeated
        expect(sampledValues[3]).eq(sampledValues[0]);
    });

    it("can get unique with repeatForSequence without variants", async () => {
        let doenetML = `
    <selectFromSequence name="x" length="3" />
    <setup><sequence name="seq" type="letters" length="$n" /></setup>
    <repeatForSequence name="r" valueName="v" type="letters" length="$n">
        <p name="p">letter: $v</p>
    </repeatForSequence>
    <p>N: <mathInput name="n" prefill="1" /></p>
    `;

        // get all values before they repeat in next variants
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(stateVariables[await resolvePathToNodeIdx("r[2].p")]).be
                .undefined;

            await updateMathInputValue({
                latex: "3",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                    .text,
            ).eq("letter: b");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[3].p")].stateValues
                    .text,
            ).eq("letter: c");

            expect(
                stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues
                    .value,
            ).eq(sampledValues[ind - 1]);
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[1].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("a");
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[2].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("b");
            expect(
                stateVariables[
                    stateVariables[await resolvePathToNodeIdx("r[3].p")]
                        .activeChildren[1].componentIdx
                ].stateValues.value,
            ).eq("c");
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c"]);

            await updateMathInputValue({
                latex: "4",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("r[1].p")].stateValues
                    .text,
            ).eq("letter: a");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[2].p")].stateValues
                    .text,
            ).eq("letter: b");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[3].p")].stateValues
                    .text,
            ).eq("letter: c");
            expect(
                stateVariables[await resolvePathToNodeIdx("r[4].p")].stateValues
                    .text,
            ).eq("letter: d");
        }
        // first three are in a random order
        expect(sampledValues.slice(0, 3).sort()).eqls([1, 2, 3]);
        // then that order is repeated
        expect(sampledValues[3]).eq(sampledValues[0]);
    });

    async function test_shuffled_choice_input(
        doenetML: string,
        insiderAnswer = false,
    ) {
        let ordersFound: string[] = [];
        let choices = ["red", "blue", "green"];

        // get all orders in first 6 variants
        for (let ind = 1; ind <= 6; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let ciIdx;
            if (insiderAnswer) {
                ciIdx =
                    stateVariables[await resolvePathToNodeIdx("ans")]
                        .stateValues.inputChildren[0].componentIdx;
            } else {
                ciIdx = await resolvePathToNodeIdx("ci");
            }

            let choiceOrder = stateVariables[ciIdx].stateValues.choiceOrder;
            let selectedOrder = choiceOrder.join(",");
            expect(ordersFound.includes(selectedOrder)).eq(false);
            ordersFound.push(selectedOrder);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            for (let i = 0; i < 3; i++) {
                await updateSelectedIndices({
                    componentIdx: ciIdx,
                    selectedIndices: [i + 1],
                    core,
                });
                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                expect(stateVariables[ciIdx].stateValues.selectedValues).eqls([
                    choices[choiceOrder[i] - 1],
                ]);
            }

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [1],
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[ciIdx].stateValues.selectedValues).eqls([
                choices[choiceOrder[0] - 1],
            ]);
        }

        // 7th variant repeats first order
        let ind = 7;
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let ciIdx;
        if (insiderAnswer) {
            ciIdx =
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .inputChildren[0].componentIdx;
        } else {
            ciIdx = await resolvePathToNodeIdx("ci");
        }
        let choiceOrder = stateVariables[ciIdx].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",");
        expect(selectedOrder).eq(ordersFound[0]);
    }

    it("single shuffled choiceInput", async () => {
        let doenetML = `
    <choiceInput name="ci" shuffleOrder>
      <choice>red</choice>
      <choice>blue</choice>
      <choice>green</choice>
    </choiceInput>

    `;

        await test_shuffled_choice_input(doenetML);
    });

    it("single shuffled choiceInput, choices copied in", async () => {
        let doenetML = `
    <choice name="red">red</choice>
    <choice name="blue">blue</choice>
    <choice name="green">green</choice>

    <choiceInput name="ci" shuffleOrder>
      <choice extend="$red" />
      <choice extend="$blue" />
      <choice extend="$green" />
    </choiceInput>
    `;

        await test_shuffled_choice_input(doenetML);
    });

    it("single shuffled choiceInput sugared inside answer", async () => {
        let doenetML = `
    <answer name="ans" shuffleOrder>
      <choice credit="1">red</choice>
      <choice>blue</choice>
      <choice>green</choice>
    </answer>

    `;

        await test_shuffled_choice_input(doenetML, true);
    });

    it("shuffled choiceInput with selectFromSequence in choices", async () => {
        let doenetML = `
    <choiceInput name="ci" shuffleOrder>
      <choice><selectFromSequence from="1" to="2" name="n" /></choice>
      <choice><selectFromSequence type="letters" from="a" to="b" name="l" /></choice>
    </choiceInput>
    `;

        let selectionsFound: string[] = [];

        // get all options in first 8 variants
        for (let ind = 1; ind <= 8; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let choiceOrder =
                stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                    .choiceOrder;
            let n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            let l =
                stateVariables[await resolvePathToNodeIdx("l[1]")].stateValues
                    .value;
            let choices = [n.toString(), l];
            let selectedOption = [...choiceOrder, ...choices].join(",");
            expect(selectionsFound.includes(selectedOption)).eq(false);
            selectionsFound.push(selectedOption);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h"]);

            for (let i = 0; i < 2; i++) {
                await updateSelectedIndices({
                    componentIdx: await resolvePathToNodeIdx("ci"),
                    selectedIndices: [i + 1],
                    core,
                });

                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                expect(
                    stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                        .selectedValues,
                ).eqls([choices[choiceOrder[i] - 1]]);
            }

            await updateSelectedIndices({
                componentIdx: await resolvePathToNodeIdx("ci"),
                selectedIndices: [1],
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                    .selectedValues,
            ).eqls([choices[choiceOrder[0] - 1]]);
        }

        let ind = 9;
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let choiceOrder =
            stateVariables[await resolvePathToNodeIdx("ci")].stateValues
                .choiceOrder;
        let n =
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value;
        let l =
            stateVariables[await resolvePathToNodeIdx("l[1]")].stateValues
                .value;
        let choices = [n.toString(), l];
        let selectedOption = [...choiceOrder, ...choices].join(",");
        expect(selectedOption).eq(selectionsFound[0]);
    });

    async function test_shuffle(doenetML: string) {
        let ordersFound: string[] = [];
        let colors = ["red", "blue", "green"];

        // get all orders in first 6 variants
        for (let ind = 1; ind <= 6; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let componentOrder =
                stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                    .componentOrder;
            expect([...componentOrder].sort()).eqls([1, 2, 3]);

            let selectedOrder = componentOrder.join(",");
            expect(ordersFound.includes(selectedOrder)).eq(false);
            ordersFound.push(selectedOrder);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            expect(
                stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                    .text,
            ).eq(componentOrder.map((x) => colors[x - 1]).join(", "));
        }

        // 7th variant repeats first order
        let ind = 7;
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;
        let selectedOrder = componentOrder.join(",");
        expect(selectedOrder).eq(ordersFound[0]);

        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(componentOrder.map((x) => colors[x - 1]).join(", "));
    }

    it("shuffle", async () => {
        let doenetML = `
    <p name="pList"><shuffle name="sh">
      <text>red</text>
      <text>blue</text>
      <text>green</text>
    </shuffle></p>

    `;

        await test_shuffle(doenetML);
    });

    it("shuffle, copy in components", async () => {
        let doenetML = `

    <text name="red">red</text>
    <text name="blue">blue</text>
    <text name="green">green</text>

    <p name="pList"><shuffle name="sh">
      <text extend="$red" />
      <text extend="$blue" />
      <text extend="$green" />
    </shuffle></p>

    `;

        await test_shuffle(doenetML);
    });

    async function test_document_problem_unique({
        doenetML,
        mOptions,
        nOptions,
    }: {
        doenetML: string;
        mOptions?: number[];
        nOptions?: number[];
    }) {
        // Note: mOptions must be length 2 if exists
        // nOptions must be length 3 if exists

        // get all 6 options and then they repeat
        const msFound: number[] = [];
        const nsFound: number[] = [];

        for (let ind = 1; ind <= 12; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let mathInputIdx =
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Idx =
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .inputChildren[0].componentIdx;

            const m =
                stateVariables[await resolvePathToNodeIdx("m[1]")].stateValues
                    .value;
            msFound.push(m);
            const n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            nsFound.push(n);

            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: mathInput2Idx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .submittedResponses[0].tree,
            ).eq(n);

            await updateMathInputValue({
                latex: `${m}1`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}1`,
                componentIdx: mathInput2Idx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .creditAchieved,
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .creditAchieved,
            ).eq(0);

            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m * 10 + 1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .submittedResponses[0].tree,
            ).eq(n * 10 + 1);

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: mathInput2Idx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans2")].stateValues
                    .submittedResponses[0].tree,
            ).eq(n);
        }

        // get the m values repeated three times in the first six, then that sequence repeats
        if (mOptions) {
            const tripleSort = [...mOptions, ...mOptions, ...mOptions].sort(
                (a, b) => a - b,
            );
            expect(msFound.slice(0, 6).sort((a, b) => a - b)).eqls(tripleSort);
        }
        expect(msFound.slice(6, 12)).eqls(msFound.slice(0, 6));

        // get the n values repeated twice times in the first six, then that sequence repeats
        if (nOptions) {
            const doubleSort = [...nOptions, ...nOptions].sort((a, b) => a - b);
            expect(nsFound.slice(0, 6).sort((a, b) => a - b)).eqls(doubleSort);
        }
        expect(nsFound.slice(6, 12)).eqls(nsFound.slice(0, 6));
    }

    it("document and problems with unique variants", async () => {
        let doenetML = `
    <variantControl uniqueVariants />
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="1" to="2" name="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="3" to="5" name="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({
            doenetML,
            mOptions: [1, 2],
            nOptions: [3, 4, 5],
        });
    });

    it("document and problems with unique variants, even without specifying in document", async () => {
        let doenetML = `
    <problem>
      <variantControl />
      <p>Enter <selectFromSequence from="1" to="2" name="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl />
      <p>Enter <selectFromSequence from="3" to="5" name="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({
            doenetML,
            mOptions: [1, 2],
            nOptions: [3, 4, 5],
        });
    });

    it("document and problems with unique variants, even without specifying in document or problem", async () => {
        let doenetML = `
    <problem>
      <p>Enter <selectFromSequence from="1" to="2" name="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <p>Enter <selectFromSequence from="3" to="5" name="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({
            doenetML,
            mOptions: [1, 2],
            nOptions: [3, 4, 5],
        });
    });

    it("document with unique variants, from problems without unique variants", async () => {
        let doenetML = `
    <problem>
      <variantControl numVariants="2" uniqueVariants="false" />
      <p>Enter <selectFromSequence from="1000000" to="2000000" name="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl numVariants="3" uniqueVariants="false" />
      <p>Enter <selectFromSequence from="3000000" to="5000000" name="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({ doenetML });
    });

    it("document inherits variants from single problem with unique variants", async () => {
        let doenetML = `
        <problem>
          <variantControl variantNames="first second third" />
          <p>Enter <selectFromSequence from="5" to="7" name="m" />:
            <answer name="ans">$m</answer>
          </p>
        </problem>
        `;

        // get all 3 options before they repeat
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let mathInputIdx =
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .inputChildren[0].componentIdx;

            const m =
                stateVariables[await resolvePathToNodeIdx("m[1]")].stateValues
                    .value;
            sampledValues.push(m);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["first", "second", "third"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantName,
            ).eq(["first", "second", "third"][(ind - 1) % 3]);

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m);

            await updateMathInputValue({
                latex: `${m}1`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(0);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m * 10 + 1);

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: mathInputIdx,
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .creditAchieved,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .submittedResponses[0].tree,
            ).eq(m);
        }
        // first three are in a random order
        expect(sampledValues.slice(0, 3).sort()).eqls([5, 6, 7]);
        // then that order is repeated
        expect(sampledValues[3]).eq(sampledValues[0]);
    });

    it("no variant control, 1 unique variant", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: "hello",
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(["a"]);
    });

    it("no variant control, single select", async () => {
        let doenetML = `<select name="x">u v w</select>`;
        let values = ["u", "v", "w"];

        // get all values before they repeat in next variants
        const sampledValues: string[] = [];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("x[1][1]")]
                    .stateValues.value.tree,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c"]);
        }

        // first three are in a random order
        expect(sampledValues.slice(0, 3).sort()).eqls(values);
        // then that order is repeated
        expect(sampledValues[3]).eq(sampledValues[0]);
    });

    it("no variant control, select and selectFromSequence", async () => {
        let doenetML = `
        <select name="x">u v w</select>
        <selectFromSequence name="n" length="3" />
      `;
        let values = ["u", "v", "w"];

        // get all values before they repeat
        const sampledLetters: string[] = [];
        const sampledNumbers: number[] = [];
        for (let ind = 1; ind <= 18; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledLetters.push(
                stateVariables[await resolvePathToNodeIdx("x[1][1]")]
                    .stateValues.value.tree,
            );
            sampledNumbers.push(
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(9);
        }

        // get the values repeated three times in the first 9, then that sequence repeats
        expect(sampledLetters.slice(0, 9).sort()).eqls(
            [...values, ...values, ...values].sort(),
        );
        expect(sampledNumbers.slice(0, 9).sort()).eqls([
            1, 1, 1, 2, 2, 2, 3, 3, 3,
        ]);
        expect(sampledLetters.slice(9, 18)).eqls(sampledLetters.slice(0, 9));
        expect(sampledNumbers.slice(9, 18)).eqls(sampledNumbers.slice(0, 9));
    });

    it("no variant control, 100 is still unique variants", async () => {
        let doenetML = `
        <selectFromSequence name="n" length="100" />
      `;
        // first 100 values are not repeated, then order repeats
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 102; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            expect(n).gte(1).lte(100);
            if (ind <= 100) {
                expect(sampledValues.includes(n)).eq(false);
            } else {
                expect(n).eq(sampledValues[ind - 101]);
            }
            sampledValues.push(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(100);
        }
    });

    it("no variant control, 101 is still unique, though random selection", async () => {
        let doenetML = `
        <selectFromSequence name="n" length="101" />
      `;

        // first 100 values are not repeated, then order repeats
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 102; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            expect(n).gte(1).lte(101);
            if (ind <= 100) {
                expect(sampledValues.includes(n)).eq(false);
            } else {
                expect(n).eq(sampledValues[ind - 101]);
            }
            sampledValues.push(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(100);
        }
    });

    it("no variant control, 1000 is still unique, values spread out", async () => {
        let doenetML = `
        <selectFromSequence name="n" length="1000" />
      `;

        // first 100 values are not repeated, then order repeats
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 102; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            expect(n).gte(1).lte(1000);
            if (ind <= 100) {
                expect(sampledValues.includes(n)).eq(false);
            } else {
                expect(n).eq(sampledValues[ind - 101]);
            }
            sampledValues.push(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(100);
        }

        // find values in each group of 50
        for (let i = 0; i <= 950; i += 50) {
            expect(sampledValues.findIndex((v) => v > i && v <= i + 50)).not.eq(
                -1,
            );
        }
    });

    it("limit variants from 100, still unique, values spread out", async () => {
        let doenetML = `
        <variantControl numVariants="10" />
        <selectFromSequence name="n" length="100" />
      `;

        // first 10 values are not repeated, then order repeats
        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 20; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const n =
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value;
            expect(n).gte(1).lte(100);
            if (ind <= 10) {
                expect(sampledValues.includes(n)).eq(false);
            } else {
                expect(n).eq(sampledValues[ind - 11]);
            }
            sampledValues.push(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(10);
        }

        // find values in each group of 20
        for (let i = 0; i <= 80; i += 20) {
            expect(sampledValues.findIndex((v) => v > i && v <= i + 20)).not.eq(
                -1,
            );
        }
    });

    it("increasing variant limit preserves the identity of original variants", async () => {
        let doenetML4 = `
        <variantControl numVariants="4" />
        <selectFromSequence name="n" length="100" />
      `;

        let doenetML6 = `
      <variantControl numVariants="6" />
      <selectFromSequence name="n" length="100" />
    `;

        let doenetML100 = `
  <selectFromSequence name="n" length="100" />
`;

        const sampledValues: number[] = [];
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: doenetML4,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            sampledValues.push(
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(4);
        }

        // first four variants match numVariants=4 case
        for (let ind = 1; ind <= 6; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: doenetML6,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            if (ind <= 4) {
                expect(
                    stateVariables[await resolvePathToNodeIdx("n[1]")]
                        .stateValues.value,
                ).eq(sampledValues[ind - 1]);
            } else {
                sampledValues.push(
                    stateVariables[await resolvePathToNodeIdx("n[1]")]
                        .stateValues.value,
                );
            }
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(6);
        }

        // first six variants match numVariants=6 case
        for (let ind = 1; ind <= 6; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: doenetML100,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value,
            ).eq(sampledValues[ind - 1]);

            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(100);
        }
    });

    it("no variant control, problem with 3 selects", async () => {
        // Catch bug in enumerateCombinations
        // where was indirectly overwriting numVariantsByDescendant

        let doenetML = `
        <problem>
          <select type="number" name="a">1 2</select>
          <select type="number" name="b">3 4</select>
          <select type="number" name="c">5 6</select>
        </problem>
      `;

        let values = [135, 246, 145, 236, 136, 245, 146, 235];

        // get each value exactly one
        let valuesFound: number[] = [];
        for (let ind = 1; ind <= 8; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let a =
                stateVariables[await resolvePathToNodeIdx("a[1][1]")]
                    .stateValues.value;
            let b =
                stateVariables[await resolvePathToNodeIdx("b[1][1]")]
                    .stateValues.value;
            let c =
                stateVariables[await resolvePathToNodeIdx("c[1][1]")]
                    .stateValues.value;

            let val = a * 100 + b * 10 + c;
            valuesFound.push(val);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants.length,
            ).eq(8);
        }

        expect(valuesFound.sort()).eqls(values.sort());
    });

    it("unless variant determines seed, sample random/prime numbers does not add variants", async () => {
        // no other variants so get 1 variant
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <sampleRandomNumbers type="uniform" from="1" to="10" name="n" />
        `,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        )
            .gte(1)
            .lte(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(["a"]);

        // just get 10 variants from select
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <samplePrimeNumbers minValue="1" maxValue="10000" name="n" />
        <selectFromSequence from="1" to="10" />
        `,
        }));
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        )
            .gte(1)
            .lte(10000);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants.length,
        ).eq(10);

        // when variant determines seed, get 100 different variants
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
                <sampleRandomNumbers type="uniform" from="1" to="10" variantDeterminesSeed name="n" />
                `,
        }));
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        )
            .gte(1)
            .lte(10);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants.length,
        ).eq(100);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
                <samplePrimeNumbers minValue="1" maxValue="10000" variantDeterminesSeed name="n" />
                `,
        }));
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        )
            .gte(1)
            .lte(10000);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants.length,
        ).eq(100);
    });
});
