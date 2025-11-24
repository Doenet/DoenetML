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
        componentName,
        valid_values,
        num_samples,
        num_to_select = 1,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_values: any[][];
        num_samples: number;
        num_to_select?: number;
        must_be_distinct?: boolean;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            let { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            for (let idx = 0; idx < num_to_select; idx++) {
                let cIdx = await resolvePathToNodeIdx(
                    `${componentName}[${idx + 1}]`,
                );
                let value = stateVariables[cIdx].stateValues.value;
                expect(
                    is_math
                        ? valid_values[idx].some((v) => v.equals(value))
                        : valid_values[idx].includes(value),
                ).eq(true, `Expected ${value} to be in ${valid_values}`);
            }

            if (must_be_distinct) {
                for (let idx1 = 0; idx1 < num_to_select; idx1++) {
                    let cIdx1 = await resolvePathToNodeIdx(
                        `${componentName}[${idx1 + 1}]`,
                    );
                    let val1 = stateVariables[cIdx1].stateValues.value;
                    for (let idx2 = 0; idx2 < num_to_select; idx2++) {
                        let cIdx2 = await resolvePathToNodeIdx(
                            `${componentName}[${idx2 + 1}]`,
                        );
                        if (cIdx2 !== cIdx1) {
                            let val2 = stateVariables[cIdx2].stateValues.value;
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
        num_samples,
        num_to_select,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_combinations: any[][];
        num_samples: number;
        num_to_select: number;
        is_math?: boolean;
    }) {
        for (let i = 0; i < num_samples; i++) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            const values: any[] = [];

            for (let idx = 0; idx < num_to_select; idx++) {
                const cIdx = await resolvePathToNodeIdx(
                    `${componentName}[${idx + 1}]`,
                );
                const value = stateVariables[cIdx].stateValues.value;
                values.push(value);
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

    it("no parameters, select single number from 1 to 10", async () => {
        const doenetML = `<selectFromSequence name="s"/>`;
        const valid_values = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select single number from 1 to 6", async () => {
        const doenetML = `<selectFromSequence name="s" to="6" />`;
        const valid_values = [[1, 2, 3, 4, 5, 6]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select single number from -3 to 5", async () => {
        const doenetML = `<selectFromSequence name="s" from="-3" to="5" />`;
        const valid_values = [[-3, -2, -1, 0, 1, 2, 3, 4, 5]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select single number from -3 to 5, excluding 0", async () => {
        const doenetML = `<selectFromSequence name="s" from="-3" to="5" exclude="0" />`;
        const valid_values = [[-3, -2, -1, 1, 2, 3, 4, 5]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select single odd number from -3 to 5", async () => {
        const doenetML = `<selectFromSequence name="s" from="-3" to="5" step="2" />`;
        const valid_values = [[-3, -1, 1, 3, 5]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select single letter from c to h", async () => {
        const doenetML = `<selectFromSequence type="letters" name="s" from="c" to="h" />`;
        const valid_values = [["c", "d", "e", "f", "g", "h"]];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
        });
    });

    it("select two even numbers from -4 to 4, excluding 0", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="-4" to="4" exclude="0" step="2" />`;
        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 30,
            num_to_select: 1,
            must_be_distinct: true,
        });
    });

    it("select two even numbers from -4 to 2, excluding 0 and combinations", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="-4" to="2" exclude="0" step="2" excludeCombinations="(-4 -2) (-2 2) (2 -4)"/>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
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

    <p><selectFromSequence name="s" numToSelect="2" from="-4" to="2" step="2" exclude="0" excludeCombinations="$ec ($e1 2) ($e2 $e3)" /></p>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select two even numbers from -4 to 2, excluding 0 and combinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="-4" to="2" exclude="0 3 4 5 6 7 8" step="2" excludeCombinations="(-4 -2) (-2 2) (2 -4)"/>`;
        const valid_combinations = [
            [-4, 2],
            [-2, -4],
            [2, -2],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select three numbers from 1 to 3, exclude combinations with two 1s", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="3" withReplacement from="1" to="3" excludeCombinations="(1 1 _) (1 _ 1) (_ 1 1)"/>`;
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
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 3,
        });
    });

    it("select three numbers from 1 to 3, exclude combinations with two 1s, duplicate excludes", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="3" withReplacement from="1" to="3" excludeCombinations="(1 1 _) (1 _ 1) (_ 1 1) (3 1 1) (2 1 1) (1 1 1) (_ 1 1) (_ 1 1) (_ 1 1) (1 1 _) (1 _ 1) (1 1 _) (1 3 1) (1 2 1) (1 1 1)"/>`;
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
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 3,
        });
    });

    it("select four numbers from 0 to 3, exclude positions of each number", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="4" withReplacement from="0" to="3"  excludeCombinations="(0 _ _ _) (_ 1 _ _) (_ _ 2 _) (_ _ _ 3)"/>`;
        const valid_values = [
            [1, 2, 3],
            [0, 2, 3],
            [0, 1, 3],
            [0, 1, 2],
        ];

        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 10,
            num_to_select: 4,
        });
    });

    it("select three numbers from 1 to 3, without replacement exclude positions of each number", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="3" from="1" to="3" excludeCombinations="(1 _ _) (_ 2 _) (_ _ 3)" />`;
        const valid_values = [
            [2, 3],
            [1, 3],
            [1, 2],
        ];

        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 10,
            must_be_distinct: true,
            num_to_select: 3,
        });
    });

    it("display error when select three numbers from 1 to 3, without replacement, exclude any place for 1", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><selectFromSequence numToSelect="3" name="sample1" from="1" to="3" excludeCombinations="(1 _ _) (_ 1 _) (_ _ 1)" /></p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Excluded over 70%");
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(8);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(123);
    });

    it("select 10 numbers from 1 to 10, without replacement, exclude positions of each number", async () => {
        // make sure that exclude combinations does not enumerate all combinations excluded
        // to count them
        const doenetML = `<selectFromSequence name="s" numToSelect="10" from="1" to="10" excludeCombinations="(1 _ _ _ _ _ _ _ _ _) (_ 2 _ _ _ _ _ _ _ _) (_ _ 3 _ _ _ _ _ _ _) (_ _ _ 4 _ _ _ _ _ _) (_ _ _ _ 5 _ _ _ _ _) (_ _ _ _ _ 6 _ _ _ _) (_ _ _ _ _ _ 7 _ _ _) (_ _ _ _ _ _ _ 8 _ _) (_ _ _ _ _ _ _ _ 9 _) (_ _ _ _ _ _ _ _ _ 10)" />`;
        let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const valid_values: number[][] = [];

        for (let j = 0; j < 10; j++) {
            let validNs = [...allNumbers];
            validNs.splice(j, 1);
            valid_values.push(validNs);
        }

        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 5,
            must_be_distinct: true,
            num_to_select: 10,
        });
    });

    it("select five even numbers with replacement from -4 to 4, excluding 0", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="5" withReplacement from="-4" to="4" step="2" exclude="0" />`;
        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];

        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 10,
            num_to_select: 5,
        });
    });

    it("select five (number initially unresolved) even numbers with replacement from -4 to 4, excluding 0", async () => {
        const doenetML = `
    <selectFromSequence name="s" numToSelect="$n" withReplacement from="-4" to="4" step="2" exclude="0" />
    <number extend="$n3" name="n2" />
    <math extend="$num1" name="n" />
    <math name="num1">$n2+$num2+2</math>
    <math name="num2">$n3+$num3</math>
    <number extend="$num3" name="n3" />
    <number name="num3">1</number>`;

        const valid_values = [
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
            [-4, -2, 2, 4],
        ];

        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 3,
            num_to_select: 5,
        });
    });

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence name="s" from="175" to="205" numToSelect="5" /></p>
    <p name="p2"><selectFromSequence extend="$s" name="s2" asList="false" /></p>

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
            expect(num).gte(175).lte(205);
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
    <selectFromSequence name="sample1" to="100" />
    <selectFromSequence name="sample2" to="100" />
    </p>

    <p>
    <selectFromSequence extend="$sample1" name="noresample1" />
    <selectFromSequence extend="$sample2" name="noresample2" />
    <selectFromSequence extend="$noresample1" name="noreresample1" />
    <selectFromSequence extend="$noresample2" name="noreresample2" />
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
        expect(Number.isInteger(num1) && num1 >= 1 && num1 <= 100).eq(true);
        expect(Number.isInteger(num2) && num2 >= 1 && num2 <= 100).eq(true);
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
            expect([1, 2, 3].includes(num)).eq(true);
        }
        for (let num of sample2numbers) {
            expect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)).eq(true);
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
      <selectFromSequence name="n" to="100" />
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

    it("select single math", async () => {
        const doenetML = `<selectFromSequence type="math" from="x" step="y" length="3" name="s"/>`;
        const valid_values = [
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
        ];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 3,
            is_math: true,
        });
    });

    it("select multiple maths", async () => {
        const doenetML = `<selectFromSequence type="math" from="x" step="y" length="3" numToSelect="3" name="s"/>`;
        const valid_values = [
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
            [me.fromText("x"), me.fromText("x+y"), me.fromText("x+2y")],
        ];
        const componentName = "s";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 3,
            is_math: true,
            must_be_distinct: true,
        });
    });

    it("selectFromSequence with hide will hide replacements", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p name="p1"><selectFromSequence type="letters" name="c" from="a" to="e" />, <selectFromSequence type="letters" name="d" from="a" to="e" hide /></p>
      <p name="p2">$c, <text extend="$d" hide="false" /></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let c =
            await stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value;
        let d =
            await stateVariables[await resolvePathToNodeIdx("d[1]")].stateValues
                .value;
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("p1")].stateValues.text,
        ).eq(`${c}, `);
        expect(
            stateVariables[await resolvePathToNodeIdx("p2")].stateValues.text,
        ).eq(`${c}, ${d}`);
    });

    it("select multiple numbers with excludeCombinations, handles round-off error", async () => {
        // Third number selected will be 0.1*3, which isn't exactly 0.3 due to round off error.
        // Even so, excluding 0.3 works successfully.
        const doenetML = `<selectFromSequence from="0.1" to="0.3" step="0.1" numToSelect="2" excludeCombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" name="s"/>`;
        const valid_combinations = [
            [0.1, 0.2],
            [0.2, 0.1],
            [0.1 * 3, 0.2],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select multiple maths with excludeCombinations, handles round-off error", async () => {
        // Third number selected will be 0.1*3, which isn't exactly 0.3 due to round off error.
        // Even so, excluding 0.3 works successfully.
        const doenetML = `<selectFromSequence type="math" from="0.1" to="0.3" step="0.1" numToSelect="2" excludeCombinations="(0.1 0.3) (0.2 0.3) (0.3 0.1)" name="s"/>`;
        const valid_combinations = [
            [me.fromAst(0.1), me.fromAst(0.2)],
            [me.fromAst(0.2), me.fromAst(0.1)],
            [me.fromAst(0.3), me.fromAst(0.2)],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
            is_math: true,
        });
    });

    it("select multiple maths with excludes and excludeCombinations", async () => {
        const doenetML = `<selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y" excludeCombinations="(x x+y) (x+y x+3y) (x+3y x)" name="s"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
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
    <selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y" excludeCombinations="$ec ($e1 x+3y) ($e2 $e3)" name="s"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
            is_math: true,
        });
    });

    it("select multiple maths with excludes and excludeCombinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence type="math" numToSelect="2" from="x" step="y" length="4" exclude="x+2y 2z q y" excludeCombinations="(x x+y) (x+y x+3y) (x+3y x)" name="s"/>`;
        const valid_combinations = [
            [me.fromText("x"), me.fromText("x+3y")],
            [me.fromText("x+y"), me.fromText("x")],
            [me.fromText("x+3y"), me.fromText("x+y")],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
            is_math: true,
        });
    });

    it("select multiple letters with excludes and excludeCombinations", async () => {
        const doenetML = `<selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p" excludeCombinations="(m v) (s m) (v s)" name="s"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
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
    <selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p" excludeCombinations="$ec ($e1 m) ($e2 $e3)" name="s"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select multiple letters with excludes and excludeCombinations, exclude extras", async () => {
        const doenetML = `<selectFromSequence type="letters" numToSelect="2" from="m" step="3" length="4" exclude="p q r z a" excludeCombinations="(m v) (s m) (v s)" name="s"/>`;
        const valid_combinations = [
            ["m", "s"],
            ["s", "v"],
            ["v", "m"],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select numbers and sort", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence numToSelect="20" sortResults="true" withReplacement="true" from="-20" to="20" /></p>

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

    it("select letters and sort", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><selectFromSequence type="letters" numToSelect="20" sortResults="true" withReplacement="true" from="a" to="bz" /></p>

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
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <booleanInput name='h1' prefill="false" >
      <label>Hide first select</label>
    </booleanInput>
    <booleanInput name='h2' prefill="true" >
      <label>Hide second select</label>
    </booleanInput>
    <p name="p1"><selectFromSequence name="c" hide="$h1" type="letters" from="a" to="e"/>, <selectFromSequence name="d" hide="$h2" type="letters" from="a" to="e"/></p>
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
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(d)).eq(true);

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

    it("selectFromSequence defaults to fixed", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <booleanInput name='f1' prefill="false" >
      <label>Fix first select</label>
    </booleanInput>
    <booleanInput name='f2' prefill="true" >
      <label>Fix second select</label>
    </booleanInput>
    <p>
      <selectFromSequence name="a" type="letters" from="a" to="e"/>
      <selectFromSequence name="b" fixed="$f1" type="letters" from="a" to="e"/>
      <selectFromSequence name="c" fixed="$f2" type="letters" from="a" to="e"/>
    </p>
    <p>
      <text extend="$a" name="a2" />
      <text extend="$b" name="b2" />
      <text extend="$c" name="c2" />
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
      <boolean extend="$a.fixed" name="af" />
      <boolean extend="$b.fixed" name="bf" />
      <boolean extend="$c.fixed" name="cf" />
    </p>
    <p>
      <boolean extend="$a2.fixed" name="a2f" />
      <boolean extend="$b2.fixed" name="b2f" />
      <boolean extend="$c2.fixed" name="c2f" />
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let a =
            stateVariables[await resolvePathToNodeIdx("a[1]")].stateValues
                .value;
        let b =
            stateVariables[await resolvePathToNodeIdx("b[1]")].stateValues
                .value;
        let c =
            stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value;
        expect(["a", "b", "c", "d", "e"].includes(a)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(b)).eq(true);
        expect(["a", "b", "c", "d", "e"].includes(c)).eq(true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq(b);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value,
        ).eq(c);

        expect(
            stateVariables[await resolvePathToNodeIdx("af")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bf")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("cf")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2f")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2f")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2f")].stateValues.value,
        ).eq(true);

        await updateTextInputValue({
            text: "f",
            componentIdx: await resolvePathToNodeIdx("a3"),
            core,
        });
        await updateTextInputValue({
            text: "g",
            componentIdx: await resolvePathToNodeIdx("b3"),
            core,
        });
        await updateTextInputValue({
            text: "h",
            componentIdx: await resolvePathToNodeIdx("c3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a[1]")].stateValues
                .value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b[1]")].stateValues
                .value,
        ).eq("g");
        expect(
            stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value,
        ).eq(c);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq("g");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value,
        ).eq(c);

        await updateTextInputValue({
            text: "i",
            componentIdx: await resolvePathToNodeIdx("a4"),
            core,
        });
        await updateTextInputValue({
            text: "j",
            componentIdx: await resolvePathToNodeIdx("b4"),
            core,
        });
        await updateTextInputValue({
            text: "k",
            componentIdx: await resolvePathToNodeIdx("c4"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a[1]")].stateValues
                .value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b[1]")].stateValues
                .value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value,
        ).eq(c);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value,
        ).eq(c);

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("f1"),
            core,
        });
        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("f2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("af")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("bf")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("cf")].stateValues.value,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a2f")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2f")].stateValues.value,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c2f")].stateValues.value,
        ).eq(false);

        await updateTextInputValue({
            text: "l",
            componentIdx: await resolvePathToNodeIdx("a3"),
            core,
        });
        await updateTextInputValue({
            text: "m",
            componentIdx: await resolvePathToNodeIdx("b3"),
            core,
        });
        await updateTextInputValue({
            text: "n",
            componentIdx: await resolvePathToNodeIdx("c3"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a[1]")].stateValues
                .value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b[1]")].stateValues
                .value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value,
        ).eq("n");
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value,
        ).eq("n");

        await updateTextInputValue({
            text: "o",
            componentIdx: await resolvePathToNodeIdx("a4"),
            core,
        });
        await updateTextInputValue({
            text: "p",
            componentIdx: await resolvePathToNodeIdx("b4"),
            core,
        });
        await updateTextInputValue({
            text: "q",
            componentIdx: await resolvePathToNodeIdx("c4"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("a[1]")].stateValues
                .value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b[1]")].stateValues
                .value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c[1]")].stateValues
                .value,
        ).eq("q");
        expect(
            stateVariables[await resolvePathToNodeIdx("a2")].stateValues.value,
        ).eq(a);
        expect(
            stateVariables[await resolvePathToNodeIdx("b2")].stateValues.value,
        ).eq("j");
        expect(
            stateVariables[await resolvePathToNodeIdx("c2")].stateValues.value,
        ).eq("q");
    });

    it("numToSelect from selectFromSequence", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" name="n1" /></p>
    <p>nums = <selectFromSequence name="nums1" from="1" to="10" numToSelect="$n1" /></p>
    <p name="p1">a1=$nums1[1], b1=$nums1[2], c1=$nums1[3], d1=$nums1[4], e1=$nums1[5]</p>

    <p>n2 = <selectFromSequence from="1" to="5" name="n2" /></p>
    <p>nums = <selectFromSequence name="nums2" from="1" to="10" numToSelect="$n2" /></p>
    <p name="p2">a2=$nums2[1], b2=$nums2[2], c2=$nums2[3], d2=$nums2[4], e2=$nums2[5]</p>

    <p>n3 = <selectFromSequence from="1" to="5" name="n3" /></p>
    <p>nums = <selectFromSequence name="nums3" from="1" to="10" numToSelect="$n3" /></p>
    <p name="p3">a3=$nums3[1], b3=$nums3[2], c3=$nums3[3], d3=$nums3[4], e3=$nums3[5]</p>

    <p>n4 = <selectFromSequence from="1" to="5" name="n4" /></p>
    <p>nums = <selectFromSequence name="nums4" from="1" to="10" numToSelect="$n4" /></p>
    <p name="p4">a4=$nums4[1], b4=$nums4[2], c4=$nums4[3], d4=$nums4[4], e4=$nums4[5]</p>

    <p>n5 = <selectFromSequence from="1" to="5" name="n5" /></p>
    <p>nums = <selectFromSequence name="nums5" from="1" to="10" numToSelect="$n5" /></p>
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

    it("rounding", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><selectFromSequence name="n1" from="10" to="20" step="0.000001" displayDigits="10" /></p>
    <p><selectFromSequence name="n2" from="10" to="20" step="0.000001" displayDigits="3" /></p>
    <p><selectFromSequence name="n3" from="10" to="20" step="0.000001" displayDecimals="3" /></p>
    <p><selectFromSequence name="n4" from="10" to="20" displayDigits="3" padZeros /></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

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

        expect(
            stateVariables[await resolvePathToNodeIdx("n1[1]")].stateValues
                .text,
        ).eq(String(Math.round(n1 * 10 ** 8) / 10 ** 8));
        expect(
            stateVariables[await resolvePathToNodeIdx("n2[1]")].stateValues
                .text,
        ).eq(String(Math.round(n2 * 10 ** 1) / 10 ** 1));
        expect(
            stateVariables[await resolvePathToNodeIdx("n3[1]")].stateValues
                .text,
        ).eq(String(Math.round(n3 * 10 ** 3) / 10 ** 3));
        expect(
            stateVariables[await resolvePathToNodeIdx("n4[1]")].stateValues
                .text,
        ).eq(String(n4) + ".0");

        expect(
            stateVariables[await resolvePathToNodeIdx("n1a")].stateValues.text,
        ).eq(String(Math.round(n1 * 10 ** 8) / 10 ** 8));
        expect(
            stateVariables[await resolvePathToNodeIdx("n2a")].stateValues.text,
        ).eq(String(Math.round(n2 * 10 ** 1) / 10 ** 1));
        expect(
            stateVariables[await resolvePathToNodeIdx("n3a")].stateValues.text,
        ).eq(String(Math.round(n3 * 10 ** 3) / 10 ** 3));
        expect(
            stateVariables[await resolvePathToNodeIdx("n4a")].stateValues.text,
        ).eq(String(n4) + ".0");
    });

    it("display error when select 3 from 1, inside text", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(17);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(66);
    });

    it("check bugfix for non-constant exclude and unique variants", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <variantControl uniqueVariants />
    <p>Number to exclude: <number name="exclude">2</number></p>
    <p><selectFromSequence name="n" from="1" to="3" exclude="$exclude" /></p>

    <p><number name="na">$n</number></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let n =
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value;

        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(n);

        expect(
            stateVariables[await resolvePathToNodeIdx("na")].stateValues.value,
        ).eq(n);

        expect(n === 1 || n === 3).eq(true);
    });

    it("check bugfix for non-constant exclude and defaulting to unique variants", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number to exclude: <number name="exclude">2</number></p>
    <p><selectFromSequence name="n" from="1" to="3" exclude="$exclude" /></p>

    <p><number name="na">$n</number></p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let n =
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value;

        expect(
            stateVariables[await resolvePathToNodeIdx("n[1]")].stateValues
                .value,
        ).eq(n);

        expect(
            stateVariables[await resolvePathToNodeIdx("na")].stateValues.value,
        ).eq(n);

        expect(n === 1 || n === 3).eq(true);
    });

    it("select two coprime numbers from 1 to 4", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="1" to="4" coprime />`;
        const valid_combinations = [
            [1, 2],
            [1, 3],
            [1, 4],
            [2, 1],
            [2, 3],
            [3, 1],
            [3, 2],
            [3, 4],
            [4, 1],
            [4, 3],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 20,
            num_to_select: 2,
        });
    });

    it("select two odd coprime numbers from 15 to 21, sort results", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="15" to="21" step="2" coprime sortResults />`;
        const valid_combinations = [
            [15, 17],
            [15, 19],
            [17, 19],
            [17, 21],
            [19, 21],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select two odd coprime numbers from 15 to 21, sort results, with negative step", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="21" to="15" step="-2" coprime sortResults />`;
        const valid_combinations = [
            [15, 17],
            [15, 19],
            [17, 19],
            [17, 21],
            [19, 21],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 10,
            num_to_select: 2,
        });
    });

    it("select two coprime numbers from 21 to 27, excluding 23 and 25, sort results", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="21" to="27" exclude="23 25" coprime sortResults />`;
        const valid_combinations = [
            [21, 22],
            [21, 26],
            [22, 27],
            [26, 27],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 8,
            num_to_select: 2,
        });
    });

    it("select four coprime numbers from 22 to 28, excluding 23 and 25, sort results", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="4" from="22" to="27" exclude="23 25" coprime sortResults />`;
        const valid_combinations = [
            [22, 24, 26, 27],
            [22, 24, 27, 28],
            [22, 26, 27, 28],
            [24, 26, 27, 28],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 8,
            num_to_select: 4,
        });
    });

    it("select three coprime numbers from 4 to 6, with replacement, sort results", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="3" from="4" to="6" coprime  withReplacement sortResults />`;
        const valid_combinations = [
            [4, 5, 6],
            [4, 4, 5],
            [4, 5, 5],
            [5, 5, 6],
            [5, 6, 6],
            [5, 6, 6],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 12,
            num_to_select: 3,
        });
    });

    it("excludeCombinations overrides coprime", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="2" to="4" coprime excludeCombinations="(2 3) (3 4)" />`;
        const valid_combinations = [
            [2, 4],
            [3, 2],
            [4, 2],
            [4, 3],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 20,
            num_to_select: 2,
        });

        let { core } = await createTestCore({ doenetML });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "coprime ignored since excludeCombinations specified",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(1);
        expect(errorWarnings.warnings[0].position.start.column).eq(1);
        expect(errorWarnings.warnings[0].position.end.line).eq(1);
        expect(errorWarnings.warnings[0].position.end.column).eq(106);
    });

    it("coprime ignored when not selecting numbers", async () => {
        const doenetML = `<selectFromSequence name="s" type="letters" numToSelect="2" from="a" to="b" coprime />`;
        const valid_combinations = [
            ["a", "b"],
            ["b", "a"],
        ];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 2,
            num_to_select: 2,
        });

        let { core } = await createTestCore({ doenetML });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "coprime ignored since not selecting numbers",
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(1);
        expect(errorWarnings.warnings[0].position.start.column).eq(1);
        expect(errorWarnings.warnings[0].position.end.line).eq(1);
        expect(errorWarnings.warnings[0].position.end.column).eq(87);
    });

    it("excludeCombinations gives error when not selecting integers", async () => {
        const errorMessage =
            "Cannot select coprime combinations as not selecting positive integers";

        const doenetMLs = [
            `<selectFromSequence name="s" numToSelect="2" from="2.5" to="4" coprime />`,
            `<selectFromSequence name="s" numToSelect="2" from="2" step="4.4" coprime />`,
            `<selectFromSequence name="s" numToSelect="2" from="-2" step="3" coprime />`,
            `<selectFromSequence name="s" numToSelect="2" to="4" step="3" length="3" coprime />`,
            `<selectFromSequence name="s" numToSelect="2" from="4" step="-3" coprime />`,
        ];

        for (const doenetML of doenetMLs) {
            const { core } = await createTestCore({
                doenetML,
            });
            const errorWarnings = core.core!.errorWarnings;
            expect(errorWarnings.errors.length).eq(1);
            expect(errorWarnings.warnings.length).eq(0);
            expect(errorWarnings.errors[0].message).contain(errorMessage);
        }
    });

    it("excludeCombinations gives error if from/to and step are not coprime", async () => {
        const errorMessage = `Cannot select coprime numbers. All possible values share a common factor. (Specified values of "from" or "to" must be coprime with "step".)`;

        const doenetMLs = [
            `<selectFromSequence name="s" numToSelect="2" from="2" step="4" coprime />`,
            `<selectFromSequence name="s" numToSelect="2" to="8" step="2" coprime />`,
        ];

        for (const doenetML of doenetMLs) {
            const { core } = await createTestCore({
                doenetML,
            });
            const errorWarnings = core.core!.errorWarnings;
            expect(errorWarnings.errors.length).eq(1);
            expect(errorWarnings.warnings.length).eq(0);
            expect(errorWarnings.errors[0].message).contain(errorMessage);
        }
    });

    it("can select two coprime numbers when only option is 1", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="1" to="1" coprime withReplacement />`;
        const valid_combinations = [[1, 1]];
        const componentName = "s";

        await test_combined_values({
            doenetML,
            valid_combinations,
            componentName,
            num_samples: 4,
            num_to_select: 2,
        });
    });

    it("excludeCombinations gives error if one option that isn't 1", async () => {
        const errorMessage =
            "Cannot select coprime combinations from a single number that is not 1.";
        const doenetMLs = [
            `<selectFromSequence name="s" numToSelect="2" from="2" to="2" coprime withReplacement />`,
            `<selectFromSequence name="s" numToSelect="2" from="2" to="4" exclude="3 4" coprime withReplacement />`,
        ];

        for (const doenetML of doenetMLs) {
            const { core } = await createTestCore({
                doenetML,
            });
            const errorWarnings = core.core!.errorWarnings;
            expect(errorWarnings.errors.length).eq(1);
            expect(errorWarnings.warnings.length).eq(0);
            expect(errorWarnings.errors[0].message).contain(errorMessage);
        }
    });

    it("excludeCombinations gives error if all possible values share factor due to exclude", async () => {
        const errorMessage =
            "Could not select coprime numbers. All possible values share a common factor.";
        const doenetMLs = [
            `<selectFromSequence name="s" numToSelect="2" from="2" to="4" exclude="3" coprime />`,
            `<selectFromSequence name="s" numToSelect="3" from="2" to="6" exclude="3 5" coprime />`,
        ];

        for (const doenetML of doenetMLs) {
            const { core } = await createTestCore({
                doenetML,
            });
            const errorWarnings = core.core!.errorWarnings;
            expect(errorWarnings.errors.length).eq(1);
            expect(errorWarnings.warnings.length).eq(0);
            expect(errorWarnings.errors[0].message).contain(errorMessage);
        }
    });
});
