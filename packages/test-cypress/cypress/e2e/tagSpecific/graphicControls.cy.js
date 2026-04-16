import { installPrefigureBuildIntercept } from "../../support/prefigure";

describe(
    "Graph controls renderer-agnostic behavior @group4",
    { tags: ["@group4"] },
    () => {
        function postDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
            });
        }

        function keyboardStepRangeRight(selector) {
            cy.get(selector).trigger("keydown", {
                key: "ArrowRight",
                code: "ArrowRight",
                force: true,
            });
            cy.get(selector).then(($slider) => {
                const slider = $slider[0];
                slider.stepUp();
                slider.dispatchEvent(new Event("input", { bubbles: true }));
            });
        }

        it("supports addControls modes on default graph renderer", () => {
            cy.clearIndexedDB();
            cy.viewport(1400, 900);
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="gAll" addControls="all" controlsPosition="left" width="640px">
  <point name="P" labelIsName>(3,4)</point>
</graph>
<graph name="gSliders" addControls="slidersOnly" controlsPosition="left" width="640px">
  <point name="Q" labelIsName>(3,4)</point>
</graph>
<graph name="gInputs" addControls="inputsOnly" controlsPosition="left" width="640px">
  <point name="R" labelIsName>(3,4)</point>
</graph>
<graph name="gNone" addControls="none" controlsPosition="left" width="640px">
  <point name="S" labelIsName>(3,4)</point>
</graph>
<graph name="gNoEligible" addControls="all" controlsPosition="left" width="640px">
  <point name="T" labelIsName draggable="false">(3,4)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get("#gAll-controls").within(() => {
                cy.get('input[type="range"]').should("have.length", 2);
                cy.get('input[type="text"]').should("have.length", 2);
            });

            cy.get("#gSliders-controls").within(() => {
                cy.get('input[type="range"]').should("have.length", 2);
                cy.get('input[type="text"]').should("have.length", 0);
            });

            cy.get("#gInputs-controls").within(() => {
                cy.get('input[type="range"]').should("have.length", 0);
                cy.get('input[type="text"]').should("have.length", 1);
            });

            cy.get("#gNone-controls").should("not.exist");
            cy.get("#gNoEligible-controls").should("not.exist");

            cy.get("#gNone").should(($graph) => {
                expect(
                    $graph[0].getBoundingClientRect().width,
                ).to.be.greaterThan(500);
            });

            cy.get("#gNoEligible").should(($graph) => {
                expect(
                    $graph[0].getBoundingClientRect().width,
                ).to.be.greaterThan(500);
            });
        });

        it("updates from sliders and inline inputs on default graph renderer", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="all">
  <point name="P" labelIsName>(3,4)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "5")
                .trigger("input");
            cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");

            cy.get("#Px").should("have.text", "5");
            cy.get('input[aria-label="x value input for P"]').should(
                "have.value",
                "5",
            );

            cy.get('input[aria-label="x value input for P"]')
                .clear()
                .type("8{enter}");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "8",
            );
            cy.get("#Px").should("have.text", "8");
        });

        it("validates inputsOnly controls on default graph renderer", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="inputsOnly">
  <point name="P" labelIsName>(3,4)</point>
  <point name="Q" labelIsName addControls="xOnly">(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
<p>Qx: <number name="Qx">$Q.x</number></p>
<p>Qy: <number name="Qy">$Q.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('#g-controls input[type="range"]').should("have.length", 0);
            cy.get('[aria-label="coordinates for P"]').should(
                "have.value",
                "(3,4)",
            );
            cy.get('[aria-label="x input for Q"]').should("have.value", "1");

            cy.get('[aria-label="coordinates for P"]')
                .clear()
                .type("(6,7){enter}");
            cy.get("#Px").should("have.text", "6");
            cy.get("#Py").should("have.text", "7");

            cy.get('[aria-label="coordinates for P"]')
                .clear()
                .type("not-a-pair{enter}");
            cy.get('[aria-label="coordinates for P"]').should(
                "have.attr",
                "aria-invalid",
                "true",
            );
            cy.get("#Px").should("have.text", "6");
            cy.get("#Py").should("have.text", "7");

            cy.get('[aria-label="x input for Q"]').clear().type("2+3{enter}");
            cy.get("#Qx").should("have.text", "5");
            cy.get("#Qy").should("have.text", "2");
        });

        it("applies controlsPosition fallback on default graph renderer", () => {
            cy.clearIndexedDB();
            cy.viewport(1400, 900);
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="gLeft" addControls controlsPosition="left" width="640px">
  <point name="P" labelIsName>(2,3)</point>
</graph>
<graph name="gRight" addControls controlsPosition="right" width="640px">
  <point name="Q" labelIsName>(2,3)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get("#gLeft-description > div").should(
                "have.css",
                "flex-direction",
                "row",
            );
            cy.get("#gRight-description > div").should(
                "have.css",
                "flex-direction",
                "row",
            );

            cy.viewport(420, 900);

            cy.get("#gLeft-description > div").should(
                "have.css",
                "flex-direction",
                "column",
            );
            cy.get("#gRight-description > div").should(
                "have.css",
                "flex-direction",
                "column",
            );

            cy.get("#gLeft").parent().should("have.css", "order", "2");
            cy.get("#gRight").parent().should("have.css", "order", "1");
        });

        it("renders and updates circle, line segment, and vector controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="all" controlsPosition="left">
  <circle name="C" labelIsName center="(1,2)" radius="3" addControls="centerAndRadius" />
  <lineSegment name="L" labelIsName endpoints="(0,0) (2,2)" addControls="endpoints" />
  <vector name="V" labelIsName tail="(0,0)" displacement="(2,3)" addControls="displacement" />
</graph>
<number name="CRadius" extend="$C.radius" />
<number name="LEndpoint1X" extend="$L.endpoint1.x" />
<number name="VHeadX" extend="$V.head.x" />
`);

            cy.get("#ready").should("have.text", "ready");
            cy.get("#CRadius").should("have.text", "3");
            cy.get("#LEndpoint1X").should("have.text", "0");
            cy.get("#VHeadX").should("have.text", "2");

            cy.get('[aria-label="center x coordinate for C"]').should("exist");
            cy.get('[aria-label="radius for C"]').should("exist");
            cy.get('[aria-label="endpoint 1 x coordinate for L"]').should(
                "exist",
            );
            cy.get('[aria-label="endpoint 2 y coordinate for L"]').should(
                "exist",
            );
            cy.get('[aria-label="displacement x for V"]').should("exist");
            cy.get('[aria-label="displacement y for V"]').should("exist");

            cy.get('[aria-label="radius for C"]').trigger("mousedown");
            cy.get('[aria-label="radius for C"]')
                .invoke("val", "5")
                .trigger("input");
            cy.get('[aria-label="radius for C"]').trigger("mouseup");
            cy.get("#CRadius").should("have.text", "5");
            cy.get('[aria-label="radius for C"]').should("have.value", "5");

            cy.get('[aria-label="endpoint 1 x coordinate for L"]').trigger(
                "mousedown",
            );
            cy.get('[aria-label="endpoint 1 x coordinate for L"]')
                .invoke("val", "4")
                .trigger("input");
            cy.get('[aria-label="endpoint 1 x coordinate for L"]').trigger(
                "mouseup",
            );
            cy.get("#LEndpoint1X").should("have.text", "4");
            cy.get('[aria-label="endpoint 1 x coordinate for L"]').should(
                "have.value",
                "4",
            );

            cy.get('[aria-label="displacement x for V"]').trigger("mousedown");
            cy.get('[aria-label="displacement x for V"]')
                .invoke("val", "1")
                .trigger("input");
            cy.get('[aria-label="displacement x for V"]').trigger("mouseup");
            cy.get("#VHeadX").should("have.text", "1");
            cy.get('[aria-label="displacement x for V"]').should(
                "have.value",
                "1",
            );
        });

        it("renders headOnly and tailOnly vector controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="Vh" labelIsName tail="(0,0)" head="(2,3)" addControls="headOnly" />
  <vector name="Vt" labelIsName tail="(1,1)" head="(3,4)" addControls="tailOnly" />
</graph>
<point name="VhHead" extend="$Vh.head" />
<number name="VhHeadX" extend="$VhHead.x" />
<point name="VtTail" extend="$Vt.tail" />
<number name="VtTailY" extend="$VtTail.y" />
`);

            cy.get("#ready").should("have.text", "ready");
            cy.get("#VhHeadX").should("have.text", "2");
            cy.get("#VtTailY").should("have.text", "1");

            // headOnly vector: head x and head y sliders present, no tail sliders
            cy.get('[aria-label="head x for Vh"]').should("exist");
            cy.get('[aria-label="head y for Vh"]').should("exist");
            cy.get('[aria-label="tail x for Vh"]').should("not.exist");
            cy.get('[aria-label="tail y for Vh"]').should("not.exist");

            // tailOnly vector: tail x and tail y sliders present, no head sliders
            cy.get('[aria-label="tail x for Vt"]').should("exist");
            cy.get('[aria-label="tail y for Vt"]').should("exist");
            cy.get('[aria-label="head x for Vt"]').should("not.exist");
            cy.get('[aria-label="head y for Vt"]').should("not.exist");

            // Interact with head x slider
            cy.get('[aria-label="head x for Vh"]').trigger("mousedown");
            cy.get('[aria-label="head x for Vh"]')
                .invoke("val", "5")
                .trigger("input");
            cy.get('[aria-label="head x for Vh"]').trigger("mouseup");
            cy.get("#VhHeadX").should("have.text", "5");
            cy.get('[aria-label="head x for Vh"]').should("have.value", "5");

            // Interact with tail y slider
            cy.get('[aria-label="tail y for Vt"]').trigger("mousedown");
            cy.get('[aria-label="tail y for Vt"]')
                .invoke("val", "-2")
                .trigger("input");
            cy.get('[aria-label="tail y for Vt"]').trigger("mouseup");
            cy.get("#VtTailY").should("have.text", "-2");
            cy.get('[aria-label="tail y for Vt"]').should("have.value", "-2");
        });

        it("renders headAndTail vector controls with all four sliders", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="V" labelIsName tail="(0,0)" head="(2,3)" addControls="headAndTail" />
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="head x for V"]').should("exist");
            cy.get('[aria-label="head y for V"]').should("exist");
            cy.get('[aria-label="tail x for V"]').should("exist");
            cy.get('[aria-label="tail y for V"]').should("exist");
        });

        it("headAndTail with only head draggable shows headOnly controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="V" labelIsName tail="(0,0)" head="(2,3)" addControls="headAndTail" tailDraggable="false" />
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            // Only head controls should appear
            cy.get('[aria-label="head x for V"]').should("exist");
            cy.get('[aria-label="head y for V"]').should("exist");
            cy.get('[aria-label="tail x for V"]').should("not.exist");
            cy.get('[aria-label="tail y for V"]').should("not.exist");
        });

        it("headAndTail with only tail draggable shows tailOnly controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="V" labelIsName tail="(0,0)" head="(2,3)" addControls="headAndTail" headDraggable="false" />
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            // Only tail controls should appear
            cy.get('[aria-label="tail x for V"]').should("exist");
            cy.get('[aria-label="tail y for V"]').should("exist");
            cy.get('[aria-label="head x for V"]').should("not.exist");
            cy.get('[aria-label="head y for V"]').should("not.exist");
        });

        it("headAndTail with neither head nor tail draggable shows no controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="V" labelIsName tail="(0,0)" head="(2,3)" addControls="headAndTail" headDraggable="false" tailDraggable="false" />
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="head x for V"]').should("not.exist");
            cy.get('[aria-label="head y for V"]').should("not.exist");
            cy.get('[aria-label="tail x for V"]').should("not.exist");
            cy.get('[aria-label="tail y for V"]').should("not.exist");
            cy.get("#g-controls").should("not.exist");
        });

        it("displacement with headDraggable=false shows no controls", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
  <vector name="V" labelIsName tail="(0,0)" displacement="(2,3)" addControls="displacement" headDraggable="false" />
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="displacement x for V"]').should("not.exist");
            cy.get('[aria-label="displacement y for V"]').should("not.exist");
            cy.get("#g-controls").should("not.exist");
        });

        it("normalizes slider min and max for reversed graph bounds", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls xMin="10" xMax="-10" yMin="5" yMax="-5">
  <point name="P" labelIsName>(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]')
                .should("have.attr", "min", "-10")
                .and("have.attr", "max", "10");
            cy.get('[aria-label="y coordinate for P"]')
                .should("have.attr", "min", "-5")
                .and("have.attr", "max", "5");

            cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "7")
                .trigger("input");
            cy.get("#Px").should("have.text", "7");
            cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");
        });

        it("keeps fallback numbering stable when a point becomes non-draggable", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<booleanInput name="middleDraggable" prefill="true" />
<graph name="g" addControls>
    <point>(1,1)</point>
    <point draggable="$middleDraggable.value">(2,2)</point>
    <point>(3,3)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for Point 1"]').should("exist");
            cy.get('[aria-label="x coordinate for Point 2"]').should("exist");
            cy.get('[aria-label="x coordinate for Point 3"]').should("exist");

            cy.get("#middleDraggable").click();

            cy.get('[aria-label="x coordinate for Point 2"]').should(
                "not.exist",
            );
            cy.get('[aria-label="x coordinate for Point 1"]').should("exist");
            cy.get('[aria-label="x coordinate for Point 3"]').should("exist");
            cy.get('input[type="range"]').should("have.length", 4);
        });

        it("displays slider values with point display rounding rules", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls="slidersOnly">
    <point name="P" labelIsName displayDecimals="1">(1.555, 2.777)</point>
    <point name="Q" labelIsName displayDigits="2">(3.456, 4.789)</point>
    <point name="R" labelIsName displayDecimals="2" padZeros="true">(1.5, 2)</point>
</graph>
<p>P.x: <number name="refPx" displayDecimals="1">$P.x</number></p>
<p>Q.x: <number name="refQx" displayDigits="2">$Q.x</number></p>
<p>R.x: <number name="refRx" displayDecimals="2" padZeros="true">$R.x</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get("#refPx").then(($ref) => {
                cy.get('input[aria-label="x coordinate for P"]')
                    .parent()
                    .parent()
                    .contains(`x: ${$ref.text()}`)
                    .should("exist");
            });

            cy.get("#refQx").then(($ref) => {
                cy.get('input[aria-label="x coordinate for Q"]')
                    .parent()
                    .parent()
                    .contains(`x: ${$ref.text()}`)
                    .should("exist");
            });

            cy.get("#refRx").then(($ref) => {
                cy.get('input[aria-label="x coordinate for R"]')
                    .parent()
                    .parent()
                    .contains(`x: ${$ref.text()}`)
                    .should("exist");
            });
        });

        it("per-point addControls none and yOnly suppress expected sliders", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls>
    <point name="P" labelIsName addControls="none">(1,1)</point>
    <point name="Q" labelIsName addControls="yOnly">(2,2)</point>
    <point name="R" labelIsName>(3,3)</point>
</graph>
<p>Qy: <number name="Qy">$Q.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should("not.exist");
            cy.get('[aria-label="y coordinate for P"]').should("not.exist");
            cy.get('[aria-label="x coordinate for Q"]').should("not.exist");
            cy.get('[aria-label="y coordinate for Q"]').should("exist");
            cy.get('[aria-label="x coordinate for R"]').should("exist");
            cy.get('[aria-label="y coordinate for R"]').should("exist");

            cy.get('[aria-label="y coordinate for Q"]').trigger("mousedown");
            cy.get('[aria-label="y coordinate for Q"]')
                .invoke("val", "7")
                .trigger("input");
            cy.get("#Qy").should("have.text", "7");
            cy.get('[aria-label="y coordinate for Q"]').trigger("mouseup");
        });

        it("addControls=false string on point is equivalent to none", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls>
    <point name="P" labelIsName addControls="false">(3,4)</point>
    <point name="Q" labelIsName>(1,2)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should("not.exist");
            cy.get('[aria-label="y coordinate for P"]').should("not.exist");
            cy.get('[aria-label="x coordinate for Q"]').should("exist");
            cy.get('[aria-label="y coordinate for Q"]').should("exist");
            cy.get('input[type="range"]').should("have.length", 2);
        });

        it("controls layout restores to side-by-side after narrow viewport widens", () => {
            cy.clearIndexedDB();
            cy.viewport(1400, 900);
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls controlsPosition="left" width="640px">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");
            cy.get("#g-description > div").should(
                "have.css",
                "flex-direction",
                "row",
            );

            cy.viewport(420, 900);
            cy.get("#g-description > div").should(
                "have.css",
                "flex-direction",
                "column",
            );

            cy.viewport(1400, 900);
            cy.get("#g-description > div").should(
                "have.css",
                "flex-direction",
                "row",
            );
        });

        it("keeps graph first in DOM order even when controls are visually on top", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" addControls controlsPosition="top">
  <shortDescription>Semantic order test graph</shortDescription>
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get("#g-description > div").then(($layout) => {
                const children = $layout.children();
                expect(children.length).to.eq(2);
                expect(children.eq(0).find("#g").length).to.eq(1);
                expect(
                    children.eq(1).find('input[type="range"]').length,
                ).to.be.greaterThan(0);
            });

            cy.get("#g-controls").parent().should("have.css", "order", "1");
            cy.get("#g").parent().should("have.css", "order", "2");
        });

        it("renders point sliders and updates an unconstrained point on prefigure renderer", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            installPrefigureBuildIntercept();

            postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls>
  <point name="Q">(3,4)</point>
  <point name="P" labelIsName>(-2,1)</point>
</graph>
<p>Qx: <number name="Qx">$Q.x</number></p>
<p>Qy: <number name="Qy">$Q.y</number></p>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for Point 1"]').should(
                "have.value",
                "3",
            );
            cy.get('[aria-label="y coordinate for Point 1"]').should(
                "have.value",
                "4",
            );
            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "-2",
            );
            cy.get('[aria-label="y coordinate for P"]').should(
                "have.value",
                "1",
            );

            cy.get('[aria-label="x coordinate for Point 1"]').trigger(
                "mousedown",
            );
            cy.get('[aria-label="x coordinate for Point 1"]')
                .invoke("val", "5.6")
                .trigger("input");

            cy.get('[aria-label="x coordinate for Point 1"]').should(
                "have.value",
                "5.6",
            );
            cy.get("#Qx").should("have.text", "5.6");
            cy.get("#Qy").should("have.text", "4");

            cy.get('[aria-label="x coordinate for Point 1"]').trigger(
                "mouseup",
            );
            cy.get('[aria-label="x coordinate for Point 1"]').should(
                "have.value",
                "5.6",
            );
            cy.get("#Qx").should("have.text", "5.6");
            cy.get("#Qy").should("have.text", "4");
        });

        it("snaps a constrained point slider to the core value on mouseup", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph addControls="slidersOnly">
  <point name="Q">(3,4)</point>
  <point name="P" labelIsName>
    <constrainToGrid />
    (3,4)
  </point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "3",
            );
            cy.get("#Px").should("have.text", "3");

            cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "3.6")
                .trigger("input");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "3.6",
            );
            cy.get("#Px").should("have.text", "4");

            cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "4",
            );
            cy.get("#Px").should("have.text", "4");
            cy.get("#Py").should("have.text", "4");
        });

        it("keeps transient local value on first pointer drag input, then snaps on pointerup", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph addControls="slidersOnly">
  <point name="P" labelIsName>
    <constrainToGrid />
    (3,4)
  </point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "3",
            );
            cy.get("#Px").should("have.text", "3");

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerdown", {
                pointerId: 1,
                pointerType: "mouse",
                buttons: 1,
                force: true,
            });

            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "3.6")
                .trigger("input", { force: true });

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "3.6",
            );
            cy.get("#Px").should("have.text", "4");

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerup", {
                pointerId: 1,
                pointerType: "mouse",
                force: true,
            });

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "4",
            );
            cy.get("#Px").should("have.text", "4");
        });

        it("preserves latest other-axis value across rapid slider interactions", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            installPrefigureBuildIntercept();

            postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
  <point name="P" labelIsName>(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerdown", {
                pointerId: 1,
                pointerType: "mouse",
                buttons: 1,
                force: true,
            });
            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "4.2")
                .trigger("input", { force: true });

            cy.get('[aria-label="y coordinate for P"]').trigger("pointerdown", {
                pointerId: 2,
                pointerType: "mouse",
                buttons: 1,
                force: true,
            });
            cy.get('[aria-label="y coordinate for P"]')
                .invoke("val", "6.4")
                .trigger("input", { force: true });

            cy.get("#Px").should("have.text", "4.2");
            cy.get("#Py").should("have.text", "6.4");

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerup", {
                pointerId: 1,
                pointerType: "mouse",
                force: true,
            });
            cy.get('[aria-label="y coordinate for P"]').trigger("pointerup", {
                pointerId: 2,
                pointerType: "mouse",
                force: true,
            });
        });

        it("syncs non-dragged axis while constrained drag is still transient", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph addControls size="small">
  <line name="l">y=x</line>
    <point name="P" labelIsName><constrainTo>$l</constrainTo>(0,0)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "0",
            );
            cy.get('[aria-label="y coordinate for P"]').should(
                "have.value",
                "0",
            );

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerdown", {
                pointerId: 1,
                pointerType: "mouse",
                buttons: 1,
                force: true,
            });

            cy.get('[aria-label="x coordinate for P"]')
                .invoke("val", "4")
                .trigger("input", { force: true });

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "4",
            );
            cy.get("#Px").should("have.text", "2");
            cy.get("#Py").should("have.text", "2");
            cy.get('[aria-label="y coordinate for P"]').should(
                "have.value",
                "2",
            );

            cy.wait(500);

            cy.get('[aria-label="x coordinate for P"]').trigger("pointerup", {
                pointerId: 1,
                pointerType: "mouse",
                force: true,
            });

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "2",
            );
            cy.get('[aria-label="y coordinate for P"]').should(
                "have.value",
                "2",
            );
            cy.get("#Px").should("have.text", "2");
            cy.get("#Py").should("have.text", "2");
        });

        it("keyboard arrow keys accumulate as transient and commit final value on blur", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            installPrefigureBuildIntercept();

            postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls size="small">
  <point name="P" labelIsName><constrainToGrid/>(0,0)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "0",
            );

            const xSlider = '[aria-label="x coordinate for P"]';
            cy.get(xSlider).focus();

            for (let i = 1; i <= 5; i++) {
                keyboardStepRangeRight(xSlider);
            }

            cy.get(xSlider).should("have.value", "1");
            cy.get("#Px").should("have.text", "0");

            cy.get(xSlider).blur();

            cy.get(xSlider).should("have.value", "1");
            cy.get("#Px").should("have.text", "1");
        });

        it("keyboard blur on constrained point does not send another movePoint", () => {
            cy.clearIndexedDB();
            cy.visit("/");

            postDoenetML(`
<text name="ready">ready</text>
<graph addControls size="small">
  <line name="l">y=x</line>
  <point name="P" labelIsName><constrainTo>$l</constrainTo>(0,0)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

            cy.get("#ready").should("have.text", "ready");

            cy.get('[aria-label="x coordinate for P"]').should(
                "have.value",
                "0",
            );
            cy.get('[aria-label="y coordinate for P"]').should(
                "have.value",
                "0",
            );

            const xSlider = '[aria-label="x coordinate for P"]';
            const ySlider = '[aria-label="y coordinate for P"]';

            cy.get(xSlider).focus();
            keyboardStepRangeRight(xSlider);

            cy.get("#Px").should("have.text", "0.1");
            cy.get("#Py").should("have.text", "0.1");

            cy.get(xSlider).should("have.attr", "value", "0.2");
            cy.get(ySlider).should("have.attr", "value", "0.1");

            cy.get(ySlider).focus();

            cy.get(xSlider).should("have.attr", "value", "0.1");
            cy.get(ySlider).should("have.attr", "value", "0.1");
            cy.get("#Px").should("have.text", "0.1");
            cy.get("#Py").should("have.text", "0.1");
        });
    },
);
