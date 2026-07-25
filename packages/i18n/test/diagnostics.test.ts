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
import { createTranslator } from "../src/translator";
import { extractKeys } from "../scripts/catalogUtils";

const LOCK_FILE = path.join(__dirname, "..", "diagnostic-codes.lock.json");

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
        const englishKeys = new Set(extractKeys(EN_CATALOGS.diagnostics));
        for (const [code, key] of Object.entries(DIAGNOSTIC_CODES)) {
            expect(englishKeys.has(key), `${code} → ${key}`).toBe(true);
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
});

describe("the path the viewer actually takes", () => {
    // `DocViewer` builds its formatter over `createChromeTranslator`, not over
    // a translator assembled in a test. That is what decides whether the
    // Spanish diagnostics catalog is bundled at all — the tests above would
    // pass just as well with it left out of `bundledResources`.
    it("resolves a bundled locale's diagnostics through the chrome translator", () => {
        const format = createDiagnosticFormatter(
            createChromeTranslator("es"),
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
    // gets one wrong. `normalizeLocaleTag` passes it through untouched, and
    // Fluent renders from a bundle built for it — but `Intl.ListFormat` throws
    // `RangeError` on it, and that throw would escape `DocViewer` on the core
    // result the diagnostic arrived with. The list falls back to English; the
    // message still renders from the catalog the host supplied.
    it("still renders when the negotiated tag is one Intl rejects", () => {
        const posix = createDiagnosticFormatter(
            translatorFor(
                "en_US",
                "line-segment-attributes-ignored-with-endpoints = { $attributes } dropped ({ $attributesCount })",
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
        ).toBe("slope and length dropped (2)");
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
