import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { numberToLetters } from "@doenet/utils";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Specifying single variant tests", async () => {
    async function run_select_from_sequence_test({
        specifiedNumVariants,
        specifiedSeeds,
        specifiedVariantNames,
    }: {
        specifiedNumVariants?: number;
        specifiedSeeds?: string[];
        specifiedVariantNames?: string[];
    }) {
        function createDoenetML({
            numVariants,
            seeds,
            variantNames,
            extra = "",
        }: {
            numVariants?: number;
            seeds?: string[];
            variantNames?: string[];
            extra?: string;
        }) {
            let variantControl = "";
            if (
                numVariants !== undefined ||
                seeds !== undefined ||
                variantNames !== undefined
            ) {
                variantControl = "<variantControl ";
                if (numVariants !== undefined) {
                    variantControl += `numVariants="${numVariants}" `;
                }
                if (seeds !== undefined) {
                    variantControl += `seeds="${seeds.join(" ")}" `;
                }
                if (variantNames !== undefined) {
                    variantControl += `variantNames="${variantNames.join(" ")}" `;
                }
                variantControl += "/>";
            }

            return `
                ${variantControl}
                ${extra}
                <p>
                Selected number: 
                <selectFromSequence name="n" length="10000000000" />
                </p>
                `;
        }

        async function check_variant(
            variantIndex: number,
            n: number,
            seeds: string[],
            variantNames: string[],
        ) {
            let variantName = variantNames[variantIndex - 1];
            let variantSeed = seeds[variantIndex - 1];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                    .value,
            ).eq(n);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .stateValues.generatedVariantInfo,
            ).eqls({
                index: variantIndex,
                name: variantName,
                meta: {
                    createdBy: await resolvePathToNodeIdx("_document1"),
                },
                subvariants: [
                    {
                        indices: [n],
                        meta: { createdBy: await resolvePathToNodeIdx("n") },
                    },
                ],
            });
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantSeed,
            ).eq(variantSeed);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantIndex,
            ).eq(variantIndex);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantName,
            ).eq(variantName);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(variantNames);
        }

        let numVariants = 100;
        if (specifiedNumVariants !== undefined) {
            numVariants = Math.round(
                Math.max(1, Math.min(1000, specifiedNumVariants)),
            );
        }

        let seeds = [...Array(numVariants).keys()].map((i) => `${i + 1}`);
        if (specifiedSeeds !== undefined) {
            seeds = specifiedSeeds;
        }

        let variantNames = [...Array(numVariants).keys()].map((i) =>
            numberToLetters(i + 1, true),
        );
        if (specifiedVariantNames !== undefined) {
            variantNames = specifiedVariantNames;
        }

        let nBySeed: Record<string, number> = {};

        // specify first variant
        let doenetML = createDoenetML({
            numVariants: specifiedNumVariants,
            seeds: specifiedSeeds,
            variantNames: specifiedVariantNames,
            extra: "<text>hi</text>",
        });
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        nBySeed[seeds[0]] =
            stateVariables[
                await resolvePathToNodeIdx("n[1]")
            ].stateValues.value;
        await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

        // Number doesn't change with update
        // even if change non-variant content at beginning
        doenetML = createDoenetML({
            numVariants: specifiedNumVariants,
            seeds: specifiedSeeds,
            variantNames: specifiedVariantNames,
            extra: "<text>bye!</text>",
        });
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        }));
        await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

        if (numVariants === 1) {
            // specifying any other variant gives first
            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: 2,
            }));
            await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: 128,
            }));
            await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: -52,
            }));
            await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

            return;
        }

        // Number does change for index 2
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        }));
        stateVariables = await core.returnAllStateVariables(false, true);
        nBySeed[seeds[1]] =
            stateVariables[
                await resolvePathToNodeIdx("n[1]")
            ].stateValues.value;
        expect(nBySeed[seeds[1]]).not.eq(nBySeed[seeds[0]]);
        await check_variant(2, nBySeed[seeds[1]], seeds, variantNames);

        // Number doesn't change with update
        // even if change non-variant content at beginning
        doenetML = createDoenetML({
            numVariants: specifiedNumVariants,
            seeds: specifiedSeeds,
            variantNames: specifiedVariantNames,
            extra: `
                <mathInput name="mi" />
                <answer name="ans" />
                <math simplify>$mi+$ans</math>`,
        });
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        }));
        await check_variant(2, nBySeed[seeds[1]], seeds, variantNames);

        // Indices equal mod numVariants don't change result
        doenetML = createDoenetML({
            numVariants: specifiedNumVariants,
            seeds: specifiedSeeds,
            variantNames: specifiedVariantNames,
        });
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2 + 124 * numVariants,
        }));
        await check_variant(2, nBySeed[seeds[1]], seeds, variantNames);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2 - 21 * numVariants,
        }));
        await check_variant(2, nBySeed[seeds[1]], seeds, variantNames);

        if (numVariants >= 4) {
            // specify third variant
            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: 3 + 77 * numVariants,
            }));
            stateVariables = await core.returnAllStateVariables(false, true);
            nBySeed[seeds[2]] =
                stateVariables[
                    await resolvePathToNodeIdx("n[1]")
                ].stateValues.value;
            expect(nBySeed[seeds[2]]).not.eq(nBySeed[seeds[0]]);
            expect(nBySeed[seeds[2]]).not.eq(nBySeed[seeds[1]]);
            await check_variant(3, nBySeed[seeds[2]], seeds, variantNames);

            // specify fourth variant
            ({ core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: 4 + -3261 * numVariants,
            }));
            stateVariables = await core.returnAllStateVariables(false, true);
            nBySeed[seeds[3]] =
                stateVariables[
                    await resolvePathToNodeIdx("n[1]")
                ].stateValues.value;
            expect(nBySeed[seeds[3]]).not.eq(nBySeed[seeds[0]]);
            expect(nBySeed[seeds[3]]).not.eq(nBySeed[seeds[1]]);
            expect(nBySeed[seeds[3]]).not.eq(nBySeed[seeds[2]]);
            await check_variant(4, nBySeed[seeds[3]], seeds, variantNames);
        }

        // invalid index gives variant 1
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: NaN,
        }));
        await check_variant(1, nBySeed[seeds[0]], seeds, variantNames);

        // round variant index to nearest integer
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2.48 + 521 * numVariants,
        }));
        await check_variant(2, nBySeed[seeds[1]], seeds, variantNames);

        if (specifiedSeeds) {
            // randomly shuffle the specified seeds into a new order
            let newSpecifiedSeeds = [...specifiedSeeds];
            for (let i = newSpecifiedSeeds.length - 1; i > 0; i--) {
                const rand = Math.random();
                const j = Math.floor(rand * (i + 1));
                [newSpecifiedSeeds[i], newSpecifiedSeeds[j]] = [
                    newSpecifiedSeeds[j],
                    newSpecifiedSeeds[i],
                ];
            }

            // for all the seeds that we've tested so far, i.e., those in `nBySeed`,
            // find the new variant index that is associated with that seed
            // and test that the new variant index gives the same value of n
            for (let seed in nBySeed) {
                let variantIndex = newSpecifiedSeeds.indexOf(seed) + 1;
                let doenetML = createDoenetML({
                    numVariants,
                    seeds: newSpecifiedSeeds,
                    variantNames: specifiedVariantNames,
                    extra: `<number>${Math.random()}</number>`,
                });
                ({ core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                    requestedVariantIndex: variantIndex,
                }));
                await check_variant(
                    variantIndex,
                    nBySeed[seed],
                    newSpecifiedSeeds,
                    variantNames,
                );
            }
        }
    }

    it("document with no variant control", async () => {
        await run_select_from_sequence_test({});
    });

    it("document with variant control specifying seeds", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 5,
            specifiedSeeds: ["50283", "25018", "52018", "2917392", "603962"],
        });
    });

    it("document with variant control specifying seeds and variant names", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 4,
            specifiedSeeds: ["9026", "ab32", "0m3pf", "lm2hA"],
            specifiedVariantNames: ["hi", "bye", "d", "1"],
        });
    });

    it("document with variant control specifying only number of variants", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 3,
        });
    });

    it("document with variant control specifying zero variants", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 0,
        });
    });

    it("document with variant control specifying fractional number of variants", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 3.5,
        });
    });

    it("document with variant control specifying negative fractional number of variants", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: -3.5,
        });
    });

    it("document with variant control specifying too many variants", async () => {
        await run_select_from_sequence_test({
            specifiedNumVariants: 10000,
        });
    });

    it("document with variant control specifying variantNames", async () => {
        async function check_variant(variantIndex: number) {
            let variantNames = [
                "avocado",
                "broccoli",
                "carrot",
                "dill",
                "eggplant",
            ];
            let variantName = variantNames[variantIndex - 1];
            let expectedX = variantName[0];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let x =
                stateVariables[await resolvePathToNodeIdx("s.x")].stateValues
                    .value.tree;
            expect(x).eq(expectedX);
            let xorig =
                stateVariables[
                    stateVariables[
                        stateVariables[await resolvePathToNodeIdx("s")]
                            .replacements![0].componentIdx
                    ].replacements![0].componentIdx
                ].stateValues.value.tree;
            expect(xorig).eq(expectedX);
            let x2 =
                stateVariables[await resolvePathToNodeIdx("x2")].stateValues
                    .value.tree;
            expect(x2).eq(expectedX);
            let x3 =
                stateVariables[await resolvePathToNodeIdx("x3")].stateValues
                    .value.tree;
            expect(x3).eq(expectedX);

            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantSeed,
            ).eq(variantIndex.toString());
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantIndex,
            ).eq(variantIndex);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantName,
            ).eq(variantName);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(variantNames);
        }

        let createDoenetML = (extra: string) => `
        ${extra}
        <variantControl numVariants="5" variantNames="avocado  broccoli   cArrot  dill Eggplant"/>
        <p>Selected variable:
        <select name="s">
          <option selectForVariants="Dill"><math name="x">d</math></option>
          <option selectForVariants="carrot"><math name="x">c</math></option>
          <option selectForVariants="eggplant"><math name="x">e</math></option>
          <option selectForVariants="avocado"><math name="x">a</math></option>
          <option selectForVariants="broccoli"><math name="x">b</math></option>
        </select>
        </p>
        <p>Selected variable repeated: <math extend="$s.x" name="x2" /></p>
        <p>Selected variable repeated again: <math extend="$s" name="x3" /></p>
        `;

        // specify first variant index
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(`<text>hi</text>`),
            requestedVariantIndex: 1,
        });
        await check_variant(1);

        // specify third variant index
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(`<text>bye</text>`),
            requestedVariantIndex: 3,
        }));
        await check_variant(3);

        // specify large variant index
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(`<text>big</text>`),
            requestedVariantIndex: 20582310,
        }));
        await check_variant(5);

        // specify negative variant index
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(``),
            requestedVariantIndex: -20582308,
        }));
        await check_variant(2);

        // invalid variant index gives index 1
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(``),
            requestedVariantIndex: -NaN,
        }));
        await check_variant(1);

        // round non-integer variant index
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML(``),
            requestedVariantIndex: 4.5,
        }));
        await check_variant(5);
    });

    it("nested selects", async () => {
        let doenetML = `
    <variantControl numVariants="100" uniqueVariants="false" />

    <select name="s">
      <option><p name="p">Favorite color:
        <select name="item">
          <option><text>red</text></option>
          <option><text>orange</text></option>
          <option><text>green</text></option>
          <option><text>white</text></option>
          <option><text>chartreuse</text></option>
        </select>
      </p></option>
      <option><p name="p">Selected number: 
        <select name="item">
          <option><selectFromSequence from="1000" to="2000" /></option>
          <option><selectFromSequence from="-1000" to="-900" /></option>
        </select>
      </p></option>
      <option><p name="p">Chosen letter: <selectFromSequence type="letters" to="g" name="item" /></p></option>
      <option><p name="p">Variable: <select type="text" name="item">u v w x z y</select></p></option>
    </select>
    <p>Enter item $s.item as text: <answer name="ans"><textInput name="ti"/><award><text>$(s.item)</text></award></answer></p>
    `;

        let firstStringsToInd = {
            "Favorite color:": 0,
            "Selected number:": 1,
            "Chosen letter:": 2,
            "Variable:": 3,
        };

        // Test a bunch of variants
        for (let ind = 1; ind <= 5; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: Math.round(Math.random() * 1000),
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let p = stateVariables[await resolvePathToNodeIdx("s.p")];

            let variantInd = firstStringsToInd[p.activeChildren[0].trim()];
            expect(variantInd).not.eq(undefined);

            let secondValue =
                stateVariables[p.activeChildren[1].componentIdx].stateValues
                    .value;

            if (variantInd === 0) {
                let i = [
                    "red",
                    "orange",
                    "green",
                    "white",
                    "chartreuse",
                ].indexOf(secondValue);
                expect(i).not.eq(-1);
            } else if (variantInd === 1) {
                let num = secondValue;
                expect(Number.isInteger(num)).eq(true);
                if (num > 0) {
                    expect(num).gte(1000);
                    expect(num).lte(2000);
                } else {
                    expect(num).gte(-1000);
                    expect(num).lte(-900);
                }
            } else if (variantInd === 2) {
                let i = ["a", "b", "c", "d", "e", "f", "g"].indexOf(
                    secondValue,
                );
                expect(i).not.eq(-1);
            } else {
                let i = ["u", "v", "w", "x", "z", "y"].indexOf(secondValue);
                expect(i).not.eq(-1);
            }

            await updateTextInputValue({
                text: `${secondValue}`,
                componentIdx: await resolvePathToNodeIdx("ti"),
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

            await updateTextInputValue({
                text: `${secondValue}X`,
                componentIdx: await resolvePathToNodeIdx("ti"),
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

            await updateTextInputValue({
                text: `${secondValue}`,
                componentIdx: await resolvePathToNodeIdx("ti"),
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
        }
    });

    async function test_selected_problems(
        doenetML: string,
        ignoreSecondVariants = false,
    ) {
        let titlesToInd = {
            "A word problem": 1,
            "A number problem": 2,
        };
        let variantOfProblemsFound: { 0: number[]; 1: number[] } = {
            0: [],
            1: [],
        };

        let originalVariantInds: number[] = [];
        let originalSecondValues: (number | string)[] = [];

        // Test a bunch of variants
        for (let ind = 1; ind <= 10; ind++) {
            // show values don't change for same variant
            for (let ind2 = 0; ind2 < 2; ind2++) {
                let { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                    requestedVariantIndex: ind,
                });

                let stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                let variantInds: number[] = [];
                let secondValues: (number | string)[] = [];

                for (let i = 1; i <= 3; i++) {
                    //console.log({ i });
                    let problem =
                        stateVariables[
                            await resolvePathToNodeIdx(`problem${i}`)
                        ];
                    let variantInd = titlesToInd[problem.stateValues.title];

                    expect(variantInd).not.eq(undefined);

                    variantInds.push(variantInd);

                    let p =
                        stateVariables[problem.activeChildren[4].componentIdx];

                    if (variantInd === 1) {
                        expect(p.activeChildren[0].trim()).eq("Word:");
                        let problemVariantInd =
                            [
                                "angry",
                                "bad",
                                "churlish",
                                "drab",
                                "excoriated",
                            ].indexOf(
                                stateVariables[p.activeChildren[1].componentIdx]
                                    .stateValues.value,
                            ) + 1;
                        expect(problemVariantInd).not.eq(0);
                        if (
                            !variantOfProblemsFound[0].includes(
                                problemVariantInd,
                            )
                        ) {
                            variantOfProblemsFound[0].push(problemVariantInd);
                        }
                        expect(problemVariantInd).eq(
                            problem.stateValues.generatedVariantInfo.index,
                        );
                    } else {
                        expect(p.activeChildren[0].trim()).eq("Number:");
                        let num =
                            stateVariables[p.activeChildren[1].componentIdx]
                                .stateValues.value;
                        expect(Number.isInteger(num)).eq(true);
                        expect(num >= 1 && num <= 10).eq(true);

                        let problemVariantInd =
                            problem.stateValues.generatedVariantInfo.index;
                        if (
                            !variantOfProblemsFound[1].includes(
                                problemVariantInd,
                            )
                        ) {
                            variantOfProblemsFound[1].push(problemVariantInd);
                        }
                    }

                    let secondValue =
                        stateVariables[p.activeChildren[1].componentIdx]
                            .stateValues.value;
                    secondValues.push(secondValue);
                }

                if (ind2 === 0) {
                    originalVariantInds = variantInds;
                    originalSecondValues = secondValues;
                } else {
                    expect(variantInds).eqls(originalVariantInds);
                    expect(secondValues).eqls(originalSecondValues);
                }
            }
        }

        // make sure all problem variants were selected at least once
        expect(variantOfProblemsFound[0].sort()).eqls([1, 2, 3]);
        if (!ignoreSecondVariants) {
            expect(variantOfProblemsFound[1].sort()).eqls([1, 2, 3, 4]);
        }
    }

    it("selected problems", async () => {
        const doenetML = `
        <variantControl numVariants="100"/>
    
        <setup>
        <select name="s" numToSelect="3" withReplacement>
          <option><problem name="problem"><title>A word problem</title>
            <variantControl numVariants="3" variantNames="a b c" />
            <p>Word:
              <select>
                <option selectForVariants="b"><text>bad</text></option>
                <option selectForVariants="a"><text>angry</text></option>
                <option selectForVariants="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem name="problem"><title>A number problem</title>
            <variantControl numVariants="4" />
            <p>Number: <selectFromSequence to="10"/></p>
          </problem></option>
        </select>
        </setup>

        <problem extend="$s[1].problem" name="problem1" />
        <problem extend="$s[2].problem" name="problem2" />
        <problem extend="$s[3].problem" name="problem3" />
        `;

        await test_selected_problems(doenetML);
    });

    it("selected problems, one outside select", async () => {
        const doenetML = `
        <variantControl numVariants="100"/>
    
        <problem name="problem1"><title>A number problem</title>
          <variantControl numVariants="4" />
          <p>Number: <selectFromSequence to="10"/></p>
        </problem>
        <setup>
        <select name="s" numToSelect="2" withReplacement>
          <option><problem name="problem"><title>A word problem</title>
            <variantControl numVariants="3" variantNames="a b c" />
            <p>Word:
              <select>
                <option selectForVariants="b"><text>bad</text></option>
                <option selectForVariants="a"><text>angry</text></option>
                <option selectForVariants="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem name="problem"><title>A number problem</title>
            <variantControl numVariants="4" />
            <p>Number: <selectFromSequence to="10"/></p>
          </problem></option>
        </select>
        </setup>
        <problem extend="$s[1].problem" name="problem2" />
        <problem extend="$s[2].problem" name="problem3" />
        `;

        await test_selected_problems(doenetML);
    });

    it("selected problems, one without variant control", async () => {
        const doenetML = `
        <variantControl numVariants="100"/>
    
        <setup>
        <select name="s" numToSelect="3" withReplacement>
          <option><problem name="problem"><title>A word problem</title>
            <variantControl numVariants="3" variantNames="a b c" />
            <p>Word:
              <select>
                <option selectForVariants="b"><text>bad</text></option>
                <option selectForVariants="a"><text>angry</text></option>
                <option selectForVariants="c"><text>churlish</text></option>
              </select>
            </p>
          </problem></option>
          <option><problem name="problem"><title>A number problem</title>
            <text>Filler to move children to same spot</text>
            <p>Number: <selectFromSequence to="10"/></p>
          </problem></option>
        </select>
        </setup>

        <problem extend="$s[1].problem" name="problem1" />
        <problem extend="$s[2].problem" name="problem2" />
        <problem extend="$s[3].problem" name="problem3" />
        `;

        await test_selected_problems(doenetML, true);
    });

    it("select and sample random numbers", async () => {
        const doenetML = `
        <variantControl numVariants="100"/>
        <p><selectRandomNumbers name="s1" /></p>
        <p><sampleRandomNumbers name="s2" variantDeterminesSeed /></p>
        <p><selectRandomNumbers name="s3" type="gaussian" numToSelect="3" /></p>
        <p><sampleRandomNumbers name="s4" type="gaussian" numSamples="3" variantDeterminesSeed /></p>
        `;

        let originalNumbers: number[] = [];

        // Test a bunch of variants
        for (let ind = 1; ind <= 10; ind++) {
            // show values don't change for same variant
            for (let ind2 = 0; ind2 < 2; ind2++) {
                let { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML,
                    requestedVariantIndex: ind,
                });

                let stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                let valuesS1: number[] =
                    stateVariables[await resolvePathToNodeIdx("s1")].stateValues
                        .selectedValues;
                let valuesS3: number[] =
                    stateVariables[await resolvePathToNodeIdx("s3")].stateValues
                        .selectedValues;

                let valuesS2: number[] =
                    stateVariables[await resolvePathToNodeIdx("s2")].stateValues
                        .sampledValues;
                let valuesS4: number[] =
                    stateVariables[await resolvePathToNodeIdx("s4")].stateValues
                        .sampledValues;

                let allNumbers = [
                    ...valuesS1,
                    ...valuesS2,
                    ...valuesS3,
                    ...valuesS4,
                ];

                if (ind2 === 0) {
                    expect(allNumbers).not.eqls(originalNumbers);
                    originalNumbers = allNumbers;
                } else {
                    expect(allNumbers).eqls(originalNumbers);
                }
            }
        }
    });

    it("choiceInputs", async () => {
        let doenetML = `
    <variantControl numVariants="100"/>
    <p><choiceInput shuffleOrder name="c1">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput shuffleOrder inline name="c2">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput name="c3">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    <p><choiceInput inline name="c4">
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
      <choice><lorem generateWords="3" /></choice>
    </choiceInput></p>
    `;

        // let generatedVariantInfo;
        let originalChoiceOrders;
        let originalChoiceTexts;

        // Test a bunch of variants
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let orderC1 =
                stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                    .choiceOrder;
            let orderC2 =
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .choiceOrder;

            let orderC3 =
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .choiceOrder;
            let orderC4 =
                stateVariables[await resolvePathToNodeIdx("c4")].stateValues
                    .choiceOrder;

            let textC1 =
                stateVariables[await resolvePathToNodeIdx("c1")].stateValues
                    .choiceTexts;
            let textC2 =
                stateVariables[await resolvePathToNodeIdx("c2")].stateValues
                    .choiceTexts;

            let textC3 =
                stateVariables[await resolvePathToNodeIdx("c3")].stateValues
                    .choiceTexts;
            let textC4 =
                stateVariables[await resolvePathToNodeIdx("c4")].stateValues
                    .choiceTexts;

            let allOrders = [...orderC1, ...orderC2, ...orderC3, ...orderC4];
            let allTexts = [...textC1, ...textC2, ...textC3, ...textC4];
            expect(allOrders).not.eqls(originalChoiceOrders);
            originalChoiceOrders = allOrders;
            expect(allTexts).not.eqls(originalChoiceTexts);
            originalChoiceTexts = allTexts;
        }
    });

    it("excluded sequence items", async () => {
        let doenetML = `
        <variantControl numVariants="100"/>
        <selectFromSequence name="s1" from="1" to="2000000000" exclude="2000000000 3000000000 4000000000 5000000000 6000000000 8000000000 9000000000 1100000000 1200000000 1300000000 1400000000 1500000000 1600000000 1700000000 1900000000" />
        <selectFromSequence name="s2" from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" />
        <p>Enter $m: <answer name="ans1"><mathInput name="mi1"/><award>$s1</award></answer></p>
        <p>Enter $n: <answer name="ans2"><mathInput name="mi2"/><award>$s2</award></answer></p>
  
        `;

        // Test a bunch of variants
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let m =
                stateVariables[await resolvePathToNodeIdx("s1[1]")].stateValues
                    .value;
            let n =
                stateVariables[await resolvePathToNodeIdx("s2[1]")].stateValues
                    .value;

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
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

            await updateMathInputValue({
                latex: `${m}X`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}X`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
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

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
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
        }
    });

    it("excluded combinations of sequence items", async () => {
        let doenetML = `
        <variantControl numVariants="100"/>
        <selectFromSequence name="s1" from="1" to="20" exclude="2 3 4 5 6 8 9 11 12 13 14 15 16 17 19" excludeCombinations="(1 7) (1 10) (1 18) (7 10) (7 18) (7 20) (10 1) (10 7) (10 20) (18 1) (18 7) (18 20) (20 1) (20 10)" numToSelect="2" />
        <selectFromSequence name="s2" type="math" from="x" step="h" length="7" exclude="x+h x+2h x+3h x+5h" excludeCombinations="(x x+4h) (x+4h x+6h) (x+6h x)" numToSelect="2" />
        <selectFromSequence name="s3" type="letters" from="a" to="i" exclude="b c d e f h" excludeCombinations="(a i) (g a) (i g)" numToSelect="2" />
        <p>Enter $m: <answer name="ans1"><mathInput name="mi1"/><award><math>$s1[1]</math></award></answer></p>
        <p>Enter $x2: <answer name="ans2"><mathInput name="mi2"/><award><math>$s2[2]</math></award></answer></p>
        <p>Enter $l1: <answer name="ans3"><textInput name="ti3"/><award><text>$s3[1]</text></award></answer></p>
        `;

        // Test a bunch of variants
        for (let ind = 1; ind <= 4; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let m =
                stateVariables[await resolvePathToNodeIdx("s1[1]")].stateValues
                    .value;

            let x2 =
                stateVariables[await resolvePathToNodeIdx("s2[2]")].stateValues
                    .value;

            let l1 =
                stateVariables[await resolvePathToNodeIdx("s3[1]")].stateValues
                    .value;

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await updateMathInputValue({
                latex: `${me.fromAst(x2).toString()}`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateTextInputValue({
                text: `${l1}`,
                componentIdx: await resolvePathToNodeIdx("ti3"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans3"),
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
                stateVariables[await resolvePathToNodeIdx("ans3")].stateValues
                    .creditAchieved,
            ).eq(1);

            await updateMathInputValue({
                latex: `${m}X`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await updateMathInputValue({
                latex: `${me.fromAst(x2).toString()}X`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateTextInputValue({
                text: `${l1}X`,
                componentIdx: await resolvePathToNodeIdx("ti3"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans3"),
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
                stateVariables[await resolvePathToNodeIdx("ans3")].stateValues
                    .creditAchieved,
            ).eq(0);

            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await updateMathInputValue({
                latex: `${me.fromAst(x2).toString()}`,
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateTextInputValue({
                text: `${l1}`,
                componentIdx: await resolvePathToNodeIdx("ti3"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans1"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans2"),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx("ans3"),
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
                stateVariables[await resolvePathToNodeIdx("ans3")].stateValues
                    .creditAchieved,
            ).eq(1);
        }
    });

    it("document inherits variants from single problem", async () => {
        let doenetML = `
        <problem>
          <variantControl numVariants="2" variantNames="apple orange" />
          <setup>
            <select name="fruit">
              <option selectForVariants="apple"><text>apple</text></option>
              <option selectForVariants="orange"><text>orange</text></option>
            </select>
          </setup>
          <p>Enter $fruit:
            <answer name="ans" type="text">$fruit</answer>
          </p>
        </problem>
        `;

        // get both options and then they repeat
        for (let ind = 1; ind <= 3; ind++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: ind,
            });

            let fruit = ["apple", "orange"][(ind - 1) % 2];

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let textinputIdx =
                stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                    .inputChildren[0].componentIdx;

            expect(
                stateVariables[await resolvePathToNodeIdx("fruit[1][1]")]
                    .stateValues.value,
            ).eq(fruit);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["apple", "orange"]);
            expect(
                stateVariables[await resolvePathToNodeIdx("_document1")]
                    .sharedParameters.variantName,
            ).eq(fruit);

            await updateTextInputValue({
                text: fruit,
                componentIdx: textinputIdx,
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
                    .submittedResponses,
            ).eqls([fruit]);

            await updateTextInputValue({
                text: `${fruit}s`,
                componentIdx: textinputIdx,
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
                    .submittedResponses,
            ).eqls([fruit + "s"]);

            await updateTextInputValue({
                text: fruit,
                componentIdx: textinputIdx,
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
                    .submittedResponses,
            ).eqls([fruit]);
        }
    });

    it("adding non-random component does not change what is selected in a variant", async () => {
        // TODO: this doesn't work when we turn off uniqueVariants.  Fix so that it works in that case as well.
        //     const variantControl = `
        // <variantControl uniqueVariants="false" />
        //     `;

        const variantControl = "";

        let randomPiece1 = `
      <selectFromSequence length="1000" name="n" />
    `;

        let randomPiece2 = `
      <select name="a">a b c d e f g h i j k l m n o p q r s t u v w x y z</select>
    `;

        let randomPiece3 = `
      <lorem generateWords="3" name="w" />
    `;

        let randomPiece4 = `
      <section>
        <variantControl />

        <title>Random number</title>
        <selectFromSequence length="4" name='m' />
      </section>
    `;

        let nonRandom1 = `
      <solution>Hello</solution>
    `;

        let nonRandom2 = `
      <group>
        <p>one</p>
        <p>two</p>
      </group>
    `;

        let nonRandom3 = `
      <repeat for="1 2 3 4" valueName="v" indexName="i" name='ps'>
        <p>$i, $v</p>
      </repeat>
    `;

        let nonRandom4 = `
       <section>
         <title>New section</title>
         <p>content</p>
        </section>
    `;

        let doenetML1 = variantControl + randomPiece1 + randomPiece2;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: doenetML1,
            requestedVariantIndex: 1,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let n =
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value;
        let a =
            stateVariables[await resolvePathToNodeIdx("a[1][1]")].stateValues
                .value.tree;

        let doenetML2 =
            variantControl +
            randomPiece1 +
            nonRandom1 +
            randomPiece2 +
            nonRandom2 +
            nonRandom3 +
            nonRandom4;

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: doenetML2,
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(n);
        expect(
            stateVariables[await resolvePathToNodeIdx("a[1][1]")].stateValues
                .value.tree,
        ).eq(a);

        let doenetML3 =
            variantControl +
            randomPiece1 +
            randomPiece2 +
            randomPiece3 +
            randomPiece4;

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: doenetML3,
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        let n2 =
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value;
        expect(n2).not.eq(n);
        n = n2;
        a =
            stateVariables[await resolvePathToNodeIdx("a[1][1]")].stateValues
                .value.tree;
        let w1 =
            stateVariables[await resolvePathToNodeIdx("w[1]")].stateValues
                .value;
        let w2 =
            stateVariables[await resolvePathToNodeIdx("w[2]")].stateValues
                .value;
        let w3 =
            stateVariables[await resolvePathToNodeIdx("w[3]")].stateValues
                .value;
        let m =
            stateVariables[await resolvePathToNodeIdx("m[1]")].stateValues
                .value;

        let doenetML4 =
            variantControl +
            randomPiece1 +
            nonRandom1 +
            randomPiece2 +
            nonRandom2 +
            randomPiece3 +
            nonRandom3 +
            randomPiece4 +
            nonRandom4;

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: doenetML4,
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(n);
        expect(
            stateVariables[await resolvePathToNodeIdx("a[1][1]")].stateValues
                .value.tree,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("w[1]")].stateValues
                .value,
        ).eq(w1);
        expect(
            stateVariables[await resolvePathToNodeIdx("w[2]")].stateValues
                .value,
        ).eq(w2);
        expect(
            stateVariables[await resolvePathToNodeIdx("w[3]")].stateValues
                .value,
        ).eq(w3);
        expect(
            stateVariables[await resolvePathToNodeIdx("m[1]")].stateValues
                .value,
        ).eq(m);
    });

    async function test_variants_include_exclude({
        createDoenetML,
        variantsFromProblem = false,
        documentAndProblemVariantsDiffer = false,
    }: {
        createDoenetML: ({
            include,
            exclude,
        }: {
            include?: string[];
            exclude?: string[];
        }) => string;
        variantsFromProblem?: boolean;
        documentAndProblemVariantsDiffer?: boolean;
    }) {
        // get two variants with no include/exclude
        let values: number[] = [];

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({}),
            requestedVariantIndex: 2,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        values.push(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq("b");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("2");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("b");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
        }

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({}),
            requestedVariantIndex: 5,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        values.push(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq("5");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(5);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq("e");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(5);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("e");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
        }

        // get same variants when add variantsToInclude

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({ include: ["b", "e"] }),
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "1" : "2");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "a" : "b");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(documentAndProblemVariantsDiffer ? ["a", "b"] : ["b", "e"]);
        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("2");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("b");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["b", "e"]);
        }

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({ include: ["b", "e"] }),
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[1]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "2" : "5");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "b" : "e");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(documentAndProblemVariantsDiffer ? ["a", "b"] : ["b", "e"]);
        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("e");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["b", "e"]);
        }

        // get same variants when add variantsToExclude

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({ exclude: ["a", "d", "h", "j"] }),
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "1" : "2");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "a" : "b");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c", "d", "e", "f"]
                : ["b", "c", "e", "f", "g", "i"],
        );
        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("2");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("b");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["b", "c", "e", "f", "g", "i"]);
        }

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({ exclude: ["a", "d", "h", "j"] }),
            requestedVariantIndex: 3,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[1]);

        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "3" : "5");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "c" : "e");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c", "d", "e", "f"]
                : ["b", "c", "e", "f", "g", "i"],
        );
        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(3);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("e");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["b", "c", "e", "f", "g", "i"]);
        }

        // get same variants when add variantsToInclude and variantsToExclude

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({
                include: ["a", "b", "d", "e", "g", "h"],
                exclude: ["a", "c", "d", "h", "j"],
            }),
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[0]);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "1" : "2");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "a" : "b");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c"]
                : ["b", "e", "g"],
        );
        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("2");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("b");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
            ).eqls(["b", "e", "g"]);
        }

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: createDoenetML({
                include: ["a", "b", "d", "e", "g", "h"],
                exclude: ["a", "c", "d", "h", "j"],
            }),
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(values[1]);

        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantSeed,
        ).eq(variantsFromProblem ? "2" : "5");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantIndex,
        ).eq(2);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.variantName,
        ).eq(documentAndProblemVariantsDiffer ? "b" : "e");
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .sharedParameters.allPossibleVariants,
        ).eqls(
            documentAndProblemVariantsDiffer
                ? ["a", "b", "c"]
                : ["b", "e", "g"],
        );

        if (variantsFromProblem) {
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantSeed,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantIndex,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.variantName,
            ).eq("e");
            expect(
                stateVariables[await resolvePathToNodeIdx("problem1")]
                    .sharedParameters.allPossibleVariants,
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
            <selectFromSequence name="n" length="100000" />
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
        <selectFromSequence name="n" length="100000" />
    </problem>
            `;
        }

        await test_variants_include_exclude({
            createDoenetML,
            variantsFromProblem: true,
            documentAndProblemVariantsDiffer: false,
        });
    });

    // Now that we are shuffling the order of unique variants,
    // the variants of the document and the problem no longer coincide with an extra child.
    // I think we can delete this test, as I'm not sure if there is anything left to test. (DQN, 2/10/2025)
    it.skip("variantsToInclude and variantsToExclude in problem, extra child", async () => {
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
        <selectFromSequence assignNames="n" length="100000" />
    </problem>
            `;
        }

        await test_variants_include_exclude({
            createDoenetML,
            variantsFromProblem: true,
            documentAndProblemVariantsDiffer: true,
        });
    });
});
