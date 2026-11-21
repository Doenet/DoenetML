import { ComponentInfoObjects } from "../componentInfoObjects";

/**
 * Names are matched exactly, as written (NAME-0, D51): a tag, an attribute
 * and a property. This file holds what the places that report a name in
 * another case share, to suggest the name it differs from only in case, and
 * the renaming of an attribute in another case, which is still applied for
 * now, with a warning (`doenet-w0197`): by the parser
 * (`attribute-name-case.ts`) for what the schema lists, and here, as a
 * backstop, for what it does not (`attributeNameCaseCorrections`).
 */

/**
 * The attributes of `written` that are written in another case than one of
 * `known`, each with the spelling of `known` to apply it under, for now
 * (`doenet-w0197`, D51's migration). The same rule as the parser's
 * (`attribute-name-case.ts`), which renames those the schema lists; this is
 * the backstop for those it does not: an attribute the schema hides
 * (`<subsetOfRealsInput xmin>`), and every attribute of a tag the schema
 * hides (`<panel>`). An attribute in `known`, a namespaced one (`xmlns:…`),
 * one matching two of `known` that differ only in case, and one whose
 * spelling in `known` is written too (`xMin="1" xmin="2"`), or was given to
 * one before it, are left as written: an attribute the component doesn't
 * have (`doenet-e0004`). So is one in `exclude`.
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

/**
 * The one of `candidates` that `written` differs from only in case, if any,
 * to suggest in the message for a name that matches nothing (`doenet-e0002`,
 * `doenet-e0004`, `doenet-w0104`, `doenet-w0187`). `undefined` when `written`
 * is itself one of them, or none or several match.
 */
export function nameDifferingOnlyInCase(
    written: string,
    candidates: Iterable<string>,
): string | undefined {
    const lower = written.toLowerCase();
    let found: string | undefined = undefined;
    for (const candidate of candidates) {
        if (candidate === written) {
            return undefined;
        }
        if (candidate.toLowerCase() === lower) {
            if (found !== undefined && found !== candidate) {
                return undefined;
            }
            found = candidate;
        }
    }
    return found;
}

/**
 * The arguments a message that can suggest a name takes: `suggestion` and
 * `hasSuggestion` (`true` or `false`, as Fluent selects on a string).
 */
export function suggestionArgs(suggestion: string | undefined): {
    suggestion: string;
    hasSuggestion: "true" | "false";
} {
    return suggestion === undefined
        ? { suggestion: "", hasSuggestion: "false" }
        : { suggestion, hasSuggestion: "true" };
}

/**
 * The reference `reference` (as written, `$P.X`) with its property `propName`
 * replaced by the public property of `componentType` it differs from only in
 * case (`$P.x`), to suggest when the property names nothing
 * (`doenet-w0104`). `undefined` when there is none, or the property is not
 * found in the reference as written.
 */
export function referenceWithPropertyCase({
    reference,
    propName,
    componentTypes,
    componentInfoObjects,
}: {
    reference: string;
    propName: string | undefined;
    /**
     * The types the property is read from: the component named, and, after
     * a collection, its items (`$g.Fixed` of a group holding a repeat).
     */
    componentTypes: string[];
    componentInfoObjects: ComponentInfoObjects;
}): string | undefined {
    if (!propName || !reference) {
        return undefined;
    }
    const candidates = new Set<string>();
    for (const componentType of componentTypes) {
        const info = (componentInfoObjects.publicStateVariableInfo as any)[
            componentType
        ];
        for (const name of [
            ...Object.keys(info?.stateVariableDescriptions ?? {}),
            ...Object.keys(info?.aliases ?? {}),
        ]) {
            candidates.add(name);
        }
    }
    const corrected = nameDifferingOnlyInCase(propName, candidates);
    if (corrected === undefined) {
        return undefined;
    }
    // The property after a `.`, as a whole name (not `$P.Xs` for `X`).
    const pattern = new RegExp(
        `\\.${propName.replace(/[$]/g, "\\$&")}(?![\\w])`,
    );
    if (!pattern.test(reference)) {
        return undefined;
    }
    return reference.replace(pattern, `.${corrected}`);
}
