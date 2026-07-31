import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// The check-work button is written half by the core and half by the renderer.
// Its resting label is `submitLabel`, a *content* state variable in the
// document's language; everything it said once pressed came from the chrome
// catalog, in the reader's. A `lang="es"` document read with `uiLocale="en"`
// therefore said "Revisar" and then "Correct" on one control.
//
// The whole control follows the document now, because an author can point at
// that label by name — "Pulsa el botón $ans.submitLabel" — and a sentence that
// names the button has to name what the button actually says. That chain is
// what these pin: the prose, the resting label and the verdict are one
// language, whatever the reader asked for.

const VIEWER_TIMEOUT = 15_000;

const ANSWER = `<answer name="ans">x</answer>`;

/**
 * The button, which carries both halves of the text under test.
 *
 * By class rather than by id: an `<answer>` delegates its button to whichever
 * input it created, so the id belongs to that generated input rather than to
 * the name the author wrote.
 */
const CHECK_WORK = ".check-work";

describe("the check-work button speaks the document's language", () => {
    it("stays Spanish through a submit, for an English reader", () => {
        // The reported case: the two locales deliberately disagree.
        cy.mount(
            <DoenetViewer
                doenetML={`<document lang="es">${ANSWER}</document>`}
                uiLocale="en"
                addVirtualKeyboard={false}
            />,
        );

        cy.get(CHECK_WORK, { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "Revisar",
        );
        cy.get(CHECK_WORK).click();
        cy.get(CHECK_WORK).should("contain.text", "Incorrecto");
    });

    it("names the button the same way the author's prose does", () => {
        // The reason the whole control moved rather than only half of it. An
        // author who writes "the button labeled $ans.submitLabel" is naming
        // the button; if the two disagreed the student would be told to press
        // something that isn't there.
        cy.mount(
            <DoenetViewer
                doenetML={`<document lang="es"><answer name="ans">x</answer><p name="prose">$ans.submitLabel</p></document>`}
                uiLocale="en"
                addVirtualKeyboard={false}
            />,
        );

        // Settle on the document's language before reading the prose: the
        // catalog loads on demand, so the first paint is English and `.then`
        // would capture that rather than what the reader ends up with.
        cy.get("#prose", { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "Revisar",
        );
        cy.get("#prose")
            .invoke("text")
            .then((prose) => {
                cy.get(CHECK_WORK).should("contain.text", prose.trim());
            });
    });

    it("keeps an authored label and the prose naming it in step", () => {
        // The author's own words are already immune to both locales; what
        // matters is that the button and the sentence still agree.
        cy.mount(
            <DoenetViewer
                doenetML={`<document lang="es"><answer name="ans" submitLabel="¿Listo?">x</answer><p name="prose">$ans.submitLabel</p></document>`}
                uiLocale="en"
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#prose", { timeout: VIEWER_TIMEOUT }).should(
            "have.text",
            "¿Listo?",
        );
        cy.get(CHECK_WORK).should("contain.text", "¿Listo?");
    });

    it("renders the same English as before when nothing declares a language", () => {
        cy.mount(<DoenetViewer doenetML={ANSWER} addVirtualKeyboard={false} />);

        cy.get(CHECK_WORK, { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "Check Work",
        );
        cy.get(CHECK_WORK).click();
        cy.get(CHECK_WORK).should("contain.text", "Incorrect");
    });

    it("keeps the button English when only the reader declares a language", () => {
        // The trade, on its most common path, pinned so it is not rediscovered
        // as a bug. An activity that declares nothing counts as English, so a
        // reader who set `uiLocale` alone used to get a Spanish verdict beside
        // the worker's English "Check Work" and now gets the control wholly in
        // English. Chrome no authored prose can name — the disclosure label —
        // still follows the reader, which is what makes this a choice rather
        // than the setting being ignored.
        cy.mount(
            <DoenetViewer
                doenetML={`${ANSWER}<solution name="sol"><p>respuesta</p></solution>`}
                uiLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        cy.get(CHECK_WORK, { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "Check Work",
        );
        cy.get("#sol_button").should("contain.text", "(clic para abrir)");

        cy.get(CHECK_WORK).click();
        cy.get(CHECK_WORK).should("contain.text", "Incorrect");
    });

    it("follows the host's documentLocale when the document declares none", () => {
        // The content language is the host's `documentLocale` prop, overridden
        // by an authored `<document lang>` and only then falling back to
        // English — so an activity that declares nothing still follows
        // whatever the host configured rather than stranding on English.
        cy.mount(
            <DoenetViewer
                doenetML={ANSWER}
                documentLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        cy.get(CHECK_WORK, { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "Revisar",
        );
        cy.get(CHECK_WORK).click();
        cy.get(CHECK_WORK).should("contain.text", "Incorrecto");
    });

    it("leaves the error box in the reader's language", () => {
        // The other half of the split, and the reason this is not "everything
        // inside the document follows the document". A diagnostic is addressed
        // to whoever is looking at the screen, and no authored prose ever
        // names it, so it still follows `uiLocale` (Doenet/DoenetML#1570).
        cy.mount(
            <DoenetViewer
                doenetML={`<document lang="es">\n<abc></abc></document>`}
                uiLocale="en"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("Invalid component type", { timeout: VIEWER_TIMEOUT });
        cy.get("body").should("not.contain.text", "Tipo de componente");
    });

    it("announces the verdict once, in one language", () => {
        // `mathInput`, `textInput`, `fractionInput` and `choiceInput` append
        // the validation state to the input's accessible description, and the
        // button beside it announces the same verdict through its own
        // `aria-live` region. A screen-reader user hears both, and is the only
        // one who does — so this is the reader most exposed to a split, and the
        // two have to agree.
        cy.mount(
            <DoenetViewer
                doenetML={`<document lang="es"><answer name="ans"><textInput name="ti" /><award>hola</award></answer></document>`}
                uiLocale="en"
                addVirtualKeyboard={false}
            />,
        );

        cy.get("#ti_input", { timeout: VIEWER_TIMEOUT }).type("mal");
        cy.get(CHECK_WORK).click();

        cy.get(CHECK_WORK).should("contain.text", "Incorrecto");
        cy.get("#ti_input").should("have.attr", "aria-label", "(Incorrecto)");
    });
});
