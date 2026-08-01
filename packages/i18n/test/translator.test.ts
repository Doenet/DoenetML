import { describe, expect, it, vi } from "vitest";

import { asFallbackTranslator, createTranslator } from "../src/translator";

const EN = `
greeting = Hello
count-items = You have { $count } items
color =
    .blue = blue
    .red = red
`;

const ES = `
greeting = Hola
color =
    .blue = azul
`;

const ES_MX = `
greeting = Qué onda
`;

describe("createTranslator", () => {
    it("resolves from the first locale in the chain that has the key", () => {
        const t = createTranslator(
            ["es-MX", "es", "en"],
            { "es-MX": ES_MX, es: ES, en: EN },
            { includeBuiltinEnglish: false },
        );
        expect(t("greeting")).toBe("Qué onda");
        // Not in es-MX, so es answers.
        expect(t("color.blue")).toBe("azul");
        // In neither, so the English link of the chain answers.
        expect(t("color.red")).toBe("red");
    });

    it("falls back to the supplied English string, then the key", () => {
        const t = createTranslator(["es"], { es: ES });
        expect(t("nonexistent-key", undefined, "Some English")).toBe(
            "Some English",
        );
        expect(t("nonexistent-key")).toBe("nonexistent-key");
    });

    it("substitutes arguments", () => {
        const t = createTranslator(["en"], { en: EN });
        expect(t("count-items", { count: 3 })).toBe("You have 3 items");
    });

    it("writes a number in Latin digits under the locale's own conventions", () => {
        // #1615: Fluent formats a placeable with `Intl.NumberFormat` under the
        // bundle's locale, and it does so for a bare `{ $count }` as much as
        // for an explicit `NUMBER()`. Bangla, Marathi and Burmese would each
        // count in their own script; what they keep is their grouping, which
        // for the first two is India's twos above the first thousand.
        const bn = createTranslator(["bn"], { bn: "count-items = { $count }" });
        expect(bn("count-items", { count: 1234567 })).toBe("12,34,567");

        const my = createTranslator(["my"], { my: "count-items = { $count }" });
        expect(my("count-items", { count: 1234567 })).toBe("1,234,567");

        // The real pattern from `diagnostics.ftl`, whose `:1` is a literal in
        // the catalog. Localized digits would put the two halves of one ratio
        // in two scripts.
        const mr = createTranslator(["mr"], {
            mr: "ratio = { NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1",
        });
        expect(mr("ratio", { ratio: 4.53 })).toBe("4.53:1");
    });

    it("keeps the counting rules of a locale whose digits it pins", () => {
        // The pin is on the numbering system alone. Plural selection reads the
        // same locale and must still get Polish's four categories — `few` for
        // 2–4, `many` for the rest — or the fix would have cost the grammar to
        // buy the digits.
        const pl = createTranslator(["pl"], {
            pl: `items = { $count ->
        [one] jeden
        [few] kilka
       *[many] wiele
    }`,
        });
        expect(pl("items", { count: 1 })).toBe("jeden");
        expect(pl("items", { count: 3 })).toBe("kilka");
        expect(pl("items", { count: 12 })).toBe("wiele");
    });

    it("does not insert bidi isolation marks by default", () => {
        // Off unless a caller asks, because the caller is what knows whether
        // its output is only looked at: the chrome turns it on for every
        // language but English, and the worker's content translator never
        // does — what it renders becomes state variables that get compared
        // and hashed.
        const t = createTranslator(["en"], { en: EN });
        expect(t("count-items", { count: 3 })).not.toMatch(/[⁦-⁩]/);

        const isolating = createTranslator(
            ["en"],
            { en: EN },
            { useIsolating: true },
        );
        expect(isolating("count-items", { count: 3 })).toMatch(/[⁦-⁩]/);
    });

    it("skips locales with no catalog rather than breaking the chain", () => {
        const t = createTranslator(["fr", "es", "en"], { es: ES, en: EN });
        expect(t("greeting")).toBe("Hola");
    });

    it("always terminates in the bundled English catalogs", () => {
        // The Phase 0 catalogs are empty, so the built-in bundle cannot
        // resolve anything — but its presence must not break the chain.
        const t = createTranslator(["es"], { es: ES });
        expect(t("greeting")).toBe("Hola");
    });

    it("treats a key with more than one dot as a miss", () => {
        const t = createTranslator(["en"], { en: EN });
        expect(t("color.blue.extra", undefined, "fallback")).toBe("fallback");
    });

    it("reports formatting errors through onError instead of throwing", () => {
        // A translation referencing an argument the call site doesn't pass
        // must still render something — a renderer cannot be allowed to throw
        // because a catalog is wrong.
        const onError = vi.fn();
        const t = createTranslator(
            ["en"],
            { en: "needs-arg = Value: { $missing }" },
            { onError },
        );
        expect(t("needs-arg")).toContain("missing");
        expect(onError).toHaveBeenCalled();
    });

    // What a caller formatting an argument *outside* Fluent needs — see
    // `createDiagnosticFormatter`, which joins lists with `Intl.ListFormat`
    // and must join them in the language of the message that answered.
    it("reports which locale will answer for a key", () => {
        const t = createTranslator(
            ["es-MX", "es", "en"],
            { "es-MX": ES_MX, es: ES, en: EN },
            { includeBuiltinEnglish: false },
        );
        expect(t.localeOf?.("greeting")).toBe("es-MX");
        expect(t.localeOf?.("color.blue")).toBe("es");
        expect(t.localeOf?.("color.red")).toBe("en");
        expect(t.localeOf?.("nonexistent-key")).toBe(undefined);
    });

    // `en_US` is the POSIX spelling and the usual way a host mis-keys a
    // catalog. Negotiation keeps the tag verbatim — rewriting it would stop
    // the host's own catalog from being found — so it is here that it has to
    // stop being handed to `Intl`. Fluent builds `Intl.PluralRules` from
    // `bundle.locales` and, unlike its number formatting, does not degrade
    // when that throws: the whole message resolves to `{???}`.
    it("renders a selector under a tag Intl rejects", () => {
        const t = createTranslator(["en_US"], {
            en_US: `count-items =
    { $count ->
        [one] You have one item
       *[other] You have { $count } items
    }`,
        });
        expect(t("count-items", { count: 1 })).toBe("You have one item");
        expect(t("count-items", { count: 3 })).toBe("You have 3 items");
        // The tag it was filed under is still what it reports and what an
        // error is attributed to; only `Intl` sees the substitute.
        expect(t.localeOf?.("count-items")).toBe("en_US");
    });

    it("adapts to the two-argument colorWords translate hook", () => {
        const t = createTranslator(["en"], { en: EN });
        const translate = asFallbackTranslator(t);
        expect(translate("color.blue", "blue")).toBe("blue");
        expect(translate("color.chartreuse", "chartreuse")).toBe("chartreuse");
    });
});
