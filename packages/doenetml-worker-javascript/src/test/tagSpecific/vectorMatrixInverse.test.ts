import { describe, it, expect, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue, updateMatrixInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Vector and matrix inverse array definitions @group1", () => {
    it("should update column vector matrix from vector mathInput (size[0] === 1)", async () => {
        const doenetML = `
<matrix name="columnVector">
  <row>a</row>
  <row>b</row>
</matrix>
<mathInput name="vectorFromColumn">$columnVector.vector</mathInput>
`;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        // Initial check: verify column vector is (a, b)
        let stateVariables = await core.returnAllStateVariables(false, true);
        let vectorValue =
            stateVariables[await resolvePathToNodeIdx("vectorFromColumn")]
                .stateValues.value.tree;
        expect(vectorValue[0]).toBe("vector"); // vector is a vector construct
        expect(vectorValue.length).toBe(3); // (a, b)

        // Update the vector via mathInput to (1, 2)
        await updateMathInputValue({
            latex: "(1, 2)",
            componentIdx: await resolvePathToNodeIdx("vectorFromColumn"),
            core,
        });

        // Verify the matrix updated correctly
        stateVariables = await core.returnAllStateVariables(false, true);

        // The column matrix should now have values [[1], [2]]
        const columnMatrixValue =
            stateVariables[await resolvePathToNodeIdx("columnVector")]
                .stateValues.matrix;
        expect(columnMatrixValue[0][0].tree).toEqual(1); // first row
        expect(columnMatrixValue[1][0].tree).toEqual(2); // second row

        // Verify the vector reflects the change
        vectorValue =
            stateVariables[await resolvePathToNodeIdx("vectorFromColumn")]
                .stateValues.value.tree;
        expect(vectorValue[1].tree ?? vectorValue[1]).toEqual(1);
        expect(vectorValue[2].tree ?? vectorValue[2]).toEqual(2);
    });

    it("should update row vector matrix from vector mathInput (size[1] === 1)", async () => {
        const doenetML = `
<matrix name="rowVector">
  <row>c d</row>
</matrix>
<mathInput name="vectorFromRow">$rowVector.vector</mathInput>
`;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        // Initial check: verify row vector is (c, d)
        let stateVariables = await core.returnAllStateVariables(false, true);
        let vectorValue =
            stateVariables[await resolvePathToNodeIdx("vectorFromRow")]
                .stateValues.value.tree;
        expect(vectorValue[0]).toBe("vector"); // vector is a vector construct
        expect(vectorValue.length).toBe(3); // (c, d)

        // Update the vector via mathInput to (3, 4)
        await updateMathInputValue({
            latex: "(3, 4)",
            componentIdx: await resolvePathToNodeIdx("vectorFromRow"),
            core,
        });

        // Verify the matrix updated correctly
        stateVariables = await core.returnAllStateVariables(false, true);

        // The row matrix should now have values [[3, 4]]
        const rowMatrixValue =
            stateVariables[await resolvePathToNodeIdx("rowVector")].stateValues
                .matrix;
        expect(rowMatrixValue[0][0].tree).toEqual(3); // first column
        expect(rowMatrixValue[0][1].tree).toEqual(4); // second column

        // Verify the vector reflects the change
        vectorValue =
            stateVariables[await resolvePathToNodeIdx("vectorFromRow")]
                .stateValues.value.tree;
        expect(vectorValue[1].tree ?? vectorValue[1]).toEqual(3);
        expect(vectorValue[2].tree ?? vectorValue[2]).toEqual(4);
    });

    it("should update square matrix from matrixInput entries", async () => {
        const doenetML = `
<matrix name="squareMatrix">
  <row>a b</row>
  <row>c d</row>
</matrix>
<matrixInput name="matrixEditor">$squareMatrix.matrix</matrixInput>
`;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        // Initial check: verify matrix is [[a, b], [c, d]]
        let stateVariables = await core.returnAllStateVariables(false, true);
        let matrixValue =
            stateVariables[await resolvePathToNodeIdx("squareMatrix")]
                .stateValues.matrix;
        expect(matrixValue[0][0].tree).toEqual("a");
        expect(matrixValue[0][1].tree).toEqual("b");
        expect(matrixValue[1][0].tree).toEqual("c");
        expect(matrixValue[1][1].tree).toEqual("d");

        // Update matrix via matrixInput: change entry (0,0) to 1
        await updateMatrixInputValue({
            latex: "1",
            rowInd: 0,
            colInd: 0,
            componentIdx: await resolvePathToNodeIdx("matrixEditor"),
            core,
        });

        // Verify the matrix updated at entry (0,0)
        stateVariables = await core.returnAllStateVariables(false, true);
        matrixValue =
            stateVariables[await resolvePathToNodeIdx("squareMatrix")]
                .stateValues.matrix;
        expect(matrixValue[0][0].tree).toEqual(1);
        expect(matrixValue[0][1].tree).toEqual("b"); // unchanged
        expect(matrixValue[1][0].tree).toEqual("c"); // unchanged
        expect(matrixValue[1][1].tree).toEqual("d"); // unchanged

        // Update another entry: change entry (1,1) to 5
        await updateMatrixInputValue({
            latex: "5",
            rowInd: 1,
            colInd: 1,
            componentIdx: await resolvePathToNodeIdx("matrixEditor"),
            core,
        });

        // Verify the matrix updated at entry (1,1)
        stateVariables = await core.returnAllStateVariables(false, true);
        matrixValue =
            stateVariables[await resolvePathToNodeIdx("squareMatrix")]
                .stateValues.matrix;
        expect(matrixValue[0][0].tree).toEqual(1); // previous update
        expect(matrixValue[0][1].tree).toEqual("b"); // unchanged
        expect(matrixValue[1][0].tree).toEqual("c"); // unchanged
        expect(matrixValue[1][1].tree).toEqual(5);
    });
});
