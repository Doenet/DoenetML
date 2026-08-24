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
 * Assert that the legend's box — the one painted the light-mode canvas color —
 * is drawn around the label `getLabel` yields. It only can be if that label was
 * measured at the width it is drawn at: the box is sized from the widest label,
 * so a label measured narrower than it is drawn spills out of the box that was
 * drawn for it.
 *
 * `getLabel` is called rather than passed a value so that the element is
 * queried inside the assertion, letting Cypress retry it.
 */
function assertBoxContainsLabel(getLabel) {
    cy.get(`.jxgbox svg [fill='white'][fill-opacity='1']`).then(($box) => {
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
function assertLabelInsideBox(labelText) {
    assertBoxContainsLabel(() => cy.contains(".jxgbox .JXGtext", labelText));
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
        // with the synchronous `MathJax.typeset`, inside the `board.create`
        // call that makes the label — so by the time the renderer measures it,
        // the box is already sized correctly without the post-typesetting pass.
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

        // JSXGraph paints a label a fixed color rather than letting it
        // inherit one, so a label left alone stays black over the dark box it
        // now sits on. Both labels take the theme's text color instead.
        cy.contains(".jxgbox .JXGtext", "canvas background").should(
            "have.css",
            "color",
            "rgb(255, 255, 255)",
        );
        cy.contains(".jxgbox .JXGtext", "authored background").should(
            "have.css",
            "color",
            "rgb(255, 255, 255)",
        );

        cy.setDarkMode("light");

        cy.contains(".jxgbox .JXGtext", "canvas background").should(
            "have.css",
            "color",
            "rgb(0, 0, 0)",
        );
    });

    it("a legend keeps every label on one row", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph>
        <function name="f">x^2</function>
        <point name="P" styleNumber="2">(1,1)</point>
        <legend boxed>
            <label forObject="$f">a legend label so long that it cannot possibly fit beside its swatch inside the graphing window at all</label>
            <label forObject="$P">short</label>
        </legend>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.contains(".jxgbox .JXGtext", "cannot possibly").should("be.visible");

        // A label is an absolutely positioned div, so one too long for the
        // room beside it wraps — and the legend, which gives each entry a
        // single row and draws its box around those rows, has no way to hold
        // it. Both labels stay one line tall, and neither reaches the row the
        // other is on.
        cy.contains(".jxgbox .JXGtext", "short").then(($short) => {
            const rowHeight = $short[0].getBoundingClientRect().height;
            expect(rowHeight, "a one-line label's height").to.be.greaterThan(0);
            cy.contains(".jxgbox .JXGtext", "cannot possibly").should(
                ($long) => {
                    const long = $long[0].getBoundingClientRect();
                    expect(long.height, "the long label's height").to.eq(
                        rowHeight,
                    );
                    expect(
                        long.bottom,
                        "the long label's bottom edge",
                    ).to.be.lessThan($short[0].getBoundingClientRect().top);
                },
            );
        });
    });

    it("a changed legend keeps its swatches and labels", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="mi" prefill="2" />
    <graph>
        <function name="f" styleNumber="10">x^$mi</function>
        <legend boxed><label forObject="$f">power $mi</label></legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" lineColor="#ff0000" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        cy.get(".jxgbox").should("contain.text", "power 2");

        // The legend's swatch, above the curve of the same color, and the box.
        const idsBefore = {};
        cy.get(".jxgbox svg [stroke='#ff0000']")
            .eq(1)
            .then(($swatch) => {
                idsBefore.swatch = $swatch.attr("id");
                expect(idsBefore.swatch).to.be.a("string").and.not.be.empty;
            });
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").then(($box) => {
            idsBefore.box = $box.attr("id");
        });

        cy.get("#mi textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.get(".jxgbox").should("contain.text", "power 3");
        cy.contains(".jxgbox .JXGtext", "power 3").should("be.visible");

        // The legend is redrawn in place, so its JSXGraph objects — and hence
        // the SVG nodes they render to — are the same ones as before.
        cy.get(".jxgbox svg [stroke='#ff0000']")
            .eq(1)
            .should(($swatch) => {
                expect($swatch.attr("id")).to.eq(idsBefore.swatch);
            });
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            ($box) => {
                expect($box.attr("id")).to.eq(idsBefore.box);
            },
        );
    });

    it("a latex label keeps its text object when it changes", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="mi" prefill="2" />
    <graph>
        <function name="f">x^$mi</function>
        <legend boxed><label forObject="$f"><m>k = $mi</m></label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        let labelId;
        cy.contains(".jxgbox .JXGtext", toMathJaxString("k =2")).then(
            ($label) => {
                labelId = $label.attr("id");
                expect(labelId).to.be.a("string").and.not.be.empty;
            },
        );

        cy.get("#mi textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        // The text is given to the object that was already showing the old
        // one, so MathJax typesets the new label in place rather than the
        // legend building a second text to typeset from scratch.
        cy.contains(".jxgbox .JXGtext", toMathJaxString("k =3")).should(
            ($label) => {
                expect($label.attr("id")).to.eq(labelId);
            },
        );
    });

    it("a legend lays out from a label's full width", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph xmin="-100" xmax="0" ymin="-10" ymax="10">
        <function name="f">x^2</function>
        <legend boxed><label forObject="$f">a fairly long legend label</label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        // Every legend object is created at the graph's origin, which this
        // graph puts hard against the board's right edge — where an absolutely
        // positioned label would have no room to stand at its full width. The
        // label is kept on one line, so it is measured, and the box around it
        // drawn, from the width it will actually be drawn at.
        cy.contains(".jxgbox .JXGtext", "a fairly long legend label").should(
            "be.visible",
        );
        assertLabelInsideBox("a fairly long legend label");
    });

    it("a legend follows a label that grows where it stands", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <textInput name="ti" prefill="short" />
    <graph>
        <function name="f">x^2</function>
        <legend boxed><label forObject="$f">$ti</label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        let labelId;
        cy.contains(".jxgbox .JXGtext", "short").then(($label) => {
            labelId = $label.attr("id");
            expect(labelId).to.be.a("string").and.not.be.empty;
        });

        const grown = "a considerably longer legend label";
        cy.get("#ti_input").clear().type(`${grown}{enter}`);

        // The label is the object that was already there, so it is measured
        // where it was last drawn: hard against the graph's right edge, where
        // this right-aligned legend had put it while it was short. Kept on one
        // line it still measures its full width, so the legend moves left to
        // make room for it instead of being stuck at the width it had.
        cy.contains(".jxgbox .JXGtext", grown).should(($label) => {
            expect($label.attr("id")).to.eq(labelId);
        });
        assertLabelInsideBox(grown);
    });

    it("a legend follows a latex label that grows where it stands", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="mi" prefill="x" />
    <graph>
        <function name="f">x^2</function>
        <legend boxed><label forObject="$f"><m>g = $mi</m></label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        function latexLabel() {
            return cy.get(".jxgbox .JXGtext").filter(":has(.MathJax)");
        }

        let shortWidth;
        latexLabel().should(($label) => {
            shortWidth = $label[0].getBoundingClientRect().width;
            expect(shortWidth, "typeset width").to.be.greaterThan(0);
        });

        cy.get("#mi textarea").type(
            "{selectall}{backspace}abcdefghijklmnop{enter}",
            { force: true },
        );

        // The label is the text object that was already there, typeset in
        // place, and it is measured where the short label left it — hard
        // against the graph's right edge on this right-aligned legend. The
        // box has to be sized from what MathJax made of the new latex, so it
        // still encloses the label once the label is several times wider.
        latexLabel().should(($label) => {
            expect(
                $label[0].getBoundingClientRect().width,
                "typeset width after the label grew",
            ).to.be.greaterThan(shortWidth * 2);
        });
        assertBoxContainsLabel(latexLabel);
    });

    it("a legend can gain and lose its box while it is shown", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="bi" prefill="false" />
    <graph>
        <function name="f">x^2</function>
        <legend boxed="$bi"><label forObject="$f">a label</label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.contains(".jxgbox .JXGtext", "a label").should("be.visible");
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "not.exist",
        );

        cy.get("#bi").click();

        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );
        cy.contains(".jxgbox .JXGtext", "a label").should("be.visible");

        cy.get("#bi").click();

        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "not.exist",
        );
        cy.contains(".jxgbox .JXGtext", "a label").should("be.visible");
    });

    it("marker and rectangle swatches are restyled in place", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="bi" prefill="true" />
    <graph>
        <point name="P" styleNumber="10">(1,2)</point>
        <circle name="c" center="(5,5)" filled="$bi" styleNumber="11" />
        <legend displayClosedSwatches>
            <label forObject="$P">a point</label>
            <label forObject="$c">a circle</label>
        </legend>
    </graph>

    <setup>
        <styleDefinition styleNumber="10" markerColor="#ff0000" markerStyle="square" lineOpacity="1" />
        <styleDefinition styleNumber="11" fillColor="#00ff00" fillOpacity="1"
            lineColor="#0000ff" lineOpacity="1" />
    </setup>
    `,
                },
                "*",
            );
        });

        cy.contains(".jxgbox .JXGtext", "a circle").should("be.visible");

        // The marker swatch is the only fully opaque red element: the point it
        // stands for is drawn translucent. The rectangle swatch is the only
        // green polygon; the circle it stands for is an ellipse.
        const ids = {};
        cy.get(".jxgbox svg [fill='#ff0000'][fill-opacity='1']")
            .should("have.length", 1)
            .then(($marker) => {
                ids.marker = $marker.attr("id");
                expect(ids.marker).to.be.a("string").and.not.be.empty;
            });
        cy.get(".jxgbox svg polygon[fill='#00ff00']")
            .should("have.length", 1)
            .then(($rectangle) => {
                ids.rectangle = $rectangle.attr("id");
                expect(ids.rectangle).to.be.a("string").and.not.be.empty;
            });

        // Unfilling the circle restyles the rectangle swatch, which JSXGraph
        // draws unfilled by taking its fill opacity to zero. Both swatches are
        // still the objects they were: only their attributes changed.
        cy.get("#bi").click();

        cy.then(() => {
            cy.get(`.jxgbox svg polygon#${ids.rectangle}`)
                .should("have.length", 1)
                .and("have.attr", "fill-opacity", "0");
            cy.get(`.jxgbox svg #${ids.marker}`)
                .should("have.length", 1)
                .and("have.attr", "fill", "#ff0000");
        });

        cy.get("#bi").click();

        cy.then(() => {
            cy.get(`.jxgbox svg polygon#${ids.rectangle}`)
                .should("have.length", 1)
                .and("have.attr", "fill", "#00ff00")
                .and("have.attr", "fill-opacity", "1");
        });
    });

    it("a legend follows entries being added and removed", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="n" prefill="2" />
    <graph>
        <repeatForSequence length="$n" indexName="i">
            <function styleNumber="$i">x^$i</function>
        </repeatForSequence>
        <legend boxed>
            <repeatForSequence length="$n" indexName="i">
                <label>curve $i</label>
            </repeatForSequence>
        </legend>
    </graph>
    `,
                },
                "*",
            );
        });

        cy.contains(".jxgbox .JXGtext", "curve 2").should("be.visible");
        cy.get(".jxgbox").should("not.contain.text", "curve 3");
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );

        // A third entry: the legend gains a swatch and a label, and its box
        // grows to hold them.
        cy.get("#n textarea").type("{end}{backspace}3{enter}", { force: true });

        cy.contains(".jxgbox .JXGtext", "curve 3").should("be.visible");
        cy.contains(".jxgbox .JXGtext", "curve 1").should("be.visible");
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );

        // Down to one entry: the swatches and labels of the other two are
        // taken off the board rather than left behind.
        cy.get("#n textarea").type("{end}{backspace}1{enter}", { force: true });

        cy.contains(".jxgbox .JXGtext", "curve 1").should("be.visible");
        cy.get(".jxgbox").should("not.contain.text", "curve 2");
        cy.get(".jxgbox").should("not.contain.text", "curve 3");
        cy.get(".jxgbox svg [fill='white'][fill-opacity='1']").should(
            "have.length",
            1,
        );
    });

    it("a legend's labels follow a layer that changes", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <mathInput name="lay" prefill="1" />
    <graph>
        <function name="f">x^2</function>
        <legend layer="$lay"><label forObject="$f">a label</label></legend>
    </graph>
    `,
                },
                "*",
            );
        });

        // JSXGraph draws these labels as HTML overlaid on the board and turns
        // the layer into the node's z-index — `10 * layer + TEXT_LAYER_OFFSET`,
        // the same arithmetic the swatches use. A reused label cannot be given
        // a new layer, so a legend whose layer changed has to be given a new
        // label, or its labels would keep ordering by the old one while its
        // swatches moved to the new.
        cy.contains(".jxgbox .JXGtext", "a label").should(
            "have.css",
            "z-index",
            "16",
        );

        cy.get("#lay textarea").type("{end}{backspace}3{enter}", {
            force: true,
        });

        cy.contains(".jxgbox .JXGtext", "a label").should(
            "have.css",
            "z-index",
            "36",
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
