import { describe, expect, it } from "vitest";

import {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
} from "../src/localeData";

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
});
