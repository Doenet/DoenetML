import { createComponentInfoObjects } from "../../doenetml-worker-javascript/src/utils/componentInfoObjects";

// Create schema of DoenetML by extracting component, attributes and children
// from component classes.
// CodeMirror.jsx reads in the json file to form its autocompletion scheme.

type AttributeObject = {
    createPrimitiveOfType: string;
    createStateVariable: string;
    createComponentOfType: string;
    defaultValue: unknown;
    public: boolean;
    excludeFromSchema: boolean;
    validValues?: unknown[];
};

type ComponentClass = {
    componentType: string;
    renderChildren: boolean;
    canDisplayChildErrors: boolean;
    includeBlankStringChildren: boolean;
    returnChildGroups: () => {
        group: string;
        componentTypes: string[];
        excludeFromSchema?: boolean;
    }[];
    returnStateVariableDefinitions: () => Record<string, unknown>;
    excludeFromSchema: boolean;
    allowInSchemaAsComponent?: string[];
    createAttributesObject: () => Record<string, AttributeObject>;
    inSchemaOnlyInheritAs: string[];
    getAdapterComponentType: (...args: any[]) => string;
    numAdapters: number;
    additionalSchemaChildren?: string[];
    additionalSchemaChildrenDoNotInherit?: boolean;
};

interface ComponentInfoObjects extends ReturnType<
    typeof createComponentInfoObjects
> {
    allComponentClasses: Record<string, ComponentClass>;
}

type PropertyDescription = {
    name: string;
    type: string;
    isArray: boolean;
    numDimensions?: number;
    indexedArrayDescription?: ArrayElementDescription[];
};

type ArrayElementDescription = {
    type: string;
    isArray: boolean;
    numDimensions?: number;
};

type WrappingComponentElement =
    | string
    | { componentType: string; isAttributeNamed: string };

type ArrayEntryPrefixDescription = {
    arrayVariableName: string;
    numDimensions: number;
    wrappingComponents: WrappingComponentElement[][];
};

type StateVariableDescription = {
    public: boolean;
    createComponentOfType?: string;
    isArray: boolean;
    numDimensions?: number;
    wrappingComponents?: WrappingComponentElement[][];
    getArrayKeysFromVarName?: Function;
    arrayVarNameFromPropIndex?: Function;
};

type PublicStateVariableDescription = {
    public: boolean;
    createComponentOfType: string;
    isArray: boolean;
    numDimensions?: number;
    wrappingComponents?: WrappingComponentElement[][];
    getArrayKeysFromVarName?: Function;
    arrayVarNameFromPropIndex?: Function;
};

export function getSchema() {
    let componentInfoObjects =
        createComponentInfoObjects() as ComponentInfoObjects;
    let componentClasses = componentInfoObjects.allComponentClasses;

    // If a component class has static variable excludeFromSchema set,
    // then we ignore it completely.
    for (let type in componentClasses) {
        let cClass = componentClasses[type];
        if (cClass.excludeFromSchema) {
            delete componentClasses[type];
        }
    }

    let inheritedOrAdaptedTypes: Record<string, string | string[]> = {};

    for (let type1 in componentClasses) {
        let inherited: string[] = [];
        for (let type2 in componentClasses) {
            if (type2[0] == "_") {
                continue;
            }

            if (
                checkIfInheritOrAdapt({
                    startingType: type2,
                    destinationType: type1,
                    componentInfoObjects,
                })
            ) {
                inherited.push(type2);
                continue;
            }

            // If a composite component class has the static variable allowInSchemaAsComponent set
            // then we will, in addition, treat is as though it were any of those
            // component types when determining children for the schema

            let cClass = componentClasses[type2];
            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: type2,
                    baseComponentType: "_composite",
                }) &&
                cClass.allowInSchemaAsComponent
            ) {
                for (let alt_type of cClass.allowInSchemaAsComponent) {
                    if (
                        checkIfInheritOrAdapt({
                            startingType: alt_type,
                            destinationType: type1,
                            componentInfoObjects,
                        })
                    ) {
                        inherited.push(type2);
                        break;
                    }
                }
            }
        }
        inheritedOrAdaptedTypes[type1] = inherited;
    }

    // Remove abstract components from the schema
    // (Use shallow copy as we still need them in componentInfoObjects for other functionality.)
    componentClasses = { ...componentClasses };
    for (let type in componentClasses) {
        if (type[0] === "_") {
            delete componentClasses[type];
        }
    }

    let elements: Record<string, any>[] = [];

    for (let type in componentClasses) {
        let children: string[] = [];
        let acceptsStringChildren = false;

        let attributes = [];

        let cClass = componentClasses[type];

        let attrObj = cClass.createAttributesObject();

        for (let attrName in attrObj) {
            let attrDef = attrObj[attrName];

            // one can add a excludeFromSchema to an attribute definition
            // to keep it from showing up in the schema
            if (!attrDef.excludeFromSchema) {
                let attrSpec: { name: string; values?: unknown[] } = {
                    name: attrName,
                };

                if (attrDef.validValues) {
                    attrSpec.values = attrDef.validValues;
                } else if (
                    attrDef.createPrimitiveOfType === "boolean" ||
                    attrDef.createComponentOfType === "boolean"
                ) {
                    attrSpec.values = ["true", "false"];
                }

                attributes.push(attrSpec);
            }
        }

        let childGroups = cClass.returnChildGroups();

        for (let groupObj of childGroups) {
            // one can add a excludeFromSchema to a child group
            // to keep it from showing up in the schema
            if (!groupObj.excludeFromSchema) {
                for (let type2 of groupObj.componentTypes) {
                    if (type2 in inheritedOrAdaptedTypes) {
                        children.push(...inheritedOrAdaptedTypes[type2]);
                    }
                    if (
                        type2 === "string" ||
                        type2 === "_base" ||
                        type2 === "_inline"
                    ) {
                        acceptsStringChildren = true;
                    }
                }
            }
        }

        // The static variable additionalSchemaChildren on a component class
        // can be used to add children to the schema that wouldn't show up otherwise.
        // Two uses are:
        // 1. to include children that are accepted by sugar but are not in a child group
        //    because the sugar moves them to no longer be children
        // 2. to add composite children to the schema even though they should be expanded,
        //    (as adding a composite child to a child group will prevent it from being expanded)
        if (cClass.additionalSchemaChildren) {
            for (let type2 of cClass.additionalSchemaChildren) {
                if (type2 in inheritedOrAdaptedTypes) {
                    if (cClass.additionalSchemaChildrenDoNotInherit) {
                        children.push(type2);
                    } else {
                        children.push(...inheritedOrAdaptedTypes[type2]);
                    }
                }
                if (
                    type2 === "string" ||
                    type2 === "_base" ||
                    type2 === "_inline"
                ) {
                    acceptsStringChildren = true;
                }
            }
        }

        children = [...new Set(children)];

        let {
            stateVariableDescriptions,
            arrayEntryPrefixes,
            aliases,
        }: {
            stateVariableDescriptions: Record<
                string,
                PublicStateVariableDescription
            >;
            arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
            aliases: Record<string, string>;
        } = componentInfoObjects.publicStateVariableInfo[type];

        let properties: PropertyDescription[] = [];

        for (let varName in stateVariableDescriptions) {
            let description = stateVariableDescriptions[varName];

            properties.push(
                propFromDescription({
                    varName,
                    description,
                    arrayEntryPrefixes,
                }),
            );
        }

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        for (let aliasName in aliases) {
            let aliasTargetName = aliases[aliasName];
            let aliasTarget = stateVariableDescriptions[aliasTargetName];
            if (aliasTarget) {
                properties.push(
                    propFromDescription({
                        varName: aliasName,
                        description: aliasTarget,
                        arrayEntryPrefixes,
                    }),
                );
            } else {
                for (let prefix of arrayEntryPrefixesLongestToShortest) {
                    if (
                        aliasTargetName.substring(0, prefix.length) === prefix
                    ) {
                        let arrayEntry = arrayEntryPrefixes[prefix];
                        let arrayVariableName = arrayEntry.arrayVariableName;
                        let arrayStateVarDescription =
                            stateVariableDescriptions[arrayVariableName];

                        let arrayEntryDescription: PublicStateVariableDescription =
                            {
                                public: true,
                                createComponentOfType:
                                    arrayStateVarDescription.createComponentOfType,
                                isArray: arrayEntry.numDimensions > 0,
                                numDimensions: arrayEntry.numDimensions,
                                wrappingComponents:
                                    arrayEntry.wrappingComponents ||
                                    arrayStateVarDescription.wrappingComponents,
                                getArrayKeysFromVarName:
                                    arrayStateVarDescription.getArrayKeysFromVarName,
                                arrayVarNameFromPropIndex:
                                    arrayStateVarDescription.arrayVarNameFromPropIndex,
                            };

                        properties.push(
                            propFromDescription({
                                varName: aliasName,
                                description: arrayEntryDescription,
                                arrayEntryPrefixes,
                            }),
                        );

                        break;
                    }
                }
            }
        }

        elements.push({
            name: type,
            children,
            attributes,
            properties,
            top: !cClass.inSchemaOnlyInheritAs,
            acceptsStringChildren,
        });
    }

    // For now, we're just copying these schema from this console output
    return { elements };
}

function propFromDescription({
    varName,
    description,
    arrayEntryPrefixes,
}: {
    varName: string;
    description: PublicStateVariableDescription;
    arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
}) {
    let componentType = description.createComponentOfType;

    let prop: PropertyDescription = {
        name: varName,
        type: componentType,
        isArray: description.isArray,
    };

    if (description.isArray) {
        let numDimensions = description.numDimensions || 1;

        prop.numDimensions = numDimensions;
        prop.indexedArrayDescription = [];

        let wrappingComponents = description.wrappingComponents || [];

        let arrayEntryPrefixesLongestToShortest = Object.keys(
            arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        prop.indexedArrayDescription.push(
            createArrayElementDescription(
                wrappingComponents,
                numDimensions,
                componentType,
            ),
        );

        // if the array dimension is two or larger,
        // then we have array elements that are slices of the array
        // but are more than one element
        let propIndexStandin: number[] = [];
        for (let dim = 1; dim < numDimensions; dim++) {
            propIndexStandin.push(1);

            // TODO: fix technical debt so don't have to go through varName
            let varNameForIndexed = description.arrayVarNameFromPropIndex?.(
                propIndexStandin,
                varName,
            ) as string;

            let foundMatch = false;

            for (let prefix of arrayEntryPrefixesLongestToShortest) {
                if (varNameForIndexed.substring(0, prefix.length) === prefix) {
                    let prefixDescription = arrayEntryPrefixes[prefix];

                    let numDimensions = prefixDescription.numDimensions;
                    let wrappingComponents =
                        prefixDescription.wrappingComponents;

                    prop.indexedArrayDescription.push(
                        createArrayElementDescription(
                            wrappingComponents,
                            numDimensions,
                            componentType,
                        ),
                    );

                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                throw Error(
                    `Invalid array state variable ${varName} as arrayVarNameFromPropIndex didn't return an array entry`,
                );
            }
        }
    }
    return prop;
}

function createArrayElementDescription(
    wrappingComponents: WrappingComponentElement[][],
    numDimensions: number,
    componentType: string,
): ArrayElementDescription {
    if (wrappingComponents.length === numDimensions) {
        // the last dimension of the array is wrapped,
        // which means the final result isn't actually an array,
        // but a single component of the wrapped type
        let wrapping = wrappingComponents[wrappingComponents.length - 1][0];

        return {
            isArray: false,
            type:
                typeof wrapping === "string"
                    ? wrapping
                    : wrapping.componentType,
        };
    } else if (wrappingComponents.length > 0) {
        // although the last dimension isn't wrapped, some inner dimension is wrapped,
        // which means the final result is an array, but of a lower dimensions,
        // with type given by the last wrapping component
        let wrapping = wrappingComponents[wrappingComponents.length - 1][0];

        return {
            isArray: true,
            type:
                typeof wrapping === "string"
                    ? wrapping
                    : wrapping.componentType,
            numDimensions: numDimensions - wrappingComponents.length,
        };
    } else {
        // array is not wrapped
        return {
            isArray: true,
            type: componentType,
            numDimensions,
        };
    }
}

function checkIfInheritOrAdapt({
    startingType,
    destinationType,
    componentInfoObjects,
}: {
    startingType: string;
    destinationType: string;
    componentInfoObjects: ComponentInfoObjects;
}) {
    let startingClass = componentInfoObjects.allComponentClasses[startingType];

    // The static variable inSchemaOnlyInheritAs overrides the standard inheritance
    // rules for determining the children of the schema.
    // If inSchemaOnlyInheritAs is an empty array, then only the actual component type is used.
    // Any component types in inSchemaOnlyInheritAs are not checked to see if
    // startingType actually inherit from them, but the idea is that they should.
    // (Otherwise, the autocompletion will suggest invalid child types.)
    if (startingClass.inSchemaOnlyInheritAs) {
        if (
            startingType === destinationType ||
            startingClass.inSchemaOnlyInheritAs.includes(destinationType)
        ) {
            return true;
        }
    } else if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: startingType,
            baseComponentType: destinationType,
        })
    ) {
        return true;
    }

    let numAdapters = startingClass.numAdapters;

    for (let n = 0; n < numAdapters; n++) {
        let adapterComponentType = startingClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
        );

        let adapterClass =
            componentInfoObjects.allComponentClasses[adapterComponentType];

        if (adapterClass.inSchemaOnlyInheritAs) {
            if (
                adapterComponentType === destinationType ||
                adapterClass.inSchemaOnlyInheritAs.includes(destinationType)
            ) {
                return true;
            }
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: adapterComponentType,
                baseComponentType: destinationType,
            })
        ) {
            return true;
        }
    }
}
