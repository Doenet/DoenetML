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
     * The Indigenous Americas batch, which is the first to seed
     * **macrolanguages** — `qu`, `ay`, `gn`, `nah`, `oj` are all ISO 639-3
     * macrolanguages rather than individual languages — and the first to need
     * `MACROLANGUAGE_MEMBERS` because of it.
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
            // Nahuatl. Not one of these folds without the map, including `nci`
            // — Classical Nahuatl — which is the code a historical text is most
            // likely to arrive under.
            ["nci", "nah"],
            ["nhe", "nah"],
            ["azz", "nah"],
            ["nci-MX", "nah"],
            // Ojibwa. `ojg` is the one CLDR folds; `otw` is Odawa and `alq`
            // Algonquin, both members of `oj` in ISO 639-3.
            ["ojg", "oj"],
            ["ojb", "oj"],
            ["otw", "oj"],
            ["alq", "oj"],
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
         * The negative control, and the reason the map keys on ISO 639-3
         * membership rather than on how close two languages sound. Kʼicheʼ and
         * Mapudungun are individual languages with catalogs of their own, and
         * neither is a member of anything — so no other Mayan or Araucanian code
         * may be folded onto them. `cak` is Kaqchikel, `arn`'s neighbour `pdt`
         * is nothing of the sort; both must miss.
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
