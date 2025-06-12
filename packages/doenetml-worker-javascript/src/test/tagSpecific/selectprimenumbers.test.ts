import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("selectPrimeNumbers tag tests", async () => {
    async function test_values_separately({
        doenetML,
        componentName,
        valid_values,
        num_to_select,
        num_variants_to_test,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_values: any[][];
        num_to_select: number;
        num_variants_to_test: number;
        must_be_distinct?: boolean;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_variants_to_test; i++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let idx = 0; idx < num_to_select; idx++) {
                let value =
                    stateVariables[
                        await resolvePathToNodeIdx(
                            `${componentName}[${idx + 1}]`,
                        )
                    ].stateValues.value;
                expect(
                    is_math
                        ? valid_values[idx].some((v) => v.equals(value))
                        : valid_values[idx].includes(value),
                ).eq(true, `Expected ${value} to be in ${valid_values[idx]}`);
            }

            if (must_be_distinct) {
                for (let idx1 = 0; idx1 < num_to_select; idx1++) {
                    let val1 =
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${componentName}[${idx1 + 1}]`,
                            )
                        ].stateValues.value;
                    for (let idx2 = 0; idx2 < num_to_select; idx2++) {
                        if (idx2 !== idx1) {
                            let val2 =
                                stateVariables[
                                    await resolvePathToNodeIdx(
                                        `${componentName}[${idx2 + 1}]`,
                                    )
                                ].stateValues.value;
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
        componentName,
        valid_combinations,
        num_to_select,
        num_variants_to_test,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_combinations: any[][];
        num_to_select: number;
        num_variants_to_test: number;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_variants_to_test; i++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const values: any[] = [];
            for (let idx = 0; idx < num_to_select; idx++) {
                values.push(
                    stateVariables[
                        await resolvePathToNodeIdx(
                            `${componentName}[${idx + 1}]`,
                        )
                    ].stateValues.value,
                );
            }

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
        const doenetML = `<selectPrimeNumbers name="res"/>`;
        const valid_values = [
            [
                2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59,
                61, 67, 71, 73, 79, 83, 89, 97,
            ],
        ];
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 1,
            num_variants_to_test: 30,
        });
    });

    it("select single prime number from 2 to 6", async () => {
        const doenetML = `<selectPrimeNumbers name="res" maxValue="6"/>`;
        const valid_values = [[2, 3, 5]];
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 1,
            num_variants_to_test: 30,
        });
    });

    it("select single prime number from 9 to 39", async () => {
        const doenetML = `<selectPrimeNumbers name="res" minValue="9" maxValue="39" />`;
        const valid_values = [[11, 13, 17, 19, 23, 29, 31, 37]];
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 1,
            num_variants_to_test: 30,
        });
    });

    it("select single prime number from 9 to 39, excluding 19", async () => {
        const doenetML = `<selectPrimeNumbers name="res" minValue="9" maxValue="39" exclude="19" />`;
        const valid_values = [[11, 13, 17, 23, 29, 31, 37]];
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 1,
            num_variants_to_test: 30,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" name="res" minValue="1020" maxValue="1050" exclude="1031 1049" />`;
        const valid_values = [
            [1021, 1033, 1039],
            [1021, 1033, 1039],
        ];
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 2,
            num_variants_to_test: 10,
            must_be_distinct: true,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" name="res" minValue="1020" maxValue="1050" exclude="1031 1049"  excludeCombinations="(1021 1033) (1033 1039) (1039 1021)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentName = "res";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_to_select: 2,
            num_variants_to_test: 10,
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
    <selectPrimeNumbers numToSelect="2" name="res" minValue="1020" maxValue="1050" exclude="1031 1049"  excludeCombinations="$ec ($e1 1039) ($e2 $e3)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentName = "res";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_to_select: 2,
            num_variants_to_test: 10,
        });
    });

    it("select two prime numbers from 1020 to 1050, excluding 1031 and 1049 and combinations, exclude extras", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="2" name="res" minValue="1020" maxValue="1050" exclude="19 1031 1036 1037 1038 1049 1050 1061" excludeCombinations="(1021 1033) (1033 1039) (1039 1021)"/>`;
        const valid_combinations = [
            [1021, 1039],
            [1033, 1021],
            [1039, 1033],
        ];
        const componentName = "res";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_to_select: 2,
            num_variants_to_test: 10,
        });
    });

    it("select three prime numbers up to 5, exclude combinations with two 2s", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" withReplacement name="res" maxValue="5" excludeCombinations="(2 2 _) (2 _ 2) (_ 2 2)" />`;
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
        const componentName = "res";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_to_select: 3,
            num_variants_to_test: 10,
        });
    });

    it("select three prime numbers up to 5, exclude combinations with two 2s, duplicate excludes", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" withReplacement name="res" maxValue="5" excludeCombinations="(2 2 _) (2 _ 2) (_ 2 2) (5 2 2) (3 2 2) (2 2 2) (_ 2 2) (_ 2 2) (_ 2 2) (2 2 _) (2 _ 2) (2 2 _) (2 5 2) (2 3 2) (2 2 2)" />`;
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
        const componentName = "res";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_to_select: 3,
            num_variants_to_test: 10,
        });
    });

    it("select four prime numbers from 3 to 11, exclude positions of each number", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="4" withReplacement name="res" minValue="3" maxValue="11" excludeCombinations="(3 _ _ _) (_ 5 _ _) (_ _ 7 _) (_ _ _ 11)" />`;
        const valid_values = [
            [5, 7, 11],
            [3, 7, 11],
            [3, 5, 11],
            [3, 5, 7],
        ];

        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 4,
            num_variants_to_test: 10,
        });
    });

    it("select three prime numbers up to 5, without replacement exclude positions of each number", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="3" name="res" maxValue="5" excludeCombinations="(2 _ _) (_ 3 _) (_ _ 5)" />`;
        const valid_values = [
            [3, 5],
            [2, 5],
            [2, 3],
        ];

        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 3,
            num_variants_to_test: 10,
            must_be_distinct: true,
        });
    });

    it("select three prime numbers up to 5, without replacement, exclude any place for 2", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <selectPrimeNumbers numToSelect="3" name="res" maxValue="5" excludeCombinations="(2 _ _) (_ 2 _) (_ _ 2)" />
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Excluded over 70%");
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(5);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(113);
    });

    it("select 10 prime numbers from the first 10, without replacement, exclude positions of each number", async () => {
        // make sure that exclude combinations does not enumerate all combinations excluded
        // to count them
        const doenetML = `<selectPrimeNumbers numToSelect="10" name="res" maxValue="30" excludeCombinations="(2 _ _ _ _ _ _ _ _ _) (_ 3 _ _ _ _ _ _ _ _) (_ _ 5 _ _ _ _ _ _ _) (_ _ _ 7 _ _ _ _ _ _) (_ _ _ _ 11 _ _ _ _ _) (_ _ _ _ _ 13 _ _ _ _) (_ _ _ _ _ _ 17 _ _ _) (_ _ _ _ _ _ _ 19 _ _) (_ _ _ _ _ _ _ _ 23 _) (_ _ _ _ _ _ _ _ _ 29)" />`;

        const allNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
        const valid_values: number[][] = [];

        for (let j = 0; j < 10; j++) {
            let validNs = [...allNumbers];
            validNs.splice(j, 1);
            valid_values.push(validNs);
        }

        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 10,
            num_variants_to_test: 5,
            must_be_distinct: true,
        });
    });

    it("select five prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `<selectPrimeNumbers numToSelect="5" withReplacement name="res" minValue="1020" maxValue="1050" exclude="1031 1049" />`;
        const valid_values = [
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
        ];

        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 5,
            num_variants_to_test: 5,
        });
    });

    it("select five (number initially unresolved) prime numbers with replacement from 1020 to 1050, excluding 1031 and 1049", async () => {
        const doenetML = `
    <selectPrimeNumbers numToSelect="$n" withReplacement name="res" minValue="1020" maxValue="1050" exclude="1031 1049" />
    <number extend="$n3" name="n2" />
    <math extend="$num1" name="n" />
    <math name="num1">$n2+$num2+2</math>
    <math name="num2">$n3+$num3</math>
    <number extend="$num3" name="n3" />
    <number name="num3">1</number>`;

        const valid_values = [
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
            [1021, 1033, 1039, 1051],
        ];

        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_to_select: 5,
            num_variants_to_test: 5,
        });
    });

    it("select 100 large prime numbers, check that are prime", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <selectPrimeNumbers numToSelect="100" name="sample" maxValue="1000000" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let ind = 0; ind < 100; ind++) {
            let num =
                stateVariables[await resolvePathToNodeIdx(`sample[${ind + 1}]`)]
                    .stateValues.value;

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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers name="s" minValue="175" maxValue="205" numToSelect="5" /></p>
    <p name="p2"><selectPrimeNumbers extend="$s" name="s2" asList="false" /></p>
    `,
        });

        let results: number[] = [];

        let stateVariables = await core.returnAllStateVariables(false, true);

        results.push(
            stateVariables[await resolvePathToNodeIdx("s[1]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[2]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[3]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[4]")].stateValues
                .value,
        );
        results.push(
            stateVariables[await resolvePathToNodeIdx("s[5]")].stateValues
                .value,
        );

        for (let num of results) {
            expect([179, 181, 191, 193, 197, 199].includes(num));
        }
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(results.join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(results.join(""));
    });

    it("copies don't resample", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1">
    <selectPrimeNumbers name="sample1" maxValue="100" />
    <selectPrimeNumbers name="sample2" maxValue="100" />
    </p>


    <p>
    <selectPrimeNumbers extend="$sample1" name="noresample1" />
    <selectPrimeNumbers extend="$sample2" name="noresample2" />
    <selectPrimeNumbers extend="$noresample1" name="noreresample1" />
    <selectPrimeNumbers extend="$noresample2" name="noreresample2" />
    </p>

    <p extend="$p1" name="noresamplep"/>

    <p extend="$noresamplep" name="noreresamplep"/>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let num1 =
            stateVariables[await resolvePathToNodeIdx("sample1[1]")].stateValues
                .value;
        let num2 =
            stateVariables[await resolvePathToNodeIdx("sample2[1]")].stateValues
                .value;
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
                stateVariables[await resolvePathToNodeIdx("noresample1")]
                    .replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noresample2")]
                    .replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresample1")]
                    .replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresample2")]
                    .replacements![0].componentIdx
            ].stateValues.value,
        ).eq(num2);

        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noresamplep")]
                    .activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noresamplep")]
                    .activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresamplep")]
                    .activeChildren[1].componentIdx
            ].stateValues.value,
        ).eq(num1);
        expect(
            stateVariables[
                stateVariables[await resolvePathToNodeIdx("noreresamplep")]
                    .activeChildren[3].componentIdx
            ].stateValues.value,
        ).eq(num2);
    });

    it("select doesn't change dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let sample1replacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;
        let sample2replacements =
            stateVariables[await resolvePathToNodeIdx("sample2")].replacements!;
        expect(sample1replacements.length).eq(5);
        expect(sample2replacements.length).eq(2);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
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
            componentIdx: await resolvePathToNodeIdx("numToSelect"),
            core,
        });
        await updateMathInputValue({
            latex: "11",
            componentIdx: await resolvePathToNodeIdx("maxNum"),
            core,
        });
        await updateMathInputValue({
            latex: "16",
            componentIdx: await resolvePathToNodeIdx("numToSelect2"),
            core,
        });
        await updateMathInputValue({
            latex: "18",
            componentIdx: await resolvePathToNodeIdx("maxNum2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        sample1replacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;
        sample2replacements =
            stateVariables[await resolvePathToNodeIdx("sample2")].replacements!;

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

    it("select doesn't resample in dynamic repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <setup>
        <sequence name="seq" length="$mi1" />
    </setup>
    <p name="p1"><repeat for="$seq" name="repeat1">
      <selectPrimeNumbers name="n" maxValue="100" />
    </repeat></p>
    
    <p name="p2">$repeat1</p>

    <p extend="$p1" name="p3" />
    <p extend="$p2" name="p4" />

    <p extend="$p3" name="p5" />
    <p extend="$p4" name="p6" />
    `,
        });

        async function check_sampled_numbers(sampledNumbers: number[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p1")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p2")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p3")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p4")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p5")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);

            expect(
                stateVariables[
                    await resolvePathToNodeIdx("p6")
                ].activeChildren.map(
                    (child) =>
                        stateVariables[child.componentIdx].stateValues.value,
                ),
            ).eqls(sampledNumbers);
        }

        let sampledNumbers: number[] = [];

        // initially nothing
        await check_sampled_numbers([]);

        // sample one variable
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        sampledNumbers.push(
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1]")]
                .stateValues.value,
        );
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get same number back
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers);

        // get two more samples
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        let n1 =
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1]")]
                .stateValues.value;
        let n2 =
            stateVariables[await resolvePathToNodeIdx("repeat1[2].n[1]")]
                .stateValues.value;
        let n3 =
            stateVariables[await resolvePathToNodeIdx("repeat1[3].n[1]")]
                .stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        sampledNumbers.push(n2);
        sampledNumbers.push(n3);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get first two numbers back
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers.slice(0, 2));

        // get six total samples
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        n1 =
            stateVariables[await resolvePathToNodeIdx("repeat1[1].n[1]")]
                .stateValues.value;
        n2 =
            stateVariables[await resolvePathToNodeIdx("repeat1[2].n[1]")]
                .stateValues.value;
        n3 =
            stateVariables[await resolvePathToNodeIdx("repeat1[3].n[1]")]
                .stateValues.value;
        let n4 =
            stateVariables[await resolvePathToNodeIdx("repeat1[4].n[1]")]
                .stateValues.value;
        let n5 =
            stateVariables[await resolvePathToNodeIdx("repeat1[5].n[1]")]
                .stateValues.value;
        let n6 =
            stateVariables[await resolvePathToNodeIdx("repeat1[6].n[1]")]
                .stateValues.value;
        expect(n1).eq(sampledNumbers[0]);
        expect(n2).eq(sampledNumbers[1]);
        expect(n3).eq(sampledNumbers[2]);
        sampledNumbers.push(n4);
        sampledNumbers.push(n5);
        sampledNumbers.push(n6);
        await check_sampled_numbers(sampledNumbers);

        // go back to nothing
        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_sampled_numbers(sampledNumbers);
    });

    it("select prime numbers and sort", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers numToSelect="20" sortResults="true" withReplacement="true" maxValue="100" /></p>

    <p extend="$p1" name="p2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let originalNumbers = stateVariables[
            await resolvePathToNodeIdx("p1")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let secondNumbers = stateVariables[
            await resolvePathToNodeIdx("p2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
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

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectPrimeNumbers numToSelect="3" sortResults="true" withReplacement="true" maxValue="100" /></p>

    <p extend="$p1" name="p2" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let originalNumbers = stateVariables[
            await resolvePathToNodeIdx("p1")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let secondNumbers = stateVariables[
            await resolvePathToNodeIdx("p2")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><selectPrimeNumbers name="c" hide="$h1" maxValue="10" />, <selectPrimeNumbers name="d" hide="$h2" maxValue="10"/></p>
    <p name="p2">$c, $d</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c =
            await stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value;
        let d =
            await stateVariables[await resolvePathToNodeIdx("d[1]")].stateValues
                .value;
        expect([2, 3, 5, 7].includes(c)).eq(true);
        expect([2, 3, 5, 7].includes(d)).eq(true);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`, ${d}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("h1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("h2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);
    });

    it("numToSelect from selectFromSequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" name="n1" /></p>
    <p>nums = <selectPrimeNumbers name="nums1" maxValue="30" numToSelect="$n1" /></p>
    <p name="p1">a1=$nums1[1], b1=$nums1[2], c1=$nums1[3], d1=$nums1[4], e1=$nums1[5]</p>

    <p>n2 = <selectFromSequence from="1" to="5" name="n2" /></p>
    <p>nums = <selectPrimeNumbers name="nums2" maxValue="30" numToSelect="$n2" /></p>
    <p name="p2">a2=$nums2[1], b2=$nums2[2], c2=$nums2[3], d2=$nums2[4], e2=$nums2[5]</p>

    <p>n3 = <selectFromSequence from="1" to="5" name="n3" /></p>
    <p>nums = <selectPrimeNumbers name="nums3" maxValue="30" numToSelect="$n3" /></p>
    <p name="p3">a3=$nums3[1], b3=$nums3[2], c3=$nums3[3], d3=$nums3[4], e3=$nums3[5]</p>

    <p>n4 = <selectFromSequence from="1" to="5" name="n4" /></p>
    <p>nums = <selectPrimeNumbers name="nums4" maxValue="30" numToSelect="$n4" /></p>
    <p name="p4">a4=$nums4[1], b4=$nums4[2], c4=$nums4[3], d4=$nums4[4], e4=$nums4[5]</p>

    <p>n5 = <selectFromSequence from="1" to="5" name="n5" /></p>
    <p>nums = <selectPrimeNumbers name="nums5" maxValue="30" numToSelect="$n5" /></p>
    <p name="p5">a5=$nums5[1], b5=$nums5[2], c5=$nums5[3], d5=$nums5[4], e5=$nums5[5]</p>
      `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let n1 =
            stateVariables[await resolvePathToNodeIdx("n1[1]")].stateValues
                .value;
        let n2 =
            stateVariables[await resolvePathToNodeIdx("n2[1]")].stateValues
                .value;
        let n3 =
            stateVariables[await resolvePathToNodeIdx("n3[1]")].stateValues
                .value;
        let n4 =
            stateVariables[await resolvePathToNodeIdx("n4[1]")].stateValues
                .value;
        let n5 =
            stateVariables[await resolvePathToNodeIdx("n5[1]")].stateValues
                .value;

        let nums1 = stateVariables[
            await resolvePathToNodeIdx("nums1")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums2 = stateVariables[
            await resolvePathToNodeIdx("nums2")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums3 = stateVariables[
            await resolvePathToNodeIdx("nums3")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums4 = stateVariables[
            await resolvePathToNodeIdx("nums4")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let nums5 = stateVariables[
            await resolvePathToNodeIdx("nums5")
        ].replacements!.map(
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

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(nums1.map((v, i) => `${l[i]}1=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(nums2.map((v, i) => `${l[i]}2=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p3")].stateValues.text,
        ).eq(nums3.map((v, i) => `${l[i]}3=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p4")].stateValues.text,
        ).eq(nums4.map((v, i) => `${l[i]}4=${v}`).join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("p5")].stateValues.text,
        ).eq(nums5.map((v, i) => `${l[i]}5=${v}`).join(", "));
    });
});
