import React from "react";
import { DoenetEditor } from "../../../src/doenetml-inline-worker";
import { stripBidiIsolates } from "./utils/bidi";

// The context-help panel had no `useT()` in it, so it stayed English inside an
// otherwise Spanish editor (Doenet/DoenetML#1580). Most of it is sentences
// with something in `<code>` in the middle — "`$m` is a reference to
// `<math>`" — which are one message each with the fragments as arguments, put
// back as React nodes after Fluent has formatted the sentence. What is
// asserted here is that the sentence comes out whole: the words translated,
// the fragments still marked up, and no marker left in the text.

const EDITOR_VIEWPORT = { height: "500px", width: "900px" };

function mountHelp(doenetML: string, uiLocale?: string) {
    cy.mount(
        <div style={EDITOR_VIEWPORT}>
            <DoenetEditor
                doenetML={doenetML}
                initialOpenTab="help"
                addVirtualKeyboard={false}
                {...(uiLocale ? { uiLocale } : {})}
            />
        </div>,
    );
}

function focusEditorAtEnd() {
    cy.get(".cm-content")
        .should("be.visible")
        .click()
        .type("{ctrl+end}", { force: true });
}

describe("the context-help panel follows the reader's language", () => {
    it("translates the placeholder and keeps its code fragment marked up", () => {
        mountHelp("", "es");

        cy.get(".help-placeholder", { timeout: 15_000 }).should(
            "contain.text",
            "Coloque el cursor",
        );
        // The fragment is still a `<code>` rather than plain text folded into
        // the sentence, and the marker standing in for it is gone.
        cy.get(".help-placeholder code").should("have.text", "$ref.property");
        cy.get(".help-placeholder")
            .invoke("text")
            .should("not.contain", "\u0000");
    });

    it("translates a reference sentence around the names it quotes", () => {
        // Driven from the autocomplete popup, the way the English spec beside
        // this one reaches `refName` help.
        mountHelp(`<math name="m">x</math>\n`, "es");
        focusEditorAtEnd();
        cy.get(".cm-content").type("$", { force: true });
        cy.get(".cm-tooltip-autocomplete", { timeout: 15_000 }).should(
            "be.visible",
        );
        cy.get(".cm-tooltip-autocomplete .cm-completionLabel")
            .contains("m")
            .trigger("mouseover");

        cy.get(".help-ref-sentence")
            .invoke("text")
            // Both names are placeables, and U+2069 is not whitespace as far
            // as `\s` is concerned, so the marks have to come out before the
            // sentence matches.
            .then(stripBidiIsolates)
            .should("match", /\$m\s+es una referencia a\s+<math>/);
        // The names inside the sentence are identifiers, still in `<code>`,
        // and still spelled the way the author wrote them.
        cy.get(".help-ref-sentence code").should("contain.text", "$m");
    });

    it("translates an attribute's detail labels", () => {
        mountHelp("", "es");
        focusEditorAtEnd();
        cy.get(".cm-content").type("<math simplify", { force: true });
        cy.get(".cm-content").type("{esc}", { force: true });

        cy.get(".help-attribute-name", { timeout: 15_000 }).should(
            "have.text",
            "simplify",
        );
        cy.get(".help-kind-label").should("have.text", "atributo");
        cy.get(".help-detail-label").should("contain.text", "Valor");
        cy.get(".help-panel").should("not.contain.text", "Allowed values");
    });

    it("renders the same English as before when nothing asks for another language", () => {
        mountHelp("", undefined);

        cy.get(".help-placeholder", { timeout: 15_000 })
            .invoke("text")
            .should(
                "eq",
                "Place cursor on a tag name, attribute, or $ref.property for documentation.",
            );
    });
});
