import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// A table's and a figure's name came from the worker in the document's
// language, and the `": "` joining it to the authored title or caption was
// written into these renderers, where no catalog could reach it
// (Doenet/DoenetML#1582). The whole prefix is one message now, so what is
// asserted here is what a worker test cannot see: the text the reader gets,
// and the markup the separator ended up inside.

const VIEWER_TIMEOUT = 15_000;

// The figure is "Figure 2" rather than "Figure 1": tables and figures share
// the sectioning counter, so the table above it takes the first number.
const DOENETML = `
<table name="t">
  <title>Resultados</title>
  <tabular><row><cell>1</cell></row></tabular>
</table>
<figure name="f">
  <image source="doenet:a" />
  <caption>Una imagen</caption>
</figure>
`;

describe("a table's and a figure's caption separator follows the document's language", () => {
    it("punctuates the join from the catalog in Spanish", () => {
        cy.mount(
            <DoenetViewer
                doenetML={DOENETML}
                documentLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("Tabla 1: Resultados", { timeout: VIEWER_TIMEOUT });
        cy.contains("Figura 2: Una imagen");
    });

    it("renders the same text as before when the document declares no language", () => {
        cy.mount(
            <DoenetViewer doenetML={DOENETML} addVirtualKeyboard={false} />,
        );

        cy.contains("Table 1: Resultados", { timeout: VIEWER_TIMEOUT });
        cy.contains("Figure 2: Una imagen");
    });

    it("puts the separator inside the bold name", () => {
        // The decision #1582 needed: the separator is part of the name the
        // catalog composes, so it is emphasized with it rather than sitting
        // between two nodes. Pinned because it is the one thing about every
        // existing document's markup that this changed.
        cy.mount(
            <DoenetViewer doenetML={DOENETML} addVirtualKeyboard={false} />,
        );

        cy.contains("strong", "Table 1", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Table 1: ",
        );
        cy.contains("strong", "Figure 2").should("have.text", "Figure 2: ");
    });

    it("leaves the name bare when nothing follows it", () => {
        cy.mount(
            <DoenetViewer
                doenetML={`<table name="t"><tabular><row><cell>1</cell></row></tabular></table>`}
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("strong", "Table 1", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "Table 1",
        );
    });
});
