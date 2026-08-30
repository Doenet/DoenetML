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
import crhChrome from "../locales/crh/chrome.ftl?raw";
import gagChrome from "../locales/gag/chrome.ftl?raw";
import tttChrome from "../locales/ttt/chrome.ftl?raw";
import kaaChrome from "../locales/kaa/chrome.ftl?raw";
import kjhChrome from "../locales/kjh/chrome.ftl?raw";
import altChrome from "../locales/alt/chrome.ftl?raw";
import mznChrome from "../locales/mzn/chrome.ftl?raw";
import glkChrome from "../locales/glk/chrome.ftl?raw";
import lrcChrome from "../locales/lrc/chrome.ftl?raw";
import balChrome from "../locales/bal/chrome.ftl?raw";
import hazChrome from "../locales/haz/chrome.ftl?raw";
import zzaChrome from "../locales/zza/chrome.ftl?raw";
import dngChrome from "../locales/dng/chrome.ftl?raw";
import sghChrome from "../locales/sgh/chrome.ftl?raw";
import wblChrome from "../locales/wbl/chrome.ftl?raw";
import bugChrome from "../locales/bug/chrome.ftl?raw";
import bugDiagnostics from "../locales/bug/diagnostics.ftl?raw";
import makChrome from "../locales/mak/chrome.ftl?raw";
import makDiagnostics from "../locales/mak/diagnostics.ftl?raw";
import bjnChrome from "../locales/bjn/chrome.ftl?raw";
import bjnDiagnostics from "../locales/bjn/diagnostics.ftl?raw";
import gorChrome from "../locales/gor/chrome.ftl?raw";
import gorDiagnostics from "../locales/gor/diagnostics.ftl?raw";
import niaChrome from "../locales/nia/chrome.ftl?raw";
import niaDiagnostics from "../locales/nia/diagnostics.ftl?raw";
import bbcChrome from "../locales/bbc/chrome.ftl?raw";
import bbcDiagnostics from "../locales/bbc/diagnostics.ftl?raw";
import ibaChrome from "../locales/iba/chrome.ftl?raw";
import ibaDiagnostics from "../locales/iba/diagnostics.ftl?raw";
import dtpChrome from "../locales/dtp/chrome.ftl?raw";
import dtpDiagnostics from "../locales/dtp/diagnostics.ftl?raw";
import pagChrome from "../locales/pag/chrome.ftl?raw";
import pagDiagnostics from "../locales/pag/diagnostics.ftl?raw";
import cbkChrome from "../locales/cbk/chrome.ftl?raw";
import cbkDiagnostics from "../locales/cbk/diagnostics.ftl?raw";
import tsgChrome from "../locales/tsg/chrome.ftl?raw";
import tsgDiagnostics from "../locales/tsg/diagnostics.ftl?raw";
import mrwChrome from "../locales/mrw/chrome.ftl?raw";
import mrwDiagnostics from "../locales/mrw/diagnostics.ftl?raw";
import shnChrome from "../locales/shn/chrome.ftl?raw";
import shnDiagnostics from "../locales/shn/diagnostics.ftl?raw";
import mnwChrome from "../locales/mnw/chrome.ftl?raw";
import mnwDiagnostics from "../locales/mnw/diagnostics.ftl?raw";
import kswChrome from "../locales/ksw/chrome.ftl?raw";
import kswDiagnostics from "../locales/ksw/diagnostics.ftl?raw";
// The Silk Road batch's `diagnostics.ftl` too: it holds every count select
// that is not in `chrome.ftl`, so where each catalog's `[one]` falls is only
// checkable across both files.
import crhDiagnostics from "../locales/crh/diagnostics.ftl?raw";
import gagDiagnostics from "../locales/gag/diagnostics.ftl?raw";
import tttDiagnostics from "../locales/ttt/diagnostics.ftl?raw";
import kaaDiagnostics from "../locales/kaa/diagnostics.ftl?raw";
import kjhDiagnostics from "../locales/kjh/diagnostics.ftl?raw";
import altDiagnostics from "../locales/alt/diagnostics.ftl?raw";
import mznDiagnostics from "../locales/mzn/diagnostics.ftl?raw";
import glkDiagnostics from "../locales/glk/diagnostics.ftl?raw";
import lrcDiagnostics from "../locales/lrc/diagnostics.ftl?raw";
import balDiagnostics from "../locales/bal/diagnostics.ftl?raw";
import hazDiagnostics from "../locales/haz/diagnostics.ftl?raw";
import zzaDiagnostics from "../locales/zza/diagnostics.ftl?raw";
import dngDiagnostics from "../locales/dng/diagnostics.ftl?raw";
import sghDiagnostics from "../locales/sgh/diagnostics.ftl?raw";
import wblDiagnostics from "../locales/wbl/diagnostics.ftl?raw";
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
 * one. That no such catalog *writes* an unselectable category branch is held
 * for the whole roster in `catalogLint.test.ts`, and by `lint:i18n`; what this
 * block adds is which of these tags is in that position and why.
 *
 * Explicit numeric literals (`[0]`, `[1]`) are a different mechanism — matched
 * against the number itself rather than against a category — and stay legal,
 * which the last assertion holds.
 */
describe("the Oceania batch's plural categories", () => {
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
        "resolves %s against some other language's rules",
        (locale) => {
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
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
 * dual, as `sl`, `sat`, the Sami catalogs and the Semitic and Celtic ones
 * already write, and the first pair of neighbouring standards to arrive with
 * one together; `ksh` resolves a **`zero`**; `vec` resolves a **`many`**
 * that fires only at exact millions. Each of those is written where the
 * grammar wants it and nowhere else, and this block holds the shape rather
 * than the wording, because a category and its neighbour are often worded
 * alike and no rendered string could tell them apart.
 *
 * For the seven with no data, the rule is the Oceania one: no category branch
 * at all, since `Intl.PluralRules` would resolve the tag against the runtime's
 * default locale and select the text by English's rules — enforced for every
 * catalog by `lint:i18n`, so what is asserted here is only which seven those
 * are. `szl`, `csb` and `rue` are the sharpest cases, because those three
 * really do have a `few`/`many` split of their own — the branch that could be
 * written is exactly the branch that would be got wrong.
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
        "resolves %s against some other language's rules",
        (locale) => {
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
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
        // The `few` branch itself renders; `one`, `two` and `other` are
        // covered for all fifteen by the block below.
        const t = createChromeTranslator(locale, { [locale]: catalog });
        expect(stripBidiIsolates(t("attempts-remaining", { count: 3 }))) //
            .toContain("3");
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

/**
 * The Silk Road, and the batch where the exception is a single catalog.
 *
 * The three blocks above give the other proportions: the Sami block is five
 * catalogs where four have CLDR plural data, the Oceania block eleven where
 * none does, and the European regional block fifteen split eight to seven.
 * This batch is fifteen where **exactly one** does: `Intl.PluralRules("bal")` resolves to `bal` itself,
 * with `one` and `other`, and the other fourteen resolve to the runtime's
 * default locale — English here — so any category branch they wrote would be
 * chosen by English's rules on English's terms.
 *
 * That no catalog here carries a `[zero]`, `[two]`, `[few]` or `[many]` branch
 * its own locale could never select is not asserted in this block: the
 * roster-wide property in `catalogLint.test.ts` holds it for every catalog,
 * over all four namespaces and off the syntax tree rather than the text. What
 * is left here is the half that property cannot state — which tags have CLDR
 * data of their own, and which category each resolves — so that a future ICU
 * build gaining rules for, say, `mzn`, or losing the ones it has for `bal`,
 * fails an assertion rather than silently changing which branch a reader gets.
 *
 * **Every `[one]` row reads `chrome.ftl` and `diagnostics.ftl` together.**
 * That is the whole reason the second import list above exists: each catalog's
 * count selects are split between the two files.
 *
 * `[one]` is deliberately not in the forbidden list — it is the one category
 * every runtime default can select — and where it falls is the thing this
 * summary would not have predicted:
 *
 *   * **`bal`, the only member with real rules, is not the one that uses
 *     them.** Every count message in it is a single `*[other]`, because a
 *     Balochi noun after a numeral is unmarked. Its one `[one]` is in
 *     `field-function-wrong-num-outputs`, which forks on how many outputs a
 *     component needs rather than on how many of anything a reader has — the
 *     English message says "one output"/"two outputs" — so it is not a count
 *     select at all. Having the data does not oblige a catalog to fork on it.
 *   * **Ten of the fifteen write exactly that one `[one]` and no other**, for
 *     the same reason. `alt`, `kaa` and `kjh` write the same fork with the
 *     numeric literal `[1]` instead, which is matched against the number
 *     rather than against a category and so does not depend on whose rules the
 *     runtime picked; `ttt` omits the message.
 *   * **`sgh` is the only catalog in the batch that forks a real count**, and
 *     it has no rules of its own to do it with. English's rules select the
 *     branch, and it says the same thing as the `*[other]` beside it, so the
 *     reader sees Shughni either way. It is recorded rather than forbidden.
 *
 * Explicit numeric literals are a different mechanism — matched against the
 * number rather than against a category — and every catalog in the batch keeps
 * English's `[0]` branch, which the last block holds.
 */
describe("the Silk Road batch's plural categories", () => {
    /** Comment lines dropped: several headers discuss `[one]` in prose. */
    const branches = (catalog: string) =>
        catalog
            .split("\n")
            .filter((line) => !line.trimStart().startsWith("#"))
            .join("\n");

    /** `chrome.ftl` and `diagnostics.ftl` of one catalog, comments dropped. */
    const both = ([, chrome, diagnostics]: Row) =>
        `${branches(chrome)}\n${branches(diagnostics)}`;

    type Row = [string, string, string];

    /** The fourteen with no CLDR rules of their own. */
    const NO_RULES: Row[] = [
        ["crh", crhChrome, crhDiagnostics],
        ["gag", gagChrome, gagDiagnostics],
        ["ttt", tttChrome, tttDiagnostics],
        ["kaa", kaaChrome, kaaDiagnostics],
        ["kjh", kjhChrome, kjhDiagnostics],
        ["alt", altChrome, altDiagnostics],
        ["mzn", mznChrome, mznDiagnostics],
        ["glk", glkChrome, glkDiagnostics],
        ["lrc", lrcChrome, lrcDiagnostics],
        ["haz", hazChrome, hazDiagnostics],
        ["zza", zzaChrome, zzaDiagnostics],
        ["dng", dngChrome, dngDiagnostics],
        ["sgh", sghChrome, sghDiagnostics],
        ["wbl", wblChrome, wblDiagnostics],
    ];

    /** The one with them. */
    const BAL: Row = ["bal", balChrome, balDiagnostics];

    /** All fifteen, for the assertions that do not care about the split. */
    const SILK_ROAD: Row[] = [...NO_RULES, BAL];

    it.each(NO_RULES.map(([locale]) => locale))(
        "resolves %s against some other language's rules",
        (locale) => {
            // CLDR has no rules for the tag, so the categories on offer are
            // some other language's.
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
        },
    );

    /**
     * The exception, asserted as one. `bal` resolves to itself with the two
     * categories CLDR gives it — and forks on neither where a count is what is
     * being counted, which is the catalog's own decision and is pinned here so
     * that adding a count branch later is a deliberate change rather than a
     * drift.
     */
    it("resolves bal against its own CLDR rules, unlike the other fourteen", () => {
        const resolved = new Intl.PluralRules(BAL[0]).resolvedOptions();
        expect(resolved.locale).toBe("bal");
        expect([...resolved.pluralCategories].sort()).toEqual(["one", "other"]);
        // Its `chrome.ftl`, which is where the reader-facing counts live, has
        // no `[one]` at all…
        expect(branches(balChrome)).not.toContain("[one]");
        // …and the only one in the whole catalog forks the output count of a
        // function, not a quantity of anything the reader is looking at.
        expect(both(BAL).split("[one]")).toHaveLength(2);
        expect(branches(balDiagnostics)).toContain(
            "field-function-wrong-num-outputs",
        );
    });

    /**
     * Where `[one]` actually falls, asserted as a distribution rather than
     * described in prose. Ten catalogs write exactly one, in the one message
     * that forks on a fixed number of outputs; three write that same fork with
     * a numeric literal instead; `ttt` omits the message; and `sgh` is alone in
     * forking a real count.
     */
    it.each([
        "crh",
        "gag",
        "mzn",
        "glk",
        "lrc",
        "haz",
        "zza",
        "dng",
        "wbl",
        "bal",
    ])(
        "gives %s exactly one category branch, and not a count one",
        (locale) => {
            const row = SILK_ROAD.find(([tag]) => tag === locale)!;
            expect(both(row).split("[one]")).toHaveLength(2);
            expect(branches(row[1])).not.toContain("[one]");
        },
    );

    it.each([
        ["alt", altDiagnostics],
        ["kaa", kaaDiagnostics],
        ["kjh", kjhDiagnostics],
    ])(
        "has %s write the output fork as the numeric literal [1] instead",
        (locale, diagnostics) => {
            const row = SILK_ROAD.find(([tag]) => tag === locale)!;
            expect(both(row)).not.toContain("[one]");
            expect(branches(diagnostics)).toContain("[1]");
        },
    );

    it("leaves ttt without either, because it omits the message", () => {
        const row = SILK_ROAD.find(([tag]) => tag === "ttt")!;
        expect(both(row)).not.toContain("[one]");
        expect(branches(tttDiagnostics)).not.toContain(
            "field-function-wrong-num-outputs",
        );
    });

    /**
     * `sgh` is the mirror of `bal`: no rules of its own, and the one catalog in
     * the batch that forks a reader-facing count anyway. English's rules select
     * the branch at `count === 1`, and it says the same thing as the default
     * beside it, so the reader sees Shughni either way — which is why this is
     * recorded rather than forbidden.
     */
    it("selects sgh's one branch by the runtime default's rules", () => {
        expect(new Intl.PluralRules("sgh").resolvedOptions().locale) //
            .not.toBe("sgh");
        expect(branches(sghChrome)).toContain("[one]");
        // No other catalog of the fifteen has a `[one]` in `chrome.ftl`.
        for (const [locale, chrome] of SILK_ROAD) {
            if (locale !== "sgh") {
                expect(branches(chrome)).not.toContain("[one]");
            }
        }
        const t = createChromeTranslator("sgh", { sgh: sghChrome });
        expect(stripBidiIsolates(t("attempts-remaining", { count: 1 }))) //
            .toContain("1");
    });

    it.each(SILK_ROAD)(
        "still counts and still renders in %s",
        (locale, catalog) => {
            const t = createChromeTranslator(locale, { [locale]: catalog });
            // The count reaches the reader whatever categories exist: this is
            // the half that would break if a catalog dropped its default
            // branch while shedding the categories it could not use.
            for (const count of [1, 2, 5]) {
                expect(
                    stripBidiIsolates(t("attempts-remaining", { count })),
                ).toContain(String(count));
            }
        },
    );

    /**
     * The one selector all fifteen may still write, and do. `[0]` is matched
     * against the number rather than against a category, so it is unaffected
     * by whether CLDR has heard of the tag — and every catalog in the batch
     * keeps English's "no attempts remaining" branch, including `bal`, which
     * dropped the `one`/`other` split it could have used.
     */
    it.each(SILK_ROAD)(
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

describe("the Southeast Asian batch's plural categories", () => {
    /** Comment lines dropped: several headers discuss `[one]` in prose. */
    const branches = (catalog: string) =>
        catalog
            .split("\n")
            .filter((line) => !line.trimStart().startsWith("#"))
            .join("\n");

    type Row = [string, string, string];

    /** `chrome.ftl` and `diagnostics.ftl` of one catalog, comments dropped. */
    const both = (chrome: string, diagnostics: string) =>
        `${branches(chrome)}\n${branches(diagnostics)}`;

    /**
     * All fifteen, and — unlike the Silk Road batch, which had `bal` — there is
     * no sub-list here, because not one of the fifteen has CLDR plural data.
     */
    const SOUTHEAST_ASIA: Row[] = [
        ["bug", bugChrome, bugDiagnostics],
        ["mak", makChrome, makDiagnostics],
        ["bjn", bjnChrome, bjnDiagnostics],
        ["gor", gorChrome, gorDiagnostics],
        ["nia", niaChrome, niaDiagnostics],
        ["bbc", bbcChrome, bbcDiagnostics],
        ["iba", ibaChrome, ibaDiagnostics],
        ["dtp", dtpChrome, dtpDiagnostics],
        ["pag", pagChrome, pagDiagnostics],
        ["cbk", cbkChrome, cbkDiagnostics],
        ["tsg", tsgChrome, tsgDiagnostics],
        ["mrw", mrwChrome, mrwDiagnostics],
        ["shn", shnChrome, shnDiagnostics],
        ["mnw", mnwChrome, mnwDiagnostics],
        ["ksw", kswChrome, kswDiagnostics],
    ];

    it.each(SOUTHEAST_ASIA)(
        "resolves %s against some other language's rules",
        (locale) => {
            // CLDR has no rules for the tag, so the categories on offer belong
            // to the runtime's default locale rather than to the language.
            expect(new Intl.PluralRules(locale).resolvedOptions().locale) //
                .not.toBe(locale);
        },
    );

    /**
     * The whole batch writes no category branch at all — not even `[one]`,
     * which the Silk Road batch allowed itself in eleven of fifteen catalogs
     * and which `allowedPluralCategories` still permits a no-data locale.
     *
     * This is stricter than the lint requires, and it is a decision rather than
     * an accident: the one message that forks in English forks on how many
     * outputs a component *needs* rather than on a quantity the reader is
     * looking at, so every catalog here writes it as the numeric literal `[1]`,
     * which Fluent matches against the number before consulting any plural rule
     * and which therefore does not depend on whose rules the runtime picked.
     * Uniformity across a batch is worth something on its own: a reviewer who
     * finds a category branch in one of these files has found a drift rather
     * than a judgement call.
     */
    it.each(SOUTHEAST_ASIA)(
        "gives %s no plural category branch anywhere",
        (_locale, chrome, diagnostics) => {
            const text = both(chrome, diagnostics);
            for (const category of ["zero", "one", "two", "few", "many"]) {
                expect(text).not.toContain(`[${category}]`);
            }
        },
    );

    /**
     * The other half, which is what would fail if a catalog had answered the
     * rule above by dropping the fork instead of rewriting it. All fifteen keep
     * English's `[1]` fork in `field-function-wrong-num-outputs` — matched
     * against the number rather than against a category, and so legal in a
     * locale with no rules of its own.
     *
     * The `[1]` is looked for inside that one message rather than anywhere in
     * the file, since a stray literal elsewhere would otherwise stand in for
     * the fork this is about.
     */
    it.each(SOUTHEAST_ASIA)(
        "keeps %s's numeric literal, which no plural rule selects",
        (_locale, _chrome, diagnostics) => {
            const message = branches(diagnostics)
                .split("\nfield-function-wrong-num-outputs =")[1]
                ?.split(/\n(?=\S)/)[0];
            expect(message).toBeDefined();
            expect(message).toContain("[1]");
        },
    );

    /**
     * And the counts still render, which is the half that would break if a
     * catalog had answered "write no category branch" by dropping `{ $count }`
     * or its default branch rather than by rewriting the select. The zero case
     * is asserted through the renderer for the same reason: `[0]` is selected
     * by the number itself, so what matters is that it *reaches* the reader,
     * not that the literal appears in the file.
     */
    it.each(SOUTHEAST_ASIA)("still renders %s's counts", (locale, chrome) => {
        const t = createChromeTranslator(locale, { [locale]: chrome });
        for (const count of [1, 2, 5]) {
            expect(
                stripBidiIsolates(t("attempts-remaining", { count })),
            ).toContain(String(count));
        }
        expect(t("attempts-remaining", { count: 0 })).not.toBe(
            t("attempts-remaining", { count: 3 }),
        );
    });
});
