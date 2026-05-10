import React, { useRef, useState } from "react";
import {
    DoenetEditor,
    type DiagnosticsTabId,
    type DoenetEditorHandle,
} from "../../../src/doenetml-inline-worker";

const SAMPLE_DOENETML = "<p>hello</p>";

function Harness() {
    const editorRef = useRef<DoenetEditorHandle>(null);
    return (
        <div style={{ height: "500px", width: "900px" }}>
            <button
                data-test="open-accessibility"
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("accessibility")
                }
            >
                Open accessibility
            </button>
            <button
                data-test="open-warnings"
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("warnings")
                }
            >
                Open warnings
            </button>
            <button
                data-test="close"
                onClick={() => editorRef.current?.closeDiagnosticsPanel()}
            >
                Close
            </button>
            <DoenetEditor
                ref={editorRef}
                doenetML={SAMPLE_DOENETML}
                addVirtualKeyboard={false}
            />
        </div>
    );
}

describe("DoenetEditor imperative ref handle", () => {
    it("opens a tab via openDiagnosticsTab", () => {
        cy.mount(<Harness />);

        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );

        cy.get('[data-test="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("closes the panel via closeDiagnosticsPanel", () => {
        cy.mount(<Harness />);

        cy.get('[data-test="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );

        cy.get('[data-test="close"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );
    });

    it("re-opens after the user closes the panel", () => {
        cy.mount(<Harness />);

        // open via ref
        cy.get('[data-test="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );

        // user clicks the panel's internal close button
        cy.get('[data-test="diagnostics-panel-close"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "not.have.class",
            "is-open",
        );

        // ref handle reopens the same tab
        cy.get('[data-test="open-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });

    it("switches between tabs", () => {
        cy.mount(<Harness />);

        cy.get('[data-test="open-accessibility"]').click();
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );

        cy.get('[data-test="open-warnings"]').click();
        cy.get('[id="warnings"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
    });
});

// Mirrors the README "lazy-mount / link in a different panel" pattern:
// before the editor is mounted, set `initialOpenTab` to the requested tab;
// once mounted, subsequent clicks drive the panel via the ref handle.
function LazyMountHarness() {
    const [showEditor, setShowEditor] = useState(false);
    const [pendingTab, setPendingTab] = useState<DiagnosticsTabId | undefined>(
        undefined,
    );
    const editorRef = useRef<DoenetEditorHandle>(null);

    function onLinkClick(tab: DiagnosticsTabId) {
        if (showEditor && editorRef.current) {
            editorRef.current.openDiagnosticsTab(tab);
        } else {
            setShowEditor(true);
            setPendingTab(tab);
        }
    }

    return (
        <div style={{ height: "500px", width: "900px" }}>
            <button
                data-test="link-accessibility"
                onClick={() => onLinkClick("accessibility")}
            >
                Open accessibility
            </button>
            <button
                data-test="link-warnings"
                onClick={() => onLinkClick("warnings")}
            >
                Open warnings
            </button>
            {showEditor && (
                <DoenetEditor
                    ref={editorRef}
                    doenetML={SAMPLE_DOENETML}
                    initialOpenTab={pendingTab}
                    addVirtualKeyboard={false}
                />
            )}
        </div>
    );
}

describe("DoenetEditor lazy-mount with initialOpenTab + ref handle", () => {
    it("first click mounts the editor with the requested tab open; subsequent clicks switch tabs via ref", () => {
        cy.mount(<LazyMountHarness />);

        // Editor is not mounted yet.
        cy.get(".diagnostics-response-tabs-container").should("not.exist");

        // First click: mount with `initialOpenTab` set to "accessibility".
        cy.get('[data-test="link-accessibility"]').click();
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
        cy.get('[id="accessibility"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );

        // Second click on a different link: editor is already mounted, so
        // this must take the ref-handle branch and switch tabs in place.
        cy.get('[data-test="link-warnings"]').click();
        cy.get('[id="warnings"][role="tab"]').should(
            "have.attr",
            "aria-selected",
            "true",
        );
        cy.get(".diagnostics-response-tabs-container").should(
            "have.class",
            "is-open",
        );
    });
});
