/*
 * A `<sideBySide>` of two or more panels stacks its panels, in document order and
 * each at the full width of the row, when the document is narrower than 30em
 * (480px at the default font size). Above that the row is laid out exactly as
 * before, at the widths and margins the worker computed. See `sideBySide.css` in
 * `@doenet/doenetml`.
 *
 * The threshold is on the document (`.doenet-viewer`, a size container), not on
 * the row, so a `<sideBySide>` nested in a panel keeps its row on a wide screen.
 *
 * Every measurement is taken in a `should` callback, so it is retried until the
 * layout settles after the worker's first render and after each `cy.viewport`.
 */

const WIDE = [1000, 800];
const PHONE = [390, 844];

/** Each panel's box, and its computed width and inline margins, in px. */
function measurePanels($panels) {
    return [...$panels].map((el) => {
        const rect = el.getBoundingClientRect();
        const style = el.ownerDocument.defaultView.getComputedStyle(el);
        return {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            width: rect.width,
            marginStart: parseFloat(style.marginInlineStart),
            marginEnd: parseFloat(style.marginInlineEnd),
            text: el.textContent.trim(),
        };
    });
}

function rowWidth(id) {
    return cy
        .get(`#${id}`)
        .then(($row) => $row[0].getBoundingClientRect().width);
}

/** The panels of row `id` sit in one row, each at `widths[i]` percent of it. */
function expectInOneRow(id, widths, margins) {
    cy.get(`#${id}`).should(($row) => {
        const row = $row[0].getBoundingClientRect().width;
        const panels = measurePanels(
            $row.children(".doenet-side-by-side-panel"),
        );
        expect(panels.length).eq(widths.length);
        panels.forEach((panel, i) => {
            expect(panel.width, `panel ${i + 1} width`).closeTo(
                (widths[i] / 100) * row,
                0.6,
            );
            if (margins) {
                expect(
                    panel.marginStart,
                    `panel ${i + 1} start margin`,
                ).closeTo((margins[i][0] / 100) * row, 0.6);
                expect(panel.marginEnd, `panel ${i + 1} end margin`).closeTo(
                    (margins[i][1] / 100) * row,
                    0.6,
                );
            }
            if (i > 0) {
                expect(panel.top, `panel ${i + 1} top`).closeTo(
                    panels[0].top,
                    0.6,
                );
                expect(panel.left, `panel ${i + 1} left`).gte(
                    panels[i - 1].right,
                );
            }
        });
    });
}

/** The panels of row `id` are stacked, in document order, each at full width. */
function expectStacked(id, expectedTexts) {
    cy.get(`#${id}`).should(($row) => {
        const row = $row[0].getBoundingClientRect();
        expect(
            $row[0].ownerDocument.defaultView.getComputedStyle($row[0])
                .flexDirection,
        ).eq("column");
        const panels = measurePanels(
            $row.children(".doenet-side-by-side-panel"),
        );
        expect(panels.length).greaterThan(1);
        panels.forEach((panel, i) => {
            expect(panel.width, `panel ${i + 1} width`).closeTo(row.width, 0.6);
            expect(panel.left, `panel ${i + 1} left`).closeTo(row.left, 0.6);
            expect(panel.marginStart).eq(0);
            expect(panel.marginEnd).eq(0);
            if (i > 0) {
                expect(panel.top, `panel ${i + 1} top`).gte(
                    panels[i - 1].bottom - 0.5,
                );
            }
        });
        if (expectedTexts) {
            expect(panels.map((p) => p.text)).deep.eq(expectedTexts);
        }
    });
}

function post(doenetML) {
    cy.window().then(async (win) => {
        win.postMessage({ doenetML }, "*");
    });
}

describe("SideBySide Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.viewport(...WIDE);
        cy.visit("/");
    });

    it("keeps the row as written on a wide screen and stacks it on a phone", () => {
        post(`
<sideBySide name="sbs" widths="46% 46%" margins="2%">
  <p name="left">Left panel text</p>
  <p name="right">Right panel text</p>
</sideBySide>
<sideBySide name="three" widths="20% 50% 30%">
  <p>A</p>
  <p>B</p>
  <p>C</p>
</sideBySide>
`);
        cy.get("#right").should("contain.text", "Right panel text");

        // The widths and margins the worker computed, unchanged.
        expectInOneRow(
            "sbs",
            [46, 46],
            [
                [2, 2],
                [2, 2],
            ],
        );
        expectInOneRow("three", [20, 50, 30]);

        // The same document narrowed live: no reload, the container query
        // follows the width.
        cy.viewport(...PHONE);
        expectStacked("sbs", ["Left panel text", "Right panel text"]);
        expectStacked("three", ["A", "B", "C"]);

        // And back.
        cy.viewport(...WIDE);
        expectInOneRow(
            "sbs",
            [46, 46],
            [
                [2, 2],
                [2, 2],
            ],
        );
    });

    it("stacks only below 30em of document width", () => {
        post(`
<sideBySide name="sbs">
  <p>One</p>
  <p>Two</p>
</sideBySide>
`);
        cy.get("#sbs").should("contain.text", "Two");

        // The document's content box is the container; find the viewport width
        // that puts it just above and just below 480px. Measured at a width
        // where the document is not held at its maximum, so that everything
        // between the viewport and the content box is fixed padding.
        cy.viewport(600, 800);
        cy.get(".doenet-viewer").then(($viewer) => {
            const viewer = $viewer[0];
            const win = viewer.ownerDocument.defaultView;
            const style = win.getComputedStyle(viewer);
            const padding =
                parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
            const contentBox = viewer.getBoundingClientRect().width - padding;
            // Everything between the window's edge and the content box,
            // scrollbar included.
            const extra = Math.ceil(win.innerWidth - contentBox);

            cy.viewport(480 + extra + 2, 800);
            expectInOneRow("sbs", [50, 50]);

            cy.viewport(480 + extra - 2, 800);
            expectStacked("sbs", ["One", "Two"]);
        });
    });

    it("leaves a single panel as written on a phone", () => {
        cy.viewport(...PHONE);
        post(`
<sideBySide name="one" widths="60%" margins="20%">
  <p>Centered alone</p>
</sideBySide>
`);
        cy.get("#one").should("contain.text", "Centered alone");
        expectInOneRow("one", [60], [[20, 20]]);
    });

    it("a nested sideBySide follows the document, not its panel", () => {
        post(`
<sideBySide name="outer">
  <sideBySide name="inner">
    <p>Inner one</p>
    <p>Inner two</p>
  </sideBySide>
  <p>Outer two</p>
</sideBySide>
`);
        cy.get("#outer").should("contain.text", "Outer two");

        // The inner row is narrower than 30em, but the document is not, so it
        // stays a row, as it was before.
        rowWidth("inner").should("be.lessThan", 480);
        expectInOneRow("outer", [50, 50]);
        expectInOneRow("inner", [50, 50]);

        cy.viewport(...PHONE);
        expectStacked("outer");
        expectStacked("inner", ["Inner one", "Inner two"]);
    });

    it("stacks every row of an sbsGroup on a phone, and keeps the group's widths on a wide screen", () => {
        post(`
<sbsGroup widths="30% 70%">
  <sideBySide name="row1">
    <p>Row 1 A</p>
    <p>Row 1 B</p>
  </sideBySide>
  <sideBySide name="row2">
    <p>Row 2 A</p>
    <p>Row 2 B</p>
  </sideBySide>
</sbsGroup>
`);
        cy.get("#row2").should("contain.text", "Row 2 B");
        expectInOneRow("row1", [30, 70]);
        expectInOneRow("row2", [30, 70]);

        cy.viewport(...PHONE);
        expectStacked("row1", ["Row 1 A", "Row 1 B"]);
        expectStacked("row2", ["Row 2 A", "Row 2 B"]);
    });

    it("a table and a graph, side by side on a wide screen, stack on a phone at full width", () => {
        post(`
<sideBySide name="sbs" widths="47% 47%" valign="bottom" margins="2%">
  <table name="table">
    <title>Data</title>
    <tabular>
      <row><cell>seconds, <m>t</m></cell><cell>Velocity in m/s, <m>v(t)</m></cell></row>
      <row><cell>0</cell><cell>0</cell></row>
      <row><cell>12</cell><cell>31</cell></row>
    </tabular>
  </table>
  <figure name="figure">
    <caption>Axes for plotting.</caption>
    <graph name="graph" width="300" xmin="-1" xmax="14" ymin="-4" ymax="35">
      <shortDescription>Axes for plotting</shortDescription>
    </graph>
  </figure>
</sideBySide>
`);
        cy.get("#graph").should("be.visible");
        cy.viewport(...PHONE);
        expectStacked("sbs");

        // Nothing is cut off: the table fits inside the row and comes first,
        // and the graph is no longer squeezed into half of the row.
        cy.get("#sbs").should(($row) => {
            const row = $row[0].getBoundingClientRect();
            const table = $row.find("table")[0].getBoundingClientRect();
            const graph = $row.find("#graph")[0].getBoundingClientRect();
            expect(table.right).lte(row.right + 0.5);
            expect(table.bottom).lte(graph.top);
            expect(graph.width).gt(0.6 * row.width);
            expect(graph.right).lte(row.right + 0.5);
        });

        cy.checkAccessibility([".doenet-viewer"], {
            onlyWarnImpacts: ["moderate", "minor"],
        });
    });

    it("panels of a sideBySide leading a list item fill the row when stacked", () => {
        post(`
<ol>
  <li>
    <sideBySide name="sbs">
      <graph name="g"><shortDescription>a graph</shortDescription></graph>
      <p>Text beside the graph.</p>
    </sideBySide>
  </li>
</ol>
`);
        cy.get("#g").should("be.visible");
        cy.viewport(...PHONE);
        expectStacked("sbs");
    });

    it("stacks on a wide screen when the reader has doubled the text size", () => {
        post(`
<sideBySide name="sbs">
  <p>One</p>
  <p>Two</p>
</sideBySide>
`);
        cy.get("#sbs").should("contain.text", "Two");
        expectInOneRow("sbs", [50, 50]);

        // A larger default font size moves the 30em threshold with it: at 200%
        // it is 960px, wider than the document's 850px maximum.
        cy.document().then((doc) => {
            doc.documentElement.style.fontSize = "200%";
        });
        expectStacked("sbs", ["One", "Two"]);
    });
});
