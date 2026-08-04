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

/** One whose adjectives follow the noun rather than preceding it. */
const ar: Translator = createTranslatorFromLocaleData(
    { locale: "ar", resources: { ar: readCatalog("ar", "content") } },
    "ar",
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

    /**
     * Filipino joins a numeral to the noun it counts with a linker, and which
     * linker it is depends on how the numeral is *said*: `-ng` after a vowel,
     * the separate `na` after a consonant. That is exactly the split CLDR
     * gives `fil` its two plural categories on, so the side count selects on
     * itself — `other` is 4, 6, 9 and anything ending in them, and `one` is
     * everything else, including 5.
     */
    it("picks the Filipino linker from the side count", () => {
        const fil: Translator = createTranslatorFromLocaleData(
            {
                locale: "fil",
                resources: { fil: readCatalog("fil", "content") },
            },
            "fil",
        );
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
    const tg: Translator = createTranslatorFromLocaleData(
        { locale: "tg", resources: { tg: readCatalog("tg", "content") } },
        "tg",
    );

    // Tajik is Persian in Cyrillic, so its adjectives follow the noun and the
    // link between them is the izafat. Persian's is an unwritten vowel after a
    // consonant and the space carries it; Tajik writes it as «-и», the same
    // «-и» whatever the word ends in, so `style-with-noun` welds it onto the
    // placeable. That is allowed for the reason `{ $numSides }-kulmio` is
    // allowed in Finnish — the ending is adjacent to the word rather than
    // agreeing with it — and this is what holds it: the same suffix lands on a
    // consonant-final «хат» and a vowel-final «доира» without changing shape.
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
        ).toBe("хати сурх хат-хат ғафс");
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
        ).toBe("доираи пуршудаи кабуд бо ҳошияи сиёҳ ғафс");
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
        ).toBe("бисёркунҷаи мунтазами сурх ғафс бо 5 тараф");
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
    const sw: Translator = createTranslatorFromLocaleData(
        { locale: "sw", resources: { sw: readCatalog("sw", "content") } },
        "sw",
    );

    const words = {
        lineWidthWord: "thick",
        lineStyleWord: "dashed",
        colorWord: "red",
    };

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
    const gu = forLocale("gu");
    const pa = forLocale("pa");
    const sw = forLocale("sw");
    const zu = forLocale("zu");
    const et = forLocale("et");
    const bg = forLocale("bg");
    const ka = forLocale("ka");

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
        for (const t of [de, ru, pl, hi, mr, et]) {
            const border = bothBorderForms(t);
            expect(border.embedded).not.toContain(border.standalone);
        }
        // Hindi and Gujarati are absent here on purpose: both have a feminine
        // background whose colour is spelled alike in the two positions, per
        // the cases above. Marathi spells its feminine oblique differently and
        // so belongs here, and so does Punjabi, whose background is masculine.
        // Estonian belongs here too: its background goes adessive, and Georgian
        // because its background is the one position that truncates.
        for (const t of [de, ru, pl, mr, pa, et, ka]) {
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
