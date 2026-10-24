const RUN_LIVE_PREFIGURE_ACCESSIBILITY = Boolean(
    Cypress.env("RUN_LIVE_PREFIGURE_ACCESSIBILITY"),
);

const liveDescribe = RUN_LIVE_PREFIGURE_ACCESSIBILITY
    ? describe
    : describe.skip;

/**
 * Compiles `<slopeField>` and `<vectorField>` for real, against the same gate
 * as `prefigureLiveAccessibility.cy.js` — off by default, so a normal CI run
 * pays nothing for the runtime fetch.
 *
 * The conversion's unit tests check the XML handed to PreFigure. Whether
 * PreFigure's `<slope-field>` and `<vector-field>` accept it, and draw a mark
 * at every lattice point the `spacings` names, is only visible here: an
 * integer `spacings` or a padded end that dropped the last lattice line would
 * read as perfectly good XML.
 */
liveDescribe(
    "Live slope and vector field rendering @group4",
    { tags: ["@group4"] },
    () => {
        beforeEach(() => {
            cy.clearIndexedDB();
            cy.visit("/");
        });

        /** The lines drawn inside the group PreFigure made of a field. */
        function fieldLines(svg, handle) {
            const group = svg.querySelector(`g[id$="${handle}"]`);
            expect(group, `group for ${handle}`).to.exist;
            return [...group.querySelectorAll("line")];
        }

        it("draws a mark at every lattice point", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g" renderer="prefigure">
  <shortDescription>Slope and vector fields</shortDescription>
  <slopeField>y - x</slopeField>
  <slopeField dx="2" dy="0.5" xoffset="1" yoffset="0.25">y</slopeField>
  <vectorField normalize>(y, -x)</vectorField>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get("#g .svg svg", { timeout: 30000 }).should(($svg) => {
                const svg = $svg[0];

                // 21 x 21 lattice points from -10 to 10.
                expect(fieldLines(svg, "slopefield_0").length).to.eq(441);

                // x = -9, -7, ..., 9 and y = -9.75, -9.25, ..., 9.75.
                expect(fieldLines(svg, "slopefield_1").length).to.eq(10 * 40);

                // Every point but the origin, where the vector is zero, has an
                // arrow, each of the same length.
                const arrows = fieldLines(svg, "vectorfield_2");
                expect(arrows.length).to.eq(440);
                const lengths = arrows.map((line) =>
                    Math.hypot(
                        Number(line.getAttribute("x2")) -
                            Number(line.getAttribute("x1")),
                        Number(line.getAttribute("y2")) -
                            Number(line.getAttribute("y1")),
                    ),
                );
                expect(Math.max(...lengths) - Math.min(...lengths)).to.be.lt(
                    0.5,
                );
            });
        });

        it("evaluates at the lattice points, not PreFigure's drifting running sum", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" yMin="-1" yMax="1">
  <shortDescription>A slope field up to a closed domain endpoint, and a field with a singularity</shortDescription>
  <slopeField dx="0.1"><function domain="[0,2]">sqrt(2-x)</function></slopeField>
  <vectorField dx="0.2">(1/x, 0)</vectorField>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get("#g .svg svg", { timeout: 30000 }).should(($svg) => {
                const svg = $svg[0];

                // x = 0, 0.1, ..., 2 and y = -1, 0, 1. A running sum of tenths
                // reaches 2.0000000000000004, where sqrt(2 - x) raises and
                // PreFigure would draw none of the field.
                expect(fieldLines(svg, "slopefield_0").length).to.eq(21 * 3);

                // A running sum of fifths stops at -2e-15 rather than 0, where
                // 1/x would be an arrow 1e15 pixels long. At 0 itself the
                // vector is infinite and only that column is left out, so the
                // longest arrow is markLength, 24 pixels, and the graph is
                // 425 pixels wide.
                const arrows = fieldLines(svg, "vectorfield_1");
                expect(arrows.length).to.be.greaterThan(0);
                for (const line of arrows) {
                    expect(
                        Math.abs(
                            Number(line.getAttribute("x2")) -
                                Number(line.getAttribute("x1")),
                        ),
                    ).to.be.lessThan(25);
                }
            });
        });

        it("snaps a coarsened lattice to the lines it kept", () => {
            cy.window().then((win) => {
                win.postMessage(
                    {
                        doenetML: `
<text name="ready">ready</text>
<graph name="g" renderer="prefigure">
  <shortDescription>A field with a singularity on a lattice maxMarks coarsens</shortDescription>
  <vectorField dx="1e-14">(1/x, 0)</vectorField>
</graph>
`,
                    },
                    "*",
                );
            });

            cy.get("#ready").should("have.text", "ready");
            cy.get("#g .svg svg", { timeout: 30000 }).should(($svg) => {
                // maxMarks keeps one line in 8e11, and that long a walk drifts
                // by far more than 1e-14: snapped to the nearest index rather
                // than the nearest kept one, x = 0 landed at -1.1e-13, where
                // 1/x drew an arrow 1.7e12 pixels long.
                const arrows = fieldLines($svg[0], "vectorfield_0");
                expect(arrows.length).to.be.greaterThan(0);
                for (const line of arrows) {
                    expect(
                        Math.abs(
                            Number(line.getAttribute("x2")) -
                                Number(line.getAttribute("x1")),
                        ),
                    ).to.be.lessThan(25);
                }
            });
        });
    },
);
