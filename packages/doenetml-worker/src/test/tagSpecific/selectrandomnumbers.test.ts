import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("SelectRandomNumbers tag tests", async () => {
    async function test_combined_statistics({
        doenetML,
        componentName,
        numSamplesPerComponent,
        numRepetitions,
        minValue,
        strictMin = true,
        maxValue,
        strictMax = true,
        validValues,
        allowedMeanMid,
        allowedMeanSpread,
        allowedVarianceMid,
        allowedVarianceSpread,
        expectedMean,
        expectedVariance,
    }: {
        doenetML: string;
        componentName: string;
        numSamplesPerComponent: number;
        numRepetitions: number;
        minValue?: number;
        strictMin?: boolean;
        maxValue?: number;
        strictMax?: boolean;
        validValues?: number[];
        allowedMeanMid?: number;
        allowedMeanSpread?: number;
        allowedVarianceMid?: number;
        allowedVarianceSpread?: number;
        expectedMean?: number;
        expectedVariance?: number;
    }) {
        let samples: number[] = [];
        for (let i = 0; i < numRepetitions; i++) {
            let core = await createTestCore({
                doenetML,
                requestedVariantIndex: i,
            });
            const stateVariables = await returnAllStateVariables(core);
            samples.push(
                ...stateVariables[componentName].replacements!.map(
                    (x) => stateVariables[x.componentName].stateValues.value,
                ),
            );

            if (expectedMean !== undefined && i == 0) {
                expect(stateVariables[componentName].stateValues.mean).closeTo(
                    expectedMean,
                    1e-10,
                );
            }

            if (expectedVariance !== undefined && i == 0) {
                expect(
                    stateVariables[componentName].stateValues.variance,
                ).closeTo(expectedVariance, 1e-10);
                expect(
                    stateVariables[componentName].stateValues.standardDeviation,
                ).closeTo(Math.sqrt(expectedVariance), 1e-10);
            }
        }

        expect(samples.length).eq(numSamplesPerComponent * numRepetitions);

        if (minValue !== undefined) {
            for (let sample of samples) {
                if (strictMin) {
                    expect(sample).gt(minValue);
                } else {
                    expect(sample).gte(minValue);
                }
            }
        }

        if (maxValue !== undefined) {
            for (let sample of samples) {
                if (strictMax) {
                    expect(sample).lt(maxValue);
                } else {
                    expect(sample).lte(maxValue);
                }
            }
        }

        if (validValues !== undefined) {
            for (let sample of samples) {
                expect(validValues.includes(sample)).eq(true);
            }
        }

        if (allowedMeanMid !== undefined && allowedMeanSpread !== undefined) {
            let meanX = me.math.mean(samples);
            expect(meanX).closeTo(allowedMeanMid, allowedMeanSpread);
        }

        if (
            allowedVarianceMid !== undefined &&
            allowedVarianceSpread !== undefined
        ) {
            let varX = me.math.variance(samples, "uncorrected");
            expect(varX).closeTo(allowedVarianceMid, allowedVarianceSpread);
        }
    }

    it("no parameters, select single uniform random number from 0 to 1", async () => {
        const doenetML = `<selectRandomNumbers name="sel"/>`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 1,
            numRepetitions: 100,
            minValue: 0,
            strictMin: true,
            maxValue: 1,
            strictMax: false,
            allowedMeanMid: 0.5,
            allowedMeanSpread: 0.1,
            allowedVarianceMid: 1 / 12,
            allowedVarianceSpread: 0.02,
            expectedMean: 0.5,
            expectedVariance: 1 / 12,
        });
    });

    it("select five uniform random numbers from 0 to 8, only to specified", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="uniform" numToSelect="5" to="8"/>`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 5,
            numRepetitions: 20,
            minValue: 0,
            strictMin: true,
            maxValue: 8,
            strictMax: false,
            allowedMeanMid: 4,
            allowedMeanSpread: 0.5,
            allowedVarianceMid: 8 ** 2 / 12,
            allowedVarianceSpread: 1.5,
            expectedMean: 4,
            expectedVariance: 8 ** 2 / 12,
        });
    });

    it("select five uniform random numbers from -5 to -4, only from specified", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="uniform" numToSelect="5" from="-5" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 5,
            numRepetitions: 20,
            minValue: -5,
            strictMin: true,
            maxValue: -4,
            strictMax: false,
            allowedMeanMid: -4.5,
            allowedMeanSpread: 0.05,
            allowedVarianceMid: 1 / 12,
            allowedVarianceSpread: 0.02,
            expectedMean: -4.5,
            expectedVariance: 1 / 12,
        });
    });

    it("select ten uniform random numbers from -4 to -2", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="uniform" numToSelect="10" from="-4" to="-2" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 10,
            numRepetitions: 10,
            minValue: -4,
            strictMin: true,
            maxValue: -2,
            strictMax: false,
            allowedMeanMid: -3,
            allowedMeanSpread: 0.5,
            allowedVarianceMid: 2 ** 2 / 12,
            allowedVarianceSpread: 0.5,
            expectedMean: -3,
            expectedVariance: 2 ** 2 / 12,
        });
    });

    it("select ten uniform random numbers from -2 to -4", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="uniform" numToSelect="10" from="-2" to="-4" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 10,
            numRepetitions: 10,
            minValue: -4,
            strictMin: true,
            maxValue: -2,
            strictMax: false,
            allowedMeanMid: -3,
            allowedMeanSpread: 0.5,
            allowedVarianceMid: 2 ** 2 / 12,
            allowedVarianceSpread: 0.5,
            expectedMean: -3,
            expectedVariance: 2 ** 2 / 12,
        });
    });

    it("select twenty continuous standard normals, no parameters", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="gaussian" numToSelect="20" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 20,
            numRepetitions: 5,
            allowedMeanMid: 0,
            allowedMeanSpread: 0.3,
            allowedVarianceMid: 1,
            allowedVarianceSpread: 0.5,
            expectedMean: 0,
            expectedVariance: 1,
        });
    });

    it("select five continuous standard normals, unspecified mean 0, standard deviation 10", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="gaussian" numToSelect="5" standardDeviation="10" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 5,
            numRepetitions: 20,
            allowedMeanMid: 0,
            allowedMeanSpread: 3,
            allowedVarianceMid: 100,
            allowedVarianceSpread: 25,
            expectedMean: 0,
            expectedVariance: 100,
        });
    });

    it("select single continuous standard normal, mean -50, unspecified standard deviation 1", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="gaussian" mean="-50" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 1,
            numRepetitions: 100,
            allowedMeanMid: -50,
            allowedMeanSpread: 0.5,
            allowedVarianceMid: 1,
            allowedVarianceSpread: 0.4,
            expectedMean: -50,
            expectedVariance: 1,
        });
    });

    it("select twenty continuous standard normals, mean -3, variance 0.01", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="gaussian" numToSelect="20" mean="-3" variance="0.01" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 20,
            numRepetitions: 5,
            allowedMeanMid: -3,
            allowedMeanSpread: 0.1,
            allowedVarianceMid: 0.01,
            allowedVarianceSpread: 0.005,
            expectedMean: -3,
            expectedVariance: 0.01,
        });
    });

    it("select single discrete uniform, no parameters, integer from 0 to 1", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 1,
            numRepetitions: 100,
            validValues: [0, 1],
            allowedMeanMid: 0.5,
            allowedMeanSpread: 0.15,
            allowedVarianceMid: (2 ** 2 - 1) / 12,
            allowedVarianceSpread: 0.05,
            expectedMean: 0.5,
            expectedVariance: (2 ** 2 - 1) / 12,
        });
    });

    it("select single discrete uniform, from 0.5 to 5.5, only to specified", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" to="5.5" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 1,
            numRepetitions: 100,
            validValues: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5],
            allowedMeanMid: 3,
            allowedMeanSpread: 0.2,
            allowedVarianceMid: (6 ** 2 - 1) / 12,
            allowedVarianceSpread: 1,
            expectedMean: 3,
            expectedVariance: (6 ** 2 - 1) / 12,
        });
    });

    it("select single discrete uniform, from 8.5 to 9.5, only from specified", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" from="8.5" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 1,
            numRepetitions: 100,
            validValues: [8.5, 9.5],
            allowedMeanMid: 9,
            allowedMeanSpread: 0.1,
            allowedVarianceMid: (2 ** 2 - 1) / 12,
            allowedVarianceSpread: 0.05,
            expectedMean: 9,
            expectedVariance: (2 ** 2 - 1) / 12,
        });
    });

    it("select five integers from -3 to 5", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" numToSelect="5" from="-3" to="5" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 5,
            numRepetitions: 20,
            validValues: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
            allowedMeanMid: 1,
            allowedMeanSpread: 0.5,
            allowedVarianceMid: (9 ** 2 - 1) / 12,
            allowedVarianceSpread: 1.5,
            expectedMean: 1,
            expectedVariance: (9 ** 2 - 1) / 12,
        });
    });

    it("select five integers from 5 to -3 gives nothing", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" numToSelect="5" from="5" to="-3" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 0,
            numRepetitions: 20,
        });
    });

    it("select 10 odd integers from -3 to 5", async () => {
        const doenetML = `<selectRandomNumbers name="sel" type="discreteUniform" numToSelect="10" from="-3" to="5" step="2" />`;

        await test_combined_statistics({
            doenetML,
            componentName: "/sel",
            numSamplesPerComponent: 10,
            numRepetitions: 10,
            validValues: [-3, -1, 1, 3, 5],
            allowedMeanMid: 1,
            allowedMeanSpread: 0.8,
            allowedVarianceMid: ((5 ** 2 - 1) * 2 ** 2) / 12,
            allowedVarianceSpread: 2,
            expectedMean: 1,
            expectedVariance: ((5 ** 2 - 1) * 2 ** 2) / 12,
        });
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectRandomNumbers name="s" from="175" to="205" assignNames="u v w x y" numToSelect="5" /></p>
    <p name="p2"><selectRandomNumbers copySource="s" name="s2" asList="false" /></p>
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
            expect(num).gte(175).lte(205);
        }

        let roundedResults = results.map((x) => Math.round(x * 100) / 100);
        expect(stateVariables["/p1"].stateValues.text).eq(
            roundedResults.join(", "),
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            roundedResults.join(""),
        );
    });

    it("select doesn't change dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="20" name="numToSelect"/>
    <mathInput prefill="10" name="maxNum"/>
    <p>
    <selectRandomNumbers name="sample1" to="$maxNum" numToSelect="$numToSelect" />
    </p>

    <mathInput prefill="10" name="numToSelect2"/>
    <mathInput prefill="4" name="maxNum2"/>
    <p>
    <selectRandomNumbers type="discreteUniform" name="sample2" to="$maxNum2" numToSelect="$numToSelect2" />
    </p>
    <p>$maxNum2.value{assignNames="maxNum2a"}</p>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let sample1replacements = stateVariables["/sample1"].replacements!;
        let sample2replacements = stateVariables["/sample2"].replacements!;
        expect(sample1replacements.length).eq(20);
        expect(sample2replacements.length).eq(10);
        let sample1numbers = sample1replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );
        let sample2numbers = sample2replacements.map(
            (x) => stateVariables[x.componentName].stateValues.value,
        );

        for (let num of sample1numbers) {
            expect(num).gte(0);
            expect(num).lt(10);
        }
        for (let num of sample2numbers) {
            expect([0, 1, 2, 3, 4].includes(num)).eq(true);
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
      <template newNamespace><selectRandomNumbers assignNames="n" /></template>
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

    it("select single discrete uniform number, assign name", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="u"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="v"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="w"/></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        });

        let options = [3, 10];

        let stateVariables = await returnAllStateVariables(core);

        let u = stateVariables["/u"];
        let u2 = stateVariables["/u2"];

        expect(options.includes(u.stateValues.value)).eq(true);
        expect(u.stateValues.value).eq(u2.stateValues.value);

        let v = stateVariables["/v"];
        let v2 = stateVariables["/v2"];
        expect(options.includes(v.stateValues.value)).eq(true);
        expect(v.stateValues.value).eq(v2.stateValues.value);

        let w = stateVariables["/w"];
        let w2 = stateVariables["/w2"];
        expect(options.includes(w.stateValues.value)).eq(true);
        expect(w.stateValues.value).eq(w2.stateValues.value);
    });

    it("select multiple uniform random numbers, assign names", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
      <selectRandomNumbers name="s" from="3" to="13" assignNames="u v w" numToSelect="6" />
    </p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        });

        let results: number[] = [];

        let stateVariables = await returnAllStateVariables(core);
        let s = stateVariables["/s"];
        expect(s.replacements!.length).eq(6);
        for (let ind = 0; ind < 6; ind++) {
            let num =
                stateVariables[s.replacements![ind].componentName].stateValues
                    .value;
            results[ind] = num;
            expect(num).gte(3);
            expect(num).lt(13);
        }

        let u = stateVariables["/u"];
        let u2 = stateVariables["/u2"];
        expect(u.stateValues.value).eq(results[0]);
        expect(u2.stateValues.value).eq(results[0]);

        let v = stateVariables["/v"];
        let v2 = stateVariables["/v2"];
        expect(v.stateValues.value).eq(results[1]);
        expect(v2.stateValues.value).eq(results[1]);

        let w = stateVariables["/w"];
        let w2 = stateVariables["/w2"];
        expect(w.stateValues.value).eq(results[2]);
        expect(w2.stateValues.value).eq(results[2]);
    });

    it("select multiple uniform random numbers, assign names, newNamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
      <selectRandomNumbers name="s" newNamespace from="3" to="13" assignNames="u v w" numToSelect="6" />
    </p>
    <p>$(s/u{name="u2"})</p>
    <p>$(s/v{name="v2"})</p>
    <p>$(s/w{name="w2"})</p>
    `,
        });

        let results: number[] = [];

        let stateVariables = await returnAllStateVariables(core);
        let s = stateVariables["/s"];
        expect(s.replacements!.length).eq(6);
        for (let ind = 0; ind < 6; ind++) {
            let num =
                stateVariables[s.replacements![ind].componentName].stateValues
                    .value;
            results[ind] = num;
            expect(num).gte(3);
            expect(num).lt(13);
        }

        let u = stateVariables["/s/u"];
        let u2 = stateVariables["/u2"];
        expect(u.stateValues.value).eq(results[0]);
        expect(u2.stateValues.value).eq(results[0]);

        let v = stateVariables["/s/v"];
        let v2 = stateVariables["/v2"];
        expect(v.stateValues.value).eq(results[1]);
        expect(v2.stateValues.value).eq(results[1]);

        let w = stateVariables["/s/w"];
        let w2 = stateVariables["/w2"];
        expect(w.stateValues.value).eq(results[2]);
        expect(w2.stateValues.value).eq(results[2]);
    });

    it("numToSelect from selectFromSequence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>n1 = <selectFromSequence from="1" to="5" assignNames="n1" /></p>
    <p>nums = <selectRandomNumbers name="nums1" from="1" to="10" numToSelect="$n1" assignNames="a1 b1 c1 d1 e1" displayDigits="10" /></p>
    <p name="p1">a1=$a1, b1=$b1, c1=$c1, d1=$d1, e1=$e1</p>

    <p>n2 = <selectFromSequence from="1" to="5" assignNames="n2" /></p>
    <p>nums = <selectRandomNumbers name="nums2" from="1" to="10" numToSelect="$n2" assignNames="a2 b2 c2 d2 e2" displayDigits="10" /></p>
    <p name="p2">a2=$a2, b2=$b2, c2=$c2, d2=$d2, e2=$e2</p>

    <p>n3 = <selectFromSequence from="1" to="5" assignNames="n3" /></p>
    <p>nums = <selectRandomNumbers name="nums3" from="1" to="10" numToSelect="$n3" assignNames="a3 b3 c3 d3 e3" displayDigits="10" /></p>
    <p name="p3">a3=$a3, b3=$b3, c3=$c3, d3=$d3, e3=$e3</p>

    <p>n4 = <selectFromSequence from="1" to="5" assignNames="n4" /></p>
    <p>nums = <selectRandomNumbers name="nums4" from="1" to="10" numToSelect="$n4" assignNames="a4 b4 c4 d4 e4" displayDigits="10" /></p>
    <p name="p4">a4=$a4, b4=$b4, c4=$c4, d4=$d4, e4=$e4</p>

    <p>n5 = <selectFromSequence from="1" to="5" assignNames="n5" /></p>
    <p>nums = <selectRandomNumbers name="nums5" from="1" to="10" numToSelect="$n5" assignNames="a5 b5 c5 d5 e5" displayDigits="10" /></p>
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
            nums1
                .map((v, i) => `${l[i]}1=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
                .join(", "),
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            nums2
                .map((v, i) => `${l[i]}2=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
                .join(", "),
        );
        expect(stateVariables["/p3"].stateValues.text).eq(
            nums3
                .map((v, i) => `${l[i]}3=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
                .join(", "),
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            nums4
                .map((v, i) => `${l[i]}4=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
                .join(", "),
        );
        expect(stateVariables["/p5"].stateValues.text).eq(
            nums5
                .map((v, i) => `${l[i]}5=${v ? Math.round(v * 1e9) / 1e9 : ""}`)
                .join(", "),
        );
    });

    it("rounding", async () => {
        let core = await createTestCore({
            doenetML: `
    <p><selectRandomNumbers assignNames="n1" from="10" to="20" displayDigits="10" /></p>
    <p><selectRandomNumbers assignNames="n2" from="10" to="20" displayDigits="3" /></p>
    <p><selectRandomNumbers assignNames="n3" from="10" to="20" displayDecimals="3" /></p>
    <p><selectRandomNumbers assignNames="n4" type="discreteUniform" from="10" to="20" displayDigits="3" padZeros /></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

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
});
