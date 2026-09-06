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
    <barChart name="c" categories="North South East West">
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
    <barChart name="c" yMin="0.1" yMax="0.9"><number>1</number></barChart>
    `);

            const step = Number(xml.match(/vlabels="\([^,]*,([^,]*),/)?.[1]);
            expect(Number.isInteger(step)).eq(false);
        });

        it("widens the left margin for wider axis numbers", async () => {
            // The bug this exists for: at 46px fixed, a chart of counts in the
            // thousands lost the leading digit of `1,500`, because PreFigure
            // draws the separator too. Ordinary sample sizes, not exotic ones.
            const small = await chartXML(`
    <barChart name="c"><number>41</number><number>78</number></barChart>
    `);
            const large = await chartXML(`
    <barChart name="c"><number>503</number><number>1064</number></barChart>
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
    <barChart name="c"><number>0.0001</number><number>0.0002</number></barChart>
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
    <barChart name="c"><number>-0.9</number><number>0.9</number></barChart>
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
    <barChart name="c"><number>1e308</number></barChart>
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
                    markup: `<barChart name="c" size="tiny"><number>4</number></barChart>`,
                    frameHeight: 70 / 1.5,
                },
                {
                    markup: `<barChart name="c" size="tiny" aspectRatio="2"><number>4</number></barChart>`,
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

        it("leaves the usual margins alone on every frame big enough for them", async () => {
            // Only a frame too short for them scales the vertical margins; the
            // sizes an author actually charts with keep the 30 and 16 the
            // layout was designed around.
            for (const size of ["small", "medium", "large", "full"]) {
                const xml = await chartXML(
                    `<barChart name="c" size="${size}"><number>4</number></barChart>`,
                );
                expect(xml).toContain(",30,12,16]");
            }
        });

        it("reserves room for a minus sign on a chart that goes below zero", async () => {
            const xml = await chartXML(`
    <barChart name="c"><number>-1200</number><number>400</number></barChart>
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
                `<barChart name="c" aspectRatio="2"><number>4</number></barChart>`,
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
                    `<barChart name="c" aspectRatio="${bad}"><number>4</number></barChart>`,
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
    <barChart name="c" categories="'a&amp;b' '&lt;c&gt;'">
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
            expect(await chartXML(FOUR_BARS)).toContain('bbox="(0,0,5,80)"');
        });

        it("never lets the tallest bar reach the top", async () => {
            // 80 is already a multiple of the step, so the box goes one step
            // further rather than clipping the bar against the frame.
            const xml = await chartXML(`
    <barChart name="c"><number>80</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,2,100)"');
        });

        it("honors an explicit yMax", async () => {
            const xml = await chartXML(`
    <barChart name="c" yMax="100"><number>41</number><number>63</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,3,100)"');
        });

        it("gives an empty chart a box one tick tall", async () => {
            // Zeros rather than nothing: an empty chart should read as empty,
            // not as broken.
            const xml = await chartXML(`<barChart name="c" />`);
            expect(xml).toContain('bbox="(0,0,1,1)"');
            expect(xml).not.toContain("<rectangle ");
        });

        it("drops the floor below zero for a negative value", async () => {
            const xml = await chartXML(`
    <barChart name="c"><number>5</number><number>-3</number></barChart>
    `);
            // One tick of room past the extremes on both sides.
            expect(xml).toContain('bbox="(0,-4,3,6)"');
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
            expect(xml).toContain('bbox="(0,-6,3,2)"');
            expect(xml).toContain('vlabels="(-6,2,2)"');
        });

        it("settles the tick step against the box, not just the data", async () => {
            // A step chosen from the single bar of height 1 would be 1, and a
            // thousand labels would be written down the axis.
            const xml = await chartXML(`
    <barChart name="c" yMin="0" yMax="1000"><number>1</number></barChart>
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
    <barChart name="c" ${bounds}><number>4</number></barChart>
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
    <barChart name="c" yMin="10" yMax="95"><number>50</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,10,2,95)"');
            expect(xml).toContain('vlabels="(20,20,80)"');
        });

        it("labels a chart of fractions in fractions", async () => {
            // The step never drops below 1 for whole numbers, so that counts
            // are not labeled in halves — but proportions are not counts, and
            // a box from 0 to 1 labeled only at its ends says nothing.
            const xml = await chartXML(`
    <barChart name="c"><number>0.35</number><number>0.42</number><number>0.28</number></barChart>
    `);
            expect(xml).toContain('bbox="(0,0,4,0.5)"');
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

        it("falls back to the position for a bar with no category name", async () => {
            // There is one bar per value, never per category: extra categories
            // name nothing and are dropped, missing ones leave the bar
            // numbered rather than unlabeled.
            const tooFew = await chartXML(`
    <barChart name="c" categories="A">
      <number>1</number><number>2</number>
    </barChart>
    `);
            expect(tooFew.match(/<tick-mark /g)?.length).eq(2);
            expect(tooFew).toContain(">A</tick-mark>");
            expect(tooFew).toContain(">2</tick-mark>");

            const tooMany = await chartXML(`
    <barChart name="c" categories="A B C D">
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

        it("leaves the same gap at both ends, at any width", async () => {
            // The box used to end half a unit past the last bar's *center*,
            // which is the one place the gap comes out unequal: six times
            // narrower than the leading one at the default width, and zero at
            // `barWidth="1"`, where the last bar sat flush against the frame.
            for (const barWidth of [0.8, 1]) {
                const xml = await chartXML(`
    <barChart name="c" barWidth="${barWidth}"><number>4</number><number>6</number></barChart>
    `);

                const xMax = Number(xml.match(/bbox="\(0,[^,]*,([^,]*),/)?.[1]);
                const lastLeft = Number(
                    xml.match(/at="bar-2" lower-left="\(([^,]*),/)?.[1],
                );
                const firstLeft = Number(
                    xml.match(/at="bar-1" lower-left="\(([^,]*),/)?.[1],
                );

                expect(xMax - (lastLeft + barWidth)).closeTo(firstLeft, 1e-12);
            }
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

    <barChart name="d" yMin="10" yMax="95" barWidth="3"><number>50</number></barChart>
    <p name="given">$d.yMin, $d.yMax, $d.barWidth</p>

    <barChart name="e" yMin="Infinity"><number>4</number></barChart>
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
    <barChart name="c" categories="$labels">
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

    describe("values that cannot be drawn", async () => {
        it("draws no bar for a non-finite value, and warns", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <barChart name="c"><number>4</number><math>x</math><number>2</number></barChart>
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
    <barChart><number>4</number><number>2</number></barChart>
    `,
            });
            await core.returnAllStateVariables(false, true);
            expect(getDiagnosticsByType(core).warnings.length).eq(0);
        });

        it("keeps the box finite for values at the top of the double range", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <barChart name="c"><number>1e308</number></barChart>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            const xml =
                sv[await resolvePathToNodeIdx("c")].stateValues.prefigureXML;

            // A step added past 1e308 overflows; the box must still be a box.
            expect(xml).not.toContain("null");
            expect(xml).not.toContain("Infinity");
        });
    });

    describe("extreme numbers stay drawable", async () => {
        it("keeps a category on the axis for a slot with no bar", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <barChart name="c" categories="North South East"><number>4</number><math>x</math><number>2</number></barChart>
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
    <barChart name="c"><number>0.1 + 0.2</number></barChart>
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
    <barChart name="a" aspectRatio="5e-324"><number>4</number></barChart>
    <barChart name="b"><number>5e-324</number></barChart>
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
    <barChart name="c" categories="A B C">41 63 18</barChart>
    <p name="p">$c.barValues</p>
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
    <barChart name="c">1/2 3/4</barChart>
    <p name="p">$c.barValues</p>
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
    <barChart name="c">4 <number>9</number> 2</barChart>
    <p name="p">$c.barValues</p>
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            expect(sv[await resolvePathToNodeIdx("p")].stateValues.text).eq(
                "4, 9, 2",
            );
        });
    });
});
