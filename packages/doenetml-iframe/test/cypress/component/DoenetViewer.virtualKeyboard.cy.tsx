import React from "react";
import {
    ExternalVirtualKeyboard,
    VirtualKeyboard,
} from "../../../../virtual-keyboard/src/virtual-keyboard";

function Harness() {
    const firstRef = React.useRef<HTMLIFrameElement>(null);
    const secondRef = React.useRef<HTMLIFrameElement>(null);

    return (
        <div style={{ display: "grid", gap: "16px" }}>
            <ExternalVirtualKeyboard ownerRef={firstRef} theme="dark" />
            <ExternalVirtualKeyboard ownerRef={secondRef} theme="light" />
            <iframe ref={firstRef} srcDoc="<p>first iframe</p>" title="first" />
            <iframe
                ref={secondRef}
                srcDoc="<p>second iframe</p>"
                title="second"
            />
            <button type="button">outside</button>
        </div>
    );
}

/**
 * Command types that are not key presses: bookkeeping the tray sends alongside
 * (or instead of) typed characters. See `KeyCommand`.
 */
const NON_KEY_PRESS_TYPES = ["accessed", "keyboardChoice"];

/** Makes the page look like a phone to `(pointer: coarse)`. */
function stubCoarsePointer() {
    cy.window().then((win) => {
        const realMatchMedia = win.matchMedia.bind(win);
        cy.stub(win, "matchMedia").callsFake((query: string) =>
            query === "(pointer: coarse)"
                ? {
                      matches: true,
                      addEventListener() {},
                      removeEventListener() {},
                  }
                : realMatchMedia(query),
        );
    });
}

describe("ExternalVirtualKeyboard — iframe routing", () => {
    beforeEach(() => {
        // The tray is torn down asynchronously once the last keyboard on the
        // page unmounts, which can land in the middle of MathJax typesetting
        // the keys and reject its promise. That happens as one test ends and
        // so is reported against the next one, which is nothing to do with
        // what that test is checking. Only this one rejection is tolerated.
        cy.on(
            "uncaught:exception",
            (error) => !/Typesetting failed/.test(error.message),
        );
    });

    function expectWriteCallCount(alias: string, count: number) {
        cy.get(alias).should((spy) => {
            const writeCalls = spy
                .getCalls()
                .filter((call) =>
                    call.args[0].keyCommands.some(
                        (command: { type: string }) =>
                            !NON_KEY_PRESS_TYPES.includes(command.type),
                    ),
                );
            expect(writeCalls).to.have.length(count);
        });
    }

    function expectKeyboardChoices(alias: string, choices: string[]) {
        cy.get(alias).should((spy) => {
            const reported = spy
                .getCalls()
                .flatMap((call) => call.args[0].keyCommands)
                .filter(
                    (command: { type: string }) =>
                        command.type === "keyboardChoice",
                )
                .map((command: { command: string }) => command.command);
            expect(reported).to.deep.equal(choices);
        });
    }

    it("posts keyboard events only to the focused iframe", () => {
        cy.mount(<Harness />);

        cy.get("iframe").should("have.length", 2);

        cy.get("iframe")
            .eq(0)
            .then(($iframe) => {
                cy.spy(
                    ($iframe[0] as HTMLIFrameElement).contentWindow!,
                    "postMessage",
                ).as("firstPostMessage");
            });
        cy.get("iframe")
            .eq(1)
            .then(($iframe) => {
                cy.spy(
                    ($iframe[0] as HTMLIFrameElement).contentWindow!,
                    "postMessage",
                ).as("secondPostMessage");
            });

        cy.get("iframe").eq(0).focus();
        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("exist");
        cy.get("#virtual-keyboard-tray .key-x").focus();
        cy.focused().should("have.class", "key-x");
        cy.get("#virtual-keyboard-tray .key-y").click({ force: true });

        expectWriteCallCount("@firstPostMessage", 1);
        expectWriteCallCount("@secondPostMessage", 0);

        cy.get("iframe").eq(1).focus();
        cy.get("#virtual-keyboard-tray .key-x").focus();
        cy.focused().should("have.class", "key-x");
        cy.get("#virtual-keyboard-tray .key-y").click({ force: true });

        expectWriteCallCount("@firstPostMessage", 1);
        expectWriteCallCount("@secondPostMessage", 1);
    });

    it("reports the reader's keyboard choice to every owner, not just the focused one", () => {
        cy.mount(<Harness />);

        cy.get("iframe")
            .eq(0)
            .then(($iframe) => {
                cy.spy(
                    ($iframe[0] as HTMLIFrameElement).contentWindow!,
                    "postMessage",
                ).as("firstPostMessage");
            });
        cy.get("iframe")
            .eq(1)
            .then(($iframe) => {
                cy.spy(
                    ($iframe[0] as HTMLIFrameElement).contentWindow!,
                    "postMessage",
                ).as("secondPostMessage");
            });

        // Nothing is focused: opening the tray is how a reader on a phone
        // reaches for the Doenet keyboard before touching an input, and both
        // viewers have to learn of it so they keep the system keyboard down.
        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("exist");
        cy.get(".close-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("not.exist");

        expectKeyboardChoices("@firstPostMessage", ["virtual", "system"]);
        expectKeyboardChoices("@secondPostMessage", ["virtual", "system"]);
    });

    it("declines focus when a key is pressed", () => {
        cy.mount(<Harness />);

        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("exist");

        // Cancelling the default action of the press is what keeps focus in
        // the input the reader is typing into. Without it the input blurs on
        // every key and has to be refocused, which on Android re-summons the
        // system keyboard on top of this tray (issue #1692).
        //
        // Asserted on the events themselves rather than by watching focus:
        // events dispatched from a test are untrusted and never move focus, so
        // a focus assertion would pass whether or not the tray declined it.
        cy.get("#virtual-keyboard-tray .key-y").then(($key) => {
            for (const press of [
                new PointerEvent("pointerdown", {
                    bubbles: true,
                    cancelable: true,
                }),
                new MouseEvent("mousedown", {
                    bubbles: true,
                    cancelable: true,
                }),
            ]) {
                $key[0].dispatchEvent(press);
                expect(
                    press.defaultPrevented,
                    `${press.type} default prevented`,
                ).to.equal(true);
            }
        });
    });

    /**
     * Reports focus the way the viewer inside the iframe does, since the tray
     * in this window cannot see which element inside an iframe has focus.
     */
    function postFocusFromIframe(index: number, mathInputFocused: boolean) {
        cy.get("iframe")
            .eq(index)
            .then(($iframe) => {
                const iframeWindow = ($iframe[0] as HTMLIFrameElement)
                    .contentWindow!;
                // The message has to be posted by a script belonging to the
                // iframe, not merely aimed at its parent from out here: the
                // keyboard identifies its own iframe by `event.source`, and
                // that is the realm of whoever called `postMessage`.
                const postFromIframe = new (iframeWindow as any).Function(
                    "mathInputFocused",
                    'parent.postMessage({subject: "keyboard-focus", mathInputFocused}, "*")',
                );
                postFromIframe(mathInputFocused);
            });
    }

    it("follows math input focus on a touch device", () => {
        cy.mount(<Harness />);
        stubCoarsePointer();

        cy.get("#virtual-keyboard-tray.open").should("not.exist");

        postFocusFromIframe(0, true);
        cy.get("#virtual-keyboard-tray.open").should("exist");

        // Focus moving to something that is not a math input — a text input,
        // say — gets the tray out of the way of the device's own keyboard.
        postFocusFromIframe(0, false);
        cy.get("#virtual-keyboard-tray.open").should("not.exist");
    });

    it("stays shut at the next math input once the reader closes it", () => {
        cy.mount(<Harness />);
        stubCoarsePointer();

        postFocusFromIframe(0, true);
        cy.get("#virtual-keyboard-tray.open").should("exist");

        cy.get(".close-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("not.exist");

        // The reader asked for the tray to go away; moving between math inputs
        // must not overrule them.
        postFocusFromIframe(0, false);
        postFocusFromIframe(1, true);
        cy.get("#virtual-keyboard-tray.open").should("not.exist");

        // Until they ask for it back.
        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("exist");
    });

    it("leaves the tray under manual control on a desktop", () => {
        cy.mount(<Harness />);

        postFocusFromIframe(0, true);
        // Give the message a chance to be delivered before asserting absence.
        cy.get("iframe").eq(0).should("exist");
        cy.get("#virtual-keyboard-tray.open").should("not.exist");
    });

    it("keeps the last active owner's theme when focus leaves all owners", () => {
        cy.mount(<Harness />);

        cy.get("iframe").eq(0).focus();
        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray")
            .should("have.class", "open")
            .and("have.attr", "data-theme", "dark")
            .and("have.css", "background-color", "rgb(30, 30, 30)");

        cy.contains("button", "outside").focus();
        cy.focused().should("contain.text", "outside");
        cy.get("#virtual-keyboard-tray").should(
            "have.attr",
            "data-theme",
            "dark",
        );
    });
});

/**
 * The keyboard as it runs when the viewer and the tray share a window — the
 * plain (non-iframe) embedding, where the keyboard watches focus itself
 * instead of being told about it.
 */
function SameWindowHarness() {
    // Stands in for `mathInput`'s record of the focused math input: the
    // element of whichever math input has focus, and null when none does.
    const focusedMathInput = React.useRef<HTMLElement | null>(null);
    const mathInputRef = React.useRef<HTMLDivElement>(null);

    return (
        <div>
            <VirtualKeyboard ownerRef={focusedMathInput} theme="light" />
            <div
                ref={mathInputRef}
                tabIndex={0}
                data-testid="math-input"
                onFocus={() => {
                    focusedMathInput.current = mathInputRef.current;
                }}
                onBlur={() => {
                    focusedMathInput.current = null;
                }}
            >
                math input
            </div>
            <input type="text" data-testid="text-input" />
        </div>
    );
}

describe("VirtualKeyboard — same-window focus tracking", () => {
    beforeEach(() => {
        cy.on(
            "uncaught:exception",
            (error) => !/Typesetting failed/.test(error.message),
        );
    });

    it("follows math input focus on a touch device", () => {
        cy.mount(<SameWindowHarness />);
        stubCoarsePointer();

        cy.get("#virtual-keyboard-tray.open").should("not.exist");

        cy.get("[data-testid=math-input]").focus();
        cy.get("#virtual-keyboard-tray.open").should("exist");

        // A text input wants the device's own keyboard, and all of the screen
        // the tray is sitting on.
        cy.get("[data-testid=text-input]").focus();
        cy.get("#virtual-keyboard-tray.open").should("not.exist");
    });

    it("leaves the tray under manual control on a desktop", () => {
        cy.mount(<SameWindowHarness />);

        cy.get("[data-testid=math-input]").focus();
        cy.focused().should("have.attr", "data-testid", "math-input");
        cy.get("#virtual-keyboard-tray.open").should("not.exist");
    });
});
