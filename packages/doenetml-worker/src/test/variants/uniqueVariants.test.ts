import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
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
        <variantControl uniqueVariants />
        <select assignNames="x">u v w x y z</select>
      `;

        // get all values in order and they repeat in next variants
        for (let ind = 1; ind <= 18; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value.tree).eq(
                values[(ind - 1) % 6],
            );
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);
        }
    });

    it("single selectFromSequence", async () => {
        let doenetML = `
        <variantControl uniqueVariants />
        <selectFromSequence assignNames="x" length="5" />
      `;
        // get all values in order and they repeat in next variants
        for (let ind = 1; ind <= 15; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value).eq(
                ((ind - 1) % 5) + 1,
            );
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e"]);
        }
    });

    it("selectFromSequence with excludes", async () => {
        let doenetML = `
        <variantControl uniqueVariants />
        <selectFromSequence assignNames="x" type="letters" from="c" to="m" step="2" exclude="g k" />
      `;
        // get all values in order and they repeat in next variants
        for (let ind = 1; ind <= 12; ind++) {
            let letters = ["c", "e", "i", "m"];

            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value).eq(
                letters[(ind - 1) % 4],
            );
        }
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
      <variantControl uniqueVariants />
      <asList>
        <selectFromSequence type="letters" assignNames="w" from="m" to="n" />
        <select assignNames="x">x y z</select>
        <selectFromSequence assignNames="y" from="2" to="4" />
        <select assignNames="z">3 7</select>
      </asList>
      `;

        // get all values in variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newW = stateVariables["/w"].stateValues.value;
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value.tree;
            let newValue = [newW, newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 3) {
                wsFound.push(newW);
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(wsFound.slice(0, 2).sort()).eqls(valuesW);
        expect(xsFound.sort()).eqls(valuesX);
        expect(ysFound.sort()).eqls(valuesY);
        expect(zsFound.slice(0, 2).sort()).eqls(valuesZ);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 15; ind += 3) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newW = stateVariables["/w"].stateValues.value;
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value.tree;
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
        <variantControl uniqueVariants />
        <select assignNames="x y z" numToSelect="3">w x y z</select>
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newZ = stateVariables["/z"].stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 4) {
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(xsFound.sort()).eqls(valuesSingle);
        expect(ysFound.sort()).eqls(valuesSingle);
        expect(zsFound.sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newZ = stateVariables["/z"].stateValues.value.tree;
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
        <variantControl uniqueVariants />
        <select assignNames="x y z" numToSelect="3" withReplacement>x y z</select>
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newZ = stateVariables["/z"].stateValues.value.tree;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 3) {
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(xsFound.sort()).eqls(valuesSingle);
        expect(ysFound.sort()).eqls(valuesSingle);
        expect(zsFound.sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newZ = stateVariables["/z"].stateValues.value.tree;
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
        <variantControl uniqueVariants />
        <selectFromSequence type="letters" assignNames="x y z" numToSelect="3" from="w" to="z" />
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 4) {
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(xsFound.sort()).eqls(valuesSingle);
        expect(ysFound.sort()).eqls(valuesSingle);
        expect(zsFound.sort()).eqls(valuesSingle);

        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
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
        <variantControl uniqueVariants />
        <selectFromSequence type="letters" assignNames="x y z" numToSelect="3" withReplacement from="x" to="z" />
      `;

        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
            let newValue = [newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 3) {
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(xsFound.sort()).eqls(valuesSingle);
        expect(ysFound.sort()).eqls(valuesSingle);
        expect(zsFound.sort()).eqls(valuesSingle);

        // values begin to repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
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
        <variantControl uniqueVariants numVariants="10" />
        <selectFromSequence type="letters" assignNames="w x y z" numToSelect="4" withReplacement from="u" to="z" />
      `;

        // get unique values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newW = stateVariables["/w"].stateValues.value;
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
            let newValue = [newW, newX, newY, newZ].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);

            if (ind <= 6) {
                wsFound.push(newW);
                xsFound.push(newX);
                ysFound.push(newY);
                zsFound.push(newZ);
            }
        }

        // all individual options selected in first variants
        expect(wsFound.sort()).eqls(valuesSingle);
        expect(xsFound.sort()).eqls(valuesSingle);
        expect(ysFound.sort()).eqls(valuesSingle);
        expect(zsFound.sort()).eqls(valuesSingle);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= 2 * numVariants + 3; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            // to wait for page to load

            let stateVariables = await returnAllStateVariables(core);
            let newW = stateVariables["/w"].stateValues.value;
            let newX = stateVariables["/x"].stateValues.value;
            let newY = stateVariables["/y"].stateValues.value;
            let newZ = stateVariables["/z"].stateValues.value;
            let newValue = [newW, newX, newY, newZ].join(",");

            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of selectFromSequence", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <variantControl uniqueVariants />
      <select assignNames="((x))">
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
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x"].stateValues.value;
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

            if (ind === 3) {
                // all individual groups selected in first variants
                expect(valuesFound.some((x) => x <= 2)).eq(true);
                expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
                expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
            }

            if (ind === 6) {
                // all individual groups selected twice in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
            }

            if (ind === 8) {
                // most individual groups selected three times in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
            }
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x"].stateValues.value;
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of selects", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <variantControl uniqueVariants />
      <select assignNames="((x))">
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
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x"].stateValues.value.tree;
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

            if (ind === 3) {
                // all individual groups selected in first variants
                expect(valuesFound.some((x) => x <= 2)).eq(true);
                expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
                expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
            }

            if (ind === 6) {
                // all individual groups selected twice in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
            }

            if (ind === 8) {
                // most individual groups selected three times in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
            }
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x"].stateValues.value.tree;
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("selects of paragraphs of selects/selectFromSequence", async () => {
        let valuesFound: number[] = [];
        let values = [1, 2, 101, 102, 103, 201, 202, 203, 204];
        let numVariants = values.length;

        let doenetML = `
      <variantControl uniqueVariants />
      <select assignNames="x">
        <option newNamespace>
          <p><select assignNames="n">1 2</select></p>
        </option>
        <option newNamespace>
         <p><selectFromSequence assignNames="n" from="101" to="103"/></p>
        </option>
        <option newNamespace>
          <p><select assignNames="n">201 202 203 204</select></p>
        </option>
      </select>
      `;
        // get all values in first variants
        for (let ind = 1; ind <= numVariants; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x/n"].stateValues.value;
            if (newValue.tree !== undefined) {
                newValue = newValue.tree;
            }
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i"]);

            if (ind === 3) {
                // all individual groups selected in first variants
                expect(valuesFound.some((x) => x <= 2)).eq(true);
                expect(valuesFound.some((x) => x >= 101 && x <= 103)).eq(true);
                expect(valuesFound.some((x) => x >= 201 && x <= 204)).eq(true);
            }

            if (ind === 6) {
                // all individual groups selected twice in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(2);
            }

            if (ind === 8) {
                // most individual groups selected three times in first variants
                expect(
                    valuesFound.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0),
                ).eq(2);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
                expect(
                    valuesFound.reduce(
                        (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                        0,
                    ),
                ).eq(3);
            }
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newValue = stateVariables["/x/n"].stateValues.value;
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
      <variantControl uniqueVariants />
      <asList>
        <select assignNames="((x)) ((y))" numToSelect="2">
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
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newValue = [newX, newY].join(",");
            expect(values.includes(newValue)).eq(true);
            expect(valuesFound.includes(newValue)).eq(false);
            valuesFound.push(newValue);
        }

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 20; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let newX = stateVariables["/x"].stateValues.value.tree;
            let newY = stateVariables["/y"].stateValues.value.tree;
            let newValue = [newX, newY].join(",");
            expect(newValue).eq(valuesFound[(ind - 1) % numVariants]);
        }

        // selects all individual groups equally in first variants
        let valuesFound1: number[] = [];
        let valuesFound2: number[] = [];
        for (let pass = 0; pass < 12; pass++) {
            for (let ind = pass * 3 + 1; ind <= (pass + 1) * 3; ind++) {
                let core = await createTestCore({
                    doenetML,
                    requestedVariantIndex: ind,
                });

                let stateVariables = await returnAllStateVariables(core);
                valuesFound1.push(stateVariables["/x"].stateValues.value.tree);
                valuesFound2.push(stateVariables["/y"].stateValues.value.tree);
            }
            expect(valuesFound1.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(
                pass + 1,
            );
            expect(
                valuesFound1.reduce(
                    (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                    0,
                ),
            ).eq(pass + 1);
            expect(
                valuesFound1.reduce(
                    (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                    0,
                ),
            ).eq(pass + 1);
            expect(valuesFound2.reduce((a, c) => a + (c <= 2 ? 1 : 0), 0)).eq(
                pass + 1,
            );
            expect(
                valuesFound2.reduce(
                    (a, c) => a + (c >= 101 && c <= 103 ? 1 : 0),
                    0,
                ),
            ).eq(pass + 1);
            expect(
                valuesFound2.reduce(
                    (a, c) => a + (c >= 201 && c <= 204 ? 1 : 0),
                    0,
                ),
            ).eq(pass + 1);
        }
    });

    it("deeper nesting of selects/selectFromSequence", async () => {
        let doenetML = `
    <variantControl numVariants="24" uniqueVariants/>
    <select assignNames="(p)">
      <option>
        <p>Favorite color:
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
        <p>Selected number:
          <select>
            <option><selectFromSequence from="1000" to="2000" /></option>
            <option><selectFromSequence from="-1000" to="-900" /></option>
          </select>
        </p>
      </option>
      <option>
        <p>Chosen letter: <selectFromSequence type="letters" from="a" to="z" /></p>
      </option>
      <option>
        <p>Variable:
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

        let letters = [...Array(26)].map((_, i) =>
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
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let category = stateVariables["/p"].activeChildren[0].trim();
            expect(categories.includes(category)).eq(true);

            let component =
                stateVariables[
                    stateVariables["/p"].activeChildren.filter(
                        (x) => x.componentName,
                    )[0].componentName
                ];
            let newValue = component.stateValues.value;
            if (category === categories[0]) {
                expect(allColors.includes(newValue)).eq(true);
                colorsFound.push(newValue);
            } else if (category === categories[1]) {
                let validNum =
                    Number.isInteger(newValue) &&
                    ((newValue >= 1000 && newValue <= 2000) ||
                        (newValue >= -1000 && newValue <= -900));
                expect(validNum).eq(true);
                numbersFound.push(newValue);
            } else if (category === categories[2]) {
                expect(letters.includes(newValue)).eq(true);
                lettersFound.push(newValue);
            } else {
                newValue = newValue.tree;
                expect(variables.includes(newValue)).eq(true);
                variablesFound.push(newValue);
            }

            let combinedValue = [category, newValue].join(",");

            expect(valuesFound.includes(combinedValue)).eq(false);
            valuesFound.push(combinedValue);

            categoriesFound.push(category);

            if (ind === 4) {
                // all individual groups selected in first variants
                for (let ind = 0; ind < 4; ind++) {
                    expect(categoriesFound.includes(categories[ind])).eq(true);
                }
            }

            if (ind === 8) {
                // all individual groups selected twice in first variants
                for (let ind = 0; ind < 4; ind++) {
                    expect(
                        categoriesFound.slice(4, 8).includes(categories[ind]),
                    ).eq(true);
                }
            }
        }

        // the 24 values are distributed 6 to each category and evenly distributed across subcategories
        let colorsFoundSet = new Set(colorsFound);
        expect(colorsFoundSet.size).eq(6);
        expect(
            colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(2);
        expect(
            colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(2);
        expect(
            colorsC.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(2);

        expect(numbersFound.reduce((a, c) => a + (c > 0 ? 1 : 0), 0)).eq(3);
        expect(numbersFound.reduce((a, c) => a + (c < 0 ? 1 : 0), 0)).eq(3);

        expect(lettersFound.length).eq(6);
        expect(variablesFound.length).eq(6);

        expect(variablesFound.sort()).eqls(variables);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 25; ind += 5) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let category = stateVariables["/p"].activeChildren[0].trim();
            let component =
                stateVariables[
                    stateVariables["/p"].activeChildren.filter(
                        (x) => x.componentName,
                    )[0].componentName
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
    <variantControl numVariants="6" uniqueVariants/>
    <select assignNames="(problem)">
      <option>
        <problem newNamespace><title>Favorite color</title>
          <select assignNames="(p)">
            <option>
              <p newNamespace>I like 
                <select type="text" assignNames="color">red orange yellow magenta maroon fuchsia scarlet</select>
              </p>
            </option>
            <option>
              <p newNamespace>You like
                <select type="text" assignNames="color">green chartreuse turquoise</select>
              </p>
            </option>
          </select>
          <p>Enter the color $(p/color): <answer name="ans" type="text">$(p/color)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Selected word</title>
          <select assignNames="(p)">
            <option><p newNamespace>Verb: <select type="text" assignNames="word">run walk jump skip</select></p></option>
            <option><p newNamespace>Adjective: <select type="text" assignNames="word">soft scary large empty residual limitless</select></p></option>
          </select>
          <p>Enter the word $(p/word): <answer name="ans" type="text">$(p/word)</answer></p>
        </problem>
      </option>
      <option>
        <problem newNamespace><title>Chosen letter</title>
          <p>Letter
            <selectFromSequence  assignNames="l" type="letters" from="a" to="z" />
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

        let letters = [...Array(26)].map((_, i) =>
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
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);

            let textinputName =
                stateVariables[`/problem/ans`].stateValues.inputChildren[0]
                    .componentName;
            let category = stateVariables["/problem"].stateValues.title;
            expect(categories.includes(category)).eq(true);

            let component =
                stateVariables[
                    stateVariables[
                        stateVariables["/problem"].activeChildren.filter(
                            (x) => x.componentName,
                        )[1].componentName
                    ].activeChildren[1].componentName
                ];
            let newValue = component.stateValues.value;
            if (category === categories[0]) {
                expect(allColors.includes(newValue)).eq(true);
                colorsFound.push(newValue);
            } else if (category === categories[1]) {
                expect(allWords.includes(newValue)).eq(true);
                wordsFound.push(newValue);
            } else if (category === categories[2]) {
                expect(letters.includes(newValue)).eq(true);
                lettersFound.push(newValue);
            }

            let combinedValue = [category, newValue].join(",");

            expect(valuesFound.includes(combinedValue)).eq(false);
            valuesFound.push(combinedValue);

            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            categoriesFound.push(category);

            if (ind === 3) {
                // all individual groups selected in first variants
                for (let ind = 0; ind < 3; ind++) {
                    expect(categoriesFound.includes(categories[ind])).eq(true);
                }
            }

            if (ind === 6) {
                // all individual groups selected twice in first variants
                for (let ind = 0; ind < 3; ind++) {
                    expect(
                        categoriesFound.slice(3).includes(categories[ind]),
                    ).eq(true);
                }
            }

            await updateTextInputValue({
                text: `${newValue}`,
                name: textinputName,
                core,
            });
            await submitAnswer({ name: `/problem/ans`, core });
            stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/problem/ans"].stateValues.creditAchieved,
            ).eq(1);
            expect(
                stateVariables["/problem/ans"].stateValues.submittedResponses,
            ).eqls([newValue]);
            expect(stateVariables[textinputName].stateValues.value).eq(
                newValue,
            );

            await updateTextInputValue({
                text: `${newValue}X`,
                name: textinputName,
                core,
            });
            await submitAnswer({ name: `/problem/ans`, core });

            stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/problem/ans"].stateValues.creditAchieved,
            ).eq(0);
            expect(
                stateVariables["/problem/ans"].stateValues.submittedResponses,
            ).eqls([newValue + "X"]);
            expect(stateVariables[textinputName].stateValues.value).eq(
                newValue + "X",
            );

            await updateTextInputValue({
                text: `${newValue}`,
                name: textinputName,
                core,
            });
            await submitAnswer({ name: `/problem/ans`, core });

            stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/problem/ans"].stateValues.creditAchieved,
            ).eq(1);
            expect(
                stateVariables["/problem/ans"].stateValues.submittedResponses,
            ).eqls([newValue]);
            expect(stateVariables[textinputName].stateValues.value).eq(
                newValue,
            );
        }

        let colorsFoundSet = new Set(colorsFound);
        expect(colorsFoundSet.size).eq(2);
        expect(
            colorsA.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(1);
        expect(
            colorsB.reduce((a, c) => a + (colorsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(1);

        let wordsFoundSet = new Set(wordsFound);
        expect(wordsFoundSet.size).eq(2);
        expect(
            wordsA.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(1);
        expect(
            wordsB.reduce((a, c) => a + (wordsFoundSet.has(c) ? 1 : 0), 0),
        ).eq(1);

        // values repeat in next variants
        for (let ind = numVariants + 1; ind <= numVariants + 6; ind += 2) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let category = stateVariables["/problem"].stateValues.title;
            let component =
                stateVariables[
                    stateVariables[
                        stateVariables["/problem"].activeChildren.filter(
                            (x) => x.componentName,
                        )[1].componentName
                    ].activeChildren[1].componentName
                ];
            let newValue = component.stateValues.value;
            let combinedValue = [category, newValue].join(",");
            expect(combinedValue).eq(valuesFound[(ind - 1) % numVariants]);
        }
    });

    it("can get unique with map without variants", async () => {
        let doenetML = `
    <variantControl uniqueVariants />
    <selectFromSequence assignNames="x" length="3" />
    <map assignNames="(p1) (p2) (p3) (p4)">
      <template>
        <p>letter: $v</p>
      </template>
      <sources alias="v">
        <sequence type="letters" length="$n" />
      </sources>
    </map>
    <p>N: <mathInput name="n" prefill="1" /></p>
    `;

        // get all values in order and they repeat in next variants
        for (let ind = 1; ind <= 4; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value).eq(
                ((ind - 1) % 3) + 1,
            );
            expect(stateVariables["/p1"].stateValues.text).eq("letter: a");
            expect(stateVariables["/p2"]).be.undefined;

            await updateMathInputValue({ latex: "3", name: "/n", core });
            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/p1"].stateValues.text).eq("letter: a");
            expect(stateVariables["/p2"].stateValues.text).eq("letter: b");
            expect(stateVariables["/p3"].stateValues.text).eq("letter: c");

            expect(stateVariables["/x"].stateValues.value).eq(
                ((ind - 1) % 3) + 1,
            );
            expect(
                stateVariables[
                    stateVariables["/p1"].activeChildren[1].componentName
                ].stateValues.value,
            ).eq("a");
            expect(
                stateVariables[
                    stateVariables["/p2"].activeChildren[1].componentName
                ].stateValues.value,
            ).eq("b");
            expect(
                stateVariables[
                    stateVariables["/p3"].activeChildren[1].componentName
                ].stateValues.value,
            ).eq("c");
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c"]);

            await updateMathInputValue({ latex: "4", name: "/n", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/p1"].stateValues.text).eq("letter: a");
            expect(stateVariables["/p2"].stateValues.text).eq("letter: b");
            expect(stateVariables["/p3"].stateValues.text).eq("letter: c");
            expect(stateVariables["/p4"].stateValues.text).eq("letter: d");
        }
    });

    async function test_shuffled_choice_input(
        doenetML: string,
        insiderAnswer = false,
    ) {
        let ordersFound: string[] = [];
        let choices = ["red", "blue", "green"];

        // get all orders in first 6 variants
        for (let ind = 1; ind <= 6; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await returnAllStateVariables(core);

            let ciName = "/ci";
            if (insiderAnswer) {
                ciName =
                    stateVariables["/ans"].stateValues.inputChildren[0]
                        .componentName;
            }

            let choiceOrder = stateVariables[ciName].stateValues.choiceOrder;
            let selectedOrder = choiceOrder.join(",");
            expect(ordersFound.includes(selectedOrder)).eq(false);
            ordersFound.push(selectedOrder);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            for (let i = 0; i < 3; i++) {
                await updateSelectedIndices({
                    name: ciName,
                    selectedIndices: [i + 1],
                    core,
                });
                stateVariables = await returnAllStateVariables(core);
                expect(stateVariables[ciName].stateValues.selectedValues).eqls([
                    choices[choiceOrder[i] - 1],
                ]);
            }

            await updateSelectedIndices({
                name: ciName,
                selectedIndices: [1],
                core,
            });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables[ciName].stateValues.selectedValues).eqls([
                choices[choiceOrder[0] - 1],
            ]);
        }

        // 7th variant repeats first order
        let ind = 7;
        let core = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await returnAllStateVariables(core);
        let ciName = "/ci";
        if (insiderAnswer) {
            ciName =
                stateVariables["/ans"].stateValues.inputChildren[0]
                    .componentName;
        }
        let choiceOrder = stateVariables[ciName].stateValues.choiceOrder;
        let selectedOrder = choiceOrder.join(",");
        expect(selectedOrder).eq(ordersFound[0]);
    }

    it("single shuffled choiceInput", async () => {
        let doenetML = `
    <variantControl uniqueVariants />
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
    <variantControl uniqueVariants />
    <choice name="red">red</choice>
    <group name="twoChoices">
      <choice>blue</choice>
      <choice>green</choice>
    </group>

    <choiceInput name="ci" shuffleOrder>
      <choice copySource="red" />
      <copy source="twoChoices" createComponentOfType="choice" numComponents="2" />
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
    <variantControl uniqueVariants />
    <choiceInput name="ci" shuffleOrder>
      <choice><selectFromSequence from="1" to="2" assignNames="n" /></choice>
      <choice><selectFromSequence type="letters" from="a" to="b" assignNames="l" /></choice>
    </choiceInput>
    `;

        let selectionsFound: string[] = [];

        // get all options in first 8 variants
        for (let ind = 1; ind <= 8; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
            let n = stateVariables["/n"].stateValues.value;
            let l = stateVariables["/l"].stateValues.value;
            let choices = [n.toString(), l];
            let selectedOption = [...choiceOrder, ...choices].join(",");
            expect(selectionsFound.includes(selectedOption)).eq(false);
            selectionsFound.push(selectedOption);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h"]);

            for (let i = 0; i < 2; i++) {
                await updateSelectedIndices({
                    name: "/ci",
                    selectedIndices: [i + 1],
                    core,
                });

                stateVariables = await returnAllStateVariables(core);
                expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
                    choices[choiceOrder[i] - 1],
                ]);
            }

            await updateSelectedIndices({
                name: "/ci",
                selectedIndices: [1],
                core,
            });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ci"].stateValues.selectedValues).eqls([
                choices[choiceOrder[0] - 1],
            ]);
        }

        let ind = 9;
        let core = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await returnAllStateVariables(core);
        let choiceOrder = stateVariables["/ci"].stateValues.choiceOrder;
        let n = stateVariables["/n"].stateValues.value;
        let l = stateVariables["/l"].stateValues.value;
        let choices = [n.toString(), l];
        let selectedOption = [...choiceOrder, ...choices].join(",");
        expect(selectedOption).eq(selectionsFound[0]);
    });

    async function test_shuffle(doenetML: string) {
        let ordersFound: string[] = [];
        let colors = ["red", "blue", "green"];

        // get all orders in first 6 variants
        for (let ind = 1; ind <= 6; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let componentOrder =
                stateVariables["/sh"].stateValues.componentOrder;
            expect([...componentOrder].sort()).eqls([1, 2, 3]);

            let selectedOrder = componentOrder.join(",");
            expect(ordersFound.includes(selectedOrder)).eq(false);
            ordersFound.push(selectedOrder);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            expect(stateVariables["/pList"].stateValues.text).eq(
                componentOrder.map((x) => colors[x - 1]).join(", "),
            );
        }

        // 7th variant repeats first order
        let ind = 7;
        let core = await createTestCore({
            doenetML,
            requestedVariantIndex: ind,
        });

        let stateVariables = await returnAllStateVariables(core);
        let componentOrder = stateVariables["/sh"].stateValues.componentOrder;
        let selectedOrder = componentOrder.join(",");
        expect(selectedOrder).eq(ordersFound[0]);

        expect(stateVariables["/pList"].stateValues.text).eq(
            componentOrder.map((x) => colors[x - 1]).join(", "),
        );
    }

    it("shuffle", async () => {
        let doenetML = `
    <variantControl uniqueVariants />
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
    <variantControl uniqueVariants />
    <text name="red">red</text>
    <group name="twoColors">
      <text>blue</text>
      <text>green</text>
    </group>
    <p name="pList"><shuffle name="sh">
      <text copySource="red" />
      <copy source="twoColors" createComponentOfType="text" numComponents="2" />
    </shuffle></p>

    `;

        await test_shuffle(doenetML);
    });

    async function test_document_problem_unique({
        doenetML,
        mOptions = [],
        nOptions = [],
    }: {
        doenetML: string;
        mOptions?: number[];
        nOptions?: number[];
    }) {
        // Note: mOptions must be length 2 if exists
        // nOptions must be length 3 if exists

        // get all 6 options and then they repeat
        for (let ind = 1; ind <= 8; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);

            let mathInputName =
                stateVariables["/ans1"].stateValues.inputChildren[0]
                    .componentName;
            let mathInput2Name =
                stateVariables["/ans2"].stateValues.inputChildren[0]
                    .componentName;

            let m = mOptions[(ind - 1) % 2];
            let n = nOptions[(ind - 1) % 3];
            if (m === undefined) {
                m = stateVariables["/m"].stateValues.value;
                mOptions.push(m);
            } else {
                expect(stateVariables["/m"].stateValues.value).eq(m);
            }
            if (n === undefined) {
                n = stateVariables["/n"].stateValues.value;
                nOptions.push(n);
            } else {
                expect(stateVariables["/n"].stateValues.value).eq(n);
            }

            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f"]);

            await updateMathInputValue({
                latex: `${m}`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans1", core });
            await updateMathInputValue({
                latex: `${n}`,
                name: mathInput2Name,
                core,
            });
            await submitAnswer({ name: "/ans2", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans1"].stateValues.creditAchieved).eq(1);
            expect(stateVariables["/ans2"].stateValues.creditAchieved).eq(1);
            expect(
                stateVariables["/ans1"].stateValues.submittedResponses[0].tree,
            ).eq(m);
            expect(
                stateVariables["/ans2"].stateValues.submittedResponses[0].tree,
            ).eq(n);

            await updateMathInputValue({
                latex: `${m}1`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans1", core });
            await updateMathInputValue({
                latex: `${n}1`,
                name: mathInput2Name,
                core,
            });
            await submitAnswer({ name: "/ans2", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans1"].stateValues.creditAchieved).eq(0);
            expect(stateVariables["/ans2"].stateValues.creditAchieved).eq(0);

            expect(
                stateVariables["/ans1"].stateValues.submittedResponses[0].tree,
            ).eq(m * 10 + 1);
            expect(
                stateVariables["/ans2"].stateValues.submittedResponses[0].tree,
            ).eq(n * 10 + 1);

            await updateMathInputValue({
                latex: `${m}`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans1", core });
            await updateMathInputValue({
                latex: `${n}`,
                name: mathInput2Name,
                core,
            });
            await submitAnswer({ name: "/ans2", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans1"].stateValues.creditAchieved).eq(1);
            expect(stateVariables["/ans2"].stateValues.creditAchieved).eq(1);
            expect(
                stateVariables["/ans1"].stateValues.submittedResponses[0].tree,
            ).eq(m);
            expect(
                stateVariables["/ans2"].stateValues.submittedResponses[0].tree,
            ).eq(n);
        }
    }

    it("document and problems with unique variants", async () => {
        let doenetML = `
    <variantControl uniqueVariants />
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="1" to="2" assignNames="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="3" to="5" assignNames="n" />:
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
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="1" to="2" assignNames="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl uniqueVariants />
      <p>Enter <selectFromSequence from="3" to="5" assignNames="n" />:
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
      <p>Enter <selectFromSequence from="1" to="2" assignNames="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <p>Enter <selectFromSequence from="3" to="5" assignNames="n" />:
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
    <variantControl uniqueVariants />
    <problem>
      <variantControl numVariants="2" />
      <p>Enter <selectFromSequence from="1000000" to="2000000" assignNames="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl numVariants="3" />
      <p>Enter <selectFromSequence from="3000000" to="5000000" assignNames="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({ doenetML });
    });

    it("document with unique variants, from problems without unique variants, even without specifying unique", async () => {
        let doenetML = `
    <problem>
      <variantControl numVariants="2" />
      <p>Enter <selectFromSequence from="1000000" to="2000000" assignNames="m" />:
        <answer name="ans1">$m</answer>
      </p>
    </problem>
    <problem>
      <variantControl numVariants="3" />
      <p>Enter <selectFromSequence from="3000000" to="5000000" assignNames="n" />:
        <answer name="ans2">$n</answer>
      </p>
    </problem>
    `;

        await test_document_problem_unique({ doenetML });
    });

    it("document inherits variants from single problem with unique variants", async () => {
        let doenetML = `
        <problem>
          <variantControl uniqueVariants variantNames="five six seven" />
          <p>Enter <selectFromSequence from="5" to="7" assignNames="m" />:
            <answer name="ans">$m</answer>
          </p>
        </problem>
        `;

        // get all 3 options and then they repeat
        for (let ind = 1; ind <= 4; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let m = ((ind - 1) % 3) + 5;

            let stateVariables = await returnAllStateVariables(core);

            let mathInputName =
                stateVariables["/ans"].stateValues.inputChildren[0]
                    .componentName;

            expect(stateVariables["/m"].stateValues.value).eq(m);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["five", "six", "seven"]);
            expect(
                stateVariables["/_document1"].sharedParameters.variantName,
            ).eq(["five", "six", "seven"][(ind - 1) % 3]);

            await updateMathInputValue({
                latex: `${m}`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
            expect(
                stateVariables["/ans"].stateValues.submittedResponses[0].tree,
            ).eq(m);

            await updateMathInputValue({
                latex: `${m}1`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans", core });
            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
            expect(
                stateVariables["/ans"].stateValues.submittedResponses[0].tree,
            ).eq(m * 10 + 1);

            await updateMathInputValue({
                latex: `${m}`,
                name: mathInputName,
                core,
            });
            await submitAnswer({ name: "/ans", core });

            stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
            expect(
                stateVariables["/ans"].stateValues.submittedResponses[0].tree,
            ).eq(m);
        }
    });

    it("no variant control, 1 unique variant", async () => {
        let core = await createTestCore({ doenetML: "hello" });

        let stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a"]);
    });

    it("no variant control, single select", async () => {
        let doenetML = `<select assignNames="x">u v w</select>`;
        let values = ["u", "v", "w"];

        // get all values in order and they repeat in next variants
        for (let ind = 1; ind <= 4; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value.tree).eq(
                values[(ind - 1) % 3],
            );
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c"]);
        }
    });

    it("no variant control, select and selectFromSequence", async () => {
        let doenetML = `
        <select assignNames="x">u v w</select>
        <selectFromSequence assignNames="n" />
      `;
        let values = ["u", "v", "w"];

        // get first values in order
        for (let ind = 1; ind <= 3; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/x"].stateValues.value.tree).eq(
                values[ind - 1],
            );
            expect(stateVariables["/n"].stateValues.value).eq(ind);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants.length,
            ).eq(30);
        }
    });

    it("no variant control, 100 is still unique variants", async () => {
        let doenetML = `
        <selectFromSequence assignNames="n" length="100" />
      `;
        // get first values in order
        for (let ind = 1; ind <= 5; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/n"].stateValues.value).eq(ind);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants.length,
            ).eq(100);
        }
    });

    it("no variant control, 101 is not unique variants", async () => {
        let doenetML = `
        <selectFromSequence assignNames="n" length="101" />
      `;
        let foundOneNotInOrder = false;

        // don't get first values in order
        for (let ind = 1; ind <= 3; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            if (stateVariables["/n"].stateValues.value !== ind) {
                foundOneNotInOrder = true;
            }
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants.length,
            ).eq(100);
        }

        expect(foundOneNotInOrder).eq(true);
    });

    it("no variant control, problem with 3 selects", async () => {
        // Catch bug in enumerateCombinations
        // where was indirectly overwriting numVariantsByDescendant

        let doenetML = `
        <problem>
          <select type="number" assignNames="a">1 2</select>
          <select type="number" assignNames="b">3 4</select>
          <select type="number" assignNames="c">5 6</select>
        </problem>
      `;

        let values = [135, 246, 145, 236, 136, 245, 146, 235];

        // get each value exactly one, in order corresponding to above list
        let valuesFound: number[] = [];
        for (let ind = 1; ind <= 8; ind++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await returnAllStateVariables(core);
            let a = stateVariables["/a"].stateValues.value;
            let b = stateVariables["/b"].stateValues.value;
            let c = stateVariables["/c"].stateValues.value;

            let val = a * 100 + b * 10 + c;
            valuesFound.push(val);
            expect(
                stateVariables["/_document1"].sharedParameters
                    .allPossibleVariants.length,
            ).eq(8);
        }

        expect(valuesFound).eqls(values);
    });

    async function test_variants_include_exclude({
        createDoenetML,
        variantsFromProblem = false,
        documentAndProblemVariantsDiffer = false,
    }: {
        createDoenetML: (arg?: {
            include?: string[];
            exclude?: string[];
        }) => string;
        variantsFromProblem?: boolean;
        documentAndProblemVariantsDiffer?: boolean;
    }) {
        // get two variants with no include/exclude

        let core = await createTestCore({
            doenetML: createDoenetML(),
            requestedVariantIndex: 2,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "2",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            2,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "b",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "2",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(2);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "b",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
        }

        core = await createTestCore({
            doenetML: createDoenetML(),
            requestedVariantIndex: 5,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "5",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            5,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "e",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "5",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(5);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "e",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
        }

        // get same variants when add variantsToInclude

        core = await createTestCore({
            doenetML: createDoenetML({ include: ["b", "e"] }),
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "1" : "2",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            1,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "a" : "b",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(documentAndProblemVariantsDiffer ? ["a", "b"] : ["b", "e"]);
        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "2",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(1);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "b",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "e"]);
        }

        core = await createTestCore({
            doenetML: createDoenetML({ include: ["b", "e"] }),
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "2" : "5",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            2,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "b" : "e",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(documentAndProblemVariantsDiffer ? ["a", "b"] : ["b", "e"]);
        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "5",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(2);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "e",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "e"]);
        }

        // get same variants when add variantsToExclude

        core = await createTestCore({
            doenetML: createDoenetML({ exclude: ["a", "d", "h", "j"] }),
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "1" : "2",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            1,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "a" : "b",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c", "d", "e", "f"]
                : ["b", "c", "e", "f", "g", "i"],
        );
        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "2",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(1);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "b",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "c", "e", "f", "g", "i"]);
        }

        core = await createTestCore({
            doenetML: createDoenetML({ exclude: ["a", "d", "h", "j"] }),
            requestedVariantIndex: 3,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);

        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "3" : "5",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            3,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "c" : "e",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c", "d", "e", "f"]
                : ["b", "c", "e", "f", "g", "i"],
        );
        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "5",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(3);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "e",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "c", "e", "f", "g", "i"]);
        }

        // get same variants when add variantsToInclude and variantsToExclude

        core = await createTestCore({
            doenetML: createDoenetML({
                include: ["a", "b", "d", "e", "g", "h"],
                exclude: ["a", "c", "d", "h", "j"],
            }),
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(2);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "1" : "2",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            1,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "a" : "b",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c"]
                : ["b", "e", "g"],
        );
        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "2",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(1);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "b",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "e", "g"]);
        }

        core = await createTestCore({
            doenetML: createDoenetML({
                include: ["a", "b", "d", "e", "g", "h"],
                exclude: ["a", "c", "d", "h", "j"],
            }),
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(5);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            variantsFromProblem ? "2" : "5",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            2,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            documentAndProblemVariantsDiffer ? "b" : "e",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c"]
                : ["b", "e", "g"],
        );

        if (variantsFromProblem) {
            expect(stateVariables["/problem1"].sharedParameters.variantSeed).eq(
                "5",
            );
            expect(
                stateVariables["/problem1"].sharedParameters.variantIndex,
            ).eq(2);
            expect(stateVariables["/problem1"].sharedParameters.variantName).eq(
                "e",
            );
            expect(
                stateVariables["/problem1"].sharedParameters
                    .allPossibleVariants,
            ).eqls(["b", "e", "g"]);
        }
    }

    it("variantsToInclude and variantsToExclude", async () => {
        function createDoenetML({
            include = [],
            exclude = [],
        }: { include?: string[]; exclude?: string[] } = {}) {
            let attributes = "";
            if (include.length > 0) {
                attributes += `variantsToInclude="${include.join(" ")}"`;
            }
            if (exclude.length > 0) {
                attributes += `variantsToExclude="${exclude.join(" ")}"`;
            }

            return `
            <variantControl numVariants="10" ${attributes} />
            Selected number: 
            <selectFromSequence assignNames="n" length="10" />
            `;
        }

        await test_variants_include_exclude({ createDoenetML });
    });

    it("variantsToInclude and variantsToExclude in problem as only child", async () => {
        function createDoenetML({
            include = [],
            exclude = [],
        }: { include?: string[]; exclude?: string[] } = {}) {
            let attributes = "";
            if (include.length > 0) {
                attributes += `variantsToInclude="${include.join(" ")}"`;
            }
            if (exclude.length > 0) {
                attributes += `variantsToExclude="${exclude.join(" ")}"`;
            }

            return `
    <problem name="problem1">
        <text>Hello!</text>
        <variantControl numVariants="10" ${attributes} />
        Selected number: 
        <selectFromSequence assignNames="n" length="10" />
    </problem>
            `;
        }

        await test_variants_include_exclude({
            createDoenetML,
            variantsFromProblem: true,
            documentAndProblemVariantsDiffer: false,
        });
    });

    it("variantsToInclude and variantsToExclude in problem, extra child", async () => {
        function createDoenetML({
            include = [],
            exclude = [],
        }: { include?: string[]; exclude?: string[] } = {}) {
            let attributes = "";
            if (include.length > 0) {
                attributes += `variantsToInclude="${include.join(" ")}"`;
            }
            if (exclude.length > 0) {
                attributes += `variantsToExclude="${exclude.join(" ")}"`;
            }

            return `
    <text>Hello!</text>
    <problem name="problem1">
        <variantControl numVariants="10" ${attributes} />
        Selected number: 
        <selectFromSequence assignNames="n" length="10" />
    </problem>
            `;
        }

        await test_variants_include_exclude({
            createDoenetML,
            variantsFromProblem: true,
            documentAndProblemVariantsDiffer: true,
        });
    });

    it("unique variants determined by numVariants specified, even with variantsToInclude and variantsToExclude", async () => {
        // unique variants when numVariants is 1000

        let doenetMLa = `
    <variantControl numVariants="1000" variantsToInclude="b t ax cv" variantsToExclude="b ax" />
    Selected number: 
    <selectFromSequence assignNames="n" length="1000" />
    `;

        let core = await createTestCore({
            doenetML: doenetMLa,
            requestedVariantIndex: 1,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(20);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "20",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            1,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "t",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["t", "cv"]);

        core = await createTestCore({
            doenetML: doenetMLa,
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).eq(100);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "100",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            2,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "cv",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["t", "cv"]);

        // non-unique variants when numVariants is 100

        let doenetMLb = `
    <variantControl numVariants="100" variantsToInclude="b t ax cv" variantsToExclude="b ax" />
    Selected number: 
    <selectFromSequence assignNames="n" length="1000" />
    `;

        core = await createTestCore({
            doenetML: doenetMLb,
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).not.eq(20);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "20",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            1,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "t",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["t", "cv"]);

        core = await createTestCore({
            doenetML: doenetMLb,
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).not.eq(100);
        expect(stateVariables["/_document1"].sharedParameters.variantSeed).eq(
            "100",
        );
        expect(stateVariables["/_document1"].sharedParameters.variantIndex).eq(
            2,
        );
        expect(stateVariables["/_document1"].sharedParameters.variantName).eq(
            "cv",
        );
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["t", "cv"]);
    });

    it("unless variant determines seed, sample random/prime numbers does not add variants", async () => {
        // no other variants so get 1 variant
        let core = await createTestCore({
            doenetML: `
        <sampleRandomNumbers type="uniform" from="1" to="10" assignNames="n" />
        `,
        });
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).gte(1).lte(10);
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants,
        ).eqls(["a"]);

        // just get 10 variants from select
        core = await createTestCore({
            doenetML: `
        <samplePrimeNumbers minValue="1" maxValue="10000" assignNames="n" />
        <selectFromSequence from="1" to="10" />
        `,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).gte(1).lte(10000);
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants
                .length,
        ).eq(10);

        // when variant determines seed, get 100 different variants
        core = await createTestCore({
            doenetML: `
                <sampleRandomNumbers type="uniform" from="1" to="10" variantDeterminesSeed assignNames="n" />
                `,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).gte(1).lte(10);
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants
                .length,
        ).eq(100);

        core = await createTestCore({
            doenetML: `
                <samplePrimeNumbers minValue="1" maxValue="10000" variantDeterminesSeed assignNames="n" />
                `,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/n"].stateValues.value).gte(1).lte(10000);
        expect(
            stateVariables["/_document1"].sharedParameters.allPossibleVariants
                .length,
        ).eq(100);
    });
});
