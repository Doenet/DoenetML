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
 * `locales/nn` now exists, and that changes nothing here. What it changes is
 * only that `nn` reaches a catalog of its own instead of falling to English;
 * `no` still maps to `nb`, because a reader who says `no` has not said which
 * standard they read and Bokmål is what CLDR fills a bare `no` in as. Pointing
 * `no` at `nn` now that there is an `nn` to point it at would be the same
 * substitution in the other direction. `negotiate.test.ts` holds both halves.
 *
 * `tw` is the retired ISO 639-1 code for Twi, and `ak` — Akan, which Twi is a
 * variety of — is the catalog it should reach. `Intl.getCanonicalLocales`
 * leaves `tw` alone, so without this entry a hand-typed `<document lang="tw">`
 * falls to English. `fat` is deliberately absent: Fante is a written standard
 * of its own and `locales/ak` is written in Asante Twi, so answering Fante
 * with it would be the substitution `no`-to-`nn` is kept out for.
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
    // Three macrolanguages this repository names a catalog after a *member* of,
    // and the reason each needs an entry here rather than in
    // {@link MACROLANGUAGE_MEMBERS}: ICU canonicalizes the member's own tag
    // back onto the macrolanguage. `new Intl.Locale("kmr").toString()` is
    // `"ku"`, `"kpv"` is `"kv"` and `"mhr"` is `"chm"`, so `normalizeLocaleTag`
    // has already rewritten a hand-typed `<document lang="kmr">` before
    // negotiation sees it. Without these three rows the directories they name
    // would be unreachable under *either* tag — the hazard `koi` and `mrj`
    // escaped by leaving `MACROLANGUAGE_MEMBERS`, met here from the opposite
    // direction.
    //
    // The catalogs were renamed off the macrolanguage codes because each is
    // written in one specific member variety while a *different* member ships
    // beside it: `locales/ckb` beside Kurmanji, `locales/koi` beside Zyrian,
    // `locales/mrj` beside Meadow Mari. A tag that names the whole
    // macrolanguage claims to cover the sibling it cannot serve.
    ku: "kmr",
    kv: "kpv",
    chm: "mhr",
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
 * member of `nb` or `ak`, and neither is folded onto its neighbour. `nn` now
 * has a catalog of its own and so no longer *misses* — what it still does not
 * do is answer `no`, which stays on `nb`. `fat` misses outright. Eleven of
 * the fifteen keys — `qu`, `ay`, `gn`, `oj`, `bik`, `kok`, `doi`, `ff`, `kr`,
 * `kg`, `bua` — are ISO 639-3 macrolanguages and list their macrolanguage
 * members; `nah` is an ISO 639-3 **collection** code rather than a
 * macrolanguage, so it lists the individual Nahuan languages ISO 639-5 groups
 * under it; and `mnk`, `dje` and `kmr` are neither, being *members* — of
 * `man`, `son` and `ku` respectively — that this repository names catalogs
 * after.
 *
 * Those three are the shape {@link LANGUAGE_ALIASES}'s `man` and `ku` entries
 * explain, and it is why the members listed under `mnk` exclude
 * `bam` and `dyu`: those two have catalogs of their own, and folding them here
 * would serve a Bambara reader Mandinka. `kmr` excludes `ckb` for the same
 * reason. There is a rule behind all of it — **name a catalog after the
 * individual language whenever a sibling member also has one**, because a
 * macrolanguage tag otherwise claims to cover a reader it cannot serve — and
 * the three renames that produced `kmr`, `kpv` and `mhr` are that rule applied
 * to catalogs first written under `ku`, `kv` and `chm`. `kpv` and `mhr` need
 * no entry here at all: each of those lists had already shrunk to the single
 * member the catalog is now named after.
 *
 * The member cases part company over their macrolanguage, and the reason is
 * CLDR rather than a preference: `man` is aliased onto `mnk` because
 * `Intl.Locale#maximize` gives it a region and so decides which member it
 * means, while `son` is left to miss because it maximizes to nothing. `ku`,
 * `kv` and `chm` are aliased for a third reason again — ICU canonicalizes
 * their members' tags back onto them, so the alias is what makes the renamed
 * directories reachable under either name.
 *
 * The one member CLDR already folds is included anyway — `quz`, `ojg`, `gug`,
 * `ayr`, `bcl`, `gom`, `dgo`, `fuc`, `knc`, `bxr` — so that each
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
    // Zaza. The catalog is the Vate written standard, which leans Northern
    // (Kirmanckî) where the two varieties diverge. `diq` (Southern Zazaki,
    // Dimli) is the member `Intl.getCanonicalLocales` already rewrites to
    // `zza`, and it is listed for the reason the other already-folded codes
    // above are; `kiu` (Northern Zazaki, Kirmanckî) is the one ICU leaves
    // unresolvable, and it reaches `locales/zza` only because this list
    // exists — which is the sharper half, since `kiu` names the very variety
    // the catalog is written in.
    zza: ["diq", "kiu"],
    // Balochi. The catalog is Southern Balochi as written in Pakistan, on the
    // Urdu letter inventory. `bcc` is that variety's own code and the one ICU
    // already folds onto `bal`; `bgn` (Western Balochi, written in Iran) and
    // `bgp` (Eastern Balochi) are the two it does not. These three are the
    // whole of the macrolanguage.
    //
    // `bgn` is the compromise worth naming: the Iranian Balochi orthography is
    // a different convention rather than a spelling variant, and
    // `locales/bal`'s own headers say so, so a Western Balochi reader is
    // served a spelling they must adjust to. That is still the trade
    // region-stripping makes everywhere else — a language they can read rather
    // than English — and the answer to it is a second catalog rather than a
    // change here.
    bal: ["bcc", "bgn", "bgp"],
    // Komi and Mari have no entry here at all, and that is the whole of what
    // renaming their catalogs cost. Each list had shrunk to a single member —
    // `kv: ["kpv"]`, `chm: ["mhr"]` — once `koi` and `mrj` left it in the
    // Uralic north batch, and that sole member is now the catalog's own name.
    // A one-member list folding a tag onto itself is not a fold, so both rows
    // became {@link LANGUAGE_ALIASES} entries pointing the macrolanguage at the
    // member instead.
    //
    // Kurdish. `locales/kmr` is Northern Kurdish (Kurmanji) in the Hawar Latin
    // alphabet, which is what a bare `ku` maximizes to (`ku-Latn-TR`). ISO
    // 639-3 gives the macrolanguage three members — `ckb`, `kmr`, `sdh` — and
    // this key is one of them rather than the macrolanguage: `ku` reaches it
    // through {@link LANGUAGE_ALIASES}, and what this list adds is the third
    // member, which has no catalog.
    //
    // `ckb` (Central Kurdish, Sorani) is deliberately absent: it has a catalog
    // of its own, and folding it here would serve a Sorani reader Kurmanji in
    // a script they do not read. That is `locales/mnk` excluding `bam` and
    // `dyu` — a member this repository names a catalog after, declining to
    // answer for a sibling member it cannot serve.
    //
    // `sdh` (Southern Kurdish) maximizes to `sdh-Arab-IR`, so a reader CLDR
    // expects in the Perso-Arabic script is served the Latin catalog. That is
    // this batch's script debt and the same one `locales/kr` owes `kby` in
    // Ajami, `locales/dje` owes `tda` in Tifinagh and `locales/bua` owes `bxu`
    // in Mongolian script; the answer to it is a second catalog rather than a
    // change here, and routing `sdh` to `locales/ckb` on script alone would be
    // exactly the judgement this map exists to avoid.
    //
    // `lki` (Laki) is left to miss. It is often described as Southern Kurdish
    // and is written in the same script, but ISO 639-3's macrolanguage mapping
    // gives it a code outside `kur`, so folding it would be a judgement about
    // how close two varieties are rather than a published fact — `kbl` under
    // `kr` and `alq` under `oj` land the same way.
    kmr: ["sdh"],
    // Inuktitut. `locales/iu` is written in Canadian Aboriginal syllabics, the
    // script Nunavut legislates and schools in, and ISO 639-3 gives the
    // macrolanguage exactly two members: `ike` (Eastern Canadian Inuktitut)
    // and `ikt` (Inuinnaqtun). Only `ike` is listed, and it is listed for the
    // reason the already-folded codes above are — `Intl.getCanonicalLocales`
    // rewrites it to `iu` before negotiation is consulted, so naming it keeps
    // this a statement of membership rather than a list of leftovers.
    //
    // **`ikt` is deliberately absent, and the reason is the script rather than
    // the language.** Inuinnaqtun is written in roman letters, and
    // `locales/iu` contains no roman-letter Inuktitut word anywhere — its
    // roman is DoenetML identifiers and a few declared English loans, not
    // prose — so folding `ikt` here would answer a reader who arrived in one
    // script with a catalog whose every sentence is in another. That is a worse answer than the
    // English fallback, which at least uses letters the reader has. It is the
    // exclusion `kbl` and `alq` illustrate met from a new direction: those two
    // are excluded because membership does not say they belong, while `ikt`
    // is a published member excluded because the catalog cannot serve it. The
    // answer to it is a second catalog in roman letters, which is what
    // `locales/ha` and `locales/kr` say about their own script asymmetries.
    iu: ["ike"],
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
 * The tag as asked for, then the tag an alias rewrites it to.
 *
 * Aliasing *adds* a fallback rather than replacing one, because `available` is
 * not only this repository's roster: a host passes its own catalogs in as
 * `localeResources`, and the contract those have is that they win. Rewriting
 * `ku` to `kmr` before matching would step over a host that had supplied a
 * catalog under `ku` — its key would never be compared against anything — and
 * hand its reader English instead. Keeping the original in front means the
 * host's own catalog is preferred and the aliased tag still reaches the bundled
 * one when no host catalog answers.
 *
 * This is what makes an alias safe to add to a tag that already worked. Three
 * were added when `locales/ku`, `locales/kv` and `locales/chm` took their
 * members' names, and every one of those is a tag a host may already be
 * keying a catalog on.
 *
 * **What it cannot do is tell the two apart.** By the time a request reaches
 * here, `normalizeLocaleTag` has folded `kmr` to `ku` — that is ICU's
 * canonicalization, the same one this file's aliases exist to work around —
 * so an author who writes `<document lang="kmr">` and one who writes `ku`
 * arrive identically. A host supplying catalogs under *both* keys therefore
 * gets the macrolanguage one for either request, because the member identity
 * was destroyed upstream rather than discarded here. Recovering it would mean
 * `normalizeLocaleTag` declining to canonicalize these three subtags, which is
 * a change to what a normalized tag means everywhere rather than a change to
 * negotiation; it predates these aliases, since `kmr` folded to `ku` before
 * this repository had a `locales/kmr` at all.
 */
function aliasChain(tag: string): string[] {
    const aliased = applyLanguageAlias(tag);
    return aliased === tag ? [tag] : [tag, aliased];
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
 *   language subtag is one no catalog is named after gains the alias as a
 *   fallback behind it, so a host catalog keyed on the original still wins;
 *   see {@link LANGUAGE_ALIASES} and {@link aliasChain}.
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
        requested.flatMap(aliasChain),
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
