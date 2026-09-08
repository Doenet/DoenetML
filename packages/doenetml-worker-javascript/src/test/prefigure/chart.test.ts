import { describe, expect, it, vi } from "vitest";
import { getGraphRendererState, getWarnings } from "./graph-prefigure.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateTextInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** The PreFigure XML `<chart type="bar" name="c">` produces. */
async function chartXML(
    doenetML: string,
    options: { theme?: "dark" | "light" } = {},
) {
    return (await getGraphRendererState(doenetML, "c", options)).prefigureXML;
}

const FOUR_BARS = `
    <chart type="bar" name="c" categories="North South East West">
      <shortDescription>Counts by region</shortDescription>
      <number>41</number><number>63</number><number>18</number><number>78</number>
    </chart>
    `;

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

    describe("diagram shape", async () => {
        it("emits one rectangle and one tick mark per bar", async () => {
            const xml = await chartXML(FOUR_BARS);

            expect(xml.match(/<rectangle /g)?.length).eq(4);
            expect(xml.match(/<tick-mark /g)?.length).eq(4);

            // Bars sit at x = 1..4, 0.8 of their slot wide, so the first spans
            // 0.6 to 1.4.
            expect(xml).toContain(
                '<rectangle at="bar-1-1" lower-left="(0.6,0)" dimensions="(0.8,41)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-1-4" lower-left="(3.6,0)" dimensions="(0.8,78)"',
            );
        });

        it("puts the category names on the horizontal axis", async () => {
            const xml = await chartXML(FOUR_BARS);

            // The whole reason this renders through PreFigure: `hlabels` is a
            // numeric (start, step, end) triple and cannot carry names, so the
            // categories go through <tick-mark> instead.
            expect(xml).toContain('<tick-mark axis="horizontal" location="1"');
            expect(xml).toContain(">North</tick-mark>");
            expect(xml).toContain(">West</tick-mark>");
        });

        it("suppresses automatic labels but keeps numeric ones on the vertical axis", async () => {
            const xml = await chartXML(FOUR_BARS);

            // `decorations="no"` switches off the automatic labels on *both*
            // axes; the explicit vlabels brings them back on the vertical one,
            // leaving the horizontal axis to the tick marks.
            expect(xml).toContain('decorations="no"');
            expect(xml).toContain('vlabels="(0,20,80)"');
        });

        it("reserves margins so the axis labels are not clipped", async () => {
            const xml = await chartXML(FOUR_BARS);

            // Both axes sit on the edge of the bounding box, so without
            // margins their labels would fall outside the drawing area. The
            // left one is sized for the widest number the axis carries: this
            // chart is labeled 0 to 80, so two characters.
            expect(xml).toContain('margins="[32,30,12,16]"');

            // The margins are added around `dimensions`, so the inner size is
            // shrunk by them to keep the chart the size that was asked for.
            expect(xml).toContain('dimensions="(381,237.33333333333331)"');
        });

        it("labels in fractions when the bounds are fractions, whole values or not", async () => {
            // The whole-step floor needs whole bounds as well as whole values:
            // a whole step could not reach 0.1 or 0.9, so the axis is labeled
            // in fractions even though every bar is an integer.
            const xml = await chartXML(`
    <chart type="bar" name="c" yMin="0.1" yMax="0.9"><number>1</number></chart>
    `);

            const step = Number(xml.match(/vlabels="\([^,]*,([^,]*),/)?.[1]);
            expect(Number.isInteger(step)).eq(false);
        });

        it("widens the left margin for wider axis numbers", async () => {
            // The bug this exists for: at 46px fixed, a chart of counts in the
            // thousands lost the leading digit of `1,500`, because PreFigure
            // draws the separator too. Ordinary sample sizes, not exotic ones.
            const small = await chartXML(`
    <chart type="bar" name="c"><number>41</number><number>78</number></chart>
    `);
            const large = await chartXML(`
    <chart type="bar" name="c"><number>503</number><number>1064</number></chart>
    `);

            expect(small).toContain('margins="[32,30,12,16]"');
            // Labeled to 1,500 — five characters including the comma.
            expect(large).toContain('margins="[59,30,12,16]"');
        });

        it("measures a fractional label as it is drawn, neither rounded nor noisy", async () => {
            // Two ways to measure the wrong string, and this axis has both.
            // `toLocaleString` rounds to three fraction digits by default, so
            // every tick here measured as the one character `0` while `0.00005`
            // — seven characters — was drawn. Asking for twenty digits instead
            // measures the binary noise that accumulating the step lands on:
            // three steps of `0.00005` reach `0.00015000000000000001`, whose
            // twenty-two characters ask for a margin wider than the chart.
            //
            // So the width is asserted exactly rather than as a lower bound: it
            // is `0.00025`, the widest label actually drawn, and nothing else.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>0.0001</number><number>0.0002</number></chart>
    `);

            expect(xml).toContain('vlabels="(0,0.00005,0.00025)"');
            const margin = Number(xml.match(/margins="\[(\d+),/)?.[1]);
            expect(margin).eq(14 + 9 * 7);

            // And the drawing is the larger part of the chart, not the gutter.
            const width = Number(xml.match(/dimensions="\(([\d.]+),/)?.[1]);
            expect(width).toBeGreaterThan(margin);
        });

        it("measures every tick, since the widest is not always an end one", async () => {
            // Label length is not monotonic in magnitude once the step is
            // fractional: this axis runs from -1 to 1 in halves, so the widest
            // label drawn is `-0.5`, wider than either end.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>-0.9</number><number>0.9</number></chart>
    `);

            expect(xml).toContain('vlabels="(-1,0.5,1)"');
            const margin = Number(xml.match(/margins="\[(\d+),/)?.[1]);
            expect(margin).toBeGreaterThanOrEqual(14 + 9 * 4);
        });

        it("keeps a gutter from swallowing the chart it labels", async () => {
            // The labels of an axis at the top of the double range run to
            // hundreds of characters. Left uncapped, the margin they ask for
            // leaves a drawing one pixel wide inside a chart of gutter.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>1e308</number></chart>
    `);

            const margin = Number(xml.match(/margins="\[([^,]*),/)?.[1]);
            const innerWidth = Number(xml.match(/dimensions="\(([^,]*),/)?.[1]);
            expect(margin).toBeLessThanOrEqual(425 / 2);
            expect(innerWidth).toBeGreaterThan(425 / 4);
        });

        it("leaves a drawing inside the smallest frame a chart can be given", async () => {
            // The vertical margins are fixed pixel counts, and `size="tiny"` is
            // a supported preset 70px wide. Unscaled, its 46.67px frame kept
            // 46px of margin and a plot one pixel tall; with `aspectRatio="2"`
            // the 46px of margin plus that one pixel made a diagram 12px taller
            // than the 35px frame holding it, which the renderer clips.
            for (const { markup, frameHeight } of [
                {
                    markup: `<chart type="bar" name="c" size="tiny"><number>4</number></chart>`,
                    frameHeight: 70 / 1.5,
                },
                {
                    markup: `<chart type="bar" name="c" size="tiny" aspectRatio="2"><number>4</number></chart>`,
                    frameHeight: 70 / 2,
                },
            ]) {
                const xml = await chartXML(markup);

                // `margins` is written left, bottom, right, top.
                const margins = xml
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number)!;
                const [, marginBottom, , marginTop] = margins;
                const innerHeight = Number(
                    xml.match(/dimensions="\([^,]*,([^)]*)\)"/)?.[1],
                );

                expect(innerHeight).toBeGreaterThan(1);
                // The diagram, margins included, fits the frame it was given.
                expect(
                    innerHeight + marginBottom + marginTop,
                ).toBeLessThanOrEqual(frameHeight + 0.01);
            }
        });

        it("draws a diagram the size of its frame at any aspect ratio", async () => {
            // The margins are drawn around `dimensions`, so a diagram whose
            // margins do not fit is bigger than the frame holding it and the
            // renderer clips the difference. An `aspectRatio` of a million asks
            // for a frame a fraction of a pixel tall, which the margins dwarf.
            for (const ratio of ["1000000", "1000", "0.001"]) {
                const xml = await chartXML(
                    `<chart type="bar" name="c" aspectRatio="${ratio}"><number>4</number></chart>`,
                );

                const [marginLeft, marginBottom, marginRight, marginTop] = xml
                    .match(/margins="\[([^\]]*)\]"/)?.[1]
                    .split(",")
                    .map(Number)!;
                const [innerWidth, innerHeight] = xml
                    .match(/dimensions="\(([^)]*)\)"/)?.[1]
                    .split(",")
                    .map(Number)!;

                expect(innerWidth).toBeGreaterThan(0);
                expect(innerHeight).toBeGreaterThan(0);
                expect(innerWidth + marginLeft + marginRight).toBeCloseTo(
                    425,
                    2,
                );
                expect(innerHeight + marginBottom + marginTop).toBeCloseTo(
                    425 / Number(ratio),
                    6,
                );
            }
        });

        it("leaves the usual margins alone on every frame big enough for them", async () => {
            // Only a frame too short for them scales the vertical margins; the
            // sizes an author actually charts with keep the 30 and 16 the
            // layout was designed around.
            for (const size of ["small", "medium", "large", "full"]) {
                const xml = await chartXML(
                    `<chart type="bar" name="c" size="${size}"><number>4</number></chart>`,
                );
                expect(xml).toContain(",30,12,16]");
            }
        });

        it("reserves room for a minus sign on a chart that goes below zero", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>-1200</number><number>400</number></chart>
    `);

            // The negative end is the longest label, so it sets the width.
            const margin = Number(xml.match(/margins="\[(\d+),/)?.[1]);
            expect(margin).toBeGreaterThanOrEqual(59);
        });

        it("draws at the aspect ratio the frame is sized by", async () => {
            // The renderer writes `aspectRatio` straight into CSS on the
            // chart's box while the XML divides the width by it, so the two
            // have to be handed the same number: 425 wide at a ratio of 2 is
            // 212.5 tall, less the 30 + 16 of vertical margin, and 425 less the
            // 23 + 12 of horizontal margin across.
            const { graphState } = await getGraphRendererState(
                `<chart type="bar" name="c" aspectRatio="2"><number>4</number></chart>`,
                "c",
            );
            expect(graphState.aspectRatio).eq(2);
            expect(graphState.prefigureXML).toContain(
                'dimensions="(390,166.5)"',
            );

            // A ratio CSS would reject — zero, negative, or not a number —
            // falls back in the state variable, where the frame sees the same
            // fallback the drawing was built at rather than a box with no
            // height around a drawing of some other shape.
            for (const bad of ["0", "-2", "x"]) {
                const { graphState: fallback } = await getGraphRendererState(
                    `<chart type="bar" name="c" aspectRatio="${bad}"><number>4</number></chart>`,
                    "c",
                );
                expect(fallback.aspectRatio).eq(1.5);
                expect(fallback.prefigureXML).toContain(
                    'dimensions="(390,237.33333333333331)"',
                );
            }
        });

        it("describes every bar in the annotations", async () => {
            const xml = await chartXML(FOUR_BARS);

            expect(xml).toContain(
                '<annotation ref="figure" text="Counts by region">',
            );
            expect(xml).toContain(
                '<annotation ref="bar-1-2" text="South: 63" />',
            );
        });

        it("tells the renderer the annotations are there to be walked", async () => {
            // The PreFigure renderer starts diagcess only when this is set, so
            // the annotations above are unreachable without it. `<graph>` reads
            // it off an authored `<annotations>` child; a chart writes its own.
            const { graphState } = await getGraphRendererState(FOUR_BARS, "c");
            expect(graphState.hasAuthorAnnotations).eq(true);
        });

        it("escapes author text on its way into the XML", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" categories="'a&amp;b' '&lt;c&gt;'">
      <shortDescription>Q &amp; A &lt;here&gt;</shortDescription>
      <number>1</number><number>2</number>
    </chart>
    `);

            expect(xml).toContain(">&apos;a&amp;b&apos;</tick-mark>");
            expect(xml).toContain(">&apos;&lt;c&gt;&apos;</tick-mark>");
            expect(xml).toContain(
                '<annotation ref="bar-1-2" text="&apos;&lt;c&gt;&apos;: 2" />',
            );
            expect(xml).toContain('text="Q &amp; A &lt;here&gt;"');
            // Nothing an author typed reaches the XML as markup.
            expect(xml).not.toContain("<c>");
        });
    });

    describe("vertical scale", async () => {
        it("rounds the top up to the next tick above the tallest bar", async () => {
            // 78 rounds to 80 rather than touching the top of the box.
            expect(await chartXML(FOUR_BARS)).toContain('bbox="(0,0,5,80)"');
        });

        it("never lets the tallest bar reach the top", async () => {
            // 80 is already a multiple of the step, so the box goes one step
            // further rather than clipping the bar against the frame.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>80</number></chart>
    `);
            expect(xml).toContain('bbox="(0,0,2,100)"');
        });

        it("honors an explicit yMax", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" yMax="100"><number>41</number><number>63</number></chart>
    `);
            expect(xml).toContain('bbox="(0,0,3,100)"');
        });

        it("trims the bars to the box when a bound cuts across them", async () => {
            // Every bar is measured from zero, so `yMin="5"` leaves the whole
            // of the bar of 4 and the bar of 2 below the axis, and the lower
            // two thirds of the bar of 9. Unclipped, PreFigure paints those
            // parts outside the frame — over the category labels beneath it
            // and off the bottom of the picture — so the bar geometry stays as
            // the data has it and the drawing is clipped to the box instead.
            const xml = await chartXML(`
    <chart type="bar" name="c" categories="A B C" yMin="5"><number>4</number><number>9</number><number>2</number></chart>
    `);
            expect(xml).toContain('bbox="(0,5,4,10)"');
            // All three bars are still emitted, measured from zero: the axis
            // is what hides two of them, not the geometry.
            expect((xml.match(/<rectangle /g) ?? []).length).eq(3);
            expect(xml).toContain(
                '<rectangle at="bar-1-1" lower-left="(0.6,0)" dimensions="(0.8,4)" cliptobbox="yes"',
            );
            expect((xml.match(/cliptobbox="yes"/g) ?? []).length).eq(3);
        });

        it("gives an empty chart a box one tick tall", async () => {
            // Zeros rather than nothing: an empty chart should read as empty,
            // not as broken.
            const xml = await chartXML(`<chart type="bar" name="c" />`);
            expect(xml).toContain('bbox="(0,0,1,1)"');
            expect(xml).not.toContain("<rectangle ");
        });

        it("drops the floor below zero for a negative value", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>5</number><number>-3</number></chart>
    `);
            // One tick of room past the extremes on both sides.
            expect(xml).toContain('bbox="(0,-4,3,6)"');
            // A negative bar hangs from the axis rather than growing from it.
            expect(xml).toContain(
                '<rectangle at="bar-1-2" lower-left="(1.6,-3)" dimensions="(0.8,3)"',
            );
        });

        it("labels the vertical axis on multiples of the step, including zero", async () => {
            // Anchoring the run at yMin instead would label this chart at
            // -4, -2, 0 ... only by luck; with an odd floor it would never
            // mark the axis the bars are measured from.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>5</number><number>-3</number></chart>
    `);
            expect(xml).toContain('vlabels="(-4,2,6)"');
        });

        it("keeps zero in view when every bar hangs below it", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>-5</number><number>-3</number></chart>
    `);
            // The box is a whole number of ticks in both directions, so the
            // run of labels reaches the top of it and passes through zero.
            expect(xml).toContain('bbox="(0,-6,3,2)"');
            expect(xml).toContain('vlabels="(-6,2,2)"');
        });

        it("settles the tick step against the box, not just the data", async () => {
            // A step chosen from the single bar of height 1 would be 1, and a
            // thousand labels would be written down the axis.
            const xml = await chartXML(`
    <chart type="bar" name="c" yMin="0" yMax="1000"><number>1</number></chart>
    `);
            expect(xml).toContain('bbox="(0,0,2,1000)"');
            expect(xml).toContain('vlabels="(0,200,1000)"');
        });

        it("ignores bounds that leave no room to draw in", async () => {
            // `yMin` at or above `yMax` describes a box with no inside, and an
            // infinite bound describes one with no edge — neither is a box the
            // chart can be drawn in, so the automatic bounds are used instead.
            // An infinity in particular passes the `yMin < yMax` comparison and
            // would otherwise be written into the bounding box as `null`.
            for (const bounds of [
                'yMin="10" yMax="5"',
                'yMin="5" yMax="5"',
                'yMin="-Infinity" yMax="5"',
                'yMax="Infinity"',
            ]) {
                const xml = await chartXML(`
    <chart type="bar" name="c" ${bounds}><number>4</number></chart>
    `);
                expect(xml).toContain('bbox="(0,0,2,5)"');
                expect(xml).not.toContain("null");
            }
        });

        it("anchors the labeled run on multiples of the step, not on the bounds", async () => {
            // A box the author placed off the step ladder: the run still lands
            // on multiples of 20, so every labeled value is a whole number of
            // steps away from zero, the baseline the bars are measured from.
            // Anchoring the run at the bounds instead would label this box at
            // 10, 30, 50, 70, 90.
            const xml = await chartXML(`
    <chart type="bar" name="c" yMin="10" yMax="95"><number>50</number></chart>
    `);
            expect(xml).toContain('bbox="(0,10,2,95)"');
            expect(xml).toContain('vlabels="(20,20,80)"');
        });

        it("labels a chart of fractions in fractions", async () => {
            // The step never drops below 1 for whole numbers, so that counts
            // are not labeled in halves — but proportions are not counts, and
            // a box from 0 to 1 labeled only at its ends says nothing.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>0.35</number><number>0.42</number><number>0.28</number></chart>
    `);
            expect(xml).toContain('bbox="(0,0,4,0.5)"');
            expect(xml).toContain('vlabels="(0,0.1,0.5)"');
        });
    });

    describe("labels and values", async () => {
        it("numbers the bars when no categories are named", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>4</number><number>7</number></chart>
    `);
            expect(xml).toContain(">1</tick-mark>");
            expect(xml).toContain(">2</tick-mark>");
        });

        it("prints the value above each bar when asked", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" displayValues><number>41</number></chart>
    `);
            expect(xml).toContain('<label anchor="(1,41)" alignment="north"');
            expect(xml).toContain(">41</label>");
        });

        it("falls back to the position for a bar with no category name", async () => {
            // There is one bar per value, never per category: extra categories
            // name nothing and are dropped, missing ones leave the bar
            // numbered rather than unlabeled.
            const tooFew = await chartXML(`
    <chart type="bar" name="c" categories="A">
      <number>1</number><number>2</number>
    </chart>
    `);
            expect(tooFew.match(/<tick-mark /g)?.length).eq(2);
            expect(tooFew).toContain(">A</tick-mark>");
            expect(tooFew).toContain(">2</tick-mark>");

            const tooMany = await chartXML(`
    <chart type="bar" name="c" categories="A B C D">
      <number>1</number><number>2</number>
    </chart>
    `);
            expect(tooMany.match(/<tick-mark /g)?.length).eq(2);
            expect(tooMany).toContain(">B</tick-mark>");
            expect(tooMany).not.toContain(">C</tick-mark>");
        });

        it("charts <math> children alongside <number> children, in order", async () => {
            // A `<math>` child arrives as a math-expression rather than a
            // number, so it takes a different path to its value; the two kinds
            // still make one run of bars in the order they were written.
            const xml = await chartXML(`
    <chart type="bar" name="c"><number>1</number><math>7</math><number>3</number></chart>
    `);
            expect(xml).toContain('at="bar-1-1" lower-left="(0.6,0)"');
            expect(xml).toContain('dimensions="(0.8,1)"');
            expect(xml).toContain(
                '<rectangle at="bar-1-2" lower-left="(1.6,0)" dimensions="(0.8,7)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-1-3" lower-left="(2.6,0)" dimensions="(0.8,3)"',
            );
        });

        it("prints a negative bar's value below it", async () => {
            // Not at zero: that is the far end of the bar from the one the
            // number belongs to, and it would sit on the horizontal axis.
            const xml = await chartXML(`
    <chart type="bar" name="c" displayValues><number>-5</number></chart>
    `);
            expect(xml).toContain('<label anchor="(1,-5)" alignment="south"');
            expect(xml).toContain(">-5</label>");
        });

        it("prints no values by default", async () => {
            expect(await chartXML(FOUR_BARS)).not.toContain("<label ");
        });

        it("carries the axis labels", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c">
      <xLabel>region</xLabel>
      <yLabel>count</yLabel>
      <number>4</number>
    </chart>
    `);
            expect(xml).toContain("<xlabel");
            expect(xml).toContain(">region</xlabel>");
            expect(xml).toContain(">count</ylabel>");
        });
    });

    describe("bar width", async () => {
        it("narrows the bars", async () => {
            const xml = await chartXML(`
    <chart type="bar" name="c" barWidth="0.5"><number>4</number></chart>
    `);
            expect(xml).toContain(
                '<rectangle at="bar-1-1" lower-left="(0.75,0)" dimensions="(0.5,4)"',
            );
        });

        it("leaves the same gap at both ends, at any width", async () => {
            // The box used to end half a unit past the last bar's *center*,
            // which is the one place the gap comes out unequal: six times
            // narrower than the leading one at the default width, and zero at
            // `barWidth="1"`, where the last bar sat flush against the frame.
            for (const barWidth of [0.8, 1]) {
                const xml = await chartXML(`
    <chart type="bar" name="c" barWidth="${barWidth}"><number>4</number><number>6</number></chart>
    `);

                const xMax = Number(xml.match(/bbox="\(0,[^,]*,([^,]*),/)?.[1]);
                const lastLeft = Number(
                    xml.match(/at="bar-1-2" lower-left="\(([^,]*),/)?.[1],
                );
                const firstLeft = Number(
                    xml.match(/at="bar-1-1" lower-left="\(([^,]*),/)?.[1],
                );

                expect(xMax - (lastLeft + barWidth)).closeTo(firstLeft, 1e-12);
            }
        });

        it("warns and falls back when the width is not a fraction of a slot", async () => {
            // The range is open at the bottom and closed at the top: a bar may
            // fill its slot, but a bar of no width is not a bar. Both ends are
            // pinned here because the two are easy to describe as one "between
            // 0 and 1" and they do not behave alike.
            for (const barWidth of ["3", "0", "-0.5"]) {
                const { warnings } = await getWarnings(`
    <chart type="bar" name="c" barWidth="${barWidth}"><number>4</number></chart>
    `);
                expect(
                    warnings.some((w) =>
                        w.message.includes("`barWidth` must be greater than 0"),
                    ),
                ).eq(true);
            }

            const { warnings } = await getWarnings(`
    <chart type="bar" name="c" barWidth="1"><number>4</number></chart>
    `);
            expect(
                warnings.some((w) =>
                    w.message.includes("`barWidth` must be greater than 0"),
                ),
            ).eq(false);
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

    describe("values that cannot be drawn", async () => {
        it("draws no bar for a non-finite value, and warns", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c"><number>4</number><math>x</math><number>2</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Two rectangles for three slots, and the drawn ones keep their
            // own positions: the gap is where the symbolic value was.
            expect((xml.match(/<rectangle /g) ?? []).length).eq(2);
            expect(xml).toContain('lower-left="(0.6,0)"');
            expect(xml).toContain('lower-left="(2.6,0)"');
            expect(xml).not.toContain('lower-left="(1.6,0)"');
            // The slot is still counted, so the box is as wide as three bars.
            expect(xml).toContain('bbox="(0,0,4,5)"');
            expect(xml).not.toContain("null");

            const d = getDiagnosticsByType(core);
            expect(d.warnings.map((w) => w.code)).toContain("doenet-w0144");
        });

        it("says nothing when every value is finite", async () => {
            const { core } = await createTestCore({
                doenetML: `
    <chart type="bar"><number>4</number><number>2</number></chart>
    `,
            });
            await core.returnAllStateVariables(false, true);
            expect(getDiagnosticsByType(core).warnings.length).eq(0);
        });

        it("keeps the box finite for values at the top of the double range", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c"><number>1e308</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A step added past 1e308 overflows; the box must still be a box.
            expect(xml).not.toContain("null");
            expect(xml).not.toContain("Infinity");
        });

        it("keeps a stack of such values finite too", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" layout="stacked">
      <series>1e308</series>
      <series>1e308</series>
      <series>5</series>
    </chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const chart = sv[await resolvePathToNodeIdx("c")].stateValues;

            // A stack is a sum, and a sum of finite values need not be finite:
            // two of these overflow, and the third segment then starts from
            // the overflow. The box, the axis labels and every corner have to
            // stay numbers a diagram can be built from.
            expect(chart.prefigureXML).not.toContain("null");
            expect(chart.prefigureXML).not.toContain("Infinity");
            expect(Number.isFinite(chart.yMax)).eq(true);
            expect(chart.yMax).toBeGreaterThan(0);
        });
    });

    describe("extreme numbers stay drawable", async () => {
        it("keeps a category on the axis for a slot with no bar", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c" categories="North South East"><number>4</number><math>x</math><number>2</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // Three ticks for three slots, even though only two have bars:
            // the gap has to read as a missing value, not a missing category.
            expect((xml.match(/<tick-mark /g) ?? []).length).eq(3);
            expect(xml).toContain(">South</tick-mark>");
            expect((xml.match(/<rectangle /g) ?? []).length).eq(2);
        });

        it("does not clip a bar whose value carries floating-point dust", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="c"><number>0.1 + 0.2</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // 0.1 + 0.2 is 0.30000000000000004, which sits just past the 0.3
            // tick; the box has to clear it rather than stop on it.
            const bbox = xml.match(/bbox="\(([^)]*)\)"/)?.[1].split(",");
            expect(Number(bbox?.[3])).toBeGreaterThan(0.30000000000000004);
        });

        it("survives a subnormal aspectRatio and a subnormal value", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <chart type="bar" name="a" aspectRatio="5e-324"><number>4</number></chart>
    <chart type="bar" name="b"><number>5e-324</number></chart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            for (const name of ["a", "b"]) {
                const xml =
                    sv[await resolvePathToNodeIdx(name)].stateValues
                        .prefigureXML;
                expect(xml).not.toContain("null");
                expect(xml).not.toContain("NaN");
                expect(xml).not.toContain("Infinity");
            }
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

        it("prints each value inside its slice", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B C D" displayValues>4 4 4 4</chart>
    `);

            // Four equal slices, so their middles point at the four diagonals
            // and the labels sit six tenths of the way out along each.
            expect((xml.match(/<label /g) ?? []).length).eq(4);
            expect((xml.match(/alignment="center"/g) ?? []).length).eq(4);
            expect(xml).toContain(">4</label>");
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

        it("keeps the slices inside one turn when the total saturates", async () => {
            const xml = await chartXML(`
    <chart type="pie" name="c" categories="A B" legend="false">1e308 1e308</chart>
    `);

            // Two values of 1e308 sum past the top of the double range, and the
            // saturated total makes each of them look like fifty-six percent of
            // it. Held inside the one turn there is, so the slices stay in
            // order and inside the circle rather than wrapping over each other.
            const ranges = [...xml.matchAll(/range="\(([^)]*)\)"/g)].map(
                (match) => match[1].split(",").map(Number),
            );
            expect(ranges.length).eq(2);
            expect(ranges[0][0]).eq(90);
            expect(ranges[1][1]).closeTo(-270, 1e-9);
            for (const [start, end] of ranges) {
                expect(start).greaterThan(end);
            }
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
