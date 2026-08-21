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
// Every reply here carries an error. What an error leaves possible for an
// answerer that does have state — restoring the document over the error
// screen — is `DoenetViewer.getStateFirstAnswerWins.cy.tsx`.

const DOC = `<p>the document itself</p>`;

const VIEWER_TIMEOUT = 30_000;

/** How long an answer the viewer must NOT act on is given to be acted on. */
const SETTLE = 1000;

type Reply = Record<string, unknown>;

type Request = { id: string | null; cid: string | null };

/**
 * Watch for the viewer's `SPLICE.getState` and record which request it is,
 * so a test can answer it (or deliberately answer a different one) whenever
 * it chooses rather than from inside the listener. The request carries the
 * `cid` an answer's state has to match, which is the only way a spec can
 * name this document's state without building any.
 *
 * Component tests share the viewer's window, so the spec itself plays the
 * host on the same `postMessage` channel a real one uses.
 */
function interceptGetState() {
    return cy.window().then((win) => {
        const request: Request = { id: null, cid: null };
        win.addEventListener("message", (e: MessageEvent) => {
            if (e.data?.subject === "SPLICE.getState") {
                request.id = e.data.message_id;
                request.cid = e.data.cid;
            }
        });
        return { win, request };
    });
}

/** Block until the viewer has asked for its state. */
function afterGetStateRequest(request: Request) {
    cy.wrap(null, { timeout: VIEWER_TIMEOUT }).should(() => {
        expect(request.id, "the viewer asked its host for state").to.not.eq(
            null,
        );
    });
}

/**
 * Answer as the host. `messageId` is passed through as given — including an
 * explicit `null` — so omitting the field is the only way to send no id at
 * all, which is the shape the protocol specifies for an error.
 */
function answer(win: Window, reply: Reply & { messageId?: string | null }) {
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

    it("surfaces an error whose `message_id` is an explicit null", () => {
        // Spelling the absence out rather than omitting the field says the
        // same thing, and a host serializing a fixed message shape sends it
        // this way without meaning anything by it. It takes a clause of its
        // own in the listener — a null id equals no request's id — and
        // nothing else here would notice that clause going missing.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: null,
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

    it("reads state from a reply that carries no `message_id`", () => {
        // The relaxation is payload-blind on purpose: the id says whether a
        // reply is this viewer's, and nothing more. So an answer carrying
        // state without an id — which the protocol does not ask any host to
        // send, and which the viewer used to drop — is now read like any
        // other. It is harmless, because the `cid` test below it still has to
        // pass for the state to be used at all; it is pinned here so that
        // tightening it later is a decision someone makes rather than a
        // behavior that slips.
        //
        // Unusable state again, for the reason the case below gives.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, { state: { cid: request.cid! } });
            });

            cy.contains("Error loading doc state", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    it("treats a reply carrying both state and an error as state", () => {
        // A host that produced state for this document has answered the
        // request, whatever else it also reported, so the state is read and
        // the error is not put on screen. Only the order of the two payload
        // tests decides that, and reversing them would fail a document whose
        // state had arrived.
        //
        // The state here is deliberately unusable, so that no document has to
        // be built to make the branch visible: reading it fails, and that
        // failure — which only the state branch can produce — is the proof of
        // which branch ran. `DoenetViewer.getStateFirstAnswerWins.cy.tsx`
        // covers what usable state does.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    state: { cid: request.cid! },
                    error: { code: 500, message: "storage unavailable" },
                });
            });

            cy.contains("Error loading doc state", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
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
