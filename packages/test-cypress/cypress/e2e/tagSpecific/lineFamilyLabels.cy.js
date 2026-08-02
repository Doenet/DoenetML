import { cesc } from "@doenet/utils";

function postDoenetML(doenetML) {
    cy.window().then((win) => {
        win.postMessage({ doenetML }, "*");
    });
}

function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
}

function findLabelElement(graph, labelText) {
    const candidates = Array.from(graph.querySelectorAll("*"));

    return candidates.find((element) => {
        const rect = element.getBoundingClientRect();

        return (
            rect.width > 0 &&
            rect.height > 0 &&
            normalizeText(element.textContent || "") === labelText
        );
    });
}

function assertLabelFitsHorizontally(graphName, labelText) {
    cy.window().should((win) => {
        const graph = win.document.querySelector(cesc(`#${graphName}`));

        expect(graph, `graph ${graphName}`).to.not.equal(null);

        const labelElement = findLabelElement(graph, labelText);

        expect(labelElement, `label ${labelText}`).to.not.equal(undefined);

        const graphRect = graph.getBoundingClientRect();
        const labelRect = labelElement.getBoundingClientRect();

        expect(
            labelRect.left,
            `${labelText} should stay inside the left graph edge`,
        ).to.be.at.least(graphRect.left - 1);
        expect(
            labelRect.right,
            `${labelText} should stay inside the right graph edge`,
        ).to.be.at.most(graphRect.right + 1);
    });
}

/**
 * A labeled component draws exactly one label. The invisible handle points a
 * renderer creates for dragging (a vector's endpoints, a polyline's vertices)
 * inherit the component's attributes, including its `name`, so they must have
 * their label suppressed — otherwise each one draws a second copy of the label,
 * and since only the component's own label is typeset, those copies show the
 * raw LaTeX.
 */
function assertLabelDrawnOnce(graphName) {
    cy.window().should((win) => {
        const graph = win.document.querySelector(cesc(`#${graphName}`));

        expect(graph, `graph ${graphName}`).to.not.equal(null);

        const texts = Array.from(graph.querySelectorAll(".JXGtext"));

        const typeset = texts.filter((element) =>
            element.querySelector("mjx-container"),
        );
        expect(typeset.length, `typeset labels drawn in ${graphName}`).to.equal(
            1,
        );

        const rawLatex = texts
            .map((element) => normalizeText(element.textContent || ""))
            .filter((text) => text.includes("\\("));
        expect(rawLatex, `raw LaTeX drawn in ${graphName}`).to.deep.equal([]);
    });
}

describe("Line-family labels", { tags: ["@group3"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("keeps initial line-family labels inside graph bounds", () => {
        const lineLabel = "LINE_RIGHT_EDGE_LABEL_WIDE";
        const lineSegmentLabel = "LINESEGMENT_LEFT_EDGE_LABEL_WIDE";
        const rayLabel = "RAY_RIGHT_EDGE_LABEL_WIDE";
        const vectorLabel = "VECTOR_LEFT_EDGE_LABEL_WIDE";

        postDoenetML(`
  <text name="loaded">loaded</text>

  <graph name="graphLine" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <line through="(8,2) (10,4)" labelPosition="upperright">
      <label>${lineLabel}</label>
    </line>
  </graph>

  <graph name="graphLineSegment" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <lineSegment endpoints="(-10,-5) (-8,-3)" labelPosition="upperleft">
      <label>${lineSegmentLabel}</label>
    </lineSegment>
  </graph>

  <graph name="graphRay" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <ray endpoint="(8,-8)" through="(10,-6)" labelPosition="right">
      <label>${rayLabel}</label>
    </ray>
  </graph>

  <graph name="graphVector" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <vector tail="(-8,8)" head="(-10,6)" labelPosition="left">
      <label>${vectorLabel}</label>
    </vector>
  </graph>
        `);

        cy.get("#loaded").should("have.text", "loaded");

        assertLabelFitsHorizontally("graphLine", lineLabel);
        assertLabelFitsHorizontally("graphLineSegment", lineSegmentLabel);
        assertLabelFitsHorizontally("graphRay", rayLabel);
        assertLabelFitsHorizontally("graphVector", vectorLabel);
    });

    it("draws a math label once, not again on each draggable handle", () => {
        postDoenetML(`
  <text name="loaded">loaded</text>

  <graph name="graphVector" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <vector head="(3,-2)"><label><m>x^2</m></label></vector>
  </graph>

  <graph name="graphPolyline" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <polyline vertices="(-5,4) (-2,7) (1,4)"><label><m>y^2</m></label></polyline>
  </graph>

  <graph name="graphLineSegment" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <lineSegment endpoints="(-8,-5) (-3,-8)"><label><m>z^2</m></label></lineSegment>
  </graph>

  <graph name="graphPolygon" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <polygon vertices="(5,5) (8,5) (8,8)"><label><m>w^2</m></label></polygon>
  </graph>
        `);

        cy.get("#loaded").should("have.text", "loaded");

        assertLabelDrawnOnce("graphVector");
        assertLabelDrawnOnce("graphPolyline");
        assertLabelDrawnOnce("graphLineSegment");
        assertLabelDrawnOnce("graphPolygon");
    });
});
