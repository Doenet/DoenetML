import React from "react";
import { DoenetViewer } from "../../../src/index";
import {
    __resetViewerLifecycleManagerForTests,
    getViewerLifecycleStats,
} from "../../../src/viewer-lifecycle-manager";
import { STANDALONE_BLOB_URL, STANDALONE_CSS_BLOB_URL } from "./helpers";

// #1439 (native half): windowed viewers start as placeholders and only
// create their iframe when near the viewport and granted a boot slot — an
// off-screen viewer never boots at all, so mounting N viewers costs the
// boot of only the visible few (no initialization stampede).

const CONTENT_TIMEOUT = 40_000;

const MOUNT_POLICY = {
    mode: "windowed" as const,
    maxLiveViewers: 3,
    maxConcurrentBoots: 1,
    parkDelayMs: 300,
    visibleMargin: "100px",
};

function Harness() {
    const viewers = [];
    for (let i = 0; i < 4; i++) {
        viewers.push(
            // Fixed-height containers so booted viewers (whose iframes
            // shrink to their content height) don't collapse the page and
            // pull the far-away viewers into the viewport. 500px (less than
            // the 600px viewport) so viewer-1 genuinely OVERLAPS the
            // viewport: cypress mounts components inside an iframe, where
            // rootMargin on an implicit-root IntersectionObserver is
            // ignored, so `visibleMargin` cannot be relied on here.
            <div
                key={i}
                data-test={`viewer-${i}`}
                style={{ height: "500px", overflow: "hidden" }}
            >
                <DoenetViewer
                    doenetML={`<p>Viewer number ${i}</p>`}
                    activityId={`lazy-act-${i}`}
                    docId={`lazy-doc-${i}`}
                    flags={{ allowSaveState: true }}
                    mountPolicy={MOUNT_POLICY}
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>,
        );
    }
    return <div>{viewers}</div>;
}

/**
 * Assert the viewer's document RENDERED the given text. A plain
 * `contain.text` on the body would also match the raw doenetML source
 * inside the srcdoc's <script> tag before anything renders, so strip
 * script tags before checking. (The DoenetML `<p>` component renders as a
 * `<div>`, so element-based selectors are no help here.)
 */
function assertRenders(which: string, text: string) {
    cy.get(`[data-test=${which}] iframe`, { timeout: CONTENT_TIMEOUT })
        .its("0.contentDocument.body", { timeout: CONTENT_TIMEOUT })
        .should((body: any) => {
            // `.its(...)` yields the raw body element (not a jQuery wrap).
            const clone = (body as HTMLElement).cloneNode(true) as HTMLElement;
            clone.querySelectorAll("script").forEach((s) => s.remove());
            expect(
                (clone.textContent ?? "").includes(text),
                `${which} rendered "${text}"`,
            ).to.eq(true);
        });
}

describe("DoenetViewer (iframe wrapper) — lazy windowed mounting with a boot cap", () => {
    beforeEach(() => {
        __resetViewerLifecycleManagerForTests();
    });

    it("only near-viewport viewers ever create an iframe; the rest stay parked placeholders", () => {
        cy.viewport(900, 600);
        cy.mount(<Harness />);

        // Containers are 500px tall in a 600px viewport: viewer-0 fills
        // most of it and viewer-1's top 100px overlap; viewers 2 and 3 are
        // fully below. The overlapping ones boot (one at a time under the
        // cap of 1)...
        assertRenders("viewer-0", "Viewer number 0");
        assertRenders("viewer-1", "Viewer number 1");

        // ...while the off-screen ones never got an iframe at all.
        cy.get("[data-test=viewer-2] iframe").should("not.exist");
        cy.get("[data-test=viewer-3] iframe").should("not.exist");
        cy.get("[data-test=viewer-2] [data-doenet-parked-viewer]").should(
            "exist",
        );
        cy.get("[data-test=viewer-3] [data-doenet-parked-viewer]").should(
            "exist",
        );

        // The manager settles with no held slots and no queue.
        cy.wrap(null, { timeout: 20_000 }).should(() => {
            const stats = getViewerLifecycleStats();
            expect(
                stats,
                `settled state: ${JSON.stringify(stats)}`,
            ).to.deep.include({
                booting: 0,
                bootQueue: 0,
                live: 2,
                parked: 2,
            });
        });

        // Scrolling to the bottom boots viewer 3 on demand.
        cy.get("[data-test=viewer-3]").scrollIntoView();
        assertRenders("viewer-3", "Viewer number 3");
    });
});
