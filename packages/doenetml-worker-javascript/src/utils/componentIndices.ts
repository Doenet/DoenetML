import {
    UnflattenedComponent,
    UnflattenedIndex,
    UnflattenedPathPart,
} from "./dast/intermediateTypes";
import {
    SerializedComponent,
    SerializedPathIndex,
    SerializedRefResolutionPathPart,
} from "./dast/types";

/**
 * Recurse through all serialized components and update their component indices
 * to new values, starting with `nComponents`
 *
 * Returns:
 * - `components`: the components with new indices
 * - `nComponents`: the new value of `nComponents`, one greater than the last component index assigned
 */
export function createNewComponentIndices(
    serializedComponents: (SerializedComponent | string)[],
    nComponents: number,
) {
    const result = createNewComponentIndicesSub(
        serializedComponents,
        nComponents,
    );

    const newComponents = result.components;
    const idxMap = result.idxMap;
    nComponents = result.nComponents;

    const remapResult = remapRefResolutions(newComponents, idxMap, nComponents);
    nComponents = remapResult.nComponents;

    return { components: newComponents, nComponents };
}

function createNewComponentIndicesSub(
    serializedComponents: (SerializedComponent | string)[],
    nComponents: number,
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
        newComponent.componentIdx = nComponents++;
        idxMap[newComponent.originalIdx] = newComponent.componentIdx;

        const childResult = createNewComponentIndicesSub(
            component.children,
            nComponents,
        );
        newComponent.children = childResult.components;
        Object.assign(idxMap, childResult.idxMap);
        nComponents = childResult.nComponents;

        newComponent.attributes = { ...component.attributes };
        for (const attrName in newComponent.attributes) {
            const attribute = { ...newComponent.attributes[attrName] };
            newComponent.attributes[attrName] = attribute;

            if (attribute.type === "component") {
                const attrResult = createNewComponentIndicesSub(
                    [attribute.component],
                    nComponents,
                );
                attribute.component = attrResult
                    .components[0] as SerializedComponent;
                Object.assign(idxMap, attrResult.idxMap);
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "references") {
                const attrResult = createNewComponentIndicesSub(
                    attribute.references,
                    nComponents,
                );
                attribute.references =
                    attrResult.components as SerializedComponent[];
                Object.assign(idxMap, attrResult.idxMap);
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "unresolved") {
                const attrResult = createNewComponentIndicesUnflattened(
                    attribute.children,
                    nComponents,
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
                    const newIdx = nComponents++;
                    attribute.primitive = { type: "number", value: newIdx };
                    idxMap[originalIdx] = newIdx;
                }
            }
        }

        const extending = newComponent.extending;

        if (extending) {
            const refResolution =
                "Ref" in extending ? extending.Ref : extending.Attribute;

            let unresolvedPath: SerializedRefResolutionPathPart[] | null = null;
            if (refResolution.unresolvedPath) {
                unresolvedPath = [];
                for (const pathPath of refResolution.unresolvedPath) {
                    const newPathPart = { ...pathPath };
                    const index: SerializedPathIndex[] = [];
                    for (const indexPart of newPathPart.index) {
                        const newIndexPart = { ...indexPart };

                        const indexResult = createNewComponentIndicesSub(
                            newIndexPart.value,
                            nComponents,
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

                if ("Ref" in extending) {
                    newComponent.extending = { Ref: newRefResolution };
                } else {
                    newComponent.extending = { Attribute: newRefResolution };
                }
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, idxMap, nComponents };
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

        const childResult = createNewComponentIndicesUnflattened(
            component.children,
            nComponents,
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
            const refResolution =
                "Ref" in extending ? extending.Ref : extending.Attribute;

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

                if ("Ref" in extending) {
                    newComponent.extending = { Ref: newRefResolution };
                } else {
                    newComponent.extending = { Attribute: newRefResolution };
                }
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, idxMap, nComponents };
}

function remapRefResolutions(
    serializedComponents: (SerializedComponent | string)[],
    idxMap: Record<number, number>,
    nComponents: number,
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution =
                "Ref" in extending ? extending.Ref : extending.Attribute;

            const newNodeIdx = idxMap[refResolution.nodeIdx];
            if (newNodeIdx != undefined) {
                refResolution.nodeIdx = newNodeIdx;
            }

            if (refResolution.unresolvedPath) {
                for (const pathPath of refResolution.unresolvedPath) {
                    for (const indexPart of pathPath.index) {
                        const indexResult = remapRefResolutions(
                            indexPart.value,
                            idxMap,
                            nComponents,
                        );
                        nComponents = indexResult.nComponents;
                    }
                }
            }
        }

        const childResult = remapRefResolutions(
            component.children,
            idxMap,
            nComponents,
        );
        nComponents = childResult.nComponents;

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];

            if (attribute.type === "component") {
                const attrResult = remapRefResolutions(
                    [attribute.component],
                    idxMap,
                    nComponents,
                );
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "references") {
                const attrResult = remapRefResolutions(
                    attribute.references,
                    idxMap,
                    nComponents,
                );
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "unresolved") {
                const attrResult = remapUnflattenedRefResolutions(
                    attribute.children,
                    idxMap,
                    nComponents,
                );
                nComponents = attrResult.nComponents;
            }
        }
    }

    return { nComponents };
}

function remapUnflattenedRefResolutions(
    serializedComponents: (UnflattenedComponent | string)[],
    idxMap: Record<number, number>,
    nComponents: number,
) {
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            continue;
        }

        const extending = component.extending;

        if (extending) {
            const refResolution =
                "Ref" in extending ? extending.Ref : extending.Attribute;

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
                            nComponents,
                        );
                        nComponents = indexResult.nComponents;
                    }
                }
            }
        }

        const childResult = remapUnflattenedRefResolutions(
            component.children,
            idxMap,
            nComponents,
        );
        nComponents = childResult.nComponents;

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];

            const attrResult = remapUnflattenedRefResolutions(
                attribute.children,
                idxMap,
                nComponents,
            );
            nComponents = attrResult.nComponents;
        }
    }

    return { nComponents };
}
