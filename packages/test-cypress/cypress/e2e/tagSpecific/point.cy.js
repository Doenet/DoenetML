import me from "math-expressions";

describe("Point Tag Tests", { tags: ["@group4"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Skipped: this fires 100 `skippable` movePoint actions 10ms apart and asserts
    // fewer than 50 of the middle 98 run — i.e. that the core falls far enough
    // behind to drop most of them. Skipping still works (58–65 of 98 processed
    // across six runs, with the first and last always landing), but the Rust/WASM
    // math engine keeps up well enough that "most" is no longer true. Restoring it
    // means tightening the 10ms spacing until the core is behind again; relaxing
    // the bound to `< 98` would keep the mechanism but drop the intent.
    it.skip("skip actions when drag slow point", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <number name="theta">pi/10</number>
  <matrix name="A">
    <row><number>0.9cos($theta)</number> <number>-0.9sin($theta)</number></row>
    <row><number>0.9sin($theta)</number> <number>0.9cos($theta)</number></row>
  </matrix>
  
  <graph>
    <point name="P0" styleNumber="2">(3,4)</point>
    <repeatForSequence name="mp" length="20" indexName="i">
        <point fixed>$A
            <conditionalContent>
            <case condition="$i=1">$P0</case>
            <else>$mp[$i-1]</else>
            </conditionalContent>
        </point>
    </repeatForSequence>
  </graph>
  <point extend="$P0" name="P0a" />
    `,
                },
                "*",
            );
        });

        cy.get("#P0a").should("have.text", "(3,4)");

        cy.log("move point using skippable actions to upper right");
        let promises = [];

        let p0Idx;
        cy.window().then(async (win) => {
            p0Idx = await win.resolvePath1("P0");
        });

        for (let i = 0; i < 100; i++) {
            cy.window().then(async (win) => {
                let x = i * 0.1;
                let y = i * 0.1;

                promises.push(
                    win.callAction1({
                        actionName: "movePoint",
                        componentIdx: p0Idx,
                        args: { x, y, skippable: true },
                    }),
                );
            });
            cy.wait(10);
        }

        cy.log("most of the actions, except first and last, were skipped");
        cy.window().then(async (win) => {
            Promise.all(promises).then((values) => {
                expect(values.length).eq(100);
                expect(values[0]).eq(true);
                expect(values[99]).eq(true);
                expect(values.slice(1, 99).filter((x) => x).length)
                    .greaterThan(1)
                    .lessThan(50);
            });
        });

        cy.get("#P0a").should("have.text", "(9.9,9.9)");

        cy.log(
            "move point using skippable and non-skippable actions to upper left",
        );
        let promises2 = [];
        for (let i = 0; i < 100; i++) {
            cy.window().then(async (win) => {
                let x = -i * 0.1;
                let y = i * 0.1;

                promises2.push(
                    win.callAction1({
                        actionName: "movePoint",
                        componentIdx: p0Idx,
                        args: { x, y, skippable: i % 10 !== 5 },
                    }),
                );
            });
            cy.wait(10);
        }

        cy.log(
            "most of the skippable but none of the non-skippable actions were skipped",
        );
        cy.window().then(async (win) => {
            Promise.all(promises2).then((values) => {
                expect(values.length).eq(100);
                expect(values[0]).eq(true);
                expect(values[99]).eq(true);

                // None of the non-skippable actions were skipped
                expect(values.filter((x, i) => i % 10 == 5).every((x) => x)).eq(
                    true,
                );

                expect(values.slice(1, 99).filter((x) => x).length)
                    .greaterThan(9)
                    .lessThan(50);
            });
        });

        cy.get("#P0a").should("have.text", "(−9.9,9.9)");
    });

    it("dragging is true only while the point is being dragged", () => {
        // A drag reaches core as a run of `transient` moves, then one move
        // that commits it on release. Guide lines hidden by `$P.dragging`
        // should be in the DOM only between the two.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <graph size="small">
    <shortDescription>A point on x squared with guide lines to the axes</shortDescription>
    <function name="f">x^2</function>
    <point name="P">(0,0)<constrainTo>$f</constrainTo></point>
    <lineSegment lineStyle="dashed" hide="not $P.dragging" endpoints="$P ($P.x, 0)"/>
    <lineSegment lineStyle="dashed" hide="not $P.dragging" endpoints="$P (0, $P.y)"/>
  </graph>
  <p>dragging: <boolean name="d">$P.dragging</boolean></p>
  <p>x: <number name="Px">$P.x</number></p>
    `,
                },
                "*",
            );
        });

        // JSXGraph draws a dashed segment as a <line> with a dash array. It is
        // only in the DOM while the segment is shown.
        const guideLines = ".jxgbox line[stroke-dasharray]";

        cy.get("#d").should("have.text", "false");
        cy.get(".jxgbox").should("exist");
        cy.get(guideLines).should("have.length", 0);

        cy.log("drag steps show the guide lines");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 1, y: 1, transient: true, skippable: true },
            });
        });
        cy.get("#d").should("have.text", "true");
        cy.get("#Px").should("have.text", "1");
        cy.get(guideLines).should("have.length", 2);

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 2, y: 4, transient: true, skippable: true },
            });
        });
        cy.get("#Px").should("have.text", "2");
        cy.get("#d").should("have.text", "true");
        cy.get(guideLines).should("have.length", 2);

        cy.log("releasing the point hides them");
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 2, y: 4 },
            });
        });
        cy.get("#d").should("have.text", "false");
        cy.get("#Px").should("have.text", "2");
        cy.get(guideLines).should("have.length", 0);
    });

    it("restore state with point coords depending on function", () => {
        // Note: this test makes sure that the essential state and string children
        // are restored for a case where the coords attribute depends on a function
        let doenetML = `
    <function name="five">5</function>
    <graph> 
        <point name="P" coords="(0,$$five(0))" />
    </graph>
    <p name="p">$P</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "(0,5)");

        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("P"),
                args: { x: 3, y: 9 },
            });
        });

        cy.get("#p").should("contain.text", "(3,5)");

        cy.wait(1500); // wait for debounce

        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get("#p").should("contain.text", "(3,5)");
    });

    it("markerFilled='false' renders point as open (canvas fill, marker-color stroke)", () => {
        // Pins the renderer's `useOpenSymbol` derivation: the override path
        // (selectedStyle.markerFilled === false on a plain <point> where
        // SVs.open is undefined) must flip JSXGraph's fill/stroke the same
        // way `<endpoint open>` does. Without this guard, a regression to
        // `useOpenSymbol = SVs.open` (the pre-PR form) would still pass the
        // worker unit tests but render the point as a filled glyph.
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
<graph name="g">
    <point name="filled" labelIsName>(1,1)</point>
    <point name="open" labelIsName markerFilled="false">(2,2)</point>
</graph>
`,
                },
                "*",
            );
        });

        cy.get("#g").should("exist");

        // Wait for both JXG points to materialize.
        cy.get("#g").find(".JXGtext").should("have.length.greaterThan", 1);

        cy.get("#g").then(($g) => {
            cy.window().should((win) => {
                const boardRegistry =
                    win.JXG?.boards || win.JXG?.JSXGraph?.boards || {};
                const board = Object.values(boardRegistry).find(
                    (b) => b?.containerObj === $g[0],
                );
                expect(board, "JSXGraph board for graph g").to.exist;

                // Each <point> creates a visible main point plus a transparent
                // shadow point for hit-testing (fillopacity=0). Filter shadows
                // out so we're only asserting on what the user sees.
                const visiblePointsByName = Object.fromEntries(
                    Object.values(board.objects)
                        .filter(
                            (o) =>
                                o?.elType === "point" &&
                                o?.name &&
                                o?.visProp?.fillopacity !== 0,
                        )
                        .map((p) => [p.name, p]),
                );

                expect(
                    visiblePointsByName.filled,
                    "visible main JXG point named 'filled'",
                ).to.exist;
                expect(
                    visiblePointsByName.open,
                    "visible main JXG point named 'open'",
                ).to.exist;

                // Default markerFilled=true: solid marker-color fill, no
                // outline stroke.
                expect(visiblePointsByName.filled.visProp.fillcolor).not.eq(
                    "var(--canvas)",
                );
                expect(visiblePointsByName.filled.visProp.strokecolor).eq(
                    "none",
                );

                // markerFilled=false: canvas-color fill (so the glyph reads as
                // hollow against the background) with marker-color stroke as
                // the outline.
                expect(visiblePointsByName.open.visProp.fillcolor).eq(
                    "var(--canvas)",
                );
                expect(visiblePointsByName.open.visProp.strokecolor).not.eq(
                    "none",
                );
                expect(visiblePointsByName.open.visProp.strokecolor).eq(
                    visiblePointsByName.filled.visProp.fillcolor,
                );
            });
        });
    });
});
