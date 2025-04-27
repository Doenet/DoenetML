import { NormalizedNode } from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
    UnflattenedRefResolution,
} from "./intermediateTypes";

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

        const refResolution =
            "Ref" in extending ? extending.Ref : extending.Attribute;
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

        const outerAttributes = { ...newComponent.attributes };
        newComponent.attributes = {};

        // If the reference was is an Attribute
        // then we know the resulting componentType
        // and we make the name and componentIdx the component be assigned to the eventual replacement

        if ("Attribute" in extending) {
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
        }

        delete newComponent.extending;

        newComponent.componentType = "copy";
        newComponent.doenetAttributes = {
            ...newComponent.doenetAttributes,
            extendIdx: refResolution.node_idx,
        };

        if (unresolved_path === null) {
            // a copy with no props
            newComponent.attributes = outerAttributes;
            newComponents.push(newComponent);
            continue;
        }

        if (unresolved_path[0].name === "") {
            // if we start with an index, it is a sourceIndex
            // TODO: use later indices from the index

            const res = convertRefsToCopies({
                serializedComponents: unresolved_path[0].index[0].value,
                nComponents,
                componentInfoObjects,
                allNodes,
            });
            nComponents = res.nComponents;
            const children = res.components;

            newComponent.attributes.sourceIndex = {
                name: "sourceIndex",
                children,
                position: unresolved_path[0].index[0].position,
            };

            // remove the first entry from the path
            unresolved_path.shift();
        }

        if (unresolved_path.length === 0) {
            newComponent.attributes = {
                ...newComponent.attributes,
                ...outerAttributes,
            };

            newComponents.push(newComponent);
            continue;
        }

        let propsAddExtract = false;

        for (const path_part of unresolved_path) {
            if (propsAddExtract) {
                newComponent = {
                    type: "unflattened",
                    componentType: "extract",
                    componentIdx: nComponents++,
                    attributes: {},
                    children: [newComponent],
                    state: {},
                };
            }

            newComponent.attributes.prop = {
                name: "prop",
                children: [path_part.name],
            };

            if (path_part.index.length > 0) {
                const res = convertRefsToCopies({
                    serializedComponents: path_part.index[0].value,
                    nComponents,
                    componentInfoObjects,
                    allNodes,
                });
                nComponents = res.nComponents;
                const children = res.components;

                newComponent.attributes.propIndex = {
                    name: "propIndex",
                    position: path_part.position,

                    children: path_part.index.map((index) => {
                        const res = convertRefsToCopies({
                            serializedComponents: index.value,
                            nComponents,
                            componentInfoObjects,
                            allNodes,
                        });
                        nComponents = res.nComponents;
                        const children = res.components;

                        return {
                            type: "unflattened",
                            componentType: "number",
                            componentIdx: nComponents++,
                            attributes: {},
                            doenetAttributes: {},
                            children,
                            state: {},
                            position: index.position,
                        };
                    }),
                };
            }

            propsAddExtract = true;
        }

        newComponent.attributes = {
            ...newComponent.attributes,
            ...outerAttributes,
        };

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
                componentType: "copy",
                componentIdx: nComponents++,
                children: [],
                attributes: {},
                doenetAttributes: { extendIdx: refResolution.node_idx },
                state: {},
                extending: evaluateComponent.extending,
            },
        ],
    };

    delete evaluateComponent.extending;

    // The child of the evaluate is a list of the form `<ol><li></li><li></li></ol>""
    // The grandchildren become children of the input attribute,
    // after converting to math components.
    const listChildren = {
        ...(evaluateComponent.children[0] as UnflattenedComponent),
    }.children.map((child) => {
        const mathChild = child as UnflattenedComponent;
        mathChild.componentType = "math";
        return mathChild;
    });
    evaluateComponent.attributes.input = {
        name: "input",
        children: listChildren,
    };
    evaluateComponent.children = [];

    return { newComponent: evaluateComponent, nComponents };
}
