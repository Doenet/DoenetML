import { FlatElement, FlatFragment } from "@doenet/doenetml-worker";
import { SerializedComponent } from "./dast/types";
import { unwrapSource } from "./dast/convertNormalizedDast";
import { UnflattenedComponent } from "./dast/intermediateTypes";
import type { ComponentInstance } from "../types/componentInstance";

/**
 * Convert the `serializedComponents` into `FlatElements` and add them to `flatFragment` as children to `parentIdx`
 */
export function addNodesToFlatFragment({
    flatFragment,
    serializedComponents,
    parentIdx,
}: {
    flatFragment: FlatFragment;
    serializedComponents: (
        | SerializedComponent
        | UnflattenedComponent
        | string
    )[];
    parentIdx: number;
}) {
    for (const comp of serializedComponents) {
        if (typeof comp === "string") {
            continue;
        }

        let componentIdx = getEffectiveComponentIdx(comp);

        const flatElement: FlatElement = {
            type: "element",
            name: comp.componentType,
            parent: parentIdx,
            children: [],
            attributes: [],
            idx: componentIdx,
            sourceDoc: comp.sourceDoc,
        };

        if (comp.children) {
            flatElement.children = comp.children.map((child) => {
                if (typeof child === "string") {
                    return child;
                } else {
                    return getEffectiveComponentIdx(child);
                }
            });
            addNodesToFlatFragment({
                flatFragment,
                serializedComponents: comp.children,
                parentIdx: componentIdx,
            });
        }

        const name = getEffectiveComponentName(comp);

        if (name) {
            flatElement.attributes.push({
                type: "attribute",
                name: "name",
                parent: componentIdx,
                children: [name],
                sourceDoc: comp.sourceDoc,
            });
        }

        if (comp.type === "unflattened") {
            for (const attrName in comp.attributes) {
                const attribute = comp.attributes[attrName];
                if (attribute.children) {
                    addNodesToFlatFragment({
                        flatFragment,
                        serializedComponents: attribute.children,
                        parentIdx: componentIdx,
                    });
                }
            }
        } else {
            for (const attrName in comp.attributes) {
                const attribute = comp.attributes[attrName];

                switch (attribute.type) {
                    case "primitive":
                        // we already dealt with name, above
                        if (
                            attrName === "name" ||
                            attrName === "createComponentName"
                        ) {
                            break;
                        }
                        const attributeChildren = Array.isArray(
                            attribute.primitive.value,
                        )
                            ? attribute.primitive.value.map((v) => v.toString())
                            : [attribute.primitive.value.toString()];
                        flatElement.attributes.push({
                            type: "attribute",
                            name: attrName,
                            parent: componentIdx,
                            children: attributeChildren,
                            sourceDoc: attribute.sourceDoc,
                        });
                        break;
                    case "component":
                        flatElement.attributes.push({
                            type: "attribute",
                            name: attrName,
                            parent: componentIdx,
                            children: [
                                getEffectiveComponentIdx(attribute.component),
                            ],
                            sourceDoc: attribute.sourceDoc,
                        });
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: [attribute.component],
                            parentIdx: componentIdx,
                        });
                        break;
                    case "references":
                        flatElement.attributes.push({
                            type: "attribute",
                            name: attrName,
                            parent: componentIdx,
                            children: attribute.references.map(
                                getEffectiveComponentIdx,
                            ),
                            sourceDoc: attribute.sourceDoc,
                        });
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: attribute.references,
                            parentIdx: componentIdx,
                        });

                        break;

                    case "unresolved":
                        flatElement.attributes.push({
                            type: "attribute",
                            name: attrName,
                            parent: componentIdx,
                            children: attribute.children.map((child) =>
                                typeof child === "string"
                                    ? child
                                    : getEffectiveComponentIdx(child),
                            ),
                            sourceDoc: attribute.sourceDoc,
                        });
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: attribute.children,
                            parentIdx: componentIdx,
                        });
                        break;
                }
            }
        }

        if (comp.extending) {
            if (comp.type === "unflattened") {
                const refResolution = unwrapSource(comp.extending);

                for (const part of refResolution.originalPath) {
                    for (const index of part.index) {
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: index.value,
                            parentIdx: componentIdx,
                        });
                    }
                }
            } else {
                const refResolution = unwrapSource(comp.extending);

                for (const part of refResolution.originalPath) {
                    for (const index of part.index) {
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: index.value,
                            parentIdx: componentIdx,
                        });
                    }
                }
            }
        }

        if (comp.position) {
            flatElement.position = JSON.parse(JSON.stringify(comp.position));
        }

        const idxInNodes = flatFragment.nodes.length;

        flatFragment.nodes[idxInNodes] = flatElement;
        flatFragment.idxMap[componentIdx] = idxInNodes;
    }
}

/**
 * Return the effective component index of `component`,
 * which means the component index is overridden by the `createComponentIdx` attribute, if it exists.
 */
export function getEffectiveComponentIdx(
    component: SerializedComponent | UnflattenedComponent,
) {
    let componentIdx = component.componentIdx;

    if (component.type === "unflattened") {
        if (component.attributes.createComponentIdx?.children.length === 1) {
            const child = component.attributes.createComponentIdx.children[0];
            if (typeof child === "string") {
                const idx = Number(child);
                if (Number.isInteger(idx)) {
                    componentIdx = idx;
                }
            }
        }
    } else {
        if (component.attributes.createComponentIdx?.type === "primitive") {
            if (
                component.attributes.createComponentIdx.primitive.type ===
                "number"
            ) {
                componentIdx =
                    component.attributes.createComponentIdx.primitive.value;
            }
        }
    }

    return componentIdx;
}

/**
 * Return the effective component name of `component`,
 * which means the component name is overridden by the `createComponentName` attribute, if it exists.
 * Return `null` if neither `name` nor `createComponentName` attribute exists.
 */
function getEffectiveComponentName(
    component: SerializedComponent | UnflattenedComponent,
) {
    if (component.type === "unflattened") {
        if (component.attributes.createComponentName?.children.length === 1) {
            const child = component.attributes.createComponentName.children[0];
            if (typeof child === "string") {
                return child;
            }
        }

        if (component.attributes.name?.children.length === 1) {
            const child = component.attributes.name.children[0];
            if (typeof child === "string") {
                return child;
            }
        }

        return null;
    } else {
        if (
            component.attributes.createComponentName?.type === "primitive" &&
            component.attributes.createComponentName.primitive.type === "string"
        ) {
            return component.attributes.createComponentName.primitive.value;
        } else if (
            component.attributes.name?.type === "primitive" &&
            component.attributes.name.primitive.type === "string"
        ) {
            return component.attributes.name.primitive.value;
        } else {
            return null;
        }
    }
}

/**
 * Walk a tree of `replacements`, locating where the copy with index
 * `copyComponentIdx` appears in the flattened (composite-expanded) list, and
 * return the slice indices.
 *
 * Used by `ResolverAdapter.determineParentAndIndexResolutionForResolver` to
 * translate a copy component's location back to a range in its
 * `replacementOf`'s flattened replacements, for the resolver's `ReplaceRange`
 * index resolution.
 *
 * Behaviour preserved verbatim from the original closure form in
 * `ResolverAdapter`:
 * - Withheld replacements (`stateValues.isInactiveCompositeReplacement`)
 *   and blank-string replacements are skipped.
 * - Expanded `_copy` replacements are substituted in place by their own
 *   replacements (recursively); unexpanded copies remain.
 * - When `copyComponentIdx` matches at the current level, `startIdx`/`endIdx`
 *   are set to the position in the current level's flattened result. A match
 *   at the current level overrides any match found in a recursive call (the
 *   original code mutated outer-scope variables, so the last write — the
 *   parent level — won).
 * - When `updateStart`/`updateEnd` are provided and the match falls inside an
 *   expanded copy, the indices are offset by `updateStart`/`updateEnd` instead
 *   of spanning the whole expansion.
 */
export async function calcStartEndIdx({
    replacements,
    copyComponentIdx,
    updateStart,
    updateEnd,
}: {
    replacements: (ComponentInstance | string)[];
    copyComponentIdx: number;
    updateStart?: number;
    updateEnd?: number;
}): Promise<{
    flattenedReplacements: (ComponentInstance | string)[];
    startIdx?: number;
    endIdx?: number;
}> {
    const nonWithheldReplacements: (ComponentInstance | string)[] = [];
    for (const repl of replacements) {
        if (
            typeof repl === "string" ||
            !(await repl.stateValues.isInactiveCompositeReplacement)
        ) {
            nonWithheldReplacements.push(repl);
        }
    }

    const nonBlankStringReplacements = nonWithheldReplacements.filter(
        (x) => typeof x !== "string" || x.trim() !== "",
    );

    const flattenedReplacements: (ComponentInstance | string)[] = [];
    let startIdx: number | undefined;
    let endIdx: number | undefined;
    let i = 0;

    for (const repl of nonBlankStringReplacements) {
        if (typeof repl === "string" || repl.componentType !== "_copy") {
            flattenedReplacements.push(repl);
            i++;
            continue;
        }

        if (!repl.isExpanded) {
            if (repl.componentIdx === copyComponentIdx) {
                startIdx = i;
                endIdx = i + 1;
            }
            flattenedReplacements.push(repl);
            i++;
            continue;
        }

        let replReplacements = repl.replacements ?? [];
        if (repl.replacementsToWithhold) {
            replReplacements = replReplacements.slice(
                0,
                replReplacements.length - repl.replacementsToWithhold,
            );
        }

        const recursionResult = await calcStartEndIdx({
            replacements: replReplacements,
            copyComponentIdx,
            updateStart,
            updateEnd,
        });
        const newReplacements = recursionResult.flattenedReplacements;
        const n = newReplacements.length;

        // The recursion may have produced a match. The current level's own
        // match (below) overrides it — preserving the closure-mutation
        // semantics of the original code.
        if (recursionResult.startIdx !== undefined) {
            startIdx = recursionResult.startIdx;
            endIdx = recursionResult.endIdx;
        }

        if (repl.componentIdx === copyComponentIdx) {
            if (updateStart !== undefined && updateEnd !== undefined) {
                startIdx = i + updateStart;
                endIdx = i + updateEnd;
            } else {
                startIdx = i;
                endIdx = i + n;
            }
        }

        flattenedReplacements.push(...newReplacements);
        i += n;
    }

    return { flattenedReplacements, startIdx, endIdx };
}
