import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveMath,
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputNumColumns,
    updateMatrixInputNumRows,
    updateMatrixInputValue,
    updateSelectedIndices,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { numberToLetters } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Matrix tag tests", async () => {
    async function test_matrix({
        matrixML,
        initialValues,
        initialNumRows,
        initialNumColumns,
        numRowsName,
        numColumnsName,
        initialDefaultEntry = 0,
        defaultEntryName,
    }: {
        matrixML: string;
        initialValues: (number | string | (number | string)[])[][];
        initialNumRows?: number;
        initialNumColumns?: number;
        numRowsName?: string;
        numColumnsName?: string;
        initialDefaultEntry?: number | string;
        defaultEntryName?: string;
    }) {
        let doenetML = `
    ${matrixML}
    <p>Copy 1: <matrix name="A1" extend="$A" /></p>
    <p>Copy 2: <matrix name="A2" extend="$A.value" /></p>
    <p>Copy 3: <matrix name="A3">$A</matrix></p>
    <p>Copy 4: <matrix name="A4">$A.value</matrix></p>
    <p>Copy 5: <matrix name="A5"><matrix extend="$A1" /></matrix></p>
    <p>Copy 6: <matrix name="A6"><matrix extend="$A1.value" /></matrix></p>
    <p>Modify: <matrixInput bindValueTo="$A" name="mi" /></p>
    <p>Modify copy 1: <matrixInput bindValueTo="$A1" name="mi1" /></p>
    <p>Modify copy 2: <matrixInput bindValueTo="$A2" name="mi2" /></p>
    <p>Modify copy 3: <matrixInput bindValueTo="$A3" name="mi3" /></p>
    <p>Modify copy 4: <matrixInput bindValueTo="$A4" name="mi4" /></p>
    <p>Modify copy 5: <matrixInput bindValueTo="$A5" name="mi5" /></p>
    <p>Modify copy 6: <matrixInput bindValueTo="$A6" name="mi6" /></p>
    <p>Size: <numberList extend="$A.matrixSize" name="matrixSize" />, 
      numRows: <integer extend="$A.numRows" name="numRows" />,
      numColumns: <integer extend="$A.numColumns" name="numColumns" />
    </p>
    <p>Size 1: <numberList extend="$A1.matrixSize" name="matrixSize1" />, 
      numRows 1: <integer extend="$A1.numRows" name="numRows1" />,
      numColumns 1: <integer extend="$A1.numColumns" name="numColumns1" />
    </p>
    <p>Size 2: <numberList extend="$A2.matrixSize" name="matrixSize2" />, 
      numRows 2: <integer extend="$A2.numRows" name="numRows2" />,
      numColumns 2: <integer extend="$A2.numColumns" name="numColumns2" />
    </p>
    <p>Size 3: <numberList extend="$A3.matrixSize" name="matrixSize3" />, 
      numRows 3: <integer extend="$A3.numRows" name="numRows3" />,
      numColumns 3: <integer extend="$A3.numColumns" name="numColumns3" />
    </p>
    <p>Size 4: <numberList extend="$A4.matrixSize" name="matrixSize4" />, 
      numRows 4: <integer extend="$A4.numRows" name="numRows4" />,
      numColumns 4: <integer extend="$A4.numColumns" name="numColumns4" />
    </p>
    <p>Size 5: <numberList extend="$A5.matrixSize" name="matrixSize5" />, 
      numRows 5: <integer extend="$A5.numRows" name="numRows5" />,
      numColumns 5: <integer extend="$A5.numColumns" name="numColumns5" />
    </p>
    <p>Size 6: <numberList extend="$A6.matrixSize" name="matrixSize6" />, 
      numRows 6: <integer extend="$A6.numRows" name="numRows6" />,
      numColumns 6: <integer extend="$A6.numColumns" name="numColumns6" />
    </p>
    `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        async function check_items(
            matrixValue: (number | string | (number | string)[])[][],
        ) {
            let numRows = matrixValue.length;
            let numColumns = matrixValue.length > 0 ? matrixValue[0].length : 0;

            let matrixAst = [
                "matrix",
                ["tuple", numRows, numColumns],
                ["tuple", ...matrixValue.map((row) => ["tuple", ...row])],
            ];

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[await resolvePathToNodeIdx("A")].stateValues
                    .matrixSize,
            ).eqls([numRows, numColumns]);

            for (let i of ["", 1, 2, 3, 4, 5, 6]) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`A${i}`)]
                        .stateValues.value.tree,
                ).eqls(matrixAst);
                expect(
                    stateVariables[
                        await resolvePathToNodeIdx(`A${i}`)
                    ].stateValues.matrix.map((row: any) =>
                        row.map((v: any) => v.tree),
                    ),
                ).eqls(matrixValue);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`mi${i}`)]
                        .stateValues.value.tree,
                ).eqls(matrixAst);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`matrixSize${i}`)]
                        .stateValues.numbers,
                ).eqls([numRows, numColumns]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`numRows${i}`)]
                        .stateValues.value,
                ).eq(numRows);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`numColumns${i}`)]
                        .stateValues.value,
                ).eq(numColumns);
            }
        }

        function paddedValues(
            values: (number | string | (number | string)[])[][],
            numRows: number,
            numColumns: number,
            defaultEntry: number | string,
            trim: boolean = true,
        ) {
            let newValues = trim ? values.slice(0, numRows) : [...values];
            newValues = newValues.map((row) => {
                if (trim) {
                    row = row.slice(0, numColumns);
                } else {
                    row = [...row];
                }
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

        let numRows = initialNumRows ?? initialValues.length;
        let numColumns =
            initialNumColumns ?? (numRows ? initialValues[0].length : 0);
        let defaultEntry = initialDefaultEntry;

        let values = initialValues.map((row) => [...row]);

        await check_items(
            paddedValues(values, numRows, numColumns, defaultEntry),
        );

        if (defaultEntryName !== undefined) {
            // change default entry
            defaultEntry = "k";
            await updateMathInputValue({
                latex: defaultEntry,
                componentIdx: await resolvePathToNodeIdx(defaultEntryName),
                core,
            });
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );

            // change first entry, which locks in all displayed default entries
            values[0][0] = "y";
            await updateMatrixInputValue({
                latex: "y",
                componentIdx: await resolvePathToNodeIdx("mi"),
                rowInd: 0,
                colInd: 0,
                core,
            });

            // lock in displayed default values
            values = paddedValues(
                values,
                numRows,
                numColumns,
                defaultEntry,
                false,
            );
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );

            // changing default value doesn't change the displayed values
            // (it will affect values added when increasing number of rows/column later)
            defaultEntry = "j";
            await updateMathInputValue({
                latex: defaultEntry,
                componentIdx: await resolvePathToNodeIdx(defaultEntryName),
                core,
            });
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );
        }

        // change the values until 9 inputs have been tested
        if (numRows > 0 && numColumns > 0) {
            let ind = 0;
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            // Note: changing values locks in displayed default values
            values = paddedValues(
                values,
                numRows,
                numColumns,
                defaultEntry,
                false,
            );
            while (ind < 7) {
                for (let i = 0; i < numRows; i++) {
                    for (let j = 0; j < numColumns; j++) {
                        ind++;
                        let miInd = ind % 7 || "";
                        values[i][j] = ind;
                        await updateMatrixInputValue({
                            latex: ind.toString(),
                            componentIdx: await resolvePathToNodeIdx(
                                `mi${miInd}`,
                            ),
                            rowInd: i,
                            colInd: j,
                            core,
                            stateVariables,
                        });
                    }
                }

                await check_items(
                    paddedValues(values, numRows, numColumns, defaultEntry),
                );
            }
        }

        // cannot change number of rows or columns directly
        for (let i = 0; i < 7; i++) {
            await updateMatrixInputNumRows({
                numRows: numRows + i + 1,
                componentIdx: await resolvePathToNodeIdx(`mi${i || ""}`),
                core,
            });
            await updateMatrixInputNumColumns({
                numColumns: numColumns + i + 1,
                componentIdx: await resolvePathToNodeIdx(`mi${i || ""}`),
                core,
            });
        }

        await check_items(
            paddedValues(values, numRows, numColumns, defaultEntry),
        );

        if (numRowsName && numColumnsName) {
            // add rows and columns via math inputs
            numRows++;
            await updateMathInputValue({
                latex: numRows.toString(),
                componentIdx: await resolvePathToNodeIdx(numRowsName),
                core,
            });
            numColumns++;
            await updateMathInputValue({
                latex: numColumns.toString(),
                componentIdx: await resolvePathToNodeIdx(numColumnsName),
                core,
            });
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );

            // Note: changing values locks in displayed default values
            values = paddedValues(
                values,
                numRows,
                numColumns,
                defaultEntry,
                false,
            );

            // change lower-right corner
            values[numRows - 1][numColumns - 1] = "z";
            await updateMatrixInputValue({
                latex: "z",
                componentIdx: await resolvePathToNodeIdx("mi"),
                rowInd: numRows - 1,
                colInd: numColumns - 1,
                core,
            });
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );

            // delete rows and columns via math inputs
            numRows -= 2;
            await updateMathInputValue({
                latex: numRows.toString(),
                componentIdx: await resolvePathToNodeIdx(numRowsName),
                core,
            });
            numColumns -= 2;
            await updateMathInputValue({
                latex: numColumns.toString(),
                componentIdx: await resolvePathToNodeIdx(numColumnsName),
                core,
            });
            await check_items(
                paddedValues(values, numRows, numColumns, defaultEntry),
            );
        }
    }

    it("no arguments, 0x0 matrix", async () => {
        let matrixML = `
    <p>A: <matrix name="A" /></p>`;

        await test_matrix({ matrixML, initialValues: [] });
    });

    it("specify numRows, get 1 column, 2x1 matrix of 0s", async () => {
        let matrixML = `
    <p>A: <matrix name="A" numRows="2" /></p>`;

        let initialValues = [[0], [0]];
        await test_matrix({ matrixML, initialValues });
    });

    it("specify numColumns, get 1 row, 1x2 matrix of zeros", async () => {
        let matrixML = `
    <p>A: <matrix name="A" numColumns="2" /></p>`;

        let initialValues = [[0, 0]];
        await test_matrix({ matrixML, initialValues });
    });

    it("with string/math children get 1x1 matrix", async () => {
        let matrixML = `
    <p>A: <matrix name="A" simplify>2<math>x</math></matrix></p>`;

        let initialValues = [[["*", 2, "x"]]];
        await test_matrix({ matrixML, initialValues });
    });

    it("2x3 matrix by rows", async () => {
        let matrixML = `
    <p>A: <matrix name="A" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({ matrixML, initialValues });
    });

    it("2x3 matrix by columns", async () => {
        let matrixML = `
    <p>A: <matrix name="A" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({ matrixML, initialValues });
    });

    it("3x2 matrix, rows, change size", async () => {
        let matrixML = `
    <p>numRows: <mathInput name="mi_nRows" prefill="3" />,
      numColumns: <mathInput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({
            matrixML,
            initialValues,
            initialNumRows: 3,
            initialNumColumns: 2,
            numRowsName: "mi_nRows",
            numColumnsName: "mi_nColumns",
        });
    });

    it("3x2 matrix, columns, change size", async () => {
        let matrixML = `
    <p>numRows: <mathInput name="mi_nRows" prefill="3" />,
      numColumns: <mathInput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({
            matrixML,
            initialValues,
            initialNumRows: 3,
            initialNumColumns: 2,
            numRowsName: "mi_nRows",
            numColumnsName: "mi_nColumns",
        });
    });

    it("3x2 matrix, rows, change size, change default entry", async () => {
        let matrixML = `
    <p>Default entry: <mathInput name="de" prefill="q" /></p>
    <p>numRows: <mathInput name="mi_nRows" prefill="3" />,
      numColumns: <mathInput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" defaultEntry="$de" >
      <row>a b c</row>
      <row>d e f</row>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({
            matrixML,
            initialValues,
            initialNumRows: 3,
            initialNumColumns: 2,
            numRowsName: "mi_nRows",
            numColumnsName: "mi_nColumns",
            initialDefaultEntry: "q",
            defaultEntryName: "de",
        });
    });

    it("3x2 matrix, columns, change size, change default entry", async () => {
        let matrixML = `
    <p>Default entry: <mathInput name="de" prefill="q" /></p>
    <p>numRows: <mathInput name="mi_nRows" prefill="3" />,
      numColumns: <mathInput name="mi_nColumns" prefill="2" /></p>
    <p>A: <matrix name="A" numRows="$mi_nRows" numColumns="$mi_nColumns" defaultEntry="$de" >
      <column>a d</column>
      <column>b e</column>
      <column>c f</column>
    </matrix>
    </p>`;

        let initialValues = [
            ["a", "b", "c"],
            ["d", "e", "f"],
        ];
        await test_matrix({
            matrixML,
            initialValues,
            initialNumRows: 3,
            initialNumColumns: 2,
            numRowsName: "mi_nRows",
            numColumnsName: "mi_nColumns",
            initialDefaultEntry: "q",
            defaultEntryName: "de",
        });
    });

    it("functionSymbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><matrix name="Adef">
      <row>f(x) g(x)</row>
      <row>h(x) a(x)</row>
    </matrix>
    </p>
    <p><matrix name="Ah" functionSymbols="h">
      <row>f(x) g(x)</row>
      <row>h(x) a(x)</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" functionSymbols="h a">
      <row><math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)</row>
      <row functionSymbols="h">h(x) a(x) <math functionSymbols="b">b(x)</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" functionSymbols="h a">
      <column><math functionSymbols="g">h(x)</math> <math functionSymbols="g">g(x)</math> a(x)</column>
      <column functionSymbols="h">h(x) a(x) <math functionSymbols="b">b(x)</math></column>
    </matrix>
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let matrixdefAst = [
            "matrix",
            ["tuple", 2, 2],
            [
                "tuple",
                ["tuple", ["apply", "f", "x"], ["apply", "g", "x"]],
                ["tuple", ["*", "h", "x"], ["*", "a", "x"]],
            ],
        ];
        let matrixhAst = [
            "matrix",
            ["tuple", 2, 2],
            [
                "tuple",
                ["tuple", ["*", "f", "x"], ["*", "g", "x"]],
                ["tuple", ["apply", "h", "x"], ["*", "a", "x"]],
            ],
        ];
        let matrixmixedbyrowAst = [
            "matrix",
            ["tuple", 2, 3],
            [
                "tuple",
                [
                    "tuple",
                    ["*", "h", "x"],
                    ["apply", "g", "x"],
                    ["apply", "a", "x"],
                ],
                [
                    "tuple",
                    ["apply", "h", "x"],
                    ["*", "a", "x"],
                    ["apply", "b", "x"],
                ],
            ],
        ];
        let matrixmixedbycolumnAst = [
            "matrix",
            ["tuple", 3, 2],
            [
                "tuple",
                ["tuple", ["*", "h", "x"], ["apply", "h", "x"]],
                ["tuple", ["apply", "g", "x"], ["*", "a", "x"]],
                ["tuple", ["apply", "a", "x"], ["apply", "b", "x"]],
            ],
        ];
        expect(
            stateVariables[await resolvePathToNodeIdx("Adef")].stateValues.value
                .tree,
        ).eqls(matrixdefAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ah")].stateValues.value
                .tree,
        ).eqls(matrixhAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbyrow")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbyrowAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbycolumn")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbycolumnAst);
    });

    it("referencesAreFunctionSymbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <math name="fun1">f</math>
      <math name="fun2">g</math>
      <math name="fun3">h</math>
      <math name="fun4">a</math>
      <math name="fun5">b</math>
    </setup>
    <p><matrix name="Adef">
      <row>$fun1(x) $fun2(x)</row>
      <row>$fun3(x) $fun4(x)</row>
    </matrix>
    </p>
    <p><matrix name="Ah" referencesAreFunctionSymbols="$fun1 $fun4">
      <row>$fun1(x) $fun2(x)</row>
      <row>$fun3(x) $fun4(x)</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" referencesAreFunctionSymbols="$fun3 $fun4">
      <row><math referencesAreFunctionSymbols="$fun2">$fun3(x)</math> <math referencesAreFunctionSymbols="$fun2">$fun2(x)</math> $fun4(x)</row>
      <row referencesAreFunctionSymbols="$fun3">$fun3(x) $fun4(x) <math referencesAreFunctionSymbols="$fun5">$fun5(x)</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" referencesAreFunctionSymbols="$fun3 $fun4">
      <column><math referencesAreFunctionSymbols="$fun2">h(x)</math> <math referencesAreFunctionSymbols="$fun2">$fun2(x)</math> $fun4(x)</column>
      <column referencesAreFunctionSymbols="$fun3">$fun3(x) $fun4(x) <math referencesAreFunctionSymbols="$fun5">$fun5(x)</math></column>
    </matrix>
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let matrixdefAst = [
            "matrix",
            ["tuple", 2, 2],
            [
                "tuple",
                ["tuple", ["*", "f", "x"], ["*", "g", "x"]],
                ["tuple", ["*", "h", "x"], ["*", "a", "x"]],
            ],
        ];
        let matrixhAst = [
            "matrix",
            ["tuple", 2, 2],
            [
                "tuple",
                ["tuple", ["apply", "f", "x"], ["*", "g", "x"]],
                ["tuple", ["*", "h", "x"], ["apply", "a", "x"]],
            ],
        ];
        let matrixmixedbyrowAst = [
            "matrix",
            ["tuple", 2, 3],
            [
                "tuple",
                [
                    "tuple",
                    ["*", "h", "x"],
                    ["apply", "g", "x"],
                    ["apply", "a", "x"],
                ],
                [
                    "tuple",
                    ["apply", "h", "x"],
                    ["*", "a", "x"],
                    ["apply", "b", "x"],
                ],
            ],
        ];
        let matrixmixedbycolumnAst = [
            "matrix",
            ["tuple", 3, 2],
            [
                "tuple",
                ["tuple", ["*", "h", "x"], ["apply", "h", "x"]],
                ["tuple", ["apply", "g", "x"], ["*", "a", "x"]],
                ["tuple", ["apply", "a", "x"], ["apply", "b", "x"]],
            ],
        ];
        expect(
            stateVariables[await resolvePathToNodeIdx("Adef")].stateValues.value
                .tree,
        ).eqls(matrixdefAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ah")].stateValues.value
                .tree,
        ).eqls(matrixhAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbyrow")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbyrowAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbycolumn")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbycolumnAst);
    });

    it("splitsymbols", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><matrix name="Adef">
      <row>xy yz</row>
      <row>ab bc</row>
    </matrix>
    </p>
    <p><matrix name="Ah" splitSymbols="false">
    <row>xy yz</row>
    <row>ab bc</row>
    </matrix>
    </p>
    <p><matrix name="Amixedbyrow" splitSymbols="false">
      <row>xy <math splitSymbols>yz</math> <math>zx</math></row>
      <row splitSymbols>ab <math splitSymbols="false">bc</math> <math>ca</math></row>
    </matrix>
    </p>
    <p><matrix name="Amixedbycolumn" splitSymbols="false">
    <column>xy <math splitSymbols>yz</math> <math>zx</math></column>
    <column splitSymbols>ab <math splitSymbols="false">bc</math> <math>ca</math></column>
    </matrix>
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let matrixdefAst = [
            "matrix",
            ["tuple", 2, 2],
            [
                "tuple",
                ["tuple", ["*", "x", "y"], ["*", "y", "z"]],
                ["tuple", ["*", "a", "b"], ["*", "b", "c"]],
            ],
        ];
        let matrixnAst = [
            "matrix",
            ["tuple", 2, 2],
            ["tuple", ["tuple", "xy", "yz"], ["tuple", "ab", "bc"]],
        ];
        let matrixmixedbyrowAst = [
            "matrix",
            ["tuple", 2, 3],
            [
                "tuple",
                ["tuple", "xy", ["*", "y", "z"], "zx"],
                ["tuple", ["*", "a", "b"], "bc", ["*", "c", "a"]],
            ],
        ];
        let matrixmixedbycolumnAst = [
            "matrix",
            ["tuple", 3, 2],
            [
                "tuple",
                ["tuple", "xy", ["*", "a", "b"]],
                ["tuple", ["*", "y", "z"], "bc"],
                ["tuple", "zx", ["*", "c", "a"]],
            ],
        ];
        expect(
            stateVariables[await resolvePathToNodeIdx("Adef")].stateValues.value
                .tree,
        ).eqls(matrixdefAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Ah")].stateValues.value
                .tree,
        ).eqls(matrixnAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbyrow")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbyrowAst);
        expect(
            stateVariables[await resolvePathToNodeIdx("Amixedbycolumn")]
                .stateValues.value.tree,
        ).eqls(matrixmixedbycolumnAst);
    });

    it("displayBlanks", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p><matrix name="Adef">
      <row>x_ y_</row>
      <row>a_ b_</row>
    </matrix>
    </p>
    <p><matrix name="Ah" displayBlanks="false">
    <row>x_ y_</row>
    <row>a_ b_</row>
    </matrix>
    </p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("Adef")].stateValues.text,
        ).eqls("[ [ x_＿, y_＿ ], [ a_＿, b_＿ ] ]");
        expect(
            stateVariables[await resolvePathToNodeIdx("Ah")].stateValues.text,
        ).eqls("[ [ x_, y_ ], [ a_, b_ ] ]");
    });
});
