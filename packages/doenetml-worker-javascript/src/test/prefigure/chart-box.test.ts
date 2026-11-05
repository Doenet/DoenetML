import { describe, expect, it, vi } from "vitest";
import { getWarnings } from "./graph-prefigure.helpers";
import { chartXML } from "./chart.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("chart box prefigure tests @group4", async () => {
    /**
     * Six observations, chosen because they are the sample size where
     * interpolated percentiles and Tukey's hinges disagree: the quartiles here
     * are 2.25 and 4.75, where hinges would give 2 and 5.
     */
    const ONE_BOX = `
    <chart type="box" name="c">
      <shortDescription>Six observations</shortDescription>
      <series><label>A</label>1 2 3 4 5 6</series>
    </chart>
    `;

    describe("the box", async () => {
        it("draws the box from the first quartile to the third", async () => {
            const xml = await chartXML(ONE_BOX);

            // The one box sits at x = 1, half a slot wide, so it spans 0.75 to
            // 1.25; from the first quartile up to the third, which for these
            // six observations is 2.25 to 4.75.
            expect(xml).toContain(
                '<rectangle at="box-1" lower-left="(0.75,2.25)" dimensions="(0.5,2.5)"',
            );
            expect(xml.match(/<rectangle /g)?.length).eq(1);
        });

        it("draws the median across the box", async () => {
            const xml = await chartXML(ONE_BOX);

            // Across the whole width of the box, at 3.5 — and after the
            // rectangle in document order, so the fill cannot cover it.
            expect(xml).toContain('<line p1="(0.75,3.5)" p2="(1.25,3.5)"');
            expect(xml.indexOf('p1="(0.75,3.5)"')).greaterThan(
                xml.indexOf('at="box-1"'),
            );
        });

        it("draws a whisker to each end of the data, with a cap across it", async () => {
            const xml = await chartXML(ONE_BOX);

            // Up the middle of the slot, from each quartile to the furthest
            // observation the fence allows — which here is the whole range,
            // since an interquartile range of 2.5 puts the fences at -1.5 and
            // 8.5.
            expect(xml).toContain('<line p1="(1,2.25)" p2="(1,1)"');
            expect(xml).toContain('<line p1="(1,4.75)" p2="(1,6)"');

            // The cap is half the box's width, centered on the slot.
            expect(xml).toContain('<line p1="(0.875,1)" p2="(1.125,1)"');
            expect(xml).toContain('<line p1="(0.875,6)" p2="(1.125,6)"');

            // A median, two whiskers and two caps.
            expect(xml.match(/<line /g)?.length).eq(5);
        });

        it("draws no point where nothing lies beyond a whisker", async () => {
            const xml = await chartXML(ONE_BOX);

            expect(xml).not.toContain("<point ");
        });

        it("draws the whiskers as strokes, with no fill", async () => {
            const xml = await chartXML(ONE_BOX);

            // A `<line>` reads only the stroke attributes, so a fill on one
            // would say nothing — but the box it hangs from is a shape and
            // keeps its own.
            const median = xml.slice(xml.indexOf('<line p1="(0.75,3.5)"'));
            expect(median.slice(0, median.indexOf("/>"))).not.toContain("fill");
            expect(xml).toContain('at="box-1"');
            expect(xml.slice(xml.indexOf('at="box-1"'))).toContain("fill=");
        });

        it("clips the box and its whiskers to the frame", async () => {
            const xml = await chartXML(ONE_BOX);

            // A box is an extent and a whisker is a length, so a bound
            // genuinely truncates both: PreFigure draws neither clipped unless
            // asked, and the part outside would be painted over the names
            // below the frame.
            expect(xml.match(/cliptobbox="yes"/g)?.length).eq(6);
        });
    });

    describe("the whiskers and what lies beyond them", async () => {
        it("stops each whisker at an observation rather than at the fence", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Ten observations with one far out</shortDescription>
      <series><label>A</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    `);

            // The quartiles are 58.5 and 69, so the interquartile range is
            // 10.5 and the upper fence is at 84.75. The whisker stops at 72 —
            // the furthest observation inside it — and not at the fence, which
            // is a number the data does not contain.
            expect(xml).toContain('<line p1="(1,69)" p2="(1,72)"');
            expect(xml).not.toContain("84.75");
        });

        it("draws an observation past the fence as a point of its own", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Ten observations with one far out</shortDescription>
      <series><label>A</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    `);

            // A point, so that it is one element a screen reader can reach, and
            // so that it reads as an observation apart from the distribution
            // rather than as the end of the whisker.
            expect(xml).toContain('<point at="outlier-1-1" p="(1,96)"');
            expect(xml.match(/<point /g)?.length).eq(1);
        });

        it("reports the outliers on the series that holds them", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c">
      <series name="s">44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    <p name="out">$s.outliers</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(
                sv[await resolvePathToNodeIdx("s")].stateValues.outliers,
            ).eqls([96]);
            expect(sv[await resolvePathToNodeIdx("out")].stateValues.text).eq(
                "96",
            );
        });

        it("reports no outliers where nothing lies beyond a fence", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c"><series name="s">1 2 3 4 5 6</series></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // An empty list rather than nothing: "which values lie beyond the
            // fences" has an answer here, and it is none of them.
            expect(
                sv[await resolvePathToNodeIdx("s")].stateValues.outliers,
            ).eqls([]);
        });

        it("spends no margin on an outlier's marker", async () => {
            const withOutlier = await chartXML(`
    <chart type="box" name="c"><series>44 55 58 60 62 65 66 70 72 96</series></chart>
    `);
            const without = await chartXML(`
    <chart type="box" name="c"><series>55 58 60 62 65 66 70 72</series></chart>
    `);

            // A marker is a symbol around a datum rather than a shape a clip
            // may cut, so a scatter plot reserves seven pixels of margin for
            // one. An outlier is at the center of its slot, half a slot from
            // either side of it, and vertically the sixteen pixels above the
            // box and the thirty below already hold it — so the margins here
            // are the ones any box chart gets, and the left one is the axis
            // numbers' alone.
            expect(withOutlier).toContain('margins="[41,30,12,16]"');
            expect(without).toContain('margins="[32,30,12,16]"');
        });
    });

    describe("several series", async () => {
        const THREE_BOXES = `
    <chart type="box" name="c">
      <shortDescription>Scores by section</shortDescription>
      <series><label>morning</label>52 61 63 68 70 71 75 78 84 91</series>
      <series><label>afternoon</label>44 55 58 60 62 65 66 70 72 96</series>
      <series><label>evening</label>60 62 64 65 66 68 70</series>
    </chart>
    `;

        it("puts one box per series, side by side", async () => {
            const xml = await chartXML(THREE_BOXES);

            expect(xml.match(/<rectangle /g)?.length).eq(3);
            expect(xml).toContain('lower-left="(0.75,64.25)"');
            expect(xml).toContain('lower-left="(1.75,58.5)"');
            expect(xml).toContain('lower-left="(2.75,63)"');
        });

        it("names each position after the series drawn there", async () => {
            const xml = await chartXML(THREE_BOXES);

            // A box chart's positions are its series, so the names on the axis
            // are the series' own labels rather than `categories`.
            expect(xml).toContain('<tick-mark axis="horizontal" location="1"');
            expect(xml).toContain(">morning</tick-mark>");
            expect(xml).toContain(">afternoon</tick-mark>");
            expect(xml).toContain(">evening</tick-mark>");
        });

        it("typesets a name that carries math", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Two groups</shortDescription>
      <series><label>Group <m>x</m></label>1 2 3</series>
      <series><label>plain</label>4 5 6</series>
    </chart>
    `);

            // A tick mark's content goes through PreFigure's own label
            // machinery, so an `<m>` in it is typeset the way one in a legend
            // entry is. A box chart is the only type that can reach this: a
            // chart of categories names its positions from `categories`, which
            // is a `textList` and so is text and nothing else — and those names
            // are still written as they always were.
            expect(xml).toContain(">Group <m>x</m></tick-mark>");
            expect(xml).toContain(">plain</tick-mark>");
            // The drawn names, and only those. The annotation still carries
            // the label as it arrived, `\\(x\\)` and all — a bar chart's group
            // annotation does the same on `main`, because what a screen reader
            // should hear for a name written as math is a question for every
            // type at once rather than one this can answer alone.
            for (const tick of xml.match(/<tick-mark[^>]*>.*?<\/tick-mark>/g) ??
                []) {
                expect(tick).not.toContain("\\(");
            }
        });

        it("falls back to the position where a series has no label", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Two unnamed groups</shortDescription>
      <series>1 2 3</series>
      <series>4 5 6</series>
    </chart>
    `);

            // The same fallback `categories` makes on every type that uses it:
            // the position itself, 1, 2, 3.
            expect(xml).toContain(">1</tick-mark>");
            expect(xml).toContain(">2</tick-mark>");
        });

        it("keeps the position of a series with no observations", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>One group with nothing in it</shortDescription>
      <series><label>A</label>1 2 3</series>
      <series><label>B</label></series>
      <series><label>C</label>4 5 6</series>
    </chart>
    `);

            // Its name stays on the axis over an empty position: a gap reads as
            // a group with no data, which is what it is, where a missing
            // position would read as a group that was never given.
            expect(xml.match(/<tick-mark /g)?.length).eq(3);
            expect(xml).toContain(">B</tick-mark>");
            expect(xml.match(/<rectangle /g)?.length).eq(2);
            expect(xml).toContain('at="box-1"');
            expect(xml).toContain('at="box-3"');
            expect(xml).not.toContain('at="box-2"');
        });

        it("keeps the horizontal extent a bar chart of the same positions gets", async () => {
            const xml = await chartXML(THREE_BOXES);

            // Zero to one past the last position, so the gap before the first
            // box and the gap after the last are equal.
            expect(xml).toContain('bbox="(0,40,4,100)"');
        });

        it("draws each series in its own style", async () => {
            const xml = await chartXML(THREE_BOXES);

            // The categorical color scale every other type gives its series:
            // the chart's own number, then one more for each series after the
            // first.
            const boxes = xml.match(/<rectangle [^>]*>/g) ?? [];
            const strokes = boxes.map(
                (box) => box.match(/stroke="([^"]*)"/)?.[1],
            );
            expect(new Set(strokes).size).eq(3);
        });
    });

    describe("degenerate columns", async () => {
        it("draws a single observation as a line at its value", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>One observation</shortDescription>
      <series><label>A</label>5</series>
    </chart>
    `);

            // Every one of the five numbers is 5, so the box has no height and
            // neither whisker has any length. Drawn rather than skipped: a
            // rectangle of no height paints as a line at the value, which is
            // exactly what the summary says.
            expect(xml).toContain(
                '<rectangle at="box-1" lower-left="(0.75,5)" dimensions="(0.5,0)"',
            );
            expect(xml).toContain('<line p1="(0.75,5)" p2="(1.25,5)"');
            // The median alone: a whisker of no length, and a cap lying along
            // the edge of the box, would be two marks saying what the box's own
            // edge already says.
            expect(xml.match(/<line /g)?.length).eq(1);
        });

        it("draws a column of one repeated value the same way", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>No spread at all</shortDescription>
      <series><label>A</label>7 7 7 7</series>
    </chart>
    `);

            expect(xml).toContain('dimensions="(0.5,0)"');
            expect(xml.match(/<line /g)?.length).eq(1);
            expect(xml).not.toContain("<point ");
        });

        it("draws no whisker on the side where the quartile is the extreme", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A lower quarter of one repeated value</shortDescription>
      <series><label>A</label>2 2 2 2 2 2 2 6 9 12</series>
    </chart>
    `);

            // The first quartile is 2, which is also the smallest observation,
            // so the lower whisker would have no length and its cap would lie
            // along the bottom edge of the box.
            expect(xml).toContain('<line p1="(1,5)" p2="(1,9)"');
            expect(xml).not.toContain('p2="(1,2)"');
            // The median and the one whisker with its cap.
            expect(xml.match(/<line /g)?.length).eq(3);
        });

        it("keeps a box drawable at the top of the double range", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A column a double can barely hold</shortDescription>
      <series><label>A</label>1E308 1.5E308</series>
    </chart>
    `);

            // Averaging the two middle observations to find the median
            // overflows before it halves, and `formatNumber` writes anything
            // non-finite as `null` — which is not a coordinate PreFigure can
            // read. Interpolated as halves instead, so the median line is
            // drawn where the summary says it is.
            expect(xml).toContain('<line p1="(0.75,1.25e+308)"');
            expect(xml).toContain("median 1.25e+308");
            expect(xml).not.toContain("null");
        });

        it("keeps a box drawable across the whole double range", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A column spanning the double range</shortDescription>
      <series><label>A</label>-1.7976931348623157E308 -1.7976931348623157E308 -1.7976931348623157E308 1.7976931348623157E308 1.7976931348623157E308 1.7976931348623157E308</series>
    </chart>
    `);

            // A rectangle is written as a corner and a size, and the distance
            // between these two quartiles is not a number: the box is drawn as
            // tall as a double goes rather than with a `null` for its height.
            expect(xml).toContain('dimensions="(0.5,1.7976931348623157e+308)"');
            expect(xml).not.toContain("null");
        });

        it("draws a box for a column whose values agree to twelve digits", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Three readings that barely differ</shortDescription>
      <series><label>A</label>1 1.0000000000001 1.00000000000005</series>
    </chart>
    `);

            // The quartiles of a column this narrow can come back out of
            // order, and fences taken in that order would lie the wrong way
            // round and put every observation outside them — a chart of three
            // loose points saying that none of the three is typical.
            expect(xml).toContain('<rectangle at="box-1"');
            expect(xml.match(/<point /g)?.length).eq(1);
        });

        it("writes the box from its lower corner even where the quartiles came out inverted", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A column narrower than the comparison tolerance</shortDescription>
      <series><label>A</label>1E-16 2E-16 3E-16 4E-16</series>
    </chart>
    `);

            // `quantileSeq` answers with a first quartile of 3.5e-16 above its
            // third of 2.5e-16 on this column, and a rectangle written from
            // that pair as it stands has its corner at the top and a negative
            // height. Taken in order, so `lower-left` is the corner it says it
            // is, over the same interval either way.
            expect(xml).toContain(
                '<rectangle at="box-1" lower-left="(0.75,2.5e-16)" dimensions="(0.5,1e-16)"',
            );

            // The annotation still reports the pair as it came out: it is
            // saying what the statistic answered, not describing the shape.
            expect(xml).toContain(
                "first quartile 3.5e-16, median 2.5e-16, third quartile 2.5e-16",
            );
        });

        it("draws no whisker where no observation lies inside the fences", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A column whose quartiles it has no observation near</shortDescription>
      <series><label>A</label>3E-16 2E-16 2E-16</series>
    </chart>
    `);

            // Both quartiles come back as 2.5e-16, which this column does not
            // contain, so the interquartile range is zero and every one of the
            // three observations is outside the fences. Each whisker then falls
            // back to its quartile and has no length to draw: the box's own
            // edge is the mark, and all three observations are drawn as points.
            expect(xml).toContain('dimensions="(0.5,0)"');
            expect(xml.match(/<point /g)?.length).eq(3);
            // The median alone — no whisker, and so no cap either.
            expect(xml.match(/<line /g)?.length).eq(1);
        });

        it("draws both whiskers outward from a box whose quartiles inverted", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>A spread inside the comparison tolerance</shortDescription>
      <series>1E-16 2E-16 3E-16 4E-16</series>
    </chart>
    `);

            // `quantileSeq` compares with a tolerance, so this column's
            // quartiles come back the wrong way round. The rectangle takes them
            // in order, and so must the whiskers: paired with the quartiles as
            // they came out, the lower one would start at the top of the box
            // and run down past the bottom, and the upper one back up through
            // it — two lines drawn through the box rather than out of it.
            expect(xml).toContain('lower-left="(0.75,2.5e-16)"');
            expect(xml).toContain('dimensions="(0.5,1e-16)"');
            expect(xml).toContain('<line p1="(1,2.5e-16)" p2="(1,2e-16)"');
            expect(xml).toContain('<line p1="(1,3.5e-16)" p2="(1,4e-16)"');
        });

        it("draws nothing but the frame for a chart with no observations", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Nothing yet</shortDescription>
    </chart>
    `);

            // A chart being written rather than one that is wrong, so no
            // message either. One position, since a chart of bare values is one
            // series whatever it holds.
            expect(xml).not.toContain("<rectangle ");
            expect(xml).not.toContain("<line ");
            expect(xml).toContain("<axes ");
        });

        it("leaves out an observation that is not a finite number, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c">
      <series><label>A</label>1 2 3 4 5 6 x</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Left out of the summary rather than read as zero, which would
            // move all three quartiles: the box is the one six observations
            // give.
            expect(xml).toContain('lower-left="(0.75,2.25)"');
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0154");
        });
    });

    describe("the axis", async () => {
        it("is not anchored to zero", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Heights</shortDescription>
      <series><label>A</label>158 162 165 168 170 172 175 178 181</series>
    </chart>
    `);

            // A box plot's numbers are positions on a scale rather than lengths
            // measured from a baseline, so forcing zero in would push every box
            // into the top of the picture.
            expect(xml).toContain('bbox="(0,150,2,190)"');
        });

        it("honors the author's bounds and clips to them", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c" yMin="0" yMax="10">
      <shortDescription>Bounded</shortDescription>
      <series><label>A</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    `);

            expect(xml).toContain('bbox="(0,0,2,10)"');
            // The box is outside the frame and is cut off at it, and the
            // outlier's marker — which cannot be cut without cutting the
            // symbol — is left out entirely.
            expect(xml).toContain('cliptobbox="yes"');
            expect(xml).not.toContain("<point ");
        });

        it("reports the axis it was drawn with, and no horizontal one", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c"><series>1 2 3 4 5 6</series></chart>
    <p name="bounds">$c.xMin, $c.xMax, $c.yMin, $c.yMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // The positions on a box plot's horizontal axis are its series, so
            // there is no measured extent to report there; the vertical axis is
            // the data's and is reported. `NaN` is how a null number reads in
            // prose.
            expect(
                sv[await resolvePathToNodeIdx("bounds")].stateValues.text,
            ).eq("NaN, NaN, 0, 8");
        });
    });

    describe("categories", async () => {
        it("reports none, and says so when the author writes some", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c" categories="North South">
      <series><label>A</label>1 2 3</series>
    </chart>
    <p name="cats">$c.categories</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A box plot has no categories: each of its series is one position,
            // named by its own label. Reporting one category per observation
            // would name three positions on a chart that has one.
            expect(
                sv[await resolvePathToNodeIdx("c")].stateValues.categories,
            ).eqls([]);
            expect(sv[await resolvePathToNodeIdx("cats")].stateValues.text).eq(
                "",
            );

            // Reported rather than dropped in silence, because the names are
            // something the author wrote for a reader to see — the same reason
            // an `<xLabel>` on a pie is reported.
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0155");
        });

        it("says nothing where the author wrote none", async () => {
            const { warnings } = await getWarnings(`
    <chart type="box" name="c">
      <shortDescription>x</shortDescription>
      <series><label>A</label>1 2 3</series>
    </chart>
    `);

            expect(warnings.map((w) => w.code)).not.toContain("doenet-w0155");
        });

        it("does not name the boxes from them", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c" categories="North South">
      <shortDescription>x</shortDescription>
      <series><label>A</label>1 2 3</series>
      <series><label>B</label>4 5 6</series>
    </chart>
    `);

            expect(xml).toContain(">A</tick-mark>");
            expect(xml).not.toContain("North");
        });
    });

    describe("the legend", async () => {
        it("draws none, and costs nothing for one", async () => {
            const labeled = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>x</shortDescription>
      <series><label>morning</label>1 2 3</series>
      <series><label>afternoon</label>4 5 6</series>
    </chart>
    `);

            // The names are already under the boxes, so a legend would spend
            // width to repeat the axis.
            expect(labeled).not.toContain("<legend");
            expect(labeled).toContain('margins="[23,30,12,16]"');
        });

        it("reports that none is drawn, however it was asked for", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c" legend legendPosition="outsideRight">
      <series><label>morning</label>1 2 3</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(
                sv[await resolvePathToNodeIdx("c")].stateValues.showLegend,
            ).eq(false);
        });
    });

    describe("the annotation tree", async () => {
        it("announces the five-number summary on each box", async () => {
            const xml = await chartXML(ONE_BOX);

            // Words rather than five bare numbers: a bar is announced as its
            // category and its value because the position says which number it
            // is, and five numbers at one position have nothing but their
            // naming to tell them apart.
            expect(xml).toContain(
                '<annotation ref="box-1" text="A: minimum 1, first quartile 2.25, median 3.5, third quartile 4.75, maximum 6" />',
            );
        });

        it("names an outlier rather than announcing a bare number", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>x</shortDescription>
      <series><label>A</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    `);

            expect(xml).toContain(
                '<annotation ref="outlier-1-1" text="A: outlier 96" />',
            );
        });

        it("hangs one series' annotations straight under the figure", async () => {
            const xml = await chartXML(ONE_BOX);

            expect(xml).toContain(
                '<annotation ref="figure" text="Six observations"><annotation ref="box-1"',
            );
            expect(xml).not.toContain("<group ");
        });

        it("wraps several series in a level of their own", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Two groups</shortDescription>
      <series><label>morning</label>1 2 3</series>
      <series><label>afternoon</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>
    `);

            // The level a screen reader stops at between the chart and its
            // marks, named by the series — with the box and anything drawn
            // beyond its whiskers under it.
            expect(xml).toContain('<group at="series-1">');
            expect(xml).toContain(
                '<annotation ref="series-2" text="afternoon"><annotation ref="box-2"',
            );
            expect(xml).toContain('/><annotation ref="outlier-2-1"');
        });

        it("uses the localized fallback name for an unlabeled series", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>Two groups</shortDescription>
      <series>1 2 3</series>
      <series>4 5 6</series>
    </chart>
    `);

            expect(xml).toContain('<annotation ref="series-1" text="series 1"');
        });

        it("writes the numbers the way the picture writes them", async () => {
            const xml = await chartXML(`
    <chart type="box" name="c">
      <shortDescription>x</shortDescription>
      <series><label>A</label>0.1 0.2 0.3 0.4</series>
    </chart>
    `);

            // Interpolating a quartile leaves floating-point dust —
            // `0.17500000000000002` — which would be written into the picture
            // and read out by a screen reader alike. Snapped, so that what a
            // reader hears and what a reader sees are one rounding of one
            // value.
            expect(xml).toContain("first quartile 0.175");
            expect(xml).toContain("third quartile 0.325");
            expect(xml).toContain('lower-left="(0.75,0.175)"');
            expect(xml).not.toContain("0.17500000000000002");
        });
    });

    describe("the summary a series reports", async () => {
        it("agrees with <summaryStatistics> on the same data", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c"><series name="s">1 2 3 4 5 6</series></chart>
    <summaryStatistics name="ss" statisticsToDisplay="fiveNumberSummary">
      1 2 3 4 5 6
    </summaryStatistics>
    <p name="fromSeries">$s.minimum, $s.quartile1, $s.median, $s.quartile3, $s.maximum</p>
    <p name="fromStats">$ss.minimum, $ss.quartile1, $ss.median, $ss.quartile3, $ss.maximum</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Interpolated percentiles, not Tukey's hinges, which would give 2
            // and 5 on this sample size. One shared definition is what keeps a
            // table of quartiles and a box plot of the same column from
            // disagreeing on the page.
            expect(
                sv[await resolvePathToNodeIdx("fromSeries")].stateValues.text,
            ).eq("1, 2.25, 3.5, 4.75, 6");
            expect(
                sv[await resolvePathToNodeIdx("fromStats")].stateValues.text,
            ).eq(sv[await resolvePathToNodeIdx("fromSeries")].stateValues.text);
        });

        it("reports nothing for a series with no finite values", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="box" name="c"><series name="s"></series></chart>
    <p name="summary">$s.minimum, $s.median, $s.maximum</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // There is no smallest value in no values, and reporting 0 would be
            // a number the data does not contain. `NaN` is how a null number
            // reads in prose.
            expect(
                sv[await resolvePathToNodeIdx("summary")].stateValues.text,
            ).eq("NaN, NaN, NaN");
        });

        it("summarizes a series whatever the chart drew it as", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c"><series name="s">1 2 3 4 5 6</series></chart>
    <p name="median">$s.median</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // A column does not stop having a median because it was drawn as
            // bars. What the chart decides is which of these get a mark, not
            // which of them exist.
            expect(
                sv[await resolvePathToNodeIdx("median")].stateValues.text,
            ).eq("3.5");
        });
    });
});
