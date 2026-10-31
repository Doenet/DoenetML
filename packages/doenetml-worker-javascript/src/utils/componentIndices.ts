import { Source } from "@doenet/doenetml-worker";
import {
    UnflattenedComponent,
    UnflattenedIndex,
    UnflattenedPathPart,
    UnflattenedRefResolution,
} from "./dast/intermediateTypes";
import {
    SerializedAttribute,
    SerializedComponent,
    SerializedPathIndex,
    SerializedRefResolution,
    SerializedRefResolutionPathPart,
} from "./dast/types";
import { addSource, unwrapSource } from "./dast/convertNormalizedDast";

/**
 * What the `stateId`s of copies of `composite`'s replacements add after the
 * copy's own: `""` unless `composite`'s replacements can come from different
 * parts of its DoenetML, as the cases of a `<conditionalContent>` do
 * (`stateIdSegmentForCopiesOfReplacements`). A copy counts the ids of the
 * components it makes from its own, so without the segment each part would
 * give them the same ones, and what was saved of one part's components would
 * be applied to another's. A composite that shadows another holds the segment
 * of the replacements it made its own from (`shadowReplacementsStateIdPrefix`).
 */
export async function stateIdSegmentForCopiesOfReplacements(
    composite: any,
): Promise<string> {
    const segmentOfShadowed =
        composite?.replacementsWorkspace?.stateIdSegmentOfShadowed;
    if (segmentOfShadowed !== undefined) {
        return segmentOfShadowed;
    }
    return (
        (await composite?.constructor.stateIdSegmentForCopiesOfReplacements?.(
            composite,
        )) ?? ""
    );
}

/**
 * What the `stateId`s of the components a copy makes from `component` add
 * after the copy's own: the segment (`stateIdSegmentForCopiesOfReplacements`)
 * of each composite that `component` is a replacement of, or is in a
 * replacement of, outermost first. A component named in a case of a
 * `<conditionalContent>` is in a replacement of the case's `<group>`, which is
 * a replacement of the `<conditionalContent>`, so the composites are followed
 * out through `replacementOf`.
 */
export async function stateIdSegmentForCopyOf(component: any): Promise<string> {
    let segment = "";
    for (
        let composite = component?.replacementOf;
        composite;
        composite = composite.replacementOf
    ) {
        segment =
            (await stateIdSegmentForCopiesOfReplacements(composite)) + segment;
    }
    return segment;
}

/**
 * Recurse through all serialized components and update their component indices
 * to new values, starting with `nComponents`.
 *
 * If `idxMapOverride` is supplied, then use that map to create any matching indices rather than creating new indices.
 *
 * With `keepReferents`, the components are pasted from a source: what an
 * unlinked copy (`copy=`) pastes, or an attribute that a copy of a property or
 * list entry takes from its source (`replacementFromProp` in `Copy.js`). Each
 * reference in them keeps the referent it had in the source
 * (`remapCopiedRefResolution`). Otherwise a reference is resolved again from
 * where its copy lands, which is what lets the copy of `$i` in each iteration
 * of a `<repeat>` find that iteration's `i`.
 *
 * Returns:
 * - `components`: the components with new indices
 * - `nComponents`: the new value of `nComponents`, one greater than the last component index assigned
 */
export function createNewComponentIndices(
    serializedComponents: (SerializedComponent | string)[],
    nComponents: number,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
    idxMapOverride?: Record<number, number>,
    { keepReferents = false }: { keepReferents?: boolean } = {},
) {
    const result = createNewComponentIndicesSub(
        serializedComponents,
        nComponents,
        stateIdInfo,
        idxMapOverride,
    );

    const newComponents = result.components;
    const idxMap = result.idxMap;
    nComponents = result.nComponents;

    remapRefResolutions(newComponents, idxMap, keepReferents);

    return {
        components: newComponents,
        nComponents,
    };
}

function createNewComponentIndicesSub(
    serializedComponents: (SerializedComponent | string)[],
    nComponents: number,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
    idxMapOverride?: Record<number, number>,
) {
    const newComponents: (SerializedComponent | string)[] = [];
    const idxMap: Record<number, number> = {};

    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        const newComponent: SerializedComponent = { ...component };

        newComponent.originalIdx = component.componentIdx;
        const override = idxMapOverride?.[newComponent.originalIdx];
        newComponent.componentIdx = override ?? nComponents++;
        idxMap[newComponent.originalIdx] = newComponent.componentIdx;
        if (stateIdInfo) {
            newComponent.stateId = `${stateIdInfo.prefix}${stateIdInfo.num++}`;
        } else {
            newComponent.stateId = undefined;
        }

        const childResult = createNewComponentIndicesSub(
            component.children,
            nComponents,
            stateIdInfo,
            idxMapOverride,
        );
        newComponent.children = childResult.components;
        Object.assign(idxMap, childResult.idxMap);
        nComponents = childResult.nComponents;

        const attrResult = newComponentIndicesForAttributes(
            component.attributes,
            nComponents,
            idxMap,
            idxMapOverride,
            stateIdInfo,
        );
        newComponent.attributes = attrResult.attributes;
        nComponents = attrResult.nComponents;

        if (newComponent.extending) {
            const extendResult = newComponentIndicesForExtending(
                newComponent.extending,
                nComponents,
                idxMap,
                idxMapOverride,
                stateIdInfo,
            );

            newComponent.extending = extendResult.extending;
            nComponents = extendResult.nComponents;
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, idxMap, nComponents };
}

function newComponentIndicesForExtending(
    extending: Source<SerializedRefResolution>,
    nComponents: number,
    idxMap: Record<number, number>,
    idxMapOverride?: Record<number, number>,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const refResolution = unwrapSource(extending);

    const originalPath: SerializedRefResolutionPathPart[] = [];
    for (const pathPath of refResolution.originalPath) {
        const newPathPart = { ...pathPath };
        const index: SerializedPathIndex[] = [];
        for (const indexPart of newPathPart.index) {
            const newIndexPart = { ...indexPart };

            const indexResult = createNewComponentIndicesSub(
                newIndexPart.value,
                nComponents,
                stateIdInfo,
                idxMapOverride,
            );
            newIndexPart.value = indexResult.components;
            Object.assign(idxMap, indexResult.idxMap);
            nComponents = indexResult.nComponents;
            index.push(newIndexPart);
        }
        newPathPart.index = index;
        originalPath.push(newPathPart);
    }

    // Clone once, after the path has been rebuilt, so that a duplicate never
    // shares its `extending` with the component it was copied from. A path
    // with no parts at all reaches here from an unresolvable reference
    // (`convertNormalizedDast` gives those an empty `originalPath`), and that
    // is the case that would otherwise hand back the source's own object.
    const newRefResolution = { ...refResolution, originalPath };

    return {
        extending: addSource(newRefResolution, extending),
        nComponents,
    };
}

function newComponentIndicesForAttributes(
    attributes: Record<string, SerializedAttribute>,
    nComponents: number,
    idxMap: Record<number, number>,
    idxMapOverride?: Record<number, number>,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const newAttributes: Record<string, SerializedAttribute> = {};

    for (const attrName in attributes) {
        const attribute = { ...attributes[attrName] };
        newAttributes[attrName] = attribute;

        if (attribute.type === "component") {
            const attrResult = createNewComponentIndicesSub(
                [attribute.component],
                nComponents,
                stateIdInfo,
                idxMapOverride,
            );
            attribute.component = attrResult
                .components[0] as SerializedComponent;
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "references") {
            const attrResult = createNewComponentIndicesSub(
                attribute.references,
                nComponents,
                stateIdInfo,
                idxMapOverride,
            );
            attribute.references =
                attrResult.components as SerializedComponent[];
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "unresolved") {
            const attrResult = createNewComponentIndicesUnflattened(
                attribute.children,
                nComponents,
                stateIdInfo,
            );
            attribute.children = attrResult.components;
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "primitive") {
            if (
                attrName === "_createComponentIdx" &&
                attribute.primitive.type === "number"
            ) {
                const originalIdx = attribute.primitive.value;
                const override = idxMapOverride?.[originalIdx];
                const newIdx = override ?? nComponents++;
                attribute.primitive = { type: "number", value: newIdx };
                idxMap[originalIdx] = newIdx;
            }
        } else if (attribute.type === "expression") {
            // Its slots are its own, as a reference's resolution is, so that
            // `remapRefResolutions` renumbers them and not those of what was
            // copied, which may be copied again (a repeat's template).
            (newAttributes[attrName] as any) = {
                ...attribute,
                slots: (attribute as any).slots.map((slot: any) => ({
                    ...slot,
                    refResolution: structuredClone(slot.refResolution),
                })),
            };
        } else if (
            attribute.type === "variableRef" ||
            attribute.type === "literal"
        ) {
            // a reference to a component outside what is being copied, or a
            // value: no component to number
        } else {
            console.error("Found invalid attribute", attribute);
            throw Error("Found invalid attribute");
        }
    }
    return { attributes: newAttributes, nComponents };
}

/**
 * Recurse through all unflattened components and update their component indices
 * to new values, starting with `nComponents`
 *
 * Returns:
 * - `components`: the components with new indices
 * - `nComponents`: the new value of `nComponents`, one greater than the last component index assigned
 */
function createNewComponentIndicesUnflattened(
    serializedComponents: (UnflattenedComponent | string)[],
    nComponents: number,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const newComponents: (UnflattenedComponent | string)[] = [];
    const idxMap: Record<number, number> = {};

    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        const newComponent: UnflattenedComponent = { ...component };

        newComponent.originalIdx = component.componentIdx;
        newComponent.componentIdx = nComponents++;
        idxMap[newComponent.originalIdx] = newComponent.componentIdx;
        newComponent.stateId = stateIdInfo
            ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
            : undefined;

        const childResult = createNewComponentIndicesUnflattened(
            component.children,
            nComponents,
            stateIdInfo,
        );
        newComponent.children = childResult.components;
        Object.assign(idxMap, childResult.idxMap);
        nComponents = childResult.nComponents;

        newComponent.attributes = { ...component.attributes };
        for (const attrName in newComponent.attributes) {
            const attribute = { ...newComponent.attributes[attrName] };
            newComponent.attributes[attrName] = attribute;

            const attrResult = createNewComponentIndicesUnflattened(
                attribute.children,
                nComponents,
                stateIdInfo,
            );
            attribute.children = attrResult.components;
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;

            if (
                attrName === "_createComponentIdx" &&
                attribute.children.length === 1 &&
                typeof attribute.children[0] === "string"
            ) {
                const originalIdx = Number(attribute.children[0]);
                if (Number.isInteger(originalIdx)) {
                    const newIdx = nComponents++;
                    attribute.children[0] = newIdx.toString();
                    idxMap[originalIdx] = newIdx;
                }
            }
        }

        const extending = newComponent.extending;

        if (extending) {
            const refResolution = unwrapSource(extending);

            let unresolvedPath: UnflattenedPathPart[] | null = null;
            if (refResolution.unresolvedPath) {
                unresolvedPath = [];
                for (const pathPath of refResolution.unresolvedPath) {
                    const newPathPart = { ...pathPath };
                    const index: UnflattenedIndex[] = [];
                    for (const indexPart of newPathPart.index) {
                        const newIndexPart = { ...indexPart };

                        const indexResult =
                            createNewComponentIndicesUnflattened(
                                newIndexPart.value,
                                nComponents,
                                stateIdInfo,
                            );
                        newIndexPart.value = indexResult.components;
                        Object.assign(idxMap, indexResult.idxMap);
                        nComponents = indexResult.nComponents;
                        index.push(newIndexPart);
                    }
                    newPathPart.index = index;
                    unresolvedPath.push(newPathPart);
                }

                const newRefResolution = { ...refResolution };
                newRefResolution.unresolvedPath = unresolvedPath;

                newComponent.extending = addSource(newRefResolution, extending);
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, idxMap, nComponents };
}

function remapRefResolutions(
    serializedComponents: (SerializedComponent | string)[],
    idxMap: Record<number, number>,
    keepReferents = false,
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution = unwrapSource(extending);

            if (refResolution.unresolvedPath) {
                for (const pathPath of refResolution.unresolvedPath) {
                    for (const indexPart of pathPath.index) {
                        remapRefResolutions(
                            indexPart.value,
                            idxMap,
                            keepReferents,
                        );
                    }
                }
            }

            for (const pathPath of refResolution.originalPath) {
                for (const indexPart of pathPath.index) {
                    remapRefResolutions(indexPart.value, idxMap, keepReferents);
                }
            }

            if (keepReferents) {
                remapCopiedRefResolution(refResolution, idxMap);
            } else {
                remapRefResolution(refResolution, idxMap);
            }
        }

        if (component.doenetAttributes.extendListViaComposite) {
            const newNodeIdx =
                idxMap[component.doenetAttributes.extendListViaComposite];
            if (newNodeIdx != undefined) {
                component.doenetAttributes.extendListViaComposite = newNodeIdx;
            }
        }
        if (component.doenetAttributes.copyListViaComposite) {
            const newNodeIdx =
                idxMap[component.doenetAttributes.copyListViaComposite];
            if (newNodeIdx != undefined) {
                component.doenetAttributes.copyListViaComposite = newNodeIdx;
            }
        }
        const listIdx = component.doenetAttributes.extendsList;
        if (listIdx != undefined && idxMap[listIdx] != undefined) {
            component.doenetAttributes.extendsList = idxMap[listIdx];
        }

        remapRefResolutions(component.children, idxMap, keepReferents);

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];

            if (attribute.type === "component") {
                remapRefResolutions(
                    [attribute.component],
                    idxMap,
                    keepReferents,
                );
            } else if (attribute.type === "references") {
                remapRefResolutions(
                    attribute.references,
                    idxMap,
                    keepReferents,
                );
            } else if (attribute.type === "unresolved") {
                remapUnflattenedRefResolutions(
                    attribute.children,
                    idxMap,
                    keepReferents,
                );
            } else if (attribute.type === "expression") {
                // The references the component resolves itself
                // (`utils/dast/expressionAttributes.ts`). With
                // `keepReferents`, they keep their referents. Otherwise each
                // is resolved from the copy, which the resolver is given with
                // the rest of what is copied, also when the original resolved
                // them from where they were written.
                for (const slot of (attribute as any).slots) {
                    if (keepReferents) {
                        remapCopiedRefResolution(slot.refResolution, idxMap);
                    } else {
                        remapRefResolution(slot.refResolution, idxMap);
                        slot.refResolution.nodesInResolvedPath[0] =
                            component.componentIdx;
                    }
                }
            }
        }
    }
}

/**
 * Renumber `refResolution`, a reference in what is pasted from a source
 * (`keepReferents` of `createNewComponentIndices`), so that it keeps meaning
 * what it meant in the source. It goes by the referent, not by how the
 * reference is spelled.
 *
 * Its referent is the component its path was resolved to (`nodeIdx`), with
 * what is left of the path (`unresolvedPath`) still to resolve from there.
 *
 * - A referent outside what is copied is kept. The reference is resolved
 *   again from its origin in the source, not from where the copy lands, so
 *   that a component of the same name there neither captures it nor makes it
 *   ambiguous.
 * - A referent inside what is copied becomes its counterpart in the copy.
 *   The reference is resolved from that counterpart, with what was left of
 *   its path, rather than by name: `$P.h` written inside `<p name="P">` names
 *   the `h` of a copy of `P`, which has another name. If what is left of the
 *   path cannot be taken from the referent (`pathFromReferent`), or the path
 *   starts with no name, its whole path is resolved again from the
 *   counterpart of its origin instead, as without `keepReferents`.
 *
 * References written on the copy tag itself are not among these: they are
 * written where the copy is, and resolve from there (`convertToCopy.ts`).
 */
function remapCopiedRefResolution(
    refResolution: SerializedRefResolution | UnflattenedRefResolution,
    idxMap: Record<number, number>,
) {
    const referent = idxMap[refResolution.nodeIdx];
    if (referent === undefined) {
        const origin = refResolution.nodesInResolvedPath[0];
        remapRefResolution(refResolution, idxMap);
        if (origin !== undefined) {
            refResolution.nodesInResolvedPath[0] = origin;
        }
        return;
    }

    // A path that starts with no name resolves from its origin itself, which
    // is copied along with the referent it reaches.
    const path =
        refResolution.originalPath[0]?.name === ""
            ? undefined
            : pathFromReferent(refResolution);
    if (path === undefined) {
        remapRefResolution(refResolution, idxMap);
        return;
    }

    refResolution.nodeIdx = referent;
    refResolution.originalPath = path;
    refResolution.nodesInResolvedPath = [referent];
}

/**
 * What of the path of `refResolution` is left to resolve from its referent
 * (`nodeIdx`), as a path resolved from the referent itself: one that starts
 * with no name. It starts where the whole path was written, so that what is
 * reported of the reference quotes all of it (`doenetMLStringForReference`).
 * `undefined` if what the resolver left (`unresolvedPath`) is not the end of
 * the path that was written.
 */
function pathFromReferent<
    Part extends SerializedRefResolutionPathPart | UnflattenedPathPart,
>({
    originalPath,
    unresolvedPath,
}: {
    originalPath: Part[];
    unresolvedPath: Part[] | null;
}): Part[] | undefined {
    const left = unresolvedPath ?? [];
    const nResolved = originalPath.length - left.length;
    if (originalPath.length === 0 || nResolved < 0) {
        return undefined;
    }

    const start = originalPath[0].position?.start;
    const sourceDoc = originalPath[0].sourceDoc;
    function fromReferent(index: Part["index"], end: Part | undefined) {
        const endPosition = end?.position?.end ?? start;
        return {
            name: "",
            index,
            ...(start && endPosition
                ? { position: { start, end: endPosition } }
                : {}),
            ...(sourceDoc !== undefined ? { sourceDoc } : {}),
        } as Part;
    }

    if (left.length === 0) {
        return [fromReferent([], originalPath[originalPath.length - 1])];
    }

    const part = originalPath[nResolved];
    if (left[0].name !== "" && left[0].name !== "__invalid_index") {
        // No component matched this name: it is a property of the referent,
        // or names what the referent makes.
        if (left[0].name !== part.name) {
            return undefined;
        }
        return [
            fromReferent([], originalPath[nResolved - 1]),
            ...originalPath.slice(nResolved),
        ];
    }

    // The resolver stopped within the indices of `part`.
    const nIndexLeft = left[0].index.length;
    if (nIndexLeft > part.index.length) {
        return undefined;
    }
    return [
        fromReferent(
            part.index.slice(part.index.length - nIndexLeft) as Part["index"],
            part,
        ),
        ...originalPath.slice(nResolved + 1),
    ];
}

/**
 * Renumber the components `refResolution` names (an index in its path is
 * held as text, not as a component, for a reference a component resolves
 * itself).
 */
function remapRefResolution(
    refResolution: { nodeIdx: number; nodesInResolvedPath: number[] },
    idxMap: Record<number, number>,
) {
    const newNodeIdx = idxMap[refResolution.nodeIdx];
    if (newNodeIdx != undefined) {
        refResolution.nodeIdx = newNodeIdx;
    }
    refResolution.nodesInResolvedPath = refResolution.nodesInResolvedPath.map(
        (idx) => idxMap[idx] ?? idx,
    );
}

function remapUnflattenedRefResolutions(
    serializedComponents: (UnflattenedComponent | string)[],
    idxMap: Record<number, number>,
    keepReferents = false,
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution = unwrapSource(extending);

            const pathParts = [
                ...(refResolution.unresolvedPath ?? []),
                ...refResolution.originalPath,
            ];
            for (const pathPart of pathParts) {
                for (const indexPart of pathPart.index) {
                    remapUnflattenedRefResolutions(
                        indexPart.value,
                        idxMap,
                        keepReferents,
                    );
                }
            }

            if (keepReferents) {
                remapCopiedRefResolution(refResolution, idxMap);
            } else {
                remapRefResolution(refResolution, idxMap);
            }
        }

        remapUnflattenedRefResolutions(
            component.children,
            idxMap,
            keepReferents,
        );

        for (const attrName in component.attributes) {
            remapUnflattenedRefResolutions(
                component.attributes[attrName].children,
                idxMap,
                keepReferents,
            );
        }
    }
}

/**
 * Recurse through the unflattened components and make `originIdx` the origin
 * (`nodesInResolvedPath[0]`) of every reference in them, including references
 * in their attributes, their descendants, and the indices of their paths.
 *
 * A reference's path is re-resolved from its origin, so this makes the references
 * resolve as though written at `originIdx`, whatever position they are later placed in.
 *
 * References whose path starts with an empty name are left alone:
 * those resolve from the origin itself rather than searching from its parent,
 * so they are only meaningful from where they were created.
 */
export function setUnflattenedReferenceOrigins(
    unflattenedComponents: (UnflattenedComponent | string)[],
    originIdx: number,
) {
    for (const component of unflattenedComponents) {
        if (typeof component === "string") {
            continue;
        }

        if (component.extending) {
            const refResolution = unwrapSource(component.extending);

            const pathParts = [
                ...refResolution.originalPath,
                ...(refResolution.unresolvedPath ?? []),
            ];
            for (const pathPart of pathParts) {
                for (const indexPart of pathPart.index) {
                    setUnflattenedReferenceOrigins(indexPart.value, originIdx);
                }
            }

            if (
                refResolution.originalPath[0]?.name &&
                refResolution.nodesInResolvedPath.length > 0
            ) {
                refResolution.nodesInResolvedPath[0] = originIdx;
            }
        }

        setUnflattenedReferenceOrigins(component.children, originIdx);

        for (const attrName in component.attributes) {
            setUnflattenedReferenceOrigins(
                component.attributes[attrName].children,
                originIdx,
            );
        }
    }
}

/**
 * Recurse through all serialized components and update their component indices.
 * For components and their descendants use the `componentIdx` of the corresponding component in `componentIdxSources`.
 * (An error will be thrown if `serializedComponents` and `componentIdxSources` don't have the exact same structure.)
 * Similarly, uses the `_createComponentIdx` attribute of the corresponding component in `componentIdxSources`.
 * For all other components, such as those in attributes and `extending`,
 * update their component indices to new values, starting with `nComponents`.
 *
 * Returns:
 * - `components`: the components with new indices
 * - `nComponents`: the new value of `nComponents`, one greater than the last component index assigned
 */
export function createComponentIndicesFromSerializedChildren(
    serializedComponents: (SerializedComponent | string)[],
    componentIdxSources: (SerializedComponent | string)[],
    nComponents: number,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const result = createComponentIndicesFromSerializedChildrenSub(
        serializedComponents,
        componentIdxSources,
        nComponents,
        stateIdInfo,
    );

    const newComponents = result.components;
    const idxMap = result.idxMap;
    nComponents = result.nComponents;

    remapRefResolutions(newComponents, idxMap);

    return { components: newComponents, nComponents, idxMap };
}

function createComponentIndicesFromSerializedChildrenSub(
    serializedComponents: (SerializedComponent | string)[],
    componentIdxSources: (SerializedComponent | string)[],
    nComponents: number,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const newComponents: (SerializedComponent | string)[] = [];
    const idxMap: Record<number, number> = {};

    for (const [idx, component] of serializedComponents.entries()) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        const newComponent: SerializedComponent = { ...component };

        const idxSource = componentIdxSources[idx];
        if (typeof idxSource === "string") {
            //console.log({ serializedComponents, componentIdxSources });
            throw Error("Serialized children don't correspond");
        }

        newComponent.originalIdx = component.componentIdx;
        newComponent.componentIdx = idxSource.componentIdx;
        idxMap[newComponent.originalIdx] = newComponent.componentIdx;
        newComponent.stateId = idxSource.stateId;

        const childResult = createComponentIndicesFromSerializedChildrenSub(
            component.children,
            idxSource.children,
            nComponents,
            stateIdInfo,
        );
        newComponent.children = childResult.components;
        Object.assign(idxMap, childResult.idxMap);
        nComponents = childResult.nComponents;

        const attrResult = newComponentIndicesForAttributesFromSerialized(
            component.attributes,
            idxSource.attributes,
            nComponents,
            idxMap,
            stateIdInfo,
        );
        newComponent.attributes = attrResult.attributes;
        nComponents = attrResult.nComponents;

        const extending = newComponent.extending;

        if (extending) {
            if (newComponent.extending) {
                const extendResult = newComponentIndicesForExtending(
                    newComponent.extending,
                    nComponents,
                    idxMap,
                    stateIdInfo,
                );

                newComponent.extending = extendResult.extending;
                nComponents = extendResult.nComponents;
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, idxMap, nComponents };
}

function newComponentIndicesForAttributesFromSerialized(
    attributes: Record<string, SerializedAttribute>,
    attributeIdxSources: Record<string, SerializedAttribute>,
    nComponents: number,
    idxMap: Record<number, number>,
    stateIdInfo?: {
        prefix: string;
        num: number;
    },
) {
    const newAttributes: Record<string, SerializedAttribute> = {};

    for (const attrName in attributes) {
        const attribute = { ...attributes[attrName] };
        newAttributes[attrName] = attribute;

        const idxSource = attributeIdxSources[attrName];

        if (!idxSource) {
            // If index source for attribute does not exist, then create new component index for attributes.

            // Note: this is possible since this code can be called when expanding shadowing composite components,
            // in which case attributes of the shadowed composite's replacement may not have been copies
            const attrResult = newComponentIndicesForAttributes(
                { [attrName]: attribute },
                nComponents,
                idxMap,
                stateIdInfo,
            );

            newAttributes[attrName] = attrResult.attributes[attrName];
            nComponents = attrResult.nComponents;
            continue;
        }

        if (attribute.type === "component") {
            if (idxSource.type !== "component") {
                //console.log({ attributes, attributeIdxSources });
                throw Error("Attributes don't correspond");
            }

            const attrResult = createComponentIndicesFromSerializedChildrenSub(
                [attribute.component],
                [idxSource.component],
                nComponents,
                stateIdInfo,
            );

            attribute.component = attrResult
                .components[0] as SerializedComponent;
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "references") {
            if (idxSource.type !== "references") {
                //console.log({ attributes, attributeIdxSources });
                throw Error("Attributes don't correspond");
            }
            const attrResult = createComponentIndicesFromSerializedChildrenSub(
                attribute.references,
                idxSource.references,
                nComponents,
                stateIdInfo,
            );
            attribute.references =
                attrResult.components as SerializedComponent[];
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "unresolved") {
            const attrResult = createNewComponentIndicesUnflattened(
                attribute.children,
                nComponents,
                stateIdInfo,
            );
            attribute.children = attrResult.components;
            Object.assign(idxMap, attrResult.idxMap);
            nComponents = attrResult.nComponents;
        } else if (attribute.type === "primitive") {
            if (
                attrName === "_createComponentIdx" &&
                attribute.primitive.type === "number"
            ) {
                if (
                    idxSource.type !== "primitive" ||
                    idxSource.primitive.type !== "number"
                ) {
                    //console.log({ attributes, attributeIdxSources });
                    throw Error("Attributes don't correspond");
                }
                const originalIdx = attribute.primitive.value;
                const newIdx = idxSource.primitive.value;
                attribute.primitive.value = newIdx;
                idxMap[originalIdx] = newIdx;
            }
        } else if (attribute.type === "expression") {
            // Its slots are its own, as a reference's resolution is, so that
            // `remapRefResolutions` renumbers them and not those of what was
            // copied, which may be copied again (a repeat's template).
            (newAttributes[attrName] as any) = {
                ...attribute,
                slots: (attribute as any).slots.map((slot: any) => ({
                    ...slot,
                    refResolution: structuredClone(slot.refResolution),
                })),
            };
        } else if (
            attribute.type === "variableRef" ||
            attribute.type === "literal"
        ) {
            // a reference to a component outside what is being copied, or a
            // value: no component to number
        } else {
            console.error("Found invalid attribute", attribute);
            throw Error("Found invalid attribute");
        }
    }
    return { attributes: newAttributes, nComponents };
}

/**
 * Create a map from a component's index to the index of the copy
 * with a `_createComponentIdx` attribute that created the component.
 *
 * Currently, we use copies to create components that have
 * an `extend` or `copy` attribute. If another component depends
 * on such a component via its `componentIdx`, we use this
 * mapping to determine which `copy` would need to be expanded
 * in order to create that dependency.
 *
 * This extra step is required because the resolve algorithm may have
 * already resolved references to a `componentIdx` that does not yet
 * exist because it was replaced with the copy.
 *
 * Note: this function does not recurse to children or attributes as it is currently being
 * called from a function that is already called recursively on children and attributes.
 */
export function extractCreateComponentIdxMapping(
    serializedComponents: (SerializedComponent | string)[],
) {
    const createComponentIdxMapping: Record<number, number> = {};

    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        if (component.attributes?._createComponentIdx?.type === "primitive") {
            const primitive =
                component.attributes._createComponentIdx.primitive;
            if (primitive.type === "number") {
                const createComponentIdx = primitive.value;
                createComponentIdxMapping[createComponentIdx] =
                    component.componentIdx;
            }
        }
    }

    return { createComponentIdxMapping };
}
