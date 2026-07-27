import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";

// The tooltip over a squiggle in the editor is the last place a diagnostic
// was still English regardless of who was reading (Doenet/DoenetML#1569's
// "not in scope"). The language server that produces these has no locale and
// renders nothing; the viewer supplies the formatter and the headings, and
// this asserts they arrive.
//
// `<abc></abc>` is squiggled by the language server's own schema check — the
// family that gained codes in #1569 — and that is the copy under test: it has
// no worker counterpart to be translated on its behalf, so before this it
// stayed English no matter what.

const EDITOR_TIMEOUT = 30_000;

function Editor({ uiLocale }: { uiLocale?: string }) {
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <DoenetEditor
                doenetML={"<abc></abc>"}
                addVirtualKeyboard={false}
                initialOpenTab={null}
                {...(uiLocale === undefined ? {} : { uiLocale })}
            />
        </div>
    );
}

/**
 * Hover the first squiggle and yield the tooltip it opens.
 *
 * CodeMirror's hover tooltip tracks the pointer's coordinates and opens only
 * once it has been still for `hoverTime`, so a bare `mouseover` on the marked
 * text never opens it — the move has to land on the editor's content at the
 * squiggle's own position, and then wait.
 */
function hoverFirstSquiggle() {
    cy.get(".cm-lintRange", { timeout: EDITOR_TIMEOUT })
        .first()
        .then(($mark) => {
            const box = $mark[0].getBoundingClientRect();
            const clientX = box.left + box.width / 2;
            const clientY = box.top + box.height / 2;
            cy.get(".cm-content").trigger("mousemove", {
                clientX,
                clientY,
                force: true,
            });
        });
    return cy.get(".cm-lint-tooltip", { timeout: EDITOR_TIMEOUT });
}

describe("the editor's diagnostic tooltip follows the reader's language", () => {
    it("renders a schema violation and its heading in Spanish", () => {
        cy.mount(<Editor uiLocale="es" />);

        hoverFirstSquiggle().should(
            "contain.text",
            "no es un elemento de Doenet reconocido",
        );
        cy.get(".cm-lint-tooltip .heading").should(
            "contain.text",
            "Advertencia",
        );
        cy.get(".cm-lint-tooltip").should(
            "not.contain.text",
            "is not a recognized Doenet element",
        );
    });

    it("renders the same violation in English when no locale is set", () => {
        cy.mount(<Editor />);

        hoverFirstSquiggle().should(
            "contain.text",
            "is not a recognized Doenet element",
        );
        cy.get(".cm-lint-tooltip .heading").should("contain.text", "Warning");
    });
});
