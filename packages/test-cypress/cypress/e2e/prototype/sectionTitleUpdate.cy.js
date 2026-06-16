/**
 * Regression coverage for the issue #1310 follow-up: when a textInput
 * referenced inside a section title is updated through the JavaScript core, the
 * rendered section header must show the title exactly once.
 *
 * A section whose `<title>` references a value (e.g. `$ti.immediateValue`) is
 * rendered by the prototype as `<displayName> <title>`, where `displayName`
 * comes from the section's `xrefLabel.label`. The JS->Rust section fixup is
 * supposed to clear `xrefLabel.label` whenever the section has a title child
 * (so the title is rendered only once, via the title element). A bug in the
 * update path left `xrefLabel.label` set to the full title text, so after
 * typing the header duplicated as "My cool section hi My cool section hi".
 *
 * The prototype renders the section header in an `h2` inside `.section`.
 */

const inputSelector = ".doenet-document .text-input input";
// The section header is an h1..h6 depending on division depth (the rust and JS
// cores currently pick different levels), so match any heading in the section.
const headerSelector = ".doenet-document .section :is(h1, h2, h3, h4, h5, h6)";

function loadPrototype(doenetML, coreType) {
    cy.window().then((win) => {
        win.postMessage(
            {
                doenetML,
                usePrototype: true,
                prototypeCoreType: coreType,
            },
            "*",
        );
    });
}

const doenetML = `
<section name="fun">
  <title>My cool section $ti.immediateValue</title>
  <p>Some content</p>
  <p>Go ahead and edit the title: <textInput prefill="_sample_" name="ti" /></p>
</section>
`;

function countOccurrences(text, needle) {
    return text.split(needle).length - 1;
}

describe(
    "Prototype section title update Tests",
    { tags: ["@group1"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            // MathJax loads its runtime from a CDN; in offline CI that download
            // fails with an unhandled rejection that is unrelated to this test.
            cy.on("uncaught:exception", (err) => {
                if (err.message.includes("MathJax")) {
                    return false;
                }
            });
        });

        for (const coreType of ["rust", "javascript"]) {
            it(`updating a textInput in a section title does not duplicate the title text (${coreType} core)`, () => {
                loadPrototype(doenetML, coreType);

                // The header starts with the input's prefill value, shown once.
                cy.get(inputSelector).should("have.value", "_sample_");
                cy.get(headerSelector)
                    .first()
                    .invoke("text")
                    .should((text) => {
                        expect(text).to.contain("My cool section _sample_");
                        expect(
                            countOccurrences(text, "My cool section"),
                            "occurrences of 'My cool section' in header before edit",
                        ).to.equal(1);
                    });

                // Highlight the existing input contents and replace them in a
                // single edit (mirrors selecting "_sample_" and typing "hi").
                cy.get(inputSelector).type("{selectAll}hi");

                // The header must reflect the new value exactly once — not
                // "My cool section hi My cool section hi".
                cy.get(headerSelector)
                    .first()
                    .invoke("text")
                    .should((text) => {
                        expect(text).to.contain("My cool section hi");
                        expect(
                            countOccurrences(text, "My cool section"),
                            "occurrences of 'My cool section' in header after edit",
                        ).to.equal(1);
                    });
            });
        }
    },
);
