import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    updateMathInputValue,
    updateMatrixInputImmediateValue,
    updateMatrixInputNumColumns,
    updateMatrixInputNumRows,
    updateMatrixInputValue,
    updateMatrixInputValueToImmediateValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("MathInput tag tests", async () => {
    it("no arguments, copy matrixInput", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" /></p>
    <p>Matrix 2: <matrixInput extend="$mi1" name="mi2" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    <p>Matrix 4: <matrix extend="$mi1.immediateValue" name="m2" /></p>
    `,
        });

        async function check_items(value: any, immediateValue?: any) {
            if (immediateValue === undefined) {
                immediateValue = value;
            }

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .immediateValue.tree,
            ).eqls(immediateValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .value.tree,
            ).eqls(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .immediateValue.tree,
            ).eqls(immediateValue);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .value.tree,
            ).eqls(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .value.tree,
            ).eqls(value);
            expect(
                stateVariables[await resolvePathToNodeIdx("m2")].stateValues
                    .value.tree,
            ).eqls(immediateValue);
        }

        let matrixValue = [
            "matrix",
            ["tuple", 1, 1],
            ["tuple", ["tuple", "＿"]],
        ];

        await check_items(matrixValue);

        // type a in mi1
        await updateMatrixInputImmediateValue({
            latex: "a",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        let matrixImmediateValue = [
            "matrix",
            ["tuple", 1, 1],
            ["tuple", ["tuple", "a"]],
        ];

        await check_items(matrixValue, matrixImmediateValue);

        // update value (e.g., blur)
        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        matrixValue = matrixImmediateValue;
        await check_items(matrixValue);

        // add row to mi1
        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 2, 1],
            ["tuple", ["tuple", "a"], ["tuple", "＿"]],
        ];
        await check_items(matrixValue);

        // type b in second row of mi2
        await updateMatrixInputImmediateValue({
            latex: "b",
            rowInd: 1,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixImmediateValue = [
            "matrix",
            ["tuple", 2, 1],
            ["tuple", ["tuple", "a"], ["tuple", "b"]],
        ];
        await check_items(matrixValue, matrixImmediateValue);

        // update value (e.g., type enter)
        await updateMatrixInputValueToImmediateValue({
            rowInd: 1,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        matrixValue = matrixImmediateValue;
        await check_items(matrixValue);

        // add column to mi2
        await updateMatrixInputNumColumns({
            numColumns: 2,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "a", "＿"], ["tuple", "b", "＿"]],
        ];
        await check_items(matrixValue);

        // c and d in second column
        await updateMatrixInputValue({
            latex: "c",
            rowInd: 0,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await updateMatrixInputImmediateValue({
            latex: "d",
            rowInd: 1,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "a", "c"], ["tuple", "b", "＿"]],
        ];
        matrixImmediateValue = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "a", "c"], ["tuple", "b", "d"]],
        ];

        await check_items(matrixValue, matrixImmediateValue);

        // update value (e.g., blur)
        await updateMatrixInputValueToImmediateValue({
            rowInd: 1,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        matrixValue = matrixImmediateValue;
        await check_items(matrixValue);

        // remove row in mi2
        await updateMatrixInputNumRows({
            numRows: 1,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 1, 2],
            ["tuple", ["tuple", "a", "c"]],
        ];
        await check_items(matrixValue);

        // change second value
        await updateMatrixInputValue({
            latex: "e",
            rowInd: 0,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 1, 2],
            ["tuple", ["tuple", "a", "e"]],
        ];
        await check_items(matrixValue);

        // remove column in mi1
        await updateMatrixInputNumColumns({
            numColumns: 1,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        matrixValue = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "a"]]];

        await check_items(matrixValue);

        // change value
        await updateMatrixInputValue({
            latex: "f",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixValue = ["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "f"]]];
        await check_items(matrixValue);

        // values remembered when add back row and column
        await updateMatrixInputNumColumns({
            numColumns: 2,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "f", "e"], ["tuple", "b", "d"]],
        ];
        await check_items(matrixValue);

        // change values
        let stateVariables = await core.returnAllStateVariables(false, true);
        await updateMatrixInputValue({
            latex: "g",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            stateVariables,
            core,
        });
        await updateMatrixInputValue({
            latex: "h",
            rowInd: 0,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            stateVariables,
            core,
        });
        await updateMatrixInputValue({
            latex: "i",
            rowInd: 1,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            stateVariables,
            core,
        });
        await updateMatrixInputValue({
            latex: "j",
            rowInd: 1,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            stateVariables,
            core,
        });

        matrixValue = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "g", "h"], ["tuple", "i", "j"]],
        ];
        await check_items(matrixValue);
    });

    async function test_matrix_input({
        core,
        resolvePathToNodeIdx,
        initialValues,
        initialNumRows,
        initialNumColumns,
        numRowsName,
        numColumnsName,
        ignoreInputSizes = false,
        boundValueName,
        boundValueStartsAs = "matrix",
        defaultEntry = "\uff3f",
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        initialValues: (string | number)[][];
        initialNumRows?: number;
        initialNumColumns?: number;
        numRowsName?: string;
        numColumnsName?: string;
        ignoreInputSizes?: boolean;
        boundValueName?: string;
        boundValueStartsAs?: string;
        defaultEntry?: string | number;
    }) {
        async function check_items(ast: any, boundValueFormat?: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .value.tree,
            ).eqls(ast);
            expect(
                stateVariables[await resolvePathToNodeIdx("m1")].stateValues
                    .value.tree,
            ).eqls(ast);
            if (boundValueName) {
                const boundValueIdx =
                    await resolvePathToNodeIdx(boundValueName);
                if (
                    boundValueFormat === "tuple" ||
                    boundValueFormat === "vector" ||
                    boundValueFormat === "altvector"
                ) {
                    let vectorAst =
                        stateVariables[boundValueIdx].stateValues.value.tree;
                    expect(vectorAst).eqls([
                        boundValueFormat,
                        ...ast[2].slice(1).map((v) => v[1]),
                    ]);
                } else if (
                    boundValueFormat === "tupleTrans" ||
                    boundValueFormat === "vectorTrans" ||
                    boundValueFormat === "altvectorTrans"
                ) {
                    let operator = boundValueFormat.slice(
                        0,
                        boundValueFormat.length - 5,
                    );
                    let vectorAst =
                        stateVariables[boundValueIdx].stateValues.value.tree;
                    expect(vectorAst).eqls([
                        "^",
                        [operator, ...ast[2][1].slice(1)],
                        "T",
                    ]);
                } else if (
                    boundValueFormat === "tuplePrime" ||
                    boundValueFormat === "vectorPrime" ||
                    boundValueFormat === "altvectorPrime"
                ) {
                    let operator = boundValueFormat.slice(
                        0,
                        boundValueFormat.length - 5,
                    );
                    let vectorAst =
                        stateVariables[boundValueIdx].stateValues.value.tree;
                    expect(vectorAst).eqls([
                        "prime",
                        [operator, ...ast[2][1].slice(1)],
                    ]);
                } else {
                    expect(
                        stateVariables[boundValueIdx].stateValues.value.tree,
                    ).eqls(ast);
                }
            }
        }

        function expandValuesToFit(
            values: (string | number)[][],
            numRows: number,
            numColumns: number,
        ) {
            let newValues = values.map((row) => {
                row = [...row];
                if (row.length < numColumns) {
                    row.push(
                        ...Array(numColumns - row.length).fill(defaultEntry),
                    );
                }
                return row;
            });

            while (newValues.length < numRows) {
                newValues.push(Array(numColumns).fill(defaultEntry));
            }
            return newValues;
        }

        function astFromValues(
            values: (string | number)[][],
            numRows: number,
            numColumns: number,
        ) {
            return [
                "matrix",
                ["tuple", numRows, numColumns],
                [
                    "tuple",
                    ...values
                        .slice(0, numRows)
                        .map((row) => ["tuple", ...row.slice(0, numColumns)]),
                ],
            ];
        }

        let numRows = initialNumRows ?? initialValues.length;
        let numColumns =
            initialNumColumns ?? (numRows ? initialValues[0].length : 0);

        let values = expandValuesToFit(initialValues, numRows, numColumns);
        await check_items(
            astFromValues(values, numRows, numColumns),
            boundValueStartsAs,
        );

        if (boundValueName) {
            if (
                boundValueStartsAs === "tuple" ||
                boundValueStartsAs === "vector" ||
                boundValueStartsAs === "altvector"
            ) {
                // bound value stays a vector if add or delete a row
                numRows++;
                await updateMatrixInputNumRows({
                    numRows,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                values = expandValuesToFit(values, numRows, numColumns);
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                // change value
                values[numRows - 1][0] = "q";
                await updateMatrixInputValue({
                    latex: values[numRows - 1][0].toString(),
                    rowInd: numRows - 1,
                    colInd: 0,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                numRows--;
                await updateMatrixInputNumRows({
                    numRows,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                // bound value changes to matrix if add column
                numColumns++;
                await updateMatrixInputNumColumns({
                    numColumns,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                values = expandValuesToFit(values, numRows, numColumns);
                // omit boundValueStartsAs from now on, indicating it is a matrix
                await check_items(astFromValues(values, numRows, numColumns));
            } else if (
                boundValueStartsAs === "tupleTrans" ||
                boundValueStartsAs === "vectorTrans" ||
                boundValueStartsAs === "altvectorTrans" ||
                boundValueStartsAs === "tuplePrime" ||
                boundValueStartsAs === "vectorPrime" ||
                boundValueStartsAs === "altvectorPrime"
            ) {
                // bound value stays a transposed vector if add or delete a column
                numColumns++;
                await updateMatrixInputNumColumns({
                    numColumns,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                values = expandValuesToFit(values, numRows, numColumns);
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                // change value
                values[0][numColumns - 1] = "q";
                await updateMatrixInputValue({
                    latex: values[0][numColumns - 1].toString(),
                    rowInd: 0,
                    colInd: numColumns - 1,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                numColumns--;
                await updateMatrixInputNumColumns({
                    numColumns,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await check_items(
                    astFromValues(values, numRows, numColumns),
                    boundValueStartsAs,
                );

                // bound value changes to matrix if add row
                numRows++;
                await updateMatrixInputNumRows({
                    numRows,
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                values = expandValuesToFit(values, numRows, numColumns);
                // omit boundValueStartsAs from now on, indicating it is a matrix
                await check_items(astFromValues(values, numRows, numColumns));
            }
        }

        // progressively add up to three rows and columns to reveal any hidden items
        // (since no hidden items with bound values, just check 1 in this case)
        let numToAdd = boundValueName ? 1 : 3;
        let newValues = ["x", "y", "z"];
        for (let i = 0; i < numToAdd; i++) {
            numRows++;
            await updateMatrixInputNumRows({
                numRows,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            values = expandValuesToFit(values, numRows, numColumns);
            await check_items(astFromValues(values, numRows, numColumns));

            numColumns++;
            await updateMatrixInputNumColumns({
                numColumns,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            values = expandValuesToFit(values, numRows, numColumns);
            await check_items(astFromValues(values, numRows, numColumns));

            values[numRows - 1][numColumns - 1] = newValues[i];
            await updateMatrixInputValue({
                latex: values[numRows - 1][numColumns - 1].toString(),
                rowInd: numRows - 1,
                colInd: numColumns - 1,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });

            await check_items(astFromValues(values, numRows, numColumns));
        }

        // progressively remove those rows and columns
        for (let i = 0; i < numToAdd; i++) {
            numRows--;
            await updateMatrixInputNumRows({
                numRows,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await check_items(astFromValues(values, numRows, numColumns));

            numColumns--;
            await updateMatrixInputNumColumns({
                numColumns,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
            await check_items(astFromValues(values, numRows, numColumns));
        }

        // set size to zero
        numRows = 0;
        await updateMatrixInputNumRows({
            numRows,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(
            astFromValues(values, numRows, numColumns),
            undefined,
        );

        numColumns = 0;
        await updateMatrixInputNumColumns({
            numColumns,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(
            astFromValues(values, numRows, numColumns),
            undefined,
        );

        // add two rows and columns with inputs, if exist and aren't ignored, else add via actions
        numColumns = 2;
        numRows = 2;

        if (numColumnsName && !ignoreInputSizes) {
            await updateMathInputValue({
                latex: numColumns.toString(),
                componentIdx: await resolvePathToNodeIdx(numColumnsName),
                core,
            });
        } else {
            await updateMatrixInputNumColumns({
                numColumns,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
        }
        if (numRowsName && !ignoreInputSizes) {
            await updateMathInputValue({
                latex: numRows.toString(),
                componentIdx: await resolvePathToNodeIdx(numRowsName),
                core,
            });
        } else {
            await updateMatrixInputNumRows({
                numRows,
                componentIdx: await resolvePathToNodeIdx("mi1"),
                core,
            });
        }
        await check_items(astFromValues(values, numRows, numColumns));

        // update values
        values[0][0] = "e";
        values[0][1] = "f";
        values[1][0] = "g";
        values[1][1] = "h";

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                await updateMatrixInputValue({
                    latex: values[i][j].toString(),
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    rowInd: i,
                    colInd: j,
                    core,
                    stateVariables,
                });
            }
        }

        await check_items(astFromValues(values, numRows, numColumns));

        // if are to ignore inputs determining sizes, verify that they are ignored
        if (ignoreInputSizes && numRowsName && numColumnsName) {
            const numRowsIdx = await resolvePathToNodeIdx(numRowsName);
            const numColumnsIdx = await resolvePathToNodeIdx(numColumnsName);
            expect(stateVariables[numRowsIdx].stateValues.value.tree).eq(
                numRows,
            );
            expect(stateVariables[numColumnsIdx].stateValues.value.tree).eq(
                numColumns,
            );

            let ignoredNumColumns = 9;
            let ignoredNumRows = 8;

            await updateMathInputValue({
                latex: ignoredNumColumns.toString(),
                componentIdx: numColumnsIdx,
                core,
            });

            await updateMathInputValue({
                latex: ignoredNumRows.toString(),
                componentIdx: numRowsIdx,
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[numRowsIdx].stateValues.value.tree).eq(
                ignoredNumRows,
            );
            expect(stateVariables[numColumnsIdx].stateValues.value.tree).eq(
                ignoredNumColumns,
            );

            await check_items(astFromValues(values, numRows, numColumns));
        }
    }

    it("prefill with matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                ["a", "b"],
                ["c", "d"],
            ],
        });
    });

    it("prefill with matrix, start smaller", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" format="latex" prefill="\\begin{matrix}a & b\\\\c & d\\end{matrix}" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                ["a", "b"],
                ["c", "d"],
            ],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
        });
    });

    it("prefill with altvector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
        });
    });

    it("prefill with vector, start smaller", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with vector, start smaller", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with transpose of vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
        });
    });

    it("prefill with transpose of altvector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩^T" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
        });
    });

    it("prefill with transpose of vector, start smaller", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)^T" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with transpose of altvector, start smaller", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩^T" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with transpose of vector, start smaller, alternative format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="(a,b)'" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("prefill with transpose of altvector, start smaller, alternative format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" /></p>

    <p>Matrix 1: <matrixInput name="mi1" prefill="⟨a,b⟩'" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 0,
            initialNumColumns: 0,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
        });
    });

    it("bind to matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Matrix 1: <math name="m0" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                ["a", "b"],
                ["c", "d"],
            ],
            initialNumRows: 2,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
        });
    });

    it("bind to matrix, ignore size via definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathInput name="numColumns" prefill="5" /></p>

    <p>Matrix 1: <math name="m0" format="latex">\\begin{matrix}a & b\\\\c & d\\end{matrix}</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>

    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                ["a", "b"],
                ["c", "d"],
            ],
            initialNumRows: 2,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            ignoreInputSizes: true,
            boundValueName: "m0",
        });
    });

    it("bind to tuple", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Tuple 1: <math name="m0">(a,b)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
            initialNumRows: 2,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "tuple",
        });
    });

    it("bind to vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0" createVectors>(a,b)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
            initialNumRows: 2,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "vector",
        });
    });

    it("bind to altvector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0">⟨a,b⟩</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"]],
            initialNumRows: 2,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "altvector",
        });
    });

    it("bind to tuple, ignore size via definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathInput name="numColumns" prefill="7" /></p>

    <p>Tuple 1: <math name="m0">(a,b,c)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>

    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"], ["c"]],
            initialNumRows: 3,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            ignoreInputSizes: true,
            boundValueName: "m0",
            boundValueStartsAs: "tuple",
        });
    });

    it("bind to vector, ignore size via definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathInput name="numColumns" prefill="7" /></p>

    <p>Vector 1: <math name="m0" createVectors>(a,b,c)</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>

    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"], ["c"]],
            initialNumRows: 3,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            ignoreInputSizes: true,
            boundValueName: "m0",
            boundValueStartsAs: "vector",
        });
    });

    it("bind to altvector, ignore size via definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" prefill="1" /></p>
    <p>Number of columns: <mathInput name="numColumns" prefill="7" /></p>

    <p>Vector 1: <math name="m0">⟨a,b,c⟩</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>

    `,
        });
        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a"], ["b"], ["c"]],
            initialNumRows: 3,
            initialNumColumns: 1,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            ignoreInputSizes: true,
            boundValueName: "m0",
            boundValueStartsAs: "altvector",
        });
    });

    it("bind to transpose of tuple", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Tuple 1: <math name="m0">(a,b)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "tupleTrans",
        });
    });

    it("bind to transpose of vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0" createVectors>(a,b)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "vectorTrans",
        });
    });

    it("bind to transpose of altvector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0">⟨a,b⟩^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "altvectorTrans",
        });
    });

    it("bind to transpose of tuple, alternative format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Tuple 1: <math name="m0">(a,b)'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "tuplePrime",
        });
    });

    it("bind to transpose of vector, alternative format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0" createVectors>(a,b)'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "vectorPrime",
        });
    });

    it("bind to transpose of altvector, alternative format", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" bindValueTo="$mi1.numRows" /></p>
    <p>Number of columns: <mathInput name="numColumns" bindValueTo="$mi1.numColumns" /></p>

    <p>Vector 1: <math name="m0">⟨a,b⟩'</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b"]],
            initialNumRows: 1,
            initialNumColumns: 2,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            boundValueName: "m0",
            boundValueStartsAs: "altvectorPrime",
        });
    });

    it("bind to transpose of tuple, ignore size via definition", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Number of rows: <mathInput name="numRows" prefill="7" /></p>
    <p>Number of columns: <mathInput name="numColumns" prefill="1" /></p>

    <p>Tuple 1: <math name="m0">(a,b,c)^T</math></p>
    <p>Matrix 2: <matrixInput name="mi1" bindValueTo="$m0" numRows="$numRows" numColumns="$numColumns" /></p>
    <p>Matrix 3: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [["a", "b", "c"]],
            initialNumRows: 1,
            initialNumColumns: 3,
            numRowsName: "numRows",
            numColumnsName: "numColumns",
            ignoreInputSizes: true,
            boundValueName: "m0",
            boundValueStartsAs: "tupleTrans",
        });
    });

    it("matrixInput and splitting symbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="varWithNum">x2</math>
    <math name="noSplit" splitSymbols="false">xyz</math>
    <matrixInput name="varWithNum2" bindValueTo="$varWithNum" />
    <matrixInput name="noSplit2" splitSymbols="false" bindValueTo="$noSplit" />
    <matrix extend="$varWithNum2.value" name="varWithNum3" />
    <matrix extend="$noSplit2.value" name="noSplit3" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum")].stateValues
                .value.tree,
        ).eq("x2");
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum2")]
                .stateValues.value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "x2"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum3")]
                .stateValues.value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "x2"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit")].stateValues
                .value.tree,
        ).eq("xyz");
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit2")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyz"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit3")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyz"]]]);

        await updateMatrixInputValue({
            latex: "xu9j",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("varWithNum2"),
            core,
        });
        await updateMatrixInputValue({
            latex: "xyuv",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("noSplit2"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum2")]
                .stateValues.value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("varWithNum3")]
                .stateValues.value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xu9j"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit2")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("noSplit3")].stateValues
                .value.tree,
        ).eqls(["matrix", ["tuple", 1, 1], ["tuple", ["tuple", "xyuv"]]]);
    });

    it("default entry", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Matrix 1: <matrixInput name="mi1" numRows="2" numColumns="2" defaultEntry="0" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                [0, 0],
                [0, 0],
            ],
            defaultEntry: 0,
        });
    });

    it("no default entry, prefill sparse matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <p>Sparse matrix: <math name="sparse" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" prefill="$sparse" numRows="3" numColumns="3" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                [0, 0, "\uff3f"],
                [0, 3, "\uff3f"],
                ["\uff3f", "\uff3f", "\uff3f"],
            ],
        });
    });

    it("default entry, prefill sparse matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    <p>Sparse matrix: <math name="sparse" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" prefill="$sparse" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                [0, 0, 0],
                [0, 3, 0],
                [0, 0, 0],
            ],
            defaultEntry: 0,
        });
    });

    it("no default entry, bind value to sparse matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Sparse matrix: <math name="sparse1" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" bindValueTo="$sparse1" numRows="3" numColumns="3" /></p>
    <p>Matrix 2: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                [0, 0],
                [0, 3],
            ],
        });
    });

    it("default entry, bind value to sparse matrix", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Sparse matrix: <math name="sparse1" format="latex">
    \\begin{matrix}\\\\ & 3\\end{matrix}
    </math></p>
    <p>Matrix 1: <matrixInput name="mi1" bindValueTo="$sparse1" numRows="3" numColumns="3" defaultEntry="0" /></p>
    <p>Matrix 21: <matrix extend="$mi1.value" name="m1" /></p>
    `,
        });

        await test_matrix_input({
            core,
            resolvePathToNodeIdx,
            initialValues: [
                [0, 0],
                [0, 3],
            ],
            defaultEntry: 0,
        });
    });

    it("values from matrix prop using array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <setup>
    <matrix name="prefill">
      <row>a b</row>
      <row>c d</row>
    </matrix>
  </setup>
  <p>Matrix Input: <matrixInput name="mi" prefill="$prefill" /></p>
  <p name="pMatrix">Matrix: $mi.matrix</p>
  <p>Row number: <mathInput name="rNum" /></p>
  <p>Column number: <mathInput name="cNum" /></p>
  <p name="pRow">Row: $mi.matrix[$rNum]</p>
  <p name="pEntry">Entry: <math extend="$mi.matrix[$rNum][$cNum]" name="entry" /></p>
  <p>Change entry: <mathInput name="mi_entry">$entry</mathInput></p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pMatrix")].stateValues
                .text,
        ).eq("Matrix: [ [ a, b ], [ c, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: ＿");

        // pick second row
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("rNum"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: [ [ c, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: ＿");

        // pick first column
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("cNum"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: c");

        // change entry from bound value
        await updateMathInputValue({
            latex: "x",
            componentIdx: await resolvePathToNodeIdx("mi_entry"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pMatrix")].stateValues
                .text,
        ).eq("Matrix: [ [ a, b ], [ x, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: [ [ x, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: x");

        // change row
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("rNum"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: [ [ a, b ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: a");

        // change value from matrix input
        await updateMatrixInputValue({
            latex: "y",
            componentIdx: await resolvePathToNodeIdx("mi"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pMatrix")].stateValues
                .text,
        ).eq("Matrix: [ [ y, b ], [ x, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: [ [ y, b ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: y");

        // change column
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("cNum"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: b");

        // change entry from bound value
        await updateMathInputValue({
            latex: "z",
            componentIdx: await resolvePathToNodeIdx("mi_entry"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pMatrix")].stateValues
                .text,
        ).eq("Matrix: [ [ y, z ], [ x, d ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pRow")].stateValues.text,
        ).eq("Row: [ [ y, z ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("pEntry")].stateValues
                .text,
        ).eq("Entry: z");
    });

    it("parse scientific notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p><matrixInput name="mi1" prefill="5E+1" /> <math name="m1" extend="$mi1" /></p>
  <p><matrixInput name="mi2" prefill="5E+1" parseScientificNotation /> <math name="m2" extend="$mi2" /></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let entryName1 =
            stateVariables[await resolvePathToNodeIdx("mi1")].activeChildren[0]
                .componentIdx;
        let entryName2 =
            stateVariables[await resolvePathToNodeIdx("mi2")].activeChildren[0]
                .componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.text,
        ).eq("[ [ 5 E + 1 ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("[ [ 5 E + 1 ] ]");
        expect(stateVariables[entryName1].stateValues.rawRendererValue).eq(
            "5 E + 1",
        );
        expect(stateVariables[entryName1].stateValues.text).eq("5 E + 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.text,
        ).eq("[ [ 50 ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("[ [ 50 ] ]");
        expect(stateVariables[entryName2].stateValues.rawRendererValue).eq(
            "50",
        );
        expect(stateVariables[entryName2].stateValues.text).eq("50");

        await updateMatrixInputValue({
            latex: "2x-3E+2",
            componentIdx: await resolvePathToNodeIdx("mi1"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi1")].stateValues.text,
        ).eq("[ [ 2 x - 3 E + 2 ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("[ [ 2 x - 3 E + 2 ] ]");
        expect(stateVariables[entryName1].stateValues.rawRendererValue).eq(
            "2x-3E+2",
        );
        expect(stateVariables[entryName1].stateValues.text).eq("2 x - 3 E + 2");

        await updateMatrixInputValue({
            latex: "2x-3E+2",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            rowInd: 0,
            colInd: 0,
            core,
            stateVariables,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("mi2")].stateValues.text,
        ).eq("[ [ 2 x - 300 ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("[ [ 2 x - 300 ] ]");
        expect(stateVariables[entryName2].stateValues.rawRendererValue).eq(
            "2x-3E+2",
        );
        expect(stateVariables[entryName2].stateValues.text).eq("2 x - 300");
    });

    it("minComponentWidth attribute", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p>Specify min component width: <mathInput name="mcw" prefill="0" /></p>

      <p>Original: <matrixInput name="original" /></p>
      <p>Result: <matrixInput minComponentWidth="$mcw" name="result" /></p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let entry11OriginalName =
            stateVariables[await resolvePathToNodeIdx("original")]
                .activeChildren[0].componentIdx;
        let entry11ResultName =
            stateVariables[await resolvePathToNodeIdx("result")]
                .activeChildren[0].componentIdx;

        expect(
            stateVariables[await resolvePathToNodeIdx("mcw")].stateValues
                .minWidth,
        ).eq(50);
        expect(stateVariables[entry11OriginalName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(0);

        await updateMathInputValue({
            latex: "100",
            componentIdx: await resolvePathToNodeIdx("mcw"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(100);

        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("original"),
            core,
        });
        await updateMatrixInputNumColumns({
            numColumns: 2,
            componentIdx: await resolvePathToNodeIdx("original"),
            core,
        });
        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("result"),
            core,
        });
        await updateMatrixInputNumColumns({
            numColumns: 2,
            componentIdx: await resolvePathToNodeIdx("result"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        let entry12OriginalName =
            stateVariables[await resolvePathToNodeIdx("original")]
                .activeChildren[1].componentIdx;
        let entry21OriginalName =
            stateVariables[await resolvePathToNodeIdx("original")]
                .activeChildren[2].componentIdx;
        let entry22OriginalName =
            stateVariables[await resolvePathToNodeIdx("original")]
                .activeChildren[3].componentIdx;
        let entry12ResultName =
            stateVariables[await resolvePathToNodeIdx("result")]
                .activeChildren[1].componentIdx;
        let entry21ResultName =
            stateVariables[await resolvePathToNodeIdx("result")]
                .activeChildren[2].componentIdx;
        let entry22ResultName =
            stateVariables[await resolvePathToNodeIdx("result")]
                .activeChildren[3].componentIdx;

        expect(stateVariables[entry11OriginalName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry12OriginalName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry21OriginalName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry22OriginalName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(100);
        expect(stateVariables[entry12ResultName].stateValues.minWidth).eq(100);
        expect(stateVariables[entry21ResultName].stateValues.minWidth).eq(100);
        expect(stateVariables[entry22ResultName].stateValues.minWidth).eq(100);

        await updateMathInputValue({
            latex: "100x",
            componentIdx: await resolvePathToNodeIdx("mcw"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry12ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry21ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry22ResultName].stateValues.minWidth).eq(0);

        await updateMathInputValue({
            latex: "17",
            componentIdx: await resolvePathToNodeIdx("mcw"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(17);
        expect(stateVariables[entry12ResultName].stateValues.minWidth).eq(17);
        expect(stateVariables[entry21ResultName].stateValues.minWidth).eq(17);
        expect(stateVariables[entry22ResultName].stateValues.minWidth).eq(17);

        await updateMathInputValue({
            latex: "-20",
            componentIdx: await resolvePathToNodeIdx("mcw"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[entry11ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry12ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry21ResultName].stateValues.minWidth).eq(0);
        expect(stateVariables[entry22ResultName].stateValues.minWidth).eq(0);
    });

    it("valueChanged", async () => {
        let doenetML = `
    <p><matrixInput name="mi1" /> <math extend="$mi1" name="mi1a" /> <boolean extend="$mi1.valueChanged" name="mi1changed" /> <math extend="$mi1.immediateValue" name="mi1iva" /> <boolean extend="$mi1.immediateValueChanged" name="mi1ivchanged" /></p>
    <p><matrixInput name="mi2" prefill="(x,y)" /> <math extend="$mi2" name="mi2a" /> <boolean extend="$mi2.valueChanged" name="mi2changed" /> <math extend="$mi2.immediateValue" name="mi2iva" /> <boolean extend="$mi2.immediateValueChanged" name="mi2ivchanged" /></p>
    <p><matrixInput name="mi3" bindValueTo="$mi1" /> <math extend="$mi3" name="mi3a" /> <boolean extend="$mi3.valueChanged" name="mi3changed" /> <math extend="$mi3.immediateValue" name="mi3iva" /> <boolean extend="$mi3.immediateValueChanged" name="mi3ivchanged" /></p>
    <p><matrixInput name="mi4">$mi2.immediateValue</matrixInput> <math extend="$mi4" name="mi4a" /> <boolean extend="$mi4.valueChanged" name="mi4changed" /> <math extend="$mi4.immediateValue" name="mi4iva" /> <boolean extend="$mi4.immediateValueChanged" name="mi4ivchanged" /></p>

    `;

        async function check_items(
            [mi1, mi2, mi3, mi4]: [
                mi1: string,
                mi2: string,
                mi3: string,
                mi4: string,
            ],
            [mi1iv, mi2iv, mi3iv, mi4iv]: [
                mi1iv: string,
                mi2iv: string,
                mi3iv: string,
                mi4iv: string,
            ],
            [mi1changed, mi2changed, mi3changed, mi4changed]: [
                mi1changed: boolean,
                mi2changed: boolean,
                mi3changed: boolean,
                mi4changed: boolean,
            ],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged]: [
                mi1ivchanged: boolean,
                mi2ivchanged: boolean,
                mi3ivchanged: boolean,
                mi4ivchanged: boolean,
            ],
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("mi1")].stateValues
                    .text,
            ).eq(mi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2")].stateValues
                    .text,
            ).eq(mi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3")].stateValues
                    .text,
            ).eq(mi3);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4")].stateValues
                    .text,
            ).eq(mi4);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1a")].stateValues
                    .text,
            ).eq(mi1);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2a")].stateValues
                    .text,
            ).eq(mi2);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3a")].stateValues
                    .text,
            ).eq(mi3);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4a")].stateValues
                    .text,
            ).eq(mi4);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1iva")].stateValues
                    .text,
            ).eq(mi1iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2iva")].stateValues
                    .text,
            ).eq(mi2iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3iva")].stateValues
                    .text,
            ).eq(mi3iv);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4iva")].stateValues
                    .text,
            ).eq(mi4iv);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1changed")]
                    .stateValues.value,
            ).eq(mi1changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2changed")]
                    .stateValues.value,
            ).eq(mi2changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3changed")]
                    .stateValues.value,
            ).eq(mi3changed);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4changed")]
                    .stateValues.value,
            ).eq(mi4changed);

            expect(
                stateVariables[await resolvePathToNodeIdx("mi1ivchanged")]
                    .stateValues.value,
            ).eq(mi1ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi2ivchanged")]
                    .stateValues.value,
            ).eq(mi2ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi3ivchanged")]
                    .stateValues.value,
            ).eq(mi3ivchanged);
            expect(
                stateVariables[await resolvePathToNodeIdx("mi4ivchanged")]
                    .stateValues.value,
            ).eq(mi4ivchanged);
        }

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let mi1 = "[ [ \uff3f ] ]",
            mi2 = "[ [ x ], [ y ] ]",
            mi3 = "[ [ \uff3f ] ]",
            mi4 = "[ [ x ], [ y ] ]";
        let mi1iv = "[ [ \uff3f ] ]",
            mi2iv = "[ [ x ], [ y ] ]",
            mi3iv = "[ [ \uff3f ] ]",
            mi4iv = "[ [ x ], [ y ] ]";
        let mi1changed = false,
            mi2changed = false,
            mi3changed = false,
            mi4changed = false;
        let mi1ivchanged = false,
            mi2ivchanged = false,
            mi3ivchanged = false,
            mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in first marks only first immediate value as changed

        mi1iv = "[ [ z ] ]";
        mi1ivchanged = true;
        await updateMatrixInputImmediateValue({
            latex: "z",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in first marks only first value as changed
        mi1 = mi3 = mi3iv = mi1iv;
        mi1changed = true;
        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in second marks only second immediate value as changed

        mi4 = mi4iv = mi2iv = "[ [ a ], [ y ] ]";
        mi2ivchanged = true;
        await updateMatrixInputImmediateValue({
            latex: "a",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in second marks only second value as changed
        mi2 = mi2iv;
        mi2changed = true;
        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in third marks third immediate value as changed
        mi3iv = "[ [ b ] ]";
        mi3ivchanged = true;
        await updateMatrixInputImmediateValue({
            latex: "b",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in third marks third value as changed
        mi1 = mi1iv = mi3 = mi3iv;
        mi3changed = true;

        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in fourth marks fourth immediate value as changed

        mi4iv = "[ [ a ], [ c ] ]";
        mi4ivchanged = true;
        await updateMatrixInputImmediateValue({
            latex: "c",
            rowInd: 1,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in fourth marks fourth value as changed
        mi2 = mi2iv = mi4 = mi4iv;
        mi4changed = true;
        await updateMatrixInputValueToImmediateValue({
            rowInd: 1,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // reload

        ({ core, resolvePathToNodeIdx } = await createTestCore({ doenetML }));

        mi1 = "[ [ \uff3f ] ]";
        mi2 = "[ [ x ], [ y ] ]";
        mi3 = "[ [ \uff3f ] ]";
        mi4 = "[ [ x ], [ y ] ]";
        mi1iv = "[ [ \uff3f ] ]";
        mi2iv = "[ [ x ], [ y ] ]";
        mi3iv = "[ [ \uff3f ] ]";
        mi4iv = "[ [ x ], [ y ] ]";
        mi1changed = false;
        mi2changed = false;
        mi3changed = false;
        mi4changed = false;
        mi1ivchanged = false;
        mi2ivchanged = false;
        mi3ivchanged = false;
        mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in third marks only third immediate value as changed
        mi3iv = "[ [ z ] ]";
        mi3ivchanged = true;

        await updateMatrixInputImmediateValue({
            latex: "z",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in third marks first and third value/immediateValue as changed
        mi1 = mi1iv = mi3 = mi3iv;
        mi1changed = true;
        mi1ivchanged = true;
        mi3changed = true;

        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // type in fourth marks only fourth immediate value as changed

        mi4iv = "[ [ a ], [ y ] ]";
        mi4ivchanged = true;

        await updateMatrixInputImmediateValue({
            latex: "a",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // update value in fourth marks third and fourth value/immediateValue as changed
        mi2 = mi2iv = mi4 = mi4iv;
        mi2changed = true;
        mi2ivchanged = true;
        mi4changed = true;
        await updateMatrixInputValueToImmediateValue({
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // reload

        ({ core, resolvePathToNodeIdx } = await createTestCore({ doenetML }));
        mi1 = "[ [ \uff3f ] ]";
        mi2 = "[ [ x ], [ y ] ]";
        mi3 = "[ [ \uff3f ] ]";
        mi4 = "[ [ x ], [ y ] ]";
        mi1iv = "[ [ \uff3f ] ]";
        mi2iv = "[ [ x ], [ y ] ]";
        mi3iv = "[ [ \uff3f ] ]";
        mi4iv = "[ [ x ], [ y ] ]";
        mi1changed = false;
        mi2changed = false;
        mi3changed = false;
        mi4changed = false;
        mi1ivchanged = false;
        mi2ivchanged = false;
        mi3ivchanged = false;
        mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // adding row to first marks first value/immediateValue as changed

        mi1 = mi3 = mi3iv = mi1iv = "[ [ \uff3f ], [ \uff3f ] ]";
        mi1changed = mi1ivchanged = true;
        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("mi1"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // adding column to second marks second value/immediateValue as changed

        mi2 = mi4 = mi4iv = mi2iv = "[ [ x, \uff3f ], [ y, \uff3f ] ]";
        mi2changed = mi2ivchanged = true;
        await updateMatrixInputNumColumns({
            numColumns: 2,
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // reload

        ({ core, resolvePathToNodeIdx } = await createTestCore({ doenetML }));
        mi1 = "[ [ \uff3f ] ]";
        mi2 = "[ [ x ], [ y ] ]";
        mi3 = "[ [ \uff3f ] ]";
        mi4 = "[ [ x ], [ y ] ]";
        mi1iv = "[ [ \uff3f ] ]";
        mi2iv = "[ [ x ], [ y ] ]";
        mi3iv = "[ [ \uff3f ] ]";
        mi4iv = "[ [ x ], [ y ] ]";
        mi1changed = false;
        mi2changed = false;
        mi3changed = false;
        mi4changed = false;
        mi1ivchanged = false;
        mi2ivchanged = false;
        mi3ivchanged = false;
        mi4ivchanged = false;

        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // adding column to third marks first and third value/immediateValue as changed
        mi1 = mi3 = mi3iv = mi1iv = "[ [ \uff3f ], [ \uff3f ] ]";
        mi3changed = mi3ivchanged = mi1changed = mi1ivchanged = true;
        await updateMatrixInputNumRows({
            numRows: 2,
            componentIdx: await resolvePathToNodeIdx("mi3"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );

        // subtracting row from fourth marks second and fourth value/immediateValue as changed
        mi2 = mi4 = mi4iv = mi2iv = "[ [ x ] ]";
        mi4changed = mi4ivchanged = mi2changed = mi2ivchanged = true;
        await updateMatrixInputNumRows({
            numRows: 1,
            componentIdx: await resolvePathToNodeIdx("mi4"),
            core,
        });
        await check_items(
            [mi1, mi2, mi3, mi4],
            [mi1iv, mi2iv, mi3iv, mi4iv],
            [mi1changed, mi2changed, mi3changed, mi4changed],
            [mi1ivchanged, mi2ivchanged, mi3ivchanged, mi4ivchanged],
        );
    });

    it("warning if no description or label", async () => {
        let { core } = await createTestCore({
            doenetML: `
                <matrixInput />
                <matrixInput><shortDescription>hello</shortDescription></matrixInput>
                <matrixInput><label>hello</label></matrixInput>
            `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `must have a short description or a label`,
        );
        expect(errorWarnings.warnings[0].position.start.line).eq(2);
        expect(errorWarnings.warnings[0].position.end.line).eq(2);
    });
});
