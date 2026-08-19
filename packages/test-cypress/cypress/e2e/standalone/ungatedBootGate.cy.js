// E2E for the in-realm boot gate (#1710).
//
// This is the case #1707 was reported from: a host page that embeds many
// DoenetML activities as same-origin iframes and has adopted none of our boot
// managers. Nothing on such a page staggers the boots, so every activity
// starts its core worker at once — which on a low-end machine pushes healthy
// handshakes past their watchdog and fails the activities outright.
//
// The gate inside the bundle is the fallback for exactly that page: it uses
// Web Locks, which span every same-origin realm, so it needs nothing from the
// host. The activity pages report when they enter and leave the handshake
// phase; this spec asserts the peak overlap respects the cap, and that every
// activity still finishes booting.

const BOOT_TIMEOUT = 15_000;
// Matches `maxConcurrentBoots` pinned in ungated-activity-if.html.
const CAP = 2;
const ACTIVITY_COUNT = 6;

describe(
    "in-realm boot gate on an uncoordinated page",
    { tags: ["@group1"] },
    () => {
        it("staggers boots across same-origin activity iframes without host cooperation", () => {
            cy.viewport(1000, 800);
            cy.visit("/ungated-page.html");

            // Every activity eventually boots — the gate delays, never drops.
            // Six realms each parse the standalone bundle and then queue for one
            // of two slots, so this is genuinely slow; the default 4 s would be
            // racing the harness rather than testing the gate.
            cy.window()
                .its("probe", { timeout: BOOT_TIMEOUT })
                .should((probe) => {
                    expect(
                        probe.ended,
                        "activities that finished a handshake",
                    ).to.eq(ACTIVITY_COUNT);
                });

            // The assertion that matters: they did not all boot at once. Without
            // the gate this page's peak would be ACTIVITY_COUNT.
            //
            // Only the upper bound is asserted. That the gate admits CAP boots
            // concurrently rather than degenerating to a single lock is pinned in
            // `bootGate.test.ts` ("admits up to the cap…"), where it can be
            // checked deterministically; here it would depend on six realms
            // finishing their bundle parse close enough together to overlap.
            cy.window().then((win) => {
                expect(
                    win.probe.peak,
                    `peak concurrent handshakes (probe: ${JSON.stringify(win.probe)})`,
                ).to.be.at.most(CAP);
            });

            // ...and the documents actually rendered, so the staggering did not
            // come at the cost of a boot that never completed.
            for (const id of ["u1", "u6"]) {
                cy.get(`#${id}`)
                    .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
                    .should((body) => {
                        const clone = body.cloneNode(true);
                        clone
                            .querySelectorAll("script")
                            .forEach((s) => s.remove());
                        expect(clone.textContent ?? "").to.contain(
                            "Ungated activity",
                        );
                    });
            }
        });
    },
);
