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

// Windowed mounting (#1441, stream B) end-to-end: with
// `mountPolicy={{mode:"windowed", maxLiveViewers:1}}`, the off-screen viewer
// parks (its state is flushed and its iframe is replaced by a fixed-height
// placeholder) and is restored — typed work intact — when scrolled back.

const DOC_A = `<p>Viewer A: <textInput name="ti" /></p>
<p>A typed: $ti.value</p>`;
const DOC_B = `<p>Viewer B content</p>`;

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

describe("DoenetViewer (iframe wrapper) — windowed mounting parks off-screen viewers", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
    });

    it("parks beyond the budget, restores typed work on scroll-back, and answers host flushes while parked", () => {
        cy.viewport(900, 600);
        cy.mount(<Harness />);

        // Viewer A (visible) boots; viewer B (far below the viewport) is
        // over the budget of 1 and parks once its realm can acknowledge the
        // flush. The placeholder holds its layout slot.
        viewerIframe("viewer-a")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "A typed:");
        assertParked("viewer-b");

        // Type into A and commit with Enter (cannot .blur() across the
        // iframe boundary).
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])")
            .then(cy.wrap)
            .type("survives the park{enter}");
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .should("contain.text", "A typed: survives the park");

        // Scroll to B: it unparks and boots; A leaves the margin and parks,
        // flushing the typed state into the wrapper's snapshot.
        cy.get("[data-test=viewer-b]").scrollIntoView();
        viewerIframe("viewer-b")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "Viewer B content");
        assertParked("viewer-a");

        // A host flush broadcast while A is parked: the wrapper answers for
        // it (success, hadState) so pre-navigation flush round-trips don't
        // hang on parked viewers.
        cy.window().then((win) => {
            const responses: any[] = [];
            win.addEventListener("message", (e: MessageEvent) => {
                if (
                    e.data?.subject === "SPLICE.flushState.response" &&
                    e.data?.message_id === "host-flush-while-parked"
                ) {
                    responses.push(e.data);
                }
            });
            win.postMessage(
                {
                    subject: "SPLICE.flushState",
                    message_id: "host-flush-while-parked",
                },
                "*",
            );
            cy.wrap(null, { timeout: 10_000 }).should(() => {
                const fromA = responses.find((r) => r.activity_id === "act-A");
                expect(fromA, "parked viewer A answered").to.exist;
                expect(fromA.success, "success").to.eq(true);
                expect(fromA.hadState, "hadState").to.eq(true);
            });
        });

        // Scroll back to A: it unparks seeded with the flushed state — the
        // typed work survives the park/unpark round trip with no user
        // interaction; B parks again (budget 1).
        cy.get("[data-test=viewer-a]").scrollIntoView();
        viewerIframe("viewer-a")
            .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
            .should("contain.text", "A typed: survives the park");
        viewerIframe("viewer-a")
            .its("0.contentDocument.body")
            .find("input:not([type=checkbox])")
            .should("have.value", "survives the park");
        assertParked("viewer-b");
    });
});
