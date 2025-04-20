import {
    SerializedAttribute,
    SerializedComponent,
    SerializedRefResolution,
} from "./types";

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

        // first recurse to children and attributes
        // (so we don't recurse to any attributes added, below)
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

        if (newComponent.extending) {
            // XXX: for now, we won't try to match any unresolved path with later children.
            // Instead, we are assuming any unresolved path must match props.

            const refResolution =
                "Ref" in newComponent.extending
                    ? newComponent.extending.Ref
                    : newComponent.extending.Attribute;
            const unresolved_path =
                refResolution.unresolved_path === null
                    ? null
                    : [...refResolution.unresolved_path];

            if (
                newComponent.componentType === "evaluate" &&
                unresolved_path === null
            ) {
                const evalResult = convertEvaluate({
                    evaluateComponent: newComponent,
                    refResolution,
                    nComponents,
                });

                nComponents = evalResult.nComponents;
                newComponents.push(evalResult.newComponent);
                continue;
            }

            // If the reference was is an Attribute or we are extending an evaluate with no extra path
            // then we know the resulting componentType
            const componentTypeDetermined =
                "Attribute" in newComponent.extending;
            const outerAttributes = { ...newComponent.attributes };
            newComponent.attributes = {};

            if (componentTypeDetermined) {
                outerAttributes.createComponentOfType = {
                    type: "primitive",
                    name: "createComponentOfType",
                    primitive: {
                        type: "string",
                        value: newComponent.componentType,
                    },
                };
            }

            newComponent = { ...newComponent };
            newComponent.componentType = "copy";
            newComponent.doenetAttributes = {
                ...newComponent.doenetAttributes,
                extendIdx: refResolution.node_idx,
            };

            if (unresolved_path === null) {
                // a copy with no props
                newComponent.attributes = outerAttributes;
            } else {
                if (unresolved_path[0].name === "") {
                    // if we start with an index, it is a componentIndex
                    // TODO: use later indices from the index

                    const res = convertRefsToCopies({
                        serializedComponents: unresolved_path[0].index[0].value,
                        nComponents,
                    });
                    nComponents = res.nComponents;
                    const children = res.components;

                    newComponent.attributes.componentIndex = {
                        type: "component",
                        name: "componentIndex",
                        component: {
                            type: "serialized",
                            componentType: "integer",
                            componentIdx: nComponents++,
                            children,
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                            position: unresolved_path[0].index[0].position,
                        },
                    };

                    // remove the first entry from the path
                    unresolved_path.shift();
                }
                if (unresolved_path.length === 0) {
                    newComponent.attributes = {
                        ...newComponent.attributes,
                        ...outerAttributes,
                    };
                } else {
                    let propsAddExtract = false;

                    for (const path_part of unresolved_path) {
                        if (propsAddExtract) {
                            newComponent = {
                                type: "serialized",
                                componentType: "extract",
                                componentIdx: nComponents++,
                                attributes: {},
                                doenetAttributes: {},
                                children: [newComponent],
                                state: {},
                            };
                        }

                        newComponent.attributes.prop = {
                            type: "primitive",
                            name: "prop",
                            primitive: {
                                type: "string",
                                value: path_part.name,
                            },
                        };

                        if (path_part.index.length > 0) {
                            const res = convertRefsToCopies({
                                serializedComponents: path_part.index[0].value,
                                nComponents,
                            });
                            nComponents = res.nComponents;
                            const children = res.components;

                            newComponent.attributes.propIndex = {
                                type: "component",
                                name: "propIndex",
                                component: {
                                    type: "serialized",
                                    componentType: "numberList",
                                    componentIdx: nComponents++,
                                    attributes: {},
                                    doenetAttributes: {},
                                    state: {},
                                    position: path_part.position,
                                    children: path_part.index.map((index) => {
                                        const res = convertRefsToCopies({
                                            serializedComponents: index.value,
                                            nComponents,
                                        });
                                        nComponents = res.nComponents;
                                        const children = res.components;

                                        return {
                                            type: "serialized",
                                            componentType: "number",
                                            componentIdx: nComponents++,
                                            attributes: {},
                                            doenetAttributes: {},
                                            children,
                                            state: {},
                                            position: index.position,
                                        };
                                    }),
                                },
                            };
                        }

                        propsAddExtract = true;
                    }

                    newComponent.attributes = {
                        ...newComponent.attributes,
                        ...outerAttributes,
                    };
                }
            }
        }

        newComponents.push(newComponent);
    }

    return { components: newComponents, nComponents };
}

/**
 * Convert evaluate component to the serialized component
 * format needed for the javascript core
 */
function convertEvaluate({
    evaluateComponent,
    refResolution,
    nComponents,
}: {
    evaluateComponent: SerializedComponent;
    refResolution: SerializedRefResolution;
    nComponents: number;
}) {
    // The function to evaluate is an attribute
    evaluateComponent.attributes.function = {
        type: "component",
        name: "function",
        component: {
            type: "serialized",
            componentType: "function",
            componentIdx: nComponents++,
            attributes: {},
            state: {},
            doenetAttributes: {},
            children: [
                {
                    type: "serialized",
                    componentType: "copy",
                    componentIdx: nComponents++,
                    children: [],
                    attributes: {},
                    doenetAttributes: { extendIdx: refResolution.node_idx },
                    state: {},
                    extending: evaluateComponent.extending,
                },
            ],
        },
    };

    delete evaluateComponent.extending;

    // The input children become a mathList given to the input attribute
    const list = { ...(evaluateComponent.children[0] as SerializedComponent) };
    list.componentType = "mathList";
    list.children = list.children.map((child) => {
        const mathChild = child as SerializedComponent;
        mathChild.componentType = "math";
        return mathChild;
    });
    evaluateComponent.attributes.input = {
        type: "component",
        name: "input",
        component: list,
    };
    evaluateComponent.children = [];

    return { newComponent: evaluateComponent, nComponents };
}
