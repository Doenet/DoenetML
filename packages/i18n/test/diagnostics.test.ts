import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
    DIAGNOSTIC_CODES,
    DIAGNOSTIC_CODE_PATTERN,
    createDiagnosticFormatter,
    formatEnglishDiagnostic,
    isDiagnosticCode,
    type DiagnosticCode,
} from "../src/diagnostics";
import { EN_CATALOGS } from "../src/catalogs";
import { createChromeTranslator } from "../src/chrome";
import esDiagnostics from "../locales/es/diagnostics.ftl?raw";
import { createTranslator, type Translator } from "../src/translator";
import { extractKeys } from "../scripts/catalogUtils";

const LOCK_FILE = path.join(__dirname, "..", "diagnostic-codes.lock.json");

/**
 * Spanish diagnostics, handed over the way a host hands over a loaded catalog.
 *
 * No translation is inlined, so this is the route every language other than
 * English takes to the chrome — `useLocaleCatalogs` supplies exactly this at
 * runtime.
 */
const ES = { es: esDiagnostics };

/** A translator over a locale supplied inline, English behind it. */
function translatorFor(locale: string, source: string) {
    return createTranslator([locale], { [locale]: source });
}

const es = translatorFor(
    "es",
    fs.readFileSync(
        path.join(__dirname, "..", "locales", "es", "diagnostics.ftl"),
        "utf-8",
    ),
);

describe("the diagnostic code registry", () => {
    it("gives every code a well-formed name", () => {
        for (const code of Object.keys(DIAGNOSTIC_CODES)) {
            expect(code, code).toMatch(DIAGNOSTIC_CODE_PATTERN);
        }
    });

    it("never points two codes at the same message", () => {
        const keys = Object.values(DIAGNOSTIC_CODES);
        expect(new Set(keys).size).toBe(keys.length);
    });

    it("points every code at a message English defines", () => {
        // `diagnostics` specifically, not every catalog: a coded message
        // belongs in the namespace the main thread loads to render one
        // (`CHROME_NAMESPACES`). A key that drifted into `content` or
        // `editor` would still resolve in English — the built-in English
        // catalogs are appended whole — and then silently fall back to
        // English in every other locale, because those namespaces are not
        // shipped to the surface that renders diagnostics.
        const englishKeys = new Set(extractKeys(EN_CATALOGS.diagnostics));
        for (const [code, key] of Object.entries(DIAGNOSTIC_CODES)) {
            expect(englishKeys.has(key), `${code} → ${key}`).toBe(true);
        }
    });

    it("renders every registered code as a message, not as its own name", () => {
        // `formatEnglishDiagnostic` returns the code itself when it cannot
        // resolve one, so a code whose key the runtime translator does not
        // carry would pass the check above and still surface as
        // "doenet-w0100" on screen.
        for (const code of Object.keys(DIAGNOSTIC_CODES) as DiagnosticCode[]) {
            expect(formatEnglishDiagnostic(code), code).not.toBe(code);
        }
    });

    it("recognizes its own codes and nothing else", () => {
        expect(isDiagnosticCode("doenet-w0001")).toBe(true);
        expect(isDiagnosticCode("doenet-w9999")).toBe(false);
        expect(isDiagnosticCode("toString")).toBe(false);
    });

    // The guarantee that makes a code citable: it names one situation forever.
    // `lint:i18n` enforces this too; asserting it here means a renumbering
    // shows up in the test run rather than only in CI's lint step.
    it("has issued every locked code for the message it still names", () => {
        const locked: Record<string, string> = JSON.parse(
            fs.readFileSync(LOCK_FILE, "utf-8"),
        );
        for (const [code, key] of Object.entries(locked)) {
            expect(
                DIAGNOSTIC_CODES[code as DiagnosticCode],
                `${code} was issued for "${key}"`,
            ).toBe(key);
        }
    });

    it("has locked every code it defines", () => {
        const locked: Record<string, string> = JSON.parse(
            fs.readFileSync(LOCK_FILE, "utf-8"),
        );
        for (const code of Object.keys(DIAGNOSTIC_CODES)) {
            expect(Object.keys(locked), code).toContain(code);
        }
    });
});

describe("formatEnglishDiagnostic", () => {
    it("renders a message with no arguments", () => {
        expect(formatEnglishDiagnostic("doenet-w0006")).toBe(
            "numDimensions mismatch in ray.",
        );
    });

    it("substitutes named arguments", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0004", {
                variable1: "x",
                variable2: "y",
            }),
        ).toBe("Invalid format for equation of line in variables x and y.");
    });

    // The English these replaced was assembled by hand in the worker — the
    // serial comma, the "and", and the verb agreement all written out. Each of
    // these is one of that helper's branches.
    it("agrees the verb with a one-item list", () => {
        expect(
            formatEnglishDiagnostic("doenet-i0001", { attributes: ["slope"] }),
        ).toBe("slope is ignored when two endpoints are specified");
    });

    it("joins a two-item list with `and`", () => {
        expect(
            formatEnglishDiagnostic("doenet-i0001", {
                attributes: ["slope", "length"],
            }),
        ).toBe("slope and length are ignored when two endpoints are specified");
    });

    it("keeps the serial comma in a three-item list", () => {
        expect(
            formatEnglishDiagnostic("doenet-i0003", {
                attributes: ["slope", "length", "midpointOffset"],
            }),
        ).toBe(
            "slope, length, and midpointOffset are ignored when an endpoint and a midpoint are both specified",
        );
    });

    // The worker's call sites are untyped JavaScript, so a typo'd code reaches
    // here at runtime. `lint:i18n` is what catches it; in the meantime it must
    // not take a state-variable definition down.
    it("renders an unregistered code as itself rather than throwing", () => {
        expect(formatEnglishDiagnostic("doenet-w9999" as DiagnosticCode)).toBe(
            "doenet-w9999",
        );
    });

    // The registry is a plain object, so a code naming something on
    // `Object.prototype` looks registered to a `!== undefined` check and
    // resolves to a function. Only an own-property test rules it out.
    it("does not mistake an inherited property for a registered code", () => {
        for (const code of ["toString", "constructor", "__proto__"]) {
            expect(formatEnglishDiagnostic(code as DiagnosticCode), code).toBe(
                code,
            );
        }
    });

    it("enumerates a `unit` list without conjoining it", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0003", {
                variables: { list: ["x", "y", "z"], type: "unit" },
            }),
        ).toBe("Line is through points that depend on variables: x, y, z.");
    });

    // The worker's call sites are untyped JavaScript, and this runs where the
    // state variable raises the diagnostic: an argument of the wrong shape —
    // or a whole bag of them that isn't there — has to produce a wrong-looking
    // message, not a `TypeError` out of a definition. Each case below is one
    // way `lowerArgs` would otherwise reach a method on a value that has none.
    it.each([
        ["a null bag of arguments", null],
        ["a missing value", { attributes: undefined }],
        ["a null value", { attributes: null }],
        ["a non-list object", { attributes: { name: "slope" } }],
        ["a list of non-strings", { attributes: [1, 2] }],
        [
            "a list under a bogus join type",
            {
                attributes: { list: ["slope"], type: "sentence" },
            },
        ],
    ])("survives %s", (_label, args) => {
        expect(() =>
            formatEnglishDiagnostic(
                "doenet-i0001",
                args as unknown as Parameters<
                    typeof formatEnglishDiagnostic
                >[1],
            ),
        ).not.toThrow();
    });

    it("renders a code left off the call site as text rather than nothing", () => {
        expect(
            formatEnglishDiagnostic(undefined as unknown as DiagnosticCode),
        ).toBe("undefined");
    });
});

describe("the path the viewer actually takes", () => {
    // `DocViewer` builds its formatter over `createChromeTranslator`, fed by
    // whatever `useLocaleCatalogs` has loaded — not over a translator
    // assembled in a test. Handing the catalog over the same way is what makes
    // this cover the route a reader actually takes.
    it("resolves a loaded locale's diagnostics through the chrome translator", () => {
        const format = createDiagnosticFormatter(
            createChromeTranslator("es", ES),
            "es",
        );
        expect(
            format({
                message: "numDimensions mismatch in vector.",
                code: "doenet-w0008",
            }),
        ).toBe("Discrepancia de numDimensions en el vector.");
    });

    it("leaves English alone through the same path", () => {
        const format = createDiagnosticFormatter(
            createChromeTranslator("en"),
            "en",
        );
        expect(
            format({
                message: "numDimensions mismatch in vector.",
                code: "doenet-w0008",
            }),
        ).toBe("numDimensions mismatch in vector.");
    });
});

describe("createDiagnosticFormatter", () => {
    const formatEs = createDiagnosticFormatter(es, "es");

    it("renders a coded diagnostic in the negotiated locale", () => {
        expect(
            formatEs({
                message: "numDimensions mismatch in ray.",
                code: "doenet-w0006",
            }),
        ).toBe("Discrepancia de numDimensions en la semirrecta.");
    });

    it("agrees the verb and joins the list the target language's way", () => {
        expect(
            formatEs({
                message:
                    "slope and length are ignored when two endpoints are specified",
                code: "doenet-i0001",
                args: { attributes: ["slope", "length"] },
            }),
        ).toBe(
            "slope y length se ignoran cuando se especifican los dos extremos",
        );
    });

    it("keeps a singular list singular", () => {
        expect(
            formatEs({
                message: "slope is ignored when two endpoints are specified",
                code: "doenet-i0001",
                args: { attributes: ["slope"] },
            }),
        ).toBe("slope se ignora cuando se especifican los dos extremos");
    });

    it("leaves a record with no code exactly as it arrived", () => {
        const legacy = { message: "Invalid type for answer: nonsense" };
        expect(formatEs(legacy)).toBe("Invalid type for answer: nonsense");
    });

    it("falls back to the English on the record for an unknown code", () => {
        expect(
            formatEs({ message: "Something went wrong", code: "doenet-w9999" }),
        ).toBe("Something went wrong");
    });

    // A locale that translates only some of the catalog is legitimate, and the
    // untranslated half has to keep rendering rather than showing a bare key.
    it("falls back to the English for a code the locale hasn't translated", () => {
        const partial = createDiagnosticFormatter(
            translatorFor("fr", "ray-dimension-mismatch = Décalage."),
            "fr",
        );
        expect(
            partial({
                message: "Line through points of undetermined dimensions.",
                code: "doenet-w0001",
            }),
        ).toBe("Line through points of undetermined dimensions.");
    });

    // The list is joined outside Fluent, so nothing but this makes it follow
    // the message: a French reader whose catalog hasn't reached this code gets
    // the English sentence, and "slope et length are ignored" would be neither
    // language.
    it("joins a list in the language of the message that answered", () => {
        const partial = createDiagnosticFormatter(
            translatorFor("fr", "ray-dimension-mismatch = Décalage."),
            "fr",
        );
        expect(
            partial({
                message:
                    "slope and length are ignored when two endpoints are specified",
                code: "doenet-i0001",
                args: { attributes: ["slope", "length"] },
            }),
        ).toBe("slope and length are ignored when two endpoints are specified");
    });

    // `en_US` is the POSIX spelling of a locale tag and the usual way a host
    // gets one wrong. `normalizeLocaleTag` passes it through untouched and
    // negotiation keeps it, because rewriting it would stop the host's own
    // catalog from being found — so it reaches `Intl`, which refuses it, on
    // both sides at once: `Intl.ListFormat` here, and `Intl.PluralRules` inside
    // Fluent for the plural selector every list message has. Either one taking
    // the diagnostic down, or resolving it to `{???}`, would do so on the core
    // result the record arrived with. Both fall back to English conventions;
    // the message still renders from the catalog the host supplied.
    it("still renders when the negotiated tag is one Intl rejects", () => {
        const posix = createDiagnosticFormatter(
            translatorFor(
                "en_US",
                `line-segment-attributes-ignored-with-endpoints =
                    { $attributesCount ->
                        [one] { $attributes } dropped
                       *[other] { $attributes } all dropped
                    }`,
            ),
            "en_US",
        );
        expect(
            posix({
                message:
                    "slope and length are ignored when two endpoints are specified",
                code: "doenet-i0001",
                args: { attributes: ["slope", "length"] },
            }),
        ).toBe("slope and length all dropped");
    });

    // The tag only reaches `Intl.ListFormat` directly when the translator
    // can't say which locale answered — a plain function satisfies
    // `Translator` without `localeOf`, and the message then renders from the
    // record's English while the list is still joined somewhere.
    it("joins a list even when the fallback tag is one Intl rejects", () => {
        const echoArgs: Translator = (_key, args) => String(args?.attributes);
        const bare = createDiagnosticFormatter(echoArgs, "en_US");
        expect(
            bare({
                message: "ignored",
                code: "doenet-i0001",
                args: { attributes: ["slope", "length"] },
            }),
        ).toBe("slope and length");
    });

    it("renders English unchanged when English is the UI language", () => {
        const formatEn = createDiagnosticFormatter(
            createTranslator([], {}),
            "en",
        );
        for (const code of Object.keys(DIAGNOSTIC_CODES) as DiagnosticCode[]) {
            const args =
                code === "doenet-i0001" ||
                code === "doenet-i0003" ||
                code === "doenet-w0003" ||
                code === "doenet-w0004"
                    ? {
                          attributes: ["slope"],
                          variables: { list: ["x"], type: "unit" as const },
                          variable1: "x",
                          variable2: "y",
                      }
                    : undefined;
            const message = formatEnglishDiagnostic(code, args);
            expect(formatEn({ message, code, args }), code).toBe(message);
        }
    });
});

/**
 * The shapes that first appear in the second migration batch: a single code
 * standing in for several components, and a message that selects on something
 * other than a count.
 */
describe("one code, several components", () => {
    it("names the component it was given, in English", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0009", { component: "polygon" }),
        ).toBe(
            "Cannot attract to a `<polygon>` as it doesn't have a nearestPoint state variable.",
        );
        expect(
            formatEnglishDiagnostic("doenet-a0001", { component: "graph" }),
        ).toBe(
            "For accessibility, `<graph>` must either have a short description or be specified as decorative.",
        );
        expect(
            formatEnglishDiagnostic("doenet-a0001", { component: "image" }),
        ).toBe(
            "For accessibility, `<image>` must either have a short description or be specified as decorative.",
        );
    });

    // The component name is part of the DoenetML language, so it survives
    // translation untouched while the sentence around it changes.
    it("keeps the component name in English when the sentence is Spanish", () => {
        const formatEs = createDiagnosticFormatter(
            createChromeTranslator("es", ES),
            "es",
        );
        const message = formatEs({
            message: "unused",
            code: "doenet-w0015",
            args: { value: "a b c", component: "sort" },
        });
        expect(message).toContain("sort");
        expect(message).toContain('"a b c"');
        expect(message).not.toContain("Ignoring");
    });
});

describe("the section-title contrast message", () => {
    const args = {
        colorName: "backgroundColor",
        ratio: 3.5,
        threshold: 4.5,
    };

    it("reproduces the concatenated English, including the two decimals", () => {
        expect(
            formatEnglishDiagnostic("doenet-a0006", {
                ...args,
                mode: "light",
            }),
        ).toBe(
            "backgroundColor has insufficient contrast for the section heading text (3.50:1; requires at least 4.5:1).",
        );
    });

    // The suffix this replaced was English prose concatenated in the caller,
    // which no translator would ever have seen.
    it("selects the dark-mode wording rather than appending a suffix", () => {
        expect(
            formatEnglishDiagnostic("doenet-a0006", { ...args, mode: "dark" }),
        ).toBe(
            "backgroundColor has insufficient contrast for the section heading text (dark mode) (3.50:1; requires at least 4.5:1).",
        );
    });
});

/**
 * The shape this batch introduces: a message whose wording turns on *two*
 * independent counts, so the variants multiply out inside the catalog rather
 * than being suffixed with an "s" in the caller.
 */
describe("a message that agrees two counts at once", () => {
    it("renders every combination of the domain warning's two counts", () => {
        const domain = (intervals: number, inputs: number) =>
            formatEnglishDiagnostic("doenet-w0038", { intervals, inputs });

        expect(domain(1, 1)).toBe(
            "Insufficient dimensions for domain for function. Domain has 1 interval but the function has 1 input.",
        );
        expect(domain(1, 2)).toBe(
            "Insufficient dimensions for domain for function. Domain has 1 interval but the function has 2 inputs.",
        );
        expect(domain(3, 1)).toBe(
            "Insufficient dimensions for domain for function. Domain has 3 intervals but the function has 1 input.",
        );
        expect(domain(3, 2)).toBe(
            "Insufficient dimensions for domain for function. Domain has 3 intervals but the function has 2 inputs.",
        );
    });

    it("renders every combination of the function-iterates counts", () => {
        const iterates = (inputs: number, outputs: number) =>
            formatEnglishDiagnostic("doenet-w0056", { inputs, outputs });
        const prefix =
            "Function iterates are possible only if the number of inputs of the function is equal to the number of outputs. This function has ";

        expect(iterates(1, 1)).toBe(`${prefix}1 input and 1 output.`);
        expect(iterates(1, 2)).toBe(`${prefix}1 input and 2 outputs.`);
        expect(iterates(2, 1)).toBe(`${prefix}2 inputs and 1 output.`);
        expect(iterates(3, 4)).toBe(`${prefix}3 inputs and 4 outputs.`);
    });

    // Nesting a select inside a select is the part that is easy to get wrong:
    // a variant has to begin on a new line, so the inner select spans lines
    // too. Newlines inside a placeable never reach the rendered value, which
    // is what these assertions pin down — a stray one would show up here.
    it("keeps the nested select off the rendered value", () => {
        for (const message of [
            formatEnglishDiagnostic("doenet-w0038", {
                intervals: 2,
                inputs: 3,
            }),
            formatEnglishDiagnostic("doenet-w0056", { inputs: 2, outputs: 3 }),
        ]) {
            expect(message).not.toContain("\n");
            expect(message).not.toMatch(/ {2}/);
        }
    });
});

/**
 * The nouns a message selects on, rather than substitutes in. `maximum` and
 * `slope` are English prose, so each has to be worded by the catalog; an
 * unlisted value still renders the way the concatenated version did.
 */
describe("the function interpolation-point warnings", () => {
    it("words each kind of point it was given", () => {
        for (const [type, expected] of [
            ["maximum", "Ignoring non-numerical maximum of function."],
            ["minimum", "Ignoring non-numerical minimum of function."],
            ["extremum", "Ignoring non-numerical extremum of function."],
            ["point", "Ignoring non-numerical point of function."],
            ["slope", "Ignoring non-numerical slope of function."],
        ] as const) {
            expect(formatEnglishDiagnostic("doenet-w0040", { type })).toBe(
                expected,
            );
        }
        expect(formatEnglishDiagnostic("doenet-w0041", { type: "point" })).toBe(
            "Ignoring empty point of function.",
        );
    });

    it("words them in Spanish, agreeing the adjective", () => {
        const formatEs = createDiagnosticFormatter(es, "es");
        const nonNumerical = (type: string) =>
            formatEs({
                message: "unused",
                code: "doenet-w0040",
                args: { type },
            });

        expect(nonNumerical("point")).toBe(
            "Se ignora el punto no numérico de la función.",
        );
        // Feminine in Spanish where English has no gender to agree — the
        // reason the noun cannot be passed in as an argument.
        expect(nonNumerical("slope")).toBe(
            "Se ignora la pendiente no numérica de la función.",
        );
    });

    it("falls back to substituting an unrecognized kind", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0040", { type: "inflection" }),
        ).toBe("Ignoring non-numerical inflection of function.");
    });
});

/**
 * The author's own numbers are echoed back as strings. Formatting them as
 * quantities would round a small radius away entirely.
 */
describe("the circle radius warning", () => {
    it("reproduces the value the author wrote, however small", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0031", {
                distance: "5",
                radius: "0.0001",
            }),
        ).toBe(
            "Cannot calculate circle: given that the distance between the two points is 5, the specified radius 0.0001 is too small.",
        );
    });
});

/**
 * The two messages a component raises when its `target` will not resolve. The
 * component that raised them is an argument rather than part of the wording,
 * so every component taking a `target` shares the pair.
 */
describe("the target-resolution warnings", () => {
    it("names the component that raised it", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0043", {
                source: "animateFromSequence",
            }),
        ).toBe(
            "Invalid target for `<animateFromSequence>`: cannot find target.",
        );
        expect(
            formatEnglishDiagnostic("doenet-w0044", {
                source: "animateFromSequence",
                property: "value",
                component: "point",
            }),
        ).toBe(
            'Invalid target for `<animateFromSequence>`: cannot find a state variable named "value" on a `<point>`.',
        );
    });

    // The point of the pair: a second component reuses both codes and only
    // the tag changes. Splitting them per component would have given a host
    // two codes to filter for one situation, permanently.
    it("serves a second component from the same two codes", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0043", {
                source: "updateValue",
            }),
        ).toBe("Invalid target for `<updateValue>`: cannot find target.");
        expect(
            formatEnglishDiagnostic("doenet-w0044", {
                source: "updateValue",
                property: "invalid",
                component: "number",
            }),
        ).toBe(
            'Invalid target for `<updateValue>`: cannot find a state variable named "invalid" on a `<number>`.',
        );
    });

    // Both tags are DoenetML, so both survive translation untouched while the
    // sentence around them changes.
    it("keeps both tags in English when the sentence is Spanish", () => {
        const formatEs = createDiagnosticFormatter(es, "es");
        expect(
            formatEs({
                message: "unused",
                code: "doenet-w0044",
                args: {
                    source: "animateFromSequence",
                    property: "value",
                    component: "point",
                },
            }),
        ).toBe(
            'Destino no válido para `<animateFromSequence>`: no se encuentra una variable de estado llamada "value" en un `<point>`.',
        );
    });
});

/**
 * The shapes this batch introduces: a list joined once the reader's language
 * is known, and a count that agrees the noun beside it.
 */
describe("messages built from a list", () => {
    it('joins invalid attribute values without adding an "and"', () => {
        const invalid = (values: string[]) =>
            formatEnglishDiagnostic("doenet-i0021", {
                values: { list: values, type: "unit" },
                attribute: "displayDigits",
            });

        expect(invalid(["`a`"])).toBe(
            "Invalid value `a` for attribute `displayDigits`; ignoring.",
        );
        expect(invalid(["`a`", "`b`"])).toBe(
            "Invalid values `a`, `b` for attribute `displayDigits`; ignoring.",
        );
        expect(invalid(["`a`", "`b`", "`c`"])).toBe(
            "Invalid values `a`, `b`, `c` for attribute `displayDigits`; ignoring.",
        );
    });

    // At most `expandOnCompare` and `simplifyOnCompare` reach this message,
    // where the "and" of a conjunction is exactly what the concatenated
    // version produced.
    it("agrees the noun with how many attributes were named", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0071", {
                attributes: ["expandOnCompare"],
            }),
        ).toBe(
            "The expandOnCompare attribute will have no effect without symbolicEquality set.",
        );
        expect(
            formatEnglishDiagnostic("doenet-w0071", {
                attributes: ["expandOnCompare", "simplifyOnCompare"],
            }),
        ).toBe(
            "The expandOnCompare and simplifyOnCompare attributes will have no effect without symbolicEquality set.",
        );
    });

    it("keeps the quotes the function-name list was built with", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0082", {
                attribute: "resetFunctionNames",
                names: { list: ["'f'", "'gg'"], type: "unit" },
            }),
        ).toBe(
            "<mathInput>: ignored invalid function name(s) in resetFunctionNames: 'f', 'gg'. Each name's display segment must be at least 2 characters (letters or dashes); an optional `|<mathspeak alternative>` suffix may follow.",
        );
    });
});

describe("the dataFrame warnings", () => {
    // A component index is a name, not a quantity: grouped as a number it
    // would read "componentIdx :1,234".
    it("prints the component index ungrouped", () => {
        expect(
            formatEnglishDiagnostic("doenet-w0066", {
                componentIdx: String(1234),
            }),
        ).toBe(
            "Data has invalid shape.  Rows has inconsistent lengths. Found in componentIdx :1234",
        );
    });
});
