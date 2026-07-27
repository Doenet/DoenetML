import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// "Page 3 of 5" used to be assembled in this renderer: the word came from the
// worker via `pageLabel`, the word joining the counts was English written into
// the JSX, and nothing could reach it (Doenet/DoenetML#1572). The whole status
// is now one message composed in the worker, so what is asserted here is the
// half a worker test cannot see — that the sentence the reader actually gets
// is in one language from end to end.

const VIEWER_TIMEOUT = 30_000;

// Non-ASCII from the worker cannot be asserted here. Cypress serves this spec
// through a Vite dev server, and the dev server's `?raw` import of the worker
// bundle — which is where the message catalogs live — hands back Latin-1, so
// "Página" arrives as "PÃ¡gina". The shipped bundles are UTF-8 and correct;
// it is the harness that mis-decodes. So the assertions below turn on the
// ASCII parts of the Spanish ("de", "Anterior", "Hoja"), and the exact
// accented output is pinned by the worker's own tests, which run in Node.

const DOENETML = `
<paginatorControls name="pc" paginator="$pgn" />
<paginator name="pgn">
  <section><p>one</p></section>
  <section><p>two</p></section>
  <section><p>three</p></section>
</paginator>
`;

describe("the paginator's controls follow the document's language", () => {
    it("renders the status and both buttons in Spanish", () => {
        cy.mount(
            <DoenetViewer
                doenetML={DOENETML}
                documentLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("1 de 3", { timeout: VIEWER_TIMEOUT });
        cy.get("#pc_previous").should("have.text", "Anterior");
        cy.get("#pc_next").should("have.text", "Siguiente");
        // The English half-sentence is gone rather than shown beside it.
        cy.get("body").should("not.contain.text", "1 of 3");
    });

    it("renders it in English when the document declares no language", () => {
        cy.mount(
            <DoenetViewer doenetML={DOENETML} addVirtualKeyboard={false} />,
        );

        cy.contains("Page 1 of 3", { timeout: VIEWER_TIMEOUT });
        cy.get("#pc_previous").should("have.text", "Previous");
        cy.get("#pc_next").should("have.text", "Next");
    });

    it("keeps an authored label inside the translated sentence", () => {
        // The author's own word, in a sentence the catalog supplies the rest
        // of — the case that made composing this in the worker necessary.
        cy.mount(
            <DoenetViewer
                doenetML={DOENETML.replace(
                    'name="pc"',
                    'name="pc" pageLabel="Hoja"',
                )}
                documentLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("Hoja 1 de 3", { timeout: VIEWER_TIMEOUT });
    });
});
