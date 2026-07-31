import { describe, expect, it } from "vitest";

import { bundledResources } from "../src/bundled";
import {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
} from "../src/localeData";
import { CHROME_NAMESPACES, WORKER_NAMESPACES } from "../src/namespaces";
import { extractKeys, readCatalog } from "../scripts/catalogUtils";
import esContent from "../locales/es/content.ftl?raw";

/**
 * Spanish content, handed over the way `DocViewer` hands the worker a catalog
 * it loaded. No translation is inlined, so `LocaleData.resources` is how every
 * language other than English reaches the worker.
 */
const ES = { es: esContent };

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

    it("resolves a locale from the catalogs it was handed", () => {
        // What makes `documentLocale="es"` work: the catalog reaches the
        // worker as `resources`, loaded on the main thread.
        const t = createTranslatorFromLocaleData({
            locale: "es",
            resources: ES,
        });
        expect(t("noun.line", undefined, "line")).toBe("línea");
    });

    it("takes a handed catalog over the English fallback, key by key", () => {
        const t = createTranslatorFromLocaleData({
            locale: "es",
            resources: { es: "noun =\n    .line = recta" },
        });
        expect(t("noun.line", undefined, "line")).toBe("recta");
        // A partial catalog is legitimate: keys it leaves out still resolve,
        // through the English `createTranslator` appends behind every chain.
        expect(t("noun.circle", undefined, "circle")).toBe("circle");
    });

    it("translates for a locale other than the one the payload asked for", () => {
        // A nested `<document lang>` differing from the host's request.
        const localeData = { locale: "en", resources: ES };
        expect(
            createTranslatorFromLocaleData(localeData, "es")("noun.circle"),
        ).toBe("círculo");
        expect(createTranslatorFromLocaleData(localeData)("noun.circle")).toBe(
            "circle",
        );
    });
});

describe("bundledResources", () => {
    // No translation is inlined, so the worker starts empty and falls back to
    // the English `createTranslator` appends unconditionally.
    it("gives the worker nothing while no translation is inlined", () => {
        expect(bundledResources(WORKER_NAMESPACES)).toEqual({});
    });

    it("gives the chrome English as a negotiable candidate", () => {
        const chrome = bundledResources(CHROME_NAMESPACES, {
            includeEnglish: true,
        });
        expect(Object.keys(chrome)).toEqual(["en"]);
        expect(chrome.en).toContain("keyboard-open");
        expect(chrome.en).not.toContain("noun-regular-polygon");
    });

    // A locale is inlined namespace by namespace, so a new catalog file is
    // easy to write and then forget to bundle — it would simply never load,
    // silently, with everything falling back to English. Every namespace a
    // context asks for has to arrive for every bundled locale.
    //
    // Dormant while `BUNDLED_TRANSLATIONS` is empty; it starts covering the
    // first locale inlined back in without needing to be rewritten.
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
