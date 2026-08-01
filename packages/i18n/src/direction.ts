import { PSEUDO_LOCALE, PSEUDO_RTL_LOCALE } from "./pseudo";

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
    "bcc", // Southern Balochi
    "bqi", // Bakhtiari
    "ckb", // Central Kurdish
    "dv", // Divehi
    "fa", // Persian
    "glk", // Gilaki
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
    "ug", // Uyghur
    "ur", // Urdu
    "yi", // Yiddish
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

    // The pseudo-locales first: both are `en-…`, so every route below would
    // report them left-to-right. `en-XB` exists to be the exception.
    const lower = trimmed.toLowerCase();
    if (lower === PSEUDO_RTL_LOCALE.toLowerCase()) {
        return "rtl";
    }
    if (lower === PSEUDO_LOCALE.toLowerCase()) {
        return "ltr";
    }

    try {
        const locale = new Intl.Locale(trimmed);
        // `maximize` fills in the script CLDR considers likely for the
        // language, which is what makes a bare `ar` or `he` resolve without
        // listing it: `ar` maximizes to `ar-Arab-EG`.
        const script = locale.maximize().script ?? locale.script;
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
    return RTL_LANGUAGES.has(subtags[0].toLowerCase()) ? "rtl" : "ltr";
}

/**
 * Unicode formatting characters that carry direction but render no glyph.
 *
 * The isolates U+2066–U+2069 are what Fluent wraps placeables in when
 * `useIsolating` is on; the marks U+200E/U+200F are what the right-to-left
 * pseudo-locale puts inside its brackets.
 */
const BIDI_FORMATTING_CHARACTERS = /[⁦-⁩‎‏]/g;

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
