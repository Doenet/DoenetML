import { describe, expect, it } from "vitest";

import {
    SUPPORTED_LOCALES_FILE,
    catalogParseErrors,
    countDiagnosticConstructions,
    extractKeys,
    listLocales,
    numberingSystemOverrides,
    remainingLiteralDiagnostics,
    renderMessageKeysModule,
    renderSupportedLocalesModule,
} from "../scripts/catalogUtils";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

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

describe("numberingSystemOverrides", () => {
    it("catches a builtin that names a numbering system", () => {
        expect(
            numberingSystemOverrides(
                'ratio = contrast { NUMBER($ratio, numberingSystem: "beng") }',
            ),
        ).toEqual(['NUMBER() sets numberingSystem in "ratio"']);
        expect(
            numberingSystemOverrides(
                'when = { DATETIME($due, numberingSystem: "deva") }',
            ),
        ).toEqual(['DATETIME() sets numberingSystem in "when"']);
    });

    it("leaves the formatting options a catalog is allowed to set", () => {
        // The real pattern from `diagnostics.ftl`. Fraction digits are a
        // catalog's business; which script the digits are written in is not.
        expect(
            numberingSystemOverrides(
                "ratio = { NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1",
            ),
        ).toEqual([]);
    });

    it("reads the syntax rather than the text, so a comment may say the word", () => {
        // The group comments explaining the policy are the reason this is an
        // AST walk: a catalog has to be able to write down why it must not.
        expect(
            numberingSystemOverrides(
                "# Never pass numberingSystem here — see src/intl.ts.\ncount = { $count } items",
            ),
        ).toEqual([]);
    });

    it("descends into selects and attributes", () => {
        expect(
            numberingSystemOverrides(`
items =
    { $count ->
        [one] one item
       *[other] { NUMBER($count, numberingSystem: "mymr") } items
    }
    .label = { NUMBER($count, numberingSystem: "beng") }
`),
        ).toEqual([
            'NUMBER() sets numberingSystem in "items"',
            'NUMBER() sets numberingSystem in "items"',
        ]);
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

describe("renderSupportedLocalesModule", () => {
    it("derives each locale's name in English and in itself", async () => {
        const rendered = await renderSupportedLocalesModule(["en", "es"]);
        expect(rendered).toContain('englishName: "Spanish"');
        expect(rendered).toContain('endonym: "español"');
        expect(rendered).toContain('label: "Spanish (español)"');
    });

    it("collapses the label when both names coincide", async () => {
        // English in English, and any tag `Intl` doesn't recognize, would
        // otherwise read as `English (English)` — which looks like a bug.
        const rendered = await renderSupportedLocalesModule(["en"]);
        expect(rendered).toContain('label: "English"');
        expect(rendered).not.toContain("English (English)");
    });

    it("names an unknown locale rather than throwing on it", async () => {
        // A locale directory can be added long before `Intl` (or this Node)
        // knows the tag. Codegen must not be what stops it landing: an
        // unrecognized tag degrades to `Intl`'s rendering of the tag itself,
        // which is still a usable label.
        const rendered = await renderSupportedLocalesModule(["en", "zz-QQ"]);
        expect(rendered).toContain('locale: "zz-QQ"');
        expect(rendered).toMatch(/label: "zz[^"]*"/);
    });

    it("emits Prettier-formatted output so lint:i18n and prettier agree", async () => {
        // Checked under the repo's own config, which is what `prettier:check`
        // will hold the committed file to — the default 2-space width would
        // disagree with every line of it.
        const rendered = await renderSupportedLocalesModule(["en", "es"]);
        const prettier = await import("prettier");
        const config = await prettier.resolveConfig(SUPPORTED_LOCALES_FILE);
        expect(
            await prettier.check(rendered, {
                ...config,
                filepath: SUPPORTED_LOCALES_FILE,
                parser: "typescript",
            }),
        ).toBe(true);
    });
});

describe("SUPPORTED_LOCALES", () => {
    it("lists every locale directory, English first", () => {
        // The roster is generated from `locales/`, deliberately not from the
        // catalogs inlined into the bundle — which is what keeps it listing
        // every language now that English is the only one inlined. `lint:i18n`
        // enforces the same agreement; this pins it as a runtime fact too.
        expect(SUPPORTED_LOCALES.map((l) => l.locale)).toEqual(listLocales());
        expect(SUPPORTED_LOCALES[0]?.locale).toBe("en");
    });

    it("gives every locale a non-empty label", () => {
        // The schema generator hard-fails on an empty description, so a blank
        // label here would break the build of `<document lang>`'s suggestions.
        for (const { label } of SUPPORTED_LOCALES) {
            expect(label.trim()).not.toBe("");
        }
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
