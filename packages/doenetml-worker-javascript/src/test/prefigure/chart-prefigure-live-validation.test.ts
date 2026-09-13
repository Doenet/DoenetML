import { describe, expect, it } from "vitest";
import {
    RUN_LIVE_PREFIGURE_VALIDATION,
    getPrefigureXML,
    validatePrefigureXMLAgainstBuildService,
} from "./graph-prefigure.helpers";
import { escapeXml } from "../../utils/prefigure/common";

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
                {
                    doenetML: `
    <chart type="pie" name="c" categories="North South East West">
      <title>Population by region</title>
      <shortDescription>Population by region</shortDescription>
      41 63 18 78
    </chart>`,
                    expectText: "pie (titled, slices named in the legend)",
                },
                {
                    doenetML: `
    <chart type="pie" name="c" categories="North South East West" legend="false" displayValues>
      <shortDescription>Population by region</shortDescription>
      41 63 18 78
    </chart>`,
                    expectText: "pie (slices named around the rim)",
                },
                {
                    doenetML: `
    <chart type="pie" name="c" categories="Everything">
      <shortDescription>All of it</shortDescription>
      5
    </chart>`,
                    expectText: "pie (one value, a full turn)",
                },
                {
                    doenetML: `
    <chart type="box" name="c">
      <shortDescription>Scores in one section</shortDescription>
      <yLabel>score</yLabel>
      52 61 63 68 70 71 75 78 84 91
    </chart>`,
                    expectText: "box (one implicit series)",
                },
                {
                    doenetML: `
    <chart type="box" name="c">
      <title>Scores by section</title>
      <shortDescription>Scores by section</shortDescription>
      <yLabel>score</yLabel>
      <series><label>morning</label>52 61 63 68 70 71 75 78 84 91</series>
      <series><label>afternoon</label>44 55 58 60 62 65 66 70 72 96</series>
      <series><label>evening</label>60 62 64 65 66 68 70</series>
    </chart>`,
                    expectText: "box (three series, titled, one outlier)",
                },
                {
                    doenetML: `
    <chart type="box" name="c">
      <shortDescription>One observation, and a group with none</shortDescription>
      <series><label>A</label>5</series>
      <series><label>B</label></series>
    </chart>`,
                    expectText:
                        "box (a box of no height, and an empty position)",
                },
                {
                    doenetML: `
    <chart type="box" name="c" yMin="60" yMax="70">
      <shortDescription>Bounded below the data</shortDescription>
      <series><label>A</label>44 55 58 60 62 65 66 70 72 96</series>
    </chart>`,
                    expectText:
                        "box (bounds that cut the box and its whiskers)",
                },
                {
                    doenetML: `
    <chart type="histogram" name="c" displayValues>
      <shortDescription>Ten observations</shortDescription>
      <xLabel>height</xLabel>
      <yLabel>how many</yLabel>
      <series><label>heights</label>2 3 3 4 4 4 5 5 6 9</series>
    </chart>`,
                    expectText:
                        "histogram (bins chosen from the data, with a legend)",
                },
                {
                    doenetML: `
    <chart type="histogram" name="c" bins="0 5 10 20">
      <title>Scores</title>
      <shortDescription>Scores in uneven bands</shortDescription>
      1 2 3 4 5 6 7 8 9 11 12
    </chart>`,
                    expectText:
                        "histogram (cut points of differing widths, one empty bin)",
                },
                {
                    doenetML: `
    <chart type="histogram" name="c" bins="3" xMin="-5" xMax="20">
      <shortDescription>Bounds wider than the bins</shortDescription>
      2 3 3 4 4 4 5 5 6 9
    </chart>`,
                    expectText: "histogram (an axis wider than its bars)",
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

            // A pie's legend names its slices rather than its series, so the
            // long text is a category and the markup is a different shape —
            // but the box is reserved and placed by the same code, and its
            // margin is measured against a drawing area no axis numbers take a
            // share of. Single words only: `categories` is a `textList`, which
            // splits on whitespace.
            for (const [label, size] of [
                ["WWWWWW", "large"],
                ["%%%%%%", "large"],
                ["Renewables", "small"],
                ["Photovoltaicgeneration", "small"],
            ] as [string, string][]) {
                const prefigureXML = await getPrefigureXML(
                    `<chart type="pie" name="c" size="${size}" categories="${label} ${label}x">1 1</chart>`,
                    "c",
                );
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${label}/pie: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const pictureWidth = Number(
                    svg.match(/<svg[^>]*width="([\d.]+)"/)?.[1],
                );
                const box = svg.match(
                    /transform="translate\(([-\d.]+),([-\d.]+)\)[^"]*"[^>]*>\s*<rect x="0" y="0" width="([\d.]+)"[^>]*stroke="currentColor" fill="white"/,
                );
                expect(box, `${label}/pie: no legend box drawn`).toBeTruthy();

                expect(
                    pictureWidth - (Number(box![1]) + Number(box![3])),
                    `${label}/pie: legend is clipped`,
                ).toBeGreaterThan(0);
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
                    "box below zero",
                    `<chart type="box" name="c"><series><label>A</label>-400 -900 -200 -350 -500</series></chart>`,
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

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: an axis' name stays inside the plot when its axis moves to the far frame",
        async () => {
            // `<xlabel>` is anchored at the right end of the horizontal axis and
            // `<ylabel>` at the top of the vertical one (`apply_axis_labels`,
            // `axes.py`), and the alignment decides which way each is drawn from
            // there. Against the far frames the old alignments drew them out of
            // the plot: a `<yLabel>` ran 78px past the right edge of a 425px
            // picture, where the browser does not paint it, and an `<xLabel>`
            // landed on the numbers of its own axis. Neither is visible in the
            // XML, so both are measured here.
            //
            // An axis' name is plain `<text>`, whose drawn width the SVG does
            // not record. PreFigure lays a label out as `translate(anchor)
            // translate(width*dx, -height*dy)`, so the second translate gives
            // the width away only for the alignments with `dx != 0` — which is
            // the answer here but not the question. The width is taken instead
            // off a control render, where the same string is drawn `nw` at the
            // same size and its width *is* the second translate.
            const NAME = "weight in kilograms";
            /** Height of one line of an axis name, measured on the control. */
            const LINE = 14;

            const nameBoxes = (svg: string) =>
                [
                    ...svg.matchAll(
                        /<g id="[^"]*?__label-\d+" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"[^>]*>\s*<g[^>]*>\s*<text[^>]*>([^<]*)</g,
                    ),
                ]
                    .filter((name) => name[5] === NAME)
                    .map((name) => ({
                        shift: Number(name[3]),
                        left: Number(name[1]) + Number(name[3]),
                        top: Number(name[2]) + Number(name[4]),
                    }));

            const control = await validatePrefigureXMLAgainstBuildService(
                await getPrefigureXML(
                    `<chart type="scatter" name="c"><xLabel>${NAME}</xLabel><series x="1 2 3">4 9 2</series></chart>`,
                    "c",
                ),
            );
            expect(control.ok, "control build failed").toBe(true);
            const [drawnNw] = nameBoxes(control.body?.svg ?? "");
            expect(drawnNw, "control: axis name not found").toBeTruthy();
            // `nw` is `dx = -1`, so the shift is the width itself.
            const width = -drawnNw.shift;
            expect(width, "control: axis name has no width").toBeGreaterThan(
                50,
            );

            for (const [what, doenetML, expected] of [
                [
                    "left of zero",
                    `<chart type="scatter" name="c"><yLabel>${NAME}</yLabel><series x="-1 -2 -3">400 900 200</series></chart>`,
                    1,
                ],
                [
                    "below zero",
                    `<chart type="scatter" name="c"><xLabel>${NAME}</xLabel><series x="1 2 3">-400 -900 -200</series></chart>`,
                    1,
                ],
                [
                    "below and left of zero",
                    `<chart type="scatter" name="c"><xLabel>${NAME}</xLabel><yLabel>${NAME}</yLabel><series x="-1 -2 -3">-400 -900 -200</series></chart>`,
                    2,
                ],
            ] as [string, string, number][]) {
                const prefigureXML = await getPrefigureXML(doenetML, "c");
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${what}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const pictureWidth = Number(
                    svg.match(/<svg[^>]*width="([\d.]+)"/)![1],
                );

                const names = nameBoxes(svg);
                expect(names.length, `${what}: axis names not found`).toBe(
                    expected,
                );

                for (const name of names) {
                    expect(
                        name.left,
                        `${what}: the axis name starts outside the picture`,
                    ).toBeGreaterThan(-0.5);
                    expect(
                        name.left + width,
                        `${what}: the axis name ends outside the picture`,
                    ).toBeLessThan(pictureWidth + 0.5);
                }

                // And clear of the numbers on the axes, which is the other way
                // a name drawn out of the plot went wrong: the horizontal axis'
                // numbers share the top margin with an `<xLabel>` drawn `nw`
                // from an axis that has moved up there.
                const numbers = [
                    ...svg.matchAll(
                        /<g id="[^"]*?__label-\d+" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"[^>]*>\s*<g[^>]*>\s*<svg[^>]*width="([\d.]+)px" height="([\d.]+)px"/g,
                    ),
                ].map((number) => ({
                    left: Number(number[1]) + Number(number[3]),
                    top: Number(number[2]) + Number(number[4]),
                    width: Number(number[5]),
                    height: Number(number[6]),
                }));
                expect(
                    numbers.length,
                    `${what}: no axis numbers`,
                ).toBeGreaterThan(0);

                for (const name of names) {
                    for (const number of numbers) {
                        const overlaps =
                            name.left < number.left + number.width &&
                            number.left < name.left + width &&
                            name.top < number.top + number.height &&
                            number.top < name.top + LINE;
                        expect(
                            overlaps,
                            `${what}: the axis name is drawn over an axis number`,
                        ).toBe(false);
                    }
                }

                // The two names share an anchor once both axes have moved, so
                // the second is dropped a line rather than drawn over the first.
                if (names.length === 2) {
                    expect(
                        Math.abs(names[0].top - names[1].top),
                        `${what}: the two axis names are drawn on the same line`,
                    ).toBeGreaterThanOrEqual(LINE);
                }
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: a pie is drawn round and inside the picture",
        async () => {
            // The one thing the XML cannot say about a pie. PreFigure scales an
            // arc's radius by each axis separately (`circle.py`), so a bounding
            // box whose units are not the same size in both directions draws an
            // ellipse — and the box is chosen from the drawing area, which is
            // what is left after margins that are themselves computed from
            // estimates. Only the rendered path says what came out.
            for (const [what, doenetML] of [
                [
                    "default shape",
                    `<chart type="pie" name="c">41 63 18 78</chart>`,
                ],
                [
                    "wide",
                    `<chart type="pie" name="c" aspectRatio="4">41 63 18 78</chart>`,
                ],
                [
                    "tall",
                    `<chart type="pie" name="c" aspectRatio="0.5">41 63 18 78</chart>`,
                ],
                [
                    "titled, with a legend",
                    `<chart type="pie" name="c" categories="North South East West"><title>Population by region</title>41 63 18 78</chart>`,
                ],
                [
                    "legend below",
                    `<chart type="pie" name="c" categories="North South East West" legendPosition="outsideBottom">41 63 18 78</chart>`,
                ],
                [
                    "names around the rim",
                    `<chart type="pie" name="c" categories="North South East West" legend="false">41 63 18 78</chart>`,
                ],
                [
                    "one value",
                    `<chart type="pie" name="c" legend="false">5</chart>`,
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

                // Each sector is a path walked along its rim and closed back to
                // the center, so the union of every slice's points is the pie.
                const points = [
                    ...svg.matchAll(/<path id="[^"]*?-slice-\d+" d="([^"]*)"/g),
                ].flatMap((slice) =>
                    [
                        ...slice[1].matchAll(
                            /(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/g,
                        ),
                    ].map((point) => [Number(point[1]), Number(point[2])]),
                );
                expect(
                    points.length,
                    `${what}: no slices drawn`,
                ).toBeGreaterThan(0);

                const xs = points.map((point) => point[0]);
                const ys = points.map((point) => point[1]);
                const [left, right] = [Math.min(...xs), Math.max(...xs)];
                const [top, bottom] = [Math.min(...ys), Math.max(...ys)];

                // Round: the same across as it is tall. The tolerance is the
                // one decimal place PreFigure writes its coordinates to.
                expect(
                    right - left,
                    `${what}: pie is ${right - left} across and ${bottom - top} tall`,
                ).closeTo(bottom - top, 0.25);

                // And inside the picture. Half the stroke is painted outside
                // the radius, which is what the padding either side is for.
                expect(left, `${what}: pie runs off the left`).toBeGreaterThan(
                    -0.5,
                );
                expect(top, `${what}: pie runs off the top`).toBeGreaterThan(
                    -0.5,
                );
                expect(right, `${what}: pie runs off the right`).toBeLessThan(
                    pictureWidth + 0.5,
                );
                expect(bottom, `${what}: pie runs off the bottom`).toBeLessThan(
                    pictureHeight + 0.5,
                );
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: a pie's slice names are drawn inside the picture",
        async () => {
            // `legend="false"` writes the slice names beyond the rim, and the
            // margin that holds them is reserved from `estimateTextWidth` — the
            // same estimate the legend's own margin uses, and the same failure
            // if it comes out under: text drawn past the edge of the SVG, which
            // the browser simply does not paint.
            //
            // A plain `<label>` reaches the SVG as `<text>`, whose drawn width
            // the SVG does not record. What it does record is the group around
            // it, translated to the anchor and then back by the alignment's
            // displacement — and for an alignment that draws leftward or
            // centers, that second translate *is* the width PreFigure measured.
            // So the width of a string is read off a copy drawn leftward and
            // applied to the copies drawn rightward, which carry no width of
            // their own.
            //
            // Eight equal slices are what make that possible in one render:
            // they put the same name at all eight compass alignments at once,
            // so every direction a name can be drawn in is checked against a
            // width the same render measured. `aspectRatio="1"` is not
            // incidental — a pie is inscribed in its drawing area, so on a
            // chart wider than it is tall there is slack either side of the
            // circle that hides an under-reserved margin. A square drawing area
            // has none, which is what makes this an assertion rather than an
            // observation.
            for (const [what, doenetML] of [
                [
                    "eight directions",
                    `<chart type="pie" name="c" aspectRatio="1" legend="false" categories="WWWWWW WWWWWW WWWWWW WWWWWW WWWWWW WWWWWW WWWWWW WWWWWW">1 1 1 1 1 1 1 1</chart>`,
                ],
                [
                    "eight directions, lowercase",
                    `<chart type="pie" name="c" aspectRatio="1" legend="false" categories="Renewables Renewables Renewables Renewables Renewables Renewables Renewables Renewables">1 1 1 1 1 1 1 1</chart>`,
                ],
                [
                    "eight directions on a small chart",
                    `<chart type="pie" name="c" aspectRatio="1" size="small" legend="false" categories="Nuclear Nuclear Nuclear Nuclear Nuclear Nuclear Nuclear Nuclear">1 1 1 1 1 1 1 1</chart>`,
                ],
                [
                    "long names",
                    `<chart type="pie" name="c" legend="false" categories="Photovoltaic Hydroelectric Geothermal Coal">4 3 2 1</chart>`,
                ],
                [
                    "long names on a small chart",
                    `<chart type="pie" name="c" size="small" legend="false" categories="Renewables Coal Nuclear">4 3 2</chart>`,
                ],
                // A legend and the values share the right margin, and on a
                // frame too small for both the legend has to give up its place
                // past them rather than take width from the *left* margin —
                // `fitMargins` shrinks the two together, so paying for the
                // legend out of the shared budget pushed a value on the far
                // side off the picture.
                [
                    "values beside a legend on a small chart",
                    `<chart type="pie" name="c" size="small" displayValues categories="Alpha Bravo Charlie Delta">1200000 900000 700000 500000</chart>`,
                ],
                [
                    "nine-digit values beside a legend on a small chart",
                    `<chart type="pie" name="c" size="small" displayValues categories="Alpha Bravo Charlie Delta">123456789 90000000 70000000 50000000</chart>`,
                ],
                [
                    "values beside a legend, with room for both",
                    `<chart type="pie" name="c" displayValues categories="Alpha Bravo Charlie Delta Echo Foxtrot">1200000 900000 700000 500000 300000 100000</chart>`,
                ],
                [
                    "names and values together",
                    `<chart type="pie" name="c" legend="false" displayValues categories="North South East West">41 63 18 78</chart>`,
                ],
                [
                    // The reference page's own second pie. A name and a value
                    // share one label, so the string the margin has to hold is
                    // longer than either part: `Renewables (40)` on a chart
                    // this size was drawn 15px past the right edge.
                    "names and values on a small chart, as the reference page draws one",
                    `<chart type="pie" name="c" size="small" legend="false" displayValues categories="Wind Coal Solar">40 35 25</chart>`,
                ],
                [
                    // A value is beyond the rim even where the legend holds the
                    // names, so the margin has to hold it with no help from the
                    // legend's own.
                    "a value beyond the rim with the names in the legend",
                    `<chart type="pie" name="c" aspectRatio="1" displayValues categories="A B C D">100000000 100000000 100000000 100000000</chart>`,
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

                // How far back the group is translated, as a multiple of the
                // measured width, for each alignment this chart emits
                // (`alignment_displacement`, `label.py`). Zero is an alignment
                // that draws rightward from its anchor and so records nothing.
                const shiftPerWidth: Record<string, number> = {
                    east: 0,
                    northeast: 0,
                    southeast: 0,
                    north: -0.5,
                    south: -0.5,
                    center: -0.5,
                    west: -1,
                    northwest: -1,
                    southwest: -1,
                };

                // PreFigure numbers the labels in document order, which is the
                // order this file wrote them, so the alignment each one was
                // asked for is known exactly rather than guessed at from the
                // shift it came back with.
                const asked = [
                    ...prefigureXML.matchAll(
                        /<label [^>]*alignment="([a-z]+)"[^>]*>([^<]*)<\/label>/g,
                    ),
                ].map((label) => ({
                    alignment: label[1],
                    text: label[2],
                }));

                const drawn = [
                    ...svg.matchAll(
                        /<g id="[^"]*?__label-(\d+)" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"[^>]*>\s*<g[^>]*>\s*<text[^>]*y="(-?[\d.]+)"[^>]*>([^<]*)</g,
                    ),
                ].map((label) => ({
                    index: Number(label[1]),
                    left: Number(label[2]) + Number(label[4]),
                    baseline:
                        Number(label[3]) + Number(label[5]) + Number(label[6]),
                    shiftX: Number(label[4]),
                    text: label[7],
                }));

                expect(drawn.length, `${what}: no names drawn`).eq(
                    asked.length,
                );

                // The width PreFigure measured for each string, wherever one of
                // its copies was drawn in a direction that records it.
                const measured = new Map<string, number>();
                for (const label of drawn) {
                    const alignment = asked[label.index]?.alignment;
                    expect(
                        asked[label.index]?.text,
                        `${what}: label ${label.index} is not the one that was asked for`,
                    ).eq(label.text);
                    const shift = shiftPerWidth[alignment ?? ""];
                    if (!shift) {
                        continue;
                    }
                    measured.set(label.text, label.shiftX / shift);
                }

                // A string every copy of which was drawn rightward records no
                // width of its own: `east`, `northeast` and `southeast`
                // translate the group back by nothing. Left at zero, the check
                // on the right edge below is no check at all — which is how the
                // reference page's own pie came to be drawn 15px past the edge
                // with this test green. So those widths are measured in a
                // second render: the same strings at the same font, each drawn
                // leftward, where the second translate is the width and nothing
                // else.
                const unmeasured = [
                    ...new Set(
                        drawn
                            .filter((label) => !measured.has(label.text))
                            .map((label) => label.text),
                    ),
                ];
                if (unmeasured.length > 0) {
                    const ruler = `<diagram dimensions="(600,${24 * unmeasured.length + 24})"><coordinates bbox="(0,0,1,1)">${unmeasured
                        .map(
                            (text, ind) =>
                                `<label anchor="(1,${(ind + 1) / (unmeasured.length + 1)})" alignment="west">${escapeXml(text)}</label>`,
                        )
                        .join("")}</coordinates></diagram>`;
                    const ruled =
                        await validatePrefigureXMLAgainstBuildService(ruler);
                    expect(
                        ruled.ok,
                        `${what}: the measuring render failed`,
                    ).toBe(true);
                    for (const label of (ruled.body?.svg ?? "").matchAll(
                        /<g id="[^"]*?__label-(\d+)" transform="translate\((-?[\d.]+),(-?[\d.]+)\) translate\((-?[\d.]+),(-?[\d.]+)\)"/g,
                    )) {
                        measured.set(
                            unmeasured[Number(label[1])],
                            -Number(label[4]),
                        );
                    }
                }

                for (const label of drawn) {
                    const width = measured.get(label.text);
                    expect(
                        width,
                        `${what}: "${label.text}" was never measured`,
                    ).toBeGreaterThan(0);
                    expect(
                        label.left,
                        `${what}: "${label.text}" starts outside the picture`,
                    ).toBeGreaterThan(-0.5);
                    expect(
                        label.left + (width ?? 0),
                        `${what}: "${label.text}" ends outside the picture`,
                    ).toBeLessThan(pictureWidth + 0.5);
                    // 14px text: the ink reaches about eleven pixels above the
                    // baseline and three below it.
                    expect(
                        label.baseline - 11,
                        `${what}: "${label.text}" sits above the picture`,
                    ).toBeGreaterThan(-0.5);
                    expect(
                        label.baseline + 3,
                        `${what}: "${label.text}" sits below the picture`,
                    ).toBeLessThan(pictureHeight + 0.5);
                }
            }
        },
    );
    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: a box plot's parts are drawn where the geometry puts them",
        async () => {
            // A box plot is six marks that only mean something in relation to
            // one another — the median inside the box, the whiskers on the
            // box's own center line, the caps across their ends — and the XML
            // says where each was *asked* for, in data coordinates, not where
            // any of them came out. What turns those into pixels is the
            // bounding box and the margins, and a chart whose vertical scale
            // came out inverted, or whose box was placed off its slot, would
            // pass every assertion in `chart-box.test.ts` and draw nonsense.
            //
            // The rectangle reaches the SVG as a `<path>` carrying the handle,
            // so its four corners are readable; the lines that follow it in
            // document order are its median, whiskers and caps.
            for (const [what, doenetML] of [
                [
                    "default shape",
                    `<chart type="box" name="c"><series><label>A</label>52 61 63 68 70 71 75 78 84 91</series></chart>`,
                ],
                [
                    "wide",
                    `<chart type="box" name="c" aspectRatio="4"><series><label>A</label>52 61 63 68 70 71 75 78 84 91</series></chart>`,
                ],
                [
                    "tall",
                    `<chart type="box" name="c" aspectRatio="0.5"><series><label>A</label>52 61 63 68 70 71 75 78 84 91</series></chart>`,
                ],
                [
                    "three series on a small chart",
                    `<chart type="box" name="c" size="small"><series><label>A</label>52 61 63 68 70 71 75 78 84 91</series><series><label>B</label>44 55 58 60 62 65 66 70 72 96</series><series><label>C</label>60 62 64 65 66 68 70</series></chart>`,
                ],
                [
                    "a title above it",
                    `<chart type="box" name="c"><title>Scores</title><yLabel>score</yLabel><series><label>A</label>52 61 63 68 70 71 75 78 84 91</series></chart>`,
                ],
            ] as [string, string][]) {
                const prefigureXML = await getPrefigureXML(doenetML, "c");
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${what}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const pictureWidth = Number(
                    svg.match(/<svg[^>]*width="([\d.]+)"/)?.[1],
                );
                const pictureHeight = Number(
                    svg.match(/<svg[^>]*height="([\d.]+)"/)?.[1],
                );

                const boxes = [
                    ...svg.matchAll(
                        /<path id="[^"]*?box-(\d+)" d="M ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) Z"[^>]*stroke-width="([\d.]+)"/g,
                    ),
                ];
                expect(
                    boxes.length,
                    `${what}: no box was drawn`,
                ).toBeGreaterThan(0);

                // Every line drawn after each box and before the next one: its
                // median, its whiskers and their caps.
                const lines = [
                    ...svg.matchAll(
                        /<(?:path id="[^"]*?box-(\d+)"|line id="[^"]*?__line-\d+" x1="([\d.-]+)" y1="([\d.-]+)" x2="([\d.-]+)" y2="([\d.-]+)")/g,
                    ),
                ];

                let currentBox: RegExpMatchArray | null = null;
                let linesInBox = 0;
                for (const mark of lines) {
                    if (mark[1] !== undefined) {
                        currentBox =
                            boxes.find((box) => box[1] === mark[1]) ?? null;
                        linesInBox = 0;
                        continue;
                    }
                    if (currentBox === null) {
                        // The axes and their tick marks, drawn before any box.
                        continue;
                    }

                    const left = Math.min(
                        Number(currentBox[2]),
                        Number(currentBox[4]),
                    );
                    const right = Math.max(
                        Number(currentBox[2]),
                        Number(currentBox[4]),
                    );
                    // `M x0 y0 L x1 y0 L x1 y1 L x0 y1 Z`, so the two
                    // distinct coordinates are the first and third pairs.
                    const top = Math.min(
                        Number(currentBox[3]),
                        Number(currentBox[7]),
                    );
                    const bottom = Math.max(
                        Number(currentBox[3]),
                        Number(currentBox[7]),
                    );
                    const center = (left + right) / 2;
                    const stroke = Number(currentBox[10]);

                    const [x1, y1, x2, y2] = [
                        Number(mark[2]),
                        Number(mark[3]),
                        Number(mark[4]),
                        Number(mark[5]),
                    ];
                    linesInBox++;

                    if (linesInBox === 1) {
                        // The median, across the whole width of the box and
                        // between its two edges — the assertion a chart drawn
                        // upside down would fail.
                        expect(
                            [x1, x2, y1, y2],
                            `${what}: box ${currentBox[1]}'s median is not drawn across it`,
                        ).eqls([left, right, y1, y1]);
                        expect(
                            y1,
                            `${what}: box ${currentBox[1]}'s median is outside it`,
                        ).toBeGreaterThanOrEqual(top - 0.05);
                        expect(y1).toBeLessThanOrEqual(bottom + 0.05);
                    } else if (linesInBox % 2 === 0) {
                        // A whisker: up the box's own center line, from one of
                        // its edges outward.
                        expect(
                            x1,
                            `${what}: box ${currentBox[1]}'s whisker is off center`,
                        ).closeTo(center, 0.05);
                        expect(x2).closeTo(center, 0.05);
                        expect(
                            Math.min(Math.abs(y1 - top), Math.abs(y1 - bottom)),
                            `${what}: box ${currentBox[1]}'s whisker does not start at an edge`,
                        ).toBeLessThan(0.05);
                        // Outward: a whisker from the top edge goes up the
                        // picture, one from the bottom edge goes down it.
                        expect(
                            Math.abs(y1 - top) < Math.abs(y1 - bottom)
                                ? y2 - y1
                                : y1 - y2,
                            `${what}: box ${currentBox[1]}'s whisker points back into it`,
                        ).toBeLessThanOrEqual(0);
                    } else {
                        // The cap across that whisker's end: centered on the
                        // box, and narrower than it, so it does not read as a
                        // second box edge.
                        expect(
                            (x1 + x2) / 2,
                            `${what}: box ${currentBox[1]}'s cap is off center`,
                        ).closeTo(center, 0.05);
                        expect(
                            Math.abs(x2 - x1),
                            `${what}: box ${currentBox[1]}'s cap is not narrower than the box`,
                        ).toBeLessThan(right - left);
                        expect(Math.abs(x2 - x1)).toBeGreaterThan(0);
                    }

                    // And all of it inside the picture, stroke included.
                    for (const [x, y] of [
                        [x1, y1],
                        [x2, y2],
                    ]) {
                        expect(
                            x - stroke / 2,
                            `${what}: box ${currentBox[1]} reaches past the left edge`,
                        ).toBeGreaterThan(-0.5);
                        expect(x + stroke / 2).toBeLessThan(pictureWidth + 0.5);
                        expect(
                            y - stroke / 2,
                            `${what}: box ${currentBox[1]} reaches past the top edge`,
                        ).toBeGreaterThan(-0.5);
                        expect(y + stroke / 2).toBeLessThan(
                            pictureHeight + 0.5,
                        );
                    }
                }
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: a histogram's bars are drawn adjacent, standing on the axis",
        async () => {
            // A histogram says what it says through two relations between its
            // bars — no gap between them, and heights that compare — and the
            // XML carries neither: it holds a corner and a size per bar, in
            // data coordinates, and what turns those into pixels is the
            // bounding box and the margins. A chart whose bars overlapped by a
            // pixel, or whose baseline came out somewhere other than the axis,
            // would pass every assertion in `chart-histogram.test.ts`.
            //
            // Each rectangle reaches the SVG as a `<path>` carrying its handle,
            // so its four corners are readable.
            for (const [what, doenetML, counts] of [
                [
                    "bins chosen from the data",
                    `<chart type="histogram" name="c"><series><label>A</label>2 3 3 4 4 4 5 5 6 9</series></chart>`,
                    [3, 5, 1, 1],
                ],
                [
                    "cut points of differing widths, one of them empty",
                    `<chart type="histogram" name="c" bins="0 5 10 20">1 2 3 4 5 6 7 8 9</chart>`,
                    [4, 5, 0],
                ],
                [
                    "a small chart with many bins",
                    `<chart type="histogram" name="c" size="small" bins="12">1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18</chart>`,
                    null,
                ],
                [
                    "an axis wider than the bars",
                    `<chart type="histogram" name="c" bins="3" xMin="-5" xMax="20">2 3 3 4 4 4 5 5 6 9</chart>`,
                    null,
                ],
            ] as [string, string, number[] | null][]) {
                const prefigureXML = await getPrefigureXML(doenetML, "c");
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${what}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const pictureWidth = Number(
                    svg.match(/<svg[^>]*width="([\d.]+)"/)?.[1],
                );
                const pictureHeight = Number(
                    svg.match(/<svg[^>]*height="([\d.]+)"/)?.[1],
                );

                const bars = [
                    ...svg.matchAll(
                        /<path id="[^"]*?bin-(\d+)" d="M ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) L ([\d.-]+) ([\d.-]+) Z"[^>]*stroke-width="([\d.]+)"/g,
                    ),
                ].map((bar) => ({
                    index: Number(bar[1]),
                    left: Number(bar[2]),
                    right: Number(bar[4]),
                    // The path runs from the lower left along the baseline and
                    // back, so the first and third corners are the two heights.
                    baseline: Number(bar[3]),
                    top: Number(bar[7]),
                    stroke: Number(bar[10]),
                }));

                expect(
                    bars.length,
                    `${what}: no bars were drawn`,
                ).toBeGreaterThan(0);
                expect(
                    bars.map((bar) => bar.index),
                    `${what}: the bars are not in order`,
                ).eqls(bars.map((_unused, ind) => ind + 1));

                for (const [ind, bar] of bars.entries()) {
                    // Adjacent: each bar starts exactly where the one before it
                    // ended. Half a pixel of slack, since the coordinates are
                    // rounded to a tenth on the way into the SVG.
                    if (ind > 0) {
                        expect(
                            bar.left,
                            `${what}: bar ${bar.index} does not meet the one before it`,
                        ).closeTo(bars[ind - 1].right, 0.5);
                    }
                    expect(
                        bar.right,
                        `${what}: bar ${bar.index} has no width`,
                    ).toBeGreaterThan(bar.left);

                    // Standing on one baseline, which is the count axis' zero:
                    // a bar whose bottom moved would be drawn as a count it is
                    // not.
                    expect(
                        bar.baseline,
                        `${what}: bar ${bar.index} does not stand on the baseline`,
                    ).closeTo(bars[0].baseline, 0.5);

                    // Up the picture, which is down the SVG's y.
                    expect(
                        bar.top,
                        `${what}: bar ${bar.index} is drawn below the baseline`,
                    ).toBeLessThanOrEqual(bar.baseline);

                    // Inside the picture, stroke included.
                    expect(
                        bar.left - bar.stroke / 2,
                        `${what}: bar ${bar.index} reaches past the left edge`,
                    ).toBeGreaterThan(-0.5);
                    expect(bar.right + bar.stroke / 2).toBeLessThan(
                        pictureWidth + 0.5,
                    );
                    expect(
                        bar.top - bar.stroke / 2,
                        `${what}: bar ${bar.index} reaches past the top edge`,
                    ).toBeGreaterThan(-0.5);
                    expect(bar.baseline + bar.stroke / 2).toBeLessThan(
                        pictureHeight + 0.5,
                    );
                }

                // And the heights are the counts: twice as many observations
                // is twice as tall, measured from the baseline the bars share.
                if (counts !== null) {
                    expect(bars.length, `${what}: wrong number of bars`).eq(
                        counts.length,
                    );
                    const tallest = Math.max(...counts);
                    const unit =
                        (bars[0].baseline - bars[counts.indexOf(tallest)].top) /
                        tallest;
                    for (const [ind, count] of counts.entries()) {
                        expect(
                            bars[0].baseline - bars[ind].top,
                            `${what}: bar ${ind + 1} is not drawn at its count`,
                        ).closeTo(unit * count, 0.6);
                    }
                }
            }
        },
    );

    it.skipIf(!RUN_LIVE_PREFIGURE_VALIDATION)(
        "optional: every cut point the axis promises carries a drawn number",
        async () => {
            // The gap this closes: nothing else in the repository can see a
            // label that was *not* drawn. The vitest suites assert on the XML
            // string, and the cases above ask the build service only for an
            // SVG — so an axis asked to number a place outside its own bounding
            // box passes both, because PreFigure drops such a label in silence.
            // Two defects reached review that way, both in the numbers under a
            // histogram's outermost bars, and both invisible until the rendered
            // SVG was read.
            //
            // A label reaches the SVG as MathJax, carrying its value in
            // `data-semantic-speech` — grouped, so 1013.15 arrives as
            // "1 comma 013.15" — and rounded to about six digits, which is why
            // the comparison below is a tolerance rather than a string match.
            //
            // Every fixture here is labeled at every cut point (a stride of
            // one), and none of them has a cut point at zero: PreFigure draws
            // no label where the two axes cross, which is a rule of its own
            // rather than anything this chart decides.
            for (const [what, doenetML, expected] of [
                [
                    "a requested count over data carrying more than twelve digits",
                    `<chart type="histogram" name="c" bins="5">1.234567890123456 3 5 7 9.876543210987654</chart>`,
                    [
                        1.234567890123456, 2.962962954, 4.691358018,
                        6.419753082, 8.148148146, 9.876543210987654,
                    ],
                ],
                [
                    "bins narrow beside their own magnitude",
                    `<chart type="histogram" name="c" bins="6">1013.21 1013.26 1013.29 1013.15 1013.33 1013.16 1013.29 1013.16 1013.17 1013.34 1013.32</chart>`,
                    [
                        1013.15, 1013.18167, 1013.21333, 1013.245, 1013.27667,
                        1013.30833, 1013.34,
                    ],
                ],
                [
                    // Scores rather than the small sample used elsewhere: the
                    // sweep below reads every label in the picture, and a cut
                    // point that is also a count would be found on the vertical
                    // axis whether or not the horizontal one drew it.
                    "cut points the chart chose",
                    `<chart type="histogram" name="c">52 61 63 68 70 71 75 78 84 91 55 58 60 62 65 66 70 72 88 94</chart>`,
                    [50, 60, 70, 80, 90, 100],
                ],
            ] as [string, string, number[]][]) {
                const prefigureXML = await getPrefigureXML(doenetML, "c");
                const result =
                    await validatePrefigureXMLAgainstBuildService(prefigureXML);
                expect(result.ok, `${what}: build failed`).toBe(true);

                const svg: string = result.body?.svg ?? "";
                const drawn = [
                    ...svg.matchAll(/data-semantic-speech="([^"]*)"/g),
                ].map((label) =>
                    Number(
                        label[1].replace(/ comma /g, "").replace(/\s+/g, ""),
                    ),
                );

                for (const cutPoint of expected) {
                    expect(
                        drawn.some(
                            (value) =>
                                Math.abs(value - cutPoint) <=
                                Math.abs(cutPoint) * 1e-5,
                        ),
                        `${what}: no number drawn at the cut point ${cutPoint}`,
                    ).toBe(true);
                }
            }
        },
    );
});
