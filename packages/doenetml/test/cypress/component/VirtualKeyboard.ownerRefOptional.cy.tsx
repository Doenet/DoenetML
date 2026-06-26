import React from "react";
import { VirtualKeyboard } from "../../../../virtual-keyboard/dist/index.js";

function KeyboardHarness({ label }: { label: string }) {
    const [commandCount, setCommandCount] = React.useState(0);
    const [lastCommand, setLastCommand] = React.useState("");

    return (
        <div data-test={label}>
            <div data-test={`${label}-count`}>{commandCount}</div>
            <div data-test={`${label}-last`}>{lastCommand}</div>
            <VirtualKeyboard
                onClick={(events) => {
                    const keyPress = events.find(
                        (event) => event.type !== "accessed",
                    );
                    if (!keyPress) {
                        return;
                    }
                    setCommandCount((count) => count + 1);
                    setLastCommand(`${keyPress.type}:${keyPress.command}`);
                }}
            />
        </div>
    );
}

function Harness() {
    return (
        <div>
            <KeyboardHarness label="first" />
            <KeyboardHarness label="second" />
        </div>
    );
}

describe("VirtualKeyboard without ownerRef", () => {
    it("still routes key presses to ownerless registrations", () => {
        cy.mount(<Harness />);

        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should("exist");
        cy.get("#virtual-keyboard-tray .key-x").click();

        cy.get('[data-test="first-count"]').should("have.text", "1");
        cy.get('[data-test="second-count"]').should("have.text", "1");
        cy.get('[data-test="first-last"]').should("contain", "x");
        cy.get('[data-test="second-last"]').should("contain", "x");
    });
});
