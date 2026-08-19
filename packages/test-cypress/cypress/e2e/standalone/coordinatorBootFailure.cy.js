// E2E for releasing a coordinator boot slot when an activity's core cannot
// start (#1709).
//
// Before this, a slot was freed only by the child's `bootComplete` — so an
// activity that exhausted its handshake retries kept the slot until
// `bootWatchdogMs` (90 s in production). On a page whose activities are
// failing, the boot queue that exists to keep the page from overloading was
// starved by the failures themselves.
//
// The host page (coordination-boot-failure-page.html) grants ONE boot slot and
// puts a permanently-failing activity first in the queue. The healthy activity
// behind it can only render once that slot comes back, and the page sets
// `bootWatchdogMs` far above the timeouts below — so a render here means the
// failure released the slot, not that the watchdog eventually did.

const BOOT_TIMEOUT = 15_000;

describe(
    "standalone coordinator: a failed boot frees its slot",
    { tags: ["@group1"] },
    () => {
        it("boots the queued activity behind a failure instead of waiting out the watchdog", () => {
            cy.viewport(1000, 800);
            cy.visit("/coordination-boot-failure-page.html");

            // The first activity reaches its visible error state rather than
            // staying blank.
            cy.get("#actFails")
                .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
                .should((body) => {
                    expect(body.textContent ?? "").to.contain(
                        "could not be started",
                    );
                });

            // The assertion: the activity queued behind it renders. Its slot can
            // only have come from the failure above.
            cy.get("#actHealthy")
                .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
                .should((body) => {
                    const clone = body.cloneNode(true);
                    clone.querySelectorAll("script").forEach((s) => s.remove());
                    expect(clone.textContent ?? "").to.contain(
                        "Activity two body",
                    );
                });

            // And the coordinator's own books agree: nothing is still booting or
            // queued, and the failure is recorded as such rather than lingering
            // as a phantom `booting`.
            cy.window().then((win) => {
                cy.wrap(null, { timeout: BOOT_TIMEOUT }).should(() => {
                    const stats = win.doenetCoordinatorStats();
                    expect(
                        stats,
                        `settled: ${JSON.stringify(stats)}`,
                    ).to.include({
                        booting: 0,
                        bootQueue: 0,
                    });
                    expect(stats.byState.failed ?? 0, "failed").to.eq(1);
                    expect(stats.byState.live ?? 0, "live").to.eq(1);
                });
            });
        });

        it("clears the failed mark when a later attempt in the same realm starts a core", () => {
            // The transition out of the failure state, which is the one that can
            // lose work silently: a `failed` activity is parked WITHOUT the
            // pre-park state flush, on the grounds that it has no core to answer
            // one. Once a later ladder in that realm does start a core — a rebuild
            // from a locale switch or a recompile — the activity holds the
            // reader's work like any other and must be flushed at park time, so
            // the coordinator has to drop the label when `bootComplete` arrives
            // from a realm it had written off.
            cy.viewport(1000, 800);
            cy.visit("/coordination-boot-failure-page.html");

            cy.get("#actFails")
                .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
                .should((body) => {
                    expect(body.textContent ?? "").to.contain(
                        "could not be started",
                    );
                });
            cy.window().then((win) => {
                cy.wrap(null, { timeout: BOOT_TIMEOUT }).should(() => {
                    expect(
                        win.doenetCoordinatorStats().byState.failed ?? 0,
                        "failed before the retry",
                    ).to.eq(1);
                });
            });

            // Lift the stall and rebuild the document in that same realm.
            cy.get("#actFails").then(($iframe) => {
                $iframe[0].contentWindow.__doenetTestRecover();
            });

            // The give-up screen is replaced by the rebuilt document...
            cy.get("#actFails")
                .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
                .should((body) => {
                    const clone = body.cloneNode(true);
                    clone.querySelectorAll("script").forEach((s) => s.remove());
                    expect(clone.textContent ?? "").to.contain(
                        "This activity recovered",
                    );
                });

            // ...and the coordinator no longer holds it as failed, so parking it
            // would flush its state rather than skip straight to detaching.
            cy.window().then((win) => {
                cy.wrap(null, { timeout: BOOT_TIMEOUT }).should(() => {
                    const stats = win.doenetCoordinatorStats();
                    expect(
                        stats.byState.failed ?? 0,
                        `failed after the retry: ${JSON.stringify(stats)}`,
                    ).to.eq(0);
                    expect(stats.byState.live ?? 0, "live").to.eq(2);
                });
            });
        });
    },
);
