import React from "react";
import { DoenetViewer } from "../../../src/doenetml-inline-worker";
import { trackCoreWorkers } from "./utils/coreWorkers";
import {
    captureReports,
    saveStateAfterTyping,
    TEXT_INPUT,
} from "./utils/splice";

// Component coverage for two initializations landing on one core worker
// (#1533).
//
// `initializeCoreWorker` drives a worker through several separately awaited
// round trips, and the boot ladder reuses a worker whose core is not yet
// created rather than booting another. So a boot started while an
// initialization was still in flight on that worker used to start a second
// one there, interleaved with the first. The second then initialized from a
// document DAST the first had already released, its handshake failed, and the
// ladder discarded the worker as wedged and booted a replacement: the document
// rendered a worker and a WASM init late, behind a warning saying the source
// had never been set.
//
// Three ordinary ways in are pinned here. The observable is how many core
// workers get constructed: one means the later boot ran on the worker it
// found — whole, after the initialization already in flight there — and the
// document is on screen with nothing discarded on the way.
//
// Each case leaves the first initialization no time to settle before the
// second is asked for, and the worker's WASM compile, which the first
// initialization's `setSource` waits on, takes far longer than the moments
// between mounting and clicking. Before the fix every case constructed two.

const VIEWER_TIMEOUT = 30_000;

/** A document with something a reader can leave work in. */
const STATEFUL_DOC = `<p>Enter text: <textInput name="ti" /></p>
<p>You typed: $ti.value</p>`;

/** A viewer on one source, and a button that swaps in another. */
function Rebuildable() {
    const [generation, setGeneration] = React.useState(0);
    return (
        <div>
            <button
                type="button"
                data-test="rebuild"
                onClick={() => setGeneration((g) => g + 1)}
            >
                rebuild
            </button>
            <DoenetViewer
                doenetML={
                    generation === 0
                        ? "<p>first document</p>"
                        : "<p>rebuilt document</p>"
                }
                addVirtualKeyboard={false}
            />
        </div>
    );
}

/** A viewer that starts out not rendering, and a button that turns it on. */
function RenderLater() {
    const [rendering, setRendering] = React.useState(false);
    return (
        <div>
            <button
                type="button"
                data-test="render"
                onClick={() => setRendering(true)}
            >
                render
            </button>
            <DoenetViewer
                doenetML="<p>waiting to be rendered</p>"
                render={rendering}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetViewer initializations that overlap on one worker (#1533)", () => {
    const workers = trackCoreWorkers();

    it("boots on the worker it has when a host answers getState before the first boot is through", () => {
        // The boot does not wait for the host's answer to `SPLICE.getState`,
        // and a host that answers at once — doenet.org's assignment page
        // does, from state it already holds — answers while that first boot
        // is still in its round trips. Adopting the answer restarts the
        // boot, and the restart finds the worker the first boot attached,
        // its core not yet created.
        captureReports().then((reports) => {
            cy.mount(
                <DoenetViewer
                    doenetML={STATEFUL_DOC}
                    addVirtualKeyboard={false}
                />,
            );
            cy.contains("Enter text:", { timeout: VIEWER_TIMEOUT }).should(
                "exist",
            );
            saveStateAfterTyping(
                reports,
                "saved work",
                "capture",
                VIEWER_TIMEOUT,
            ).then((state) => {
                cy.window().then((win) => {
                    const listener = (e: MessageEvent) => {
                        if (e.data?.subject !== "SPLICE.getState") {
                            return;
                        }
                        win.removeEventListener("message", listener);
                        win.postMessage(
                            {
                                subject: "SPLICE.getState.response",
                                message_id: e.data.message_id,
                                state,
                            },
                            "*",
                        );
                    };
                    win.addEventListener("message", listener);
                });
                // The viewer the state was captured from is not the one
                // under test.
                cy.then(() => workers.reset());

                cy.mount(
                    <DoenetViewer
                        doenetML={STATEFUL_DOC}
                        addVirtualKeyboard={false}
                        flags={{ allowLoadState: true }}
                    />,
                );

                cy.contains("You typed: saved work", {
                    timeout: VIEWER_TIMEOUT,
                }).should("exist");
                cy.get(TEXT_INPUT).should("have.value", "saved work");
                cy.contains("could not be started").should("not.exist");
                cy.then(() => {
                    expect(
                        workers.created(),
                        "core workers for the restored document",
                    ).to.equal(1);
                });
            });
        });
    });

    it("boots on the worker it has when the document is rebuilt before the first boot is through", () => {
        // A rebuild — a source edit here; an attempt or variant change, a
        // locale switch and a reader's retry take the same path — re-rolls
        // the document and starts a boot of its own, keeping the worker the
        // superseded boot attached. Not specific to any host.
        cy.mount(<Rebuildable />);
        cy.get('[data-test="rebuild"]').click();

        cy.contains("rebuilt document", { timeout: VIEWER_TIMEOUT }).should(
            "be.visible",
        );
        cy.contains("first document").should("not.exist");
        cy.contains("could not be started").should("not.exist");
        cy.then(() => {
            expect(
                workers.created(),
                "core workers after a rebuild mid-boot",
            ).to.equal(1);
        });
    });

    it("renders with the worker it primed when `render` turns true before the priming is through", () => {
        // A viewer mounted with `render={false}` primes a worker so its host
        // can be told the document's structure, and nothing makes `render`
        // wait for that: a page that turns documents on as they scroll into
        // view turns this one on whenever it likes. The boot then finds the
        // primed worker, its core not yet created, and initializes it again.
        // `DoenetViewer.noRenderCoreWorker.cy.tsx` covers the settled case.
        cy.mount(<RenderLater />);
        cy.get('[data-test="render"]').click();

        cy.contains("waiting to be rendered", {
            timeout: VIEWER_TIMEOUT,
        }).should("be.visible");
        cy.contains("could not be started").should("not.exist");
        cy.then(() => {
            expect(
                workers.created(),
                "core workers after rendering mid-priming",
            ).to.equal(1);
        });
    });
});
