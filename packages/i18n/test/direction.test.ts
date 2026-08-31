import { describe, expect, it } from "vitest";

import fs from "node:fs";
import path from "node:path";

import { directionOf, stripBidiIsolates } from "../src/direction";
import { PSEUDO_LOCALE, PSEUDO_RTL_LOCALE } from "../src/pseudo";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

/**
 * Arabic, Persian, Hebrew, Urdu, Pashto, Sindhi, Uyghur, Yiddish, Kashmiri,
 * Dhivehi, Central Kurdish and the Silk Road batch's five — the seven #1614
 * existed to make renderable, the one (`yi`) the early European regional and
 * minority batch added — not the later fifteen-catalog European regional
 * batch, which added none — the two the South Asian batch added, the one the
 * Caucasus and Kurdish batch added, the five below, and the whole of it as of
 * today.
 *
 * Written out rather than derived, so that the two tests below can hold it
 * from opposite sides: one says these tags are right-to-left whether or not a
 * catalog exists, the other says the roster contains exactly these and no
 * other right-to-left locale. None of the last four needed anything from
 * `direction.ts` — `yi`, `ks`, `dv` and `ckb` were all listed there already,
 * and Thaana was already in `RTL_SCRIPTS` — so this line is the only place
 * seeding them had to be recorded.
 *
 * The Silk Road batch adds five at once — five Iranian languages written in
 * the Perso-Arabic script, four of them beside `locales/fa` and taking much of
 * their technical vocabulary from it, while `locales/bal` takes its letters
 * and its loans from Urdu instead. That takes the roster's right-to-left
 * catalogs from eleven to sixteen. A right-to-left language that is neither
 * Arabic nor Persian is nothing new here: `ug` is Turkic, `yi` Germanic and
 * `ckb` Iranian but not Persian.
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
    // The Silk Road batch's five, which take the roster's right-to-left
    // catalogs from eleven to sixteen and split two ways over what
    // `direction.ts` had to learn. `mzn`, `glk` and `lrc` were already in its
    // `RTL_LANGUAGES` — listed there long before a catalog existed, because
    // `lang` answers for any tag — so seeding them cost that file nothing. `bal` and `haz` are
    // new to it, and they are new for the *fallback* path only: both maximize
    // to `-Arab`, so the script rule already answered them, and the entries
    // matter on the path where a tag cannot be parsed at all.
    "mzn",
    "glk",
    "lrc",
    "bal",
    "haz",
    // The second South Asian batch's two, which take the roster's
    // right-to-left catalogs from sixteen to eighteen. Both are Perso-Arabic
    // and both are new to `RTL_LANGUAGES` in `direction.ts`, on the same terms
    // `bal` and `haz` were: each maximizes to `-Arab`, so the script rule
    // already answered a parseable tag, and the entry earns its keep only on
    // the fallback path where nothing could be parsed.
    //
    // `brh` is the pair worth reading beside `skr`: Brahui is Dravidian and
    // Saraiki Indo-Aryan, and they run the same way because they are written
    // in the same script. That is the `ug`/`yi`/`ckb` point reaching a family
    // the roster's right-to-left half had never included.
    "skr",
    "brh",
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

    /**
     * The path `bal` and `haz` were added to {@link RTL_LANGUAGES} for, and
     * the only path on which those two entries are load-bearing.
     *
     * Both tags maximize to `-Arab`, so every parseable spelling of them is
     * already answered by the script rule one branch earlier — which means a
     * test written against `bal` or `haz-AF` would pass with the entries
     * deleted. A tag `Intl.Locale` throws on never reaches `maximize()` at
     * all, and the raw-subtag fallback has nothing but the language subtag to
     * go on. These rows are therefore what fails if either entry is removed.
     */
    it("reads the batch's two new fallback languages off an unparseable tag", () => {
        expect(directionOf("bal_PK")).toBe("rtl");
        expect(directionOf("haz_AF")).toBe("rtl");
        // The same tags in a spelling `Intl.Locale` accepts are answered by
        // the script rule instead, so these hold either way — which is the
        // reason the rows above exist rather than only these.
        expect(directionOf("bal")).toBe("rtl");
        expect(directionOf("haz")).toBe("rtl");
        // And a Latin-script neighbour of each, to show the fallback is
        // reading the language rather than defaulting everything to `rtl`.
        expect(directionOf("crh_UA")).toBe("ltr");
        expect(directionOf("zza_TR")).toBe("ltr");
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

/**
 * Direction against the characters the catalogs are actually written in.
 *
 * Every test above asks `directionOf` about a tag. This one asks the files:
 * for each locale on the roster it reads the *values* of the messages — not
 * the ids, which are ASCII in every catalog, and not the header comments,
 * which are written in English and quote words in the language — counts the
 * letters belonging to right-to-left scripts against the letters belonging to
 * left-to-right ones, and requires the majority to agree with what
 * `directionOf` reports for the locale.
 *
 * This is the check that catches the failure no tag-level test can see: a
 * catalog whose language CLDR considers right-to-left, written here in a
 * left-to-right script, or the reverse. `lad` was exactly that and is the
 * reason this test exists — see below.
 */
describe("a catalog's script and its locale's direction", () => {
    const localesDir = path.join(__dirname, "..", "locales");

    /** Hebrew, Arabic and the other right-to-left blocks this roster uses. */
    const RTL_LETTERS = /[\u0590-\u08FF\uFB1D-\uFDFF\uFE70-\uFEFF]/g;
    /** Latin, Greek, Cyrillic and the left-to-right blocks it uses. */
    const LTR_LETTERS =
        /[A-Za-z\u00C0-\u024F\u0370-\u052F\u0900-\u0DFF\u1000-\u109F\u10A0-\u10FF\u1200-\u137F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/g;

    /**
     * The text a reader would see, and nothing else: the right-hand side of
     * every `=`, with placeables removed (`{ $count }` is ASCII in every
     * catalog) and comment lines dropped.
     */
    function renderedLetters(locale: string): { rtl: number; ltr: number } {
        const values: string[] = [];
        for (const namespace of [
            "chrome",
            "content",
            "diagnostics",
            "editor",
        ]) {
            const file = path.join(localesDir, locale, `${namespace}.ftl`);
            if (!fs.existsSync(file)) {
                continue;
            }
            for (const line of fs.readFileSync(file, "utf-8").split("\n")) {
                if (line.trim().startsWith("#") || line.trim() === "") {
                    continue;
                }
                const equals = line.indexOf("=");
                if (equals < 0) {
                    continue;
                }
                values.push(line.slice(equals + 1).replace(/\{[^}]*\}/g, ""));
            }
        }
        const text = values.join("\n");
        return {
            rtl: (text.match(RTL_LETTERS) ?? []).length,
            ltr: (text.match(LTR_LETTERS) ?? []).length,
        };
    }

    it.each(SUPPORTED_LOCALES.map((info) => info.locale))(
        "writes %s in a script matching the direction reported for it",
        (locale) => {
            const { rtl, ltr } = renderedLetters(locale);
            expect(rtl + ltr).toBeGreaterThan(0);
            expect(rtl > ltr ? "rtl" : "ltr").toBe(directionOf(locale));
        },
    );

    /**
     * Ladino, held explicitly, because it is the one catalog on the roster
     * whose script disagrees with CLDR's guess and the reason
     * `CATALOG_SCRIPTS` exists in `direction.ts`.
     *
     * `lad` maximizes to `lad-Hebr`: Judeo-Spanish was written in Hebrew
     * letters for four centuries and CLDR records that. `locales/lad` is
     * written in the Latin Aki Yerushalayim orthography, which is what a
     * Ladino reader meets today. Without the override the viewer would lay a
     * Latin catalog out right to left — the property above is what would have
     * failed, and these three rows say why.
     */
    it("lays Ladino out left to right, against CLDR's likely script", () => {
        expect(new Intl.Locale("lad").maximize().script).toBe("Hebr");
        expect(directionOf("lad")).toBe("ltr");
        // A host that names the historic script means it and gets it.
        expect(directionOf("lad-Hebr")).toBe("rtl");
    });
});
