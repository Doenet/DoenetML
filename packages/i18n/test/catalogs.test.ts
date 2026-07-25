import { describe, expect, it } from "vitest";

import {
    CATALOG_NAMESPACES,
    WORKER_NAMESPACES,
    combineCatalogs,
} from "../src/namespaces";
import { EN_CATALOGS, EN_CATALOG_SOURCE } from "../src/catalogs";
import { createTranslator } from "../src/translator";
import { catalogParseErrors, extractKeys } from "../scripts/catalogUtils";

describe("bundled English catalogs", () => {
    it("ships one catalog per namespace", () => {
        expect(Object.keys(EN_CATALOGS).sort()).toEqual(
            [...CATALOG_NAMESPACES].sort(),
        );
    });

    it("parses as Fluent", () => {
        expect(catalogParseErrors(EN_CATALOG_SOURCE)).toEqual([]);
    });

    it("is inlined rather than fetched, so it works in a worker", () => {
        // Not empty even in Phase 0: each file carries its header comment, so
        // an empty string here means the `?raw` import silently produced
        // nothing rather than the catalog's contents.
        for (const [namespace, source] of Object.entries(EN_CATALOGS)) {
            expect(source, namespace).not.toBe("");
        }
    });

    it("defines no keys yet — Phase 0 moves no strings", () => {
        expect(extractKeys(EN_CATALOG_SOURCE)).toEqual([]);
    });
});

describe("combineCatalogs", () => {
    it("merges the namespaces a context loads", () => {
        const combined = combineCatalogs({
            content: "a = A",
            diagnostics: "b = B",
        });
        expect(extractKeys(combined).sort()).toEqual(["a", "b"]);
    });

    it("skips namespaces a context does not load", () => {
        const workerCatalogs = Object.fromEntries(
            WORKER_NAMESPACES.map((namespace) => [
                namespace,
                `${namespace}-key = value`,
            ]),
        );
        const t = createTranslator(["xx"], {
            xx: combineCatalogs(workerCatalogs),
        });
        expect(t("content-key")).toBe("value");
        expect(t("chrome-key", undefined, "not loaded")).toBe("not loaded");
    });
});
