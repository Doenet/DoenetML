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

/**
 * Comfortably longer than the window in which the viewer will read a tray
 * press as the cause of a blur, so a press made after it is not taken for one
 * made during it — and long enough afterwards for a press that should type
 * nothing to have had its chance to type something.
 */
const SETTLE_MS = 500;

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
            {/*
             * A key sent its commands and nothing else: its own `onClick`
             * called `stopPropagation`, so the root's never ran for it. The
             * `accessed` that accompanies a key press is the one from the
             * root's `onMouseDown`, above.
             */}
            <button
                data-test="legacy-key-x"
                onClick={() => post([{ type: "type", command: "x" }])}
            >
                x
            </button>
            {/*
             * The old tray's own controls — its open and close buttons, and
             * the tray surface between the keys — sent no key at all: they
             * sent `accessed` from the root's `onMouseDown` and again from its
             * `onClick`, since only the keys stopped propagation.
             */}
            <button data-test="legacy-tray-control" onClick={postAccessed}>
                tray
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

    it("types nothing once the reader has left the input of their own accord", () => {
        cy.mount(<Harness />);

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("exist")
            .click();

        cy.get("[data-test=legacy-key-x]").click();

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "x");

        // The reader moves on to the surrounding text, which takes no focus of
        // its own — the same shape of blur the tray causes, and all the viewer
        // has to tell them apart by is how long ago it happened.
        viewerBody().find(".para").click("left");
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("not.match", "textarea");

        // Long enough that the next press cannot be the cause of that blur.
        cy.wait(SETTLE_MS);
        cy.get("[data-test=legacy-key-x]").click();
        cy.wait(SETTLE_MS);

        // The key belonged to no input, so it typed nowhere, and nothing
        // pulled the caret back into an input the reader had left.
        viewerBody()
            .find(".mq-editable-field")
            .should("contain.text", "x")
            .should("not.contain.text", "xx");
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("not.match", "textarea");
    });

    it("gives the caret back after a tray press that sends no key", () => {
        cy.mount(<Harness />);

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("exist")
            .click();

        // Opening this tray is a press on it like any other: it takes focus,
        // and sends no key. This is the ordinary way a reader starts — focus
        // the input, then reach for the keyboard — so the caret has to come
        // back, or the first key they press afterwards types nowhere.
        cy.get("[data-test=legacy-tray-control]").click();
        cy.wait(SETTLE_MS);

        viewerBody().find(".mq-editable-field").should("not.contain.text", "x");
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("match", "textarea");

        // Long enough afterwards to be well outside the window in which a key
        // is matched to a blur: this one types because the input holds the
        // caret again, not because anything was recorded on its behalf.
        cy.get("[data-test=legacy-key-x]").click();
        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "x");
    });

    it("does not pull the caret back into an input the reader has left", () => {
        cy.mount(<Harness />);

        viewerBody()
            .find(".mq-editable-field", { timeout: CONTENT_TIMEOUT })
            .should("exist")
            .click();

        // The reader moves on to the surrounding text, which takes no focus of
        // its own — the same shape of blur a press on this tray causes.
        viewerBody().find(".para").click("left");
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("not.match", "textarea");

        // Long enough that the next press cannot be the cause of that blur.
        cy.wait(SETTLE_MS);
        cy.get("[data-test=legacy-tray-control]").click();
        cy.wait(SETTLE_MS);

        // The press took no caret from this input, so it has none to give
        // back, and the input is not left holding the keyboard either.
        cy.get("iframe")
            .its("0.contentDocument.activeElement")
            .should("not.match", "textarea");
        cy.get("[data-test=legacy-key-x]").click();
        cy.wait(SETTLE_MS);
        viewerBody().find(".mq-editable-field").should("not.contain.text", "x");
    });
});
