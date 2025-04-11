import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function changeSpreadsheetText({
    name = "/spreadsheet1",
    row,
    column,
    text = "",
    prevText = "",
    core,
}: {
    name?: string;
    row: number;
    column: number;
    text?: string;
    prevText?: string;
    core: PublicDoenetMLCore;
}) {
    await core.requestAction({
        actionName: "onChange",
        componentName: name,
        args: { changes: [[row - 1, column - 1, prevText, text]] },
    });
}

describe("Spreadsheet tag tests", async () => {
    it("empty spreadsheet", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1" minNumRows="4" minNumColumns="4" />
  `,
        });

        // check have spreadsheet cells
        let stateVariables = await core.returnAllStateVariables(true);
        expect(
            Array.isArray(stateVariables["/spreadsheet1"].stateValues.cells),
        ).eq(true);

        // enter text in B3
        await changeSpreadsheetText({ row: 3, column: 2, text: "hello", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq(
            "hello",
        );

        // delete text in B3
        await changeSpreadsheetText({ row: 3, column: 2, text: "", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq("");

        // enter text in A1
        await changeSpreadsheetText({ row: 1, column: 1, text: "first", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "first",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq("");

        // enter text in D2
        await changeSpreadsheetText({ row: 2, column: 4, text: "right", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "first",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq("");
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][3]).eq(
            "right",
        );
    });

    it("spreadsheet with cell children", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="spreadsheet1">
        <cell name="cell1">first</cell>
        <cell name="cell2" colnum="C" rownum="3">hello</cell>
        <cell name="cell3">bye</cell>
        <cell name="cell4" colnum="B">before</cell>
        <cell name="cell5" rownum="2">above</cell>
    </spreadsheet>
  `,
        });

        async function check_items(A1: string, C1: string, C3: string) {
            const stateVariables = await core.returnAllStateVariables(true);
            expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
                A1,
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[2][2]).eq(
                C3,
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[2][3]).eq(
                "bye",
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq(
                "before",
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[1][1]).eq(
                "above",
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[0][2]).eq(
                C1,
            );
            expect(stateVariables["/cell1"].stateValues.text).eq(A1);
            expect(stateVariables["/cell2"].stateValues.text).eq(C3);
            expect(stateVariables["/cell3"].stateValues.text).eq("bye");
            expect(stateVariables["/cell4"].stateValues.text).eq("before");
            expect(stateVariables["/cell5"].stateValues.text).eq("above");
        }

        let A1 = "first";
        let C1 = "";
        let C3 = "hello";

        await check_items(A1, C1, C3);

        // overwrite text in A1
        await changeSpreadsheetText({
            row: 1,
            column: 1,
            prevText: A1,
            text: "new",
            core,
        });
        A1 = "new";
        await check_items(A1, C1, C3);

        // enter text in new cell C1
        C1 = "third";
        await changeSpreadsheetText({ row: 1, column: 3, text: C1, core });
        await check_items(A1, C1, C3);

        // delete text in C3
        await changeSpreadsheetText({
            row: 3,
            column: 3,
            prevText: C3,
            text: "",
            core,
        });
        C3 = "";
        await check_items(A1, C1, C3);
    });

    it("copy individual cells into new spreadsheet", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="ss1">
        <cell name="c1">first</cell>
        <cell name="c2" colnum="C" rownum="3">hello</cell>
        <cell name="c3">bye</cell>
        <cell name="c4" colnum="4" rownum="4">last</cell>
        <cell name="c5" colnum="B" rownum="A">mid</cell>
    </spreadsheet>

    <spreadsheet name="ss2">
        $c4{name="c4a"}
        <cell colnum="A" copySource="c2" name="c2a" />
        $c3{name="c3a"}
        <cell colnum="2" rownum="4" copySource="c1" name="c1a" />
        <cell rownum="2" copySource="c5" name="c5a" />
    </spreadsheet>

    <spreadsheet copySource="ss1" name="ss1a" />
    <spreadsheet copySource="ss2" name="ss2a" />
    <spreadsheet copySource="ss1a" name="ss1b" />
    <spreadsheet copySource="ss2a" name="ss2b" />
  `,
        });

        let cellLocations = {
            1: [
                [1, 1],
                [4, 2],
            ],
            2: [
                [3, 3],
                [3, 1],
            ],
            3: [
                [3, 4],
                [3, 2],
            ],
            4: [
                [4, 4],
                [4, 4],
            ],
            5: [
                [1, 2],
                [2, 2],
            ],
            6: [
                [2, 2],
                [1, 3],
            ],
        };

        let cellNames = {
            1: ["/c1", "/c1a"],
            2: ["/c2", "/c2a"],
            3: ["/c3", "/c3a"],
            4: ["/c4", "/c4a"],
            5: ["/c5", "/c5a"],
        };

        let spreadsheetNames = {
            0: ["/ss1", "/ss1a", "/ss1b"],
            1: ["/ss2", "/ss2a", "/ss2b"],
        };

        async function check_items(cellValues: Record<string, string>) {
            const stateVariables = await core.returnAllStateVariables(true);
            for (let cellNum in cellNames) {
                for (let ind in cellNames[cellNum]) {
                    expect(
                        stateVariables[cellNames[cellNum][ind]].stateValues
                            .text,
                    ).eq(cellValues[cellNum]);
                }
            }

            for (let ssNum in spreadsheetNames) {
                for (let ssInd in spreadsheetNames[ssNum]) {
                    let ssName = spreadsheetNames[ssNum][ssInd];
                    for (let cellNum in cellLocations) {
                        let cLoc = cellLocations[cellNum][ssNum];
                        let effectiveNum =
                            cellNum === "6" && ssNum === "1" ? "6b" : cellNum;
                        expect(
                            stateVariables[ssName].stateValues.cells[
                                cLoc[0] - 1
                            ][cLoc[1] - 1],
                        ).eq(cellValues[effectiveNum]);
                    }
                }
            }
        }

        let cellValues: Record<string, string> = {
            1: "first",
            2: "hello",
            3: "bye",
            4: "last",
            5: "mid",
            6: "",
            "6b": "",
        };

        await check_items(cellValues);

        let allCellValues = {
            1: ["apple", "red", "up", "soft", "happy", "monday"],
            2: ["banana", "purple", "down", "hard", "sad", "tuesday"],
            3: ["grape", "black", "left", "smooth", "serious", "wednesday"],
            4: [
                "orange",
                "green",
                "right",
                "prickly",
                "determined",
                "thursday",
            ],
            5: ["melon", "yellow", "middle", "rough", "impulsive", "friday"],
            6: ["pear", "brown", "back", "dimpled", "passive", "saturday"],
        };

        let valueInd = -1;
        for (let ssNumChange in spreadsheetNames) {
            for (let ssIndChange in spreadsheetNames[ssNumChange]) {
                let ssNameChange = spreadsheetNames[ssNumChange][ssIndChange];
                valueInd++;

                for (let cellNum in allCellValues) {
                    let cLoc = cellLocations[cellNum][ssNumChange];
                    let effectiveNum =
                        cellNum === "6" && ssNumChange === "1" ? "6b" : cellNum;
                    await changeSpreadsheetText({
                        name: ssNameChange,
                        row: cLoc[0],
                        column: cLoc[1],
                        prevText: cellValues[effectiveNum],
                        text: allCellValues[cellNum][valueInd],
                        core,
                    });
                    cellValues[effectiveNum] = allCellValues[cellNum][valueInd];
                }

                await check_items(cellValues);
            }
        }
    });

    it("copy spreadsheet cells into new spreadsheet", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="ss1">
    <cell name="c1">first</cell>
    <cell name="c2" colnum="C" rownum="3">hello</cell>
    <cell name="c3">bye</cell>
    <cell name="c4" colnum="4" rownum="4">last</cell>
    <cell name="c5" colnum="B" rownum="A">mid</cell>
  </spreadsheet>

  <spreadsheet name="ss2">
    <cell colnum="D" rownum="4" copysource="ss1.cellD4" name="c4a" />
    <cell colnum="A" rownum="3" copysource="ss1.cellC3" name="c2a" />
    <cell copySource="ss1.cellD3" name="c3a" />
    <cell colnum="2" rownum="4" copysource="ss1.cellA1" name="c1a" />
    <cell rownum="2" colnum="b" copysource="ss1.cellb1" name="c5a" />
  </spreadsheet>

  <spreadsheet copySource="ss1" name="ss1a" />
  <spreadsheet copySource="ss2" name="ss2a" />
  <spreadsheet copySource="ss1a" name="ss1b" />
  <spreadsheet copySource="ss2a" name="ss2b" />
  `,
        });

        let cellLocations = {
            1: [
                [1, 1],
                [4, 2],
            ],
            2: [
                [3, 3],
                [3, 1],
            ],
            3: [
                [3, 4],
                [3, 2],
            ],
            4: [
                [4, 4],
                [4, 4],
            ],
            5: [
                [1, 2],
                [2, 2],
            ],
            6: [
                [2, 2],
                [1, 3],
            ],
        };

        let cellNames = {
            1: ["/c1", "/c1a"],
            2: ["/c2", "/c2a"],
            3: ["/c3", "/c3a"],
            4: ["/c4", "/c4a"],
            5: ["/c5", "/c5a"],
        };

        let spreadsheetNames = {
            0: ["/ss1", "/ss1a", "/ss1b"],
            1: ["/ss2", "/ss2a", "/ss2b"],
        };

        async function check_items(cellValues: Record<string, string>) {
            const stateVariables = await core.returnAllStateVariables(true);
            for (let cellNum in cellNames) {
                for (let ind in cellNames[cellNum]) {
                    expect(
                        stateVariables[cellNames[cellNum][ind]].stateValues
                            .text,
                    ).eq(cellValues[cellNum]);
                }
            }

            for (let ssNum in spreadsheetNames) {
                for (let ssInd in spreadsheetNames[ssNum]) {
                    let ssName = spreadsheetNames[ssNum][ssInd];
                    for (let cellNum in cellLocations) {
                        let cLoc = cellLocations[cellNum][ssNum];
                        let effectiveNum =
                            cellNum === "6" && ssNum === "1" ? "6b" : cellNum;
                        expect(
                            stateVariables[ssName].stateValues.cells[
                                cLoc[0] - 1
                            ][cLoc[1] - 1],
                        ).eq(cellValues[effectiveNum]);
                    }
                }
            }
        }

        let cellValues: Record<string, string> = {
            1: "first",
            2: "hello",
            3: "bye",
            4: "last",
            5: "mid",
            6: "",
            "6b": "",
        };

        await check_items(cellValues);

        let allCellValues = {
            1: ["apple", "red", "up", "soft", "happy", "monday"],
            2: ["banana", "purple", "down", "hard", "sad", "tuesday"],
            3: ["grape", "black", "left", "smooth", "serious", "wednesday"],
            4: [
                "orange",
                "green",
                "right",
                "prickly",
                "determined",
                "thursday",
            ],
            5: ["melon", "yellow", "middle", "rough", "impulsive", "friday"],
            6: ["pear", "brown", "back", "dimpled", "passive", "saturday"],
        };

        let valueInd = -1;
        for (let ssNumChange in spreadsheetNames) {
            for (let ssIndChange in spreadsheetNames[ssNumChange]) {
                let ssNameChange = spreadsheetNames[ssNumChange][ssIndChange];
                valueInd++;

                for (let cellNum in allCellValues) {
                    let cLoc = cellLocations[cellNum][ssNumChange];
                    let effectiveNum =
                        cellNum === "6" && ssNumChange === "1" ? "6b" : cellNum;
                    await changeSpreadsheetText({
                        name: ssNameChange,
                        row: cLoc[0],
                        column: cLoc[1],
                        prevText: cellValues[effectiveNum],
                        text: allCellValues[cellNum][valueInd],
                        core,
                    });
                    cellValues[effectiveNum] = allCellValues[cellNum][valueInd];
                }

                await check_items(cellValues);
            }
        }
    });

    it("build spreadsheet from cells and rows", async () => {
        let core = await createTestCore({
            doenetML: `
<spreadsheet name="spreadsheet1">
    <row><cell name="cell1">A1</cell><cell name="cell2">B1</cell><cell name="cell3" colnum="D">D1</cell></row>
    <row><cell name="cell4" colnum="2">B2</cell><cell name="cell5">C2</cell></row>
    <row rownum="5"><cell name="cell6">A5</cell><cell name="cell7" colnum="F">F5</cell></row>
    <row><cell name="cell8" colnum="3">C6</cell><cell name="cell9">D6</cell></row>
    <cell name="cell10">A7</cell>
</spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(7);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(6);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "A1",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][1]).eq(
            "B1",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][3]).eq(
            "D1",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][1]).eq(
            "B2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][2]).eq(
            "C2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][0]).eq(
            "A5",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][5]).eq(
            "F5",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[5][2]).eq(
            "C6",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[5][3]).eq(
            "D6",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[6][0]).eq(
            "A7",
        );
        expect(stateVariables["/cell1"].stateValues.text).eq("A1");
        expect(stateVariables["/cell2"].stateValues.text).eq("B1");
        expect(stateVariables["/cell3"].stateValues.text).eq("D1");
        expect(stateVariables["/cell4"].stateValues.text).eq("B2");
        expect(stateVariables["/cell5"].stateValues.text).eq("C2");
        expect(stateVariables["/cell6"].stateValues.text).eq("A5");
        expect(stateVariables["/cell7"].stateValues.text).eq("F5");
        expect(stateVariables["/cell8"].stateValues.text).eq("C6");
        expect(stateVariables["/cell9"].stateValues.text).eq("D6");
        expect(stateVariables["/cell10"].stateValues.text).eq("A7");

        for (let ind = 1; ind <= 7; ind++) {
            await changeSpreadsheetText({
                row: ind,
                column: 1,
                text: `row${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 7; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[ind - 1][0],
            ).eq(`row${ind}`);
        }
        expect(stateVariables["/cell1"].stateValues.text).eq("row1");
        expect(stateVariables["/cell6"].stateValues.text).eq("row5");
        expect(stateVariables["/cell10"].stateValues.text).eq("row7");
    });

    it("build spreadsheet from cells and columns", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1">
  <column><cell name="cell1">A1</cell><cell name="cell2">A2</cell><cell name="cell3" rownum="D">A4</cell></column>
  <column><cell name="cell4" rownum="2">B2</cell><cell name="cell5">B3</cell></column>
  <column colnum="5"><cell name="cell6">E1</cell><cell name="cell7" rownum="F">E6</cell></column>
  <column><cell name="cell8" rownum="3">F3</cell><cell name="cell9">F4</cell></column>
  <cell name="cell10">G1</cell>
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(6);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(7);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "A1",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][0]).eq(
            "A2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[3][0]).eq(
            "A4",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][1]).eq(
            "B2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][1]).eq(
            "B3",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][4]).eq(
            "E1",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[5][4]).eq(
            "E6",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][5]).eq(
            "F3",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[3][5]).eq(
            "F4",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][6]).eq(
            "G1",
        );
        expect(stateVariables["/cell1"].stateValues.text).eq("A1");
        expect(stateVariables["/cell2"].stateValues.text).eq("A2");
        expect(stateVariables["/cell3"].stateValues.text).eq("A4");
        expect(stateVariables["/cell4"].stateValues.text).eq("B2");
        expect(stateVariables["/cell5"].stateValues.text).eq("B3");
        expect(stateVariables["/cell6"].stateValues.text).eq("E1");
        expect(stateVariables["/cell7"].stateValues.text).eq("E6");
        expect(stateVariables["/cell8"].stateValues.text).eq("F3");
        expect(stateVariables["/cell9"].stateValues.text).eq("F4");
        expect(stateVariables["/cell10"].stateValues.text).eq("G1");

        for (let ind = 1; ind <= 7; ind++) {
            await changeSpreadsheetText({
                row: 1,
                column: ind,
                text: `column${ind}`,
                core,
            });
        }
        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 7; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[0][ind - 1],
            ).eq(`column${ind}`);
        }
        expect(stateVariables["/cell1"].stateValues.text).eq("column1");
        expect(stateVariables["/cell6"].stateValues.text).eq("column5");
        expect(stateVariables["/cell10"].stateValues.text).eq("column7");
    });

    it("build spreadsheet with cellblocks", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1">
    <cellblock rownum="2" colnum="3">
        <row rownum="2"><cell name="cell1">C3</cell><cell name="cell2">D3</cell></row>
        <column colnum="3"><cell name="cell3">E2</cell><cell name="cell4">E3</cell></column>
    </cellblock>
    <cell name="cell5">F2</cell>
    <cellblock>
        <cell name="cell6">G2</cell>
        <cell name="cell7" rownum="3">G4</cell>
    </cellblock>
    <cellblock rownum="5">
        <cell name="cell8">G5</cell><cell name="cell9">H5</cell>
    </cellblock>
    <cellblock colnum="A">
        <cell name="cell10">A5</cell>
        <cell name="cell11" rownum="2" colnum="2">B6</cell>
    </cellblock>
    <cell name="cell12">C5</cell>
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(6);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(8);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][2]).eq(
            "C3",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][3]).eq(
            "D3",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][4]).eq(
            "E2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][4]).eq(
            "E3",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][5]).eq(
            "F2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][6]).eq(
            "G2",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[3][6]).eq(
            "G4",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][6]).eq(
            "G5",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][7]).eq(
            "H5",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][0]).eq(
            "A5",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[5][1]).eq(
            "B6",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[4][2]).eq(
            "C5",
        );
        expect(stateVariables["/cell1"].stateValues.text).eq("C3");
        expect(stateVariables["/cell2"].stateValues.text).eq("D3");
        expect(stateVariables["/cell3"].stateValues.text).eq("E2");
        expect(stateVariables["/cell4"].stateValues.text).eq("E3");
        expect(stateVariables["/cell5"].stateValues.text).eq("F2");
        expect(stateVariables["/cell6"].stateValues.text).eq("G2");
        expect(stateVariables["/cell7"].stateValues.text).eq("G4");
        expect(stateVariables["/cell8"].stateValues.text).eq("G5");
        expect(stateVariables["/cell9"].stateValues.text).eq("H5");
        expect(stateVariables["/cell10"].stateValues.text).eq("A5");
        expect(stateVariables["/cell11"].stateValues.text).eq("B6");
        expect(stateVariables["/cell12"].stateValues.text).eq("C5");

        for (let ind = 1; ind <= 8; ind++) {
            await changeSpreadsheetText({
                row: 5,
                column: ind,
                text: `column${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 8; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[4][ind - 1],
            ).eq(`column${ind}`);
        }
        expect(stateVariables["/cell8"].stateValues.text).eq("column7");
        expect(stateVariables["/cell9"].stateValues.text).eq("column8");
        expect(stateVariables["/cell10"].stateValues.text).eq("column1");
        expect(stateVariables["/cell12"].stateValues.text).eq("column3");
    });

    it("copy spreadsheet with cellblocks", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1">
    <row><cell>A1</cell><cell>B1</cell><cell>C1</cell></row>
    <column><cell rownum="2">A2</cell><cell>A3</cell><cell>A4</cell></column>
    <cellblock rownum="2">
        <cell>B2</cell><cell>C2</cell><cell>D2</cell>
        <row rownum="2"><cell>B3</cell><cell>C3</cell><cell>D3</cell></row>
    </cellblock>
    <cell rownum="4">B4</cell><cell>C4</cell><cell>D4</cell>
    <cell rownum="1">D1</cell>
  </spreadsheet>

  <spreadsheet name="spreadsheet2">
    <copy source="spreadsheet1.rangeC3D4" />
    <copy prop="range((1,1),(4,2))" source="spreadsheet1" />
    <copy rownum="3" colnum="1" source="spreadsheet1.rangeD2C1" />
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(4);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(4);
        expect(stateVariables["/spreadsheet2"].stateValues.numRows).eq(4);
        expect(stateVariables["/spreadsheet2"].stateValues.numColumns).eq(4);
        for (let row = 1; row <= 4; row++) {
            for (let col = 1; col <= 4; col++) {
                expect(
                    stateVariables["/spreadsheet1"].stateValues.cells[row - 1][
                        col - 1
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }
        for (let row = 3; row <= 4; row++) {
            for (let col = 3; col <= 4; col++) {
                expect(
                    stateVariables["/spreadsheet2"].stateValues.cells[row - 3][
                        col - 3
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }
        for (let row = 1; row <= 4; row++) {
            for (let col = 1; col <= 2; col++) {
                expect(
                    stateVariables["/spreadsheet2"].stateValues.cells[row - 1][
                        col + 1
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }
        for (let row = 1; row <= 2; row++) {
            for (let col = 3; col <= 4; col++) {
                expect(
                    stateVariables["/spreadsheet2"].stateValues.cells[row + 1][
                        col - 3
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }

        // enter text into third row of first spreadsheet
        for (let ind = 1; ind <= 4; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet1",
                row: 3,
                column: ind,
                text: `column${ind}`,
                core,
            });
        }
        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 4; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[2][ind - 1],
            ).eq(`column${ind}`);
        }
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][2]).eq(
            `column1`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][3]).eq(
            `column2`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[0][0]).eq(
            `column3`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[0][1]).eq(
            `column4`,
        );

        // enter text into second column of second spreadsheet
        for (let ind = 1; ind <= 4; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet2",
                row: ind,
                column: 2,
                text: `row${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 4; ind++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[ind - 1][1],
            ).eq(`row${ind}`);
        }
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][3]).eq(
            `row1`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[3][3]).eq(
            `row2`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][3]).eq(
            `row3`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][3]).eq(
            `row4`,
        );
    });

    it("copy spreadsheet with rows and columns", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1">
    <row><cell>A1</cell><cell>B1</cell><cell>C1</cell></row>
    <column><cell rownum="2">A2</cell><cell>A3</cell><cell>A4</cell></column>
    <cellblock rownum="2">
        <cell>B2</cell><cell>C2</cell><cell>D2</cell>
        <row rownum="2"><cell>B3</cell><cell>C3</cell><cell>D3</cell></row>
    </cellblock>
    <cell rownum="4">B4</cell><cell>C4</cell><cell>D4</cell>
    <cell rownum="1">D1</cell>
  </spreadsheet>

  <spreadsheet name="spreadsheet2">
    <copy prop="row2" rownum="3" source="spreadsheet1" />
    <copy prop="column3" colnum="5" source="spreadsheet1" />
    <copy prop="rowA" source="spreadsheet1" />
    <copy prop="columnB" source="spreadsheet1" />
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(4);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(4);
        expect(stateVariables["/spreadsheet2"].stateValues.numRows).eq(4);
        expect(stateVariables["/spreadsheet2"].stateValues.numColumns).eq(6);
        for (let row = 1; row <= 4; row++) {
            for (let col = 1; col <= 4; col++) {
                expect(
                    stateVariables["/spreadsheet1"].stateValues.cells[row - 1][
                        col - 1
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }
        for (let row = 1; row <= 2; row++) {
            for (let col = 1; col <= 4; col++) {
                expect(
                    stateVariables["/spreadsheet2"].stateValues.cells[row - 1][
                        col - 1
                    ],
                ).eq("");
            }
        }
        for (let col = 1; col <= 4; col++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[2][col - 1],
            ).eq(`${String.fromCharCode(64 + col)}2`);
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[3][col - 1],
            ).eq(`${String.fromCharCode(64 + col)}1`);
        }
        for (let row = 1; row <= 4; row++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row - 1][4],
            ).eq(`C${row}`);
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row - 1][5],
            ).eq(`B${row}`);
        }

        // enter text into second row of first spreadsheet
        for (let ind = 1; ind <= 4; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet1",
                row: 2,
                column: ind,
                text: `column${ind}`,
                core,
            });
        }
        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 4; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[1][ind - 1],
            ).eq(`column${ind}`);
        }
        // becomes third row of second spreadsheet
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][0]).eq(
            `column1`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][1]).eq(
            `column2`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][2]).eq(
            `column3`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][3]).eq(
            `column4`,
        );

        // fifth and sixth column ref third and second column
        expect(stateVariables["/spreadsheet2"].stateValues.cells[1][4]).eq(
            `column3`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[1][5]).eq(
            `column2`,
        );

        // enter text into fifth column of second spreadsheet
        for (let ind = 1; ind <= 4; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet2",
                row: ind,
                column: 5,
                text: `row${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 4; ind++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[ind - 1][4],
            ).eq(`row${ind}`);
        }

        //comes third column of first spreadsheet
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][2]).eq(
            `row1`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][2]).eq(
            `row2`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][2]).eq(
            `row3`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[3][2]).eq(
            `row4`,
        );

        // third and fourth row of second spreadsheet also change due
        // changes in second and first row of first spreadsheet
        expect(stateVariables["/spreadsheet2"].stateValues.cells[2][2]).eq(
            `row2`,
        );
        expect(stateVariables["/spreadsheet2"].stateValues.cells[3][2]).eq(
            `row1`,
        );
    });

    it("copy all spreadsheet cells shifted", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
    <cell>A1</cell><cell>B1</cell><cell>C1</cell>
    <cell rownum="2" colnum="1">A2</cell><cell>B2</cell><cell>C2</cell>
    <cell rownum="3" colnum="1">A3</cell><cell>B3</cell><cell>C3</cell>
  </spreadsheet>

  <spreadsheet name="spreadsheet2">
    <copy prop="cells" rownum="3" colnum="2" source="spreadsheet1" />
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.numRows).eq(3);
        expect(stateVariables["/spreadsheet1"].stateValues.numColumns).eq(3);
        expect(stateVariables["/spreadsheet2"].stateValues.numRows).eq(5);
        expect(stateVariables["/spreadsheet2"].stateValues.numColumns).eq(4);
        for (let row = 1; row <= 3; row++) {
            for (let col = 1; col <= 3; col++) {
                expect(
                    stateVariables["/spreadsheet1"].stateValues.cells[row - 1][
                        col - 1
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }
        for (let row = 1; row <= 3; row++) {
            for (let col = 1; col <= 3; col++) {
                expect(
                    stateVariables["/spreadsheet2"].stateValues.cells[row + 1][
                        col
                    ],
                ).eq(`${String.fromCharCode(64 + col)}${row}`);
            }
        }

        // enter text into second row of first spreadsheet
        for (let ind = 1; ind <= 3; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet1",
                row: 2,
                column: ind,
                text: `column${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 3; ind++) {
            expect(
                stateVariables["/spreadsheet1"].stateValues.cells[1][ind - 1],
            ).eq(`column${ind}`);
        }
        for (let ind = 1; ind <= 3; ind++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[3][ind],
            ).eq(`column${ind}`);
        }

        // enter text into fourth column of second spreadsheet
        for (let ind = 1; ind <= 5; ind++) {
            await changeSpreadsheetText({
                name: "/spreadsheet2",
                row: ind,
                column: 4,
                text: `row${ind}`,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(true);
        for (let ind = 1; ind <= 5; ind++) {
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[ind - 1][3],
            ).eq(`row${ind}`);
        }

        //becomes third column of first spreadsheet
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][2]).eq(
            `row3`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][2]).eq(
            `row4`,
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[2][2]).eq(
            `row5`,
        );
    });

    it("copy spreadsheet cells ignores cell col/row num", async () => {
        let core = await createTestCore({
            doenetML: `
  <spreadsheet name="spreadsheet1">
    <cell colnum="5">alpha</cell>
    <cell>beta</cell>
    <cell rownum="2">gamma</cell>
  </spreadsheet>
  
  <spreadsheet name="spreadsheet2">
    <copy prop="rangeE1F2" source="spreadsheet1" />
    <copy prop="rangeE1F2" colnum="4" source="spreadsheet1" />
    <copy prop="rangeE1F2" rownum="3" source="spreadsheet1" />
  </spreadsheet>  
  `,
        });

        let cellBlockUpperLefts = [
            [0, 0],
            [0, 3],
            [2, 3],
        ];

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][4]).eq(
            "alpha",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][5]).eq(
            "beta",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][5]).eq(
            "gamma",
        );
        for (let inds of cellBlockUpperLefts) {
            let row = inds[0];
            let col = inds[1];
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col],
            ).eq("alpha");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col + 1],
            ).eq("beta");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row + 1][
                    col + 1
                ],
            ).eq("gamma");
        }

        // enter text in first spreadsheet block
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 5,
            text: `a`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 6,
            text: `b`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 2,
            column: 5,
            text: `c`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 2,
            column: 6,
            text: `d`,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][4]).eq("a");
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][5]).eq("b");
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][4]).eq("c");
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][5]).eq("d");
        for (let inds of cellBlockUpperLefts) {
            let row = inds[0];
            let col = inds[1];
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col],
            ).eq("a");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col + 1],
            ).eq("b");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row + 1][col],
            ).eq("c");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row + 1][
                    col + 1
                ],
            ).eq("d");
        }

        // enter text in other spreadsheet blocks
        await changeSpreadsheetText({
            name: "/spreadsheet2",
            row: 1,
            column: 1,
            text: `first`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet2",
            row: 1,
            column: 5,
            text: `second`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet2",
            row: 4,
            column: 4,
            text: `third`,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet2",
            row: 4,
            column: 5,
            text: `fourth`,
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][4]).eq(
            "first",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][5]).eq(
            "second",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][4]).eq(
            "third",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[1][5]).eq(
            "fourth",
        );
        for (let inds of cellBlockUpperLefts) {
            let row = inds[0];
            let col = inds[1];
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col],
            ).eq("first");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row][col + 1],
            ).eq("second");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row + 1][col],
            ).eq("third");
            expect(
                stateVariables["/spreadsheet2"].stateValues.cells[row + 1][
                    col + 1
                ],
            ).eq("fourth");
        }
    });

    it("spreadsheet prefill", async () => {
        let core = await createTestCore({
            doenetML: `
  <math name="m1">x^2</math>
  <text name="t1">hello</text>
  <number name="n1">5</number>
  <boolean name="b1">true</boolean>

  <spreadsheet name="spreadsheet1" minNumRows="2" minNumColumns="4">
  <row>
    <cell prefill="$m1" />
    <cell prefill="$t1" />
    <cell prefill="$n1" />
    <cell prefill="$b1" />
  </row>
  </spreadsheet>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/m1"].stateValues.latex).eq("x^{2}");
        expect(stateVariables["/t1"].stateValues.value).eq("hello");
        expect(stateVariables["/n1"].stateValues.value).eq(5);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "x²",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][1]).eq(
            "hello",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][2]).eq("5");
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][3]).eq(
            "true",
        );

        // changing spreadsheet doesn't change prefill sources
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 1,
            text: "3(-",
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 2,
            text: "bye",
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 3,
            text: "ab",
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            row: 1,
            column: 4,
            text: "1+q",
            core,
        });

        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/m1"].stateValues.latex).eq("x^{2}");
        expect(stateVariables["/t1"].stateValues.value).eq("hello");
        expect(stateVariables["/n1"].stateValues.value).eq(5);
        expect(stateVariables["/b1"].stateValues.value).eq(true);
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
            "3(-",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][1]).eq(
            "bye",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][2]).eq(
            "ab",
        );
        expect(stateVariables["/spreadsheet1"].stateValues.cells[0][3]).eq(
            "1+q",
        );
    });

    it("references to cells, adapter to math, number, or text", async () => {
        let core = await createTestCore({
            doenetML: `
<spreadsheet name="spreadsheet1" minNumRows="4" minNumColumns="4">
  <cell>1</cell>
</spreadsheet>

<p name="p1"><copy prop="cellA1" source="spreadsheet1" /> A</p>

<p name="p2"><asList>
  <math name="math1" simplify>$spreadsheet1.cellA1+1</math>
  <number name="number1">$spreadsheet1.cellA1+1</number>
  <text name="text1">$spreadsheet1.cellA1 B</text>
</asList></p>

<p name="p3"><asList>
  <math name="math2" simplify>$spreadsheet1.cellA1+$spreadsheet1.cellA2</math>
  <number name="number2">$spreadsheet1.cellA1+$spreadsheet1.cellA2</number>
  <text name="text2">$spreadsheet1.cellA1 + $spreadsheet1.cellA2</text>
</asList></p>
  `,
        });

        // check initial cell values

        async function check_values(A1 = "", A2 = "") {
            let A1tree, A2tree;
            try {
                A1tree = me.fromText(A1).tree;
            } catch (e) {
                A1tree = "\uff3f";
            }
            try {
                A2tree = me.fromText(A2).tree;
            } catch (e) {
                A2tree = "\uff3f";
            }
            let m1 = me.fromAst(["+", A1tree, 1]);
            let m2 = me.fromAst(["+", A1tree, A2tree]);
            let stateVariables = await core.returnAllStateVariables(true);
            expect(stateVariables["/p1"].stateValues.text).eq(`${A1} A`);
            expect(stateVariables["/math1"].stateValues.value.tree).eqls(
                m1.simplify().tree,
            );
            expect(stateVariables["/number1"].stateValues.value).eqls(
                m1.evaluate_to_constant(),
            );
            expect(stateVariables["/text1"].stateValues.value).eq(`${A1} B`);
            expect(stateVariables["/math2"].stateValues.value.tree).eqls(
                m2.simplify().tree,
            );
            expect(stateVariables["/number2"].stateValues.value).eqls(
                m2.evaluate_to_constant(),
            );
            expect(stateVariables["/text2"].stateValues.value).eq(
                `${A1} + ${A2}`,
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[0][0]).eq(
                A1,
            );
            expect(stateVariables["/spreadsheet1"].stateValues.cells[1][0]).eq(
                A2,
            );
        }

        let A1 = "1";
        let A2 = "";

        await check_values(A1, A2);

        // different numbers in cells
        A1 = "5";
        A2 = "7";
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 1,
            text: A1,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 2,
            text: A2,
            core,
        });
        await check_values(A1, A2);

        // different variables in cells
        A1 = "x";
        A2 = "y";
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 1,
            text: A1,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 2,
            text: A2,
            core,
        });
        await check_values(A1, A2);

        // non-valid math in one cell
        A1 = "q(";
        A2 = "sin(w)";
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 1,
            text: A1,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 2,
            text: A2,
            core,
        });
        await check_values(A1, A2);

        // one cell is blank
        A1 = "";
        A2 = "5";
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 1,
            text: A1,
            core,
        });
        await changeSpreadsheetText({
            name: "/spreadsheet1",
            column: 1,
            row: 2,
            text: A2,
            core,
        });
        await check_values(A1, A2);
    });

    it("references to cells are not adapted", async () => {
        let core = await createTestCore({
            doenetML: `
<spreadsheet minNumRows="4" minNumColumns="4" name="s">
  <cell>1</cell><cell>2</cell>
</spreadsheet>

$s.cellB1{assignNames="c1"}
$s.cellA1{assignNames="c2"}

<tabular>
  <row name="row1">
    $s.cellB1{assignNames="c11"}
    <cell name="c12">Hello</cell>
    $s.cellB2{assignNames="c13"}
  </row>
  <row name="row2">
    <cell name="c21">Bye</cell>
    $s.cellA1{assignNames="c22"}
  </row>
</tabular>

  `,
        });

        async function check_items(A1 = "", B1 = "", B2 = "") {
            const stateVariables = await core.returnAllStateVariables(true);
            expect(
                stateVariables["/row1"].activeChildren.map(
                    (v) => v.componentName,
                ),
            ).eqls(["/c11", "/c12", "/c13"]);
            expect(
                stateVariables["/row2"].activeChildren.map(
                    (v) => v.componentName,
                ),
            ).eqls(["/c21", "/c22"]);
            expect(stateVariables["/c1"].stateValues.text).eq(B1);
            expect(stateVariables["/c2"].stateValues.text).eq(A1);
            expect(stateVariables["/c11"].stateValues.text).eq(B1);
            expect(stateVariables["/c12"].stateValues.text).eq("Hello");
            expect(stateVariables["/c13"].stateValues.text).eq(B2);
            expect(stateVariables["/c21"].stateValues.text).eq("Bye");
            expect(stateVariables["/c22"].stateValues.text).eq(A1);
        }

        let A1 = "1",
            B1 = "2",
            B2 = "";

        await check_items(A1, B1, B2);

        // change cells
        A1 = "A";
        B1 = "B";
        B2 = "C";
        await changeSpreadsheetText({
            name: "/s",
            column: 1,
            row: 1,
            text: A1,
            core,
        });
        await changeSpreadsheetText({
            name: "/s",
            column: 2,
            row: 1,
            text: B1,
            core,
        });
        await changeSpreadsheetText({
            name: "/s",
            column: 2,
            row: 2,
            text: B2,
            core,
        });

        await check_items(A1, B1, B2);
    });

    async function test_merge_coordinates(core: PublicDoenetMLCore) {
        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/coords"].stateValues.text).eq("( 1, 2 )");
        expect(stateVariables["/t1"].stateValues.value).eq("( 1, 2 )");

        await updateMathInputValue({ latex: "3", name: "/x1", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/coords"].stateValues.text).eq("( 3, 2 )");
        expect(stateVariables["/t1"].stateValues.value).eq("( 3, 2 )");

        await updateMathInputValue({ latex: "4", name: "/x2", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/coords"].stateValues.text).eq("( 3, 4 )");
        expect(stateVariables["/t1"].stateValues.value).eq("( 3, 4 )");
    }

    it("spreadsheet can merge coordinates", async () => {
        let core = await createTestCore({
            doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" source="ss" /></extract>
  <spreadsheet name="ss">
  <cell name="coords" prefill="( 1, 2 )" />
  </spreadsheet>
  <graph>
    <point name="P" coords="$(coords.math)" />
  </graph>
  <p>Change x-coordinate: <mathInput name="x1" bindValueTo="$(P.x1)" /></p>
  <p>Change y-coordinate: <mathInput name="x2" bindValueTo="$(P.x2)" /></p>
  `,
        });
        await test_merge_coordinates(core);
    });

    it("spreadsheet can merge coordinates, with math child", async () => {
        let core = await createTestCore({
            doenetML: `
  <extract prop="text" assignNames="t1"><copy prop="cellA1" source="ss" /></extract>
  <spreadsheet name="ss">
  <cell name="coords" ><math>(1,2)</math></cell>
  </spreadsheet>
  <graph>
    <point name="P" coords="$(coords.math)" />
  </graph>
  <p>Change x-coordinate: <mathInput name="x1" bindValueTo="$(P.x1)" /></p>
  <p>Change y-coordinate: <mathInput name="x2" bindValueTo="$(P.x2)" /></p>
  `,
        });

        await test_merge_coordinates(core);
    });

    async function test_copy_prop_index(core: PublicDoenetMLCore) {
        let row = ["A", "B", "C"];
        let column = ["B", "E", "H"];

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"]).be.undefined;
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"]).be.undefined;
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;

        await updateMathInputValue({ latex: "1", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(row[0]);
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"].stateValues.value).eq(column[0]);
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;

        await updateMathInputValue({ latex: "2", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(row[1]);
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"].stateValues.value).eq(column[1]);
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(row[2]);
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"].stateValues.value).eq(column[2]);
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"]).be.undefined;
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"]).be.undefined;
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;
    }
    it("copy propIndex of cells, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>A</cell><cell>B</cell><cell>C</cell></row>
      <row><cell>D</cell><cell>E</cell><cell>F</cell></row>
      <row><cell>G</cell><cell>H</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <copy assignNames="R1" source="spreadsheet2.cellA1.text" />
    <copy assignNames="R2" source="spreadsheet2.cellB1.text" />
    <copy assignNames="R3" source="spreadsheet2.cellC1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.row1[$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="spreadsheet3.cellA1.text" />
    <copy assignNames="C2" source="spreadsheet3.cellA2.text" />
    <copy assignNames="C3" source="spreadsheet3.cellA3.text" />

    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.column2[$n]" />
    </spreadsheet>
    `,
        });

        await test_copy_prop_index(core);
    });

    it("copy multidimensional propIndex of cells, array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>A</cell><cell>B</cell><cell>C</cell></row>
      <row><cell>D</cell><cell>E</cell><cell>F</cell></row>
      <row><cell>G</cell><cell>H</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <copy assignNames="R1" source="spreadsheet2.cellA1.text" />
    <copy assignNames="R2" source="spreadsheet2.cellB1.text" />
    <copy assignNames="R3" source="spreadsheet2.cellC1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.cells[1][$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="spreadsheet3.cellA1.text" />
    <copy assignNames="C2" source="spreadsheet3.cellA2.text" />
    <copy assignNames="C3" source="spreadsheet3.cellA3.text" />

    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.cells[$n][2]" />
    </spreadsheet>
    `,
        });

        await test_copy_prop_index(core);
    });

    it("copy multidimensional propIndex of rows and columns, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>A</cell><cell>B</cell><cell>C</cell></row>
      <row><cell>D</cell><cell>E</cell><cell>F</cell></row>
      <row><cell>G</cell><cell>H</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <copy assignNames="R1" source="spreadsheet2.cellA1.text" />
    <copy assignNames="R2" source="spreadsheet2.cellB1.text" />
    <copy assignNames="R3" source="spreadsheet2.cellC1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.rows[1][$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="spreadsheet3.cellA1.text" />
    <copy assignNames="C2" source="spreadsheet3.cellA2.text" />
    <copy assignNames="C3" source="spreadsheet3.cellA3.text" />

    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.columns[2][$n]" />
    </spreadsheet>
    `,
        });

        await test_copy_prop_index(core);
    });

    it("copy single propIndex of rows and columns, dot and array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>A</cell><cell>B</cell><cell>C</cell></row>
      <row><cell>D</cell><cell>E</cell><cell>F</cell></row>
      <row><cell>G</cell><cell>H</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <copy assignNames="R1" source="spreadsheet2.cellA1.text" />
    <copy assignNames="R2" source="spreadsheet2.cellB1.text" />
    <copy assignNames="R3" source="spreadsheet2.cellC1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.rows[$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="spreadsheet3.cellA1.text" />
    <copy assignNames="C2" source="spreadsheet3.cellA2.text" />
    <copy assignNames="C3" source="spreadsheet3.cellA3.text" />

    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      <copy source="spreadsheet1.columns[$n]" />
    </spreadsheet>
    `,
        });

        let rows = [
            ["A", "B", "C"],
            ["D", "E", "F"],
            ["G", "H", "I"],
        ];
        let columns = [
            ["A", "D", "G"],
            ["B", "E", "H"],
            ["C", "F", "I"],
        ];

        let stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"]).be.undefined;
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"]).be.undefined;
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;

        await updateMathInputValue({ latex: "1", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(rows[0][0]);
        expect(stateVariables["/R2"].stateValues.value).eq(rows[0][1]);
        expect(stateVariables["/R3"].stateValues.value).eq(rows[0][2]);
        expect(stateVariables["/C1"].stateValues.value).eq(columns[0][0]);
        expect(stateVariables["/C2"].stateValues.value).eq(columns[0][1]);
        expect(stateVariables["/C3"].stateValues.value).eq(columns[0][2]);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(rows[1][0]);
        expect(stateVariables["/R2"].stateValues.value).eq(rows[1][1]);
        expect(stateVariables["/R3"].stateValues.value).eq(rows[1][2]);
        expect(stateVariables["/C1"].stateValues.value).eq(columns[1][0]);
        expect(stateVariables["/C2"].stateValues.value).eq(columns[1][1]);
        expect(stateVariables["/C3"].stateValues.value).eq(columns[1][2]);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"].stateValues.value).eq(rows[2][0]);
        expect(stateVariables["/R2"].stateValues.value).eq(rows[2][1]);
        expect(stateVariables["/R3"].stateValues.value).eq(rows[2][2]);
        expect(stateVariables["/C1"].stateValues.value).eq(columns[2][0]);
        expect(stateVariables["/C2"].stateValues.value).eq(columns[2][1]);
        expect(stateVariables["/C3"].stateValues.value).eq(columns[2][2]);

        await updateMathInputValue({ latex: "4", name: "/n", core });
        stateVariables = await core.returnAllStateVariables(true);
        expect(stateVariables["/R1"]).be.undefined;
        expect(stateVariables["/R2"]).be.undefined;
        expect(stateVariables["/R3"]).be.undefined;
        expect(stateVariables["/C1"]).be.undefined;
        expect(stateVariables["/C2"]).be.undefined;
        expect(stateVariables["/C3"]).be.undefined;
    });
});
