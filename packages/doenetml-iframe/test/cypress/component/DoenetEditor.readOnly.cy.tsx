import React, { useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

function Harness({ initialReadOnly = false }: { initialReadOnly?: boolean }) {
    const [readOnly, setReadOnly] = useState(initialReadOnly);
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <button
                data-test="toggle-read-only"
                onClick={() => setReadOnly((v) => !v)}
            >
                Toggle readOnly
            </button>
            <span data-test="read-only-state">{String(readOnly)}</span>
            <DoenetEditor
                doenetML="<p>hello</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                readOnly={readOnly}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — readOnly toggle", () => {
    it("toggling readOnly does not reload the iframe and preserves CodeMirror state", () => {
        cy.mount(<Harness />);

        // Wait for the iframe's CodeMirror to render.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Stamp the iframe document — if the iframe reloads, this property
        // disappears.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                "INITIAL";
        });

        // Type some text into the editor. `{ctrl}{end}` and `EXTRA` are sent
        // as separate `.type()` calls so the Ctrl modifier is released first;
        // otherwise " EXTRA" is interpreted as Ctrl-chord characters.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type("{ctrl}{end}", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type(" appended-text", { force: true });

        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .should("contain.text", "appended-text");

        // Toggle readOnly on.
        cy.get("[data-test=toggle-read-only]").click();
        cy.get("[data-test=read-only-state]").should("have.text", "true");

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
            .should("contain.text", "appended-text");

        // Typing should be rejected in read-only mode.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .then(($el) => {
                const before = $el.text();
                cy.wrap($el)
                    .click()
                    .type(" SHOULD_NOT_APPEAR", { force: true });
                cy.wrap($el).invoke("text").should("eq", before);
            });

        // Toggle back off.
        cy.get("[data-test=toggle-read-only]").click();
        cy.get("[data-test=read-only-state]").should("have.text", "false");

        // Still the same iframe document.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            ).to.equal("INITIAL");
        });

        // Editor is editable again.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type(" RESUMED", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .should("contain.text", "RESUMED");
    });

    it("initial readOnly=true is honored", () => {
        cy.mount(<Harness initialReadOnly={true} />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .then(($el) => {
                const before = $el.text();
                cy.wrap($el)
                    .click()
                    .type(" SHOULD_NOT_APPEAR", { force: true });
                cy.wrap($el).invoke("text").should("eq", before);
            });
    });
});
