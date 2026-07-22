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

// Records every `initializedCallback` invocation along with the closure
// version that received it, so we can verify (a) the core re-initializes on
// a doenetML change and (b) the *latest* callback identity is the one
// invoked (function-prop identity changes propagate live).
declare global {
    interface Window {
        __initCalls: { version: number }[];
    }
}

const FIRST_DOENETML = "<p>First version text</p>";
const SECOND_DOENETML = "<p>Second version text</p>";

function Harness() {
    const [doenetML, setDoenetML] = useState(FIRST_DOENETML);
    const [version, setVersion] = useState(1);
    return (
        <div>
            <button
                data-test="bump-version"
                onClick={() => setVersion((v) => v + 1)}
            >
                Bump callback version
            </button>
            <button
                data-test="change-doenetml"
                onClick={() => setDoenetML(SECOND_DOENETML)}
            >
                Change DoenetML
            </button>
            <span data-test="version">{version}</span>
            <DoenetViewer
                doenetML={doenetML}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                initializedCallback={() => {
                    window.__initCalls.push({ version });
                }}
            />
        </div>
    );
}

describe("DoenetViewer (iframe wrapper) — doenetML changes re-initialize the core in the same realm", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.__initCalls = [];
        });
    });

    it("re-renders the new document without reloading the iframe, invoking the latest callback identity", () => {
        cy.mount(<Harness />);

        // First document boots and reports initialized via the version-1
        // closure.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "First version text");
        cy.window()
            .its("__initCalls", { timeout: 4000 })
            .should("have.length.at.least", 1);
        cy.window().then((win) => {
            expect(
                win.__initCalls[0].version,
                "initial boot uses the initial closure",
            ).to.equal(1);
        });

        // Stamp the iframe document — if the iframe reloads, this property
        // disappears.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                "INITIAL";
        });

        // Bump the callback identity (an identity-only change: no reload, no
        // re-render inside the iframe), then change the doenetML. The core
        // must re-initialize inside the same realm and report through the
        // *new* closure.
        cy.get("[data-test=bump-version]").click();
        cy.get("[data-test=version]").should("have.text", "2");
        cy.window().then((win) => {
            win.__initCalls = [];
        });

        cy.get("[data-test=change-doenetml]").click();

        cy.get("iframe")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Second version text");
        cy.get("iframe")
            .its("0.contentDocument.body")
            .should("not.contain.text", "First version text");

        // Same iframe document — the multi-MB bundle was not re-parsed.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
                "iframe must not have reloaded",
            ).to.equal("INITIAL");
        });

        // The re-initialization invoked the bumped closure, not the
        // mount-time one.
        cy.window()
            .its("__initCalls", { timeout: 4000 })
            .should("have.length.at.least", 1);
        cy.window().then((win) => {
            const last = win.__initCalls[win.__initCalls.length - 1];
            expect(
                last.version,
                "re-init reports through the latest callback identity",
            ).to.equal(2);
        });
    });
});
