import { NormalizedNode } from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
    UnflattenedIndex,
    UnflattenedPathPart,
    UnflattenedRefResolution,
} from "./intermediateTypes";
import { unwrapSource } from "./convertNormalizedDast";

export function convertRefsToCopies({
    serializedComponents,
    nComponents,
    componentInfoObjects,
    allNodes,
}: {
    serializedComponents: (UnflattenedComponent | string)[];
    nComponents: number;
    componentInfoObjects: ComponentInfoObjects;
    allNodes: NormalizedNode[];
}) {
    const newComponents: (UnflattenedComponent | string)[] = [];

    for (const component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        let newComponent = { ...component };

        // first recurse to children and attributes
        // (so we don't recurse to any attributes added, below)
        let res = convertRefsToCopies({
            serializedComponents: newComponent.children,
            nComponents,
            componentInfoObjects,
            allNodes,
        });
        newComponent.children = res.components;
        nComponents = res.nComponents;

        const newAttributes: Record<string, UnflattenedAttribute> = {};
        for (const attrName in newComponent.attributes) {
            const attribute = { ...newComponent.attributes[attrName] };
            res = convertRefsToCopies({
                serializedComponents: attribute.children,
                nComponents,
                componentInfoObjects,
                allNodes,
            });
            attribute.children = res.components;
            nComponents = res.nComponents;
            newAttributes[attrName] = attribute;
        }

        newComponent.attributes = newAttributes;

        if (!newComponent.extending) {
            newComponents.push(newComponent);
            continue;
        }

        const extending = newComponent.extending;

        const refResolution = unwrapSource(extending);
        const unresolvedPath =
            refResolution.unresolvedPath === null
                ? null
                : [...refResolution.unresolvedPath];

        if (
            newComponent.componentType === "evaluate" &&
            unresolvedPath === null
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

        const outerAttributes = { ...newComponent.attributes };
        newComponent.attributes = {};

        let wrappingComponent: UnflattenedComponent | null = null;

        // If the reference was is an ExtendAttribute or CopyAttribute
        // then we know the resulting componentType
        // and we make the name and componentIdx the component be assigned to the eventual replacement

        if ("ExtendAttribute" in extending || "CopyAttribute" in extending) {
            if (newComponent.componentType.endsWith("List")) {
                wrappingComponent = newComponent;
                wrappingComponent.attributes = outerAttributes;
                newComponent = {
                    type: "unflattened",
                    componentType: "_copy",
                    componentIdx: nComponents++,
                    attributes: {},
                    doenetAttributes: {
                        forList: wrappingComponent.componentIdx,
                    },
                    state: {},
                    children: [],
                    extending: wrappingComponent.extending,
                };

                if ("CopyAttribute" in extending) {
                    newComponent.attributes.link = {
                        name: "link",
                        children: ["false"],
                    };
                }
                delete wrappingComponent.extending;
            } else {
                outerAttributes.createComponentOfType = {
                    name: "createComponentOfType",
                    children: [newComponent.componentType],
                };
                outerAttributes.createComponentIdx = {
                    name: "createComponentIdx",
                    children: [newComponent.componentIdx.toString()],
                };
                newComponent.componentIdx = nComponents++;

                outerAttributes.createComponentName = {
                    name: "createComponentName",
                    children: outerAttributes.name.children,
                };
                delete outerAttributes.name;
                outerAttributes.copyInChildren = {
                    name: "copyInChildren",
                    children: ["true"],
                };

                if ("CopyAttribute" in extending) {
                    outerAttributes.link = {
                        name: "link",
                        children: ["false"],
                    };
                }
            }
        }

        newComponent.componentType = "_copy";

        if (unresolvedPath === null) {
            // a copy with no props
            if (wrappingComponent) {
                wrappingComponent.children.unshift(newComponent);
                newComponents.push(wrappingComponent);
            } else {
                newComponent.attributes = outerAttributes;
                newComponents.push(newComponent);
            }
            continue;
        }

        // For all the indices in the unresolved path,
        // convert any references to copies
        // and make sure that each index piece is a single integer component
        // or a single string
        const converted_unresolvedPath: UnflattenedPathPart[] =
            unresolvedPath.map((path_part) => {
                const new_index: UnflattenedIndex[] = path_part.index.map(
                    (index) => {
                        const res = convertRefsToCopies({
                            serializedComponents: index.value,
                            nComponents,
                            componentInfoObjects,
                            allNodes,
                        });
                        nComponents = res.nComponents;

                        if (res.components.length === 1) {
                            // if have a single component that can be turned into an integer
                            // set the value to that component
                            const comp = res.components[0];

                            if (typeof comp === "string") {
                                return {
                                    value: [comp],
                                    position: index.position,
                                };
                            } else if (
                                comp.componentType === "number" ||
                                comp.componentType === "integer"
                            ) {
                                // round value
                                comp.componentType = "integer";
                                return {
                                    value: [comp],
                                    position: index.position,
                                };
                            } else if (
                                comp.componentType === "_copy" &&
                                !comp.attributes.createComponentOfType
                            ) {
                                comp.attributes.createComponentOfType = {
                                    name: "createComponentOfType",
                                    children: ["integer"],
                                };
                                return {
                                    value: [comp],
                                    position: index.position,
                                };
                            }
                        }

                        // otherwise, wrap the components in an integer component
                        return {
                            value: [
                                {
                                    type: "unflattened",
                                    componentType: "integer",
                                    componentIdx: nComponents++,
                                    attributes: {},
                                    doenetAttributes: {},
                                    children: res.components,
                                    state: {},
                                    position: index.position,
                                },
                            ],
                            position: index.position,
                        };
                    },
                );

                return {
                    index: new_index,
                    name: path_part.name,
                    position: path_part.position,
                };
            });

        refResolution.unresolvedPath = converted_unresolvedPath;

        if (wrappingComponent) {
            wrappingComponent.children.splice(0, 0, newComponent);
            newComponents.push(wrappingComponent);
        } else {
            newComponent.attributes = {
                ...newComponent.attributes,
                ...outerAttributes,
            };
            newComponents.push(newComponent);
        }
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
    evaluateComponent: UnflattenedComponent;
    refResolution: UnflattenedRefResolution;
    nComponents: number;
}) {
    // The function to evaluate is an attribute
    evaluateComponent.attributes.function = {
        name: "function",
        children: [
            {
                type: "unflattened",
                componentType: "_copy",
                componentIdx: nComponents++,
                children: [],
                attributes: {},
                doenetAttributes: { extendIdx: refResolution.nodeIdx },
                state: {},
                extending: evaluateComponent.extending,
            },
        ],
    };

    delete evaluateComponent.extending;

    // The child of the evaluate is a list of the form `<ol><li></li><li></li></ol>""
    // The grandchildren become children of the input attribute,
    // after converting to math components.
    let listChildren: UnflattenedComponent[] = [];

    if (evaluateComponent.children.length > 0) {
        listChildren = {
            ...(evaluateComponent.children[0] as UnflattenedComponent),
        }.children.map((child) => {
            const mathChild = child as UnflattenedComponent;
            mathChild.componentType = "math";
            return mathChild;
        });
    }
    evaluateComponent.attributes.input = {
        name: "input",
        children: listChildren,
    };
    evaluateComponent.children = [];

    return { newComponent: evaluateComponent, nComponents };
}
