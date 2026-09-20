import { describe, expect, it, vi } from "vitest";
import { getWarnings } from "./graph-prefigure.helpers";
import { chartXML } from "./chart.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { callAction, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("chart histogram prefigure tests @group4", async () => {
    /** The `(first, step, last)` triple PreFigure numbers an axis from. */
    function xml_hlabels(xml: string) {
        return xml.match(/hlabels="\(([^)]*)\)"/)?.[1].split(",");
    }

    /**
     * Ten observations from 2 to 9. Sturges' rule asks for five bins, and the
     * width rounded onto the 1, 2, 5 ladder gives four: 2 to 4, 4 to 6, 6 to 8
     * and 8 to 10, holding 3, 5, 1 and 1 of them.
     */
    const ONE_HISTOGRAM = `
    <chart type="histogram" name="c">
      <shortDescription>Ten observations</shortDescription>
      <series><label>heights</label>2 3 3 4 4 4 5 5 6 9</series>
    </chart>
    `;

    describe("the bars", async () => {
        it("draws one bar per bin, standing on zero at its count", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            expect(xml).toContain(
                '<rectangle at="bin-1" lower-left="(2,0)" dimensions="(2,3)"',
            );
            expect(xml).toContain(
                '<rectangle at="bin-2" lower-left="(4,0)" dimensions="(2,5)"',
            );
            expect(xml).toContain(
                '<rectangle at="bin-3" lower-left="(6,0)" dimensions="(2,1)"',
            );
            expect(xml).toContain(
                '<rectangle at="bin-4" lower-left="(8,0)" dimensions="(2,1)"',
            );
            expect(xml.match(/<rectangle /g)?.length).eq(4);
        });

        it("leaves no gap between the bars", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // Each bar starts where the one before it ended. The gap is the
            // whole visual difference between a histogram and a bar chart of
            // categories, so its absence is the thing to hold onto.
            const bars = [
                ...xml.matchAll(
                    /<rectangle [^>]*lower-left="\((-?[\d.]+),0\)" dimensions="\((-?[\d.]+),/g,
                ),
            ];
            expect(bars.length).eq(4);
            bars.forEach((bar, ind) => {
                if (ind === 0) {
                    return;
                }
                expect(Number(bar[1])).eq(
                    Number(bars[ind - 1][1]) + Number(bars[ind - 1][2]),
                );
            });
        });

        it("clips the bars to the box", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // A rectangle is drawn unclipped unless asked, so an authored bound
            // would otherwise leave part of a bar painted over the numbers
            // below the frame.
            expect(xml.match(/cliptobbox="yes"/g)?.length).eq(4);
        });

        it("draws a bar of no height where nothing fell in the bin", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10 15">
      <shortDescription>A gap in the middle</shortDescription>
      1 2 3 11 12
    </chart>
    `);

            // Drawn rather than skipped: a bin an observation might have fallen
            // into and did not is part of the shape of the distribution, and
            // the rectangle is the only thing a screen reader can stop on to
            // hear that the count there is zero.
            expect(xml).toContain(
                '<rectangle at="bin-2" lower-left="(5,0)" dimensions="(5,0)"',
            );
            expect(xml).toContain('<annotation ref="bin-2" text="5 to 10');
        });

        it("draws a bin too wide for a double as wide as one allows", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="-1e308 1e308">
      <shortDescription>x</shortDescription>
      0 1 2
    </chart>
    `);

            // A rectangle is a corner and a size, so PreFigure adds the two
            // back together to find the far corner and both have to stay inside
            // the double range. Cut points a quarter of the range apart on
            // either side of zero are already too far: the subtraction
            // overflows, and `formatNumber` writes what is not finite as
            // `null`, which is not a size PreFigure can read. A bar stopping
            // short of its own upper cut point is a far smaller wrong than a
            // bar with no width at all.
            expect(xml).toContain(
                '<rectangle at="bin-1" lower-left="(-1e+308,0)" dimensions="(1.7976931348623157e+308,3)"',
            );
            expect(xml).not.toContain("null");
        });

        it("prints the counts with displayValues", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10" displayValues>
      <shortDescription>Counts printed</shortDescription>
      1 2 3 4 5 6
    </chart>
    `);

            // Centered above each bar, at its far end, the way a bar chart
            // prints a value.
            expect(xml).toContain('<label anchor="(2.5,4)" alignment="north"');
            expect(xml).toContain('<label anchor="(7.5,2)" alignment="north"');
        });
    });

    describe("the counts", async () => {
        it("counts what <binCounts> counts, on the same data and cut points", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup><numberList name="sample">2 3 3 4 4 4 5 5 6 9</numberList></setup>
    <chart type="histogram" name="c" bins="0 4 8 12">
      <shortDescription>x</shortDescription>
      $sample
    </chart>
    <p name="chartCounts">$c.binCounts</p>
    <p name="operatorCounts"><binCounts bins="0 4 8 12">$sample</binCounts></p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // The definition is shared, so a table of counts and a histogram of
            // the same column cannot disagree on the page.
            expect(
                sv[await resolvePathToNodeIdx("chartCounts")].stateValues.text,
            ).eq(
                sv[await resolvePathToNodeIdx("operatorCounts")].stateValues
                    .text,
            );
            expect(
                sv[await resolvePathToNodeIdx("chartCounts")].stateValues.text,
            ).eq("3, 6, 1");
        });

        it("puts a value on a cut point in the bin above it", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10">
      <shortDescription>x</shortDescription>
      0 5 10
    </chart>
    `);

            // `[a, b)`, except the last bin, which also takes its upper cut
            // point — so the 10 is counted rather than dropped.
            expect(xml).toContain('dimensions="(5,1)"');
            expect(xml).toContain(
                '<annotation ref="bin-2" text="5 to 10, count 2"',
            );
        });

        it("puts it in the bin below with closed=right", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10" closed="right">
      <shortDescription>x</shortDescription>
      0 5 10
    </chart>
    `);

            // `(a, b]`, except the first bin, which also takes its lower cut
            // point — so the 0 is counted rather than dropped.
            expect(xml).toContain(
                '<annotation ref="bin-1" text="0 to 5, count 2"',
            );
            expect(xml).toContain(
                '<annotation ref="bin-2" text="5 to 10, count 1"',
            );
        });
    });

    describe("choosing the bins", async () => {
        it("chooses cut points that are round numbers covering the data", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    <p name="edges">$c.binEdges</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Sturges' rule asks for five bins here; the width is rounded up
            // onto the 1, 2, 5 ladder, which is what makes the cut points
            // numbers a document can state.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "2, 4, 6, 8, 10",
            );
        });

        it("takes a lone number as a number of bins, exactly", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="4">
      <shortDescription>x</shortDescription>
      1 2 3 4 5 6 7 8 9 10
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Four bins, so the range is divided in four rather than rounded to
            // anything: an author who asks for four gets four.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "1, 3.25, 5.5, 7.75, 10",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("3, 2, 2, 3");
        });

        it("takes two or more as the cut points themselves", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 5 10 20">
      <shortDescription>x</shortDescription>
      1 2 3 4 5 6 7 8 9 10
    </chart>
    <p name="edges">$c.binEdges</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "0, 5, 10, 20",
            );
        });

        it("gives a column with no spread one bin around it", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      7 7 7
    </chart>
    `);

            // No span to divide, so the width comes from the magnitude of the
            // value: a bin two wide at 7, where a column at 7000 would get one
            // in the thousands.
            expect(xml).toContain(
                '<rectangle at="bin-1" lower-left="(6,0)" dimensions="(2,3)"',
            );
            expect(xml.match(/<rectangle /g)?.length).eq(1);
        });

        it("divides a column with no spread into the count that was asked for", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="4">
      <shortDescription>x</shortDescription>
      7 7 7
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A column a simulation has not moved yet has no span to divide, so
            // the nice width one bin would have is split into the four that
            // were asked for instead. A count is exact whether or not the data
            // has spread, and the value is in a bin either way.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "6, 6.5, 7, 7.5, 8",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("0, 0, 3, 0");
            expect(getDiagnosticsByType(core).infos.length).eq(0);
        });

        it("keeps the outermost observations inside a requested count's bins", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="5">
      <shortDescription>x</shortDescription>
      -2.8461937482716 -1.5 -0.9 0 0.4 1.2 1.9 2.7
    </chart>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // The bins run between the data's own smallest and largest, which
            // is what makes every observation fall in one of them. Rounding
            // those two to a shorter number would move them by whatever the
            // digits below the round were worth, and rounding goes both ways:
            // half the time it moves a cut point past the observation it came
            // from, which then falls in no bin and is a bar one shorter.
            expect(xml).toContain('lower-left="(-2.8461937482716,0)"');
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("1, 2, 2, 1, 2");
            // Every one of the eight is in a bar, so there is nothing to say
            // about observations the cut points left out.
            expect(getDiagnosticsByType(core).infos.length).eq(0);
        });

        it("keeps the outermost observations inside the bins it chose itself", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      111365559.74588975 111365559.70256011 111365559.78202449
      111365559.80143051 111365559.6999208
    </chart>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A spread tiny beside the magnitude: rounding the lowest cut point
            // to twelve significant digits lands it just *above* the smallest
            // observation, which would then fall in no bin. Widened back onto
            // the data, so the outermost bin comes out a hair wider than its
            // neighbors rather than the sample coming out one observation
            // short — and so the rule the info message below rests on, that a
            // chart's own bins cover its data, holds rather than nearly holds.
            expect(xml).toContain('lower-left="(111365559.6999208,0)"');
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("3, 1, 1");
            expect(getDiagnosticsByType(core).infos.length).eq(0);
        });

        it("gives a sample too narrow to divide one bin holding all of it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      <number>1</number><number>1.0000000000000002</number>
    </chart>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Two observations a couple of ulps apart: the cut points a width
            // apart are one number once they are rounded, which is one cut
            // point and so no bin at all. One bin across the data is the
            // picture that sample supports, and a picture with nothing in it
            // is not.
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("2");
            expect(xml.match(/<rectangle /g)?.length).eq(1);
            expect(getDiagnosticsByType(core).infos.length).eq(0);
        });

        it("draws no bars at all with no observations", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
    </chart>
    <p name="edges">$c.binEdges</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A chart being written rather than one that is wrong: there is a
            // box and a pair of axes, and nothing in them.
            expect(xml).not.toContain("<rectangle ");
            expect(xml).toContain("<axes ");
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "",
            );
        });

        it("draws the bins an author wrote even with no observations yet", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10">
      <shortDescription>x</shortDescription>
    </chart>
    `);

            // A histogram with its bins named and its data yet to arrive is an
            // empty picture of the right shape rather than a blank one.
            expect(xml).toContain('<rectangle at="bin-1" lower-left="(0,0)"');
            expect(xml).toContain('dimensions="(5,0)"');
        });
    });

    describe("the axes", async () => {
        it("labels the horizontal axis at the cut points", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // The bars fill the axis, so it runs from the first cut point to
            // the last, and every label lands on one of them.
            expect(xml).toContain('bbox="(2,0,10,6)"');
            expect(xml).toContain('hlabels="(2,2,10)"');
        });

        it("labels the cut points of a requested count over data that has many digits", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="5">
      <shortDescription>x</shortDescription>
      1.234567890123456 3 5 7 9.876543210987654
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;
            const edges: number[] = chart.binEdges;

            // Five bins of one width, so the axis is labeled at their cut
            // points — and the labels have to survive the way those cut points
            // are built. The outermost two are the observations themselves and
            // the interior ones are snapped to twelve significant digits one at
            // a time, so the widths between them agree only to about that digit;
            // an axis that asked them to agree exactly called these bins uneven
            // and numbered itself 2, 4, 6, 8 instead.
            const hlabels = (xml_hlabels(chart.prefigureXML) ?? []).map(Number);
            expect(hlabels.length).eq(3);
            expect(hlabels[1]).closeTo(edges[1] - edges[0], 1e-9);

            // The run starts and ends on the outermost cut points themselves,
            // which is also where the box starts and ends. Recomputed from the
            // step instead, either end lands a hair outside the box — and
            // PreFigure draws no label outside it, so the first and last bars,
            // the ones that say where the data begins and ends, would have no
            // number under them.
            const [xMin, , xMax] = chart.chartGeometry.bounds;
            expect(hlabels[0]).eq(edges[0]);
            expect(hlabels[2]).eq(edges[edges.length - 1]);
            expect(hlabels[0]).toBeGreaterThanOrEqual(xMin);
            expect(hlabels[2]).toBeLessThanOrEqual(xMax);
        });

        it("labels the last cut point of bins narrow beside their own magnitude", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="6">
      <shortDescription>Barometric pressure</shortDescription>
      1013.21 1013.26 1013.29 1013.15 1013.33 1013.16 1013.29 1013.16 1013.17 1013.34 1013.32
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;
            const edges: number[] = chart.binEdges;

            // Eleven readings a fifth of a unit apart, a thousand units from
            // zero: the cut points are known to about the twelfth digit, which
            // is a millionth of a bin here rather than a billionth of one, and
            // the run's far end was landing a whole label short of the last cut
            // point. The rendered axis then stopped at 1013.31 and the sixth
            // bar, which ends at 1013.34, had no number under it.
            const hlabels = (xml_hlabels(chart.prefigureXML) ?? []).map(Number);
            expect(hlabels[0]).eq(edges[0]);
            expect(hlabels[2]).eq(edges[edges.length - 1]);
        });

        it("labels every few cut points where there are many bins", async () => {
            const edges = Array.from({ length: 21 }, (_unused, ind) => ind);
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="${edges.join(" ")}">
      <shortDescription>x</shortDescription>
      ${edges.slice(1).join(" ")}
    </chart>
    `);

            // Twenty bins, labeled every fourth cut point: 0, 4, 8, 12, 16, 20.
            // The stride is what keeps a histogram of twenty bins from writing
            // twenty numbers under itself, and every label still lands on a cut
            // point.
            expect(xml).toContain('hlabels="(0,4,20)"');
            expect(xml.match(/<rectangle /g)?.length).eq(20);
        });

        it("numbers the axis the ordinary way for a bound far outside the bins", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" xMin="-100" xMax="100">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    `);

            // Four bins of 2 carried across a box two hundred wide would want a
            // hundred labels, which is a row of numbers with no space between
            // them rather than an axis. A nice step of its own is what that box
            // can carry.
            expect(xml).toContain('bbox="(-100,0,100,6)"');
            expect(xml).toContain('hlabels="(-100,50,100)"');
        });

        it("tells an author's uneven cut points from their even ones, however far from zero", async () => {
            const uneven = await chartXML(`
    <chart type="histogram" name="c" bins="1000000000 1000000001 1000000002.001">
      <shortDescription>x</shortDescription>
      1000000000.5 1000000001.5
    </chart>
    `);
            const even = await chartXML(`
    <chart type="histogram" name="c" bins="1000000000 1000000001 1000000002">
      <shortDescription>x</shortDescription>
      1000000000.5 1000000001.5
    </chart>
    `);

            // Cut points an author wrote carry no rounding of ours, so they are
            // held to a few of the last bits a double has rather than to the
            // twelve digits our own cut points are snapped to. Held to the
            // looser one, the first pair here — bins a thousandth apart in
            // width, a billion from zero — was called even and labeled every
            // unit, which puts a number at 1000000002 where no cut point is.
            expect(uneven).toContain('hlabels="(1000000000,0.5,1000000002)"');
            expect(even).toContain('hlabels="(1000000000,1,1000000002)"');
        });

        it("labels an author's evenly spaced cut points whose width is not a round number", async () => {
            const xml = await chartXML(`
    <setup><numberList name="cuts"><sequence from="0" to="2" step="1/3" /></numberList></setup>
    <chart type="histogram" name="c" bins="$cuts">
      <shortDescription>x</shortDescription>
      <series>0.1 0.4 0.5 0.8 1.1 1.2 1.5 1.9</series>
    </chart>
    `);

            // Six bins a third of a unit wide. The step the axis is labeled by
            // is snapped, because it is written into the XML; the width the
            // other widths are compared to must not be, because the snap is a
            // rounding of ours and the differences it is held against carry
            // none. Held to the snapped one, these came out as unevenly binned
            // and the axis was numbered 0, 0.5, 1, 1.5, 2 — not one of which
            // but the ends is a cut point.
            expect(xml).toContain('hlabels="(0,0.333333333333,2)"');
        });

        it("numbers the axis the ordinary way for cut points of differing widths", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="0 5 10 20">
      <shortDescription>x</shortDescription>
      1 2 3 11 12
    </chart>
    `);

            // No one spacing to label at, so the axis gets a nice step anchored
            // at zero. The bars still show where the cut points are.
            expect(xml).toContain('bbox="(0,0,20,4)"');
            expect(xml).toContain('hlabels="(0,5,20)"');
        });

        it("measures counts from zero, in whole numbers", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // A bar's height is a number of things, so the axis starts at zero
            // and is never labeled in halves.
            expect(xml).toContain('vlabels="(0,2,6)"');
        });

        it("honors the author's bounds on both axes", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" xMin="-5" xMax="14" yMax="9">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    `);

            expect(xml).toContain('bbox="(-5,0,14,9)"');
            // The labels carry on across the axis the bounds added, at the
            // spacing the cut points set.
            expect(xml).toContain('hlabels="(-4,2,14)"');
        });

        it("opens the axis out around cut points that all coincide", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c" bins="5 5">
      <shortDescription>x</shortDescription>
      1 5 9
    </chart>
    `);

            // `<binCounts>` counts into a bin of no width quite happily, so the
            // cut points are drawn rather than refused — but a box of no width
            // is one PreFigure resolves to `nan` in every coordinate, which is
            // a broken picture rather than an empty one. The axis opens out
            // around them and the bar stands in it as the line of no width it
            // is.
            expect(xml).toContain('bbox="(4,0,6,2)"');
            expect(xml).toContain(
                '<rectangle at="bin-1" lower-left="(5,0)" dimensions="(0,1)"',
            );
        });

        it("reports the axes it was drawn with", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    <p name="bounds">$c.xMin, $c.xMax, $c.yMin, $c.yMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A histogram's horizontal axis is measured, unlike a bar chart's,
            // so all four are numbers.
            expect(
                sv[await resolvePathToNodeIdx("bounds")].stateValues.text,
            ).eq("2, 10, 0, 6");
        });
    });

    describe("what the chart reports", async () => {
        it("reports the cut points and the counts", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    <p name="tallest"><max>$c.binCounts</max></p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // The whole reason a histogram is binned here rather than by the
            // drawing: a document can say how many fell in the tallest bin, or
            // ask about it in an `<answer>`.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "2, 4, 6, 8, 10",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("3, 5, 1, 1");
            expect(
                sv[await resolvePathToNodeIdx("tallest")].stateValues.text,
            ).eq("5");
        });

        it("reports neither for a chart of another type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B C">
      <shortDescription>x</shortDescription>
      4 9 2
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A bar chart divided nothing, so there is nothing to report.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("");
        });

        it("reports no categories, and says so when the author writes some", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" categories="North South">
      <shortDescription>x</shortDescription>
      1 2 3
    </chart>
    <p name="cats">$c.categories</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A histogram's positions are its bins, named by the numbers they
            // run between. Reporting one category per observation would name
            // three positions on a chart that has one.
            expect(
                sv[await resolvePathToNodeIdx("c")].stateValues.categories,
            ).eqls([]);
            expect(sv[await resolvePathToNodeIdx("cats")].stateValues.text).eq(
                "",
            );
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0160");
        });
    });

    describe("what the chart says", async () => {
        it("leaves out an observation that is not a finite number, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 5 10">
      <shortDescription>x</shortDescription>
      1 2 3 x
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Counted nowhere rather than counted somewhere: the bar is the one
            // three observations give.
            expect(xml).toContain(
                '<annotation ref="bin-1" text="0 to 5, count 3"',
            );
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0156");
        });

        it("draws the first series and says the others were not", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 5 10">
      <shortDescription>x</shortDescription>
      <series><label>A</label>1 2 3</series>
      <series><label>B</label>6 7 8 9</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            expect(xml).toContain(
                '<annotation ref="bin-1" text="0 to 5, count 3"',
            );
            expect(xml).toContain(
                '<annotation ref="bin-2" text="5 to 10, count 0"',
            );
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0157");
        });

        it("chooses its own bins when a bin count is not one, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="2.5">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    <p name="edges">$c.binEdges</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "2, 4, 6, 8, 10",
            );
            const warnings = getDiagnosticsByType(core).warnings;
            expect(warnings.map((w) => w.code)).toContain("doenet-w0158");
            expect(warnings.map((w) => w.message).join(" ")).toContain("2.5");
        });

        it("chooses its own bins when the cut points do not climb, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 10 5">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    <p name="edges">$c.binEdges</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Reported rather than sorted into order, because which order the
            // author meant is exactly what is unclear.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "2, 4, 6, 8, 10",
            );
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0159");
        });

        it("chooses its own bins when a cut point is not finite, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 5 Infinity">
      <shortDescription>x</shortDescription>
      1 2 3 6 7
    </chart>
    <p name="edges">$c.binEdges</p>
    <binCounts name="b" bins="0 5 Infinity">1 2 3 6 7</binCounts>
    <p name="counted">$b</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // The one thing a chart refuses that `<binCounts>` accepts: a bin
            // with no far end is a bar a picture cannot hold, where a count of
            // everything above 5 is a perfectly good number. So the same cut
            // points give counts in a table and drive a chart to its own bins.
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "0, 2, 4, 6, 8",
            );
            expect(
                sv[await resolvePathToNodeIdx("counted")].stateValues.text,
            ).eq("3, 2");
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0159");
        });

        it("says when an observation fell outside the author's cut points", async () => {
            const { core } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" bins="0 5 10">
      <shortDescription>x</shortDescription>
      1 2 3 25
    </chart>
    `,
            });

            // Information rather than a warning: bins an author chose may
            // deliberately leave data out, and a reader cannot see what is
            // missing either way.
            expect(
                getDiagnosticsByType(core).infos.map((i) => i.code),
            ).toContain("doenet-i0052");
        });

        it("says nothing about bins it chose itself", async () => {
            const { warnings } = await getWarnings(`
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>
    `);

            // Chosen bins cover the data, so nothing falls outside them, and
            // nothing was asked for that could be wrong.
            expect(warnings.map((w) => w.code)).not.toContain("doenet-w0158");
            expect(warnings.map((w) => w.code)).not.toContain("doenet-w0159");
            expect(warnings.map((w) => w.code)).not.toContain("doenet-w0161");
        });

        it("says barWidth was not used", async () => {
            const { core } = await createTestCore({
                doenetML: `
    <chart type="histogram" name="c" barWidth="0.5">
      <shortDescription>x</shortDescription>
      1 2 3
    </chart>
    `,
            });

            // A gap is what says two bars stand for separate things, and a
            // histogram's are neighboring stretches of one scale.
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0161");
        });
    });

    describe("the annotation tree", async () => {
        it("gives every bar its stretch and its count", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            expect(xml).toContain(
                '<annotations><annotation ref="figure" text="Ten observations">',
            );
            expect(xml).toContain(
                '<annotation ref="bin-1" text="2 to 4, count 3" />',
            );
            expect(xml).toContain(
                '<annotation ref="bin-4" text="8 to 10, count 1" />',
            );
            expect(xml.match(/<annotation ref="bin-/g)?.length).eq(4);
        });

        it("hangs the bars straight under the figure", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // One group of data has no level between the figure and its marks
            // worth stopping at, so there is no `<group>` to walk through.
            expect(xml).not.toContain("<group ");
        });
    });

    describe("the legend", async () => {
        it("names a labeled series off its first bar", async () => {
            const xml = await chartXML(ONE_HISTOGRAM);

            // Keyed off a bar, as a bar chart's is: PreFigure reads the
            // swatch's color off the element the item points at.
            expect(xml).toContain('<item ref="bin-1"');
            expect(xml).toContain(">heights</item>");
        });

        it("draws none for a series with no label", async () => {
            const xml = await chartXML(`
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      1 2 3
    </chart>
    `);

            expect(xml).not.toContain("<legend");
        });
    });

    describe("as the document changes", async () => {
        it("chooses new cut points when the data moves", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="last" prefill="9" />
    <chart type="histogram" name="c">
      <shortDescription>x</shortDescription>
      2 3 3 4 4 4 5 5 6 $last
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    `,
            });

            let sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "2, 4, 6, 8, 10",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("3, 5, 1, 1");

            await updateMathInputValue({
                latex: "29",
                componentIdx: await resolvePathToNodeIdx("last"),
                core,
            });

            // The bins are chosen from the data, so moving one observation
            // moves the width, the first cut point and the number of bars at
            // once — and a bin nothing lands in appears between the two that
            // hold something.
            sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "0, 10, 20, 30",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("9, 0, 1");
        });

        it("draws and reports the bins a changed bin count asks for", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n" prefill="4" />
    <chart type="histogram" name="c" bins="$n">
      <shortDescription>x</shortDescription>
      1 2 3 4 5 6 7 8 9 10
    </chart>
    <p name="edges">$c.binEdges</p>
    <p name="counts">$c.binCounts</p>
    `,
            });

            let sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "1, 3.25, 5.5, 7.75, 10",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("3, 2, 2, 3");
            let xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;
            expect(xml.match(/<rectangle /g)?.length).eq(4);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });

            // A reader who asks for one more bin gets one more bar and one
            // more count: both are read off the geometry the chart redrew,
            // so the lists grow with the picture rather than keeping the
            // length they were first built at.
            sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("edges")].stateValues.text).eq(
                "1, 2.8, 4.6, 6.4, 8.2, 10",
            );
            expect(
                sv[await resolvePathToNodeIdx("counts")].stateValues.text,
            ).eq("2, 2, 2, 2, 2");
            xml = sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;
            expect(xml.match(/<rectangle /g)?.length).eq(5);
        });

        it("counts the sample it has after it is drawn again", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <setup>
      <sampleRandomNumbers name="z" type="uniform" from="0" to="1"
        numSamples="40" />
    </setup>
    <chart type="histogram" name="c" bins="0 0.25 0.5 0.75 1">
      <shortDescription>x</shortDescription>
      $z
    </chart>
    <p name="counts">$c.binCounts</p>
    <callAction name="again" actionName="resample" target="$z">
      <label>Draw again</label>
    </callAction>
    `,
            });

            /**
             * What the bars are drawn at, what the chart reports, and what the
             * sample it currently holds actually contains. The values are
             * copied out because the state variable hands back the live array.
             */
            async function readChart() {
                const sv = await core.returnAllStateVariables(false, true);
                const chart = sv[await resolvePathToNodeIdx("c")];
                const heights = [
                    ...chart.stateValues.prefigureXML.matchAll(
                        /<rectangle [^>]*dimensions="\([\d.]+,(\d+)\)"/g,
                    ),
                ].map((match) => Number(match[1]));
                const counts = sv[
                    await resolvePathToNodeIdx("counts")
                ].stateValues.text
                    .split(", ")
                    .map(Number);
                const values = [...chart.stateValues.values];
                const expected = [0, 0.25, 0.5, 0.75].map(
                    (lower, ind) =>
                        values.filter(
                            (value: number) =>
                                value >= lower &&
                                (ind === 3 ? value <= 1 : value < lower + 0.25),
                        ).length,
                );
                return { heights, counts, values, expected };
            }

            const before = await readChart();
            expect(before.counts).eqls(before.expected);
            expect(before.heights).eqls(before.expected);

            await callAction({
                componentIdx: await resolvePathToNodeIdx("again"),
                core,
            });

            // Counted against the new sample rather than against the old
            // counts: a chart that had not redrawn would still have bars
            // matching what it reports, and the two of them would agree on
            // the sample that is gone.
            const after = await readChart();
            expect(after.values).not.eqls(before.values);
            expect(after.counts).eqls(after.expected);
            expect(after.heights).eqls(after.expected);
        });
    });
});
