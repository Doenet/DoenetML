import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    callAction,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("SelectRandomNumbers and SampleRandomNumbers tag tests", async () => {
    async function test_combined_statistics({
        doenetML,
        name,
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
        name: string;
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
                ...stateVariables[name].replacements!.map(
                    (x) => stateVariables[x.componentName].stateValues.value,
                ),
            );

            if (expectedMean !== undefined && i == 0) {
                expect(stateVariables[name].stateValues.mean).closeTo(
                    expectedMean,
                    1e-10,
                );
            }

            if (expectedVariance !== undefined && i == 0) {
                expect(stateVariables[name].stateValues.variance).closeTo(
                    expectedVariance,
                    1e-10,
                );
                expect(
                    stateVariables[name].stateValues.standardDeviation,
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

    it("no parameters, single uniform random number from 0 to 1", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s"/>`,
            `<sampleRandomNumbers name="s"/>`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                minValue: 0,
                strictMin: true,
                maxValue: 1,
                strictMax: false,
                allowedMeanMid: 0.5,
                allowedMeanSpread: 0.05,
                allowedVarianceMid: 1 / 12,
                allowedVarianceSpread: 0.015,
                expectedMean: 0.5,
                expectedVariance: 1 / 12,
            });
        }
    });

    it("five uniform random numbers from 0 to 8, only to specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="uniform" numToSelect="5" to="8"/>`,
            `<sampleRandomNumbers name="s" type="uniform" numSamples="5" to="8"/>`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 5,
                numRepetitions: 80,
                minValue: 0,
                strictMin: true,
                maxValue: 8,
                strictMax: false,
                allowedMeanMid: 4,
                allowedMeanSpread: 0.5,
                allowedVarianceMid: 8 ** 2 / 12,
                allowedVarianceSpread: 0.8,
                expectedMean: 4,
                expectedVariance: 8 ** 2 / 12,
            });
        }
    });

    it("five uniform random numbers from -5 to -4, only from specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="uniform" numToSelect="5" from="-5" />`,
            `<sampleRandomNumbers name="s" type="uniform" numSamples="5" from="-5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 5,
                numRepetitions: 80,
                minValue: -5,
                strictMin: true,
                maxValue: -4,
                strictMax: false,
                allowedMeanMid: -4.5,
                allowedMeanSpread: 0.05,
                allowedVarianceMid: 1 / 12,
                allowedVarianceSpread: 0.015,
                expectedMean: -4.5,
                expectedVariance: 1 / 12,
            });
        }
    });

    it("select ten uniform random numbers from -4 to -2", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="uniform" numToSelect="10" from="-4" to="-2" />`,
            `<sampleRandomNumbers name="s" type="uniform" numSamples="10" from="-4" to="-2" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 10,
                numRepetitions: 40,
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
        }
    });

    it("ten uniform random numbers from -2 to -4", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="uniform" numToSelect="10" from="-2" to="-4" />`,
            `<sampleRandomNumbers name="s" type="uniform" numSamples="10" from="-2" to="-4" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
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
        }
    });

    it("twenty continuous standard normals, no parameters", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="gaussian" numToSelect="20" />`,
            `<sampleRandomNumbers name="s" type="gaussian" numSamples="20" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 20,
                numRepetitions: 20,
                allowedMeanMid: 0,
                allowedMeanSpread: 0.2,
                allowedVarianceMid: 1,
                allowedVarianceSpread: 0.3,
                expectedMean: 0,
                expectedVariance: 1,
            });
        }
    });

    it("five continuous standard normals, unspecified mean 0, standard deviation 10", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="gaussian" numToSelect="5" standardDeviation="10" />`,
            `<sampleRandomNumbers name="s" type="gaussian" numSamples="5" standardDeviation="10" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 5,
                numRepetitions: 80,
                allowedMeanMid: 0,
                allowedMeanSpread: 2,
                allowedVarianceMid: 100,
                allowedVarianceSpread: 25,
                expectedMean: 0,
                expectedVariance: 100,
            });
        }
    });

    it("single continuous standard normal, mean -50, unspecified standard deviation 1", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="gaussian" mean="-50" />`,
            `<sampleRandomNumbers name="s" type="gaussian" mean="-50" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                allowedMeanMid: -50,
                allowedMeanSpread: 0.2,
                allowedVarianceMid: 1,
                allowedVarianceSpread: 0.3,
                expectedMean: -50,
                expectedVariance: 1,
            });
        }
    });

    it("twenty continuous standard normals, mean -3, variance 0.01", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="gaussian" numToSelect="20" mean="-3" variance="0.01" />`,
            `<sampleRandomNumbers name="s" type="gaussian" numSamples="20" mean="-3" variance="0.01" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 20,
                numRepetitions: 5,
                allowedMeanMid: -3,
                allowedMeanSpread: 0.1,
                allowedVarianceMid: 0.01,
                allowedVarianceSpread: 0.004,
                expectedMean: -3,
                expectedVariance: 0.01,
            });
        }
    });

    it("single discrete uniform, no parameters, integer from 0 to 1", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [0, 1],
                allowedMeanMid: 0.5,
                allowedMeanSpread: 0.1,
                allowedVarianceMid: (2 ** 2 - 1) / 12,
                allowedVarianceSpread: 0.1,
                expectedMean: 0.5,
                expectedVariance: (2 ** 2 - 1) / 12,
            });
        }
    });

    it("single discrete uniform, from 0.5 to 5.5, only to specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" to="5.5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" to="5.5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5],
                allowedMeanMid: 3,
                allowedMeanSpread: 0.3,
                allowedVarianceMid: (6 ** 2 - 1) / 12,
                allowedVarianceSpread: 0.5,
                expectedMean: 3,
                expectedVariance: (6 ** 2 - 1) / 12,
            });
        }
    });

    it("single discrete uniform, from 8.5 to 9.5, only from specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" from="8.5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" from="8.5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [8.5, 9.5],
                allowedMeanMid: 9,
                allowedMeanSpread: 0.1,
                allowedVarianceMid: (2 ** 2 - 1) / 12,
                allowedVarianceSpread: 0.05,
                expectedMean: 9,
                expectedVariance: (2 ** 2 - 1) / 12,
            });
        }
    });

    it("five integers from -3 to 5", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" numToSelect="5" from="-3" to="5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" numSamples="5" from="-3" to="5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 5,
                numRepetitions: 80,
                validValues: [-3, -2, -1, 0, 1, 2, 3, 4, 5],
                allowedMeanMid: 1,
                allowedMeanSpread: 0.5,
                allowedVarianceMid: (9 ** 2 - 1) / 12,
                allowedVarianceSpread: 1,
                expectedMean: 1,
                expectedVariance: (9 ** 2 - 1) / 12,
            });
        }
    });

    it("five integers from 5 to -3 gives nothing", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" numToSelect="5" from="5" to="-3" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" numSamples="5" from="5" to="-3" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 0,
                numRepetitions: 20,
            });
        }
    });

    it("10 odd integers from -3 to 5", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" numToSelect="10" from="-3" to="5" step="2" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" numSamples="10" from="-3" to="5" step="2" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 10,
                numRepetitions: 40,
                validValues: [-3, -1, 1, 3, 5],
                allowedMeanMid: 1,
                allowedMeanSpread: 0.5,
                allowedVarianceMid: ((5 ** 2 - 1) * 2 ** 2) / 12,
                allowedVarianceSpread: 1,
                expectedMean: 1,
                expectedVariance: ((5 ** 2 - 1) * 2 ** 2) / 12,
            });
        }
    });

    it("single discrete uniform, no parameters except exclude, get first two non-negative integers", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" exclude="0 2" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" exclude="0 2" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [1, 3],
                allowedMeanMid: 2,
                allowedMeanSpread: 0.2,
                allowedVarianceMid: ((2 ** 2 - 1) * 2 ** 2) / 12,
                allowedVarianceSpread: 0.2,
                expectedMean: 2,
                expectedVariance: ((2 ** 2 - 1) * 2 ** 2) / 12,
            });
        }
    });

    it("single discrete uniform, from 0.5 to 4.5, exclude 1.5, 3.5, only to and exclude specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" to="4.5" exclude="1.5 3.5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" to="4.5" exclude="1.5 3.5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [0.5, 2.5, 4.5],
                allowedMeanMid: 2.5,
                allowedMeanSpread: 0.3,
                allowedVarianceMid: ((3 ** 2 - 1) * 2 ** 2) / 12,
                allowedVarianceSpread: 0.5,
                expectedMean: 2.5,
                expectedVariance: ((3 ** 2 - 1) * 2 ** 2) / 12,
            });
        }
    });

    it("single discrete uniform, from 6.5 to 9.5 exclude 6.5, 8.6, only from and exclude specified", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" from="6.5" exclude="6.5 8.5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" from="6.5" exclude="6.5 8.5" />`,
        ];

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 1,
                numRepetitions: 400,
                validValues: [7.5, 9.5],
                allowedMeanMid: 8.5,
                allowedMeanSpread: 0.2,
                allowedVarianceMid: ((2 ** 2 - 1) * 2 ** 2) / 12,
                allowedVarianceSpread: 0.5,
                expectedMean: 8.5,
                expectedVariance: ((2 ** 2 - 1) * 2 ** 2) / 12,
            });
        }
    });

    it("five integers from -3 to 5, excluding -2 and 0", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" from="-3" to="5" exclude="-2 0" numToSelect="5" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" from="-3" to="5" exclude="-2 0" numSamples="5" />`,
        ];

        let vals = [-3, -1, 1, 2, 3, 4, 5];
        let mean = me.math.mean(vals);
        let variance = me.math.variance(vals, "uncorrected");

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 5,
                numRepetitions: 80,
                validValues: vals,
                allowedMeanMid: mean,
                allowedMeanSpread: 0.6,
                allowedVarianceMid: variance,
                allowedVarianceSpread: 1,
                expectedMean: mean,
                expectedVariance: variance,
            });
        }
    });

    it("10 odd integers from -3 to 5, excluding 3", async () => {
        const doenetMLs = [
            `<selectRandomNumbers name="s" type="discreteUniform" from="-3" to="5" exclude="3" step="2" numToSelect="10" />`,
            `<sampleRandomNumbers name="s" type="discreteUniform" from="-3" to="5" exclude="3" step="2" numSamples="10" />`,
        ];

        let vals = [-3, -1, 1, 5];
        let mean = me.math.mean(vals);
        let variance = me.math.variance(vals, "uncorrected");

        for (let doenetML of doenetMLs) {
            await test_combined_statistics({
                doenetML,
                name: "/s",
                numSamplesPerComponent: 10,
                numRepetitions: 40,
                validValues: vals,
                allowedMeanMid: mean,
                allowedMeanSpread: 0.5,
                allowedVarianceMid: variance,
                allowedVarianceSpread: 1,
                expectedMean: mean,
                expectedVariance: variance,
            });
        }
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><selectRandomNumbers name="s" from="175" to="205" assignNames="u v w x y" numToSelect="5" /></p>
    <p name="p2"><selectRandomNumbers copySource="s" name="s2" asList="false" /></p>
    <p name="p3"><sampleRandomNumbers name="s3" from="175" to="205" assignNames="u2 v2 w2 x2 y2" numSamples="5" /></p>
    <p name="p4"><sampleRandomNumbers copySource="s3" name="s4" asList="false" /></p>
    `,
        });

        let results: number[] = [];
        let results2: number[] = [];

        let stateVariables = await returnAllStateVariables(core);

        results.push(stateVariables["/u"].stateValues.value);
        results.push(stateVariables["/v"].stateValues.value);
        results.push(stateVariables["/w"].stateValues.value);
        results.push(stateVariables["/x"].stateValues.value);
        results.push(stateVariables["/y"].stateValues.value);
        results2.push(stateVariables["/u2"].stateValues.value);
        results2.push(stateVariables["/v2"].stateValues.value);
        results2.push(stateVariables["/w2"].stateValues.value);
        results2.push(stateVariables["/x2"].stateValues.value);
        results2.push(stateVariables["/y2"].stateValues.value);

        for (let num of results) {
            expect(num).gte(175).lte(205);
        }
        for (let num of results2) {
            expect(num).gte(175).lte(205);
        }

        let roundedResults = results.map((x) => Math.round(x * 100) / 100);
        expect(stateVariables["/p1"].stateValues.text).eq(
            roundedResults.join(", "),
        );
        expect(stateVariables["/p2"].stateValues.text).eq(
            roundedResults.join(""),
        );
        let roundedResults2 = results2.map((x) => Math.round(x * 100) / 100);
        expect(stateVariables["/p3"].stateValues.text).eq(
            roundedResults2.join(", "),
        );
        expect(stateVariables["/p4"].stateValues.text).eq(
            roundedResults2.join(""),
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

    it("sampled number does change dynamically", async () => {
        let core = await createTestCore({
            doenetML: `
    <mathInput prefill="50" name="numSamples"/>
    <mathInput prefill="10" name="maxNum"/>
    <p>
    <sampleRandomNumbers name="sample1" to="$maxNum" numSamples="$numSamples" />
    </p>

    <mathInput prefill="180" name="numSamples2"/>
    <mathInput prefill="4" name="standardDeviation"/>
    <p>
    <sampleRandomNumbers type="gaussian" name="sample2" standardDeviation="$standardDeviation" numSamples="$numSamples2" />
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
            expect(num).gte(0);
            expect(num).lt(10);
        }

        expect(me.math.mean(sample1numbers)).closeTo(5, 2);
        expect(me.math.variance(sample1numbers, "uncorrected")).closeTo(
            10 ** 2 / 12,
            3,
        );

        expect(me.math.mean(sample2numbers)).closeTo(0, 1.5);
        expect(me.math.variance(sample2numbers, "uncorrected")).closeTo(16, 8);

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
            expect(num).gte(0);
            expect(num).lt(10);
        }

        expect(me.math.mean(sample1numbersb)).closeTo(5, 2);
        expect(me.math.variance(sample1numbersb, "uncorrected")).closeTo(
            10 ** 2 / 12,
            4,
        );

        expect(me.math.mean(sample2numbersb)).closeTo(0, 1.5);
        expect(me.math.variance(sample2numbersb, "uncorrected")).closeTo(16, 8);

        for (let ind = 0; ind < 10; ind++) {
            expect(sample1numbersb[ind]).not.eq(sample1numbers[ind]);
        }
        for (let ind = 0; ind < 10; ind++) {
            expect(sample2numbersb[ind]).not.eq(sample2numbers[ind]);
        }

        // Get new samples when sample parameters
        await updateMathInputValue({
            latex: "4",
            name: "/maxNum",
            core,
        });
        await updateMathInputValue({
            latex: "18",
            name: "/standardDeviation",
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
            expect(num).gte(0);
            expect(num).lt(4);
        }
        expect(me.math.mean(sample1numbersc)).closeTo(2, 1);
        expect(me.math.variance(sample1numbersc, "uncorrected")).closeTo(
            4 ** 2 / 12,
            1,
        );

        expect(me.math.mean(sample2numbersc)).closeTo(0, 6);
        expect(me.math.variance(sample2numbersc, "uncorrected")).closeTo(
            18 ** 2,
            150,
        );

        for (let ind = 0; ind < 10; ind++) {
            expect(sample1numbersc[ind]).not.eq(sample1numbersb[ind]);
        }
        for (let ind = 0; ind < 10; ind++) {
            expect(sample2numbersc[ind]).not.eq(sample2numbersb[ind]);
        }
    });

    async function test_no_resample(core) {
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
    }

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

        await test_no_resample(core);
    });

    it("random number doesn't resample in dynamic map", async () => {
        let core = await createTestCore({
            doenetML: `
    How many numbers do you want? <mathInput name="mi1" />
    <p name="p1"><map assignNames="a b c d e f" name="map1">
      <template newNamespace><sampleRandomNumbers assignNames="n" /></template>
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

        await test_no_resample(core);
    });

    it("single discrete uniform number, assign name", async () => {
        const doenetMLs = [
            `<p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="u"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="v"/></p>
    <p><selectRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="w"/></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
            `<p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="u"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="v"/></p>
    <p><sampleRandomNumbers type="discreteUniform" from="3" step="7" to="16" assignNames="w"/></p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>`,
        ];

        for (let doenetML of doenetMLs) {
            let core = await createTestCore({ doenetML });

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
        }
    });

    it("multiple uniform random numbers, assign names", async () => {
        const doenetMLs = [
            `
    <p>
      <selectRandomNumbers name="s" from="3" to="13" assignNames="u v w" numToSelect="6" />
    </p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
            `
    <p>
      <sampleRandomNumbers name="s" from="3" to="13" assignNames="u v w" numSamples="6" />
    </p>
    <p>$u{name="u2"}</p>
    <p>$v{name="v2"}</p>
    <p>$w{name="w2"}</p>
    `,
        ];

        for (let doenetML of doenetMLs) {
            let core = await createTestCore({ doenetML });

            let results: number[] = [];

            let stateVariables = await returnAllStateVariables(core);
            let s = stateVariables["/s"];
            expect(s.replacements!.length).eq(6);
            for (let ind = 0; ind < 6; ind++) {
                let num =
                    stateVariables[s.replacements![ind].componentName]
                        .stateValues.value;
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
        }
    });

    it("multiple uniform random numbers, assign names, newNamespace", async () => {
        const doenetMLs = [
            `
    <p>
        <selectRandomNumbers name="s" newNamespace from="3" to="13" assignNames="u v w" numToSelect="6" />
    </p>
    <p>$(s/u{name="u2"})</p>
    <p>$(s/v{name="v2"})</p>
    <p>$(s/w{name="w2"})</p>
    `,
            `
    <p>
        <sampleRandomNumbers name="s" newNamespace from="3" to="13" assignNames="u v w" numSamples="6" />
    </p>
    <p>$(s/u{name="u2"})</p>
    <p>$(s/v{name="v2"})</p>
    <p>$(s/w{name="w2"})</p>
    `,
        ];

        for (let doenetML of doenetMLs) {
            let core = await createTestCore({ doenetML });

            let results: number[] = [];

            let stateVariables = await returnAllStateVariables(core);
            let s = stateVariables["/s"];
            expect(s.replacements!.length).eq(6);
            for (let ind = 0; ind < 6; ind++) {
                let num =
                    stateVariables[s.replacements![ind].componentName]
                        .stateValues.value;
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
        }
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

    <p><sampleRandomNumbers assignNames="n5" from="10" to="20" displayDigits="10" /></p>
    <p><sampleRandomNumbers assignNames="n6" from="10" to="20" displayDigits="3" /></p>
    <p><sampleRandomNumbers assignNames="n7" from="10" to="20" displayDecimals="3" /></p>
    <p><sampleRandomNumbers assignNames="n8" type="discreteUniform" from="10" to="20" displayDigits="3" padZeros /></p>

    <p><number name="n1a">$n1</number></p>
    <p><number name="n2a">$n2</number></p>
    <p><number name="n3a">$n3</number></p>
    <p><number name="n4a">$n4</number></p>

    <p><number name="n5a">$n5</number></p>
    <p><number name="n6a">$n6</number></p>
    <p><number name="n7a">$n7</number></p>
    <p><number name="n8a">$n8</number></p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);

        let n1 = stateVariables["/n1"].stateValues.value;
        let n2 = stateVariables["/n2"].stateValues.value;
        let n3 = stateVariables["/n3"].stateValues.value;
        let n4 = stateVariables["/n4"].stateValues.value;
        let n5 = stateVariables["/n5"].stateValues.value;
        let n6 = stateVariables["/n6"].stateValues.value;
        let n7 = stateVariables["/n7"].stateValues.value;
        let n8 = stateVariables["/n8"].stateValues.value;

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
        expect(stateVariables["/n5"].stateValues.text).eq(
            String(Math.round(n5 * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n6"].stateValues.text).eq(
            String(Math.round(n6 * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n7"].stateValues.text).eq(
            String(Math.round(n7 * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n8"].stateValues.text).eq(String(n8) + ".0");

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

        expect(stateVariables["/n5a"].stateValues.text).eq(
            String(Math.round(n5 * 10 ** 8) / 10 ** 8),
        );
        expect(stateVariables["/n6a"].stateValues.text).eq(
            String(Math.round(n6 * 10 ** 1) / 10 ** 1),
        );
        expect(stateVariables["/n7a"].stateValues.text).eq(
            String(Math.round(n7 * 10 ** 3) / 10 ** 3),
        );
        expect(stateVariables["/n8a"].stateValues.text).eq(String(n8) + ".0");
    });

    it("copying parameters", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Number of samples <mathInput name="numSamples" prefill="10" /></p>
    <p>Specified type of random number <textInput name="type" /></p>
    <p>Specified mean <mathInput name="specifiedMean" prefill="0" /></p>
    <p>Specified variance <mathInput name="specifiedVariance" prefill="1" /></p>
    <p>Specified from <mathInput name="specifiedFrom" prefill="0" /></p>
    <p>Specified to <mathInput name="specifiedTo" prefill="1" /></p>
    <p>Specified step <mathInput name="specifiedStep" prefill="1" /></p>
    <p>Actual type: $samples.type{obtainPropFromComposite assignNames="actualType"}</p>
    <p>Actual from: $samples.from{obtainPropFromComposite assignNames="actualFrom"}</p>
    <p>Actual to: $samples.to{obtainPropFromComposite assignNames="actualTo"}</p>
    <p>Actual step: $samples.step{obtainPropFromComposite assignNames="actualStep"}</p>
    <p>Expected mean: $samples.mean{obtainPropFromComposite assignNames="expectedMean" displayDigits="10"}</p>
    <p>Expected variance: $samples.variance{obtainPropFromComposite assignNames="expectedVariance" displayDigits="10"}</p>
    <p>Expected standard deviation: $samples.standardDeviation{obtainPropFromComposite assignNames="expectedStandardDeviation" displayDigits="10"}</p>
    <p>Resulting mean: <mean name="resultingMean" displayDigits="10">$samples</mean></p>
    <p>Resulting variance: <variance name="resultingVariance" displayDigits="10">$samples</variance></p>
    <p>Resulting standard deviation: <standardDeviation name="resultingStandardDeviation" displayDigits="10">$samples</standardDeviation></p>
    <p name="p1">
      <sampleRandomNumbers name="samples" numSamples="$numSamples" type="$type" mean="$specifiedMean" variance="$specifiedVariance" from="$specifiedFrom" to="$specifiedTo" step="$specifiedStep" displayDigits="10" />
    </p>
    <p name="p2">$samples</p>

    $p1{name="p3"}
    $p2{name="p4"}

    $p3{name="p5"}
    $p4{name="p6"}
    `,
        });

        let checkSamples = function ({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent,
            allowedErrorInMean,
            allowedErrorInVariance,
            checkAllSamples = true,
            stateVariables,
        }) {
            let nReplacements = sampleComponent.replacements.length;
            if (sampleComponent.replacementsToWithhold) {
                nReplacements -= sampleComponent.replacementsToWithhold;
            }
            let samples = sampleComponent.replacements
                .slice(0, nReplacements)
                .map((x) => stateVariables[x.componentName].stateValues.value);
            expect(samples.length).eq(numSamples);

            expect(stateVariables["/numSamples"].stateValues.value.tree).eq(
                numSamples,
            );
            expect(stateVariables["/type"].stateValues.value).eq(specifiedType);
            expect(stateVariables["/specifiedMean"].stateValues.value.tree).eq(
                specifiedMean,
            );
            expect(
                stateVariables["/specifiedVariance"].stateValues.value.tree,
            ).eq(specifiedVariance);
            expect(stateVariables["/specifiedFrom"].stateValues.value.tree).eq(
                specifiedFrom,
            );
            expect(stateVariables["/specifiedTo"].stateValues.value.tree).eq(
                specifiedTo,
            );
            expect(stateVariables["/specifiedStep"].stateValues.value.tree).eq(
                specifiedStep,
            );

            let type = specifiedType.toLowerCase();
            if (!["gaussian", "uniform", "discreteuniform"].includes(type)) {
                type = "uniform";
            }

            expect(stateVariables["/actualType"].stateValues.value).eq(type);

            let from = specifiedFrom;
            let to = specifiedTo;
            let step = specifiedStep;
            let expectedMean = specifiedMean;
            let expectedVariance = specifiedVariance;

            if (type === "uniform") {
                step = NaN;
                expectedMean = (to + from) / 2;
                expectedVariance = (to - from) ** 2 / 12;
            } else if (type === "discreteuniform") {
                to = from + Math.floor((to - from) / step) * step;
                expectedMean = (to + from) / 2;
                expectedVariance =
                    ((((to - from) / step + 1) ** 2 - 1) * step ** 2) / 12;
            } else {
                from = NaN;
                to = NaN;
                step = NaN;
            }

            let expectedStandardDeviation = Math.sqrt(expectedVariance);

            expect(stateVariables["/actualFrom"].stateValues.value).eqls(from);
            expect(stateVariables["/actualTo"].stateValues.value).eqls(to);
            expect(stateVariables["/actualStep"].stateValues.value).eqls(step);
            expect(stateVariables["/expectedMean"].stateValues.value).closeTo(
                expectedMean,
                1e-12,
            );
            expect(
                stateVariables["/expectedVariance"].stateValues.value,
            ).closeTo(expectedVariance, 1e-12);
            expect(
                stateVariables["/expectedStandardDeviation"].stateValues.value,
            ).closeTo(expectedStandardDeviation, 1e-12);

            let resultingMean = me.math.mean(samples);
            let resultingVariance = me.math.variance(samples);
            let resultingStandardDeviation = Math.sqrt(resultingVariance);

            expect(
                stateVariables["/resultingMean"].stateValues.value.tree,
            ).closeTo(resultingMean, 1e-12);
            expect(resultingMean).closeTo(expectedMean, allowedErrorInMean);

            expect(
                stateVariables["/resultingVariance"].stateValues.value.tree,
            ).closeTo(resultingVariance, 1e-12);
            expect(resultingVariance).closeTo(
                expectedVariance,
                allowedErrorInVariance,
            );

            expect(
                stateVariables["/resultingStandardDeviation"].stateValues.value
                    .tree,
            ).closeTo(resultingStandardDeviation, 1e-12);
            expect(resultingStandardDeviation).closeTo(
                expectedStandardDeviation,
                Math.sqrt(allowedErrorInVariance),
            );

            if (checkAllSamples) {
                for (let ind = 1; ind <= 6; ind++) {
                    let numbers = stateVariables[`/p${ind}`].stateValues.text
                        .split(",")
                        .map(Number);

                    expect(numbers.length).eq(numSamples);
                    for (let [i, num] of numbers.entries()) {
                        expect(num).closeTo(samples[i], 1e-8);
                    }
                }
            }
        };

        let numSamples = 10;
        let specifiedType = "";
        let specifiedMean = 0;
        let specifiedVariance = 1;
        let specifiedFrom = 0;
        let specifiedTo = 1;
        let specifiedStep = 1;

        // initial values
        let stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.4,
            allowedErrorInVariance: 0.4,
            stateVariables,
        });

        // Increase number of samples
        numSamples = 50;
        await updateMathInputValue({
            latex: numSamples.toString(),
            name: "/numSamples",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.2,
            allowedErrorInVariance: 0.2,
            checkAllSamples: false,
            stateVariables,
        });

        // change from and to
        specifiedFrom = -3;
        specifiedTo = 0;
        await updateMathInputValue({
            latex: specifiedFrom.toString(),
            name: "/specifiedFrom",
            core,
        });
        await updateMathInputValue({
            latex: specifiedTo.toString(),
            name: "/specifiedTo",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.4,
            allowedErrorInVariance: 0.4,
            checkAllSamples: false,
            stateVariables,
        });

        // change type to discrete uniform
        specifiedType = "discreteUniform";

        await updateTextInputValue({
            text: specifiedType,
            name: "/type",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.6,
            allowedErrorInVariance: 0.4,
            checkAllSamples: false,
            stateVariables,
        });

        // change from, to, and step
        specifiedFrom = 3;
        specifiedTo = -8;
        specifiedStep = -4;

        await updateMathInputValue({
            latex: specifiedFrom.toString(),
            name: "/specifiedFrom",
            core,
        });
        await updateMathInputValue({
            latex: specifiedTo.toString(),
            name: "/specifiedTo",
            core,
        });
        await updateMathInputValue({
            latex: specifiedStep.toString(),
            name: "/specifiedStep",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 1.5,
            allowedErrorInVariance: 3,
            checkAllSamples: false,
            stateVariables,
        });

        // change type to gaussian
        specifiedType = "gaussian";

        await updateTextInputValue({
            text: specifiedType,
            name: "/type",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.8,
            allowedErrorInVariance: 0.8,
            checkAllSamples: false,
            stateVariables,
        });

        // change mean and variance
        specifiedMean = -11;
        specifiedVariance = 3;

        await updateMathInputValue({
            latex: specifiedMean.toString(),
            name: "/specifiedMean",
            core,
        });
        await updateMathInputValue({
            latex: specifiedVariance.toString(),
            name: "/specifiedVariance",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.8,
            allowedErrorInVariance: 3,
            checkAllSamples: false,
            stateVariables,
        });

        // Increase number of samples
        numSamples = 200;
        await updateMathInputValue({
            latex: numSamples.toString(),
            name: "/numSamples",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 0.4,
            allowedErrorInVariance: 0.8,
            checkAllSamples: false,
            stateVariables,
        });

        // Decrease number of samples
        numSamples = 20;
        await updateMathInputValue({
            latex: numSamples.toString(),
            name: "/numSamples",
            core,
        });

        stateVariables = await returnAllStateVariables(core);

        checkSamples({
            numSamples,
            specifiedType,
            specifiedMean,
            specifiedVariance,
            specifiedFrom,
            specifiedTo,
            specifiedStep,
            sampleComponent: stateVariables["/samples"],
            allowedErrorInMean: 1.5,
            allowedErrorInVariance: 4,
            checkAllSamples: true,
            stateVariables,
        });
    });

    it("same numbers for given variant if variantDeterminesSeed", async () => {
        let doenetML = `
    <p name="p1"><map>
      <template><sampleRandomNumbers variantDeterminesSeed /></template>
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
            expect(sample).gt(0);
            expect(sample).lte(1);
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

        for (let [ind, sample] of samples2.entries()) {
            expect(sample).gt(0);
            expect(sample).lte(1);
            expect(sample).not.eq(samples[ind]);
        }
    });

    it(`resample random numbers`, async () => {
        let core = await createTestCore({
            doenetML: `
          <p><sampleRandomNumbers name="srn1" assignNames="rn1 rn2" numSamples="2" from="1" to="10" />,
          <sampleRandomNumbers name="srn2" assignNames="rn3" from="1000" to="10000" />
          </p>

          <p>
            <callAction name="resamp1" target="srn1" actionName="resample"><label>Resample first two</label></callAction>
            <callAction name="resamp2" target="srn2" actionName="resample"><label>Resample last</label></callAction>
          </p>
      
          `,
        });

        let rn1, rn2, rn3;
        let rn1b, rn2b, rn3b;

        let stateVariables = await returnAllStateVariables(core);

        rn1 = stateVariables["/rn1"].stateValues.value;
        rn2 = stateVariables["/rn2"].stateValues.value;
        rn3 = stateVariables["/rn3"].stateValues.value;

        expect(rn1).gt(1).lt(10);
        expect(rn2).gt(1).lt(10);
        expect(rn3).gt(1000).lt(10000);

        let rn1Rounded = Math.round(rn1 * 100) / 100;

        expect(stateVariables["/rn1"].stateValues.text).eq(
            rn1Rounded.toString(),
        );

        await callAction({ name: "/resamp1", core });

        stateVariables = await returnAllStateVariables(core);

        rn1b = stateVariables["/rn1"].stateValues.value;
        rn2b = stateVariables["/rn2"].stateValues.value;
        rn3b = stateVariables["/rn3"].stateValues.value;

        expect(rn1b).gt(1).lt(10);
        expect(rn2b).gt(1).lt(10);
        expect(rn3b).gt(1000).lt(10000);

        expect(rn1b).not.eq(rn1);
        expect(rn2b).not.eq(rn2);
        expect(rn3b).eq(rn3);

        let rn3Rounded = Math.round(rn3 * 100) / 100;

        expect(stateVariables["/rn3"].stateValues.text).eq(
            rn3Rounded.toString(),
        );

        await callAction({ name: "/resamp2", core });

        stateVariables = await returnAllStateVariables(core);

        let rn1c = stateVariables["/rn1"].stateValues.value;
        let rn2c = stateVariables["/rn2"].stateValues.value;
        let rn3c = stateVariables["/rn3"].stateValues.value;

        expect(rn1c).gt(1).lt(10);
        expect(rn2c).gt(1).lt(10);
        expect(rn3c).gt(1000).lt(10000);

        expect(rn1c).eq(rn1b);
        expect(rn2c).eq(rn2b);
        expect(rn3c).not.eq(rn3);
    });
});
