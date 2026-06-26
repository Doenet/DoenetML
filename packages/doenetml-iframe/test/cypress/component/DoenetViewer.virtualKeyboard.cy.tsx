import React from "react";
import { ExternalVirtualKeyboard } from "../../../../virtual-keyboard/src/virtual-keyboard";

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

describe("ExternalVirtualKeyboard — iframe routing", () => {
    function expectWriteCallCount(alias: string, count: number) {
        cy.get(alias).should((spy) => {
            const writeCalls = spy
                .getCalls()
                .filter((call) =>
                    call.args[0].keyCommands.some(
                        (command: { type: string }) =>
                            command.type !== "accessed",
                    ),
                );
            expect(writeCalls).to.have.length(count);
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
