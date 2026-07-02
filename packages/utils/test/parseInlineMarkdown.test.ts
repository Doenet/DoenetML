import { describe, expect, it } from "vitest";
import { parseInlineMarkdown } from "../src/markdown/parseInlineMarkdown";

describe("parseInlineMarkdown", () => {
    it("returns a single text token for plain input", () => {
        expect(parseInlineMarkdown("just plain text")).toEqual([
            { kind: "text", text: "just plain text" },
        ]);
    });

    it("returns no tokens for the empty string", () => {
        expect(parseInlineMarkdown("")).toEqual([]);
    });

    it("wraps backtick-quoted spans as code", () => {
        expect(parseInlineMarkdown("a `<b>` c")).toEqual([
            { kind: "text", text: "a " },
            { kind: "code", text: "<b>" },
            { kind: "text", text: " c" },
        ]);
    });

    it("recognises **strong** before *em* so the doubled form wins", () => {
        expect(parseInlineMarkdown("**bold** and *italic*")).toEqual([
            { kind: "strong", text: "bold" },
            { kind: "text", text: " and " },
            { kind: "em", text: "italic" },
        ]);
    });

    it("emits unmatched trailing markers as literal text", () => {
        expect(parseInlineMarkdown("a `b")).toEqual([
            { kind: "text", text: "a `b" },
        ]);
        expect(parseInlineMarkdown("c *d")).toEqual([
            { kind: "text", text: "c *d" },
        ]);
    });

    it("handles multiple constructs on the same line", () => {
        expect(
            parseInlineMarkdown("Use `<x>` for **bold** or *italic* effect."),
        ).toEqual([
            { kind: "text", text: "Use " },
            { kind: "code", text: "<x>" },
            { kind: "text", text: " for " },
            { kind: "strong", text: "bold" },
            { kind: "text", text: " or " },
            { kind: "em", text: "italic" },
            { kind: "text", text: " effect." },
        ]);
    });

    it("does not recurse into a matched span", () => {
        // The schema does not use nested inline formatting, and the parser
        // is intentionally non-recursive: the leftmost match wins and its
        // content is emitted verbatim as the token's `text`.
        expect(parseInlineMarkdown("*a `b` c*")).toEqual([
            { kind: "em", text: "a `b` c" },
        ]);
    });
});
