import { describe, expect, it, vi } from "vitest";
import { getWarnings } from "./graph-prefigure.helpers";
import { chartXML } from "./chart.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("chart pie prefigure tests @group4", async () => {
    describe("pie", async () => {
        const FOUR_SLICES = `
    <chart type="pie" name="c" categories="North South East West">
      <shortDescription>Population by region</shortDescription>
      41 63 18 78
    </chart>
    `;

        it("partitions the turn in proportion, clockwise from twelve", async () => {
            const xml = await chartXML(FOUR_SLICES);

            // 41 + 63 + 18 + 78 is 200, so the shares are 73.8, 113.4, 32.4
            // and 140.4 degrees. PreFigure measures counterclockwise from three
            // o'clock, so twelve o'clock is 90 and clockwise is downward: each
            // arc's range ends where the next one begins, and the last ends at
            // -270, a full turn from the first's start.
            expect(xml).toContain('<arc at="slice-1" center="(0,0)"');
            expect(xml).toContain('range="(90,16.2)"');
            expect(xml).toContain('range="(16.2,-97.2)"');
            expect(xml).toContain('range="(-97.2,-129.6)"');
            expect(xml).toContain('range="(-129.6,-270)"');

            expect((xml.match(/<arc /g) ?? []).length).eq(4);
            // A wedge rather than a curve: `sector` closes the arc back to the
            // center, which is what makes it a shape with a fill.
            expect((xml.match(/sector="yes"/g) ?? []).length).eq(4);
        });

        it("draws no axes at all", async () => {
            const xml = await chartXML(FOUR_SLICES);

            // The one type with nothing to measure along: no `<axes>`, so no
            // `vlabels`, no `hlabels` and no tick marks either.
            expect(xml).not.toContain("<axes");
            expect(xml).not.toContain("vlabels");
            expect(xml).not.toContain("hlabels");
            expect(xml).not.toContain("<tick-mark ");
        });

        it("reports no axis, since it has none", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="c" categories="A B">4 9</chart>
    <p name="bounds">$c.xMin, $c.xMax, $c.yMin, $c.yMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Not zero, and not the extent of the box the arcs happen to be
            // drawn in: a pie has no axes, so there is no value on one to
            // report. `NaN` is how a null number reads in prose.
            expect(
                sv[await resolvePathToNodeIdx("bounds")].stateValues.text,
            ).eq("NaN, NaN, NaN, NaN");

            // The values are still the values.
            expect(sv[await resolvePathToNodeIdx("c")].stateValues.values).eqls(
                [4, 9],
            );
        });

        it("comes out round whatever the chart's shape", async () => {
            // PreFigure scales an arc's radius by each axis separately, so a
            // box whose units are not the same width and height either way
            // would draw an ellipse. The box is chosen from the drawing area
            // instead: two units across the shorter side, proportionally more
            // along the longer, and the radius is one.
            const wide = await chartXML(`
    <chart type="pie" name="c" aspectRatio="4" legend="false">1 1</chart>
    `);
            const tall = await chartXML(`
    <chart type="pie" name="c" aspectRatio="0.5" legend="false">1 1</chart>
    `);

            const boxOf = (xml: string) =>
                xml
                    .match(/bbox="\(([^)]*)\)"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];
            const sizeOf = (xml: string) =>
                xml
                    .match(/dimensions="\(([^)]*)\)"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];

            for (const xml of [wide, tall]) {
                const [xMin, yMin, xMax, yMax] = boxOf(xml);
                const [width, height] = sizeOf(xml);
                // One unit is the same number of pixels on both axes, which is
                // the whole of what makes the pie a circle.
                expect((xMax - xMin) / width).closeTo(
                    (yMax - yMin) / height,
                    1e-9,
                );
                // Centered on the origin, so the radius of one reaches the
                // shorter side exactly.
                expect(xMin).eq(-xMax);
                expect(yMin).eq(-yMax);
                expect(Math.min(xMax, yMax)).eq(1);
            }

            // Every pie is drawn at the same radius; the box is what changes.
            expect(wide).toContain('radius="1"');
            expect(tall).toContain('radius="1"');
        });

        it("names the slices in the legend, and around the rim without one", async () => {
            const withLegend = await chartXML(FOUR_SLICES);

            // A pie is the one chart whose legend names its slices rather than
            // its series, because the slices are what its colors distinguish.
            expect(withLegend).toContain('<item ref="slice-1"');
            expect(withLegend).toContain(">North</item>");
            expect(withLegend).toContain(">West</item>");
            expect((withLegend.match(/<item /g) ?? []).length).eq(4);
            // Not in both places: the legend has them, so the rim does not.
            expect(withLegend).not.toContain("<label ");

            const withoutLegend = await chartXML(`
    <chart type="pie" name="c" categories="North South East West" legend="false">
      41 63 18 78
    </chart>
    `);

            expect(withoutLegend).not.toContain("<legend ");
            expect((withoutLegend.match(/<label /g) ?? []).length).eq(4);
            // Beyond the rim at the middle of the slice, aligned away from the
            // center so the name is drawn outside the arc rather than over it.
            expect(withoutLegend).toContain(">North</label>");
            expect(withoutLegend).toMatch(
                /alignment="(east|northeast)"[^>]*>North</,
            );
        });

        it("aligns each rim name away from the center, and reserves the margin it is drawn into", async () => {
            const marginsOf = (xml: string) =>
                xml
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];
            const alignmentsOf = (xml: string) =>
                [...xml.matchAll(/<label [^>]*alignment="([a-z]+)"/g)].map(
                    (match) => match[1],
                );

            // Eight equal slices put a name in every direction there is, so one
            // chart pins the whole compass at once. The middle of the first
            // slice is one octant clockwise from twelve, and each after it one
            // octant further.
            const eight = await chartXML(`
    <chart type="pie" name="c" legend="false" categories="Coal Coal Coal Coal Coal Coal Coal Coal">1 1 1 1 1 1 1 1</chart>
    `);
            expect(alignmentsOf(eight)).eqls([
                "north",
                "northeast",
                "east",
                "southeast",
                "south",
                "southwest",
                "west",
                "northwest",
            ]);

            // A name drawn away from the center is drawn entirely to one side
            // of its anchor, so the margin on that side has to hold it. The
            // same name on both sides here, so the two bands come out equal.
            const [left, bottom, right, top] = marginsOf(eight);
            expect(left).eq(right);
            expect(bottom).eq(top);

            // A wider name reserves more, which is what makes this the width
            // rather than a constant.
            const wider = await chartXML(`
    <chart type="pie" name="c" legend="false" categories="Renewables Renewables Renewables Renewables Renewables Renewables Renewables Renewables">1 1 1 1 1 1 1 1</chart>
    `);
            const [widerLeft, , widerRight] = marginsOf(wider);
            expect(widerLeft).toBeGreaterThan(left);
            expect(widerRight).toBeGreaterThan(right);

            // Two equal slices are named due east and due west, each centered
            // on the other axis at the middle of the pie — so they reach into
            // neither cap, and the top and bottom margins hold nothing but the
            // room every pie keeps outside its stroke.
            const twoAcross = await chartXML(`
    <chart type="pie" name="c" legend="false" categories="Coal Coal">1 1</chart>
    `);
            expect(alignmentsOf(twoAcross)).eqls(["east", "west"]);
            const [acrossLeft, acrossBottom, acrossRight, acrossTop] =
                marginsOf(twoAcross);
            expect(acrossLeft).eq(left);
            expect(acrossRight).eq(right);
            expect(acrossTop).toBeLessThan(top);
            expect(acrossBottom).toBeLessThan(bottom);

            // And nothing is reserved for names that are in the legend, or for
            // names there are none of.
            const inLegend = await chartXML(`
    <chart type="pie" name="c" categories="Coal Coal">1 1</chart>
    `);
            expect(marginsOf(inLegend)[0]).eq(acrossTop);
            const unnamed = await chartXML(`
    <chart type="pie" name="c" legend="false" categories="$blank $blank">1 1</chart>
    <text name="blank"></text>
    `);
            expect(marginsOf(unnamed)).eqls([
                acrossTop,
                acrossTop,
                acrossTop,
                acrossTop,
            ]);
        });

        it("spends a margin on a legend outside the pie and none on one inside it", async () => {
            const marginsOf = (xml: string) =>
                xml
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];

            const twoSlices = `categories="Coal Gas">1 1</chart>`;
            const [, , onRight] = marginsOf(
                await chartXML(
                    `<chart type="pie" name="c" ${twoSlices}
    `,
                ),
            );
            const [, below, , above] = marginsOf(
                await chartXML(
                    `<chart type="pie" name="c" legendPosition="outsideBottom" ${twoSlices}
    `,
                ),
            );
            const inCorner = marginsOf(
                await chartXML(
                    `<chart type="pie" name="c" legendPosition="upperRight" ${twoSlices}
    `,
                ),
            );

            // The default puts the box in the right margin and the box's width
            // is what that margin has to be; `outsideBottom` spends height
            // instead. A corner of the plot costs neither.
            expect(onRight).toBeGreaterThan(inCorner[2]);
            expect(below).toBeGreaterThan(above);
            expect(inCorner).eqls([
                inCorner[3],
                inCorner[3],
                inCorner[3],
                inCorner[3],
            ]);
        });

        it("reports the legend it drew", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="named" categories="A B">1 1</chart>
    <chart type="pie" name="suppressed" categories="A B" legend="false">1 1</chart>
    <chart type="pie" name="empty">0 0</chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const showLegend = async (name: string) =>
                sv[await resolvePathToNodeIdx(name)].stateValues.showLegend;

            expect(await showLegend("named")).eq(true);
            expect(await showLegend("suppressed")).eq(false);
            // Nothing was drawn, so there is no slice for a key to be read off
            // and no legend — whatever the categories say.
            expect(await showLegend("empty")).eq(false);
        });

        it("colors within the series, one style per slice", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">1 1 1</chart>
    `);

            const fills = [...xml.matchAll(/<arc [^>]*fill="([^"]*)"/g)].map(
                (match) => match[1],
            );
            expect(fills.length).eq(3);
            // The one place a chart takes a color per mark rather than per
            // group: a pie of one series still needs its slices told apart.
            expect(new Set(fills).size).eq(3);

            // And the run starts at the chart's own style number, so the first
            // slice of a pie is the color a single-series bar chart's bars are.
            const bar = await chartXML(`
    <chart type="bar" name="c" categories="A">1</chart>
    `);
            expect(bar).toContain(`fill="${fills[0]}"`);
        });

        it("starts the run of colors at the chart's own style number", async () => {
            const shifted = await chartXML(`
    <chart type="pie" name="c" styleNumber="2" categories="A B" legend="false">1 1</chart>
    `);
            const plain = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1 1</chart>
    `);

            const fillsOf = (xml: string) =>
                [...xml.matchAll(/<arc [^>]*fill="([^"]*)"/g)].map(
                    (match) => match[1],
                );

            // `styleNumber="2"` moves the whole run along by one, so the pie's
            // first slice is the color its second would have been.
            expect(fillsOf(shifted)[0]).eq(fillsOf(plain)[1]);
        });

        it("starts the run of colors at the drawn series' own style number", async () => {
            // The one reading `<series styleNumber>` has on a pie: the
            // attribute names one color and a pie needs a color per slice, so
            // what it can say is where the run begins.
            const named = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false"><series styleNumber="4">1 1</series></chart>
    `);
            const fromFour = await chartXML(`
    <chart type="pie" name="c" styleNumber="4" categories="A B" legend="false">1 1</chart>
    `);
            const fillsOf = (xml: string) =>
                [...xml.matchAll(/<arc [^>]*fill="([^"]*)"/g)].map(
                    (match) => match[1],
                );

            expect(fillsOf(named)).eqls(fillsOf(fromFour));

            // And a bar chart of that same markup draws its bars in style 4,
            // so the attribute means the same thing on both — a pie just
            // continues from there.
            const bar = await chartXML(`
    <chart type="bar" name="c" categories="A B"><series styleNumber="4">1 1</series></chart>
    `);
            expect(bar).toContain(`fill="${fillsOf(named)[0]}"`);

            // A series that names no style leaves the run where the chart's own
            // number puts it.
            const unnamed = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false"><series>1 1</series></chart>
    `);
            const bare = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1 1</chart>
    `);
            expect(fillsOf(unnamed)).eqls(fillsOf(bare));
        });

        it("prints each value beyond the rim, never over the slice", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B C D" displayValues>4 4 4 4</chart>
    `);

            // One label per slice, on the rim, aligned away from the center —
            // never painted over the fill. A number inside the slice would be
            // unreadable against a dark one: the fifth built-in style fills
            // black at seven tenths opacity, which composites to `#4d4d4d` and
            // leaves black text at 2.5:1 against it, and a patterned fill has
            // no single color to contrast with at all. Every other type keeps
            // its value off its marks for the same reason.
            expect((xml.match(/<label /g) ?? []).length).eq(4);
            expect(xml).not.toContain('alignment="center"');
            expect(xml).toContain(">4</label>");

            // Four equal slices, so their middles point at the four diagonals.
            for (const alignment of [
                "northeast",
                "southeast",
                "southwest",
                "northwest",
            ]) {
                expect(xml).toContain(`alignment="${alignment}"`);
            }

            // The legend is holding the names, so the rim carries the bare
            // numbers. With no legend it carries both, in one label each, so
            // the number reads as the named slice's own.
            const named = await chartXML(`
    <chart type="pie" name="c" categories="A B C D" legend="false" displayValues>4 4 4 4</chart>
    `);
            expect((named.match(/<label /g) ?? []).length).eq(4);
            expect(named).toContain(">A (4)</label>");
        });

        it("reserves the margin a value beyond the rim is drawn into, legend or no legend", async () => {
            // The value is beyond the rim whether or not the legend is holding
            // the names, so the margin has to hold it either way — a legend of
            // its own does nothing for a number drawn on the other side of the
            // pie.
            const marginsOf = (xml: string) =>
                xml
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number) ?? [];

            // Four equal slices point at the four diagonals, so the same value
            // is drawn into the left margin and the right one.
            const bare = marginsOf(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C D">1000 1000 1000 1000</chart>
    `),
            );
            const withValues = marginsOf(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C D" displayValues>1000 1000 1000 1000</chart>
    `),
            );
            const withWiderValues = marginsOf(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C D" displayValues>100000000 100000000 100000000 100000000</chart>
    `),
            );

            // The bare pie has nothing beyond the rim at all, so its left
            // margin is the room every pie keeps outside its stroke; the one
            // printing values has to hold a number there as well.
            expect(withValues[0]).toBeGreaterThan(bare[0]);
            // And what it holds is the number's own width, not a constant.
            expect(withWiderValues[0]).toBeGreaterThan(withValues[0]);
            // The diagonals reach into the caps as well as the sides.
            expect(withValues[3]).toBeGreaterThan(bare[3]);
        });

        it("starts an outside legend past the values drawn at the rim", async () => {
            // Both live in the right margin once `displayValues` puts numbers
            // at the rim, so the margin has to hold them one after the other
            // and the legend has to be anchored past them — the same thing
            // `assembleChartDiagram` does with the band its axis numbers take.
            // Reserving only the larger of the two put `1200000` under the
            // legend box on a six-slice pie, measured against a real render.
            const boxRight = (xml: string) =>
                Number(xml.match(/bbox="\([^,]*,[^,]*,([^,]*),/)?.[1]);
            const legendAnchor = (xml: string) =>
                Number(xml.match(/<legend anchor="\(([^,]*),/)?.[1]);

            const withValues = await chartXML(`
    <chart type="pie" name="c" displayValues categories="Alpha Bravo Charlie Delta Echo Foxtrot">1200000 900000 700000 500000 300000 100000</chart>
    `);
            expect(legendAnchor(withValues)).greaterThan(boxRight(withValues));

            // With nothing at the rim there is no band to clear, so the legend
            // sits against the box as it did before.
            const withoutValues = await chartXML(`
    <chart type="pie" name="c" categories="Alpha Bravo Charlie Delta Echo Foxtrot">1200000 900000 700000 500000 300000 100000</chart>
    `);
            expect(legendAnchor(withoutValues)).eq(boxRight(withoutValues));
        });

        it("annotates every slice by name and value", async () => {
            const xml = await chartXML(FOUR_SLICES);

            expect(xml).toContain(
                '<annotation ref="figure" text="Population by region">',
            );
            expect(xml).toContain(
                '<annotation ref="slice-1" text="North: 41" />',
            );
            expect(xml).toContain(
                '<annotation ref="slice-4" text="West: 78" />',
            );
            // One series, so no `<group>` level between the figure and the
            // slices — the same as any other chart of one series.
            expect(xml).not.toContain("<group ");
        });

        it("draws no slice for a value of zero, and keeps the colors after it", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">4 0 6</chart>
    `);

            // A sector of no sweep is a hundred identical points closed back to
            // the center, which PreFigure draws as a stroked radius nobody
            // asked for. So a zero draws nothing — and takes its style number
            // with it, so that the slice after it keeps the color it had.
            expect((xml.match(/<arc /g) ?? []).length).eq(2);
            expect(xml).toContain('<arc at="slice-1"');
            expect(xml).toContain('<arc at="slice-3"');
            expect(xml).not.toContain('<arc at="slice-2"');

            // The third slice keeps the third color, which is what "takes its
            // style number with it" means: the same three values with the zero
            // replaced draw the third slice in exactly the same fill.
            const withoutTheZero = await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">4 5 6</chart>
    `);
            const fillOf = (source: string, handle: string) =>
                source.match(
                    new RegExp(`<arc at="${handle}"[^>]*fill="([^"]*)"`),
                )?.[1];

            expect(fillOf(xml, "slice-3")).eq(
                fillOf(withoutTheZero, "slice-3"),
            );
            // And it is not the color the second slice would have taken, which
            // is what reclaiming the number would have given it.
            expect(fillOf(xml, "slice-3")).not.eq(
                fillOf(withoutTheZero, "slice-2"),
            );

            // Still a value of the chart, whether or not it has a slice.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<chart type="pie" name="c">4 0 6</chart>`,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("c")].stateValues.values).eqls(
                [4, 0, 6],
            );
        });

        it("gives no style number to a value that is not a share at all", async () => {
            // The other half of the rule above. A value of zero is a slice
            // whose share is nothing, so it holds its place in the run of
            // colors; a value that is not a share of anything is not a slice,
            // so the slice after it takes the number instead of the one after
            // that. Which is why replacing a zero with a negative moves the
            // colors and replacing it with another number does not.
            const fills = (source: string) =>
                [...source.matchAll(/<arc [^>]*fill="([^"]*)"/g)].map(
                    (match) => match[1],
                );

            const threeShares = fills(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">4 5 6</chart>
    `),
            );
            const withAZero = fills(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">4 0 6</chart>
    `),
            );
            const withANegative = fills(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">4 -1 6</chart>
    `),
            );
            const withANonNumber = fills(
                await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">
      <number>4</number><math>1/0</math><number>6</number>
    </chart>
    `),
            );

            expect(threeShares.length).eq(3);
            // Three colors that can be told apart, so the comparisons below
            // cannot pass by accident.
            expect(new Set(threeShares).size).eq(3);
            for (const two of [withAZero, withANegative, withANonNumber]) {
                expect(two.length).eq(2);
                expect(two[0]).eq(threeShares[0]);
            }

            // The zero's number goes unused, so the last slice keeps the third
            // color.
            expect(withAZero[1]).eq(threeShares[2]);
            // Neither of the others is a slice, so the last slice takes the
            // second color — the same color it would have if the middle value
            // had not been written at all.
            expect(withANegative[1]).eq(threeShares[1]);
            expect(withANonNumber[1]).eq(threeShares[1]);
        });

        it("leaves out a value that is not a finite number, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="c" categories="A B C" legend="false">
      <number>4</number><math>1/0</math><number>6</number>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Two slices of a total of ten, not three of a total that cannot be
            // computed: the value is out of the total as well as off the chart.
            expect((xml.match(/<arc /g) ?? []).length).eq(2);
            expect(xml).toContain('range="(90,-54)"');

            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0149");
        });

        it("leaves out a negative value, with a message of its own", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="c" categories="A B C" legend="false">4 -2 6</chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A slice is a share of a total and a pie has no baseline for a
            // negative value to hang from, so it is left out of both the
            // drawing and the total: 4 and 6 of 10, not of 8.
            expect((xml.match(/<arc /g) ?? []).length).eq(2);
            expect(xml).toContain('range="(90,-54)"');

            const codes = getDiagnosticsByType(core).warnings.map(
                (w) => w.code,
            );
            // Its own message rather than the undrawable-value one: the reason
            // differs in kind, and so does what an author would do about it.
            expect(codes).toContain("doenet-w0150");
            expect(codes).not.toContain("doenet-w0149");
        });

        it("draws nothing when the values total zero, and says why", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="c" categories="A B">0 0</chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A diagram rather than nothing at all: the type was named and the
            // values were read, so the chart is empty rather than absent — and
            // dividing by the total would have put `NaN` in every angle.
            expect(xml).not.eq(null);
            expect(xml).not.toContain("<arc ");

            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0151");
        });

        it("says nothing about a total for a pie with no values, or one whose values were all rejected", async () => {
            // Nothing was totaled in either case, so there is no total to
            // report on: the first is a chart being written, and the second has
            // already been told what went wrong.
            const empty = await getWarnings(`
    <chart type="pie" name="c"><shortDescription>x</shortDescription></chart>
    `);
            expect(empty.warnings.map((w) => w.code)).not.toContain(
                "doenet-w0151",
            );

            const allNegative = await getWarnings(`
    <chart type="pie" name="c"><shortDescription>x</shortDescription>-1 -2</chart>
    `);
            expect(allNegative.warnings.map((w) => w.code)).toContain(
                "doenet-w0150",
            );
            expect(allNegative.warnings.map((w) => w.code)).not.toContain(
                "doenet-w0151",
            );
        });

        it("draws the first of several series and says the rest were not", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="pie" name="c" categories="A B" legend="false">
      <series><label>2024</label>1 1</series>
      <series><label>2025</label>3 5</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;

            // Concentric rings are not a standard chart, so there is nowhere on
            // a pie for a second series to go.
            expect((chart.prefigureXML.match(/<arc /g) ?? []).length).eq(2);
            expect(chart.prefigureXML).toContain('range="(90,-90)"');
            // Still two series of data, whatever was drawn from them.
            expect(chart.numSeries).eq(2);
            expect(chart.values).eqls([1, 1, 3, 5]);

            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).toContain("doenet-w0152");
        });

        it("says nothing about series on a pie given one", async () => {
            const one = await getWarnings(`
    <chart type="pie" name="c"><shortDescription>x</shortDescription><series>1 2</series></chart>
    `);
            expect(one.warnings.map((w) => w.code)).not.toContain(
                "doenet-w0152",
            );
        });

        it("draws one value as the whole circle", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="Everything" legend="false">5</chart>
    `);

            // A full turn, which is one arc from twelve o'clock all the way
            // around rather than a special case.
            expect((xml.match(/<arc /g) ?? []).length).eq(1);
            expect(xml).toContain('range="(90,-270)"');
        });

        it("takes the shares the data has when the total overflows", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1e308 1e308</chart>
    `);

            // Two equal values are two half circles, whatever their size. The
            // shares are taken against the largest value rather than against
            // the sum, because the sum of these two is past the top of the
            // double range: divided by a saturated total they came out as a
            // 200-degree slice and a 160-degree one.
            const ranges = [...xml.matchAll(/range="\(([^)]*)\)"/g)].map(
                (match) => match[1].split(",").map(Number),
            );
            expect(ranges).eqls([
                [90, -90],
                [-90, -270],
            ]);

            // And a third equal value is a third of the circle, rather than
            // the nothing left over once a saturated total had been spent on
            // the first two.
            const three = await chartXML(`
    <chart type="pie" name="c" categories="A B C" legend="false">1e308 1e308 1e308</chart>
    `);
            expect((three.match(/<arc /g) ?? []).length).eq(3);
            expect(three).toContain('range="(90,-30)"');
            expect(three).toContain('range="(-30,-150)"');
            expect(three).toContain('range="(-150,-270)"');

            // The same at the very top of the range, where the total saturates
            // at the first addition rather than the second.
            const atTheCeiling = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1.7976931348623157e308 1.7976931348623157e308</chart>
    `);
            expect((atTheCeiling.match(/<arc /g) ?? []).length).eq(2);
            expect(atTheCeiling).toContain('range="(90,-90)"');
        });

        it("lifts the title clear of a name drawn straight up", async () => {
            // Eight equal slices put the first one's middle due north, so its
            // name is drawn upward from near the top of the box — which is
            // where the title goes. Measured against a real render, the two
            // boxes overlapped by six pixels before the title was lifted.
            const topOfBox = (xml: string) =>
                Number(xml.match(/bbox="\([^,]*,[^,]*,[^,]*,([^)]*)\)"/)?.[1]);
            const titleAnchor = (xml: string) =>
                Number(
                    xml.match(
                        /<label anchor="\([^,]*,([^)]*)\)" alignment="north" scale=/,
                    )?.[1],
                );

            const withNames = await chartXML(`
    <chart type="pie" name="c" legend="false" categories="a b c d e f g h"><title>Eight of them</title>1 1 1 1 1 1 1 1</chart>
    `);
            // Above the top of the box by the band the names occupy, which the
            // top margin already reserved alongside the title's own.
            expect(titleAnchor(withNames)).greaterThan(topOfBox(withNames));

            // With the names in a legend there is no band to clear, so the
            // title sits against the box as it does on every other type.
            const withLegend = await chartXML(`
    <chart type="pie" name="c" categories="a b c d e f g h"><title>Eight of them</title>1 1 1 1 1 1 1 1</chart>
    `);
            expect(titleAnchor(withLegend)).eq(topOfBox(withLegend));
        });

        it("lifts the title only as far as the top margin was granted", async () => {
            // The lift is asked for against the band the rim text *wanted*,
            // and a crowded frame grants less than that — so raising the title
            // by the whole band puts it above the room there is. Measured
            // against a real render, a `size="small"` pie with its legend
            // below, its values at the rim and a title drew that title three
            // pixels off the top of the picture.
            //
            // `TITLE_MARGIN` is 14px scaled by 1.4 plus a 10px gap.
            const titleMargin = 14 * 1.4 + 10;

            /** How far above the box the title is drawn, in pixels. */
            const liftInPixels = (xml: string) => {
                const box = xml
                    .match(/bbox="\(([^)]*)\)"/)![1]
                    .split(",")
                    .map(Number);
                const height = Number(
                    xml.match(/dimensions="\([^,]*,([^)]*)\)"/)![1],
                );
                const anchorY = Number(
                    xml.match(
                        /<label anchor="\([^,]*,([^)]*)\)" alignment="north" scale=/,
                    )![1],
                );
                return ((anchorY - box[3]) * height) / (box[3] - box[1]);
            };
            const topMargin = (xml: string) =>
                Number(
                    xml.match(/margins="\[[^,]*,[^,]*,[^,]*,([^\]]*)\]"/)![1],
                );

            const crowded = await chartXML(`
    <chart type="pie" name="c" size="small" legendPosition="outsideBottom" displayValues categories="North South East West"><title>Population by region</title>41 63 18 78</chart>
    `);
            // Cut back from the 18px band the values asked for to whatever is
            // left of the top margin once the title's own height is taken.
            expect(liftInPixels(crowded)).lessThan(18);
            expect(liftInPixels(crowded)).closeTo(
                topMargin(crowded) - titleMargin,
                0.5,
            );

            // The same chart with room to spare still clears its rim text by
            // the whole band.
            const roomy = await chartXML(`
    <chart type="pie" name="c" legendPosition="outsideBottom" displayValues categories="North South East West"><title>Population by region</title>41 63 18 78</chart>
    `);
            expect(liftInPixels(roomy)).closeTo(18, 0.5);
        });

        it("stands an outside legend beside the rim values when the frame is too narrow for both", async () => {
            // The margin that holds the legend and the margin that holds the
            // values shrink together, so buying the legend a place past them
            // on a frame too small for both takes width from the *left* margin
            // and pushes the value on that side off the picture — which is
            // what a `size="small"` pie of seven-digit values did. Beside them
            // is the lesser fault, and the only one of the two that keeps every
            // number inside the picture.
            const legendAnchor = (xml: string) =>
                Number(xml.match(/<legend anchor="\(([^,]*),/)?.[1]);
            const boxRight = (xml: string) =>
                Number(xml.match(/bbox="\([^,]*,[^,]*,([^,]*),/)?.[1]);

            const narrow = await chartXML(`
    <chart type="pie" name="c" size="small" displayValues categories="Alpha Bravo Charlie Delta">1200000 900000 700000 500000</chart>
    `);
            expect(legendAnchor(narrow)).eq(boxRight(narrow));

            // Wide enough for both, and the legend takes its place past them.
            const wide = await chartXML(`
    <chart type="pie" name="c" displayValues categories="Alpha Bravo Charlie Delta">1200000 900000 700000 500000</chart>
    `);
            expect(legendAnchor(wide)).greaterThan(boxRight(wide));
        });

        it("titles a pie above the drawing, in both formats", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B"><title>Two halves</title>1 1</chart>
    `);

            expect(xml).toContain('alignment="north" scale="1.4"');
            expect(xml).toContain(">Two halves</label>");
            // The caption as well as the label, so a title is a title in
            // tactile output too.
            expect(xml).toContain("<caption>Two halves</caption>");
        });

        it("says an axis name was not drawn, rather than dropping it in silence", async () => {
            // An ignored attribute costs an author nothing they can see; an
            // ignored `<yLabel>` is prose they wrote for a reader and that is
            // not on the page.
            const named = await getWarnings(`
    <chart type="pie" name="c" categories="A B"><shortDescription>x</shortDescription><yLabel>people</yLabel>1 1</chart>
    `);
            expect(named.warnings.map((w) => w.code)).toContain("doenet-w0153");

            const unnamed = await getWarnings(`
    <chart type="pie" name="c" categories="A B"><shortDescription>x</shortDescription>1 1</chart>
    `);
            expect(unnamed.warnings.map((w) => w.code)).not.toContain(
                "doenet-w0153",
            );

            // And it says nothing on a chart that does have axes to name.
            const bar = await getWarnings(`
    <chart type="bar" name="c" categories="A B"><shortDescription>x</shortDescription><yLabel>people</yLabel>1 1</chart>
    `);
            expect(bar.warnings.map((w) => w.code)).not.toContain(
                "doenet-w0153",
            );
        });

        it("reads its own attributes and ignores the ones that describe axes", async () => {
            // A pie has no axes and no slots, so the bounds and the bar
            // arrangement have nothing to describe. Ignored rather than
            // reported, the way `barWidth` already is on a scatter.
            const plain = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1 1</chart>
    `);
            const withAxisAttributes = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false"
           xMin="-5" xMax="5" yMin="0" yMax="100" barWidth="0.4" layout="stacked" markers="false">1 1</chart>
    `);

            expect(withAxisAttributes).eq(plain);
        });
    });
});
