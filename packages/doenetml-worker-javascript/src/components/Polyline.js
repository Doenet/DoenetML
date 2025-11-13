import { convertValueToMathExpression } from "@doenet/utils";
import {
    returnRoundingAttributeComponentShadowing,
    returnRoundingAttributes,
    returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";
import { returnStickyGroupDefinitions } from "../utils/constraints";

export default class Polyline extends GraphicalComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            movePolyline: this.movePolyline.bind(this),
            finalizePolylinePosition: this.finalizePolylinePosition.bind(this),
            reflectPolyline: this.reflectPolyline.bind(this),
            polylineClicked: this.polylineClicked.bind(this),
            polylineFocused: this.polylineFocused.bind(this),
        });
    }
    static componentType = "polyline";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.draggable = {
            createComponentOfType: "boolean",
            createStateVariable: "draggable",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.verticesDraggable = {
            createComponentOfType: "boolean",
        };

        attributes.vertices = {
            createComponentOfType: "pointList",
        };

        attributes.showCoordsWhenDragging = {
            createComponentOfType: "boolean",
            createStateVariable: "showCoordsWhenDragging",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.rigid = {
            createComponentOfType: "boolean",
            createStateVariable: "rigid",
            defaultValue: false,
            public: true,
        };

        attributes.preserveSimilarity = {
            createComponentOfType: "boolean",
        };

        // Vertices displayed for rotations when rigid/preserveSimilarity.
        // Entries that don't correspond to vertex indices are ignored.
        // If no entries match a vertex, then all vertices are used
        attributes.rotationHandleVertices = {
            createComponentOfType: "numberList",
            createStateVariable: "rotationHandleVertices",
            defaultValue: [1],
        };

        attributes.rotateAround = {
            createComponentOfType: "text",
            createStateVariable: "rotateAround",
            validValues: ["centroid", "vertex", "point"],
            defaultValue: "centroid",
        };

        attributes.rotationCenter = {
            createComponentOfType: "point",
            createStateVariable: "rotationCenterPrescribed",
            defaultValue: null,
        };

        attributes.rotationVertex = {
            createComponentOfType: "integer",
            createStateVariable: "rotationVertex",
            defaultValue: 1,
        };

        attributes.allowRotation = {
            createComponentOfType: "boolean",
            createStateVariable: "allowRotation",
            defaultValue: true,
            public: true,
        };

        attributes.allowTranslation = {
            createComponentOfType: "boolean",
            createStateVariable: "allowTranslation",
            defaultValue: true,
            public: true,
        };

        attributes.allowDilation = {
            createComponentOfType: "boolean",
        };

        attributes.minShrink = {
            createComponentOfType: "number",
            createStateVariable: "minShrink",
            defaultValue: 0.1,
        };

        attributes.allowReflection = {
            createComponentOfType: "boolean",
            createStateVariable: "allowReflection",
            defaultValue: true,
            public: true,
        };

        Object.assign(attributes, returnRoundingAttributes());

        return attributes;
    }

    static returnChildGroups() {
        let groups = super.returnChildGroups();
        // groups.push({
        //     group: "vertexConstraints",
        //     componentTypes: ["vertexConstraints"],
        // });
        // groups.push({
        //     group: "edgeConstraints",
        //     componentTypes: ["edgeConstraints"],
        // });

        return groups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnRoundingStateVariableDefinitions(),
        );

        Object.assign(stateVariableDefinitions, returnStickyGroupDefinitions());

        stateVariableDefinitions.styleDescription = {
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
                    dependencyValues.styleDescription + " polyline";

                return { setValue: { styleDescriptionWithNoun } };
            },
        };

        stateVariableDefinitions.preserveSimilarity = {
            public: true,
            hasEssential: true,
            defaultValue: false,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                preserveSimilarityAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "preserveSimilarity",
                    variableNames: ["value"],
                },
                rigid: {
                    dependencyType: "stateVariable",
                    variableName: "rigid",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.rigid) {
                    return { setValue: { preserveSimilarity: true } };
                }

                if (dependencyValues.preserveSimilarityAttr !== null) {
                    return {
                        setValue: {
                            preserveSimilarity:
                                dependencyValues.preserveSimilarityAttr
                                    .stateValues.value,
                        },
                    };
                }

                return {
                    useEssentialOrDefaultValue: { preserveSimilarity: true },
                };
            },
        };

        stateVariableDefinitions.allowDilation = {
            public: true,
            hasEssential: true,
            defaultValue: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                allowDilationAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "allowDilation",
                    variableNames: ["value"],
                },
                rigid: {
                    dependencyType: "stateVariable",
                    variableName: "rigid",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.rigid) {
                    return { setValue: { allowDilation: false } };
                }

                if (dependencyValues.allowDilationAttr !== null) {
                    return {
                        setValue: {
                            allowDilation:
                                dependencyValues.allowDilationAttr.stateValues
                                    .value,
                        },
                    };
                }

                return { useEssentialOrDefaultValue: { allowDilation: true } };
            },
        };

        stateVariableDefinitions.verticesDraggable = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            hasEssential: true,
            forRenderer: true,
            returnDependencies: () => ({
                verticesDraggableAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "verticesDraggable",
                    variableNames: ["value"],
                },
                draggable: {
                    dependencyType: "stateVariable",
                    variableName: "draggable",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.verticesDraggableAttr) {
                    return {
                        setValue: {
                            verticesDraggable:
                                dependencyValues.verticesDraggableAttr
                                    .stateValues.value,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: {
                            verticesDraggable: {
                                defaultValue: dependencyValues.draggable,
                            },
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.vertexIndicesDraggable = {
            forRenderer: true,
            returnDependencies: () => ({
                verticesDraggable: {
                    dependencyType: "stateVariable",
                    variableName: "verticesDraggable",
                },
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
                rigid: {
                    dependencyType: "stateVariable",
                    variableName: "rigid",
                },
                preserveSimilarity: {
                    dependencyType: "stateVariable",
                    variableName: "preserveSimilarity",
                },
                rotationHandleVertices: {
                    dependencyType: "stateVariable",
                    variableName: "rotationHandleVertices",
                },
                rotateAround: {
                    dependencyType: "stateVariable",
                    variableName: "rotateAround",
                },
                rotationVertex: {
                    dependencyType: "stateVariable",
                    variableName: "rotationVertex",
                },
            }),
            definition({ dependencyValues }) {
                let vertexIndicesDraggable = [];

                if (dependencyValues.verticesDraggable) {
                    if (
                        dependencyValues.rigid ||
                        dependencyValues.preserveSimilarity
                    ) {
                        let rotationVertex =
                            dependencyValues.rotateAround === "vertex"
                                ? dependencyValues.rotationVertex
                                : null;
                        for (let vertexNum of dependencyValues.rotationHandleVertices) {
                            if (
                                Number.isInteger(vertexNum) &&
                                vertexNum > 0 &&
                                vertexNum <= dependencyValues.numVertices &&
                                vertexNum !== rotationVertex
                            ) {
                                vertexIndicesDraggable.push(vertexNum - 1);
                            }
                        }

                        if (vertexIndicesDraggable.length === 0) {
                            vertexIndicesDraggable = [
                                ...Array(dependencyValues.numVertices).keys(),
                            ].filter((x) => x !== rotationVertex - 1);
                        }
                    } else {
                        vertexIndicesDraggable = [
                            ...Array(dependencyValues.numVertices).keys(),
                        ];
                    }
                }
                return { setValue: { vertexIndicesDraggable } };
            },
        };

        stateVariableDefinitions.numVertices = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            forRenderer: true,
            returnDependencies: () => ({
                vertices: {
                    dependencyType: "attributeComponent",
                    attributeName: "vertices",
                    variableNames: ["numPoints"],
                },
            }),
            definition: function ({ dependencyValues }) {
                if (dependencyValues.vertices !== null) {
                    return {
                        setValue: {
                            numVertices:
                                dependencyValues.vertices.stateValues.numPoints,
                        },
                    };
                } else {
                    return { setValue: { numVertices: 0 } };
                }
            },
        };

        stateVariableDefinitions.numDimensions = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            returnDependencies() {
                return {
                    vertices: {
                        dependencyType: "attributeComponent",
                        attributeName: "vertices",
                        variableNames: ["numDimensions"],
                    },
                };
            },
            definition: function ({ dependencyValues }) {
                if (dependencyValues.vertices !== null) {
                    let numDimensions =
                        dependencyValues.vertices.stateValues.numDimensions;
                    return {
                        setValue: { numDimensions: Math.max(2, numDimensions) },
                        checkForActualChange: { numDimensions: true },
                    };
                } else {
                    // polyline through zero vertices
                    return { setValue: { numDimensions: 2 } };
                }
            },
        };

        // Variable to store the desired value when inverting unconstrainedVertices.
        // Used in movePolygon to detect if constraints changed a value.
        stateVariableDefinitions.desiredUnconstrainedVertices = {
            isArray: true,
            numDimensions: 2,
            hasEssential: true,
            doNotShadowEssential: true,
            entryPrefixes: [
                "desiredUnconstrainedVertexX",
                "desiredUnconstrainedVertex",
            ],
            defaultValueByArrayKey: () => null,
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "desiredUnconstrainedVertexX") {
                    // vertexX1_2 is the 2nd component of the first vertex
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
                    // vertex3 is all components of the third vertex

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
            returnArraySizeDependencies: () => ({
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numVertices,
                    dependencyValues.numDimensions,
                ];
            },
            returnArrayDependenciesByKey() {
                return { dependenciesByKey: {} };
            },
            arrayDefinitionByKey({ arrayKeys }) {
                let useEssential = {};

                for (let arrayKey of arrayKeys) {
                    useEssential[arrayKey] = true;
                }

                return {
                    useEssentialOrDefaultValue: {
                        desiredUnconstrainedVertices: useEssential,
                    },
                };
            },
            async inverseArrayDefinitionByKey({ desiredStateVariableValues }) {
                let essentialVertices = {};

                for (let arrayKey in desiredStateVariableValues.desiredUnconstrainedVertices) {
                    essentialVertices[arrayKey] =
                        desiredStateVariableValues.desiredUnconstrainedVertices[
                            arrayKey
                        ];
                }

                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "desiredUnconstrainedVertices",
                            value: essentialVertices,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.unconstrainedVertices = {
            isLocation: true,
            isArray: true,
            numDimensions: 2,
            entryPrefixes: ["unconstrainedVertexX", "unconstrainedVertex"],
            returnEntryDimensions: (prefix) =>
                prefix === "unconstrainedVertex" ? 1 : 0,
            set: (x) => (x === null ? null : convertValueToMathExpression(x)),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "unconstrainedVertexX") {
                    // vertexX1_2 is the 2nd component of the first vertex
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
                    // vertex3 is all components of the third vertex

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
            getAllArrayKeys(arraySize, flatten = true, desiredSize) {
                function getAllArrayKeysSub(subArraySize) {
                    if (subArraySize.length === 1) {
                        // array of numbers from 0 to subArraySize[0], cast to strings
                        return Array.from(Array(subArraySize[0]), (_, i) =>
                            String(i),
                        );
                    } else {
                        let currentSize = subArraySize[0];
                        let subSubKeys = getAllArrayKeysSub(
                            subArraySize.slice(1),
                        );
                        let subKeys = [];
                        for (let ind = 0; ind < currentSize; ind++) {
                            if (flatten) {
                                subKeys.push(
                                    ...subSubKeys.map((x) => ind + "," + x),
                                );
                            } else {
                                subKeys.push(
                                    subSubKeys.map((x) => ind + "," + x),
                                );
                            }
                        }
                        return subKeys;
                    }
                }

                if (desiredSize) {
                    // if have desired size, then assume specify size after wrapping components
                    // I.e., use actual array size, with first component
                    // replaced with desired size
                    if (desiredSize.length === 0 || !arraySize) {
                        return [];
                    } else {
                        let desiredSizeOfWholeArray = [...arraySize];
                        desiredSizeOfWholeArray[0] = desiredSize[0];
                        return getAllArrayKeysSub(desiredSizeOfWholeArray);
                    }
                } else if (!arraySize || arraySize.length === 0) {
                    return [];
                } else {
                    return getAllArrayKeysSub(arraySize);
                }
            },
            arrayVarNameFromPropIndex(propIndex, varName) {
                if (varName === "unconstrainedVertices") {
                    if (propIndex.length === 1) {
                        return "unconstrainedVertex" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `unconstrainedVertexX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 19) === "unconstrainedVertex") {
                    // could be vertex or vertexX
                    let vertexNum = Number(varName.slice(19));
                    if (Number.isInteger(vertexNum) && vertexNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `unconstrainedVertexX${vertexNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numVertices,
                    dependencyValues.numDimensions,
                ];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};
                for (let arrayKey of arrayKeys) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let varEnding =
                        Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                    dependenciesByKey[arrayKey] = {
                        vertices: {
                            dependencyType: "attributeComponent",
                            attributeName: "vertices",
                            variableNames: ["pointX" + varEnding],
                        },
                        // just for inverse definition
                        desiredUnconstrainedVertices: {
                            dependencyType: "stateVariable",
                            variableName:
                                "desiredUnconstrainedVertexX" + varEnding,
                        },
                    };
                }
                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                // console.log('array definition of polyline unconstrainedVertices');
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)))
                // console.log(arrayKeys);

                let unconstrainedVertices = {};

                for (let arrayKey of arrayKeys) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let varEnding =
                        Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                    let verticesAttr = dependencyValuesByKey[arrayKey].vertices;
                    if (
                        verticesAttr !== null &&
                        verticesAttr.stateValues["pointX" + varEnding]
                    ) {
                        unconstrainedVertices[arrayKey] =
                            verticesAttr.stateValues["pointX" + varEnding];
                    } else {
                        unconstrainedVertices[arrayKey] = me.fromAst("\uff3f");
                    }
                }

                return { setValue: { unconstrainedVertices } };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                initialChange,
                stateValues,
            }) {
                // console.log(`inverseArrayDefinition of unconstrainedVertices of polyline`);
                // console.log(desiredStateVariableValues)
                // console.log(JSON.parse(JSON.stringify(stateValues)))
                // console.log(dependencyValuesByKey);

                let instructions = [];

                for (let arrayKey in desiredStateVariableValues.unconstrainedVertices) {
                    let [pointInd, dim] = arrayKey.split(",");
                    let varEnding =
                        Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                    if (
                        dependencyValuesByKey[arrayKey].vertices !== null &&
                        dependencyValuesByKey[arrayKey].vertices.stateValues[
                            "pointX" + varEnding
                        ]
                    ) {
                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey].vertices,
                            desiredValue:
                                desiredStateVariableValues
                                    .unconstrainedVertices[arrayKey],
                            variableIndex: 0,
                        });

                        instructions.push({
                            setDependency:
                                dependencyNamesByKey[arrayKey]
                                    .desiredUnconstrainedVertices,
                            desiredValue:
                                desiredStateVariableValues
                                    .unconstrainedVertices[arrayKey],
                        });
                    } else {
                        return { success: false };
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.haveConstrainedVertices = {
            returnDependencies: () => ({
                // vertexConstraintsChild: {
                //     dependencyType: "child",
                //     childGroups: ["vertexConstraints"],
                // },
                // edgeConstraintsChild: {
                //     dependencyType: "child",
                //     childGroups: ["edgeConstraints"],
                // },
                inStickyGroup: {
                    dependencyType: "stateVariable",
                    variableName: "inStickyGroup",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        haveConstrainedVertices:
                            // dependencyValues.vertexConstraintsChild.length >
                            //     0 ||
                            // dependencyValues.edgeConstraintsChild.length > 0 ||
                            dependencyValues.inStickyGroup,
                    },
                };
            },
        };

        stateVariableDefinitions.vertices = {
            public: true,
            isLocation: true,
            shadowingInstructions: {
                createComponentOfType: "math",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
                returnWrappingComponents(prefix) {
                    if (prefix === "vertexX") {
                        return [];
                    } else {
                        // vertex or entire array
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
            entryPrefixes: ["vertexX", "vertex"],
            returnEntryDimensions: (prefix) => (prefix === "vertex" ? 1 : 0),
            getArrayKeysFromVarName({
                arrayEntryPrefix,
                varEnding,
                arraySize,
            }) {
                if (arrayEntryPrefix === "vertexX") {
                    // vertexX1_2 is the 2nd component of the first vertex
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
                    // vertex3 is all components of the third vertex

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
            getAllArrayKeys(arraySize, flatten = true, desiredSize) {
                function getAllArrayKeysSub(subArraySize) {
                    if (subArraySize.length === 1) {
                        // array of numbers from 0 to subArraySize[0], cast to strings
                        return Array.from(Array(subArraySize[0]), (_, i) =>
                            String(i),
                        );
                    } else {
                        let currentSize = subArraySize[0];
                        let subSubKeys = getAllArrayKeysSub(
                            subArraySize.slice(1),
                        );
                        let subKeys = [];
                        for (let ind = 0; ind < currentSize; ind++) {
                            if (flatten) {
                                subKeys.push(
                                    ...subSubKeys.map((x) => ind + "," + x),
                                );
                            } else {
                                subKeys.push(
                                    subSubKeys.map((x) => ind + "," + x),
                                );
                            }
                        }
                        return subKeys;
                    }
                }

                if (desiredSize) {
                    // if have desired size, then assume specify size after wrapping components
                    // I.e., use actual array size, with first component
                    // replaced with desired size
                    if (desiredSize.length === 0 || !arraySize) {
                        return [];
                    } else {
                        let desiredSizeOfWholeArray = [...arraySize];
                        desiredSizeOfWholeArray[0] = desiredSize[0];
                        return getAllArrayKeysSub(desiredSizeOfWholeArray);
                    }
                } else if (!arraySize || arraySize.length === 0) {
                    return [];
                } else {
                    return getAllArrayKeysSub(arraySize);
                }
            },
            arrayVarNameFromPropIndex(propIndex, varName) {
                if (varName === "vertices") {
                    if (propIndex.length === 1) {
                        return "vertex" + propIndex[0];
                    } else {
                        // if propIndex has additional entries, ignore them
                        return `vertexX${propIndex[0]}_${propIndex[1]}`;
                    }
                }
                if (varName.slice(0, 6) === "vertex") {
                    // could be vertex or vertexX
                    let vertexNum = Number(varName.slice(6));
                    if (Number.isInteger(vertexNum) && vertexNum > 0) {
                        // if propIndex has additional entries, ignore them
                        return `vertexX${vertexNum}_${propIndex[0]}`;
                    }
                }
                return null;
            },
            returnArraySizeDependencies: () => ({
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [
                    dependencyValues.numVertices,
                    dependencyValues.numDimensions,
                ];
            },
            stateVariablesDeterminingDependencies: [
                "preserveSimilarity",
                "haveConstrainedVertices",
            ],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let globalDependencies = {
                    preserveSimilarity: {
                        dependencyType: "stateVariable",
                        variableName: "preserveSimilarity",
                    },
                    closed: {
                        dependencyType: "stateVariable",
                        variableName: "closed",
                    },
                    haveConstrainedVertices: {
                        dependencyType: "stateVariable",
                        variableName: "haveConstrainedVertices",
                    },
                    // used only in the inverse definition
                    rotationReferenceMapping: {
                        dependencyType: "stateVariable",
                        variableName: "rotationReferenceMapping",
                    },
                };
                let dependenciesByKey = {};
                if (
                    stateValues.haveConstrainedVertices ||
                    stateValues.preserveSimilarity
                ) {
                    globalDependencies.unconstrainedVertices = {
                        dependencyType: "stateVariable",
                        variableName: "unconstrainedVertices",
                    };
                    // globalDependencies.vertexConstraintsChild = {
                    //     dependencyType: "child",
                    //     childGroups: ["vertexConstraints"],
                    //     variableNames: ["constraintFunction"],
                    // };
                    // globalDependencies.edgeConstraintsChild = {
                    //     dependencyType: "child",
                    //     childGroups: ["edgeConstraints"],
                    //     variableNames: ["constraintFunction"],
                    // };
                } else {
                    for (let arrayKey of arrayKeys) {
                        let [pointInd, dim] = arrayKey.split(",");
                        let varEnding =
                            Number(pointInd) + 1 + "_" + (Number(dim) + 1);

                        dependenciesByKey[arrayKey] = {
                            unconstrainedVertex: {
                                dependencyType: "stateVariable",
                                variableName:
                                    "unconstrainedVertexX" + varEnding,
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
                // console.log("array definition of polyline vertices");
                // console.log(JSON.parse(JSON.stringify(globalDependencyValues)));
                // console.log(JSON.parse(JSON.stringify(dependencyValuesByKey)));
                // console.log(arrayKeys);
                // console.log(arraySize);

                let vertices = {};

                if (globalDependencyValues.haveConstrainedVertices) {
                    let constrainedVertices =
                        globalDependencyValues.unconstrainedVertices;

                    // if (
                    //     globalDependencyValues.edgeConstraintsChild.length > 0
                    // ) {
                    //     constrainedVertices =
                    //         globalDependencyValues.edgeConstraintsChild[0].stateValues.constraintFunction(
                    //             {
                    //                 unconstrainedVertices: constrainedVertices,
                    //                 closed: globalDependencyValues.closed,
                    //                 enforceRigid: true,
                    //                 allowRotation: false,
                    //             },
                    //         );
                    // }
                    // if (
                    //     globalDependencyValues.vertexConstraintsChild.length > 0
                    // ) {
                    //     constrainedVertices =
                    //         globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                    //             constrainedVertices,
                    //             true,
                    //         );
                    // }

                    for (
                        let pointInd = 0;
                        pointInd < arraySize[0];
                        pointInd++
                    ) {
                        for (let dim = 0; dim < arraySize[1]; dim++) {
                            let arrayKey = pointInd + "," + dim;
                            vertices[arrayKey] =
                                constrainedVertices[pointInd][dim];
                        }
                    }
                } else if (globalDependencyValues.preserveSimilarity) {
                    // No constraints, so just give the unconstrained vertices.
                    // Since we preserve similarity, use global dependency values
                    for (
                        let pointInd = 0;
                        pointInd < arraySize[0];
                        pointInd++
                    ) {
                        for (let dim = 0; dim < arraySize[1]; dim++) {
                            let arrayKey = pointInd + "," + dim;
                            vertices[arrayKey] =
                                globalDependencyValues.unconstrainedVertices[
                                    pointInd
                                ][dim];
                        }
                    }
                } else {
                    // if we don't have constrainedVertices and not preserveSimilarity
                    // just copy the unconstrained vertices from the dependency values by key
                    for (let arrayKey of arrayKeys) {
                        vertices[arrayKey] =
                            dependencyValuesByKey[arrayKey].unconstrainedVertex;
                    }
                }

                return { setValue: { vertices } };
            },
            async inverseArrayDefinitionByKey({
                desiredStateVariableValues,
                globalDependencyValues,
                dependencyValuesByKey,
                dependencyNamesByKey,
                initialChange,
                stateValues,
                arraySize,
                workspace,
                overrides,
            }) {
                // console.log(`inverseArrayDefinition of vertices of polyline`);
                // console.log(desiredStateVariableValues);
                // console.log(globalDependencyValues);

                let instructions = [];

                let movedJustOneVertex = false;
                let vertexIndMoved;

                // We have to accumulate changed vertices in workspace
                // as in some cases (such as when moving via an attached point)
                // the instructions for the components come in separately
                Object.assign(workspace, desiredStateVariableValues.vertices);

                let nMoved = Object.keys(workspace).length;
                if (nMoved === 1) {
                    movedJustOneVertex = true;
                    vertexIndMoved = Number(
                        Object.keys(workspace)[0].split(",")[0],
                    );
                } else if (nMoved === 2) {
                    let pointInd1 = Object.keys(workspace)[0].split(",")[0];
                    let pointInd2 = Object.keys(workspace)[1].split(",")[0];
                    if (pointInd1 === pointInd2) {
                        movedJustOneVertex = true;
                        vertexIndMoved = Number(pointInd1);
                    }
                }

                if (globalDependencyValues.preserveSimilarity) {
                    if (arraySize[1] !== 2) {
                        console.error(
                            "Moving a rigid/preserveSimilarity polyline in inverse direction not implemented in other than 2D",
                        );
                        return { success: false };
                    }

                    let allowRotation =
                        movedJustOneVertex && (await stateValues.allowRotation);
                    let allowDilation =
                        movedJustOneVertex && (await stateValues.allowDilation);
                    let allowTranslation = await stateValues.allowTranslation;

                    let rotateOrDilate = allowRotation || allowDilation;

                    const isReflection = Boolean(overrides?.isReflection);

                    if (!(rotateOrDilate || allowTranslation || isReflection)) {
                        // Since preserve similarity,
                        // there are no changes possible if don't allow reflection, rotation, dilation or translation
                        return { success: false };
                    }

                    if (isReflection) {
                        let desired_vertices = [];

                        for (
                            let pointInd = 0;
                            pointInd < arraySize[0];
                            pointInd++
                        ) {
                            desired_vertices.push([]);

                            for (let dim = 0; dim < arraySize[1]; dim++) {
                                desired_vertices[pointInd].push(
                                    convertValueToMathExpression(
                                        workspace[`${pointInd},${dim}`],
                                    ),
                                );
                            }
                        }

                        if (globalDependencyValues.haveConstrainedVertices) {
                            if (await stateValues.inStickyGroup) {
                                let stickyObjectIndex =
                                    await stateValues.stickyObjectIndex;
                                let stickyVerticesConstraintFunction =
                                    await stateValues.stickyVerticesConstraintFunction;

                                desired_vertices =
                                    stickyVerticesConstraintFunction(
                                        {
                                            unconstrainedVertices:
                                                desired_vertices,
                                            closed: globalDependencyValues.closed,
                                            enforceRigid: true,
                                            allowRotation: false,
                                            shrinkThreshold: false,
                                        },
                                        { objectInd: stickyObjectIndex },
                                    );
                            }
                        }

                        instructions.push({
                            setDependency: "unconstrainedVertices",
                            desiredValue: desired_vertices,
                        });
                    } else if (rotateOrDilate) {
                        // we keep the rotation point fixed and rotate and/or dilate around the rotation point

                        // Note: we need to use the rotation point and vertices that are unaffected by the constraints.
                        // Otherwise, the rotation point will move around when rotating through a constraint,
                        // causing strange behavior.
                        // The downside is that a rotation starting in a constrained configuration
                        // may translate when the constraint is released.

                        let numericalCentroidUnconstrained =
                            await stateValues.numericalCentroidUnconstrained;
                        let rotationReferenceMapping =
                            globalDependencyValues.rotationReferenceMapping;

                        // We use rotationReferenceMapping to attempt to find the centroid/vertices
                        // from before any shift due to constraints.
                        let referenceCentroid;
                        let referenceVertices;
                        if (
                            Array.isArray(rotationReferenceMapping[0]) &&
                            rotationReferenceMapping[0][0] ===
                                numericalCentroidUnconstrained[0] &&
                            rotationReferenceMapping[0][1] ===
                                numericalCentroidUnconstrained[1]
                        ) {
                            // The numerical centroid is still the same as it was when created rotationReferenceMapping.
                            // Therefore use the centroid and vertices from the mapping
                            // (which would be the values before any shift due to a constraint)
                            referenceCentroid = rotationReferenceMapping[1];
                            referenceVertices = rotationReferenceMapping[2];
                        } else {
                            referenceCentroid = numericalCentroidUnconstrained;
                            referenceVertices =
                                globalDependencyValues.unconstrainedVertices.map(
                                    (v) =>
                                        v.map((c) => c.evaluate_to_constant()),
                                );
                        }

                        // Find the rotation point based on the referenceVertices and referenceCentroid.
                        // Calculation is based on the value of rotateAround
                        // - rotateAround is "vertex": if rotationVertex-1 is an index of referenceVertices,
                        //   then use the corresponding vertex from referenceVertices as the rotation point,
                        //   otherwise fall back to referenceCentroid
                        // - rotationAround is "point": rotate around the point defined by `rotationCenterPrescribed`,
                        //   falling back to the referenceCentroid if the point is not a valid point
                        // - rotationAround is "centroid": use referenceCentroid
                        let rotateAround = await stateValues.rotateAround;
                        let rotationPoint;
                        if (rotateAround === "vertex") {
                            let rotationVertex =
                                await stateValues.rotationVertex;
                            rotationPoint =
                                referenceVertices[rotationVertex - 1];

                            if (!rotationPoint) {
                                rotationPoint = referenceCentroid;
                            }
                        } else if (rotateAround === "point") {
                            let rotationCenter =
                                await stateValues.rotationCenterPrescribed;
                            if (
                                rotationCenter &&
                                ["vector", "tuple"].includes(
                                    rotationCenter.tree[0],
                                ) &&
                                rotationCenter.tree.length === 3
                            ) {
                                rotationPoint = [
                                    rotationCenter
                                        .get_component(0)
                                        .evaluate_to_constant(),
                                    rotationCenter
                                        .get_component(1)
                                        .evaluate_to_constant(),
                                ];

                                if (
                                    !rotationPoint.every((v) =>
                                        Number.isFinite(v),
                                    )
                                ) {
                                    rotationPoint = referenceCentroid;
                                }
                            } else {
                                rotationPoint = referenceCentroid;
                            }
                        } else {
                            rotationPoint = referenceCentroid;
                        }

                        let [pointInd1, dim1] =
                            Object.keys(workspace)[0].split(",");

                        let original_vertex = referenceVertices[pointInd1];

                        let moved_vertex = [...original_vertex];
                        for (let arrayKey in workspace) {
                            let moved_x = convertValueToMathExpression(
                                workspace[arrayKey],
                            ).evaluate_to_constant();
                            if (!Number.isFinite(moved_x)) {
                                return { success: false };
                            }

                            let dim = arrayKey.split(",")[1];
                            moved_vertex[dim] = moved_x;
                        }

                        let moved_rel = [
                            moved_vertex[0] - rotationPoint[0],
                            moved_vertex[1] - rotationPoint[1],
                        ];
                        let orig_rel = [
                            original_vertex[0] - rotationPoint[0],
                            original_vertex[1] - rotationPoint[1],
                        ];

                        let orig_mag2;

                        if (allowDilation) {
                            orig_mag2 = orig_rel[0] ** 2 + orig_rel[1] ** 2;
                        }

                        let desired_vertices = [];

                        if (allowRotation) {
                            let theta =
                                Math.atan2(moved_rel[1], moved_rel[0]) -
                                Math.atan2(orig_rel[1], orig_rel[0]);

                            let stretchFactor = 1;

                            if (allowDilation) {
                                stretchFactor = Math.sqrt(
                                    (moved_rel[0] ** 2 + moved_rel[1] ** 2) /
                                        orig_mag2,
                                );
                            }

                            let c_sin_theta = stretchFactor * Math.sin(theta);
                            let c_cos_theta = stretchFactor * Math.cos(theta);

                            // rotate all vertices by theta around centroid,
                            // possibly stretching by stretch factor

                            for (
                                let pointInd = 0;
                                pointInd < arraySize[0];
                                pointInd++
                            ) {
                                desired_vertices.push([]);

                                let original_vertex =
                                    referenceVertices[pointInd];
                                let orig_rel = [
                                    original_vertex[0] - rotationPoint[0],
                                    original_vertex[1] - rotationPoint[1],
                                ];
                                let rot_rel = [
                                    c_cos_theta * orig_rel[0] -
                                        c_sin_theta * orig_rel[1],
                                    c_sin_theta * orig_rel[0] +
                                        c_cos_theta * orig_rel[1],
                                ];

                                for (let dim = 0; dim < arraySize[1]; dim++) {
                                    desired_vertices[pointInd].push(
                                        me.fromAst(
                                            rot_rel[dim] + rotationPoint[dim],
                                        ),
                                    );
                                }
                            }
                        } else {
                            // project moved_rel onto orig_rel
                            let dot_prod =
                                moved_rel[0] * orig_rel[0] +
                                moved_rel[1] * orig_rel[1];

                            let orig_mag = Math.sqrt(orig_mag2);

                            let minShrink = await stateValues.minShrink;
                            let factor;

                            if (orig_mag === 0) {
                                factor = 1;
                            } else if (!(dot_prod >= minShrink * orig_mag)) {
                                // don't allow it to shrink so that the distance between dragged vertex and rotation point
                                // drops below minShrink
                                factor = minShrink / orig_mag;
                            } else {
                                factor = dot_prod / orig_mag2;
                            }

                            for (
                                let pointInd = 0;
                                pointInd < arraySize[0];
                                pointInd++
                            ) {
                                let dilated = referenceVertices[pointInd].map(
                                    (x, i) =>
                                        me.fromAst(
                                            (x - rotationPoint[i]) * factor +
                                                rotationPoint[i],
                                        ),
                                );

                                desired_vertices.push(dilated);
                            }
                        }

                        if (globalDependencyValues.haveConstrainedVertices) {
                            // if (
                            //     globalDependencyValues.edgeConstraintsChild
                            //         .length > 0
                            // ) {
                            //     desired_vertices =
                            //         globalDependencyValues.edgeConstraintsChild[0].stateValues.constraintFunction(
                            //             {
                            //                 unconstrainedVertices:
                            //                     desired_vertices,
                            //                 closed: globalDependencyValues.closed,
                            //                 enforceRigid: true,
                            //                 allowRotation,
                            //             },
                            //         );
                            // }
                            // if (
                            //     globalDependencyValues.vertexConstraintsChild
                            //         .length > 0
                            // ) {
                            //     desired_vertices =
                            //         globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                            //             desired_vertices,
                            //             true,
                            //         );
                            // }

                            if (await stateValues.inStickyGroup) {
                                let stickyObjectIndex =
                                    await stateValues.stickyObjectIndex;
                                let stickyVerticesConstraintFunction =
                                    await stateValues.stickyVerticesConstraintFunction;

                                desired_vertices =
                                    stickyVerticesConstraintFunction(
                                        {
                                            unconstrainedVertices:
                                                desired_vertices,
                                            closed: globalDependencyValues.closed,
                                            enforceRigid: true,
                                            allowRotation,
                                            shrinkThreshold: true,
                                            rotationPoint,
                                        },
                                        { objectInd: stickyObjectIndex },
                                    );
                            }

                            let constrainedCentroid =
                                calculateNumericalCentroid(desired_vertices);

                            // we record the mapping from the newly constrained centroid
                            // onto the centroid and vertices that existed before the constraints were applied
                            instructions.push({
                                setDependency: "rotationReferenceMapping",
                                desiredValue: [
                                    constrainedCentroid,
                                    referenceCentroid,
                                    referenceVertices,
                                ],
                            });
                        }
                        instructions.push({
                            setDependency: "unconstrainedVertices",
                            desiredValue: desired_vertices,
                        });
                    } else {
                        // If not rotate or dilate, then translate whole polygon
                        // by the smallest movement in x and in y
                        let min_dx = Infinity;
                        let min_dy = Infinity;

                        // Note: here we're using the (constrained) numericalVertices,
                        // unlike the case of rotating around one point,
                        // as the distinction doesn't matter in this case
                        let numericalVertices =
                            await stateValues.numericalVertices;

                        for (let arrayKey in workspace) {
                            let [pointInd, dim] = arrayKey.split(",");

                            let moved_val = convertValueToMathExpression(
                                workspace[arrayKey],
                            ).evaluate_to_constant();
                            let d =
                                moved_val - numericalVertices[pointInd][dim];

                            if (dim === "0") {
                                if (Math.abs(d) < Math.abs(min_dx)) {
                                    min_dx = d;
                                }
                            } else if (Math.abs(d) < Math.abs(min_dy)) {
                                min_dy = d;
                            }
                        }

                        if (min_dx === Infinity) {
                            min_dx = 0;
                        }
                        if (min_dy === Infinity) {
                            min_dy = 0;
                        }

                        // translate all vertices by (min_dx, min_dy)

                        let desired_vertices = [];
                        let min_d = [min_dx, min_dy];

                        for (
                            let pointInd = 0;
                            pointInd < arraySize[0];
                            pointInd++
                        ) {
                            desired_vertices.push([]);

                            let original_vertex = numericalVertices[pointInd];

                            for (let dim = 0; dim < arraySize[1]; dim++) {
                                desired_vertices[pointInd].push(
                                    me.fromAst(
                                        original_vertex[dim] + min_d[dim],
                                    ),
                                );
                            }
                        }

                        if (globalDependencyValues.haveConstrainedVertices) {
                            // if (
                            //     globalDependencyValues.edgeConstraintsChild
                            //         .length > 0
                            // ) {
                            //     desired_vertices =
                            //         globalDependencyValues.edgeConstraintsChild[0].stateValues.constraintFunction(
                            //             {
                            //                 unconstrainedVertices:
                            //                     desired_vertices,
                            //                 closed: globalDependencyValues.closed,
                            //                 enforceRigid: true,
                            //                 allowRotation: false,
                            //             },
                            //         );
                            // }
                            // if (
                            //     globalDependencyValues.vertexConstraintsChild
                            //         .length > 0
                            // ) {
                            //     desired_vertices =
                            //         globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                            //             desired_vertices,
                            //             true,
                            //         );
                            // }

                            if (await stateValues.inStickyGroup) {
                                let stickyObjectIndex =
                                    await stateValues.stickyObjectIndex;
                                let stickyVerticesConstraintFunction =
                                    await stateValues.stickyVerticesConstraintFunction;

                                desired_vertices =
                                    stickyVerticesConstraintFunction(
                                        {
                                            unconstrainedVertices:
                                                desired_vertices,
                                            closed: globalDependencyValues.closed,
                                            enforceRigid: true,
                                            allowRotation: false,
                                            shrinkThreshold: false,
                                        },
                                        { objectInd: stickyObjectIndex },
                                    );
                            }

                            // Since we moved all the vertices,
                            // we reset to rotation reference mapping
                            // so that the actual centroid will be used for the next rotation.
                            instructions.push({
                                setDependency: "rotationReferenceMapping",
                                desiredValue: [null, null, null],
                            });
                        }
                        instructions.push({
                            setDependency: "unconstrainedVertices",
                            desiredValue: desired_vertices,
                        });
                    }
                } else {
                    // non-rigid/preserveSimilarity
                    if (globalDependencyValues.haveConstrainedVertices) {
                        // for non-rigid/preserveSimilarity case with constraints,
                        // go through the constraints so that will set the vertices
                        // to their constrained values

                        let vertices = await stateValues.vertices;
                        let desired_vertices = [];

                        for (
                            let pointInd = 0;
                            pointInd < arraySize[0];
                            pointInd++
                        ) {
                            let desired_vertex = [];

                            let original_vertex = vertices[pointInd];

                            for (let dim = 0; dim < arraySize[1]; dim++) {
                                let arrayKey = pointInd + "," + dim;
                                if (arrayKey in workspace) {
                                    desired_vertex.push(workspace[arrayKey]);
                                } else {
                                    desired_vertex.push(original_vertex[dim]);
                                }
                            }
                            desired_vertices.push(desired_vertex);
                        }

                        // If moved just one vertex, allow the shape to distort due to constraints and the edges to rotate.
                        // Otherwise, just shift the polyline due to the constraints
                        let enforceRigid = !movedJustOneVertex;
                        let allowRotation = movedJustOneVertex;

                        // if (
                        //     globalDependencyValues.edgeConstraintsChild.length >
                        //     0
                        // ) {
                        //     desired_vertices =
                        //         globalDependencyValues.edgeConstraintsChild[0].stateValues.constraintFunction(
                        //             {
                        //                 unconstrainedVertices: desired_vertices,
                        //                 closed: globalDependencyValues.closed,
                        //                 enforceRigid,
                        //                 allowRotation,
                        //             },
                        //         );
                        // }
                        // if (
                        //     globalDependencyValues.vertexConstraintsChild
                        //         .length > 0
                        // ) {
                        //     desired_vertices =
                        //         globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                        //             desired_vertices,
                        //             enforceRigid,
                        //         );
                        // }

                        if (await stateValues.inStickyGroup) {
                            let stickyObjectIndex =
                                await stateValues.stickyObjectIndex;
                            let stickyVerticesConstraintFunction =
                                await stateValues.stickyVerticesConstraintFunction;

                            desired_vertices = stickyVerticesConstraintFunction(
                                {
                                    unconstrainedVertices: desired_vertices,
                                    closed: globalDependencyValues.closed,
                                    enforceRigid,
                                    allowRotation,
                                    shrinkThreshold: false,
                                    vertexIndMoved,
                                },
                                { objectInd: stickyObjectIndex },
                            );
                        }

                        instructions.push({
                            setDependency: "unconstrainedVertices",
                            desiredValue: desired_vertices,
                        });
                    } else {
                        // for non-constrained non-rigid/preserveSimilarity case, we just move the unconstrained vertices
                        // according to how the vertices were moved

                        for (let arrayKey in desiredStateVariableValues.vertices) {
                            instructions.push({
                                setDependency:
                                    dependencyNamesByKey[arrayKey]
                                        .unconstrainedVertex,
                                desiredValue:
                                    desiredStateVariableValues.vertices[
                                        arrayKey
                                    ],
                            });
                        }
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            },
        };

        stateVariableDefinitions.numericalVertices = {
            isArray: true,
            entryPrefixes: ["numericalVertex"],
            forRenderer: true,
            returnArraySizeDependencies: () => ({
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
            }),
            returnArraySize({ dependencyValues }) {
                return [dependencyValues.numVertices];
            },
            returnArrayDependenciesByKey({ arrayKeys }) {
                let dependenciesByKey = {};

                for (let arrayKey of arrayKeys) {
                    dependenciesByKey[arrayKey] = {
                        vertex: {
                            dependencyType: "stateVariable",
                            variableName: "vertex" + (Number(arrayKey) + 1),
                        },
                    };
                }

                return { dependenciesByKey };
            },
            arrayDefinitionByKey({ dependencyValuesByKey, arrayKeys }) {
                let numericalVertices = {};

                for (let arrayKey of arrayKeys) {
                    let vert = dependencyValuesByKey[arrayKey].vertex.map((x) =>
                        x.evaluate_to_constant(),
                    );
                    if (!vert.every((x) => Number.isFinite(x))) {
                        vert = Array(vert.length).fill(NaN);
                    }
                    numericalVertices[arrayKey] = vert;
                }

                return { setValue: { numericalVertices } };
            },
        };

        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
            }),
            definition({ dependencyValues }) {
                let numDimensions = dependencyValues.numDimensions;
                let numVertices = dependencyValues.numVertices;
                let numericalVertices = dependencyValues.numericalVertices;

                let vals = [];
                let prPtx, prPty;
                let nxPtx = numericalVertices[0]?.[0];
                let nxPty = numericalVertices[0]?.[1];

                for (let i = 1; i < numVertices; i++) {
                    prPtx = nxPtx;
                    prPty = nxPty;

                    nxPtx = numericalVertices[i]?.[0];
                    nxPty = numericalVertices[i]?.[1];

                    // only implement for constants
                    if (
                        !(
                            Number.isFinite(prPtx) &&
                            Number.isFinite(prPty) &&
                            Number.isFinite(nxPtx) &&
                            Number.isFinite(nxPty)
                        )
                    ) {
                        vals.push(null);
                    } else {
                        let BA1sub = nxPtx - prPtx;
                        let BA2sub = nxPty - prPty;

                        if (BA1sub === 0 && BA2sub === 0) {
                            vals.push(null);
                        } else {
                            vals.push([BA1sub, BA2sub]);
                        }
                    }
                }

                return {
                    setValue: {
                        nearestPoint: function ({ variables, scales }) {
                            let xscale = scales[0];
                            let yscale = scales[1];

                            // only implemented in 2D for now
                            if (numDimensions !== 2 || numVertices === 0) {
                                return {};
                            }

                            let closestDistance2 = Infinity;
                            let closestResult = {};

                            let x1 = variables.x1?.evaluate_to_constant();
                            let x2 = variables.x2?.evaluate_to_constant();

                            let prevPtx, prevPty;
                            let nextPtx = numericalVertices[0][0];
                            let nextPty = numericalVertices[0][1];

                            for (let i = 1; i < numVertices; i++) {
                                prevPtx = nextPtx;
                                prevPty = nextPty;

                                nextPtx = numericalVertices[i][0];
                                nextPty = numericalVertices[i][1];

                                let val = vals[i - 1];
                                if (val === null) {
                                    continue;
                                }

                                let BA1 = val[0] / xscale;
                                let BA2 = val[1] / yscale;
                                let denom = BA1 * BA1 + BA2 * BA2;

                                let t =
                                    (((x1 - prevPtx) / xscale) * BA1 +
                                        ((x2 - prevPty) / yscale) * BA2) /
                                    denom;

                                let result;

                                if (t <= 0) {
                                    result = { x1: prevPtx, x2: prevPty };
                                } else if (t >= 1) {
                                    result = { x1: nextPtx, x2: nextPty };
                                } else {
                                    result = {
                                        x1: prevPtx + t * BA1 * xscale,
                                        x2: prevPty + t * BA2 * yscale,
                                    };
                                }

                                let distance2 =
                                    Math.pow((x1 - result.x1) / xscale, 2) +
                                    Math.pow((x2 - result.x2) / yscale, 2);

                                if (distance2 < closestDistance2) {
                                    closestDistance2 = distance2;
                                    closestResult = result;
                                }
                            }

                            if (
                                variables.x3 !== undefined &&
                                Object.keys(closestResult).length > 0
                            ) {
                                closestResult.x3 = 0;
                            }

                            return closestResult;
                        },
                    },
                };
            },
        };

        stateVariableDefinitions.length = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
            }),
            definition({ dependencyValues }) {
                let length = 0;
                let verts = dependencyValues.numericalVertices;
                let numVertices = dependencyValues.numericalVertices.length;
                for (let i = 0; i < numVertices - 1; i++) {
                    let dx = verts[i + 1][0] - verts[i][0];
                    let dy = verts[i + 1][1] - verts[i][1];
                    length += Math.sqrt(dx * dx + dy * dy);
                }

                return { setValue: { length } };
            },
        };

        stateVariableDefinitions.numericalCentroidUnconstrained = {
            returnDependencies: () => ({
                unconstrainedVertices: {
                    dependencyType: "stateVariable",
                    variableName: "unconstrainedVertices",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        numericalCentroidUnconstrained:
                            calculateNumericalCentroid(
                                dependencyValues.unconstrainedVertices,
                            ),
                    },
                };
            },
        };

        // A mapping from a shifted numerical centroid (first entry)
        // onto an original unconstrained centroid (second entry)
        // and original unconstrained vertex location (third entry) used for rotating a rigid/preserveSimilarity polygon.
        // Used so that if a polygon is shifted from the effective centroid
        // onto the shifted numerical centroid, the original centroid and vertices
        // will be used to calculate the rotation in the inverseDefinition of vertices.
        stateVariableDefinitions.rotationReferenceMapping = {
            hasEssential: true,
            defaultValue: [null, null, null],
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { rotationReferenceMapping: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "rotationReferenceMapping",
                            value: desiredStateVariableValues.rotationReferenceMapping,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.closed = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { closed: false } }),
        };

        return stateVariableDefinitions;
    }

    async movePolyline({
        pointCoords,
        transient,
        sourceDetails,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let numVerticesMoved = Object.keys(pointCoords).length;

        if (numVerticesMoved === 1) {
            // single vertex dragged
            if (!(await this.stateValues.verticesDraggable)) {
                return;
            }
        } else {
            // whole polyline dragged
            if (!(await this.stateValues.draggable)) {
                return;
            }
        }

        let vertexComponents = {};
        for (let ind in pointCoords) {
            vertexComponents[ind + ",0"] = me.fromAst(pointCoords[ind][0]);
            vertexComponents[ind + ",1"] = me.fromAst(pointCoords[ind][1]);
        }

        // Note: we set skipRendererUpdate to true
        // so that we can make further adjustments before the renderers are updated
        if (transient) {
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "vertices",
                        value: vertexComponents,
                        sourceDetails,
                    },
                ],
                transient,
                actionId,
                sourceInformation,
                skipRendererUpdate: true,
            });
        } else {
            await this.coreFunctions.performUpdate({
                updateInstructions: [
                    {
                        updateType: "updateValue",
                        componentIdx: this.componentIdx,
                        stateVariable: "vertices",
                        value: vertexComponents,
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
                        pointCoordinates: pointCoords,
                    },
                },
            });
        }

        // we will attempt to preserve the relationship among all the vertices
        // so that we have a rigid translation
        // when the whole polyline is moved or preserveSimilarity is true.
        // This procedure may preserve the rigid/similarity transformation
        // even if a subset of the vertices are constrained.
        // Note: If desiredUnconstrainedVertices has null components, then the original update was not successful.
        let desiredUnconstrainedVertices =
            await this.stateValues.desiredUnconstrainedVertices;
        if (
            (numVerticesMoved > 1 ||
                (await this.stateValues.preserveSimilarity)) &&
            desiredUnconstrainedVertices[0][0] != null
        ) {
            let desiredNumericalVertices = desiredUnconstrainedVertices.map(
                (vertex) => vertex.map((v) => v.evaluate_to_constant()),
            );
            let resultingNumericalVertices =
                await this.stateValues.numericalVertices;
            let numVertices = await this.stateValues.numVertices;

            let verticesChanged = [];
            let numVerticesChanged = 0;
            let tol = 1e-6;

            for (let [ind, vrtx] of desiredNumericalVertices.entries()) {
                if (
                    !vrtx.every(
                        (v, i) =>
                            Math.abs(v - resultingNumericalVertices[ind][i]) <
                            tol,
                    )
                ) {
                    verticesChanged.push(ind);
                    numVerticesChanged++;
                }
            }

            if (numVerticesChanged > 0 && numVerticesChanged < numVertices) {
                // A subset of points were altered from the requested location.
                // Check to see if the relationship among them is preserved

                let changedInd1 = verticesChanged[0];
                let relationshipPreserved = true;

                let orig1 = desiredNumericalVertices[changedInd1];
                let changed1 = resultingNumericalVertices[changedInd1];
                let changevec1 = orig1.map((v, i) => v - changed1[i]);

                if (numVerticesChanged > 1) {
                    for (let ind of verticesChanged.slice(1)) {
                        let orig2 = desiredNumericalVertices[ind];
                        let changed2 = resultingNumericalVertices[ind];
                        let changevec2 = orig2.map((v, i) => v - changed2[i]);

                        if (
                            !changevec1.every(
                                (v, i) => Math.abs(v - changevec2[i]) < tol,
                            )
                        ) {
                            relationshipPreserved = false;
                            break;
                        }
                    }
                }

                if (relationshipPreserved) {
                    // All the vertices that were altered from their requested location
                    // were altered in a way consistent with a rigid translation.
                    // Attempt to move the remaining vertices to achieve a rigid translation
                    // of the whole polyline.
                    let newNumericalVertices = [];

                    for (let i = 0; i < numVertices; i++) {
                        if (verticesChanged.includes(i)) {
                            newNumericalVertices.push(
                                resultingNumericalVertices[i],
                            );
                        } else {
                            newNumericalVertices.push(
                                desiredNumericalVertices[i].map(
                                    (v, j) => v - changevec1[j],
                                ),
                            );
                        }
                    }

                    let newVertexComponents = {};
                    for (let ind in newNumericalVertices) {
                        newVertexComponents[ind + ",0"] = me.fromAst(
                            newNumericalVertices[ind][0],
                        );
                        newVertexComponents[ind + ",1"] = me.fromAst(
                            newNumericalVertices[ind][1],
                        );
                    }

                    let newInstructions = [
                        {
                            updateType: "updateValue",
                            componentIdx: this.componentIdx,
                            stateVariable: "unconstrainedVertices",
                            value: newVertexComponents,
                        },
                    ];
                    return await this.coreFunctions.performUpdate({
                        updateInstructions: newInstructions,
                        transient,
                        actionId,
                        sourceInformation,
                        skipRendererUpdate,
                    });
                }
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

    async finalizePolylinePosition({
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        // trigger a movePolyline
        // to send the final values with transient=false
        // so that the final position will be recorded

        return await this.actions.movePolyline({
            pointCoords: await this.stateValues.numericalVertices,
            transient: false,
            actionId,
            sourceInformation,
            skipRendererUpdate,
        });
    }

    async reflectPolyline({
        sourceDetails,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.allowReflection)) {
            return;
        }

        const vertices = await this.stateValues.vertices;

        const centroid = calculateNumericalCentroid(vertices);

        const numericalVertices = await this.stateValues.numericalVertices;

        const reflectedVertices = numericalVertices.map((vert) => [
            2 * centroid[0] - vert[0],
            // 2 * centroid[1] - vert[1],
            vert[1],
        ]);

        let vertexComponents = {};

        for (const [idx, vert] of reflectedVertices.entries()) {
            vertexComponents[idx + ",0"] = me.fromAst(vert[0]);
            vertexComponents[idx + ",1"] = me.fromAst(vert[1]);
        }

        await this.coreFunctions.performUpdate({
            updateInstructions: [
                {
                    updateType: "updateValue",
                    componentIdx: this.componentIdx,
                    stateVariable: "vertices",
                    value: vertexComponents,
                    sourceDetails,
                    overrides: { isReflection: true },
                },
            ],
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    pointCoordinates: reflectedVertices,
                },
            },
        });
    }

    async polylineClicked({
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

    async polylineFocused({
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

function calculateNumericalCentroid(vertices) {
    let x = 0,
        y = 0;
    let numVertices = vertices.length;

    for (let i = 0; i < numVertices; i++) {
        x += vertices[i][0].evaluate_to_constant();
        y += vertices[i][1].evaluate_to_constant();
    }

    x /= numVertices;
    y /= numVertices;

    return [x, y];
}
