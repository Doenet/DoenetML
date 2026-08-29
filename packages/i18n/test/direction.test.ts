import { describe, expect, it } from "vitest";

import { directionOf, stripBidiIsolates } from "../src/direction";
import { PSEUDO_LOCALE, PSEUDO_RTL_LOCALE } from "../src/pseudo";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

/**
 * Arabic, Persian, Hebrew, Urdu, Pashto, Sindhi, Uyghur, Yiddish, Kashmiri,
 * Dhivehi and Central Kurdish — the seven #1614 existed to make renderable, the
 * one the European regional and minority batch added, the two the South Asian
 * batch added, the one the Caucasus and Kurdish batch added, and the whole of
 * it as of today.
 *
 * Written out rather than derived, so that the two tests below can hold it
 * from opposite sides: one says these tags are right-to-left whether or not a
 * catalog exists, the other says the roster contains exactly these and no
 * other right-to-left locale. None of the last four needed anything from
 * `direction.ts` — `yi`, `ks`, `dv` and `ckb` were all listed there already,
 * and Thaana was already in `RTL_SCRIPTS` — so this line is the only place
 * seeding them had to be recorded.
 *
 * `ku` is deliberately not here and is the pair worth reading beside `ckb`:
 * two catalogs of one macrolanguage, one Latin and left-to-right, the other
 * Perso-Arabic and right-to-left. Direction is a fact about a script rather
 * than about a language, which is why `direction.ts` keys on the script and
 * why `ku` needed no entry there either.
 */
const RTL_LANGUAGES = [
    "ar",
    "fa",
    "he",
    "ur",
    "ps",
    "sd",
    "ug",
    "yi",
    "ks",
    "dv",
    "ckb",
];

describe("directionOf", () => {
    it("reports the right-to-left languages the roster ships catalogs for", () => {
        // Asserted by tag rather than off the roster: this is a claim about
        // the languages, and it holds for a tag with no catalog too.
        for (const tag of RTL_LANGUAGES) {
            expect(directionOf(tag), tag).toBe("rtl");
        }
    });

    it("agrees with the roster about which shipped catalogs run right to left", () => {
        // Not an assertion about the world — a statement about today's roster,
        // held from both sides so that adding a catalog has to say which way
        // it runs. `dir` stopped being inert the moment these acquired
        // catalogs of their own.
        const rtl = new Set(RTL_LANGUAGES);
        for (const { locale } of SUPPORTED_LOCALES) {
            expect(directionOf(locale), locale).toBe(
                rtl.has(locale) ? "rtl" : "ltr",
            );
        }
        for (const locale of RTL_LANGUAGES) {
            expect(
                SUPPORTED_LOCALES.some((info) => info.locale === locale),
                locale,
            ).toBe(true);
        }
    });

    it("follows the script rather than the language", () => {
        // The reason direction is keyed on script: these languages are written
        // in both, and the tag says which.
        expect(directionOf("pa-Guru")).toBe("ltr");
        expect(directionOf("pa-Arab")).toBe("rtl");
        expect(directionOf("ku-Latn")).toBe("ltr");
        expect(directionOf("ku-Arab")).toBe("rtl");
    });

    it("resolves a region- or script-qualified tag the way the bare one goes", () => {
        expect(directionOf("ar-EG")).toBe("rtl");
        expect(directionOf("ar-Arab-EG")).toBe("rtl");
        expect(directionOf("he-IL")).toBe("rtl");
        expect(directionOf("en-GB")).toBe("ltr");
    });

    it("normalizes case, because `lang` is typed by hand", () => {
        expect(directionOf("AR")).toBe("rtl");
        expect(directionOf("he-il")).toBe("rtl");
        expect(directionOf("ES-mx")).toBe("ltr");
    });

    it("answers for a tag `Intl.Locale` cannot parse", () => {
        // `normalizeLocaleTag` passes these through untouched rather than
        // rejecting them, so direction has to cope with whatever survives.
        expect(directionOf("he_IL")).toBe("rtl");
        expect(directionOf("ar_Arab_EG")).toBe("rtl");
        expect(directionOf("en_US")).toBe("ltr");
    });

    it("defaults to left-to-right for nonsense and for nothing at all", () => {
        expect(directionOf("")).toBe("ltr");
        expect(directionOf("   ")).toBe("ltr");
        expect(directionOf("!!!")).toBe("ltr");
        expect(directionOf("not-a-language")).toBe("ltr");
    });

    it("makes the two pseudo-locales differ in direction and nothing else", () => {
        // Both are `en-…`, so neither resolves from its script. The carve-out
        // is what the right-to-left pseudo-locale is.
        expect(directionOf(PSEUDO_LOCALE)).toBe("ltr");
        expect(directionOf(PSEUDO_RTL_LOCALE)).toBe("rtl");
        expect(directionOf("en-xb")).toBe("rtl");
    });
});

describe("stripBidiIsolates", () => {
    it("removes Fluent's isolation marks", () => {
        expect(stripBidiIsolates("Show \u20683\u2069 responses")).toBe(
            "Show 3 responses",
        );
    });

    it("removes the directional marks the RTL pseudo-locale adds", () => {
        expect(stripBidiIsolates("\u200F»Çórréçţ«\u200F")).toBe("»Çórréçţ«");
    });

    it("leaves text carrying none of them untouched", () => {
        expect(stripBidiIsolates("Max credit available: 80%")).toBe(
            "Max credit available: 80%",
        );
    });
});
