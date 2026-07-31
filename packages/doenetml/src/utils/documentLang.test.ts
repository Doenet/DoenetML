import { describe, expect, it } from "vitest";
import {
    declaredLangsInSource,
    lezerToDast,
    normalizeDocumentDast,
    readDeclaredLangs,
} from "@doenet/parser";
import { resolveDocumentLocale } from "@doenet/i18n";

import { readDocumentLang } from "./documentLang";

function langOf(doenetML: string) {
    return readDocumentLang(normalizeDocumentDast(lezerToDast(doenetML), true));
}

/**
 * The raw parse, not the normalized one `langOf` uses: `DocViewer` runs
 * `readDeclaredLangs` over `lezerToDast` alone, because it is prefetching
 * catalogs on every render the source changes and normalization buys it
 * nothing — no plugin in that pipeline invents or moves a `lang`.
 */
function declared(doenetML: string) {
    return readDeclaredLangs(lezerToDast(doenetML));
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
        // And so what the wrapper's `lang` says. Not a guess about what the
        // author wrote: English is what the core computes such a document's
        // prose in, so the attribute reports the language the content was
        // rendered in rather than letting the subtree inherit the embedding
        // page's.
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
        expect(effectiveLocale(`<document lang=" "><p>hi</p></document>`)).eq(
            "en",
        );
    });
});

describe("readDeclaredLangs", () => {
    it("finds the outermost document's language", () => {
        expect(declared(`<document lang="es"><p>hola</p></document>`)).toEqual([
            "es",
        ]);
    });

    // The reason this exists: the core settles a nested language while it
    // computes, by which time it has already needed the catalog.
    it("finds a nested document's language", () => {
        expect(
            declared(
                `<document lang="en"><document lang="es"><p>hola</p></document></document>`,
            ),
        ).toEqual(["en", "es"]);
    });

    it("finds a language declared only by a nested document", () => {
        expect(
            declared(
                `<document><document lang="de"><p>hallo</p></document></document>`,
            ),
        ).toEqual(["de"]);
    });

    it("keeps document order and reports each language once", () => {
        expect(
            declared(
                `<document lang="de"><document lang="es"/><document lang="de"/></document>`,
            ),
        ).toEqual(["de", "es"]);
    });

    // Matched the same way `readDocumentLang` matches it, so a nested
    // document is not held to a stricter rule than the outermost one.
    it("matches the attribute name case-insensitively", () => {
        expect(
            declared(
                `<document><document Lang="es"><p/></document></document>`,
            ),
        ).toEqual(["es"]);
    });

    it("reports nothing when no document declares a language", () => {
        expect(declared(`<p>hi</p>`)).toEqual([]);
    });

    it("ignores lang on anything that is not a document", () => {
        expect(declared(`<p lang="es">hola</p>`)).toEqual([]);
    });

    it("treats a blank lang as unset", () => {
        expect(declared(`<document lang="   "><p/></document>`)).toEqual([]);
    });
});

describe("declaredLangsInSource", () => {
    // What `DocViewer` prefetches catalogs from, on every render the source
    // changes — so it has to answer for source that is mid-keystroke and
    // source that never mentions a language, without throwing and without
    // parsing when there is nothing to find.
    it("agrees with readDeclaredLangs on source that parses", () => {
        const doenetML = `<document lang="en"><document lang="es"><p/></document></document>`;
        expect(declaredLangsInSource(doenetML)).toEqual(declared(doenetML));
    });

    it("finds nothing in source that declares no language", () => {
        expect(declaredLangsInSource(`<p>hello</p>`)).toEqual([]);
    });

    it("looks past a `lang=` that is not on a document", () => {
        // The cheap pre-test is deliberately loose, so this reaches the parse
        // and comes back empty rather than never parsing at all.
        expect(declaredLangsInSource(`<p lang="es">hola</p>`)).toEqual([]);
        expect(declaredLangsInSource(`<p>lang = something</p>`)).toEqual([]);
    });

    it("answers rather than throwing for source that is half-typed", () => {
        // Which is the common case in the editor, where every keystroke lands
        // here — and the errors such source is about to raise say far more
        // than a throw from a prefetch would.
        expect(declaredLangsInSource(`<document lang="es"><p>`)).toEqual([
            "es",
        ]);
        expect(declaredLangsInSource(`<<< lang="`)).toEqual([]);
    });
});

// `lang` is a primitive string attribute: the core builds it from exactly one
// string child and raises "Invalid reference in a primitive attribute" for
// anything else. Reading it any more liberally here would label a document
// with a language its content is not rendered in. Both readers share
// `readLangAttribute`, so both are held to the rule.
describe("readLangAttribute matches what the core accepts", () => {
    it("takes no language from an attribute the core would reject", () => {
        // A reference, and text split by one: neither is one string child.
        expect(langOf(`<document lang="$chosen"><p/></document>`)).toBe(
            undefined,
        );
        expect(langOf(`<document lang="e$chosen"><p/></document>`)).toBe(
            undefined,
        );
        expect(declared(`<document lang="e$chosen"><p/></document>`)).toEqual(
            [],
        );
    });
});
