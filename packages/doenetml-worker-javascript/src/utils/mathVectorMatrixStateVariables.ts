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
 *   `i`;
 * - a matrix: `[i]` is row `i`, as a 1×n matrix, and `[i][j]` is the entry
 *   in row `i` and column `j`;
 * - anything else is a scalar, which has no entries.
 *
 * An index after an entry indexes the entry the same way, while it has
 * entries (`selectValueEntry`): `$m[1][2]` of `((1,2),(3,4))` is `2`.
 *
 * The array holds the first two levels, as a matrix does: key `i,0` is
 * entry `i + 1` as a whole (an entry of a tuple, or a row of a matrix), and
 * key `i,j` with `j ≥ 1` entry `j` of it, named `__valueEntry2` for key
 * `1,0` and `__valueEntry2_3` for key `1,3` (`valueEntriesSize`). A longer
 * path (`$m[1][2][1]`) is a variable of its own, made when a reference asks
 * for it (`__valuePath_1_2_1`, `ensureValuePathVariable`), so nothing is made
 * for the deeper paths no reference names, and there is no limit to the
 * depth. As the value changes shape, an entry or a path names an entry, a
 * row or nothing, as an index past the end does.
 *
 * It is not public, so `$m.__valueEntries` names nothing; a reference reaches
 * it only through `variableForIndexAsProp` (or `.value[i]`), which read it
 * although it is not public (`isValueEntriesVariable`).
 */
export const VALUE_ENTRIES = "__valueEntries";

/** The prefix of the entries of {@link VALUE_ENTRIES}. */
export const VALUE_ENTRY_PREFIX = "__valueEntry";

/**
 * The prefix of the variable for an index path of three or more indices
 * into a math value (`__valuePath_1_2_1` for `$m[1][2][1]`), made when a
 * reference asks for it (`ensureValuePathVariable`).
 */
export const VALUE_PATH_PREFIX = "__valuePath_";

/**
 * Where the writes through an index into a math value are gathered, so the
 * writes of one update are merged into one value.
 */
export const VALUE_PATH_WRITES = "__valuePathWrites";

/**
 * Whether `name` is {@link VALUE_ENTRIES} or one of its entries, which a
 * reference with an index reads although it is not public.
 */
export function isValueEntriesVariable(name: string | undefined): boolean {
    return (
        name === VALUE_ENTRIES ||
        Boolean(
            name?.startsWith(VALUE_ENTRY_PREFIX) ||
            name?.startsWith(VALUE_PATH_PREFIX),
        )
    );
}

/**
 * Whether a path part written `name[index]` is an index into the value
 * (`$P.value[2]`, in any case), which reads what the bare index (`$P[2]`)
 * reads (D27): the component has a `variableForIndexAsProp`, and the part is
 * not already resolved as a property of a list's entries (`fromListEntry`).
 * Recognized by the name the author wrote, before aliases are substituted,
 * since `value` is an alias of another property on some components (a
 * point's `coords`), which takes no index of its own.
 */
export function isIndexIntoValue(
    name: string | undefined,
    index: unknown[],
    componentClass: any,
    fromListEntry: boolean,
): boolean {
    return (
        !fromListEntry &&
        index.length > 0 &&
        name?.toLowerCase() === "value" &&
        Boolean(componentClass?.variableForIndexAsProp)
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
 * The tuple that holds the entries of `tree` when it is a tuple, vector or
 * list (`tree` itself) or a transposed or primed one (the tuple inside it),
 * or `undefined`. Its entries are its elements after the operator.
 */
function tupleOf(tree: Tree): Tree[] | undefined {
    if (!Array.isArray(tree)) {
        return undefined;
    }
    const operator = tree[0] as string;
    if (vectorAndListOperators.includes(operator)) {
        return tree;
    }
    const inner = tree[1];
    if (
        Array.isArray(inner) &&
        vectorOperators.includes(inner[0] as string) &&
        ((operator === "^" && tree[2] === "T") || operator === "prime")
    ) {
        return inner;
    }
    return undefined;
}

/**
 * Whether `tree` is a matrix whose rows all have the same length, which an
 * index reads by row.
 */
function isMatrixWithRows(tree: Tree): boolean {
    if (!Array.isArray(tree) || tree[0] !== "matrix") {
        return false;
    }
    const rows = (tree[2] as Tree[]).slice(1) as Tree[][];
    return rows.every((row) => row.length === rows[0].length);
}

/**
 * The shape of a math value for an index into it: a tuple of entries, a
 * matrix of rows, or a scalar, with a function that puts changed entries (or
 * rows) back into a value of the same form. It copies the entries or rows,
 * so it is used only to write them (the inverse); a read takes what it needs
 * from the value as it is.
 */
function valueShape(tree: Tree): ValueShape {
    const tuple = tupleOf(tree);
    if (tuple) {
        return {
            kind: "tuple",
            entries: tuple.slice(1),
            rebuild: (entries): Tree =>
                tuple === tree
                    ? [tuple[0] as string, ...entries]
                    : [
                          (tree as Tree[])[0] as string,
                          [tuple[0] as string, ...entries],
                          ...(tree as Tree[]).slice(2),
                      ],
        };
    }
    if (isMatrixWithRows(tree)) {
        const size = (tree as Tree[])[1];
        const rows = ((tree as Tree[])[2] as Tree[])
            .slice(1)
            .map((row) => (row as Tree[]).slice(1));
        return {
            kind: "matrix",
            rows,
            rebuild: (rows) => [
                "matrix",
                size,
                ["tuple", ...rows.map((row): Tree => ["tuple", ...row])],
            ],
        };
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
 * What an index into a math value has reached: a value, or a row of a
 * matrix, which the next index selects an entry of (`$M[1][2]`) and which is
 * read as a 1×n matrix when no index follows (`$M[1]`).
 */
type ValueNode = { tree: Tree } | { row: Tree[] };

/** Entry `index` (from 1) of `node`, without copying the others. */
function entryAt(
    node: ValueNode,
    index: number,
): ValueNode | "pastEnd" | "scalar" {
    if ("row" in node) {
        return index <= node.row.length
            ? { tree: node.row[index - 1] }
            : "pastEnd";
    }
    const tuple = tupleOf(node.tree);
    if (tuple) {
        return index < tuple.length ? { tree: tuple[index] } : "pastEnd";
    }
    if (isMatrixWithRows(node.tree)) {
        const row = ((node.tree as Tree[])[2] as Tree[][])[index];
        return row === undefined ? "pastEnd" : { row: row.slice(1) };
    }
    return "scalar";
}

/** The value `node` is: a row as a 1×n matrix. */
function treeOf(node: ValueNode): Tree {
    return "row" in node ? rowAsMatrix(node.row) : node.tree;
}

/**
 * What `indices` (each from 1) select in the math value `tree`, as
 * `$m[i][j]…` reads it (D27, "Values with entries"): an index selects an
 * entry while the value has one at that level -- an entry of a tuple, a row
 * of a matrix, then an entry of that row -- so a tuple of tuples is indexed
 * at both levels, and a tuple holding a matrix at three. It names nothing
 * past the end of what it selects among (`"pastEnd"`), and in a scalar,
 * which has no entries (`"scalar"`), which is reported.
 */
export function selectValueEntry(
    tree: Tree,
    indices: number[],
): { tree: Tree } | "pastEnd" | "scalar" {
    let node: ValueNode = { tree };
    for (const index of indices) {
        if (!(Number.isInteger(index) && index > 0)) {
            return "pastEnd";
        }
        const entry = entryAt(node, index);
        if (typeof entry === "string") {
            return entry;
        }
        node = entry;
    }
    return { tree: treeOf(node) };
}

/**
 * `tree` with what `indices` select in it (`selectValueEntry`) replaced by
 * `desired`, in a value of the same form, or `undefined` when the indices
 * name nothing, or name a row and `desired` is not a row of its length.
 */
export function withValueEntry(
    tree: Tree,
    indices: number[],
    desired: Tree,
): Tree | undefined {
    const result = replaceEntry({ tree }, indices, desired);
    return result && "tree" in result ? result.tree : undefined;
}

function replaceEntry(
    node: ValueNode,
    indices: number[],
    desired: Tree,
): ValueNode | undefined {
    if (indices.length === 0) {
        if ("row" in node) {
            const row = rowFromValue(desired);
            return row?.length === node.row.length ? { row } : undefined;
        }
        return { tree: desired };
    }
    const [index, ...rest] = indices;
    const entry = entryAt(node, index);
    if (typeof entry === "string") {
        return undefined;
    }
    const replaced = replaceEntry(entry, rest, desired);
    if (!replaced) {
        return undefined;
    }
    if ("row" in node) {
        const row = [...node.row];
        row[index - 1] = (replaced as { tree: Tree }).tree;
        return { row };
    }
    const shape = valueShape(node.tree);
    if (shape.kind === "tuple") {
        const entries = [...shape.entries];
        entries[index - 1] = (replaced as { tree: Tree }).tree;
        return { tree: shape.rebuild(entries) };
    }
    if (shape.kind === "matrix") {
        const rows = [...shape.rows];
        rows[index - 1] = (replaced as { row: Tree[] }).row;
        return { tree: shape.rebuild(rows) };
    }
    return undefined;
}

/**
 * How many entries the next index selects among in `node`: those of a
 * tuple, vector or list, the rows of a matrix, or the entries of a row; `0`
 * for a scalar.
 */
function numEntriesOf(node: ValueNode): number {
    if ("row" in node) {
        return node.row.length;
    }
    const tuple = tupleOf(node.tree);
    if (tuple) {
        return tuple.length - 1;
    }
    return isMatrixWithRows(node.tree)
        ? ((node.tree as Tree[])[2] as Tree[]).length - 1
        : 0;
}

/**
 * The size of {@link VALUE_ENTRIES} for the math value `tree`: the number
 * of its entries, then one more than the most entries any of them has (key
 * `0` is an entry as a whole), so `[m, n + 1]` for an m×n matrix and
 * `[n, 1]` for a tuple of n scalars. Only these two levels are counted, so
 * a deeper value costs no more (`ensureValuePathVariable`).
 */
function valueEntriesSize(tree: Tree): [number, number] {
    const numEntries = numEntriesOf({ tree });
    let mostInner = 0;
    for (let index = 1; index <= numEntries; index++) {
        const entry = entryAt({ tree }, index);
        if (typeof entry !== "string") {
            mostInner = Math.max(mostInner, numEntriesOf(entry));
        }
    }
    return [numEntries, mostInner + 1];
}

/** The indices (each from 1) that key `arrayKey` of {@link VALUE_ENTRIES} names. */
function indicesOfArrayKey(arrayKey: string): number[] {
    const [row, column] = arrayKey.split(",").map(Number);
    return column === 0 ? [row + 1] : [row + 1, column];
}

/**
 * Whether `indices` name nothing in the math `value` because they reach a
 * scalar, which has no entries (`selectValueEntry`), which is reported,
 * unlike an index past the end, which is silent since the length can change
 * (#1499). A blank, the value of a `<mathInput>` before anything is
 * entered, is not reported: the author expects it to be given entries.
 */
export function indicesIntoScalar(
    value: Expression | undefined,
    indices: number[],
): boolean {
    const tree = value?.tree;
    if (tree === undefined || tree === BLANK) {
        return false;
    }
    return selectValueEntry(tree, indices) === "scalar";
}

interface ValueEntriesWorkspace {
    desiredTree?: Tree;
}

/**
 * The indices (each from 1) that the name of an entry of
 * {@link VALUE_ENTRIES} (`__valueEntry2`) or of a value path
 * (`__valuePath_2_1_3`) holds after `prefix`, or `undefined` when it holds
 * anything but positive integers.
 */
function indicesOfName(name: string, prefix: string): number[] | undefined {
    const indices = name.slice(prefix.length).split("_").map(Number);
    return indices.every((index) => Number.isInteger(index) && index > 0)
        ? indices
        : undefined;
}

/** The shadowing of an entry of a math value, which is a math. */
function valueEntryShadowing() {
    return {
        createComponentOfType: "math",
        addAttributeComponentsShadowingStateVariables:
            returnNumberDisplayAttributeComponentShadowing(),
    };
}

/**
 * Give `component`, whose `value` is a math, the state variable `name` for
 * an index path into its value of three or more indices
 * (`__valuePath_1_2_1`, which `$m[1][2][1]` reads), if it does not have it
 * yet. It holds what the
 * indices select (`selectValueEntry`), and nothing where they name nothing,
 * so a reference to it is missing (VAL-5). A write through it is a write of
 * what it selects, gathered with the others of the same update in
 * {@link VALUE_PATH_WRITES}.
 *
 * Such a path is made only when a reference asks for it, one variable per
 * path, so a deep value costs nothing for the paths no reference names,
 * and there is no limit to how deep an index reaches.
 */
function ensureValuePathVariable({
    core,
    component,
    name,
    addStateVariablePlaceholder,
}: {
    core: any;
    component: any;
    name: string;
    /** `addStateVariablePlaceholder` of the core, passed in to keep this
     * module free of the core's. */
    addStateVariablePlaceholder: (args: {
        core: any;
        component: any;
        stateVariable: string;
        definition: Record<string, any>;
    }) => void;
}) {
    if (name in component.state || !name.startsWith(VALUE_PATH_PREFIX)) {
        return;
    }
    const indices = indicesOfName(name, VALUE_PATH_PREFIX);
    if (!indices) {
        return;
    }
    const key = indices.join("_");
    addStateVariablePlaceholder({
        core,
        component,
        stateVariable: name,
        definition: {
            shadowingInstructions: valueEntryShadowing(),
            returnDependencies: () => ({
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
                writes: {
                    dependencyType: "stateVariable",
                    variableName: VALUE_PATH_WRITES,
                },
            }),
            definition({ dependencyValues }: any) {
                const selected = selectValueEntry(
                    dependencyValues.value.tree,
                    indices,
                );
                return {
                    setValue: {
                        [name]:
                            typeof selected === "string"
                                ? undefined
                                : me.fromAst(selected.tree),
                    },
                };
            },
            inverseDefinition({ desiredStateVariableValues }: any) {
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "writes",
                            desiredValue: {
                                [key]: desiredStateVariableValues[name],
                            },
                        },
                    ],
                };
            },
        },
    });
}

/**
 * The definitions of {@link VALUE_ENTRIES} and {@link VALUE_PATH_WRITES},
 * for a component whose `value` is a math expression.
 */
export function returnValueEntriesStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions[VALUE_ENTRIES] = {
        shadowingInstructions: valueEntryShadowing(),
        isArray: true,
        numDimensions: 2,
        entryPrefixes: [VALUE_ENTRY_PREFIX],
        returnEntryDimensions: () => 0,
        /**
         * An index takes as many indices as the value has levels
         * (`arrayEntryNamesFromPropIndex` does not count them against the
         * array's two dimensions): one or two indices are an entry of the
         * array, and a longer path a variable of its own
         * (`ensureIndexPathVariable`).
         */
        indexesAnyDepth: true,
        /**
         * Whether `propIndex` names nothing because it reaches a scalar,
         * which has no entries (`indicesIntoScalar`).
         * `arrayEntryNamesFromPropIndex` reports such an index.
         */
        async indexIntoScalar(component: any, propIndex: number[]) {
            return indicesIntoScalar(
                await component.stateValues.value,
                propIndex,
            );
        },
        ensureIndexPathVariable: ensureValuePathVariable,
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
            return VALUE_ENTRY_PREFIX + indicesOfArrayKey(arrayKey).join("_");
        },
        arrayVarNameFromPropIndex(propIndex: number[], varName: string) {
            if (varName !== VALUE_ENTRIES || propIndex.length === 0) {
                return null;
            }
            return propIndex.length <= 2
                ? VALUE_ENTRY_PREFIX + propIndex.join("_")
                : VALUE_PATH_PREFIX + propIndex.join("_");
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
            return valueEntriesSize(dependencyValues.value.tree);
        },
        returnArrayDependenciesByKey() {
            return {
                globalDependencies: {
                    value: {
                        dependencyType: "stateVariable",
                        variableName: "value",
                    },
                    writes: {
                        dependencyType: "stateVariable",
                        variableName: VALUE_PATH_WRITES,
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
            // Each requested entry is read from the value as it is, without
            // copying the rest; a row of a matrix copies only that row.
            const tree = globalDependencyValues.value.tree;
            const entries: Record<string, any> = {};
            for (const arrayKey of arrayKeys) {
                const selected = selectValueEntry(
                    tree,
                    indicesOfArrayKey(arrayKey),
                );
                entries[arrayKey] =
                    typeof selected === "string"
                        ? undefined
                        : me.fromAst(selected.tree);
            }
            return { setValue: { [VALUE_ENTRIES]: entries } };
        },
        inverseArrayDefinitionByKey({
            desiredStateVariableValues,
        }: {
            desiredStateVariableValues: Record<string, Record<string, any>>;
        }) {
            const desiredValue: Record<string, any> = {};
            for (const [arrayKey, desired] of Object.entries(
                desiredStateVariableValues[VALUE_ENTRIES],
            )) {
                desiredValue[indicesOfArrayKey(arrayKey).join("_")] = desired;
            }
            return {
                success: true,
                instructions: [{ setDependency: "writes", desiredValue }],
            };
        },
    };

    /**
     * Where a write through an index into the value is gathered, whether
     * through an entry of {@link VALUE_ENTRIES} or a longer path
     * (`ensureValuePathVariable`), keyed by the indices joined by `_`: one
     * update can write several (a point whose coordinates are `$m[1][1]`
     * and `$m[1][2]`), and they are merged into one value. A path that
     * names nothing, and a row given a value that is not a row of its
     * length, take no write (`withValueEntry`).
     */
    stateVariableDefinitions[VALUE_PATH_WRITES] = {
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition: () => ({ setValue: { [VALUE_PATH_WRITES]: null } }),
        inverseDefinition({
            desiredStateVariableValues,
            dependencyValues,
            workspace,
        }: {
            desiredStateVariableValues: Record<string, Record<string, any>>;
            dependencyValues: { value: any };
            workspace: ValueEntriesWorkspace;
        }) {
            let desiredTree: Tree | undefined =
                workspace.desiredTree ?? dependencyValues.value.tree;
            for (const [key, desired] of Object.entries(
                desiredStateVariableValues[VALUE_PATH_WRITES] ?? {},
            )) {
                desiredTree = withValueEntry(
                    desiredTree!,
                    key.split("_").map(Number),
                    convertValueToMathExpression(desired).tree,
                );
                if (desiredTree === undefined) {
                    return { success: false };
                }
            }

            workspace.desiredTree = desiredTree;

            return {
                success: true,
                instructions: [
                    {
                        setDependency: "value",
                        desiredValue: me.fromAst(desiredTree!),
                    },
                ],
            };
        },
    };

    return stateVariableDefinitions;
}
