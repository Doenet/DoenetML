import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { callAction } from "../utils/actions";
import { sampleMultivariateHypergeometric } from "../../utils/randomNumbers";
import seedrandom from "seedrandom";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("SampleMultivariateRandomNumber tag tests @group4", async () => {
    /** log of "n choose k" */
    function logBinomial(n: number, k: number) {
        let result = 0;
        for (let i = 0; i < k; i++) {
            result += Math.log(n - i) - Math.log(i + 1);
        }
        return result;
    }

    /**
     * The exact multivariate hypergeometric probability of drawing `x` from a
     * population partitioned as `numInCategories`: prod(C(K_i, x_i)) / C(N, n).
     */
    function exactProbability(
        numInCategories: number[],
        x: number[],
        numDraws: number,
    ) {
        const numTotal = numInCategories.reduce((a, c) => a + c, 0);
        let logProbability = 0;
        for (let i = 0; i < numInCategories.length; i++) {
            if (x[i] < 0 || x[i] > numInCategories[i]) {
                return 0;
            }
            logProbability += logBinomial(numInCategories[i], x[i]);
        }
        return Math.exp(logProbability - logBinomial(numTotal, numDraws));
    }

    async function get_sampled_values(doenetML: string, name: string) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx(name);
        return stateVariables[componentIdx].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
    }

    // The joint distribution is checked directly against its exact pmf, since
    // marginal means alone would not catch a sampler that got the dependence
    // between categories wrong.
    const distributionCases: [number[], number][] = [
        [[5, 3, 2], 4],
        [[5, 3, 2], 8], // draws most of the population
        [[1, 1, 1, 1], 2],
        [[10, 1], 3], // effectively univariate
        [[4, 4], 8], // draws everything
        [[4, 4], 0], // draws nothing
        [[6, 0, 4], 3], // an empty category
    ];

    for (const [numInCategories, numDraws] of distributionCases) {
        it(`joint distribution for numInCategories=[${numInCategories}], numDraws=${numDraws}`, () => {
            const rng = seedrandom.alea(
                `mvh-${numInCategories.join("_")}-${numDraws}`,
            );
            const trials = 100000;
            const observed = new Map<string, number>();
            let brokenInvariant: string | null = null;

            for (let i = 0; i < trials; i++) {
                const counts = sampleMultivariateHypergeometric({
                    numInCategories,
                    numDraws,
                    rng,
                });

                // Checked with plain conditionals rather than expect() so the
                // assertion machinery doesn't dominate a 100k-iteration loop.
                if (brokenInvariant === null) {
                    if (counts.length !== numInCategories.length) {
                        brokenInvariant = `[${counts}] has the wrong number of categories`;
                    }
                    let sum = 0;
                    for (let j = 0; j < counts.length; j++) {
                        sum += counts[j];
                        if (
                            !Number.isInteger(counts[j]) ||
                            counts[j] < 0 ||
                            counts[j] > numInCategories[j]
                        ) {
                            brokenInvariant = `category ${j} of [${counts}] is outside 0..${numInCategories[j]}`;
                        }
                    }
                    if (sum !== numDraws) {
                        brokenInvariant = `[${counts}] sums to ${sum}, not ${numDraws}`;
                    }
                }

                const key = counts.join(",");
                observed.set(key, (observed.get(key) ?? 0) + 1);
            }

            expect(brokenInvariant).eq(null);

            let massObserved = 0;
            let worstDeviation = 0;
            for (const [key, count] of observed) {
                const x = key.split(",").map(Number);
                const exact = exactProbability(numInCategories, x, numDraws);
                worstDeviation = Math.max(
                    worstDeviation,
                    Math.abs(count / trials - exact),
                );
                massObserved += exact;
            }

            expect(worstDeviation, "worst joint-pmf deviation").lessThan(0.01);
            // every outcome seen is in the support, and together they are all of it
            expect(massObserved, "observed outcomes cover the support").closeTo(
                1,
                1e-6,
            );
        });
    }

    it("expands to one number per category, summing to numDraws", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="4" /></p>
    <p name="pFirst">$s[1]</p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        const values = stateVariables[componentIdx].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );

        expect(values.length).eq(3);
        expect(values.reduce((a, c) => a + c, 0)).eq(4);
        for (let i = 0; i < 3; i++) {
            expect(Number.isInteger(values[i])).eq(true);
            expect(values[i]).gte(0);
            expect(values[i]).lte([5, 3, 2][i]);
        }

        // indexing into the composite picks out a single category
        expect(
            stateVariables[await resolvePathToNodeIdx("pFirst")].stateValues
                .text,
        ).eq(values[0].toString());
    });

    it("reports numCategories, numTotal, means, and variances", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="4" />
    <p name="pSecondMean">$s.means[2]</p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        expect(stateVariables[componentIdx].stateValues.numCategories).eq(3);
        expect(stateVariables[componentIdx].stateValues.numTotal).eq(10);

        // mean = numDraws * numInCategories[i] / numTotal
        const means = stateVariables[componentIdx].stateValues.means;
        expect(means.length).eq(3);
        for (const [i, expected] of [2, 1.2, 0.8].entries()) {
            expect(means[i]).closeTo(expected, 1e-10);
        }

        // each marginal is univariate hypergeometric, so it carries the same
        // finite population correction: n*p*(1-p)*(N-n)/(N-1)
        const variances = stateVariables[componentIdx].stateValues.variances;
        expect(variances.length).eq(3);
        for (const [i, p] of [0.5, 0.3, 0.2].entries()) {
            expect(variances[i]).closeTo((4 * p * (1 - p) * 6) / 9, 1e-10);
        }

        // a single entry of the array is reachable by indexing
        expect(
            stateVariables[await resolvePathToNodeIdx("pSecondMean")]
                .stateValues.text,
        ).eq("1.2");
    });

    it("marginal means match the reported means", async () => {
        // Cross-checks the closed-form `means` against the sampler, which the
        // joint-pmf cases above cannot do: they only test the sampler.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="4" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const reportedMeans =
            stateVariables[await resolvePathToNodeIdx("s")].stateValues.means;

        const rng = seedrandom.alea("marginal-means");
        const numInCategories = [5, 3, 2];
        const sums = [0, 0, 0];
        const trials = 100000;

        for (let i = 0; i < trials; i++) {
            const counts = sampleMultivariateHypergeometric({
                numInCategories,
                numDraws: 4,
                rng,
            });
            for (let j = 0; j < 3; j++) {
                sums[j] += counts[j];
            }
        }

        for (let j = 0; j < 3; j++) {
            expect(sums[j] / trials).closeTo(reportedMeans[j], 0.02);
        }
    });

    it("degenerate populations", async () => {
        // drawing the whole population takes every item of every category
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="10" />`,
                "s",
            ),
        ).eqls([5, 3, 2]);

        // drawing nothing takes nothing from any category
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="0" />`,
                "s",
            ),
        ).eqls([0, 0, 0]);

        // an empty category can never be drawn from
        const withEmpty = await get_sampled_values(
            `<sampleMultivariateRandomNumber name="s" numInCategories="6 0 4" numDraws="3" />`,
            "s",
        );
        expect(withEmpty[1]).eq(0);
        expect(withEmpty.reduce((a, c) => a + c, 0)).eq(3);

        // a single category takes all the draws
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" numInCategories="7" numDraws="3" />`,
                "s",
            ),
        ).eqls([3]);
    });

    it("an empty population is sampled, not rejected", async () => {
        // categories that are all empty are a valid (if degenerate) population,
        // so the counts and their moments are zero rather than the NaN that the
        // 0/0 in `n * numInCategories[i] / numTotal` would otherwise give
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="0 0" numDraws="0" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        expect(
            stateVariables[componentIdx].replacements!.map(
                (x) => stateVariables[x.componentIdx].stateValues.value,
            ),
        ).eqls([0, 0]);
        expect(stateVariables[componentIdx].stateValues.means).eqls([0, 0]);
        expect(stateVariables[componentIdx].stateValues.variances).eqls([0, 0]);
    });

    it("invalid parameters give NaN", async () => {
        const doenetMLs = [
            // numDraws unspecified
            `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" />`,
            // more draws than the population holds
            `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="11" />`,
            // negative draws
            `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="-1" />`,
            // non-integer draws
            `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="2.5" />`,
            // non-integer category size
            `<sampleMultivariateRandomNumber name="s" numInCategories="5.5 3 2" numDraws="4" />`,
            // negative category size
            `<sampleMultivariateRandomNumber name="s" numInCategories="5 -3 2" numDraws="4" />`,
        ];

        for (let doenetML of doenetMLs) {
            const values = await get_sampled_values(doenetML, "s");
            expect(values.length).eq(3);
            for (let value of values) {
                expect(Number.isNaN(value)).eq(true);
            }
        }

        // with no categories at all there is nothing to sample, so no replacements
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" numDraws="0" />`,
                "s",
            ),
        ).eqls([]);
    });

    it("invalid parameters give NaN statistics too", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="11" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        for (let value of stateVariables[componentIdx].stateValues.means) {
            expect(Number.isNaN(value)).eq(true);
        }
        for (let value of stateVariables[componentIdx].stateValues.variances) {
            expect(Number.isNaN(value)).eq(true);
        }
    });

    it("a one-item population has zero variance", async () => {
        // the finite population correction divides by numTotal - 1
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="1 0" numDraws="1" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        for (let value of stateVariables[componentIdx].stateValues.variances) {
            expect(value).closeTo(0, 1e-10);
        }
    });

    it("unusable parameters are reported to the author, not just the console", async () => {
        // A console warning is invisible to someone authoring a document, so the
        // reason has to arrive as a diagnostic the surrounding tooling can show.
        const cases: [string, Record<string, unknown>][] = [
            [
                `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="11" />`,
                { numInCategories: "5, 3, 2", numDraws: 11 },
            ],
            [
                // numDraws left off entirely, which has no default to fall back on
                `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" />`,
                { numInCategories: "5, 3, 2", numDraws: "not-set" },
            ],
            [
                // and with no categories either
                `<sampleMultivariateRandomNumber name="s" />`,
                { numInCategories: "not-set", numDraws: "not-set" },
            ],
            [
                `<sampleMultivariateRandomNumber name="s" numInCategories="5.5 3" numDraws="2" />`,
                { numInCategories: "5.5, 3", numDraws: 2 },
            ],
        ];

        for (const [doenetML, args] of cases) {
            const { core } = await createTestCore({ doenetML });
            await core.returnAllStateVariables(false, true);

            const warnings = getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0135",
            );
            expect(warnings.length, doenetML).eq(1);
            expect(warnings[0].args).eqls(args);
            // the reader should never be shown a raw JavaScript value
            expect(warnings[0].message).not.toContain("null");
            expect(warnings[0].message).not.toContain("undefined");
        }
    });

    it("a draw too large to sample promptly is refused, not attempted", async () => {
        // Drawing each category costs a univariate hypergeometric draw, so this would
        // otherwise run for minutes rather than returning.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="1000000000 1000000000 1000000000" numDraws="1500000000" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        const warnings = getDiagnosticsByType(core).warnings.filter(
            (w) => w.code === "doenet-w0136",
        );
        expect(warnings.length).eq(1);
        expect(warnings[0].args).eqls({
            numDraws: 1500000000,
            numTotal: 3000000000,
            numCategories: 3,
            maxDraws: 1e7,
        });

        for (const replacement of stateVariables[componentIdx].replacements!) {
            expect(
                Number.isNaN(
                    stateVariables[replacement.componentIdx].stateValues.value,
                ),
            ).eq(true);
        }
        for (const value of stateVariables[componentIdx].stateValues.means) {
            expect(Number.isNaN(value)).eq(true);
        }
    });

    it("valid parameters raise no diagnostics", async () => {
        const { core } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="4" />`,
        });
        await core.returnAllStateVariables(false, true);

        const diagnostics = getDiagnosticsByType(core);
        expect(diagnostics.warnings.length).eq(0);
        expect(diagnostics.errors.length).eq(0);
    });

    it("resample draws a new vector", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><sampleMultivariateRandomNumber name="s" numInCategories="40 30 30" numDraws="30" /></p>
    <callAction name="resample" target="$s" actionName="resample"><label>Resample</label></callAction>
    `,
        });

        async function current_values() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const componentIdx = await resolvePathToNodeIdx("s");
            return stateVariables[componentIdx].replacements!.map(
                (x) => stateVariables[x.componentIdx].stateValues.value,
            );
        }

        // Resampling repeatedly: with this population an identical vector is
        // unlikely, so requiring one change across several tries is robust.
        const before = await current_values();
        expect(before.reduce((a, c) => a + c, 0)).eq(30);

        let changed = false;
        for (let attempt = 0; attempt < 10 && !changed; attempt++) {
            await callAction({
                core,
                componentIdx: await resolvePathToNodeIdx("resample"),
            });
            const after = await current_values();
            expect(after.length).eq(3);
            expect(after.reduce((a, c) => a + c, 0)).eq(30);
            if (after.some((v, i) => v !== before[i])) {
                changed = true;
            }
        }
        expect(changed, "resample should eventually change the counts").eq(
            true,
        );
    });

    it("same values for given variant if variantDeterminesSeed", async () => {
        const doenetML = `<sampleMultivariateRandomNumber name="s" numInCategories="40 30 30" numDraws="30" variantDeterminesSeed />`;

        async function values_for_variant(requestedVariantIndex: number) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const componentIdx = await resolvePathToNodeIdx("s");
            return stateVariables[componentIdx].replacements!.map(
                (x) => stateVariables[x.componentIdx].stateValues.value,
            );
        }

        const first = await values_for_variant(1);
        const firstAgain = await values_for_variant(1);
        const second = await values_for_variant(2);

        expect(firstAgain).eqls(first);
        expect(second).not.eqls(first);
    });
});
