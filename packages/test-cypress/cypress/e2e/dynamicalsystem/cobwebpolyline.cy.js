import { cesc, cesc2 } from "@doenet/utils";

describe("CobwebPolyline Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("cobweb graded applet", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <copy uri="doenet:cid=bafkreiatwotzdmrphuof5j4gsr42jvt266ourxqlpukspkedwe7kfwflze" name="gradedApplet" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" numIterationsRequired="3" initialValueDx="0.2" x0="1" />
  
  `,
                },
                "*",
            );
        });

        let f = (x) => 2 * x - x ** 2 / 3;

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.get(cesc2("#/gradedApplet/initialCorrect_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_incorrect")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_incorrect")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/startFeedback")).should("be.visible");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 0: [1, 0] },
                },
            });
        });

        cy.get(cesc2("#/gradedApplet/initialCorrect_submit")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/initialCorrect_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find("span")
            .eq(0)
            .click();

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/startFeedback")).should("be.visible");

        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/incorrectFeedback")).should("be.visible");

        let x1 = f(1);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 1: [1, x1] },
                },
            });
        });
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc2("#/gradedApplet/insufficientFeedback")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/deleteLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/startFeedback")).should("be.visible");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc2("#/gradedApplet/insufficientFeedback")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc2("#/gradedApplet/incorrectFeedback")).should("be.visible");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 2: [x1, x1] },
                },
            });
        });
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("40% correct");
            });
        cy.get(cesc2("#/gradedApplet/insufficientFeedback")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial")).should(
            "be.visible",
        );

        let x2 = f(x1);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 3: [x1, x2] },
                },
            });
        });
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x2=${Math.round(x2 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(3)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();

        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial")).should(
            "be.visible",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 4: [x2, x2] },
                },
            });
        });

        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x2=${Math.round(x2 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(3)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial")).should(
            "be.visible",
        );

        let x3 = f(x2);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 5: [x2, x3] },
                },
            });
        });

        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x2=${Math.round(x2 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(3)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x3=${Math.round(x3 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(4)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("83% correct");
            });
        cy.get(cesc2("#/gradedApplet/incorrectFeedback")).should("be.visible");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 6: [x3, x3] },
                },
            });
        });
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x2=${Math.round(x2 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(3)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x3=${Math.round(x3 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(4)
            .should("not.exist");

        cy.get(cesc2("#/gradedApplet/cobwebApplet/addLine_button")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial")).should(
            "be.visible",
        );
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("86% correct");
            });
        cy.get(cesc2("#/gradedApplet/incorrectFeedback")).should("be.visible");

        let x4 = f(x3);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentName: "/gradedApplet/cobwebApplet/cobwebPolyline",
                args: {
                    pointCoords: { 7: [x3, x4] },
                },
            });
        });
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_submit")).click();
        cy.get(cesc2("#/gradedApplet/correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(0)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal("x0=1");
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(1)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x1=${Math.round(x1 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(2)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x2=${Math.round(x2 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(3)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x3=${Math.round(x3 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(4)
            .invoke("text")
            .then((text) => {
                expect(text.trim().replace(/−/g, "-")).equal(
                    `x4=${Math.round(x4 * 10000) / 10000}`,
                );
            });
        cy.get(cesc2("#/gradedApplet/cobwebApplet/calculatedValue"))
            .find(".mjx-mtr")
            .eq(5)
            .should("not.exist");
    });

    it("cobweb intro tutorial", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <text>a</text>
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <copy uri="doenet:cid=bafkreief4dcu4mfiqfib2xii5ftoevhbymn34dyi4inqsxdfvfskj234qi" name="cobwebTutorial" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" numIterationsRequired="3" initialValueDx="0.2" x0="1" />
 
  <p>Credit achieved: <copy source="_document1" prop="creditAchieved" assignNames="ca" /></p>
  `,
                },
                "*",
            );
        });

        let f = (x) => 2 * x - x ** 2 / 3;

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.get(cesc2("#/ca")).should("have.text", "0");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P1",
                args: { x: 0.9, y: -0.1 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/ca")).should("have.text", "0.167");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.get(cesc2("#/cobwebTutorial/addVline1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addVline1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/v1",
                args: {
                    point1coords: [1.2, 1],
                    point2coords: [1.2, 2],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.167");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");

        cy.get(cesc2("#/cobwebTutorial/addHline1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addHline1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/h1",
                args: {
                    point1coords: [2, 1.5],
                    point2coords: [3, 1.5],
                },
            });
        });
        cy.get(cesc2("#/cobwebTutorial/addPoint2_button")).should("be.visible");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P2",
                args: { x: -0.1, y: 1.7 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.5");

        cy.get(cesc2("#/cobwebTutorial/addPoint3_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint3_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P3",
                args: { x: 1.8, y: 0 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.5");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.667");

        cy.get(cesc2("#/cobwebTutorial/addVline2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addVline2_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/v2",
                args: {
                    point1coords: [1.5, 3],
                    point2coords: [1.5, 4],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.667");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");

        cy.get(cesc2("#/cobwebTutorial/addHline2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addHline2_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/h2",
                args: {
                    point1coords: [4, 2.3],
                    point2coords: [5, 2.3],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).should("be.visible");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P4",
                args: { x: 0.1, y: 2.5 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "1");

        cy.get(cesc2("#/cobwebTutorial/shortcutButton_button")).click();
        cy.get(cesc2("#/cobwebTutorial/shortcutButton_button")).should(
            "not.exist",
        );
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "1");

        cy.get(cesc2("#/cobwebTutorial/resetTutorial_button")).click();

        cy.get(cesc2("#/ca")).should("have.text", "0");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P1",
                args: { x: 0.9, y: -0.1 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/ca")).should("have.text", "0.167");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.get(cesc2("#/cobwebTutorial/addVline1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addVline1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/v1",
                args: {
                    point1coords: [1.2, 1],
                    point2coords: [1.2, 2],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.167");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");

        cy.get(cesc2("#/cobwebTutorial/addHline1_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addHline1_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/h1",
                args: {
                    point1coords: [2, 1.5],
                    point2coords: [3, 1.5],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/addPoint2_button")).should("be.visible");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint2_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P2",
                args: { x: -0.1, y: 1.7 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.333");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.5");

        cy.get(cesc2("#/cobwebTutorial/addPoint3_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint3_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P3",
                args: { x: 1.8, y: 0 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.5");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.667");

        cy.get(cesc2("#/cobwebTutorial/addVline2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addVline2_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/v2",
                args: {
                    point1coords: [1.5, 3],
                    point2coords: [1.5, 4],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.667");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");

        cy.get(cesc2("#/cobwebTutorial/addHline2_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addHline2_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentName: "/cobwebTutorial/h2",
                args: {
                    point1coords: [4, 2.3],
                    point2coords: [5, 2.3],
                },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).should("be.visible");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).click();
        cy.get(cesc2("#/cobwebTutorial/addPoint4_button")).should("not.exist");
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentName: "/cobwebTutorial/P4",
                args: { x: 0.1, y: 2.5 },
            });
        });

        cy.get(cesc2("#/cobwebTutorial/next_button")).should("not.be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "0.833");
        cy.get(cesc2("#/cobwebTutorial/next_button")).click();
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "1");

        cy.get(cesc2("#/cobwebTutorial/shortcutButton_button")).click();
        cy.get(cesc2("#/cobwebTutorial/shortcutButton_button")).should(
            "not.exist",
        );
        cy.get(cesc2("#/cobwebTutorial/next_button")).should("be.disabled");
        cy.get(cesc2("#/ca")).should("have.text", "1");
    });
});
