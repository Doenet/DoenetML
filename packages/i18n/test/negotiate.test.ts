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
     * Three of the twelve are ISO 639-3 macrolanguages and go in
     * `MACROLANGUAGE_MEMBERS` — `bua`, `kv` and `chm` — which is the largest
     * number any one batch has added. The other nine are individual languages
     * that filter unaided, so the batch adds no `LANGUAGE_ALIASES` entry at
     * all.
     */
    describe("the Russian Federation batch", () => {
        it.each([
            // The three macrolanguages. In each, the first member listed is the
            // one `Intl.getCanonicalLocales` folds on its own and the rest
            // reach the catalog only because `MACROLANGUAGE_MEMBERS` names
            // them.
            //
            // `koi` and `mrj` stood beside `kpv` and `mhr` here until the
            // Uralic north batch gave each of them a catalog and took it out
            // of its macrolanguage's member list. Their rows moved to that
            // batch's `describe` below, where they now assert the opposite:
            // that each reaches *its own* catalog rather than its sibling's.
            ["bxr", "bua"],
            ["bxm", "bua"],
            ["bxu", "bua"],
            ["kpv", "kv"],
            ["mhr", "chm"],
            // The ISO 639-3 codes ICU canonicalizes to a 639-1 code on its own.
            ["bak", "ba"],
            ["chv", "cv"],
            ["udm", "udm"],
            ["kom", "kv"],
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
            ["kv-RU", "kv"],
            ["myv-RU", "myv"],
            ["chm-RU", "chm"],
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
     * question it raises that no earlier batch did is what happens when a
     * macrolanguage and one of its own members both have a catalog.
     *
     * `ku` is Northern Kurdish (Kurmanji) in Latin and `ckb` is Central Kurdish
     * (Sorani) in the Perso-Arabic script. ISO 639-3 makes `ckb` a member of
     * the `ku` macrolanguage, so the naive entry would fold it — and would
     * serve a Sorani reader a script they do not read while their own catalog
     * sat on disk. `MACROLANGUAGE_MEMBERS` therefore lists `ku`'s other two
     * members and excludes `ckb`, which is `locales/mnk` excluding `bam` and
     * `dyu` arriving on a key that is the macrolanguage rather than a member of
     * one.
     *
     * The other thirteen are individual languages that filter unaided, so the
     * batch adds no `LANGUAGE_ALIASES` entry at all.
     */
    describe("the Caucasus and Kurdish batch", () => {
        it.each([
            // The macrolanguage. `kmr` is the member ICU folds on its own;
            // `sdh` reaches the catalog only because the map names it.
            ["ku", "ku"],
            ["kmr", "ku"],
            ["sdh", "ku"],
            // …and the member that is deliberately not folded, because it
            // answers for itself.
            ["ckb", "ckb"],
            // The ISO 639-3 codes ICU canonicalizes to a 639-1 code on its own.
            ["abk", "ab"],
            ["ava", "av"],
            ["kur", "ku"],
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
            ["ku-TR", "ku"],
            ["ku-SY", "ku"],
            ["ckb-IQ", "ckb"],
            ["ckb-IR", "ckb"],
            // Script asymmetries. The twelve Caucasian catalogs are Cyrillic,
            // `ku` and `tly` are Latin and `ckb` is Perso-Arabic, so a reader
            // arriving under the other script of their own language reaches the
            // catalog and gets the one it is written in — the answer
            // `locales/pa`, `locales/sr` and `locales/ha` already give, and the
            // answer to it is a second catalog rather than a rename of this
            // one.
            ["ku-Arab", "ku"],
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
                .toEqual(["ku", "en"]);
        });

        /**
         * The near misses. `lki` (Laki) is the sharpest: it is written in the
         * same script as `ckb`, is often described as a variety of Southern
         * Kurdish, and ISO 639-3's macrolanguage mapping still gives it a code
         * outside `kur` — so it falls back, exactly as `alq` does beside `oj`.
         * `zza` (Zaza) is the same shape one family over. `agx` (Aghul) is
         * Lezgic beside `lez` and `tab`, `ddo` (Tsez) is Avar's neighbour in
         * Dagestan, and `xmf` (Mingrelian) and `sva` (Svan) are Kartvelian
         * beside `ab` without belonging to any macrolanguage with a catalog.
         *
         * Every one falls to English, which is the membership rule working
         * rather than a gap in it — the moment "is spoken next to" decides the
         * map, nothing in it is checkable any more.
         */
        it.each(["lki", "zza", "agx", "ddo", "xmf", "sva"])(
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
     * their own sat on disk. The members that stayed — `kpv` and `mhr`, which
     * still have no catalog — keep their rows in the Russian Federation batch
     * above, so removing too much from either list fails there.
     */
    describe("the Uralic north batch", () => {
        it.each([
            // The two members that left `MACROLANGUAGE_MEMBERS` in this batch,
            // and the sister that was pinned on English by the Russian
            // Federation batch until this one wrote it a catalog.
            ["koi", "koi"],
            ["mrj", "mrj"],
            ["mdf", "mdf"],
            // …and the macrolanguage tags themselves, untouched by any of it.
            ["kv", "kv"],
            ["chm", "chm"],
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
         * this batch, `koi` and `mrj` were rewritten to `kv` and `chm` by
         * `applyLanguageAlias` *before* negotiation ever saw them, so a
         * `locales/koi` on disk would have been unreachable. The rows above
         * would pass either way if the alias happened to be gone; this one
         * says why it has to be.
         */
        it("stops folding a member the moment it has a catalog of its own", () => {
            for (const [member, macro] of [
                ["koi", "kv"],
                ["mrj", "chm"],
            ]) {
                // Offered *both* catalogs, the member's own wins — which it
                // cannot do if the tag is rewritten before negotiation.
                expect(
                    negotiateLocales([member], [macro, member, "en"]),
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
     * Oceania. Fifteen catalogs across Micronesia, Polynesia and Melanesia,
     * and the negotiation question it raises is neither of the last two
     * batches'.
     *
     * The Caucasus batch had to keep a member *out* of a list; the Uralic
     * north had to **take two out** of lists they were already in. This batch
     * touches `MACROLANGUAGE_MEMBERS` not at all, and that is the fact
     * worth pinning rather than passing over: not one of the fifteen is a
     * macrolanguage, and not one was being folded onto a wider code before
     * this batch, so every tag reached English on its own account and now
     * reaches its own catalog. The map is unchanged and the rows below prove
     * the batch needed nothing from it.
     *
     * Three of the fifteen — `mh`, `na`, `bi` — have ISO 639-1 codes, so a
     * reader can also arrive under the 639-2/T alpha-3 that
     * `Intl.getCanonicalLocales` folds for us. Those rows are here because the
     * folding is ICU's rather than this repository's, and a change in it would
     * silently cost three catalogs their alpha-3 door.
     */
    describe("the Oceania batch", () => {
        /** The fifteen tags this batch adds, in the order the README lists them. */
        const OCEANIA = [
            "mh",
            "chk",
            "pon",
            "kos",
            "gil",
            "na",
            "yap",
            "pau",
            "niu",
            "tkl",
            "tvl",
            "rar",
            "wls",
            "rtm",
            "bi",
        ];

        it.each([
            // The twelve tags with no 639-1 code, each arriving as the
            // directory it names.
            ["chk", "chk"],
            ["pon", "pon"],
            ["kos", "kos"],
            ["gil", "gil"],
            ["yap", "yap"],
            ["pau", "pau"],
            ["niu", "niu"],
            ["tkl", "tkl"],
            ["tvl", "tvl"],
            ["rar", "rar"],
            ["wls", "wls"],
            ["rtm", "rtm"],
            // …and the three with one.
            ["mh", "mh"],
            ["na", "na"],
            ["bi", "bi"],
            // The alpha-3 doors, folded by `Intl.getCanonicalLocales` rather
            // than by anything here.
            ["mah", "mh"],
            ["nau", "na"],
            ["bis", "bi"],
            // Region tags, which filter without help. The batch spans nine
            // countries and territories, and every one of the fifteen
            // maximizes to a region — a completeness no earlier batch had.
            ["mh-MH", "mh"],
            ["chk-FM", "chk"],
            ["pon-FM", "pon"],
            ["kos-FM", "kos"],
            ["yap-FM", "yap"],
            ["gil-KI", "gil"],
            ["na-NR", "na"],
            ["pau-PW", "pau"],
            ["niu-NU", "niu"],
            ["tkl-TK", "tkl"],
            ["tvl-TV", "tvl"],
            ["rar-CK", "rar"],
            ["wls-WF", "wls"],
            ["rtm-FJ", "rtm"],
            ["bi-VU", "bi"],
            // Script tags. Every catalog here is Latin — the first batch of
            // which that is true since the Philippine one — so a `-Latn` is
            // redundant rather than a disambiguation, and has to cost nothing.
            ["mh-Latn", "mh"],
            ["gil-Latn", "gil"],
            ["rtm-Latn", "rtm"],
        ])("reaches %s's catalog as %s", (requested, expected) => {
            expect(
                negotiateLocales([normalizeLocaleTag(requested)], available),
            ).toEqual([expected, "en"]);
        });

        /**
         * The batch that changed no map, asserted as such. Each of the fifteen
         * reaches its own catalog when the whole roster is on offer *and* when
         * only English is — the second half being what would fail if some
         * entry were quietly folding one of these tags onto a neighbour.
         */
        it("folds none of the fifteen onto another catalog", () => {
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
