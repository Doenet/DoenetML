import React from "react";
import { VirtualKeyboard } from "../../../../virtual-keyboard/dist/index.js";

function KeyboardHarness({
    label,
    theme,
}: {
    label: string;
    theme?: "dark" | "light";
}) {
    const [commandCount, setCommandCount] = React.useState(0);
    const [lastCommand, setLastCommand] = React.useState("");

    return (
        <div data-test={label}>
            <div data-test={`${label}-count`}>{commandCount}</div>
            <div data-test={`${label}-last`}>{lastCommand}</div>
            <VirtualKeyboard
                theme={theme}
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

function Harness({ theme }: { theme?: "dark" | "light" }) {
    return (
        <div>
            <KeyboardHarness label="first" theme={theme} />
            <KeyboardHarness label="second" theme={theme} />
        </div>
    );
}

describe("VirtualKeyboard without ownerRef", () => {
    it("still routes key presses and theme to ownerless registrations", () => {
        cy.mount(<Harness theme="dark" />);

        cy.get(".open-keyboard-button").click({ force: true });
        cy.get("#virtual-keyboard-tray.open").should(
            "have.attr",
            "data-theme",
            "dark",
        );
        cy.get("#virtual-keyboard-tray .key-x").click({ force: true });

        cy.get('[data-test="first-count"]').should("have.text", "1");
        cy.get('[data-test="second-count"]').should("have.text", "1");
        cy.get('[data-test="first-last"]').should("contain", "x");
        cy.get('[data-test="second-last"]').should("contain", "x");
    });
});
