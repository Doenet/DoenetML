import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { describe, expect, it } from "vitest";
import { autoCloseTagExtension, getAutoCloseTag } from "./auto-close-tag";

/**
 * Helper to simulate typing `>` at a cursor position and return the resulting document text.
 */
function typeClosingBracket(source: string, cursorPos: number): string {
    const closeTag = getAutoCloseTag(source, cursorPos);
    if (closeTag) {
        return (
            source.slice(0, cursorPos) +
            ">" +
            closeTag +
            source.slice(cursorPos)
        );
    }
    return source.slice(0, cursorPos) + ">" + source.slice(cursorPos);
}

describe("auto-close-tag extension", () => {
    describe("basic auto-closing behavior", () => {
        it("debug: check getAutoCloseTag directly", () => {
            const result = getAutoCloseTag("<matrix", 7);
            console.log("getAutoCloseTag result:", result);
            expect(result).not.toBeNull();
        });

        it("inserts closing tag for simple opening tag", () => {
            const result = typeClosingBracket("<matrix", 7);
            expect(result).toBe("<matrix></matrix>");
        });

        it("inserts closing tag for tag with attributes", () => {
            const source = '<title hide="true"';
            const result = typeClosingBracket(source, source.length);
            expect(result).toBe('<title hide="true"></title>');
        });

        it("inserts closing tag for tag with attribute without value", () => {
            const source = "<title hide";
            const result = typeClosingBracket(source, source.length);
            expect(result).toBe("<title hide></title>");
        });

        it("does not insert when close tag already exists", () => {
            const source = "<matrix></matrix>";
            const result = typeClosingBracket(source, 7);
            expect(result).toBe("<matrix>></matrix>");
        });

        it("handles nested tags correctly", () => {
            const source = "<outer><inner";
            const result = typeClosingBracket(source, source.length);
            expect(result).toBe("<outer><inner></inner>");
        });

        it("does not insert for self-closing tag intent", () => {
            const source = "<title/";
            const result = typeClosingBracket(source, source.length);
            expect(result).toBe("<title/>");
        });

        it("handles nested same-name tags", () => {
            const source = "<tag><tag";
            const result = typeClosingBracket(source, source.length);
            expect(result).toBe("<tag><tag></tag>");
        });
    });

    describe("less-than as text operator", () => {
        it("does not insert closing tag for less-than in text context", () => {
            const source = "x < y ";
            const result = typeClosingBracket(source, source.length - 1);
            // Should just insert '>' without adding a closing tag
            expect(result).toBe("x < y >");
        });

        it("does not treat less-than followed by space as tag opening", () => {
            const source = "< tag";
            const result = typeClosingBracket(source, 5);
            expect(result).toBe("< tag>");
        });

        it("does not insert for less-than without valid tag name", () => {
            const source = "x < 5";
            const result = typeClosingBracket(source, 5);
            expect(result).toBe("x < 5>");
        });

        it("handles comparison operators in expressions", () => {
            const source = "<p>value < 10";
            const result = typeClosingBracket(source, 13);
            expect(result).toBe("<p>value < 10>");
        });
    });

    describe("case-sensitive tag matching", () => {
        it("preserves exact case for uppercase tag", () => {
            const source = "<TAG";
            const result = typeClosingBracket(source, 4);
            expect(result).toBe("<TAG></TAG>");
        });

        it("preserves exact case for mixed-case tag", () => {
            const source = "<MyComponent";
            const result = typeClosingBracket(source, 12);
            expect(result).toBe("<MyComponent></MyComponent>");
        });

        it("treats tags with different cases as different tags", () => {
            const source = "<tag></Tag>";
            // Typing '>' after '<tag' should insert '</tag>' because
            // the existing '</Tag>' doesn't match (different case)
            const result = typeClosingBracket(source, 4);
            expect(result).toBe("<tag></tag></Tag>");
        });

        it("matches closing tag only with exact case", () => {
            const source = "<Matrix></matrix>";
            // Should insert '</Matrix>' because '</matrix>' doesn't match
            const result = typeClosingBracket(source, 7);
            expect(result).toBe("<Matrix></Matrix></matrix>");
        });
    });
});
