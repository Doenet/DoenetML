import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { callAction, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SamplePrimeNumbers tag tests", async () => {
    async function test_values_separately({
        doenetML,
        componentName,
        valid_values,
        num_samples,
        num_variants_to_test,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_values: any[][];
        num_samples: number;
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
            for (let idx = 0; idx < num_samples; idx++) {
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
                for (let idx1 = 0; idx1 < num_samples; idx1++) {
                    let val1 =
                        stateVariables[
                            await resolvePathToNodeIdx(
                                `${componentName}[${idx1 + 1}]`,
                            )
                        ].stateValues.value;
                    for (let idx2 = 0; idx2 < num_samples; idx2++) {
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
        num_samples,
        num_variants_to_test,
        is_math = false,
    }: {
        doenetML: string;
        componentName: string;
        valid_combinations: any[][];
        num_samples: number;
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
            for (let idx = 0; idx < num_samples; idx++) {
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

    it("sample five prime numbers up to 20, only maxValue specified", async () => {
        const doenetML = `<samplePrimeNumbers name="res" numSamples="5" maxValue="20"/>`;
        const values = [2, 3, 5, 7, 11, 13, 17, 19];
        const valid_values = Array(5).fill(values);
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 5,
            num_variants_to_test: 10,
        });
    });

    it("sample five prime numbers between 50 and 100, only minValue specified", async () => {
        const doenetML = `<samplePrimeNumbers name="res" numSamples="5" minValue="50"/>`;
        const values = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        const valid_values = Array(5).fill(values);
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 5,
            num_variants_to_test: 10,
        });
    });

    it("sample fifty prime numbers between 10,000 and 100,0000", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<samplePrimeNumbers name="s" numSamples="50" minValue="10000" maxValue="100000" />`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let samples = stateVariables[
            await resolvePathToNodeIdx("s")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        expect(samples.length).eq(50);

        for (let sample of samples) {
            expect(
                Number.isInteger(sample) && sample >= 10000 && sample <= 100000,
            ).eq(true);

            let isPrime = true;
            let sqrtSample = Math.sqrt(sample);
            for (let i = 2; i <= sqrtSample; i++) {
                if (sample % i === 0) {
                    isPrime = false;
                    break;
                }
            }

            expect(isPrime).eq(true);
        }
    });

    it("sample fifty prime numbers between 1900 and 2000, excluding 1931, 1979, and 1997", async () => {
        const doenetML = `<samplePrimeNumbers name="res" numSamples="50" minValue="1900" maxValue="2000" exclude="1931 1979 1997"/>`;
        const values = [
            1901, 1907, 1913, 1933, 1949, 1951, 1973, 1987, 1993, 1999,
        ];
        const valid_values = Array(50).fill(values);
        const componentName = "res";

        await test_values_separately({
            doenetML,
            valid_values,
            componentName,
            num_samples: 50,
            num_variants_to_test: 1,
        });
    });

    it("sampled numbers do change dynamically", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput prefill="50" name="numSamples"/>
    <mathInput prefill="10" name="maxNum"/>
    <p>
    <samplePrimeNumbers name="sample1" maxValue="$maxNum" numSamples="$numSamples" />
    </p>

    <mathInput prefill="180" name="numSamples2"/>
    <mathInput prefill="7, 19, 29, 37, 47" name="exclude"/>
    <mathList name="ml_exclude">$exclude</mathList>
    <p>
    <samplePrimeNumbers name="sample2" exclude="$ml_exclude" maxValue="50" numSamples="$numSamples2" />
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let sample1replacements =
            stateVariables[await resolvePathToNodeIdx("sample1")].replacements!;
        let sample2replacements =
            stateVariables[await resolvePathToNodeIdx("sample2")].replacements!;
        expect(sample1replacements.length).eq(50);
        expect(sample2replacements.length).eq(180);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        for (let num of sample1numbers) {
            expect([2, 3, 5, 7].includes(num)).eq(true);
        }
        for (let num of sample2numbers) {
            expect([2, 3, 5, 11, 13, 17, 23, 31, 41, 43].includes(num)).eq(
                true,
            );
        }

        // Get new samples when change number of samples
        await updateMathInputValue({
            latex: "70",
            componentIdx: await resolvePathToNodeIdx("numSamples"),
            core,
        });
        await updateMathInputValue({
            latex: "160",
            componentIdx: await resolvePathToNodeIdx("numSamples2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        let sample1numbersb = stateVariables[
            await resolvePathToNodeIdx("sample1")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let sample2numbersb = stateVariables[
            await resolvePathToNodeIdx("sample2")
        ]
            .replacements!.slice(
                0,
                stateVariables[await resolvePathToNodeIdx("sample2")]
                    .replacements!.length -
                    (stateVariables[await resolvePathToNodeIdx("sample2")]
                        .replacementsToWithhold ?? 0),
            )
            .map((x) => stateVariables[x.componentIdx].stateValues.value);
        expect(sample1numbersb.length).eq(70);
        expect(sample2numbersb.length).eq(160);

        for (let num of sample1numbersb) {
            expect([2, 3, 5, 7].includes(num)).eq(true);
        }

        for (let num of sample2numbersb) {
            expect([2, 3, 5, 11, 13, 17, 23, 31, 41, 43].includes(num)).eq(
                true,
            );
        }

        expect(sample1numbersb.slice(0, 10)).not.eqls(
            sample1numbers.slice(0, 10),
        );
        expect(sample2numbersb.slice(0, 10)).not.eqls(
            sample2numbers.slice(0, 10),
        );

        // Get new samples when change parameters
        await updateMathInputValue({
            latex: "20",
            componentIdx: await resolvePathToNodeIdx("maxNum"),
            core,
        });
        await updateMathInputValue({
            latex: "7, 19, 29, 37, 47, 2, 11, 23, 31, 41",
            componentIdx: await resolvePathToNodeIdx("exclude"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        let sample1numbersc = stateVariables[
            await resolvePathToNodeIdx("sample1")
        ].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        let sample2numbersc = stateVariables[
            await resolvePathToNodeIdx("sample2")
        ]
            .replacements!.slice(
                0,
                stateVariables[await resolvePathToNodeIdx("sample2")]
                    .replacements!.length -
                    (stateVariables[await resolvePathToNodeIdx("sample2")]
                        .replacementsToWithhold ?? 0),
            )
            .map((x) => stateVariables[x.componentIdx].stateValues.value);
        expect(sample1numbersc.length).eq(70);
        expect(sample2numbersc.length).eq(160);

        for (let num of sample1numbersc) {
            expect([2, 3, 5, 7, 11, 13, 17, 19].includes(num)).eq(true);
        }

        for (let num of sample2numbersc) {
            expect([3, 5, 13, 17, 43].includes(num)).eq(true);
        }

        expect(sample1numbersc.slice(0, 10)).not.eqls(
            sample1numbersb.slice(0, 10),
        );
        expect(sample2numbersc.slice(0, 10)).not.eqls(
            sample2numbersb.slice(0, 10),
        );
    });

    it("sampled numbers don't resample in dynamic repeat", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <setup>
        <sequence name="seq" length="$mi1" />
    </setup>
    <p name="p1"><repeat for="$seq" name="repeat1">
      <samplePrimeNumbers name="n" />
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

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><samplePrimeNumbers name="s" minValue="175" maxValue="205" numSamples="5" /></p>
    <p name="p2"><samplePrimeNumbers extend="$s" name="s2" asList="false" /></p>
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

    it("same numbers for given variant if variantDeterminesSeed", async () => {
        let doenetML = `
    <setup><sequence length="100" name="s" /></setup>
    <p name="p1"><repeat for="$s">
      <samplePrimeNumbers variantDeterminesSeed />
    </repeat></p>

    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        let samples = stateVariables[
            await resolvePathToNodeIdx("p1")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(samples.length).eq(100);

        for (let sample of samples) {
            expect(
                [
                    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                    59, 61, 67, 71, 73, 79, 83, 89, 97,
                ].includes(sample),
            ).eq(true);
        }

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        let samples2 = stateVariables[
            await resolvePathToNodeIdx("p1")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(samples2).eqls(samples);

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        }));

        stateVariables = await core.returnAllStateVariables(false, true);

        samples2 = stateVariables[
            await resolvePathToNodeIdx("p1")
        ].activeChildren.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(samples2.length).eq(100);

        for (let sample of samples2) {
            expect(
                [
                    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53,
                    59, 61, 67, 71, 73, 79, 83, 89, 97,
                ].includes(sample),
            ).eq(true);
        }

        expect(samples2).not.eqls(samples);
    });

    it(`resample prime numbers`, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
          <p><samplePrimeNumbers name="spn1" numSamples="2" maxValue="1000" />,
          <samplePrimeNumbers name="spn2" minValue="1000" maxValue="10000" />
          </p>

          <p>
            <callAction name="resamp1" target="$spn1" actionName="resample"><label>Resample first two</label></callAction>
            <callAction name="resamp2" target="$spn2" actionName="resample"><label>Resample last</label></callAction>
          </p>
      
          `,
        });

        let pn1, pn2, pn3;
        let pn1b, pn2b, pn3b;

        let stateVariables = await core.returnAllStateVariables(false, true);

        pn1 =
            stateVariables[await resolvePathToNodeIdx("spn1[1]")].stateValues
                .value;
        pn2 =
            stateVariables[await resolvePathToNodeIdx("spn1[2]")].stateValues
                .value;
        pn3 =
            stateVariables[await resolvePathToNodeIdx("spn2[1]")].stateValues
                .value;

        expect(pn1).gt(1).lt(1000);
        expect(pn2).gt(1).lt(1000);
        expect(pn3).gt(1000).lt(10000);

        expect(
            stateVariables[await resolvePathToNodeIdx("spn1[1]")].stateValues
                .text,
        ).eq(pn1.toString());

        await callAction({
            componentIdx: await resolvePathToNodeIdx("resamp1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        pn1b =
            stateVariables[await resolvePathToNodeIdx("spn1[1]")].stateValues
                .value;
        pn2b =
            stateVariables[await resolvePathToNodeIdx("spn1[2]")].stateValues
                .value;
        pn3b =
            stateVariables[await resolvePathToNodeIdx("spn2[1]")].stateValues
                .value;

        expect(pn1b).gt(1).lt(1000);
        expect(pn2b).gt(1).lt(1000);
        expect(pn3b).gt(1000).lt(10000);

        expect(pn1b).not.eq(pn1);
        expect(pn2b).not.eq(pn2);
        expect(pn3b).eq(pn3);

        expect(
            stateVariables[await resolvePathToNodeIdx("spn2[1]")].stateValues
                .text,
        ).eq(pn3.toString());

        await callAction({
            componentIdx: await resolvePathToNodeIdx("resamp2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);

        let pn1c =
            stateVariables[await resolvePathToNodeIdx("spn1[1]")].stateValues
                .value;
        let pn2c =
            stateVariables[await resolvePathToNodeIdx("spn1[2]")].stateValues
                .value;
        let pn3c =
            stateVariables[await resolvePathToNodeIdx("spn2[1]")].stateValues
                .value;

        expect(pn1c).gt(1).lt(1000);
        expect(pn2c).gt(1).lt(1000);
        expect(pn3c).gt(1000).lt(10000);

        expect(pn1c).eq(pn1b);
        expect(pn2c).eq(pn2b);
        expect(pn3c).not.eq(pn3);
    });
});
