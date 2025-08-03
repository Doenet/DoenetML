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

        if (
            newComponent.componentType === "evaluate" &&
            newComponent.children.length === 1 &&
            (newComponent.children[0] as UnflattenedComponent).componentType ===
                "ol"
        ) {
            const evalResult = convertEvaluate({
                evaluateComponent: newComponent,
                refResolution,
                nComponents,
                componentInfoObjects,
                allNodes,
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
            if (
                newComponent.componentType.endsWith("List") &&
                !["asList", "convertSetToList"].includes(
                    newComponent.componentType,
                )
            ) {
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

                if (!wrappingComponent.doenetAttributes) {
                    wrappingComponent.doenetAttributes = {};
                }

                if ("CopyAttribute" in extending) {
                    newComponent.attributes.link = {
                        name: "link",
                        children: ["false"],
                    };

                    wrappingComponent.doenetAttributes.copyListViaComposite =
                        newComponent.componentIdx;
                } else {
                    wrappingComponent.doenetAttributes.extendListViaComposite =
                        newComponent.componentIdx;
                }

                // The "removeEmptyArrayEntries" attribute needs to be on the copy component, not the list component
                if ("removeEmptyArrayEntries" in wrappingComponent.attributes) {
                    newComponent.attributes.removeEmptyArrayEntries =
                        wrappingComponent.attributes.removeEmptyArrayEntries;
                    delete wrappingComponent.attributes.removeEmptyArrayEntries;
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

        const convertPath = (path_part: UnflattenedPathPart) => {
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
                                sourceDoc: index.sourceDoc,
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
                                sourceDoc: index.sourceDoc,
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
                                sourceDoc: index.sourceDoc,
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
                                sourceDoc: index.sourceDoc,
                            },
                        ],
                        position: index.position,
                        sourceDoc: index.sourceDoc,
                    };
                },
            );

            return {
                index: new_index,
                name: path_part.name,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            };
        };

        // For all the indices in the original and unresolved path,
        // convert any references to copies
        // and make sure that each index piece is a single integer component
        // or a single string
        const converted_originalPath: UnflattenedPathPart[] =
            refResolution.originalPath.map(convertPath);

        refResolution.originalPath = converted_originalPath;

        if (refResolution.unresolvedPath) {
            const converted_unresolvedPath: UnflattenedPathPart[] =
                refResolution.unresolvedPath.map(convertPath);

            refResolution.unresolvedPath = converted_unresolvedPath;
        }

        if (wrappingComponent) {
            wrappingComponent.children.unshift(newComponent);
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
    componentInfoObjects,
    allNodes,
}: {
    evaluateComponent: UnflattenedComponent;
    refResolution: UnflattenedRefResolution;
    nComponents: number;
    componentInfoObjects: ComponentInfoObjects;
    allNodes: NormalizedNode[];
}) {
    // The function to evaluate is an attribute

    let res = convertRefsToCopies({
        serializedComponents: [
            {
                type: "unflattened",
                componentType: "function",
                componentIdx: nComponents++,
                children: [],
                attributes: {},
                doenetAttributes: {},
                state: {},
                extending: evaluateComponent.extending,
            },
        ],
        nComponents,
        componentInfoObjects,
        allNodes,
    });
    nComponents = res.nComponents;

    evaluateComponent.attributes.function = {
        name: "function",
        children: res.components,
    };

    // Note: we don't delete the `extending` attribute of the `<evaluate>` even though it isn't directly used,
    // as it is used in sugar to determine whether or not the component is a reference
    // delete evaluateComponent.extending;

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
