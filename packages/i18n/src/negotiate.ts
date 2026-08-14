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
 * `man` is the ISO 639-3 macrolanguage over the Manding varieties, and it is
 * the first one this repository has catalogs for *members* of rather than for
 * the macrolanguage itself: `bm`, `dyu` and `mnk` are all members, so
 * {@link MACROLANGUAGE_MEMBERS} — which folds a member onto the wider code —
 * has nothing to fold `man` onto and cannot answer it. Which of the three a
 * bare `man` should reach is CLDR's decision rather than one made here:
 * `new Intl.Locale("man").maximize()` is `man-Latn-GM`, the Gambia, which is
 * Mandinka's country. `emk` (Eastern Maninkakan) reaches the same place, since
 * `Intl.getCanonicalLocales` folds it to `man` before this entry is consulted.
 *
 * A member code of a macrolanguage is otherwise handled by
 * {@link MACROLANGUAGE_MEMBERS}: there are hundreds of them, and membership is a
 * published fact rather than a judgement made here.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
    no: "nb",
    tw: "ak",
    man: "mnk",
};

/**
 * Individual-language codes folded onto the wider code this repository names a
 * catalog after.
 *
 * **CLDR's likely-subtags folds exactly one member of a macrolanguage to it and
 * leaves the rest unresolvable.** `quz` reaches `qu` and `quh` does not; `ojg`
 * reaches `oj` and `ojb` does not; `gug` reaches `gn` and `gui` does not. So a
 * Bolivian Quechua reader arriving under `quh` was served English with a `qu`
 * catalog sitting right there, which is the failure this map exists to prevent.
 * `negotiate.test.ts` asserts both halves — the member CLDR folds on its own and
 * several it does not — so removing the map, or a change in ICU data, fails
 * there.
 *
 * The rule is published membership rather than a judgement about how close two
 * varieties are, which is what makes it checkable and what distinguishes it from
 * the `nn` and `fat` cases in {@link LANGUAGE_ALIASES}: neither of those is a
 * member of `nb` or `ak`, and both are deliberately left to miss. Thirteen of
 * the sixteen keys — `qu`, `ay`, `gn`, `oj`, `bik`, `kok`, `doi`, `ff`, `kr`,
 * `kg`, `bua`, `kv`, `chm` — are ISO 639-3 macrolanguages and list their
 * macrolanguage members; `nah` is an ISO 639-3 **collection** code rather than a
 * macrolanguage, so it lists the individual Nahuan languages ISO 639-5 groups
 * under it; and `mnk` and `dje` are neither, being *members* — of `man` and
 * `son` respectively — that this repository happens to name catalogs after.
 * Those two are the shape {@link LANGUAGE_ALIASES}'s `man` entry explains, and
 * it is why the members listed under `mnk` exclude `bam` and `dyu`: those two
 * have catalogs of their own, and folding them here would serve a Bambara
 * reader Mandinka.
 *
 * The two member cases part company over their macrolanguage, and the reason
 * is CLDR rather than a preference: `man` is aliased onto `mnk` because
 * `Intl.Locale#maximize` gives it a region and so decides which member it
 * means, while `son` is left to miss because it maximizes to nothing.
 *
 * The one member CLDR already folds is included anyway — `quz`, `ojg`, `gug`,
 * `ayr`, `bcl`, `gom`, `dgo`, `fuc`, `knc`, `bxr`, `kpv`, `mhr` — so that each
 * list reads as the whole of a group rather than as the leftovers of one, and
 * so that a change in ICU data cannot silently drop a code out of coverage.
 * `mnk`'s list carries `emk` for the same reason, though what ICU folds `emk`
 * to is `man` rather than `mnk`.
 *
 * Serving a related variety is a real compromise, and each of these catalogs
 * says in its own header which written standard it is — Southern Quechua,
 * Paraguayan Guarani, Central Nahuatl, the Fiero orthography. A reader who wants
 * their own supplies it as `localeResources`. What this map buys is that they
 * get a language they can read rather than English, which is the same trade
 * region-stripping already makes for `es-MX`.
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
    // Nahuan. The catalog is Central Nahuatl. `ppl` is Pipil (Nawat), the one
    // member outside Mexico, and it is grouped here for the same published
    // reason as the rest rather than for where it is spoken.
    nah: [
        "azd",
        "azn",
        "azz",
        "naz",
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
        "ppl",
    ],
    // Ojibwa. The catalog is in the Fiero double-vowel orthography, which is
    // closest to `ciw` — the variety the orthography was devised for. These
    // seven are the whole of the macrolanguage; `alq` (Algonquin) is not among
    // them, and is left to miss for the `fat` reason — ISO 639-3 gives it a code
    // outside `oj`, so folding it here would be the judgement this map avoids.
    oj: ["ciw", "ojb", "ojc", "ojg", "ojs", "ojw", "otw"],
    // Bikol. The catalog is Central Bikol (Naga), which is `bcl` — the variety
    // Bikol publishing, broadcasting and the mother-tongue materials use. These
    // eight are the whole of the macrolanguage. Tagalog is not among them and
    // must not be added: `fil` is a language of its own with a catalog of its
    // own, and folding it here would serve a Tagalog reader Bikol.
    bik: ["bcl", "bln", "bto", "cts", "fbl", "lbl", "rbl", "ubl"],
    // Konkani. The catalog is Goan Konkani in Devanagari, the standard the Goa
    // Konkani Akademi publishes in. These two are the whole of the
    // macrolanguage; `gom` is the one `Intl.getCanonicalLocales` already folds.
    kok: ["gom", "knn"],
    // Dogri. The catalog is Dogri proper, which is `dgo` — the variety the
    // Eighth Schedule names and the J&K academy publishes in. These two are the
    // whole of the macrolanguage, and `xnr` (Kangri) is the member ICU leaves
    // unresolvable; `dgo` is the one it already folds.
    doi: ["dgo", "xnr"],
    // Fula. The catalog is Pulaar, the western variety of Senegal and
    // Mauritania, which is `fuc` — what CLDR fills a bare `ff` in as and the
    // one member it already folds. These nine are the whole of the
    // macrolanguage, so an Adamawa (`fub`) or Nigerian (`fuv`) Fulfulde reader
    // reaches Pulaar rather than English.
    ff: ["ffm", "fub", "fuc", "fue", "fuf", "fuh", "fui", "fuq", "fuv"],
    // Kanuri. The catalog is Central Kanuri, which is `knc` — what CLDR fills a
    // bare `kr` in as and the one member it already folds. These four are the
    // whole of the macrolanguage. `kby` (Manga Kanuri) maximizes to `kby-Arab`,
    // so a Manga reader most likely arrives in Ajami and is served Latin; that
    // is `locales/ha`'s asymmetry, and the answer to it is a second catalog
    // rather than a change here. `kbl` (Kanembu) is deliberately absent: ISO
    // 639-3 gives it a code outside `kr`, so folding it would be the judgement
    // this map avoids.
    kr: ["bms", "kby", "knc", "krt"],
    // Manding. `mnk` is a *member* rather than the macrolanguage — see
    // {@link LANGUAGE_ALIASES}'s `man` entry — so this lists the sibling
    // members, and deliberately omits `bam` and `dyu`, which `locales/bm` and
    // `locales/dyu` answer for themselves. `emk` is listed for the reason the
    // already-folded codes above are: `Intl.getCanonicalLocales` rewrites it to
    // `man`, so it would reach Mandinka through the alias anyway, and naming it
    // keeps the list the whole of a group rather than the leftovers of one.
    mnk: ["emk", "mku", "mlq", "msc", "mwk"],
    // Kongo. The catalog is written towards the Kikongo ya Bandundu standard.
    // These three are the whole of the macrolanguage; `kng` is the one
    // `Intl.getCanonicalLocales` already folds to `kg`, and it is listed for
    // the reason the other already-folded codes above are.
    //
    // `ktu` (Kituba) is deliberately absent, and this is the one exclusion here
    // that is not simply "it has a catalog of its own" — though it does, added
    // in #1685. Kituba is a creole *of* Kikongo rather than a variety of it,
    // ISO 639-3 gives it a code outside `kg`, and folding it would be the
    // judgement this map avoids. `mkw` (Kituba of the Republic of the Congo) is
    // absent for the same reason and is left to miss; answering it with `ktu`
    // would be defensible and is not a membership fact, so it is not done here.
    kg: ["kng", "kwy", "ldi"],
    // Songhay. `dje` is a *member* rather than the macrolanguage — the shape
    // {@link LANGUAGE_ALIASES}'s `man` entry explains — so this lists the
    // sibling members. These six are the whole of `son` apart from Zarma
    // itself, and ICU folds none of them, so every one of them reaches a
    // catalog only because this list exists.
    //
    // `son` itself is deliberately *not* aliased onto `dje`, and that is the
    // half worth reading. `man` earns its alias because CLDR decides for
    // itself which member a bare macrolanguage tag means —
    // `new Intl.Locale("man").maximize()` is `man-Latn-GM`, Mandinka's
    // country. `son` maximizes to nothing at all: CLDR adds no region, so it
    // has no opinion, and picking Zarma because it is the largest would be
    // exactly the judgement these maps exist to avoid. `negotiate.test.ts`
    // asserts the absent region rather than merely the absent entry, so a
    // change in ICU data that gave `son` a region would fail there and invite
    // someone to reconsider.
    //
    // `tda` (Tadaksahak) maximizes to `tda-Tfng-NE` — Tifinagh — so a reader
    // most likely arriving in that script is served Latin. That is
    // `locales/kr`'s asymmetry with `kby` in Ajami and `locales/ff`'s in
    // Adlam — the two other debts CLDR's own maximization creates, rather
    // than `locales/ha`'s, which CLDR does not: a bare `ha` maximizes to
    // `ha-Latn-NG`. The answer to it is a second catalog rather than a change
    // here.
    dje: ["ddn", "hmb", "khq", "ses", "tda", "twq"],
    // Buryat. The catalog is the Russia Buriat literary standard, which is what
    // ICU already folds `bxr` onto; `bxm` (Mongolia) and `bxu` (China) are the
    // members it does not, and they reach `locales/bua` only through this list.
    // `bxu` maximizes to `bxu-Mong-CN` — the Mongolian script — so a China
    // Buriat reader most likely arriving in that script is served Cyrillic.
    // That is `locales/kr`'s asymmetry with `kby` and `locales/dje`'s with
    // `tda`, and the answer to it is a second catalog rather than a change
    // here.
    bua: ["bxm", "bxr", "bxu"],
    // Komi. The catalog is Komi-Zyrian, which is what ICU folds `kpv` onto;
    // `koi` (Komi-Permyak) is the member it does not, and it is a written
    // standard of its own, so serving it Zyrian is the compromise every entry
    // in this map makes and `locales/kv`'s header records.
    kv: ["koi", "kpv"],
    // Mari. The catalog is Meadow Mari, which is what ICU folds `mhr` onto;
    // `mrj` (Hill Mari) is the member it does not, and, like `koi` above, it is
    // a written standard with an orthography of its own rather than a spelling
    // of this one.
    chm: ["mhr", "mrj"],
};

/** Flattened once at module load rather than searched per request. */
const MACROLANGUAGE_ALIASES: Record<string, string> = Object.fromEntries(
    Object.entries(MACROLANGUAGE_MEMBERS).flatMap(([macro, members]) =>
        members.map((member) => [member, macro]),
    ),
);

/**
 * Rewrite a request's language subtag if it is one no catalog is named after.
 *
 * {@link LANGUAGE_ALIASES} is consulted before {@link MACROLANGUAGE_MEMBERS},
 * so a hand-written entry always wins over a membership one. The two share no
 * key today; the order is what keeps a future collision decidable rather than
 * accidental.
 *
 * The tag arrives as the caller wrote it — {@link negotiateLocales} is public
 * and hosts pass `navigator.languages` straight in — so a code
 * `Intl.getCanonicalLocales` would have folded may still reach these maps
 * unfolded. That is why a member list names codes ICU already resolves.
 */
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
