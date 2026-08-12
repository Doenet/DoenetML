/**
 * Touch-target sizes for the virtual keyboard (issue #449).
 *
 * On a device driven by a fingertip rather than a pointer, every control in
 * the tray needs a target a fingertip can land on. 44px is the minimum in
 * Apple's HIG and in WCAG 2.5.5. The tray shipped with a 48x24 tab to open it,
 * a 24x24 button to close it, layout tabs measuring 30x25 on a phone, and
 * 39x40 keys.
 *
 * Chrome reports a coarse primary pointer when touch emulation is on, which is
 * what the devtools protocol calls below switch — a media feature cannot be
 * faked from page scripts. These run in the e2e suite rather than as component
 * tests because the sizes come from Tailwind `@apply` utilities, which are
 * only compiled into the package's built stylesheet; a component test mounting
 * the source measures elements with no sizing applied at all.
 */

/** The smallest target a fingertip can reliably land on. */
const MIN_TOUCH_TARGET_PX = 44;

/** What the tab that opens a closed tray measures when a mouse is driving. */
const DESKTOP_TAB_HEIGHT_PX = 24;

function emulateTouchDevice(enabled) {
    return cy
        .wrap(
            Cypress.automation("remote:debugger:protocol", {
                command: "Emulation.setTouchEmulationEnabled",
                params: { enabled, maxTouchPoints: 5 },
            }),
            { log: false },
        )
        .then(() =>
            cy.wrap(
                Cypress.automation("remote:debugger:protocol", {
                    command: "Emulation.setEmitTouchEventsForMouse",
                    params: { enabled, configuration: "mobile" },
                }),
                { log: false },
            ),
        );
}

/** Asserts every element matching `selector` is at least `min` px tall. */
function expectAllAtLeastTall(selector, min, label) {
    cy.get(selector).should(($elements) => {
        expect($elements.length, `${label}s found`).to.be.greaterThan(0);
        $elements.each((_, element) => {
            const name = element.textContent?.trim() || element.className;
            expect(
                Math.round(element.getBoundingClientRect().height),
                `${label} "${name}" height`,
            ).to.be.at.least(min);
        });
    });
}

describe("Virtual keyboard touch target sizes", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    afterEach(() => {
        // Leave the browser as it was found; emulation is per-browser, not
        // per-test, so a leaked setting would follow the next spec.
        emulateTouchDevice(false);
    });

    function loadWithMathInput() {
        cy.get("#testRunner_toggleControls").should("exist");
        cy.window().then((win) => {
            win.postMessage(
                { doenetML: `<p><mathInput name="mi" /></p>` },
                "*",
            );
        });
        cy.get("#mi").should("exist");
    }

    it("gives every control a fingertip-sized target on a touch device", () => {
        emulateTouchDevice(true);
        loadWithMathInput();

        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a coarse primary pointer",
            ).to.equal(true);
        });

        // The tab that opens a closed tray. It is the only way in, and it
        // is the control the screenshot in #449 was taken of.
        cy.get(".open-keyboard-button").should(($tab) => {
            const { width, height } = $tab[0].getBoundingClientRect();
            expect(
                Math.round(height),
                "open-keyboard tab height",
            ).to.be.at.least(MIN_TOUCH_TARGET_PX);
            expect(Math.round(width), "open-keyboard tab width").to.be.at.least(
                MIN_TOUCH_TARGET_PX,
            );
        });

        cy.get(".open-keyboard-button").click();
        cy.get("#virtual-keyboard-tray.open").should("exist");

        expectAllAtLeastTall(
            ".close-keyboard-button",
            MIN_TOUCH_TARGET_PX,
            "close button",
        );
        expectAllAtLeastTall(
            "#virtual-keyboard-tray .virtual-keyboard-tab-list button",
            MIN_TOUCH_TARGET_PX,
            "layout tab",
        );
        expectAllAtLeastTall(
            "#virtual-keyboard-tray .virtual-keyboard button",
            MIN_TOUCH_TARGET_PX,
            "key",
        );

        // Taller keys must not push the tray past the bottom of the
        // screen, which is the way this kind of change usually goes wrong.
        cy.get("#virtual-keyboard-tray").should(($tray) => {
            expect(
                $tray[0].scrollHeight,
                "tray content height fits the viewport",
            ).to.be.at.most(Cypress.config("viewportHeight"));
        });
    });

    it("leaves the sizes alone when a mouse is driving", () => {
        // Not merely the absence of the touch rules: the tray's desktop
        // proportions are long-standing, and widening the tab in
        // particular would collide with the space the editor footer
        // reserves for it. Update this if desktop sizing changes on
        // purpose.
        loadWithMathInput();

        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a fine primary pointer",
            ).to.equal(false);
        });

        cy.get(".open-keyboard-button").should(($tab) => {
            expect(
                Math.round($tab[0].getBoundingClientRect().height),
                "open-keyboard tab height",
            ).to.equal(DESKTOP_TAB_HEIGHT_PX);
        });
    });
});
