import { PSEUDO_RTL_LOCALE } from "./pseudo";

/** The writing direction of a locale's text. */
export type Direction = "ltr" | "rtl";

/**
 * Scripts written right to left.
 *
 * Keyed on the ISO 15924 code, because that is what actually decides direction:
 * a language is written in whatever script it is written in, and several are
 * written in more than one. `pa` is left-to-right in Gurmukhi and right-to-left
 * in Arabic; `ku` is left-to-right in Latin and right-to-left in Arabic. Asking
 * the script rather than the language gets both right without enumerating the
 * pairs.
 *
 * Includes the historic scripts CLDR marks RTL as well as the living ones. They
 * cost a set entry each and mean an unusual but valid tag resolves rather than
 * silently rendering the wrong way round.
 */
const RTL_SCRIPTS = new Set([
    "Adlm", // Adlam
    "Arab", // Arabic
    "Aran", // Nastaliq
    "Armi", // Imperial Aramaic
    "Avst", // Avestan
    "Cprt", // Cypriot
    "Egyp", // Egyptian hieroglyphs
    "Elym", // Elymaic
    "Gara", // Garay
    "Hatr", // Hatran
    "Hebr", // Hebrew
    "Hung", // Old Hungarian
    "Khar", // Kharoshthi
    "Lydi", // Lydian
    "Mand", // Mandaic
    "Mani", // Manichaean
    "Mend", // Mende Kikakui
    "Merc", // Meroitic cursive
    "Mero", // Meroitic hieroglyphs
    "Narb", // Old North Arabian
    "Nbat", // Nabataean
    "Nkoo", // NKo
    "Orkh", // Old Turkic
    "Palm", // Palmyrene
    "Phli", // Inscriptional Pahlavi
    "Phlp", // Psalter Pahlavi
    "Phnx", // Phoenician
    "Prti", // Inscriptional Parthian
    "Rohg", // Hanifi Rohingya
    "Samr", // Samaritan
    "Sarb", // Old South Arabian
    "Sogd", // Sogdian
    "Sogo", // Old Sogdian
    "Syrc", // Syriac
    "Thaa", // Thaana
    "Todr", // Todhri
    "Yezi", // Yezidi
]);

/**
 * Languages whose default script is right-to-left, for the fallback path.
 *
 * Only consulted when the script cannot be derived — a tag `Intl.Locale`
 * refuses to parse, or an engine whose `maximize()` adds no script. A language
 * whose default script is left-to-right is absent even if it has a
 * right-to-left variant, because that variant names its script explicitly and
 * is caught by {@link RTL_SCRIPTS} instead.
 *
 * `iw` and `ji` are the retired codes for Hebrew and Yiddish; `Intl.Locale`
 * canonicalizes them, but the fallback path runs precisely when it did not.
 */
const RTL_LANGUAGES = new Set([
    "ae", // Avestan
    "ar", // Arabic
    "arc", // Aramaic
    "bal", // Balochi
    "bcc", // Southern Balochi
    "bqi", // Bakhtiari
    "brh", // Brahui
    "ckb", // Central Kurdish
    "dv", // Divehi
    "fa", // Persian
    "glk", // Gilaki
    "haz", // Hazaragi
    "he", // Hebrew
    "iw", // Hebrew (retired)
    "ji", // Yiddish (retired)
    "khw", // Khowar
    "ks", // Kashmiri
    "lrc", // Northern Luri
    "mzn", // Mazanderani
    "nqo", // NKo
    "pnb", // Western Punjabi
    "prs", // Dari
    "ps", // Pashto
    "sd", // Sindhi
    "skr", // Saraiki
    "ug", // Uyghur
    "ur", // Urdu
    "yi", // Yiddish
]);

/**
 * Languages whose catalog here is written in a script that is not the one CLDR
 * considers likely for them.
 *
 * Consulted **only** when the tag itself names no script, and only for the
 * language subtag — a host that writes `lad-Hebr` means Hebrew script and gets
 * right-to-left, exactly as it asked.
 *
 * `lad` is the entry, and it is not an edge case dressed up as one. CLDR
 * maximizes Ladino to `lad-Hebr`, which is historically right: Judeo-Spanish
 * was written in Hebrew letters — square, Rashi and solitreo — for four
 * centuries. `locales/lad` is written in the **Latin** Aki Yerushalayim
 * orthography instead, because that is what a Ladino reader meets today, and
 * its header says so. Without this table `directionOf("lad")` would answer
 * `"rtl"` off CLDR's likely script and the viewer would lay out a Latin
 * catalog right to left: every line of a Ladino activity reversed, and
 * punctuation on the wrong end of it.
 *
 * The general rule this states is that direction has to follow **the script
 * the text is actually in**, and for a bare tag this repository is the one
 * that decided which script that is. So the table is keyed on the same fact a
 * catalog's header records, and an entry belongs here whenever a catalog is
 * written in a script CLDR would not have guessed — not whenever a language
 * merely has more than one script.
 *
 * Nothing else on the roster is in this position: `lad` is the only catalog
 * whose maximized script disagrees with the script its own files are written
 * in. `direction.test.ts` holds that by counting the letters in every
 * catalog's message values, so a future batch that adds such a catalog fails
 * rather than renders backwards.
 */
const CATALOG_SCRIPTS = new Map([
    ["lad", "Latn"], // Ladino, in the Latin Aki Yerushalayim orthography
]);

/**
 * The direction a locale's text is written in.
 *
 * Answers for *any* BCP-47 tag, not only the ones this repository ships a
 * catalog for: `lang` accepts whatever an author types, and
 * `<document lang="ar">` has to lay out right-to-left whether or not
 * `locales/ar/` exists. That is why direction is computed rather than recorded
 * beside the catalogs.
 *
 * Deliberately not `Intl.Locale.prototype.getTextInfo()`. It is too new to rely
 * on, and it throws on exactly the tags `normalizeLocaleTag` is written to pass
 * through untouched — a POSIX-style `en_US`, or anything else hand-typed into a
 * `lang` attribute. A tag nothing can parse must still get an answer, and the
 * safe answer is the default.
 *
 * @param tag A BCP-47 tag. Anything unrecognized resolves to `"ltr"`.
 */
export function directionOf(tag: string): Direction {
    const trimmed = tag.trim();
    if (trimmed === "") {
        return "ltr";
    }

    // The right-to-left pseudo-locale first, and only it: `en-XB` is an `en-…`
    // tag, so every route below would resolve it from the Latin script and
    // report it left-to-right. `en-XA` needs no carve-out, because that is
    // already the answer it wants.
    if (trimmed.toLowerCase() === PSEUDO_RTL_LOCALE.toLowerCase()) {
        return "rtl";
    }

    try {
        const locale = new Intl.Locale(trimmed);
        // A script the tag names itself wins outright: `lad-Hebr` is Hebrew
        // script whatever this repository's own catalog is written in.
        //
        // Otherwise `maximize` fills in the script CLDR considers likely for
        // the language, which is what makes a bare `ar` or `he` resolve
        // without listing it: `ar` maximizes to `ar-Arab-EG`. {@link
        // CATALOG_SCRIPTS} overrides that guess for the languages whose
        // catalog here is written in some other script.
        const script =
            locale.script ??
            CATALOG_SCRIPTS.get(locale.language ?? "") ??
            locale.maximize().script;
        if (script) {
            return RTL_SCRIPTS.has(script) ? "rtl" : "ltr";
        }
        return RTL_LANGUAGES.has(locale.language ?? "") ? "rtl" : "ltr";
    } catch {
        return directionFromRawSubtags(trimmed);
    }
}

/**
 * Read direction off a tag `Intl.Locale` would not accept.
 *
 * Splits on both `-` and `_` so a POSIX-style `he_IL` resolves the way `he-IL`
 * does. A four-letter subtag is a script and decides on its own; otherwise the
 * primary language subtag does.
 */
function directionFromRawSubtags(tag: string): Direction {
    const subtags = tag.split(/[-_]/);
    for (const subtag of subtags.slice(1)) {
        if (/^[A-Za-z]{4}$/.test(subtag)) {
            const script =
                subtag[0].toUpperCase() + subtag.slice(1).toLowerCase();
            return RTL_SCRIPTS.has(script) ? "rtl" : "ltr";
        }
    }
    const language = subtags[0].toLowerCase();
    // The same override the parseable path applies, for the same reason: a
    // hand-typed `lad_TR` must not lay out backwards either.
    const catalogScript = CATALOG_SCRIPTS.get(language);
    if (catalogScript !== undefined) {
        return RTL_SCRIPTS.has(catalogScript) ? "rtl" : "ltr";
    }
    return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
}

/**
 * Unicode formatting characters that carry direction but render no glyph.
 *
 * The isolates U+2066–U+2069 are what Fluent wraps placeables in when
 * `useIsolating` is on; the marks U+200E/U+200F are what the right-to-left
 * pseudo-locale puts against its brackets. Spelled as escapes because written
 * literally the character class would look empty.
 */
const BIDI_FORMATTING_CHARACTERS = /[\u2066-\u2069\u200E\u200F]/g;

/**
 * Strip the invisible bidi formatting characters from rendered text.
 *
 * For assertions. Isolation marks live in `textContent`, survive `trim()`, and
 * break `===` and `includes()` while being invisible in a failure diff — so a
 * test that wants to compare a translated string as plain text has to remove
 * them explicitly rather than discover them.
 *
 * Not for anything at runtime. A surface that must not carry these characters
 * should be built by a translator that never adds them; stripping after the
 * fact would only hide that it was the wrong translator.
 */
export function stripBidiIsolates(text: string): string {
    return text.replace(BIDI_FORMATTING_CHARACTERS, "");
}
