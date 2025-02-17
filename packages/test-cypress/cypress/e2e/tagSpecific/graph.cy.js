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
    <text>a</text>
    <graph><point>(0,0)</point>
    </graph>

    <p>xmin: $_graph1.xmin{assignNames="xmin"}</p>
    <p>xmax: $_graph1.xmax{assignNames="xmax"}</p>
    <p>ymin: $_graph1.ymin{assignNames="ymin"}</p>
    <p>ymax: $_graph1.ymax{assignNames="ymax"}</p>

    <p>Change xmin: <mathinput name="xminInput" bindValueTo="$_graph1.xmin" /></p>
    <p>Change xmax: <mathinput name="xmaxInput" bindValueTo="$_graph1.xmax" /></p>
    <p>Change ymin: <mathinput name="yminInput" bindValueTo="$_graph1.ymin" /></p>
    <p>Change ymax: <mathinput name="ymaxInput" bindValueTo="$_graph1.ymax" /></p>
    
    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        function checkLimits(xmin, xmax, ymin, ymax) {
            cy.get(cesc("#\\/xmin")).should("have.text", String(xmin));
            cy.get(cesc("#\\/xmax")).should("have.text", String(xmax));
            cy.get(cesc("#\\/ymin")).should("have.text", String(ymin));
            cy.get(cesc("#\\/ymax")).should("have.text", String(ymax));

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                expect(stateVariables["/_graph1"].stateValues.xmin).eq(xmin);
                expect(stateVariables["/_graph1"].stateValues.xmax).eq(xmax);
                expect(stateVariables["/_graph1"].stateValues.ymin).eq(ymin);
                expect(stateVariables["/_graph1"].stateValues.ymax).eq(ymax);
            });
        }

        let xmin = -10,
            xmax = 10,
            ymin = -10,
            ymax = 10;

        checkLimits(xmin, xmax, ymin, ymax);

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(6)")
            .click()
            .then((_) => {
                let increment = 0.1 * (ymax - ymin);
                ymin += increment;
                ymax += increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(6)")
            .click()
            .then((_) => {
                let increment = 0.1 * (ymax - ymin);
                ymin += increment;
                ymax += increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(5)")
            .click()
            .then((_) => {
                let increment = 0.1 * (ymax - ymin);
                ymin -= increment;
                ymax -= increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(4)")
            .click()
            .then((_) => {
                let increment = 0.1 * (xmax - xmin);
                xmin -= increment;
                xmax -= increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(7)")
            .click()
            .then((_) => {
                let increment = 0.1 * (xmax - xmin);
                xmin += increment;
                xmax += increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(7)")
            .click()
            .then((_) => {
                let increment = 0.1 * (xmax - xmin);
                xmin += increment;
                xmax += increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(3)")
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

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(3)")
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

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(1)")
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

        cy.get(cesc("#\\/xminInput") + " textarea")
            .type(`{end}{backspace}{backspace}-8{enter}`, { force: true })
            .then((_) => {
                xmin = -8;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/xmaxInput") + " textarea")
            .type(`{end}{backspace}{backspace}12{enter}`, { force: true })
            .then((_) => {
                xmax = 12;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/yminInput") + " textarea")
            .type(`{end}{backspace}{backspace}-4{enter}`, { force: true })
            .then((_) => {
                ymin = -4;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/ymaxInput") + " textarea")
            .type(`{end}{backspace}{backspace}16{enter}`, { force: true })
            .then((_) => {
                ymax = 16;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(5)")
            .click()
            .then((_) => {
                let increment = 0.1 * (ymax - ymin);
                ymin -= increment;
                ymax -= increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });

        cy.get(cesc("#\\/_graph1_navigationbar") + " > :nth-child(4)")
            .click()
            .then((_) => {
                let increment = 0.1 * (xmax - xmin);
                xmin -= increment;
                xmax -= increment;
                checkLimits(xmin, xmax, ymin, ymax);
            });
    });

    it("tick scale factor", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>

    <graph name="none" />

    <graph name="xpi" xTickScaleFactor="pi" />
    <graph name="ypi" yTickScaleFactor="pi" />
    <graph name="bothpi" xTickScaleFactor="pi" yTickScaleFactor="pi" />

    <graph name="xe" xTickScaleFactor="e" />
    <graph name="ye" yTickScaleFactor="e" />
    <graph name="bothe" xTickScaleFactor="e" yTickScaleFactor="e" />

    <graph name="ignorebad" xTickScaleFactor="x" yTickScaleFactor="/" displayDigits="5" />

    $ignorebad.xmin{assignNames="xmin"}
    $ignorebad.xmax{assignNames="xmax"}
    $ignorebad.ymin{assignNames="ymin"}
    $ignorebad.ymax{assignNames="ymax"}



    `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); //wait for page to load

        // Note: these are brittle tests and could start failing if internals of jsxgraph changes

        cy.get(cesc("#\\/none")).should("not.contain.text", "π");
        cy.get(cesc("#\\/none")).should("not.contain.text", "e");
        cy.get(cesc("#\\/none")).should("contain.text", "68");
        cy.get(cesc("#\\/none")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/xpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "24");
        cy.get(cesc("#\\/xpi")).should("contain.text", "68");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/ypi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "24");
        cy.get(cesc("#\\/ypi")).should("contain.text", "68");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/bothpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/bothpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "24");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "68");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/xe")).should("contain.text", "e2e3e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#\\/xe")).should("contain.text", "24");
        cy.get(cesc("#\\/xe")).should("contain.text", "68");
        cy.get(cesc("#\\/xe")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/ye")).should("contain.text", "e2e3e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#\\/ye")).should("contain.text", "24");
        cy.get(cesc("#\\/ye")).should("contain.text", "68");
        cy.get(cesc("#\\/ye")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/bothe")).should("contain.text", "e2e3e");
        cy.get(cesc("#\\/bothe")).should("contain.text", "−e−2e−3e");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "24");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "68");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "π");
        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "e");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "68");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "−2−4−6−8");

        cy.get(cesc("#\\/none_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/xpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/ypi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/bothpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/xe_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/ye_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/bothe_navigationbar") + " > :nth-child(1)").click();
        cy.get(
            cesc("#\\/ignorebad_navigationbar") + " > :nth-child(1)",
        ).click();

        cy.get(cesc("#\\/xmax")).should("have.text", "12.5");

        cy.get(cesc("#\\/none")).should("not.contain.text", "π");
        cy.get(cesc("#\\/none")).should("not.contain.text", "e");
        cy.get(cesc("#\\/none")).should("contain.text", "10");
        cy.get(cesc("#\\/none")).should("contain.text", "−10");

        cy.get(cesc("#\\/xpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "10");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−10");

        cy.get(cesc("#\\/ypi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "10");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−10");

        cy.get(cesc("#\\/bothpi")).should("contain.text", "π2π3π");
        cy.get(cesc("#\\/bothpi")).should("contain.text", "−π−2π−3π");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "10");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "−10");

        cy.get(cesc("#\\/xe")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−e−2e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−3e−4e");
        cy.get(cesc("#\\/xe")).should("contain.text", "10");
        cy.get(cesc("#\\/xe")).should("contain.text", "−10");

        cy.get(cesc("#\\/ye")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−e−2e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−3e−4e");
        cy.get(cesc("#\\/ye")).should("contain.text", "10");
        cy.get(cesc("#\\/ye")).should("contain.text", "−10");

        cy.get(cesc("#\\/bothe")).should("contain.text", "e2e3e4e");
        cy.get(cesc("#\\/bothe")).should("contain.text", "−e−2e");
        cy.get(cesc("#\\/bothe")).should("contain.text", "−3e−4e");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "10");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "−10");

        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "π");
        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "e");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "10");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "−10");

        cy.get(cesc("#\\/none_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/xpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/ypi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/bothpi_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/xe_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/ye_navigationbar") + " > :nth-child(1)").click();
        cy.get(cesc("#\\/bothe_navigationbar") + " > :nth-child(1)").click();
        cy.get(
            cesc("#\\/ignorebad_navigationbar") + " > :nth-child(1)",
        ).click();

        cy.get(cesc("#\\/xmax")).should("have.text", "15.625");

        cy.get(cesc("#\\/none")).should("not.contain.text", "π");
        cy.get(cesc("#\\/none")).should("not.contain.text", "e");
        cy.get(cesc("#\\/none")).should("contain.text", "10");
        cy.get(cesc("#\\/none")).should("contain.text", "−10");

        cy.get(cesc("#\\/xpi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−π−2π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#\\/xpi")).should("contain.text", "10");
        cy.get(cesc("#\\/xpi")).should("contain.text", "−10");

        cy.get(cesc("#\\/ypi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−π−2π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#\\/ypi")).should("contain.text", "10");
        cy.get(cesc("#\\/ypi")).should("contain.text", "−10");

        cy.get(cesc("#\\/bothpi")).should("contain.text", "π2π3π4π");
        cy.get(cesc("#\\/bothpi")).should("contain.text", "−π−2π");
        cy.get(cesc("#\\/bothpi")).should("contain.text", "−3π−4π");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "10");
        cy.get(cesc("#\\/bothpi")).should("not.contain.text", "−10");

        cy.get(cesc("#\\/xe")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−2e−3e");
        cy.get(cesc("#\\/xe")).should("contain.text", "−4e−5e");
        cy.get(cesc("#\\/xe")).should("contain.text", "10");
        cy.get(cesc("#\\/xe")).should("contain.text", "−10");

        cy.get(cesc("#\\/ye")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−2e−3e");
        cy.get(cesc("#\\/ye")).should("contain.text", "−4e−5e");
        cy.get(cesc("#\\/ye")).should("contain.text", "10");
        cy.get(cesc("#\\/ye")).should("contain.text", "−10");

        cy.get(cesc("#\\/bothe")).should("contain.text", "e2e3e4e5e");
        cy.get(cesc("#\\/bothe")).should("contain.text", "−e−2e");
        cy.get(cesc("#\\/bothe")).should("contain.text", "−3e−4e−5e");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "10");
        cy.get(cesc("#\\/bothe")).should("not.contain.text", "−10");

        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "π");
        cy.get(cesc("#\\/ignorebad")).should("not.contain.text", "e");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "10");
        cy.get(cesc("#\\/ignorebad")).should("contain.text", "−10");
    });
});
