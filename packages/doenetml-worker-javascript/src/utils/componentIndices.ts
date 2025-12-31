import { Source } from "@doenet/doenetml-worker";
import {
    UnflattenedComponent,
    UnflattenedIndex,
    UnflattenedPathPart,
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
 * Recurse through all serialized components and update their component indices
 * to new values, starting with `nComponents`.
 *
 * If `idxMapOverride` is supplied, then use that map to create any matching indices rather than creating new indices.
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

    remapRefResolutions(newComponents, idxMap);

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
    let newExtending: Source<SerializedRefResolution> = extending;

    const refResolution = unwrapSource(extending);

    let originalPath: SerializedRefResolutionPathPart[] = [];
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

        const newRefResolution = { ...refResolution };
        newRefResolution.originalPath = originalPath;

        newExtending = addSource(newRefResolution, extending);
    }
    return { extending: newExtending, nComponents };
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
                attrName === "createComponentIdx" &&
                attribute.primitive.type === "number"
            ) {
                const originalIdx = attribute.primitive.value;
                const override = idxMapOverride?.[originalIdx];
                const newIdx = override ?? nComponents++;
                attribute.primitive = { type: "number", value: newIdx };
                idxMap[originalIdx] = newIdx;
            }
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
                attrName === "createComponentIdx" &&
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
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution = unwrapSource(extending);

            const newNodeIdx = idxMap[refResolution.nodeIdx];
            if (newNodeIdx != undefined) {
                refResolution.nodeIdx = newNodeIdx;
            }

            if (refResolution.unresolvedPath) {
                for (const pathPath of refResolution.unresolvedPath) {
                    for (const indexPart of pathPath.index) {
                        remapRefResolutions(indexPart.value, idxMap);
                    }
                }
            }

            for (const pathPath of refResolution.originalPath) {
                for (const indexPart of pathPath.index) {
                    remapRefResolutions(indexPart.value, idxMap);
                }
            }

            refResolution.nodesInResolvedPath =
                refResolution.nodesInResolvedPath.map((idx) => {
                    const newIdx = idxMap[idx];
                    if (newIdx != undefined) {
                        return newIdx;
                    } else {
                        return idx;
                    }
                });
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

        remapRefResolutions(component.children, idxMap);

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];

            if (attribute.type === "component") {
                remapRefResolutions([attribute.component], idxMap);
            } else if (attribute.type === "references") {
                remapRefResolutions(attribute.references, idxMap);
            } else if (attribute.type === "unresolved") {
                remapUnflattenedRefResolutions(attribute.children, idxMap);
            }
        }
    }
}

function remapUnflattenedRefResolutions(
    serializedComponents: (UnflattenedComponent | string)[],
    idxMap: Record<number, number>,
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution = unwrapSource(extending);

            const newNodeIdx = idxMap[refResolution.nodeIdx];
            if (newNodeIdx != undefined) {
                refResolution.nodeIdx = newNodeIdx;
            }

            if (refResolution.unresolvedPath) {
                for (const pathPath of refResolution.unresolvedPath) {
                    for (const indexPart of pathPath.index) {
                        const indexResult = remapUnflattenedRefResolutions(
                            indexPart.value,
                            idxMap,
                        );
                    }
                }
            }

            for (const pathPath of refResolution.originalPath) {
                for (const indexPart of pathPath.index) {
                    const indexResult = remapUnflattenedRefResolutions(
                        indexPart.value,
                        idxMap,
                    );
                }
            }

            refResolution.nodesInResolvedPath =
                refResolution.nodesInResolvedPath.map((idx) => {
                    const newIdx = idxMap[idx];
                    if (newIdx != undefined) {
                        return newIdx;
                    } else {
                        return idx;
                    }
                });
        }

        const childResult = remapUnflattenedRefResolutions(
            component.children,
            idxMap,
        );

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];

            const attrResult = remapUnflattenedRefResolutions(
                attribute.children,
                idxMap,
            );
        }
    }
}

/**
 * Recurse through all serialized components and update their component indices.
 * For components and their descendants use the `componentIdx` of the corresponding component in `componentIdxSources`.
 * (An error will be thrown if `serializedComponents` and `componentIdxSources` don't have the exact same structure.)
 * Similarly, uses the `createComponentIdx` attribute of the corresponding component in `componentIdxSources`.
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
                attrName === "createComponentIdx" &&
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
        } else {
            console.error("Found invalid attribute", attribute);
            throw Error("Found invalid attribute");
        }
    }
    return { attributes: newAttributes, nComponents };
}

/**
 * Create a map from a component's index to the index of the copy
 * with a `createComponentIdx` attribute that created the component.
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

        if (component.attributes?.createComponentIdx?.type === "primitive") {
            const primitive = component.attributes.createComponentIdx.primitive;
            if (primitive.type === "number") {
                const createComponentIdx = primitive.value;
                createComponentIdxMapping[createComponentIdx] =
                    component.componentIdx;
            }
        }
    }

    return { createComponentIdxMapping };
}
