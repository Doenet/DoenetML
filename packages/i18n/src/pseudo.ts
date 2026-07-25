/**
 * The pseudo-locale tag. `XA` is a user-assigned ISO 3166 region, so `en-XA`
 * can never collide with a real locale.
 */
export const PSEUDO_LOCALE = "en-XA";

/**
 * Latin letters mapped to accented look-alikes. Still readable in English, but
 * unmistakably *not* the original — which is the point: any string that shows
 * up unaccented in an `en-XA` run never went through the catalogs.
 */
const ACCENT_MAP: Record<string, string> = {
    a: "á",
    b: "ƀ",
    c: "ç",
    d: "ð",
    e: "é",
    f: "ƒ",
    g: "ğ",
    h: "ĥ",
    i: "í",
    j: "ĵ",
    k: "ķ",
    l: "ļ",
    m: "ɱ",
    n: "ñ",
    o: "ó",
    p: "þ",
    q: "ʠ",
    r: "ř",
    s: "š",
    t: "ţ",
    u: "ú",
    v: "ṽ",
    w: "ŵ",
    x: "ẋ",
    y: "ý",
    z: "ž",
    A: "Á",
    B: "Ɓ",
    C: "Ç",
    D: "Ð",
    E: "É",
    F: "Ƒ",
    G: "Ğ",
    H: "Ĥ",
    I: "Í",
    J: "Ĵ",
    K: "Ķ",
    L: "Ļ",
    M: "Ṁ",
    N: "Ñ",
    O: "Ó",
    P: "Þ",
    Q: "Ɋ",
    R: "Ř",
    S: "Š",
    T: "Ţ",
    U: "Ú",
    V: "Ṽ",
    W: "Ŵ",
    X: "Ẋ",
    Y: "Ý",
    Z: "Ž",
};

export type PseudoLocalizeOptions = {
    /**
     * Fraction of padding appended to each value, simulating the ~30% growth
     * English suffers translating into German or Finnish. Layouts that only
     * fit English break visibly here instead of in production.
     */
    expansion?: number;
    /**
     * Markers wrapped around each localized value, so a clipped or truncated
     * string is obvious: a missing `«` means the end was cut off.
     */
    brackets?: [string, string];
};

/**
 * A message id / term id / attribute / variant-key prefix that is syntax, not
 * text. Terms (`-brand = Doenet`) need their own pattern: their leading `-`
 * means the message pattern doesn't match them, and accenting a term's id
 * would both break the definition and orphan every `{ -brand }` that
 * references it.
 */
const MESSAGE_PREFIX = /^([a-zA-Z][\w-]*\s*=\s*)/;
const TERM_PREFIX = /^(-[a-zA-Z][\w-]*\s*=\s*)/;
const ATTRIBUTE_PREFIX = /^(\s+\.[a-zA-Z][\w-]*\s*=\s*)/;
const VARIANT_PREFIX = /^(\s*\*?\[[^\]]*\]\s*)/;
const INDENT_PREFIX = /^(\s+)/;

/**
 * Accent the literal text of a value, leaving Fluent syntax alone.
 *
 * Everything inside `{…}` — variable references, message references, function
 * calls, select selectors — is copied verbatim: substituting there would
 * produce a catalog that no longer parses, or one whose placeables silently
 * stop resolving.
 */
function accentTextRuns(value: string): {
    text: string;
    letterCount: number;
} {
    let depth = 0;
    let letterCount = 0;
    let text = "";

    for (const char of value) {
        if (char === "{") {
            depth += 1;
            text += char;
            continue;
        }
        if (char === "}") {
            depth = Math.max(0, depth - 1);
            text += char;
            continue;
        }
        if (depth > 0) {
            text += char;
            continue;
        }
        const accented = ACCENT_MAP[char];
        if (accented === undefined) {
            text += char;
        } else {
            text += accented;
            letterCount += 1;
        }
    }

    return { text, letterCount };
}

/**
 * Split a line into the Fluent syntax that introduces a value and the value
 * itself. Comments and blank lines have no value part.
 */
function splitValue(line: string): { prefix: string; value: string } | null {
    if (line.trim() === "" || line.trimStart().startsWith("#")) {
        return null;
    }
    for (const pattern of [
        MESSAGE_PREFIX,
        TERM_PREFIX,
        ATTRIBUTE_PREFIX,
        VARIANT_PREFIX,
        INDENT_PREFIX,
    ]) {
        const match = pattern.exec(line);
        if (match) {
            return { prefix: match[1], value: line.slice(match[1].length) };
        }
    }
    return { prefix: "", value: line };
}

/**
 * Generate the `en-XA` pseudo-locale from an English catalog.
 *
 * Run against the shipped English FTL and load the result as a locale: every
 * string that renders unaccented is one that never went through the message
 * catalogs, and every clipped `«` is a layout that cannot survive a longer
 * language. Catches unextracted strings that no key-based lint can see.
 */
export function pseudoLocalize(
    ftlSource: string,
    options: PseudoLocalizeOptions = {},
): string {
    const { expansion = 0.3, brackets = ["»", "«"] } = options;
    const [open, close] = brackets;

    return ftlSource
        .split("\n")
        .map((line) => {
            const split = splitValue(line);
            if (split === null) {
                return line;
            }
            const { text, letterCount } = accentTextRuns(split.value);
            if (letterCount === 0) {
                // Nothing but syntax, punctuation, or placeables — bracketing
                // it would only add noise to `{ $count ->` and friends.
                return line;
            }
            const padding = "·".repeat(Math.ceil(letterCount * expansion));
            return `${split.prefix}${open}${text}${padding}${close}`;
        })
        .join("\n");
}
