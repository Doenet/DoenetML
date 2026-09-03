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
// The shape the protocol originally specified — an error carrying no
// `message_id` — has always been handled. A host that quotes the request's id
// instead, the natural thing to do and what its own answers carrying state
// already do, used to be ignored, because the error branch hung off the id NOT
// matching. Both are answers now, and `packages/standalone/README.md` asks for
// the id where a host can send it.
//
// Not every error is the reader's business, though. A viewer embedded in a
// page that does not speak SPLICE gets answered anyway — Canvas replies to
// any subject it does not recognize, on any of its pages — and reading that
// as a host failure told readers their saved work was unavailable on embeds
// that have no host and no saved work (Doenet/DoenetML#1795). Those replies,
// and any error with no text the viewer can show, are dropped.
//
// Every reply here carries an error. What an error leaves possible for an
// answerer that does have state — restoring the document over the error
// screen — is `DoenetViewer.getStateFirstAnswerWins.cy.tsx`.

const DOC = `<p>the document itself</p>`;
const REBUILT_DOC = `<p>the document that replaced it</p>`;

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

/**
 * A viewer whose source changes on demand, so a test can rebuild the document
 * under an answer still owed to the old one. The successor is handed
 * `initialState: null` — "start fresh" — which is one of the ways a rebuilt
 * document asks its host for nothing, and so never issues an id of its own.
 */
function ViewerWithRebuild() {
    const [rebuilt, setRebuilt] = React.useState(false);
    return (
        <div>
            <button data-cy="rebuild" onClick={() => setRebuilt(true)}>
                rebuild
            </button>
            <DoenetViewer
                doenetML={rebuilt ? REBUILT_DOC : DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
                initialState={rebuilt ? null : undefined}
            />
        </div>
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

    it("ignores state that carries no `message_id`", () => {
        // Answering with no id is a shape reserved for errors. State has to
        // be placed on the request that asked for it, and an unaddressed
        // reply cannot be: host replies reach every viewer in the window, and
        // `cid` cannot tell them apart — it hashes the DoenetML text alone,
        // so a second attempt at the same document, or the same document
        // opened twice on a page, carries the identical `cid`. Restoring an
        // unaddressed answer would put one reader's saved work into another's
        // document.
        //
        // Both halves matter, so both are asserted: the same payload is
        // ignored without the id and read with it, which leaves the id as the
        // only thing that decided.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, { state: { cid: request.cid! } });
            });

            cy.contains("the document itself", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wait(SETTLE);
            cy.contains("Error loading doc state").should("not.exist");

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    state: { cid: request.cid! },
                });
            });
            cy.contains("Error loading doc state", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    it("treats a reply carrying both state and an error as state", () => {
        // A host that produced state for this document has answered the
        // request it quotes, whatever else it also reported, so the state is
        // read and the error is not put on screen. Only the order of the two payload
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

    it("ignores an error owed to a document that has been rebuilt", () => {
        // A rebuild retires the request the old document made. Nothing else
        // does: the id is replaced only when a successor asks for itself, and
        // one restoring from local state or handed `initialState` never asks.
        // Left standing, that id would still match — and the late error would
        // land on a document it says nothing about.
        interceptGetState().then(({ win, request }) => {
            cy.mount(<ViewerWithRebuild />);
            afterGetStateRequest(request);
            cy.contains("the document itself", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            cy.get("[data-cy=rebuild]").click();
            cy.contains("the document that replaced it", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");

            // The id the FIRST document asked under, answered too late.
            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { code: 500, message: "storage unavailable" },
                });
            });

            cy.wait(SETTLE);
            cy.contains("storage unavailable").should("not.exist");
            cy.contains("the document that replaced it").should("exist");
        });
    });

    it("surfaces an error carrying a message but no `code`", () => {
        // The `code` is for the console; the `message` is the whole of what
        // a reader gets. A reply that has the text but not the code still
        // has something to say, and used to be discarded for the viewer's
        // own words instead.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { message: "storage unavailable" },
                });
            });

            cy.contains("storage unavailable", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
        });
    });

    for (const code of [
        "unsupported_subject",
        "unauthorized",
        "wrong_origin",
        "bad_request",
    ]) {
        it(`ignores a "${code}" answer from a page that does not speak SPLICE`, () => {
            // Canvas's postMessage vocabulary, which an embedded viewer meets
            // without anyone arranging for it: Canvas listens on every page it
            // serves and answers any subject outside its allow-list this way,
            // quoting the id it was sent. Read as a host failure it told a
            // reader their saved work was unavailable, on an embed that has no
            // host and no saved work (Doenet/DoenetML#1795).
            interceptGetState().then(({ win, request }) => {
                mountViewer();
                afterGetStateRequest(request);

                cy.then(() => {
                    answer(win, {
                        messageId: request.id!,
                        error: { code },
                    });
                });

                cy.contains("the document itself", {
                    timeout: VIEWER_TIMEOUT,
                }).should("exist");
                cy.wait(SETTLE);
                cy.contains("Your saved work could not be loaded").should(
                    "not.exist",
                );
            });
        });
    }

    it("still surfaces a host failure that carries a platform code AND a message", () => {
        // Only the codes decide, and they decide against showing anything —
        // so a reply carrying one is dropped even when it has text. Asserting
        // that keeps the rule from quietly weakening into "drop it unless it
        // says something", which Canvas's reply would slip through the moment
        // Canvas started passing a message.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: {
                        code: "unsupported_subject",
                        message: "Not supported inside Rich Content Editor",
                    },
                });
            });

            cy.contains("the document itself", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wait(SETTLE);
            cy.contains("Not supported inside Rich Content Editor").should(
                "not.exist",
            );
        });
    });

    it("ignores an error the viewer cannot put on screen", () => {
        // No string `message` is nothing to show. The viewer used to fill the
        // gap with "Invalid response to getState", which describes the host's
        // bug to a reader who cannot act on it.
        interceptGetState().then(({ win, request }) => {
            mountViewer();
            afterGetStateRequest(request);

            cy.then(() => {
                answer(win, {
                    messageId: request.id!,
                    error: { code: 500 },
                });
            });

            cy.contains("the document itself", {
                timeout: VIEWER_TIMEOUT,
            }).should("exist");
            cy.wait(SETTLE);
            cy.contains("Invalid response to getState").should("not.exist");
            cy.contains("Your saved work could not be loaded").should(
                "not.exist",
            );
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
