import React, { useState } from "react";
import { DoenetViewer } from "../../../src/index";
import { getSharedCorePoolStats } from "../../../src/shared-core-pool";
import {
    STANDALONE_BLOB_URL,
    STANDALONE_CSS_BLOB_URL,
    IFRAME_READY_TIMEOUT,
} from "./helpers";

// Cross-iframe shared core-worker host (#1466, milestone 3): with
// `useSharedCoreWorker`, each iframe's viewer obtains its core over a
// MessagePort that the PARENT page forwards to a shared host worker — the
// iframes' cores multiplex onto parent-owned workers instead of each iframe
// booting its own ~100 MB dedicated worker.
//
// These specs load the standalone bundle from a Blob URL, so the pool
// resolves the worker via its origin-root fallback
// (`/doenetml-worker/index.js`, served by the dev-server middleware in
// cypress.config.ts).
//
// Because Cypress component specs share the parent realm (and module graph)
// with the mounted component, `getSharedCorePoolStats` observes the very pool
// the component uses.

const VIEWER_BOOT_TIMEOUT = 60_000;

function assertIframeContains(index: number, text: string) {
    cy.get("iframe")
        .eq(index)
        .its("0.contentDocument.body", { timeout: VIEWER_BOOT_TIMEOUT })
        .should("contain.text", text);
}

describe("DoenetViewer (iframe wrapper) — shared core-worker host (#1466)", () => {
    it("two iframes' cores share one parent-owned host worker", () => {
        cy.mount(
            <div>
                <DoenetViewer
                    doenetML="<p>first shared iframe viewer</p>"
                    useSharedCoreWorker
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
                <DoenetViewer
                    doenetML="<p>second shared iframe viewer</p>"
                    useSharedCoreWorker
                    standaloneUrl={STANDALONE_BLOB_URL}
                    cssUrl={STANDALONE_CSS_BLOB_URL}
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        assertIframeContains(0, "first shared iframe viewer");
        assertIframeContains(1, "second shared iframe viewer");

        // Both cores landed on ONE parent-owned host worker.
        cy.wrap(null).should(() => {
            const stats = getSharedCorePoolStats();
            expect(stats.liveCores, "live cores").to.eq(2);
            expect(stats.hosts, "host workers").to.eq(1);
        });
    });

    it("unmounting a viewer releases its core from the pool", () => {
        function Harness() {
            const [showSecond, setShowSecond] = useState(true);
            return (
                <div>
                    <button
                        data-test="remove-second"
                        onClick={() => setShowSecond(false)}
                    >
                        remove second
                    </button>
                    <DoenetViewer
                        doenetML="<p>persistent viewer</p>"
                        useSharedCoreWorker
                        standaloneUrl={STANDALONE_BLOB_URL}
                        cssUrl={STANDALONE_CSS_BLOB_URL}
                        addVirtualKeyboard={false}
                    />
                    {showSecond ? (
                        <DoenetViewer
                            doenetML="<p>ephemeral viewer</p>"
                            useSharedCoreWorker
                            standaloneUrl={STANDALONE_BLOB_URL}
                            cssUrl={STANDALONE_CSS_BLOB_URL}
                            addVirtualKeyboard={false}
                        />
                    ) : null}
                </div>
            );
        }

        cy.mount(<Harness />);

        assertIframeContains(0, "persistent viewer");
        assertIframeContains(1, "ephemeral viewer");

        // Both cores live (the pool may still hold cores from the previous
        // test's realm-independent state — component specs get a fresh module
        // graph per spec file, not per test — so compare relative counts).
        let coresBefore = 0;
        cy.wrap(null)
            .should(() => {
                coresBefore = getSharedCorePoolStats().liveCores;
                expect(coresBefore, "cores before unmount").to.be.gte(2);
            })
            .then(() => {
                cy.get("[data-test=remove-second]").click();
                // The unmount cleanup releases exactly the removed viewer's core.
                cy.wrap(null, { timeout: IFRAME_READY_TIMEOUT }).should(() => {
                    expect(
                        getSharedCorePoolStats().liveCores,
                        "cores after unmount",
                    ).to.eq(coresBefore - 1);
                });
                // The surviving viewer is unaffected.
                assertIframeContains(0, "persistent viewer");
            });
    });
});
