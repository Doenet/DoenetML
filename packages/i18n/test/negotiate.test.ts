import { describe, expect, it } from "vitest";

import {
    negotiateLocales,
    normalizeLocaleTag,
    resolveDocumentLocale,
    resolveUiLocale,
} from "../src/negotiate";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

/**
 * The real roster, which the catalog-naming groups below negotiate against
 * rather than against a stand-in for it: renaming a catalog directory should
 * turn them red instead of leaving them describing a layout the repository no
 * longer has.
 */
const available = SUPPORTED_LOCALES.map((info) => info.locale);

describe("negotiateLocales", () => {
    it("builds the regional -> language -> default chain", () => {
        expect(negotiateLocales(["es-MX"], ["es-MX", "es", "en"])).toEqual([
            "es-MX",
            "es",
            "en",
        ]);
    });

    it("falls back to the base language when the region has no catalog", () => {
        expect(negotiateLocales(["es-MX"], ["es", "en"])).toEqual(["es", "en"]);
    });

    it("appends the default locale even when it is not offered", () => {
        expect(negotiateLocales(["es"], ["es"])).toEqual(["es", "en"]);
    });

    it("returns just the default when nothing matches", () => {
        expect(negotiateLocales(["ja"], ["es", "en"])).toEqual(["en"]);
    });

    it("honors an explicit default locale", () => {
        expect(
            negotiateLocales(["ja"], ["es", "fr"], { defaultLocale: "fr" }),
        ).toEqual(["fr"]);
    });

    /**
     * Chinese is the one language this repository translates twice, and the
     * two catalogs are told apart by script rather than by region. Which
     * catalog a reader reaches is decided here, so it is asserted here.
     */
    describe("Chinese, whose catalogs are named by script", () => {
        it.each([
            ["zh-CN", "zh-Hans"],
            ["zh-SG", "zh-Hans"],
            ["zh-TW", "zh-Hant"],
            ["zh-HK", "zh-Hant"],
            ["zh-MO", "zh-Hant"],
        ])("serves %s from %s", (requested, expected) => {
            expect(negotiateLocales([requested], available)[0]).toBe(expected);
        });

        it("reads a bare zh as Simplified, which is what CLDR fills in", () => {
            expect(negotiateLocales(["zh"], available)).toEqual([
                "zh-Hans",
                "en",
            ]);
        });

        /**
         * The reason the Simplified catalog is not simply named `zh`, written
         * out as the counterfactual roster it argues against. Filtering
         * negotiation tries the region-stripped tag before it consults
         * likely-subtags, so a `zh` directory answers every Traditional region
         * tag ahead of `zh-Hant` — a Taiwanese reader would be served
         * Simplified.
         */
        it("does not let a script-less catalog shadow the other script", () => {
            expect(
                negotiateLocales(["zh-TW"], ["en", "zh", "zh-Hant"]),
            ).toEqual(["zh", "zh-Hant", "en"]);
            expect(negotiateLocales(["zh-TW"], available)).toEqual([
                "zh-Hant",
                "en",
            ]);
        });

        /**
         * A Traditional reader never falls through to Simplified: a key
         * missing from `zh-Hant` renders in English instead.
         */
        it.each(["zh-Hant", "zh-TW", "zh-HK", "zh-MO"])(
            "never puts Simplified behind %s",
            (requested) => {
                expect(negotiateLocales([requested], available)).not.toContain(
                    "zh-Hans",
                );
            },
        );

        /**
         * The reverse is not symmetric, because filtering offers every `zh-*`
         * catalog it has. Keeping both catalogs complete is what keeps this
         * step out of reach — a gap in `zh-Hans` would be filled from
         * `zh-Hant` wherever both catalogs are loaded at once.
         */
        it("does put Traditional behind Simplified for a region tag", () => {
            expect(negotiateLocales(["zh-CN"], available)).toEqual([
                "zh-Hans",
                "zh-Hant",
                "en",
            ]);
            expect(negotiateLocales(["zh-Hans"], available)).toEqual([
                "zh-Hans",
                "en",
            ]);
        });
    });

    /**
     * Norwegian's two written standards, which are now two catalogs.
     *
     * `nb` is Bokmål and `nn` is Nynorsk; `no` is the macrolanguage over both,
     * it is the tag an author is likeliest to type and one several browsers
     * still send, and nothing in filtering negotiation connects it to either.
     * The alias sends it to `nb`, and that stayed as it was when `locales/nn`
     * arrived — a reader who says `no` has not said which standard they read,
     * and Bokmål is what CLDR fills a bare `no` in as. Asserted here against
     * the real roster so the two halves cannot drift.
     */
    describe("Norwegian, whose two written standards are two catalogs", () => {
        it.each(["no", "no-NO", "nb", "nb-NO"])(
            "serves Bokmål to %s",
            (requested) => {
                expect(negotiateLocales([requested], available)).toEqual([
                    "nb",
                    "en",
                ]);
            },
        );

        it.each(["nn", "nn-NO"])("serves Nynorsk to %s", (requested) => {
            expect(negotiateLocales([requested], available)).toEqual([
                "nn",
                "en",
            ]);
        });
    });

    /**
     * Akan's catalog is named `ak` and is written in Asante Twi. `tw` is the
     * retired code for Twi and the one an author is as likely to type;
     * `Intl.getCanonicalLocales` leaves it alone, so nothing connects the two
     * without the alias. Asserted against the real roster, so that removing the
     * entry fails here rather than quietly serving English.
     */
    describe("Akan, whose catalog is named for the macrolanguage", () => {
        it.each(["tw", "tw-GH", "ak", "ak-GH"])(
            "serves Akan to %s",
            (requested) => {
                expect(negotiateLocales([requested], available)).toEqual([
                    "ak",
                    "en",
                ]);
            },
        );

        it("leaves Fante to fall back to English", () => {
            expect(negotiateLocales(["fat"], available)).toEqual(["en"]);
        });
    });

    /**
     * Filipino's catalog is named `fil`, and `tl` — the code an author is as
     * likely to type — needs no alias of its own: `Intl.Locale` canonicalizes
     * it, so `normalizeLocaleTag` has already rewritten it before negotiation
     * sees it. That is the same step that rewrites `iw` and `in`, which is why
     * `LANGUAGE_ALIASES` lists neither. Asserted here so that a future change
     * to the normalization step cannot silently drop Filipino to English.
     */
    describe("Filipino, whose catalog is named for the standard language", () => {
        it.each(["tl", "tl-PH", "fil", "fil-PH"])(
            "serves Filipino to %s",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["fil", "en"]);
            },
        );
    });

    /**
     * The European regional and minority batch adds no entry to
     * `LANGUAGE_ALIASES`, and this is what says so out loud. Yiddish is the
     * Filipino case again — `ji` is the retired code and `Intl.Locale`
     * canonicalizes it, so nothing has to be listed — and the rest reach their
     * catalogs through plain filtering, including the two whose incoming tag
     * names a script or a region the directory does not.
     *
     * `sme` — the ISO 639-3 code for Northern Sami — needs no entry either,
     * for the Filipino reason a third time: `Intl.Locale` folds it to `se`
     * before negotiation is reached. Asserted below so that a change to the
     * normalization step is what fails rather than a Sami reader quietly
     * getting English.
     */
    describe("the European regional and minority batch, which needs no alias", () => {
        it.each([
            ["ji", "yi"],
            ["ji-US", "yi"],
            ["yi-US", "yi"],
            ["bs-BA", "bs"],
            // Bosnian is written in Latin, so a Cyrillic tag reaches the Latin
            // catalog. That is the asymmetry `pa` and `sr` already have, and
            // the answer to it is a second catalog rather than a rename.
            ["bs-Cyrl", "bs"],
            ["nds-NL", "nds"],
            ["rm-CH", "rm"],
            ["oc-FR", "oc"],
            ["sc-IT", "sc"],
            ["scn-IT", "scn"],
            ["co-FR", "co"],
            ["se-NO", "se"],
            ["fy-NL", "fy"],
            ["lb-LU", "lb"],
            ["ast-ES", "ast"],
        ])("serves %s from the catalog named %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        it("folds the three-letter code for Northern Sami to `se`", () => {
            expect(
                negotiateLocales([normalizeLocaleTag("sme")], available),
            ).toEqual(["se", "en"]);
        });
    });

    /**
     * The Indigenous Americas batch, which is the first to seed codes that
     * stand for **more than one individual language** — `qu`, `ay`, `gn` and
     * `oj` are ISO 639-3 macrolanguages and `nah` an ISO 639-3 collection — and
     * the first to need `MACROLANGUAGE_MEMBERS` because of it.
     *
     * The bug these assertions pin is specific and was invisible until a
     * macrolanguage had a catalog: **CLDR's likely-subtags folds exactly one
     * member of a macrolanguage to it and leaves the rest unresolvable.** So
     * `quz` reached `qu` on ICU data alone while `quh` fell to English, with a
     * `qu` catalog sitting right there. The pairs below assert both halves —
     * the member CLDR already folds and several it does not — so that removing
     * the map, or a change in ICU data, fails here rather than quietly serving
     * English to a reader whose language is on disk.
     */
    describe("the Indigenous Americas batch and its macrolanguages", () => {
        it.each([
            // Quechuan. `quz` is the one CLDR folds on its own; the rest are
            // the map's work. `qvi` is Ecuadorian Kichwa, the furthest of these
            // from the Southern Quechua the catalog is written in, and it is
            // still a better answer than English.
            ["quz", "qu"],
            ["quh", "qu"],
            ["qvi", "qu"],
            ["qwh", "qu"],
            ["quy-PE", "qu"],
            // Aymaran.
            ["ayr", "ay"],
            ["ayc", "ay"],
            // Guaranian. `gug` is Paraguayan Guarani, which is what the catalog
            // is; `gui` and `gun` are Bolivian and Mbya.
            ["gug", "gn"],
            ["gui", "gn"],
            ["gun", "gn"],
            // Nahuan. Not one of these folds without the map, including `nci`
            // — Classical Nahuatl — which is the code a historical text is most
            // likely to arrive under. `naz` is Coatepec and `azn` Western
            // Durango, at the two edges of the group.
            ["nci", "nah"],
            ["nhe", "nah"],
            ["azz", "nah"],
            ["naz", "nah"],
            ["azn", "nah"],
            ["nci-MX", "nah"],
            // `ppl` is Pipil, the one Nahuan language spoken outside Mexico.
            ["ppl", "nah"],
            // Ojibwa. `ojg` is the one CLDR folds; `otw` is Odawa, a member of
            // `oj` in ISO 639-3. `ciw` is Chippewa, the variety the Fiero
            // orthography this catalog uses was devised for, so it is the
            // member the catalog answers best.
            ["ojg", "oj"],
            ["ojb", "oj"],
            ["otw", "oj"],
            ["ciw", "oj"],
        ])("serves %s from the catalog named %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        it.each([
            // These need no alias: `Intl.Locale` canonicalizes the ISO 639-3
            // code of an *individual* language to its 639-1 code, which is the
            // Filipino case the group above this one describes.
            ["hat", "ht"],
            ["grn", "gn"],
            ["que", "qu"],
            ["aym", "ay"],
            ["oji", "oj"],
        ])(
            "folds the three-letter code %s to %s without an alias",
            (requested, expected) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual([expected, "en"]);
            },
        );

        it.each([
            ["ht-HT", "ht"],
            ["qu-PE", "qu"],
            ["qu-BO", "qu"],
            ["ay-BO", "ay"],
            ["gn-PY", "gn"],
            ["nah-MX", "nah"],
            ["quc-GT", "quc"],
            ["arn-CL", "arn"],
            ["oj-CA", "oj"],
            // Ojibwe is written in both the Latin orthography this catalog uses
            // and in syllabics, so a syllabics tag reaches the Latin catalog and
            // gets Latin. That is the asymmetry `bs-Cyrl` and `pa` already have,
            // and the answer to it is a second catalog rather than a rename.
            ["oj-Cans", "oj"],
        ])(
            "strips the region or script from %s to reach %s",
            (requested, expected) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual([expected, "en"]);
            },
        );

        /**
         * The negative control, and the reason the map keys on published
         * membership rather than on how close two languages sound. Kʼicheʼ and
         * Mapudungun are individual languages with catalogs of their own, and
         * neither stands over any other code — so no other Mayan or Araucanian
         * tag may be folded onto them. `cak` is Kaqchikel and `myn` the Mayan
         * collection code; both must miss `quc`. `quh-Latn-x-private` folds to
         * `qu` as the rows above require, and must reach neither.
         */
        it.each(["cak", "quh-Latn-x-private", "myn"])(
            "does not invent a fold for %s",
            (requested) => {
                const chain = negotiateLocales(
                    [normalizeLocaleTag(requested)],
                    available,
                );
                expect(chain).not.toContain("quc");
                expect(chain).not.toContain("arn");
            },
        );

        /**
         * The same control one step closer in, where the temptation is real.
         * Algonquin is often described as a dialect of Ojibwe and is mutually
         * intelligible with the Ontario varieties, but ISO 639-3 gives it `alq`
         * outside the `oj` macrolanguage — so it is left to miss, exactly as
         * Fante is by `LANGUAGE_ALIASES`. Folding it would be the judgement
         * about closeness the map is built to avoid, and this is what would
         * catch someone adding it.
         */
        it("leaves Algonquin out of the Ojibwe macrolanguage", () => {
            expect(
                negotiateLocales([normalizeLocaleTag("alq")], available),
            ).toEqual(["en"]);
        });
    });

    /**
     * The Austronesian batch — five Philippine languages, four of Indonesia,
     * Tetum, three Polynesian, Chamorro and Tok Pisin. One of the fifteen is a
     * macrolanguage: `bik` stands over eight individual Bikol languages, so it
     * needs `MACROLANGUAGE_MEMBERS` for the same reason `qu` and `oj` do. The
     * other fourteen are individual languages and need nothing.
     */
    describe("the Austronesian batch and its macrolanguage", () => {
        it.each([
            // Bikol. The catalog is Central Bikol, which is `bcl` itself; the
            // rest are Bikol languages of the peninsula that would otherwise
            // fall to English with a catalog they can read sitting on disk.
            ["bcl", "bik"],
            ["bto", "bik"],
            ["cts", "bik"],
            ["ubl", "bik"],
            ["rbl", "bik"],
            ["bcl-PH", "bik"],
        ])("folds the Bikol member %s to %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        it.each([
            ["ilo-PH", "ilo"],
            ["war-PH", "war"],
            ["hil-PH", "hil"],
            ["pam-PH", "pam"],
            ["bik-PH", "bik"],
            ["min-ID", "min"],
            ["mad-ID", "mad"],
            ["tet-TL", "tet"],
            ["to-TO", "to"],
            ["fj-FJ", "fj"],
            ["ty-PF", "ty"],
            ["ch-GU", "ch"],
            ["ch-MP", "ch"],
            ["tpi-PG", "tpi"],
            // Both of these are written in more than one script, and both
            // catalogs are the Latin one — so a reader arriving under the other
            // script reaches it and gets Latin. That is the asymmetry `pa`,
            // `sr`, `jv` and `su` already have, and the answer to it is a second
            // catalog beside the first rather than a rename of it.
            ["ban-Bali", "ban"],
            ["ace-Arab", "ace"],
        ])(
            "strips the region or script from %s to reach %s",
            (requested, expected) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual([expected, "en"]);
            },
        );

        /**
         * The negative controls, and the reason the Bikol list keys on
         * published membership. Tagalog and Cebuano are Philippine languages
         * with catalogs of their own and are members of nothing: `tl`
         * canonicalizes to `fil` before negotiation is reached (see the
         * Filipino case above) and must not touch `bik`, and `ceb` must reach
         * its own catalog rather than a neighbour's. `phi` is the ISO 639-5
         * collection code for the Philippine languages as a group, which is not
         * a macrolanguage and folds onto nothing, unlike the one collection
         * code `MACROLANGUAGE_MEMBERS` does carry (`nah`, whose members are
         * listed there deliberately).
         */
        it.each(["tl", "ceb", "phi"])(
            "does not fold %s onto a neighbouring Philippine catalog",
            (requested) => {
                const chain = negotiateLocales(
                    [normalizeLocaleTag(requested)],
                    available,
                );
                expect(chain).not.toContain("bik");
                expect(chain).not.toContain("ilo");
                expect(chain).not.toContain("hil");
            },
        );

        // Pangasinan is a Philippine language with no catalog that belongs to
        // no macrolanguage with one, so it falls all the way to English — the
        // rule working rather than a gap in it.
        it("leaves Pangasinan on English rather than guessing", () => {
            expect(
                negotiateLocales([normalizeLocaleTag("pag")], available),
            ).toEqual(["en"]);
        });
    });

    /**
     * Klingon, the roster's first constructed language. Nothing in negotiation
     * treats it specially and nothing should: `tlh` is a registered IANA
     * primary subtag with an ISO 639-3 code, so it filters like any other
     * individual language, needs no entry in `LANGUAGE_ALIASES`, and belongs to
     * no macrolanguage.
     */
    describe("a constructed language", () => {
        it.each([
            ["tlh", "tlh"],
            // pIqaD is ISO 15924 `Piqd` — a registered script code for a script
            // Unicode does not encode, so no catalog can ever be written in it.
            // The Latin catalog is what a reader asking for it reaches, which
            // is the `ban-Bali` and `ace-Arab` asymmetry with the extra twist
            // that here the second catalog the answer usually points to cannot
            // exist.
            ["tlh-Piqd", "tlh"],
        ])("reaches the Klingon catalog from %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The constructed languages with codes of their own and no catalog.
         * Quenya and Sindarin are two languages rather than one "Elvish", and
         * `art` is the ISO 639-2 collection code over constructed languages as
         * a group — the `phi` case, and a collection nothing folds onto. All
         * three fall to English, which is the rule working: membership is a
         * published fact, and none of them is a member of `tlh`.
         */
        it.each(["qya", "sjn", "art"])(
            "leaves %s on English rather than folding it onto Klingon",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    /**
     * The South Asian batch. Two of its twelve are macrolanguages and go in
     * `MACROLANGUAGE_MEMBERS`; the other ten are individual languages
     * whose ISO 639-3 codes ICU canonicalizes unaided, so the batch adds no
     * `LANGUAGE_ALIASES` entry at all. Three of its scripts are new to the
     * roster — Ol Chiki, Thaana and Tibetan — and none of them changes
     * negotiation, which is what the script rows below say.
     */
    describe("the South Asian batch", () => {
        it.each([
            // The two macrolanguages. `gom` and `dgo` are the members
            // `Intl.getCanonicalLocales` already folds; `knn` and `xnr` are the
            // ones that reach their catalog only because
            // `MACROLANGUAGE_MEMBERS` lists them.
            ["gom", "kok"],
            ["knn", "kok"],
            ["dgo", "doi"],
            ["xnr", "doi"],
            // The ISO 639-3 codes ICU canonicalizes on its own, so no alias is
            // needed for any of them.
            ["san", "sa"],
            ["bod", "bo"],
            ["dzo", "dz"],
            ["div", "dv"],
            // Script asymmetries. Each of these reaches the catalog and gets
            // the script the catalog is written in; the answer to every one of
            // them is a second catalog beside the first rather than a rename.
            ["sa-Gran", "sa"],
            ["sa-Knda", "sa"],
            ["mni-Mtei", "mni"],
            ["sat-Deva", "sat"],
            ["sat-Latn", "sat"],
            ["ks-Deva", "ks"],
            ["kok-Latn", "kok"],
            ["doi-Arab", "doi"],
            ["mai-Tirh", "mai"],
            // Region tags, which filter without help.
            ["sat-IN", "sat"],
            ["bo-CN", "bo"],
            ["dz-BT", "dz"],
            ["dv-MV", "dv"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The near misses. `kfy` (Kumaoni) and `mag` (Magahi) are Indo-Aryan
         * neighbours of `mai` and `bho` that belong to no macrolanguage with a
         * catalog; `hoc` (Ho) is Munda like Santali and is not a member of
         * `sat`; `njz` (Nyishi) and `grt` (Garo) are Tibeto-Burman like Bodo
         * and are not members of `brx`. All fall to English, which is the
         * membership rule working rather than a gap in it — the moment
         * "sounds close to" decides the map, nothing in it is checkable.
         */
        it.each(["kfy", "mag", "hoc", "njz", "grt"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    /**
     * The African and Berber batch. One of its twelve is a macrolanguage and
     * goes in `MACROLANGUAGE_MEMBERS`; the other eleven are individual
     * languages that filter unaided, so the batch adds no `LANGUAGE_ALIASES`
     * entry. Tifinagh is new to the roster with `zgh` and `shi` and changes
     * nothing here — a script is a subtag like any other.
     */
    describe("the African and Berber batch", () => {
        it.each([
            // Fula is the macrolanguage. `fuc` — Pulaar, which the catalog is
            // written in — is the one member `Intl.getCanonicalLocales` folds
            // on its own; the other eight reach the catalog only because
            // `MACROLANGUAGE_MEMBERS` lists them, and without the entry a
            // Nigerian or Adamawa Fulfulde reader gets English with a catalog
            // on disk.
            ["fuc", "ff"],
            ["ffm", "ff"],
            ["fub", "ff"],
            ["fue", "ff"],
            ["fuf", "ff"],
            ["fuh", "ff"],
            ["fui", "ff"],
            ["fuq", "ff"],
            ["fuv", "ff"],
            // The ISO 639-3 codes ICU canonicalizes to a 639-1 code on its own.
            ["ssw", "ss"],
            ["ven", "ve"],
            ["tso", "ts"],
            ["kik", "ki"],
            ["sag", "sg"],
            ["ful", "ff"],
            // `nso`, `bem`, `luo`, `kab`, `zgh` and `shi` have no 639-1 code of
            // their own, so they arrive under the same tag the directory is
            // named for and need nothing.
            ["nso", "nso"],
            ["bem", "bem"],
            ["luo", "luo"],
            ["kab", "kab"],
            ["zgh", "zgh"],
            ["shi", "shi"],
            // Script asymmetries. Each reaches its catalog and gets the script
            // the catalog is written in. `ff-Adlm` is the one that is owed a
            // catalog of its own rather than merely allowed one: Adlam is a
            // living, taught script for Fulfulde.
            ["ff-Adlm", "ff"],
            ["kab-Tfng", "kab"],
            ["kab-Arab", "kab"],
            ["zgh-Latn", "zgh"],
            ["shi-Latn", "shi"],
            // Region tags, which filter without help.
            ["nso-ZA", "nso"],
            ["ss-SZ", "ss"],
            ["ve-ZA", "ve"],
            ["ts-MZ", "ts"],
            ["ki-KE", "ki"],
            ["bem-ZM", "bem"],
            ["luo-TZ", "luo"],
            ["sg-CF", "sg"],
            ["ff-NG", "ff"],
            ["kab-DZ", "kab"],
            ["zgh-MA", "zgh"],
            ["shi-MA", "shi"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The near misses. `tzm` (Central Atlas Tamazight) and `rif` (Tarifit)
         * are Berber languages beside `zgh` and `shi` and are members of no
         * macrolanguage with a catalog; `nd` and `nr` are Nguni neighbours of
         * `ss`; `kln` (Kalenjin) is Nilotic like `luo`. Every one falls to
         * English, which is the membership rule working rather than a gap in it
         * — Tachelhit is not Tarifit, however close a map makes them look.
         *
         * `nyn` was in this list when it was written and is not any more: the
         * West and Central African batch gave Nyankole a catalog of its own,
         * which is the only thing that should ever take a code off a
         * negative-control list.
         */
        it.each(["tzm", "rif", "nd", "nr", "kln"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    describe("the West and Central African batch", () => {
        it.each([
            // Rundi is the one directory in the batch whose name a request
            // never arrives under: `run` is the ISO 639-3 code and `rn` the
            // 639-1 one, and `Intl.getCanonicalLocales` rewrites the first to
            // the second before negotiation is reached. No alias is needed, and
            // adding one would be dead code.
            ["run", "rn"],
            ["rn", "rn"],
            // Kanuri is a macrolanguage. `knc` — Central Kanuri, which the
            // catalog is written in — is the one member ICU folds on its own;
            // the other three reach the catalog only because
            // `MACROLANGUAGE_MEMBERS` lists them.
            ["knc", "kr"],
            ["bms", "kr"],
            ["kby", "kr"],
            ["krt", "kr"],
            // `kau` is not a member but the ISO 639-2/T code for the
            // macrolanguage itself, which `Intl.getCanonicalLocales` rewrites
            // to `kr` before negotiation is reached — `run`'s case rather than
            // `bms`'s, and it needs no entry in either map.
            ["kau", "kr"],
            // The rest have no two-letter code, so they arrive under the tag
            // their directory is named for and need nothing.
            ["nyn", "nyn"],
            ["lua", "lua"],
            ["ktu", "ktu"],
            ["mos", "mos"],
            ["dag", "dag"],
            ["dyu", "dyu"],
            ["mnk", "mnk"],
            ["gaa", "gaa"],
            ["tiv", "tiv"],
            // Script asymmetry, and the one this batch owes a catalog rather
            // than merely allows: `kby` maximizes to `kby-Arab`, so CLDR's own
            // data says a Manga Kanuri reader most likely arrives in Ajami and
            // is served Latin. `locales/ha` has the same debt in the same
            // script and `locales/ff` has it in Adlam.
            ["kby-Arab", "kr"],
            ["kr-Arab", "kr"],
            // Region tags, which filter without help.
            ["rn-BI", "rn"],
            ["nyn-UG", "nyn"],
            ["lua-CD", "lua"],
            ["ktu-CG", "ktu"],
            ["mos-BF", "mos"],
            ["dag-GH", "dag"],
            ["dyu-CI", "dyu"],
            ["mnk-GM", "mnk"],
            ["gaa-GH", "gaa"],
            ["tiv-NG", "tiv"],
            ["kr-NE", "kr"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The Manding macrolanguage, which is the shape no earlier batch has
         * had: `man` is a macrolanguage this repository has three *member*
         * catalogs for and no catalog of its own, so `MACROLANGUAGE_MEMBERS`
         * cannot answer it and `LANGUAGE_ALIASES` does.
         *
         * Which member it points at is CLDR's decision rather than one made in
         * the repository — `man` maximizes to `man-Latn-GM`, the Gambia — and
         * the second assertion below is what would catch a change in that data
         * rather than merely restating the map.
         */
        it("sends the Manding macrolanguage to Mandinka, as CLDR's likely-subtags does", () => {
            expect(new Intl.Locale("man").maximize().region).toBe("GM");
            expect(negotiateLocales([normalizeLocaleTag("man")], available)) //
                .toEqual(["mnk", "en"]);
        });

        it.each([
            // Eastern Maninkakan, which ICU folds to `man` on its own, so it
            // arrives at the alias above rather than at the members list.
            ["emk", "mnk"],
            // The members that resolve nowhere without the map.
            ["mku", "mnk"],
            ["mlq", "mnk"],
            ["msc", "mnk"],
            ["mwk", "mnk"],
            // The two members with catalogs of their own, which must not be
            // folded onto Mandinka. These rows record where they land; what
            // holds them out of the members list is the test below, since
            // normalization hides the mistake from these.
            ["bam", "bm"],
            ["bm", "bm"],
            ["dyu", "dyu"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The half of the `mnk` entry that is easy to get wrong: listing `bam`
         * or `dyu` among Mandinka's members would serve a Bamako reader
         * Mandinka.
         *
         * Asserted on the *un-normalized* tag, which is the only form the
         * mistake is visible in. `normalizeLocaleTag` rewrites `bam` to `bm`
         * before `applyLanguageAlias` is ever reached, so the row above passes
         * whether or not `bam` is listed — and `negotiateLocales` is a public
         * function a host may hand a raw `navigator.languages` entry to, so
         * the members list really is consulted for these tags.
         */
        it.each(["bam", "dyu"])(
            "keeps %s out of Mandinka's members list",
            (requested) => {
                expect(negotiateLocales([requested], available)).not.toContain(
                    "mnk",
                );
            },
        );

        /**
         * The near misses. `kbl` (Kanembu) is the language beside Kanuri that
         * ISO 639-3 keeps *outside* the `kr` macrolanguage; `gur` (Farefare)
         * and `xsm` (Kasem) are Gur languages beside `mos` and `dag`. Every
         * one falls to English, which is the membership rule working rather
         * than a gap in it.
         *
         * `kmb` (Kimbundu) and `umb` (Umbundu) were here too, as Bantu
         * neighbours of `lua` and `ktu`, until the Angolan batch gave them
         * catalogs of their own — the same removal `men` and `nyn` got, and
         * the only thing that should ever shorten a negative-control list.
         * `sus` (Susu) left the same way once the batch continued below gave
         * it a catalog of its own.
         */
        it.each(["kbl", "gur", "xsm"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    describe("the West and Central African batch, continued", () => {
        it.each([
            // Kongo is a macrolanguage, and `kng` — Koongo — is the one member
            // `Intl.getCanonicalLocales` folds to `kg` on its own, `run`'s case
            // rather than `bms`'s. The other two reach the catalog only because
            // `MACROLANGUAGE_MEMBERS` lists them.
            ["kg", "kg"],
            ["kng", "kg"],
            ["kwy", "kg"],
            ["ldi", "kg"],
            // `kon` is the ISO 639-2/T code for the macrolanguage itself, which
            // canonicalizes to `kg` before negotiation is reached.
            ["kon", "kg"],
            // The rest have no two-letter code and arrive under the tag their
            // directory is named for.
            ["fon", "fon"],
            ["pcm", "pcm"],
            ["kri", "kri"],
            ["kbp", "kbp"],
            ["tem", "tem"],
            // Region tags, which filter without help.
            ["kg-CD", "kg"],
            ["fon-BJ", "fon"],
            ["pcm-NG", "pcm"],
            ["kri-SL", "kri"],
            ["kbp-TG", "kbp"],
            ["tem-SL", "tem"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The exclusion that carries this batch's argument, and the one most
         * likely to be "fixed" by someone who does not know why it is there.
         *
         * Kituba is a creole *of* Kikongo rather than a variety of it — see the
         * two catalogs' headers — and ISO 639-3 gives it a code outside the
         * `kg` macrolanguage. Listing it among `kg`'s members would serve a
         * Kituba reader Kikongo, which is a different language and not a
         * dialect of the one they asked for.
         *
         * Asserted on the *un-normalized* tag for the reason the `bam` guard
         * above records: `negotiateLocales` is public and a host may hand it a
         * raw `navigator.languages` entry, so the members list really is
         * consulted for it. The `ktu → ktu` row in the previous batch's block
         * would pass whether or not `ktu` were listed, since `ktu` has a
         * catalog of its own and wins on an exact match before any folding.
         */
        it.each(["ktu", "mkw"])(
            "keeps %s out of Kongo's members list",
            (requested) => {
                expect(negotiateLocales([requested], available)).not.toContain(
                    "kg",
                );
            },
        );

        /**
         * The near misses for this batch. `gej` (Gen) is a Gbe language beside
         * `fon` and `ee`. It falls to English rather than being folded onto a
         * language it is merely near.
         *
         * `men` (Mende) was here too, as a Sierra Leonean neighbour of `kri`
         * and `tem`, until the batch below gave it a catalog of its own — the
         * only thing that should ever take a code off a negative-control list,
         * and the same removal `nyn` got a batch earlier. `bin` (Edo) and
         * `efi` (Efik), the Nigerian neighbours of `pcm` and `tiv` that used
         * to sit here, left the same way once the batch continued below gave
         * each a catalog of its own.
         *
         * `son` is here for a different reason and is the interesting row: it
         * is the ISO 639-3 macrolanguage over the Songhay varieties. It is
         * *not* aliased the way `man` is, because the justification `man`'s
         * entry rests on does not exist here — `new Intl.Locale("son").maximize()`
         * adds no region, so CLDR has no opinion about which variety a bare
         * `son` means, and picking one would be the judgement these maps avoid.
         * The batch below gives Songhay a catalog under `dje` without changing
         * that, and says why.
         */
        it.each(["gej", "son"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        // The guard on `son`'s absent CLDR region used to sit here. It moved
        // into the batch below, where the same assertion now runs beside
        // `man`'s present one and beside `son`'s negotiated result, rather than
        // being made twice.
    });

    describe("the Angolan, Sierra Leonean and Songhay batch", () => {
        it.each([
            // None of the four has a two-letter code, so each arrives under the
            // tag its directory is named for.
            ["men", "men"],
            ["umb", "umb"],
            ["kmb", "kmb"],
            ["dje", "dje"],
            // Region tags, which filter without help.
            ["men-SL", "men"],
            ["umb-AO", "umb"],
            ["kmb-AO", "kmb"],
            ["dje-NE", "dje"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * Songhay, and the second instance of the shape `mnk` introduced: a
         * macrolanguage this repository has a *member* catalog for and no
         * catalog of its own.
         *
         * ICU folds none of these six, so each reaches Zarma only because
         * `MACROLANGUAGE_MEMBERS` lists it. That is the opposite of `kg`'s
         * entry, where `kng` would arrive anyway through canonicalization —
         * which is why the `kg` block says so and this one does not have to.
         */
        it.each([
            ["ddn", "dje"],
            ["hmb", "dje"],
            ["khq", "dje"],
            ["ses", "dje"],
            ["tda", "dje"],
            ["twq", "dje"],
        ])(
            "folds the Songhay member %s onto Zarma as %s",
            (requested, expected) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual([expected, "en"]);
            },
        );

        /**
         * The decision this batch declines to change, restated now that a
         * Songhay catalog exists.
         *
         * #1686 left `son` unaliased because CLDR has no opinion about which
         * variety it means. Zarma's arrival makes the alias *possible* and no
         * more justified: `dje` is the largest Songhay variety, and "largest"
         * is a judgement rather than a published fact, which is the line these
         * maps hold everywhere else.
         *
         * Asserted on the maximization rather than on the map, so that a change
         * in ICU data — not a change of mind here — is what fails and reopens
         * the question.
         */
        it("still leaves the Songhay macrolanguage unaliased, CLDR having no opinion", () => {
            expect(new Intl.Locale("son").maximize().region).toBeUndefined();
            expect(new Intl.Locale("man").maximize().region).toBe("GM");
            expect(negotiateLocales([normalizeLocaleTag("son")], available)) //
                .toEqual(["en"]);
        });

        /**
         * `tda` is this batch's script debt, and it is recorded rather than
         * fixed: Tadaksahak maximizes to `tda-Tfng-NE`, so CLDR's own data says
         * such a reader most likely arrives in Tifinagh and what they get from
         * `locales/dje` is Latin. `locales/kr` owes the same debt to `kby` in
         * Ajami and `locales/ff` owes it in Adlam.
         */
        it("serves Tadaksahak Latin although CLDR expects it in Tifinagh", () => {
            expect(new Intl.Locale("tda").maximize().script).toBe("Tfng");
            expect(negotiateLocales([normalizeLocaleTag("tda")], available)) //
                .toEqual(["dje", "en"]);
        });

        /**
         * The near misses for this batch. `lol` (Mongo) and `cjk` (Chokwe) are
         * Bantu neighbours of `kmb` and `umb`. Every one falls to English,
         * which is the membership rule working rather than a gap in it.
         */
        // `kpe` (Kpelle) sat beside `men` in Sierra Leone on this list until
        // the batch continued in `packages/i18n/README.md` gave it a catalog
        // of its own — the same removal `men`, `umb`, `kmb` and `nyn` got.
        it.each(["lol", "cjk"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    /**
     * The Cyrillic-script languages of the Russian Federation. Twelve
     * catalogs, and the batch is the first whose *whole* membership shares a
     * script without sharing a family: four Turkic, two Mongolic, four Uralic,
     * one Iranian and one Nakh.
     *
     * Three of the twelve arrived as ISO 639-3 macrolanguages in
     * `MACROLANGUAGE_MEMBERS` — `bua`, `kv` and `chm` — which is the largest
     * number any one batch has added. Only `bua` is still keyed that way: the
     * Komi and Mari catalogs were later named after the varieties they are
     * written in, `kpv` and `mhr`, and their macrolanguage codes moved to
     * `LANGUAGE_ALIASES`. The other nine are individual languages that filter
     * unaided and need no entry of either kind.
     */
    describe("the Russian Federation batch", () => {
        it.each([
            // The three macrolanguages the batch brought in. For `bua` the
            // first member listed is the one `Intl.getCanonicalLocales` folds
            // on its own and the rest reach the catalog only because
            // `MACROLANGUAGE_MEMBERS` names them; `kpv` and `mhr` now name
            // their own catalogs, and `kom` reaches Zyrian because ICU folds
            // it to `kv` and `LANGUAGE_ALIASES` carries `kv` on to `kpv`.
            //
            // `koi` and `mrj` stood beside `kpv` and `mhr` here until the
            // Uralic north batch gave each of them a catalog and took it out
            // of its macrolanguage's member list. Their rows moved to that
            // batch's `describe` below, where they now assert the opposite:
            // that each reaches *its own* catalog rather than its sibling's.
            ["bxr", "bua"],
            ["bxm", "bua"],
            ["bxu", "bua"],
            ["kpv", "kpv"],
            ["mhr", "mhr"],
            // The ISO 639-3 codes ICU canonicalizes to a 639-1 code on its own.
            ["bak", "ba"],
            ["chv", "cv"],
            ["udm", "udm"],
            ["kom", "kpv"],
            ["oss", "os"],
            ["che", "ce"],
            // `sah`, `tyv`, `myv` and `xal` have no 639-1 code of their own, so
            // they arrive under the same tag the directory is named for.
            ["sah", "sah"],
            ["tyv", "tyv"],
            ["myv", "myv"],
            ["xal", "xal"],
            // Region tags, which filter without help — including `os`, whose
            // maximization names Georgia rather than Russia and which costs
            // negotiation nothing either way.
            ["ba-RU", "ba"],
            ["cv-RU", "cv"],
            ["sah-RU", "sah"],
            ["tyv-RU", "tyv"],
            ["bua-RU", "bua"],
            ["xal-RU", "xal"],
            ["udm-RU", "udm"],
            ["kv-RU", "kpv"],
            ["myv-RU", "myv"],
            ["chm-RU", "mhr"],
            ["os-RU", "os"],
            ["os-GE", "os"],
            ["ce-RU", "ce"],
            // Script asymmetries. Every catalog here is Cyrillic, so a reader
            // arriving under a Latin tag gets Cyrillic — the answer `locales/sr`
            // and `locales/kk` already give.
            ["ba-Latn", "ba"],
            ["cv-Latn", "cv"],
            ["ce-Latn", "ce"],
            ["xal-Mong", "xal"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * `bxu` is this batch's script debt, and it is recorded rather than
         * fixed: China Buriat maximizes to `bxu-Mong-CN`, so CLDR's own data
         * says such a reader most likely arrives in the Mongolian script and
         * what `locales/bua` gives them is Cyrillic. `locales/dje` owes the
         * same debt to `tda` in Tifinagh and `locales/kr` to `kby` in Ajami.
         */
        it("serves China Buriat Cyrillic although CLDR expects it in Mongolian script", () => {
            expect(new Intl.Locale("bxu").maximize().script).toBe("Mong");
            expect(negotiateLocales([normalizeLocaleTag("bxu")], available)) //
                .toEqual(["bua", "en"]);
        });

        /**
         * The near miss. `sel` (Selkup) is Uralic beside `udm` and `kv`
         * without belonging to either, so it falls to English — the membership
         * rule working rather than a gap in it.
         *
         * This list was seven codes longer when it was written: `krc`, `kum`,
         * `nog`, `ady`, `kbd` and `av` were named here as neighbours of `ba`
         * and `ce`, and `mdf` as Erzya's sister that `locales/myv` could do
         * nothing for. All seven have catalogs of their own as of the Caucasus
         * and Uralic north batches, so their rows moved to those batches'
         * `describe` blocks below. What they were pinning still holds and is
         * worth keeping straight: they reach a catalog now because one was
         * *written* for them, not because anything in `negotiate.ts` learned to
         * fold a neighbour onto a neighbour.
         */
        it("leaves sel on English rather than folding it onto a neighbour", () => {
            expect(
                negotiateLocales([normalizeLocaleTag("sel")], available),
            ).toEqual(["en"]);
        });
    });

    /**
     * The Caucasus and Kurdish batch. Fifteen catalogs, and the negotiation
     * question it raises that no earlier batch did is what happens when two
     * members of one macrolanguage both have a catalog and the macrolanguage
     * itself has none.
     *
     * `kmr` is Northern Kurdish (Kurmanji) in Latin and `ckb` is Central
     * Kurdish (Sorani) in the Perso-Arabic script, and ISO 639-3 makes both
     * members of the `ku` macrolanguage. The naive entry would fold `ckb` onto
     * Kurmanji — and would serve a Sorani reader a script they do not read
     * while their own catalog sat on disk. `MACROLANGUAGE_MEMBERS` therefore
     * keys on `kmr` and lists only `sdh`, the third member, excluding `ckb`
     * exactly as `locales/mnk` excludes `bam` and `dyu`.
     *
     * Because the Kurmanji catalog is named for the member rather than the
     * macrolanguage, `LANGUAGE_ALIASES` carries `ku: "kmr"` so the
     * macrolanguage tag still reaches it — see "a catalog named after a
     * macrolanguage member" below. The other thirteen catalogs are individual
     * languages that filter unaided and need no entry of either kind.
     */
    describe("the Caucasus and Kurdish batch", () => {
        it.each([
            // The macrolanguage tag, which reaches the catalog through
            // `LANGUAGE_ALIASES`; the catalog's own tag, which ICU
            // canonicalizes onto `ku` and the same alias catches; and `sdh`,
            // which reaches the catalog only because the member map names it.
            ["ku", "kmr"],
            ["kmr", "kmr"],
            ["sdh", "kmr"],
            // …and the member that is deliberately not folded, because it
            // answers for itself.
            ["ckb", "ckb"],
            // The ISO 639-3 codes ICU canonicalizes to a 639-1 code on its own.
            ["abk", "ab"],
            ["ava", "av"],
            ["kur", "kmr"],
            // The eleven with no 639-1 code, which arrive under the same tag
            // the directory is named for.
            ["ady", "ady"],
            ["kbd", "kbd"],
            ["dar", "dar"],
            ["lbe", "lbe"],
            ["tab", "tab"],
            ["inh", "inh"],
            ["lez", "lez"],
            ["krc", "krc"],
            ["kum", "kum"],
            ["nog", "nog"],
            ["tly", "tly"],
            // Region tags, which filter without help. `ab` maximizes to
            // Georgia and `tly` to Azerbaijan rather than to Russia or Iran,
            // which is CLDR's data rather than an error and costs negotiation
            // nothing either way.
            ["ab-GE", "ab"],
            ["ab-RU", "ab"],
            ["ady-RU", "ady"],
            ["kbd-RU", "kbd"],
            ["av-RU", "av"],
            ["lez-RU", "lez"],
            ["lez-AZ", "lez"],
            ["dar-RU", "dar"],
            ["lbe-RU", "lbe"],
            ["tab-RU", "tab"],
            ["inh-RU", "inh"],
            ["krc-RU", "krc"],
            ["kum-RU", "kum"],
            ["nog-RU", "nog"],
            ["tly-AZ", "tly"],
            ["tly-IR", "tly"],
            ["ku-TR", "kmr"],
            ["ku-SY", "kmr"],
            ["ckb-IQ", "ckb"],
            ["ckb-IR", "ckb"],
            // Script asymmetries. The twelve Caucasian catalogs are Cyrillic,
            // `kmr` and `tly` are Latin and `ckb` is Perso-Arabic, so a reader
            // arriving under the other script of their own language reaches the
            // catalog and gets the one it is written in — the answer
            // `locales/pa`, `locales/sr` and `locales/ha` already give, and the
            // answer to it is a second catalog rather than a rename of this
            // one.
            ["ku-Arab", "kmr"],
            ["tly-Cyrl", "tly"],
            ["tly-Arab", "tly"],
            ["ab-Latn", "ab"],
            ["ckb-Latn", "ckb"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * `sdh` is this batch's script debt, and — like `locales/bua`'s to
         * `bxu` — it is recorded rather than fixed. Southern Kurdish maximizes
         * to `sdh-Arab-IR`, so CLDR's own data says such a reader most likely
         * arrives in the Perso-Arabic script, and what published membership
         * hands them is Kurmanji in Latin.
         *
         * Routing it to `locales/ckb` instead would read better on the page and
         * would be exactly the judgement `MACROLANGUAGE_MEMBERS` exists to
         * avoid: Southern Kurdish is not Sorani, and "shares a script with"
         * is not a membership fact. The answer is a `sdh` catalog.
         */
        it("serves Southern Kurdish the Latin catalog although CLDR expects it in Perso-Arabic", () => {
            expect(new Intl.Locale("sdh").maximize().script).toBe("Arab");
            expect(negotiateLocales([normalizeLocaleTag("sdh")], available)) //
                .toEqual(["kmr", "en"]);
        });

        /**
         * The near misses. `lki` (Laki) is the sharpest: it is written in the
         * same script as `ckb`, is often described as a variety of Southern
         * Kurdish, and ISO 639-3's macrolanguage mapping still gives it a code
         * outside `kur` — so it falls back, exactly as `alq` does beside `oj`.
         * `zza` (Zaza) used to sit in this list as the same shape one family
         * over, and it has left it: the Silk Road batch gave Zazaki a catalog
         * of its own, so it is now a hit rather than a near miss, asserted
         * with the rest of that batch below. `lki` stays exactly where it was,
         * which is the point — Laki did not become reachable because a
         * neighbour did.
         *
         * `agx` (Aghul) is
         * Lezgic beside `lez` and `tab`, `ddo` (Tsez) is Avar's neighbour in
         * Dagestan, and `xmf` (Mingrelian) and `sva` (Svan) are Kartvelian
         * beside `ab` without belonging to any macrolanguage with a catalog.
         *
         * Every one falls to English, which is the membership rule working
         * rather than a gap in it — the moment "is spoken next to" decides the
         * map, nothing in it is checkable any more.
         */
        it.each(["lki", "agx", "ddo", "xmf", "sva"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );
    });

    /**
     * The Uralic north. Fifteen catalogs — four Sami languages in Latin and a
     * fifth in Cyrillic, five Finnic, Moksha, Komi-Permyak, Hill Mari, and the
     * roster's first two Ob-Ugric — and the negotiation question it raises is
     * the mirror of the Caucasus batch's.
     *
     * There, `ckb` was a member that had to be kept *out* of a list it had
     * never been in. Here `koi` and `mrj` were members already folded onto
     * `kv` and `chm`, and writing them a catalog each meant **taking them out**
     * — the first time an entry in `MACROLANGUAGE_MEMBERS` has shrunk. The
     * fold was the right answer while Komi-Permyak and Hill Mari had nowhere
     * else to go; the moment they had a file of their own it became the thing
     * the map exists to prevent, a reader served a neighbouring standard while
     * their own sat on disk. That left `kv` and `chm` listing a single member
     * each, `kpv` and `mhr` — the varieties those catalogs are actually
     * written in — which is why the catalogs were later named after them and
     * both one-member lists became `LANGUAGE_ALIASES` rows instead; see "a
     * catalog named after a macrolanguage member" below.
     */
    describe("the Uralic north batch", () => {
        it.each([
            // The two members that left `MACROLANGUAGE_MEMBERS` in this batch,
            // and the sister that was pinned on English by the Russian
            // Federation batch until this one wrote it a catalog.
            ["koi", "koi"],
            ["mrj", "mrj"],
            ["mdf", "mdf"],
            // …and the macrolanguage tags themselves, which still reach the
            // neighbouring standard — through `LANGUAGE_ALIASES` now that the
            // catalogs are named `kpv` and `mhr` rather than `kv` and `chm`.
            ["kv", "kpv"],
            ["chm", "mhr"],
            // The twelve remaining catalogs, none of which has a 639-1 code, so
            // each arrives under the tag its directory is named for.
            ["sma", "sma"],
            ["smj", "smj"],
            ["smn", "smn"],
            ["sms", "sms"],
            ["sjd", "sjd"],
            ["vep", "vep"],
            ["olo", "olo"],
            ["krl", "krl"],
            ["vro", "vro"],
            ["fit", "fit"],
            ["kca", "kca"],
            ["mns", "mns"],
            // Region tags, which filter without help. The batch spans five
            // countries, and six of the catalogs maximize outside Russia —
            // `sma`, `smj` and `fit` to Sweden, `smn` and `sms` to Finland,
            // `vro` to Estonia — which is CLDR's data rather than an error and
            // costs negotiation nothing.
            ["sma-SE", "sma"],
            ["sma-NO", "sma"],
            ["smj-SE", "smj"],
            ["smj-NO", "smj"],
            ["smn-FI", "smn"],
            ["sms-FI", "sms"],
            ["sjd-RU", "sjd"],
            ["vep-RU", "vep"],
            ["olo-RU", "olo"],
            ["krl-RU", "krl"],
            ["krl-FI", "krl"],
            ["vro-EE", "vro"],
            ["fit-SE", "fit"],
            ["mdf-RU", "mdf"],
            ["koi-RU", "koi"],
            ["mrj-RU", "mrj"],
            ["kca-RU", "kca"],
            ["mns-RU", "mns"],
            // Script asymmetries, and this batch is the one where they cut both
            // ways: nine of the fifteen are Latin and six Cyrillic, so a reader
            // arriving under the other script of their own language reaches the
            // catalog and gets the script it is written in. `vep` and `krl`
            // were both printed in Cyrillic within living memory and are
            // written in Latin now, which is why those two rows are here rather
            // than hypothetical.
            ["sjd-Latn", "sjd"],
            ["vep-Cyrl", "vep"],
            ["krl-Cyrl", "krl"],
            ["olo-Cyrl", "olo"],
            ["kca-Latn", "kca"],
            ["mns-Latn", "mns"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The removal asserted as a removal rather than as a lookup: before
         * this batch, `koi` and `mrj` were rewritten to `kv` and `chm` — the
         * tags `locales/kpv` and `locales/mhr` were then named after — by
         * `applyLanguageAlias` *before* negotiation ever saw them, so a
         * `locales/koi` on disk would have been unreachable. The rows above
         * would pass either way if the alias happened to be gone; this one
         * says why it has to be.
         */
        it("stops folding a member the moment it has a catalog of its own", () => {
            for (const [member, neighbour] of [
                ["koi", "kpv"],
                ["mrj", "mhr"],
            ]) {
                // Offered *both* catalogs, the member's own wins — which it
                // cannot do if the tag is rewritten before negotiation.
                expect(
                    negotiateLocales([member], [neighbour, member, "en"]),
                ).toEqual([member, "en"]);
            }
        });

        /**
         * The near misses, and this batch has more of them than any other
         * because the north is full of languages one code away from a catalog.
         *
         * `sje` (Pite Sami), `sju` (Ume Sami) and `sjt` (Ter Sami) are Sami
         * languages beside four that now have catalogs; `izh` (Ingrian),
         * `liv` (Livonian) and `vot` (Votic) are Finnic beside five. `fkv`
         * (Kven) is the sharpest of the seven: it is as close to `fit` as
         * Meänkieli is to Finnish, is written in a closely related orthography,
         * and is a separate ISO 639-3 language on the other side of a national
         * border — so folding it would be a judgement about how close two
         * varieties are rather than a published fact, which is `lki` beside
         * `ckb` and `alq` beside `oj`.
         *
         * There is no macrolanguage over any of them to fold through: `smi` is
         * an ISO 639-5 *collection* rather than a macrolanguage, which is why
         * none of the three Sami misses reaches a Sami catalog.
         */
        it.each(["sje", "sju", "sjt", "izh", "liv", "vot", "fkv"])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        /**
         * `smi` is left to miss for `son`'s reason rather than `nah`'s, and the
         * difference is CLDR's rather than a preference. `nah` is a collection
         * this repository does alias, because it names one written standard —
         * Central Nahuatl — that the group's members can be served with. `smi`
         * covers ten languages in two scripts across four countries, and CLDR
         * has no opinion about which: `new Intl.Locale("smi").maximize()` adds
         * neither script nor region, exactly as `son` fails to. Picking
         * Northern Sami because it is the largest would be the judgement these
         * maps exist to avoid.
         *
         * Asserted against the absent maximization rather than merely the
         * absent entry, so a change in ICU data that gave `smi` a region fails
         * here and invites someone to reconsider.
         */
        it("leaves the Sami collection code alone, because CLDR has no opinion about it", () => {
            const maximized = new Intl.Locale("smi").maximize();
            expect(maximized.region).toBeUndefined();
            expect(maximized.script).toBeUndefined();
            expect(negotiateLocales([normalizeLocaleTag("smi")], available)) //
                .toEqual(["en"]);
        });
    });

    /**
     * Oceania. Eleven catalogs across Micronesia, Polynesia and Melanesia,
     * and the negotiation question it raises is neither of the last two
     * batches'.
     *
     * The Caucasus batch had to keep a member *out* of a list; the Uralic
     * north had to **take two out** of lists they were already in. This batch
     * touches `MACROLANGUAGE_MEMBERS` not at all, and that is the fact
     * worth pinning rather than passing over: not one of the eleven is a
     * macrolanguage, and not one was being folded onto a wider code before
     * this batch, so every tag reached English on its own account and now
     * reaches its own catalog. The map is unchanged and the rows below prove
     * the batch needed nothing from it.
     *
     * Two of the eleven — `mh` and `bi` — have ISO 639-1 codes, so a reader
     * can also arrive under the 639-2/T alpha-3 that
     * `Intl.getCanonicalLocales` folds for us. Those rows are here because the
     * folding is ICU's rather than this repository's, and a change in it would
     * silently cost two catalogs their alpha-3 door.
     */
    describe("the Oceania batch", () => {
        /** The eleven tags this batch adds, in the order the README lists them. */
        const OCEANIA = [
            "mh",
            "chk",
            "pon",
            "kos",
            "gil",
            "niu",
            "tkl",
            "tvl",
            "rar",
            "wls",
            "bi",
        ];

        it.each([
            // The nine tags with no 639-1 code, each arriving as the
            // directory it names.
            ["chk", "chk"],
            ["pon", "pon"],
            ["kos", "kos"],
            ["gil", "gil"],
            ["niu", "niu"],
            ["tkl", "tkl"],
            ["tvl", "tvl"],
            ["rar", "rar"],
            ["wls", "wls"],
            // …and the two with one.
            ["mh", "mh"],
            ["bi", "bi"],
            // The alpha-3 doors, folded by `Intl.getCanonicalLocales` rather
            // than by anything here.
            ["mah", "mh"],
            ["bis", "bi"],
            // Region tags, which filter without help. The batch spans nine
            // countries and territories, and every one of the eleven
            // maximizes to a region — a completeness no earlier batch had.
            ["mh-MH", "mh"],
            ["chk-FM", "chk"],
            ["pon-FM", "pon"],
            ["kos-FM", "kos"],
            ["gil-KI", "gil"],
            ["niu-NU", "niu"],
            ["tkl-TK", "tkl"],
            ["tvl-TV", "tvl"],
            ["rar-CK", "rar"],
            ["wls-WF", "wls"],
            ["bi-VU", "bi"],
            // Script tags. Every catalog here is Latin — the first batch of
            // which that is true since the Philippine one — so a `-Latn` is
            // redundant rather than a disambiguation, and has to cost nothing.
            ["mh-Latn", "mh"],
            ["gil-Latn", "gil"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The batch that changed no map, asserted as such. Each of the eleven
         * reaches its own catalog when the whole roster is on offer *and* when
         * only English is — the second half being what would fail if some
         * entry were quietly folding one of these tags onto a neighbour.
         */
        it("folds none of the eleven onto another catalog", () => {
            for (const locale of OCEANIA) {
                expect(negotiateLocales([locale], ["en"])).toEqual(["en"]);
                expect(negotiateLocales([locale], available)).toEqual([
                    locale,
                    "en",
                ]);
            }
        });

        /**
         * The near misses, and this batch's are sharper than the Uralic
         * north's because the Pacific's language boundaries do not line up
         * with its political ones.
         *
         * `uli` (Ulithian), `woe` (Woleaian) and `stw` (Satawalese) are
         * Trukic, the dialect chain `chk` sits at one end of; `mkj`
         * (Mokilese) is Pohnpeic beside `pon`. `kpg` (Kapingamarangi) and
         * `nkr` (Nukuoro) are the sharpest of all: they are *Polynesian*
         * languages spoken inside the Federated States of Micronesia, so
         * neither the Micronesian catalogs they share a country with nor the
         * Polynesian ones they share a family with is the right answer, and
         * nothing published says which. `pkp` (Pukapukan) is a Cook Islands
         * language beside `rar`, and `locales/rar`'s own header names it as a
         * language with a code of its own rather than a variety of
         * Rarotongan. `mrq` (Marquesan) is Eastern Polynesian beside `rar`.
         * `meu` (Motu) and `ho` (Hiri Motu) sit beside `bi` in Melanesia, and
         * `pih` (Pitkern) is the other English-lexified creole of the region.
         *
         * `fud` (East Futunan) is this batch's `fkv`, and it is sharper than
         * `fkv` was: it is not merely a sister of a catalogued language, it is
         * spoken in **the same territory** as `wls`. Wallis and Futuna has two
         * Polynesian languages and this batch catalogues one of them. Folding
         * Futunan onto Wallisian because they share a flag would be precisely
         * the judgement these maps exist to avoid.
         */
        it.each([
            "uli",
            "woe",
            "stw",
            "mkj",
            "kpg",
            "nkr",
            "pkp",
            "mrq",
            "meu",
            "ho",
            "pih",
            "fud",
        ])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        /**
         * The territory `wls` and `fud` share, and the reason a region can
         * never stand in for the language here. CLDR maximizes `und-WF` to
         * **French** — which is true of Wallis and Futuna's administration and
         * schooling, and is why `locales/wls`'s loans are French-mediated
         * where `locales/to`'s are English-mediated — so a host that knew only
         * the territory would reach `fr`, not `wls`. That is CLDR's answer
         * rather than a wrong one, and this row records it so that nobody
         * later "fixes" region handling into serving Wallisian to a reader who
         * only said where they were.
         */
        it("maximizes the batch's one shared territory to French, not to either of its languages", () => {
            expect(new Intl.Locale("und-WF").maximize().language).toBe("fr");
        });

        /**
         * `map` is left to miss for `smi`'s reason, one family up. It is the
         * ISO 639-5 collection over all Austronesian languages — every catalog
         * in this batch is inside it, and so are `ms`, `tl`-adjacent
         * catalogs, `mi`, `haw` and a dozen others — and CLDR has no opinion
         * about which of them a bare `map` means: it maximizes to nothing at
         * all. A collection covering a tenth of the world's languages is the
         * clearest possible case for leaving a tag to miss.
         */
        it("leaves the Austronesian collection code alone, because CLDR has no opinion about it", () => {
            const maximized = new Intl.Locale("map").maximize();
            expect(maximized.region).toBeUndefined();
            expect(maximized.script).toBeUndefined();
            expect(negotiateLocales([normalizeLocaleTag("map")], available)) //
                .toEqual(["en"]);
        });
    });

    /**
     * The European regional batch. Fifteen catalogs across three families, and
     * like the Oceania batch before it, one that **changes neither map** —
     * which is worth pinning rather than passing over, because this batch had
     * the clearest opportunity yet to change one and should not have taken it.
     *
     * `nn` is that opportunity. Nynorsk now has a catalog, and
     * {@link LANGUAGE_ALIASES} still sends `no` to `nb`. A reader who types
     * `no` has named the macrolanguage over both written standards and has not
     * said which of the two they read; Bokmål is what CLDR fills a bare `no` in
     * as, and pointing `no` at the new catalog would be the substitution the
     * `fat` row is left out for, in the other direction. The rows below hold
     * both halves: `nn` reaches its own catalog, and `no` still reaches `nb`
     * with `locales/nn` sitting right there — the second half living in the
     * Norwegian block above, which is where both standards are asserted.
     *
     * Two of the fifteen — `nn` and `li` — have ISO 639-1 codes, so a reader
     * can also arrive under the alpha-3 (`nno`, `lim`) that
     * `Intl.getCanonicalLocales` folds. Those rows are pinned because the
     * folding is ICU's rather than this repository's.
     */
    describe("the European regional batch", () => {
        /** The fifteen tags this batch adds, in the order the README lists them. */
        const EUROPEAN_REGIONAL = [
            "nn",
            "sco",
            "gsw",
            "ksh",
            "li",
            "fur",
            "vec",
            "lij",
            "pms",
            "nap",
            "hsb",
            "dsb",
            "csb",
            "szl",
            "rue",
        ];

        it.each<[string, string]>([
            // Each of the fifteen arriving as the directory it names.
            ...EUROPEAN_REGIONAL.map((locale): [string, string] => [
                locale,
                locale,
            ]),
            // The alpha-3 doors for the two with a 639-1 code, folded by
            // `Intl.getCanonicalLocales` rather than by anything here.
            ["nno", "nn"],
            ["lim", "li"],
            // Region tags, which filter without help.
            ["nn-NO", "nn"],
            ["sco-GB", "sco"],
            ["gsw-CH", "gsw"],
            ["ksh-DE", "ksh"],
            ["li-NL", "li"],
            ["li-BE", "li"],
            ["fur-IT", "fur"],
            ["vec-IT", "vec"],
            ["lij-IT", "lij"],
            ["pms-IT", "pms"],
            ["nap-IT", "nap"],
            ["hsb-DE", "hsb"],
            ["dsb-DE", "dsb"],
            ["csb-PL", "csb"],
            ["szl-PL", "szl"],
            ["rue-SK", "rue"],
            ["rue-UA", "rue"],
            // Script tags. Fourteen of the fifteen are Latin, so a `-Latn` is
            // redundant rather than a disambiguation and has to cost nothing;
            // `rue` is the batch's one Cyrillic catalog and `-Cyrl` has to cost
            // nothing there for the same reason.
            ["nn-Latn", "nn"],
            ["szl-Latn", "szl"],
            ["rue-Cyrl", "rue"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The batch that changed no map, asserted as such. Each of the fifteen
         * reaches its own catalog when the whole roster is on offer *and*
         * English when only English is — the second half being what would fail
         * if some entry were quietly folding one of these tags onto a
         * neighbour.
         */
        it("folds none of the fifteen onto another catalog", () => {
            for (const locale of EUROPEAN_REGIONAL) {
                expect(negotiateLocales([locale], ["en"])).toEqual(["en"]);
                expect(negotiateLocales([locale], available)).toEqual([
                    locale,
                    "en",
                ]);
            }
        });

        /**
         * The near misses, and this batch's are the densest the roster has
         * had, because Europe's regional languages sit in continua rather than
         * on islands.
         *
         * `bar` (Bavarian), `swg` (Swabian) and `wae` (Walser) are the
         * neighbours of `gsw`; `wae` is spoken *inside Switzerland* and is
         * still a language with a code of its own. `pfl` and `yec` sit beside
         * `ksh` in and around the Rhineland. `stq` and `frr` are the
         * Frisian languages beside `li`, and `vls` and `zea` the Low Franconian
         * ones. `lmo`, `rgn`, `cim` and `mhn` are the Italian neighbours of
         * `vec`, `lij`, `pms`, `nap` and `fur` — `cim` and `mhn` being Germanic
         * languages spoken inside Italy, so neither the country's catalogs nor
         * the family's is the right answer. `mwl`, `ext`, `an` and `wa` are
         * Romance languages with no catalog here at all. `sgs` and `ltg` are
         * the Baltic pair. `pdc` and `hrx` are German diaspora languages whose
         * speakers are nowhere near any of these.
         *
         * Not one of them is folded, and none should be: the moment membership
         * becomes a judgement about how close two varieties sound, nothing in
         * these maps is checkable any more.
         */
        it.each([
            "bar",
            "swg",
            "wae",
            "pfl",
            "yec",
            "stq",
            "frr",
            "vls",
            "zea",
            "lmo",
            "rgn",
            "cim",
            "mhn",
            "mwl",
            "ext",
            "an",
            "wa",
            "sgs",
            "ltg",
            "pdc",
            "hrx",
        ])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        /**
         * Alsatian is the batch's `alq`: the nearest miss that is not a miss
         * at all. `gsw-FR` is Alsatian, and ISO puts it *inside* `gsw` rather
         * than beside it, so it reaches `locales/gsw` and gets the
         * Zurich-based koine that catalog is written in. That is the same
         * trade region-stripping already makes for `es-MX`, and
         * `locales/gsw`'s own header says which variety it is so a reader can
         * tell what they were served.
         */
        it("serves an Alsatian reader the Swiss German catalog, as ISO groups them", () => {
            expect(negotiateLocales([normalizeLocaleTag("gsw-FR")], available)) //
                .toEqual(["gsw", "en"]);
        });

        /**
         * `rue` is the batch's one Cyrillic catalog, and CLDR maximizes it to
         * **Ukraine** — while the codification `locales/rue` is written in is
         * the Prešov one, standardized in Slovakia. That is CLDR's answer
         * rather than a wrong one, and it is recorded rather than worked
         * around: a host that knew only the region would not reach this
         * catalog through it, and nobody should later "fix" region handling
         * into assuming otherwise. It is the `und-WF`-maximizes-to-French row
         * of the Oceania batch, one batch on.
         */
        it("maximizes Rusyn to Ukraine, not to the state its codification comes from", () => {
            expect(new Intl.Locale("rue").maximize().region).toBe("UA");
            expect(negotiateLocales([normalizeLocaleTag("rue-SK")], available)) //
                .toEqual(["rue", "en"]);
        });

        /**
         * `eml` is left to miss for `map`'s reason. Emilian-Romagnol is the
         * one tag in this region CLDR has **no data of any kind** for: it
         * maximizes to nothing at all and `Intl.DisplayNames` has no name for
         * it in any language. A tag ICU cannot place is the clearest possible
         * case for leaving it alone rather than guessing which of `lij`, `vec`
         * or `pms` its reader would rather have.
         */
        it("leaves Emilian-Romagnol alone, because CLDR has no opinion about it", () => {
            const maximized = new Intl.Locale("eml").maximize();
            expect(maximized.region).toBeUndefined();
            expect(maximized.script).toBeUndefined();
            expect(negotiateLocales([normalizeLocaleTag("eml")], available)) //
                .toEqual(["en"]);
        });
    });
});

/**
 * The three catalogs named after a member of a macrolanguage rather than after
 * the macrolanguage, and the ICU behaviour that makes the naming possible only
 * with a {@link LANGUAGE_ALIASES} row behind it.
 *
 * `kmr`, `kpv` and `mhr` are not tags ICU will carry: it canonicalizes each one
 * straight back onto `ku`, `kv` and `chm`, so `normalizeLocaleTag` has rewritten
 * a hand-typed `<document lang="kmr">` before negotiation ever runs. A
 * directory named `kmr` is therefore unreachable under *both* names unless
 * something maps the macrolanguage forward onto it — which is the opposite of
 * the `koi`/`mrj` case, where the alias had to be *removed* for the member's
 * own catalog to win.
 *
 * These rows are the ones that fail if someone deletes those three alias
 * entries as redundant, or if a future ICU stops folding the member codes and
 * makes them look unnecessary. Both halves are asserted: the canonicalization
 * itself, so the reason is visible, and the negotiation result, so the
 * consequence is.
 */
describe("a catalog named after a macrolanguage member", () => {
    const available = ["kmr", "kpv", "mhr", "ckb", "koi", "mrj", "en"];

    it.each([
        ["kmr", "ku"],
        ["kpv", "kv"],
        ["mhr", "chm"],
    ])(
        "has its own tag canonicalized onto %s's macrolanguage",
        (member, macro) => {
            expect(normalizeLocaleTag(member)).toBe(macro);
        },
    );

    it.each([
        // The member's own tag, which only arrives because the alias catches it
        // after ICU has rewritten it.
        ["kmr", "kmr"],
        ["kpv", "kpv"],
        ["mhr", "mhr"],
        // The macrolanguage code, which is what an author is most likely to
        // type and what a browser is most likely to send.
        ["ku", "kmr"],
        ["kv", "kpv"],
        ["chm", "mhr"],
    ])("reaches the catalog when asked for as %s", (requested, expected) => {
        expect(
            negotiateLocales([normalizeLocaleTag(requested)], available),
        ).toEqual([expected, "en"]);
    });

    /**
     * The sibling each rename was made for. A member with a catalog of its own
     * still wins over the one named after the macrolanguage — `ckb` beside
     * Kurmanji, `koi` beside Zyrian, `mrj` beside Meadow Mari — which is the
     * property that makes naming the directory after the narrower language
     * honest rather than merely tidier.
     */
    it.each([
        ["ckb", "ckb"],
        ["koi", "koi"],
        ["mrj", "mrj"],
    ])("leaves %s reaching its own catalog", (requested, expected) => {
        expect(
            negotiateLocales([normalizeLocaleTag(requested)], available),
        ).toEqual([expected, "en"]);
    });
});

/**
 * A host's own catalogs beat an alias, which is the property that makes adding
 * an alias to a tag that already worked a safe change rather than a silent
 * regression.
 *
 * `available` is not only this repository's roster. A host supplies catalogs
 * through `localeResources`, keyed however it likes, and the documented
 * contract is that those win. So aliasing has to *add* a fallback rather than
 * replace the tag: rewriting `ku` to `kmr` before matching would mean a host
 * catalog keyed `ku` was never compared against anything, and its reader got
 * English while their translation sat in memory.
 *
 * The three catalogs named after a macrolanguage member are where this bites,
 * because `ku`, `kv` and `chm` are all tags a host may already be keying a
 * catalog on — but the rows below cover the older aliases too, since the same
 * hazard has always applied to them.
 */
describe("a host catalog keyed on an aliased tag", () => {
    it.each([
        // The three tags whose catalogs took their member's name.
        ["ku", "kmr"],
        ["kv", "kpv"],
        ["chm", "mhr"],
        // The aliases that predate them, which have the same shape.
        ["no", "nb"],
        ["tw", "ak"],
        ["man", "mnk"],
        // And a macrolanguage member fold, which reaches the same code path.
        ["quz", "qu"],
    ])(
        "prefers the host's own %s catalog over the %s it aliases to",
        (asked, alias) => {
            // Supplied under the tag the host asked for, and nothing else: the
            // host's catalog answers rather than English.
            expect(negotiateLocales([asked], [asked, "en"])).toEqual([
                asked,
                "en",
            ]);
            // Supplied under both: the host's own key still wins, with the alias
            // behind it rather than instead of it.
            expect(negotiateLocales([asked], [asked, alias, "en"])).toEqual([
                asked,
                alias,
                "en",
            ]);
            // Supplied under neither: the alias is what carries the request, which
            // is the behaviour the alias exists for.
            expect(negotiateLocales([asked], [alias, "en"])).toEqual([
                alias,
                "en",
            ]);
        },
    );

    /**
     * The limit of what an alias can do, pinned so that it is documented
     * rather than discovered.
     *
     * An alias cannot tell the macrolanguage tag from the member tag, because
     * by the time negotiation runs there is nothing to tell apart:
     * `normalizeLocaleTag` has already folded `kmr` to `ku` — ICU's
     * canonicalization, the very thing these aliases exist to work around — so
     * `<document lang="kmr">` and `<document lang="ku">` arrive as the same
     * request. A host supplying catalogs under *both* keys gets the
     * macrolanguage one either way.
     *
     * This is not something the aliases introduced. `kmr` folded to `ku`
     * before this repository had a `locales/kmr` to fold it onto, and
     * `resolveDocumentLocale` reported `ku` for an authored `kmr` on `main`
     * too. Undoing it would mean `normalizeLocaleTag` declining to
     * canonicalize these three subtags, which changes what a normalized tag
     * means everywhere and is a separate decision from this one.
     */
    it.each([
        ["kmr", "ku"],
        ["kpv", "kv"],
        ["mhr", "chm"],
    ])(
        "cannot distinguish an authored %s from the macrolanguage it folds to",
        (member, macro) => {
            // The fold happens in the viewer, before negotiation sees it.
            expect(resolveDocumentLocale(member, undefined)).toBe(macro);
            expect(resolveDocumentLocale(macro, undefined)).toBe(macro);
            // So both authored tags produce the same chain, and a host that
            // offers both keys is answered with the macrolanguage's.
            const hostOffersBoth = [macro, member, "en"];
            for (const authored of [member, macro]) {
                expect(
                    negotiateLocales(
                        [resolveDocumentLocale(authored, undefined)],
                        hostOffersBoth,
                    ),
                ).toEqual([macro, member, "en"]);
            }
        },
    );

    /**
     * The bundled case, spelled out separately because it is the one the
     * roster actually exercises: this repository ships no `ku`, `kv` or `chm`
     * directory any more, so a request under the macrolanguage code has only
     * the alias to reach.
     */
    it.each([
        ["ku", "kmr"],
        ["kv", "kpv"],
        ["chm", "mhr"],
    ])("reaches the bundled %s catalog as %s", (asked, expected) => {
        expect(
            negotiateLocales([normalizeLocaleTag(asked)], available),
        ).toEqual([expected, "en"]);
    });

    /**
     * The Silk Road. Fifteen catalogs strung between the Black Sea and the
     * Pamirs, and the batch that brings back the shape the two before it —
     * Oceania and the European regional one — both did without: two of the
     * fifteen are **macrolanguages**, and they are the only entries this batch
     * added to `MACROLANGUAGE_MEMBERS`, which neither of those two touched at
     * all.
     *
     * `zza` (Zaza) and `bal` (Balochi) each stand over members ICU splits in
     * half. `Intl.getCanonicalLocales` already folds exactly one member of
     * each onto the macrolanguage — `diq` onto `zza`, `bcc` onto `bal` — and
     * leaves the rest unresolvable, which is the same one-of-each split `quz`
     * and `ojg` showed in earlier batches. So `kiu`, `bgn` and `bgp` reach a
     * catalog *only* because the map lists them. The rows below assert both
     * halves separately, because the two mechanisms fail differently: an ICU
     * data change breaks the first, an edit to `src/negotiate.ts` the second,
     * and a test that only checked the negotiation result could not tell which
     * had happened.
     *
     * The other thirteen are individual languages that reached English on
     * their own account before this batch and reach their own catalog now.
     */
    describe("the Silk Road batch", () => {
        /** The fifteen tags this batch adds, in the order the README lists them. */
        const SILK_ROAD = [
            "crh",
            "gag",
            "ttt",
            "kaa",
            "kjh",
            "alt",
            "mzn",
            "glk",
            "lrc",
            "bal",
            "haz",
            "zza",
            "dng",
            "sgh",
            "wbl",
        ];

        /**
         * Every one of the fifteen reaches the directory it names when the
         * whole roster is on offer, and reaches English when only English is —
         * the second half being what would fail if some entry were quietly
         * folding one of these tags onto a neighbour instead of letting it
         * arrive under its own name.
         */
        it("gives each of the fifteen its own catalog and nothing else", () => {
            for (const locale of SILK_ROAD) {
                expect(negotiateLocales([locale], ["en"])).toEqual(["en"]);
                expect(negotiateLocales([locale], available)).toEqual([
                    locale,
                    "en",
                ]);
            }
        });

        /**
         * The half ICU does. `diq` and `bcc` never reach
         * `MACROLANGUAGE_MEMBERS` at all: `normalizeLocaleTag` has already
         * rewritten them to the macrolanguage before negotiation is consulted,
         * so their entries in the map are documentation of a fact rather than
         * the thing that makes them work. Asserting the canonicalization
         * itself is what tells a later reader which of the two mechanisms is
         * carrying the row.
         */
        it.each([
            ["diq", "zza"],
            ["bcc", "bal"],
        ])(
            "has ICU fold %s onto %s before negotiation sees it",
            (member, macro) => {
                expect(normalizeLocaleTag(member)).toBe(macro);
                expect(
                    negotiateLocales([normalizeLocaleTag(member)], available),
                ) //
                    .toEqual([macro, "en"]);
            },
        );

        /**
         * The half this repository does. ICU leaves all three of these tags
         * exactly as typed — `normalizeLocaleTag("kiu")` is still `"kiu"` —
         * so without their rows in `MACROLANGUAGE_MEMBERS` each would filter
         * against a language subtag no directory is named for and fall to
         * English.
         *
         * `kiu` is the sharper one: Northern Zazaki (Kirmanckî) is the very
         * variety `locales/zza` leans toward, so the member ICU cannot resolve
         * is the one whose speakers the catalog was written for.
         */
        it.each([
            ["kiu", "zza"],
            ["bgn", "bal"],
            ["bgp", "bal"],
        ])(
            "reaches %s's catalog as %s only because the map lists it",
            (member, macro) => {
                expect(normalizeLocaleTag(member)).toBe(member);
                expect(
                    negotiateLocales([normalizeLocaleTag(member)], available),
                ).toEqual([macro, "en"]);
            },
        );

        /**
         * The near misses. The European regional block above has more of them
         * — Europe's continua leave twenty-one tags to miss against this
         * corridor's twelve — but these are of a different kind: every catalog
         * here has a close relative that did *not* get one, often inside its
         * own subgroup.
         *
         * `luz` (Southern Luri) and `bqi` (Bakhtiari) sit beside `lrc`
         * (Northern Luri) and are the other two Luri codes; ISO 639-3 makes
         * all three separate languages rather than members of a macrolanguage,
         * so there is nothing to fold and no published fact saying that a
         * Bakhtiari reader should be served the Northern Luri catalog.
         *
         * `sgy` (Sanglechi), `yah` (Yazghulami), `ydg` (Yidgha), `srh`
         * (Sarikoli) and `isk` (Ishkashimi) are the other Pamiri languages
         * beside `sgh` (Shughni), and `khw` (Khowar) is the Dardic neighbour
         * of `wbl` (Wakhi). Sharing the Pamirs is not sharing a language, and
         * `srh` is the sharpest of them: it maximizes into China, in the Arabic
         * script, where `locales/sgh` is Cyrillic for Tajikistan.
         *
         * `slr` (Salar), `uum` (Urum) and `cjs` (Shor) are Turkic languages
         * beside the batch's five Turkic catalogs, and `azb` (South
         * Azerbaijani) is the one that would be easiest to get wrong: it is
         * beside `az`, which the roster *does* have, and the two are written in
         * different scripts — `locales/az` is Latin for the republic, `azb`
         * maximizes to `azb-Arab-IR` — so folding it would serve an Iranian
         * reader an alphabet they do not use. `jdt` (Judeo-Tat) is the last of
         * them and the one `locales/ttt`'s own header names: a separate written
         * tradition rather than a variety of Muslim Tat, so it is left to fall
         * to English rather than served that catalog.
         */
        it.each([
            "luz",
            "bqi",
            "jdt",
            "sgy",
            "yah",
            "ydg",
            "srh",
            "isk",
            "khw",
            "slr",
            "uum",
            "cjs",
            "azb",
        ])(
            "leaves %s on English rather than folding it onto a neighbour",
            (requested) => {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(requested)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        /**
         * The collection codes, left to miss for `map`'s and `smi`'s reason.
         * `trk` (Turkic), `ira` (Iranian) and `tut` (Altaic) are ISO 639-5
         * *collections* rather than languages — this batch alone is five
         * languages inside `trk` and eight inside `ira` — and CLDR has no
         * opinion about which member a bare one of them means: each maximizes
         * to nothing at all, no script and no region. A tag that names a
         * family cannot be answered with one family member's catalog, so all
         * three are left to fall to English.
         */
        it.each(["trk", "ira", "tut"])(
            "leaves the %s collection code alone, because CLDR has no opinion about it",
            (collection) => {
                const maximized = new Intl.Locale(collection).maximize();
                expect(maximized.region).toBeUndefined();
                expect(maximized.script).toBeUndefined();
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(collection)],
                        available,
                    ),
                ).toEqual(["en"]);
            },
        );

        it.each([
            // Region tags, which filter without help. Every one of the fifteen
            // maximizes to a region, and the batch spans eleven countries.
            ["crh-UA", "crh"],
            ["gag-MD", "gag"],
            ["ttt-AZ", "ttt"],
            ["kaa-UZ", "kaa"],
            ["kjh-RU", "kjh"],
            ["alt-RU", "alt"],
            ["mzn-IR", "mzn"],
            ["glk-IR", "glk"],
            ["lrc-IR", "lrc"],
            ["bal-PK", "bal"],
            ["haz-AF", "haz"],
            ["zza-TR", "zza"],
            ["dng-KG", "dng"],
            ["sgh-TJ", "sgh"],
            ["wbl-PK", "wbl"],
            // Wakhi is spoken across four borders and CLDR picks Pakistan;
            // a reader who says Afghanistan reaches the same catalog, because
            // the region subtag is filtered away rather than matched.
            ["wbl-AF", "wbl"],
            // Script tags. Both scripts reach the one catalog either way, and
            // the pair below is the asymmetry CLDR's own maximization creates.
            ["crh-Latn", "crh"],
            ["crh-Cyrl", "crh"],
            ["kaa-Latn", "kaa"],
            ["zza-Latn", "zza"],
            ["bal-Arab", "bal"],
            ["wbl-Latn", "wbl"],
            ["crh-Latn-UA", "crh"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The script asymmetry, which this batch owes twice over in the same
         * direction — the `locales/ha` and `locales/kr` shape, in a corridor
         * where two alphabets are official at once rather than one being an
         * older layer.
         *
         * `crh` maximizes to **`crh-Cyrl-UA`** and `kaa` to **`kaa-Cyrl-UZ`**,
         * so CLDR's own data says the likeliest Crimean Tatar and Karakalpak
         * readers arrive in Cyrillic. Both catalogs are written in **Latin** —
         * the 2021 Ukrainian standard and Karakalpakstan's current schoolbook
         * alphabet respectively — and both headers say so and tell a reviewer
         * who prefers Cyrillic to transliterate all four files at once rather
         * than mix alphabets.
         *
         * That is a debt the roster records rather than a bug in negotiation:
         * region and script subtags are filtered away, so a `-Cyrl` request is
         * served Latin instead of missing, and the answer to it is a second
         * catalog rather than a change here. The other Cyrillic-maximizing
         * members of the batch — `kjh`, `alt`, `dng`, `sgh` — have no such
         * debt, because their catalogs *are* Cyrillic.
         */
        it("serves Latin catalogs to the two tags CLDR maximizes into Cyrillic", () => {
            expect(new Intl.Locale("crh").maximize().script).toBe("Cyrl");
            expect(new Intl.Locale("kaa").maximize().script).toBe("Cyrl");
            for (const locale of ["crh", "kaa"]) {
                expect(
                    negotiateLocales(
                        [normalizeLocaleTag(`${locale}-Cyrl`)],
                        available,
                    ),
                ).toEqual([locale, "en"]);
            }
            // …and the four whose catalogs match their maximization, so that
            // the pair above reads as the exception it is.
            for (const locale of ["kjh", "alt", "dng", "sgh"]) {
                expect(new Intl.Locale(locale).maximize().script).toBe("Cyrl");
            }
        });
    });
});

describe("resolveDocumentLocale", () => {
    it("prefers the authored lang over the host's locale", () => {
        expect(resolveDocumentLocale("fr", "es-MX")).toBe("fr");
    });

    it("falls back to the host's locale, then to English", () => {
        expect(resolveDocumentLocale(undefined, "es-MX")).toBe("es-MX");
        expect(resolveDocumentLocale(undefined, undefined)).toBe("en");
    });

    it("treats blank and null as absent", () => {
        expect(resolveDocumentLocale("  ", "de")).toBe("de");
        expect(resolveDocumentLocale(null, null)).toBe("en");
        expect(resolveDocumentLocale("", "")).toBe("en");
    });

    it("normalizes whatever it returns", () => {
        expect(resolveDocumentLocale("ES-mx", undefined)).toBe("es-MX");
        expect(resolveDocumentLocale(undefined, "PT-br")).toBe("pt-BR");
    });

    /**
     * The Americas. Fifteen catalogs between Greenland and the Guianas, and
     * the batch whose one `MACROLANGUAGE_MEMBERS` entry is there to record an
     * **exclusion** rather than to rescue a member.
     *
     * `iu` (Inuktitut) is the only macrolanguage among the fifteen, and ISO
     * 639-3 gives it exactly two members: `ike` (Eastern Canadian Inuktitut)
     * and `ikt` (Inuinnaqtun). ICU folds `ike` on its own, so the entry
     * `iu: ["ike"]` changes no negotiation result at all — it is the shape
     * `quz`, `ojg` and `gug` already have, a listed member that would have
     * arrived anyway, written down so the list is the whole of a group rather
     * than the leftovers of one.
     *
     * **`ikt` is left out, and the reason is the script.** Inuinnaqtun is
     * written in roman letters; `locales/iu` is written wholly in Canadian
     * Aboriginal syllabics and contains no roman-letter Inuktitut word
     * anywhere. Folding `ikt` would hand a reader a catalog in a script they
     * do not read, which is a worse answer than the English fallback. That is
     * a third kind of exclusion from this map: `kbl` under `kr` and `alq`
     * under `oj` are excluded because published membership does not cover
     * them, `bam` and `dyu` under `mnk` because they have catalogs of their
     * own, and `ikt` because the catalog cannot serve a member it does cover.
     * The rows below assert both halves, because they fail differently — an
     * ICU data change breaks the first, an edit to `src/negotiate.ts` the
     * second.
     *
     * The other fourteen are individual languages that reached English on
     * their own account before this batch and reach their own catalog now.
     * Nine of the fifteen are creoles, and a creole tag is exactly the kind
     * this map cannot help: a creole is not a member of its lexifier, so
     * nothing folds `gcf` onto `fr` or `jam` onto `en`, and nothing should.
     */
    describe("the Americas batch", () => {
        /** The fifteen tags this batch adds, in the order the README lists them. */
        const AMERICAS = [
            "kl",
            "iu",
            "yua",
            "kek",
            "cab",
            "miq",
            "pap",
            "srn",
            "jam",
            "gcf",
            "acf",
            "gcr",
            "bzj",
            "djk",
            "srm",
        ];

        /**
         * Every one of the fifteen reaches the directory it names when the
         * whole roster is on offer, and reaches English when only English is —
         * the second half being what would fail if some entry were quietly
         * folding one of these tags onto a neighbour instead of letting it
         * arrive under its own name.
         */
        it("gives each of the fifteen its own catalog and nothing else", () => {
            for (const locale of AMERICAS) {
                expect(negotiateLocales([locale], ["en"])).toEqual(["en"]);
                expect(negotiateLocales([locale], available)).toEqual([
                    locale,
                    "en",
                ]);
            }
        });

        /**
         * The half ICU does. `ike` never reaches `MACROLANGUAGE_MEMBERS` at
         * all: `normalizeLocaleTag` has already rewritten it to `iu` before
         * negotiation is consulted, so its entry in the map documents a fact
         * rather than carrying the row.
         */
        it("has ICU fold ike onto iu before negotiation sees it", () => {
            expect(normalizeLocaleTag("ike")).toBe("iu");
            expect(negotiateLocales([normalizeLocaleTag("ike")], available)) //
                .toEqual(["iu", "en"]);
        });

        /**
         * The exclusion, asserted as a negotiation result rather than as an
         * absent map entry, so that adding `ikt` to the list fails here
         * instead of silently changing what an Inuinnaqtun reader is served.
         * ICU leaves the tag exactly as typed, which is what makes the map the
         * only thing that could fold it.
         */
        it("leaves ikt on English rather than serving it a syllabics catalog", () => {
            expect(normalizeLocaleTag("ikt")).toBe("ikt");
            expect(negotiateLocales(["ikt"], available)).toEqual(["en"]);
        });

        /**
         * `locales/iu` is syllabics and CLDR agrees: `iu` maximizes to
         * `iu-Cans-CA`, so a reader arriving under a bare `iu` or under
         * `iu-Cans` gets a script they can read. `iu-Latn` is the asymmetry
         * `pa`, `sr` and `ha` already have — a reader in the other script
         * reaching the catalog written in this one — and the answer to it is a
         * second catalog rather than a rename of the first.
         */
        it("agrees with CLDR that iu is written in syllabics", () => {
            expect(new Intl.Locale("iu").maximize().script).toBe("Cans");
            expect(negotiateLocales(["iu-Latn"], available)).toEqual([
                "iu",
                "en",
            ]);
        });

        /**
         * The fourteen Latin-script catalogs agree with CLDR about their own
         * script, so none of them has `iu`'s asymmetry. Asserted as a group
         * because the interesting case is a future ICU build moving one of
         * them, not any one row today.
         */
        it("has CLDR agree that the other fourteen are written in Latin", () => {
            for (const locale of AMERICAS.filter((tag) => tag !== "iu")) {
                expect(new Intl.Locale(locale).maximize().script).toBe("Latn");
            }
        });

        /**
         * A creole is not a member of its lexifier, and nothing here pretends
         * otherwise: a reader who asks for French is served French even though
         * three French-lexifier creoles now have catalogs, and the same for
         * English, Dutch and Spanish. This is what would break if someone
         * decided a missing lexifier catalog should fall back to a creole, or
         * the reverse.
         */
        it.each([
            ["fr", "fr"],
            ["en", "en"],
            ["nl", "nl"],
            ["es", "es"],
        ])(
            "keeps %s on its own catalog rather than on a creole",
            (tag, expected) => {
                expect(negotiateLocales([tag], available)[0]).toBe(expected);
            },
        );
    });
});

describe("resolveUiLocale", () => {
    it("follows the content's language when the host configures none", () => {
        // A fully Spanish activity is fully Spanish out of the box.
        expect(resolveUiLocale(undefined, "es-MX")).toBe("es-MX");
        expect(resolveUiLocale(null, "en")).toBe("en");
    });

    it("lets the host set the chrome's language separately", () => {
        expect(resolveUiLocale("es", "fr")).toBe("es");
    });

    it("treats a blank tag as unset", () => {
        expect(resolveUiLocale("   ", "fr")).toBe("fr");
        expect(resolveUiLocale("", "fr")).toBe("fr");
    });

    it("normalizes what it returns, so the chrome negotiates like the content", () => {
        expect(resolveUiLocale("ES-mx", "fr")).toBe("es-MX");
    });
});

describe("normalizeLocaleTag", () => {
    it("canonicalizes casing so hand-typed lang attributes negotiate", () => {
        expect(normalizeLocaleTag("ES-mx")).toBe("es-MX");
        expect(normalizeLocaleTag("  en  ")).toBe("en");
    });

    it("leaves unparseable tags alone rather than throwing", () => {
        expect(normalizeLocaleTag("not a locale")).toBe("not a locale");
        expect(normalizeLocaleTag("")).toBe("");
    });

    it("produces a tag that negotiates against a differently-cased catalog", () => {
        expect(
            negotiateLocales([normalizeLocaleTag("es-mx")], ["es-MX", "en"]),
        ).toEqual(["es-MX", "en"]);
    });
});
