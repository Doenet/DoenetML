import { negotiateLanguages } from "@fluent/langneg";

import { DEFAULT_LOCALE } from "./catalogs";

export type NegotiateLocalesOptions = {
    /**
     * Locale that terminates every chain. Defaults to `"en"`, the only locale
     * guaranteed to be bundled.
     */
    defaultLocale?: string;
};

/**
 * Language subtags a request may arrive under that no catalog is named after.
 *
 * `Intl.getCanonicalLocales` already rewrites the deprecated codes a browser
 * might still send — `iw` to `he`, `in` to `id`, `mo` to `ro` — so only the
 * ones it leaves alone are listed here.
 *
 * `no` is the macrolanguage covering both written Norwegians, and `nb` is the
 * one of the two with a catalog. It is also what a hand-typed
 * `<document lang="no">` says, and what several browsers still send. Filtering
 * negotiation matches on the language subtag, so `no` reaches nothing at all
 * and would fall to English with nothing to say why. `nn` is deliberately
 * absent: Nynorsk is a written standard of its own, and answering it with
 * Bokmål would be a substitution rather than a canonicalization.
 *
 * `tw` is the retired ISO 639-1 code for Twi, and `ak` — Akan, which Twi is a
 * variety of — is the catalog it should reach. `Intl.getCanonicalLocales`
 * leaves `tw` alone, so without this entry a hand-typed `<document lang="tw">`
 * falls to English. `fat` is deliberately absent: Fante is a written standard
 * of its own and `locales/ak` is written in Asante Twi, so answering Fante
 * with it would be the substitution `nn` is kept out for.
 *
 * Everything below `MACROLANGUAGE_MEMBERS` is there for a reason the entries
 * above did not raise, and it is worth stating once: **CLDR's likely-subtags
 * folds exactly one member of a macrolanguage to it, and leaves the rest
 * unresolvable.** `quz` reaches `qu` and `quh` does not; `ojg` reaches `oj` and
 * `ojb` does not; `gug` reaches `gn` and `gui` does not. So a Bolivian Quechua
 * reader arriving under `quh` was getting English with a `qu` catalog sitting
 * right there, which is the failure this map exists to prevent. It surfaced when
 * the Americas batch became the first to seed macrolanguages at scale, and it is
 * asserted from both sides in `negotiate.test.ts`.
 *
 * The rule is ISO 639-3's own macrolanguage membership, not a judgement about
 * how close two varieties are — which is what makes it checkable rather than a
 * matter of taste, and what distinguishes it from the `nn` and `fat` cases
 * above. Those two are *not* members of `nb` and `ak`; every code below is a
 * member of the macrolanguage it maps to.
 *
 * Serving a related variety is a real compromise, and each of these catalogs
 * says in its own header which written standard it is — Southern Quechua,
 * Paraguayan Guarani, Central Nahuatl, the Fiero orthography. A reader who wants
 * their own supplies it as `localeResources`. What this map buys is that they
 * get a language they can read rather than English, which is the same trade
 * region-stripping already makes for `es-MX`.
 */
const LANGUAGE_ALIASES: Record<string, string> = { no: "nb", tw: "ak" };

/**
 * ISO 639-3 macrolanguage members, folded onto the macrolanguage this repository
 * names a catalog after. See {@link LANGUAGE_ALIASES} for why this is needed at
 * all and why membership rather than similarity is the rule.
 *
 * Only the macrolanguages with catalogs are listed. The one member CLDR already
 * folds is included anyway — `quz`, `ojg`, `gug`, `ayr` — so that the table
 * reads as the whole of a macrolanguage rather than as the leftovers of one, and
 * so that a change in ICU data cannot silently drop a code out of coverage.
 */
const MACROLANGUAGE_MEMBERS: Record<string, readonly string[]> = {
    // Quechuan. The catalog is Southern Quechua (Cusco-Collao); the Central and
    // Northern varieties and Ecuadorian Kichwa are all members and all reach it.
    qu: [
        "qub",
        "qud",
        "quf",
        "qug",
        "quh",
        "quk",
        "qul",
        "qup",
        "qur",
        "qus",
        "quw",
        "qux",
        "quy",
        "quz",
        "qva",
        "qvc",
        "qve",
        "qvh",
        "qvi",
        "qvj",
        "qvl",
        "qvm",
        "qvn",
        "qvo",
        "qvp",
        "qvs",
        "qvw",
        "qvz",
        "qwa",
        "qwc",
        "qwh",
        "qws",
        "qxa",
        "qxc",
        "qxh",
        "qxl",
        "qxn",
        "qxo",
        "qxp",
        "qxr",
        "qxt",
        "qxu",
        "qxw",
    ],
    // Aymaran.
    ay: ["ayc", "ayr"],
    // Guaranian. The catalog is Paraguayan Guarani.
    gn: ["gnw", "gug", "gui", "gun", "nhd"],
    // Nahuatl. The catalog is Central Nahuatl.
    nah: [
        "azz",
        "nch",
        "nci",
        "ncj",
        "ncl",
        "ncx",
        "ngu",
        "nhc",
        "nhe",
        "nhg",
        "nhi",
        "nhk",
        "nhm",
        "nhn",
        "nhp",
        "nhq",
        "nht",
        "nhv",
        "nhw",
        "nhx",
        "nhy",
        "nhz",
        "nlv",
        "npl",
        "nsu",
        "nuz",
    ],
    // Ojibwa. The catalog is in the Fiero double-vowel orthography.
    oj: ["alq", "ojb", "ojc", "ojg", "ojs", "ojw", "otw"],
};

/** Flattened once at module load rather than searched per request. */
const MACROLANGUAGE_ALIASES: Record<string, string> = Object.fromEntries(
    Object.entries(MACROLANGUAGE_MEMBERS).flatMap(([macro, members]) =>
        members.map((member) => [member, macro]),
    ),
);

/** Rewrite a request's language subtag if it is one no catalog is named after. */
function applyLanguageAlias(tag: string): string {
    const [language, ...rest] = tag.split("-");
    const lowered = language.toLowerCase();
    const alias = LANGUAGE_ALIASES[lowered] ?? MACROLANGUAGE_ALIASES[lowered];
    return alias === undefined ? tag : [alias, ...rest].join("-");
}

/**
 * Build a fallback chain from what the host asked for and what actually
 * exists.
 *
 * `negotiateLocales(["es-MX"], ["es", "en"])` → `["es", "en"]`;
 * `negotiateLocales(["es-MX"], ["es-MX", "es", "en"])` → the full three-step
 * chain. The default locale is always appended, so the chain never ends
 * somewhere a lookup could fall off.
 *
 * @param requested BCP-47 tags in the host's order of preference. A tag whose
 *   language subtag is one no catalog is named after is rewritten first; see
 *   {@link LANGUAGE_ALIASES}.
 * @param available Locales with catalogs on hand.
 */
export function negotiateLocales(
    requested: string[],
    available: string[],
    options: NegotiateLocalesOptions = {},
): string[] {
    const { defaultLocale = DEFAULT_LOCALE } = options;

    // `negotiateLanguages` only ever returns locales from `available`, so the
    // default has to be offered for it to be able to terminate the chain.
    const availableWithDefault = available.includes(defaultLocale)
        ? available
        : [...available, defaultLocale];

    return negotiateLanguages(
        requested.map(applyLanguageAlias),
        availableWithDefault,
        {
            strategy: "filtering",
            defaultLocale,
        },
    );
}

/**
 * Apply the document-locale precedence rule: an authored `<document lang>`
 * beats the locale the hosting page asked for, which beats English. A blank
 * tag counts as unset, so a hand-typed `lang=" "` falls through to the host's.
 *
 * The author knows what language they wrote the content in; the host only
 * knows what language it would prefer to receive — hence the precedence.
 *
 * Shared by the main thread and the worker, so the language the core
 * translates into, the `document.locale` an author reads, and the `lang`
 * attribute the viewer renders all come out of one rule rather than three
 * copies of it.
 *
 * Nothing needs to tell "English" apart from "nobody said so": English is the
 * language the core computes an undeclared document's prose in, so it is the
 * language such a document is in — which is what the viewer's `lang` attribute
 * reports.
 *
 * @param authoredLang The `lang` on `<document>`, if the author wrote one.
 * @param hostLocale The `documentLocale` the hosting page asked for, if any.
 */
export function resolveDocumentLocale(
    authoredLang: string | null | undefined,
    hostLocale: string | null | undefined,
): string {
    const declared = (authoredLang ?? "").trim() || (hostLocale ?? "").trim();
    return normalizeLocaleTag(declared) || DEFAULT_LOCALE;
}

/**
 * Apply the UI-locale precedence rule: an explicitly configured `uiLocale`
 * beats the language of the content.
 *
 * The chrome follows the content by default, so a fully Spanish activity is
 * fully Spanish without the host configuring anything. A host overrides it
 * only when the reader's language genuinely differs from the content's — a
 * Spanish-speaking student working a French physics problem. A blank tag
 * counts as unset, and the result is normalized, so the chrome's locale
 * negotiates exactly the way the content's does.
 *
 * @param uiLocale What the host configured, if anything.
 * @param documentLocale The content locale to follow, already resolved by
 *   {@link resolveDocumentLocale}.
 */
export function resolveUiLocale(
    uiLocale: string | null | undefined,
    documentLocale: string,
): string {
    return normalizeLocaleTag(uiLocale ?? "") || documentLocale;
}

/**
 * Normalize a BCP-47 tag to the casing Fluent and `Intl` expect
 * (`es-mx` → `es-MX`), leaving anything unparseable alone.
 *
 * Authors type `lang` by hand, so `<document lang="ES-mx">` has to negotiate
 * the same as `es-MX`.
 */
export function normalizeLocaleTag(tag: string): string {
    const trimmed = tag.trim();
    if (trimmed === "") {
        return trimmed;
    }
    try {
        return new Intl.Locale(trimmed).toString();
    } catch {
        return trimmed;
    }
}
