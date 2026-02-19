import { Text } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import {
    getOpeningTagNameAtCursor,
    hasMatchingCloseTagAhead,
} from "./auto-close-tag";

describe("auto-close-tag helpers", () => {
    describe("getOpeningTagNameAtCursor", () => {
        it("detects a simple opening tag name", () => {
            const doc = Text.of(["<matrix"]);
            expect(getOpeningTagNameAtCursor(doc, 7)).toBe("matrix");
        });

        it("detects opening tag name with attributes", () => {
            const line = '<title hide="true"';
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBe("title");
        });

        it("detects opening tag name with attributes with no value", () => {
            const line = "<title hide";
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBe("title");
        });

        it("returns null for closing tags", () => {
            const line = "</matrix";
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBeNull();
        });

        it("returns null for self-closing intent", () => {
            const line = "<title/";
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBeNull();
        });

        it("returns null when cursor is in quoted attribute value", () => {
            const line = '<title text="hello';
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBeNull();
        });

        it("uses the nearest opening tag before cursor", () => {
            const line = "<a><b";
            const doc = Text.of([line]);
            expect(getOpeningTagNameAtCursor(doc, line.length)).toBe("b");
        });
    });

    describe("hasMatchingCloseTagAhead", () => {
        it("returns true when close tag immediately follows cursor", () => {
            const line = "<matrix></matrix>";
            const doc = Text.of([line]);
            const cursorOffset = "<matrix>".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "matrix")).toBe(
                true,
            );
        });

        it("returns false when close tag does not match", () => {
            const line = "<matrix></title>";
            const doc = Text.of([line]);
            const cursorOffset = "<matrix>".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "matrix")).toBe(
                false,
            );
        });

        it("returns true when close tag appears later in text", () => {
            const line = "<matrix> x </matrix>";
            const doc = Text.of([line]);
            const cursorOffset = "<matrix>".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "matrix")).toBe(
                true,
            );
        });

        it("returns true when matching close tag appears later after text", () => {
            const line = "<tag   additional text</tag>";
            const doc = Text.of([line]);
            const cursorOffset = "<tag".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "tag")).toBe(
                true,
            );
        });

        it("returns true when matching close tag appears later after nested tags", () => {
            const line = "<tag additional text <otherTag>hi</otherTag> </tag>";
            const doc = Text.of([line]);
            const cursorOffset = "<tag".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "tag")).toBe(
                true,
            );
        });

        it("matches the correct closing tag with nested same-name tags", () => {
            const line = "<tag <tag>inner</tag> outer</tag>";
            const doc = Text.of([line]);
            const cursorOffset = "<tag".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "tag")).toBe(
                true,
            );
        });

        it("ignores self-closing same-name tags while searching", () => {
            const line = "<tag <tag/> text </tag>";
            const doc = Text.of([line]);
            const cursorOffset = "<tag".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "tag")).toBe(
                true,
            );
        });

        it("returns false when no matching close tag exists ahead", () => {
            const line = "<tag <otherTag>hi</otherTag>";
            const doc = Text.of([line]);
            const cursorOffset = "<tag".length;
            expect(hasMatchingCloseTagAhead(doc, cursorOffset, "tag")).toBe(
                false,
            );
        });
    });
});
