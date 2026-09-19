// E2E for what a reader sees when the document itself cannot be built (#1920).
//
// This is the one part of that path nothing else runs. `isDocumentBuildFailure`
// is unit-tested, the worker's marking and its panic message are covered
// against a real `CoreWorker` in `CoreWorker.reinitialize.test.ts`, and
// `coordinatorBootFailure.cy.js` covers the opposite case -- a transient failure
// that keeps its retry. What had only been read is the join: a marked failure
// reaching `DocViewer`, standing the worker down, and putting the cause on the
// screen with no **Try again** beside it.
//
// The failure is injected through `__doenetTestCoreInitHook`, the existing
// test-only seam `DocViewer` awaits at each phase of getting a document on
// screen (`global-config.ts`; `undefined` in production, where the phase is
// never awaited at all). It is installed in `onBeforeLoad` because
// `adoptExistingGlobalConfig` reads `window.doenetGlobalConfig` once, as the
// bundle's module evaluates -- a config written after that is a different
// object and the viewer never sees it.
//
// Injecting rather than writing a document that really fails is the point: the
// documents that fail today are bugs we intend to fix, and a spec for #1920's
// boundary would then be testing whether the bug survived. The seam also
// reaches both branches of the fix, which no single document does: the early
// return in the handshake retry loop, and the `generateJavascriptDast` catch.
// What the seam cannot show is a real wasm trap's message surviving to the
// reader -- that needs a real trap, and is covered at the worker level.

const FAIL_TIMEOUT = 20_000;

/** The `name` the worker puts on a build failure, which is what the viewer matches on. */
const DOCUMENT_BUILD_ERROR_NAME = "DoenetDocumentBuildError";

const CAUSE = "simulated build failure from the test seam";

describe(
    "DocViewer: a document that cannot be built",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
        });

        /**
         * Load the page with the seam armed to throw a document-build failure
         * at `failingPhase`, and record every phase it is asked for so a test
         * can assert how many attempts were made.
         *
         * The error is built with the page's own `Error`, not the spec's:
         * `DocViewer` reads the cause through `err instanceof Error`, which is
         * false for an error from another realm, and the pane would then show
         * no cause at all -- passing the "no retry" half while silently losing
         * the half that matters most to an author.
         */
        function visitWithFailureAt(failingPhase) {
            cy.visit("/", {
                onBeforeLoad(win) {
                    win.__phasesSeen = [];
                    win.doenetGlobalConfig = {
                        __doenetTestCoreInitHook: (phase) => {
                            win.__phasesSeen.push(phase);
                            if (phase !== failingPhase) {
                                return;
                            }
                            const err = new win.Error(CAUSE);
                            err.name = DOCUMENT_BUILD_ERROR_NAME;
                            throw err;
                        },
                    };
                },
            });
        }

        function renderDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
        }

        function expectFailurePaneWithCauseAndNoRetry() {
            cy.get("[role='alert']", { timeout: FAIL_TIMEOUT }).should(
                (pane) => {
                    const text = pane.text();

                    // The pane says what happened, names the cause -- which
                    // until now reached `console.error` and nowhere else -- and
                    // does not advise the reload that cannot help.
                    expect(text).to.contain("could not be built");
                    expect(text).to.contain(CAUSE);
                    expect(text).to.not.contain("Reload");
                    expect(text).to.not.contain("could not be started");
                },
            );

            // No retry: the same source through the same code fails the same
            // way, so a button here spends the reader's one attempt on nothing.
            cy.get("[role='alert']").find("button").should("not.exist");
        }

        it("reports a failure raised during the handshake, without retrying it", () => {
            visitWithFailureAt("handshake");
            renderDoenetML(`<p name="p">hello</p>`);

            expectFailurePaneWithCauseAndNoRetry();

            // The ladder would otherwise take three attempts at this before
            // offering the reader a fourth. One handshake means it stopped on
            // the first, which is the whole point of marking the failure.
            cy.window()
                .its("__phasesSeen")
                .should((phases) => {
                    expect(
                        phases.filter((p) => p === "handshake"),
                    ).to.have.length(1);
                });
        });

        it("reports a failure raised during evaluation", () => {
            // The other branch: the handshake succeeded, so the worker is
            // known good and the failure came out of building the document.
            visitWithFailureAt("generate");
            renderDoenetML(`<p name="p">hello</p>`);

            expectFailurePaneWithCauseAndNoRetry();

            // Both phases ran, so this really is the second branch: the
            // handshake was asked for and did not fail, and the failure came
            // afterwards. Without this the test would pass just as well if the
            // handshake branch had caught it.
            cy.window()
                .its("__phasesSeen")
                .should((phases) => {
                    expect(phases).to.include("handshake");
                    expect(phases).to.include("generate");
                });
        });

        it("renders a document when the seam does not fail, so the failures above are the seam's", () => {
            // The control. Without it the assertions above would also pass if
            // the harness never rendered anything at all.
            visitWithFailureAt("never");
            renderDoenetML(`<p name="ok">hello</p>`);

            cy.get("#ok").should("have.text", "hello");
            cy.get("[role='alert']").should("not.exist");
        });
    },
);
