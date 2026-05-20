import React, { useMemo, useState } from "react";
import { DoenetEditor } from "../../../src/index";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
    RELOAD_MARKER_KEY,
} from "./helpers";

// In normal use, srcDoc only rebuilds via the autodetect-version fallback
// path — hard to simulate cleanly in a component test. Here we trigger a
// rebuild by handing the wrapper a *different* cssUrl reference (with the
// same content), which invalidates the srcDoc useMemo (deps include
// `cssUrl`) and forces a real iframe reload. Whatever the rebuild trigger,
// the wrapper must:
//  1. Re-anchor `lastSentPropsSnapshotRef` to the mount-time baseline (in
//     useLayoutEffect on srcDoc), and
//  2. Re-fire the live-update effect on `srcDoc` change so any prop drift
//     since mount is replayed against the freshly-booted iframe.
// This spec verifies that drift (here: readOnly toggled true between mount
// and rebuild) survives the rebuild.
//
// Why cssUrl and not standaloneUrl: this spec is the only one that boots
// the iframe twice in a single test. Driving the rebuild off `standaloneUrl`
// — as an earlier revision did — meant the *second* boot loaded the ~32 MB
// JS bundle from a fresh Blob URL, defeating the in-memory script cache and
// forcing a full re-parse/execute. Slow CI runners blew past 60 s on that
// second boot ~1 in 13 runs. Routing the rebuild through `cssUrl` keeps the
// JS bundle URL stable across both boots (Chrome reuses the parsed script
// from the first boot), and the CSS round-trip we *do* do is on a far
// smaller file. The wrapper sees the same "srcDoc changed" signal either
// way, so the contract under test is unchanged.

function freshCssBlobUrl(): string {
    // Resolve the original CSS blob to its bytes synchronously (sync XHR is
    // fine here — runs once during test harness setup, never on the main
    // user thread) and wrap them in a fresh Blob to get a URL distinct from
    // STANDALONE_CSS_BLOB_URL but pointing at the same working stylesheet.
    // Sync XHR cannot set responseType, so rely on the default and read
    // responseText; for a `text/css` source that round-trip is straight
    // UTF-8 text and avoids the encoding pitfalls of doing the same on the
    // multi-MB binary-ish JS bundle.
    const xhr = new XMLHttpRequest();
    xhr.open("GET", STANDALONE_CSS_BLOB_URL, false);
    xhr.send();
    return URL.createObjectURL(
        new Blob([xhr.responseText], { type: "text/css" }),
    );
}

function Harness() {
    const [readOnly, setReadOnly] = useState(false);
    const [useAltCss, setUseAltCss] = useState(false);
    const altCssUrl = useMemo(() => freshCssBlobUrl(), []);
    const cssUrl = useAltCss ? altCssUrl : STANDALONE_CSS_BLOB_URL;
    return (
        <div style={{ height: "600px", width: "900px" }}>
            <button
                data-test="toggle-read-only"
                onClick={() => setReadOnly((v) => !v)}
            >
                Toggle readOnly
            </button>
            <button
                data-test="force-rebuild"
                onClick={() => setUseAltCss(true)}
            >
                Force srcDoc rebuild
            </button>
            <span data-test="read-only-state">{String(readOnly)}</span>
            <DoenetEditor
                doenetML="<p>hello</p>"
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={cssUrl}
                addVirtualKeyboard={false}
                readOnly={readOnly}
            />
        </div>
    );
}

describe("DoenetEditor (iframe wrapper) — srcDoc rebuild replays drifted props", () => {
    it("after a forced iframe reload, prop changes that happened pre-reload are reapplied to the new iframe", () => {
        cy.mount(<Harness />);

        cy.get("iframe", { timeout: IFRAME_READY_TIMEOUT })
            .its("0.contentDocument.body", { timeout: IFRAME_READY_TIMEOUT })
            .find(".cm-content", { timeout: IFRAME_READY_TIMEOUT })
            .should("exist");

        // Stamp the original iframe document.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY] =
                "PRE_REBUILD";
        });

        // Toggle readOnly — live update path, no iframe reload yet.
        cy.get("[data-test=toggle-read-only]").click();
        cy.get("[data-test=read-only-state]").should("have.text", "true");

        // Confirm live update worked: stamp still there, typing is rejected.
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
            ).to.equal("PRE_REBUILD");
        });
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .then(($el) => {
                const before = $el.text();
                cy.wrap($el)
                    .click()
                    .type(" SHOULD_NOT_APPEAR_PRE", { force: true });
                cy.wrap($el).invoke("text").should("eq", before);
            });

        // Now force a srcDoc rebuild by swapping cssUrl.
        cy.get("[data-test=force-rebuild]").click();

        // The new iframe document is *not* the old one — stamp must be gone.
        // Wait for CodeMirror to come back up in the rebuilt iframe before
        // asserting; otherwise the assertion races the reload. Even with the
        // JS bundle URL held stable (so Chrome can reuse the parsed script
        // from the first boot), the second iframe still re-executes the
        // bundle from scratch — which on slow CI runners isn't covered by
        // the helpers' default 15 s budget. Give the rebuilt boot a wider
        // margin here only.
        const REBUILT_IFRAME_TIMEOUT = 60_000;
        cy.get("iframe", { timeout: REBUILT_IFRAME_TIMEOUT })
            .its("0.contentDocument.body", { timeout: REBUILT_IFRAME_TIMEOUT })
            .find(".cm-content", { timeout: REBUILT_IFRAME_TIMEOUT })
            .should("exist");
        cy.get("iframe").then(($iframe) => {
            const doc = ($iframe[0] as HTMLIFrameElement).contentDocument!;
            expect(
                (doc as unknown as Record<string, string>)[RELOAD_MARKER_KEY],
                "iframe was reloaded",
            ).to.be.undefined;
        });

        // The whole point: the readOnly=true that drifted in *before* the
        // rebuild must have been replayed against the new iframe. Typing
        // should still be rejected.
        cy.get("iframe")
            .its("0.contentDocument.body")
            .find(".cm-content")
            .then(($el) => {
                const before = $el.text();
                cy.wrap($el)
                    .click()
                    .type(" SHOULD_NOT_APPEAR_POST", { force: true });
                cy.wrap($el).invoke("text").should("eq", before);
            });
    });
});
