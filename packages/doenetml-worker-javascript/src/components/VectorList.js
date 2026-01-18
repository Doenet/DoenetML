import CompositeComponent from "./abstract/CompositeComponent";
import { returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens } from "./commonsugar/lists";
import {
    addShadowRoundingAttributes,
    gatherRawRoundingFixedResponseAttributes,
    returnRoundingAttributes,
} from "../utils/rounding";
import { postProcessCopy } from "../utils/copy";
import { convertUnresolvedAttributesForComponentType } from "../utils/dast/convertNormalizedDast";
import { returnUnorderedListStateVariableDefinitions } from "../utils/unorderedLists";

export default class VectorListComponent extends CompositeComponent {
    static componentType = "vectorList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a vectorList,
    // use the vectors state variable to populate that attribute
    static stateVariableToBeShadowed = "vectors";
    static primaryStateVariableForDefinition = "vectorsShadow";

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

        return attributes;
    }

    // Include children that can be added due to sugar
    static additionalSchemaChildren = ["string", "math"];

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        let groupIntoVectorsSeparatedBySpacesOutsideParens =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "vector",
            });

        sugarInstructions.push({
            replacementFunction: function ({
                matchedChildren,
                nComponents,
                stateIdInfo,
            }) {
                return groupIntoVectorsSeparatedBySpacesOutsideParens({
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
                group: "vectors",
                componentTypes: ["vector"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnUnorderedListStateVariableDefinitions(),
        );

        stateVariableDefinitions.vectorsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    vectorsShadow: true,
                },
            }),
        };

        stateVariableDefinitions.numVectors = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                vectorChildren: {
                    dependencyType: "child",
                    childGroups: ["vectors"],
                    skipComponentIndices: true,
                },
                vectorsShadow: {
                    dependencyType: "stateVariable",
                    variableName: "vectorsShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numVectors = 0;

                if (dependencyValues.vectorChildren.length > 0) {
                    numVectors = dependencyValues.vectorChildren.length;
                } else if (dependencyValues.vectorsShadow !== null) {
                    numVectors = dependencyValues.vectorsShadow.length;
                }

                let maxNum = dependencyValues.maxNumber;
                if (numVectors > maxNum) {
                    numVectors = maxNum;
                }

                return {
                    setValue: { numVectors },
                    checkForActualChange: { numVectors: true },
                };
            },
        };

        stateVariableDefinitions.numDimensions = {
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                vectorChildren: {
                    dependencyType: "child",
                    childGroups: ["vectors"],
                    variableNames: ["numDimensions"],
                    skipComponentIndices: true,
                },
                vectorsShadow: {
                    dependencyType: "stateVariable",
                    variableName: "vectorsShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numDimensions;

                let numDimensionsByVector = [];
                if (dependencyValues.vectorChildren.length > 0) {
                    for (let vector of dependencyValues.vectorChildren) {
                        if (Number.isFinite(vector.stateValues.numDimensions)) {
                            numDimensionsByVector.push(
                                vector.stateValues.numDimensions,
                            );
                        } else {
                            numDimensionsByVector.push(1);
                        }
                    }
                } else if (dependencyValues.vectorsShadow !== null) {
                    for (let vector of dependencyValues.vectorsShadow) {
                        numDimensionsByVector.push(vector.length);
                    }
                }

                let maxNum = dependencyValues.maxNumber;
                if (numDimensionsByVector.length > maxNum) {
                    numDimensionsByVector = numDimensionsByVector.slice(
                        0,
                        maxNum,
                    );
                }

                if (numDimensionsByVector.length === 0) {
                    numDimensions = 2;
                } else {
                    numDimensions = Math.max(...numDimensionsByVector);
                }
                return {
                    setValue: { numDimensions },
                    checkForActualChange: { numDimensions: true },
                };
            },
        };

        stateVariableDefinitions.childIndicesByVector = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numVectors: {
                    dependencyType: "stateVariable",
                    variableName: "numVectors",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numVectors];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        vectorChild: {
                            dependencyType: "child",
                            childGroups: ["vectors"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let childIndicesByVector = {};

                for (let arrayKey of arrayKeys) {
                    let vectorChild =
                        dependencyValuesByKey[arrayKey].vectorChild[0];

                    if (vectorChild) {
                        childIndicesByVector[arrayKey] =
                            vectorChild.componentIdx;
                    }
                }

                return { setValue: { childIndicesByVector } };
            },
        };

        stateVariableDefinitions.vectors = {
            isArray: true,
            numDimensions: 2,
            entryPrefixes: ["vectorX", "vector"],
            stateVariablesDeterminingDependencies: ["childIndicesByVector"],
            returnEntryDimensions: (prefix) => (prefix === "vector" ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "vectorX") {
                    // vectorX1_2 is the 2nd component of the first vector
                    let indices = varEnding
                        .split("_")
                        .map((x) => Number(x) - 1);
                    if (
                        indices.length === 2 &&
                        indices.every((x, i) => Number.isInteger(x) && x >= 0)
                    ) {
                        if (arraySize) {
                            if (indices.every((x, i) => x < arraySize[i])) {
                                return [String(indices)];
                            } else {
                                return [];
                            }
                        } else {
                            // If not given the array size,
                            // then return the array keys assuming the array is large enough.
                            // Must do this as it is used to determine potential array entries.
                            return [String(indices)];
                        }
                    } else {
                        return [];
                    }
                } else {
                    // vector3 is all components of the third vector

                    let pointInd = Number(varEnding) - 1;
                    if (!(Number.isInteger(pointInd) && pointInd >= 0)) {
                        return [];
                    }

                    if (!arraySize) {
                        // If don't have array size, we just need to determine if it is a potential entry.
                        // Return the first entry assuming array is large enough
                        return [pointInd + ",0"];
                    }
                    if (pointInd < arraySize[0]) {
                        // array of "pointInd,i", where i=0, ..., arraySize[1]-1
                        return Array.from(
                            Array(arraySize[1]),
                            (_, i) => pointInd + "," + i,
                        );
                    } else {
                        return [];
                    }
                }
            },
            arrayVarNameFromPropIndex(propIndex, varName) {
                if (varName === "vectors") {
                    if (propIndex.length === 1) {
                        return "vector" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `vectorX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 6) === "vector") {
                    // could be vector or vectorX
                    let vectorNum = Number(varName.slice(6));
                    if (Number.isInteger(vectorNum) && vectorNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `vectorX${vectorNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numVectors: {
                    dependencyType: "stateVariable",
                    variableName: "numVectors",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numVectors,
                    dependencyValues.numDimensions,
                ];
            },
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                let globalDependencies = {
                    childIndicesByVector: {
                        dependencyType: "stateVariable",
                        variableName: "childIndicesByVector",
                    },
                    vectorsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "vectorsShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let [vectorInd, dim] = arrayKey.split(",");
                    let childIndices = [];
                    if (stateValues.childIndicesByVector[vectorInd]) {
                        childIndices = [vectorInd];
                    }
                    dependenciesByKey[arrayKey] = {
                        vectorChild: {
                            dependencyType: "child",
                            childGroups: ["vectors"],
                            variableNames: ["x" + (Number(dim) + 1)],
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
                // console.log("array definition of vectors for vectorlist");
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
                // console.log(arrayKeys);

                let vectors = {};

                for (let arrayKey of arrayKeys) {
                    let [vectorInd, dim] = arrayKey.split(",");

                    let vectorChild =
                        dependencyValuesByKey[arrayKey].vectorChild[0];
                    if (vectorChild) {
                        vectors[arrayKey] =
                            vectorChild.stateValues["x" + (Number(dim) + 1)];
                    } else {
                        vectors[arrayKey] =
                            globalDependencyValues.vectorsShadow[vectorInd][
                                dim
                            ];
                    }
                }

                // console.log("result")
                // console.log(JSON.parse(JSON.stringify(vectors)));

                return { setValue: { vectors } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                // console.log('array inverse definition of vectors of vectorlist')
                // console.log(desiredStateVariableValues)
                // console.log(arrayKeys);

                let instructions = [];
                for (let arrayKey in desiredStateVariableValues.vectors) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let vectorChild =
                        dependencyValuesByKey[arrayKey].vectorChild[0];

                    if (vectorChild) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].vectorChild,
                            desiredValue:
                                desiredStateVariableValues.vectors[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.vectorsShadow !== null) {
                        if (!workspace.desiredVectorsShadow) {
                            workspace.desiredVectorsShadow = [
                                ...globalDependencyValues.vectorsShadow,
                            ];
                        }

                        let [vectorInd, dim] = arrayKey.split(",");

                        workspace.desiredVectorsShadow[vectorInd][dim] =
                            desiredStateVariableValues.texts[arrayKey];
                    }
                }

                if (workspace.desiredVectorsShadow) {
                    instructions.push({
                        setDependency: "vectorsShadow",
                        desiredValue: workspace.desiredVectorsShadow,
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
            targetVariableName: "numVectors",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "vectors",
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                childIndicesByVector: {
                    dependencyType: "stateVariable",
                    variableName: "childIndicesByVector",
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

        let childIndicesByVector =
            await component.stateValues.childIndicesByVector;

        let numVectors = await component.stateValues.numVectors;
        let numDimensions = await component.stateValues.numDimensions;
        for (let i = 0; i < numVectors; i++) {
            // allow one to override the fixed, isResponse, and isPotentialResponse attributes
            // as well as rounding settings
            // by specifying it on the list
            let attributes = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "vector",
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

            let childIdx = childIndicesByVector[i];
            let replacementSource = components[childIdx];

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);
            }

            const mathListChildren = [];

            for (let dim = 0; dim < numDimensions; dim++) {
                mathListChildren.push({
                    type: "serialized",
                    componentType: "math",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: {},
                    doenetAttributes: {},
                    children: [],
                    state: {},
                    downstreamDependencies: {
                        [component.componentIdx]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeIdx: component.componentIdx,
                                propVariable: `vectorX${i + 1}_${dim + 1}`,
                            },
                        ],
                    },
                });
            }

            const mathList = {
                type: "serialized",
                componentType: "mathList",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: {},
                doenetAttributes: {},
                children: mathListChildren,
                state: {},
            };

            attributes.xs = {
                type: "component",
                name: "xs",
                component: mathList,
            };

            replacements.push({
                type: "serialized",
                componentType: "vector",
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes,
                doenetAttributes: {},
                children: [],
                state: {},
            });
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;
        workspace.numVectors = numVectors;

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

        let numVectors = await component.stateValues.numVectors;

        if (numVectors === workspace.numVectors) {
            let componentsToCopy = [];

            let childIndicesByVector =
                await component.stateValues.childIndicesByVector;

            for (let childIdx of childIndicesByVector) {
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
