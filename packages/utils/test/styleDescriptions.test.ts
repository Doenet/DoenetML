import { describe, expect, it } from "vitest";

import fs from "node:fs";
import path from "node:path";
import {
    createTranslator,
    createTranslatorFromLocaleData,
    type TranslationArgs,
    type Translator,
} from "@doenet/i18n";
import {
    describeBorder,
    describeClosedShape,
    describeColor,
    describeFill,
    describeMarker,
    describeRegion,
    describeStrokedShape,
    describeText,
    noBackgroundWord,
    type NounSpec,
    type PhraseRole,
} from "../src/style/styleDescriptions";

/**
 * The English these descriptions produce is load-bearing: some sixty worker
 * test files assert it verbatim, and authors interpolate it into their prose.
 * The tables below are golden files — a diff here is a change to published
 * content, not an implementation detail.
 *
 * Note that `@doenet/i18n` resolves to its *build* output here, as every
 * cross-package import in this repo does. After editing a catalog, run
 * `npm run build -w @doenet/i18n` or these tests will still see the old words.
 */
const en: Translator = createTranslator([], {});

/**
 * Spanish handed over exactly as the worker gets it: only English is bundled,
 * so every other language reaches the core as `LocaleData.resources`, loaded on
 * the main thread and sent through `setLocaleData`.
 */
const es: Translator = createTranslatorFromLocaleData(
    { locale: "es", resources: { es: readCatalog("es", "content") } },
    "es",
);

/** The same, for a right-to-left language that agrees its adjectives. */
const he: Translator = createTranslatorFromLocaleData(
    { locale: "he", resources: { he: readCatalog("he", "content") } },
    "he",
);

/** One that agrees them *and* inflects them for the position they land in. */
const ur: Translator = createTranslatorFromLocaleData(
    { locale: "ur", resources: { ur: readCatalog("ur", "content") } },
    "ur",
);

/** One whose case marking shows up in a single gender and a single position. */
const ps: Translator = createTranslatorFromLocaleData(
    { locale: "ps", resources: { ps: readCatalog("ps", "content") } },
    "ps",
);

/** One of this repository's catalogs, read the way a host would supply it. */
function readCatalog(locale: string, namespace: string): string {
    return fs.readFileSync(
        path.resolve(
            __dirname,
            "../../i18n/locales",
            locale,
            `${namespace}.ftl`,
        ),
        "utf-8",
    );
}

const line: NounSpec = { key: "line" };
const circle: NounSpec = { key: "circle" };

describe("stroked shapes", () => {
    const cases: [string, Record<string, string>, string, string][] = [
        [
            "width, dash pattern and color",
            {
                lineWidthWord: "thick",
                lineStyleWord: "dashed",
                colorWord: "blue",
            },
            "thick dashed blue",
            "thick dashed blue line",
        ],
        [
            "no dash pattern",
            { lineWidthWord: "thick", lineStyleWord: "", colorWord: "red" },
            "thick red",
            "thick red line",
        ],
        [
            "no width",
            { lineWidthWord: "", lineStyleWord: "dotted", colorWord: "green" },
            "dotted green",
            "dotted green line",
        ],
        [
            "color alone",
            { lineWidthWord: "", lineStyleWord: "", colorWord: "purple" },
            "purple",
            "purple line",
        ],
        [
            "an authored word passes through",
            { lineWidthWord: "", lineStyleWord: "", colorWord: "chartreuse" },
            "chartreuse",
            "chartreuse line",
        ],
    ];

    for (const [name, words, description, withNoun] of cases) {
        it(name, () => {
            expect(
                describeStrokedShape(en, words, {
                    noun: line,
                    withNoun: false,
                }),
            ).toBe(description);
            expect(
                describeStrokedShape(en, words, { noun: line, withNoun: true }),
            ).toBe(withNoun);
        });
    }

    it("describes nothing when the style names nothing", () => {
        const nothing = { lineWidthWord: "", lineStyleWord: "", colorWord: "" };
        expect(
            describeStrokedShape(en, nothing, {
                noun: line,
                withNoun: false,
            }),
        ).toBe("");
        // The noun alone, with no space where the adjectives would have been.
        expect(
            describeStrokedShape(en, nothing, { noun: line, withNoun: true }),
        ).toBe("line");
    });
});

describe("closed shapes", () => {
    const blueOutline = {
        lineWidthWord: "thick",
        lineStyleWord: "",
        colorWord: "blue",
    };

    it("describes an unfilled shape by its border", () => {
        expect(
            describeClosedShape(en, blueOutline, {
                filled: false,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("thick blue");
        expect(
            describeClosedShape(en, blueOutline, {
                filled: false,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("thick blue circle");
    });

    it("omits the border clause when the border repeats the fill", () => {
        const words = {
            ...blueOutline,
            lineWidthWord: "",
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle");
    });

    it("names a border that only differs in width", () => {
        const words = {
            ...blueOutline,
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with thick border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with a thick border");
    });

    it("names a border of a different color", () => {
        const words = {
            ...blueOutline,
            colorWord: "red",
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with thick red border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with a thick red border");
    });

    it("switches the connective once a fill pattern is mentioned", () => {
        const words = {
            ...blueOutline,
            colorWord: "red",
            fillColorWord: "blue",
            fillStyleWord: "diamonds",
        };
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: false,
            }),
        ).toBe("filled blue with diamonds and thick red border");
        expect(
            describeClosedShape(en, words, {
                filled: true,
                noun: circle,
                withNoun: true,
            }),
        ).toBe("filled blue circle with diamonds and a thick red border");
    });

    it("names a shape by its side count", () => {
        const regularPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 5,
        };
        expect(
            describeClosedShape(
                en,
                { ...blueOutline, fillColorWord: "blue", fillStyleWord: "" },
                { filled: false, noun: regularPolygon, withNoun: true },
            ),
        ).toBe("thick blue 5-sided regular polygon");
        expect(
            describeClosedShape(
                en,
                { ...blueOutline, fillColorWord: "red", fillStyleWord: "dots" },
                { filled: true, noun: regularPolygon, withNoun: true },
            ),
        ).toBe(
            "filled red 5-sided regular polygon with dots and a thick blue border",
        );
    });

    it("formats a large side count by the locale's number rules", () => {
        // The side count is handed over as a real number, so Fluent formats it
        // with `Intl` — the package's number-formatting policy. It is the one
        // place a description is not character-for-character what the
        // pre-catalog concatenation produced, which said "1000-sided".
        const bigPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 1000,
        };
        expect(
            describeStrokedShape(
                en,
                { colorWord: "red" },
                { noun: bigPolygon, withNoun: true },
            ),
        ).toBe("red 1,000-sided regular polygon");
    });
});

describe("the other descriptions", () => {
    it("describes a border on its own", () => {
        expect(
            describeBorder(en, {
                lineWidthWord: "thin",
                lineStyleWord: "dotted",
                colorWord: "brown",
            }),
        ).toBe("thin dotted brown");
    });

    it("describes a fill on its own", () => {
        expect(
            describeFill(
                en,
                { fillColorWord: "pink", fillStyleWord: "" },
                { filled: true },
            ),
        ).toBe("pink");
        expect(
            describeFill(
                en,
                { fillColorWord: "pink", fillStyleWord: "vertical lines" },
                { filled: true },
            ),
        ).toBe("pink vertical lines");
        expect(
            describeFill(en, { fillColorWord: "pink" }, { filled: false }),
        ).toBe("unfilled");
    });

    it("describes a point by its marker shape", () => {
        const words = { markerColorWord: "orange", markerStyleWord: "square" };
        expect(describeMarker(en, words, { withNoun: false })).toBe("orange");
        expect(describeMarker(en, words, { withNoun: true })).toBe(
            "orange square",
        );
    });

    it("describes a region by its fill color", () => {
        const noun: NounSpec = { key: "region" };
        expect(
            describeRegion(
                en,
                { fillColorWord: "cyan" },
                {
                    noun,
                    withNoun: false,
                },
            ),
        ).toBe("cyan");
        expect(
            describeRegion(
                en,
                { fillColorWord: "cyan" },
                {
                    noun,
                    withNoun: true,
                },
            ),
        ).toBe("cyan region");
    });

    it("describes text with and without a background", () => {
        expect(describeText(en, { color: "black" })).toBe("black");
        expect(describeText(en, { color: "black", background: "yellow" })).toBe(
            "black with a yellow background",
        );
        expect(noBackgroundWord(en)).toBe("none");
        expect(describeColor(en, "gray", "text")).toBe("gray");
    });
});

describe("Spanish", () => {
    it("puts the noun first and agrees with its gender", () => {
        const words = {
            lineWidthWord: "thick",
            lineStyleWord: "dashed",
            colorWord: "red",
        };
        expect(
            describeStrokedShape(es, words, { noun: line, withNoun: true }),
        ).toBe("línea discontinua gruesa roja");
        expect(
            describeStrokedShape(es, words, {
                noun: { key: "vector" },
                withNoun: true,
            }),
        ).toBe("vector discontinuo grueso rojo");
    });

    it("agrees even when the noun itself is not said", () => {
        const words = {
            lineWidthWord: "thin",
            lineStyleWord: "",
            colorWord: "white",
        };
        expect(
            describeStrokedShape(es, words, { noun: line, withNoun: false }),
        ).toBe("delgada blanca");
        expect(
            describeStrokedShape(es, words, {
                noun: { key: "point" },
                withNoun: false,
            }),
        ).toBe("delgado blanco");
    });

    it("agrees a border with the word for border, not with the shape", () => {
        expect(
            describeClosedShape(
                es,
                {
                    lineWidthWord: "thick",
                    lineStyleWord: "",
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "",
                },
                { filled: true, noun: { key: "region" }, withNoun: true },
            ),
        ).toBe("región azul rellena con un borde grueso rojo");
    });

    it("names a regular polygon by its side count", () => {
        // The noun splits: the adjectives stay beside "polígono regular", and
        // "de 7 lados" closes the phrase behind them. Filled, the complement
        // moves back up against the noun instead — "relleno de 7 lados" would
        // read as *what the shape is filled with*.
        const regularPolygon: NounSpec = {
            key: "regular-polygon",
            numSides: 7,
        };
        expect(
            describeClosedShape(
                es,
                { lineWidthWord: "thick", lineStyleWord: "", colorWord: "red" },
                { filled: false, noun: regularPolygon, withNoun: true },
            ),
        ).toBe("polígono regular grueso rojo de 7 lados");
        expect(
            describeClosedShape(
                es,
                {
                    lineWidthWord: "",
                    lineStyleWord: "",
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "dots",
                },
                { filled: true, noun: regularPolygon, withNoun: true },
            ),
        ).toBe(
            "polígono regular de 7 lados azul relleno con puntos y un borde rojo",
        );
        // Without the noun there is nothing to split around.
        expect(
            describeClosedShape(
                es,
                { lineWidthWord: "", lineStyleWord: "", colorWord: "green" },
                { filled: false, noun: regularPolygon, withNoun: false },
            ),
        ).toBe("verde");
    });

    it("translates the remaining descriptions", () => {
        expect(
            describeMarker(
                es,
                { markerColorWord: "black", markerStyleWord: "triangle" },
                { withNoun: true },
            ),
        ).toBe("triángulo negro");
        expect(
            describeFill(es, { fillColorWord: "yellow" }, { filled: false }),
        ).toBe("sin relleno");
        expect(
            describeFill(
                es,
                { fillColorWord: "yellow", fillStyleWord: "dots" },
                { filled: true },
            ),
        ).toBe("puntos de color amarillo");
        expect(noBackgroundWord(es)).toBe("ninguno");
        expect(
            describeText(es, {
                color: describeColor(es, "black", "text"),
                background: describeColor(es, "white", "background"),
            }),
        ).toBe("negro con un fondo blanco");
    });

    it("leaves an authored word alone", () => {
        expect(
            describeStrokedShape(
                es,
                {
                    lineWidthWord: "",
                    lineStyleWord: "",
                    colorWord: "rebeccapurple",
                },
                { noun: line, withNoun: true },
            ),
        ).toBe("línea rebeccapurple");
    });
});

describe("Hebrew", () => {
    // The border is the one phrase head whose gender disagrees with the
    // default here: «מסגרת» is feminine where «מילוי», «רקע» and «טקסט» are
    // masculine, so `noun-gender` has to name it. Asserted because the noun is
    // never handed to the catalog — it is written into `style-border-clause`,
    // and nothing but agreement reveals which word the clause chose.
    it("agrees a border with the word for border, not with the shape", () => {
        expect(
            describeBorder(he, {
                lineWidthWord: "thick",
                lineStyleWord: "",
                colorWord: "red",
            }),
        ).toBe("אדומה עבה");
        expect(
            describeClosedShape(
                he,
                {
                    lineWidthWord: "thick",
                    lineStyleWord: "",
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "",
                },
                { filled: true, noun: { key: "region" }, withNoun: true },
            ),
        ).toBe("אזור כחול מלא עם מסגרת אדומה עבה");
    });

    it("agrees the other phrase heads as masculine", () => {
        expect(describeColor(he, "red", "text")).toBe("אדום");
        expect(describeColor(he, "red", "background")).toBe("אדום");
        expect(
            describeFill(he, { fillColorWord: "red" }, { filled: true }),
        ).toBe("אדום");
    });
});

describe("Urdu", () => {
    // «والا» attaches the fill pattern to the shape, and it is a marked
    // adjective in its own right: it agrees with the shape rather than with the
    // pattern it follows. Nothing else in the phrase reveals the choice, since
    // the pattern word beside it is an invariant oblique plural.
    it("agrees the fill-pattern word with the shape it describes", () => {
        const words = {
            lineWidthWord: "",
            lineStyleWord: "",
            colorWord: "",
            fillColorWord: "green",
            fillStyleWord: "dots",
        };
        expect(
            describeClosedShape(ur, words, {
                filled: true,
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("نقطوں والی ہری بھری ہوئی لکیر");
        expect(
            describeClosedShape(ur, words, {
                filled: true,
                noun: { key: "square" },
                withNoun: true,
            }),
        ).toBe("نقطوں والا ہرا بھرا ہوا مربع");
    });
});

describe("Pashto", () => {
    // Pashto marks case on a feminine adjective in ـه and nowhere else, so the
    // border clause — whose «څنډه» is feminine and sits under a circumposition
    // — is the one position whose words differ from the standalone form. The
    // masculine spells both alike, which is why the standalone assertion below
    // is the interesting half of the pair.
    it("puts a border's adjectives in the oblique inside the clause", () => {
        const border = {
            lineWidthWord: "thick",
            lineStyleWord: "",
            colorWord: "red",
        };
        expect(describeBorder(ps, border)).toBe("پنډه سره");
        expect(
            describeClosedShape(
                ps,
                { ...border, fillColorWord: "blue", fillStyleWord: "" },
                { filled: true, noun: { key: "square" }, withNoun: true },
            ),
        ).toBe("نیلي ډک مربع له پنډې سرې څنډې سره");
    });
});

describe("a partly translated locale", () => {
    // A translation is allowed to lag: every key it does not define falls
    // through to English. The split noun is the case where that matters, since
    // English never selects the `-tail` variants for itself — it keeps them so
    // that a locale which translates `noun-regular-polygon` but not the
    // messages composing it still gets its complement placed rather than
    // dropped.
    // Fluent is whitespace-sensitive, so the source starts at column zero.
    const de = createTranslator(["de"], {
        de: `
noun-regular-polygon =
    { $part ->
        [tail] mit { $numSides } Seiten
       *[head] regelmäßiges Vieleck
    }
`,
    });

    const polygon: NounSpec = { key: "regular-polygon", numSides: 5 };

    it("keeps the noun's complement in the unfilled description", () => {
        expect(
            describeStrokedShape(
                de,
                { lineWidthWord: "thick", colorWord: "red" },
                { noun: polygon, withNoun: true },
            ),
        ).toBe("thick red regelmäßiges Vieleck mit 5 Seiten");
    });

    it("keeps it in the filled description too", () => {
        expect(
            describeClosedShape(
                de,
                {
                    colorWord: "red",
                    fillColorWord: "blue",
                    fillStyleWord: "dots",
                },
                { filled: true, noun: polygon, withNoun: true },
            ),
        ).toBe(
            "filled blue regelmäßiges Vieleck mit 5 Seiten with dots and a red border",
        );
    });
});

/**
 * The two-position forks (#1606).
 *
 * Three sets of words are rendered in two syntactic positions each: a border's
 * adjectives, the background colour, and the text colour beside it. A language
 * that inflects for case needs a different form in each, and the bug this
 * guards was that only one of the two was ever checked — the standalone side
 * of the border and the embedded side of the background were both wrong for
 * over a release without a test noticing.
 *
 * So every case below asserts *both* sides. The catalogs are read off disk
 * rather than stubbed, because the point is that the shipped ones resolve the
 * fork, not merely that the mechanism can.
 */
describe("a phrase rendered in two positions", () => {
    /** A catalog as the worker receives it, for the five that select on role. */
    const forLocale = (locale: string): Translator =>
        createTranslatorFromLocaleData(
            { locale, resources: { [locale]: readCatalog(locale, "content") } },
            locale,
        );

    const de = forLocale("de");
    const ru = forLocale("ru");
    const pl = forLocale("pl");
    const hi = forLocale("hi");
    const mr = forLocale("mr");

    const borderWords = { colorWord: "black", lineWidthWord: "thick" };
    const shapeWords = { ...borderWords, fillColorWord: "blue" };
    const circle: NounSpec = { key: "circle" };

    /** The border's adjectives, standalone and inside the clause. */
    const bothBorderForms = (t: Translator) => ({
        standalone: describeBorder(t, borderWords),
        embedded: describeClosedShape(t, shapeWords, {
            filled: true,
            noun: circle,
            withNoun: true,
        }),
    });

    /** The text and background colours, standalone and inside the sentence. */
    const bothTextForms = (t: Translator) => ({
        textColor: describeColor(t, "red", "text"),
        backgroundColor: describeColor(t, "yellow", "background"),
        sentence: describeText(t, {
            color: describeColor(t, "red", "text", "text-clause"),
            background: describeColor(
                t,
                "yellow",
                "background",
                "background-clause",
            ),
        }),
    });

    it("leaves English alone, which has no case to inflect for", () => {
        expect(bothBorderForms(en)).toEqual({
            standalone: "thick black",
            embedded: "filled blue circle with a thick black border",
        });
        expect(bothTextForms(en)).toEqual({
            textColor: "red",
            backgroundColor: "yellow",
            sentence: "red with a yellow background",
        });
    });

    it("leaves Spanish alone, which inflects for gender but not case", () => {
        expect(bothTextForms(es)).toEqual({
            textColor: "rojo",
            backgroundColor: "amarillo",
            sentence: "rojo con un fondo amarillo",
        });
    });

    // Nominative standing alone, dative after `mit einem`. Before #1606 both
    // came out `dicken`, because the catalog had to spend its one token on the
    // clause.
    it("gives German a nominative border alone and a dative one in the clause", () => {
        expect(bothBorderForms(de)).toEqual({
            standalone: "dicker schwarzer",
            embedded: "gefüllter blauer Kreis mit einem dicken schwarzen Rand",
        });
    });

    // Attributive in the two variables, predicative and dative in the
    // sentence. Before #1606 the sentence read `roter auf gelber Hintergrund`,
    // wrong in both halves.
    it("gives German predicative text and a dative background in one sentence", () => {
        expect(bothTextForms(de)).toEqual({
            textColor: "roter",
            backgroundColor: "gelber",
            sentence: "rot auf gelbem Hintergrund",
        });
    });

    // Nominative feminine agreeing with «граница» alone, instrumental after
    // «с». Before #1606 the standalone form came out `толстой`.
    it("gives Russian a nominative border alone and an instrumental one in the clause", () => {
        expect(bothBorderForms(ru)).toEqual({
            standalone: "толстая чёрная",
            embedded: "закрашенная синяя окружность с толстой чёрной границей",
        });
    });

    // Before #1606 the sentence read `красный на жёлтый фоне`, with the
    // background left in the nominative behind a preposition governing the
    // prepositional.
    it("gives Russian a prepositional background inside the sentence", () => {
        expect(bothTextForms(ru)).toEqual({
            textColor: "красный",
            backgroundColor: "жёлтый",
            sentence: "красный на жёлтом фоне",
        });
    });

    // Three cases from one set of words: nominative alone, instrumental after
    // «z», locative after «na». Polish is the catalog `$role` was needed for —
    // no single token could have carried all three.
    it("gives Polish a different case in each of its three positions", () => {
        expect(bothBorderForms(pl)).toEqual({
            standalone: "grube czarne",
            embedded:
                "wypełniony niebieski okrąg z grubym czarnym obramowaniem",
        });
        expect(bothTextForms(pl)).toEqual({
            textColor: "czerwony",
            backgroundColor: "żółte",
            sentence: "czerwony na żółtym tle",
        });
    });

    // Hindi forks on the direct/oblique distinction rather than on a case
    // paradigm: a marked adjective takes the oblique before a postposition,
    // and an unmarked one never changes.
    it("gives Hindi an oblique border before its postposition", () => {
        expect(bothBorderForms(hi)).toEqual({
            standalone: "मोटा काला",
            embedded: "नीला भरा हुआ वृत्त मोटे काले किनारे के साथ",
        });
    });

    // Hindi's other two positions are the case where a fork exists and both
    // sides land on the same word: `पृष्ठभूमि` is feminine, and a marked
    // adjective spells its feminine the same direct and oblique, so `पीली`
    // stands alone and behind `पर` alike. Asserted anyway, because the branches
    // are there to be selected and because the sentence reorders — Hindi puts
    // the background first, which no other locale here does.
    it("gives Hindi one spelling in both of its text positions", () => {
        expect(bothTextForms(hi)).toEqual({
            textColor: "लाल",
            backgroundColor: "पीली",
            sentence: "पीली पृष्ठभूमि पर लाल",
        });
    });

    // Marathi forks the same way Hindi does and on three genders rather than
    // two, so a border agrees feminine with «किनार» standing alone and takes
    // the oblique -या before -सह.
    it("gives Marathi a feminine border alone and an oblique one in the clause", () => {
        expect(bothBorderForms(mr)).toEqual({
            standalone: "जाड काळी",
            embedded: "भरलेले निळे वर्तुळ जाड काळ्या किनारीसह",
        });
    });

    // Marathi's background does fork where Hindi's does not: «पिवळी» agrees
    // with the feminine «पार्श्वभूमी» standing alone and goes oblique to
    // «पिवळ्या» before -वर. The text colour beside it is «लाल», which never
    // inflects, so its `text-clause` branch is selected here rather than told
    // apart from the direct form.
    it("gives Marathi an oblique background inside the sentence", () => {
        expect(bothTextForms(mr)).toEqual({
            textColor: "लाल",
            backgroundColor: "पिवळी",
            sentence: "पिवळ्या पार्श्वभूमीवर लाल",
        });
    });

    // The guard that keeps this from rotting: if a catalog ever collapses the
    // two positions again, these differ where they should not.
    it("keeps the two positions distinct wherever a language inflects", () => {
        for (const t of [de, ru, pl, hi, mr]) {
            const border = bothBorderForms(t);
            expect(border.embedded).not.toContain(border.standalone);
        }
        // Hindi is absent here on purpose: it is the one whose background does
        // not change shape between the two, per the case above. Marathi spells
        // its feminine oblique differently and so belongs here.
        for (const t of [de, ru, pl, mr]) {
            const text = bothTextForms(t);
            expect(text.sentence).not.toContain(text.backgroundColor);
        }
    });

    /**
     * The fill-pattern words fork the same way the adjectives do, but without a
     * `$role` to say so: `describeClosedShape` puts them behind a preposition
     * ("with diamonds") while `describeFill` prints them on their own. A
     * language that inflects a noun after a preposition therefore has to spell
     * them for the embedded use — the one where a word is actually governed —
     * and give `style-fill` a head noun for them to hang off, as German's
     * „blaue Füllung mit Rauten" does. A catalog that forgets prints a bare
     * governed form: Hindi's oblique plural «समचतुर्भुजों» with nothing
     * governing it.
     */
    it("gives a governed fill pattern something to hang off when it stands alone", () => {
        const blueDiamonds = {
            fillColorWord: "blue",
            fillStyleWord: "diamonds",
        };
        const standalone = (t: Translator) =>
            describeFill(t, blueDiamonds, { filled: true });

        expect(standalone(de)).toBe("blaue Füllung mit Rauten");
        expect(standalone(ru)).toBe("синяя заливка с ромбами");
        expect(standalone(hi)).toBe("समचतुर्भुजों वाला नीला भराव");
        // Polish names a pattern with «w» and the accusative, which for a
        // non-virile plural is spelled like the nominative — so the same words
        // serve both positions and no head noun is needed.
        expect(standalone(pl)).toBe("niebieskie romby");
    });

    /**
     * English lets one "with" cover both a fill pattern and the border that
     * follows it — "with diamonds and a thin red border". A language whose two
     * clauses take different prepositions cannot: Polish names the pattern with
     * «w» and the accusative, and that preposition does not reach the
     * instrumental behind it, so the `and` branch of `style-border-clause` has
     * to carry a «z» of its own.
     */
    it("repeats the preposition when the two clauses do not share one", () => {
        const patternedWithBorder = (t: Translator) =>
            describeClosedShape(
                t,
                {
                    colorWord: "red",
                    lineWidthWord: "thin",
                    fillColorWord: "green",
                    fillStyleWord: "diamonds",
                },
                { filled: true, noun: { key: "polygon" }, withNoun: true },
            );

        expect(patternedWithBorder(pl)).toBe(
            "wypełniony zielony wielokąt w romby i z cienkim czerwonym obramowaniem",
        );
        // German and Russian do share one — „mit" and «с» govern both — so
        // theirs stays a bare conjunction.
        expect(patternedWithBorder(de)).toBe(
            "gefülltes grünes Vieleck mit Rauten und einem dünnen roten Rand",
        );
        expect(patternedWithBorder(ru)).toBe(
            "закрашенный зелёный многоугольник с ромбами и тонкой красной границей",
        );
    });
});

/**
 * The invariant behind `$role`: every message that places an adjective is
 * handed one.
 *
 * The failure mode this guards is not a wrong word but a missing argument. A
 * message that never receives `$role` selects its default branch in every
 * position, silently, and English — which ignores the argument — renders
 * identically either way, so no golden expectation above moves. Two messages
 * were in fact forgotten while this change was being written, and neither was
 * caught by a rendering test; both were found by reading the code.
 *
 * So rather than assert words, this walks every description with a translator
 * that records what it was asked for, and checks the arguments themselves. A
 * composition message added later lands on the "must carry a role" side by
 * default, and the completeness check below fails until the walk reaches it.
 */
describe("the role argument", () => {
    /**
     * Every member of {@link PhraseRole}, as a table rather than a list so that
     * widening the type without deciding what it means here is a type error.
     */
    const ROLES: Record<PhraseRole, true> = {
        standalone: true,
        "border-clause": true,
        "background-clause": true,
        "text-clause": true,
    };
    const ROLE_NAMES = Object.keys(ROLES);

    /**
     * The messages that legitimately go without one, and why. Everything else
     * places an adjective somewhere and has to say where.
     */
    const withoutRole = new Set([
        "style-unfilled", // describes an absence; there is no adjective in it
        "style-background-none", // likewise
        "style-text", // its two words are in two positions at once
    ]);

    /** Nouns are what the adjectives agree *with*: they carry gender, not role. */
    const isNoun = (key: string) => key.startsWith("noun");

    /** Every description this module can produce, in every branch. */
    function everyDescription(t: Translator) {
        const words = {
            colorWord: "red",
            lineWidthWord: "thick",
            lineStyleWord: "dashed",
            fillColorWord: "blue",
            fillStyleWord: "diamonds",
        };
        const nouns: NounSpec[] = [
            { key: "line" },
            { key: "regular-polygon", numSides: 5 },
        ];

        for (const noun of nouns) {
            for (const withNoun of [false, true]) {
                describeStrokedShape(t, words, { noun, withNoun });
                describeRegion(t, words, { noun, withNoun });
                for (const filled of [false, true]) {
                    describeClosedShape(t, words, { filled, noun, withNoun });
                    // A border that repeats the fill is dropped, and a fill
                    // with no pattern takes the other branch of every message
                    // that mentions one.
                    describeClosedShape(
                        t,
                        { ...words, colorWord: words.fillColorWord },
                        { filled, noun, withNoun },
                    );
                    describeClosedShape(
                        t,
                        { ...words, fillStyleWord: "" },
                        { filled, noun, withNoun },
                    );
                }
            }
        }

        for (const withNoun of [false, true]) {
            describeMarker(
                t,
                { markerColorWord: "green", markerStyleWord: "square" },
                { withNoun },
            );
        }
        describeBorder(t, words);
        for (const filled of [false, true]) {
            describeFill(t, words, { filled });
            describeFill(t, { ...words, fillStyleWord: "" }, { filled });
        }
        for (const role of ROLE_NAMES as PhraseRole[]) {
            describeColor(t, "red", "text", role);
            describeColor(t, "yellow", "background", role);
        }
        noBackgroundWord(t);
        describeText(t, { color: "red" });
        describeText(t, { color: "red", background: "yellow" });
    }

    /**
     * What the walk asked the catalog for. The recorder delegates to English so
     * that each message still selects a real branch and the walk reaches
     * whatever those branches call in turn.
     */
    const calls: [string, TranslationArgs | undefined][] = [];
    const recorder: Translator = (key, args, fallback) => {
        calls.push([key, args]);
        return en(key, args, fallback);
    };
    everyDescription(recorder);

    /** The distinct keys failing `predicate`, so a failure names them. */
    const offenders = (
        predicate: (key: string, args: TranslationArgs | undefined) => boolean,
    ) => [
        ...new Set(calls.filter(([k, a]) => predicate(k, a)).map(([k]) => k)),
    ];

    it("reaches every message that composes a description", () => {
        const composed = [...new Set(calls.map(([key]) => key))]
            .filter((key) => key.startsWith("style-"))
            .sort();
        expect(composed).toEqual([
            "style-background-none",
            "style-border-clause",
            "style-fill",
            "style-filled",
            "style-filled-with-noun",
            "style-filled-word",
            "style-stroke",
            "style-text",
            "style-unfilled",
            "style-with-noun",
        ]);
    });

    it("is handed to every adjective and every message placing one", () => {
        expect(
            offenders(
                (key, args) =>
                    !isNoun(key) &&
                    !withoutRole.has(key) &&
                    !ROLE_NAMES.includes(String(args?.role)),
            ),
        ).toEqual([]);
    });

    it("is withheld from the messages that place none", () => {
        expect(
            offenders(
                (key, args) =>
                    (isNoun(key) || withoutRole.has(key)) &&
                    args?.role !== undefined,
            ),
        ).toEqual([]);
    });
});
