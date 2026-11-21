import { ComponentInfoObjects } from "../componentInfoObjects";

/**
 * Names are matched exactly, as written (NAME-0, D51): a tag, an attribute
 * and a property. This file holds what the places that report a name in
 * another case share, to suggest the name it differs from only in case. (An
 * attribute in another case is still applied for now, with a warning, by the
 * parser: `attribute-name-case.ts`.)
 */

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
