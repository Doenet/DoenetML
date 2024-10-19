import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateTextInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("selectPrimeNumbers tag tests", async () => {
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
            const stateVariables = await returnAllStateVariables(core);
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
            const stateVariables = await returnAllStateVariables(core);
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

    it("no parameters, select single prime number from 2 to 100", async () => {
        const doenetML = `<selectPrimeNumbers assignNames="res"/>`;
        const valid_values = [
            [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
                61, 67, 71, 73, 79, 83, 89, 97,
            ],
        ];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single prime number from 2 to 6", async () => {
        const doenetML = `<selectPrimeNumbers assignNames="res" maxValue="6"/>`;
        const valid_values = [[2, 3, 5]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single prime number from 9 to 39", async () => {
        const doenetML = `<selectPrimeNumbers assignNames="res" minValue="9" maxValue="39" />`;
        const valid_values = [[11, 13, 17, 19, 23, 29, 31, 37]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select single prime number from 9 to 39, excluding 19", async () => {
        const doenetML = `<selectPrimeNumbers assignNames="res" minValue="9" maxValue="39" exclude="19" />`;
        const valid_values = [[11, 13, 17, 23, 29, 31, 37]];
        const componentNames = ["/res"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 30,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" assignNames="res1 res2" minValue="1020" maxValue="1050" exclude="1031 1049" />`;
        const valid_values = [
            [1021, 1033, 1039],
            [1021, 1033, 1039],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
            must_be_distinct: true,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" assignNames="res1 res2" minValue="1020" maxValue="1050" exclude="1031 1049"  excludeCombinations="(1021 1033) (1033 1039) (1039 1021)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations, as copies", async () => {
        const doenetML = `
    <numberList name="ec">1021 1033</numberList>
    <number name="e1">1033</number>
    <number name="e2">1039</number>
    <math name="e3">1021</math>
    <numberList name="ec2">1021 1033</numberList>
    <numberList name="ec3">1033 1039</numberList>
    <mathList name="ec4">1039 1021</mathList>
    <selectPrimeNumbers numToSelect="2" assignNames="res1 res2" minValue="1020" maxValue="1050" exclude="1031 1049"  excludeCombinations="$ec ($e1 1039) ($e2 $e3)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations, exclude extras", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" assignNames="res1 res2" minValue="1020" maxValue="1050" exclude="19 1031 1036 1037 1038 1049 1050 1061" excludeCombinations="(1021 1033) (1033 1039) (1039 1021)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentNames = ["/res1", "/res2"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three prime numbers up to 5, exclude combinations with two 2s", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" withReplacement assignNames="res1 res2 res3" maxValue="5" excludeCombinations="(2 2 _) (2 _ 2) (_ 2 2)" />`;
        const valid_combinations = [
            [2, 3, 3],
            [2, 3, 5],
            [2, 5, 3],
            [2, 5, 5],
            [3, 2, 3],
            [3, 2, 5],
            [5, 2, 3],
            [5, 2, 5],
            [3, 3, 2],
            [3, 5, 2],
            [5, 3, 2],
            [5, 5, 2],
            [3, 3, 3],
            [3, 3, 5],
            [3, 5, 3],
            [5, 3, 3],
            [5, 5, 3],
            [5, 3, 5],
            [3, 5, 5],
            [5, 5, 5],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three prime numbers up to 5, exclude combinations with two 2s, duplicate excludes", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" withReplacement assignNames="res1 res2 res3" maxValue="5" excludeCombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" />`;
        const valid_combinations = [
            [2, 3, 3],
            [2, 3, 5],
            [2, 5, 3],
            [2, 5, 5],
            [3, 2, 3],
            [3, 2, 5],
            [5, 2, 3],
            [5, 2, 5],
            [3, 3, 2],
            [3, 5, 2],
            [5, 3, 2],
            [5, 5, 2],
            [3, 3, 3],
            [3, 3, 5],
            [3, 5, 3],
            [5, 3, 3],
            [5, 5, 3],
            [5, 3, 5],
            [3, 5, 5],
            [5, 5, 5],
        ];
        const componentNames = ["/res1", "/res2", "/res3"];

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentNames,
            num_samples: 10,
        });
    });

    it("select four prime numbers from 3 to 11, exclude positions of each number", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="4" withReplacement assignNames="res1 res2 res3 res4" minValue="3" maxValue="11" excludeCombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" />`;
        const valid_values = [
            [5, 7, 11],
            [3, 7, 11],
            [3, 5, 11],
            [3, 5, 7],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
        });
    });

    it("select three prime numbers up to 5, without replacement exclude positions of each number", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" assignNames="res1 res2 res3" maxValue="5" excludeCombinations="(2 _ _) (_ 3 _) (_ _ 5)" />`;
        const valid_values = [
            [3, 5],
            [2, 5],
            [2, 3],
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

    it("select three prime numbers up to 5, without replacement, exclude any place for 2", async () => {
        let core = await createTestCore({
            doenetML: `
    <selectPrimeNumbers numToSelect="3" assignNames="res1 res2 res3" maxValue="5" excludeCombinations="(2 _ _) (_ 2 _) (_ _ 2)" />
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Excluded over 70%");
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(130);
    });

    it("select 10 prime numbers from the first 10, without replacement, exclude positions of each number", async () => {
        // make sure that exclude combinations does not enumerate all combinations excluded
        // to count them
        const doenetML = `<selectPrimeNumbers numToSelect="10" assignNames="res1 res2 res3 res4 res5 res6 res7 res8 res9 res10" maxValue="30" excludeCombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" />`;

        const allNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
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

    it("select five prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="5" withReplacement assignNames="res1 res2 res3 res4 res5" minValue="1020" maxValue="1050" exclude="1031 1049" />`;
        const valid_values = [
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 5,
        });
    });

    it("select five (number initially unresolved) prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `
    <selectPrimeNumbers numToSelect="$n" withReplacement assignNames="res1 res2 res3 res4 res5" minValue="1020" maxValue="1050" exclude="1031 1049" />
    $n3{name="n2"}
    $num1{name="n"}
    <math name="num1">$n2+$num2+2</math>
    <math name="num2">$n3+$num3</math>
    $num3{name="n3"}
    <number name="num3">1</number>`;

        const valid_values = [
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
        ];

        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 5,
        });
    });

    it("select 100 large prime numbers, check that are prime", async () => {
        let core = await createTestCore({
            doenetML: `
    <selectPrimeNumbers numToSelect="100" name="sample" maxValue="1000000" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        for (let ind = 0; ind < 100; ind++) {
            let num =
                stateVariables[
                    stateVariables["/sample"].replacements![ind].componentName
                ].stateValues.value;

            expect(Number.isInteger(num) && num >= 2 && num <= 1000000).eq(
                true,
            );

            let isPrime = true;
            let sqrtNum = Math.sqrt(num);
            for (let i = 2; i <= sqrtNum; i++) {
                if (num % i === 0) {
                    isPrime = false;
                    break;
                }
            }
            expect(isPrime).eq(true);
        }
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers name="s" minValue="175" maxValue="205" assignNames="u v w x y" numToSelect="5" /></p>
    <p name="p2"><selectPrimeNumbers copySource="s" name="s2" asList="false" /></p>
    `,
        });

        let results: number[] = [];

        let stateVariables = await returnAllStateVariables(core);

        results.push(stateVariables["/u"].stateValues.value);
        results.push(stateVariables["/v"].stateValues.value);
        results.push(stateVariables["/w"].stateValues.value);
        results.push(stateVariables["/x"].stateValues.value);
        results.push(stateVariables["/y"].stateValues.value);

        for (let num of results) {
            expect([179, 181, 191, 193, 197, 199].includes(num));
        }
        expect(stateVariables["/p1"].stateValues.text).eq(results.join(", "));
        expect(stateVariables["/p2"].stateValues.text).eq(results.join(""));
    });

    it("copies don't resample", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1">
    <selectPrimeNumbers name="sample1" maxValue="100" assignNames="n1" />
    <selectPrimeNumbers name="sample2" maxValue="100" assignNames="n2" />
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

        let stateVariables = await returnAllStateVariables(core);
        let num1 = stateVariables["/n1"].stateValues.value;
        let num2 = stateVariables["/n2"].stateValues.value;
        expect(Number.isInteger(num1) && num1 >= 2 && num1 <= 100).eq(true);
        expect(Number.isInteger(num2) && num2 >= 2 && num2 <= 100).eq(true);
        // check numbers are prime
        for (let num of [num1, num2]) {
            let sqrtNum = Math.sqrt(num);
            for (let i = 2; i <= sqrtNum; i++) {
                expect(num % i).greaterThan(0);
            }
        }

        expect(
            stateVariables[
                stateVariables["/noresample1"].replacements![0].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noresample2"].replacements![0].componentName
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables["/noreresample1"].replacements![0].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noreresample2"].replacements![0].componentName
            ].stateValues.value,
        ).eq(num2);

        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[1].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noresamplep"].activeChildren[3].componentName
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[1].componentName
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables["/noreresamplep"].activeChildren[3].componentName
            ].stateValues.value,
        ).eq(num2);
    });

    it("select doesn't change dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="5" name="numToSelect"/>
    <mathInput prefill="3" name="maxNum"/>
    <p>
    <selectPrimeNumbers name="sample1" withReplacement maxValue="$maxNum" numToSelect="$numToSelect" />
    </p>

    <mathInput prefill="2" name="numToSelect2"/>
    <mathInput prefill="10" name="maxNum2"/>
    <p>
    <selectPrimeNumbers name="sample2" withReplacement maxValue="$maxNum2" numToSelect="$numToSelect2" />
    </p>
    <p>$maxNum2.value{assignNames="maxNum2a"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let sample1replacements = stateVariables["/sample1"].replacements!;
        let sample2replacements = stateVariables["/sample2"].replacements!;
        expect(sample1replacements.length).eq(5);
        expect(sample2replacements.length).eq(2);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        for (let num of sample1numbers) {
            expect([2, 3].includes(num)).eq(true);
        }
        for (let num of sample2numbers) {
            expect([2, 3, 5, 7].includes(num)).eq(true);
        }

        // Nothing changes when change mathInputs
        await updateMathInputValue({
            latex: "7",
            componentName: "/numToSelect",
            core,
        });
        await updateMathInputValue({
            latex: "11",
            componentName: "/maxNum",
            core,
        });
        await updateMathInputValue({
            latex: "16",
            componentName: "/numToSelect2",
            core,
        });
        await updateMathInputValue({
            latex: "18",
            componentName: "/maxNum2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        sample1replacements = stateVariables["/sample1"].replacements!;
        sample2replacements = stateVariables["/sample2"].replacements!;

        expect(
            sample1replacements.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            ),
        ).eqls(sample1numbers);
        expect(
            sample2replacements.map(
                (x) => stateVariables[x.componentName].stateValues.value,
            ),
        ).eqls(sample2numbers);
    });

    it("select doesn't resample in dynamic map", async () => {
        let core = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <p name="p1"><map assignNames="a b c d e f" name="map1">
      <template newNamespace><selectPrimeNumbers assignNames="n" maxValue="100" /></template>
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
            const stateVariables = await returnAllStateVariables(core);

            expect(
                stateVariables["/p1"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p2"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p3"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p4"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p5"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables["/p6"].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentName].stateValues.value,
                ),
            ).eqls(sampledNumbers);
        }

        let sampledNumbers: number[] = [];

        // initially nothing
        await check_sampled_numbers([]);

        // sample one variable
        await updateMathInputValue({ latex: "1", componentName: "/mi1", core });

        let stateVariables = await returnAllStateVariables(core);
        sampledNumbers.push(stateVariables["/a/n"].stateValues.value);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", componentName: "/mi1", core });
        await check_sampled_numbers([]);

        // get same number back
        await updateMathInputValue({ latex: "1", componentName: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);

        // get two more samples
        await updateMathInputValue({ latex: "3", componentName: "/mi1", core });

        stateVariables = await returnAllStateVariables(core);
        let n1 = stateVariables["/a/n"].stateValues.value;
        let n2 = stateVariables["/b/n"].stateValues.value;
        let n3 = stateVariables["/c/n"].stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        sampledNumbers.push(n2);
        sampledNumbers.push(n3);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({ latex: "0", componentName: "/mi1", core });
        await check_sampled_numbers([]);

        // get first two numbers back
        await updateMathInputValue({ latex: "2", componentName: "/mi1", core });
        await check_sampled_numbers(sampledNumbers.slice(0, 2));

        // get six total samples
        await updateMathInputValue({ latex: "6", componentName: "/mi1", core });

        stateVariables = await returnAllStateVariables(core);
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
        await updateMathInputValue({ latex: "0", componentName: "/mi1", core });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({ latex: "6", componentName: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);
    });

    it("select prime numbers and sort", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers numToSelect="20" sortResults="true" withReplacement="true" maxValue="100" /></p>

    $p1{name="p2"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let originalNumbers = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let secondNumbers = stateVariables["/p2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        expect([...originalNumbers].sort((a, b) => a - b)).eqls(
            originalNumbers,
        );
        expect(secondNumbers).eqls(originalNumbers);
    });

    it("select a few prime numbers and sort", async () => {
        // Note: checking to make sure unique variants (which could trigger with just 3 numbers)
        // doesn't mess this up
        // (Currently we have turned off unique variants for sort results
        // but this test should still pass if we implement it)

        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers numToSelect="3" sortResults="true" withReplacement="true" maxValue="100" /></p>

    $p1{name="p2"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let originalNumbers = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let secondNumbers = stateVariables["/p2"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        expect([...originalNumbers].sort((a, b) => a - b)).eqls(
            originalNumbers,
        );
        expect(secondNumbers).eqls(originalNumbers);
    });

    // Note: this test encodes undesired behavior (see issue #246)
    // When this issue is resolved, change this test to make sure the references
    // are hidden when the selectPrimeNumbers is hidden
    it("selectPrimeNumbers hides dynamically", async () => {
        let core = await createTestCore({
            doenetML: `

    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><selectPrimeNumbers assignNames="c" hide="$h1" maxValue="10" />, <selectPrimeNumbers assignnames="d" hide="$h2" maxValue="10"/></p>
    <p name="p2">$c, $d</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let c = await stateVariables["/c"].stateValues.value;
        let d = await stateVariables["/d"].stateValues.value;
        expect([2, 3, 5, 7].includes(c)).eq(true);
        expect([2, 3, 5, 7].includes(d)).eq(true);

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: true,
            componentName: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentName: "/h2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(`, ${d}`);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: false,
            componentName: "/h1",
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentName: "/h2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).eq(`${c}, `);
        expect(stateVariables["/p2"].stateValues.text).eq(`${c}, ${d}`);
    });

    it("numToSelect from selectFromSequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <selectPrimeNumbers name="nums1" maxValue="30" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" /></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <selectPrimeNumbers name="nums2" maxValue="30" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" /></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <selectPrimeNumbers name="nums3" maxValue="30" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" /></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <selectPrimeNumbers name="nums4" maxValue="30" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" /></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <selectPrimeNumbers name="nums5" maxValue="30" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" /></p>
    <p name="p5">a5=$a5, b5=$b5, c5=$c5, d5=$d5, e5=$e5</p>
      `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let n1 = stateVariables["/n1"].stateValues.value;
        let n2 = stateVariables["/n2"].stateValues.value;
        let n3 = stateVariables["/n3"].stateValues.value;
        let n4 = stateVariables["/n4"].stateValues.value;
        let n5 = stateVariables["/n5"].stateValues.value;

        let nums1 = stateVariables["/nums1"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let nums2 = stateVariables["/nums2"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let nums3 = stateVariables["/nums3"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let nums4 = stateVariables["/nums4"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let nums5 = stateVariables["/nums5"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
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
});
