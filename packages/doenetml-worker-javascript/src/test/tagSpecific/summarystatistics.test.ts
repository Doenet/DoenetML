import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("summaryStatistics tag tests @group4", async () => {
    async function statisticsOf(
        doenetML: string,
        name = "s",
    ): Promise<Record<string, any>> {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(name)].stateValues;
    }

    describe("statistics of values in the document", async () => {
        it("summarizes number children", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>2</number><number>4</number><number>4</number><number>10</number>
    </summaryStatistics>
    `);

            expect(sv.count).eq(4);
            expect(sv.sum).eq(20);
            expect(sv.mean).eq(5);
            expect(sv.minimum).eq(2);
            expect(sv.maximum).eq(10);
            expect(sv.median).eq(4);
            expect(sv.range).eq(8);
        });

        it("summarizes math children by their numeric value", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <math>1+1</math><math>4</math><math>3^2</math>
    </summaryStatistics>
    `);

            expect(sv.count).eq(3);
            expect(sv.sum).eq(15);
            expect(sv.maximum).eq(9);
        });

        it("summarizes a referenced list", async () => {
            const sv = await statisticsOf(`
    <numberList name="nl">2 4 4 10</numberList>
    <summaryStatistics name="s">$nl</summaryStatistics>
    `);

            expect(sv.count).eq(4);
            expect(sv.mean).eq(5);
        });

        it("summarizes the output of a counting operator", async () => {
            // The point of the unblock: the data an activity generates is in
            // the document, not in a file somewhere.
            const sv = await statisticsOf(`
    <numberList name="which">1 4 1 2 2 2 4</numberList>
    <tally name="counts" categories="1 2 3 4" hide>$which</tally>
    <summaryStatistics name="s">$counts</summaryStatistics>
    `);

            // counts are 2, 3, 0, 2
            expect(sv.count).eq(4);
            expect(sv.sum).eq(7);
            expect(sv.minimum).eq(0);
            expect(sv.maximum).eq(3);
        });

        it("recomputes when the values change", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="3" />
    <summaryStatistics name="s">
      <repeatForSequence from="1" to="$n" valueName="v"><number>$v</number></repeatForSequence>
    </summaryStatistics>
    `,
            });

            let sv = (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("s")
            ].stateValues;
            expect(sv.count).eq(3);
            expect(sv.sum).eq(6);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            sv = (await core.returnAllStateVariables(false, true))[
                await resolvePathToNodeIdx("s")
            ].stateValues;
            expect(sv.count).eq(5);
            expect(sv.sum).eq(15);
        });

        it("treats a non-numeric value as missing", async () => {
            // `count` is documented as the number of non-missing values, which
            // is what makes it worth reporting separately from how many
            // children there are.
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>2</number><math>x</math><number>4</number>
    </summaryStatistics>
    `);

            expect(sv.count).eq(2);
            expect(sv.sum).eq(6);
        });

        it("counts a text child only when it reads as a number", async () => {
            // The reference page's non-numeric example puts a `<text>` beside
            // the numbers, so a text child has to be summarized rather than
            // reported as a child this component cannot take.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="absent">72 91 65 <text>absent</text></summaryStatistics>
    <summaryStatistics name="numeric">72 91 65 <text>88</text></summaryStatistics>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("absent")].stateValues
                    .count,
            ).eq(3);
            // Text that does read as a number is data like any other, so it is
            // the value rather than the tag that decides.
            expect(
                stateVariables[await resolvePathToNodeIdx("numeric")]
                    .stateValues.count,
            ).eq(4);
            expect(
                stateVariables[await resolvePathToNodeIdx("numeric")]
                    .stateValues.sum,
            ).eq(316);

            expect(getDiagnosticsByType(core).warnings.length).eq(0);
        });

        it("uses the sample formulas for variance, stdev and stderr", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>2</number><number>4</number><number>4</number><number>10</number>
    </summaryStatistics>
    `);

            // Divided by n - 1 rather than by n: the deviations from the mean
            // of 5 are -3, -1, -1 and 5, so the squares total 36 and the
            // sample variance is 12 where the population variance would be 9.
            expect(sv.variance).eq(12);
            expect(sv.stdev).closeTo(Math.sqrt(12), 1e-12);
            // The standard error is that standard deviation over the square
            // root of the count.
            expect(sv.stderr).closeTo(Math.sqrt(12) / 2, 1e-12);
        });

        it("reports nothing for an empty list rather than failing", async () => {
            // Reachable now that children supply the data — a repeat that
            // produced nothing. `sum` reduces without an initial value and
            // `Math.min` of nothing is Infinity, so this has to be guarded.
            const sv = await statisticsOf(`
    <numberList name="none" />
    <summaryStatistics name="s">$none</summaryStatistics>
    `);

            expect(sv.count).eq(0);
            expect(sv.sum).eq(null);
            expect(sv.mean).eq(null);
            expect(sv.minimum).eq(null);
            expect(sv.maximum).eq(null);
            expect(sv.stdev).eq(null);
            expect(sv.variance).eq(null);
            expect(sv.median).eq(null);
            expect(sv.quartile1).eq(null);
            expect(sv.quartile3).eq(null);
            // Both of these are computed from other statistics rather than
            // from the column, so they have their own guard to get right.
            expect(sv.stderr).eq(null);
            expect(sv.range).eq(null);
        });

        it("ignores a value that is not finite", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>2</number><math>1/0</math><number>4</number>
    </summaryStatistics>
    `);

            // An infinite value would drag the mean and the maximum to
            // infinity, so it counts as missing along with the symbolic ones.
            expect(sv.count).eq(2);
            expect(sv.maximum).eq(4);
            expect(sv.mean).eq(3);
        });
    });

    describe("statistics of few or identical values", async () => {
        it("summarizes a single value", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s"><number>7</number></summaryStatistics>
    `);

            expect(sv.count).eq(1);
            expect(sv.sum).eq(7);
            expect(sv.mean).eq(7);
            expect(sv.minimum).eq(7);
            expect(sv.maximum).eq(7);
            expect(sv.median).eq(7);
            expect(sv.quartile1).eq(7);
            expect(sv.quartile3).eq(7);
            expect(sv.range).eq(0);
            // The sample variance divides by n - 1, which is zero here.
            // `math-expressions` answers 0 rather than dividing, and the
            // standard error follows it.
            expect(sv.variance).eq(0);
            expect(sv.stdev).eq(0);
            expect(sv.stderr).eq(0);
        });

        it("summarizes values that are all the same", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>5</number><number>5</number><number>5</number>
    </summaryStatistics>
    `);

            expect(sv.mean).eq(5);
            expect(sv.median).eq(5);
            expect(sv.range).eq(0);
            expect(sv.variance).eq(0);
            expect(sv.stdev).eq(0);
            expect(sv.stderr).eq(0);
        });

        it("takes the median and quartiles of an even count between values", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>1</number><number>2</number><number>3</number><number>4</number>
    </summaryStatistics>
    `);

            expect(sv.median).eq(2.5);
            expect(sv.quartile1).eq(1.75);
            expect(sv.quartile3).eq(3.25);
        });

        it("takes the median of an odd count at a value", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>1</number><number>2</number><number>3</number><number>4</number><number>5</number>
    </summaryStatistics>
    `);

            expect(sv.median).eq(3);
            expect(sv.quartile1).eq(2);
            expect(sv.quartile3).eq(4);
        });

        it("takes the median of a column at the top of the double range", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>1E308</number><number>1.5E308</number>
    </summaryStatistics>
    `);

            // Halfway between the two middle values, which is a number a
            // double holds even though their sum is not.
            expect(sv.median).eq(1.25e308);
        });

        it("takes the median of a column at the bottom of the double range", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>5E-324</number><number>5E-324</number>
    </summaryStatistics>
    `);

            // Halving each of the two middle values before adding them would
            // round both to zero, reporting a median the column does not
            // contain. Two copies of one value have that value as their
            // median, wherever in the range it sits.
            expect(sv.median).eq(5e-324);
        });

        it("takes the median of readings that agree to twelve digits", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>1</number><number>1.0000000000001</number><number>1.00000000000005</number>
    </summaryStatistics>
    `);

            // The middle of the three by value. Ordering them by a relative
            // tolerance instead reads all three as equal and answers with
            // whichever was written first.
            expect(sv.median).eq(1.00000000000005);
        });

        it("does not depend on the order the values are given in", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s">
      <number>4</number><number>1</number><number>3</number><number>2</number>
    </summaryStatistics>
    `);

            expect(sv.median).eq(2.5);
            expect(sv.quartile1).eq(1.75);
            expect(sv.minimum).eq(1);
            expect(sv.maximum).eq(4);
        });
    });

    describe("statistics reported", async () => {
        it("shows a default selection", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s"><number>1</number><number>2</number></summaryStatistics>
    `);

            expect(sv.statisticsToDisplay).eqls([
                "mean",
                "stdev",
                "count",
                "minimum",
                "quartile1",
                "median",
                "quartile3",
                "maximum",
            ]);
        });

        it("honors a named selection, in the canonical order", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="median mean">
      <number>1</number><number>2</number>
    </summaryStatistics>
    `);

            // The order is the one the statistics are declared in, not the
            // order they were asked for, so two documents asking for the same
            // set read the same way.
            expect(sv.statisticsToDisplay).eqls(["mean", "median"]);
            // The renderer keeps no list of its own: it draws one column per
            // key of `summaryStatistics`, in the order it finds them, so that
            // order is what the reader sees.
            expect(Object.keys(sv.summaryStatistics)).eqls(["mean", "median"]);
        });

        it("adds to the default selection rather than replacing it", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="default sum">
      <number>1</number><number>2</number>
    </summaryStatistics>
    `);

            // `default` names a set of statistics; it does not mean "only
            // these", so a statistic asked for beside it is shown too.
            expect(sv.statisticsToDisplay).eqls([
                "mean",
                "stdev",
                "count",
                "minimum",
                "quartile1",
                "median",
                "quartile3",
                "maximum",
                "sum",
            ]);
        });

        it("selects the five-number summary by name", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="fiveNumberSummary">
      <number>3</number><number>1</number><number>4</number><number>1</number>
      <number>5</number><number>9</number><number>2</number><number>6</number>
    </summaryStatistics>
    `);

            // The five a box plot draws. Neither `mean` nor
            // `count` is among them, which is what makes this a narrower
            // selection than `default` rather than an alias for it.
            expect(sv.statisticsToDisplay).eqls([
                "minimum",
                "quartile1",
                "median",
                "quartile3",
                "maximum",
            ]);
        });

        it("combines the five-number summary with a statistic named beside it", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="fiveNumberSummary mean">
      <number>1</number><number>2</number>
    </summaryStatistics>
    `);

            // Composes the way `default` does, and the result is in the
            // canonical order rather than the order asked for -- `mean` leads
            // even though it was written last.
            expect(sv.statisticsToDisplay).eqls([
                "mean",
                "minimum",
                "quartile1",
                "median",
                "quartile3",
                "maximum",
            ]);
        });

        it("shows every statistic for `all`", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="all">
      <number>1</number><number>2</number><number>6</number>
    </summaryStatistics>
    `);

            expect(sv.statisticsToDisplay).toContain("variance");
            expect(sv.statisticsToDisplay).toContain("range");
            expect(sv.statisticsToDisplay).toContain("sum");

            // `summaryStatistics` is what the table renders, so its entries are
            // display strings; the numbers themselves are the public
            // properties beside it.
            expect(sv.summaryStatistics.sum).eq("9");
            expect(sv.summaryStatistics.range).eq("5");
            expect(sv.sum).eq(9);
            expect(sv.range).eq(5);
        });

        it("rounds the displayed values but not the count", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="mean" displayDigits="3">
      <number>1</number><number>2</number><number>2</number>
    </summaryStatistics>
    `);

            expect(sv.summaryStatistics.mean).eq("1.67");
            // The state variable keeps full precision; what an author sees
            // from `$s.mean` is rounded, since the reference carries the
            // same display setting the table does.
            expect(sv.mean).closeTo(5 / 3, 1e-12);
        });

        it("never rounds the count", async () => {
            // A count is an exact tally: rounded to two significant digits,
            // 123 observations would be reported as 120.
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="count" displayDigits="2">
      <repeatForSequence from="1" to="123" valueName="v"><number>$v</number></repeatForSequence>
    </summaryStatistics>
    `);

            expect(sv.summaryStatistics.count).eq(123);
        });

        it("honors displayDecimals as well as displayDigits", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="mean" displayDecimals="4">
      <number>1</number><number>2</number><number>2</number>
    </summaryStatistics>
    `);

            expect(sv.summaryStatistics.mean).eq("1.6667");
        });

        it("pads the displayed values when asked to", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="mean sum" displayDecimals="3" padZeros>
      <number>1</number><number>2</number>
    </summaryStatistics>
    `);

            // `padZeros` and `avoidScientificNotation` are settings of how the
            // rounded number is written out rather than of the rounding, so
            // they have to reach the table separately.
            expect(sv.summaryStatistics.mean).eq("1.500");
            expect(sv.summaryStatistics.sum).eq("3.000");
        });

        it("writes a small value out in full when asked to", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="mean" avoidScientificNotation>
      <number>0.000000123</number>
    </summaryStatistics>
    `);

            expect(sv.summaryStatistics.mean).eq("0.000000123");
        });

        it("shows a small value as zero when asked to", async () => {
            const sv = await statisticsOf(`
    <summaryStatistics name="s" statisticsToDisplay="minimum maximum" displaySmallAsZero="1E-6">
      <number>0.000000123</number><number>5</number>
    </summaryStatistics>
    `);

            // The threshold is a rounding setting rather than a writing-out
            // one, so unlike the two above it reaches the table through
            // `roundForDisplay`. Only the minimum falls under it.
            expect(sv.summaryStatistics.minimum).eq("0");
            expect(sv.summaryStatistics.maximum).eq("5");
        });
    });

    describe("statistics as properties", async () => {
        it("are readable from elsewhere in the document", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="s">
      <number>2</number><number>4</number><number>4</number><number>10</number>
    </summaryStatistics>
    <p name="pMean">$s.mean</p>
    <p name="pCount">$s.count</p>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pMean")].stateValues
                    .text,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("pCount")].stateValues
                    .text,
            ).eq("4");
        });

        it("carry the display setting the table carries", async () => {
            // The reference page says `$rounded.mean` prints 81.4 rather than
            // the mean in full, which is the whole reason the page can tell an
            // author that the display attributes shape the table and a
            // reference to a statistic alike. The state variable keeps its
            // precision either way, so only rendering the reference checks it.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="scores">72 91 65 88 79 91 84</numberList>
    <summaryStatistics name="rounded" displayDigits="3">$scores</summaryStatistics>
    <p name="pMean">$rounded.mean</p>
    <p name="pCount">$rounded.count</p>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pMean")].stateValues
                    .text,
            ).eq("81.4");
            // The count is the exception in a reference as well as in the
            // table. Seven of it survives three significant digits either way,
            // so this assertion alone would pass even if the count were being
            // rounded -- see the test below, which uses a count that does not.
            expect(
                stateVariables[await resolvePathToNodeIdx("pCount")].stateValues
                    .text,
            ).eq("7");
        });

        it("does not round a referenced count either", async () => {
            // The table's exact count is pinned above; this pins the *reference*
            // to it, with a count that rounding would visibly change: at two
            // significant digits, 123 becomes 120.
            //
            // What keeps them apart is a difference between two blocks of
            // `shadowingInstructions`. Every computed statistic declares
            // `addAttributeComponentsShadowingStateVariables:
            // returnNumberDisplayAttributeComponentShadowing()`, which is why
            // `$rounded.mean` above prints 81.4. `count` declares an `integer`
            // and no such shadowing, so a reference to it inherits no
            // `displayDigits` to be rounded by. Add that line to `count` and
            // this test fails.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="s" statisticsToDisplay="count" displayDigits="2">
      <repeatForSequence from="1" to="123" valueName="v"><number>$v</number></repeatForSequence>
    </summaryStatistics>
    <p name="pCount">$s.count</p>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pCount")].stateValues
                    .text,
            ).eq("123");
        });

        it("read as NaN where there is no value", async () => {
            // A blank cell in the table is a `null` statistic, but a reference
            // is a number component, and a number with no value reads as NaN.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="none" />
    <summaryStatistics name="s">$none</summaryStatistics>
    <p name="pMean">$s.mean</p>
    <p name="pCount">$s.count</p>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("pMean")].stateValues
                    .text,
            ).eq("NaN");
            expect(
                stateVariables[await resolvePathToNodeIdx("pCount")].stateValues
                    .text,
            ).eq("0");
        });
    });

    describe("bare numbers as children", async () => {
        it("summarizes bare numbers", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="s">4 9 2</summaryStatistics>
    <p name="p">$s.mean, $s.count, $s.minimum, $s.maximum</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "5, 3, 2, 9",
            );
        });

        it("evaluates a bare fraction rather than dropping it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="s">1/2 3/2</summaryStatistics>
    <p name="p">$s.mean, $s.count</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "1, 2",
            );
        });

        it("mixes bare numbers with element children", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <summaryStatistics name="s">4 <number>9</number> 2</summaryStatistics>
    <p name="p">$s.mean, $s.count</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "5, 3",
            );
        });
    });
});
