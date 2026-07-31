import { describe, expect, it } from "vitest";

import { englishResources } from "../src/catalogs";
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

describe("englishResources", () => {
    // The worker is handed nothing at all: English is appended behind every
    // chain by `createTranslator`, and no translation is inlined.
    it("gives the chrome its namespaces and not the worker's", () => {
        const chrome = englishResources(CHROME_NAMESPACES);
        expect(chrome).toContain("keyboard-open");
        expect(chrome).not.toContain("noun-regular-polygon");
    });

    it("gives the worker its namespace and not the chrome's", () => {
        const worker = englishResources(WORKER_NAMESPACES);
        expect(worker).toContain("noun-regular-polygon");
        expect(worker).not.toContain("keyboard-open");
    });

    // A namespace silently missing from the combined source would fall back to
    // English everywhere — which looks like nothing being wrong, because
    // English is what it would have said anyway. Every key of every namespace a
    // context asks for has to be in what it gets.
    it("carries every key of every namespace a context asks for", () => {
        for (const namespaces of [CHROME_NAMESPACES, WORKER_NAMESPACES]) {
            // Compared as parsed keys, not as substrings: an attribute is
            // addressed as `color.black` but written as a `.black` line under
            // `color`, so searching the source text for the key would report
            // every attribute as missing.
            const combined = new Set(extractKeys(englishResources(namespaces)));
            for (const namespace of namespaces) {
                for (const key of extractKeys(
                    readCatalog("en", namespace) ?? "",
                )) {
                    expect(combined.has(key), `${namespace}: ${key}`).toBe(
                        true,
                    );
                }
            }
        }
    });
});
