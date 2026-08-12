import React from "react";
import { DoenetViewer } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// Rendering a document requires a core-worker boot on top of evaluating the
// bundle; budget more than IFRAME_READY_TIMEOUT for it.
const CONTENT_TIMEOUT = 30_000;

const DOENETML = '<p>Type here: <mathInput name="mi" /></p>';

/**
 * The keyboard tray as `@doenet/doenetml-iframe@0.7.21` shipped it — the
 * version deployed on doenet.org — reduced to the two behaviors that decide
 * whether a viewer can be typed into.
 *
 * Both are taken from that package's published `index.js`:
 *
 *   1. Its tray root carries `onMouseDown` and `onClick` handlers that send
 *      `{ type: "accessed", command: "", timestamp }`, and **no**
 *      `preventDefault` anywhere. So pressing a key focuses a real button in
 *      this document, which pulls focus out of the viewer's iframe.
 *   2. `ExternalVirtualKeyboard` forwards commands with
 *      `contentWindow.postMessage({ keyCommands, subject: "keyboard" }, "*")`.
 *
 * That pairing is not hypothetical: doenet.org installs the wrapper as
 * `^0.7.21` but serves the viewer from `@doenet/standalone@latest`, so
 * publishing a viewer puts a new viewer under this old tray until the site
 * redeploys.
 */
function LegacyKeyboardTray({
    viewerRef,
}: {
    viewerRef: React.RefObject<HTMLDivElement | null>;
}) {
    function post(keyCommands: unknown[]) {
        const iframe = viewerRef.current?.querySelector("iframe");
        iframe?.contentWindow?.postMessage(
            { keyCommands, subject: "keyboard" },
            "*",
        );
    }

    function postAccessed() {
        post([{ type: "accessed", command: "", timestamp: +new Date() }]);
    }

    return (
        // No `preventDefault`: this is what the old tray did, and the reason
        // the viewer's input blurs when a key is pressed.
        <div id="legacy-keyboard-tray" onMouseDown={postAccessed}>
            <button
                data-test="legacy-key-x"
                onClick={() => {
                    post([{ type: "type", command: "x" }]);
                    // The old tray's root `onClick` fired after the key's own.
                    postAccessed();
                }}
            >
                x
            </button>
        </div>
    );
}

function Harness() {
    const viewerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div>
            <LegacyKeyboardTray viewerRef={viewerRef} />
            <div ref={viewerRef}>
                <DoenetViewer
                    doenetML={DOENETML}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                />
            </div>
        </div>
    );
}

/** The viewer iframe's document body, once the document has rendered. */
function viewerBody() {
    return cy
        .get("iframe", { timeout: IFRAME_READY_TIMEOUT })
        .its("0.contentDocument.body")
        .should("not.be.empty")
        .then(cy.wrap);
}

describe("DoenetViewer (iframe wrapper) — a keyboard tray from before it declined focus", () => {
    it("types into the math input, and gives it the caret back", () => {
        cy.mount(<Harness />);

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("exist")
            .click();

        // The reader is editing the input: it holds focus inside the iframe.
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("match", "textarea");

        // Pressing a key on this tray focuses a button out here, which blurs
        // the input in there. The key arrives afterwards by `postMessage`.
        cy.get("[data-test=legacy-key-x]").click();

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "x");

        // And the caret is back in the input, so the reader can keep going —
        // the old tray left focus on its own button.
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("match", "textarea");

        // A second key proves the first was not a one-off: the input has to
        // still be claiming the keyboard after the round trip.
        cy.get("[data-test=legacy-key-x]").click();

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "xx");
    });
});
