import { ComponentInfoObjects } from "../componentInfoObjects";

/**
 * Names are matched exactly, as written (NAME-0, D51): a tag, an attribute
 * and a property. This file holds what the places that report a name in
 * another case share, to suggest the name it differs from only in case.
 *
 * An attribute in another case is still applied for now, with a warning
 * (`doenet-w0197`): renamed by the parser
 * (`attribute-name-case.ts`) for what the schema lists, and by the core, as a
 * backstop, for what it does not (`correctAttributeNameCase` in
 * `convertNormalizedDast.ts`). The two share one rule,
 * `attributeNameCaseCorrections` in `@doenet/parser/attribute-name-case`.
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
 * The property of one of `componentTypes` that `propName` names in another
 * case, as it should be written, to suggest when `propName` names nothing
 * (D51): a public property or alias in its own case (`X` → `x`), or an array
 * entry in the index form (NAME-2), as entries are reached by index
 * (`X1` → `xs[1]`, `Vertex2` → `vertices[2]`, `VertexX2_1` →
 * `vertices[2][1]`). An entry whose index form can't be written is suggested
 * by its name in its own case, as is every entry with `entriesByIndex`
 * `false`, for where a property is named alone, without a reference
 * (`sortByProp="x1"`). `undefined` when there is none, or the types suggest
 * different ones.
 */
export function propertyDifferingOnlyInCase({
    propName,
    componentTypes,
    componentInfoObjects,
    entriesByIndex = true,
}: {
    propName: string | undefined;
    componentTypes: string[];
    componentInfoObjects: ComponentInfoObjects;
    entriesByIndex?: boolean;
}): string | undefined {
    if (!propName) {
        return undefined;
    }
    const suggestions = new Set<string>();
    for (const componentType of componentTypes) {
        const info = (componentInfoObjects.publicStateVariableInfo as any)[
            componentType
        ];
        if (!info) {
            continue;
        }
        const names = [
            ...Object.keys(info.stateVariableDescriptions ?? {}),
            ...Object.keys(info.aliases ?? {}),
        ];
        if (names.includes(propName)) {
            // It names a property of this one; not a matter of case.
            return undefined;
        }
        const corrected = nameDifferingOnlyInCase(propName, names);
        const entry =
            corrected === undefined
                ? arrayEntryInIndexForm(propName, info, entriesByIndex)
                : undefined;
        if (entry === null) {
            return undefined;
        }
        const suggestion = corrected ?? entry;
        if (suggestion !== undefined) {
            suggestions.add(suggestion);
        }
    }
    return suggestions.size === 1 ? [...suggestions][0] : undefined;
}

/**
 * The array entry of a component (with public properties `info`) that
 * `propName` names in another case, in the index form (`X1` → `xs[1]`), or by
 * its name in its own case when the index form doesn't name the same entries
 * (a matrix's `row2`). `null` when `propName` is an entry as written (an
 * index past the end is not a matter of case), `undefined` when it is none.
 */
function arrayEntryInIndexForm(
    propName: string,
    info: any,
    byIndex: boolean,
): string | null | undefined {
    const lower = propName.toLowerCase();
    const prefixes = Object.keys(info.arrayEntryPrefixes ?? {}).sort(
        (a, b) => b.length - a.length,
    );
    for (const prefix of prefixes) {
        if (!lower.startsWith(prefix.toLowerCase())) {
            continue;
        }
        const varEnding = propName.substring(prefix.length);
        if (!/^[1-9]\d*(_[1-9]\d*)*$/.test(varEnding)) {
            continue;
        }
        if (propName.startsWith(prefix)) {
            return null;
        }
        const arrayName = info.arrayEntryPrefixes[prefix].arrayVariableName;
        const description = info.stateVariableDescriptions[arrayName];
        if (!description?.getArrayKeysFromVarName) {
            continue;
        }
        const indices = varEnding.split("_").map(Number);
        const numDimensions = description.numDimensions ?? 1;
        if (indices.length > numDimensions) {
            continue;
        }
        // Compare the entries the name gives with those the index form gives
        // in a small array, for an entry no further than its third in each
        // dimension: which entries a name gives doesn't depend on how far
        // along they are, and an array as large as the index written would
        // make this as slow as that index is large (`$poly.VERTEX100000`).
        const sample = indices.map((index) => Math.min(index, 3));
        const arraySize = Array(numDimensions).fill(3);
        const keysOfName: string[] = description.getArrayKeysFromVarName({
            arrayEntryPrefix: prefix,
            varEnding: sample.join("_"),
            arraySize,
            numDimensions,
        });
        const keysOfIndexForm = subarrayKeys(
            sample.map((index) => index - 1),
            arraySize.slice(indices.length),
        );
        const sameEntries =
            keysOfName.length === keysOfIndexForm.length &&
            keysOfIndexForm.every((key) => keysOfName.includes(key));
        if (keysOfName.length === 0) {
            continue;
        }
        return sameEntries && byIndex
            ? `${arrayName}${indices.map((index) => `[${index}]`).join("")}`
            : `${prefix}${varEnding}`;
    }
    return undefined;
}

/**
 * The keys (`"0,1"`) of the entries of an array at `indices` (from 0), whose
 * remaining dimensions have sizes `remainingSize`.
 */
function subarrayKeys(indices: number[], remainingSize: number[]): string[] {
    let keys: number[][] = [indices];
    for (const size of remainingSize) {
        keys = keys.flatMap((key) =>
            Array.from({ length: size }, (_, i) => [...key, i]),
        );
    }
    return keys.map((key) => String(key));
}

/**
 * The reference `reference` (as written, `$P.X`) with its property `propName`
 * replaced by the public property of `componentTypes` it differs from only in
 * case (`$P.x`; an array entry in the index form, `$P.X1` → `$P.xs[1]`,
 * {@link propertyDifferingOnlyInCase}), to suggest when the property names
 * nothing (`doenet-w0104`). `undefined` when there is none, or the property is not
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
    const corrected = propertyDifferingOnlyInCase({
        propName,
        componentTypes,
        componentInfoObjects,
    });
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
