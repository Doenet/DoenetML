import { describe, expect, it } from "vitest";

import { directionOf, stripBidiIsolates } from "../src/direction";
import { PSEUDO_LOCALE, PSEUDO_RTL_LOCALE } from "../src/pseudo";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";

describe("directionOf", () => {
    it("reports the seven right-to-left languages RTL support unblocks", () => {
        // Arabic, Persian, Hebrew, Urdu, Pashto, Sindhi, Uyghur — the set
        // #1614 exists to make renderable.
        for (const tag of ["ar", "fa", "he", "ur", "ps", "sd", "ug"]) {
            expect(directionOf(tag), tag).toBe("rtl");
        }
    });

    it("reports every locale this repository ships a catalog for LTR", () => {
        // Not an assertion about the world — a statement about today's roster,
        // and the thing that makes emitting `dir` inert until a right-to-left
        // catalog lands. It is meant to fail when one does.
        for (const { locale } of SUPPORTED_LOCALES) {
            expect(directionOf(locale), locale).toBe("ltr");
        }
    });

    it("follows the script rather than the language", () => {
        // The reason direction is keyed on script: these languages are written
        // in both, and the tag says which.
        expect(directionOf("pa-Guru")).toBe("ltr");
        expect(directionOf("pa-Arab")).toBe("rtl");
        expect(directionOf("ku-Latn")).toBe("ltr");
        expect(directionOf("ku-Arab")).toBe("rtl");
    });

    it("resolves a region- or script-qualified tag the way the bare one goes", () => {
        expect(directionOf("ar-EG")).toBe("rtl");
        expect(directionOf("ar-Arab-EG")).toBe("rtl");
        expect(directionOf("he-IL")).toBe("rtl");
        expect(directionOf("en-GB")).toBe("ltr");
    });

    it("normalizes case, because `lang` is typed by hand", () => {
        expect(directionOf("AR")).toBe("rtl");
        expect(directionOf("he-il")).toBe("rtl");
        expect(directionOf("ES-mx")).toBe("ltr");
    });

    it("answers for a tag `Intl.Locale` cannot parse", () => {
        // `normalizeLocaleTag` passes these through untouched rather than
        // rejecting them, so direction has to cope with whatever survives.
        expect(directionOf("he_IL")).toBe("rtl");
        expect(directionOf("ar_Arab_EG")).toBe("rtl");
        expect(directionOf("en_US")).toBe("ltr");
    });

    it("defaults to left-to-right for nonsense and for nothing at all", () => {
        expect(directionOf("")).toBe("ltr");
        expect(directionOf("   ")).toBe("ltr");
        expect(directionOf("!!!")).toBe("ltr");
        expect(directionOf("not-a-language")).toBe("ltr");
    });

    it("makes the two pseudo-locales differ in direction and nothing else", () => {
        // Both are `en-…`, so neither resolves from its script. The carve-out
        // is what the right-to-left pseudo-locale is.
        expect(directionOf(PSEUDO_LOCALE)).toBe("ltr");
        expect(directionOf(PSEUDO_RTL_LOCALE)).toBe("rtl");
        expect(directionOf("en-xb")).toBe("rtl");
    });
});

describe("stripBidiIsolates", () => {
    it("removes Fluent's isolation marks", () => {
        expect(stripBidiIsolates("Show \u20683\u2069 responses")).toBe(
            "Show 3 responses",
        );
    });

    it("removes the directional marks the RTL pseudo-locale adds", () => {
        expect(stripBidiIsolates("\u200F»Çórréçţ«\u200F")).toBe("»Çórréçţ«");
    });

    it("leaves text carrying none of them untouched", () => {
        expect(stripBidiIsolates("Max credit available: 80%")).toBe(
            "Max credit available: 80%",
        );
    });
});
