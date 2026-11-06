import {
    FlatFragment,
    IndexResolution,
    NormalizedNode,
} from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
    UnflattenedIndex,
    UnflattenedPathPart,
    UnflattenedRefResolution,
} from "./intermediateTypes";
import { addSource, isCopySource, unwrapSource } from "./convertNormalizedDast";
import type { DiagnosticRecord } from "@doenet/utils";
import { codedDiagnostic } from "../diagnostics";

/**
 * The settings of the `_copy` an unlinked copy is made into: `_link` false,
 * and, for `copyWithState`, `_copyWithState`, so the copy carries its
 * source's reader state and random choices (D33). A `copy` carries neither:
 * it is the source's DoenetML pasted (CPY-1).
 */
function unlinkedCopyAttributes(
    extending: Parameters<typeof isCopySource>[0],
): Record<string, UnflattenedAttribute> {
    const attributes: Record<string, UnflattenedAttribute> = {
        _link: { name: "_link", children: ["false"] },
    };
    if ("CopyWithStateAttribute" in extending) {
        attributes._copyWithState = {
            name: "_copyWithState",
            children: ["true"],
        };
    }
    return attributes;
}

/**
 * Warn for each attribute written on a tag with `copy`, `copyWithState` or
 * `extend` that the tag does not have, and drop it (#2332). Written on the
 * tag without one, such an attribute is an error (`doenet-e0004`). On a copy
 * or an extend, the component is still shown, as what it copies, and the
 * attribute does nothing, so it is a warning (`doenet-w0187`, DIAG-1: an
 * attribute that is ignored). It is decided here, from the tag the author
 * wrote, so that it is the same for every kind of component: one made from
 * its replacement (`convertUnresolvedAttributesForComponentType`, which would
 * otherwise drop it silently), and a list, which keeps the attributes on the
 * list itself (which would otherwise make it an error). An attribute is the
 * tag's when its class declares it, or the `_copy`'s, as `asList`. A class
 * that accepts any attribute (`<module>`, whose extend reports what it
 * ignores itself, `doenet-w0168`) and a namespaced attribute (`xmlns:…`) are
 * left alone.
 */
function warnOfAttributesTheTagDoesNotHave({
    component,
    attributes,
    componentInfoObjects,
    diagnostics,
}: {
    component: UnflattenedComponent;
    attributes: Record<string, UnflattenedAttribute>;
    componentInfoObjects: ComponentInfoObjects;
    diagnostics: DiagnosticRecord[];
}) {
    const componentType =
        componentInfoObjects.componentTypeLowerCaseMapping[
            component.componentType.toLowerCase()
        ];
    const componentClass =
        componentInfoObjects.allComponentClasses[componentType];
    if (!componentClass || componentClass.acceptAnyAttribute) {
        return;
    }
    const known = new Set(
        [
            ...Object.keys(componentClass.createAttributesObject()),
            ...Object.keys(
                componentInfoObjects.allComponentClasses._copy.createAttributesObject(),
            ),
        ].map((name) => name.toLowerCase()),
    );
    for (const attrName of Object.keys(attributes)) {
        if (known.has(attrName.toLowerCase()) || attrName.includes(":")) {
            continue;
        }
        const attribute = attributes[attrName];
        diagnostics.push(
            codedDiagnostic({
                type: "warning",
                code: "doenet-w0187",
                args: { attribute: attrName, componentType },
                position: attribute.position ?? component.position,
                sourceDoc: attribute.sourceDoc ?? component.sourceDoc,
            }),
        );
        delete attributes[attrName];
    }
}

export function convertRefsToCopies({
    serializedComponents,
    nComponents,
    componentInfoObjects,
    allNodes,
    addNodesToResolver,
    diagnostics = [],
}: {
    serializedComponents: (UnflattenedComponent | string)[];
    nComponents: number;
    componentInfoObjects: ComponentInfoObjects;
    allNodes: NormalizedNode[];
    addNodesToResolver?: (
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) => void;
    /** Where the warnings for attributes the tag does not have go. */
    diagnostics?: DiagnosticRecord[];
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
            addNodesToResolver,
            diagnostics,
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
                addNodesToResolver,
                diagnostics,
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
                addNodesToResolver,
                diagnostics,
            });

            nComponents = evalResult.nComponents;
            newComponents.push(evalResult.newComponent);
            continue;
        }

        const outerAttributes = { ...newComponent.attributes };
        newComponent.attributes = {};

        let wrappingComponent: UnflattenedComponent | null = null;

        // If the reference is an ExtendAttribute, CopyAttribute or
        // CopyWithStateAttribute, then we know the resulting componentType
        // and we make the name and componentIdx the component be assigned to the eventual replacement

        if ("ExtendAttribute" in extending || isCopySource(extending)) {
            warnOfAttributesTheTagDoesNotHave({
                component: newComponent,
                attributes: outerAttributes,
                componentInfoObjects,
                diagnostics,
            });
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
                    // where the list is written, so that a diagnostic of
                    // what it is made from (`typeChangeAtLoad.ts`) is marked
                    // there
                    position: wrappingComponent.position,
                    sourceDoc: wrappingComponent.sourceDoc,
                };

                if (!wrappingComponent.doenetAttributes) {
                    wrappingComponent.doenetAttributes = {};
                }

                if (addNodesToResolver) {
                    const flatFragment: FlatFragment = {
                        type: "flatFragment",
                        children: [newComponent.componentIdx],
                        nodes: [
                            {
                                type: "element",
                                name: newComponent.componentType,
                                parent: wrappingComponent.componentIdx,
                                children: [],
                                attributes: [],
                                idx: newComponent.componentIdx,
                                sourceDoc: wrappingComponent.sourceDoc,
                            },
                        ],
                        parentIdx: wrappingComponent.componentIdx,
                        parentSourceSequence: null,
                        idxMap: { [newComponent.componentIdx]: 0 },
                    };

                    addNodesToResolver(flatFragment, "None");
                }

                if (isCopySource(extending)) {
                    Object.assign(
                        newComponent.attributes,
                        unlinkedCopyAttributes(extending),
                    );

                    wrappingComponent.doenetAttributes.copyListViaComposite =
                        newComponent.componentIdx;
                } else {
                    wrappingComponent.doenetAttributes.extendListViaComposite =
                        newComponent.componentIdx;

                    // The list it extends, when the reference names it with
                    // nothing left to resolve, whose attributes it takes as
                    // an extend takes its source's
                    // (`AttributeComponentDependency`, `utils/contextAttribute.js`).
                    if (
                        refResolution.unresolvedPath === null ||
                        refResolution.unresolvedPath.length === 0
                    ) {
                        wrappingComponent.doenetAttributes.extendsList =
                            refResolution.nodeIdx;
                    }
                }

                // The "removeEmptyArrayEntries" attribute needs to be on the copy component, not the list component,
                // in whatever case the author wrote it
                for (const attrName of Object.keys(
                    wrappingComponent.attributes,
                )) {
                    if (attrName.toLowerCase() === "removeemptyarrayentries") {
                        newComponent.attributes[attrName] =
                            wrappingComponent.attributes[attrName];
                        delete wrappingComponent.attributes[attrName];
                    }
                }

                delete wrappingComponent.extending;
            } else {
                outerAttributes._createComponentOfType = {
                    name: "_createComponentOfType",
                    children: [newComponent.componentType],
                };
                outerAttributes._createComponentIdx = {
                    name: "_createComponentIdx",
                    children: [newComponent.componentIdx.toString()],
                };
                const originalIdx = newComponent.componentIdx;
                newComponent.componentIdx = nComponents++;

                if (addNodesToResolver) {
                    const flatFragment: FlatFragment = {
                        type: "flatFragment",
                        children: [newComponent.componentIdx],
                        nodes: [
                            {
                                type: "element",
                                name: newComponent.componentType,
                                parent: originalIdx,
                                children: [],
                                attributes: [],
                                idx: newComponent.componentIdx,
                                sourceDoc: newComponent.sourceDoc,
                            },
                        ],
                        parentIdx: originalIdx,
                        parentSourceSequence: null,
                        idxMap: { [newComponent.componentIdx]: 0 },
                    };

                    addNodesToResolver(flatFragment, "None");
                }

                if (outerAttributes.name) {
                    outerAttributes._createComponentName = {
                        name: "_createComponentName",
                        children: outerAttributes.name.children,
                    };
                    delete outerAttributes.name;
                }
                outerAttributes._copyInChildren = {
                    name: "_copyInChildren",
                    children: ["true"],
                };

                if (isCopySource(extending)) {
                    Object.assign(
                        outerAttributes,
                        unlinkedCopyAttributes(extending),
                    );
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
                        addNodesToResolver,
                        diagnostics,
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
                            // Remember what was written first. Now that an
                            // element can be written between the brackets
                            // (#1909), a `<number>` retyped here is markup the
                            // author typed, and an attribute error naming
                            // `<integer>` would name a component that appears
                            // nowhere in their document (#1919).
                            comp.authoredComponentType = comp.componentType;
                            comp.componentType = "integer";
                            return {
                                value: [comp],
                                position: index.position,
                                sourceDoc: index.sourceDoc,
                            };
                        } else if (
                            comp.componentType === "_copy" &&
                            !comp.attributes._createComponentOfType
                        ) {
                            comp.attributes._createComponentOfType = {
                                name: "_createComponentOfType",
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
                                // This wrapper is not something an author wrote,
                                // so it does not get an author's sugar. Without
                                // this, now that `applySugar` reaches an index's
                                // contents (#1909), `<number>`'s operator sugar
                                // fires on the pieces of an ordinary `$a[$i+1]`
                                // and builds a `<math>` that nothing needs —
                                // two extra components per index, and per
                                // iteration inside a `<repeat>`. The components
                                // written between the brackets still get their
                                // own sugar: `skipSugar` stops only this
                                // component's instructions, not the recursion
                                // into its children.
                                skipSugar: true,
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
 * The same path with every index emptied.
 *
 * Used for the copy of a resolution that must not own the components sitting in
 * its indices. The path parts themselves are rebuilt rather than mutated, since
 * the original is still in use by whoever does own them.
 */
function dropIndexComponents(
    path: UnflattenedPathPart[],
): UnflattenedPathPart[] {
    return path.map((pathPart) => ({ ...pathPart, index: [] }));
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
    addNodesToResolver,
    diagnostics,
}: {
    evaluateComponent: UnflattenedComponent;
    refResolution: UnflattenedRefResolution;
    nComponents: number;
    componentInfoObjects: ComponentInfoObjects;
    allNodes: NormalizedNode[];
    addNodesToResolver?: (
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) => void;
    diagnostics: DiagnosticRecord[];
}) {
    // The function to evaluate is an attribute

    const functionComponent: UnflattenedComponent = {
        type: "unflattened",
        componentType: "function",
        componentIdx: nComponents++,
        children: [],
        attributes: {},
        doenetAttributes: {},
        state: {},
        extending: evaluateComponent.extending,
        // This component is synthesized rather than written, but it is the one
        // that carries the reference — so anything that reports a problem with
        // the reference reports it from here. Without a position such a
        // diagnostic has no location to show the author, and two of them
        // covering different references look identical and are deduplicated
        // into one. The `<evaluate>`'s own span is where the author wrote it.
        position: evaluateComponent.position,
        sourceDoc: evaluateComponent.sourceDoc,
    };

    let res = convertRefsToCopies({
        serializedComponents: [functionComponent],
        nComponents,
        componentInfoObjects,
        allNodes,
        addNodesToResolver,
        diagnostics,
    });
    nComponents = res.nComponents;

    if (addNodesToResolver) {
        const flatFragment: FlatFragment = {
            type: "flatFragment",
            children: [functionComponent.componentIdx],
            nodes: [
                {
                    type: "element",
                    name: functionComponent.componentType,
                    parent: evaluateComponent.componentIdx,
                    children: [],
                    attributes: [],
                    idx: functionComponent.componentIdx,
                    sourceDoc: evaluateComponent.sourceDoc,
                },
            ],
            parentIdx: evaluateComponent.componentIdx,
            parentSourceSequence: null,
            idxMap: { [functionComponent.componentIdx]: 0 },
        };

        addNodesToResolver(flatFragment, "None");
    }

    evaluateComponent.attributes.function = {
        name: "function",
        children: res.components,
    };

    // Note: we don't delete the `extending` attribute of the `<evaluate>` even though it isn't directly used,
    // as it is used in sugar to determine whether or not the component is a reference
    // delete evaluateComponent.extending;

    // What it must *not* keep is the index. `functionComponent` was handed this
    // very object, and `convertRefsToCopies` rewrites a resolution's paths in
    // place, so the conversion just above left the `<evaluate>` pointing at the
    // same freshly built index components as the `function` it created. Both then
    // reach `createIsolatedComponents`, which instantiates each component in a
    // path index — and the second one throws `Found a duplicate componentIdx`,
    // blanking the document (#1917).
    //
    // The index belongs to the function: in `$$f[$k](3)` it picks which function
    // is called, not part of what the call returns. So the `<evaluate>` keeps the
    // path it was written with and gives up the components in it. Nothing reads
    // them from here — every other consumer of an `<evaluate>`'s `extending`
    // tests only that it is a reference, or compares `nodeIdx` and
    // `unresolvedPath`.
    evaluateComponent.extending = addSource(
        {
            ...refResolution,
            originalPath: dropIndexComponents(refResolution.originalPath),
            unresolvedPath:
                refResolution.unresolvedPath === null
                    ? null
                    : dropIndexComponents(refResolution.unresolvedPath),
        },
        evaluateComponent.extending!,
    );

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
