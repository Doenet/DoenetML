describe("Point and vector list rendering", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    /**
     * The JSXGraph board drawing the graph with DOM id `graphId`, once it
     * exists, passed to `check`.
     */
    function withBoard(graphId, check) {
        cy.get(`#${graphId}`).then(($g) => {
            cy.window().should((win) => {
                const boardRegistry =
                    win.JXG?.boards || win.JXG?.JSXGraph?.boards || {};
                const board = Object.values(boardRegistry).find(
                    (b) => b?.containerObj === $g[0],
                );
                expect(board, `JSXGraph board for graph ${graphId}`).to.exist;
                check(board);
            });
        });
    }

    // The visible points of `board` (each point is drawn with a transparent
    // copy for hit-testing), as `[name, x, y]`, sorted by x.
    function visiblePoints(board) {
        return Object.values(board.objects)
            .filter(
                (o) =>
                    o?.elType === "point" &&
                    o.visProp?.visible !== false &&
                    o.visProp?.fillopacity !== 0,
            )
            .map((p) => [p.name, p.X(), p.Y()])
            .sort((a, b) => a[1] - b[1]);
    }

    it("draws and moves each point of a point list", () => {
        const doenetML = `
    <text name="ready">ready</text>
    <graph name="g">
      <pointList name="pl">(1,2) <point name="A"><label>A</label>(3,4)</point> (5,6)</pointList>
    </graph>
    <p name="ppl">$pl</p>
    <p name="pA">$A</p>
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#ppl").should("contain.text", "(1,2), (3,4), (5,6)");

        withBoard("g", (board) => {
            expect(visiblePoints(board)).eqls([
                ["", 1, 2],
                ["A", 3, 4],
                ["", 5, 6],
            ]);
        });

        // move the first and second entries, as their renderers would
        cy.window().then(async (win) => {
            const listIdx = await win.resolvePath1("pl");
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: listIdx,
                args: { x: -1, y: -2, listEntryIndex: 0 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: listIdx,
                args: { x: -3, y: 7, listEntryIndex: 1 },
            });
        });

        cy.get("#ppl").should("contain.text", "(−1,−2), (−3,7), (5,6)");
        cy.get("#pA").should("contain.text", "(−3,7)");
        withBoard("g", (board) => {
            expect(visiblePoints(board)).eqls([
                ["A", -3, 7],
                ["", -1, -2],
                ["", 5, 6],
            ]);
        });
    });

    it("draws and moves each vector of a vector list", () => {
        const doenetML = `
    <text name="ready">ready</text>
    <graph name="g">
      <vectorList name="vl">(1,2) <vector tail="(1,1)" head="(4,5)" /></vectorList>
    </graph>
    <p name="pvl">$vl</p>
    <p name="ptails">$vl.tail</p>
    `;

        cy.window().then(async (win) => {
            win.postMessage({ doenetML }, "*");
        });

        cy.get("#ready").should("have.text", "ready");
        cy.get("#pvl").should("contain.text", "(1,2), (3,4)");
        cy.get("#ptails").should("contain.text", "(0,0), (1,1)");

        function arrows(board) {
            return Object.values(board.objects)
                .filter(
                    (o) =>
                        o?.elType === "arrow" && o.visProp?.visible !== false,
                )
                .map((a) => [
                    [a.point1.X(), a.point1.Y()],
                    [a.point2.X(), a.point2.Y()],
                ])
                .sort((a, b) => a[0][0] - b[0][0]);
        }

        withBoard("g", (board) => {
            expect(arrows(board)).eqls([
                [
                    [0, 0],
                    [1, 2],
                ],
                [
                    [1, 1],
                    [4, 5],
                ],
            ]);
        });

        // move the whole of the first vector, and the tail of the second
        cy.window().then(async (win) => {
            const listIdx = await win.resolvePath1("vl");
            await win.callAction1({
                actionName: "moveVector",
                componentIdx: listIdx,
                args: {
                    tailcoords: [-2, 1],
                    headcoords: [-1, 3],
                    listEntryIndex: 0,
                },
            });
            await win.callAction1({
                actionName: "moveVector",
                componentIdx: listIdx,
                args: { tailcoords: [2, 2], listEntryIndex: 1 },
            });
        });

        cy.get("#pvl").should("contain.text", "(1,2), (2,3)");
        cy.get("#ptails").should("contain.text", "(−2,1), (2,2)");
        withBoard("g", (board) => {
            expect(arrows(board)).eqls([
                [
                    [-2, 1],
                    [-1, 3],
                ],
                [
                    [2, 2],
                    [4, 5],
                ],
            ]);
        });
    });
});
