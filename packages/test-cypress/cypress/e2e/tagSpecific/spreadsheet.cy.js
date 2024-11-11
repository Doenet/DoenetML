import { cesc } from "@doenet/utils";

describe("Spreadsheet Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    var enterSpreadsheetText = function ({
        id = cesc("\\/_spreadsheet1"),
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
  <extract prop="text" assignNames="t1"><copy prop="cellA1" source="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t2"><copy prop="cellB3" source="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t3"><copy prop="cellA4" source="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t4"><copy prop="cellD2" source="_spreadsheet1" /></extract>
  <extract prop="text" assignNames="t5"><copy prop="cellA2" source="_spreadsheet1" /></extract>
  <spreadsheet minNumRows="4" minNumColumns="4">
  <cell>(1,2)</cell>
  <cell>hello</cell>
  <cell>5</cell>
  </spreadsheet>
  
  <graph name="inAllCells">
    <copy prop="pointsInCells" source="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inCellB3">
    <copy prop="pointsInCellB3" source="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inRow2">
    <copy prop="pointsInRow2" source="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inColumn1">
    <copy prop="pointsInColumn1" source="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  <graph name="inRangeA2B4">
    <copy prop="pointsInRangeA2B4" source="_spreadsheet1" removeEmptyArrayEntries />
  </graph>

  `,
                },
                "*",
            );
        });

        // to wait for page to load
        cy.get(cesc("#\\/t1")).should("have.text", "(1,2)");

        cy.log("check initial cell values");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(1,2)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([1, 2]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(0);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([1, 2]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(0);
        });

        // cy.log('move point');
        // cy.window().then(async (win) => {
        //   let stateVariables = await win.returnAllStateVariables1();
        //   stateVariables['/inAllCells'].activeChildren[0].movePoint({ x: -3, y: 7 })
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][0]).eq('( -3, 7 )');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][1]).eq('hello');
        //   expect(stateVariables['/_spreadsheet1'].stateValues.cells[0][2]).eq('5');
        //   expect(stateVariables['/inAllCells'].activeChildren.length).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[0]).eqls(['-', 3]);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[1]).eq(7);

        // })

        cy.log("type in different coordinates");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 1,
            column: 1,
            text: "(4,9)",
            clear: true,
        });
        cy.get(cesc("#\\/t1")).should("have.text", "(4,9)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(4,9)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(0);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(0);
        });

        cy.log("enter new point B3");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 3,
            column: 2,
            text: "(5,4)",
            clear: true,
        });
        cy.get(cesc("#\\/t2")).should("have.text", "(5,4)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(4,9)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([4, 9]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
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
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[0]).eq(4);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[1]).eq(9);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentName].stateValues.xs[0]).eq(0);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentName].stateValues.xs[1]).eq(1);
        // })

        cy.log("enter random text on top of point in A1");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 1,
            column: 1,
            text: ")x,-",
            clear: true,
        });
        cy.get(cesc("#\\/t1")).should("have.text", ")x,-");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                ")x,-",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(0);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
        });

        cy.log("enter new point in A4");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 4,
            column: 1,
            text: "(3,2)",
            clear: true,
        });
        cy.get(cesc("#\\/t3")).should("have.text", "(3,2)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                ")x,-",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[3][0]).eq(
                "(3,2)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        cy.log("enter point on top of text in A1");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 1,
            column: 1,
            text: "(7,3)",
            clear: true,
        });
        cy.get(cesc("#\\/t1")).should("have.text", "(7,3)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(7,3)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[3][0]).eq(
                "(3,2)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(3);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[2]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(0);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[1].componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        cy.log("non-numerical point added (but not graphed) in D2");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 2,
            column: 4,
            text: "(x,q)",
            clear: true,
        });
        cy.get(cesc("#\\/t4")).should("have.text", "(x,q)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(7,3)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[3][0]).eq(
                "(3,2)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[1][3]).eq(
                "(x,q)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(4);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[2]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[3]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inRow2"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[1].componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

        cy.log("3D point added (but not graphed) in A2");
        enterSpreadsheetText({
            id: cesc("\\/_spreadsheet1"),
            row: 2,
            column: 1,
            text: "(1,2,3)",
            clear: true,
        });
        cy.get(cesc("#\\/t5")).should("have.text", "(1,2,3)");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][0]).eq(
                "(7,3)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][1]).eq(
                "hello",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[0][2]).eq(
                "5",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[2][1]).eq(
                "(5,4)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[3][0]).eq(
                "(3,2)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[1][3]).eq(
                "(x,q)",
            );
            expect(stateVariables["/_spreadsheet1"].stateValues.cells[1][0]).eq(
                "(1,2,3)",
            );
            expect(stateVariables["/inAllCells"].activeChildren.length).eq(5);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[2]
                        .componentName
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[3]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inAllCells"].activeChildren[4]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inCellB3"].activeChildren.length).eq(1);
            expect(
                stateVariables[
                    stateVariables["/inCellB3"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(stateVariables["/inRow2"].activeChildren.length).eq(2);
            expect(
                stateVariables[
                    stateVariables["/inRow2"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[
                    stateVariables["/inRow2"].activeChildren[1].componentName
                ].stateValues.xs,
            ).eqls(["x", "q"]);
            expect(stateVariables["/inColumn1"].activeChildren.length).eq(3);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[0].componentName
                ].stateValues.xs,
            ).eqls([7, 3]);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[1].componentName
                ].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[
                    stateVariables["/inColumn1"].activeChildren[2].componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
            expect(stateVariables["/inRangeA2B4"].activeChildren.length).eq(3);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[0]
                        .componentName
                ].stateValues.xs,
            ).eqls([1, 2, 3]);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[1]
                        .componentName
                ].stateValues.xs,
            ).eqls([5, 4]);
            expect(
                stateVariables[
                    stateVariables["/inRangeA2B4"].activeChildren[2]
                        .componentName
                ].stateValues.xs,
            ).eqls([3, 2]);
        });

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
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[0]).eq(7);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[0].componentName].stateValues.xs[1]).eq(3);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentName].stateValues.xs[0]).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentName].stateValues.xs[1]).eq(2);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[1].componentName].stateValues.xs[2]).eq(3);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[2].componentName].stateValues.xs[0]).eq(8);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[2].componentName].stateValues.xs[1]).eq(5);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[3].componentName].stateValues.xs[0]).eq(0);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[3].componentName].stateValues.xs[1]).eq(1);
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[4].componentName].stateValues.xs[0]).eq('x');
        //   expect(stateVariables[stateVariables['/inAllCells'].activeChildren[4].componentName].stateValues.xs[1]).eq('q');
        // })
    });

    it("copy propIndex of evaluated cells", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <copy assignNames="R1" source="_spreadsheet2.evaluatedCellA1.text" />
    <copy assignNames="R2" source="_spreadsheet2.evaluatedCellB1.text" />
    <copy assignNames="R3" source="_spreadsheet2.evaluatedCellC1.text" />
  
    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy prop="evaluatedRow1" source="_spreadsheet1" propIndex="$n" />
    </spreadsheet>

    <copy assignNames="C1" source="_spreadsheet3.evaluatedCellA1.text" />
    <copy assignNames="C2" source="_spreadsheet3.evaluatedCellA2.text" />
    <copy assignNames="C3" source="_spreadsheet3.evaluatedCellA3.text" />

    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy prop="evaluatedColumn2" source="_spreadsheet1" propIndex="$n" />
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/R1")).should("have.text", row[0]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[0]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[1]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[1]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[2]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[2]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");
    });

    it("copy propIndex of evaluated cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>
    <copy assignNames="R1" source="_spreadsheet2.evaluatedCellA1.text" />
    <copy assignNames="R2" source="_spreadsheet2.evaluatedCellB1.text" />
    <copy assignNames="R3" source="_spreadsheet2.evaluatedCellC1.text" />
  
    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedRow1[$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="_spreadsheet3.evaluatedCellA1.text" />
    <copy assignNames="C2" source="_spreadsheet3.evaluatedCellA2.text" />
    <copy assignNames="C3" source="_spreadsheet3.evaluatedCellA3.text" />


    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedColumn2[$n]" />
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/R1")).should("have.text", row[0]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[0]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[1]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[1]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[2]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[2]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");
    });

    it("copy multidimensional propIndex of evaluated cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>
    <copy assignNames="R1" source="_spreadsheet2.evaluatedCellA1.text" />
    <copy assignNames="R2" source="_spreadsheet2.evaluatedCellB1.text" />
    <copy assignNames="R3" source="_spreadsheet2.evaluatedCellC1.text" />
  
    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedCells[1][$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="_spreadsheet3.evaluatedCellA1.text" />
    <copy assignNames="C2" source="_spreadsheet3.evaluatedCellA2.text" />
    <copy assignNames="C3" source="_spreadsheet3.evaluatedCellA3.text" />


    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedCells[$n][2]" />
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/R1")).should("have.text", row[0]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[0]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[1]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[1]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[2]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[2]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");
    });

    it("copy multidimensional propIndex of evaluated rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>
    <copy assignNames="R1" source="_spreadsheet2.evaluatedCellA1.text" />
    <copy assignNames="R2" source="_spreadsheet2.evaluatedCellB1.text" />
    <copy assignNames="R3" source="_spreadsheet2.evaluatedCellC1.text" />
  
    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedRows[1][$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="_spreadsheet3.evaluatedCellA1.text" />
    <copy assignNames="C2" source="_spreadsheet3.evaluatedCellA2.text" />
    <copy assignNames="C3" source="_spreadsheet3.evaluatedCellA3.text" />


    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedColumns[2][$n]" />
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let row = ["1", "2", "3"];
        let column = ["2", "5", "7"];

        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/R1")).should("have.text", row[0]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[0]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[1]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[1]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", row[2]);
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("have.text", column[2]);
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");
    });

    it("copy single propIndex of evaluated rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>1</cell><cell>2</cell><cell>=A1+B1</cell></row>
      <row><cell>D</cell><cell>5</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>=B1+B2</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>
    <copy assignNames="R1" source="_spreadsheet2.evaluatedCellA1.text" />
    <copy assignNames="R2" source="_spreadsheet2.evaluatedCellB1.text" />
    <copy assignNames="R3" source="_spreadsheet2.evaluatedCellC1.text" />
  
    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedRows[$n]" />
    </spreadsheet>

    <copy assignNames="C1" source="_spreadsheet3.evaluatedCellA1.text" />
    <copy assignNames="C2" source="_spreadsheet3.evaluatedCellA2.text" />
    <copy assignNames="C3" source="_spreadsheet3.evaluatedCellA3.text" />


    <spreadsheet minNumRows="0" minNumColumns="0">
      <copy source="_spreadsheet1.evaluatedColumns[$n]" />
    </spreadsheet>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

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

        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/R1")).should("have.text", rows[0][0]);
        cy.get(cesc("#\\/R2")).should("have.text", rows[0][1]);
        cy.get(cesc("#\\/R3")).should("have.text", rows[0][2]);
        cy.get(cesc("#\\/C1")).should("have.text", columns[0][0]);
        cy.get(cesc("#\\/C2")).should("have.text", columns[0][1]);
        cy.get(cesc("#\\/C3")).should("have.text", columns[0][2]);

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", rows[1][0]);
        cy.get(cesc("#\\/R2")).should("have.text", rows[1][1]);
        cy.get(cesc("#\\/R3")).should("have.text", rows[1][2]);
        cy.get(cesc("#\\/C1")).should("have.text", columns[1][0]);
        cy.get(cesc("#\\/C2")).should("have.text", columns[1][1]);
        cy.get(cesc("#\\/C3")).should("have.text", columns[1][2]);

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("have.text", rows[2][0]);
        cy.get(cesc("#\\/R2")).should("have.text", rows[2][1]);
        cy.get(cesc("#\\/R3")).should("have.text", rows[2][2]);
        cy.get(cesc("#\\/C1")).should("have.text", columns[2][0]);
        cy.get(cesc("#\\/C2")).should("have.text", columns[2][1]);
        cy.get(cesc("#\\/C3")).should("have.text", columns[2][2]);

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/R1")).should("not.exist");
        cy.get(cesc("#\\/R2")).should("not.exist");
        cy.get(cesc("#\\/R3")).should("not.exist");
        cy.get(cesc("#\\/C1")).should("not.exist");
        cy.get(cesc("#\\/C2")).should("not.exist");
        cy.get(cesc("#\\/C3")).should("not.exist");
    });

    it("copy propIndex of points in cells", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <p><copy prop="pointsInRow1" source="_spreadsheet1" propIndex="$n" assignNames="P1 P2 P3" removeEmptyArrayEntries /></p>

    <p><copy prop="pointsInColumn2" source="_spreadsheet1" propIndex="$n" assignNames="P4 P5 P6" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");
    });

    it("copy propIndex of points in cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <p><copy source="_spreadsheet1.pointsInRow1[$n]" assignNames="P1 P2 P3" removeEmptyArrayEntries /></p>

    <p><copy source="_spreadsheet1.pointsInColumn2[$n]" assignNames="P4 P5 P6" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");
    });

    it("copy multidimensional propIndex of points in cells, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <p><copy source="_spreadsheet1.pointsInCells[1][$n]" assignNames="P1 P2 P3" removeEmptyArrayEntries /></p>

    <p><copy source="_spreadsheet1.pointsInCells[$n][2]" assignNames="P4 P5 P6" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");
    });

    it("copy multidimensional propIndex of points in rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <p><copy source="_spreadsheet1.pointsInRows[1][$n]" assignNames="P1 P2 P3" removeEmptyArrayEntries /></p>

    <p><copy source="_spreadsheet1.pointsInColumns[2][$n]" assignNames="P4 P5 P6" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");
    });

    it("copy single propIndex of points in rows and columns, dot and array notation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>


    <spreadsheet minNumRows="3" minNumColumns="3">
      <row><cell>(1,2)</cell><cell>B</cell><cell>(3,4)</cell></row>
      <row><cell>D</cell><cell>(5,6)</cell><cell>F</cell></row>
      <row><cell>F</cell><cell>(7,8)</cell><cell>I</cell></row>
    </spreadsheet>

    <p><mathinput name="n" /></p>

    <p><copy source="_spreadsheet1.pointsInRows[$n]" assignNames="P1 P2 P3" removeEmptyArrayEntries /></p>

    <p><copy source="_spreadsheet1.pointsInColumns[$n]" assignNames="P4 P5 P6" removeEmptyArrayEntries /></p>
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        let c1 = "(1,2)";
        let c2 = "(3,4)";
        let c3 = "(5,6)";
        let c4 = "(7,8)";

        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("1{enter}", { force: true });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c1);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}2{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c3);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("contain.text", c4);
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("contain.text", c2);
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");

        cy.get(cesc("#\\/n") + " textarea").type("{end}{backspace}4{enter}", {
            force: true,
        });
        cy.get(cesc("#\\/P1") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P2") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P3") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P4") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P5") + " .mjx-mrow").should("not.exist");
        cy.get(cesc("#\\/P6") + " .mjx-mrow").should("not.exist");
    });
});
