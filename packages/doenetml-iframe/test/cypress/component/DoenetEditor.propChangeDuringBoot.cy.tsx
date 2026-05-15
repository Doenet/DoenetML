import React, { useEffect, useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// Flips `readOnly` from false to true in a synchronous mount-time effect, so
// the prop change is committed long before the iframe finishes loading (the
// standalone bundle takes several seconds to evaluate). This exercises the
// `pendingActions` queue path in the wrapper: the update is enqueued while
// `editorIframeRef.current` is still null and must be replayed once
// `iframeReady` fires.
function Harness() {
    const [readOnly, setReadOnly] = useState(false);
    useEffect(() => {
        setReadOnly(true);
    }, []);
    return (
        <div style={{ height: "600px", width: "900px" }}>
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

describe("DoenetEditor (iframe wrapper) — prop change during iframe boot", () => {
    it("a serializable prop change that fires before iframeReady is applied once the iframe loads", () => {
        cy.mount(<Harness />);

        // The harness has already flipped the state by the time React mounts
        // it; the iframe boot still takes seconds, so the update sits in
        // `pendingActions` until `iframeReady` fires.
        cy.get("[data-test=read-only-state]").should("have.text", "true");

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // If the queued update was replayed, the editor is read-only.
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
