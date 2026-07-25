import { describe, expect, it } from "vitest";

import {
    negotiateLocales,
    normalizeLocaleTag,
    resolveDocumentLocale,
} from "../src/negotiate";

describe("negotiateLocales", () => {
    it("builds the regional -> language -> default chain", () => {
        expect(negotiateLocales(["es-MX"], ["es-MX", "es", "en"])).toEqual([
            "es-MX",
            "es",
            "en",
        ]);
    });

    it("falls back to the base language when the region has no catalog", () => {
        expect(negotiateLocales(["es-MX"], ["es", "en"])).toEqual(["es", "en"]);
    });

    it("appends the default locale even when it is not offered", () => {
        expect(negotiateLocales(["es"], ["es"])).toEqual(["es", "en"]);
    });

    it("returns just the default when nothing matches", () => {
        expect(negotiateLocales(["ja"], ["es", "en"])).toEqual(["en"]);
    });

    it("honors an explicit default locale", () => {
        expect(
            negotiateLocales(["ja"], ["es", "fr"], { defaultLocale: "fr" }),
        ).toEqual(["fr"]);
    });
});

describe("resolveDocumentLocale", () => {
    it("prefers the authored lang over the host's locale", () => {
        expect(resolveDocumentLocale("fr", "es-MX")).toBe("fr");
    });

    it("falls back to the host's locale, then to English", () => {
        expect(resolveDocumentLocale(undefined, "es-MX")).toBe("es-MX");
        expect(resolveDocumentLocale(undefined, undefined)).toBe("en");
    });

    it("treats blank and null as absent", () => {
        expect(resolveDocumentLocale("  ", "de")).toBe("de");
        expect(resolveDocumentLocale(null, null)).toBe("en");
        expect(resolveDocumentLocale("", "")).toBe("en");
    });

    it("normalizes whatever it returns", () => {
        expect(resolveDocumentLocale("ES-mx", undefined)).toBe("es-MX");
        expect(resolveDocumentLocale(undefined, "PT-br")).toBe("pt-BR");
    });
});

describe("normalizeLocaleTag", () => {
    it("canonicalizes casing so hand-typed lang attributes negotiate", () => {
        expect(normalizeLocaleTag("ES-mx")).toBe("es-MX");
        expect(normalizeLocaleTag("  en  ")).toBe("en");
    });

    it("leaves unparseable tags alone rather than throwing", () => {
        expect(normalizeLocaleTag("not a locale")).toBe("not a locale");
        expect(normalizeLocaleTag("")).toBe("");
    });

    it("produces a tag that negotiates against a differently-cased catalog", () => {
        expect(
            negotiateLocales([normalizeLocaleTag("es-mx")], ["es-MX", "en"]),
        ).toEqual(["es-MX", "en"]);
    });
});
