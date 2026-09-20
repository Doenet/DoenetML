import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { data_format_version } from "@doenet/utils";
import {
    captureReports,
    saveStateAfterTyping,
    TEXT_INPUT,
} from "./utils/splice";

// What happens to saved work this viewer's format cannot read.
//
// A host stores the state payload opaquely and hands it back unread, so a
// payload written by an older version of Doenet arrives looking exactly like a
// current one. `data_format_version` travels inside the payload for that
// reason, and it is the only thing that tells the two apart.
//
// 0.8 re-keyed saved state from component build indices to identifiers derived
// from the document (Doenet/DoenetML#1944), so 0.7's keys no longer denote the
// same components. Applying them would put a reader's values on the wrong ones
// rather than fail, which is why a payload whose version this viewer does not
// recognise is discarded — and said, rather than left for the reader to
// discover. Credit already recorded is unaffected, since score is reported
// separately from state.
//
// Both halves are asserted against the same payload, so the version field is
// the only thing that decided: read at the current version, discarded at an
// older one.

const DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

const VIEWER_TIMEOUT = 30_000;

/** How long an answer the viewer must NOT restore is given to be restored. */
const SETTLE = 1000;

/**
 * Answer the next `SPLICE.getState` with each of `states` in turn, every one
 * quoting the request's id.
 *
 * Several answers to one request is the ordinary case, not a contrivance: a
 * page can hold more than one answerer — under the standalone coordinator the
 * in-page warehouse answers a restored activity while a persistence host
 * answers the same request out of durable storage — and which lands first is
 * not the viewer's to choose.
 */
function answerGetStateWith(...states: Record<string, unknown>[]) {
    return cy.window().then((win) => {
        const answered = { sent: false };
        const listener = (e: MessageEvent) => {
            if (e.data?.subject !== "SPLICE.getState") {
                return;
            }
            win.removeEventListener("message", listener);
            for (const state of states) {
                win.postMessage(
                    {
                        subject: "SPLICE.getState.response",
                        message_id: e.data.message_id,
                        state,
                    },
                    "*",
                );
            }
            answered.sent = true;
        };
        win.addEventListener("message", listener);
        return answered;
    });
}

function mountRestoringViewer() {
    cy.mount(
        <DoenetViewer
            doenetML={DOC}
            addVirtualKeyboard={false}
            flags={{ allowLoadState: true }}
        />,
    );
}

describe("DoenetViewer saved state carrying a format version", () => {
    beforeEach(function () {
        // One real payload, captured the way a persistence host would have
        // stored it — including the `data_format_version` the worker put
        // inside it.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer doenetML={DOC} addVirtualKeyboard={false} />,
            );
            cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should(
                "exist",
            );
            saveStateAfterTyping(
                reports,
                "earlier work",
                "capture-state",
                VIEWER_TIMEOUT,
            ).then((state) => {
                this.savedState = state;
            });
        });
    });

    it("restores state written in the format this viewer reads", function () {
        expect(this.savedState.data_format_version).to.eq(data_format_version);

        answerGetStateWith(this.savedState).then((answered) => {
            mountRestoringViewer();

            cy.contains("You typed: earlier work", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                expect(answered.sent, "the host answered").to.eq(true);
            });
            cy.get(TEXT_INPUT).should("have.value", "earlier work");
            cy.contains("Your saved work could not be loaded").should(
                "not.exist",
            );
        });
    });

    it("discards state written in an older format, and says so", function () {
        // The same payload, relabelled. Nothing else about it changes, so
        // anything that happens differently below is the version field's doing.
        const staleState = {
            ...this.savedState,
            data_format_version: "0.7.0",
        };

        answerGetStateWith(staleState).then((answered) => {
            mountRestoringViewer();

            cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should(
                "exist",
            );
            cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                expect(answered.sent, "the host answered").to.eq(true);
            });
            cy.wait(SETTLE);

            // The reader is told, beside a document that works.
            cy.contains("Your saved work could not be loaded", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.contains("saved by an earlier version of Doenet").should(
                "exist",
            );

            // And the work itself is not applied to components 0.8 keys
            // differently — the document opens fresh.
            cy.get(TEXT_INPUT).should("have.value", "");
            cy.contains("You typed: earlier work").should("not.exist");

            // Discarded, not failed: the failure pane is what the reader used
            // to get here, and it takes the document away with it.
            cy.contains("Error loading doc state").should("not.exist");
        });
    });

    it("lets a second answerer restore after the first answered in an older format", function () {
        // A page can hold more than one answerer, and only a *usable* answer
        // consumes the open request — otherwise the first to land decides,
        // whether or not it had anything this viewer could restore. State in a
        // format this viewer cannot read restores nothing, so it must not shut
        // out an answerer that does have readable work.
        //
        // The two answers are the same bytes under two labels, so the version
        // field is the only thing that makes one of them unusable.
        const staleState = {
            ...this.savedState,
            data_format_version: "0.7.0",
        };

        answerGetStateWith(staleState, this.savedState).then((answered) => {
            mountRestoringViewer();

            cy.contains("You typed: earlier work", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
                expect(answered.sent, "the host answered").to.eq(true);
            });
            cy.get(TEXT_INPUT).should("have.value", "earlier work");

            // The answerer that had the work retires the earlier one's notice:
            // nothing was lost after all.
            cy.contains("Your saved work could not be loaded").should(
                "not.exist",
            );
            cy.contains("Error loading doc state").should("not.exist");
        });
    });
});
