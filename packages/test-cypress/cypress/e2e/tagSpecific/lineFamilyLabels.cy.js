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

describe("Line-family label placement", { tags: ["@group3"] }, function () {
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

        cy.get(cesc("#loaded")).should("have.text", "loaded");

        assertLabelFitsHorizontally("graphLine", lineLabel);
        assertLabelFitsHorizontally("graphLineSegment", lineSegmentLabel);
        assertLabelFitsHorizontally("graphRay", rayLabel);
        assertLabelFitsHorizontally("graphVector", vectorLabel);
    });
});
