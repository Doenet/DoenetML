import React from "react";
import { CodeMirror } from "../../../src/CodeMirror";
import { getAutoCloseTag } from "../../../src/extensions/auto-close-tag";

/**
 * Tests for the auto-close-tag extension
 *
 * These tests verify that the CodeMirror editor automatically inserts
 * closing tags when typing `>` to close an opening tag, while properly
 * handling edge cases like less-than as a text operator and case-sensitive
 * tag matching.
 */
describe("CodeMirror Auto-Close Tag Extension", () => {
    describe("basic auto-closing behavior", () => {
        it("inserts closing tag for simple opening tag", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<matrix" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "<matrix></matrix>");
        });

        it("inserts closing tag for tag with attributes", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value='<title hide="true"' />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should(
                "have.text",
                '<title hide="true"></title>',
            );
        });

        it("inserts closing tag for tag with attribute without value", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<title hide" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "<title hide></title>");
        });

        it("does not insert when closing tag already exists", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<matrix</matrix>" />
                </div>,
            );

            cy.get(".cm-content")
                .click()
                .type(
                    "{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}>",
                    {
                        force: true,
                    },
                );
            cy.get(".cm-line").should("have.text", "<matrix></matrix>");
        });

        it("does not insert when closing tag already exists, with text and tags inside", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<matrix text <otherTag>hi</otherTag> <selfTag/> </matrix>" />
                </div>,
            );

            cy.get(".cm-content")
                .click()
                .type(
                    "{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}>",
                    {
                        force: true,
                    },
                );
            cy.get(".cm-line").should(
                "have.text",
                "<matrix> text <otherTag>hi</otherTag> <selfTag/> </matrix>",
            );
        });

        it("does insert with mismatched closing tag", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<matrix</text>" />
                </div>,
            );

            cy.get(".cm-content")
                .click()
                .type(
                    "{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}{rightArrow}>",
                    {
                        force: true,
                    },
                );
            cy.get(".cm-line").should("have.text", "<matrix></matrix></text>");
        });

        it("does insert when have a closing tag that is already matched", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<tag text <tag>hi</tag>" />
                </div>,
            );

            cy.get(".cm-content")
                .click()
                .type(
                    "{home}{rightArrow}{rightArrow}{rightArrow}{rightArrow}>",
                    {
                        force: true,
                    },
                );
            cy.get(".cm-line").should(
                "have.text",
                "<tag></tag> text <tag>hi</tag>",
            );
        });

        it("handles nested tags correctly", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<outer><inner" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "<outer><inner></inner>");
        });

        it("does not insert for self-closing tag intent", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<title/" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "<title/>");
        });

        it("handles nested same-name tags", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<tag><tag" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "<tag><tag></tag>");
        });

        it("preserves exact case", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="<MyComponent" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should(
                "have.text",
                "<MyComponent></MyComponent>",
            );
        });
    });

    describe("less-than as text operator", () => {
        it("does not insert closing tag for less-than in text context", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="x < y " />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "x < y >");
        });

        it("does not treat less-than followed by space as tag opening", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="< tag" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "< tag>");
        });

        it("does not insert for less-than without valid tag name", () => {
            cy.mount(
                <div style={{ height: "400px", width: "600px" }}>
                    <CodeMirror value="x < 5" />
                </div>,
            );

            cy.get(".cm-content").click().type("{end}>", { force: true });
            cy.get(".cm-line").should("have.text", "x < 5>");
        });

        it("handles comparison operators in expressions", () => {
            const text = "<p>value < 10";
            const result = getAutoCloseTag(text, text.length);
            expect(result).to.be.null; // Should not insert closing tag - we're in text content
        });
    });
});
