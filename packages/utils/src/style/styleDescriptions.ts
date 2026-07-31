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
 *
 * @param noun A {@link NounKey}, a {@link PhraseHead}, `"regular-polygon"`, or
 *   — for a marker shape the style pipeline did not derive — an author's own
 *   word. Anything the catalog does not list falls to its default gender, which
 *   is the only sensible answer for a word the catalog has never seen. Typed as
 *   `string` rather than that union precisely because the last case admits any
 *   word at all.
 */
function genderOf(t: Translator, noun: string): string {
    return t("noun-gender", { noun }, "neuter");
}

/**
 * Which syntactic position a description is being rendered into.
 *
 * Gender alone is enough while a phrase appears in exactly one position. Two of
 * them appear in two, and a language that inflects an attributive adjective for
 * case has to tell them apart: a border's adjectives are a standalone phrase in
 * `borderStyleDescription` and the object of a preposition inside
 * `style-border-clause`, where German's `mit einem …` governs the dative and
 * Russian's «с …» the instrumental. The same fork runs through `background`.
 *
 * The names are *positions*, not cases, because which case a position governs
 * is the catalog's business — exactly as `$gender`'s token set already is. The
 * code only has to say where the words are going.
 *
 * A language with no case ignores `$role`, as English ignores `$gender`.
 */
export type PhraseRole = "standalone" | "border-clause" | "background-clause";

/** Look a derived word up in a vocabulary; pass an authored one through. */
function lookUp(
    t: Translator,
    vocabulary: Vocabulary,
    word: string | undefined,
    gender: string,
    role: PhraseRole,
): string {
    if (!word) {
        return "";
    }
    const entry = vocabulary[word];
    return entry ? entry(t, { gender, role }) : word;
}

/**
 * A noun as the composition messages receive it: the word the adjectives
 * attach to, and any complement trailing behind them.
 *
 * Only a regular polygon has a complement today, and only in some languages.
 * English folds its side count into the word itself — "5-sided regular
 * polygon" — and leaves `tail` empty. Spanish cannot: "de 5 lados" has to
 * follow the noun, and putting it there first would strand the adjectives
 * behind it ("polígono regular de 5 lados grueso rojo"), reading as a comment
 * on the sides rather than on the shape. So the noun splits, and the message
 * that composes the phrase decides where each half goes.
 */
type NounPhrase = { noun: string; tail: string };

/** The words naming a {@link NounSpec}. */
function nounPhrase(t: Translator, noun: NounSpec): NounPhrase {
    if (noun.key === "regular-polygon") {
        const { numSides } = noun;
        return {
            noun: t(
                "noun-regular-polygon",
                { part: "head", numSides },
                `${numSides}-sided regular polygon`,
            ),
            tail: t("noun-regular-polygon", { part: "tail", numSides }, ""),
        };
    }
    return { noun: NOUN_WORDS[noun.key](t), tail: "" };
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

/**
 * Words joined by single spaces, with the absent ones dropped.
 *
 * The English word order, used to build each call's fallback string — the one
 * the translator falls back to if even the bundled English catalog is missing
 * the key.
 */
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
 * @param role Which position the phrase is going into, for the languages that
 *   inflect for case. See {@link PhraseRole}.
 */
function describeStroke(
    t: Translator,
    words: StrokeWords,
    gender: string,
    role: PhraseRole,
): string {
    const width = lookUp(
        t,
        LINE_WIDTH_WORDS,
        words.lineWidthWord,
        gender,
        role,
    );
    const lineStyle = lookUp(
        t,
        LINE_STYLE_WORDS,
        words.lineStyleWord,
        gender,
        role,
    );
    const color = lookUp(t, COLOR_WORDS, words.colorWord, gender, role);

    const parts = strokeParts(width, lineStyle, color);
    if (parts === null) {
        return "";
    }
    return t(
        "style-stroke",
        { parts, width, lineStyle, color, gender, role },
        joinPresent(width, lineStyle, color),
    );
}

/** A description followed by what it describes: "thick red line". */
function attachNoun(
    t: Translator,
    description: string,
    { noun, tail }: NounPhrase,
): string {
    // With no adjectives there is nothing for a language to order, and going
    // through the message would leave the space it puts beside the noun —
    // trailing in Spanish, leading in English, invisible in both.
    if (!description) {
        return joinPresent(noun, tail);
    }
    return t(
        "style-with-noun",
        {
            parts: tail ? "noun-tail" : "noun",
            description,
            noun,
            nounTail: tail,
        },
        joinPresent(description, noun, tail),
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
    const stroke = describeStroke(
        t,
        words,
        genderOf(t, noun.key),
        "standalone",
    );
    return withNoun ? attachNoun(t, stroke, nounPhrase(t, noun)) : stroke;
}

/**
 * A shape's border on its own, as `borderStyleDescription` reports it.
 *
 * Standalone, unlike the same words inside `style-border-clause`, which is the
 * whole reason {@link PhraseRole} exists.
 */
export function describeBorder(t: Translator, words: StrokeWords): string {
    return describeStroke(t, words, genderOf(t, "border"), "standalone");
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
    // An unfilled shape is described by its outline alone, which is exactly
    // what a stroked component's description is.
    if (!filled) {
        return describeStrokedShape(t, words, { noun, withNoun });
    }

    const gender = genderOf(t, noun.key);
    const phrase = withNoun ? nounPhrase(t, noun) : undefined;

    const color = lookUp(
        t,
        COLOR_WORDS,
        words.fillColorWord,
        gender,
        "standalone",
    );
    const pattern = lookUp(
        t,
        FILL_STYLE_WORDS,
        words.fillStyleWord,
        gender,
        "standalone",
    );
    const fillParts = pattern ? "pattern" : "plain";
    // Looked up here and handed over as an argument rather than referenced
    // from the messages below: a language that inflects "filled" has to agree
    // it with the shape, and no Fluent reference both carries `$gender` and
    // survives a partial translation. A term reference gets an empty scope and
    // never sees it; a message reference does inherit it, but resolves only
    // within its own bundle, so a locale that translated `style-filled` and
    // not this word would render the reference literally instead of falling
    // back to English.
    const filledWord = t("style-filled-word", { gender }, "filled");
    const patternClause = pattern ? ` with ${pattern}` : "";

    const filledText = phrase
        ? t(
              "style-filled-with-noun",
              {
                  // A complement doubles the variants rather than adding a
                  // placeable: a language that splits its noun has to say
                  // where each half goes relative to the adjectives.
                  parts: phrase.tail ? `${fillParts}-tail` : fillParts,
                  color,
                  pattern,
                  noun: phrase.noun,
                  nounTail: phrase.tail,
                  filled: filledWord,
                  gender,
              },
              joinPresent(filledWord, color, phrase.noun, phrase.tail) +
                  patternClause,
          )
        : t(
              "style-filled",
              { parts: fillParts, color, pattern, filled: filledWord, gender },
              joinPresent(filledWord, color) + patternClause,
          );

    // The border names its color only when it differs from the fill's — the
    // description just said that color, and English does not repeat it.
    // Compared as the authored words rather than the translated ones, so that
    // two color keys sharing a translation in some language cannot silently
    // suppress the border's color there.
    const borderRepeatsFill = words.fillColorWord === words.colorWord;
    const borderGender = genderOf(t, "border");
    // Not `"standalone"`: these words land inside `style-border-clause`, whose
    // preposition governs a case in German and Russian. `describeBorder` builds
    // the same words for the standalone state variable and says so.
    const border = describeStroke(
        t,
        borderRepeatsFill ? { ...words, colorWord: "" } : words,
        borderGender,
        "border-clause",
    );
    if (!border) {
        return filledText;
    }

    const connective = pattern ? "and" : "with";
    const borderParts = withNoun ? `${connective}-article` : connective;
    // The one join the catalog does not own: the clause is appended with a
    // plain space. A language that wants other punctuation between the two has
    // to carry it inside `style-border-clause`, which every variant can do
    // because the connective is already the variant's own text.
    return (
        filledText +
        " " +
        t(
            "style-border-clause",
            {
                parts: borderParts,
                border,
                gender: borderGender,
                role: "border-clause",
            },
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
    const color = lookUp(
        t,
        COLOR_WORDS,
        words.fillColorWord,
        gender,
        "standalone",
    );
    const pattern = lookUp(
        t,
        FILL_STYLE_WORDS,
        words.fillStyleWord,
        gender,
        "standalone",
    );
    return t(
        "style-fill",
        {
            parts: pattern ? "pattern" : "plain",
            color,
            pattern,
            gender,
            role: "standalone",
        },
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
    const color = lookUp(
        t,
        COLOR_WORDS,
        words.markerColorWord,
        gender,
        "standalone",
    );
    return withNoun ? attachNoun(t, color, { noun, tail: "" }) : color;
}

/** A filled region, described by its fill color alone. */
export function describeRegion(
    t: Translator,
    words: { fillColorWord?: string },
    { noun, withNoun }: { noun: NounSpec; withNoun: boolean },
): string {
    const gender = genderOf(t, noun.key);
    const color = lookUp(
        t,
        COLOR_WORDS,
        words.fillColorWord,
        gender,
        "standalone",
    );
    return withNoun ? attachNoun(t, color, nounPhrase(t, noun)) : color;
}

/**
 * A color word on its own, as `textColor` and `backgroundColor` report it.
 *
 * @param role Defaults to `"standalone"`, which is what the two state variables
 *   want. `textStyleDescription` asks for the background in
 *   `"background-clause"` instead, because there the word sits behind a
 *   preposition — the same fork the border has, and the reason a caller has to
 *   look the word up twice rather than reuse one string in both places.
 */
export function describeColor(
    t: Translator,
    colorWord: string | undefined,
    head: PhraseHead,
    role: PhraseRole = "standalone",
): string {
    return lookUp(t, COLOR_WORDS, colorWord, genderOf(t, head), role);
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
        return t(
            "style-text",
            { parts: "plain", color, role: "standalone" },
            color,
        );
    }
    return t(
        "style-text",
        {
            parts: "background",
            color,
            background,
            role: "background-clause",
        },
        `${color} with a ${background} background`,
    );
}
