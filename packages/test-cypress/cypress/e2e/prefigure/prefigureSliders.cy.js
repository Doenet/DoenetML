import { cesc } from "@doenet/utils";
import {
    installPrefigureBuildIntercept,
    waitPastDebounceWindow,
} from "../../support/prefigure";

describe("PreFigure sliders @group4", { tags: ["@group4"] }, () => {
    function postDoenetML(doenetML) {
        cy.window().then((win) => {
            win.postMessage({ doenetML }, "*");
        });
    }

    it("renders point sliders and updates an unconstrained point", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph name="g" renderer="prefigure" addSliders>
  <point name="Q">(3,4)</point>
  <point name="P" labelIsName>(-2,1)</point>
</graph>
<p>Qx: <number name="Qx">$Q.x</number></p>
<p>Qy: <number name="Qy">$Q.y</number></p>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get(cesc("#ready")).should("have.text", "ready");
        waitPastDebounceWindow();

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
        cy.get(cesc("#Qx")).should("have.text", "5.6");
        cy.get(cesc("#Qy")).should("have.text", "4");

        cy.get('[aria-label="x coordinate for Point 1"]').trigger("mouseup");
        cy.get('[aria-label="x coordinate for Point 1"]').should(
            "have.value",
            "5.6",
        );
        cy.get(cesc("#Qx")).should("have.text", "5.6");
        cy.get(cesc("#Qy")).should("have.text", "4");
    });

    it("snaps a constrained point slider to the core value on mouseup", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addSliders>
  <point name="Q">(3,4)</point>
  <point name="P" labelIsName>
    <constrainToGrid />
    (3,4)
  </point>
</graph>
<p>Px: <number name="Px">$P.x</number></p>
<p>Py: <number name="Py">$P.y</number></p>
`);

        cy.get(cesc("#ready")).should("have.text", "ready");
        waitPastDebounceWindow();

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3");
        cy.get(cesc("#Px")).should("have.text", "3");

        cy.get('[aria-label="x coordinate for P"]').trigger("mousedown");
        cy.get('[aria-label="x coordinate for P"]')
            .invoke("val", "3.6")
            .trigger("input");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "3.6");
        cy.get(cesc("#Px")).should("have.text", "4");

        cy.get('[aria-label="x coordinate for P"]').trigger("mouseup");

        cy.get('[aria-label="x coordinate for P"]').should("have.value", "4");
        cy.get(cesc("#Px")).should("have.text", "4");
        cy.get(cesc("#Py")).should("have.text", "4");
    });

    it("does not render sliders for fixed or non-draggable points", () => {
        cy.clearIndexedDB();
        cy.visit("/");

        installPrefigureBuildIntercept();

        postDoenetML(`
<text name="ready">ready</text>
<graph renderer="prefigure" addSliders>
    <point>(1,1)</point>
    <point draggable="false">(2,2)</point>
    <point fixed="true">(3,3)</point>
</graph>
`);

        cy.get(cesc("#ready")).should("have.text", "ready");
        waitPastDebounceWindow();

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
<graph renderer="prefigure" addSliders>
    <point>(1,1)</point>
    <point draggable="$middleDraggable.value">(2,2)</point>
    <point>(3,3)</point>
</graph>
`);

        cy.get(cesc("#ready")).should("have.text", "ready");
        waitPastDebounceWindow();

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
<graph renderer="prefigure" addSliders>
    <point name="P" labelIsName displayDecimals="1">(1.555, 2.777)</point>
    <point name="Q" labelIsName displayDigits="2">(3.456, 4.789)</point>
    <point name="R" labelIsName>(0.123, 0.456)</point>
</graph>
<p>P.x: <number name="refPx" displayDecimals="1">$P.x</number></p>
<p>Q.x: <number name="refQx" displayDigits="2">$Q.x</number></p>
<p>R.x: <number name="refRx">$R.x</number></p>
`);

        cy.get(cesc("#ready")).should("have.text", "ready");
        waitPastDebounceWindow();

        // Verify slider labels match reference number display values
        // P with displayDecimals="1" should display 1.6 (rounded from 1.555)
        cy.get(cesc("#refPx")).then(($refPx) => {
            const refValue = $refPx.text();
            // Check that slider label contains the same value
            cy.get('input[aria-label="x coordinate for P"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });

        // Q with displayDigits="2" should display 3.5 (rounded to 2 significant digits)
        cy.get(cesc("#refQx")).then(($refQx) => {
            const refValue = $refQx.text();
            cy.get('input[aria-label="x coordinate for Q"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });

        // R with default display should show coordinate with 3 decimal places
        cy.get(cesc("#refRx")).then(($refRx) => {
            const refValue = $refRx.text();
            cy.get('input[aria-label="x coordinate for R"]')
                .parent()
                .parent()
                .contains(`x: ${refValue}`)
                .should("exist");
        });
    });
});
