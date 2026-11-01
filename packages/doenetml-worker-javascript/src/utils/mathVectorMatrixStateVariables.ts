import {
    convertValueToMathExpression,
    deepClone,
    vectorOperators,
} from "@doenet/utils";
import { returnNumberDisplayAttributeComponentShadowing } from "./numberDisplay";
import me, { Tree, Expression } from "math-expressions";

const vectorAndListOperators = ["list", ...vectorOperators];

interface VectorWorkspace {
    desiredVector?: Expression[];
}

interface MatrixWorkspace {
    desiredMatrix?: Record<string, Expression>;
}

export function returnMathVectorMatrixStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions.numDimensions = {
        description:
            "The number of dimensions if the math expression is interpreted as a vector or matrix.",
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
                    vectorOperators.includes(tree[1]?.[0]) &&
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
        description:
            "The math expression interpreted as a vector (its components).",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnNumberDisplayAttributeComponentShadowing(),
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
                    vectorOperators.includes(tree[1]?.[0]) &&
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
            stateValues: { vector: Promise<Expression[]> };
            workspace: VectorWorkspace;
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

            let desiredValue: Expression | undefined;
            let tree = globalDependencyValues.value.tree;
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    desiredValue = me.fromAst([
                        tree[0],
                        ...workspace.desiredVector.map((x) => x.tree),
                    ]);
                } else if (tree[0] === "matrix") {
                    let size = tree[1].slice(1);
                    if (size[0] === 1) {
                        let desiredMatrixVals: Tree = ["tuple"];
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            desiredMatrixVals.push(
                                workspace.desiredVector[ind].tree,
                            );
                        }
                        desiredMatrixVals = ["tuple", desiredMatrixVals];
                        desiredValue = me.fromAst([
                            "matrix",
                            tree[1],
                            desiredMatrixVals,
                        ]);
                    } else if (size[1] === 1) {
                        let desiredMatrixVals: Tree = ["tuple"];
                        for (let ind = 0; ind < arraySize[0]; ind++) {
                            desiredMatrixVals.push([
                                "tuple",
                                workspace.desiredVector[ind].tree,
                            ]);
                        }
                        desiredValue = me.fromAst([
                            "matrix",
                            tree[1],
                            desiredMatrixVals,
                        ]);
                    }
                } else if (
                    vectorOperators.includes(tree[1]?.[0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    const desiredTree: Tree = [
                        tree[0],
                        [
                            tree[1][0],
                            ...workspace.desiredVector.map(
                                (x: Expression) => x.tree,
                            ),
                        ],
                    ];
                    if (tree[2]) {
                        desiredTree.push(tree[2]);
                    }
                    desiredValue = me.fromAst(desiredTree);
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
        description:
            "The first component of the math expression when interpreted as a vector.",
    };

    stateVariableDefinitions.y = {
        isAlias: true,
        targetVariableName: "x2",
        description:
            "The second component of the math expression when interpreted as a vector.",
    };

    stateVariableDefinitions.z = {
        isAlias: true,
        targetVariableName: "x3",
        description:
            "The third component of the math expression when interpreted as a vector.",
    };

    stateVariableDefinitions.numListItems = {
        isAlias: true,
        targetVariableName: "numDimensions",
        description:
            "The number of items when the math expression is interpreted as a list.",
    };

    stateVariableDefinitions.list = {
        description:
            "The math expression interpreted as a list (its elements).",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnNumberDisplayAttributeComponentShadowing(),
        },
        isArray: true,
        entryPrefixes: ["listItem"],
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
                vector: {
                    dependencyType: "stateVariable",
                    variableName: "vector",
                },
            };
            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { vector: any };
        }) {
            return { setValue: { list: globalDependencyValues.vector } };
        },

        async inverseArrayDefinitionByKey({
            desiredStateVariableValues,
        }: {
            desiredStateVariableValues: { list: any[] };
        }) {
            let instructions = [
                {
                    setDependency: "vector",
                    desiredValue: desiredStateVariableValues.list,
                },
            ];

            return {
                success: true,
                instructions,
            };
        },
    };

    stateVariableDefinitions.matrixSize = {
        description:
            "The size of the math expression as a matrix, as a [numRows, numColumns] list.",
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
                    vectorOperators.includes(tree[1]?.[0]) &&
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
        description:
            "The number of rows when the math expression is interpreted as a matrix.",
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
        description:
            "The number of columns when the math expression is interpreted as a matrix.",
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
        description:
            "The math expression interpreted as a matrix (its entries by row and column).",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnNumberDisplayAttributeComponentShadowing(),
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
        schemaSubarrays: {
            rows: {
                numDimensions: 2,
                description: "The matrix's entries grouped by row.",
            },
            columns: {
                numDimensions: 2,
                description: "The matrix's entries grouped by column.",
            },
        },
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
                    vectorOperators.includes(tree[1]?.[0]) &&
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
            stateValues: { matrix: Promise<Expression[][]> };
            workspace: MatrixWorkspace;
            arraySize: number[];
        }) {
            // in case just one ind specified, merge with previous values
            if (!workspace.desiredMatrix) {
                workspace.desiredMatrix = {};
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

            let desiredValue: Expression | undefined;
            let tree = globalDependencyValues.value.tree;
            if (Array.isArray(tree)) {
                if (vectorAndListOperators.includes(tree[0])) {
                    desiredValue = me.fromAst([
                        tree[0],
                        ...Array.from(
                            { length: arraySize[0] },
                            (_, ind) =>
                                workspace.desiredMatrix![`${ind},0`].tree,
                        ),
                    ]);
                } else if (tree[0] === "matrix") {
                    let desiredMatrixVals: Tree = ["tuple"];

                    for (let i = 0; i < arraySize[0]; i++) {
                        let row: Tree = ["tuple"];
                        for (let j = 0; j < arraySize[1]; j++) {
                            row.push(
                                workspace.desiredMatrix![`${i},${j}`].tree,
                            );
                        }
                        desiredMatrixVals.push(row);
                    }
                    desiredValue = me.fromAst([
                        "matrix",
                        tree[1],
                        desiredMatrixVals,
                    ]);
                } else if (
                    vectorOperators.includes(tree[1]?.[0]) &&
                    ((tree[0] === "^" && tree[2] === "T") ||
                        tree[0] === "prime")
                ) {
                    let desiredTree: Tree = [tree[0]];
                    let desiredVector: Tree = [tree[1][0]];
                    for (let ind = 0; ind < arraySize[1]; ind++) {
                        desiredVector.push(
                            workspace.desiredMatrix!["0," + ind].tree,
                        );
                    }
                    desiredTree = [tree[0], desiredVector];
                    if (tree[2]) {
                        desiredTree.push(tree[2]);
                    }
                    desiredValue = me.fromAst(desiredTree);
                }
            }

            if (!desiredValue) {
                desiredValue = workspace.desiredMatrix!["0,0"];
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

/**
 * The array that an index into a math-valued component reads (D27, "Values
 * with entries"): the component's `variableForIndexAsProp`. It is not a
 * property an author names; it is how `$m[i]`, `$m[i][j]` and `$m.value[i]`
 * reach the entries of the value, whatever its shape at the moment:
 *
 * - a tuple, vector or list (or a transposed or primed one): `[i]` is entry
 *   `i`, and an entry has no entries of its own;
 * - a matrix: `[i]` is row `i`, as a 1×n matrix, and `[i][j]` is the entry
 *   in row `i` and column `j`;
 * - anything else is a scalar, which has no entries.
 *
 * The array has two dimensions. Key `i,0` is entry `i + 1` as a whole (a
 * coordinate, or a row), and key `i,j` with `j ≥ 1` is entry `j` of it (the
 * matrix entry in row `i + 1` and column `j`), so its size is `[m, n + 1]`
 * for an m×n matrix, `[n, 1]` for a tuple of n entries, and `[0, 1]` for a
 * scalar. Its entries are named `__valueEntry2` for key `1,0` and
 * `__valueEntry2_3` for key `1,3`. As the value changes shape, an entry
 * names a coordinate, a row or nothing, as an index past the end does.
 *
 * It is not public, so `$m.__valueEntries` names nothing; a reference reaches
 * it only through `variableForIndexAsProp` (or `.value[i]`), which read it
 * although it is not public (`isValueEntriesVariable`).
 */
export const VALUE_ENTRIES = "__valueEntries";

/** The prefix of the entries of {@link VALUE_ENTRIES}. */
export const VALUE_ENTRY_PREFIX = "__valueEntry";

/**
 * Whether `name` is {@link VALUE_ENTRIES} or one of its entries, which a
 * reference with an index reads although it is not public.
 */
export function isValueEntriesVariable(name: string | undefined): boolean {
    return (
        name === VALUE_ENTRIES || Boolean(name?.startsWith(VALUE_ENTRY_PREFIX))
    );
}

/** The blank a math shows before anything is entered. */
const BLANK = "＿";

type ValueShape =
    | {
          kind: "tuple";
          entries: Tree[];
          rebuild: (entries: Tree[]) => Tree;
      }
    | {
          kind: "matrix";
          rows: Tree[][];
          rebuild: (rows: Tree[][]) => Tree;
      }
    | { kind: "scalar" };

/**
 * The shape of a math value for an index into it: a tuple of entries, a
 * matrix of rows, or a scalar, with a function that puts changed entries (or
 * rows) back into a value of the same form.
 */
function valueShape(tree: Tree): ValueShape {
    if (Array.isArray(tree)) {
        const operator = tree[0] as string;
        if (vectorAndListOperators.includes(operator)) {
            return {
                kind: "tuple",
                entries: tree.slice(1),
                rebuild: (entries) => [operator, ...entries],
            };
        }
        if (operator === "matrix") {
            const size = tree[1];
            const rows = (tree[2] as Tree[])
                .slice(1)
                .map((row) => (row as Tree[]).slice(1));
            if (rows.every((row) => row.length === rows[0]?.length)) {
                return {
                    kind: "matrix",
                    rows,
                    rebuild: (rows) => [
                        "matrix",
                        size,
                        [
                            "tuple",
                            ...rows.map((row): Tree => ["tuple", ...row]),
                        ],
                    ],
                };
            }
        }
        const inner = tree[1];
        if (
            Array.isArray(inner) &&
            vectorOperators.includes(inner[0] as string) &&
            ((operator === "^" && tree[2] === "T") || operator === "prime")
        ) {
            return {
                kind: "tuple",
                entries: inner.slice(1),
                rebuild: (entries) => [
                    operator,
                    [inner[0], ...entries],
                    ...tree.slice(2),
                ],
            };
        }
    }
    return { kind: "scalar" };
}

/** A row of a matrix as a 1×n matrix. */
function rowAsMatrix(row: Tree[]): Tree {
    return ["matrix", ["tuple", 1, row.length], ["tuple", ["tuple", ...row]]];
}

/**
 * The entries of `desired`, a value given for a row of a matrix: those of a
 * 1×n matrix or of a tuple, or `undefined` for anything else.
 */
function rowFromValue(desired: Tree): Tree[] | undefined {
    const shape = valueShape(desired);
    if (shape.kind === "tuple") {
        return shape.entries;
    }
    if (shape.kind === "matrix" && shape.rows.length === 1) {
        return shape.rows[0];
    }
    return undefined;
}

/**
 * Entry `index` (from 1) of a math value, as `$m[index]` reads it: an entry
 * of a tuple, or a row of a matrix as a 1×n matrix. `undefined` for an index
 * past the end, and for a scalar, which has no entries; a list entry's
 * property (`entryValueEntryProperty` in `ValueListComponent.js`) shows a
 * blank for it.
 */
export function valueEntryOf(value: Expression, index: number): any {
    const shape = valueShape(value.tree);
    if (shape.kind === "tuple" && index <= shape.entries.length) {
        return me.fromAst(shape.entries[index - 1]);
    }
    if (shape.kind === "matrix" && index <= shape.rows.length) {
        return me.fromAst(rowAsMatrix(shape.rows[index - 1]));
    }
    return undefined;
}

/**
 * Whether the entries of a math value, as `$m[index]` reads them, are the
 * rows of a matrix.
 */
export function hasMatrixRows(value: Expression): boolean {
    return valueShape(value.tree).kind === "matrix";
}

interface ValueEntriesWorkspace {
    desiredTree?: Tree;
}

/**
 * The definition of {@link VALUE_ENTRIES}, for a component whose `value` is
 * a math expression.
 */
export function returnValueEntriesStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions[VALUE_ENTRIES] = {
        shadowingInstructions: {
            createComponentOfType: "math",
            addAttributeComponentsShadowingStateVariables:
                returnNumberDisplayAttributeComponentShadowing(),
        },
        isArray: true,
        numDimensions: 2,
        entryPrefixes: [VALUE_ENTRY_PREFIX],
        returnEntryDimensions: () => 0,
        /**
         * Whether `propIndex` names nothing because what it indexes is a
         * scalar, which has no entries: the value, or, for a second index,
         * an entry of a tuple. That is reported, unlike an index past the end,
         * which is silent. A blank, the value of a `<mathInput>` before
         * anything is entered, is not reported: the author expects it to be
         * given entries. `arrayEntryNamesFromPropIndex` reports such an
         * index.
         */
        async indexIntoScalar(component: any, propIndex: number[]) {
            const tree = (await component.stateValues.value)?.tree;
            if (tree === BLANK) {
                return false;
            }
            const shape = valueShape(tree);
            if (shape.kind === "scalar") {
                return true;
            }
            if (shape.kind === "tuple" && propIndex.length > 1) {
                const entry = shape.entries[propIndex[0] - 1];
                return (
                    entry !== undefined && valueShape(entry).kind === "scalar"
                );
            }
            return false;
        },
        getArrayKeysFromVarName({
            varEnding,
            arraySize,
        }: {
            varEnding: string;
            arraySize?: number[];
        }) {
            const indices = varEnding.split("_").map(Number);
            if (
                indices.length > 2 ||
                !indices.every((index) => Number.isInteger(index) && index > 0)
            ) {
                return [];
            }
            const row = indices[0] - 1;
            const column = indices[1] ?? 0;
            if (arraySize && !(row < arraySize[0] && column < arraySize[1])) {
                return [];
            }
            return [`${row},${column}`];
        },
        arrayVarNameFromArrayKey(arrayKey: string) {
            const [row, column] = arrayKey.split(",").map(Number);
            return (
                VALUE_ENTRY_PREFIX +
                (column === 0 ? `${row + 1}` : `${row + 1}_${column}`)
            );
        },
        arrayVarNameFromPropIndex(propIndex: number[], varName: string) {
            if (varName !== VALUE_ENTRIES || propIndex.length > 2) {
                return null;
            }
            return VALUE_ENTRY_PREFIX + propIndex.join("_");
        },
        returnArraySizeDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { value: any };
        }) {
            const shape = valueShape(dependencyValues.value.tree);
            if (shape.kind === "tuple") {
                return [shape.entries.length, 1];
            }
            if (shape.kind === "matrix") {
                return [shape.rows.length, (shape.rows[0]?.length ?? 0) + 1];
            }
            return [0, 1];
        },
        returnArrayDependenciesByKey() {
            return {
                globalDependencies: {
                    value: {
                        dependencyType: "stateVariable",
                        variableName: "value",
                    },
                },
            };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
            arrayKeys,
        }: {
            globalDependencyValues: { value: any };
            arrayKeys: string[];
        }) {
            const shape = valueShape(globalDependencyValues.value.tree);
            const entries: Record<string, any> = {};
            for (const arrayKey of arrayKeys) {
                const [row, column] = arrayKey.split(",").map(Number);
                if (shape.kind === "tuple") {
                    entries[arrayKey] = me.fromAst(shape.entries[row]);
                } else if (shape.kind === "matrix") {
                    entries[arrayKey] = me.fromAst(
                        column === 0
                            ? rowAsMatrix(shape.rows[row])
                            : shape.rows[row][column - 1],
                    );
                }
            }
            return { setValue: { [VALUE_ENTRIES]: entries } };
        },
        inverseArrayDefinitionByKey({
            desiredStateVariableValues,
            globalDependencyValues,
            workspace,
        }: {
            desiredStateVariableValues: Record<string, Record<string, any>>;
            globalDependencyValues: { value: any };
            workspace: ValueEntriesWorkspace;
        }) {
            // Changes to several entries in one update are merged into one
            // value.
            const shape = valueShape(
                workspace.desiredTree ?? globalDependencyValues.value.tree,
            );
            let desiredTree: Tree;

            if (shape.kind === "tuple") {
                const entries = [...shape.entries];
                for (const [arrayKey, desired] of Object.entries(
                    desiredStateVariableValues[VALUE_ENTRIES],
                )) {
                    const [row] = arrayKey.split(",").map(Number);
                    entries[row] = convertValueToMathExpression(desired).tree;
                }
                desiredTree = shape.rebuild(entries);
            } else if (shape.kind === "matrix") {
                const rows = shape.rows.map((row) => [...row]);
                for (const [arrayKey, desired] of Object.entries(
                    desiredStateVariableValues[VALUE_ENTRIES],
                )) {
                    const [row, column] = arrayKey.split(",").map(Number);
                    const desiredTree =
                        convertValueToMathExpression(desired).tree;
                    if (column > 0) {
                        rows[row][column - 1] = desiredTree;
                    } else {
                        const newRow = rowFromValue(desiredTree);
                        if (newRow?.length !== rows[row].length) {
                            return { success: false };
                        }
                        rows[row] = newRow;
                    }
                }
                desiredTree = shape.rebuild(rows);
            } else {
                return { success: false };
            }

            workspace.desiredTree = desiredTree;

            return {
                success: true,
                instructions: [
                    {
                        setDependency: "value",
                        desiredValue: me.fromAst(desiredTree),
                    },
                ],
            };
        },
    };

    return stateVariableDefinitions;
}
