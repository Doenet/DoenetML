import { describe, expect, it } from "vitest";

import {
    negotiateLocales,
    normalizeLocaleTag,
    resolveDocumentLocale,
    resolveUiLocale,
} from "../src/negotiate";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

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

    /**
     * Chinese is the one language this repository translates twice, and the
     * two catalogs are told apart by script rather than by region. Which
     * catalog a reader reaches is decided here, so it is asserted here.
     *
     * Against the real roster rather than a stand-in for it, so that renaming
     * a catalog directory turns these red instead of leaving them describing a
     * layout the repository no longer has.
     */
    describe("Chinese, whose catalogs are named by script", () => {
        const available = SUPPORTED_LOCALES.map((info) => info.locale);

        it.each([
            ["zh-CN", "zh-Hans"],
            ["zh-SG", "zh-Hans"],
            ["zh-TW", "zh-Hant"],
            ["zh-HK", "zh-Hant"],
            ["zh-MO", "zh-Hant"],
        ])("serves %s from %s", (requested, expected) => {
            expect(negotiateLocales([requested], available)[0]).toBe(expected);
        });

        it("reads a bare zh as Simplified, which is what CLDR fills in", () => {
            expect(negotiateLocales(["zh"], available)).toEqual([
                "zh-Hans",
                "en",
            ]);
        });

        /**
         * The reason the Simplified catalog is not simply named `zh`, written
         * out as the counterfactual roster it argues against. Filtering
         * negotiation tries the region-stripped tag before it consults
         * likely-subtags, so a `zh` directory answers every Traditional region
         * tag ahead of `zh-Hant` — a Taiwanese reader would be served
         * Simplified.
         */
        it("does not let a script-less catalog shadow the other script", () => {
            expect(
                negotiateLocales(["zh-TW"], ["en", "zh", "zh-Hant"]),
            ).toEqual(["zh", "zh-Hant", "en"]);
            expect(negotiateLocales(["zh-TW"], available)).toEqual([
                "zh-Hant",
                "en",
            ]);
        });

        /**
         * Neither catalog falls back to the other: a key missing from one
         * renders in English rather than in the wrong script.
         */
        it("never chains one script behind the other", () => {
            expect(negotiateLocales(["zh-Hant"], available)).not.toContain(
                "zh-Hans",
            );
            expect(negotiateLocales(["zh-Hans"], available)).not.toContain(
                "zh-Hant",
            );
        });
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

describe("resolveUiLocale", () => {
    it("follows the content's language when the host configures none", () => {
        // A fully Spanish activity is fully Spanish out of the box.
        expect(resolveUiLocale(undefined, "es-MX")).toBe("es-MX");
        expect(resolveUiLocale(null, "en")).toBe("en");
    });

    it("lets the host set the chrome's language separately", () => {
        expect(resolveUiLocale("es", "fr")).toBe("es");
    });

    it("treats a blank tag as unset", () => {
        expect(resolveUiLocale("   ", "fr")).toBe("fr");
        expect(resolveUiLocale("", "fr")).toBe("fr");
    });

    it("normalizes what it returns, so the chrome negotiates like the content", () => {
        expect(resolveUiLocale("ES-mx", "fr")).toBe("es-MX");
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
