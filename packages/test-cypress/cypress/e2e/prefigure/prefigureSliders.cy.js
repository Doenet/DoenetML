import { installPrefigureBuildIntercept } from "../../support/prefigure";

describe("PreFigure sliders @group4", { tags: ["@group4"] }, () => {
    function postDoenetML(doenetML) {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
    }

    function keyboardStepRangeRight(selector) {
        // `trigger("keydown")` only dispatches the event so our React handler can
        // mark the slider as keyboard-transient. Cypress does not perform the
        // browser's native default action for ArrowRight on a range input, so we
        // manually apply one native step and dispatch the corresponding `input`
        // event to mirror what the browser would normally do.
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

    it("renders point sliders and updates an unconstrained point", () => {
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
        cy.get('[aria-label="x coordinate for P"]').should("have.value", "-2");
        cy.get('[aria-label="y coordinate for P"]').should("have.value", "1");

        cy.get('[aria-label="x coordinate for Point 1"]').trigger("mousedown");
        cy.get('[aria-label="x coordinate for Point 1"]')
            .invoke("val", "5.6")
            .trigger("input");

        cy.get('[aria-label="x coordinate for Point 1"]').should(
            "have.value",
            "5.6",
        );
        cy.get("#Qx").should("have.text", "5.6");
        cy.get("#Qy").should("have.text", "4");

        cy.get('[aria-label="x coordinate for Point 1"]').trigger("mouseup");
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

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
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

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3");
        cy.get("#Px").should("have.text", "3");

        cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
        cy.get('[aria-label="x coordinate for P"]')
            .invoke("val", "3.6")
            .trigger("input");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3.6");
        cy.get("#Px").should("have.text", "4");

        cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "4");
        cy.get("#Px").should("have.text", "4");
        cy.get("#Py").should("have.text", "4");
    });

    it("keeps transient local value on first pointer drag input, then snaps on pointerup", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
  <point name="P" labelIsName>
    <constrainToGrid />
    (3,4)
  </point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3");
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

        // During the active drag, the UI should keep the transient local value
        // even though the constrained core value has already snapped.
        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3.6");
        cy.get("#Px").should("have.text", "4");

        cy.get('[aria-label="x coordinate for P"]').trigger("pointerup", {
            pointerId: 1,
            pointerType: "mouse",
            force: true,
        });

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "4");
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

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls size="small">
  <line name="l">y=x</line>
    <point name="P" labelIsName><constrainTo>$l</constrainTo>(0,0)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "0");
        cy.get('[aria-label="y coordinate for P"]').should("have.value", "0");

        cy.get('[aria-label="x coordinate for P"]').trigger("pointerdown", {
            pointerId: 1,
            pointerType: "mouse",
            buttons: 1,
            force: true,
        });

        cy.get('[aria-label="x coordinate for P"]')
            .invoke("val", "4")
            .trigger("input", { force: true });

        // The constrained point should snap to the closest point on y=x: (2,2).
        // While x remains transient and displays the dragged value, y should still
        // synchronize to the latest non-transient core value from constraints.
        cy.get('[aria-label="x coordinate for P"]').should("have.value", "4");
        cy.get("#Px").should("have.text", "2");
        cy.get("#Py").should("have.text", "2");
        cy.get('[aria-label="y coordinate for P"]').should("have.value", "2");

        cy.wait(500);

        cy.get('[aria-label="x coordinate for P"]').trigger("pointerup", {
            pointerId: 1,
            pointerType: "mouse",
            force: true,
        });

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "2");
        cy.get('[aria-label="y coordinate for P"]').should("have.value", "2");
        cy.get("#Px").should("have.text", "2");
        cy.get("#Py").should("have.text", "2");
    });

    it("normalizes slider min and max for reversed graph bounds", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls xMin="10" xMax="-10" yMin="5" yMax="-5">
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

    it("does not render sliders for fixed or non-draggable points", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
    <point>(1,1)</point>
    <point draggable="false">(2,2)</point>
    <point fixed="true">(3,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('input[type="range"]').should("have.length", 2);
        cy.get('[aria-label="x coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="y coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="x coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="y coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="x coordinate for Point 3"]').should("not.exist");
        cy.get('[aria-label="y coordinate for Point 3"]').should("not.exist");
    });

    it("keeps fallback numbering stable when a point becomes non-draggable", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<booleanInput name="middleDraggable" prefill="true" />
<graph renderer="prefigure" addControls>
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

        cy.get('[aria-label="x coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="y coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="x coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="y coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="x coordinate for Point 3"]').should("exist");
        cy.get('[aria-label="y coordinate for Point 3"]').should("exist");
        cy.get('input[type="range"]').should("have.length", 4);
    });

    it("displays slider values with point's display rounding rules", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
    <point name="P" labelIsName displayDecimals="1">(1.555, 2.777)</point>
    <point name="Q" labelIsName displayDigits="2">(3.456, 4.789)</point>
    <point name="R" labelIsName>(0.123, 0.456)</point>
</graph>
<p>P.x: <number name="refPx" displayDecimals="1">$P.x</number></p>
<p>Q.x: <number name="refQx" displayDigits="2">$Q.x</number></p>
<p>R.x: <number name="refRx">$R.x</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        // Verify slider labels match reference number display values
        // P with displayDecimals="1" should display 1.6 (rounded from 1.555)
        cy.get("#refPx").then(($refPx) => {
            const refValue = $refPx.text();
            // Check that slider label contains the same value
            cy.get('input[aria-label="x coordinate for P"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });

        // Q with displayDigits="2" should display 3.5 (rounded to 2 significant digits)
        cy.get("#refQx").then(($refQx) => {
            const refValue = $refQx.text();
            cy.get('input[aria-label="x coordinate for Q"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });

        // R with default display should show coordinate with 3 decimal places
        cy.get("#refRx").then(($refRx) => {
            const refValue = $refRx.text();
            cy.get('input[aria-label="x coordinate for R"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });
    });

    it("displays slider values with padZeros rounding", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
    <point name="P" labelIsName displayDecimals="2" padZeros="true">(1.5, 2)</point>
    <point name="Q" labelIsName displayDigits="3" padZeros="true">(3.45, 4.56)</point>
</graph>
<p>P.x: <number name="refPx" displayDecimals="2" padZeros="true">$P.x</number></p>
<p>Q.x: <number name="refQx" displayDigits="3" padZeros="true">$Q.x</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        // Verify slider labels match reference number display with padding
        // P with displayDecimals="2" and padZeros should display "1.50"
        cy.get("#refPx").then(($refPx) => {
            const refValue = $refPx.text();
            cy.get('input[aria-label="x coordinate for P"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });

        // Q with displayDigits="3" and padZeros
        cy.get("#refQx").then(($refQx) => {
            const refValue = $refQx.text();
            cy.get('input[aria-label="x coordinate for Q"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });
    });

    it("addControls='none' on a point suppresses both sliders for that point", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls>
    <point>(1,1)</point>
    <point addControls="none">(2,2)</point>
    <point>(3,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('input[type="range"]').should("have.length", 4);
        cy.get('[aria-label="x coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="y coordinate for Point 1"]').should("exist");
        cy.get('[aria-label="x coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="y coordinate for Point 2"]').should("not.exist");
        cy.get('[aria-label="x coordinate for Point 3"]').should("exist");
        cy.get('[aria-label="y coordinate for Point 3"]').should("exist");
    });

    it("addControls='xOnly' on a point renders only the x slider", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls>
    <point name="P" labelIsName addControls="xOnly">(3,4)</point>
    <point name="Q" labelIsName>(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("exist");
        cy.get('[aria-label="y coordinate for P"]').should("not.exist");
        cy.get('[aria-label="x coordinate for Q"]').should("exist");
        cy.get('[aria-label="y coordinate for Q"]').should("exist");
        cy.get('input[type="range"]').should("have.length", 3);

        // Verify x slider still moves the point
        cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
        cy.get('[aria-label="x coordinate for P"]')
            .invoke("val", "5")
            .trigger("input");
        cy.get("#Px").should("have.text", "5");
        cy.get("#Py").should("have.text", "4");
        cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");
        cy.get("#Px").should("have.text", "5");
    });

    it("addControls='yOnly' on a point renders only the y slider", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls>
    <point name="P" labelIsName addControls="yOnly">(3,4)</point>
    <point name="Q" labelIsName>(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("not.exist");
        cy.get('[aria-label="y coordinate for P"]').should("exist");
        cy.get('[aria-label="x coordinate for Q"]').should("exist");
        cy.get('[aria-label="y coordinate for Q"]').should("exist");
        cy.get('input[type="range"]').should("have.length", 3);

        // Verify y slider still moves the point
        cy.get('[aria-label="y coordinate for P"]').trigger("mousedown");
        cy.get('[aria-label="y coordinate for P"]')
            .invoke("val", "7")
            .trigger("input");
        cy.get("#Px").should("have.text", "3");
        cy.get("#Py").should("have.text", "7");
        cy.get('[aria-label="y coordinate for P"]').trigger("mouseup");
        cy.get("#Py").should("have.text", "7");
    });

    it("addControls defaults to 'both' when graph-level addControls is set", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls>
    <point name="P" labelIsName>(3,4)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("exist");
        cy.get('[aria-label="y coordinate for P"]').should("exist");
        cy.get('input[type="range"]').should("have.length", 2);
    });

    it("addControls='slidersOnly' keeps slider-only rendering", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="slidersOnly">
    <point name="P" labelIsName>(3,4)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("exist");
        cy.get('[aria-label="y coordinate for P"]').should("exist");
        cy.get('input[type="range"]').should("have.length", 2);
        cy.get('input[type="text"]').should("have.length", 0);
    });

    it("addControls='inputsOnly' renders coordinate inputs and validates before moving", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="inputsOnly">
  <point name="P" labelIsName>(3,4)</point>
  <point name="Q" labelIsName addControls="xOnly">(1,2)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
<p>Qx: <number name="Qx">$Q.x</number></p>
<p>Qy: <number name="Qy">$Q.y</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('input[type="range"]').should("have.length", 0);
        cy.get('[aria-label="coordinates for P"]').should(
            "have.value",
            "(3,4)",
        );
        cy.get('[aria-label="x input for Q"]').should("have.value", "1");

        cy.get('[aria-label="coordinates for P"]').clear().type("(6,7){enter}");
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

    it("addControls='all' keeps sliders and syncs inline inputs", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls="all">
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
        cy.get('input[aria-label="x value input for P"]').should(
            "have.value",
            "5",
        );
        cy.get("#Px").should("have.text", "5");

        cy.get('input[aria-label="x value input for P"]')
            .clear()
            .type("8{enter}");
        cy.get('[aria-label="x coordinate for P"]').should("have.value", "8");
        cy.get("#Px").should("have.text", "8");
    });

    it("addControls='none' renders no controls", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls="none">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get('#g [data-point-slider-card="true"]').should("not.exist");
        cy.get('#g input[type="range"]').should("have.length", 0);
        cy.get('#g input[type="text"]').should("have.length", 0);
        cy.get("#g > div").children().should("have.length", 1);
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

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "0");

        // Focus the x slider and simulate 5 arrow-right presses.
        // The graph default is xMin=-10, xMax=10; step=0.2 (one hundredth of range).
        // 5 presses × 0.2 = 1.0, which is a valid grid point.
        //
        // Each press fires keydown (sets transient) then onInput. The core
        // constrainToGrid snaps back to 0 each time (transient/skippable actions),
        // but the slider handle should accumulate visually.
        const xSlider = '[aria-label="x coordinate for P"]';
        cy.get(xSlider).focus();

        for (let i = 1; i <= 5; i++) {
            keyboardStepRangeRight(xSlider);
        }

        // Slider handle should show the accumulated value (1.0) while core still shows 0.
        cy.get(xSlider).should("have.value", "1");
        cy.get("#Px").should("have.text", "0");

        // Blurring triggers the final non-transient commit.
        cy.get(xSlider).blur();

        // Core evaluates constrainToGrid once against 1.0 → snaps to 1.
        cy.get(xSlider).should("have.value", "1");
        cy.get("#Px").should("have.text", "1");
    });

    it("keyboard blur on constrained point does not send another movePoint", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls size="small">
  <line name="l">y=x</line>
  <point name="P" labelIsName><constrainTo>$l</constrainTo>(0,0)</point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "0");
        cy.get('[aria-label="y coordinate for P"]').should("have.value", "0");

        const xSlider = '[aria-label="x coordinate for P"]';
        const ySlider = '[aria-label="y coordinate for P"]';

        // Press right arrow once on x slider.
        // The graph default is xMin=-10, xMax=10; step=0.2.
        // x becomes 0.2 → constraint snaps to (0.1, 0.1).
        cy.get(xSlider).focus();
        keyboardStepRangeRight(xSlider);

        // Now check that core has constrained the point to (0.1, 0.1).
        cy.get("#Px").should("have.text", "0.1");
        cy.get("#Py").should("have.text", "0.1");

        // The x-slider shows the transient value (what user entered), while
        // the visible y-slider label reflects the constrained core value.
        cy.get(xSlider).should("have.attr", "value", "0.2");
        cy.get(ySlider).should("have.attr", "value", "0.1");

        // Move focus to the y slider, which naturally blurs x.
        // This should NOT send another movePoint(0.2). Instead, it should just
        // clear transient state and sync x back to core (0.1).
        cy.get(ySlider).focus();

        // The point should remain at (0.1, 0.1), not move to (0.15, 0.15).
        // In Cypress's synthetic keyboard path the live `.value` property of the
        // range input can stay stale even after the rendered label/markup has
        // updated, so assert the user-visible slider labels and core values here.
        cy.get(xSlider).should("have.attr", "value", "0.1");
        cy.get(ySlider).should("have.attr", "value", "0.1");
        cy.get("#Px").should("have.text", "0.1");
        cy.get("#Py").should("have.text", "0.1");
    });

    it("defaults controlsPosition to left and keeps side-by-side on wide layout", () => {
        cy.clearIndexedDB();
        cy.viewport(1400, 900);
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls width="640px">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get("#g")
            .should("have.attr", "data-controls-position-requested", "left")
            .and("have.attr", "data-controls-position-effective", "left")
            .and("have.attr", "data-controls-position-side-fallback", "false");

        cy.get("#g > div").should("have.css", "flex-direction", "row");
        cy.get("#g .ChemAccess-element")
            .parent()
            .should("have.css", "order", "2");

        cy.get("#g .ChemAccess-element").then(($graph) => {
            const graphTop = $graph[0].getBoundingClientRect().top;

            cy.get('#g [data-point-slider-card="true"]')
                .first()
                .then(($sliderCard) => {
                    const sliderTop =
                        $sliderCard[0].getBoundingClientRect().top;
                    expect(Math.abs(sliderTop - graphTop)).to.be.lessThan(2);
                });
        });
    });

    it("falls back from left to top on narrow layout", () => {
        cy.clearIndexedDB();
        cy.viewport(420, 900);
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls controlsPosition="left">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get("#g")
            .should("have.attr", "data-controls-position-requested", "left")
            .and("have.attr", "data-controls-position-effective", "top")
            .and("have.attr", "data-controls-position-side-fallback", "true");

        cy.get("#g > div").should("have.css", "flex-direction", "column");
    });

    it("falls back from right to bottom on narrow layout", () => {
        cy.clearIndexedDB();
        cy.viewport(420, 900);
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls controlsPosition="right">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get("#g")
            .should("have.attr", "data-controls-position-requested", "right")
            .and("have.attr", "data-controls-position-effective", "bottom")
            .and("have.attr", "data-controls-position-side-fallback", "true");

        cy.get("#g > div").should("have.css", "flex-direction", "column");
        cy.get("#g .ChemAccess-element")
            .parent()
            .should("have.css", "order", "1");
    });

    it("returns from top fallback back to left when width increases again", () => {
        cy.clearIndexedDB();
        cy.viewport(1400, 900);
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls controlsPosition="left">
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get("#g")
            .should("have.attr", "data-controls-position-effective", "left")
            .and("have.attr", "data-controls-position-side-fallback", "false");

        cy.viewport(420, 900);
        cy.get("#g")
            .should("have.attr", "data-controls-position-effective", "top")
            .and("have.attr", "data-controls-position-side-fallback", "true");

        cy.viewport(1400, 900);
        cy.get("#g")
            .should("have.attr", "data-controls-position-effective", "left")
            .and("have.attr", "data-controls-position-side-fallback", "false");
        cy.get("#g > div").should("have.css", "flex-direction", "row");
    });

    it("keeps graph first in semantic order even when sliders are visually on top", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls controlsPosition="top">
  <shortDescription>Graph first semantic order test</shortDescription>
  <point name="P" labelIsName>(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");

        cy.get("#g .ChemAccess-element")
            .should("have.attr", "tabindex", "0")
            .and("have.attr", "role", "img")
            .and("have.attr", "aria-label", "Graph first semantic order test")
            .focus()
            .should("have.focus");

        cy.get("#g > div").then(($layout) => {
            const children = $layout.children();
            expect(children.length).to.eq(2);
            expect(children.eq(0).find(".ChemAccess-element").length).to.eq(1);
            expect(
                children.eq(1).find('input[type="range"]').length,
            ).to.be.greaterThan(0);
        });

        cy.get("#g")
            .should("have.attr", "data-controls-position-effective", "top")
            .and("have.attr", "data-controls-position-side-fallback", "false");
        cy.get("#g .ChemAccess-element")
            .parent()
            .should("have.css", "order", "2");
    });

    it("does not render slider wrapper when no slider-enabled points exist", () => {
        cy.clearIndexedDB();
        cy.viewport(1400, 900);
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addControls controlsPosition="left" width="640px">
  <point name="P" labelIsName addControls="false">(2,3)</point>
</graph>
`);

        cy.get("#ready").should("have.text", "ready");
        cy.get('#g [data-point-slider-card="true"]').should("not.exist");
        cy.get("#g > div").children().should("have.length", 1);
        cy.get("#g > div > div .ChemAccess-element").should("have.length", 1);
    });

    it("addControls false on point is equivalent to none", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addControls>
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
});
