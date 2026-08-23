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
