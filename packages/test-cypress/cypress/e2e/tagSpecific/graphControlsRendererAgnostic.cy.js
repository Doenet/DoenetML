describe(
    "Graph controls renderer-agnostic behavior @group4",
    { tags: ["@group4"] },
    () => {
        function postDoenetML(doenetML) {
            cy.window().then((win) => {
                win.postMessage({ doenetML }, "*");
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
    },
);
