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
     * Norwegian's catalog is named `nb`, but `no` is the tag an author is
     * likeliest to type and one several browsers still send. Nothing in
     * filtering negotiation connects the two, so the alias is asserted here
     * against the real roster.
     */
    describe("Norwegian, whose catalog is named for one written standard", () => {
        it.each(["no", "no-NO", "nb", "nb-NO"])(
            "serves Bokmål to %s",
            (requested) => {
                expect(negotiateLocales([requested], available)).toEqual([
                    "nb",
                    "en",
                ]);
            },
        );

        it("leaves Nynorsk to fall back to English", () => {
            expect(negotiateLocales(["nn"], available)).toEqual(["en"]);
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
         * The near misses. `kmb` (Kimbundu) and `umb` (Umbundu) are Bantu
         * neighbours of `lua` and `ktu`; `kbl` (Kanembu) is the language beside
         * Kanuri that ISO 639-3 keeps *outside* the `kr` macrolanguage; `gur`
         * (Farefare) and `xsm` (Kasem) are Gur languages beside `mos` and
         * `dag`; `sus` (Susu) is Mande but not Manding. Every one falls to
         * English, which is the membership rule working rather than a gap in
         * it.
         */
        // `kmb` and `umb` were on this list until the Angolan batch below gave
        // Kimbundu and Umbundu catalogs of their own — the same removal `men`
        // and `nyn` got, and the only thing that should ever shorten a
        // negative-control list.
        it.each(["kbl", "gur", "xsm", "sus"])(
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
         * The near misses for this batch. `bin` (Edo) and `efi` (Efik) are
         * Nigerian neighbours of `pcm` and `tiv`; `men` (Mende) is a Sierra
         * Leonean neighbour of `kri` and `tem`; `gej` (Gen) is a Gbe language
         * beside `fon` and `ee`. Every one falls to English rather than being
         * folded onto a language it is merely near.
         *
         * `son` is here for a different reason and is the interesting row: it
         * is the ISO 639-3 macrolanguage over the Songhay varieties, and this
         * repository has no catalog for any of them. It is *not* aliased the
         * way `man` is, because the justification `man`'s entry rests on does
         * not exist here — `new Intl.Locale("son").maximize()` adds no region,
         * so CLDR has no opinion about which variety a bare `son` means, and
         * picking one would be the judgement these maps avoid.
         */
        // `men` was on this list until the batch below gave Mende a catalog of
        // its own, which is the only thing that should ever take a code off a
        // negative-control list — the same removal `nyn` got a batch earlier.
        it.each(["bin", "efi", "gej", "son"])(
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

        it("has no CLDR region for `son`, which is why it is not aliased", () => {
            expect(new Intl.Locale("son").maximize().region).toBeUndefined();
        });
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
         * Bantu neighbours of `kmb` and `umb`; `kpe` (Kpelle) sits beside
         * `men` in Sierra Leone and is Mande like it without being a variety
         * of it. Every one falls to English, which is the membership rule
         * working rather than a gap in it.
         */
        it.each(["lol", "cjk", "kpe"])(
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
