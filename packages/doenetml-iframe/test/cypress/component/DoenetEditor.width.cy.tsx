import React, { useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

function Harness() {
    const [wide, setWide] = useState(false);
    return (
        <div style={{ height: "600px" }}>
            <button data-test="toggle-width" onClick={() => setWide((v) => !v)}>
                Toggle width
            </button>
            <span data-test="width-state">{wide ? "wide" : "narrow"}</span>
            <DoenetEditor
                doenetML="<p>hello</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                width={wide ? "900px" : "500px"}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — width change", () => {
    it("changes the iframe width without reloading and preserves editor state", () => {
        cy.mount(<Harness />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Confirm starting width.
        cy.get("iframe").should("have.css", "width", "500px");

        // Stamp the iframe document.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                "INITIAL";
        });

        // Type some text.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type("{ctrl}{end}", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type(" width-test", { force: true });

        // Toggle width.
        cy.get("[data-test=toggle-width]").click();
        cy.get("[data-test=width-state]").should("have.text", "wide");

        // Outer iframe width updated.
        cy.get("iframe").should("have.css", "width", "900px");

        // The iframe document was NOT reloaded.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            ).to.equal("INITIAL");
        });

        // Text we typed is still there.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .should("contain.text", "width-test");

        // Toggle back.
        cy.get("[data-test=toggle-width]").click();
        cy.get("iframe").should("have.css", "width", "500px");
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            ).to.equal("INITIAL");
        });
    });
});
