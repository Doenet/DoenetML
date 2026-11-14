/**
 * Typing into a math input with an Android on-screen keyboard.
 *
 * Chrome on Android, with an on-screen keyboard such as Gboard, reports every
 * key as a keydown whose `key` is "Unidentified" (keyCode 229), followed by an
 * `input` event of type `insertText` that names the character. MathQuill's
 * guard for the Ctrl-Shift-U Unicode sequence ignored every "Unidentified"
 * keydown, so on an Android phone nothing typed on the device's keyboard
 * reached a math input. Recorded on an Android 15 emulator with Gboard over
 * Chrome remote debugging:
 *
 *   x:          keydown Unidentified/229, input insertText "x"
 *               (textarea now "x"), keyup Unidentified/229
 *   backspace:  keydown Unidentified/229, keyup Unidentified/229
 *               (no input event: the textarea is empty)
 *   Enter:      keydown Unidentified/229, keyup Unidentified/229 (Chrome's
 *               own empty commit), then 1 to 10 ms later keydown Enter/13,
 *               keypress, input insertLineBreak, keyup Enter/13
 *
 * These tests replay those sequences on the math input's textarea. Each
 * sequence is sent in one synchronous block, as Chrome sends it.
 */

const K229 = {
    key: "Unidentified",
    keyCode: 229,
    which: 229,
    bubbles: true,
    cancelable: true,
};

function down(ta, init = K229) {
    const win = ta.ownerDocument.defaultView;
    ta.dispatchEvent(new win.KeyboardEvent("keydown", init));
}

function up(ta, init = K229) {
    const win = ta.ownerDocument.defaultView;
    ta.dispatchEvent(new win.KeyboardEvent("keyup", init));
}

function input(ta, data, { inputType = "insertText", isComposing } = {}) {
    const win = ta.ownerDocument.defaultView;
    ta.dispatchEvent(
        new win.InputEvent("input", {
            inputType,
            data,
            isComposing: isComposing ?? inputType === "insertCompositionText",
            bubbles: true,
        }),
    );
}

/**
 * One key of an Android on-screen keyboard, as Chrome reports it. The text
 * replaces the textarea's selection, as Chrome's edit does.
 */
function androidKey(ta, inserted, { keydownInit = K229, ...inputInit } = {}) {
    down(ta, keydownInit);
    ta.setRangeText(inserted, ta.selectionStart, ta.selectionEnd, "end");
    input(ta, inserted, inputInit);
    up(ta, keydownInit);
}

/** The keyboard's backspace on an empty textarea: a bare 229 pair. */
function androidBackspace(ta, init = K229) {
    down(ta, init);
    up(ta, init);
}

/** The keyboard's Enter: Chrome's empty commit, then the Enter key. */
function androidEnter(ta) {
    androidBackspace(ta);
    const enter = {
        key: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
    };
    down(ta, enter);
    const win = ta.ownerDocument.defaultView;
    ta.dispatchEvent(new win.KeyboardEvent("keypress", enter));
    // The newline Chrome inserts is what MathQuill reads as Enter.
    ta.setRangeText("\n", ta.selectionStart, ta.selectionEnd, "end");
    input(ta, null, { inputType: "insertLineBreak" });
    up(ta, enter);
}

function typeAll(ta, chars) {
    for (const ch of chars) {
        androidKey(ta, ch);
    }
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
                typeAll($ta[0], ["x", "^", "2"]);
            });
            // `^` moved into the exponent; leave it as a reader would.
            cy.get("#mi textarea").type("{rightarrow}", { force: true });
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["+", "1"]);
            });
            fieldText("mi").should("equal", "x2+1");
            cy.get("#mi textarea").type("{enter}", { force: true });
            cy.get("#c").should("have.text", "1");
        });

        it("keeps the last character when the keyboard's Enter submits", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["x", "^", "2"]);
            });
            cy.get("#mi textarea").type("{rightarrow}", { force: true });
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["+", "1"]);
            });
            fieldText("mi").should("equal", "x2+1");
            cy.get("#mi textarea").then(($ta) => {
                androidEnter($ta[0]);
            });
            // Past the time a held-back backspace waits.
            cy.wait(300);
            fieldText("mi").should("equal", "x2+1");
            cy.get("#c").should("have.text", "1");
        });

        it("deletes with the keyboard's backspace", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["x", "y", "z"]);
            });
            fieldText("mi").should("equal", "xyz");
            cy.get("#mi textarea").then(($ta) => {
                androidBackspace($ta[0]);
            });
            // The backspace is held back briefly in case Enter follows. (The
            // wait lets the page's timer run: while Cypress retries an
            // assertion, it did not.)
            cy.wait(300);
            fieldText("mi").should("equal", "xy");
            // A backspace and then a key at once: the deletion comes first.
            cy.get("#mi textarea").then(($ta) => {
                androidBackspace($ta[0]);
                androidKey($ta[0], "w");
            });
            fieldText("mi").should("equal", "xw");
        });

        it("deletes once for each repeat of a held backspace", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["a", "b", "c", "d"]);
            });
            fieldText("mi").should("equal", "abcd");
            cy.get("#mi textarea").then(($ta) => {
                for (let i = 0; i < 3; i++) {
                    androidBackspace($ta[0]);
                }
            });
            cy.wait(300);
            fieldText("mi").should("equal", "a");
        });

        it("types a key over a selection", () => {
            cy.get("#mi textarea").type("abc", { force: true });
            fieldText("mi").should("equal", "abc");
            cy.get("#mi textarea").type("{ctrl}a", { force: true });
            cy.get("#mi textarea").then(($ta) => {
                expect($ta[0].value.length).to.be.greaterThan(0);
                androidKey($ta[0], "x");
            });
            fieldText("mi").should("equal", "x");
        });

        it("does not delete for a desktop key the browser cannot name", () => {
            // A physical key with no key name is also "Unidentified", but its
            // keyCode is not 229. It types nothing and must delete nothing.
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                typeAll($ta[0], ["x", "y"]);
                androidBackspace($ta[0], {
                    key: "Unidentified",
                    bubbles: true,
                });
                // A 229 keydown whose keyup is another key is not a backspace.
                down($ta[0], { ...K229, shiftKey: true });
                up($ta[0], {
                    key: "Shift",
                    keyCode: 16,
                    which: 16,
                    bubbles: true,
                });
            });
            cy.wait(200);
            fieldText("mi").should("equal", "xy");
        });

        it("takes nothing from a key with a modifier, a keypress or text left in the textarea", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                const ta = $ta[0];
                typeAll(ta, ["x", "y"]);
                for (const modifier of ["ctrlKey", "altKey", "metaKey"]) {
                    const withModifier = { ...K229, [modifier]: true };
                    // Neither a backspace...
                    androidBackspace(ta, withModifier);
                    // ...nor a character.
                    androidKey(ta, "u", { keydownInit: withModifier });
                    ta.value = "";
                }
                // A key that sends keypress is not the bare pair.
                down(ta);
                ta.dispatchEvent(
                    new ta.ownerDocument.defaultView.KeyboardEvent(
                        "keypress",
                        K229,
                    ),
                );
                up(ta);
                // Text left in the textarea (from a composition, say): the
                // next key's character is not all that is there, so nothing
                // is typed, and a bare pair is not a backspace.
                ta.value = "ab";
                androidKey(ta, "z");
                ta.value = "a";
                androidBackspace(ta);
                ta.value = "";
            });
            cy.wait(200);
            fieldText("mi").should("equal", "xy");
        });

        it("still ignores text the keyboard is composing", () => {
            cy.get("#mi textarea").focus();
            cy.get("#mi textarea").then(($ta) => {
                androidKey($ta[0], "x", { inputType: "insertCompositionText" });
                $ta[0].value = "";
                androidKey($ta[0], "y", { isComposing: true });
            });
            // Nothing reaches the field from a composition, as before.
            cy.wait(200);
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
