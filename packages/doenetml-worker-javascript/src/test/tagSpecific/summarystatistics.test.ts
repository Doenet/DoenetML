import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
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
            // Rounding is for display only — the property keeps full precision.
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
    });
});
