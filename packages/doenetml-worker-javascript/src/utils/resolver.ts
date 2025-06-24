import { FlatElement, FlatFragment } from "@doenet/doenetml-worker";
import { SerializedComponent } from "./dast/types";
import { unwrapSource } from "./dast/convertNormalizedDast";
import { UnflattenedComponent } from "./dast/intermediateTypes";

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
                        });
                        addNodesToFlatFragment({
                            flatFragment,
                            serializedComponents: attribute.references,
                            parentIdx: componentIdx,
                        });

                        break;

                    case "unresolved":
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
