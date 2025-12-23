import { cesc } from "@doenet/utils";

describe("Graph Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("changing bounding box", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>
    <graph name="graph1"><point>(0,0)</point>
    </graph>

    <p>xmin: <number extend="$graph1.xmin" name="xmin" /></p>
    <p>xmax: <number extend="$graph1.xmax" name="xmax" /></p>
    <p>ymin: <number extend="$graph1.ymin" name="ymin" /></p>
    <p>ymax: <number extend="$graph1.ymax" name="ymax" /></p>

    <p>Change xmin: <mathInput name="xminInput" bindValueTo="$graph1.xmin" /></p>
    <p>Change xmax: <mathInput name="xmaxInput" bindValueTo="$graph1.xmax" /></p>
    <p>Change ymin: <mathInput name="yminInput" bindValueTo="$graph1.ymin" /></p>
    <p>Change ymax: <mathInput name="ymaxInput" bindValueTo="$graph1.ymax" /></p>
    
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        function checkLimits(xmin, xmax, ymin, ymax) {
            cy.get(cesc("#xmin")).should("have.text", String(xmin));
            cy.get(cesc("#xmax")).should("have.text", String(xmax));
            cy.get(cesc("#ymin")).should("have.text", String(ymin));
            cy.get(cesc("#ymax")).should("have.text", String(ymax));

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(
                    stateVariables[await win.resolvePath1("graph1")].stateValues
                        .xMin,
                ).eq(xmin);
                expect(
                    stateVariables[await win.resolvePath1("graph1")].stateValues
                        .xMax,
                ).eq(xmax);
                expect(
                    stateVariables[await win.resolvePath1("graph1")].stateValues
                        .yMin,
                ).eq(ymin);
                expect(
                    stateVariables[await win.resolvePath1("graph1")].stateValues
                        .yMax,
                ).eq(ymax);
            });
        }

        let xmin = -10,
            xmax = 10,
            ymin = -10,
            ymax = 10;

        checkLimits(xmin, xmax, ymin, ymax);

        // TODO: since longer have pan buttons, cannot pan with navigation bar.
        // Can we pan with the mouse in cypress?

        // Zoom in
        cy.get(cesc("#graph1_navigationbar") + " > :nth-child(3)")
            .click()
            .then((_) => {
                let meanx = (xmax + xmin) / 2;
                xmin = meanx + 0.8 * (xmin - meanx);
                xmax = meanx + 0.8 * (xmax - meanx);
                let meany = (ymax + ymin) / 2;
                ymin = meany + 0.8 * (ymin - meany);
                ymax = meany + 0.8 * (ymax - meany);
                checkLimits(xmin, xmax, ymin, ymax);
            });

        // Zoom in
        cy.get(cesc("#graph1_navigationbar") + " > :nth-child(3)")
            .click()
            .then((_) => {
                let meanx = (xmax + xmin) / 2;
                xmin = meanx + 0.8 * (xmin - meanx);
                xmax = meanx + 0.8 * (xmax - meanx);
                let meany = (ymax + ymin) / 2;
                ymin = meany + 0.8 * (ymin - meany);
                ymax = meany + 0.8 * (ymax - meany);
                checkLimits(xmin, xmax, ymin, ymax);
            });

        // Zoom out
        cy.get(cesc("#graph1_navigationbar") + " > :nth-child(1)")
            .click()
            .then((_) => {
                let meanx = (xmax + xmin) / 2;
                xmin = meanx + (xmin - meanx) / 0.8;
                xmax = meanx + (xmax - meanx) / 0.8;
                let meany = (ymax + ymin) / 2;
                ymin = meany + (ymin - meany) / 0.8;
                ymax = meany + (ymax - meany) / 0.8;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#xminInput") + " textarea")
            .type(`{end}{backspace}{backspace}-8{enter}`, { force: true })
            .then((_) => {
                xmin = -8;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#xmaxInput") + " textarea")
            .type(`{end}{backspace}{backspace}12{enter}`, { force: true })
            .then((_) => {
                xmax = 12;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#yminInput") + " textarea")
            .type(`{end}{backspace}{backspace}-4{enter}`, { force: true })
            .then((_) => {
                ymin = -4;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#ymaxInput") + " textarea")
            .type(`{end}{backspace}{backspace}16{enter}`, { force: true })
            .then((_) => {
                ymax = 16;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        // Zoom out
        cy.get(cesc("#graph1_navigationbar") + " > :nth-child(1)")
            .click()
            .then((_) => {
                let meanx = (xmax + xmin) / 2;
                xmin = meanx + (xmin - meanx) / 0.8;
                xmax = meanx + (xmax - meanx) / 0.8;
                let meany = (ymax + ymin) / 2;
                ymin = meany + (ymin - meany) / 0.8;
                ymax = meany + (ymax - meany) / 0.8;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        // Zoom in
        cy.get(cesc("#graph1_navigationbar") + " > :nth-child(3)")
            .click()
            .then((_) => {
                let meanx = (xmax + xmin) / 2;
                xmin = meanx + 0.8 * (xmin - meanx);
                xmax = meanx + 0.8 * (xmax - meanx);
                let meany = (ymax + ymin) / 2;
                ymin = meany + 0.8 * (ymin - meany);
                ymax = meany + 0.8 * (ymax - meany);
                checkLimits(xmin, xmax, ymin, ymax);
            });
    });

    it("tick scale factor", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text name="a">a</text>

    <graph name="none" />

    <graph name="xpi" xTickScaleFactor="pi" />
    <graph name="ypi" yTickScaleFactor="pi" />
    <graph name="bothPi" xTickScaleFactor="pi" yTickScaleFactor="pi" />

    <graph name="xe" xTickScaleFactor="e" />
    <graph name="ye" yTickScaleFactor="e" />
    <graph name="bothE" xTickScaleFactor="e" yTickScaleFactor="e" />

    <graph name="ignoreBad" xTickScaleFactor="x" yTickScaleFactor="/" displayDigits="5" />

    <number extend="$ignoreBad.xmin" name="xmin" />
    <number extend="$ignoreBad.xmax" name="xmax" />
    <number extend="$ignoreBad.ymin" name="ymin" />
    <number extend="$ignoreBad.ymax" name="ymax" />



    `,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        // Note: these are brittle tests and could start failing if internals of jsxgraph changes

        cy.get(cesc("#none")).should("not.contain.text", "π");
        cy.get(cesc("#none")).should("not.contain.text", "e");
        cy.get(cesc("#none")).should("contain.text", "68");
        cy.get(cesc("#none")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#xpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#xpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#xpi")).should("contain.text", "24");
        cy.get(cesc("#xpi")).should("contain.text", "68");
        cy.get(cesc("#xpi")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#ypi")).should("contain.text", "π2π3π");
        cy.get(cesc("#ypi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#ypi")).should("contain.text", "24");
        cy.get(cesc("#ypi")).should("contain.text", "68");
        cy.get(cesc("#ypi")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#bothPi")).should("contain.text", "π2π3π");
        cy.get(cesc("#bothPi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#bothPi")).should("not.contain.text", "24");
        cy.get(cesc("#bothPi")).should("not.contain.text", "68");
        cy.get(cesc("#bothPi")).should("not.contain.text", "−2−4−6−8");

        cy.get(cesc("#xe")).should("contain.text", "e2e3e");
        cy.get(cesc("#xe")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#xe")).should("contain.text", "24");
        cy.get(cesc("#xe")).should("contain.text", "68");
        cy.get(cesc("#xe")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#ye")).should("contain.text", "e2e3e");
        cy.get(cesc("#ye")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#ye")).should("contain.text", "24");
        cy.get(cesc("#ye")).should("contain.text", "68");
        cy.get(cesc("#ye")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#bothE")).should("contain.text", "e2e3e");
        cy.get(cesc("#bothE")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#bothE")).should("not.contain.text", "24");
        cy.get(cesc("#bothE")).should("not.contain.text", "68");
        cy.get(cesc("#bothE")).should("not.contain.text", "−2−4−6−8");

        cy.get(cesc("#ignoreBad")).should("not.contain.text", "π");
        cy.get(cesc("#ignoreBad")).should("not.contain.text", "e");
        cy.get(cesc("#ignoreBad")).should("contain.text", "68");
        cy.get(cesc("#ignoreBad")).should("contain.text", "−2−4−6−8");

        // Zoom out
        cy.get(cesc("#none_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#xpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ypi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#bothPi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#xe_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ye_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#bothE_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ignoreBad_navigationbar") + " > :nth-child(1)").click();

        cy.get(cesc("#xmax")).should("have.text", "12.5");

        cy.get(cesc("#none")).should("not.contain.text", "π");
        cy.get(cesc("#none")).should("not.contain.text", "e");
        cy.get(cesc("#none")).should("contain.text", "10");
        cy.get(cesc("#none")).should("contain.text", "−10");

        cy.get(cesc("#xpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#xpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#xpi")).should("contain.text", "10");
        cy.get(cesc("#xpi")).should("contain.text", "−10");

        cy.get(cesc("#ypi")).should("contain.text", "π2π3π");
        cy.get(cesc("#ypi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#ypi")).should("contain.text", "10");
        cy.get(cesc("#ypi")).should("contain.text", "−10");

        cy.get(cesc("#bothPi")).should("contain.text", "π2π3π");
        cy.get(cesc("#bothPi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#bothPi")).should("not.contain.text", "10");
        cy.get(cesc("#bothPi")).should("not.contain.text", "−10");

        cy.get(cesc("#xe")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#xe")).should("contain.text", "−e−2e");
        cy.get(cesc("#xe")).should("contain.text", "−3e−4e");
        cy.get(cesc("#xe")).should("contain.text", "10");
        cy.get(cesc("#xe")).should("contain.text", "−10");

        cy.get(cesc("#ye")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#ye")).should("contain.text", "−e−2e");
        cy.get(cesc("#ye")).should("contain.text", "−3e−4e");
        cy.get(cesc("#ye")).should("contain.text", "10");
        cy.get(cesc("#ye")).should("contain.text", "−10");

        cy.get(cesc("#bothE")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#bothE")).should("contain.text", "−e−2e");
        cy.get(cesc("#bothE")).should("contain.text", "−3e−4e");
        cy.get(cesc("#bothE")).should("not.contain.text", "10");
        cy.get(cesc("#bothE")).should("not.contain.text", "−10");

        cy.get(cesc("#ignoreBad")).should("not.contain.text", "π");
        cy.get(cesc("#ignoreBad")).should("not.contain.text", "e");
        cy.get(cesc("#ignoreBad")).should("contain.text", "10");
        cy.get(cesc("#ignoreBad")).should("contain.text", "−10");

        // Zoom out
        cy.get(cesc("#none_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#xpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ypi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#bothPi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#xe_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ye_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#bothE_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#ignoreBad_navigationbar") + " > :nth-child(1)").click();

        cy.get(cesc("#xmax")).should("have.text", "15.625");

        cy.get(cesc("#none")).should("not.contain.text", "π");
        cy.get(cesc("#none")).should("not.contain.text", "e");
        cy.get(cesc("#none")).should("contain.text", "10");
        cy.get(cesc("#none")).should("contain.text", "−10");

        cy.get(cesc("#xpi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#xpi")).should("contain.text", "−π−2π");
        cy.get(cesc("#xpi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#xpi")).should("contain.text", "10");
        cy.get(cesc("#xpi")).should("contain.text", "−10");

        cy.get(cesc("#ypi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#ypi")).should("contain.text", "−π−2π");
        cy.get(cesc("#ypi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#ypi")).should("contain.text", "10");
        cy.get(cesc("#ypi")).should("contain.text", "−10");

        cy.get(cesc("#bothPi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#bothPi")).should("contain.text", "−π−2π");
        cy.get(cesc("#bothPi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#bothPi")).should("not.contain.text", "10");
        cy.get(cesc("#bothPi")).should("not.contain.text", "−10");

        cy.get(cesc("#xe")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#xe")).should("contain.text", "−e");
        cy.get(cesc("#xe")).should("contain.text", "−2e−3e");
        cy.get(cesc("#xe")).should("contain.text", "−4e−5e");
        cy.get(cesc("#xe")).should("contain.text", "10");
        cy.get(cesc("#xe")).should("contain.text", "−10");

        cy.get(cesc("#ye")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#ye")).should("contain.text", "−e");
        cy.get(cesc("#ye")).should("contain.text", "−2e−3e");
        cy.get(cesc("#ye")).should("contain.text", "−4e−5e");
        cy.get(cesc("#ye")).should("contain.text", "10");
        cy.get(cesc("#ye")).should("contain.text", "−10");

        cy.get(cesc("#bothE")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#bothE")).should("contain.text", "−e−2e");
        cy.get(cesc("#bothE")).should("contain.text", "−3e−4e−5e");
        cy.get(cesc("#bothE")).should("not.contain.text", "10");
        cy.get(cesc("#bothE")).should("not.contain.text", "−10");

        cy.get(cesc("#ignoreBad")).should("not.contain.text", "π");
        cy.get(cesc("#ignoreBad")).should("not.contain.text", "e");
        cy.get(cesc("#ignoreBad")).should("contain.text", "10");
        cy.get(cesc("#ignoreBad")).should("contain.text", "−10");
    });

    it("changing show navigation", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <booleanInput name="showControls" prefill="true" />
    <graph showNavigation="$showControls" name="g" />
    <boolean name="showControls2" extend="$g.showNavigation" />
    `,
                },
                "*",
            );
        });

        // Make sure render doesn't crash when remove or add navigation buttons
        cy.get(cesc("#showControls2")).should("have.text", "true");

        cy.get(cesc("#showControls")).click();
        cy.get(cesc("#showControls2")).should("have.text", "false");

        cy.get(cesc("#showControls")).click();
        cy.get(cesc("#showControls2")).should("have.text", "true");
    });

    it("graph short description is aria-label", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="g"><shortDescription>A blank graph</shortDescription></graph>
    `,
                },
                "*",
            );
        });
        cy.get("#g-description").should(
            "have.attr",
            "aria-label",
            "A blank graph",
        );
    });

    it("graph shrinks to fit", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
        <graph name="graph1" size="full" />
        <sideBySide>
            <graph name="graph2a" size="full" />
            <graph name="graph2b" size="full" />
        </sideBySide>
        <sideBySide>
            <graph name="graph3a" size="full" />
            <graph name="graph3b" size="full" />
            <graph name="graph3c" size="full" />
            <graph name="graph3d" size="full" />
        </sideBySide>

    `,
                },
                "*",
            );
        });

        const fullWidth = 850;

        cy.get(cesc("#graph1"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", fullWidth);

        cy.get(cesc("#graph1"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", fullWidth);

        cy.get(cesc("#graph2a"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", fullWidth / 2);
        cy.get(cesc("#graph2b"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", fullWidth / 2);

        cy.get(cesc("#graph2a"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", fullWidth / 2);
        cy.get(cesc("#graph2b"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", fullWidth / 2);

        cy.get(cesc("#graph3a"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3b"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3c"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3d"))
            .invoke("css", "width")
            .then((width) => parseInt(width))
            .should("be.equal", Math.floor(fullWidth / 4));

        cy.get(cesc("#graph3a"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3b"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3c"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", Math.floor(fullWidth / 4));
        cy.get(cesc("#graph3d"))
            .invoke("css", "height")
            .then((height) => parseInt(height))
            .should("be.equal", Math.floor(fullWidth / 4));
    });

    it("with description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="graph">
        <shortDescription>A graph</shortDescription>
        <description>
            <p>A blank graph.</p>
        </description>
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get("#graph-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );
        cy.get("#graph-description").should(
            "have.attr",
            "aria-details",
            `graph-description-content`,
        );
        cy.get(`#graph-description-content`).should(
            "contain.text",
            "A blank graph.",
        );

        cy.get("#graph-container [data-test='Description Summary']").click();

        cy.get("#graph-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#graph-container [data-test='Description']").should(
            "contain.text",
            "A blank graph.",
        );

        cy.get("#graph").click();
        cy.get("#graph-container [data-test='Description']").should(
            "have.attr",
            "open",
        );

        cy.get("#graph-container [data-test='Description Summary']").click();

        cy.get("#graph-container [data-test='Description']").should(
            "not.have.attr",
            "open",
        );
    });

    it("with description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="graph" displayMode="inline">
        <shortDescription>A graph</shortDescription>
        <description>
            <p>A blank graph.</p>
        </description>
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get("#graph-container [data-test='Description Button']").should(
            "be.visible",
        );
        cy.get("#graph-container [data-test='Description']").should(
            "not.be.visible",
        );
        cy.get("#graph-description").should(
            "have.attr",
            "aria-details",
            `graph-description-content`,
        );
        cy.get(`#graph-description-content`).should(
            "contain.text",
            "A blank graph.",
        );

        cy.get("#graph-container [data-test='Description Button']").click();

        cy.get("#graph-container [data-test='Description']").should(
            "contain.text",
            "A blank graph.",
        );

        cy.get("#graph").click();

        cy.get("#graph-container [data-test='Description']").should(
            "not.be.visible",
        );
    });

    it("without description", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="graph">
        <shortDescription>A graph</shortDescription>
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get("#graph").should("be.visible");
        cy.get("#graph-container [data-test='Description']").should(
            "not.exist",
        );
        cy.get("#graph-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#graph-description").should("not.have.attr", "aria-details");
    });

    it("without description, inline", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="graph" displayMode="inline">
        <shortDescription>A graph</shortDescription>
    </graph>

    `,
                },
                "*",
            );
        });

        cy.get("#graph").should("be.visible");
        cy.get("#graph-container [data-test='Description']").should(
            "not.exist",
        );
        cy.get("#graph-container [data-test='Description Button']").should(
            "not.exist",
        );
        cy.get("#graph-description").should("not.have.attr", "aria-details");
    });
});
