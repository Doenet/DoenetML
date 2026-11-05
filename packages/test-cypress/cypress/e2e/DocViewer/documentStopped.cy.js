// E2E for what a reader sees when something they do creates a circular
// dependency in a document that loaded fine (#2137).
//
// The core used to catch the error, report the action as failed with an empty
// message, and carry on with a cycle in its graph until evaluating it ran the
// worker out of memory. It now stops the document and tells the viewer, which
// shows the cause in place of the document. The worker side is covered in
// `circularReferences.test.ts`; this is the join between the two.
//
// Unlike `documentBuildFailure.cy.js`, this uses a real document: a component
// that extends itself is an authoring error, not a bug we intend to fix, so it
// will go on creating a cycle when it is switched on.

const FAIL_TIMEOUT = 20_000;

describe(
    "DocViewer: a document stopped by a circular dependency",
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

        it("shows the cycle in place of the document, with no retry", () => {
            renderDoenetML(`
<p><booleanInput name="b"/></p>
<p name="p">before</p>
<conditionalContent condition="$b"><text name="t" extend="$t"/></conditionalContent>
`);

            cy.get("#p").should("have.text", "before");
            cy.get("[role='alert']").should("not.exist");

            cy.get("#b").click();

            cy.get("[role='alert']", { timeout: FAIL_TIMEOUT }).should(
                (pane) => {
                    const text = pane.text();
                    expect(text).to.contain("stopped working");
                    expect(text).to.contain(
                        "Circular dependency involving these components",
                    );
                },
            );
            cy.get("[role='alert']").find("button").should("not.exist");
        });

        it("keeps running when the same switch creates no cycle", () => {
            // The control: without it the test above would also pass if any
            // conditionalContent switch raised the pane.
            renderDoenetML(`
<p><booleanInput name="b"/></p>
<p name="p">before</p>
<conditionalContent condition="$b"><p>shown</p></conditionalContent>
`);

            cy.get("#p").should("have.text", "before");
            cy.get("#b").click();
            cy.contains(".para", "shown").should("be.visible");
            cy.get("[role='alert']").should("not.exist");
        });
    },
);
