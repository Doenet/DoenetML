import { describe, expect, it } from "vitest";

import { reachableCatalogLocales } from "../src/load";

const CATALOGS = {
    es: "greeting = Hola",
    de: "greeting = Hallo",
    en: "greeting = Hello",
};

describe("reachableCatalogLocales", () => {
    it("ignores catalogs the given locales cannot reach", () => {
        // The defect this exists for: a chrome-only catalog arriving must not
        // count towards what the core's rebuild is gated on.
        expect(reachableCatalogLocales(["es"], CATALOGS)).toEqual(["en", "es"]);
    });

    it("gains a tag when a catalog for one of the given locales arrives", () => {
        expect(reachableCatalogLocales(["de"], { en: CATALOGS.en })).toEqual([
            "en",
        ]);
        expect(
            reachableCatalogLocales(["de"], {
                en: CATALOGS.en,
                de: CATALOGS.de,
            }),
        ).toEqual(["de", "en"]);
    });

    it("counts a catalog that serves a regional tag by negotiation", () => {
        // `es-MX` has no catalog of its own; the `es` one answers for it, and
        // that is an arrival the caller has to see.
        expect(
            reachableCatalogLocales(["es-MX"], {
                en: CATALOGS.en,
                es: CATALOGS.es,
            }),
        ).toEqual(["en", "es"]);
    });

    it("does not invent the default locale when no catalog for it arrived", () => {
        // `negotiateLocales` appends `en` whether or not it is on hand; an
        // answer about what is on hand must not claim it.
        expect(reachableCatalogLocales(["en"], {})).toEqual([]);
        expect(reachableCatalogLocales(["es"], { de: CATALOGS.de })).toEqual(
            [],
        );
    });

    it("is sorted, so the order the locales came in does not matter", () => {
        expect(reachableCatalogLocales(["es", "de"], CATALOGS)).toEqual([
            "de",
            "en",
            "es",
        ]);
        expect(reachableCatalogLocales(["de", "es"], CATALOGS)).toEqual([
            "de",
            "en",
            "es",
        ]);
    });

    it("ignores blanks and absent tags", () => {
        expect(
            reachableCatalogLocales([null, undefined, "", "es"], CATALOGS),
        ).toEqual(reachableCatalogLocales(["es"], CATALOGS));
    });

    it("is empty when nothing has arrived", () => {
        expect(reachableCatalogLocales(["es"], null)).toEqual([]);
        expect(reachableCatalogLocales(["es"], undefined)).toEqual([]);
    });
});
