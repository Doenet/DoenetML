import CompositeComponent from "./abstract/CompositeComponent";
import me from "math-expressions";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import { convertValueToMathExpression } from "@doenet/utils";
import {
    addShadowRoundingAttributes,
    gatherRawRoundingFixedResponseAttributes,
    returnRoundingAttributes,
} from "../utils/rounding";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
import { returnUnorderedListStateVariableDefinitions } from "../utils/unorderedLists";

export default class MathList extends CompositeComponent {
    static componentType = "mathList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a mathList,
    // use the maths state variable to populate that attribute
    static stateVariableToBeShadowed = "maths";
    static primaryStateVariableForDefinition = "mathsShadow";

    // even if inside a component that turned on descendantCompositesMustHaveAReplacement
    // don't required composite replacements
    static descendantCompositesMustHaveAReplacement = false;

    static doNotExpandAsShadowed = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.unordered = {
            createComponentOfType: "boolean",
            createStateVariable: "unorderedPrelim",
            defaultValue: false,
        };
        attributes.maxNumber = {
            createComponentOfType: "number",
            createStateVariable: "maxNumber",
            defaultValue: Infinity,
            public: true,
        };
        attributes.mergeMathLists = {
            createComponentOfType: "boolean",
        };

        attributes.fixed = {
            leaveRaw: true,
        };

        attributes.isResponse = {
            leaveRaw: true,
        };
        attributes.isPotentialResponse = {
            leaveRaw: true,
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
        };

        for (let attrName in returnRoundingAttributes()) {
            attributes[attrName] = {
                leaveRaw: true,
            };
        }

        attributes.functionSymbols = {
            createComponentOfType: "textList",
            createStateVariable: "functionSymbols",
            defaultValue: ["f", "g"],
            public: true,
            fallBackToParentStateVariable: "functionSymbols",
            fallBackToSourceCompositeStateVariable: "functionSymbols",
        };

        attributes.referencesAreFunctionSymbols = {
            createReferences: true,
            createStateVariable: "referencesAreFunctionSymbols",
            defaultValue: [],
            fallBackToParentStateVariable: "referencesAreFunctionSymbols",
            fallBackToSourceCompositeStateVariable:
                "referencesAreFunctionSymbols",
        };

        attributes.splitSymbols = {
            createComponentOfType: "boolean",
            createStateVariable: "splitSymbols",
            defaultValue: true,
            public: true,
            fallBackToParentStateVariable: "splitSymbols",
            fallBackToSourceCompositeStateVariable: "splitSymbols",
        };

        attributes.parseScientificNotation = {
            createComponentOfType: "boolean",
            createStateVariable: "parseScientificNotation",
            defaultValue: false,
            public: true,
            fallBackToParentStateVariable: "parseScientificNotation",
        };

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let groupIntoMathsSeparatedBySpaces =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "math",
            });

        sugarInstructions.push({
            replacementFunction: function ({
                matchedChildren,
                nComponents,
                stateIdInfo,
            }) {
                return groupIntoMathsSeparatedBySpaces({
                    matchedChildren,
                    nComponents,
                    stateIdInfo,
                });
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "maths",
                componentTypes: ["math"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnUnorderedListStateVariableDefinitions(),
        );

        stateVariableDefinitions.mathsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    mathsShadow: true,
                },
            }),
        };

        stateVariableDefinitions.mergeMathLists = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
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
            }),
            definition({ dependencyValues }) {
                let mergeMathLists =
                    dependencyValues.mergeMathListsAttr?.stateValues.value ||
                    dependencyValues.mathChildren.length === 1;
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
                    mathsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "mathsShadow",
                    },
                };

                if (stateValues.mergeMathLists) {
                    dependencies.mathChildren = {
                        dependencyType: "child",
                        childGroups: ["maths"],
                        variableNames: ["value"],
                    };
                } else {
                    dependencies.mathChildren = {
                        dependencyType: "child",
                        childGroups: ["maths"],
                    };
                }

                return dependencies;
            },
            definition: function ({ dependencyValues }) {
                let numComponents = 0;
                let childInfoByComponent = [];

                if (dependencyValues.mathChildren.length > 0) {
                    if (dependencyValues.mergeMathLists) {
                        for (let [
                            childInd,
                            child,
                        ] of dependencyValues.mathChildren.entries()) {
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
                        numComponents = dependencyValues.mathChildren.length;
                        childInfoByComponent =
                            dependencyValues.mathChildren.map((child, i) => ({
                                childInd: i,
                                childIdx: child.componentIdx,
                            }));
                    }
                } else if (dependencyValues.mathsShadow !== null) {
                    numComponents = dependencyValues.mathsShadow.length;
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

        stateVariableDefinitions.maths = {
            isArray: true,
            entryPrefixes: ["math"],
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
                    mathsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "mathsShadow",
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
                        mathChildren: {
                            dependencyType: "child",
                            childGroups: ["maths"],
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
                let maths = {};

                for (let arrayKey of arrayKeys) {
                    let child = dependencyValuesByKey[arrayKey].mathChildren[0];

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
                            maths[arrayKey] = childValue.get_component(ind2);
                        } else {
                            maths[arrayKey] = childValue;
                        }
                    } else if (globalDependencyValues.mathsShadow !== null) {
                        maths[arrayKey] =
                            globalDependencyValues.mathsShadow[arrayKey];
                    }
                }

                return { setValue: { maths } };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                stateValues,
                workspace,
            }) {
                if (globalDependencyValues.mergeMathLists) {
                    let instructions = [];

                    let childInfoByComponent =
                        await stateValues.childInfoByComponent;

                    let arrayKeysAddressed = [];

                    for (let arrayKey in desiredStateVariableValues.maths) {
                        if (!dependencyValuesByKey[arrayKey]) {
                            continue;
                        }

                        if (arrayKeysAddressed.includes(arrayKey)) {
                            continue;
                        }

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
                                    desiredStateVariableValues.maths[i] !==
                                    undefined
                                ) {
                                    workspace.desiredMaths[i] =
                                        convertValueToMathExpression(
                                            desiredStateVariableValues.maths[i],
                                        );
                                } else if (
                                    workspace.desiredMaths[i] === undefined
                                ) {
                                    workspace.desiredMaths[i] = (
                                        await stateValues.maths
                                    )[i];
                                }

                                desiredTree.push(
                                    workspace.desiredMaths[i].tree,
                                );
                                arrayKeysAddressed.push(i.toString());
                            }

                            desiredValue = me.fromAst(desiredTree);
                        } else {
                            desiredValue =
                                desiredStateVariableValues.maths[arrayKey];
                        }

                        let child =
                            dependencyValuesByKey[arrayKey].mathChildren[0];

                        if (child) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].mathChildren,
                                desiredValue,
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        } else if (
                            globalDependencyValues.mathsShadow !== null
                        ) {
                            if (!workspace.desiredMathShadow) {
                                workspace.desiredMathShadow = [
                                    ...globalDependencyValues.mathsShadow,
                                ];
                            }
                            workspace.desiredMathShadow[arrayKey] =
                                desiredValue;
                        }
                    }

                    if (workspace.desiredMathShadow) {
                        instructions.push({
                            setDependency: "mathsShadow",
                            desiredValue: workspace.desiredMathShadow,
                        });
                    }

                    return {
                        success: true,
                        instructions,
                    };
                }

                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.maths) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let child = dependencyValuesByKey[arrayKey].mathChildren[0];

                    if (child) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].mathChildren,
                            desiredValue:
                                desiredStateVariableValues.maths[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.mathsShadow !== null) {
                        if (!workspace.desiredMathShadow) {
                            workspace.desiredMathShadow = [
                                ...globalDependencyValues.mathsShadow,
                            ];
                        }
                        workspace.desiredMathShadow[arrayKey] =
                            desiredStateVariableValues.maths[arrayKey];
                    }
                }

                if (workspace.desiredMathShadow) {
                    instructions.push({
                        setDependency: "mathsShadow",
                        desiredValue: workspace.desiredMathShadow,
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
            targetVariableName: "maths",
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
        nComponents,
    }) {
        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        let errors = [];
        let warnings = [];

        let replacements = [];
        let componentsCopied = [];

        // For attributes that were left raw, we convert them and add them to the replacements
        let attributesToConvert = gatherRawRoundingFixedResponseAttributes(
            component,
            components,
        );

        const copyChild =
            component.definingChildren.length === 1 &&
            component.definingChildren[0].componentType === "_copy"
                ? component.definingChildren[0]
                : null;
        let copyChildSource;
        if (copyChild) {
            const cIdx = await copyChild?.stateValues.extendIdx;
            copyChildSource = {
                componentIdx: cIdx,
                componentType: components[cIdx].componentType,
            };
        }

        let childInfoByComponent =
            await component.stateValues.childInfoByComponent;

        let numComponents = await component.stateValues.numComponents;
        for (let i = 0; i < numComponents; i++) {
            // allow one to override the fixed, isResponse, and isPotentialResponse attributes
            // as well as rounding settings
            // by specifying it on the mathList
            let attributes = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "math",
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });

                attributes = JSON.parse(JSON.stringify(res.attributes));
                nComponents = res.nComponents;
            }

            if (copyChildSource) {
                nComponents = addShadowRoundingAttributes({
                    nComponents,
                    stateIdInfo,
                    source: copyChildSource,
                    compositeIdx: copyChild.componentIdx,
                    attributes,
                    componentInfoObjects,
                });
            }

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
                type: "serialized",
                componentType: "math",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes,
                doenetAttributes: {},
                children: [],
                downstreamDependencies: {
                    [component.componentIdx]: [
                        {
                            dependencyType: "referenceShadow",
                            compositeIdx: component.componentIdx,
                            propVariable: `math${i + 1}`,
                        },
                    ],
                },
            });
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;
        workspace.numComponents = numComponents;

        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacements,
            errors,
            warnings,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
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
                return { replacementChanges: [] };
            }
        }

        // for now, just recreate
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
            nComponents,
        });

        let replacements = replacementResults.replacements;
        errors.push(...replacementResults.errors);
        warnings.push(...replacementResults.warnings);
        nComponents = replacementResults.nComponents;

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return { replacementChanges, nComponents };
    }
}
