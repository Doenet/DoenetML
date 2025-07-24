import CompositeComponent from "./abstract/CompositeComponent";
import {
    addShadowRoundingAttributes,
    gatherRawRoundingFixedResponseAttributes,
    returnRoundingAttributes,
} from "../utils/rounding";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";

export default class IntervalList extends CompositeComponent {
    static componentType = "intervalList";
    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a intervalList,
    // use the intervals state variable to populate that attribute
    static stateVariableToBeShadowed = "intervals";
    static primaryStateVariableForDefinition = "intervalsShadow";

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

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["math", "string"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let createIntervalList = function ({ matchedChildren, nComponents }) {
            let results = breakEmbeddedStringsIntoIntervalPieces({
                componentList: matchedChildren,
            });

            if (results.success !== true) {
                return { success: false };
            }

            return {
                success: true,
                newChildren: results.pieces.map(function (piece) {
                    if (piece.length > 1 || typeof piece[0] === "string") {
                        return {
                            type: "serialized",
                            componentType: "interval",
                            componentIdx: nComponents++,
                            attributes: {},
                            doenetAttributes: {},
                            state: {},
                            children: piece,
                        };
                    } else {
                        return piece[0];
                    }
                }),
                nComponents,
            };
        };

        sugarInstructions.push({
            replacementFunction: createIntervalList,
        });

        return sugarInstructions;
    }
    static returnChildGroups() {
        return [
            {
                group: "intervals",
                componentTypes: ["interval"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.intervalsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    intervalsShadow: true,
                },
            }),
        };

        stateVariableDefinitions.numIntervals = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                intervalChildren: {
                    dependencyType: "child",
                    childGroups: ["intervals"],
                    skipComponentIndices: true,
                },
                intervalsShadow: {
                    dependencyType: "stateVariable",
                    variableName: "intervalsShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numIntervals = 0;

                if (dependencyValues.intervalChildren.length > 0) {
                    numIntervals = dependencyValues.intervalChildren.length;
                } else if (dependencyValues.intervalsShadow !== null) {
                    numIntervals = dependencyValues.intervalsShadow.length;
                }

                let maxNum = dependencyValues.maxNumber;
                if (numIntervals > maxNum) {
                    numIntervals = maxNum;
                }

                return {
                    setValue: { numIntervals },
                    checkForActualChange: { numIntervals: true },
                };
            },
        };

        stateVariableDefinitions.childIndicesByInterval = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numIntervals: {
                    dependencyType: "stateVariable",
                    variableName: "numIntervals",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numIntervals];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        intervalChild: {
                            dependencyType: "child",
                            childGroups: ["intervals"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let childIndicesByInterval = {};

                for (let arrayKey of arrayKeys) {
                    let intervalChild =
                        dependencyValuesByKey[arrayKey].intervalChild[0];

                    if (intervalChild) {
                        childIndicesByInterval[arrayKey] =
                            intervalChild.componentIdx;
                    }
                }

                return { setValue: { childIndicesByInterval } };
            },
        };

        stateVariableDefinitions.intervals = {
            isArray: true,
            numDimensions: 1,
            entryPrefixes: ["interval"],
            stateVariablesDeterminingDependencies: ["childIndicesByInterval"],
            returnArraySizeDependencies: () => ({
                numIntervals: {
                    dependencyType: "stateVariable",
                    variableName: "numIntervals",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numIntervals];
            },
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                let globalDependencies = {
                    childIndicesByInterval: {
                        dependencyType: "stateVariable",
                        variableName: "childIndicesByInterval",
                    },
                    intervalsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "intervalsShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let childIndices = [];
                    if (stateValues.childIndicesByInterval[arrayKey]) {
                        childIndices = [arrayKey];
                    }
                    dependenciesByKey[arrayKey] = {
                        intervalChild: {
                            dependencyType: "child",
                            childGroups: ["intervals"],
                            variableNames: ["value"],
                            childIndices,
                        },
                    };
                }

                return { dependenciesByKey, globalDependencies };
            },
            arrayDefinitionByKey({
                dependencyValuesByKey,
                globalDependencyValues,
                arrayKeys,
            }) {
                // console.log("array definition of intervals for intervallist");
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
                // console.log(arrayKeys);

                let intervals = {};

                for (let arrayKey of arrayKeys) {
                    let intervalChild =
                        dependencyValuesByKey[arrayKey].intervalChild[0];
                    if (intervalChild) {
                        intervals[arrayKey] =
                            intervalChild.stateValues["value"];
                    } else {
                        intervals[arrayKey] =
                            globalDependencyValues.intervalsShadow[arrayKey];
                    }
                }

                // console.log("result")
                // console.log(JSON.parse(JSON.stringify(intervals)));

                return { setValue: { intervals } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                // console.log('array inverse definition of intervals of intervallist')
                // console.log(desiredStateVariableValues)
                // console.log(arrayKeys);

                let instructions = [];
                for (let arrayKey in desiredStateVariableValues.intervals) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let intervalChild =
                        dependencyValuesByKey[arrayKey].intervalChild[0];

                    if (intervalChild) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].intervalChild,
                            desiredValue:
                                desiredStateVariableValues.intervals[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (
                        globalDependencyValues.intervalsShadow !== null
                    ) {
                        if (!workspace.desiredIntervalsShadow) {
                            workspace.desiredIntervalsShadow = [
                                ...globalDependencyValues.intervalsShadow,
                            ];
                        }

                        workspace.desiredIntervalsShadow[arrayKey] =
                            desiredStateVariableValues.texts[arrayKey];
                    }
                }

                if (workspace.desiredIntervalsShadow) {
                    instructions.push({
                        setDependency: "intervalsShadow",
                        desiredValue: workspace.desiredIntervalsShadow,
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
            targetVariableName: "numIntervals",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "intervals",
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                childIndicesByInterval: {
                    dependencyType: "stateVariable",
                    variableName: "childIndicesByInterval",
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

        let childIndicesByInterval =
            await component.stateValues.childIndicesByInterval;

        let numIntervals = await component.stateValues.numIntervals;
        for (let i = 0; i < numIntervals; i++) {
            // allow one to override the fixed and isResponse attributes
            // as well as rounding settings
            // by specifying it on the list
            let attributes = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "interval",
                    componentInfoObjects,
                    nComponents,
                });

                attributes = JSON.parse(JSON.stringify(res.attributes));
                nComponents = res.nComponents;
            }

            if (copyChildSource) {
                nComponents = addShadowRoundingAttributes({
                    nComponents,
                    source: copyChildSource,
                    compositeIdx: copyChild.componentIdx,
                    attributes,
                    componentInfoObjects,
                });
            }

            let childIdx = childIndicesByInterval[i];
            let replacementSource = components[childIdx];

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);
            }

            replacements.push({
                type: "serialized",
                componentType: "interval",
                componentIdx: nComponents++,
                attributes,
                doenetAttributes: {},
                children: [],
                state: {},
                downstreamDependencies: {
                    [component.componentIdx]: [
                        {
                            dependencyType: "referenceShadow",
                            compositeIdx: component.componentIdx,
                            propVariable: `interval${i + 1}`,
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
        workspace.numIntervals = numIntervals;

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

        let numIntervals = await component.stateValues.numIntervals;

        if (numIntervals === workspace.numIntervals) {
            let componentsToCopy = [];

            let childIndicesByInterval =
                await component.stateValues.childIndicesByInterval;

            for (let childIdx of childIndicesByInterval) {
                let replacementSource = components[childIdx];

                if (replacementSource) {
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

function breakEmbeddedStringsIntoIntervalPieces({ componentList }) {
    let Nparens = 0;
    let pieces = [];
    let currentPiece = [];

    for (let component of componentList) {
        if (typeof component !== "string") {
            if (Nparens === 0) {
                // if not in a parenthesis, isn't an interval
                return { success: false };
            } else {
                currentPiece.push(component);
            }
            continue;
        }

        let s = component.trim();

        let beginInd = 0;

        for (let ind = 0; ind < s.length; ind++) {
            let char = s[ind];

            if (char === "(" || (Nparens === 0 && char === "[")) {
                Nparens++;
            } else if (char === ")" || (Nparens === 1 && char === "]")) {
                if (Nparens === 0) {
                    // parens didn't match, so return failure
                    return { success: false };
                }
                if (Nparens === 1) {
                    // found end of piece in parens
                    if (ind + 1 > beginInd) {
                        let lastInd = ind + 1;
                        let newString = s.substring(beginInd, lastInd).trim();
                        if (newString.length > 0) {
                            currentPiece.push(newString);
                        }
                    }

                    pieces.push(currentPiece);
                    currentPiece = [];
                    beginInd = ind + 1;
                }
                Nparens--;
            } else if (Nparens === 0 && !char.match(/\s/)) {
                // starting a new piece
                // each piece must begin with parens
                return { success: false };
            }
        }

        if (s.length > beginInd) {
            let newString = s.substring(beginInd, s.length).trim();
            currentPiece.push(newString);
        }
    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
        return { success: false };
    }

    if (currentPiece.length > 0) {
        // didn't have intervals
        return { success: false };
    }

    return {
        success: true,
        pieces: pieces,
    };
}
