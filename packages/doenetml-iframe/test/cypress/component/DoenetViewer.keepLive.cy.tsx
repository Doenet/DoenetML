import React from "react";
import { DoenetViewer } from "../../../src/index";
import { __resetViewerLifecycleManagerForTests } from "../../../src/viewer-lifecycle-manager";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    WINDOWED_MOUNT_POLICY as MOUNT_POLICY,
    CONTENT_TIMEOUT,
    PARK_TIMEOUT,
    viewerIframe,
} from "./helpers";

// The `keepLive` hint: a windowed viewer inside a `display:none` container
// never intersects the viewport, so visibility alone would leave it parked
// forever. A host that knows the viewer is about to be shown (a paginator
// prefetching the pages adjacent to the current one) sets `keepLive`, which
// makes the wrapper treat it as visible: it boots eagerly and is never
// parked while the hint is set — and parks normally once the hint is
// removed.

const DOC_V = `<p>Visible viewer content</p>`;
const DOC_K = `<p>Hidden keepLive viewer content</p>`;

function Harness() {
    const [keepLive, setKeepLive] = React.useState(true);
    return (
        <div>
            <button
                data-test="toggle-keep-live"
                onClick={() => setKeepLive((was) => !was)}
            >
                keepLive: {String(keepLive)}
            </button>
            <div data-test="viewer-v">
                <DoenetViewer
                    doenetML={DOC_V}
                    activityId="act-V"
                    docId="doc-V"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
            {/* display:none — never intersects, like a paginator's hidden
                next/previous page. */}
            <div data-test="viewer-k" hidden>
                <DoenetViewer
                    doenetML={DOC_K}
                    activityId="act-K"
                    docId="doc-K"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    keepLive={keepLive}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
        </div>
    );
}

describe("DoenetViewer (iframe wrapper) — keepLive treats a viewer as visible", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
    });

    it("boots a display:none viewer, exempts it from parking, and parks it once the hint is removed", () => {
        cy.viewport(900, 600);
        cy.mount(<Harness />);

        // Both boot: V is visible, K is keepLive — despite a budget of 1
        // live viewer (the soft budget never parks effectively-visible
        // viewers). The hidden iframe still renders its document.
        viewerIframe("viewer-v")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Visible viewer content");
        cy.get("[data-test=viewer-k] iframe", {
            timeout: CONTENT_TIMEOUT,
        }).should("exist");
        viewerIframe("viewer-k")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Hidden keepLive viewer content");

        // Outlast the park debounce: K must stay live while keepLive is set.
        cy.wait(1500);
        cy.get("[data-test=viewer-k] iframe").should("exist");

        // Remove the hint: K is now invisible and over budget — it parks
        // (flush acknowledged by the modern blob-URL bundle).
        cy.get("[data-test=toggle-keep-live]").click();
        cy.get("[data-test=viewer-k] [data-doenet-parked-viewer]", {
            timeout: PARK_TIMEOUT,
        }).should("exist");
        cy.get("[data-test=viewer-k] iframe").should("not.exist");
        // The visible viewer is untouched.
        cy.get("[data-test=viewer-v] iframe").should("exist");

        // Restore the hint: K unparks and boots again, still display:none.
        cy.get("[data-test=toggle-keep-live]").click();
        viewerIframe("viewer-k")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Hidden keepLive viewer content");
    });
});
