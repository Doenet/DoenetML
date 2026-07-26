import { describe, expect, it } from "vitest";

import {
    catalogParseErrors,
    countDiagnosticConstructions,
    extractKeys,
    remainingLiteralDiagnostics,
    renderMessageKeysModule,
} from "../scripts/catalogUtils";

describe("extractKeys", () => {
    it("reads message ids, attributes, and both together", () => {
        expect(
            extractKeys(`
plain = Value
attrs-only =
    .one = One
    .two = Two
both = Value
    .attr = Attr
`),
        ).toEqual([
            "plain",
            "attrs-only.one",
            "attrs-only.two",
            "both",
            "both.attr",
        ]);
    });

    it("skips terms, which no call site can address", () => {
        expect(extractKeys("-brand = Doenet\nuses = { -brand }")).toEqual([
            "uses",
        ]);
    });
});

describe("catalogParseErrors", () => {
    it("is empty for a valid catalog", () => {
        expect(catalogParseErrors("greeting = Hello")).toEqual([]);
    });

    it("reports a malformed entry that the runtime would silently drop", () => {
        // `@fluent/bundle` discards this as junk without complaining, which is
        // precisely why the lint parses with `@fluent/syntax` too.
        const source = "good = Hello\n= no identifier\n";
        expect(extractKeys(source)).toEqual(["good"]);

        const errors = catalogParseErrors(source);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toContain("line 2");
    });

    it("reports an id defined twice", () => {
        expect(
            catalogParseErrors("greeting = Hello\ngreeting = Hi\n").length,
        ).toBeGreaterThan(0);
    });
});

describe("renderMessageKeysModule", () => {
    it("emits `never` when there are no keys", async () => {
        const rendered = await renderMessageKeysModule([]);
        expect(rendered).toContain("export type MessageKey = never;");
    });

    it("emits a union and a matching list", async () => {
        const rendered = await renderMessageKeysModule([
            "greeting",
            "color.blue",
        ]);
        expect(rendered).toMatch(
            /export type MessageKey =[\s\S]*"greeting"[\s\S]*"color\.blue"/,
        );
        expect(rendered).toMatch(
            /MESSAGE_KEYS[\s\S]*"greeting"[\s\S]*"color\.blue"/,
        );
    });

    it("emits Prettier-formatted output so lint:i18n and prettier agree", async () => {
        const rendered = await renderMessageKeysModule(["greeting"]);
        const prettier = await import("prettier");
        expect(await prettier.check(rendered, { parser: "typescript" })).toBe(
            true,
        );
    });
});

describe("countDiagnosticConstructions", () => {
    it("counts a coded call once on each side, so it nets out", () => {
        const counts = countDiagnosticConstructions(
            `diagnostics.push(codedDiagnostic({ type: "warning", code: "doenet-w0001" }));`,
        );
        expect(counts).toEqual({
            constructionCount: 1,
            codedConstructionCount: 1,
            forwardedCount: 0,
        });
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("counts a literal construction with nothing to cancel it", () => {
        const counts = countDiagnosticConstructions(
            `diagnostics.push({ type: "warning", message: "no" });`,
        );
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(1);
    });

    it("does not credit the declaration of `codedDiagnostic` itself", () => {
        // The declaration has a shorthand `type,` rather than a severity
        // literal, so nothing in the denominator offsets it. Counted, it
        // would report one more construction migrated than there are.
        const counts = countDiagnosticConstructions(
            `export function codedDiagnostic({ type, code }: Args) { return { type }; }`,
        );
        expect(counts.codedConstructionCount).toBe(0);
        expect(counts.constructionCount).toBe(0);
    });

    it("credits the declaration of `codedDastError`, which is where its construction is", () => {
        // The mirror image of the rule above. A DAST error's `type` is always
        // `"error"` — the node kind — so the parser's builder writes it and
        // its callers write nothing; the one construction and the one credit
        // both belong to the declaration.
        const counts = countDiagnosticConstructions(
            `export function codedDastError({ code, message }: Args): DastError {\n    return { type: "error", message, code };\n}`,
        );
        expect(counts).toEqual({
            constructionCount: 1,
            codedConstructionCount: 1,
            forwardedCount: 0,
        });
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("does not credit a call to `codedDastError`, which carries no construction", () => {
        // Callers hand over a code and a message and nothing else; crediting
        // them would take the burn-down below zero, one per call site.
        const counts = countDiagnosticConstructions(
            `children.push(codedDastError({ code: "doenet-e0009", message }));`,
        );
        expect(counts).toEqual({
            constructionCount: 0,
            codedConstructionCount: 0,
            forwardedCount: 0,
        });
    });

    it("counts a forwarded code as migrated", () => {
        const counts = countDiagnosticConstructions(
            `addDiagnostic({ type: "error", ...diagnosticCodeFrom(e) });`,
        );
        expect(counts.forwardedCount).toBe(1);
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("ignores a severity in a type declaration or a longer property name", () => {
        const counts = countDiagnosticConstructions(
            `interface R { type: "error"; }\nconst r = { error_type: "warning" };`,
        );
        expect(counts.constructionCount).toBe(0);
    });
});
