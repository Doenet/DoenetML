// E2E for a coordinated host page that ALSO persists state itself — the
// Runestone/SCORM arrangement, and the one PreTeXt books are published into.
//
// Two independent listeners answer the same `SPLICE.getState` there: the
// coordinator, from the in-page warehouse it fills at park time, and the host,
// from durable storage. `public/coordination-persistence-page.html` puts both
// on one page. These tests pin down that the coordinator does not get in the
// host's way, and that when the two disagree the reader keeps their work.

const BOOT_TIMEOUT = 60_000;

function assertActivityRenders(selector, text) {
    cy.get(selector)
        .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
        .should((body) => {
            const clone = body.cloneNode(true);
            clone.querySelectorAll("script").forEach((s) => s.remove());
            expect(
                (clone.textContent ?? "").includes(text),
                `${selector} rendered "${text}"`,
            ).to.eq(true);
        });
}

function assertParked(selector) {
    cy.get(selector, { timeout: BOOT_TIMEOUT }).should(($iframe) => {
        expect($iframe[0].src, `${selector} detached`).to.contain(
            "about:blank",
        );
    });
}

function typeIntoActivity(selector, text) {
    cy.get(selector)
        .its("0.contentDocument.body", { timeout: BOOT_TIMEOUT })
        .find("input:not([type=checkbox])", { timeout: BOOT_TIMEOUT })
        .then(cy.wrap)
        .clear()
        .type(`${text}{enter}`);
}

/**
 * Wait until the host's durable store actually holds the given text.
 *
 * Routine state reports are throttled to one a minute
 * (`StatePersistence.saveChangesToDatabase`), so a host that merely waits gets
 * the boot-time report and nothing else. `__hostFlush` sends the same
 * `SPLICE.flushState` the coordinator sends before parking, which pushes what
 * the document is holding through the ordinary report pipeline.
 */
function flushUntilStored(id, text) {
    cy.window().then((win) => {
        cy.wrap(null, { timeout: 30_000 }).should(() => {
            win.__hostFlush(id);
            const stored = win.__hostStore()[id];
            expect(
                stored ? JSON.stringify(stored) : "",
                `host store holds "${text}"`,
            ).to.contain(text);
        });
    });
}

describe(
    "activity coordinator beside a host persistence layer",
    { tags: ["@group1"], retries: 1 },
    () => {
        beforeEach(() => {
            cy.clearLocalStorage();
        });

        it("leaves the host's own restore working on a boot the warehouse cannot answer", () => {
            cy.viewport(1000, 660);
            cy.visit("/coordination-persistence-page.html");

            assertActivityRenders("#act1", "One typed:");
            typeIntoActivity("#act1", "saved by the host");
            assertActivityRenders("#act1", "One typed: saved by the host");
            flushUntilStored("act1", "saved by the host");

            // A fresh page load: the coordinator's warehouse starts empty, so
            // the host is the only one who can answer, and its answer has to
            // get through. A coordinator that swallowed it would lose every
            // reader's work from every previous session.
            cy.reload();
            assertActivityRenders("#act1", "One typed: saved by the host");

            cy.window().then((win) => {
                expect(
                    win.__hostLog.filter((e) => e === "getState:act1:hit")
                        .length,
                    `host answered from its store: ${JSON.stringify(win.__hostLog)}`,
                ).to.be.gte(1);
            });
        });

        it("keeps the reader's in-session work when the host answers with older state", () => {
            cy.viewport(1000, 660);
            cy.visit("/coordination-persistence-page.html");

            assertActivityRenders("#act1", "One typed:");

            // Round one reaches the host's store.
            typeIntoActivity("#act1", "round one");
            assertActivityRenders("#act1", "One typed: round one");
            flushUntilStored("act1", "round one");

            // Now the host's store stops keeping up — a backend mid-flight, a
            // save that failed, a reader faster than the network. The
            // coordinator's warehouse still takes the pre-park flush, so the
            // two answerers now disagree about what the reader has done.
            cy.window().then((win) => {
                win.__hostFrozen = true;
            });
            typeIntoActivity("#act1", "round two");
            assertActivityRenders("#act1", "One typed: round two");

            // Park activity 1, then bring it back. Both listeners answer the
            // reboot's `SPLICE.getState`: the coordinator with "round two",
            // the host — later — with the stale "round one".
            cy.get("#act2").scrollIntoView();
            assertActivityRenders("#act2", "Activity two body");
            assertParked("#act1");

            cy.get("#act1").scrollIntoView();
            assertActivityRenders("#act1", "One typed:");

            // The host's stale answer is the one that used to overwrite the
            // coordinator's, so the screen only means anything once that
            // answer has actually been sent. Wait for the host to log it (it
            // also confirms the host really is competing for this request),
            // then give the viewer a moment to have acted on it: adopting it
            // blanks the document synchronously, so the assertions below
            // cannot pass by beating the rebuild.
            cy.window().then((win) => {
                cy.wrap(null, { timeout: 30_000 }).should(() => {
                    expect(
                        win.__hostLog.some((e) => e === "answered:act1:state"),
                        `the host answered too: ${JSON.stringify(win.__hostLog)}`,
                    ).to.eq(true);
                });
            });
            cy.wait(1500);

            assertActivityRenders("#act1", "One typed: round two");
            cy.get("#act1")
                .its("0.contentDocument.body")
                .find("input:not([type=checkbox])", { timeout: BOOT_TIMEOUT })
                .should("have.value", "round two");
        });
    },
);
