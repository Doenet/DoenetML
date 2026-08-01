import { describe, expect, it } from "vitest";

import {
    MATH_NOTATION_LOCALE,
    formatDecimalString,
    intlLocale,
    listFormatFor,
} from "../src/intl";

describe("intlLocale", () => {
    it("keeps a well-formed tag, pinning the numbering system onto it", () => {
        expect(intlLocale("es-MX")).toBe("es-MX-u-nu-latn");
    });

    it("falls back to English for a tag Intl refuses", () => {
        // The POSIX spelling, which `normalizeLocaleTag` deliberately leaves
        // alone so the host's own catalog can still be found by it.
        expect(intlLocale("en_US")).toBe("en-u-nu-latn");
        expect(intlLocale("")).toBe("en-u-nu-latn");
    });

    it("overrides a numbering system the tag asked for", () => {
        // One answer per product, not per tag: a host that spells its own
        // preference into the tag does not get to reopen the policy either.
        expect(intlLocale("zh-u-nu-hanidec")).toBe("zh-u-nu-latn");
    });

    it("pins every formatter it feeds, not only the number ones", () => {
        // What the pin is doing here rather than at each formatter: a locale
        // reaches an `Intl` formatter through this function or it reaches none
        // at all, so a formatter added later cannot miss the policy.
        expect(new Intl.NumberFormat(intlLocale("bn")).format(1234.5)).toBe(
            "1,234.5",
        );
        expect(
            new Intl.DateTimeFormat(intlLocale("my"), {
                year: "numeric",
                timeZone: "UTC",
            }).format(new Date(Date.UTC(2026, 0, 1))),
        ).toContain("2026");
    });
});

describe("formatDecimalString", () => {
    it("leaves English exactly as it was", () => {
        expect(formatDecimalString("en", "25236501.35")).toBe("25,236,501.35");
        expect(formatDecimalString("en", "999")).toBe("999");
        expect(formatDecimalString("en", "-1234")).toBe("-1,234");
    });

    it("uses the locale's separators", () => {
        expect(formatDecimalString("de", "1234567.5")).toBe("1.234.567,5");
        expect(formatDecimalString("es", "1234567.5")).toBe("1.234.567,5");
        // India groups in twos above the first thousand.
        expect(formatDecimalString("hi-IN", "1234567")).toBe("12,34,567");
    });

    it("groups a bare four-digit number, which some locales otherwise would not", () => {
        // `<intComma>` has grouped from a thousand up since it was written, but
        // CLDR's default is to leave four digits alone in Spanish, Italian,
        // Polish, Hungarian, Bulgarian, Slovenian, Latvian, Estonian and
        // European Portuguese — though not in German. Placing the separators
        // by hand is what keeps this uniform: `groupIntegerPart` asks the
        // locale where a boundary falls and then groups everything above a
        // thousand, rather than asking it whether to group at all.
        expect(formatDecimalString("es", "1234")).toBe("1.234");
        expect(formatDecimalString("it", "1234")).toBe("1.234");
        expect(formatDecimalString("pt-PT", "1234")).toBe("1 234");
        expect(formatDecimalString("de", "1234")).toBe("1.234");
    });

    it("writes the digits in Latin whatever the locale counts in", () => {
        // The separators still move, and only the separators. Bangla and
        // Marathi keep India's grouping, Burmese keeps the plain thousands,
        // and none of the three writes the value in its own digits — which
        // they all would if the tag reached `Intl` as it was given (#1615).
        expect(formatDecimalString("bn", "25236501.35")).toBe("2,52,36,501.35");
        expect(formatDecimalString("mr", "1234567.5")).toBe("12,34,567.5");
        expect(formatDecimalString("my", "1234567.5")).toBe("1,234,567.5");
    });

    it("keeps a group separator that is not a comma", () => {
        // Adlam has a separator of its own (U+2E41) and digits of its own
        // (astral). Only the separator survives the pin.
        expect(formatDecimalString("ff-Adlm", "1234567")).toBe(
            "1\u{2e41}234\u{2e41}567",
        );
        expect(formatDecimalString("ff-Adlm", "0001234")).toBe(
            "0\u{2e41}001\u{2e41}234",
        );
    });

    it("keeps every digit the caller wrote", () => {
        // Trailing zeros and precision are the reason the fraction is carried
        // as text: handing the whole literal to `Intl` would round it to three
        // fraction digits and drop the zero, and lifting that with
        // `maximumFractionDigits` runs into a hundred-digit ceiling.
        expect(formatDecimalString("en", "1000.50")).toBe("1,000.50");
        expect(
            formatDecimalString("en", "1234.1234567890123456789012345678901"),
        ).toBe("1,234.1234567890123456789012345678901");
        expect(
            formatDecimalString("en", "123456789012345678901234567890"),
        ).toBe("123,456,789,012,345,678,901,234,567,890");
    });

    it("groups a leading zero rather than dropping it", () => {
        expect(formatDecimalString("en", "0001234")).toBe("0,001,234");
        expect(formatDecimalString("en", "-0001234")).toBe("-0,001,234");
        // A short zero-padded run comes back exactly as it went in, which is
        // what `<intComma>` did before it grouped through `Intl` at all.
        expect(formatDecimalString("en", "007")).toBe("007");
        expect(
            formatDecimalString("en", "0000000000000000000000000001234"),
        ).toBe("0,000,000,000,000,000,000,000,000,001,234");
    });

    it("groups an integer too big to be a double", () => {
        // `Intl.NumberFormat` answers `∞` above `Number.MAX_VALUE`, so the
        // separators are placed against a pattern rather than by handing it
        // the value. Four hundred digits is well past that; the regex loop
        // this replaced had no ceiling, and neither does this.
        const digits = "1234567890".repeat(40);
        const grouped = formatDecimalString("en", digits);
        expect(grouped.replace(/,/g, "")).toBe(digits);
        expect(grouped.split(",").map((group) => group.length)).toEqual([
            1,
            ...Array(133).fill(3),
        ]);
        // A number whose *value* is zero, which the leading-zero handling
        // makes just as long.
        const zeros = "0".repeat(400);
        expect(formatDecimalString("en", zeros).replace(/,/g, "")).toBe(zeros);
        // Secondary grouping comes off the same pattern.
        const hindi = formatDecimalString("hi-IN", digits).split(",");
        expect(hindi.at(-1)).toHaveLength(3);
        expect(hindi.at(-2)).toHaveLength(2);
    });

    it("writes a negative the way the locale writes one", () => {
        // Not always an ASCII hyphen, and not always only a sign: Persian
        // negates with U+2212 and Arabic prefixes a bidi mark. Pinning the
        // digits flattens neither.
        expect(formatDecimalString("fa", "-1234")).toBe("\u200e\u22121,234");
        expect(formatDecimalString("ar-EG", "-1234")).toBe("\u200e-1,234");
    });

    it("keeps a leading zero under a locale that groups in twos", () => {
        // Written back after grouping rather than handed to a formatter, which
        // would normalize it away.
        expect(formatDecimalString("bn", "0001234")).toBe("00,01,234");
    });

    it("takes the separators a locale pairs with Latin digits", () => {
        // The separator is not independent of the digits: Persian writes \u066c
        // and \u066b around its own and `,` and `.` around these, so a number
        // that took one and kept the other would be written in no convention
        // at all. Where the two sets agree — which is everywhere outside the
        // Arabic script — nothing moves.
        expect(formatDecimalString("fa", "1000.50")).toBe("1,000.50");
    });

    it("returns anything that is not a decimal literal unchanged", () => {
        expect(formatDecimalString("en", "twelve")).toBe("twelve");
        expect(formatDecimalString("en", "1e5")).toBe("1e5");
        expect(formatDecimalString("en", "")).toBe("");
    });

    it("formats under English for a tag Intl refuses, rather than throwing", () => {
        expect(formatDecimalString("en_US", "1234.5")).toBe("1,234.5");
    });
});

describe("listFormatFor", () => {
    it("joins in the locale's own conventions", () => {
        expect(listFormatFor("en", "conjunction").format(["a", "b"])).toBe(
            "a and b",
        );
        expect(listFormatFor("es", "disjunction").format(["a", "b"])).toBe(
            "a o b",
        );
    });

    it("treats an unrecognized type as a conjunction rather than throwing", () => {
        expect(listFormatFor("en", "nonsense").format(["a", "b"])).toBe(
            "a and b",
        );
        expect(listFormatFor("en", undefined).format(["a", "b"])).toBe(
            "a and b",
        );
    });
});

describe("MATH_NOTATION_LOCALE", () => {
    it("is English, and says so where the policy is written down", () => {
        // A decimal point inside mathematics round-trips through authored
        // DoenetML and is compared against a student's typed response, so it
        // stays a point until the input side can read a comma too. The
        // constant exists so that is a decision with a name.
        expect(MATH_NOTATION_LOCALE).toBe("en");
    });
});
