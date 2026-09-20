// E2E proof of drain-on-replacement with two CONCURRENT copies of the
// code-split standalone bundle (public/two-copy-concurrent-page.html): the
// page starts two query-distinguished imports of `doenet-standalone.js`
// without awaiting the first, queues a render call against the facade
// prologue's stubs before any eager chunk settles, and records a probe. The
// render call reaches the real function through the stub's
// `__doenetDrainQueuedRenderCalls` hook, invoked by `installFirstCopyGlobal`
// the moment the shared eager chunk's entry replaces the stub — and it runs
// exactly once, because the stub-owning facade's own flush then finds the
// queue empty.
//
// Both facades resolve the same eager-chunk URL (relative resolution drops
// the facade's query), so one shared chunk serves both copies here. Two
// genuinely distinct chunk graphs — where one copy's chunk settles first
// while the other copy's is still pending or fails — would need two
// published releases served side by side, which this repo's single build
// cannot produce; that distinct-release ordering (including a failed owner
// whose queue a healthy foreign copy drains) is covered by the unit tests in
// packages/standalone/src/facadeRenderQueue.test.ts and
// installFirstCopyGlobal.test.ts.

describe(
    "standalone two concurrent copies",
    { tags: ["@group1"], retries: 1 },
    () => {
        it("drains a render call queued before any chunk settled, exactly once, and the document works", () => {
            cy.visit("/two-copy-concurrent-page.html");

            // The document renders and responds: the queued call was drained
            // into a live render backed by a working worker.
            cy.get(".doenetml-applet input").first().type("both{enter}");
            cy.get(".doenetml-applet").should("contain.text", "Typed: both");

            cy.window().then((win) => {
                const probe = win.__twoCopyConcurrentProbe;
                expect(probe, "probe recorded after both facades settled").to
                    .exist;
                for (const [key, value] of Object.entries(probe)) {
                    expect(value, key).to.eq(true);
                }
            });
        });
    },
);
