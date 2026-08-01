import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
    createChromeTranslator,
    createDiagnosticFormatter,
    stripBidiIsolates,
} from "@doenet/i18n";
import type { DiagnosticRecord } from "@doenet/utils";

import { localizeDiagnostics } from "./diagnostics";

/**
 * The main-thread half of i18n Phase 3 (#1518): the worker emits a code plus
 * the values that fill the message in, and `DocViewer` renders the message in
 * `uiLocale` at the single point diagnostics enter the viewer.
 */
const coded: DiagnosticRecord = {
    type: "info",
    code: "doenet-i0001",
    args: { attributes: ["slope", "length"] },
    message: "slope and length are ignored when two endpoints are specified",
    position: {
        start: { line: 2, column: 3, offset: 4 },
        end: { line: 2, column: 9, offset: 10 },
    },
};

const legacy: DiagnosticRecord = {
    type: "warning",
    message: "Invalid type for answer: nonsense",
};

/**
 * Spanish handed over the way `DocViewer` hands it over: only English is
 * bundled, so every other language reaches the chrome through the catalogs
 * `useLocaleCatalogs` has loaded.
 */
const ES = {
    es: fs.readFileSync(
        path.resolve(__dirname, "../../../i18n/locales/es/diagnostics.ftl"),
        "utf-8",
    ),
};

const formatEs = createDiagnosticFormatter(
    createChromeTranslator("es", ES),
    "es",
);
const formatEn = createDiagnosticFormatter(createChromeTranslator("en"), "en");

describe("localizeDiagnostics", () => {
    it("renders a coded record's message in the chrome's language", () => {
        const [localized] = localizeDiagnostics([coded], formatEs);
        // Stripped because the chrome isolates its placeables in every
        // language but English, and the ignored attributes are one.
        expect(stripBidiIsolates(localized.message)).toBe(
            "slope y length se ignoran cuando se especifican los dos extremos",
        );
    });

    it("keeps everything else on the record, code and position included", () => {
        const [localized] = localizeDiagnostics([coded], formatEs);
        expect(localized.type).toBe("info");
        expect(localized.code).toBe("doenet-i0001");
        expect(localized.args).toEqual({ attributes: ["slope", "length"] });
        expect(localized.position).toEqual(coded.position);
    });

    it("does not mutate the records it was handed", () => {
        localizeDiagnostics([coded], formatEs);
        expect(coded.message).toBe(
            "slope and length are ignored when two endpoints are specified",
        );
    });

    // Identity, not just equality: `DocViewer` hands these on to a host
    // callback and to the editor's panel on every core result, and a document
    // whose diagnostics have all been localized already — or have never
    // migrated — must not churn a memo downstream.
    it("returns the same array when nothing changed", () => {
        const records = [legacy, coded];
        expect(localizeDiagnostics(records, formatEn)).toBe(records);
    });

    it("leaves a record with no code untouched in any language", () => {
        const [localized] = localizeDiagnostics([legacy], formatEs);
        expect(localized).toBe(legacy);
    });

    it("localizes only the coded records in a mixed batch", () => {
        const localized = localizeDiagnostics([legacy, coded], formatEs);
        expect(localized[0]).toBe(legacy);
        expect(localized[1].message).toContain("se ignoran");
    });
});
