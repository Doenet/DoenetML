import type { DastElement, DastRoot } from "./types";

/**
 * An element's `lang`, by the rules the core reads it with.
 *
 * `lang` is a primitive string attribute: the core builds it from exactly one
 * string child and raises "Invalid reference in a primitive attribute" for
 * anything else — a reference, or text a reference has split in two. Reading it
 * any more liberally here would name a language the core refuses to build.
 *
 * The attribute name is matched case-insensitively, because the DAST preserves
 * whatever casing the author typed while the core lowercases before matching:
 * `<document Lang="es">` resolves to `document.locale` `"es"` in the worker.
 */
export function readLangAttribute(element: DastElement): string | undefined {
    const attributes = element.attributes ?? {};
    const langName = Object.keys(attributes).find(
        (name) => name.toLowerCase() === "lang",
    );
    const langAttribute =
        langName === undefined ? undefined : attributes[langName];
    if (!langAttribute) {
        return undefined;
    }
    const [child, ...rest] = langAttribute.children;
    if (rest.length > 0 || child?.type !== "text") {
        return undefined;
    }
    return child.value.trim() || undefined;
}

/**
 * Every language declared anywhere in a source, in document order.
 *
 * The catalogs that have to be on hand for the core to render the whole tree.
 * The outermost `<document>`'s language is only part of it: a nested
 * `<document lang>` renders its subtree in a language of its own (#1594), and
 * the core computes that subtree's prose out of that language's catalog.
 *
 * Worth reading off the source rather than asking the core, because the core
 * settles a nested language while it computes — by which time it has already
 * needed the catalog. The tags are here in the text the author wrote, so
 * loading can start before the core exists at all. Nothing is lost by reading
 * only literal values: see {@link readLangAttribute}, a reference in a `lang`
 * is rejected rather than resolved, so there is no language the core could work
 * out that is not written here.
 *
 * What this cannot see is DoenetML that is not in the tree it is handed. A
 * `<document lang>` inside content pulled in by an external reference joins
 * during `expandExternalReferences`, so a caller scanning the source before
 * that misses it: the outermost such document's language is still picked up
 * afterwards, from the expanded tree, but a *nested* one is not, and nothing
 * else asks for its catalog — that subtree stays English. Pass the expanded
 * root to catch those too.
 */
export function readDeclaredLangs(dast: DastRoot): string[] {
    const langs: string[] = [];
    const seen = new Set<string>();

    function visit(node: DastRoot | DastElement) {
        if (node.type === "element" && node.name === "document") {
            const lang = readLangAttribute(node);
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
