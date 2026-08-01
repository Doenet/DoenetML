import { DEFAULT_LOCALE } from "./catalogs";

/**
 * The `Intl` side of localization: the conventions that come from CLDR rather
 * than from a catalog.
 *
 * Nothing here needs a translation to be written. A locale's thousands
 * separator, decimal point, and list punctuation ship with every JavaScript
 * runtime, so these work for locales Doenet has no catalog for at all — which
 * is most of them. Anything that needs a *word* belongs in an FTL file
 * instead.
 */

/**
 * The tag to hand `Intl`, which is neither the tag a catalog is filed under nor
 * the tag as it was written.
 *
 * A locale tag does two jobs: it keys the catalog, and it names the language
 * `Intl` formats in. They come apart for a tag `Intl` refuses — `en_US`, the
 * POSIX spelling, is the usual way a host gets one wrong, and
 * `normalizeLocaleTag` passes it through untouched because rewriting it would
 * stop the host's own catalog from being found.
 *
 * Every `Intl` constructor throws `RangeError` on such a tag. That must not
 * reach a state-variable definition: a mis-tagged locale should cost the
 * host's number conventions — which were never available for that tag anyway
 * — and not the document.
 *
 * The tag it returns pins the numbering system, which is the whole of the
 * digit policy (see {@link LATIN_DIGITS} and the package README). Pinning it
 * here is what makes the policy hold for formatters not yet written: a locale
 * reaches `Intl` through this function or it does not reach `Intl` at all.
 */
export function intlLocale(locale: string): string {
    try {
        return pinNumberingSystem(locale);
    } catch {
        return pinNumberingSystem(DEFAULT_LOCALE);
    }
}

/**
 * `locale` with its numbering system replaced.
 *
 * Throws `RangeError` for a structurally invalid tag — the same tags, and the
 * same error, every `Intl` constructor rejects, which is what makes this the
 * validity check as well as the pin.
 */
function pinNumberingSystem(locale: string): string {
    return new Intl.Locale(locale, {
        numberingSystem: LATIN_DIGITS,
    }).toString();
}

/**
 * The numbering system every number DoenetML formats is written in, whatever
 * the locale's own is.
 *
 * CLDR gives a locale a default numbering system, and for Bangla, Assamese,
 * Marathi, Nepali, Burmese, Persian and others it is not `latn`: a bare
 * `{ $count }` in a catalog comes back as `১,২৩৪`, and so does the integer
 * part of an `<intComma>`. This constant says that DoenetML does not do that.
 *
 * It is deliberately narrow: the *separators* still follow the locale, so
 * German still groups with periods and India still groups in twos. The one
 * place the two halves cannot be separated is the Arabic script, where Persian
 * pairs `٬` and `٫` with its own digits and `,` and `.` with these — so
 * pinning the digits takes the Latin-digit separators along with them.
 *
 * The reasoning is in the package README, under "Digits are Latin, separators
 * are not": a number in prose sits beside numbers that are not, and
 * mathematics is Latin-digit regardless ({@link MATH_NOTATION_LOCALE}). A host
 * that asks for a numbering system explicitly (`zh-u-nu-hanidec`) is
 * overridden too: the policy is one answer per product, not per tag.
 */
const LATIN_DIGITS = "latn";

/**
 * The locale numbers *inside mathematics* are formatted under, regardless of
 * the document's language.
 *
 * A decimal point is notation, not prose. `1.5` is a `<number>`'s value as
 * much as `x^2` is a `<math>`'s, it round-trips through `math-expressions` and
 * through authored DoenetML, and it is compared against a student's typed
 * response. Rendering it as `1,5` in a Spanish document would change what the
 * grader compares and what `$n.text` interpolates into an author's own
 * expression — while leaving the input side, which parses `.` either way,
 * behind.
 *
 * European decimal commas are a real and wanted feature; they are a
 * *math-notation* feature, and they have to arrive on both sides at once.
 * Until then this constant is where the policy is written down, so that a
 * number formatted in English is a decision with a name rather than an
 * omission — see {@link formatDecimalString} for the other half, the numbers
 * that are prose and do follow the document. The two halves already agree on
 * digits, which is what {@link LATIN_DIGITS} is for; the separator is the only
 * thing left for #1528 to settle.
 *
 * It has no callers, and that is what it records: no math number in the core
 * passes through an `Intl` formatter at all, so there is no site to pass a
 * locale to. It is here for the phase that adds those sites, which should
 * reach for this rather than reopen the question.
 */
export const MATH_NOTATION_LOCALE = DEFAULT_LOCALE;

/** A decimal literal: an optional sign, digits, and optional fraction digits. */
const DECIMAL_LITERAL = /^(-?\d+)(?:\.(\d+))?$/;

/**
 * Re-punctuate an already-rendered decimal number under `locale`'s
 * conventions: the integer part regrouped, the decimal separator swapped.
 * `"1234567.50"` becomes `"1.234.567,50"` in German.
 *
 * Re-punctuates rather than re-formats, and the distinction is the point.
 * Every digit the caller wrote survives — same count, same order, same values
 * — because the fraction digits are carried across rather than reformatted:
 * handing the whole literal to `Intl.NumberFormat` under its default options
 * would round to three fraction digits and drop a trailing zero, so
 * `"1000.50"` would come back `"1,000.5"` — a different number of significant
 * figures than the author asked for, in English, where nothing was supposed to
 * change at all. (`maximumFractionDigits` lifts the rounding, but stops at a
 * hundred digits; carrying the fraction across has no ceiling.)
 *
 * A string that is not a decimal literal is returned unchanged — there is
 * nothing to regroup, and a caller that has extracted the number itself
 * shouldn't have to check twice.
 */
export function formatDecimalString(locale: string, value: string): string {
    const match = DECIMAL_LITERAL.exec(value);
    if (match === null) {
        return value;
    }
    const [, integerPart, fractionPart] = match;
    const tag = intlLocale(locale);
    const grouped = groupIntegerPart(tag, integerPart);
    if (fractionPart === undefined) {
        return grouped;
    }
    return `${grouped}${decimalSeparator(tag)}${fractionPart}`;
}

/**
 * An integer literal under `tag`'s grouping, with every digit it was written
 * with still in it.
 *
 * The separators are placed by hand, against a pattern read out of `Intl`,
 * rather than by handing the literal to a formatter. A formatter shown the
 * value gets two things wrong that this component cannot afford: it normalizes
 * a leading zero away, so `<intComma>007</intComma>` would stop rendering
 * `007`, and it overflows to `∞` past `Number.MAX_VALUE`, so an integer of
 * some three hundred digits would stop rendering at all. Neither is a
 * formatting question — where a locale puts its separators depends on how many
 * digits a number has, not on which ones or on how many of them fit in a
 * double — so only the pattern is asked for.
 *
 * The grouping is measured in code units, which is exact because every digit
 * involved is ASCII: the value's because {@link DECIMAL_LITERAL} matches only
 * `0`–`9`, and the probe's in {@link numberPattern} because `tag` pins
 * {@link LATIN_DIGITS}.
 */
function groupIntegerPart(tag: string, integerPart: string): string {
    const negative = integerPart.startsWith("-");
    const { prefix, suffix, separator, primary, secondary } = numberPattern(
        tag,
        negative,
    );
    const digits = integerPart.slice(negative ? 1 : 0);
    const groups = [];
    let size = primary;
    let end = digits.length;
    while (end > size) {
        groups.unshift(digits.slice(end - size, end));
        end -= size;
        size = secondary;
    }
    groups.unshift(digits.slice(0, end));
    return prefix + groups.join(separator) + suffix;
}

/**
 * Long enough to expose a locale's secondary grouping, which is not always its
 * primary one: India groups the lowest three digits and then in twos
 * (`12,34,567`).
 */
const GROUPING_PROBE = "1111111111111111";

/**
 * How `tag` writes a signed integer: what goes outside the digits, what goes
 * between their groups, and how long a group is counting from the right.
 *
 * Read off a formatted probe rather than tabled, so that this follows CLDR
 * wherever CLDR goes. `prefix` and `suffix` are whatever the formatter puts
 * around the digits — a minus sign, which is not always `-`, and the bidi
 * marks Arabic and Hebrew wrap a negative number in.
 */
function numberPattern(tag: string, negative: boolean) {
    const parts = new Intl.NumberFormat(tag, {
        // `true` is `"always"`. The probe is long enough that `"auto"` would
        // group it too, so this changes nothing here and only states what is
        // being asked for: where a group boundary falls, not whether some
        // particular number is given any.
        //
        // That second question is answered by {@link groupIntegerPart}, which
        // groups from a thousand up in every locale — what `<intComma>` has
        // always done, and not what CLDR would do left alone: Spanish,
        // Italian, Polish, Hungarian, Bulgarian, Slovenian, Latvian, Estonian
        // and European Portuguese all suppress the separator in a bare
        // four-digit number, though German does not.
        useGrouping: true,
        maximumFractionDigits: 0,
        // The string overload: `Intl.NumberFormat` reads a decimal string
        // exactly. TypeScript's `lib.es5` signature predates it, hence the cast.
    }).formatToParts(
        ((negative ? "-" : "") + GROUPING_PROBE) as unknown as number,
    );
    const groups: number[] = [];
    let prefix = "";
    let suffix = "";
    let separator = "";
    for (const part of parts) {
        if (part.type === "integer") {
            groups.push(part.value.length);
            suffix = "";
        } else if (part.type === "group") {
            separator = part.value;
        } else if (groups.length === 0) {
            prefix += part.value;
        } else {
            suffix += part.value;
        }
    }
    const primary = groups[groups.length - 1];
    return {
        prefix,
        suffix,
        separator,
        primary,
        secondary: groups[groups.length - 2] ?? primary,
    };
}

/**
 * The character `locale` writes between a number's whole and fractional parts.
 *
 * Read out of `Intl` rather than tabled, and defaulted to `"."` for a locale
 * whose formatter somehow reports no decimal part at all — a missing
 * separator would silently concatenate the two halves into a different number.
 */
function decimalSeparator(tag: string): string {
    return (
        new Intl.NumberFormat(tag)
            .formatToParts(1.1)
            .find((part) => part.type === "decimal")?.value ?? "."
    );
}

/** The list joins `Intl.ListFormat` can produce. */
export type ListType = "conjunction" | "disjunction" | "unit";

const LIST_TYPES: readonly string[] = ["conjunction", "disjunction", "unit"];

/**
 * An `Intl.ListFormat` for `locale`.
 *
 * The `type` is checked rather than passed on, for the same reason
 * {@link intlLocale} checks the tag: an unrecognized one throws, and would
 * throw again out of any fallback built on it.
 */
export function listFormatFor(locale: string, type: unknown): Intl.ListFormat {
    return new Intl.ListFormat(intlLocale(locale), {
        style: "long",
        type: LIST_TYPES.includes(type as string)
            ? (type as ListType)
            : "conjunction",
    });
}
