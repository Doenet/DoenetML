import {
    FlatElement,
    FlatFragment,
    FlatPathPart,
    IndexResolution,
    NormalizedRoot,
    RefResolution,
    Source,
    UntaggedContent,
} from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    AttributeDefinition,
    DoenetMLComponentClass,
    PrimitiveAttributeValue,
    SerializedAttribute,
    SerializedComponent,
    SerializedRefResolution,
    SerializedRefResolutionPathPart,
    UnresolvedAttribute,
} from "./types";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
    UnflattenedPathPart,
    UnflattenedRefResolution,
} from "./intermediateTypes";
import { convertToErrorComponent } from "./errors";
import { decodeXMLEntities, removeBlankStringChildren } from "./convertUtils";
import { applySugar } from "./sugar";
import { convertRefsToCopies } from "./convertToCopy";
import { ErrorRecord, WarningRecord } from "@doenet/utils";

/**
 * Transform the normalized dast into the serialized components used
 * to initialize the Javascript Doenet core
 *
 * Assumes that the `normalized_root` has a single document child.
 * Throws an error if it does not.
 */
export async function normalizedDastToSerializedComponents(
    normalized_root: NormalizedRoot,
    componentInfoObjects: ComponentInfoObjects,
    addNodesToResolver: (
        flat_fragment: FlatFragment,
        index_resolution: IndexResolution,
    ) => void,
): Promise<{
    document: SerializedComponent;
    nComponents: number;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    sources: string[];
}> {
    /**
     * Unflatten the normalized dast node so that
     * children of attributes and nodes, as well as ref resolutions, contain the actual children.
     *
     * Convert Elements to a `componentType` matching their name.
     * Convert Errors to a `componentType` of "_error".
     */
    function unflattenDastNodes(
        indicesOrStrings: UntaggedContent[],
        warnings: WarningRecord[],
    ): (UnflattenedComponent | string)[] {
        const unflattenedNodes: (UnflattenedComponent | string)[] = [];

        for (const idxOrString of indicesOrStrings) {
            if (typeof idxOrString === "string") {
                unflattenedNodes.push(idxOrString);
                continue;
            } else {
                const node = normalized_root.nodes[idxOrString];
                if (node.type === "element") {
                    unflattenedNodes.push({
                        type: "unflattened",
                        componentType: getComponentType(node),
                        componentIdx: idxOrString,
                        attributes: Object.fromEntries(
                            node.attributes
                                // remove type attribute from divisions
                                .filter(
                                    (attribute) =>
                                        attribute.name !== "type" ||
                                        node.name !== "division",
                                )
                                .map((attribute) => [
                                    attribute.name,
                                    {
                                        name: attribute.name,
                                        children: unflattenDastNodes(
                                            attribute.children,
                                            warnings,
                                        ),
                                        position: attribute.position,
                                        sourceDoc: attribute.sourceDoc,
                                    },
                                ]),
                        ),
                        position: node.position,
                        sourceDoc: node.sourceDoc,
                        childrenPosition: node.childrenPosition,
                        extending: node.extending
                            ? unFlattenExtending(node.extending, warnings)
                            : undefined,
                        children: unflattenDastNodes(node.children, warnings),
                        state: {},
                    });
                } else {
                    // node.type === "error"

                    // XXX: for now, treating info the same as warning

                    // Remove warning from the dast and add to warning record
                    if (
                        node.errorType === "warning" ||
                        node.errorType === "info"
                    ) {
                        warnings.push({
                            type: "warning",
                            message: node.message,
                            position: node.position,
                            sourceDoc: node.sourceDoc,
                        });
                        if (
                            node.message.includes("No referent") ||
                            node.message.includes("Multiple referents")
                        ) {
                            // Depending on the parent, we still want something to show up for these invalid reference.
                            // Since we already have that logic implemented for copy, we'll just make a copy
                            // with no referent
                            unflattenedNodes.push({
                                type: "unflattened",
                                componentType: "_copy",
                                componentIdx: idxOrString,
                                attributes: {},
                                position: node.position,
                                sourceDoc: node.sourceDoc,
                                extending: {
                                    Ref: {
                                        nodeIdx: -1,
                                        unresolvedPath: null,
                                        originalPath: [],
                                        nodesInResolvedPath: [],
                                    },
                                },
                                state: {},
                                children: [],
                            });
                        }
                    } else {
                        unflattenedNodes.push({
                            type: "unflattened",
                            componentType: "_error",
                            componentIdx: idxOrString,
                            attributes: {},
                            position: node.position,
                            sourceDoc: node.sourceDoc,
                            state: {
                                message: node.message,
                                unresolvedPath: node.unresolvedPath,
                            },
                            children: [],
                        });
                    }
                }
            }
        }
        return unflattenedNodes;
    }

    function unFlattenExtending(
        extending: Source<RefResolution>,
        warnings: WarningRecord[],
    ): Source<UnflattenedRefResolution> {
        const refResolution = unwrapSource(extending);

        let unresolvedPath: UnflattenedPathPart[] | null = null;

        if (refResolution.unresolvedPath) {
            unresolvedPath = unflattenPath(
                refResolution.unresolvedPath,
                warnings,
            );
        }

        const originalPath = unflattenPath(
            refResolution.originalPath,
            warnings,
        );

        const unflattenedRefResolution: UnflattenedRefResolution = {
            nodeIdx: refResolution.nodeIdx,
            unresolvedPath,
            originalPath,
            nodesInResolvedPath: [...refResolution.nodesInResolvedPath],
        };

        return addSource(unflattenedRefResolution, extending);
    }

    function unflattenPath(path: FlatPathPart[], warnings: WarningRecord[]) {
        return path.map((path_part) => {
            let index = path_part.index.map((flat_index) => {
                let value = unflattenDastNodes(flat_index.value, warnings);
                return {
                    value,
                    position: flat_index.position,
                    sourceDoc: flat_index.sourceDoc,
                };
            });

            return {
                index,
                name: path_part.name,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            };
        });
    }

    const documentIdx = normalized_root.children[0];

    let nComponents = normalized_root.nodes.length;

    // console.log({ normalized_root });

    if (
        typeof documentIdx === "string" ||
        normalized_root.children.length !== 1
    ) {
        throw Error("Root of dast should be a single document");
    }
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    const unflattenedDocument = unflattenDastNodes(
        [documentIdx],
        warnings,
    )[0] as UnflattenedComponent;

    if (unflattenedDocument.componentType !== "document") {
        throw Error("Root of dast should be a single document");
    }

    // console.log(
    //     "before create copies",
    //     JSON.parse(JSON.stringify([unflattenedDocument])),
    //     nComponents,
    // );

    const convertToCopyResult = convertRefsToCopies({
        serializedComponents: [unflattenedDocument],
        nComponents,
        componentInfoObjects,
        allNodes: normalized_root.nodes,
        addNodesToResolver,
    });
    nComponents = convertToCopyResult.nComponents;

    // console.log(
    //     "after create copies",
    //     JSON.parse(JSON.stringify(convertToCopyResult.components)),
    //     nComponents,
    // );

    let expandResult = expandUnflattenedToSerializedComponents({
        serializedComponents: convertToCopyResult.components,
        componentInfoObjects,
        nComponents,
    });

    // console.log({ expandResult });

    let expandedRoot = expandResult.components;
    nComponents = expandResult.nComponents;
    errors.push(...expandResult.errors);
    warnings.push(...expandResult.warnings);

    expandedRoot = removeBlankStringChildren(
        expandedRoot,
        componentInfoObjects,
    );

    // console.log(
    //     "before apply sugar",
    //     JSON.parse(JSON.stringify(expandedRoot)),
    //     nComponents,
    // );

    const sugarResult = applySugar({
        serializedComponents: expandedRoot,
        componentInfoObjects,
        nComponents,
    });
    errors.push(...sugarResult.errors);
    warnings.push(...sugarResult.warnings);
    nComponents = sugarResult.nComponents;

    // console.log(
    //     "after apply sugar",
    //     JSON.parse(JSON.stringify(sugarResult.components)),
    //     nComponents,
    // );

    return {
        document: sugarResult.components[0] as SerializedComponent,
        nComponents,
        errors,
        warnings,
        sources: [...normalized_root.sources],
    };
}

/**
 * Expand the intermediate form `UnflattenedComponent` to `SerializedComponent`,
 * which is the format used in the Javascript Core.
 *
 * The main new feature of `SerializedComponent`
 * is that the attributes have been expanded into one of
 * `ComponentAttribute`, `PrimitiveAttribute` or `UnresolvedAttribute`,
 * depending on the attributes defined for the parent's component type.
 *
 * If an error is encountered, convert the serialized component
 * to an "error" (componentType: "_error"), and record the error
 * in the `errors` record.
 */
export function expandUnflattenedToSerializedComponents({
    serializedComponents,
    componentInfoObjects,
    nComponents,
    ignoreErrors = false,
    init = true,
}: {
    serializedComponents: (UnflattenedComponent | string)[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors?: boolean;
    init?: boolean;
}): {
    components: (SerializedComponent | string)[];
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    nComponents: number;
} {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    let newComponents: (SerializedComponent | string)[] = [];

    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        let componentClass: DoenetMLComponentClass<any> =
            componentInfoObjects.allComponentClasses[component.componentType];
        let newComponent: SerializedComponent;

        try {
            if (componentClass === undefined) {
                throw Error(
                    `Invalid component type: <${component.componentType}>`,
                );
            }

            const expandResult = expandAllUnflattenedAttributes({
                unflattenedAttributes: component.attributes,
                componentClass,
                componentInfoObjects,
                nComponents,
            });
            let attributes: Record<string, SerializedAttribute> =
                expandResult.attributes;
            errors.push(...expandResult.errors);
            warnings.push(...expandResult.warnings);
            nComponents = expandResult.nComponents;

            const defaultPrimitiveResult = addDefaultPrimitiveAttributes({
                unflattenedAttributes: component.attributes,
                currentAttributes: attributes,
                componentClass,
                componentInfoObjects,
                nComponents,
            });
            attributes = defaultPrimitiveResult.attributes;
            errors.push(...defaultPrimitiveResult.errors);
            warnings.push(...defaultPrimitiveResult.warnings);
            nComponents = defaultPrimitiveResult.nComponents;

            let extending: Source<SerializedRefResolution> | undefined =
                undefined;

            if (component.extending) {
                const unflattenedRefResolution = unwrapSource(
                    component.extending,
                );
                const refResolutionResult = expandUnflattenedRefResolution({
                    unflattenedRefResolution,
                    componentInfoObjects,
                    nComponents,
                    ignoreErrors,
                });

                const refResolution = refResolutionResult.refResolution;
                extending = addSource(refResolution, component.extending);

                errors.push(...refResolutionResult.errors);
                warnings.push(...refResolutionResult.warnings);
                nComponents = refResolutionResult.nComponents;
            }

            newComponent = {
                ...component,
                type: "serialized",
                children: [],
                attributes,
                extending,
                doenetAttributes: component.doenetAttributes ?? {},
            };
        } catch (e) {
            const convertResult = convertToErrorComponent(component, e);
            newComponent = convertResult.component;

            if (!ignoreErrors) {
                errors.push({
                    type: "error",
                    message: convertResult.message,
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
            }
        }

        //recurse on children
        let ignoreErrorsInChildren =
            ignoreErrors || componentClass?.ignoreErrorsFromChildren;
        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: component.children,
            componentInfoObjects,
            nComponents,
            ignoreErrors: ignoreErrorsInChildren,
            init: false,
        });
        newComponent.children = res.components;
        errors.push(...res.errors);
        warnings.push(...res.warnings);
        nComponents = res.nComponents;

        newComponents.push(newComponent);
    }

    if (init) {
        // decodeXMLEntities recurses to children,
        // so just apply it during the first pass (not on recursion to children)
        newComponents = decodeXMLEntities(newComponents);
    }

    return { errors, warnings, components: newComponents, nComponents };
}

function expandUnflattenedRefResolution({
    unflattenedRefResolution,
    componentInfoObjects,
    nComponents,
    ignoreErrors,
}: {
    unflattenedRefResolution: UnflattenedRefResolution;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors: boolean;
}): {
    refResolution: SerializedRefResolution;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    nComponents: number;
} {
    let unresolvedPath: SerializedRefResolutionPathPart[] | null = null;
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    if (unflattenedRefResolution.unresolvedPath) {
        const res = expandUnflattenedPath({
            unflattenedPath: unflattenedRefResolution.unresolvedPath,
            componentInfoObjects,
            nComponents,
            ignoreErrors,
        });

        unresolvedPath = res.expandedPath;
        nComponents = res.nComponents;
        errors.push(...res.errors);
        warnings.push(...res.warnings);
    }

    const res = expandUnflattenedPath({
        unflattenedPath: unflattenedRefResolution.originalPath,
        componentInfoObjects,
        nComponents,
        ignoreErrors,
    });

    const originalPath = res.expandedPath;
    nComponents = res.nComponents;
    errors.push(...res.errors);
    warnings.push(...res.warnings);

    const refResolution: SerializedRefResolution = {
        nodeIdx: unflattenedRefResolution.nodeIdx,
        unresolvedPath,
        originalPath,
        nodesInResolvedPath: [...unflattenedRefResolution.nodesInResolvedPath],
    };

    return {
        refResolution,
        errors,
        warnings,
        nComponents,
    };
}

function expandUnflattenedPath({
    unflattenedPath,
    componentInfoObjects,
    nComponents,
    ignoreErrors,
}: {
    unflattenedPath: UnflattenedPathPart[];
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
    ignoreErrors: boolean;
}) {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    const expandedPath = unflattenedPath.map((path_part) => {
        let index = path_part.index.map((flat_index) => {
            let res = expandUnflattenedToSerializedComponents({
                serializedComponents: flat_index.value,
                componentInfoObjects,
                nComponents,
                ignoreErrors,
            });
            let valueComponents = res.components;
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;

            if (valueComponents.length !== 1) {
                throw Error("Unresolved index should be a single component");
            }

            return {
                value: valueComponents,
                position: flat_index.position,
                sourceDoc: flat_index.sourceDoc,
            };
        });

        return {
            index,
            name: path_part.name,
            position: path_part.position,
            sourceDoc: path_part.sourceDoc,
        };
    });

    return { expandedPath, nComponents, errors, warnings };
}

/**
 * Based on the attribute definitions of `componentClass`,
 * expand all `unflattenedAttributes` into `SerializedAttribute`s.
 *
 * If errors were encountered within an attribute,
 * the attribute many contain children that are `_error`s
 * and information about the error appended to `errors`.
 *
 * Throws an Error if errors found in the attribute specifications
 * (which will be caught and turn the parent component into an `_error`).
 */
export function expandAllUnflattenedAttributes({
    unflattenedAttributes,
    componentClass,
    componentInfoObjects,
    nComponents,
}: {
    unflattenedAttributes: Record<string, UnflattenedAttribute>;
    componentClass: DoenetMLComponentClass<any>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): {
    attributes: Record<string, SerializedAttribute>;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    nComponents: number;
} {
    let classAttributes = componentClass.createAttributesObject();

    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    let attributeLowerCaseMapping: Record<string, string> = {};

    for (let attrName in classAttributes) {
        attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
    }

    let attributes: Record<string, SerializedAttribute> = {};

    for (let attr in unflattenedAttributes) {
        let attrName = attributeLowerCaseMapping[attr.toLowerCase()];
        let attrDef = classAttributes[attrName];
        if (attrDef) {
            if (attrName in attributes) {
                throw Error(`Cannot repeat attribute ${attrName}.`);
            }

            let res = expandAttribute({
                attrDef,
                attribute: unflattenedAttributes[attr],
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
                nComponents,
            });
            attributes[attrName] = res.attribute;
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;
        } else if (componentClass.acceptAnyAttribute || attr.includes(":")) {
            let res = expandAttribute({
                attribute: unflattenedAttributes[attr],
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
                nComponents,
            });
            attributes[attr] = res.attribute;
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;
        } else {
            throw Error(
                `Invalid attribute "${attr}" for a component of type <${componentClass.componentType}>.`,
            );
        }
    }
    return { attributes, errors, warnings, nComponents };
}

/**
 * If there are any primitive attributes that define a default value
 * but were not specified via props, add them with their default value.
 */
function addDefaultPrimitiveAttributes({
    unflattenedAttributes,
    currentAttributes,
    componentClass,
    componentInfoObjects,
    nComponents,
}: {
    unflattenedAttributes: Record<string, UnflattenedAttribute>;
    currentAttributes: Record<string, SerializedAttribute>;
    componentClass: DoenetMLComponentClass<any>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): {
    attributes: Record<string, SerializedAttribute>;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    nComponents: number;
} {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    let classAttributes = componentClass.createAttributesObject();

    const newAttributes = { ...currentAttributes };

    for (let attrName in classAttributes) {
        let attrDef = classAttributes[attrName];

        if (
            attrDef.createPrimitiveOfType &&
            "defaultPrimitiveValue" in attrDef &&
            !(attrName in currentAttributes)
        ) {
            let res = expandAttribute({
                attrDef: attrDef,
                allUnflattenedAttributes: unflattenedAttributes,
                attribute: {
                    name: attrName,
                    children: [attrDef.defaultPrimitiveValue.toString()],
                },
                componentInfoObjects,
                nComponents,
            });
            newAttributes[attrName] = res.attribute;
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            nComponents = res.nComponents;
        }
    }
    return { attributes: newAttributes, errors, warnings, nComponents };
}

/**
 * Based on the `attrDef` (determined from parent's component type),
 * convert the unflattened attribute `attribute`
 * into a `SerializedAttribute`, which will be one of
 * `ComponentAttribute`, `PrimitiveAttribute` or `UnresolvedAttribute`,
 */
export function expandAttribute({
    attrDef,
    attribute,
    allUnflattenedAttributes = {},
    componentInfoObjects,
    nComponents,
}: {
    attrDef?: AttributeDefinition<any>;
    attribute: UnflattenedAttribute | UnresolvedAttribute;
    allUnflattenedAttributes?: Record<string, UnflattenedAttribute>;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): {
    attribute: SerializedAttribute;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
    nComponents: number;
} {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    if (attrDef?.createComponentOfType) {
        const initialResult = createInitialComponentFromAttribute({
            attrDef,
            attribute,
            componentInfoObjects,
            nComponents,
        });

        const unflattenedComponent = initialResult.component;
        nComponents = initialResult.nComponents;

        if (attribute.position) {
            unflattenedComponent.position = attribute.position;
        }
        if (attribute.sourceDoc !== undefined) {
            unflattenedComponent.sourceDoc = attribute.sourceDoc;
        }

        if (!unflattenedComponent.doenetAttributes) {
            unflattenedComponent.doenetAttributes = {};
        }
        unflattenedComponent.doenetAttributes.isAttributeChildFor =
            attribute.name;

        if (
            attrDef.attributesForCreatedComponent ||
            attrDef.copyComponentAttributesForCreatedComponent
        ) {
            const unflattenedComponentAttributes: Record<
                string,
                UnflattenedAttribute
            > = {};
            if (attrDef.attributesForCreatedComponent) {
                for (const attrName in attrDef.attributesForCreatedComponent) {
                    unflattenedComponentAttributes[attrName] = {
                        name: attrName,
                        children: [
                            attrDef.attributesForCreatedComponent[attrName],
                        ],
                    };
                }
            }

            if (attrDef.copyComponentAttributesForCreatedComponent) {
                for (let attrName of attrDef.copyComponentAttributesForCreatedComponent) {
                    if (allUnflattenedAttributes[attrName]) {
                        // XXX: we many need to increment component indices here
                        unflattenedComponentAttributes[attrName] = JSON.parse(
                            JSON.stringify(allUnflattenedAttributes[attrName]),
                        );
                    }
                }
            }

            unflattenedComponent.attributes = unflattenedComponentAttributes;
        }

        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: [unflattenedComponent],
            componentInfoObjects,
            nComponents,
        });
        errors.push(...res.errors);
        warnings.push(...res.warnings);
        nComponents = res.nComponents;

        let attr: SerializedAttribute = {
            type: "component",
            name: attribute.name,
            component: removeBlankStringChildren(
                res.components,
                componentInfoObjects,
            )[0] as SerializedComponent,
            sourceDoc: attribute.sourceDoc,
        };
        if (attrDef.ignoreFixed) {
            // set the component to ignore the fixed of its parent
            attr.component.doenetAttributes.ignoreParentFixed = true;
        }
        return { attribute: attr, errors, warnings, nComponents };
    } else if (attrDef?.createPrimitiveOfType) {
        let primitiveValue: PrimitiveAttributeValue =
            createPrimitiveFromAttribute({ attrDef, attribute });

        if (attrDef.validatePrimitives) {
            primitiveValue = attrDef.validatePrimitives(primitiveValue);
        }
        return {
            attribute: {
                type: "primitive",
                name: attribute.name,
                primitive: primitiveValue,
                sourceDoc: attribute.sourceDoc,
            },
            errors,
            warnings,
            nComponents,
        };
    } else if (attrDef?.createReferences) {
        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: attribute.children,
            componentInfoObjects,
            nComponents,
        });
        errors.push(...res.errors);
        warnings.push(...res.warnings);
        nComponents = res.nComponents;

        const references: SerializedComponent[] = [];
        const stringChildren: string[] = [];

        for (const child of res.components) {
            if (typeof child === "object") {
                references.push(child);
            } else if (typeof child === "string") {
                if (child.trim() !== "") {
                    stringChildren.push(child);
                    if (!attrDef.allowStrings) {
                        warnings.push({
                            type: "warning",
                            message: `Invalid value "${child.trim()}" for attribute ${attribute.name}. Attribute must be composed of references that begin with a $.`,
                            position: attribute.position,
                            sourceDoc: attribute.sourceDoc,
                        });
                    }
                }
            }
        }

        return {
            attribute: {
                type: "references",
                name: attribute.name,
                references,
                stringChildren,
                position: attribute.position,
                sourceDoc: attribute.sourceDoc,
            },
            errors,
            warnings,
            nComponents,
        };
    } else {
        return {
            attribute: {
                type: "unresolved",
                name: attribute.name,
                children: attribute.children,
                position: attribute.position,
                sourceDoc: attribute.sourceDoc,
            },
            errors,
            warnings,
            nComponents,
        };
    }
}

/**
 * Given that `attrDef` calls for creating a `ComponentAttribute` from `attribute`,
 * create the initial form of an `UnflattenedComponent` to be later converted
 * into a `SerializedComponent` for the attribute.
 *
 * First address special cases of an attribute with no children (corresponding to `true`)
 * as well as a single literal "true" and "false" child in boolean settings.
 * Otherwise create an `UnflattenedComponent` with children being the attribute's children.
 */
function createInitialComponentFromAttribute({
    attrDef,
    attribute,
    componentInfoObjects,
    nComponents,
}: {
    attrDef: AttributeDefinition<any>;
    attribute: UnflattenedAttribute | UnresolvedAttribute;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}): { component: UnflattenedComponent; nComponents: number } {
    if (attrDef.createComponentOfType === undefined) {
        throw Error(
            "Cannot call initialComponentFromAttribute unless have createComponentOfType",
        );
    }

    if (attribute.children.length === 0) {
        // if attribute is a boolean or has a `valueForTrue`,
        // create a component from `true`
        if (attrDef.valueForTrue !== undefined) {
            return {
                component: {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    componentIdx: nComponents++,
                    attributes: {},
                    children: [],
                    state: { value: attrDef.valueForTrue },
                    sourceDoc: attribute.sourceDoc,
                },
                nComponents,
            };
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: attrDef.createComponentOfType,
                baseComponentType: "boolean",
            })
        ) {
            return {
                component: {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    componentIdx: nComponents++,
                    attributes: {},
                    children: [],
                    state: { value: true },
                    sourceDoc: attribute.sourceDoc,
                },
                nComponents,
            };
        } else {
            throw Error(`Invalid empty attribute ${attribute.name}`);
        }
    } else if (attribute.children.length === 1) {
        const firstChild = attribute.children[0];

        if (typeof firstChild === "string") {
            // Address special case of a single string child of "true" or "false",
            // where either have a boolean attribute or an attribute
            // with valueForTrue/valueForFalse.
            let valueTrimLower = firstChild.trim().toLowerCase();

            if (
                valueTrimLower === "true" &&
                attrDef.valueForTrue !== undefined
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentType: attrDef.createComponentOfType,
                        componentIdx: nComponents++,
                        attributes: {},
                        children: [],
                        state: { value: attrDef.valueForTrue },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            } else if (
                valueTrimLower === "false" &&
                attrDef.valueForFalse !== undefined
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentType: attrDef.createComponentOfType,
                        componentIdx: nComponents++,
                        attributes: {},
                        children: [],
                        state: { value: attrDef.valueForFalse },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            } else if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: attrDef.createComponentOfType,
                    baseComponentType: "boolean",
                }) &&
                ["true", "false"].includes(valueTrimLower)
            ) {
                return {
                    component: {
                        type: "unflattened",
                        componentIdx: nComponents++,
                        componentType: attrDef.createComponentOfType,
                        attributes: {},
                        children: [],
                        state: { value: valueTrimLower === "true" },
                        sourceDoc: attribute.sourceDoc,
                    },
                    nComponents,
                };
            }
        }
    }

    const component: UnflattenedComponent = {
        type: "unflattened",
        componentType: attrDef.createComponentOfType,
        componentIdx: nComponents++,
        attributes: {},
        children: [],
        state: {},
        sourceDoc: attribute.sourceDoc,
    };

    component.children = [...attribute.children];

    return { component, nComponents };
}

/**
 * Given that `attrDef` calls for creating a `PrimitiveAttribute` from `attribute`,
 * create the `PrimitiveAttributeValue` from the attribute's children,
 * based on the type of primitive called for by `attrDef`.
 */
function createPrimitiveFromAttribute({
    attrDef,
    attribute,
}: {
    attrDef: AttributeDefinition<any>;
    attribute: UnflattenedAttribute;
}): PrimitiveAttributeValue {
    if (attrDef.createPrimitiveOfType === undefined) {
        throw Error(
            "Cannot call initialPrimitiveFromAttribute unless have createPrimitiveOfType",
        );
    }

    if (attribute.children.length === 0) {
        // if attribute is a boolean or has a `valueForTrue`,
        // create a component from `true`
        if (attrDef.valueForTrue !== undefined) {
            return attrDef.valueForTrue;
        } else if (attrDef.createPrimitiveOfType === "boolean") {
            return { type: "boolean", value: true };
        } else {
            throw Error(`Invalid empty attribute ${attribute.name}`);
        }
    } else if (attribute.children.length === 1) {
        const firstChild = attribute.children[0];

        if (typeof firstChild === "string") {
            let valueTrimLower = firstChild.trim().toLowerCase();

            if (
                valueTrimLower === "true" &&
                attrDef.valueForTrue !== undefined
            ) {
                return attrDef.valueForTrue;
            } else if (
                valueTrimLower === "false" &&
                attrDef.valueForFalse !== undefined
            ) {
                return attrDef.valueForFalse;
            } else if (attrDef.createPrimitiveOfType === "boolean") {
                return { type: "boolean", value: valueTrimLower === "true" };
            } else if (attrDef.createPrimitiveOfType === "number") {
                return { type: "number", value: Number(firstChild) };
            } else if (attrDef.createPrimitiveOfType === "integer") {
                return {
                    type: "number",
                    value: Math.round(Number(firstChild)),
                };
            } else if (attrDef.createPrimitiveOfType === "numberArray") {
                return {
                    type: "numberArray",
                    value: firstChild.trim().split(/\s+/).map(Number),
                };
            } else if (attrDef.createPrimitiveOfType === "stringArray") {
                return {
                    type: "stringArray",
                    value: firstChild.trim().split(/\s+/),
                };
            } else {
                // else assume string
                return { type: "string", value: firstChild };
            }
        }
    }

    throw Error(
        `Invalid reference in a primitive attribute: ${attribute.name}`,
    );
}

export function convertUnresolvedAttributesForComponentType({
    attributes,
    componentType,
    componentInfoObjects,
    compositeAttributesObj = {},
    dontSkipAttributes = [],
    nComponents,
}: {
    attributes: Record<string, SerializedAttribute>;
    componentType: string;
    componentInfoObjects: ComponentInfoObjects;
    compositeAttributesObj?: Record<string, AttributeDefinition<any>>;
    dontSkipAttributes?: string[];
    nComponents: number;
}) {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    const newClass = componentInfoObjects.allComponentClasses[componentType];
    const newAttributesObj = newClass.createAttributesObject();

    let attributeLowerCaseMapping: Record<string, string> = {};

    for (let attrName in newAttributesObj) {
        attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
    }

    const newAttributes: Record<string, SerializedAttribute> = {};

    for (const attrNameOrig in attributes) {
        const attribute = attributes[attrNameOrig];

        const attrName =
            attributeLowerCaseMapping[attrNameOrig.toLocaleLowerCase()];

        const attrDef = newAttributesObj[attrName];

        if (
            attrName in compositeAttributesObj &&
            !compositeAttributesObj[attrName].leaveRaw &&
            !dontSkipAttributes.includes(attrName)
        ) {
            // skip any attributes in the composite itself
            // unless specifically marked to not be processed for the composite
            // or argument is passed in to not skip
            continue;
        }

        if (attrDef) {
            if (attribute.type === "unresolved") {
                let res = expandAttribute({
                    attrDef,
                    attribute,
                    componentInfoObjects,
                    nComponents,
                });

                newAttributes[attrName] = res.attribute;
                errors.push(...res.errors);
                warnings.push(...res.warnings);
                nComponents = res.nComponents;

                if (newAttributes[attrName].type === "component") {
                    // give the children of the component new component indices
                    for (const child of newAttributes[attrName].component
                        .children) {
                        if (typeof child === "object") {
                            child.componentIdx = nComponents++;
                        }
                    }

                    let serializedComponents = [
                        newAttributes[attrName].component,
                    ];

                    removeBlankStringChildren(
                        serializedComponents,
                        componentInfoObjects,
                    );

                    const sugarResult = applySugar({
                        serializedComponents,
                        componentInfoObjects,
                        nComponents,
                    });
                    errors.push(...sugarResult.errors);
                    warnings.push(...sugarResult.warnings);
                    nComponents = sugarResult.nComponents;

                    newAttributes[attrName].component = sugarResult
                        .components[0] as SerializedComponent;
                }
            } else {
                // The attribute is already resolved.
                newAttributes[attrName] = attribute;
            }
        } else if (newClass.acceptAnyAttribute) {
            newAttributes[attrNameOrig] = attribute;
        }
    }

    return { attributes: newAttributes, nComponents };
}

/**
 * Convert `attributeValues` into `SerializedAttribute`s for a component of type `componentType`.
 * Attributes that don't match what `componentType` accepts are ignored.
 *
 * Arguments:
 * - `attributeValues`: an object keyed on attribute names with each value consisting
 *   of the desired value for that attribute
 * - `componentType`: the type of component that these attributes will be assigned to.
 * - `componentInfoObjects`
 * - `nComponents`
 *
 * Returns:
 * - `attributes`: the new attributes
 * - `nComponents`
 */
export function convertAttributeValuesForComponentType({
    attributeValues,
    componentType,
    componentInfoObjects,
    nComponents,
}: {
    attributeValues: Record<string, unknown>;
    componentType: string;
    componentInfoObjects: ComponentInfoObjects;
    nComponents: number;
}) {
    const errors: ErrorRecord[] = [];
    const warnings: WarningRecord[] = [];

    const newClass = componentInfoObjects.allComponentClasses[componentType];
    const newAttributesObj = newClass.createAttributesObject();

    let attributeLowerCaseMapping: Record<string, string> = {};

    for (let attrName in newAttributesObj) {
        attributeLowerCaseMapping[attrName.toLowerCase()] = attrName;
    }

    const newAttributes: Record<string, SerializedAttribute> = {};

    for (const attrNameOrig in attributeValues) {
        const attributeVal = attributeValues[attrNameOrig];

        const attrName =
            attributeLowerCaseMapping[attrNameOrig.toLocaleLowerCase()];

        const attrDef = newAttributesObj[attrName];

        if (attrDef?.createComponentOfType) {
            newAttributes[attrName] = {
                type: "component",
                name: attrName,
                component: {
                    type: "serialized",
                    componentIdx: nComponents++,
                    componentType: attrDef.createComponentOfType,
                    attributes: {},
                    doenetAttributes: {},
                    state: { value: attributeVal },
                    children: [],
                },
            };
        } else if (attrDef?.createPrimitiveOfType) {
            const cType = attrDef.createPrimitiveOfType;

            if (
                cType === "string" ||
                cType === "boolean" ||
                cType === "number"
            ) {
                if (typeof attributeVal === cType) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal as any },
                    };
                }
            } else if (cType === "numberArray") {
                if (
                    Array.isArray(attributeVal) &&
                    attributeVal.every((v) => typeof v === "number")
                ) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal },
                    };
                }
            } else if (cType === "stringArray") {
                if (
                    Array.isArray(attributeVal) &&
                    attributeVal.every((v) => typeof v === "string")
                ) {
                    newAttributes[attrName] = {
                        type: "primitive",
                        name: attrName,
                        primitive: { type: cType, value: attributeVal },
                    };
                }
            }
        }
    }

    return { attributes: newAttributes, nComponents };
}

/**
 * Unwrap an `extending` attribute to its underlying `refResolution`.
 */
export function unwrapSource<T>(extending: Source<T>): T {
    if ("Ref" in extending) {
        return extending.Ref;
    } else if ("ExtendAttribute" in extending) {
        return extending.ExtendAttribute;
    } else {
        return extending.CopyAttribute;
    }
}

/**
 * Wrap `refResolution` with the type of `Source` that `extending` has.
 */
export function addSource<T, U>(
    refResolution: T,
    extending: Source<U>,
): Source<T> {
    if ("Ref" in extending) {
        return { Ref: refResolution };
    } else if ("ExtendAttribute" in extending) {
        return { ExtendAttribute: refResolution };
    } else {
        return { CopyAttribute: refResolution };
    }
}

/**
 * For divisions, return their `type` attribute as `componentType`.
 * For all other elements return their `name` as `componentType`.
 */
function getComponentType(element: FlatElement) {
    if (element.name === "division") {
        const typeAttr = element.attributes.find(
            (attr) => attr.name === "type",
        );
        if (
            typeAttr?.children.length == 1 &&
            typeof typeAttr.children[0] === "string"
        ) {
            return typeAttr.children[0];
        }
    }

    return element.name;
}
