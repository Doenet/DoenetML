import { describe, expect, it } from "vitest";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { resolveDocumentLocale } from "@doenet/i18n";

import { readDocumentLang } from "./documentLang";

function langOf(doenetML: string) {
    return readDocumentLang(normalizeDocumentDast(lezerToDast(doenetML), true));
}

/**
 * The locale the viewer will put on the rendered wrapper. Mirrors what
 * `initializeCoreWorker` computes, and must match the `document.locale` state
 * variable the worker derives from the same source — see the "document lang /
 * locale" tests in `@doenet/doenetml-worker-javascript`.
 */
function effectiveLocale(doenetML: string, documentLocale?: string) {
    return resolveDocumentLocale(langOf(doenetML), documentLocale);
}

describe("readDocumentLang", () => {
    it("reads an authored lang", () => {
        expect(langOf(`<document lang="es-MX"><p>hola</p></document>`)).eq(
            "es-MX",
        );
    });

    it("returns undefined when the document declares no lang", () => {
        expect(langOf(`<p>hello</p>`)).eq(undefined);
        expect(langOf(`<document><p>hello</p></document>`)).eq(undefined);
    });

    it("treats a blank lang as absent", () => {
        expect(langOf(`<document lang="  "><p>hi</p></document>`)).eq(
            undefined,
        );
    });

    it("ignores a lang on something other than the document", () => {
        expect(langOf(`<p lang="fr">bonjour</p>`)).eq(undefined);
    });
});

describe("effective document locale", () => {
    it("defaults to en", () => {
        expect(effectiveLocale(`<p>hello</p>`)).eq("en");
    });

    it("uses the host locale when the document declares none", () => {
        expect(effectiveLocale(`<p>hola</p>`, "es-MX")).eq("es-MX");
    });

    it("lets an authored lang override the host locale", () => {
        expect(
            effectiveLocale(
                `<document lang="fr"><p>bonjour</p></document>`,
                "es-MX",
            ),
        ).eq("fr");
    });

    it("normalizes a hand-typed tag to canonical casing", () => {
        expect(
            effectiveLocale(`<document lang="ES-mx"><p>hola</p></document>`),
        ).eq("es-MX");
    });

    it("falls back past a blank lang", () => {
        expect(
            effectiveLocale(`<document lang=" "><p>hi</p></document>`, "de"),
        ).eq("de");
    });
});
