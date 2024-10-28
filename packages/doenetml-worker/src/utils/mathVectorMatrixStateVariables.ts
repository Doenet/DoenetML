import { convertValueToMathExpression, vectorOperators } from "@doenet/utils";
import { returnRoundingAttributeComponentShadowing } from "./rounding";
//@ts-ignore
import me from "math-expressions";

const vectorAndListOperators = ["list", ...vectorOperators];

export function returnMathVectorMatrixStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions.numDimensions = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({ dependencyValues }: { dependencyValues: { value: any } }) {
            let numDimensions = 1;

            let tree = dependencyValues.value.tree;

            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    numDimensions = tree.length - 1;
                } else if (tree[0] === "matrix") {
                    let size = tree[1].slice(1);

                    if (size[0] === 1) {
                        numDimensions = size[1];
                    } else if (size[1] === 1) {
                        numDimensions = size[0];
                    }
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    numDimensions = tree[1].length - 1;
                }
            }

            return { setValue: { numDimensions } };
        },
    };

    stateVariableDefinitions.vector = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnRoundingAttributeComponentShadowing(),
            returnWrappingComponents(prefix: string | undefined) {
                if (prefix === "x") {
                    return [];
                } else {
                    // entire array
                    // wrap by both <vector> and <xs>
                    return [
                        [
                            "vector",
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
        entryPrefixes: ["x"],
        returnArraySizeDependencies: () => ({
            numDimensions: {
                dependencyType: "stateVariable",
                variableName: "numDimensions",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numDimensions: number };
        }) {
            return [dependencyValues.numDimensions];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            arraySize,
        }: {
            globalDependencyValues: { value: any };
            arraySize: number[];
        }) {
            let tree = globalDependencyValues.value.tree;

            let createdVector = false;

            let vector: Record<string, any> = {};
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    for (let ind = 0; ind < arraySize[0]; ind++) {
                        vector[ind] = me.fromAst(tree[ind + 1]);
                    }
                    createdVector = true;
                } else if (tree[0] === "matrix") {
                    let size = tree[1].slice(1);
                    if (size[0] === 1) {
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            vector[ind] = me.fromAst(tree[2][1][ind + 1]);
                        }
                        createdVector = true;
                    } else if (size[1] === 1) {
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            vector[ind] = me.fromAst(tree[2][ind + 1][1]);
                        }
                        createdVector = true;
                    }
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    for (let ind = 0; ind < arraySize[0]; ind++) {
                        vector[ind] = me.fromAst(tree[1][ind + 1]);
                    }
                    createdVector = true;
                }
            }
            if (!createdVector) {
                vector[0] = globalDependencyValues.value;
            }

            return { setValue: { vector } };
        },
        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            stateValues,
            workspace,
            arraySize,
        }: {
            desiredStateVariableValues: { vector: any[] };
            globalDependencyValues: { value: any };
            stateValues: { vector: Promise<any[]> };
            workspace: any;
            arraySize: number[];
        }) {
            // in case just one ind specified, merge with previous values
            if (!workspace.desiredVector) {
                workspace.desiredVector = [];
            }
            for (let ind = 0; ind < arraySize[0]; ind++) {
                if (desiredStateVariableValues.vector[ind] !== undefined) {
                    workspace.desiredVector[ind] = convertValueToMathExpression(
                        desiredStateVariableValues.vector[ind],
                    );
                } else if (workspace.desiredVector[ind] === undefined) {
                    workspace.desiredVector[ind] = (await stateValues.vector)[
                        ind
                    ];
                }
            }

            let desiredValue;
            let tree = globalDependencyValues.value.tree;
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    desiredValue = me.fromAst([
                        tree[0],
                        ...workspace.desiredVector.map((x: any) => x.tree),
                    ]);
                } else if (tree[0] === "matrix") {
                    let size = tree[1].slice(1);
                    if (size[0] === 1) {
                        let desiredMatrixVals: any[] = ["tuple"];
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            desiredMatrixVals.push(
                                workspace.desiredVector[ind],
                            );
                        }
                        desiredMatrixVals = ["tuple", desiredMatrixVals];
                        desiredValue = me.fromAst([
                            "matrix",
                            tree[1],
                            desiredMatrixVals,
                        ]);
                    } else if (size[1] === 1) {
                        let desiredMatrixVals: any[] = ["tuple"];
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            desiredMatrixVals.push([
                                "tuple",
                                workspace.desiredVector[ind],
                            ]);
                        }
                        desiredValue = me.fromAst([
                            "matrix",
                            tree[1],
                            desiredMatrixVals,
                        ]);
                    }
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    desiredValue = [
                        tree[0],
                        [
                            tree[1][0],
                            ...workspace.desiredVector.map((x: any) => x.tree),
                        ],
                    ];
                    if (tree[2]) {
                        desiredValue.push(tree[2]);
                    }
                    desiredValue = me.fromAst(desiredValue);
                }
            }

            if (!desiredValue) {
                desiredValue = workspace.desiredVector[0];
            }

            let instructions = [
                {
                    setDependency: "value",
                    desiredValue,
                },
            ];

            return {
                success: true,
                instructions,
            };
        },
    };

    stateVariableDefinitions.x = {
        isAlias: true,
        targetVariableName: "x1",
    };

    stateVariableDefinitions.y = {
        isAlias: true,
        targetVariableName: "x2",
    };

    stateVariableDefinitions.z = {
        isAlias: true,
        targetVariableName: "x3",
    };

    stateVariableDefinitions.matrixSize = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "numberList",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({ dependencyValues }: { dependencyValues: { value: any } }) {
            let matrixSize = [1, 1];

            let tree = dependencyValues.value.tree;

            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    matrixSize = [tree.length - 1, 1];
                } else if (tree[0] === "matrix") {
                    matrixSize = tree[1].slice(1);
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    matrixSize = [1, tree[1].length - 1];
                }
            }

            return { setValue: { matrixSize } };
        },
    };

    stateVariableDefinitions.numRows = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            matrixSize: {
                dependencyType: "stateVariable",
                variableName: "matrixSize",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { matrixSize: number[] };
        }) {
            return {
                setValue: { numRows: dependencyValues.matrixSize[0] },
            };
        },
    };

    stateVariableDefinitions.numColumns = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            matrixSize: {
                dependencyType: "stateVariable",
                variableName: "matrixSize",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { matrixSize: number[] };
        }) {
            return {
                setValue: { numColumns: dependencyValues.matrixSize[1] },
            };
        },
    };

    stateVariableDefinitions.matrix = {
        public: true,
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnRoundingAttributeComponentShadowing(),
            returnWrappingComponents(prefix: string | undefined) {
                if (prefix === "matrixEntry") {
                    return [];
                } else if (prefix === "row") {
                    return [["matrix", "matrixRow"]];
                } else if (prefix === "column") {
                    return [["matrix", "matrixColumn"]];
                } else {
                    // entire matrix
                    // wrap inner dimension by matrixRow and outer dimension by matrix
                    return [["matrixRow"], ["matrix"]];
                }
            },
        },
        isArray: true,
        numDimensions: 2,
        entryPrefixes: ["matrixEntry", "row", "column", "rows", "columns"],
        returnEntryDimensions: (prefix: string | undefined) => {
            if (prefix === "matrixEntry") {
                return 0;
            } else if (prefix === "rows" || prefix === "columns") {
                return 2;
            } else {
                return 1;
            }
        },
        getArrayKeysFromVarName({
            arrayEntryPrefix,
            varEnding,
            arraySize,
        }: {
            arrayEntryPrefix: string;
            varEnding: string;
            arraySize: number[];
        }) {
            if (arrayEntryPrefix === "matrixEntry") {
                // matrixEntry1_2 is the 2nd entry from the first row
                let indices = varEnding.split("_").map((x) => Number(x) - 1);
                if (
                    indices.length === 2 &&
                    indices.every((x) => Number.isInteger(x) && x >= 0)
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
            } else if (arrayEntryPrefix === "row") {
                // row3 is all components of the third row

                let rowInd = Number(varEnding) - 1;
                if (!(Number.isInteger(rowInd) && rowInd >= 0)) {
                    return [];
                }

                if (!arraySize) {
                    // If don't have array size, we just need to determine if it is a potential entry.
                    // Return the first entry assuming array is large enough
                    return [rowInd + ",0"];
                }
                if (rowInd < arraySize[0]) {
                    // array of "rowInd,i", where i=0, ..., arraySize[1]-1
                    return Array.from(
                        Array(arraySize[1]),
                        (_, i) => rowInd + "," + i,
                    );
                } else {
                    return [];
                }
            } else if (arrayEntryPrefix === "column") {
                // column3 is all components of the third column

                let colInd = Number(varEnding) - 1;
                if (!(Number.isInteger(colInd) && colInd >= 0)) {
                    return [];
                }

                if (!arraySize) {
                    // If don't have array size, we just need to determine if it is a potential entry.
                    // Return the first entry assuming array is large enough
                    return ["0," + colInd];
                }
                if (colInd < arraySize[1]) {
                    // array of "i,colInd", where i=0, ..., arraySize[1]-1
                    return Array.from(
                        Array(arraySize[0]),
                        (_, i) => i + "," + colInd,
                    );
                } else {
                    return [];
                }
            } else if (
                arrayEntryPrefix === "rows" ||
                arrayEntryPrefix === "columns"
            ) {
                // rows or columns is the whole matrix
                // (this are designed for getting rows and columns using propIndex)
                // (rows and matrix are the same, but rows is added to be parallel to columns)

                if (!arraySize) {
                    // If don't have array size, we justr eturn the first entry
                    return ["0,0"];
                }
                let keys = [];
                for (let rowInd = 0; rowInd < arraySize[0]; rowInd++) {
                    keys.push(
                        ...Array.from(
                            Array(arraySize[1]),
                            (_, i) => rowInd + "," + i,
                        ),
                    );
                }
                return keys;
            }
        },
        arrayVarNameFromPropIndex(propIndex: number[], varName: string) {
            if (varName === "matrix" || varName === "rows") {
                if (propIndex.length === 1) {
                    return "row" + propIndex[0];
                } else {
                    // if propIndex has additional entries, ignore them
                    return `matrixEntry${propIndex[0]}_${propIndex[1]}`;
                }
            }
            if (varName === "columns") {
                if (propIndex.length === 1) {
                    return "column" + propIndex[0];
                } else {
                    // if propIndex has additional entries, ignore them
                    return `matrixEntry${propIndex[1]}_${propIndex[0]}`;
                }
            }
            if (varName.slice(0, 3) === "row") {
                let rowNum = Number(varName.slice(3));
                if (Number.isInteger(rowNum) && rowNum > 0) {
                    // if propIndex has additional entries, ignore them
                    return `matrixEntry${rowNum}_${propIndex[0]}`;
                }
            }
            if (varName.slice(0, 6) === "column") {
                let colNum = Number(varName.slice(6));
                if (Number.isInteger(colNum) && colNum > 0) {
                    // if propIndex has additional entries, ignore them
                    return `matrixEntry${propIndex[0]}_${colNum}`;
                }
            }
            return null;
        },
        returnArraySizeDependencies: () => ({
            matrixSize: {
                dependencyType: "stateVariable",
                variableName: "matrixSize",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { matrixSize: number[] };
        }) {
            return dependencyValues.matrixSize;
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            arraySize,
        }: {
            globalDependencyValues: { value: any };
            arraySize: number[];
        }) {
            let tree = globalDependencyValues.value.tree;

            let createdMatrix = false;

            let matrix: Record<string, any> = {};
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    for (let ind = 0; ind < arraySize[0]; ind++) {
                        matrix[ind + ",0"] = me.fromAst(tree[ind + 1]);
                    }
                    createdMatrix = true;
                } else if (tree[0] === "matrix") {
                    let matVals = tree[2];
                    for (let i = 0; i < arraySize[0]; i++) {
                        for (let j = 0; j < arraySize[1]; j++) {
                            matrix[`${i},${j}`] = me.fromAst(
                                matVals[i + 1][j + 1],
                            );
                        }
                    }
                    createdMatrix = true;
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    for (let ind = 0; ind < arraySize[1]; ind++) {
                        matrix["0," + ind] = me.fromAst(tree[1][ind + 1]);
                    }
                    createdMatrix = true;
                }
            }
            if (!createdMatrix) {
                matrix["0,0"] = globalDependencyValues.value;
            }

            return { setValue: { matrix } };
        },
        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            stateValues,
            workspace,
            arraySize,
        }: {
            desiredStateVariableValues: { matrix: Record<string, any> };
            globalDependencyValues: { value: any };
            stateValues: { matrix: Promise<any> };
            workspace: any;
            arraySize: number[];
        }) {
            // in case just one ind specified, merge with previous values
            if (!workspace.desiredMatrix) {
                workspace.desiredMatrix = [];
            }
            for (let i = 0; i < arraySize[0]; i++) {
                for (let j = 0; j < arraySize[1]; j++) {
                    let arrayKey = i + "," + j;
                    if (
                        desiredStateVariableValues.matrix[arrayKey] !==
                        undefined
                    ) {
                        workspace.desiredMatrix[arrayKey] =
                            convertValueToMathExpression(
                                desiredStateVariableValues.matrix[arrayKey],
                            );
                    } else if (
                        workspace.desiredMatrix[arrayKey] === undefined
                    ) {
                        workspace.desiredMatrix[arrayKey] = (
                            await stateValues.matrix
                        )[i][j];
                    }
                }
            }

            let desiredValue;
            let tree = globalDependencyValues.value.tree;
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    desiredValue = [tree[0]];
                    for (let ind = 0; ind < arraySize[0]; ind++) {
                        desiredValue.push(
                            workspace.desiredMatrix[ind + ",0"].tree,
                        );
                    }
                } else if (tree[0] === "matrix") {
                    let desiredMatrixVals: any[] = ["tuple"];

                    for (let i = 0; i < arraySize[0]; i++) {
                        let row = ["tuple"];
                        for (let j = 0; j < arraySize[1]; j++) {
                            row.push(workspace.desiredMatrix[`${i},${j}`].tree);
                        }
                        desiredMatrixVals.push(row);
                    }
                    desiredValue = me.fromAst([
                        "matrix",
                        tree[1],
                        desiredMatrixVals,
                    ]);
                } else if (
                    vectorOperators.includes(tree[1][0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    desiredValue = [tree[0]];
                    let desiredVector = [tree[1][0]];
                    for (let ind = 0; ind < arraySize[1]; ind++) {
                        desiredVector.push(
                            workspace.desiredMatrix["0," + ind].tree,
                        );
                    }
                    desiredValue = [tree[0], desiredVector];
                    if (tree[2]) {
                        desiredValue.push(tree[2]);
                    }
                    desiredValue = me.fromAst(desiredValue);
                }
            }

            if (!desiredValue) {
                desiredValue = workspace.desiredMatrix["0,0"];
            }

            let instructions = [
                {
                    setDependency: "value",
                    desiredValue,
                },
            ];

            return {
                success: true,
                instructions,
            };
        },
    };

    return stateVariableDefinitions;
}
