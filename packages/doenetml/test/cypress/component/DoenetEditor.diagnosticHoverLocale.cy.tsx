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

/** Long enough for the language server to start and answer the first check. */
const EDITOR_TIMEOUT = 15_000;

function Editor({
    uiLocale,
    doenetML = "<abc></abc>",
}: {
    uiLocale?: string;
    doenetML?: string;
}) {
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <DoenetEditor
                doenetML={doenetML}
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

/**
 * Move the pointer off the squiggle, so the next `hoverFirstSquiggle` is a
 * fresh arrival there rather than a move to where the pointer already is.
 */
function unhover() {
    cy.get(".cm-content").trigger("mousemove", {
        clientX: 0,
        clientY: 0,
        force: true,
    });
    cy.get(".cm-lint-tooltip").should("not.exist");
}

/** An editor whose reader picks a language after it is already up. */
function EditorWithLanguageSwitch() {
    const [uiLocale, setUiLocale] = React.useState<string | undefined>(
        undefined,
    );
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <button
                data-cy="switch-to-spanish"
                onClick={() => setUiLocale("es")}
            >
                español
            </button>
            <DoenetEditor
                doenetML="<abc></abc>"
                addVirtualKeyboard={false}
                initialOpenTab={null}
                {...(uiLocale === undefined ? {} : { uiLocale })}
            />
        </div>
    );
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

    it("follows an authored `<document lang>` when the host sets no locale", () => {
        // The language the tooltip needs is the one the *viewer* resolved:
        // `uiLocale` falls back to the content's language, and only the viewer
        // has parsed the source far enough to know it. Getting this from the
        // editor's own props instead would put the hover in English while the
        // Diagnostics tab beside it, whose records the viewer rendered, is in
        // Spanish.
        cy.viewport(1000, 600);
        cy.mount(
            <Editor doenetML={'<document lang="es"><abc></abc></document>'} />,
        );

        // Wait for the viewer to render before hovering. It is what parses the
        // source, and replacing the diagnostics with their Spanish rendering
        // closes any tooltip open at the time — the same as any other edit
        // does. Its red error box is the signal that it has resolved Spanish.
        cy.contains("[style*='mainRed']", "Tipo de componente no válido", {
            timeout: EDITOR_TIMEOUT,
        });

        hoverFirstSquiggle().should(
            "contain.text",
            "no es un elemento de Doenet reconocido",
        );
        cy.get(".cm-lint-tooltip .heading").should(
            "contain.text",
            "Advertencia",
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

    it("follows a language chosen after the editor is already up", () => {
        // A tooltip's words are built when its batch of diagnostics arrives,
        // not when it is drawn, so a squiggle that has already been checked
        // would keep reading in the old language until the next edit unless
        // something says otherwise. What says so is `EditorViewer` handing
        // `CodeMirror` a presentation built from the new translator, which
        // redraws the diagnostics on screen without reconfiguring the editor.
        cy.mount(<EditorWithLanguageSwitch />);

        hoverFirstSquiggle().should(
            "contain.text",
            "is not a recognized Doenet element",
        );
        unhover();

        cy.get("[data-cy=switch-to-spanish]").click();

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
});
