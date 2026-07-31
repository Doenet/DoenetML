// Covered by `packages/doenetml/src/utils/documentLang.test.ts` rather than by
// a spec in this package's own `test/`: what these read has to agree with what
// `readDocumentLang` labels the rendered wrapper with, and holding both to one
// rule in one file is what keeps them from drifting apart.

import { lezerToDast } from "./lezer-to-dast/lezer-to-dast";
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

/**
 * Shared empty result, so a source that declares no language hands back the
 * same array every time. Callers memoize on it and spread it into lists that
 * feed dependency arrays, and a fresh `[]` per call would make those recompute
 * for nothing. Handed out `readonly` so it stays shareable.
 */
const NO_DECLARED_LANGS: readonly string[] = [];

/**
 * {@link readDeclaredLangs} over unparsed source, cheaply and without throwing.
 *
 * For the callers that prefetch catalogs — they hold the author's text, not a
 * DAST, and they run where neither a parse per keystroke nor a throw is
 * acceptable. The viewer re-renders on every character the author types, and a
 * source that does not parse is about to raise errors saying so far better
 * than a throw from a prefetch would.
 *
 * The `lang=` test is deliberately loose — the attribute on any element, or
 * the word written in prose, is enough to fall through to a parse — because a
 * false positive costs one parse that finds nothing, while the overwhelmingly
 * common case of a source that never mentions a language costs a scan of a
 * string.
 */
export function declaredLangsInSource(source: string): readonly string[] {
    if (!/\blang\s*=/i.test(source)) {
        return NO_DECLARED_LANGS;
    }
    try {
        return readDeclaredLangs(lezerToDast(source));
    } catch {
        return NO_DECLARED_LANGS;
    }
}
