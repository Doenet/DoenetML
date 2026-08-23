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
