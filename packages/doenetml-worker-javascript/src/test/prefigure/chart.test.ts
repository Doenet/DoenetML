import { describe, expect, it, vi } from "vitest";
import { chartXML, FOUR_BARS } from "./chart.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("chart prefigure tests @group4", async () => {
    describe("chart type", async () => {
        it("draws nothing and warns when no type is named", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart name="c" categories="A B C"><number>4</number><number>9</number><number>2</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;

            // Null rather than an empty diagram: the renderer takes it as
            // "put nothing on the page", so a typeless chart leaves no frame
            // behind that would read as a chart that failed to load.
            expect(chart.prefigureXML).eq(null);

            const { warnings } = getDiagnosticsByType(core);
            expect(warnings.map((w) => w.code)).toContain("doenet-w0146");
        });

        it("treats a type it does not know as no type at all", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart name="c" type="donut"><number>4</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML,
            ).eq(null);
            // Falling back to any of the types there are would draw a chart
            // nobody asked for, and there is no reading of `donut` that says
            // which one the author meant.
            expect(sv[await resolvePathToNodeIdx("c")].stateValues.type).eq(
                null,
            );

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toContain("doenet-w0146");
            // The rejected value is named too, in a message of its own, which
            // is why the warning above does not assume the attribute is
            // missing.
            expect(d.infos.some((i) => i.message.includes("donut"))).eq(true);
        });

        it("reports no axis for a chart that was not drawn", async () => {
            // `yMin`/`yMax` report what the chart was drawn with, and nothing
            // was: a number here would describe an axis that is not on screen.
            // A chart that *was* drawn always has both, so the reading of
            // `NaN` is unambiguous — it is this case and no other.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart name="c"><number>4</number></chart>
    <p name="bounds">$c.yMin, $c.yMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(
                sv[await resolvePathToNodeIdx("bounds")].stateValues.text,
            ).eq("NaN, NaN");

            // The values are still readable: they are what the children say,
            // whatever is done with them.
            expect(sv[await resolvePathToNodeIdx("c")].stateValues.values).eqls(
                [4],
            );
        });

        it("says nothing about the type once one is named", async () => {
            const { core } = await createTestCore({
                doenetML: `
    <chart type="bar"><number>4</number></chart>
    `,
            });
            await core.returnAllStateVariables(false, true);
            expect(
                getDiagnosticsByType(core).warnings.map((w) => w.code),
            ).not.toContain("doenet-w0146");
        });

        it("accepts the type in any case", async () => {
            const xml = await chartXML(`
    <chart name="c" type="Bar"><number>4</number></chart>
    `);
            expect(xml).toContain("<rectangle ");
        });

        it("takes an empty type as no type at all", async () => {
            // Both of these reach the attribute as the empty string rather
            // than as an absent attribute — `type=""` because that is what was
            // written, `type="$nope"` because a reference with no referent
            // supplies nothing. Neither names a chart, so both draw nothing.
            for (const written of [`type=""`, `type="$nope"`]) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `<chart name="c" ${written}><number>4</number></chart>`,
                });
                const sv = await core.returnAllStateVariables(false, true);
                const chart = sv[await resolvePathToNodeIdx("c")].stateValues;

                expect(chart.type).eq(null);
                expect(chart.prefigureXML).eq(null);
                expect(
                    getDiagnosticsByType(core).warnings.map((w) => w.code),
                ).toContain("doenet-w0146");
            }
        });

        it("follows a type that changes while the document is open", async () => {
            // The reason the choice of chart is an attribute rather than a tag
            // of its own: it can be computed, so one document can draw the same
            // values however a student asks for them. The chart therefore has
            // to appear and disappear as the type changes, not just be decided
            // once when the document loads.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <textInput name="ti" prefill="donut" />
    <chart name="c" type="$ti"><number>4</number></chart>
    `,
            });
            const chart = async () =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx("c")
                ].stateValues;
            const ti = await resolvePathToNodeIdx("ti");

            // Starts on a type there is no chart for, so nothing is drawn.
            expect((await chart()).type).eq(null);
            expect((await chart()).prefigureXML).eq(null);

            await updateTextInputValue({ text: "bar", componentIdx: ti, core });
            expect((await chart()).type).eq("bar");
            expect((await chart()).prefigureXML).toContain("<rectangle ");
            expect((await chart()).yMax).eq(5);

            // And back: the chart goes away again rather than keeping the last
            // drawing it managed.
            await updateTextInputValue({
                text: "donut",
                componentIdx: ti,
                core,
            });
            expect((await chart()).prefigureXML).eq(null);
            expect((await chart()).yMax).eq(null);
        });

        it("carries the type through a chart that extends another", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart name="c" type="bar"><number>4</number></chart>
    <chart extend="$c" name="copy" />
    <chart extend="$c" name="untyped" type="donut" />
    <chart name="none"><number>4</number></chart>
    <chart extend="$none" name="typed" type="bar" />
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const stateValues = async (name: string) =>
                sv[await resolvePathToNodeIdx(name)].stateValues;

            // A plain copy draws what it copied.
            expect((await stateValues("copy")).type).eq("bar");
            expect((await stateValues("copy")).prefigureXML).toContain(
                "<rectangle ",
            );

            // Overriding with a type there is no chart for turns the copy off
            // and leaves the chart it extends drawn.
            expect((await stateValues("untyped")).type).eq(null);
            expect((await stateValues("untyped")).prefigureXML).eq(null);
            expect((await stateValues("c")).prefigureXML).toContain(
                "<rectangle ",
            );

            // And the other way: a copy can name the type its source never did.
            expect((await stateValues("typed")).type).eq("bar");
            expect((await stateValues("typed")).prefigureXML).toContain(
                "<rectangle ",
            );
        });

        it("still reports the markup's own problems when nothing is drawn", async () => {
            // Deliberate. `barWidth` is wrong however the chart is drawn, and a
            // chart with no short description will be inaccessible the moment a
            // type is named, so both are reported alongside the missing type
            // rather than held back until it is supplied — otherwise fixing the
            // type is what reveals the next problem. Only the drawing is gated
            // on `chartGeometry`; the checks feeding it are not.
            const { core } = await createTestCore({
                doenetML: `
    <chart name="c" barWidth="5"><number>4</number></chart>
    `,
            });
            await core.returnAllStateVariables(false, true);

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toEqual(
                expect.arrayContaining(["doenet-w0143", "doenet-w0146"]),
            );
            expect(d.accessibility.length).eq(1);
        });
    });

    describe("theme", async () => {
        it("lightens the axes in dark mode", async () => {
            // PreFigure defaults axes and ticks to black, which disappears on
            // the dark canvas.
            const xml = await chartXML(FOUR_BARS, { theme: "dark" });
            expect(xml).toContain('stroke="#ffffff"');
        });

        it("leaves them alone in light mode", async () => {
            const xml = await chartXML(FOUR_BARS, { theme: "light" });
            expect(xml).not.toContain('stroke="#ffffff"');
        });
    });

    describe("public state variables", async () => {
        it("exposes the values and the categories", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    ${FOUR_BARS}
    <p name="pv">$c.values</p>
    <p name="pc">$c.categories</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("pv")].stateValues.text).eq(
                "41, 63, 18, 78",
            );
            expect(sv[await resolvePathToNodeIdx("pc")].stateValues.text).eq(
                "North, South, East, West",
            );
        });

        it("indexes the values one at a time", async () => {
            // `values` is an array with `value` as its entry prefix, so a
            // single bar's number is `$c.value2` — the pairing `$c.categories`
            // and `$c.category2` already have. An index past the last bar names
            // nothing rather than reporting a number, and the whole array still
            // feeds an operator that takes a list.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    ${FOUR_BARS}
    <p name="first">$c.value1</p>
    <p name="second">$c.value2</p>
    <p name="past">[$c.value9]</p>
    <p name="total"><sum>$c.values</sum></p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const text = async (name: string) =>
                sv[await resolvePathToNodeIdx(name)].stateValues.text;

            expect(await text("first")).eq("41");
            expect(await text("second")).eq("63");
            expect(await text("past")).eq("[]");
            expect(await text("total")).eq("200");
        });

        it("reports the scale it drew, not the scale it was asked for", async () => {
            // `yMin`/`yMax` are optional and are dropped together when they do
            // not describe a box to draw in, and `barWidth` falls back when it
            // is not a fraction of a slot — so reading the attribute back
            // would answer a question nobody asked. Each property is the
            // number the picture was drawn with.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    ${FOUR_BARS}
    <p name="auto">$c.yMin, $c.yMax, $c.barWidth</p>

    <chart type="bar" name="d" yMin="10" yMax="95" barWidth="3"><number>50</number></chart>
    <p name="given">$d.yMin, $d.yMax, $d.barWidth</p>

    <chart type="bar" name="e" yMin="Infinity"><number>4</number></chart>
    <p name="dropped">$e.yMin, $e.yMax</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // The automatic box: zero up to the tick above the tallest bar.
            expect(sv[await resolvePathToNodeIdx("auto")].stateValues.text).eq(
                "0, 80, 0.8",
            );
            // The author's box, honored; their bar width, not.
            expect(sv[await resolvePathToNodeIdx("given")].stateValues.text).eq(
                "10, 95, 0.8",
            );
            // A bound that is not a finite number takes its partner with it.
            expect(
                sv[await resolvePathToNodeIdx("dropped")].stateValues.text,
            ).eq("0, 5");
        });
    });

    describe("accessibility", async () => {
        it("asks for a short description when there is none", async () => {
            const { core } = await createTestCore({
                doenetML: `<chart type="bar" name="c"><number>4</number></chart>`,
            });
            await core.returnAllStateVariables(false, true);
            const { accessibility } = getDiagnosticsByType(core);
            expect(accessibility.some((a) => a.message.includes("chart"))).eq(
                true,
            );
        });

        it("stays quiet for a decorative chart", async () => {
            const { core } = await createTestCore({
                doenetML: `<chart type="bar" name="c" decorative><number>4</number></chart>`,
            });
            await core.returnAllStateVariables(false, true);
            const { accessibility } = getDiagnosticsByType(core);
            expect(accessibility.length).eq(0);
        });
    });

    describe("driven by the counting operators", async () => {
        it("charts a tally of sampled subpopulations", async () => {
            // The end of the road this whole family was built for: the chart's
            // children are another composite's replacements.
            const xml = await chartXML(`
    <setup>
      <numberList name="pop">30 45 12 60</numberList>
      <textList name="labels">North South East West</textList>
      <cumulativeSum name="cum">$pop</cumulativeSum>
    </setup>
    <numberList name="draws">5 40 80 100 20 90 76 3</numberList>
    <searchSorted name="which" target="$draws" hide>$cum</searchSorted>
    <tally name="counts" categories="1 2 3 4" hide>$which</tally>
    <chart type="bar" name="c" categories="$labels">
      <shortDescription>Sampled counts</shortDescription>
      $counts
    </chart>
    `);

            // counts are 3, 1, 2, 2
            expect(xml).toContain('dimensions="(0.8,3)"');
            expect(xml).toContain(
                '<annotation ref="bar-1-1" text="North: 3" />',
            );
            expect(xml).toContain(
                '<annotation ref="bar-1-4" text="West: 2" />',
            );
        });
    });

    describe("bare numbers as children", async () => {
        it("reads bare numbers as bar heights", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B C">41 63 18</chart>
    <p name="p">$c.values</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "41, 63, 18",
            );

            // The categories are labels, so naming the bars `A B C` leaves
            // `41 63 18` read as the numbers they are.
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;
            expect((xml.match(/<rectangle /g) ?? []).length).eq(3);
            expect(xml).toContain(">A</tick-mark>");
        });

        it("evaluates a bare fraction rather than charting NaN", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c">1/2 3/4</chart>
    <p name="p">$c.values</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "0.5, 0.75",
            );
        });

        it("mixes bare numbers with element children", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c">4 <number>9</number> 2</chart>
    <p name="p">$c.values</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "4, 9, 2",
            );
        });
    });

    describe("series", async () => {
        it("draws bare values as one unnamed series", async () => {
            // The implicit series is what makes the simple chart simple: the
            // author writes values, and everything downstream still sees a list
            // of series.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c">4 9 2</chart>
    <p name="n">$c.numSeries</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;

            expect(sv[await resolvePathToNodeIdx("n")].stateValues.text).eq(
                "1",
            );
            // No group to name and none to distinguish, so the bars go straight
            // into the diagram and straight under the figure annotation.
            expect(chart.prefigureXML).not.toContain("<group ");
            expect(chart.prefigureXML).not.toContain("<legend ");
        });

        it("places grouped bars side by side within each slot", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B">
      <series><label>first</label>4 9</series>
      <series><label>second</label>6 1</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // The two series divide the 0.8 slot between them, so each bar is
            // 0.4 wide and the pair spans 0.6 to 1.4 — exactly the ground one
            // series covers on its own at the same `barWidth`.
            expect(xml).toContain(
                '<rectangle at="bar-1-1" lower-left="(0.6,0)" dimensions="(0.4,4)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-2-1" lower-left="(1,0)" dimensions="(0.4,6)"',
            );
            // Bars are measured from the baseline, so the taller of the pair
            // sets the top of the box rather than their total.
            expect(xml).toContain('bbox="(0,0,3,10)"');
        });

        it("keeps a saturated stack's far corner inside the double range", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" layout="stacked"><series>1e308</series><series>1e308</series></chart>
    `);

            // Saturating the running total is not enough on its own. A segment
            // drawn at the ceiling with its own value as its height has a far
            // corner past the top of the double range — both attributes finite,
            // their sum not — and PreFigure computes that corner rather than
            // reading it, which came out as `L nan -inf` in the drawn path.
            // Measuring the segment between the two ends it is actually drawn
            // at leaves it flat against the ceiling instead.
            expect(xml).toContain('lower-left="(0.6,1e+308)"');
            const stackedTop = xml.match(
                /at="bar-2-1" lower-left="\(0\.6,([^)]*)\)" dimensions="\(0\.8,([^)]*)\)"/,
            );
            expect(stackedTop, "the second segment should be drawn").not.eq(
                null,
            );
            const base = Number(stackedTop?.[1]);
            const height = Number(stackedTop?.[2]);
            expect(Number.isFinite(base + height)).eq(true);
            expect(base + height).toBeLessThanOrEqual(Number.MAX_VALUE);
        });

        it("keeps the far corner finite when snapping would round it over", async () => {
            // Measuring the height between the two ends is not enough either,
            // because the height is then snapped, and `toPrecision(12)` rounds
            // *up* as readily as down. A small base under a saturated total is
            // where that shows: the exact difference fits, and the snapped one
            // does not. This came back as `L nan -inf` in the drawn path with
            // the chart reporting no null anywhere in its XML.
            for (const first of [
                "1.7976931348623157e302",
                "1e300",
                "5.99e307",
            ]) {
                const xml = await chartXML(`
    <chart type="bar" name="c" layout="stacked" categories="A" displayValues>
      <series>${first}</series><series>1.7976931348623157e308</series>
    </chart>
    `);
                const corners = [
                    ...xml.matchAll(
                        /lower-left="\(([^,]*),([^)]*)\)" dimensions="\(([^,]*),([^)]*)\)"/g,
                    ),
                ].map((m) => Number(m[2]) + Number(m[4]));
                expect(corners.length, `${first}: bars drawn`).toBeGreaterThan(
                    0,
                );
                for (const corner of corners) {
                    expect(
                        Number.isFinite(corner),
                        `${first}: far corner ${corner}`,
                    ).eq(true);
                }
                expect(xml, `${first}: no null in the XML`).not.toContain(
                    "null",
                );
            }
        });

        it("measures a stack of fractions without leaving dust in the XML", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" layout="stacked" displayValues categories="A">
      <series>0.1</series><series>0.2</series><series>0.3</series>
    </chart>
    `);

            // A segment's height is the difference of two running totals, so it
            // carries the same binary dust a divided slot does: measured raw,
            // the second and third segments come out 0.20000000000000004 and
            // 0.30000000000000004 tall, and the top label is anchored at
            // 0.6000000000000001. Snapped like every other coordinate here,
            // they are the numbers the author wrote.
            expect(xml).toContain(
                'lower-left="(0.6,0.1)" dimensions="(0.8,0.2)"',
            );
            expect(xml).toContain(
                'lower-left="(0.6,0.3)" dimensions="(0.8,0.3)"',
            );
            expect(xml).toContain('anchor="(1,0.6)"');
            expect(xml).not.toMatch(/0\.\d{13}/);

            // A grouped bar's label is anchored over the middle of a slot
            // divided among the series, which leaves dust of its own —
            // `0.7333333333334999` for the first of three.
            const grouped = await chartXML(`
    <chart type="bar" name="c" displayValues categories="A">
      <series>0.1</series><series>0.2</series><series>0.3</series>
    </chart>
    `);
            expect(grouped).toContain('anchor="(0.733333333333,0.1)"');
            expect(grouped).not.toMatch(/0\.\d{13}/);
        });

        it("draws every value label over every bar, not just its own", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" layout="stacked" displayValues categories="A">
      <series>4</series><series>6</series>
    </chart>
    `);

            // A stacked segment starts exactly where the one below it ends,
            // which is where that one's label is anchored — so a label emitted
            // beside its own bar is painted over by the next series' rectangle.
            // Every label therefore comes after every rectangle.
            const lastRectangle = xml.lastIndexOf("<rectangle ");
            const firstLabel = xml.indexOf("<label ");
            expect(firstLabel).toBeGreaterThan(lastRectangle);
            expect((xml.match(/<label /g) ?? []).length).eq(2);
        });

        it("stacks bars from the baseline, up and down separately", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" layout="stacked" categories="A">
      <series>4</series>
      <series>6</series>
      <series>-3</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Full width, and each positive bar starts where the last one
            // ended. The negative one hangs from zero rather than from the top
            // of the positive stack, which is what keeps a mixed-sign stack
            // from drawing its bars through each other.
            expect(xml).toContain(
                '<rectangle at="bar-1-1" lower-left="(0.6,0)" dimensions="(0.8,4)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-2-1" lower-left="(0.6,4)" dimensions="(0.8,6)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-3-1" lower-left="(0.6,-3)" dimensions="(0.8,3)"',
            );
            // The box holds the totals, not the largest single value: the
            // stack reaches 10, which is a tick past the 6 the tallest bar
            // alone would have asked for.
            expect(xml).toContain('bbox="(0,-5,2,15)"');
        });

        it("gives consecutive series consecutive style numbers", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" styleNumber="2">
      <series name="s1">4</series>
      <series name="s2">6</series>
      <series name="s3" styleNumber="6">1</series>
    </chart>
    <p name="p">$s1.styleNumber $s2.styleNumber $s3.styleNumber</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Offset by the chart's own style, so a one-series chart is drawn
            // in exactly the style the chart asked for, and an author who names
            // a style on a series keeps it.
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "2 3 6",
            );
        });

        it("still numbers the series apart when a repeat builds them", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" categories="A" styleNumber="2">
      <repeat for="1 2 3" valueName="v">
        <series>$v</series>
      </repeat>
    </chart>
    `);

            // Building one series per group of the data is what a repeat is
            // for, so the wrapper must not be what a series takes its style
            // from: if a series fell back to the styleNumber of the component
            // around it, all three would read the chart's own 2 off the repeat
            // and come out one color.
            const fills = [
                ...xml.matchAll(/<rectangle [^>]*?fill="([^"]*)"/g),
            ].map((m) => m[1]);
            expect(fills.length).eq(3);
            expect(new Set(fills).size).eq(3);
            for (const seriesNumber of [1, 2, 3]) {
                expect(xml).toContain(`at="bar-${seriesNumber}-1"`);
            }
        });

        it("groups each series for a screen reader to stop at", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B">
      <series><label>first</label>4 9</series>
      <series>6 1</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            expect(xml).toContain('<group at="series-1">');
            expect(xml).toContain('<group at="series-2">');
            // The bars hang under their series, which hangs under the figure.
            expect(xml).toContain(
                '<annotation ref="series-1" text="first"><annotation ref="bar-1-1" text="A: 4" />',
            );
            // An unnamed series still has to be distinguishable from the one
            // before it — and from the categories and values announced on the
            // levels either side of it, which a bare number would not be. So
            // the fallback is a localized phrase rather than a position.
            expect(xml).toContain(
                '<annotation ref="series-2" text="series 2">',
            );
        });

        it("leaves a hidden series and a hidden title out of the chart", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B">
      <title hide>Not this</title>
      <series name="shown"><label>first</label>4 9</series>
      <series name="gone" hide><label>second</label>6 1</series>
    </chart>
    <p name="n">$c.numSeries</p>
    <p name="t">$c.title</p>
    <p name="hiddenValues">$gone.values</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // `hide` on a drawn child of a container means it is not drawn —
            // the same thing it means for a `<point>` inside a `<graph>`.
            expect((xml.match(/<rectangle /g) ?? []).length).eq(2);
            expect(xml).not.toContain("second");
            // With one series left there is no group and no legend entry for
            // the one that went.
            expect(xml).not.toContain("<group ");

            // A hidden title is no title: the text is drawn into the diagram
            // rather than rendered as a child, so `hide` reaches it only by
            // being read.
            expect(xml).not.toContain("Not this");
            expect(sv[await resolvePathToNodeIdx("t")].stateValues.text).eq("");

            // The chart describes the chart — one series, its values.
            expect(sv[await resolvePathToNodeIdx("n")].stateValues.text).eq(
                "1",
            );
            // The hidden series still exists and still reports its own data.
            expect(
                sv[await resolvePathToNodeIdx("hiddenValues")].stateValues.text,
            ).eq("6, 1");
        });

        it("hides the whole chart without emptying it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" hide categories="A B">
      <title>Still the title</title>
      <series>4 9</series>
      <series>6 1</series>
    </chart>
    <p name="v">$c.values</p>
    <p name="n">$c.numSeries</p>
    <p name="t">$c.title</p>
    <p name="sum"><sum>$c.values</sum></p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const read = async (name) =>
                sv[await resolvePathToNodeIdx(name)].stateValues.text;

            // `hidden` is inherited, so a `<chart hide>` marks every child
            // hidden — including the series. Reading that as "the author hid
            // these series" would let hiding a chart delete the data an author
            // is still writing about beside it, which is why the filter asks
            // whether a series is hidden *from the chart* rather than whether
            // it is hidden at all.
            expect(await read("v")).eq("4, 9, 6, 1");
            expect(await read("n")).eq("2");
            expect(await read("sum")).eq("20");
            expect(await read("t")).eq("Still the title");
        });

        it("still drops a series hidden on its own account inside a hidden chart", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="both" hide><series>4 9</series><series hide>6 1</series></chart>
    <p name="bothValues">$both.values</p>
    <chart type="bar" name="wrapped"><series>4 9</series><group hide><series>6 1</series></group></chart>
    <p name="wrappedValues">$wrapped.values</p>
    <chart type="bar" name="bothWrapped" hide><series>4 9</series><group hide><series>6 1</series></group></chart>
    <p name="bothWrappedValues">$bothWrapped.values</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const read = async (name) =>
                sv[await resolvePathToNodeIdx(name)].stateValues.text;

            // The chart being hidden is not what hid this one, so it stays out.
            expect(await read("bothValues")).eq("4, 9");
            // And something between the series and the chart hiding it counts
            // too — a `<group hide>` passes its hiding to what it produces.
            expect(await read("wrappedValues")).eq("4, 9");
            // Including when the chart is hidden as well, which is what reading
            // the series' own `hide` alone would miss: the group's hiding
            // reaches the series through the composite, not through the chart.
            expect(await read("bothWrappedValues")).eq("4, 9");
        });

        it("does not recolor the chart when a series is hidden", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c"><series name="a">4</series><series name="b" hide>9</series><series name="d">2</series></chart>
    <p name="p">$a.styleNumber $b.styleNumber $d.styleNumber</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            // Style numbers come from the child list, so hiding the middle
            // series leaves the last one the color it already had rather than
            // shifting every color along.
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "1 2 3",
            );
        });

        it("counts every series in values, and reports how many there are", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c">
      <series name="s1">4 9</series>
      <series name="s2">6 1</series>
    </chart>
    <p name="all">$c.values</p>
    <p name="one">$s2.values</p>
    <p name="n">$c.numSeries</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(sv[await resolvePathToNodeIdx("all")].stateValues.text).eq(
                "4, 9, 6, 1",
            );
            expect(sv[await resolvePathToNodeIdx("one")].stateValues.text).eq(
                "6, 1",
            );
            expect(sv[await resolvePathToNodeIdx("n")].stateValues.text).eq(
                "2",
            );
        });

        it("keeps the axis as long as the longest series", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A B C">
      <series>4 9 2</series>
      <series>6</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A short series leaves its later slots empty rather than
            // shortening the axis under the series that does reach them.
            expect((xml.match(/<tick-mark /g) ?? []).length).eq(3);
            expect((xml.match(/<rectangle /g) ?? []).length).eq(4);
        });

        it("warns about values written beside a series", async () => {
            const { core } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c">7<series>4 9</series></chart>
    `,
            });
            await core.returnAllStateVariables(false, true);

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toContain("doenet-w0147");
        });
    });

    describe("title and legend", async () => {
        it("draws a title above the chart and widens the top margin for it", async () => {
            const withoutTitle = await chartXML(`
    <chart type="bar" name="c" categories="A">4</chart>
    `);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="A">
      <title>Counts by region</title>
      4
    </chart>
    <p name="t">$c.title</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            expect(sv[await resolvePathToNodeIdx("t")].stateValues.text).eq(
                "Counts by region",
            );
            // Centered on the box and anchored at its top, so it is drawn into
            // the margin rather than over the bars.
            expect(xml).toContain(
                'alignment="north" scale="1.4" color="currentColor">Counts by region</label>',
            );
            // The caption reaches tactile output only, so it is emitted as well
            // as the label rather than instead of it.
            expect(xml).toContain("<caption>Counts by region</caption>");

            // Room had to be made: the margins are drawn outside the
            // dimensions, so a title in a margin sized for an axis label would
            // be cut off by the edge of the picture.
            const topMargin = (x: string) =>
                Number(x.match(/margins="\[[^\]]*,([^,\]]*)\]"/)?.[1]);
            expect(topMargin(xml)).toBeGreaterThan(topMargin(withoutTitle));
        });

        it("draws a legend when a series is named, and not when none is", async () => {
            const named = await chartXML(`
    <chart type="bar" name="c">
      <series><label>2024</label>4</series>
      <series><label>2025</label>6</series>
    </chart>
    `);
            const unnamed = await chartXML(`
    <chart type="bar" name="c">
      <series>4</series>
      <series>6</series>
    </chart>
    `);

            // Keyed off the bars themselves: PreFigure reads the referenced
            // element's fill and draws a swatch of it, so the legend cannot
            // disagree with the bars it names.
            expect(named).toContain(
                '<item ref="bar-1-1" color="currentColor">2024</item>',
            );
            expect(named).toContain(
                '<item ref="bar-2-1" color="currentColor">2025</item>',
            );
            // Transparent box, outlined in the page's text color: PreFigure
            // fills a legend white with no attribute to say otherwise, which
            // would read as a hole punched in a chart drawn in dark mode.
            expect(named).toContain('opacity="0" stroke="currentColor"');
            // Nothing to say, so no box with a blank line in it.
            expect(unnamed).not.toContain("<legend ");
        });

        it("reports whether a legend is drawn, not whether one was asked for", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="named"><series><label>2024</label>4</series></chart>
    <p name="namedShows">$named.showLegend</p>

    <chart type="bar" name="unnamed"><series>4</series><series>9</series></chart>
    <p name="unnamedShows">$unnamed.showLegend</p>

    <chart type="bar" name="off" legend="false"><series><label>2024</label>4</series></chart>
    <p name="offShows">$off.showLegend</p>

    <chart type="bar" name="undrawable"><series><label>2024</label><math>x</math></series></chart>
    <p name="undrawableShows">$undrawable.showLegend</p>

    <chart name="typeless"><series><label>2024</label>4</series></chart>
    <p name="typelessShows">$typeless.showLegend</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);

            expect(
                sv[await resolvePathToNodeIdx("namedShows")].stateValues.text,
            ).eq("true");
            // A legend names the series, so unnamed series leave nothing to put
            // in one — and the property says so rather than reporting a legend
            // the author cannot see.
            expect(
                sv[await resolvePathToNodeIdx("unnamedShows")].stateValues.text,
            ).eq("false");
            expect(
                sv[await resolvePathToNodeIdx("offShows")].stateValues.text,
            ).eq("false");
            // Named is not enough: an item's swatch is drawn from a bar it
            // points at, so a series with no drawable value gets no item and
            // this chart gets no legend.
            expect(
                sv[await resolvePathToNodeIdx("undrawableShows")].stateValues
                    .text,
            ).eq("false");
            expect(
                sv[await resolvePathToNodeIdx("undrawable")].stateValues
                    .prefigureXML,
            ).not.toContain("<legend ");
            // And a chart with no type draws nothing at all, legend included.
            expect(
                sv[await resolvePathToNodeIdx("typelessShows")].stateValues
                    .text,
            ).eq("false");
            expect(
                sv[await resolvePathToNodeIdx("typeless")].stateValues
                    .prefigureXML,
            ).eq(null);
        });

        it("keeps the legend out of the plot by default, at the cost of a margin", async () => {
            const withLegend = await chartXML(`
    <chart type="bar" name="c" categories="A B">
      <series><label>Q1</label>4 9</series>
      <series><label>Q2</label>6 1</series>
    </chart>
    `);
            const withoutLegend = await chartXML(`
    <chart type="bar" name="c" categories="A B">
      <series>4 9</series><series>6 1</series>
    </chart>
    `);

            // Anchored at the plot's top-right corner and aligned `se`, which
            // puts the box below and right of it — in the margin, where nothing
            // is drawn. A legend in a corner of the plot sits exactly where a
            // bar chart's tallest bars do.
            expect(withLegend).toContain(
                '<legend anchor="(3,10)" alignment="se"',
            );

            // The margin is widened to hold it, and only when there is one.
            const rightMargin = (xml: string) =>
                Number(xml.match(/margins="\[[^,]*,[^,]*,([^,]*),/)?.[1]);
            expect(rightMargin(withLegend)).toBeGreaterThan(
                rightMargin(withoutLegend),
            );
            // Which the drawing area gives up, so the frame is still the size
            // the author asked for.
            const innerWidth = (xml: string) =>
                Number(xml.match(/dimensions="\(([^,]*),/)?.[1]);
            expect(innerWidth(withLegend)).toBeLessThan(
                innerWidth(withoutLegend),
            );
        });

        it("puts an outsideBottom legend under the category names", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" categories="A B" legendPosition="outsideBottom">
      <series><label>Q1</label>4 9</series>
      <series><label>Q2</label>6 1</series>
    </chart>
    `);

            // Centered under the plot, and below the horizontal axis' own
            // labels rather than over them: the anchor drops by whatever the
            // reserved margin leaves once the box, PreFigure's own 4px offset
            // and the gap to the edge are taken out of it. On a chart roomy
            // enough for the legend that comes to the band those labels
            // occupy; on a crowded one it comes to less, and the box rises
            // over them rather than off the bottom of the picture.
            const anchor = xml.match(/<legend anchor="\(([^,]*),([^)]*)\)"/);
            expect(Number(anchor?.[1])).eq(1.5);
            expect(Number(anchor?.[2])).toBeLessThan(0);
            expect(xml).toContain('alignment="s"');

            // Height is what this one spends, where `outsideRight` spends
            // width.
            expect(
                Number(xml.match(/margins="\[[^,]*,([^,]*),/)?.[1]),
            ).toBeGreaterThan(30);
        });

        it("leaves the outsideBottom legend room below it", async () => {
            for (const size of ["small", "medium", "large"]) {
                for (const count of [2, 4, 6, 8]) {
                    // More series than the margin can hold is the case that used to
                    // run off the bottom: a floor at the band the category names
                    // occupy kept the box below them and outside the picture, by
                    // 70px at eight series on a small chart.
                    const series = Array.from(
                        { length: count },
                        (_unused, index) =>
                            `<series><label>s${index + 1}</label>${index + 1} ${index + 2}</series>`,
                    ).join("");
                    const xml = await chartXML(`
    <chart type="bar" name="c" categories="A B" size="${size}" legendPosition="outsideBottom">
      ${series}
    </chart>
    `);

                    const [, yMin, , yMax] = (
                        xml.match(/bbox="\(([^)]*)\)"/)?.[1] ?? ""
                    )
                        .split(",")
                        .map(Number);
                    const [, innerHeight] = (
                        xml.match(/dimensions="\(([^)]*)\)"/)?.[1] ?? ""
                    )
                        .split(",")
                        .map(Number);
                    const marginBottom = Number(
                        xml.match(/margins="\[[^,]*,([^,]*),/)?.[1],
                    );
                    const marginTop = Number(
                        xml.match(/margins="\[[^\]]*,([^,\]]*)\]"/)?.[1],
                    );
                    const anchorY = Number(
                        xml.match(/<legend anchor="\([^,]*,([^)]*)\)"/)?.[1],
                    );

                    // How far below the axis the box is anchored, back in pixels.
                    const belowAxis =
                        ((yMin - anchorY) * innerHeight) / (yMax - yMin);

                    // Everything the margin has to hold: the drop to the anchor,
                    // PreFigure's own 4px offset, and the box itself — which is at
                    // most the estimate the margin was reserved from. Anything left
                    // over is the gap to the edge of the picture, and it must be
                    // positive or the legend is drawn past the bottom of the SVG.
                    const estimatedLegendHeight = 3 + count * 21;
                    const used = belowAxis + 4 + estimatedLegendHeight;

                    // Only where a box that size could be placed inside the
                    // picture at all. The reserved height is deliberately
                    // generous — it cannot know whether the labels carry a
                    // descender — so on a small chart with many series it can
                    // exceed the whole frame, and then no anchor puts it
                    // inside. What the *drawn* box does in that case is
                    // measured against the build service in
                    // `chart-prefigure-live-validation.test.ts`, which is the
                    // only thing that knows how tall the legend really came
                    // out.
                    const pictureHeight =
                        innerHeight + marginBottom + marginTop;
                    if (estimatedLegendHeight + 4 + 8 <= pictureHeight) {
                        expect(
                            marginBottom - used,
                            `${size}/${count}: legend should have room below it`,
                        ).toBeGreaterThan(0);
                    }

                    // It clears the category names whenever the margin it asked
                    // for was granted. Where `fitMargins` capped that, the box
                    // rises over them instead — which is the other outside
                    // placement's trade-off, and better than leaving the picture.
                    expect(
                        belowAxis,
                        `${size}/${count}: the box's top stays in the picture`,
                    ).toBeGreaterThanOrEqual(-(marginTop + innerHeight));
                }
            }
        });

        it("reserves a wider key for a line chart's legend", async () => {
            // PreFigure draws a line chart's key as a segment of the stroke
            // rather than a block of the fill, and a segment is longer:
            // measured against a real render, the same label came back 56.9px
            // wide in a bar chart's legend and 70.9px in a line chart's.
            // Reserving the swatch width for both left the line chart's legend
            // 14px wider than its margin, with 3px of gap where 8 was meant.
            const rightMargin = async (doenetML: string) =>
                Number(
                    (await chartXML(doenetML)).match(
                        /margins="\[[^,]*,[^,]*,([^,]*),/,
                    )?.[1],
                );

            const asBar = await rightMargin(`
    <chart type="bar" name="c" categories="A B C">
      <series><label>first</label>12 19 15</series>
    </chart>
    `);
            const asLine = await rightMargin(`
    <chart type="line" name="c" categories="A B C">
      <series><label>first</label>12 19 15</series>
    </chart>
    `);
            const asScatter = await rightMargin(`
    <chart type="scatter" name="c">
      <series x="1 2 3"><label>first</label>12 19 15</series>
    </chart>
    `);

            expect(asLine - asBar).eq(14);
            // A scatter keys off a point, which is a swatch like a bar's — so
            // it is only the numeric axis' own labels that separate the two.
            expect(asScatter).toBeGreaterThanOrEqual(asBar);
            expect(asScatter).toBeLessThan(asLine);
        });

        it("reserves more width for a wide glyph than a narrow one", async () => {
            // The width classes are measured, not guessed. `%` is 11.9px and
            // `&` 10.3px — wider than any lowercase letter — and `|` is 7.7px
            // rather than the hairline it looks like. All three were reserved
            // at the lowercase width, and `%%%%%%` was drawn 12.6px past the
            // right edge of the picture.
            const rightMargin = async (label: string) =>
                Number(
                    (
                        await chartXML(`
    <chart type="bar" name="c" categories="A">
      <series><label>${label}</label>4</series>
    </chart>
    `)
                    ).match(/margins="\[[^,]*,[^,]*,([^,]*),/)?.[1],
                );

            const narrow = await rightMargin("llllll");
            for (const label of [
                "%%%%%%",
                "&amp;&amp;&amp;&amp;&amp;&amp;",
                "||||||",
                "######",
            ]) {
                expect(
                    await rightMargin(label),
                    `${label} is drawn wider than llllll`,
                ).toBeGreaterThan(narrow);
            }

            // And a capital is wider than the lowercase it shadows, but `O` is
            // not `F`: treating every capital alike wasted 20px on a label in
            // capitals.
            expect(await rightMargin("OOOOOO")).toBeGreaterThan(
                await rightMargin("FFFFFF"),
            );
        });

        it("reserves the right margin from how wide the labels are drawn", async () => {
            const withLabels = async (label: string) =>
                Number(
                    (
                        await chartXML(`
    <chart type="bar" name="c" categories="A B">
      <series><label>${label}</label>4 9</series>
      <series><label>${label}</label>6 1</series>
    </chart>
    `)
                    ).match(/margins="\[[^,]*,[^,]*,([^,]*),/)?.[1],
                );

            // Two labels of the same length, drawn at very different widths.
            // Reserving by character count could not tell them apart, and the
            // wide one was drawn 5px past the right edge of the picture.
            expect(await withLabels("WWWWWW")).toBeGreaterThan(
                await withLabels("llllll"),
            );

            // The margin holds PreFigure's 4px offset, the box, and a gap to
            // the edge — and *not* the 12px the corner of an axis label is
            // given, which the legend already reserves well past. `Q1` comes to
            // 4 + the 30px of key and padding + 20 of label + 8, or 62.
            // Stacking the base margin underneath made it 74, and left that
            // 12px of the picture's width empty in every chart with a legend.
            expect(await withLabels("Q1")).toBeLessThan(70);
        });

        it("centers the title and the bottom legend without overflowing", async () => {
            // Two finite bounds can sum to `Infinity`, and the midpoint was
            // taken as `(xMin + xMax) / 2`. A titled scatter of large x came
            // out with `anchor="(null,10)"`, which is not XML PreFigure can
            // read. Only a numeric horizontal axis reaches this: a bar chart's
            // runs from zero to the number of categories.
            for (const doenetML of [
                `<chart type="scatter" name="c" xMin="1e308" xMax="1.7e308">
                   <title>T</title>
                   <series x="1e308 1.5e308">4 9</series>
                 </chart>`,
                `<chart type="scatter" name="c" legendPosition="outsideBottom">
                   <series x="1e308 1.7e308"><label>s</label>4 9</series>
                 </chart>`,
                `<chart type="scatter" name="c">
                   <title>T</title>
                   <series x="-1.7e308 1.7e308">4 9</series>
                 </chart>`,
            ]) {
                const xml = await chartXML(doenetML);
                expect(xml, "no null in the emitted XML").not.toContain("null");

                for (const [, anchorX] of xml.matchAll(/anchor="\(([^,]*),/g)) {
                    expect(
                        Number.isFinite(Number(anchorX)),
                        `anchor x is ${anchorX}`,
                    ).eq(true);
                }
            }
        });

        it("keeps the legend anchor finite on an axis that spans the doubles", async () => {
            // `yMax - yMin` for data at both ends of the double range is
            // `Infinity`, and an offset scaled by that is `-Infinity`, which
            // `formatNumber` writes as `null`. `anchor="(1.5,null)"` is not XML
            // PreFigure can read, so the offset is dropped instead.
            for (const position of ["outsideBottom", "outsideRight"]) {
                const xml = await chartXML(`
    <chart type="bar" name="c" legendPosition="${position}" categories="A B">
      <series><label>lo</label>-1.7976931348623157e308 1</series>
      <series><label>hi</label>1.7976931348623157e308 2</series>
    </chart>
    `);
                const anchor = xml.match(
                    /<legend anchor="\(([^,]*),([^)]*)\)"/,
                );
                expect(anchor, `${position}: a legend is drawn`).not.eq(null);
                expect(
                    Number.isFinite(Number(anchor?.[1])),
                    `${position}: anchor x is ${anchor?.[1]}`,
                ).eq(true);
                expect(
                    Number.isFinite(Number(anchor?.[2])),
                    `${position}: anchor y is ${anchor?.[2]}`,
                ).eq(true);
                expect(xml, `${position}: no null`).not.toContain("null");
            }
        });

        it("pulls an outsideRight legend back inside a margin too small for it", async () => {
            // `fitMargins` caps the margin at two thirds of the frame, but the
            // box does not shrink with it, so a small chart with long labels
            // had its legend drawn past the right edge of the picture and
            // clipped — 41px past it for a 23-character label. The anchor comes
            // in by the difference so the box lands inside.
            const placement = async (doenetML: string) => {
                const xml = await chartXML(doenetML);
                const [xMin, , xMax] = (
                    xml.match(/bbox="\(([^)]*)\)"/)?.[1] ?? ""
                )
                    .split(",")
                    .map(Number);
                return {
                    anchorX: Number(
                        xml.match(/<legend anchor="\(([^,]*),/)?.[1],
                    ),
                    xMin,
                    xMax,
                };
            };

            const long = await placement(`
    <chart type="bar" name="c" size="small" categories="A">
      <series><label>Northern Territory 2024</label>4</series>
    </chart>
    `);
            const short = await placement(`
    <chart type="bar" name="c" size="small" categories="A">
      <series><label>Q1</label>4</series>
    </chart>
    `);

            // A legend that fits is anchored on the plot's right edge, and the
            // short-labeled chart's still is.
            expect(short.anchorX).eq(short.xMax);
            // The long-labeled one comes in, and not past the plot itself.
            expect(long.anchorX).toBeLessThan(long.xMax);
            expect(long.anchorX).toBeGreaterThanOrEqual(long.xMin);
        });

        it("honors legend and legendPosition", async () => {
            const suppressed = await chartXML(`
    <chart type="bar" name="c" legend="false">
      <series><label>2024</label>4</series>
    </chart>
    `);
            expect(suppressed).not.toContain("<legend ");

            const lowerLeft = await chartXML(`
    <chart type="bar" name="c" legendPosition="lowerLeft">
      <series><label>2024</label>4</series>
    </chart>
    `);
            // Anchored at the corner it sits in, and aligned away from it so
            // the box lands inside the chart rather than outside.
            expect(lowerLeft).toContain(
                '<legend anchor="(0,0)" alignment="ne"',
            );
        });
    });
});
