import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { plainTextIncluding } from "./utils/bidi";

// The red error box rendered *inside* the document used to stay English while
// the same diagnostic in the Diagnostics panel was translated — same error,
// same reader, two languages (Doenet/DoenetML#1568). `_error` has carried the
// diagnostic's code and arguments since #1556, but not as `forRenderer`, so
// the renderer had nothing but the English sentence the worker wrote.
//
// What is asserted here is the rendering itself, which is the half a worker
// test cannot see: that the box reads in the reader's language, that the
// "found on line" line under it does too, and that a box whose code the
// reader's catalogs cannot resolve still shows the English on the record.

/** Long enough for the inline worker to boot and compile the document. */
const VIEWER_TIMEOUT = 15_000;

/** The box `_error.tsx` draws, identified by the border color it alone uses. */
const ERROR_BOX = "[style*='mainRed']";

/**
 * Assert some error box on the page contains `text`.
 *
 * Ignores bidi isolation marks: the location line puts its line number in a
 * placeable, and the chrome isolates placeables in every language but English.
 */
function errorBoxContains(text: string) {
    return cy
        .get(ERROR_BOX, { timeout: VIEWER_TIMEOUT })
        .should(plainTextIncluding(text));
}

/**
 * A `<select>` that names a variant no `<option>` claims, so it replaces
 * itself with an error box rather than warning beside one.
 */
const SELECT_WITH_MISSING_VARIANT =
    '\n<variantControl variantNames="uno dos" />\n<select numToSelect="1">\n  <option selectForVariants="uno"><p>x</p></option>\n</select>';

describe("the in-document error box follows the reader's language", () => {
    it("renders a coded error in Spanish, location line and all", () => {
        // Line 2 on purpose: the location line is a separate message with a
        // line number in it, and a translation has to be free to reorder the
        // whole sentence around that number.
        cy.mount(
            <DoenetViewer
                doenetML={"\n<abc></abc>"}
                uiLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Tipo de componente no válido");
        errorBoxContains("Encontrado en la línea 2");
        // The English it replaced is gone rather than shown beside it.
        cy.get("body").should("not.contain.text", "Invalid component type");
        cy.get("body").should("not.contain.text", "Found on line");
    });

    it("renders the same error in English when no locale is set", () => {
        cy.mount(
            <DoenetViewer
                doenetML={"\n<abc></abc>"}
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Invalid component type");
        errorBoxContains("Found on line 2");
    });

    it("says so when the error spans more than one line", () => {
        cy.mount(
            <DoenetViewer
                doenetML={"\n<abc\n></abc>"}
                uiLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Encontrado en las líneas 2 a 3");
    });

    it("renders the box a `<select>` replaces itself with in Spanish too", () => {
        // This box was the exception: `<select>`'s `errorMessage` was a
        // finished English string with no code behind it, so a Spanish page
        // showed one English box with a Spanish heading over it. It carries a
        // code now, like every other error (#1581).
        cy.mount(
            <DoenetViewer
                doenetML={SELECT_WITH_MISSING_VARIANT}
                uiLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Se especifican variantes para select");
        errorBoxContains("Encontrado en");
        cy.get("body").should(
            "not.contain.text",
            "Some variants are specified for select",
        );
    });

    it("falls back to the English on the record when the catalog has no answer", () => {
        // The renderer treats an error whose code the negotiated catalogs
        // cannot resolve exactly as it treats one with no code at all: the
        // formatter hands the record's own `message` straight back. It is the
        // path every locale takes for a diagnostic nobody has translated yet.
        //
        // `qaa` is from the ISO 639-3 range reserved for local use (qaa–qtz),
        // so no catalog can ever claim it. This test used to say `fr` and
        // meant the same thing, until French became a real catalog and
        // started answering — a reserved tag is the version of the assertion
        // that cannot rot.
        cy.mount(
            <DoenetViewer
                doenetML={SELECT_WITH_MISSING_VARIANT}
                uiLocale="qaa"
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Some variants are specified for select");
    });
});
