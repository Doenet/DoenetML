import React, { useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// Records every call made by the iframe's editor into the parent's
// `immediateDoenetmlChangeCallback`. Each closure captures its render's
// `version`, so by inspecting the recorded calls we can tell whether the
// iframe is invoking the *latest* closure identity (live-update worked) or
// the original one (live-update broken).
declare global {
    interface Window {
        __capturedCalls: { version: number; value: string }[];
    }
}

function Harness({ enabled = true }: { enabled?: boolean }) {
    const [version, setVersion] = useState(1);
    const [callbackEnabled, setCallbackEnabled] = useState(enabled);
    const callback = callbackEnabled
        ? (value: string) => {
              window.__capturedCalls.push({ version, value });
          }
        : undefined;
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <button
                data-test="bump-version"
                onClick={() => setVersion((v) => v + 1)}
            >
                Bump version
            </button>
            <button
                data-test="disable-callback"
                onClick={() => setCallbackEnabled(false)}
            >
                Disable callback
            </button>
            <span data-test="version">{version}</span>
            <DoenetEditor
                doenetML="<p>hello</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                addVirtualKeyboard={false}
                immediateDoenetmlChangeCallback={callback}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — function-prop identity changes propagate live", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.__capturedCalls = [];
        });
    });

    it("invokes the latest closure identity after the parent re-renders with a new callback", () => {
        cy.mount(<Harness />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Type one char — triggers the immediate callback.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type("{ctrl}{end}", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type("a", { force: true });

        cy.window()
            .its("__capturedCalls", { timeout: 4000 })
            .should("have.length.at.least", 1);
        cy.window().then((win) => {
            const last = win.__capturedCalls[win.__capturedCalls.length - 1];
            expect(last.version, "initial closure runs").to.equal(1);
        });

        // Bump the closure identity. The wrapper's function-prop effect
        // should fire updateEditorFunctionProps, re-pointing the iframe at
        // the new closure (which captures version=2).
        cy.get("[data-test=bump-version]").click();
        cy.get("[data-test=version]").should("have.text", "2");

        cy.window().then((win) => {
            win.__capturedCalls = [];
        });

        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type("b", { force: true });

        cy.window()
            .its("__capturedCalls", { timeout: 4000 })
            .should("have.length.at.least", 1);
        cy.window().then((win) => {
            const last = win.__capturedCalls[win.__capturedCalls.length - 1];
            expect(last.version, "new closure runs after bump").to.equal(2);
        });
    });

    it("removes the callback when the parent stops passing it (no stale invocation)", () => {
        cy.mount(<Harness />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Confirm the callback is wired up first.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .click()
            .type("{ctrl}{end}", { force: true });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type("a", { force: true });
        cy.window()
            .its("__capturedCalls", { timeout: 4000 })
            .should("have.length.at.least", 1);

        // Drop the callback. The wrapper detects the keys length change
        // (1 → 0) and fires updateEditorFunctionProps with no entries.
        // The iframe-side handler must drop the existing entry, not retain it.
        cy.get("[data-test=disable-callback]").click();

        // Give the wrapper time to push the removal through Comlink.
        // (The render commits synchronously after setState; the post-render
        // effect dispatches updateEditorFunctionProps; the iframe re-renders.)
        cy.wait(200);

        cy.window().then((win) => {
            win.__capturedCalls = [];
        });

        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .type("b", { force: true });

        // Wait long enough that any (broken) stale invocation would have
        // landed via Comlink, then assert nothing was recorded.
        cy.wait(1000);
        cy.window().then((win) => {
            expect(
                win.__capturedCalls,
                "stale callback must not fire after removal",
            ).to.have.length(0);
        });
    });
});
