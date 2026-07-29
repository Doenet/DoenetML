import { describe, expect, it } from "vitest";
import { lezerToDast, normalizeDocumentDast } from "@doenet/parser";
import { resolveDocumentLocale } from "@doenet/i18n";

import { readDocumentLang } from "./documentLang";

function langOf(doenetML: string) {
    return readDocumentLang(normalizeDocumentDast(lezerToDast(doenetML), true));
}

/**
 * The content language the core will translate into, which is also the tag the
 * viewer puts in the wrapper's `lang` attribute — one resolution for both, so
 * the DOM never claims a language the content was not rendered in. Mirrors
 * what `initializeCoreWorker` computes, and must match the `document.locale`
 * state variable the worker derives from the same source — see the "document
 * lang / locale" tests in `@doenet/doenetml-worker-javascript`.
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

    it("matches the attribute name case-insensitively", () => {
        // DoenetML attribute names are case-insensitive: the core lowercases
        // before matching, so `<document Lang>` resolves `document.locale`
        // there. The DAST keeps the author's casing, so reading it here has to
        // lowercase too or the wrapper and the core would disagree.
        expect(langOf(`<document Lang="es-MX"><p>hola</p></document>`)).eq(
            "es-MX",
        );
        expect(langOf(`<document LANG="fr"><p>bonjour</p></document>`)).eq(
            "fr",
        );
    });
});

describe("effective document locale", () => {
    it("defaults to en", () => {
        // Which is what the wrapper's `lang` then says. Not a guess about what
        // the author wrote: English is what the core computes such a
        // document's prose in and what its chrome renders in, so the attribute
        // reports the language actually on screen rather than letting the
        // subtree inherit the embedding page's.
        expect(effectiveLocale(`<p>hello</p>`)).eq("en");
        expect(effectiveLocale(`<document lang=" "><p>hi</p></document>`)).eq(
            "en",
        );
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
