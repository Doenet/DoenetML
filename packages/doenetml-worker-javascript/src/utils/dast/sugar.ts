import { deepClone } from "@doenet/utils";
import { ComponentInfoObjects } from "../componentInfoObjects";
import {
    ErrorRecord,
    isSerializedAttribute,
    isSerializedComponent,
    PrimitiveAttributeValue,
    SerializedComponent,
    WarningRecord,
} from "./types";
import { findPreSugarIndsAndMarkFromSugar } from "../expandDoenetML";
import {
    isUnflattenedAttribute,
    isUnflattenedComponent,
} from "./intermediateTypes";
import {
    expandAllUnflattenedAttributes,
    expandUnflattenedToSerializedComponents,
} from "./convertNormalizdDast";
import { convertToSerializedErrorComponent } from "./errors";

/**
 * If a component class has specified sugar instructions,
 * then apply those instructors to the children,
 * potentially creating new children and attributes.
 */
export function applySugar({
    serializedComponents,
    parentParametersFromSugar = {},
    parentAttributes = {},
    componentInfoObjects,
    isAttributeComponent = false,
}: {
    serializedComponents: (string | SerializedComponent)[];
    parentParametersFromSugar?: Record<string, any>;
    parentAttributes?: Record<string, any>;
    componentInfoObjects: ComponentInfoObjects;
    isAttributeComponent?: boolean;
}): {
    components: (string | SerializedComponent)[];
    errors: ErrorRecord[];
    warnings: WarningRecord[];
} {
    let errors: ErrorRecord[] = [];
    let warnings: WarningRecord[] = [];

    const newComponents: (string | SerializedComponent)[] = [];

    for (let component of serializedComponents) {
        if (typeof component === "string") {
            newComponents.push(component);
            continue;
        }

        try {
            let componentType = component.componentType;
            let componentClass =
                componentInfoObjects.allComponentClasses[componentType];
            if (!componentClass) {
                throw Error(`Unrecognized component type ${componentType}.`);
            }

            let componentAttributes: Record<string, PrimitiveAttributeValue> =
                {};
            // add primitive attributes to componentAttributes
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.type === "primitive") {
                    componentAttributes[attrName] = attribute.primitive;
                }
            }

            let newParentParametersFromSugar = {};

            let newComponent = component;

            if (!component.skipSugar) {
                for (let sugarInstruction of componentClass.returnSugarInstructions()) {
                    let childTypes = component.children
                        .map((x) => (typeof x === "string" ? "s" : "n"))
                        .join("");

                    if (sugarInstruction.childrenRegex) {
                        let match = childTypes.match(
                            sugarInstruction.childrenRegex,
                        );

                        if (
                            !match ||
                            match[0].length !== component.children.length
                        ) {
                            // sugar pattern didn't match all children
                            // so don't apply sugar

                            continue;
                        }
                    }

                    let matchedChildren = deepClone(
                        component.children,
                        undefined,
                        undefined,
                    );

                    let nNonStrings = 0;
                    for (let child of matchedChildren) {
                        if (typeof child !== "string") {
                            child.preSugarInd = nNonStrings;
                            nNonStrings++;
                        }
                    }

                    let createdFromMacro = false;
                    if (
                        component.doenetAttributes &&
                        component.doenetAttributes.createdFromMacro
                    ) {
                        createdFromMacro = true;
                    }

                    let sugarResults = sugarInstruction.replacementFunction({
                        matchedChildren,
                        parentParametersFromSugar,
                        parentAttributes,
                        componentAttributes,
                        componentInfoObjects,
                        isAttributeComponent,
                        createdFromMacro,
                    });

                    if (sugarResults.warnings) {
                        warnings.push(
                            ...sugarResults.warnings.map((w: WarningRecord) => {
                                const w2 = { ...w };
                                w2.position = component.position;
                                return w2;
                            }),
                        );
                    }

                    if (sugarResults.success) {
                        let newChildren = sugarResults.newChildren;
                        let newAttributes = sugarResults.newAttributes;

                        let preSugarIndsFoundInChildren = [],
                            preSugarIndsFoundInAttributes = [];

                        if (newChildren) {
                            // TODO: convert findPreSugarIndsAndMarkFromSugar
                            preSugarIndsFoundInChildren =
                                findPreSugarIndsAndMarkFromSugar(newChildren);
                        }
                        if (newAttributes) {
                            for (let attrName in newAttributes) {
                                let comp = newAttributes[attrName].component;
                                if (comp) {
                                    preSugarIndsFoundInAttributes.push(
                                        ...findPreSugarIndsAndMarkFromSugar(
                                            comp.children,
                                        ),
                                    );
                                }
                            }
                        }

                        let preSugarIndsFound = [
                            ...preSugarIndsFoundInChildren,
                            ...preSugarIndsFoundInAttributes,
                        ];

                        if (
                            preSugarIndsFound.length !== nNonStrings ||
                            !preSugarIndsFound
                                .sort((a, b) => a - b)
                                .every((v, i) => v === i)
                        ) {
                            throw Error(
                                `Invalid sugar for ${componentType} as didn't return set of original components`,
                            );
                        }

                        if (preSugarIndsFoundInChildren.length > 0) {
                            let sortedList = [
                                ...preSugarIndsFoundInChildren,
                            ].sort((a, b) => a - b);
                            if (
                                !sortedList.every(
                                    (v, i) =>
                                        v === preSugarIndsFoundInChildren[i],
                                )
                            ) {
                                throw Error(
                                    `Invalid sugar for ${componentType} as didn't return original components in order`,
                                );
                            }
                        }

                        if (sugarResults.parametersForChildrenSugar) {
                            Object.assign(
                                newParentParametersFromSugar,
                                sugarResults.parametersForChildrenSugar,
                            );
                        }

                        newComponent = { ...newComponent };

                        if (newChildren) {
                            // Currently, we accept either serialized or unflattened children from the sugar.
                            // TODO: determine which type is the one to use in sugar and standardize on that.
                            if (
                                newChildren.every(
                                    (child: unknown) =>
                                        isSerializedComponent(child) ||
                                        typeof child === "string",
                                )
                            ) {
                                newComponent.children = newChildren;
                            } else if (
                                newChildren.every(
                                    (child: unknown) =>
                                        isUnflattenedComponent(child) ||
                                        typeof child === "string",
                                )
                            ) {
                                const expandResult =
                                    expandUnflattenedToSerializedComponents(
                                        newChildren,
                                        componentInfoObjects,
                                    );
                                newComponent.children = expandResult.components;
                                errors.push(...expandResult.errors);
                            } else {
                                throw Error(
                                    "Invalid newChildren returned from sugar",
                                );
                            }
                        } else {
                            newComponent.children = [];
                        }

                        if (newAttributes) {
                            newComponent.attributes = {
                                ...newComponent.attributes,
                            };
                            // Currently, we accept either serialized or unflattened attributes from the sugar.
                            // TODO: determine which type is the one to use in sugar and standardize on that.
                            if (
                                Object.values(newAttributes).every((attr) =>
                                    isSerializedAttribute(attr),
                                )
                            ) {
                                Object.assign(
                                    newComponent.attributes,
                                    newAttributes,
                                );
                            } else if (
                                Object.values(newAttributes).every((attr) =>
                                    isUnflattenedAttribute(attr),
                                )
                            ) {
                                const expandResult =
                                    expandAllUnflattenedAttributes({
                                        unflattenedAttributes: newAttributes,
                                        componentClass,
                                        componentInfoObjects,
                                    });
                                Object.assign(
                                    newComponent.attributes,
                                    expandResult.attributes,
                                );
                                errors.push(...expandResult.errors);
                            } else {
                                throw Error(
                                    "Invalid newAttributes returned from sugar",
                                );
                            }
                        }
                    }
                }
            }

            if (componentClass.removeBlankStringChildrenPostSugar) {
                newComponent.children = newComponent.children.filter(
                    (x) => typeof x !== "string" || /\S/.test(x),
                );
            }

            // Note: don't pass in isAttributeComponent
            // as that flag should be set just for the top level attribute component

            let res = applySugar({
                serializedComponents: newComponent.children,
                parentParametersFromSugar: newParentParametersFromSugar,
                parentAttributes: componentAttributes,
                componentInfoObjects,
            });
            newComponent.children = res.components;
            errors.push(...res.errors);
            warnings.push(...res.warnings);

            for (let attrName in newComponent.attributes) {
                let attribute = newComponent.attributes[attrName];

                if (attribute.type === "component") {
                    let res = applySugar({
                        serializedComponents: [attribute.component],
                        parentAttributes: componentAttributes,
                        componentInfoObjects,
                        isAttributeComponent: true,
                    });
                    attribute.component = res
                        .components[0] as SerializedComponent;
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                }
            }

            newComponents.push(newComponent);
        } catch (e) {
            const convertResult = convertToSerializedErrorComponent(
                e,
                component,
            );
            newComponents.push(convertResult.component);

            errors.push({
                message: convertResult.message,
                position: component.position,
            });
        }
    }

    return { errors, warnings, components: newComponents };
}
