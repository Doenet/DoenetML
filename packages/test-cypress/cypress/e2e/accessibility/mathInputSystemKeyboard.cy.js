/**
 * Which on-screen keyboard a math input lets a touch device raise.
 *
 * On a touch device a math input sets `inputmode="none"` on its textarea, so
 * the device's own keyboard stays down and the Doenet virtual keyboard is the
 * one in play. That is only right when there is a Doenet keyboard: a viewer
 * embedded with `addVirtualKeyboard={false}` that kept the device's keyboard
 * down too left the reader with no way to type into a math input at all.
 *
 * Chrome reports a coarse primary pointer when touch emulation is on, which is
 * what the devtools protocol call below switches — a media feature cannot be
 * faked from page scripts.
 */

function emulateTouchDevice(enabled) {
    return cy.wrap(
        Cypress.automation("remote:debugger:protocol", {
            command: "Emulation.setTouchEmulationEnabled",
            params: { enabled, maxTouchPoints: 5 },
        }),
        { log: false },
    );
}

describe("Math input system keyboard", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    afterEach(() => {
        // Leave the browser as it was found; emulation is per-browser, not
        // per-test, so a leaked setting would follow the next spec.
        emulateTouchDevice(false);
    });

    function loadWithMathInput(message = {}) {
        cy.get("#testRunner_toggleControls").should("exist");
        cy.window().then((win) => {
            win.postMessage(
                { doenetML: `<p><mathInput name="mi" /></p>`, ...message },
                "*",
            );
        });
        cy.get("#mi textarea").should("exist");
    }

    function expectCoarsePointer() {
        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a coarse primary pointer",
            ).to.equal(true);
        });
    }

    it("keeps the device's keyboard down when the virtual keyboard is there", () => {
        emulateTouchDevice(true);
        loadWithMathInput();
        expectCoarsePointer();

        cy.get(".open-keyboard-button").should("exist");
        cy.get("#mi textarea").should("have.prop", "inputMode", "none");
    });

    it("leaves the device's keyboard in play when there is no virtual keyboard", () => {
        emulateTouchDevice(true);
        loadWithMathInput({ addVirtualKeyboard: false });
        expectCoarsePointer();

        cy.get(".open-keyboard-button").should("not.exist");
        cy.get("#mi textarea").should("have.prop", "inputMode", "text");
    });
});
