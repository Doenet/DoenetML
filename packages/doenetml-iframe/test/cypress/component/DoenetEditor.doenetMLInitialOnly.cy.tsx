import React, { useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

const INITIAL = "<p>initial-content</p>";
const REPLACEMENT = "<p>replacement-content</p>";

function Harness() {
    const [doenetML, setDoenetML] = useState(INITIAL);
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <button
                data-test="change-doenetml"
                onClick={() => setDoenetML(REPLACEMENT)}
            >
                Change doenetML prop
            </button>
            <DoenetEditor
                doenetML={doenetML}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — doenetML is initial-only", () => {
    it("changing the doenetML prop after mount does not reload the iframe and does not overwrite edits", () => {
        cy.mount(<Harness />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("contain.text", "initial-content");

        // Stamp the iframe document.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                "INITIAL";
        });

        // Edit the editor.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type("{ctrl}{end}", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type(" my-edit", { force: true });

        // Change the doenetML prop.
        cy.get("[data-test=change-doenetml]").click();

        // The iframe document was NOT reloaded.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            ).to.equal("INITIAL");
        });

        // The editor still shows the original content plus the user's edit
        // — the new doenetML prop value is intentionally ignored.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .should("contain.text", "initial-content")
            .and("contain.text", "my-edit")
            .and("not.contain.text", "replacement-content");
    });
});
