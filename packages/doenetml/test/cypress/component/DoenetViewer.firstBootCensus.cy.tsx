import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";
import {
    HANDSHAKE_CENSUS_LOCK,
    concurrentHandshakesSnapshot,
} from "../../../src/utils/handshakeCensus";

// Component coverage for #1718: the contention-aware watchdog (#1711) has to
// reach a realm's FIRST handshake attempt.
//
// The census count a boot reads is cached and refreshed only in the
// background, so every reading is answered by the refresh before it — and a
// realm's first attempt has none. Left there, attempt 0 is sized and
// attributed as though it were the only boot on the page, which is precisely
// the boot #1711 exists for: a fresh PreTeXt iframe on a page where every
// activity is booting at once. The seat the ladder already takes now reports
// the count it was granted against, so the first attempt has a reading of its
// own.
//
// Observed through the busy-page failure wording (#1712), which is driven by
// the same `concurrentHandshakes` figure that sizes the budget: a first
// attempt that hangs on a demonstrably contended page must come back with it.
// Reading "just me", it would report the plain message instead.

describe("DoenetViewer first-attempt handshake census (#1718)", () => {
    /** Releases for the census seats standing in for other realms' boots. */
    const seatReleases: (() => void)[] = [];

    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
        while (seatReleases.length > 0) {
            seatReleases.pop()?.();
        }
    });

    it("attributes a first attempt to a busy page it has never cached a count for", () => {
        // One attempt, and an explicit override for its budget: the override
        // wins over the contention-scaled figure, which keeps the test to a
        // second instead of the deliberately generous production budget. What
        // is under test is the count the attempt reads, not the milliseconds
        // that count would otherwise widen it to.
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 1000;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "handshake") {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
        };

        // Seats held straight through the lock manager, the way another
        // realm's handshakes appear: visible to a query, invisible to this
        // realm's cache. `DocViewer` substitutes 1 where the core hint is
        // withheld, so this exceeds whatever core count the boot compares
        // against.
        const seatTarget = (navigator.hardwareConcurrency || 1) + 4;
        cy.then(async () => {
            for (let i = 0; i < seatTarget; i++) {
                await new Promise<void>((granted) => {
                    void navigator.locks.request(
                        HANDSHAKE_CENSUS_LOCK,
                        { mode: "shared" },
                        () =>
                            new Promise<void>((release) => {
                                seatReleases.push(release);
                                granted();
                            }),
                    );
                });
            }
        });

        // The precondition the bug lived in: a page full of handshakes, and a
        // realm whose cached count still says it is alone.
        cy.then(() => {
            expect(
                concurrentHandshakesSnapshot(),
                "the realm's cached count is still the neutral 'just me'",
            ).to.equal(1);
        });

        cy.mount(
            <DoenetViewer
                doenetML="<p>never boots</p>"
                addVirtualKeyboard={false}
            />,
        );

        cy.contains("Several documents were starting at once", {
            timeout: 8000,
        }).should("exist");
    });
});
