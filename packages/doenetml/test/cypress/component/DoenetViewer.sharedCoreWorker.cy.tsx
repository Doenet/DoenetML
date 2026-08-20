import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";
import {
    concurrentHandshakesSnapshot,
    joinHandshakeCensus,
    refreshHandshakeCensusCount,
} from "../../../src/utils/handshakeCensus";

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

// Harness for the contended-timeout test below: a healthy viewer that boots
// first (so its core is live on the shared host before anything hangs), plus
// a button that mounts a second viewer afterwards — after the test has set up
// census pressure and a handshake hook the healthy boot must not see.
function ContendedBootHarness() {
    const [showContended, setShowContended] = React.useState(false);
    return (
        <div>
            <button
                data-test="add-contended"
                onClick={() => setShowContended(true)}
            >
                add contended
            </button>
            <DoenetViewer
                doenetML={`
                    <number name="c">0</number>
                    <updateValue name="bump" target="$c" newValue="$c+1">
                        <label>bump healthy</label>
                    </updateValue>
                    <p>healthy is $c</p>
                `}
                addVirtualKeyboard={false}
            />
            {showContended ? (
                <DoenetViewer
                    doenetML="<p>contended viewer</p>"
                    addVirtualKeyboard={false}
                />
            ) : null}
        </div>
    );
}

describe("DoenetViewer shared host under handshake contention (#1711)", () => {
    // Census seats this test holds to create page-wide pressure; released
    // after each test so later specs size their watchdogs against a clean
    // count.
    let censusSeats: { release: () => void }[] = [];
    let realWorker: typeof Worker;

    beforeEach(() => {
        realWorker = window.Worker;
    });

    afterEach(() => {
        window.Worker = realWorker;
        delete doenetGlobalConfig.useSharedCoreWorker;
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
        cy.then(() => {
            for (const seat of censusSeats) {
                seat.release();
            }
            censusSeats = [];
        });
        // The cached snapshot is module-global and survives this spec, so put
        // it back to the neutral "just me" the next boot expects to read.
        cy.wrap(null, { timeout: 4000 }).should(() => {
            refreshHandshakeCensusCount();
            expect(concurrentHandshakesSnapshot()).to.equal(1);
        });
    });

    it("a contended timeout leaves the shared host unquarantined and its healthy sibling running", () => {
        // End-to-end wiring of `suspectWedge: false` (#1711): when a
        // handshake times out while handshakes outnumber cores, the teardown
        // withholds the wedge suspicion, so the shared host keeps its live
        // sibling core AND keeps accepting new ones — the retry lands back on
        // it instead of a cold replacement worker. Observables, mirroring the
        // quarantine test above from the other side: no new host worker is
        // constructed, the sibling stays interactive, and the failure is
        // reported with the busy-page wording.
        doenetGlobalConfig.useSharedCoreWorker = true;
        // The override wins over the contention-scaled budget, keeping the
        // injected hang's watchdog short while healthy handshakes still
        // complete well within it.
        doenetGlobalConfig.coreHandshakeWatchdogMs = 4000;
        doenetGlobalConfig.coreBootMaxAttempts = 2;

        let handshakeAttempts = 0;
        let workerConstructions = 0;

        cy.mount(<ContendedBootHarness />);

        // The healthy viewer boots before any pressure or hook exists.
        cy.contains("healthy is 0", { timeout: 15000 }).should("exist");

        // Real census pressure: hold more seats than the machine has cores,
        // so the boot below reads `concurrentHandshakes > cores` and
        // attributes its timeout to contention.
        // `DocViewer` reads the same hint and substitutes 1 when it is
        // withheld, so this exceeds whatever core count the boot compares
        // against.
        const seatTarget = (navigator.hardwareConcurrency || 1) + 4;
        cy.then(async () => {
            const seats = await Promise.all(
                Array.from({ length: seatTarget }, () => joinHandshakeCensus()),
            );
            censusSeats.push(...seats);
        });
        // Prime the cached snapshot before the contended boot starts: the
        // boot reads the cache synchronously, and a refresh lands its count
        // asynchronously, so the seats have to be visible in the cache — not
        // just held — by the time the ladder's first attempt reads it.
        cy.wrap(null, { timeout: 4000 }).should(() => {
            refreshHandshakeCensusCount();
            expect(concurrentHandshakesSnapshot()).to.be.at.least(seatTarget);
        });

        cy.then(() => {
            // Count host-worker constructions from here on: the healthy
            // viewer's host already exists, so any construction after this
            // point is a retry being routed to a replacement host — which is
            // exactly what a (false) quarantine would force.
            class CountingWorker extends realWorker {
                constructor(...args: ConstructorParameters<typeof Worker>) {
                    super(...args);
                    workerConstructions++;
                }
            }
            window.Worker = CountingWorker as typeof Worker;
            // Hang every handshake attempt of the viewer mounted next. The
            // healthy viewer booted before this hook existed and never
            // re-handshakes in this test.
            doenetGlobalConfig.__doenetTestCoreInitHook = (phase, attempt) => {
                if (phase === "handshake") {
                    handshakeAttempts = Math.max(
                        handshakeAttempts,
                        attempt + 1,
                    );
                    return new Promise<void>(() => {
                        /* never resolves */
                    });
                }
            };
        });

        cy.get('[data-test="add-contended"]').click();

        // The contended viewer exhausts its attempts (two 4 s watchdogs plus
        // a backoff) and reports the failure with the busy-page wording —
        // which is itself the `lastFailureWasContended` wiring observed
        // end-to-end.
        cy.contains("Several documents were starting at once", {
            timeout: 15000,
        }).should("exist");

        cy.then(() => {
            expect(
                handshakeAttempts,
                "the contended handshake was still retried",
            ).to.equal(2);
            expect(
                workerConstructions,
                "no replacement host worker was spawned — the shared host was not quarantined",
            ).to.equal(0);
        });

        // The healthy sibling on the same host is undisturbed: its core still
        // round-trips an action through the shared worker.
        cy.contains("button", "bump healthy").click();
        cy.contains("healthy is 1", { timeout: 4000 }).should("exist");
    });
});
