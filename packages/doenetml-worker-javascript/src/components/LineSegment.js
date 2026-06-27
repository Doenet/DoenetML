import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import { convertValueToMathExpression } from "@doenet/utils";
import {
    returnNumberDisplayAttributeComponentShadowing,
    returnNumberDisplayAttributes,
    returnNumberDisplayStateVariableDefinitions,
} from "../utils/numberDisplay";
import { returnGraphControlOrderAttribute } from "../utils/graphical";
import { returnLineFamilyLabelPositionAttribute } from "../utils/graphicalLabels";
import { returnStickyGroupDefinitions } from "../utils/constraints";

function directionFromSlope(slope) {
    if (slope === Infinity || slope === -Infinity) {
        return [0, Math.sign(slope)];
    }
    if (!Number.isFinite(slope)) {
        return null;
    }

    let theta = Math.atan(slope);
    return [Math.cos(theta), Math.sin(theta)];
}

function getClampedPointOffset(pointOffsetAttr, essentialPointOffset) {
    return Math.max(
        -1,
        Math.min(
            1,
            pointOffsetAttr !== null
                ? pointOffsetAttr.stateValues.value
                : essentialPointOffset,
        ),
    );
}

function getNumericValue(mathOrNumber) {
    return mathOrNumber instanceof me.class
        ? mathOrNumber.evaluate_to_constant()
        : Number(mathOrNumber);
}

function getNumericEndpointPair(
    desiredUnconstrainedEndpoints,
    currentEndpoints,
    numDimensions = 2,
    pointInds = [0, 1],
) {
    return pointInds.map((pointInd) =>
        Array.from({ length: numDimensions }, (_, dim) => {
            let key = pointInd + "," + dim;
            if (key in desiredUnconstrainedEndpoints) {
                return getNumericValue(desiredUnconstrainedEndpoints[key]);
            }
            return currentEndpoints[pointInd][dim].evaluate_to_constant();
        }),
    );
}

function getSlopeAndSignedLength(endpoint1, endpoint2, fallbackSlope) {
    const dx = endpoint2[0] - endpoint1[0];
    const dy = endpoint2[1] - endpoint1[1];

    if (dx === 0 && dy === 0) {
        return {
            slope: fallbackSlope,
            signedLength: 0,
        };
    }

    if (dx === 0) {
        return {
            slope: dy > 0 ? Infinity : -Infinity,
            // For vertical segments, slope encodes up vs down, so a positive
            // length still preserves the dragged endpoint when reapplied with
            // directionFromSlope(slope).
            signedLength: Math.abs(dy),
        };
    }

    return {
        slope: dy / dx,
        signedLength: Math.hypot(dx, dy) * Math.sign(dx),
    };
}

function getDirectionComponent(dim, dirX, dirY) {
    let dimNumber = Number(dim);
    if (dimNumber === 0) {
        return dirX;
    }
    if (dimNumber === 1) {
        return dirY;
    }
    return 0;
}

function addSlopeAndLengthInstructions({
    instructions,
    globalDependencyValues,
    endpoint1,
    endpoint2,
}) {
    const fallbackSlope =
        globalDependencyValues.slopeAttr !== null
            ? globalDependencyValues.slopeAttr.stateValues.value
            : globalDependencyValues.essentialSlope;

    const { slope, signedLength } = getSlopeAndSignedLength(
        endpoint1,
        endpoint2,
        fallbackSlope,
    );

    if (globalDependencyValues.slopeAttr !== null) {
        instructions.push({
            setDependency: "slopeAttr",
            desiredValue: slope,
            variableIndex: 0,
        });
    } else {
        instructions.push({
            setDependency: "essentialSlope",
            desiredValue: slope,
        });
    }

    if (globalDependencyValues.lengthAttr !== null) {
        instructions.push({
            setDependency: "lengthAttr",
            desiredValue: signedLength,
            variableIndex: 0,
        });
    } else {
        instructions.push({
            setDependency: "essentialSignedLength",
            desiredValue: signedLength,
        });
    }
}

function addThroughPointInstructions({
    instructions,
    dependencyNamesByKey,
    throughPoint,
}) {
    for (let dim = 0; dim < throughPoint.length; dim++) {
        const throughDependencyName =
            dependencyNamesByKey["0," + dim]?.throughCoord ??
            dependencyNamesByKey["1," + dim]?.throughCoord;

        if (throughDependencyName !== undefined) {
            instructions.push({
                setDependency: throughDependencyName,
                desiredValue: me.fromAst(throughPoint[dim]),
                variableIndex: 0,
            });
        }
    }
}

function mergePointCoords(pointCoords, currentPoint, numDimensions) {
    return Array.from({ length: numDimensions }, (_, dim) =>
        pointCoords[dim] !== undefined ? pointCoords[dim] : currentPoint[dim],
    );
}

export default class LineSegment extends GraphicalComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            moveLineSegment: this.moveLineSegment.bind(this),
            moveLineSegmentSinglePoint:
                this.moveLineSegmentSinglePoint.bind(this),
            lineSegmentClicked: this.lineSegmentClicked.bind(this),
            lineSegmentFocused: this.lineSegmentFocused.bind(this),
        });
    }
    static componentType = "lineSegment";
    static styleOverrideCategories = ["line"];

    static componentDocs = {
        summary: "A line segment between two endpoints",
    };
    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.draggable = {
            description: "Whether the line segment can be dragged on a graph.",
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.endpointsDraggable = {
            createComponentOfType: "boolean",
            description: "Whether the line segment's endpoints can be dragged.",
        };

        attributes.endpoints = {
            createComponentOfType: "pointList",
            description: "The two endpoints of the line segment.",
        };

        attributes.through = {
            createComponentOfType: "point",
            description:
                "A point the line segment passes through when using slope/length/pointOffset.",
        };

        attributes.slope = {
            createComponentOfType: "number",
            description:
                "The slope of the line segment in the x-y plane. It may be negative and can change sign when the direction passes through vertical.",
        };

        attributes.length = {
            createComponentOfType: "number",
            description:
                "The signed length of the line segment. Negative values flip the direction relative to the slope.",
        };

        attributes.pointOffset = {
            createComponentOfType: "number",
            description:
                "Where the through point sits along the segment: -1=first endpoint, 0=midpoint, 1=second endpoint.",
        };

        attributes.addControls = {
            description: "Whether to render interactive control handles.",
            createComponentOfType: "text",
            createStateVariable: "addControls",
            defaultValue: "endpoints",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "endpoints",
                    description:
                        "Show control handles for both endpoints of the segment.",
                },
                {
                    value: "none",
                    description: "Show no control handles.",
                },
            ],
            valueForTrue: "endpoints",
            valueForFalse: "none",
        };

        attributes.showCoordsWhenDragging = {
            description: "Whether to show coordinate labels while dragging.",
            createComponentOfType: "boolean",
            createStateVariable: "showCoordsWhenDragging",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.labelPosition = returnLineFamilyLabelPositionAttribute();

        Object.assign(attributes, returnNumberDisplayAttributes());
        attributes.controlOrder = returnGraphControlOrderAttribute();

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnNumberDisplayStateVariableDefinitions(),
        );

        Object.assign(stateVariableDefinitions, returnStickyGroupDefinitions());

        stateVariableDefinitions.styleDescription = {
            description: "A textual description of the line segment's style.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let lineColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWordDarkMode;
                } else {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWord;
                }

                let styleDescription =
                    dependencyValues.selectedStyle.lineWidthWord;
                if (dependencyValues.selectedStyle.lineStyleWord) {
                    if (styleDescription) {
                        styleDescription += " ";
                    }
                    styleDescription +=
                        dependencyValues.selectedStyle.lineStyleWord;
                }

                if (styleDescription) {
                    styleDescription += " ";
                }

                styleDescription += lineColorWord;

                return { setValue: { styleDescription } };
            },
        };

        stateVariableDefinitions.styleDescriptionWithNoun = {
            description: 'Style description including "line segment".',
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                styleDescription: {
                    dependencyType: "stateVariable",
                    variableName: "styleDescription",
                },
            }),
            definition: function ({ dependencyValues }) {
                let styleDescriptionWithNoun =
                    dependencyValues.styleDescription + " line segment";

                return { setValue: { styleDescriptionWithNoun } };
            },
        };

        stateVariableDefinitions.endpointsDraggable = {
            description: "Whether each endpoint can be dragged independently.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            hasEssential: true,
            forRenderer: true,
            returnDependencies: () => ({
                endpointsDraggableAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "endpointsDraggable",
                    variableNames: ["value"],
                },
                draggable: {
                    dependencyType: "stateVariable",
                    variableName: "draggable",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.endpointsDraggableAttr) {
                    return {
                        setValue: {
                            endpointsDraggable:
                                dependencyValues.endpointsDraggableAttr
                                    .stateValues.value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            endpointsDraggable: {
                                defaultValue: dependencyValues.draggable,
                            },
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.numDimensions = {
            description: "Number of dimensions the segment lives in.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies: () => ({
                endpointsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "endpoints",
                    variableNames: ["numDimensions"],
                },
                throughAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "through",
                    variableNames: ["numDimensions"],
                },
            }),
            definition: function ({ dependencyValues }) {
                const endpointsDimensions =
                    dependencyValues.endpointsAttr?.stateValues.numDimensions ??
                    0;
                const throughDimensions =
                    dependencyValues.throughAttr?.stateValues.numDimensions ??
                    0;

                return {
                    setValue: {
                        numDimensions: Math.max(
                            endpointsDimensions,
                            throughDimensions,
                            2,
                        ),
                    },
                    checkForActualChange: { numDimensions: true },
                };
            },
        };

        // How many endpoints are explicitly prescribed in the endpoints attribute.
        stateVariableDefinitions.numEndpointsSpecified = {
            returnDependencies: () => ({
                endpointsAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "endpoints",
                    variableNames: ["numPoints"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.endpointsAttr === null) {
                    return { setValue: { numEndpointsSpecified: 0 } };
                }
                return {
                    setValue: {
                        numEndpointsSpecified: Math.min(
                            dependencyValues.endpointsAttr.stateValues
                                .numPoints,
                            2,
                        ),
                    },
                };
            },
        };

        // How many through points are prescribed (0 or 1).
        stateVariableDefinitions.numThroughPoints = {
            returnDependencies: () => ({
                throughAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "through",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numThroughPoints:
                            dependencyValues.throughAttr !== null ? 1 : 0,
                    },
                };
            },
        };

        // True when slope/length/through attrs are active (plus pointOffset when
        // paired with through) and fewer than 2 explicit endpoints are given.
        // Mirrors Line.js's basedOnSlope pattern.
        // When false, all old unconstrainedEndpoints code paths run unchanged.
        // Note: slope is a 2D concept, so Cases B/C/D apply it only in the x-y
        // plane and preserve higher coordinates. Case A (1 endpoint + 1 through)
        // is fully dimension-agnostic.
        stateVariableDefinitions.basedOnSlopeOrThrough = {
            stateVariablesDeterminingDependencies: [],
            returnDependencies: () => ({
                slopeAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "slope",
                },
                lengthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "length",
                },
                throughAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "through",
                },
                numEndpointsSpecified: {
                    dependencyType: "stateVariable",
                    variableName: "numEndpointsSpecified",
                },
            }),
            definition({ dependencyValues }) {
                const anyPositioningAttr =
                    dependencyValues.slopeAttr !== null ||
                    dependencyValues.lengthAttr !== null ||
                    dependencyValues.throughAttr !== null;
                return {
                    setValue: {
                        basedOnSlopeOrThrough:
                            anyPositioningAttr &&
                            dependencyValues.numEndpointsSpecified < 2,
                    },
                };
            },
        };
        // Essential slope — used when basedOnSlopeOrThrough but no slope attr.
        stateVariableDefinitions.essentialSlope = {
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { essentialSlope: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "essentialSlope",
                            value: desiredStateVariableValues.essentialSlope,
                        },
                    ],
                };
            },
        };

        // Essential signed length — used when basedOnSlopeOrThrough but no length attr.
        stateVariableDefinitions.essentialSignedLength = {
            defaultValue: 1,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { essentialSignedLength: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "essentialSignedLength",
                            value: desiredStateVariableValues.essentialSignedLength,
                        },
                    ],
                };
            },
        };

        // Essential point offset — used when numThroughPoints===1 but no pointOffset attr.
        stateVariableDefinitions.essentialPointOffset = {
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { essentialPointOffset: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "essentialPointOffset",
                            value: desiredStateVariableValues.essentialPointOffset,
                        },
                    ],
                };
            },
        };

        // Essential ep1 (first endpoint) — used in Case D when basedOnSlopeOrThrough is true
        // but no endpoints attr is specified. Stored separately from unconstrainedEndpoints
        // essential state to avoid a self-referential dependency.
        // Modeled after Line.js's essentialPoints array.
        stateVariableDefinitions.essentialEp1 = {
            isArray: true,
            numDimensions: 1,
            isLocation: true,
            hasEssential: true,
            set: convertValueToMathExpression,
            defaultValueByArrayKey: () => me.fromAst(0),
            entryPrefixes: ["essentialEp1X"],
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                let ind = Number(varEnding) - 1;
                if (!Number.isInteger(ind) || ind < 0) {
                    return [];
                }
                if (arraySize) {
                    return ind < arraySize[0] ? [String(ind)] : [];
                }
                return [String(ind)];
            },
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numDimensions];
            },
            returnArrayDependenciesByKey: () => ({}),
            arrayDefinitionByKey({ arrayKeys }) {
                let essentialEp1 = {};
                for (let arrayKey of arrayKeys) {
                    essentialEp1[arrayKey] = true;
                }
                return { useEssentialOrDefaultValue: { essentialEp1 } };
            },
            inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
                let instructions = [];
                for (let arrayKey in desiredStateVariableValues.essentialEp1) {
                    instructions.push({
                        setEssentialValue: "essentialEp1",
                        value: {
                            [arrayKey]: convertValueToMathExpression(
                                desiredStateVariableValues.essentialEp1[
                                    arrayKey
                                ],
                            ),
                        },
                    });
                }
                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.unconstrainedEndpoints = {
            isLocation: true,
            isArray: true,
            numDimensions: 2,
            entryPrefixes: ["unconstrainedEndpointX", "unconstrainedEndpoint"],
            returnEntryDimensions: (prefix) =>
                prefix === "unconstrainedEndpoint" ? 1 : 0,
            hasEssential: true,
            set: convertValueToMathExpression,
            defaultValueByArrayKey: (arrayKey) =>
                me.fromAst(arrayKey === "0,0" ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "unconstrainedEndpointX") {
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
                    // unconstrainedEndpoint3 is all components of the third point

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
                if (varName === "unconstrainedEndpoints") {
                    if (propIndex.length === 1) {
                        return "unconstrainedEndpoint" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `unconstrainedEndpointX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 21) === "unconstrainedEndpoint") {
                    // could be endpoint or endpointX
                    let endpointNum = Number(varName.slice(8));
                    if (Number.isInteger(endpointNum) && endpointNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `unconstrainedEndpointX${endpointNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [2, dependencyValues.numDimensions];
            },
            stateVariablesDeterminingDependencies: [
                "basedOnSlopeOrThrough",
                "numEndpointsSpecified",
                "numThroughPoints",
            ],
            returnArrayDependenciesByKey({ stateValues, arrayKeys }) {
                // When not using the new slope/through parameterization,
                // use the original dependency structure (both endpoints from attr or essential).
                if (!stateValues.basedOnSlopeOrThrough) {
                    let dependenciesByKey = {};
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding =
                            Number(pointInd) + 1 + "_" + (Number(dim) + 1);
                        dependenciesByKey[arrayKey] = {
                            endpointsAttr: {
                                dependencyType: "attributeComponent",
                                attributeName: "endpoints",
                                variableNames: ["pointX" + varEnding],
                            },
                        };
                    }
                    return { dependenciesByKey };
                }

                // New parameterization — global dependencies shared across all keys.
                let globalDependencies = {
                    basedOnSlopeOrThrough: {
                        dependencyType: "stateVariable",
                        variableName: "basedOnSlopeOrThrough",
                    },
                    numEndpointsSpecified: {
                        dependencyType: "stateVariable",
                        variableName: "numEndpointsSpecified",
                    },
                    numThroughPoints: {
                        dependencyType: "stateVariable",
                        variableName: "numThroughPoints",
                    },
                    numDimensions: {
                        dependencyType: "stateVariable",
                        variableName: "numDimensions",
                    },
                    slopeAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "slope",
                        variableNames: ["value"],
                    },
                    lengthAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "length",
                        variableNames: ["value"],
                    },
                    pointOffsetAttr: {
                        dependencyType: "attributeComponent",
                        attributeName: "pointOffset",
                        variableNames: ["value"],
                    },
                    essentialSlope: {
                        dependencyType: "stateVariable",
                        variableName: "essentialSlope",
                    },
                    essentialSignedLength: {
                        dependencyType: "stateVariable",
                        variableName: "essentialSignedLength",
                    },
                    essentialPointOffset: {
                        dependencyType: "stateVariable",
                        variableName: "essentialPointOffset",
                    },
                };

                // Case A or B: 1 explicit endpoint — need ep1 from endpoints attr.
                if (stateValues.numEndpointsSpecified === 1) {
                    globalDependencies.ep1FromAttr = {
                        dependencyType: "attributeComponent",
                        attributeName: "endpoints",
                        variableNames: [],
                    };
                    // We'll fetch individual coords per key below.
                    let dependenciesByKey = {};
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding = "1_" + (Number(dim) + 1);
                        dependenciesByKey[arrayKey] = {
                            ep1Coord: {
                                dependencyType: "attributeComponent",
                                attributeName: "endpoints",
                                variableNames: ["pointX" + varEnding],
                            },
                        };
                    }
                    // For case A, also need through point coords.
                    if (stateValues.numThroughPoints === 1) {
                        for (let arrayKey of arrayKeys) {
                            let [pointInd, dim] = arrayKey.split(",");
                            let varEnding = "1_" + (Number(dim) + 1);
                            dependenciesByKey[arrayKey].throughCoord = {
                                dependencyType: "attributeComponent",
                                attributeName: "through",
                                variableNames: ["x" + (Number(dim) + 1)],
                            };
                        }
                    }
                    return { globalDependencies, dependenciesByKey };
                }

                // Case C or D: 0 explicit endpoints.
                let dependenciesByKey = {};
                if (stateValues.numThroughPoints === 1) {
                    // Case C: need through point coords per key.
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        dependenciesByKey[arrayKey] = {
                            throughCoord: {
                                dependencyType: "attributeComponent",
                                attributeName: "through",
                                variableNames: ["x" + (Number(dim) + 1)],
                            },
                        };
                    }
                } else {
                    // Case D: ep1 from essentialEp1 (separate state variable to avoid
                    // self-referential dependency on unconstrainedEndpoints entries).
                    // ep2 is derived from ep1 + slope/length.
                    globalDependencies.essentialEp1 = {
                        dependencyType: "stateVariable",
                        variableName: "essentialEp1",
                    };
                    for (let arrayKey of arrayKeys) {
                        dependenciesByKey[arrayKey] = {};
                    }
                    return { globalDependencies, dependenciesByKey };
                }
                return { globalDependencies, dependenciesByKey };
            },

            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
            }) {
                // Old behavior: basedOnSlopeOrThrough is false.
                if (!globalDependencyValues?.basedOnSlopeOrThrough) {
                    let unconstrainedEndpoints = {};
                    let essentialUnconstrainedEndpoints = {};

                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding =
                            Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                        if (
                            dependencyValuesByKey[arrayKey].endpointsAttr !==
                                null &&
                            dependencyValuesByKey[arrayKey].endpointsAttr
                                .stateValues["pointX" + varEnding]
                        ) {
                            unconstrainedEndpoints[arrayKey] =
                                dependencyValuesByKey[
                                    arrayKey
                                ].endpointsAttr.stateValues[
                                    "pointX" + varEnding
                                ];
                        } else {
                            essentialUnconstrainedEndpoints[arrayKey] = true;
                        }
                    }

                    let result = {};
                    if (Object.keys(unconstrainedEndpoints).length > 0) {
                        result.setValue = { unconstrainedEndpoints };
                    }
                    if (
                        Object.keys(essentialUnconstrainedEndpoints).length > 0
                    ) {
                        result.useEssentialOrDefaultValue = {
                            unconstrainedEndpoints:
                                essentialUnconstrainedEndpoints,
                        };
                    }
                    return result;
                }

                // New parameterization — compute ep1/ep2 from slope/length/through.
                const g = globalDependencyValues;
                const slope =
                    g.slopeAttr !== null
                        ? g.slopeAttr.stateValues.value
                        : g.essentialSlope;
                const signedLength =
                    g.lengthAttr !== null
                        ? g.lengthAttr.stateValues.value
                        : g.essentialSignedLength;

                // Compute direction unit vector from slope.
                const direction = directionFromSlope(slope);
                if (direction === null) {
                    // NaN slope → undefined segment
                    let unconstrainedEndpoints = {};
                    for (let arrayKey of arrayKeys) {
                        unconstrainedEndpoints[arrayKey] = me.fromAst("\uff3f");
                    }
                    return { setValue: { unconstrainedEndpoints } };
                }
                const [dirX, dirY] = direction;

                // Emit diagnostics for ignored attributes.
                let sendDiagnostics = [];
                if (g.numEndpointsSpecified === 1 && g.numThroughPoints === 1) {
                    if (
                        g.slopeAttr !== null ||
                        g.lengthAttr !== null ||
                        g.pointOffsetAttr !== null
                    ) {
                        sendDiagnostics.push({
                            type: "info",
                            message:
                                "slope, length, and pointOffset are ignored when an endpoint and a through point are both specified",
                        });
                    }
                } else if (
                    g.numThroughPoints === 0 &&
                    g.pointOffsetAttr !== null
                ) {
                    sendDiagnostics.push({
                        type: "info",
                        message:
                            "pointOffset has no effect without a through point",
                    });
                }

                let unconstrainedEndpoints = {};

                if (g.numEndpointsSpecified === 1 && g.numThroughPoints === 1) {
                    // Case A: 1 endpoint + 1 through → through is ep2.
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding = "1_" + (Number(dim) + 1);
                        if (pointInd === "0") {
                            unconstrainedEndpoints[arrayKey] =
                                dependencyValuesByKey[
                                    arrayKey
                                ].ep1Coord.stateValues["pointX" + varEnding];
                        } else {
                            // ep2 = through point
                            let throughVal =
                                dependencyValuesByKey[arrayKey].throughCoord
                                    ?.stateValues["x" + (Number(dim) + 1)];
                            unconstrainedEndpoints[arrayKey] =
                                throughVal ?? me.fromAst(0);
                        }
                    }
                } else if (
                    g.numEndpointsSpecified === 1 &&
                    g.numThroughPoints === 0
                ) {
                    // Case B: 1 endpoint, ep2 = ep1 + L × dir.
                    // Build ep2 as an expression so symbolic endpoints are preserved.
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding = "1_" + (Number(dim) + 1);
                        let ep1Coord =
                            dependencyValuesByKey[arrayKey].ep1Coord
                                .stateValues["pointX" + varEnding];
                        if (!ep1Coord) {
                            unconstrainedEndpoints[arrayKey] =
                                me.fromAst("\uff3f");
                            continue;
                        }
                        if (pointInd === "0") {
                            unconstrainedEndpoints[arrayKey] = ep1Coord;
                        } else {
                            let delta =
                                signedLength *
                                getDirectionComponent(dim, dirX, dirY);
                            unconstrainedEndpoints[arrayKey] = me
                                .fromAst(["+", ep1Coord.tree, delta])
                                .simplify();
                        }
                    }
                } else if (g.numThroughPoints === 1) {
                    // Case C: 0 endpoints + 1 through.
                    // Build endpoints as expressions so symbolic through points are preserved.
                    const po = getClampedPointOffset(
                        g.pointOffsetAttr,
                        g.essentialPointOffset,
                    );
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let throughCoordVal =
                            dependencyValuesByKey[arrayKey].throughCoord
                                ?.stateValues["x" + (Number(dim) + 1)];
                        if (!throughCoordVal) {
                            unconstrainedEndpoints[arrayKey] =
                                me.fromAst("\uff3f");
                            continue;
                        }
                        let dir = getDirectionComponent(dim, dirX, dirY);
                        if (pointInd === "0") {
                            let coeff = ((1 + po) / 2) * signedLength * dir;
                            unconstrainedEndpoints[arrayKey] = me
                                .fromAst(["+", throughCoordVal.tree, -coeff])
                                .simplify();
                        } else {
                            let coeff = ((1 - po) / 2) * signedLength * dir;
                            unconstrainedEndpoints[arrayKey] = me
                                .fromAst(["+", throughCoordVal.tree, coeff])
                                .simplify();
                        }
                    }
                } else {
                    // Case D: 0 endpoints + 0 through, slope/length active.
                    // ep1 from essentialEp1 global dep; ep2 derived.
                    let ep1 = g.essentialEp1 ?? [me.fromAst(0), me.fromAst(0)];
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        if (pointInd === "0") {
                            unconstrainedEndpoints[arrayKey] =
                                ep1[Number(dim)] ?? me.fromAst(0);
                        } else {
                            let ep1Coord = (
                                ep1[Number(dim)] ?? me.fromAst(0)
                            ).evaluate_to_constant();
                            if (!Number.isFinite(ep1Coord)) {
                                unconstrainedEndpoints[arrayKey] =
                                    me.fromAst("\uff3f");
                                continue;
                            }
                            let dir = getDirectionComponent(dim, dirX, dirY);
                            unconstrainedEndpoints[arrayKey] = me.fromAst(
                                ep1Coord + signedLength * dir,
                            );
                        }
                    }
                }

                let result = { setValue: { unconstrainedEndpoints } };
                if (sendDiagnostics.length > 0) {
                    result.sendDiagnostics = sendDiagnostics;
                }
                return result;
            },

            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                initialChange,
                stateValues,
                workspace,
                arraySize,
            }) {
                // Old behavior (basedOnSlopeOrThrough === false):
                // update each desired endpoint from attr or essential independently.
                if (!globalDependencyValues?.basedOnSlopeOrThrough) {
                    let instructions = [];
                    for (let arrayKey in desiredStateVariableValues.unconstrainedEndpoints) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding =
                            Number(pointInd) + 1 + "_" + (Number(dim) + 1);
                        if (
                            dependencyValuesByKey[arrayKey].endpointsAttr !==
                                null &&
                            dependencyValuesByKey[arrayKey].endpointsAttr
                                .stateValues["pointX" + varEnding]
                        ) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey]
                                        .endpointsAttr,
                                desiredValue:
                                    desiredStateVariableValues
                                        .unconstrainedEndpoints[arrayKey],
                                childIndex: 0,
                                variableIndex: 0,
                            });
                        } else {
                            instructions.push({
                                setEssentialValue: "unconstrainedEndpoints",
                                value: {
                                    [arrayKey]:
                                        desiredStateVariableValues
                                            .unconstrainedEndpoints[arrayKey],
                                },
                            });
                        }
                    }
                    return { success: true, instructions };
                }

                // New parameterization inverse.
                // Architectural principle: the inverse follows the dependency graph only.
                // "Keep the other endpoint fixed" when dragging a graph handle is handled
                // by moveLineSegment, which passes both desired endpoint positions.
                // (Same design as Vector tail+displacement vs tail+head.)
                //
                // - ep1 keys desired only → update position handle; slope/length unchanged
                //   → whole segment translates (e.g., when referenced endpoint is dragged)
                // - ep2 keys desired only → compute new slope/length from (current_ep1, desired_ep2)
                // - both desired (from action) → update ep1 handle AND slope/length

                const g = globalDependencyValues;
                const numDim = g.numDimensions ?? 2;
                workspace ??= {};
                Object.assign(
                    workspace,
                    desiredStateVariableValues.unconstrainedEndpoints,
                );
                const desiredUnconstrainedEndpoints = workspace;

                const desiredKeys = Object.keys(desiredUnconstrainedEndpoints);
                const onlyEp1Desired = desiredKeys.every((k) =>
                    k.startsWith("0,"),
                );
                const onlyEp2Desired = desiredKeys.every((k) =>
                    k.startsWith("1,"),
                );

                let instructions = [];

                const numEndpointsSpecified = g.numEndpointsSpecified;
                const numThroughPoints = g.numThroughPoints;

                if (numEndpointsSpecified === 1 && numThroughPoints === 1) {
                    // Case A: ep1 → endpoints attr independently, ep2 → through attr independently.
                    for (let arrayKey of desiredKeys) {
                        let [pointInd, dim] = arrayKey.split(",").map(Number);
                        if (pointInd === 0) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].ep1Coord,
                                desiredValue:
                                    desiredUnconstrainedEndpoints[arrayKey],
                                variableIndex: 0,
                            });
                        } else {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey].throughCoord,
                                desiredValue:
                                    desiredUnconstrainedEndpoints[arrayKey],
                                variableIndex: 0,
                            });
                        }
                    }
                    return { success: true, instructions };
                }

                if (numEndpointsSpecified === 1 && numThroughPoints === 0) {
                    // Case B: ep1 from endpoints attr; ep2 = ep1 + L × dir(slope).
                    // ep1 desired → update ep1 attr directly (slope/length unchanged → ep2 translates)
                    // ep2 desired → compute new slope/length
                    // both desired (from action) → update ep1 attr + slope/length

                    if (!onlyEp2Desired) {
                        // ep1 keys: pass through directly to ep1Coord dependency.
                        for (let arrayKey of desiredKeys) {
                            let [pointInd] = arrayKey.split(",").map(Number);
                            if (pointInd === 0) {
                                instructions.push({
                                    setDependency:
                                        dependencyNamesByKey[arrayKey].ep1Coord,
                                    desiredValue:
                                        desiredUnconstrainedEndpoints[arrayKey],
                                    variableIndex: 0,
                                });
                            }
                        }
                    }
                    if (!onlyEp1Desired) {
                        // Need numeric ep1 and ep2 to compute new slope/length.
                        let currentEndpoints = await stateValues.endpoints;
                        let [ep1Num, ep2Num] = getNumericEndpointPair(
                            desiredUnconstrainedEndpoints,
                            currentEndpoints,
                        );
                        if (
                            ep1Num.every(Number.isFinite) &&
                            ep2Num.every(Number.isFinite)
                        ) {
                            addSlopeAndLengthInstructions({
                                instructions,
                                globalDependencyValues: g,
                                endpoint1: ep1Num,
                                endpoint2: ep2Num,
                            });
                        }
                    }
                } else if (numThroughPoints === 1) {
                    // Case C: through point T is the position handle.
                    // ep1 = T - (1+po)/2 * L * dir
                    // ep2 = T + (1-po)/2 * L * dir
                    const po = getClampedPointOffset(
                        g.pointOffsetAttr,
                        g.essentialPointOffset,
                    );
                    const tT = (1 + po) / 2;

                    let T_new;
                    if (onlyEp1Desired) {
                        // Only ep1 desired (referenced point dragged): translate segment.
                        // Compute T from desired ep1 + current slope/length direction.
                        // Slope/length stay unchanged; whole segment translates.
                        const slope =
                            g.slopeAttr !== null
                                ? g.slopeAttr.stateValues.value
                                : g.essentialSlope;
                        const L =
                            g.lengthAttr !== null
                                ? g.lengthAttr.stateValues.value
                                : g.essentialSignedLength;
                        const direction = directionFromSlope(slope);
                        if (direction === null) {
                            return { success: false };
                        }
                        const [dirX2, dirY2] = direction;
                        let currentEndpoints = await stateValues.endpoints;
                        const [ep1Desired] = getNumericEndpointPair(
                            desiredUnconstrainedEndpoints,
                            currentEndpoints,
                            numDim,
                            [0],
                        );
                        T_new = ep1Desired.map(
                            (value, dim) =>
                                value +
                                tT *
                                    L *
                                    getDirectionComponent(dim, dirX2, dirY2),
                        );
                    } else {
                        // ep2 desired (alone or with ep1): use t-parameterization.
                        // T_new = ep1_new + tT * (ep2_new - ep1_new)
                        let currentEndpoints = await stateValues.endpoints;
                        let [ep1Num, ep2Num] = getNumericEndpointPair(
                            desiredUnconstrainedEndpoints,
                            currentEndpoints,
                            numDim,
                        );
                        if (
                            !ep1Num.every(Number.isFinite) ||
                            !ep2Num.every(Number.isFinite)
                        ) {
                            return { success: false };
                        }
                        T_new = ep1Num.map(
                            (value, dim) => value + tT * (ep2Num[dim] - value),
                        );
                        // Also update slope/length since ep2 changed.
                        addSlopeAndLengthInstructions({
                            instructions,
                            globalDependencyValues: g,
                            endpoint1: ep1Num,
                            endpoint2: ep2Num,
                        });
                    }

                    addThroughPointInstructions({
                        instructions,
                        dependencyNamesByKey,
                        throughPoint: T_new,
                    });
                } else {
                    // Case D: 0 endpoints + 0 through; ep1 in essentialEp1, ep2 derived.
                    // ep1 desired → update essentialEp1 directly (slope/length unchanged → ep2 translates)
                    // ep2 desired → compute new slope/length (ep1 essentialEp1 unchanged)
                    // both desired (from action) → update essentialEp1 + slope/length

                    if (!onlyEp2Desired) {
                        // ep1 keys: pass through directly to essentialEp1.
                        for (let arrayKey of desiredKeys) {
                            let [pointInd, dim] = arrayKey
                                .split(",")
                                .map(Number);
                            if (pointInd === 0) {
                                instructions.push({
                                    setDependency: "essentialEp1",
                                    desiredValue: {
                                        [String(dim)]:
                                            desiredUnconstrainedEndpoints[
                                                arrayKey
                                            ],
                                    },
                                });
                            }
                        }
                    }
                    if (!onlyEp1Desired) {
                        let currentEndpoints = await stateValues.endpoints;
                        let [ep1Num, ep2Num] = getNumericEndpointPair(
                            desiredUnconstrainedEndpoints,
                            currentEndpoints,
                        );
                        if (
                            ep1Num.every(Number.isFinite) &&
                            ep2Num.every(Number.isFinite)
                        ) {
                            addSlopeAndLengthInstructions({
                                instructions,
                                globalDependencyValues: g,
                                endpoint1: ep1Num,
                                endpoint2: ep2Num,
                            });
                        }
                    }
                }

                return { success: true, instructions };
            },
        };

        stateVariableDefinitions.haveConstrainedEndpoints = {
            returnDependencies: () => ({
                inStickyGroup: {
                    dependencyType: "stateVariable",
                    variableName: "inStickyGroup",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        haveConstrainedEndpoints:
                            dependencyValues.inStickyGroup,
                    },
                };
            },
        };

        stateVariableDefinitions.endpoints = {
            public: true,
            description: "The endpoints of the line segment.",
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
                returnWrappingComponents(prefix) {
                    if (prefix === "endpointX") {
                        return [];
                    } else {
                        // endpoint or entire array
                        // wrap inner dimension by both <point> and <xs>
                        // don't wrap outer dimension (for entire array)
                        return [
                            [
                                "point",
                                {
                                    componentType: "mathList",
                                    isAttributeNamed: "xs",
                                },
                            ],
                        ];
                    }
                },
            },
            isArray: true,
            numDimensions: 2,
            indexAliases: [[], ["x", "y", "z"]],
            entryPrefixes: ["endpointX", "endpoint"],
            returnEntryDimensions: (prefix) => (prefix === "endpoint" ? 1 : 0),
            hasEssential: true,
            set: convertValueToMathExpression,
            defaultValueByArrayKey: (arrayKey) =>
                me.fromAst(arrayKey === "0,0" ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "endpointX") {
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
                    // endpoint3 is all components of the third point

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
                if (varName === "endpoints") {
                    if (propIndex.length === 1) {
                        return "endpoint" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `endpointX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 8) === "endpoint") {
                    // could be endpoint or endpointX
                    let endpointNum = Number(varName.slice(8));
                    if (Number.isInteger(endpointNum) && endpointNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `endpointX${endpointNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [2, dependencyValues.numDimensions];
            },
            stateVariablesDeterminingDependencies: ["haveConstrainedEndpoints"],
            returnArrayDependenciesByKey({ stateValues, arrayKeys }) {
                let globalDependencies = {
                    haveConstrainedEndpoints: {
                        dependencyType: "stateVariable",
                        variableName: "haveConstrainedEndpoints",
                    },
                };
                let dependenciesByKey = {};
                if (stateValues.haveConstrainedEndpoints) {
                    globalDependencies.unconstrainedEndpoints = {
                        dependencyType: "stateVariable",
                        variableName: "unconstrainedEndpoints",
                    };
                } else {
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding =
                            Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                        dependenciesByKey[arrayKey] = {
                            unconstrainedEndpoint: {
                                dependencyType: "stateVariable",
                                variableName:
                                    "unconstrainedEndpointX" + varEnding,
                            },
                        };
                    }
                }
                return { globalDependencies, dependenciesByKey };
            },
            arrayDefinitionByKey({
                globalDependencyValues,
                dependencyValuesByKey,
                arrayKeys,
                arraySize,
            }) {
                // console.log("array definition of lineSegment endpoints");
                // console.log(dependencyValuesByKey);
                // console.log(globalDependencyValues);
                // console.log(arrayKeys);

                let endpoints = {};

                if (globalDependencyValues.haveConstrainedEndpoints) {
                    let constrainedEndpoints =
                        globalDependencyValues.unconstrainedEndpoints;

                    // TODO: add edge or endpoint constraints?

                    for (let pointInd = 0; pointInd < 2; pointInd++) {
                        for (let dim = 0; dim < arraySize[1]; dim++) {
                            let arrayKey = pointInd + "," + dim;
                            endpoints[arrayKey] =
                                constrainedEndpoints[pointInd][dim];
                        }
                    }
                } else {
                    for (let arrayKey of arrayKeys) {
                        endpoints[arrayKey] =
                            dependencyValuesByKey[
                                arrayKey
                            ].unconstrainedEndpoint;
                    }
                }

                return { setValue: { endpoints } };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                initialChange,
                stateValues,
                workspace,
                arraySize,
            }) {
                // console.log(`inverse array definition of endpoints of linesegment`);
                // console.log(desiredStateVariableValues)
                // console.log(JSON.parse(JSON.stringify(stateValues)))
                // console.log(dependencyValuesByKey);

                let instructions = [];

                if (globalDependencyValues.haveConstrainedEndpoints) {
                    let movedJustOneEndpoint = false;
                    let endpointIndMoved;

                    // We have to accumulate changed endpoints in workspace
                    // as in some cases (such as when moving via an attached point)
                    // the instructions for the components come in separately
                    Object.assign(
                        workspace,
                        desiredStateVariableValues.endpoints,
                    );

                    let nMoved = Object.keys(workspace).length;
                    if (nMoved === 1) {
                        movedJustOneEndpoint = true;
                        endpointIndMoved = Number(
                            Object.keys(workspace)[0].split(",")[0],
                        );
                    } else if (nMoved === 2) {
                        let pointInd1 = Object.keys(workspace)[0].split(",")[0];
                        let pointInd2 = Object.keys(workspace)[1].split(",")[0];
                        if (pointInd1 === pointInd2) {
                            movedJustOneEndpoint = true;
                            endpointIndMoved = Number(pointInd1);
                        }
                    }

                    // go through the constraints so that will set the endpoints
                    // to their constrained values

                    let endpoints = await stateValues.endpoints;
                    let desired_endpoints = [];

                    for (
                        let pointInd = 0;
                        pointInd < arraySize[0];
                        pointInd++
                    ) {
                        let desired_endpoint = [];

                        let original_endpoint = endpoints[pointInd];

                        for (let dim = 0; dim < arraySize[1]; dim++) {
                            let arrayKey = pointInd + "," + dim;
                            if (arrayKey in workspace) {
                                desired_endpoint.push(workspace[arrayKey]);
                            } else {
                                desired_endpoint.push(original_endpoint[dim]);
                            }
                        }
                        desired_endpoints.push(desired_endpoint);
                    }

                    // If moved just one endpoint, allow the shape to distort due to constraints and the segment to rotate.
                    // Otherwise, just shift the line segment due to the constraints
                    let enforceRigid = !movedJustOneEndpoint;
                    let allowRotation = movedJustOneEndpoint;

                    if (await stateValues.inStickyGroup) {
                        let stickyObjectIndex =
                            await stateValues.stickyObjectIndex;
                        let stickyVerticesConstraintFunction =
                            await stateValues.stickyVerticesConstraintFunction;

                        desired_endpoints = stickyVerticesConstraintFunction(
                            {
                                unconstrainedVertices: desired_endpoints,
                                closed: false,
                                enforceRigid,
                                allowRotation,
                                shrinkThreshold: false,
                                vertexIndMoved: endpointIndMoved,
                            },
                            { objectInd: stickyObjectIndex },
                        );
                    }
                    instructions.push({
                        setDependency: "unconstrainedEndpoints",
                        desiredValue: desired_endpoints,
                    });
                } else {
                    // for non-constrained case, we just move the unconstrained endpoints
                    // according to how the endpoints were moved

                    for (let arrayKey in desiredStateVariableValues.endpoints) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey]
                                    .unconstrainedEndpoint,
                            desiredValue:
                                desiredStateVariableValues.endpoints[arrayKey],
                        });
                    }
                }
                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.parallelCoords = {
            returnDependencies: () => ({
                endpoints: {
                    dependencyType: "stateVariable",
                    variableName: "endpoints",
                },
            }),
            definition({ dependencyValues }) {
                let dxTree = [
                    "+",
                    dependencyValues.endpoints[1][0].tree,
                    ["-", dependencyValues.endpoints[0][0].tree],
                ];

                let dyTree = [
                    "+",
                    dependencyValues.endpoints[1][1].tree,
                    ["-", dependencyValues.endpoints[0][1].tree],
                ];

                let parallelCoords = me.fromAst(["vector", dxTree, dyTree]);

                return { setValue: { parallelCoords } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let x = me.fromAst([
                    "+",
                    desiredStateVariableValues.parallelCoords.get_component(0)
                        .tree,
                    dependencyValues.endpoints[0][0].tree,
                ]);

                let y = me.fromAst([
                    "+",
                    desiredStateVariableValues.parallelCoords.get_component(1)
                        .tree,
                    dependencyValues.endpoints[0][1].tree,
                ]);

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "endpoints",
                            desiredValue: { "1,0": x, "1,1": y },
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.length = {
            description:
                "The Euclidean length of the line segment (always non-negative).",
            public: true,
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
                endpoints: {
                    dependencyType: "stateVariable",
                    variableName: "endpoints",
                },
            }),
            definition({ dependencyValues }) {
                let length2 = 0;
                let epoint1 = dependencyValues.endpoints[0];
                let epoint2 = dependencyValues.endpoints[1];
                let all_numeric = true;
                for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
                    let v1 = epoint1[dim].evaluate_to_constant();
                    if (!Number.isFinite(v1)) {
                        all_numeric = false;
                        break;
                    }
                    let v2 = epoint2[dim].evaluate_to_constant();
                    if (!Number.isFinite(v2)) {
                        all_numeric = false;
                        break;
                    }
                    let d = v1 - v2;
                    length2 += d * d;
                }

                if (all_numeric) {
                    return {
                        setValue: { length: me.fromAst(Math.sqrt(length2)) },
                    };
                }

                length2 = ["+"];
                for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
                    length2.push([
                        "^",
                        ["+", epoint1[dim], ["-", epoint2[dim]]],
                        2,
                    ]);
                }

                return {
                    setValue: {
                        length: me.fromAst(["apply", "sqrt", length2]),
                    },
                };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                let midpoint = [];
                let dir = [];
                let epoint1 = dependencyValues.endpoints[0];
                let epoint2 = dependencyValues.endpoints[1];
                let all_numeric = true;
                for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
                    let v1 = epoint1[dim].evaluate_to_constant();
                    if (!Number.isFinite(v1)) {
                        all_numeric = false;
                        break;
                    }
                    let v2 = epoint2[dim].evaluate_to_constant();
                    if (!Number.isFinite(v2)) {
                        all_numeric = false;
                        break;
                    }
                    midpoint.push((v1 + v2) / 2);
                    dir.push(v1 - v2);
                }

                if (!all_numeric) {
                    return { success: false };
                }

                // make dir be unit length
                let dir_length = Math.sqrt(dir.reduce((a, c) => a + c * c, 0));
                dir = dir.map((x) => x / dir_length);

                let desiredLength =
                    desiredStateVariableValues.length.evaluate_to_constant();

                if (!Number.isFinite(desiredLength) || desiredLength < 0) {
                    return { success: false };
                }

                let desiredEndpoint1 = [],
                    desiredEndpoint2 = [];
                let halfDesiredlength = desiredLength / 2;

                for (let dim = 0; dim < dependencyValues.numDimensions; dim++) {
                    desiredEndpoint1.push(
                        me.fromAst(
                            midpoint[dim] + dir[dim] * halfDesiredlength,
                        ),
                    );
                    desiredEndpoint2.push(
                        me.fromAst(
                            midpoint[dim] - dir[dim] * halfDesiredlength,
                        ),
                    );
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "endpoints",
                            desiredValue: [desiredEndpoint1, desiredEndpoint2],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.numericalEndpoints = {
            isArray: true,
            entryPrefixes: ["numericalEndpoint"],
            forRenderer: true,
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                if (Number.isNaN(dependencyValues.numDimensions)) {
                    return [0];
                }
                return [2];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let globalDependencies = {
                    numDimensions: {
                        dependencyType: "stateVariable",
                        variableName: "numDimensions",
                    },
                };
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        endpoint: {
                            dependencyType: "stateVariable",
                            variableName: "endpoint" + (Number(arrayKey) + 1),
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
                if (Number.isNaN(globalDependencyValues.numDimensions)) {
                    return {};
                }

                let numericalEndpoints = {};
                for (let arrayKey of arrayKeys) {
                    let endpoint = dependencyValuesByKey[arrayKey].endpoint;
                    let numericalP = [];
                    for (
                        let ind = 0;
                        ind < globalDependencyValues.numDimensions;
                        ind++
                    ) {
                        let val = endpoint[ind].evaluate_to_constant();
                        numericalP.push(val);
                    }
                    numericalEndpoints[arrayKey] = numericalP;
                }

                return { setValue: { numericalEndpoints } };
            },
        };

        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
                numericalEndpoints: {
                    dependencyType: "stateVariable",
                    variableName: "numericalEndpoints",
                },
            }),
            definition({ dependencyValues }) {
                let A1 = dependencyValues.numericalEndpoints[0][0];
                let A2 = dependencyValues.numericalEndpoints[0][1];
                let B1 = dependencyValues.numericalEndpoints[1][0];
                let B2 = dependencyValues.numericalEndpoints[1][1];

                let haveConstants =
                    Number.isFinite(A1) &&
                    Number.isFinite(A2) &&
                    Number.isFinite(B1) &&
                    Number.isFinite(B2);

                // only implement for
                // - 2D
                // - constant endpoints and
                // - non-degenerate parameters
                let skip =
                    dependencyValues.numDimensions !== 2 ||
                    !haveConstants ||
                    (B1 === A1 && B2 === A2);

                return {
                    setValue: {
                        nearestPoint: function ({ variables, scales }) {
                            if (skip) {
                                return {};
                            }

                            let xscale = scales[0];
                            let yscale = scales[1];

                            let BA1 = (B1 - A1) / xscale;
                            let BA2 = (B2 - A2) / yscale;
                            let denom = BA1 * BA1 + BA2 * BA2;

                            let t =
                                (((variables.x1 - A1) / xscale) * BA1 +
                                    ((variables.x2 - A2) / yscale) * BA2) /
                                denom;

                            let result = {};

                            if (t <= 0) {
                                result = { x1: A1, x2: A2 };
                            } else if (t >= 1) {
                                result = { x1: B1, x2: B2 };
                            } else {
                                result = {
                                    x1: A1 + t * BA1 * xscale,
                                    x2: A2 + t * BA2 * yscale,
                                };
                            }

                            if (variables.x3 !== undefined) {
                                result.x3 = 0;
                            }

                            return result;
                        },
                    },
                };
            },
        };

        stateVariableDefinitions.nearestPointAsLine = {
            returnDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
                numericalEndpoints: {
                    dependencyType: "stateVariable",
                    variableName: "numericalEndpoints",
                },
            }),
            definition({ dependencyValues }) {
                let A1 = dependencyValues.numericalEndpoints[0][0];
                let A2 = dependencyValues.numericalEndpoints[0][1];
                let B1 = dependencyValues.numericalEndpoints[1][0];
                let B2 = dependencyValues.numericalEndpoints[1][1];

                let haveConstants =
                    Number.isFinite(A1) &&
                    Number.isFinite(A2) &&
                    Number.isFinite(B1) &&
                    Number.isFinite(B2);

                // only implement for
                // - 2D
                // - constant endpoints and
                // - non-degenerate parameters
                let skip =
                    dependencyValues.numDimensions !== 2 ||
                    !haveConstants ||
                    (B1 === A1 && B2 === A2);

                return {
                    setValue: {
                        nearestPointAsLine: function ({ variables, scales }) {
                            if (skip) {
                                return {};
                            }

                            let xscale = scales[0];
                            let yscale = scales[1];

                            let BA1 = (B1 - A1) / xscale;
                            let BA2 = (B2 - A2) / yscale;
                            let denom = BA1 * BA1 + BA2 * BA2;

                            let t =
                                (((variables.x1 - A1) / xscale) * BA1 +
                                    ((variables.x2 - A2) / yscale) * BA2) /
                                denom;

                            let result = {
                                x1: A1 + t * BA1 * xscale,
                                x2: A2 + t * BA2 * yscale,
                            };

                            if (variables.x3 !== undefined) {
                                result.x3 = 0;
                            }

                            return result;
                        },
                    },
                };
            },
        };

        stateVariableDefinitions.slope = {
            description:
                "The slope of the line segment in the x-y plane; returns NaN when the segment is not 2D.",
            public: true,
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                endpoints: {
                    dependencyType: "stateVariable",
                    variableName: "endpoints",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.numDimensions !== 2) {
                    return { setValue: { slope: NaN } };
                }

                let ep = dependencyValues.endpoints;
                let A1 = ep[0][0].evaluate_to_constant();
                let A2 = ep[0][1].evaluate_to_constant();
                let B1 = ep[1][0].evaluate_to_constant();
                let B2 = ep[1][1].evaluate_to_constant();
                let slope = (B2 - A2) / (B1 - A1);

                return { setValue: { slope } };
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                // Keep center and length fixed; rotate direction to desired slope.
                // Pick the orientation closest to the current direction.
                if (dependencyValues.numDimensions !== 2) {
                    return { success: false };
                }
                let ep = dependencyValues.endpoints;
                let A1 = ep[0][0].evaluate_to_constant();
                let A2 = ep[0][1].evaluate_to_constant();
                let B1 = ep[1][0].evaluate_to_constant();
                let B2 = ep[1][1].evaluate_to_constant();
                if (
                    !Number.isFinite(A1) ||
                    !Number.isFinite(A2) ||
                    !Number.isFinite(B1) ||
                    !Number.isFinite(B2)
                ) {
                    return { success: false };
                }
                let cx = (A1 + B1) / 2;
                let cy = (A2 + B2) / 2;
                let L = Math.sqrt((B1 - A1) ** 2 + (B2 - A2) ** 2);
                if (L === 0) {
                    return { success: false };
                }

                let m = desiredStateVariableValues.slope;
                // Normalize to a number in case a math expression was passed.
                if (m instanceof me.class) {
                    m = m.evaluate_to_constant();
                }
                if (Number.isNaN(m)) {
                    return { success: false };
                }

                // Compute candidate unit direction from desired slope.
                const direction = directionFromSlope(m);
                if (direction === null) {
                    return { success: false };
                }
                let [dirX, dirY] = direction;

                // Flip if needed to stay closest to current direction.
                let currentDirX = (B1 - A1) / L;
                let currentDirY = (B2 - A2) / L;
                if (currentDirX * dirX + currentDirY * dirY < 0) {
                    dirX = -dirX;
                    dirY = -dirY;
                }

                let half = L / 2;
                let newEp1 = [
                    me.fromAst(cx - half * dirX),
                    me.fromAst(cy - half * dirY),
                ];
                let newEp2 = [
                    me.fromAst(cx + half * dirX),
                    me.fromAst(cy + half * dirY),
                ];

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "endpoints",
                            desiredValue: [newEp1, newEp2],
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.center = {
            description: "The midpoint of the line segment.",
            public: true,
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnNumberDisplayAttributeComponentShadowing(),
                returnWrappingComponents(prefix) {
                    if (prefix === "centerX") {
                        return [];
                    } else {
                        return [
                            [
                                "point",
                                {
                                    componentType: "mathList",
                                    isAttributeNamed: "xs",
                                },
                            ],
                        ];
                    }
                },
            },
            isArray: true,
            numDimensions: 1,
            indexAliases: [["x", "y", "z"]],
            entryPrefixes: ["centerX"],
            returnEntryDimensions: () => 0,
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                let ind = Number(varEnding) - 1;
                if (!Number.isInteger(ind) || ind < 0) {
                    return [];
                }
                if (arraySize) {
                    return ind < arraySize[0] ? [String(ind)] : [];
                }
                return [String(ind)];
            },
            arrayVarNameFromPropIndex(propIndex, varName) {
                if (varName === "center") {
                    return "centerX" + propIndex[0];
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numDimensions];
            },
            returnArrayDependenciesByKey() {
                return {
                    globalDependencies: {
                        endpoints: {
                            dependencyType: "stateVariable",
                            variableName: "endpoints",
                        },
                        numDimensions: {
                            dependencyType: "stateVariable",
                            variableName: "numDimensions",
                        },
                    },
                };
            },
            arrayDefinitionByKey({ globalDependencyValues, arrayKeys }) {
                let center = {};
                let ep1 = globalDependencyValues.endpoints[0];
                let ep2 = globalDependencyValues.endpoints[1];
                for (let arrayKey of arrayKeys) {
                    let dim = Number(arrayKey);
                    let v1 = ep1[dim].evaluate_to_constant();
                    let v2 = ep2[dim].evaluate_to_constant();
                    if (Number.isFinite(v1) && Number.isFinite(v2)) {
                        center[arrayKey] = me.fromAst((v1 + v2) / 2);
                    } else {
                        center[arrayKey] = me.fromAst([
                            "/",
                            ["+", ep1[dim].tree, ep2[dim].tree],
                            2,
                        ]);
                    }
                }
                return { setValue: { center } };
            },
            inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
            }) {
                // Translate both endpoints by delta = desired_center - current_center.
                let ep1 = globalDependencyValues.endpoints[0];
                let ep2 = globalDependencyValues.endpoints[1];
                let numDim = globalDependencyValues.numDimensions;

                let newEp1 = [];
                let newEp2 = [];
                for (let d = 0; d < numDim; d++) {
                    let currentCenter = me.fromAst([
                        "/",
                        ["+", ep1[d].tree, ep2[d].tree],
                        2,
                    ]);
                    let desiredCenter =
                        String(d) in desiredStateVariableValues.center
                            ? convertValueToMathExpression(
                                  desiredStateVariableValues.center[String(d)],
                              )
                            : currentCenter;
                    let delta = me.fromAst([
                        "+",
                        desiredCenter.tree,
                        ["-", currentCenter.tree],
                    ]);
                    newEp1.push(me.fromAst(["+", ep1[d].tree, delta.tree]));
                    newEp2.push(me.fromAst(["+", ep2[d].tree, delta.tree]));
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "endpoints",
                            desiredValue: [newEp1, newEp2],
                        },
                    ],
                };
            },
        };

        return stateVariableDefinitions;
    }

    static adapters = [
        {
            stateVariable: "parallelCoords",
            componentType: "_directionComponent",
            stateVariablesToShadow: Object.keys(
                returnNumberDisplayStateVariableDefinitions(),
            ),
        },
    ];

    async moveLineSegmentSinglePoint({
        coords,
        x,
        y,
        z,
        pointRole,
        transient,
        skippable,
        actionId,
        sourceDetails,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let pointCoords = coords ?? [x, y];
        if (coords === undefined && z !== undefined) {
            pointCoords.push(z);
        }

        if (
            pointCoords.length < 2 ||
            pointCoords.some(
                (coord) => coord !== undefined && !Number.isFinite(coord),
            )
        ) {
            console.warn(
                `Invalid endpoint coordinates for line segment move: ${pointCoords.join(", ")}`,
            );
            return;
        }

        if (pointRole === "endpoint1") {
            return await this.moveLineSegment({
                point1coords: pointCoords,
                transient,
                skippable,
                actionId,
                sourceDetails,
                sourceInformation,
                skipRendererUpdate,
            });
        } else if (pointRole === "endpoint2") {
            return await this.moveLineSegment({
                point2coords: pointCoords,
                transient,
                skippable,
                actionId,
                sourceDetails,
                sourceInformation,
                skipRendererUpdate,
            });
        } else {
            console.warn(`Invalid pointRole for line segment: ${pointRole}`);
            return;
        }
    }

    async moveLineSegment({
        point1coords,
        point2coords,
        transient,
        skippable,
        actionId,
        sourceDetails,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!transient) {
            skippable = false;
        }
        if (point1coords === undefined || point2coords === undefined) {
            // single point dragged
            if (!(await this.stateValues.endpointsDraggable)) {
                return;
            }
        } else {
            // whole line segment dragged
            if (!(await this.stateValues.draggable)) {
                return;
            }
        }

        const numDimensions = await this.stateValues.numDimensions;
        let numericalEndpoints = await this.stateValues.numericalEndpoints;

        if (point1coords !== undefined) {
            point1coords = mergePointCoords(
                point1coords,
                numericalEndpoints[0],
                numDimensions,
            );
        }
        if (point2coords !== undefined) {
            point2coords = mergePointCoords(
                point2coords,
                numericalEndpoints[1],
                numDimensions,
            );
        }

        // When basedOnSlopeOrThrough, ep2 is derived from ep1 + slope/length.
        // A single-endpoint drag on the graph should keep the OTHER endpoint fixed
        // (same intent as Vector's tail+displacement action).
        // We achieve this by passing BOTH desired endpoint positions to performUpdate,
        // so the inverse can compute new slope/length to match.
        // This does NOT affect drags via referenced points (which go through the inverse
        // definition directly and only receive the desired position of the moved endpoint).
        if (await this.stateValues.basedOnSlopeOrThrough) {
            if (point1coords !== undefined && point2coords === undefined) {
                // ep1 dragged: keep ep2 fixed
                point2coords = numericalEndpoints[1];
            } else if (
                point2coords !== undefined &&
                point1coords === undefined
            ) {
                // ep2 dragged: keep ep1 fixed
                point1coords = numericalEndpoints[0];
            }
        }

        let newComponents = {};

        if (point1coords !== undefined) {
            for (let dim = 0; dim < numDimensions; dim++) {
                newComponents[`0,${dim}`] = me.fromAst(point1coords[dim]);
            }
        }
        if (point2coords !== undefined) {
            for (let dim = 0; dim < numDimensions; dim++) {
                newComponents[`1,${dim}`] = me.fromAst(point2coords[dim]);
            }
        }

        // Note: we set skipRendererUpdate to true
        // so that we can make further adjustments before the renderers are updated
        if (transient) {
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        componentIdx: this.componentIdx,
                        updateType: "updateValue",
                        stateVariable: "endpoints",
                        value: newComponents,
                        sourceDetails,
                    },
                ],
                transient: true,
                skippable,
                actionId,
                sourceInformation,
                skipRendererUpdate: true,
            });
        } else {
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        componentIdx: this.componentIdx,
                        updateType: "updateValue",
                        stateVariable: "endpoints",
                        value: newComponents,
                        sourceDetails,
                    },
                ],
                actionId,
                sourceInformation,
                skipRendererUpdate: true,
                event: {
                    verb: "interacted",
                    object: {
                        componentIdx: this.componentIdx,
                        componentType: this.componentType,
                    },
                    result: {
                        point1: point1coords,
                        point2: point2coords,
                    },
                },
            });
        }

        // we will attempt to keep the relationship between the two endpoints fixed
        // when the whole line segment is moved,
        // even if one of the endpoints is constrained.

        // if dragged the whole line segment,
        // address case where only one endpoint is constrained
        // to make line segment just translate in this case
        if (point1coords !== undefined && point2coords !== undefined) {
            let numericalPoints = [point1coords, point2coords];
            let resultingNumericalPoints =
                await this.stateValues.numericalEndpoints;

            let pointsChanged = [];
            let numPointsChanged = 0;

            for (let [ind, pt] of numericalPoints.entries()) {
                if (
                    !pt.every((v, i) => v === resultingNumericalPoints[ind][i])
                ) {
                    pointsChanged.push(ind);
                    numPointsChanged++;
                }
            }

            if (numPointsChanged === 1) {
                // One endpoint was altered from the requested location
                // while the other endpoint stayed at the requested location.
                // We interpret this as one endpoint being constrained and the second one being free
                // and we move the second endpoint to keep their relative position fixed.

                let changedInd = pointsChanged[0];

                let orig1 = numericalPoints[changedInd];
                let changed1 = resultingNumericalPoints[changedInd];
                let changevec1 = orig1.map((v, i) => v - changed1[i]);

                let newNumericalPoints = [];

                for (let i = 0; i < 2; i++) {
                    if (i === changedInd) {
                        newNumericalPoints.push(resultingNumericalPoints[i]);
                    } else {
                        newNumericalPoints.push(
                            numericalPoints[i].map((v, j) => v - changevec1[j]),
                        );
                    }
                }
                let newPointComponents = {};
                for (let ind in newNumericalPoints) {
                    for (let dim = 0; dim < numDimensions; dim++) {
                        newPointComponents[`${ind},${dim}`] = me.fromAst(
                            newNumericalPoints[ind][dim],
                        );
                    }
                }

                let newInstructions = [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "endpoints",
                        value: newPointComponents,
                    },
                ];
                return await this.coreFunctions.performUpdate({
                    updateInstructions: newInstructions,
                    transient,
                    skippable,
                    actionId,
                    sourceInformation,
                    skipRendererUpdate,
                });
            }
        }

        // if no modifications were made, still need to update renderers
        // as original update was performed with skipping renderer update
        return await this.coreFunctions.updateRenderers({
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async lineSegmentClicked({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "click",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async lineSegmentFocused({
        actionId,
        componentIdx,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "focus",
                componentIdx, // use componentIdx rather than this.componentIdx to get original componentIdx if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }
}
