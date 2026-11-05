import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { doenetGlobalConfig } from "../../../src/global-config";

// Component coverage for what a `SPLICE.getState` error does to a document
// that is already on screen (#1741).
//
// The boot does not wait for the host's answer: the viewer posts the request
// and starts a core, and the request is retired only by an answer carrying
// usable state. So a document can be rendered — and worked in — with its
// request still open, and a host that answers late answers onto a reader
// mid-activity. That message used to take the pane, which unmounted the
// renderer subtree and left a red box in place of the reader's work, with
// nothing that ever cleared it short of a page reload.
//
// It is a notice beside the document now. What it reports is real and worth
// saying — the document started without the reader's saved work — and none
// of it is a reason to take the document away.

const VIEWER_TIMEOUT = 30_000;

/** How long a message that must NOT take the document away is given to. */
const SETTLE = 1000;

/** A document with something a reader can leave work in. */
const STATEFUL_DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;
const TEXT_INPUT = "input.doenet-textinput, input:not([type=checkbox])";

/**
 * Answer as the host, carrying no `message_id` — the shape the SPLICE
 * protocol specifies for an error, which addresses whichever request is open.
 */
function postStateError(message: string) {
    cy.window().then((win) => {
        win.postMessage(
            {
                subject: "SPLICE.getState.response",
                error: { code: 500, message },
            },
            "*",
        );
    });
}

describe("DoenetViewer late SPLICE.getState error (#1741)", () => {
    afterEach(() => {
        delete doenetGlobalConfig.__doenetTestCoreInitHook;
        delete doenetGlobalConfig.coreHandshakeWatchdogMs;
        delete doenetGlobalConfig.coreBootMaxAttempts;
    });

    it("leaves a working document — and the reader's work in it — alone", () => {
        cy.mount(
            <DoenetViewer
                doenetML={STATEFUL_DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        cy.get(TEXT_INPUT).type(
            "{selectall}{backspace}work in progress{enter}",
        );
        cy.contains("You typed: work in progress", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        // Minutes into the activity, as far as the viewer is concerned: the
        // request has been open the whole time.
        postStateError("storage unavailable");

        cy.contains("storage unavailable", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");
        cy.wait(SETTLE);
        // The document is still there, still holding what the reader did in
        // it, and still interactive.
        cy.contains("You typed: work in progress").should("exist");
        cy.get(TEXT_INPUT).should("have.value", "work in progress");
        cy.get(TEXT_INPUT).type("{selectall}{backspace}still working{enter}");
        cy.contains("You typed: still working", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");
    });

    it("reports the loss as a notice rather than as an alert", () => {
        // Nothing here interrupts what the reader is doing: the document is
        // working, and what they need to know is that it started without
        // their saved work. The failure pane's `role="alert"` is for the
        // failures that leave no document at all.
        cy.mount(
            <DoenetViewer
                doenetML={STATEFUL_DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        // The live region is in the document before it has anything to say.
        // A region that arrives in the same commit as its text is unreliably
        // announced, and this one has to reach a reader working elsewhere in
        // the document, so its emptiness here is the behavior — not an
        // accident of where the notice happens to be built.
        cy.get('[role="status"]')
            .should("exist")
            .and("not.contain.text", "storage unavailable");

        postStateError("storage unavailable");

        cy.get('[role="status"]', { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "storage unavailable",
        );
        cy.contains("Your saved work could not be loaded").should("exist");
        cy.get('[role="alert"]').should("not.exist");
    });

    it("tells the host nothing went wrong with the document", () => {
        // `setIsInErrorState` is how a host learns its document failed. A
        // document that is on screen and working has not, whatever the host
        // could not produce for it — and a host told otherwise may take the
        // activity down itself.
        const errorStates: boolean[] = [];

        cy.mount(
            <DoenetViewer
                doenetML={STATEFUL_DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
                setIsInErrorState={(inError: boolean) => {
                    errorStates.push(inError);
                }}
            />,
        );

        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        postStateError("storage unavailable");
        cy.contains("storage unavailable", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        cy.wait(SETTLE);
        cy.then(() => {
            expect(
                errorStates.some((inError) => inError),
                "the host was put into an error state",
            ).to.eq(false);
        });
    });

    it("shows both failures when the host answers before the ladder gives up", () => {
        // Defect 2 of #1741: the pane had two writers and no rule, so a
        // reader was told either that no core started or what the host said
        // about the saved state, depending on arrival order alone. Here the
        // host answers first and the boot ladder gives up after it; the
        // give-up screen — the generic message, and the one the retry belongs
        // to — takes the pane, and the host's specific wording is added
        // beneath rather than being replaced by it.
        //
        // The other order is `DoenetViewer.coreStartRetry.cy.tsx`, "keeps the
        // offer when a host state error lands on the pane too".
        doenetGlobalConfig.coreBootMaxAttempts = 1;
        doenetGlobalConfig.coreHandshakeWatchdogMs = 2000;
        doenetGlobalConfig.__doenetTestCoreInitHook = (phase) => {
            if (phase === "handshake") {
                return new Promise<void>(() => {
                    /* never resolves */
                });
            }
        };

        const hostListener = (e: MessageEvent) => {
            if (
                typeof e.data === "object" &&
                e.data?.subject === "SPLICE.getState"
            ) {
                window.postMessage({
                    subject: "SPLICE.getState.response",
                    message_id: e.data.message_id,
                    error: { code: 500, message: "storage unavailable" },
                });
            }
        };
        cy.then(() => window.addEventListener("message", hostListener));

        cy.mount(
            <DoenetViewer
                doenetML="<p>never boots</p>"
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        cy.contains("could not be started", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");
        cy.get('[role="alert"]').should("contain.text", "could not be started");
        cy.get('[role="alert"]').should("contain.text", "storage unavailable");
        cy.contains("button", "Try again").should("exist");
        cy.then(() => window.removeEventListener("message", hostListener));
    });

    it("never puts the notice on the page in the same commit as its region", () => {
        // A live region a screen reader first meets with text already in it
        // is unreliably announced, and this region does not exist until the
        // document does — a booting viewer returns before rendering its
        // container. So a host that answers before the first render, which is
        // an ordinary host (the coordinator's in-page warehouse answers from
        // memory), would put region and text on the page together.
        //
        // Announcement itself is not observable from a spec. What is, and
        // what it rests on, is the DOM event: no `role="status"` node is ever
        // inserted already carrying the notice. Watched from before the mount,
        // since the insertion under test is the container's own.
        const inserted: string[] = [];

        cy.window().then((win) => {
            const observer = new win.MutationObserver((records) => {
                for (const record of records) {
                    for (const node of Array.from(record.addedNodes)) {
                        if (!(node instanceof win.HTMLElement)) {
                            continue;
                        }
                        const regions = [
                            ...(node.getAttribute("role") === "status"
                                ? [node]
                                : []),
                            ...Array.from(
                                node.querySelectorAll('[role="status"]'),
                            ),
                        ];
                        for (const region of regions) {
                            if (region.textContent?.trim()) {
                                inserted.push(region.textContent.trim());
                            }
                        }
                    }
                }
            });
            observer.observe(win.document.body, {
                childList: true,
                subtree: true,
            });
            cy.wrap(null).then(() => observer);
        });

        // Answered synchronously, so the error is in hand well before the
        // core finishes booting.
        const hostListener = (e: MessageEvent) => {
            if (
                typeof e.data === "object" &&
                e.data?.subject === "SPLICE.getState"
            ) {
                window.postMessage({
                    subject: "SPLICE.getState.response",
                    message_id: e.data.message_id,
                    error: { code: 500, message: "storage unavailable" },
                });
            }
        };
        cy.then(() => window.addEventListener("message", hostListener));

        cy.mount(
            <DoenetViewer
                doenetML={STATEFUL_DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        // The notice does arrive — the assertion below is only worth
        // something if it did.
        cy.get('[role="status"]', { timeout: VIEWER_TIMEOUT }).should(
            "contain.text",
            "storage unavailable",
        );
        cy.then(() => {
            window.removeEventListener("message", hostListener);
            expect(
                inserted,
                "status regions inserted with text already in them",
            ).to.deep.eq([]);
        });
    });

    it("survives an error whose message is not text", () => {
        // The message is rendered as a React child, so a host that sends
        // something else — an object, a number — must not reach the render.
        // Beside the document that throw goes to the error boundary and
        // replaces the very document this notice exists to keep; on the
        // failure pane, which is returned above the boundary, nothing would
        // catch it.
        //
        // Nothing is shown in its place. The viewer's own words for this used
        // to appear here, and they describe the host's bug to a reader who
        // cannot act on it, over a document that is working
        // (Doenet/DoenetML#1795).
        cy.mount(
            <DoenetViewer
                doenetML={STATEFUL_DOC}
                addVirtualKeyboard={false}
                flags={{ allowLoadState: true }}
            />,
        );

        cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should("exist");
        cy.window().then((win) => {
            win.postMessage(
                {
                    subject: "SPLICE.getState.response",
                    error: { code: 500, message: { nested: "not text" } },
                },
                "*",
            );
        });

        cy.wait(SETTLE);
        cy.contains("Invalid response to getState").should("not.exist");
        cy.contains("Your saved work could not be loaded").should("not.exist");
        cy.contains("Enter text:").should("exist");
        cy.get(TEXT_INPUT).type("{selectall}{backspace}still usable{enter}");
        cy.contains("You typed: still usable", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");
    });

    it("retires the notice when the document is rebuilt", () => {
        // The notice describes this document's state load. A different
        // document — an editor recompile, a host swapping in the next
        // activity — has asked no host for anything yet.
        function Harness() {
            const [doenetML, setDoenetML] = React.useState(
                "<p>first document</p>",
            );
            return (
                <div>
                    <button
                        type="button"
                        data-test="recompile"
                        onClick={() => setDoenetML("<p>second document</p>")}
                    >
                        recompile
                    </button>
                    <DoenetViewer
                        doenetML={doenetML}
                        addVirtualKeyboard={false}
                        flags={{ allowLoadState: true }}
                    />
                </div>
            );
        }

        cy.mount(<Harness />);

        cy.contains("first document", { timeout: VIEWER_TIMEOUT }).should(
            "exist",
        );
        postStateError("storage unavailable");
        cy.contains("storage unavailable", {
            timeout: VIEWER_TIMEOUT,
        }).should("exist");

        cy.get('[data-test="recompile"]').click();
        cy.contains("second document", { timeout: VIEWER_TIMEOUT }).should(
            "exist",
        );
        cy.contains("storage unavailable").should("not.exist");
    });
});
