import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";
import { plainTextIncluding, stripBidiIsolates } from "./utils/bidi";

// The editor chrome had no `useT()` in it at all, so a reader who asked for
// Spanish got a Spanish document inside an English editor — worst in the
// Diagnostics panel, where "Line #2" sat in English beside a translated
// message (Doenet/DoenetML#1580).
//
// What is asserted here is the decision as much as the strings: the *whole*
// editor binds to one language, and that language is the one the viewer below
// resolved — including when the author declared it in the source and the host
// said nothing.

const VIEWER_TIMEOUT = 15_000;

function mountEditor(props: Record<string, unknown>) {
    cy.mount(
        <div style={{ height: "600px", width: "900px" }}>
            <DoenetEditor
                height="600px"
                width="900px"
                addVirtualKeyboard={false}
                {...(props as any)}
            />
        </div>,
    );
}

describe("the editor chrome follows the reader's language", () => {
    it("renders the footer, the panel and the controls in Spanish", () => {
        mountEditor({
            doenetML: `<p>Hola</p>`,
            uiLocale: "es",
            initialOpenTab: "errors",
        });

        // The footer's tabs.
        cy.get('[data-test="footer-tab-errors"]', {
            timeout: VIEWER_TIMEOUT,
        }).should("have.attr", "title", "Errores");
        cy.get('[data-test="footer-tab-warnings"]').should(
            "have.attr",
            "title",
            "Advertencias",
        );
        // The panel behind them.
        cy.contains("Sin errores");
        // And the controls above the viewer.
        cy.get('[data-test="Viewer Update Button"]').should(
            "contain.text",
            "Reiniciar",
        );
    });

    it("says where a diagnostic was found in the same language as the diagnostic", () => {
        // The line this was filed for: a translated message on the same line
        // as an untranslated label.
        mountEditor({
            doenetML: `<p>ok</p>\n<abc />`,
            uiLocale: "es",
            initialOpenTab: "errors",
        });

        // The line number is a placeable, and the chrome isolates placeables
        // in every language but English.
        cy.get("body", { timeout: VIEWER_TIMEOUT }).should(
            plainTextIncluding("Línea n.º 2"),
        );
        cy.get("body").should("not.contain.text", "Line #2");
    });

    it("takes the language from a `<document lang>` the host never mentioned", () => {
        // The editor chrome sits under the provider built from the props
        // alone, which never sees an authored language. Binding it to what the
        // viewer resolved is what makes this work.
        mountEditor({
            doenetML: `<document lang="es"><p>Hola</p></document>`,
            initialOpenTab: "errors",
        });

        cy.contains("Sin errores", { timeout: VIEWER_TIMEOUT });
        cy.get('[data-test="footer-tab-errors"]').should(
            "have.attr",
            "title",
            "Errores",
        );
    });

    it("keeps the link inside the heading a translation writes around it", () => {
        // The one sentence in this panel with markup in the middle of it. The
        // linked name goes to the catalog as a marker rather than as its own
        // text, so what is checked is that the sentence came back translated
        // *and* that the anchor landed back inside it.
        mountEditor({
            doenetML: `<p>Hola</p>`,
            uiLocale: "es",
            initialOpenTab: "accessibility",
        });

        cy.contains("h3", "Infracciones de accesibilidad", {
            timeout: VIEWER_TIMEOUT,
        }).within(() => {
            cy.get("a").should("have.text", "WCAG AA");
        });
        // `WCAG AA` is a placeable — it is the name of a standard and stays
        // in English — so the parentheses no longer hug it byte-for-byte.
        cy.get("h3").should(
            plainTextIncluding("Infracciones de accesibilidad (WCAG AA)"),
        );
    });

    it("renders it in English when nothing asks for another language", () => {
        mountEditor({
            doenetML: `<p>hello</p>`,
            initialOpenTab: "errors",
        });

        cy.contains("No Errors", { timeout: VIEWER_TIMEOUT });
        cy.get('[data-test="footer-tab-errors"]').should(
            "have.attr",
            "title",
            "Errors",
        );
        cy.get('[data-test="Viewer Update Button"]').should(
            "contain.text",
            "Reset",
        );
    });

    it("translates the update button when the word changes, not when it is stored", () => {
        // The word travels through React state, so localizing it means storing
        // which of the two states the button is in and translating at render.
        mountEditor({
            doenetML: `<p>Hola</p>`,
            uiLocale: "es",
            initialOpenTab: "errors",
        });

        cy.get('[data-test="Viewer Update Button"]', {
            timeout: VIEWER_TIMEOUT,
        }).should("contain.text", "Reiniciar");

        cy.get(".cm-content").type("x");

        cy.get('[data-test="Viewer Update Button"]').should(
            "contain.text",
            "Actualizar",
        );
        cy.get('[data-test="Viewer Update Button"]')
            .invoke("attr", "title")
            // Both the verb and the shortcut are placeables, so the anchors
            // and the space between them only line up once the isolation
            // marks are out.
            .then(stripBidiIsolates)
            .should("match", /^Actualizar el visor (cmd|ctrl)\+s$/);
    });
});
