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

/**
 * How wide the keyboard is allowed to spread, `max-w-2xl` (42rem) with a mouse
 * and 48rem with a fingertip. The default viewport is wider than both, so the
 * keyboard reaches its ceiling either way and these are what it measures. The
 * extra room is what makes a tablet's keys grow rather than sit small in the
 * middle of an empty row.
 */
const KEYBOARD_MAX_WIDTH_PX = { fine: 672, coarse: 768 };

/**
 * A phone held sideways — short enough that the tray runs into the ceiling on
 * its own height, which is the only place that ceiling is observable.
 */
const SHORT_VIEWPORT = { width: 568, height: 320 };

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

/**
 * Maps a point in the application's viewport to the coordinates the devtools
 * protocol works in, which are the browser page's. The application under test
 * runs in an iframe of the Cypress runner, and Cypress may scale that iframe
 * to fit the window, so both the offset and the scale have to be undone.
 */
function toBrowserCoords(win, x, y) {
    const iframe = Array.from(
        window.top.document.querySelectorAll("iframe"),
    ).find((frame) => frame.contentWindow === win);
    const rect = iframe.getBoundingClientRect();
    const scale = rect.width / win.innerWidth;
    return { x: rect.left + x * scale, y: rect.top + y * scale };
}

/**
 * Drags a finger `distance` px up the middle of `element`.
 *
 * Real touch input through the browser, not a synthesised `TouchEvent`: an
 * untrusted event would not reach the compositor, which is what decides
 * whether a pan scrolls. That decision is the point of the assertions below.
 */
function panFingerUp(win, element, distance) {
    const rect = element.getBoundingClientRect();
    const start = toBrowserCoords(
        win,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
    );
    const steps = 12;
    const touch = (type, y) =>
        cy.wrap(
            Cypress.automation("remote:debugger:protocol", {
                command: "Input.dispatchTouchEvent",
                params: {
                    type,
                    touchPoints:
                        type === "touchEnd"
                            ? []
                            : [{ x: Math.round(start.x), y: Math.round(y) }],
                },
            }),
            { log: false },
        );

    let chain = touch("touchStart", start.y);
    for (let step = 1; step <= steps; step++) {
        const y = start.y - (distance * step) / steps;
        chain = chain
            .then(() => touch("touchMove", y))
            .wait(16, { log: false });
    }
    return chain.then(() => touch("touchEnd"));
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

        // Taller keys must not make the tray outgrow the screen. On a viewport
        // with room for it — this one — nothing should have to be scrolled
        // into reach before it can be tapped, which is the way this kind of
        // change usually goes wrong. The short viewport that does run out of
        // room is a test of its own below.
        cy.get("#virtual-keyboard-tray").should(($tray) => {
            expect(
                $tray[0].getBoundingClientRect().height,
                "tray height fits the viewport",
            ).to.be.at.most(Cypress.config("viewportHeight"));
            const container = $tray[0].querySelector(".keyboard-container");
            expect(
                container.scrollHeight,
                "keyboard content fits the tray without scrolling",
            ).to.be.at.most(container.clientHeight);
        });

        // Where there is room, the keyboard spreads further than it does for
        // a mouse, which is what makes a tablet's keys wider rather than
        // leaving them small in the middle of an empty row.
        cy.get("#virtual-keyboard-tray .virtual-keyboard").should(($kb) => {
            expect(
                Math.round($kb[0].getBoundingClientRect().width),
                "keyboard width",
            ).to.equal(KEYBOARD_MAX_WIDTH_PX.coarse);
        });
    });

    it("keeps the open/close tab on screen when the tray fills a short viewport", () => {
        // The tab hangs its own height above the tray, so the tray's
        // `max-height` has to leave that much clear. A short viewport is the
        // only place the ceiling is reached, and widening the tab for a
        // fingertip without widening the gap clipped it off the top.
        cy.viewport(SHORT_VIEWPORT.width, SHORT_VIEWPORT.height);
        emulateTouchDevice(true);
        loadWithMathInput();

        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a coarse primary pointer",
            ).to.equal(true);
        });

        cy.get(".open-keyboard-button").click();

        cy.get("#virtual-keyboard-tray.open").should(($tray) => {
            // The tray slides up over 300ms, and while it is still below the
            // fold the tab is trivially on screen — so wait for the tray to
            // reach the bottom edge before believing anything about the tab.
            expect(
                Math.round($tray[0].getBoundingClientRect().bottom),
                "tray settled against the bottom of the screen",
            ).to.equal(SHORT_VIEWPORT.height);

            const tab = $tray[0].querySelector(".open-keyboard-button");
            expect(
                Math.round(tab.getBoundingClientRect().top),
                "open/close tab top edge",
            ).to.be.at.least(0);
        });
    });

    it("lets a finger reach the keys that do not fit a short viewport", () => {
        // A viewport too short for the keyboard used to cut the bottom rows
        // off — on the numeric layout, the whole number pad. Taller keys made
        // that worse, so the keyboard scrolls inside the tray instead.
        //
        // Whether a finger can actually pan it is not a foregone conclusion:
        // the tray cancels the default action of `pointerdown` across its
        // whole subtree, to keep the key it is typing into from blurring. That
        // does not suppress a pan — only `touch-action` or a cancelled
        // `touchstart`/`touchmove` would — and this is what says so.
        cy.viewport(SHORT_VIEWPORT.width, SHORT_VIEWPORT.height);
        emulateTouchDevice(true);
        loadWithMathInput();

        cy.get(".open-keyboard-button").click();
        cy.get("#virtual-keyboard-tray.open").should(($tray) => {
            // Wait out the slide-in, as above: measurements of a tray still on
            // its way up mean nothing.
            expect(
                Math.round($tray[0].getBoundingClientRect().bottom),
                "tray settled against the bottom of the screen",
            ).to.equal(SHORT_VIEWPORT.height);
        });

        const container = "#virtual-keyboard-tray .keyboard-container";
        cy.get(container).should(($container) => {
            const element = $container[0];
            expect(
                element.scrollHeight,
                "keyboard is taller than the room the tray has for it",
            ).to.be.greaterThan(element.clientHeight);
            expect(
                Math.round(element.getBoundingClientRect().bottom),
                "keyboard's scroll port ends on screen",
            ).to.be.at.most(SHORT_VIEWPORT.height);
        });

        // Far enough to reach the end of the scroll, which is where the last
        // row is.
        cy.window().then((win) =>
            panFingerUp(win, win.document.querySelector(container), 300),
        );

        cy.get(container).should(($container) => {
            expect(
                $container[0].scrollTop,
                "keyboard scrolled under a finger",
            ).to.be.greaterThan(0);
            const keys = $container[0].querySelectorAll(
                ".virtual-keyboard button",
            );
            expect(
                Math.round(
                    keys[keys.length - 1].getBoundingClientRect().bottom,
                ),
                "last key on screen once scrolled to",
            ).to.be.at.most(SHORT_VIEWPORT.height);
        });

        // The close button is inside the scroll port in the markup but
        // positioned against the tray, so scrolling must not carry it away.
        cy.get(".close-keyboard-button").should(($close) => {
            const { top, bottom } = $close[0].getBoundingClientRect();
            expect(Math.round(top), "close button top").to.be.at.least(0);
            expect(Math.round(bottom), "close button bottom").to.be.at.most(
                SHORT_VIEWPORT.height,
            );
        });

        // The layout tabs are the first thing in the scroll port, so a tray
        // that reopened where it was left would be missing them. A closed
        // tray keeps its scroll position — it is only translated off the
        // screen — so opening has to put it back.
        cy.get(".close-keyboard-button").click();
        cy.get("#virtual-keyboard-tray.open").should("not.exist");
        cy.get(".open-keyboard-button").click();

        cy.get("#virtual-keyboard-tray.open").should(($tray) => {
            expect(
                $tray[0].querySelector(".keyboard-container").scrollTop,
                "keyboard reopened at the top",
            ).to.equal(0);
            const tabs = $tray[0].querySelector(".virtual-keyboard-tab-list");
            expect(
                Math.round(tabs.getBoundingClientRect().bottom),
                "layout tabs back in view",
            ).to.be.at.most(SHORT_VIEWPORT.height);
            expect(
                Math.round(tabs.getBoundingClientRect().top),
                "layout tabs back in view",
            ).to.be.at.least(0);
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

        cy.get(".open-keyboard-button").click();
        cy.get("#virtual-keyboard-tray.open").should("exist");

        cy.get("#virtual-keyboard-tray .virtual-keyboard").should(($kb) => {
            expect(
                Math.round($kb[0].getBoundingClientRect().width),
                "keyboard width",
            ).to.equal(KEYBOARD_MAX_WIDTH_PX.fine);
        });
    });
});
