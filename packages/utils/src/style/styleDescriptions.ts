import type { TranslationArgs, Translator } from "@doenet/i18n";

/**
 * Localizable style descriptions — "thick dashed blue line", "filled blue
 * circle with a thick red border".
 *
 * These are *content*, not chrome: an author can interpolate
 * `$line.styleDescription` into their prose, so the words follow
 * `documentLocale` and are computed in the worker rather than at render time.
 *
 * ## Why the composition lives in the catalog
 *
 * The English these replaced was built by string concatenation, which bakes
 * English grammar into the code: adjectives before the noun, an article
 * inserted before "border", a noun appended last. Spanish puts adjectives
 * after the noun and inflects them to agree with its gender — "línea
 * discontinua gruesa roja" — and no substitution into the English frame
 * produces that. So each description is assembled by a Fluent message that
 * receives the pieces as arguments, and a `$parts` argument naming *which*
 * pieces are present. An absent piece selects a different branch rather than
 * substituting an empty string, which is what lets a translation reorder and
 * re-punctuate each combination independently.
 *
 * Adjectives are also handed `$gender`, the grammatical gender the catalog
 * assigns the noun they describe (`noun-gender`). English has no agreement and
 * ignores it.
 *
 * ## Words in, keys out
 *
 * The style pipeline stores *English words* on `selectedStyle`
 * (`lineColorWord: "blue"`, `lineWidthWord: "thick"`), derived from the
 * numeric and enumerated style values by `deriveMissingStyleWords` and
 * `resolveColorWord`. Rather than thread a parallel set of keys through that
 * whole pipeline, the vocabulary tables below map each derived word back to
 * its catalog key.
 *
 * The consequence is deliberate: a word the tables do not know is a word the
 * pipeline did not derive — an author wrote it into `lineColorWord` or
 * `markerStyleWord` directly, or asked for a CSS named color by name
 * ("rebeccapurple", which `resolveColorWord` preserves on purpose). Those pass
 * through untranslated, which is the right answer for an authored word and the
 * only available one for the 140-odd CSS color keywords.
 */

/** A noun the catalog can name. */
export type NounKey =
    | "line"
    | "line-segment"
    | "ray"
    | "vector"
    | "curve"
    | "function"
    | "parabola"
    | "polyline"
    | "polygon"
    | "triangle"
    | "rectangle"
    | "circle"
    | "region"
    | "point"
    | "square"
    | "diamond"
    | "cross"
    | "plus";

/**
 * The noun a description names, and the arguments it needs.
 *
 * A regular polygon reports its side count, so it comes from a message of its
 * own rather than one of `noun`'s attributes.
 */
export type NounSpec =
    { key: NounKey } | { key: "regular-polygon"; numSides: number };

type Vocabulary = Record<
    string,
    (t: Translator, args: TranslationArgs) => string
>;

/**
 * Canonical color families, keyed by the word `resolveColorWord` derives.
 *
 * Written out one call per word rather than built from a list of keys: the
 * catalog lint only sees a key spelled out as a string literal, and a computed
 * one would be invisible to it — reported as an orphan in the catalog and
 * never checked against it. The English fallback beside each key is the same
 * convention the chrome follows.
 */
const COLOR_WORDS: Vocabulary = {
    black: (t, args) => t("color.black", args, "black"),
    white: (t, args) => t("color.white", args, "white"),
    gray: (t, args) => t("color.gray", args, "gray"),
    red: (t, args) => t("color.red", args, "red"),
    orange: (t, args) => t("color.orange", args, "orange"),
    yellow: (t, args) => t("color.yellow", args, "yellow"),
    green: (t, args) => t("color.green", args, "green"),
    cyan: (t, args) => t("color.cyan", args, "cyan"),
    blue: (t, args) => t("color.blue", args, "blue"),
    purple: (t, args) => t("color.purple", args, "purple"),
    pink: (t, args) => t("color.pink", args, "pink"),
    brown: (t, args) => t("color.brown", args, "brown"),
};

/** Stroke widths, keyed by the word `deriveMissingStyleWords` derives. */
const LINE_WIDTH_WORDS: Vocabulary = {
    thick: (t, args) => t("line-width.thick", args, "thick"),
    thin: (t, args) => t("line-width.thin", args, "thin"),
};

/** Dash patterns, keyed by the word `deriveMissingStyleWords` derives. */
const LINE_STYLE_WORDS: Vocabulary = {
    dashed: (t, args) => t("line-style.dashed", args, "dashed"),
    dotted: (t, args) => t("line-style.dotted", args, "dotted"),
};

/**
 * Fill patterns, keyed by the phrase `deriveMissingStyleWords` derives.
 *
 * The keys are English phrases rather than the `fillStyle` values they came
 * from, because that phrase is what reaches `selectedStyle`.
 */
const FILL_STYLE_WORDS: Vocabulary = {
    "horizontal lines": (t, args) =>
        t("fill-style.horizontal", args, "horizontal lines"),
    "vertical lines": (t, args) =>
        t("fill-style.vertical", args, "vertical lines"),
    "diagonal lines": (t, args) =>
        t("fill-style.diagonal", args, "diagonal lines"),
    "reverse diagonal lines": (t, args) =>
        t("fill-style.backdiagonal", args, "reverse diagonal lines"),
    dots: (t, args) => t("fill-style.dots", args, "dots"),
    diamonds: (t, args) => t("fill-style.diamonds", args, "diamonds"),
};

/** The nouns, keyed the same way so a marker word can look itself up. */
const NOUN_WORDS: Record<NounKey, (t: Translator) => string> = {
    line: (t) => t("noun.line", undefined, "line"),
    "line-segment": (t) => t("noun.line-segment", undefined, "line segment"),
    ray: (t) => t("noun.ray", undefined, "ray"),
    vector: (t) => t("noun.vector", undefined, "vector"),
    curve: (t) => t("noun.curve", undefined, "curve"),
    function: (t) => t("noun.function", undefined, "function"),
    parabola: (t) => t("noun.parabola", undefined, "parabola"),
    polyline: (t) => t("noun.polyline", undefined, "polyline"),
    polygon: (t) => t("noun.polygon", undefined, "polygon"),
    triangle: (t) => t("noun.triangle", undefined, "triangle"),
    rectangle: (t) => t("noun.rectangle", undefined, "rectangle"),
    circle: (t) => t("noun.circle", undefined, "circle"),
    region: (t) => t("noun.region", undefined, "region"),
    point: (t) => t("noun.point", undefined, "point"),
    square: (t) => t("noun.square", undefined, "square"),
    diamond: (t) => t("noun.diamond", undefined, "diamond"),
    cross: (t) => t("noun.cross", undefined, "cross"),
    plus: (t) => t("noun.plus", undefined, "plus"),
};

/**
 * The marker shapes `deriveMissingStyleWords` normalizes `markerStyle` to.
 *
 * A subset of the nouns, so that an authored `markerStyleWord` that happens to
 * read "polygon" is passed through as the author's own word rather than
 * matching a noun it was never meant to name.
 */
const MARKER_NOUN_KEYS = new Set<NounKey>([
    "point",
    "square",
    "triangle",
    "diamond",
    "cross",
    "plus",
]);

/**
 * Heads of phrases a description builds without naming them as nouns.
 *
 * They still need a gender, because their adjectives agree with them and not
 * with the component being described: in Spanish a circle's border is "un
 * borde grueso", masculine, even though "circunferencia" is not.
 */
type PhraseHead = "border" | "fill" | "text" | "background";

/**
 * The gender the catalog assigns a noun, for the adjectives that describe it.
 *
 * `"neuter"` in English, where nothing selects on it.
 */
function genderOf(t: Translator, noun: NounKey | PhraseHead | string): string {
    return t("noun-gender", { noun }, "neuter");
}

/** Look a derived word up in a vocabulary; pass an authored one through. */
function lookUp(
    t: Translator,
    vocabulary: Vocabulary,
    word: string | undefined,
    gender: string,
): string {
    if (!word) {
        return "";
    }
    const entry = vocabulary[word];
    return entry ? entry(t, { gender }) : word;
}

/** The word naming a {@link NounSpec}. */
export function nounWord(t: Translator, noun: NounSpec): string {
    if (noun.key === "regular-polygon") {
        return t(
            "noun-regular-polygon",
            { numSides: noun.numSides },
            `${noun.numSides}-sided regular polygon`,
        );
    }
    return NOUN_WORDS[noun.key](t);
}

/**
 * The noun word for a marker shape, or the authored word if it is not one of
 * the shapes the style pipeline derives.
 */
function markerWord(t: Translator, markerStyleWord: string | undefined) {
    if (!markerStyleWord) {
        return "";
    }
    return MARKER_NOUN_KEYS.has(markerStyleWord as NounKey)
        ? NOUN_WORDS[markerStyleWord as NounKey](t)
        : markerStyleWord;
}

/** Which of a stroke's three pieces the style supplies. */
function strokeParts(width: string, lineStyle: string, color: string) {
    if (width && lineStyle && color) return "width-style-color";
    if (width && color) return "width-color";
    if (lineStyle && color) return "style-color";
    if (width && lineStyle) return "width-style";
    if (width) return "width";
    if (lineStyle) return "style";
    if (color) return "color";
    return null;
}

/** The English words of a stroke, in order, with the absent ones dropped. */
function joinPresent(...words: string[]): string {
    return words.filter(Boolean).join(" ");
}

export type StrokeWords = {
    colorWord?: string;
    lineWidthWord?: string;
    lineStyleWord?: string;
};

/**
 * The adjectives describing a stroke: "thick dashed blue".
 *
 * Also describes a shape's border, where the caller drops the color when it
 * matches the fill the border surrounds — English says "with a thick border"
 * rather than repeating the color it just used.
 *
 * @param gender The gender of whatever the stroke describes, for agreement.
 */
export function describeStroke(
    t: Translator,
    words: StrokeWords,
    gender: string,
): string {
    const width = lookUp(t, LINE_WIDTH_WORDS, words.lineWidthWord, gender);
    const lineStyle = lookUp(t, LINE_STYLE_WORDS, words.lineStyleWord, gender);
    const color = lookUp(t, COLOR_WORDS, words.colorWord, gender);

    const parts = strokeParts(width, lineStyle, color);
    if (parts === null) {
        return "";
    }
    return t(
        "style-stroke",
        { parts, width, lineStyle, color, gender },
        joinPresent(width, lineStyle, color),
    );
}

/** A description followed by what it describes: "thick red line". */
export function attachNoun(
    t: Translator,
    description: string,
    noun: string,
): string {
    return t(
        "style-with-noun",
        { description, noun },
        `${description} ${noun}`,
    );
}

/**
 * A stroked component — a line, a ray, a curve — and the noun naming it.
 *
 * @param noun Supplied whether or not `withNoun` names it: its gender governs
 *   the adjectives either way, so that a Spanish `$line.styleDescription`
 *   interpolated into prose still agrees with the "línea" nearby.
 */
export function describeStrokedShape(
    t: Translator,
    words: StrokeWords,
    { noun, withNoun }: { noun: NounSpec; withNoun: boolean },
): string {
    const stroke = describeStroke(t, words, genderOf(t, noun.key));
    return withNoun ? attachNoun(t, stroke, nounWord(t, noun)) : stroke;
}

/** A shape's border on its own, as `borderStyleDescription` reports it. */
export function describeBorder(t: Translator, words: StrokeWords): string {
    return describeStroke(t, words, genderOf(t, "border"));
}

export type ClosedShapeWords = StrokeWords & {
    fillColorWord?: string;
    fillStyleWord?: string;
};

/**
 * A closed shape: "thick blue circle", "filled blue circle with diamonds and a
 * thick red border".
 *
 * @param noun The shape being described. Named in the output only when
 *   `withNoun`, but supplied either way — its gender governs the adjectives
 *   whether or not the word itself appears.
 * @param withNoun English differs between the two forms by more than the noun:
 *   it wants an article before "border" only in the form that named the shape.
 */
export function describeClosedShape(
    t: Translator,
    words: ClosedShapeWords,
    {
        filled,
        noun,
        withNoun,
    }: { filled: boolean; noun: NounSpec; withNoun: boolean },
): string {
    const gender = genderOf(t, noun.key);
    const nounText = withNoun ? nounWord(t, noun) : "";

    if (!filled) {
        const stroke = describeStroke(t, words, gender);
        return withNoun ? attachNoun(t, stroke, nounText) : stroke;
    }

    const color = lookUp(t, COLOR_WORDS, words.fillColorWord, gender);
    const pattern = lookUp(t, FILL_STYLE_WORDS, words.fillStyleWord, gender);
    const parts = pattern ? "pattern" : "plain";
    // Looked up separately rather than written into the messages below: a
    // language that inflects "filled" has to agree it with the shape, and
    // Fluent passes arguments to a message but not on to one it references.
    const filledWord = t("style-filled-word", { gender }, "filled");

    const filledText = withNoun
        ? t(
              "style-filled-with-noun",
              {
                  parts,
                  color,
                  pattern,
                  noun: nounText,
                  filled: filledWord,
                  gender,
              },
              pattern
                  ? `${filledWord} ${color} ${nounText} with ${pattern}`
                  : `${filledWord} ${color} ${nounText}`,
          )
        : t(
              "style-filled",
              { parts, color, pattern, filled: filledWord, gender },
              pattern
                  ? `${filledWord} ${color} with ${pattern}`
                  : `${filledWord} ${color}`,
          );

    // The border repeats the fill's color only when they differ; comparing the
    // authored words rather than the translated ones keeps the test from
    // depending on whether two color keys happen to share a translation.
    const borderRepeatsFill = words.fillColorWord === words.colorWord;
    const borderGender = genderOf(t, "border");
    const border = describeStroke(
        t,
        borderRepeatsFill ? { ...words, colorWord: "" } : words,
        borderGender,
    );
    if (!border) {
        return filledText;
    }

    const connective = pattern ? "and" : "with";
    const borderParts = withNoun ? `${connective}-article` : connective;
    return (
        filledText +
        " " +
        t(
            "style-border-clause",
            { parts: borderParts, border, gender: borderGender },
            withNoun
                ? `${connective} a ${border} border`
                : `${connective} ${border} border`,
        )
    );
}

/** How a shape's interior is filled, on its own: "blue diamonds". */
export function describeFill(
    t: Translator,
    words: { fillColorWord?: string; fillStyleWord?: string },
    { filled }: { filled: boolean },
): string {
    if (!filled) {
        return t("style-unfilled", undefined, "unfilled");
    }
    const gender = genderOf(t, "fill");
    const color = lookUp(t, COLOR_WORDS, words.fillColorWord, gender);
    const pattern = lookUp(t, FILL_STYLE_WORDS, words.fillStyleWord, gender);
    return t(
        "style-fill",
        { parts: pattern ? "pattern" : "plain", color, pattern, gender },
        joinPresent(color, pattern),
    );
}

/** A point, whose noun is the shape its marker is drawn as. */
export function describeMarker(
    t: Translator,
    words: { markerColorWord?: string; markerStyleWord?: string },
    { withNoun }: { withNoun: boolean },
): string {
    const noun = markerWord(t, words.markerStyleWord);
    const gender = genderOf(t, words.markerStyleWord || "point");
    const color = lookUp(t, COLOR_WORDS, words.markerColorWord, gender);
    return withNoun ? attachNoun(t, color, noun) : color;
}

/** A filled region, described by its fill color alone. */
export function describeRegion(
    t: Translator,
    words: { fillColorWord?: string },
    { noun, withNoun }: { noun: NounSpec; withNoun: boolean },
): string {
    const gender = genderOf(t, noun.key);
    const color = lookUp(t, COLOR_WORDS, words.fillColorWord, gender);
    return withNoun ? attachNoun(t, color, nounWord(t, noun)) : color;
}

/** A color word on its own, as `textColor` and `backgroundColor` report it. */
export function describeColor(
    t: Translator,
    colorWord: string | undefined,
    head: PhraseHead,
): string {
    return lookUp(t, COLOR_WORDS, colorWord, genderOf(t, head));
}

/** What `backgroundColor` answers when nothing is drawn behind the text. */
export function noBackgroundWord(t: Translator): string {
    return t("style-background-none", undefined, "none");
}

/**
 * How a piece of text is styled: "red with a blue background".
 *
 * @param background The already-translated background color, or `undefined`
 *   when nothing is drawn behind the text. Presence is decided by the caller
 *   from the raw style, never by comparing against the translated "none" —
 *   that sentinel is itself translated.
 */
export function describeText(
    t: Translator,
    { color, background }: { color: string; background?: string },
): string {
    if (background === undefined) {
        return t("style-text", { parts: "plain", color }, color);
    }
    return t(
        "style-text",
        { parts: "background", color, background },
        `${color} with a ${background} background`,
    );
}
