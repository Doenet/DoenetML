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
            const svg = $svg[0];
            const frame = svg.getBoundingClientRect();

            for (const textEl of svg.querySelectorAll("text")) {
                const box = textEl.getBoundingClientRect();
                if (box.width === 0 && box.height === 0) {
                    continue;
                }
                const label = textEl.textContent?.trim() ?? "";
                expect(
                    box.left,
                    `"${label}" should start inside the picture`,
                ).to.be.at.least(frame.left - 0.5);
                expect(
                    box.right,
                    `"${label}" should end inside the picture`,
                ).to.be.at.most(frame.right + 0.5);
                expect(
                    box.top,
                    `"${label}" should sit below the top edge`,
                ).to.be.at.least(frame.top - 0.5);
                expect(
                    box.bottom,
                    `"${label}" should sit above the bottom edge`,
                ).to.be.at.most(frame.bottom + 0.5);
            }
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
