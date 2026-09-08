const RUN_LIVE_PREFIGURE_ACCESSIBILITY = Boolean(
    Cypress.env("RUN_LIVE_PREFIGURE_ACCESSIBILITY"),
);

const liveDescribe = RUN_LIVE_PREFIGURE_ACCESSIBILITY
    ? describe
    : describe.skip;

/**
 * Compiles a chart for real, against the same gate as
 * `prefigureLiveAccessibility.cy.js` — off by default, so a normal CI run pays
 * nothing for the runtime fetch.
 *
 * This is the spec that sees what the XML cannot say. Two of the bugs fixed
 * while reviewing #1829 — axis labels drawn outside the bounding box and
 * silently clipped, and y-ticks anchored so a chart spanning zero never marked
 * the axis its bars are measured from — produced XML that read as perfectly
 * correct. The title and the legend are the same kind of risk: both are placed
 * against a margin this side of the code estimates rather than measures, and
 * PreFigure lays the text out in its own worker, so whether they land inside
 * the picture is only observable here.
 */
liveDescribe("Live chart rendering @group4", { tags: ["@group4"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    /**
     * Every piece of drawn text in the diagram, with something to call it by.
     *
     * Two kinds, and missing the second is easy: authored strings — category
     * names, the title, a legend entry — are SVG `<text>`, but the *numbers on
     * the axes* are not. PreFigure builds each of those as a `<label><m>…</m>`
     * (`axes.py`), so MathJax renders them as glyph references and they carry
     * their value in `data-semantic-speech` rather than as text content. A
     * sweep that looked only at `<text>` would therefore skip the labels most
     * likely to be clipped, which is the whole thing this is watching for.
     */
    function drawnText(svg) {
        const items = [];
        for (const textEl of svg.querySelectorAll("text")) {
            items.push({
                label: textEl.textContent?.trim() ?? "",
                box: textEl.getBoundingClientRect(),
            });
        }
        for (const mathEl of svg.querySelectorAll("[data-semantic-speech]")) {
            items.push({
                label: mathEl.getAttribute("data-semantic-speech") ?? "",
                box: mathEl.getBoundingClientRect(),
            });
        }
        return items.filter(({ box }) => box.width !== 0 || box.height !== 0);
    }

    /** Nothing drawn may fall outside the picture the browser paints. */
    function expectNothingClipped(svg, where) {
        const frame = svg.getBoundingClientRect();
        for (const { label, box } of drawnText(svg)) {
            expect(
                box.left,
                `"${label}" should start inside ${where}`,
            ).to.be.at.least(frame.left - 0.5);
            expect(
                box.right,
                `"${label}" should end inside ${where}`,
            ).to.be.at.most(frame.right + 0.5);
            expect(
                box.top,
                `"${label}" should sit below the top edge of ${where}`,
            ).to.be.at.least(frame.top - 0.5);
            expect(
                box.bottom,
                `"${label}" should sit above the bottom edge of ${where}`,
            ).to.be.at.most(frame.bottom + 0.5);
        }
    }

    it("draws the categories, the title and the legend inside the picture", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="c" type="bar" categories="North South East West">
  <title>Population by region</title>
  <shortDescription>Population by region, 2024 against 2025</shortDescription>
  <yLabel>people</yLabel>
  <series><label>2024</label>41 63 18 78</series>
  <series><label>2025</label>45 60 22 80</series>
</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#c .svg svg", { timeout: 30000 }).should("exist");

        // Every piece of authored text reaches the drawing. The category names
        // are the `<tick-mark>` path, the series names are the legend, and the
        // title is a `<label>` in the top margin.
        cy.get("#c .svg svg", { timeout: 30000 }).should(($svg) => {
            const text = $svg.text();
            for (const expected of [
                "North",
                "West",
                "2024",
                "2025",
                "Population by region",
                "people",
            ]) {
                expect(
                    text,
                    `drawn text should include ${expected}`,
                ).to.include(expected);
            }
        });

        // Nothing is drawn outside the picture. The margins are added around
        // `dimensions`, so an underestimated one puts a label past the edge of
        // the SVG, where the browser simply does not paint it — which is what a
        // clipped axis label looked like, and is invisible in the XML.
        cy.get("#c .svg svg").then(($svg) => {
            expectNothingClipped($svg[0], "the chart");
        });

        // The vertical axis is labeled, and by the values the geometry chose.
        cy.get("#c .svg svg").should(($svg) => {
            const spoken = [
                ...$svg[0].querySelectorAll("[data-semantic-speech]"),
            ].map((el) => el.getAttribute("data-semantic-speech"));
            expect(spoken).to.include("20");
            expect(spoken).to.include("80");
        });

        // The title belongs in the margin above the bars, not over them.
        cy.get("#c .svg svg").then(($svg) => {
            const svg = $svg[0];
            const title = [...svg.querySelectorAll("text")].find(
                (el) => el.textContent?.trim() === "Population by region",
            );
            expect(title, "title should be drawn").to.exist;

            const bars = [...svg.querySelectorAll("path[id*='bar-']")];
            expect(bars.length, "bars should be drawn").to.eq(8);

            const titleBottom = title.getBoundingClientRect().bottom;
            const highestBar = Math.min(
                ...bars.map((bar) => bar.getBoundingClientRect().top),
            );
            expect(titleBottom).to.be.at.most(highestBar);
        });
    });

    it("draws a scatter on numeric axes and a line through its points", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="s" type="scatter">
  <shortDescription>Weight against height</shortDescription>
  <xLabel>height</xLabel>
  <yLabel>weight</yLabel>
  <series x="1.5 1.6 1.7 1.8"><label>control</label>55 62 70 79</series>
</chart>
<chart name="l" type="line" categories="Mon Tue Wed">
  <shortDescription>Visitors per weekday</shortDescription>
  12 19 15
</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#s .svg svg", { timeout: 30000 }).should("exist");
        cy.get("#l .svg svg", { timeout: 30000 }).should("exist");

        // The numeric axis is `hlabels`, which PreFigure draws itself — so
        // whether the numbers came out at all, and inside the picture, is only
        // visible here.
        cy.get("#s .svg svg").should(($svg) => {
            const text = $svg.text();
            expect(text).to.include("height");
            expect(text).to.include("weight");
            expect(text).to.include("control");

            // The numbers on a numeric axis are MathJax, not text — so they
            // are read off `data-semantic-speech`, and a chart whose data sits
            // nowhere near the origin still has to carry them.
            const spoken = [
                ...$svg[0].querySelectorAll("[data-semantic-speech]"),
            ].map((el) => el.getAttribute("data-semantic-speech"));
            expect(spoken.some((value) => /^1\.\d$/.test(value ?? ""))).to.be
                .true;
            expect(spoken.some((value) => Number(value) >= 55)).to.be.true;
        });

        // Nothing outside the picture on either chart. A numeric horizontal
        // axis centers its outermost numbers on the corners of the box, so
        // half of each hangs past them — a margin no bar chart ever had to
        // reserve, and one this side of the code estimates rather than
        // measures.
        for (const id of ["#s", "#l"]) {
            cy.get(`${id} .svg svg`).then(($svg) => {
                expectNothingClipped($svg[0], id);
            });
        }

        // A line chart under categories keeps the tick-mark axis, so its
        // weekday names are painted the way a bar chart's are.
        cy.get("#l .svg svg").should("contain.text", "Wed");

        // Each point is its own element, so each carries its own annotation —
        // which is what makes the chart walkable rather than merely present.
        cy.get("#s .cml", { timeout: 30000 }).should(($cml) => {
            const ids = [...$cml[0].querySelectorAll("annotation")].map((el) =>
                el.getAttribute("id"),
            );
            expect(ids.filter((id) => id?.includes("point-1-"))).to.have.length(
                4,
            );
        });
    });

    it("draws a pie round, with its slices named and navigable", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="p" type="pie" categories="North South East West">
  <title>Population by region</title>
  <shortDescription>Population by region</shortDescription>
  41 63 18 78
</chart>
<chart name="r" type="pie" categories="Renewables Coal Nuclear" legend="false" displayValues>
  <shortDescription>Generation by source</shortDescription>
  40 35 25
</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#p .svg svg", { timeout: 30000 }).should("exist");
        cy.get("#r .svg svg", { timeout: 30000 }).should("exist");

        // The slice names go in the legend when there is one, and around the
        // rim when there is not — so both charts carry all of their names, in
        // different places.
        cy.get("#p .svg svg").should(($svg) => {
            const text = $svg.text();
            for (const expected of [
                "North",
                "South",
                "East",
                "West",
                "Population by region",
            ]) {
                expect(
                    text,
                    `drawn text should include ${expected}`,
                ).to.include(expected);
            }
        });
        cy.get("#r .svg svg").should(($svg) => {
            const text = $svg.text();
            for (const expected of ["Renewables", "Coal", "Nuclear", "40"]) {
                expect(
                    text,
                    `drawn text should include ${expected}`,
                ).to.include(expected);
            }
        });

        // Round, as measured by the browser rather than by the path data: a
        // pie is drawn with `<arc>`, whose radius PreFigure scales by each axis
        // separately, so a bounding box that is not square in units per pixel
        // draws an ellipse. Nothing in the XML says which came out.
        for (const id of ["#p", "#r"]) {
            cy.get(`${id} .svg svg`).then(($svg) => {
                const slices = [
                    ...$svg[0].querySelectorAll('path[id*="-slice-"]'),
                ];
                expect(slices.length, `${id} slices`).to.be.greaterThan(1);

                const boxes = slices.map((slice) =>
                    slice.getBoundingClientRect(),
                );
                const left = Math.min(...boxes.map((box) => box.left));
                const right = Math.max(...boxes.map((box) => box.right));
                const top = Math.min(...boxes.map((box) => box.top));
                const bottom = Math.max(...boxes.map((box) => box.bottom));
                expect(
                    right - left,
                    `${id} pie should be as wide as it is tall`,
                ).to.be.closeTo(bottom - top, 1.5);

                expectNothingClipped($svg[0], id);
            });
        }

        // One annotation per slice, hanging straight off the figure, which is
        // what makes the pie walkable. One series, so there is no `<group>`
        // level between them — asserted over the links rather than only the
        // ids, since a slice annotation that named no parent would still be
        // present and still be unreachable.
        cy.get("#p .cml", { timeout: 30000 }).should(($cml) => {
            const annotations = [...$cml[0].querySelectorAll("annotation")];
            const ids = annotations.map((el) => el.getAttribute("id"));
            expect(ids.filter((id) => id?.includes("slice-"))).to.have.length(
                4,
            );
            expect(ids.filter((id) => id?.includes("series-"))).to.have.length(
                0,
            );

            const figure = annotations.find((el) =>
                (el.getAttribute("id") ?? "").endsWith("figure"),
            );
            expect(figure, "figure annotation").to.exist;
            const figureChildren = [
                ...figure.querySelectorAll("children > *"),
            ].map((el) => el.textContent.trim());
            expect(figureChildren).to.have.length(4);
            for (const sliceId of figureChildren) {
                expect(sliceId).to.match(/slice-\d+$/);
                const slice = annotations.find(
                    (el) => el.getAttribute("id") === sliceId,
                );
                expect(slice, `annotation for ${sliceId}`).to.exist;
                const parents = [...slice.querySelectorAll("parents > *")].map(
                    (el) => el.textContent.trim(),
                );
                expect(parents.some((id) => id.endsWith("figure"))).to.be.true;
            }
        });

        // diagcess claims the chart by marking it up and taking it over, which
        // it only does once both the drawing and the annotations are in the
        // DOM. Waited for before the click, because the click is what activates
        // the explorer and nothing clicks again afterwards.
        cy.get("#p .ChemAccess-element", { timeout: 30000 })
            .should("have.attr", "has-svg", "true")
            .and("have.attr", "has-cml", "true")
            .and("have.attr", "tabindex", "0")
            .and("have.attr", "role", "application");

        cy.get("#p .ChemAccess-element").click({ force: true });
        cy.get("#p .cacc-message", { timeout: 30000 })
            .should("exist")
            .and("contain.text", "Population by region");
    });

    it("navigates the bars through their series", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="c" type="bar" categories="North South">
  <shortDescription>Population by region, 2024 against 2025</shortDescription>
  <series><label>2024</label>41 63</series>
  <series><label>2025</label>45 60</series>
</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#c .svg svg", { timeout: 30000 }).should("exist");

        cy.get("#c .ChemAccess-element", { timeout: 30000 })
            .should("have.attr", "has-svg", "true")
            .and("have.attr", "has-cml", "true")
            .and("have.attr", "tabindex", "0")
            .and("have.attr", "role", "application");

        // The annotation tree diagcess walks: figure, then a level per series,
        // then the bars. A flat list of four bars would be a chart that is
        // present rather than navigable, which is the whole argument for
        // rendering through PreFigure.
        //
        // Asserted over the structure rather than the text, because the text is
        // not in the tree: PreFigure moves an annotation's `text` onto a
        // `speech2` attribute and leaves the elements holding ids and links.
        // What is checked here is the shape — which is the part that would
        // break if the `<group>` per series stopped being emitted.
        cy.get("#c .cml", { timeout: 30000 }).should(($cml) => {
            const annotations = [...$cml[0].querySelectorAll("annotation")];
            const byIdSuffix = (suffix) =>
                annotations.find((el) =>
                    (el.getAttribute("id") ?? "").endsWith(suffix),
                );

            const figure = byIdSuffix("figure");
            expect(figure, "figure annotation").to.exist;

            for (const seriesSuffix of ["series-1", "series-2"]) {
                const series = byIdSuffix(seriesSuffix);
                expect(series, `${seriesSuffix} annotation`).to.exist;

                // The series hangs under the figure...
                const parents = [...series.querySelectorAll("parents > *")].map(
                    (el) => el.textContent.trim(),
                );
                expect(parents.some((id) => id.endsWith("figure"))).to.be.true;

                // ...and its own bars hang under it.
                const children = [
                    ...series.querySelectorAll("children > *"),
                ].map((el) => el.textContent.trim());
                expect(children).to.have.length(2);
                for (const barId of children) {
                    expect(barId).to.match(/bar-\d+-\d+$/);
                    const bar = annotations.find(
                        (el) => el.getAttribute("id") === barId,
                    );
                    expect(bar, `annotation for ${barId}`).to.exist;
                }
            }

            // No bar is attached straight to the figure once there are series
            // to hold them.
            const figureChildren = [
                ...figure.querySelectorAll("children > *"),
            ].map((el) => el.textContent.trim());
            expect(figureChildren).to.have.length(2);
            expect(figureChildren.every((id) => id.includes("series-"))).to.be
                .true;
        });

        cy.get("#c .ChemAccess-element").click({ force: true });
        cy.get("#c .cacc-message", { timeout: 30000 })
            .should("exist")
            .and("contain.text", "Population by region");

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });
});
