import React from "react";
import { DoenetViewer } from "../../../src/index";
import { __resetViewerLifecycleManagerForTests } from "../../../src/viewer-lifecycle-manager";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    WINDOWED_MOUNT_POLICY as MOUNT_POLICY,
    CONTENT_TIMEOUT,
    viewerIframe,
    assertParked,
} from "./helpers";

// Windowed mounting for callback hosts: a host that passes
// `reportScoreAndStateCallback` suppresses the `SPLICE.reportScoreAndState`
// message (the inner viewer calls the callback INSTEAD of posting), which is
// what the park snapshot used to be captured from. The wrapper substitutes a
// composed callback that captures the report before forwarding — so parking
// stays lossless for hosts like the assignment viewer that consume reports
// via the callback prop.

const DOC_A = `<p>Viewer A: <textInput name="ti" /></p>
<p>A typed: $ti.value</p>`;
const DOC_B = `<p>Viewer B content</p>`;

/** Reports viewer A's host callback received, exposed for assertions. */
const hostReports: any[] = [];

function Harness() {
    return (
        <div>
            <div data-test="viewer-a">
                <DoenetViewer
                    doenetML={DOC_A}
                    activityId="act-A"
                    docId="doc-A"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    reportScoreAndStateCallback={(data: unknown) => {
                        hostReports.push(data);
                    }}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
            <div style={{ height: "3000px" }} data-test="spacer" />
            <div data-test="viewer-b">
                <DoenetViewer
                    doenetML={DOC_B}
                    activityId="act-B"
                    docId="doc-B"
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>
        </div>
    );
}

describe("DoenetViewer (iframe wrapper) — windowed mounting with a report callback host", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
        hostReports.length = 0;
    });

    it("captures the park snapshot from the composed callback and still forwards reports to the host", () => {
        cy.viewport(900, 600);
        cy.mount(<Harness />);

        viewerIframe("viewer-a")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "A typed:");
        assertParked("viewer-b");

        // Type into A and commit with Enter.
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])")
            .then(cy.wrap)
            .type("callback snapshot{enter}");
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .should("contain.text", "A typed: callback snapshot");

        // A decoy report posted on the host window (e.g. an assignment-level
        // report from the host's own reducer) must NOT pollute A's snapshot:
        // the wrapper only captures from its own iframe / composed callback.
        cy.window().then((win) => {
            win.postMessage(
                {
                    subject: "SPLICE.reportScoreAndState",
                    activity_id: "act-A",
                    doc_id: "doc-A",
                    state: { decoy: "not a real doc state" },
                    score: 0,
                },
                "*",
            );
        });

        // Scroll to B: A leaves the margin and parks. The park flush pushes
        // the pending save through the composed callback — the host receives
        // it (forwarding) and the wrapper snapshots it (capture).
        cy.get("[data-test=viewer-b]").scrollIntoView();
        viewerIframe("viewer-b")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Viewer B content");
        assertParked("viewer-a");

        cy.wrap(null).should(() => {
            const withState = hostReports.filter(
                (r) => r && typeof r === "object" && "state" in r,
            );
            expect(
                withState.length,
                "host callback received the flushed report",
            ).to.be.greaterThan(0);
        });

        // Scroll back: A restores from the captured snapshot — the typed
        // work survives even though no SPLICE.reportScoreAndState message
        // ever reached the host window (and the decoy was ignored).
        cy.get("[data-test=viewer-a]").scrollIntoView();
        viewerIframe("viewer-a")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "A typed: callback snapshot");
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])")
            .should("have.value", "callback snapshot");
        assertParked("viewer-b");
    });
});
