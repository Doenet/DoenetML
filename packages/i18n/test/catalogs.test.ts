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
        // Not empty even for a namespace no phase has populated: each file
        // carries its header comment, so an empty string here means the `?raw`
        // import silently produced nothing rather than the catalog's contents.
        for (const [namespace, source] of Object.entries(EN_CATALOGS)) {
            expect(source, namespace).not.toBe("");
        }
    });

    it("defines the chrome keys Phase 1 extracted", () => {
        const chromeKeys = extractKeys(EN_CATALOGS.chrome);
        expect(chromeKeys).toContain("answer-correct");
        expect(chromeKeys).toContain("attempts-remaining");
    });

    it("defines the style vocabulary Phase 2 extracted", () => {
        const contentKeys = extractKeys(EN_CATALOGS.content);
        expect(contentKeys).toContain("color.blue");
        expect(contentKeys).toContain("noun.line");
        expect(contentKeys).toContain("style-stroke");
    });

    it("defines the diagnostics Phase 3 extracted", () => {
        const diagnosticKeys = extractKeys(EN_CATALOGS.diagnostics);
        expect(diagnosticKeys).toContain("ray-dimension-mismatch");
        expect(diagnosticKeys).toContain(
            "line-segment-attributes-ignored-with-endpoints",
        );
    });

    it("defines the editor chrome Phase 4 extracted", () => {
        // The last namespace to be populated: `editor.ftl` sat empty from
        // Phase 0 until the editor's own chrome moved into it (#1580).
        const editorKeys = extractKeys(EN_CATALOGS.editor);
        expect(editorKeys).toContain("editor-tab-errors");
        expect(editorKeys).toContain("editor-diagnostic-line");
        expect(editorKeys).toContain("editor-accessibility-label");
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
