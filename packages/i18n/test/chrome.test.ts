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
import mhChrome from "../locales/mh/chrome.ftl?raw";
import chkChrome from "../locales/chk/chrome.ftl?raw";
import ponChrome from "../locales/pon/chrome.ftl?raw";
import kosChrome from "../locales/kos/chrome.ftl?raw";
import gilChrome from "../locales/gil/chrome.ftl?raw";
import niuChrome from "../locales/niu/chrome.ftl?raw";
import tklChrome from "../locales/tkl/chrome.ftl?raw";
import tvlChrome from "../locales/tvl/chrome.ftl?raw";
import rarChrome from "../locales/rar/chrome.ftl?raw";
import wlsChrome from "../locales/wls/chrome.ftl?raw";
import biChrome from "../locales/bi/chrome.ftl?raw";
import nnChrome from "../locales/nn/chrome.ftl?raw";
import hsbChrome from "../locales/hsb/chrome.ftl?raw";
import dsbChrome from "../locales/dsb/chrome.ftl?raw";
import csbChrome from "../locales/csb/chrome.ftl?raw";
import szlChrome from "../locales/szl/chrome.ftl?raw";
import rueChrome from "../locales/rue/chrome.ftl?raw";
import liChrome from "../locales/li/chrome.ftl?raw";
import gswChrome from "../locales/gsw/chrome.ftl?raw";
import kshChrome from "../locales/ksh/chrome.ftl?raw";
import kshEditor from "../locales/ksh/editor.ftl?raw";
import scoChrome from "../locales/sco/chrome.ftl?raw";
import vecChrome from "../locales/vec/chrome.ftl?raw";
import napChrome from "../locales/nap/chrome.ftl?raw";
import lijChrome from "../locales/lij/chrome.ftl?raw";
import pmsChrome from "../locales/pms/chrome.ftl?raw";
import furChrome from "../locales/fur/chrome.ftl?raw";
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

/**
 * Oceania, and the first batch in which **not one member has CLDR plural
 * data**.
 *
 * The Sami block above is this one's opposite: four of those five catalogs
 * write a `[two]` branch because their own CLDR rules select it, and the fifth
 * does not because CLDR has never heard of Kildin Sami. Here the fifth case is
 * the whole batch. `Intl.PluralRules` resolves every one of these eleven tags
 * against the *runtime's* default locale, so any category branch a catalog
 * wrote would be selected by English's rules on English's terms — text that
 * looks translated and is chosen by the wrong language.
 *
 * That is not a defect in the catalogs and the batch does not treat it as one:
 * nouns in these languages are not marked for number after a numeral anyway,
 * so a single unselected form is the *right* translation as well as the safe
 * one. What this block pins is that nobody later adds a category branch to one
 * of these files without noticing that nothing can select it.
 *
 * Explicit numeric literals (`[0]`, `[1]`) are a different mechanism — matched
 * against the number itself rather than against a category — and stay legal,
 * which the last assertion holds.
 */
describe("the Oceania batch's plural categories", () => {
    /** Comment lines dropped: several headers discuss `[two]` in prose. */
    const branches = (catalog: string) =>
        catalog
            .split("\n")
            .filter((line) => !line.trimStart().startsWith("#"))
            .join("\n");

    const OCEANIA: [string, string][] = [
        ["mh", mhChrome],
        ["chk", chkChrome],
        ["pon", ponChrome],
        ["kos", kosChrome],
        ["gil", gilChrome],
        ["niu", niuChrome],
        ["tkl", tklChrome],
        ["tvl", tvlChrome],
        ["rar", rarChrome],
        ["wls", wlsChrome],
        ["bi", biChrome],
    ];

    it.each(OCEANIA)(
        "leaves %s free of a category branch nothing could select",
        (locale, catalog) => {
            // CLDR has no rules for the tag, so the categories on offer are
            // some other language's.
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
            for (const category of ["[zero]", "[two]", "[few]", "[many]"]) {
                expect(branches(catalog)).not.toContain(category);
            }
        },
    );

    it.each(OCEANIA)(
        "still counts and still renders in %s",
        (locale, catalog) => {
            const t = createChromeTranslator(locale, { [locale]: catalog });
            // The count reaches the reader whatever categories exist: this is the
            // half that would break if a catalog dropped its default branch while
            // shedding the categories it could not use.
            for (const count of [1, 2, 5]) {
                expect(
                    stripBidiIsolates(t("attempts-remaining", { count })),
                ).toContain(String(count));
            }
        },
    );

    /**
     * The one selector these catalogs may still write, and do. `[0]` is
     * matched against the number rather than against a category, so it is
     * unaffected by having no CLDR data — which is why every catalog in the
     * batch keeps English's "no attempts remaining" branch while dropping its
     * `one`/`other` split.
     */
    it.each(OCEANIA)(
        "selects %s's zero branch by the number itself",
        (locale, catalog) => {
            const t = createChromeTranslator(locale, { [locale]: catalog });
            const none = stripBidiIsolates(
                t("attempts-remaining", { count: 0 }),
            );
            const some = stripBidiIsolates(
                t("attempts-remaining", { count: 3 }),
            );
            expect(none).not.toBe(some);
        },
    );
});

/**
 * The European regional batch, and the **split** it runs along.
 *
 * The two blocks above are this one's two halves arriving together. The Sami
 * block pins four catalogs that write a `[two]` their own CLDR data selects
 * against one that cannot; the Oceania block pins eleven that CLDR has no data
 * for at all. Here **eight of the fifteen have their own rules and seven do
 * not**, in one batch, which makes the batch the first place the two states
 * can be asserted side by side against the same set of files.
 *
 * The eight are not uniform either, and that is the point of the second and
 * third assertions. `hsb` and `dsb` resolve a **`two`** — a living grammatical
 * dual, not a lexicalized survival, and the first in this repository outside
 * the Sami family; `ksh` resolves a **`zero`**; `vec` resolves a **`many`**
 * that fires only at exact millions. Each of those is written where the
 * grammar wants it and nowhere else, and this block holds the shape rather
 * than the wording, because a category and its neighbour are often worded
 * alike and no rendered string could tell them apart.
 *
 * For the seven with no data, the rule is the Oceania one: no category branch
 * at all, since `Intl.PluralRules` would resolve the tag against the runtime's
 * default locale and select the text by English's rules. `szl`, `csb` and
 * `rue` are the sharpest cases, because those three really do have a
 * `few`/`many` split of their own — the branch that could be written is
 * exactly the branch that would be got wrong.
 *
 * An explicit `[0]` is a different mechanism — matched against the number
 * rather than against a category — and stays legal in every one of the
 * fifteen, which the last assertion holds.
 */
describe("the European regional batch's plural categories", () => {
    /** Comment lines dropped: several headers discuss the categories in prose. */
    const branches = (catalog: string) =>
        catalog
            .split("\n")
            .filter((line) => !line.trimStart().startsWith("#"))
            .join("\n");

    /** The eight CLDR has rules for. */
    const WITH_RULES: [string, string][] = [
        ["nn", nnChrome],
        ["hsb", hsbChrome],
        ["dsb", dsbChrome],
        ["gsw", gswChrome],
        ["ksh", kshChrome],
        ["vec", vecChrome],
        ["lij", lijChrome],
        ["fur", furChrome],
    ];

    /** The seven it has none for. */
    const WITHOUT_RULES: [string, string][] = [
        ["csb", csbChrome],
        ["szl", szlChrome],
        ["rue", rueChrome],
        ["li", liChrome],
        ["sco", scoChrome],
        ["nap", napChrome],
        ["pms", pmsChrome],
    ];

    const ALL = [...WITH_RULES, ...WITHOUT_RULES];

    it.each(WITH_RULES)("resolves %s against its own CLDR data", (locale) => {
        expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
            .toBe(locale);
    });

    it.each(WITHOUT_RULES)(
        "leaves %s free of a category branch nothing could select",
        (locale, catalog) => {
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
            for (const category of ["[zero]", "[two]", "[few]", "[many]"]) {
                expect(branches(catalog)).not.toContain(category);
            }
        },
    );

    /**
     * The Sorbian dual. Both catalogs write `[two]` and `[few]` because both
     * languages count in pairs and then in small groups, and CLDR agrees.
     */
    it.each([
        ["hsb", hsbChrome],
        ["dsb", dsbChrome],
    ])("writes %s's dual, which its own rules select", (locale, catalog) => {
        const rules = new Intl.PluralRules(locale);
        expect(rules.select(2)).toBe("two");
        expect(rules.select(3)).toBe("few");
        expect(branches(catalog)).toContain("[two]");
        expect(branches(catalog)).toContain("[few]");
        const t = createChromeTranslator(locale, { [locale]: catalog });
        for (const count of [1, 2, 3, 5]) {
            expect(
                stripBidiIsolates(t("attempts-remaining", { count })),
            ).toContain(String(count));
        }
    });

    /**
     * Colognian's `zero`, which no other catalog in this batch could write
     * truthfully. It is a category matched by CLDR, and it is not the same
     * mechanism as the explicit `[0]` literal `attempts-remaining` uses.
     */
    it("gives Colognian a zero category its own rules select", () => {
        const rules = new Intl.PluralRules("ksh");
        expect(rules.resolvedOptions().locale).toBe("ksh");
        expect(rules.select(0)).toBe("zero");
        expect(rules.select(1)).toBe("one");
        expect(rules.select(5)).toBe("other");
        // …and writes it, in the one place English leaves a real count with no
        // `[0]` literal already standing on it.
        expect(branches(kshEditor)).toContain("[zero]");
        // Not beside the `[0]` literal, though: two mechanisms competing for
        // the same input is the trap the catalog's own header describes.
        expect(branches(kshChrome)).not.toContain("[zero]");
    });

    /**
     * Venetian's `many`, recorded because its absence from the catalogs is
     * deliberate: it fires at exact millions and at nothing else, and no noun
     * counted in these files changes shape there.
     */
    it("gives Venetian a many that fires only at exact millions", () => {
        const rules = new Intl.PluralRules("vec");
        expect(rules.select(1_000_000)).toBe("many");
        expect(rules.select(1_500_000)).toBe("other");
        expect(branches(vecChrome)).not.toContain("[many]");
    });

    it.each(ALL)("still counts and still renders in %s", (locale, catalog) => {
        const t = createChromeTranslator(locale, { [locale]: catalog });
        for (const count of [1, 2, 5]) {
            expect(
                stripBidiIsolates(t("attempts-remaining", { count })),
            ).toContain(String(count));
        }
    });

    it.each(ALL)(
        "selects %s's zero branch by the number itself",
        (locale, catalog) => {
            const t = createChromeTranslator(locale, { [locale]: catalog });
            const none = stripBidiIsolates(
                t("attempts-remaining", { count: 0 }),
            );
            const some = stripBidiIsolates(
                t("attempts-remaining", { count: 3 }),
            );
            expect(none).not.toBe(some);
        },
    );
});
