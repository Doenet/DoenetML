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
    /**
     * If a component class has the static variable excludeFromSchema set,
     * then we ignore it completely in the schema.
     */
    excludeFromSchema: boolean;
    /**
     * If a composite component class has the static variable allowInSchemaAnywhere set to true,
     * then we will treat it as though it were any component type when determining schema relationships.
     */
    allowInSchemaAnywhere?: boolean;
    /**
     * If a composite component class has the static variable allowInSchemaAsComponent set
     * then we will treat it as though it were any of those
     * component types (as well as its actual component type)
     * when determining schema relationships
     */
    allowInSchemaAsComponent?: string[];
    createAttributesObject: () => Record<string, AttributeObject>;
    /**
     * If set, then for the purpose of generating the schema,
     * this component will act as though it could only be inherited from the specified component types.
     * If an empty array, then it will be treated as though it did not inherit from any other component type.
     * (It is assumed, but not checked, that the component actually does inherit from those types.)
     */
    inSchemaOnlyInheritAs?: string[];
    getAdapterComponentType: (...args: any[]) => string;
    numAdapters: number;
    /**
     * The static variable additionalSchemaChildren on a component class
     * can be used to add children to the schema that wouldn't show up otherwise.
     * Two uses are:
     * 1. to include children that are accepted by sugar but are not in a child group
     *    because the sugar moves them to no longer be children.
     * 2. to add composite children to the schema even though they should be expanded.
     *    (Typically composite children are not added to a child group,
     *    as that would prevent the composite from being expanded)
     */
    additionalSchemaChildren?: string[];
    /** If `true` and `additionalSchemaChildren` is set, then those children will not be inherited by subclasses */
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

type SchemaAttribute = { name: string; values?: unknown[] };

type SchemaElement = {
    /** The component type of this component */
    name: string;
    /** The types of children this component can have */
    children: string[];
    /** The attributes that can be specified on this component */
    attributes: SchemaAttribute[];
    /** The properties (public state variables) that this component has */
    properties: PropertyDescription[];
    /** Whether this component can be a top-level component */
    top: boolean;
    /** Whether this component accepts string children */
    acceptsStringChildren: boolean;
};

/**
 * Generates a comprehensive schema of all DoenetML components and their metadata.
 *
 * This function creates a schema that includes:
 * - All non-abstract, non-excluded component types
 * - Component attributes with their valid values
 * - Component children relationships (including inherited/adapted types)
 * - Public state variables (i.e., properties)
 * - Array entry prefixes and property aliases
 *
 * The schema generation process:
 * 1. Creates component info objects and filters out excluded components
 * 2. Builds a map of inherited and adapted component types
 * 3. Removes abstract components (prefixed with "_")
 * 4. For each component, collects:
 *    - Attributes from the component's attribute object
 *    - Valid child component types from child groups
 *    - String children acceptance flags
 *    - Additional schema children from component class metadata
 *    - Public state variable descriptions and aliases
 *
 * @returns {Object} An object containing an `elements` array of {@link SchemaElement} objects,
 *          where each element represents a component type with its full schema definition
 *          including name, children, attributes, properties, and string acceptance
 */
export function getSchema() {
    const componentInfoObjects =
        createComponentInfoObjects() as ComponentInfoObjects;
    let componentClasses = componentInfoObjects.allComponentClasses;

    // If a component class has the static variable excludeFromSchema set,
    // then we ignore it completely.
    for (const type in componentClasses) {
        const cClass = componentClasses[type];
        if (cClass.excludeFromSchema) {
            delete componentClasses[type];
        }
    }

    /**
     * A record of, for each component type, the list of all component types that
     * inherit from or adapt to that component type.
     */
    const inheritedOrAdaptedTypes: Record<string, string[]> = {};

    for (const type1 in componentClasses) {
        const inherited: string[] = [];
        for (const type2 in componentClasses) {
            // Skip abstract components
            if (type2[0] === "_") {
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
            // component types when determining schema relationships

            const cClass = componentClasses[type2];
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

            // If a composite component class has the static variable allowInSchemaAnywhere set to true,
            // then we will, in addition, treat is as though it were any component type when determining schema relationships

            if (
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: type2,
                    baseComponentType: "_composite",
                }) &&
                cClass.allowInSchemaAnywhere
            ) {
                inherited.push(type2);
            }
        }
        inheritedOrAdaptedTypes[type1] = inherited;
    }

    // Remove abstract components from the schema
    // (Use shallow copy as we still need them in componentInfoObjects for other functionality.)
    componentClasses = { ...componentClasses };
    for (const type in componentClasses) {
        if (type[0] === "_") {
            delete componentClasses[type];
        }
    }

    const elements: SchemaElement[] = [];

    for (const type in componentClasses) {
        let children: string[] = [];
        let acceptsStringChildren = false;

        const attributes: SchemaAttribute[] = [];

        const cClass = componentClasses[type];

        const attrObj = cClass.createAttributesObject();

        for (const attrName in attrObj) {
            const attrDef = attrObj[attrName];

            // one can add a excludeFromSchema to an attribute definition
            // to keep it from showing up in the schema
            if (!attrDef.excludeFromSchema) {
                const attrSpec: { name: string; values?: unknown[] } = {
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

        const childGroups = cClass.returnChildGroups();

        for (const groupObj of childGroups) {
            // one can add a excludeFromSchema to a child group
            // to keep it from showing up in the schema
            if (!groupObj.excludeFromSchema) {
                for (const type2 of groupObj.componentTypes) {
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
            for (const type2 of cClass.additionalSchemaChildren) {
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

        const {
            stateVariableDescriptions,
            arrayEntryPrefixes,
            aliases,
        }: {
            stateVariableDescriptions: Record<string, StateVariableDescription>;
            arrayEntryPrefixes: Record<string, ArrayEntryPrefixDescription>;
            aliases: Record<string, string>;
        } = componentInfoObjects.publicStateVariableInfo[type];

        const publicStateVariableDescriptions =
            stateVariableDescriptions as Record<
                string,
                PublicStateVariableDescription
            >;

        const properties: PropertyDescription[] = [];

        for (const varName in publicStateVariableDescriptions) {
            const description = publicStateVariableDescriptions[varName];

            properties.push(
                propFromDescription({
                    varName,
                    description,
                    arrayEntryPrefixes,
                }),
            );
        }

        const arrayEntryPrefixesLongestToShortest = Object.keys(
            arrayEntryPrefixes,
        ).sort((a, b) => b.length - a.length);

        for (const aliasName in aliases) {
            const aliasTargetName = aliases[aliasName];
            const aliasTarget =
                publicStateVariableDescriptions[aliasTargetName];
            if (aliasTarget) {
                properties.push(
                    propFromDescription({
                        varName: aliasName,
                        description: aliasTarget,
                        arrayEntryPrefixes,
                    }),
                );
            } else {
                for (const prefix of arrayEntryPrefixesLongestToShortest) {
                    if (
                        aliasTargetName.substring(0, prefix.length) === prefix
                    ) {
                        const arrayEntry = arrayEntryPrefixes[prefix];
                        const arrayVariableName = arrayEntry.arrayVariableName;
                        const arrayStateVarDescription =
                            publicStateVariableDescriptions[arrayVariableName];

                        const arrayEntryDescription: PublicStateVariableDescription =
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
    const componentType = description.createComponentOfType;

    const prop: PropertyDescription = {
        name: varName,
        type: componentType,
        isArray: description.isArray,
    };

    if (description.isArray) {
        const numDimensions = description.numDimensions || 1;

        prop.numDimensions = numDimensions;
        prop.indexedArrayDescription = [];

        const wrappingComponents = description.wrappingComponents || [];

        const arrayEntryPrefixesLongestToShortest = Object.keys(
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
            const varNameForIndexed = description.arrayVarNameFromPropIndex?.(
                propIndexStandin,
                varName,
            ) as string;

            let foundMatch = false;

            for (let prefix of arrayEntryPrefixesLongestToShortest) {
                if (varNameForIndexed.substring(0, prefix.length) === prefix) {
                    const prefixDescription = arrayEntryPrefixes[prefix];

                    const numDimensions = prefixDescription.numDimensions;
                    const wrappingComponents =
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
        const wrapping = wrappingComponents[wrappingComponents.length - 1][0];

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
        const wrapping = wrappingComponents[wrappingComponents.length - 1][0];

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

/**
 * Determine if `startingType` either inherits from or adapts to `destinationType`.
 *
 * For the purposes of building the schema, inheritance can be overridden by the static variable `inSchemaOnlyInheritAs`
 * on the component class object. (See `checkIfInherit` for details.)
 *
 * Return true if `startingType` inherits from `destinationType` or adapts into a component type that inherits from `destinationType`.
 * Otherwise return false.
 */
function checkIfInheritOrAdapt({
    startingType,
    destinationType,
    componentInfoObjects,
}: {
    startingType: string;
    destinationType: string;
    componentInfoObjects: ComponentInfoObjects;
}) {
    if (
        checkIfInherit({
            startingType,
            destinationType,
            componentInfoObjects,
        })
    ) {
        return true;
    }

    const startingClass =
        componentInfoObjects.allComponentClasses[startingType];
    const numAdapters = startingClass.numAdapters;

    for (let n = 0; n < numAdapters; n++) {
        const adapterComponentType = startingClass.getAdapterComponentType(
            n,
            componentInfoObjects.publicStateVariableInfo,
        );

        if (
            checkIfInherit({
                startingType: adapterComponentType,
                destinationType,
                componentInfoObjects,
            })
        ) {
            return true;
        }
    }

    return false;
}

/**
 * Determine if `startingType` inherits from `destinationType`.
 *
 * For the purposes of building the schema, inheritance can be overridden by the static variable `inSchemaOnlyInheritAs`
 * on the component class object.
 *
 * The rules for determining if component type `startingType` inherits from component type `destinationType`
 * depend on whether the component class of  `startingType` has `inSchemaOnlyInheritAs` set:
 * - if `inSchemaOnlyInheritAs` is not set, `startingType` must inherit from `destinationType` (or be equal to `destinationType`),
 * - if `inSchemaOnlyInheritAs` is set, `destinationType` must be in that list or be equal to `startingType`.
 *
 * Return true if `startingType` inherits from `destinationType`.
 * Otherwise return false.
 */
function checkIfInherit({
    startingType,
    destinationType,
    componentInfoObjects,
}: {
    startingType: string;
    destinationType: string;
    componentInfoObjects: ComponentInfoObjects;
}) {
    const startingClass =
        componentInfoObjects.allComponentClasses[startingType];

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

    return false;
}
