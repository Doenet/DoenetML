import type { FlatElement, NormalizedRoot } from "@doenet/doenetml-worker";
import type { DiagnosticRecord } from "@doenet/utils";
import { ComponentInfoObjects } from "../componentInfoObjects";
import { codedDiagnostic } from "../diagnostics";

/**
 * Names are matched exactly, as written (NAME-0, D51): a tag, an attribute
 * and a property. This file holds the two helpers every place that reports a
 * name in another case shares, and the one place an attribute name in
 * another case is still applied.
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
 * Attributes read by their exact name before the JavaScript core sees the
 * document: a component's `name` and its `extend`, `copy` and
 * `copyWithState` (the reference resolver, `ref_expand.rs` and
 * `build_resolver.rs`), and a repeat's `valueName` and `indexName` (the
 * parser's sugar, `repeat.ts`). Written in another case, they never worked
 * (`Name` was "Cannot repeat attribute", `ValueName` made no `$v`), or, for
 * `extend` and `copy`, worked only because the resolver ignored case. Each
 * is now an unknown attribute (`doenet-e0004`, suggesting the name), not one
 * applied with a warning, since applying it here would be too late.
 */
const READ_BEFORE_THE_CORE = new Set([
    "name",
    "extend",
    "copy",
    "copywithstate",
    "valuename",
    "indexname",
]);

/**
 * An attribute name written in another case than the component's (D51) is
 * applied under the component's spelling, with a warning that it will be an
 * error (`doenet-w0197`). This is the one-release fallback D51 allows: the
 * scan for wrong-case names found `<graph xmin xmax ymin ymax>` in most of
 * the documentation's graphs, so authors have copied them widely.
 *
 * It renames the attribute on the normalized DAST in place, before anything
 * else in the JavaScript core reads it, so that everything after (the checks
 * at load, the conversion to components, the sugar) matches attribute names
 * exactly. Making it an error in a later release is a change here alone:
 * leave the attribute as written and it is `doenet-e0004`
 * (`expandAllUnflattenedAttributes`), with the suggestion.
 *
 * An attribute is the component's when its class declares it, or, on a tag
 * with `extend`, `copy` or `copyWithState`, when the `_copy` it is made into
 * declares it (`asList`). A tag that is not a component type as written (an
 * error, `doenet-e0002`), a class that accepts any attribute (`<module>`) and
 * a namespaced attribute (`xmlns:…`) are left alone, as are the attributes in
 * `READ_BEFORE_THE_CORE`.
 */
export function correctAttributeNameCase({
    normalizedRoot,
    componentInfoObjects,
    componentTypeOf,
}: {
    normalizedRoot: NormalizedRoot;
    componentInfoObjects: ComponentInfoObjects;
    /** The component type of an element (a division's is its `type`). */
    componentTypeOf: (element: FlatElement) => string;
}): DiagnosticRecord[] {
    const diagnostics: DiagnosticRecord[] = [];
    const attributeNamesOf = new Map<string, string[]>();
    function attributeNames(componentType: string): string[] {
        let names = attributeNamesOf.get(componentType);
        if (names === undefined) {
            names = Object.keys(
                componentInfoObjects.allComponentClasses[
                    componentType
                ].createAttributesObject(),
            );
            attributeNamesOf.set(componentType, names);
        }
        return names;
    }

    for (const node of normalizedRoot.nodes) {
        if (node.type !== "element") {
            continue;
        }
        const componentType = componentTypeOf(node);
        const componentClass =
            componentInfoObjects.allComponentClasses[componentType];
        if (!componentClass || componentClass.acceptAnyAttribute) {
            continue;
        }
        const known = attributeNames(componentType);
        const candidates = node.extending
            ? [...known, ...attributeNames("_copy")]
            : known;
        const written = new Set(node.attributes.map((attr) => attr.name));
        for (const attribute of node.attributes) {
            const name = attribute.name;
            if (
                name.includes(":") ||
                READ_BEFORE_THE_CORE.has(name.toLowerCase())
            ) {
                continue;
            }
            const corrected = nameDifferingOnlyInCase(name, candidates);
            // Written twice, in two cases (`xMin="1" xmin="2"`), the one in
            // another case is left as written: it is an unknown attribute
            // (`doenet-e0004`, suggesting `xMin`), as a misspelling is.
            if (corrected === undefined || written.has(corrected)) {
                continue;
            }
            diagnostics.push(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0197",
                    args: {
                        attribute: name,
                        suggestion: corrected,
                        componentType,
                    },
                    position: attribute.position ?? node.position,
                    sourceDoc: attribute.sourceDoc ?? node.sourceDoc,
                }),
            );
            attribute.name = corrected;
            written.add(corrected);
        }
    }
    return diagnostics;
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
