import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { callAction, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SamplePrimeNumbers tag tests", async () => {
    async function test_values_separately({
        doenetML,
        componentNames,
        compositeName,
        valid_values,
        num_samples,
        must_be_distinct = false,
        is_math = false,
    }: {
        doenetML: string;
        componentNames: string[];
        compositeName?: string;
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
            const s = stateVariables[compositeName ?? ""];
            for (let [ind, name] of componentNames.entries()) {
                let value = name
                    ? stateVariables[name].stateValues.value
                    : stateVariables[s.replacements![ind].componentName]
                          .stateValues.value;
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

    it("sample five prime numbers up to 20, only maxValue specified", async () => {
        const doenetML = `<samplePrimeNumbers assignNames="res1 res2 res3 res4 res5" numSamples="5" maxValue="20"/>`;
        const values = [2, 3, 5, 7, 11, 13, 17, 19];
        const valid_values = Array(5).fill(values);
        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
        });
    });

    it("sample five prime numbers between 50 and 100, only minValue specified", async () => {
        const doenetML = `<samplePrimeNumbers assignNames="res1 res2 res3 res4 res5" numSamples="5" minValue="50"/>`;
        const values = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        const valid_values = Array(5).fill(values);
        const componentNames = ["/res1", "/res2", "/res3", "/res4", "/res5"];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            num_samples: 10,
        });
    });

    it("sample fifty prime numbers between 10,000 and 100,0000", async () => {
        let core = await createTestCore({
            doenetML: `<samplePrimeNumbers name="s" numSamples="50" minValue="10000" maxValue="100000" />`,
        });

        let stateVariables = await returnAllStateVariables(core);

        let samples = stateVariables["/s"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
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
        const doenetML = `<samplePrimeNumbers name="s" assignNames="res1 res2 res3 res4 res5" numSamples="50" minValue="1900" maxValue="2000" exclude="1931 1979 1997"/>`;
        const values = [
            1901, 1907, 1913, 1933, 1949, 1951, 1973, 1987, 1993, 1999,
        ];
        const valid_values = Array(50).fill(values);
        const componentNames = [
            "/res1",
            "/res2",
            "/res3",
            "/res4",
            "/res5",
            ...Array(45).fill(""),
        ];

        await test_values_separately({
            doenetML,
            valid_values,
            componentNames,
            compositeName: "/s",
            num_samples: 1,
        });
    });

    it("sampled numbers do change dynamically", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);
        let sample1replacements = stateVariables["/sample1"].replacements!;
        let sample2replacements = stateVariables["/sample2"].replacements!;
        expect(sample1replacements.length).eq(50);
        expect(sample2replacements.length).eq(180);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
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
            name: "/numSamples",
            core,
        });
        await updateMathInputValue({
            latex: "160",
            name: "/numSamples2",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        let sample1numbersb = stateVariables["/sample1"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let sample2numbersb = stateVariables["/sample2"]
            .replacements!.slice(
                0,
                stateVariables["/sample2"].replacements!.length -
                    (stateVariables["/sample2"].replacementsToWithhold ?? 0),
            )
            .map((x) => stateVariables[x.componentName].stateValues.value);
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
            name: "/maxNum",
            core,
        });
        await updateMathInputValue({
            latex: "7, 19, 29, 37, 47, 2, 11, 23, 31, 41",
            name: "/exclude",
            core,
        });

        stateVariables = await returnAllStateVariables(core);
        let sample1numbersc = stateVariables["/sample1"].replacements!.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let sample2numbersc = stateVariables["/sample2"]
            .replacements!.slice(
                0,
                stateVariables["/sample2"].replacements!.length -
                    (stateVariables["/sample2"].replacementsToWithhold ?? 0),
            )
            .map((x) => stateVariables[x.componentName].stateValues.value);
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

    it("sampled numbers don't resample in dynamic map", async () => {
        let core = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <p name="p1"><map assignNames="a b c d e f" name="map1">
      <template newNamespace><samplePrimeNumbers assignNames="n" /></template>
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
        await updateMathInputValue({ latex: "1", name: "/mi1", core });

        let stateVariables = await returnAllStateVariables(core);
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

        stateVariables = await returnAllStateVariables(core);
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
        await updateMathInputValue({ latex: "0", name: "/mi1", core });
        await check_sampled_numbers([]);

        // get all six back
        await updateMathInputValue({ latex: "6", name: "/mi1", core });
        await check_sampled_numbers(sampledNumbers);
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><samplePrimeNumbers name="s" minValue="175" maxValue="205" assignNames="u v w x y" numSamples="5" /></p>
    <p name="p2"><samplePrimeNumbers copySource="s" name="s2" asList="false" /></p>
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

    it("same numbers for given variant if variantDeterminesSeed", async () => {
        let doenetML = `
    <p name="p1"><map>
      <template><samplePrimeNumbers variantDeterminesSeed /></template>
      <sources><sequence length="100" /></sources>
    </map></p>

    `;

        let core = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });

        let stateVariables = await returnAllStateVariables(core);

        let samples = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
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

        core = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });

        stateVariables = await returnAllStateVariables(core);

        let samples2 = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        expect(samples2).eqls(samples);

        core = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        });

        stateVariables = await returnAllStateVariables(core);

        samples2 = stateVariables["/p1"].activeChildren.map(
            (x) => stateVariables[x.componentName].stateValues.value,
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
        let core = await createTestCore({
            doenetML: `
          <p><samplePrimeNumbers name="spn1" assignNames="pn1 pn2" numSamples="2" maxValue="1000" />,
          <samplePrimeNumbers name="spn2" assignNames="pn3" minValue="1000" maxValue="10000" />
          </p>

          <p>
            <callAction name="resamp1" target="spn1" actionName="resample"><label>Resample first two</label></callAction>
            <callAction name="resamp2" target="spn2" actionName="resample"><label>Resample last</label></callAction>
          </p>
      
          `,
        });

        let pn1, pn2, pn3;
        let pn1b, pn2b, pn3b;

        let stateVariables = await returnAllStateVariables(core);

        pn1 = stateVariables["/pn1"].stateValues.value;
        pn2 = stateVariables["/pn2"].stateValues.value;
        pn3 = stateVariables["/pn3"].stateValues.value;

        expect(pn1).gt(1).lt(1000);
        expect(pn2).gt(1).lt(1000);
        expect(pn3).gt(1000).lt(10000);

        expect(stateVariables["/pn1"].stateValues.text).eq(pn1.toString());

        await callAction({ name: "/resamp1", core });

        stateVariables = await returnAllStateVariables(core);

        pn1b = stateVariables["/pn1"].stateValues.value;
        pn2b = stateVariables["/pn2"].stateValues.value;
        pn3b = stateVariables["/pn3"].stateValues.value;

        expect(pn1b).gt(1).lt(1000);
        expect(pn2b).gt(1).lt(1000);
        expect(pn3b).gt(1000).lt(10000);

        expect(pn1b).not.eq(pn1);
        expect(pn2b).not.eq(pn2);
        expect(pn3b).eq(pn3);

        expect(stateVariables["/pn3"].stateValues.text).eq(pn3.toString());

        await callAction({ name: "/resamp2", core });

        stateVariables = await returnAllStateVariables(core);

        let pn1c = stateVariables["/pn1"].stateValues.value;
        let pn2c = stateVariables["/pn2"].stateValues.value;
        let pn3c = stateVariables["/pn3"].stateValues.value;

        expect(pn1c).gt(1).lt(1000);
        expect(pn2c).gt(1).lt(1000);
        expect(pn3c).gt(1000).lt(10000);

        expect(pn1c).eq(pn1b);
        expect(pn2c).eq(pn2b);
        expect(pn3c).not.eq(pn3);
    });
});
