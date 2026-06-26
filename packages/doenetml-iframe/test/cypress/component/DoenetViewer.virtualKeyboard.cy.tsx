import React from "react";
import { ExternalVirtualKeyboard } from "../../../../virtual-keyboard/dist/index.js";

function Harness() {
    const firstRef = React.useRef<HTMLIFrameElement>(null);
    const secondRef = React.useRef<HTMLIFrameElement>(null);

    return (
        <div style={{ display: "grid", gap: "16px" }}>
            <ExternalVirtualKeyboard ownerRef={firstRef} />
            <ExternalVirtualKeyboard ownerRef={secondRef} />
            <iframe ref={firstRef} srcDoc="<p>first iframe</p>" title="first" />
            <iframe
                ref={secondRef}
                srcDoc="<p>second iframe</p>"
                title="second"
            />
        </div>
    );
}

describe("ExternalVirtualKeyboard — iframe routing", () => {
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
        cy.get("#virtual-keyboard-tray .key-x").click();

        cy.get("@firstPostMessage").should("have.been.called");
        cy.get("@secondPostMessage").should("not.have.been.called");

        cy.get("iframe").eq(1).focus();
        cy.get("#virtual-keyboard-tray .key-y").click();

        cy.get("@firstPostMessage").should("have.callCount", 1);
        cy.get("@secondPostMessage").should("have.callCount", 1);
    });
});
