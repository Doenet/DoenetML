import { waitPastDebounceWindow } from "../../support/prefigure";

/**
 * The half of `<chart>` that Vitest cannot reach.
 *
 * `src/test/prefigure/chart.test.ts` stops at the XML the worker generates.
 * Everything after that — the component resolving to `chart.tsx`, the build
 * request actually being made with that XML, `GraphFrame` sizing the result and
 * `aspectRatio` reaching CSS, and diagcess initializing over the annotations —
 * has no coverage at all, which is what #1837 is about. The annotations matter
 * most: a navigable chart is the reason this renders through PreFigure rather
 * than being drawn by hand, and it is the one claim no assertion on the XML can
 * make.
 *
 * The build endpoint is intercepted, so nothing here fetches the ~80–90 MB
 * runtime; the live counterpart in `chartLive.cy.js` compiles for real and is
 * gated off by default. `window.diagcess` is defined in `onBeforeLoad` so the
 * renderer's re-init is observable without the CDN bundle, which is the shape
 * `prefigureAnnotationsAccessibility.cy.js` already uses.
 */
describe("Chart rendering @group4", { tags: ["@group4"] }, () => {
    /** Records diagcess init calls and marks the container when one happens. */
    function visitWithDiagcessSpy() {
        cy.clearIndexedDB();
        cy.visit("/", {
            onBeforeLoad(win) {
                win.__diagcessInitCount = 0;
                win.diagcess = {
                    Base: {
                        molMap: {},
                        init() {
                            win.__diagcessInitCount += 1;
                        },
                    },
                };
            },
        });
    }

    it("builds and mounts a bar chart, sized and navigable", () => {
        const requestBodies = [];

        visitWithDiagcessSpy();

        cy.intercept("POST", "**/build", (req) => {
            requestBodies.push(String(req.body));
            req.reply({
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: {
                    svg: `<svg xmlns="http://www.w3.org/2000/svg"><text>chart-svg</text></svg>`,
                    annotationsXml: `<diagram><annotation>chart-cml</annotation></diagram>`,
                },
            });
        }).as("prefigureBuild");

        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="c" type="bar" categories="North South East West" aspectRatio="2">
  <shortDescription>Population by region</shortDescription>
  <yLabel>people</yLabel>
  41 63 18 78
</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        cy.wait("@prefigureBuild");
        waitPastDebounceWindow();

        cy.then(() => {
            const xml = requestBodies[0];
            // Category names at arbitrary axis positions — markup no other
            // component emits, and the reason a chart renders through PreFigure
            // rather than through `<graph>`, which has no custom ticks at all.
            expect(xml).to.include(`<tick-mark axis="horizontal" location="1"`);
            expect(xml).to.include(">North</tick-mark>");
            expect(xml).to.include(">West</tick-mark>");
            // One rectangle and one annotation per bar.
            expect(xml.match(/<rectangle /g)).to.have.length(4);
            expect(xml).to.include(
                `<annotation ref="bar-1-1" text="North: 41"`,
            );
            expect(xml).to.include(
                `<annotation ref="figure" text="Population by region"`,
            );
        });

        cy.get("#c .svg").should("contain.text", "chart-svg");
        cy.get("#c .cml").should("contain.text", "chart-cml");

        // `hasAuthorAnnotations` is unconditionally true for a chart, because a
        // chart always writes its own — so diagcess must start every time,
        // where a `<graph>` starts it only when an author wrote `<annotations>`.
        cy.window().its("__diagcessInitCount").should("eq", 1);

        // `aspectRatio` reaching CSS. A value the browser rejects leaves the box
        // with no height at all while the drawing inside it was built at some
        // other ratio, so this is worth seeing rather than reasoning about.
        cy.get("#c .ChemAccess-element")
            .should("have.css", "aspect-ratio", "2 / 1")
            .and(($el) => {
                const { width, height } = $el[0].getBoundingClientRect();
                expect(height).to.be.greaterThan(0);
                expect(width / height).to.be.closeTo(2, 0.05);
            });

        cy.get("#c-description")
            .should("have.attr", "role", "group")
            .and("have.attr", "aria-label", "Population by region");
    });

    it("groups the series and carries a title and legend into the diagram", () => {
        const requestBodies = [];

        visitWithDiagcessSpy();

        cy.intercept("POST", "**/build", (req) => {
            requestBodies.push(String(req.body));
            req.reply({
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: {
                    svg: `<svg xmlns="http://www.w3.org/2000/svg"><text>chart-svg</text></svg>`,
                    annotationsXml: `<diagram><annotation>chart-cml</annotation></diagram>`,
                },
            });
        }).as("prefigureBuild");

        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="c" type="bar" categories="North South">
  <title>Population by region</title>
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
        cy.wait("@prefigureBuild");
        waitPastDebounceWindow();

        cy.then(() => {
            const xml = requestBodies[0];

            // A group per series: the level a screen reader stops at between
            // the chart and its bars, and what the legend's items point into.
            expect(xml).to.include(`<group at="series-1">`);
            expect(xml).to.include(`<group at="series-2">`);

            // The legend keys off the bars themselves, so PreFigure reads each
            // series' own fill for the swatch.
            expect(xml).to.include(`<item ref="bar-1-1"`);
            expect(xml).to.include(">2024</item>");
            expect(xml).to.include(">2025</item>");
            // Transparent box, outlined in the page's text color: PreFigure
            // fills a legend white with no attribute to say otherwise.
            expect(xml).to.include(`opacity="0" stroke="currentColor"`);

            // Drawn into the picture *and* set as the caption, which is the
            // only part tactile output reads.
            expect(xml).to.include(">Population by region</label>");
            expect(xml).to.include("<caption>Population by region</caption>");

            // Bars hang under their series, which hangs under the figure.
            expect(xml).to.include(
                `<annotation ref="series-1" text="2024"><annotation ref="bar-1-1"`,
            );
        });

        cy.get("#c .svg").should("contain.text", "chart-svg");
        cy.window().its("__diagcessInitCount").should("eq", 1);
    });

    it("draws nothing, and asks for nothing, when no chart type is named", () => {
        const tracker = { count: 0 };

        cy.clearIndexedDB();
        cy.visit("/");

        cy.intercept("POST", "**/build", (req) => {
            tracker.count += 1;
            req.reply({
                statusCode: 200,
                headers: { "content-type": "application/json" },
                body: { svg: "<svg/>", annotationsXml: "<annotations/>" },
            });
        });

        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<text name="ready">ready</text>
<chart name="c" categories="A B C">4 9 2</chart>
`,
                },
                "*",
            );
        });

        cy.get("#ready").should("have.text", "ready");
        waitPastDebounceWindow();

        // Nothing on the page at all, frame included: an empty bordered box the
        // size of the chart would read as a chart that failed to load rather
        // than as one that was never asked for.
        cy.get("#c-container").should("not.exist");
        cy.then(() => {
            expect(tracker.count).to.eq(0);
        });
    });
});
