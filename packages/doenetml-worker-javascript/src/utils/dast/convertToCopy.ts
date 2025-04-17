import { SerializedAttribute, SerializedComponent } from "./types";

export function convertRefsToCopies({
    serializedComponents,
    nComponents,
}: {
    serializedComponents: (SerializedComponent | string)[];
    nComponents: number;
}) {
    const newComponents: (SerializedComponent | string)[] = [];

    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        let newComponent = component;

        if (newComponent.extending) {
            const refResolution =
                "Ref" in newComponent.extending
                    ? newComponent.extending.Ref
                    : newComponent.extending.Attribute;

            if (refResolution.unresolved_path === null) {
                // If there is no unresolved path, then we create a component of type ComponentType
                // for both Refs and Attributes.
                // For now, we use a copy component
                newComponent = {
                    type: "serialized",
                    componentType: "copy",
                    componentIdx: newComponent.componentIdx,
                    children: newComponent.children,
                    attributes: {
                        ...newComponent.attributes,
                        createComponentOfType: {
                            type: "primitive",
                            name: "createComponentOfType",
                            primitive: newComponent.componentType,
                        },
                    },
                    state: newComponent.state,
                    extending: newComponent.extending,
                    doenetAttributes: {
                        ...newComponent.doenetAttributes,
                        extendIdx: refResolution.node_idx,
                    },
                };
            }
        }

        // recurse to children and attributes
        let res = convertRefsToCopies({
            serializedComponents: newComponent.children,
            nComponents,
        });
        newComponent.children = res.components;
        nComponents = res.nComponents;

        const newAttributes: Record<string, SerializedAttribute> = {};
        for (const attrName in newComponent.attributes) {
            const attribute = { ...newComponent.attributes[attrName] };
            if (attribute.type === "component") {
                res = convertRefsToCopies({
                    serializedComponents: attribute.component.children,
                    nComponents,
                });
                attribute.component = { ...attribute.component };
                attribute.component.children = res.components;
                nComponents = res.nComponents;
            }
            newAttributes[attrName] = attribute;
        }

        newComponent.attributes = newAttributes;

        newComponents.push(newComponent);
    }

    return { components: newComponents, nComponents };
}
