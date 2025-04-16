import { NormalizedNode, NormalizedRoot } from "@doenet/doenetml-worker";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    AttributeDefinition,
    ErrorRecord,
    PrimitiveAttributeValue,
    SerializedAttribute,
    SerializedComponent,
    WarningRecord,
} from "./types";
import {
    UnflattenedAttribute,
    UnflattenedComponent,
} from "./intermediateTypes";
import { convertToSerializedErrorComponent } from "./errors";
import { decodeXMLEntities, removeBlankStringChildren } from "./convertUtils";
import { applySugar } from "./sugar";

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
    errors: ErrorRecord[];
    warnings: WarningRecord[];
}> {
    /**
     * Unflatten the normalized dast node so that
     * children of attributes and nodes contain the actual children.
     *
     * Convert Elements to a `componentType` matching their name.
     * Convert Errors to a `componentType` of "_error".
     */
    function unflattenDastNode(node: NormalizedNode): UnflattenedComponent {
        if (node.type === "Element") {
            return {
                type: "unflattened",
                componentType: node.name,
                attributes: Object.fromEntries(
                    node.attributes.map((attribute) => [
                        attribute.name,
                        {
                            name: attribute.name,
                            children: attribute.children.map((child) => {
                                if (typeof child === "string") {
                                    return child;
                                } else {
                                    return unflattenDastNode(
                                        normalized_root.nodes[child],
                                    );
                                }
                            }),
                            position: attribute.position,
                        },
                    ]),
                ),
                position: node.position,
                extending: node.extending,
                children: node.children.map((child) => {
                    if (typeof child === "string") {
                        return child;
                    } else {
                        return unflattenDastNode(normalized_root.nodes[child]);
                    }
                }),
                state: {},
            };
        } else {
            // node.type === "Error"
            return {
                type: "unflattened",
                componentType: "_error",
                attributes: {},
                position: node.position,
                state: { message: node.message },
                children: [],
            };
        }
    }

    const documentIdx = normalized_root.children[0];

    if (
        typeof documentIdx === "string" ||
        normalized_root.children.length !== 1
    ) {
        throw Error("Root of dast should be a single document");
    }

    const unflattenedDocument = unflattenDastNode(
        normalized_root.nodes[documentIdx],
    );

    if (unflattenedDocument.componentType !== "document") {
        throw Error("Root of dast should be a single document");
    }

    let expandResult = expandUnflattenedToSerializedComponents(
        [unflattenedDocument],
        componentInfoObjects,
    );

    let expandedRoot = expandResult.components;
    const errors = expandResult.errors;
    const warnings: WarningRecord[] = [];

    expandedRoot = removeBlankStringChildren(
        expandedRoot,
        componentInfoObjects,
    );

    expandedRoot = decodeXMLEntities(expandedRoot);

    const sugarResult = applySugar({
        serializedComponents: expandedRoot,
        componentInfoObjects,
    });
    errors.push(...sugarResult.errors);
    warnings.push(...sugarResult.warnings);

    console.log("after sugar", sugarResult.components);

    return {
        document: sugarResult.components[0] as SerializedComponent,
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
export function expandUnflattenedToSerializedComponents(
    serializedComponents: (UnflattenedComponent | string)[],
    componentInfoObjects: ComponentInfoObjects,
    ignoreErrors = false,
): { components: (SerializedComponent | string)[]; errors: ErrorRecord[] } {
    let errors: ErrorRecord[] = [];

    const newComponents: (SerializedComponent | string)[] = [];

    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        let componentClass =
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
            });
            let attributes: Record<string, SerializedAttribute> =
                expandResult.attributes;
            errors.push(...expandResult.errors);

            const defaultPrimitiveResult = addDefaultPrimitiveAttributes({
                unflattenedAttributes: component.attributes,
                currentAttributes: attributes,
                componentClass,
                componentInfoObjects,
            });
            attributes = defaultPrimitiveResult.attributes;
            errors.push(...defaultPrimitiveResult.errors);

            newComponent = {
                ...component,
                type: "serialized",
                children: [],
                attributes,
            };
        } catch (e) {
            const convertResult = convertToSerializedErrorComponent(
                e,
                component,
            );
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
        let res = expandUnflattenedToSerializedComponents(
            component.children,
            componentInfoObjects,
            ignoreErrorsInChildren,
        );
        newComponent.children = res.components;
        errors.push(...res.errors);

        newComponents.push(newComponent);
    }

    return { errors, components: newComponents };
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
}: {
    unflattenedAttributes: Record<string, UnflattenedAttribute>;
    componentClass: any;
    componentInfoObjects: ComponentInfoObjects;
}) {
    let classAttributes: Record<
        string,
        AttributeDefinition<any>
    > = componentClass.createAttributesObject();

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
            });
            attributes[attrName] = res.attribute;
            errors.push(...res.errors);
        } else if (componentClass.acceptAnyAttribute) {
            let res = expandAttribute({
                attribute: unflattenedAttributes[attr],
                allUnflattenedAttributes: unflattenedAttributes,
                componentInfoObjects,
            });
            attributes[attr] = res.attribute;
            errors.push(...res.errors);
        } else {
            throw Error(
                `Invalid attribute "${attr}" for a component of type <${componentClass.componentType}>.`,
            );
        }
    }
    return { attributes, errors };
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
}: {
    unflattenedAttributes: Record<string, UnflattenedAttribute>;
    currentAttributes: Record<string, SerializedAttribute>;
    componentClass: any;
    componentInfoObjects: ComponentInfoObjects;
}) {
    const errors: ErrorRecord[] = [];

    let classAttributes: Record<
        string,
        AttributeDefinition<any>
    > = componentClass.createAttributesObject();

    const newAttributes = { ...currentAttributes };

    for (let attrName in classAttributes) {
        let attrObj = classAttributes[attrName];

        if (
            attrObj.createPrimitiveOfType &&
            "defaultPrimitiveValue" in attrObj &&
            !(attrName in currentAttributes)
        ) {
            let res = expandAttribute({
                attrDef: attrObj,
                allUnflattenedAttributes: unflattenedAttributes,
                attribute: {
                    name: attrName,
                    children: [attrObj.defaultPrimitiveValue.toString()],
                },
                componentInfoObjects,
            });
            newAttributes[attrName] = res.attribute;
            errors.push(...res.errors);
        }
    }
    return { attributes: newAttributes, errors };
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
}: {
    attrDef?: AttributeDefinition<any>;
    attribute: UnflattenedAttribute;
    allUnflattenedAttributes?: Record<string, UnflattenedAttribute>;
    componentInfoObjects: ComponentInfoObjects;
}): { attribute: SerializedAttribute; errors: ErrorRecord[] } {
    let errors: ErrorRecord[] = [];

    if (attrDef?.createComponentOfType) {
        const unflattenedComponent = createInitialComponentFromAttribute({
            attrDef,
            attribute,
            componentInfoObjects,
        });

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
                        unflattenedComponentAttributes[attrName] = JSON.parse(
                            JSON.stringify(allUnflattenedAttributes[attrName]),
                        );
                    }
                }
            }

            unflattenedComponent.attributes = unflattenedComponentAttributes;
        }

        let res = expandUnflattenedToSerializedComponents(
            [unflattenedComponent],
            componentInfoObjects,
        );
        errors.push(...res.errors);

        let attr: SerializedAttribute = {
            type: "component",
            name: attribute.name,
            component: res.components[0] as SerializedComponent,
        };
        if (attrDef.ignoreFixed) {
            attr.ignoreFixed = true;
        }
        return { attribute: attr, errors };
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
        };
    } else {
        // XXX: ignoring attrDef.createTargetComponentNames
        // which might be obsolete with new reference conventions

        let res = expandUnflattenedToSerializedComponents(
            attribute.children,
            componentInfoObjects,
        );
        errors.push(...res.errors);
        return {
            attribute: {
                type: "unresolved",
                name: attribute.name,
                childrenForFutureComponent: res.components,
            },
            errors,
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
}: {
    attrDef: AttributeDefinition<any>;
    attribute: UnflattenedAttribute;
    componentInfoObjects: ComponentInfoObjects;
}): UnflattenedComponent {
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
                type: "unflattened",
                componentType: attrDef.createComponentOfType,
                attributes: {},
                children: [],
                state: { value: attrDef.valueForTrue },
            };
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: attrDef.createComponentOfType,
                baseComponentType: "boolean",
            })
        ) {
            return {
                type: "unflattened",
                componentType: attrDef.createComponentOfType,
                attributes: {},
                children: [],
                state: { value: true },
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
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    attributes: {},
                    children: [],
                    state: { value: attrDef.valueForTrue },
                };
            } else if (
                valueTrimLower === "false" &&
                attrDef.valueForFalse !== undefined
            ) {
                return {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    attributes: {},
                    children: [],
                    state: { value: attrDef.valueForFalse },
                };
            } else if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: attrDef.createComponentOfType,
                    baseComponentType: "boolean",
                }) &&
                ["true", "false"].includes(valueTrimLower)
            ) {
                return {
                    type: "unflattened",
                    componentType: attrDef.createComponentOfType,
                    attributes: {},
                    children: [],
                    state: { value: valueTrimLower === "true" },
                };
            }
        }
    }

    return {
        type: "unflattened",
        componentType: attrDef.createComponentOfType,
        attributes: {},
        children: attribute.children,
        state: {},
    };
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
            return true;
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
                return valueTrimLower === "true";
            } else if (attrDef.createPrimitiveOfType === "number") {
                return Number(firstChild);
            } else if (attrDef.createPrimitiveOfType === "integer") {
                return Math.round(Number(firstChild));
            } else if (attrDef.createPrimitiveOfType === "stringArray") {
                return firstChild.trim().split(/\s+/);
            } else if (attrDef.createPrimitiveOfType === "numberArray") {
                return firstChild.trim().split(/\s+/).map(Number);
            } else {
                // else assume string
                return firstChild;
            }
        }
    }

    throw Error(
        `Invalid reference in a primitive attribute: ${attribute.name}`,
    );
}
