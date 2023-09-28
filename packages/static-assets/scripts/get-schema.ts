import createComponentInfoObjects from "../../doenetml/src/Core/utils/componentInfoObjects";

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
    acceptTarget: boolean;
    createAttributesObject: () => Record<string, AttributeObject>;
    inSchemaOnlyInheritAs: string[];
    getAdapterComponentType: (...args: any[]) => string;
    numAdapters: number;
    additionalSchemaChildren?: string[];
    assignNamesToReplacements: boolean;
};

interface ComponentInfoObjects
    extends ReturnType<typeof createComponentInfoObjects> {
    allComponentClasses: Record<string, ComponentClass>;
}

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

        // All components have the name and copySource attributes,
        // even though they aren't in the attributes object
        let attributes = [{ name: "name" }, { name: "copySource" }];

        let cClass = componentClasses[type];

        // Until we clean up the target/source mess,
        // we have to make a special case for this attribute
        if (cClass.acceptTarget) {
            if (type === "copy" || type === "collect") {
                attributes.push({ name: "source" });
            } else {
                attributes.push({ name: "target" });
            }
        }

        // a composite with assignNamesToReplacements has the assignNames attribute
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: type,
                baseComponentType: "_composite",
            }) &&
            cClass.assignNamesToReplacements
        ) {
            attributes.push({ name: "assignNames" });
        }

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
        // 1. to include children that are accepted by sugar but are in a child group
        //    because the sugar moves them to no longer be children
        // 2. to add composite children to the schema even though they should be expanded,
        //    (as adding a composite child to a child group will prevent it from being expanded)
        if (cClass.additionalSchemaChildren) {
            for (let type2 of cClass.additionalSchemaChildren) {
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

        children = [...new Set(children)];

        elements.push({
            name: type,
            children,
            attributes,
            top: !cClass.inSchemaOnlyInheritAs,
            acceptsStringChildren,
        });
    }

    // For now, we're just copying these schema from this console output
    return { elements };
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
