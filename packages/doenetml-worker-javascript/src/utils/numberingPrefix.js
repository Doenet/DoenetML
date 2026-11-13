/**
 * Numbers shown with the `numberingPrefix` the hosting page sets.
 *
 * A page of a book is its own document, so it numbers its figures, tables,
 * equations and blocks from 1. The host can name the page's place in the book
 * with a prefix, `"3.2"` for section 3.2, so that its third figure reads
 * "Figure 3.2.3" and its first numbered equation "(3.2.1)", as PreTeXt numbers
 * them. Each page's numbers then depend only on that page.
 */

/**
 * The dependency through which a state variable reads the prefix.
 */
export function numberingPrefixDependency() {
    return { dependencyType: "flag", flagName: "numberingPrefix" };
}

/**
 * `number` as displayed under `prefix`: `"3.2.4"` for prefix `"3.2"` and
 * number 4. Without a prefix (null, undefined, blank, or not a string, as
 * when a host sends something unexpected), just the number.
 *
 * @param {unknown} prefix - the `numberingPrefix` flag
 * @param {number|string} number
 * @returns {string}
 */
export function withNumberingPrefix(prefix, number) {
    const trimmed = typeof prefix === "string" ? prefix.trim() : "";
    return trimmed ? `${trimmed}.${number}` : String(number);
}
