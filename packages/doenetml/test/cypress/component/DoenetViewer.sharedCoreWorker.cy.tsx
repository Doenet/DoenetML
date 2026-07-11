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

// Harness for the sibling-teardown regression test: a removable sibling
// viewer and a survivor viewer whose core we drive after the sibling is gone.
// The survivor's `updateValue` button increments `$c`, so a working core turns
// "survivor is 0" into "survivor is 1"; a dead core leaves it stuck at 0.
function SiblingTeardownHarness() {
    const [showSibling, setShowSibling] = React.useState(true);
    return (
        <div>
            <button
                data-test="remove-sibling"
                onClick={() => setShowSibling(false)}
            >
                remove sibling
            </button>
            {showSibling ? (
                <DoenetViewer
                    doenetML="<p>sibling to remove</p>"
                    addVirtualKeyboard={false}
                />
            ) : null}
            <DoenetViewer
                doenetML={`
                    <number name="c">0</number>
                    <updateValue name="bump" target="$c" newValue="$c+1">
                        <label>bump survivor</label>
                    </updateValue>
                    <p>survivor is $c</p>
                `}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

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

    it("a surviving core keeps responding after a sibling on the same host is torn down", () => {
        // Regression for the cycle-1 bug (#1467): a hosted core's terminate()
        // must not call the worker-global close(). Two cores share one host
        // worker; tearing the sibling's core down (unmount -> destroyCore)
        // must leave the survivor's core fully live. If close() ran, the whole
        // host — and the survivor with it — would die, and the survivor could
        // retain its stale DOM while no longer RESPONDING to interaction.
        doenetGlobalConfig.useSharedCoreWorker = true;

        cy.mount(<SiblingTeardownHarness />);

        // Both cores boot on the same shared host (pool cap >> 2).
        cy.contains("sibling to remove", { timeout: 20000 }).should("exist");
        cy.contains("survivor is 0", { timeout: 20000 }).should("exist");

        // Unmount the sibling viewer -> its core is torn down on the shared
        // host. The survivor viewer stays mounted.
        cy.get('[data-test="remove-sibling"]').click();
        cy.contains("sibling to remove").should("not.exist");

        // Drive the survivor's core: the click must round-trip through the
        // still-alive host worker and update the rendered value. (The cycle-1
        // bug would leave it stuck at "survivor is 0".)
        cy.contains("button", "bump survivor").click();
        cy.contains("survivor is 1", { timeout: 20000 }).should("exist");
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
