import { readLangAttribute } from "@doenet/parser";
import type { DastElement, DastRoot } from "@doenet/parser";

export { readDeclaredLangs } from "@doenet/parser";

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
 * Which `<document>` and how its `lang` is read are separate questions: this
 * one answers the first, and {@link readLangAttribute} the second, by the same
 * rules the core applies — so the label and the language the content is
 * rendered in cannot come from different readings of the same attribute.
 */
export function readDocumentLang(dast: DastRoot): string | undefined {
    const documentElement = dast.children.find(
        (child): child is DastElement =>
            child.type === "element" && child.name === "document",
    );
    return documentElement && readLangAttribute(documentElement);
}
