import React, { useEffect, useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// Regression test for #1244 (the @doenet/doenetml-iframe 0.7.18 editor-boot
// regression). A React parent that passes inline arrow callbacks hands the
// wrapper a brand-new closure identity on every render. Before the fix, each
// identity change made the iframe re-invoke `renderDoenetEditorToContainer`;
// when that churn overlapped the core worker's multi-second boot window the
// worker never finished and the editor showed DoenetML's give-up screen
// ("The document viewer could not be started. Please reload the page.").
//
// What this test asserts — and why it's shaped this way:
//
// The end-to-end "the viewer wedges" symptom does NOT reproduce reliably in a
// component test: the standalone engine tolerates (or, post-#1244-viewer-fix,
// recovers from) repeated re-invocations, so "assert the viewer renders" passes
// on both broken and fixed wrappers. The *precise* regression — the root cause
// the fix removes — is that callback-identity churn re-invokes
// `renderDoenetEditorToContainer` at all. So the load-bearing assertion spies
// on that function inside the iframe and requires that a storm of fresh
// callback identities does NOT trigger re-invocations. Fixed wrapper: 0
// re-invocations (the editor holds stable dispatchers that dereference the new
// closures). Broken wrapper: one per churned render (dozens).
//
// We also assert the viewer renders the doenetML and the give-up text is
// absent — a sanity check that the editor actually works under churn.

// The churn must keep running through the whole observation window, so make the
// interval comfortably longer than any plausible boot + spy-install + observe
// sequence. Cleared on unmount.
const CHURN_INTERVAL_MS = 40;
const CHURN_DURATION_MS = 20_000;
// How long we watch the spy after the editor mounts. Long enough that a broken
// wrapper racks up many re-invocations; short enough to keep the test snappy.
const OBSERVE_MS = 2_500;
// Fixed wrapper does zero identity-churn re-invocations; allow a tiny margin
// for any unrelated one-shot render that might legitimately occur.
const MAX_ALLOWED_REINVOCATIONS = 3;

declare global {
    interface Window {
        renderDoenetEditorToContainer?: (...args: unknown[]) => unknown;
    }
}

// Re-renders every CHURN_INTERVAL_MS, passing fresh closure identities for TWO
// function props each render — exactly the churn a parent that uses inline
// arrow callbacks (DoenetTools' `DocEditorEditMode`) produces.
function ChurningHarness() {
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = setInterval(() => setTick((t) => t + 1), CHURN_INTERVAL_MS);
        const stop = setTimeout(() => clearInterval(id), CHURN_DURATION_MS);
        return () => {
            clearInterval(id);
            clearTimeout(stop);
        };
    }, []);
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <span data-test="tick">{tick}</span>
            <DoenetEditor
                doenetML="<p>hello there</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                // NEW identities every render — the regression trigger.
                immediateDoenetmlChangeCallback={() => {
                    void tick;
                }}
                doenetmlChangeCallback={() => {
                    void tick;
                }}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — function-prop churn during boot", () => {
    it("does not re-invoke renderDoenetEditorToContainer on callback-identity churn", () => {
        cy.mount(<ChurningHarness />);

        // Wait until the editor has mounted inside the iframe — at which point
        // the standalone bundle has defined `renderDoenetEditorToContainer` and
        // the churn (which only forwards updates after iframeReady) is in full
        // swing.
        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Install a counting spy over the iframe's render entry point. The
        // iframe module reads `window.renderDoenetEditorToContainer` fresh on
        // every call, so wrapping it on the contentWindow captures every
        // subsequent (re-)render the wrapper triggers.
        const counter = { reinvocations: 0 };
        cy.get("iframe").then(($iframe) => {
            const win = ($iframe[0] as HTMLIFrameElement)
                .contentWindow as unknown as Window;
            const orig = win.renderDoenetEditorToContainer!;
            win.renderDoenetEditorToContainer = function (
                this: unknown,
                ...args: unknown[]
            ) {
                counter.reinvocations += 1;
                return orig.apply(this, args);
            };
        });

        // Start counting from clean — only churn-driven re-invocations after
        // the editor is already mounted should be observed.
        cy.then(() => {
            counter.reinvocations = 0;
        });

        // Let the churn hammer the (already-mounted) editor.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(OBSERVE_MS);

        cy.then(() => {
            expect(
                counter.reinvocations,
                "callback-identity churn must NOT re-invoke renderDoenetEditorToContainer",
            ).to.be.lessThan(MAX_ALLOWED_REINVOCATIONS);
        });

        // Sanity: the viewer (core-worker output), not just the editor chrome,
        // actually renders the doenetML under churn …
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".doenet-viewer", { timeout: 20000 })
            .should("contain.text", "hello there");

        // … and the #1244 boot give-up screen is NOT showing. (`body` is the
        // raw iframe <body> DOM node here, so read `textContent` directly.)
        cy.get("iframe")
            .its("0.contentDocument.body")
            .should((body) => {
                const text = (body as unknown as HTMLElement).textContent ?? "";
                expect(text).to.not.match(
                    /could not be started|reload the page/i,
                );
            });
    });
});
