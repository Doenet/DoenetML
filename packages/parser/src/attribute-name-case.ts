/**
 * The rule for an attribute written in another case than its component's
 * (D51, NAME-0), shared by the parser (`dast-normalize/attribute-name-case.ts`,
 * which renames those the schema lists) and the JavaScript core
 * (`correctAttributeNameCase` in `convertNormalizedDast.ts`, the backstop for
 * those the schema hides, and `moduleAttributesWritten` in
 * `utils/moduleAttributeNames.ts`, for the attributes a `<module>` declares),
 * so that they can't drift apart. Exported as
 * `@doenet/parser/attribute-name-case`, with nothing else, as the core needs
 * only this.
 *
 * Attribute names are matched exactly, but for one release an attribute
 * written in another case is still applied, under the component's spelling,
 * with a warning that it will be an error (`doenet-w0197`). Making it an
 * error is dropping the callers of {@link attributeNameCaseCorrections}:
 * without the rename, the attribute is one the component doesn't have
 * (`doenet-e0004`, which suggests the spelling), or, on a `<module>`, sets
 * no module attribute.
 */

/** Attributes every tag takes, which no component declares. */
export const ATTRIBUTES_OF_EVERY_TAG = ["extend", "copy", "copyWithState"];

/** The attributes of the copy a tag with `extend` or `copy` is made into. */
export const ATTRIBUTES_OF_A_COPY = ["asList", "removeEmptyArrayEntries"];

/**
 * The attributes of `written` that are written in another case than one of
 * `known`, each with the spelling of `known` to apply it under, for now
 * (`doenet-w0197`), in the order written.
 *
 * Left as written, so an attribute the component doesn't have
 * (`doenet-e0004`):
 * - one in `known` (it is matched exactly);
 * - a namespaced one (`xmlns:…`, `source:sequence`);
 * - one matching two of `known` that differ only in case;
 * - one whose spelling in `known` is written too (`xMin="1" xmin="2"`), or
 *   was given to one written before it (`xmin="1" XMIN="2"`);
 * - one whose spelling is in `exclude`.
 */
export function attributeNameCaseCorrections({
    written,
    known,
    exclude = [],
}: {
    written: string[];
    known: Iterable<string>;
    exclude?: string[];
}): { written: string; corrected: string }[] {
    const knownSet = new Set(known);
    const byLowerCase = new Map<string, string | null>();
    for (const name of knownSet) {
        if (exclude.includes(name)) {
            continue;
        }
        const lower = name.toLowerCase();
        // Two that differ only in case match neither.
        byLowerCase.set(lower, byLowerCase.has(lower) ? null : name);
    }
    const present = new Set(written);
    const corrections: { written: string; corrected: string }[] = [];
    for (const name of written) {
        if (knownSet.has(name) || name.includes(":")) {
            continue;
        }
        const corrected = byLowerCase.get(name.toLowerCase());
        if (!corrected || present.has(corrected)) {
            continue;
        }
        present.add(corrected);
        corrections.push({ written: name, corrected });
    }
    return corrections;
}
