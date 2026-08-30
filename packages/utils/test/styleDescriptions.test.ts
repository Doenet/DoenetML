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
    type NounKey,
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
 * Any other locale on the roster, loaded the way the worker receives it: only
 * English is bundled, so every translation reaches the core as
 * `LocaleData.resources`, read on the main thread and sent through
 * `setLocaleData`.
 *
 * Defined once rather than redeclared per `describe`, which is what a dozen
 * blocks below used to do with byte-identical copies: the shape a catalog is
 * loaded in is a property of this file, not of the language a block is about.
 * `readCatalog` is a function declaration and so is in scope here despite
 * being written below.
 */
const forLocale = (locale: string): Translator =>
    createTranslatorFromLocaleData(
        { locale, resources: { [locale]: readCatalog(locale, "content") } },
        locale,
    );

/** The reference translation, used throughout the tables below. */
const es: Translator = forLocale("es");

/** The same, for a right-to-left language that agrees its adjectives. */
const he: Translator = forLocale("he");

/** One whose adjectives follow the noun rather than preceding it. */
const ar: Translator = forLocale("ar");

/** One that agrees them *and* inflects them for the position they land in. */
const ur: Translator = forLocale("ur");

/** One whose case marking shows up in a single gender and a single position. */
const ps: Translator = forLocale("ps");

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

/**
 * The three style words most of the tests below describe a shape with, held in
 * English so that what changes between locales is the catalog and nothing else.
 */
const words = {
    lineWidthWord: "thick",
    lineStyleWord: "dashed",
    colorWord: "red",
};

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

    /**
     * Filipino joins a numeral to the noun it counts with a linker, and which
     * linker it is depends on how the numeral is *said*: `-ng` after a vowel,
     * the separate `na` after a consonant. That is exactly the split CLDR
     * gives `fil` its two plural categories on, so the side count selects on
     * itself — `other` is 4, 6, 9 and anything ending in them, and `one` is
     * everything else, including 5.
     */
    it("picks the Filipino linker from the side count", () => {
        const fil: Translator = forLocale("fil");
        const sided = (numSides: number) =>
            describeStrokedShape(
                fil,
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides },
                    withNoun: true,
                },
            );
        expect(sided(5)).toBe("pula na regular na polygon na may 5 gilid");
        expect(sided(4)).toBe("pula na regular na polygon na may 4 na gilid");
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

describe("Arabic", () => {
    // The fill is the phrase head an Arabic description is likeliest to get
    // wrong, because the words `describeFill` puts beside the colour are
    // feminine plurals — «معينات» — while the head they hang off, «ملء», is
    // masculine. The gender belongs to the head, so the pattern is given a
    // noun of its own («بلون») rather than the colour being agreed with it;
    // otherwise `fillColor` on its own would report a feminine adjective with
    // nothing feminine in sight.
    it("agrees the fill colour with the word for fill, not with the pattern", () => {
        expect(
            describeFill(
                ar,
                { fillColorWord: "blue", fillStyleWord: "diamonds" },
                { filled: true },
            ),
        ).toBe("معينات بلون أزرق");
        expect(
            describeFill(ar, { fillColorWord: "blue" }, { filled: true }),
        ).toBe("أزرق");
    });

    // The background is the one head that *is* feminine, so the two assertions
    // together say that `noun-gender` names exactly the head it has to.
    it("agrees a background as feminine and the text beside it as masculine", () => {
        expect(describeColor(ar, "yellow", "background")).toBe("صفراء");
        expect(describeColor(ar, "red", "text")).toBe("أحمر");
    });

    it("puts the noun in front of the adjectives that agree with it", () => {
        expect(
            describeStrokedShape(
                ar,
                {
                    lineWidthWord: "thick",
                    lineStyleWord: "dashed",
                    colorWord: "red",
                },
                { noun: { key: "circle" }, withNoun: true },
            ),
        ).toBe("دائرة حمراء متقطعة سميكة");
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

describe("Tajik", () => {
    const tg: Translator = forLocale("tg");

    // Tajik is Persian in Cyrillic, so its adjectives follow the noun and the
    // link between them is the izafat. Persian's is an unwritten vowel after a
    // consonant and the space carries it; Tajik writes it as «-и», so
    // `style-with-noun` welds it onto the placeable. The izafat is not written
    // the same way after every ending — a ъ-final word drops the ъ and a
    // ӣ-final word shortens the ӣ — so what holds the weld is that the catalog
    // chose the words that land there: every entry in its `noun` and `color`
    // tables ends in a consonant or in a vowel the izafat leaves untouched, so
    // the same suffix lands on a consonant-final «хат» and a vowel-final
    // «доира» without changing shape. A chain of adjectives carries the izafat
    // on each non-final one, so «сурхи хат-хати ғафс» rather than a bare
    // juxtaposition, and the stroke adjectives are the mirror of English's
    // order while «пуршуда» stays nearest the noun.
    it("links a noun to its adjectives with the izafat", () => {
        expect(
            describeStrokedShape(
                tg,
                {
                    colorWord: "red",
                    lineWidthWord: "thick",
                    lineStyleWord: "dashed",
                },
                { noun: { key: "line" }, withNoun: true },
            ),
        ).toBe("хати сурхи хат-хати ғафс");
        expect(
            describeClosedShape(
                tg,
                {
                    colorWord: "black",
                    lineWidthWord: "thick",
                    fillColorWord: "blue",
                },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            ),
        ).toBe("доираи пуршудаи кабуд бо ҳошияи сиёҳи ғафс");
    });

    // The side count follows the adjectives rather than standing in front of
    // the noun, so `noun-regular-polygon` splits in two the way Spanish's does
    // and the izafat lands on the head alone.
    it("puts a regular polygon's side count after its adjectives", () => {
        expect(
            describeStrokedShape(
                tg,
                { colorWord: "red", lineWidthWord: "thick" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe("бисёркунҷаи мунтазами сурхи ғафс бо 5 тараф");
    });
});

describe("Irish", () => {
    const ga: Translator = forLocale("ga");

    // The Celtic answer to agreement: a feminine singular noun does not give
    // its adjectives an ending, it softens the front of them. «líne» is
    // feminine, so «tiubh briste dearg» comes out «thiubh bhriste dhearg»; «ga»
    // is masculine and leaves the same words alone. `$gender` carries the whole
    // of that, which is why no Celtic catalog writes a `$role` branch.
    it("lenites a feminine noun's adjectives and leaves a masculine one's", () => {
        expect(
            describeStrokedShape(ga, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("líne thiubh bhriste dhearg");
        expect(
            describeStrokedShape(ga, words, {
                noun: { key: "ray" },
                withNoun: true,
            }),
        ).toBe("ga tiubh briste dearg");
    });

    // «imlíne» begins with a vowel and «le» prefixes h- to one, so the border
    // noun is spelled two ways depending on which word introduces the clause.
    // It is also feminine whatever the shape around it is, so its adjectives
    // lenite while the shape's own colour, agreeing with masculine «ciorcal»,
    // does not.
    it("prefixes h- to the border noun after «le»", () => {
        expect(
            describeClosedShape(
                ga,
                {
                    colorWord: "black",
                    lineWidthWord: "thick",
                    fillColorWord: "blue",
                },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            ),
        ).toBe("ciorcal gorm líonta le himlíne thiubh dhubh");
    });
});

/**
 * `$gender` is a token set, not a gender (#1641).
 *
 * The argument was named for the masculine/feminine split Spanish and German
 * need, but nothing outside a catalog interprets its values: `noun-gender`
 * answers whatever the language agrees on, and every adjective lookup selects
 * on that answer. Swahili is the case that proves it — a Bantu adjective
 * agrees with its noun's *class*, of which the catalog's shapes land in four,
 * and no code outside `locales/sw/content.ftl` had to learn what a noun class
 * is. (`noun-gender` answers a fifth, `c6`, for `text` alone.)
 *
 * This is the guard for that. If `$gender` ever stopped reaching the adjective
 * lookups, or `noun-gender` stopped being consulted per noun, all four rows
 * below would collapse onto one prefix.
 */
describe("Swahili noun classes", () => {
    const sw: Translator = forLocale("sw");

    // One set of style words against four nouns, one from each class a shape
    // lands in. The stems are the same throughout —
    // -nene "thick" and -ekundu "red" — and only the concord prefix moves.
    const byClass: [string, NounKey, string][] = [
        ["class 3", "line", "mstari mnene mwekundu kwa vipande"],
        ["class 5", "circle", "duara nene jekundu kwa vipande"],
        [
            "class 7",
            "line-segment",
            "kipande cha mstari kinene chekundu kwa vipande",
        ],
        ["class 9", "polygon", "pembenyingi nene nyekundu kwa vipande"],
    ];

    for (const [className, key, expected] of byClass) {
        it(`agrees with a ${className} noun`, () => {
            expect(
                describeStrokedShape(sw, words, {
                    noun: { key },
                    withNoun: true,
                }),
            ).toBe(expected);
        });
    }

    // The rows above would each still pass if `$gender` were ignored and all
    // four read alike, since none of them looks at another. This is the case
    // that would not: the adjectives alone, with the noun withheld, are four
    // different strings.
    it("gives each class a different adjective phrase", () => {
        const adjectives = byClass.map(([, key]) =>
            describeStrokedShape(sw, words, { noun: { key }, withNoun: false }),
        );
        expect(adjectives).toEqual([
            "mnene mwekundu kwa vipande",
            "nene jekundu kwa vipande",
            "kinene chekundu kwa vipande",
            "nene nyekundu kwa vipande",
        ]);
    });

    // The class the *filled* participle agrees with is the shape's, while the
    // border clause beside it agrees with «mpaka» — class 3 whatever the shape
    // is. So one sentence carries two classes, and swapping the shape moves
    // only the first of them.
    it("agrees the fill with the shape and the border with «mpaka»", () => {
        const filled = { ...words, fillColorWord: "blue", fillStyleWord: "" };
        const shape = (key: NounKey) =>
            describeClosedShape(sw, filled, {
                filled: true,
                noun: { key },
                withNoun: true,
            });
        expect(shape("circle")).toBe(
            "duara lililojazwa buluu na mpaka mnene mwekundu kwa vipande",
        );
        expect(shape("square")).toBe(
            "mraba uliojazwa buluu na mpaka mnene mwekundu kwa vipande",
        );
    });
});

describe("Ojibwe animacy", () => {
    const oj: Translator = forLocale("oj");

    // The third mechanism `$gender` has been asked to carry, after a gender and
    // a noun class: Ojibwe's is **animate against inanimate**, and the words
    // that describe a thing are verbs that agree with it. So the stems are the
    // same throughout — gipag- "thick", misk- "red" — and only the final
    // syllable moves, `-zi` for an animate subject and `-aa` for an inanimate
    // one.
    //
    // Which shapes are which is a fact about the Ojibwe words rather than about
    // the shapes, and `locales/oj`'s own `noun-gender` is the guess this pins.
    const byAnimacy: [string, NounKey, string][] = [
        ["animate", "circle", "gipagizi bakwezhigizi miskozi waawiyeyaa"],
        ["inanimate", "line", "gipagaa bakwezhigaa miskwaa jiigaatig"],
        ["animate", "point", "gipagizi bakwezhigizi miskozi mazina'igaans"],
        ["inanimate", "square", "gipagaa bakwezhigaa miskwaa niiyoowiikwaan"],
    ];

    for (const [animacy, key, expected] of byAnimacy) {
        it(`agrees with ${animacy} «${key}»`, () => {
            expect(
                describeStrokedShape(oj, words, {
                    noun: { key },
                    withNoun: true,
                }),
            ).toBe(expected);
        });
    }

    // The rows above would each still pass if `$gender` were ignored and every
    // shape read alike, since none of them looks at another. This is the case
    // that would not: with the noun withheld, the two animacies are two
    // different strings, and there is no noun left to carry the difference.
    it("gives each animacy a different verb phrase", () => {
        const adjectives = [
            ...new Set(
                byAnimacy.map(([, key]) =>
                    describeStrokedShape(oj, words, {
                        noun: { key },
                        withNoun: false,
                    }),
                ),
            ),
        ];
        expect(adjectives).toEqual([
            "gipagizi bakwezhigizi miskozi",
            "gipagaa bakwezhigaa miskwaa",
        ]);
    });

    // One sentence carrying both animacies, which is the Swahili «mpaka» case
    // in a two-token system: the *filled* verb agrees with the shape — animate
    // «mooshkinezi» for the circle — while the border's own adjectives agree
    // with «jiigaatigwaan», which `noun-gender` answers `inan` for whatever the
    // shape is. Swapping the shape moves only the first of them.
    it("agrees the fill with the shape and the border with «jiigaatigwaan»", () => {
        const filled = {
            lineWidthWord: "thick",
            lineStyleWord: "dashed",
            colorWord: "black",
            fillColorWord: "blue",
            fillStyleWord: "",
        };
        const shape = (key: NounKey) =>
            describeClosedShape(oj, filled, {
                filled: true,
                noun: { key },
                withNoun: true,
            });
        expect(shape("circle")).toBe(
            "mooshkinezi ozhaawashko-gizhigizi waawiyeyaa gaye gipagaa bakwezhigaa makadewaa jiigaatigwaan",
        );
        expect(shape("square")).toBe(
            "mooshkinebii ozhaawashko-gizhigaa niiyoowiikwaan gaye gipagaa bakwezhigaa makadewaa jiigaatigwaan",
        );
    });
});

describe("the Indigenous Americas batch's word order", () => {
    /**
     * Six of the eight put their adjectives **in front of** the noun, which is
     * English's order — and after six Romance catalogs in the previous batch
     * that all had to invert it, that is the useful thing to pin. The
     * `$part` split collapses with it: a side count is a prenominal modifier in
     * all six, so the head carries it and `noun-regular-polygon`'s `[tail]`
     * branch renders empty.
     *
     * Asserted as an **identity** rather than as a difference, the way
     * `locales/se`'s attributive form is: what this catches is someone
     * "correcting" one of these catalogs by moving its adjectives behind the
     * noun on the assumption that a non-European language must want them there.
     */
    const prenominal: [string, string, string][] = [
        ["qu", "rakhu t'aqasqa puka siq'i", "rakhu t'aqasqa puka"],
        ["ay", "lanqu t'aqata chupika siqi", "lanqu t'aqata chupika"],
        [
            "nah",
            "tomāhuac tlacotōctic chīchīltic tlīlli",
            "tomāhuac tlacotōctic chīchīltic",
        ],
        ["quc", "pim qʼatom kyaq juchʼ", "pim qʼatom kyaq"],
        ["arn", "motrin katrüntuku kelü wirin", "motrin katrüntuku kelü"],
        [
            "oj",
            "gipagaa bakwezhigaa miskwaa jiigaatig",
            "gipagaa bakwezhigaa miskwaa",
        ],
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s adjectives in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The noun is appended to the adjectives rather than woven into
            // them, which is what makes this English's shape and not merely
            // English's sequence.
            expect(withNoun.startsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    it("keeps the side count in the head for all six, leaving no tail", () => {
        for (const [locale] of prenominal) {
            const t = forLocale(locale);
            const description = describeStrokedShape(t, words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            });
            // The count is present, and it is inside the noun rather than
            // trailing after the adjectives.
            expect(description).toContain("5");
            expect(description.trimEnd()).toBe(description);
            expect(description).not.toContain("  ");
        }
    });

    /**
     * The two that do invert it, and they are the ones that reach
     * `style-with-noun`'s `[noun-tail]` branch — which the previous batch
     * exercised only from Romance. Haitian Creole gets there with **no
     * agreement to protect**: it has no gender, no case and no adjective
     * inflection at all, and it splits the noun anyway, purely so the side
     * count does not sit between the noun and the words describing it. That is
     * what shows the `$part` argument to be about word order and not only about
     * agreement.
     */
    it("puts Haitian Creole's adjectives after the noun and its side count last", () => {
        const ht = forLocale("ht");
        expect(
            describeStrokedShape(ht, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("liy epè an tirè wouj");
        expect(
            describeStrokedShape(ht, words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            }),
        ).toBe("poligòn regilye epè an tirè wouj ki gen 5 kote");
    });

    it("does the same for Guarani", () => {
        const gn = forLocale("gn");
        expect(
            describeStrokedShape(gn, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("tairũ anambusu kytĩmby pytã");
        expect(
            describeStrokedShape(gn, words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            }),
        ).toBe("heta hakua joja anambusu kytĩmby pytã 5 hakuáva");
    });
});

describe("the Austronesian batch's word order", () => {
    /**
     * Fifteen languages of one region and two orders, which is the useful thing
     * to pin: the five Philippine catalogs and Tok Pisin put their adjectives
     * **in front of** the noun, and the nine others put them **behind** it. A
     * batch is not a word order, and neither is a family — `ilo` and `ban` are
     * both Austronesian and disagree.
     *
     * The linker is the other half of the prenominal rows. Each of the five
     * Philippine languages joins the adjective to what it describes with a
     * ligature this catalog writes out — «a» in Ilocano and Kapampangan, «nga»
     * in Waray and Hiligaynon, «na» in Bikol — and these strings are what pins
     * which form each one chose. See the header of each `content.ftl` for why
     * only two of the five could pick a form that is right in every position.
     */
    const prenominal: [string, string, string][] = [
        [
            "ilo",
            "napuskol a naguris-guris a nalabaga a linia",
            "napuskol a naguris-guris a nalabaga",
        ],
        [
            "war",
            "baga nga putol-putol nga pula nga linya",
            "baga nga putol-putol nga pula",
        ],
        [
            "hil",
            "madamol nga putol-putol nga pula nga linya",
            "madamol nga putol-putol nga pula",
        ],
        [
            "pam",
            "makapal a putul-putul a malutu a linya",
            "makapal a putul-putul a malutu",
        ],
        [
            "bik",
            "makapal na putol-putol na pula na linya",
            "makapal na putol-putol na pula",
        ],
        // Tok Pisin, whose adjectives precede the noun because each carries the
        // attributive suffix «-pela» and cannot be postposed while it does. See
        // `locales/tpi/content.ftl` for why the predicative form, which drops
        // the suffix, is unreachable from `$role`.
        ["tpi", "patpela brukbruk retpela lain", "patpela brukbruk retpela"],
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s adjectives in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The same relation the Americas batch above pins: the noun is
            // appended to the adjectives rather than woven into them, so the
            // two rows of each pair have to stay in step when either is edited.
            expect(withNoun.startsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    const postnominal: [string, string, string][] = [
        ["ban", "garis tebel putus-putus barak", "tebel putus-putus barak"],
        ["min", "garih taba putuih-putuih sirah", "taba putuih-putuih sirah"],
        ["ace", "garéh teubai putôh-putôh mirah", "teubai putôh-putôh mirah"],
        ["mad", "garis kandel pote'-pote' mera", "kandel pote'-pote' mera"],
        ["tet", "liña grosu traku-traku mean", "grosu traku-traku mean"],
        ["to", "laine matolu motumotu kulokula", "matolu motumotu kulokula"],
        ["fj", "laini levu musumusu damudamu", "levu musumusu damudamu"],
        ["ty", "reni mātotoru motumotu ʻuteʻute", "mātotoru motumotu ʻuteʻute"],
        ["ch", "liña damo' ma'ipe'-ipe' agaga'", "damo' ma'ipe'-ipe' agaga'"],
    ];

    for (const [locale, withNoun, adjectivesOnly] of postnominal) {
        it(`puts ${locale}'s adjectives after the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The mirror of the prenominal check: the noun is prepended whole,
            // with nothing of it reaching in among the adjectives.
            expect(withNoun.endsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    /**
     * **All fifteen reach `[noun-tail]`, including the six prenominal ones** —
     * a combination no earlier batch produced. The Americas batch's six
     * prenominal catalogs fold the side count into the head and leave the tail
     * empty, because a count is a modifier there; in every language here it is
     * a relative clause («nga addaan iti 5 a sikigan», «i gat 5 sait wankain»),
     * which has to follow the whole phrase whichever side the adjectives sit
     * on. So the `$part` split is not the postnominal languages' property: it
     * belongs to the shape of the complement, which is what these rows hold.
     */
    it.each([
        [
            "ilo",
            "napuskol a naguris-guris a nalabaga a regular a poligono nga addaan iti 5 a sikigan",
        ],
        [
            "war",
            "baga nga putol-putol nga pula nga regular nga poligono nga may 5 nga kilid",
        ],
        [
            "hil",
            "madamol nga putol-putol nga pula nga regular nga poligono nga may 5 nga kilid",
        ],
        [
            "pam",
            "makapal a putul-putul a malutu a regular a poligono a atin 5 a gilid",
        ],
        [
            "bik",
            "makapal na putol-putol na pula na regular na poligono na may 5 na gilid",
        ],
        ["tpi", "patpela brukbruk retpela poligon i gat 5 sait wankain"],
        ["ban", "poligon beraturan tebel putus-putus barak ane ngelah 5 sisi"],
        ["min", "poligon baraturan taba putuih-putuih sirah nan basisi 5"],
        ["ace", "poligon beuratura teubai putôh-putôh mirah nyang na 5 sagoë"],
        ["mad", "poligon beraturan kandel pote'-pote' mera se badâ 5 essèna"],
        ["tet", "polígonu regulár grosu traku-traku mean ho sorin 5"],
        ["to", "polikoni tatau matolu motumotu kulokula ʻoku tapa 5"],
        ["fj", "poligani veitautauvata levu musumusu damudamu e 5 na yasana"],
        ["ty", "poligone ʻaifaito mātotoru motumotu ʻuteʻute e 5 hiti tōna"],
        [
            "ch",
            "poligono regulåt damo' ma'ipe'-ipe' agaga' ni guaha 5 na kanton",
        ],
    ])(
        "closes %s's phrase with the side count behind it",
        (locale, expected) => {
            const description = describeStrokedShape(forLocale(locale), words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            });
            expect(description).toBe(expected);
        },
    );
});

describe("Klingon, which builds its phrase out of a relative clause", () => {
    const tlh: Translator = forLocale("tlh");

    /**
     * Klingon has no adjectives, and TKD describes putting one verb of quality
     * directly after the noun it modifies with no way to chain them — so a
     * description of three cannot be an adjective string at all. `locales/tlh`
     * writes a relative clause instead: «-bogh» on each verb, «'ej» between
     * them, and the whole clause standing in front of the noun. Joining
     * «-bogh» clauses that way is the catalog's extension of «'ej» rather than
     * an attested pattern, which its header says.
     *
     * That puts it on the *prenominal* side with the Philippine catalogs and
     * Tok Pisin, and for a reason none of them shares. What this pins is the
     * shape rather than the side: every word carries its own «-bogh», which is
     * what would break if someone "simplified" the catalog into a bare
     * adjective string.
     */
    it("welds -bogh onto each quality verb and puts the clause first", () => {
        expect(
            describeStrokedShape(tlh, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("jeDbogh 'ej pe'lu'bogh 'ej Doqbogh tlhegh");
        expect(
            describeStrokedShape(tlh, words, {
                noun: { key: "line" },
                withNoun: false,
            }),
        ).toBe("jeDbogh 'ej pe'lu'bogh 'ej Doqbogh");
    });

    /**
     * The suffix is welded onto a value the catalog never sees, which the
     * README's affix rule forbids in Arabic, Uyghur, Finnish and Hungarian.
     * It is sound here because Klingon suffixes have one shape each — no vowel
     * harmony, no assimilation — so this is the «{ $numSides }-kulmio» case
     * rather than the «в»/«ве» one. A single-word description takes the same
     * suffix as a three-word one, which is what says the weld is on the word
     * and not on the join.
     */
    it("welds the same suffix on a description of one word", () => {
        expect(
            describeStrokedShape(
                tlh,
                { lineWidthWord: "", lineStyleWord: "", colorWord: "red" },
                { noun: { key: "line" }, withNoun: true },
            ),
        ).toBe("Doqbogh tlhegh");
    });

    /**
     * **Four colour words for twelve keys.** Klingon's basic terms are «qIj»,
     * «chIS», «Doq» (red and orange, and brown too by Okrand's own note) and
     * «SuD» (green, blue and yellow together), and the catalog leaves the
     * collapse standing rather than coining words to repair it — the reason
     * `locales/oj` gives for leaving the periodic table alone, at the scale of
     * a whole table. Only `purple` and `pink` have nothing canon behind their
     * placement; `gray` has a canon phrase, «qIj 'ej wov», that this table
     * cannot hold because «-bogh» welds onto a single verb.
     *
     * It is pinned rather than described because it costs something real: a
     * blue curve and a green one report the same word, and these descriptions
     * exist so a reader who cannot see the graph can tell objects apart. The
     * day someone supplies coined terms, this is the test that says which
     * distinctions they just bought.
     */
    it.each([
        ["red", "Doq"],
        ["orange", "Doq"],
        ["brown", "Doq"],
        ["purple", "Doq"],
        ["pink", "Doq"],
        ["yellow", "SuD"],
        ["green", "SuD"],
        ["cyan", "SuD"],
        ["blue", "SuD"],
        ["black", "qIj"],
        ["white", "chIS"],
        ["gray", "Hurgh"],
    ])("answers %s with %s", (english, klingon) => {
        expect(describeColor(tlh, english, "text")).toBe(klingon);
    });

    /**
     * The catalog is partial in its `noun` table rather than only in its
     * chemistry, which no earlier catalog is — but the gap is narrower than the
     * shape of the language suggests. Okrand has published a geometry
     * vocabulary, so fourteen of the eighteen nouns are canon Klingon; four
     * are not, because *parabola*, *polyline*, *curve* and *diamond* have no
     * canon word and each would be a new root.
     *
     * Those four fall back to English and the description comes out in two
     * languages, which is the documented state and not a bug to tidy: an
     * invented root would read as a word no Klingon speaker has met, where the
     * English at least reads as English. `noun-regular-polygon` is left with
     * them, because nothing canon says *regular*, so a regular polygon reads in
     * English entire rather than in half of each.
     */
    it("falls back to English for the nouns Klingon has no word for", () => {
        expect(
            describeStrokedShape(tlh, words, {
                noun: { key: "parabola" },
                withNoun: true,
            }),
        ).toBe("jeDbogh 'ej pe'lu'bogh 'ej Doqbogh parabola");
        expect(
            describeStrokedShape(tlh, words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            }),
        ).toBe("jeDbogh 'ej pe'lu'bogh 'ej Doqbogh 5-sided regular polygon");
    });

    /**
     * The other side of the same line, and the one worth pinning because an
     * earlier draft of this catalog got it wrong and left these in English on
     * the grounds that Klingon had no mathematics at all. It does: «gho» is in
     * TKD, and «mey'» and «ra'Duch» come from the word lists Okrand has
     * released since. Anything this test stops matching is a canon word that
     * has been dropped back to English.
     */
    it.each([
        ["circle", "gho"],
        ["polygon", "mey'"],
        ["triangle", "ra'Duch"],
        ["rectangle", "letbaQ"],
        ["square", "meyrI'"],
        ["vector", "baSta'"],
        ["function", "chav"],
    ])("names a %s with the canon word %s", (key, klingon) => {
        expect(
            describeStrokedShape(tlh, words, {
                noun: { key },
                withNoun: true,
            }),
        ).toBe(`jeDbogh 'ej pe'lu'bogh 'ej Doqbogh ${klingon}`);
    });

    /**
     * The invariant `attachNoun` now documents, seen from the catalog's side. A
     * marker and a region look up one colour and nothing else, and before this
     * they handed that raw word to `style-with-noun` while a stroke handed over
     * a finished `style-stroke` phrase. Every other catalog spells both the
     * same way, so nothing said the two differed; Klingon does not, because its
     * clause carries «-bogh» and a bare verb does not. Routing both through
     * `style-stroke`'s `[color]` branch is what makes these two strings match
     * the stroke's shape, and this is what would notice if either stopped.
     */
    it("gives a marker and a region the same clause a stroke gets", () => {
        expect(
            describeMarker(
                tlh,
                { markerColorWord: "blue", markerStyleWord: "point" },
                { withNoun: true },
            ),
        ).toBe("SuDbogh vI'");
        expect(
            describeRegion(
                tlh,
                { fillColorWord: "blue" },
                { noun: { key: "region" }, withNoun: true },
            ),
        ).toBe("SuDbogh yer");
    });

    /**
     * The border clause is built with «je» — the noun conjunction, which
     * follows what it joins. Klingon has no article and «je» opens no clause,
     * so `style-border-clause`'s four branches all say the same thing; this is
     * the string that would change if someone gave three of them a distinction
     * the language does not draw.
     */
    it("closes a filled shape with the noun conjunction je", () => {
        expect(
            describeClosedShape(
                tlh,
                { ...words, fillColorWord: "blue", fillStyleWord: "" },
                { filled: true, noun: { key: "line" }, withNoun: true },
            ),
        ).toBe(
            "buy'bogh 'ej SuDbogh tlhegh jeDbogh 'ej pe'lu'bogh 'ej Doqbogh HeH je",
        );
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
    /**
     * A catalog as the worker receives it. Six of the nine below select on
     * `$role` somewhere; Gujarati, Swahili and Zulu select on `$gender` alone,
     * and are here to hold the cases where the two positions legitimately read
     * alike.
     */
    const de = forLocale("de");
    const ru = forLocale("ru");
    const pl = forLocale("pl");
    const hi = forLocale("hi");
    const mr = forLocale("mr");
    const gu = forLocale("gu");
    const pa = forLocale("pa");
    const sw = forLocale("sw");
    const zu = forLocale("zu");
    const et = forLocale("et");
    const bg = forLocale("bg");
    const ka = forLocale("ka");
    const is = forLocale("is");
    const ceb = forLocale("ceb");
    const km = forLocale("km");
    const si = forLocale("si");
    const lg = forLocale("lg");
    const ti = forLocale("ti");
    const bs = forLocale("bs");
    const oc = forLocale("oc");
    const se = forLocale("se");

    /**
     * The whole Indigenous Americas batch, and every one of the eight is on the
     * identity side: not one selects on `$role`. The reason is the same in all
     * eight and it is not that they lack morphology — Quechua and Aymara have a
     * dozen case suffixes each and Kʼicheʼ has an ergative prefix. It is that
     * every one of them marks a clause position on something *other* than the
     * describing word: on a postposition that is a separate word («mew»,
     * «ndive», «īca», «rukʼ»), or on the head noun the phrase attaches to
     * («manyayuq», «jarphini»), or on the verb. So a `$role` fork would write
     * one string twice, and the assertions below are what would catch someone
     * adding one.
     */
    const americas = {
        ht: forLocale("ht"),
        qu: forLocale("qu"),
        gn: forLocale("gn"),
        ay: forLocale("ay"),
        nah: forLocale("nah"),
        quc: forLocale("quc"),
        arn: forLocale("arn"),
        oj: forLocale("oj"),
    } as const;

    /**
     * The Austronesian batch, all fifteen on the identity side. Not one of them
     * inflects an adjective for the position its phrase goes into: nine have no
     * adjective morphology at all, the five Philippine languages carry a linker
     * rather than a case, and Tok Pisin's «-pela» is attributive-against-
     * predicative rather than positional — and the one place that distinction
     * would show is unreachable, because `standalone` covers both the citation
     * form and the attributive use. So a `$role` fork in any of the fifteen
     * would write one string twice, and this is what would catch it.
     */
    const austronesian = {
        ilo: forLocale("ilo"),
        war: forLocale("war"),
        hil: forLocale("hil"),
        pam: forLocale("pam"),
        bik: forLocale("bik"),
        ban: forLocale("ban"),
        min: forLocale("min"),
        ace: forLocale("ace"),
        mad: forLocale("mad"),
        tet: forLocale("tet"),
        to: forLocale("to"),
        fj: forLocale("fj"),
        ty: forLocale("ty"),
        ch: forLocale("ch"),
        tpi: forLocale("tpi"),
    } as const;

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

    // Gujarati has an oblique, but none of its clause positions reaches one:
    // «કિનારી» is feminine and a feminine -ી spells the two alike. So it
    // selects on `$gender` alone and both of its border forms read the same.
    // What the gender buys is agreement with the right noun — feminine
    // «કિનારી» for the border against neuter «વર્તુળ» for the shape it
    // surrounds, in one sentence.
    it("gives Gujarati a border that agrees with the border, not the shape", () => {
        expect(bothBorderForms(gu)).toEqual({
            standalone: "જાડી કાળી",
            embedded: "ભરેલું વાદળી વર્તુળ જાડી કાળી કિનારી સાથે",
        });
    });

    // Punjabi is Hindi's mirror image across the two guards below. Its border
    // is feminine «ਕਿਨਾਰੀ», and a feminine -ੀ is spelled alike direct and
    // oblique, so the border does not move; its background is masculine
    // «ਪਿਛੋਕੜ», so the colour in front of ਉੱਤੇ does. That is why
    // `background-clause` is the one `$role` branch its catalog writes out.
    it("gives Punjabi an unchanged border and an oblique background", () => {
        expect(bothBorderForms(pa)).toEqual({
            standalone: "ਮੋਟੀ ਕਾਲੀ",
            embedded: "ਭਰਿਆ ਨੀਲਾ ਚੱਕਰ ਮੋਟੀ ਕਾਲੀ ਕਿਨਾਰੀ ਨਾਲ",
        });
        expect(bothTextForms(pa)).toEqual({
            textColor: "ਲਾਲ",
            backgroundColor: "ਪੀਲਾ",
            sentence: "ਪੀਲੇ ਪਿਛੋਕੜ ਉੱਤੇ ਲਾਲ",
        });
    });

    // Swahili and Zulu belong here for the same reason Gujarati does: neither
    // selects on `$role`, so the two positions read alike and these assertions
    // are what holds them there. What each *does* select on is `$gender`
    // carrying a noun class — pinned across four classes by "Swahili noun
    // classes" above, which is where that mechanism is actually guarded.
    //
    // The class-5 «duara» shows here only on «lililojazwa»; the two adjective
    // stems in this sentence both describe the class-3 «mpaka», which is why
    // the standalone form is a substring of the embedded one.
    it("agrees a Swahili adjective with the noun class, not a gender", () => {
        expect(bothBorderForms(sw)).toEqual({
            standalone: "mnene mweusi",
            embedded: "duara lililojazwa buluu na mpaka mnene mweusi",
        });
    });

    // Zulu is the same story with two classes in one sentence, and both come
    // from `noun-gender`: it answers `c3` for `text` and falls to its `*[c9]`
    // default for `background`, which it does not list. So the two colours
    // take o- and e- off the relative-concord table — the one a colour word
    // uses — and which of Zulu's two tables a word reads from is a fact about
    // the word, so the catalog writes both out per word rather than deriving
    // either. «engemuva» between them is `style-text`'s own word for the
    // position, not a noun either colour agrees with.
    it("agrees a Zulu colour with the class of the noun it describes", () => {
        expect(bothTextForms(zu)).toEqual({
            textColor: "obomvu",
            backgroundColor: "ephuzi",
            sentence: "obomvu engemuva ephuzi",
        });
    });

    // Estonian is the clean case for `$role` on its own: it has fourteen cases
    // and no gender at all, so every one of its describing words forks on the
    // position and none of them consults `$gender`. It marks the two clauses
    // with an ending on the noun rather than with a preposition, which is why
    // nothing stands between the colour and «äärisega» or «taustal».
    it("gives Estonian a case in each position and no gender anywhere", () => {
        expect(bothBorderForms(et)).toEqual({
            standalone: "paks must",
            embedded: "täidetud sinine ringjoon paksu musta äärisega",
        });
        expect(bothTextForms(et)).toEqual({
            textColor: "punane",
            backgroundColor: "kollane",
            sentence: "punane kollasel taustal",
        });
    });

    // Bulgarian is the exact mirror, and the pair is why the two arguments are
    // two arguments: it has three genders and no cases at all, so it forks on
    // `$gender` and never on `$role`, and both of its positions read alike.
    // What the gender buys it is the same thing it buys Gujarati — agreement
    // with the right noun, feminine «граница» for the border against the
    // feminine «окръжност» it surrounds, and masculine «фон» in the sentence.
    it("gives Bulgarian a gender in each position and no case anywhere", () => {
        expect(bothBorderForms(bg)).toEqual({
            standalone: "дебела черна",
            embedded: "запълнена синя окръжност с дебела черна граница",
        });
        expect(bothTextForms(bg)).toEqual({
            textColor: "червен",
            backgroundColor: "жълт",
            sentence: "червен на жълт фон",
        });
    });

    // Georgian is the narrowest fork any catalog here writes: it inflects an
    // attributive adjective for case, but only the dative truncates the -ი, and
    // only one of the four positions is a dative — the background, in front of
    // the postposition -ზე. So `background-clause` is the single branch its
    // catalog spells out and the border reads alike in both of its positions,
    // which is the shape `locales/pa` arrived at from an entirely different
    // grammar. The instrumental «ჩარჩოთი» leaves its adjectives nominative.
    it("gives Georgian a truncated background and an unmoved border", () => {
        expect(bothBorderForms(ka)).toEqual({
            standalone: "სქელი შავი",
            embedded: "ლურჯი შევსებული წრეწირი სქელი შავი ჩარჩოთი",
        });
        expect(bothTextForms(ka)).toEqual({
            textColor: "წითელი",
            backgroundColor: "ყვითელი",
            sentence: "ყვითელ ფონზე წითელი",
        });
    });

    // Icelandic marks both clause positions with the same `-um`, because «með»
    // and «á» happen to govern the same case over two masculine nouns. That is
    // one dative reached twice, not a collapsed fork: the nominative standing
    // alone is a different word in both pairs.
    it("gives Icelandic a dative in both clauses and a nominative alone", () => {
        expect(bothBorderForms(is)).toEqual({
            standalone: "þykkur svartur",
            embedded: "fylltur blár hringur með þykkum svörtum jaðri",
        });
        expect(bothTextForms(is)).toEqual({
            textColor: "rauður",
            backgroundColor: "gulur",
            sentence: "rauður á gulum bakgrunni",
        });
    });

    // Cebuano inflects nothing at all, and still does not read like English:
    // its noun leads, and the linker «nga» stands between it and each of its
    // adjectives. Both positions read alike, which is the point — the words
    // that move here are the catalog's own linkers, not a case ending.
    it("gives Cebuano a linker in every position and no case anywhere", () => {
        expect(bothBorderForms(ceb)).toEqual({
            standalone: "baga nga itom",
            embedded:
                "sirkulo nga puno nga asul uban ang utlanan nga baga nga itom",
        });
        expect(bothTextForms(ceb)).toEqual({
            textColor: "pula",
            backgroundColor: "dalag",
            sentence: "pula uban ang luyo nga dalag",
        });
    });

    // Khmer is the opposite extreme: no gender, no case, no article and no
    // space inside a phrase either, so the adjectives sit flush against the
    // noun in front of them. The space before «ជាមួយ» is a real phrase break
    // rather than a word boundary, and it is the only one in the sentence.
    it("gives Khmer a phrase that closes up around its placeables", () => {
        expect(bothBorderForms(km)).toEqual({
            standalone: "ក្រាស់ពណ៌ខ្មៅ",
            embedded: "រង្វង់លាបពណ៌ខៀវ ជាមួយគែមក្រាស់ពណ៌ខ្មៅ",
        });
        expect(bothTextForms(km)).toEqual({
            textColor: "ពណ៌ក្រហម",
            backgroundColor: "ពណ៌លឿង",
            sentence: "ពណ៌ក្រហមលើផ្ទៃខាងក្រោយពណ៌លឿង",
        });
    });

    // Sinhala is the third shape this batch brings, and the one whose reason
    // for reading alike in both positions is not English's. It *does* mark
    // case — but with a postposition after the noun, «සමඟ» for the border and
    // «මත» for the background, and neither ever touches the adjective in front
    // of it. So the adjectives this catalog hands to a clause are the same
    // words in both positions, while the words that move are the postpositions
    // the clause itself writes, after what they govern rather than before it.
    it("gives Sinhala a postposition after the phrase and no case on the adjectives", () => {
        expect(bothBorderForms(si)).toEqual({
            standalone: "ඝන කළු",
            embedded: "පිරවූ නිල් වෘත්තය ඝන කළු මායිමක් සමඟ",
        });
        expect(bothTextForms(si)).toEqual({
            textColor: "රතු",
            backgroundColor: "කහ",
            sentence: "කහ පසුබිමක් මත රතු",
        });
    });

    // Luganda carries the widest concord table in the repository — six noun
    // classes — and this case is here because the border and the shape it
    // surrounds are in different ones: «olukugiro» is class 11 and takes
    // «olu-», «enkulungo» is class 9 and takes «en-». The two adjectives are
    // built from the same stems and come out spelled differently, which is
    // exactly what would break if `noun-gender` were ever flattened.
    it("agrees Luganda's border with its own class, not the shape's", () => {
        expect(bothBorderForms(lg)).toEqual({
            standalone: "olunene oluddugavu",
            embedded:
                "enkulungo enjjuvu bbululu n'olukugiro olunene oluddugavu",
        });
        expect(bothTextForms(lg)).toEqual({
            textColor: "erimyufu",
            backgroundColor: "kyenvu",
            sentence: "erimyufu ku mabega kyenvu",
        });
    });

    // Tigrinya is the only language in the sub-Saharan batch that uses
    // `$gender` for a gender, and the only one there whose adjectives *precede*
    // the noun. Both positions read alike, because Tigrinya marks a clause
    // position on the noun rather than on the adjective in front of it — so
    // what this pins is the agreement and the order, not a case.
    it("puts Tigrinya's adjectives in front and agrees them for gender", () => {
        expect(bothBorderForms(ti)).toEqual({
            standalone: "ረጒድ ጸሊም",
            embedded: "ምልእቲ ሰማያዊ ክቢ ምስ ረጒድ ጸሊም ዶብ",
        });
        expect(bothTextForms(ti)).toEqual({
            textColor: "ቀይሕ",
            backgroundColor: "ብጫ",
            sentence: "ቀይሕ ምስ ብጫ ድሕረ-ባይታ",
        });
    });

    // Bosnian forks on `$role` the way Croatian does, and the fork lands on a
    // different word: `locales/hr` calls a border «rub», which is masculine and
    // takes the instrumental `-im`, while `locales/bs` calls it «ivica», which
    // is feminine and takes `-om`. So this pins the case *and* the choice of
    // noun — a catalog copied over from Croatian would fail here rather than
    // read plausibly.
    it("agrees Bosnian's border with its own feminine noun", () => {
        expect(bothBorderForms(bs)).toEqual({
            standalone: "debela crna",
            embedded: "ispunjena plava kružnica sa debelom crnom ivicom",
        });
        expect(bothTextForms(bs)).toEqual({
            textColor: "crven",
            backgroundColor: "žuta",
            sentence: "crven na žutoj pozadini",
        });
    });

    // Occitan is the batch's postnominal case: the adjectives follow the noun,
    // so `style-with-noun` inverts the English order and the border clause
    // reads «amb una bordadura espessa negra». Nothing forks on `$role`,
    // because a preposition carries the position and the adjective never moves.
    it("puts Occitan's adjectives after the noun in both positions", () => {
        expect(bothBorderForms(oc)).toEqual({
            standalone: "espessa negra",
            embedded: "cercle emplenat blau amb una bordadura espessa negra",
        });
        expect(bothTextForms(oc)).toEqual({
            textColor: "roge",
            backgroundColor: "jaune",
            sentence: "roge sus un fons jaune",
        });
    });

    // Northern Sami is here for the opposite reason to every case above it:
    // the two positions are *deliberately* the same string. A Sami adjective
    // in front of a noun takes an attributive form that agrees with nothing —
    // not with case, not with number, and there is no gender — so «asse
    // čáhppes» is the phrase wherever it lands, and the comitative «ravddain»
    // is what carries "with". This is the assertion that would catch someone
    // "fixing" the catalog by adding a `$role` fork it has no use for.
    it("leaves Northern Sami's attributive form alone in every position", () => {
        expect(bothBorderForms(se)).toEqual({
            standalone: "asse čáhppes",
            embedded: "devdojuvvon alit sirkkel asse čáhppes ravddain",
        });
        expect(bothTextForms(se)).toEqual({
            textColor: "rukses",
            backgroundColor: "fiskes",
            sentence: "rukses fiskes duogážiin",
        });
    });

    // Every one of the eight Americas catalogs, asserted as an identity: the
    // adjective phrase the border reports on its own is exactly the one the
    // clause embeds. Adding a `$role` fork to any of them would write one string
    // twice, and this is what would say so.
    //
    // Ojibwe is in here for a reason worth keeping straight: it *does* select on
    // `$gender`, and the two adjectives in its embedded sentence are inanimate
    // because they describe «jiigaatigwaan» rather than the animate circle. So
    // the substring holds even though two animacies are in play — which is the
    // same shape Swahili's «mpaka» case has, and why neither language needs
    // `$role`.
    /**
     * Klingon on the identity side too, and for a reason none of the others
     * has. It is not that nothing inflects — «-bogh» is welded onto every
     * quality verb — but that the welding happens in the *composing* message
     * rather than in the word, so the tables hold bare verbs and a position
     * never reaches inside one. A `$role` fork here would have nothing to
     * change.
     */
    const constructed = { tlh: forLocale("tlh") } as const;

    it.each(Object.entries({ ...americas, ...austronesian, ...constructed }))(
        "leaves %s's adjectives unchanged between the two positions",
        (_locale, t) => {
            const border = bothBorderForms(t);
            expect(border.embedded).toContain(border.standalone);

            const text = bothTextForms(t);
            expect(text.sentence).toContain(text.textColor);
            expect(text.sentence).toContain(text.backgroundColor);
        },
    );

    // The guard that keeps this from rotting: if a catalog ever collapses the
    // two positions again, these differ where they should not.
    it("keeps the two positions distinct wherever a language inflects", () => {
        // Gujarati and Punjabi are absent: in both the border's noun is
        // feminine and a feminine -ੀ/-ી does not go oblique, so the two
        // positions read alike. Asserted as exact strings in the two cases
        // above, which is what holds them there. Swahili and Zulu are absent
        // for a different reason: they agree for noun class rather than for
        // case, so no position moves anything. Bulgarian is absent for that
        // same reason with a gender instead of a class, and Estonian is here
        // because case is the only thing it has.
        for (const t of [de, ru, pl, hi, mr, et, bs]) {
            const border = bothBorderForms(t);
            expect(border.embedded).not.toContain(border.standalone);
        }
        // Hindi and Gujarati are absent here on purpose: both have a feminine
        // background whose colour is spelled alike in the two positions, per
        // the cases above. Marathi spells its feminine oblique differently and
        // so belongs here, and so does Punjabi, whose background is masculine.
        // Estonian belongs here too: its background goes adessive, and Georgian
        // because its background is the one position that truncates.
        for (const t of [de, ru, pl, mr, pa, et, ka, bs]) {
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
     * The same head noun, wanted for the other reason a language can want one.
     *
     * `describeFill` hands the colour `fill`'s gender, and the pattern word is
     * a noun with a gender of its own — masculine હીરા and ਹੀਰੇ against a
     * feminine `fill` in both catalogs — so a colour set straight in front of
     * it would agree with neither the word beside it nor anything else in the
     * sentence. Naming «ભરણી» / «ਭਰਾਈ» gives it a noun of the gender it was
     * handed. `style-unfilled` is the other answer the same state variable
     * gives and receives no `$gender` at all, so it names the noun too.
     */
    it("gives a fill colour a noun of its own gender to agree with", () => {
        const blueDiamonds = {
            fillColorWord: "blue",
            fillStyleWord: "diamonds",
        };
        expect(describeFill(gu, blueDiamonds, { filled: true })).toBe(
            "હીરા વાળી વાદળી ભરણી",
        );
        expect(describeFill(pa, blueDiamonds, { filled: true })).toBe(
            "ਹੀਰੇ ਵਾਲੀ ਨੀਲੀ ਭਰਾਈ",
        );
        expect(describeFill(gu, {}, { filled: false })).toBe("ભરણી વગર");
        expect(describeFill(pa, {}, { filled: false })).toBe("ਬਿਨਾਂ ਭਰਾਈ");
    });

    /**
     * The same again, in the one language where which pattern is asked for
     * decides whether the gap shows. Marathi's «ठिपके» and «समभुज चौकोन» are
     * masculine plural, and neuter «निळे» is spelled alike there — so the four
     * patterns built on the feminine «रेषा» are the only ones that expose a
     * colour agreeing with «भरण» instead of with the word beside it. A test
     * that reached for diamonds, as the two above do, would pass either way.
     */
    it("names the fill noun for a pattern whose gender is not the fill's", () => {
        const blue = (fillStyleWord: string) =>
            describeFill(
                mr,
                { fillColorWord: "blue", fillStyleWord },
                {
                    filled: true,
                },
            );

        expect(blue("horizontal lines")).toBe("आडव्या रेषा वापरून निळे भरण");
        expect(blue("diamonds")).toBe("समभुज चौकोन वापरून निळे भरण");
        expect(blue("")).toBe("निळे भरण");
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

/**
 * `noun-regular-polygon` is the one noun that is not a word but a phrase, and
 * the two ways of building it each have a failure mode a plausible-looking
 * catalog can walk into.
 *
 * A language that folds the side count into a compound has to answer
 * `noun-gender` for the *compound's* head rather than for its word for
 * "polygon" — Luxembourgish and Low German both build on `-Eck`, which is
 * neuter, while their word «Polygon» would fall to the default. A language
 * that cannot fold it has to split the phrase, so that the complement closes
 * it behind the adjectives rather than stranding them behind the sides.
 */
describe("a regular polygon's side count", () => {
    const polygon: NounSpec = { key: "regular-polygon", numSides: 5 };
    const words = { colorWord: "red", lineWidthWord: "thick" };

    const described = (locale: string, noun: NounSpec) =>
        describeStrokedShape(forLocale(locale), words, {
            noun,
            withNoun: true,
        });

    it("takes the compound head's gender, not the word for polygon", () => {
        // Both would read as plausible prose with the wrong gender — the
        // masculine endings are the ones every other noun in the table takes —
        // which is why this is asserted beside a masculine noun of each
        // language rather than alone.
        expect(described("lb", polygon)).toBe("déckt rout regelméissegt 5-Eck");
        expect(described("lb", { key: "circle" })).toBe("décke route Krees");
        expect(described("nds", polygon)).toBe("dick root regelmatig 5-Eck");
        expect(described("nds", { key: "circle" })).toBe("dicke rode Krink");
    });

    it("closes the phrase behind the adjectives in the postnominal catalogs", () => {
        // The six that split it, which is what `style-with-noun`'s `noun-tail`
        // branch exists for: the adjectives stay against the head and the
        // sides follow them.
        expect(described("oc", polygon)).toBe(
            "poligòn regular espès roge de 5 costats",
        );
        expect(described("ast", polygon)).toBe(
            "polígonu regular gruesu coloráu de 5 llaos",
        );
        expect(described("sc", polygon)).toBe(
            "polìgonu regulare grussu ruju de 5 lados",
        );
        expect(described("scn", polygon)).toBe(
            "pulìgunu rigulari grossu russu di 5 lati",
        );
        expect(described("co", polygon)).toBe(
            "puligonu regulare grossu rossu di 5 lati",
        );
        expect(described("rm", polygon)).toBe(
            "poligon regular grass cotschen da 5 lats",
        );
    });

    // The tail lands directly in front of the fill pattern's own preposition,
    // so a language whose two prepositions are the same word says it twice and
    // the sides read as part of the pattern clause. Occitan is the one whose
    // «amb» would have collided; the catalog says «de N costats» for that
    // reason, and this is what holds it there.
    it("keeps the side count from colliding with the fill clause", () => {
        const filled = describeClosedShape(
            forLocale("oc"),
            { fillColorWord: "blue", fillStyleWord: "dots" },
            { filled: true, noun: polygon, withNoun: true },
        );
        expect(filled).toBe(
            "poligòn regular emplenat blau de 5 costats amb punts",
        );
    });
});

/**
 * The South Asian batch, which pins the three shapes it added to the suite:
 * a case-inflecting classical language, a postnominal Tibeto-Burman one, and
 * a Devanagari catalog that agrees with nothing while three of its neighbours
 * in the same script agree with everything.
 */
describe("the South Asian batch", () => {
    /**
     * Sanskrit inflects an adjective for gender, number *and* case, and each
     * clause position governs a different case. What holds the fork together
     * is that the three clause positions each land on a noun the catalog
     * writes — «सीमा» feminine, «पृष्ठभूमिः» feminine, «पाठ्यम्» neuter — so
     * the position fixes the form and `$gender` is not consulted inside it.
     */
    it("gives Sanskrit a different case in each clause position", () => {
        const sa = forLocale("sa");
        // Nominative, agreeing with the noun described: masculine for
        // «रेखाखण्डः», feminine for «रेखा».
        expect(
            describeStrokedShape(sa, words, {
                noun: { key: "line-segment" },
                withNoun: true,
            }),
        ).toBe("स्थूलः खण्डितः रक्तः रेखाखण्डः");
        expect(
            describeStrokedShape(sa, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("स्थूला खण्डिता रक्ता रेखा");
        // Instrumental before «सीमया सह», and locative before «पृष्ठभूमौ».
        expect(describeBorder(sa, { colorWord: "red" })).toBe("रक्ता");
        expect(
            describeClosedShape(
                sa,
                { fillColorWord: "blue", colorWord: "red" },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            ),
        ).toContain("रक्तया सीमया सह");
        // The two words `describeText` composes arrive already inflected for
        // the position each is going into, which is what `$role` is for.
        expect(describeColor(sa, "red", "text", "text-clause")).toBe("रक्तम्");
        expect(
            describeColor(sa, "blue", "background", "background-clause"),
        ).toBe("नीलायां");
        expect(
            describeText(sa, {
                color: describeColor(sa, "red", "text", "text-clause"),
                background: describeColor(
                    sa,
                    "blue",
                    "background",
                    "background-clause",
                ),
            }),
        ).toBe("नीलायां पृष्ठभूमौ रक्तम्");
    });

    /**
     * Konkani is the batch's other catalog that selects on both arguments, and
     * it selects the way Marathi does: three genders in the direct case, and
     * an oblique -या before a postposition. Sanskrit's fork is a different
     * case in each position; Konkani's is one oblique shared by the two
     * positions a postposition governs.
     */
    it("gives Konkani three genders and an oblique before a postposition", () => {
        const kok = forLocale("kok");
        expect(
            describeStrokedShape(kok, words, {
                noun: { key: "line-segment" },
                withNoun: true,
            }),
        ).toBe("जाड तुटक तांबडो रेघखंड");
        expect(
            describeStrokedShape(kok, words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("जाड तुटक तांबडी रेघ");
        expect(
            describeStrokedShape(kok, words, {
                noun: { key: "circle" },
                withNoun: true,
            }),
        ).toBe("जाड तुटक तांबडें वर्तुळ");
        // The oblique, before «कडेसयत» and «फांटभुंयेर»; and the direct
        // masculine agreeing with «मजकूर» in the text clause.
        expect(
            describeClosedShape(
                kok,
                { fillColorWord: "blue", colorWord: "red" },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            ),
        ).toContain("तांबड्या कडेसयत");
        expect(
            describeText(kok, {
                color: describeColor(kok, "red", "text", "text-clause"),
                background: describeColor(
                    kok,
                    "blue",
                    "background",
                    "background-clause",
                ),
            }),
        ).toBe("निळ्या फांटभुंयेर तांबडो");
    });

    /**
     * Meitei and the two Tibetan-script catalogs put their adjectives *after*
     * the noun, which no Indo-Aryan catalog in the batch does. All three reach
     * `[noun-tail]` for the regular polygon, because a side count is a
     * complement there and a complement follows the whole phrase.
     */
    it.each([
        ["mni", "পরেং অচৌবা তক্থোকপা অঙাংবা"],
        ["bo", "ཐིག མཐུག་པོ ཆད་ལྷུག དམར་པོ"],
        ["dz", "གྲལ་ཐིག སྦོམ ཆད་ལྷུག དམརཔོ"],
    ])("puts %s's adjectives after the noun", (locale, expected) => {
        expect(
            describeStrokedShape(forLocale(locale), words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe(expected);
    });

    /**
     * Asserted whole rather than by substring: the count has to land in the
     * *tail*, after the adjective, and only the entire string says that. An
     * assertion that merely looked for the count would pass just as happily
     * against a catalog that folded the count into `[head]` and left `[tail]`
     * empty, which is the one thing these three are here to rule out.
     */
    it.each([
        ["mni", "অচুম্বা বহুভুজ অঙাংবা মায়কৈ 5 লৈবা"],
        ["bo", "ཆ་སྙོམས་ཟུར་མང དམར་པོ ཟུར་ 5 ཅན"],
        ["dz", "ཚད་མཉམ་ཟུར་མང དམརཔོ ཟུར་ 5 ཡོདཔ"],
    ])("reaches [noun-tail] for %s's regular polygon", (locale, expected) => {
        expect(
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe(expected);
    });

    /**
     * Five Devanagari catalogs, three answers. Sanskrit and Konkani inflect
     * for both arguments, Dogri for gender alone, and Maithili and Bhojpuri
     * for neither — so the script says nothing about the fork, which is the
     * point of asserting them side by side.
     */
    it.each([
        ["mai", "भरल नील वृत्त लाल किनार सहित", "नील पृष्ठभूमि पर लाल"],
        ["bho", "भरल नील वृत्त लाल किनारी सहित", "नील पृष्ठभूमि पर लाल"],
    ])(
        "leaves %s's adjectives unchanged in every position",
        (locale, closed, text) => {
            const t = forLocale(locale);
            // «लाल» and «नील» standing alone, and the same two words in the
            // border and background positions a postposition governs. Written
            // out whole rather than asserted as a substring of the phrase,
            // since an oblique would contain the direct form as a prefix and a
            // substring check would not notice one appearing.
            expect(describeBorder(t, { colorWord: "red" })).toBe("लाल");
            expect(
                describeClosedShape(
                    t,
                    { fillColorWord: "blue", colorWord: "red" },
                    { filled: true, noun: { key: "circle" }, withNoun: true },
                ),
            ).toBe(closed);
            expect(
                describeText(t, {
                    color: describeColor(t, "red", "text", "text-clause"),
                    background: describeColor(
                        t,
                        "blue",
                        "background",
                        "background-clause",
                    ),
                }),
            ).toBe(text);
        },
    );

    /**
     * Dogri's masculine -आ adjectives do have an oblique, and none of the three
     * clause positions reaches it: the border and background are feminine and
     * the text colour is a direct masculine. So the `$gender` fork alone gets
     * every position right, and a `$role` branch would render what is already
     * rendered. This is what would notice if a future `noun` entry put a
     * masculine oblique in one of those positions.
     */
    it("agrees Dogri for gender and needs no position fork", () => {
        const doi = forLocale("doi");
        expect(
            describeStrokedShape(
                doi,
                { colorWord: "black" },
                {
                    noun: { key: "line" },
                    withNoun: true,
                },
            ),
        ).toBe("काली रेखा");
        expect(
            describeStrokedShape(
                doi,
                { colorWord: "black" },
                {
                    noun: { key: "point" },
                    withNoun: true,
                },
            ),
        ).toBe("काला बिंदू");
        expect(describeBorder(doi, { colorWord: "black" })).toBe("काली");
    });
});

/**
 * The African and Berber batch, which pins the three things it added to the
 * suite: a class concord that is a **suffix** rather than a prefix, a class
 * fork narrow enough that most of the words stay put, and a preposition made
 * uniform so that an affix could be written beside a placeable at all.
 */
describe("the African and Berber batch", () => {
    const described = (locale: string, key: NounKey) =>
        describeStrokedShape(forLocale(locale), words, {
            noun: { key },
            withNoun: true,
        });

    /**
     * `$gender` is a token set and nothing outside a catalog reads its values,
     * which is what lets Fula use the same argument the Bantu catalogs
     * use and have it land on the *other end* of the word. The stems are
     * constant here — mawn- "thick", bodee- "red" — and only the class suffix
     * moves.
     */
    it("moves a Fula concord to the end of the word", () => {
        expect(described("ff", "line")).toBe("diidol mawngol bodeewol e taƴe");
        expect(described("ff", "circle")).toBe(
            "sirkul mawngal bodeewal e taƴe",
        );
        expect(described("ff", "point")).toBe("toɓɓere mawnde bodeere e taƴe");
    });

    /**
     * Xitsonga has very few true adjectives: almost everything English calls
     * one is a noun. So the class fork lands on «-kulu», «-tsongo» and the
     * passive «-tateriwaka», and on nothing else — the colour is the same
     * string against a class 3 noun and a class 7 one.
     * That is a fact about which words carry a concord rather than about how
     * much agreement the language has, and it is why the two rows are asserted
     * whole rather than by a substring that would pass either way.
     */
    it("moves a Xitsonga concord on the width and not on the colour", () => {
        expect(described("ts", "line")).toBe(
            "ntila lowukulu tshwuka hi swiphemu",
        );
        expect(described("ts", "circle")).toBe(
            "xirhendzevutana lexikulu tshwuka hi swiphemu",
        );
    });

    /**
     * Dholuo's relative particle «ma-» is welded onto `$color`, which the
     * catalog never sees, and onto nothing else: `line-width` and `line-style`
     * write their words with a relative marker of their own already on them
     * («mabor», «mokethore»), so `style-stroke` places those bare. Asserted
     * with all three words present, because that is the only combination in
     * which a stray second «ma-» on either of them would show.
     */
    it("welds Dholuo's relative particle on once and only on the colour", () => {
        expect(
            describeStrokedShape(forLocale("luo"), words, {
                noun: { key: "line" },
                withNoun: true,
            }),
        ).toBe("laini mabor mokethore marakwar");
    });

    /**
     * The batch's other five prefixing catalogs — Xitsonga has a row of its
     * own above — one row each, so that a change to any one of their
     * `noun-gender` tables shows up as a diff here. Every one of them puts the
     * noun first and the dash pattern last.
     */
    it.each([
        ["nso", "line", "mothaladi o mokoto o mohubedu ka dikgaotšo"],
        ["ss", "line", "umudvwa lomkhulu lobovu ngetincetu"],
        ["ve", "line", "mutalo muhulu mutswuku nga zwipiḓa"],
        ["ki", "line", "mũhari mũnene mũtune na icunjĩ"],
        ["bem", "line", "umutalale umukulu umukashika na tuputule"],
    ])(
        "agrees %s's prefixed concord with the noun class",
        (locale, key, expected) => {
            expect(described(locale, key as NounKey)).toBe(expected);
        },
    );

    /**
     * Kabyle's *état d'annexion* falls on the noun after a preposition, and
     * `$pattern` is a noun this catalog never sees. The way out is not an
     * inflection but a *layout*: every one of the four places a fill pattern
     * is placed puts it behind the same «s», so `fill-style` can write one
     * annexed form apiece and be right in all of them. These two are the two
     * shapes those places take — inside a named shape, and standing alone —
     * and they are what would break if a branch stopped supplying the
     * preposition.
     */
    it("puts every Kabyle fill pattern behind the same preposition", () => {
        const kab = forLocale("kab");
        expect(
            describeClosedShape(
                kab,
                { fillColorWord: "blue", fillStyleWord: "dots" },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            ),
        ).toBe("tawinest teččuṛ tanilit s tenqiḍin");
        expect(
            describeFill(
                kab,
                { fillColorWord: "blue", fillStyleWord: "dots" },
                { filled: true },
            ),
        ).toBe("anili s tenqiḍin");
    });

    /**
     * Two standard languages in one script, which is the `hr`-against-`sr`
     * case again: `zgh` and `shi` share Tifinagh and disagree about the words.
     * Asserted side by side, because a catalog copied from its neighbour would
     * read as perfectly good Tifinagh and be the wrong language.
     */
    it("keeps the two Tifinagh catalogs' vocabularies apart", () => {
        const black = (locale: string) =>
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "black" },
                { noun: { key: "line" }, withNoun: true },
            );
        expect(black("zgh")).toBe("ⵉⵣⵉⵔⵉⴳ ⴰⴱⴻⵔⴽⴰⵏ");
        expect(black("shi")).toBe("ⵉⵣⵉⵔⵉⴳ ⴰⵙⴳⴳⴰⵏ");
        expect(black("kab")).toBe("izirig aberkan");
    });

    /**
     * All twelve put their adjectives after the noun, and all twelve therefore
     * reach `[noun-tail]` for a regular polygon: the side count is a
     * complement in every one of them and has to close the phrase. The
     * Austronesian batch made the point that the split is not the postnominal
     * languages' property; this is the same conclusion from the side where
     * they all *are* postnominal, which is why all twelve rows are here rather
     * than a representative few.
     */
    it.each([
        ["nso", "sekhutlokhutlo se se lekanego se sehubedu sa mahlakore a 5"],
        ["ss", "sakhiwo lesilinganako lesibovu lesinetinhlangotsi letingu-5"],
        ["ve", "tshivhumbeo tsho linganaho tshitswuku tsha masia a 5"],
        ["ts", "xivumbeko lexi ringanaka tshwuka xa matlhelo ya 5"],
        ["ki", "mũhianĩre mũiganu mũtune ũrĩ na mĩena 5"],
        ["bem", "icimo icalingana icikashika icakwata amabali 5"],
        ["luo", "kido mopogore maromre marakwar man-gi bethe 5"],
        ["sg", "poligöne so alîngbi bengbä so ayeke na ambâgë 5"],
        ["ff", "poligoŋ fotduɗo bodeewal mo banŋeeji 5"],
        ["kab", "ameggetsdis amectu azeggaɣ s 5 n yidisan"],
        ["zgh", "ⴰⵎⴻⴳⴳⴻⵜⵙⴷⵉⵙ ⴰⵎⴻⵛⵜⵓ ⴰⵣⴻⴳⴳⴰⵖ ⵙ 5 ⵏ ⵢⵉⴷⵉⵙⴰⵏ"],
        ["shi", "ⴰⵎⴳⴳⵜⵙⴷⵉⵙ ⴰⵎⵛⵜⵓ ⴰⵣⴳⴳⵯⴰⵖ ⵙ 5 ⵏ ⵢⵉⴷⵉⵙⴰⵏ"],
    ])("closes %s's phrase with the side count", (locale, expected) => {
        expect(
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe(expected);
    });
});

describe("the West and Central African batch", () => {
    const described = (locale: string, key: NounKey) =>
        describeStrokedShape(forLocale(locale), words, {
            noun: { key },
            withNoun: true,
        });

    /**
     * **The third place a noun class can be spelled.** Nineteen Bantu catalogs
     * write it as a prefix on the describing word and three — `ff`, `mos`,
     * `dag` — write it as a suffix; Tiv writes it as a word of its own, the
     * relative particle a verb of quality needs in order to modify a noun.
     * Three rows, three classes, and the particle is the only thing that moves:
     * «vesen» and «nyian» are constant across all three.
     */
    it("carries a Tiv class on a particle of its own, in front of the word", () => {
        expect(described("tiv", "line")).toBe(
            "layin u vesen u nyian man ubaajir",
        );
        expect(described("tiv", "circle")).toBe(
            "sekul i vesen i nyian man ubaajir",
        );
        expect(described("tiv", "point")).toBe(
            "poyint a vesen a nyian man ubaajir",
        );
    });

    /**
     * The Gur pair, asserted side by side because what they show is not that
     * Gur suffixes a concord — `locales/ff` already showed an Atlantic-Congo
     * language doing that — but that two catalogs in one family disagree about
     * how many classes the core's nouns reach. Mooré forks four ways and lands
     * three different endings on these three nouns; Dagbani forks three and
     * lands two, the line and the circle sharing `-li`.
     *
     * Asserted whole rather than by the suffix alone, because a stem that
     * stopped agreeing would leave the endings looking right.
     */
    it("suffixes a Mooré concord across three classes", () => {
        expect(described("mos", "line")).toBe("sõore bɛdre miugre ne tirɛ");
        expect(described("mos", "circle")).toBe("gilgu bɛdgo miuggo ne tirɛ");
        expect(described("mos", "point")).toBe("poẽ bɛdga miugga ne tirɛ");
    });

    it("suffixes a Dagbani concord across a narrower set", () => {
        expect(described("dag", "line")).toBe("layin titali ʒeeli ni dasɛs");
        expect(described("dag", "circle")).toBe("gilli titali ʒeeli ni dasɛs");
        expect(described("dag", "point")).toBe("pɔyint titaga ʒeega ni dasɛs");
    });

    /**
     * **Kituba is where the describing words have to be identical, and that is
     * the finding.** Only the noun differs between these three rows.
     * It is a Bantu-based creole whose nouns keep their class prefixes as
     * frozen parts of the word and whose describing words agree with nothing,
     * so the same three tokens stand against all three nouns whatever prefix
     * each one is frozen with. `locales/ln` is the neighbour that kept its
     * concord.
     *
     * Written out three times rather than as a loop over one string, so that a
     * later editor adding a `$gender` fork to this catalog has to delete an
     * assertion that says in as many words why it should not be there.
     */
    it("leaves every Kituba describing word alone, whatever the noun", () => {
        expect(described("ktu", "line")).toBe(
            "linya ya nene ya batini ya mbwaki",
        );
        expect(described("ktu", "circle")).toBe(
            "ndilu ya nene ya batini ya mbwaki",
        );
        expect(described("ktu", "point")).toBe(
            "pwente ya nene ya batini ya mbwaki",
        );
    });

    /**
     * One row each for the rest, so that a change to any of their
     * `noun-gender` tables or word order shows up as a diff here. The three
     * Bantu catalogs — `rn`, `nyn`, `lua` — fork; the four Manding, Kwa and
     * Nilo-Saharan ones — `dyu`, `mnk`, `gaa`, `kr` — do not, and their rows
     * are here for the same reason `locales/ktu`'s are: a fork appearing in one
     * of them would be a claim the language does not make.
     */
    it.each([
        ["rn", "umurongo munini utukura w'udukona"],
        ["nyn", "omurongo muhango w'omutukura na tubaraaza"],
        ["lua", "mulongo munene mukunze ne tutupa"],
        ["dyu", "layini bonman bilenman ni tirɛw ye"],
        ["mnk", "laayinoo waroo wuleŋo niŋ dasoolu"],
        ["gaa", "laiŋi agbo tsuru kɛ dashii"],
        ["kr", "layin kura kime kǝska-be"],
    ])("describes a %s line", (locale, expected) => {
        expect(described(locale, "line")).toBe(expected);
    });

    /**
     * All eleven put their adjectives after the noun and all eleven reach
     * `[noun-tail]`, the side count being a complement in every one of them.
     * That is the African and Berber batch's conclusion holding across a very
     * different set of families — Bantu, Gur, Mande, Kwa, Benue-Congo and
     * Nilo-Saharan — which is the only reason to write all eleven rows out
     * rather than a representative few.
     */
    it.each([
        ["rn", "ishusho ingana impande itukura ifise impande 5"],
        ["nyn", "ekishushani ekingana empande ky'omutukura ekiine empande 5"],
        ["lua", "cimfuanyi cia mpanga mifuanangane cikunze cidi ne mpanga 5"],
        [
            "ktu",
            "kifwani ya bansuki ya kiteso mosi ya mbwaki ya kele ti bansuki 5",
        ],
        ["mos", "poligonre sẽn zems miugre sẽn tar kɩrems 5"],
        ["dag", "poligɔn din kpaŋa nyɛla yim ʒeeli din mali kpaŋa 5"],
        ["dyu", "poligɔni bɛnnen bilenman min kɛrɛ 5 ye"],
        ["mnk", "poligoŋ tembendiŋo wuleŋo meŋ ye karoo 5 soto"],
        ["gaa", "poligɔn ni damɔ pɛpɛɛpɛ tsuru ni yɔɔ tsɔɔmɔ 5"],
        // Tiv is the row where the noun's own particles are visible beside the
        // adjective's, and all three have to be the same word: the head, the
        // colour and the tail all agree with `regular-polygon`'s class, which
        // `noun-gender` gives as `c2`, so all three read «i».
        ["tiv", "poligon i a kuma i nyian i a lu a atser 5"],
        ["kr", "poligon lawanbe kime kǝskawa 5 jinzǝ"],
    ])("closes %s's phrase with the side count", (locale, expected) => {
        expect(
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe(expected);
    });
});

describe("the West and Central African batch, continued", () => {
    const described = (locale: string, key: NounKey) =>
        describeStrokedShape(forLocale(locale), words, {
            noun: { key },
            withNoun: true,
        });

    /**
     * **A creole beside its lexifier, which is what this batch was assembled
     * to show.** `locales/ktu` was seeded in the previous batch as the one
     * Bantu catalog selecting on nothing: Kituba joins a describing word to
     * its noun with an invariable «ya». That «ya» is Kongo's class-9 linker,
     * frozen — and here the linker moves while the stem does not.
     *
     * Four rows and three of the four classes — `circle` and `region` are both
     * class 7, and class 11 belongs to `border`, which the worker-path test's
     * `sh` row exercises. «nene» and «mbwaki» are constant across all four:
     * the whole of the agreement in Kikongo is that first syllable. The dash
     * pattern stays «ya …» in every row, because it is written as a frozen
     * class-9 phrase — which is to say, as Kituba writes everything.
     */
    it("moves only Kongo's linker syllable, never the stem behind it", () => {
        expect(described("kg", "line")).toBe(
            "nsinga ya nene ya mbwaki ya bitini bitini",
        );
        expect(described("kg", "circle")).toBe(
            "kizunga kya nene kya mbwaki ya bitini bitini",
        );
        expect(described("kg", "point")).toBe(
            "tona dya nene dya mbwaki ya bitini bitini",
        );
        expect(described("kg", "region")).toBe(
            "fulu kya nene kya mbwaki ya bitini bitini",
        );
    });

    /**
     * The same argument from the other end: a class spelled as a suffix, which
     * `locales/mos` and `locales/dag` already do with four classes and three.
     * Kabiyè answers with five, and the stem is again constant — «sɔsɔ-» and
     * «kɩsɛm-» never move, only what follows them.
     *
     * Reading this against the Kongo rows above is the point of having both in
     * one batch: the agreement is one morph in each, and it lands in front in
     * one and behind in the other.
     */
    it("moves only Kabiyè's class suffix, never the stem in front of it", () => {
        expect(described("kbp", "line")).toBe(
            "ñɔʋ sɔsɔʋ kɩsɛmʋ nɛ hɔɔlɩŋ cikpeŋ",
        );
        expect(described("kbp", "circle")).toBe(
            "kpelaɣ sɔsɔɖɛ kɩsɛmɩɖɛ nɛ hɔɔlɩŋ cikpeŋ",
        );
        expect(described("kbp", "point")).toBe(
            "yʋsaɣ sɔsɔa kɩsɛma nɛ hɔɔlɩŋ cikpeŋ",
        );
        expect(described("kbp", "region")).toBe(
            "ɖenɖe sɔsɔtʋ kɩsɛmɩtʋ nɛ hɔɔlɩŋ cikpeŋ",
        );
    });

    /**
     * **Alliterative concord, which is visible in the rendered string and in no
     * other locale here.** The noun's own prefix and both describing words'
     * prefixes are the same syllable, three times over in each row:
     * «kʌlayn kʌbana-bana kʌbana», «rʌtoni rʌbana-bana rʌbana».
     *
     * That is why `locales/tem`'s header can claim its `noun-gender` table is
     * checkable by eye against `noun`, and these rows are what would catch the
     * table drifting away from the nouns it describes.
     */
    it("repeats the Temne noun's own prefix on every describing word", () => {
        expect(described("tem", "line")).toBe(
            "kʌlayn kʌbana-bana kʌbana na ʌŋpath-pathi",
        );
        expect(described("tem", "circle")).toBe(
            "tʌkərəŋ tʌbana-bana tʌbana na ʌŋpath-pathi",
        );
        expect(described("tem", "point")).toBe(
            "rʌtoni rʌbana-bana rʌbana na ʌŋpath-pathi",
        );
        expect(described("tem", "region")).toBe(
            "rʌro rʌbana-bana rʌbana na ʌŋpath-pathi",
        );
    });

    /**
     * The three that fork on nothing, one row each, since a second row would
     * only restate the first.
     *
     * The two creoles are worth having side by side even though neither
     * inflects: same lexifier, same word order, and every content word spelled
     * differently. That is the whole of what separates them, and it is exactly
     * what a reader skimming `locales/pcm` and concluding "this is English"
     * would miss.
     */
    it.each([
        ["fon", "dlɛ̌n gaga vɔvɔ kpó dlɛ̌n kpɛví lɛ́"],
        ["pcm", "thick brok-brok red lain"],
        ["kri", "tik brok-brok rɛd layn"],
    ])("leaves %s's describing words alone", (locale, expected) => {
        expect(described(locale, "line")).toBe(expected);
    });

    /**
     * All six reach `[noun-tail]`, the side count being a complement in every
     * one of them, as it was in all eleven of the batch above — including the
     * two English-lexifier creoles, which is the one shape that batch had no
     * example of.
     *
     * The Kabiyè row is the one to read: the colour «kɩsɛmɩɖɛ» ends in the
     * `-ɖɛ` the header's table gives class 3, which is the class
     * `noun-gender` assigns `regular-polygon` — the head «poligɔnɩ kɩmaɣzaɣ»
     * that `noun-regular-polygon` writes. (Kabiyè is not alliterative the way
     * `locales/tem` is, so that head does not itself display the class; only
     * the suffix does.) A colour agreeing with something other than its own
     * head is the easiest defect to write into a class catalog, and this row
     * is what would catch it here.
     */
    it.each([
        ["kg", "poligone yafwanana ya mbwaki ya makonso 5"],
        ["fon", "polygone jɛ́jɛ́ vɔvɔ kpó akpá 5"],
        ["pcm", "red poligọn wey ẹvri sait dey di sem wey gẹt 5 sait"],
        ["kri", "rɛd pɔligɔn we ɔl di say dɛn na wan we gɛt 5 say"],
        ["kbp", "poligɔnɩ kɩmaɣzaɣ kɩsɛmɩɖɛ ŋgʋ kɩwɛnɩ hɔɔlɩŋ 5 yɔ"],
        ["tem", "tʌpɔligɔn tʌ nɔŋ tʌbana tʌ na tʌbʌŋ 5"],
    ])("closes %s's phrase with the side count", (locale, expected) => {
        expect(
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe(expected);
    });
});

describe("the Angolan, Sierra Leonean and Songhay batch", () => {
    const described = (locale: string, key: NounKey) =>
        describeStrokedShape(forLocale(locale), words, {
            noun: { key },
            withNoun: true,
        });

    /**
     * **Two Angolan neighbours putting the same agreement in different
     * places**, which is the reason this batch has both.
     *
     * Umbundu prefixes the class straight onto the stem, so «nene» and
     * «kusuka» change shape from row to row: `yinene`, `cinene`, `linene`.
     * Kimbundu leaves the stem alone and moves a connective in front of it:
     * `ya nene`, `kya nene`. Same family, same class system, same country, and
     * the two files do not resemble each other.
     *
     * The Kimbundu rows are also `locales/kg`'s shape exactly — an agreeing
     * «-a» connective a thousand kilometres away, in a different country — so
     * the rows below are what makes the header's claim checkable rather than
     * asserted: neither family nor geography predicts the shape.
     */
    it("prefixes Umbundu's class onto the stem", () => {
        expect(described("umb", "line")).toBe(
            "ongoli yinene yikusuka lo olongoli vitito",
        );
        expect(described("umb", "circle")).toBe(
            "ocilinganya cinene cikusuka lo olongoli vitito",
        );
        expect(described("umb", "point")).toBe(
            "ondimbu linene likusuka lo olongoli vitito",
        );
        // «ocinepa» carries an overt `oci-`, so it has to take the `ci-`
        // concord the other `oci-` nouns take: `noun-gender` listed
        // `line-segment` under `c10` at first and the head disagreed with the
        // words beside it, which is the `locales/tiv` defect again.
        expect(described("umb", "line-segment")).toBe(
            "ocinepa congoli cinene cikusuka lo olongoli vitito",
        );
    });

    it("moves only Kimbundu's connective, never the stem behind it", () => {
        expect(described("kmb", "line")).toBe(
            "nlonji ya nene ya kusuka ya jinlonji jitetuka",
        );
        expect(described("kmb", "circle")).toBe(
            "kizenge kya nene kya kusuka ya jinlonji jitetuka",
        );
        expect(described("kmb", "point")).toBe(
            "kimbanza kya nene kya kusuka ya jinlonji jitetuka",
        );
    });

    /**
     * The two that fork on nothing, one row each.
     *
     * `men` is the affix-rule case: its describing words follow the noun, so
     * the phrase ends in an argument and Mende's definite suffix — which
     * attaches to whatever word ends the noun phrase — could never be welded
     * on. Every describing word in the catalog is indefinite for that reason,
     * so no description ends in the suffix, and this row is what that looks
     * like.
     */
    it.each([
        ["men", "laing wa kpou kɛ ngeya-ngeya"],
        ["dje", "kar beeri ciray nda dumbu-dumbu"],
    ])("leaves %s's describing words alone", (locale, expected) => {
        expect(described(locale, "line")).toBe(expected);
    });

    /**
     * All four reach `[noun-tail]`, the side count being a complement in every
     * one of them.
     *
     * The Umbundu row is the one to read, and it is here because probing the
     * rendered string rather than assuming it caught a real defect: the head
     * «poligonu» first carried `yi-` while `noun-gender` sends
     * `regular-polygon` to the `c7` default, so the head and the colour beside
     * it disagreed. That is the defect #1685 found in `locales/tiv`, and this
     * row is what would catch it recurring.
     */
    it.each([
        ["men", "pɔligɔn yekpe kpou na kɛ gbua 5"],
        ["umb", "poligonu cisokisa cikusuka lo olonele 5"],
        ["kmb", "poligonu ya kusokela ya kusuka ya jimbandu 5"],
        ["dje", "poligon saawa ciray kaŋ gonda kambu 5"],
    ])("closes %s's phrase with the side count", (locale, expected) => {
        expect(
            describeStrokedShape(
                forLocale(locale),
                { colorWord: "red" },
                {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                },
            ),
        ).toBe(expected);
    });
});

describe("the Russian Federation's Cyrillic batch", () => {
    /**
     * Twelve catalogs from five families — Turkic, Mongolic, Uralic, Iranian
     * and Nakh — sharing nothing but a script, and the useful thing to pin is
     * that the script predicts nothing while the twelve agree anyway: all of
     * them put their adjectives **in front of** the noun and fold a regular
     * polygon's side count into the head, so `noun-regular-polygon`'s `[tail]`
     * branch renders empty in every one.
     *
     * Asserted as an identity rather than as a difference, the way the
     * Americas batch's rows are: what this catches is someone "correcting" one
     * of these catalogs by moving its adjectives behind the noun.
     */
    const prenominal: [string, string, string][] = [
        ["ba", "ҡалын өҙөклө ҡыҙыл тура һыҙыҡ", "ҡалын өҙөклө ҡыҙыл"],
        ["cv", "хулӑн татӑклӑ хӗрлӗ тӳрӗ йӗр", "хулӑн татӑклӑ хӗрлӗ"],
        [
            "sah",
            "халыҥ быстах-быстах кыһыл көнө сурааһын",
            "халыҥ быстах-быстах кыһыл",
        ],
        ["tyv", "кылын үзүктелген кызыл дорт шугум", "кылын үзүктелген кызыл"],
        [
            "bua",
            "бүдүүн таһаршаһан улаан сэхэ зурлаа",
            "бүдүүн таһаршаһан улаан",
        ],
        ["xal", "зузан тасрха улан шулун зурас", "зузан тасрха улан"],
        ["udm", "зӧк чигем горд шонер чур", "зӧк чигем горд"],
        ["kpv", "кыз вундалӧм гӧрд веськыд визь", "кыз вундалӧм гӧрд"],
        ["myv", "эчке сезнезь якстере виде линия", "эчке сезнезь якстере"],
        ["mhr", "кӱжгӧ кӱрылтшӧ йошкар вияш линий", "кӱжгӧ кӱрылтшӧ йошкар"],
        ["os", "бæзджын скъуыдтæ сырх раст хахх", "бæзджын скъуыдтæ сырх"],
        ["ce", "дуькъа кагйина цӀен нийса сиз", "дуькъа кагйина цӀен"],
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s adjectives in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The noun is appended to the adjectives rather than woven into
            // them, which is what makes this English's shape and not merely
            // English's sequence.
            expect(withNoun.startsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    it("keeps the side count in the head for all twelve, leaving no tail", () => {
        for (const [locale] of prenominal) {
            const description = describeStrokedShape(forLocale(locale), words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            });
            // The count is present, and it is inside the noun rather than
            // trailing after the adjectives.
            expect(description).toContain("5");
            expect(description.trimEnd()).toBe(description);
            expect(description).not.toContain("  ");
        }
    });
});

/**
 * `$gender` carrying a Northeast Caucasian noun class, which is the fifth
 * mechanism the argument has been asked to hold after a European gender, a
 * Bantu noun class, Ojibwe's animacy and Fula's suffixed concord.
 *
 * Chechen marks its classes with в-, й-, б- and д- at the *front* of an
 * agreeing word, and almost nothing in a style description agrees: the colour
 * and width adjectives take no prefix at all. The single word that does is the
 * participle «дуьзна», "filled", so unlike Swahili's this catalog's fork is
 * one message wide — and these rows are the only thing standing between it and
 * being quietly flattened by someone who reads the rest of the file and
 * concludes that Chechen agrees nothing.
 */
describe("Chechen noun classes", () => {
    const ce: Translator = forLocale("ce");

    const blueFill = { fillColorWord: "blue", fillStyleWord: "" };

    // «гуо» is `d` and «тӀадам» is `b`, so one word of the two moves and the
    // colour beside it does not. The `withNoun: false` half is the one that
    // could not pass by accident: with the noun withheld, the prefix is all
    // that is left to tell the two classes apart.
    it.each([
        ["circle", "сийна дуьзна гуо", "сийна дуьзна"],
        ["point", "сийна буьзна тӀадам", "сийна буьзна"],
    ])("agrees the filled participle with «%s»", (key, withNoun, alone) => {
        expect(
            describeClosedShape(ce, blueFill, {
                filled: true,
                noun: { key: key as NounKey },
                withNoun: true,
            }),
        ).toBe(withNoun);
        expect(
            describeClosedShape(ce, blueFill, {
                filled: true,
                noun: { key: key as NounKey },
                withNoun: false,
            }),
        ).toBe(alone);
    });

    /**
     * The other half of the same fact, and the reason `style-unfilled` is
     * written flat here rather than forked the way `style-filled-word` is:
     * `describeFill` renders it with no arguments, because a fill described on
     * its own has no noun to take a class from. A `$gender` select in that
     * message could only ever reach its default branch, which is why no
     * agreeing catalog in the roster writes one.
     */
    it("says unfilled without agreeing with anything", () => {
        expect(
            describeFill(ce, { fillColorWord: "blue" }, { filled: false }),
        ).toBe("дуьзна доцу");
    });
});

describe("the Caucasus and Kurdish batch", () => {
    /**
     * Fifteen catalogs, and the first batch whose members **do not agree about
     * where an adjective goes**. Every previous batch could be pinned as one
     * shape — the Russian Federation's twelve are prenominal to a catalog, and
     * that row was asserted as an identity. Here ten put the description in
     * front of the noun and five put it behind, and the five are not a
     * subfamily anyone would guess from the map: all three Northwest Caucasian
     * catalogs (`ab`, `ady`, `kbd`), plus both Kurdish ones, which are Iranian
     * and sit at the other end of the batch.
     *
     * Held from both sides — `startsWith` for one group and `endsWith` for the
     * other — so that the noun is being *appended to* or *prefixed to* a
     * description rather than woven into it. What this catches is someone
     * "correcting" a catalog into English's order because the neighbouring
     * files are in it.
     *
     * Each row's two strings pin one rendering exactly; the placement rule is
     * then checked over {@link placementNouns} against what the catalog
     * actually renders, so that a file reordered for a single noun fails even
     * though the row it was pinned on still passes.
     */
    const prenominal: [string, string, string][] = [
        ["av", "кӀудияб бекараб багӀараб мухъ", "кӀудияб бекараб багӀараб"],
        ["lez", "яцӀу атӀай яру дуьз цӀар", "яцӀу атӀай яру"],
        [
            "dar",
            "халаси кӀапӀбикибси хӀунтӀена линия",
            "халаси кӀапӀбикибси хӀунтӀена",
        ],
        [
            "lbe",
            "хъунмасса кьуркьусса ятӀулсса линия",
            "хъунмасса кьуркьусса ятӀулсса",
        ],
        ["tab", "яцӀу штрихрин уьру дюз цӀар", "яцӀу штрихрин уьру"],
        ["inh", "дуькъа кагдаь цӀе нийса сиз", "дуькъа кагдаь цӀе"],
        ["krc", "къалын юзюклю къызыл тюз сызыкъ", "къалын юзюклю къызыл"],
        ["kum", "къалын уьзюклю къызыл тюз сызыкъ", "къалын уьзюклю къызыл"],
        ["nog", "калын уьзик кызыл туьз сызык", "калын уьзик кызыл"],
        ["tly", "kuluftə tirəyinə sıə xət", "kuluftə tirəyinə sıə"],
    ];

    const postnominal: [string, string, string][] = [
        ["ab", "аҵәаӷәа аҭбаа ахәҭа-хәҭа аҟаԥшь", "аҭбаа ахәҭа-хәҭа аҟаԥшь"],
        [
            "ady",
            "линие занкӀэ Ӏужъу зэпыугъэ плъыжьы",
            "Ӏужъу зэпыугъэ плъыжьы",
        ],
        ["kbd", "линэ занщӀэ Ӏув зэпыуда плъыжь", "Ӏув зэпыуда плъыжь"],
        ["kmr", "xêz ya stûr ya qutbirr ya sor", "ya stûr ya qutbirr ya sor"],
        ["ckb", "هێڵی سوور و پچڕپچڕ و ئەستوور", "سوور و پچڕپچڕ و ئەستوور"],
    ];

    /**
     * The nouns the placement rule is checked over — one of each shape the
     * `noun` table names, rather than the single `line` the rows above spell
     * out. `kmr`'s ezafe makes the spread matter for a second reason: a polygon
     * is masculine and a line feminine, so these six cover both agreements.
     */
    const placementNouns: NounKey[] = [
        "line",
        "circle",
        "square",
        "polygon",
        "point",
        "region",
    ];

    /**
     * One row's worth of both claims: the exact rendering for `line`, and the
     * placement rule over every noun in {@link placementNouns}. The second is
     * asserted between two *rendered* strings — never between the row's own two
     * literals, which would only ever restate the table to itself.
     */
    const itPlaces = (
        group: [string, string, string][],
        where: "in front of" | "behind",
    ) => {
        for (const [locale, withNoun, adjectivesOnly] of group) {
            it(`puts ${locale}'s description ${where} the noun`, () => {
                const t = forLocale(locale);
                expect(
                    describeStrokedShape(t, words, {
                        noun: { key: "line" },
                        withNoun: true,
                    }),
                ).toBe(withNoun);
                // The same string with the noun withheld, which is what makes
                // this a claim about placement rather than about two unrelated
                // renderings.
                expect(
                    describeStrokedShape(t, words, {
                        noun: { key: "line" },
                        withNoun: false,
                    }),
                ).toBe(adjectivesOnly);
                for (const key of placementNouns) {
                    const described = describeStrokedShape(t, words, {
                        noun: { key },
                        withNoun: true,
                    });
                    const alone = describeStrokedShape(t, words, {
                        noun: { key },
                        withNoun: false,
                    });
                    expect(
                        where === "in front of"
                            ? described.startsWith(alone)
                            : described.endsWith(alone),
                        `${locale}/${key}: ${described} / ${alone}`,
                    ).toBe(true);
                }
            });
        }
    };

    itPlaces(prenominal, "in front of");
    itPlaces(postnominal, "behind");

    /**
     * A regular polygon's side count, and the batch's second split. Thirteen
     * catalogs fold it into the head — `noun-regular-polygon`'s `[tail]` branch
     * renders empty, as it does in every catalog of the Russian Federation
     * batch — while `kbd` and `ckb` cannot, and put it in a trailing
     * complement instead.
     *
     * Both had the same reason and reached it in different scripts. Kabardian
     * incorporates a numeral into the noun («къуапитху»), which is a word this
     * catalog cannot build around a formatted `{ $numSides }`, so it writes
     * «къуапэ 5 иӀэу» after the description; Sorani's noun carries its ezafe
     * and takes the count in a «بە … ەوە» phrase behind it. That is what
     * `$part` exists for, and these two are the reason it is not dead weight.
     */
    it.each([...prenominal, ...postnominal].map(([locale]) => locale))(
        "renders %s's side count exactly once, with no stray spacing",
        (locale) => {
            const description = describeStrokedShape(forLocale(locale), words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            });
            // Exactly once, which is what the title claims and what `toContain`
            // alone would not catch: a catalog that writes the count into the
            // head and *also* leaves it in the `[tail]` branch renders it
            // twice, and only splitting on it says so.
            expect(description.split("5")).toHaveLength(2);
            expect(description.trimEnd()).toBe(description);
            expect(description).not.toContain("  ");
        },
    );

    /**
     * Which of the two shapes a catalog chose, asserted where the answer is
     * visible: in the five catalogs whose adjectives come *last*, a head-only
     * rendering still ends with the adjectives, while a catalog using the tail
     * has appended something behind them.
     *
     * `ab`, `ady` and `kmr` fold the count into the head and so still end with
     * the adjectives; `kbd` and `ckb` do not. That is the whole of the split,
     * held on the group where the string position actually distinguishes it.
     * The ten prenominal catalogs all fold it in too, but their adjectives
     * come first, so a trailing complement would be invisible to `endsWith`
     * and the row above is what covers them.
     */
    it.each([
        ["ab", true],
        ["ady", true],
        ["kmr", true],
        ["kbd", false],
        ["ckb", false],
    ])("puts %s's side count in the head: %s", (locale, inHead) => {
        const t = forLocale(locale);
        // Taken from the *same* noun, because `kmr`'s ezafe agrees with it:
        // a polygon is masculine and a line feminine, so comparing across two
        // nouns would fail on gender rather than on placement.
        const adjectivesOnly = describeStrokedShape(t, words, {
            noun: { key: "regular-polygon", numSides: 5 },
            withNoun: false,
        });
        const regular = describeStrokedShape(t, words, {
            noun: { key: "regular-polygon", numSides: 5 },
            withNoun: true,
        });
        expect(regular.endsWith(adjectivesOnly)).toBe(inHead);
    });
});

/**
 * Ingush noun classes, and the reason this block is not a copy of the Chechen
 * one above it.
 *
 * Ingush and Chechen are the two Vainakh languages and share the в-/й-/б-/д-
 * class system, so `locales/inh` forks `style-filled-word` exactly as
 * `locales/ce` does. It also forks **`line-style.dashed`**, which `locales/ce`
 * leaves flat although «кагйина» is the same kind of participle and the same
 * `$gender` reaches it — `describeStroke` hands every adjective the noun's
 * gender, so the branch is live rather than decorative.
 *
 * That divergence is a question for a speaker of either language rather than a
 * bug in either file, and these rows are what would notice if someone flattened
 * `locales/inh` to match its neighbour without answering it.
 */
describe("Ingush noun classes", () => {
    const inh: Translator = forLocale("inh");

    const blueFill = { fillColorWord: "blue", fillStyleWord: "" };

    // «го» is `d` and «тӀадам» is `b`. The `withNoun: false` half is the one
    // that could not pass by accident: with the noun withheld, the prefix is
    // all that distinguishes the two classes.
    it.each([
        ["circle", "сийна дизза го", "сийна дизза"],
        ["point", "сийна бизза тӀадам", "сийна бизза"],
    ])("agrees the filled participle with «%s»", (key, withNoun, alone) => {
        expect(
            describeClosedShape(inh, blueFill, {
                filled: true,
                noun: { key: key as NounKey },
                withNoun: true,
            }),
        ).toBe(withNoun);
        expect(
            describeClosedShape(inh, blueFill, {
                filled: true,
                noun: { key: key as NounKey },
                withNoun: false,
            }),
        ).toBe(alone);
    });

    /** The second fork, and the one `locales/ce` does not write. */
    it.each([
        ["line", "кагдаь цӀе нийса сиз"],
        ["point", "кагбаь цӀе тӀадам"],
    ])("agrees the dashed participle with «%s»", (key, expected) => {
        expect(
            describeStrokedShape(
                inh,
                { lineStyleWord: "dashed", colorWord: "red" },
                { noun: { key: key as NounKey }, withNoun: true },
            ),
        ).toBe(expected);
    });

    /**
     * The other side of that divergence, which the row above cannot see. What
     * makes `locales/inh`'s second fork worth a paragraph is that its sister
     * catalog does not write it, and nothing said so until here: flattening
     * `locales/inh` is caught above, but *forking* `locales/ce` to match would
     * quietly retire the claim instead. Chechen renders «кагйина» for a `d`
     * noun and a `b` noun alike.
     */
    it("has no counterpart in locales/ce, which leaves the same word flat", () => {
        const ce: Translator = forLocale("ce");
        const dashed = (key: NounKey) =>
            describeStrokedShape(
                ce,
                { lineStyleWord: "dashed", colorWord: "red" },
                { noun: { key }, withNoun: false },
            );
        expect(dashed("line")).toBe(dashed("point"));
        expect(dashed("line")).toBe("кагйина цӀен");
    });

    /**
     * The same rule that keeps `locales/ce`'s `style-unfilled` flat:
     * `describeFill` renders it with no arguments, so there is no noun to take
     * a class from and a `$gender` select could only ever reach its default.
     */
    it("says unfilled without agreeing with anything", () => {
        expect(
            describeFill(inh, { fillColorWord: "blue" }, { filled: false }),
        ).toBe("дизза доаца");
    });
});

/**
 * Kurmanji's ezafe, which is the batch's one agreement mechanism that is not a
 * Caucasian noun class — and the roster's sixth thing `$gender` has been asked
 * to carry, after a European gender, a Bantu noun class, Ojibwe's animacy,
 * Fula's suffixed concord and Chechen's class prefix.
 *
 * Kurmanji has masculine and feminine nouns, and an attributive adjective
 * follows its noun linked by an ezafe. The bound ezafe cannot be welded onto
 * `{ $noun }`, so `locales/kmr` writes the free particle — «ya» after a feminine
 * noun and «yê» after a masculine one — and repeats it before each further
 * adjective. A line is feminine and a polygon masculine, so one description
 * changes in three places and the other does not change at all.
 */
describe("Kurmanji ezafe agreement", () => {
    const kmr: Translator = forLocale("kmr");

    it.each([
        ["line", "xêz ya stûr ya qutbirr ya sor"],
        ["circle", "bazine ya stûr ya qutbirr ya sor"],
        ["square", "çargoşe yê stûr yê qutbirr yê sor"],
        ["polygon", "pirgoşe yê stûr yê qutbirr yê sor"],
    ])("links «%s» to its adjectives with the right ezafe", (key, expected) => {
        expect(
            describeStrokedShape(kmr, words, {
                noun: { key: key as NounKey },
                withNoun: true,
            }),
        ).toBe(expected);
    });

    /**
     * «dagirtî» is a past participle and does not inflect, so the agreement in
     * a filled shape is carried by the particle beside it rather than by the
     * word itself — and `style-unfilled`, rendered with no arguments, has no
     * particle and no noun and stays bare.
     */
    it("carries a filled shape's agreement in the particle, not the participle", () => {
        const blueFill = { fillColorWord: "blue", fillStyleWord: "" };
        expect(
            describeClosedShape(kmr, blueFill, {
                filled: true,
                noun: { key: "circle" },
                withNoun: true,
            }),
        ).toBe("bazine ya dagirtî ya şîn");
        expect(
            describeFill(kmr, { fillColorWord: "blue" }, { filled: false }),
        ).toBe("nedagirtî");
    });
});

/**
 * The three catalogs that agree in the language and render one form anyway,
 * which is the batch's most easily "corrected" property and the reason it is
 * pinned.
 *
 * Avar agrees *more* than Chechen — three singular classes plus a plural, and
 * every attributive adjective takes the marker as a suffix, where Chechen's
 * colour and width words take none at all. It still forks nothing, because
 * every noun this core names is a thing rather than a person and so is class
 * III: `[v]`, `[j]` and `[l]` branches would be variants nothing could select.
 * Lak reached the same place from four classes, and Dargwa wrote its select out
 * with only the `[b]` branch reachable.
 *
 * That is the reachability rule `locales/ve`, `locales/ts`, `locales/ki` and
 * `locales/bem` already apply to their unreached Bantu classes, arriving here
 * from languages that agree more rather than less. A reader who knows the
 * family will expect these three to vary by noun, and they must not.
 */
describe("Dagestanian agreement that no message can reach", () => {
    it.each([
        ["av", "багӀараб"],
        ["lbe", "ятӀулсса"],
        ["dar", "хӀунтӀена"],
    ])(
        "renders %s's colour word identically for every noun it is given",
        (locale, expected) => {
            const t = forLocale(locale);
            for (const key of ["line", "point", "circle", "region", "text"]) {
                expect(
                    describeStrokedShape(
                        t,
                        { colorWord: "red" },
                        { noun: { key: key as NounKey }, withNoun: false },
                    ),
                    `${locale}/${key}`,
                ).toBe(expected);
            }
        },
    );

    /**
     * Dargwa is the one of the three whose select is actually written, so this
     * says what the other two say by absence: the `[v]` and `[r]` branches are
     * unreachable through the public API, and the catalog renders `[b]` for
     * every noun until a speaker fills the class table in.
     */
    it("reaches only Dargwa's b-class branch", () => {
        const dar = forLocale("dar");
        const blueFill = { fillColorWord: "blue", fillStyleWord: "" };
        for (const key of ["circle", "point", "line", "region"]) {
            expect(
                describeClosedShape(dar, blueFill, {
                    filled: true,
                    noun: { key: key as NounKey },
                    withNoun: false,
                }),
                key,
            ).toBe("хьанцӀа бицӀибси");
        }
    });
});

describe("the Uralic north batch", () => {
    /**
     * Fifteen catalogs, and the batch is the answer to the question the
     * Caucasus one left open. That batch was the first whose members did not
     * agree about where an adjective goes — ten in front of the noun, five
     * behind — which made the obvious next question whether a batch can still
     * be pinned as one shape at all. This one can: all fifteen are prenominal,
     * across two scripts, five countries and four branches of Uralic, and the
     * agreement is not a family effect either, since the Sami catalogs share
     * it with the Ob-Ugric ones and with Finnic.
     *
     * Held the same way as that batch's rows — `startsWith` over
     * {@link placementNouns} against what the catalog actually renders, rather
     * than between the row's own two literals, which would only restate the
     * table to itself. What it catches is a catalog quietly reordered for one
     * noun while the row it was pinned on still passes.
     */
    const prenominal: [string, string, string][] = [
        ["sma", "asse straejmies rööpses linje", "asse straejmies rööpses"],
        [
            "smj",
            "assje sárggålasj ruoppsis linnjá",
            "assje sárggålasj ruoppsis",
        ],
        ["smn", "assâd sárgálâš ruopsis linjá", "assâd sárgálâš ruopsis"],
        ["sms", "âsses säʹrǧǧlaž rukses linjj", "âsses säʹrǧǧlaž rukses"],
        ["sjd", "эhкесь са̄рркма рупсесь линия", "эhкесь са̄рркма рупсесь"],
        ["vep", "sanged katkaidud rusked suor", "sanged katkaidud rusked"],
        [
            "olo",
            "sangei katkoviivaine ruskei suoru",
            "sangei katkoviivaine ruskei",
        ],
        ["krl", "pakšu katkoviivani ruskie suora", "pakšu katkoviivani ruskie"],
        ["vro", "paks katkõlinõ verrev sirgõ", "paks katkõlinõ verrev"],
        [
            "fit",
            "paksu katkoviivainen punanen suora",
            "paksu katkoviivainen punanen",
        ],
        ["mdf", "эчке сезнеф якстерь виде линия", "эчке сезнеф якстерь"],
        ["koi", "кыз вундалӧм гӧрд веськыд визь", "кыз вундалӧм гӧрд"],
        ["mrj", "кӹжгӹ кӹрӹлтшӹ якшар виквӓш линий", "кӹжгӹ кӹрӹлтшӹ якшар"],
        ["kca", "вөн сєвӑрман вўрты веськат хӑнши", "вөн сєвӑрман вўрты"],
        ["mns", "яныг сагрым вигыр линия", "яныг сагрым вигыр"],
    ];

    /**
     * The nouns the placement rule is checked over — one of each shape the
     * `noun` table names, rather than the single `line` the rows above spell
     * out.
     */
    const placementNouns: NounKey[] = [
        "line",
        "circle",
        "square",
        "polygon",
        "point",
        "region",
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s description in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The same string with the noun withheld, which is what makes this
            // a claim about placement rather than about two unrelated
            // renderings.
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
            for (const key of placementNouns) {
                const described = describeStrokedShape(t, words, {
                    noun: { key },
                    withNoun: true,
                });
                const alone = describeStrokedShape(t, words, {
                    noun: { key },
                    withNoun: false,
                });
                expect(
                    described.startsWith(alone),
                    `${locale}/${key}: ${described} / ${alone}`,
                ).toBe(true);
            }
        });
    }

    /**
     * A regular polygon's side count. Unlike the Caucasus batch, which split
     * two ways over this, all fifteen fold it into the head — every one of
     * these languages builds a numeral into the noun the way `chm` and `kv`
     * already do — so `noun-regular-polygon`'s `[tail]` branch renders empty
     * throughout and `$part` goes unused.
     *
     * Splitting on the count is what makes this an assertion rather than a
     * `toContain`: a catalog that writes the number into the head *and* leaves
     * it in the tail renders it twice, and only counting the pieces says so.
     */
    it.each(prenominal.map(([locale]) => locale))(
        "renders %s's side count exactly once, with no stray spacing",
        (locale) => {
            const description = describeStrokedShape(forLocale(locale), words, {
                noun: { key: "regular-polygon", numSides: 5 },
                withNoun: true,
            });
            expect(description.split("5")).toHaveLength(2);
            expect(description.trimEnd()).toBe(description);
            expect(description).not.toContain("  ");
        },
    );

    /**
     * None of the fifteen forks on `$gender`, and this is the batch where that
     * is worth asserting rather than merely stating. No Uralic language has
     * grammatical gender, so `noun-gender` returns one token in every catalog
     * here — which means the description of a line and of a circle differ in
     * the noun and in nothing else. That is what the Ingush and Kurdish
     * catalogs above do *not* satisfy — each renders two different adjective
     * shapes across these six nouns — and running the same check over both
     * groups is what keeps "this language does not agree" a claim about the
     * file rather than a remark in its header. (Chechen and Avar fork on
     * `$gender` too, but on branches no noun key reaches; that is the separate
     * thing "Dagestanian agreement that no message can reach" pins.)
     */
    it.each(prenominal.map(([locale]) => locale))(
        "leaves %s's adjectives unchanged whatever noun follows them",
        (locale) => {
            const t = forLocale(locale);
            const rendered = placementNouns.map((key) =>
                describeStrokedShape(t, words, {
                    noun: { key },
                    withNoun: false,
                }),
            );
            expect(new Set(rendered).size).toBe(1);
        },
    );

    /**
     * The four Finnic catalogs fork on `$role`, and the other eleven do not.
     *
     * Each of the four documents the same table in its header — nominative
     * standalone, adessive (Veps and Livvi: the merged adessive-allative in a
     * bare `-l`) inside `style-border-clause` — so the border's adjectives have
     * to *change shape* between the two positions, and the eleven that say they
     * have no case to inflect for have to leave them alone. Asserting the pair
     * rather than the ending keeps this a claim about the fork being reached:
     * a catalog whose branch keys were misspelled would fall to `*[standalone]`
     * and render the two positions identically, which no header here allows.
     */
    const forksOnRole = new Set(["vep", "olo", "krl", "fit"]);

    it.each(prenominal.map(([locale]) => locale))(
        "inflects %s's border adjectives for the clause exactly when its header says so",
        (locale) => {
            const t = forLocale(locale);
            const standalone = describeBorder(t, words);
            const embedded = describeClosedShape(
                t,
                { ...words, fillColorWord: "blue" },
                { filled: true, noun: { key: "circle" }, withNoun: true },
            );
            expect(embedded.includes(standalone)).toBe(
                !forksOnRole.has(locale),
            );
        },
    );

    /**
     * Veps, Livvi, Karelian and Meänkieli put the *background* colour in the
     * same case as the border's, and leave the text colour beside it in the
     * nominative — the fourth row of each header's table. Two positions, two
     * forms, from one colour key.
     */
    it.each([...forksOnRole])(
        "gives %s's background colour the clause form and its text colour the citation form",
        (locale) => {
            const t = forLocale(locale);
            expect(describeColor(t, "red", "text", "text-clause")).toBe(
                describeColor(t, "red", "text"),
            );
            expect(
                describeColor(t, "red", "background", "background-clause"),
            ).not.toBe(describeColor(t, "red", "background"));
        },
    );

    /**
     * A postposition needs a noun to be said of, and `$background` renders as a
     * bare colour word. The five Cyrillic catalogs that phrase the background
     * with a postposition each supply that noun themselves — «фон» in `koi`,
     * `mdf`, `mrj` and `mns`, «ԓыпӑс» in `kca` — so the sentence is not the
     * colour alone standing in front of "on". Pinned because leaving the noun
     * out renders without any error at all: the message resolves, and only a
     * reader sees that it says "blue on red".
     */
    it.each([
        ["koi", "фон"],
        ["mdf", "фон"],
        ["mrj", "фон"],
        ["mns", "фон"],
        ["kca", "ԓыпӑс"],
    ])("names what %s's background postposition governs", (locale, head) => {
        const t = forLocale(locale);
        const sentence = describeText(t, {
            color: describeColor(t, "red", "text", "text-clause"),
            background: describeColor(
                t,
                "yellow",
                "background",
                "background-clause",
            ),
        });
        expect(sentence).toContain(head);
        // And only in the branch that has a background to name.
        expect(
            describeText(t, { color: describeColor(t, "red", "text") }),
        ).not.toContain(head);
    });

    /**
     * `fill-style`'s words carry their own "with" in five of these catalogs —
     * the comitative in the four Sami ones and in Võro — which is why
     * `style-filled` writes no preposition in front of them. That ending
     * belongs to the fill patterns and to nothing else: `line-style`'s words
     * stand attributively in front of a noun inside `style-stroke`, where a
     * "with" has nothing to be with. Kildin is what this pins — its `.dotted`
     * was the comitative «точкагуэйм», byte-identical to its own
     * `fill-style.dots`, which read as "thick with-dots red line".
     */
    it.each([
        ["sma", "jgujmie"],
        ["smj", "jn"],
        ["smn", "guin"],
        ["sms", "vuiʹm"],
        ["sjd", "гуэйм"],
        ["vro", "ga"],
    ])(
        "keeps %s's comitative ending out of its stroke adjectives",
        (locale, ending) => {
            const t = forLocale(locale);
            // The dash pattern alone, so that what is checked is the word
            // itself rather than the phrase it happens to sit in.
            const stroke = describeStrokedShape(
                t,
                { lineStyleWord: "dotted" },
                { noun: { key: "line" }, withNoun: false },
            );
            expect(stroke).not.toContain(ending);
            // The same ending is present where it belongs, which is what makes
            // this a claim about placement rather than about the ending being
            // absent from the catalog.
            expect(
                describeFill(
                    t,
                    { fillColorWord: "red", fillStyleWord: "dots" },
                    { filled: true },
                ),
            ).toContain(ending);
        },
    );
});

describe("the Oceania batch's word order", () => {
    /**
     * Eleven languages of one ocean and two orders — ten postnominal, one
     * prenominal — which is worth pinning for the reason the Austronesian
     * block above pins its own split: a region is not a word order, and here
     * neither is a *family*. Ten Austronesian catalogs put the adjectives
     * behind the noun, and `bi`, a creole whose lexifier is English, is the
     * one that puts them in front.
     *
     * The linker is the other half of the story. Two catalogs join adjective
     * to noun with a particle they write out themselves — `chk`'s relative
     * «mi» repeated before each modifier and `gil`'s singular linker «ae»
     * likewise — while the Polynesian catalogs use none at all. These strings
     * are what hold each choice, and each `content.ftl` header says why its
     * language needs the particle a neighbour does without.
     *
     * A few rows still render an English loan where a dictionary gave the
     * catalog nothing — `kos` and `gil` say so in their own headers — and the
     * words that *are* the language are pinned here beside the ones that are
     * not, so that replacing a loan is a visible diff rather than a silent
     * improvement.
     */
    const postnominal: [string, string, string][] = [
        ["mh", "laain m̧ijel m̧ōttanm̧ōttan būrōrō", "m̧ijel m̧ōttanm̧ōttan būrōrō"],
        ["chk", "nain mi wattee mi tass mi ppar", "wattee mi tass mi ppar"],
        ["pon", "lain mosul lepilep weitahta", "mosul lepilep weitahta"],
        ["kos", "line matoltol kotkot srusra", "matoltol kotkot srusra"],
        [
            "gil",
            "te line ae bubura ae dashed ae uraura",
            "bubura ae dashed ae uraura",
        ],
        ["niu", "laini matolu motumotu kula", "matolu motumotu kula"],
        ["tkl", "laina mafiafia motumotu kula", "mafiafia motumotu kula"],
        ["tvl", "laina matolu motumotu kula", "matolu motumotu kula"],
        [
            "rar",
            "rārangi mātotoru motumotu muramura",
            "mātotoru motumotu muramura",
        ],
        ["wls", "laina matolu motumotu kula", "matolu motumotu kula"],
    ];

    for (const [locale, withNoun, adjectivesOnly] of postnominal) {
        it(`puts ${locale}'s adjectives after the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The noun is prepended whole, with nothing of it reaching in
            // among the adjectives — including for the catalogs that put a
            // linker between the two, whose particle belongs to the adjective
            // run rather than to the noun.
            expect(withNoun.endsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    const prenominal: [string, string, string][] = [
        ["bi", "tik brokbrok red laen", "tik brokbrok red"],
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s adjectives in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            expect(withNoun.startsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    /**
     * The side count, where the batch stops agreeing with itself — and the
     * disagreement runs *inside* a subfamily rather than between them, which
     * no earlier batch's did.
     *
     * Eight of the eleven make the count a following clause and so reach
     * `[noun-tail]` — «e 5 ona tafa», «e 5 tapa tōna», «me pali 5», «mi 5
     * peekin» and the rest — while `mh`, `gil` and `tkl` fold it into the head
     * and leave `[tail]` empty. `tkl` is the sharp one: it is Tuvaluan's
     * closest relative in the batch, and its own header warns that the two are
     * expected to look alike, yet it heads the count («poligoni tutuha e 5 ona
     * itu …») where `tvl` tails it, so its adjectives trail the whole phrase.
     * `locales/tkl` and `locales/tvl` each state their choice, and these rows
     * are why a reviewer
     * can tell the difference is deliberate rather than an oversight in one of
     * them.
     *
     * `kos` and `gil` still hold an English «regular polygon» where their
     * dictionaries gave them no term, which is what the declared lexical debt
     * looks like at this call site.
     */
    it.each([
        ["mh", "polygon jejjet 5 kona m̧ijel m̧ōttanm̧ōttan būrōrō"],
        [
            "chk",
            "poriikon mi wewe fengen mi wattee mi tass mi ppar mi 5 peekin",
        ],
        ["pon", "poliken pahrek mosul lepilep weitahta me pali 5"],
        ["kos", "regular polygon matoltol kotkot srusra ma oasr siska 5"],
        ["gil", "te regular polygon ae 5 itera ae bubura ae dashed ae uraura"],
        ["niu", "polikone tatai matolu motumotu kula mo e 5 e tapa"],
        ["tkl", "poligoni tutuha e 5 ona itu mafiafia motumotu kula"],
        ["tvl", "poligona tutusa matolu motumotu kula e 5 ona tafa"],
        ["rar", "polygon ʻaiteite mātotoru motumotu muramura e 5 tapa tōna"],
        ["wls", "poligone tatau matolu motumotu kula ʻe tapa 5"],
        ["bi", "tik brokbrok red poligon we i gat 5 saed we oli sem mak"],
    ])(
        "places the side count where %s's grammar puts it",
        (locale, expected) => {
            expect(
                describeStrokedShape(forLocale(locale), words, {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                }),
            ).toBe(expected);
        },
    );

    /**
     * The same phrase again with the shape filled, which is where a catalog
     * can quietly disagree with itself. `style-with-noun` and
     * `style-filled-with-noun` are two separate messages, so a catalog that
     * reaches `[noun-tail]` has to place the tail the same way in both, or the
     * same polygon is assembled two ways in one language depending on nothing
     * but whether it is filled. `locales/pon` and `locales/kos` each said in
     * their headers that the tail closes the phrase and then placed it right
     * after the noun in the filled message; these rows are what holds the two
     * messages together.
     *
     * The fill pattern is asserted alongside, because `[pattern-tail]` is the
     * one branch carrying the tail *and* a trailing clause, and so the one
     * where an ordering mistake can survive the plain case.
     */
    it.each([
        [
            "mh",
            "polygon jejjet 5 kona obrak būļu",
            "polygon jejjet 5 kona obrak būļu kōn taim̧ōn ko",
        ],
        [
            "chk",
            "poriikon mi wewe fengen mi ur mi puruu mi 5 peekin",
            "poriikon mi wewe fengen mi ur mi puruu mi 5 peekin fiti taimon",
        ],
        [
            "pon",
            "poliken pahrek audaud pluh me pali 5",
            "poliken pahrek audaud pluh me pali 5 iangahki taimen",
        ],
        [
            "kos",
            "regular polygon sessesla folfol ma oasr siska 5",
            "regular polygon sessesla folfol ma oasr siska 5 ke diamond",
        ],
        [
            "gil",
            "te regular polygon ae 5 itera ae kanoaki ae buruu",
            "te regular polygon ae 5 itera ae kanoaki ae buruu ma taian diamond",
        ],
        [
            "niu",
            "polikone tatai puke lanu moana mo e 5 e tapa",
            "polikone tatai puke lanu moana mo e 5 e tapa mo e tau taimane",
        ],
        [
            "tkl",
            "poligoni tutuha e 5 ona itu fakatumu lanu moana",
            "poligoni tutuha e 5 ona itu fakatumu lanu moana ma te taimane",
        ],
        [
            "tvl",
            "poligona tutusa fakafonu lanu moana e 5 ona tafa",
            "poligona tutusa fakafonu lanu moana e 5 ona tafa mo taimane",
        ],
        [
            "rar",
            "polygon ʻaiteite kī ninamu e 5 tapa tōna",
            "polygon ʻaiteite kī ninamu e 5 tapa tōna ma taimana",
        ],
        [
            "wls",
            "poligone tatau fonu lanumoana ʻe tapa 5",
            "poligone tatau fonu lanumoana ʻe tapa 5 mo te taimane",
        ],
        [
            "bi",
            "fulap blu poligon we i gat 5 saed we oli sem mak",
            "fulap blu poligon we i gat 5 saed we oli sem mak wetem ol daemon",
        ],
    ])(
        "places the side count the same way in %s's filled phrase",
        (locale, plain, withPattern) => {
            const filled = {
                lineWidthWord: "",
                lineStyleWord: "",
                colorWord: "blue",
                fillColorWord: "blue",
                fillStyleWord: "",
            };
            const noun = { key: "regular-polygon", numSides: 5 } as const;
            expect(
                describeClosedShape(forLocale(locale), filled, {
                    filled: true,
                    noun,
                    withNoun: true,
                }),
            ).toBe(plain);
            expect(
                describeClosedShape(
                    forLocale(locale),
                    { ...filled, fillStyleWord: "diamonds" },
                    { filled: true, noun, withNoun: true },
                ),
            ).toBe(withPattern);
        },
    );
});

describe("the Silk Road batch's word order", () => {
    /**
     * Fifteen languages of one corridor and two orders, and the line between
     * them is neither geography nor family — it is **whether a language builds
     * its noun phrase with an ezafe**.
     *
     * Eleven catalogs put the modifiers in front of the noun. Five of those
     * are Turkic (`crh`, `gag`, `kaa`, `kjh`, `alt`), which is expected: every
     * Turkic language is left-branching, and each of those five headers says
     * so in the same words. The other six are the interesting ones. `dng` is
     * Sinitic and joins modifier to noun with the attributive particle
     * «ди» — a word of its own, never welded to a placeable. `sgh` and `wbl`
     * are Iranian and prenominal anyway: `locales/sgh`'s header calls this
     * "the one place this is not Tajik", since Shughni stacks adjectives where
     * Tajik would reach for the izafat. `bal` is Iranian too, and its header
     * says the prenominal order carries the attributive `-ēn` on the
     * **adjective**, which is why nothing in that file is welded to `$noun`
     * either.
     *
     * `mzn` and `glk` are the pair worth reading the headers for. Both are
     * Caspian, both are **head-final**, and both are written almost entirely in
     * Persian vocabulary — so each file looks like `fa` word for word and is
     * its exact reverse in arrangement. `locales/mzn`'s header states it
     * outright: `style-with-noun` reads `{ $description } { $noun }`, "the
     * English order, arrived at from the other direction, and the exact reverse
     * of what `fa` writes". The `fa` row below is asserted beside them so the
     * reversal is visible rather than asserted in prose.
     *
     * Four catalogs put the modifiers after the noun, and all four are ezafe
     * languages: `ttt` (Muslim Tat, repeating «-i» before every modifier),
     * `lrc` (Northern Luri, whose header calls the language head-initial and
     * reverses English's adjective order to match), `haz` (Hazaragi, a Persian
     * variety, with the ezafe an unwritten vowel after a consonant) and `zza`
     * (Zazaki, whose ezafe is a bound vowel that cannot be welded onto
     * `{ $noun }` — so every entry in its `noun` table is written with the
     * ezafe already on it).
     */
    const prenominal: [string, string, string][] = [
        [
            "crh",
            "qal\u0131n kesikli q\u0131rm\u0131z\u0131 do\u011fru",
            "qal\u0131n kesikli q\u0131rm\u0131z\u0131",
        ],
        [
            "gag",
            "kal\u0131n kesikli k\u0131rm\u0131z\u0131 dooru",
            "kal\u0131n kesikli k\u0131rm\u0131z\u0131",
        ],
        [
            "kaa",
            "qal\u0131\u0144 \u00fazik-\u00fazik q\u0131z\u0131l tuwr\u0131 s\u0131z\u0131q",
            "qal\u0131\u0144 \u00fazik-\u00fazik q\u0131z\u0131l",
        ],
        [
            "kjh",
            "\u0447\u043e\u043e\u043d \u04f1\u0437\u0456\u043a-\u04f1\u0437\u0456\u043a \u0445\u044b\u0437\u044b\u043b \u0442\u04f1\u0441 \u0441\u044b\u0437\u044b\u0445",
            "\u0447\u043e\u043e\u043d \u04f1\u0437\u0456\u043a-\u04f1\u0437\u0456\u043a \u0445\u044b\u0437\u044b\u043b",
        ],
        [
            "alt",
            "\u0458\u043e\u043e\u043d \u04f1\u0437\u04f1\u043a-\u04f1\u0437\u04f1\u043a \u043a\u044b\u0437\u044b\u043b \u0442\u04f1\u0441 \u0441\u044b\u0437\u044b\u043a",
            "\u0458\u043e\u043e\u043d \u04f1\u0437\u04f1\u043a-\u04f1\u0437\u04f1\u043a \u043a\u044b\u0437\u044b\u043b",
        ],
        [
            "mzn",
            "\u06a9\u064f\u0644\u0641\u062a \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0650\u0631\u062e \u062e\u0637",
            "\u06a9\u064f\u0644\u0641\u062a \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0650\u0631\u062e",
        ],
        [
            "glk",
            "\u0636\u062e\u06cc\u0645 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0648\u0631\u062e \u062e\u0637",
            "\u0636\u062e\u06cc\u0645 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0648\u0631\u062e",
        ],
        [
            "dng",
            "\u0446\u0443 \u043f\u0443\u043d\u043a\u0442\u0438\u0440\u043d\u044b\u0439 \u0445\u0443\u043d \u0434\u0438 \u0441\u044f\u043d",
            "\u0446\u0443 \u043f\u0443\u043d\u043a\u0442\u0438\u0440\u043d\u044b\u0439 \u0445\u0443\u043d",
        ],
        [
            "sgh",
            "\u0493\u0430\u0444\u0441 \u0445\u0430\u0442-\u0445\u0430\u0442 \u0441\u0443\u0440\u0445 \u0445\u0430\u0442",
            "\u0493\u0430\u0444\u0441 \u0445\u0430\u0442-\u0445\u0430\u0442 \u0441\u0443\u0440\u0445",
        ],
        ["wbl", "mota dash-dor surkh khat", "mota dash-dor surkh"],
        [
            "bal",
            "\u0633\u062a\u0628\u0631\u06cc\u06ba \u062e\u0637 \u0686\u06cc\u0646\u06cc\u06ba \u0633\u06c1\u0631\u06cc\u06ba \u062e\u0637",
            "\u0633\u062a\u0628\u0631\u06cc\u06ba \u062e\u0637 \u0686\u06cc\u0646\u06cc\u06ba \u0633\u06c1\u0631\u06cc\u06ba",
        ],
    ];

    for (const [locale, withNoun, adjectivesOnly] of prenominal) {
        it(`puts ${locale}'s adjectives in front of the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The noun is appended whole, with nothing of it reaching in among
            // the adjectives — including for `dng`, whose «ди» belongs to the
            // join rather than to either side.
            expect(withNoun.startsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    const postnominal: [string, string, string][] = [
        [
            "ttt",
            "x\u0259tt-i kuluft-i k\u0259sik-i s\u00fcrx",
            "kuluft-i k\u0259sik-i s\u00fcrx",
        ],
        [
            "lrc",
            "\u062e\u0637 \u0633\u0648\u0631 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0636\u062e\u06cc\u0645",
            "\u0633\u0648\u0631 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0636\u062e\u06cc\u0645",
        ],
        [
            "haz",
            "\u062e\u0637 \u0633\u0631\u062e \u062e\u0637\u200c\u062e\u0637 \u0633\u062a\u0628\u0631",
            "\u0633\u0631\u062e \u062e\u0637\u200c\u062e\u0637 \u0633\u062a\u0628\u0631",
        ],
        [
            "zza",
            "xeto s\u00fbr qutbirr st\u00fbr",
            "s\u00fbr qutbirr st\u00fbr",
        ],
    ];

    for (const [locale, withNoun, adjectivesOnly] of postnominal) {
        it(`puts ${locale}'s adjectives after the noun`, () => {
            const t = forLocale(locale);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: true,
                }),
            ).toBe(withNoun);
            // The ezafe rides on the noun rather than on the adjective run, so
            // the description is still the tail of the phrase verbatim — which
            // is what would break if a catalog started welding a linker onto
            // `{ $description }`.
            expect(withNoun.endsWith(adjectivesOnly)).toBe(true);
            expect(
                describeStrokedShape(t, words, {
                    noun: { key: "line" },
                    withNoun: false,
                }),
            ).toBe(adjectivesOnly);
        });
    }

    /**
     * Mazanderani and Gilaki against the Persian they borrow their words from.
     * Every content word in these three phrases is Persian or a Caspian
     * cognate of one, and the three arrangements are not the same: `fa` leads
     * with «خط» and trails the adjectives, `mzn` and `glk` stack the
     * adjectives first and end on «خط». A reviewer replacing Persian loans with
     * native words in either catalog must not also "fix" the order back toward
     * `fa`, and this is the row that says so.
     */
    it("reverses Persian's order in the two Caspian catalogs", () => {
        const persian = describeStrokedShape(forLocale("fa"), words, {
            noun: { key: "line" },
            withNoun: true,
        });
        expect(persian).toBe(
            "\u062e\u0637 \u0642\u0631\u0645\u0632 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0636\u062e\u06cc\u0645",
        );
        // Persian leads with the noun; both Caspian catalogs end with it.
        for (const locale of ["mzn", "glk"]) {
            const phrase = describeStrokedShape(forLocale(locale), words, {
                noun: { key: "line" },
                withNoun: true,
            });
            expect(phrase.startsWith("خط")).toBe(false);
            expect(phrase.endsWith("خط")).toBe(true);
        }
        expect(persian.startsWith("خط")).toBe(true);
    });

    /**
     * The side count, where the batch splits along a *different* line than the
     * adjectives do — which is the fact this block exists to catch.
     *
     * Eleven catalogs leave `[noun-tail]` empty and fold the count into the
     * head: «düzgün 5 köşeli poligon», «{ $numSides } бян ди правильный
     * многоугольник», «{ $numSides }-tarafa regular polygon». Several headers
     * say so in as many words — `locales/kaa`'s and `locales/kjh`'s both
     * explain that the count "goes in front of the noun with the rest of the
     * modifiers, so the whole phrase is one head", and `locales/wbl`'s says
     * "`[noun-tail]` is unused".
     *
     * Four use the tail — and they are **not** the four postnominal catalogs.
     * `bal` stacks its adjectives in front and still tails the count («گون 5
     * پہلوان»), while `ttt` trails its adjectives and still heads the count
     * («poliqoni münəzzəm ba 5 tərəf»). So the two choices are independent, and
     * a change to one catalog's adjective order must not be assumed to imply
     * the other.
     *
     * `wbl` still renders an English «regular polygon» where its dictionary
     * gave it no term, and `dng` an English «правильный многоугольник» inside a
     * Dungan frame — both headers declare the debt — so the loans are pinned
     * here beside the words that are the language, and replacing one is a
     * visible diff.
     */
    it.each([
        [
            "crh",
            "qal\u0131n kesikli q\u0131rm\u0131z\u0131 d\u00fczg\u00fcn 5 k\u00f6\u015feli poligon",
        ],
        [
            "gag",
            "kal\u0131n kesikli k\u0131rm\u0131z\u0131 5 k\u00f6\u0219eli d\u00fczg\u00fcn poligon",
        ],
        [
            "kaa",
            "qal\u0131\u0144 \u00fazik-\u00fazik q\u0131z\u0131l dur\u0131s 5 m\u00fayeshlik",
        ],
        [
            "kjh",
            "\u0447\u043e\u043e\u043d \u04f1\u0437\u0456\u043a-\u04f1\u0437\u0456\u043a \u0445\u044b\u0437\u044b\u043b \u0442\u0438\u04a3 5 \u043f\u0443\u043b\u0443\u04a3\u043d\u044b\u0433",
        ],
        [
            "alt",
            "\u0458\u043e\u043e\u043d \u04f1\u0437\u04f1\u043a-\u04f1\u0437\u04f1\u043a \u043a\u044b\u0437\u044b\u043b \u0442\u04f1\u04a5\u0435\u0439 5 \u043c\u04f1\u0439\u04f1\u0448\u0442\u04f1",
        ],
        [
            "mzn",
            "\u06a9\u064f\u0644\u0641\u062a \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0650\u0631\u062e 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645",
        ],
        [
            "glk",
            "\u0636\u062e\u06cc\u0645 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0633\u0648\u0631\u062e 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645",
        ],
        [
            "dng",
            "\u0446\u0443 \u043f\u0443\u043d\u043a\u0442\u0438\u0440\u043d\u044b\u0439 \u0445\u0443\u043d \u0434\u0438 5 \u0431\u044f\u043d \u0434\u0438 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043c\u043d\u043e\u0433\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
        ],
        [
            "sgh",
            "\u0493\u0430\u0444\u0441 \u0445\u0430\u0442-\u0445\u0430\u0442 \u0441\u0443\u0440\u0445 5-\u0442\u0430\u0440\u0430\u0444\u0430 \u043c\u0443\u043d\u0442\u0430\u0437\u0430\u043c \u0431\u0438\u0441\u0451\u0440\u043a\u0443\u043d\u04b7\u0430",
        ],
        ["wbl", "mota dash-dor surkh 5-tarafa regular polygon"],
        [
            "bal",
            "\u0633\u062a\u0628\u0631\u06cc\u06ba \u062e\u0637 \u0686\u06cc\u0646\u06cc\u06ba \u0633\u06c1\u0631\u06cc\u06ba \u0628\u0627\u0642\u0627\u0639\u062f\u06c1 \u0686\u0646\u062f \u067e\u06c1\u0644\u0648 \u06af\u0648\u0646 5 \u067e\u06c1\u0644\u0648\u0627\u0646",
        ],
        [
            "ttt",
            "poliqoni m\u00fcn\u0259zz\u0259m ba 5 t\u0259r\u0259f-i kuluft-i k\u0259sik-i s\u00fcrx",
        ],
        [
            "lrc",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645 \u0633\u0648\u0631 \u062e\u0637\u200c\u0686\u06cc\u0646 \u0636\u062e\u06cc\u0645 \u0628\u0627 5 \u062a\u0627 \u0636\u0644\u0639",
        ],
        [
            "haz",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc\u0650 \u0645\u0646\u0638\u0645 \u0633\u0631\u062e \u062e\u0637\u200c\u062e\u0637 \u0633\u062a\u0628\u0631 \u0642\u062f 5 \u0636\u0644\u0639",
        ],
        [
            "zza",
            "zafgo\u015feyo muntezem s\u00fbr qutbirr st\u00fbr bi 5 kenaran",
        ],
    ])(
        "places the side count where %s's grammar puts it",
        (locale, expected) => {
            expect(
                describeStrokedShape(forLocale(locale), words, {
                    noun: { key: "regular-polygon", numSides: 5 },
                    withNoun: true,
                }),
            ).toBe(expected);
        },
    );

    /**
     * The same phrase again with the shape filled, which is where a catalog can
     * quietly disagree with itself: `style-with-noun` and
     * `style-filled-with-noun` are two separate messages, so a catalog that
     * reaches `[noun-tail]` has to place the tail the same way in both, or one
     * polygon is assembled two ways in one language depending on nothing but
     * whether it is filled.
     *
     * The fill pattern is asserted alongside, because `[pattern-tail]` is the
     * one branch carrying the tail *and* a trailing clause, and so the one
     * where an ordering mistake can survive the plain case. Three of the
     * postpositional catalogs are the ones to watch: `alt` moves the whole
     * «{ $pattern } биле» phrase to the **front** because «биле» follows its
     * noun, where `sgh` and `dng` trail it after a comma.
     */
    it.each([
        [
            "crh",
            "mavi tol\u011fan d\u00fczg\u00fcn 5 k\u00f6\u015feli poligon",
            "romb\u00e7\u0131qlar desenli mavi tol\u011fan d\u00fczg\u00fcn 5 k\u00f6\u015feli poligon",
        ],
        [
            "gag",
            "mavi dolu 5 k\u00f6\u0219eli d\u00fczg\u00fcn poligon",
            "romblar desenli mavi dolu 5 k\u00f6\u0219eli d\u00fczg\u00fcn poligon",
        ],
        [
            "kaa",
            "k\u00f3k boyal\u01f5an dur\u0131s 5 m\u00fayeshlik",
            "romblar menen k\u00f3k boyal\u01f5an dur\u0131s 5 m\u00fayeshlik",
        ],
        [
            "kjh",
            "\u043a\u04e7\u043a \u0431\u0443\u0434\u0430\u043b\u0493\u0430\u043d \u0442\u0438\u04a3 5 \u043f\u0443\u043b\u0443\u04a3\u043d\u044b\u0433",
            "\u0440\u043e\u043c\u0431\u0442\u0430\u0440 \u043d\u0435\u04a3 \u043a\u04e7\u043a \u0431\u0443\u0434\u0430\u043b\u0493\u0430\u043d \u0442\u0438\u04a3 5 \u043f\u0443\u043b\u0443\u04a3\u043d\u044b\u0433",
        ],
        [
            "alt",
            "\u043a\u04e7\u043a \u0431\u0443\u0434\u0430\u043b\u0433\u0430\u043d \u0442\u04f1\u04a5\u0435\u0439 5 \u043c\u04f1\u0439\u04f1\u0448\u0442\u04f1",
            "\u0440\u043e\u043c\u0431\u0442\u043e\u0440 \u0431\u0438\u043b\u0435 \u043a\u04e7\u043a \u0431\u0443\u0434\u0430\u043b\u0433\u0430\u043d \u0442\u04f1\u04a5\u0435\u0439 5 \u043c\u04f1\u0439\u04f1\u0448\u0442\u04f1",
        ],
        [
            "mzn",
            "\u062a\u0648\u067e\u0631 \u0622\u0628\u06cc 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645",
            "\u062a\u0648\u067e\u0631 \u0622\u0628\u06cc 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645 \u0628\u0627 \u0644\u0648\u0632\u06cc\u200c\u0648\u0646 \u0646\u0642\u0634",
        ],
        [
            "glk",
            "\u0622\u0628\u06cc \u062a\u0648\u067e\u0631 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645",
            "\u0644\u0648\u0632\u06cc\u200c\u0627\u0646 \u0647\u0645\u0631\u0627\u0647 \u0622\u0628\u06cc \u062a\u0648\u067e\u0631 5 \u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645",
        ],
        [
            "dng",
            "\u0442\u044f\u043d\u043c\u0430\u043d \u043b\u0430\u043d \u0434\u0438 5 \u0431\u044f\u043d \u0434\u0438 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043c\u043d\u043e\u0433\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a",
            "\u0442\u044f\u043d\u043c\u0430\u043d \u043b\u0430\u043d \u0434\u0438 5 \u0431\u044f\u043d \u0434\u0438 \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u044b\u0439 \u043c\u043d\u043e\u0433\u043e\u0443\u0433\u043e\u043b\u044c\u043d\u0438\u043a, \u044e\u04a3 \u0440\u043e\u043c\u0431 \u0442\u044f\u043d \u0434\u0438",
        ],
        [
            "sgh",
            "\u043f\u0443\u0440\u0448\u0443\u0434\u0430 \u043a\u0430\u0431\u0443\u0434 5-\u0442\u0430\u0440\u0430\u0444\u0430 \u043c\u0443\u043d\u0442\u0430\u0437\u0430\u043c \u0431\u0438\u0441\u0451\u0440\u043a\u0443\u043d\u04b7\u0430",
            "\u043f\u0443\u0440\u0448\u0443\u0434\u0430 \u043a\u0430\u0431\u0443\u0434 5-\u0442\u0430\u0440\u0430\u0444\u0430 \u043c\u0443\u043d\u0442\u0430\u0437\u0430\u043c \u0431\u0438\u0441\u0451\u0440\u043a\u0443\u043d\u04b7\u0430, \u0431\u043e \u043d\u0430\u049b\u0448\u0438 \u0440\u043e\u043c\u0431\u04b3\u043e",
        ],
        [
            "wbl",
            "pur nila 5-tarafa regular polygon",
            "pur nila 5-tarafa regular polygon ba diamond",
        ],
        [
            "bal",
            "\u067e\u064f\u0631\u06cc\u06ba \u06a9\u0628\u0648\u062f\u06cc\u06ba \u0628\u0627\u0642\u0627\u0639\u062f\u06c1 \u0686\u0646\u062f \u067e\u06c1\u0644\u0648 \u06af\u0648\u0646 5 \u067e\u06c1\u0644\u0648\u0627\u0646",
            "\u067e\u064f\u0631\u06cc\u06ba \u06a9\u0628\u0648\u062f\u06cc\u06ba \u0628\u0627\u0642\u0627\u0639\u062f\u06c1 \u0686\u0646\u062f \u067e\u06c1\u0644\u0648 \u06af\u0648\u0646 5 \u067e\u06c1\u0644\u0648\u0627\u0646 \u06af\u0648\u0646 \u0627\u0644\u0645\u0627\u0633",
        ],
        [
            "ttt",
            "poliqoni m\u00fcn\u0259zz\u0259m ba 5 t\u0259r\u0259f-i pur-i kabud",
            "poliqoni m\u00fcn\u0259zz\u0259m ba 5 t\u0259r\u0259f-i pur-i kabud ba rombho",
        ],
        [
            "lrc",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645 \u0622\u0628\u06cc \u062a\u0648\u067e\u0631 \u0628\u0627 5 \u062a\u0627 \u0636\u0644\u0639",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc \u0645\u0646\u062a\u0638\u0645 \u0622\u0628\u06cc \u062a\u0648\u067e\u0631 \u0628\u0627 5 \u062a\u0627 \u0636\u0644\u0639 \u0628\u0627 \u0646\u0642\u0634 \u0644\u0648\u0632\u06cc\u200c\u06cc\u0644",
        ],
        [
            "haz",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc\u0650 \u0645\u0646\u0638\u0645 \u0622\u0628\u06cc \u067e\u064f\u0631 \u0642\u062f 5 \u0636\u0644\u0639",
            "\u0686\u0646\u062f\u0636\u0644\u0639\u06cc\u0650 \u0645\u0646\u0638\u0645 \u0622\u0628\u06cc \u067e\u064f\u0631 \u0642\u062f 5 \u0636\u0644\u0639 \u0642\u062f \u0627\u0644\u0645\u0627\u0633\u200c\u0647\u0627",
        ],
        [
            "zza",
            "zafgo\u015feyo muntezem kewe p\u0131rr bi 5 kenaran",
            "zafgo\u015feyo muntezem kewe p\u0131rr bi 5 kenaran bi elmas\u00ee",
        ],
    ])(
        "places the side count the same way in %s's filled phrase",
        (locale, plain, withPattern) => {
            const filled = {
                lineWidthWord: "",
                lineStyleWord: "",
                colorWord: "blue",
                fillColorWord: "blue",
                fillStyleWord: "",
            };
            const noun = { key: "regular-polygon", numSides: 5 } as const;
            expect(
                describeClosedShape(forLocale(locale), filled, {
                    filled: true,
                    noun,
                    withNoun: true,
                }),
            ).toBe(plain);
            expect(
                describeClosedShape(
                    forLocale(locale),
                    { ...filled, fillStyleWord: "diamonds" },
                    { filled: true, noun, withNoun: true },
                ),
            ).toBe(withPattern);
        },
    );
});
