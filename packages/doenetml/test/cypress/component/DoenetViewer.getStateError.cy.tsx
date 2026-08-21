import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";

// What a host's `SPLICE.getState` failure reaches the reader as.
//
// The viewer does not block on the answer — it boots fresh and reboots seeded
// with whatever state arrives — so an error the viewer drops is not a stall.
// It is quieter than that: the reader carries on in a document started
// without their saved work, with nothing on screen to say why, while the host
// believes it reported a failure (Doenet/DoenetML#1716).
//
// The protocol asks a host to send its error with no `message_id`
// (`packages/standalone/README.md`), and that shape has always been handled.
// A host that quotes the request's id instead — the natural thing to do, and
// what its own answers carrying state already do — used to be ignored, because
// the error branch hung off the id NOT matching.
//
// `DoenetViewer.getStateFirstAnswerWins.cy.tsx` covers the rule these share:
// an error never closes the request, so an answerer that has state can still
// restore the document afterwards.

const DOC = `<p>the document itself</p>`;

const VIEWER_TIMEOUT = 30_000;

/** How long an answer the viewer must NOT act on is given to be acted on. */
const SETTLE = 1000;

type Reply = Record<string, unknown>;

/**
 * Watch for the viewer's `SPLICE.getState` and record which request it is,
 * so a test can answer it (or deliberately answer a different one) whenever
 * it chooses rather than from inside the listener.
 *
 * Component tests share the viewer's window, so the spec itself plays the
 * host on the same `postMessage` channel a real one uses.
 */
function interceptGetState() {
    return cy.window().then((win) => {
        const request: { id: string | null } = { id: null };
        win.addEventListener("message", (e: MessageEvent) => {
            if (e.data?.subject === "SPLICE.getState") {
                request.id = e.data.message_id;
            }
        });
        return { win, request };
    });
}

/** Block until the viewer has asked for its state. */
function afterGetStateRequest(request: { id: string | null }) {
    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
        expect(request.id, "the viewer asked its host for state").to.not.eq(
            null,
        );
    });
}

/**
 * Answer as the host. `messageId` is passed through as given — omit the field
 * entirely to send no id at all, which is the shape the protocol specifies for
 * an error.
 */
function answer(win: Window, reply: Reply & { messageId?: string }) {
    const { messageId, ...body } = reply;
    win.postMessage(
        {
            subject: "SPLICE.getState.response",
            ...(messageId === undefined ? {} : { message_id: messageId }),
            ...body,
        },
        "*",
    );
}

function mountViewer() {
    cy.mount(
        <DoenetViewer
            doenetML={DOC}
            addVirtualKeyboard={false}
            flags={{ allowLoadState: true }}
        />,
    );
}

describe("DoenetViewer SPLICE.getState error responses", () => {
    it("surfaces an error that quotes the request's `message_id`", () => {
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { code: 500, message: "storage unavailable" },
                });
            });

            cy.contains("storage unavailable", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    it("surfaces an error that carries no `message_id`", () => {
        // The shape the protocol specifies, and the one that worked before:
        // an error has no request to quote back.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    error: { code: 500, message: "storage unavailable" },
                });
            });

            cy.contains("storage unavailable", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    it("ignores an error that quotes a different request", () => {
        // A rebuild asks again under a new id, so a reply carrying an old one
        // is answering a request that no longer exists. Failing the document
        // on it would put a stale error over a document that is loading fine.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: `${request.id}-superseded`,
                    error: { code: 500, message: "storage unavailable" },
                });
            });

            cy.contains("the document itself", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wait(SETTLE);
            cy.contains("storage unavailable").should("not.exist");
        });
    });

    it("leaves the request open, so a second answerer is still heard", () => {
        // Only usable state closes the request. An answerer that fails must
        // not take the document down with it — a page can hold another
        // listener with the state, and it has to still be able to answer.
        // Two failures are what makes that visible without state to restore:
        // the second message could not appear if the first had closed the
        // request.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { code: 500, message: "storage unavailable" },
                });
            });
            cy.contains("storage unavailable", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { code: 404, message: "nothing saved here either" },
                });
            });
            cy.contains("nothing saved here either", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });
});
