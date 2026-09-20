describe(
    "Polygon border and vertex-handler optimizations",
    { tags: ["@group1"] },
    function () {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        it("zero line-width polygon renders, updates, and can gain borders", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
    <text name="a">a</text>
    <setup>
      <styleDefinition styleNumber="5" lineWidth="0" fillColor="blue" lineColor="red" />
      <styleDefinition styleNumber="6" lineWidth="4" fillColor="blue" lineColor="red" />
    </setup>
    <number name="sn">5</number>
    <graph name="g">
      <polygon name="pg" styleNumber="$sn" filled vertices="(0,0) (4,0) (4,4) (0,4)" />
    </graph>
    <p>x of vertex 2: <number name="v2x" extend="$pg.vertices[2].x" /></p>
    <mathInput name="mi" bindValueTo="$pg.vertices[2]" />
    <updateValue name="uv" target="$sn" newValue="6" type="number"><label>add border</label></updateValue>
    `,
                    },
                    "*",
                );
            });

            cy.get("#a").should("have.text", "a");

            // the polygon (created without border segments) renders and
            // reflects its vertices
            cy.get("#g").find("svg").should("exist");
            cy.get("#v2x").should("have.text", "4");

            // moving a vertex exercises the update path of a borderless polygon
            cy.get("#mi textarea").type(
                "{end}{shift+home}{backspace}(6,1){enter}",
                {
                    force: true,
                },
            );
            cy.get("#v2x").should("have.text", "6");

            // switching to a style with a visible border recreates the
            // polygon with border segments; it must still render and update
            cy.get("#uv").click();
            cy.get("#v2x").should("have.text", "6");
            cy.get("#mi textarea").type(
                "{end}{shift+home}{backspace}(7,2){enter}",
                {
                    force: true,
                },
            );
            cy.get("#v2x").should("have.text", "7");
        });

        it("vertex handlers and borders follow draggability and line width", () => {
            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
    <text name="a">a</text>
    <setup>
      <styleDefinition styleNumber="5" lineWidth="0" fillColor="blue" lineColor="red" />
    </setup>
    <boolean name="dr">false</boolean>
    <graph name="g">
      <polygon name="pgDraggable" verticesDraggable vertices="(0,0) (4,0) (0,4)" />
      <polygon name="pgFixed" fixed styleNumber="5" filled vertices="(-1,-1) (-5,-1) (-1,-5)" />
      <polygon name="pgToggle" verticesDraggable="$dr" vertices="(6,6) (8,6) (6,8)" />
    </graph>
    <updateValue name="uv" target="$dr" newValue="true" type="boolean"><label>make draggable</label></updateValue>
    `,
                    },
                    "*",
                );
            });

            cy.get("#a").should("have.text", "a");
            cy.get("#g").find("svg").should("exist");

            const hasDownHandler = (el) =>
                (el.eventHandlers.down?.length ?? 0) > 0;

            cy.window().should((win) => {
                const board = Object.values(win.JXG.boards).find((b) =>
                    b.objectsList.some((o) => o.elType === "polygon"),
                );
                expect(board, "board with polygons").to.exist;
                const polygons = board.objectsList.filter(
                    (o) => o.elType === "polygon",
                );
                expect(polygons.length).to.equal(3);

                // zero line-width fixed polygon: no border segments were
                // created, and no vertex drag handlers were attached
                const fixedPg = polygons.find((p) => p.borders.length === 0);
                expect(fixedPg, "borderless polygon").to.exist;
                for (const v of fixedPg.vertices.slice(0, -1)) {
                    expect(hasDownHandler(v), "fixed vertex has no handlers").to
                        .be.false;
                }

                // draggable-vertex polygon: handlers attached, borders exist
                const bordered = polygons.filter((p) => p.borders.length > 0);
                const draggablePg = bordered.find((p) =>
                    hasDownHandler(p.vertices[0]),
                );
                expect(draggablePg, "polygon with vertex handlers").to.exist;
                expect(draggablePg.borders.length).to.equal(3);

                // the not-yet-draggable polygon has no vertex handlers
                const togglePg = bordered.find(
                    (p) => !hasDownHandler(p.vertices[0]),
                );
                expect(togglePg, "toggle polygon without handlers").to.exist;
            });

            // making vertices draggable at runtime attaches handlers lazily
            cy.get("#uv").click();

            cy.window().should((win) => {
                const board = Object.values(win.JXG.boards).find((b) =>
                    b.objectsList.some((o) => o.elType === "polygon"),
                );
                const polygons = board.objectsList.filter(
                    (o) => o.elType === "polygon",
                );
                const bordered = polygons.filter((p) => p.borders.length > 0);
                for (const p of bordered) {
                    expect(
                        hasDownHandler(p.vertices[0]),
                        "vertex handlers attached after becoming draggable",
                    ).to.be.true;
                }
            });
        });
    },
);
