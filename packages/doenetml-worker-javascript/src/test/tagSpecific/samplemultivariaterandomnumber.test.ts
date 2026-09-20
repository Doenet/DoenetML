import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { callAction } from "../utils/actions";
import {
    multivariateSamplingDiagnostics,
    sampleFromMultivariateDistribution,
    sampleMultivariateHypergeometric,
} from "../../utils/randomNumbers";
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
    <p><sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="4" /></p>
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

    it("number display attributes and asList reach the numbers produced", async () => {
        // The component makes its own `<number>` replacements, so anything the
        // author writes about how a number is shown has to be copied onto them;
        // nothing downstream would do it. Drawing the whole population makes the
        // counts deterministic, so the rendered text can be compared exactly.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="10" displayDecimals="2" padZeros /></p>
    <p name="pRun"><sampleMultivariateRandomNumber name="s2" type="hypergeometric" numInCategories="5 3 2" numDraws="10" displayDecimals="2" padZeros asList="false" /></p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq("5.00, 3.00, 2.00");
        expect(
            stateVariables[await resolvePathToNodeIdx("pRun")].stateValues.text,
        ).eq("5.003.002.00");
    });

    it("reports numCategories, numTotal, means, and variances", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="4" />
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
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="4" />`,
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
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="10" />`,
                "s",
            ),
        ).eqls([5, 3, 2]);

        // drawing nothing takes nothing from any category
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="0" />`,
                "s",
            ),
        ).eqls([0, 0, 0]);

        // an empty category can never be drawn from
        const withEmpty = await get_sampled_values(
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="6 0 4" numDraws="3" />`,
            "s",
        );
        expect(withEmpty[1]).eq(0);
        expect(withEmpty.reduce((a, c) => a + c, 0)).eq(3);

        // a single category takes all the draws
        expect(
            await get_sampled_values(
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="7" numDraws="3" />`,
                "s",
            ),
        ).eqls([3]);
    });

    it("an empty population is sampled, not rejected", async () => {
        // categories that are all empty are a valid (if degenerate) population,
        // so the counts and their moments are zero rather than the NaN that the
        // 0/0 in `n * numInCategories[i] / numTotal` would otherwise give
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="0 0" numDraws="0" />`,
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

    it("no categories at all produces no numbers rather than NaN", async () => {
        // `numInCategories` is the one parameter with a default, and the length of
        // that list is what decides how many numbers there are to report. Leaving it
        // off therefore does not behave like leaving off `type` or `numDraws`, which
        // give a full-length list of NaN: there is nothing to report at all. The
        // reason is still explained, so the emptiness is not silent.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numDraws="0" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        expect(stateVariables[componentIdx].replacements!.length).eq(0);
        expect(stateVariables[componentIdx].stateValues.means).eqls([]);
        expect(stateVariables[componentIdx].stateValues.variances).eqls([]);

        const diagnostics = getDiagnosticsByType(core);
        expect(diagnostics.errors.length).eq(0);
        expect(diagnostics.warnings.map((w: any) => w.code)).eqls([
            "doenet-w0135",
        ]);
    });

    it("invalid parameters give NaN", async () => {
        const doenetMLs = [
            // numDraws unspecified
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" />`,
            // more draws than the population holds
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="11" />`,
            // negative draws
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="-1" />`,
            // non-integer draws
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="2.5" />`,
            // non-integer category size
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5.5 3 2" numDraws="4" />`,
            // negative category size
            `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 -3 2" numDraws="4" />`,
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
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numDraws="0" />`,
                "s",
            ),
        ).eqls([]);
    });

    it("invalid parameters give NaN statistics too", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="11" />`,
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
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="1 0" numDraws="1" />`,
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
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="11" />`,
                { numInCategories: "5, 3, 2", numDraws: 11 },
            ],
            [
                // numDraws left off entirely, which has no default to fall back on
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" />`,
                { numInCategories: "5, 3, 2", numDraws: "not-set" },
            ],
            [
                // and with no categories either
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" />`,
                { numInCategories: "not-set", numDraws: "not-set" },
            ],
            [
                `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5.5 3" numDraws="2" />`,
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

    it("every situation raises exactly one diagnostic, and a usable one raises none", () => {
        // Asked of the shared entry point rather than through a document, because
        // a core deduplicates diagnostics by message: the same explanation sent
        // twice is indistinguishable there from the same explanation sent once, so
        // no component-level count can pin down how many were raised.
        const cases: [
            {
                type: string | null;
                numInCategories: number[];
                numDraws: number;
            },
            string,
        ][] = [
            // no distribution named
            [
                { type: null, numInCategories: [5, 3, 2], numDraws: 4 },
                "doenet-w0137",
            ],
            // more draws than the population holds
            [
                {
                    type: "hypergeometric",
                    numInCategories: [5, 3, 2],
                    numDraws: 11,
                },
                "doenet-w0135",
            ],
            // Too slow to draw: one category on its own costs 6e6 draws, which
            // is under the ten-million limit, and only the two such draws the
            // three categories need between them exceed it — so this is refused
            // solely because the cost is counted per category.
            [
                {
                    type: "hypergeometric",
                    numInCategories: [6000000, 6000000, 6000000],
                    numDraws: 6000000,
                },
                "doenet-w0136",
            ],
            // slow enough to be worth saying so, but still sampled
            [
                {
                    type: "hypergeometric",
                    numInCategories: [3000000, 3000000],
                    numDraws: 3000000,
                },
                "doenet-w0133",
            ],
        ];

        for (const [parameters, code] of cases) {
            const diagnostics = multivariateSamplingDiagnostics(parameters);
            expect(diagnostics.length, code).eq(1);
            expect(diagnostics[0].code).eq(code);
        }

        // and parameters with nothing wrong with them say nothing at all
        expect(
            multivariateSamplingDiagnostics({
                type: "hypergeometric",
                numInCategories: [5, 3, 2],
                numDraws: 4,
            }),
        ).eqls([]);

        // Drawing nearly the whole population is as cheap as drawing almost
        // none of it, since each category draws whichever of the taken and
        // left-behind groups is smaller — which is why the message for a
        // refused draw offers raising numDraws as a fix alongside lowering it.
        // Half this population would need three billion draws and is refused;
        // all but ten of it needs twenty and is not.
        expect(
            multivariateSamplingDiagnostics({
                type: "hypergeometric",
                numInCategories: [1000000000, 1000000000, 1000000000],
                numDraws: 3000000000 - 10,
            }),
        ).eqls([]);
    });

    it("a population too large to count exactly is refused", async () => {
        // `Number.isInteger(1e308)` is true, so such a population would otherwise
        // be accepted whenever the draws are few — and then the arithmetic behind
        // `means` overflows to Infinity, while the sampler asks for a whole number
        // below a bound that has no representable multiple on the 2^53 grid and
        // rejects every draw it makes, so it never returns at all.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="1e308 5e307" numDraws="10" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        const warnings = getDiagnosticsByType(core).warnings.filter(
            (w) => w.code === "doenet-w0135",
        );
        expect(warnings.length).eq(1);

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

    it("a population whose total is too large to count exactly is refused", async () => {
        // Each category here is exact on its own, and few enough items are drawn
        // to be well under the work limit, but the population they add up to is
        // past 2^53 — and that total is the population the first category's draw
        // is taken against, so the sampler would reject every draw it made and
        // never return. Asked of the shared entry point first, because a document
        // that reached the sampler would hang rather than fail.
        const numInCategories = [2 ** 53 - 1, 2 ** 53 - 1];
        expect(
            multivariateSamplingDiagnostics({
                type: "hypergeometric",
                numInCategories,
                numDraws: 10,
            }).map((d) => d.code),
        ).eqls(["doenet-w0135"]);

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="${numInCategories.join(" ")}" numDraws="10" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        expect(
            getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0135",
            ).length,
        ).eq(1);

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

    it("a draw too large to sample promptly is refused, not attempted", async () => {
        // Drawing each category costs a univariate hypergeometric draw, so this would
        // otherwise run for minutes rather than returning.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="1000000000 1000000000 1000000000" numDraws="1500000000" />`,
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

    it("a draw below the limit but slow to make is still sampled, with a notice", async () => {
        // Between the point where a document turns sluggish and the point where the
        // draw is refused, the sample is taken as asked and the author is told why
        // the page feels slow — something no other part of the document can tell them.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="3000000 3000000" numDraws="3000000" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        const warnings = getDiagnosticsByType(core).warnings;
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0133");
        expect(warnings[0].args).eqls({
            distribution: "multivariate hypergeometric",
            draws: 3000000,
        });

        const values = stateVariables[componentIdx].replacements!.map(
            (x) => stateVariables[x.componentIdx].stateValues.value,
        );
        expect(values.reduce((a, c) => a + c, 0)).eq(3000000);
        for (const value of values) {
            expect(value).closeTo(1500000, 20000);
        }
    });

    it("an unspecified type samples nothing and says so", async () => {
        // `type` deliberately has no default: `hypergeometric` is unlikely to stay
        // the most natural one, and defaulting to it now would let documents come to
        // rely on it, so that changing the default later would silently reinterpret
        // them. Requiring the attribute keeps that door open.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" numInCategories="5 3 2" numDraws="4" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        // one warning and no other: the missing type is reported on its own
        // rather than also as unusable parameters. That it is raised only once is
        // not something a count here can see — a core deduplicates identical
        // messages — and is checked against the diagnostics themselves above.
        const diagnostics = getDiagnosticsByType(core);
        expect(diagnostics.errors.length).eq(0);
        expect(diagnostics.warnings.length).eq(1);
        expect(diagnostics.warnings[0].code).eq("doenet-w0137");
        expect(diagnostics.warnings[0].message).toContain(
            `type="hypergeometric"`,
        );

        // nothing is guessed: the counts and both sets of moments are NaN, even
        // though the remaining parameters would describe a usable population
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
        for (const value of stateVariables[componentIdx].stateValues
            .variances) {
            expect(Number.isNaN(value)).eq(true);
        }

        // the parameters themselves are still reported, so an author can see what
        // the component did read
        expect(stateVariables[componentIdx].stateValues.numCategories).eq(3);
        expect(stateVariables[componentIdx].stateValues.numTotal).eq(10);
    });

    it("a type the attribute does not recognize samples nothing either", async () => {
        // An unrecognized value falls back to the attribute's default, which is
        // no type at all, so it lands in the same refusal — reported as the value
        // that was rejected and then as the distribution that is now missing.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="gaussian" numInCategories="5 3 2" numDraws="4" />`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentIdx = await resolvePathToNodeIdx("s");

        const diagnostics = getDiagnosticsByType(core);
        expect(diagnostics.errors.length).eq(0);
        expect(diagnostics.warnings.length).eq(1);
        expect(diagnostics.warnings[0].code).eq("doenet-w0137");
        expect(diagnostics.infos.length).eq(1);
        expect(diagnostics.infos[0].message).toContain("gaussian");

        expect(stateVariables[componentIdx].stateValues.type).eq(null);
        for (const value of stateVariables[componentIdx].stateValues.means) {
            expect(Number.isNaN(value)).eq(true);
        }
    });

    it("the sampler refuses a type it has no distribution for", () => {
        // The `type` attribute rejects an unknown name before a document can reach
        // the sampler, but the sampler is exported and other code calls it directly.
        // An unrecognized name has to refuse there too, rather than falling through
        // to whichever distribution the code happened to try first — otherwise
        // adding a second distribution to `validValues` without wiring up its
        // sampler would quietly hand back hypergeometric counts.
        const rng = seedrandom.alea("refuses-unknown-type");
        const parameters = { numInCategories: [5, 3, 2], numDraws: 4 };

        for (const type of [
            null,
            "gaussian",
            // a property every object inherits: reachable through the prototype
            // chain, so a membership test that walks it would call `Object` here
            "constructor",
        ]) {
            const { sampledValues, diagnostics } =
                sampleFromMultivariateDistribution({
                    ...parameters,
                    type,
                    rng,
                });

            expect(sampledValues.length, String(type)).eq(3);
            for (const value of sampledValues) {
                expect(Number.isNaN(value), String(type)).eq(true);
            }
            expect(
                diagnostics.map((d: any) => d.code),
                String(type),
            ).eqls(["doenet-w0137"]);
        }

        // and the one name it does answer to still draws
        const { sampledValues, diagnostics } =
            sampleFromMultivariateDistribution({
                ...parameters,
                type: "hypergeometric",
                rng,
            });
        expect(sampledValues.reduce((a: number, b: number) => a + b, 0)).eq(4);
        expect(diagnostics).eqls([]);
    });

    it("resampling and reloading keep reporting why the parameters are unusable", async () => {
        // Reusing counts rather than drawing them — after a resample, or when saved
        // values are loaded back — takes a branch that never reached the sampler, so
        // the explanation used to disappear while the NaN it explained remained.
        const doenetML = `
    <p><sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="11" /></p>
    <callAction name="again" target="$s" actionName="resample"><label>Resample</label></callAction>
    `;
        function numExplanations(core: any) {
            return getDiagnosticsByType(core).warnings.filter(
                (w) => w.code === "doenet-w0135",
            ).length;
        }

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(numExplanations(core)).eq(1);

        await callAction({
            core,
            componentIdx: await resolvePathToNodeIdx("again"),
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        // The explanation from the first computation is still in this core's
        // accumulated list, and one sent again would be deduplicated away, so this
        // says only that resampling did not add a *different* explanation — not
        // that the reuse branch said anything. The reload below is what fails when
        // it says nothing.
        expect(numExplanations(core)).eq(1);
        for (const replacement of stateVariables[
            await resolvePathToNodeIdx("s")
        ].replacements!) {
            expect(
                Number.isNaN(
                    stateVariables[replacement.componentIdx].stateValues.value,
                ),
            ).eq(true);
        }

        // A reload begins with no diagnostics at all, so it is where an unexplained
        // NaN would actually reach the author: the counts come back from the saved
        // state without the sampler ever being asked for them.
        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(numExplanations(core)).eq(1);
        for (const replacement of stateVariables[
            await resolvePathToNodeIdx("s")
        ].replacements!) {
            expect(
                Number.isNaN(
                    stateVariables[replacement.componentIdx].stateValues.value,
                ),
            ).eq(true);
        }
    });

    it("valid parameters raise no diagnostics", async () => {
        const { core } = await createTestCore({
            doenetML: `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="5 3 2" numDraws="4" />`,
        });
        await core.returnAllStateVariables(false, true);

        const diagnostics = getDiagnosticsByType(core);
        expect(diagnostics.warnings.length).eq(0);
        expect(diagnostics.errors.length).eq(0);
    });

    it("resample draws a new vector", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="40 30 30" numDraws="30" /></p>
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
        const doenetML = `<sampleMultivariateRandomNumber name="s" type="hypergeometric" numInCategories="40 30 30" numDraws="30" variantDeterminesSeed />`;

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
