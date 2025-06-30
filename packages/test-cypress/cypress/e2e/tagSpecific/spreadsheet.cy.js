import { cesc } from "@doenet/utils";

describe("Spreadsheet Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    var enterSpreadsheetText = function ({
        id = "spreadsheet1",
        row,
        column,
        text = "",
        clear = false,
        verify = true,
    }) {
        cy.get(
            `#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`,
        ).click({ force: true });
        if (clear) {
            cy.get(`#${id} .handsontableInput`)
                .clear({ force: true })
                .type(`${text}{enter}`, { force: true });
        } else {
            cy.get(`#${id} .handsontableInput`).type(`${text}{enter}`, {
                force: true,
            });
        }
        if (verify) {
            cy.get(
                `#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`,
            ).should("have.text", text);
        }
    };

    it("copy extracted points from spreadsheet", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <setup>
    <cell extend="$spreadsheet1.cellA1" name="A1" />
    <cell extend="$spreadsheet1.cellB3" name="B3" />
    <cell extend="$spreadsheet1.cellA4" name="A4" />
    <cell extend="$spreadsheet1.cellD2" name="D2" />
    <cell extend="$spreadsheet1.cellA2" name="A2" />
  </setup>

  <text extend="$A1.text" name="t1" />
  <text extend="$B3.text" name="t2" />
  <text extend="$A4.text" name="t3" />
  <text extend="$D2.text" name="t4" />
  <text extend="$A2.text" name="t5" />
  <spreadsheet minNumRows="4" minNumColumns="4" name="spreadsheet1">
  <cell>(1,2)</cell>
  <cell>hello</cell>
  <cell>5</cell>
  </spreadsheet>
  
  <graph name="inAllCells">
    <pointList extend="$spreadsheet1.pointsInCells" removeEmptyArrayEntries />
  </graph>

  <graph name="inCellB3">
    <pointList extend="$spreadsheet1.pointsInCellB3" removeEmptyArrayEntries />
  </graph>

  <graph name="inRow2">
    <pointList extend="$spreadsheet1.pointsInRow2" removeEmptyArrayEntries />
  </graph>

  <graph name="inColumn1">
    <pointList extend="$spreadsheet1.pointsInColumn1" removeEmptyArrayEntries />
  </graph>

  <graph name="inRangeA2B4">
    <pointList extend="$spreadsheet1.pointsInRangeA2B4" removeEmptyArrayEntries />
  </graph>

  `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#t1")).should("have.text", "(1,2)");

        cy.log("check initial cell values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq("(1,2)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([1, 2]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([1, 2]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(0);
        });

        // cy.log('move point');
        // cy.window().then(async (win) => {
        //   let stateVariables = await win.returnAllStateVariables1();
        //   stateVariables['/inAllCells'].activeChildren[0].movePoint({ x: -3, y: 7 })
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][0]).eq('( -3, 7 )');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
        //   expect(stateVariables['/inAllCells'].activeChildren.length).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[0]).eqls(['-', 3]);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[1]).eq(7);

        // })

        cy.log("type in different coordinates");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 1,
            column: 1,
            text: "(4,9)",
            clear: true,
        });
        cy.get(cesc("#t1")).should("have.text", "(4,9)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq("(4,9)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(0);
        });

        cy.log("enter new point B3");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 3,
            column: 2,
            text: "(5,4)",
            clear: true,
        });
        cy.get(cesc("#t2")).should("have.text", "(5,4)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq("(4,9)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[2][1],
            ).eq("(5,4)");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inCellB3")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
        });

        // cy.log('move new point');
        // cy.window().then(async (win) => {
        //   let stateVariables = await win.returnAllStateVariables1();
        //   stateVariables['/inAllCells'].activeChildren[1].movePoint({ x: 0, y: 1 })
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][0]).eq('(4,9)');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[2][1]).eq('( 0, 1 )');
        //   expect(stateVariables['/inAllCells'].activeChildren.length).eq(2);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[0]).eq(4);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[1]).eq(9);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentIdx].stateValues.xs[0]).eq(0);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentIdx].stateValues.xs[1]).eq(1);
        // })

        cy.log("enter random text on top of point in A1");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 1,
            column: 1,
            text: ")x,-",
            clear: true,
        });
        cy.get(cesc("#t1")).should("have.text", ")x,-");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq(")x,-");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[2][1],
            ).eq("(5,4)");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inCellB3")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
        });

        cy.log("enter new point in A4");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 4,
            column: 1,
            text: "(3,2)",
            clear: true,
        });
        cy.get(cesc("#t3")).should("have.text", "(3,2)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq(")x,-");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[2][1],
            ).eq("(5,4)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[3][0],
            ).eq("(3,2)");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inCellB3")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        cy.log("enter point on top of text in A1");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 1,
            column: 1,
            text: "(7,3)",
            clear: true,
        });
        cy.get(cesc("#t1")).should("have.text", "(7,3)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq("(7,3)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[2][1],
            ).eq("(5,4)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[3][0],
            ).eq("(3,2)");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(3);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[2].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inCellB3")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(0);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        cy.log("non-numerical point added (but not graphed) in D2");
        enterSpreadsheetText({
            id: "spreadsheet1",
            row: 2,
            column: 4,
            text: "(x,q)",
            clear: true,
        });
        cy.get(cesc("#t4")).should("have.text", "(x,q)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][0],
            ).eq("(7,3)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][1],
            ).eq("hello");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[0][2],
            ).eq("5");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[2][1],
            ).eq("(5,4)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[3][0],
            ).eq("(3,2)");
            expect(
                stateVariables[await win.resolvePath1("spreadsheet1")]
                    .stateValues.cells[1][3],
            ).eq("(x,q)");
            expect(
                stateVariables[await win.resolvePath1("inAllCells")]
                    .activeChildren.length,
            ).eq(4);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[2].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inAllCells")]
                        .activeChildren[3].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inCellB3")]
                    .activeChildren.length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inCellB3")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[await win.resolvePath1("inRow2")].activeChildren
                    .length,
            ).eq(1);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRow2")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(
                stateVariables[await win.resolvePath1("inColumn1")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inColumn1")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(
                stateVariables[await win.resolvePath1("inRangeA2B4")]
                    .activeChildren.length,
            ).eq(2);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[0].componentIdx
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables[await win.resolvePath1("inRangeA2B4")]
                        .activeChildren[1].componentIdx
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        // TODO: skipping 3D point because `<pointList>` makes all points be the same dimension.
        // Do we want to allow more flexibility?

        // cy.log("3D point added (but not graphed) in A2");
        // enterSpreadsheetText({
        //     id: "spreadsheet1",
        //     row: 2,
        //     column: 1,
        //     text: "(1,2,3)",
        //     clear: true,
        // });
        // cy.get(cesc("#t5")).should("have.text", "(1,2,3)");
        // cy.window().then(async (win) => {
        //     let stateVariables = await win.returnAllStateVariables1();
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[0][0],
        //     ).eq("(7,3)");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[0][1],
        //     ).eq("hello");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[0][2],
        //     ).eq("5");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[2][1],
        //     ).eq("(5,4)");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[3][0],
        //     ).eq("(3,2)");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[1][3],
        //     ).eq("(x,q)");
        //     expect(
        //         stateVariables[await win.resolvePath1("spreadsheet1")]
        //             .stateValues.cells[1][0],
        //     ).eq("(1,2,3)");
        //     expect(
        //         stateVariables[await win.resolvePath1("inAllCells")]
        //             .activeChildren.length,
        //     ).eq(5);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inAllCells")]
        //                 .activeChildren[0].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([7, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inAllCells")]
        //                 .activeChildren[1].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([1, 2, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inAllCells")]
        //                 .activeChildren[2].componentIdx
        //         ].stateValues.xs,
        //     ).eqls(["x", "q"]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inAllCells")]
        //                 .activeChildren[3].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([5, 4]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inAllCells")]
        //                 .activeChildren[4].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([3, 2]);
        //     expect(
        //         stateVariables[await win.resolvePath1("inCellB3")]
        //             .activeChildren.length,
        //     ).eq(1);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inCellB3")]
        //                 .activeChildren[0].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([5, 4]);
        //     expect(
        //         stateVariables[await win.resolvePath1("inRow2")].activeChildren
        //             .length,
        //     ).eq(2);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inRow2")]
        //                 .activeChildren[0].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([1, 2, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inRow2")]
        //                 .activeChildren[1].componentIdx
        //         ].stateValues.xs,
        //     ).eqls(["x", "q"]);
        //     expect(
        //         stateVariables[await win.resolvePath1("inColumn1")]
        //             .activeChildren.length,
        //     ).eq(3);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inColumn1")]
        //                 .activeChildren[0].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([7, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inColumn1")]
        //                 .activeChildren[1].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([1, 2, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inColumn1")]
        //                 .activeChildren[2].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([3, 2]);
        //     expect(
        //         stateVariables[await win.resolvePath1("inRangeA2B4")]
        //             .activeChildren.length,
        //     ).eq(3);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inRangeA2B4")]
        //                 .activeChildren[0].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([1, 2, 3]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inRangeA2B4")]
        //                 .activeChildren[1].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([5, 4]);
        //     expect(
        //         stateVariables[
        //             stateVariables[await win.resolvePath1("inRangeA2B4")]
        //                 .activeChildren[2].componentIdx
        //         ].stateValues.xs,
        //     ).eqls([3, 2]);
        // });

        // cy.log('move point');
        // cy.window().then(async (win) => {
        //   let stateVariables = await win.returnAllStateVariables1();
        //   stateVariables['/inAllCells'].activeChildren[2].movePoint({ x: 8, y: 5 });

        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][0]).eq('(7,3)');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[2][1]).eq('( 0, 1 )');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[3][0]).eq('( 8, 5 )');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[1][3]).eq('(x,q)');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[1][0]).eq('(1,2,3)');
        //   expect(stateVariables['/inAllCells'].activeChildren.length).eq(5);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[0]).eq(7);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentIdx].stateValues.xs[1]).eq(3);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentIdx].stateValues.xs[0]).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentIdx].stateValues.xs[1]).eq(2);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentIdx].stateValues.xs[2]).eq(3);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[2].componentIdx].stateValues.xs[0]).eq(8);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[2].componentIdx].stateValues.xs[1]).eq(5);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[3].componentIdx].stateValues.xs[0]).eq(0);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[3].componentIdx].stateValues.xs[1]).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[4].componentIdx].stateValues.xs[0]).eq('x');
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[4].componentIdx].stateValues.xs[1]).eq('q');
        // })
    });

    it("copy propIndex of evaluated cells", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
 
    <setup>
        <cell extend="$spreadsheet2.evaluatedCellA1" name="ec2A1" />
        <cell extend="$spreadsheet2.evaluatedCellB1" name="ec2B1" />
        <cell extend="$spreadsheet2.evaluatedCellC1" name="ec2C1" />
        <cell extend="$spreadsheet3.evaluatedCellA1" name="ec3A1" />
        <cell extend="$spreadsheet3.evaluatedCellA2" name="ec3A2" />
        <cell extend="$spreadsheet3.evaluatedCellA3" name="ec3A3" />
    </setup>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <text name="R1" extend="$ec2A1.text" />
    <text name="R2" extend="$ec2B1.text" />
    <text name="R3" extend="$ec2C1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedRow1[$n]"
    </spreadsheet>

    <text name="C1" extend="$ec3A1.text" />
    <text name="C2" extend="$ec3A2.text" />
    <text name="C3" extend="$ec3A3.text" />

    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedColumn2[$n]
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#R1")).should("have.text", row[0]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[0]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[1]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[1]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[2]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[2]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");
    });

    it("copy multidimensional propIndex of evaluated cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <setup>
        <cell extend="$spreadsheet2.evaluatedCellA1" name="ec2A1" />
        <cell extend="$spreadsheet2.evaluatedCellB1" name="ec2B1" />
        <cell extend="$spreadsheet2.evaluatedCellC1" name="ec2C1" />
        <cell extend="$spreadsheet3.evaluatedCellA1" name="ec3A1" />
        <cell extend="$spreadsheet3.evaluatedCellA2" name="ec3A2" />
        <cell extend="$spreadsheet3.evaluatedCellA3" name="ec3A3" />
    </setup>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <text name="R1" extend="$ec2A1.text" />
    <text name="R2" extend="$ec2B1.text" />
    <text name="R3" extend="$ec2C1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedCells[1][$n]
    </spreadsheet>

    <text name="C1" extend="$ec3A1.text" />
    <text name="C2" extend="$ec3A2.text" />
    <text name="C3" extend="$ec3A3.text" />


    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedCells[$n][2]
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#R1")).should("have.text", row[0]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[0]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[1]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[1]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[2]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[2]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");
    });

    it("copy multidimensional propIndex of evaluated rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <setup>
        <cell extend="$spreadsheet2.evaluatedCellA1" name="ec2A1" />
        <cell extend="$spreadsheet2.evaluatedCellB1" name="ec2B1" />
        <cell extend="$spreadsheet2.evaluatedCellC1" name="ec2C1" />
        <cell extend="$spreadsheet3.evaluatedCellA1" name="ec3A1" />
        <cell extend="$spreadsheet3.evaluatedCellA2" name="ec3A2" />
        <cell extend="$spreadsheet3.evaluatedCellA3" name="ec3A3" />
    </setup>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <text name="R1" extend="$ec2A1.text" />
    <text name="R2" extend="$ec2B1.text" />
    <text name="R3" extend="$ec2C1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedRows[1][$n]
    </spreadsheet>

    <text name="C1" extend="$ec3A1.text" />
    <text name="C2" extend="$ec3A2.text" />
    <text name="C3" extend="$ec3A3.text" />


    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedColumns[2][$n]
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#R1")).should("have.text", row[0]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[0]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[1]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[1]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", row[2]);
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", column[2]);
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");
    });

    it("copy single propIndex of evaluated rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <setup>
        <cell extend="$spreadsheet2.evaluatedCellA1" name="ec2A1" />
        <cell extend="$spreadsheet2.evaluatedCellB1" name="ec2B1" />
        <cell extend="$spreadsheet2.evaluatedCellC1" name="ec2C1" />
        <cell extend="$spreadsheet3.evaluatedCellA1" name="ec3A1" />
        <cell extend="$spreadsheet3.evaluatedCellA2" name="ec3A2" />
        <cell extend="$spreadsheet3.evaluatedCellA3" name="ec3A3" />
    </setup>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <text name="R1" extend="$ec2A1.text" />
    <text name="R2" extend="$ec2B1.text" />
    <text name="R3" extend="$ec2C1.text" />
  
    <spreadsheet name="spreadsheet2" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedRows[$n]
    </spreadsheet>

    <text name="C1" extend="$ec3A1.text" />
    <text name="C2" extend="$ec3A2.text" />
    <text name="C3" extend="$ec3A3.text" />


    <spreadsheet name="spreadsheet3" minNumRows="0" minNumColumns="0">
      $spreadsheet1.evaluatedColumns[$n]
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let rows = [
            ["1", "2", "3"],
            ["D", "5", "F"],
            ["F", "7", "I"],
        ];
        let columns = [
            ["1", "D", "F"],
            ["2", "5", "7"],
            ["3", "F", "I"],
        ];

        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#R1")).should("have.text", rows[0][0]);
        cy.get(cesc("#R2")).should("have.text", rows[0][1]);
        cy.get(cesc("#R3")).should("have.text", rows[0][2]);
        cy.get(cesc("#C1")).should("have.text", columns[0][0]);
        cy.get(cesc("#C2")).should("have.text", columns[0][1]);
        cy.get(cesc("#C3")).should("have.text", columns[0][2]);

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", rows[1][0]);
        cy.get(cesc("#R2")).should("have.text", rows[1][1]);
        cy.get(cesc("#R3")).should("have.text", rows[1][2]);
        cy.get(cesc("#C1")).should("have.text", columns[1][0]);
        cy.get(cesc("#C2")).should("have.text", columns[1][1]);
        cy.get(cesc("#C3")).should("have.text", columns[1][2]);

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", rows[2][0]);
        cy.get(cesc("#R2")).should("have.text", rows[2][1]);
        cy.get(cesc("#R3")).should("have.text", rows[2][2]);
        cy.get(cesc("#C1")).should("have.text", columns[2][0]);
        cy.get(cesc("#C2")).should("have.text", columns[2][1]);
        cy.get(cesc("#C3")).should("have.text", columns[2][2]);

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#R1")).should("have.text", "");
        cy.get(cesc("#R2")).should("have.text", "");
        cy.get(cesc("#R3")).should("have.text", "");
        cy.get(cesc("#C1")).should("have.text", "");
        cy.get(cesc("#C2")).should("have.text", "");
        cy.get(cesc("#C3")).should("have.text", "");
    });

    it("copy propIndex of points in cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>


    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <p><pointList extend="$spreadsheet1.pointsInRow1[$n]" name="P13" removeEmptyArrayEntries /></p>

    <p><pointList extend="$spreadsheet1.pointsInColumn2[$n]" name="P46" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");
    });

    it("copy multidimensional propIndex of points in cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <p><pointList extend="$spreadsheet1.pointsInCells[1][$n]" name="P13" removeEmptyArrayEntries /></p>

    <p><pointList extend="$spreadsheet1.pointsInCells[$n][2]" name="P46" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");
    });

    it("copy multidimensional propIndex of points in rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <p><pointList extend="$spreadsheet1.pointsInRows[1][$n]" name="P13" removeEmptyArrayEntries /></p>

    <p><pointList extend="$spreadsheet1.pointsInColumns[2][$n]" name="P46" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");
    });

    it("copy single propIndex of points in rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <spreadsheet name="spreadsheet1" minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathInput name="n" /></p>

    <p><pointList extend="$spreadsheet1.pointsInRows[$n]" name="P13" removeEmptyArrayEntries /></p>

    <p><pointList extend="$spreadsheet1.pointsInColumns[$n]" name="P46" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("contain.text", c2);
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c1);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c3);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("contain.text", c4);
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c4);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c2);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get(cesc("#n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");
    });
});
