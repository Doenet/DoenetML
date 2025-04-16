import CompositeComponent from "./abstract/CompositeComponent";
import me from "math-expressions";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { convertValueToMathExpression } from "@doenet/utils";
import { returnRoundingAttributes } from "../utils/rounding";
import {
    convertAttributesForComponentType,
    postProcessCopy,
} from "../utils/copy";
import { processAssignNames } from "../utils/naming";

export default class NumberList extends CompositeComponent {
    static componentType = "numberList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static assignNamesToReplacements = true;

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a numberList,
    // use the numbers state variable to populate that attribute
    static stateVariableToBeShadowed = "numbers";
    static primaryStateVariableForDefinition = "numbersShadow";

    // even if inside a component that turned on descendantCompositesMustHaveAReplacement
    // don't required composite replacements
    static descendantCompositesMustHaveAReplacement = false;

    static doNotExpandAsShadowed = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unordered",
            defaultValue: false,
            public: true,
        };

        attributes.maxNumber = {
            createComponentOfType: "number",
            createStateVariable: "maxNumber",
            defaultValue: Infinity,
            public: true,
        };

        attributes.fixed = {
            leaveRaw: true,
        };

        attributes.isResponse = {
            leaveRaw: true,
        };

        for (let attrName in returnRoundingAttributes()) {
            attributes[attrName] = {
                leaveRaw: true,
            };
        }

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let groupIntoNumbersSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "number",
            });

        sugarInstructions.push({
            replacementFunction: function ({ matchedChildren }) {
                return groupIntoNumbersSeparatedBySpaces({ matchedChildren });
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "numbers",
                componentTypes: ["number"],
            },
            {
                group: "maths",
                componentTypes: ["math"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.numbersShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    numbersShadow: true,
                },
            }),
        };

        stateVariableDefinitions.asList = {
            returnDependencies: () => ({}),
            definition() {
                return { setValue: { asList: true } };
            },
        };

        stateVariableDefinitions.mergeMathLists = {
            returnDependencies: () => ({
                mergeMathListsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "mergeMathLists",
                    variableNames: ["value"],
                },
                mathChildren: {
                    dependencyType: "child",
                    childGroups: ["maths"],
                    skipComponentIndices: true,
                },
                numberChildren: {
                    dependencyType: "child",
                    childGroups: ["numbers"],
                    skipComponentIndices: true,
                },
            }),
            definition({ dependencyValues }) {
                let mergeMathLists =
                    dependencyValues.mathChildren.length === 1 &&
                    dependencyValues.numberChildren.length === 0;
                return { setValue: { mergeMathLists } };
            },
        };

        stateVariableDefinitions.numComponents = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            stateVariablesDeterminingDependencies: ["mergeMathLists"],
            additionalStateVariablesDefined: ["childInfoByComponent"],
            returnDependencies({ stateValues }) {
                let dependencies = {
                    maxNumber: {
                        dependencyType: "stateVariable",
                        variableName: "maxNumber",
                    },
                    mergeMathLists: {
                        dependencyType: "stateVariable",
                        variableName: "mergeMathLists",
                    },
                    numbersShadow: {
                        dependencyType: "stateVariable",
                        variableName: "numbersShadow",
                    },
                };

                if (stateValues.mergeMathLists) {
                    dependencies.numberMathChildren = {
                        dependencyType: "child",
                        childGroups: ["numbers", "maths"],
                        variableNames: ["value"],
                    };
                } else {
                    dependencies.numberMathChildren = {
                        dependencyType: "child",
                        childGroups: ["numbers", "maths"],
                    };
                }

                return dependencies;
            },
            definition: function ({ dependencyValues }) {
                let numComponents = 0;
                let childInfoByComponent = [];

                if (dependencyValues.numberMathChildren.length > 0) {
                    if (dependencyValues.mergeMathLists) {
                        for (let [
                            childInd,
                            child,
                        ] of dependencyValues.numberMathChildren.entries()) {
                            let childValue = child.stateValues.value;

                            if (
                                Array.isArray(childValue.tree) &&
                                childValue.tree[0] === "list"
                            ) {
                                let nComponents = childValue.tree.length - 1;
                                for (let i = 0; i < nComponents; i++) {
                                    childInfoByComponent[i + numComponents] = {
                                        childInd,
                                        component: i,
                                        nComponents,
                                        childIdx: child.componentIdx,
                                    };
                                }
                                numComponents += nComponents;
                            } else {
                                childInfoByComponent[numComponents] = {
                                    childInd,
                                    childIdx: child.componentIdx,
                                };
                                numComponents += 1;
                            }
                        }
                    } else {
                        numComponents =
                            dependencyValues.numberMathChildren.length;
                        childInfoByComponent =
                            dependencyValues.numberMathChildren.map(
                                (child, i) => ({
                                    childInd: i,
                                    childIdx: child.componentIdx,
                                }),
                            );
                    }
                } else if (dependencyValues.numbersShadow !== null) {
                    numComponents = dependencyValues.numbersShadow.length;
                }

                let maxNum = dependencyValues.maxNumber;
                if (numComponents > maxNum) {
                    numComponents = maxNum;
                    childInfoByComponent = childInfoByComponent.slice(
                        0,
                        maxNum,
                    );
                }

                return {
                    setValue: { numComponents, childInfoByComponent },
                    checkForActualChange: { numComponents: true },
                };
            },
        };

        stateVariableDefinitions.numbers = {
            isArray: true,
            entryPrefixes: ["number"],
            stateVariablesDeterminingDependencies: [
                "mergeMathLists",
                "childInfoByComponent",
            ],
            returnArraySizeDependencies: () => ({
                numComponents: {
                    dependencyType: "stateVariable",
                    variableName: "numComponents",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numComponents];
            },

            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                let globalDependencies = {
                    mergeMathLists: {
                        dependencyType: "stateVariable",
                        variableName: "mergeMathLists",
                    },
                    childInfoByComponent: {
                        dependencyType: "stateVariable",
                        variableName: "childInfoByComponent",
                    },
                    numbersShadow: {
                        dependencyType: "stateVariable",
                        variableName: "numbersShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let childIndices = [];
                    if (stateValues.childInfoByComponent[arrayKey]) {
                        childIndices = [
                            stateValues.childInfoByComponent[arrayKey].childInd,
                        ];
                    }
                    dependenciesByKey[arrayKey] = {
                        numberMathChildren: {
                            dependencyType: "child",
                            childGroups: ["numbers", "maths"],
                            variableNames: ["value"],
                            childIndices,
                        },
                    };
                }
                return { globalDependencies, dependenciesByKey };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                let numbers = {};

                for (let arrayKey of arrayKeys) {
                    let child =
                        dependencyValuesByKey[arrayKey].numberMathChildren[0];

                    if (child) {
                        let childValue = child.stateValues.value;
                        if (
                            globalDependencyValues.mergeMathLists &&
                            Array.isArray(childValue.tree) &&
                            childValue.tree[0] === "list"
                        ) {
                            let ind2 =
                                globalDependencyValues.childInfoByComponent[
                                    arrayKey
                                ].component;
                            numbers[arrayKey] = childValue
                                .get_component(ind2)
                                .evaluate_to_constant();
                        } else if (
                            childValue.evaluate_to_constant !== undefined
                        ) {
                            numbers[arrayKey] =
                                childValue.evaluate_to_constant();
                        } else {
                            numbers[arrayKey] = childValue;
                        }
                    } else if (globalDependencyValues.numbersShadow !== null) {
                        numbers[arrayKey] =
                            globalDependencyValues.numbersShadow[arrayKey];
                    }
                }

                return { setValue: { numbers } };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyValuesByKey,
                globalDependencyValues,
                dependencyNamesByKey,
                componentInfoObjects,
                stateValues,
                workspace,
            }) {
                if (globalDependencyValues.mergeMathLists) {
                    let instructions = [];

                    let childInfoByComponent =
                        await stateValues.childInfoByComponent;

                    let arrayKeysAddressed = [];

                    for (let arrayKey in desiredStateVariableValues.numbers) {
                        if (!dependencyValuesByKey[arrayKey]) {
                            continue;
                        }

                        if (arrayKeysAddressed.includes(arrayKey)) {
                            continue;
                        }

                        let child =
                            dependencyValuesByKey[arrayKey]
                                .numberMathChildren[0];

                        let desiredValue;
                        if (
                            childInfoByComponent[arrayKey].nComponents !==
                            undefined
                        ) {
                            // found a math that has been split due to merging

                            // array keys that are associated with this math child
                            let firstInd =
                                Number(arrayKey) -
                                childInfoByComponent[arrayKey].component;
                            let lastInd =
                                firstInd +
                                childInfoByComponent[arrayKey].nComponents -
                                1;

                            // in case just one ind specified, merge with previous values
                            if (!workspace.desiredMaths) {
                                workspace.desiredMaths = [];
                            }

                            let desiredTree = ["list"];

                            for (let i = firstInd; i <= lastInd; i++) {
                                if (
                                    desiredStateVariableValues.numbers[i] !==
                                    undefined
                                ) {
                                    workspace.desiredMaths[i] =
                                        convertValueToMathExpression(
                                            desiredStateVariableValues.numbers[
                                                i
                                            ],
                                        );
                                } else if (
                                    workspace.desiredMaths[i] === undefined
                                ) {
                                    workspace.desiredMaths[i] = me.fromAst(
                                        (await stateValues.numbers)[i],
                                    );
                                }

                                desiredTree.push(
                                    workspace.desiredMaths[i].tree,
                                );
                                arrayKeysAddressed.push(i.toString());
                            }

                            desiredValue = me.fromAst(desiredTree);
                        } else {
                            desiredValue =
                                desiredStateVariableValues.numbers[arrayKey];
                            if (
                                componentInfoObjects.isInheritedComponentType({
                                    inheritedComponentType:
                                        child?.componentType,
                                    baseComponentType: "math",
                                })
                            ) {
                                desiredValue =
                                    convertValueToMathExpression(desiredValue);
                            }
                        }

                        if (child) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey]
                                        .numberMathChildren,
                                desiredValue,
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        } else if (
                            globalDependencyValues.numbersShadow !== null
                        ) {
                            if (!workspace.desiredNumberShadow) {
                                workspace.desiredNumberShadow = [
                                    ...globalDependencyValues.numbersShadow,
                                ];
                            }
                            workspace.desiredNumberShadow[arrayKey] =
                                desiredValue;
                        }
                    }

                    if (workspace.desiredNumberShadow) {
                        instructions.push({
                            setDependency: "numbersShadow",
                            desiredValue: workspace.desiredNumberShadow,
                        });
                    }

                    return {
                        success: true,
                        instructions,
                    };
                }

                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.numbers) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let child =
                        dependencyValuesByKey[arrayKey].numberMathChildren[0];

                    if (child) {
                        let desiredValue =
                            desiredStateVariableValues.numbers[arrayKey];
                        if (
                            componentInfoObjects.isInheritedComponentType({
                                inheritedComponentType: child.componentType,
                                baseComponentType: "math",
                            })
                        ) {
                            desiredValue =
                                convertValueToMathExpression(desiredValue);
                        }
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey]
                                    .numberMathChildren,
                            desiredValue,
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.numbersShadow !== null) {
                        if (!workspace.desiredNumberShadow) {
                            workspace.desiredNumberShadow = [
                                ...globalDependencyValues.numbersShadow,
                            ];
                        }
                        workspace.desiredNumberShadow[arrayKey] =
                            desiredStateVariableValues.numbers[arrayKey];
                    }
                }

                if (workspace.desiredNumberShadow) {
                    instructions.push({
                        setDependency: "numbersShadow",
                        desiredValue: workspace.desiredNumberShadow,
                    });
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.numValues = {
            isAlias: true,
            targetVariableName: "numComponents",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "numbers",
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                childInfoByComponent: {
                    dependencyType: "stateVariable",
                    variableName: "childInfoByComponent",
                },
            }),
            // When this state variable is marked stale
            // it indicates we should update replacements.
            // For this to work, must set
            // stateVariableToEvaluateAfterReplacements
            // to this variable so that it is marked fresh
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
    }) {
        let errors = [];
        let warnings = [];

        let replacements = [];
        let componentsCopied = [];

        let attributesToConvert = {};
        for (let attr of [
            "fixed",
            "isResponse",
            ...Object.keys(returnRoundingAttributes()),
        ]) {
            if (attr in component.attributes) {
                attributesToConvert[attr] = component.attributes[attr];
            }
        }

        let newNamespace = component.attributes.newNamespace?.primitive;

        // allow one to override the fixed and isResponse attributes
        // as well as rounding settings
        // by specifying it on the sequence
        let attributesFromComposite = {};

        if (Object.keys(attributesToConvert).length > 0) {
            attributesFromComposite = convertAttributesForComponentType({
                attributes: attributesToConvert,
                componentType: "number",
                componentInfoObjects,
                compositeCreatesNewNamespace: newNamespace,
            });
        }

        let childInfoByComponent =
            await component.stateValues.childInfoByComponent;

        let numComponents = await component.stateValues.numComponents;
        for (let i = 0; i < numComponents; i++) {
            let childInfo = childInfoByComponent[i];
            if (childInfo) {
                let replacementSource = components[childInfo.childIdx];

                if (childInfo.nComponents !== undefined) {
                    componentsCopied.push(
                        replacementSource.componentIdx +
                            ":" +
                            childInfo.component,
                    );
                } else {
                    componentsCopied.push(replacementSource.componentIdx);
                }
            }
            replacements.push({
                componentType: "number",
                attributes: JSON.parse(JSON.stringify(attributesFromComposite)),
                downstreamDependencies: {
                    [component.componentIdx]: [
                        {
                            dependencyType: "referenceShadow",
                            compositeIdx: component.componentIdx,
                            propVariable: `number${i + 1}`,
                        },
                    ],
                },
            });
        }

        workspace.uniqueIdentifiersUsed = [];
        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            uniqueIdentifiersUsed: workspace.uniqueIdentifiersUsed,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        let processResult = processAssignNames({
            assignNames: component.doenetAttributes.assignNames,
            serializedComponents: replacements,
            parentIdx: component.componentIdx,
            parentCreatesNewNamespace: newNamespace,
            componentInfoObjects,
        });
        errors.push(...processResult.errors);
        warnings.push(...processResult.warnings);

        workspace.componentsCopied = componentsCopied;
        workspace.numComponents = numComponents;

        return {
            replacements: processResult.serializedComponents,
            errors,
            warnings,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        componentInfoObjects,
        workspace,
    }) {
        // TODO: don't yet have a way to return errors and warnings!
        let errors = [];
        let warnings = [];

        let numComponents = await component.stateValues.numComponents;

        if (numComponents === workspace.numComponents) {
            let componentsToCopy = [];

            let childInfoByComponent =
                await component.stateValues.childInfoByComponent;

            for (let childInfo of childInfoByComponent) {
                let replacementSource = components[childInfo.childIdx];

                if (childInfo.nComponents !== undefined) {
                    componentsToCopy.push(
                        replacementSource.componentIdx +
                            ":" +
                            childInfo.component,
                    );
                } else {
                    componentsToCopy.push(replacementSource.componentIdx);
                }
            }

            if (
                componentsToCopy.length == workspace.componentsCopied.length &&
                workspace.componentsCopied.every(
                    (x, i) => x === componentsToCopy[i],
                )
            ) {
                return [];
            }
        }

        // for now, just recreate
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
        });

        let replacements = replacementResults.replacements;
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return replacementChanges;
    }
}
