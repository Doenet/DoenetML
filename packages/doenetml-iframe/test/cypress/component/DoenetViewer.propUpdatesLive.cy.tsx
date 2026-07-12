import React, { useState } from "react";
import { DoenetViewer } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

// Rendering the document requires a full core-worker boot on top of the
// bundle evaluation; budget more than IFRAME_READY_TIMEOUT for it.
const CONTENT_TIMEOUT = 30_000;

const DARK_BG = "rgb(18, 18, 18)"; // #121212
const LIGHT_BG = "rgb(255, 255, 255)"; // white

function stampReloadMarker() {
    cy.get("iframe").then(($iframe) => {
        const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
        (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
            "INITIAL";
    });
}

function assertNotReloaded() {
    cy.get("iframe").then(($iframe) => {
        const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
        expect(
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            "iframe must not have reloaded",
        ).to.equal("INITIAL");
    });
}

describe("DoenetViewer (iframe wrapper) — serializable prop changes apply without reloading the iframe", () => {
    it("darkMode toggle updates the document in place (no reload)", () => {
        function Harness() {
            const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
            return (
                <div>
                    <button
                        data-test="toggle"
                        onClick={() =>
                            setDarkMode((m) =>
                                m === "light" ? "dark" : "light",
                            )
                        }
                    >
                        Toggle
                    </button>
                    <DoenetViewer
                        doenetML="<p>Hello prop updates</p>"
                        darkMode={darkMode}
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        // Wait for the document itself to render (core booted), so the
        // toggle below exercises a live update against a running viewer.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Hello prop updates");

        stampReloadMarker();

        cy.get("[data-test=toggle]").click();
        cy.get("iframe")
            .its("0.contentDocument.body", { timeout: 10_000 })
            .should("have.css", "background-color", DARK_BG);

        assertNotReloaded();

        cy.get("[data-test=toggle]").click();
        cy.get("iframe")
            .its("0.contentDocument.body", { timeout: 10_000 })
            .should("have.css", "background-color", LIGHT_BG);

        assertNotReloaded();

        // The document survived both toggles in the same realm.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .should("contain.text", "Hello prop updates");
    });

    it("render flip false→true starts the document in the same realm (no reload)", () => {
        function Harness() {
            const [render, setRender] = useState(false);
            return (
                <div>
                    <button data-test="show" onClick={() => setRender(true)}>
                        Show
                    </button>
                    <DoenetViewer
                        doenetML="<p>Deferred document</p>"
                        render={render}
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        // The viewer mounts with render=false: the srcdoc's loading
        // placeholder is replaced by the (empty) React render, and no
        // document content appears.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".doenet-loading", { timeout: CONTENT_TIMEOUT })
            .should("not.exist");
        cy.get("iframe")
            .its("0.contentDocument.body")
            .should("not.contain.text", "Deferred document");

        stampReloadMarker();

        // Flip render: historically this regenerated the srcdoc and reloaded
        // the iframe (a second full bundle parse); now it must start the
        // document inside the already-loaded realm.
        cy.get("[data-test=show]").click();

        cy.get("iframe")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Deferred document");

        assertNotReloaded();
    });

    it("a prop change during boot queues and applies once the iframe is ready", () => {
        function Harness() {
            const [darkMode, setDarkMode] = useState<"light" | "dark">("light");
            return (
                <div>
                    <button
                        data-test="go-dark"
                        onClick={() => setDarkMode("dark")}
                    >
                        Go dark
                    </button>
                    <DoenetViewer
                        doenetML="<p>Boot-window update</p>"
                        darkMode={darkMode}
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        // Change the prop immediately, long before the bundle finishes
        // evaluating — the update must be queued and replayed at iframeReady,
        // not lost (and not trigger a reload).
        cy.get("[data-test=go-dark]").click();

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Boot-window update");
        cy.get("iframe")
            .its("0.contentDocument.body", { timeout: 10_000 })
            .should("have.css", "background-color", DARK_BG);
    });
});
