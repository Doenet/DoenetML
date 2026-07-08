import { cesc } from "@doenet/utils";

function postDoenetML(doenetML, darkMode) {
    cy.window().then((win) => {
        win.postMessage({ doenetML, darkMode }, "*");
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

// A background is "masking" (legible over an axis/grid line) if it isn't
// fully transparent. `getComputedStyle` normalizes any color format
// (including CSS variables like `var(--canvas)`) to `rgb(...)` /
// `rgba(...)`, or the literal string "transparent" if unset.
function assertBackgroundIsOpaque(element, description) {
    const backgroundColor =
        element.ownerDocument.defaultView.getComputedStyle(
            element,
        ).backgroundColor;

    expect(
        backgroundColor,
        `${description} background-color should not be transparent`,
    ).to.not.equal("transparent");
    expect(
        backgroundColor,
        `${description} background-color should not be rgba(0, 0, 0, 0)`,
    ).to.not.equal("rgba(0, 0, 0, 0)");
}

describe("Legible (masked) graph labels", { tags: ["@group3"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("point label has an opaque mask background by default", () => {
        const pointLabel = "POINT_ON_AXIS_LABEL";

        postDoenetML(`
  <text name="loaded">loaded</text>

  <graph name="g" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <point name="P" labelIsName="false">
      (0, 3)
      <label>${pointLabel}</label>
    </point>
  </graph>
        `);

        cy.get("#loaded").should("have.text", "loaded");

        cy.window().should((win) => {
            const graph = win.document.querySelector(cesc("#g"));
            expect(graph, "graph").to.not.equal(null);

            const labelElement = findLabelElement(graph, pointLabel);
            expect(labelElement, `label ${pointLabel}`).to.not.equal(undefined);

            assertBackgroundIsOpaque(labelElement, `point label`);
        });
    });

    it("line label has an opaque mask background by default", () => {
        const lineLabel = "LINE_ON_AXIS_LABEL";

        postDoenetML(`
  <text name="loaded">loaded</text>

  <graph name="g" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <line through="(-8,0) (8,0)">
      <label>${lineLabel}</label>
    </line>
  </graph>
        `);

        cy.get("#loaded").should("have.text", "loaded");

        cy.window().should((win) => {
            const graph = win.document.querySelector(cesc("#g"));
            expect(graph, "graph").to.not.equal(null);

            const labelElement = findLabelElement(graph, lineLabel);
            expect(labelElement, `label ${lineLabel}`).to.not.equal(undefined);

            assertBackgroundIsOpaque(labelElement, `line label`);
        });
    });

    it("stand-alone label component has an opaque mask background by default", () => {
        const labelText = "STANDALONE_LABEL";

        postDoenetML(`
  <text name="loaded">loaded</text>

  <graph name="g" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <label anchor="(0,0)">${labelText}</label>
  </graph>
        `);

        cy.get("#loaded").should("have.text", "loaded");

        cy.window().should((win) => {
            const graph = win.document.querySelector(cesc("#g"));
            expect(graph, "graph").to.not.equal(null);

            const labelElement = findLabelElement(graph, labelText);
            expect(labelElement, `label ${labelText}`).to.not.equal(undefined);

            assertBackgroundIsOpaque(labelElement, `standalone label`);
        });
    });

    it("point label keeps an opaque mask background in dark mode", () => {
        const pointLabel = "POINT_ON_AXIS_LABEL_DARK";

        postDoenetML(
            `
  <text name="loaded">loaded</text>

  <graph name="g" xmin="-10" xmax="10" ymin="-10" ymax="10">
    <point name="P" labelIsName="false">
      (0, 3)
      <label>${pointLabel}</label>
    </point>
  </graph>
        `,
            "dark",
        );

        cy.get("#loaded").should("have.text", "loaded");
        cy.get('[data-theme="dark"]').should("exist");

        cy.window().should((win) => {
            const graph = win.document.querySelector(cesc("#g"));
            expect(graph, "graph").to.not.equal(null);

            const labelElement = findLabelElement(graph, pointLabel);
            expect(labelElement, `label ${pointLabel}`).to.not.equal(undefined);

            // In dark mode the mask background resolves `var(--canvas)` to the
            // dark canvas color, which must still be opaque (not transparent)
            // so the label stays legible over axes/grid lines.
            assertBackgroundIsOpaque(labelElement, `dark-mode point label`);
        });
    });
});
