import { cesc } from "@doenet/utils";

describe("Spreadsheet Tag Tests", { tags: ["@group5"] }, function () {
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
        cy.get("#t1").should("have.text", "(1,2)");

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
        cy.get("#t1").should("have.text", "(4,9)");
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
        cy.get("#t2").should("have.text", "(5,4)");
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
        cy.get("#t1").should("have.text", ")x,-");
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
        cy.get("#t3").should("have.text", "(3,2)");
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
        cy.get("#t1").should("have.text", "(7,3)");
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
        cy.get("#t4").should("have.text", "(x,q)");
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
        // cy.get("#t5").should("have.text", "(1,2,3)");
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get("#R1").should("have.text", row[0]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[0]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[1]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[1]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[2]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[2]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get("#R1").should("have.text", row[0]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[0]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[1]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[1]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[2]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[2]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get("#R1").should("have.text", row[0]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[0]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[1]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[1]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", row[2]);
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", column[2]);
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

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

        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get("#R1").should("have.text", rows[0][0]);
        cy.get("#R2").should("have.text", rows[0][1]);
        cy.get("#R3").should("have.text", rows[0][2]);
        cy.get("#C1").should("have.text", columns[0][0]);
        cy.get("#C2").should("have.text", columns[0][1]);
        cy.get("#C3").should("have.text", columns[0][2]);

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", rows[1][0]);
        cy.get("#R2").should("have.text", rows[1][1]);
        cy.get("#R3").should("have.text", rows[1][2]);
        cy.get("#C1").should("have.text", columns[1][0]);
        cy.get("#C2").should("have.text", columns[1][1]);
        cy.get("#C3").should("have.text", columns[1][2]);

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", rows[2][0]);
        cy.get("#R2").should("have.text", rows[2][1]);
        cy.get("#R3").should("have.text", rows[2][2]);
        cy.get("#C1").should("have.text", columns[2][0]);
        cy.get("#C2").should("have.text", columns[2][1]);
        cy.get("#C3").should("have.text", columns[2][2]);

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get("#R1").should("have.text", "");
        cy.get("#R2").should("have.text", "");
        cy.get("#R3").should("have.text", "");
        cy.get("#C1").should("have.text", "");
        cy.get("#C2").should("have.text", "");
        cy.get("#C3").should("have.text", "");
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

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

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

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

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

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

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c2);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c4);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
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

        cy.get("#a").should("have.text", "a"); // to wait for page to load

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

        cy.get("#n" + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#P13:1")).should("contain.text", c1);
        cy.get(cesc("#P13:2")).should("contain.text", c2);
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c1);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c3);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c3);
        cy.get(cesc("#P46:2")).should("contain.text", c4);
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("contain.text", c4);
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("contain.text", c2);
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");

        cy.get("#n" + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#P13:1")).should("not.exist");
        cy.get(cesc("#P13:2")).should("not.exist");
        cy.get(cesc("#P13:3")).should("not.exist");
        cy.get(cesc("#P46:1")).should("not.exist");
        cy.get(cesc("#P46:2")).should("not.exist");
        cy.get(cesc("#P46:3")).should("not.exist");
    });

    it("fixed cells are read-only and header rows are emphasized", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet minNumRows="3" minNumColumns="3" name="spreadsheet1">
      <row header>
        <cell>name</cell>
        <cell>value</cell>
      </row>
      <row>
        <cell fixed>locked</cell>
        <cell>open</cell>
      </row>
      <row>
        <cell>6</cell>
        <cell fixed>= A3 * 2</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (row, column) =>
            `#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(${column + 1})`;

        // a header cell is announced as a header, not as ordinary data:
        // Handsontable draws every data cell as a `<td>`, so the role is what
        // carries to a screen reader what a `<tabular>` says with a `<th>`
        cy.get(cell(1, 1)).should("have.attr", "role", "columnheader");
        cy.get(cell(1, 2)).should("have.attr", "role", "columnheader");
        cy.get(cell(2, 1)).should("not.have.attr", "role");

        // the cells of the header row are emphasized, the rest are not
        cy.get(cell(1, 1)).should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        cy.get(cell(1, 1)).should("have.css", "font-weight", "700");
        cy.get(cell(1, 2)).should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        cy.get(cell(2, 1)).should(
            "not.have.class",
            "doenet-spreadsheet-header-cell",
        );

        // the fixed cell is marked read-only, its neighbor is not
        cy.get(cell(2, 1)).should("have.class", "htDimmed");
        cy.get(cell(2, 2)).should("not.have.class", "htDimmed");

        // clicking a fixed cell selects it but builds no editor at all, so its
        // text stands
        cy.get(cell(2, 1)).click({ force: true });
        cy.get(cell(2, 1)).should("have.class", "current");
        cy.get("#spreadsheet1 .handsontableInput").should("not.exist");
        cy.get(cell(2, 1)).should("have.text", "locked");

        // and, being selected, it can still be copied: a copy of the selection
        // carries the fixed cell's text
        cy.window().then((win) => {
            const clipboardData = new win.DataTransfer();
            win.document.querySelector(cell(2, 1)).dispatchEvent(
                new win.ClipboardEvent("copy", {
                    clipboardData,
                    bubbles: true,
                    cancelable: true,
                }),
            );
            expect(clipboardData.getData("text/plain")).to.eq("locked");
        });

        // a fixed cell still evaluates its formula; read-only is about
        // editing, not about what the cell shows
        cy.get(cell(3, 2)).should("have.text", "12");

        // an unfixed cell still edits
        enterSpreadsheetText({
            row: 2,
            column: 2,
            text: "changed",
            clear: true,
        });
    });

    it("a header row is set apart by weight alone, not by a shading that would read as the grid's own labels", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet minNumRows="3" minNumColumns="3" name="spreadsheet1">
      <row header>
        <cell>name</cell>
        <cell>value</cell>
      </row>
      <row>
        <cell>plain</cell>
        <cell>open</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (row, column) =>
            `#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(${column + 1})`;
        // The `1`, `2`, `3` strip down the left of the grid, drawn in the same
        // shading as the `A`, `B`, `C` strip across the top. Handsontable
        // keeps the label strip in an overlay table as well as in the main
        // one, so the selector matches twice and the first match is the one in
        // the grid proper.
        const rowLabel = (row) =>
            cy
                .get(`#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(1)`)
                .first();

        // A header cell is drawn on the same background as an ordinary cell,
        // and a different one from the labels: a header row that took the
        // labels' shading would run into the `A`, `B`, `C` strip above it and
        // read as part of it. The backgrounds come from the theme, so they are
        // compared against each other rather than against a literal color.
        const headerLooksLikeADataCellAndNotLikeTheLabels = () => {
            cy.get(cell(2, 1))
                .invoke("css", "background-color")
                .then((dataBackground) => {
                    cy.get(cell(1, 1)).should(
                        "have.css",
                        "background-color",
                        dataBackground,
                    );
                    rowLabel(1).should(
                        "not.have.css",
                        "background-color",
                        dataBackground,
                    );
                });
        };

        rowLabel(1).should("have.text", "1");

        // what does set the header row apart is its weight
        cy.get(cell(1, 1)).should("have.css", "font-weight", "700");
        cy.get(cell(1, 2)).should("have.css", "font-weight", "700");
        cy.get(cell(2, 1)).should("not.have.css", "font-weight", "700");
        headerLooksLikeADataCellAndNotLikeTheLabels();

        // and it stays that way in dark mode, where a leftover shading would
        // be at its most obvious
        rowLabel(1)
            .invoke("css", "background-color")
            .then((lightBackground) => {
                cy.window().then((win) => {
                    win.postMessage({ darkMode: "dark" }, "*");
                });
                cy.get('[data-theme="dark"]').should("exist");
                // wait for the grid itself to be repainted, not just the page
                rowLabel(1).should(
                    "not.have.css",
                    "background-color",
                    lightBackground,
                );

                cy.get(cell(1, 1)).should("have.css", "font-weight", "700");
                headerLooksLikeADataCellAndNotLikeTheLabels();
            });
    });

    it("cell flags stay with their cells when rows and columns are hidden", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet minNumRows="3" minNumColumns="3" name="spreadsheet1"
      hiddenRows="1" hiddenColumns="1">
      <row>
        <cell>gone1</cell>
        <cell>gone2</cell>
        <cell>gone3</cell>
      </row>
      <row header>
        <cell>head1</cell>
        <cell>head2</cell>
        <cell>head3</cell>
      </row>
      <row>
        <cell>plain1</cell>
        <cell fixed>locked</cell>
        <cell>plain3</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        // Selected by text rather than by position, so the assertions hold
        // whatever the hidden row and column do to the grid's geometry: what
        // is being checked is that each flag reached the cell it describes.
        cy.contains("#spreadsheet1 td", "head2").should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        cy.contains("#spreadsheet1 td", "head3").should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        cy.contains("#spreadsheet1 td", "locked").should(
            "have.class",
            "htDimmed",
        );
        cy.contains("#spreadsheet1 td", "plain3").should(
            "not.have.class",
            "htDimmed",
        );
        cy.contains("#spreadsheet1 td", "plain3").should(
            "not.have.class",
            "doenet-spreadsheet-header-cell",
        );
        // the hidden row and column really are hidden: Handsontable drops
        // them from the DOM rather than rendering them invisibly
        cy.contains("#spreadsheet1 td", "gone2").should("not.exist");
        cy.contains("#spreadsheet1 td", "head1").should("not.exist");
    });

    it("a cell that becomes fixed while the page is open turns read-only", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <booleanInput name="bi" />
    <spreadsheet minNumRows="2" minNumColumns="2" name="spreadsheet1">
      <row>
        <cell fixed="$bi">maybe</cell>
        <cell>open</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (row, column) =>
            `#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(${column + 1})`;

        cy.get(cell(1, 1)).should("not.have.class", "htDimmed");

        cy.get("#bi").click();

        cy.get(cell(1, 1)).should("have.class", "htDimmed");
        cy.get(cell(1, 2)).should("not.have.class", "htDimmed");

        // and the grid now refuses the edit it would have taken before
        cy.get(cell(1, 1)).click({ force: true });
        cy.get("#spreadsheet1 .handsontableInput").should("not.exist");
        cy.get(cell(1, 1)).should("have.text", "maybe");

        cy.get("#bi").click();
        cy.get(cell(1, 1)).should("not.have.class", "htDimmed");
        enterSpreadsheetText({ row: 1, column: 1, text: "yes", clear: true });
    });
    it("a fixed spreadsheet is read-only throughout, an unfixed one is not", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet minNumRows="2" minNumColumns="2" name="spreadsheet1" fixed>
      <row><cell>given</cell></row>
    </spreadsheet>
    <spreadsheet minNumRows="2" minNumColumns="2" name="spreadsheet2">
      <row><cell>given</cell></row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (id, row, column) =>
            `#${id} tbody > :nth-child(${row}) > :nth-child(${column + 1})`;

        // the cell an author wrote and the empty position beside it are both
        // read-only, though only the first has a `<cell>` behind it
        cy.get(cell("spreadsheet1", 1, 1)).should("have.class", "htDimmed");
        cy.get(cell("spreadsheet1", 2, 2)).should("have.class", "htDimmed");
        cy.get(cell("spreadsheet1", 2, 2)).click({ force: true });
        cy.get("#spreadsheet1 .handsontableInput").should("not.exist");

        // without `fixed`, the same empty position still edits
        cy.get(cell("spreadsheet2", 2, 2)).should("not.have.class", "htDimmed");
        enterSpreadsheetText({
            id: "spreadsheet2",
            row: 2,
            column: 2,
            text: "typed",
        });
    });
    it("a header row that is also fixed is still bold, and is drawn like any other header row", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet minNumRows="3" minNumColumns="3" name="spreadsheet1">
      <row header fixed>
        <cell>label</cell>
      </row>
      <row header>
        <cell>open label</cell>
      </row>
      <row>
        <cell fixed>locked</cell>
        <cell>open</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (row, column) =>
            `#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(${column + 1})`;

        // `header` and `fixed` are independent, so a cell can carry both.
        // Protecting a header row is the combination an author reaches for,
        // so it is the one that has to come out looking right.
        cy.get(cell(1, 1)).should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        cy.get(cell(1, 1)).should("have.class", "htDimmed");

        // the bold survives `fixed`: Handsontable sets a read-only cell's
        // color and background with `!important` but does not touch its
        // weight, so a fixed header cell is emphasized exactly as an unfixed
        // one is, and a cell that is only fixed is not bold at all
        cy.get(cell(1, 1)).should("have.css", "font-weight", "700");
        cy.get(cell(2, 1)).should("have.css", "font-weight", "700");
        cy.get(cell(3, 1)).should("not.have.css", "font-weight", "700");
    });

    it("cell flags reach the copies of the cells that fixedRowsTop and fixedColumnsLeft pin in place", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <spreadsheet name="spreadsheet1" width="240px" height="120px"
      fixedRowsTop="1" fixedColumnsLeft="1" minNumRows="12" minNumColumns="12">
      <row header>
        <cell>head1</cell>
        <cell>head2</cell>
      </row>
      <row>
        <cell fixed>lockA</cell>
        <cell>openB</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        // A pinned row or column is not moved out of the grid: it is drawn a
        // second time, in a table of its own that floats over the scrolling
        // one. So every cell in the pinned region has a copy that the header
        // rule and the read-only flag have to reach too, or a header row would
        // lose its emphasis at the moment it is pinned. The copies live under
        // `.ht_clone_*`; the scrolling grid is `.ht_master`.
        const inClone = (clone, text) =>
            cy.contains(`#spreadsheet1 .${clone} tbody td`, text);

        // the column pinned by `fixedColumnsLeft` holds one cell of the header
        // row and one fixed cell
        cy.get("#spreadsheet1 .ht_clone_inline_start").should("exist");
        inClone("ht_clone_inline_start", "head1").should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );
        inClone("ht_clone_inline_start", "lockA").should(
            "have.class",
            "htDimmed",
        );

        // and the row pinned by `fixedRowsTop` holds the rest of the header row
        inClone("ht_clone_top", "head2").should(
            "have.class",
            "doenet-spreadsheet-header-cell",
        );

        // the header role reaches the copies too, or a header row pinned in
        // place would stop being announced as a header
        inClone("ht_clone_inline_start", "head1").should(
            "have.attr",
            "role",
            "columnheader",
        );
        inClone("ht_clone_top", "head2").should(
            "have.attr",
            "role",
            "columnheader",
        );
        inClone("ht_clone_inline_start", "lockA").should(
            "not.have.attr",
            "role",
        );

        // the emphasis is really drawn in the copies, not just the class
        // applied: compared against a cell of the same copy that is in no
        // header row
        inClone("ht_clone_inline_start", "head1").should(
            "have.css",
            "font-weight",
            "700",
        );
        inClone("ht_clone_top", "head2").should(
            "have.css",
            "font-weight",
            "700",
        );
        inClone("ht_clone_inline_start", "lockA").should(
            "not.have.css",
            "font-weight",
            "700",
        );

        // the pinned copy of a fixed cell opens no editor either
        inClone("ht_clone_inline_start", "lockA").click({ force: true });
        cy.get("#spreadsheet1 .handsontableInput").should("not.exist");
        inClone("ht_clone_inline_start", "lockA").should("have.text", "lockA");
    });

    it("a row that stops being a header gives up its header role", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <booleanInput name="bi" />
    <spreadsheet minNumRows="2" minNumColumns="2" name="spreadsheet1">
      <row header="$bi">
        <cell>maybe</cell>
      </row>
      <row>
        <cell>plain</cell>
      </row>
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get("#a").should("have.text", "a"); // to wait for page to load

        const cell = (row, column) =>
            `#spreadsheet1 tbody > :nth-child(${row}) > :nth-child(${column + 1})`;

        // Handsontable reuses its `<td>` elements as the grid redraws, so a
        // role left behind would outlive the header row it was set for
        cy.get(cell(1, 1)).should("not.have.attr", "role");

        cy.get("#bi").click();
        cy.get(cell(1, 1)).should("have.attr", "role", "columnheader");
        cy.get(cell(1, 1)).should("have.css", "font-weight", "700");

        cy.get("#bi").click();
        cy.get(cell(1, 1)).should("not.have.attr", "role");
        cy.get(cell(1, 1)).should("not.have.css", "font-weight", "700");
    });
});
