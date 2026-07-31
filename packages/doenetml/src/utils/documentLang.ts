import type { DastElement, DastRoot } from "@doenet/parser";

/**
 * The `lang` attribute authored on `<document>`, if any.
 *
 * Read from the normalized DAST the viewer already parses on its way to the
 * worker, so the effective content language is known before the first render —
 * a screen reader shouldn't have to wait for evaluation to learn what language
 * it is reading. The worker resolves the same value independently for
 * `document.locale`; both feed it through `resolveDocumentLocale`, so the
 * rendered `lang` attribute and the translated content cannot disagree.
 *
 * `lang` is a primitive string attribute, which the core builds from exactly
 * one string child — given anything else it raises "Invalid reference in a
 * primitive attribute" rather than joining or resolving. Read the same way
 * here, so the label and the language the content is rendered in cannot come
 * from different rules.
 *
 * The attribute name is matched case-insensitively, because the DAST preserves
 * whatever casing the author typed while the core lowercases before matching:
 * `<document Lang="es">` resolves to `document.locale` `"es"` in the worker, so
 * it has to label the wrapper here too, or the two would disagree.
 */
export function readDocumentLang(dast: DastRoot): string | undefined {
    const documentElement = dast.children.find(
        (child): child is DastElement =>
            child.type === "element" && child.name === "document",
    );
    return documentElement && readLang(documentElement);
}

/**
 * Every language declared anywhere in the source, in document order.
 *
 * {@link readDocumentLang} answers what the *activity* is written in, which is
 * the outermost `<document>`'s and nothing else. This answers which catalogs
 * have to be on hand for the core to render the whole tree, which is a larger
 * set: a nested `<document lang>` renders its subtree in a language of its own
 * (#1594), and the core computes that subtree's prose out of that language's
 * catalog.
 *
 * Worth reading off the source rather than asking the core, because the core
 * settles a nested language while it computes — by which time it has already
 * needed the catalog. The tags are here in the text the author wrote, so
 * loading can start before the core exists at all.
 *
 * Reading the literal text loses nothing: `lang` is a primitive string
 * attribute, so a reference in it is rejected outright ("Invalid reference in
 * a primitive attribute") rather than resolved. There is no language the core
 * could work out that is not written here.
 *
 * The one thing this cannot see is DoenetML that is not in this source yet —
 * a `<document lang>` inside content pulled in by an external reference joins
 * the tree during `expandExternalReferences`, after this has run. That subtree
 * falls back to English until the core is rebuilt with its catalog on hand.
 */
export function readDeclaredLangs(dast: DastRoot): string[] {
    const langs: string[] = [];
    const seen = new Set<string>();

    function visit(node: DastRoot | DastElement) {
        if (node.type === "element" && node.name === "document") {
            const lang = readLang(node);
            if (lang !== undefined && !seen.has(lang)) {
                seen.add(lang);
                langs.push(lang);
            }
        }
        for (const child of node.children) {
            if (child.type === "element") {
                visit(child);
            }
        }
    }

    visit(dast);
    return langs;
}

/** One element's `lang`, by the rules described on {@link readDocumentLang}. */
function readLang(element: DastElement): string | undefined {
    const attributes = element.attributes ?? {};
    const langName = Object.keys(attributes).find(
        (name) => name.toLowerCase() === "lang",
    );
    const langAttribute =
        langName === undefined ? undefined : attributes[langName];
    if (!langAttribute) {
        return undefined;
    }
    // Exactly one string child, as the core insists on. Text split by a
    // reference is not a language the core would accept either, so joining the
    // pieces would name a language nothing renders in.
    const [child, ...rest] = langAttribute.children;
    if (rest.length > 0 || child?.type !== "text") {
        return undefined;
    }
    return child.value.trim() || undefined;
}
