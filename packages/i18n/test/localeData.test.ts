import { describe, expect, it } from "vitest";

import { bundledResources } from "../src/bundled";
import {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
} from "../src/localeData";
import { CHROME_NAMESPACES, WORKER_NAMESPACES } from "../src/namespaces";
import { extractKeys, readCatalog } from "../scripts/catalogUtils";

describe("createTranslatorFromLocaleData", () => {
    it("negotiates the requested locale against the catalogs that arrived", () => {
        const t = createTranslatorFromLocaleData({
            locale: "es-MX",
            resources: { es: "greeting = Hola" },
        });
        expect(t("greeting")).toBe("Hola");
    });

    it("degrades to the supplied English string when no catalog matches", () => {
        const t = createTranslatorFromLocaleData({
            locale: "ja",
            resources: { es: "greeting = Hola" },
        });
        expect(t("greeting", undefined, "Hello")).toBe("Hello");
    });

    it("works with the default payload — the pre-host state of the worker", () => {
        const t = createTranslatorFromLocaleData(DEFAULT_LOCALE_DATA);
        expect(t("greeting", undefined, "Hello")).toBe("Hello");
    });

    it("resolves a bundled locale with no host catalogs at all", () => {
        // What makes `documentLocale="es"` work without the embedding page
        // shipping anything.
        const t = createTranslatorFromLocaleData({
            locale: "es",
            resources: {},
        });
        expect(t("noun.line", undefined, "line")).toBe("línea");
    });

    it("lets a host catalog win over the bundled one for the same locale", () => {
        const t = createTranslatorFromLocaleData({
            locale: "es",
            resources: { es: "noun =\n    .line = recta" },
        });
        expect(t("noun.line", undefined, "line")).toBe("recta");
    });

    it("translates for a locale other than the one the payload asked for", () => {
        // A nested `<document lang>` differing from the host's request.
        const localeData = { locale: "en", resources: {} };
        expect(
            createTranslatorFromLocaleData(localeData, "es")("noun.circle"),
        ).toBe("círculo");
        expect(createTranslatorFromLocaleData(localeData)("noun.circle")).toBe(
            "circle",
        );
    });
});

describe("bundledResources", () => {
    it("gives the worker content but not chrome", () => {
        const worker = bundledResources(WORKER_NAMESPACES);
        expect(Object.keys(worker)).toEqual(["es"]);
        expect(worker.es).toContain("noun-regular-polygon");
        expect(worker.es).not.toContain("keyboard-open");
    });

    it("gives the chrome its namespaces, English included as a candidate", () => {
        const chrome = bundledResources(CHROME_NAMESPACES, {
            includeEnglish: true,
        });
        expect(Object.keys(chrome).sort()).toEqual(["en", "es"]);
        expect(chrome.es).toContain("keyboard-open");
        expect(chrome.es).not.toContain("noun-regular-polygon");
    });

    // A locale is inlined namespace by namespace, so a new catalog file is
    // easy to write and then forget to bundle — it would simply never load,
    // silently, with everything falling back to English. Every namespace a
    // context asks for has to arrive for every bundled locale.
    it("bundles every namespace a context asks for, for every locale", () => {
        for (const namespaces of [CHROME_NAMESPACES, WORKER_NAMESPACES]) {
            for (const [locale, source] of Object.entries(
                bundledResources(namespaces),
            )) {
                // Compared as parsed keys, not as substrings: an attribute is
                // addressed as `color.black` but written as a `.black` line
                // under `color`, so searching the source text for the key
                // would report every attribute as missing.
                const bundled = new Set(extractKeys(source));
                for (const namespace of namespaces) {
                    for (const key of extractKeys(
                        readCatalog(locale, namespace) ?? "",
                    )) {
                        expect(
                            bundled.has(key),
                            `${locale}/${namespace}: ${key}`,
                        ).toBe(true);
                    }
                }
            }
        }
    });
});
