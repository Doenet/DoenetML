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
 * `lang` is a plain string attribute, so its value is the concatenation of its
 * text children.
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
    const attributes = documentElement?.attributes ?? {};
    const langName = Object.keys(attributes).find(
        (name) => name.toLowerCase() === "lang",
    );
    const langAttribute =
        langName === undefined ? undefined : attributes[langName];
    if (!langAttribute) {
        return undefined;
    }
    const value = langAttribute.children
        .map((child) => (child.type === "text" ? child.value : ""))
        .join("");
    return value.trim() || undefined;
}
