import me from "math-expressions";
import { cesc } from "@doenet/utils";

describe("Paginator Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("Multiple sections in paginator", () => {
        let doenetML = `
    <text name="a">a</text>
  
    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <section name="section1">
        <title name="title1">Page 1</title>
        <p name="p1">What is 1+1? <answer name="answer1">$two</answer></p>
        <math hide name="two">2</math>
      </section>
      <section name="section2">
        <p name="p2">What is your name? <textInput name="name" /></p>
        <p name="p3">Hello, $name!</p>
      </section>
      <section name="section3">
        <title name="title2">Page 3</title>
        <math hide name="twox">2x</math>
        <p name="p">What is <m name="mxx">x+x</m>? <answer name="answer2">$twox</answer></p>
        <p name="p">What is <m name="myy">y+y</m>? <answer name="answer3">2y</answer></p>
      </section>
    </paginator>
    <p name="p4">
    <callAction name="prevPage" disabled="$pageNum = 1" actionName="setPage" target="$pgn" number="$pageNum -1"  >
      <label>prev</label>
    </callAction>
    Page <number extend="$pgn.currentPage" name="pageNum" />
    of <number extend="$pgn.numPages" name="numPages" />
    <callAction name="nextPage" disabled="$pageNum = $numPages" actionName="setPage" target="$pgn" number="$pageNum +1"  >
      <label>next</label>
    </callAction>
    
    </p>
    <p name="p5">What is 2+2? <answer name="answer4">4</answer></p>
  
    <p name="p6">Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
  
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput1Name =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#" + mathInput1Name) + " textarea";
            let mathInput1DisplayAnchor =
                cesc("#" + mathInput1Name) + " .mq-editable-field";
            let answer1Correct = cesc("#" + mathInput1Name + "_correct");
            let answer1Incorrect = cesc("#" + mathInput1Name + "_incorrect");

            let mathInput4Name =
                stateVariables[await win.resolvePath1("answer4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = cesc("#" + mathInput4Name) + " textarea";
            let mathInput4DisplayAnchor =
                cesc("#" + mathInput4Name) + " .mq-editable-field";
            let answer4Correct = cesc("#" + mathInput4Name + "_correct");
            let answer4Incorrect = cesc("#" + mathInput4Name + "_incorrect");

            cy.get(cesc("#ca")).should("have.text", "0");
            cy.get(cesc("#title1")).should("have.text", "Page 1");
            cy.get(cesc("#section2_title")).should("not.exist");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(mathInput4Anchor).type("4{enter}", { force: true });

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.25");

            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.get(mathInput1Anchor).type("2{enter}", { force: true });

            cy.get(answer1Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.5");
            cy.get(mathInput1DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2",
                    );
                });

            cy.log("move to page 2");
            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("have.text", "Section 2");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(answer4Correct).should("be.visible");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(cesc("#name_input")).type("Me{enter}");
            cy.get(cesc("#p3")).should("have.text", "Hello, Me!");
            cy.get(cesc("#ca")).should("have.text", "0.5");
            cy.get(cesc("#name_input")).should("have.value", "Me");

            cy.get(mathInput1Anchor).should("not.exist");

            cy.get(mathInput4Anchor).type("{end}{backspace}3", { force: true });
            cy.get(answer4Correct).should("not.exist");
            cy.get(mathInput4Anchor).type("{enter}", { force: true });
            cy.get(answer4Incorrect).should("be.visible");

            cy.get(cesc("#ca")).should("have.text", "0.25");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "3",
                    );
                });

            cy.log("back to page 1");
            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#title1")).should("have.text", "Page 1");
            cy.get(cesc("#section2_title")).should("not.exist");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(answer1Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.25");
            cy.get(mathInput1DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2",
                    );
                });

            cy.get(cesc("#name")).should("not.exist");

            cy.log("back to second page");
            cy.get(cesc("#nextPage_button")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("have.text", "Section 2");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(cesc("#name_input")).should("have.value", "Me");
            cy.get(cesc("#p3")).should("have.text", "Hello, Me!");

            cy.get(answer4Incorrect).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.25");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "3",
                    );
                });

            cy.get(mathInput4Anchor).type("{end}{backspace}4", { force: true });
            cy.get(answer4Incorrect).should("not.exist");
            cy.get(mathInput4Anchor).type("{enter}", { force: true });

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.5");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.log("on to third page");
            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("not.exist");
            cy.get(cesc("#title2")).should("have.text", "Page 3");

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.5");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            // cy.get(cesc('#mxx') + ' .mjx-mrow').should('contain.text', 'x+x')
            // cy.get(cesc('#myy') + ' .mjx-mrow').should('contain.text', 'y+y')

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let mathInput2Name =
                    stateVariables[await win.resolvePath1("answer2")]
                        .stateValues.inputChildren[0].componentIdx;
                let mathInput2Anchor = cesc("#" + mathInput2Name) + " textarea";
                let mathInput2DisplayAnchor =
                    cesc("#" + mathInput2Name) + " .mq-editable-field";
                let answer2Correct = cesc("#" + mathInput2Name + "_correct");
                let answer2Incorrect = cesc(
                    "#" + mathInput2Name + "_incorrect",
                );

                let mathInput3Name =
                    stateVariables[await win.resolvePath1("answer3")]
                        .stateValues.inputChildren[0].componentIdx;
                let mathInput3Anchor = cesc("#" + mathInput3Name) + " textarea";
                let mathInput3DisplayAnchor =
                    cesc("#" + mathInput3Name) + " .mq-editable-field";
                let answer3Correct = cesc("#" + mathInput3Name + "_correct");
                let answer3Incorrect = cesc(
                    "#" + mathInput3Name + "_incorrect",
                );

                cy.get(mathInput2Anchor).type("2x{enter}", { force: true });
                cy.get(answer2Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.75");
                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2x");
                    });

                cy.get(mathInput3Anchor).type("2y{enter}", { force: true });
                cy.get(answer3Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "1");
                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2y");
                    });

                cy.get(mathInput2Anchor).type("{end}{backspace}z", {
                    force: true,
                });
                cy.get(answer2Correct).should("not.exist");
                cy.get(mathInput2Anchor).type("{enter}", { force: true });
                cy.get(answer2Incorrect).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.75");
                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2z");
                    });

                cy.log("back to second page");
                cy.get(cesc("#prevPage_button")).click();
                cy.get(cesc("#title1")).should("not.exist");
                cy.get(cesc("#section2_title")).should(
                    "have.text",
                    "Section 2",
                );
                cy.get(cesc("#title2")).should("not.exist");

                cy.get(cesc("#name_input")).should("have.value", "Me");
                cy.get(cesc("#p3")).should("have.text", "Hello, Me!");

                cy.get(answer4Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.75");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("4");
                    });

                cy.log("back to third page");
                cy.get(cesc("#pcontrols_next")).click();
                cy.get(cesc("#title1")).should("not.exist");
                cy.get(cesc("#section2_title")).should("not.exist");
                cy.get(cesc("#title2")).should("have.text", "Page 3");

                cy.get(answer4Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.75");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("4");
                    });

                cy.get(answer2Incorrect).should("be.visible");
                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2z");
                    });
                cy.get(answer3Correct).should("be.visible");
                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2y");
                    });

                cy.get(cesc("#ca")).should("have.text", "0.75");

                cy.log("back to second page");
                cy.get(cesc("#prevPage_button")).click();
                cy.get(cesc("#title1")).should("not.exist");
                cy.get(cesc("#section2_title")).should(
                    "have.text",
                    "Section 2",
                );
                cy.get(cesc("#title2")).should("not.exist");

                cy.get(cesc("#name_input")).should("have.value", "Me");
                cy.get(cesc("#p3")).should("have.text", "Hello, Me!");

                cy.get(answer4Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.75");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("4");
                    });
            });
        });

        cy.wait(2000); // make sure 1 second debounce is satisified
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        cy.log("on page two");

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("answer4")];
            }),
        );

        cy.get(cesc("#title1")).should("not.exist");
        cy.get(cesc("#section2_title")).should("have.text", "Section 2");
        cy.get(cesc("#title2")).should("not.exist");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput4Name =
                stateVariables[await win.resolvePath1("answer4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = cesc("#" + mathInput4Name) + " textarea";
            let mathInput4DisplayAnchor =
                cesc("#" + mathInput4Name) + " .mq-editable-field";
            let answer4Correct = cesc("#" + mathInput4Name + "_correct");
            let answer4Incorrect = cesc("#" + mathInput4Name + "_incorrect");

            cy.get(cesc("#name_input")).should("have.value", "Me");
            cy.get(cesc("#p3")).should("have.text", "Hello, Me!");

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.75");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.get(cesc("#name_input")).clear().type("You{enter}");
            cy.get(cesc("#name_input")).should("have.value", "You");
            cy.get(cesc("#p3")).should("have.text", "Hello, You!");

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.75");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.log("to third page");
            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("not.exist");
            cy.get(cesc("#title2")).should("have.text", "Page 3");

            cy.get(answer4Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.75");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "4",
                    );
                });

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let mathInput2Name =
                    stateVariables[await win.resolvePath1("answer2")]
                        .stateValues.inputChildren[0].componentIdx;
                let mathInput2Anchor = cesc("#" + mathInput2Name) + " textarea";
                let mathInput2DisplayAnchor =
                    cesc("#" + mathInput2Name) + " .mq-editable-field";
                let answer2Correct = cesc("#" + mathInput2Name + "_correct");
                let answer2Incorrect = cesc(
                    "#" + mathInput2Name + "_incorrect",
                );
                let answer2Submit = cesc("#" + mathInput2Name + "_submit");

                let mathInput3Name =
                    stateVariables[await win.resolvePath1("answer3")]
                        .stateValues.inputChildren[0].componentIdx;
                let mathInput3Anchor = cesc("#" + mathInput3Name) + " textarea";
                let mathInput3DisplayAnchor =
                    cesc("#" + mathInput3Name) + " .mq-editable-field";
                let answer3Correct = cesc("#" + mathInput3Name + "_correct");
                let answer3Incorrect = cesc(
                    "#" + mathInput3Name + "_incorrect",
                );

                cy.get(answer2Incorrect).should("be.visible");
                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2z");
                    });
                cy.get(answer3Correct).should("be.visible");
                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2y");
                    });

                cy.get(mathInput3Anchor).type("{end}{backspace}q", {
                    force: true,
                });
                cy.get(answer3Correct).should("not.exist");
                cy.get(mathInput3Anchor).type("{enter}", { force: true });
                cy.get(answer3Incorrect).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.5");
                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2q");
                    });

                cy.get(mathInput4Anchor).type("{end}{backspace}3", {
                    force: true,
                });
                cy.get(answer4Correct).should("not.exist");
                cy.get(mathInput4Anchor).type("{enter}", { force: true });
                cy.get(answer4Incorrect).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.25");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("3");
                    });

                cy.get(mathInput2Anchor).type("{end}{backspace}x", {
                    force: true,
                });
                cy.get(answer2Incorrect).should("not.exist");
                cy.get(mathInput2Anchor).type("{enter}", { force: true });
                cy.get(answer2Correct).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.5");
                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2x");
                    });

                cy.log("back to second page");
                cy.get(cesc("#pcontrols_previous")).click();
                cy.get(cesc("#title1")).should("not.exist");
                cy.get(cesc("#section2_title")).should(
                    "have.text",
                    "Section 2",
                );
                cy.get(cesc("#title2")).should("not.exist");

                cy.get(cesc("#name_input")).should("have.value", "You");
                cy.get(cesc("#p3")).should("have.text", "Hello, You!");

                cy.get(answer4Incorrect).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.5");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("3");
                    });

                cy.log("to first page");
                cy.get(cesc("#pcontrols_previous")).click();
                cy.get(cesc("#title1")).should("have.text", "Page 1");
                cy.get(cesc("#section2_title")).should("not.exist");
                cy.get(cesc("#title2")).should("not.exist");

                cy.get(answer4Incorrect).should("be.visible");
                cy.get(cesc("#ca")).should("have.text", "0.5");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("3");
                    });

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();

                    let mathInput1Name =
                        stateVariables[await win.resolvePath1("answer1")]
                            .stateValues.inputChildren[0].componentIdx;
                    let mathInput1Anchor =
                        cesc("#" + mathInput1Name) + " textarea";
                    let mathInput1DisplayAnchor =
                        cesc("#" + mathInput1Name) + " .mq-editable-field";
                    let answer1Correct = cesc(
                        "#" + mathInput1Name + "_correct",
                    );
                    let answer1Incorrect = cesc(
                        "#" + mathInput1Name + "_incorrect",
                    );

                    cy.get(answer1Correct).should("be.visible");
                    cy.get(mathInput1DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2");
                        });

                    cy.get(mathInput1Anchor).type("{end}-", { force: true });
                    cy.get(answer1Correct).should("not.exist");
                    cy.get(mathInput1Anchor).type("{enter}", { force: true });
                    cy.get(answer1Incorrect).should("be.visible");
                    cy.get(mathInput1DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2−");
                        });
                    cy.get(cesc("#ca")).should("have.text", "0.25");

                    cy.log("back to second page");
                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#title1")).should("not.exist");
                    cy.get(cesc("#section2_title")).should(
                        "have.text",
                        "Section 2",
                    );
                    cy.get(cesc("#title2")).should("not.exist");

                    cy.log("back to first page");
                    cy.get(cesc("#pcontrols_previous")).click();
                    cy.get(cesc("#title1")).should("have.text", "Page 1");
                    cy.get(cesc("#section2_title")).should("not.exist");
                    cy.get(cesc("#title2")).should("not.exist");

                    cy.get(answer1Incorrect).should("be.visible");
                    cy.get(mathInput1DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2−");
                        });

                    cy.log("to third page");

                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#title1")).should("not.exist");
                    cy.get(cesc("#section2_title")).should(
                        "have.text",
                        "Section 2",
                    );
                    cy.get(cesc("#title2")).should("not.exist");

                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#title1")).should("not.exist");
                    cy.get(cesc("#section2_title")).should("not.exist");
                    cy.get(cesc("#title2")).should("have.text", "Page 3");

                    cy.get(answer3Incorrect).should("be.visible");
                    cy.get(mathInput3DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2q");
                        });

                    cy.get(answer4Incorrect).should("be.visible");
                    cy.get(mathInput4DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("3");
                        });

                    cy.get(answer2Correct).should("be.visible");
                    cy.get(mathInput2DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2x");
                        });
                    cy.get(cesc("#ca")).should("have.text", "0.25");

                    cy.get(mathInput2Anchor)
                        .type("{end}:", { force: true })
                        .blur();
                    cy.get(answer2Submit).should("be.visible");
                    cy.get(mathInput2DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2x:");
                        });
                    cy.get(cesc("#ca")).should("have.text", "0.25");

                    cy.log("to second page");
                    cy.get(cesc("#pcontrols_previous")).click();
                    cy.get(cesc("#title1")).should("not.exist");
                    cy.get(cesc("#section2_title")).should(
                        "have.text",
                        "Section 2",
                    );
                    cy.get(cesc("#title2")).should("not.exist");

                    cy.log("back to third page");
                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#title1")).should("not.exist");
                    cy.get(cesc("#section2_title")).should("not.exist");
                    cy.get(cesc("#title2")).should("have.text", "Page 3");

                    cy.get(answer2Submit).should("be.visible");
                    cy.get(mathInput2DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2x:");
                        });
                    cy.get(answer3Incorrect).should("be.visible");
                    cy.get(mathInput3DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("2q");
                        });
                    cy.get(answer4Incorrect).should("be.visible");
                    cy.get(mathInput4DisplayAnchor)
                        .invoke("text")
                        .then((text) => {
                            expect(
                                text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                            ).equal("3");
                        });
                    cy.get(cesc("#ca")).should("have.text", "0.25");
                });
            });
        });

        cy.wait(2000); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                return stateVariables[await win.resolvePath1("answer4")];
            }),
        );

        cy.log("on third page without first and second defined");
        cy.get(cesc("#title1")).should("not.exist");
        cy.get(cesc("#section2_title")).should("not.exist");
        cy.get(cesc("#title2")).should("have.text", "Page 3");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let mathInput2Name =
                stateVariables[await win.resolvePath1("answer2")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput2Anchor = cesc("#" + mathInput2Name) + " textarea";
            let mathInput2DisplayAnchor =
                cesc("#" + mathInput2Name) + " .mq-editable-field";
            let answer2Correct = cesc("#" + mathInput2Name + "_correct");
            let answer2Incorrect = cesc("#" + mathInput2Name + "_incorrect");
            let answer2Submit = cesc("#" + mathInput2Name + "_submit");

            let mathInput3Name =
                stateVariables[await win.resolvePath1("answer3")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput3Anchor = cesc("#" + mathInput3Name) + " textarea";
            let mathInput3DisplayAnchor =
                cesc("#" + mathInput3Name) + " .mq-editable-field";
            let answer3Correct = cesc("#" + mathInput3Name + "_correct");
            let answer3Incorrect = cesc("#" + mathInput3Name + "_incorrect");

            let mathInput4Name =
                stateVariables[await win.resolvePath1("answer4")].stateValues
                    .inputChildren[0].componentIdx;
            let mathInput4Anchor = cesc("#" + mathInput4Name) + " textarea";
            let mathInput4DisplayAnchor =
                cesc("#" + mathInput4Name) + " .mq-editable-field";
            let answer4Correct = cesc("#" + mathInput4Name + "_correct");
            let answer4Incorrect = cesc("#" + mathInput4Name + "_incorrect");

            cy.get(answer2Submit).should("be.visible");
            cy.get(mathInput2DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2x:",
                    );
                });
            cy.get(answer3Incorrect).should("be.visible");
            cy.get(mathInput3DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2q",
                    );
                });
            cy.get(answer4Incorrect).should("be.visible");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "3",
                    );
                });
            cy.get(cesc("#ca")).should("have.text", "0.25");

            cy.log("to second page");
            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("have.text", "Section 2");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(cesc("#name_input")).should("have.value", "You");
            cy.get(cesc("#p3")).should("have.text", "Hello, You!");

            cy.get(answer4Incorrect).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.25");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "3",
                    );
                });

            cy.log("back to third page");
            cy.get(cesc("#pcontrols_next")).click();
            cy.get(answer2Submit).should("be.visible");
            cy.get(mathInput2DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2x:",
                    );
                });
            cy.get(answer3Incorrect).should("be.visible");
            cy.get(mathInput3DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "2q",
                    );
                });
            cy.get(answer4Incorrect).should("be.visible");
            cy.get(mathInput4DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        "3",
                    );
                });
            cy.get(cesc("#ca")).should("have.text", "0.25");

            cy.log("to first page");
            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#title1")).should("not.exist");
            cy.get(cesc("#section2_title")).should("have.text", "Section 2");
            cy.get(cesc("#title2")).should("not.exist");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#title1")).should("have.text", "Page 1");
            cy.get(cesc("#section2_title")).should("not.exist");
            cy.get(cesc("#title2")).should("not.exist");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let mathInput1Name =
                    stateVariables[await win.resolvePath1("answer1")]
                        .stateValues.inputChildren[0].componentIdx;
                let mathInput1Anchor = cesc("#" + mathInput1Name) + " textarea";
                let mathInput1DisplayAnchor =
                    cesc("#" + mathInput1Name) + " .mq-editable-field";
                let answer1Correct = cesc("#" + mathInput1Name + "_correct");
                let answer1Incorrect = cesc(
                    "#" + mathInput1Name + "_incorrect",
                );

                cy.get(answer1Incorrect).should("be.visible");
                cy.get(mathInput1DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2−");
                    });
                cy.get(cesc("#ca")).should("have.text", "0.25");

                cy.get(answer4Incorrect).should("be.visible");
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("3");
                    });
            });
        });
    });

    it("With weights", () => {
        let doenetML = `
    <text name="a">a</text>
  
    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <problem name="problem1">
        <answer name="answer1" type="text">a</answer>
      </problem>
      <problem name="problem2" weight="2">
        <answer name="answer2" type="text">b</answer>
      </problem>
      <problem name="problem3" weight="3">
        <answer name="answer3" type="text">c</answer>
      </problem>
    </paginator>
  
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
  
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let textInput1Name =
                stateVariables[await win.resolvePath1("answer1")].stateValues
                    .inputChildren[0].componentIdx;
            let textInput1Anchor = cesc("#" + textInput1Name) + "_input";
            let textInput1DisplayAnchor =
                cesc("#" + textInput1Name) + " .mq-editable-field";
            let answer1Submit = cesc("#" + textInput1Name + "_submit");
            let answer1Correct = cesc("#" + textInput1Name + "_correct");
            let answer1Incorrect = cesc("#" + textInput1Name + "_incorrect");

            cy.get(cesc("#problem1_title")).should("have.text", "Problem 1");

            cy.get(cesc("#ca")).should("have.text", "0");

            cy.get(textInput1Anchor).type("a{enter}");

            cy.get(answer1Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.167");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem2_title")).should("have.text", "Problem 2");
            cy.get(cesc("#ca")).should("have.text", "0.167");

            cy.wait(200);

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let textInput2Name =
                    stateVariables[await win.resolvePath1("answer2")]
                        .stateValues.inputChildren[0].componentIdx;
                let textInput2Anchor = cesc("#" + textInput2Name) + "_input";
                let textInput2DisplayAnchor =
                    cesc("#" + textInput2Name) + " .mq-editable-field";
                let answer2Submit = cesc("#" + textInput2Name + "_submit");
                let answer2Correct = cesc("#" + textInput2Name + "_correct");
                let answer2Incorrect = cesc(
                    "#" + textInput2Name + "_incorrect",
                );

                cy.get(answer2Submit).should("be.visible");

                cy.get(cesc("#pcontrols_next")).click();
                cy.get(cesc("#problem3_title")).should(
                    "have.text",
                    "Problem 3",
                );
                cy.get(cesc("#ca")).should("have.text", "0.167");

                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();

                    let textInput3Name =
                        stateVariables[await win.resolvePath1("answer3")]
                            .stateValues.inputChildren[0].componentIdx;
                    let textInput3Anchor =
                        cesc("#" + textInput3Name) + "_input";
                    let textInput3DisplayAnchor =
                        cesc("#" + textInput3Name) + " .mq-editable-field";
                    let answer3Submit = cesc("#" + textInput3Name + "_submit");
                    let answer3Correct = cesc(
                        "#" + textInput3Name + "_correct",
                    );
                    let answer3Incorrect = cesc(
                        "#" + textInput3Name + "_incorrect",
                    );

                    cy.get(answer3Submit).should("be.visible");

                    cy.get(cesc("#pcontrols_previous")).click();
                    cy.get(cesc("#problem2_title")).should(
                        "have.text",
                        "Problem 2",
                    );
                    cy.get(cesc("#ca")).should("have.text", "0.167");

                    cy.get(textInput2Anchor).type("b{enter}");

                    cy.get(answer2Correct).should("be.visible");
                    cy.get(cesc("#ca")).should("have.text", "0.5");

                    cy.get(cesc("#pcontrols_previous")).click();
                    cy.get(cesc("#problem1_title")).should(
                        "have.text",
                        "Problem 1",
                    );
                    cy.get(cesc("#ca")).should("have.text", "0.5");

                    cy.get(answer1Correct).should("be.visible");

                    cy.get(textInput1Anchor).clear();
                    cy.get(answer1Correct).should("not.exist");
                    cy.get(textInput1Anchor).type("{enter}");
                    cy.get(answer1Incorrect).should("be.visible");
                    cy.get(cesc("#ca")).should("have.text", "0.333");

                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#problem2_title")).should(
                        "have.text",
                        "Problem 2",
                    );
                    cy.get(cesc("#ca")).should("have.text", "0.333");

                    cy.get(answer2Correct).should("be.visible");

                    cy.get(cesc("#pcontrols_next")).click();
                    cy.get(cesc("#problem3_title")).should(
                        "have.text",
                        "Problem 3",
                    );
                    cy.get(cesc("#ca")).should("have.text", "0.333");

                    cy.get(textInput3Anchor).clear().type("c{enter}");
                    cy.get(answer3Correct).should("be.visible");
                    cy.get(cesc("#ca")).should("have.text", "0.833");

                    cy.get(cesc("#pcontrols_previous")).click();
                    cy.get(cesc("#problem2_title")).should(
                        "have.text",
                        "Problem 2",
                    );
                    cy.get(cesc("#ca")).should("have.text", "0.833");

                    cy.get(answer2Correct).should("be.visible");
                });
            });
        });

        cy.wait(2000); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#a")).should("have.text", "a"); //wait for page to load

        cy.get(cesc("#problem2_title")).should("have.text", "Problem 2");
        cy.get(cesc("#ca")).should("have.text", "0.833");

        cy.get(cesc("#pcontrols_previous")).click();
        cy.get(cesc("#problem1_title")).should("have.text", "Problem 1");
        cy.get(cesc("#ca")).should("have.text", "0.833");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#problem2_title")).should("have.text", "Problem 2");
        cy.get(cesc("#ca")).should("have.text", "0.833");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#problem3_title")).should("have.text", "Problem 3");
        cy.get(cesc("#ca")).should("have.text", "0.833");
    });

    // TODO: enable external copies in our cypress setup?
    it.skip("With external and internal copies", () => {
        let doenetML = `
    <text>a</text>
    <setup>
      <problem name="problema">
        <title>A hard problem</title>
        <p>What is 1+1? <answer><mathInput /><award>2</award></answer></p>
      </problem>
    </setup>

    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <copy name="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
      <copy name="problem2" uri="doenet:CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
      <copy name="problem3" target="$problema" link="false" />
  
    </paginator>
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                    requestedVariantIndex: 3,
                    // for now, at least, variant 3 gives mouse....
                    // subvariants: [{}, {
                    //   name: "mouse"
                    // }]
                },
                "*",
            );
        });

        let choices;

        cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

        cy.get(cesc("#problem1/_title1")).should("have.text", "Animal sounds");
        cy.get(cesc("#ca")).should("have.text", "0");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let correctSound =
                stateVariables[await win.resolvePath1("d")].stateValues.value;

            choices =
                stateVariables[await win.resolvePath1("1")].stateValues
                    .choiceTexts;
            let correctInd = choices.indexOf(correctSound) + 1;
            cy.get(
                cesc(`#problem1/_choiceInput1_choice${correctInd}_input`),
            ).click();
        });

        cy.get(cesc(`#problem1/_choiceInput1_submit`)).click();
        cy.get(cesc(`#problem1/_choiceInput1_correct`)).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.wait(2000); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });
        cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

        // wait until core is loaded
        cy.waitUntil(() =>
            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let foundIt = Boolean(
                    stateVariables[await win.resolvePath1("1")]?.stateValues
                        ?.choiceTexts,
                );
                return foundIt;
            }),
        );

        cy.get(cesc("#problem1/_title1")).should("have.text", "Animal sounds");
        cy.get(cesc(`#problem1/_choiceInput1_correct`)).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInput2Name =
                stateVariables[await win.resolvePath1("1")].stateValues
                    .inputChildren[0].componentIdx;

            let mathInput2Anchor = cesc(`#${mathInput2Name}`) + " textarea";
            let mathInput2Correct = cesc(`#${mathInput2Name}_correct`);

            cy.get(mathInput2Anchor).type("2x{enter}", { force: true });
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem2/_title1")).should(
                "have.text",
                "Derivative problem",
            );
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem3/_title1")).should(
                "have.text",
                "A hard problem",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#problem3/_mathInput1") + " textarea").type(
                "2{enter}",
                {
                    force: true,
                },
            );
            cy.get(cesc("#problem3/_mathInput1_correct")).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#problem3/_title1")).should(
                "have.text",
                "A hard problem",
            );
            cy.get(cesc("#problem3/_mathInput1_correct")).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem2/_title1")).should(
                "have.text",
                "Derivative problem",
            );
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let correctSound =
                    stateVariables[await win.resolvePath1("d")].stateValues
                        .value;
                let incorrectSound =
                    correctSound === "woof" ? "squeak" : "woof";

                let choiceTexts =
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .choiceTexts;
                expect(choiceTexts).eqls(choices);
                let incorrectInd = choices.indexOf(incorrectSound) + 1;
                cy.get(
                    cesc(`#problem1/_choiceInput1_choice${incorrectInd}_input`),
                ).click();
            });

            cy.get(cesc(`#problem1/_choiceInput1_submit`)).click();
            cy.get(cesc(`#problem1/_choiceInput1_incorrect`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();
                let correctSound =
                    stateVariables[await win.resolvePath1("d")].stateValues
                        .value;

                let choiceTexts =
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .choiceTexts;
                expect(choiceTexts).eqls(choices);
                let correctInd = choices.indexOf(correctSound) + 1;
                cy.get(
                    cesc(`#problem1/_choiceInput1_choice${correctInd}_input`),
                ).click();
            });

            cy.get(cesc(`#problem1/_choiceInput1_submit`)).click();
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "1");
        });
    });

    // TODO: if keep this, move to variant tests?
    it.skip("External and internal copies, with variantcontrols in document and problem", () => {
        let doenetML = `
    <text>a</text>
    <variantControl numVariants="100" />
    <setup>
      <problem name="problema">
        <variantControl numVariants="1" />
        <title>A hard problem</title>
        <p>What is 1+1? <answer><mathInput /><award>2</award></answer></p>
      </problem>
    </setup>

    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <copy name="problem1" uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
      <copy name="problem2" uri="doenet:CID=bafkreide4mismb45mxved2ibfh5jnj75kty7vjz7w6zo7goyxpwr2e7wti" />
      <copy name="problem3" target="$problema" link="false" />
  
    </paginator>
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                    requestedVariantIndex: 3,
                },
                "*",
            );
        });

        cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

        cy.get(cesc("#problem1/_title1")).should("have.text", "Animal sounds");
        cy.get(cesc("#ca")).should("have.text", "0");
        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let correctSound =
                stateVariables[await win.resolvePath1("d")].stateValues.value;

            let choices = [
                ...stateVariables[await win.resolvePath1("1")].stateValues
                    .choiceTexts,
            ];
            let correctInd = choices.indexOf(correctSound) + 1;
            cy.get(
                cesc(`#problem1/_choiceInput1_choice${correctInd}_input`),
            ).click();
        });

        cy.get(cesc(`#problem1/_choiceInput1_submit`)).click();
        cy.get(cesc(`#problem1/_choiceInput1_correct`)).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.wait(2000); // wait for 1 second debounce
        cy.reload();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });
        cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

        cy.get(cesc("#problem1/_title1")).should("have.text", "Animal sounds");
        cy.get(cesc(`#problem1/_choiceInput1_correct`)).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#problem2/_title1")).should(
            "have.text",
            "Derivative problem",
        );
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            let mathInput2Name =
                stateVariables[await win.resolvePath1("1")].stateValues
                    .inputChildren[0].componentIdx;

            let mathInput2Anchor = cesc(`#${mathInput2Name}`) + " textarea";
            let mathInput2Correct = cesc(`#${mathInput2Name}_correct`);

            cy.get(mathInput2Anchor).type("2x{enter}", { force: true });
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem2/_title1")).should(
                "have.text",
                "Derivative problem",
            );
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem3/_title1")).should(
                "have.text",
                "A hard problem",
            );
            cy.get(cesc("#ca")).should("have.text", "0.667");

            cy.get(cesc("#problem3/_mathInput1") + " textarea").type(
                "2{enter}",
                {
                    force: true,
                },
            );
            cy.get(cesc("#problem3/_mathInput1_correct")).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.wait(2000); // wait for 1 second debounce
            cy.reload();

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            cy.get(cesc("#problem3/_title1")).should(
                "have.text",
                "A hard problem",
            );
            cy.get(cesc("#problem3/_mathInput1_correct")).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem2/_title1")).should(
                "have.text",
                "Derivative problem",
            );
            cy.get(mathInput2Correct).should("be.visible");
            cy.get(cesc("#ca")).should("have.text", "1");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem1/_title1")).should(
                "have.text",
                "Animal sounds",
            );
            cy.get(cesc(`#problem1/_choiceInput1_correct`)).should(
                "be.visible",
            );
            cy.get(cesc("#ca")).should("have.text", "1");
        });
    });

    it("Paginator controls ignore read only flag", () => {
        let doenetML = `
    <paginatorControls paginator="$pgn" name="pcontrols" />
  
    <paginator name="pgn">
      <problem>
        <title name="title1">Problem 1</title>
        <p>1: <answer type="text"><textInput name="ti1"/><award>1</award></answer></p>
      </problem>
      <problem>
        <title name="title2">Problem 2</title>
        <p>2: <answer type="text"><textInput name="ti2"/><award>2</award></answer></p>
      </problem>
    </paginator>
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
    `;

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#title1")).should("have.text", "Problem 1");

        cy.get(cesc("#ti1_input")).type("1{enter}");
        cy.get(cesc("#ti1_input")).should("have.value", "1");

        cy.get(cesc("#ti1_correct")).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.5");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#title2")).should("have.text", "Problem 2");

        cy.get(cesc("#ti2_input")).type("2");
        cy.get(cesc("#ti2_input")).should("have.value", "2");
        cy.get(cesc("#ti2_submit")).should("be.visible");
        cy.get(cesc("#ca")).should("have.text", "0.5");

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_readOnly").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.get(cesc("#title1")).should("have.text", "Problem 1");

        cy.get(cesc("#ti1_input")).should("be.disabled");
        cy.get(cesc("#ti1_submit")).should("be.disabled");

        cy.get(cesc("#pcontrols_next")).click();
        cy.get(cesc("#title2")).should("have.text", "Problem 2");

        cy.get(cesc("#ti2_input")).should("be.disabled");
        cy.get(cesc("#ti2_submit")).should("be.disabled");

        cy.get(cesc("#pcontrols_previous")).click();
        cy.get(cesc("#title1")).should("have.text", "Problem 1");
        cy.get(cesc("#ti1_input")).should("be.disabled");
        cy.get(cesc("#ti1_submit")).should("be.disabled");
    });

    // TODO: if keep this, move to variant tests?
    it.skip("Variants stay consistent with external copies", () => {
        let doenetMLWithSelects = `
    <text>a</text>
    <paginatorControls paginator="$pgn" name="pcontrols" />

    <paginator name="pgn">
      <select numToSelect="2" assignNames="(problem1) (problem2)">
        <option>
          <problem copyfromuri="doenet:cid=bafkreidheiqnahrf33h6etsqwo26s7w3upl44bra6xtssxm5rmc3osjave" />
        </option>
        <option>
          <problem copyfromuri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" />
        </option>
      </select>    
    </paginator>
    
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        let doenetMLorder1 = `
    <text>a</text>
    <paginatorControls paginator="$pgn" name="pcontrols" />
    <paginator name="pgn">
      <copy uri="doenet:cid=bafkreidheiqnahrf33h6etsqwo26s7w3upl44bra6xtssxm5rmc3osjave" name="problem1" />
      <copy uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" name="problem2" />
    </paginator>
    
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        let doenetMLorder2 = `
    <text>a</text>
    <paginatorControls paginator="$pgn" name="pcontrols" />
    <paginator name="pgn">
      <copy uri="doenet:CID=bafkreifgmyjuw4m6odukznenshkyfupp3egx6ep3jgnlo747d6s5v7nznu" name="problem1" />
      <copy uri="doenet:cid=bafkreidheiqnahrf33h6etsqwo26s7w3upl44bra6xtssxm5rmc3osjave" name="problem2" />
    </paginator>
    
    <p>Credit achieved: $_document1.creditAchieved{assignNames="ca"}</p>
    `;

        let allDoenetMLs = [
            doenetMLorder1,
            doenetMLorder2,
            doenetMLWithSelects,
            doenetMLWithSelects,
            doenetMLWithSelects,
            doenetMLWithSelects,
        ];

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(1000);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: allDoenetMLs[0],
                    requestedVariantIndex: 1,
                },
                "*",
            );
        });

        for (let attemptNumber = 1; attemptNumber <= 6; attemptNumber++) {
            if (attemptNumber > 1) {
                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            requestedVariantIndex: attemptNumber,
                        },
                        "*",
                    );
                });

                cy.get("#testRunner_toggleControls").click();
                cy.get("#testRunner_newAttempt").click();
                cy.get("#testRunner_toggleControls").click();

                cy.wait(1000);

                cy.reload();

                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: allDoenetMLs[attemptNumber - 1],
                            requestedVariantIndex: attemptNumber,
                        },
                        "*",
                    );
                });
                cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load
            }

            let problemInfo = [{}, {}];
            let problemOrder;

            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                expect(
                    stateVariables[await win.resolvePath1("1")].stateValues
                        .generatedVariantInfo.index,
                ).eq(attemptNumber);

                if (stateVariables[await win.resolvePath1("a")]) {
                    problemOrder = [1, 2];
                } else {
                    problemOrder = [2, 1];
                }

                let creditAchieved = 0;

                for (let ind = 0; ind < 2; ind++) {
                    if (ind === 1) {
                        cy.get(cesc("#pcontrols_next")).click();
                    }

                    cy.wait(0).then((_) => {
                        cy.get(cesc("#ca")).should(
                            "have.text",
                            `${creditAchieved}`,
                        );

                        let thisProbInfo = problemInfo[ind];
                        let thisProbName = `/problem${ind + 1}`;

                        if (problemOrder[ind] === 1) {
                            cy.get(cesc(`#${thisProbName}_title`)).should(
                                "have.text",
                                `Problem ${ind + 1}`,
                            );
                            cy.wait(10);

                            cy.window().then(async (win) => {
                                let stateVariables =
                                    await win.returnAllStateVariables1();

                                thisProbInfo.a =
                                    stateVariables[
                                        `${thisProbName}/a`
                                    ].stateValues.value;
                                thisProbInfo.v =
                                    stateVariables[
                                        `${thisProbName}/v`
                                    ].stateValues.value;
                                thisProbInfo.o1m = me.fromAst(
                                    stateVariables[`${thisProbName}/o1/m`]
                                        .stateValues.value,
                                );
                                thisProbInfo.o1t =
                                    stateVariables[
                                        `${thisProbName}/o1/t`
                                    ].stateValues.value;
                                thisProbInfo.o2m = me.fromAst(
                                    stateVariables[`${thisProbName}/o2/m`]
                                        .stateValues.value,
                                );
                                thisProbInfo.o2t =
                                    stateVariables[
                                        `${thisProbName}/o2/t`
                                    ].stateValues.value;

                                let mathInput1Name =
                                    stateVariables[`${thisProbName}/ans1`]
                                        .stateValues.inputChildren[0]
                                        .componentIdx;
                                let mathInput1Anchor =
                                    cesc("#" + mathInput1Name) + " textarea";
                                let answer1Correct = cesc(
                                    "#" + mathInput1Name + "_correct",
                                );

                                let mathInput2Name =
                                    stateVariables[`${thisProbName}/ans2`]
                                        .stateValues.inputChildren[0]
                                        .componentIdx;
                                let mathInput2Anchor =
                                    cesc("#" + mathInput2Name) + " textarea";
                                let answer2Correct = cesc(
                                    "#" + mathInput2Name + "_correct",
                                );

                                let textInput3Name =
                                    stateVariables[`${thisProbName}/ans3`]
                                        .stateValues.inputChildren[0]
                                        .componentIdx;
                                let textInput3Anchor =
                                    cesc("#" + textInput3Name) + "_input";
                                let answer3Correct = cesc(
                                    "#" + textInput3Name + "_correct",
                                );

                                let mathInput4Name =
                                    stateVariables[`${thisProbName}/ans4`]
                                        .stateValues.inputChildren[0]
                                        .componentIdx;
                                let mathInput4Anchor =
                                    cesc("#" + mathInput4Name) + " textarea";
                                let answer4Correct = cesc(
                                    "#" + mathInput4Name + "_correct",
                                );

                                let textInput5Name =
                                    stateVariables[`${thisProbName}/ans5`]
                                        .stateValues.inputChildren[0]
                                        .componentIdx;
                                let textInput5Anchor =
                                    cesc("#" + textInput5Name) + "_input";
                                let answer5Correct = cesc(
                                    "#" + textInput5Name + "_correct",
                                );

                                cy.get(mathInput1Anchor).type(
                                    `${
                                        thisProbInfo.a
                                    }${thisProbInfo.v.toString()}{enter}`,
                                    { force: true },
                                );
                                cy.get(answer1Correct).should("be.visible");

                                cy.get(mathInput2Anchor).type(
                                    `${thisProbInfo.o1m.toString()}{enter}`,
                                    { force: true },
                                );
                                cy.get(answer2Correct).should("be.visible");

                                cy.get(textInput3Anchor).type(
                                    `${thisProbInfo.o1t}{enter}`,
                                );
                                cy.get(answer3Correct).should("be.visible");

                                cy.get(mathInput4Anchor).type(
                                    `${thisProbInfo.o2m.toString()}{enter}`,
                                    { force: true },
                                );
                                cy.get(answer4Correct).should("be.visible");

                                cy.get(textInput5Anchor).type(
                                    `${thisProbInfo.o2t}{enter}`,
                                );
                                cy.get(answer5Correct).should("be.visible");
                            });
                        } else {
                            cy.get(cesc(`#${thisProbName}_title`)).should(
                                "have.text",
                                `Animal sounds`,
                            );
                            cy.wait(10);

                            cy.window().then(async (win) => {
                                let stateVariables =
                                    await win.returnAllStateVariables1();

                                thisProbInfo.animal =
                                    stateVariables[
                                        `${thisProbName}/animal`
                                    ].stateValues.value;
                                thisProbInfo.sound =
                                    stateVariables[
                                        `${thisProbName}/sound`
                                    ].stateValues.value;

                                thisProbInfo.choices = [
                                    ...stateVariables[
                                        `${thisProbName}/_choiceInput1`
                                    ].stateValues.choiceTexts,
                                ];
                                thisProbInfo.animalInd =
                                    thisProbInfo.choices.indexOf(
                                        thisProbInfo.sound,
                                    ) + 1;
                                cy.get(
                                    cesc(
                                        `#${thisProbName}/_choiceInput1_choice${thisProbInfo.animalInd}_input`,
                                    ),
                                ).click();

                                cy.get(
                                    cesc(
                                        `#${thisProbName}/_choiceInput1_submit`,
                                    ),
                                ).click();
                                cy.get(
                                    cesc(
                                        `#${thisProbName}/_choiceInput1_correct`,
                                    ),
                                ).should("be.visible");
                            });
                        }

                        creditAchieved += 0.5;
                    });
                }
            });

            cy.wait(2000); // wait for 1 second debounce

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
      <text>b</text>
      `,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "b"); //wait for page to load

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: allDoenetMLs[attemptNumber - 1],
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            // wait until core is loaded
            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let foundIt = Boolean(
                        stateVariables[await win.resolvePath1("1")],
                    );
                    return foundIt;
                }),
            );

            for (let ind = 1; ind >= 0; ind--) {
                if (ind === 0) {
                    cy.get(cesc("#pcontrols_previous")).click();
                }

                cy.wait(0).then((_) => {
                    cy.get(cesc("#ca")).should("have.text", `1`);

                    let thisProbInfo = problemInfo[ind];
                    let thisProbName = `/problem${ind + 1}`;

                    if (problemOrder[ind] === 1) {
                        cy.get(cesc(`#${thisProbName}_title`)).should(
                            "have.text",
                            `Problem ${ind + 1}`,
                        );
                        cy.wait(10);

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();

                            expect(
                                stateVariables[
                                    `${thisProbName}/a`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.a.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/v`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.v.toString());
                            expect(
                                me
                                    .fromAst(
                                        stateVariables[`${thisProbName}/o1/m`]
                                            .stateValues.value,
                                    )
                                    .toString(),
                            ).eq(thisProbInfo.o1m.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/o1/t`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.o1t.toString());
                            expect(
                                me
                                    .fromAst(
                                        stateVariables[`${thisProbName}/o2/m`]
                                            .stateValues.value,
                                    )
                                    .toString(),
                            ).eq(thisProbInfo.o2m.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/o2/t`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.o2t.toString());

                            let mathInput1Name =
                                stateVariables[`${thisProbName}/ans1`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer1Correct = cesc(
                                "#" + mathInput1Name + "_correct",
                            );

                            let mathInput2Name =
                                stateVariables[`${thisProbName}/ans2`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer2Correct = cesc(
                                "#" + mathInput2Name + "_correct",
                            );

                            let textInput3Name =
                                stateVariables[`${thisProbName}/ans3`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer3Correct = cesc(
                                "#" + textInput3Name + "_correct",
                            );

                            let mathInput4Name =
                                stateVariables[`${thisProbName}/ans4`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer4Correct = cesc(
                                "#" + mathInput4Name + "_correct",
                            );

                            let textInput5Name =
                                stateVariables[`${thisProbName}/ans5`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer5Correct = cesc(
                                "#" + textInput5Name + "_correct",
                            );

                            cy.get(answer1Correct).should("be.visible");

                            cy.get(answer2Correct).should("be.visible");

                            cy.get(answer3Correct).should("be.visible");

                            cy.get(answer4Correct).should("be.visible");

                            cy.get(answer5Correct).should("be.visible");
                        });
                    } else {
                        cy.get(cesc(`#${thisProbName}_title`)).should(
                            "have.text",
                            `Animal sounds`,
                        );
                        cy.get(
                            cesc(`#${thisProbName}/_choiceInput1_correct`),
                        ).should("be.visible");

                        cy.wait(10);

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();

                            expect(
                                stateVariables[`${thisProbName}/animal`]
                                    .stateValues.value,
                            ).eq(thisProbInfo.animal);
                            expect(
                                stateVariables[`${thisProbName}/sound`]
                                    .stateValues.value,
                            ).eq(thisProbInfo.sound);
                            expect(
                                stateVariables[`${thisProbName}/_choiceInput1`]
                                    .stateValues.choiceTexts,
                            ).eqls(thisProbInfo.choices);
                            expect(
                                thisProbInfo.choices.indexOf(
                                    thisProbInfo.sound,
                                ) + 1,
                            ).eq(thisProbInfo.animalInd);
                            cy.get(
                                cesc(`#${thisProbName}/_choiceInput1_correct`),
                            ).should("be.visible");
                        });
                    }
                });
            }

            cy.wait(2000); // wait for 1 second debounce

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: `
      <text>b</text>
      `,
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "b"); //wait for page to load

            cy.window().then(async (win) => {
                win.postMessage(
                    {
                        doenetML: allDoenetMLs[attemptNumber - 1],
                    },
                    "*",
                );
            });
            cy.get(cesc("#text1")).should("have.text", "a"); //wait for page to load

            // wait until core is loaded
            cy.waitUntil(() =>
                cy.window().then(async (win) => {
                    let stateVariables = await win.returnAllStateVariables1();
                    let foundIt = Boolean(
                        stateVariables[await win.resolvePath1("1")],
                    );
                    return foundIt;
                }),
            );

            for (let ind = 0; ind < 2; ind++) {
                if (ind === 1) {
                    cy.get(cesc("#pcontrols_next")).click();
                }

                cy.wait(0).then((_) => {
                    cy.get(cesc("#ca")).should("have.text", `1`);

                    let thisProbInfo = problemInfo[ind];
                    let thisProbName = `/problem${ind + 1}`;

                    if (problemOrder[ind] === 1) {
                        cy.get(cesc(`#${thisProbName}_title`)).should(
                            "have.text",
                            `Problem ${ind + 1}`,
                        );
                        cy.wait(10);

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();

                            expect(
                                stateVariables[
                                    `${thisProbName}/a`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.a.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/v`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.v.toString());
                            expect(
                                me
                                    .fromAst(
                                        stateVariables[`${thisProbName}/o1/m`]
                                            .stateValues.value,
                                    )
                                    .toString(),
                            ).eq(thisProbInfo.o1m.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/o1/t`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.o1t.toString());
                            expect(
                                me
                                    .fromAst(
                                        stateVariables[`${thisProbName}/o2/m`]
                                            .stateValues.value,
                                    )
                                    .toString(),
                            ).eq(thisProbInfo.o2m.toString());
                            expect(
                                stateVariables[
                                    `${thisProbName}/o2/t`
                                ].stateValues.value.toString(),
                            ).eq(thisProbInfo.o2t.toString());

                            let mathInput1Name =
                                stateVariables[`${thisProbName}/ans1`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer1Correct = cesc(
                                "#" + mathInput1Name + "_correct",
                            );

                            let mathInput2Name =
                                stateVariables[`${thisProbName}/ans2`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer2Correct = cesc(
                                "#" + mathInput2Name + "_correct",
                            );

                            let textInput3Name =
                                stateVariables[`${thisProbName}/ans3`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer3Correct = cesc(
                                "#" + textInput3Name + "_correct",
                            );

                            let mathInput4Name =
                                stateVariables[`${thisProbName}/ans4`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer4Correct = cesc(
                                "#" + mathInput4Name + "_correct",
                            );

                            let textInput5Name =
                                stateVariables[`${thisProbName}/ans5`]
                                    .stateValues.inputChildren[0].componentIdx;
                            let answer5Correct = cesc(
                                "#" + textInput5Name + "_correct",
                            );

                            cy.get(answer1Correct).should("be.visible");

                            cy.get(answer2Correct).should("be.visible");

                            cy.get(answer3Correct).should("be.visible");

                            cy.get(answer4Correct).should("be.visible");

                            cy.get(answer5Correct).should("be.visible");
                        });
                    } else {
                        cy.get(cesc(`#${thisProbName}_title`)).should(
                            "have.text",
                            `Animal sounds`,
                        );
                        cy.get(
                            cesc(`#${thisProbName}/_choiceInput1_correct`),
                        ).should("be.visible");

                        cy.wait(10);

                        cy.window().then(async (win) => {
                            let stateVariables =
                                await win.returnAllStateVariables1();

                            expect(
                                stateVariables[`${thisProbName}/animal`]
                                    .stateValues.value,
                            ).eq(thisProbInfo.animal);
                            expect(
                                stateVariables[`${thisProbName}/sound`]
                                    .stateValues.value,
                            ).eq(thisProbInfo.sound);
                            expect(
                                stateVariables[`${thisProbName}/_choiceInput1`]
                                    .stateValues.choiceTexts,
                            ).eqls(thisProbInfo.choices);
                            expect(
                                thisProbInfo.choices.indexOf(
                                    thisProbInfo.sound,
                                ) + 1,
                            ).eq(thisProbInfo.animalInd);
                            cy.get(
                                cesc(`#${thisProbName}/_choiceInput1_correct`),
                            ).should("be.visible");
                        });
                    }
                });
            }
        }
    });

    it("Conditional content data is saved", () => {
        let doenetML = `
    <paginatorControls paginator="$pgn" name="pcontrols" />

    <paginator name="pgn">

    <problem name="problem1">

      <setup>
        <selectFromSequence from="1" to="2" name="n" />
      </setup>

      <conditionalContent name="cc">
        <case condition="$n=1">
        <p>Answer x: <answer name="answer">x</answer></p>
        </case>
        <case condition="$n=2">
        <p>Answer y: <answer name="answer">y</answer></p>
        </case>
      </conditionalContent>
      
      <conditionalContent condition="$n=1" name="cc1">
        <p>Answer 2x: <answer name="a">2x</answer></p>
      </conditionalContent>
      <conditionalContent condition="$n=2" name="cc2">
        <p>Answer 2y: <answer name="a">2y</answer></p>
      </conditionalContent>
    </problem>
    
    <problem name="problem2">
    
      <setup>
        <number name="n">1</number>
      </setup>
      
      <conditionalContent name="cc1">
        <case condition="$n=1">
        <p>Answer 1: <answer name="answer">1</answer></p>
        </case>
        <else>
        <p>Answer 1b: <answer name="answer">1b</answer></p>
        </else>
      </conditionalContent>
      
      <conditionalContent condition="$n=1" name="cc2">
        <p>Answer 2: <answer name="answer">2</answer></p>
      </conditionalContent>
    
    </problem>
    </paginator>
    
    <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
  
    `;

        cy.get("#testRunner_toggleControls").click();
        cy.get("#testRunner_allowLocalState").click();
        cy.wait(100);
        cy.get("#testRunner_toggleControls").click();

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML,
                },
                "*",
            );
        });

        cy.get(cesc("#problem1_title")).should("have.text", "Problem 1");
        cy.get(cesc("#ca")).should("have.text", "0");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();

            let n =
                stateVariables[await win.resolvePath1("problem1.n[1]")]
                    .stateValues.value;

            let mathInput1Name =
                stateVariables[await win.resolvePath1(`problem1.cc.answer`)]
                    .stateValues.inputChildren[0].componentIdx;
            let mathInput1Anchor = cesc("#" + mathInput1Name) + " textarea";
            let mathInput1DisplayAnchor =
                cesc("#" + mathInput1Name) + " .mq-editable-field";
            let answer1Correct = cesc("#" + mathInput1Name + "_correct");
            let answer1Submit = cesc("#" + mathInput1Name + "_submit");

            let mathInput2Name =
                stateVariables[await win.resolvePath1(`problem1.cc${n}.a`)]
                    .stateValues.inputChildren[0].componentIdx;
            let mathInput2Anchor = cesc("#" + mathInput2Name) + " textarea";
            let mathInput2DisplayAnchor =
                cesc("#" + mathInput2Name) + " .mq-editable-field";
            let answer2Correct = cesc("#" + mathInput2Name + "_correct");
            let answer2Submit = cesc("#" + mathInput2Name + "_submit");

            let correctAnswer = n === 1 ? "x" : "y";

            cy.get(mathInput1Anchor).type(`${correctAnswer}`, { force: true });
            cy.get(mathInput1DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        correctAnswer,
                    );
                });
            cy.get(answer1Submit).click();

            cy.get(cesc("#ca")).should("have.text", "0.25");

            cy.get(mathInput2Anchor).type(`2${correctAnswer}`, { force: true });
            cy.get(mathInput2DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        `2${correctAnswer}`,
                    );
                });
            cy.get(answer2Submit).click();

            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem2_title")).should("have.text", "Problem 2");
            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(cesc("#pcontrols_previous")).click();
            cy.get(cesc("#problem1_title")).should("have.text", "Problem 1");
            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.get(mathInput1DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        correctAnswer,
                    );
                });
            cy.get(answer1Correct).should("be.visible");

            cy.get(mathInput2DisplayAnchor)
                .invoke("text")
                .then((text) => {
                    expect(text.replace(/[\s\u200B-\u200D\uFEFF]/g, "")).equal(
                        `2${correctAnswer}`,
                    );
                });
            cy.get(answer2Correct).should("be.visible");

            cy.get(cesc("#pcontrols_next")).click();
            cy.get(cesc("#problem2_title")).should("have.text", "Problem 2");
            cy.get(cesc("#ca")).should("have.text", "0.5");

            cy.window().then(async (win) => {
                let stateVariables = await win.returnAllStateVariables1();

                let mathInput3Name =
                    stateVariables[
                        await win.resolvePath1(`problem2.cc1.answer`)
                    ].stateValues.inputChildren[0].componentIdx;
                let mathInput3Anchor = cesc("#" + mathInput3Name) + " textarea";
                let mathInput3DisplayAnchor =
                    cesc("#" + mathInput3Name) + " .mq-editable-field";
                let answer3Correct = cesc("#" + mathInput3Name + "_correct");

                let mathInput4Name =
                    stateVariables[
                        await win.resolvePath1(`problem2.cc2.answer`)
                    ].stateValues.inputChildren[0].componentIdx;
                let mathInput4Anchor = cesc("#" + mathInput4Name) + " textarea";
                let mathInput4DisplayAnchor =
                    cesc("#" + mathInput4Name) + " .mq-editable-field";
                let answer4Correct = cesc("#" + mathInput4Name + "_correct");

                cy.get(mathInput3Anchor).type(`1{enter}`, { force: true });
                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("1");
                    });
                cy.get(answer3Correct).should("be.visible");

                cy.get(cesc("#ca")).should("have.text", "0.75");

                cy.get(mathInput4Anchor).type(`2{enter}`, { force: true });
                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2");
                    });
                cy.get(answer4Correct).should("be.visible");

                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(cesc("#pcontrols_previous")).click();
                cy.get(cesc("#problem1_title")).should(
                    "have.text",
                    "Problem 1",
                );
                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(mathInput1DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal(correctAnswer);
                    });
                cy.get(answer1Correct).should("be.visible");

                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal(`2${correctAnswer}`);
                    });
                cy.get(answer2Correct).should("be.visible");

                cy.get(cesc("#pcontrols_next")).click();
                cy.get(cesc("#problem2_title")).should(
                    "have.text",
                    "Problem 2",
                );
                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("1");
                    });
                cy.get(answer3Correct).should("be.visible");

                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2");
                    });
                cy.get(answer4Correct).should("be.visible");

                cy.get(cesc("#ca")).should("have.text", "1");

                cy.wait(2000); // wait for 1 second debounce

                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML: "<text name='b'>b</text>",
                        },
                        "*",
                    );
                });

                cy.get(cesc("#b")).should("have.text", "b"); //wait for page to load

                cy.window().then(async (win) => {
                    win.postMessage(
                        {
                            doenetML,
                        },
                        "*",
                    );
                });

                cy.get(cesc("#problem2_title")).should(
                    "have.text",
                    "Problem 2",
                );
                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(mathInput3DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("1");
                    });
                cy.get(answer3Correct).should("be.visible");

                cy.get(mathInput4DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal("2");
                    });
                cy.get(answer4Correct).should("be.visible");

                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(cesc("#pcontrols_previous")).click();
                cy.get(cesc("#problem1_title")).should(
                    "have.text",
                    "Problem 1",
                );
                cy.get(cesc("#ca")).should("have.text", "1");

                cy.get(mathInput1DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal(correctAnswer);
                    });
                cy.get(answer1Correct).should("be.visible");

                cy.get(mathInput2DisplayAnchor)
                    .invoke("text")
                    .then((text) => {
                        expect(
                            text.replace(/[\s\u200B-\u200D\uFEFF]/g, ""),
                        ).equal(`2${correctAnswer}`);
                    });
                cy.get(answer2Correct).should("be.visible");
            });
        });
    });
});
