import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Component coverage for boot supersession (#1714): a rebuild replaces the
// document while the work started for the previous one is still in flight.
//
// Getting a document on screen is a chain of waits — hash the source, read
// IndexedDB, hand shake with a fresh worker, evaluate — and a rebuild can land
// in any of them. The work that loses that race must stand aside rather than
// deliver: it no longer speaks for what the viewer is showing, and the shared
// `coreWorker` ref it would tear down now belongs to the successor.
//
// Each case drives the race deterministically through the
// `__doenetTestCoreInitHook` seam, holding one phase open across a rebuild.

describe("DoenetViewer boot supersession (#1714)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("keeps the document when a rebuild supersedes a stalled boot", () => {
        // A boot ladder can outlive the document it was started for: each
        // attempt waits on a handshake, and the ladder waits again between
        // attempts, so a rebuild during either wait starts a second ladder.
        // The superseded one must stand aside. Before it did, its watchdog
        // expiry tore down the shared `coreWorker` ref — by then the
        // *successor's* worker — and then reported a failure over a document
        // that had booted fine, so the reader saw the give-up screen replace
        // a rendered document.
        //
        // Long enough that the first handshake reaches the stall below rather
        // than timing out inside the worker boot that precedes it.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 3000;

        let handshakesStarted = 0;
        // Stalls only until the test clears it, so the first ladder hangs and
        // the rebuild's ladder runs normally.
        let stallHandshakes = true;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase !== "handshake") {
                return;
            }
            handshakesStarted++;
            if (stallHandshakes) {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
        };

        function Rebuildable() {
            const [generation, setGeneration] = React.useState(0);
            return (
                <div>
                    <button
                        data-test="rebuild"
                        onClick={() => setGeneration((g) => g + 1)}
                    >
                        rebuild
                    </button>
                    <DoenetViewer
                        doenetML={
                            generation === 0
                                ? "<p>first attempt</p>"
                                : "<p>rebuilt document</p>"
                        }
                        addVirtualKeyboard={false}
                    />
                </div>
            );
        }

        cy.mount(<Rebuildable />);

        // Rebuild only once the first ladder is demonstrably stuck in its
        // handshake, so the supersession is real rather than a race.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(handshakesStarted, "first handshake reached").to.eq(1);
        });
        cy.then(() => {
            stallHandshakes = false;
        });
        cy.get("[data-test=rebuild]").click();

        cy.contains("rebuilt document", { timeout: 15000 }).should("exist");

        // The stalled ladder's watchdog has not expired yet. Wait it out: the
        // regression is what that expiry did to the document already on
        // screen, so the assertions have to come after it.
        cy.wait(3200);
        cy.contains("rebuilt document").should("exist");
        cy.contains("could not be started").should("not.exist");
    });

    it("keeps the document when a rebuild supersedes an evaluating boot", () => {
        // The sibling of the case above, one phase later. The handshake is
        // watchdogged and retried; `generateDast` deliberately is not, because
        // evaluation legitimately runs for minutes on a large document. So a
        // ladder can sit in evaluation for a long time, and a rebuild during
        // it leaves the old ladder holding a result for a document that is no
        // longer on screen.
        //
        // Both ways that ends are wrong without the check. If the old
        // evaluation *rejects* — its worker having been reinitialized under it
        // — the give-up screen lands on a document that booted fine. If it
        // *succeeds*, it renders the superseded document over the new one and
        // fires `initializedCallback` for it.
        doenetGlobalConfig.coreBootMaxAttempts = 1;

        let generatesStarted = 0;
        // Held open for the first ladder only, so it is still evaluating when
        // the rebuild lands; released by the test once the successor is up.
        let releaseFirstGenerate: (() => void) | null = null;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase !== "generate") {
                return;
            }
            generatesStarted++;
            if (generatesStarted === 1) {
                return new Promise<void>((resolve) => {
                    releaseFirstGenerate = resolve;
                });
            }
        };

        let initializations = 0;

        function Rebuildable() {
            const [generation, setGeneration] = React.useState(0);
            return (
                <div>
                    <button
                        data-test="rebuild"
                        onClick={() => setGeneration((g) => g + 1)}
                    >
                        rebuild
                    </button>
                    <DoenetViewer
                        doenetML={
                            generation === 0
                                ? "<p>first attempt</p>"
                                : "<p>rebuilt document</p>"
                        }
                        addVirtualKeyboard={false}
                        initializedCallback={() => {
                            initializations++;
                        }}
                    />
                </div>
            );
        }

        cy.mount(<Rebuildable />);

        // Rebuild only once the first ladder is demonstrably inside
        // evaluation, so the supersession is real rather than a race.
        cy.wrap(null, { timeout: 15000 }).should(() => {
            expect(generatesStarted, "first evaluation reached").to.eq(1);
        });
        cy.get("[data-test=rebuild]").click();
        cy.contains("rebuilt document", { timeout: 20000 }).should("exist");

        // Now let the superseded ladder finish. Whatever it comes back with —
        // a result or a rejection — is no longer its to deliver.
        cy.then(() => {
            releaseFirstGenerate?.();
        });

        cy.wait(2000);
        cy.contains("rebuilt document").should("exist");
        cy.contains("could not be started").should("not.exist");
        cy.then(() => {
            expect(
                initializations,
                "only the ladder that owns the document initializes it",
            ).to.eq(1);
        });
    });

    it("keeps the document when a rebuild supersedes a failing state load", () => {
        // The same rule one step EARLIER than the two cases above: before a
        // ladder runs at all, `loadStateAndInitialize` hashes the source and
        // reads IndexedDB, so a rebuild can overtake the load just as it can
        // overtake a boot.
        //
        // The load's own launch site turns an unexpected rejection into the
        // give-up screen, which unguarded covers whatever the successor has
        // rendered.
        //
        // Verified to fail without the guard: the rebuilt document disappears
        // behind the give-up screen the moment the superseded load rejects.
        const failure = new Error("state load failed after being superseded");
        let loadsStarted = 0;
        // Held open for the first load only, then failed by the test once the
        // successor is on screen.
        const firstLoad: { fail: ((e: Error) => void) | null } = { fail: null };
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase !== "stateLoad") {
                return;
            }
            loadsStarted++;
            if (loadsStarted === 1) {
                return new Promise<void>((_resolve, reject) => {
                    firstLoad.fail = reject;
                });
            }
        };

        let initializations = 0;

        function Rebuildable() {
            const [generation, setGeneration] = React.useState(0);
            return (
                <div>
                    <button
                        data-test="rebuild"
                        onClick={() => setGeneration((g) => g + 1)}
                    >
                        rebuild
                    </button>
                    <DoenetViewer
                        doenetML={
                            generation === 0
                                ? "<p>first attempt</p>"
                                : "<p>rebuilt document</p>"
                        }
                        addVirtualKeyboard={false}
                        initializedCallback={() => {
                            initializations++;
                        }}
                    />
                </div>
            );
        }

        cy.mount(<Rebuildable />);

        // Rebuild only once the first load is demonstrably stalled, so the
        // supersession is real rather than a race.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(loadsStarted, "first state load reached").to.eq(1);
        });
        cy.get("[data-test=rebuild]").click();
        cy.contains("rebuilt document", { timeout: 20000 }).should("exist");

        // Now fail the superseded load. Its rejection is not the successor's
        // to report.
        cy.then(() => {
            firstLoad.fail?.(failure);
        });

        cy.wait(2000);
        cy.contains("rebuilt document").should("exist");
        cy.contains("could not be started").should("not.exist");
        cy.then(() => {
            expect(
                initializations,
                "only the load that owns the document reaches a boot",
            ).to.eq(1);
        });
    });
});
