import { describe, expect, it, vi } from "vitest";
import { getGraphRendererState, getWarnings } from "./graph-prefigure.helpers";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** The PreFigure XML `<barChart name="c">` produces. */
async function chartXML(
    doenetML: string,
    options: { theme?: "dark" | "light" } = {},
) {
    return (await getGraphRendererState(doenetML, "c", options)).prefigureXML;
}

const FOUR_BARS = `
    <barChart name="c" categories="North South East West" type="text">
      <shortDescription>Counts by region</shortDescription>
      <number>41</number><number>63</number><number>18</number><number>78</number>
    </barChart>
    `;

describe("barChart prefigure tests @group4", async () => {
    describe("diagram shape", async () => {
        it("emits one rectangle and one tick mark per bar", async () => {
            const xml = await chartXML(FOUR_BARS);

            expect(xml.match(/<rectangle /g)?.length).eq(4);
            expect(xml.match(/<tick-mark /g)?.length).eq(4);

            // Bars sit at x = 1..4, 0.8 of their slot wide, so the first spans
            // 0.6 to 1.4.
            expect(xml).toContain(
                '<rectangle at="bar-1" lower-left="(0.6,0)" dimensions="(0.8,41)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-4" lower-left="(3.6,0)" dimensions="(0.8,78)"',
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
            // margins their labels would fall outside the drawing area.
            expect(xml).toContain('margins="[46,30,12,16]"');

            // The margins are added around `dimensions`, so the inner size is
            // shrunk by them to keep the chart the size that was asked for.
            expect(xml).toContain('dimensions="(367,237.33333333333331)"');
        });

        it("draws at the aspect ratio the frame is sized by", async () => {
            // The renderer writes `aspectRatio` straight into CSS on the
            // chart's box while the XML divides the width by it, so the two
            // have to be handed the same number: 425 wide at a ratio of 2 is
            // 212.5 tall, less the 30 + 16 of vertical margin.
            const { graphState } = await getGraphRendererState(
                `<barChart name="c" aspectRatio="2"><number>4</number></barChart>`,
                "c",
            );
            expect(graphState.aspectRatio).eq(2);
            expect(graphState.prefigureXML).toContain(
                'dimensions="(367,166.5)"',
            );

            // A ratio CSS would reject — zero, negative, or not a number —
            // falls back in the state variable, where the frame sees the same
            // fallback the drawing was built at rather than a box with no
            // height around a drawing of some other shape.
            for (const bad of ["0", "-2", "x"]) {
                const { graphState: fallback } = await getGraphRendererState(
                    `<barChart name="c" aspectRatio="${bad}"><number>4</number></barChart>`,
                    "c",
                );
                expect(fallback.aspectRatio).eq(1.5);
                expect(fallback.prefigureXML).toContain(
                    'dimensions="(367,237.33333333333331)"',
                );
            }
        });

        it("describes every bar in the annotations", async () => {
            const xml = await chartXML(FOUR_BARS);

            expect(xml).toContain(
                '<annotation ref="figure" text="Counts by region">',
            );
            expect(xml).toContain(
                '<annotation ref="bar-2" text="South: 63" />',
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
    <barChart name="c" categories="'a&amp;b' '&lt;c&gt;'" type="text">
      <shortDescription>Q &amp; A &lt;here&gt;</shortDescription>
      <number>1</number><number>2</number>
    </barChart>
    `);

            expect(xml).toContain(">&apos;a&amp;b&apos;</tick-mark>");
            expect(xml).toContain(">&apos;&lt;c&gt;&apos;</tick-mark>");
            expect(xml).toContain(
                '<annotation ref="bar-2" text="&apos;&lt;c&gt;&apos;: 2" />',
            );
            expect(xml).toContain('text="Q &amp; A &lt;here&gt;"');
            // Nothing an author typed reaches the XML as markup.
            expect(xml).not.toContain("<c>");
        });
    });

    describe("vertical scale", async () => {
        it("rounds the top up to the next tick above the tallest bar", async () => {
            // 78 rounds to 80 rather than touching the top of the box.
            expect(await chartXML(FOUR_BARS)).toContain('bbox="(0,0,4.5,80)"');
        });

        it("never lets the tallest bar reach the top", async () => {
            // 80 is already a multiple of the step, so the box goes one step
            // further rather than clipping the bar against the frame.
            const xml = await chartXML(`
    <barChart name="c"><number>80</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,1.5,100)"');
        });

        it("honors an explicit yMax", async () => {
            const xml = await chartXML(`
    <barChart name="c" yMax="100"><number>41</number><number>63</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,2.5,100)"');
        });

        it("gives an empty chart a box one tick tall", async () => {
            // Zeros rather than nothing: an empty chart should read as empty,
            // not as broken.
            const xml = await chartXML(`<barChart name="c" />`);
            expect(xml).toContain('bbox="(0,0,0.5,1)"');
            expect(xml).not.toContain("<rectangle ");
        });

        it("drops the floor below zero for a negative value", async () => {
            const xml = await chartXML(`
    <barChart name="c"><number>5</number><number>-3</number></barChart>
    `);
            // One tick of room past the extremes on both sides.
            expect(xml).toContain('bbox="(0,-4,2.5,6)"');
            // A negative bar hangs from the axis rather than growing from it.
            expect(xml).toContain(
                '<rectangle at="bar-2" lower-left="(1.6,-3)" dimensions="(0.8,3)"',
            );
        });

        it("labels the vertical axis on multiples of the step, including zero", async () => {
            // Anchoring the run at yMin instead would label this chart at
            // -4, -2, 0 ... only by luck; with an odd floor it would never
            // mark the axis the bars are measured from.
            const xml = await chartXML(`
    <barChart name="c"><number>5</number><number>-3</number></barChart>
    `);
            expect(xml).toContain('vlabels="(-4,2,6)"');
        });

        it("keeps zero in view when every bar hangs below it", async () => {
            const xml = await chartXML(`
    <barChart name="c"><number>-5</number><number>-3</number></barChart>
    `);
            // The box is a whole number of ticks in both directions, so the
            // run of labels reaches the top of it and passes through zero.
            expect(xml).toContain('bbox="(0,-6,2.5,2)"');
            expect(xml).toContain('vlabels="(-6,2,2)"');
        });

        it("settles the tick step against the box, not just the data", async () => {
            // A step chosen from the single bar of height 1 would be 1, and a
            // thousand labels would be written down the axis.
            const xml = await chartXML(`
    <barChart name="c" yMin="0" yMax="1000"><number>1</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,1.5,1000)"');
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
    <barChart name="c" ${bounds}><number>4</number></barChart>
    `);
                expect(xml).toContain('bbox="(0,0,1.5,5)"');
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
    <barChart name="c" yMin="10" yMax="95"><number>50</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,10,1.5,95)"');
            expect(xml).toContain('vlabels="(20,20,80)"');
        });

        it("labels a chart of fractions in fractions", async () => {
            // The step never drops below 1 for whole numbers, so that counts
            // are not labeled in halves — but proportions are not counts, and
            // a box from 0 to 1 labeled only at its ends says nothing.
            const xml = await chartXML(`
    <barChart name="c"><number>0.35</number><number>0.42</number><number>0.28</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,3.5,0.5)"');
            expect(xml).toContain('vlabels="(0,0.1,0.5)"');
        });
    });

    describe("labels and values", async () => {
        it("numbers the bars when no categories are named", async () => {
            const xml = await chartXML(`
    <barChart name="c"><number>4</number><number>7</number></barChart>
    `);
            expect(xml).toContain(">1</tick-mark>");
            expect(xml).toContain(">2</tick-mark>");
        });

        it("prints the value above each bar when asked", async () => {
            const xml = await chartXML(`
    <barChart name="c" displayValues><number>41</number></barChart>
    `);
            expect(xml).toContain('<label anchor="(1,41)" alignment="north"');
            expect(xml).toContain(">41</label>");
        });

        it("falls back to the position for a bar no category names", async () => {
            // There is one bar per value, never per category: extra categories
            // name nothing and are dropped, missing ones leave the bar
            // numbered rather than unlabeled.
            const tooFew = await chartXML(`
    <barChart name="c" categories="A" type="text">
      <number>1</number><number>2</number>
    </barChart>
    `);
            expect(tooFew.match(/<tick-mark /g)?.length).eq(2);
            expect(tooFew).toContain(">A</tick-mark>");
            expect(tooFew).toContain(">2</tick-mark>");

            const tooMany = await chartXML(`
    <barChart name="c" categories="A B C D" type="text">
      <number>1</number><number>2</number>
    </barChart>
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
    <barChart name="c"><number>1</number><math>7</math><number>3</number></barChart>
    `);
            expect(xml).toContain('at="bar-1" lower-left="(0.6,0)"');
            expect(xml).toContain('dimensions="(0.8,1)"');
            expect(xml).toContain(
                '<rectangle at="bar-2" lower-left="(1.6,0)" dimensions="(0.8,7)"',
            );
            expect(xml).toContain(
                '<rectangle at="bar-3" lower-left="(2.6,0)" dimensions="(0.8,3)"',
            );
        });

        it("prints a negative bar's value below it", async () => {
            // Not at zero: that is the far end of the bar from the one the
            // number belongs to, and it would sit on the horizontal axis.
            const xml = await chartXML(`
    <barChart name="c" displayValues><number>-5</number></barChart>
    `);
            expect(xml).toContain('<label anchor="(1,-5)" alignment="south"');
            expect(xml).toContain(">-5</label>");
        });

        it("prints no values by default", async () => {
            expect(await chartXML(FOUR_BARS)).not.toContain("<label ");
        });

        it("carries the axis labels", async () => {
            const xml = await chartXML(`
    <barChart name="c">
      <xLabel>region</xLabel>
      <yLabel>count</yLabel>
      <number>4</number>
    </barChart>
    `);
            expect(xml).toContain("<xlabel");
            expect(xml).toContain(">region</xlabel>");
            expect(xml).toContain(">count</ylabel>");
        });
    });

    describe("bar width", async () => {
        it("narrows the bars", async () => {
            const xml = await chartXML(`
    <barChart name="c" barWidth="0.5"><number>4</number></barChart>
    `);
            expect(xml).toContain(
                '<rectangle at="bar-1" lower-left="(0.75,0)" dimensions="(0.5,4)"',
            );
        });

        it("warns and falls back when the width is not a fraction of a slot", async () => {
            const { warnings } = await getWarnings(`
    <barChart name="c" barWidth="3"><number>4</number></barChart>
    `);
            expect(
                warnings.some((w) =>
                    w.message.includes("`barWidth` must be greater than 0"),
                ),
            ).eq(true);
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
    <p name="pv">$c.barValues</p>
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
    });

    describe("accessibility", async () => {
        it("asks for a short description when there is none", async () => {
            const { core } = await createTestCore({
                doenetML: `<barChart name="c"><number>4</number></barChart>`,
            });
            await core.returnAllStateVariables(false, true);
            const { accessibility } = getDiagnosticsByType(core);
            expect(
                accessibility.some((a) => a.message.includes("barChart")),
            ).eq(true);
        });

        it("stays quiet for a decorative chart", async () => {
            const { core } = await createTestCore({
                doenetML: `<barChart name="c" decorative><number>4</number></barChart>`,
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
    <barChart name="c" categories="$labels" type="text">
      <shortDescription>Sampled counts</shortDescription>
      $counts
    </barChart>
    `);

            // counts are 3, 1, 2, 2
            expect(xml).toContain('dimensions="(0.8,3)"');
            expect(xml).toContain('<annotation ref="bar-1" text="North: 3" />');
            expect(xml).toContain('<annotation ref="bar-4" text="West: 2" />');
        });
    });
});
