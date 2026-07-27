import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// The red error box rendered *inside* the document used to stay English while
// the same diagnostic in the Diagnostics panel was translated — same error,
// same reader, two languages (Doenet/DoenetML#1568). `_error` has carried the
// diagnostic's code and arguments since #1556, but not as `forRenderer`, so
// the renderer had nothing but the English sentence the worker wrote.
//
// What is asserted here is the rendering itself, which is the half a worker
// test cannot see: that the box reads in the reader's language, that the
// "found on line" line under it does too, and that an error with no code
// still shows the English it arrived with.

const VIEWER_TIMEOUT = 30_000;

/** The box `_error.tsx` draws, identified by the border color it alone uses. */
const ERROR_BOX = "[style*='mainRed']";

/** Assert some error box on the page contains `text`. */
function errorBoxContains(text: string) {
    return cy.contains(ERROR_BOX, text, { timeout: VIEWER_TIMEOUT });
}

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

    it("falls back to the English an uncoded error arrived with", () => {
        // `<select>`'s `errorMessage` still holds a finished English string
        // with no code behind it (#1518). It has to keep rendering exactly as
        // it does today; only the heading and the location line, which the
        // viewer owns, follow the reader.
        cy.mount(
            <DoenetViewer
                doenetML={
                    '\n<variantControl variantNames="uno dos" />\n<select numToSelect="1">\n  <option selectForVariants="uno"><p>x</p></option>\n</select>'
                }
                uiLocale="es"
                addVirtualKeyboard={false}
            />,
        );

        errorBoxContains("Some variants are specified for select");
        errorBoxContains("Encontrado en");
    });
});
