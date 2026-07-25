import { describe, expect, it } from "vitest";

import { createChromeTranslator, EN_CHROME_TRANSLATOR } from "../src/chrome";
import { PSEUDO_LOCALE } from "../src/pseudo";
import { EN_CATALOGS } from "../src/catalogs";
import { extractKeys } from "../scripts/catalogUtils";

describe("createChromeTranslator", () => {
    it("answers in English for the default locale", () => {
        const t = createChromeTranslator("en");
        expect(t("answer-correct")).toBe("Correct");
    });

    it("answers in Spanish for a bundled translation", () => {
        const t = createChromeTranslator("es");
        expect(t("answer-correct")).toBe("Correcto");
        expect(t("keyboard-close")).toBe("Cerrar el teclado");
    });

    it("negotiates a regional tag down to the locale that exists", () => {
        // A Mexican Spanish activity has no `es-MX` catalog, but falling back
        // to `es` is far better than falling back to English.
        const t = createChromeTranslator("es-MX");
        expect(t("answer-correct")).toBe("Correcto");
    });

    it("normalizes a hand-typed tag before negotiating", () => {
        const t = createChromeTranslator("ES-mx");
        expect(t("answer-correct")).toBe("Correcto");
    });

    it("falls back to English for a locale nobody translated", () => {
        const t = createChromeTranslator("fr");
        expect(t("answer-correct")).toBe("Correct");
    });

    it("lets a host catalog override the bundled translation", () => {
        // A deployment can correct a translation without waiting for a
        // release.
        const t = createChromeTranslator("es", {
            es: "answer-correct = ¡Bien hecho!",
        });
        expect(t("answer-correct")).toBe("¡Bien hecho!");
        // Keys the override does not mention still come from English, not
        // from the bundled Spanish it replaced.
        expect(t("answer-incorrect")).toBe("Incorrect");
    });

    it("accepts a host catalog for a locale nothing is bundled for", () => {
        const t = createChromeTranslator("fr", {
            fr: "answer-correct = Correct !",
        });
        expect(t("answer-correct")).toBe("Correct !");
    });

    it("formats a count with the right plural form", () => {
        const t = createChromeTranslator("en");
        expect(t("attempts-remaining", { count: 0 })).toBe(
            "no attempts remaining",
        );
        expect(t("attempts-remaining", { count: 1 })).toBe(
            "1 attempt remaining",
        );
        expect(t("attempts-remaining", { count: 4 })).toBe(
            "4 attempts remaining",
        );
    });

    it("picks the plural forms of the target language, not English's", () => {
        const t = createChromeTranslator("es");
        expect(t("attempts-remaining", { count: 0 })).toBe(
            "no quedan intentos",
        );
        expect(t("attempts-remaining", { count: 1 })).toBe("queda 1 intento");
        expect(t("attempts-remaining", { count: 4 })).toBe("quedan 4 intentos");
    });

    it("substitutes without bidi isolation marks", () => {
        // `useIsolating` stays off so translated output can still be compared
        // and asserted on as plain text.
        const t = createChromeTranslator("en");
        expect(t("max-credit-available", { percent: 80 })).toBe(
            "Max credit available: 80%",
        );
    });

    it("returns the caller's English for a key no catalog defines", () => {
        const t = createChromeTranslator("es");
        expect(t("not-a-real-key", undefined, "Fallback")).toBe("Fallback");
    });

    describe("pseudo-locale", () => {
        it("accents every chrome message", () => {
            const t = createChromeTranslator(PSEUDO_LOCALE);
            const accented = t("answer-correct");
            expect(accented).not.toBe("Correct");
            expect(accented).toContain("»");
            expect(accented).toContain("«");
        });

        it("is derived from English, so it can never go stale", () => {
            // A committed pseudo catalog would drift: a key added to English
            // would render unaccented and read as an unextracted string.
            const t = createChromeTranslator(PSEUDO_LOCALE);
            const args = { percent: 50, count: 2 };
            for (const key of extractKeys(EN_CATALOGS.chrome)) {
                const english = EN_CHROME_TRANSLATOR(key, args);
                // A message with nothing but a placeable and punctuation
                // (`{ $percent } %`) has no letters to accent, and the
                // pseudo-localizer leaves it alone on purpose.
                if (!/[a-zA-Z]/.test(english)) {
                    continue;
                }
                expect(t(key, args), key).not.toBe(english);
            }
        });

        it("is recognized through a hand-typed tag", () => {
            // The pseudo catalog is keyed by tag, so the casing has to be
            // normalized before it is looked up, not only before negotiation.
            const t = createChromeTranslator("en-xa");
            expect(t("answer-correct")).toBe(
                createChromeTranslator(PSEUDO_LOCALE)("answer-correct"),
            );
            expect(t("answer-correct")).not.toBe("Correct");
        });

        it("is not offered unless it is asked for", () => {
            // Materializing it for every locale would put a pseudo catalog in
            // the fallback chain of real ones.
            const t = createChromeTranslator("es");
            expect(t("answer-correct")).toBe("Correcto");
        });
    });
});

describe("EN_CHROME_TRANSLATOR", () => {
    it("renders today's English, for chrome mounted outside any provider", () => {
        expect(EN_CHROME_TRANSLATOR("answer-response-saved")).toBe(
            "Response Saved",
        );
    });
});
