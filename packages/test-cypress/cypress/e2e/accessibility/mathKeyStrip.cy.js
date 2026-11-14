/**
 * The row of math keys shown above a touch device's own keyboard
 * (`mathKeyStrip`).
 *
 * On a phone a math input raises the device's keyboard when the viewer has no
 * Doenet keyboard. That keyboard has letters and digits but no union, root or
 * fraction bar, so the strip adds those. These tests type answers with it and
 * check they are credited, and check what makes it usable: it keeps focus in
 * the math input, it is a labelled toolbar of named buttons operable from a
 * keyboard, it sits at the bottom of the viewport without covering the input,
 * and it stays out of the way where it is not wanted.
 *
 * Chrome reports a coarse primary pointer when touch emulation is on, which is
 * what the devtools protocol call below switches (see
 * `mathInputSystemKeyboard.cy.js`). Cypress's own clicks stand in for taps:
 * what is checked is that the press does not move focus, which is what keeps
 * a real device's keyboard up. A real phone was tried separately (PR notes).
 */

function emulateTouchDevice(enabled) {
    // Sent from inside the command queue, not when the test body runs:
    // `Cypress.automation` acts at once, so a test that turns emulation on
    // and later off would otherwise have both sent before its first command.
    return cy.then({ log: false }, () =>
        Cypress.automation("remote:debugger:protocol", {
            command: "Emulation.setTouchEmulationEnabled",
            params: { enabled, maxTouchPoints: 5 },
        }),
    );
}

const STRIP = ".doenet-math-key-strip";

/** A Tab key press, as MathQuill (keyCode) and the strip (key) read it. */
const TAB = { key: "Tab", keyCode: 9, which: 9 };

function key(label) {
    return cy.get(`${STRIP} button[aria-label="${label}"]`);
}

/** Presses a key of the strip as a tap would, and checks focus stayed put. */
function press(label, inputName) {
    key(label).click();
    cy.focused().should(($el) => {
        expect(
            $el.closest(`#${inputName}`).length,
            `focus is still in ${inputName}`,
        ).to.equal(1);
    });
}

function typeInto(inputName, text) {
    // `force`: the strip may sit over part of the page in a short viewport;
    // the input's own position is checked separately.
    cy.get(`#${inputName} textarea`).type(text, {
        force: true,
        delay: 0,
    });
}

const ANSWERS = `
<p><answer name="a1"><mathInput name="mi1" /><award><math format="latex">x \\cup y</math></award></answer></p>
<p><answer name="a2"><mathInput name="mi2" /><award><math>8^(1/3)</math></award></answer></p>
<p><answer name="a3"><mathInput name="mi3" /><award><math>1/2</math></award></answer></p>
<p><answer name="a4"><mathInput name="mi4" /><award><math>x^2+1</math></award></answer></p>
<p>Credit: <number extend="$a1.creditAchieved" name="c1" />
<number extend="$a2.creditAchieved" name="c2" />
<number extend="$a3.creditAchieved" name="c3" />
<number extend="$a4.creditAchieved" name="c4" /></p>
<p><textInput name="ti" /></p>
`;

describe("Math key strip", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    afterEach(() => {
        // Emulation is per-browser, not per-test; leave it as found.
        emulateTouchDevice(false);
    });

    // Chrome applies touch emulation to `(pointer: coarse)` with a delay, so
    // `load` waits for it before any test focuses anything. Every test
    // emulates a touch device before loading.
    function load(message = {}) {
        cy.get("#testRunner_toggleControls").should("exist");
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: ANSWERS,
                    addVirtualKeyboard: false,
                    mathKeyStrip: true,
                    ...message,
                },
                "*",
            );
        });
        cy.get("#mi4 textarea").should("exist");
        cy.get("#c4").should("have.text", "0");
        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a coarse primary pointer",
            ).to.equal(true);
        });
    }

    function expectCoarsePointer() {
        cy.window().should((win) => {
            expect(
                win.matchMedia("(pointer: coarse)").matches,
                "browser reports a coarse primary pointer",
            ).to.equal(true);
        });
    }

    for (const width of [320, 390]) {
        it(`types a union, an nth root, a fraction and a power, at ${width}px`, () => {
            cy.viewport(width, 700);
            emulateTouchDevice(true);
            load();
            expectCoarsePointer();

            cy.get(STRIP).should("not.be.visible");

            // The device's own keyboard stays in play.
            cy.get("#mi1 textarea").should("have.prop", "inputMode", "text");

            // Union.
            cy.get("#mi1 textarea").focus();
            cy.get(STRIP).should("be.visible");
            typeInto("mi1", "x");
            press("union", "mi1");
            typeInto("mi1", "y{enter}");
            cy.get("#c1").should("have.text", "1");

            // nth root with an index: index, step out into the radicand,
            // radicand, step out of the root.
            cy.get("#mi2 textarea").focus();
            press("nth root", "mi2");
            typeInto("mi2", "3");
            press("step out", "mi2");
            typeInto("mi2", "8");
            press("step out", "mi2");
            typeInto("mi2", "{enter}");
            cy.get("#c2").should("have.text", "1");
            cy.get("#mi2 .mq-root-block").should(($el) => {
                // MathQuill's cursor leaves a zero-width space.
                expect($el.text().replace(/​/g, "")).to.equal("38");
            });

            // Fraction: numerator, fraction key, denominator.
            cy.get("#mi3 textarea").focus();
            typeInto("mi3", "1");
            press("fraction", "mi3");
            typeInto("mi3", "2{enter}");
            cy.get("#c3").should("have.text", "1");

            // Power, then step out of the exponent before "+1". Without the
            // step out, "+1" would land in the exponent and not be credited.
            cy.get("#mi4 textarea").focus();
            typeInto("mi4", "x");
            press("power", "mi4");
            typeInto("mi4", "2");
            press("step out", "mi4");
            typeInto("mi4", "+1{enter}");
            cy.get("#c4").should("have.text", "1");
        });
    }

    it("is a labelled toolbar of named buttons, one tab stop, operable by keyboard", () => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        load();

        cy.get("#mi4 textarea").focus();
        cy.get(STRIP)
            .should("be.visible")
            .and("have.attr", "role", "toolbar")
            .and("have.attr", "aria-label", "Math keys");

        const names = [
            "union",
            "infinity",
            "nth root",
            "fraction",
            "power",
            "pi",
            "intersection",
            "less than or equal to",
            "greater than or equal to",
            "less than",
            "greater than",
            "not equal to",
            "absolute value",
            "plus or minus",
            "step out",
        ];
        cy.get(`${STRIP} button`).should(($buttons) => {
            expect(
                [...$buttons].map((b) => b.getAttribute("aria-label")),
            ).to.deep.equal(names);
            for (const b of $buttons) {
                expect(b.type).to.equal("button");
                // The glyph is not read out; the name is.
                expect(b.querySelector("[aria-hidden='true']")).to.not.equal(
                    null,
                );
            }
            expect(
                [...$buttons].filter((b) => b.tabIndex === 0).length,
                "one tab stop",
            ).to.equal(1);
        });

        // Tab from the input into the strip (a hardware keyboard on a
        // tablet). The input keeps its claim on the keys, so pressing a key
        // with Enter types into it.
        cy.get("#mi4 textarea").trigger("keydown", { ...TAB, force: true });
        cy.focused().should("have.attr", "aria-label", "union");
        cy.get(STRIP).should("be.visible");

        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().should("have.attr", "aria-label", "infinity");
        cy.focused().trigger("keydown", { key: "End" });
        cy.focused().should("have.attr", "aria-label", "step out");
        cy.focused().trigger("keydown", { key: "Home" });
        cy.focused().should("have.attr", "aria-label", "union");
        cy.focused().trigger("keydown", { key: "ArrowLeft" });
        cy.focused().should("have.attr", "aria-label", "step out");
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().trigger("keydown", { key: "ArrowRight" });
        cy.focused().should("have.attr", "aria-label", "pi");
        // A focused button is pressed by the keyboard as a click.
        cy.focused().click();
        cy.get("#mi4 .mq-root-block").should("contain.text", "π");
        cy.get(`${STRIP} button[tabindex="0"]`).should(
            "have.attr",
            "aria-label",
            "pi",
        );

        // Escape goes back to the input.
        cy.focused().trigger("keydown", { key: "Escape" });
        cy.focused().should(($el) => {
            expect($el.closest("#mi4").length).to.equal(1);
        });

        // Tab order is input, strip, then what follows the input; Shift+Tab
        // from the strip goes back to the input. No trap.
        cy.get("#mi4 textarea").trigger("keydown", { ...TAB, force: true });
        cy.focused().should("have.attr", "aria-label", "pi");
        cy.focused().trigger("keydown", { ...TAB, shiftKey: true });
        cy.focused().should(($el) => {
            expect($el.closest("#mi4").length).to.equal(1);
        });
        cy.get("#mi4 textarea").trigger("keydown", { ...TAB, force: true });
        cy.focused().trigger("keydown", TAB);
        cy.focused().should(($el) => {
            const el = $el[0];
            expect(el.closest(".doenet-math-key-strip")).to.equal(null);
            expect(el.closest("#mi4 .mq-editable-field")).to.equal(null);
            // The next stop is the answer's check button, inside `#mi4`'s
            // renderer but after the field.
            const input = el.ownerDocument.querySelector(
                "#mi4 .mq-editable-field",
            );
            expect(
                input.compareDocumentPosition(el) &
                    Node.DOCUMENT_POSITION_FOLLOWING,
                "focus moved on past the input",
            ).to.not.equal(0);
        });
    });

    it("sits at the bottom of the viewport, cuts the last key in view, and leaves the input clear", () => {
        cy.viewport(320, 568);
        emulateTouchDevice(true);
        load();

        cy.get("#mi4 textarea").focus();
        cy.get(STRIP).should("be.visible");

        cy.window().then((win) => {
            const strip = win.document.querySelector(".doenet-math-key-strip");
            const rect = strip.getBoundingClientRect();
            const viewportBottom =
                win.visualViewport.offsetTop + win.visualViewport.height;
            expect(Math.abs(rect.bottom - viewportBottom)).to.be.lessThan(1);
            expect(rect.left).to.be.closeTo(0, 1);
            expect(rect.width).to.be.closeTo(win.visualViewport.width, 1);

            const buttons = [...strip.querySelectorAll("button")];
            for (const b of buttons) {
                const r = b.getBoundingClientRect();
                expect(r.height, "key height").to.be.closeTo(42, 0.5);
                expect(r.width, "key width").to.be.within(32, 44);
            }

            // The step-out key is pinned in view at the right end.
            const stepOut = buttons[buttons.length - 1];
            const stepOutRect = stepOut.getBoundingClientRect();
            expect(stepOutRect.right).to.be.lessThan(rect.right);
            expect(stepOutRect.left).to.be.greaterThan(rect.right - 60);

            // The row scrolls, and the last key in view is cut, not whole.
            const scroller = strip.querySelector(".mks-scroller");
            expect(scroller.scrollWidth).to.be.greaterThan(
                scroller.clientWidth,
            );
            const edge = scroller.getBoundingClientRect().right;
            const cut = buttons.slice(0, -1).find((b) => {
                const r = b.getBoundingClientRect();
                return r.left < edge && r.right > edge;
            });
            expect(cut, "a key cut by the edge of the row").to.exist;
            const r = cut.getBoundingClientRect();
            const shown = (edge - r.left) / r.width;
            expect(shown).to.be.within(0.2, 0.8);

            // The input and its check button are above the strip.
            const row = win.document
                .querySelector("#mi4 .mathInputWrapper")
                .parentElement.getBoundingClientRect();
            expect(row.bottom).to.be.at.most(rect.top);
        });
    });

    it("hides when focus leaves the math input, and is absent without a touch screen", () => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        load();

        cy.get("#mi1 textarea").focus();
        cy.get(STRIP).should("be.visible");
        cy.get("#ti_input").focus();
        cy.get(STRIP).should("not.be.visible");
        cy.get("#mi2 textarea").focus();
        cy.get(STRIP).should("be.visible");

        emulateTouchDevice(false);
        cy.window().should((win) => {
            expect(win.matchMedia("(pointer: coarse)").matches).to.equal(false);
        });
        cy.get("#mi3 textarea").focus();
        cy.get(STRIP).should("not.be.visible");
    });

    it("is not shown unless turned on", () => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        load({ mathKeyStrip: false });
        cy.get("#mi1 textarea").focus();
        cy.get(STRIP).should("not.exist");
    });

    it("waits for the reader to close the Doenet keyboard when there is one", () => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        load({ addVirtualKeyboard: true });

        cy.get("#mi1 textarea").should("have.prop", "inputMode", "none");
        cy.get("#mi1 textarea").focus();
        cy.get("#virtual-keyboard-tray").should("have.class", "open");
        cy.get(STRIP).should("not.be.visible");

        // Closing the tray is asking for the device's keyboard back.
        cy.get(".close-keyboard-button").click();
        cy.get("#mi1 textarea").focus();
        cy.get(STRIP).should("be.visible");
        typeInto("mi1", "x");
        press("union", "mi1");
        typeInto("mi1", "y{enter}");
        cy.get("#c1").should("have.text", "1");
    });

    it("follows the dark theme", () => {
        cy.viewport(390, 700);
        emulateTouchDevice(true);
        load({ darkMode: "dark" });
        cy.get("#mi1 textarea").focus();
        cy.get(STRIP)
            .should("be.visible")
            .and("have.attr", "data-theme", "dark");
    });
});
