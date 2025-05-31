import {
    FlatPathPart,
    NormalizedRoot,
    RefResolution,
    Source,
    UntaggedContent,
} from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    AttributeDefinition,
    DoenetMLComponentClass,
    ErrorRecord,
    PrimitiveAttributeValue,
    SerializedAttribute,
    SerializedComponent,
    SerializedRefResolution,
    SerializedRefResolutionPathPart,
    UnresolvedAttribute,
    WarningRecord,
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
import { breakStringInPiecesBySpacesOrParens } from "../assignNames";

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
): Promise<{
    document: SerializedComponent;
    nComponents: number;
    errors: ErrorRecord[];
    warnings: WarningRecord[];
}> {
    /**
     * Unflatten the normalized dast node so that
     * children of attributes and nodes, as well as ref resolutions, contain the actual children.
     *
     * Convert Elements to a `componentType` matching their name.
     * Convert Errors to a `componentType` of "_error".
     */
    function unflattenDastNode(
        idxOrString: UntaggedContent,
    ): UnflattenedComponent | string {
        if (typeof idxOrString === "string") {
            return idxOrString;
        } else {
            const node = normalized_root.nodes[idxOrString];
            if (node.type === "element") {
                return {
                    type: "unflattened",
                    componentType: node.name,
                    componentIdx: idxOrString,
                    attributes: Object.fromEntries(
                        node.attributes.map((attribute) => [
                            attribute.name,
                            {
                                name: attribute.name,
                                children:
                                    attribute.children.map(unflattenDastNode),
                                position: attribute.position,
                            },
                        ]),
                    ),
                    position: node.position,
                    childrenPosition: node.children_position,
                    extending: node.extending
                        ? unFlattenExtending(node.extending)
                        : undefined,
                    children: node.children.map(unflattenDastNode),
                    state: {},
                };
            } else {
                // node.type === "error"
                return {
                    type: "unflattened",
                    componentType: "_error",
                    componentIdx: idxOrString,
                    attributes: {},
                    position: node.position,
                    state: {
                        message: node.message,
                        unresolvedPath: node.unresolvedPath,
                    },
                    children: [],
                };
            }
        }
    }

    function unFlattenExtending(
        extending: Source<RefResolution>,
    ): Source<UnflattenedRefResolution> {
        const refResolution = unwrapSource(extending);

        let unresolvedPath: UnflattenedPathPart[] | null = null;

        if (refResolution.unresolvedPath) {
            unresolvedPath = unflattenPath(refResolution.unresolvedPath);
        }

        const originalPath = unflattenPath(refResolution.originalPath);

        const unflattenedRefResolution: UnflattenedRefResolution = {
            nodeIdx: refResolution.nodeIdx,
            unresolvedPath,
            originalPath,
        };

        return addSource(unflattenedRefResolution, extending);
    }

    function unflattenPath(path: FlatPathPart[]) {
        return path.map((path_part) => {
            let index = path_part.index.map((flat_index) => {
                let value = flat_index.value.map(unflattenDastNode);
                return {
                    value,
                    position: flat_index.position,
                };
            });

            return {
                index,
                name: path_part.name,
                position: path_part.position,
            };
        });
    }

    const documentIdx = normalized_root.children[0];

    let nComponents = normalized_root.nodes.length;

    if (
        typeof documentIdx === "string" ||
        normalized_root.children.length !== 1
    ) {
        throw Error("Root of dast should be a single document");
    }

    const unflattenedDocument = unflattenDastNode(
        documentIdx,
    ) as UnflattenedComponent;

    if (unflattenedDocument.componentType !== "document") {
        throw Error("Root of dast should be a single document");
    }

    const convertToCopyResult = convertRefsToCopies({
        serializedComponents: [unflattenedDocument],
        nComponents,
        componentInfoObjects,
        allNodes: normalized_root.nodes,
    });
    nComponents = convertToCopyResult.nComponents;

    let expandResult = expandUnflattenedToSerializedComponents({
        serializedComponents: convertToCopyResult.components,
        componentInfoObjects,
        nComponents,
    });

    let expandedRoot = expandResult.components;
    nComponents = expandResult.nComponents;
    const errors = expandResult.errors;
    const warnings: WarningRecord[] = [];

    expandedRoot = removeBlankStringChildren(
        expandedRoot,
        componentInfoObjects,
    );

    const sugarResult = applySugar({
        serializedComponents: expandedRoot,
        componentInfoObjects,
        nComponents,
    });
    errors.push(...sugarResult.errors);
    warnings.push(...sugarResult.warnings);
    nComponents = sugarResult.nComponents;

    return {
        document: sugarResult.components[0] as SerializedComponent,
        nComponents,
        errors,
        warnings,
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
    nComponents: number;
} {
    let errors: ErrorRecord[] = [];

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
                    `Invalid component type: ${component.componentType}`,
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
                    message: convertResult.message,
                    position: component.position,
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
        nComponents = res.nComponents;

        newComponents.push(newComponent);
    }

    if (init) {
        // decodeXMLEntities recurses to children,
        // so just apply it during the first pass (not on recursion to children)
        newComponents = decodeXMLEntities(newComponents);
    }

    return { errors, components: newComponents, nComponents };
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
    nComponents: number;
} {
    let unresolvedPath: SerializedRefResolutionPathPart[] | null = null;
    let errors: ErrorRecord[] = [];

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

    const refResolution: SerializedRefResolution = {
        nodeIdx: unflattenedRefResolution.nodeIdx,
        unresolvedPath,
        originalPath,
    };

    return {
        refResolution,
        errors,
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
    let errors: ErrorRecord[] = [];

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
            nComponents = res.nComponents;

            if (valueComponents.length !== 1) {
                throw Error("Unresolved index should be a single component");
            }

            return {
                value: valueComponents,
                position: flat_index.position,
            };
        });

        return {
            index,
            name: path_part.name,
            position: path_part.position,
        };
    });

    return { expandedPath, nComponents, errors };
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
    nComponents: number;
} {
    let classAttributes = componentClass.createAttributesObject();

    const errors: ErrorRecord[] = [];

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
            nComponents = res.nComponents;
        } else if (componentClass.acceptAnyAttribute) {
            let res = expandAttribute({
                attribute: unflattenedAttributes[attr],
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
                nComponents,
            });
            attributes[attr] = res.attribute;
            errors.push(...res.errors);
            nComponents = res.nComponents;
        } else {
            throw Error(
                `Invalid attribute "${attr}" for a component of type <${componentClass.componentType}>.`,
            );
        }
    }
    return { attributes, errors, nComponents };
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
    nComponents: number;
} {
    const errors: ErrorRecord[] = [];

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
            nComponents = res.nComponents;
        }
    }
    return { attributes: newAttributes, errors, nComponents };
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
    nComponents: number;
} {
    let errors: ErrorRecord[] = [];

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
        nComponents = res.nComponents;

        let attr: SerializedAttribute = {
            type: "component",
            name: attribute.name,
            component: removeBlankStringChildren(
                res.components,
                componentInfoObjects,
            )[0] as SerializedComponent,
        };
        if (attrDef.ignoreFixed) {
            // set the component to ignore the fixed of its parent
            attr.component.doenetAttributes.ignoreParentFixed = true;
        }
        return { attribute: attr, errors, nComponents };
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
            },
            errors,
            nComponents,
        };
    } else if (attrDef?.createReferences) {
        let res = expandUnflattenedToSerializedComponents({
            serializedComponents: attribute.children,
            componentInfoObjects,
            nComponents,
        });
        errors.push(...res.errors);
        nComponents = res.nComponents;
        return {
            attribute: {
                type: "references",
                name: attribute.name,
                references: res.components.filter(
                    (child) => typeof child === "object",
                ),
                position: attribute.position,
            },
            errors,
            nComponents,
        };
    } else {
        return {
            attribute: {
                type: "unresolved",
                name: attribute.name,
                children: attribute.children,
                position: attribute.position,
            },
            errors,
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
    };

    component.children = attribute.children.map((child) => {
        if (typeof child === "object") {
            child.componentIdx = nComponents++;
        }
        return child;
    });

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
            } else if (
                attrDef.createPrimitiveOfType === "recursiveStringArray"
            ) {
                const result = breakStringInPiecesBySpacesOrParens(firstChild);
                if (!result.success) {
                    throw Error("Invalid format for assignNames");
                }
                return {
                    type: "recursiveStringArray",
                    value: result.pieces,
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

    const newAttributes: Record<string, SerializedAttribute> = {};

    for (const attrName in attributes) {
        const attribute = attributes[attrName];
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
                nComponents = res.nComponents;

                if (newAttributes[attrName].type === "component") {
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
            newAttributes[attrName] = attribute;
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
