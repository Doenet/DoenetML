import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Component coverage for `coreStartFailedCallback` (#1709): the failure
// counterpart of `initializedCallback`.
//
// Hosts that cap how many documents boot at once release a boot slot when a
// viewer reports it initialized. Before this callback existed there was no
// signal for the other outcome, so a viewer that exhausted its handshake
// retries held its slot until the host's own watchdog expired (30–90 s) —
// starving the boot queue on exactly the pages where boots are failing.
//
// Failures are induced through the `__doenetTestCoreInitHook` seam, the same
// way DoenetViewer.sharedCoreWorker.cy.tsx drives the watchdog.

/** Hang every handshake attempt, so the retry ladder runs out. */
function hangEveryHandshake() {
    doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
        if (phase === "handshake") {
            return new Promise<void>(() => {
                /* never resolves */
            });
        }
    };
}

describe("DoenetViewer coreStartFailedCallback (#1709)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("fires once when the core cannot be started, and not on the way there", () => {
        // One attempt against a short watchdog: the whole ladder is spent in
        // well under a second, so this test measures the callback, not the
        // (deliberately generous) production timeout.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 500;
        hangEveryHandshake();

        const failures: unknown[] = [];
        let initialized = 0;

        cy.mount(
            <DoenetViewer
                doenetML="<p>never boots</p>"
                addVirtualKeyboard={false}
                initializedCallback={() => {
                    initialized++;
                }}
                coreStartFailedCallback={(arg: unknown) => {
                    failures.push(arg);
                }}
            />,
        );

        // The viewer surfaces its error state rather than staying blank...
        cy.contains("could not be started", { timeout: 8000 }).should("exist");

        // ...and reports the failure exactly once. The "once" matters: two
        // paths funnel into `failCoreStart` (startCore returning, and
        // startCoreSafely catching a throw from the same call), and a host
        // that released a slot per notification would over-release.
        cy.wrap(null, { timeout: 4000 }).should(() => {
            expect(failures.length, "coreStartFailedCallback calls").to.eq(1);
        });
        cy.then(() => {
            expect(
                initialized,
                "initializedCallback must not fire for a failed boot",
            ).to.eq(0);
        });
    });

    it("stays silent for a healthy boot", () => {
        let failures = 0;
        let initialized = 0;

        cy.mount(
            <DoenetViewer
                doenetML="<p>boots fine</p>"
                addVirtualKeyboard={false}
                initializedCallback={() => {
                    initialized++;
                }}
                coreStartFailedCallback={() => {
                    failures++;
                }}
            />,
        );

        cy.contains("boots fine", { timeout: 20000 }).should("exist");
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(initialized, "initializedCallback fired").to.be.greaterThan(
                0,
            );
        });
        cy.then(() => {
            expect(failures, "coreStartFailedCallback calls").to.eq(0);
        });
    });

    it("reports again when a later attempt fails, so a rebuild is not silent", () => {
        // The report latch is per core-start attempt, not per viewer. The
        // second attempt here is a *rebuild of the same viewer* — a changed
        // `doenetML`, the path an editor preview takes on every recompile —
        // rather than a remount, because only the rebuild keeps the refs the
        // latch lives in. A host that released a slot for the rebuild must
        // hear that this attempt failed too.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 500;
        hangEveryHandshake();

        let failures = 0;

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
                        doenetML={`<p>never boots ${generation}</p>`}
                        addVirtualKeyboard={false}
                        coreStartFailedCallback={() => {
                            failures++;
                        }}
                    />
                </div>
            );
        }

        cy.mount(<Rebuildable />);

        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(failures, "first failure reported").to.eq(1);
        });

        cy.get("[data-test=rebuild]").click();

        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(failures, "second failure reported").to.eq(2);
        });
    });

    it("boots normally when a rebuild follows a failed attempt", () => {
        // The transition OUT of the failure state. A failed boot leaves the
        // viewer showing the give-up screen with its stage still parked where
        // the ladder left it and its report latch spent — so a rebuild has to
        // reach the launch site again, take a boot slot again, and deliver a
        // document over the error UI. This is
        // the transition a boot-scheduling host depends on: the
        // `@doenet/standalone` coordinator marks a failed activity `failed`
        // and skips its state flush at park time, and only a later attempt
        // that actually starts a core clears that mark.
        //
        // The short watchdog is lifted along with the stall: it is what makes
        // the first attempt give up quickly, but a *real* handshake (worker
        // boot plus WASM compile) needs far longer than 500 ms, so leaving it
        // pinned would fail the recovery for reasons that have nothing to do
        // with the post-failure state.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 500;
        let stallHandshakes = true;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "handshake" && stallHandshakes) {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
        };

        let failures = 0;
        let initializations = 0;

        function Rebuildable() {
            const [generation, setGeneration] = React.useState(0);
            return (
                <div>
                    <button
                        data-test="recover"
                        onClick={() => {
                            stallHandshakes = false;
                            delete doenetGlobalConfig.coreHandshakeWatchdogMs;
                            setGeneration((g) => g + 1);
                        }}
                    >
                        recover
                    </button>
                    <DoenetViewer
                        doenetML={
                            generation === 0
                                ? "<p>never boots</p>"
                                : "<p>recovered document</p>"
                        }
                        addVirtualKeyboard={false}
                        initializedCallback={() => {
                            initializations++;
                        }}
                        coreStartFailedCallback={() => {
                            failures++;
                        }}
                    />
                </div>
            );
        }

        cy.mount(<Rebuildable />);
        cy.contains("could not be started", { timeout: 8000 }).should("exist");

        cy.get("[data-test=recover]").click();

        // The give-up screen gives way to the rebuilt document...
        cy.contains("recovered document", { timeout: 20000 }).should("exist");
        cy.contains("could not be started").should("not.exist");
        // ...and the host hears exactly one of each signal: the failure for
        // the attempt that failed, the initialization for the one that did
        // not. A second failure report here would leave a coordinator holding
        // the activity as `failed` even though it now has a core.
        cy.wrap(null, { timeout: 8000 }).should(() => {
            expect(initializations, "initializedCallback calls").to.eq(1);
        });
        cy.then(() => {
            expect(failures, "coreStartFailedCallback calls").to.eq(1);
        });
    });
});
