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

    it("does not insert bidi isolation marks by default", () => {
        // Doenet compares and hashes rendered strings, so U+2068/U+2069 around
        // every placeable would be a silent behavior change.
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

    it("adapts to the two-argument colorWords translate hook", () => {
        const t = createTranslator(["en"], { en: EN });
        const translate = asFallbackTranslator(t);
        expect(translate("color.blue", "blue")).toBe("blue");
        expect(translate("color.chartreuse", "chartreuse")).toBe("chartreuse");
    });
});
