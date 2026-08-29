import { describe, expect, it } from "vitest";

import { createChromeTranslator, EN_CHROME_TRANSLATOR } from "../src/chrome";
import { PSEUDO_LOCALE, PSEUDO_RTL_LOCALE } from "../src/pseudo";
import { stripBidiIsolates } from "../src/direction";
import { EN_CATALOGS } from "../src/catalogs";
import esChrome from "../locales/es/chrome.ftl?raw";
import filChrome from "../locales/fil/chrome.ftl?raw";
import filEditor from "../locales/fil/editor.ftl?raw";
import smaChrome from "../locales/sma/chrome.ftl?raw";
import smjChrome from "../locales/smj/chrome.ftl?raw";
import smnChrome from "../locales/smn/chrome.ftl?raw";
import smsChrome from "../locales/sms/chrome.ftl?raw";
import sjdChrome from "../locales/sjd/chrome.ftl?raw";
import { extractKeys } from "../scripts/catalogUtils";

/**
 * Spanish, handed over the way a host hands over a catalog it loaded.
 *
 * No translation is inlined, so every language other than English reaches the
 * chrome through this argument — the same route `useLocaleCatalogs` takes at
 * runtime once `loadLocaleResources` resolves.
 */
const ES = { es: esChrome };

/**
 * Filipino, whose two plural categories are the sharpest reminder that a
 * category is not a number. Two namespaces, joined the way `combineCatalogs`
 * joins them, because the pair of messages that shows it lives in both.
 */
const FIL = { fil: `${filChrome}\n${filEditor}` };

describe("createChromeTranslator", () => {
    it("answers in English for the default locale", () => {
        const t = createChromeTranslator("en");
        expect(t("answer-correct")).toBe("Correct");
    });

    it("answers in Spanish once the catalog is supplied", () => {
        const t = createChromeTranslator("es", ES);
        expect(t("answer-correct")).toBe("Correcto");
        expect(t("keyboard-close")).toBe("Cerrar el teclado");
    });

    it("negotiates a regional tag down to the locale that exists", () => {
        // A Mexican Spanish activity has no `es-MX` catalog, but falling back
        // to `es` is far better than falling back to English.
        const t = createChromeTranslator("es-MX", ES);
        expect(t("answer-correct")).toBe("Correcto");
    });

    it("normalizes a hand-typed tag before negotiating", () => {
        const t = createChromeTranslator("ES-mx", ES);
        expect(t("answer-correct")).toBe("Correcto");
    });

    it("falls back to English for a locale nobody translated", () => {
        const t = createChromeTranslator("fr");
        expect(t("answer-correct")).toBe("Correct");
    });

    it("falls back to English for keys a host catalog does not mention", () => {
        // A deployment can correct or extend a translation without waiting for
        // a release, and supplying one key does not blank out the rest.
        const t = createChromeTranslator("es", {
            es: "answer-correct = ¡Bien hecho!",
        });
        expect(t("answer-correct")).toBe("¡Bien hecho!");
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
        const t = createChromeTranslator("es", ES);
        expect(t("attempts-remaining", { count: 0 })).toBe(
            "no quedan intentos",
        );
        expect(stripBidiIsolates(t("attempts-remaining", { count: 1 }))).toBe(
            "queda 1 intento",
        );
        expect(stripBidiIsolates(t("attempts-remaining", { count: 4 }))).toBe(
            "quedan 4 intentos",
        );
    });

    it("pluralizes around an untranslatable identifier", () => {
        // `$answerId` is the answer's authored name and passes through as
        // written, in either language.
        const en = createChromeTranslator("en");
        expect(en("answer-show-responses", { count: 1, answerId: "ans" })).toBe(
            "Show 1 response to ans",
        );
        expect(en("answer-show-responses", { count: 3, answerId: "ans" })).toBe(
            "Show 3 responses to ans",
        );

        const es = createChromeTranslator("es", ES);
        expect(
            stripBidiIsolates(
                es("answer-show-responses", { count: 3, answerId: "ans" }),
            ),
        ).toBe("Mostrar 3 respuestas a ans");
    });

    it("selects on a plural category that does not count", () => {
        // Filipino's `one` and `other` split the numerals by the linker they
        // take rather than by how many there are: `one` is every number whose
        // Tagalog word ends in a vowel, so it catches 5, and `other` is 4, 6,
        // 9 and anything ending in them. Number itself is the free word
        // «mga», so a message wanting a real singular has to say `[1]` by
        // number — which is why the two below select on different things.
        const t = createChromeTranslator("fil", FIL);
        expect(stripBidiIsolates(t("attempts-remaining", { count: 5 }))).toBe(
            "5 pagsubok na lang ang natitira",
        );
        expect(stripBidiIsolates(t("attempts-remaining", { count: 4 }))).toBe(
            "4 na pagsubok na lang ang natitira",
        );
        expect(t("help-coordinates", { count: 1 })).toBe("Koordinado:");
        expect(t("help-coordinates", { count: 5 })).toBe("Mga koordinado:");
    });

    it("leaves English free of bidi isolation marks", () => {
        // Every phase has held English byte-identical to the string it
        // replaced, and the assertion corpus compares it as plain text.
        const t = createChromeTranslator("en");
        expect(t("max-credit-available", { percent: 80 })).toBe(
            "Max credit available: 80%",
        );
        // Including a regional English, which is English by primary subtag.
        expect(
            createChromeTranslator("en-GB")("max-credit-available", {
                percent: 80,
            }),
        ).toBe("Max credit available: 80%");
    });

    it("isolates placeables in every other language", () => {
        // What keeps an interpolated Latin identifier from scrambling the
        // Arabic around it. The marks are invisible, so assert the code
        // points rather than the rendering.
        const es = createChromeTranslator("es", ES);
        expect(es("max-credit-available", { percent: 80 })).toBe(
            "Crédito máximo disponible: \u{2068}80\u{2069} %",
        );
    });

    it("isolates a message that falls back to English", () => {
        // Isolation follows the surface, not whichever catalog answered: the
        // chrome around an untranslated string is still Spanish.
        const es = createChromeTranslator("es", { es: "" });
        expect(es("max-credit-available", { percent: 80 })).toBe(
            "Max credit available: \u{2068}80\u{2069}%",
        );
    });

    it("leaves a message with no placeable byte-identical either way", () => {
        // Isolation wraps placeables and nothing else, which is what bounds
        // the change to the handful of parameterized messages.
        expect(createChromeTranslator("es", ES)("answer-correct")).toBe(
            "Correcto",
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
            const args = { percent: 50, count: 2, answerId: "ans" };
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
            const t = createChromeTranslator("es", ES);
            expect(t("answer-correct")).toBe("Correcto");
        });

        it("has a right-to-left twin that renders the same words", () => {
            // `en-XB` differs from `en-XA` in direction and nothing else, so a
            // layout difference between the two runs cannot be blamed on the
            // text having changed.
            const ltr = createChromeTranslator(PSEUDO_LOCALE);
            const rtl = createChromeTranslator(PSEUDO_RTL_LOCALE);
            for (const key of extractKeys(EN_CATALOGS.chrome)) {
                expect(stripBidiIsolates(rtl(key)), key).toBe(ltr(key));
            }
        });

        it("recognizes the right-to-left tag hand-typed too", () => {
            expect(createChromeTranslator("en-xb")("answer-correct")).toBe(
                createChromeTranslator(PSEUDO_RTL_LOCALE)("answer-correct"),
            );
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
/**
 * The Sami dual, and the one catalog in the family that cannot write it.
 *
 * `sma`, `smj`, `smn` and `sms` resolve `one`, `two` and `other`, so a
 * `{ $count -> … }` in them can carry a third branch that is genuinely
 * reached — the shape `locales/se` established, and the only place in the
 * roster where a category exists because the language counts in pairs rather
 * than because CLDR happens to list it. `sjd` is the same family and gets no
 * such branch: Kildin Sami has a dual too, but CLDR has no plural data for the
 * tag, so `Intl.PluralRules("sjd")` resolves against the runtime's default
 * locale and a `[two]` branch there would be text no input could select.
 *
 * Pinned on the plural rules and on the presence of the branch in the source,
 * because in these four `[two]` and `[other]` are worded alike everywhere they
 * appear — they are two categories, not one with a spelling variant — so no
 * rendered string could tell them apart. What a runtime with no `sjd` data
 * falls back to is the environment's business and not a claim made here, hence
 * `resolvedOptions().locale` rather than a rendered count.
 */
describe("the Sami plural categories", () => {
    /** Comment lines dropped: the headers discuss `[two]` in prose. */
    const branches = (catalog: string) =>
        catalog
            .split("\n")
            .filter((line) => !line.trimStart().startsWith("#"))
            .join("\n");

    it.each([
        ["sma", smaChrome],
        ["smj", smjChrome],
        ["smn", smnChrome],
        ["sms", smsChrome],
    ])(
        "writes %s's dual branch, which its own CLDR data selects",
        (locale, catalog) => {
            const rules = new Intl.PluralRules(locale);
            expect(rules.resolvedOptions().locale).toBe(locale);
            expect(rules.select(2)).toBe("two");
            expect(branches(catalog)).toContain("[two]");
            const t = createChromeTranslator(locale, { [locale]: catalog });
            expect(
                stripBidiIsolates(t("attempts-remaining", { count: 2 })),
            ).toContain("2");
        },
    );

    it("writes no dual branch for the Sami language CLDR has no rules for", () => {
        expect(new Intl.PluralRules("sjd").resolvedOptions().locale).not.toBe(
            "sjd",
        );
        expect(branches(sjdChrome)).not.toContain("[two]");
        // It still counts, and still renders — the categories it selects
        // between are simply not its own.
        const t = createChromeTranslator("sjd", { sjd: sjdChrome });
        expect(
            stripBidiIsolates(t("attempts-remaining", { count: 2 })),
        ).toContain("2");
    });
});
