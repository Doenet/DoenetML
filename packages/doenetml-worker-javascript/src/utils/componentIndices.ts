import { UnflattenedComponent } from "./dast/intermediateTypes";
import { SerializedComponent } from "./dast/types";

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
    const newComponents: (SerializedComponent | string)[] = [];
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        const newComponent: SerializedComponent = { ...component };

        newComponent.componentIdx = nComponents++;

        const childResult = createNewComponentIndices(
            component.children,
            nComponents,
        );
        newComponent.children = childResult.components;
        nComponents = childResult.nComponents;

        newComponent.attributes = { ...component.attributes };
        for (const attrName in newComponent.attributes) {
            const attribute = newComponent.attributes[attrName];

            if (attribute.type === "component") {
                const attrResult = createNewComponentIndices(
                    [attribute.component],
                    nComponents,
                );
                attribute.component = attrResult
                    .components[0] as SerializedComponent;
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "references") {
                const attrResult = createNewComponentIndices(
                    attribute.references,
                    nComponents,
                );
                attribute.references =
                    attrResult.components as SerializedComponent[];
                nComponents = attrResult.nComponents;
            } else if (attribute.type === "unresolved") {
                const attrResult = createNewComponentIndicesUnflattened(
                    attribute.children,
                    nComponents,
                );
                attribute.children = attrResult.components;
                nComponents = attrResult.nComponents;
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, nComponents };
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
    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        const newComponent: UnflattenedComponent = { ...component };

        newComponent.componentIdx = nComponents++;

        const childResult = createNewComponentIndicesUnflattened(
            component.children,
            nComponents,
        );
        newComponent.children = childResult.components;
        nComponents = childResult.nComponents;

        newComponent.attributes = { ...component.attributes };
        for (const attrName in newComponent.attributes) {
            const attribute = newComponent.attributes[attrName];

            const attrResult = createNewComponentIndicesUnflattened(
                attribute.children,
                nComponents,
            );
            attribute.children = attrResult.components;
            nComponents = attrResult.nComponents;
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, nComponents };
}
