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

export default class PointList extends CompositeComponent {
    static componentType = "pointList";

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static includeBlankStringChildren = true;
    static removeBlankStringChildrenPostSugar = true;

    // when another component has an attribute that is a pointList,
    // use the points state variable to populate that attribute
    static stateVariableToBeShadowed = "points";
    static primaryStateVariableForDefinition = "pointsShadow";

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

        let groupIntoPointsSeparatedBySpacesOutsideParens =
            returnGroupIntoComponentTypeSeparatedBySpacesOutsideParens({
                componentType: "point",
            });

        sugarInstructions.push({
            replacementFunction: function ({ matchedChildren, nComponents }) {
                return groupIntoPointsSeparatedBySpacesOutsideParens({
                    matchedChildren,
                    nComponents,
                });
            },
        });

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "points",
                componentTypes: ["point"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnUnorderedListStateVariableDefinitions(),
        );

        stateVariableDefinitions.pointsShadow = {
            defaultValue: null,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: {
                    pointsShadow: true,
                },
            }),
        };

        stateVariableDefinitions.numPoints = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                pointChildren: {
                    dependencyType: "child",
                    childGroups: ["points"],
                    skipComponentIndices: true,
                },
                pointsShadow: {
                    dependencyType: "stateVariable",
                    variableName: "pointsShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numPoints = 0;

                if (dependencyValues.pointChildren.length > 0) {
                    numPoints = dependencyValues.pointChildren.length;
                } else if (dependencyValues.pointsShadow !== null) {
                    numPoints = dependencyValues.pointsShadow.length;
                }

                let maxNum = dependencyValues.maxNumber;
                if (numPoints > maxNum) {
                    numPoints = maxNum;
                }

                return {
                    setValue: { numPoints },
                    checkForActualChange: { numPoints: true },
                };
            },
        };

        stateVariableDefinitions.numDimensions = {
            returnDependencies: () => ({
                maxNumber: {
                    dependencyType: "stateVariable",
                    variableName: "maxNumber",
                },
                pointChildren: {
                    dependencyType: "child",
                    childGroups: ["points"],
                    variableNames: ["numDimensions"],
                    skipComponentIndices: true,
                },
                pointsShadow: {
                    dependencyType: "stateVariable",
                    variableName: "pointsShadow",
                },
            }),
            definition: function ({ dependencyValues }) {
                let numDimensions;

                let numDimensionsByPoint = [];
                if (dependencyValues.pointChildren.length > 0) {
                    for (let point of dependencyValues.pointChildren) {
                        if (Number.isFinite(point.stateValues.numDimensions)) {
                            numDimensionsByPoint.push(
                                point.stateValues.numDimensions,
                            );
                        } else {
                            numDimensionsByPoint.push(1);
                        }
                    }
                } else if (dependencyValues.pointsShadow !== null) {
                    for (let point of dependencyValues.pointsShadow) {
                        numDimensionsByPoint.push(point.length);
                    }
                }

                let maxNum = dependencyValues.maxNumber;
                if (numDimensionsByPoint.length > maxNum) {
                    numDimensionsByPoint = numDimensionsByPoint.slice(
                        0,
                        maxNum,
                    );
                }

                if (numDimensionsByPoint.length === 0) {
                    numDimensions = 2;
                } else {
                    numDimensions = Math.max(...numDimensionsByPoint);
                }
                return {
                    setValue: { numDimensions },
                    checkForActualChange: { numDimensions: true },
                };
            },
        };

        stateVariableDefinitions.childIndicesByPoint = {
            isArray: true,
            returnArraySizeDependencies: () => ({
                numPoints: {
                    dependencyType: "stateVariable",
                    variableName: "numPoints",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numPoints];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        pointChild: {
                            dependencyType: "child",
                            childGroups: ["points"],
                            childIndices: [arrayKey],
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let childIndicesByPoint = {};

                for (let arrayKey of arrayKeys) {
                    let pointChild =
                        dependencyValuesByKey[arrayKey].pointChild[0];

                    if (pointChild) {
                        childIndicesByPoint[arrayKey] = pointChild.componentIdx;
                    }
                }

                return { setValue: { childIndicesByPoint } };
            },
        };

        stateVariableDefinitions.points = {
            isArray: true,
            numDimensions: 2,
            entryPrefixes: ["pointX", "point"],
            stateVariablesDeterminingDependencies: ["childIndicesByPoint"],
            returnEntryDimensions: (prefix) => (prefix === "point" ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "pointX") {
                    // pointX1_2 is the 2nd component of the first point
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
                    // point3 is all components of the third point

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
                if (varName === "points") {
                    if (propIndex.length === 1) {
                        return "point" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `pointX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 5) === "point") {
                    // could be point or pointX
                    let pointNum = Number(varName.slice(5));
                    if (Number.isInteger(pointNum) && pointNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `pointX${pointNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numPoints: {
                    dependencyType: "stateVariable",
                    variableName: "numPoints",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numPoints,
                    dependencyValues.numDimensions,
                ];
            },
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let dependenciesByKey = {};
                let globalDependencies = {
                    childIndicesByPoint: {
                        dependencyType: "stateVariable",
                        variableName: "childIndicesByPoint",
                    },
                    pointsShadow: {
                        dependencyType: "stateVariable",
                        variableName: "pointsShadow",
                    },
                };

                for (let arrayKey of arrayKeys) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let childIndices = [];
                    if (stateValues.childIndicesByPoint[pointInd]) {
                        childIndices = [pointInd];
                    }
                    dependenciesByKey[arrayKey] = {
                        pointChild: {
                            dependencyType: "child",
                            childGroups: ["points"],
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
                // console.log("array definition of points for pointlist");
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
                // console.log(arrayKeys);

                let points = {};

                for (let arrayKey of arrayKeys) {
                    let [pointInd, dim] = arrayKey.split(",");

                    let pointChild =
                        dependencyValuesByKey[arrayKey].pointChild[0];
                    if (pointChild) {
                        points[arrayKey] =
                            pointChild.stateValues["x" + (Number(dim) + 1)];
                    } else {
                        points[arrayKey] =
                            globalDependencyValues.pointsShadow[pointInd][dim];
                    }
                }

                // console.log("result")
                // console.log(JSON.parse(JSON.stringify(points)));

                return { setValue: { points } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                workspace,
            }) {
                // console.log('array inverse definition of points of pointlist')
                // console.log(desiredStateVariableValues)
                // console.log(arrayKeys);

                let instructions = [];
                for (let arrayKey in desiredStateVariableValues.points) {
                    if (!dependencyValuesByKey[arrayKey]) {
                        continue;
                    }

                    let pointChild =
                        dependencyValuesByKey[arrayKey].pointChild[0];

                    if (pointChild) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].pointChild,
                            desiredValue:
                                desiredStateVariableValues.points[arrayKey],
                            childIndex: 0,
                            variableIndex: 0,
                        });
                    } else if (globalDependencyValues.pointsShadow !== null) {
                        if (!workspace.desiredPointsShadow) {
                            workspace.desiredPointsShadow = [
                                ...globalDependencyValues.pointsShadow,
                            ];
                        }

                        let [pointInd, dim] = arrayKey.split(",");

                        workspace.desiredPointsShadow[pointInd][dim] =
                            desiredStateVariableValues.texts[arrayKey];
                    }
                }

                if (workspace.desiredPointsShadow) {
                    instructions.push({
                        setDependency: "pointsShadow",
                        desiredValue: workspace.desiredPointsShadow,
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
            targetVariableName: "numPoints",
        };

        stateVariableDefinitions.values = {
            isAlias: true,
            targetVariableName: "points",
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                childIndicesByPoint: {
                    dependencyType: "stateVariable",
                    variableName: "childIndicesByPoint",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
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

        let childIndicesByPoint =
            await component.stateValues.childIndicesByPoint;

        let numPoints = await component.stateValues.numPoints;
        let numDimensions = await component.stateValues.numDimensions;
        for (let i = 0; i < numPoints; i++) {
            // allow one to override the fixed and isResponse attributes
            // as well as rounding settings
            // by specifying it on the list
            let attributes = {};

            if (Object.keys(attributesToConvert).length > 0) {
                const res = convertUnresolvedAttributesForComponentType({
                    attributes: attributesToConvert,
                    componentType: "point",
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

            let childIdx = childIndicesByPoint[i];
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
                    attributes: {},
                    doenetAttributes: {},
                    children: [],
                    state: {},
                    downstreamDependencies: {
                        [component.componentIdx]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeIdx: component.componentIdx,
                                propVariable: `pointX${i + 1}_${dim + 1}`,
                            },
                        ],
                    },
                });
            }

            const mathList = {
                type: "serialized",
                componentType: "mathList",
                componentIdx: nComponents++,
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
                componentType: "point",
                componentIdx: nComponents++,
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
        workspace.numPoints = numPoints;

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

        let numPoints = await component.stateValues.numPoints;

        if (numPoints === workspace.numPoints) {
            let componentsToCopy = [];

            let childIndicesByPoint =
                await component.stateValues.childIndicesByPoint;

            for (let childIdx of childIndicesByPoint) {
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
