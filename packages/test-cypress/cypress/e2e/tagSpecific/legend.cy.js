import { toMathJaxString } from "../../../src/util/mathDisplay";

/**
 * Assert that `$above` is painted on top of `$below`. JSXGraph draws each
 * layer into its own `<g>`, appended to the board's `<svg>` in increasing
 * layer order, so the element painted on top comes later in the document.
 */
function assertPaintedAbove($above, $below) {
    const relation = $below[0].compareDocumentPosition($above[0]);
    expect(
        relation & Node.DOCUMENT_POSITION_FOLLOWING,
        "the first element is painted after the second",
    ).to.be.greaterThan(0);
}

/**
 * Assert that the legend's box is drawn around the label showing `labelText`.
 * It only can be if that label was measured at the width it is drawn at: the
 * box is sized from the widest label, so a label measured narrower than it is
 * drawn spills out of the box that was drawn for it.
 */
function assertBoxContainsLabel(getLabel, boxFill = "white") {
    cy.get(`.jxgbox svg [fill='${boxFill}'][fill-opacity='1']`).then(($box) => {
        getLabel().should(($label) => {
            const boxRect = $box[0].getBoundingClientRect();
            const labelRect = $label[0].getBoundingClientRect();
            expect(labelRect.left, "label's left edge").to.be.greaterThan(
                boxRect.left,
            );
            expect(labelRect.right, "label's right edge").to.be.lessThan(
                boxRect.right,
            );
        });
    });
}

/** {@link assertBoxContainsLabel} for the label showing `labelText`. */
function assertLabelInsideBox(labelText, boxFill) {
    assertBoxContainsLabel(
        () => cy.contains(".jxgbox .JXGtext", labelText),
        boxFill,
    );
}

describe("Legend Tag Tests", { tags: ["@group2"] }, function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("legend with math does not crash", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <legend> <label><m>A = $sideA.length</m></label> </legend>

        <lineSegment name="sideA" endpoints="(1,2) (3,4)" />
    </graph>
    `,
                },
                "*",
            );
        });

        cy.get(".MathJax").should("contain.text", toMathJaxString("A =2.83"));
    });

    it("legend swatches honor the layer attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f" styleNumber="10">x^2</function>
        <rectangle vertices="(6,7) (9.5,9.5)" filled layer="2" fixLocation styleNumber="11" />
        <legend layer="3"><label forObject="$f">f</label></legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" lineColor="#ff0000" lineOpacity="1" />
        <styleDefinition styleNumber="11" fillColor="#00ff00" fillOpacity="1"
            lineColor="#0000ff" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        // Two red-stroked elements: the function's curve, on the default
        // layer, and the legend's line swatch, which takes the function's
        // color. The legend asks for layer 3, above the rectangle's layer 2,
        // so its swatch must be painted over the rectangle even though the
        // curve is painted under it.
        cy.get(".jxgbox svg [stroke='#ff0000']").should("have.length", 2);
        cy.get(".jxgbox svg [fill='#00ff00']").should("have.length", 1);

        cy.get(".jxgbox svg [stroke='#ff0000']").then(($strokes) => {
            cy.get(".jxgbox svg [fill='#00ff00']").then(($rectangle) => {
                assertPaintedAbove($rectangle, $strokes.eq(0));
                assertPaintedAbove($strokes.eq(1), $rectangle);
            });
        });
    });

    it("boxed legend is painted over what passes behind it", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f" styleNumber="10">x^2</function>
        <legend boxed><label forObject="$f">f</label></legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" lineColor="#ff0000" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        // With no background in its style definition, the box paints the
        // canvas color, opaquely.
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );

        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").then(($box) => {
            cy.get(".jxgbox svg [stroke='#ff0000']").then(($strokes) => {
                // The function's curve is drawn below the box; the
                // legend's swatch, in the same color, above it.
                expect($strokes.length).to.eq(2);
                assertPaintedAbove($box, $strokes.eq(0));
                assertPaintedAbove($strokes.eq(1), $box);
            });
        });
    });

    it("boxed legend takes its background from a style definition", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f">x^2</function>
        <legend boxed styleNumber="10"><label forObject="$f">f</label></legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" backgroundColor="#ffff00" />
    </setup>
    `,
                },
                "*",
            );
        });

        cy.get(".jxgbox svg [fill='#ffff00'][fill-opacity='1']").should(
            "have.length",
            1,
        );
    });

    it("marker and rectangle swatches honor the layer attribute", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <point name="P" styleNumber="10">(1,1)</point>
        <circle name="C" styleNumber="11" center="(3,3)" radius="1" filled />
        <rectangle vertices="(6,7) (9.5,9.5)" filled layer="2" fixLocation styleNumber="12" />
        <legend layer="3" displayClosedSwatches>
            <label forObject="$P">a point</label>
            <label forObject="$C">a circle</label>
        </legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" markerColor="#ff0000" lineOpacity="1" />
        <styleDefinition styleNumber="11" fillColor="#00ffff" fillOpacity="1"
            lineColor="#ff00ff" lineOpacity="1" />
        <styleDefinition styleNumber="12" fillColor="#00ff00" fillOpacity="1"
            lineColor="#0000ff" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        // A marker swatch is a JSXGraph point and a closed-shape swatch a
        // polygon, each placed on its own layer offset, so the line-swatch
        // spec above says nothing about either. Both take the color of the
        // object they stand for, and the legend asks for layer 3 — above the
        // rectangle's layer 2 — so each swatch must be painted over the
        // rectangle even though the object it stands for is painted under it.
        //
        // The point's marker is the one drawn at the style's marker opacity;
        // the legend's swatch draws the same color at the line opacity, and
        // the point's hit area at no opacity at all.
        cy.get(".jxgbox svg [fill='#00ff00']").should("have.length", 1);
        cy.get(".jxgbox svg [fill='#ff0000'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [fill='#ff0000'][fill-opacity='0.7']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [fill='#00ffff']").should("have.length", 2);

        cy.get(".jxgbox svg [fill='#00ff00']").then(($rectangle) => {
            cy.get(".jxgbox svg [fill='#ff0000'][fill-opacity='0.7']").then(
                ($point) => {
                    assertPaintedAbove($rectangle, $point);
                },
            );
            cy.get(".jxgbox svg [fill='#ff0000'][fill-opacity='1']").then(
                ($markerSwatch) => {
                    assertPaintedAbove($markerSwatch, $rectangle);
                },
            );
            cy.get(".jxgbox svg [fill='#00ffff']").then(($closed) => {
                assertPaintedAbove($rectangle, $closed.eq(0));
                assertPaintedAbove($closed.eq(1), $rectangle);
            });
        });
    });

    it("a boxed legend fits a label that MathJax typesets", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f">x^2</function>
        <legend boxed>
            <label forObject="$f"><m>f(x) = x^2 + 3x + 1</m></label>
        </legend>
    </graph>
    `,
                },
                "*",
            );
        });

        // The box has to enclose the label at the width MathJax leaves it,
        // not at the width of the latex source it was created with.
        //
        // Note what this does not pin down: JSXGraph typesets a latex label
        // with the synchronous `MathJax.typeset`, inside the same
        // `updateRenderer` that precedes the measurement, so the box is
        // already sized correctly without the post-typesetting pass below it.
        // That pass is the safety net for a board drawn before MathJax has
        // finished loading, when JSXGraph's typeset call throws and is
        // swallowed — a load race there is no way to provoke from here.
        cy.get(".jxgbox .MathJax").should("exist");
        assertBoxContainsLabel(() =>
            cy.get(".jxgbox .JXGtext").filter(":has(.MathJax)"),
        );
    });

    it("a boxed legend follows the dark-mode background", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f">x^2</function>
        <legend boxed><label forObject="$f">canvas background</label></legend>
    </graph>
    <graph>
        <function name="g">x^3</function>
        <legend boxed styleNumber="10">
            <label forObject="$g">authored background</label>
        </legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" backgroundColor="#ffff00"
            backgroundColorDarkMode="#00007f" />
    </setup>
    `,
                },
                "*",
            );
        });

        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [fill='#ffff00'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [stroke='#949494']").should("exist");

        cy.setDarkMode("dark");

        // Both the canvas fallback and an authored background follow the
        // theme, as does the box's border.
        cy.get(".jxgbox svg [fill='#121212'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [fill='#00007f'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.get(".jxgbox svg [stroke='#6b6b6b']").should("exist");
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "not.exist",
        );
    });

    it("an unboxed legend draws no box", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f" styleNumber="10">x^2</function>
        <legend><label forObject="$f">f</label></legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" lineColor="#ff0000" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        // The curve and the legend's swatch, so the legend has been drawn
        // before the box is asserted absent.
        cy.get(".jxgbox svg [stroke='#ff0000']").should("have.length", 2);
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "not.exist",
        );
    });

    it("a hidden legend draws nothing", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="hideLegend" />
    <graph>
        <function name="f" styleNumber="10">x^2</function>
        <legend boxed hide="$hideLegend">
            <label forObject="$f">f</label>
        </legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" lineColor="#ff0000" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        // Shown: the function's curve plus the legend's swatch, and the box.
        cy.get(".jxgbox svg [stroke='#ff0000']").should("have.length", 2);
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );

        // Hidden: only the curve is left, and no box is painted over it.
        cy.get("#hideLegend").click();
        cy.get(".jxgbox svg [stroke='#ff0000']").should("have.length", 1);
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "not.exist",
        );

        // Unhidden: the legend comes back whole.
        cy.get("#hideLegend").click();
        cy.get(".jxgbox svg [stroke='#ff0000']").should("have.length", 2);
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );
    });
});
