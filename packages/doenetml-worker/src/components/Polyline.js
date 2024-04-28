import { convertValueToMathExpression } from "@doenet/utils";
import {
    returnRoundingAttributeComponentShadowing,
    returnRoundingAttributes,
    returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
import GraphicalComponent from "./abstract/GraphicalComponent";
import me from "math-expressions";

export default class Polyline extends GraphicalComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            movePolyline: this.movePolyline.bind(this),
            finalizePolylinePosition: this.finalizePolylinePosition.bind(this),
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
            createComponentOfType: "_pointListComponent",
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

        Object.assign(attributes, returnRoundingAttributes());

        return attributes;
    }

    static returnChildGroups() {
        let groups = super.returnChildGroups();
        groups.push({
            group: "vertexConstraints",
            componentTypes: ["vertexConstraints"],
        });

        return groups;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnRoundingStateVariableDefinitions(),
        );

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

        stateVariableDefinitions.unconstrainedVertices = {
            isLocation: true,
            isArray: true,
            numDimensions: 2,
            entryPrefixes: ["unconstrainedVertexX", "unconstrainedVertex"],
            returnEntryDimensions: (prefix) =>
                prefix === "unconstrainedVertex" ? 1 : 0,
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
                vertexConstraintsChild: {
                    dependencyType: "child",
                    childGroups: ["vertexConstraints"],
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        haveConstrainedVertices:
                            dependencyValues.vertexConstraintsChild.length > 0,
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
                "rigid",
                "haveConstrainedVertices",
            ],
            returnArrayDependenciesByKey({ arrayKeys, stateValues }) {
                let globalDependencies = {
                    rigid: {
                        dependencyType: "stateVariable",
                        variableName: "rigid",
                    },
                    haveConstrainedVertices: {
                        dependencyType: "stateVariable",
                        variableName: "haveConstrainedVertices",
                    },
                    rotationReferenceMapping: {
                        dependencyType: "stateVariable",
                        variableName: "rotationReferenceMapping",
                    },
                };
                let dependenciesByKey = {};
                if (stateValues.haveConstrainedVertices || stateValues.rigid) {
                    globalDependencies.unconstrainedVertices = {
                        dependencyType: "stateVariable",
                        variableName: "unconstrainedVertices",
                    };
                    globalDependencies.vertexConstraintsChild = {
                        dependencyType: "child",
                        childGroups: ["vertexConstraints"],
                        variableNames: ["constraintFunction"],
                    };
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
                        globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                            globalDependencyValues.unconstrainedVertices,
                        );

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
                } else if (globalDependencyValues.rigid) {
                    // No constraints, so just give the unconstrained vertices.
                    // Since, use global dependency values
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
                    // if we don't have constrainedVertices and not rigid
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
            }) {
                // console.log(`inverseArrayDefinition of vertices of polyline`);
                // console.log(desiredStateVariableValues);
                // console.log(JSON.parse(JSON.stringify(stateValues)));
                // console.log(globalDependencyValues);
                // console.log(dependencyValuesByKey);

                let instructions = [];

                let movedJustOneVertex = false;

                // We have to accumulate changed vertices in workspace
                // as in some cases (such as when moving via an attached point)
                // the instructions for the components come in separately
                Object.assign(workspace, desiredStateVariableValues.vertices);

                let nMoved = Object.keys(workspace).length;
                if (nMoved === 1) {
                    movedJustOneVertex = true;
                } else if (nMoved === 2) {
                    let pointInd1 = Object.keys(workspace)[0].split(",")[0];
                    let pointInd2 = Object.keys(workspace)[1].split(",")[0];
                    movedJustOneVertex = pointInd1 === pointInd2;
                }

                if (globalDependencyValues.rigid) {
                    if (arraySize[1] !== 2) {
                        console.error(
                            "Moving a rigid polyline in inverse direction not implemented in other than 2D",
                        );
                        return { success: false };
                    }

                    if (movedJustOneVertex) {
                        // we keep the centroid fixed and rotate around the centroid

                        // Note: we need to use the centroid and vertices from the unconstrained vertices.
                        // Otherwise, the centroid will move around when rotating through a constraint,
                        // causing strange behavior.
                        // The downside is that a rotation starting in a constrained configuration
                        // may translate when the constraint is released.

                        let numericalCentroidUnconstrained =
                            await stateValues.numericalCentroidUnconstrained;
                        let rotationReferenceMapping =
                            globalDependencyValues.rotationReferenceMapping;

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
                            moved_vertex[0] - referenceCentroid[0],
                            moved_vertex[1] - referenceCentroid[1],
                        ];
                        let orig_rel = [
                            original_vertex[0] - referenceCentroid[0],
                            original_vertex[1] - referenceCentroid[1],
                        ];

                        let theta =
                            Math.atan2(moved_rel[1], moved_rel[0]) -
                            Math.atan2(orig_rel[1], orig_rel[0]);

                        let sin_theta = Math.sin(theta);
                        let cos_theta = Math.cos(theta);

                        // rotate all vertices by theta around centroid

                        let desired_vertices = [];

                        for (
                            let pointInd = 0;
                            pointInd < arraySize[0];
                            pointInd++
                        ) {
                            desired_vertices.push([]);

                            let original_vertex = referenceVertices[pointInd];
                            let orig_rel = [
                                original_vertex[0] - referenceCentroid[0],
                                original_vertex[1] - referenceCentroid[1],
                            ];
                            let rot_rel = [
                                cos_theta * orig_rel[0] -
                                    sin_theta * orig_rel[1],
                                sin_theta * orig_rel[0] +
                                    cos_theta * orig_rel[1],
                            ];

                            for (let dim = 0; dim < arraySize[1]; dim++) {
                                desired_vertices[pointInd].push(
                                    me.fromAst(
                                        rot_rel[dim] + referenceCentroid[dim],
                                    ),
                                );
                            }
                        }

                        if (globalDependencyValues.haveConstrainedVertices) {
                            desired_vertices =
                                globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                                    desired_vertices,
                                );

                            let constrainedCentroid =
                                calculateNumericalCentroid(desired_vertices);

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
                        // If moved more than one vertex, then translate whole polygon
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
                            desired_vertices =
                                globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                                    desired_vertices,
                                );

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
                    // non-rigid
                    if (globalDependencyValues.haveConstrainedVertices) {
                        // for non-rigid case with constraints where move just one vertex,
                        // go through the constraints so that will set the vertex
                        // to its constrained value

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

                        // If moved just one vertex, allow the shape to distort due to constraints.
                        // Otherwise, just shift the polyline due to the constraints
                        let enforceRigid = !movedJustOneVertex;

                        desired_vertices =
                            globalDependencyValues.vertexConstraintsChild[0].stateValues.constraintFunction(
                                desired_vertices,
                                enforceRigid,
                            );

                        instructions.push({
                            setDependency: "unconstrainedVertices",
                            desiredValue: desired_vertices,
                        });
                    } else {
                        // for non-constrained non-rigid case, we just move the unconstrained vertices
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

        stateVariableDefinitions.numericalCentroid = {
            returnDependencies: () => ({
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
            }),
            definition({ dependencyValues }) {
                let x = 0,
                    y = 0;
                let verts = dependencyValues.numericalVertices;
                let numVertices = dependencyValues.numericalVertices.length;
                for (let i = 0; i < numVertices; i++) {
                    x += verts[i][0];
                    y += verts[i][1];
                }
                x /= numVertices;
                y /= numVertices;

                return { setValue: { numericalCentroid: [x, y] } };
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
        // onto an original centroid (second entry)
        // and reference position (third entry) used for rotating a rigid polygon.
        // Used so that if a polygon is shifted from the effective centroid/reference position
        // onto the shifted numerical centroid, the original centroid and position
        // will be used to calculate the rotation.
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
                        componentName: this.componentName,
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
                        componentName: this.componentName,
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
                        componentName: this.componentName,
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
        // when the whole polyline is moved.
        // This procedure may preserve the rigid translation
        // even if a subset of the vertices are constrained.
        if (numVerticesMoved > 1) {
            // whole polyline dragged

            let numericalVertices = pointCoords;
            let resultingNumericalVertices =
                await this.stateValues.numericalVertices;
            let numVertices = await this.stateValues.numVertices;

            let verticesChanged = [];
            let numVerticesChanged = 0;
            let tol = 1e-6;

            for (let [ind, vrtx] of numericalVertices.entries()) {
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

                let orig1 = numericalVertices[changedInd1];
                let changed1 = resultingNumericalVertices[changedInd1];
                let changevec1 = orig1.map((v, i) => v - changed1[i]);

                if (numVerticesChanged > 1) {
                    for (let ind of verticesChanged.slice(1)) {
                        let orig2 = numericalVertices[ind];
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
                                numericalVertices[i].map(
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
                            componentName: this.componentName,
                            stateVariable: "vertices",
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

    async polylineClicked({
        actionId,
        name,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "click",
                componentName: name, // use name rather than this.componentName to get original name if adapted
                actionId,
                sourceInformation,
                skipRendererUpdate,
            });
        }
    }

    async polylineFocused({
        actionId,
        name,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        if (!(await this.stateValues.fixed)) {
            await this.coreFunctions.triggerChainedActions({
                triggeringAction: "focus",
                componentName: name, // use name rather than this.componentName to get original name if adapted
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
