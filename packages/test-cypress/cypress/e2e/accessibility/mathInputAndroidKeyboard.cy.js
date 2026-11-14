/**
 * Typing into a math input with an Android on-screen keyboard.
 *
 * Chrome on Android, with Gboard and other on-screen keyboards, reports every
 * key as a keydown whose `key` is "Unidentified" (keyCode 229), followed by an
 * `input` event of type `insertText` that names the character. MathQuill's
 * guard for the Ctrl-Shift-U Unicode sequence ignored every "Unidentified"
 * keydown, so on an Android phone nothing typed on the device's keyboard
 * reached a math input. Recorded on an Android 15 emulator with Gboard over
 * Chrome remote debugging:
 *
 *   keydown  key=Unidentified keyCode=229
 *   beforeinput inputType=insertText data="x"
 *   input       inputType=insertText data="x"   (textarea now "x")
 *   keyup    key=Unidentified keyCode=229
 *
 * These tests replay that sequence on the math input's textarea.
 */

/** One key of an Android on-screen keyboard, as Chrome reports it. */
function androidKey(textarea, inserted, { inputType = "insertText" } = {}) {
    const win = textarea.ownerDocument.defaultView;
    const unidentified = {
        key: "Unidentified",
        keyCode: 229,
        which: 229,
        bubbles: true,
        cancelable: true,
    };
    textarea.dispatchEvent(new win.KeyboardEvent("keydown", unidentified));
    textarea.value += inserted;
    textarea.dispatchEvent(
        new win.InputEvent("input", {
            inputType,
            data: inserted,
            isComposing: inputType === "insertCompositionText",
            bubbles: true,
        }),
    );
    textarea.dispatchEvent(new win.KeyboardEvent("keyup", unidentified));
}

function fieldText(name) {
    return cy
        .get(`#${name} .mq-root-block`)
        .invoke("text")
        .then((text) => text.replace(/​/g, ""));
}

describe(
    "Math input with an Android on-screen keyboard",
    { tags: ["@group5"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
            cy.get("#testRunner_toggleControls").should("exist");
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `<p><answer name="a"><mathInput name="mi" /><award><math>x^2+1</math></award></answer></p>
<p>Credit: <number extend="$a.creditAchieved" name="c" /></p>`,
                    },
                    "*",
                );
            });
            cy.get("#mi textarea").should("exist");
            cy.get("#c").should("have.text", "0");
        });

        it("types what the keyboard inserts: letters, digits and symbols", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                for (const ch of ["x", "^", "2"]) {
                    androidKey($ta[0], ch);
                }
            });
            // `^` moved into the exponent; leave it as a reader would.
            cy.get("#mi textarea").type("{rightarrow}", { force: true });
            cy.get("#mi textarea").then(($ta) => {
                for (const ch of ["+", "1"]) {
                    androidKey($ta[0], ch);
                }
            });
            fieldText("mi").should("equal", "x2+1");
            cy.get("#mi textarea").type("{enter}", { force: true });
            cy.get("#c").should("have.text", "1");
        });

        it("deletes with the keyboard's backspace", () => {
            // With nothing in the textarea to delete, Chrome reports the
            // backspace as a keydown and keyup of "Unidentified" and nothing
            // else (recorded with Gboard).
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                for (const ch of ["x", "y", "z"]) {
                    androidKey($ta[0], ch);
                }
            });
            fieldText("mi").should("equal", "xyz");
            cy.get("#mi textarea").then(($ta) => {
                const ta = $ta[0];
                const win = ta.ownerDocument.defaultView;
                const unidentified = {
                    key: "Unidentified",
                    keyCode: 229,
                    which: 229,
                    bubbles: true,
                };
                ta.dispatchEvent(
                    new win.KeyboardEvent("keydown", unidentified),
                );
                ta.dispatchEvent(new win.KeyboardEvent("keyup", unidentified));
            });
            fieldText("mi").should("equal", "xy");
        });

        it("does not delete for a desktop key the browser cannot name", () => {
            // A physical key with no key name is also "Unidentified", but its
            // keyCode is not 229. It types nothing and must delete nothing.
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                for (const ch of ["x", "y"]) {
                    androidKey($ta[0], ch);
                }
            });
            fieldText("mi").should("equal", "xy");
            cy.get("#mi textarea").then(($ta) => {
                const ta = $ta[0];
                const win = ta.ownerDocument.defaultView;
                const unnamed = { key: "Unidentified", bubbles: true };
                ta.dispatchEvent(new win.KeyboardEvent("keydown", unnamed));
                ta.dispatchEvent(new win.KeyboardEvent("keyup", unnamed));
            });
            cy.wait(100);
            fieldText("mi").should("equal", "xy");
        });

        it("still ignores text the keyboard is composing", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                androidKey($ta[0], "x", { inputType: "insertCompositionText" });
            });
            // Nothing reaches the field from a composition, as before.
            cy.wait(100);
            fieldText("mi").should("equal", "");
        });

        it("types ordinary key events as before", () => {
            cy.get("#mi textarea").type("x^2{rightarrow}+1{enter}", {
                force: true,
            });
            fieldText("mi").should("equal", "x2+1");
            cy.get("#c").should("have.text", "1");
        });
    },
);
