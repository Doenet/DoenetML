import React from "react";
import { DoenetEditor, DoenetViewer } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// #2383: an `xmlns` naming a DoenetML version whose bundle cannot be loaded
// (mistyped, or never published) must not leave the iframe blank. The
// wrapper falls back to the host-specified bundle. Before the fix the
// failure was only noticed when the iframe's 60 s poll for the bundle timed
// out; the bundle `<script>`'s `onerror` now reports it at once, so the
// fallback has to boot within the ordinary `IFRAME_READY_TIMEOUT` budget.
// The editor test also guards the diagnostic it adds for the bad version: its
// `position` used to be a legacy offset range rather than a unist `Position`,
// which crashed the fallback editor before it rendered anything.

const MISSING_VERSION = "0.0.0-missing.1";
const MISSING_BUNDLE_URL = `https://cdn.jsdelivr.net/npm/@doenet/standalone@v${MISSING_VERSION}/**`;
const DOENETML = `<document xmlns="https://doenet.org/spec/doenetml/v${MISSING_VERSION}"><p>Fallback works</p></document>`;

// The fallback swaps the iframe's `srcdoc`, which reloads its document, so
// read `contentDocument` afresh on every retry: a `.its("0.contentDocument")`
// chain would lock onto the document from before the reload. Look for the
// rendered paragraph (the `<p>` renderer emits `role="paragraph"`), not the
// body's text: the srcdoc carries the DoenetML source in a
// `<script type="text/doenetml">`, whose text is in the body before anything
// renders.
function renderedParagraphText($iframe: JQuery<HTMLElement>): string {
    const doc = ($iframe[0] as HTMLIFrameElement).contentDocument;
    return Array.from(doc?.querySelectorAll('[role="paragraph"]') ?? [])
        .map((p) => p.textContent ?? "")
        .join("\n");
}

// Rendering the document requires a full core-worker boot on top of the
// bundle evaluation; budget more than IFRAME_READY_TIMEOUT for it.
const CONTENT_TIMEOUT = 30_000;

describe("xmlns-detected version that fails to load", () => {
    beforeEach(() => {
        cy.intercept("GET", MISSING_BUNDLE_URL, {
            statusCode: 404,
            body: "Not Found",
        }).as("missingBundle");
    });

    it("DoenetViewer falls back to the host-specified bundle and warns", () => {
        cy.window().then((win) => {
            cy.spy(win.console, "warn").as("warn");
        });

        cy.mount(
            <DoenetViewer
                doenetML={DOENETML}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
            />,
        );

        cy.wait("@missingBundle");

        // The fallback iframe loads the host's bundle, not the missing one.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT }).should(
            ($iframe) => {
                const srcDoc = ($iframe[0] as HTMLIFrameElement).srcdoc;
                expect(
                    srcDoc.includes(STANDALONE_BLOB_URL),
                    "srcdoc loads the host-specified bundle",
                ).to.be.true;
                // Match the bundle URL, not the bare version: the srcdoc also
                // embeds the DoenetML source, whose `xmlns` names the version.
                expect(
                    srcDoc.includes(`@doenet/standalone@v${MISSING_VERSION}`),
                    "srcdoc loads the missing version's bundle",
                ).to.be.false;
            },
        );
        cy.get("@warn").should(
            "have.been.calledWithMatch",
            `v${MISSING_VERSION}`,
        );

        cy.get("iframe", { timeout: CONTENT_TIMEOUT }).should(($iframe) => {
            expect(renderedParagraphText($iframe)).to.include("Fallback works");
        });
    });

    it("DoenetEditor falls back to the host-specified bundle", () => {
        cy.mount(
            <div style={{ height: "600px", width: "900px" }}>
                <DoenetEditor
                    doenetML={DOENETML}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.wait("@missingBundle");

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT }).should(
            ($iframe) => {
                const srcDoc = ($iframe[0] as HTMLIFrameElement).srcdoc;
                expect(
                    srcDoc.includes(STANDALONE_BLOB_URL),
                    "srcdoc loads the host-specified bundle",
                ).to.be.true;
                expect(
                    srcDoc.includes(`@doenet/standalone@v${MISSING_VERSION}`),
                    "srcdoc loads the missing version's bundle",
                ).to.be.false;
            },
        );

        // The editor boots on the fallback bundle, so the author can fix the
        // `xmlns` that named the missing version.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT }).should(
            ($iframe) => {
                const doc = ($iframe[0] as HTMLIFrameElement).contentDocument;
                expect(
                    doc?.querySelector(".cm-content")?.textContent ?? "",
                ).to.include(MISSING_VERSION);
            },
        );
    });
});
