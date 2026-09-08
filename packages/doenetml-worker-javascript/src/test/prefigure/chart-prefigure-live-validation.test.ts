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
                {
                    doenetML: `
    <chart type="scatter" name="c">
      <shortDescription>Height against weight</shortDescription>
      <xLabel>height</xLabel>
      <yLabel>weight</yLabel>
      <series x="1.5 2.5 3.5 4.5"><label>control</label>4 9 2 7</series>
      <series x="1.5 2.5 3.5 4.5"><label>treated</label>6 1 5 3</series>
    </chart>`,
                    expectText: "scatter (two series, numeric axes)",
                },
                {
                    doenetML: `
    <chart type="line" name="c" categories="North South East West">
      <title>Population by region</title>
      <series><label>2024</label>41 63 18 78</series>
    </chart>`,
                    expectText: "line (categorical axis)",
                },
                {
                    doenetML: `
    <chart type="line" name="c" markers="false">
      <series x="1 2 3 4 5">4 9 2 7 3</series>
    </chart>`,
                    expectText: "line (numeric axis, no markers)",
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
            for (const [label, size] of [
                ["WWWWWW", "large"],
                ["llllll", "large"],
                ["Q1", "large"],
                ["Population 2024", "large"],
                ["Wm. & Mary (VA)", "large"],
                // Labels wide enough that the margin `fitMargins` allows can no
                // longer hold the box. These were drawn 14 to 41px past the
                // right edge of the picture before the anchor was pulled in.
                ["Population 2024 AB", "small"],
                ["Northern Territory 2024", "small"],
                ["a fairly long series label here indeed ok", "medium"],
                // Glyphs the width classes had in the wrong bin. `%` is
                // 11.9px and `&` 10.3px — wider than any lowercase letter —
                // and `|` is 7.7px, not the hairline it looks like. Reserved
                // at the lowercase width, `%%%%%%` was drawn 12.6px outside
                // the picture.
                ["%%%%%%", "large"],
                ["&&&&&&", "large"],
                ["||||||", "large"],
                ["######", "large"],
                ["OCTOBER TOTALS", "large"],
            ] as [string, string][]) {
                // Both key shapes: a bar's legend key is a swatch of fill, a
                // line's is a segment of stroke and 14px wider, and the margin
                // is reserved from an estimate that has to know which.
                for (const chartType of ["bar", "line"]) {
                    const prefigureXML = await getPrefigureXML(
                        `<chart type="${chartType}" name="c" categories="A B" size="${size}">
                       <series><label>${label}</label>4 9</series>
                       <series><label>${label} II</label>6 1</series>
                     </chart>`,
                        "c",
                    );
                    const result =
                        await validatePrefigureXMLAgainstBuildService(
                            prefigureXML,
                        );
                    expect(
                        result.ok,
                        `${label}/${chartType}: build failed`,
                    ).toBe(true);

                    const svg: string = result.body?.svg ?? "";
                    const pictureWidth = Number(
                        svg.match(/<svg[^>]*width="([\d.]+)"/)?.[1],
                    );
                    // `legend.py` draws the box as a rect at the origin of a
                    // translated group, stroked and filled white.
                    const box = svg.match(
                        /transform="translate\(([-\d.]+),([-\d.]+)\)[^"]*"[^>]*>\s*<rect x="0" y="0" width="([\d.]+)"[^>]*stroke="currentColor" fill="white"/,
                    );
                    expect(
                        box,
                        `${label}/${chartType}: no legend box drawn`,
                    ).toBeTruthy();

                    const gap =
                        pictureWidth - (Number(box![1]) + Number(box![3]));
                    // Inside the picture, always. This is the assertion that
                    // matters: a box drawn past the edge is clipped, and the SVG
                    // gives no sign of it.
                    expect(
                        gap,
                        `${label}/${chartType}: legend is clipped`,
                    ).toBeGreaterThan(0);

                    // And not wasting width, for labels short enough that the
                    // estimate is close. The estimate is a sum of per-character
                    // classes, so its error grows with the label: it is within a
                    // pixel or two of a short one and around 25px over a
                    // forty-character one, and that surplus becomes gap. Bounding
                    // the long ones here would only pin the estimate's error.
                    if (label.length <= 15) {
                        expect(
                            gap,
                            `${label}/${chartType}: legend leaves too much width unused`,
                        ).toBeLessThan(30);
                    }
                }
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: an outsideBottom legend is drawn inside the picture",
        async () => {
            // The margin reserves room from an estimate of the box's height,
            // and `fitMargins` then caps the margin without the box shrinking
            // with it. Anchored at a fixed distance under the axis, the legend
            // ran off the bottom of the picture from four named series on a
            // small chart, and by 70px at eight. Only the rendered SVG says
            // how tall the box really came out, so it is measured here.
            for (const size of ["small", "medium"]) {
                for (const count of [2, 4, 6, 8]) {
                    const series = Array.from(
                        { length: count },
                        (_unused, index) =>
                            `<series><label>s${index + 1}</label>${index + 1}</series>`,
                    ).join("");
                    const prefigureXML = await getPrefigureXML(
                        `<chart type="bar" name="c" size="${size}" legendPosition="outsideBottom" categories="A">${series}</chart>`,
                        "c",
                    );
                    const result =
                        await validatePrefigureXMLAgainstBuildService(
                            prefigureXML,
                        );
                    expect(result.ok, `${size}/${count}: build failed`).toBe(
                        true,
                    );

                    const svg: string = result.body?.svg ?? "";
                    const pictureHeight = Number(
                        svg.match(/<svg[^>]*height="([\d.]+)"/)?.[1],
                    );
                    const box = svg.match(
                        /transform="translate\(([-\d.]+),([-\d.]+)\)[^"]*"[^>]*>\s*<rect x="0" y="0" width="([\d.]+)" height="([\d.]+)"[^>]*stroke="currentColor" fill="white"/,
                    );
                    expect(
                        box,
                        `${size}/${count}: no legend box drawn`,
                    ).toBeTruthy();

                    const bottom = Number(box![2]) + Number(box![4]);
                    expect(
                        pictureHeight - bottom,
                        `${size}/${count}: legend is clipped at the bottom`,
                    ).toBeGreaterThan(0);
                    expect(
                        Number(box![2]),
                        `${size}/${count}: legend is clipped at the top`,
                    ).toBeGreaterThanOrEqual(0);
                }
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: a chart drawn below or left of zero keeps its axis labels inside the picture",
        async () => {
            // PreFigure moves an axis to the frame *past* the data when the
            // data lies entirely at or below zero (`axes.py`, `position_axes`):
            // the horizontal axis and its labels go to the top of the box, and
            // the vertical axis and its numbers to the right. Which margin has
            // to hold them therefore depends on the data, and getting it wrong
            // is invisible in the XML — the labels are simply drawn past the
            // edge of the SVG, where the browser does not paint them. A scatter
            // of negative `x` had *every* number on its vertical axis outside
            // the picture, and one of negative values had the numbers on its
            // horizontal axis cut in half by the top edge.
            for (const [what, doenetML] of [
                [
                    "below zero",
                    `<chart type="scatter" name="c"><series x="1 2 3">-400 -900 -200</series></chart>`,
                ],
                [
                    "below zero, titled",
                    `<chart type="scatter" name="c"><title>Losses by quarter</title><series x="1 2 3">-400 -900 -200</series></chart>`,
                ],
                [
                    "below zero, under categories",
                    `<chart type="line" name="c" categories="Mon Tue Wed">-4 -9 -2</chart>`,
                ],
                [
                    "left of zero",
                    `<chart type="scatter" name="c"><series x="-1 -2 -3">400 900 200</series></chart>`,
                ],
                [
                    "left of zero, with a legend",
                    `<chart type="scatter" name="c"><series x="-1 -2 -3"><label>Population 2024</label>400 900 200</series><series x="-1 -2 -3"><label>Population 2025</label>450 950 250</series></chart>`,
                ],
                [
                    "below and left of zero",
                    `<chart type="scatter" name="c"><series x="-1 -2 -3">-400 -900 -200</series></chart>`,
                ],
            ] as [string, string][]) {
                const prefigureXML = await getPrefigureXML(doenetML, "c");
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${what}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const picture = svg.match(
                    /<svg[^>]*width="([\d.]+)"[^>]*height="([\d.]+)"/,
                );
                expect(picture, `${what}: no picture`).toBeTruthy();
                const pictureWidth = Number(picture![1]);
                const pictureHeight = Number(picture![2]);

                // An axis number is a `<label>` PreFigure hands to MathJax, so
                // it reaches the SVG as a group translated to the tick and then
                // back by half the laid-out size, wrapping an inner `<svg>`
                // that carries that size. A category name is a `<tick-mark>`
                // and reaches it as plain `<text>`, whose drawn width the SVG
                // does not record — so those are measured vertically only,
                // which is the direction they were clipped in.
                const measured = [
                    ...svg.matchAll(
                        /<g id="[^"]*?__label-\d+" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"[^>]*>\s*<g[^>]*>\s*<svg[^>]*width="([\d.]+)px" height="([\d.]+)px"/g,
                    ),
                ].map((label) => ({
                    left: Number(label[1]) + Number(label[3]),
                    top: Number(label[2]) + Number(label[4]),
                    width: Number(label[5]),
                    height: Number(label[6]),
                    what:
                        svg
                            .slice(label.index)
                            .match(/data-semantic-speech="([^"]*)"/)?.[1] ?? "",
                }));
                const named = [
                    ...svg.matchAll(
                        /<g id="[^"]*?__tick-mark-\d+" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"[^>]*>\s*<g[^>]*>\s*<text[^>]*font-size="([\d.]+)"[^>]*>([^<]*)</g,
                    ),
                ].map((tick) => ({
                    left: 0,
                    top: Number(tick[2]) + Number(tick[4]),
                    width: 0,
                    height: Number(tick[5]),
                    what: tick[6],
                }));

                expect(
                    measured.length + named.length,
                    `${what}: no axis labels drawn`,
                ).toBeGreaterThan(0);

                for (const label of [...measured, ...named]) {
                    expect(
                        label.left,
                        `${what}: "${label.what}" starts outside the picture`,
                    ).toBeGreaterThan(-0.5);
                    expect(
                        label.left + label.width,
                        `${what}: "${label.what}" ends outside the picture`,
                    ).toBeLessThan(pictureWidth + 0.5);
                    expect(
                        label.top,
                        `${what}: "${label.what}" sits above the picture`,
                    ).toBeGreaterThan(-0.5);
                    expect(
                        label.top + label.height,
                        `${what}: "${label.what}" sits below the picture`,
                    ).toBeLessThan(pictureHeight + 0.5);
                }
            }
        },
    );
});
