import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SelectFromSequence tag tests", async () => {
    async function test_values_separately({
        doenetML,
        componentNames,
        valid_values,
        num_samples,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentNames: string[];
        valid_values: any[][];
        num_samples: number;
        must_be_distinct?: boolean;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let [ind, name] of componentNames.entries()) {
                let value = stateVariables[name].stateValues.value;
                expect(
                    is_math
                        ? valid_values[ind].some((v) => v.equals(value))
                        : valid_values[ind].includes(value),
                ).eq(true, `Expected ${value} to be in ${valid_values[ind]}`);
            }

            if (must_be_distinct) {
                for (let name1 of componentNames) {
                    let val1 = stateVariables[name1].stateValues.value;
                    for (let name2 of componentNames) {
                        if (name2 !== name1) {
                            let val2 = stateVariables[name2].stateValues.value;
                            if (is_math) {
                                expect(val2.equals(val1)).eq(false);
                            } else {
                                expect(val2).not.eq(val1);
                            }
                        }
                    }
                }
            }
        }
    }

    async function test_combined_values({
        doenetML,
        componentNames,
        valid_combinations,
        num_samples,
        is_math = false,
    }: {
        doenetML: string;
        componentNames: string[];
        valid_combinations: any[][];
        num_samples: number;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let values = componentNames.map(
                (name) => stateVariables[name].stateValues.value,
            );

            expect(
                valid_combinations.some((comb) =>
                    comb.every((v, i) =>
                        is_math ? v.equals(values[i]) : v === values[i],
                    ),
                ),
            ).eq(
                true,
                `Expected (${values}) to be in ${valid_combinations.map((comb) => `(${comb})`)}`,
            );
        }
    }

    it("no parameters, select single number from 1 to 10", async () => {
        const doenetML = `<selectFromSequence assignNames="res"/>`;
        const valid_values = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single number from 1 to 6", async () => {
        const doenetML = `<selectFromSequence assignNames="res" to="6" />`;
        const valid_values = [[1, 2, 3, 4, 5, 6]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single number from -3 to 5", async () => {
        const doenetML = `<selectFromSequence assignNames="res" from="-3" to="5" />`;
        const valid_values = [[-3, -2, -1, 0, 1, 2, 3, 4, 5]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single number from -3 to 5, excluding 0", async () => {
        const doenetML = `<selectFromSequence assignNames="res" from="-3" to="5" exclude="0" />`;
        const valid_values = [[-3, -2, -1, 1, 2, 3, 4, 5]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single odd number from -3 to 5", async () => {
        const doenetML = `<selectFromSequence assignNames="res" from="-3" to="5" step="2" />`;
        const valid_values = [[-3, -1, 1, 3, 5]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single letter from c to h", async () => {
        const doenetML = `<selectFromSequence type="letters" assignNames="res" from="c" to="h" />`;
        const valid_values = [["c", "d", "e", "f", "g", "h"]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select two even numbers from -4 to 4, excluding 0", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2" numToSelect="2" from="-4" to="4" exclude="0" step="2" />`;
        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
            must_be_distinct: true,
        });
    });

    it("select two even numbers from -4 to 2, excluding 0 and combinations", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2" numToSelect="2" from="-4" to="2" exclude="0" step="2" excludeCombinations="(-4 -2) (-2 2) (2 -4)"/>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select two even numbers from -4 to 2, excluding 0 and combinations, as copies", async () => {
        const doenetML = `
    <numberList name="ec">-4 -2</numberList>
    <number name="e1">-2</number>
    <number name="e2">2</number>
    <math name="e3">-4</math>
    <numberList name="ec2">-4 -2</numberList>
    <numberList name="ec3">-2 2</numberList>
    <mathList name="ec4">2 -4</mathList>

    <p><selectFromSequence assignNames="res1 res2" numToSelect="2" from="-4" to="2" step="2" exclude="0" excludeCombinations="$ec ($e1 2) ($e2 $e3)" /></p>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select two even numbers from -4 to 2, excluding 0 and combinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2" numToSelect="2" from="-4" to="2" exclude="0 3 4 5 6 7 8" step="2" excludeCombinations="(-4 -2) (-2 2) (2 -4)"/>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three numbers from 1 to 3, exclude combinations with two 1s", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3" numToSelect="3" withReplacement from="1" to="3" excludeCombinations="(1 1 _) (1 _ 1) (_ 1 1)"/>`;
        const valid_combinations = [
            [1, 2, 2],
            [1, 2, 3],
            [1, 3, 2],
            [1, 3, 3],
            [2, 1, 2],
            [2, 1, 3],
            [3, 1, 2],
            [3, 1, 3],
            [2, 2, 1],
            [2, 3, 1],
            [3, 2, 1],
            [3, 3, 1],
            [2, 2, 2],
            [2, 2, 3],
            [2, 3, 2],
            [3, 2, 2],
            [3, 3, 2],
            [3, 2, 3],
            [2, 3, 3],
            [3, 3, 3],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three numbers from 1 to 3, exclude combinations with two 1s, duplicate excludes", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3" numToSelect="3" withReplacement from="1" to="3" excludeCombinations="(1 1 _) (1 _ 1) (_ 1 1) (3 1 1) (2 1 1) (1 1 1) (_ 1 1) (_ 1 1) (_ 1 1) (1 1 _) (1 _ 1) (1 1 _) (1 3 1) (1 2 1) (1 1 1)"/>`;
        const valid_combinations = [
            [1, 2, 2],
            [1, 2, 3],
            [1, 3, 2],
            [1, 3, 3],
            [2, 1, 2],
            [2, 1, 3],
            [3, 1, 2],
            [3, 1, 3],
            [2, 2, 1],
            [2, 3, 1],
            [3, 2, 1],
            [3, 3, 1],
            [2, 2, 2],
            [2, 2, 3],
            [2, 3, 2],
            [3, 2, 2],
            [3, 3, 2],
            [3, 2, 3],
            [2, 3, 3],
            [3, 3, 3],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select four numbers from 0 to 3, exclude positions of each number", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3 res4" numToSelect="4" withReplacement from="0" to="3"  excludeCombinations="(0 _ _ _) (_ 1 _ _) (_ _ 2 _) (_ _ _ 3)"/>`;
        const valid_values = [
            [1, 2, 3],
            [0, 2, 3],
            [0, 1, 3],
            [0, 1, 2],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three numbers from 1 to 3, without replacement exclude positions of each number", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3" numToSelect="3" from="1" to="3" excludeCombinations="(1 _ _) (_ 2 _) (_ _ 3)" />`;
        const valid_values = [
            [2, 3],
            [1, 3],
            [1, 2],
        ];

        const componentNames = ["/res1", "/res2", "/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            must_be_distinct: true,
        });
    });

    it("display error when select three numbers from 1 to 3, without replacement, exclude any place for 1", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><selectFromSequence numToSelect="3" name="sample1" from="1" to="3" excludeCombinations="(1 _ _) (_ 1 _) (_ _ 1)" /></p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Excluded over 70%");
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(8);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(122);
    });

    it("select 10 numbers from 1 to 10, without replacement, exclude positions of each number", async () => {
        // make sure that exclude combinations does not enumerate all combinations excluded
        // to count them
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3 res4 res5 res6 res7 res8 res9 res10" numToSelect="10" from="1" to="10" excludeCombinations="(1 _ _ _ _ _ _ _ _ _) (_ 2 _ _ _ _ _ _ _ _) (_ _ 3 _ _ _ _ _ _ _) (_ _ _ 4 _ _ _ _ _ _) (_ _ _ _ 5 _ _ _ _ _) (_ _ _ _ _ 6 _ _ _ _) (_ _ _ _ _ _ 7 _ _ _) (_ _ _ _ _ _ _ 8 _ _) (_ _ _ _ _ _ _ _ 9 _) (_ _ _ _ _ _ _ _ _ 10)" />`;
        let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const valid_values: number[][] = [];

        for (let j = 0; j < 10; j++) {
            let validNs = [...allNumbers];
            validNs.splice(j, 1);
            valid_values.push(validNs);
        }

        const componentNames = [
            "/res1",
            "/res2",
            "/res3",
            "/res4",
            "/res5",
            "/res6",
            "/res7",
            "/res8",
            "/res9",
            "/res10",
        ];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 5,
            must_be_distinct: true,
        });
    });

    it("select five even numbers with replacement from -4 to 4, excluding 0", async () => {
        const doenetML = `<selectFromSequence assignNames="res1 res2 res3 res4 res5" numToSelect="5" withReplacement from="-4" to="4" step="2" exclude="0" />`;
        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
        });
    });

    it("select five (number initially unresolved) even numbers with replacement from -4 to 4, excluding 0", async () => {
        const doenetML = `
    <selectFromSequence assignNames="res1 res2 res3 res4 res5" numToSelect="$n" withReplacement from="-4" to="4" step="2" exclude="0" />
    $n3{name="n2"}
    $num1{name="n"}
    <math name="num1">$n2+$num2+2</math>
    <math name="num2">$n3+$num3</math>
    $num3{name="n3"}
    <number name="num3">1</number>`;

        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 3,
        });
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence name="s" from="175" to="205" assignNames="u v w x y" numToSelect="5" /></p>
    <p name="p2"><selectFromSequence copySource="s" name="s2" asList="false" /></p>

    `,
        });

        let results: number[] = [];

        let stateVariables = await core.returnAllStateVariables(false, true);

        results.push(stateVariables["/u"].stateValues.value);
        results.push(stateVariables["/v"].stateValues.value);
        results.push(stateVariables["/w"].stateValues.value);
        results.push(stateVariables["/x"].stateValues.value);
        results.push(stateVariables["/y"].stateValues.value);

        for (let num of results) {
            expect(num).gte(175).lte(205);
        }
        expect(stateVariables["/p1"].stateValues.text).eq(results.join(", "));
        expect(stateVariables["/p2"].stateValues.text).eq(results.join(""));
    });

    it("copies don't resample", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">
    <selectFromSequence name="sample1" to="100" assignNames="n1" />
    <selectFromSequence name="sample2" to="100" assignNames="n2" />
    </p>

    <p>
    $sample1{name="noresample1"}
    $sample2{name="noresample2"}
    $noresample1{name="noreresample1"}
    $noresample2{name="noreresample2"}
    </p>

    <p copySource="p1" name="noresamplep"/>

    <p copySource="noresamplep" name="noreresamplep"/>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let num1 = stateVariables["/n1"].stateValues.value;
        let num2 = stateVariables["/n2"].stateValues.value;
        expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 100).eq(true);
        expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 100).eq(true);
        expect(
            stateVariables[
                stateVariables["/noresample1"].replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noresample2"].replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables["/noreresample1"].replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noreresample2"].replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num2);

        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
    });

    it("select doesn't change dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="numToSelect"/>
    <mathInput prefill="3" name="maxNum"/>
    <p>
    <selectFromSequence name="sample1" withReplacement length="$maxNum" numToSelect="$numToSelect" />
    </p>

    <mathInput prefill="2" name="numToSelect2"/>
    <mathInput prefill="10" name="maxNum2"/>
    <p>
    <selectFromSequence name="sample2" withReplacement length="$maxNum2" numToSelect="$numToSelect2" />
    </p>
    <p>$maxNum2.value{assignNames="maxNum2a"}</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let sample1replacements = stateVariables["/sample1"].replacements!;
        let sample2replacements = stateVariables["/sample2"].replacements!;
        expect(sample1replacements.length).eq(5);
        expect(sample2replacements.length).eq(2);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        for (let num of sample1numbers) {
            expect([1, 2, 3].includes(num)).eq(true);
        }
        for (let num of sample2numbers) {
            expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
        }

        // Nothing changes when change mathInputs
        await updateMathInputValue({
            latex: "7",
            name: "/numToSelect",
            core,
        });
        await updateMathInputValue({
            latex: "11",
            name: "/maxNum",
            core,
        });
        await updateMathInputValue({
            latex: "16",
            name: "/numToSelect2",
            core,
        });
        await updateMathInputValue({
            latex: "18",
            name: "/maxNum2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sample1replacements = stateVariables["/sample1"].replacements!;
        sample2replacements = stateVariables["/sample2"].replacements!;

        expect(
            sample1replacements.map(
                (x) => stateVariables[x.componentIdx].stateValues.value,
            ),
        ).eqls(sample1numbers);
        expect(
            sample2replacements.map(
                (x) => stateVariables[x.componentIdx].stateValues.value,
            ),
        ).eqls(sample2numbers);
    });

    it("select doesn't resample in dynamic map", async () => {
        let core = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <p name="p1"><map assignNames="a b c d e f" name="map1">
      <template newNamespace><selectFromSequence assignNames="n" to="100" /></template>
      <sources>
          <sequence length="$mi1" />
      </sources>
    </map></p>
    
    <p name="p2">$map1</p>

    $p1{name="p3"}
    $p2{name="p4"}

    $p3{name="p5"}
    $p4{name="p6"}
    `,
        });

        async function check_sampled_numbers(sampledNumbers: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables["/p1"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p2"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p3"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p4"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p5"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p6"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);
        }

        let sampledNumbers: number[] = [];

        // initially nothing
        await check_sampled_numbers([]);

        // sample one variable
        await updateMathInputValue({ latex: "1", name: "/mi1", core });

        let stateVariables = await core.returnAllStateVariables(false, true);
        sampledNumbers.push(stateVariables["/a/n"].stateValues.value);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get same number back
        await updateMathInputValue({ latex: "1", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);

        // get two more samples
        await updateMathInputValue({ latex: "3", name: "/mi1", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        let n1 = stateVariables["/a/n"].stateValues.value;
        let n2 = stateVariables["/b/n"].stateValues.value;
        let n3 = stateVariables["/c/n"].stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        sampledNumbers.push(n2);
        sampledNumbers.push(n3);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get first two numbers back
        await updateMathInputValue({ latex: "2", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers.slice(0, 2));

        // get six total samples
        await updateMathInputValue({ latex: "6", name: "/mi1", core });

        stateVariables = await core.returnAllStateVariables(false, true);
        n1 = stateVariables["/a/n"].stateValues.value;
        n2 = stateVariables["/b/n"].stateValues.value;
        n3 = stateVariables["/c/n"].stateValues.value;
        let n4 = stateVariables["/d/n"].stateValues.value;
        let n5 = stateVariables["/e/n"].stateValues.value;
        let n6 = stateVariables["/f/n"].stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        expect(n2).eq(sampledNumbers[1]);
        expect(n3).eq(sampledNumbers[2]);
        sampledNumbers.push(n4);
        sampledNumbers.push(n5);
        sampledNumbers.push(n6);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({ latex: "6", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);
    });

    it("select single math", async () => {
        const doenetML = `<selectFromSequence type="math" from="x" step="y" length="3" assignNames="res"/>`;
        const valid_values = [
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
        ];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 3,
            is_math: true,
        });
    });

    it("select multiple maths", async () => {
        const doenetML = `<selectFromSequence type="math" from="x" step="y" length="3" numToSelect="3" assignNames="res1 res2 res3"/>`;
        const valid_values = [
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 3,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("select multiple maths, new namespace", async () => {
        const doenetML = `<selectFromSequence name="s" newNamespace type="math" from="x" step="y" length="3" numToSelect="3" assignNames="res1 res2 res3"/>`;
        const valid_values = [
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
        ];
        const componentNames = ["/s/res1", "/s/res2", "/s/res3"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 3,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("selectFromSequence with hide will hide replacements", async () => {
        let core = await createTestCore({
            doenetML: `
      <p name="p1"><selectFromSequence type="letters" assignNames="c" from="a" to="e" />, <selectFromSequence type="letters" assignNames="d" from="a" to="e" hide /></p>
      <p name="p2">$c, $d{hide="false"}</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c = await stateVariables["/c"].stateValues.value;
        let d = await stateVariables["/d"].stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);
    });

    it("select multiple numbers with excludeCombinations, handles round-off error", async () => {
        // Third number selected will be 0.1*3, which isn't exactly 0.3 due to round off error.
        // Even so, excluding 0.3 works successfully.
        const doenetML = `<selectFromSequence from="0.1" to="0.3" step="0.1" numToSelect="2" excludeCombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            [0.1, 0.2],
            [0.2, 0.1],
            [0.1 * 3, 0.2],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select multiple maths with excludeCombinations, handles round-off error", async () => {
        // Third number selected will be 0.1*3, which isn't exactly 0.3 due to round off error.
        // Even so, excluding 0.3 works successfully.
        const doenetML = `<selectFromSequence type="math" from="0.1" to="0.3" step="0.1" numToSelect="2" excludeCombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            [me.fromAst(0.1), me.fromAst(0.2)],
            [me.fromAst(0.2), me.fromAst(0.1)],
            [me.fromAst(0.3), me.fromAst(0.2)],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple maths with excludes and excludeCombinations", async () => {
        const doenetML = `<selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y" excludeCombinations="(x x+y) (x+y x+3y) (x+3y x)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple maths with excludes and excludeCombinations, as copies", async () => {
        const doenetML = `
    <mathList name="ec">x x+y</mathList>
    <math name="e1">x+y</math>
    <math name="e2">x+3y</math>
    <math name="e3">x</math>
    <mathList name="ec2">x x+y</mathList>
    <mathList name="ec3">x+y x+3y</mathList>
    <selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y" excludeCombinations="$ec ($e1 x+3y) ($e2 $e3)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple maths with excludes and excludeCombinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y 2z q y" excludeCombinations="(x x+y) (x+y x+3y) (x+3y x)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
            is_math: true,
        });
    });

    it("select multiple letters with excludes and excludeCombinations", async () => {
        const doenetML = `<selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p" excludeCombinations="(m v) (s m) (v s)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select multiple letters with excludes and excludeCombinations, as copies", async () => {
        const doenetML = `
    <textList name="ec">m v</textList>
    <text name="e1">s</text>
    <text name="e2">v</text>
    <text name="e3">s</text>
    <textList name="ec2">m v</textList>
    <textList name="ec3">s m</textList>
    <selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p" excludeCombinations="$ec ($e1 m) ($e2 $e3)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select multiple letters with excludes and excludeCombinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p q r z a" excludeCombinations="(m v) (s m) (v s)" assignNames="res1 res2"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select numbers and sort", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence numToSelect="20" sortResults="true" withReplacement="true" from="-20" to="20" /></p>

    $p1{name="p2"}
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let originalNumbers = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let secondNumbers = stateVariables["/p2"].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect([...originalNumbers].sort((a, b) => a - b)).eqls(
            originalNumbers,
        );
        expect(secondNumbers).eqls(originalNumbers);
    });

    it("select letters and sort", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence type="letters" numToSelect="20" sortResults="true" withReplacement="true" from="a" to="bz" /></p>

    $p1{name="p2"}
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let originalNumbers = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let secondNumbers = stateVariables["/p2"].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        function compare_letters(a: string, b: string) {
            // shorter letter combinations are sorted before longer ones
            if (a.length === b.length) {
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return a.length - b.length;
            }
        }
        expect([...originalNumbers].sort(compare_letters)).eqls(
            originalNumbers,
        );
        expect(secondNumbers).eqls(originalNumbers);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the selectFromSequence is hidden
    it("selectFromSequence hides dynamically", async () => {
        let core = await createTestCore({
            doenetML: `

    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><selectFromSequence assignNames="c" hide="$h1" type="letters" from="a" to="e"/>, <selectFromSequence assignnames="d" hide="$h2" type="letters" from="a" to="e"/></p>
    <p name="p2">$c, $d</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c = await stateVariables["/c"].stateValues.value;
        let d = await stateVariables["/d"].stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: true,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/h2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`, ${d}`);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: false,
            name: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            name: "/h2",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);
    });

    it("selectFromSequence defaults to fixed", async () => {
        let core = await createTestCore({
            doenetML: `
    <booleanInput name='f1' prefill="false" >
      <label>Fix first select</label>
    </booleanInput>
    <booleanInput name='f2' prefill="true" >
      <label>Fix second select</label>
    </booleanInput>
    <p>
      <selectFromSequence assignNames="a" type="letters" from="a" to="e"/>
      <selectFromSequence assignNames="b" fixed="$f1" type="letters" from="a" to="e"/>
      <selectFromSequence assignNames="c" fixed="$f2" type="letters" from="a" to="e"/>
    </p>
    <p>
      $a{name="a2"} 
      $b{name="b2"}
      $c{name="c2"}
    </p>
    <p>
      <textInput name="a3">$a</textInput>
      <textInput name="b3">$b</textInput>
      <textInput name="c3">$c</textInput>
    </p>
    <p>
      <textInput name="a4">$a2</textInput>
      <textInput name="b4">$b2</textInput>
      <textInput name="c4">$c2</textInput>
    </p>
    <p>
      $a.fixed{assignNames="af"}
      $b.fixed{assignNames="bf"}
      $c.fixed{assignNames="cf"}
    </p>
    <p>
      $a2.fixed{assignNames="a2f"}
      $b2.fixed{assignNames="b2f"}
      $c2.fixed{assignNames="c2f"}
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a = stateVariables["/a"].stateValues.value;
        let b = stateVariables["/b"].stateValues.value;
        let c = stateVariables["/c"].stateValues.value;
        expect(["a", "b", "c", "d", "e"].includes(a)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(b)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);

        expect(stateVariables["/a2"].stateValues.value).eq(a);
        expect(stateVariables["/b2"].stateValues.value).eq(b);
        expect(stateVariables["/c2"].stateValues.value).eq(c);

        expect(stateVariables["/af"].stateValues.value).eq(true);
        expect(stateVariables["/bf"].stateValues.value).eq(false);
        expect(stateVariables["/cf"].stateValues.value).eq(true);
        expect(stateVariables["/a2f"].stateValues.value).eq(true);
        expect(stateVariables["/b2f"].stateValues.value).eq(false);
        expect(stateVariables["/c2f"].stateValues.value).eq(true);

        await updateTextInputValue({ text: "f", name: "/a3", core });
        await updateTextInputValue({ text: "g", name: "/b3", core });
        await updateTextInputValue({ text: "h", name: "/c3", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/a"].stateValues.value).eq(a);
        expect(stateVariables["/b"].stateValues.value).eq("g");
        expect(stateVariables["/c"].stateValues.value).eq(c);
        expect(stateVariables["/a2"].stateValues.value).eq(a);
        expect(stateVariables["/b2"].stateValues.value).eq("g");
        expect(stateVariables["/c2"].stateValues.value).eq(c);

        await updateTextInputValue({ text: "i", name: "/a4", core });
        await updateTextInputValue({ text: "j", name: "/b4", core });
        await updateTextInputValue({ text: "k", name: "/c4", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/a"].stateValues.value).eq(a);
        expect(stateVariables["/b"].stateValues.value).eq("j");
        expect(stateVariables["/c"].stateValues.value).eq(c);
        expect(stateVariables["/a2"].stateValues.value).eq(a);
        expect(stateVariables["/b2"].stateValues.value).eq("j");
        expect(stateVariables["/c2"].stateValues.value).eq(c);

        await updateBooleanInputValue({
            boolean: true,
            name: "/f1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            name: "/f2",
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/af"].stateValues.value).eq(true);
        expect(stateVariables["/bf"].stateValues.value).eq(true);
        expect(stateVariables["/cf"].stateValues.value).eq(false);
        expect(stateVariables["/a2f"].stateValues.value).eq(true);
        expect(stateVariables["/b2f"].stateValues.value).eq(true);
        expect(stateVariables["/c2f"].stateValues.value).eq(false);

        await updateTextInputValue({ text: "l", name: "/a3", core });
        await updateTextInputValue({ text: "m", name: "/b3", core });
        await updateTextInputValue({ text: "n", name: "/c3", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/a"].stateValues.value).eq(a);
        expect(stateVariables["/b"].stateValues.value).eq("j");
        expect(stateVariables["/c"].stateValues.value).eq("n");
        expect(stateVariables["/a2"].stateValues.value).eq(a);
        expect(stateVariables["/b2"].stateValues.value).eq("j");
        expect(stateVariables["/c2"].stateValues.value).eq("n");

        await updateTextInputValue({ text: "o", name: "/a4", core });
        await updateTextInputValue({ text: "p", name: "/b4", core });
        await updateTextInputValue({ text: "q", name: "/c4", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/a"].stateValues.value).eq(a);
        expect(stateVariables["/b"].stateValues.value).eq("j");
        expect(stateVariables["/c"].stateValues.value).eq("q");
        expect(stateVariables["/a2"].stateValues.value).eq(a);
        expect(stateVariables["/b2"].stateValues.value).eq("j");
        expect(stateVariables["/c2"].stateValues.value).eq("q");
    });

    it("numToSelect from selectFromSequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <selectFromSequence name="nums1" from="1" to="10" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" /></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <selectFromSequence name="nums2" from="1" to="10" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" /></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <selectFromSequence name="nums3" from="1" to="10" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" /></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <selectFromSequence name="nums4" from="1" to="10" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" /></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <selectFromSequence name="nums5" from="1" to="10" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" /></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let n1 = stateVariables["/n1"].stateValues.value;
        let n2 = stateVariables["/n2"].stateValues.value;
        let n3 = stateVariables["/n3"].stateValues.value;
        let n4 = stateVariables["/n4"].stateValues.value;
        let n5 = stateVariables["/n5"].stateValues.value;

        let nums1 = stateVariables["/nums1"].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums2 = stateVariables["/nums2"].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums3 = stateVariables["/nums3"].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums4 = stateVariables["/nums4"].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums5 = stateVariables["/nums5"].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(nums1.length).eq(n1);
        expect(nums2.length).eq(n2);
        expect(nums3.length).eq(n3);
        expect(nums4.length).eq(n4);
        expect(nums5.length).eq(n5);

        nums1.length = 5;
        nums2.length = 5;
        nums3.length = 5;
        nums4.length = 5;
        nums5.length = 5;

        nums1.fill("", n1);
        nums2.fill("", n2);
        nums3.fill("", n3);
        nums4.fill("", n4);
        nums5.fill("", n5);

        let l = ["a", "b", "c", "d", "e"];

        expect(stateVariables["/p1"].stateValues.text).eq(
            nums1.map((v, i) => `${l[i]}1=${v}`).join(", "),
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            nums2.map((v, i) => `${l[i]}2=${v}`).join(", "),
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            nums3.map((v, i) => `${l[i]}3=${v}`).join(", "),
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            nums4.map((v, i) => `${l[i]}4=${v}`).join(", "),
        );
        expect(stateVariables["/p5"].stateValues.text).eq(
            nums5.map((v, i) => `${l[i]}5=${v}`).join(", "),
        );
    });

    it("rounding", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><selectFromSequence assignNames="n1" from="10" to="20" step="0.000001" displayDigits="10" /></p>
    <p><selectFromSequence assignNames="n2" from="10" to="20" step="0.000001" displayDigits="3" /></p>
    <p><selectFromSequence assignNames="n3" from="10" to="20" step="0.000001" displayDecimals="3" /></p>
    <p><selectFromSequence assignNames="n4" from="10" to="20" displayDigits="3" padZeros /></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let n1 = stateVariables["/n1"].stateValues.value;
        let n2 = stateVariables["/n2"].stateValues.value;
        let n3 = stateVariables["/n3"].stateValues.value;
        let n4 = stateVariables["/n4"].stateValues.value;

        expect(stateVariables["/n1"].stateValues.text).eq(
            String(Math.round(n1 * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n2"].stateValues.text).eq(
            String(Math.round(n2 * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n3"].stateValues.text).eq(
            String(Math.round(n3 * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n4"].stateValues.text).eq(String(n4) + ".0");

        expect(stateVariables["/n1a"].stateValues.text).eq(
            String(Math.round(n1 * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n2a"].stateValues.text).eq(
            String(Math.round(n2 * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n3a"].stateValues.text).eq(
            String(Math.round(n3 * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n4a"].stateValues.text).eq(String(n4) + ".0");
    });

    it("display error when select 3 from 1, inside text", async () => {
        let core = await createTestCore({
            doenetML: `
          <text><selectFromSequence numToSelect="3" length="1" /></text>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Cannot select 3 values from a sequence of length 1",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(17);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(65);
    });

    it("check bugfix for non-constant exclude and unique variants", async () => {
        let core = await createTestCore({
            doenetML: `
    <variantControl uniqueVariants />
    <p>Number to exclude: <number name="exclude">2</number></p>
    <p><selectFromSequence assignNames="n" from="1" to="3" exclude="$exclude" /></p>

    <p><number name="na">$n</number></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let n = stateVariables["/n"].stateValues.value;

        expect(stateVariables["/n"].stateValues.value).eq(n);

        expect(stateVariables["/na"].stateValues.value).eq(n);

        expect(n === 1 || n === 3).eq(true);
    });

    it("check bugfix for non-constant exclude and defaulting to unique variants", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number to exclude: <number name="exclude">2</number></p>
    <p><selectFromSequence assignNames="n" from="1" to="3" exclude="$exclude" /></p>

    <p><number name="na">$n</number></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let n = stateVariables["/n"].stateValues.value;

        expect(stateVariables["/n"].stateValues.value).eq(n);

        expect(stateVariables["/na"].stateValues.value).eq(n);

        expect(n === 1 || n === 3).eq(true);
    });
});
