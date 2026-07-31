import { describe, expect, it } from "vitest";

import { resourceKeyForLocales } from "../src/load";

const CATALOGS = {
    es: "greeting = Hola",
    de: "greeting = Hallo",
    en: "greeting = Hello",
};

describe("resourceKeyForLocales", () => {
    it("ignores catalogs the given locales cannot reach", () => {
        // The defect this exists for: a chrome-only catalog arriving must not
        // move the key the core's rebuild is gated on.
        expect(resourceKeyForLocales(["es"], CATALOGS)).toBe(
            resourceKeyForLocales(["es"], { es: CATALOGS.es, en: CATALOGS.en }),
        );
    });

    it("moves when a catalog for one of the given locales arrives", () => {
        const before = resourceKeyForLocales(["de"], { en: CATALOGS.en });
        const after = resourceKeyForLocales(["de"], {
            en: CATALOGS.en,
            de: CATALOGS.de,
        });
        expect(before).not.toBe(after);
    });

    it("counts a catalog that serves a regional tag by negotiation", () => {
        // `es-MX` has no catalog of its own; the `es` one answers for it, and
        // that is a change the caller has to see.
        expect(resourceKeyForLocales(["es-MX"], { en: CATALOGS.en })).not.toBe(
            resourceKeyForLocales(["es-MX"], {
                en: CATALOGS.en,
                es: CATALOGS.es,
            }),
        );
    });

    it("does not invent the default locale when no catalog for it arrived", () => {
        // `negotiateLocales` appends `en` whether or not it is on hand; an
        // identity for what is on hand must not claim it.
        expect(resourceKeyForLocales(["en"], {})).toBe("");
        expect(resourceKeyForLocales(["es"], { de: CATALOGS.de })).toBe("");
    });

    it("is order-insensitive across the locales asked about", () => {
        expect(resourceKeyForLocales(["es", "de"], CATALOGS)).toBe(
            resourceKeyForLocales(["de", "es"], CATALOGS),
        );
    });

    it("ignores blanks and absent tags", () => {
        expect(
            resourceKeyForLocales([null, undefined, "", "es"], CATALOGS),
        ).toBe(resourceKeyForLocales(["es"], CATALOGS));
    });

    it("is empty when nothing has arrived", () => {
        expect(resourceKeyForLocales(["es"], null)).toBe("");
        expect(resourceKeyForLocales(["es"], undefined)).toBe("");
    });
});
