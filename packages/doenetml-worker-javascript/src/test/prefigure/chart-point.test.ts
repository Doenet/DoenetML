import { describe, expect, it, vi } from "vitest";
import { getWarnings } from "./graph-prefigure.helpers";
import { chartXML } from "./chart.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("chart line and scatter prefigure tests @group4", async () => {
    describe("line and scatter", async () => {
        it("draws a scatter plot on two numeric axes", async () => {
            const xml = await chartXML(`
    <chart type="scatter" name="c">
      <shortDescription>Height against weight</shortDescription>
      <series x="1 2 3">4 9 2</series>
    </chart>
    `);

            // A numeric horizontal axis is labeled by `hlabels`, the exact
            // counterpart of the `vlabels` the vertical one already used, where
            // a categorical axis gets tick marks and no `hlabels` at all.
            expect(xml).toContain('hlabels="(0,1,4)"');
            expect(xml).not.toContain("<tick-mark ");

            expect((xml.match(/<point /g) ?? []).length).eq(3);
            expect(xml).toContain('<point at="point-1-1" p="(1,4)"');
            // *Not* clipped. A marker is a symbol standing for a location, not
            // a shape a bound truncates, so clipping it cuts the symbol rather
            // than the datum: a point at `(2,19.6)` under a `yMax` of 20 came
            // back with the top five pixels of its circle sliced off flat. The
            // box is applied to the point instead, below.
            expect(xml).not.toContain(
                '<point at="point-1-1" p="(1,4)" cliptobbox',
            );

            // Both coordinates are what a reader needs from a measured
            // position, where a category name is the whole of a bar's.
            expect(xml).toContain('<annotation ref="point-1-1" text="1, 4" />');
        });

        it("draws a marker whole, and only where there is one to draw", async () => {
            // The reference page's own line chart is the case that showed it:
            // 19.6 under a `yMax` of 20 is four tenths of a unit from the top,
            // and the marker reaches five pixels past its datum, so the circle
            // was drawn with a flat top against the frame.
            const nearEdge = await chartXML(`
    <chart type="line" name="c" size="small">
      <series x="0 0.5 1 1.5 2">0 1.2 4.9 11 19.6</series>
    </chart>
    `);
            expect(nearEdge).toContain('p="(2,19.6)"');
            expect(nearEdge).not.toMatch(/<point[^>]*cliptobbox/);
            // The line still is clipped: a path really should stop at the frame.
            expect(nearEdge).toMatch(/<polygon[^>]*cliptobbox="yes"/);

            // A point outside an authored box is not drawn at all, which is
            // what `cliptobbox` used to achieve — and now its label and its
            // annotation go with it, rather than being left pointing at an
            // element that paints nothing.
            const outside = await chartXML(`
    <chart type="scatter" name="c" yMax="5" displayValues>
      <series x="1 2 3">4 99 2</series>
    </chart>
    `);
            expect((outside.match(/<point /g) ?? []).length).eq(2);
            expect(outside).not.toContain('p="(2,99)"');
            expect(outside).not.toContain(">99<");
            expect(outside).not.toContain('text="2, 99"');
            expect(outside).toContain(
                '<annotation ref="point-1-1" text="1, 4" />',
            );
        });

        it("does not force zero onto the axes of a scatter", async () => {
            const xml = await chartXML(`
    <chart type="scatter" name="c"><series x="100 101 102">50 52 51</series></chart>
    `);

            // A point is not a length measured from a baseline, so there is
            // nothing for the axis to be measured from. Forcing zero in would
            // push every point into a corner of the picture.
            const bbox = xml.match(/bbox="\(([^)]*)\)"/)?.[1].split(",");
            expect(Number(bbox?.[0])).toBeGreaterThan(90);
            expect(Number(bbox?.[1])).toBeGreaterThan(40);
        });

        it("draws a line through the points in the order given", async () => {
            const xml = await chartXML(`
    <chart type="line" name="c"><series x="3 1 2">4 9 2</series></chart>
    `);

            // Not sorted by x: a path through time is a real chart, and
            // reordering it would quietly draw something else.
            expect(xml).toContain('points="[(3,4),(1,9),(2,2)]"');
            expect(xml).toContain('closed="no"');
            // A polyline is a stroke, so it carries no fill: a fill on an open
            // path is painted across the region it would enclose if closed.
            const polygon = xml.match(/<polygon [^>]*\/>/)?.[0] ?? "";
            expect(polygon).not.toContain("fill=");
            expect(polygon).toContain("stroke=");
        });

        it("puts a line without x under the categories, and one with x on a numeric axis", async () => {
            const categorical = await chartXML(`
    <chart type="line" name="c" categories="A B C">4 9 2</chart>
    `);
            const numeric = await chartXML(`
    <chart type="line" name="c"><series x="1 2 3">4 9 2</series></chart>
    `);

            // The one type that reads both kinds of axis, which is what makes
            // it usable for a time series and for a category-by-category
            // comparison without being two components.
            expect(categorical).toContain(">A</tick-mark>");
            expect(categorical).not.toContain("hlabels=");
            expect(categorical).toContain(
                '<annotation ref="point-1-1" text="A: 4" />',
            );
            // Same box a bar chart of the same categories gets.
            expect(categorical).toContain('bbox="(0,0,4,10)"');

            expect(numeric).toContain("hlabels=");
            expect(numeric).not.toContain("<tick-mark ");
        });

        it("draws markers by default and annotates the line without them", async () => {
            const withMarkers = await chartXML(`
    <chart type="line" name="c"><series x="1 2 3">4 9 2</series></chart>
    `);
            const withoutMarkers = await chartXML(`
    <chart type="line" name="c" markers="false"><series x="1 2 3"><label>a</label>4 9 2</series></chart>
    `);

            expect((withMarkers.match(/<point /g) ?? []).length).eq(3);
            expect(withoutMarkers).not.toContain("<point ");

            // A marker is an element, and an element is what an annotation can
            // point at — so with them off the line carries the series' whole
            // annotation and the chart can be reached but not walked.
            expect(withoutMarkers).toContain(
                '<annotation ref="line-1" text="a" />',
            );
            // Named by the series, never by a count: a generated number of
            // points would be English no catalog could translate.
            expect(withoutMarkers).not.toContain('points"');
        });

        it("keys a line chart's legend off the line, not a marker", async () => {
            const xml = await chartXML(`
    <chart type="line" name="c">
      <series x="1 2"><label>first</label>4 9</series>
      <series x="1 2"><label>second</label>6 1</series>
    </chart>
    `);

            // PreFigure draws a line swatch for a key with no fill and a box
            // for one with, so pointing at the polyline is what puts a line in
            // a line chart's legend.
            expect(xml).toContain(
                '<item ref="line-1" color="currentColor">first</item>',
            );
            expect(xml).toContain(
                '<item ref="line-2" color="currentColor">second</item>',
            );
            expect(xml).toContain('<group at="series-1">');
        });

        it("drops a coordinate with no value beside it, and warns", async () => {
            // The mirror of the case below, and the one the geometry could not
            // see: it walks the values, so a surplus coordinate was never
            // visited. `<series x="1 2 3">4 9</series>` dropped its third
            // coordinate in silence while the opposite mismatch said so, which
            // made the warning depend on which list happened to be longer.
            const surplus = await getWarnings(`
    <chart type="scatter" name="c"><series x="1 2 3">4 9</series></chart>
    `);
            expect(surplus.warnings.length).eq(1);
            expect(surplus.warnings[0].message).contain(
                "coordinates with no value",
            );

            // Two coordinates and two values is not a mismatch, however many
            // of either the other series has.
            const matched = await getWarnings(`
    <chart type="scatter" name="c"><series x="1 2 3">4 9 2</series></chart>
    `);
            expect(matched.warnings.length).eq(0);

            // And a bar chart ignores `x` entirely, so a surplus one there is
            // not a mismatch to report.
            const onABar = await getWarnings(`
    <chart type="bar" name="c" categories="A B"><series x="1 2 3">4 9</series></chart>
    `);
            expect(onABar.warnings.length).eq(0);
        });

        it("drops a value with no x beside it, and warns", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="scatter" name="c"><series x="1 2">4 9 2</series></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A point needs both coordinates, so the third value has nowhere to
            // go — indistinguishable by looking from having asked for two.
            expect((xml.match(/<point /g) ?? []).length).eq(2);

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toContain("doenet-w0148");
        });

        it("puts a scatter with no x anywhere under the categories", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="scatter" name="c" categories="A B C">4 9 2</chart>
    <p name="bounds">$c.xMin, $c.xMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // "A value with no `x` beside it is not drawn" holds only where
            // there is a numeric axis to be off. With no `x` anywhere there is
            // none, so the points take the slots a bar chart's bars would, and
            // the chart is a dot plot rather than an empty picture.
            expect((xml.match(/<point /g) ?? []).length).eq(3);
            expect(xml).toContain('<point at="point-1-1" p="(1,4)"');
            expect(xml).toContain(
                '<tick-mark axis="horizontal" location="1" color="currentColor">A</tick-mark>',
            );
            expect(xml).not.toContain("hlabels=");
            // Named by its category, as a bar is, rather than by a coordinate
            // pair on an axis that carries no measurement.
            expect(xml).toContain('<annotation ref="point-1-1" text="A: 4" />');

            // Nothing was undrawable, so nothing is reported.
            expect(getDiagnosticsByType(core).warnings).toEqual([]);
            // And there is no measured horizontal extent to report.
            expect(
                sv[await resolvePathToNodeIdx("bounds")].stateValues.text,
            ).eq("NaN, NaN");
        });

        it("prints the values of a line whose markers are off", async () => {
            const xml = await chartXML(`
    <chart type="line" name="c" displayValues markers="false">
      <series x="1 2 3">4 9 2</series>
    </chart>
    `);

            // A value label is anchored to the coordinates rather than to a
            // marker, so turning the markers off does not take the numbers with
            // them: an author who wrote both asked for a line with its values
            // printed along it.
            expect(xml).not.toContain("<point ");
            expect(
                xml.match(/<label anchor="\([\d.,]+\)" alignment="north"/g)
                    ?.length,
            ).eq(3);
            expect(xml).toContain('<label anchor="(2,9)" alignment="north"');
        });

        it("reports the horizontal axis only when it is numeric", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="scatter" name="num"><series x="1 2 3">4 9 2</series></chart>
    <p name="numBounds">$num.xMin, $num.xMax</p>
    <chart type="line" name="cat" categories="A B C">4 9 2</chart>
    <p name="catBounds">$cat.xMin, $cat.xMax</p>
    <chart type="bar" name="bar" categories="A B C">4 9 2</chart>
    <p name="barBounds">$bar.xMin, $bar.xMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(
                sv[await resolvePathToNodeIdx("numBounds")].stateValues.text,
            ).eq("0, 4");
            // Positions on a categorical axis are 1, 2, 3 whatever the
            // categories say, so there is no measured extent to report.
            expect(
                sv[await resolvePathToNodeIdx("catBounds")].stateValues.text,
            ).eq("NaN, NaN");
            expect(
                sv[await resolvePathToNodeIdx("barBounds")].stateValues.text,
            ).eq("NaN, NaN");
        });

        it("honors xMin and xMax, and ignores a pair that describes no box", async () => {
            const capped = await chartXML(`
    <chart type="scatter" name="c" xMin="-5" xMax="15"><series x="1 2 3">4 9 2</series></chart>
    `);
            expect(capped).toContain('bbox="(-5,0,15,10)"');

            const backwards = await chartXML(`
    <chart type="scatter" name="c" xMin="15" xMax="-5"><series x="1 2 3">4 9 2</series></chart>
    `);
            // A box of zero or negative width has no drawing in it to be worth
            // honoring the author's request over.
            expect(backwards).toContain('bbox="(0,0,4,10)"');
        });

        it("gives a run of identical values a box the values can be seen in", async () => {
            // The axis is one step either side of them, and the step has to be
            // one the value can be moved by: `1e20 - 1` is `1e20` again, so a
            // step of 1 left the box with no height at all — which PreFigure
            // resolves to `nan` in every coordinate it draws, for a picture with
            // nothing in it. A bar chart never reaches this, since its axis runs
            // from the baseline to the data and so always has a span.
            const boundsOf = async (doenetML: string) =>
                (await chartXML(doenetML))
                    .match(/bbox="\(([^)]*)\)"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];

            const [, yMin, , yMax] = await boundsOf(`
    <chart type="scatter" name="c"><series x="1 2">1e20 1e20</series></chart>
    `);
            expect(yMin).toBeLessThan(1e20);
            expect(yMax).toBeGreaterThan(1e20);

            const [xMin, , xMax] = await boundsOf(`
    <chart type="scatter" name="c"><series x="1e20 1e20">4 9</series></chart>
    `);
            expect(xMin).toBeLessThan(1e20);
            expect(xMax).toBeGreaterThan(1e20);

            // At the top of the double range only the near bound can move —
            // adding a step overflows, and `formatNumber` writes `Infinity` as
            // a literal `null`. The data then sits on the frame, which is far
            // less than a box that cannot be drawn at all.
            const [, atMin, , atMax] = await boundsOf(`
    <chart type="scatter" name="c"><series x="1 2">1.7976931348623157e308 1.7976931348623157e308</series></chart>
    `);
            expect(atMin).toBeLessThan(atMax);
            expect(Number.isFinite(atMin) && Number.isFinite(atMax)).eq(true);

            // A step the value can be moved by is left exactly as it was.
            expect(
                await chartXML(`
    <chart type="scatter" name="c"><series x="1 2">7 7</series></chart>
    `),
            ).toContain('bbox="(0,6,3,8)"');
        });

        it("draws nothing for a series with no x on a numeric axis, and warns", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="line" name="c">
      <series x="1 2 3"><label>measured</label>4 9 2</series>
      <series><label>positioned</label>5 6 7</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // One series carrying an `x` settles the axis for all of them, so
            // the second series' values have no coordinate to be placed at.
            // Drawing them at 1, 2, 3 would place them by position on an axis
            // measured in something else, which is a claim the author did not
            // make.
            expect(xml).toContain('<group at="series-2"></group>');
            expect((xml.match(/<point /g) ?? []).length).eq(3);
            // And so it earns no legend entry: there is no mark for the swatch
            // to be read off.
            expect(xml).toContain('<item ref="line-1"');
            expect(xml).not.toContain("positioned</item>");

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toContain("doenet-w0148");
        });

        it("reserves the margin the axis labels are actually drawn in", async () => {
            // PreFigure moves an axis to the frame *past* the data when the
            // data lies entirely at or below zero: the horizontal axis and its
            // labels go to the top of the box, and the vertical axis and its
            // numbers to the right. Reserving the near margin for them left the
            // labels drawn into a margin sized for nothing — measured against
            // the build service, a scatter of negative `x` had every number on
            // its vertical axis outside the picture, and one of negative values
            // had the numbers on its horizontal axis cut in half by the top
            // edge. A bar chart reaches neither on its own, which is why this is
            // new with the types that are free of zero on both axes.
            //
            // `margins` is written left, bottom, right, top.
            const marginsOf = async (doenetML: string) =>
                (await chartXML(doenetML))
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];

            const [, upBottom, , upTop] = await marginsOf(`
    <chart type="line" name="c" categories="A B C">4 9 2</chart>
    `);
            const [, downBottom, , downTop] = await marginsOf(`
    <chart type="line" name="c" categories="A B C">-4 -9 -2</chart>`);

            // The band the category names occupy changes sides with them,
            // rather than being reserved twice or reserved below names drawn
            // above.
            expect(downTop).eq(upBottom);
            expect(downBottom).eq(upTop);

            const [rightLeft, , rightRight] = await marginsOf(`
    <chart type="scatter" name="c"><series x="1 2 3">4 9 2</series></chart>
    `);
            const [leftLeft, , leftRight] = await marginsOf(`
    <chart type="scatter" name="c"><series x="-1 -2 -3">4 9 2</series></chart>
    `);

            // Same numbers on the vertical axis either way, so the band is the
            // same width; only the side it is reserved on changes.
            expect(leftRight).eq(rightLeft);
            expect(leftLeft).toBeLessThan(rightLeft);

            // And a chart whose data straddles zero is left exactly as it was:
            // PreFigure draws that axis through the middle of the plot, where
            // no margin holds it. Measured against the same chart with its
            // markers off, so the comparison is about the axis' position and
            // not about the room a marker needs — which every side of a
            // marked chart reserves, since a marker sits on the box rather
            // than inside it.
            const straddling = await marginsOf(`
    <chart type="scatter" name="c"><series x="-1 2 3">-4 9 -2</series></chart>
    `);
            const straddlingUnmarked = await marginsOf(`
    <chart type="line" name="c" markers="false"><series x="-1 2 3">-4 9 -2</series></chart>
    `);
            expect(straddlingUnmarked).toEqual([32, 30, 12, 16]);
            // Left is set by the width of the vertical axis' numbers, which
            // already exceeds what a marker needs; the other three grow by it.
            expect(straddling).toEqual([32, 30 + 7, 12 + 7, 16 + 7]);
        });

        it("raises a title clear of horizontal axis labels sharing the top margin", async () => {
            const xml = await chartXML(`
    <chart type="scatter" name="c"><title>Losses</title><series x="1 2 3">-4 -9 -2</series></chart>
    `);

            // Both the title and the horizontal axis' numbers are anchored to
            // the top of the box and drawn upwards from it, so a title left at
            // `yMax` would be drawn over them.
            const [, , , yMax] = xml
                .match(/bbox="\(([^)]*)\)"/)![1]
                .split(",")
                .map(Number);
            const titleY = Number(
                xml.match(
                    /<label anchor="\([^,]*,([^)]*)\)" alignment="north" scale=/,
                )?.[1],
            );
            expect(titleY).toBeGreaterThan(yMax);

            // A chart drawn above zero keeps its title on the frame, where
            // nothing else is.
            const upward = await chartXML(`
    <chart type="scatter" name="c"><title>Gains</title><series x="1 2 3">4 9 2</series></chart>
    `);
            expect(upward).toContain(
                '<label anchor="(2,10)" alignment="north"',
            );
        });

        it("draws an axis' name inside the plot whichever side its axis is on", async () => {
            // PreFigure anchors `<xlabel>` at the right end of the horizontal
            // axis and `<ylabel>` at the top of the vertical one, and the
            // alignment says which way each is drawn from there. `nw` and `se`
            // draw them into the plot only while the axes are against the near
            // frames; against the far ones they draw into the margin the axis'
            // numbers occupy. Measured against the build service, a `<yLabel>`
            // of "weight in kilograms" on a chart left of zero was drawn 78px
            // past the right edge of a 425px picture, and an `<xLabel>` on one
            // below zero landed on top of the numbers on its own axis.
            const upward = await chartXML(`
    <chart type="scatter" name="c"><xLabel>height</xLabel><yLabel>weight</yLabel><series x="1 2 3">4 9 2</series></chart>
    `);
            expect(upward).toContain('<xlabel alignment="nw"');
            expect(upward).toContain('<ylabel alignment="se"');

            const below = await chartXML(`
    <chart type="scatter" name="c"><xLabel>height</xLabel><yLabel>weight</yLabel><series x="1 2 3">-4 -9 -2</series></chart>
    `);
            expect(below).toContain('<xlabel alignment="sw"');
            expect(below).toContain('<ylabel alignment="se"');

            const left = await chartXML(`
    <chart type="scatter" name="c"><xLabel>height</xLabel><yLabel>weight</yLabel><series x="-1 -2 -3">4 9 2</series></chart>
    `);
            expect(left).toContain('<xlabel alignment="nw"');
            expect(left).toContain('<ylabel alignment="sw"');
        });

        it("drops the vertical axis' name a line where both names share a corner", async () => {
            // The right end of the horizontal axis and the top of the vertical
            // one are the same point once both have moved to the far frames, so
            // two names drawn the same way from it would be drawn over each
            // other.
            const both = await chartXML(`
    <chart type="scatter" name="c"><xLabel>height</xLabel><yLabel>weight</yLabel><series x="-1 -2 -3">-4 -9 -2</series></chart>
    `);
            expect(both).toContain('<xlabel alignment="sw"');
            expect(both).toContain('<ylabel alignment="sw" offset="(0,-18)"');

            // Nothing to make room for when the chart has no `<xLabel>`.
            const alone = await chartXML(`
    <chart type="scatter" name="c"><yLabel>weight</yLabel><series x="-1 -2 -3">-4 -9 -2</series></chart>
    `);
            expect(alone).toContain('<ylabel alignment="sw" color');
        });
    });
});
