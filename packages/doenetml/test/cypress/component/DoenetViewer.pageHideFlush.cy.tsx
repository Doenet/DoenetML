import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { captureReports, flushState, TEXT_INPUT } from "./utils/splice";

// Flush pending state when the page goes away (Doenet/DoenetML#1726).
//
// The core throttles its `reportScoreAndState` saves at 60 seconds, and the
// only things that overrode that throttle were a host's explicit
// `SPLICE.flushState` and a submitted answer. A document can go away with
// neither: the tab is closed, a new URL is typed, an external link is
// followed, a backgrounded mobile tab is discarded, or an app navigates in
// place and unmounts the viewer. Up to a minute of a reader's work was lost.
//
// `pagehide` gives no budget for a Comlink round-trip into the worker, so the
// fix does not try one: the core mirrors each throttled payload into the main
// realm (`StatePersistence` → a report marked `pending`), `DocViewer` buffers
// it instead of handing it to the host, and hands it over synchronously when
// the page hides.
//
// The property under test is the same one #1440's flush test asserts, driven by
// the ways a document actually goes away: work performed AFTER the last
// (throttled) report — work a host would otherwise never see — reaches the host
// through the ordinary `SPLICE.reportScoreAndState` channel, and restores. That
// includes a plain unmount, whose in-worker flush is suppressed on arrival (see
// the unmount case below), so the buffered payload is the only thing that
// reaches a host on an in-app navigation too.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;

function hasValue(reports: any[], value: string) {
    return reports.some((r) => String(r.state?.coreState).includes(value));
}

/**
 * Drive the viewer to a state where `value` is typed but stuck behind the
 * 60-second report throttle, and hand back the reports captured up to that
 * point (i.e. everything a host could possibly have saved).
 */
function typeBehindThrottle(reports: any[], value: string) {
    cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
    cy.get(TEXT_INPUT).type("first value{enter}");
    cy.contains("You typed: first value", {
        timeout: VIEWER_TIMEOUT,
    }).should("exist");

    // Arms the 60-second throttle deterministically: `saveChangesToDatabase`
    // re-arms its timer on every override, so whatever the boot-time save
    // timing was, the next save is throttled.
    return flushState(`arm-throttle-${value}`).then(() => {
        cy.get(TEXT_INPUT).type(`{selectall}{backspace}${value}{enter}`);
        cy.contains(`You typed: ${value}`, {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        // The core mirrors the throttled payload to the main realm on the
        // one-second save debounce; wait past it so the buffer is armed.
        // (Buffering is invisible from here by design — the assertions below
        // are what prove it happened.)
        cy.wait(2000);

        return cy.then(() => reports.slice());
    });
}

describe("DoenetViewer flush-on-page-hide (#1726)", () => {
    it("reports throttle-stuck work on pagehide, and it restores", () => {
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );

            typeBehindThrottle(reports, "work after last save").then(
                (reportsBeforeHide) => {
                    // Reporting works (arming the throttle produced one), yet
                    // nothing delivered the second commit: the mirrored payload
                    // stayed buffered rather than leaking out as a save.
                    expect(
                        reportsBeforeHide.length,
                        "at least one report was delivered",
                    ).to.be.greaterThan(0);
                    expect(
                        hasValue(reportsBeforeHide, "work after last save"),
                        "second commit reported before pagehide (should not be)",
                    ).to.eq(false);

                    cy.window().then((win) => {
                        win.dispatchEvent(new win.Event("pagehide"));
                    });

                    // The hide pushed it out through the normal
                    // `reportScoreAndState` channel — the one a persistence
                    // host saves.
                    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                        expect(
                            hasValue(reports, "work after last save"),
                            "pagehide reported the pending work",
                        ).to.eq(true);
                    });

                    // Rebuild a fresh viewer from the state it carried, as a
                    // host would on the reader's next visit.
                    cy.then(() => {
                        const flushed = [...reports]
                            .reverse()
                            .find((r) =>
                                String(r.state?.coreState).includes(
                                    "work after last save",
                                ),
                            );
                        cy.mount(
                            <DoenetViewer
                                doenetML={DOC}
                                addVirtualKeyboard={false}
                                flags={{ allowLoadState: true }}
                                initialState={flushed.state}
                            />,
                        );
                        cy.contains("You typed: work after last save", {
                            timeout: VIEWER_TIMEOUT,
                        }).should("exist");
                        cy.get(TEXT_INPUT).should(
                            "have.value",
                            "work after last save",
                        );
                    });
                },
            );
        });
    });

    it("reports throttle-stuck work when the tab is backgrounded", () => {
        // A backgrounded tab can be discarded without firing `pagehide` at
        // all, so `visibilitychange` → hidden has to flush on its own.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );

            typeBehindThrottle(reports, "work while visible").then(
                (reportsBeforeHide) => {
                    expect(
                        hasValue(reportsBeforeHide, "work while visible"),
                        "second commit reported before hiding (should not be)",
                    ).to.eq(false);

                    // The tab really is visible, so shadow `visibilityState`
                    // for the length of the (synchronous) dispatch.
                    cy.document().then((doc) => {
                        const win = doc.defaultView!;
                        Object.defineProperty(doc, "visibilityState", {
                            configurable: true,
                            get: () => "hidden",
                        });
                        try {
                            doc.dispatchEvent(
                                new win.Event("visibilitychange"),
                            );
                        } finally {
                            delete (doc as any).visibilityState;
                        }
                        expect(
                            doc.visibilityState,
                            "real visibilityState restored",
                        ).to.eq("visible");
                    });

                    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                        expect(
                            hasValue(reports, "work while visible"),
                            "hiding the tab reported the pending work",
                        ).to.eq(true);
                    });
                },
            );
        });
    });

    it("reports throttle-stuck work when the viewer unmounts", () => {
        // An in-app navigation unmounts the viewer rather than hiding the
        // page, and the core's own teardown flush does not cover it: the
        // unmount cleanup marks the viewer gone before terminating the
        // worker, and every delivery from a core that no longer speaks for
        // the document is dropped on arrival — so the report
        // `Core.terminate()` produces reaches nobody. The buffered payload is
        // what makes an unmount lossless.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );

            typeBehindThrottle(reports, "work before unmount").then(
                (reportsBeforeUnmount) => {
                    expect(
                        hasValue(reportsBeforeUnmount, "work before unmount"),
                        "second commit reported before unmounting (should not be)",
                    ).to.eq(false);

                    // `cy.mount` unmounts whatever it replaces.
                    cy.mount(<div>the viewer is gone</div>);

                    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                        expect(
                            hasValue(reports, "work before unmount"),
                            "unmounting reported the pending work",
                        ).to.eq(true);
                    });
                },
            );
        });
    });

    it("does not re-report the same work on a second hide", () => {
        // A page can hide more than once (tab switching, a bfcache
        // `pagehide` the reader comes back from), and an in-app navigation
        // produces both a hide and the unmount flush. Handing the same
        // payload over repeatedly would be pointless host traffic, so the
        // buffer is taken, not copied.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );

            typeBehindThrottle(reports, "typed once").then(() => {
                cy.window().then((win) => {
                    win.dispatchEvent(new win.Event("pagehide"));
                });

                cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                    expect(
                        hasValue(reports, "typed once"),
                        "first hide reported the pending work",
                    ).to.eq(true);
                });

                cy.then(() => {
                    const countAfterFirstHide = reports.length;
                    cy.window().then((win) => {
                        win.dispatchEvent(new win.Event("pagehide"));
                        win.dispatchEvent(new win.Event("pagehide"));
                    });
                    cy.wait(1000);
                    cy.then(() => {
                        expect(
                            reports.length,
                            "no further reports from repeated hides",
                        ).to.eq(countAfterFirstHide);
                    });
                });
            });
        });
    });
});
