import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Component coverage for the shared core-worker host (#1466): with
// `doenetGlobalConfig.useSharedCoreWorker` set, viewers on a page multiplex
// their cores onto shared workers (one core per MessagePort) instead of
// booting one dedicated worker each.
//
// The recovery test drives the same handshake watchdog + retry ladder as
// DoenetEditor.viewerRenderStall.cy.tsx (Doenet/DoenetApps#2957), via the
// `__doenetTestCoreInitHook` seam. In shared mode a watchdogged (non-graceful)
// teardown additionally QUARANTINES the core's host worker — no new cores are
// assigned to it and it is terminated once empty — so the retry boots on a
// fresh worker rather than landing back on a possibly-wedged host.

describe("DoenetViewer shared core-worker host (#1466)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.useSharedCoreWorker;
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("renders two viewers whose cores share a host worker", () => {
        doenetGlobalConfig.useSharedCoreWorker = true;

        cy.mount(
            <div>
                <DoenetViewer
                    doenetML="<p>first shared viewer</p>"
                    addVirtualKeyboard={false}
                />
                <DoenetViewer
                    doenetML="<p>second shared viewer</p>"
                    addVirtualKeyboard={false}
                />
            </div>,
        );

        cy.contains("first shared viewer", { timeout: 20000 }).should("exist");
        cy.contains("second shared viewer", { timeout: 20000 }).should("exist");
    });

    it("recovers from a hung handshake: quarantine + retry on a fresh host", () => {
        doenetGlobalConfig.useSharedCoreWorker = true;

        let handshakeAttempts = 0;
        // Hang forever on the first handshake attempt. The watchdog fires, the
        // non-graceful teardown quarantines the (empty) host worker, and the
        // retry must boot a fresh host — pre-quarantine, the retry would be
        // assigned to the same possibly-wedged worker.
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase, attempt) => {
            if (phase === "handshake") {
                handshakeAttempts = Math.max(handshakeAttempts, attempt + 1);
                if (attempt === 0) {
                    return new Promise<void>(() => {
                        /* never resolves */
                    });
                }
            }
        };
        // Generous enough that a healthy handshake completes well within it,
        // so the watchdog fires on the injected hang, not on slow boot.
        doenetGlobalConfig.coreHandshakeWatchdogMs = 4000;

        cy.mount(
            <DoenetViewer
                doenetML="<p>recovered shared viewer</p>"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("recovered shared viewer", { timeout: 20000 }).should(
            "exist",
        );

        cy.then(() => {
            expect(
                handshakeAttempts,
                "handshake was retried after the hung first attempt",
            ).to.be.greaterThan(1);
        });
    });
});
