// E2E for what a reader sees when the document itself cannot be built (#1920).
//
// This is the one part of that path nothing else runs. `isDocumentBuildFailure`
// is unit-tested, the worker's marking and its panic message are covered
// against a real `CoreWorker` in `CoreWorker.reinitialize.test.ts`, and
// `coordinatorBootFailure.cy.js` covers the opposite case — a transient failure
// that keeps its retry. What had only been read is the join: a marked failure
// arriving in `DocViewer`'s handshake loop, standing the worker down, and
// putting the cause on the screen with no **Try again** beside it.
//
// The document is an index into a composite written before the composite, which
// traps the Rust expander (#1942, pinned on the Rust side by
// `an_index_into_a_composite_of_refs_traps`). It fails the same way on `main`;
// what this asserts is what the viewer does with the failure. **If #1942 is
// fixed this document will render and this spec will fail** — swap in whatever
// still fails to build, or retire it with the tests that pin the same shape.

const FAIL_TIMEOUT = 20_000;

describe(
    "DocViewer: a document that cannot be built",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        function renderDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
        }

        it("shows the cause and offers no retry", () => {
            renderDoenetML(
                `$g[1]<group name="g">$x</group><p name="x">hello</p>`,
            );

            cy.get("[role='alert']", { timeout: FAIL_TIMEOUT }).should(
                (pane) => {
                    const text = pane.text();

                    // The pane says what happened, and does not advise the reload that
                    // cannot help.
                    expect(text).to.contain("could not be built");
                    expect(text).to.not.contain("Reload");

                    // And it names what actually fired. Without the panic message the
                    // trap reaches JavaScript as `RuntimeError: unreachable`, which
                    // tells the reader nothing about their document; the message is
                    // read off the wasm module rather than off the core precisely so
                    // it survives the trap.
                    expect(text).to.contain("Expected an element");
                    expect(text).to.not.contain("unreachable");
                },
            );

            // No retry: the same source through the same code fails the same way,
            // so a button here spends the reader's one attempt on nothing.
            cy.get("[role='alert']").find("button").should("not.exist");
        });

        it("renders a document that is fine, so the failure above is the document's", () => {
            // The control. Without it the assertions above would also pass if the
            // harness never rendered anything at all.
            renderDoenetML(`<p name="ok">hello</p>`);

            cy.get("#ok").should("have.text", "hello");
            cy.get("[role='alert']").should("not.exist");
        });
    },
);
