import { describe, expect, it } from "vitest";
import {
    RUN_LIVE_PREFIGURE_VALIDATION,
    getPrefigureXML,
    validatePrefigureXMLAgainstBuildService,
} from "./graph-prefigure.helpers";

/**
 * What a Vitest assertion on the generated XML cannot tell us: whether PreFigure
 * accepts it. `<legend>` and a scaled `<label>` are emitted by `<chart>` and by
 * nothing else in the worker, and no other live-validation case compiles the
 * `<group>` a chart nests its series in. A legend in particular is assembled in Python out
 * of the elements its items point at — so an item referring to a handle that
 * does not exist, or to one whose element carries no `fill`, is a drawing with a
 * piece missing rather than a compile error the tests below would catch.
 *
 * Opt-in, like the graph's: it posts to a live build service, so it is off by
 * default and run with `RUN_LIVE_PREFIGURE_VALIDATION=1`.
 */
describe("Chart prefigure renderer live validation @group4", () => {
    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: build service accepts generated XML for the chart types",
        async () => {
            const cases = [
                {
                    doenetML: `
    <chart type="bar" name="c" categories="North South East West" displayValues>
      <shortDescription>Population by region</shortDescription>
      <yLabel>people</yLabel>
      41 63 18 78
    </chart>`,
                    expectText: "bar (one implicit series)",
                },
                {
                    doenetML: `
    <chart type="bar" name="c" categories="North South East West" displayValues>
      <title>Population by region</title>
      <shortDescription>Population by region, 2024 against 2025</shortDescription>
      <yLabel>people</yLabel>
      <series><label>2024</label>41 63 18 78</series>
      <series><label>2025</label>45 60 22 80</series>
    </chart>`,
                    expectText: "bar (grouped, titled, with a legend)",
                },
                {
                    doenetML: `
    <chart type="bar" name="c" layout="stacked" categories="A B" legendPosition="lowerLeft">
      <series><label>up</label>4 9</series>
      <series><label>down</label>-3 2</series>
    </chart>`,
                    expectText: "bar (stacked, mixed signs)",
                },
            ];

            for (const c of cases) {
                const prefigureXML = await getPrefigureXML(c.doenetML, "c");

                expect(typeof prefigureXML).eq("string");

                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);

                expect(
                    result.ok,
                    `${c.expectText}: Prefigure build failed: status=${result.status}, body=${JSON.stringify(
                        result.body,
                    )}`,
                ).toBe(true);
                expect(
                    result.body?.svg,
                    `${c.expectText}: missing svg`,
                ).toBeTruthy();
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: an outsideRight legend is drawn inside the picture",
        async () => {
            // The one thing the generated XML cannot say: how wide PreFigure
            // actually draws the labels. The margin is reserved from an
            // estimate, and an estimate that comes out under is a legend drawn
            // past the right edge of the SVG and clipped — which is what a
            // legend labeled `WWWWWW` was, by 5px, when the margin was reserved
            // from a character count. So the box is measured here rather than
            // predicted, across labels chosen to be much wider and much
            // narrower than their length suggests.
            for (const label of [
                "WWWWWW",
                "llllll",
                "Q1",
                "Population 2024",
                "Wm. & Mary (VA)",
            ]) {
                const prefigureXML = await getPrefigureXML(
                    `<chart type="bar" name="c" categories="A B" size="large">
                       <series><label>${label}</label>4 9</series>
                       <series><label>${label} II</label>6 1</series>
                     </chart>`,
                    "c",
                );
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${label}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const pictureWidth = Number(
                    svg.match(/<svg[^>]*width="([\d.]+)"/)?.[1],
                );
                // `legend.py` draws the box as a rect at the origin of a
                // translated group, stroked and filled white.
                const box = svg.match(
                    /transform="translate\(([-\d.]+),([-\d.]+)\)[^"]*"[^>]*>\s*<rect x="0" y="0" width="([\d.]+)"[^>]*stroke="currentColor" fill="white"/,
                );
                expect(box, `${label}: no legend box drawn`).toBeTruthy();

                const gap = pictureWidth - (Number(box![1]) + Number(box![3]));
                // Inside the picture, and not by so much that the width is
                // being wasted: the margin reserves an 8px gap, and whatever
                // the estimate came out over is added to it.
                expect(gap, `${label}: legend is clipped`).toBeGreaterThan(0);
                expect(
                    gap,
                    `${label}: legend leaves too much width unused`,
                ).toBeLessThan(30);
            }
        },
    );
});
