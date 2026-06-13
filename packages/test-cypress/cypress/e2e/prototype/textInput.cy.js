/**
 * End-to-end coverage for the `doenetml-prototype` renderers driven through the
 * FlatDast format. The prototype can be backed by either the rust core
 * (default) or the JavaScript core (`prototypeCoreType: "javascript"`), the
 * latter exercising the `flatDastUpdateFromJS` / `dispatchActionJavascriptFlat`
 * update path added for issue #1310.
 *
 * The harness in `CypressTest.tsx` renders the prototype `DoenetML` component
 * (instead of the `@doenet/doenetml` viewer) when a message carries
 * `usePrototype: true`. The prototype wraps its output in
 * `.doenet-document`, so the assertions below target that subtree.
 */

// The prototype renderers do not emit name-based html ids the way the
// `@doenet/doenetml` viewer does, so target the input/echoes structurally
// within the prototype's `.doenet-document` wrapper.
const inputSelector = ".doenet-document .text-input input";

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

describe("Prototype textInput Tests", { tags: ["@group1"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Run the same interaction against both cores. The rust core is the
    // existing default; the javascript core validates the FlatDast update
    // round-trip (`dispatchActionJavascriptFlat`) from issue #1310.
    for (const coreType of ["rust", "javascript"]) {
        it(`typing into a textInput updates bound echoes (${coreType} core)`, () => {
            loadPrototype(
                `
    <textInput name="ti" />
    <p>Immediate: $ti.immediateValue</p>
    <p>Value: $ti.value</p>
    `,
                coreType,
            );

            // The input exists once the prototype has rendered.
            cy.get(inputSelector).should("exist");

            // Before any interaction both echoes are empty.
            cy.contains(".doenet-document .para", "Immediate:").should(
                "have.text",
                "Immediate: ",
            );
            cy.contains(".doenet-document .para", "Value:").should(
                "have.text",
                "Value: ",
            );

            // Typing updates the immediate-value echo on every keystroke, but
            // the (committed) value echo stays empty until the input is blurred.
            cy.get(inputSelector).type("hello");
            cy.contains(".doenet-document .para", "Immediate:").should(
                "have.text",
                "Immediate: hello",
            );
            cy.contains(".doenet-document .para", "Value:").should(
                "have.text",
                "Value: ",
            );

            // Blurring commits the value, so the value echo now matches.
            cy.get(inputSelector).blur();
            cy.contains(".doenet-document .para", "Immediate:").should(
                "have.text",
                "Immediate: hello",
            );
            cy.contains(".doenet-document .para", "Value:").should(
                "have.text",
                "Value: hello",
            );

            // A further edit committed with Enter updates both echoes.
            cy.get(inputSelector).type("{selectAll}world{enter}");
            cy.contains(".doenet-document .para", "Immediate:").should(
                "have.text",
                "Immediate: world",
            );
            cy.contains(".doenet-document .para", "Value:").should(
                "have.text",
                "Value: world",
            );
        });
    }
});
